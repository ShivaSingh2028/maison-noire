'use client';

import React, { useState } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import Editorial from '@/components/home/Editorial';
import NewArrivals from '@/components/home/NewArrivals';
import { Check } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setFeedbackMessage(data.message || 'Welcome to Maison Noire. Check your inbox.');
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    } catch {
      setFeedbackMessage('Welcome to Maison Noire. Check your inbox.');
      setSubscribed(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero />
      <FeaturedCollection />
      <CategoryShowcase />
      <Editorial />
      <NewArrivals />
      
      {/* Newsletter Section */}
      <section className="py-24 bg-noir text-parchment text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Join the Maison</h2>
          <p className="text-stone mb-8 max-w-md font-light text-sm md:text-base">
            Subscribe to receive updates on new arrivals, private salon invitations, and early access to seasonal collections.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-gold py-3 px-6 bg-charcoal/50 border border-gold/30 rounded-sm">
              <Check className="w-5 h-5" />
              <span className="text-sm tracking-wider uppercase">{feedbackMessage || 'Welcome to Maison Noire. Check your inbox.'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="flex-1 bg-transparent border border-stone/50 px-4 py-3 text-parchment focus:outline-none focus:border-gold placeholder:text-stone/70 transition-colors text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-parchment text-noir px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
