import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { EVENT_STATUSES } from "@/lib/config";
import { bad } from "@/lib/validate";
import { EventBooking } from "@/models/EventBooking";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!isValidObjectId(id)) return bad("Invalid id");
  if (!EVENT_STATUSES.includes(status)) return bad("Invalid status");
  await connectDB();
  const booking = await EventBooking.findByIdAndUpdate(id, { status }, { new: true });
  if (!booking) return bad("Booking not found", 404);
  return Response.json({ ok: true, status: booking.status });
}
