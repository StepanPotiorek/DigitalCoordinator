import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { createRequestLogger } from "@/lib/logger"

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const log = createRequestLogger({ method: req.method, url: pathname })
  log.info("request started")

  const publicPaths = [
    "/login", "/register", "/", "/faq", "/guide", "/contact",
    "/before-arrival", "/after-arrival", "/first-day",
    "/employer-card", "/report", "/forgot-password", "/reset-password",
  ]

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "?"),
  )

  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/api/media/")

  if (isStatic) {
    log.done(200)
    return NextResponse.next()
  }
  if (isPublic) {
    log.done(200)
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const url = new URL("/login", req.nextUrl.origin)
    url.searchParams.set("callbackUrl", pathname)
    log.done(302)
    return Response.redirect(url)
  }

  log.done(200)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/).*)"],
}
