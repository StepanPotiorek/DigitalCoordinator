import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { logger } from "./logger"
import * as Sentry from "@sentry/nextjs"
import { checkRateLimit } from "./rate-limit"

export function parseId(id: string): number | null {
  const n = parseInt(id, 10)
  return Number.isNaN(n) || n <= 0 ? null : n
}

type Handler<T> = () => Promise<T>

export async function apiHandler<T>(
  fn: Handler<T>,
  req?: NextRequest,
): Promise<NextResponse> {
  try {
    if (req) {
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
      const key = `api:${ip}`
      const { allowed, remaining } = checkRateLimit(key, { maxRequests: 100, windowMs: 60000 })
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": "100",
              "X-RateLimit-Remaining": String(remaining),
              "Retry-After": "60",
            },
          },
        )
      }
    }

    const result = await fn()
    if (result === undefined || result === null) {
      return new NextResponse(null, { status: 204 })
    }
    if (result instanceof Response) {
      return result as unknown as NextResponse
    }
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    logger.error({ err: error }, "API Error")
    Sentry.captureException(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export function notFound(entity = "Resource") {
  return NextResponse.json({ error: `${entity} not found` }, { status: 404 })
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export function conflict(error: string) {
  return NextResponse.json({ error }, { status: 409 })
}

export function created(body: unknown) {
  return NextResponse.json(body, { status: 201 })
}

export const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}
