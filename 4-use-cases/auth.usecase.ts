/**
 * Authentication use cases
 * Handles user login and authentication logic
 */

import { context } from "../utils/context.ts";
import { UserRepository } from "../3-repositories/user.repository.ts";
import { verifyPassword } from "../utils/password.ts";
import { createToken } from "../utils/jwt.ts";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Authenticate user and return JWT token
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const userRepository = context.get("user-repository") as UserRepository;

  // Find user by email - we need to access the password
  // Since the repository returns users without passwords, we need to access the KV directly
  // For now, we'll need to add a method to get the full user with password
  const kvClient = context.get("kv-client") as Deno.Kv;

  // First, get the user ID from email index
  const userIdEntry = await kvClient.get<string>(["users_by_email", credentials.email]);

  if (!userIdEntry.value) {
    throw new Error("Invalid email or password");
  }

  // Get the full user with password
  const userEntry = await kvClient.get<{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    identifier: string;
    role: string;
  }>(["users", userIdEntry.value]);

  if (!userEntry.value) {
    throw new Error("Invalid email or password");
  }

  const user = userEntry.value;

  // Verify password
  const isPasswordValid = await verifyPassword(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Create JWT token
  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}
