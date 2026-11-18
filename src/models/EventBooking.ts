import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { EVENT_STATUSES } from "../lib/config";

const EventBookingSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    eventType: { type: String, default: "" },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    estimatedTotal: { type: Number, min: 0 }, // EGP, computed from guests on the server
    budget: { type: Number, min: 0 }, // legacy: only on bookings made before estimates
    notes: { type: String, default: "" },
    status: { type: String, enum: EVENT_STATUSES, default: "new" },
  },
  { timestamps: true },
);

export type EventBookingDoc = InferSchemaType<typeof EventBookingSchema>;

export const EventBooking: Model<EventBookingDoc> =
  (models.EventBooking as Model<EventBookingDoc>) ||
  model<EventBookingDoc>("EventBooking", EventBookingSchema);
