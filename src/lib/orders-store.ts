import fs from 'fs/promises';
import path from 'path';

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  province: string;
  address: string;
  deliveryNotes?: string;
  paymentMethod: 'contra_entrega_transferencia' | 'contra_entrega_efectivo' | 'contra_entrega_billet';
  selectedBank?: string;
  items: { title: string; quantity: number; priceDop: number }[];
  subtotalDop: number;
  shippingCostDop: number;
  totalDop: number;
  status: 'pendiente' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado';
  createdAt: string;
  needFiscalTaxInvoice?: boolean;
  rncOrCedula?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const INITIAL_MOCK_ORDERS: StoredOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'QG-2026-891240',
    customerName: 'Juan Carlos Pérez',
    phone: '8095551234',
    email: 'juan.perez@gmail.com',
    province: 'Distrito Nacional',
    address: 'Av. Winston Churchill #1099, Piantini',
    deliveryNotes: 'Torre Empresarial, Piso 4',
    paymentMethod: 'contra_entrega_transferencia',
    selectedBank: 'bhd',
    items: [{ title: 'iPhone 16 Pro Max Titanium 5G (256GB)', quantity: 1, priceDop: 78500 }],
    subtotalDop: 78500,
    shippingCostDop: 0,
    totalDop: 78500,
    status: 'pendiente',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ord-102',
    orderNumber: 'QG-2026-471920',
    customerName: 'María Rodríguez Santana',
    phone: '8294448899',
    email: 'maria.rd@gmail.com',
    province: 'Santiago',
    address: 'Calle del Sol #45, Los Jardines',
    paymentMethod: 'contra_entrega_efectivo',
    items: [{ title: 'Sony WH-1000XM5 Noise Cancelling Pro', quantity: 1, priceDop: 23500 }],
    subtotalDop: 23500,
    shippingCostDop: 250,
    totalDop: 23750,
    status: 'en_preparacion',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

async function ensureOrdersFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify(INITIAL_MOCK_ORDERS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring orders file:', err);
  }
}

export async function getAllOrders(): Promise<StoredOrder[]> {
  await ensureOrdersFile();
  try {
    const content = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const updatedOrders = [order, ...currentOrders.filter((o) => o.id !== order.id)];
  await fs.writeFile(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2), 'utf-8');
  return order;
}

export async function updateOrderStatus(orderId: string, status: StoredOrder['status']): Promise<StoredOrder | null> {
  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const index = currentOrders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  currentOrders[index].status = status;
  await fs.writeFile(ORDERS_FILE, JSON.stringify(currentOrders, null, 2), 'utf-8');
  return currentOrders[index];
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const filtered = currentOrders.filter((o) => o.id !== orderId);
  if (filtered.length === currentOrders.length) return false;

  await fs.writeFile(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
