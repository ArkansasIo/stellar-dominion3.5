<!-- FILE: UML.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-18 -->
# UML Reference - Stellar Dominion

Simplified UML reference for quick navigation.

---

## Server Classes

| Class | File | Purpose |
|-------|------|---------|
| GameEngine | `server/gameEngine.ts` | Core game loop, resource production, construction |
| CombatEngine | `server/combatEngine.ts` | Battle simulation, damage calculation |
| Logger | `server/logger.ts` | Colored console logging with categories |
| Storage | `server/storage.ts` | Database CRUD operations (60+ tables) |
| DebugService | `server/services/debugService.ts` | Debug tracing and file logging |
| IssueService | `server/services/issueService.ts` | Issue tracking and reporting |
| WarningService | `server/services/warningService.ts` | System warnings and alerts |
| ServerStatusService | `server/services/serverStatusService.ts` | Health checks and metrics |
| ProgressionSystem | `shared/config/progressionSystem.ts` | Level/tier scaling formulas |

## Service Singletons

All in `server/services/`:

| Service | Purpose |
|---------|---------|
| AchievementService | Player achievement tracking |
| ArmySystemService | Army unit management |
| AutoBuyResourcesService | Automated resource purchasing |
| CivilizationSystemService | Civilization progression |
| CustomLabService | Custom research labs |
| GameAssetsService | Game asset catalog |
| GovernmentProgressionService | Government tree progression |
| MegastructureService | Megastructure management |
| MultiplayerBonusesService | Multiplayer bonus calculations |
| ResearchLabService | Research lab operations |
| ResearchRecommendationsService | AI research suggestions |
| ResearchTradingService | Research offer marketplace |
| ResearchXPService | Research XP and leveling |
| TurnSystemService | Turn generation and processing |
| UniverseResetService | Universe reset operations |
| UniverseSeedService | Universe generation seeding |

## Client Modules

| Module | File | Purpose |
|--------|------|---------|
| GameProvider | `client/src/lib/gameContext.tsx` | React Context state management |
| ShipFittingModules | `client/src/lib/shipFittingModules.ts` | 90+ ship module catalog |
| PowerGrid | `client/src/lib/interplanetaryPowerGrid.ts` | Energy sources, nodes, tech tree |
| PowerSimulation | `client/src/lib/interplanetaryPowerSimulation.ts` | Grid runtime simulation |
| OrbitalDefense | `client/src/lib/orbitalDefenseSystem.ts` | Orbital platforms and combat |
| GovernmentSystems | `client/src/lib/governmentSystems.ts` | Government subsystems and mechanics |
| MilitaryAttributes | `client/src/lib/militaryAttributes.ts` | Class attributes and buffs |
| queryClient | `client/src/lib/queryClient.ts` | React Query configuration |

## Key Config Files

| Config | File | Scope |
|--------|------|-------|
| combatConfig | `shared/config/combatConfig.ts` | PvP/PvE modes, flanges, difficulty |
| gameConfig | `shared/config/gameConfig.ts` | Balance, economy, rules |
| weaponsAndDefense | `shared/config/weaponsAndDefenseConfig.ts` | 1391 lines, all weapon/defense systems |
| technologyTree | `shared/config/technologyTreeConfig.ts` | 900+ technologies, 11 branches |
| researchProgression | `shared/config/researchProgression.ts` | Research tier/level scaling |
| progressionSystem | `shared/config/progressionSystem.ts` | Unified 1-99 tier, 1-999 level system |
| progressionConfig | `shared/config/progressionSystemConfig.ts` | Level/tier data and multipliers |
| planetTypes | `shared/config/planetTypesConfig.ts` | 50+ planet types with full stats |
| universeGeneration | `shared/config/universeGenerationConfig.ts` | Procedural universe generation |
| governmentTree | `shared/config/governmentProgressionTreeConfig.ts` | Government progression nodes |
| governmentLeaders | `shared/config/governmentLeadersConfig.ts` | 23 leader types |
| governmentBuildings | `shared/config/governmentBuildingStructuresConfig.ts` | 18 categories, 32 sub-categories |

## Database Schema

> **Source:** shared/schema.ts (2020 lines, 72 tables)

### Table Count by Domain

| Domain | Tables |
|--------|--------|
| Users/Auth | 4 (sessions, users, adminUsers, playerProfiles) |
| Player State | 1 (playerStates - massive JSONB columns) |
| Military | 8 (troops, squads, battles, battleLogs, durability x3, repairHistory, durabilityDegradationLog) |
| Economy | 11 (marketOrders, auctions, trades, currency, bank, empireValues) |
| Social | 8 (alliances, guilds, teams, friends) |
| Research | 4 (areas, subcategories, technologies, playerProgress) |
| Universe | 7 (continents, countries, territories, resourceFields, events, bosses, encounters) |
| Story | 2 (campaigns, missions) |
| Items | 2 (items, playerItems) |
| Misc | 25+ (colonies, starbases, moonBases, megastructures, expeditions, raids, etc.) |
| **Total** | **72 tables** |

---

*Quick reference for codebase navigation.*
