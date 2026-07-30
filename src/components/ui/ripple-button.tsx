"use client"

import { useState } from "react"

export function RippleButton({
  onClick,
  className,
  children,
}: {
  onClick: () => void
  className: string
  children: React.ReactNode
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }

  return (
    <button
      onClick={onClick}
      onPointerDown={handlePointerDown}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      {children}
    </button>
  )
}
