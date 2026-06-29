# Build Executable Guide

Guide for building standalone executables from the Universe Empire Dominion 3 codebase.

---

## Overview

The build process compiles the TypeScript codebase into deployable artifacts for both client and server.

---

## Build Commands

### Development Build

```bash
npm run dev
```

Starts Vite dev server + Express server with hot reload.

> **Source:** `server/vite.ts` — Vite dev server
> **Source:** `server/index.ts` — Express server

### Production Build

```bash
npm run build
```

Compiles client assets to `dist/` and server to `dist/` (or configured output).

> **Source:** `server/static.ts` — static file serving

### Start Production

```bash
npm start
```

Runs the production server.

> **Source:** `server/index.ts`

---

## Build Configuration

### Client Build (Vite)

| File | Purpose |
|------|---------|
| `client/vite.config.ts` | Vite configuration (if exists) |
| `client/src/main.tsx` | Client entry point |
| `client/src/App.tsx` | Root component |

> **Source:** `client/src/main.tsx`
> **Source:** `client/src/App.tsx`

### Server Build

| File | Purpose |
|------|---------|
| `server/index.ts` | Server entry point |
| `server/routes.ts` | Route registration |
| `server/static.ts` | Static file serving |
| `server/vite.ts` | Vite integration |

> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `server/static.ts`

---

## Build Artifacts

### Client

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

### Server

```
dist/
├── index.js (or server bundle)
└── ...
```

---

## Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:5432/db
SESSION_SECRET=your-secret
NODE_ENV=production
PORT=3000
```

> **Source:** `server/loadEnv.ts` — environment loading

---

## Database Setup for Production

### 1. Create Database

```bash
createdb universe_empire
```

### 2. Apply Schema

```bash
npm run db:push
```

### 3. Seed Data (Optional)

```bash
npm run db:seed
```

> **Source:** `server/db/init.ts` — schema initialization
> **Source:** `server/db/index.ts` — database connection
> **Source:** `shared/schema.ts` — schema definitions
> **Source:** `server/db/system-settings-seed.ts` — seed data
> **Source:** `shared/sql/settings/index.ts` — SQL seeds

---

## Docker Build (Optional)

If using Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Deployment Platforms

### Railway

| File | Purpose |
|------|---------|
| `docs/RAILWAY_DEPLOYMENT.md` | Railway deployment guide |

> **Source:** `docs/RAILWAY_DEPLOYMENT.md`

### General

| File | Purpose |
|------|---------|
| `docs/DEPLOYMENT_GUIDE.md` | General deployment guide |
| `docs/DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |
| `docs/HOSTING_GUIDE.md` | Hosting options |

> **Source:** `docs/DEPLOYMENT_GUIDE.md`
> **Source:** `docs/DEPLOYMENT_CHECKLIST.md`
> **Source:** `docs/HOSTING_GUIDE.md`

---

## Post-Build Verification

### 1. Start Server

```bash
npm start
```

### 2. Verify Endpoints

- Client: `http://localhost:3000`
- API: `http://localhost:3000/api/`

> **Source:** `server/index.ts`

### 3. Check Database

Verify tables exist in PostgreSQL.

> **Source:** `server/db/index.ts`
> **Source:** `shared/schema.ts`

---

## Common Build Issues

### 1. TypeScript Errors

Run type checker:
```bash
npm run typecheck
```

> **Source:** `shared/schema.ts`
> **Source:** `shared/api-types.ts`

### 2. Missing Dependencies

```bash
npm install
```

### 3. Database Connection

Check `DATABASE_URL` in `.env`.

> **Source:** `server/db/index.ts`

### 4. Port Conflicts

Change port in `server/index.ts` or `.env`.

> **Source:** `server/index.ts`

---

## Build Optimization

### Client

- Code splitting via Vite
- Lazy loading of pages (see `client/src/App.tsx`)
- Tree shaking of unused imports

> **Source:** `client/src/App.tsx`

### Server

- Route modularization (65+ route files)
- Service separation (29 services)
- Efficient database queries in `server/storage.ts`

> **Source:** `server/routes.ts`
> **Source:** `server/services/`
> **Source:** `server/storage.ts`

---

## Rollback

If a build fails after deployment:

1. Check server logs
2. Verify database schema matches code
3. Roll back to previous version
4. Re-run `npm run db:push` if needed

> **Source:** `server/db/init.ts`
> **Source:** `server/update-manager.ts`
