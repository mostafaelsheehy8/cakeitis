import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ORDER_STATUSES } from "../lib/config";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, default: "" },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    items: { type: [OrderItemSchema], validate: (v: unknown[]) => v.length > 0 },
    customer: { type: CustomerSchema, required: true },
    notes: { type: String, default: "" },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;

export const Order: Model<OrderDoc> =
  (models.Order as Model<OrderDoc>) || model<OrderDoc>("Order", OrderSchema);
