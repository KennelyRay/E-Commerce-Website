'use client';

import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { CartContextType, CartItem, Product } from '@/types';
import toast from 'react-hot-toast';
import { getStoredCartItems, hydrateCartItems, saveStoredCartItems } from '@/lib/shop';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.find((item) => item.product.id === product.id);
      const currentQuantity = existingItem?.quantity ?? 0;
      const allowedQuantity = Math.max(0, Math.min(quantity, product.stock - currentQuantity));

      if (allowedQuantity === 0) {
        return state;
      }

      if (existingItem) {
        return state.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + allowedQuantity }
            : item,
        );
      }

      return [...state, { id: crypto.randomUUID(), product, quantity: allowedQuantity }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.product.id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state
        .map((item) =>
          item.product.id === action.payload.productId
            ? {
                ...item,
                quantity: Math.min(item.product.stock, Math.max(0, action.payload.quantity)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0);

    case 'CLEAR_CART':
      return [];

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);
  const hasLoadedCart = useRef(false);

  useEffect(() => {
    dispatch({ type: 'LOAD_CART', payload: getStoredCartItems() });
    hasLoadedCart.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoadedCart.current) {
      return;
    }

    saveStoredCartItems(items);
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingQuantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
    const remainingStock = product.stock - existingQuantity;

    if (product.stock <= 0 || remainingStock <= 0) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }

    const finalQuantity = Math.min(quantity, remainingStock);
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: finalQuantity } });

    if (finalQuantity < quantity) {
      toast.success(`Added ${finalQuantity} unit(s) of ${product.name}.`);
      return;
    }

    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const cartItem = items.find((item) => item.product.id === productId);

    if (!cartItem) {
      return;
    }

    if (quantity > cartItem.product.stock) {
      toast.error(`Only ${cartItem.product.stock} unit(s) available for ${cartItem.product.name}.`);
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return hydrateCartItems(items).reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
