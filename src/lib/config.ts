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

export const EG_PHONE = /^01[0125]\d{8}$/;

export function formatEGP(n: number) {
  return `${n.toLocaleString("en-EG")} EGP`;
}

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
