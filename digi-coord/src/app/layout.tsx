import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";
import { SearchModal } from "@/components/search/search-modal";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Coordinator — Suporta sa Manggagawang Pilipino",
  description:
    "Automated onboarding and worker support for Filipino workers in Czech Republic.",
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
    title: "Digital Coordinator — Suporta sa Manggagawang Pilipino",
    description:
      "Automated onboarding and worker support for Filipino workers in Czech Republic.",
    url: "https://digitalcoordinator.eu",
    siteName: "Digital Coordinator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Coordinator — Suporta sa Manggagawang Pilipino",
    description:
      "Automated onboarding and worker support for Filipino workers in Czech Republic.",
    images: ["/icons/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
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
        <style>{`body{background:#0f172a;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;padding:1rem}a{color:#60a5fa}.hidden{display:block!important}`}</style>
        <ThemeProvider>
          <SessionProvider>
            {children}
            <WhatsAppFloat />
            <SearchModal />
            <PwaProvider />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
