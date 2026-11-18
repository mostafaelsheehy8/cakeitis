import { connectDB } from "@/lib/db";
import { EG_PHONE } from "@/lib/config";
import { bad, str } from "@/lib/validate";
import { EventBooking } from "@/models/EventBooking";

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const name = str(b.name, 80);
  const phone = str(b.phone, 20).replace(/\s|-/g, "");
  const email = str(b.email, 120);
  const location = str(b.location, 200);
  const dateStr = str(b.date, 20);
  const guests = Number(b.guests);
  const budget = b.budget === "" || b.budget == null ? undefined : Number(b.budget);

  if (!name) return bad("Please enter your name");
  if (!EG_PHONE.test(phone)) return bad("Please enter a valid Egyptian mobile number");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email");
  if (!location) return bad("Please enter the event location");
  if (!Number.isInteger(guests) || guests < 1 || guests > 5000) return bad("Please enter the number of guests");
  if (budget !== undefined && (!Number.isFinite(budget) || budget < 0)) return bad("Invalid budget");

  const date = new Date(`${dateStr}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || isNaN(date.getTime())) return bad("Please pick a valid date");
  if (date < today) return bad("The event date can't be in the past");

  await connectDB();
  const booking = await EventBooking.create({
    name,
    phone,
    email,
    eventType: str(b.eventType, 60),
    date,
    location,
    guests,
    budget,
    notes: str(b.notes, 1000),
  });
  return Response.json({ id: String(booking._id) }, { status: 201 });
}
