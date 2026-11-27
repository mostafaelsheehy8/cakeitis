// Contact details shown in the footer and the floating WhatsApp button.
// Set them in .env.local / Netlify env vars; anything left empty is simply not shown.
const clean = (v: string | undefined) => (v || "").trim();

// Egyptian mobile like 01012345678 -> 201012345678 (international, no +)
function toIntl(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (/^01\d{9}$/.test(d)) return "2" + d;
  return d;
}

const whatsapp = clean(process.env.NEXT_PUBLIC_WHATSAPP);
const phone = clean(process.env.NEXT_PUBLIC_PHONE) || whatsapp;

export const contact = {
  phone,
  phoneHref: phone ? `tel:+${toIntl(phone)}` : "",
  whatsappHref: whatsapp ? `https://wa.me/${toIntl(whatsapp)}` : "",
  instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  tiktok: clean(process.env.NEXT_PUBLIC_TIKTOK_URL),
};
