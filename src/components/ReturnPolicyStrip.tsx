interface ReturnPolicyStripProps {
  whatsappNumber: string;
}

export default function ReturnPolicyStrip({ whatsappNumber }: ReturnPolicyStripProps) {
  const displayNumber = whatsappNumber.startsWith("91")
    ? `+${whatsappNumber}`
    : `+91${whatsappNumber}`;

  return (
    <section
      id="returns"
      className="py-16 px-6"
      style={{ backgroundColor: "var(--parchment)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Icon */}
        <div className="flex-shrink-0 text-5xl">📦</div>

        {/* Content */}
        <div className="text-center md:text-left">
          <h3
            className="text-2xl md:text-3xl font-light mb-2"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            No Questions Asked Returns
          </h3>
          <p
            className="text-sm leading-relaxed mb-3"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Received damaged fruit? A bruised dozen? Just share a photo on WhatsApp. We refund or replace within 24 hours — no paperwork, no long forms.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{
              color: "var(--forest)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            WhatsApp us: {displayNumber} →
          </a>
        </div>

        {/* Guarantee badge */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 text-center"
          style={{ borderColor: "var(--gold)" }}
        >
          <p
            className="text-xs font-medium leading-tight"
            style={{
              color: "var(--forest)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            FULL
            <br />
            REFUND
            <br />
            GUARANTEE
          </p>
        </div>
      </div>
    </section>
  );
}
