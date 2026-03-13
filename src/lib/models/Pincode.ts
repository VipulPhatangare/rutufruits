import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IPincode extends Document {
  pincode: string;
  city: string;
  state: string;
  country: string;
  deliveryCharge: number;
  minimumOrderAmount: number;
  etaDays: string;
  enabled: boolean;
  source: "manual" | "csv";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const PincodeSchema = new Schema<IPincode>(
  {
    pincode: { type: String, required: true, unique: true, trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    minimumOrderAmount: { type: Number, default: 0, min: 0 },
    etaDays: { type: String, default: "", trim: true },
    enabled: { type: Boolean, default: true },
    source: { type: String, enum: ["manual", "csv"], default: "manual" },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Pincode =
  (models.Pincode as mongoose.Model<IPincode>) || model<IPincode>("Pincode", PincodeSchema);