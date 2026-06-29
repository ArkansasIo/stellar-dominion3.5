<!-- FILE: FRAMEWORK_ARCHITECTURE.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-18 -->
# Framework Architecture - 5-Layer Design

> **Source:** All layer files referenced inline.

---

## Overview

Stellar Dominion uses a 5-layer architecture separating presentation, client logic, API transport, server logic, and data persistence.

---

## Layer 1: Presentation (React Pages)

> **Source:** client/src/pages/ (85 pages)

85 page components organized by game system:

| Category | Pages |
|----------|-------|
| Core | Overview, Navigation, Settings, About, Privacy, Terms |
| Military | Combat, GroundCombat, Army, ArmyManagement, OrbitalDefense, Fleet |
| Economy | Resources, Market, Colonies, Facilities, Storefront |
| Research | Research, ResearchLab, TechnologyTree, TechTree |
| Social | Alliance, Guilds, FriendsList, Messages, Forums |
| Government | Government |
| Universe | Galaxy, Universe, UniverseGenerator, UniverseEvents, Interstellar |
| Ship | Shipyard, Fitting, FittingEnhanced |
| Power | PowerGrid |
| Campaign | StoryMode, Expeditions, Raids, RaidFinder, RaidBosses |
| Commander | Commander, Skills, TrainingCenter |
| Mega | MegaStructures, Blueprints, Artifacts, Relics |
| Admin | Admin, AdminControl, AdminLogin, DatabaseAdmin, Diagnostics, ServerConsole |
| Other | Achievements, BattleLogs, BiomeCodex, CelestialBrowser, etc. |

---

## Layer 2: Client Logic (React Context + Libs)

> **Source:** client/src/lib/ (70 files)

### Core State Management

| File | Lines | Purpose |
|------|-------|---------|
| `gameContext.tsx` | 1984 | GameProvider React Context, all player state |
| `queryClient.ts` | 57 | React Query configuration |
| `api-client.ts` | — | HTTP client wrapper |

### Game Systems

| File | Lines | Purpose |
|------|-------|---------|
| `shipFittingModules.ts` | 1891 | 90+ ship modules, fitting interface |
| `interplanetaryPowerGrid.ts` | 201 | Energy sources, nodes, tech, doctrines |
| `interplanetaryPowerSimulation.ts` | 644 | Grid runtime simulation engine |
| `orbitalDefenseSystem.ts` | 1039 | Orbital platforms, modules, combat |
| `governmentSystems.ts` | 624 | Government subsystems and mechanics |
| `militaryAttributes.ts` | 319 | Class attributes, buffs, debuffs |
| `combatEngine.ts` | — | Client-side combat simulation |
| `combatSystem.ts` | — | Combat UI logic |
| `resourceMath.ts` | — | Resource calculation utilities |
| `gameLogic.ts` | — | Core game logic (simCombat, simEspionage) |

### Data Catalogs

| File | Purpose |
|------|---------|
| `commanderTypes.ts` | Commander classes, races, equipment slots |
| `governmentData.ts` | Government types, policies |
| `allianceData.ts` | Alliance structures |
| `artifactData.ts` | Artifact definitions |
| `militaryData.ts` | Unit types and stats |
| `researchData.ts` | Research catalog |
| `marketData.ts` | Market configuration |
| `stationData.ts` | Orbital building definitions |
| `megaStructures.ts` | Megastructure templates |
| `techData.ts` | Technology data |

---

## Layer 3: API Transport (Routes + Middleware)

> **Source:** server/routes-*.ts (60+ route files), server/basicAuth.ts, server/middleware/

### Route Files (60+)

| Route File | Domain |
|------------|--------|
| `routes.ts` | Main router |
| `routes-game.ts` | Game state |
| `routes-combat.ts` | Combat operations |
| `routes-research.ts` | Research operations |
| `routes-researchlab.ts` | Research lab management |
| `routes-researchxp.ts` | Research XP system |
| `routes-recommendations.ts` | Research recommendations |
| `routes-megastructures.ts` | Megastructure operations |
| `routes-government-progression.ts` | Government tree |
| `routes-government-leaders.ts` | Government leaders |
| `routes-government-buildings.ts` | Government buildings |
| `routes-army-system.ts` | Army management |
| `routes-army-building-structures.ts` | Army buildings |
| `routes-alliances.ts` | Alliance operations |
| `routes-guilds.ts` | Guild operations |
| `routes-friends.ts` | Friends list |
| `routes-messages.ts` | Messaging |
| `routes-trading.ts` | Trading operations |
| `routes-resource-trading.ts` | Resource trading |
| `routes-admin.ts` | Admin operations |
| `routes-database-admin.ts` | Database admin |
| `routes-diagnostics.ts` | System diagnostics |
| `routes-galaxy.ts` | Galaxy map |
| `routes-universe-seed.ts` | Universe generation |
| `routes-turnsystem.ts` | Turn system |
| `routes-achievements.ts` | Achievements |
| `routes-commanders.ts` | Commander management |
| `routes-expeditions.ts` | Expeditions |
| `routes-espionage.ts` | Espionage |
| `routes-status.ts` | Server status |
| `routes-forums.ts` | Forums |
| `routes-liveops.ts` | Live operations |
| `routes-assets.ts` | Game assets |
| `routes-customlabs.ts` | Custom labs |
| `routes-autobuyresources.ts` | Auto-buy |
| `routes-bank-vault.ts` | Banking |
| `routes-settings.ts` | Settings |
| `routes-travel.ts` | Travel/Navigation |
| `routes-moons.ts` | Moon bases |
| `routes-orbital-stations.ts` | Orbital stations |
| `routes-civilization-system.ts` | Civilization |
| `routes-spore-drive.ts` | Spore drive |
| `routes-high-command.ts` | High command |
| `routes-leaderboard.ts` | Leaderboard |
| `routes-game-asset-library.ts` | Asset library |
| `routes-multiplayerbonuses.ts` | Multiplayer bonuses |
| `routes-unit-taxonomy.ts` | Unit taxonomy |
| `routes-unitsystems.ts` | Unit systems |
| `routes-worldactions.ts` | World actions |
| `routes-constructor-yard.ts` | Constructor yard |
| `routes-smithy.ts` | Smithy |
| `routes-ogame.ts` | OGame compendium |
| `routes-gameactions.ts` | Game actions |
| `routes-api-core.ts` | API core |
| `routes-lifesupport.ts` | Life support |
| `routes-realms.ts` | Realms |
| `routes-planets.ts` | Planets |
| `routes-empire-combat-universe.ts` | Empire combat |
| `routes-missing.ts` | Missing systems |
| `routes-trades.ts` | Trade history |
| `routes-phpmyadmin.ts` | DB admin panel |
| `routes-account.ts` | Account management |
| `routes-artifacts.ts` | Artifacts |

### Auth Middleware

> **Source:** server/basicAuth.ts (672 lines)

- Session-based with MemoryStore
- Basic Auth header parsing
- Dev bypass mode (DEV_AUTH_BYPASS env)
- Protected non-admin accounts (player1-3)
- Admin role detection via adminUsers table

### Other Middleware

> **Source:** server/middleware/

- `adminIpCheck.ts` — IP-based admin access control

---

## Layer 4: Server Logic (Services + Engines)

> **Source:** server/gameEngine.ts (379 lines)
> **Source:** server/combatEngine.ts (326 lines)
> **Source:** server/services/ (29 service files)

### Core Engines

| Engine | File | Lines | Purpose |
|--------|------|-------|---------|
| GameEngine | `server/gameEngine.ts` | 379 | Game loop, resources, construction |
| CombatEngine | `server/combatEngine.ts` | 326 | Battle simulation |

### Services (29)

| Service | File | Singleton | Purpose |
|---------|------|-----------|---------|
| DebugService | `debugService.ts` | Yes | Debug tracing |
| IssueService | `issueService.ts` | Yes | Issue tracking |
| WarningService | `warningService.ts` | Yes | System warnings |
| ServerStatusService | `serverStatusService.ts` | Yes | Health metrics |
| AchievementService | `achievementService.ts` | Yes | Achievements |
| ArmySystemService | `armySystemService.ts` | Yes | Army management |
| ArmyBuildingStructuresService | `armyBuildingStructuresService.ts` | Yes | Army buildings |
| AutoBuyResourcesService | `autoBuyResourcesService.ts` | Yes | Auto-purchase |
| CivilizationSystemService | `civilizationSystemService.ts` | Yes | Civilization |
| ConstructorYardService | `constructorYardService.ts` | Yes | Construction |
| CustomLabService | `customLabService.ts` | Yes | Research labs |
| FleetService | `fleetService.ts` | Yes | Fleet operations |
| GameAssetsService | `gameAssetsService.ts` | Yes | Asset catalog |
| GovernmentProgressionService | `governmentProgressionService.ts` | Yes | Government tree |
| MegastructureService | `megastructureService.ts` | Yes | Megastructures |
| MissingFeatureService | `missingFeatureService.ts` | Yes | Feature gaps |
| MultiplayerBonusesService | `multiplayerBonusesService.ts` | Yes | Multiplayer bonuses |
| OgameCatalogService | `ogameCatalogService.ts` | Yes | OGame compendium |
| OgameMissionService | `ogameMissionService.ts` | Yes | OGame missions |
| RaidOperationsService | `raidOperationsService.ts` | Yes | Raid operations |
| ResearchLabService | `researchLabService.ts` | Yes | Research labs |
| ResearchRecommendationsService | `researchRecommendationsService.ts` | Yes | AI recommendations |
| ResearchTradingService | `researchTradingService.ts` | Yes | Research trading |
| ResearchXPService | `researchXPService.ts` | Yes | Research XP |
| ResourceService | `resourceService.ts` | Yes | Resource operations |
| TechnologyService | `technologyService.ts` | Yes | Technology tree |
| TurnSystemService | `turnSystemService.ts` | Yes | Turn generation |
| UniverseResetService | `universeResetService.ts` | Yes | Universe reset |
| UniverseSeedService | `universeSeedService.ts` | Yes | Universe seeding |

---

## Layer 5: Data (Schema + Storage)

> **Source:** shared/schema.ts (2020 lines, 72 tables)
> **Source:** server/storage.ts (2596 lines)
> **Source:** server/db/ (database connection)

### Schema (72 tables)

Organized by domain — see [STELLAR_DOMINION_UML_DESIGN.md](STELLAR_DOMINION_UML_DESIGN.md#7-entity-relationship-diagrams) for full ER diagrams.

### Storage Layer

The Storage class in `server/storage.ts` wraps Drizzle ORM operations for all 72 tables. It provides typed CRUD methods with full TypeScript type safety via Zod schemas.

### Database Connection

> **Source:** server/db/index.ts

- PostgreSQL via `@neondatabase/serverless` or direct connection
- Drizzle ORM for type-safe queries
- Connection pooling via `pool` export

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Client (React)                                         │
│    │ useQuery / useMutation                              │
│    ▼                                                    │
│  apiRequest() with Basic Auth                           │
│    │                                                    │
│    ▼                                                    │
│  Vite Proxy (/api/*)                                    │
│    │                                                    │
│    ▼                                                    │
│  Express Server                                         │
│    │ session middleware + auth check                     │
│    ▼                                                    │
│  Route Handler (routes-*.ts)                            │
│    │ validation, auth check                             │
│    ▼                                                    │
│  Service Layer (services/*.ts)                          │
│    │ business logic                                     │
│    ▼                                                    │
│  Storage Layer (storage.ts)                             │
│    │ Drizzle ORM queries                                │
│    ▼                                                    │
│  PostgreSQL (schema.ts: 72 tables)                      │
│    │                                                    │
│    ▼                                                    │
│  Response → Client State Update → UI Re-render          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

*Framework architecture document with all layer files.*
