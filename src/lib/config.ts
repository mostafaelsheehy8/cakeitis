export const DELIVERY_FEE = 50; // EGP, flat for the MVP

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const EVENT_STATUSES = ["new", "contacted", "confirmed", "declined"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

// Event pricing: a flat rate per guest based on a reference price (150 guests = 7800 EGP).
// Change these two numbers to update event pricing everywhere.
export const EVENT_REFERENCE_GUESTS = 150;
export const EVENT_REFERENCE_PRICE = 7800; // EGP

export function estimateEventTotal(guests: number) {
  if (!Number.isFinite(guests) || guests < 1) return 0;
  const raw = (guests * EVENT_REFERENCE_PRICE) / EVENT_REFERENCE_GUESTS;
  return Math.round(raw / 50) * 50; // round to the nearest 50 EGP
}

export const EG_PHONE = /^01[0125]\d{8}$/;

export function formatEGP(n: number) {
  return `${n.toLocaleString("en-EG")} EGP`;
}

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
