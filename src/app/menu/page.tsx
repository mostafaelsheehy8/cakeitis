import { PageHero } from "@/components/PageHero";
import { getMenu } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Menu — Cakeitis" };

export default async function MenuPage() {
  const menu = await getMenu();
  return (
    <>
      <PageHero
        eyebrow="The menu"
        title="Our tiramisu"
        points={["Each order is freshly prepared with care", "Pick your size", "Cash on delivery"]}
        image="/photos/spatula-slice.webp"
        imageAlt="A slice of tiramisu lifted from the dish, showing the ladyfinger layers"
        position="object-[center_28%]"
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        {menu.length === 0 ? (
          <p className="rounded-2xl bg-cream p-6 text-muted">The menu is empty. Run <code>npm run seed</code>.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {menu.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
