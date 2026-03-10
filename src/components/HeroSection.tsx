import WhatsAppButton from "./WhatsAppButton";

interface HeroSectionProps {
  whatsappNumber: string;
  whatsappMessage: string;
}

export default function HeroSection({ whatsappNumber, whatsappMessage }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "var(--forest)",
        backgroundImage: "url('/hero-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark forest overlay — keeps text legible over the photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,35,22,0.85) 0%, rgba(20,35,22,0.75) 40%, rgba(20,35,22,0.90) 100%)",
        }}
      />

      {/* Radial gold gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,146,42,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo lockup */}
        <div className="mb-8">
          <h1
            className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none drop-shadow-2xl"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            <span style={{ color: "#e8e0d0" }}>Rutu</span>
            <span style={{ color: "#b8860b" }}>Fruits</span>
          </h1>
          <p
            className="mt-3 text-sm md:text-base tracking-[0.3em] uppercase font-bold"
            style={{ color: "#b8860b", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 800 }}
          >
            Seasonal Tastes · Pune, Maharashtra
          </p>
        </div>

        {/* Tagline */}
        <p
          className="text-xl md:text-2xl lg:text-3xl italic font-black mb-3 drop-shadow-xl"
          style={{
            color: "#e8e0d0",
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            opacity: 1,
          }}
        >
          Alphonso Mango Season
        </p>
        <p
          className="text-sm md:text-base mb-12 font-bold"
          style={{
            color: "#d4a017",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 800,
            letterSpacing: "0.05em",
          }}
        >
          Direct from Orchard to Your Door · Ratnagiri &amp; Devgad
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <WhatsAppButton
            number={whatsappNumber}
            message={whatsappMessage}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "var(--mango)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            } as React.CSSProperties}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </WhatsAppButton>

          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:bg-white/10 active:scale-95 border"
            style={{
              borderColor: "var(--ivory)",
              color: "var(--ivory)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            View Varieties
          </a>
        </div>

        {/* Seasonal badge */}
        <p
          className="mt-16 text-xs tracking-widest uppercase"
          style={{ color: "#d4a017", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 700 }}
        >
          ✦ Season: April – June · Limited Harvest ✦
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-xs tracking-widest uppercase font-bold"
          style={{ color: "#ffffff", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ backgroundColor: "var(--gold)" }}
        />
      </div>
    </section>
  );
}
