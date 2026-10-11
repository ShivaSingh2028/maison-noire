'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { searchProducts } from '@/data/products';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';

const NAVIGATION_LINKS = [
  { name: 'Shop All', href: '/shop' },
  { name: 'Coats', href: '/shop?category=coats-outerwear' },
  { name: 'Dresses', href: '/shop?category=dresses' },
  { name: 'Knitwear', href: '/shop?category=knitwear' },
  { name: 'Accessories', href: '/shop?category=accessories' },
  { name: 'Shoes', href: '/shop?category=shoes' },
];

export default function Header() {
  const { cartCount, toggleCartDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchProducts(searchQuery).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, searchOpen]);

  const closeAll = () => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-white">
        <div className="bg-noir text-parchment text-[11px] py-2 text-center tracking-[0.2em] font-sans">
          COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER $500 &bull; ATELIER PARIS
        </div>

        <header
          className={`w-full transition-all duration-300 border-b ${
            scrolled ? 'bg-white/95 backdrop-blur-md border-stone/20 shadow-sm' : 'bg-white border-parchment'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link href="/" className="font-serif text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity" onClick={closeAll}>
                MAISON NOIRE
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm tracking-wide uppercase hover:text-stone transition-colors font-sans"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center justify-end lg:flex-1 space-x-4 lg:space-x-6">
              <button
                type="button"
                className="text-current hover:text-stone transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                onClick={() => setSearchOpen(true)}
              >
                <span className="sr-only">Search</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                type="button"
                className="text-current hover:text-stone transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                onClick={toggleCartDrawer}
              >
                <span className="sr-only">Cart</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-noir text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-sans">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-noir/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-cream transform transition ease-in-out duration-300">
            <div className="px-4 pt-5 pb-2 flex items-center justify-between border-b border-parchment">
              <span className="font-serif text-xl tracking-widest uppercase">MAISON NOIRE</span>
              <button
                type="button"
                className="-m-2 p-2 text-foreground focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-6 px-4 space-y-6 overflow-y-auto font-sans">
              {NAVIGATION_LINKS.map((link) => (
                <div key={link.name} className="flow-root">
                  <Link
                    href={link.href}
                    className="-m-2 p-2 block text-lg font-medium tracking-wide uppercase hover:bg-parchment rounded-sm transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-end mb-8">
              <button
                type="button"
                className="text-charcoal hover:text-noir focus:outline-none"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
              >
                <span className="sr-only">Close search</span>
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative border-b-2 border-noir pb-2">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                className="w-full bg-transparent text-3xl font-serif placeholder-stone/50 border-none outline-none focus:ring-0 px-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery && (
              <div className="mt-12">
                <h3 className="text-sm uppercase tracking-widest text-stone mb-6 font-sans">Results for &quot;{searchQuery}&quot;</h3>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResults.map((product) => {
                      const prodImg = product.images?.[0]?.src || '';
                      return (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          className="group flex flex-col"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="relative aspect-[3/4] overflow-hidden bg-parchment mb-4">
                            {prodImg && (
                              <SafeImage
                                src={prodImg}
                                alt={product.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                            )}
                          </div>
                          <h4 className="font-serif text-lg group-hover:text-stone transition-colors">{product.name}</h4>
                          <p className="text-sm text-charcoal mt-1 font-sans">{formatPrice(product.price)}</p>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-lg text-charcoal font-sans">No products found. Please try a different search term.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
