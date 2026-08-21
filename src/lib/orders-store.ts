import fs from 'fs/promises';
import path from 'path';
import { isDbConnected, query } from '@/lib/db';

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  province: string;
  address: string;
  deliveryNotes?: string;
  paymentMethod: 'contra_entrega_transferencia' | 'contra_entrega_efectivo' | 'contra_entrega_billet' | string;
  selectedBank?: string;
  items: { title: string; quantity: number; priceDop: number }[];
  subtotalDop: number;
  shippingCostDop: number;
  totalDop: number;
  status: 'pendiente' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado' | 'unfulfilled' | string;
  createdAt: string;
  needFiscalTaxInvoice?: boolean;
  rncOrCedula?: string;
  courierId?: string;
  trackingNumber?: string;
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
  if (isDbConnected()) {
    try {
      const rows = await query(`
        SELECT 
          id,
          order_number as "orderNumber",
          customer_name as "customerName",
          customer_phone as "phone",
          customer_email as "email",
          province,
          customer_address as "address",
          notes as "deliveryNotes",
          payment_method as "paymentMethod",
          items,
          subtotal_dop as "subtotalDop",
          shipping_cost_dop as "shippingCostDop",
          total_dop as "totalDop",
          status,
          courier_id as "courierId",
          tracking_number as "trackingNumber",
          created_at as "createdAt"
        FROM orders 
        ORDER BY created_at DESC;
      `);

      return rows.map((r) => ({
        ...r,
        subtotalDop: Number(r.subtotalDop),
        shippingCostDop: Number(r.shippingCostDop),
        totalDop: Number(r.totalDop),
        items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error fetching orders from Postgres, fallback to file:', e);
    }
  }

  await ensureOrdersFile();
  try {
    const content = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO orders (
          id, order_number, customer_name, customer_phone, customer_email, customer_address, province, payment_method, subtotal_dop, shipping_cost_dop, total_dop, status, notes, items, courier_id, tracking_number, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          customer_phone = EXCLUDED.customer_phone,
          customer_address = EXCLUDED.customer_address,
          status = EXCLUDED.status,
          courier_id = EXCLUDED.courier_id,
          tracking_number = EXCLUDED.tracking_number,
          updated_at = NOW();`,
        [
          order.id,
          order.orderNumber,
          order.customerName,
          order.phone,
          order.email || '',
          order.address,
          order.province || '',
          order.paymentMethod,
          Number(order.subtotalDop || 0),
          Number(order.shippingCostDop || 0),
          Number(order.totalDop || 0),
          order.status || 'pendiente',
          order.deliveryNotes || '',
          JSON.stringify(order.items || []),
          order.courierId || null,
          order.trackingNumber || null,
        ]
      );
    } catch (e) {
      console.error('Error saving order in Postgres:', e);
    }
  }

  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const updatedOrders = [order, ...currentOrders.filter((o) => o.id !== order.id)];
  await fs.writeFile(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2), 'utf-8').catch(() => {});
  return order;
}

export async function updateOrderStatus(orderId: string, status: StoredOrder['status']): Promise<StoredOrder | null> {
  if (isDbConnected()) {
    try {
      await query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2;', [status, orderId]);
    } catch (e) {
      console.error('Error updating order status in Postgres:', e);
    }
  }

  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const index = currentOrders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  currentOrders[index].status = status;
  await fs.writeFile(ORDERS_FILE, JSON.stringify(currentOrders, null, 2), 'utf-8').catch(() => {});
  return currentOrders[index];
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  if (isDbConnected()) {
    try {
      await query('DELETE FROM orders WHERE id = $1;', [orderId]);
    } catch (e) {
      console.error('Error deleting order in Postgres:', e);
    }
  }

  await ensureOrdersFile();
  const currentOrders = await getAllOrders();
  const filtered = currentOrders.filter((o) => o.id !== orderId);
  if (filtered.length === currentOrders.length) return false;

  await fs.writeFile(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8').catch(() => {});
  return true;
}
