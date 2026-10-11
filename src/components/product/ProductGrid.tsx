import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-4">
            <div className="aspect-[3/4] bg-cream w-full rounded-sm"></div>
            <div className="space-y-2">
              <div className="h-4 bg-cream w-3/4"></div>
              <div className="h-3 bg-cream w-1/2"></div>
              <div className="h-4 bg-cream w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 border-2 border-stone rounded-full flex items-center justify-center mb-6">
          <span className="text-stone text-2xl font-serif">!</span>
        </div>
        <h3 className="font-serif text-2xl text-noir mb-2">No products found</h3>
        <p className="text-stone max-w-md">
          We couldn&apos;t find any products matching your current filters. Try adjusting or clearing some filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
