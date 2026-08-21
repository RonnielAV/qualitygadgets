'use client';

import { create } from 'zustand';
import { CartItem, Currency } from '@packages/types/commerce';

interface CartState {
  items: CartItem[];
  currency: Currency;
  isDrawerOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setCurrency: (currency: Currency) => void;

  // Computed Helpers
  subtotalDop: () => number;
  subtotalUsd: () => number;
  totalItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Item precargado para facilitar la demostración de UX
    {
      variantId: 'var-001',
      productId: 'prod-001',
      title: 'iPhone 16 Pro Max Titanium 5G',
      variantTitle: 'Titanio Negro / 256GB',
      priceDop: 78500,
      priceUsd: 1299,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      quantity: 1,
      maxStock: 25,
    },
  ],
  currency: 'DOP',
  isDrawerOpen: false,

  addItem: (newItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.variantId === newItem.variantId
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        const newQty = Math.min(
          updated[existingIndex].maxStock,
          updated[existingIndex].quantity + newItem.quantity
        );
        updated[existingIndex].quantity = newQty;
        return { items: updated, isDrawerOpen: true };
      }

      return { items: [...state.items, newItem], isDrawerOpen: true };
    });
  },

  removeItem: (variantId) => {
    set((state) => ({
      items: state.items.filter((i) => i.variantId !== variantId),
    }));
  },

  updateQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: Math.min(item.maxStock, quantity) }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setCurrency: (currency) => set({ currency }),

  subtotalDop: () => {
    return get().items.reduce(
      (acc, item) => acc + item.priceDop * item.quantity,
      0
    );
  },

  subtotalUsd: () => {
    return get().items.reduce(
      (acc, item) => acc + item.priceUsd * item.quantity,
      0
    );
  },

  totalItemsCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
