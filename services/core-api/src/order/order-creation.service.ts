// ============================================================================
// QUALITY GADGETS RD - BACKEND: PROCESAMIENTO ACID DE ÓRDENES INMUTABLES
// Snapshot histórico de precios, ITBIS (18%), SKUs y deducción física
// ============================================================================

export interface CreateOrderDTO {
  cartId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    addressLine1: string;
    province: string;
    municipality: string;
    postalCode?: string;
    deliveryNotes?: string;
  };
  currency: 'DOP' | 'USD';
  paymentGateway: 'stripe' | 'cardnet' | 'azul' | 'cash_on_delivery';
  paymentTransactionId: string;
}

export class OrderCreationService {
  /**
   * Ejecuta la transacción de compra inmutable en PostgreSQL
   */
  async createImmutableOrder(pgPoolClient: any, dto: CreateOrderDTO): Promise<{ orderId: string; orderNumber: string }> {
    try {
      await pgPoolClient.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');

      // 1. Obtener y bloquear carrito
      const cartResult = await pgPoolClient.query(
        `SELECT * FROM carts WHERE id = $1 FOR UPDATE`,
        [dto.cartId]
      );

      if (cartResult.rows.length === 0) {
        throw new Error('Carrito inexistente o sesión expirada');
      }

      // 2. Obtener items con metadatos del catálogo
      const itemsResult = await pgPoolClient.query(
        `SELECT ci.*, pv.sku, pv.price_dop, pv.price_usd, p.title as product_title
         FROM cart_items ci
         JOIN product_variants pv ON ci.variant_id = pv.id
         JOIN products p ON pv.product_id = p.id
         WHERE ci.cart_id = $1`,
        [dto.cartId]
      );

      if (itemsResult.rows.length === 0) {
        throw new Error('El carrito no contiene artículos para facturar');
      }

      // 3. Cálculos fiscales e inmutables (ITBIS 18% República Dominicana)
      const subtotal = itemsResult.rows.reduce(
        (acc: number, item: any) => acc + Number(item.unit_price) * item.quantity,
        0
      );
      const isFreeShipping = subtotal >= 3500;
      const shippingAmount = isFreeShipping ? 0 : 250;
      const taxAmount = Number(((subtotal * 0.18) / 1.18).toFixed(2));
      const totalAmount = subtotal + shippingAmount;

      const orderNumber = `QG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // 4. Crear registro inmutable de la Orden
      const orderInsert = await pgPoolClient.query(
        `INSERT INTO orders (
          order_number, customer_email, customer_name, customer_phone,
          shipping_address, billing_address, status, payment_status,
          currency, subtotal, tax_amount, shipping_amount, total_amount,
          payment_gateway, payment_transaction_id,
          estimated_delivery_min, estimated_delivery_max
        ) VALUES (
          $1, $2, $3, $4, $5, $5, 'paid', 'captured', $6, $7, $8, $9, $10, $11, $12,
          CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days'
        ) RETURNING id`,
        [
          orderNumber,
          dto.customerEmail,
          dto.customerName,
          dto.customerPhone,
          JSON.stringify(dto.shippingAddress),
          dto.currency,
          subtotal,
          taxAmount,
          shippingAmount,
          totalAmount,
          dto.paymentGateway,
          dto.paymentTransactionId,
        ]
      );

      const orderId = orderInsert.rows[0].id;

      // 5. Crear Snapshots Inmutables de cada artículo y descontar inventario
      for (const item of itemsResult.rows) {
        const lineTotal = Number(item.unit_price) * item.quantity;
        await pgPoolClient.query(
          `INSERT INTO order_items (
            order_id, variant_id, product_title, variant_sku,
            variant_title, unit_price, quantity, total_line_amount
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            orderId,
            item.variant_id,
            item.product_title,
            item.sku,
            item.sku,
            item.unit_price,
            item.quantity,
            lineTotal,
          ]
        );

        // Descontar inventario físico multialmacén
        await pgPoolClient.query(
          `UPDATE inventory_levels 
           SET stocked_quantity = stocked_quantity - $1,
               reserved_quantity = GREATEST(0, reserved_quantity - $1),
               updated_at = NOW()
           WHERE variant_id = $2`,
          [item.quantity, item.variant_id]
        );
      }

      // 6. Limpieza del carrito procesado
      await pgPoolClient.query(`DELETE FROM cart_items WHERE cart_id = $1`, [dto.cartId]);
      await pgPoolClient.query(`DELETE FROM carts WHERE id = $1`, [dto.cartId]);

      await pgPoolClient.query('COMMIT');
      return { orderId, orderNumber };
    } catch (error: any) {
      await pgPoolClient.query('ROLLBACK');
      throw new Error(`Fallo en transacción de orden: ${error.message}`);
    }
  }
}
