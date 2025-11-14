import { Context, Hono } from "hono";
import {
  createUserController,
  deleteUserController,
  getUserByEmailController,
  getUserByIdController,
  getUserByIdentifierController,
  updateUserController,
} from "./controllers/user.controller.ts";

type ControllerType = (req: Request) => Promise<Response> | Response;

function handleRoute(controller: ControllerType) {
  return (ctx: Context) => {
    return controller(ctx.req.raw);
  };
}

export function initializeHTTPRoutes(app: Hono) {
  app.post("/user", handleRoute(createUserController));
  app.get("/user/:id", handleRoute(getUserByIdController));
  app.get("/user", handleRoute(getUserByEmailController));
  app.get("/user-by-identifier", handleRoute(getUserByIdentifierController));
  app.patch("/user/:id", handleRoute(updateUserController));
  app.delete("/user/:id", handleRoute(deleteUserController));
}
