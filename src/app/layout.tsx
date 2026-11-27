import type { Metadata } from "next";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair" });
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { ContactLinks } from "@/components/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/notify";
import Link from "next/link";

const description = "Handmade tiramisu delivered to your door, and the Cakeitis tiramisu cart for your events.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Cakeitis — Tiramisu Cloud Kitchen",
  description,
  openGraph: {
    type: "website",
    siteName: "Cakeitis",
    title: "Cakeitis — Handmade Tiramisu",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Cakeitis handmade tiramisu" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { hours } = await getSettings();
  return (
    <html lang="en" className={playfair.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-cream bg-cream/60 py-8 text-center text-sm text-muted">
            <Image src="/logo.png" alt="Cakeitis" width={517} height={341} className="mx-auto mb-2 h-14 w-auto" />
            <p>Handmade tiramisu · Cloud kitchen · Cash on delivery</p>
            {hours && <p className="mt-1">Open: {hours}</p>}
            <ContactLinks />
            <p className="mt-4 text-xs">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </p>
          </footer>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
