import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { LocationShare } from "@/lib/models/LocationShare";

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const phone = sanitizeText(body?.phone);
    const latitude = sanitizeNumber(body?.latitude);
    const longitude = sanitizeNumber(body?.longitude);

    if (!phone || !/^[0-9+\s\-()]{7,20}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
    }

    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: "Invalid longitude" }, { status: 400 });
    }

    await connectToDatabase();

    const created = await LocationShare.create({
      phone,
      latitude,
      longitude,
      userAgent: sanitizeText(request.headers.get("user-agent")),
      source: sanitizeText(request.headers.get("origin")) || sanitizeText(request.headers.get("referer")),
    });

    return NextResponse.json({ success: true, id: String(created._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save location" }, { status: 500 });
  }
}
