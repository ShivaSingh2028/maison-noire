'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isCartDrawerOpen, toggleCartDrawer, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        toggleCartDrawer();
      }
    };

    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCartDrawerOpen, toggleCartDrawer]);

  const FREE_SHIPPING_THRESHOLD = 500;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const progressPercentage = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-noir/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isCartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCartDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-500 ease-in-out ${
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-parchment">
          <h2 id="cart-title" className="font-serif text-xl tracking-widest uppercase text-noir">Your Cart</h2>
          <button
            type="button"
            className="text-stone hover:text-noir transition-colors p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-gold"
            onClick={toggleCartDrawer}
          >
            <span className="sr-only">Close cart</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shipping Progress */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 bg-cream border-b border-parchment">
            <p className="text-sm font-sans text-center mb-2 text-charcoal">
              {amountToFreeShipping > 0 ? (
                <>You are <span className="font-medium text-noir">{formatPrice(amountToFreeShipping)}</span> away from complimentary shipping.</>
              ) : (
                <span className="font-medium text-noir">You have unlocked complimentary shipping!</span>
              )}
            </p>
            <div className="h-1 bg-parchment w-full rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-24 h-24 rounded-full bg-parchment flex items-center justify-center">
                <svg className="w-10 h-10 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-serif text-lg text-noir">Your cart is empty.</p>
              <button
                onClick={toggleCartDrawer}
                className="text-sm uppercase tracking-widest text-gold hover:text-noir transition-colors font-medium pb-1 border-b border-gold hover:border-noir"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => {
                const itemImg = item.image || item.product?.images?.[0]?.src || '';
                const itemPrice = item.price ?? item.product?.price ?? 0;
                const itemSize = item.size || item.selectedVariants?.size;
                const itemColor = item.color || item.selectedVariants?.color;

                return (
                  <li key={item.id} className="flex py-2">
                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-parchment relative">
                      {itemImg && (
                        <SafeImage
                          src={itemImg}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-1 flex-col justify-between font-sans">
                      <div>
                        <div className="flex justify-between text-base font-medium text-noir">
                          <h3 className="font-serif leading-tight">
                            <Link href={`/shop/${item.slug || item.product.slug}`} onClick={toggleCartDrawer} className="hover:text-gold transition-colors">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{formatPrice(itemPrice)}</p>
                        </div>
                        <div className="mt-1 text-sm text-stone flex space-x-2">
                          {itemSize && <span>Size: {itemSize}</span>}
                          {itemSize && itemColor && <span>|</span>}
                          {itemColor && <span>Color: {itemColor}</span>}
                        </div>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-parchment">
                          <button
                            type="button"
                            className="px-3 py-1 text-charcoal hover:text-noir hover:bg-parchment transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-center min-w-[2rem] text-noir">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-3 py-1 text-charcoal hover:text-noir hover:bg-parchment transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          className="text-xs uppercase tracking-widest text-stone hover:text-noir transition-colors underline underline-offset-4 cursor-pointer"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-parchment px-6 py-6 bg-white">
            <div className="flex justify-between text-base font-serif text-noir mb-6">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={toggleCartDrawer}
                className="flex items-center justify-center w-full bg-noir text-white py-4 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-noir"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={toggleCartDrawer}
                className="flex items-center justify-center w-full bg-white border border-noir text-noir py-4 text-sm tracking-widest uppercase hover:bg-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-noir"
              >
                View Cart
              </Link>
            </div>
            <p className="mt-4 text-xs text-center text-stone font-sans">
              Shipping and taxes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
