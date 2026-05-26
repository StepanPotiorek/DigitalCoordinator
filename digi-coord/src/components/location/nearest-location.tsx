"use client"

import { useEffect, useState } from "react"
import { findNearest, mapsUrl, distanceKm, type Location } from "@/lib/locations"

interface Props {
  locations: Location[]
  label: string
}

type State =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "unavailable" }
  | { status: "found"; location: Location; km: number }

export function NearestLocation({ locations, label }: Props) {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "unavailable" })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        const nearest = findNearest(locations, coords)
        if (nearest) {
          const km = Math.round(distanceKm(nearest, coords) * 10) / 10
          setState({ status: "found", location: nearest, km })
        } else {
          setState({ status: "unavailable" })
        }
      },
      () => setState({ status: "denied" }),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }, [locations])

  if (state.status === "loading") {
    return (
      <span className="text-xs text-slate-500 italic">
        detecting your location…
      </span>
    )
  }

  if (state.status === "denied") {
    return (
      <span className="text-xs text-slate-500">
        enable location to find nearest {label}
      </span>
    )
  }

  if (state.status === "unavailable") {
    return null
  }

  const { location, km } = state

  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-800 bg-blue-900/20 px-3 py-2 text-xs">
      <span className="text-slate-400">Nearest {label}:</span>
      <span className="font-medium text-white">{location.city}</span>
      <span className="text-slate-400">({km} km)</span>
      <a
        href={mapsUrl(location.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition ml-auto"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Navigate
      </a>
    </div>
  )
}


