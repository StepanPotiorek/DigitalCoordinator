import { prisma, createNotification } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

let initialized = false

export function initScheduler() {
  if (initialized) return
  initialized = true

  try {
    const cron = require("node-cron")

    cron.schedule("0 8 * * *", () => {
      runDailyChecks()
    })

    console.log("[SCHEDULER] Initialized")
  } catch {
    console.log("[SCHEDULER] node-cron not available, skipping")
  }
}

export async function runDailyChecks() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  const results = {
    staleWorkers: 0,
    staleIssues: 0,
    emailsSent: 0,
    notificationsCreated: 0,
  }

  // Check stale onboarding (7+ days no progress)
  const staleWorkers = await prisma.worker.findMany({
    where: {
      onboardingStatus: { in: ["PENDING", "IN_PROGRESS"] },
      updatedAt: { lt: sevenDaysAgo },
    },
    select: { id: true, name: true, email: true, employer: true },
  })

  for (const worker of staleWorkers) {
    await createNotification(
      "ONBOARDING_REMINDER",
      `${worker.name} hasn't updated onboarding in 7+ days`,
      `/dashboard/workers/${worker.id}`,
      "Stale Onboarding",
    )
    results.notificationsCreated++

    if (worker.email) {
      await sendEmail(
        worker.email,
        "Reminder: Complete Your Onboarding",
        `<p>Hi ${worker.name},</p>
         <p>We noticed you haven't made progress on your onboarding in a while.</p>
         <p>Please log in to continue: <a href="${process.env.NEXTAUTH_URL}/dashboard/worker/onboarding">Complete Onboarding</a></p>
         <p>If you need help, use the help section in your dashboard.</p>`,
      )
      results.emailsSent++
    }
  }
  results.staleWorkers = staleWorkers.length

  // Check stale issues (3+ days no update)
  const staleIssues = await prisma.issue.findMany({
    where: {
      status: { in: ["OPEN", "IN_PROGRESS"] },
      updatedAt: { lt: threeDaysAgo },
    },
    include: { worker: { select: { name: true } } },
  })

  for (const issue of staleIssues) {
    await createNotification(
      "STALE_ISSUE",
      `${issue.worker?.name || "Unknown"} issue "${issue.issueType}" open for 3+ days`,
      `/dashboard/issues/${issue.id}`,
      "Stale Issue",
    )
    results.notificationsCreated++
  }
  results.staleIssues = staleIssues.length

  return results
}
