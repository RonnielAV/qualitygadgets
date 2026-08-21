export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  totalOrders: number;
  totalSpentDop: number;
  segment: 'vip' | 'recurrent' | 'new' | 'inactive';
  lastOrderDate: string;
  notes: string;
}

export interface DraftOrder {
  id: string;
  draftNumber: string;
  customerName: string;
  customerPhone: string;
  items: { title: string; quantity: number; priceDop: number }[];
  totalDop: number;
  channel: 'WhatsApp' | 'Instagram DM' | 'B2B Corporativo' | 'Venta Telefónica';
  paymentLink: string;
  status: 'open' | 'completed';
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  items: string[];
  totalDop: number;
  abandonedAt: string;
  recoveryStatus: 'pending' | 'discount_sent' | 'recovered';
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number; // e.g. 15 for 15% or 500 for 500 DOP
  minSpendDop: number;
  usedCount: number;
  maxUses?: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface InventoryItem {
  sku: string;
  productTitle: string;
  variantTitle: string;
  stocked: number;
  committed: number;
  available: number;
  location: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  publicKey: string;
  secretKey: string;
  scope: 'full_access' | 'read_orders' | 'inventory_sync';
  createdAt: string;
}

export interface WebhookItem {
  id: string;
  url: string;
  event: 'order.created' | 'order.paid' | 'inventory.low_stock' | 'customer.created';
  status: 'active' | 'failing';
  lastDelivery: string;
  latencyMs: number;
}

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '809-555-0192',
    city: 'Santo Domingo',
    province: 'Distrito Nacional',
    totalOrders: 4,
    totalSpentDop: 245000,
    segment: 'vip',
    lastOrderDate: '2026-08-18',
    notes: 'Cliente preferencial. Solicita siempre entrega en Piantini en horario de la tarde.',
  },
  {
    id: 'cust-2',
    name: 'Laura Peña',
    email: 'laura.pena@hotmail.com',
    phone: '829-555-8831',
    city: 'Santiago de los Caballeros',
    province: 'Santiago',
    totalOrders: 2,
    totalSpentDop: 98000,
    segment: 'recurrent',
    lastOrderDate: '2026-08-15',
    notes: 'Confirmación rápida por WhatsApp.',
  },
  {
    id: 'cust-3',
    name: 'Ing. Rafael Batista',
    email: 'rbatista@corporativo.do',
    phone: '809-555-3419',
    city: 'Punta Cana',
    province: 'La Altagracia',
    totalOrders: 1,
    totalSpentDop: 62000,
    segment: 'new',
    lastOrderDate: '2026-08-19',
    notes: 'Solicitó factura fiscal con RNC corporativo.',
  },
];

export const INITIAL_DRAFTS: DraftOrder[] = [
  {
    id: 'draft-1',
    draftNumber: 'DRAFT-104',
    customerName: 'Manuel Santana',
    customerPhone: '809-316-0799',
    items: [{ title: 'DJI Mini 4 Pro Drone 4K', quantity: 1, priceDop: 62000 }],
    totalDop: 62000,
    channel: 'WhatsApp',
    paymentLink: 'https://qualitygadgetsrd.com/checkout/pay/draft-104',
    status: 'open',
    createdAt: '2026-08-20T14:30:00Z',
  },
];

export const INITIAL_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: 'ab-1',
    customerName: 'Gabriela Morales',
    phone: '809-777-1244',
    email: 'gaby.morales@gmail.com',
    items: ['Apple Watch Ultra 2 Titanium'],
    totalDop: 52000,
    abandonedAt: 'Hace 2 horas',
    recoveryStatus: 'pending',
  },
  {
    id: 'ab-2',
    customerName: 'José Luis Valerio',
    phone: '829-333-9012',
    email: 'jvalerio@outlook.com',
    items: ['Sony WH-1000XM5 Pro', 'Cargador Rápido 65W GaN'],
    totalDop: 29500,
    abandonedAt: 'Hace 5 horas',
    recoveryStatus: 'discount_sent',
  },
];

export const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    id: 'disc-1',
    code: 'FUTURO2026',
    type: 'percentage',
    value: 10,
    minSpendDop: 15000,
    usedCount: 38,
    maxUses: 100,
    expiresAt: '2026-12-31',
    status: 'active',
  },
  {
    id: 'disc-2',
    code: 'ENVIOGRATISRD',
    type: 'free_shipping',
    value: 0,
    minSpendDop: 25000,
    usedCount: 112,
    expiresAt: '2026-12-31',
    status: 'active',
  },
];
