/**
 * CORS middleware
 * Configures Cross-Origin Resource Sharing for the API
 */

import { createMiddleware } from "hono/factory";

interface CorsConfig {
  origins: string[] | string; // Allowed origins, or "*" for all
  methods?: string[]; // Allowed HTTP methods
  allowedHeaders?: string[]; // Allowed request headers
  exposedHeaders?: string[]; // Headers exposed to the client
  credentials?: boolean; // Allow credentials (cookies, authorization headers)
  maxAge?: number; // Cache preflight requests (in seconds)
}

/**
 * Create CORS middleware with custom configuration
 */
export function createCorsMiddleware(config: CorsConfig) {
  return createMiddleware(async (ctx, next) => {
    const origin = ctx.req.header("Origin");
    const method = ctx.req.method;

    // Check if origin is allowed
    let allowedOrigin = "";
    if (config.origins === "*") {
      allowedOrigin = "*";
    } else if (Array.isArray(config.origins)) {
      if (origin && config.origins.includes(origin)) {
        allowedOrigin = origin;
      }
    } else if (origin === config.origins) {
      allowedOrigin = origin;
    }

    // Set CORS headers if origin is allowed
    if (allowedOrigin) {
      ctx.header("Access-Control-Allow-Origin", allowedOrigin);

      if (config.credentials) {
        ctx.header("Access-Control-Allow-Credentials", "true");
      }

      if (config.exposedHeaders && config.exposedHeaders.length > 0) {
        ctx.header(
          "Access-Control-Expose-Headers",
          config.exposedHeaders.join(", "),
        );
      }
    }

    // Handle preflight requests
    if (method === "OPTIONS") {
      if (allowedOrigin) {
        const allowedMethods = config.methods ||
          ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
        ctx.header("Access-Control-Allow-Methods", allowedMethods.join(", "));

        const allowedHeaders = config.allowedHeaders || [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
        ];
        ctx.header(
          "Access-Control-Allow-Headers",
          allowedHeaders.join(", "),
        );

        const maxAge = config.maxAge || 86400; // 24 hours default
        ctx.header("Access-Control-Max-Age", maxAge.toString());
      }

      return new Response(null, { status: 204 });
    }

    await next();
  });
}

/**
 * Default CORS middleware with secure configuration
 * By default, only allows requests from the same origin
 * Override in production with environment-specific origins
 */
export const corsMiddleware = createCorsMiddleware({
  origins: Deno.env.get("ALLOWED_ORIGINS")?.split(",") || ["http://localhost:8000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  credentials: true,
  maxAge: 86400, // 24 hours
});
