# Neon Database Setup for Stellar Dominion

## Quick Setup (5 minutes)

### Step 1: Create Free Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (free tier available)
3. Create account with GitHub or email

### Step 2: Create Database Project
1. In Neon dashboard, click "Create Project"
2. Choose region closest to you
3. Name it "Stellar Dominion" (or any name)
4. Click "Create Project"

### Step 3: Get Connection String
1. Go to project dashboard
2. Click "Connection string" tab
3. Select "Pooled connection" (recommended)
4. Copy the full connection string (looks like: `postgresql://user:password@host/dbname`)

### Step 4: Add to Replit
1. In Replit, go to **Secrets** tab (left sidebar)
2. Add new secret:
   - Key: `DATABASE_URL`
   - Value: Paste your Neon connection string
3. Click "Add Secret"

### Step 5: Run Initial Setup
```bash
npm run db:push
```

## Connection String Example
```
postgresql://neon_user:password@ep-random-hash.us-east-2.aws.neon.tech/stellar_dominion?sslmode=require
```

## Features (Free Tier)
✅ 3 free projects
✅ 3GB storage per project
✅ Unlimited projects in future
✅ Auto-scaling compute
✅ Full PostgreSQL 16 support
✅ Automatic backups

## Troubleshooting

**"Endpoint disabled" error:**
- In Neon dashboard, go to Compute → make sure endpoint is ON
- Try "Restart Compute" in dashboard

**Connection refused:**
- Check connection string is correct
- Verify Neon endpoint is active
- Ensure Replit can reach Neon (it can - no firewall issues)

**Still having issues?**
- Delete old DATABASE_URL from secrets
- Add new one from Neon
- Run: `npm run db:push --force`
