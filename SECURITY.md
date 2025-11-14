# Security Documentation

This document outlines the security features implemented in this application and best practices for deployment.

## 🛡️ Security Features

### 1. Password Security

- **Bcrypt Hashing**: Passwords are hashed using bcrypt with 12 rounds (cost factor)
- **Never Stored Plain Text**: Passwords are never stored in plain text
- **Secure Verification**: Password verification uses constant-time comparison
- **Implementation**: `utils/password.ts`

```typescript
// Passwords are automatically hashed before storage
await hashPassword(plainPassword); // Returns bcrypt hash
await verifyPassword(plainPassword, hashedPassword); // Returns boolean
```

### 2. Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication using HS512 algorithm
- **Token Expiration**: Tokens expire after 24 hours by default (configurable)
- **Role-Based Access Control (RBAC)**: Admin and user roles
- **Protected Routes**: Middleware for authentication and authorization
- **Implementation**: `utils/jwt.ts`, `5-http/middlewares/auth.middleware.ts`

#### Using Authentication Middleware

```typescript
// Require authentication
app.get("/protected", authMiddleware, handler);

// Require specific role
app.delete("/admin-only", authMiddleware, requireAdmin, handler);

// Custom role requirement
app.patch("/resource", authMiddleware, requireRole("admin", "user"), handler);
```

### 3. Rate Limiting

- **Global Rate Limit**: 100 requests per 15 minutes per IP per endpoint
- **Strict Rate Limit**: 5 requests per 15 minutes for sensitive operations (e.g., login)
- **Headers**: Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **429 Status**: Returns 429 Too Many Requests when limit exceeded
- **Implementation**: `5-http/middlewares/rate-limit.middleware.ts`

#### Rate Limit Configuration

```typescript
// Use strict rate limiting for login
app.post("/auth/login", strictRateLimitMiddleware, loginController);

// Create custom rate limiter
const customLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50,
});
```

### 4. CORS Protection

- **Origin Whitelist**: Only allows requests from configured origins
- **Credentials Support**: Can be enabled for cookie-based auth
- **Preflight Handling**: Proper OPTIONS request handling
- **Configuration**: Via `ALLOWED_ORIGINS` environment variable
- **Implementation**: `5-http/middlewares/cors.middleware.ts`

#### CORS Configuration

```bash
# Single origin
ALLOWED_ORIGINS=https://example.com

# Multiple origins (comma-separated)
ALLOWED_ORIGINS=https://example.com,https://app.example.com

# Development (default)
ALLOWED_ORIGINS=http://localhost:8000
```

### 5. Security Headers

Implements security headers similar to helmet.js:

- **Content-Security-Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking (DENY)
- **X-Content-Type-Options**: Prevents MIME sniffing (nosniff)
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **X-XSS-Protection**: Legacy XSS protection for older browsers
- **X-DNS-Prefetch-Control**: Controls DNS prefetching
- **X-Download-Options**: Prevents IE from executing downloads
- **Strict-Transport-Security**: Enforces HTTPS (commented out by default)

**Implementation**: `5-http/middlewares/security-headers.middleware.ts`

### 6. Input Validation

- **Zod Schema Validation**: All inputs validated against schemas
- **Type Safety**: TypeScript + Zod ensures type safety
- **Validation Errors**: Returns 400 with detailed error messages
- **Implementation**: `2-validations/`

### 7. Error Handling

- **No Information Leakage**: Generic error messages in production
- **Detailed Errors**: Detailed errors in development mode
- **Status Codes**: Proper HTTP status codes
- **Logging**: Errors logged for debugging (development only)
- **Implementation**: `5-http/middlewares/error.middleware.ts`

## 🔐 Environment Variables

### Required for Production

```bash
# JWT Secret (REQUIRED - use a strong random string)
JWT_SECRET=your-super-secret-key-min-32-characters

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Admin User (for automatic creation on deploy)
USER_ADMIN=admin@example.com
USER_PASSWORD=SecureAdminPassword123!

# Environment
ENV=production

# Server Configuration
HOST_NAME=0.0.0.0
PORT=8000
```

### Generating a Secure JWT Secret

```bash
# Generate a secure random secret
deno eval "console.log(crypto.randomUUID() + crypto.randomUUID())"
```

## 🚀 Deployment Security Checklist

### Before Deploying to Production

- [ ] Set a strong, unique `JWT_SECRET` (minimum 32 characters)
- [ ] Configure `ALLOWED_ORIGINS` to your actual domain(s)
- [ ] Set `ENV=production` to disable verbose error messages
- [ ] Enable HTTPS and uncomment `Strict-Transport-Security` header
- [ ] Review and adjust rate limits based on your needs
- [ ] Set up monitoring and alerting for security events
- [ ] Implement logging for security-related events
- [ ] Consider adding request signing for sensitive operations
- [ ] Set up database backups for Deno KV
- [ ] Review and test authentication flows
- [ ] Implement email verification for new user registrations
- [ ] Add password reset functionality with secure tokens
- [ ] Consider implementing 2FA for admin accounts
- [ ] Review CSP policy and adjust for your frontend needs

## 🔍 Security Best Practices

### For Developers

1. **Never commit secrets**: Use environment variables
2. **Keep dependencies updated**: Regularly update Deno and dependencies
3. **Review code changes**: Security-sensitive changes require extra review
4. **Test authentication**: Write tests for auth flows
5. **Validate all inputs**: Never trust user input
6. **Use HTTPS**: Always use HTTPS in production
7. **Log security events**: Log failed auth attempts, rate limit hits, etc.
8. **Principle of least privilege**: Grant minimal permissions needed

### For API Consumers

1. **Store tokens securely**: Never expose JWT tokens in URLs or logs
2. **Use HTTPS only**: Never send tokens over unencrypted connections
3. **Handle token expiration**: Implement token refresh logic
4. **Respect rate limits**: Implement backoff strategies
5. **Validate responses**: Always validate API responses

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security concerns to the repository maintainer
3. Include detailed steps to reproduce the issue
4. Allow reasonable time for a fix before public disclosure

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [Deno Security](https://deno.land/manual/getting_started/permissions)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🔄 Security Updates

This section will track security-related updates and patches.

### Version History

- **Latest**: Added comprehensive security features (password hashing, JWT auth, rate limiting, CORS, security headers)
