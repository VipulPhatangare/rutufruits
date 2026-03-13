"use client";

import { useEffect, useState } from "react";

export default function LocationSharePage() {
  const [message, setMessage] = useState("Sharing your location...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get("phone");

    if (!phone) {
      setMessage("❌ Phone number is missing in the URL.");
      return;
    }

    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported on this device/browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone,
              latitude: lat,
              longitude: lng,
            }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => ({}))) as { error?: string };
            setMessage(`❌ ${payload.error || "Failed to share location."}`);
            return;
          }

          setMessage("✅ Location shared successfully!");
        } catch {
          setMessage("❌ Failed to share location. Please try again.");
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setMessage("❌ Location permission denied. Please allow location access and retry.");
          return;
        }
        setMessage("❌ Unable to fetch location. Please retry.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--ivory)" }}
    >
      <section
        className="max-w-lg w-full rounded-sm border p-8 text-center"
        style={{
          backgroundColor: "var(--cream-white)",
          borderColor: "var(--parchment)",
        }}
      >
        <h1
          className="text-2xl font-light mb-3"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          Share Location
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--charcoal)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {message}
        </p>
      </section>
    </main>
  );
}
