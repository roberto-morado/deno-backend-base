import { createMiddleware } from "hono/factory";
import { HttpError } from "@dest/errors/http.error.ts";

export const jsonMiddleware = createMiddleware(async (ctx, next) => {
  const method = ctx.req.method;

  // Only check Content-Type for methods that have a request body
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const contentType = ctx.req.header("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new HttpError("Invalid body", 400);
    }
  }

  await next();
});
