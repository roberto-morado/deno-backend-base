# Admin User Setup

This directory contains setup scripts that run automatically when the application starts.

## Auto Admin User Creation

The `admin.ts` script automatically creates an admin user on deployment when the appropriate environment variables are configured.

### How It Works

1. **On Application Startup**: The `setupAdminUser()` function is called after context initialization
2. **Environment Check**: Looks for `USER_ADMIN` and `USER_PASSWORD` environment variables
3. **Conditional Creation**:
   - If variables are **not set**: Setup is skipped (no admin user created)
   - If variables are **set** and user **doesn't exist**: Admin user is created
   - If variables are **set** and user **already exists**: Creation is skipped

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `USER_ADMIN` | Email address for the admin user | Yes | `admin@example.com` |
| `USER_PASSWORD` | Password for the admin user | Yes | `SecureP@ssw0rd!` |

### Configuration

#### Local Development

Create a `.env` file in the project root:

```bash
USER_ADMIN=admin@example.com
USER_PASSWORD=your-secure-password
```

Then start the server:
```bash
deno task start
```

#### Deno Deploy

1. Go to your Deno Deploy project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `USER_ADMIN`: Your admin email
   - `USER_PASSWORD`: Your admin password
4. Deploy or redeploy your application

The admin user will be created automatically on the first deployment.

### Admin User Properties

The auto-created admin user has the following characteristics:

- **First Name**: "Admin"
- **Last Name**: "User"
- **Identifier**: "admin"
- **Email**: Value from `USER_ADMIN` environment variable
- **Password**: Value from `USER_PASSWORD` environment variable
- **Role**: "admin" (only admin user in the system)

### User Roles

The system supports two roles:

1. **admin**: Full administrative access (only one admin user)
2. **user**: Regular user access (default for all API-created users)

All users created through the API endpoints automatically receive the "user" role.

### Security Considerations

⚠️ **Important Security Notes**:

1. **Use Strong Passwords**: Always use complex, unique passwords for the admin account
2. **Secure Storage**: Never commit `.env` files to version control
3. **Production**: Use Deno Deploy's environment variable management for production
4. **Rotation**: Periodically update the admin password
5. **HTTPS**: Always use HTTPS in production to protect credentials in transit

### Logs

The setup process provides clear console output:

**When admin is created:**
```
✓ Admin user created successfully: admin@example.com
```

**When admin already exists:**
```
✓ Admin user already exists, skipping creation
```

**When environment variables are not set:**
```
ℹ️  Admin user setup skipped: USER_ADMIN or USER_PASSWORD not configured
```

**On error:**
```
✗ Failed to create admin user: [error message]
```

### Verification

After deployment, verify the admin user was created:

```bash
# Using the CLI tool
deno task users

# Select option 3: Get User by Email
# Enter the email from USER_ADMIN
```

Or via API:
```bash
curl "https://your-app.deno.dev/user?email=admin@example.com"
```

### Troubleshooting

**Admin user not created:**
- Verify environment variables are set correctly
- Check application logs for error messages
- Ensure `USER_ADMIN` is a valid email format
- Ensure `USER_PASSWORD` meets minimum length requirement (8 characters)

**"User already exists" but can't login:**
- The email might be registered with a different password
- Check if another user was created with that email before admin setup
- You may need to delete the existing user first (use CLI tool)

### Future Enhancements

Potential additions to this setup system:

- Password hashing/encryption
- Initial database seeding
- Multiple admin users with different permissions
- Setup wizard for first-time deployment
- Admin role assignment via CLI
