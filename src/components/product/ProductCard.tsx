'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Zap, Check } from 'lucide-react';
import { useCartStore } from '@/hooks/useCartStore';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, currency } = useCartStore();

  // Blindaje Defensivo Total
  const variants = Array.isArray(product?.variants) && product.variants.length > 0 ? product.variants : [];
  const defaultVariant = variants[0] || {
    id: `var-${product?.id || 'default'}`,
    sku: 'SKU-DEFAULT',
    priceDop: 25000,
    priceUsd: 416,
    compareAtPriceDop: 28000,
    compareAtPriceUsd: 466,
    imageUrls: [product?.thumbnailUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    availableStock: 10,
  };

  // Safe Brand Extraction
  const brandName =
    typeof product?.brand === 'object'
      ? product?.brand?.name || 'Quality Gadgets'
      : typeof product?.brand === 'string'
      ? product.brand
      : product?.brandName || 'Quality Gadgets';

  const price = currency === 'DOP' ? (defaultVariant?.priceDop ?? 0) : (defaultVariant?.priceUsd ?? Math.round((defaultVariant?.priceDop ?? 0) / 60));
  const compareAtPrice =
    currency === 'DOP'
      ? defaultVariant?.compareAtPriceDop
      : (defaultVariant?.compareAtPriceUsd ?? (defaultVariant?.compareAtPriceDop ? Math.round(defaultVariant.compareAtPriceDop / 60) : undefined));

  const isDiscounted = compareAtPrice && compareAtPrice > price;
  const discountPercent = isDiscounted && compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId: defaultVariant.id,
      productId: product?.id || 'prod-id',
      title: product?.title || 'Gadget Premium',
      variantTitle: defaultVariant.sku || 'Estándar',
      priceDop: defaultVariant.priceDop ?? 0,
      priceUsd: defaultVariant.priceUsd ?? Math.round((defaultVariant.priceDop ?? 0) / 60),
      imageUrl: defaultVariant.imageUrls?.[0] || product?.thumbnailUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      quantity: 1,
      maxStock: defaultVariant.availableStock ?? 10,
    });
  };

  const productUrl = `/productos/${product?.handle || product?.id || 'gadget'}`;
  const thumbnail = product?.thumbnailUrl || defaultVariant.imageUrls?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const ratingAvg = typeof product?.ratingAvg === 'number' ? product.ratingAvg : 5.0;
  const ratingCount = typeof product?.ratingCount === 'number' ? product.ratingCount : 12;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-dark-border bg-dark-surface/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-ultraviolet hover:shadow-glow-purple">
      {/* Badges de Promoción */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        {product?.isDeal && (
          <span className="flex items-center gap-1.5 rounded-full bg-brand-magenta px-3.5 py-1 text-xs font-black text-white shadow-glow-magenta">
            <Zap className="h-3 w-3 fill-current animate-pulse" /> {discountPercent > 0 ? `-${discountPercent}% OFF` : 'OFERTA'}
          </span>
        )}
        {product?.isFeatured && (
          <span className="rounded-full bg-brand-indigo/90 border border-brand-ultraviolet/50 px-3 py-0.5 text-[10px] font-extrabold text-brand-cyan uppercase tracking-wider shadow-sm">
            Premium RD
          </span>
        )}
      </div>

      {/* Imagen del Producto */}
      <Link href={productUrl} className="relative aspect-square w-full overflow-hidden bg-dark-obsidian/90 p-8">
        <Image
          src={thumbnail}
          alt={product?.title || 'Gadget'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6 gap-3">
        {/* Marca y Disponibilidad */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold tracking-widest text-brand-cyan uppercase">
            {brandName}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <Check className="h-3 w-3" /> En Stock RD
          </span>
        </div>

        {/* Título de Producto */}
        <Link href={productUrl} className="flex-1">
          <h3 className="text-sm font-bold text-text-pure line-clamp-2 transition-colors group-hover:text-brand-cyan">
            {product?.title || 'Gadget sin título'}
          </h3>
        </Link>

        {/* Rating Numérico */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-amber-400">
            <Star className="h-4 w-4 fill-current" />
          </div>
          <span className="text-xs font-black text-white">
            {ratingAvg.toFixed(1)} ★
          </span>
          <span className="text-xs text-text-muted font-medium">
            ({ratingCount} reviews)
          </span>
        </div>

        {/* Precios con Jerarquía Tipográfica y Botón de Añadir */}
        <div className="mt-2 flex items-center justify-between border-t border-dark-border/80 pt-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-text-pure">
                {formatCurrency(price, currency)}
              </span>
              {isDiscounted && compareAtPrice && (
                <span className="text-xs font-semibold text-text-muted line-through">
                  {formatCurrency(compareAtPrice, currency)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-text-muted">ITBIS 18% incluido</span>
          </div>

          {/* Quick Add CTA */}
          <button
            onClick={handleQuickAdd}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="Añadir al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
