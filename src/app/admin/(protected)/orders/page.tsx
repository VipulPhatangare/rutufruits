"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderId: string;
  productType: string;
  quantity: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  totalAmount: number;
  pricePerDozen: number;
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  distance: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "new" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  orderStatusLabel?: string;
  freeDelivery: boolean;
  razorpayPaymentLinkUrl?: string;
  paymentId?: string;
  createdAt: string;
}

const ORDER_STATUSES = ["new", "confirmed", "dispatched", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

const statusColor: Record<string, string> = {
  new: "#e67e22",
  confirmed: "#2980b9",
  dispatched: "#8e44ad",
  delivered: "#27ae60",
  cancelled: "#c0392b",
  pending: "#e67e22",
  paid: "#27ae60",
  failed: "#c0392b",
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  function loadOrders() {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});
  }

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function updateOrder(
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: string
  ) {
    setUpdating(orderId + field);
    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, [field]: value }),
    })
      .then(() => loadOrders())
      .finally(() => setUpdating(null));
  }

  const total = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const newCount = orders.filter((o) => o.orderStatus === "new").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light mb-1"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          Orders
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          All customer orders — COD and Razorpay
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "New Orders", value: newCount },
          { label: "Total Revenue", value: `₹${total.toLocaleString("en-IN")}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-sm"
            style={{ backgroundColor: "var(--cream-white)" }}
          >
            <p
              className="text-2xl font-light mb-1"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              {stat.value}
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <p
          className="text-sm py-12 text-center"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <p
          className="text-sm py-12 text-center"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-sm p-6"
              style={{ backgroundColor: "var(--cream-white)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                {/* Left: customer + product */}
                <div>
                  <p
                    className="font-medium mb-0.5"
                    style={{
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {order.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {order.phone}
                  </p>
                  {order.email && (
                    <p
                      className="text-sm"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {order.email}
                    </p>
                  )}
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {order.productType} · {order.quantity} Dozen
                    {order.pricePerDozen > 0 && (
                      <span className="ml-2">@ {formatCurrency(order.pricePerDozen)}/dozen</span>
                    )}
                    {order.freeDelivery && (
                      <span
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(44,74,46,0.1)", color: "var(--forest)" }}
                      >
                        Free Delivery
                      </span>
                    )}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {order.address}
                  </p>
                </div>

                {/* Right: amount + payment */}
                <div className="text-right">
                  <p
                    className="text-xl font-medium mb-1"
                    style={{
                      fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                      color: "var(--forest)",
                    }}
                  >
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p
                    className="text-xs uppercase"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}
                  </p>
                  {order.orderId && (
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Order ID: {order.orderId}
                    </p>
                  )}
                  {order.paymentId && (
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Payment ID: {order.paymentId}
                    </p>
                  )}
                  {order.razorpayPaymentLinkUrl && (
                    <a
                      href={order.razorpayPaymentLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline mt-0.5 block"
                      style={{ color: "var(--forest)" }}
                    >
                      Payment link
                    </a>
                  )}
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
                style={{ color: "var(--warm-grey)" }}
              >
                <div
                  className="rounded-sm px-3 py-2"
                  style={{ backgroundColor: "var(--ivory)" }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1">Subtotal</p>
                  <p className="text-sm" style={{ color: "var(--charcoal)" }}>
                    {formatCurrency(order.subtotal || order.totalAmount)}
                  </p>
                </div>
                <div
                  className="rounded-sm px-3 py-2"
                  style={{ backgroundColor: "var(--ivory)" }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1">Tax</p>
                  <p className="text-sm" style={{ color: "var(--charcoal)" }}>
                    {formatCurrency(order.tax)}
                  </p>
                </div>
                <div
                  className="rounded-sm px-3 py-2"
                  style={{ backgroundColor: "var(--ivory)" }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1">Delivery</p>
                  <p className="text-sm" style={{ color: "var(--charcoal)" }}>
                    {formatCurrency(order.deliveryCharges)}
                  </p>
                </div>
                <div
                  className="rounded-sm px-3 py-2"
                  style={{ backgroundColor: "var(--ivory)" }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1">Distance</p>
                  <p className="text-sm" style={{ color: "var(--charcoal)" }}>
                    {order.distance > 0 ? `${order.distance.toFixed(2)} km` : "—"}
                  </p>
                </div>
              </div>

              {/* Status controls */}
              <div
                className="flex flex-wrap gap-6 pt-4 border-t"
                style={{ borderColor: "var(--parchment)" }}
              >
                {/* Order status */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-1"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Order Status
                  </label>
                  {order.orderStatusLabel && (
                    <p
                      className="text-xs mb-1"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Current source value: {order.orderStatusLabel}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: statusColor[order.orderStatus] ?? "#999" }}
                    />
                    <select
                      value={order.orderStatus}
                      disabled={updating === order._id + "orderStatus"}
                      onChange={(e) => updateOrder(order._id, "orderStatus", e.target.value)}
                      className="text-sm rounded-sm border px-2 py-1 outline-none"
                      style={{
                        borderColor: "var(--parchment)",
                        color: "var(--charcoal)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        backgroundColor: "var(--ivory)",
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment status */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-1"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Payment Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: statusColor[order.paymentStatus] ?? "#999" }}
                    />
                    <select
                      value={order.paymentStatus}
                      disabled={updating === order._id + "paymentStatus"}
                      onChange={(e) => updateOrder(order._id, "paymentStatus", e.target.value)}
                      className="text-sm rounded-sm border px-2 py-1 outline-none"
                      style={{
                        borderColor: "var(--parchment)",
                        color: "var(--charcoal)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        backgroundColor: "var(--ivory)",
                      }}
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
