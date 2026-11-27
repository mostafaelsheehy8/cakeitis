"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { DELIVERY_FEE, formatEGP } from "@/lib/config";

export default function CheckoutPage() {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-12 text-muted">Loading…</div>;
  if (items.length === 0)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/menu" className="btn mt-6">Browse the menu</Link>
      </div>
    );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: f.get("name"),
            phone: f.get("phone"),
            area: f.get("area"),
            address: f.get("address"),
          },
          notes: f.get("notes"),
          website: f.get("website"),
          items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place the order");
      clear();
      router.push(`/order/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-serif text-4xl text-rose">Checkout</h1>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required maxLength={80} className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Mobile number</label>
          <input id="phone" name="phone" required pattern="01[0125][0-9]{8}" title="Egyptian mobile, e.g. 01012345678" inputMode="tel" className="input" placeholder="01xxxxxxxxx" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="area">Area</label>
          <input id="area" name="area" maxLength={80} className="input" placeholder="e.g. New Cairo, Maadi" />
        </div>
        <div>
          <label className="label" htmlFor="address">Delivery address</label>
          <textarea id="address" name="address" required maxLength={300} rows={3} className="input" placeholder="Street, building, floor, apartment" />
        </div>
        <div>
          <label className="label" htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" name="notes" maxLength={500} rows={2} className="input" placeholder="Delivery time, a birthday message…" />
        </div>
        <div className="rounded-2xl bg-cream p-4 text-sm text-rose">
          <strong>Payment:</strong> Cash on delivery. Online payment is coming soon.
        </div>
        {/* Honeypot for spam bots: hidden from people and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={submitting} className="btn w-full">
          {submitting ? "Placing order…" : `Place order · ${formatEGP(subtotal + DELIVERY_FEE)}`}
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-white p-5 ring-1 ring-cream">
        <h2 className="font-serif text-xl text-rose">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId + i.size} className="flex justify-between gap-2">
              <span>{i.quantity}× {i.name} <span className="text-muted">({i.size})</span></span>
              <span>{formatEGP(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-cream pt-3 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><span>{formatEGP(subtotal)}</span></p>
          <p className="flex justify-between"><span>Delivery</span><span>{formatEGP(DELIVERY_FEE)}</span></p>
          <p className="flex justify-between text-base font-bold"><span>Total</span><span>{formatEGP(subtotal + DELIVERY_FEE)}</span></p>
        </div>
      </aside>
    </div>
  );
}
