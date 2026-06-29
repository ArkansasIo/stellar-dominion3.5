# Systems Overview

Complete reference of all game systems with source file links, functions, and game logic.

---

## Table of Contents

1. [Turn System](#turn-system)
2. [Resource Economy](#resource-economy)
3. [Combat](#combat)
4. [Research](#research)
5. [Fleet](#fleet)
6. [Alliances](#alliances)
7. [Trading](#trading)
8. [Government](#government)
9. [Civilization](#civilization)
10. [Commander](#commander)
11. [Megastructures](#megastructures)
12. [Orbital Stations](#orbital-stations)
13. [Life Support](#life-support)
14. [Espionage](#espionage)
15. [Expeditions](#expeditions)
16. [Achievements](#achievements)
17. [Guilds](#guilds)
18. [Leaderboard](#leaderboard)
19. [Live Ops](#live-ops)
20. [Universe Generation](#universe-generation)
21. [Blueprint System](#blueprint-system)
22. [Smithy](#smithy)
23. [High Command](#high-command)
24. [Durability](#durability)
25. [Spore Drive](#spore-drive)
26. [Army System](#army-system)
27. [Kardashev Scale](#kardashev-scale)
28. [Interplanetary Power Grid](#interplanetary-power-grid)
29. [Warp Network](#warp-network)
30. [Artifacts & Relics](#artifacts--relics)
31. [Skills System](#skills-system)
32. [Scheduler System](#scheduler-system)
33. [Colonization](#colonization)
34. [Port Trading](#port-trading)
35. [Defense Degradation](#defense-degradation)
36. [Scanning](#scanning)
37. [Bounty System](#bounty-system)
38. [Apocalypse Events](#apocalypse-events)
39. [IGB (Inter-Galactic Bank)](#igb-inter-galactic-bank)
40. [Ranking System](#ranking-system)
41. [Upgrade System](#upgrade-system)

---

## Turn System

The turn system advances the game at regular intervals, triggering resource production, fleet movement, research progress, and all time-based mechanics.

### Functions
- `generateTurns(userId)` — Calculates turns from offline elapsed time, capped at MAX_OFFLINE_TURNS
- `spendTurns(userId, amount)` — Deducts turns, triggers effects
- `progressResearchByTurns(userId, turns)` — Advances research with speed multipliers
- `getTurnInfo(userId)` — Returns current turn state
- `autoProgressResearch(userId)` — Auto-advances research if turns available
- `applyTurnEvent(userId, event)` — Applies event effects (progressGain/loss, speedBoost/penalty)
- `calculateTurnBonuses(userId)` — Streak and event bonuses
- `initializePlayerTurns(userId)` — Sets up turn data for new players

### Game Logic
- Turn generation from offline time
- MAX_OFFLINE_TURNS cap prevents infinite accumulation
- Research progress scaled by speed multipliers
- Streak bonuses for consecutive logins

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/turnSystemConfig.ts` | Turn timing, intervals, progression rules |
| Server | `server/services/turnSystemService.ts` | Turn system management & advancement |
| Routes | `server/routes-turnsystem.ts` | Turn system API endpoints |
| Engine | `server/gameEngine.ts` | Turn processing (production, movement, research) |

---

## Resource Economy

Resource production, storage, consumption, and trading across planetary colonies.

### Functions
- `calculateProduction(buildings, research)` — Hourly production rates
- `calculateBuildingCost(type, level)` — Exponential: baseCost \* 1.15^level
- `calculateBuildTime(type, level, roboticsLevel)` — Build time calculation
- `processResourceTick(userId)` — Core resource tick, elapsed-time based
- `startBuilding(userId, type)` — Start construction
- `processConstructionQueue(userId)` — Check completed constructions
- `calculateMineProductionPerHour(level)` — Mine output
- `calculateSolarEnergyPerHour(level)` — Solar output
- `calculateResourceProduction()` — Full production calculation
- `calculateStorageCapacity(level)` — Storage: baseCapacity \* 1.5^level

### Game Logic
- Metal: 30 \* level \* (1 + level/10)
- Crystal: 20 \* level \* (1 + level/10)
- Deuterium: 10 \* level \* (1 + level/12)
- Solar: 20 \* level \* (1 + level/10)
- Energy consumption: 10/metalMine + 10/crystalMine + 20/deuteriumSynth

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/gameConfig.ts` | Core game settings including resource definitions |
| Config | `shared/config/resourceConfig.ts` | Resource types, base production rates |
| Config | `shared/config/resourceElementsConfig.ts` | Resource element definitions |
| Config | `shared/config/economy/resourceSettings.ts` | Economy resource settings |
| Server | `server/gameEngine.ts` | Resource production processing per turn |
| Server | `server/services/resourceService.ts` | Resource calculation & management |
| Client | `client/src/lib/resourceMath.ts` | Client-side resource calculations |
| Client | `client/src/pages/Resources.tsx` | Resource management UI |

---

## Combat

Space and ground combat resolution including fleet battles, raid operations, and empire combat.

### Functions
- `getUnitStats(unitType, research, bonusMultiplier)` — Effective stats with research bonuses
- `calculateDamage(attacker, defender, isCritical)` — baseDamage = max(1, attack - defense\*0.5), +/-20% variance
- `simulateCombatRound(attacker, defender, round)` — Individual unit attacks
- `simulateBattle(attackerForce, defenderForce)` — Full battle simulation (100 max rounds)
- `calculateVictoryResources(defenderResources, winner)` — 30% plunder
- `simulatePvPCombat(attacker, defender)` — Commander-influenced PvP
- `getCommanderCombatBonus(commander)` — Class-specific bonuses
- `calculateFleetStats(fleet)` — Fleet stat aggregation

### Game Logic
- Damage: max(1, attacker.attack - defender.defense \* 0.5) \* variance \* crit
- Casualties: ceil(totalDamage / 100)
- Shield regen: 10%/turn
- Evasion: 5% base + 2%/level
- Accuracy: 90% base + 1%/level
- Critical: 5% base, 1.5x multiplier
- Debris: 30% of losses (60% metal / 40% crystal)
- Loot: limited by cargo capacity

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/combatConfig.ts` | Combat formulas, damage modifiers, battle parameters |
| Config | `shared/config/combat/combatSettings.ts` | Combat settings |
| Config | `shared/config/combat/fleet/fleetCommandSystem.ts` | Fleet command system config |
| Config | `shared/config/combat/army/` | Army combat configs |
| Config | `shared/config/weaponsAndDefenseConfig.ts` | Weapons & defense stats |
| Server | `server/combatEngine.ts` | Combat resolution engine |
| Server | `server/routes-combat.ts` | Combat API endpoints |
| Server | `server/services/raidOperationsService.ts` | Raid operations logic |
| Server | `server/services/armySystemService.ts` | Army system management |
| Client | `client/src/lib/combatEngine.ts` | Client combat simulation (413 lines) |
| Client | `client/src/lib/gameLogic.ts` | Fleet combat (244 lines) |
| Client | `client/src/lib/combatSystem.ts` | Commander PvP (211 lines) |
| Client | `client/src/pages/Combat.tsx` | Combat UI |

---

## Research

Technology research tree with prerequisites, queues, research labs, and XP progression.

### Functions
- `getTechnology(id)` — Get tech by ID
- `getTechByBranch(branch)` — Get all techs in a branch
- `getTechThatUnlock(tech)` — Get prerequisite chain
- `calculateTotalResearchCost(path)` — BFS research path cost
- `calculateStatBonus(tech)` — Stat bonus from tech
- `getTreeStatistics()` — Tree stats
- `calculateResearchCost(level, tier)` — 100 \* level \* tier \* (1.2^level) \* (1.3^tier)
- `calculateResearchTime(level, tier)` — ceil(5 \* level \* tier) turns

### Game Logic
- Level scaling: 1.15^(level-1)
- Tier scaling: 1.25^(tier-1)
- 11 tech branches, 7 tech classes, 6 tech types
- Tier 1-99, Level 1-999

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/technologyTreeConfig.ts` | Tech tree structure (1541 lines) |
| Config | `shared/config/researchProgression.ts` | Research progression rules |
| Config | `shared/config/researchQueueConfig.ts` | Research queue configuration |
| Config | `shared/config/customLabConfig.ts` | Custom lab configuration |
| Server | `server/routes-research.ts` | Research API endpoints |
| Server | `server/services/technologyService.ts` | Technology research processing |
| Server | `server/services/researchLabService.ts` | Research lab management |
| Server | `server/services/researchRecommendationsService.ts` | AI research recommendations |
| Client | `client/src/pages/Research.tsx` | Research tree UI |

---

## Fleet

Fleet management, ship construction, ship fitting, and fleet movement.

### Functions
- `buildShips(userId, shipType, quantity)` — Build ships from costs
- `processCoreGameTick(userId)` — Resource + construction tick
- `calculateUnitCost(unit, level)` — Unit cost calculation
- `calculateUnitBuildTime(unit, level)` — Build time
- `calculateUnitStats(unit, level)` — Unit stats
- `calculateFleetStats(fleet)` — Fleet stat aggregation
- `calculateWarpTime(gate, distance)` — max(60, 300 - level\*20 + distance\*10)
- `calculateWarpCost(distance)` — ceil(500 \* (1 + distance/100))

### Game Logic
- 20+ unit types across 8 classes
- 90+ fitting modules (5 slot types, 6 categories)
- CPU, powergrid, capacitor management
- Ship fitting with Tech I-III, meta levels 0-14

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/staryardConfig.ts` | Shipyard config |
| Config | `shared/config/shipClassificationSystem.ts` | Ship class definitions |
| Server | `server/services/fleetService.ts` | Fleet management |
| Server | `server/routes-gameactions.ts` | Fleet deployment |
| Client | `client/src/lib/shipFittingModules.ts` | Ship fitting (1891 lines) |
| Client | `client/src/lib/unitData.ts` | Unit definitions (251 lines) |
| Client | `client/src/pages/Fleet.tsx` | Fleet UI |
| Client | `client/src/pages/Shipyard.tsx` | Shipyard UI |

---

## Alliances

Alliance creation, membership, diplomacy, and multiplayer bonuses.

### Functions
- `getAllianceSystemsSnapshot()` — Alliance state
- `fundAllianceTreasury(userId, amount)` — Contribute resources
- `upgradeAllianceSystem(systemId, level)` — Upgrade system
- `researchAllianceSystem(trackId)` — Research track
- `unlockAllianceTechnology(techId)` — Unlock tech

### Game Logic
- 1-50 members, creation cost: 100K metal / 50K crystal / 10K deuterium
- 3 upgrades, 3 research tracks, 3 technologies
- Cost scaling: baseCost \* scale^level
- Bonuses: economyBoost, researchSpeed, fleetCoordination, defenseMatrix

| Layer | File | Purpose |
|-------|------|---------|
| Schema | `shared/schema.ts` | `alliances`, `allianceMembers` tables |
| Server | `server/routes-alliances.ts` | Alliance API endpoints |
| Server | `server/services/multiplayerBonusesService.ts` | Alliance bonus calculation |
| Client | `client/src/lib/allianceSystems.ts` | Alliance logic (417 lines) |
| Client | `client/src/pages/Alliance.tsx` | Alliance UI (1016 lines) |

---

## Trading

Resource trading, market operations, merchant system, and trade routes.

### Functions
- `createTradeOrder(userId, type, resource, amount, price)` — Market orders
- `cancelOrder(orderId)` — Cancel pending order
- `fillOrder(orderId, buyerId)` — Execute trade
- `quickExchange(userId, from, to, amount)` — 5% tax instant exchange
- `createAuction(userId, item, startingPrice, buyoutPrice)` — Auction house
- `placeBid(auctionId, bidderId, amount)` — Place bid

### Game Logic
- Market: 2% fee, 24h order expiration, price range 0.001-1000
- Dynamic pricing: price = basePrice + delta \* (supply - demand) / (supply + demand)
- Quick exchange: 5% tax
- Auction with bidding and buyout

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-resource-trading.ts` | Resource trading endpoints |
| Server | `server/routes-trading.ts` | Trading system endpoints |
| Server | `server/routes-trades.ts` | Trade route endpoints |
| Server | `server/services/tradingService.ts` | Trading logic (465 lines) |
| Client | `client/src/pages/Market.tsx` | Market UI (1464 lines) |
| Client | `client/src/pages/Merchants.tsx` | Merchant UI |

---

## Government

Government progression tree, leaders, and building structures.

### Functions
- `canUnlockNode(userId, nodeId)` — Check unlock eligibility
- `calculateNodeCost(node, rank)` — 1.1x rank multiplier
- `calculateUnlockTime(node, rank)` — 1.08x rank multiplier
- `unlockNode(userId, nodeId)` — Unlock node
- `rankUpNode(userId, nodeId)` — Rank up node
- `addGovernmentXP(userId, amount)` — Add government XP
- `calculateGovernmentPressure(regime, budget)` — Pressure model

### Game Logic
- 3 pillars × 5 nodes × 5 ranks = 75 total nodes
- 10 government types with pressure profiles
- 8 governance systems, 8 mechanics
- Budget allocations modify pressures through weighted coefficients

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/governmentProgressionTreeConfig.ts` | Government tree (466 lines) |
| Config | `shared/config/governmentLeadersConfig.ts` | Government leaders |
| Config | `shared/config/governmentBuildingStructuresConfig.ts` | Gov buildings (1654 lines) |
| Server | `server/services/governmentProgressionService.ts` | Government logic (327 lines) |
| Client | `client/src/lib/governmentSystems.ts` | Government systems (624 lines) |
| Client | `client/src/pages/Government.tsx` | Government UI |

---

## Civilization

Colony management, civilization jobs, subsystems, and planetary occupation.

### Functions
- `getPlayerState(userId)` — Get civilization state
- `initializeSubsystems(userId)` — Initialize subsystems
- `upgradeSubsystem(userId, subsystem)` — Upgrade subsystem
- `assignWorkforce(userId, job, workers)` — Assign workers
- `calculateWorkforceProjection(userId)` — Workforce projection
- `setGovernmentType(userId, type)` — Set government
- `hostFestival(userId)` — Morale boost
- `processTurn(userId)` — Per-turn processing

### Game Logic
- Workforce assignment to jobs (max 50)
- 6 government types
- Festivals for morale boost
- Per-turn production processing

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/civilizationJobsConfig.ts` | Colony job definitions |
| Config | `shared/config/civilizationSubsystemsConfig.ts` | Civilization subsystem configs |
| Config | `shared/config/civilianStructuresConfig.ts` | Civilian structure definitions |
| Server | `server/routes-civilization-system.ts` | Civilization system endpoints |
| Server | `server/services/civilizationSystemService.ts` | Civilization logic (408 lines) |
| Client | `client/src/lib/colonySystems.ts` | Colony logic (388 lines) |
| Client | `client/src/pages/Colonies.tsx` | Colony UI |

---

## Commander

Commander recruitment, skill trees, talent trees, mastery, gacha system, and bank vault.

### Functions
- `pullCommander(userId)` — Gacha pull with pity
- `calculatePityRate(pulls)` — Soft pity at pull 70, hard pity at 90
- `buildCommanderLoadoutSummary()` — Loadout from 12 slots
- `buildRosterCommanderScores()` — Roster scoring
- `getGachaStatus(userId)` — Gacha state
- `getCommanderInventory(userId)` — Commander inventory

### Game Logic
- 8 races × 6 classes × 10 subclasses
- 42 archetypes, 180+ equipment templates
- Star/S-rank progression (S=10x, SS=100x, SSS=1000x)
- Gacha rates: Common 40%, Uncommon 35%, Rare 18%, Epic 5.5%, Legendary 1.5%
- 10 banner types
- 314 talent nodes across 18 sub-trees
- 10 mastery tiers, 4 domains

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/commander/skills/commanderSkillTreeSystem.ts` | Commander skill tree (759 lines) |
| Config | `shared/config/commander/talent-tree/commanderTalentTree.ts` | Talent tree (1843+ lines) |
| Config | `shared/config/commander/mastery/commanderMasteryConfig.ts` | Mastery config (770+ lines) |
| Config | `shared/config/commander/gacha/commanderGachaCommandNexus.ts` | Gacha system (1141 lines) |
| Config | `shared/config/commander/vault/commanderBankVault.ts` | Vault system (426 lines) |
| Server | `server/routes-commanders.ts` | Commander API endpoints |
| Server | `server/services/commanderGachaService.ts` | Gacha logic (417 lines) |
| Client | `client/src/lib/commanderTypes.ts` | Commander types (703 lines) |
| Client | `client/src/lib/commanderSystems.ts` | Commander logic (224 lines) |
| Client | `client/src/pages/Commander.tsx` | Commander UI (1560 lines) |

---

## Megastructures

Megastructure construction and management — planetary scale engineering projects.

### Functions
- `constructMegastructureForPlayer(userId, templateId)` — Template-based construction
- `upgradeMegastructureLevelForPlayer(id)` — Level upgrade with exponential costs
- `upgradeMegastructureTierForPlayer(id)` — Tier upgrade
- `calculateMegastructureProduction(megastructure)` — By class
- `calculateMegastructureCost(template, level, tier)` — Exponential scaling
- `setMegastructureOperationalState(id, state)` — Operational state

### Game Logic
- Classes: production/research/defense/mobility/exotic/superweapon
- Exponential cost scaling for level/tier upgrades
- Resource storage by megastructure type

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/megastructuresConfig.ts` | Megastructure definitions |
| Server | `server/routes-megastructures.ts` | Megastructure API endpoints |
| Server | `server/services/megastructureService.ts` | Megastructure logic (546 lines) |
| Client | `client/src/lib/megaStructures.ts` | Megastructure client logic |
| Client | `client/src/pages/MegaStructures.tsx` | Megastructure UI |

---

## Orbital Stations

Orbital station construction and management.

### Functions
- `buildStation(userId, class, location)` — Build station
- `upgradeStation(stationId)` — Upgrade level
- `addModule(stationId, module)` — Install module
- `getStationBonuses(stationId)` — Calculate bonuses

### Game Logic
- Class multipliers: common 1.0x to transcendent 5.0x
- Stat scaling: levelMult=1+(level-1)\*0.05, tierMult=1+(tier-1)\*0.08
- Module slots unlock at levels 1/10/25/50/100
- Max 20 stations per player

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/orbitalStationsConfig.ts` | Orbital station definitions |
| Server | `server/routes-orbital-stations.ts` | Orbital station API endpoints |
| Server | `server/services/orbitalStationService.ts` | Orbital station logic (474 lines) |
| Client | `client/src/pages/Stations.tsx` | Station UI (903 lines) |

---

## Life Support

Life support systems required for colony habitability.

### Functions
- `getLifeSupportStatus(colonyId)` — Colony survival status
- `assignLifeSupport(colonyId, subsystem, workers)` — Worker assignment
- `calculateFoodDemand(population)` — Food consumption
- `calculateWaterDemand(population)` — Water consumption
- `calculateOxygenLevel(colony)` — Oxygen level
- `processLifeSupportTick(colony)` — Process deltas, generate events

### Game Logic
- Food/water production vs consumption
- Oxygen levels
- Population happiness from housing/food/water/safety
- Worker assignment to subsystems (food/water/oxygen/maintenance)

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/lifeSupportSystemsConfig.ts` | Life support definitions |
| Server | `server/routes-lifesupport.ts` | Life support API endpoints |
| Server | `server/services/lifeSupportService.ts` | Life support logic (368 lines) |

---

## Espionage

Espionage operations — spy missions, intelligence gathering.

### Functions
- `scanTarget(userId, targetId)` — 50 deuterium, basic intel
- `sendSpyMission(userId, targetId)` — 150 deuterium, detailed intel
- `sabotageMission(userId, targetId)` — 300 deuterium + 500 gold, reduce building 15%
- `getSpyReports(userId)` — View reports
- `getActiveAgents(userId)` — Agent management

### Game Logic
- Success: 0.4 + spyLevel\*0.02 - targetDefense\*0.01
- Detection with counter-intelligence
- Research steal: 400 deuterium + 1000 gold, takes 10%

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-espionage.ts` | Espionage API endpoints |
| Server | `server/services/espionageService.ts` | Espionage logic (308 lines) |

---

## Expeditions

Expedition events — space anomalies, exploration missions, rewards.

### Functions
- `getExpeditionCatalog()` — Available expeditions
- `startExpedition(userId, expeditionId, fleet)` — Launch expedition
- `resolveExpedition(expeditionId)` — Calculate outcome

### Game Logic
- Success: 0.3 + (fleetPower/difficulty)\*0.4, capped 95%
- 3 outcomes: success/partial/failure
- Tier/level scaling rewards

| Layer | File | Purpose |
|-------|------|---------|
| Data | `shared/expeditionData.ts` | Expedition event definitions |
| Server | `server/routes-expeditions.ts` | Expedition API endpoints |
| Server | `server/services/expeditionService.ts` | Expedition logic (186 lines) |
| Client | `client/src/pages/Expeditions.tsx` | Expedition UI |

---

## Achievements

Achievement tracking, unlock conditions, and rewards.

### Functions
- `initializeAchievements(userId)` — Set up achievements
- `getPlayerAchievements(userId)` — Get achievements
- `updateResearchMilestone(userId, tech)` — Research milestone
- `recordDiscovery(userId, discovery)` — Discovery tracking
- `getAchievementStats(userId)` — Achievement stats

### Game Logic
- 130 achievements across 5 categories
- 10 quests with multi-objective chains
- 7 tiers: bronze=100 to diamond=2000 points
- Rarity: common to legendary
- XP/prestige rewards

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/achievementsConfig.ts` | Achievement definitions |
| Server | `server/routes-achievements.ts` | Achievement API endpoints |
| Server | `server/services/achievementService.ts` | Achievement logic (381 lines) |
| Client | `client/src/lib/achievementsSystem.ts` | Achievement tracking (1895 lines) |
| Client | `client/src/pages/Achievements.tsx` | Achievement UI |

---

## Scheduler System

Central game tick orchestrator — the heartbeat of the game.

### Functions
- `processTick()` — Master orchestrator, checks 10 subsystems
- `processTurns()` — Generate turns for active players
- `processPortProduction()` — Regenerate port resources
- `processPlanetProduction()` — Planet production cycles
- `processIGB()` — Apply bank interest
- `processRanking()` — Update player rankings
- `processNews()` — Generate news events
- `processDefenseDegrade()` — Degrade unsupported defenses
- `processApocalypse()` — Roll for disasters
- `processGovernor()` — Clamp out-of-bound values
- `shouldRun(rateMinutes, lastRun)` — Interval check

### Game Logic
- Each subsystem has a scheduler rate
- `shouldRun` checks: elapsed >= rateMinutes \* 60000
- Batch processing for all active players

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/schedulerSystem.ts` | Scheduler orchestrator (154 lines) |

---

## Colonization

Colony lifecycle management — creation, growth, starvation, disasters.

### Functions
- `createColony(ownerId, planetId)` — Initialize colony
- `calculateColonistProduction(colony)` — organicsLevel \* productionRate
- `calculateColonistReproduction(colony)` — floor(pop \* (1 + reproductionRate))
- `calculateStarvation(colony)` — floor(pop \* deathRate)
- `processColonistTick(colony)` — Full cycle: consume → starve → reproduce → cap
- `canBuildBase(colony, requirements)` — Check resources
- `buildBase(colony)` — Deduct resources, build
- `calculateDoomsdayEffect(colony)` — Kill 10% excess population
- `calculateSpacePlague(colony)` — Kill population \* plagueRate

### Game Logic
- Consume organics → Check starvation → Reproduce if no starvation → Enforce colonist limit
- Doomsday: kills 10% of excess population above doomsdayValue
- Space plague: kills population \* plagueRate

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/colonizationSystem.ts` | Colonization logic (205 lines) |

---

## Port Trading

Dynamic pricing port system.

### Functions
- `buyFromPort(userId, resource, amount)` — Buy at dynamic price
- `sellToPort(userId, resource, amount)` — Sell at dynamic price
- `regeneratePortResources(port)` — Refill port stock
- `calculateTradeProfit(buyPrice, sellPrice, amount)` — Profit calculation

### Game Logic
- Dynamic pricing: price = basePrice + delta \* (supply - demand) / (supply + demand)
- Price clamped >= 1
- Port regeneration: rate \* regenRate per tick, capped at limit

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/portTradingSystem.ts` | Port trading logic (149 lines) |

---

## Defense Degradation

Defense system degradation and maintenance.

### Functions
- `calculateDefenseDegrade(value, degradeRate, ticks)` — value \* (1 - degradeRate)^ticks
- `processDefenseDegrade(sector)` — Degrade if no planet owner
- `calculateFighterMaintenance(fighters, energy)` — Energy cost per fighter
- `calculateMineEffectiveness(mine, target)` — Binary: hits if hull <= mineHullSize
- `calculateEWDEffectiveness(ewd, target)` — Degrades linearly if hull > maxHullSize

### Game Logic
- Exponential decay for defenses
- Fighter maintenance requires energy
- Mine effectiveness: binary hit based on hull size
- EWD: linear degradation

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/defenseSystem.ts` | Defense degradation (114 lines) |

---

## Scanning

Sector scanning and reconnaissance.

### Functions
- `scanSector(userId, sectorId, scanType)` — Basic/full/detailed scan
- `calculateScanError(cloakLevel, sensorLevel)` — Error chance
- `fullScan(userId, sectorId)` — Full scan with turn cost
- `calculateScanRange(sensorLevel)` — sensorLevel \* 2
- `getScanResults(sector, errorRoll)` — Randomize if error

### Game Logic
- Error chance: (cloakLevel - sensorLevel + errorFactor) / 100
- Full scan costs turns
- Error roll < 0.5 randomizes fighter/mine counts

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/scanningSystem.ts` | Scanning logic (109 lines) |

---

## Bounty System

Player bounty placement and claiming.

### Functions
- `placeBounty(placer, target, amount)` — Capped at placerNetworth \* maxValue
- `calculateBountyAttacker(attacker, defender)` — Auto-bounty if ratio < threshold
- `checkBountyEligibility(target)` — Minimum turns played
- `claimBounty(attacker, bounty)` — Transfer credits
- `applyBountyPenalties(target)` — Restrict special port access

### Game Logic
- Bounty cap: placerNetworth \* maxValue
- Auto-bounty on extreme networth ratios
- Penalty: restricts special port access

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/bountySystem.ts` | Bounty logic (108 lines) |

---

## Apocalypse Events

Random disaster events affecting colonies.

### Functions
- `processApocalypse()` — 5% chance per tick to generate event
- `calculateSpacePlague(population, plagueKills)` — Kill population
- `calculatePlasmaStorm(sector)` — Destroy 30% fighters/mines
- `processDoomsday(colony)` — Kill 10% excess population
- `generateApocalypseEvent()` — 40% plague, 30% storm, 15% doomsday, 15% none

### Game Logic
- 5% trigger chance per tick
- Event distribution: plague 40%, storm 30%, doomsday 15%, none 15%
- Plasma storm: destroys 30% of fighters and mines

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/apocalypseSystem.ts` | Apocalypse logic (121 lines) |

---

## IGB (Inter-Galactic Bank)

Inter-Galactic Bank system for loans and interest.

### Functions
- `processIGBInterest()` — Apply interest to all accounts
- `calculateLoanInterest(principal, rate, time)` — Loan cost
- `processLoanPayment(userId, amount)` — Deduct from balance
- `consolidateAccount(userId)` — Transfer credits to IGB
- `checkLoanLimit(networth)` — maxLoan = networth \* loanLimit
- `processIGBTick()` — Batch interest application

### Game Logic
- Interest applied to all account balances
- Loan interest: principal \* loanInterest \* timeInMinutes
- Loan limit based on networth

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/igbSystem.ts` | IGB logic (107 lines) |

---

## Ranking System

Player and empire rankings.

### Functions
- `calculatePlayerScore(player)` — resources + empireLevel\*1000 + fleetStrength + planets\*10000 + tech\*500 + colonies\*5000
- `calculateEmpireValue(player)` — resources + empireLevel\*5000 + fleet\*10 + planets\*50000 + colonies\*25000
- `updateRankings()` — Sort by score, assign ranks
- `getTopPlayers(n)` — Slice top N
- `calculateRatingChange(attacker, defender)` — Elo-style: expectedScore = 1/(1+10^(ratingDiff/400))

### Game Logic
- Elo-style rating system
- Composite scoring with weighted components
- Automated ranking updates

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/rankingSystem.ts` | Ranking logic (105 lines) |
| Server | `server/routes-leaderboard.ts` | Leaderboard API |
| Client | `client/src/pages/Leaderboard.tsx` | Leaderboard UI |

---

## Upgrade System

Equipment and building upgrade mechanics.

### Functions
- `calculateUpgradeCost(baseCost, factor, targetLevel, currentLevel)` — baseCost \* factor^(target - current)
- `calculateItemLevel(levelFactor, currentLevel)` — levelFactor^currentLevel
- `upgradeShipEquipment(equipment)` — Increment equipment level
- `calculateDevicePrice(device)` — From device config
- `canAffordUpgrade(credits, cost)` — Check credits >= cost
- `calculateBaseStrength(level, defense)` — baseLevel \* baseDefense

### Game Logic
- Exponential cost scaling
- Item level: exponential growth
- Strength: level \* defense product

| Layer | File | Purpose |
|-------|------|---------|
| Engine | `server/systems/upgradeSystem.ts` | Upgrade logic (82 lines) |

---

*Complete system reference with functions and game logic.*
