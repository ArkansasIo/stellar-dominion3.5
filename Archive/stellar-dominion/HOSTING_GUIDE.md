# 🌍 Free Hosting Options for Stellar Dominion

## Best Free Hosting Platforms for TypeScript + Node.js + PostgreSQL

### 1. **RAILWAY** ⭐ (Recommended - Easiest)
**Free Tier:** $5 credit/month (usually enough for small-medium games)
- ✅ Automatic PostgreSQL support
- ✅ One-click deploy from GitHub
- ✅ Custom domains
- ✅ Auto-scaling
- ✅ Environment variables built-in

**Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Deploy from GitHub
4. Select your Stellar Dominion repo
5. Add PostgreSQL database
6. Deploy!

**Cost:** Free tier gives $5/month (usually enough)

---

### 2. **RENDER** (Very Popular)
**Best For:** Managed web service + PostgreSQL with GitHub auto-deploy
- ✅ PostgreSQL databases supported
- ✅ GitHub integration
- ✅ Free custom domain
- ✅ Infrastructure-as-code via `render.yaml`

**Steps:**
1. Push this repository to GitHub (including `render.yaml`).
2. Go to https://render.com and sign in with GitHub.
3. Click **New +** → **Blueprint** and select your repository.
4. Confirm the detected blueprint resources:
   - Web service: `stellar-dominion`
   - Database: `stellar-dominion-db`
5. Review web service settings (from `render.yaml`):
   - Build command: `npm ci --include=dev && npm run build`
   - Start command: `npm start`
   - Node version: `22`
   - Health check path: `/api/status/health`
6. Add/verify environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `SESSION_SECRET` (auto-generated in blueprint)
   - `DATABASE_URL` (auto-linked from Render PostgreSQL)
7. Deploy the blueprint.
8. After first deploy, run schema migration once:
   - Open the web service Shell and run: `npm run db:push`
9. Open your live URL: `https://your-app.onrender.com`

**Cost:** Typically starts on paid Starter plans for always-on web + Postgres

---

### 3. **FLY.IO** (Powerful)
**Free Tier:** 3 shared CPU cores, 3GB RAM, free databases
- ✅ PostgreSQL included
- ✅ Global deployment
- ✅ Very generous free tier
- ✅ Custom domains

**Steps:**
1. Go to https://fly.io
2. Sign up with GitHub
3. Install flyctl CLI
4. Run: `fly launch`
5. Deploy with `fly deploy`

**Cost:** Very generous free tier

---

### 4. **REPLIT DEPLOY** (Easiest - Stay on Replit)
**Free Tier:** Limited free deployments
- ✅ Deploy directly from Replit
- ✅ No setup needed
- ✅ Auto-scales
- ❌ Usage-based billing after free tier

**Steps:**
1. Click "Deploy" button in Replit
2. Select deployment type
3. Click "Deploy"
4. Get instant live URL

**Cost:** Free tier with pay-as-you-go pricing

---

## Comparison Table

| Platform | Database | Free Tier | Custom Domain | Ease |
|----------|----------|-----------|---------------|------|
| Railway  | ✅ Yes   | $5/month  | ✅ Yes        | ⭐⭐⭐⭐ |
| Render   | ✅ Yes   | Limited   | ✅ Yes        | ⭐⭐⭐⭐ |
| Fly.io   | ✅ Yes   | Generous  | ✅ Yes        | ⭐⭐⭐ |
| Replit   | ✅ Yes   | Limited   | ✅ Yes        | ⭐⭐⭐⭐⭐ |

---

## Quick Start: Railway (Recommended)

**5-Minute Setup:**

1. **Prepare your code:**
   ```bash
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

3. **Deploy on Railway:**
   - Go to railway.app
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your Stellar Dominion repo
   - Click "Deploy Now"
   - Add PostgreSQL database
   - Set `DATABASE_URL` environment variable
   - Done! ✅

**Your game is now live!**

---

## Environment Variables Setup

For any platform, you need to set these environment variables:

```
DATABASE_URL=postgresql://user:password@hostname/dbname
NODE_ENV=production
```

Most platforms auto-detect `package.json` and start with:
```
npm run build && npm start
```

---

## Database Setup for Each Platform

### Railway PostgreSQL:
1. Click "Add Database" → PostgreSQL
2. Railway auto-creates `DATABASE_URL`
3. Done!

### Render PostgreSQL:
1. Create "PostgreSQL" database
2. Copy connection string
3. Add to environment variables as `DATABASE_URL`

### Fly.io PostgreSQL:
```bash
flyctl postgres create
flyctl postgres attach
```

---

## Free Tier Limits

**All platforms have limits. Your game will run fine within:**
- Up to 1,000 concurrent users
- 5GB database storage
- Monthly API requests: 1-10M depending on platform

**If you exceed free tier:**
- Railway: $1-5/month additional
- Render: $7/month minimum paid plan
- Fly.io: ~$3-10/month additional
- Replit: Pay-as-you-go (usually $5-20/month)

---

## My Recommendation

**Go with RAILWAY:**
1. ✅ Easiest setup (GitHub one-click)
2. ✅ Enough free tier for casual games
3. ✅ Great support
4. ✅ Custom domains included
5. ✅ Can easily scale if popular

---

## After Deployment

Once deployed, your game will be live at:
- **Railway:** `your-app.up.railway.app`
- **Render:** `your-app.onrender.com`
- **Fly.io:** `your-app.fly.dev`
- **Replit:** `stellar-dominion.replit.dev`

You can add custom domains on any platform!

---

## Troubleshooting

**"Database connection failed"**
- Ensure `DATABASE_URL` environment variable is set
- Check database credentials are correct
- Run `npm run db:push` to create tables

**"Build failed"**
- Run `npm install` locally
- Check `package.json` has all dependencies
- Commit & push again

**"Still using old version"**
- Most platforms auto-deploy on GitHub push
- Force refresh (Ctrl+Shift+R)
- Wait 2-5 minutes for deployment

---

## Next Steps

1. Choose platform (Railway recommended)
2. Sign up with GitHub
3. Connect your repo
4. Add PostgreSQL database
5. Add `DATABASE_URL` secret
6. Deploy!

Your Stellar Dominion game will be live within 10 minutes! 🚀
