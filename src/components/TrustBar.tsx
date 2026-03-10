const pillars = [
  {
    title: "Direct from Orchard",
    body: "Ratnagiri & Devgad farms, no middlemen. We work directly with growers we've known for years.",
  },
  {
    title: "Grade A Only",
    body: "If it doesn't meet our standard, we don't pack it. Every dozen hand-graded before dispatch.",
  },
  {
    title: "WhatsApp-First",
    body: "Order, track, and resolve everything in one chat. Response within 2 hours during season.",
  },
];

export default function TrustBar() {
  return (
    <section id="why" style={{ backgroundColor: "var(--cream-white)" }} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-light text-center mb-3"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          Why RutuFruits
        </h2>
        <p
          className="text-center text-sm mb-14"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.08em",
          }}
        >
          WHAT MAKES THE DIFFERENCE
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="p-6 border-l-2"
              style={{
                borderLeftColor: "var(--gold)",
                backgroundColor: "var(--ivory)",
              }}
            >
              <h3
                className="text-lg font-medium mb-2"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                {p.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
