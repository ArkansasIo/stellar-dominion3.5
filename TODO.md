# TODO — Universe Empire Dominion

> Generated audit: what's missing, broken, or needs patching.
> Organized by priority: P0 (critical) → P3 (nice-to-have).
> Last updated: 2026-06-21

---

## P0 — Critical (game won't function properly)

### ✅ DONE — Scheduler System
All 10 scheduler methods fully implemented with DB persistence.

### ✅ DONE — Core Services
`resourceService.ts`, `fleetService.ts`, `technologyService.ts` return correct data.

### ✅ DONE — Systems Persist to Database
- `colonizationSystem.ts` — `createColony()` inserts into `player_colonies`
- `bountySystem.ts` — `placeBounty()` inserts into `bounties` table; `claimBounty()` transfers credits and deactivates bounty
- `scanningSystem.ts` — `scanSector()` queries actual player data; `fullScan()` deducts turns
- `upgradeSystem.ts` — `upgradeShipEquipment()` deducts credits
- `portTradingSystem.ts` — `buyFromPort()`/`sellToPort()` verify resources and update DB; `getPortInventory()` queries DB
- `igbSystem.ts` — `processLoanPayment()`, `consolidateAccount()`, `processIGBTick()` all use DB

### ✅ DONE — Security Issues
- SQL injection — gameJobs.ts uses parameterized queries
- Cron routes — all 8 endpoints use `isAuthenticated` + `isAdmin` middleware
- Admin bypass — only enabled in development mode (`NODE_ENV === "development"`)
- Settings routes — use proper `isAdmin` middleware instead of hardcoded `username !== "admin"`

### ✅ DONE — Missing API Routes
All routes from `routes-missing-api.ts` implemented: `/api/market/orders`, `/api/market/order`, `/api/market/buy`, `/api/espionage/scan`, `/api/planets/colonize`, `/api/planets/extract`, `/api/players`, `/api/ships`, `/api/logs`, `/api/tech-tree`.

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

### ✅ DONE — Missing Client Libraries
All exist: `espionageSystems.ts`, `forumSystems.ts`, `messageSystems.ts`, `friendsSystems.ts`, `realmSystems.ts`.

### ✅ DONE — Missing Config Files
All exist: `espionageConfig.ts`, `forumConfig.ts`, `messageConfig.ts`, `friendsConfig.ts`, `realmConfig.ts`.

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

---

## P2 — Medium (needs updating/patching)

### ✅ DONE — Package.json Issues
- Name corrected to `"universe-empire-dominion"`
- Electron scripts exist: `electron:dev`, `electron:build`, `electron:start`

### ✅ DONE — Electron Builder
- `.env` and `.env.example` removed from bundle (security fix)
- Mac target added (`dmg`, `zip`)

### ✅ DONE — TypeScript Config
- Removed `script/**/*` from tsconfig include

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
- [ ] `server/basicAuth.ts:319-333` — CORS origins hardcoded
- [ ] `server/services/gameJobs.ts:4-10` — tick intervals hardcoded
- [ ] `server/services/gameJobs.ts:57` — login bonus amounts hardcoded
- [ ] `server/services/gameJobs.ts:152-156` — resource production multipliers hardcoded
- [ ] `server/routes-espionage.ts:8-43` — all espionage config in route file

### Signature Mismatches (FIXED)
- ✅ `schedulerSystem.ts` — `processApocalypse()` now passes `Date.now()` as tick
- ✅ `schedulerSystem.ts` — `processDefenseDegrade()` now passes sector data

---

## P3 — Low (cleanup and polish)

### ✅ DONE — Debug Logging Removed
- `shipFittingModules.ts:1891` — removed catalog load log
- `GameLoop.tsx:12` — removed tick log
- `update-client.ts:248` — removed debug block

### Config / Build Cleanup
- [ ] `vite.config.ts:46` — `host: "0.0.0.0"` binds to all interfaces (security concern)
- [ ] `electron-main.cjs` — no `will-navigate` or `new-window` webContents security policies
- [ ] `electron-main.cjs:162` — tray icon error silently caught with `console.log`

### Pre-existing TypeScript Errors (not introduced by TODO fixes)
- [ ] `BlueprintCharges.tsx`, `CronDashboard.tsx`, `DimensionalAnomalies.tsx`, `EmpireProfile.tsx`, `ResourceRefineries.tsx` — Card component prop type mismatches (`title`/`subtitle` not on Card type)

---

## Quick Reference — File Locations

| What | Path |
|------|------|
| Scheduler (all implemented) | `server/systems/schedulerSystem.ts` |
| Services (all correct) | `server/services/resourceService.ts`, `fleetService.ts`, `technologyService.ts` |
| In-memory raids | `server/routes-missing.ts` |
| Cron (auth added) | `server/routes-cron.ts` |
| Missing API routes | `server/routes-missing-api.ts` |
| Bounty system (DB-backed) | `server/systems/bountySystem.ts` |
| Colonization system (DB-backed) | `server/systems/colonizationSystem.ts` |
| OGamex stubs | `generated/ogamex-ts/` |
| Electron config | `electron-builder.json`, `electron-main.cjs` |
