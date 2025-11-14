/**
 * Rate limiting middleware
 * Implements a sliding window rate limiter using in-memory storage
 * For production with multiple instances, consider using KV storage
 */

import { createMiddleware } from "hono/factory";
import { HttpError } from "@dest/errors/http.error.ts";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting
// For distributed systems, this should use Deno KV or similar
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Create a rate limiting middleware
 * @param config Rate limit configuration
 * @returns Middleware function
 */
export function createRateLimiter(config: RateLimitConfig) {
  return createMiddleware(async (ctx, next) => {
    // Get client identifier (IP address or user ID if authenticated)
    const clientIp = ctx.req.header("x-forwarded-for") ||
      ctx.req.header("x-real-ip") ||
      "unknown";

    const identifier = `${clientIp}:${ctx.req.path}`;
    const now = Date.now();

    let record = rateLimitStore.get(identifier);

    // If no record exists or window has expired, create new record
    if (!record || record.resetTime < now) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(identifier, record);
    }

    // Increment request count
    record.count++;

    // Check if limit exceeded
    if (record.count > config.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);

      // Set rate limit headers
      ctx.header("X-RateLimit-Limit", config.maxRequests.toString());
      ctx.header("X-RateLimit-Remaining", "0");
      ctx.header("X-RateLimit-Reset", record.resetTime.toString());
      ctx.header("Retry-After", retryAfter.toString());

      throw new HttpError("Too many requests, please try again later", 429);
    }

    // Set rate limit headers
    const remaining = config.maxRequests - record.count;
    ctx.header("X-RateLimit-Limit", config.maxRequests.toString());
    ctx.header("X-RateLimit-Remaining", remaining.toString());
    ctx.header("X-RateLimit-Reset", record.resetTime.toString());

    await next();
  });
}

/**
 * Default rate limiter: 100 requests per 15 minutes per IP per endpoint
 */
export const rateLimitMiddleware = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

/**
 * Strict rate limiter for sensitive operations: 5 requests per 15 minutes
 */
export const strictRateLimitMiddleware = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});
