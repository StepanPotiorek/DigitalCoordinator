"use client"

import { useState, useEffect } from "react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i))
}

export function PushSubscribeButton() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true)
      navigator.serviceWorker.ready.then((reg) =>
        reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub)),
      )
    }
  }, [])

  async function toggle() {
    if (subscribed) {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      await sub?.unsubscribe()
      await fetch("/api/push/subscribe", { method: "DELETE", body: JSON.stringify({ endpoint: sub?.endpoint }), headers: { "Content-Type": "application/json" } })
      setSubscribed(false)
      return
    }

    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // VAPID public key — in production, set via NEXT_PUBLIC_VAPID_PUBLIC_KEY
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv3yU0gK3Oi0gKVqJwQVwUv8wQDqF5gAeJ8Qk5kP5Y5v5v5w5v5w5v5w5v5w5v5w5v5w5v5w",
        ),
      })
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: sub.toJSON().keys,
          userAgent: navigator.userAgent,
        }),
      })
      setSubscribed(true)
    } catch {
      // Permission denied
    } finally {
      setLoading(false)
    }
  }

  if (!supported) return null

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
    >
      {loading ? "..." : subscribed ? "🔕 Push Off" : "🔔 Push On"}
    </button>
  )
}
