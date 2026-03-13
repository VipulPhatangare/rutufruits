import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { DeliveryChargeRule } from "@/lib/models/DeliveryChargeRule";

type DeliveryChargePayload = {
  _id?: unknown;
  name?: unknown;
  minDistanceKm?: unknown;
  maxDistanceKm?: unknown;
  baseCharge?: unknown;
  chargePerKm?: unknown;
  minimumCharge?: unknown;
  enabled?: unknown;
  notes?: unknown;
};

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
    if (["true", "yes", "1", "enabled", "active"].includes(normalized)) return true;
    if (["false", "no", "0", "disabled", "inactive"].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeRule(payload: DeliveryChargePayload) {
  const minDistanceKm = sanitizeNumber(payload.minDistanceKm);
  const maxDistanceKm = sanitizeNumber(payload.maxDistanceKm);

  if (!sanitizeText(payload.name)) {
    throw new Error("Rule name is required");
  }

  if (maxDistanceKm < minDistanceKm) {
    throw new Error("Maximum distance must be greater than or equal to minimum distance");
  }

  return {
    name: sanitizeText(payload.name),
    minDistanceKm,
    maxDistanceKm,
    baseCharge: sanitizeNumber(payload.baseCharge),
    chargePerKm: sanitizeNumber(payload.chargePerKm),
    minimumCharge: sanitizeNumber(payload.minimumCharge),
    enabled: sanitizeBoolean(payload.enabled, true),
    notes: sanitizeText(payload.notes),
  };
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const rules = await DeliveryChargeRule.find().sort({ enabled: -1, minDistanceKm: 1, maxDistanceKm: 1 }).lean();
    return NextResponse.json({
      rules: rules.map((rule) => ({
        _id: String(rule._id),
        name: rule.name,
        minDistanceKm: rule.minDistanceKm,
        maxDistanceKm: rule.maxDistanceKm,
        baseCharge: rule.baseCharge,
        chargePerKm: rule.chargePerKm,
        minimumCharge: rule.minimumCharge,
        enabled: rule.enabled,
        notes: rule.notes,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch delivery charge rules";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as DeliveryChargePayload;
    const payload = normalizeRule(body);

    await connectToDatabase();
    const created = await DeliveryChargeRule.create(payload);

    return NextResponse.json({ success: true, id: String(created._id) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create delivery charge rule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as DeliveryChargePayload;
    const id = sanitizeText(body._id);
    if (!id) return NextResponse.json({ error: "Missing rule id" }, { status: 400 });

    const payload = normalizeRule(body);

    await connectToDatabase();
    await DeliveryChargeRule.findByIdAndUpdate(id, payload, { runValidators: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update delivery charge rule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = sanitizeText(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing rule id" }, { status: 400 });

    await connectToDatabase();
    await DeliveryChargeRule.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete delivery charge rule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}