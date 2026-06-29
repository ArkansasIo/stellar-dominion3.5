# Hosting Guide

Comparison of hosting platforms for Universe Empire Dominion.

## Platform Comparison

| Platform | Database | Free Tier | Custom Domain | Ease | Config File |
|----------|----------|-----------|---------------|------|-------------|
| Railway | PostgreSQL plugin | $5/month credit | Yes | Easy | `railway.json` |
| Render | PostgreSQL service | Limited free | Yes | Easy | `render.yaml` |
| Fly.io | `fly postgres` | Generous | Yes | Medium | `fly.toml` |
| Vercel | External (Neon) | Generous | Yes | Easy | `vercel.json` |
| Firebase | External | Free hosting | Yes | Easy | `firebase.json` |
| Docker | Self-managed | N/A (VPS cost) | Yes | Medium | `docker-compose.yml` |
| Upsun | PostgreSQL service | Trial | Yes | Medium | `config/upsun-config.yaml` |

## Railway (Recommended)

> **Source:** railway.json

**Setup:**
1. Sign in at [railway.app](https://railway.app) with GitHub
2. New Project > Deploy from GitHub repo
3. Add PostgreSQL database
4. Set `SESSION_SECRET` in Variables
5. Push to `main` to deploy

**Key settings from `railway.json`:**
- Builder: Nixpacks
- Build: `npm ci && npm run build`
- Start: `npm start`
- Health check: `/api/status` (30s interval, 10s timeout)
- Region: `us-west`
- Restart: on failure, max 10 retries

## Render

> **Source:** render.yaml

**Setup:**
1. Sign in at [render.com](https://render.com) with GitHub
2. New > Blueprint, select repository
3. Auto-detects web service + PostgreSQL
4. `DATABASE_URL` auto-linked, `SESSION_SECRET` auto-generated
5. Run `npm run db:push` in Shell after first deploy

**Key settings from `render.yaml`:**
- Runtime: Node 22
- Build: `npm ci --include=dev && npm run build`
- Health check: `/api/status/health`
- Auto-deploy: enabled

## Fly.io

> **Source:** fly.toml

**Setup:**
1. Install CLI: `fly auth login`
2. `fly launch` (uses `fly.toml`)
3. `fly postgres create --name stellar-dominion-db`
4. `fly postgres attach stellar-dominion-db`
5. `fly secrets set SESSION_SECRET=$(openssl rand -base64 32)`
6. `fly deploy`

**Key settings from `fly.toml`:**
- Builder: Heroku buildpacks
- Region: `sea` (Seattle)
- Health check: `/api/status`
- Auto-stop/start: enabled
- VM: 1 shared CPU, 512MB RAM

## Docker

> **Source:** Dockerfile

> **Source:** docker-compose.yml

**Setup:**
```bash
cp .env.example .env  # Edit with your settings
docker-compose up -d
docker-compose exec app npm run db:push
```

**Services:**
- `db`: PostgreSQL 16 Alpine with health check
- `app`: Node.js 20 Alpine (multi-stage build)
- `nginx`: Optional reverse proxy

## Vercel

> **Source:** vercel.json

**Setup:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

Routes all requests to `dist/index.cjs`. Requires external database (Neon recommended).

## Firebase

> **Source:** firebase.json

> **Source:** .firebaserc

**Setup:**
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Project ID: `game-e0fd3`. Uses Cloud Functions for backend.

## Upsun

> **Source:** config/upsun-config.yaml

**Setup:**
1. Install Upsun CLI
2. `upsun push`

Build hooks: `npm i && npm run build`. TCP upstream, passthrough routing.

## Environment Variables

All platforms need these core variables:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/stellar_dominion
SESSION_SECRET=<random-32-byte-string>
NODE_ENV=production
PORT=5000  # Most platforms override this
```

> **Source:** .env.example

## Database Options

| Provider | Setup | Best For |
|----------|-------|----------|
| Railway PostgreSQL | Auto-provisioned | Railway deployments |
| Render PostgreSQL | Auto-provisioned | Render deployments |
| Neon | Manual setup | Vercel, Firebase, self-hosted |
| Fly.io PostgreSQL | `fly postgres create` | Fly.io deployments |
| Local PostgreSQL | Manual install | Development |

> **Source:** server/config/databaseConfig.ts
> **Source:** server/db/index.ts

## Post-Deploy Verification

1. Health check: `curl https://your-app.com/api/status`
2. Create admin: `npm run admin:create -- admin Password123! founder`
3. Test login at `/admin/login`
