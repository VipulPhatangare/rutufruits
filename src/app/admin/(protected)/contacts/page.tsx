"use client";

import { useState, useEffect, useCallback } from "react";

interface Contact {
  _id: string;
  name: string;
  phone: string;
  message: string;
  status: "new" | "replied";
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "replied">("all");

  const fetchContacts = useCallback(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setContacts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function markReplied(id: string) {
    setMarking(id);
    const res = await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "replied" }),
    });
    if (res.ok) {
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "replied" } : c))
      );
    }
    setMarking(null);
  }

  const filtered = contacts.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const newCount = contacts.filter((c) => c.status === "new").length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            Contact Inquiries
          </h1>
          {newCount > 0 && (
            <p
              className="text-sm mt-0.5"
              style={{
                color: "var(--mango-deep)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              {newCount} new {newCount === 1 ? "inquiry" : "inquiries"}
            </p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["all", "new", "replied"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-all"
              style={{
                backgroundColor: filter === f ? "var(--forest)" : "var(--parchment)",
                color: filter === f ? "var(--ivory)" : "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          Loading inquiries...
        </p>
      ) : filtered.length === 0 ? (
        <div
          className="p-8 rounded-sm border text-center"
          style={{ borderColor: "var(--parchment)", backgroundColor: "var(--cream-white)" }}
        >
          <p
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            No {filter !== "all" ? filter : ""} inquiries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact) => (
            <div
              key={contact._id}
              className="p-5 rounded-sm border"
              style={{
                backgroundColor: "var(--cream-white)",
                borderColor: contact.status === "new" ? "var(--gold)" : "var(--parchment)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p
                    className="text-base font-medium"
                    style={{
                      fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                      color: "var(--forest)",
                    }}
                  >
                    {contact.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {contact.phone} · {formatDate(contact.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        contact.status === "new" ? "var(--mango)" : "var(--parchment)",
                      color: contact.status === "new" ? "var(--charcoal)" : "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {contact.status === "new" ? "New" : "Replied"}
                  </span>
                  {contact.status === "new" && (
                    <button
                      onClick={() => markReplied(contact._id)}
                      disabled={marking === contact._id}
                      className="text-xs px-3 py-1 rounded-sm transition-all hover:opacity-80 disabled:opacity-60"
                      style={{
                        backgroundColor: "var(--forest)",
                        color: "var(--ivory)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      }}
                    >
                      {marking === contact._id ? "..." : "Mark Replied"}
                    </button>
                  )}
                </div>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {contact.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
