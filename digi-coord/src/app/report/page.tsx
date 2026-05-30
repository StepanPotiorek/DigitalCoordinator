import Link from "next/link"
import { Suspense } from "react"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { IssueReportForm } from "@/components/forms/issue-report-form"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

export default async function ReportPage({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      <PageContainer className="max-w-2xl">
        <PageHeader
          title={t("report.title", lang)}
          subtitle={t("report.subtitle", lang)}
        />

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <Suspense fallback={<div className="text-sm text-slate-400">Loading form...</div>}>
            <IssueReportForm />
          </Suspense>
        </div>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
