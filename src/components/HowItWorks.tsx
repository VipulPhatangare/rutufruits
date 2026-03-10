const steps = [
  {
    number: "01",
    title: "Choose Your Variety",
    body: "Browse Ratnagiri Hapus and Devgad Hapus below. Both are GI-tagged, direct-farm sourced. Scroll down to see today's prices.",
  },
  {
    number: "02",
    title: "Tap Order on WhatsApp",
    body: "A pre-filled message opens in WhatsApp. Add your quantity and delivery address. We confirm availability and delivery date.",
  },
  {
    number: "03",
    title: "Pay & Receive Fresh",
    body: "Choose Cash on Delivery or pay online via Razorpay — whichever suits you. Your order is packed and delivered fresh to your door in Pune.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6" style={{ backgroundColor: "var(--parchment)" }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-light text-center mb-3"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          How It Works
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
          THREE STEPS FROM ORCHARD TO DOOR
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-6 left-full w-full h-px -translate-y-0 z-0"
                  style={{ backgroundColor: "var(--gold)", opacity: 0.3, width: "calc(100% - 3rem)" }}
                />
              )}
              <span
                className="text-5xl font-light mb-4 relative z-10"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--gold)",
                }}
              >
                {step.number}
              </span>
              <h3
                className="text-xl font-medium mb-2"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
