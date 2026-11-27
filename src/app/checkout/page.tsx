import { getSettings } from "@/lib/settings";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — Cakeitis" };

export default async function CheckoutPage() {
  return <CheckoutForm settings={await getSettings()} />;
}
