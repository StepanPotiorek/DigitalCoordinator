import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPrefixes = ["/dashboard"]
const authPrefixes = ["/login", "/register", "/forgot-password", "/reset-password"]
const publicRoutes = [
  "/",
  "/after-arrival",
  "/before-arrival",
  "/first-day",
  "/guide",
  "/templates",
  "/faq",
  "/contact",
  "/employer-card",
  "/report",
  "/_not-found",
]

function getOrigin(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "http"
  const host = req.headers.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const origin = getOrigin(req)

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/icons") || pathname.startsWith("/favicon") || pathname === "/manifest.json" || pathname === "/sw.js") {
    return
  }

  const hasSessionCookie = req.cookies.has("next-auth.session-token")

  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return
  }

  if (authPrefixes.some((p) => pathname.startsWith(p))) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", origin))
    }
    return
  }

  if (!publicRoutes.includes(pathname)) {
    return
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
