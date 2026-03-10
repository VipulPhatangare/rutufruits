import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    productType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pricePerDozen: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "razorpay"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["new", "confirmed", "dispatched", "delivered", "cancelled"],
      default: "new",
    },
    freeDelivery: { type: Boolean, default: false },
    razorpayPaymentLinkId: { type: String },
    razorpayPaymentLinkUrl: { type: String },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
