import { auth } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/server-fetch"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CommunicationForm } from "@/components/companies/communication-form"

interface CompanyWorker {
  id: number
  name: string
  whatsapp: string | null
  onboardingStatus: string
  employeeCardStatus: string
  openIssues: number
}

interface CompanyComm {
  id: number
  type: string
  message: string
  createdBy: string
  createdAt: string
  worker: { name: string } | null
}

const ecLabel: Record<string, string> = {
  NOT_STARTED: "Card: Not Started",
  IN_PROGRESS: "Card: In Progress",
  BIOMETRICS_DONE: "Card: Biometrics Done",
  CARD_READY: "Card: Ready",
  ISSUED: "Card: Issued",
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`

  const [companyRes, workersRes] = await Promise.all([
    fetchWithAuth(`${baseUrl}/api/companies/${id}`, { cache: "no-store" }),
    fetchWithAuth(`${baseUrl}/api/companies/${id}/workers`, { cache: "no-store" }),
  ])

  if (!companyRes.ok) {
    return <p className="text-slate-400">Company not found.</p>
  }

  const company: {
    id: number
    name: string
    contactEmail: string | null
    contactPhone: string | null
    notes: string | null
    userId: string | null
    communications: CompanyComm[]
  } = await companyRes.json()

  if (
    session.user.role === "COMPANY" &&
    company.userId !== session.user.id
  ) {
    redirect("/dashboard/companies")
  }

  const workers: CompanyWorker[] = workersRes.ok ? await workersRes.json() : []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          <p className="mt-1 text-sm text-slate-400">Company details</p>
        </div>
        <Link
          href="/dashboard/companies"
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Contact Info
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-white">{company.contactEmail || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-white">{company.contactPhone || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Workers</dt>
              <dd className="text-white">{workers.length}</dd>
            </div>
            {company.notes && (
              <div>
                <dt className="mb-1 text-slate-400">Notes</dt>
                <dd className="whitespace-pre-wrap text-sm text-slate-300">
                  {company.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Add Communication
          </h2>
          <CommunicationForm companyId={company.id} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Workers</h2>
        {workers.length === 0 ? (
          <p className="text-sm text-slate-400">
            No workers match this company. Workers are matched by employer name.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                href={`/dashboard/workers/${worker.id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
              >
                <div className="font-medium text-white">{worker.name}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {worker.whatsapp}
                </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span
                      className={
                        worker.openIssues > 0
                          ? "font-medium text-red-400"
                          : "text-green-400"
                      }
                    >
                      ⚠ {worker.openIssues} open
                    </span>
                    <span className="text-slate-500">
                      {worker.onboardingStatus.replace("_", " ")}
                    </span>
                    <span className="text-slate-600">
                      {ecLabel[worker.employeeCardStatus] || worker.employeeCardStatus}
                    </span>
                  </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Communication History
        </h2>
        {company.communications.length === 0 ? (
          <p className="text-sm text-slate-400">
            No communications recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {company.communications.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-400">
                    {c.type.replace("_", " ")}
                  </span>
                  {c.worker && (
                    <>
                      <span>·</span>
                      <span>{c.worker.name}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{c.createdBy}</span>
                  <span>·</span>
                  <span>
                    {new Date(c.createdAt).toISOString().split("T")[0]}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-slate-300">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
