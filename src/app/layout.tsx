import type { Metadata } from "next";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair" });
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Cakeitis — Tiramisu Cloud Kitchen",
  description: "Handmade tiramisu delivered to your door, and dessert tables for your events.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-cream bg-cream/60 py-8 text-center text-sm text-muted">
            <Image src="/logo.png" alt="Cakeitis" width={517} height={341} className="mx-auto mb-2 h-14 w-auto" />
            <p>Handmade tiramisu · Cloud kitchen · Cash on delivery</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
