import { contact } from "@/lib/contact";

export function ContactLinks() {
  const links = [
    contact.whatsappHref && { href: contact.whatsappHref, label: "WhatsApp" },
    contact.phoneHref && { href: contact.phoneHref, label: contact.phone },
    contact.instagram && { href: contact.instagram, label: "Instagram" },
    contact.facebook && { href: contact.facebook, label: "Facebook" },
    contact.tiktok && { href: contact.tiktok, label: "TikTok" },
  ].filter(Boolean) as { href: string; label: string }[];
  if (links.length === 0) return null;

  return (
    <nav aria-label="Contact us" className="mt-3 flex flex-wrap justify-center gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target={l.href.startsWith("tel:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="rounded-full bg-white px-4 py-1.5 font-medium text-rose ring-1 ring-cream hover:bg-cream"
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
