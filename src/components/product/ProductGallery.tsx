'use client';

import React, { useState, useRef } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/types';

interface ProductGalleryProps {
  images: (string | ProductImage)[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const imageList: string[] = (images || []).map((img) =>
    typeof img === 'string' ? img : img.src
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (!imageList || imageList.length === 0) {
    return (
      <div className="aspect-[3/4] bg-parchment animate-pulse flex items-center justify-center text-stone font-serif">
        Image unavailable
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 sticky top-24">
      {/* Thumbnails (Desktop) */}
      <div className="hidden md:flex flex-col gap-4 w-20 lg:w-24 shrink-0">
        {imageList.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden transition-all cursor-pointer",
              activeIndex === idx ? "opacity-100 ring-1 ring-noir ring-offset-2" : "opacity-60 hover:opacity-100"
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <SafeImage src={img} alt={`${productName} thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="relative w-full flex-1">
        {/* Mobile Swipeable Gallery */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 gap-4">
          {imageList.map((img, idx) => (
            <div key={`${img}-mobile-${idx}`} className="relative w-full shrink-0 snap-center aspect-[3/4]">
              <SafeImage src={img} alt={`${productName} - Image ${idx + 1}`} fill className="object-cover" priority={idx === 0} />
            </div>
          ))}
        </div>

        {/* Mobile Indicator */}
        <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs tracking-widest text-noir font-medium flex items-center justify-center rounded-sm">
           Swipe
        </div>

        {/* Desktop Main Image with Hover Zoom */}
        <div 
          ref={containerRef}
          className="hidden md:block relative aspect-[3/4] w-full overflow-hidden bg-parchment cursor-crosshair group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <SafeImage 
                src={imageList[activeIndex] || imageList[0]} 
                alt={`${productName} - Main Image`} 
                fill 
                className={cn(
                  "object-cover transition-transform duration-200 ease-out",
                  isZoomed ? "scale-[1.5]" : "scale-100"
                )}
                style={
                  isZoomed 
                    ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } 
                    : { transformOrigin: 'center center' }
                }
                priority 
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
