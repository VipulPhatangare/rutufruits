"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--forest)" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-sm"
        style={{ backgroundColor: "var(--ivory)" }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-light mb-1"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            <span style={{ color: "var(--forest)" }}>Rutu</span>
            <span style={{ color: "var(--gold)" }}>Fruits</span>
          </h1>
          <p
            className="text-xs tracking-widest uppercase"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider mb-2"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 text-sm border outline-none rounded-sm"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--cream-white)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider mb-2"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 text-sm border outline-none rounded-sm"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--cream-white)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
          </div>

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
            className="w-full py-3 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-60 rounded-sm mt-2"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--ivory)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
