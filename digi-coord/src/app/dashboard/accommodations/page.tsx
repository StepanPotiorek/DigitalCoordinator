import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AccommodationsPage() {
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")
  ) {
    redirect("/login")
  }

  const accommodations = await prisma.accommodation.findMany({
    include: { worker: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Accommodations</h1>
        <p className="mt-1 text-sm text-slate-400">
          All worker accommodations
        </p>
      </div>

      {accommodations.length === 0 ? (
        <p className="text-slate-400">No accommodations recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-medium text-slate-400">
                  Worker
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Address
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">Room</th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Contact
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((acc) => (
                <tr
                  key={acc.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/workers/${acc.workerId}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {acc.worker.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white">{acc.address}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {acc.room || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white">
                      {acc.contactName || "—"}
                    </div>
                    {acc.contactPhone && (
                      <div className="text-xs text-slate-400">
                        {acc.contactPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(acc.createdAt).toLocaleDateString()}
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
