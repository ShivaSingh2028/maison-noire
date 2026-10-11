'use client';

import { useRef } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { getNewArrivals } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewArrivals() {
  const products = getNewArrivals();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-cream text-noir overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-4xl md:text-5xl">New Arrivals</h2>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-stone/30 rounded-full hover:border-noir hover:bg-noir hover:text-parchment transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-stone/30 rounded-full hover:border-noir hover:bg-noir hover:text-parchment transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div key={product.id} className="group flex-none w-[85vw] sm:w-[350px] snap-start">
              <Link href={`/shop/${product.slug}`} className="block relative aspect-[3/4] w-full overflow-hidden mb-4 bg-stone/10">
                <div className="absolute top-4 left-4 z-10 bg-noir text-parchment text-xs uppercase tracking-widest py-1 px-3">
                  New
                </div>
                <SafeImage
                  src={product.images[0]?.src || ''}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 85vw, 350px"
                />
              </Link>
              <div>
                <h3 className="text-lg">{product.name}</h3>
                <p className="text-stone mt-1">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
