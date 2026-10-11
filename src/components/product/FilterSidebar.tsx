"use client";

import React, { useEffect } from "react";
import { FilterState } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const priceRanges = [
  { label: "Under $300", min: 0, max: 300 },
  { label: "$300 - $500", min: 300, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: Infinity },
];

const sizes = ["XS", "S", "M", "L", "XL", "OS"];

export default function FilterSidebar({
  filters,
  setFilters,
  categories,
  isOpen,
  setIsOpen,
}: FilterSidebarProps) {
  
  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const current = prev.categories || [];
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { ...prev, categories: updated };
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => {
      // Toggle logic: if already selected, clear it
      if (prev.minPrice === min && prev.maxPrice === max) {
        return { ...prev, minPrice: undefined, maxPrice: undefined };
      }
      return { ...prev, minPrice: min, maxPrice: max };
    });
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => {
      const current = prev.sizes || [];
      const updated = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      return { ...prev, sizes: updated };
    });
  };

  const handleClearAll = () => {
    setFilters({
      categories: [],
      priceRange: [0, 5000],
      minPrice: undefined,
      maxPrice: undefined,
      sizes: [],
      colors: [],
      inStock: false,
      sort: filters.sort || 'featured',
    });
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-10 p-6 lg:p-0 h-full overflow-y-auto">
      <div className="flex items-center justify-between lg:hidden mb-2">
        <h2 className="font-serif text-2xl text-noir">Filters</h2>
        <button onClick={() => setIsOpen(false)} className="text-stone hover:text-noir p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-noir border-b border-cream pb-2">Category</h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border border-stone group-hover:border-noir transition-colors">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(filters.categories || []).includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {(filters.categories || []).includes(category) && (
                    <div className="w-2.5 h-2.5 bg-noir" />
                  )}
                </div>
                <span className="text-sm text-charcoal group-hover:text-noir transition-colors">
                  {category}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-noir border-b border-cream pb-2">Price</h3>
        <ul className="space-y-3">
          {priceRanges.map((range, idx) => {
            const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <li key={idx}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 border border-stone group-hover:border-noir transition-colors rounded-full">
                    <input
                      type="radio"
                      name="price-range"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handlePriceChange(range.min, range.max)}
                    />
                    {isSelected && <div className="w-2.5 h-2.5 bg-noir rounded-full" />}
                  </div>
                  <span className="text-sm text-charcoal group-hover:text-noir transition-colors">
                    {range.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Size */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-noir border-b border-cream pb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = (filters.sizes || []).includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={cn(
                  "w-10 h-10 border flex items-center justify-center text-xs uppercase tracking-wider transition-colors",
                  isSelected
                    ? "border-noir bg-noir text-parchment"
                    : "border-cream bg-white text-charcoal hover:border-stone"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-noir border-b border-cream pb-2">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-8 h-4 bg-cream rounded-full overflow-hidden transition-colors">
            <input
              type="checkbox"
              className="sr-only"
              checked={filters.inStock || false}
              onChange={() => setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))}
            />
            <div className={cn(
              "absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300",
              filters.inStock ? "translate-x-4 bg-noir" : ""
            )} />
            <div className={cn(
              "absolute inset-0 transition-opacity duration-300",
              filters.inStock ? "bg-stone opacity-20" : "opacity-0"
            )} />
          </div>
          <span className="text-sm text-charcoal group-hover:text-noir transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      <div className="pt-6 border-t border-cream lg:pb-12">
        <button
          onClick={handleClearAll}
          className="w-full py-3 border border-noir text-noir text-sm uppercase tracking-widest hover:bg-noir hover:text-parchment transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-noir/40 z-40 transition-opacity duration-300",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-[300px] max-w-[80vw] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <FilterContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <FilterContent />
        </div>
      </div>
    </>
  );
}
