# Deployment Guide

Complete guide for deploying Universe Empire Dominion across all supported platforms.

## Prerequisites

- Node.js 20+ (recommended: 22)
- PostgreSQL 14+ database
- Git repository

## Quick Deploy (5 Minutes)

```bash
git push origin main
# Railway / Render / Fly.io auto-deploy on push
```

## Environment Setup

Copy the environment template and configure variables:

```bash
cp .env.example .env
```

> **Source:** .env.example

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Random string for session encryption |
| `NODE_ENV` | `production` for deployed environments |

### Generate Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Configuration

The application uses Drizzle ORM with PostgreSQL. Connection pooling and timeouts are configured centrally:

> **Source:** server/config/databaseConfig.ts

> **Source:** server/db/index.ts

The database connection auto-detects the environment:
- If `DATABASE_URL` is set, it connects to the specified host
- Falls back to local PostgreSQL if no URL or if Neon URL is broken

### Initialize Schema

```bash
npm run db:push
```

### Startup Configuration

Server port, host, initialization tasks, and feature flags are defined in:

> **Source:** server/config/startupConfig.ts

Default port: `5000` (override with `PORT` env var).

## Platform Guides

### Railway (Recommended)

> **Source:** railway.json

**Steps:**
1. Go to [railway.app](https://railway.app), sign in with GitHub
2. Create new project > Deploy from GitHub repo
3. Add PostgreSQL database (New > Database > PostgreSQL)
4. Set `SESSION_SECRET` in Variables tab
5. `DATABASE_URL` is auto-configured by Railway
6. Deploy automatically on push to `main`

**Configuration:**
- Builder: Nixpacks
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/api/status` (30s interval)
- Region: `us-west`

### Render

> **Source:** render.yaml

**Steps:**
1. Go to [render.com](https://render.com), sign in with GitHub
2. New > Blueprint, select your repository
3. Confirm web service and PostgreSQL database
4. `DATABASE_URL` auto-linked, `SESSION_SECRET` auto-generated
5. Run `npm run db:push` in web service Shell after first deploy

**Configuration:**
- Runtime: Node 22
- Build: `npm ci --include=dev && npm run build`
- Start: `npm start`
- Health check: `/api/status/health`

### Fly.io

> **Source:** fly.toml

> **Source:** Dockerfile

**Steps:**
1. Install Fly CLI: `iwr https://fly.io/install.ps1 -useb | iex` (Windows) or `brew install flyctl`
2. `fly auth login`
3. `fly launch`
4. `fly postgres create --name stellar-dominion-db --region sea`
5. `fly postgres attach stellar-dominion-db`
6. `fly secrets set SESSION_SECRET=$(openssl rand -base64 32)`
7. `fly deploy`

**Configuration:**
- Builder: Heroku buildpacks
- Region: `sea` (Seattle)
- Health check: `/api/status`
- VM: 1 shared CPU, 512MB RAM
- Auto-stop/start machines enabled

### Docker

> **Source:** Dockerfile

> **Source:** docker-compose.yml

**Docker Compose (recommended):**

```bash
cp .env.example .env
# Edit .env with your settings
docker-compose up -d
docker-compose exec app npm run db:push
```

Services:
- **db**: PostgreSQL 16 Alpine
- **app**: Node.js 20 Alpine production image
- **nginx**: Optional reverse proxy

**Manual Docker:**

```bash
docker build -t universe-empire .
docker run -d -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="..." \
  -e NODE_ENV="production" \
  universe-empire
```

### Vercel

> **Source:** vercel.json

**Steps:**
1. `npm install -g vercel && vercel login`
2. `vercel --prod`
3. Set `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production` in dashboard

### Firebase

> **Source:** firebase.json

> **Source:** .firebaserc

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Heroku-Style (Procfile)

> **Source:** Procfile

The Procfile is used by Railway, Render, and other Heroku-compatible platforms:
- `web: npm start` - runs the production server
- `release: npm run db:push` - runs migrations on deploy

### Upsun

> **Source:** config/upsun-config.yaml

Upsun configuration with Node.js 20 runtime, build hooks (`npm i && npm run build`), and passthrough routing.

## Post-Deployment

### Health Check

```bash
curl https://your-app.com/api/status
```

### Create Admin Account

```bash
npm run admin:create -- admin YourPassword123! founder
```

> **Source:** .env.example (admin section)

### CI/CD

> **Source:** .github/workflows/deploy.yml

Automatic deployment on push to `main`. Runs TypeScript check, build, and optional Fly.io deploy.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Verify `DATABASE_URL`, run `npm run db:push` |
| Build fails | Run `npm install && npm run build` locally first |
| Port conflict | Set `PORT` env var to an available port |
| Neon endpoint sleeping | Wake it in Neon dashboard, or check fallback logic in `server/db/index.ts` |

## Documentation

- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [HOSTING_GUIDE.md](HOSTING_GUIDE.md) - Platform comparison
- [NEON_SETUP.md](NEON_SETUP.md) - Neon database setup
- [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) - Railway deep dive
- [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md) - Admin account setup
