import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions — RutuFruits",
  description:
    "Terms and Conditions governing your use of the RutuFruits website and purchase of seasonal produce.",
  other: { "last-updated": "1st March 2024" },
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918485844450";

export default function TermsAndConditionsPage() {
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
            Terms &amp; Conditions
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
            Last Updated: 1st March 2024
          </p>

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

          <div
            className="space-y-10 text-sm leading-relaxed"
            style={{
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            <Section title="1. Digital Store Eligibility">
              <p>
                By accepting these Terms of Service, you confirm that you have reached the age of
                majority in your place of residence. Our products and services may not be used for
                any unauthorized or illegal purposes, nor may you use our platform in a manner that
                violates local or international laws (including, but not limited to, intellectual
                property and copyright regulations).
              </p>
            </Section>

            <Section title="2. Information Integrity and Reliance">
              <p className="mb-3">
                While we strive for excellence, Friends of Farmers is not liable if the information
                provided on this platform is inaccurate, incomplete, or outdated. The content is
                intended for general information and should not be used as the sole basis for
                decision-making without consulting more direct and timely sources.
              </p>
              <p>
                Nature is unpredictable; therefore, historical harvest data or past seasonal windows
                provided on the site are for reference only. We reserve the right to modify site
                content at any time but are under no obligation to update old information. It is
                your responsibility to stay informed of any changes to our service.
              </p>
            </Section>

            <Section title="3. Service Modifications and Pricing">
              <p>
                The prices for our seasonal fruits are subject to change without prior notice, often
                dictated by harvest yields and market conditions. We reserve the right to modify or
                discontinue any part of our service at any time. We shall not be held liable to you
                or any third party for price adjustments, service suspensions, or the discontinuance
                of specific products.
              </p>
            </Section>

            <Section title="4. Seasonal Produce and Limitations">
              <p className="mb-3">
                Certain premium harvests may be available exclusively through our online store. Due
                to the nature of fresh agriculture:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Quantities:</strong> Many of our fruits are available in strictly limited
                  quantities and are subject to our specific Return &amp; Exchange Policy.
                </li>
                <li>
                  <strong>Visuals:</strong> We make every effort to display the colours and textures
                  of our fruit accurately. However, we cannot guarantee that your device&apos;s
                  display will perfectly represent the actual product.
                </li>
                <li>
                  <strong>Sales Restrictions:</strong> We reserve the right, but are not obligated,
                  to limit the sale of our products to specific individuals or geographic regions on
                  a case-by-case basis.
                </li>
                <li>
                  <strong>Specifications:</strong> Descriptions and pricing are subject to change
                  at our sole discretion. We do not warrant that the quality of any products or
                  information obtained will meet personal expectations, though we strive for the
                  highest harvest standards.
                </li>
              </ul>
            </Section>

            <Section title="5. Correction of Omissions and Errors">
              <p>
                Occasionally, our site may contain errors related to descriptions, pricing, shipping
                charges, or fruit availability. We reserve the right to correct these inaccuracies
                and to update or cancel orders if any information in the Service is found to be
                incorrect at any time — even after an order has been submitted. We are not obligated
                to update information except as required by law.
              </p>
            </Section>

            <Section title="6. Prohibited Conduct">
              <p className="mb-3">In using our Service, you are strictly prohibited from:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Engaging in any unlawful acts or soliciting others to perform illegal activities.</li>
                <li>Violating any regional, national, or international regulations.</li>
                <li>Infringing upon our intellectual property or the rights of others.</li>
                <li>
                  Harassing, abusing, or discriminating against individuals based on gender,
                  religion, ethnicity, race, age, or disability.
                </li>
                <li>Submitting false, misleading, or fraudulent information.</li>
                <li>
                  Uploading malicious code or viruses that could affect the functionality of our
                  Service or the internet.
                </li>
                <li>Collecting or tracking the personal data of other users.</li>
                <li>Engaging in spamming, phishing, or &ldquo;scraping&rdquo; our digital content.</li>
                <li>Interfering with or bypassing the security features of our platform.</li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--warm-grey)" }}>
                Failure to adhere to these prohibitions may result in the immediate termination of
                your access to our Services.
              </p>
            </Section>

            <Section title="7. Contact Information">
              <p className="mb-3">
                For clarifications regarding these Terms, please contact us at:
              </p>
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

function Section({
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
