// Seeds the menu. Run with: npm run seed
import mongoose from "mongoose";
import { Product } from "../src/models/Product";

// Same prices for every flavour. Add a Medium size here once its price is decided.
const SIZES = [
  { label: "Small", serves: "", price: 110 },
  { label: "Large", serves: "", price: 470 },
];

const products = [
  {
    name: "Classic Tiramisu",
    slug: "classic",
    description: "Espresso-soaked ladyfingers, airy mascarpone cream and a deep cocoa dusting.",
    accent: "#6b4226",
    sizes: SIZES,
  },
  {
    name: "Lotus Biscoff",
    slug: "lotus",
    description: "Caramelised Lotus biscuits, Biscoff spread swirl and a crunchy crumble top.",
    accent: "#c8894d",
    sizes: SIZES,
  },
  {
    name: "Pistachio",
    slug: "pistachio",
    description: "Silky pistachio cream layered with roasted pistachios and white chocolate.",
    accent: "#8a9a5b",
    sizes: SIZES,
  },
  {
    name: "Nutella Hazelnut",
    slug: "nutella",
    description: "Hazelnut mascarpone, Nutella ribbons and toasted hazelnut crunch.",
    accent: "#4a2c1d",
    sizes: SIZES,
  },
  {
    name: "Strawberry",
    slug: "strawberry",
    description: "A summery twist: fresh strawberries, vanilla cream and strawberry syrup.",
    accent: "#c4536a",
    sizes: SIZES,
  },
  {
    name: "Red Velvet",
    slug: "red-velvet",
    description: "Red velvet sponge, cream-cheese mascarpone and white chocolate shavings.",
    accent: "#9b2335",
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
  console.log(`Seeded ${products.length} products into ${mongoose.connection.name}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
