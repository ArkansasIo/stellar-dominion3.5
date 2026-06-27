# Missing Features from Stellar Dominion 3.5

## Overview

This document lists all features, files, routes, services, configs, and systems that exist in the **stellar-dominion3.5** repository (https://github.com/ArkansasIo/stellar-dominion3.5.git) but are **NOT present** in the current workspace (`universe-empire-dominion3`).

---

## 1. Missing Route Files (36 files)

The following route files exist in stellar-dominion3.5 but not in the current workspace:

| # | File | Feature |
|---|------|---------|
| 1 | `routes-admin-console.ts` | Admin Console UI routes |
| 2 | `routes-blueprint-charges.ts` | Blueprint charge system |
| 3 | `routes-connect-provider.ts` | Third-party provider connections (wallet, Discord, Twitter, Web3) |
| 4 | `routes-cron.ts` | Cron job management API |
| 5 | `routes-dimensional-abyssal.ts` | Abyssal gates system |
| 6 | `routes-dimensional-anomalies.ts` | Dimensional anomaly exploration |
| 7 | `routes-empire-profile.ts` | Empire profile management |
| 8 | `routes-gate-tokens.ts` | Gate token management (for raids/anomalies/exploration) |
| 9 | `routes-news.ts` | In-game news feed |
| 10 | `routes-ogame-acs.ts` | OGame Allied Combat System |
| 11 | `routes-ogame-alliance-depot.ts` | OGame alliance depot |
| 12 | `routes-ogame-combat.ts` | OGame combat system |
| 13 | `routes-ogame-debris.ts` | Debris field collection |
| 14 | `routes-ogame-expedition.ts` | OGame dark matter expeditions |
| 15 | `routes-ogame-fleet.ts` | OGame fleet missions |
| 16 | `routes-ogame-graviton.ts` | Graviton research |
| 17 | `routes-ogame-jumpgate.ts` | Jump gate network |
| 18 | `routes-ogame-missile.ts` | IPM/ABM missile system |
| 19 | `routes-ogame-moon-destruction.ts` | Moon destruction with deathstar |
| 20 | `routes-ogame-moon-facilities.ts` | Moon base facilities |
| 21 | `routes-ogame-occupation.ts` | Planetary occupation |
| 22 | `routes-ogame-officers.ts` | Purchasable officers |
| 23 | `routes-ogame-outlaw.ts` | Outlaw/bandit marking system |
| 24 | `routes-ogame-phalanx.ts` | Sensor phalanx system |
| 25 | `routes-ogame-push-protection.ts` | Anti-pushing mechanics |
| 26 | `routes-ogame-research-network.ts` | Inter-lab research sharing |
| 27 | `routes-ogame-terraformer.ts` | Planet terraforming |
| 28 | `routes-ogame-vacation.ts` | Vacation mode |
| 29 | `routes-planet-vault.ts` | Planet vault storage |
| 30 | `routes-player-xp.ts` | Player XP system |
| 31 | `routes-resource-refineries.ts` | Resource refinery buildings |
| 32 | `routes-season.ts` | Season pass / battle pass |
| 33 | `routes-starbase.ts` | Starbase management |
| 34 | `routes-universe-scan.ts` | Universe scanning system |
| 35 | `routes-weekly-missions.ts` | Weekly mission objectives |
| 36 | `routes-missing-api.ts` | Missing API endpoint fallbacks |

---

## 2. Missing Route Registrations in server/index.ts

The current workspace does NOT register these route handlers (lines missing from index.ts):

- `registerStarbaseRoutes(app)` - Starbase routes
- `registerEmpireProfileRoutes(app)` - Empire profiles
- `registerDimensionalAnomalyRoutes(app)` - Dimensional anomalies
- `registerDimensionalAbyssalRoutes(app)` - Abyssal gates
- `registerResourceRefineryRoutes(app)` - Resource refineries
- `registerCronRoutes(app)` - Cron job management
- `registerBlueprintChargeRoutes(app)` - Blueprint charges
- `registerMissingApiRoutes(app)` - Missing API fallbacks
- `registerWeeklyMissionRoutes(app)` - Weekly missions
- `registerGateTokenRoutes(app)` - Gate tokens
- `registerNewsRoutes(app)` - News feed
- `registerAdminConsoleRoutes(app)` - Admin console
- All `registerOGame*Routes(app)` (18 OGame-specific routes)
- `connectProviderRouter` - Provider connections
- `universeScanRouter` - Universe scanning
- `planetVaultRouter` - Planet vault
- `seasonRoutes` (`/api/season`) - Season/battle pass
- `playerXpRoutes` - Player XP

---

## 3. Missing Server Systems (11 systems)

The entire `server/systems/` directory is missing from the current workspace:

| # | System | Description |
|---|--------|-------------|
| 1 | `apocalypseSystem.ts` | Apocalypse/universe-ending events |
| 2 | `bountySystem.ts` | Player bounty system |
| 3 | `colonizationSystem.ts` | Planet colonization mechanics |
| 4 | `defenseSystem.ts` | Planetary defense systems |
| 5 | `igbSystem.ts` | Intergalactic Banking system |
| 6 | `portTradingSystem.ts` | Port trading system |
| 7 | `rankingSystem.ts` | Player ranking calculations |
| 8 | `resourceProductionSystem.ts` | Resource production calculation engine |
| 9 | `scanningSystem.ts` | Galaxy scanning system |
| 10 | `upgradeSystem.ts` | Building/technology upgrade system |
| 11 | `index.ts` | Systems index/exports |

---

## 4. Missing Server Services (40 services)

The current workspace has 29 services; stellar-dominion3.5 has ~70. Missing services:

### Economy & Currency
- `currencyService.ts` - Currency operations (silver/gold/platinum)
- `tradingService.ts` - Trading operations
- `bankService.ts` - Banking operations

### Combat & Military
- `battleReportService.ts` - Battle report generation
- `fleetMissionService.ts` - Fleet mission processing
- `debrisService.ts` - Debris field cleanup
- `missileService.ts` - Missile operations
- `occupationService.ts` - Planet occupation
- `outlawService.ts` - Outlaw/bandit system
- `durabilityService.ts` - Equipment/fleet/building durability
- `acsService.ts` - Allied Combat System
- `espionageService.ts` - Espionage operations
- `missionLogService.ts` - Mission logging

### Research & Technology
- `researchProgressionService.ts` - Research progression
- `researchTradingService.ts` - Research trading

### Social & Organizations
- `allianceService.ts` - Alliance operations
- `guildService.ts` - Guild operations
- `friendService.ts` - Friend list management
- `forumService.ts` - Forum operations
- `messageService.ts` - Messaging

### Exploration & Travel
- `expeditionService.ts` - Expedition management
- `jumpGateService.ts` - Jump gate network
- `phalanxService.ts` - Phalanx sensor system
- `sporeDriveService.ts` - Spore drive (FTL jump)
- `lifeSupportService.ts` - Life support systems

### Combat Engines
- `npcAIEngine.ts` - NPC AI engine
- `npcSpawner.ts` - NPC faction spawner
- `raidOperationsService.ts` - Raid operations
- `rewardDistributionService.ts` - Reward distribution

### Special Systems
- `dimensionalAbyssalService.ts` - Abyssal gates
- `dimensionalAnomaliesService.ts` - Dimensional anomalies
- `gateTokensService.ts` - Gate token management
- `orbitalStationService.ts` - Orbital station management
- `megastructureService.ts` - Mega structure management
- `commanderGachaService.ts` - Commander gacha/loot box
- `constructorYardService.ts` - Constructor yard

### Progression & Events
- `seasonService.ts` - Season/battle pass
- `playerXpService.ts` - Player XP
- `progressionPipelineService.ts` - Progression pipeline
- `universeResetService.ts` - Universe reset
- `vacationService.ts` - Vacation mode
- `pushProtectionService.ts` - Push protection
- `moonDestructionService.ts` - Moon destruction

### Infrastructure
- `cronService.ts` - Cron job scheduling
- `gameJobs.ts` - Game cron jobs (50KB)

---

## 5. Missing Shared Config Files (50+ files)

The current workspace is missing many config files found in stellar-dominion3.5's `shared/config/`:

### Special Systems Configs
- `abyssalGateConfig.ts` - Abyssal gate configuration
- `blueprintChargeSystem.ts` - Blueprint charges
- `dimensionalAnomaliesConfig.ts` (67KB) - Dimensional anomalies
- `dimensionalContractConfig.ts` - Dimensional contracts
- `gateTokensConfig.ts` - Gate tokens
- `seasonConfig.ts` (71KB) - Season pass

### Combat & Battle
- `battleConfig.ts` - Battle system configuration
- `battleLogConfig.ts` - Battle logging
- `espionageConfig.ts` - Espionage system

### Economy
- `darkMatterPrimeCurrency.ts` - Dark matter currency
- `enhancedTradingConfig.ts` - Enhanced trading
- `resourceRefineryConfig.ts` - Resource refineries
- `mercenerayContracts.ts` - Mercenary contracts

### Empire & Progression
- `empireProfileConfig.ts` - Empire profiles
- `empireTypesConfig.ts` - Empire types
- `pathOfAscensionConfig.ts` - Path of Ascension
- `powerLevelConfig.ts` - Power level calculations
- `pageXpConfig.ts` - Page XP configuration
- `buildConfig.ts` - Build configuration
- `realmConfig.ts` - Realm configuration

### Social
- `diplomacyConfig.ts` - Diplomacy system
- `forumConfig.ts` - Forum configuration
- `friendsConfig.ts` - Friends system
- `messageConfig.ts` - Message system
- `governorConfig.ts` - Governor NPCs

### Universe & Galaxy
- `galaxyClassification.ts` - Galaxy types
- `planetCatalog.ts` - Planet catalog
- `moonCatalog.ts` - Moon catalog
- `gameEngineAlgorithms.ts` - Game engine algorithms
- `gameEngineCore.ts` (76KB) - Core game engine
- `gameMechanicsConfig.ts` - Game mechanics
- `universeConfig.ts` - Additional universe config

### Species & Races
- `speciesConfig.ts` - Species configuration
- `npcRaces.ts` (89KB) - NPC races
- `enemyRacesConfig.ts` - Enemy races
- `raceAlliances.ts` (77KB) - Race alliances
- `raceGuilds.ts` (56KB) - Race guilds
- `pirateFactions.ts` - Pirate factions

### Items & Equipment
- `itemLevelConfig.ts` - Item leveling

### Other
- `preludesConfig.ts` - Prelude system
- `satelliteNetworkConfig.ts` (216KB) - Satellite network
- `mastery/` - Mastery system subdirectory
- `ships/` - Ship configs subdirectory
- `economy/` - Economy configs subdirectory
- `universe/` - Universe configs subdirectory
- `xenoberage/` - Xenoberage submodule configs

---

## 6. Missing Core Infrastructure

### Rate Limiting
- `express-rate-limit` middleware with separate auth and API rate limiters
- `/api/auth` and `/api/admin` routes limited to 10 requests/15min
- `/api` routes limited to 120 requests/min

### Update Manager
- `update-manager.ts` with full route setup for game updates
- Update routes registered via `UpdateManager.getInstance().setupRoutes(app)`

### Cron Job System
- `cronService.ts` - Cron job initialization and scheduling
- `gameJobs.ts` - All game job registrations (50KB)
- SIGTERM/SIGINT handlers for graceful shutdown including database `shutdownDb()`

### Type Definitions
- `server/types.d.ts` - Additional TypeScript type definitions

### Database
- `shared/sql/` directory with SQL foundation scripts (57KB)
- Individual SQL files for: users, universe, units, research, system, protection, library, game, currency, admin
- Seed SQL data for: universe, game, bosses, raids, research, combat
- Triggers, views, settings, options SQL files

### Database Tables/Columns (Schema Differences)
Features relying on tables/columns that may be missing:
- `raidChestRewards` - Raid chest reward logs
- `abyssalGateRewards` - Abyssal gate reward logs
- `gateTokenHistory` - Token acquisition/consumption logging
- `scanCooldowns` - Galaxy scan/planet search tracking (24h cooldown)
- `universeBosses` - 90 unique boss types (abilities, loot tables)
- `bossEncounters` - Active boss battle instances
- `dimensionContracts` - Dimensional contract tokens
- `abyssalGateTokens` - Abyssal gate tokens
- `playerCurrency` - 3-tier currency (silver/gold/platinum)
- `currencyTransactions` - Currency transaction log
- `bankAccounts` - Bank accounts with interest
- `bankTransactions` - Deposit/withdrawal/interest/fee logs
- `empireValues` - Empire value tracking
- `bounties` - Player bounties system
- `pveCombatLogs` - PvE combat participation logs
- `npcVendors` - NPC vendor inventories
- `relics` / `relicInventory` - Relic system
- `elementBuffs` - Combat element buffs/debuffs
- `raidGroups` - Groups of 6-50 players for raids
- `raidFinder` - Matchmaking for raid groups

---

## 7. Missing Documentation (88+ files)

The entire `docs/` directory is missing:
- `API_ROUTES.md` (39KB) - API route documentation
- `SYSTEMS_OVERVIEW.md` (30KB) - Systems overview
- `STELLAR_DOMINION_UML_DESIGN.md` (56KB) - UML design
- Architecture, combat, economy, technology, deployment documentation
- Design documents (GDD)
- Xenoberage integration docs

---

## 8. Missing Python Backend Files

The current workspace has `server/game/`, `server/models/`, and `server/universe/` but may differ from stellar-dominion3.5's Python implementation:
- Python game loop (`game/loop.py`)
- Python fleet manager (`game/fleet_manager.py`)
- Python resource manager (`game/resource_manager.py`)
- Python event manager (`game/event_manager.py`)
- Python AI manager (`game/ai_manager.py`)
- Python universe generator (`universe/generator.py`)
- Python models: `ship.py`, `player.py`, `planet.py`, `sector.py`
- Python route files: `routes/admin.py`, `routes/combat.py`, `routes/event.py`, `routes/market.py`, `routes/player.py`, `routes/research.py`, `routes/ship.py`, `routes/universe.py`

---

## Summary

| Category | Missing Count |
|----------|--------------|
| Route files | 36 |
| Server systems | 11 |
| Server services | ~40 |
| Shared configs | 50+ |
| Documentation files | 88+ |
| SQL scripts | 15+ |
| Python files | ~18 |
