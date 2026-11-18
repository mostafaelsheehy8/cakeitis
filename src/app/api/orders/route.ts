import { randomBytes } from "crypto";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { DELIVERY_FEE, EG_PHONE } from "@/lib/config";
import { bad, str } from "@/lib/validate";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

type InItem = { productId?: unknown; size?: unknown; quantity?: unknown };

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const c = (body.customer ?? {}) as Record<string, unknown>;
  const customer = {
    name: str(c.name, 80),
    phone: str(c.phone, 20).replace(/\s|-/g, ""),
    area: str(c.area, 80),
    address: str(c.address, 300),
  };
  if (!customer.name) return bad("Please enter your name");
  if (!EG_PHONE.test(customer.phone)) return bad("Please enter a valid Egyptian mobile number");
  if (!customer.address) return bad("Please enter a delivery address");

  const rawItems = Array.isArray(body.items) ? (body.items as InItem[]) : [];
  if (rawItems.length === 0 || rawItems.length > 30) return bad("Your cart is empty");

  await connectDB();
  const ids = rawItems.map((i) => String(i.productId));
  if (!ids.every(isValidObjectId)) return bad("Invalid product in cart");
  const products = await Product.find({ _id: { $in: ids }, available: true }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  for (const i of rawItems) {
    const p = byId.get(String(i.productId));
    const qty = Number(i.quantity);
    if (!p) return bad("A product in your cart is no longer available. Please refresh your cart.");
    const size = p.sizes.find((s) => s.label === i.size);
    if (!size) return bad(`Size not available for ${p.name}`);
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) return bad("Invalid quantity");
    items.push({ product: p._id, name: p.name, size: size.label, unitPrice: size.price, quantity: qty });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0);
  const order = await Order.create({
    code: "CK-" + randomBytes(3).toString("hex").toUpperCase(),
    items,
    customer,
    notes: str(body.notes, 500),
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    paymentMethod: "cod",
  });

  return Response.json({ id: String(order._id), code: order.code }, { status: 201 });
}
