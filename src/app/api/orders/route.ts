import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

// Public: place a COD order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productType, quantity, name, phone, address, pricePerDozen } = body;

    if (!productType || !quantity || !name || !phone || !address || !pricePerDozen) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return NextResponse.json({ error: "Minimum order is 1 dozen" }, { status: 400 });
    }

    const price = Number(pricePerDozen);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const totalAmount = qty * price;
    const freeDelivery = qty >= 2;

    await connectToDatabase();

    const order = await Order.create({
      productType: String(productType).slice(0, 100),
      quantity: qty,
      name: String(name).trim().slice(0, 100),
      phone: String(phone).trim().slice(0, 15),
      address: String(address).trim().slice(0, 500),
      pricePerDozen: price,
      totalAmount,
      paymentMethod: "cod",
      paymentStatus: "pending",
      freeDelivery,
    });

    return NextResponse.json({
      success: true,
      orderId: String(order._id),
      totalAmount,
      freeDelivery,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Admin: list all orders
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean() as unknown[];
    return NextResponse.json({
      orders: orders.map((o) => {
        const doc = o as Record<string, unknown>;
        return {
          _id: String(doc._id),
          productType: doc.productType,
          quantity: doc.quantity,
          name: doc.name,
          phone: doc.phone,
          address: doc.address,
          totalAmount: doc.totalAmount,
          paymentMethod: doc.paymentMethod,
          paymentStatus: doc.paymentStatus,
          orderStatus: doc.orderStatus,
          freeDelivery: doc.freeDelivery,
          razorpayPaymentLinkUrl: doc.razorpayPaymentLinkUrl,
          createdAt: doc.createdAt,
        };
      }),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Admin: update order status
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId, orderStatus, paymentStatus } = await request.json();
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    const validOrderStatus = ["new", "confirmed", "dispatched", "delivered", "cancelled"];
    const validPaymentStatus = ["pending", "paid", "failed"];

    const update: Record<string, string> = {};
    if (orderStatus && validOrderStatus.includes(orderStatus)) update.orderStatus = orderStatus;
    if (paymentStatus && validPaymentStatus.includes(paymentStatus)) update.paymentStatus = paymentStatus;

    await connectToDatabase();
    await Order.findByIdAndUpdate(orderId, update);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
