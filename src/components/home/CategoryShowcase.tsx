'use client';

import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { categories } from '@/data/products';

const categoryImages: Record<string, string> = {
  'coats-outerwear': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop&q=80',
  'dresses': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop&q=80',
  'knitwear': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=80',
  'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&q=80',
  'shoes': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&q=80'
};

const defaultCategories = [
  { id: 'coats-outerwear', name: 'Coats & Outerwear', slug: 'coats-outerwear' },
  { id: 'dresses', name: 'Dresses', slug: 'dresses' },
  { id: 'knitwear', name: 'Knitwear', slug: 'knitwear' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
  { id: 'shoes', name: 'Shoes', slug: 'shoes' },
];

export default function CategoryShowcase() {
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-24 bg-white text-noir overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <h2 className="font-serif text-4xl md:text-5xl mb-12 text-center">Shop by Category</h2>
        
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 pb-8 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {displayCategories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/shop?category=${category.slug}`}
              className="group relative flex-none w-[70vw] md:w-auto aspect-[3/4] overflow-hidden snap-center"
            >
              <SafeImage
                src={categoryImages[category.slug] || categoryImages['accessories']}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 70vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <h3 className="text-parchment font-serif text-2xl md:text-xl lg:text-2xl text-center shadow-sm">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
