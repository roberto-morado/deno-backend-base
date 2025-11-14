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

export async function createUserController(req: Request): Promise<Response> {
  const body = await req.json();
  const newUser = validateZodSchema(body, UserSchema);
  const createdUser = await createUser(newUser);

  return sendJson({ ...createdUser, password: undefined });
}

export async function getUserByIdController(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const userId = url.pathname.split("/").pop();

  if (!userId) {
    return sendJson({ message: "User ID is required" }, 400);
  }

  const user = await getUserById(userId);
  return sendJson(user);
}

export async function getUserByEmailController(
  req: Request,
): Promise<Response> {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return sendJson({ message: "Email is required" }, 400);
  }

  const user = await getUserByEmail(email);
  return sendJson(user);
}

export async function getUserByIdentifierController(
  req: Request,
): Promise<Response> {
  const url = new URL(req.url);
  const identifier = url.searchParams.get("identifier");

  if (!identifier) {
    return sendJson({ message: "Identifier is required" }, 400);
  }

  const user = await getUserByIdentifier(identifier);
  return sendJson(user);
}

export async function updateUserController(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const userId = url.pathname.split("/").pop();

  if (!userId) {
    return sendJson({ message: "User ID is required" }, 400);
  }

  const body = await req.json();
  const updatedUser = await updateUser(userId, body);

  return sendJson({ ...updatedUser, password: undefined });
}

export async function deleteUserController(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const userId = url.pathname.split("/").pop();

  if (!userId) {
    return sendJson({ message: "User ID is required" }, 400);
  }

  await deleteUser(userId);
  return sendJson({ message: "User deleted successfully" });
}
