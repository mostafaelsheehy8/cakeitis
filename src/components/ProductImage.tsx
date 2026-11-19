"use client";

import Image from "next/image";
import { useState } from "react";
import { TiramisuArt } from "./TiramisuArt";

// Square product photo with optional thumbnails; falls back to the placeholder art.
export function ProductImage({
  images,
  accent,
  alt,
  showThumbs = false,
  className = "",
}: {
  images?: string[];
  accent?: string;
  alt: string;
  showThumbs?: boolean;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return <TiramisuArt accent={accent} className={`aspect-square ${className}`} />;

  return (
    <div className={className}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        <Image
          src={images[idx]}
          alt={alt}
          fill
          sizes="(min-width: 640px) 420px, 100vw"
          className="object-cover"
        />
      </div>
      {showThumbs && images.length > 1 && (
        <div className="mt-2 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative h-14 w-14 overflow-hidden rounded-lg ring-2 transition ${
                i === idx ? "ring-rose" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
