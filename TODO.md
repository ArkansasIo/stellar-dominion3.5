# TODO — Universe Empire Dominion

> Generated audit: what's missing, broken, or needs patching.
> Organized by priority: P0 (critical) → P3 (nice-to-have).
> Last updated: 2026-06-22

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

### ✅ DONE — Stub Systems Migrated to DB
- Raids — migrated from in-memory `raidState[]` to `raids` table (JSONB participants)
- Raid Finder — migrated from in-memory `raidFinderQueue[]` to `raidFinder` table
- Universe Events — migrated from `SAMPLE_EVENTS[]` to `universeEvents` table with `event_participants` join table
- Relics Catalog — migrated from `SAMPLE_RELICS[]` to `relics` table; inventory via `relicInventory`
- Moons — migrated from in-memory `MOON_DATABASE` to new `moons` table with JSONB `data` column
- Espionage — added 60-second cooldown, detection mechanics, DB scan history via `espionage_scans` table
- Planet Colonization — now inserts `playerColonies` record after cost deduction

### ✅ DONE — Forums, Messages, Friends, Realms
Functional with basic CRUD. No moderation/real-time/online-status needed for MVP.

### ✅ DONE — Expeditions
Already DB-persisted via `playerState.expeditions` JSONB column.

### ✅ DONE — Missing Client Libraries
All exist: `espionageSystems.ts`, `forumSystems.ts`, `messageSystems.ts`, `friendsSystems.ts`, `realmSystems.ts`.

### ✅ DONE — Missing Config Files
All exist: `espionageConfig.ts`, `forumConfig.ts`, `messageConfig.ts`, `friendsConfig.ts`, `realmConfig.ts`.

### ✅ DONE — Pages Needing Full Implementation
All 4 pages were already fully implemented:
- `OgameCompendium.tsx` — full catalog viewer with search, tabs, cost calculator
- `ThreeDViewerPortal.tsx` — iframe portal to Three.js viewer
- `TrainingCenter.tsx` — 5 training tracks with capacity gating
- `UniverseEvents.tsx` — merges 3 data sources, join/detail panel

### ✅ DONE — New Client Pages for API Route Groups
Created 10 new pages:
- `HighCommand.tsx` — officer slots, strategic orders, synergies
- `Smithy.tsx` — materials, enchantments, blueprints, tempering
- `BankVault.tsx` — currencies, vault, deposit/withdraw/exchange
- `MoonsPage.tsx` — moon list, details, colonize/upgrade
- `SporeDrive.tsx` — drive status, jumps, network, upgrade
- `ResourceTradingPage.tsx` — market, orders, history
- `UnitTaxonomyPage.tsx` — categories, tiers, levels, entries
- `UnitSystemsPage.tsx` — templates, blueprints, train/combat
- `GovernmentBuildingsPage.tsx` — categories, sub-categories, ranks
- `GovernmentProgressionPage.tsx` — tree, pillars, unlock/rankup

### Remaining (lower priority)
- [ ] OGamex stubs (1,395+ files) — massive PHP→TypeScript port, not feasible in current scope

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

### ✅ DONE — Hardcoded Values Made Configurable
All extracted to `server/config/gameSettings.ts` with env var overrides:
- `electron-main.cjs` — `SERVER_PORT` now uses `process.env.PORT || 5001`
- `server/basicAuth.ts` — CORS origins now configurable
- `server/services/gameJobs.ts` — tick intervals, login bonus amounts, resource production multipliers all configurable
- `server/routes-espionage.ts` — espionage config moved to shared config

### Remaining (lower priority)
- [ ] `/api/orbital-stations/*` — Stations page exists but doesn't call these endpoints
- [ ] `/api/config/*` — no dedicated page
- [ ] `/api/research/xp/*` — no dedicated page
- [ ] `/api/research/recommendations/*` — no dedicated page
- [ ] `/api/game-asset-library` — GameAssetsGallery page doesn't use it

### ✅ DONE — Signature Mismatches
- `schedulerSystem.ts` — `processApocalypse()` now passes `Date.now()` as tick
- `schedulerSystem.ts` — `processDefenseDegrade()` now passes sector data

---

## P3 — Low (cleanup and polish)

### ✅ DONE — Debug Logging Removed
- `shipFittingModules.ts:1891` — removed catalog load log
- `GameLoop.tsx:12` — removed tick log
- `update-client.ts:248` — removed debug block

### ✅ DONE — Config / Build Cleanup
- `vite.config.ts` — host changed from `"0.0.0.0"` to `process.env.VITE_HOST || "localhost"`
- `electron-main.cjs` — added CSP headers, `will-navigate`/`new-window` security policies
- `electron-main.cjs` — tray icon error now uses `console.warn` instead of silent `console.log`

### ✅ DONE — TypeScript Errors Fixed
- `CronDashboard.tsx` — removed duplicate lucide-react import
- `DimensionalAnomalies.tsx` — renamed inner `stats` variables to avoid shadowing
- `ResourceRefineries.tsx` — removed unused imports (`Zap as Lightning`, `Cpu`)
- `BlueprintCharges.tsx` — renamed `useMutation2` to `useBlueprintMutation`
- `EmpireProfile.tsx` — added index signature to `EmpireProfile` interface, removed `as any` casts

---

## Quick Reference — File Locations

| What | Path |
|------|------|
| Scheduler (all implemented) | `server/systems/schedulerSystem.ts` |
| Services (all correct) | `server/services/resourceService.ts`, `fleetService.ts`, `technologyService.ts` |
| DB-backed raids | `server/routes-missing.ts` (uses `raids` table) |
| DB-backed events | `server/routes-missing.ts` (uses `universeEvents` + `event_participants`) |
| DB-backed relics | `server/routes-missing.ts` (uses `relics` + `relicInventory`) |
| DB-backed moons | `server/routes-moons.ts` (uses `moons` table) |
| Configurable settings | `server/config/gameSettings.ts` |
| Server logs | `server/routes-missing-api.ts` (uses logger ring buffer) |
| Cron (auth added) | `server/routes-cron.ts` |
| Bounty system (DB-backed) | `server/systems/bountySystem.ts` |
| Colonization system (DB-backed) | `server/systems/colonizationSystem.ts` |
| OGamex stubs | `generated/ogamex-ts/` |
| Electron config | `electron-builder.json`, `electron-main.cjs` |
| WoWs tech tree design | `docs/WOWS_TECH_TREE_SYSTEM.md` |
| Race naming system | `docs/RACE_SPECIFIC_NAMING.md` |