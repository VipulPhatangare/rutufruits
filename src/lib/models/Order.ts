import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    // ── Identity ─────────────────────────────────────────────
    orderId: { type: String },

    // ── Customer ─────────────────────────────────────────────
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },

    // ── Product ──────────────────────────────────────────────
    mangoType: { type: String },      // legacy field name
    productType: { type: String },    // new field name

    quantity: { type: Number, required: true, min: 1 },
    pricePerDozen: { type: Number },
    subtotal: { type: Number },
    tax: { type: Number },
    deliveryCharges: { type: Number },
    distance: { type: Number },
    amount: { type: Number },         // legacy total field
    totalAmount: { type: Number },    // new total field
    freeDelivery: { type: Boolean, default: false },

    // ── Address ───────────────────────────────────────────────
    address: { type: String },        // flat address (new orders)
    deliveryAddress: {                // nested address (legacy orders)
      local_address: { type: String },
      city: { type: String },
      state: { type: String },
      postal_code: { type: String },
      country: { type: String },
      google_map_link: { type: String },
      userSendAddress: { type: String },
    },

    // ── Payment ───────────────────────────────────────────────
    paymentMethod: { type: String, enum: ["cod", "razorpay"] },
    paymentStatus: {                  // flat (new orders)
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    payment: {                        // nested (legacy orders)
      payment_id: { type: String },
      payment_link_id: { type: String },
      payment_link: { type: String },
      paymentStarted: { type: Boolean },
      paymentCompleted: { type: Boolean },
    },
    razorpayPaymentLinkId: { type: String },
    razorpayPaymentLinkUrl: { type: String },

    // ── Order status ──────────────────────────────────────────
    orderStatus: {
      isOrderPlace:    { type: Boolean },
      isWantOrder:     { type: Boolean },
      isPaymentDone:   { type: Boolean },
      delivery_status: {
        type: String,
        enum: ["pending", "dispatched", "delivered", "failed"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
