/**
 * In-memory sliding-window rate limiter for Next.js Route Handlers.
 * Zero external dependencies, self-cleaning.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Global cache across route invocations in the same process instance
const rateLimitCache = new Map<string, RateLimitRecord>()

// Periodically clean up expired entries every 5 minutes to prevent memory leaks
let lastCleanup = Date.now()
function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < 5 * 60 * 1000) return
  lastCleanup = now

  rateLimitCache.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitCache.delete(key)
    }
  })
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the time window */
  limit?: number
  /** Duration of the sliding window in seconds (default: 60s) */
  windowSeconds?: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetInSeconds: number
}

/**
 * Check and record a rate limit hit for a given identifier (e.g. IP address, email, or composite key).
 * 
 * @param key Unique key to identify the rate limit bucket (e.g. `login:${ip}`)
 * @param options Rate limit configuration
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  cleanupExpired()

  const limit = options.limit ?? 10
  const windowMs = (options.windowSeconds ?? 60) * 1000
  const now = Date.now()

  const record = rateLimitCache.get(key)

  if (!record || now > record.resetTime) {
    rateLimitCache.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    }
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
  }
}

/**
 * Extract client IP from standard reverse-proxy headers or fallback.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  const cfConnectingIp = req.headers.get("cf-connecting-ip")
  if (cfConnectingIp) return cfConnectingIp.trim()

  return "127.0.0.1"
}
