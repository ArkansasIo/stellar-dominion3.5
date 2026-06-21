# Railway Deployment

Deep-dive guide for deploying Universe Empire Dominion on Railway.

## Configuration

> **Source:** railway.json

The `railway.json` file defines build, deploy, health check, and database settings.

### Build Settings

- **Builder:** Nixpacks (auto-detects Node.js)
- **Build command:** `npm ci && npm run build`
- **Watch patterns:** `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

### Deploy Settings

- **Start command:** `npm start`
- **Region:** `us-west`
- **Restart policy:** On failure (max 10 retries)
- **Health check:** `/api/status` (30s interval, 10s timeout, 300s startup grace)

### Database

PostgreSQL plugin configured as `universe-empire-domions-db` on the `starter` plan.

### Environments

| Environment | `NODE_ENV` | `PORT` |
|-------------|-----------|--------|
| production | production | 5000 |
| staging | staging | 5000 |

## Deployment Steps

### 1. Connect Repository

```bash
# Option A: Railway CLI
npm i -g @railway/cli
railway login
railway link

# Option B: Dashboard
# New Project > Deploy from GitHub repo
```

### 2. Add PostgreSQL

In Railway dashboard: New > Database > PostgreSQL. The `DATABASE_URL` variable is auto-injected.

### 3. Set Environment Variables

Required:
```bash
SESSION_SECRET=<generate-random-string>
NODE_ENV=production
```

Optional:
```bash
LOG_LEVEL=info
LOG_QUERIES=false
```

### 4. Deploy

```bash
# Push to main branch (auto-deploy)
git push origin main

# Or manually
railway up
```

### 5. Initialize Database

```bash
railway run npm run db:push
```

## Process Types

> **Source:** Procfile

- `web: npm start` - main application
- `release: npm run db:push` - runs on each deploy

## Monitoring

### Health Check

Railway monitors `/api/status` every 30 seconds. The app must respond within 10 seconds.

### Logs

```bash
railway logs
# Or view in dashboard under Deployments tab
```

## Custom Domain

1. Settings > Networking > Generate Domain
2. Or add custom domain under Custom Domains

## Scaling

- **Vertical:** Settings > Resources > adjust CPU/Memory
- **Horizontal:** Edit `railway.json` `deploy.numReplicas`

## Cost

- Free tier: $5/month credit
- Starter plan: $5/month
- Pro plan: $20/month

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Verify `package-lock.json` committed, Node.js 20+ |
| Database connection error | Check `DATABASE_URL` is set and database is running |
| Health check fails | Verify `/api/status` returns 200, check startup logs |
| Port issues | Railway auto-assigns PORT; app reads `process.env.PORT` |

## Resources

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
