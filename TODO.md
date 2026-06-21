# TODO — Universe Empire Dominion

> Generated audit: what's missing, broken, or needs patching.
> Organized by priority: P0 (critical) → P3 (nice-to-have).

---

## P0 — Critical (game won't function properly)

### Scheduler System — 10 empty stubs
- [ ] `server/systems/schedulerSystem.ts:76` — `processTurns()` — empty body
- [ ] `server/systems/schedulerSystem.ts:84` — `processPortProduction()` — empty
- [ ] `server/systems/schedulerSystem.ts:92` — `processPlanetProduction()` — empty
- [ ] `server/systems/schedulerSystem.ts:100` — `processIGB()` — empty
- [ ] `server/systems/schedulerSystem.ts:107` — `processRanking()` — empty
- [ ] `server/systems/schedulerSystem.ts:114` — `processNews()` — empty
- [ ] `server/systems/schedulerSystem.ts:121` — `processDefenseDegrade()` — empty
- [ ] `server/systems/schedulerSystem.ts:128` — `processApocalypse()` — empty
- [ ] `server/systems/schedulerSystem.ts:135` — `processGovernor()` — empty
- [ ] `server/systems/schedulerSystem.ts:142` — `processEmpire()` — empty

### Core Services Return Wrong Data
- [ ] `server/services/resourceService.ts:4-12` — returns `researches.slice(0, 10)` instead of resources
- [ ] `server/services/fleetService.ts:4-12` — returns `researches.slice(10, 20)` instead of fleet data
- [ ] `server/services/technologyService.ts:4-12` — returns `researches.slice(20, 100)` instead of tech data

### Systems Never Persist to Database
- [ ] `server/systems/colonizationSystem.ts:27` — `createColony()` never inserts into DB
- [ ] `server/systems/bountySystem.ts:31` — `placeBounty()` never inserts into DB
- [ ] `server/systems/bountySystem.ts:76` — `claimBounty()` always returns reward=0
- [ ] `server/systems/scanningSystem.ts:36` — `scanSector()` returns empty arrays
- [ ] `server/systems/scanningSystem.ts:76` — `fullScan()` never deducts turns
- [ ] `server/systems/upgradeSystem.ts:44` — `upgradeShipEquipment()` never deducts resources
- [ ] `server/systems/portTradingSystem.ts:44-120` — buy/sell/inventory all hardcoded
- [ ] `server/systems/igbSystem.ts:51-103` — loan/payment/consolidation all hardcoded

### Security Issues
- [ ] **SQL injection** — `server/services/gameJobs.ts:411,416` — string interpolation in SQL
- [ ] **Cron routes have no auth** — `server/routes-cron.ts` — all 8 endpoints accessible to anyone
- [ ] **Credentials in repo** — `.env` contains real Neon DB connection string and API keys
- [ ] **Admin bypass** — `server/basicAuth.ts:22-37` — `DEV_AUTH_BYPASS` defaults to true

### Missing API Routes (client calls non-existent endpoints)
- [ ] `/api/market/orders` — called by `Market.tsx` (lines 791, 803)
- [ ] `/api/market/order` — called by `Market.tsx` (line 819)
- [ ] `/api/market/buy` — called by `Market.tsx` (line 867)
- [ ] `/api/espionage/scan` — called by Exploration context
- [ ] `/api/planets/colonize` — called by Colonies page (should be `/api/planets/:id/colonize`)
- [ ] `/api/planets/extract` — called by Planets pages
- [ ] `/api/players` — called by multiple pages
- [ ] `/api/ships` — called by Fleet/Shipyard (should be `/api/game/ships`)
- [ ] `/api/logs` — called by ServerConsole (should be `/api/admin/logs/access`)
- [ ] `/api/tech-tree` — called by TechTree (should be `/api/research/tree/branches`)

---

## P1 — High (features incomplete or unusable)

### Stub Systems (from `server/routes-missing.ts`)
- [ ] Espionage — stub only, no real mechanics
- [ ] Forums — basic CRUD, no moderation/categories
- [ ] Messages — basic, no real-time/notifications
- [ ] Friends — basic, no online status/recommendations
- [ ] Realms — hardcoded seed data, no realm logic
- [ ] Raids — stored in-memory (lost on restart)
- [ ] Expeditions — in-memory (lost on restart)
- [ ] Universe Events — static sample data, never dynamic

### Missing Client Libraries
- [ ] `client/src/lib/espionage.ts`
- [ ] `client/src/lib/forumSystems.ts`
- [ ] `client/src/lib/messageSystems.ts`
- [ ] `client/src/lib/friendsSystems.ts`
- [ ] `client/src/lib/realmSystems.ts`

### Missing Config Files
- [ ] `shared/config/espionageConfig.ts`
- [ ] `shared/config/forumConfig.ts`
- [ ] `shared/config/messageConfig.ts`
- [ ] `shared/config/friendsConfig.ts`
- [ ] `shared/config/realmConfig.ts`

### Pages Needing Full Implementation
- [ ] `client/src/pages/OgameCompendium.tsx` — basic
- [ ] `client/src/pages/ThreeDViewerPortal.tsx` — basic (69 lines)
- [ ] `client/src/pages/TrainingCenter.tsx` — basic
- [ ] `client/src/pages/UniverseEvents.tsx` — basic

### Generated OGamex Stubs (1,395+ files)
- [ ] `generated/ogamex-ts/` — entire PHP→TypeScript port unimplemented
  - `Services/WreckFieldService.ts` — 28 methods
  - `Services/SettingsService.ts` — 35+ methods
  - `Services/UnitQueueService.ts` — 9 methods
  - `ViewModels/` — all throw on every method

### Error Handling Gaps
- [ ] `server/routes-missing.ts` — 15+ empty catch blocks (no error logging)
- [ ] `server/routes-cron.ts` — 8 endpoints missing auth middleware
- [ ] `server/routes-settings.ts:147,166` — admin check hardcoded as `username !== "admin"`

---

## P2 — Medium (needs updating/patching)

### Missing Electron Scripts
- [ ] No `electron:dev` script in package.json
- [ ] No `electron:build` script in package.json
- [ ] No `electron:start` script in package.json

### Package.json Issues
- [ ] `package.json:2` — name is `"rest-express"`, should be `"universe-empire-dominion"`
- [ ] No `"test"` script despite `puppeteer` in devDependencies
- [ ] No `mac` target in `electron-builder.json` (only `win` and `linux`)

### Server Routes Without Client Pages
- [ ] `/api/high-command/*` (12+ endpoints) — no HighCommand page
- [ ] `/api/smithy/*` (7+ endpoints) — no Smithy page
- [ ] `/api/bank-vault/*` (7+ endpoints) — no BankVault page
- [ ] `/api/orbital-stations/*` (10+ endpoints) — Stations page doesn't call these
- [ ] `/api/government-buildings/*` (10+ endpoints) — no dedicated page
- [ ] `/api/government-progression/*` (6+ endpoints) — no dedicated page
- [ ] `/api/resource-trading/*` (5+ endpoints) — no dedicated page
- [ ] `/api/unit-systems/*` (7+ endpoints) — no dedicated page
- [ ] `/api/unit-taxonomy/*` (10+ endpoints) — no dedicated page
- [ ] `/api/moons/*` (6+ endpoints) — no Moons page
- [ ] `/api/spore-drive/*` (6+ endpoints) — no SporeDrive page
- [ ] `/api/config/*` (8+ endpoints) — no dedicated page
- [ ] `/api/research/xp/*` (4+ endpoints) — no dedicated page
- [ ] `/api/research/recommendations/*` (3 endpoints) — no dedicated page
- [ ] `/api/game-asset-library` — GameAssetsGallery page doesn't use it

### Hardcoded Values to Make Configurable
- [ ] `electron-main.cjs:10` — `SERVER_PORT = 5001` hardcoded
- [ ] `server/db/index.ts:6` — fallback DB URL with default credentials
- [ ] `server/basicAuth.ts:320-329` — CORS origins hardcoded
- [ ] `server/services/gameJobs.ts:4-10` — tick intervals hardcoded
- [ ] `server/services/gameJobs.ts:57` — login bonus amounts hardcoded
- [ ] `server/services/gameJobs.ts:152-156` — resource production multipliers hardcoded
- [ ] `server/routes-espionage.ts:8-43` — all espionage config in route file
- [ ] `server/routes-settings.ts:147` — admin username hardcoded

### Dead Imports to Clean Up
- [ ] `server/services/resourceService.ts` — imports `researches` (wrong data)
- [ ] `server/services/fleetService.ts` — same
- [ ] `server/services/technologyService.ts` — same
- [ ] `server/systems/scanningSystem.ts` — imports `db`, never uses it
- [ ] `server/systems/bountySystem.ts` — imports `db`, never uses it
- [ ] `server/systems/colonizationSystem.ts` — imports `db`, never uses it
- [ ] `server/systems/upgradeSystem.ts` — imports `db`, never uses it
- [ ] `server/systems/portTradingSystem.ts` — imports `db`, never uses it
- [ ] `server/systems/igbSystem.ts` — imports `db`, `eq`, `and`, never uses them
- [ ] `server/systems/defenseSystem.ts` — imports `db`, `eq`, `and`, never uses them
- [ ] `server/systems/apocalypseSystem.ts` — imports `db`, `eq`, `and`, never uses them
- [ ] `server/systems/rankingSystem.ts` — imports `db`, `eq`, `and`, never uses them
- [ ] `server/systems/resourceProductionSystem.ts` — imports `db`, `eq`, `and`, never uses them

### Signature Mismatches
- [ ] `schedulerSystem.ts:57` calls `processApocalypse()` with no args, but `apocalypseSystem.ts:18` expects `(tick: number)`
- [ ] `schedulerSystem.ts:52` calls `processDefenseDegrade()` with no args, but `defenseSystem.ts:21` expects a `sector` object

---

## P3 — Low (cleanup and polish)

### Debug Logging to Remove
- [ ] `client/src/pages/Auth.tsx:350` — `console.log("[AUTH] Attempting password reset...")`
- [ ] `client/src/pages/Auth.tsx:368` — `console.log("[AUTH] Password reset successful...")`
- [ ] `client/src/lib/gameContext.tsx:648` — `console.log("[REALTIME] Subscribed to...")`
- [ ] `client/src/lib/update-client.ts:248` — `console.log(...)` debug block
- [ ] `client/src/lib/shipFittingModules.ts:1891` — `console.log("Ship Fitting Module Catalog loaded...")`
- [ ] `client/src/components/GameLoop.tsx:12` — `console.log('Game tick: UI data refresh triggered')`

### Config / Build Cleanup
- [ ] `electron-builder.json:10-17` — bundles `.env` and `.env.example` (secrets in packaged app)
- [ ] `vite.config.ts:46` — `host: "0.0.0.0"` binds to all interfaces (security concern)
- [ ] `electron-main.cjs` — no `will-navigate` or `new-window` webContents security policies
- [ ] `tsconfig.json:3` — includes `script/**/*` which shouldn't be in main typecheck
- [ ] `electron-main.cjs:162` — tray icon error silently caught with `console.log`

### Shared Config TODO
- [ ] `shared/config/technologyTreeCustomConfig.ts:464` — needs integration with event system

---

## Quick Reference — File Locations

| What | Path |
|------|------|
| Scheduler (10 stubs) | `server/systems/schedulerSystem.ts` |
| Broken services | `server/services/resourceService.ts`, `fleetService.ts`, `technologyService.ts` |
| In-memory raids | `server/routes-missing.ts` |
| Cron (no auth) | `server/routes-cron.ts` |
| SQL injection | `server/services/gameJobs.ts:411,416` |
| Missing systems tracking | `docs/MissingSystemsTodo.md` |
| OGamex stubs | `generated/ogamex-ts/` |
| Electron config | `electron-builder.json`, `electron-main.cjs` |
