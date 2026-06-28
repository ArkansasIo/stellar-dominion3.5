# System Architecture

Universe Empire Dominion 3 is a turn-based 4X MMO strategy game built with a monorepo architecture using React, Express, PostgreSQL (via Drizzle ORM), and shared TypeScript types.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT LAYER                        │
│  React + Vite + TanStack Query + wouter             │
│  client/src/App.tsx → Routing                       │
│  client/src/main.tsx → Entry point                  │
│  client/src/lib/gameContext.tsx → Global state       │
│  client/src/lib/api-client.ts → HTTP client          │
├─────────────────────────────────────────────────────┤
│                  SHARED LAYER                        │
│  shared/schema.ts → 72+ DB tables (Drizzle ORM)     │
│  shared/api-types.ts → API type definitions          │
│  shared/config/ → 93+ config files (game data)       │
├─────────────────────────────────────────────────────┤
│                  SERVER LAYER                        │
│  server/index.ts → Express entry + HTTP server       │
│  server/routes.ts → Route registration hub           │
│  server/routes-*.ts → 65+ route modules              │
│  server/services/ → 29 business logic services       │
│  server/gameEngine.ts → Turn processing engine       │
│  server/combatEngine.ts → Combat resolution          │
│  server/storage.ts → Database access layer           │
├─────────────────────────────────────────────────────┤
│                  DATABASE LAYER                      │
│  server/db/index.ts → PostgreSQL connection pool     │
│  server/db/init.ts → Schema initialization           │
│  shared/sql/ → SQL seed data                        │
└─────────────────────────────────────────────────────┘
```

---

## Client Layer

### Entry & Routing

| File | Purpose |
|------|---------|
| `client/src/main.tsx` | React entry point, renders `<App />` |
| `client/src/App.tsx` | Root component, defines all routes via `wouter` |
| `client/src/lib/queryClient.ts` | TanStack Query client configuration |

> **Source:** `client/src/main.tsx`
> **Source:** `client/src/App.tsx`
> **Source:** `client/src/lib/queryClient.ts`

### State Management

| File | Purpose |
|------|---------|
| `client/src/lib/gameContext.tsx` | React Context for global game state |
| `client/src/lib/api-client.ts` | Centralized HTTP API client |

> **Source:** `client/src/lib/gameContext.tsx`
> **Source:** `client/src/lib/api-client.ts`

### Key Client Libraries

| File | Purpose |
|------|---------|
| `client/src/lib/resourceMath.ts` | Resource calculation utilities |
| `client/src/lib/combatEngine.ts` | Client-side combat simulation |
| `client/src/lib/unitData.ts` | Fleet unit definitions |
| `client/src/lib/researchTechnologyTreeCatalog.ts` | Research tree catalog |
| `client/src/lib/allianceSystems.ts` | Alliance management logic |
| `client/src/lib/governmentSystems.ts` | Government system logic |
| `client/src/lib/colonySystems.ts` | Colony/civilization logic |
| `client/src/lib/commanderTypes.ts` | Commander type definitions |
| `client/src/lib/megaStructures.ts` | Megastructure logic |
| `client/src/lib/blueprintSystem.ts` | Blueprint crafting logic |
| `client/src/lib/achievementsSystem.ts` | Achievement tracking |
| `client/src/lib/universeSeed.ts` | Universe generation client logic |

> **Source:** `client/src/lib/resourceMath.ts`
> **Source:** `client/src/lib/combatEngine.ts`
> **Source:** `client/src/lib/unitData.ts`
> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts`
> **Source:** `client/src/lib/allianceSystems.ts`
> **Source:** `client/src/lib/governmentSystems.ts`
> **Source:** `client/src/lib/colonySystems.ts`
> **Source:** `client/src/lib/commanderTypes.ts`
> **Source:** `client/src/lib/megaStructures.ts`
> **Source:** `client/src/lib/blueprintSystem.ts`
> **Source:** `client/src/lib/achievementsSystem.ts`
> **Source:** `client/src/lib/universeSeed.ts`

### Authentication

| File | Purpose |
|------|---------|
| `client/src/hooks/useAuth.ts` | Auth hook for login state |
| `client/src/lib/authUtils.ts` | Auth utility functions |

> **Source:** `client/src/hooks/useAuth.ts`
> **Source:** `client/src/lib/authUtils.ts`

---

## Shared Layer

### Database Schema

| File | Purpose |
|------|---------|
| `shared/schema.ts` | Drizzle ORM schema — 72+ tables (players, planets, fleets, technologies, alliances, guilds, achievements, etc.) |
| `shared/api-types.ts` | TypeScript types for API request/response payloads |
| `shared/types.ts` | Additional shared type definitions |

> **Source:** `shared/schema.ts`
> **Source:** `shared/api-types.ts`
> **Source:** `shared/types.ts`

### Configuration (shared/config/)

93+ configuration files defining all game data, constants, and tuning parameters:

| Config File | Purpose |
|-------------|---------|
| `shared/config/gameConfig.ts` | Core game settings |
| `shared/config/turnSystemConfig.ts` | Turn timing & progression rules |
| `shared/config/combatConfig.ts` | Combat formulas & parameters |
| `shared/config/technologyTreeConfig.ts` | Tech tree structure & unlock conditions |
| `shared/config/resourceConfig.ts` | Resource types & base values |
| `shared/config/universeGenerationConfig.ts` | Universe/planet generation parameters |
| `shared/config/governmentProgressionTreeConfig.ts` | Government advancement paths |
| `shared/config/civilizationJobsConfig.ts` | Colony job definitions |
| `shared/config/commanderSkillTreeSystem.ts` | Commander skill tree |
| `shared/config/commanderTalentTree.ts` | Commander talent tree |
| `shared/config/megastructuresConfig.ts` | Megastructure definitions |
| `shared/config/orbitalStationsConfig.ts` | Orbital station types |
| `shared/config/lifeSupportSystemsConfig.ts` | Life support requirements |
| `shared/config/eveBlueprintSystem.ts` | Blueprint/crafting system |
| `shared/config/smithySystem.ts` | Smithy crafting system |
| `shared/config/highCommandSystem.ts` | High command system |
| `shared/config/durabilityConfig.ts` | Equipment/building durability |
| `shared/config/sporeDriveSystem.ts` | Spore drive mechanics |
| `shared/config/achievementsConfig.ts` | Achievement definitions |
| `shared/config/liveOpsContentConfig.ts` | Live ops events & content |
| `shared/config/facilitiesConfig.ts` | Facility building definitions |
| `shared/config/protectionSystemConfig.ts` | New player protection |
| `shared/config/rankSystemConfig.ts` | Player ranking |
| `shared/config/multiplayerBonusesConfig.ts` | Alliance/multiplayer bonuses |
| `shared/config/enhancedMoonSystem.ts` | Moon system mechanics |
| `shared/config/interstellarTravelConfig.ts` | Interstellar travel rules |
| `shared/config/staryardConfig.ts` | Shipyard/starship building |
| `shared/config/shipClassificationSystem.ts` | Ship class definitions |
| `shared/config/starRaritySystem.ts` | Star rarity system |
| `shared/config/currencyConfig.ts` | Premium currency settings |
| `shared/config/itemsConfig.ts` | Item definitions |
| `shared/config/enemyRacesConfig.ts` | Enemy race configurations |
| `shared/config/empireCombatUniverseSystemsConfig.ts` | Empire combat universe |

> **Source:** `shared/config/gameConfig.ts`
> **Source:** `shared/config/turnSystemConfig.ts`
> **Source:** `shared/config/combatConfig.ts`
> **Source:** `shared/config/technologyTreeConfig.ts`
> **Source:** `shared/config/resourceConfig.ts`
> **Source:** `shared/config/universeGenerationConfig.ts`
> **Source:** `shared/config/governmentProgressionTreeConfig.ts`
> **Source:** `shared/config/civilizationJobsConfig.ts`
> **Source:** `shared/config/commanderSkillTreeSystem.ts`
> **Source:** `shared/config/megastructuresConfig.ts`
> **Source:** `shared/config/orbitalStationsConfig.ts`
> **Source:** `shared/config/lifeSupportSystemsConfig.ts`
> **Source:** `shared/config/eveBlueprintSystem.ts`
> **Source:** `shared/config/smithySystem.ts`
> **Source:** `shared/config/highCommandSystem.ts`
> **Source:** `shared/config/durabilityConfig.ts`
> **Source:** `shared/config/sporeDriveSystem.ts`
> **Source:** `shared/config/achievementsConfig.ts`
> **Source:** `shared/config/liveOpsContentConfig.ts`
> **Source:** `shared/config/facilitiesConfig.ts`

### SQL & Seed Data

| File | Purpose |
|------|---------|
| `shared/sql/settings/index.ts` | SQL seed data for settings tables |

> **Source:** `shared/sql/settings/index.ts`

### Expedition Data

| File | Purpose |
|------|---------|
| `shared/expeditionData.ts` | Expedition event definitions |

> **Source:** `shared/expeditionData.ts`

---

## Server Layer

### Entry & Routing

| File | Purpose |
|------|---------|
| `server/index.ts` | Express server entry — creates HTTP server, registers middleware, starts listening |
| `server/routes.ts` | Central route registration — imports and mounts all route modules |
| `server/static.ts` | Static file serving for production builds |
| `server/vite.ts` | Vite dev server integration |

> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `server/static.ts`
> **Source:** `server/vite.ts`

### Route Modules (65+)

| Route File | Domain |
|------------|--------|
| `server/routes-gameactions.ts` | Game actions (build, upgrade, deploy) |
| `server/routes-game.ts` | Core game state |
| `server/routes-turnsystem.ts` | Turn system advancement |
| `server/routes-combat.ts` | Combat resolution |
| `server/routes-research.ts` | Technology research |
| `server/routes-researchlab.ts` | Research lab management |
| `server/routes-researchxp.ts` | Research XP system |
| `server/routes-alliances.ts` | Alliance management |
| `server/routes-guilds.ts` | Guild system |
| `server/routes-trading.ts` | Trading system |
| `server/routes-resource-trading.ts` | Resource trading |
| `server/routes-trades.ts` | Trade routes |
| `server/routes-government-progression.ts` | Government progression |
| `server/routes-government-leaders.ts` | Government leaders |
| `server/routes-government-buildings.ts` | Government buildings |
| `server/routes-civilization-system.ts` | Civilization system |
| `server/routes-civilization.ts` | Civilization management |
| `server/routes-commanders.ts` | Commander system |
| `server/routes-megastructures.ts` | Megastructure construction |
| `server/routes-orbital-stations.ts` | Orbital stations |
| `server/routes-lifesupport.ts` | Life support systems |
| `server/routes-espionage.ts` | Espionage operations |
| `server/routes-expeditions.ts` | Expedition events |
| `server/routes-achievements.ts` | Achievement tracking |
| `server/routes-leaderboard.ts` | Leaderboard rankings |
| `server/routes-liveops.ts` | Live ops events |
| `server/routes-universe-seed.ts` | Universe generation |
| `server/routes-smithy.ts` | Smithy crafting |
| `server/routes-high-command.ts` | High command system |
| `server/routes-spore-drive.ts` | Spore drive system |
| `server/routes-army-system.ts` | Army management |
| `server/routes-army-building-structures.ts` | Army building structures |
| `server/routes-artifacts.ts` | Artifact system |
| `server/routes-autobuyresources.ts` | Auto-buy resources |
| `server/routes-constructor-yard.ts` | Constructor yard |
| `server/routes-customlabs.ts` | Custom research labs |
| `server/routes-database-admin.ts` | Database administration |
| `server/routes-diagnostics.ts` | System diagnostics |
| `server/routes-empire-combat-universe.ts` | Empire combat |
| `server/routes-friends.ts` | Friends list |
| `server/routes-forums.ts` | Forums |
| `server/routes-galaxy.ts` | Galaxy view |
| `server/routes-game-asset-library.ts` | Game asset library |
| `server/routes-messages.ts` | In-game messaging |
| `server/routes-moons.ts` | Moon system |
| `server/routes-multiplayerbonuses.ts` | Multiplayer bonuses |
| `server/routes-ogame.ts` | OGame-style features |
| `server/routes-planets.ts` | Planet management |
| `server/routes-recommendations.ts` | AI recommendations |
| `server/routes-settings.ts` | Player settings |
| `server/routes-status.ts` | Server status |
| `server/routes-travel.ts` | Fleet travel |
| `server/routes-unitsystems.ts` | Unit systems |
| `server/routes-unit-taxonomy.ts` | Unit taxonomy |
| `server/routes-worldactions.ts` | World actions |
| `server/routes-account.ts` | Account management |
| `server/routes-admin.ts` | Admin operations |
| `server/routes-api-core.ts` | Core API endpoints |
| `server/routes-assets.ts` | Asset management |
| `server/routes-bank-vault.ts` | Bank vault |
| `server/routes-missing.ts` | Missing feature placeholders |
| `server/routes-realms.ts` | Realm system |
| `server/routes-ogame.ts` | OGame integration |
| `server/routes-phpmyadmin.ts` | phpMyAdmin proxy |

> **Source:** `server/routes-gameactions.ts`
> **Source:** `server/routes-turnsystem.ts`
> **Source:** `server/routes-combat.ts`
> **Source:** `server/routes-research.ts`
> **Source:** `server/routes-alliances.ts`
> **Source:** `server/routes-guilds.ts`
> **Source:** `server/routes-trading.ts`
> **Source:** `server/routes-government-progression.ts`
> **Source:** `server/routes-civilization-system.ts`
> **Source:** `server/routes-commanders.ts`
> **Source:** `server/routes-megastructures.ts`
> **Source:** `server/routes-orbital-stations.ts`
> **Source:** `server/routes-lifesupport.ts`
> **Source:** `server/routes-espionage.ts`
> **Source:** `server/routes-expeditions.ts`
> **Source:** `server/routes-achievements.ts`
> **Source:** `server/routes-leaderboard.ts`
> **Source:** `server/routes-liveops.ts`
> **Source:** `server/routes-smithy.ts`
> **Source:** `server/routes-high-command.ts`
> **Source:** `server/routes-spore-drive.ts`

### Game Engines

| File | Purpose |
|------|---------|
| `server/gameEngine.ts` | Turn processing engine — resource production, fleet movement, research progress, turn advancement |
| `server/combatEngine.ts` | Combat resolution engine — battle calculations, damage, outcomes |

> **Source:** `server/gameEngine.ts`
> **Source:** `server/combatEngine.ts`

### Services (29)

| Service File | Purpose |
|-------------|---------|
| `server/services/resourceService.ts` | Resource production & calculation |
| `server/services/fleetService.ts` | Fleet management & movement |
| `server/services/technologyService.ts` | Technology research processing |
| `server/services/turnSystemService.ts` | Turn system management |
| `server/services/universeSeedService.ts` | Universe generation |
| `server/services/universeResetService.ts` | Universe reset operations |
| `server/services/governmentProgressionService.ts` | Government advancement |
| `server/services/civilizationSystemService.ts` | Civilization system logic |
| `server/services/megastructureService.ts` | Megastructure construction |
| `server/services/achievementService.ts` | Achievement processing |
| `server/services/missingFeatureService.ts` | Placeholder for unimplemented features |
| `server/services/raidOperationsService.ts` | Raid/pirate operations |
| `server/services/researchLabService.ts` | Research lab management |
| `server/services/researchRecommendationsService.ts` | AI research recommendations |
| `server/services/researchTradingService.ts` | Research trading |
| `server/services/researchXPService.ts` | Research XP calculation |
| `server/services/multiplayerBonusesService.ts` | Alliance/multiplayer bonuses |
| `server/services/autoBuyResourcesService.ts` | Auto-buy resource purchases |
| `server/services/serverStatusService.ts` | Server status monitoring |
| `server/services/issueService.ts` | Issue/bug tracking |
| `server/services/debugService.ts` | Debug utilities |
| `server/services/warningService.ts` | System warning notifications |
| `server/services/gameAssetsService.ts` | Game asset management |
| `server/services/customLabService.ts` | Custom research lab logic |
| `server/services/constructorYardService.ts` | Constructor yard operations |
| `server/services/ogameMissionService.ts` | OGame-style missions |
| `server/services/ogameCatalogService.ts` | OGame catalog data |
| `server/services/armySystemService.ts` | Army system management |
| `server/services/armyBuildingStructuresService.ts` | Army building structures |

> **Source:** `server/services/resourceService.ts`
> **Source:** `server/services/fleetService.ts`
> **Source:** `server/services/technologyService.ts`
> **Source:** `server/services/turnSystemService.ts`
> **Source:** `server/services/universeSeedService.ts`
> **Source:** `server/services/governmentProgressionService.ts`
> **Source:** `server/services/civilizationSystemService.ts`
> **Source:** `server/services/megastructureService.ts`
> **Source:** `server/services/achievementService.ts`
> **Source:** `server/services/missingFeatureService.ts`
> **Source:** `server/services/raidOperationsService.ts`
> **Source:** `server/services/researchLabService.ts`
> **Source:** `server/services/multiplayerBonusesService.ts`
> **Source:** `server/services/armySystemService.ts`

### Storage Layer

| File | Purpose |
|------|---------|
| `server/storage.ts` | Database access functions — wraps Drizzle ORM queries for all game data |
| `server/database/settings/querySettings.ts` | Settings database queries |

> **Source:** `server/storage.ts`
> **Source:** `server/database/settings/querySettings.ts`

---

## Database Layer

| File | Purpose |
|------|---------|
| `server/db/index.ts` | PostgreSQL connection pool via `pg` + Drizzle ORM |
| `server/db/init.ts` | Schema initialization & migrations |
| `server/db/system-settings-seed.ts` | System settings seed data |
| `shared/schema.ts` | Drizzle ORM table definitions (72+ tables) |
| `shared/sql/settings/index.ts` | SQL seed data |

> **Source:** `server/db/index.ts`
> **Source:** `server/db/init.ts`
> **Source:** `server/db/system-settings-seed.ts`
> **Source:** `shared/schema.ts`
> **Source:** `shared/sql/settings/index.ts`

---

## Middleware

| File | Purpose |
|------|---------|
| `server/basicAuth.ts` | Basic HTTP authentication |
| `server/middleware/adminIpCheck.ts` | Admin IP whitelist check |

> **Source:** `server/basicAuth.ts`
> **Source:** `server/middleware/adminIpCheck.ts`

---

## Data Flow Diagram

### Request Lifecycle

```
Client (browser)
    │
    ▼
Vite Dev Server / Static Files
    │
    ▼
Express (server/index.ts)
    │
    ▼
Middleware (basicAuth, adminIpCheck)
    │
    ▼
Route Handler (server/routes-*.ts)
    │
    ├──▶ Service Layer (server/services/*.ts)
    │         │
    │         ▼
    │    Game Engine (server/gameEngine.ts / combatEngine.ts)
    │         │
    │         ▼
    │    Storage Layer (server/storage.ts)
    │         │
    │         ▼
    │    Database (server/db/index.ts → PostgreSQL)
    │
    ▼
JSON Response → Client (TanStack Query cache update)
```

### Turn Processing Flow

```
Turn System (turnSystemService.ts)
    │
    ├──▶ gameEngine.processTurn()
    │     ├──▶ Resource production (resourceService)
    │     ├──▶ Fleet movement (fleetService)
    │     ├──▶ Research progress (technologyService)
    │     ├──▶ Construction progress
    │     ├──▶ Alliance bonus calculation
    │     └──▶ Achievement checks
    │
    ▼
Database updated via storage.ts
    │
    ▼
Client polls / receives turn advancement
```

### Combat Flow

```
Combat Request (routes-combat.ts)
    │
    ▼
combatEngine.ts
    ├──▶ Attacker fleet stats
    ├──▶ Defender fleet stats
    ├──▶ Combat modifiers (commanders, tech, alliances)
    ├──▶ Battle resolution
    ├──▶ Loss calculation
    └──▶ Loot/resource distribution
    │
    ▼
Result stored in database + returned to client
```

### Auth Flow

```
Login Request
    │
    ▼
server/index.ts → Session middleware
    │
    ▼
server/routes-account.ts (auth routes)
    │
    ▼
server/replitAuth.ts (Replit OAuth) or basicAuth.ts
    │
    ▼
Session cookie set → Subsequent requests authenticated
    │
    ▼
client/src/hooks/useAuth.ts → Client auth state
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TanStack Query, wouter |
| UI | Tailwind CSS, shadcn/ui components |
| Backend | Node.js, Express |
| Database | PostgreSQL (via `pg` driver) |
| ORM | Drizzle ORM |
| Shared Types | TypeScript (monorepo via path aliases) |
| Build | Vite (client), esbuild (server) |
