# API Implementation Summary

**Version:** 2.0.0
**Last Updated:** June 18, 2026

---

## Overview

Universe Empire Dominion has a comprehensive API system spanning 50+ route files, a shared type layer, a centralized client, and React Query hooks.

---

## Architecture

### Server Layer

| File | Purpose |
|------|---------|
| `server/index.ts` | Express app bootstrap, registers all route modules |
| `server/basicAuth.ts` | Session setup, auth middleware, register/login/logout, admin bootstrap |
| `server/routes-api-core.ts` | Shared middleware, Zod validation schemas, response wrappers |
| `server/routes.ts` | Core game routes (auth, player state, currency, bank, empire, auctions, raids) |
| `server/routes-account.ts` | Account profile and password management |
| `server/routes-achievements.ts` | Achievement system |
| `server/routes-admin.ts` | Admin panel (user management, backups, audit log) |
| `server/routes-alliances.ts` | Alliance CRUD, diplomacy, wars |
| `server/routes-army-building-structures.ts` | Army building catalog and construction |
| `server/routes-army-system.ts` | Army deployment, training, combat |
| `server/routes-artifacts.ts` | Artifact summary |
| `server/routes-assets.ts` | Asset upload and management |
| `server/routes-autobuyresources.ts` | Automated resource purchasing rules |
| `server/routes-bank-vault.ts` | Vault deposit, withdrawal, exchange, insurance |
| `server/routes-civilization.ts` | Civilization job configuration |
| `server/routes-civilization-system.ts` | Civilization state and management |
| `server/routes-combat.ts` | Combat simulation and battle logs |
| `server/routes-commanders.ts` | Commander gacha and profiles |
| `server/routes-constructor-yard.ts` | Construction yard operations |
| `server/routes-customlabs.ts` | Custom research labs |
| `server/routes-database-admin.ts` | Direct database management |
| `server/routes-diagnostics.ts` | Issue tracking and diagnostics |
| `server/routes-empire-combat-universe.ts` | Empire-wide combat profiles |
| `server/routes-espionage.ts` | Espionage scans and sabotage |
| `server/routes-expeditions.ts` | Expedition catalog |
| `server/routes-forums.ts` | Forum threads and replies |
| `server/routes-friends.ts` | Friend requests and management |
| `server/routes-galaxy.ts` | Galaxy map and scanning |
| `server/routes-game.ts` | Game resources and fleet data |
| `server/routes-game-asset-library.ts` | Asset library browsing |
| `server/routes-gameactions.ts` | Core game actions (build, research, fleet) |
| `server/routes-government-buildings.ts` | Government building catalog |
| `server/routes-government-leaders.ts` | Leader appointments |
| `server/routes-government-progression.ts` | Government progression tree |
| `server/routes-guilds.ts` | Guild management and chat |
| `server/routes-high-command.ts` | High command officers and orders |
| `server/routes-leaderboard.ts` | Player leaderboards |
| `server/routes-lifesupport.ts` | Life support systems |
| `server/routes-liveops.ts` | Battle pass, season pass, store |
| `server/routes-megastructures.ts` | Megastructure construction |
| `server/routes-messages.ts` | In-game messaging |
| `server/routes-missing.ts` | Raids, relics, events, expeditions, missions |
| `server/routes-moons.ts` | Moon generation and modules |
| `server/routes-multiplayerbonuses.ts` | Alliance research bonuses |
| `server/routes-ogame.ts` | OGame data import and calculations |
| `server/routes-orbital-stations.ts` | Orbital station management |
| `server/routes-phpmyadmin.ts` | Database admin interface |
| `server/routes-planets.ts` | Planet management |
| `server/routes-realms.ts` | Realm joining |
| `server/routes-recommendations.ts` | Research recommendations |
| `server/routes-research.ts` | Research tree and progression |
| `server/routes-researchlab.ts` | Research lab management |
| `server/routes-researchxp.ts` | Research XP and discoveries |
| `server/routes-resource-trading.ts` | Resource exchange |
| `server/routes-settings.ts` | Player settings |
| `server/routes-smithy.ts` | Smithy crafting |
| `server/routes-spore-drive.ts` | Spore drive mechanics |
| `server/routes-status.ts` | Health and metrics |
| `server/routes-trades.ts` | Player-to-player trades |
| `server/routes-trading.ts` | Trading request system |
| `server/routes-travel.ts` | Travel routes and costs |
| `server/routes-turnsystem.ts` | Turn-based mechanics |
| `server/routes-unit-taxonomy.ts` | Unit classification |
| `server/routes-unitsystems.ts` | Unit training and construction |
| `server/routes-universe-seed.ts` | Universe generation |
| `server/routes-worldactions.ts` | World market and exchange |

### Client Layer

| File | Purpose |
|------|---------|
| `client/src/lib/api-client.ts` | Centralized HTTP client with type-safe methods |
| `client/src/hooks/useApi.ts` | React Query hooks for all endpoints |
| `shared/api-types.ts` | Shared TypeScript interfaces |
| `shared/schema.ts` | Drizzle ORM database schema |

---

## Key Exports

### From `server/routes-api-core.ts`

> **Source:** server/routes-api-core.ts

```typescript
isAuthenticated     // Authentication middleware
getUserId           // Extract user ID from session
schemas             // Zod validation schemas for all endpoints
validate            // Validation middleware factory
apiResponse         // Standard response formatters (success, error, paginated)
errorHandler        // Global error handler
asyncHandler        // Async error wrapper
```

### From `server/basicAuth.ts`

> **Source:** server/basicAuth.ts

```typescript
getSession          // Express session configuration
setupAuth           // Register auth routes and middleware
isAuthenticated     // Multi-tier auth middleware (session → basic auth → dev bypass)
```

---

## Integration Guide

### Server-Side

1. Import core utilities from `server/routes-api-core.ts` or `server/basicAuth.ts`
2. Use `isAuthenticated` for protected routes
3. Use `validate(schema)` for input validation
4. Use `apiResponse.success/error` for consistent responses
5. Register route modules in `server/index.ts`

### Client-Side

> **Source:** client/src/lib/api-client.ts

```typescript
import api from '@/lib/api-client';
const state = await api.player.getState();
```

### React Hooks

> **Source:** client/src/hooks/useApi.ts

```typescript
import { usePlayerState, useBuildStructure } from '@/hooks/useApi';
```

---

## Response Formats

### Success

```typescript
{ success: true, data: any, message?: string, timestamp: string }
```

### Error

```typescript
{ success: false, message: string, code: string, timestamp: string, errors?: Array<{ field: string, message: string }> }
```

### Paginated

```typescript
{ success: true, data: any[], pagination: { page, limit, total, totalPages, hasNext, hasPrev }, timestamp: string }
```

---

## Validation Status

- Server-side API core: implemented
- Client-side API client: implemented
- Shared types: implemented
- React hooks: implemented
- All route modules: implemented (50+ files)
- Complete API documentation: see [API_ROUTES.md](./API_ROUTES.md) and [API_COMPLETE_GUIDE.md](./API_COMPLETE_GUIDE.md)
