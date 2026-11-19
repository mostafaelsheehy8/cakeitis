import { connectDB } from "./db";
import { Product } from "@/models/Product";

export type MenuProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  images: string[];
  sizes: { label: string; serves: string; price: number }[];
};

export async function getMenu(): Promise<MenuProduct[]> {
  await connectDB();
  const docs = await Product.find({ available: true }).sort({ sortOrder: 1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    slug: d.slug,
    description: d.description ?? "",
    accent: d.accent ?? "#6b4226",
    images: d.images ?? [],
    sizes: d.sizes.map((s) => ({ label: s.label, serves: s.serves ?? "", price: s.price })),
  }));
}
