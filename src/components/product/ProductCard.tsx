"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const mainImage = product.images[0];
  const hoverImage = product.images.length > 1 ? product.images[1] : mainImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default to first available size or color
    const defaultVariants: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      const firstAvailableSize = product.variants.find(
        (v) => v.type === "size" && v.available
      );
      if (firstAvailableSize) {
        defaultVariants.size = firstAvailableSize.label;
      }
      const firstAvailableColor = product.variants.find(
        (v) => v.type === "color" && v.available
      );
      if (firstAvailableColor) {
        defaultVariants.color = firstAvailableColor.label;
      }
    }

    addItem(product, 1, defaultVariants);
  };

  return (
    <div
      className={cn("group flex flex-col relative bg-white", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link href={`/shop/${product.slug}`} className="block w-full h-full">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-noir text-parchment text-[10px] uppercase tracking-wider py-1 px-2 rounded-sm font-medium">
                New
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 z-10">
            {product.originalPrice && (
              <span className="bg-gold text-parchment text-[10px] uppercase tracking-wider py-1 px-2 rounded-sm font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Images */}
          <div className="relative w-full h-full">
            {mainImage && (
              <SafeImage
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-in-out",
                  isHovered && product.images.length > 1 ? "opacity-0" : "opacity-100",
                  isHovered && product.images.length === 1 ? "scale-105 transition-transform" : ""
                )}
              />
            )}
            {product.images.length > 1 && hoverImage && (
              <SafeImage
                src={hoverImage.src}
                alt={hoverImage.alt || `${product.name} alternate view`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "object-cover absolute inset-0 transition-opacity duration-500 ease-in-out",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        </Link>

        {/* Quick Add Button (Desktop Hover) */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 ease-in-out opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 hidden md:block z-20 pointer-events-none md:group-hover:pointer-events-auto"
          )}
        >
          <button
            type="button"
            className="w-full bg-parchment/95 backdrop-blur-sm text-noir py-3 text-xs uppercase tracking-widest font-semibold hover:bg-noir hover:text-parchment transition-all duration-200 border border-stone/20 shadow-lg cursor-pointer"
            onClick={handleQuickAdd}
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-serif text-lg text-noir leading-tight">
              <Link href={`/shop/${product.slug}`} className="hover:text-stone transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="text-xs text-stone mt-1 uppercase tracking-wider">{product.category}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {product.originalPrice ? (
            <>
              <span className="text-noir font-medium">{formatPrice(product.price)}</span>
              <span className="text-stone line-through text-sm">{formatPrice(product.originalPrice)}</span>
            </>
          ) : (
            <span className="text-noir font-medium">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Mobile Quick Add */}
        <button
          type="button"
          className="mt-4 w-full bg-noir text-parchment py-2.5 text-xs font-medium uppercase tracking-widest md:hidden cursor-pointer active:bg-charcoal"
          onClick={handleQuickAdd}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
