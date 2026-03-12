import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/lib/models/Settings";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      // Create default settings on first request
      const created = await Settings.create({
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918485844450",
        whatsappMessageTemplate:
          "Hi RutuFruits! 🥭\nI'd like to order:\n• Type: [Ratnagiri Hapus / Devgad Hapus]\n• Quantity: ___ Dozen\n• Name: \n• Delivery Address: ",
      });
      settings = created.toObject();
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { whatsappNumber, whatsappMessageTemplate } = body;

    if (!whatsappNumber || typeof whatsappNumber !== "string") {
      return NextResponse.json({ error: "Invalid WhatsApp number" }, { status: 400 });
    }

    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      {},
      { whatsappNumber, whatsappMessageTemplate, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // Bust page cache so WhatsApp number/message updates appear immediately
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
