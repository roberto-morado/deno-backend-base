import { Hono } from "hono";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { jsonMiddleware } from "./middlewares/json.middleware.ts";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware.ts";
import { securityHeadersMiddleware } from "./middlewares/security-headers.middleware.ts";
import { corsMiddleware } from "./middlewares/cors.middleware.ts";

export function initializeHTTPMiddlewares(app: Hono) {
  // Error handling
  app.onError(errorMiddleware);

  // Security headers - apply to all routes
  app.use(securityHeadersMiddleware);

  // CORS - apply to all routes
  app.use(corsMiddleware);

  // Global rate limiting - apply to all routes
  app.use(rateLimitMiddleware);

  // JSON validation - apply to all routes
  app.use(jsonMiddleware);
}
