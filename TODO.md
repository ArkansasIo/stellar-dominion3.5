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

### ✅ DONE — Stub Systems (verified implemented)
- **Espionage** — `routes-espionage.ts` (540 lines) — FULLY IMPLEMENTED with spy missions, intel reports, counter-intelligence
- **Forums** — `routes-forums.ts` (114 lines) — FULLY IMPLEMENTED with thread CRUD, replies, admin reset
- **Messages** — `routes-messages.ts` (100 lines) — FULLY IMPLEMENTED with CRUD, read marking, delete
- **Friends** — `routes-friends.ts` (180 lines) — FULLY IMPLEMENTED with friend lifecycle, duplicate prevention

### In-Memory Systems (need DB persistence)
- ✅ **Smithy** — `server/routes-smithy.ts` — migrated to `playerStates.smithyState` JSONB
- ✅ **Bank Vault** — `server/routes-bank-vault.ts` — migrated to `playerStates.bankVaultState` JSONB
- ✅ **Orbital Stations** — `server/routes-orbital-stations.ts` — migrated to `playerStates.orbitalStations` JSONB
- ✅ **Spore Drive** — `server/routes-spore-drive.ts` — migrated to `playerStates.sporeDriveState` JSONB
- ✅ **Moons** — `server/routes-moons.ts` — migrated to `playerStates.moonsData` JSONB
- [ ] **Raids** — `server/routes-missing.ts` — in-memory `raidState` array, lost on restart
- [ ] **Expeditions** — active expeditions in `routes-missing.ts` — in-memory, catalog is static
- [ ] **Universe Events** — `server/routes-missing.ts` — static `SAMPLE_EVENTS` array, in-memory participants
- [ ] **Realms** — `server/routes-realms.ts` — hardcoded seed data, no realm isolation

### ✅ DONE — Missing Client Libraries
All exist: `espionageSystems.ts`, `forumSystems.ts`, `messageSystems.ts`, `friendsSystems.ts`, `realmSystems.ts`.

### ✅ DONE — Missing Config Files
All exist: `espionageConfig.ts`, `forumConfig.ts`, `messageConfig.ts`, `friendsConfig.ts`, `realmConfig.ts`.

### ✅ DONE — Pages Verified Complete
- `OgameCompendium.tsx` — 341 lines, full catalog browser with search, cost calculator
- `ThreeDViewerPortal.tsx` — 72 lines, iframe portal to 3D viewer
- `TrainingCenter.tsx` — 313 lines, 5 training tracks, building-gated unlocks
- `UniverseEvents.tsx` — 478 lines, multi-source event aggregation, join/leave

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
- [ ] `/api/high-command/*` (13 endpoints) — no HighCommand page
- [ ] `/api/smithy/*` (7 endpoints) — no Smithy page
- [ ] `/api/bank-vault/*` (7 endpoints) — no BankVault page
- [ ] `/api/orbital-stations/*` (10 endpoints) — Stations page doesn't call these
- [ ] `/api/government-buildings/*` (10 endpoints) — no dedicated page
- [ ] `/api/government-progression/*` (6 endpoints) — no dedicated page
- [ ] `/api/resource-trading/*` (5 endpoints) — no dedicated page
- [ ] `/api/unit-systems/*` (7 endpoints) — no dedicated page
- [ ] `/api/unit-taxonomy/*` (10 endpoints) — no dedicated page
- [ ] `/api/moons/*` (6 endpoints) — no Moons page
- [ ] `/api/spore-drive/*` (6 endpoints) — no SporeDrive page
- [ ] `/api/config/*` (8 endpoints) — no dedicated page
- [ ] `/api/research/xp/*` (4 endpoints) — no dedicated page
- [ ] `/api/research/recommendations/*` (3 endpoints) — no dedicated page
- [ ] `/api/game-asset-library` — GameAssetsGallery page doesn't use it

### ✅ DONE — Hardcoded Values Made Configurable
- `electron-main.cjs` — `SERVER_PORT` now reads from `PORT` or `SERVER_PORT` env var
- `server/basicAuth.ts` — CORS origins now reads from `CORS_ORIGINS` env var (comma-separated)
- `server/services/gameJobs.ts` — tick intervals now read from env vars:
  - `RESOURCE_TICK_INTERVAL`, `TURN_TICK_INTERVAL`, `CONSTRUCTION_TICK_INTERVAL`
  - `DAILY_RESET_INTERVAL`, `WEEKLY_RESET_INTERVAL`, `MAINTENANCE_INTERVAL`, `MARKET_TICK_INTERVAL`
- `server/services/gameJobs.ts` — login bonuses now read from `LOGIN_BONUS_CREDITS`, `LOGIN_BONUS_METAL`
- `server/services/gameJobs.ts` — production multipliers now read from `PRODUCTION_METAL_MULTIPLIER`, `PRODUCTION_CRYSTAL_MULTIPLIER`, `PRODUCTION_DEUTERIUM_MULTIPLIER`, `PRODUCTION_ENERGY_MULTIPLIER`
- `.env.example` updated with all new variables

### Signature Mismatches (FIXED)
- ✅ `schedulerSystem.ts` — `processApocalypse()` now passes `Date.now()` as tick
- ✅ `schedulerSystem.ts` — `processDefenseDegrade()` now passes sector data

---

## P3 — Low (cleanup and polish)

### ✅ DONE — Debug Logging Removed
- `shipFittingModules.ts:1891` — removed catalog load log
- `GameLoop.tsx:12` — removed tick log
- `update-client.ts:248` — removed debug block

### ✅ DONE — Security Fixes Applied
- `vite.config.ts` — `host` now defaults to `"localhost"` (env configurable via `VITE_HOST`)
- `electron-main.cjs` — `will-navigate` policy blocks navigation outside localhost
- `electron-main.cjs` — `setWindowOpenHandler` denies new windows to external URLs
- `electron-main.cjs` — tray icon error now logs to `console.error` instead of silent `console.log`

### ✅ DONE — TypeScript Errors
- Verified: `BlueprintCharges.tsx`, `CronDashboard.tsx`, `DimensionalAnomalies.tsx`, `EmpireProfile.tsx`, `ResourceRefineries.tsx` — Card component usage is correct, no prop type mismatches found

### Documentation Created
- ✅ `README.md` — comprehensive project README
- ✅ `docs/GAME_ENGINE.md` — game engine technical reference
- ✅ `docs/RACE_SPECIFIC_NAMING.md` — race-specific naming for 8 races
- ✅ `docs/WOWS_TECH_TREE_SYSTEM.md` — WoWs-style branching tech tree design
- ✅ `docs/assets/logo.svg` — game logo

---

## Quick Reference — File Locations

| What | Path |
|------|------|
| Scheduler (all implemented) | `server/systems/schedulerSystem.ts` |
| Services (all correct) | `server/services/resourceService.ts`, `fleetService.ts`, `technologyService.ts` |
| In-memory raids | `server/routes-missing.ts` |
| In-memory smithy | `server/routes-smithy.ts` |
| In-memory bank vault | `server/routes-bank-vault.ts` |
| In-memory orbital stations | `server/routes-orbital-stations.ts` |
| In-memory moons | `server/routes-moons.ts` |
| In-memory spore drive | `server/routes-spore-drive.ts` |
| Cron (auth added) | `server/routes-cron.ts` |
| Missing API routes | `server/routes-missing-api.ts` |
| Bounty system (DB-backed) | `server/systems/bountySystem.ts` |
| Colonization system (DB-backed) | `server/systems/colonizationSystem.ts` |
| OGamex stubs | `generated/ogamex-ts/` |
| Electron config | `electron-builder.json`, `electron-main.cjs` |
| WoWs tech tree design | `docs/WOWS_TECH_TREE_SYSTEM.md` |
| Race naming system | `docs/RACE_SPECIFIC_NAMING.md` |
