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

type Issue = {
  id: number
  issueType: string
  priority: string
  status: string
  createdAt: Date
  worker: { name: string } | null
}

export function RecentIssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="px-4 py-3 font-medium text-slate-400">Worker</th>
            <th className="px-4 py-3 font-medium text-slate-400">Type</th>
            <th className="px-4 py-3 font-medium text-slate-400">
              Priority
            </th>
            <th className="px-4 py-3 font-medium text-slate-400">Status</th>
            <th className="px-4 py-3 font-medium text-slate-400">Date</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr
              key={issue.id}
              className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/issues/${issue.id}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {issue.worker?.name || "Unregistered"}
                </Link>
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
  )
}
