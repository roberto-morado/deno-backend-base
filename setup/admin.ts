import { context } from "@utils/context.ts";
import type { UserRepository } from "../3-repositories/user.repository.ts";

const ADMIN_EMAIL_ENV = "USER_ADMIN";
const ADMIN_PASSWORD_ENV = "USER_PASSWORD";

export async function setupAdminUser(): Promise<void> {
  const adminEmail = Deno.env.get(ADMIN_EMAIL_ENV);
  const adminPassword = Deno.env.get(ADMIN_PASSWORD_ENV);

  if (!adminEmail || !adminPassword) {
    console.log(
      "ℹ️  Admin user setup skipped: USER_ADMIN or USER_PASSWORD not configured",
    );
    return;
  }

  try {
    const userRepository = context.get("user-repository") as UserRepository;

    const existingAdmin = await userRepository.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log("✓ Admin user already exists, skipping creation");
      return;
    }

    const adminUser = await userRepository.create({
      firstName: "Admin",
      lastName: "User",
      identifier: "admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`✓ Admin user created successfully: ${adminUser.email}`);
  } catch (error) {
    console.error(`✗ Failed to create admin user: ${error.message}`);
    throw error;
  }
}
