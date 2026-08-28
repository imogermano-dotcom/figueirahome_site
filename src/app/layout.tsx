import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { ChatWidget } from "@/components/chat-widget";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://figueirahome.pt"),
  title: {
    default: "Figueira Home - Imobiliária na Figueira da Foz",
    template: "%s | Figueira Home"
  },
  description: "Imobiliária licenciada AMI 7968 em Figueira da Foz. Compra, venda, arrendamento e avaliação gratuita com equipa local desde 2009.",
  openGraph: {
    title: "Figueira Home - Imobiliária na Figueira da Foz",
    description: "Compre, venda ou arrende o seu imóvel com uma equipa local especializada.",
    locale: "pt_PT",
    type: "website",
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Figueira Home",
    url: "https://figueirahome.pt",
    telephone: "+351233408130",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. do Brasil, 48",
      addressLocality: "Buarcos",
      postalCode: "3080-323",
      addressCountry: "PT"
    },
    openingHours: "Mo-Fr 09:00-18:00"
  };

  return (
    <html lang="pt-PT" className={`${dmSans.variable} ${displaySerif.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <ChatWidget />
        <CookieConsentBanner />
        <AnalyticsScripts />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}
