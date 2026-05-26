const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-600",
  IN_PROGRESS: "bg-blue-600",
  COMPLETED: "bg-green-600",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
}

export function WorkersOverviewChart({
  workersByStatus,
}: {
  workersByStatus: Record<string, number>
}) {
  const total = Object.values(workersByStatus).reduce((a, b) => a + b, 0)
  if (total === 0) {
    return <p className="text-sm text-slate-500">No workers yet.</p>
  }

  const statusOrder = ["PENDING", "IN_PROGRESS", "COMPLETED"]

  return (
    <div className="space-y-4">
      <div className="flex h-6 overflow-hidden rounded-full bg-slate-800">
        {statusOrder.map((status) => {
          const count = workersByStatus[status] || 0
          if (count === 0) return null
          return (
            <div
              key={status}
              className={`${statusColors[status]} transition-all`}
              style={{ width: `${(count / total) * 100}%` }}
              title={`${statusLabels[status]}: ${count}`}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {statusOrder.map((status) => {
          const count = workersByStatus[status] || 0
          if (count === 0) return null
          return (
            <div key={status} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${statusColors[status]}`}
              />
              <span className="text-slate-400">
                {statusLabels[status]}
              </span>
              <span className="font-medium text-white">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
