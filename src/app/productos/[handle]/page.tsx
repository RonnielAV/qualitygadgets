import React from 'react';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((prod) => ({
    handle: prod.handle,
  }));
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = MOCK_PRODUCTS.find((p) => p.handle === params.handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category.id === product.category.id
  ).slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      <ProductDetailView product={product} />

      {/* Gadgets Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-dark-border/80 pt-16">
          <h2 className="text-2xl font-black text-white">
            Gadgets Relacionados Recomendados
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
