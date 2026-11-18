"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
];

export function Header() {
  const { count, ready } = useCart();
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-cream bg-mascarpone/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-cocoa">
          Cake<span className="text-caramel">itis</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-2 hover:bg-cream ${path === l.href ? "bg-cream text-cocoa" : "text-mocha"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/cart" className="relative rounded-full bg-cocoa px-4 py-2 text-mascarpone hover:bg-espresso">
            Cart
            {ready && count > 0 && (
              <span className="ml-2 rounded-full bg-caramel px-2 py-0.5 text-xs text-espresso">{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
