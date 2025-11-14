import { Context } from "hono";
import { sendJson } from "@dest/http/responses.ts";
import { validateZodSchema } from "../../2-validations/mod.ts";
import { UserSchema } from "../../2-validations/user.validations.ts";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByIdentifier,
  updateUser,
} from "../../4-use-cases/user.usecase.ts";

export async function createUserController(ctx: Context): Promise<Response> {
  const body = await ctx.req.json();
  const newUser = validateZodSchema(body, UserSchema);
  const createdUser = await createUser(newUser);

  return sendJson({ ...createdUser, password: undefined });
}

export async function getUserByIdController(ctx: Context): Promise<Response> {
  const userId = ctx.req.param("id");

  if (!userId) {
    return sendJson({ message: "User ID is required" }, { status: 400 });
  }

  const user = await getUserById(userId);
  return sendJson(user);
}

export async function getUserByEmailController(ctx: Context): Promise<Response> {
  const email = ctx.req.query("email");

  if (!email) {
    return sendJson({ message: "Email is required" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  return sendJson(user);
}

export async function getUserByIdentifierController(
  ctx: Context,
): Promise<Response> {
  const identifier = ctx.req.query("identifier");

  if (!identifier) {
    return sendJson({ message: "Identifier is required" }, { status: 400 });
  }

  const user = await getUserByIdentifier(identifier);
  return sendJson(user);
}

export async function updateUserController(ctx: Context): Promise<Response> {
  const userId = ctx.req.param("id");

  if (!userId) {
    return sendJson({ message: "User ID is required" }, { status: 400 });
  }

  const body = await ctx.req.json();
  const updatedUser = await updateUser(userId, body);

  return sendJson({ ...updatedUser, password: undefined });
}

export async function deleteUserController(ctx: Context): Promise<Response> {
  const userId = ctx.req.param("id");

  if (!userId) {
    return sendJson({ message: "User ID is required" }, { status: 400 });
  }

  await deleteUser(userId);
  return sendJson({ message: "User deleted successfully" });
}
