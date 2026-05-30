import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CompaniesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = session.user.role

  if (role === "COMPANY") {
    const companyRecord = await prisma.company.findUnique({
      where: { userId: session.user.id },
      include: {
        communications: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { worker: { select: { name: true } } },
        },
      },
    })

    if (!companyRecord) {
      return <p className="text-slate-400">Company profile not found.</p>
    }

    const workers = await prisma.worker.findMany({
      where: { employer: companyRecord.name },
      include: {
        _count: {
          select: { issues: { where: { status: { not: "RESOLVED" } } } },
        },
        onboardingItems: { select: { completed: true } },
        accommodationDetail: { select: { address: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const ecLabels: Record<string, string> = {
      NOT_STARTED: "Card: Not Started",
      IN_PROGRESS: "Card: In Progress",
      BIOMETRICS_DONE: "Card: Biometrics Done",
      CARD_READY: "Card: Ready",
      ISSUED: "Card: Issued",
    }

    const totalWorkers = workers.length
    const completedOnboarding = workers.filter(
      (w) => w.onboardingStatus === "COMPLETED"
    ).length
    const totalIssues = workers.reduce(
      (sum, w) => sum + w._count.issues,
      0
    )

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {companyRecord.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your workers overview
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">
              {totalWorkers}
            </div>
            <div className="text-sm text-slate-400">Workers</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">
              {completedOnboarding}
            </div>
            <div className="text-sm text-slate-400">
              Onboarding Complete
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-red-400">
              {totalIssues}
            </div>
            <div className="text-sm text-slate-400">Open Issues</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Workers</h2>
          {workers.length === 0 ? (
            <p className="text-sm text-slate-400">No workers assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {workers.map((worker) => {
                const total = worker.onboardingItems.length
                const completed = worker.onboardingItems.filter((i) => i.completed).length
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

                return (
                  <Link
                    key={worker.id}
                    href={`/dashboard/workers/${worker.id}`}
                    className="block rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {worker.name}
                        </div>
                        <div className="mt-0.5 text-sm text-slate-400">
                          {worker.whatsapp}
                        </div>
                        {worker.accommodationDetail && (
                          <div className="mt-0.5 text-xs text-slate-500">
                            {worker.accommodationDetail.address}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className={worker._count.issues > 0 ? "font-medium text-red-400" : "text-xs text-green-400"}>
                          {worker._count.issues > 0
                            ? `${worker._count.issues} open issue(s)`
                            : "No issues"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {worker.onboardingStatus.replace("_", " ")}
                        </div>
                        <div className="text-[10px] text-slate-600">
                          {ecLabels[worker.employeeCardStatus] || worker.employeeCardStatus}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Onboarding</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recent Communications
          </h2>
          {companyRecord.communications.length === 0 ? (
            <p className="text-sm text-slate-400">No communications yet.</p>
          ) : (
            <div className="space-y-3">
              {companyRecord.communications.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
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
                    <span>
                      {new Date(c.createdAt).toISOString().split("T")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (role !== "ADMIN") redirect("/dashboard")

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  })

  const workers = await prisma.worker.groupBy({
    by: ["employer"],
    _count: true,
  })

  const workerCountMap = new Map(
    workers.map((w) => [w.employer, w._count])
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage company accounts
        </p>
      </div>

      {companies.length === 0 ? (
        <p className="text-slate-400">No companies yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Phone
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Workers
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/companies/${company.id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {company.contactEmail || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {company.contactPhone || "—"}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {company.name
                      ? workerCountMap.get(company.name) || 0
                      : 0}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(company.createdAt).toISOString().split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
