import { NextRequest, NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  await signOut({ redirect: false })

  const proto = request.headers.get("x-forwarded-proto") ?? "http"
  const host = request.headers.get("host") ?? "localhost:3000"

  return NextResponse.redirect(new URL("/login", `${proto}://${host}`), 303)
}