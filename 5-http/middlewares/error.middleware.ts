import { Context } from "hono";
import { sendJson } from "@dest/http/responses.ts";
import { HttpError } from "@dest/errors/http.error.ts";
import { ValidationError } from "@dest/errors/validation.error.ts";

export function errorMiddleware(error: Error, ctx: Context) {
  // Handle HTTP errors (including rate limiting 429)
  if (error instanceof HttpError) {
    return sendJson({ message: error.message }, { status: error.status });
  }

  // Handle validation errors
  if (error instanceof ValidationError) {
    return sendJson(
      { message: "Validation Error", cause: error.cause },
      { status: 400 },
    );
  }

  // Log unexpected errors in development
  if (Deno.env.get("ENV") !== "production") {
    console.error("Unexpected error:", error);
  }

  // Generic error response (don't leak error details in production)
  return sendJson(
    { message: "Internal server error" },
    { status: 500 },
  );
}
