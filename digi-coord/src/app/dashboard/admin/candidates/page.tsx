import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

function boolLabel(val: boolean | null | undefined): string {
  if (val === true) return "Yes"
  if (val === false) return "No"
  return "—"
}

function nullLabel(val: string | null | undefined): string {
  return val || "—"
}

export default async function CandidatesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const candidates = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    include: { candidateProfile: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="mt-1 text-sm text-slate-400">
          {candidates.length} registered candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      </div>

      {candidates.length === 0 ? (
        <p className="text-slate-400">No candidates registered yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-3 py-2 font-medium text-slate-400">Name</th>
                <th className="px-3 py-2 font-medium text-slate-400">Email</th>
                <th className="px-3 py-2 font-medium text-slate-400">Residence</th>
                <th className="px-3 py-2 font-medium text-slate-400">Employer</th>
                <th className="px-3 py-2 font-medium text-slate-400">Position</th>
                <th className="px-3 py-2 font-medium text-slate-400">English</th>
                <th className="px-3 py-2 font-medium text-slate-400">Preferred Job</th>
                <th className="px-3 py-2 font-medium text-slate-400">Start Date</th>
                <th className="px-3 py-2 font-medium text-slate-400">Long-Term</th>
                <th className="px-3 py-2 font-medium text-slate-400">Passport</th>
                <th className="px-3 py-2 font-medium text-slate-400">Drv. License</th>
                <th className="px-3 py-2 font-medium text-slate-400">Lic. Cat.</th>
                <th className="px-3 py-2 font-medium text-slate-400">Drv. Exp.</th>
                <th className="px-3 py-2 font-medium text-slate-400">Comments</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const p = c.candidateProfile
                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 cursor-pointer"
                  >
                    <td className="px-3 py-2 text-white">{c.name || "—"}</td>
                    <td className="px-3 py-2 text-slate-300">{c.email}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.countryOfResidence)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.currentEmployer)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.currentPosition)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.englishLevel)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.preferredPosition)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.availableStartDate)}</td>
                    <td className="px-3 py-2 text-slate-300">{boolLabel(p?.interestedLongTerm)}</td>
                    <td className="px-3 py-2 text-slate-300">{boolLabel(p?.validPassport)}</td>
                    <td className="px-3 py-2 text-slate-300">{boolLabel(p?.validDriversLicense)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.driversLicenseCategory)}</td>
                    <td className="px-3 py-2 text-slate-300">{nullLabel(p?.drivingExperience)}</td>
                    <td className="px-3 py-2 text-slate-300 max-w-[200px] truncate" title={p?.additionalComments || ""}>
                      {nullLabel(p?.additionalComments)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
