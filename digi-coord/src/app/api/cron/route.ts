import { apiHandler } from "@/lib/api-utils"
import { runDailyChecks } from "@/lib/scheduler"
import { sendPushNotification } from "@/lib/push"

export async function POST() {
  return apiHandler(async () => {
    const results = await runDailyChecks()

    if (results.notificationsCreated > 0) {
      await sendPushNotification(
        "Daily Check Complete",
        `${results.staleWorkers} stale workers, ${results.staleIssues} stale issues found`,
        "/dashboard/operations",
      )
    }

    return {
      ...results,
      message: "Daily checks completed successfully",
    }
  })
}

export async function GET() {
  return apiHandler(async () => {
    return {
      status: "ok",
      scheduler: "cron endpoint ready — POST to trigger checks",
    }
  })
}
