'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice, cn } from '@/lib/utils';
import { Plus, Minus, ChevronDown, Check, Share2, X } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, dispatch } = useCart();
  
  const sizeVariants = product.variants?.filter((v) => v.type === 'size') || [];
  const colorVariants = product.variants?.filter((v) => v.type === 'color') || [];
  
  const colorsList = colorVariants.length > 0 
    ? colorVariants.map((v) => v.label)
    : product.colors || [];
    
  const sizesList = sizeVariants.length > 0
    ? sizeVariants
    : (product.sizes || []).map((s) => ({ label: s, value: s.toLowerCase(), available: true, type: 'size' as const }));

  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizesList.find((s) => s.available)?.label || null
  );
  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const [expandedSection, setExpandedSection] = useState<string | null>('details');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isOutOfStock = !product.inStock || (product.inventory !== undefined && product.inventory <= 0);
  const isLowStock = Boolean(product.inventory && product.inventory > 0 && product.inventory < 5);
  const maxStock = product.inventory ?? 10;

  const handleAddToCart = () => {
    if (sizesList.length > 0 && !selectedSize) return;
    if (isOutOfStock) return;

    setIsAdding(true);
    
    setTimeout(() => {
      const selectedVariants: Record<string, string> = {};
      if (selectedSize) selectedVariants.size = selectedSize;
      if (selectedColor && selectedColor !== 'Default') selectedVariants.color = selectedColor;

      addItem(product, quantity, selectedVariants);

      if (dispatch) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            product,
            quantity,
            selectedVariants,
          },
        });
      }
      
      setIsAdding(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 400);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-stone tracking-wide flex items-center gap-2">
        <Link href="/" className="hover:text-noir transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`} className="hover:text-noir transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-noir truncate">{product.name}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-noir mb-3">{product.name}</h1>
        <div className="flex items-center gap-4 text-lg">
          <span className="text-noir font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-stone line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
          {isLowStock && <span className="text-xs text-gold tracking-widest uppercase font-semibold">Low Stock</span>}
        </div>
      </div>

      {/* Description */}
      <p className="text-charcoal leading-relaxed text-sm md:text-base">
        {product.description}
      </p>

      {/* Selectors */}
      <div className="flex flex-col gap-6">
        {/* Colors */}
        {colorsList.length > 0 && colorsList[0] !== 'Default' && (
          <div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-noir font-medium tracking-wide uppercase">Color</span>
              <span className="text-stone capitalize">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colorsList.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer",
                    selectedColor === color ? "border-noir p-0.5" : "border-transparent hover:border-stone/50"
                  )}
                  aria-label={`Select color ${color}`}
                  title={color}
                >
                  <span 
                    className="block w-full h-full rounded-full border border-black/10" 
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'noir' ? '#0A0A0A' : 
                                     color.toLowerCase() === 'stone' ? '#8B8178' : 
                                     color.toLowerCase() === 'parchment' ? '#F5F0EB' : 
                                     color.toLowerCase() === 'charcoal' ? '#2C2C2C' :
                                     color.toLowerCase() === 'gold' ? '#C4A882' :
                                     color.toLowerCase() === 'white' ? '#FFFFFF' : color 
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizesList.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-noir font-medium tracking-wide uppercase">Size</span>
              <button 
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-stone underline hover:text-noir transition-colors text-xs cursor-pointer"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {sizesList.map((sizeVariant) => {
                const isAvailable = sizeVariant.available;
                const label = sizeVariant.label;
                return (
                  <button
                    type="button"
                    key={label}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(label)}
                    className={cn(
                      "py-3 text-sm uppercase tracking-wider border transition-all cursor-pointer",
                      !isAvailable ? "opacity-30 cursor-not-allowed line-through border-stone/20 text-stone" :
                      selectedSize === label ? "border-noir bg-noir text-white font-medium" : "border-stone/30 text-noir hover:border-noir"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <div className="mb-3 text-xs text-noir font-medium tracking-wider uppercase">Quantity</div>
          <div className="flex items-center border border-stone/30 w-32">
            <button 
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-noir hover:bg-parchment transition-colors disabled:opacity-50 cursor-pointer"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
            <button 
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="w-10 h-10 flex items-center justify-center text-noir hover:bg-parchment transition-colors disabled:opacity-50 cursor-pointer"
              disabled={quantity >= maxStock}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Action */}
      <div className="pt-4 border-t border-stone/20">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding || (sizesList.length > 0 && !selectedSize)}
          className={cn(
            "w-full py-4 px-6 flex items-center justify-center text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer font-medium",
            isOutOfStock ? "bg-stone/20 text-stone cursor-not-allowed" :
            isSuccess ? "bg-emerald-800 text-white" :
            (sizesList.length > 0 && !selectedSize) ? "bg-noir/50 text-white cursor-not-allowed" :
            "bg-noir text-white hover:bg-charcoal active:scale-[0.99]"
          )}
        >
          {isOutOfStock ? 'Sold Out' :
           isSuccess ? <span className="flex items-center gap-2"><Check className="w-5 h-5 text-white" /> Added to Bag</span> :
           isAdding ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
           (sizesList.length > 0 && !selectedSize) ? 'Select a Size' :
           'Add to Cart'}
        </button>
      </div>

      {/* Accordions */}
      <div className="border-t border-stone/20 mt-4">
        {[
          { id: 'details', title: 'Product Details', content: (
            <div className="space-y-4">
              {product.material && <p><strong className="font-medium text-noir">Material:</strong> {product.material}</p>}
              {product.fit && <p><strong className="font-medium text-noir">Fit:</strong> {product.fit}</p>}
              {product.details && product.details.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {product.details.map((detail, idx) => <li key={idx}>{detail}</li>)}
                </ul>
              )}
            </div>
          )},
          { id: 'care', title: 'Care Instructions', content: (
            <ul className="list-disc pl-5 space-y-1">
              {product.care?.map((item, idx) => <li key={idx}>{item}</li>) || <li>Dry clean only.</li>}
            </ul>
          )},
          { id: 'shipping', title: 'Shipping & Returns', content: (
            <div className="space-y-3">
              <p>Complimentary express shipping on all orders over $500.</p>
              <p>Orders typically arrive within 3-5 business days.</p>
              <p>Returns accepted within 14 days of delivery for unworn items with tags attached.</p>
            </div>
          )}
        ].map((section) => (
          <div key={section.id} className="border-b border-stone/20">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full py-4 flex items-center justify-between text-sm tracking-wide uppercase text-noir hover:text-charcoal transition-colors cursor-pointer"
            >
              {section.title}
              <motion.div animate={{ rotate: expandedSection === section.id ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-stone" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm text-charcoal leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Share */}
      <div className="flex items-center gap-3 pt-4">
        <span className="text-xs uppercase tracking-widest text-stone">Share</span>
        <button 
          type="button"
          onClick={handleShare}
          className="text-stone hover:text-noir transition-colors cursor-pointer" 
          aria-label="Share product"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-6 right-6 text-stone hover:text-noir cursor-pointer"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-noir mb-2">Size Guide</h3>
            <p className="text-xs text-stone mb-6">Measurements in inches. True to luxury European tailoring.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone/30 text-stone uppercase tracking-wider">
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Bust/Chest</th>
                    <th className="py-2.5">Waist</th>
                    <th className="py-2.5">Hips</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/10">
                  <tr><td className="py-2.5 font-medium">XS</td><td>32 - 34</td><td>25 - 26</td><td>35 - 36</td></tr>
                  <tr><td className="py-2.5 font-medium">S</td><td>34 - 36</td><td>27 - 28</td><td>37 - 38</td></tr>
                  <tr><td className="py-2.5 font-medium">M</td><td>36 - 38</td><td>29 - 30</td><td>39 - 40</td></tr>
                  <tr><td className="py-2.5 font-medium">L</td><td>38 - 40</td><td>31 - 32</td><td>41 - 42</td></tr>
                  <tr><td className="py-2.5 font-medium">XL</td><td>40 - 42</td><td>33 - 34</td><td>43 - 44</td></tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="mt-6 w-full bg-noir text-parchment py-3 text-xs uppercase tracking-widest font-medium hover:bg-charcoal cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
