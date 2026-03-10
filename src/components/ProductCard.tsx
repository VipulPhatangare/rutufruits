"use client";

import Link from "next/link";

interface ProductCardProps {
  type: string;
  slug: string;
  pricePerDozen: number;
  description: string;
  available: boolean;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
}

export default function ProductCard({
  type,
  slug,
  pricePerDozen,
  description,
  available,
  whatsappNumber,
  whatsappMessageTemplate,
}: ProductCardProps) {
  const isRatnagiri = type.toLowerCase().includes("ratnagiri");
  const region = isRatnagiri ? "Ratnagiri" : "Devgad";

  const message = whatsappMessageTemplate
    .replace(/\[Ratnagiri Hapus \/ Devgad Hapus\]/g, type)
    .replace(/\[Type\]/g, type);

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="flex flex-col rounded-sm overflow-hidden"
      style={{ backgroundColor: "var(--cream-white)" }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "240px",
          backgroundImage: `url('/${isRatnagiri ? "ratnagiri-hapus" : "devgad-hapus"}.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)" }}
        />
        <span
          className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-widest"
          style={
            available
              ? {
                  backgroundColor: "var(--mango)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }
              : {
                  backgroundColor: "var(--warm-grey)",
                  color: "#fff",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }
          }
        >
          {available ? "In Season" : "Out of Stock"}
        </span>
        <span
          className="absolute bottom-4 left-4 inline-block px-3 py-1 text-xs tracking-widest uppercase rounded-full"
          style={{
            border: "1px solid var(--gold)",
            color: "var(--gold-light)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          GI Tagged · {region}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="text-2xl font-light mb-1"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          {type}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          {description}
        </p>

        {/* Badges */}
        <div className="flex flex-col gap-2 mb-5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm self-start text-xs"
            style={{
              backgroundColor: "rgba(44,74,46,0.08)",
              color: "var(--forest)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Free Home Delivery on 2+ Dozen
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm self-start text-xs"
            style={{
              backgroundColor: "rgba(44,74,46,0.08)",
              color: "var(--forest)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            COD &amp; Online Payment Available
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-3xl font-medium"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              ₹{pricePerDozen}
            </span>
            <span
              className="text-sm"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              / Dozen
            </span>
          </div>
          <p
            className="text-xs mb-6"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Minimum order: 1 Dozen
          </p>

          {/* View Details */}
          <Link
            href={`/products/${slug}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-6 text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-80 rounded-sm mb-3"
            style={{
              border: "1px solid var(--forest)",
              color: "var(--forest)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </Link>

          {available ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95 rounded-sm"
              style={{
                backgroundColor: "var(--forest)",
                color: "var(--ivory)",
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
              className="w-full py-3 px-6 text-sm font-medium tracking-widest uppercase text-center rounded-sm cursor-not-allowed"
              style={{
                backgroundColor: "var(--parchment)",
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Currently Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

