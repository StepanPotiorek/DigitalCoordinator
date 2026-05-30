import Link from "next/link"
import { ProgressBadge } from "@/components/onboarding/progress-badge"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-900/50 text-yellow-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  COMPLETED: "bg-green-900/50 text-green-400",
}

type Worker = {
  id: number
  name: string
  whatsapp: string
  arrivalDate: string | null
  onboardingStatus: string
  openIssues: number
  onboardingCompleted: number
  onboardingTotal: number
}

export function WorkerStatusCard({ worker }: { worker: Worker }) {
  const initial = worker.name.charAt(0).toUpperCase()

  return (
    <Link
      href={`/dashboard/workers/${worker.id}`}
      className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-900/50 text-sm font-bold text-blue-400">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-medium text-white">{worker.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[worker.onboardingStatus]}`}
            >
              {worker.onboardingStatus.replace("_", " ")}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
            <span>📞 {worker.whatsapp}</span>
            {worker.arrivalDate && (
              <span>
                🗓 {new Date(worker.arrivalDate).toLocaleDateString()}
              </span>
            )}
            <span className={worker.openIssues > 0 ? "text-red-400" : ""}>
              ⚠ {worker.openIssues} open
            </span>
          </div>
          <div className="mt-2">
            <ProgressBadge
              completed={worker.onboardingCompleted}
              total={worker.onboardingTotal}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
