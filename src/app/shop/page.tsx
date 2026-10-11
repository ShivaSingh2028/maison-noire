"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductGrid from "@/components/product/ProductGrid";
import SortBar from "@/components/product/SortBar";
import { FilterState, SortOption, Product } from "@/types";
import { products, categories, filterProducts, sortProducts } from "@/data/products";

const initialFilterState: FilterState = {
  categories: [],
  priceRange: [0, 5000],
  minPrice: undefined,
  maxPrice: undefined,
  sizes: [],
  colors: [],
  inStock: false,
  sort: "featured",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryNames = categories.map((c) => c.name);

  // Initialize filters from URL
  useEffect(() => {
    if (categoryParam) {
      const match = categories.find(
        (c) => c.slug === categoryParam || c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) {
        setFilters((prev) => ({ ...prev, categories: [match.name] }));
      }
    } else {
      setFilters(initialFilterState);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [categoryParam]);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterProducts(products, filters);
    result = sortProducts(result, sortOption);
    setFilteredProducts(result);
  }, [filters, sortOption]);

  const activeCategoryName = filters.categories && filters.categories.length === 1 
    ? filters.categories[0] 
    : "Shop All";

  const hasActiveFilters = 
    (filters.categories && filters.categories.length > 0) ||
    (filters.sizes && filters.sizes.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-parchment py-16 md:py-24 text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-noir mb-4">{activeCategoryName}</h1>
        <p className="text-stone max-w-2xl mx-auto text-sm md:text-base font-light">
          Discover our curated collection of contemporary luxury pieces.
          Every garment is crafted with meticulous attention to detail and sustainable practices.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categoryNames}
            isOpen={isMobileFilterOpen}
            setIsOpen={setIsMobileFilterOpen}
          />

          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            <SortBar
              productCount={filteredProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            />

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                {(filters.categories || []).map((cat) => (
                  <span key={cat} className="inline-flex items-center px-3 py-1 bg-cream text-xs text-charcoal border border-stone/20">
                    {cat}
                    <button 
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, categories: prev.categories?.filter((c) => c !== cat) }))} 
                      className="ml-2 hover:text-noir cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(filters.sizes || []).map((size) => (
                  <span key={size} className="inline-flex items-center px-3 py-1 bg-cream text-xs text-charcoal border border-stone/20">
                    Size: {size}
                    <button 
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, sizes: prev.sizes?.filter((s) => s !== size) }))} 
                      className="ml-2 hover:text-noir cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.minPrice !== undefined && filters.maxPrice !== undefined && (
                  <span className="inline-flex items-center px-3 py-1 bg-cream text-xs text-charcoal border border-stone/20">
                    ${filters.minPrice} - ${filters.maxPrice === Infinity ? "Over $1000" : `$${filters.maxPrice}`}
                    <button 
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }))} 
                      className="ml-2 hover:text-noir cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center px-3 py-1 bg-cream text-xs text-charcoal border border-stone/20">
                    In Stock Only
                    <button 
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, inStock: false }))} 
                      className="ml-2 hover:text-noir cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button 
                  type="button"
                  onClick={() => setFilters(initialFilterState)} 
                  className="text-xs text-stone hover:text-noir underline underline-offset-2 ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            <ProductGrid products={filteredProducts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone border-t-noir rounded-full animate-spin"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
