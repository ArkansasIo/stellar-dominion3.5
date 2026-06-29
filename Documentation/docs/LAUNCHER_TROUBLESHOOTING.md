# Launcher Troubleshooting

Troubleshooting guide for launcher and deployment issues.

---

## Common Launcher Issues

### 1. Server Won't Start

**Symptoms:** Server crashes on startup or fails to bind port.

**Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Port already in use | Change port in `server/index.ts` or kill conflicting process |
| Missing environment variables | Check `.env` file, see `server/loadEnv.ts` |
| Database connection failed | Verify PostgreSQL is running, check `DATABASE_URL` |
| Missing dependencies | Run `npm install` |

> **Source:** `server/index.ts`
> **Source:** `server/loadEnv.ts`
> **Source:** `server/db/index.ts`

### 2. Database Connection Issues

**Symptoms:** "Connection refused" or "ECONNREFUSED" errors.

**Fixes:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check `DATABASE_URL` in `.env`
3. Verify database exists: `createdb universe_empire`
4. Run schema initialization: `npm run db:push`

> **Source:** `server/db/index.ts`
> **Source:** `server/db/init.ts`
> **Source:** `shared/schema.ts`

### 3. Vite Dev Server Issues

**Symptoms:** Client not loading, HMR not working.

**Fixes:**
1. Check `server/vite.ts` configuration
2. Verify Vite is installed: `npm list vite`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Restart dev server

> **Source:** `server/vite.ts`
> **Source:** `server/index.ts`

### 4. Static File Serving Issues

**Symptoms:** 404 errors for static assets in production.

**Fixes:**
1. Run `npm run build` to generate production assets
2. Check `server/static.ts` configuration
3. Verify `dist/` directory exists

> **Source:** `server/static.ts`

---

## Deployment Issues

### Railway Deployment

| File | Purpose |
|------|---------|
| `docs/RAILWAY_DEPLOYMENT.md` | Railway-specific deployment guide |

> **Source:** `docs/RAILWAY_DEPLOYMENT.md`

### General Deployment

| File | Purpose |
|------|---------|
| `docs/DEPLOYMENT_GUIDE.md` | General deployment guide |
| `docs/DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |
| `docs/DEPLOYMENT_STATUS.md` | Current deployment status |

> **Source:** `docs/DEPLOYMENT_GUIDE.md`
> **Source:** `docs/DEPLOYMENT_CHECKLIST.md`
> **Source:** `docs/DEPLOYMENT_STATUS.md`

---

## Update System Issues

| File | Purpose |
|------|---------|
| `server/update-manager.ts` | Server update management |
| `client/src/lib/update-client.ts` | Client update logic |

**Common Issues:**
1. Update not applying — check `server/update-manager.ts` logs
2. Client cache issues — clear browser cache
3. Version mismatch — verify `package.json` version

> **Source:** `server/update-manager.ts`
> **Source:** `client/src/lib/update-client.ts`

---

## Authentication Issues

| File | Purpose |
|------|---------|
| `server/basicAuth.ts` | Basic HTTP auth |
| `server/replitAuth.ts` | Replit OAuth |
| `server/middleware/adminIpCheck.ts` | Admin IP whitelist |
| `client/src/hooks/useAuth.ts` | Client auth state |

**Common Issues:**
1. Auth not working — check session configuration
2. Admin access denied — verify IP in whitelist
3. OAuth redirect failing — check redirect URLs

> **Source:** `server/basicAuth.ts`
> **Source:** `server/replitAuth.ts`
> **Source:** `server/middleware/adminIpCheck.ts`

---

## Performance Issues

### Slow Database Queries

Check `server/storage.ts` for query optimization.

> **Source:** `server/storage.ts`

### Large Bundle Size

Check client build output, optimize imports in `client/src/lib/`.

> **Source:** `client/src/lib/`

### Memory Issues

Monitor server memory usage, check `server/gameEngine.ts` for memory leaks.

> **Source:** `server/gameEngine.ts`

---

## Debug Tools

| File | Purpose |
|------|---------|
| `server/services/debugService.ts` | Debug utilities |
| `server/routes-diagnostics.ts` | Diagnostics endpoints |
| `client/src/pages/Diagnostics.tsx` | Diagnostics UI |
| `client/src/pages/ServerConsole.tsx` | Server console UI |

> **Source:** `server/services/debugService.ts`
> **Source:** `server/routes-diagnostics.ts`
> **Source:** `client/src/pages/Diagnostics.tsx`
> **Source:** `client/src/pages/ServerConsole.tsx`

---

## Log Files

| Log | Location |
|-----|----------|
| Server logs | stdout/stderr |
| Error logs | Check terminal output |
| Database logs | PostgreSQL logs |

---

## Getting Help

1. Check this troubleshooting guide
2. Review `docs/DEVELOPER_GUIDE.md`
3. Check `docs/DEVELOPER_QUICK_REFERENCE.md`
4. Run diagnostics: `client/src/pages/Diagnostics.tsx`

> **Source:** `docs/DEVELOPER_GUIDE.md`
> **Source:** `docs/DEVELOPER_QUICK_REFERENCE.md`
> **Source:** `client/src/pages/Diagnostics.tsx`
