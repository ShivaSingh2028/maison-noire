'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-stone/20 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl text-noir mb-4">You May Also Like</h2>
          <div className="w-12 h-[1px] bg-gold mx-auto" />
        </div>
        
        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-8 md:p-0 md:m-0 gap-4 md:grid md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="w-[75vw] md:w-auto shrink-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
