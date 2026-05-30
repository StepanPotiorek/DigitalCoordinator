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

export function rateLimitHeaders(
  key: string,
  options?: RateLimitOptions,
): Record<string, string> {
  const result = checkRateLimit(key, options)
  return {
    "X-RateLimit-Limit": String(options?.maxRequests ?? 100),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}

export function resetRateLimit(key: string) {
  stores.delete(key)
}

export function withRateLimit<T>(
  key: string,
  options: RateLimitOptions,
  fn: () => Promise<T>,
  onLimit: () => Promise<{ error: string; status: number }>,
): Promise<T | { error: string; status: number }> {
  const { allowed } = checkRateLimit(key, options)
  if (!allowed) return onLimit()
  return fn()
}
