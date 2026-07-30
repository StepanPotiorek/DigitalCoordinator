import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { IssueActions } from "./issue-actions"

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

export default async function IssueDetailPage({
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
  const issueId = parseInt(id)

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { worker: { select: { name: true, whatsapp: true } } },
  })

  let mediaUrls: string[] = []
  if (issue?.mediaUrls) {
    try {
      mediaUrls = JSON.parse(issue.mediaUrls)
    } catch { /* ignore */ }
  }

  if (!issue) {
    return <p className="text-slate-400">Issue not found.</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Issue #{issue.id}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{issue.issueType}</p>
        </div>
        <div className="flex gap-2">
          <IssueActions
            issueId={issue.id}
            currentStatus={issue.status}
            currentPriority={issue.priority}
            isAdmin={session.user.role === "ADMIN"}
          />
          <Link
            href="/dashboard/issues"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-sm text-slate-300">
            {issue.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Status</dt>
                <dd>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[issue.status]}`}
                  >
                    {issue.status.replace("_", " ")}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Priority</dt>
                <dd>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[issue.priority]}`}
                  >
                    {issue.priority}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Type</dt>
                <dd className="text-white">{issue.issueType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Created</dt>
                <dd className="text-white">
                  {new Date(issue.createdAt).toISOString().split("T")[0]}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Updated</dt>
                <dd className="text-white">
                  {new Date(issue.updatedAt).toISOString().split("T")[0]}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Worker</h2>
            {issue.worker ? (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Name</dt>
                  <dd>
                    <Link
                      href={`/dashboard/workers/${issue.workerId}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {issue.worker.name}
                    </Link>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">WhatsApp</dt>
                  <dd className="text-white">
                    {issue.worker.whatsapp}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-slate-400">
                Unregistered worker (no account in system)
              </p>
            )}
          </div>
        </div>
      </div>

      {mediaUrls.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Attachments ({mediaUrls.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {mediaUrls.map((url, i) => {
              const isVideo = url.match(/\.(mp4|webm)$/i)
              return isVideo ? (
                <video
                  key={i}
                  controls
                  preload="metadata"
                  className="w-full rounded-lg border border-slate-700"
                >
                  <source src={url} />
                </video>
              ) : (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <img
                    src={url}
                    alt={`Attachment ${i + 1}`}
                    className="w-full rounded-lg border border-slate-700 object-cover transition group-hover:border-blue-500"
                    style={{ aspectRatio: "4/3" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition group-hover:bg-black/30">
                    <span className="text-2xl opacity-0 transition group-hover:opacity-100">🔍</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
