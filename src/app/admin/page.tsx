import Link from "next/link";
import { connectDB } from "@/lib/db";
import { EVENT_STATUSES, ORDER_STATUSES, formatEGP } from "@/lib/config";
import { Order } from "@/models/Order";
import { EventBooking } from "@/models/EventBooking";
import { LogoutButton, StatusSelect } from "./AdminControls";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Cakeitis" };

const dt = (d: Date) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Cairo" });
const day = (d: Date) => new Date(d).toLocaleDateString("en-GB", { dateStyle: "full", timeZone: "Africa/Cairo" });

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "orders" } = await searchParams;
  await connectDB();
  const [orders, bookings, pendingOrders, newBookings] = await Promise.all([
    tab === "orders" ? Order.find().sort({ createdAt: -1 }).limit(200).lean() : [],
    tab === "events" ? EventBooking.find().sort({ createdAt: -1 }).limit(200).lean() : [],
    Order.countDocuments({ status: "pending" }),
    EventBooking.countDocuments({ status: "new" }),
  ]);

  const tabCls = (t: string) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-cocoa text-mascarpone" : "bg-cream text-cocoa"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-cocoa">Cakeitis admin</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-mocha hover:underline">View site</Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Link href="/admin?tab=orders" className={tabCls("orders")}>
          Orders {pendingOrders > 0 && <span className="ml-1 rounded-full bg-caramel px-2 text-xs text-espresso">{pendingOrders}</span>}
        </Link>
        <Link href="/admin?tab=events" className={tabCls("events")}>
          Event bookings {newBookings > 0 && <span className="ml-1 rounded-full bg-caramel px-2 text-xs text-espresso">{newBookings}</span>}
        </Link>
      </div>

      {tab === "orders" ? (
        <div className="mt-6 space-y-4">
          {orders.length === 0 && <p className="rounded-2xl bg-cream p-6 text-mocha">No orders yet.</p>}
          {orders.map((o) => (
            <div key={String(o._id)} className="rounded-2xl bg-white p-5 ring-1 ring-cream">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-cocoa">{o.code} · {o.customer.name}</p>
                  <p className="text-sm text-mocha">{dt(o.createdAt)} · <a href={`tel:${o.customer.phone}`} className="underline">{o.customer.phone}</a></p>
                  <p className="text-sm text-mocha">{[o.customer.area, o.customer.address].filter(Boolean).join(" — ")}</p>
                </div>
                <StatusSelect id={String(o._id)} kind="orders" value={o.status} options={ORDER_STATUSES} />
              </div>
              <ul className="mt-3 text-sm">
                {o.items.map((i, idx) => (
                  <li key={idx}>{i.quantity}× {i.name} ({i.size}) — {formatEGP(i.unitPrice * i.quantity)}</li>
                ))}
              </ul>
              {o.notes && <p className="mt-2 rounded-lg bg-cream/70 p-2 text-sm">📝 {o.notes}</p>}
              <p className="mt-2 text-sm font-bold text-cocoa">Total: {formatEGP(o.total)} (COD)</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.length === 0 && <p className="rounded-2xl bg-cream p-6 text-mocha">No booking requests yet.</p>}
          {bookings.map((b) => (
            <div key={String(b._id)} className="rounded-2xl bg-white p-5 ring-1 ring-cream">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-cocoa">{b.eventType || "Event"} · {day(b.date)}</p>
                  <p className="text-sm text-mocha">
                    {b.name} · <a href={`tel:${b.phone}`} className="underline">{b.phone}</a>
                    {b.email && <> · <a href={`mailto:${b.email}`} className="underline">{b.email}</a></>}
                  </p>
                  <p className="text-sm text-mocha">
                    📍 {b.location} · 👥 {b.guests} guests
                    {b.estimatedTotal != null ? (
                      <> · 💰 Est. {formatEGP(b.estimatedTotal)}</>
                    ) : (
                      b.budget != null && <> · 💰 Budget {formatEGP(b.budget)}</>
                    )}
                  </p>
                </div>
                <StatusSelect id={String(b._id)} kind="events" value={b.status} options={EVENT_STATUSES} />
              </div>
              {b.notes && <p className="mt-2 rounded-lg bg-cream/70 p-2 text-sm">📝 {b.notes}</p>}
              <p className="mt-2 text-xs text-mocha">Requested {dt(b.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
