# Deployment Checklist

Pre-deployment checklist for Universe Empire Dominion.

## Code Preparation

- [ ] All TypeScript errors resolved: `npm run check`
- [ ] Production build succeeds: `npm run build`
- [ ] `.env` not committed to git
- [ ] `package.json` version updated

> **Source:** package.json

## Environment

- [ ] `DATABASE_URL` set (PostgreSQL connection string)
- [ ] `SESSION_SECRET` generated (strong random value)
- [ ] `NODE_ENV=production`
- [ ] `PORT` configured (default: 5000)

> **Source:** .env.example

## Database

- [ ] PostgreSQL database provisioned
- [ ] Schema initialized: `npm run db:push`
- [ ] Connection tested locally

> **Source:** server/db/index.ts
> **Source:** server/config/databaseConfig.ts

## Platform Selection

Choose one:

| Platform | Config File | Difficulty |
|----------|------------|------------|
| Railway | `railway.json` | Easy |
| Render | `render.yaml` | Easy |
| Fly.io | `fly.toml` + `Dockerfile` | Medium |
| Docker | `docker-compose.yml` | Medium |
| Vercel | `vercel.json` | Easy |
| Firebase | `firebase.json` | Easy |
| Heroku | `Procfile` | Easy |
| Upsun | `config/upsun-config.yaml` | Medium |

## Deploy

- [ ] Push to `main` branch
- [ ] CI/CD pipeline passes: `.github/workflows/deploy.yml`
- [ ] Application starts without errors
- [ ] Health check returns 200: `GET /api/status`

## Post-Deploy

- [ ] Admin account created
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## Verification

- [ ] Home page loads
- [ ] User registration works
- [ ] Login works
- [ ] API endpoints respond
- [ ] Database queries complete

## Security

- [ ] `SESSION_SECRET` is unique and strong
- [ ] `.env` excluded from git
- [ ] Admin passwords changed from defaults
- [ ] Rate limiting enabled (if applicable)
