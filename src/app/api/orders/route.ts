import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

type RawOrderDocument = {
  _id?: unknown;
  orderId?: unknown;
  productType?: unknown;
  mangoType?: unknown;
  quantity?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  deliveryAddress?: {
    local_address?: unknown;
    city?: unknown;
    state?: unknown;
    postal_code?: unknown;
    country?: unknown;
    userSendAddress?: unknown;
  } | null;
  pricePerDozen?: unknown;
  subtotal?: unknown;
  tax?: unknown;
  deliveryCharges?: unknown;
  totalAmount?: unknown;
  amount?: unknown;
  distance?: unknown;
  paymentMethod?: unknown;
  paymentStatus?: unknown;
  payment?: {
    payment_id?: unknown;
    payment_link_id?: unknown;
    payment_link?: unknown;
    paymentStarted?: unknown;
    paymentCompleted?: unknown;
  } | null;
  orderStatus?:
    | unknown
    | {
        status?: unknown;
        isOrderPlace?: unknown;
        isWantOrder?: unknown;
        isPaymentDone?: unknown;
      };
  freeDelivery?: unknown;
  razorpayPaymentLinkUrl?: unknown;
  createdAt?: unknown;
};

type AdminOrderStatus = "new" | "confirmed" | "dispatched" | "delivered" | "cancelled";
type AdminPaymentStatus = "pending" | "paid" | "failed";

function getNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function capitalizeStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeOrderStatus(rawStatus: unknown): AdminOrderStatus {
  if (typeof rawStatus === "string") {
    const normalized = rawStatus.trim().toLowerCase();
    if (["new", "pending", "placed", "processing"].includes(normalized)) return "new";
    if (normalized === "confirmed") return "confirmed";
    if (["dispatched", "shipped", "out_for_delivery", "out for delivery"].includes(normalized)) {
      return "dispatched";
    }
    if (["delivered", "complete", "completed"].includes(normalized)) return "delivered";
    if (["cancelled", "canceled", "rejected"].includes(normalized)) return "cancelled";
  }

  return "new";
}

function normalizePaymentStatus(order: RawOrderDocument): AdminPaymentStatus {
  const rawPaymentStatus = typeof order.paymentStatus === "string" ? order.paymentStatus.toLowerCase() : "";

  if (["paid", "captured", "success", "completed"].includes(rawPaymentStatus)) return "paid";
  if (["failed", "cancelled", "canceled"].includes(rawPaymentStatus)) return "failed";
  if (rawPaymentStatus === "pending") return "pending";

  if (order.payment?.paymentCompleted === true) return "paid";
  if (order.payment?.paymentStarted === true) return "pending";

  return "pending";
}

function buildAddress(order: RawOrderDocument) {
  if (typeof order.address === "string" && order.address.trim()) {
    return order.address.trim();
  }

  const deliveryAddress = order.deliveryAddress;
  if (!deliveryAddress) return "";

  const parts = [
    getString(deliveryAddress.userSendAddress),
    getString(deliveryAddress.local_address),
    getString(deliveryAddress.city),
    getString(deliveryAddress.state),
    getString(deliveryAddress.postal_code),
    getString(deliveryAddress.country),
  ].filter(Boolean);

  return Array.from(new Set(parts)).join(", ");
}

function getNestedOrderStatus(orderStatus: RawOrderDocument["orderStatus"]) {
  if (typeof orderStatus === "object" && orderStatus !== null && "status" in orderStatus) {
    return orderStatus.status;
  }

  return undefined;
}

function getOrdersCollection() {
  const db = Order.db.db;
  if (!db) {
    throw new Error("Orders database connection is not available");
  }

  return db.collection("orders");
}

function normalizeOrder(doc: RawOrderDocument) {
  const rawNestedStatus = getNestedOrderStatus(doc.orderStatus);
  const normalizedOrderStatus = normalizeOrderStatus(rawNestedStatus ?? doc.orderStatus);
  const normalizedPaymentStatus = normalizePaymentStatus(doc);
  const totalAmount = getNumber(doc.totalAmount ?? doc.amount);
  const pricePerDozen = getNumber(doc.pricePerDozen);
  const quantity = getNumber(doc.quantity, 1);
  const paymentMethod = getString(doc.paymentMethod) || (doc.payment ? "razorpay" : "cod");

  return {
    _id: String(doc._id ?? ""),
    orderId: getString(doc.orderId) || String(doc._id ?? ""),
    productType: getString(doc.productType) || getString(doc.mangoType) || "Unknown product",
    quantity,
    name: getString(doc.name) || "Unknown customer",
    email: getString(doc.email),
    phone: getString(doc.phone),
    address: buildAddress(doc),
    totalAmount,
    pricePerDozen,
    subtotal: getNumber(doc.subtotal, totalAmount || quantity * pricePerDozen),
    tax: getNumber(doc.tax),
    deliveryCharges: getNumber(doc.deliveryCharges),
    distance: getNumber(doc.distance),
    paymentMethod: paymentMethod === "razorpay" ? "razorpay" : "cod",
    paymentStatus: normalizedPaymentStatus,
    orderStatus: normalizedOrderStatus,
    orderStatusLabel: typeof rawNestedStatus === "string" ? rawNestedStatus : capitalizeStatus(normalizedOrderStatus),
    freeDelivery: Boolean(doc.freeDelivery),
    razorpayPaymentLinkUrl:
      getString(doc.razorpayPaymentLinkUrl) || getString(doc.payment?.payment_link),
    paymentId: getString(doc.payment?.payment_id),
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : getString(doc.createdAt) || new Date().toISOString(),
  };
}

function buildOrderStatusUpdate(status: string) {
  const capitalized = capitalizeStatus(status);

  return {
    orderStatus: status,
    "orderStatus.status": capitalized,
    "orderStatus.isOrderPlace": status !== "cancelled",
    "orderStatus.isWantOrder": status !== "cancelled",
  };
}

function buildPaymentStatusUpdate(status: string) {
  return {
    paymentStatus: status,
    "payment.paymentStarted": status !== "failed",
    "payment.paymentCompleted": status === "paid",
    "orderStatus.isPaymentDone": status === "paid",
  };
}

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
    const orders = (await getOrdersCollection().find({}).sort({ createdAt: -1 }).toArray()) as RawOrderDocument[];

    return NextResponse.json({
      orders: orders.map(normalizeOrder),
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
    if (orderStatus && validOrderStatus.includes(orderStatus)) {
      Object.assign(update, buildOrderStatusUpdate(orderStatus));
    }
    if (paymentStatus && validPaymentStatus.includes(paymentStatus)) {
      Object.assign(update, buildPaymentStatusUpdate(paymentStatus));
    }

    await connectToDatabase();
    await getOrdersCollection().updateOne(
      { _id: Types.ObjectId.isValid(orderId) ? new Types.ObjectId(orderId) : orderId },
      { $set: update }
    );
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
