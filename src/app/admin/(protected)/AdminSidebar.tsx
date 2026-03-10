"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/products", label: "Products", icon: "🥭" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/settings", label: "WhatsApp", icon: "💬" },
  { href: "/admin/contacts", label: "Inquiries", icon: "📬" },
  { href: "/admin/razorpay", label: "Payment Links", icon: "💳" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 min-h-screen flex flex-col py-8 px-4 shrink-0"
      style={{ backgroundColor: "var(--forest)" }}
    >
      {/* Logo */}
      <div className="mb-10 px-2">
        <p
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
        >
          <span style={{ color: "var(--ivory)" }}>Rutu</span>
          <span style={{ color: "var(--gold)" }}>Fruits</span>
        </p>
        <p
          className="text-xs mt-0.5"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors"
              style={{
                backgroundColor: isActive ? "rgba(249,244,237,0.12)" : "transparent",
                color: isActive ? "var(--ivory)" : "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: isActive ? 400 : 300,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: links + sign-out */}
      <div className="mt-auto space-y-2 pt-8 border-t" style={{ borderColor: "rgba(138,127,114,0.2)" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs transition-colors hover:bg-white/5"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          ← View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-xs transition-colors hover:bg-white/5 text-left"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
