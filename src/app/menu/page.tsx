import { getMenu } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Menu — Cakeitis" };

export default async function MenuPage() {
  const menu = await getMenu();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-rose">Our tiramisu</h1>
      <p className="mt-2 text-muted">Pick a flavour and a size. Every order is made fresh and paid cash on delivery.</p>
      {menu.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-cream p-6 text-muted">The menu is empty. Run <code>npm run seed</code>.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
