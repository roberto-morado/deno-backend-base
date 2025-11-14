import { Hono } from "hono";
import { Home } from "./pages/Home.tsx";

export function initializeFrontendRoutes() {
  const frontend = new Hono();

  frontend.get("/", (c) => {
    return c.html(<Home />);
  });

  return frontend;
}
