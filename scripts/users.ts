import { parseArgs } from "@std/cli/parse-args";

const API_BASE_URL = Deno.env.get("API_URL") || "http://127.0.0.1:8000";

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function printHeader(title: string) {
  console.log("\n" + colorize("=".repeat(50), "cyan"));
  console.log(colorize(`  ${title}`, "bright"));
  console.log(colorize("=".repeat(50), "cyan") + "\n");
}

function printSuccess(message: string) {
  console.log(colorize("✓ " + message, "green"));
}

function printError(message: string) {
  console.error(colorize("✗ " + message, "red"));
}

function printInfo(message: string) {
  console.log(colorize("ℹ " + message, "blue"));
}

async function prompt(message: string): Promise<string> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(colorize(message + ": ", "yellow")));
  const n = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n ?? 0)).trim();
}

async function createUser() {
  printHeader("Create New User");

  const firstName = await prompt("First Name");
  const lastName = await prompt("Last Name");
  const email = await prompt("Email");
  const identifier = await prompt("Identifier");
  const password = await prompt("Password");

  if (!firstName || !lastName || !email || !identifier || !password) {
    printError("All fields are required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, identifier, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      printError(`Failed to create user: ${error.message || "Unknown error"}`);
      return;
    }

    const user = await response.json();
    printSuccess("User created successfully!");
    console.log(colorize("\nUser Details:", "bright"));
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Identifier: ${user.identifier}`);
  } catch (error) {
    printError(`Failed to create user: ${error.message}`);
  }
}

async function getUserById() {
  printHeader("Get User by ID");

  const id = await prompt("User ID");

  if (!id) {
    printError("User ID is required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);

    if (!response.ok) {
      const error = await response.json();
      printError(`Failed to fetch user: ${error.message || "Not found"}`);
      return;
    }

    const user = await response.json();
    printSuccess("User found!");
    console.log(colorize("\nUser Details:", "bright"));
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Identifier: ${user.identifier}`);
  } catch (error) {
    printError(`Failed to fetch user: ${error.message}`);
  }
}

async function getUserByEmail() {
  printHeader("Get User by Email");

  const email = await prompt("Email");

  if (!email) {
    printError("Email is required");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      const error = await response.json();
      printError(`Failed to fetch user: ${error.message || "Not found"}`);
      return;
    }

    const user = await response.json();
    printSuccess("User found!");
    console.log(colorize("\nUser Details:", "bright"));
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Identifier: ${user.identifier}`);
  } catch (error) {
    printError(`Failed to fetch user: ${error.message}`);
  }
}

async function updateUser() {
  printHeader("Update User");

  const id = await prompt("User ID");

  if (!id) {
    printError("User ID is required");
    return;
  }

  console.log(colorize("\nEnter new values (press Enter to skip):", "blue"));
  const firstName = await prompt("First Name");
  const lastName = await prompt("Last Name");
  const email = await prompt("Email");
  const identifier = await prompt("Identifier");

  const updateData: Record<string, string> = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (email) updateData.email = email;
  if (identifier) updateData.identifier = identifier;

  if (Object.keys(updateData).length === 0) {
    printInfo("No updates provided");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      printError(`Failed to update user: ${error.message || "Unknown error"}`);
      return;
    }

    const user = await response.json();
    printSuccess("User updated successfully!");
    console.log(colorize("\nUpdated User Details:", "bright"));
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.firstName} ${user.lastName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Identifier: ${user.identifier}`);
  } catch (error) {
    printError(`Failed to update user: ${error.message}`);
  }
}

async function deleteUser() {
  printHeader("Delete User");

  const id = await prompt("User ID");

  if (!id) {
    printError("User ID is required");
    return;
  }

  const confirm = await prompt(`Are you sure you want to delete user ${id}? (yes/no)`);

  if (confirm.toLowerCase() !== "yes") {
    printInfo("Deletion cancelled");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      printError(`Failed to delete user: ${error.message || "Unknown error"}`);
      return;
    }

    printSuccess("User deleted successfully!");
  } catch (error) {
    printError(`Failed to delete user: ${error.message}`);
  }
}

async function showMenu() {
  printHeader("User Management CLI");

  console.log(colorize("Available Commands:", "bright"));
  console.log("  1. Create User");
  console.log("  2. Get User by ID");
  console.log("  3. Get User by Email");
  console.log("  4. Update User");
  console.log("  5. Delete User");
  console.log("  6. Exit\n");

  const choice = await prompt("Select an option (1-6)");

  switch (choice) {
    case "1":
      await createUser();
      break;
    case "2":
      await getUserById();
      break;
    case "3":
      await getUserByEmail();
      break;
    case "4":
      await updateUser();
      break;
    case "5":
      await deleteUser();
      break;
    case "6":
      console.log(colorize("\n👋 Goodbye!\n", "cyan"));
      Deno.exit(0);
    default:
      printError("Invalid option");
  }

  console.log("\n");
  await showMenu();
}

async function main() {
  const args = parseArgs(Deno.args, {
    string: ["action", "id", "email", "firstName", "lastName", "identifier", "password"],
    alias: {
      a: "action",
      i: "id",
      e: "email",
    },
  });

  if (args.action) {
    switch (args.action) {
      case "create":
        if (!args.firstName || !args.lastName || !args.email || !args.identifier || !args.password) {
          printError("Missing required fields for create: firstName, lastName, email, identifier, password");
          Deno.exit(1);
        }
        await fetch(`${API_BASE_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            identifier: args.identifier,
            password: args.password,
          }),
        }).then((res) => res.json()).then((user) => {
          printSuccess("User created!");
          console.log(JSON.stringify(user, null, 2));
        }).catch((error) => {
          printError(`Failed: ${error.message}`);
          Deno.exit(1);
        });
        break;
      case "get":
        if (args.id) {
          await fetch(`${API_BASE_URL}/user/${args.id}`)
            .then((res) => res.json())
            .then((user) => console.log(JSON.stringify(user, null, 2)))
            .catch((error) => {
              printError(`Failed: ${error.message}`);
              Deno.exit(1);
            });
        } else if (args.email) {
          await fetch(`${API_BASE_URL}/user?email=${encodeURIComponent(args.email)}`)
            .then((res) => res.json())
            .then((user) => console.log(JSON.stringify(user, null, 2)))
            .catch((error) => {
              printError(`Failed: ${error.message}`);
              Deno.exit(1);
            });
        } else {
          printError("Either --id or --email is required for get action");
          Deno.exit(1);
        }
        break;
      case "delete":
        if (!args.id) {
          printError("--id is required for delete action");
          Deno.exit(1);
        }
        await fetch(`${API_BASE_URL}/user/${args.id}`, { method: "DELETE" })
          .then(() => printSuccess("User deleted!"))
          .catch((error) => {
            printError(`Failed: ${error.message}`);
            Deno.exit(1);
          });
        break;
      default:
        printError(`Unknown action: ${args.action}`);
        Deno.exit(1);
    }
  } else {
    await showMenu();
  }
}

if (import.meta.main) {
  main();
}
