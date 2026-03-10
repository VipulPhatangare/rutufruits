"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            {faqs.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-sm border shadow-sm transition-all duration-200"
                    style={{ borderColor: "rgba(200,146,42,0.15)" }}
                >
                    <button
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                        <h3
                            className="text-base font-semibold pr-4"
                            style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                        >
                            {item.question}
                        </h3>
                        <span
                            className="text-2xl font-light leading-none flex items-center justify-center w-6 h-6"
                            style={{ color: "var(--forest)" }}
                        >
                            {openIdx === idx ? "−" : "+"}
                        </span>
                    </button>

                    {openIdx === idx && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div
                                className="text-sm leading-relaxed whitespace-pre-line pt-2 border-t"
                                style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontWeight: 300, borderColor: "rgba(200,146,42,0.1)" }}
                            >
                                {item.answer}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
