import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { getMenu } from "@/lib/products";
import { formatEGP } from "@/lib/config";

export const dynamic = "force-dynamic";

const steps = [
  { n: "1", title: "Order online", text: "Pick your tiramisu and size, add your address. Takes a minute." },
  { n: "2", title: "Made fresh for you", text: "We layer every order by hand with real mascarpone and espresso." },
  { n: "3", title: "Delivered, pay cash", text: "We bring it to your door. You pay when it arrives." },
];

export default async function Home() {
  const menu = await getMenu().catch(() => []);
  const minPrice = menu.length ? Math.min(...menu.flatMap((p) => p.sizes.map((s) => s.price))) : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_40%,#f3dcd8_0%,transparent_70%),radial-gradient(40%_50%_at_0%_100%,#f7e9e2_0%,transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose ring-1 ring-cream">
              <span className="h-1.5 w-1.5 rounded-full bg-rose" /> Tiramisu cloud kitchen
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-rose-dark md:text-7xl">
              Layers of <em className="text-rose">happiness</em>, delivered.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Small-batch tiramisu, made by hand every day. Try our Signature with the Cakeitis secret recipe, or the
              Italian Classic.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn px-7 py-3.5 text-base">Order now</Link>
              <Link href="/events" className="btn btn-outline px-7 py-3.5 text-base">Book us for an event</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
              <span>✓ Made fresh daily</span>
              <span>✓ Cash on delivery</span>
              <span>✓ Events & catering</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 -z-0 rotate-6 rounded-[3rem] bg-blush/25" aria-hidden />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_30px_80px_-30px_rgb(111_51_58_/_0.55)] ring-1 ring-white">
              <Image
                src="/products/signature-1.webp"
                alt="Cakeitis Signature Tiramisu"
                width={1080}
                height={1080}
                priority
                sizes="(min-width: 768px) 448px, 90vw"
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -left-2 bottom-8 rounded-2xl bg-white/95 px-5 py-3 shadow-lg ring-1 ring-cream backdrop-blur lg:-left-10">
              <p className="font-serif text-lg text-rose-dark">Signature Tiramisu</p>
              {minPrice != null && <p className="text-sm text-muted">from {formatEGP(minPrice)}</p>}
            </div>
            <div className="absolute -right-2 -top-5 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-cream lg:-right-8">
              <Image src="/logo.png" alt="" width={517} height={341} className="h-auto w-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="bg-cream/60 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">The menu</p>
            <h2 className="mt-2 font-serif text-4xl text-rose-dark">Two tiramisus. Zero shortcuts.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {menu.map((p) => (
              <Link
                key={p.id}
                href="/menu"
                className="group rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-cream transition hover:-translate-y-1 hover:shadow-xl"
              >
                <ProductImage images={p.images} accent={p.accent} alt={p.name} />
                <div className="mt-4 flex items-end justify-between gap-3 px-1">
                  <div>
                    <h3 className="font-serif text-2xl text-rose-dark group-hover:text-rose">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted">{p.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm font-semibold text-rose">
                    {formatEGP(Math.min(...p.sizes.map((s) => s.price)))}+
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/menu" className="btn px-7 py-3">See the full menu</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">How it works</p>
          <h2 className="mt-2 font-serif text-4xl text-rose-dark">From our kitchen to your spoon</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-[2rem] bg-white p-7 ring-1 ring-cream">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose font-serif text-lg text-white">
                {s.n}
              </span>
              <h3 className="mt-5 font-serif text-2xl text-rose-dark">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events banner */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] bg-rose-dark md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center px-8 py-12 md:px-14 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Events & catering</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">
              Having a party? Let the tiramisu come to you.
            </h2>
            <p className="mt-4 max-w-lg text-white/85">
              Our team brings the Cakeitis tiramisu cart to your wedding, engagement or office day and serves your
              guests fresh, cup by cup. Tell us the date and how many guests, and see an estimated price right away.
            </p>
            <div className="mt-8">
              <Link href="/events" className="btn bg-white px-8 py-4 text-base text-rose-dark hover:bg-cream">
                Book your event →
              </Link>
            </div>
          </div>
          <div className="p-2 md:p-3">
            <div className="relative min-h-96 overflow-hidden rounded-[2rem] md:h-full md:min-h-[32rem]">
              <Image
                src="/photos/event-serving.webp"
                alt="Cakeitis team serving tiramisu from the cart at a wedding"
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover object-[55%_40%]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
