/**
 * JWT utilities for authentication
 * Provides functions to create and verify JWT tokens
 */

import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "your-secret-key-change-in-production";
const JWT_ALGORITHM = "HS512" as const;

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

/**
 * Create a JWT token for a user
 * @param payload User information to include in the token
 * @param expiresInHours Token expiration time in hours (default: 24 hours)
 * @returns JWT token string
 */
export async function createToken(
  payload: Omit<JWTPayload, "exp">,
  expiresInHours: number = 24,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );

  const jwt = await create(
    { alg: JWT_ALGORITHM, typ: "JWT" },
    {
      ...payload,
      exp: getNumericDate(expiresInHours * 3600), // Convert hours to seconds
    },
    key,
  );

  return jwt;
}

/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["verify"],
    );

    const payload = await verify(token, key);
    return payload as JWTPayload;
  } catch (_error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
