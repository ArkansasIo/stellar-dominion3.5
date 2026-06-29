# 🚀 Complete Deployment Guide for Stellar Dominion

**Developer:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Platform-Specific Guides](#platform-specific-guides)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

**Fastest deployment path (5 minutes):**

1. **Railway.app** (Recommended)
   ```bash
   # 1. Push to GitHub
   git push origin main
   
   # 2. Go to railway.app and connect repo
   # 3. Add PostgreSQL database (one click)
   # 4. Deploy (automatic)
   ```

2. **Environment Variables to Set:**
   - `DATABASE_URL` (auto-configured by Railway PostgreSQL)
   - `SESSION_SECRET` (generate: `openssl rand -base64 32`)
   - `NODE_ENV=production`

3. **Done!** Your app is live at `https://[project].up.railway.app`

---

## 📋 Prerequisites

### Local Development (Before Deploying)

1. **Node.js 20.x or higher**
   ```bash
   node --version  # Should show v20.x.x
   ```

2. **Dependencies installed**
   ```bash
   npm install
   ```

3. **TypeScript check passes**
   ```bash
   npm run check
   # Should complete with 0 errors
   ```

4. **Production build works**
   ```bash
   npm run build
   # Creates dist/ folder
   ```

5. **Environment configured**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

### Git Repository

```bash
# Initialize git if not already
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/StellarDominion-2.git
git push -u origin main
```

---

## 🔐 Environment Configuration

### Step 1: Copy Template

```bash
cp .env.example .env
```

### Step 2: Configure Variables

Edit `.env` file:

```env
# ============================================
# DATABASE CONFIGURATION (Choose one method)
# ============================================

# Method 1: Single connection string (Recommended for Neon/Railway)
DATABASE_URL=postgresql://user:password@host.region.neon.tech:5432/database?sslmode=require

# Method 2: Individual PostgreSQL variables (for local development)
PGHOST=localhost
PGPORT=5432
PGDATABASE=stellar_dominion
PGUSER=postgres
PGPASSWORD=postgres

# ============================================
# SERVER CONFIGURATION
# ============================================

NODE_ENV=production          # Use 'development' for local, 'production' for deployed
PORT=5000                    # Server port (most platforms override this)

# ============================================
# SECURITY (CRITICAL!)
# ============================================

# Generate a secure secret:
# Method 1: openssl rand -base64 32
# Method 2: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
SESSION_SECRET=CHANGE_THIS_TO_A_RANDOM_STRING_IN_PRODUCTION

# ============================================
# LOGGING & DEBUGGING
# ============================================

LOG_LEVEL=info               # Options: error, warn, info, debug
LOG_QUERIES=false            # Set to 'true' to log all SQL queries
DEBUG=false                  # Set to 'true' for verbose debugging

# ============================================
# ADMIN CONFIGURATION
# ============================================

ADMIN_USERNAME=admin
# Generate hash: npm run admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
```

### Step 3: Generate SESSION_SECRET

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256}))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Never Commit `.env`

Verify `.env` is in `.gitignore`:
```bash
cat .gitignore | grep .env
# Should show: .env
```

---

## 🗄️ Database Setup

### Option 1: Neon (Serverless PostgreSQL) - Recommended ⭐

**Why Neon?** Free tier, serverless, auto-scales, perfect for Node.js.

1. **Sign Up**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub

2. **Create Database**
   - Click "New Project"
   - Name: `stellar-dominion`
   - Region: Choose closest to your users
   - PostgreSQL version: 16

3. **Get Connection String**
   - Copy the connection string
   - Format: `postgresql://user:pass@host.region.neon.tech:5432/database?sslmode=require`

4. **Set Environment Variable**
   ```bash
   # In .env file
   DATABASE_URL=postgresql://user:pass@host.region.neon.tech:5432/database?sslmode=require
   ```

5. **Initialize Schema**
   ```bash
   npm run db:push
   ```

### Option 2: Railway PostgreSQL

1. **Create Database**
   - In Railway project, click "New" → "Database" → "PostgreSQL"
   - Railway creates database automatically

2. **Get Connection String**
   - Click on PostgreSQL service
   - Copy `DATABASE_URL` from Variables tab
   - Format: `postgresql://postgres:pass@host.railway.internal:5432/railway`

3. **Connect Automatically**
   - Railway automatically sets `DATABASE_URL` for your app
   - No manual configuration needed!

4. **Initialize Schema**
   - Railway will run `npm run db:push` on first deploy
   - Or manually in Railway console: `npm run db:push`

### Option 3: Local PostgreSQL

**For development only:**

1. **Install PostgreSQL**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql@16`
   - Linux: `sudo apt install postgresql-16`

2. **Create Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE stellar_dominion;
   
   # Create user
   CREATE USER stellar_user WITH PASSWORD 'your_password';
   
   # Grant permissions
   GRANT ALL PRIVILEGES ON DATABASE stellar_dominion TO stellar_user;
   
   # Exit
   \q
   ```

3. **Configure Connection**
   ```env
   DATABASE_URL=postgresql://stellar_user:your_password@localhost:5432/stellar_dominion
   ```

4. **Initialize Schema**
   ```bash
   npm run db:push
   ```

---

## 🚀 Platform-Specific Guides

### 1️⃣ Railway (Easiest - 5 minutes)

#### Visual Walkthrough:

**Step 1: Create Account**
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

**Step 2: New Project**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `StellarDominion-2` repository
4. Railway auto-detects Node.js

**Step 3: Add Database**
1. Click "New" → "Database" → "Add PostgreSQL"
2. Database is created and `DATABASE_URL` is auto-configured
3. No manual setup needed!

**Step 4: Configure Environment**
1. Click on your web service
2. Go to "Variables" tab
3. Add variables:
   - `SESSION_SECRET` = (paste generated secret)
   - `NODE_ENV` = production
4. `DATABASE_URL` is already set by Railway

**Step 5: Deploy**
1. Railway automatically deploys on push to main
2. Watch deployment logs in real-time
3. Click "View Logs" to monitor progress
4. Deployment completes in ~2-3 minutes

**Step 6: Access Your App**
1. Click "Settings" → "Domains"
2. Copy the generated URL: `https://[project].up.railway.app`
3. Visit URL → Your app is live! 🎉

#### Configuration Files Used:
- `railway.json` ✅
- `package.json` (scripts section) ✅

---

### 2️⃣ Render.com (Free Tier Available)

#### Step-by-Step:

**Step 1: Sign Up**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

**Step 2: Create PostgreSQL Database**
1. Click "New +" → "PostgreSQL"
2. Name: `stellar-dominion-db`
3. Database: `stellar_dominion`
4. User: `stellar_user`
5. Region: Choose closest to users
6. Plan: Free (or Starter for production)
7. Click "Create Database"

**Step 3: Get Database URL**
1. Click on database
2. Scroll to "Connections"
3. Copy "Internal Database URL"
4. Format: `postgresql://user:pass@host/db`

**Step 4: Create Web Service**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** stellar-dominion
   - **Region:** Same as database
   - **Branch:** main
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Starter (or Free)

**Step 5: Environment Variables**
In "Environment" section, add:
```
DATABASE_URL=postgresql://user:pass@host/db
SESSION_SECRET=your_generated_secret
NODE_ENV=production
```

**Step 6: Deploy**
1. Click "Create Web Service"
2. Watch build logs
3. First deploy takes ~5-10 minutes
4. Service URL: `https://stellar-dominion.onrender.com`

**Step 7: Initialize Database**
1. Go to web service → "Shell"
2. Run: `npm run db:push`
3. Database schema is now initialized

#### Configuration Files Used:
- `render.yaml` ✅
- `package.json` ✅

---

### 3️⃣ Fly.io (Global Edge Deployment)

#### Prerequisites:
```powershell
# Install Fly CLI (Windows PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Or Mac/Linux
brew install flyctl
```

#### Deployment Steps:

**Step 1: Login**
```bash
fly auth login
# Opens browser for authentication
```

**Step 2: Launch App**
```bash
# In project directory
fly launch

# Prompts:
# ? Choose an app name: stellar-dominion
# ? Choose a region: sea (Seattle)
# ? Setup PostgreSQL database? Yes
# ? Setup PgBouncer? Yes
# ? Development database? No
# ? Scale single node pg to zero? No
```

**Step 3: Configure**
Fly creates `fly.toml` (already exists in repo ✅)

Edit if needed:
```toml
app = "stellar-dominion"
primary_region = "sea"

[env]
  NODE_ENV = "production"
  PORT = "8080"
```

**Step 4: Create Database**
```bash
# Create PostgreSQL cluster
fly postgres create --name stellar-dominion-db --region sea

# Attach to app
fly postgres attach stellar-dominion-db
# This sets DATABASE_URL automatically
```

**Step 5: Set Secrets**
```bash
# Generate and set session secret
fly secrets set SESSION_SECRET=$(openssl rand -base64 32)

# Set environment
fly secrets set NODE_ENV=production
```

**Step 6: Deploy**
```bash
fly deploy
# Builds Docker image
# Pushes to Fly
# Deploys globally
```

**Step 7: Check Status**
```bash
# View app status
fly status

# View logs
fly logs

# Open in browser
fly open
```

**Step 8: Scale (Optional)**
```bash
# Scale to multiple regions
fly scale count 2 --region sea,dfw

# Scale VM size
fly scale vm dedicated-cpu-1x
```

#### Configuration Files Used:
- `fly.toml` ✅
- `Dockerfile` ✅

---

### 4️⃣ Docker (Self-Hosted/Cloud)

#### Use Cases:
- VPS/Cloud servers (DigitalOcean, AWS, Linode)
- Kubernetes clusters
- Local development with containers

#### Option A: Docker Compose (Fastest)

**Step 1: Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Step 2: Start Services**
```bash
# Start app + PostgreSQL
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

**Step 3: Initialize Database**
```bash
# Run migrations
docker-compose exec app npm run db:push
```

**Step 4: Access App**
- App: http://localhost:5000
- With Nginx: http://localhost:80

**Stop Services:**
```bash
docker-compose down
# Add -v to remove volumes (deletes database!)
```

#### Option B: Manual Docker

**Step 1: Build Image**
```bash
docker build -t stellar-dominion:latest .
```

**Step 2: Run PostgreSQL**
```bash
docker run -d \
  --name stellar-db \
  -e POSTGRES_DB=stellar_dominion \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -v stellar-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

**Step 3: Run App**
```bash
docker run -d \
  --name stellar-app \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://postgres:secure_password@stellar-db:5432/stellar_dominion" \
  -e SESSION_SECRET="your_secret_here" \
  -e NODE_ENV="production" \
  --link stellar-db \
  stellar-dominion:latest
```

**Step 4: Initialize Database**
```bash
docker exec stellar-app npm run db:push
```

#### Configuration Files Used:
- `Dockerfile` ✅
- `docker-compose.yml` ✅
- `.dockerignore` ✅
- `nginx.conf` (if using Nginx) ✅

---

### 5️⃣ Vercel (Serverless)

**Note:** Best with Neon database (serverless PostgreSQL).

#### Steps:

**Step 1: Install CLI**
```bash
npm install -g vercel
```

**Step 2: Login**
```bash
vercel login
```

**Step 3: Deploy**
```bash
vercel --prod
```

**Step 4: Configure Environment**
1. Go to Vercel dashboard
2. Select project
3. Settings → Environment Variables
4. Add:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `NODE_ENV=production`

**Step 5: Redeploy**
```bash
vercel --prod
```

#### Configuration Files Used:
- `vercel.json` ✅

---

## ✅ Post-Deployment

### 1. Health Check

Visit these endpoints:

```bash
# Check app status
curl https://your-app.com/api/status

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 12345
}
```

### 2. Admin Account Setup

**Create admin account:**
```bash
# Locally
npm run admin

# Or on server
ssh user@server
cd /path/to/app
npm run admin
```

Follow prompts to create admin user.

See [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md) for details.

### 3. Verify Functionality

Test checklist:
- [ ] Home page loads
- [ ] User can register
- [ ] User can login
- [ ] Dashboard displays
- [ ] Resources update
- [ ] Buildings work
- [ ] Combat functions
- [ ] Messages send/receive

### 4. Performance Check

```bash
# Response time test
curl -w "@curl-format.txt" -o /dev/null -s https://your-app.com

# Load test (optional)
npm install -g loadtest
loadtest -c 10 -t 30 https://your-app.com
```

### 5. Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] `SESSION_SECRET` is unique and strong
- [ ] `.env` not committed to git
- [ ] Database credentials secured
- [ ] Admin password changed from default
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if applicable)
- [ ] Security headers set (CSP, HSTS, etc.)

---

## 📊 Monitoring & Maintenance

### Logging

**View Logs:**

**Railway:**
```bash
# In Railway dashboard
Click project → View Logs
```

**Render:**
```bash
# In Render dashboard
Click service → Logs
```

**Fly.io:**
```bash
fly logs
fly logs --follow  # Real-time
```

**Docker:**
```bash
docker logs stellar-app
docker logs -f stellar-app  # Follow mode
```

### Monitoring Tools (Recommended)

1. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) (Free)
   - [Pingdom](https://www.pingdom.com)
   - [Better Uptime](https://betteruptime.com)

2. **Error Tracking**
   - [Sentry](https://sentry.io) (Free tier)
   - [LogRocket](https://logrocket.com)
   - [Rollbar](https://rollbar.com)

3. **Performance Monitoring**
   - [New Relic](https://newrelic.com)
   - [Datadog](https://www.datadoghq.com)
   - Railway/Render/Fly.io built-in metrics

### Backup Strategy

**Database Backups:**

**Neon (Automatic):**
- Point-in-time restore enabled
- Backups retained for 7 days (free) or 30 days (paid)

**Railway:**
```bash
# Manual backup
railway run pg_dump $DATABASE_URL > backup.sql

# Restore
railway run psql $DATABASE_URL < backup.sql
```

**Manual Backups:**
```bash
# Dump database
pg_dump DATABASE_URL > stellar-dominion-backup-$(date +%Y%m%d).sql

# Restore
psql DATABASE_URL < stellar-dominion-backup-20260309.sql
```

**Automate with Cron:**
```bash
# Daily backup at 2 AM
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/stellar-$(date +\%Y\%m\%d).sql.gz
```

### Update Deployment

**Git-based (Railway, Render, Vercel):**
```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main
# Automatic deployment triggered
```

**Docker:**
```bash
# Rebuild image
docker build -t stellar-dominion:latest .

# Stop old container
docker stop stellar-app
docker rm stellar-app

# Start new container
docker run -d ...

# Or with Docker Compose
docker-compose up -d --build
```

**Fly.io:**
```bash
fly deploy
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptoms:**
- "Connection refused" error
- "Database not found"
- App crashes on startup

**Solutions:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db

# Test connection
psql $DATABASE_URL

# Check database exists
psql $DATABASE_URL -c "SELECT 1"

# Initialize schema
npm run db:push

# For Neon: Check endpoint is active (not "sleeping")
# Go to Neon dashboard → Endpoints → Ensure running
```

#### 2. Build Fails

**Symptoms:**
- "Module not found" errors
- TypeScript errors
- Build command exits with error

**Solutions:**
```bash
# Clear and reinstall
rm -rf node_modules dist
npm install

# Check TypeScript
npm run check

# Test build locally
npm run build

# Check Node.js version
node --version  # Should be v20.x

# Verify all dependencies
npm audit fix
```

#### 3. App Crashes After Start

**Symptoms:**
- Server starts then immediately exits
- "Port already in use"
- Memory errors

**Solutions:**
```bash
# Check logs
# Railway: View logs in dashboard
# Docker: docker logs stellar-app
# Fly.io: fly logs

# Check port conflicts
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Increase memory (if applicable)
# Railway: Settings → Resources → Memory
# Fly.io: fly scale memory 1024

# Check environment variables
env | grep -E 'DATABASE_URL|SESSION_SECRET|NODE_ENV'
```

#### 4. Slow Performance

**Symptoms:**
- Page loads slowly (>5 seconds)
- API timeouts
- High CPU/memory usage

**Solutions:**
```bash
# Enable gzip compression (already in nginx.conf)

# Add database indexes
npm run db:push

# Scale resources
# Railway: Settings → Resources
# Fly.io: fly scale count 2

# Enable caching
# Add Redis for session storage (advanced)

# Optimize queries
# Enable LOG_QUERIES in .env to identify slow queries
```

#### 5. HTTPS/SSL Issues

**Symptoms:**
- "Not secure" warning
- SSL certificate errors
- Mixed content warnings

**Solutions:**
- **Railway/Render/Fly.io:** SSL is automatic, check domain settings
- **Custom domain:** Verify DNS records
- **Self-hosted:** Use Let's Encrypt (certbot)

```bash
# Let's Encrypt (Linux)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 6. Session/Login Issues

**Symptoms:**
- Can't login
- Session expires immediately
- "Not authenticated" errors

**Solutions:**
```bash
# Check SESSION_SECRET is set
echo $SESSION_SECRET

# Verify database has sessions table
psql $DATABASE_URL -c "\dt"

# Clear browser cookies
# Browser → Dev Tools (F12) → Application → Cookies → Clear

# Check admin account exists
npm run admin
```

---

## 🎓 Advanced Topics

### Custom Domain Setup

**See:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#-custom-domain-setup)

### CI/CD with GitHub Actions

**File:** `.github/workflows/deploy.yml` ✅

**Setup:**
1. Add secrets to GitHub repository
2. Push to main branch
3. Automatic deployment triggered

### Scaling Strategies

**Horizontal Scaling:**
- Multiple instances behind load balancer
- Fly.io: `fly scale count 3`
- Railway: Enable autoscaling

**Vertical Scaling:**
- Increase CPU/memory per instance
- Fly.io: `fly scale vm dedicated-cpu-2x`
- Railway: Upgrade plan

### Database Optimization

**Add Indexes:**
```sql
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_player_states_user_id ON player_states(user_id);
```

**Connection Pooling:**
Already configured in `server/db/index.ts` ✅

---

## 📞 Getting Help

### Documentation
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Development setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md) - Admin setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Quick reference

### Platform Support
- Railway: [Discord](https://discord.gg/railway) | [Docs](https://docs.railway.app)
- Render: [Community](https://community.render.com) | [Docs](https://render.com/docs)
- Fly.io: [Community](https://community.fly.io) | [Docs](https://fly.io/docs)

### Issues
- GitHub Issues: [Create Issue](https://github.com/yourusername/StellarDominion-2/issues)

---

## 🎉 Success!

Your Stellar Dominion game is now deployed and accessible worldwide!

**What now?**
- Share with friends
- Gather feedback
- Plan new features
- Monitor performance
- Enjoy the game!

---

**May your empire span the stars! 🌌✨**

*Developed by Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))*
