'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Zap, SlidersHorizontal, RefreshCw, Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/product/ProductCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const categoriaFromUrl = searchParams.get('categoria');
  const ofertasFromUrl = searchParams.get('ofertas');
  const searchFromUrl = searchParams.get('search');

  const { products, brands, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(categoriaFromUrl || 'all');
  const [onlyDeals, setOnlyDeals] = useState<boolean>(ofertasFromUrl === 'true');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(120000);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sincronizar automáticamente con URL
  useEffect(() => {
    if (categoriaFromUrl) {
      setSelectedCategory(categoriaFromUrl);
    } else {
      setSelectedCategory('all');
    }

    if (ofertasFromUrl === 'true') {
      setOnlyDeals(true);
    } else if (ofertasFromUrl === 'false') {
      setOnlyDeals(false);
    }
  }, [categoriaFromUrl, ofertasFromUrl]);

  // Filtrado reactivo en vivo desde Zustand Store
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Filtrado por Categoría
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.handle === selectedCategory);
        if (cat && prod.categoryId !== cat.id) return false;
      }

      // Filtrado por Marca
      if (selectedBrand !== 'all') {
        const br = brands.find((b) => b.slug === selectedBrand);
        if (br && prod.brandId !== br.id) return false;
      }

      // Filtrado por Ofertas Flash (isDeal o compareAtPrice > price)
      if (onlyDeals) {
        const hasCompareDeal = (prod.variants[0]?.compareAtPriceDop || 0) > (prod.variants[0]?.priceDop || 0);
        if (!prod.isDeal && !hasCompareDeal) return false;
      }

      // Filtrado por Búsqueda
      if (searchFromUrl) {
        const q = searchFromUrl.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Rango de Precio
      const price = prod.variants[0]?.priceDop || 0;
      if (price > priceRange) {
        return false;
      }

      return true;
    });
  }, [products, categories, brands, selectedCategory, selectedBrand, onlyDeals, searchFromUrl, priceRange]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setIsLoadingMore(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setOnlyDeals(false);
    setPriceRange(120000);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 space-y-12">
      {/* Header del Catálogo */}
      <div className="space-y-4 border-b border-dark-border/80 pb-8">
        <nav className="text-xs font-semibold text-text-muted flex items-center gap-2">
          <span>Inicio</span>
          <span className="text-dark-border">/</span>
          <span className="text-brand-cyan font-bold">Catálogo Oficial</span>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-dark-border">/</span>
              <span className="text-brand-magenta font-black capitalize">
                {categories.find((c) => c.handle === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
          {onlyDeals && (
            <>
              <span className="text-dark-border">/</span>
              <span className="text-brand-magenta font-black">Ofertas Flash 🔥</span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Catálogo de <span className="text-logo-gradient">Gadgets Premium</span>
            </h1>
            <p className="text-sm text-text-muted mt-2 max-w-2xl">
              Equipos 100% originales con garantía oficial local de 1 año y entrega en 24h a toda República Dominicana.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-dark-border bg-dark-surface px-5 py-2.5 text-xs font-extrabold text-brand-cyan shadow-sm">
              {displayedProducts.length} de {filteredProducts.length} productos disponibles
            </span>
          </div>
        </div>

        {/* Barra de Filtros Rápidos por Categoría */}
        <div className="flex items-center gap-2.5 pt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              selectedCategory === 'all' && !onlyDeals
                ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple scale-105'
                : 'border border-dark-border bg-dark-surface text-text-muted hover:border-brand-cyan hover:text-white'
            }`}
          >
            Todos los Gadgets
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setOnlyDeals(false);
                setSelectedCategory(cat.handle);
              }}
              className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.handle && !onlyDeals
                  ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white shadow-glow-purple scale-105'
                  : 'border border-dark-border bg-dark-surface text-text-muted hover:border-brand-cyan hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => setOnlyDeals(!onlyDeals)}
            className={`rounded-2xl px-5 py-2.5 text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              onlyDeals
                ? 'bg-brand-magenta text-white shadow-glow-magenta scale-105'
                : 'border border-brand-magenta/40 bg-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta/20'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Ofertas Flash 🔥</span>
          </button>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        {/* Panel Lateral de Filtros */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-3xl border border-dark-border bg-dark-surface/80 p-8 shadow-xl backdrop-blur-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-dark-border/80 pb-4">
              <div className="flex items-center gap-2.5 font-black text-white text-sm">
                <SlidersHorizontal className="h-4 w-4 text-brand-cyan" />
                <span>Filtros Avanzados</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-brand-cyan hover:underline cursor-pointer"
              >
                Limpiar
              </button>
            </div>

            {/* Filtro de Ofertas Flash */}
            <div>
              <label
                onClick={() => setOnlyDeals(!onlyDeals)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4.5 transition-all duration-300 ${
                  onlyDeals
                    ? 'border-brand-magenta bg-brand-magenta/20 shadow-glow-magenta'
                    : 'border-dark-border bg-dark-obsidian/70 hover:border-brand-magenta/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-magenta/20 text-brand-magenta">
                    <Zap className="h-4 w-4 fill-current animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-white">
                      Solo Ofertas Flash
                    </span>
                    <span className="text-[10px] text-brand-magenta font-bold">Descuentos especiales</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded accent-brand-magenta h-4 w-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Filtro de Marcas Dinámico */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-muted">Filtrar por Marca</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-all text-center cursor-pointer ${
                    selectedBrand === 'all'
                      ? 'bg-brand-ultraviolet text-white shadow-glow-purple font-black'
                      : 'border border-dark-border bg-dark-obsidian text-text-muted hover:text-white'
                  }`}
                >
                  Todas
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.slug)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all text-center truncate cursor-pointer ${
                      selectedBrand === brand.slug
                        ? 'bg-brand-ultraviolet text-white shadow-glow-purple font-black'
                        : 'border border-dark-border bg-dark-obsidian text-text-muted hover:text-white'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de Precios */}
            <div className="border-t border-dark-border/80 pt-6 space-y-3">
              <div className="flex justify-between text-xs font-black text-white">
                <span>Precio Máximo</span>
                <span className="text-brand-cyan">RD$ {priceRange.toLocaleString('es-DO')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="120000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-cyan cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Listado de Productos */}
        <main className="lg:col-span-9 space-y-12">
          {displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-dark-border bg-dark-surface/40 p-20 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-dark-surface text-brand-cyan shadow-glow-cyan">
                <Filter className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-white">
                No se encontraron gadgets en esta selección
              </h3>
              <p className="text-xs text-text-muted max-w-sm">
                Prueba seleccionando otra categoría o limpiando los filtros activos.
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-6 py-3 text-xs font-black text-white shadow-glow-purple cursor-pointer"
              >
                Ver Todos los Gadgets
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}

          {/* Botón Cargar Más */}
          {displayedProducts.length > 0 && (
            <div className="flex flex-col items-center justify-center pt-10 border-t border-dark-border/80 space-y-4">
              <span className="text-xs font-semibold text-text-muted">
                Mostrando {displayedProducts.length} de {filteredProducts.length} productos
              </span>

              {hasMore && (
                <PrimaryButton
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-10 py-4 text-xs font-black cursor-pointer"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-brand-cyan mr-2" />
                      Cargando gadgets...
                    </>
                  ) : (
                    'Cargar más productos'
                  )}
                </PrimaryButton>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-xs font-bold text-brand-cyan">Cargando catálogo...</div>}>
      <ProductsCatalog />
    </Suspense>
  );
}
