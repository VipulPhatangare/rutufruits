"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918485844450";

export default function ContactPage() {
  const displayNumber = whatsappNumber.startsWith("91")
    ? `+${whatsappNumber}`
    : `+91${whatsappNumber}`;

  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setForm({ name: "", phone: "", message: "" });
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      {/* Nav */}
      <header
        className="px-6 py-4 border-b"
        style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-light"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            <span style={{ color: "var(--forest)" }}>Rutu</span>
            <span style={{ color: "var(--gold)" }}>Fruits</span>
          </Link>
          <Link
            href="/"
            className="text-sm"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="min-h-screen py-16 px-6" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-light mb-3"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              Get in Touch
            </h1>
            <p
              className="text-sm mb-10"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              We respond fastest on WhatsApp — usually within 2 hours during season.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full py-4 px-6 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 mb-8"
              style={{
                backgroundColor: "var(--forest)",
                color: "var(--ivory)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>

            {/* Contact details */}
            <div className="space-y-4">
              {[
                { label: "Business", value: "RutuFruits" },
                { label: "WhatsApp", value: displayNumber },
                { label: "Email", value: "hello@rutufruits.in" },
                { label: "Location", value: "Pune, Maharashtra, India" },
                { label: "Hours", value: "Mon–Sat, 9am–7pm" },
              ].map((row) => (
                <div key={row.label} className="flex gap-4">
                  <span
                    className="text-xs w-20 shrink-0 pt-0.5 uppercase tracking-wider"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2
              className="text-2xl font-light mb-6"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              Send a Message
            </h2>

            {status === "success" ? (
              <div
                className="p-6 rounded-sm border text-center"
                style={{
                  borderColor: "var(--gold)",
                  backgroundColor: "var(--cream-white)",
                }}
              >
                <p
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    color: "var(--forest)",
                  }}
                >
                  Message received 🥭
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--warm-grey)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  We&apos;ll get back to you within 2 hours on WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "Priya Sharma" },
                  {
                    id: "phone",
                    label: "Phone Number",
                    type: "tel",
                    placeholder: "+91 98765 43210",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-xs uppercase tracking-wider mb-2"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={form[field.id as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                      className="w-full py-3 px-4 text-sm outline-none border transition-colors focus:border-current rounded-sm"
                      style={{
                        backgroundColor: "var(--cream-white)",
                        borderColor: "var(--parchment)",
                        color: "var(--charcoal)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-wider mb-2"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your question or message..."
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full py-3 px-4 text-sm outline-none border transition-colors focus:border-current rounded-sm resize-none"
                    style={{
                      backgroundColor: "var(--cream-white)",
                      borderColor: "var(--parchment)",
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {status === "error" && (
                  <p
                    className="text-sm"
                    style={{ color: "#c0392b", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 px-6 text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 disabled:opacity-60 rounded-sm"
                  style={{
                    backgroundColor: "var(--forest)",
                    color: "var(--ivory)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer whatsappNumber={whatsappNumber} />
    </>
  );
}
