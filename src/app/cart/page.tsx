"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { TiramisuArt } from "@/components/TiramisuArt";
import { DELIVERY_FEE, formatEGP } from "@/lib/config";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, remove } = useCart();

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-12 text-muted">Loading cart…</div>;

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-rose">Your cart is empty</h1>
        <p className="mt-3 text-muted">Time to fix that.</p>
        <Link href="/menu" className="btn mt-8">Browse the menu</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl text-rose">Your cart</h1>
      <ul className="mt-8 divide-y divide-cream rounded-3xl bg-white ring-1 ring-cream">
        {items.map((i) => (
          <li key={i.productId + i.size} className="flex items-center gap-4 p-4">
            <TiramisuArt accent={i.accent} className="h-16 w-20 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-rose">{i.name}</p>
              <p className="text-sm text-muted">{i.size} · {formatEGP(i.price)}</p>
            </div>
            <div className="flex items-center rounded-full border border-cream">
              <button className="px-3 py-1" onClick={() => setQuantity(i.productId, i.size, i.quantity - 1)} aria-label="Decrease">−</button>
              <span className="w-6 text-center text-sm">{i.quantity}</span>
              <button className="px-3 py-1" onClick={() => setQuantity(i.productId, i.size, i.quantity + 1)} aria-label="Increase">+</button>
            </div>
            <p className="w-24 text-right font-semibold">{formatEGP(i.price * i.quantity)}</p>
            <button onClick={() => remove(i.productId, i.size)} className="text-sm text-muted hover:text-red-700" aria-label="Remove">✕</button>
          </li>
        ))}
      </ul>
      <div className="mt-6 ml-auto max-w-xs space-y-1 text-right">
        <p className="text-muted">Subtotal: {formatEGP(subtotal)}</p>
        <p className="text-muted">Delivery: {formatEGP(DELIVERY_FEE)}</p>
        <p className="text-xl font-bold text-rose">Total: {formatEGP(subtotal + DELIVERY_FEE)}</p>
        <Link href="/checkout" className="btn mt-4 w-full">Checkout</Link>
      </div>
    </div>
  );
}
