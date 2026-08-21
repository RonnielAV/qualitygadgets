'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Truck, ArrowRight, Check, Zap } from 'lucide-react';
import { Product } from '@packages/types/commerce';
import { useCartStore } from '@/hooks/useCartStore';
import { ShippingEstimator } from './ShippingEstimator';
import { formatCurrency } from '@/lib/utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem, openDrawer, currency } = useCartStore();

  // Estado de opciones seleccionadas
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values.length > 0) initial[opt.id] = opt.values[0].id;
    });
    return initial;
  });

  // Resolver variante activa a partir de las opciones seleccionadas
  const activeVariant = useMemo(() => {
    const selectedValIds = Object.values(selectedOptions);
    if (selectedValIds.length === 0) return product.variants[0];
    
    return (
      product.variants.find((v) =>
        selectedValIds.every((id) => v.optionValueIds.includes(id))
      ) || product.variants[0]
    );
  }, [product.variants, selectedOptions]);

  const [activeImage, setActiveImage] = useState<string>(
    activeVariant.imageUrls[0] || product.thumbnailUrl
  );

  // Sincronizar imagen al cambiar variante
  const handleOptionChange = (optionId: string, valueId: string) => {
    const next = { ...selectedOptions, [optionId]: valueId };
    setSelectedOptions(next);
    const matched = product.variants.find((v) =>
      Object.values(next).every((id) => v.optionValueIds.includes(id))
    );
    if (matched && matched.imageUrls.length > 0) {
      setActiveImage(matched.imageUrls[0]);
    }
  };

  const price = currency === 'DOP' ? activeVariant.priceDop : activeVariant.priceUsd;
  const comparePrice = currency === 'DOP' ? activeVariant.compareAtPriceDop : activeVariant.compareAtPriceUsd;

  const isDiscounted = comparePrice && comparePrice > price;
  const discountPercent = isDiscounted
    ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: activeVariant.sku,
      priceDop: activeVariant.priceDop,
      priceUsd: activeVariant.priceUsd,
      imageUrl: activeImage,
      quantity: 1,
      maxStock: activeVariant.availableStock,
    });
    openDrawer();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-start">
        {/* Galería Multimedia Adaptativa */}
        <div className="lg:col-span-7 flex flex-col-reverse gap-6 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex flex-row sm:flex-col gap-4 overflow-x-auto pb-2 sm:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  activeImage === img
                    ? 'border-brand-cyan shadow-glow-cyan scale-105'
                    : 'border-dark-border bg-dark-surface/60 hover:border-brand-ultraviolet'
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Imagen Principal Grande con Borde Glow */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-dark-border bg-gradient-to-b from-dark-surface to-dark-obsidian shadow-2xl backdrop-blur-2xl">
            {isDiscounted && (
              <span className="absolute top-6 left-6 z-10 flex items-center gap-1.5 rounded-full bg-brand-magenta px-4 py-1.5 text-xs font-black text-white shadow-glow-magenta">
                <Zap className="h-4 w-4 fill-current animate-pulse" /> -{discountPercent}% OFF
              </span>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative h-full w-full p-8"
              >
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain p-6 drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Panel de Configuración y Compra con Espaciado Cómodo */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="border-b border-dark-border/80 pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-widest text-brand-cyan uppercase">
                {product.brand.name} • SKU: {activeVariant.sku}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <Check className="h-3.5 w-3.5" /> En Stock RD ({activeVariant.availableStock})
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1.5 text-sm font-black text-white">
                  {product.ratingAvg.toFixed(1)} ★
                </span>
              </div>
              <span className="text-xs text-text-muted font-medium">
                ({product.ratingCount} opiniones verificadas en RD)
              </span>
            </div>
          </div>

          {/* Precios con Jerarquía Tipográfica y Multi-Moneda */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-black text-white">
                {formatCurrency(price, currency)}
              </span>
              {isDiscounted && (
                <span className="text-xl text-text-muted line-through font-semibold">
                  {formatCurrency(comparePrice!, currency)}
                </span>
              )}
            </div>
            <p className="text-xs text-brand-cyan font-bold pt-1">
              Impuesto ITBIS (18%) incluido • Factura con NCF disponible
            </p>
          </div>

          {/* Descripción */}
          <p className="text-sm text-text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Opciones Configurables (Colores y Almacenamiento) */}
          <div className="space-y-6 pt-2">
            {product.options.map((option) => (
              <div key={option.id} className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-white">
                  {option.title}:{' '}
                  <span className="text-brand-cyan">
                    {option.values.find((v) => v.id === selectedOptions[option.id])?.value}
                  </span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {option.values.map((val) => {
                    const isSelected = selectedOptions[option.id] === val.id;
                    if (val.hexColor) {
                      return (
                        <button
                          key={val.id}
                          onClick={() => handleOptionChange(option.id, val.id)}
                          className={`group relative h-11 w-11 rounded-2xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-brand-cyan ring-4 ring-brand-cyan/30 scale-110 shadow-glow-cyan'
                              : 'border-dark-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: val.hexColor }}
                          title={val.value}
                        >
                          {isSelected && (
                            <Check className="mx-auto h-5 w-5 text-white drop-shadow-md" />
                          )}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={val.id}
                        onClick={() => handleOptionChange(option.id, val.id)}
                        className={`rounded-2xl px-5 py-3 text-xs font-black transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple scale-105 border border-white/20'
                            : 'border border-dark-border bg-dark-surface/90 text-text-muted hover:border-brand-cyan hover:text-white'
                        }`}
                      >
                        {val.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Botón CTA de Alta Conversión */}
          <div className="pt-4">
            <PrimaryButton
              variant="primary"
              showArrow
              onClick={handleAddToCart}
              disabled={activeVariant.availableStock <= 0}
              className="w-full py-4 text-base"
            >
              Añadir al Carrito de Gadgets
            </PrimaryButton>
          </div>

          {/* Calculador Logístico Anticipado con Espaciado Generoso */}
          <div className="rounded-3xl border border-dark-border bg-dark-surface/80 p-6 shadow-md backdrop-blur-xl space-y-4">
            <ShippingEstimator />
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border/80 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Garantía Oficial 12 Meses</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-cyan flex-shrink-0" />
                <span>Envíos a toda Rep. Dominicana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar en Dispositivos Móviles */}
      <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-dark-border bg-dark-obsidian/95 px-6 py-4 backdrop-blur-2xl lg:hidden">
        <div>
          <span className="block text-[10px] font-bold text-text-muted uppercase">Total</span>
          <span className="text-lg font-black text-white">
            {formatCurrency(price, currency)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-6 py-3 text-xs font-black text-white shadow-glow-purple"
        >
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}
