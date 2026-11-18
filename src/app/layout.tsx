import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Cakeitis — Tiramisu Cloud Kitchen",
  description: "Handmade tiramisu delivered to your door, and dessert tables for your events.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-cream bg-cream/60 py-8 text-center text-sm text-mocha">
            <p className="font-serif text-lg text-cocoa">Cakeitis</p>
            <p>Handmade tiramisu · Cloud kitchen · Cash on delivery</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
