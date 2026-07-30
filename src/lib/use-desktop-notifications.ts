"use client"

import { useEffect, useRef } from "react"

interface NotificationData {
  id: number
  message: string
  link: string | null
}

export function useDesktopNotifications(notifications: NotificationData[]) {
  const displayedIds = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (typeof Notification === "undefined") return
    if (Notification.permission !== "granted") return

    for (const n of notifications) {
      if (displayedIds.current.has(n.id)) continue
      displayedIds.current.add(n.id)

      const notif = new Notification("Digital Coordinator", {
        body: n.message,
        icon: "/icons/icon-192x192.png",
      })

      const link = n.link
      if (link) {
        notif.onclick = () => {
          window.open(link, "_blank")
          notif.close()
        }
      }
    }
  }, [notifications])
}
