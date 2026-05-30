import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { WorkerRegistrationForm } from "@/components/forms/worker-registration-form"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      <PageContainer>
        <PageHeader
          title={t("register.title", lang)}
          subtitle={t("register.subtitle", lang)}
          badge="STEP 1"
        />

        <WorkerRegistrationForm />

        <p className="mt-6 text-center text-xs text-slate-500">
          {t("register.already", lang)}{" "}
          <Link href={`/guide?lang=${lang}`} className="text-blue-400 hover:text-blue-300">
            {t("register.guide", lang)}
          </Link>
        </p>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
