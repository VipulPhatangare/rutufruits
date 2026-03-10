export default function ProvenanceSection() {
  return (
    <section
      id="story"
      className="py-20 px-6"
      style={{ backgroundColor: "var(--forest)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Story copy */}
        <div>
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            The Real Hapus
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--ivory)",
            }}
          >
            Real Hapus.
            <br />
            <em>Not cold-storage.</em>
            <br />
            Not Andhra.
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Most mangoes sold as &ldquo;Alphonso&rdquo; in city markets are sourced from Andhra Pradesh or put through ethylene chambers for forced ripening. We don&rsquo;t do either.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            RutuFruits sources exclusively from GI-tagged Ratnagiri and Devgad farms. Every dozen travels directly from the tree to your door — no cold chain, no chemical ripening, no intermediary warehouse.
          </p>
        </div>

        {/* Provenance card mockup */}
        <div
          className="rounded-sm p-8 border"
          style={{
            backgroundColor: "rgba(249,244,237,0.06)",
            borderColor: "rgba(200,146,42,0.3)",
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Sample Provenance Card
          </p>

          {[
            { label: "Picked", value: "14 March · Pawas, Ratnagiri" },
            { label: "Farmer", value: "Suresh Desai" },
            { label: "Region", value: "Ratnagiri District, Maharashtra" },
            { label: "GI Tag", value: "Ratnagiri Alphonso Mango" },
            { label: "Grade", value: "A — Hand Selected" },
            { label: "Cold Storage", value: "None" },
            { label: "Ripening Agent", value: "None" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-3 border-b last:border-0"
              style={{ borderColor: "rgba(200,146,42,0.15)" }}
            >
              <span
                className="text-xs"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {row.label}
              </span>
              <span
                className="text-sm text-right"
                style={{
                  color: "var(--ivory)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
