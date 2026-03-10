"use client";

import { useState, useEffect, useCallback } from "react";

interface Settings {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "",
    whatsappMessageTemplate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = useCallback(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setMessage("Settings saved successfully.");
    } else {
      setMessage("Error saving settings.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        <p style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
          Loading settings...
        </p>
      </div>
    );
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
        WhatsApp Settings
      </h1>
      <p
        className="text-sm mb-8"
        style={{
          color: "var(--warm-grey)",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: 300,
        }}
      >
        These settings control all WhatsApp buttons and pre-filled order messages sitewide.
      </p>

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

      <form
        onSubmit={handleSave}
        className="max-w-2xl space-y-6"
      >
        <div>
          <label
            htmlFor="waNumber"
            className="block text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          >
            WhatsApp Business Number
          </label>
          <p
            className="text-xs mb-2"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Format: 91XXXXXXXXXX (country code without +)
          </p>
          <input
            id="waNumber"
            type="text"
            required
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            placeholder="91XXXXXXXXXX"
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
            htmlFor="waTemplate"
            className="block text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          >
            Pre-filled Order Message Template
          </label>
          <p
            className="text-xs mb-2"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Use [Ratnagiri Hapus / Devgad Hapus] as a placeholder — it gets replaced with the
            selected product type when customer taps a product card.
          </p>
          <textarea
            id="waTemplate"
            rows={8}
            value={settings.whatsappMessageTemplate}
            onChange={(e) => setSettings({ ...settings, whatsappMessageTemplate: e.target.value })}
            className="w-full py-3 px-4 text-sm border outline-none rounded-sm resize-none"
            style={{
              borderColor: "var(--parchment)",
              backgroundColor: "var(--cream-white)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Preview */}
        <div
          className="p-4 rounded-sm border"
          style={{ borderColor: "var(--parchment)", backgroundColor: "var(--ivory)" }}
        >
          <p
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          >
            WhatsApp Link Preview
          </p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessageTemplate)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all hover:underline"
            style={{ color: "var(--forest)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          >
            {`https://wa.me/${settings.whatsappNumber}?text=...`}
          </a>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 text-sm font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
          style={{
            backgroundColor: "var(--forest)",
            color: "var(--ivory)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
