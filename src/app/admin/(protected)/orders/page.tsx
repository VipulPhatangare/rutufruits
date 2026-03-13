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
  deliveryStatus: "pending" | "dispatched" | "delivered" | "failed";
  orderStatusLabel?: string;
  freeDelivery: boolean;
  razorpayPaymentLinkUrl?: string;
  paymentId?: string;
  createdAt: string;
}

const ORDER_STATUSES = ["new", "confirmed", "dispatched", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;
const DELIVERY_STATUSES = ["pending", "dispatched", "delivered", "failed"] as const;

const orderStatusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  new:        { color: "#92400e", bg: "#fef3c7", dot: "#d97706", label: "New" },
  confirmed:  { color: "#1e3a8a", bg: "#dbeafe", dot: "#2563eb", label: "Confirmed" },
  dispatched: { color: "#5b21b6", bg: "#ede9fe", dot: "#7c3aed", label: "Dispatched" },
  delivered:  { color: "#14532d", bg: "#dcfce7", dot: "#16a34a", label: "Delivered" },
  cancelled:  { color: "#7f1d1d", bg: "#fee2e2", dot: "#dc2626", label: "Cancelled" },
};

const paymentStatusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  pending: { color: "#92400e", bg: "#fef3c7", dot: "#d97706", label: "Pending" },
  paid:    { color: "#14532d", bg: "#dcfce7", dot: "#16a34a", label: "Paid" },
  failed:  { color: "#7f1d1d", bg: "#fee2e2", dot: "#dc2626", label: "Failed" },
};

const deliveryStatusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  pending:    { color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", label: "Pending" },
  dispatched: { color: "#5b21b6", bg: "#ede9fe", dot: "#7c3aed", label: "Dispatched" },
  delivered:  { color: "#14532d", bg: "#dcfce7", dot: "#16a34a", label: "Delivered" },
  failed:     { color: "#7f1d1d", bg: "#fee2e2", dot: "#dc2626", label: "Failed" },
};

const orderStatusBorderColor: Record<string, string> = {
  new: "#d97706",
  confirmed: "#2563eb",
  dispatched: "#7c3aed",
  delivered: "#16a34a",
  cancelled: "#dc2626",
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status, config }: { status: string; config: { color: string; bg: string; dot: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.dot }} />
      {config.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const dmSans = "var(--font-dm-sans), 'DM Sans', sans-serif";
  const cormorant = "var(--font-cormorant), 'Cormorant Garamond', serif";

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

  // Keep modal in sync after status updates
  function updateOrder(orderId: string, field: "orderStatus" | "paymentStatus" | "deliveryStatus", value: string) {
    setUpdating(orderId + field);
    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, [field]: value }),
    })
      .then(() => {
        loadOrders();
        if (selected && selected._id === orderId) {
          setSelected((prev) => prev ? { ...prev, [field]: value } : prev);
        }
      })
      .finally(() => setUpdating(null));
  }

  const newCount       = orders.filter((o) => o.orderStatus === "new").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const paidTotal      = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="p-8">

      {/* ── Header ── */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-light mb-1" style={{ fontFamily: cormorant, color: "var(--forest)" }}>
            Orders
          </h1>
          <p className="text-sm" style={{ color: "#4b5563", fontFamily: dmSans }}>
            All customer orders — COD and Razorpay
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="text-sm px-4 py-2 rounded-sm border transition-colors"
          style={{ borderColor: "var(--parchment)", color: "var(--forest)", fontFamily: dmSans, backgroundColor: "var(--cream-white)" }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders",  value: orders.length,            sub: "all time" },
          { label: "New Orders",    value: newCount,                  sub: "awaiting action" },
          { label: "Delivered",     value: deliveredCount,            sub: "completed" },
          { label: "Collected",     value: formatCurrency(paidTotal), sub: "paid orders" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-sm" style={{ backgroundColor: "var(--cream-white)", borderTop: "2px solid var(--gold)" }}>
            <p className="text-3xl font-light mb-0.5" style={{ fontFamily: cormorant, color: "var(--forest)" }}>{stat.value}</p>
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#1a1a1a", fontFamily: dmSans }}>{stat.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#4b5563", fontFamily: dmSans }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["all", ...ORDER_STATUSES].map((s) => {
          const isActive = filter === s;
          const cfg = orderStatusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-sm px-4 py-1.5 rounded-full border transition-all"
              style={{
                fontFamily: dmSans,
                borderColor: isActive ? (cfg?.dot ?? "var(--forest)") : "#d1d5db",
                backgroundColor: isActive ? (cfg?.bg ?? "rgba(44,74,46,0.08)") : "transparent",
                color: isActive ? (cfg?.color ?? "var(--forest)") : "#374151",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {s === "all"
                ? `All (${orders.length})`
                : `${cfg.label} (${orders.filter((o) => o.orderStatus === s).length})`}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-base" style={{ color: "#4b5563", fontFamily: dmSans }}>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-sm" style={{ backgroundColor: "var(--cream-white)" }}>
          <p className="text-base" style={{ color: "#4b5563", fontFamily: dmSans }}>No orders found.</p>
        </div>
      ) : (
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--parchment)" }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "var(--ivory)", borderBottom: "1px solid var(--parchment)" }}>
                {["Date", "Customer", "Address", "Product", "Qty", "Subtotal", "Tax", "Delivery", "Total", "Delivery Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "#374151", fontFamily: dmSans, whiteSpace: "nowrap" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const dsCfg = deliveryStatusConfig[order.deliveryStatus] ?? deliveryStatusConfig.pending;
                const borderAccent = orderStatusBorderColor[order.orderStatus] ?? "var(--gold)";
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={order._id}
                    className="transition-colors"
                    style={{
                      backgroundColor: isEven ? "var(--cream-white)" : "var(--ivory)",
                      borderLeft: `3px solid ${borderAccent}`,
                      borderBottom: "1px solid var(--parchment)",
                    }}
                  >
                    {/* Date */}
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#4b5563", fontFamily: dmSans }}>
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3" style={{ fontFamily: dmSans }}>
                      <p className="text-sm font-semibold" style={{ color: "#111827" }}>{order.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{order.phone}</p>
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3 text-xs" style={{ color: "#4b5563", fontFamily: dmSans, maxWidth: "200px" }}>
                      <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {order.address || "—"}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3" style={{ fontFamily: dmSans }}>
                      <p className="text-sm font-medium" style={{ color: "#111827" }}>{order.productType}</p>
                      {order.pricePerDozen > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>@ {formatCurrency(order.pricePerDozen)}/doz</p>
                      )}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#374151", fontFamily: dmSans, fontWeight: 500 }}>
                      {order.quantity} doz
                    </td>

                    {/* Subtotal */}
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#374151", fontFamily: dmSans }}>
                      {formatCurrency(order.subtotal || order.totalAmount)}
                    </td>

                    {/* Tax */}
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#374151", fontFamily: dmSans }}>
                      {formatCurrency(order.tax)}
                    </td>

                    {/* Delivery charge */}
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ fontFamily: dmSans }}>
                      {order.freeDelivery ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#dcfce7", color: "#14532d" }}>Free</span>
                      ) : formatCurrency(order.deliveryCharges)}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-base font-semibold whitespace-nowrap" style={{ color: "var(--forest)", fontFamily: cormorant }}>
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Delivery status — inline editable */}
                    <td className="px-4 py-3">
                      <select
                        value={order.deliveryStatus}
                        disabled={updating === order._id + "deliveryStatus"}
                        onChange={(e) => updateOrder(order._id, "deliveryStatus", e.target.value)}
                        className="text-xs rounded-sm border px-2 py-1.5 outline-none"
                        style={{
                          borderColor: dsCfg.dot,
                          color: dsCfg.color,
                          backgroundColor: dsCfg.bg,
                          fontFamily: dmSans,
                          fontWeight: 600,
                          minWidth: "120px",
                        }}
                      >
                        {DELIVERY_STATUSES.map((s) => (
                          <option key={s} value={s}>{deliveryStatusConfig[s].label}</option>
                        ))}
                      </select>
                    </td>

                    {/* View button */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-xs font-medium px-3 py-1.5 rounded-sm border transition-colors hover:opacity-80"
                        style={{
                          borderColor: "var(--parchment)",
                          color: "var(--forest)",
                          fontFamily: dmSans,
                          backgroundColor: "var(--ivory)",
                        }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {selected && (() => {
        const osCfg = orderStatusConfig[selected.orderStatus] ?? orderStatusConfig.new;
        const psCfg = paymentStatusConfig[selected.paymentStatus] ?? paymentStatusConfig.pending;
        const dsCfg = deliveryStatusConfig[selected.deliveryStatus] ?? deliveryStatusConfig.pending;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm"
              style={{
                backgroundColor: "var(--cream-white)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                borderTop: `4px solid ${orderStatusBorderColor[selected.orderStatus] ?? "var(--gold)"}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: "1px solid var(--parchment)" }}>
                <div>
                  <h2 className="text-2xl font-light" style={{ fontFamily: cormorant, color: "var(--forest)" }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "#4b5563", fontFamily: dmSans }}>
                    {formatDateTime(selected.createdAt)}
                    {selected.orderId && <span className="ml-3" style={{ color: "#9ca3af" }}>#{selected.orderId}</span>}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xl leading-none mt-1 px-2"
                  style={{ color: "#9ca3af", fontFamily: dmSans }}
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-5 space-y-6">

                {/* Customer info */}
                <section>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#374151", fontFamily: dmSans }}>
                    Customer
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBox label="Name" value={selected.name} />
                    <InfoBox label="Phone" value={selected.phone} />
                    {selected.email && <InfoBox label="Email" value={selected.email} />}
                    <InfoBox label="Address" value={selected.address} wide />
                  </div>
                </section>

                {/* Order info */}
                <section style={{ borderTop: "1px solid var(--parchment)", paddingTop: "1.25rem" }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#374151", fontFamily: dmSans }}>
                    Order Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBox label="Product" value={selected.productType} />
                    <InfoBox label="Quantity" value={`${selected.quantity} Dozen`} />
                    <InfoBox label="Price / Dozen" value={formatCurrency(selected.pricePerDozen)} />
                    <InfoBox label="Subtotal" value={formatCurrency(selected.subtotal || selected.totalAmount)} />
                    <InfoBox label="Tax" value={formatCurrency(selected.tax)} />
                    <InfoBox label="Delivery Charge" value={formatCurrency(selected.deliveryCharges)} />
                    <InfoBox label="Distance" value={selected.distance > 0 ? `${selected.distance.toFixed(2)} km` : "—"} />
                    <InfoBox
                      label="Total Amount"
                      value={formatCurrency(selected.totalAmount)}
                      highlight
                    />
                  </div>
                  {selected.freeDelivery && (
                    <span className="mt-3 inline-flex text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#dcfce7", color: "#14532d", fontFamily: dmSans }}>
                      ✓ Free Delivery Applied
                    </span>
                  )}
                </section>

                {/* Payment info */}
                <section style={{ borderTop: "1px solid var(--parchment)", paddingTop: "1.25rem" }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#374151", fontFamily: dmSans }}>
                    Payment
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBox label="Method" value={selected.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"} />
                    {selected.paymentId && <InfoBox label="Payment ID" value={selected.paymentId} />}
                    {selected.razorpayPaymentLinkUrl && (
                      <div className="col-span-2 rounded-sm px-3 py-2.5" style={{ backgroundColor: "var(--ivory)" }}>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6b7280", fontFamily: dmSans, fontWeight: 500 }}>Razorpay Link</p>
                        <a
                          href={selected.razorpayPaymentLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline font-medium"
                          style={{ color: "var(--forest)", fontFamily: dmSans }}
                        >
                          ↗ Open Payment Link
                        </a>
                      </div>
                    )}
                  </div>
                </section>

                {/* Status controls */}
                <section style={{ borderTop: "1px solid var(--parchment)", paddingTop: "1.25rem" }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#374151", fontFamily: dmSans }}>
                    Update Status
                  </p>
                  <div className="flex flex-wrap gap-6">
                    {/* Order status */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#374151", fontFamily: dmSans }}>
                        Order Status
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusPill status={selected.orderStatus} config={osCfg} />
                      </div>
                      <select
                        value={selected.orderStatus}
                        disabled={updating === selected._id + "orderStatus"}
                        onChange={(e) => updateOrder(selected._id, "orderStatus", e.target.value)}
                        className="text-sm rounded-sm border px-3 py-2 outline-none"
                        style={{ borderColor: "#d1d5db", color: "#111827", fontFamily: dmSans, fontWeight: 500, backgroundColor: "var(--ivory)", minWidth: "160px" }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment status */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#374151", fontFamily: dmSans }}>
                        Payment Status
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusPill status={selected.paymentStatus} config={psCfg} />
                      </div>
                      <select
                        value={selected.paymentStatus}
                        disabled={updating === selected._id + "paymentStatus"}
                        onChange={(e) => updateOrder(selected._id, "paymentStatus", e.target.value)}
                        className="text-sm rounded-sm border px-3 py-2 outline-none"
                        style={{ borderColor: "#d1d5db", color: "#111827", fontFamily: dmSans, fontWeight: 500, backgroundColor: "var(--ivory)", minWidth: "160px" }}
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery status */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#374151", fontFamily: dmSans }}>
                        Delivery Status
                      </label>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusPill status={selected.deliveryStatus} config={dsCfg} />
                      </div>
                      <select
                        value={selected.deliveryStatus}
                        disabled={updating === selected._id + "deliveryStatus"}
                        onChange={(e) => updateOrder(selected._id, "deliveryStatus", e.target.value)}
                        className="text-sm rounded-sm border px-3 py-2 outline-none"
                        style={{ borderColor: "#d1d5db", color: "#111827", fontFamily: dmSans, fontWeight: 500, backgroundColor: "var(--ivory)", minWidth: "160px" }}
                      >
                        {DELIVERY_STATUSES.map((s) => (
                          <option key={s} value={s}>{deliveryStatusConfig[s].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function InfoBox({ label, value, wide, highlight }: { label: string; value: string; wide?: boolean; highlight?: boolean }) {
  const dmSans = "var(--font-dm-sans), 'DM Sans', sans-serif";
  return (
    <div
      className={`rounded-sm px-3 py-2.5 ${wide ? "col-span-2" : ""}`}
      style={{ backgroundColor: highlight ? "rgba(44,74,46,0.07)" : "var(--ivory)" }}
    >
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6b7280", fontFamily: dmSans, fontWeight: 500 }}>
        {label}
      </p>
      <p className="text-sm font-semibold leading-snug" style={{ color: highlight ? "var(--forest)" : "#111827", fontFamily: dmSans }}>
        {value}
      </p>
    </div>
  );
}
