import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AccommodationForm } from "@/components/accommodation/accommodation-form"

export default async function WorkerAccommodationPage({
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
    include: { accommodationDetail: true },
  })

  if (!worker) {
    return <p className="text-slate-400">Worker not found.</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Accommodation — {worker.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {worker.accommodationDetail
              ? "Edit accommodation information"
              : "Add accommodation information"}
          </p>
        </div>
        <Link
          href={`/dashboard/workers/${worker.id}`}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Back
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <AccommodationForm
          workerId={worker.id}
          initialData={
            worker.accommodationDetail
              ? {
                  address: worker.accommodationDetail.address,
                  room: worker.accommodationDetail.room || "",
                  rules: worker.accommodationDetail.rules || "",
                  contactName: worker.accommodationDetail.contactName || "",
                  contactPhone: worker.accommodationDetail.contactPhone || "",
                  mapUrl: worker.accommodationDetail.mapUrl || "",
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
