import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Settings } from "@/lib/models/Settings";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import ProvenanceSection from "@/components/ProvenanceSection";
import Footer from "@/components/Footer";

interface ProductData {
  _id: string;
  type: string;
  slug: string;
  pricePerDozen: number;
  available: boolean;
  description: string;
}

interface SettingsData {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
}

async function getPageData(): Promise<{
  products: ProductData[];
  settings: SettingsData;
}> {
  const fallbackSettings: SettingsData = {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX",
    whatsappMessageTemplate:
      "Hi RutuFruits! 🥭\nI'd like to order:\n• Type: [Ratnagiri Hapus / Devgad Hapus]\n• Quantity: ___ Dozen\n• Name: \n• Delivery Address: ",
  };

  try {
    await connectToDatabase();

    const [rawProducts, rawSettings] = await Promise.all([
      Product.find().lean(),
      Settings.findOne().lean(),
    ]);

    const products: ProductData[] = rawProducts.map((p) => ({
      _id: String((p as any)._id),
      type: p.type,
      slug: p.slug,
      pricePerDozen: p.pricePerDozen,
      available: p.available,
      description: p.description,
    }));

    const settings: SettingsData = rawSettings
      ? {
          whatsappNumber: (rawSettings as any).whatsappNumber,
          whatsappMessageTemplate: (rawSettings as any).whatsappMessageTemplate,
        }
      : fallbackSettings;

    return { products, settings };
  } catch {
    return { products: [], settings: fallbackSettings };
  }
}

export const revalidate = 60;

export default async function HomePage() {
  const { products, settings } = await getPageData();

  return (
    <main>
      {/* 1. Hero */}
      <HeroSection
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessageTemplate}
      />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Products */}
      <section id="products" className="py-20 px-6" style={{ backgroundColor: "var(--ivory)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-light text-center mb-3"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            The Alphonso
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
            TWO ORIGINS. ONE STANDARD.
          </p>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p
                style={{
                  color: "var(--warm-grey)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                Products loading... Please configure MongoDB and seed initial data from the admin
                dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  type={product.type}
                  slug={product.slug}
                  pricePerDozen={product.pricePerDozen}
                  description={product.description}
                  available={product.available}
                  whatsappNumber={settings.whatsappNumber}
                  whatsappMessageTemplate={settings.whatsappMessageTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Provenance / Story */}
      <ProvenanceSection />

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
