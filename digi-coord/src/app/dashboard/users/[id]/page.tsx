import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-900/50 text-red-400",
  COORDINATOR: "bg-blue-900/50 text-blue-400",
  COMPANY: "bg-green-900/50 text-green-400",
  CANDIDATE: "bg-purple-900/50 text-purple-400",
  WORKER: "bg-slate-900/50 text-slate-400",
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      company: true,
      _count: { select: { notifications: true } },
    },
  })

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-slate-400">User not found.</p>
        <Link
          href="/dashboard/users"
          className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Users
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-900/50 text-xl font-bold text-blue-300">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.name || "Unnamed User"}
              </h1>
              <span
                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role]}`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-white">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-white">
                {new Date(user.createdAt).toISOString().split("T")[0]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Last Updated</dt>
              <dd className="text-white">
                {new Date(user.updatedAt).toISOString().split("T")[0]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Notifications</dt>
              <dd className="text-white">{user._count.notifications}</dd>
            </div>
          </dl>
        </div>

        {user.company && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Linked Company
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Name</dt>
                <dd className="text-white">{user.company.name}</dd>
              </div>
              {user.company.contactEmail && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Email</dt>
                  <dd className="text-white">{user.company.contactEmail}</dd>
                </div>
              )}
              {user.company.contactPhone && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Phone</dt>
                  <dd className="text-white">{user.company.contactPhone}</dd>
                </div>
              )}
              {user.company.notes && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Notes</dt>
                  <dd className="text-white">{user.company.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
