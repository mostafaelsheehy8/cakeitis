import Image from "next/image";

// Page header: text on the brand colour, with a sharp photo card beside it.
export function PageHero({
  eyebrow,
  title,
  text,
  image,
  imageAlt = "",
  position = "object-center",
  tall = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: string;
  imageAlt?: string;
  position?: string;
  tall?: boolean;
}) {
  return (
    <section className="px-4 pt-6">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] bg-rose-dark md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-center px-8 py-10 md:px-14 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">{title}</h1>
          {text && <p className="mt-4 max-w-xl text-white/85">{text}</p>}
        </div>
        <div className="p-2 md:p-3">
          <div className={`relative overflow-hidden rounded-[2rem] md:aspect-auto md:h-full ${tall ? "aspect-square md:min-h-[28rem]" : "aspect-[16/10] md:min-h-80"}`}>
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 768px) 540px, 100vw" className={`object-cover ${position}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
