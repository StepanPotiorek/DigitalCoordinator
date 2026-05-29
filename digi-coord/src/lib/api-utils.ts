import { NextResponse } from "next/server"

export function parseId(id: string): number | null {
  const n = parseInt(id, 10)
  return Number.isNaN(n) || n <= 0 ? null : n
}

type Handler<T> = () => Promise<T>

export async function apiHandler<T>(
  fn: Handler<T>,
): Promise<NextResponse> {
  try {
    const result = await fn()
    if (result === undefined || result === null) {
      return NextResponse.json(null, { status: 204 })
    }
    if (result instanceof Response) {
      return result as unknown as NextResponse
    }
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    console.error("API Error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function apiHandlerRaw<T>(
  fn: Handler<NextResponse>,
): Promise<NextResponse> {
  try {
    return await fn()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    console.error("API Error:", error)
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

export function noContent() {
  return new NextResponse(null, { status: 204 })
}

export const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}
