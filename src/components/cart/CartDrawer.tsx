'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/hooks/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

const FREE_SHIPPING_THRESHOLD_DOP = 3500; // Umbral de envío gratis en RD: RD$ 3,500

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, subtotalDop, subtotalUsd, currency } = useCartStore();
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = currency === 'DOP' ? subtotalDop() : subtotalUsd();
  const threshold = currency === 'DOP' ? FREE_SHIPPING_THRESHOLD_DOP : Math.round(FREE_SHIPPING_THRESHOLD_DOP / 60);

  const remainingForFreeShipping = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / threshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim());
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay Oscuro con Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Panel con Superficie Elevada */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-dark-border bg-dark-obsidian/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header con Espaciado Generoso */}
            <div className="flex items-center justify-between border-b border-dark-border/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-indigo text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Tu Carrito de Gadgets</h2>
                  <span className="text-xs text-text-muted">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} artículos seleccionados
                  </span>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="rounded-xl border border-dark-border p-2 text-text-muted hover:border-brand-ultraviolet hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Barra de Progreso Dinámica de Envío Gratis en Cyan & Ultraviolet */}
            <div className="border-b border-dark-border/80 bg-dark-surface/90 p-5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-brand-cyan font-black flex items-center gap-1.5">
                    🎉 ¡Tienes Envío Gratis para toda República Dominicana!
                  </span>
                ) : (
                  <span className="text-text-muted">
                    Agrega <strong className="text-brand-cyan font-black">{formatCurrency(remainingForFreeShipping, currency)}</strong> más para <strong className="text-brand-magenta font-black">Envío Gratis</strong>
                  </span>
                )}
                <span className="text-brand-cyan font-black">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-dark-obsidian border border-dark-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-brand-cyan via-brand-ultraviolet to-brand-magenta rounded-full shadow-glow-cyan"
                />
              </div>
            </div>

            {/* Lista de Artículos con Espaciado Cómodo */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-dark-border/60">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-dark-surface border border-dark-border text-brand-cyan shadow-glow-cyan">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <p className="mt-5 text-base font-bold text-white">Tu carrito está vacío</p>
                  <p className="mt-1 text-xs text-text-muted max-w-xs">
                    Explora nuestra selección de gadgets con garantía oficial en República Dominicana.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-6 rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-6 py-3 text-xs font-black text-white shadow-glow-purple"
                  >
                    Ver Catálogo de Gadgets
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 py-5 items-center">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-dark-border bg-dark-surface p-2">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-1" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] text-brand-cyan font-semibold">{item.variantTitle}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-text-muted hover:text-brand-magenta p-1 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-dark-border bg-dark-surface">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 text-text-muted hover:text-white rounded-l-xl"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-black text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 text-text-muted hover:text-white rounded-r-xl"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-white">
                          {formatCurrency(
                            (currency === 'DOP' ? item.priceDop : item.priceUsd) * item.quantity,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer con Cupón Colapsado y Checkout CTA */}
            {items.length > 0 && (
              <div className="border-t border-dark-border/80 bg-dark-surface/90 p-6 space-y-4">
                {/* Selector de Cupón Colapsado */}
                <div>
                  {!couponExpanded ? (
                    <button
                      onClick={() => setCouponExpanded(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan hover:underline"
                    >
                      <Tag className="h-3.5 w-3.5" /> ¿Tienes un código promocional?
                    </button>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CÓDIGO (EJ. GADGETRD)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 rounded-xl border border-dark-border bg-dark-obsidian px-3.5 py-2 text-xs font-bold text-white uppercase focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-dark-elevated border border-brand-cyan/40 px-4 py-2 text-xs font-bold text-brand-cyan hover:bg-brand-cyan hover:text-dark-obsidian transition-all"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}
                  {appliedCoupon && (
                    <p className="mt-1 text-[11px] text-emerald-400 font-bold">✓ Cupón {appliedCoupon} aplicado</p>
                  )}
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Envío Estimado</span>
                    <span className="font-black text-brand-cyan">
                      {remainingForFreeShipping === 0 ? 'GRATIS' : 'Calculado en Checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-dark-border/80">
                    <span>Total Estimado</span>
                    <span className="text-logo-gradient text-lg">{formatCurrency(subtotal, currency)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full"
                >
                  <PrimaryButton variant="primary" showArrow className="w-full py-4 text-sm font-black">
                    Proceder al Checkout Seguro
                  </PrimaryButton>
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted pt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Compra 100% Protegida en República Dominicana</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
