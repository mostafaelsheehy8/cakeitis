"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  size: string;
  price: number; // display only; the server recomputes prices
  quantity: number;
  accent?: string;
  image?: string;
};

type CartCtx = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (item: CartItem) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cakeitis_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => {
    const same = (a: CartItem, id: string, size: string) => a.productId === id && a.size === size;
    return {
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find((p) => same(p, item.productId, item.size));
          if (existing)
            return prev.map((p) =>
              same(p, item.productId, item.size) ? { ...p, quantity: Math.min(50, p.quantity + item.quantity) } : p,
            );
          return [...prev, item];
        }),
      setQuantity: (id, size, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((p) => !same(p, id, size))
            : prev.map((p) => (same(p, id, size) ? { ...p, quantity: Math.min(50, quantity) } : p)),
        ),
      remove: (id, size) => setItems((prev) => prev.filter((p) => !same(p, id, size))),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
