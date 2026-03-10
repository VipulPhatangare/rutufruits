"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  _id: string;
  type: string;
  pricePerDozen: number;
  available: boolean;
  description: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = useCallback(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleSave(product: Product) {
    setSaving(product._id);
    setMessage("");
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      setMessage("Saved successfully.");
    } else {
      setMessage("Error saving product.");
    }
    setSaving(null);
  }

  async function handleSeed() {
    setSeeding(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    const data = await res.json();
    if (data.seeded) {
      setMessage("Products seeded! Refreshing...");
      fetchProducts();
    } else {
      setMessage(data.message || "Seeding skipped.");
    }
    setSeeding(false);
  }

  function updateProduct(id: string, field: keyof Product, value: string | number | boolean) {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-light"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            Products
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Changes reflect live on the landing page immediately.
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-80 disabled:opacity-60"
          style={{
            backgroundColor: "var(--parchment)",
            color: "var(--forest)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {seeding ? "Seeding..." : "Seed Initial Products"}
        </button>
      </div>

      {message && (
        <p
          className="text-sm mb-4 px-3 py-2 rounded-sm"
          style={{
            backgroundColor: "var(--parchment)",
            color: "var(--forest)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p
          className="text-sm"
          style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
        >
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <div
          className="p-8 rounded-sm border text-center"
          style={{ borderColor: "var(--parchment)", backgroundColor: "var(--cream-white)" }}
        >
          <p
            className="text-lg mb-3"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            No products found
          </p>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Click &ldquo;Seed Initial Products&rdquo; above to add the default Ratnagiri &amp; Devgad Hapus products.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-6 rounded-sm border"
              style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Type */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                  >
                    Type Name
                  </label>
                  <input
                    type="text"
                    value={product.type}
                    onChange={(e) => updateProduct(product._id, "type", e.target.value)}
                    className="w-full py-2 px-3 text-sm border outline-none rounded-sm"
                    style={{
                      borderColor: "var(--parchment)",
                      backgroundColor: "var(--ivory)",
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Price */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                  >
                    Price per Dozen (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={product.pricePerDozen}
                    onChange={(e) =>
                      updateProduct(product._id, "pricePerDozen", Number(e.target.value))
                    }
                    className="w-full py-2 px-3 text-sm border outline-none rounded-sm"
                    style={{
                      borderColor: "var(--parchment)",
                      backgroundColor: "var(--ivory)",
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  className="block text-xs uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={product.description}
                  onChange={(e) => updateProduct(product._id, "description", e.target.value)}
                  className="w-full py-2 px-3 text-sm border outline-none rounded-sm resize-none"
                  style={{
                    borderColor: "var(--parchment)",
                    backgroundColor: "var(--ivory)",
                    color: "var(--charcoal)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                />
              </div>

              {/* Availability + save */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.available}
                    onChange={(e) => updateProduct(product._id, "available", e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--forest)" }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: product.available ? "var(--forest)" : "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {product.available ? "Available (shown on site)" : "Unavailable (hidden)"}
                  </span>
                </label>

                <button
                  onClick={() => handleSave(product)}
                  disabled={saving === product._id}
                  className="px-5 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--forest)",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {saving === product._id ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
