# Stellar Dominion — Project Roadmap

> **Alpha 1.5.0** | React 19 + TypeScript + Express.js + PostgreSQL
> Last updated: 2026-06-19

---

## Progress Overview

| Phase | Status | Files | Priority |
|-------|--------|-------|----------|
| Core Engine | ✅ Complete | 4 | P0 |
| Database Schema | ✅ Complete | 2 | P0 |
| API Routes | ✅ Complete | 65 | P0 |
| Services | ✅ Complete | 45 | P0 |
| Game Systems | ✅ Complete | 12 | P0 |
| Frontend Pages | ✅ Complete | 83 | P0 |
| Documentation | ✅ Complete | 75+ | P1 |
| Config Systems | ✅ Complete | 97+ | P0 |
| Legacy Config | ✅ Complete | 16 | P1 |
| Build & Deploy | ✅ Complete | 19 | P0 |

---

## Phase 1: Core Engine

### 1.1 Server Entry & Configuration
| File | Lines | Purpose |
|------|-------|---------|
| `server/index.ts` | — | Express app setup, route registration, middleware |
| `server/loadEnv.ts` | — | Environment variable loading |
| `server/vite.ts` | — | Vite dev server middleware |
| `server/static.ts` | — | Static file serving |
| `server/logger.ts` | — | Logging system |
| `server/terminalUI.ts` | — | Terminal display |
| `server/consoleMenu.ts` | — | Console menu |

### 1.2 Game Engines
| File | Lines | Purpose |
|------|-------|---------|
| `server/gameEngine.ts` | 379 | Resource ticks, building, ship construction |
| `server/combatEngine.ts` | 326 | Battle simulation, damage calculation |
| `server/storage.ts` | 2,596 | Database gateway (60+ tables) |

**gameEngine.ts functions:**
- `calculateProduction(buildings, research)` — Hourly resource production
- `calculateBuildingCost(type, level)` — Exponential cost scaling
- `calculateBuildTime(type, level, roboticsLevel)` — Build time calculation
- `processResourceTick(userId)` — Core resource tick (elapsed-time based)
- `startBuilding(userId, buildingType)` — Start construction (max 5 queue)
- `processConstructionQueue(userId)` — Check completed constructions
- `buildShips(userId, shipType, quantity)` — Build ships
- `processCoreGameTick(userId)` — Orchestrator: resource + construction tick

**combatEngine.ts functions:**
- `getUnitStats(unitType, research, bonusMultiplier)` — Effective stats
- `calculateDamage(attacker, defender, isCritical)` — Damage formula
- `simulateCombatRound(attacker, defender, round)` — Single round
- `simulateBattle(attackerForce, defenderForce)` — Full battle (100 rounds)
- `calculateVictoryResources(defenderResources, winner)` — 30% plunder

### 1.3 Authentication
| File | Purpose |
|------|---------|
| `server/basicAuth.ts` | Session auth, dev bypass |
| `server/replitAuth.ts` | Replit OIDC integration |
| `server/middleware/adminIpCheck.ts` | Admin IP whitelist |

---

## Phase 2: Database Schema

### 2.1 TypeScript Schema
| File | Tables | Lines |
|------|--------|-------|
| `shared/schema.ts` | 72 Drizzle ORM tables | 2,020 |

### 2.2 SQL Schema
| File | Tables |
|------|--------|
| `shared/sql/schema/01_base_tables.sql` | users, player_states |
| `shared/sql/schema/02_game_tables.sql` | battles, battle_logs |
| `shared/sql/schema/03_advanced_tables.sql` | expeditions, encounters |
| `shared/sql/schema/admin.sql` | admin_users |
| `shared/sql/schema/currency.sql` | player_currency, transactions |
| `shared/sql/schema/game.sql` | game tables |
| `shared/sql/schema/units.sql` | troops, squads |
| `shared/sql/schema/universe.sql` | galaxies, sectors |
| `shared/sql/schema/user_accounts.sql` | user accounts |
| `shared/sql/full_game_foundation.sql` | All tables (1,482 lines) |

---

## Phase 3: API Routes (65+ files)

### 3.1 Core Routes
| File | Endpoints |
|------|-----------|
| `server/routes.ts` | `/api/auth/*`, `/api/player/*`, `/api/game/*`, `/api/market/*` (676 lines) |
| `server/routes-api-core.ts` | `isAuthenticated`, `schemas` |
| `server/routes-game.ts` | `/api/game/resources/fleet/technology` |
| `server/routes-status.ts` | `/api/status/*` |

### 3.2 Game Actions
| File | Endpoints |
|------|-----------|
| `server/routes-gameactions.ts` | `/api/game/sync-tick`, `/api/game/build`, `/api/game/send-fleet`, `/api/game/process-missions` (646 lines) |

### 3.3 Combat Routes
| File | Endpoints |
|------|-----------|
| `server/routes-combat.ts` | `/api/combat/stats`, `/api/combat/attack`, `/api/combat/garrison` (544 lines) |
| `server/routes-army-system.ts` | `/api/army/*` |
| `server/routes-army-building-structures.ts` | `/api/army-buildings/*` |
| `server/routes-empire-combat-universe.ts` | `/api/empire/combat/*` |
| `server/routes-espionage.ts` | `/api/espionage/*` |
| `server/routes-high-command.ts` | `/api/high-command/*` |

### 3.4 Economy Routes
| File | Endpoints |
|------|-----------|
| `server/routes-resource-trading.ts` | `/api/trading/*` |
| `server/routes-trading.ts` | `/api/trading/request/*` |
| `server/routes-trades.ts` | `/api/trades/*` |
| `server/routes-bank-vault.ts` | `/api/bank-vault/*` |
| `server/routes-autobuyresources.ts` | `/api/autobuy/*` |
| `server/routes-smithy.ts` | `/api/smithy/*` |

### 3.5 Research Routes
| File | Endpoints |
|------|-----------|
| `server/routes-research.ts` | `/api/research/*` |
| `server/routes-researchlab.ts` | `/api/research/labs/*` |
| `server/routes-researchxp.ts` | `/api/research/xp/*` |
| `server/routes-recommendations.ts` | `/api/research/recommendations` |
| `server/routes-customlabs.ts` | `/api/labs/*` |

### 3.6 Galaxy & Universe Routes
| File | Endpoints |
|------|-----------|
| `server/routes-galaxy.ts` | `/api/galaxy/*` |
| `server/routes-planets.ts` | `/api/planets/*` |
| `server/routes-moons.ts` | `/api/moons/*` |
| `server/routes-travel.ts` | `/api/travel/*` |
| `server/routes-universe-seed.ts` | `/api/universe/seed/*` |
| `server/routes-megastructures.ts` | `/api/megastructures/*` |
| `server/routes-orbital-stations.ts` | `/api/orbital-stations/*` |
| `server/routes-lifesupport.ts` | `/api/lifesupport/*` |

### 3.7 Social Routes
| File | Endpoints |
|------|-----------|
| `server/routes-alliances.ts` | `/api/alliances/*` |
| `server/routes-guilds.ts` | `/api/guilds/*` |
| `server/routes-friends.ts` | `/api/friends/*` |
| `server/routes-messages.ts` | `/api/messages/*` |
| `server/routes-forums.ts` | `/api/forums/*` |
| `server/routes-multiplayerbonuses.ts` | `/api/alliances/bonuses/*` |

### 3.8 Government & Commander Routes
| File | Endpoints |
|------|-----------|
| `server/routes-government-progression.ts` | `/api/government/progression/*` |
| `server/routes-government-leaders.ts` | `/api/government/leaders/*` |
| `server/routes-government-buildings.ts` | `/api/government-buildings/*` |
| `server/routes-commanders.ts` | `/api/commanders/*` |
| `server/routes-civilization-system.ts` | `/api/civilization/*` |

### 3.9 Advanced Systems Routes
| File | Endpoints |
|------|-----------|
| `server/routes-expeditions.ts` | `/api/expeditions/*` |
| `server/routes-gameactions.ts` | `/api/game/action/*` |
| `server/routes-spore-drive.ts` | `/api/spore-drive/*` |
| `server/routes-constructor-yard.ts` | `/api/constructor-yard/*` |
| `server/routes-achievements.ts` | `/api/achievements/*` |
| `server/routes-artifacts.ts` | `/api/artifacts/*` |
| `server/routes-leaderboard.ts` | `/api/leaderboard/*` |
| `server/routes-liveops.ts` | `/api/liveops/*` |
| `server/routes-ogame.ts` | `/api/ogame/*` |

### 3.10 Admin Routes
| File | Endpoints |
|------|-----------|
| `server/routes-admin.ts` | `/api/admin/*` |
| `server/routes-database-admin.ts` | `/api/db-admin/*` |
| `server/routes-diagnostics.ts` | `/api/diagnostics/*` |

---

## Phase 4: Services (45 files)

### 4.1 Core Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `turnSystemService.ts` | 400 | `generateTurns`, `spendTurns`, `progressResearchByTurns` |
| `resourceService.ts` | 14 | Stub (delegates to gameEngine) |
| `fleetService.ts` | 14 | Stub (delegates to gameEngine) |
| `technologyService.ts` | 14 | Stub (delegates to gameEngine) |
| `universeSeedService.ts` | — | Universe generation |
| `serverStatusService.ts` | — | Server monitoring |
| `universeResetService.ts` | — | Universe reset |

### 4.2 Military Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `raidOperationsService.ts` | 171 | `normalizeRaidCareer`, `calculateCommanderRaidPower` |
| `armySystemService.ts` | — | Army management |
| `armyBuildingStructuresService.ts` | — | Army buildings |

### 4.3 Economy Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `tradingService.ts` | 465 | `createTradeOrder`, `fillOrder`, `quickExchange`, `createAuction` |
| `currencyService.ts` | 220 | `addCurrency`, `deductCurrency`, `transferCurrency` |
| `bankService.ts` | 305 | `depositToBank`, `withdrawFromBank`, `processInterest`, `purchaseInsurance` |
| `autoBuyResourcesService.ts` | — | Auto-buy resources |

### 4.4 Research Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `researchLabService.ts` | — | Lab management |
| `researchProgressionService.ts` | — | Research progression |
| `researchRecommendationsService.ts` | — | AI recommendations |
| `researchTradingService.ts` | — | Research trading |
| `researchXPService.ts` | — | Research XP |
| `customLabService.ts` | — | Custom labs |

### 4.5 Social Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `allianceService.ts` | — | Alliance management |
| `guildService.ts` | — | Guild management |
| `friendService.ts` | — | Friends system |
| `messageService.ts` | — | Messaging system |
| `forumService.ts` | — | Forum system |
| `multiplayerBonusesService.ts` | — | MP bonuses |

### 4.6 Advanced Services
| File | Lines | Key Functions |
|------|-------|---------------|
| `espionageService.ts` | 308 | `scanTarget`, `sendSpyMission`, `sabotageMission` |
| `expeditionService.ts` | 186 | `startExpedition`, `resolveExpedition` |
| `megastructureService.ts` | 546 | `constructMegastructureForPlayer`, `upgradeMegastructureLevelForPlayer` |
| `orbitalStationService.ts` | 474 | `buildStation`, `upgradeStation`, `addModule` |
| `sporeDriveService.ts` | 447 | `executeJump`, `consumeSpores`, `getMycelialNetwork` |
| `lifeSupportService.ts` | 368 | `getLifeSupportStatus`, `processLifeSupportTick` |
| `commanderGachaService.ts` | 417 | `pullCommander`, `calculatePityRate` |
| `governmentProgressionService.ts` | 327 | `unlockNode`, `rankUpNode`, `addGovernmentXP` |
| `civilizationSystemService.ts` | 408 | `upgradeSubsystem`, `assignWorkforce`, `processTurn` |
| `achievementService.ts` | 381 | `initializeAchievements`, `getPlayerAchievements` |
| `durabilityService.ts` | — | Durability system |
| `ogameCatalogService.ts` | — | OGame catalog |
| `gameAssetsService.ts` | — | Game assets |
| `constructorYardService.ts` | — | Constructor yard |

---

## Phase 5: Game Systems (12 files)

| File | Lines | Key Functions |
|------|-------|---------------|
| `resourceProductionSystem.ts` | 142 | `processPlanetProduction`, `applyResourceLimits` |
| `portTradingSystem.ts` | 149 | `buyFromPort`, `sellToPort`, `regeneratePortResources` |
| `colonizationSystem.ts` | 205 | `createColony`, `processColonistTick`, `buildBase` |
| `upgradeSystem.ts` | 82 | `calculateUpgradeCost`, `upgradeShipEquipment` |
| `defenseSystem.ts` | 114 | `calculateDefenseDegrade`, `calculateFighterMaintenance` |
| `scanningSystem.ts` | 109 | `scanSector`, `calculateScanError`, `fullScan` |
| `bountySystem.ts` | 108 | `placeBounty`, `claimBounty`, `applyBountyPenalties` |
| `apocalypseSystem.ts` | 121 | `processApocalypse`, `calculateSpacePlague`, `processDoomsday` |
| `igbSystem.ts` | 107 | `processIGBInterest`, `calculateLoanInterest` |
| `rankingSystem.ts` | 105 | `calculatePlayerScore`, `updateRankings`, `calculateRatingChange` |
| `schedulerSystem.ts` | 154 | `processTick`, `processTurns`, `processPortProduction` |
| `index.ts` | 97 | Barrel exports |

---

## Phase 6: Frontend

### 6.1 Entry Points
| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Router, providers, layout |
| `client/src/main.tsx` | React root |
| `client/src/index.css` | Tailwind CSS imports |

### 6.2 Pages (83 files)
| Category | Pages | Lines Range |
|----------|-------|-------------|
| Auth & Setup | Auth (779), AccountSetup (389), AdminLogin (487) | 389-779 |
| Core Game | Overview (945), Resources (683), Facilities (1020), Research (438), Fleet (797), Shipyard (338), Combat (418), BattleLogs (187) | 187-1020 |
| Military | Army (374), ArmyManagement (693), TrainingCenter (295), GroundCombat (340), OrbitalDefense (428) | 295-693 |
| Galaxy | Galaxy (502), Universe (516), UniverseGenerator (797), Interstellar (480), CelestialBrowser (343), BiomeCodex (284), BiomeDetail (181) | 181-797 |
| Planets | PlanetDetail (593), PlanetCommand (927), PlanetaryOccupation (510), Colonies (726), Stations (903), MegaStructures (328) | 328-927 |
| Empire | EmpireView (748), EmpireCommandCenter (264), EmpirePlanetViewer (520), EmpireProgression (299) | 264-748 |
| Social | Alliance (1016), FriendsList (491), Guilds (367), Factions (277), Messages (907), Forums (279) | 277-1016 |
| Economy | Market (1464), Merchants (199), Storefront (352) | 199-1464 |
| Advanced | TechTree (522), TechnologyTree (365), ResearchLab (660), KnowledgeLibrary (795), ResearchAnalyticsDashboard (308), Blueprints (455), Skills (291), Fitting (296), FittingEnhanced (484) | 291-795 |
| Progression | Achievements (261), Artifacts (315), Relics (340), SeasonPass (315), BattlePass (350), StoryMode (358), Leaderboard (253) | 253-358 |
| Combat | Raids (521), RaidBosses (383), RaidFinder (355), UniverseEvents (447) | 355-521 |
| Exploration | Exploration (629), Expeditions (902), Navigation (81), WarpNetwork (490), PowerGrid (579), CivilizationSystems (445), CivilizationManagement (296) | 81-902 |
| Admin | AdminControl (1552), DatabaseAdmin (798), ServerConsole (831), Diagnostics (351) | 351-1552 |
| Public | About (163), Terms (115), Privacy (123), GameAssetsGallery (331), OgameCompendium (312), ThreeDViewerPortal (69) | 69-331 |

### 6.3 Components (63 files)
| Category | Count |
|----------|-------|
| UI Components (shadcn) | 56 |
| Layout (GameLayout) | 1 |
| Game (PlanetDossier, Habitat) | 2 |
| Research (TechTreeViz) | 1 |
| Shipyard (ConstructorDock) | 1 |
| 3D Views | 2 |

### 6.4 Hooks (5 files)
| File | Lines | Purpose |
|------|-------|---------|
| `useApi.ts` | 483 | API hooks |
| `useAuth.ts` | — | Auth hooks |
| `useCivilizationArmy.ts` | — | Civ/army hooks |
| `use-toast.ts` | — | Toast notifications |
| `use-mobile.tsx` | — | Mobile detection |

### 6.5 Lib Files (70 files)
| Category | Key Files | Lines |
|----------|-----------|-------|
| Core | gameContext.tsx, api-client.ts, queryClient.ts | 1431+, 357, 50 |
| Combat | combatEngine.ts, gameLogic.ts, combatSystem.ts | 413, 244, 211 |
| Game Logic | turnBasedMmorpg.ts, resourceMath.ts, colonySystems.ts | 355, 61, 388 |
| Data | techData.ts, unitData.ts, skillsData.ts, factionData.ts | 344, 251, 64, 498 |
| Fitting | shipFittingModules.ts | 1891 |
| Commander | commanderTypes.ts, commanderSystems.ts | 703, 224 |
| Government | governmentSystems.ts, governmentData.ts | 624, 210 |
| Skills | skills90System.ts | 1115 |
| Achievements | achievementsSystem.ts | 1895 |
| Environment | universeSeed.ts, environmentSystems.ts | 978, 456 |
| Power | interplanetaryPowerGrid.ts, interplanetaryPowerSimulation.ts | 201, 593 |
| Defense | orbitalDefenseSystem.ts | 977+ |
| Navigation | warpNetwork.ts | 153 |
| Blueprints | blueprintSystem.ts | 388 |
| Alliance | allianceSystems.ts | 417 |
| Empire | empireManager.ts | 396 |

---

## Phase 7: Documentation (75+ files)

### 7.1 Core Docs
| File | Lines | Purpose |
|------|-------|---------|
| `README.md` | 1,292 | Master index |
| `docs/ARCHITECTURE.md` | — | System architecture |
| `docs/FRAMEWORK_ARCHITECTURE.md` | — | 5-layer framework |
| `docs/SYSTEMS_OVERVIEW.md` | 1,000+ | All game systems with functions |
| `docs/GDD.md` | 500+ | Complete game design document |

### 7.2 Feature Docs
| File | Purpose |
|------|---------|
| `docs/Combat.md` | Combat system |
| `docs/Economy.md` | Economy system |
| `docs/Ships.md` | Ship system |
| `docs/Technology.md` | Technology system |
| `docs/TechnologyTree.md` | Tech tree |
| `docs/Commander.md` | Commander system |
| `docs/Social.md` | Social features |
| `docs/UniverseAndPlanets.md` | Universe & planets |
| `docs/Interstellar.md` | Interstellar travel |
| `docs/Market.md` | Market & trading |

### 7.3 Design Docs
| File | Purpose |
|------|---------|
| `docs/STELLAR_DOMINION_UML_DESIGN.md` | UML design (56KB) |
| `docs/SHIP_FITTING_SYSTEM.md` | Ship fitting (16KB) |
| `docs/INTERPLANETARY_POWER_GRID.md` | Power grid (14KB) |
| `docs/ORBITAL_DEFENSE_SYSTEM.md` | Orbital defense (7KB) |
| `docs/GOVERNMENT_PROGRESSION_TREE.md` | Government (20KB) |

---

## Phase 8: Config Systems (97+ files)

### 8.1 Core Config
| File | Lines | Purpose |
|------|-------|---------|
| `gameConfig.ts` | 673 | Core balance, resources, buildings, combat, Kardashev |
| `combatConfig.ts` | 109 | Combat formulas, formations, modes |
| `turnSystemConfig.ts` | — | Turn system |
| `progressionSystem.ts` | — | Progression |
| `currencyConfig.ts` | — | Currency |

### 8.2 Technology Config
| File | Lines | Purpose |
|------|-------|---------|
| `technologyTreeConfig.ts` | 1,541 | Tech tree (11 branches, 7 classes) |
| `researchProgression.ts` | — | Research progression |
| `researchXPConfig.ts` | — | Research XP |
| `customLabConfig.ts` | — | Custom labs |

### 8.3 Universe Config
| File | Lines | Purpose |
|------|-------|---------|
| `universeGenerationConfig.ts` | 539 | Universe generation (3 presets) |
| `planetTypesConfig.ts` | — | Planet types |
| `interstellarTravelConfig.ts` | — | Interstellar travel |
| `navigationConfig.ts` | — | Navigation |
| `megastructuresConfig.ts` | — | Megastructures |
| `orbitalStationsConfig.ts` | — | Orbital stations |

### 8.4 Military Config
| File | Lines | Purpose |
|------|-------|---------|
| `combat/army/unitConfig.ts` | 253 | Unit definitions |
| `combat/army/armyCategoriesConfig.ts` | 950+ | Army categories |
| `combat/army/armySubsystemsConfig.ts` | 697 | Army subsystems |
| `combat/army/unitsProgression.ts` | 493 | Ship stats |
| `combat/army/unitSystemsConfig.ts` | 546 | Unit systems |
| `combat/army/armyBuildingStructuresConfig.ts` | 1,400+ | Army structures |
| `combat/army/unitJobTaxonomyConfig.ts` | 981+ | Job taxonomy |
| `combat/army/unitResearchConfig.ts` | 361 | Unit research |
| `combat/army/armyManagementSystem.ts` | 278 | Army management |
| `combat/fleet/fleetCommandSystem.ts` | 226 | Fleet command |
| `combat/combatSettings.ts` | 37 | Combat settings |
| `weaponsAndDefenseConfig.ts` | — | Weapons/defense |

### 8.5 Social Config
| File | Lines | Purpose |
|------|-------|---------|
| `governmentProgressionTreeConfig.ts` | 466 | Government tree (15 nodes) |
| `governmentLeadersConfig.ts` | — | Government leaders (23 types) |
| `governmentBuildingStructuresConfig.ts` | 1,654 | Gov buildings |
| `civilizationJobsConfig.ts` | — | Civilization jobs |
| `civilizationSubsystemsConfig.ts` | — | Civilization subsystems |
| `civilizationMilitaryJobConfig.ts` | — | Military jobs |

### 8.6 Commander Config
| File | Lines | Purpose |
|------|-------|---------|
| `commander/skills/commanderSkillTreeSystem.ts` | 759 | Commander skills (12 classes) |
| `commander/talent-tree/commanderTalentTree.ts` | 1,843+ | Talent tree (314 nodes) |
| `commander/talent-tree/commanderTalentTreeConfig.ts` | 123 | Talent config |
| `commander/mastery/commanderMasteryConfig.ts` | 770+ | Mastery (10 tiers) |
| `commander/gacha/commanderGachaCommandNexus.ts` | 1,141 | Gacha (5 rarities, 10 banners) |
| `commander/vault/commanderBankVault.ts` | 426 | Vault (50 slots) |
| `commander/vault/vaultBankSystem.ts` | 502 | Vault bank |

### 8.7 Economy Config
| File | Lines | Purpose |
|------|-------|---------|
| `economy/resourceSettings.ts` | 57 | Resource settings |
| `economy/devicePrices.ts` | 15 | Device prices |
| `economy/crafting/smithySystem.ts` | 446 | Smithy (20 materials) |
| `economy/crafting/equipmentLoadoutSystem.ts` | 722 | Equipment loadouts |
| `economy/crafting/equipmentTemperingSystem.ts` | 660 | Tempering (6 tiers) |

### 8.8 Legacy Config (16 files)
| File | Purpose |
|------|---------|
| `xenoberage/schedulerConfig.ts` | Scheduler timing |
| `xenoberage/universeConfig.ts` | Universe settings |
| `xenoberage/resourceConfig.ts` | Resource prices |
| `xenoberage/combatConfig.ts` | Combat settings |
| `xenoberage/colonizationConfig.ts` | Colonization |
| `xenoberage/bankConfig.ts` | IGB bank |
| `xenoberage/deviceConfig.ts` | Device prices |
| `xenoberage/startingValuesConfig.ts` | Starting values |
| `xenoberage/progressionConfig.ts` | Progression |
| `xenoberage/bountyConfig.ts` | Bounty system |
| `xenoberage/facilityConfig.ts` | Facilities |
| `xenoberage/xenobeConfig.ts` | Xenobe NPC |
| `xenoberage/newbieProtectionConfig.ts` | Newbie protection |
| `xenoberage/featureFlagsConfig.ts` | Feature flags |
| `xenoberage/localizationConfig.ts` | Localization |
| `xenoberage/index.ts` | Barrel exports |

---

## Phase 9: Build & Deploy

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript config |
| `vite.config.ts` | Vite bundler |
| `drizzle.config.ts` | Drizzle ORM |
| `electron-builder.json` | Electron build |
| `electron-main.js` | Electron main process |
| `Dockerfile` | Docker build |
| `docker-compose.yml` | Docker compose |
| `Procfile` | Heroku/Railway |
| `railway.json` | Railway deploy |
| `fly.toml` | Fly.io deploy |
| `render.yaml` | Render deploy |
| `vercel.json` | Vercel deploy |
| `firebase.json` | Firebase deploy |
| `nginx.conf` | Nginx config |
| `script/build.ts` | Build script |
| `script/dev.ts` | Dev script |

---

## File Count Summary

| Category | Files | Lines (est.) |
|----------|-------|-------------|
| Server Routes | 65+ | ~15,000 |
| Server Services | 45 | ~12,000 |
| Server Core | 15 | ~4,000 |
| Game Systems | 12 | ~1,500 |
| Client Pages | 83 | ~25,000 |
| Client Lib | 70 | ~18,000 |
| Client Components | 63 | ~5,000 |
| Client Hooks | 5 | ~1,200 |
| Shared Config | 97+ | ~30,000 |
| Shared Schema | 2 | ~2,600 |
| SQL Files | 24 | ~3,000 |
| Documentation | 75+ | ~20,000 |
| Build/Deploy | 19 | ~1,000 |
| **Total** | **~570** | **~140,000** |

---

## Systems Implemented

### Core Systems (Complete)
- Turn system, Resource economy, Combat, Research, Fleet management
- Scheduler system (central game tick orchestrator)
- Game engine (resource ticks, building, ship construction)
- Combat engine (battle simulation, damage calculation)

### Military Systems (Complete)
- Army system (15 ship types, 18 categories, 32 sub-categories)
- Fleet command (8 formations, 8 commands, 8 defense platforms)
- Raid operations (role-based: tank/dps/healer/support)
- Espionage (4 mission types with success/detection mechanics)

### Economy Systems (Complete)
- Resource trading (market orders, auction house, quick exchange)
- Banking (5-level bank, interest, insurance, vault)
- Currency (3-tier: silver/gold/platinum)
- Crafting (smithy, equipment loadout, tempering, masterwork)
- Blueprint manufacturing (25+ categories)
- Port trading (dynamic pricing)

### Research Systems (Complete)
- Technology tree (11 branches, 900+ techs, tier 1-99, level 1-999)
- 90-skill EVE-inspired training system
- Custom research labs
- Research recommendations (AI)
- Research trading

### Social Systems (Complete)
- Alliances (150 members, treasury, upgrades, research)
- Guilds (roles, treasury)
- Raids (6-player teams, 90 boss types)
- Friends, Messages, Forums (basic implementations)

### Progression Systems (Complete)
- Government (3-pillar tree, 15 nodes, 10 types)
- Commander (gacha, skill tree, talent tree, mastery, vault)
- Kardashev scale (18 levels)
- Achievements (130 achievements, 10 quests)
- Artifacts & Relics (14 artifacts)
- Story mode (12 Acts, 7 elements)
- Live ops (battle pass, season pass)

### Universe Systems (Complete)
- Universe generation (3 presets, seeded RNG)
- Planet system (8 types, full physics)
- Colonization (1M procedural colonies)
- Warp network, Interstellar travel, Spore drive
- Space anomalies, Universe events
- Orbital stations, Megastructures
- Life support, Defense degradation, Scanning

### Placeholder Systems (Incomplete)
- Espionage (stub only)
- Forums (basic)
- Messages (basic)
- Friends (basic)
- Realms (stub)
- 3D Viewer (basic)
- Training Center (basic)
- Universe Events (basic)
