// Seeds the menu. Run with: npm run seed
import mongoose from "mongoose";
import { Product } from "../src/models/Product";

const sizes = (cup: number, small: number, large: number) => [
  { label: "Cup", serves: "1 person", price: cup },
  { label: "Small tray", serves: "4–6 people", price: small },
  { label: "Large tray", serves: "10–12 people", price: large },
];

const products = [
  {
    name: "Classic Tiramisu",
    slug: "classic",
    description: "Espresso-soaked ladyfingers, airy mascarpone cream and a deep cocoa dusting.",
    accent: "#6b4226",
    sizes: sizes(95, 420, 780),
  },
  {
    name: "Lotus Biscoff",
    slug: "lotus",
    description: "Caramelised Lotus biscuits, Biscoff spread swirl and a crunchy crumble top.",
    accent: "#c8894d",
    sizes: sizes(110, 480, 890),
  },
  {
    name: "Pistachio",
    slug: "pistachio",
    description: "Silky pistachio cream layered with roasted pistachios and white chocolate.",
    accent: "#8a9a5b",
    sizes: sizes(130, 560, 1040),
  },
  {
    name: "Nutella Hazelnut",
    slug: "nutella",
    description: "Hazelnut mascarpone, Nutella ribbons and toasted hazelnut crunch.",
    accent: "#4a2c1d",
    sizes: sizes(115, 500, 920),
  },
  {
    name: "Strawberry",
    slug: "strawberry",
    description: "A summery twist: fresh strawberries, vanilla cream and strawberry syrup.",
    accent: "#c4536a",
    sizes: sizes(105, 460, 850),
  },
  {
    name: "Red Velvet",
    slug: "red-velvet",
    description: "Red velvet sponge, cream-cheese mascarpone and white chocolate shavings.",
    accent: "#9b2335",
    sizes: sizes(115, 500, 920),
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
