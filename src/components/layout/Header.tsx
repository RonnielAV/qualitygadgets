'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Zap, Cpu, Smartphone, Headphones, Watch, Camera, Home, Menu, X, SlidersHorizontal } from 'lucide-react';
import { useCartStore } from '@/hooks/useCartStore';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/mock-data';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Header() {
  const { openDrawer, totalItemsCount, currency, setCurrency } = useCartStore();
  const storeCategories = useStore((s) => s.categories);
  const categoriesList = Array.isArray(storeCategories) && storeCategories.length > 0 ? storeCategories : CATEGORIES;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="h-4 w-4" />;
      case 'Headphones':
        return <Headphones className="h-4 w-4" />;
      case 'Watch':
        return <Watch className="h-4 w-4" />;
      case 'Camera':
        return <Camera className="h-4 w-4" />;
      case 'Home':
        return <Home className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-obsidian/95 backdrop-blur-2xl transition-all duration-300">
      {/* Top Banner de Conversión con Espaciado Generoso */}
      <div className="border-b border-dark-border/40 bg-gradient-to-r from-dark-obsidian via-dark-surface/90 to-dark-obsidian px-6 py-2.5 text-xs text-text-muted">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div className="hidden sm:flex items-center gap-2.5 text-brand-cyan font-bold">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-cyan shadow-glow-cyan animate-pulse" />
            <span>Despacho Express en 24h Santo Domingo & Santiago</span>
          </div>

          <p className="mx-auto font-semibold text-text-pure text-center text-xs">
            🚚 <strong className="text-brand-cyan font-extrabold">Envío GRATIS</strong> en pedidos superiores a RD$ 3,500
          </p>

          {/* Switcher de Moneda DOP / USD */}
          <div className="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-surface p-1 text-[11px] font-extrabold">
            <button
              onClick={() => setCurrency('DOP')}
              className={`rounded-lg px-3 py-1 transition-all ${
                currency === 'DOP'
                  ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              DOP (RD$)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`rounded-lg px-3 py-1 transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar con Distribución Espaciosa y Limpia */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-24 items-center justify-between gap-8">
          {/* Logo Oficial Quality Gadgets */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-2xl border border-dark-border p-3 text-text-muted hover:border-brand-cyan hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <BrandLogo size="md" showSlogan />
          </div>

          {/* Buscador Central Espacioso y con Glow Focus */}
          <div className="relative hidden md:block flex-1 max-w-md mx-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar gadgets: iPhone, Drones, Sony..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-surface/80 py-3 pl-11 pr-4 text-xs font-semibold text-text-pure placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
            />
          </div>

          {/* Acciones del Header: Ofertas Flash + Carrito */}
          <div className="flex items-center gap-4">
            <Link
              href="/productos?ofertas=true"
              className="hidden lg:flex items-center gap-2 rounded-2xl bg-brand-magenta/15 border border-brand-magenta/40 px-4 py-3 text-xs font-extrabold text-brand-magenta shadow-glow-magenta hover:bg-brand-magenta/25 transition-all"
            >
              <Zap className="h-4 w-4 fill-current animate-pulse" />
              <span>Ofertas Flash</span>
            </Link>



            {/* Cart Trigger con Badge Cyber Cyan */}
            <button
              onClick={openDrawer}
              className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-dark-border bg-dark-surface text-text-pure shadow-glow-subtle transition-all duration-300 hover:border-brand-cyan hover:scale-105 active:scale-95 cursor-pointer p-3.5"
            >
              <ShoppingBag className="h-6 w-6 text-brand-cyan" />
              {totalItemsCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan text-[11px] font-black text-dark-obsidian shadow-glow-cyan animate-bounce">
                  {totalItemsCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Categorías Horizontal con Espacio Limpio (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 border-t border-dark-border/40 py-3 overflow-x-auto">
          <Link
            href="/productos"
            className="rounded-xl px-4 py-2 text-xs font-black text-text-pure hover:bg-dark-elevated transition-all"
          >
            Todos los Gadgets
          </Link>
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.handle}`}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-text-muted transition-all hover:bg-dark-elevated hover:text-brand-cyan"
            >
              {getCategoryIcon((cat as any)?.iconName || (cat as any)?.icon)}
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-dark-border bg-dark-surface/98 p-6 backdrop-blur-2xl lg:hidden space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian py-3 pl-11 pr-4 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <Link
            href="/productos"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-2xl bg-dark-elevated px-4 py-3 text-sm font-bold text-white"
          >
            Todos los Gadgets
          </Link>
          <Link
            href="/productos?ofertas=true"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-2xl bg-brand-magenta/15 px-4 py-3 text-sm font-black text-brand-magenta border border-brand-magenta/30"
          >
            <Zap className="h-4 w-4 fill-current" /> Ofertas & Flash Deals
          </Link>
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.handle}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-text-muted hover:bg-dark-elevated hover:text-brand-cyan"
            >
              {getCategoryIcon((cat as any)?.iconName || (cat as any)?.icon)}
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
