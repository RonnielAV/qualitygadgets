import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description?: string;
  icon?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string; // e.g. "Negro / 128GB"
  priceDop: number;
  priceUsd?: number;
  compareAtPriceDop?: number;
  compareAtPriceUsd?: number;
  costPriceDop?: number;
  weightGrams?: number;
  physicalStock: number; // Stock Físico Real en Almacén
  committedStock?: number; // Stock Comprometido (calculado dinámicamente)
  availableStock?: number; // Stock Disponible = physicalStock - committedStock
  imageUrls: string[];
  options: Record<string, string>; // { Color: 'Negro', Capacidad: '128GB' }
}

export interface ProductOption {
  name: string; // e.g. "Color" o "Capacidad"
  values: string[]; // e.g. ["Negro", "Azul"]
}

export interface Product {
  id: string;
  brandId?: string;
  brand?: Brand | string;
  categoryId?: string;
  category?: Category | string;
  title: string;
  handle: string;
  description: string;
  status: 'published' | 'draft' | 'archived';
  thumbnailUrl: string;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isFeatured: boolean;
  isDeal: boolean;
  options: ProductOption[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  sku?: string;
  priceDop: number;
  quantity: number;
  thumbnailUrl?: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  active: boolean;
}

export interface PostSaleCase {
  type?: 'change' | 'return' | '';
  status?: string;
  resolution?: string;
  routeAction?: string;
  formUrl?: string;
  pdfUrl?: string;
  notes?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  email?: string;
  phone?: string;
  province?: string;
  city?: string;
  address?: string;
  items?: OrderItem[];
  subtotalDop?: number;
  shippingDop?: number;
  discountDop?: number;
  totalDop?: number;
  paymentMethod?: 'contra_entrega_transferencia' | 'contra_entrega_efectivo' | 'contra_entrega_billet' | string;
  selectedBank?: 'bhd' | 'banreservas' | 'popular' | 'scotiabank' | string;
  status?:
    | 'pendiente'
    | 'en_preparacion'
    | 'enviado'
    | 'entregado'
    | 'cancelado'
    | 'En Proceso'
    | 'Entregado'
    | 'Pendiente'
    | 'Entrega para otro día'
    | 'Solicitud de cambio recibida'
    | 'Solicitud de devolución recibida'
    | 'Pendiente de recoger'
    | 'Producto recogido'
    | 'Cambio en ruta'
    | 'Devolución en revisión'
    | 'Cambio completado'
    | 'Devolución completada'
    | 'Reembolso pendiente'
    | 'Caso cerrado'
    | 'Cancelado (Devolución)'
    | string;
  trackingNumber?: string;
  carrier?: string;
  courierId?: string;
  courierName?: string;
  courierCost?: number;
  aiCalculated?: boolean;
  deliveryDate?: string;
  shippingPayer?: 'empresa' | 'cliente';
  shippingCharge?: number;
  postSale?: PostSaleCase;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  address?: string;
  totalOrders: number;
  totalSpentDop: number;
  segment: 'vip' | 'recurrent' | 'new' | 'inactive';
  notes?: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minSpendDop: number;
  usedCount: number;
  maxUses?: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface PixelConfig {
  id: string;
  name: 'meta' | 'ga4' | 'tiktok';
  label: string;
  pixelId: string;
  enabled: boolean;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'ahorros' | 'corriente';
  accountNumber: string;
  titularName: string;
  rncCedula: string;
  isDefault: boolean;
  createdAt: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterConfig {
  companyName: string;
  slogan: string;
  address: string;
  phone: string;
  email: string;
  categoryLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  complianceText: string;
  paymentMethods: string[];
  logisticsCouriers: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// ESTADO GLOBAL COMPLETO DE LA APLICACIÓN
interface QualityGadgetsState {
  // Entidades
  brands: Brand[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  couriers: Courier[];
  customers: Customer[];
  discounts: Discount[];
  pixels: PixelConfig[];
  bankAccounts: BankAccount[];
  footerConfig: FooterConfig;
  cart: CartItem[];

  // Acciones Marcas (Brands CRUD)
  addBrand: (brand: Omit<Brand, 'id' | 'slug'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  // Acciones Categorías (Categories CRUD)
  addCategory: (category: Omit<Category, 'id' | 'handle'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Acciones Productos (Products CRUD & Matrix)
  addProduct: (product: Omit<Product, 'id' | 'handle' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteSelectedProducts: (productIds: string[]) => void;
  deleteAllProducts: () => void;
  updatePhysicalStock: (productId: string, variantId: string, newPhysicalStock: number) => void;
  bulkImportProducts: (importedProducts: any[], mode?: 'merge' | 'replace') => { added: number; updated: number };

  // Acciones Pedidos (Orders OMS)
  addOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingInfo?: { trackingNumber?: string; carrier?: string }) => void;
  deleteOrder: (orderId: string) => void;
  bulkUpdateOrderStatus: (orderIds: string[], status: Order['status']) => void;
  deleteSelectedOrders: (orderIds: string[]) => void;
  assignCourierToOrder: (orderId: string, courierId: string) => void;
  bulkAssignCourier: (orderIds: string[], courierId: string) => void;
  updateOrderDeliveryDate: (orderId: string, deliveryDate: string) => void;
  updatePostSale: (orderId: string, postSale: Partial<PostSaleCase>) => void;

  // Acciones Mensajeros (Couriers)
  addCourier: (courier: Omit<Courier, 'id'>) => void;
  updateCourier: (id: string, courier: Partial<Courier>) => void;
  deleteCourier: (id: string) => void;

  // Acciones Clientes (Customers CRM)
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpentDop'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Acciones Marketing & Descuentos
  addDiscount: (discount: Omit<Discount, 'id' | 'usedCount'>) => void;
  updateDiscount: (id: string, discount: Partial<Discount>) => void;
  deleteDiscount: (id: string) => void;
  updatePixel: (id: string, pixelId: string, enabled: boolean) => void;

  // Acciones Cuentas Bancarias
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt'>) => void;
  updateBankAccount: (id: string, account: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;

  // Acciones Footer CMS
  updateFooterConfig: (newConfig: Partial<FooterConfig>) => void;

  // Acciones Carrito
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers de Cálculo en Vivo & Sincronización Nube
  recalculateInventory: () => void;
  syncFromDatabase: () => Promise<void>;
}

// DATOS SEMILLA INICIALES SEGUROS
const INITIAL_BRANDS: Brand[] = [
  { id: 'brand-apple', name: 'Apple', slug: 'apple', description: 'Innovación y diseño premium' },
  { id: 'brand-samsung', name: 'Samsung', slug: 'samsung', description: 'Tecnología Galaxy de vanguardia' },
  { id: 'brand-sony', name: 'Sony', slug: 'sony', description: 'Audio Hi-Fi y sensores profesionales' },
  { id: 'brand-dji', name: 'DJI', slug: 'dji', description: 'Líder mundial en drones y estabilización' },
  { id: 'brand-xiaomi', name: 'Xiaomi', slug: 'xiaomi', description: 'Ecosistema Smarthome inteligente' },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-smartphones', name: 'Smartphones', handle: 'smartphones', icon: 'Smartphone' },
  { id: 'cat-audio', name: 'Audio Pro Hi-Fi', handle: 'audio-pro', icon: 'Headphones' },
  { id: 'cat-wearables', name: 'Wearables & Smartwatch', handle: 'wearables', icon: 'Watch' },
  { id: 'cat-drones', name: 'Drones & Fotografía', handle: 'drones', icon: 'Plane' },
  { id: 'cat-smarthome', name: 'Smarthome & Domótica', handle: 'smarthome', icon: 'Home' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone-16-pro-max',
    brandId: 'brand-apple',
    brand: 'Apple',
    categoryId: 'cat-smartphones',
    category: 'Smartphones',
    title: 'iPhone 16 Pro Max Titanium 256GB',
    handle: 'iphone-16-pro-max-titanium',
    description: 'El smartphone más avanzado con chip A18 Pro, chasis de titanio de grado aeroespacial y botón de control de cámara.',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    ],
    ratingAvg: 4.9,
    ratingCount: 38,
    isFeatured: true,
    isDeal: true,
    options: [
      { name: 'Color', values: ['Titanio Natural', 'Titanio Negro'] },
      { name: 'Almacenamiento', values: ['256GB', '512GB'] },
    ],
    variants: [
      {
        id: 'var-iphone-1',
        productId: 'prod-iphone-16-pro-max',
        sku: 'IPH16PM-NAT-256',
        title: 'Titanio Natural / 256GB',
        priceDop: 78500,
        priceUsd: 1308,
        compareAtPriceDop: 84900,
        compareAtPriceUsd: 1415,
        costPriceDop: 65000,
        physicalStock: 12,
        committedStock: 0,
        availableStock: 12,
        imageUrls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'],
        options: { Color: 'Titanio Natural', Almacenamiento: '256GB' },
      },
      {
        id: 'var-iphone-2',
        productId: 'prod-iphone-16-pro-max',
        sku: 'IPH16PM-BLK-256',
        title: 'Titanio Negro / 256GB',
        priceDop: 78500,
        priceUsd: 1308,
        compareAtPriceDop: 84900,
        compareAtPriceUsd: 1415,
        costPriceDop: 65000,
        physicalStock: 8,
        committedStock: 0,
        availableStock: 8,
        imageUrls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'],
        options: { Color: 'Titanio Negro', Almacenamiento: '256GB' },
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-sony-wh1000xm5',
    brandId: 'brand-sony',
    brand: 'Sony',
    categoryId: 'cat-audio',
    category: 'Audio Pro Hi-Fi',
    title: 'Sony WH-1000XM5 Pro Auriculares Noise Cancelling',
    handle: 'sony-wh-1000xm5-pro',
    description: 'Cancelación de ruido líder en la industria con dos procesadores y 8 micrófonos. Sonido Hi-Res inalámbrico.',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'],
    ratingAvg: 4.8,
    ratingCount: 52,
    isFeatured: true,
    isDeal: false,
    options: [{ name: 'Color', values: ['Negro', 'Plata'] }],
    variants: [
      {
        id: 'var-sony-1',
        productId: 'prod-sony-wh1000xm5',
        sku: 'SONY-XM5-BLK',
        title: 'Negro',
        priceDop: 24500,
        priceUsd: 408,
        compareAtPriceDop: 27900,
        compareAtPriceUsd: 465,
        costPriceDop: 18000,
        physicalStock: 15,
        committedStock: 0,
        availableStock: 15,
        imageUrls: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'],
        options: { Color: 'Negro' },
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-dji-mini-4-pro',
    brandId: 'brand-dji',
    brand: 'DJI',
    categoryId: 'cat-drones',
    category: 'Drones & Fotografía',
    title: 'DJI Mini 4 Pro Drone 4K HDR',
    handle: 'dji-mini-4-pro-drone-4k',
    description: 'Dron ultra ligero de menos de 249g con detección de obstáculos omnidireccional y video vertical en 4K/60fps.',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80'],
    ratingAvg: 4.9,
    ratingCount: 29,
    isFeatured: true,
    isDeal: true,
    options: [{ name: 'Combo', values: ['Standard', 'Fly More Combo Plus'] }],
    variants: [
      {
        id: 'var-dji-1',
        productId: 'prod-dji-mini-4-pro',
        sku: 'DJI-MINI4-STD',
        title: 'Standard',
        priceDop: 62000,
        priceUsd: 1033,
        compareAtPriceDop: 68500,
        compareAtPriceUsd: 1141,
        costPriceDop: 49000,
        physicalStock: 6,
        committedStock: 0,
        availableStock: 6,
        imageUrls: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80'],
        options: { Combo: 'Standard' },
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-bhd',
    bankName: 'Banco BHD',
    accountType: 'ahorros',
    accountNumber: '20733250038',
    titularName: 'Ronniel Aybar Vessuup',
    rncCedula: '001-0000000-0',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bank-banreservas',
    bankName: 'BanReservas',
    accountType: 'ahorros',
    accountNumber: '9606273048',
    titularName: 'Ronniel Aybar Vessuup',
    rncCedula: '001-0000000-0',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bank-popular',
    bankName: 'Banco Popular Dominicano',
    accountType: 'ahorros',
    accountNumber: '843022187',
    titularName: 'Ronniel Aybar Vessuup',
    rncCedula: '001-0000000-0',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_FOOTER_CONFIG: FooterConfig = {
  companyName: 'QUALITY GADGETS RD',
  slogan: 'El futuro en tus manos: Tecnología premium al alcance de un clic en RD.',
  address: 'Piantini, Santo Domingo, D.N.',
  phone: '+1 (809) 316-0799',
  email: 'contacto@qualitygadgetsrd.com',
  categoryLinks: [
    { id: 'fl-1', label: 'Smartphones & Pro 5G', url: '/productos?categoria=smartphones' },
    { id: 'fl-2', label: 'Audio Hi-Fi & Noise Cancelling', url: '/productos?categoria=audio-pro' },
    { id: 'fl-3', label: 'Wearables & Smartwatches', url: '/productos?categoria=wearables' },
    { id: 'fl-4', label: 'Drones & Cámaras 4K', url: '/productos?categoria=drones' },
    { id: 'fl-5', label: 'Smarthome & Domótica', url: '/productos?categoria=smarthome' },
  ],
  customerServiceLinks: [
    { id: 'fc-1', label: 'Seguimiento de Envíos', url: '/checkout' },
    { id: 'fc-2', label: 'Garantías y Políticas RMA (1 Año)', url: '/productos' },
    { id: 'fc-3', label: 'Facturación Fiscal con NCF', url: '/checkout' },
    { id: 'fc-4', label: 'Términos, Privacidad & Garantía', url: '/productos' },
  ],
  complianceText: 'Cumplimiento PCI-DSS Nivel 1. Aceptamos tarjetas dominicanas e internacionales, Apple Pay, transferencias bancarias locales y pago contra entrega.',
  paymentMethods: ['Cardnet', 'Azul', 'Stripe', 'Apple Pay', 'BHD', 'BanReservas', 'Banco Popular'],
  logisticsCouriers: ['Metro Pac', 'BM Cargo', 'Caribe Pack', 'Vimenpaq', 'Delivery Express SD'],
};

const INITIAL_DISCOUNTS_DATA: Discount[] = [
  {
    id: 'disc-1',
    code: 'FUTURO2026',
    type: 'percentage',
    value: 10,
    minSpendDop: 15000,
    usedCount: 14,
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
    usedCount: 42,
    expiresAt: '2026-12-31',
    status: 'active',
  },
];

const INITIAL_CUSTOMERS_DATA: Customer[] = [
  {
    id: 'cust-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '809-555-0192',
    city: 'Santo Domingo',
    province: 'Distrito Nacional',
    address: 'Av. Winston Churchill #104, Piantini',
    totalOrders: 4,
    totalSpentDop: 245000,
    segment: 'vip',
    notes: 'Cliente preferencial. Entrega en horario de la tarde.',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'cust-2',
    name: 'Laura Peña',
    email: 'laura.pena@hotmail.com',
    phone: '829-555-8831',
    city: 'Santiago de los Caballeros',
    province: 'Santiago',
    address: 'Calle del Sol #45',
    totalOrders: 2,
    totalSpentDop: 98000,
    segment: 'recurrent',
    notes: 'Confirmación rápida por WhatsApp.',
    createdAt: '2026-08-14T15:30:00Z',
  },
];

const INITIAL_PIXELS: PixelConfig[] = [
  { id: 'pix-meta', name: 'meta', label: 'Meta Pixel (Facebook/Instagram)', pixelId: '', enabled: false, updatedAt: new Date().toISOString() },
  { id: 'pix-ga4', name: 'ga4', label: 'Google Analytics 4 (Measurement ID)', pixelId: '', enabled: false, updatedAt: new Date().toISOString() },
  { id: 'pix-tiktok', name: 'tiktok', label: 'TikTok Ads Pixel', pixelId: '', enabled: false, updatedAt: new Date().toISOString() },
];

const INITIAL_COURIERS: Courier[] = [
  { id: 'courier-default', name: 'Mensajero Quality Gadgets RD (Rofanci Encarnación)', phone: '8093160799', active: true },
  { id: 'courier-metro', name: 'Metro Pac Santo Domingo', phone: '8092260000', active: true },
  { id: 'courier-bm', name: 'BM Cargo Express', phone: '8095661000', active: true },
  { id: 'courier-delivery', name: 'Delivery Express SD', phone: '8095551234', active: true },
];

const INITIAL_ORDERS_DATA: Order[] = [
  {
    id: 'PED-001',
    orderNumber: 'PED-001',
    customerName: 'Carlos Mendoza',
    phone: '809-555-0192',
    email: 'carlos.mendoza@gmail.com',
    province: 'Distrito Nacional',
    city: 'Distrito Nacional',
    address: 'Av. Winston Churchill #104, Piantini',
    items: [
      {
        productId: 'prod-iphone-16-pro-max',
        variantId: 'var-iphone-1',
        title: 'iPhone 16 Pro Max Titanium 256GB',
        variantTitle: 'Titanio Natural / 256GB',
        sku: 'IPH16PM-NAT-256',
        priceDop: 78500,
        quantity: 1,
      },
    ],
    subtotalDop: 78500,
    shippingDop: 0,
    discountDop: 0,
    totalDop: 78500,
    paymentMethod: 'contra_entrega_transferencia',
    selectedBank: 'bhd',
    status: 'En Proceso',
    courierId: 'courier-default',
    courierName: 'Mensajero Quality Gadgets RD (Rofanci Encarnación)',
    courierCost: 300,
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: 'Llamar antes de salir 🚚 • Confirmar disponibilidad • Validar dirección',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PED-002',
    orderNumber: 'PED-002',
    customerName: 'Laura Peña',
    phone: '829-555-8831',
    email: 'laura.pena@hotmail.com',
    province: 'Santiago',
    city: 'Santiago',
    address: 'Calle del Sol #45',
    items: [
      {
        productId: 'prod-sony-wh1000xm5',
        variantId: 'var-sony-1',
        title: 'Sony WH-1000XM5 Noise Cancelling',
        variantTitle: 'Negro Mate',
        sku: 'SNY-WH1000XM5-BLK',
        priceDop: 22900,
        quantity: 1,
      },
    ],
    subtotalDop: 22900,
    shippingDop: 350,
    discountDop: 0,
    totalDop: 23250,
    paymentMethod: 'contra_entrega_efectivo',
    status: 'Entregado',
    courierId: 'courier-metro',
    courierName: 'Metro Pac Santo Domingo',
    courierCost: 350,
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: 'Entregado en recepción',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useStore = create<QualityGadgetsState>()(
  persist(
    (set, get) => ({
      brands: INITIAL_BRANDS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS_DATA,
      couriers: INITIAL_COURIERS,
      customers: INITIAL_CUSTOMERS_DATA,
      discounts: INITIAL_DISCOUNTS_DATA,
      pixels: INITIAL_PIXELS,
      bankAccounts: INITIAL_BANK_ACCOUNTS,
      footerConfig: INITIAL_FOOTER_CONFIG,
      cart: [],

      // ==========================================
      // DATABASE HYDRATION & SYNC
      // ==========================================
      syncFromDatabase: async () => {
        try {
          const prodsRes = await fetch('/api/products').catch(() => null);
          if (prodsRes?.ok) {
            const data = await prodsRes.json();
            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
              set({ products: data.products });
            }
          }

          const catsRes = await fetch('/api/categories').catch(() => null);
          if (catsRes?.ok) {
            const data = await catsRes.json();
            if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
              set({ categories: data.categories });
            }
          }

          const brandsRes = await fetch('/api/brands').catch(() => null);
          if (brandsRes?.ok) {
            const data = await brandsRes.json();
            if (data.success && Array.isArray(data.brands) && data.brands.length > 0) {
              set({ brands: data.brands });
            }
          }

          const ordersRes = await fetch('/api/admin/orders').catch(() => null);
          if (ordersRes?.ok) {
            const data = await ordersRes.json();
            if (data.success && Array.isArray(data.orders)) {
              set({ orders: data.orders });
            }
          }

          get().recalculateInventory();
        } catch (e) {
          console.error('Error sincronizando con Vercel Postgres:', e);
        }
      },

      // ==========================================
      // BRANDS CRUD (POSTGRES SYNC)
      // ==========================================
      addBrand: (brandData) => {
        const name = brandData?.name || 'Nueva Marca';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newBrand: Brand = {
          id: `brand-${Date.now()}`,
          slug,
          ...brandData,
          name,
        };
        set((state) => ({ brands: [...(state.brands || []), newBrand] }));
        fetch('/api/brands', { method: 'POST', body: JSON.stringify(newBrand) }).catch(() => {});
      },

      updateBrand: (id, brandData) => {
        set((state) => ({
          brands: (state.brands || []).map((b) => (b.id === id ? { ...b, ...brandData } : b)),
        }));
        fetch('/api/brands', { method: 'POST', body: JSON.stringify({ id, ...brandData }) }).catch(() => {});
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: (state.brands || []).filter((b) => b.id !== id),
        }));
        fetch(`/api/brands?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      },

      // ==========================================
      // CATEGORIES CRUD (POSTGRES SYNC)
      // ==========================================
      addCategory: (categoryData) => {
        const name = categoryData?.name || 'Nueva Categoría';
        const handle = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-');
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          handle,
          ...categoryData,
          name,
        };
        set((state) => ({ categories: [...(state.categories || []), newCategory] }));
        fetch('/api/categories', { method: 'POST', body: JSON.stringify(newCategory) }).catch(() => {});
      },

      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: (state.categories || []).map((c) => {
            if (c.id !== id) return c;
            const updated = { ...c, ...categoryData };
            if (categoryData.name && !categoryData.handle) {
              updated.handle = categoryData.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-');
            }
            return updated;
          }),
        }));
        fetch('/api/categories', { method: 'POST', body: JSON.stringify({ id, ...categoryData }) }).catch(() => {});
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: (state.categories || []).filter((c) => c.id !== id),
        }));
        fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      },

      // ==========================================
      // PRODUCTS CRUD (POSTGRES SYNC)
      // ==========================================
      addProduct: (productData) => {
        const title = productData?.title || 'Nuevo Gadget';
        const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          handle,
          createdAt: new Date().toISOString(),
          ...productData,
          title,
        };
        set((state) => ({
          products: [newProduct, ...(state.products || [])],
        }));
        get().recalculateInventory();
        fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) }).catch(() => {});
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: (state.products || []).map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...productData,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
        get().recalculateInventory();
        fetch('/api/products', { method: 'POST', body: JSON.stringify({ id, ...productData }) }).catch(() => {});
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: (state.products || []).filter((p) => p.id !== id),
          cart: (state.cart || []).filter((c) => c.productId !== id),
        }));
        get().recalculateInventory();
        fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      },

      deleteSelectedProducts: (productIds) => {
        const idSet = new Set(productIds);
        set((state) => ({
          products: (state.products || []).filter((p) => !idSet.has(p.id)),
          cart: (state.cart || []).filter((c) => !idSet.has(c.productId)),
        }));
        get().recalculateInventory();
        fetch('/api/products', { method: 'DELETE', body: JSON.stringify({ ids: productIds }) }).catch(() => {});
      },

      deleteAllProducts: () => {
        set(() => ({
          products: [],
          cart: [],
        }));
        get().recalculateInventory();
        fetch('/api/products?all=true', { method: 'DELETE' }).catch(() => {});
      },

      updatePhysicalStock: (productId, variantId, newPhysicalStock) => {
        set((state) => ({
          products: (state.products || []).map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: (p.variants || []).map((v) =>
                v.id === variantId
                  ? {
                      ...v,
                      physicalStock: Number(newPhysicalStock),
                      availableStock: Math.max(0, Number(newPhysicalStock) - (v.committedStock || 0)),
                    }
                  : v
              ),
            };
          }),
        }));
      },

      bulkImportProducts: (importedList: any[], mode = 'merge') => {
        const currentProducts = get().products || [];
        const normalizedList: Product[] = (Array.isArray(importedList) ? importedList : [importedList])
          .filter(Boolean)
          .map((item, idx) => {
            const title = item.title || item.name || `Gadget Importado ${idx + 1}`;
            const handle = item.handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const id = item.id || `prod-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;

            const rawVariants = Array.isArray(item.variants) && item.variants.length > 0
              ? item.variants
              : [
                  {
                    id: `var-${id}-1`,
                    title: 'Estándar',
                    sku: item.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
                    priceDop: Number(item.priceDop || item.price || 1495),
                    compareAtPriceDop: item.compareAtPriceDop ? Number(item.compareAtPriceDop) : undefined,
                    costDop: item.costDop ? Number(item.costDop) : undefined,
                    physicalStock: Number(item.physicalStock ?? item.stock ?? 10),
                    availableStock: Number(item.physicalStock ?? item.stock ?? 10),
                    imageUrls: Array.isArray(item.images) ? item.images : item.thumbnailUrl ? [item.thumbnailUrl] : [],
                    options: item.options && typeof item.options === 'object' && !Array.isArray(item.options) ? item.options : {},
                  },
                ];

            const normalizedVariants: ProductVariant[] = rawVariants.map((v: any, vIdx: number) => {
              const pStock = Number(v.physicalStock ?? v.stock ?? item.stock ?? 10);
              return {
                id: v.id || `var-${id}-${vIdx + 1}`,
                title: v.title || v.name || 'Estándar',
                sku: v.sku || `${handle.toUpperCase()}-${vIdx + 1}`,
                barcode: v.barcode || '',
                priceDop: Number(v.priceDop ?? v.price ?? item.priceDop ?? item.price ?? 1495),
                compareAtPriceDop: v.compareAtPriceDop ? Number(v.compareAtPriceDop) : undefined,
                costDop: v.costDop ? Number(v.costDop) : undefined,
                weightGrams: v.weightGrams ? Number(v.weightGrams) : undefined,
                physicalStock: pStock,
                committedStock: 0,
                availableStock: pStock,
                imageUrls: Array.isArray(v.imageUrls) ? v.imageUrls : [],
                options: v.options && typeof v.options === 'object' ? v.options : {},
              };
            });

            return {
              id,
              brandId: item.brandId || '',
              brand: item.brand || 'Quality Gadgets',
              categoryId: item.categoryId || '',
              category: item.category || 'Gadgets',
              title,
              handle,
              description: item.description || 'Descripción del producto.',
              status: item.status || 'published',
              thumbnailUrl: item.thumbnailUrl || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              images: Array.isArray(item.images) ? item.images : item.thumbnailUrl ? [item.thumbnailUrl] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
              ratingAvg: Number(item.ratingAvg || 4.9),
              ratingCount: Number(item.ratingCount || 12),
              isFeatured: Boolean(item.isFeatured),
              isDeal: Boolean(item.isDeal),
              options: Array.isArray(item.options) ? item.options : [],
              variants: normalizedVariants,
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

        let addedCount = 0;
        let updatedCount = 0;

        if (mode === 'replace') {
          set({ products: normalizedList });
          addedCount = normalizedList.length;
        } else {
          const map = new Map(currentProducts.map((p) => [p.id, p]));
          const handleMap = new Map(currentProducts.map((p) => [p.handle, p.id]));

          normalizedList.forEach((np) => {
            const existingIdByHandle = handleMap.get(np.handle);
            const targetId = map.has(np.id) ? np.id : existingIdByHandle;

            if (targetId && map.has(targetId)) {
              map.set(targetId, { ...map.get(targetId)!, ...np, id: targetId });
              updatedCount++;
            } else {
              map.set(np.id, np);
              addedCount++;
            }
          });

          set({ products: Array.from(map.values()) });
        }

        get().recalculateInventory();
        return { added: addedCount, updated: updatedCount };
      },

      // ==========================================
      // ORDERS OMS CRUD & STOCK COMMITTED
      // ==========================================
      addOrder: (orderData) => {
        // Formato estricto QG-#### (letras QG- seguidas por 4 dígitos)
        const generate4DigitCode = () => `QG-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderNumber = orderData?.orderNumber && /^QG-\d{4}$/.test(orderData.orderNumber)
          ? orderData.orderNumber
          : generate4DigitCode();

        const customerName = orderData?.customerName || orderData?.customer?.name || 'Cliente General';
        const newOrder: Order = {
          id: orderData?.id || `order-${Date.now()}`,
          orderNumber,
          customerName,
          status: orderData?.status || 'En Proceso',
          createdAt: orderData?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...orderData,
        };

        set((state) => ({
          orders: [newOrder, ...(state.orders || [])],
        }));

        // Actualizar datos del cliente o crear nuevo contacto en CRM
        const cleanNewPhone = (newOrder.phone || '').replace(/\D/g, '');
        const cleanNewEmail = (newOrder.email || '').trim().toLowerCase();

        const existingCustomer = (get().customers || []).find((c) => {
          const cleanCustPhone = (c.phone || '').replace(/\D/g, '');
          const cleanCustEmail = (c.email || '').trim().toLowerCase();
          return (
            (cleanNewPhone && cleanCustPhone && (cleanNewPhone.includes(cleanCustPhone) || cleanCustPhone.includes(cleanNewPhone))) ||
            (cleanNewEmail && cleanCustEmail && cleanNewEmail === cleanCustEmail && !cleanNewEmail.includes('@qualitygadgetsrd.com'))
          );
        });

        const orderAmount = Number(newOrder.totalDop || 0);

        if (existingCustomer) {
          const updatedTotalOrders = (existingCustomer.totalOrders || 0) + 1;
          const updatedLTV = (existingCustomer.totalSpentDop || 0) + orderAmount;
          get().updateCustomer(existingCustomer.id, {
            name: customerName !== 'Cliente General' ? customerName : existingCustomer.name,
            totalOrders: updatedTotalOrders,
            totalSpentDop: updatedLTV,
            city: newOrder.city || existingCustomer.city,
            province: newOrder.province || existingCustomer.province,
            address: newOrder.address || existingCustomer.address,
            segment: updatedTotalOrders >= 3 || updatedLTV >= 50000 ? 'vip' : 'recurrent',
            notes: existingCustomer.notes
              ? `${existingCustomer.notes} • Pedido ${orderNumber}`
              : `Pedido ${orderNumber}`,
          });
        } else {
          get().addCustomer({
            name: customerName,
            email: newOrder.email || 'contacto@qualitygadgetsrd.com',
            phone: newOrder.phone || '809-000-0000',
            city: newOrder.city || 'Santo Domingo',
            province: newOrder.province || 'Distrito Nacional',
            address: newOrder.address || '',
            segment: 'new',
            notes: `Primer pedido ${orderNumber}`,
          });
        }

        get().recalculateInventory();
        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus, trackingInfo) => {
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  trackingNumber: trackingInfo?.trackingNumber || o.trackingNumber,
                  carrier: trackingInfo?.carrier || o.carrier,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
        get().recalculateInventory();
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: (state.orders || []).filter((o) => o.id !== orderId),
        }));
        get().recalculateInventory();
      },

      bulkUpdateOrderStatus: (orderIds, status) => {
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            orderIds.includes(o.id) ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
        get().recalculateInventory();
      },

      deleteSelectedOrders: (orderIds) => {
        set((state) => ({
          orders: (state.orders || []).filter((o) => !orderIds.includes(o.id)),
        }));
        get().recalculateInventory();
      },

      assignCourierToOrder: (orderId, courierId) => {
        const courier = (get().couriers || []).find((c) => c.id === courierId);
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  courierId: courierId || '',
                  courierName: courier?.name || '',
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      bulkAssignCourier: (orderIds, courierId) => {
        const courier = (get().couriers || []).find((c) => c.id === courierId);
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            orderIds.includes(o.id)
              ? {
                  ...o,
                  courierId: courierId || '',
                  courierName: courier?.name || '',
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      updateOrderDeliveryDate: (orderId, deliveryDate) => {
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === orderId ? { ...o, deliveryDate, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      updatePostSale: (orderId, postSale) => {
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  postSale: { ...(o.postSale || {}), ...postSale },
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      addCourier: (courierData) => {
        const newCourier: Courier = {
          id: `courier-${Date.now()}`,
          name: courierData.name,
          phone: courierData.phone || '',
          active: courierData.active ?? true,
        };
        set((state) => ({ couriers: [...(state.couriers || []), newCourier] }));
      },

      updateCourier: (id, courierData) => {
        set((state) => ({
          couriers: (state.couriers || []).map((c) => (c.id === id ? { ...c, ...courierData } : c)),
        }));
      },

      deleteCourier: (id) => {
        set((state) => ({
          couriers: (state.couriers || []).filter((c) => c.id !== id),
        }));
      },

      recalculateInventory: () => {
        const { orders, products } = get();
        const safeOrders = orders || [];
        const safeProducts = products || [];

        const committedMap = new Map<string, number>();

        safeOrders.forEach((order) => {
          if (order?.status === 'pendiente' || order?.status === 'en_preparacion') {
            (order?.items || []).forEach((item) => {
              if (item?.variantId) {
                const current = committedMap.get(item.variantId) || 0;
                committedMap.set(item.variantId, current + (item.quantity || 0));
              }
            });
          }
        });

        const updatedProducts = safeProducts.map((product) => ({
          ...product,
          variants: (product.variants || []).map((v) => {
            const committed = committedMap.get(v.id) || 0;
            const physical = v.physicalStock ?? 10;
            const available = Math.max(0, physical - committed);
            return {
              ...v,
              physicalStock: physical,
              committedStock: committed,
              availableStock: available,
            };
          }),
        }));

        set({ products: updatedProducts });
      },

      // ==========================================
      // CUSTOMERS CRM CRUD
      // ==========================================
      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          totalOrders: 1,
          totalSpentDop: 0,
          createdAt: new Date().toISOString(),
          ...customerData,
          name: customerData?.name || 'Cliente Nuevo',
        };
        set((state) => ({ customers: [newCustomer, ...(state.customers || [])] }));
      },

      updateCustomer: (id, customerData) => {
        set((state) => ({
          customers: (state.customers || []).map((c) => (c.id === id ? { ...c, ...customerData } : c)),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: (state.customers || []).filter((c) => c.id !== id),
        }));
      },

      // ==========================================
      // DISCOUNTS & PIXELS CRUD
      // ==========================================
      addDiscount: (discountData) => {
        const newDisc: Discount = {
          id: `disc-${Date.now()}`,
          usedCount: 0,
          ...discountData,
          code: (discountData?.code || 'PROMO').trim().toUpperCase(),
        };
        set((state) => ({ discounts: [newDisc, ...(state.discounts || [])] }));
      },

      updateDiscount: (id, discountData) => {
        set((state) => ({
          discounts: (state.discounts || []).map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...discountData,
                  code: discountData.code ? discountData.code.trim().toUpperCase() : d.code,
                }
              : d
          ),
        }));
      },

      deleteDiscount: (id) => {
        set((state) => ({
          discounts: (state.discounts || []).filter((d) => d.id !== id),
        }));
      },

      updatePixel: (id, pixelId, enabled) => {
        set((state) => ({
          pixels: (state.pixels || []).map((p) =>
            p.id === id
              ? { ...p, pixelId, enabled, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      // ==========================================
      // BANK ACCOUNTS CRUD
      // ==========================================
      addBankAccount: (accountData) => {
        const newBank: BankAccount = {
          id: `bank-${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...accountData,
        };
        set((state) => ({ bankAccounts: [...(state.bankAccounts || []), newBank] }));
      },

      updateBankAccount: (id, accountData) => {
        set((state) => ({
          bankAccounts: (state.bankAccounts || []).map((b) => (b.id === id ? { ...b, ...accountData } : b)),
        }));
      },

      deleteBankAccount: (id) => {
        set((state) => ({
          bankAccounts: (state.bankAccounts || []).filter((b) => b.id !== id),
        }));
      },

      // ==========================================
      // FOOTER CMS ACTIONS
      // ==========================================
      updateFooterConfig: (newConfig) => {
        set((state) => ({
          footerConfig: {
            ...(state.footerConfig || INITIAL_FOOTER_CONFIG),
            ...newConfig,
          },
        }));
      },

      // ==========================================
      // CART ACTIONS
      // ==========================================
      addToCart: (product, variant, quantity = 1) => {
        const currentCart = get().cart || [];
        const existingIndex = currentCart.findIndex((i) => i.variantId === variant.id);

        if (existingIndex > -1) {
          const updated = [...currentCart];
          updated[existingIndex].quantity += quantity;
          set({ cart: updated });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                productId: product.id,
                variantId: variant.id,
                product,
                variant,
                quantity,
              },
            ],
          });
        }
      },

      removeFromCart: (variantId) => {
        set((state) => ({
          cart: (state.cart || []).filter((i) => i.variantId !== variantId),
        }));
      },

      updateCartQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(variantId);
          return;
        }
        set((state) => ({
          cart: (state.cart || []).map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: 'quality_gadgets_store_v2',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        if (!persistedState) return {} as any;
        // Blindaje de migración para sanitizar cualquier estructura previa
        const brands = Array.isArray(persistedState.brands) && persistedState.brands.length > 0
          ? persistedState.brands
          : INITIAL_BRANDS;
        const categories = Array.isArray(persistedState.categories) && persistedState.categories.length > 0
          ? persistedState.categories
          : INITIAL_CATEGORIES;
        const footerConfig = persistedState.footerConfig && typeof persistedState.footerConfig === 'object'
          ? { ...INITIAL_FOOTER_CONFIG, ...persistedState.footerConfig }
          : INITIAL_FOOTER_CONFIG;
        const products = Array.isArray(persistedState.products) && persistedState.products.length > 0
          ? persistedState.products.map((p: any) => ({
              ...p,
              brand: typeof p.brand === 'object' ? p.brand?.name || 'Apple' : p.brand || 'Apple',
              category: typeof p.category === 'object' ? p.category?.name || 'Smartphones' : p.category || 'Smartphones',
              variants: Array.isArray(p.variants) && p.variants.length > 0
                ? p.variants.map((v: any) => ({
                    ...v,
                    physicalStock: v.physicalStock ?? 10,
                    availableStock: v.availableStock ?? v.physicalStock ?? 10,
                    committedStock: v.committedStock ?? 0,
                    priceDop: v.priceDop ?? 25000,
                    imageUrls: Array.isArray(v.imageUrls) ? v.imageUrls : [p.thumbnailUrl || ''],
                  }))
                : INITIAL_PRODUCTS[0].variants,
            }))
          : INITIAL_PRODUCTS;

        return {
          ...persistedState,
          brands,
          categories,
          products,
          footerConfig,
        };
      },
    }
  )
);
