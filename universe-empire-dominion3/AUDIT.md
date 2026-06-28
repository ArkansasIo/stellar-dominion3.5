# Universe Empire Dominion 3 — Full Source Audit

## Executive Summary

This is a large-scale space strategy MMO built with React + Express + PostgreSQL. The codebase has ~100+ pages, 76 lib modules, 50+ route files, and 40+ services. The main issues are: **security vulnerabilities**, **missing page files**, **God Objects** (gameContext 2083 lines, storage 2918 lines), and **dead/orphaned code**.

---

## P0 — BLOCKING / WILL CRASH

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | **~33 missing page files** referenced in App.tsx lazy imports (Overview, Resources, Research, Settings, TechTree, TechnologyTree, Stations, Starbases, Storefront, StoryMode, SeasonPass, Relics, Guilds, Raids, RaidBosses, RaidFinder, GroundCombat, ResearchAnalyticsDashboard, PlanetDetail, PlanetCommand, PlanetaryOccupation, PowerGrid, HighCommand, Smithy, SporeDrive, ResourceTradingPage, GovernmentBuildingsPage, GovernmentProgressionPage, SaveSlotsPage, RealmPickerPage, Privacy, ServerConsole) | `client/src/App.tsx` | Create all missing page files or remove lazy imports |
| 2 | **Password hashing uses unsalted SHA-256** — trivially crackable | `server/basicAuth.ts:107` | Replace with bcrypt/argon2 |
| 3 | **In-memory session store** — all sessions lost on restart | `server/basicAuth.ts:84` | Switch to `connect-pg-simple` or Redis |
| 4 | **Auction bid/buyout doesn't validate currency** — players can buy items for free | `server/routes.ts:552,602` | Add currency check before transfer |
| 5 | **`teams.members` column type mismatch** — jsonb column used with Postgres array functions (`array_append`, `array_remove`, `ANY`) | `server/storage.ts:1575-1596` | Change column to array type or fix queries |
| 6 | **`column "smithy_state" does not exist`** — DB schema drift | `server/storage.ts:574` | Run migration or add missing column |
| 7 | **`combatSystem.ts` references non-existent commander classes** (`"warrior"`, `"scout"`) | `client/src/lib/combatSystem.ts:48-53` | Fix to use valid ClassId values |

---

## P1 — SECURITY / DATA INTEGRITY

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 8 | **No rate limiting** on any API endpoint | `server/index.ts` | Add rate limiting middleware |
| 9 | **`/api/game/*` routes have no authentication** | `server/routes-game.ts` | Add `isAuthenticated` middleware |
| 10 | **Hardcoded session secret fallback** (`"dev-secret-key"`) | `server/basicAuth.ts:93` | Require env var, fail startup if missing |
| 11 | **No CSRF protection** on state-changing endpoints | `server/basicAuth.ts` | Add CSRF tokens |
| 12 | **Race conditions on resource deduction** — concurrent builds/missions can overdraft | `server/gameEngine.ts`, `server/routes-gameactions.ts` | Add optimistic locking (version column) |
| 13 | **Password reset generates random password but has no email delivery** — password is lost | `server/basicAuth.ts:559` | Implement token-based reset or return token |
| 14 | **Plaintext password in localStorage** for Basic Auth | `client/src/lib/gameContext.tsx:48-52` | Switch to token/JWT auth |
| 15 | **No transaction wrapping** on multi-step operations (trades, auctions) | `server/storage.ts` | Wrap in `db.transaction()` |
| 16 | **Timing-unsafe comparison** for admin security code | `server/basicAuth.ts` | Use `crypto.timingSafeEqual()` |

---

## P2 — ARCHITECTURE / MAINTENABILITY

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 17 | **`gameContext.tsx` is a 2083-line God Context** holding ALL game state | `client/src/lib/gameContext.tsx` | Decompose into smaller contexts |
| 18 | **`storage.ts` is a 2918-line God Object** handling 40+ tables | `server/storage.ts` | Split into domain modules |
| 19 | **`schema.ts` is 2271 lines** with no table indexes | `shared/schema.ts` | Split + add indexes |
| 20 | **Three different API layers** exist but only one is used | `gameContext.tsx`, `queryClient.ts`, `api-client.ts` | Consolidate to one approach |
| 21 | **Dead code**: `xenoberage-api.ts`, `xenoberage-types.ts`, `combatEngine.ts` (client), orphaned Python files | Various | Remove or implement |
| 22 | **`useApi.ts` hook library** (~483 lines) is unused — pages use `useGame()` instead | `client/src/hooks/useApi.ts` | Wire in or remove |
| 23 | **Duplicate public route blocks** in App.tsx (4x copy-paste) | `client/src/App.tsx:199-229` | Extract to helper |
| 24 | **9 nearly-identical auxiliary system upgrade functions** | `client/src/lib/gameContext.tsx` | Parameterize into one function |
| 25 | **Orphaned Python codebase** with no entry point | `server/game/`, `server/models/`, `server/routes/` (Python) | Remove |
| 26 | **Dead `GameEngine` class** shell in gameEngine.ts | `server/gameEngine.ts:358-383` | Remove or implement |
| 27 | **`LoadingSplash` uses `Math.random()` in render** causing re-render jitter | `client/src/App.tsx:126-131` | Pre-compute or useMemo |
| 28 | **Duplicate `apiRequest` functions** exported from both queryClient.ts and gameContext.tsx | Both files | Remove one |

---

## P3 — INCOMPLETE FEATURES / POLISH

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 29 | **`blink` realtime is completely disabled** (exports `null`) | `client/src/lib/blink.ts`, `client/src/blink/client.ts` | Implement or remove |
| 30 | **`update-client.ts` `showChangelog` method is empty** | `client/src/lib/update-client.ts:246-248` | Implement |
| 31 | **`TEMP_THEME_IMAGE = "/theme-temp.png"`** hardcoded in 20+ pages | Various pages | Replace with proper asset handling |
| 32 | **Combat loot hardcoded** to 50k of each resource | `client/src/lib/gameLogic.ts:107` | Calculate from target state |
| 33 | **Only 6 building types** defined in gameEngine.ts (should be 25+) | `server/gameEngine.ts:29-36` | Add complete cost tables |
| 34 | **Only 6 ship types** in gameEngine.ts (should be 25+) | `server/gameEngine.ts:38-45` | Add complete cost tables |
| 35 | **Missing unit types** in combat config (10 defined, 25+ exist) | `server/combatEngine.ts` | Add remaining types |
| 36 | **Expedition fleet/troop compositions discarded** on save | `server/storage.ts:2076` | Store in DB |
| 37 | **No market fee/commission** on trades | `server/routes-resource-trading.ts` | Add fee calculation |
| 38 | **No order expiration** for buy/sell orders | `server/routes-resource-trading.ts` | Add TTL |
| 39 | **No combat cooldown** between attacks on same target | `server/routes-combat.ts` | Add cooldown check |
| 40 | **TODO: Integrate tech tree with event system** | `shared/config/technologyTreeCustomConfig.ts:464` | Implement |
| 41 | **Duplicate config index files** (`index.ts` vs `index-new.ts`) | `shared/config/` | Consolidate |
| 42 | **Missing DB indexes** on frequently queried columns | `shared/schema.ts` | Add indexes |
| 43 | **Drizzle ORM schema vs raw SQL schema drift** | `shared/schema.ts` vs `shared/sql/` | Reconcile |
| 44 | **Hardcoded version strings** in 3 places | `App.tsx:157`, `update-client.ts:62`, `gameContext.tsx` | Centralize version |
| 45 | **Deprecated `substr` calls** in addEvent | `client/src/lib/gameContext.tsx` | Use substring |
| 46 | **`Dashboard.tsx` uses raw fetch** instead of react-query | `client/src/components/Dashboard.tsx` | Migrate |
| 47 | **Typo in non-admin email domain** | `server/basicAuth.ts:15` | Fix spelling |
| 48 | **No DB connection pool size config** | `server/db/index.ts` | Configure max/idle |
| 49 | **No graceful DB shutdown** | `server/db/index.ts` | Add pool.end() on SIGTERM |
| 50 | **UID collision risk** (only 10 random attempts) | `server/basicAuth.ts` | Use UUID or increase retries |

---

## FILE-BY-FILE STATUS

### Client Source (`client/src/`)

| Category | Count | Status |
|----------|-------|--------|
| Entry (main.tsx, App.tsx, index.css) | 3 | App.tsx needs dedup, missing pages |
| Lib modules | 76 | gameContext needs decomposition |
| Components | ~80 | GameLayout needs nav extraction |
| Hooks | 5 | useApi unused |
| Pages | ~60 exist, ~33 missing | Critical gap |
| Styles | 9 | Complete |
| Blink stubs | 2 | Dead code |

### Server Source (`server/`)

| Category | Count | Status |
|----------|-------|--------|
| Core (index, storage, db, auth, engine) | 5 | Storage/auth need major work |
| Route files | 50+ | routes-game.ts has no auth |
| Services | 40+ | Mostly complete |
| Systems | 11 | Complete |
| Python (orphaned) | ~15 | Dead code, remove |

### Shared (`shared/`)

| Category | Count | Status |
|----------|-------|--------|
| Schema | 1 (2271 lines) | Needs splitting + indexes |
| Config files | 100+ | Mostly complete |
| SQL files | ~10 | May drift from schema |
| Type files | 4 | May duplicate schema types |

---

## RECOMMENDED ORDER OF ATTACK

1. **Fix DB column mismatch** (`smithy_state`, `teams.members`) — server won't work without this
2. **Create all 33 missing page files** — app crashes on navigation
3. **Fix security**: bcrypt, persistent sessions, auth on game routes
4. **Add transactions** to storage.ts trade/auction operations
5. **Remove dead code**: Python files, xenoberage, unused combatEngine
6. **Decompose gameContext.tsx** into smaller contexts
7. **Split storage.ts** into domain modules
8. **Add rate limiting + CSRF**
9. **Complete missing building/ship/unit types**
10. **Add DB indexes + reconcile schema**
