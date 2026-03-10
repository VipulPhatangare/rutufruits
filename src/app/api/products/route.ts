import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({ available: true }).lean();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, type, pricePerDozen, available, description } = body;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(
      id,
      { type, pricePerDozen, available, description, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Seed initial products if none exist (called once on first admin visit)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectToDatabase();

    if (body.seed) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany([
          {
            name: "Alphonso Mango",
            type: "Ratnagiri Hapus",
            slug: "ratnagiri-hapus",
            pricePerDozen: 680,
            minQty: 1,
            unit: "Dozen",
            available: true,
            description:
              "GI-tagged Ratnagiri Alphonso. Grown on the windward slopes of the Sahyadris, hand-picked at peak ripeness. Rich saffron flesh, thin skin, zero fibre.",
          },
          {
            name: "Alphonso Mango",
            type: "Devgad Hapus",
            slug: "devgad-hapus",
            pricePerDozen: 720,
            minQty: 1,
            unit: "Dozen",
            available: true,
            description:
              "GI-tagged Devgad Alphonso. Coastal Konkan sea breeze gives a distinctly floral, honey-sweet aroma. Considered the rarest grade by connoisseurs.",
          },
        ]);
        return NextResponse.json({ seeded: true });
      }
      return NextResponse.json({ seeded: false, message: "Products already exist" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to seed products" }, { status: 500 });
  }
}
