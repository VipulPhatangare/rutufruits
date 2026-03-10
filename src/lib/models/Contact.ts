import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  phone: string;
  message: string;
  status: "new" | "replied";
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "replied"], default: "new" },
  },
  { timestamps: true }
);

export const Contact =
  (models.Contact as mongoose.Model<IContact>) || model<IContact>("Contact", ContactSchema);
