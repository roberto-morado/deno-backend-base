# Deployment Guide - Deno Deploy

## Overview

This application is designed to deploy seamlessly to Deno Deploy with zero configuration needed for the database (Deno KV is built-in).

## Prerequisites

1. A [Deno Deploy](https://deno.com/deploy) account
2. Your repository connected to Deno Deploy
3. GitHub Actions enabled (comes with the workflow in `.github/workflows/deploy.yml`)

## Option 1: Automatic Deployment via GitHub Actions (Recommended)

### Setup Steps

1. **Create a Deno Deploy Project**
   - Go to https://dash.deno.com/projects
   - Click "New Project"
   - Choose "Empty Project"
   - Note your project name (e.g., `my-backend-api`)

2. **Get Deno Deploy Access Token**
   - In your Deno Deploy project settings
   - Go to "Settings" → "Access Tokens"
   - Create a new token
   - Copy the token value

3. **Configure GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add a new repository secret:
     - Name: `DENO_DEPLOY_TOKEN`
     - Value: [paste your token]

4. **Update Workflow File**
   - Edit `.github/workflows/deploy.yml`
   - Replace `"your-project-name"` with your actual Deno Deploy project name

5. **Push to Main Branch**
   ```bash
   git push origin main
   ```
   - GitHub Actions will automatically:
     - Run unit tests
     - Run E2E tests
     - Deploy to Deno Deploy (if tests pass)

## Option 2: Manual Deployment via Deno Deploy UI

### Configuration Values

When setting up automatic deployment in Deno Deploy UI:

- **Install Step:** `deno cache main.ts` (optional)
- **Build Step:** Leave empty
- **Root Directory:** `.`
- **Entrypoint:** `main.ts`
- **Include:** Use patterns from `deno.deploy.json`
- **Exclude:** `__tests__/**`, `*.md`, `.github/**`

## Option 3: Deploy from CLI

```bash
# Install deployctl
deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# Deploy
deployctl deploy --project=your-project-name main.ts
```

## Environment Variables

### Required: None!
Your app uses Deno KV which is automatically available on Deno Deploy. No database connection strings or credentials needed.

### Recommended: Admin User Setup
Configure these variables to automatically create an admin user on deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `USER_ADMIN` | Email for admin account | `admin@example.com` |
| `USER_PASSWORD` | Password for admin account | `SecureP@ssw0rd!` |

**Setup Instructions:**
1. Go to your Deno Deploy project dashboard
2. Navigate to Settings → Environment Variables
3. Add `USER_ADMIN` with your desired admin email
4. Add `USER_PASSWORD` with a strong password
5. Deploy or redeploy your application

The admin user will be created automatically on startup. If the user already exists, creation is skipped. See `setup/README.md` for more details.

### Optional Environment Variables
For additional configuration:

1. Go to your Deno Deploy project dashboard
2. Navigate to Settings → Environment Variables
3. Add variables as needed (e.g., `PORT`, `LOG_LEVEL`, etc.)

## Post-Deployment

### Accessing Your API
Your API will be available at:
```
https://your-project-name.deno.dev
```

### Testing Endpoints
```bash
# Create user
curl -X POST https://your-project-name.deno.dev/user \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","identifier":"123","email":"john@test.com","password":"secure123"}'

# Get user by ID
curl https://your-project-name.deno.dev/user/{userId}

# Update user
curl -X PATCH https://your-project-name.deno.dev/user/{userId} \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane"}'

# Delete user
curl -X DELETE https://your-project-name.deno.dev/user/{userId}
```

## Monitoring

- **Logs:** Available in Deno Deploy dashboard under "Logs"
- **Analytics:** View request metrics in the "Analytics" tab
- **KV Usage:** Monitor KV operations in "KV" tab

## Continuous Deployment

The GitHub Action workflow is configured to:
- ✅ Run tests on every PR
- ✅ Run tests on every push to main
- ✅ Deploy only if all tests pass
- ✅ Deploy only on main branch pushes (not PRs)

## Rollback

If you need to rollback:
1. Go to Deno Deploy dashboard
2. Navigate to "Deployments"
3. Find a previous successful deployment
4. Click "Promote to Production"

## Troubleshooting

### Tests fail in CI but pass locally
- Ensure you're using Deno 1.x (not locked to specific version)
- Check that all imports are using valid URLs

### Deployment fails
- Verify your `DENO_DEPLOY_TOKEN` secret is set correctly
- Check that the project name matches in the workflow file
- Review deployment logs in Deno Deploy dashboard

### KV not working
- Deno KV is automatically available, no setup needed
- In development: uses local file storage
- In production (Deno Deploy): uses distributed KV
- Data is isolated per project

## Best Practices

1. **Always test before deploying** - The workflow ensures this
2. **Use environment variables** - For any configuration that differs between dev/prod
3. **Monitor logs** - Check Deno Deploy dashboard regularly
4. **Use semantic versioning** - Tag releases in git
5. **Set up custom domain** - In Deno Deploy project settings

## Additional Resources

- [Deno Deploy Documentation](https://deno.com/deploy/docs)
- [Deno KV Documentation](https://deno.com/kv)
- [GitHub Actions for Deno](https://github.com/denoland/setup-deno)
