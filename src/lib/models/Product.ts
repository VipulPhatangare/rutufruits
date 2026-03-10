import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  type: string;
  slug: string;
  pricePerDozen: number;
  minQty: number;
  unit: string;
  available: boolean;
  description: string;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, default: "Alphonso Mango" },
    type: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    pricePerDozen: { type: Number, required: true },
    minQty: { type: Number, default: 1 },
    unit: { type: String, default: "Dozen" },
    available: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Product =
  (models.Product as mongoose.Model<IProduct>) || model<IProduct>("Product", ProductSchema);
