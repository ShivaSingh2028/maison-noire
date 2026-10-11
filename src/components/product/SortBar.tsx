"use client";

import React from "react";
import { SortOption } from "@/types";

interface SortBarProps {
  productCount: number;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onOpenMobileFilters: () => void;
}

export default function SortBar({
  productCount,
  sortOption,
  setSortOption,
  onOpenMobileFilters,
}: SortBarProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-cream mb-8 gap-4">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-noir"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filter
        </button>
        <span className="text-stone text-sm hidden lg:block">
          Showing {productCount} product{productCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <span className="text-stone text-sm lg:hidden">
          {productCount} product{productCount !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-stone uppercase tracking-widest hidden sm:block">
            Sort By
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-transparent border border-cream py-2 pl-4 pr-10 text-sm text-noir focus:outline-none focus:border-stone focus:ring-0 cursor-pointer rounded-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
