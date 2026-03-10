"use client";

import { useState } from "react";

export default function AdminRazorpayPage() {
  const [form, setForm] = useState({
    amount: "",
    customerName: "",
    customerPhone: "",
    description: "",
  });
  const [result, setResult] = useState<{ id: string; short_url: string; amount: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(form.amount),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        description: form.description || "RutuFruits Alphonso Mango Order",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to generate payment link.");
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <div className="p-8">
      <h1
        className="text-3xl font-light mb-1"
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          color: "var(--forest)",
        }}
      >
        Generate Payment Link
      </h1>
      <p
        className="text-sm mb-8"
        style={{
          color: "var(--warm-grey)",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: 300,
        }}
      >
        Create a Razorpay payment link for a specific order. Share it with the customer on
        WhatsApp.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
        <form onSubmit={handleGenerate} className="space-y-4">
          {[
            { id: "amount", label: "Order Amount (₹)", type: "number", placeholder: "1360" },
            { id: "customerName", label: "Customer Name", type: "text", placeholder: "Priya Sharma" },
            {
              id: "customerPhone",
              label: "Customer Phone",
              type: "tel",
              placeholder: "9876543210",
            },
            {
              id: "description",
              label: "Order Description",
              type: "text",
              placeholder: "2 Dozen Ratnagiri Hapus",
            },
          ].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-xs uppercase tracking-wider mb-1.5"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.id === "amount"}
                value={form[field.id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                className="w-full py-3 px-4 text-sm border outline-none rounded-sm"
                style={{
                  borderColor: "var(--parchment)",
                  backgroundColor: "var(--cream-white)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              />
            </div>
          ))}

          {error && (
            <p
              className="text-sm"
              style={{ color: "#c0392b", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--ivory)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            {loading ? "Generating..." : "Generate Payment Link"}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div
            className="p-6 rounded-sm border h-fit"
            style={{ borderColor: "var(--gold)", backgroundColor: "var(--cream-white)" }}
          >
            <p
              className="text-xl font-light mb-4"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              Payment Link Generated 🎉
            </p>
            <div className="space-y-3">
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                >
                  Amount
                </p>
                <p
                  className="text-lg"
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    color: "var(--forest)",
                  }}
                >
                  ₹{(result.amount / 100).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                >
                  Payment Link
                </p>
                <a
                  href={result.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm break-all hover:underline"
                  style={{ color: "var(--forest)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                >
                  {result.short_url}
                </a>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(result.short_url)}
                className="w-full py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: "var(--parchment)",
                  color: "var(--forest)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
