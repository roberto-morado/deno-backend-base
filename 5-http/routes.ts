import { Context, Hono } from "hono";
import {
  createUserController,
  deleteUserController,
  getUserByEmailController,
  getUserByIdController,
  getUserByIdentifierController,
  updateUserController,
} from "./controllers/user.controller.ts";
import {
  loginController,
  getCurrentUserController,
} from "./controllers/auth.controller.ts";
import { authMiddleware, requireAdmin } from "./middlewares/auth.middleware.ts";
import { strictRateLimitMiddleware } from "./middlewares/rate-limit.middleware.ts";

type ControllerType = (ctx: Context) => Promise<Response> | Response;

function handleRoute(controller: ControllerType) {
  return (ctx: Context) => {
    return controller(ctx);
  };
}

export function initializeHTTPRoutes(app: Hono) {
  // ==================== Public Authentication Routes ====================
  // Login endpoint - Strict rate limiting to prevent brute force attacks
  app.post("/auth/login", strictRateLimitMiddleware, handleRoute(loginController));

  // ==================== Protected Routes (Require Authentication) ====================
  // Get current authenticated user
  app.get("/auth/me", authMiddleware, handleRoute(getCurrentUserController));

  // ==================== User Management Routes ====================
  // Note: Consider protecting these routes based on your requirements:
  // - POST /user - Currently public for registration, could require admin
  // - GET routes - Could require authentication
  // - PATCH/DELETE - Should require authentication + ownership check or admin

  // Public user registration (consider adding email verification in production)
  app.post("/user", handleRoute(createUserController));

  // User read operations - consider protecting with authMiddleware
  app.get("/user/:id", handleRoute(getUserByIdController));
  app.get("/user", handleRoute(getUserByEmailController));
  app.get("/user-by-identifier", handleRoute(getUserByIdentifierController));

  // User update operations - consider protecting with authMiddleware
  app.patch("/user/:id", handleRoute(updateUserController));

  // User delete operations - consider protecting with authMiddleware + requireAdmin
  app.delete("/user/:id", handleRoute(deleteUserController));
}
