# Railway Deployment Guide for Stellar Dominion

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/stellar-dominion)

## Prerequisites

- Railway account ([Sign up](https://railway.app))
- GitHub repository connected
- PostgreSQL database (auto-provisioned by Railway)

## Configuration Files

Railway supports two configuration formats:

1. **railway.json** - JSON format (legacy, still supported)
2. **railway.toml** - TOML format (recommended)

Both files are included in this project. Railway will automatically detect and use them.

## Environment Variables

### Required Variables

Set these in Railway dashboard under Variables tab:

```bash
# Application
NODE_ENV=production
PORT=5000

# Database (auto-provisioned by Railway PostgreSQL plugin)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security
SESSION_SECRET=<generate-random-32-char-string>
JWT_SECRET=<generate-random-32-char-string>

# Optional
LOG_LEVEL=info
```

### Setting Environment Variables

1. Go to your Railway project dashboard
2. Select your service
3. Click on "Variables" tab
4. Add each variable listed above

## Deployment Steps

### 1. Connect GitHub Repository

```bash
# Railway CLI (optional)
npm i -g @railway/cli
railway login
railway link
```

Or use Railway dashboard:
1. Create new project
2. Select "Deploy from GitHub repo"
3. Choose your Stellar Dominion repository

### 2. Add PostgreSQL Database

1. In Railway dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Database URL is automatically injected as `DATABASE_URL`

### 3. Configure Build Settings

Railway auto-detects configuration from `railway.json` or `railway.toml`:

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Health Check**: `/api/status`

### 4. Deploy

```bash
# Using Railway CLI
railway up

# Or push to main branch (auto-deploy enabled)
git push origin main
```

## Database Setup

### Run Migrations

After first deployment:

```bash
# Using Railway CLI
railway run npm run db:push

# Or via project dashboard terminal
npm run db:push
```

### Seed Database (Optional)

```bash
railway run node create-db.js
```

## Monitoring

### Health Checks

Railway automatically monitors your app via `/api/status` endpoint:
- Interval: 30 seconds
- Timeout: 10 seconds
- Restart on failure

### View Logs

```bash
# Real-time logs
railway logs

# Or view in dashboard under "Deployments" tab
```

## Custom Domain

1. Go to Settings → Networking
2. Click "Generate Domain" for free `.up.railway.app` subdomain
3. Or add custom domain under "Custom Domains"

### DNS Configuration (Custom Domain)

Add these DNS records:

```
Type: CNAME
Name: www
Value: <your-app>.up.railway.app
```

## Scaling

### Vertical Scaling

1. Go to Settings → Resources
2. Adjust CPU/Memory allocation
3. Plans: Starter ($5/mo), Pro ($20/mo), Enterprise (custom)

### Horizontal Scaling

Update `railway.json`:

```json
{
  "deploy": {
    "numReplicas": 3
  }
}
```

## Advanced Configuration

### Multiple Environments

Railway supports multiple environments:

```bash
# Create staging environment
railway environment create staging

# Deploy to staging
railway up --environment staging
```

### Cron Jobs

Add scheduled tasks in `railway.toml`:

```toml
[[crons]]
schedule = "0 2 * * *"
command = "npm run db:backup"
```

### Private Services

For internal services (e.g., worker processes):

```toml
[[services]]
name = "worker"
type = "worker"
startCommand = "npm run worker"
```

## CI/CD Integration

### GitHub Actions

Railway auto-deploys on push to main. For manual control:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Railway CLI
        run: npm i -g @railway/cli
      - name: Deploy
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Troubleshooting

### Build Failures

1. Check build logs in Railway dashboard
2. Verify `package-lock.json` is committed
3. Ensure Node.js version matches (20+)

### Database Connection Issues

```bash
# Test connection
railway run npm run db:push -- --dry-run

# Check DATABASE_URL variable
railway variables
```

### Port Issues

Railway automatically assigns `PORT` environment variable. Ensure your app uses it:

```javascript
const PORT = process.env.PORT || 5000;
```

### Health Check Failures

- Verify `/api/status` endpoint returns 200
- Check startup time (Railway waits 300s by default)
- Review application logs

## Cost Optimization

- **Free tier**: $5 credit/month
- **Starter plan**: $5/month (500 hours)
- **Pro plan**: $20/month (unlimited)

### Tips

1. Use sleep mode for development environments
2. Set `sleepApplication: true` in `railway.json` for non-production
3. Monitor resource usage in dashboard

## Backup & Recovery

### Database Backups

```bash
# Manual backup
railway run pg_dump $DATABASE_URL > backup.sql

# Restore
railway run psql $DATABASE_URL < backup.sql
```

Railway Pro includes automatic daily backups.

## Security

### Best Practices

1. Never commit secrets to git
2. Use Railway's Variables for sensitive data
3. Enable 2FA on Railway account
4. Rotate secrets regularly
5. Use HTTPS only (automatic with Railway)

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Status Page**: https://status.railway.app

## Additional Resources

- [Railway Config Reference](https://docs.railway.app/deploy/config-as-code)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Railway Templates](https://railway.app/templates)
