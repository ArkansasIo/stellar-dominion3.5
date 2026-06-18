# 📜 Scripts Reference

Complete guide to all npm scripts and CLI tools for Stellar Dominion.

**Developer:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))

---

## 📋 Table of Contents

- [Development Scripts](#development-scripts)
- [Build Scripts](#build-scripts)
- [Database Scripts](#database-scripts)
- [Admin Scripts](#admin-scripts)
- [Utility Scripts](#utility-scripts)
- [Custom Scripts](#custom-scripts)

---

## 🛠️ Development Scripts

### `npm run dev`
**Description:** Start the full-stack development server (frontend + backend)

**Features:**
- Automatically detects if DATABASE_URL is set
- Falls back to client-only mode if no database
- Hot module replacement (HMR) for React
- TypeScript compilation on the fly
- Auto-restart on server changes

**Usage:**
```bash
npm run dev
```

**What it does:**
1. Checks for DATABASE_URL environment variable
2. If found: Starts both frontend (Vite) and backend (Express)
3. If not found: Starts frontend only in client mode
4. Opens browser automatically

**Configuration:**
- Port: 5000 (auto-increments if busy)
- Script location: `script/dev.ts`
- Environment: Development

**Troubleshooting:**
- **Port in use?** Vite auto-finds next available port
- **Database errors?** Falls back to client-only mode automatically
- **Changes not showing?** Hard refresh (Ctrl+Shift+R)

---

### `npm run dev:client`
**Description:** Start only the frontend development server

**Usage:**
```bash
npm run dev:client
```

**When to use:**
- Backend server running separately
- Frontend development only
- No database needed for UI work

**Configuration:**
- Port: 5000 (configurable in command)
- Vite dev server with HMR
- Proxies API calls to separate backend

---

### `npm run dev:server`
**Description:** Start only the backend server

**Usage:**
```bash
# Requires DATABASE_URL
npm run dev:server
```

**Prerequisites:**
```bash
# Set database URL
export DATABASE_URL=postgresql://user:pass@host:5432/db
# or in .env file
```

**When to use:**
- Backend development only
- Testing API endpoints
- Database work
- Server configuration changes

**Configuration:**
- Port: 5000 (from PORT env var or default)
- Auto-restart with tsx watch mode
- Environment: Development

---

## 🏗️ Build Scripts

### `npm run build`
**Description:** Build the application for production

**Usage:**
```bash
npm run build
```

**Output:**
- `dist/` - Server bundle (Node.js)
- `dist/public/` - Client bundle (static files)

**What it does:**
1. Cleans previous build
2. Builds client (Vite) → `dist/public/`
3. Builds server (esbuild) → `dist/index.cjs`
4. Generates metadata files
5. Optimizes assets

**Performance:**
- Minification: Enabled
- Tree shaking: Enabled
- Code splitting: Automatic
- Asset optimization: Enabled

**Configuration:**
- Build script: `script/build.ts`
- Vite config: `vite.config.ts`
- TypeScript config: `tsconfig.json`

**Deployment:**
```bash
# After build
npm start  # Runs production server from dist/
```

---

### `npm start`
**Description:** Run production server from build

**Usage:**
```bash
npm start
```

**Prerequisites:**
```bash
# Must build first
npm run build

# Set production environment
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export SESSION_SECRET=your-secret
```

**When to use:**
- Production deployment
- Testing production build locally
- Verifying build works before deploying

**Configuration:**
- Serves from `dist/` folder
- Production mode (no dev tools)
- Optimized performance

---

## 🗄️ Database Scripts

### `npm run db:push`
**Description:** Push database schema to PostgreSQL

**Usage:**
```bash
npm run db:push
```

**What it does:**
1. Reads schema from `shared/schema.ts`
2. Generates SQL migration
3. Applies changes to database
4. Creates/updates tables, indexes, constraints

**Prerequisites:**
```bash
# Set DATABASE_URL
export DATABASE_URL=postgresql://user:pass@host:5432/db
```

**When to use:**
- Initial database setup
- After schema changes
- Before first deployment
- Database migrations

**Safety:**
- **WARNING:** This can modify production data
- Always backup before running in production
- Test in development first

**Advanced options:**
```bash
# Dry run (preview changes without applying)
npm run db:push -- --dry-run

# Strict mode (fail on any warnings)
npm run db:push -- --strict

# Force apply (skip confirmation)
npm run db:push -- --force
```

**Troubleshooting:**
- **Connection refused:** Check DATABASE_URL is correct
- **Permission denied:** Verify database user has CREATE privileges
- **Schema conflicts:** Review changes carefully before applying

---

### Database CLI (Advanced)

**Direct database access:**
```bash
# Connect to database
psql $DATABASE_URL

# Run SQL file
psql $DATABASE_URL -f sql/schema/game.sql

# Query database
psql $DATABASE_URL -c "SELECT * FROM users LIMIT 10"
```

**Backup/Restore:**
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Backup specific tables
pg_dump $DATABASE_URL -t users -t player_states > users_backup.sql
```

---

## 👑 Admin Scripts

### `npm run admin`
**Description:** Admin CLI tool for user management

**Usage:**
```bash
npm run admin
```

**Interactive Menu:**
```
Stellar Dominion - Admin CLI
1. Create Admin User
2. Reset Admin Password
3. List All Users
4. View User Details
5. Delete User
6. Grant Admin Privileges
7. Revoke Admin Privileges
8. Exit
```

**Commands:**

#### Create Admin User
```bash
npm run admin
# Choose option 1
# Enter username, password, email
```

#### Reset Password
```bash
npm run admin
# Choose option 2
# Enter username and new password
```

#### List Users
```bash
npm run admin
# Choose option 3
# Displays all users with roles
```

**Prerequisites:**
- DATABASE_URL must be set
- Database schema must be initialized

**Security:**
- Passwords are bcrypt hashed
- Admin actions are logged
- Requires database access

**Configuration:**
- Script location: `server/adminCli.ts`
- Configuration: `shared/config/adminConfig.ts`

---

## ✅ Utility Scripts

### `npm run check`
**Description:** TypeScript type checking (no emit)

**Usage:**
```bash
npm run check
```

**What it does:**
- Checks all TypeScript files for type errors
- No code generation (fast)
- Reports errors with file locations

**When to use:**
- Before committing code
- Pre-deployment validation
- CI/CD pipelines
- Code reviews

**Expected output:**
```bash
# No errors
$ npm run check
> rest-express@1.0.0 check
> tsc

# Exit code: 0 (success)
```

**Common errors:**
- Type mismatches
- Missing properties
- Incorrect imports
- Null/undefined safety violations

---

### Linting (Future)

**Not yet configured, but recommended:**
```json
// package.json (to add)
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

---

### Testing (Future)

**Not yet configured, but recommended:**
```json
// package.json (to add)
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 🔧 Custom Scripts

### Windows Development

**PowerShell script for easy development:**

Create `dev.ps1`:
```powershell
# Load environment
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Start development
npm run dev
```

Usage:
```powershell
.\dev.ps1
```

---

### Database Reset (Development Only)

**⚠️ DANGER: Deletes all data!**

Create `db-reset.sh`:
```bash
#!/bin/bash
set -e

echo "⚠️  WARNING: This will DELETE all data!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo "Dropping database..."
    psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    
    echo "Recreating schema..."
    npm run db:push
    
    echo "Creating admin user..."
    npm run admin
    
    echo "✅ Database reset complete!"
else
    echo "Cancelled."
fi
```

Usage:
```bash
chmod +x db-reset.sh
./db-reset.sh
```

---

### Production Health Check

Create `health-check.sh`:
```bash
#!/bin/bash

URL="${1:-http://localhost:5000}"

echo "Checking $URL..."

# Check status endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/status")

if [ "$response" = "200" ]; then
    echo "✅ Server is healthy (HTTP $response)"
    exit 0
else
    echo "❌ Server is unhealthy (HTTP $response)"
    exit 1
fi
```

Usage:
```bash
chmod +x health-check.sh
./health-check.sh https://your-app.com
```

---

### Backup Script

Create `backup.sh`:
```bash
#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="stellar_dominion_$DATE.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $FILENAME"
pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"

# Compress
gzip "$BACKUP_DIR/$FILENAME"

echo "✅ Backup complete: $BACKUP_DIR/$FILENAME.gz"

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete
```

Usage:
```bash
chmod +x backup.sh
./backup.sh

# Or schedule with cron
0 2 * * * /path/to/backup.sh
```

---

## 📊 Script Execution Flow

### Development Workflow

```
npm run dev
    ↓
script/dev.ts
    ↓
Checks DATABASE_URL
    ↓
├─ Found: Starts dev:server + dev:client
│      ↓
│   Backend (tsx server/index.ts)
│   Frontend (vite dev --port 5000)
│
└─ Not Found: Starts dev:client only
       ↓
    Frontend only (vite dev --port 5000)
```

### Build Workflow

```
npm run build
    ↓
script/build.ts
    ↓
Clean dist/
    ↓
Build Client (Vite)
    ↓
Build Server (esbuild)
    ↓
Output: dist/
```

### Deployment Workflow

```
npm run build
    ↓
npm start
    ↓
NODE_ENV=production node dist/index.cjs
    ↓
Serves production app
```

---

## 🚀 Quick Reference

| Command | Purpose | Environment | Database Required |
|---------|---------|-------------|-------------------|
| `npm run dev` | Full-stack dev server | Development | Optional |
| `npm run dev:client` | Frontend only | Development | No |
| `npm run dev:server` | Backend only | Development | Yes |
| `npm run build` | Build for production | Production | No |
| `npm start` | Run production build | Production | Yes |
| `npm run check` | TypeScript validation | Any | No |
| `npm run db:push` | Database migrations | Any | Yes |
| `npm run admin` | Admin CLI tool | Any | Yes |

---

## 🔒 Environment Variables Reference

**Required for development:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
```

**Required for production:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=your-random-secret-here
```

**Optional:**
```env
PORT=5000
LOG_LEVEL=info
LOG_QUERIES=false
DEBUG=false
```

See `.env.example` for complete list.

---

## 📝 Adding New Scripts

To add a custom script:

1. **Edit package.json:**
```json
{
  "scripts": {
    "your-script": "tsx your-script.ts"
  }
}
```

2. **Create script file:**
```typescript
// your-script.ts
console.log("Hello from custom script!");
```

3. **Run script:**
```bash
npm run your-script
```

---

## 🐛 Debugging Scripts

**Enable verbose logging:**
```bash
# Verbose npm output
npm run dev --verbose

# Debug Node.js
NODE_OPTIONS="--inspect" npm run dev:server

# Debug TypeScript
DEBUG=* npm run dev
```

**Check script definition:**
```bash
npm run
# Lists all available scripts
```

**Validate package.json:**
```bash
npm run check:package  # Shows any errors
```

---

## 📞 Getting Help

- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Development setup
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

---

**Happy scripting! 🎯**

*Developed by Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))*
