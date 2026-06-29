# Xenoberage Integration Plan

**Last Updated:** June 18, 2026

---

## Overview

This plan describes the migration of Xenoberage's PHP-based game logic into the Universe Empire Dominion TypeScript/Node.js stack. The integration follows a phased approach to minimize risk.

---

## Phase 1: API Layer (Completed)

### Authentication

> **Source:** server/basicAuth.ts

- Session-based auth with `express-session` + `memorystore`
- Register, login, logout, password reset endpoints
- Admin login with security code verification
- Dev bypass for local development
- Basic Auth header fallback for API consumers

### Route Registration

> **Source:** server/index.ts

All 50+ route modules are registered in the Express app via `server/index.ts`. Each module is an independent file in `server/routes-*.ts`.

### Validation

> **Source:** server/routes-api-core.ts

Zod schemas for input validation. Middleware factory `validate()` integrates with Express route handlers.

---

## Phase 2: Data Layer (Completed)

### Database Schema

> **Source:** shared/schema.ts

Drizzle ORM schema with tables for:
- Users, player states, admin users
- Alliances, alliance members
- Market orders, auction listings, auction bids
- Player currency, currency transactions
- Bank accounts, bank transactions
- Empire values, player items
- Messages, missions, boss definitions

### Storage Layer

> **Source:** server/storage.ts

Unified storage interface abstracting database operations. All route handlers interact through this layer.

---

## Phase 3: Frontend Integration (Completed)

### API Client

> **Source:** client/src/lib/api-client.ts

Centralized HTTP client with type-safe methods for all endpoints. Automatic session cookie handling.

### React Query Hooks

> **Source:** client/src/hooks/useApi.ts

Pre-configured hooks for all API endpoints with caching, refetching, and invalidation.

### Shared Types

> **Source:** shared/api-types.ts

TypeScript interfaces shared between client and server.

---

## Phase 4: Game Systems (Completed)

Each game system has its own route module, service, and (where applicable) client-side library:

| System | Route File | Service/File |
|--------|------------|-------------|
| Government Progression | `server/routes-government-progression.ts` | `server/services/governmentProgressionService.ts`, `shared/config/governmentProgressionTreeConfig.ts` |
| Ship Fitting | — | `client/src/lib/shipFittingModules.ts`, `client/src/pages/Fitting.tsx`, `client/src/pages/FittingEnhanced.tsx` |
| Interplanetary Power Grid | — | `client/src/lib/interplanetaryPowerGrid.ts`, `client/src/lib/interplanetaryPowerSimulation.ts`, `client/src/pages/PowerGrid.tsx` |
| Orbital Defense | — | `client/src/lib/orbitalDefenseSystem.ts`, `client/src/pages/OrbitalDefense.tsx` |
| Army System | `server/routes-army-system.ts` | — |
| Commander System | `server/routes-commanders.ts` | `server/services/raidOperationsService.ts` |
| Research | `server/routes-research.ts`, `server/routes-researchlab.ts`, `server/routes-researchxp.ts` | `server/services/researchLabService.ts`, `server/services/researchXPService.ts` |
| Espionage | `server/routes-espionage.ts` | — |
| High Command | `server/routes-high-command.ts` | — |
| Smithy | `server/routes-smithy.ts` | — |
| Spore Drive | `server/routes-spore-drive.ts` | — |
| Megastructures | `server/routes-megastructures.ts` | `server/services/megastructureService.ts` |
| Bank Vault | `server/routes-bank-vault.ts` | — |
| Autobuy Resources | `server/routes-autobuyresources.ts` | — |
| Live Ops | `server/routes-liveops.ts` | — |
| Civilization | `server/routes-civilization.ts`, `server/routes-civilization-system.ts` | — |

---

## Phase 5: Deployment

### Server Startup

> **Source:** server/index.ts

The Express server:
1. Sets up session middleware via `setupAuth(app)`
2. Registers all route modules
3. Serves static files in production
4. Starts the Vite dev server in development

### Environment Variables

Key environment variables for deployment:

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Session encryption key |
| `ADMIN_SECURITY_CODE` | Admin login security code |
| `ADMIN_BOOTSTRAP_*` | Bootstrap admin account credentials |
| `DEV_AUTH_BYPASS` | Enable dev auth bypass |
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | Environment mode |

---

## Migration Checklist

> **Source:** docs/Xenoberage-Migration-Checklist.md

- [x] GDD and ER diagram created
- [x] TypeScript interfaces defined
- [x] API endpoint design drafted
- [x] Frontend folder structure scaffolded
- [x] API service layer implemented
- [x] Session/auth handling implemented
- [x] PHP API endpoints replaced with TypeScript routes
- [x] TypeScript frontend components built
- [x] Session/auth integrated end-to-end
- [x] All API and UI flows tested
- [x] Documentation updated

---

**See also:**
- [Xenoberage-Migration-Checklist.md](./Xenoberage-Migration-Checklist.md) — Migration checklist
- [Xenoberage-Session-Auth.md](./Xenoberage-Session-Auth.md) — Session auth details
- [Xenoberage-API-Design.md](./Xenoberage-API-Design.md) — API design patterns
