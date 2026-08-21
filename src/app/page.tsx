'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, ShieldCheck, Truck, Star, Sparkles, Smartphone, Headphones, Watch, Camera, Home } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/product/ProductCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function HomePage() {
  const { products, categories } = useStore();
  const safeProducts = products || [];
  const safeCategories = categories || [];

  const deals = safeProducts.filter((p) => p.isDeal);
  const featured = safeProducts.filter((p) => p.isFeatured);
  const heroProduct = safeProducts[0];

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="h-6 w-6" />;
      case 'Headphones':
        return <Headphones className="h-6 w-6" />;
      case 'Watch':
        return <Watch className="h-6 w-6" />;
      case 'Camera':
        return <Camera className="h-6 w-6" />;
      case 'Home':
        return <Home className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-24 pb-28">
      {/* Hero Section con Ambient Light Mesh y Gradiente del Logotipo */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Ambient Lights difuminadas (Ambient Light Mesh) */}
        <div className="absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-ultraviolet/20 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-brand-cyan/15 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 h-[400px] w-[400px] rounded-full bg-brand-magenta/15 blur-[130px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* Texto y CTA */}
            <div className="space-y-8 lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-cyan/30 bg-dark-surface/90 px-4 py-2 text-xs font-black text-brand-cyan shadow-glow-cyan backdrop-blur-md">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>TECNOLOGÍA PREMIUM AL ALCANCE DE UN CLIC EN RD</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
                El futuro en tus manos:{' '}
                <span className="text-logo-gradient block mt-2">
                  Tecnología premium
                </span>{' '}
                al alcance de un clic en RD.
              </h1>

              <p className="text-base text-text-muted sm:text-lg max-w-2xl leading-relaxed">
                Descubre los smartphones 5G, auriculares Noise Cancelling, smartwatches y drones de última generación con garantía oficial local, soporte multi-moneda DOP/USD y entregas express en 24h a toda República Dominicana.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/productos">
                  <PrimaryButton variant="primary" className="py-4 px-8 text-sm font-black shadow-glow-purple">
                    <span>Explorar Catálogo ({safeProducts.length})</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </PrimaryButton>
                </Link>
                <Link href="/productos?ofertas=true">
                  <PrimaryButton variant="cyan" className="py-4 px-8 text-sm font-black shadow-glow-cyan">
                    <Zap className="h-4 w-4 mr-2 fill-current" />
                    <span>Ver Ofertas Flash</span>
                  </PrimaryButton>
                </Link>
              </div>

              {/* Badges de Confianza */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-dark-border/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo text-brand-cyan border border-brand-cyan/30">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Envío Express 24h</h4>
                    <p className="text-[11px] text-text-muted">A todo el país en RD</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo text-brand-ultraviolet border border-brand-ultraviolet/30">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Garantía Oficial</h4>
                    <p className="text-[11px] text-text-muted">1 Año de reemplazo</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo text-brand-magenta border border-brand-magenta/30">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">+5,000 Clientes</h4>
                    <p className="text-[11px] text-text-muted">Calificación 4.9/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Visual Hero Product */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-md rounded-3xl border border-brand-cyan/40 bg-gradient-to-tr from-dark-surface via-dark-elevated to-dark-obsidian p-8 shadow-2xl backdrop-blur-2xl">
                {/* Floating Tags */}
                <div className="absolute -top-4 -right-4 rounded-2xl bg-brand-magenta px-4 py-2 text-xs font-extrabold text-white shadow-glow-magenta animate-bounce">
                  ⚡ OFERTA ESTELAR
                </div>

                <div className="absolute -bottom-4 -left-4 rounded-2xl border border-brand-cyan bg-dark-obsidian/90 px-4 py-2 text-xs font-bold text-brand-cyan shadow-glow-cyan backdrop-blur-md">
                  ★ 4.9 Estrellas (38 reviews)
                </div>

                <div className="relative h-full w-full">
                  <Image
                    src={heroProduct?.thumbnailUrl || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'}
                    alt={heroProduct?.title || 'iPhone 16 Pro Max'}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,210,255,0.25)] transition-transform duration-700 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">Explorar por Ecosistema</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Categorías Tecnológicas</h2>
          </div>
          <Link href="/productos" className="text-xs font-extrabold text-brand-cyan hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {safeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.handle}`}
              className="group flex flex-col items-center justify-center rounded-3xl border border-dark-border bg-dark-surface/70 p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-cyan hover:shadow-glow-cyan backdrop-blur-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-elevated text-brand-cyan transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-brand-cyan group-hover:to-brand-ultraviolet group-hover:text-white group-hover:shadow-glow-cyan">
                {getCategoryIcon(cat.icon || (cat as any).iconName)}
              </div>
              <h3 className="mt-4 text-xs font-bold text-white group-hover:text-brand-cyan transition-colors">{cat.name}</h3>
              <p className="mt-1 text-[11px] text-text-muted line-clamp-1">{cat.description || 'Ecosistema tecnológico'}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección de Ofertas Flash en Holographic Magenta */}
      {deals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-magenta/40 bg-gradient-to-b from-dark-surface via-dark-elevated to-dark-obsidian p-8 sm:p-12 shadow-glow-magenta relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-magenta/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-dark-border/80 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-magenta/20 border border-brand-magenta/40 px-4 py-1.5 text-xs font-black text-brand-magenta">
                  <Zap className="h-4 w-4 fill-current animate-pulse" />
                  <span>OFERTAS POR TIEMPO LIMITADO</span>
                </div>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-4xl">
                  Flash Deals República Dominicana
                </h2>
              </div>
              <Link
                href="/productos?ofertas=true"
                className="rounded-2xl bg-gradient-to-r from-brand-magenta to-brand-ultraviolet px-6 py-3.5 text-xs font-extrabold text-white shadow-glow-magenta transition-all hover:scale-105"
              >
                Ver Todas las Ofertas
              </Link>
            </div>

            <div className="relative mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo Destacado */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ultraviolet">Lo Más Codiciado</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Gadgets Destacados</h2>
          </div>
          <Link href="/productos" className="text-xs font-extrabold text-brand-cyan hover:underline">
            Ver catálogo completo ({safeProducts.length} productos) →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
