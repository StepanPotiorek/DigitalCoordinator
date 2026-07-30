"use client"

import { useState, useEffect } from "react"
import type { Lang } from "./translations"

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    function readCookie() {
      const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
      const val = match?.[1]
      if (val === "tl" || val === "cz") setLang(val)
      else setLang("en")
    }
    readCookie()
    const interval = setInterval(readCookie, 2000)
    return () => clearInterval(interval)
  }, [])

  return lang
}
