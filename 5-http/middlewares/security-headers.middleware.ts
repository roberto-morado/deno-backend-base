/**
 * Security headers middleware
 * Implements common security headers similar to helmet.js
 */

import { createMiddleware } from "hono/factory";

/**
 * Security headers middleware that adds common security headers to responses
 * Protects against common vulnerabilities like XSS, clickjacking, etc.
 */
export const securityHeadersMiddleware = createMiddleware(async (ctx, next) => {
  await next();

  // Content Security Policy - Prevents XSS attacks
  // Adjust this policy based on your needs
  ctx.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
  );

  // X-Frame-Options - Prevents clickjacking attacks
  ctx.header("X-Frame-Options", "DENY");

  // X-Content-Type-Options - Prevents MIME type sniffing
  ctx.header("X-Content-Type-Options", "nosniff");

  // Referrer-Policy - Controls how much referrer information is shared
  ctx.header("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions-Policy - Controls which browser features can be used
  ctx.header(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()",
  );

  // X-XSS-Protection - Legacy header for older browsers
  ctx.header("X-XSS-Protection", "1; mode=block");

  // Strict-Transport-Security - Enforces HTTPS (only add if using HTTPS)
  // Uncomment the line below if your app is served over HTTPS
  // ctx.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // X-DNS-Prefetch-Control - Controls DNS prefetching
  ctx.header("X-DNS-Prefetch-Control", "off");

  // X-Download-Options - Prevents IE from executing downloads in site context
  ctx.header("X-Download-Options", "noopen");

  // X-Permitted-Cross-Domain-Policies - Restricts Adobe Flash and PDF cross-domain requests
  ctx.header("X-Permitted-Cross-Domain-Policies", "none");
});
