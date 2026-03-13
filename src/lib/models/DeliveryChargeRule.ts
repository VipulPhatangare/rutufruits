import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IDeliveryChargeRule extends Document {
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  baseCharge: number;
  chargePerKm: number;
  minimumCharge: number;
  enabled: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryChargeRuleSchema = new Schema<IDeliveryChargeRule>(
  {
    name: { type: String, required: true, trim: true },
    minDistanceKm: { type: Number, required: true, min: 0, default: 0 },
    maxDistanceKm: { type: Number, required: true, min: 0, default: 0 },
    baseCharge: { type: Number, min: 0, default: 0 },
    chargePerKm: { type: Number, min: 0, default: 0 },
    minimumCharge: { type: Number, min: 0, default: 0 },
    enabled: { type: Boolean, default: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const DeliveryChargeRule =
  (models.DeliveryChargeRule as mongoose.Model<IDeliveryChargeRule>) ||
  model<IDeliveryChargeRule>("DeliveryChargeRule", DeliveryChargeRuleSchema);