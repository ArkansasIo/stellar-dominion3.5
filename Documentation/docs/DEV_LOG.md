# Dev Log

Development log tracking major changes, features, and milestones.

---

## Architecture

| Entry | File |
|-------|------|
| Server entry point | `server/index.ts` |
| Route registration hub | `server/routes.ts` |
| Database connection | `server/db/index.ts` |
| Schema definitions | `shared/schema.ts` |
| Config system | `shared/config/` (93+ files) |

> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `server/db/index.ts`
> **Source:** `shared/schema.ts`

---

## Systems Implemented

### Core Game Systems
- Turn system — `server/services/turnSystemService.ts`, `shared/config/turnSystemConfig.ts`
- Resource economy — `server/services/resourceService.ts`, `shared/config/resourceConfig.ts`
- Combat — `server/combatEngine.ts`, `shared/config/combatConfig.ts`
- Research — `server/services/technologyService.ts`, `shared/config/technologyTreeConfig.ts`
- Fleet management — `server/services/fleetService.ts`, `shared/config/staryardConfig.ts`

> **Source:** `server/services/turnSystemService.ts`
> **Source:** `server/services/resourceService.ts`
> **Source:** `server/combatEngine.ts`
> **Source:** `server/services/technologyService.ts`
> **Source:** `server/services/fleetService.ts`

### Social Systems
- Alliances — `server/routes-alliances.ts`, `client/src/lib/allianceSystems.ts`
- Guilds — `server/routes-guilds.ts`
- Trading — `server/routes-trading.ts`, `server/routes-resource-trading.ts`, `server/routes-trades.ts`
- Forums — `server/routes-forums.ts`
- Messages — `server/routes-messages.ts`
- Friends — `server/routes-friends.ts`

> **Source:** `server/routes-alliances.ts`
> **Source:** `server/routes-guilds.ts`
> **Source:** `server/routes-trading.ts`

### Progression Systems
- Government — `server/services/governmentProgressionService.ts`, `shared/config/governmentProgressionTreeConfig.ts`
- Commander — `server/routes-commanders.ts`, `shared/config/commander/`
- Achievements — `server/services/achievementService.ts`, `shared/config/achievementsConfig.ts`
- Skills — `client/src/lib/skills90System.ts`
- Kardashev — `client/src/lib/kardashevScale.ts`

> **Source:** `server/services/governmentProgressionService.ts`
> **Source:** `server/routes-commanders.ts`
> **Source:** `server/services/achievementService.ts`

### Civilization & Territory
- Civilization system — `server/services/civilizationSystemService.ts`, `shared/config/civilizationJobsConfig.ts`
- Megastructures — `server/services/megastructureService.ts`, `shared/config/megastructuresConfig.ts`
- Orbital stations — `server/routes-orbital-stations.ts`, `shared/config/orbitalStationsConfig.ts`
- Life support — `server/routes-lifesupport.ts`, `shared/config/lifeSupportSystemsConfig.ts`
- Universe generation — `server/services/universeSeedService.ts`, `shared/config/universeGenerationConfig.ts`

> **Source:** `server/services/civilizationSystemService.ts`
> **Source:** `server/services/megastructureService.ts`
> **Source:** `server/services/universeSeedService.ts`

### Specialized Systems
- Army system — `server/services/armySystemService.ts`, `shared/config/combat/army/`
- Blueprint system — `shared/config/eveBlueprintSystem.ts`, `client/src/lib/blueprintSystem.ts`
- Smithy — `server/routes-smithy.ts`, `shared/config/smithySystem.ts`
- High command — `server/routes-high-command.ts`, `shared/config/highCommandSystem.ts`
- Durability — `shared/config/durabilityConfig.ts`
- Spore drive — `server/routes-spore-drive.ts`, `shared/config/sporeDriveSystem.ts`
- Espionage — `server/routes-espionage.ts`
- Expeditions — `server/routes-expeditions.ts`, `shared/expeditionData.ts`
- Live ops — `server/routes-liveops.ts`, `shared/config/liveOpsContentConfig.ts`
- Leaderboard — `server/routes-leaderboard.ts`

> **Source:** `server/services/armySystemService.ts`
> **Source:** `server/routes-smithy.ts`
> **Source:** `server/routes-high-command.ts`
> **Source:** `server/routes-spore-drive.ts`
> **Source:** `server/routes-expeditions.ts`
> **Source:** `server/routes-liveops.ts`

### Additional Systems
- Artifacts & relics — `server/routes-artifacts.ts`, `client/src/lib/artifactRelicSystems.ts`
- Constructor yard — `server/routes-constructor-yard.ts`, `shared/config/constructorYardSystemsConfig.ts`
- Custom labs — `server/routes-customlabs.ts`, `shared/config/customLabConfig.ts`
- Refinery — `client/src/lib/refinerySystemsCatalog.ts`
- Warp network — `client/src/lib/warpNetwork.ts`, `shared/config/navigationConfig.ts`
- Power grid — `client/src/lib/interplanetaryPowerGrid.ts`
- OGame integration — `server/routes-ogame.ts`, `shared/config/ogameCatalogConfig.ts`

> **Source:** `server/routes-artifacts.ts`
> **Source:** `server/routes-constructor-yard.ts`
> **Source:** `server/routes-customlabs.ts`
> **Source:** `client/src/lib/warpNetwork.ts`
> **Source:** `client/src/lib/interplanetaryPowerGrid.ts`

---

## Infrastructure

- Update system — `server/update-manager.ts`, `client/src/lib/update-client.ts`
- Basic auth — `server/basicAuth.ts`
- Replit OAuth — `server/replitAuth.ts`
- Admin IP check — `server/middleware/adminIpCheck.ts`
- Terminal UI — `server/terminalUI.ts`
- Vite dev server — `server/vite.ts`
- Static serving — `server/static.ts`

> **Source:** `server/update-manager.ts`
> **Source:** `server/basicAuth.ts`
> **Source:** `server/replitAuth.ts`
> **Source:** `server/middleware/adminIpCheck.ts`

---

## Key Metrics

| Metric | Count |
|--------|-------|
| Database Tables | 72+ |
| Config Files | 93+ |
| Route Modules | 65+ |
| Server Services | 29 |
| Client Pages | 80+ |
| Client Lib Files | 70+ |
