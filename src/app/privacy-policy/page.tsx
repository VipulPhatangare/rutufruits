import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — RutuFruits",
  description:
    "Privacy Policy for RutuFruits — how we collect, use, and protect your personal information.",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918485844450";

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
            Effective Date: 1st March 2024
          </p>

          <div
            className="space-y-10 text-sm leading-relaxed"
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            <PolicySection title="1. Information We Collect">
              <p className="mb-3">
                To provide a seamless seasonal harvest experience, we may collect the following
                data:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Full Name</li>
                <li>Contact details, including email address and mobile number</li>
                <li>Delivery / Postal address for order fulfilment</li>
                <li>Social media profile information (where used for login or interaction)</li>
                <li>Insights from customer surveys, feedback forms, or promotional offers</li>
              </ul>
            </PolicySection>

            <PolicySection title="2. Purpose of Data Collection">
              <p className="mb-3">
                We gather this information to better understand your preferences and provide a
                superior service, specifically for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Order Management:</strong> Processing and delivering your fresh seasonal
                  produce.
                </li>
                <li>
                  <strong>Service Improvements:</strong> Enhancing our product range based on your
                  feedback.
                </li>
                <li>
                  <strong>Communication:</strong> Sending updates about new seasonal arrivals,
                  exclusive offers, or harvest news (only with your explicit consent).
                </li>
                <li>
                  <strong>Research:</strong> Occasionally contacting you for market research to
                  tailor our platform to your interests.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="3. Data Security">
              <p>
                We are committed to ensuring your information remains secure. To prevent
                unauthorized access or disclosure, we have implemented robust physical, electronic,
                and managerial safeguards to protect the information we collect online.
              </p>
            </PolicySection>

            <PolicySection title="4. Accuracy of Information">
              <p>
                While we strive for perfection, our site may occasionally contain typographical
                errors or inaccuracies regarding product availability, pricing, or shipping times.
                Friends of Farmers reserves the right to correct such errors and update information
                or cancel orders if any data is found to be inaccurate, without prior notice.
              </p>
            </PolicySection>

            <PolicySection title="5. Third-Party Links">
              <p>
                Our website may feature links or banners leading to other websites. Once you use
                these links to leave our platform, please note that we do not have control over
                external sites. We cannot be held responsible for the protection of any information
                you provide while visiting such sites, as they are not governed by this policy.
              </p>
            </PolicySection>

            <PolicySection title="6. Payment Processing">
              <p>
                Your financial security is paramount. Friends of Farmers does not store credit card,
                debit card, or net banking details. All monetary transactions are processed through
                Razorpay, a secure, industry-leading third-party payment gateway.
              </p>
            </PolicySection>

            <PolicySection title="7. Google Authentication">
              <p>
                If you choose to log in via Google, we access your profile information solely to
                simplify the account creation process. You can review or modify this information at
                any time within the &ldquo;My Account&rdquo; section of our website.
              </p>
            </PolicySection>

            <PolicySection title="8. Controlling Your Personal Data">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>No Third-Party Sales:</strong> We will never sell, lease, or distribute
                  your personal information to third parties unless we have your permission or are
                  legally required to do so.
                </li>
                <li>
                  <strong>Corrections:</strong> If you believe any information we hold about you is
                  incorrect, please contact us immediately. We will promptly rectify any
                  inaccuracies.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="9. Shipping, Returns &amp; Cancellation">
              <p className="mb-3">
                For our full shipping timelines, return conditions, cancellation rules, and refund
                process, please see our dedicated policy page:
              </p>
              <Link
                href="/shipping-returns"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-80"
                style={{
                  border: "1px solid var(--forest)",
                  color: "var(--forest)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                View Shipping &amp; Returns Policy →
              </Link>
            </PolicySection>

            <PolicySection title="10. Return Policy (Summary)">
              <p className="mb-3">
                We stand behind every dozen we ship. Our return policy is &ldquo;no questions
                asked.&rdquo;
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  If you receive damaged, bruised, overripe, underripe, or incorrect fruit, simply
                  share a photo via WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    {display}
                  </a>{" "}
                  within <strong>24 hours of delivery.</strong>
                </li>
                <li>
                  We will offer a <strong>full refund or free replacement</strong> — your choice —
                  within 24 hours of receiving your photo.
                </li>
                <li>
                  Refunds are credited to the original payment method (Razorpay) within{" "}
                  <strong>5–7 business days</strong> of approval. COD orders receive a bank
                  transfer or UPI refund within the same window.
                </li>
                <li>
                  For partial issues (e.g. 2 out of 12 mangoes damaged), we offer a proportional
                  refund or top-up in your next order.
                </li>
                <li>No paperwork, no return shipping required. One WhatsApp message is all it takes.</li>
              </ul>
              <p className="text-xs" style={{ color: "var(--warm-grey)" }}>
                Note: Claims raised after 24 hours of delivery may not be eligible for a refund as
                quality cannot be verified post that window.
              </p>
            </PolicySection>

            <PolicySection title="11. Cancellation Policy">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You may cancel your order at any time <strong>before dispatch</strong> by
                  messaging us on WhatsApp. A full refund will be processed immediately.
                </li>
                <li>
                  Once your order has been dispatched, cancellations are not accepted — however,
                  you may raise a return request under our Return Policy above upon delivery.
                </li>
                <li>
                  If we are unable to fulfil your order due to stock unavailability or delivery
                  constraints, we will notify you immediately and issue a full refund within{" "}
                  <strong>24 hours.</strong>
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="12. Shipping Policy">
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  RutuFruits currently delivers <strong>within Pune, Maharashtra</strong> only.
                </li>
                <li>
                  Delivery is available <strong>Monday to Sunday</strong> during the Alphonso
                  season (April – June).
                </li>
                <li>
                  We offer <strong>same-day or next-day delivery</strong> for orders placed before
                  12:00 PM. Orders placed after 12:00 PM are typically delivered the following day.
                </li>
                <li>
                  Exact delivery slots are confirmed personally on WhatsApp after your order is
                  accepted.
                </li>
                <li>
                  <strong>Free home delivery</strong> on orders of 2 dozen or more. A delivery
                  charge may apply for orders of 1 dozen depending on location.
                </li>
                <li>
                  All orders are packed fresh on the day of delivery. We do not dispatch from cold
                  storage or pre-pack orders in advance.
                </li>
              </ul>
              <p className="text-xs" style={{ color: "var(--warm-grey)" }}>
                Deliveries outside Pune are not currently supported. For bulk or outstation orders,
                contact us on WhatsApp to discuss options.
              </p>
            </PolicySection>

            <PolicySection title="13. Payment Security">
              <p>
                All payments are processed via Razorpay, a PCI DSS-compliant payment gateway. We
                do not store, process, or transmit any payment card data, UPI IDs, or banking
                details on our servers. Payment links are generated securely and expire after use.
              </p>
            </PolicySection>

            <PolicySection title="14. Contact Us">
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
                    href="mailto:support@rutufruits.in"
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    support@rutufruits.in
                  </a>
                  {" "}/{" "}
                  <a
                    href="mailto:farmfriendspune@gmail.com"
                    className="font-medium hover:underline"
                    style={{ color: "var(--forest)" }}
                  >
                    farmfriendspune@gmail.com
                  </a>
                </li>
                <li>Business address: Pune, Maharashtra, India</li>
              </ul>
            </PolicySection>

            <PolicySection title="15. Changes to This Policy">
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

      <Footer />
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
