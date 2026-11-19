import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SizeSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "Cup", "Small tray"
    serves: { type: String, default: "" }, // e.g. "1 person"
    price: { type: Number, required: true, min: 0 }, // EGP
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    accent: { type: String, default: "#c8894d" }, // placeholder art colour
    images: { type: [String], default: [] }, // paths under /public, first one is the main photo
    sizes: { type: [SizeSchema], validate: (v: unknown[]) => v.length > 0 },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

export const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) || model<ProductDoc>("Product", ProductSchema);
