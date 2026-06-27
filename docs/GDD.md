<!-- FILE: GDD.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-19 -->
# Game Design Document - Stellar Dominion

> Complete game design document with all features, sub-features, functions, and game logic.

---

## Overview

Stellar Dominion is a 4X Space Strategy MMORPG where players build empires, research technologies, forge alliances, and conquer the galaxy. Inspired by OGame, EVE Online, and Stellaris.

---

## 1. Core Engine

### 1.1 Resource System
**Source:** `server/gameEngine.ts`, `client/src/lib/resourceMath.ts`, `shared/config/gameConfig.ts`

**Features:**
- 7 resource types: metal, crystal, deuterium, energy, credits, food, water
- Real-time resource production per tick
- Storage capacity with exponential scaling
- Energy net calculation (production - consumption)

**Functions:**
- `calculateProduction(buildings, research)` — Hourly production: metal=30\*level\*(1+level/10), crystal=20\*level\*(1+level/10), deuterium=10\*level\*(1+level/12), energy=20+energyTech\*5
- `calculateBuildingCost(type, level)` — Exponential: baseCost \* 1.15^level
- `calculateBuildTime(type, level, roboticsLevel)` — ceil(totalCost / (2500 \* (1+roboticsLevel))) seconds
- `processResourceTick(userId)` — Elapsed-time based: production \* (elapsedHours). No offline cap in engine.
- `calculateMineProductionPerHour(level)` — baseRate \* level \* (1 + level/scalingDivisor) \* bonus
- `calculateStorageCapacity(level)` — baseCapacity \* 1.5^level (capped at 50)
- `calculateResourceProductionPerTick()` — Per-tick production from building levels \* base rates \* Kardashev bonus

**Game Logic:**
- Metal base: 30, scaling divisor: 10
- Crystal base: 20, scaling divisor: 10
- Deuterium base: 10, scaling divisor: 12
- Solar energy: 20 \* level \* (1 + level/10)
- Energy consumption: 10/metalMine + 10/crystalMine + 20/deuteriumSynth

### 1.2 Construction System
**Source:** `server/gameEngine.ts`

**Features:**
- 7 building types: metalMine, crystalMine, deuteriumSynthesizer, solarPlant, roboticsFactory, shipyard, + auxiliary
- Construction queue (max 5 items)
- Real-time completion based on elapsed time

**Functions:**
- `startBuilding(userId, buildingType)` — Validates, deducts resources, creates queue item with completeAt timestamp
- `processConstructionQueue(userId)` — Iterates cronJobs; if completeAt <= now, increments building level

### 1.3 Turn System
**Source:** `server/services/turnSystemService.ts`, `shared/config/turnSystemConfig.ts`

**Features:**
- Turn generation from offline time
- MAX_OFFLINE_TURNS cap
- Research progress from turns with speed multipliers
- Streak bonuses
- Event effects (progressGain/loss, speedBoost/penalty)

**Functions:**
- `generateTurns(userId)` — Calculates turns from offline elapsed time
- `spendTurns(userId, amount)` — Deducts turns, triggers effects
- `progressResearchByTurns(userId, turns)` — Advances research with speed multipliers
- `calculateTurnBonuses(userId)` — Streak and event bonuses
- `initializePlayerTurns(userId)` — Sets up turn data for new players

### 1.4 Scheduler System
**Source:** `server/systems/schedulerSystem.ts`

**Features:**
- Central game tick orchestrator
- Interval-based scheduling for 10 subsystems

**Functions:**
- `processTick()` — Master orchestrator, checks all subsystems against scheduler rates
- `processTurns()` — Generates turns for active players
- `processPortProduction()` — Regenerates port resources
- `processPlanetProduction()` — Runs planet production cycles
- `processIGB()` — Applies bank interest
- `processRanking()` — Updates player rankings
- `processNews()` — Generates news events
- `processDefenseDegrade()` — Degrades unsupported defenses
- `processApocalypse()` — Rolls for disasters
- `processGovernor()` — Clamps out-of-bound values
- `shouldRun(rateMinutes, lastRun)` — Interval check

---

## 2. Combat System

### 2.1 Core Combat Engine
**Source:** `server/combatEngine.ts`

**Features:**
- 10 unit types with full stats (attack/defense/health/speed)
- Research bonuses: weaponsTech +5%/lvl attack, shieldingTech +5%/lvl defense, armourTech +3%/lvl health
- Critical hit system: 5% base, 1.5x multiplier
- 100 max rounds, attacker wins by default

**Functions:**
- `getUnitStats(unitType, research, bonusMultiplier)` — Returns effective stats with research bonuses
- `calculateDamage(attackerStats, defenderStats, isCritical)` — baseDamage = max(1, attack - defense\*0.5), +/-20% variance, 1.5x crit
- `simulateCombatRound(attacker, defender, roundNumber)` — Individual unit attacks, casualties = ceil(totalDamage/100)
- `simulateBattle(attackerForce, defenderForce)` — Deep-copy forces, loop up to 100 rounds, deduct from weakest units
- `calculateVictoryResources(defenderResources, winner)` — Plunders 30% of metal/crystal/deuterium

### 2.2 Client Combat Engines
**Source:** `client/src/lib/combatEngine.ts`, `client/src/lib/gameLogic.ts`, `client/src/lib/combatSystem.ts`

**Three combat engines:**

| Engine | Lines | Focus |
|--------|-------|-------|
| combatEngine.ts | 413 | Ship-to-ship with weapon-armor effectiveness matrix |
| gameLogic.ts | 244 | OGame-style fleet combat with shield penetration |
| combatSystem.ts | 211 | Commander-influenced PvP with class bonuses |

**CombatEngine features:**
- 6 ship types: scout/fighter/cruiser/battleship/carrier/support
- 5 weapon types: laser/plasma/missile/railgun/ion
- 5 armor types with effectiveness matrix
- Shield > Armor > Hull damage progression
- Shields recharge 10%/turn
- Threat prioritization targeting

**gameLogic features:**
- Expand fleet to individual ships
- 6 rounds with random targeting
- Shield penetration: damage > shield = hull damage
- Debris: 30% of losses (60% metal / 40% crystal)
- Espionage intel quality by level difference
- Sabotage: 10% chance per saboteur, capped 90%

**combatSystem features:**
- Commander class bonuses (warrior +20%/+15%, scout +10%/+5%, etc.)
- Stat contributions: warfare\*0.02 offense, logistics\*0.02 defense, engineering\*0.01 HP
- 6 rounds, 80-120% variance

### 2.3 Combat Config
**Source:** `shared/config/combatConfig.ts`, `shared/config/combat/combatSettings.ts`

**4 combat modes:** Solo PvE, Group PvE, Solo PvP, Group PvP
**7 formations:** balanced, aggressive, defensive, flanking, pincer, circle, wedge
**5 PvE difficulty tiers:** easy (0.7x HP) to nightmare (4x HP, 10x loot)
**7 PvP rank tiers:** Recruit (0-1000) to Mythic (10000+)
**Core stats:** shieldRegen 0.1, evasion 5%, accuracy 90%, damage variance 15%, crit 5%

### 2.4 Fleet Command System
**Source:** `shared/config/combat/fleet/fleetCommandSystem.ts`

**8 formations:** line, arrow, sphere, spread, clamp, wall, delta, vanguard
**8 commands:** Focus Fire, Evasive Maneuvers, Emergency Repairs, Overcharge, Shield Wall, Blitz Attack, Fortress Mode, Doomsday Protocol
**8 defense platforms:** Missile Battlestation, Laser Grid, Shield Network, Mine Field, Fighter Bay, Sensor Array, Repair Station, Command Center

### 2.5 Army System
**Source:** `shared/config/combat/army/` (9 files)

**Sub-systems:**
- **Unit Config:** 6 statuses, 3 types (civilian/military/specialist), 5 classes, 8 jobs, 12 ranks
- **Army Categories:** 18 categories, 32 sub-categories
- **Units Progression:** 15 ship types, tiers 1-99, max level 999
- **Unit Systems:** 20 unit templates, 30 ship blueprints
- **Army Subsystems:** 15 subsystem definitions (ground/armor/mech/support/air)
- **Building Structures:** 9 tier classes, 18+ structure categories
- **Job Taxonomy:** 18 job categories, 32 sub-categories, 99 tier classes
- **Unit Research:** 6 research categories, 7 genetics researches
- **Army Management:** 20 army unit definitions with stats/abilities/upkeep

### 2.6 Raid System
**Source:** `server/services/raidOperationsService.ts`

**Features:**
- Role system: tank/dps/healer/support
- Commander power: level\*120 + attack\*3 + defense\*2.6 + leadership\*4
- Career progression with rating, ranks (6 tiers), streak bonuses

---

## 3. Economy & Trading

### 3.1 Resource Economy
**Source:** `shared/config/gameConfig.ts`, `shared/config/economy/`

**Features:**
- 7 resources: metal, crystal, deuterium, energy, credits, food, water
- 3-tier currency: silver, gold, platinum
- 4 economy resources: ore, organics, goods, energy
- 10+ resource element types

**Base production rates (per second):** metal 0.1, crystal 0.05, deuterium 0.02, energy 0.15

### 3.2 Trading System
**Source:** `server/services/tradingService.ts`, `server/routes-trading.ts`

**Functions:**
- `createTradeOrder(userId, type, resource, amount, price)` — Full market buy/sell orders
- `cancelOrder(orderId)` — Cancel pending order
- `fillOrder(orderId, buyerId)` — Execute trade with resource transfer
- `getMarketOrders(resource)` — Query active orders
- `calculateExchangeRate(resource)` — Dynamic pricing
- `quickExchange(userId, from, to, amount)` — 5% tax instant exchange
- `createAuction(userId, item, startingPrice, buyoutPrice)` — Auction house
- `placeBid(auctionId, bidderId, amount)` — Place bid

### 3.3 Port Trading
**Source:** `server/systems/portTradingSystem.ts`

**Functions:**
- `buyFromPort(userId, resource, amount)` — Buy at dynamic price
- `sellToPort(userId, resource, amount)` — Sell at dynamic price
- `regeneratePortResources(port)` — Refill port stock
- `calculateTradeProfit(buyPrice, sellPrice, amount)` — Profit calculation
- **Dynamic pricing:** price = basePrice + delta \* (supply - demand) / (supply + demand)

### 3.4 Banking System
**Source:** `server/services/bankService.ts`, `server/systems/igbSystem.ts`

**Functions:**
- `getBankAccount(userId)` — Get bank state
- `depositToBank(userId, amount)` — Deposit credits
- `withdrawFromBank(userId, amount)` — Withdraw credits
- `processInterest(userId)` — Apply daily interest (5%-15% by level)
- `purchaseInsurance(userId)` — 100k gold for 50% loss protection, 30 days
- `upgradeVault(userId)` — Increase vault capacity
- `processIGBInterest()` — Batch interest for all accounts
- `calculateLoanInterest(principal, rate, time)` — Loan cost
- `checkLoanLimit(networth)` — maxLoan = networth \* loanLimit

### 3.5 Currency System
**Source:** `server/services/currencyService.ts`

**Functions:**
- `getCurrencyBalance(userId)` — Get silver/gold/platinum
- `addCurrency(userId, type, amount)` — Add currency
- `deductCurrency(userId, type, amount)` — Deduct currency
- `transferCurrency(from, to, type, amount)` — Player transfer with fees
- `calculateCurrencyExchange(from, to, amount)` — Exchange rate

### 3.6 Crafting System
**Source:** `shared/config/economy/crafting/`

**Smithy System (446 lines):**
- 20 material types (titanium_alloy to neutronium_alloy)
- 20+ enchantment types (fire/ice/void damage, hull repair, shield boost)

**Equipment Loadout (722 lines):**
- 6+ equipment sets with 2/4/6-piece bonuses
- 6 loadout slots, auto-equip, set bonuses

**Equipment Tempering (660 lines):**
- 6 tempering tiers (untouched → mythic)
- 10 equipment slots, 6 stat rarities
- Masterworking progression (+1 to +10)

### 3.7 Blueprint System
**Source:** `client/src/lib/blueprintSystem.ts`, `shared/config/eveBlueprintSystem.ts`

**Functions:**
- `calculateManufacturingCost(blueprint)` — Material waste \* (1 - industrySkill \* 0.01)
- `calculateManufacturingTime(blueprint)` — Time with reduction bonuses
- `calculateSuccessRate(blueprint)` — Based on rarity and skill
- `createBlueprintCopy(blueprint)` — Copy blueprint

**Features:** 25+ categories, 3 rarity tiers, EVE-style manufacturing

---

## 4. Research & Technology

### 4.1 Technology Tree
**Source:** `shared/config/technologyTreeConfig.ts` (1541 lines)

**Features:**
- 11 tech branches: armor, shields, weapons, propulsion, sensors, power, computing, engineering, resources, medical, hyperspace
- 7 tech classes: basic, standard, advanced, military, experimental, ancient, exotic
- 6 tech types: passive, active, upgrade, modification, utility, hybrid
- Tier 1-99, Level 1-999 progression
- 900+ technologies planned

**Scaling:**
- Level: 1.15^(level-1)
- Tier: 1.25^(tier-1)
- Research cost: 100 \* level \* tier \* (1.2^level) \* (1.3^tier)
- Research time: ceil(5 \* level \* tier) turns

**TechTreeManager methods:**
- `getTechnology(id)`, `getTechByBranch(branch)`, `getTechThatUnlock(tech)`
- `calculateTotalResearchCost(path)` — BFS research path
- `calculateStatBonus(tech)` — Stat bonus from tech
- `getTreeStatistics()` — Tree stats

### 4.2 Research Labs
**Source:** `server/services/researchLabService.ts`, `shared/config/customLabConfig.ts`

**Features:**
- Custom research lab management
- Lab specializations
- Research recommendations (AI)
- Research trading between players
- Research XP system

### 4.3 90-Skill System
**Source:** `client/src/lib/skills90System.ts` (1115 lines)

**Features:**
- 90 skills across 10 categories: combat (15), navigation (12), electronic (13), mechanical (10), industry (12), science (10), social (8)
- EVE-Online-inspired training
- Training time: baseTime \* rank \* 2^(level-1) / attributeModifier
- Prerequisites, ranks (1-14), max level (5)
- Primary/secondary attributes

---

## 5. Fleet & Ships

### 5.1 Ship System
**Source:** `server/gameEngine.ts`, `shared/config/staryardConfig.ts`

**Features:**
- 20+ unit types across 8 classes
- Ship fitting with 90+ modules
- CPU, powergrid, capacitor management

**Ship Costs:**
- lightFighter, heavyFighter, cruiser, battleship, battlecruiser, destroyer

### 5.2 Unit Types
**Source:** `client/src/lib/unitData.ts`

| Class | Units | Cost Range |
|-------|-------|-----------|
| Fighter | Viper, Cobra, Wraith | 3K-50K metal |
| Capital | Hammerhead, Leviathan, Reaper, Obliterator, Devastator | 100K-5M |
| Super | Mothership, Planet Killer | 5M-12M |
| Titan | Avatar, Erebus, Ragnarok | 12M-40M |
| Civilian | Hermes, Hercules, Exodus, Scavenger, Seeker Drone | 5K-500K |
| Troop | Space Marine, Exo-Trooper, Colonist | 10K-100K |
| Vehicle | Hover Tank, Titan Mech | 50K-1M |

### 5.3 Ship Fitting
**Source:** `client/src/lib/shipFittingModules.ts` (1891 lines)

**Features:**
- 90+ modules across 5 slot types
- 6 module categories: weapons, defense, propulsion, electronic, engineering, utility
- Tech I through Tech III, meta levels 0-14

**Slot Types:**
- High-slot: 30+ weapons (projectile/energy/hybrid/missile/drone/smartbomb)
- Mid-slot: 25+ defense (shield boosters/extenders/hardeners, propulsion, EWAR)
- Low-slot: 20+ engineering (armor repairers/plates, damage mods, power/CPU)
- Rigs: 15 rig types

### 5.4 Starship Catalog
**Source:** `client/src/lib/starshipLineCatalog.ts`, `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts`

- 240 ship system entries
- Starship hull line catalog
- Ship classification system

---

## 6. Commander System

### 6.1 Commander Core
**Source:** `client/src/lib/commanderTypes.ts`, `client/src/lib/commanderSystems.ts`

**Features:**
- 8 races, 6 classes, 10 subclasses
- 12 equipment slots
- 42 commander archetypes
- 180+ equipment templates
- Star/S-rank progression

**Functions:**
- `buildCommanderLoadoutSummary()` — Computes loadout from 12 equipment slots
- `buildRosterCommanderScores()` — Roster scoring

**Stats:**
- Core: warfare, logistics, science, engineering
- Derived: commandPower, tacticalAgility, sustainment, civicControl, researchCadence, constructionTempo
- Attributes: combat, strategy, resilience, leadership, logistics, innovation, governance, adaptability

### 6.2 Gacha System
**Source:** `server/services/commanderGachaService.ts`, `shared/config/commander/gacha/`

**Functions:**
- `pullCommander(userId)` — Gacha pull with pity
- `calculatePityRate(pulls)` — Soft pity at pull 70, hard pity at 90
- `getCommanderPool()` — Available commanders

**Rates:** Common 40%, Uncommon 35%, Rare 18%, Epic 5.5%, Legendary 1.5%
**Banners:** 10 types (standard, beginner, limited, class-specific, faction, legendary, free, event, rerun, collaboration)

### 6.3 Skill Tree System
**Source:** `shared/config/commander/skills/commanderSkillTreeSystem.ts` (759 lines)

**Features:**
- 12 skill classes (warrior, mage, ranger, rogue, summoner, engineer, paladin, necromancer, elementalist, shadow, berserker, guardian)
- PoE2-inspired skill gem + support gem system
- 32+ skill gems, 15 support gems
- 3 skill trees with 7-8 nodes each

### 6.4 Talent Tree
**Source:** `shared/config/commander/talent-tree/commanderTalentTree.ts` (1843+ lines)

**Features:**
- Level 1-999 progression, tier 1-99 nodes
- 6 classes \* 3 sub-classes = 18 sub-trees
- 314 total talent nodes
- Rarities: normal, notable, keystone, ascendancy
- 40+ stat types

### 6.5 Mastery System
**Source:** `shared/config/commander/mastery/commanderMasteryConfig.ts` (770+ lines)

**Features:**
- 10 mastery tiers (Initiate to Mythic)
- 20 stat keys
- 4 domains: Warfare, Science, Economy, Leadership
- 18 commander mastery classes

### 6.6 Vault & Bank
**Source:** `shared/config/commander/vault/`

**Functions:**
- 5-8 currencies, 10 resources
- Vault with 50-75 slots (upgradeable)
- Bank with interest (1%/hour)
- Insurance for item protection
- Currency exchange, transfer with 5% fees

---

## 7. Government & Politics

### 7.1 Government Types
**Source:** `client/src/lib/governmentData.ts`, `shared/config/gameConfig.ts`

**10 government types:** Democracy, Monarchy, Technocracy, Junta, Corporate, Theocracy, Anarchy, Oligarchy, Federation, Dictatorship
**6 policies:** Martial Law, Free Trade, Propaganda, Austerity, Mandatory Labor, Universal Healthcare
**5 government multipliers:** democracy, corporate, military, theocracy, monarchy

### 7.2 Government Progression
**Source:** `shared/config/governmentProgressionTreeConfig.ts` (466 lines)

**3 pillars, 15 nodes, 5 ranks each:**
- **Stability:** Martial Authority → Provincial Control → Absolute Authority → Security Apparatus → Iron Fist
- **Law:** Legal Foundation → Civic Rights → Democratic Assembly → Commercial Law → Justice Perfect
- **Economic:** Free Market → Commercial Networks → Capitalist Expansion → Production Optimization → Economic Dominance

**Functions:**
- `canUnlockNode(userId, nodeId)` — Check unlock eligibility
- `calculateNodeCost(node, rank)` — 1.1x rank multiplier
- `calculateUnlockTime(node, rank)` — 1.08x rank multiplier

### 7.3 Government Buildings
**Source:** `shared/config/governmentBuildingStructuresConfig.ts` (1654 lines)

- 18 building categories, 32 sub-categories
- 23 government leader types
- Government building structures with progression

### 7.4 Government Pressure Model
**Source:** `client/src/lib/governmentSystems.ts` (624 lines)

**8 governance systems:** executive, legislative, judicial, civil, security, economic, scientific, diplomatic
**8 mechanics:** policy, legitimacy, compliance, intelligence, commerce, innovation, justice, diplomacy
**5 output pressures:** legitimacy, control, growth, innovation, bureaucracy
**10 regime profiles** with pressure baselines

---

## 8. Universe & Exploration

### 8.1 Universe Generation
**Source:** `shared/config/universeGenerationConfig.ts`, `client/src/lib/universeSeed.ts`

**Features:**
- Seeded RNG for deterministic generation
- 3 presets: starter (1 galaxy, 200 systems), standard (3 galaxies, 7500 systems), vast (10 galaxies, 200K systems)
- 7 star classes (O through M) with frequency distribution
- Planet types: terrestrial, super_earth, gas_giant, ice_giant, desert
- Hazards: radiation, asteroid_field, cosmic_storm, ion_storm

**Star Distribution:** O (0.03%) through M (76.45%)

### 8.2 Planet System
**Source:** `client/src/lib/planetUtils.ts`, `shared/config/planetTypesConfig.ts`

**8 planet types:** M (Earth-like), H (Desert), L (Marginal), K (Mars-like), Y (Demon), D (Barren), J (Gas Giant), T (Frozen)
**Planet data:** atmosphere, gravity, temperature, hydrosphere, habitability score
**Resource deposits:** iron_ore, copper, deuterium, rare_earths

### 8.3 Colony System
**Source:** `server/systems/colonizationSystem.ts`, `client/src/lib/colonySystems.ts`

**Functions:**
- `createColony(ownerId, planetId)` — Initialize colony
- `calculateColonistProduction(colony)` — organicsLevel \* productionRate
- `calculateColonistReproduction(colony)` — floor(pop \* (1 + reproductionRate))
- `calculateStarvation(colony)` — floor(pop \* deathRate)
- `processColonistTick(colony)` — Consume → Starve → Reproduce → Cap
- `canBuildBase(colony, requirements)` — Check resources
- `buildBase(colony)` — Deduct resources, build
- `calculateDoomsdayEffect(colony)` — Kill 10% excess population

**Features:**
- 1M procedural colonies
- 4 management profiles (balanced/industry/defense/science)
- Colony status: stability, security, infrastructure, logistics, energy, morale

### 8.4 Warp Network
**Source:** `client/src/lib/warpNetwork.ts`, `shared/config/navigationConfig.ts`

**Functions:**
- `calculateWarpTime(gate, distance)` — max(60, 300 - level\*20 + distance\*10)
- `calculateWarpCost(distance)` — ceil(500 \* (1 + distance/100))

**Features:** 6 warp gates, 4 trade routes, gate network

### 8.5 Interstellar Travel
**Source:** `shared/config/interstellarTravelConfig.ts`

- FTL/stargates/wormholes
- FTL speed limit: 50-200 ly/turn

### 8.6 Spore Drive
**Source:** `server/services/sporeDriveService.ts`

**Functions:**
- `executeJump(drive, destination)` — Jump success = (stability/100) \* (safetyRating/100)
- `consumeSpores(drive, distance)` — Spore consumption
- `getMycelialNetwork()` — Network nodes

**Features:** 7 rarity tiers, cooldown management, mycelial network

### 8.7 Space Anomalies
**Source:** `client/src/lib/spaceAnomalies.ts`

**8 anomaly types:** wormhole, asteroid_cluster, nebula_vein, supernova_remnant, quantum_field, derelict_station
**Features:** rarity, rewards, hazard levels, research requirements

### 8.8 Universe Events
**Source:** `client/src/lib/universeEvents.ts`

**6 dynamic events:** solar flare, meteor shower, wormhole storm, stronghold siege, etc.
**3 debris field types**
**Modifiers:** resourceBonus, productionBonus, combatModifier, fleetSpeedModifier, dangerIncrease

---

## 9. Orbital Systems

### 9.1 Orbital Stations
**Source:** `server/services/orbitalStationService.ts`, `shared/config/orbitalStationsConfig.ts`

**Functions:**
- `buildStation(userId, class, location)` — Build station
- `upgradeStation(stationId)` — Upgrade level
- `addModule(stationId, module)` — Install module
- `getStationBonuses(stationId)` — Calculate bonuses

**Features:** Class multipliers (common 1.0x to transcendent 5.0x), module slots at levels 1/10/25/50/100, max 20 stations

### 9.2 Orbital Defense
**Source:** `client/src/lib/orbitalDefenseSystem.ts` (977+ lines)

**Features:**
- 7 orbital platform classes
- 15+ modules
- 8 abilities
- 15 technologies (tier 1-5 prerequisite tree)
- 5 threat profiles
- 5 doctrines
- 5 orbit zones
- 5 mission types

**Functions:**
- `calculatePlatformStats(platform)` — Derived stats from base + modules + level + doctrine + orbit

### 9.3 Megastructures
**Source:** `server/services/megastructureService.ts` (546 lines)

**Functions:**
- `constructMegastructureForPlayer(userId, templateId)` — Template-based construction
- `upgradeMegastructureLevelForPlayer(id)` — Level upgrade with exponential costs
- `upgradeMegastructureTierForPlayer(id)` — Tier upgrade
- `calculateMegastructureProduction(megastructure)` — By class (production/research/defense/mobility/exotic/superweapon)
- `calculateMegastructureCost(template, level, tier)` — Exponential scaling

### 9.4 Life Support
**Source:** `server/services/lifeSupportService.ts` (368 lines)

**Functions:**
- `getLifeSupportStatus(colonyId)` — Colony survival status
- `assignLifeSupport(colonyId, subsystem, workers)` — Worker assignment
- `calculateFoodDemand(population)` — Food consumption
- `calculateWaterDemand(population)` — Water consumption
- `calculateOxygenLevel(colony)` — Oxygen level
- `processLifeSupportTick(colony)` — Process deltas, generate events

---

## 10. Social Systems

### 10.1 Alliances
**Source:** `server/routes-alliances.ts`, `client/src/lib/allianceSystems.ts`

**Features:**
- 1-50 members, creation cost: 100K metal / 50K crystal / 10K deuterium
- 3 upgrades (Command Nexus, Fortress Grid, Logistics Web)
- 3 research tracks (Collective AI, Quantum Treaties, Deep-Range Cartography)
- 3 technologies (Stellar Trade Web, Phalanx Harmonics, Diplomatic Entanglement)
- Shared resources and bonuses

**Functions:**
- `getAllianceSystemsSnapshot()` — Alliance state
- `fundAllianceTreasury(userId, amount)` — Contribute resources
- `upgradeAllianceSystem(systemId, level)` — Upgrade system
- `researchAllianceSystem(trackId)` — Research track
- `unlockAllianceTechnology(techId)` — Unlock tech

### 10.2 Guilds
**Source:** `server/routes-guilds.ts`

- Guild creation, membership, roles
- Treasury management

### 10.3 Raids
**Source:** `server/routes-raids.ts`, `client/src/pages/Raids.tsx`

- 6-player raid teams
- Raid bosses (90 boss types)
- Raid finder matchmaking
- Role-based combat (tank/dps/healer/support)

### 10.4 Social Features
**Source:** `server/routes-friends.ts`, `server/routes-messages.ts`, `server/routes-forums.ts`

- Friends list with online status
- In-game messaging
- Player forums

---

## 11. Progression Systems

### 11.1 Empire Progression
**Source:** `shared/config/gameConfig.ts`

**Features:**
- 21 tiers (Novice to Absolute)
- 999 empire levels
- Tier XP and Empire XP systems
- Prestige system

**TIER_CONFIG:** exp requirements from 1,000 to 10M
**EMPIRE_LEVEL_CONFIG:** 1.1x exp scaling, milestones at 10/25/50/100/250/500/999

### 11.2 Kardashev Scale
**Source:** `client/src/lib/kardashevScale.ts`

**18 levels:** "Planetary Settler" → "Supreme Omnipotent"
**Scaling:** Resource requirements exponential (level 18: 500 trillion each)
**Bonuses:** 0% to +2000% production, +3000% fleet power
**Unlocks:** Dyson Spheres, Ring Worlds, Death Stars, Victory Condition

### 11.3 Achievements
**Source:** `server/services/achievementService.ts`, `client/src/lib/achievementsSystem.ts`

**Features:**
- 130 achievements across 5 categories (exploration/combat/economics/technology/diplomacy/milestones)
- 10 quests with multi-objective chains
- 7 achievement tiers (bronze=100 to diamond=2000 points)
- Persistent tracking with auto DB table creation

### 11.4 Artifacts & Relics
**Source:** `server/routes-artifacts.ts`, `client/src/lib/artifactRelicSystems.ts`

- 14 powerful artifacts (Ancient Compass, Star Map, Void Stone, etc.)
- Relic collection with rarity and bonuses
- 526-line artifact/relic progression system

### 11.5 Skills System
**Source:** `client/src/lib/skillsData.ts`, `client/src/lib/skills90System.ts`

- 7 skill categories, 5 attributes
- 90 skills with training time formula
- EVE-Online-inspired progression

### 11.6 Story Mode
**Source:** `shared/config/gameConfig.ts`

- 12 Acts of campaign story
- 7 element types (fire, water, lightning, earth, ice, shadow, light)
- Damage/defense modifiers with weakness chart
- Chapter progression with NPCs and rewards

### 11.7 Live Ops
**Source:** `shared/config/liveOpsContentConfig.ts`

- Battle Pass system
- Season Pass system
- In-game storefront
- Time-limited events

---

## 12. Espionage & Intelligence

### 12.1 Espionage System
**Source:** `server/services/espionageService.ts`

**Functions:**
- `scanTarget(userId, targetId)` — 50 deuterium, basic intel
- `sendSpyMission(userId, targetId)` — 150 deuterium, detailed intel
- `sabotageMission(userId, targetId)` — 300 deuterium + 500 gold, reduce building by 15%
- `getSpyReports(userId)` — View reports
- `getActiveAgents(userId)` — Agent management

**Success chance:** 0.4 + spyLevel\*0.02 - targetDefense\*0.01
**Detection chance** with counter-intelligence
**Research steal:** 400 deuterium + 1000 gold, takes 10% of research

---

## 13. Expeditions

**Source:** `server/services/expeditionService.ts`, `shared/expeditionData.ts`

**Functions:**
- `getExpeditionCatalog()` — Available expeditions
- `startExpedition(userId, expeditionId, fleet)` — Launch expedition
- `resolveExpedition(expeditionId)` — Calculate outcome

**Success:** 0.3 + (fleetPower/difficulty)\*0.4, capped 95%
**3 outcomes:** success/partial/failure with tier/level scaling rewards

---

## 14. Database

**Source:** `shared/schema.ts` (2020 lines)

**72 PostgreSQL tables** via Drizzle ORM covering:
- User accounts, sessions, player states
- Troops, squads, missions, battles
- Alliances, guilds, teams, raids
- Market orders, auctions, trades
- Research areas, technologies, progress
- Expeditions, encounters
- Colonies, starbases, moon bases
- Megastructures, achievements
- Items, currency, banking
- Universe events, bosses
- Story campaigns, missions

---

## 15. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Query, Tailwind |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Basic Auth, Replit OIDC |
| Shared | TypeScript configs, Zod schemas |
| Build | Vite, Electron |
| Deploy | Docker, Railway, Render, Vercel, Firebase |

---

*Complete game design document with all features, sub-features, functions, and game logic.*
