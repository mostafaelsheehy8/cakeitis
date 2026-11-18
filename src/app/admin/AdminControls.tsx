"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { statusLabel } from "@/lib/config";

export function StatusSelect({
  id,
  kind,
  value,
  options,
}: {
  id: string;
  kind: "orders" | "events";
  value: string;
  options: readonly string[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onChange(next: string) {
    const prev = current;
    setCurrent(next);
    setError(false);
    const res = await fetch(`/api/admin/${kind}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setCurrent(prev);
      setError(true);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-cream bg-white px-2 py-1 text-sm"
        aria-label="Status"
      >
        {options.map((o) => (
          <option key={o} value={o}>{statusLabel(o)}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-700">Update failed</p>}
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="btn btn-outline px-4 py-1.5 text-sm"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
      }}
    >
      Log out
    </button>
  );
}
