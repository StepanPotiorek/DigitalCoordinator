import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CommunicationForm } from "@/components/clients/communication-form"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const clientId = parseInt(id)

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      communications: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { worker: { select: { name: true } } },
      },
    },
  })

  if (!client) {
    return <p className="text-slate-400">Client not found.</p>
  }

  if (
    session.user.role === "CLIENT" &&
    client.userId !== session.user.id
  ) {
    redirect("/dashboard/clients")
  }

  const workers = await prisma.worker.findMany({
    where: { employer: client.name },
    include: {
      _count: {
        select: { issues: { where: { status: { not: "RESOLVED" } } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          <p className="mt-1 text-sm text-slate-400">Client details</p>
        </div>
        <Link
          href="/dashboard/clients"
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Contact Info
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-white">{client.contactEmail || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Phone</dt>
              <dd className="text-white">{client.contactPhone || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Workers</dt>
              <dd className="text-white">{workers.length}</dd>
            </div>
            {client.notes && (
              <div>
                <dt className="mb-1 text-slate-400">Notes</dt>
                <dd className="whitespace-pre-wrap text-sm text-slate-300">
                  {client.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Add Communication
          </h2>
          <CommunicationForm clientId={client.id} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Workers</h2>
        {workers.length === 0 ? (
          <p className="text-sm text-slate-400">
            No workers match this client. Workers are matched by employer name.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                href={`/dashboard/workers/${worker.id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
              >
                <div className="font-medium text-white">{worker.name}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {worker.whatsapp}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span
                    className={
                      worker._count.issues > 0
                        ? "font-medium text-red-400"
                        : "text-green-400"
                    }
                  >
                    ⚠ {worker._count.issues} open
                  </span>
                  <span className="text-slate-500">
                    {worker.onboardingStatus.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Communication History
        </h2>
        {client.communications.length === 0 ? (
          <p className="text-sm text-slate-400">
            No communications recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {client.communications.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
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
                  <span>{c.createdBy}</span>
                  <span>·</span>
                  <span>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-slate-300">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
