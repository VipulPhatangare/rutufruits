import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Contact } from "@/lib/models/Contact";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Basic input validation
    if (!name || !phone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (typeof phone !== "string" || !/^[0-9+\s\-()]{7,20}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (typeof message !== "string" || message.length > 1000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    await connectToDatabase();
    const contact = await Contact.create({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !["new", "replied"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
