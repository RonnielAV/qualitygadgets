import { NextResponse } from 'next/server';
import { saveOrder, StoredOrder } from '@/lib/orders-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, items, currency, subtotal, taxAmount, shippingCost, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'El carrito no contiene artículos válidos' },
        { status: 400 }
      );
    }

    const orderNumber = `QG-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(5)}`;

    const newOrder: StoredOrder = {
      id: orderId,
      orderNumber,
      customerName: formData.fullName || 'Cliente',
      phone: formData.phone || '',
      email: formData.email || '',
      province: formData.province || 'Distrito Nacional',
      address: formData.addressLine1 || '',
      deliveryNotes: formData.deliveryNotes || '',
      paymentMethod: formData.paymentMethod || 'contra_entrega_transferencia',
      selectedBank: formData.selectedBank || 'bhd',
      items: items.map((i: any) => ({
        title: i.title,
        quantity: i.quantity,
        priceDop: i.priceDop,
      })),
      subtotalDop: subtotal,
      shippingCostDop: shippingCost,
      totalDop: totalAmount,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      needFiscalTaxInvoice: formData.needFiscalTaxInvoice || false,
      rncOrCedula: formData.rncOrCedula || '',
    };

    // Guardar en la base de datos de órdenes del servidor para el OMS
    await saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      paymentMethod: formData.paymentMethod,
      selectedBank: formData.selectedBank,
      message: 'Orden creada y registrada exitosamente en el sistema OMS',
    });
  } catch (error: any) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}
