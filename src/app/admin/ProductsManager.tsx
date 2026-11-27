"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatEGP } from "@/lib/config";

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: { label: string; serves: string; price: number; image: string }[];
  available: boolean;
  sortOrder: number;
};
type Photo = { src: string; label: string };

const emptyProduct = (sortOrder: number): AdminProduct => ({
  id: "",
  name: "",
  description: "",
  image: "",
  sizes: [{ label: "Small", serves: "", price: 0, image: "" }],
  available: true,
  sortOrder,
});

export function ProductsManager({ products, photos }: { products: AdminProduct[]; photos: Photo[] }) {
  const [editing, setEditing] = useState<string | null>(null); // product id, or "new"
  const nextSort = products.reduce((m, p) => Math.max(m, p.sortOrder), -1) + 1;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Changes show on the menu straight away. Hidden products stay saved but customers can&apos;t order them.
        </p>
        {editing !== "new" && (
          <button className="btn px-4 py-2 text-sm" onClick={() => setEditing("new")}>+ Add product</button>
        )}
      </div>

      {editing === "new" && (
        <ProductForm initial={emptyProduct(nextSort)} photos={photos} onDone={() => setEditing(null)} />
      )}
      {products.length === 0 && editing !== "new" && (
        <p className="rounded-2xl bg-cream p-6 text-muted">No products yet. Add your first one.</p>
      )}

      {products.map((p) =>
        editing === p.id ? (
          <ProductForm key={p.id} initial={p} photos={photos} onDone={() => setEditing(null)} />
        ) : (
          <ProductRow key={p.id} product={p} onEdit={() => setEditing(p.id)} />
        ),
      )}
    </div>
  );
}

function ProductRow({ product: p, onEdit }: { product: AdminProduct; onEdit: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !p.available }),
    });
    setBusy(false);
    if (!res.ok) return setError("Update failed");
    router.refresh();
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-cream ${p.available ? "" : "opacity-60"}`}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
        {p.image && <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-rose">
          {p.name}{" "}
          {!p.available && <span className="ml-1 rounded-full bg-cream px-2 py-0.5 text-xs font-normal text-muted">Hidden</span>}
        </p>
        <p className="text-sm text-muted">{p.sizes.map((s) => `${s.label} ${formatEGP(s.price)}`).join(" · ")}</p>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-outline px-3 py-1.5 text-sm" disabled={busy} onClick={toggle}>
          {p.available ? "Hide" : "Show"}
        </button>
        <button className="btn px-3 py-1.5 text-sm" onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
}

function PhotoSelect({ value, onChange, photos, id, emptyLabel }: {
  value: string;
  onChange: (v: string) => void;
  photos: Photo[];
  id: string;
  emptyLabel: string;
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="input">
      <option value="">{emptyLabel}</option>
      {photos.map((ph) => (
        <option key={ph.src} value={ph.src}>{ph.label}</option>
      ))}
    </select>
  );
}

function ProductForm({ initial, photos, onDone }: { initial: AdminProduct; photos: Photo[]; onDone: () => void }) {
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isNew = !initial.id;

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((cur) => ({ ...cur, [k]: v }));
  const setSize = (i: number, k: keyof AdminProduct["sizes"][number], v: string | number) =>
    setP((cur) => ({ ...cur, sizes: cur.sizes.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${p.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error || "Could not save");
    onDone();
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${initial.name}" for good? Old orders keep their details. To just stop selling it, use Hide instead.`)) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) return setError("Could not delete");
    onDone();
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-5 ring-2 ring-rose/40">
      <h2 className="font-serif text-xl text-rose">{isNew ? "New product" : `Edit ${initial.name}`}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-name">Name</label>
          <input id="p-name" required maxLength={80} className="input" value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Pistachio Tiramisu" />
        </div>
        <div>
          <label className="label" htmlFor="p-image">Main photo</label>
          <PhotoSelect id="p-image" value={p.image} onChange={(v) => set("image", v)} photos={photos} emptyLabel="No photo (drawn placeholder)" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="p-desc">Description</label>
          <textarea id="p-desc" rows={2} maxLength={400} className="input" value={p.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="label">Sizes and prices</legend>
        {p.sizes.map((s, i) => (
          <div key={i} className="grid items-end gap-2 rounded-xl bg-cream/50 p-3 sm:grid-cols-[1fr_7rem_1fr_1fr_auto]">
            <div>
              <label className="text-xs text-muted" htmlFor={`s-label-${i}`}>Size</label>
              <input id={`s-label-${i}`} required maxLength={40} className="input" value={s.label} onChange={(e) => setSize(i, "label", e.target.value)} placeholder="Small" />
            </div>
            <div>
              <label className="text-xs text-muted" htmlFor={`s-price-${i}`}>Price (EGP)</label>
              <input id={`s-price-${i}`} required type="number" min={1} max={100000} className="input" value={s.price || ""} onChange={(e) => setSize(i, "price", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-muted" htmlFor={`s-serves-${i}`}>Serves (optional)</label>
              <input id={`s-serves-${i}`} maxLength={40} className="input" value={s.serves} onChange={(e) => setSize(i, "serves", e.target.value)} placeholder="e.g. 4–6 people" />
            </div>
            <div>
              <label className="text-xs text-muted" htmlFor={`s-image-${i}`}>Photo for this size</label>
              <PhotoSelect id={`s-image-${i}`} value={s.image} onChange={(v) => setSize(i, "image", v)} photos={photos} emptyLabel="Use main photo" />
            </div>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-30"
              disabled={p.sizes.length === 1}
              onClick={() => set("sizes", p.sizes.filter((_, j) => j !== i))}
              aria-label={`Remove size ${s.label || i + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
        {p.sizes.length < 10 && (
          <button
            type="button"
            className="text-sm font-semibold text-rose hover:underline"
            onClick={() => set("sizes", [...p.sizes, { label: "", serves: "", price: 0, image: "" }])}
          >
            + Add size
          </button>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.available} onChange={(e) => set("available", e.target.checked)} />
          Show on the menu
        </label>
        <label className="flex items-center gap-2 text-sm">
          Position
          <input type="number" className="input w-20" value={p.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          <span className="text-xs text-muted">(lower shows first)</span>
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn px-5 py-2" disabled={saving}>{saving ? "Saving…" : isNew ? "Add product" : "Save changes"}</button>
        <button type="button" className="btn btn-outline px-5 py-2" disabled={saving} onClick={onDone}>Cancel</button>
        {!isNew && (
          <button type="button" className="ml-auto rounded-full px-4 py-2 text-sm text-red-700 hover:bg-red-50" disabled={saving} onClick={remove}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
