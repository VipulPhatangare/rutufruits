import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Settings } from "@/lib/models/Settings";
import Footer from "@/components/Footer";

/* ── Static rich content keyed by slug pattern ────────────────────────── */
const MANGO_DETAILS: Record<
  string,
  {
    region: string;
    district: string;
    tagline: string;
    heroGradient: string;
    heroImage: string;
    origin: string;
    taste: string;
    characteristics: string[];
    harvestProcess: string;
    whyChoose: string[];
    season: string;
    giInfo: string;
    funFact: string;
  }
> = {
  ratnagiri: {
    region: "Ratnagiri",
    district: "Ratnagiri District, Konkan Coast",
    tagline: "The Original Alphonso — Born on the Konkan Shore",
    heroGradient: "linear-gradient(135deg, #2C4A2E 0%, #3D6641 60%, #4a7a4e 100%)",
    heroImage: "/ratnagiri-hapus.png",
    origin:
      "Ratnagiri Hapus, the undisputed king of mangoes, originates from the laterite-rich soils of Ratnagiri district on Maharashtra's Konkan coast. The unique combination of salty sea breeze, mineral-dense red clay, and the intense Konkan sun creates a fruit with unmatched depth of flavour. Orchards here have been cultivated for generations, with many trees more than 80 years old.",
    taste:
      "Rich, honey-sweet flesh with a saffron-yellow hue and an unmistakable floral aroma. The Ratnagiri Hapus has virtually no fibre — every bite is pure, smooth pulp that melts on the tongue. Its Brix (sugar) level typically ranges from 18–22°, with a perfect sugar-acid balance that sets it apart from every other variety.",
    characteristics: [
      "Deep golden-yellow skin with a characteristic red blush at the tip",
      "Oval to oblong shape, weighing 150–300 grams per fruit",
      "Extremely thin, inedible skin with no astringent taste",
      "Fibre-free, smooth pulp — ideal for eating fresh or as aamras",
      "Intoxicating saffron-like aroma detectable from several feet away",
      "Shelf life of 5–7 days at room temperature after ripening",
    ],
    harvestProcess:
      "Each mango is hand-harvested by experienced farmers in April–June when the natural stem detachment signals peak ripeness. Fruits are never plucked by hand or allowed to drop — they are caught in cloth bags at the moment of natural fall. They are then sorted, graded by size and colour, and packed with mango leaves to allow gradual natural ripening. No artificial ripening agents are used.",
    whyChoose: [
      "GI-Tagged: authenticity guaranteed by the Government of India",
      "Grade A selection — only the top 20% of harvest is offered",
      "Direct from Ratnagiri orchards to your home, no cold-chain storage",
      "Naturally ripened without carbide or ethylene gas",
      "Packed with mango leaves in the traditional method",
    ],
    season: "Mid-April to late June",
    giInfo:
      "Alphonso mangoes from Ratnagiri carry the Geographical Indication (GI) tag under GI Tag No. 15, issued by the Geographical Indications Registry, Chennai. This tag legally certifies that only mangoes grown in the designated Konkan region can be sold as 'Ratnagiri Hapus'. It is equivalent to Champagne in France or Darjeeling Tea in India.",
    funFact:
      "The variety is named after Afonso de Albuquerque, a Portuguese general who introduced grafting techniques in India in the 15th century. Over 500 years of cultivation on Konkan soil has evolved the fruit into the legendary Alphonso we know today.",
  },
  devgad: {
    region: "Devgad",
    district: "Sindhudurg District, Southern Konkan",
    tagline: "Sweeter. More Aromatic. Rarer.",
    heroGradient: "linear-gradient(135deg, #3D3010 0%, #7a5c10 60%, #C8922A 100%)",
    heroImage: "/devgad-hapus.png",
    origin:
      "Devgad Hapus comes from the Devgad taluka of Sindhudurg district, located in the southern stretch of the Konkan coast. The laterite plateau here is lower in elevation and receives slightly higher rainfall, creating an even sweeter, more aromatic fruit. Many connoisseurs regard Devgad Hapus as superior in taste to Ratnagiri — it is rarer, commands a premium, and is the preferred choice for gifting.",
    taste:
      "Intensely sweet with a higher sugar concentration (Brix up to 24°) than the Ratnagiri variety. The flesh is a vivid saffron-orange, creamier in texture, and the aroma is more concentrated and lingering. A hallmark trait is the Devgad Hapus's characteristic sweetness that stays in the palate long after eating.",
    characteristics: [
      "Compact, slightly smaller than Ratnagiri — more concentrated sweetness per gram",
      "Vivid saffron-orange skin, turning a richer yellow-orange on full ripening",
      "Rounder base and more symmetrical shape compared to Ratnagiri",
      "Higher sugar-to-acid ratio — noticeably sweeter on the palate",
      "Even more pronounced aromatic intensity — a signature of Devgad terroir",
      "Slightly shorter season, making it a rarer seasonal treasure",
    ],
    harvestProcess:
      "Like all authentic Alphonso, Devgad Hapus is harvested using the traditional fall-catch method — no fruit is plucked. Farmers monitor each mango individually and harvest at the precise moment of natural detachment. The smaller orchard size in Devgad means more attention per tree, resulting in more consistent quality. After grading, fruits are wrapped individually and packed in wooden crates with dried mango leaves.",
    whyChoose: [
      "GI-Tagged: certified origin from Sindhudurg's Devgad taluka",
      "Rarer than Ratnagiri — fewer orchards, smaller production, higher natural quality",
      "Preferred by connoisseurs for gifting and special occasions",
      "Grade A only — stringent size and colour grading at source",
      "Directly sourced, zero artificial ripening",
    ],
    season: "Late April to mid-June",
    giInfo:
      "Devgad Alphonso carries the GI Tag (GI Tag No. 16) registered separately from Ratnagiri Alphonso, recognising the distinct terroir of Sindhudurg's Devgad taluka. The GI certification covers the geographical boundaries, cultivation methods, ripening practices, and quality parameters specific to this region.",
    funFact:
      "The village of Devgad has been cultivating Alphonso mangoes since the 17th century. The Sindhudurg coast's unique combination of rocky laterite soil and higher humidity creates a micro-climate that concentrates the fruit's sugars in a way no other region can replicate.",
  },
};

function getMangoDetails(slug: string) {
  if (slug.includes("ratnagiri")) return MANGO_DETAILS["ratnagiri"];
  if (slug.includes("devgad")) return MANGO_DETAILS["devgad"];
  return null;
}

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const details = getMangoDetails(slug);

  let product: {
    type: string;
    slug: string;
    pricePerDozen: number;
    available: boolean;
    description: string;
  } | null = null;

  let whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
  let whatsappTemplate =
    "Hi RutuFruits! 🥭\nI'd like to order:\n• Type: [Ratnagiri Hapus / Devgad Hapus]\n• Quantity: ___ Dozen\n• Name: \n• Delivery Address: ";

  try {
    await connectToDatabase();
    const raw = await Product.findOne({ slug }).lean() as unknown as Record<string, unknown> | null;
    if (raw) {
      product = {
        type: raw.type as string,
        slug: raw.slug as string,
        pricePerDozen: raw.pricePerDozen as number,
        available: raw.available as boolean,
        description: raw.description as string,
      };
    }
    const rawSettings = await Settings.findOne().lean() as unknown as Record<string, unknown> | null;
    if (rawSettings) {
      whatsappNumber = rawSettings.whatsappNumber as string;
      whatsappTemplate = rawSettings.whatsappMessageTemplate as string;
    }
  } catch {
    /* silently fall through to notFound if no DB */
  }

  if (!product && !details) notFound();

  const type = product?.type ?? (details?.region ? `${details.region} Hapus` : slug);
  const pricePerDozen = product?.pricePerDozen ?? 0;
  const available = product?.available ?? true;

  const message = whatsappTemplate
    .replace(/\[Ratnagiri Hapus \/ Devgad Hapus\]/g, type)
    .replace(/\[Type\]/g, type);
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const info = details ?? {
    region: type,
    district: "Konkan, Maharashtra",
    tagline: "Premium Alphonso Mangoes",
    heroGradient: "linear-gradient(135deg, #2C4A2E 0%, #3D6641 100%)",
    heroImage: "",
    origin: product?.description ?? "",
    taste: "",
    characteristics: [] as string[],
    harvestProcess: "",
    whyChoose: [] as string[],
    season: "April – June",
    giInfo: "",
    funFact: "",
  };

  return (
    <>
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor: "var(--ivory)",
          borderColor: "var(--parchment)",
        }}
      >
        <Link
          href="/#products"
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{
            color: "var(--forest)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
        <Link href="/" className="text-lg font-light tracking-wider">
          <span style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
            Rutu
          </span>
          <span style={{ color: "var(--gold)", fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
            Fruits
          </span>
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{
          background: info.heroGradient,
          ...(info.heroImage
            ? {
              backgroundImage: `url('${info.heroImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
              backgroundRepeat: "no-repeat",
            }
            : {}),
        }}
      >
        {info.heroImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(20,35,22,0.85) 0%, rgba(20,35,22,0.75) 40%, rgba(20,35,22,0.90) 100%)"
            }}
          />
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{
              color: "var(--gold-light)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            GI Tagged · {info.district}
          </p>
          <div className="text-7xl mb-6 drop-shadow-xl">🥭</div>
          <h1
            className="text-4xl md:text-6xl font-light mb-4"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--ivory)",
            }}
          >
            {type}
          </h1>
          <p
            className="text-base md:text-lg font-light mb-8"
            style={{
              color: "var(--gold-light)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            {info.tagline}
          </p>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {pricePerDozen > 0 && (
              <div
                className="px-6 py-3 rounded-sm text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.10)",
                  border: "1px solid var(--gold)",
                }}
              >
                <span
                  className="text-3xl font-medium"
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    color: "var(--ivory)",
                  }}
                >
                  ₹{pricePerDozen}
                </span>
                <span
                  className="text-sm ml-1"
                  style={{
                    color: "var(--gold-light)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  / Dozen
                </span>
              </div>
            )}
            {available ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95 rounded-sm"
                style={{
                  backgroundColor: "var(--mango)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </a>
            ) : (
              <div
                className="px-8 py-3 text-sm font-medium tracking-widest uppercase text-center rounded-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "var(--gold-light)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                Currently Out of Season
              </div>
            )}
          </div>

          {/* Season badge */}
          <p
            className="mt-6 text-xs tracking-widest uppercase"
            style={{
              color: "var(--gold-light)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              opacity: 0.8,
            }}
          >
            Season · {info.season}
          </p>
        </div>
      </section>

      {/* ── Detail content ───────────────────────────────────────── */}
      <main style={{ backgroundColor: "var(--ivory)" }}>
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* Origin & Region */}
          {info.origin && (
            <Section number="01" title="Origin & Region">
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "#000",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.85,
                }}
              >
                {info.origin}
              </p>
            </Section>
          )}

          {/* Taste Profile */}
          {info.taste && (
            <Section number="02" title="Taste Profile">
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "#000",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.85,
                }}
              >
                {info.taste}
              </p>
            </Section>
          )}

          {/* Characteristics */}
          {info.characteristics.length > 0 && (
            <Section number="03" title="Identifying Characteristics">
              <ul className="space-y-3">
                {info.characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(44,74,46,0.10)" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="var(--forest)" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span
                      className="text-base"
                      style={{
                        color: "#000",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 400,
                        lineHeight: 1.7,
                      }}
                    >
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Harvest Process */}
          {info.harvestProcess && (
            <Section number="04" title="Harvesting & Quality Control">
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "#000",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.85,
                }}
              >
                {info.harvestProcess}
              </p>
            </Section>
          )}

          {/* Why Choose */}
          {info.whyChoose.length > 0 && (
            <Section number="05" title={`Why Choose ${info.region} Hapus`}>
              <ul className="space-y-3">
                {info.whyChoose.map((w, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(200,146,42,0.12)" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="var(--gold)" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span
                      className="text-base"
                      style={{
                        color: "#000",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 400,
                        lineHeight: 1.7,
                      }}
                    >
                      {w}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* GI Tag */}
          {info.giInfo && (
            <div
              className="rounded-sm p-6 border-l-4"
              style={{
                backgroundColor: "var(--parchment)",
                borderLeftColor: "var(--gold)",
              }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-3"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                GI Tag Certification
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#000",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.8,
                }}
              >
                {info.giInfo}
              </p>
            </div>
          )}

          {/* Fun Fact */}
          {info.funFact && (
            <div
              className="rounded-sm p-6"
              style={{ backgroundColor: "rgba(44,74,46,0.05)", border: "1px solid rgba(44,74,46,0.12)" }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-3"
                style={{
                  color: "var(--forest)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Did You Know?
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#000",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.8,
                }}
              >
                {info.funFact}
              </p>
            </div>
          )}

          {/* Delivery & Payment info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🚚", title: "Free Home Delivery", sub: "On orders of 2+ Dozen" },
              { icon: "💳", title: "COD & Online Payment", sub: "Pay cash or via Razorpay" },
              { icon: "🌿", title: "Naturally Ripened", sub: "Zero artificial agents" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-sm"
                style={{ backgroundColor: "var(--cream-white)" }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: "var(--forest)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--warm-grey)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center py-8">
            <p
              className="text-sm mb-6"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              Ready to order? Tap the button and we&apos;ll take care of the rest.
            </p>
            {available ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95 rounded-sm"
                style={{
                  backgroundColor: "var(--forest)",
                  color: "var(--ivory)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order {type} via WhatsApp
              </a>
            ) : (
              <p
                className="text-sm italic"
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                This variety is currently out of season. Check back in April.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ── Reusable numbered section heading ──────────────────────────────── */
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="text-xs font-bold tracking-widest"
          style={{
            color: "var(--gold)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {number}
        </span>
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          {title}
        </h2>
      </div>
      <div
        className="w-16 h-px mb-6"
        style={{ backgroundColor: "var(--gold)", opacity: 0.4 }}
      />
      {children}
    </div>
  );
}
