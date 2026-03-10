import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — RutuFruits",
  description:
    "Privacy Policy, Return Policy, Cancellation Policy, and Shipping Policy for RutuFruits.",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";

export default function PrivacyPolicyPage() {
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

      <main
        className="min-h-screen py-16 px-6"
        style={{ backgroundColor: "var(--ivory)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-light mb-3"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="text-sm mb-12"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Last updated: March 2025
          </p>

          <div
            className="space-y-10 text-sm leading-relaxed"
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            <PolicySection title="1. Introduction">
              <p>
                RutuFruits (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a
                premium Alphonso mango brand based in Pune, Maharashtra. We are committed to
                protecting your personal information. This Privacy Policy explains how we collect,
                use, and safeguard the minimal data we gather when you interact with our website at{" "}
                <span style={{ color: "var(--forest)" }}>rutufruits.in</span> or purchase from us
                via WhatsApp.
              </p>
            </PolicySection>

            <PolicySection title="2. Information We Collect">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Order information:</strong> Your name, phone number, and delivery address,
                  shared voluntarily by you via WhatsApp when placing an order.
                </li>
                <li>
                  <strong>Payment information:</strong> All payments are processed securely by
                  Razorpay. We do not receive or store your card details, UPI credentials, or
                  banking information.
                </li>
                <li>
                  <strong>Contact form data:</strong> Name, phone number, and message submitted via
                  our /contact page.
                </li>
                <li>
                  <strong>Device &amp; analytics data:</strong> Standard browser and device
                  information collected via cookies for analytics purposes only. No personally
                  identifiable data is collected through analytics.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="3. How We Use Your Information">
              <ul className="list-disc pl-5 space-y-2">
                <li>To process, confirm, and deliver your order.</li>
                <li>To send order updates and delivery notifications via WhatsApp.</li>
                <li>To process returns, refunds, and resolve complaints.</li>
                <li>To respond to your inquiries submitted via our contact form.</li>
                <li>To improve our website and services using aggregated, anonymised analytics.</li>
              </ul>
            </PolicySection>

            <PolicySection title="4. Data Sharing">
              <p>
                We do not sell, rent, or share your personal data with third parties for marketing
                purposes. Data is shared only with:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Razorpay:</strong> Our payment processor. Subject to{" "}
                  <span style={{ color: "var(--forest)" }}>Razorpay&apos;s Privacy Policy</span>.
                </li>
                <li>
                  <strong>Delivery partners:</strong> Only your name, phone number, and delivery
                  address are shared as required to complete delivery.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Return Policy">
              <p className="mb-2">
                We stand behind every dozen we ship. Our return policy is &ldquo;no questions
                asked.&rdquo;
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  If you receive damaged, bruised, or incorrect fruit, share a photo on WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    {display}
                  </a>
                </li>
                <li>
                  We will process a full refund or replacement within{" "}
                  <strong>24 hours of photo receipt.</strong>
                </li>
                <li>
                  Refunds are credited to the original payment method within{" "}
                  <strong>5–7 business days</strong> of approval.
                </li>
                <li>No paperwork, no lengthy forms. One WhatsApp message is all it takes.</li>
              </ul>
            </PolicySection>

            <PolicySection title="6. Cancellation Policy">
              <p>
                You may cancel your order at any time before dispatch by messaging us on WhatsApp.
                Once your order has been dispatched, cancellations are not possible — however, you
                may return the shipment under our Return Policy above.
              </p>
            </PolicySection>

            <PolicySection title="7. Shipping Policy">
              <p>
                RutuFruits currently delivers within Pune, Maharashtra. Delivery timelines are
                communicated personally on WhatsApp after your order is confirmed. We prioritise
                same-day or next-day delivery during peak season to ensure peak freshness.
              </p>
            </PolicySection>

            <PolicySection title="8. Payment Security">
              <p>
                All payments are processed via Razorpay, a PCI DSS-compliant payment gateway. We
                do not store, process, or transmit any payment card data, UPI IDs, or banking
                details on our servers. Payment links are generated securely and expire after use.
              </p>
            </PolicySection>

            <PolicySection title="9. Contact for Privacy Concerns">
              <p>
                For any privacy-related questions or requests, please reach out:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  WhatsApp:{" "}
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
                    href="mailto:hello@rutufruits.in"
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    hello@rutufruits.in
                  </a>
                </li>
                <li>Business address: Pune, Maharashtra, India</li>
              </ul>
            </PolicySection>

            <PolicySection title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or applicable law. The date of the most recent revision appears at the top.
                Continued use of our website or services after any changes constitutes your
                acceptance of the revised policy.
              </p>
            </PolicySection>
          </div>
        </div>
      </main>

      <Footer whatsappNumber={whatsappNumber} />
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-xl font-medium mb-3"
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
