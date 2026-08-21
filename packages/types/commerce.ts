// ============================================================================
// QUALITY GADGETS RD - TYPESCRIPT DOMAIN INTERFACES
// ============================================================================

export type Currency = 'DOP' | 'USD';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description?: string;
  iconName?: string;
}

export interface OptionValue {
  id: string;
  value: string;
  hexColor?: string;
}

export interface ProductOption {
  id: string;
  title: string;
  position: number;
  values: OptionValue[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string;
  priceDop: number;
  compareAtPriceDop?: number;
  priceUsd: number;
  compareAtPriceUsd?: number;
  weightGrams: number;
  availableStock: number;
  imageUrls: string[];
  optionValueIds: string[];
}

export interface Product {
  id: string;
  brand: Brand;
  category: Category;
  title: string;
  handle: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  thumbnailUrl: string;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isFeatured: boolean;
  isDeal: boolean;
  options: ProductOption[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  priceDop: number;
  priceUsd: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  serviceName: string;
  costDop: number;
  minDays: number;
  maxDays: number;
  formattedRange: string;
}

export interface Order {
  id: string;
  orderNumber: string;
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
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'authorized' | 'captured' | 'declined' | 'refunded';
  currency: Currency;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentGateway: 'stripe' | 'cardnet' | 'azul' | 'cash_on_delivery';
  paymentTransactionId?: string;
  trackingNumber?: string;
  deliveryCarrier?: string;
  estimatedDeliveryMin?: string;
  estimatedDeliveryMax?: string;
  items: {
    id: string;
    variantId?: string;
    productTitle: string;
    variantSku: string;
    variantTitle: string;
    unitPrice: number;
    quantity: number;
    totalLineAmount: number;
  }[];
  createdAt: string;
}
