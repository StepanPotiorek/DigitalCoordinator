import Link from "next/link"

interface SubTask {
  label: string
  done: boolean
}

interface JourneyCardProps {
  icon: string
  title: string
  status: "completed" | "in-progress" | "not-started"
  items: SubTask[]
  nextAction?: string
  nextActionHref?: string
}

const statusBadge: Record<string, { label: string; style: string }> = {
  completed: { label: "Completed", style: "bg-emerald-900/40 text-emerald-400" },
  "in-progress": { label: "In Progress", style: "bg-amber-900/40 text-amber-400" },
  "not-started": { label: "Not Started", style: "bg-slate-800/50 text-slate-500" },
}

export function JourneyCard({ icon, title, status, items, nextAction, nextActionHref }: JourneyCardProps) {
  const badge = statusBadge[status]

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.style}`}>
          {badge.label}
        </span>
      </div>

      {items.length > 0 && (
        <div className="mt-3 space-y-1.5 pl-10">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={item.done ? "text-emerald-400" : "text-slate-600"}>
                {item.done ? "✓" : "○"}
              </span>
              <span className={item.done ? "text-slate-300" : "text-slate-500"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {nextAction && nextActionHref && (
        <Link
          href={nextActionHref}
          className="mt-3 ml-10 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          ▶ {nextAction} →
        </Link>
      )}
    </div>
  )
}
