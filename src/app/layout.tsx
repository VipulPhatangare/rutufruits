import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Providers from "./Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RutuFruits — Premium Alphonso Mangoes, Pune",
  description:
    "Direct-from-orchard Alphonso Mangoes from Ratnagiri & Devgad. Order on WhatsApp. No middlemen. Grade A only.",
  keywords: ["Alphonso mango", "Hapus", "Ratnagiri", "Devgad", "Pune", "RutuFruits"],
  openGraph: {
    title: "RutuFruits — Premium Alphonso Mangoes",
    description: "Seasonal Tastes · Pune, Maharashtra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
