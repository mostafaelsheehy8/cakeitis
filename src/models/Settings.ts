import { Schema, model, models, type Model } from "mongoose";

// One document (_id "site") with settings the owner edits from /admin -> Delivery.
export type SettingsDoc = {
  _id: string;
  deliveryAreas: { name: string; fee: number }[];
  hours: string;
};

const SettingsSchema = new Schema<SettingsDoc>(
  {
    _id: { type: String, default: "site" },
    deliveryAreas: {
      type: [new Schema({ name: { type: String, required: true }, fee: { type: Number, required: true, min: 0 } }, { _id: false })],
      default: [],
    },
    hours: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Settings: Model<SettingsDoc> =
  (models.Settings as Model<SettingsDoc>) || model<SettingsDoc>("Settings", SettingsSchema);
