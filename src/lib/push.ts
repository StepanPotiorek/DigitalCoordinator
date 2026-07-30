import { prisma } from "@/lib/prisma"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ""
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@digicoord.cz"

export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY
}

export function isPushConfigured(): boolean {
  return !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY)
}

export async function sendPushNotification(
  title: string,
  body: string,
  url?: string,
) {
  if (!isPushConfigured()) {
    console.log(`[PUSH] Would send: "${title}" — ${body} (VAPID not configured)`)
    return
  }

  let webpush: any
  try {
    webpush = await import("web-push")
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  } catch {
    console.error("[PUSH] web-push library not available")
    return
  }

  const subscriptions = await prisma.pushSubscription.findMany()

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: { url: url || "/dashboard" },
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      ).catch(async (err: any) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {})
        }
      }),
    ),
  )

  const sent = results.filter((r) => r.status === "fulfilled").length
  console.log(`[PUSH] Sent to ${sent}/${subscriptions.length} subscribers`)
}
