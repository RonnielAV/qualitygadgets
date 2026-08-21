// ============================================================================
// QUALITY GADGETS RD - BACKEND: RESERVA ATÓMICA DE STOCK EN REDIS
// Previene sobreventa en picos de demanda y flash sales mediante Lua Scripts
// ============================================================================

export interface StockReservationItem {
  variantId: string;
  quantity: number;
}

export interface StockReservationPayload {
  cartId: string;
  items: StockReservationItem[];
  ttlSeconds?: number; // Por defecto 15 minutos (900 seg)
}

export class InventoryReservationService {
  /**
   * Script Lua ejecutado atómicamente en Redis
   */
  public static readonly LUA_ATOMIC_RESERVATION = `
    local cartId = KEYS[1]
    local ttl = tonumber(ARGV[1])
    local itemsCount = tonumber(ARGV[2])
    
    -- Fase 1: Verificación de disponibilidad de stock
    for i = 1, itemsCount do
      local variantId = ARGV[2 + (i - 1) * 2 + 1]
      local qty = tonumber(ARGV[2 + (i - 1) * 2 + 2])
      local stockKey = "stock:variant:" .. variantId
      local currentStock = tonumber(redis.call('GET', stockKey) or 0)
      
      if currentStock < qty then
        return {0, variantId, currentStock} -- 0 = Fallo por inventario insuficiente
      end
    end
    
    -- Fase 2: Deducción y reserva atómica
    for i = 1, itemsCount do
      local variantId = ARGV[2 + (i - 1) * 2 + 1]
      local qty = tonumber(ARGV[2 + (i - 1) * 2 + 2])
      local stockKey = "stock:variant:" .. variantId
      
      redis.call('DECRBY', stockKey, qty)
      
      local reservationKey = "reservation:" .. cartId .. ":" .. variantId
      redis.call('SETEX', reservationKey, ttl, qty)
    end
    
    return {1, "RESERVED_SUCCESSFULLY"}
  `;

  /**
   * Reserva atómicamente el inventario de múltiples variantes de gadgets
   */
  async reserveCartItems(redisClient: any, payload: StockReservationPayload): Promise<{ success: boolean; message?: string }> {
    const ttl = payload.ttlSeconds || 900;
    const args: (string | number)[] = [ttl, payload.items.length];

    payload.items.forEach((item) => {
      args.push(item.variantId, item.quantity);
    });

    try {
      const result = await redisClient.eval(
        InventoryReservationService.LUA_ATOMIC_RESERVATION,
        1,
        payload.cartId,
        ...args
      );

      if (result[0] === 0) {
        return {
          success: false,
          message: `Stock insuficiente para la variante [${result[1]}]. Disponibles: ${result[2] || 0}`,
        };
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(`Error en reserva Redis: ${error.message}`);
    }
  }

  /**
   * Libera la reserva si el carrito expira o el usuario cancela
   */
  async releaseReservation(redisClient: any, cartId: string, items: StockReservationItem[]): Promise<void> {
    const pipeline = redisClient.pipeline();
    for (const item of items) {
      pipeline.del(`reservation:${cartId}:${item.variantId}`);
      pipeline.incrby(`stock:variant:${item.variantId}`, item.quantity);
    }
    await pipeline.exec();
  }
}
