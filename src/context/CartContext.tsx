import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingQualified: boolean;
  amountNeededForFreeShipping: number;
  itemCount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dv_clothing_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1499;
const FLAT_SHIPPING_FEE = 99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart items', e);
    }
  }, [items]);

  const addToCart = (newItemData: Omit<CartItem, 'cartItemId'>) => {
    setItems((prevItems) => {
      // Check for exact matching item (same product, same size, same color, and same custom design if any)
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.productId === newItemData.productId &&
          i.selectedSize === newItemData.selectedSize &&
          i.selectedColor === newItemData.selectedColor &&
          !i.isCustomPrint &&
          !newItemData.isCustomPrint
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItemData.quantity;
        return updated;
      }

      const cartItemId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return [...prevItems, { ...newItemData, cartItemId }];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DV10') {
      setAppliedCoupon('DV10');
      return { success: true, message: 'Coupon DV10 applied: 10% discount!' };
    }
    if (cleanCode === 'FIRSTDROP') {
      setAppliedCoupon('FIRSTDROP');
      return { success: true, message: 'Coupon FIRSTDROP applied: 15% discount!' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
      const extraFee = item.customizationFee || 0;
      return acc + (unitPrice + extraFee) * item.quantity;
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'DV10') return Math.round(subtotal * 0.1);
    if (appliedCoupon === 'FIRSTDROP') return Math.round(subtotal * 0.15);
    return 0;
  }, [subtotal, appliedCoupon]);

  const freeShippingQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingAmount = items.length === 0 || freeShippingQualified ? 0 : FLAT_SHIPPING_FEE;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        subtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingQualified,
        amountNeededForFreeShipping,
        itemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
