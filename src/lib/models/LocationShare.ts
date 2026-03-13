import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ILocationShare extends Document {
  phone: string;
  latitude: number;
  longitude: number;
  userAgent: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocationShareSchema = new Schema<ILocationShare>(
  {
    phone: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    userAgent: { type: String, default: "" },
    source: { type: String, default: "" },
  },
  { timestamps: true }
);

export const LocationShare =
  (models.LocationShare as mongoose.Model<ILocationShare>) ||
  model<ILocationShare>("LocationShare", LocationShareSchema);
