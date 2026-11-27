import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { bad, str } from "@/lib/validate";
import { Settings } from "@/models/Settings";

export async function PUT(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return bad("Invalid JSON");

  const raw = Array.isArray(b.deliveryAreas) ? (b.deliveryAreas as Record<string, unknown>[]) : [];
  if (raw.length > 100) return bad("Too many areas");
  const seen = new Set<string>();
  const deliveryAreas = [];
  for (const a of raw) {
    const name = str(a.name, 60);
    const fee = Number(a.fee);
    if (!name) return bad("Every area needs a name");
    if (seen.has(name.toLowerCase())) return bad(`"${name}" is listed twice`);
    seen.add(name.toLowerCase());
    if (!Number.isFinite(fee) || fee < 0 || fee > 10000) return bad(`Enter a valid delivery fee for "${name}"`);
    deliveryAreas.push({ name, fee: Math.round(fee) });
  }

  await connectDB();
  await Settings.findByIdAndUpdate(
    "site",
    { deliveryAreas, hours: str(b.hours, 200) },
    { upsert: true, new: true, runValidators: true },
  );
  // Static pages (cart, events, privacy) show the hours in the footer: rebuild them with the new value.
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
