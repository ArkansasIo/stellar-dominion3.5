# Missing Systems Todo

Tracking incomplete or placeholder systems with file references.

---

## Placeholder Systems

These systems have route stubs or `missingFeatureService` placeholders but incomplete implementations.

| System | Route File | Service | Status |
|--------|-----------|---------|--------|
| Espionage | `server/routes-espionage.ts` | — | Stub only |
| Forums | `server/routes-forums.ts` | — | Basic |
| Messages | `server/routes-messages.ts` | — | Basic |
| Friends | `server/routes-friends.ts` | — | Basic |
| Realms | `server/routes-realms.ts` | — | Stub |
| phpMyAdmin | `server/routes-phpmyadmin.ts` | — | Proxy |

> **Source:** `server/routes-espionage.ts`
> **Source:** `server/routes-forums.ts`
> **Source:** `server/routes-messages.ts`
> **Source:** `server/routes-friends.ts`
> **Source:** `server/routes-realms.ts`
> **Source:** `server/routes-phpmyadmin.ts`

---

## Missing Feature Service

The `missingFeatureService` tracks features that are planned but not yet implemented.

| File | Purpose |
|------|---------|
| `server/services/missingFeatureService.ts` | Feature placeholder tracking |
| `server/routes-missing.ts` | Missing feature API |

> **Source:** `server/services/missingFeatureService.ts`
> **Source:** `server/routes-missing.ts`

---

## Systems Needing Completion

### Espionage System
- Route: `server/routes-espionage.ts`
- No dedicated service
- No client-side library
- No config files

> **Source:** `server/routes-espionage.ts`

### Forums System
- Route: `server/routes-forums.ts`
- Basic implementation
- No moderation tools
- No thread management config

> **Source:** `server/routes-forums.ts`

### Messages System
- Route: `server/routes-messages.ts`
- Basic implementation
- No real-time updates
- No message templates

> **Source:** `server/routes-messages.ts`

### Friends System
- Route: `server/routes-friends.ts`
- Basic implementation
- No friend recommendations
- No online status

> **Source:** `server/routes-friends.ts`

### Realms System
- Route: `server/routes-realms.ts`
- Stub implementation
- No realm-specific logic

> **Source:** `server/routes-realms.ts`

---

## Client-Side Gaps

### Missing Client Libraries

These server systems lack corresponding client-side logic libraries:

| Server System | Client Library Status |
|---------------|----------------------|
| Espionage | No `client/src/lib/espionage.ts` |
| Forums | No `client/src/lib/forumSystems.ts` |
| Messages | No `client/src/lib/messageSystems.ts` |
| Friends | No `client/src/lib/friendsSystems.ts` |
| Realms | No `client/src/lib/realmSystems.ts` |

### Missing Config Files

| System | Missing Config |
|--------|---------------|
| Espionage | No `shared/config/espionageConfig.ts` |
| Forums | No `shared/config/forumConfig.ts` |
| Messages | No `shared/config/messageConfig.ts` |
| Friends | No `shared/config/friendsConfig.ts` |
| Realms | No `shared/config/realmConfig.ts` |

---

## Pages Needing Enhancement

| Page | Current State | Needed |
|------|--------------|--------|
| `client/src/pages/OgameCompendium.tsx` | Basic | Full OGame integration |
| `client/src/pages/ThreeDViewerPortal.tsx` | Basic | Full 3D viewer |
| `client/src/pages/TrainingCenter.tsx` | Basic | Training mechanics |
| `client/src/pages/UniverseEvents.tsx` | Basic | Event system |

> **Source:** `client/src/pages/OgameCompendium.tsx`
> **Source:** `client/src/pages/ThreeDViewerPortal.tsx`
> **Source:** `client/src/pages/TrainingCenter.tsx`
> **Source:** `client/src/pages/UniverseEvents.tsx`

---

## Priority Todo

1. **Espionage** — Full implementation with config, service, and client logic
2. **Forums** — Thread management, moderation, categories
3. **Messages** — Real-time messaging, templates, notifications
4. **Friends** — Online status, recommendations, social features
5. **Realms** — Realm-specific game logic
6. **3D Viewer** — Full Three.js integration
7. **Training Center** — Training mechanics and progression
8. **Universe Events** — Event trigger system and rewards
