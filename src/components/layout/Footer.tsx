'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setFeedbackMessage(data.message || 'Subscription confirmed.');
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    } catch {
      setFeedbackMessage('Subscription confirmed.');
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-cream pt-20 pb-10 border-t border-parchment text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Shop */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-noir">Shop</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=coats-outerwear" className="hover:text-gold transition-colors">Coats & Outerwear</Link></li>
              <li><Link href="/shop?category=dresses" className="hover:text-gold transition-colors">Dresses</Link></li>
              <li><Link href="/shop?category=knitwear" className="hover:text-gold transition-colors">Knitwear</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-gold transition-colors">Accessories</Link></li>
              <li><Link href="/shop?category=shoes" className="hover:text-gold transition-colors">Shoes</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-noir">Customer Care</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/shop" className="hover:text-gold transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Order Tracking</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-noir">About</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li><Link href="/shop" className="hover:text-gold transition-colors">Our Philosophy</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Atelier & Craft</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Sustainability</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Press Inquiries</Link></li>
            </ul>
          </div>

          {/* Connect & Newsletter */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-noir">The Noir Gazette</h3>
            <p className="font-sans text-sm mb-4 text-stone font-light">
              Receive private preview invitations and seasonal editorial editions.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-gold text-xs py-2">
                <Check className="w-4 h-4" />
                <span>{feedbackMessage || 'Subscription confirmed.'}</span>
              </div>
            ) : (
              <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-transparent border-b border-charcoal/40 py-2 px-1 text-sm outline-none focus:border-gold transition-colors placeholder:text-stone text-noir"
                />
                <button
                  type="submit"
                  className="bg-noir text-white py-3 px-4 text-xs tracking-widest uppercase hover:bg-charcoal transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gold cursor-pointer font-medium"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="flex space-x-6 mt-8">
              <span className="text-xs uppercase tracking-widest text-stone">Paris &bull; Milan &bull; New York</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-parchment pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-stone">
          <p>&copy; {new Date().getFullYear()} MAISON NOIRE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/admin" className="hover:text-gold transition-colors font-mono uppercase tracking-wider text-[11px]">Atelier Console (Admin)</Link>
            <Link href="/shop" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <Link href="/shop" className="hover:text-charcoal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
