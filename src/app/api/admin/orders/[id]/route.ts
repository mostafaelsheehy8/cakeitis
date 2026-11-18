import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/config";
import { bad } from "@/lib/validate";
import { Order } from "@/models/Order";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!isValidObjectId(id)) return bad("Invalid id");
  if (!ORDER_STATUSES.includes(status)) return bad("Invalid status");
  await connectDB();
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) return bad("Order not found", 404);
  return Response.json({ ok: true, status: order.status });
}
