import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.tsx";

export const Home: FC = () => {
  return (
    <Layout title="Deno Backend - Home">
      <h1>🦕 Deno Backend API</h1>
      <p>
        <span class="badge">Deno</span>
        <span class="badge">Hono</span>
        <span class="badge">Deno KV</span>
        <span class="badge">TypeScript</span>
      </p>
      <p>
        Welcome to your Deno-powered backend API. This service provides a complete
        user management system with CRUD operations, JWT authentication, and
        enterprise-grade security features, built with native Deno KV for
        zero-dependency data persistence.
      </p>

      <div class="endpoints">
        <h2>🔐 Authentication Endpoints</h2>

        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/auth/login</span>
          <span class="description">Login and receive JWT token</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/auth/me</span>
          <span class="description">Get current authenticated user (requires token)</span>
        </div>
      </div>

      <div class="endpoints">
        <h2>👥 User Management Endpoints</h2>

        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/user</span>
          <span class="description">Create new user (registration)</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user/:id</span>
          <span class="description">Get user by ID</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user?email=...</span>
          <span class="description">Get user by email</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user-by-identifier?identifier=...</span>
          <span class="description">Get user by identifier</span>
        </div>

        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <span class="path">/user/:id</span>
          <span class="description">Update user information</span>
        </div>

        <div class="endpoint">
          <span class="method delete">DELETE</span>
          <span class="path">/user/:id</span>
          <span class="description">Delete user</span>
        </div>
      </div>

      <div class="endpoints">
        <h2>🛡️ Security Features</h2>
        <ul>
          <li>✅ <strong>Password Hashing</strong> - Bcrypt with 12 rounds</li>
          <li>✅ <strong>JWT Authentication</strong> - Secure token-based auth</li>
          <li>✅ <strong>Rate Limiting</strong> - 100 req/15min (5 req/15min for login)</li>
          <li>✅ <strong>CORS Protection</strong> - Configurable origin whitelist</li>
          <li>✅ <strong>Security Headers</strong> - CSP, X-Frame-Options, and more</li>
          <li>✅ <strong>Input Validation</strong> - Zod schema validation</li>
          <li>✅ <strong>Role-Based Access</strong> - Admin and user roles</li>
        </ul>
      </div>

      <div class="footer">
        <p>💡 Use the CLI tool to manage users: <code>deno task users</code></p>
        <p>🔑 Set <code>JWT_SECRET</code> environment variable for production</p>
        <p>Built with Clean Architecture principles and SOLID design patterns</p>
      </div>
    </Layout>
  );
};
