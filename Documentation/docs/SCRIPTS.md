# Scripts Reference

All npm scripts, custom scripts, and CLI tools.

## npm Scripts

> **Source:** package.json

### Development

| Command | Description | Source |
|---------|-------------|--------|
| `npm run dev` | Full-stack dev server (frontend + backend) | `script/dev.ts` |
| `npm run dev:client` | Frontend only (Vite on port 5001) | - |
| `npm run dev:server` | Backend only (tsx server/index.ts) | - |

### Build & Start

| Command | Description | Source |
|---------|-------------|--------|
| `npm run build` | Production build (Vite + esbuild) | `script/build.ts` |
| `npm start` | Run production server (`node dist/index.cjs`) | - |

### Type Checking

| Command | Description |
|---------|-------------|
| `npm run check` | TypeScript type check (no emit) |

### Database

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema to PostgreSQL |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:seed:ogame` | Seed OGame catalog data |

> **Source:** shared/schema.ts (Drizzle schema)

### Admin

| Command | Description | Source |
|---------|-------------|--------|
| `npm run admin` | Interactive admin CLI | `server/adminCli.ts` |
| `npm run admin:create` | Create admin account | `script/create-new-admin.ts` |
| `npm run admin:manage` | Manage admin accounts | `script/manage-admin.ts` |

> **Source:** server/adminPermissions.ts
> **Source:** shared/config/adminConfig.ts
> **Source:** shared/config/adminCredentialsConfig.ts

### Smoke Tests

| Command | Description | Source |
|---------|-------------|--------|
| `npm run smoke:life-support` | Life support system smoke test | `script/smoke-life-support.ts` |

## Custom Scripts

### script/ Directory

> **Source:** script/build.ts

| Script | Purpose |
|--------|---------|
| `script/build.ts` | Production build orchestration |
| `script/dev.ts` | Development server with auto-detection |
| `script/smoke-life-support.ts` | Life support smoke test |
| `script/smoke-raid-operations.ts` | Raid operations smoke test |
| `script/smoke-power-grid.ts` | Power grid smoke test |
| `script/smoke-orbital-defense.ts` | Orbital defense smoke test |
| `script/seed-ogame-catalog.ts` | Seed OGame catalog |
| `script/seed-test-users.ts` | Seed test users |
| `script/create-new-admin.ts` | Create admin accounts |
| `script/create-admin.ts` | Admin creation utility |
| `script/manage-admin.ts` | Admin management |
| `script/generate-research.ts` | Generate research data |
| `script/researches.ts` | Research utilities |
| `script/researchRecommendationsService.ts` | Research recommendations |
| `script/debug.ts` | Debug utilities |
| `script/create-db.js` | Database creation |

### scripts/ Directory

| Script | Purpose |
|--------|---------|
| `scripts/create-patch.js` | Create patch files |
| `scripts/deploy-patch.js` | Deploy patches |
| `scripts/generate-game-images.py` | Generate game image assets |

## Execution Flow

### Development

```
npm run dev
  -> script/dev.ts
    -> Checks DATABASE_URL
      -> Found: starts dev:server + dev:client
      -> Not found: starts dev:client only
```

### Build

```
npm run build
  -> script/build.ts
    -> Cleans dist/
    -> Builds client (Vite) -> dist/public/
    -> Builds server (esbuild) -> dist/index.cjs
```

### Deployment

```
npm start
  -> NODE_ENV=production node dist/index.cjs
  -> Serves from dist/ folder
```

## Quick Reference

| Command | Environment | Database Required |
|---------|-------------|-------------------|
| `npm run dev` | Development | Optional |
| `npm run dev:client` | Development | No |
| `npm run dev:server` | Development | Yes |
| `npm run build` | Any | No |
| `npm start` | Production | Yes |
| `npm run check` | Any | No |
| `npm run db:push` | Any | Yes |
| `npm run admin` | Any | Yes |
