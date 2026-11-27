// Validates product data sent from the admin Products tab.
import { str } from "./validate";

// Photos the admin can pick from (files in /public). Add new ones here after dropping them in /public/products.
export const PRODUCT_PHOTOS = [
  { src: "/products/small-box.webp", label: "Small box" },
  { src: "/products/large-tray.webp", label: "Large tray" },
  { src: "/photos/spatula-slice.webp", label: "Slice on a spatula" },
  { src: "/photos/event-serving.webp", label: "Event cart" },
];
const PHOTO_SET = new Set(PRODUCT_PHOTOS.map((p) => p.src));
const photo = (v: unknown) => {
  const s = str(v, 200);
  return PHOTO_SET.has(s) ? s : "";
};

export type ProductInput = {
  name: string;
  description: string;
  images: string[];
  sizes: { label: string; serves: string; price: number; image: string }[];
  available: boolean;
  sortOrder: number;
};

export function parseProduct(b: Record<string, unknown>): { data?: ProductInput; error?: string } {
  const name = str(b.name, 80);
  if (!name) return { error: "Please enter a product name" };

  const rawSizes = Array.isArray(b.sizes) ? (b.sizes as Record<string, unknown>[]) : [];
  if (rawSizes.length === 0) return { error: "Add at least one size with a price" };
  if (rawSizes.length > 10) return { error: "Too many sizes" };
  const sizes = [];
  const labels = new Set<string>();
  for (const s of rawSizes) {
    const label = str(s.label, 40);
    const price = Number(s.price);
    if (!label) return { error: "Every size needs a name (e.g. Small)" };
    if (labels.has(label.toLowerCase())) return { error: `Size "${label}" is listed twice` };
    labels.add(label.toLowerCase());
    if (!Number.isFinite(price) || price <= 0 || price > 100000) return { error: `Enter a valid price for "${label}"` };
    sizes.push({ label, serves: str(s.serves, 40), price: Math.round(price), image: photo(s.image) });
  }

  const main = photo(b.image);
  const sortOrder = Number(b.sortOrder);
  return {
    data: {
      name,
      description: str(b.description, 400),
      images: main ? [main] : [],
      sizes,
      available: b.available !== false,
      sortOrder: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    },
  };
}

export function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "product"
  );
}
