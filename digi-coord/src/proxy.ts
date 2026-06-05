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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/icons") || pathname.startsWith("/favicon") || pathname === "/manifest.json" || pathname === "/sw.js") {
    return
  }

  const hasSessionCookie = req.cookies.has("next-auth.session-token")

  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return
  }

  if (authPrefixes.some((p) => pathname.startsWith(p))) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
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
