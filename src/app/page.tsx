import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { getMenu } from "@/lib/products";
import { formatEGP } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const menu = await getMenu().catch(() => []);
  const featured = menu.slice(0, 4);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blush">Tiramisu cloud kitchen</p>
          <h1 className="font-serif text-5xl leading-tight text-rose md:text-6xl">
            Layers of happiness, delivered.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Cakeitis makes small-batch tiramisu by hand every day. Order a small one for tonight, a large one for the
            family, or let us cater your next event.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn">Order now</Link>
            <Link href="/events" className="btn btn-outline">Book us for an event</Link>
          </div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-white shadow-[0_20px_60px_-20px_rgb(150_74_81_/_0.35)] ring-1 ring-cream">
          <Image src="/logo.png" alt="Cakeitis" width={517} height={341} priority className="w-3/4 h-auto" />
        </div>
      </section>

      <section className="bg-cream/60 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-rose">Our tiramisu</h2>
            <Link href="/menu" className="text-sm font-semibold text-blush hover:underline">Full menu →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((p) => (
              <Link key={p.id} href="/menu" className="group rounded-3xl bg-mascarpone p-4 shadow-sm transition hover:shadow-md">
                <ProductImage images={p.images} accent={p.accent} alt={p.name} />
                <h3 className="mt-4 font-serif text-xl text-rose group-hover:text-blush">{p.name}</h3>
                <p className="text-sm text-muted">From {formatEGP(Math.min(...p.sizes.map((s) => s.price)))}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[
          ["Made fresh daily", "Real mascarpone, proper espresso, no shortcuts."],
          ["Cash on delivery", "Order online, pay when your tiramisu arrives."],
          ["Events & catering", "Birthdays, weddings, office treats: dessert tables of any size."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-3xl border border-cream p-6">
            <h3 className="font-serif text-xl text-rose">{t}</h3>
            <p className="mt-2 text-muted">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
