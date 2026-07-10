import { auth } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/server-fetch"
import { redirect } from "next/navigation"

interface CandidateProfile {
  name: string
  email: string
  countryOfResidence: string | null
  currentEmployer: string | null
  currentPosition: string | null
  englishLevel: string | null
  preferredPosition: string | null
  availableStartDate: string | null
  interestedLongTerm: boolean | null
  validPassport: boolean | null
  validDriversLicense: boolean | null
  driversLicenseCategory: string | null
  drivingExperience: string | null
  additionalComments: string | null
  cvPath: string | null
}

function boolLabel(val: boolean | null | undefined): string {
  if (val === true) return "Yes"
  if (val === false) return "No"
  return "—"
}

function nullLabel(val: string | null | undefined): string {
  return val || "—"
}

export default async function CompanyCandidatesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "COMPANY") {
    redirect("/login")
  }

  const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetchWithAuth(`${baseUrl}/api/companies/candidates`, { cache: "no-store" })

  if (!res.ok) {
    return <p className="text-slate-400">Failed to load candidates.</p>
  }

  const candidates: CandidateProfile[] = await res.json()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="mt-1 text-sm text-slate-400">
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {candidates.length === 0 ? (
        <p className="text-slate-400">No candidates registered yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => (
            <div
              key={c.email}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
            >
              <div className="mb-3">
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-sm text-slate-400">{c.email}</div>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">English</span>
                  <span className="text-white">{nullLabel(c.englishLevel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred</span>
                  <span className="text-white text-right">{nullLabel(c.preferredPosition)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available</span>
                  <span className="text-white">{nullLabel(c.availableStartDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Passport</span>
                  <span className="text-white">{boolLabel(c.validPassport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver License</span>
                  <span className="text-white">{boolLabel(c.validDriversLicense)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">License Cat.</span>
                  <span className="text-white">{nullLabel(c.driversLicenseCategory)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drv. Experience</span>
                  <span className="text-white">{nullLabel(c.drivingExperience)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Residence</span>
                  <span className="text-white">{nullLabel(c.countryOfResidence)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Employer</span>
                  <span className="text-white text-right">{nullLabel(c.currentEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Position</span>
                  <span className="text-white text-right">{nullLabel(c.currentPosition)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Long-Term</span>
                  <span className="text-white">{boolLabel(c.interestedLongTerm)}</span>
                </div>
              </div>

              {c.additionalComments && (
                <div className="mt-3 rounded-lg bg-slate-800/50 p-3 text-xs text-slate-300">
                  {c.additionalComments}
                </div>
              )}

              {c.cvPath ? (
                <a
                  href={c.cvPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View CV
                </a>
              ) : (
                <div className="mt-4 rounded-lg bg-slate-800/30 px-4 py-2 text-center text-xs text-slate-500">
                  No CV uploaded
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
