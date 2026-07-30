const SITE_URL = "https://digitalcoordinator.eu"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Digital Coordinator",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512x512.png`,
  description:
    "Modern onboarding platform helping international workers relocate with confidence.",
  foundingDate: "2024",
  areaServed: [
    {
      "@type": "Country",
      name: "Czech Republic",
    },
  ],
  offers: {
    "@type": "Service",
    name: "International Worker Onboarding & Coordination",
    description:
      "Employee Card guidance, bank account setup, health insurance registration, SIM card, accommodation support, and ongoing coordination for international workers in Czech Republic.",
    provider: {
      "@type": "Organization",
      name: "Digital Coordinator",
    },
    areaServed: {
      "@type": "Country",
      name: "CZ",
    },
  },
  sameAs: [],
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
