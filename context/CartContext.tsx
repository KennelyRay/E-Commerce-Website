'use client';

import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { CartContextType, CartItem, Product } from '@/types';
import toast from 'react-hot-toast';
import { getStoredCartItems, hydrateCartItems, saveStoredCartItems } from '@/lib/shop';
import { getCatalogSnapshot, refreshCatalog, subscribeCatalog } from '@/hooks/useCatalog';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'REFRESH_PRODUCTS'; payload: Product[] };

function mergeCartItems(
  currentItems: CartItem[],
  additions: Array<{ product: Product; quantity: number }>,
): {
  items: CartItem[];
  addedUnits: number;
  addedProducts: number;
} {
  const nextItems = [...currentItems];
  let addedUnits = 0;
  let addedProducts = 0;

  additions.forEach(({ product, quantity }) => {
    const existingItemIndex = nextItems.findIndex((item) => item.product.id === product.id);
    const existingItem = existingItemIndex >= 0 ? nextItems[existingItemIndex] : undefined;
    const currentQuantity = existingItem?.quantity ?? 0;
    const allowedQuantity = Math.max(0, Math.min(quantity, product.stock - currentQuantity));

    if (allowedQuantity === 0) {
      return;
    }

    addedUnits += allowedQuantity;
    addedProducts += 1;

    if (existingItem && existingItemIndex >= 0) {
      nextItems[existingItemIndex] = {
        ...existingItem,
        product,
        quantity: existingItem.quantity + allowedQuantity,
      };
      return;
    }

    nextItems.push({
      id: crypto.randomUUID(),
      product,
      quantity: allowedQuantity,
    });
  });

  return {
    items: nextItems,
    addedUnits,
    addedProducts,
  };
}

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

    case 'REFRESH_PRODUCTS':
      return hydrateCartItems(state, action.payload);

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);
  const hasLoadedCart = useRef(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  // Increments on every successful add so the cart badge can replay its bump animation.
  const [addedTick, setAddedTick] = useState(0);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const announceAdd = (productId: string | null) => {
    setLastAddedId(productId);
    setAddedTick((tick) => tick + 1);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    dispatch({ type: 'LOAD_CART', payload: hydrateCartItems(getStoredCartItems(), getCatalogSnapshot()) });
    hasLoadedCart.current = true;

    // Re-price the cart and cap quantities whenever fresh catalog data arrives.
    if (!getCatalogSnapshot().length) void refreshCatalog();
    return subscribeCatalog(() => {
      const catalog = getCatalogSnapshot();
      if (catalog.length) {
        dispatch({ type: 'REFRESH_PRODUCTS', payload: catalog });
      }
    });
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
    announceAdd(product.id);

    if (finalQuantity < quantity) {
      toast(`Only ${finalQuantity} more of ${product.name} in stock, so that is what we added.`);
    }
  };

  const addManyToCart = (products: Array<{ product: Product; quantity?: number }>) => {
    const normalizedProducts = products
      .filter(({ product, quantity = 1 }) => product.stock > 0 && quantity > 0)
      .map(({ product, quantity = 1 }) => ({ product, quantity }));

    if (normalizedProducts.length === 0) {
      toast.error('No in-stock components were available to add.');
      return { addedUnits: 0, addedProducts: 0 };
    }

    const result = mergeCartItems(items, normalizedProducts);

    if (result.addedUnits === 0) {
      toast.error('These components are already at the maximum available quantity in your cart.');
      return result;
    }

    dispatch({ type: 'LOAD_CART', payload: result.items });
    announceAdd(null);

    return result;
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
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
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    addManyToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    lastAddedId,
    addedTick,
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
