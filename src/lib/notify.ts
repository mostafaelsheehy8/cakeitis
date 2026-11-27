// Sends the owner a Telegram message. Never throws: a failed alert must not fail an order.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyOwner(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("Telegram notify failed:", res.status, await res.text());
  } catch (err) {
    console.error("Telegram notify error:", err);
  }
}

// First valid one of SITE_URL, Netlify's own URL, then localhost. Tolerates a missing "https://", quotes or spaces.
function baseUrl() {
  for (const raw of [process.env.SITE_URL, process.env.URL, process.env.DEPLOY_PRIME_URL]) {
    const v = (raw || "").trim().replace(/^["']|["']$/g, "");
    if (!v) continue;
    try {
      return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).origin;
    } catch {
      // try the next one
    }
  }
  return "http://localhost:3000";
}

export function siteUrl(path = "") {
  return baseUrl() + path;
}

type OrderMsg = {
  code: string;
  customer: { name: string; phone: string; area?: string | null; address: string };
  items: { name: string; size: string; quantity: number; unitPrice: number }[];
  notes?: string | null;
  total: number;
};

export function orderMessage(o: OrderMsg) {
  const lines = [
    `🧁 <b>New order ${esc(o.code)}</b>`,
    "",
    ...o.items.map((i) => `• ${i.quantity}× ${esc(i.name)} (${esc(i.size)}): ${i.unitPrice * i.quantity} EGP`),
    "",
    `<b>Total: ${o.total} EGP</b> (cash on delivery)`,
    "",
    `👤 ${esc(o.customer.name)}`,
    `📞 ${esc(o.customer.phone)}`,
    `📍 ${esc([o.customer.area, o.customer.address].filter(Boolean).join(" — "))}`,
  ];
  if (o.notes) lines.push(`📝 ${esc(o.notes)}`);
  lines.push("", siteUrl("/admin?tab=orders"));
  return lines.join("\n");
}

type BookingMsg = {
  name: string;
  phone: string;
  email?: string | null;
  eventType?: string | null;
  date: Date;
  location: string;
  guests: number;
  estimatedTotal?: number | null;
  notes?: string | null;
};

export function bookingMessage(b: BookingMsg) {
  const day = b.date.toLocaleDateString("en-GB", { dateStyle: "full", timeZone: "Africa/Cairo" });
  const lines = [
    `🎉 <b>New event booking request</b>`,
    "",
    `${esc(b.eventType || "Event")} · ${day}`,
    `👥 ${b.guests} guests${b.estimatedTotal != null ? ` · est. ${b.estimatedTotal} EGP` : ""}`,
    `📍 ${esc(b.location)}`,
    "",
    `👤 ${esc(b.name)}`,
    `📞 ${esc(b.phone)}`,
  ];
  if (b.email) lines.push(`✉️ ${esc(b.email)}`);
  if (b.notes) lines.push(`📝 ${esc(b.notes)}`);
  lines.push("", siteUrl("/admin?tab=events"));
  return lines.join("\n");
}
