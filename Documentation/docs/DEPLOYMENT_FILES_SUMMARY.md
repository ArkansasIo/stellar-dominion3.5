# Deployment Files Summary

Manifest of all deployment configuration files in the project.

## Deployment Configurations

| File | Platform | Purpose |
|------|----------|---------|
| `Dockerfile` | Docker, Fly.io | Multi-stage production container image (Node 20 Alpine) |
| `docker-compose.yml` | Docker | Multi-container setup: app + PostgreSQL + Nginx |
| `railway.json` | Railway | Nixpacks build, health checks, PostgreSQL plugin |
| `render.yaml` | Render | Blueprint: web service + PostgreSQL database |
| `fly.toml` | Fly.io | Heroku buildpacks, auto-scaling, health checks |
| `vercel.json` | Vercel | Serverless Node.js deployment |
| `firebase.json` | Firebase | Hosting with Cloud Functions backend |
| `.firebaserc` | Firebase | Project ID: `game-e0fd3` |
| `Procfile` | Heroku, Railway, Render | Process types: `web` and `release` |
| `config/upsun-config.yaml` | Upsun | Node.js 20 app with build/deploy hooks |

## CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions: test, build, deploy to Fly.io, DB migration check |

## Environment

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template with all config options |

## Key Source Files

| File | Purpose |
|------|---------|
| `server/config/databaseConfig.ts` | Database connection settings, pool config, timeouts |
| `server/config/startupConfig.ts` | Server port, host, initialization tasks, feature flags |
| `server/db/index.ts` | PostgreSQL pool creation, Drizzle ORM setup, auto-fallback |
| `package.json` | Build/start scripts, dependencies, engine requirements |

## CI/CD Pipeline

> **Source:** .github/workflows/deploy.yml

Triggers on push to `main`/`production` branches:
1. **test** - TypeScript check + build
2. **deploy-fly** - Deploy to Fly.io (if configured)
3. **db-migrate** - Validate database schema

## Platform Quick Reference

| Platform | Auto-Deploy | Database | Health Check |
|----------|-------------|----------|--------------|
| Railway | Yes | PostgreSQL plugin | `/api/status` |
| Render | Yes | PostgreSQL service | `/api/status/health` |
| Fly.io | Yes (via CI) | `fly postgres` | `/api/status` |
| Docker | Manual | `docker-compose` | `/api/status` |
| Vercel | Yes | External (Neon) | N/A |
| Firebase | Manual | External | N/A |
| Heroku | Yes (Procfile) | Heroku Postgres | `/api/status` |
