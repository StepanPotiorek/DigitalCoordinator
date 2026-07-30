import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";
import { SearchModal } from "@/components/search/search-modal";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { JsonLd } from "@/components/seo/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://digitalcoordinator.eu";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Digital Coordinator — AI-Powered Onboarding for Filipino Workers in Czech Republic",
    template: "%s | Digital Coordinator",
  },
  description:
    "AI-powered onboarding platform helping Filipino workers relocate, adapt, and thrive in the Czech Republic. Employee Card guidance, bank setup, healthcare, and daily support.",
  keywords: [
    "Filipino workers Czech Republic",
    "Employee Card Czech Republic",
    "Filipino onboarding",
    "work visa Czech Republic",
    "Filipino relocation",
    "Czech Republic worker support",
    "Philippines to Czech Republic",
    "Digital Coordinator",
    "OFW Czech Republic",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DigiCoord",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Digital Coordinator — AI-Powered Onboarding for Filipino Workers",
    description:
      "Helping Filipino workers relocate with confidence. Employee Card guidance, bank setup, healthcare, and daily life support in the Czech Republic.",
    url: SITE_URL,
    siteName: "Digital Coordinator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Coordinator — Helping Filipino workers relocate with confidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Coordinator — AI-Powered Onboarding for Filipino Workers",
    description:
      "Helping Filipino workers relocate with confidence. Employee Card guidance, bank setup, healthcare, and daily life support in the Czech Republic.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-surface text-fg">
        <ThemeProvider>
          <SessionProvider>
            {children}
            <WhatsAppFloat />
            <SearchModal />
            <PwaProvider />
          </SessionProvider>
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
