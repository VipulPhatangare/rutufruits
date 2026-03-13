import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Pincode } from "@/lib/models/Pincode";

type PincodePayload = {
  pincode?: unknown;
  city?: unknown;
  state?: unknown;
  country?: unknown;
  deliveryCharge?: unknown;
  minimumOrderAmount?: unknown;
  etaDays?: unknown;
  enabled?: unknown;
  source?: unknown;
  notes?: unknown;
};

function requireAdminSession() {
  return auth();
}

function sanitizeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function sanitizeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sanitizeBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1", "active", "enabled"].includes(normalized)) return true;
    if (["false", "no", "0", "inactive", "disabled"].includes(normalized)) return false;
  }
  return fallback;
}

function normalizePincodeInput(payload: PincodePayload, fallbackSource: "manual" | "csv") {
  const pincode = sanitizeText(payload.pincode).replace(/\D/g, "").slice(0, 6);
  if (pincode.length !== 6) {
    throw new Error("Each pincode must be exactly 6 digits");
  }

  return {
    pincode,
    city: sanitizeText(payload.city),
    state: sanitizeText(payload.state),
    country: sanitizeText(payload.country, "India") || "India",
    deliveryCharge: sanitizeNumber(payload.deliveryCharge),
    minimumOrderAmount: sanitizeNumber(payload.minimumOrderAmount),
    etaDays: sanitizeText(payload.etaDays),
    enabled: sanitizeBoolean(payload.enabled, true),
    source: sanitizeText(payload.source) === "csv" ? "csv" : fallbackSource,
    notes: sanitizeText(payload.notes),
  };
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const pincodes = await Pincode.find().sort({ enabled: -1, pincode: 1 }).lean();
    return NextResponse.json({
      pincodes: pincodes.map((entry) => ({
        _id: String(entry._id),
        pincode: entry.pincode,
        city: entry.city,
        state: entry.state,
        country: entry.country,
        deliveryCharge: entry.deliveryCharge,
        minimumOrderAmount: entry.minimumOrderAmount,
        etaDays: entry.etaDays,
        enabled: entry.enabled,
        source: entry.source,
        notes: entry.notes,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch pincodes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const rawEntries = Array.isArray(body?.pincodes)
      ? (body.pincodes as PincodePayload[])
      : [body as PincodePayload];

    if (rawEntries.length === 0) {
      return NextResponse.json({ error: "No pincodes provided" }, { status: 400 });
    }

    const normalizedEntries = rawEntries.map((entry) =>
      normalizePincodeInput(entry, Array.isArray(body?.pincodes) ? "csv" : "manual")
    );

    await connectToDatabase();
    const operations = normalizedEntries.map((entry) => ({
      updateOne: {
        filter: { pincode: entry.pincode },
        update: { $set: entry },
        upsert: true,
      },
    }));

    const result = await Pincode.bulkWrite(operations, { ordered: false });

    return NextResponse.json({
      success: true,
      processed: normalizedEntries.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save pincodes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = sanitizeText(body?._id);
    if (!id) return NextResponse.json({ error: "Missing pincode id" }, { status: 400 });

    const update = normalizePincodeInput(body as PincodePayload, sanitizeText(body?.source) === "csv" ? "csv" : "manual");

    await connectToDatabase();
    await Pincode.findByIdAndUpdate(id, update, { runValidators: true });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update pincode";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = sanitizeText(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing pincode id" }, { status: 400 });

    await connectToDatabase();
    await Pincode.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete pincode";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}