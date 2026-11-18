"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { TiramisuArt } from "@/components/TiramisuArt";
import { formatEGP } from "@/lib/config";
import type { MenuProduct } from "@/lib/products";

export function ProductCard({ product }: { product: MenuProduct }) {
  const { add } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const size = product.sizes[sizeIdx];

  function onAdd() {
    add({ productId: product.id, name: product.name, size: size.label, price: size.price, quantity: qty, accent: product.accent });
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col rounded-3xl bg-white p-4 shadow-sm ring-1 ring-cream">
      <TiramisuArt accent={product.accent} className="aspect-[4/3]" />
      <h2 className="mt-4 font-serif text-2xl text-cocoa">{product.name}</h2>
      <p className="mt-1 flex-1 text-sm text-mocha">{product.description}</p>

      <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Size">
        {product.sizes.map((s, i) => (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={i === sizeIdx}
            onClick={() => setSizeIdx(i)}
            className={`rounded-xl border px-2 py-2 text-left text-xs transition ${
              i === sizeIdx ? "border-cocoa bg-cream" : "border-cream hover:border-sponge"
            }`}
          >
            <span className="block font-semibold text-cocoa">{s.label}</span>
            <span className="block text-mocha">{s.serves}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-cocoa">{formatEGP(size.price)}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-cream">
            <button type="button" className="px-3 py-1.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button type="button" className="px-3 py-1.5" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase">+</button>
          </div>
          <button type="button" onClick={onAdd} className="btn px-4 py-2 text-sm">
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
