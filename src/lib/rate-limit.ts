const stores = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { maxRequests: 100, windowMs: 60000 },
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = stores.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + options.windowMs
    stores.set(key, { count: 0, resetAt })
  }

  const current = stores.get(key)!
  current.count++

  return {
    allowed: current.count <= options.maxRequests,
    remaining: Math.max(0, options.maxRequests - current.count),
    resetAt: current.resetAt,
  }
}

export function resetRateLimit(key: string) {
  stores.delete(key)
}
