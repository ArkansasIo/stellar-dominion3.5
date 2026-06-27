<!-- FILE: STELLAR_DOMINION_UML_DESIGN.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-18 -->
<!-- FLAGS: uml, architecture, design, reference, documentation -->
<!-- COVERS: stellar-dominion, full-stack, game-systems -->
# Stellar Dominion - Complete UML Architecture & Design Document

> **Stellar Dominion** — A Next-Generation 4X Space Strategy MMORPG (TypeScript/React/PostgreSQL)
> Repository: universe-empire-dominion3

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [5-Layer Framework Architecture](#2-5-layer-framework-architecture)
3. [Server Class Diagrams](#3-server-class-diagrams)
4. [Service Class Diagrams](#4-service-class-diagrams)
5. [Client Class Diagrams](#5-client-class-diagrams)
6. [Sequence Diagrams](#6-sequence-diagrams)
7. [Entity Relationship Diagrams](#7-entity-relationship-diagrams)
8. [Data Flow Diagrams](#8-data-flow-diagrams)
9. [State Management](#9-state-management)

---

## 1. System Overview

Stellar Dominion is a full-stack TypeScript MMORPG built with:
- **Frontend**: React 18 + Vite + React Query + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM
- **Database**: PostgreSQL
- **Shared**: TypeScript configs and schema shared between client/server

### Package Structure

```
universe-empire-dominion3/
├── client/src/
│   ├── lib/          # Client logic (gameContext, shipFitting, powerGrid, etc.)
│   ├── pages/        # 85 page components
│   └── hooks/        # Custom React hooks
├── server/
│   ├── services/     # 29 service classes
│   ├── routes-*.ts   # Route handlers
│   ├── db/           # Database connection
│   └── middleware/   # Auth, validation
└── shared/
    ├── schema.ts     # 72 database tables (Drizzle ORM)
    └── config/       # 95+ configuration files
```

---

## 2. 5-Layer Framework Architecture

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Presentation (React Pages)            │
│  85 pages in client/src/pages/                  │
├─────────────────────────────────────────────────┤
│  Layer 2: Client Logic (React Context + Libs)   │
│  gameContext.tsx, shipFittingModules.ts,         │
│  interplanetaryPowerGrid.ts, etc.               │
├─────────────────────────────────────────────────┤
│  Layer 3: API Transport (Routes + Middleware)    │
│  60+ route files, basicAuth.ts, middleware/     │
├─────────────────────────────────────────────────┤
│  Layer 4: Server Logic (Services + Engines)      │
│  gameEngine.ts, combatEngine.ts, 29 services    │
├─────────────────────────────────────────────────┤
│  Layer 5: Data (Schema + Storage)               │
│  schema.ts (72 tables), storage.ts, db/         │
└─────────────────────────────────────────────────┘
```

---

## 3. Server Class Diagrams

### GameEngine

> **Source:** server/gameEngine.ts

```
┌──────────────────────────────────────────────┐
│                  GameEngine                   │
├──────────────────────────────────────────────┤
│ - resourceService: ResourceService            │
│ - fleetService: FleetService                  │
│ - technologyService: TechnologyService        │
├──────────────────────────────────────────────┤
│ + update(): void                              │
│ + getResources(): ResourceState               │
│ + getFleet(): Fleet                           │
│ + getTechnologyTree(): TechTree               │
└──────────────────────────────────────────────┘

Module-level functions (exported):
+ calculateProduction(buildings, research): ProductionOutput
+ calculateBuildingCost(type, level): ResourceCost
+ calculateBuildTime(type, level, roboticsLevel): number
+ processResourceTick(userId): ResourceTickResult
+ processConstructionQueue(userId): QueueResult
+ startBuilding(userId, buildingType): BuildResult
+ buildShips(userId, shipType, quantity): BuildResult
+ processCoreGameTick(userId): GameTickResult
```

### CombatEngine

> **Source:** server/combatEngine.ts

```
┌──────────────────────────────────────────────┐
│              Interfaces & Config              │
├──────────────────────────────────────────────┤
│ COMBAT_CONFIG: object                         │
│   UNIT_STATS: Record<UnitType, UnitStats>     │
│   RESEARCH_BONUSES: Record<Tech, number>      │
│   BATTLE_CONFIG: BattleSettings               │
├──────────────────────────────────────────────┤
│ CombatUnit { type, count, actualHP? }         │
│ CombatForce { units, research?, bonusMult? }  │
│ BattleResult { winner, units, casualties,     │
│   rounds, battleLog }                         │
├──────────────────────────────────────────────┤
│ + getUnitStats(type, research, bonus): Stats  │
│ + calculateDamage(atk, def, crit): number     │
│ + simulateCombatRound(atk, def, round): Log   │
│ + simulateBattle(atk, def): BattleResult      │
│ + calculateVictoryResources(def, winner)      │
└──────────────────────────────────────────────┘
```

### Storage

> **Source:** server/storage.ts

```
┌──────────────────────────────────────────────┐
│              IStorage (Interface)              │
├──────────────────────────────────────────────┤
│ Imports 60+ tables from shared/schema.ts      │
│ Imports 80+ type definitions from schema      │
│ Implements CRUD operations for:               │
│   - users, playerStates, missions, messages   │
│   - alliances, marketOrders, auctionListings  │
│   - battles, battleLogs, expeditions          │
│   - megaStructures, achievements, guilds      │
│   - items, playerItems, bankAccounts          │
│   - currencyTransactions, empireValues        │
└──────────────────────────────────────────────┘
```

### Logger

> **Source:** server/logger.ts

```
┌──────────────────────────────────────────────┐
│              Logger (Singleton)                │
├──────────────────────────────────────────────┤
│ - logs: LogEntry[]                            │
│ - maxLogs: 1000                               │
├──────────────────────────────────────────────┤
│ Types:                                        │
│   LogLevel: 'debug' | 'info' | 'warn' | 'err'│
│   LogCategory: 'AUTH' | 'API' | 'DB' |       │
│     'SESSION' | 'SERVER' | 'CACHE' |          │
│     'PERFORMANCE'                             │
├──────────────────────────────────────────────┤
│ + debug(cat, msg, data?): void                │
│ + info(cat, msg, data?): void                 │
│ + warn(cat, msg, data?): void                 │
│ + error(cat, msg, data?, err?): void          │
│ + getLogs(level?, cat?, limit?): LogEntry[]   │
└──────────────────────────────────────────────┘
```

### DebugService

> **Source:** server/services/debugService.ts

```
┌──────────────────────────────────────────────┐
│         DebugService (Singleton)               │
├──────────────────────────────────────────────┤
│ - logs: DebugEntry[]                          │
│ - maxLogs: 10000                              │
│ - logDirectory: './logs/debug'                │
│ - enableFileLogging: boolean                  │
├──────────────────────────────────────────────┤
│ DebugLevel: TRACE | DEBUG | INFO | WARN | ERR │
│ DebugEntry { timestamp, level, source,        │
│   message, data?, duration?, requestId?,      │
│   userId? }                                   │
├──────────────────────────────────────────────┤
│ + static getInstance(): DebugService          │
│ + log(level, source, msg, data?, ...): void   │
│ + getLogs(filters?): DebugEntry[]             │
│ + clearLogs(): void                           │
│ + exportLogs(): string                        │
└──────────────────────────────────────────────┘
```

### IssueService

> **Source:** server/services/issueService.ts

```
┌──────────────────────────────────────────────┐
│          IssueService (Singleton)              │
├──────────────────────────────────────────────┤
│ - issues: Map<string, Issue>                  │
│ - issueIndex: Map<string, string>             │
├──────────────────────────────────────────────┤
│ IssueSeverity: INFO | WARN | ERROR | CRITICAL │
│ IssueStatus: OPEN | INVESTIGATING |           │
│   RESOLVED | IGNORED                          │
│ Issue { id, title, description, severity,     │
│   status, category, source, occurrences,      │
│   tags, resolution? }                         │
│ IssueReport { summary, topIssues, recent }    │
├──────────────────────────────────────────────┤
│ + static getInstance(): IssueService          │
│ + reportIssue(...): Issue                     │
│ + resolveIssue(id, by, notes): Issue | undef  │
│ + getIssueReport(period): IssueReport         │
│ + getOpenIssues(): Issue[]                    │
└──────────────────────────────────────────────┘
```

### WarningService

> **Source:** server/services/warningService.ts

```
┌──────────────────────────────────────────────┐
│         WarningService (Singleton)             │
├──────────────────────────────────────────────┤
│ - warnings: Warning[]                         │
│ - maxWarnings: 5000                           │
├──────────────────────────────────────────────┤
│ WarningLevel: NOTICE | CAUTION |              │
│   ALERT | EMERGENCY                           │
│ Warning { id, level, title, message, source,  │
│   timestamp, acknowledged, autoResolveAt?,    │
│   tags, metrics? }                            │
├──────────────────────────────────────────────┤
│ + static getInstance(): WarningService        │
│ + createWarning(...): Warning                 │
│ + acknowledgeWarning(id, by): Warning | undef │
│ + getActiveWarnings(): Warning[]              │
│ + getWarningsByLevel(level): Warning[]        │
│ + clearResolved(): void                       │
└──────────────────────────────────────────────┘
```

### ServerStatusService

> **Source:** server/services/serverStatusService.ts

```
┌──────────────────────────────────────────────┐
│       ServerStatusService (Singleton)          │
├──────────────────────────────────────────────┤
│ - startTime: number                           │
│ - metricsHistory: SystemMetricsSnapshot[]     │
│ - serviceMetrics: ServiceMetrics              │
├──────────────────────────────────────────────┤
│ ServiceMetrics { requestCount, errorCount,    │
│   successCount, totalResponseTime,            │
│   responseTimes[], requestTimestamps[] }      │
├──────────────────────────────────────────────┤
│ + static getInstance(): ServerStatusService   │
│ + recordRequest(statusCode, responseTime):    │
│   void                                        │
│ + getHealthCheck(): HealthCheckResult         │
│ + getSystemMetrics(): SystemMetricsSnapshot   │
│ + getPerformanceMetrics(): object             │
│ + getUptime(): number                         │
└──────────────────────────────────────────────┘
```

---

## 4. Service Class Diagrams

All services are singletons in `server/services/`.

```
┌─────────────────────────┐  ┌──────────────────────────┐
│   AchievementService     │  │    ArmySystemService      │
│ + static getInstance()   │  │ + static getInstance()    │
│ + getAchievements()      │  │ + getArmyUnits()          │
│ + unlockAchievement()    │  │ + trainUnit()             │
└─────────────────────────┘  │ + disbandUnit()           │
                              └──────────────────────────┘
┌─────────────────────────┐  ┌──────────────────────────┐
│ AutoBuyResourcesService  │  │ CivilizationSystemService │
│ + static getInstance()   │  │ + static getInstance()    │
│ + getAutoBuyConfig()     │  │ + getCivilizationData()   │
│ + processAutoBuy()       │  │ + upgradeSubsystem()      │
└─────────────────────────┘  └──────────────────────────┘
┌─────────────────────────┐  ┌──────────────────────────┐
│   CustomLabService       │  │    GameAssetsService      │
│ + static getInstance()   │  │ + static getInstance()    │
│ + getLabs()              │  │ + getAssets()             │
│ + upgradeLab()           │  │ + getAssetCategories()    │
└─────────────────────────┘  └──────────────────────────┘
┌─────────────────────────────┐  ┌──────────────────────┐
│ GovernmentProgressionService│  │  MegastructureService │
│ + static getInstance()      │  │ + static getInstance()│
│ + getProgressionTree()      │  │ + getMegastructures() │
│ + unlockNode()              │  │ + upgradeStructure()  │
└─────────────────────────────┘  └──────────────────────┘
┌───────────────────────────┐  ┌────────────────────────┐
│MultiplayerBonusesService  │  │  ResearchLabService     │
│ + static getInstance()    │  │ + static getInstance()  │
│ + getBonuses()            │  │ + getLabs()             │
│ + applyBonus()            │  │ + startResearch()       │
└───────────────────────────┘  └────────────────────────┘
┌────────────────────────────────┐  ┌─────────────────────┐
│ResearchRecommendationsService  │  │ ResearchTradingService│
│ + static getInstance()         │  │ + static getInstance()│
│ + getRecommendations()         │  │ + getOffers()        │
│ + analyzePlayerProgress()      │  │ + createOffer()      │
└────────────────────────────────┘  └─────────────────────┘
┌─────────────────────┐  ┌───────────────────────────┐
│  ResearchXPService   │  │    TurnSystemService      │
│ + static getInstance()│  │ + static getInstance()    │
│ + getXPData()        │  │ + processTurns()          │
│ + addXP()            │  │ + generateTurns()         │
└─────────────────────┘  └───────────────────────────┘
┌────────────────────────┐  ┌──────────────────────────┐
│ UniverseResetService   │  │  UniverseSeedService      │
│ + static getInstance() │  │ + static getInstance()    │
│ + resetUniverse()      │  │ + generateSeed()          │
│ + confirmReset()       │  │ + getUniverseConfig()     │
└────────────────────────┘  └──────────────────────────┘
```

> **Source:** server/services/achievementService.ts
> **Source:** server/services/armySystemService.ts
> **Source:** server/services/autoBuyResourcesService.ts
> **Source:** server/services/civilizationSystemService.ts
> **Source:** server/services/customLabService.ts
> **Source:** server/services/gameAssetsService.ts
> **Source:** server/services/governmentProgressionService.ts
> **Source:** server/services/megastructureService.ts
> **Source:** server/services/multiplayerBonusesService.ts
> **Source:** server/services/researchLabService.ts
> **Source:** server/services/researchRecommendationsService.ts
> **Source:** server/services/researchTradingService.ts
> **Source:** server/services/researchXPService.ts
> **Source:** server/services/turnSystemService.ts
> **Source:** server/services/universeResetService.ts
> **Source:** server/services/universeSeedService.ts

---

## 5. Client Class Diagrams

### GameProvider (React Context)

> **Source:** client/src/lib/gameContext.tsx (1984 lines)

```
┌────────────────────────────────────────────────────┐
│               GameProvider (React Context)           │
├────────────────────────────────────────────────────┤
│ State:                                              │
│   Resources { metal, crystal, deuterium, energy,    │
│     credits, food, water, darkmatter }              │
│   Buildings { metalMine, crystalMine,               │
│     deuteriumSynthesizer, solarPlant,               │
│     roboticsFactory, shipyard, researchLab }        │
│   OrbitalBuildings: Record<string, number>          │
│   Units: Record<string, number>                     │
│   Commander: CommanderState                         │
│   Government: GovernmentState                       │
│   Alliance: Alliance | null                         │
│   Artifacts: Artifact[]                             │
│   Research: Record<string, number>                  │
│   EmpireLevel, Tier, PrestigeLevel                  │
├────────────────────────────────────────────────────┤
│ Uses:                                               │
│   - React Query (useQuery, useMutation)             │
│   - apiRequest() with Basic Auth                    │
│   - commanderTypes, governmentData, allianceData    │
│   - gameLogic (simulateCombat, simulateEspionage)   │
│   - megaStructures, resourceMath, stationData       │
│   - blink (real-time updates)                       │
├────────────────────────────────────────────────────┤
│ + updateResources(resources): void                  │
│ + addNotification(message): void                    │
│ + buildBuilding(type): void                         │
│ + buildShip(type, qty): void                        │
│ + researchTech(techId): void                        │
│ + simulateBattle(attacker, defender): Report        │
└────────────────────────────────────────────────────┘
```

### ShipFittingModules

> **Source:** client/src/lib/shipFittingModules.ts (1891 lines)

```
┌────────────────────────────────────────────────┐
│           ShipModule (Interface)                 │
├────────────────────────────────────────────────┤
│ id, name, description, category, class,         │
│ subclass, type, size, meta, tech,               │
│ cpu, powergrid, calibration?, capacitor?,       │
│ stats: Record<string, number|string|boolean>,   │
│ requirements?: { skills?, shipSize? },          │
│ price: { isk, materials? }                      │
├────────────────────────────────────────────────┤
│ 90+ modules across 6 categories:                │
│   weapon, defense, propulsion, electronic,      │
│   engineering, utility                           │
│ 5 slot types: high, mid, low, rig, subsystem    │
│ 5 sizes: small, medium, large, capital, universal│
└────────────────────────────────────────────────┘

SHIP_FITTING_MODULES: { [key: string]: ShipModule }
```

### InterplanetaryPowerGrid

> **Source:** client/src/lib/interplanetaryPowerGrid.ts (201 lines)

```
┌──────────────────────────────────────────────────┐
│           Power Grid System                        │
├──────────────────────────────────────────────────┤
│ Interfaces:                                       │
│   EnergySource { id, name, family, output,        │
│     stability, ramp, worlds, fuel, byproducts }   │
│   TransmissionSystem { id, name, range,           │
│     efficiency, throughput, purpose }              │
│   GridNode { id, name, bodyType, role,            │
│     generation, demand, storage, integrity }      │
│   PowerTechnology { id, era, branch, name,        │
│     effect, researchCost, prerequisites }         │
├──────────────────────────────────────────────────┤
│ Data:                                              │
│   ENERGY_SOURCES: EnergySource[] (6 sources)       │
│   TRANSMISSION_SYSTEMS: TransmissionSystem[] (6)   │
│   GRID_NODES: GridNode[] (6 nodes)                │
│   POWER_TECHNOLOGIES: PowerTechnology[] (16 techs) │
│   DOCTRINES: Record<AiDoctrine, DoctrineConfig>   │
├──────────────────────────────────────────────────┤
│ + calculateGridSummary(nodes, eff): GridSummary    │
└──────────────────────────────────────────────────┘
```

### OrbitalDefenseSystem

> **Source:** client/src/lib/orbitalDefenseSystem.ts (1039 lines)

```
┌────────────────────────────────────────────────────┐
│          Orbital Defense System                      │
├────────────────────────────────────────────────────┤
│ Types:                                               │
│   OrbitalRole: interceptor|gunship|missile|shield|  │
│     command|sensor|carrier|fortress                  │
│   OrbitalDoctrine: sentinel|bastion|hunter|         │
│     interdiction|retaliation                         │
│   ModuleCategory: weapon|shield|armor|reactor|       │
│     sensor|utility|hangar                            │
├────────────────────────────────────────────────────┤
│ Interfaces:                                          │
│   OrbitalPlatformClass { id, name, role, tier,      │
│     base, slots, abilities, cost }                   │
│   OrbitalModule { id, name, category, tier,         │
│     weapon?, defense?, support? }                    │
│   OrbitalPlatformInstance { id, classId, level,     │
│     modules, hull, shield, armor, readiness }       │
│   OrbitalBattleReport { rounds, damage, log }       │
├────────────────────────────────────────────────────┤
│ Data catalogs for platforms, modules, abilities,     │
│ technologies, and threat templates                   │
└────────────────────────────────────────────────────┘
```

---

## 6. Sequence Diagrams

### Authentication Flow

> **Source:** server/basicAuth.ts
> **Source:** server/db/index.ts
> **Source:** shared/schema.ts

```
Client                Server                 Database
  │                     │                       │
  │ POST /api/auth/login│                       │
  │ {username, password}│                       │
  │────────────────────>│                       │
  │                     │  resolveUserById()     │
  │                     │  db.select(users)      │
  │                     │──────────────────────>│
  │                     │<──────────────────────│
  │                     │  verify password       │
  │                     │  getSession()          │
  │                     │  MemoryStore.set()     │
  │  {user, token}      │                       │
  │<────────────────────│                       │
  │                     │                       │
  │ GET /api/game-state │                       │
  │ + Cookie: connect.sid│                      │
  │────────────────────>│                       │
  │                     │  session middleware     │
  │                     │  storage.getPlayerState│
  │                     │──────────────────────>│
  │                     │<──────────────────────│
  │  {playerState}      │                       │
  │<────────────────────│                       │
```

### Game Tick Processing

> **Source:** server/gameEngine.ts

```
GameLoop / API Request
  │
  │ processCoreGameTick(userId)
  │
  ├──> processResourceTick(userId)
  │      ├── getPlayerStateForUser(userId)
  │      │     └── db.query.playerStates.findFirst()
  │      ├── calculateProduction(buildings, research)
  │      │     └── metal = 30 * level * (1 + level/10)
  │      ├── Calculate elapsed time
  │      └── db.update(playerStates) { resources, lastResourceUpdate }
  │
  └──> processConstructionQueue(userId)
         ├── getPlayerStateForUser(userId)
         ├── For each cronJob with type === 'building':
         │     ├── If completeAt <= now:
         │     │     ├── Increment building level
         │     │     └── Add to completed[]
         │     └── Else: keep in remaining[]
         └── If completed.length > 0:
               └── db.update(playerStates) { buildings, cronJobs }
```

### Combat Simulation

> **Source:** server/combatEngine.ts
> **Source:** shared/config/combatConfig.ts

```
Client                    Server                     Database
  │                         │                           │
  │ POST /api/combat/simulate│                           │
  │ {attacker, defender}     │                           │
  │────────────────────────>│                           │
  │                         │ simulateBattle()           │
  │                         │   ├── Deep copy forces     │
  │                         │   └── while round < 100:   │
  │                         │       ├── Check unit counts │
  │                         │       ├── simulateCombatRound()
  │                         │       │   ├── For each atk unit:
  │                         │       │   │   ├── getUnitStats()
  │                         │       │   │   │   └── Apply research bonuses
  │                         │       │   │   ├── Calculate critical hit
  │                         │       │   │   └── calculateDamage()
  │                         │       │   │       └── atk - def*0.5 ± 20%
  │                         │       │   └── For each def unit (counter-attack)
  │                         │       ├── Apply casualties (weakest first)
  │                         │       └── Check defeat conditions
  │                         │   └── Return BattleResult
  │  {BattleResult}         │                           │
  │<────────────────────────│                           │
```

### Research Flow

> **Source:** server/routes-research.ts
> **Source:** shared/config/technologyTreeConfig.ts

```
Client                    Server                     Database
  │                         │                           │
  │ POST /api/research/start│                           │
  │ {technologyId}          │                           │
  │────────────────────────>│                           │
  │                         │ Validate prerequisites    │
  │                         │ Calculate cost from       │
  │                         │   technologyTreeConfig    │
  │                         │   (11 branches, 900+ techs)│
  │                         │ Check player resources    │
  │                         │────────────────────────>│
  │                         │<────────────────────────│
  │                         │ Deduct resources          │
  │                         │ Add to researchQueue      │
  │                         │────────────────────────>│
  │  {researchStarted}      │                           │
  │<────────────────────────│                           │
  │                         │                           │
  │ (Time passes...)        │                           │
  │                         │                           │
  │ POST /api/research/check│                           │
  │────────────────────────>│                           │
  │                         │ Check queue completion    │
  │                         │ Apply tech bonuses        │
  │  {completed, progress}  │                           │
  │<────────────────────────│                           │
```

---

## 7. Entity Relationship Diagrams

> **Source:** shared/schema.ts (2020 lines, 72 tables)

### Domain Groupings

#### Users & Auth (4 tables)

```
┌──────────────┐     ┌──────────────────┐
│   sessions   │     │      users        │
├──────────────┤     ├──────────────────┤
│ sid (PK)     │     │ id (PK)          │
│ sess         │     │ username (UQ)     │
│ expire       │     │ passwordHash      │
└──────────────┘     │ email (UQ)        │
                     │ firstName         │
                     │ lastName          │
                     │ profileImageUrl   │
                     └────────┬─────────┘
                              │
┌──────────────┐     ┌───────┴──────────┐
│ adminUsers   │     │  playerProfiles   │
├──────────────┤     ├──────────────────┤
│ userId (FK)  │     │ userId (FK, UQ)   │
│ role         │     │ uid (UQ)          │
│ permissions  │     │ displayName, bio  │
└──────────────┘     │ level, attributes │
                     │ categories, badges│
                     └──────────────────┘
```

#### Player State (1 table, massive JSONB)

```
┌───────────────────────────────────────────────┐
│               playerStates                     │
├───────────────────────────────────────────────┤
│ userId (FK -> users.id)                        │
│ resources: { metal, crystal, deuterium,        │
│   energy, credits, food, water }               │
│ buildings: { metalMine, crystalMine, ... }     │
│ orbitalBuildings: JSONB                        │
│ research: JSONB                                │
│ researchQueue, researchHistory, activeResearch │
│ researchLab, availableLabs                     │
│ turnsData, researchXP                          │
│ units: JSONB                                   │
│ commander: JSONB                               │
│ government: JSONB                              │
│ artifacts: JSONB                               │
│ cronJobs: JSONB (construction queue)           │
│ empireLevel, tier, prestigeLevel               │
│ kardashevProgress: JSONB                       │
│ totalTurns, currentTurns                       │
└───────────────────────────────────────────────┘
```

#### Military (8 tables)

```
┌─────────┐    ┌─────────┐
│ troops   │───>│ squads   │
├─────────┤    ├─────────┤
│ userId   │    │ userId   │
│ troopType│    │ squadType│
│ stats    │    │ commanderId│
│ substats │    └─────────┘
└─────────┘

┌──────────────┐    ┌──────────────┐
│   battles     │───>│  battleLogs   │
├──────────────┤    ├──────────────┤
│ attackerId    │    │ battleId (FK) │
│ defenderId    │    │ round         │
│ type, status  │    │ damage dealt  │
│ fleet, losses │    │ unitsDestroyed│
│ loot, debris  │    │ log           │
└──────────────┘    └──────────────┘

┌──────────────────┐    ┌─────────────────┐
│ equipmentDurability│   │ fleetDurability   │
├──────────────────┤    ├─────────────────┤
│ equipmentId       │    │ fleetId           │
│ currentDurability │    │ shipType          │
│ degradationRate   │    │ currentDurability │
└──────────────────┘    └─────────────────┘

┌─────────────────────┐
│ buildingDurability   │
├─────────────────────┤
│ buildingId           │
│ buildingLevel        │
│ currentDurability    │
│ structuralIntegrity  │
└─────────────────────┘
```

#### Economy (11 tables)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ marketOrders  │    │auctionListings│   │ auctionBids   │
│ type          │    │ sellerId      │   │ auctionId(FK) │
│ resource      │    │ itemType      │   │ bidderId(FK)  │
│ amount, price │    │ startingPrice │   │ bidAmount     │
│ status        │    │ buyoutPrice   │   └──────────────┘
└──────────────┘    │ expiresAt     │
                    └──────────────┘

┌──────────────┐    ┌──────────────┐
│ tradeOffers   │    │ tradeHistory  │
│ senderId      │    │ tradeOfferId  │
│ receiverId    │    │ senderGave    │
│ offer/request │    │ receiverGave  │
│ status        │    │ result        │
└──────────────┘    └──────────────┘

┌────────────────┐    ┌──────────────────┐
│ playerCurrency  │    │currencyTransactions│
│ silver, gold,   │    │ currencyType      │
│ platinum        │    │ amount, reason    │
└────────────────┘    │ balance before/after│
                      └──────────────────┘

┌──────────────┐    ┌──────────────┐
│ bankAccounts  │    │bankTransactions │
│ accountType   │    │ transactionType │
│ balance       │    │ amount          │
│ interestRate  │    │ balance before/ │
└──────────────┘    │ after           │
                    └──────────────┘

┌──────────────┐
│ empireValues  │
│ resourceValue │
│ buildingValue │
│ fleetValue    │
│ totalValue    │
└──────────────┘
```

#### Social (8 tables)

```
┌──────────────┐    ┌──────────────────┐
│  alliances    │───>│ allianceMembers   │
│ name, tag     │    │ allianceId (FK)   │
│ resources     │    │ userId (FK)       │
└──────────────┘    │ rank, points      │
                    └──────────────────┘

┌──────────┐    ┌────────────────┐
│  guilds   │───>│ guildMembers    │
│ leaderId  │    │ guildId (FK)    │
│ level     │    │ playerId (FK)   │
│ treasury  │    │ role            │
└──────────┘    └────────────────┘

┌─────────┐    ┌────────────────┐
│  teams   │    │ friendRequests  │
│ guildId  │    │ senderId (FK)  │
│ members  │    │ receiverId(FK) │
│ max: 6   │    │ status         │
└─────────┘    └────────────────┘

┌──────────┐
│  friends  │
│ playerId  │
│ friendId  │
│ status    │
└──────────┘
```

#### Research (4 tables)

```
┌───────────────┐
│ researchAreas  │
│ areaName       │
└───────┬───────┘
        │
┌───────┴──────────────┐
│ researchSubcategories │
│ areaId (FK)           │
│ subcategoryName       │
└───────┬──────────────┘
        │
┌───────┴──────────────┐     ┌──────────────────────┐
│ researchTechnologies  │<────│ playerResearchProgress │
│ subcategoryId (FK)    │     │ technologyId (FK)      │
│ techName, requirements│     │ userId (FK)            │
│ effects               │     │ status, progress       │
└──────────────────────┘     └──────────────────────┘
```

#### Universe (7 tables)

```
┌──────────────┐    ┌──────────────┐
│continents     │───>│  countries    │
│ continentName │    │ continentId   │
└──────────────┘    │ countryType   │
                    └───────┬──────┘
                            │
                    ┌───────┴──────┐
                    │ territories   │
                    │ countryId(FK) │
                    │ territoryType │
                    └───────┬──────┘
                            │
                    ┌───────┴──────┐
                    │resourceFields │
                    │ territoryId   │
                    │ fieldType     │
                    │ depletionPct  │
                    └──────────────┘

┌──────────────────┐    ┌──────────────┐
│ universeEvents    │    │universeBosses │
│ eventType (50)    │    │ bossType (90) │
│ eventClass        │    │ rarity        │
│ participantLimit  │    │ health, attack│
└──────────────────┘    └──────┬───────┘
                               │
┌──────────────────┐    ┌──────┴───────┐
│  raidGroups       │    │bossEncounters │
│ members (6-50)    │    │ bossId (FK)   │
│ targetBossId(FK)  │    │ participants  │
└──────────────────┘    │ rewards       │
                        └──────────────┘
```

#### Story & Campaigns (2 tables)

```
┌──────────────────┐    ┌──────────────┐
│ storyCampaigns    │───>│ storyMissions │
│ currentAct        │    │ campaignId    │
│ storyProgress     │    │ act, chapter  │
│ npcsEncountered   │    │ objectives    │
│ completedMissions │    │ rewards       │
└──────────────────┘    └──────────────┘
```

#### Items & Inventory (2 tables)

```
┌──────────┐    ┌──────────────┐
│  items    │───>│ playerItems   │
│ itemType  │    │ playerId (FK) │
│ itemClass │    │ itemId (FK)   │
│ rank      │    │ isEquipped    │
│ stats     │    │ durability    │
│ bonuses   │    │ enchantments  │
└──────────┘    └──────────────┘
```

#### Misc (13 tables)

```
queueItems, playerColonies, starbases, moonBases,
megaStructures, empireDifficulties, systemSettings,
achievements, elementBuffs, npcFactions, npcVendors,
relics, relicInventory, expeditions, expeditionTeams,
expeditionEncounters, raids, raidCombats, combatStats,
pveCombatLogs, ogameCatalogCategories, ogameCatalogEntries,
repairHistory, durabilityDegradationLog
```

---

## 8. Data Flow Diagrams

### Request Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client   │───>│   Vite   │───>│ Express  │───>│  Route   │
│  Browser  │    │  Dev/Prod│    │  Server  │    │ Handler  │
└──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐         │
│ Response  │<──│    DB    │<──│ Storage  │<────────┤
│   JSON    │    │PostgreSQL│    │  (CRUD)  │    Service Layer
└──────────┘    └──────────┘    └──────────┘

Detailed:
1. Client makes fetch() with Basic Auth header
2. Vite dev proxy routes /api/* to Express
3. Express middleware: session, auth check
4. Route handler delegates to service
5. Service queries Storage layer
6. Storage executes Drizzle ORM queries
7. Response flows back as JSON
```

### Real-Time Updates

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ GameLoop  │───>│ dispatch │───>│ refetch  │
│ Component │    │  event   │    │ queries  │
└──────────┘    └──────────┘    └──────────┘
                                      │
                    ┌─────────────────┘
                    ▼
              ┌──────────┐    ┌──────────┐
              │ React    │───>│  Server  │
              │ Query    │    │  Cache   │
              │ Cache    │    └──────────┘
              └──────────┘
                    │
              ┌─────┴─────┐
              │ queryClient│
              │ staleTime  │
              │ refetchInt │
              └───────────┘
```

---

## 9. State Management

### Client-Side State

> **Source:** client/src/lib/gameContext.tsx (1984 lines)

```
┌────────────────────────────────────────────────────┐
│                 GameProvider                         │
│  (React Context - Primary state container)          │
├────────────────────────────────────────────────────┤
│  State:                                             │
│    Resources (8 resource types)                     │
│    Buildings (7 building types)                     │
│    OrbitalBuildings (Record<string, number>)        │
│    Units (Record<string, number>)                   │
│    Commander (CommanderState)                       │
│    Government (GovernmentState)                     │
│    Alliance (Alliance | null)                       │
│    Artifacts (Artifact[])                           │
│    Research (Record<string, number>)                │
│    EmpireLevel, Tier, PrestigeLevel                 │
│    CronJobs (CronJob[])                             │
├────────────────────────────────────────────────────┤
│  Methods:                                           │
│    apiRequest() - HTTP with Basic Auth              │
│    updateResources() - Set resource state           │
│    normalizeResources() - Clamp to valid range      │
│    parseFiniteNumber() - Safe number parsing        │
└────────────────────────────────────────────────────┘
```

### React Query Cache

> **Source:** client/src/lib/queryClient.ts

```
┌────────────────────────────────────────────┐
│           QueryClient                       │
├────────────────────────────────────────────┤
│ defaultOptions:                             │
│   staleTime: Infinity (manual invalidation) │
│   refetchOnWindowFocus: false               │
│   refetchInterval: false                    │
├────────────────────────────────────────────┤
│ getQueryFn: QueryFunction<T>                │
│   - Joins queryKey as URL path              │
│   - Returns null on 401 if configured       │
│   - Throws on other errors                  │
├────────────────────────────────────────────┤
│ apiRequest: (method, url, data?) => Promise │
│   - Adds Content-Type header                │
│   - Throws if !res.ok                       │
└────────────────────────────────────────────┘
```

### Session State

> **Source:** server/basicAuth.ts

```
┌────────────────────────────────────────────┐
│           Session Management                 │
├────────────────────────────────────────────┤
│ Store: MemoryStore (in-memory)              │
│ Cookie: connect.sid                         │
│ TTL: 7 days                                 │
│ Settings:                                   │
│   httpOnly: true                            │
│   secure: false (dev)                       │
│   sameSite: 'lax'                           │
├────────────────────────────────────────────┤
│ Auth Methods:                               │
│   - Basic Auth (username:password)          │
│   - Dev Bypass (DEV_AUTH_BYPASS env)        │
│   - Replit OAuth (optional)                 │
├────────────────────────────────────────────┤
│ Protected Accounts:                         │
│   player1, player2, player3 (non-admin)     │
│ Dev Bypass:                                 │
│   Creates devadmin user with admin role     │
└────────────────────────────────────────────┘
```

---

*Document auto-generated from source code analysis.*
*Last updated: 2026-06-18*
