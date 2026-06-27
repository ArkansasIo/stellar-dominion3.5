# Complete API Guide

**Version:** 2.0.0
**Last Updated:** June 18, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Middleware Chain](#middleware-chain)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Client Integration](#client-integration)
8. [Code Examples](#code-examples)

---

## Overview

The Universe Empire Dominion API provides a RESTful interface for all game systems. The server is built on Express with Drizzle ORM, session-based auth, and Zod validation.

### Base URL

```
Production: https://your-domain.com
Development: http://localhost:5001
```

### Response Format

All API responses follow a standard envelope:

```typescript
{
  success: boolean,
  data: any,
  message?: string,
  timestamp: string,
  code?: string       // Only on errors
}
```

### File Structure

| File | Purpose |
|------|---------|
| `server/index.ts` | Express app bootstrap, route registration |
| `server/basicAuth.ts` | Session setup, auth middleware, register/login/logout |
| `server/routes.ts` | Core game routes (auth, player, currency, bank, empire, auctions) |
| `server/routes-api-core.ts` | Shared middleware, Zod schemas, response wrappers |
| `server/routes-account.ts` | Account profile and password management |
| `server/routes-achievements.ts` | Achievement system endpoints |
| `server/routes-admin.ts` | Admin panel endpoints |
| `server/routes-alliances.ts` | Alliance CRUD and diplomacy |
| `server/routes-army-building-structures.ts` | Army building construction |
| `server/routes-army-system.ts` | Army deployment, training, combat |
| `server/routes-artifacts.ts` | Artifact summary |
| `server/routes-assets.ts` | Asset upload and management |
| `server/routes-autobuyresources.ts` | Automated resource purchasing |
| `server/routes-bank-vault.ts` | Vault deposit, withdrawal, exchange |
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

---

## Authentication

> **Source:** server/basicAuth.ts

### Session Configuration

> **Source:** server/basicAuth.ts:78-103

Sessions use `express-session` with `memorystore` (in-memory, no database dependency). Cookie settings:

- Name: `connect.sid`
- TTL: 7 days
- HttpOnly: true
- SameSite: `lax`
- Secure: false in development

### Auth Middleware

> **Source:** server/basicAuth.ts:623-672

The `isAuthenticated` middleware uses a three-tier fallback:

1. **Session check** — reads `req.session.userId`
2. **Basic Auth** — parses `Authorization: Basic <base64>` header
3. **Dev bypass** — auto-creates session when `DEV_AUTH_BYPASS` is enabled in development

### Register

> **Source:** server/basicAuth.ts:342-387

```
POST /api/auth/register
Body: { username: string, password: string, email: string, firstName?: string }
```

Validation: username ≥ 3 chars, password ≥ 6 chars, email must contain `@`. Duplicate usernames return 409.

### Login

> **Source:** server/basicAuth.ts:389-437

```
POST /api/auth/login
Body: { username: string, password: string }
```

Passwords are hashed with SHA-256. On success, `userId` is stored in the session. Admin users also get `adminAuthenticatedAt` timestamp.

### Admin Login

> **Source:** server/basicAuth.ts:439-503

```
POST /api/admin/login
Body: { identifier: string, password: string, securityCode: string }
```

Requires a security code (from `ADMIN_SECURITY_CODE` env var). Only users with an admin role in the `adminUsers` table can log in.

### Get Current User

> **Source:** server/basicAuth.ts:539-612

```
GET /api/auth/user
Response: { id, username, email, firstName, isAdmin, adminRole }
```

Returns 401 if not authenticated. Sets `Cache-Control: no-cache` headers.

### Bootstrap Admin Accounts

> **Source:** server/basicAuth.ts:178-312

On startup, the server creates:
1. **Bootstrap admin** — from `ADMIN_BOOTSTRAP_*` env vars (default: `admin@universee.game`)
2. **Dev admin** — in development, from `DEV_ADMIN_*` env vars
3. **Owner admin** — from `OWNER_ADMIN_*` env vars (if set)

---

## Middleware Chain

> **Source:** server/routes-api-core.ts

### Authentication Middleware

> **Source:** server/routes-api-core.ts:8-17

```typescript
export const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Authentication required", code: "UNAUTHORIZED" });
  }
  next();
};
```

### Validation Middleware

> **Source:** server/routes-api-core.ts:72-92

```typescript
export const validate = (schema: z.ZodSchema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, message: "Validation failed", code: "VALIDATION_ERROR",
          errors: error.errors.map(e => ({ field: e.path.join("."), message: e.message })),
        });
      }
      next(error);
    }
  };
};
```

### Zod Schemas

> **Source:** server/routes-api-core.ts:23-69

Available schemas: `register`, `login`, `updateResources`, `buildStructure`, `startResearch`, `createFleet`, `createMission`.

### Response Wrappers

> **Source:** server/routes-api-core.ts:94-186

```typescript
apiResponse.success(data, message?)   // { success: true, data, message, timestamp }
apiResponse.error(message, code?, errors?)  // { success: false, message, code, timestamp, errors }
apiResponse.paginated(data, pagination)     // { success: true, data, pagination, timestamp }
```

### Error Handler

> **Source:** server/routes-api-core.ts (errorHandler export)

Global Express error handler that catches unhandled errors and returns 500 with a standard response.

---

## API Endpoints

See [API_ROUTES.md](./API_ROUTES.md) for the complete endpoint reference with source file links.

---

## Error Handling

### Error Response Format

```typescript
{
  success: false,
  message: string,
  code: string,
  timestamp: string,
  errors?: Array<{ field: string, message: string }>
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `INSUFFICIENT_RESOURCES` | 400 | Not enough resources |
| `CONFLICT` | 409 | Resource conflict (e.g. username taken) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

| Category | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| General API | 60 requests | 1 minute |
| Expensive Operations | 10 requests | 1 minute |

Rate limit headers returned when applicable:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: <unix-timestamp>
```

---

## Client Integration

### API Client

> **Source:** client/src/lib/api-client.ts

Centralized HTTP client with type-safe methods for all API endpoints. Handles session cookies automatically.

```typescript
import api from '@/lib/api-client';

const response = await api.auth.login('username', 'password');
const state = await api.player.getState();
```

### React Hooks

> **Source:** client/src/hooks/useApi.ts

Pre-configured React Query hooks for all endpoints with automatic caching, refetching, and invalidation.

```typescript
import { usePlayerState, useBuildStructure } from '@/hooks/useApi';

function MyComponent() {
  const { data, isLoading } = usePlayerState();
  const buildMutation = useBuildStructure();
  // ...
}
```

### Shared Types

> **Source:** shared/api-types.ts

TypeScript interfaces shared between client and server for all API request/response shapes.

### Database Schema

> **Source:** shared/schema.ts

Drizzle ORM schema definitions for all database tables.

---

## Code Examples

### Error Handling

```typescript
try {
  const response = await api.player.getState();
  console.log(response.data);
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    // redirect to login
  }
}
```

### Batch Requests

```typescript
const [state, resources, buildings] = await Promise.all([
  api.player.getState(),
  api.resources.get(),
  api.buildings.getAll()
]);
```

### React Query with Caching

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['player-state'],
  queryFn: () => api.player.getState(),
  staleTime: 30000,
  refetchInterval: 60000
});
```

---

**See also:**
- [API_ROUTES.md](./API_ROUTES.md) — Complete endpoint reference
- [API_IMPLEMENTATION_SUMMARY.md](./API_IMPLEMENTATION_SUMMARY.md) — Implementation status
- [Xenoberage-Session-Auth.md](./Xenoberage-Session-Auth.md) — Session auth design details
