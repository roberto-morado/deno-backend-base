/**
 * Authentication middleware
 * Validates JWT tokens and protects routes
 */

import { createMiddleware } from "hono/factory";
import { HttpError } from "@dest/errors/http.error.ts";
import { extractBearerToken, verifyToken } from "../../utils/jwt.ts";
import type { UserRole } from "../../1-entities/user.entity.ts";

/**
 * Extend Hono's Context to include user information
 */
declare module "hono" {
  interface ContextVariableMap {
    user: {
      userId: string;
      email: string;
      role: UserRole;
    };
  }
}

/**
 * Authentication middleware
 * Validates JWT token and attaches user info to context
 */
export const authMiddleware = createMiddleware(async (ctx, next) => {
  const authHeader = ctx.req.header("Authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    throw new HttpError("Missing authentication token", 401);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new HttpError("Invalid or expired token", 401);
  }

  // Attach user info to context
  ctx.set("user", {
    userId: payload.userId,
    email: payload.email,
    role: payload.role as UserRole,
  });

  await next();
});

/**
 * Role-based authorization middleware
 * Requires user to have one of the specified roles
 */
export function requireRole(...roles: UserRole[]) {
  return createMiddleware(async (ctx, next) => {
    const user = ctx.get("user");

    if (!user) {
      throw new HttpError("Authentication required", 401);
    }

    if (!roles.includes(user.role)) {
      throw new HttpError("Insufficient permissions", 403);
    }

    await next();
  });
}

/**
 * Admin-only middleware
 * Shortcut for requiring admin role
 */
export const requireAdmin = requireRole("admin");
