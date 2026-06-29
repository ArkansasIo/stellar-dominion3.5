# ✅ Deployment Checklist for Stellar Dominion

**Developer:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))

---

## 📋 Pre-Deployment Requirements

### Code Preparation
- [ ] All TypeScript errors resolved (`npm run check`)
- [ ] Production build successful (`npm run build`)
- [ ] Code committed to version control
- [ ] `.env` file NOT committed (use `.env.example` as template)
- [ ] Review and update `package.json` version

### Environment Setup
- [ ] Copy `.env.example` to `.env` and configure
- [ ] Set `DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `SESSION_SECRET` (generate secure random string)
- [ ] Set `NODE_ENV=production` (for production deployment)
- [ ] Configure optional variables (LOG_LEVEL, DEBUG, etc.)

### Database Setup
- [ ] Create PostgreSQL database (Neon, Railway, or local)
- [ ] Run database migrations: `npm run db:push`
- [ ] Verify database schema initialized
- [ ] Test database connection locally
- [ ] Create admin user account (see [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md))

### Local Testing
- [ ] Test app works locally: `npm run dev`
- [ ] No browser console errors (F12)
- [ ] Test login functionality
- [ ] Test key features (resources, buildings, combat, etc.)
- [ ] Test production build: `npm run build && npm start`

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Easiest) ⭐

**Why Railway?** One-click PostgreSQL, automatic HTTPS, zero configuration.

#### Steps:
1. **Sign Up**
   - [ ] Go to [railway.app](https://railway.app)
   - [ ] Sign up with GitHub

2. **Create Project**
   - [ ] Click "New Project" → "Deploy from GitHub repo"
   - [ ] Select your `StellarDominion-2` repository
   - [ ] Railway auto-detects Node.js and uses `railway.json` config

3. **Add Database**
   - [ ] Click "New" → "Database" → "Add PostgreSQL"
   - [ ] Railway automatically sets `DATABASE_URL` environment variable

4. **Configure Environment**
   - [ ] Go to Variables tab
   - [ ] Add `SESSION_SECRET` (generate random string)
   - [ ] Add `NODE_ENV=production`
   - [ ] Verify `DATABASE_URL` is set (auto-configured)

5. **Deploy**
   - [ ] Click "Deploy" or push to main branch
   - [ ] Wait 2-3 minutes for deployment
   - [ ] Visit provided URL: `https://[project-name].up.railway.app`

6. **Initialize Database**
   - [ ] In Railway console, run: `npm run db:push`
   - [ ] Or let the app auto-initialize on first run

#### Configuration Files:
- `railway.json` - Railway deployment configuration ✅

---

### Option 2: Render.com

**Why Render?** Free tier available, automatic SSL, easy to use.

#### Steps:
1. **Sign Up**
   - [ ] Go to [render.com](https://render.com)
   - [ ] Sign up with GitHub

2. **Create Web Service**
   - [ ] Click "New +" → "Web Service"
   - [ ] Connect GitHub repository
   - [ ] Render detects settings from `render.yaml`

3. **Configure Service**
   - [ ] **Build Command:** `npm install && npm run build`
   - [ ] **Start Command:** `npm start`
   - [ ] **Environment:** Node
   - [ ] **Instance Type:** Starter (or Free)

4. **Add Database**
   - [ ] Create PostgreSQL database (New + → PostgreSQL)
   - [ ] Copy Internal Database URL

5. **Set Environment Variables**
   - [ ] `DATABASE_URL` = (paste database URL)
   - [ ] `SESSION_SECRET` = (generate random string)
   - [ ] `NODE_ENV` = production

6. **Deploy**
   - [ ] Click "Create Web Service"
   - [ ] Wait 5-10 minutes for first deployment
   - [ ] Visit: `https://[project-name].onrender.com`

#### Configuration Files:
- `render.yaml` - Render deployment configuration ✅

---

### Option 3: Fly.io

**Why Fly.io?** Global edge deployment, Docker-based, great performance.

#### Steps:
1. **Install CLI**
   ```powershell
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   brew install flyctl
   ```
   - [ ] CLI installed

2. **Login**
   ```bash
   fly auth login
   ```
   - [ ] Authenticated

3. **Launch App**
   ```bash
   fly launch
   ```
   - [ ] Follow prompts (uses `fly.toml` config)
   - [ ] Choose region (closest to your users)
   - [ ] Allocate resources (1 CPU / 512MB for starter)

4. **Create Database**
   ```bash
   fly postgres create --name stellar-dominion-db
   fly postgres attach stellar-dominion-db
   ```
   - [ ] Database created and attached

5. **Set Secrets**
   ```bash
   fly secrets set SESSION_SECRET=your-random-secret-here
   fly secrets set NODE_ENV=production
   ```
   - [ ] Secrets configured

6. **Deploy**
   ```bash
   fly deploy
   ```
   - [ ] Deployment successful
   - [ ] Visit: `https://[app-name].fly.dev`

#### Configuration Files:
- `fly.toml` - Fly.io deployment configuration ✅
- `Dockerfile` - Container image definition ✅

---

### Option 4: Docker Deployment

**Why Docker?** Works anywhere, consistent environments, easy scaling.

#### Local Development with Docker:
```bash
# Start all services (app + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Docker Deployment:
1. **Build Image**
   ```bash
   docker build -t stellar-dominion:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 5000:5000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e SESSION_SECRET="your-secret" \
     -e NODE_ENV="production" \
     stellar-dominion:latest
   ```

3. **Or use Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

#### Configuration Files:
- `Dockerfile` - Production container image ✅
- `.dockerignore` - Exclude unnecessary files ✅
- `docker-compose.yml` - Multi-container setup ✅
- `nginx.conf` - Nginx reverse proxy (optional) ✅

---

### Option 5: Vercel (Serverless)

**Note:** Requires serverless-compatible database (Neon recommended).

#### Steps:
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** (via Vercel Dashboard)
   - [ ] `DATABASE_URL`
   - [ ] `SESSION_SECRET`
   - [ ] `NODE_ENV=production`

#### Configuration Files:
- `vercel.json` - Vercel configuration ✅

---

### Option 6: Traditional VPS/Cloud Servers

**Platforms:** DigitalOcean, AWS EC2, Linode, Vultr

#### Steps:
1. **Provision Server**
   - [ ] Ubuntu 22.04+ or similar
   - [ ] At least 1GB RAM, 1 CPU
   - [ ] Open ports 80 (HTTP) and 443 (HTTPS)

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install -y nginx
   ```

3. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE stellar_dominion;
   CREATE USER stellar_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE stellar_dominion TO stellar_user;
   \q
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/StellarDominion-2.git
   cd StellarDominion-2
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Setup environment
   cp .env.example .env
   nano .env  # Edit with your settings
   
   # Run database migrations
   npm run db:push
   ```

5. **Configure Nginx** (copy from `nginx.conf`)
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/stellar-dominion
   sudo ln -s /etc/nginx/sites-available/stellar-dominion /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Setup PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "stellar-dominion" -- start
   pm2 startup
   pm2 save
   ```

7. **Configure Firewall**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

#### Configuration Files:
- `nginx.conf` - Nginx configuration ✅
- `.env.example` - Environment template ✅

---

## 🔄 CI/CD Automation

### GitHub Actions Setup

**Automated deployment on push to main branch.**

#### Steps:
1. **Add Secrets to GitHub**
   - [ ] Go to repository Settings → Secrets and variables → Actions
   - [ ] Add required secrets:
     - `DATABASE_URL` (production database)
     - `RAILWAY_TOKEN` (if using Railway)
     - `FLY_API_TOKEN` (if using Fly.io)
     - `DOCKER_USERNAME` (if using Docker Hub)
     - `DOCKER_PASSWORD` (if using Docker Hub)

2. **Enable GitHub Actions**
   - [ ] Workflow file exists: `.github/workflows/deploy.yml` ✅
   - [ ] Push to main branch triggers deployment
   - [ ] Monitor Actions tab for deployment status

#### Configuration Files:
- `.github/workflows/deploy.yml` - CI/CD pipeline ✅

---

## ✅ Post-Deployment Verification

### Health Checks
- [ ] Visit deployed URL
- [ ] Check `/api/status` endpoint returns healthy status
- [ ] No errors in browser console (F12)
- [ ] App loads within 3-5 seconds

### Functionality Tests
- [ ] User registration works
- [ ] User login works (use admin credentials)
- [ ] Dashboard displays correctly
- [ ] Resources update properly
- [ ] Buildings can be constructed
- [ ] Combat system functional
- [ ] Messages send/receive
- [ ] Alliance features work

### Database Verification
- [ ] Database connection stable
- [ ] Data persists across restarts
- [ ] No connection timeouts
- [ ] Queries execute quickly (<100ms typical)

### Performance Checks
- [ ] Page load time acceptable (<3s)
- [ ] API response times good (<500ms)
- [ ] No memory leaks (monitor over 24h)
- [ ] CPU usage normal (<50% average)

### Security Checks
- [ ] HTTPS enabled (SSL certificate)
- [ ] `SESSION_SECRET` is strong and unique
- [ ] Database credentials secured
- [ ] Admin account password changed from default
- [ ] No sensitive data in browser console
- [ ] CORS configured properly
- [ ] Rate limiting active (if configured)

---

## 🔧 Troubleshooting

### Can't login after deployment?
→ **Check:** `DATABASE_URL` is set correctly in environment variables  
→ **Check:** Database schema initialized (`npm run db:push`)  
→ **Check:** Admin account exists in database

### Build fails?
→ **Check:** Run `npm install && npm run build` locally first  
→ **Check:** Node.js version matches (20.x)  
→ **Check:** All dependencies in `package.json`  
→ **Check:** TypeScript errors (`npm run check`)

### Page looks broken?
→ **Check:** Browser console for JavaScript errors (F12)  
→ **Check:** Hard refresh to clear cache (Ctrl+Shift+R)  
→ **Check:** Static assets loading correctly  
→ **Check:** Vite build output in `dist/` folder

### Database connection error?
→ **Check:** `DATABASE_URL` format: `postgresql://user:pass@host:port/db`  
→ **Check:** Database is running and accessible  
→ **Check:** Neon endpoint is active (not sleeping)  
→ **Check:** IP whitelist allows your server (if applicable)  
→ **Check:** SSL mode if required: `?sslmode=require`

### App crashes after deployment?
→ **Check:** Server logs for error messages  
→ **Check:** Memory limits (increase if needed)  
→ **Check:** Database connection pooling  
→ **Check:** Environment variables set correctly

### Slow performance?
→ **Check:** Database query optimization  
→ **Check:** Enable gzip compression  
→ **Check:** Use CDN for static assets  
→ **Check:** Increase server resources  
→ **Check:** Database indexes created

---

## 🌐 Custom Domain Setup

### Railway
1. Go to project Settings → Domains
2. Click "Add Domain"
3. Enter your domain
4. Add DNS records as instructed

### Render
1. Go to service Settings → Custom Domain
2. Add your domain
3. Configure DNS CNAME or A record

### Fly.io
```bash
fly certs create yourdomain.com
fly certs create www.yourdomain.com
```

### DNS Configuration (General)
**For most platforms:**
- **A Record:** Point to IP address (provided by platform)
- **CNAME:** Point `www` to your app URL

---

## 📚 Configuration Files Reference

All deployment files are included and configured:

| File | Purpose | Platform |
|------|---------|----------|
| `.env.example` | Environment template | All |
| `Dockerfile` | Container image | Docker, Fly.io |
| `.dockerignore` | Docker build exclusions | Docker |
| `docker-compose.yml` | Local Docker setup | Docker |
| `railway.json` | Railway config | Railway |
| `render.yaml` | Render config | Render |
| `fly.toml` | Fly.io config | Fly.io |
| `vercel.json` | Vercel config | Vercel |
| `Procfile` | Heroku-style platforms | Railway, Render |
| `nginx.conf` | Reverse proxy config | VPS/Cloud |
| `.github/workflows/deploy.yml` | CI/CD pipeline | GitHub Actions |

---

## 📞 Support & Resources

### Platform Documentation
- **Railway:** [docs.railway.app](https://docs.railway.app)
- **Render:** [render.com/docs](https://render.com/docs)
- **Fly.io:** [fly.io/docs](https://fly.io/docs)
- **Docker:** [docs.docker.com](https://docs.docker.com)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)

### Database (Neon)
- **Documentation:** [neon.tech/docs](https://neon.tech/docs)
- **Dashboard:** [console.neon.tech](https://console.neon.tech)

### Getting Help
- Check [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for development setup
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- See [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md) for admin access

---

## 🎉 Your Deployed App

Once deployed, your app will be live at:

- **Railway:** `https://[project-name].up.railway.app`
- **Render:** `https://[project-name].onrender.com`
- **Fly.io:** `https://[app-name].fly.dev`
- **Custom Domain:** `https://yourdomain.com` (after DNS setup)

---

## 🚀 Next Steps After Deployment

- [ ] Monitor application performance
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure automated backups
- [ ] Setup monitoring/alerting
- [ ] Enable analytics (optional)
- [ ] Share with users and gather feedback
- [ ] Plan feature updates

---

**Good luck deploying Stellar Dominion! May your empire span the stars! 🌌✨**

---

*Developed by Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))*
