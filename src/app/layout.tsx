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
    default: "Digital Coordinator | Onboarding Platform for International Workers",
    template: "%s | Digital Coordinator",
  },
  description:
    "Helping international workers relocate with confidence through a modern onboarding platform.",
  keywords: [
    "international workers",
    "worker onboarding",
    "employee relocation",
    "work visa support",
    "onboarding platform",
    "international relocation",
    "Digital Coordinator",
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
    title: "Digital Coordinator | Onboarding Platform for International Workers",
    description:
      "Helping international workers relocate with confidence through a modern onboarding platform.",
    url: SITE_URL,
    siteName: "Digital Coordinator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Coordinator | Onboarding Platform for International Workers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Coordinator | Onboarding Platform for International Workers",
    description:
      "Helping international workers relocate with confidence through a modern onboarding platform.",
    images: ["/og-image-v2.jpg"],
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
