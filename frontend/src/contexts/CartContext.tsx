import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  openCart: () => void;
}

const STORAGE_KEY = "charm_catalog_cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => item?.product?.id && item.quantity > 0);
  } catch (error) {
    console.warn("Failed to read cart from storage", error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Failed to persist cart", error);
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.max(1, item.quantity + quantity) }
            : item
        );
      }

      return [...current, { product, quantity: Math.max(1, quantity) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: quantity < 1 ? 1 : quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);

  const totals = useMemo(() => {
    const totalCents = items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalCents, itemCount };
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: totals.itemCount,
    totalCents: totals.totalCents,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setOpen: setIsOpen,
    openCart,
  }), [items, totals.itemCount, totals.totalCents, addItem, removeItem, updateQuantity, clearCart, isOpen, openCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
