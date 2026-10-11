'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'applied' | 'error'>('idle');

  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.toLowerCase() === 'maison10') {
      setPromoStatus('applied');
    } else {
      setPromoStatus('error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-parchment rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-stone" strokeWidth={1} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-noir mb-4">Your bag is empty</h1>
          <p className="text-stone mb-8 max-w-md">
            Looks like you haven't added anything to your bag yet. Discover our latest collections.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-noir text-white px-8 py-4 rounded-sm hover:bg-charcoal transition-colors duration-300"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Breadcrumbs */}
      <nav className="text-sm text-stone mb-8 flex items-center space-x-2">
        <Link href="/" className="hover:text-noir transition-colors">Home</Link>
        <span>/</span>
        <span className="text-noir">Shopping Bag</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-5xl text-noir mb-10">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items - Left Column */}
        <div className="w-full lg:w-[65%]">
          <div className="border-t border-parchment">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.color}-${item.size}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex py-8 border-b border-parchment group overflow-hidden"
                >
                  {/* Product Image */}
                  <Link href={`/shop/${item.slug || item.product?.slug}`} className="block shrink-0 relative w-24 h-32 md:w-32 md:h-44 bg-parchment rounded-sm overflow-hidden">
                    <SafeImage 
                      src={item.image || item.product?.images?.[0]?.src || ''} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="ml-6 flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/shop/${item.slug || item.product?.slug}`}>
                          <h3 className="text-lg text-noir hover:text-gold transition-colors font-medium">{item.name}</h3>
                        </Link>
                        <div className="mt-1 text-sm text-stone flex flex-wrap gap-2">
                          {item.color && (
                            <span className="capitalize">Color: {item.color}</span>
                          )}
                          {item.color && item.size && <span>|</span>}
                          {item.size && (
                            <span className="uppercase">Size: {item.size}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-noir">{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone/30 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-stone hover:text-noir transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-stone hover:text-noir transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-stone hover:text-red-500 flex items-center text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden md:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-8">
            <Link href="/shop" className="inline-flex items-center text-sm text-stone hover:text-noir transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary - Right Column */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-cream rounded-sm p-6 md:p-8 sticky top-24">
            <h2 className="font-serif text-2xl text-noir mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6 border-b border-parchment pb-6">
              <div className="flex justify-between text-noir">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-noir">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone text-right -mt-2">Free shipping on orders over $500</p>
              )}
              <div className="flex justify-between text-noir">
                <span>Estimated Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-medium text-lg text-noir">Total</span>
              <span className="font-medium text-lg text-noir">{formatPrice(total)}</span>
            </div>

            {/* Promo Code */}
            <form onSubmit={handleApplyPromo} className="mb-8">
              <label htmlFor="promo" className="block text-sm text-stone mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-parchment rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-stone focus:ring-1 focus:ring-stone transition-all"
                  placeholder="Enter code"
                />
                <button 
                  type="submit"
                  className="bg-stone text-white px-4 py-2 rounded-sm text-sm hover:bg-charcoal transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoStatus === 'applied' && (
                <p className="text-green-600 text-xs mt-2">Promo code applied successfully.</p>
              )}
              {promoStatus === 'error' && (
                <p className="text-red-500 text-xs mt-2">Invalid promo code.</p>
              )}
            </form>

            <Link 
              href="/checkout"
              className="block w-full bg-noir text-white text-center py-4 rounded-sm hover:bg-charcoal transition-colors duration-300 font-medium tracking-wide mb-6"
            >
              Proceed to Checkout
            </Link>

            <div className="text-center">
              <p className="text-xs text-stone mb-2">Accepted Payment Methods</p>
              <div className="flex justify-center gap-4 text-xs text-stone/80">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Amex</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
