# Stellar Dominion 3.5 — Project File Manifest

This repository is already a large full-stack codebase. This manifest defines the canonical file groups that must remain present for the application to build and deploy.

## Core application

- `package.json` — Node/npm scripts and dependencies
- `tsconfig.json` — TypeScript configuration
- `vite.config.ts` — React/Vite build configuration
- `client/index.html` — browser entry document
- `client/src/main.tsx` — React bootstrap and GitHub Pages router base handling
- `client/src/App.tsx` — application shell and routes
- `client/src/` — pages, components, hooks, game UI, styles and client services
- `shared/` — shared schemas, types, configuration and game data
- `server/index.ts` — Express application entry point
- `server/routes.ts` — API registration hub
- `server/routes-*.ts` — feature API route modules
- `server/services/` — business services
- `server/systems/` — game systems and simulation logic
- `server/db.ts` / `server/db/` — database access
- `server/gameEngine.ts` — persistent game loop
- `server/combatEngine.ts` — combat simulation

## Data and database

- `shared/schema.ts` — Drizzle schema
- `database/` — seed and database utilities
- `migrations/` — generated database migrations
- `.env.example` — environment configuration template
- `.admin-config.example.json` — admin configuration template
- `.admin-credentials.example.json` — admin credential template

## Frontend deployment

- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment
- `client/public/` — static assets
- Vite base path: `/stellar-dominion3.5/` when `VITE_BASE_PATH` is set by the Pages workflow
- SPA fallback: `dist/public/404.html`
- Jekyll disabled during deployment with `dist/public/.nojekyll`

## Validation

Run:

```bash
npm run check
npx tsx scripts/verify-project-files.ts
npm run build
```

The verification script checks required core files and validates local relative imports referenced by `server/index.ts`.

## Important rule

Do not create duplicate route modules, services, pages, or schema files when an implementation already exists. Extend the existing module instead. This keeps the large Stellar Dominion feature set coherent and prevents duplicate API registrations.
