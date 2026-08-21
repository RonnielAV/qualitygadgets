'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Smartphone,
  Headphones,
  Watch,
  Plane,
  Home,
  Flame,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function StorefrontNavbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useStore((s) => s.cart);
  const categories = useStore((s) => s.categories);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const currentCategory = searchParams.get('categoria');
  const isOfertasActive = searchParams.get('ofertas') === 'true';

  const handleCategoryClick = (handle: string) => {
    setIsMobileMenuOpen(false);
    router.push(`/productos?categoria=${handle}`);
  };

  const handleOfertasClick = () => {
    setIsMobileMenuOpen(false);
    router.push(`/productos?ofertas=true`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-obsidian/95 backdrop-blur-2xl shadow-2xl">
      {/* Top Banner de Confianza */}
      <div className="bg-gradient-to-r from-brand-indigo via-dark-surface to-brand-indigo px-4 py-1 text-center text-[11px] font-bold text-text-muted border-b border-dark-border/40 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>🚚 Envío Gratis en Santo Domingo por compras mayores a RD$ 25,000 | 🛡️ Siempre pago contra entrega</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* Mega Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar smartphones, audio pro, drones, smartwatches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-dark-border bg-dark-surface/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-text-muted/60 focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none transition-all"
          />
        </form>

        {/* Acciones del Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Carrito con Contador Reactivo */}
          <Link
            href="/checkout"
            className="relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-4 py-2.5 text-xs font-black text-white shadow-glow-purple hover:scale-105 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-dark-obsidian shadow-md">
              {cartTotalItems}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl border border-dark-border p-2 text-text-muted hover:text-white md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mega-Header Navegación por Categorías */}
      <nav className="border-t border-dark-border/60 bg-dark-surface/60 px-4 py-2 hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 sm:gap-4 text-xs font-bold overflow-x-auto">
          <Link
            href="/productos"
            className={`rounded-xl px-3.5 py-1.5 transition-all ${
              !currentCategory && !isOfertasActive
                ? 'bg-brand-cyan text-dark-obsidian font-black shadow-glow-cyan'
                : 'text-text-muted hover:text-white hover:bg-dark-elevated'
            }`}
          >
            Todo el Catálogo
          </Link>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.handle)}
              className={`rounded-xl px-3.5 py-1.5 transition-all cursor-pointer ${
                currentCategory === cat.handle
                  ? 'bg-brand-cyan text-dark-obsidian font-black shadow-glow-cyan'
                  : 'text-text-muted hover:text-white hover:bg-dark-elevated'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={handleOfertasClick}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 transition-all cursor-pointer font-black ${
              isOfertasActive
                ? 'bg-brand-magenta text-white shadow-glow-magenta'
                : 'text-brand-magenta hover:bg-brand-magenta/15 border border-brand-magenta/30'
            }`}
          >
            <Flame className="h-3.5 w-3.5 animate-pulse" />
            <span>Ofertas Flash 🔥</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-obsidian p-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar en Quality Gadgets RD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-surface py-2 pl-10 pr-4 text-xs text-white"
            />
          </form>

          <div className="space-y-1 text-xs font-bold">
            <Link
              href="/productos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-text-muted hover:bg-dark-surface"
            >
              Todo el Catálogo
            </Link>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.handle)}
                className="w-full text-left rounded-xl px-3 py-2 text-text-muted hover:bg-dark-surface block"
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={handleOfertasClick}
              className="w-full text-left rounded-xl px-3 py-2 text-brand-magenta font-black flex items-center gap-2"
            >
              <Flame className="h-4 w-4" />
              <span>Ofertas Flash</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
export default StorefrontNavbar;
