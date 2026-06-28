# Xenoberage API Design

**Last Updated:** June 18, 2026

---

## Overview

This document describes the API design patterns used for the Xenoberage integration into Universe Empire Dominion. The API follows REST conventions with JSON payloads and session-based authentication.

---

## Authentication Endpoints

> **Source:** server/basicAuth.ts:342-620

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (username, password, email) |
| POST | `/api/auth/login` | Authenticate (username, password) → session cookie |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/auth/user` | Get current user info |
| POST | `/api/auth/reset-password` | Reset password via username + email |

---

## Resource Endpoints (CRUD Pattern)

All domain entities follow this REST pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/<resource>` | List all |
| GET | `/api/<resource>/:id` | Get by ID |
| POST | `/api/<resource>` | Create |
| PUT | `/api/<resource>/:id` | Update |
| DELETE | `/api/<resource>/:id` | Delete |

### Implemented Resources

| Resource | Route File | Endpoints |
|----------|------------|-----------|
| Players | `server/routes.ts` | `/api/player/state`, `/api/game/state` |
| Planets | `server/routes-planets.ts` | `/api/planets` |
| Moons | `server/routes-moons.ts` | `/api/moons` |
| Fleets | `server/routes-gameactions.ts` | `/api/game/action/fleet/*` |
| Research | `server/routes-research.ts` | `/api/research/*` |
| Alliances | `server/routes-alliances.ts` | `/api/alliances/*` |
| Messages | `server/routes-messages.ts` | `/api/messages` |
| Auctions | `server/routes.ts` | `/api/auctions` |
| Trades | `server/routes-trades.ts` | `/api/trades` |
| Commanders | `server/routes-commanders.ts` | `/api/commanders` |
| Guilds | `server/routes-guilds.ts` | `/api/guilds` |
| Forums | `server/routes-forums.ts` | `/api/forums/threads` |

---

## Configuration Endpoints

Read-only endpoints that serve game configuration data:

| Endpoint | Route File | Description |
|----------|------------|-------------|
| `/api/config/civilization-jobs` | `server/routes-civilization.ts` | Civilization job definitions |
| `/api/config/building-archetypes` | `server/routes-lifesupport.ts` | Building archetype catalog |
| `/api/config/frame-systems` | `server/routes-lifesupport.ts` | Frame system definitions |
| `/api/config/population-system` | `server/routes-lifesupport.ts` | Population system config |
| `/api/config/food-system` | `server/routes-lifesupport.ts` | Food production rules |
| `/api/config/water-system` | `server/routes-lifesupport.ts` | Water production rules |
| `/api/unit-taxonomy/domains` | `server/routes-unit-taxonomy.ts` | Unit domain definitions |
| `/api/unit-systems/templates` | `server/routes-unitsystems.ts` | Unit template catalog |
| `/api/unit-systems/blueprints` | `server/routes-unitsystems.ts` | Starship blueprint catalog |
| `/api/government/leaders/types` | `server/routes-government-leaders.ts` | Leader type definitions |
| `/api/expeditions/catalog` | `server/routes-expeditions.ts` | Expedition catalog |
| `/api/moon/types` | `server/routes-moons.ts` | Moon type definitions |

---

## Action Endpoints

Endpoints that perform game state mutations:

| Endpoint | Route File | Description |
|----------|------------|-------------|
| `POST /api/game/action/build` | `server/routes-gameactions.ts` | Build structure |
| `POST /api/game/action/build-ship` | `server/routes-gameactions.ts` | Build ship |
| `POST /api/game/action/fleet/send` | `server/routes-gameactions.ts` | Send fleet |
| `POST /api/game/action/fleet/recall` | `server/routes-gameactions.ts` | Recall fleet |
| `POST /api/game/action/research` | `server/routes-gameactions.ts` | Start research |
| `POST /api/game/action/mission/start` | `server/routes-gameactions.ts` | Start mission |
| `POST /api/combat/simulate` | `server/routes-combat.ts` | Simulate combat |
| `POST /api/unit-systems/train` | `server/routes-unitsystems.ts` | Train units |
| `POST /api/unit-systems/combat` | `server/routes-unitsystems.ts` | Unit combat |
| `POST /api/espionage/scan` | `server/routes-espionage.ts` | Espionage scan |
| `POST /api/espionage/spy` | `server/routes-espionage.ts` | Spy operation |
| `POST /api/espionage/sabotage` | `server/routes-espionage.ts` | Sabotage operation |
| `POST /api/bank-vault/deposit` | `server/routes-bank-vault.ts` | Vault deposit |
| `POST /api/bank-vault/withdraw` | `server/routes-bank-vault.ts` | Vault withdrawal |
| `POST /api/government/progression/unlock` | `server/routes-government-progression.ts` | Unlock progression node |
| `POST /api/commanders/gacha/pull` | `server/routes-commanders.ts` | Gacha pull |

---

## Validation

> **Source:** server/routes-api-core.ts:23-69

Input validation uses Zod schemas defined in `server/routes-api-core.ts`. The `validate` middleware factory wraps schemas into Express middleware.

```typescript
import { validate, schemas } from './routes-api-core';
app.post('/api/buildings/build', isAuthenticated, validate(schemas.buildStructure), handler);
```

---

## GraphQL Alternative

The current implementation is REST-only. GraphQL could be added as an alternative transport layer using the same service and validation logic.

---

**See also:**
- [API_ROUTES.md](./API_ROUTES.md) — Complete endpoint reference
- [API_COMPLETE_GUIDE.md](./API_COMPLETE_GUIDE.md) — Full integration guide
