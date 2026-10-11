'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  isOpen: boolean;
  isCartDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (productIdOrItemId: string, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productIdOrItemId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (
    productIdOrItemId: string,
    variantsOrQuantity: Record<string, string> | number,
    quantity?: number
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  toggleCartDrawer: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  cartTotal: number;
  itemCount: number;
  cartCount: number;
  shipping: number;
  toastMessage: string | null;
  clearToast: () => void;
  dispatch?: (action: { type: string; payload?: any }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING = 25;

function createCartItem(
  product: Product,
  quantity: number,
  selectedVariants: Record<string, string> = {}
): CartItem {
  const size = selectedVariants.size || '';
  const color = selectedVariants.color || '';
  const id = `${product.id}-${size}-${color}`;
  const image = product.images?.[0]?.src || '';

  return {
    id,
    product,
    quantity,
    selectedVariants,
    name: product.name,
    price: product.price,
    image,
    slug: product.slug,
    size: selectedVariants.size,
    color: selectedVariants.color,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('maison_noire_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Normalize items
          const normalized = parsed.map((item: any) => {
            const product = item.product || item;
            const quantity = item.quantity || 1;
            const selectedVariants = item.selectedVariants || {
              ...(item.size ? { size: item.size } : {}),
              ...(item.color ? { color: item.color } : {}),
            };
            return createCartItem(product, quantity, selectedVariants);
          });
          setItems(normalized);
        }
      } catch (error) {
        console.error('Failed to parse cart from local storage', error);
      }
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('maison_noire_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const clearToast = () => setToastMessage(null);

  const isSameItem = (
    item: CartItem,
    productIdOrItemId: string,
    selectedVariants?: Record<string, string>
  ) => {
    if (item.id === productIdOrItemId) return true;
    if (item.product.id === productIdOrItemId) {
      if (!selectedVariants) return true;
      const keys1 = Object.keys(item.selectedVariants || {});
      const keys2 = Object.keys(selectedVariants);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((k) => item.selectedVariants?.[k] === selectedVariants[k]);
    }
    return false;
  };

  const addItem = (
    product: Product,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    const qty = Math.max(1, quantity);
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          Object.keys(selectedVariants).every(
            (k) => item.selectedVariants?.[k] === selectedVariants[k]
          )
      );

      if (existingItemIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += qty;
        return newItems;
      }

      return [...currentItems, createCartItem(product, qty, selectedVariants)];
    });

    showToast(`Added ${product.name} to your cart`);
    setIsOpen(true);
  };

  const removeItem = (
    productIdOrItemId: string,
    selectedVariants?: Record<string, string>
  ) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !isSameItem(item, productIdOrItemId, selectedVariants))
    );
  };

  const updateQuantity = (
    productIdOrItemId: string,
    variantsOrQuantity: Record<string, string> | number,
    quantity?: number
  ) => {
    let targetQty: number;
    let targetVariants: Record<string, string> | undefined;

    if (typeof variantsOrQuantity === 'number') {
      targetQty = variantsOrQuantity;
      targetVariants = undefined;
    } else {
      targetVariants = variantsOrQuantity;
      targetQty = typeof quantity === 'number' ? quantity : 1;
    }

    if (targetQty <= 0) {
      removeItem(productIdOrItemId, targetVariants);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (isSameItem(item, productIdOrItemId, targetVariants)) {
          return { ...item, quantity: targetQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const dispatch = (action: { type: string; payload?: any }) => {
    if (action.type === 'ADD_ITEM' && action.payload) {
      addItem(
        action.payload.product || action.payload,
        action.payload.quantity || 1,
        action.payload.selectedVariants || {}
      );
    } else if (action.type === 'REMOVE_ITEM' && action.payload) {
      removeItem(action.payload.id || action.payload.productId);
    } else if (action.type === 'CLEAR') {
      clearCart();
    }
  };

  const subtotal = items.reduce(
    (total, item) => total + (item.product?.price || item.price || 0) * item.quantity,
    0
  );
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items,
        isOpen,
        isCartDrawerOpen: isOpen,
        addItem,
        removeItem,
        removeFromCart: removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        toggleCartDrawer: toggleCart,
        openCart,
        closeCart,
        subtotal,
        cartTotal: subtotal,
        itemCount,
        cartCount: itemCount,
        shipping,
        toastMessage,
        clearToast,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
