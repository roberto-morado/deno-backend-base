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
        user management system with CRUD operations, built with native Deno KV for
        zero-dependency data persistence.
      </p>

      <div class="endpoints">
        <h2>📡 Available API Endpoints</h2>

        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/user</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user/:id</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user?email=...</span>
        </div>

        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/user-by-identifier?identifier=...</span>
        </div>

        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <span class="path">/user/:id</span>
        </div>

        <div class="endpoint">
          <span class="method delete">DELETE</span>
          <span class="path">/user/:id</span>
        </div>
      </div>

      <div class="footer">
        <p>💡 Use the CLI tool to manage users: <code>deno task users</code></p>
        <p>Built with Clean Architecture principles and SOLID design patterns</p>
      </div>
    </Layout>
  );
};
