// Seeds the menu. Run with: npm run seed
// Products not listed here are hidden from the menu (kept in the DB so old orders still make sense).
import mongoose from "mongoose";
import { Product } from "../src/models/Product";

// Same prices for every product. Add a Medium size here once its price is decided.
const SIZES = [
  { label: "Small", serves: "", price: 110 },
  { label: "Large", serves: "", price: 470 },
];

const products = [
  {
    name: "Signature Tiramisu",
    slug: "signature",
    description: "Our house tiramisu, made with the Cakeitis secret recipe.",
    accent: "#964a51",
    images: ["/products/signature-slice.webp"],
    sizes: SIZES,
  },
  {
    name: "Classic Tiramisu",
    slug: "classic",
    description: "The Italian original: espresso-soaked ladyfingers, mascarpone cream and cocoa.",
    accent: "#6b4226",
    images: ["/products/classic-slice.webp"],
    sizes: SIZES,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Create .env.local from .env.example.");
  await mongoose.connect(uri);
  for (const [i, p] of products.entries()) {
    await Product.updateOne({ slug: p.slug }, { $set: { ...p, sortOrder: i, available: true } }, { upsert: true });
  }
  const hidden = await Product.updateMany(
    { slug: { $nin: products.map((p) => p.slug) }, available: true },
    { $set: { available: false } },
  );
  console.log(
    `Seeded ${products.length} products into ${mongoose.connection.name}; hid ${hidden.modifiedCount} old product(s).`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
