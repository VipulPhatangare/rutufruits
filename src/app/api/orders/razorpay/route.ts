import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import razorpay from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, quantity, name, phone, address, pricePerDozen } = body;

    if (!productType || !quantity || !name || !phone || !address || !pricePerDozen) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const qty = Number(quantity);
    const price = Number(pricePerDozen);
    if (!Number.isInteger(qty) || qty < 1 || isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid quantity or price" }, { status: 400 });
    }

    const totalAmount = qty * price;
    const freeDelivery = qty >= 2;

    // Create Razorpay payment link
    const paymentLink = await (razorpay.paymentLink as unknown as {
      create: (opts: Record<string, unknown>) => Promise<{ id: string; short_url: string }>;
    }).create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      accept_partial: false,
      description: `RutuFruits – ${String(productType).slice(0, 80)} x${qty} Dozen`,
      customer: {
        name: String(name).trim().slice(0, 100),
        contact: String(phone).trim().slice(0, 15),
      },
      notify: { sms: true, email: false },
      reminder_enable: true,
      notes: {
        productType: String(productType).slice(0, 100),
        quantity: String(qty),
        address: String(address).trim().slice(0, 500),
        source: "RutuFruits Website",
      },
    });

    await connectToDatabase();

    const order = await Order.create({
      productType: String(productType).slice(0, 100),
      quantity: qty,
      name: String(name).trim().slice(0, 100),
      phone: String(phone).trim().slice(0, 15),
      address: String(address).trim().slice(0, 500),
      pricePerDozen: price,
      totalAmount,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      freeDelivery,
      razorpayPaymentLinkId: paymentLink.id,
      razorpayPaymentLinkUrl: paymentLink.short_url,
    });

    return NextResponse.json({
      success: true,
      orderId: String(order._id),
      paymentUrl: paymentLink.short_url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
