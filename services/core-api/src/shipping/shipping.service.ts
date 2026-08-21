// ============================================================================
// QUALITY GADGETS RD - BACKEND: MOTOR LOGÍSTICO Y MATRIZ DE ENVÍOS EN RD
// ============================================================================

export interface ShippingCalculationRequest {
  province: string;
  subtotalDop: number;
  totalWeightGrams: number;
}

export interface ShippingOptionResult {
  carrier: string;
  serviceTitle: string;
  costDop: number;
  isFree: boolean;
  minHours: number;
  maxHours: number;
  estimatedDeliveryText: string;
}

export class ShippingService {
  private static readonly PROVINCIAS_METRO = [
    'Distrito Nacional',
    'Santo Domingo Este',
    'Santo Domingo Oeste',
    'Santo Domingo Norte',
  ];

  private static readonly PROVINCIAS_ZONA_NORTE = [
    'Santiago',
    'Puerto Plata',
    'La Vega',
    'Duarte (San Francisco de Macorís)',
    'Espaillat (Moca)',
  ];

  private static readonly PROVINCIAS_ZONA_ESTE = [
    'La Altagracia (Punta Cana / Bávaro / Higüey)',
    'La Romana',
    'San Pedro de Macorís',
  ];

  /**
   * Calcula el costo y tiempo de entrega según la provincia
   */
  calculateShipping(req: ShippingCalculationRequest): ShippingOptionResult {
    const isFree = req.subtotalDop >= 3500;

    // Gran Santo Domingo
    if (ShippingService.PROVINCIAS_METRO.some((p) => req.province.includes(p))) {
      return {
        carrier: 'Flotilla Express Quality Gadgets',
        serviceTitle: 'Entrega Same-Day / 24h Santo Domingo',
        costDop: isFree ? 0 : 200,
        isFree,
        minHours: 12,
        maxHours: 24,
        estimatedDeliveryText: 'Recíbelo en 24 horas laborables en tu puerta',
      };
    }

    // Región Norte / Cibao
    if (ShippingService.PROVINCIAS_ZONA_NORTE.some((p) => req.province.includes(p))) {
      return {
        carrier: 'Metro Pac Express / Caribe Pack',
        serviceTitle: 'Envío Prioritario Cibao',
        costDop: isFree ? 0 : 275,
        isFree,
        minHours: 24,
        maxHours: 48,
        estimatedDeliveryText: 'Recíbelo entre 24 y 48 horas en agencia o domicilio',
      };
    }

    // Región Este / Turística
    if (ShippingService.PROVINCIAS_ZONA_ESTE.some((p) => req.province.includes(p))) {
      return {
        carrier: 'BM Cargo Express',
        serviceTitle: 'Envío Prioritario Zona Este',
        costDop: isFree ? 0 : 300,
        isFree,
        minHours: 24,
        maxHours: 48,
        estimatedDeliveryText: 'Recíbelo en 24-48 horas en Punta Cana / La Romana',
      };
    }

    // Resto del país / Provincias del Sur y Frontera
    return {
      carrier: 'BM Cargo / Aptran',
      serviceTitle: 'Envío Nacional Estándar',
      costDop: isFree ? 0 : 350,
      isFree,
      minHours: 48,
      maxHours: 72,
      estimatedDeliveryText: 'Recíbelo entre 48 y 72 horas laborables',
    };
  }
}
