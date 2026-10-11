'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full flex flex-col justify-center overflow-hidden bg-noir">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop&q=85")',
          transform: mounted ? 'scale(1)' : 'scale(1.05)'
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-noir/40 via-noir/20 to-noir/60" />
      
      <div className="relative z-20 container mx-auto px-6 lg:px-12 pt-20">
        <div className="max-w-3xl flex flex-col items-start text-parchment">
          <p 
            className={`text-sm tracking-widest uppercase mb-4 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Autumn/Winter 2026 Collection
          </p>
          <h1 
            className={`font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            The Art of Essential Luxury
          </h1>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link 
              href="/shop" 
              className="bg-parchment text-noir px-8 py-4 text-sm font-medium tracking-wide hover:bg-white transition-colors text-center"
            >
              Shop the Collection
            </Link>
            <button 
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }}
              className="border border-parchment text-parchment px-8 py-4 text-sm font-medium tracking-wide hover:bg-parchment/10 transition-colors text-center"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
