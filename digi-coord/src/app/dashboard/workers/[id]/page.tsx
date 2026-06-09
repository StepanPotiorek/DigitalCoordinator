import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AccommodationCard } from "@/components/accommodation/accommodation-card"
import { NotesSection } from "@/components/notes/notes-section"
import { PendingAction } from "@/components/admin/pending-action"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-900/50 text-yellow-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  COMPLETED: "bg-green-900/50 text-green-400",
}

const ecColors: Record<string, string> = {
  NOT_STARTED: "bg-slate-900/50 text-slate-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  BIOMETRICS_DONE: "bg-amber-900/50 text-amber-400",
  CARD_READY: "bg-emerald-900/50 text-emerald-400",
  ISSUED: "bg-green-900/50 text-green-400",
}

const ecLabels: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  BIOMETRICS_DONE: "Biometrics Done",
  CARD_READY: "Card Ready",
  ISSUED: "Issued",
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
    (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR" && session.user.role !== "COMPANY")
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
      documents: { orderBy: { uploadedAt: "desc" } },
      communications: { take: 20, orderBy: { createdAt: "desc" } },
    },
  })

  if (!worker) {
    return (
      <p className="text-slate-400">Worker not found.</p>
    )
  }

  const completedItems = worker.onboardingItems.filter((i) => i.completed).length
  const totalItems = worker.onboardingItems.length

  const accountStatusColors: Record<string, string> = {
    PENDING_APPROVAL: "bg-yellow-900/50 text-yellow-400",
    ACTIVE: "bg-green-900/50 text-green-400",
    REJECTED: "bg-red-900/50 text-red-400",
  }

  const accountStatusLabels: Record<string, string> = {
    PENDING_APPROVAL: "Pending Approval",
    ACTIVE: "Active",
    REJECTED: "Rejected",
  }

  return (
    <div>
      {worker.status !== "ACTIVE" && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            worker.status === "PENDING_APPROVAL"
              ? "border-yellow-700 bg-yellow-900/20 text-yellow-300"
              : "border-red-700 bg-red-900/20 text-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>
              {worker.status === "PENDING_APPROVAL"
                ? "This worker is pending approval. They cannot sign in until approved."
                : "This worker has been rejected."}
            </span>
            {session?.user?.role === "ADMIN" && worker.status === "PENDING_APPROVAL" && (
              <div className="flex gap-2">
                <PendingAction workerId={worker.id} status="ACTIVE" label="Approve" />
                <PendingAction workerId={worker.id} status="REJECTED" label="Reject" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{worker.name}</h1>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${accountStatusColors[worker.status]}`}
            >
              {accountStatusLabels[worker.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Registered {new Date(worker.createdAt).toISOString().split("T")[0]}
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
                  ? new Date(worker.arrivalDate).toISOString().split("T")[0]
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Onboarding</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[worker.onboardingStatus]}`}
                >
                  {worker.onboardingStatus.replace("_", " ")}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Employee Card</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ecColors[worker.employeeCardStatus]}`}
                >
                  {ecLabels[worker.employeeCardStatus] || worker.employeeCardStatus.replace("_", " ")}
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
                    {new Date(issue.createdAt).toISOString().split("T")[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Messages from Worker
          </h2>
          {worker.communications.length === 0 ? (
            <p className="text-sm text-slate-400">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {worker.communications.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                >
                  <p className="whitespace-pre-wrap text-sm text-slate-200">
                    {msg.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(msg.createdAt).toLocaleString()} · {msg.createdBy}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <NotesSection workerId={worker.id} />
      </div>

      {worker.documents.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Documents ({worker.documents.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {worker.documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {doc.type}
                </div>
                <div className="truncate text-sm text-white">
                  {doc.originalName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {new Date(doc.uploadedAt).toISOString().split("T")[0]}
                  </span>
                  <a
                    href={`/api/media/${doc.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
