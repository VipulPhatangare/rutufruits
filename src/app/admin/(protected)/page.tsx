import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Contact } from "@/lib/models/Contact";
import { Settings } from "@/lib/models/Settings";
import { Pincode } from "@/lib/models/Pincode";
import { DeliveryChargeRule } from "@/lib/models/DeliveryChargeRule";

async function getDashboardStats() {
  try {
    await connectToDatabase();
    const [productCount, newInquiries, settings, pincodeCount, deliveryRuleCount] = await Promise.all([
      Product.countDocuments(),
      Contact.countDocuments({ status: "new" }),
      Settings.findOne().lean(),
      Pincode.countDocuments({ enabled: true }),
      DeliveryChargeRule.countDocuments({ enabled: true }),
    ]);
    return {
      productCount,
      newInquiries,
      pincodeCount,
      deliveryRuleCount,
      whatsappNumber: (settings as { whatsappNumber?: string } | null)?.whatsappNumber || "Not configured",
    };
  } catch {
    return {
      productCount: 0,
      newInquiries: 0,
      pincodeCount: 0,
      deliveryRuleCount: 0,
      whatsappNumber: "DB not connected",
    };
  }
}

export default async function AdminDashboardPage() {
  const { productCount, newInquiries, pincodeCount, deliveryRuleCount, whatsappNumber } = await getDashboardStats();

  const stats = [
    { label: "Products Listed", value: productCount, href: "/admin/products" },
    { label: "New Inquiries", value: newInquiries, href: "/admin/contacts" },
    { label: "Active Pincodes", value: pincodeCount, href: "/admin/pincodes" },
    { label: "Delivery Rules", value: deliveryRuleCount, href: "/admin/delivery-charges" },
    {
      label: "WhatsApp Number",
      value: whatsappNumber.startsWith("91") ? `+${whatsappNumber}` : whatsappNumber,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="p-8">
      <h1
        className="text-3xl font-light mb-1"
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          color: "var(--forest)",
        }}
      >
        Dashboard
      </h1>
      <p
        className="text-sm mb-8"
        style={{
          color: "var(--warm-grey)",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: 300,
        }}
      >
        RutuFruits Admin — Manage your products, settings, and inquiries
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-sm border hover:border-current transition-colors"
            style={{
              backgroundColor: "var(--cream-white)",
              borderColor: "var(--parchment)",
            }}
          >
            <p
              className="text-2xl font-light mb-1"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              {stat.value}
            </p>
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2
        className="text-xl font-light mb-4"
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          color: "var(--forest)",
        }}
      >
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: "/admin/products", label: "Edit Products", icon: "🥭" },
          { href: "/admin/pincodes", label: "Manage Pincodes", icon: "📍" },
          { href: "/admin/delivery-charges", label: "Delivery Pricing", icon: "🚚" },
          { href: "/admin/settings", label: "WhatsApp Settings", icon: "💬" },
          { href: "/admin/contacts", label: "View Inquiries", icon: "📬" },
          { href: "/admin/orders", label: "Review Orders", icon: "📦" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-4 rounded-sm border text-sm transition-all hover:border-forest/40"
            style={{
              backgroundColor: "var(--ivory)",
              borderColor: "var(--parchment)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            <span className="text-xl">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
