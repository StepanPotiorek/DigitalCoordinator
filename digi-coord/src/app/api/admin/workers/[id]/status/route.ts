import { auth } from "@/lib/auth"
import { prisma, createNotification } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, badRequest } from "@/lib/api-utils"
import { logAction } from "@/lib/audit"
import { notifyWorkerOfApproval } from "@/lib/email-helpers"
import { NextRequest } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return unauthorized()
    }

    const { id } = await params
    const workerId = parseInt(id)
    const body = await request.json()
    const { status } = body

    if (!status || !["ACTIVE", "REJECTED"].includes(status)) {
      return badRequest("Status must be ACTIVE or REJECTED")
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      select: { id: true, name: true, email: true, status: true },
    })

    if (!worker) {
      return notFound()
    }

    const updated = await prisma.worker.update({
      where: { id: workerId },
      data: { status },
    })

    await createNotification(
      status === "ACTIVE" ? "WORKER_APPROVED" : "WORKER_REJECTED",
      `${worker.name} was ${status === "ACTIVE" ? "approved" : "rejected"}`,
      `/dashboard/workers/${worker.id}`,
    )

    void logAction(session.user.id, `worker.${status.toLowerCase()}`, "Worker", worker.id)

    if (status === "ACTIVE" && worker.email) {
      await notifyWorkerOfApproval(worker.email, worker.name)
    }

    return { success: true, worker: updated }
  })
}
