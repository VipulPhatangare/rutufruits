import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    whatsappNumber: { type: String, required: true, default: "918485844450" },
    whatsappMessageTemplate: {
      type: String,
      default:
        "Hi RutuFruits! 🥭\nI'd like to order:\n• Type: [Ratnagiri Hapus / Devgad Hapus]\n• Quantity: ___ Dozen\n• Name: \n• Delivery Address: ",
    },
  },
  { timestamps: true }
);

export const Settings =
  (models.Settings as mongoose.Model<ISettings>) ||
  model<ISettings>("Settings", SettingsSchema);
