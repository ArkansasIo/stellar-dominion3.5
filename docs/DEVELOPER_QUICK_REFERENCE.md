# Developer Quick Reference

Quick lookup table of key files and their purposes.

---

## Client Layer

| File | Purpose |
|------|---------|
| `client/src/main.tsx` | React entry point |
| `client/src/App.tsx` | Root routing (wouter, 80+ routes) |
| `client/src/lib/gameContext.tsx` | Global game state (React Context) |
| `client/src/lib/api-client.ts` | HTTP API client |
| `client/src/lib/queryClient.ts` | TanStack Query config |
| `client/src/hooks/useAuth.ts` | Auth state hook |
| `client/src/lib/authUtils.ts` | Auth utilities |
| `client/src/hooks/useApi.ts` | API request hooks |
| `client/src/hooks/useCivilizationArmy.ts` | Civilization army hook |
| `client/src/lib/utils.ts` | UI utility functions |

> **Source:** `client/src/main.tsx`
> **Source:** `client/src/App.tsx`
> **Source:** `client/src/lib/gameContext.tsx`
> **Source:** `client/src/lib/api-client.ts`
> **Source:** `client/src/hooks/useAuth.ts`

## Client Game Logic

| File | Purpose |
|------|---------|
| `client/src/lib/resourceMath.ts` | Resource calculations |
| `client/src/lib/combatEngine.ts` | Client combat simulation |
| `client/src/lib/combatSystem.ts` | Combat system utilities |
| `client/src/lib/gameLogic.ts` | Core game logic |
| `client/src/lib/turnBasedMmorpg.ts` | Turn-based MMORPG mechanics |
| `client/src/lib/empireManager.ts` | Empire state management |
| `client/src/lib/timeUtils.ts` | Time calculations |
| `client/src/lib/allianceSystems.ts` | Alliance logic |
| `client/src/lib/governmentSystems.ts` | Government logic |
| `client/src/lib/colonySystems.ts` | Colony logic |
| `client/src/lib/commanderSystems.ts` | Commander logic |
| `client/src/lib/commanderTypes.ts` | Commander types |
| `client/src/lib/megaStructures.ts` | Megastructure logic |
| `client/src/lib/blueprintSystem.ts` | Blueprint crafting |
| `client/src/lib/achievementsSystem.ts` | Achievement tracking |
| `client/src/lib/universeSeed.ts` | Universe generation |
| `client/src/lib/warpNetwork.ts` | Warp network |
| `client/src/lib/kardashevScale.ts` | Kardashev progression |
| `client/src/lib/interplanetaryPowerGrid.ts` | Power grid |
| `client/src/lib/artifactRelicSystems.ts` | Artifact/relic systems |
| `client/src/lib/skills90System.ts` | 90-level skills |
| `client/src/lib/adminControlSystems.ts` | Admin controls |
| `client/src/lib/universeEvents.ts` | Universe events |
| `client/src/lib/environmentSystems.ts` | Environmental systems |
| `client/src/lib/orbitalDefenseSystem.ts` | Orbital defense |
| `client/src/lib/refinerySystemsCatalog.ts` | Refinery systems |
| `client/src/lib/update-client.ts` | Update client logic |
| `client/src/lib/celestialObjects.ts` | Celestial objects |
| `client/src/lib/startingColonies.ts` | Starting colonies |
| `client/src/lib/planetUtils.ts` | Planet utilities |
| `client/src/lib/planetDossier.ts` | Planet dossier |

> **Source:** `client/src/lib/resourceMath.ts`
> **Source:** `client/src/lib/combatEngine.ts`
> **Source:** `client/src/lib/allianceSystems.ts`
> **Source:** `client/src/lib/governmentSystems.ts`
> **Source:** `client/src/lib/colonySystems.ts`

## Client Data Catalogs

| File | Purpose |
|------|---------|
| `client/src/lib/unitData.ts` | Fleet unit definitions |
| `client/src/lib/techData.ts` | Technology data |
| `client/src/lib/stationData.ts` | Station data |
| `client/src/lib/militaryData.ts` | Military data |
| `client/src/lib/militaryAttributes.ts` | Military attributes |
| `client/src/lib/factionData.ts` | Faction data |
| `client/src/lib/governmentData.ts` | Government data |
| `client/src/lib/marketData.ts` | Market data |
| `client/src/lib/interstellarData.ts` | Interstellar data |
| `client/src/lib/artifactData.ts` | Artifact data |
| `client/src/lib/skillsData.ts` | Skills data |
| `client/src/lib/solSystemData.ts` | Sol system data |
| `client/src/lib/cronData.ts` | Cron data |
| `client/src/lib/vendorData.ts` | Vendor data |
| `client/src/lib/researchData.ts` | Research data |
| `client/src/lib/researchTechnologyTreeCatalog.ts` | Research tree catalog |
| `client/src/lib/researchLabAdministration.ts` | Research lab admin |
| `client/src/lib/unitPersonnelGenClone.ts` | Unit personnel generation |
| `client/src/lib/shipFittingModules.ts` | Ship fitting modules |
| `client/src/lib/ogameShips.ts` | OGame ships |
| `client/src/lib/ogameResearch.ts` | OGame research |
| `client/src/lib/ogameBuildings.ts` | OGame buildings |
| `client/src/lib/starshipLineCatalog.ts` | Starship catalog |
| `client/src/lib/megastructureExpansionCatalog.ts` | Megastructure expansion |
| `client/src/lib/kardashevUpgradeCatalog.ts` | Kardashev upgrades |
| `client/src/lib/facilityOperationsCatalog.ts` | Facility operations |
| `client/src/lib/facilityExpansionCatalog.ts` | Facility expansion |

> **Source:** `client/src/lib/unitData.ts`
> **Source:** `client/src/lib/techData.ts`
> **Source:** `client/src/lib/militaryData.ts`
> **Source:** `client/src/lib/marketData.ts`

---

## Server Layer

| File | Purpose |
|------|---------|
| `server/index.ts` | Express server entry |
| `server/routes.ts` | Route registration hub |
| `server/routes-gameactions.ts` | Game actions (build, upgrade, deploy) |
| `server/routes-game.ts` | Game state queries |
| `server/routes-turnsystem.ts` | Turn system endpoints |
| `server/routes-combat.ts` | Combat endpoints |
| `server/routes-research.ts` | Research endpoints |
| `server/routes-researchlab.ts` | Research lab endpoints |
| `server/routes-researchxp.ts` | Research XP endpoints |
| `server/routes-alliances.ts` | Alliance endpoints |
| `server/routes-guilds.ts` | Guild endpoints |
| `server/routes-trading.ts` | Trading endpoints |
| `server/routes-resource-trading.ts` | Resource trading endpoints |
| `server/routes-trades.ts` | Trade route endpoints |
| `server/routes-government-progression.ts` | Government progression |
| `server/routes-government-leaders.ts` | Government leaders |
| `server/routes-government-buildings.ts` | Government buildings |
| `server/routes-civilization-system.ts` | Civilization system |
| `server/routes-civilization.ts` | Civilization management |
| `server/routes-commanders.ts` | Commander endpoints |
| `server/routes-megastructures.ts` | Megastructure endpoints |
| `server/routes-orbital-stations.ts` | Orbital station endpoints |
| `server/routes-lifesupport.ts` | Life support endpoints |
| `server/routes-espionage.ts` | Espionage endpoints |
| `server/routes-expeditions.ts` | Expedition endpoints |
| `server/routes-achievements.ts` | Achievement endpoints |
| `server/routes-leaderboard.ts` | Leaderboard endpoints |
| `server/routes-liveops.ts` | Live ops endpoints |
| `server/routes-smithy.ts` | Smithy endpoints |
| `server/routes-high-command.ts` | High command endpoints |
| `server/routes-spore-drive.ts` | Spore drive endpoints |
| `server/routes-army-system.ts` | Army system endpoints |
| `server/routes-army-building-structures.ts` | Army building endpoints |
| `server/routes-artifacts.ts` | Artifact endpoints |
| `server/routes-autobuyresources.ts` | Auto-buy endpoints |
| `server/routes-constructor-yard.ts` | Constructor yard endpoints |
| `server/routes-customlabs.ts` | Custom lab endpoints |
| `server/routes-database-admin.ts` | Database admin endpoints |
| `server/routes-diagnostics.ts` | Diagnostics endpoints |
| `server/routes-empire-combat-universe.ts` | Empire combat endpoints |
| `server/routes-friends.ts` | Friends endpoints |
| `server/routes-forums.ts` | Forums endpoints |
| `server/routes-galaxy.ts` | Galaxy endpoints |
| `server/routes-game-asset-library.ts` | Game asset library endpoints |
| `server/routes-messages.ts` | Messages endpoints |
| `server/routes-moons.ts` | Moon endpoints |
| `server/routes-multiplayerbonuses.ts` | Multiplayer bonus endpoints |
| `server/routes-ogame.ts` | OGame endpoints |
| `server/routes-planets.ts` | Planet endpoints |
| `server/routes-recommendations.ts` | Recommendations endpoints |
| `server/routes-settings.ts` | Settings endpoints |
| `server/routes-status.ts` | Server status endpoints |
| `server/routes-travel.ts` | Fleet travel endpoints |
| `server/routes-unitsystems.ts` | Unit system endpoints |
| `server/routes-unit-taxonomy.ts` | Unit taxonomy endpoints |
| `server/routes-worldactions.ts` | World action endpoints |
| `server/routes-account.ts` | Account endpoints |
| `server/routes-admin.ts` | Admin endpoints |
| `server/routes-api-core.ts` | Core API endpoints |
| `server/routes-assets.ts` | Asset endpoints |
| `server/routes-bank-vault.ts` | Bank vault endpoints |
| `server/routes-missing.ts` | Missing feature endpoints |
| `server/routes-realms.ts` | Realm endpoints |
| `server/routes-universe-seed.ts` | Universe seed endpoints |
| `server/routes-researchxp.ts` | Research XP endpoints |

> **Source:** `server/routes.ts`
> **Source:** `server/routes-gameactions.ts`
> **Source:** `server/routes-combat.ts`
> **Source:** `server/routes-research.ts`

## Server Engines

| File | Purpose |
|------|---------|
| `server/gameEngine.ts` | Turn processing engine |
| `server/combatEngine.ts` | Combat resolution engine |
| `server/storage.ts` | Database access layer |
| `server/static.ts` | Static file serving |
| `server/vite.ts` | Vite dev server |
| `server/terminalUI.ts` | Terminal UI |
| `server/update-manager.ts` | Update management |
| `server/loadEnv.ts` | Environment loading |
| `server/basicAuth.ts` | Basic auth |
| `server/replitAuth.ts` | Replit OAuth |
| `server/middleware/adminIpCheck.ts` | Admin IP check |

> **Source:** `server/gameEngine.ts`
> **Source:** `server/combatEngine.ts`
> **Source:** `server/storage.ts`

## Server Services

| File | Purpose |
|------|---------|
| `server/services/resourceService.ts` | Resource production |
| `server/services/fleetService.ts` | Fleet management |
| `server/services/technologyService.ts` | Technology research |
| `server/services/turnSystemService.ts` | Turn system |
| `server/services/universeSeedService.ts` | Universe generation |
| `server/services/universeResetService.ts` | Universe reset |
| `server/services/governmentProgressionService.ts` | Government advancement |
| `server/services/civilizationSystemService.ts` | Civilization system |
| `server/services/megastructureService.ts` | Megastructure construction |
| `server/services/achievementService.ts` | Achievement processing |
| `server/services/missingFeatureService.ts` | Feature placeholders |
| `server/services/raidOperationsService.ts` | Raid operations |
| `server/services/researchLabService.ts` | Research lab management |
| `server/services/researchRecommendationsService.ts` | AI recommendations |
| `server/services/researchTradingService.ts` | Research trading |
| `server/services/researchXPService.ts` | Research XP |
| `server/services/multiplayerBonusesService.ts` | Alliance bonuses |
| `server/services/autoBuyResourcesService.ts` | Auto-buy resources |
| `server/services/serverStatusService.ts` | Server status |
| `server/services/issueService.ts` | Issue tracking |
| `server/services/debugService.ts` | Debug utilities |
| `server/services/warningService.ts` | Warnings |
| `server/services/gameAssetsService.ts` | Game assets |
| `server/services/customLabService.ts` | Custom labs |
| `server/services/constructorYardService.ts` | Constructor yard |
| `server/services/ogameMissionService.ts` | OGame missions |
| `server/services/ogameCatalogService.ts` | OGame catalog |
| `server/services/armySystemService.ts` | Army system |
| `server/services/armyBuildingStructuresService.ts` | Army buildings |

> **Source:** `server/services/resourceService.ts`
> **Source:** `server/services/fleetService.ts`
> **Source:** `server/services/technologyService.ts`
> **Source:** `server/services/turnSystemService.ts`

---

## Shared Layer

| File | Purpose |
|------|---------|
| `shared/schema.ts` | Drizzle ORM schema (72+ tables) |
| `shared/api-types.ts` | API type definitions |
| `shared/types.ts` | Additional types |
| `shared/expeditionData.ts` | Expedition data |
| `shared/gamedata.ts` | Game data |
| `shared/config/index.ts` | Config barrel export |
| `shared/sql/settings/index.ts` | SQL seed data |

> **Source:** `shared/schema.ts`
> **Source:** `shared/api-types.ts`
> **Source:** `shared/config/index.ts`

## Database

| File | Purpose |
|------|---------|
| `server/db/index.ts` | PostgreSQL connection pool |
| `server/db/init.ts` | Schema initialization |
| `server/db/system-settings-seed.ts` | Settings seed |
| `server/database/settings/querySettings.ts` | Settings queries |

> **Source:** `server/db/index.ts`
> **Source:** `server/db/init.ts`
