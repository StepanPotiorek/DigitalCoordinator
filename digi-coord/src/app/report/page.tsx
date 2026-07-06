import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { Suspense } from "react"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { SiteFooter } from "@/components/public/site-footer"
import { IssueReportForm } from "@/components/forms/issue-report-form"

export default async function ReportPage() {
  const lang = await getLang()

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

      <SiteFooter />
    </div>
  )
}
