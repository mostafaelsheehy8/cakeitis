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

export function WhatsAppButton() {
  if (!contact.whatsappHref) return null;
  return (
    <a
      href={`${contact.whatsappHref}?text=${encodeURIComponent("Hi Cakeitis! ")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
      </svg>
    </a>
  );
}
