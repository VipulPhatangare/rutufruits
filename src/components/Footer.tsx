import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-12 px-6"
      style={{ backgroundColor: "var(--charcoal)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-10">
          {/* Logo */}
          <div>
            <p
              className="text-3xl font-light"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              }}
            >
              <span style={{ color: "var(--ivory)" }}>Rutu</span>
              <span style={{ color: "var(--gold)" }}>Fruits</span>
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Seasonal Tastes · Pune, Maharashtra
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-6">
            {[
              { label: "Home", href: "/" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Shipping & Returns", href: "/shipping-returns" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
              { label: "Contact", href: "/contact" },
              { label: "FAQ", href: "/faq" },
              { label: "Admin", href: "/admin" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors hover:opacity-70"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ backgroundColor: "rgba(138,127,114,0.2)" }}
        />

        {/* Bottom row */}
        <div className="flex justify-center items-center">
          <p
            className="text-xs"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            © 2025 RutuFruits · Seasonal Tastes · Pune, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
