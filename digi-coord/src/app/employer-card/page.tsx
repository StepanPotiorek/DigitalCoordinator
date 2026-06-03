import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox, StepCard } from "@/components/public/page-layout"
import { NearestLocation } from "@/components/location/nearest-location"
import { oampLocations, foreignPoliceLocations } from "@/lib/locations"

const steps = [
  {
    number: 1,
    title: "Find a Job and Get the Vacancy Number",
    body: "Your employer registers the position in the central vacancies database (Úřad práce). You need the vacancy reference number — this is required for the application.",
  },
  {
    number: 2,
    title: "Apply at Czech Embassy (Manila)",
    body: "Submit your Employee Card application at the Czech Embassy in Manila. Important: Official Philippine documents submitted for employee card or immigration processes may require an Apostille from the DFA Authentication Division. Always follow the instructions provided by your employer, agency, or legal provider regarding which documents must be apostilled. Required documents: valid passport (valid 90+ days beyond the card validity), signed employment contract (min. 15 hrs/week, min. wage), proof of accommodation, passport photo, and proof of education/qualification.",
    maps: [{ label: "Czech Embassy Manila", address: "30/F Rufino Pacific Tower, 6784 Ayala Avenue, Makati City, Metro Manila, Philippines" }],
  },
  {
    number: 3,
    title: "Processing — 60 to 90 Days",
    body: "The Ministry of Interior (OAMP) processes applications within 60 days (standard) or up to 90 days (complex cases). You can track the status online with your application number. Your coordinator will keep you updated.",
  },
  {
    number: 4,
    title: "Long-Term Visa (D/VR) Issued",
    body: "Once approved, the embassy issues a single-entry long-term visa (D/VR) valid for 60 days for the purpose of collecting your Employee Card in Czech Republic. You must enter CZ within this period.",
  },
  {
    number: 5,
    title: "Register Stay at Foreign Police (within 3 working days)",
    body: "After arrival, report to the local Foreign Police department (Cizinecká policie) within 3 working days for residence registration. Bring your passport with the D/VR visa and proof of accommodation.",
  },
  {
    number: 6,
    title: "Biometrics at OAMP",
    body: "Visit the OAMP office for your biometric appointment — fingerprints and photo for the biometric card. Bring your passport and employment contract. A biometric card fee may apply. Please follow the instructions provided by your employer, agency, or legal coordinator regarding payment.",
  },
  {
    number: 7,
    title: "Collect Your Employee Card",
    body: "The biometric Employee Card (Zaměstnanecká karta) is typically ready within 30 days. You will receive an invitation to collect it at the OAMP office in person. The card is valid for up to 2 years.",
  },
]

const obligations = [
  "Notify OAMP of any address change within 3 working days",
  "Employer must report your start of work to the Labour Office",
  "If you change employers or position, notify the Ministry of Interior",
  "The card must be collected in person at OAMP",
  "Always carry your passport or residence card with you",
  "Apply for renewal up to 120 days before the card expires",
  "If employment ends, you have 90 days to find a new job or apply for a different permit",
]

function MapLink({ address }: { address: string }) {
  return (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
    >
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Navigate
    </a>
  )
}

export default async function EmployerCardPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("employer.title", lang)}
          subtitle={t("employer.subtitle", lang)}
          badge="PRIORITY"
          badgeColor="red"
        />

        <InfoBox title="⚠ Important" color="red" className="mb-10">
          <p className="text-sm leading-relaxed text-slate-300">
            {t("employer.important", lang)}
          </p>
        </InfoBox>

        <h2 className="mb-6 text-xl font-semibold text-white">{t("employer.process", lang)}</h2>

        <div className="relative space-y-6 before:absolute before:left-6 before:top-0 before:h-full before:w-0.5 before:bg-red-800/50">
          {steps.map((step) => (
            <div key={step.number} className="relative pl-14">
              {step.number === 2 && (
                <div className="mb-6 rounded-xl border border-red-800 bg-red-950/50 p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">📄</span>
                    <div>
                      <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">Apostille Required</h4>
                      <p className="text-xs leading-relaxed text-red-300">
                        Important: Official Philippine documents submitted for employee card or
                        immigration processes may require an Apostille from the DFA Authentication
                        Division. Always follow the instructions provided by your employer, agency,
                        or legal provider regarding which documents must be apostilled.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-900/50 text-sm font-bold text-red-400 ring-4 ring-slate-950">
                {step.number}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
                <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.body}</p>
                {"maps" in step && step.maps && (
                  <div className="mt-3 space-y-2">
                    {step.maps.map((m: { label: string; address: string }) => (
                      <div key={m.label} className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">
                        <span className="text-xs text-slate-400">{m.label}:</span>
                        <span className="text-xs text-slate-300">{m.address}</span>
                        <MapLink address={m.address} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="mb-3 text-lg font-semibold text-white">{t("employer.oamp", lang)}</h2>
            <p className="mb-3 text-sm text-slate-400">{t("employer.oamp.desc", lang)}</p>
            <NearestLocation locations={oampLocations} label="OAMP office" />
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
                {t("employer.all", lang)}
              </summary>
              <ul className="mt-2 space-y-2 text-sm">
                {oampLocations.map((loc) => (
                  <li key={loc.city} className="flex items-start gap-2 text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-medium text-white">{loc.city}</span>
                      <span className="text-slate-400">{loc.address}</span>
                      <MapLink address={`${loc.address}, Czech Republic`} />
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="mb-3 text-lg font-semibold text-white">{t("employer.obligations", lang)}</h2>
            <ul className="space-y-2 text-sm">
              {obligations.map((ob) => (
                <li key={ob} className="flex items-start gap-2 text-slate-300">
                  <span className="mt-0.5 text-amber-400">→</span>
                  {ob}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <h2 className="mb-3 text-lg font-semibold text-white">{t("employer.foreign", lang)}</h2>
          <p className="mb-3 text-sm text-slate-400">{t("employer.foreign.desc", lang)}</p>
          <NearestLocation locations={foreignPoliceLocations} label="Foreign Police office" />
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
              {t("employer.all", lang)}
            </summary>
            <ul className="mt-2 space-y-2 text-sm">
              {foreignPoliceLocations.map((loc) => (
                <li key={loc.city} className="flex items-start gap-2 text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-medium text-white">{loc.city}</span>
                    <span className="text-slate-400">{loc.address}</span>
                    <MapLink address={`${loc.address}, Czech Republic`} />
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <InfoBox title={t("employer.help", lang)} color="blue" className="mt-8">
          <p className="mb-4 text-sm text-slate-300">{t("employer.help.desc", lang)}</p>
          <Link href="/contact" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            {t("nav.contact", lang)}
          </Link>
        </InfoBox>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
