import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { formatEGP, statusLabel } from "@/lib/config";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 font-serif text-4xl text-rose">Thank you, {order.customer.name.split(" ")[0]}!</h1>
      <p className="mt-3 text-muted">
        Your order <strong className="text-rose">{order.code}</strong> has been received. We&apos;ll call you on{" "}
        {order.customer.phone} to confirm.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-6 text-left ring-1 ring-cream">
        <p className="mb-3 text-sm text-muted">
          Status: <span className="rounded-full bg-cream px-3 py-1 font-semibold text-rose">{statusLabel(order.status)}</span>
        </p>
        <ul className="space-y-1 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{i.quantity}× {i.name} ({i.size})</span>
              <span>{formatEGP(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-cream pt-3 text-sm">
          <p className="flex justify-between"><span>Delivery</span><span>{formatEGP(order.deliveryFee)}</span></p>
          <p className="flex justify-between text-base font-bold"><span>Total (cash on delivery)</span><span>{formatEGP(order.total)}</span></p>
        </div>
      </div>
      <Link href="/menu" className="btn btn-outline mt-8">Back to menu</Link>
    </div>
  );
}
