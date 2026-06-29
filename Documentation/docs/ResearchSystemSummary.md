# Research System - Comprehensive Documentation

## Overview

The Research System is a multi-layered technology progression framework spanning technology trees, research queues, laboratory management, research XP/discovery mechanics, player-to-player trading, a knowledge library, and a recommendation engine. Technologies are organized across 11 core branches (with 13 progression branches and 18 knowledge library categories), supporting 99 tiers and up to 999 levels per technology, generating thousands of distinct technologies through procedural generation and hand-crafted configurations.

> **Source:** `shared/config/technologyTreeConfig.ts`

---

## Technology Tree Structure

### Core Branches (11 Base Branches)

| Branch | Description |
|--------|-------------|
| `armor` | Defensive plating systems (composite, ceramic, steel, titanium, etc.) |
| `shields` | Energy shield generation (kinetic, thermal, radiation, electromagnetic, exotic) |
| `weapons` | Combat systems (ballistic, laser, missile, plasma, pulse, particle, exotic) |
| `propulsion` | Engine technologies (ion, plasma, nuclear, anti-matter, exotic drives) |
| `sensors` | Detection and scanning systems (radar, LIDAR, thermal, gravitational, quantum) |
| `power` | Energy generation (fusion, antimatter, zero-point, quantum, exotic, stellar reactors) |
| `computing` | AI systems (ship AI, combat AI, navigation AI, science AI, quantum processing) |
| `engineering` | Construction and fabrication (automation, fabrication, repair, optimization, modular systems) |
| `resources` | Material processing (mining, drilling, purification, refining, synthesis, crystallization) |
| `medical` | Healing systems (healing, regeneration, resurrection, enhancement, cryogenics) |
| `hyperspace` | FTL travel (warp drive, jump gate, quantum tunnel, exotic travel, teleportation) |

> **Source:** `shared/config/technologyTreeConfig.ts:11-22` (`TechBranch` type)

### Technology Classes (7 Per Branch)

Each technology belongs to one of seven classes:

- **basic** - Entry-level, widely available
- **standard** - Improved variants
- **advanced** - Specialized configurations
- **military** - Combat-oriented (faction-locked)
- **experimental** - High-risk, high-reward
- **ancient** - Precursor civilization technologies
- **exotic** - Ultra-rare, reality-bending discoveries

> **Source:** `shared/config/technologyTreeConfig.ts:24` (`TechClass` type)

### Technology Types (6)

- `passive` - Always active
- `active` - Toggleable
- `upgrade` - Enhancement modules
- `modification` - Stat modifiers
- `utility` - Non-combat functions
- `hybrid` - Combined type

> **Source:** `shared/config/technologyTreeConfig.ts:25` (`TechType` type)

### Classification Hierarchy

```
Branch (11) -> Class (7) -> Type (6) -> Category (5+) -> Subcategory -> Classification
```

### Procedural Generation

The expanded tech tree generates technologies procedurally across all branches:

| Branch | Generator Function | Approx. Count |
|--------|-------------------|---------------|
| Armor | `generateArmorTechs()` | ~600 (5 categories × 8 materials × 5 grades × 3 levels) |
| Shields | `generateShieldTechs()` | ~250 (5 types × 5 configurations × 5 generations × 2 levels) |
| Weapons | `generateWeaponTechs()` | ~420 (7 types × 6 configurations × 5 grades × 2 levels) |
| Propulsion | `generatePropulsionTechs()` | ~250 (5 engine types × 5 configurations × 5 versions × 2 levels) |
| Sensors | `generateSensorTechs()` | ~168 (7 types × 6 ranges × 4 generations) |
| Power | `generatePowerTechs()` | ~150 (6 reactor types × 5 scales × 5 generations) |
| Computing | `generateComputingTechs()` | ~100 (5 AI types × 5 proficiencies × 4 versions) |
| Engineering | `generateEngineeringTechs()` | ~120 (6 systems × 5 complexity levels × 4 generations) |
| Resources | `generateResourceTechs()` | ~120 (6 extraction types × 5 efficiency levels × 4 scales) |
| Medical | `generateMedicalTechs()` | ~150 (6 treatments × 5 effectiveness levels × 5 methods) |
| Hyperspace | `generateHyperspaceTechs()` | ~125 (5 FTL types × 5 capabilities × 5 generations) |

> **Source:** `shared/config/technologyTreeExpandedConfig.ts`

### Custom/Experimental Technologies

Beyond the standard tree, custom technologies extend the system with four additional categories:

- **Experimental Technologies** - High-risk, high-reward techs (e.g., Plasma Matrix Crystallization, Temporal Distortion Field)
- **Faction-Specific Technologies** - Unique techs tied to specific civilizations (e.g., Voth Phase-Shift Matrices)
- **Ancient/Precursor Technologies** - Ultra-rare techs from extinct civilizations (e.g., Precursor Matter Assembler)
- **Event Technologies** - Limited-edition techs available during seasonal events

> **Source:** `shared/config/technologyTreeCustomConfig.ts`

---

## Technology Node Properties

Each `TechnologyNode` contains:

| Property | Description |
|----------|-------------|
| `id` | Unique identifier (e.g., `armor-light-basic-composite-1`) |
| `name` | Display name |
| `branch` | Tech branch |
| `class` | Tech class (basic, advanced, military, etc.) |
| `type` | Tech type (passive, active, upgrade, etc.) |
| `category` | Classification category |
| `subcategory` | Specific variant |
| `level` | Technology level (1-999) |
| `tier` | Technology tier (1-99) |
| `researchCost` | Science points required |
| `researchTime` | Turns to research |
| `prerequisiteTechs` | Required tech IDs |
| `minimumLevel` | Minimum player level |
| `minimumTechLevel` | Tech level gating |
| `stats` | Primary stats, secondary stats, resistance, efficiency, reliability |
| `bonuses` | Passive bonus effects |
| `penalties` | Negative effects (optional) |
| `rarity` | Common, uncommon, rare, epic, legendary, mythic |
| `unlocksUpgrades` | Tech IDs this unlocks |
| `maxUpgradeLevel` | Max upgrade level |
| `isResearchable` | Whether player can research |
| `factionLocked` | Faction restriction (optional) |

> **Source:** `shared/config/technologyTreeConfig.ts:51-112` (`TechnologyNode` interface)

---

## TechTreeManager

The `TechTreeManager` class provides core query and navigation capabilities:

| Method | Description |
|--------|-------------|
| `getTechnology(id)` | Get technology by ID |
| `getTechByBranch(branch)` | Get all techs in a branch |
| `getTechByClass(className)` | Get all techs of a class |
| `getTechThatUnlock(prereqId)` | Get techs unlocked by a prerequisite |
| `getPrerequisites(techId)` | Get all prerequisites for a tech |
| `calculateTotalResearchCost(techId)` | Total cost including prerequisites |
| `getAvailableUpgrades(techId)` | Get available upgrades |
| `getStartingTechs()` | Get technologies with no prerequisites |
| `calculateStatBonus(techId, level, tier)` | Calculate stat bonuses at level/tier |
| `getResearchPath(fromTechId, toTechId)` | BFS path between two techs |
| `getTreeStatistics()` | Overall tree statistics |

> **Source:** `shared/config/technologyTreeConfig.ts:1230-1483` (`TechTreeManager` class)

---

## Research Progression System

### Progression Branches (13)

The research progression system uses 13 branches:

`energy`, `propulsion`, `weapons`, `defense`, `shields`, `construction`, `computers`, `espionage`, `megastructure`, `economy`, `genetics`, `quantum`, `exotic`

> **Source:** `shared/config/researchProgression.ts:8-21` (`ResearchBranch` type)

### Progression Scaling

**Level Scaling (Exponential):**
```
Multiplier = 1.15^(level - 1)
Level 1: 1.0x | Level 5: 1.74x | Level 10: 4.05x | Level 20: 201.8x
```

**Tier Scaling (Stronger):**
```
Multiplier = 1.25^(tier - 1)
Tier 1: 1.0x | Tier 5: 3.05x | Tier 10: 9.31x
```

**Research Cost Formula:**
```
Cost = Base Cost × Level Multiplier × Tier Multiplier
```

**Research Time Formula:**
```
Time = 5 × Level × Tier (turns)
```

> **Source:** `shared/config/technologyTreeConfig.ts:118-138` (`TECH_PROGRESSION` constants)

### Cost Calculation

Research costs are calculated using the `ProgressionSystem` with configurable scaling profiles:

```typescript
calculateResearchCost(researchId, level, tier) // Returns { metal, crystal, deuterium }
calculateResearchTime(researchId, level, tier)  // Returns turns
```

Costs scale with both level and tier using `SCALING_PROFILES.research.levelMultiplier` and `SCALING_PROFILES.research.tierMultiplier`.

> **Source:** `shared/config/researchProgression.ts:688-735`

### Expansion Technologies

10 expansion branches generate 9 technologies each (90 total):

| Branch | Key | Focus Stat |
|--------|-----|------------|
| Energy Grid | `energy-grid` | efficiency |
| Transit Vector | `transit-vector` | speed |
| Arsenal Doctrine | `arsenal-doctrine` | attack |
| Fortress Matrix | `fortress-matrix` | resistance |
| Cognition Stack | `cognition-stack` | processing |
| Market Synthesis | `market-synthesis` | output |
| Genesis Lattice | `genesis-lattice` | growth |
| Entanglement Array | `entanglement-array` | stability |
| Mega Systems | `mega-systems` | capacity |
| Reality Forge | `reality-forge` | control |

> **Source:** `shared/config/researchProgression.ts:412-573`

### Unlock Requirements

Research tier unlock requirements gate progression:

| Tier | Requirement |
|------|-------------|
| 1 | (none) |
| 3 | Energy Technology Level 1 |
| 5 | Advanced Engineering Level 1 |
| 10 | Quantum Physics Level 5 |
| 15 | Exotic Matter Research Level 3 |
| 20 | Megastructure Engineering Level 10 |
| 25 | Ascension Studies Level 1 |
| 30 | Reality Engineering Level 1 |
| 50 | Godhood Studies Level 10 |
| 99 | Ultimate Knowledge Level 1 |

> **Source:** `shared/config/researchProgression.ts:47-58` (`RESEARCH_UNLOCK_REQS`)

---

## Research XP System

### XP Generation

- **Base XP per research completion:** 100
- **XP per turn spent on research:** 5

### XP Multipliers

**Tech Class Multipliers:**
```
basic: 1.0x | standard: 1.2x | advanced: 1.5x | military: 1.8x
experimental: 2.2x | ancient: 2.8x | exotic: 3.5x
```

**Branch Multipliers:**
```
armor: 1.0x | shields: 1.0x | weapons: 1.1x | propulsion: 1.2x
sensors: 0.95x | power: 1.0x | computing: 1.15x | engineering: 1.1x
resources: 0.9x | medical: 1.15x | hyperspace: 1.5x
```

> **Source:** `shared/config/researchXPConfig.ts:7-43` (`RESEARCH_XP_CONFIG`)

### Discovery Mechanics

Discovery chance formula:
```
baseChance + (xpLevel × 0.02) × (1.15^activeStreaks)
```

Discovery types and their XP rewards:

| Type | Rarity | XP Reward | Effect |
|------|--------|-----------|--------|
| `tech_unlock` | Common (50%) | 500 | Unlock a new technology |
| `resource_bonus` | Uncommon (25%) | 250 | Resource production bonus |
| `speed_boost` | Uncommon (25%) | 350 | +15% speed for 1 hour |
| `tech_advancement` | Rare (15%) | 400 | 20% progress to next research |
| `breakthrough` | Epic (8%) | 1000 | 50% progress + 25% speed for 2 hours |
| `ancient_knowledge` | Legendary (2%) | 2000 | Unlock new branch + 50% speed for 1 hour |

> **Source:** `shared/config/researchXPConfig.ts:45-101` (`DISCOVERY_MECHANICS`)

### XP Levels

- **Max Level:** 100
- **Base XP for Level:** 5,000
- **XP Multiplier per Level:** 1.2x

**Level Up Rewards:**
- +2.5% discovery chance per level
- Unlock new lab every 5 levels
- +2% research speed per level
- +5% XP gain per level

> **Source:** `shared/config/researchXPConfig.ts:103-119` (`XP_LEVEL_CONFIG`)

---

## Lab Management

### Lab Types (5 Tiers)

| Lab Type | Queue Slots | Active Slots | Parallel | Speed Multiplier | Cost Reduction |
|----------|-------------|--------------|----------|-----------------|----------------|
| **Standard** (Level 1-2) | 1-2 | 1-2 | 1 | 1.0-1.2x | 0-5% |
| **Advanced** (Level 3) | 3 | 2 | 2 | 1.5x | 15% |
| **Elite** (Level 5) | 5 | 3 | 3 | 2.0x | 30% |
| **Ancient** (Level 8) | 10 | 5 | 5 | 3.0x | 50% |
| **Megastructure** (Level 12) | 20 | 10 | 10 | 5.0x | 70% |

> **Source:** `shared/config/researchQueueConfig.ts:153-361` (`LAB_TIERS`)

### Research Bonuses

| Bonus | Type | Speed | Cost Reduction | Duration |
|-------|------|-------|----------------|----------|
| Commander's Insight | Permanent | +25% | +10% | - |
| Technological Breakthrough | Temporary | +100% | +50% | 10 turns |
| Lab Upgrade Complete | Permanent | +15% | +20% | - |
| Knowledge Accumulation | Stackable | +5%/stack | +2%/stack | - |

> **Source:** `shared/config/researchQueueConfig.ts:367-429` (`RESEARCH_BONUSES`)

### Government Research Bonuses

| Government | Speed Bonus | Cost Reduction | Experimental Chance |
|------------|-------------|----------------|---------------------|
| Democracy | +10% | +5% | +5% |
| Autocracy | +20% | - | +10% |
| Theocracy | +5% | +15% | - |
| Corporate | - | +25% | +15% |
| Rebellion | +15% | +10% | +20% |

> **Source:** `shared/config/researchQueueConfig.ts:568-603` (`GOVERNMENT_RESEARCH_BONUSES`)

### Queue Rules

- **Max queue items:** 20
- **Queue storage allowed:** Yes
- **Reorder allowed:** Yes (5% cost)
- **Priority multipliers:** low (0.8x), normal (1.0x), high (1.5x), critical (2.5x)
- **Costs locked when queued**

> **Source:** `shared/config/researchQueueConfig.ts:538-562` (`RESEARCH_QUEUE_RULES`)

### Research Acceleration

| Speed | Cost Multiplier |
|-------|-----------------|
| 25% faster | 1.5x |
| 50% faster | 3.0x |
| 75% faster | 6.0x |
| Instant | 10.0x |

Minimum time remaining: 2 turns. Max speedups per tech: 5.

> **Source:** `shared/config/researchQueueConfig.ts:480-501` (`RESEARCH_ACCELERATION`)

### Research Failure & Retry

Base failure rates by class:
```
basic: 2% | standard: 5% | advanced: 10% | military: 15%
experimental: 30% | ancient: 20% | exotic: 40%
```

Failure penalties: 50% resource loss, 75% time wasted, 5% reliability drop. Retry bonus: +10% per retry (max 3 retries).

> **Source:** `shared/config/researchQueueConfig.ts:507-532` (`RESEARCH_FAILURE`)

---

## Custom Labs

### Lab Sizes

| Size | Capacity | Slots | Speed Bonus | Upgrade Cost |
|------|----------|-------|-------------|--------------|
| Small | 1 | 3 | - | 10,000 |
| Medium | 3 | 6 | +5% | 50,000 |
| Large | 5 | 10 | +10% | 150,000 |
| Massive | 8 | 15 | +15% | 500,000 |

### Specializations

| Specialization | Speed | Discovery | Cost Reduction |
|----------------|-------|-----------|----------------|
| Balanced | - | - | - |
| Experimental | +15% | +25% | - |
| Economic | - | - | +20% |
| Military | +10% | +10% | +5% |
| Biotechnology | +8% | +15% | +5% |

### Lab Modules

| Module | Speed Bonus | Cost per Level | Max Level |
|--------|-------------|----------------|-----------|
| Quantum Reactor | +20% | 100,000 | 5 |
| Synthesis Chamber | +15% discovery | 80,000 | 4 |
| Data Nexus | +10% speed, +10% discovery | 75,000 | 5 |
| Power Grid | +15% cost reduction | 60,000 | 3 |
| Reinforced Structure | +2 capacity | 50,000 | 3 |

### Staff Positions

| Position | Salary | Speed Bonus | Unlock At |
|----------|--------|-------------|-----------|
| Director | 5,000 | +10% | 10 research |
| Senior Researcher | 3,000 | +7% | 5 research |
| Junior Researcher | 1,000 | +3% | 0 |
| Technician | 800 | +5% cost reduction | 3 research |

> **Source:** `shared/config/customLabConfig.ts`

---

## Research Trading

### Trade Types

- `research_for_research` - Exchange research progress
- `research_for_xp` - Trade research for XP
- `research_for_credits` - Trade research for credits
- `xp_for_credits` - Convert XP to credits
- `tech_package` - Complete tech branch exchange
- `bulk_trade` - Large volume trades
- `milestone_trade` - Milestone completion trades

### Trade Limits

| Limit | Value |
|-------|-------|
| Max trades per day | 10 |
| Max pending trades | 5 |
| Max XP per trade | 50,000 |
| Max credits per trade | 1,000,000 |
| Min research age | 3 days |
| Trade expiration | 48 hours |
| Cooldown between trades | 5 minutes |
| Min account age | 7 days |
| Min player level | 5 |

### Trade Fees

- XP transfer fee: 5%
- Credit transfer fee: 3%
- Trade posting fee: 100 credits

### Trust System

- Initial trust score: 50
- Successful trade: +5
- Cancelled trade: -10
- Rejected trade: -3
- Dispute resolution: -20
- Trust decay: -0.5/day inactive

### Fairness Detection

- Trades below 50% fairness ratio are flagged as rip trades
- Maximum imbalance ratio: 1.5x
- Auto-blacklist after 3 disputes

> **Source:** `shared/config/researchTradingConfig.ts`

---

## Knowledge Library & Technology Operations

### Knowledge Library Structure

The knowledge library contains **240 research programs** and **240 technology systems** organized across 18 categories:

1. Fundamental Sciences
2. Applied Engineering
3. Energy & Power Systems
4. Materials Science
5. Propulsion & Navigation
6. Weapons & Ordnance
7. Defense & Shielding
8. Computing & AI
9. Biological Sciences & Genetics
10. Medical & Life Sciences
11. Dimensional Physics
12. Quantum Mechanics
13. Stellar & Astrophysics
14. Planetary & Environmental Sciences
15. Social & Economic Sciences
16. Military Tactics & Strategy
17. Espionage & Intelligence
18. Xenobiology & Alien Studies

Each category contains 2 sub-categories (32 total).

> **Source:** `shared/config/researchTechnologyLibraryConfig.ts:242-387` (`RESEARCH_TECH_CATEGORIES`)

### Tier System (99 Tiers)

| Tier Range | Class | Title Examples |
|------------|-------|----------------|
| 1-10 | Foundational | Laboratory Assistant, Junior Researcher |
| 11-20 | Novice | Researcher, Senior Researcher |
| 21-30 | Apprentice | Lead Researcher, Research Specialist |
| 31-40 | Advanced | Research Director, Chief Scientist |
| 41-50 | Expert | Research Principal, Master Scientist |
| 51-60 | Master | Science Division Head, Grand Theorist |
| 61-70 | Grandmaster | Distinguished Fellow, Legendary Innovator |
| 71-80 | Legendary | Arcane Scholar, Mythic Researcher |
| 81-90 | Mythic | Cosmic Theorist, Transcendent Mind |
| 91-99 | Transcendent | Omniscient Sage |

> **Source:** `shared/config/researchTechnologyLibraryConfig.ts:690-742`

### Level System (999 Levels)

XP curve uses increasing multipliers:
- Levels 1-10: 1.05x multiplier (~100-163 XP per level)
- Levels 11-50: 1.08x multiplier
- Levels 51-100: 1.10x multiplier
- Levels 101-200: 1.12x multiplier
- Levels 201-400: 1.14x multiplier
- Levels 401-700: 1.16x multiplier
- Levels 701-999: 1.18x multiplier

Milestones every 100 levels unlock special rewards.

> **Source:** `shared/config/researchTechnologyLibraryConfig.ts:848-894`

### Knowledge Operations

The operations system generates:

- **240 KnowledgeCatalogEntry** records (research domain)
- **240 KnowledgeCatalogEntry** records (technology domain)
- **30 Research Job Roles** (6 job classes, 12 job families)
- **30 Technology Job Roles**
- **48 Knowledge Support Units** (6 unit frames × 4 tiers × 2 domains)

Each entry includes yield profiles, mechanics bundles, linked jobs/units, and effect summaries.

> **Source:** `shared/config/researchTechnologyOperationsConfig.ts:687-736`

### Knowledge Output Calculation

```typescript
calculateKnowledgeOutput(entry, assignedJobs, assignedUnits, facilityLevel)
// Returns: { throughputPerCycle, discoveryPerCycle, readinessPerCycle, upkeepPerCycle, riskPressure }
```

> **Source:** `shared/config/researchTechnologyOperationsConfig.ts:778-801`

---

## Recommendations System

The recommendations engine analyzes player progression and suggests optimal research paths:

| Endpoint | Description |
|----------|-------------|
| `GET /api/research/recommendations` | Top recommendations for player |
| `POST /api/research/recommendations/path` | Research path to a goal tech |
| `POST /api/research/recommendations/optimize-queue` | Optimal queuing order |
| `GET /api/research/recommendations/strategy` | Strategic analysis |

The engine builds a tech catalog from the research database, calculates prerequisites and unlock chains, scores recommendations based on player state, and provides queue optimization.

> **Source:** `server/routes-recommendations.ts`
> **Source:** `server/services/researchRecommendationsService.ts`

---

## API Endpoints

### Research Tree (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/tree/stats` | Overall tree statistics |
| GET | `/api/research/tree/branches` | List all 11 branches |
| GET | `/api/research/tree/branch/:branchId` | Get techs in a branch |
| GET | `/api/research/tech/:techId` | Full technology details |
| GET | `/api/research/tech/path/:fromId/:toId` | Research path calculation |
| GET | `/api/research/search?q=query&rarity=X` | Search by name/description |
| GET | `/api/research/available?playerLevel=X` | Filter by player level |
| GET | `/api/research/rarity/:rarity` | Filter by rarity |
| POST | `/api/research/calculate-cost` | Calculate research cost |
| GET | `/api/research/starter-techs` | Starting technologies |

> **Source:** `server/routes-research.ts`

### Lab Management (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/labs` | Get available labs |
| GET | `/api/research/labs/active` | Get active lab |
| POST | `/api/research/labs/switch` | Switch active lab |
| GET | `/api/research/queue` | Get research queue |
| POST | `/api/research/queue/add` | Add to queue |
| POST | `/api/research/queue/remove` | Remove from queue |
| POST | `/api/research/queue/reorder` | Reorder queue |
| POST | `/api/research/queue/pause` | Pause research |
| POST | `/api/research/queue/resume` | Resume research |
| POST | `/api/research/accelerate` | Accelerate research |

> **Source:** `server/routes-researchlab.ts`

### Research XP (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/xp/stats` | Player XP stats |
| POST | `/api/research/xp/add` | Add XP |
| POST | `/api/research/xp/complete-research` | Complete research + XP |
| GET | `/api/research/discoveries` | Recent discoveries |
| GET | `/api/research/leaderboard` | XP leaderboard |
| GET | `/api/research/xp/config` | XP configuration (public) |
| GET | `/api/research/xp/next-level-info` | Next level info |
| POST | `/api/research/xp/check-discovery` | Check discovery chance |

> **Source:** `server/routes-researchxp.ts`

### Recommendations (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/recommendations` | Top recommendations |
| POST | `/api/research/recommendations/path` | Path to goal tech |
| POST | `/api/research/recommendations/optimize-queue` | Optimize queue |
| GET | `/api/research/recommendations/strategy` | Strategy analysis |

> **Source:** `server/routes-recommendations.ts`

### Custom Labs (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/labs/create` | Create new lab |
| GET | `/api/labs` | Get all labs |
| GET | `/api/labs/:labId` | Lab details |
| POST | `/api/labs/:labId/upgrade` | Upgrade lab |
| POST | `/api/labs/:labId/modules` | Add module |
| POST | `/api/labs/:labId/staff` | Hire staff |

> **Source:** `server/routes-customlabs.ts`

---

## Server Services

| Service | Description |
|---------|-------------|
| `ResearchLabService` | Lab management, research queuing, acceleration, diagnostics |
| `ResearchRecommendationsService` | Tech catalog building, path finding, queue optimization, strategy analysis |
| `ResearchTradingService` | Player-to-player trading, trade validation, fairness scoring, dispute resolution |
| `ResearchXPService` | XP accumulation, leveling, discovery mechanics |
| `CustomLabService` | Lab creation, upgrades, modules, staff management |

> **Source:** `server/services/researchLabService.ts`
> **Source:** `server/services/researchRecommendationsService.ts`
> **Source:** `server/services/researchTradingService.ts`
> **Source:** `server/services/researchXPService.ts`

---

## Database Schema

### Core Research Tables

**`research_areas`** - Top-level research areas
- `id` (varchar, PK)
- `area_name` (varchar)
- `description` (text)

> **Source:** `shared/schema.ts:647-652`

**`research_subcategories`** - Subcategories within areas
- `id` (varchar, PK)
- `area_id` (varchar, FK -> research_areas)
- `subcategory_name` (varchar)

> **Source:** `shared/schema.ts:656-661`

**`research_technologies`** - Individual technologies
- `id` (varchar, PK)
- `subcategory_id` (varchar, FK -> research_subcategories)
- `tech_name` (varchar)
- `description` (text)
- `requirements` (jsonb)
- `effects` (jsonb)

> **Source:** `shared/schema.ts:665-673`

**`player_research_progress`** - Player research state
- `id` (varchar, PK)
- `user_id` (varchar, FK -> users, CASCADE)
- `technology_id` (varchar, FK -> research_technologies)
- `status` (varchar, default: "available")
- `progress` (integer, default: 0)

> **Source:** `shared/schema.ts:677-685`

### Trading Tables

**`research_trades`** - Trade records
- `id`, `initiator_id`, `recipient_id`, `status`
- `initiator_offer` (jsonb), `recipient_offer` (jsonb)
- `created_at`, `expires_at`, `completed_at`
- `dispute_id`, `dispute_status`

**`research_trade_ratings`** - Trader ratings

**`research_trade_blocks`** - Player block list

**`research_trade_disputes`** - Dispute records

> **Source:** `server/services/researchTradingService.ts:55-100`

---

## Client-Side Pages

| Page | File | Description |
|------|------|-------------|
| **Research** | `client/src/pages/Research.tsx` | Main research page with technology divisions, Kardashev upgrades, and research areas |
| **Research Lab** | `client/src/pages/ResearchLab.tsx` | Lab management interface for queues, bonuses, staff, and research acceleration |
| **TechTree** | `client/src/pages/TechTree.tsx` | Full tech tree browser with OGame-style buildings, ships, and research |
| **Research Analytics Dashboard** | `client/src/pages/ResearchAnalyticsDashboard.tsx` | Statistics, insights, XP trends, discovery history, and leaderboard |
| **Knowledge Library** | `client/src/pages/KnowledgeLibrary.tsx` | Browse 480 knowledge entries, jobs, units, and calculate output |

> **Source:** `client/src/pages/Research.tsx`
> **Source:** `client/src/pages/ResearchLab.tsx`
> **Source:** `client/src/pages/TechTree.tsx`
> **Source:** `client/src/pages/ResearchAnalyticsDashboard.tsx`
> **Source:** `client/src/pages/KnowledgeLibrary.tsx`

### Client Libraries

| Library | File | Description |
|---------|------|-------------|
| `researchTechnologyTreeCatalog` | `client/src/lib/researchTechnologyTreeCatalog.ts` | Research tree node definitions, categories, and upgrade snapshots |
| `technologyTypes` | `client/src/lib/technologyTypes.ts` | Technology type definitions, rarity system, effects, synergies, and stats |
| `technologyDivisionCatalog` | `client/src/lib/technologyDivisionCatalog.ts` | Technology division definitions, systems, and upgrade snapshots |

> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts`
> **Source:** `client/src/lib/technologyTypes.ts`
> **Source:** `client/src/lib/technologyDivisionCatalog.ts`

---

## Rarity Distribution

| Rarity | Discovery Bonus | Description |
|--------|----------------|-------------|
| Common | 0% | Base techs, widely available |
| Uncommon | +5% | Enhanced variants |
| Rare | +10-15% | Specialized configurations |
| Epic | +25% | Powerful combinations |
| Legendary | +30-50% | Faction-specific / ultra-rare |
| Mythic | +100% | Reality-bending discoveries |

> **Source:** `shared/config/technologyTreeConfig.ts:108-111` (`rarity`, `discoveryBonus` fields)

---

## System Statistics

| Metric | Value |
|--------|-------|
| Total base technologies | ~900+ (hand-crafted) |
| Total expanded technologies | ~2,453+ (procedurally generated) |
| Custom/experimental technologies | 4 categories |
| Knowledge library entries | 480 (240 research + 240 technology) |
| Knowledge jobs | 60 (30 research + 30 technology) |
| Knowledge support units | 48 |
| Research branches | 11 base + 13 progression |
| Library categories | 18 |
| Library sub-categories | 32 |
| Tech tiers | 99 |
| Tech levels | 999 |
| API endpoints | 30+ |
| Database tables | 8+ research-related |
| Client pages | 5 |
