import { connectDB } from "./db";
import { DELIVERY_FEE } from "./config";
import { Settings } from "@/models/Settings";

export type SiteSettings = {
  deliveryAreas: { name: string; fee: number }[]; // empty = deliver anywhere at the flat DELIVERY_FEE
  hours: string;
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    await connectDB();
    const s = await Settings.findById("site").lean();
    return {
      deliveryAreas: (s?.deliveryAreas ?? []).map((a) => ({ name: a.name, fee: a.fee })),
      hours: s?.hours ?? "",
    };
  } catch (err) {
    console.error("getSettings error:", err);
    return { deliveryAreas: [], hours: "" };
  }
}

/** Delivery fee for an area, or null when areas are set and this one isn't on the list. */
export function feeForArea(settings: SiteSettings, area: string) {
  if (settings.deliveryAreas.length === 0) return DELIVERY_FEE;
  const hit = settings.deliveryAreas.find((a) => a.name === area);
  return hit ? hit.fee : null;
}
