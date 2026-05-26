"use client"

import { useRef } from "react"
import { nearbySearchUrl } from "@/lib/locations"

interface Props {
  query: string
  label: string
}

export function NearbySearchButton({ query, label }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  function handleClick() {
    const url = nearbySearchUrl(query)
    window.open(url, "_blank", "noopener")
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/50 transition"
    >
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {label}
    </button>
  )
}
