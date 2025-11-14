# User Management CLI

A command-line interface for managing users in the Deno backend application.

## Features

- 🎨 Colorful, interactive terminal UI
- 📝 Full CRUD operations (Create, Read, Update, Delete)
- 🔍 Search by ID or email
- ⚡ Both interactive and non-interactive modes
- 🛡️ Input validation and error handling

## Usage

### Interactive Mode (Recommended)

Run the CLI tool in interactive mode with a menu:

```bash
deno task users
```

This will display a menu with the following options:
1. Create User
2. Get User by ID
3. Get User by Email
4. Update User
5. Delete User
6. Exit

### Non-Interactive Mode (Scripting)

You can also use the CLI in non-interactive mode for scripting purposes:

#### Create a user
```bash
deno task users --action=create \
  --firstName="John" \
  --lastName="Doe" \
  --email="john@example.com" \
  --identifier="john123" \
  --password="securePass123"
```

#### Get user by ID
```bash
deno task users --action=get --id="user-uuid-here"
```

#### Get user by email
```bash
deno task users --action=get --email="john@example.com"
```

#### Delete user
```bash
deno task users --action=delete --id="user-uuid-here"
```

## Environment Variables

- `API_URL` - Base URL for the API (default: `http://127.0.0.1:8000`)

Example:
```bash
API_URL=https://your-api.deno.dev deno task users
```

## Examples

### Interactive Mode Session
```bash
$ deno task users

==================================================
  User Management CLI
==================================================

Available Commands:
  1. Create User
  2. Get User by ID
  3. Get User by Email
  4. Update User
  5. Delete User
  6. Exit

Select an option (1-6): 1

==================================================
  Create New User
==================================================

First Name: Alice
Last Name: Johnson
Email: alice@example.com
Identifier: alice001
Password: mySecurePass123

✓ User created successfully!

User Details:
  ID: 550e8400-e29b-41d4-a716-446655440000
  Name: Alice Johnson
  Email: alice@example.com
  Identifier: alice001
```

### Scripting Example
```bash
#!/bin/bash

# Create multiple users in a batch
users=(
  "John:Doe:john@test.com:john001:pass123"
  "Jane:Smith:jane@test.com:jane001:pass456"
  "Bob:Wilson:bob@test.com:bob001:pass789"
)

for user in "${users[@]}"; do
  IFS=':' read -r firstName lastName email identifier password <<< "$user"

  deno task users --action=create \
    --firstName="$firstName" \
    --lastName="$lastName" \
    --email="$email" \
    --identifier="$identifier" \
    --password="$password"
done
```

## Error Handling

The CLI provides clear error messages for common issues:
- Missing required fields
- Invalid user IDs
- Network errors
- API errors (duplicate email/identifier, validation errors, etc.)

## Notes

- The CLI requires the backend server to be running
- All passwords are sent over the network, ensure you're using HTTPS in production
- The `--action=update` is not yet implemented in non-interactive mode (use interactive mode for updates)
