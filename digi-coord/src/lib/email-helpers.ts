import { prisma } from "@/lib/prisma"
import { sendIssueCreated, sendIssueResolved, sendUrgentIssueAlert, sendNewWorkerAlert } from "@/lib/email"

export async function notifyAdminsOfIssue(workerName: string, issueType: string, issueId: number, priority: string) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "COORDINATOR"] } },
    select: { email: true },
  })

  for (const admin of admins) {
    if (priority === "URGENT") {
      await sendUrgentIssueAlert(admin.email, workerName, issueType, issueId)
    } else {
      await sendIssueCreated(admin.email, workerName, issueType, issueId)
    }
  }
}

export async function notifyWorkerOfResolution(workerEmail: string, issueType: string) {
  if (workerEmail) {
    await sendIssueResolved(workerEmail, issueType)
  }
}

export async function notifyAdminsOfNewWorker(workerName: string, workerId: number) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "COORDINATOR"] } },
    select: { email: true },
  })

  for (const admin of admins) {
    await sendNewWorkerAlert(admin.email, workerName, workerId)
  }
}
