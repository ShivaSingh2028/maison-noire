'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lock, CheckCircle2, ShieldAlert, ShoppingBag } from 'lucide-react';

type CheckoutForm = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: 'standard' | 'express' | 'nextDay';
  cardNumber: string;
  expDate: string;
  cvv: string;
  nameOnCard: string;
};

const initialFormState: CheckoutForm = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  shippingMethod: 'standard',
  cardNumber: '',
  expDate: '',
  cvv: '',
  nameOnCard: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutForm>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shipping calculation
  let shippingCost = 0;
  if (formData.shippingMethod === 'standard') {
    shippingCost = subtotal > 500 ? 0 : 25;
  } else if (formData.shippingMethod === 'express') {
    shippingCost = 45;
  } else if (formData.shippingMethod === 'nextDay') {
    shippingCost = 75;
  }

  const tax = subtotal * 0.085;
  const total = subtotal + shippingCost + tax;

  const validateField = (name: keyof CheckoutForm, value: string) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
        break;
      case 'firstName':
        if (!value) error = 'First name is required';
        break;
      case 'lastName':
        if (!value) error = 'Last name is required';
        break;
      case 'address1':
        if (!value) error = 'Address is required';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'state':
        if (!value) error = 'State is required';
        break;
      case 'zip':
        if (!value) error = 'ZIP code is required';
        break;
      case 'country':
        if (!value) error = 'Country is required';
        break;
      case 'cardNumber':
        if (!value) error = 'Card number is required';
        else if (value.replace(/\D/g, '').length < 15) error = 'Invalid card number';
        break;
      case 'expDate':
        if (!value) error = 'Expiration date is required';
        else if (!/^\d{2}\/\d{2}$/.test(value)) error = 'Format: MM/YY';
        break;
      case 'cvv':
        if (!value) error = 'CVV is required';
        else if (value.length < 3) error = 'Invalid CVV';
        break;
      case 'nameOnCard':
        if (!value) error = 'Name on card is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof CheckoutForm, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Masking logic
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    if (touched[name as keyof CheckoutForm]) {
      const error = validateField(name as keyof CheckoutForm, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const isFormValid = () => {
    const requiredFields: (keyof CheckoutForm)[] = [
      'email', 'firstName', 'lastName', 'address1', 'city', 
      'state', 'zip', 'country', 'cardNumber', 'expDate', 'cvv', 'nameOnCard'
    ];
    
    // Check if any required field is empty
    const hasEmptyFields = requiredFields.some(field => !formData[field]);
    if (hasEmptyFields) return false;

    // Check if there are any errors
    const formErrors = requiredFields.map(field => validateField(field, formData[field]));
    return !formErrors.some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    const requiredFields: (keyof CheckoutForm)[] = [
      'email', 'firstName', 'lastName', 'address1', 'city', 
      'state', 'zip', 'country', 'cardNumber', 'expDate', 'cvv', 'nameOnCard'
    ];
    
    const newTouched: Partial<Record<keyof CheckoutForm, boolean>> = {};
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};
    
    requiredFields.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
          shipping_address: {
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          },
          shipping_method: formData.shippingMethod || 'standard',
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants,
            image: item.product.images[0]?.src || '',
          })),
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderNumber(data.order.id);
      } else {
        setOrderNumber(`MN-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setOrderNumber(`MN-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }
  };

  const inputClass = (name: keyof CheckoutForm) => {
    const baseClass = "w-full bg-white border rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all";
    if (touched[name] && errors[name]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return `${baseClass} border-stone/30 focus:border-noir focus:ring-noir`;
  };

  const renderError = (name: keyof CheckoutForm) => {
    if (touched[name] && errors[name]) {
      return <p className="text-red-500 text-xs mt-1">{errors[name]}</p>;
    }
    return null;
  };

  if (!mounted) return null;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-cream">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-sm shadow-sm max-w-lg w-full text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <h1 className="font-serif text-3xl text-noir mb-4">Order Confirmed</h1>
          <p className="text-stone mb-6">
            Thank you for your order! This is a demo — no real order was placed and your card was not charged.
          </p>
          <div className="bg-parchment p-4 rounded-sm mb-8">
            <p className="text-sm text-stone mb-1">Order Number</p>
            <p className="font-mono text-lg font-medium text-noir">{orderNumber}</p>
          </div>
          <Link 
            href="/shop"
            className="inline-block w-full bg-noir text-white py-4 rounded-sm hover:bg-charcoal transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
        <Link href="/shop" className="text-noir underline hover:text-gold transition-colors">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse">
        
        {/* Mobile Summary Toggle */}
        <div className="lg:hidden bg-cream border-b border-parchment p-4">
          <button 
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full flex items-center justify-between text-sm text-noir font-medium"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {showMobileSummary ? 'Hide order summary' : 'Show order summary'}
              {showMobileSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className={`
          lg:w-[45%] lg:block bg-cream lg:min-h-screen p-6 lg:p-12 lg:border-l border-parchment
          ${showMobileSummary ? 'block' : 'hidden'}
        `}>
          <div className="lg:sticky lg:top-12">
            <h2 className="hidden lg:block font-serif text-2xl text-noir mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8 max-h-[40vh] lg:max-h-none overflow-y-auto pr-2">
              {items.map((item, idx) => {
                const itemName = item.name || item.product?.name || 'Item';
                const itemImg = item.image || item.product?.images?.[0]?.src || '';
                const itemPrice = item.price ?? item.product?.price ?? 0;
                const itemSize = item.size || item.selectedVariants?.size;
                const itemColor = item.color || item.selectedVariants?.color;
                const itemKey = item.id || `${item.product?.id || idx}-${itemSize}-${itemColor}`;

                return (
                  <div key={itemKey} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-parchment rounded-sm overflow-hidden shrink-0 border border-stone/20">
                      {itemImg && <SafeImage src={itemImg} alt={itemName} fill className="object-cover" />}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone text-white text-[10px] flex items-center justify-center rounded-full z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-noir">{itemName}</h4>
                      <p className="text-xs text-stone mt-1">
                        {itemColor && <span className="capitalize">{itemColor}</span>}
                        {itemColor && itemSize && ' / '}
                        {itemSize && <span className="uppercase">{itemSize}</span>}
                      </p>
                    </div>
                    <div className="text-sm text-noir font-medium flex items-center">
                      {formatPrice(itemPrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-parchment pt-6 space-y-3 text-sm">
              <div className="flex justify-between text-stone">
                <span>Subtotal</span>
                <span className="text-noir">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Shipping</span>
                <span className="text-noir">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Taxes</span>
                <span className="text-noir">{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="border-t border-parchment mt-6 pt-6 flex justify-between items-center">
              <span className="text-lg font-medium text-noir">Total</span>
              <span className="text-xl font-medium text-noir">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="w-full lg:w-[55%] p-6 lg:p-12 lg:pr-24">
          <nav className="text-sm text-stone mb-8 flex items-center space-x-2">
            <Link href="/cart" className="hover:text-noir transition-colors">Shopping Bag</Link>
            <span>/</span>
            <span className="text-noir font-medium">Checkout</span>
          </nav>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Contact */}
            <section>
              <h2 className="font-serif text-xl text-noir mb-4">Contact</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('email')}
                  />
                  {renderError('email')}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-stone/30 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-noir focus:ring-1 focus:ring-noir transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-xl text-noir mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('country')}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                  {renderError('country')}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('firstName')}
                    />
                    {renderError('firstName')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('lastName')}
                    />
                    {renderError('lastName')}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="address1"
                    placeholder="Address"
                    value={formData.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('address1')}
                  />
                  {renderError('address1')}
                </div>

                <div>
                  <input
                    type="text"
                    name="address2"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full bg-white border border-stone/30 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-noir focus:ring-1 focus:ring-noir transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('city')}
                    />
                    {renderError('city')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('state')}
                    />
                    {renderError('state')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP code"
                      value={formData.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('zip')}
                    />
                    {renderError('zip')}
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-serif text-xl text-noir mb-4">Shipping Method</h2>
              <div className="border border-stone/30 rounded-sm divide-y divide-stone/30 overflow-hidden">
                <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-parchment/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      value="standard" 
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="text-noir focus:ring-noir w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-noir">Standard Shipping (5-7 business days)</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{subtotal > 500 ? 'Free' : '$25.00'}</span>
                </label>
                
                <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-parchment/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      value="express" 
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                      className="text-noir focus:ring-noir w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-noir">Express Shipping (2-3 business days)</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">$45.00</span>
                </label>

                <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-parchment/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      value="nextDay" 
                      checked={formData.shippingMethod === 'nextDay'}
                      onChange={handleChange}
                      className="text-noir focus:ring-noir w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-noir">Next Day Delivery</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">$75.00</span>
                </label>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-serif text-xl text-noir mb-4 flex items-center gap-2">
                Payment <Lock className="w-4 h-4 text-stone" />
              </h2>
              
              <div className="bg-blue-50 border border-blue-100 rounded-sm p-4 mb-6 flex gap-3 text-blue-800">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Demo Mode:</strong> This is a conceptual store. Please do not enter real credit card information. Any data entered here will be accepted to proceed with the demo flow.
                </p>
              </div>

              <div className="bg-parchment p-6 rounded-sm border border-stone/20 space-y-4">
                <div>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('cardNumber')}
                  />
                  {renderError('cardNumber')}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="expDate"
                      placeholder="Expiration date (MM/YY)"
                      maxLength={5}
                      value={formData.expDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('expDate')}
                    />
                    {renderError('expDate')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="Security code"
                      maxLength={4}
                      value={formData.cvv}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass('cvv')}
                    />
                    {renderError('cvv')}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="nameOnCard"
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('nameOnCard')}
                  />
                  {renderError('nameOnCard')}
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-noir text-white py-4 rounded-sm hover:bg-charcoal transition-colors duration-300 font-medium tracking-wide flex justify-center items-center gap-2 disabled:bg-stone disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
