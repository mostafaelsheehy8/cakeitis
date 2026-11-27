"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";

export function DeliverySettings({ initial, defaultFee }: { initial: SiteSettings; defaultFee: number }) {
  const router = useRouter();
  const [areas, setAreas] = useState(initial.deliveryAreas.length ? initial.deliveryAreas : []);
  const [hours, setHours] = useState(initial.hours);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const setArea = (i: number, k: "name" | "fee", v: string | number) =>
    setAreas((cur) => cur.map((a, j) => (j === i ? { ...a, [k]: v } : a)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryAreas: areas, hours }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error || "Could not save" });
    setMsg({ ok: true, text: "Saved. The checkout uses the new areas now." });
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-6 rounded-2xl bg-white p-5 ring-1 ring-cream">
      <div>
        <label className="label" htmlFor="hours">Opening hours</label>
        <input
          id="hours"
          maxLength={200}
          className="input"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="e.g. Every day, 12 pm – 11 pm"
        />
        <p className="mt-1 text-xs text-muted">Shown in the footer of every page and at checkout. Leave empty to hide.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="label">Delivery areas and fees</legend>
        <p className="text-sm text-muted">
          {areas.length === 0
            ? `No areas yet, so customers can type any area and pay the flat ${defaultFee} EGP delivery fee. Add areas to only accept orders from them.`
            : "Customers pick one of these at checkout, and its fee is added to the order."}
        </p>
        {areas.map((a, i) => (
          <div key={i} className="grid items-end gap-2 sm:grid-cols-[1fr_9rem_auto]">
            <div>
              <label className="text-xs text-muted" htmlFor={`a-name-${i}`}>Area</label>
              <input id={`a-name-${i}`} required maxLength={60} className="input" value={a.name} onChange={(e) => setArea(i, "name", e.target.value)} placeholder="e.g. Maadi" />
            </div>
            <div>
              <label className="text-xs text-muted" htmlFor={`a-fee-${i}`}>Delivery fee (EGP)</label>
              <input id={`a-fee-${i}`} required type="number" min={0} max={10000} className="input" value={Number.isNaN(a.fee) ? "" : a.fee} onChange={(e) => setArea(i, "fee", e.target.valueAsNumber)} />
            </div>
            <button type="button" className="rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50" onClick={() => setAreas(areas.filter((_, j) => j !== i))} aria-label={`Remove ${a.name || "area"}`}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="text-sm font-semibold text-rose hover:underline" onClick={() => setAreas([...areas, { name: "", fee: defaultFee }])}>
          + Add area
        </button>
      </fieldset>

      {msg && <p className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{msg.text}</p>}
      <button type="submit" className="btn px-5 py-2" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
    </form>
  );
}
