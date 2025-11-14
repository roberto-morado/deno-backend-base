/**
 * Authentication controllers
 * Handles login and authentication endpoints
 */

import { Context } from "hono";
import { sendJson } from "@dest/http/responses.ts";
import { login } from "../../4-use-cases/auth.usecase.ts";
import { z } from "zod";
import { validateZodSchema } from "../../2-validations/mod.ts";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Login controller
 * Authenticates user and returns JWT token
 */
export async function loginController(ctx: Context): Promise<Response> {
  const body = await ctx.req.json();
  const credentials = validateZodSchema(body, LoginSchema);

  const result = await login(credentials);

  return sendJson(result);
}

/**
 * Get current user controller
 * Returns information about the authenticated user
 */
export async function getCurrentUserController(ctx: Context): Promise<Response> {
  const user = ctx.get("user");

  if (!user) {
    return sendJson({ message: "Not authenticated" }, { status: 401 });
  }

  return sendJson(user);
}
