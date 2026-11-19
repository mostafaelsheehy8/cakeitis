import Image from "next/image";

// Page header with a soft photo background and a rose overlay.
export function PageHero({
  eyebrow,
  title,
  text,
  image = "/photos/banner-open.webp",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-dark/90 via-rose-dark/75 to-rose/45" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-white md:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-xl text-white/85">{text}</p>}
      </div>
    </section>
  );
}
