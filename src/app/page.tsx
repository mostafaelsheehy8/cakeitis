import Link from "next/link";
import { TiramisuArt } from "@/components/TiramisuArt";
import { getMenu } from "@/lib/products";
import { formatEGP } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const menu = await getMenu().catch(() => []);
  const featured = menu.slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-caramel">Tiramisu cloud kitchen</p>
          <h1 className="font-serif text-5xl leading-tight text-cocoa md:text-6xl">
            Layers of happiness, delivered.
          </h1>
          <p className="mt-5 max-w-md text-lg text-mocha">
            Cakeitis makes small-batch tiramisu by hand every day. Order a cup for tonight, a tray for the family, or
            let us cater your next event.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn">Order now</Link>
            <Link href="/events" className="btn btn-outline">Book us for an event</Link>
          </div>
        </div>
        <TiramisuArt className="aspect-[4/3] w-full" />
      </section>

      <section className="bg-cream/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-cocoa">Customer favourites</h2>
            <Link href="/menu" className="text-sm font-semibold text-caramel hover:underline">Full menu →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.id} href="/menu" className="group rounded-3xl bg-mascarpone p-4 shadow-sm transition hover:shadow-md">
                <TiramisuArt accent={p.accent} className="aspect-[4/3]" />
                <h3 className="mt-4 font-serif text-xl text-cocoa group-hover:text-caramel">{p.name}</h3>
                <p className="text-sm text-mocha">From {formatEGP(Math.min(...p.sizes.map((s) => s.price)))}</p>
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
            <h3 className="font-serif text-xl text-cocoa">{t}</h3>
            <p className="mt-2 text-mocha">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
