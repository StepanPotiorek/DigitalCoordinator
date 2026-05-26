import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ClientsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = session.user.role

  if (role === "CLIENT") {
    const clientRecord = await prisma.client.findUnique({
      where: { userId: session.user.id },
      include: {
        communications: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { worker: { select: { name: true } } },
        },
      },
    })

    if (!clientRecord) {
      return <p className="text-slate-400">Client profile not found.</p>
    }

    const workers = await prisma.worker.findMany({
      where: { employer: clientRecord.name },
      include: {
        _count: {
          select: { issues: { where: { status: { not: "RESOLVED" } } } },
        },
        onboardingItems: { select: { completed: true } },
      },
      orderBy: { createdAt: "desc" },
    })

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
            Welcome, {clientRecord.name}
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
            <div className="text-sm text-slate-400">Onboarding Complete</div>
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
            <div className="space-y-3">
              {workers.map((worker) => (
                <Link
                  key={worker.id}
                  href={`/dashboard/workers/${worker.id}`}
                  className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        {worker.name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {worker.whatsapp}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div
                        className={`font-medium ${
                          worker._count.issues > 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {worker._count.issues} issues
                      </div>
                      <div className="text-slate-500">
                        {worker.onboardingStatus.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recent Communications
          </h2>
          {clientRecord.communications.length === 0 ? (
            <p className="text-sm text-slate-400">No communications yet.</p>
          ) : (
            <div className="space-y-3">
              {clientRecord.communications.map((c) => (
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
                      {new Date(c.createdAt).toLocaleDateString()}
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

  const clients = await prisma.client.findMany({
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
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage client accounts
        </p>
      </div>

      {clients.length === 0 ? (
        <p className="text-slate-400">No clients yet.</p>
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
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {client.contactEmail || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {client.contactPhone || "—"}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {client.name
                      ? workerCountMap.get(client.name) || 0
                      : 0}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(client.createdAt).toLocaleDateString()}
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
