import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AccommodationCard } from "@/components/accommodation/accommodation-card"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-900/50 text-yellow-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  COMPLETED: "bg-green-900/50 text-green-400",
}

const issueStatusColors: Record<string, string> = {
  OPEN: "bg-red-900/50 text-red-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  RESOLVED: "bg-green-900/50 text-green-400",
}

export default async function WorkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")
  ) {
    redirect("/login")
  }

  const { id } = await params
  const workerId = parseInt(id)

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    include: {
      onboardingItems: true,
      accommodationDetail: true,
      issues: { take: 5, orderBy: { createdAt: "desc" } },
    },
  })

  if (!worker) {
    return (
      <p className="text-slate-400">Worker not found.</p>
    )
  }

  const completedItems = worker.onboardingItems.filter((i) => i.completed).length
  const totalItems = worker.onboardingItems.length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{worker.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Registered {new Date(worker.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/workers/${worker.id}/onboarding`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Onboarding
          </Link>
          <Link
            href={`/dashboard/workers/${worker.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            href="/dashboard/workers"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Contact Information
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">WhatsApp</dt>
              <dd className="text-white">{worker.whatsapp}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-white">{worker.email || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Employer</dt>
              <dd className="text-white">{worker.employer || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Arrival Date</dt>
              <dd className="text-white">
                {worker.arrivalDate
                  ? new Date(worker.arrivalDate).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Status</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[worker.onboardingStatus]}`}
                >
                  {worker.onboardingStatus.replace("_", " ")}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Emergency Contact
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Name</dt>
              <dd className="text-white">
                {worker.emergencyContactName || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-white">
                {worker.emergencyContactPhone || "—"}
              </dd>
            </div>
          </dl>
        </div>

        {worker.accommodationDetail ? (
          <AccommodationCard
            accommodation={worker.accommodationDetail}
            workerId={worker.id}
          />
        ) : worker.accommodation ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Accommodation (from registration)
              </h2>
              <Link
                href={`/dashboard/workers/${worker.id}/accommodation`}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Add Details
              </Link>
            </div>
            <p className="text-sm text-slate-300">{worker.accommodation}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Accommodation
              </h2>
              <Link
                href={`/dashboard/workers/${worker.id}/accommodation`}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Add Accommodation
              </Link>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              No accommodation information yet.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Onboarding Progress
          </h2>
          {totalItems === 0 ? (
            <p className="text-sm text-slate-400">
              No onboarding items configured yet.
            </p>
          ) : (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {completedItems} of {totalItems} completed
                </span>
                <span className="font-medium text-white">
                  {Math.round((completedItems / totalItems) * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${(completedItems / totalItems) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recent Issues
          </h2>
          {worker.issues.length === 0 ? (
            <p className="text-sm text-slate-400">No issues reported.</p>
          ) : (
            <div className="space-y-3">
              {worker.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {issue.issueType}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${issueStatusColors[issue.status]}`}
                    >
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
