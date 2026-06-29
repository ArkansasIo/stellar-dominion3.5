# CI/CD Workflows

GitHub Actions workflow configuration for automated testing and deployment.

## Deploy Workflow

> **Source:** .github/workflows/deploy.yml

### Triggers

- Push to `main` or `production` branches
- Pull requests targeting `main`
- Manual dispatch

### Jobs

#### 1. test

Runs on `ubuntu-latest` with Node.js 22:

1. Checkout code
2. Install dependencies (`npm ci`)
3. TypeScript type check (`npm run check`)
4. Build application (`npm run build`)
5. Upload build artifacts (retained 7 days)

#### 2. deploy-fly

Deploys to Fly.io (requires `FLY_API_TOKEN` secret):

1. Checkout code
2. Setup Fly CLI
3. Deploy with `flyctl deploy --remote-only`

Condition: Only runs on push to `main` when `FLY_APP` variable is set.

#### 3. db-migrate

Validates database schema:

1. Checkout code
2. Install dependencies
3. Generate migrations (`npm run db:generate`)

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `FLY_API_TOKEN` | Fly.io deployment token |

### Required Variables

| Variable | Purpose |
|----------|---------|
| `FLY_APP` | Fly.io app name (enables deploy job) |

## Replit Workflows

For Replit development environments, add these to `.replit`:

```ini
[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000
```

## Local CI

Run the same checks locally before pushing:

```bash
npm run check        # TypeScript check
npm run build        # Production build
```

> **Source:** package.json
