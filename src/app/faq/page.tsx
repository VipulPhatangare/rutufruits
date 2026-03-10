import Link from "next/link";
import { Metadata } from "next";
import FAQAccordion from "../../components/FAQAccordion";

export const metadata: Metadata = {
    title: "Frequently Asked Questions — Friends of Farmers",
    description: "Get answers to common questions about RutuFruits, our seasonal philosophy, fruit ripening, and delivery.",
};

export default function FAQPage() {
    const faqs = [
        {
            category: "1. The \"Rutu\" (Seasonal) Philosophy",
            items: [
                {
                    question: "Why aren’t certain fruits available year-round?",
                    answer: "We strictly follow the natural harvest cycles of Maharashtra. We do not use cold storage or artificial life-extension techniques. If a fruit isn't in its \"Rutu\" (season), we don't sell it. This ensures you only eat what is at its peak nutritional value and flavor."
                },
                {
                    question: "My mangoes look smaller/different than the ones in the local market. Why?",
                    answer: "Commercial markets often prioritize aesthetics over taste, using wax or chemicals for uniform looks. Our fruits are \"Nature-First.\" Variations in size, slight skin marks, or unique shapes are signs of natural growth without hormonal interference."
                }
            ]
        },
        {
            category: "2. Ripening & Quality",
            items: [
                {
                    question: "Do you use Carbide or other chemicals for ripening?",
                    answer: "Absolutely not. We have a zero-tolerance policy for artificial ripening agents like Calcium Carbide. Our fruits are either tree-ripened or ripened using traditional, safe methods (like hay-packing) to ensure the natural development of sugars and aroma."
                },
                {
                    question: "How do I know when my fruit is ready to eat?",
                    answer: "For mangoes, we typically ship them \"semi-ripe\" to ensure they don't bruise during transit. We include instructions on how to finish the ripening process at home using natural ambient temperatures."
                },
                {
                    question: "What is \"Spongy Tissue\" in Alphonso mangoes?",
                    answer: "Spongy tissue is a non-pathological internal disorder specific to some Alphonso mangoes where the pulp stays white/acidic. Since it cannot be detected from the outside, we offer a generous compensation policy if more than 50% of your order is affected. (See our Shipping & Returns Policy for details)."
                }
            ]
        },
        {
            category: "3. Shipping & Delivery",
            items: [
                {
                    question: "How long will it take for my order to arrive?",
                    answer: "• Intra-Maharashtra: 1–3 business days.\n• Rest of India: 3–5 business days."
                }
            ]
        },
        {
            category: "4. Orders & Payments",
            items: [
                {
                    question: "Why was my order cancelled?",
                    answer: "Because we deal with live harvests, occasionally a sudden weather change (like unseasonal rain) can affect the quality of a batch. If we feel a harvest isn't up to our \"Friends of Farmers\" standard, we would rather cancel and refund your order than send you sub-par fruit."
                },
                {
                    question: "Do you offer Cash on Delivery (COD)?",
                    answer: "We offer COD in select pin codes. However, because fruits are highly perishable and cannot survive a \"Return to Origin\" trip, we humbly request you to only choose COD if you are certain you will be available to receive the package."
                }
            ]
        }
    ];

    const allFaqs = faqs.flatMap(section => section.items);

    return (
        <main className="min-h-screen pt-24 pb-20 px-6" style={{ backgroundColor: "var(--ivory)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1
                        className="text-4xl md:text-5xl font-light mb-4"
                        style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", color: "var(--forest)" }}
                    >
                        Frequently Asked Questions
                    </h1>
                    <p
                        className="text-sm tracking-widest uppercase"
                        style={{ color: "var(--gold)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 700 }}
                    >
                        Friends of Farmers
                    </p>
                </div>

                <FAQAccordion faqs={allFaqs} />

                <div className="mt-16 text-center p-8 rounded-sm" style={{ backgroundColor: "var(--parchment)" }}>
                    <h3
                        className="text-xl font-medium mb-4"
                        style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", color: "var(--forest)" }}
                    >
                        Still have questions?
                    </h3>
                    <p
                        className="text-sm mb-6 max-w-md mx-auto"
                        style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                        Our Support team is available from 10 AM to 7 PM, Monday to Saturday.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/918485844450"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
                            style={{ backgroundColor: "var(--forest)", color: "var(--ivory)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                        >
                            WhatsApp Us
                        </a>
                        <a
                            href="mailto:support@rutufruits.in"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:bg-black/5 active:scale-95 border"
                            style={{ borderColor: "var(--forest)", color: "var(--forest)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                        >
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
