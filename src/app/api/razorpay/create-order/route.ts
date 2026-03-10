import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import razorpay from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { amount, customerName, customerPhone, description } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create a Razorpay payment link
    const paymentLink = await (razorpay.paymentLink).create({
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      accept_partial: false,
      description: description || "RutuFruits Alphonso Mango Order",
      customer: {
        name: customerName || "",
        contact: customerPhone || "",
      },
      notify: {
        sms: !!customerPhone,
        email: false,
      },
      reminder_enable: true,
      notes: {
        source: "RutuFruits Admin Dashboard",
      },
    });

    return NextResponse.json({
      id: paymentLink.id,
      short_url: paymentLink.short_url,
      amount: paymentLink.amount,
      status: paymentLink.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create payment link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
