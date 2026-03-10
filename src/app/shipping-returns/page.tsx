import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping, Returns & Cancellation Policy — RutuFruits",
  description:
    "Shipping timelines, return conditions, cancellation rules, and refund process for RutuFruits orders.",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918485844450";

export default function ShippingReturnsPage() {
  const display = whatsappNumber.startsWith("91")
    ? `+${whatsappNumber}`
    : `+91${whatsappNumber}`;

  return (
    <>
      {/* Nav */}
      <header
        className="px-6 py-4 border-b"
        style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-light"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            <span style={{ color: "var(--forest)" }}>Rutu</span>
            <span style={{ color: "var(--gold)" }}>Fruits</span>
          </Link>
          <Link
            href="/"
            className="text-sm"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="min-h-screen py-16 px-6" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-light mb-2"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            Shipping, Returns &amp; Cancellation
          </h1>
          <p
            className="text-xs tracking-widest uppercase mb-2"
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Friends of Farmers
          </p>
          <p
            className="text-sm mb-12"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Effective Date: 1st March 2024
          </p>

          <p
            className="text-sm leading-relaxed mb-12"
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            At Friends of Farmers, we treat every piece of fruit as a masterpiece of nature. To
            ensure your seasonal harvest arrives in pristine condition, we have established a
            rigorous logistics framework focused on speed, transparency, and uncompromised quality.
          </p>

          <div
            className="space-y-10 text-sm leading-relaxed"
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            {/* Section 1 */}
            <Section title="1. Shipping and Logistics">
              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Domestic Delivery (India)
              </h3>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong>Processing:</strong> Every order undergoes a thorough quality inspection
                  and is packed in premium, impact-resistant packaging within{" "}
                  <strong>1–3 business days.</strong>
                </li>
                <li>
                  <strong>Transit Time:</strong> We partner with India&apos;s leading logistics
                  providers to ensure your harvest reaches your doorstep within{" "}
                  <strong>1–5 business days</strong> from the date of order, depending on the
                  location of delivery.
                </li>
                <li>
                  <strong>Communication:</strong> You will receive real-time updates at every
                  milestone: Order Confirmation, Processing, Shipped, and Delivered.
                </li>
              </ul>
            </Section>

            {/* Section 2 */}
            <Section title="2. Cancellation Policy">
              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Perishable Items
              </h3>
              <p className="mb-3">
                Due to the highly sensitive nature of fresh produce:
              </p>
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>
                  <strong>Pre-Shipment:</strong> Cancellations are permitted only until the
                  product has been dispatched from our facility.
                </li>
                <li>
                  <strong>Post-Shipment:</strong> Once an order is in transit, we cannot accept
                  cancellations.
                </li>
                <li>
                  <strong>COD Integrity:</strong> We humbly request our Cash on Delivery (COD)
                  patrons to avoid rejecting orders upon arrival. Fruits like Mangoes are living
                  organisms; the stress of a &ldquo;Return to Origin&rdquo; journey often results
                  in spoilage, leading to significant food waste.
                </li>
              </ul>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Delivery Attempts
              </h3>
              <p className="mb-3">Specifically for our Mango harvests:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  If the first delivery attempt fails, we will immediately initiate a second
                  attempt via the same or an alternative courier.
                </li>
                <li>
                  If a second attempt also fails, we will issue a{" "}
                  <strong>full refund</strong> to the customer, as the fruit&apos;s peak freshness
                  window may have closed.
                </li>
              </ul>
            </Section>

            {/* Section 3 */}
            <Section title="3. Returns and Exchange Policy">
              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                General Policy
              </h3>
              <p className="mb-6">
                Our seasonal fruits are not eligible for return or exchange if they are delivered
                securely and in an intact condition.
              </p>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Damaged or Missing Items
              </h3>
              <p className="mb-3">
                We provide a Replacement or Refund under the following conditions:
              </p>
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>The product arrived damaged or items are missing from the box.</li>
                <li>A claim is filed within <strong>2 days of delivery.</strong></li>
                <li>
                  <strong>Evidence Required:</strong> You must provide clear images and unboxing
                  videos showing the shipping label on the box and the damaged contents.
                </li>
              </ul>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Specific Mango Quality Claims
              </h3>
              <p className="mb-3">
                Fresh fruit can vary internally. We offer compensation (via Coupon or Replacement)
                for &ldquo;Spongy Tissue&rdquo; or internal rot in Mangoes only if:
              </p>
              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>The affected volume exceeds <strong>50% of your total order.</strong></li>
                <li>
                  Photos and videos are submitted to{" "}
                  <a
                    href="mailto:support@rutufruits.in"
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    support@rutufruits.in
                  </a>{" "}
                  or our WhatsApp at{" "}
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    {display}
                  </a>{" "}
                  within <strong>7 days of delivery.</strong>
                </li>
              </ul>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Weight and Size Discrepancies
              </h3>
              <p className="mb-3">If you have concerns regarding the size or weight of your Mangoes:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  Please provide a short video weighing 7–8 fruits individually on a digital scale.
                </li>
                <li>
                  If a discrepancy is verified, the price difference will be credited to your
                  account.
                </li>
              </ul>
            </Section>

            {/* Section 4 */}
            <Section title="4. Payment and Refunds">
              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Secure Transactions
              </h3>
              <p className="mb-6">
                We utilize industry-leading, highly encrypted payment gateways, including Razorpay,
                to ensure your financial data is never stored and always protected.
              </p>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Refund Processing
              </h3>
              <p className="mb-6">
                Approved refunds are credited back to the original source account within{" "}
                <strong>5–7 business days.</strong>
              </p>

              <h3
                className="text-base font-medium mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  color: "var(--forest)",
                }}
              >
                Contact Our Harvest Support
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Phone / WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    {display}
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@rutufruits.in"
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    support@rutufruits.in
                  </a>
                </li>
              </ul>
            </Section>
          </div>
        </div>
      </main>

      <Footer whatsappNumber={whatsappNumber} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-xl font-medium mb-4"
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          color: "var(--forest)",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
