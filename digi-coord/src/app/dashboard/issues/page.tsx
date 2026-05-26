import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

const statusColors: Record<string, string> = {
  OPEN: "bg-red-900/50 text-red-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  RESOLVED: "bg-green-900/50 text-green-400",
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-900/50 text-red-400 font-bold",
  HIGH: "bg-amber-900/50 text-amber-400",
  MEDIUM: "bg-blue-900/50 text-blue-400",
  LOW: "bg-slate-700 text-slate-400",
}

const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string }>
}) {
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")
  ) {
    redirect("/login")
  }

  const { status, priority } = await searchParams

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (priority) where.priority = priority

  const issues = await prisma.issue.findMany({
    where,
    include: { worker: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  issues.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Issues</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track and manage reported issues
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["", "OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
          <Link
            key={s}
            href={s ? `/dashboard/issues?status=${s}` : "/dashboard/issues"}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              (status || "") === s
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
        <span className="mx-1 text-slate-600">|</span>
        {["", "URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
          <Link
            key={p}
            href={
              p
                ? `/dashboard/issues?priority=${p}`
                : "/dashboard/issues"
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              (priority || "") === p
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {p || "All Priorities"}
          </Link>
        ))}
      </div>

      {issues.length === 0 ? (
        <p className="text-slate-400">No issues found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-medium text-slate-400">ID</th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Worker
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">Type</th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Priority
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => window.location.href = `/dashboard/issues/${issue.id}`}
                  className="cursor-pointer border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-500">#{issue.id}</td>
                  <td className="px-4 py-3">
                    {issue.worker ? (
                      <Link
                        href={`/dashboard/workers/${issue.workerId}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {issue.worker.name}
                      </Link>
                    ) : (
                      <span className="text-slate-500">Unregistered</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white">{issue.issueType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[issue.priority]}`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[issue.status]}`}
                    >
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(issue.createdAt).toLocaleDateString()}
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
