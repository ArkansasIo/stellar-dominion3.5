# Universe Civilization: Empires at War

## Game Design Document

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Status:** Draft  
**Classification:** Internal — Design Reference  

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Universe & Galaxy System](#2-universe--galaxy-system)
3. [Empire & Player Systems](#3-empire--player-systems)
4. [Colony & Building System](#4-colony--building-system)
5. [Research & Technology System](#5-research--technology-system)
6. [Ship & Fleet System](#6-ship--fleet-system)
7. [Combat System](#7-combat-system)
8. [Economy & Trading System](#8-economy--trading-system)
9. [Crafting & Blueprint System](#9-crafting--blueprint-system)
10. [Diplomacy & Alliance System](#10-diplomacy--alliance-system)
11. [Espionage & Intelligence System](#11-espionage--intelligence-system)
12. [Missions & Campaign System](#12-missions--campaign-system)
13. [Events & Seasons](#13-events--seasons)
14. [Achievements & Rankings](#14-achievements--rankings)
15. [Economy Balance](#15-economy-balance)
16. [UI/UX Design Guidelines](#16-uiux-design-guidelines)

---

## 1. Executive Overview

### 1.1 Game Identity

**Title:** Universe Civilization: Empires at War  
**Acronym:** UCEW  
**Tagline:** *Build. Explore. Conquer. Transcend.*  
**Genre:** Sci-fi MMORPG / 4X Strategy / Persistent Browser Game  
**Platform:** Web browser (HTML5/JavaScript/WebAssembly) — cross-platform (desktop, tablet, mobile)  
**Engine:** Custom server-authoritative stack with WebSocket real-time updates  
**Target Market:** Global, English-first with localization roadmap  

### 1.2 Vision Statement

*Universe Civilization: Empires at War* is a persistent massively multiplayer online strategy game where players begin with a single homeworld and expand across 90 procedurally generated universes through exploration, colonization, diplomacy, warfare, economics, and scientific advancement. Every action shapes the persistent universe. Alliances rise and fall. Empires are born and shattered. The cosmos is a canvas for infinite strategic possibility.

### 1.3 Target Audience

| Segment | Example Games | Key Motivations |
|---------|--------------|-----------------|
| 4X Strategists | Stellaris, Master of Orion | Deep systems, tech trees, empire management |
| PvP Tacticians | EVE Online, Star Conflict | Fleet combat, territory control, alliances |
| Persistent Browser Gamers | OGame, Travian, Ikariam | Asynchronous play, long-term progression |
| Sci-Fi Enthusiasts | Any space-themed media | Immersion, lore, exploration |
| Collectors & Completionists | Any with progression systems | Achievements, ranks, blueprints, ships |

### 1.4 Core Gameplay Loop

Login → Collect Resources → Manage Colonies → Build Structures →
Research Technologies → Train Ships → Build Fleets → Explore →
Expand Territory → Trade → Diplomatic Actions → Combat →
Upgrade → Repeat (with increasing scale and complexity)

The loop operates on multiple time scales:
- **Micro (minutes):** Queue management, resource collection, message reading, market orders
- **Meso (hours-days):** Building construction, ship production, research completion, fleet travel
- **Macro (weeks-months):** Empire expansion, alliance warfare, technological eras, seasonal progression

### 1.5 Game Pillars (4X Framework)

| Pillar | Definition | Core Mechanics |
|--------|-----------|----------------|
| **eXploration** | Discover the unknown | Scan solar systems, probe anomalies, chart jump gates, uncover ancient ruins |
| **eXpansion** | Claim and develop territory | Colonize planets, establish outposts, control systems, annex territories |
| **eXploitation** | Extract and utilize resources | Mine planets, refine materials, establish trade routes, optimize production chains |
| **eXtermination** | Eliminate opposition | Fleet combat, planetary invasions, orbital bombardment, espionage, war |

### 1.6 Monetization Model

**Philosophy:** Optional premium — No pay-to-win. All gameplay-critical items, ships, and upgrades are attainable through gameplay alone.

**Revenue Streams:**
- **Premium Subscription ($9.99/month):** +1 building queue, +10% resource production, reduced research times, exclusive cosmetics
- **Cosmetic Marketplace:** Ship skins, planet skins, UI themes, name colors, portrait frames
- **Convenience Items:** Instant building completion (limited per day), queue slots, fleet slots
- **Blueprint Packs:** Cosmetic/tier-limited blueprints (never exclusive meta items)
- **Season Pass ($14.99/season):** Premium reward track with exclusive cosmetics and convenience items

**Explicitly NOT for Sale:**
- Stat-boosting items or ships that cannot be earned in-game
- Pay-to-win resource packages
- Exclusive overpowered technologies
- Time-gated content that bypasses skill

### 1.7 Technical Architecture Overview

- **Backend:** Node.js (TypeScript) microservices, PostgreSQL, Redis, RabbitMQ
- **Frontend:** React/Next.js with WebSocket real-time updates
- **Tick System:** Server tick every 100ms for combat, 1s for economy, 60s for simulation
- **Persistence:** Continuous, no server wipes (except designated seasonal realms)
- **Scalability:** Horizontal sharding by universe, Galaxy Group partitioning

---

## 2. Universe & Galaxy System

### 2.1 Universe Hierarchical Structure

The game world is organized in a strict hierarchy:

```
Universe Civilization (Metaverse)
├── Realm System (9 total)
│   ├── Universe (10 per realm = 90 total)
│   │   ├── Galaxy (3-11 per universe)
│   │   │   └── Solar System (499 per galaxy)
│   │   │       ├── Star (1)
│   │   │       ├── Planets (2-15)
│   │   │       │   └── Moons (0-5 per planet)
│   │   │       ├── Asteroid Belts (0-3)
│   │   │       └── Special Objects (0-2)
│   │   └── Wormhole Network (connections between systems)
│   └── Inter-Universal Connections (wormholes, jump gates)
└── Celestial Void (unexplored space between realms)
```

**Total Celestial Bodies:**
- 90 universes × ~7 galaxies avg × 499 systems = ~314,370 solar systems
- ~314,370 systems × ~8 planets avg = ~2,514,960 planets
- ~2,514,960 planets × ~1.5 moons avg = ~3,772,440 moons
- Total: ~6.6 million colonizable/settleable bodies

### 2.2 Realm System Organization

The 9 realm systems partition the metaverse into thematic and governance regions:

| # | Realm System | Theme | Difficulty | Speed | Type | Unique Mechanic |
|---|-------------|-------|------------|-------|------|-----------------|
| 1 | **Nexus Crown** | Capital realm, balanced | Normal | 1.0x | Permanent | +10% diplomacy bonus |
| 2 | **Aurora Reach** | High energy, bright | Easy | 1.2x | Permanent | +15% energy production |
| 3 | **Verdant Expanse** | Rich in life, green | Easy | 1.0x | Permanent | +20% food production |
| 4 | **Crimson Verge** | Volatile, conflict-heavy | Hard | 1.5x | Seasonal | +25% combat damage |
| 5 | **Oblivion Gate** | Dead space, high risk/reward | Very Hard | 2.0x | Seasonal | Double loot, double losses |
| 6 | **Celestial Arc** | Ancient tech remnants | Normal | 1.0x | Permanent | +15% research speed |
| 7 | **Void Walker** | Unstable space, anomalies | Hard | 1.3x | Seasonal | Random anomaly events |
| 8 | **Iron Dominion** | Industrial, fortified | Normal | 1.0x | Permanent | +15% building speed |
| 9 | **Eternal Edge** | Frontier space | Normal | 1.0x | Permanent | +20% exploration rewards |

**Realm Types:**
- **Permanent:** Never reset. Persistent forever. Primary home for players.
- **Seasonal:** Reset every 3-6 months. Accelerated gameplay. Competitive leaderboards. Winners earn trophies transferred to home realm.
- **Event:** Temporary (2-8 weeks). Special rules. Unique rewards.

### 2.3 Universe Properties

Each of the 90 universes has the following properties:

| Property | Range | Description |
|----------|-------|-------------|
| Universe ID | UC-001 to UC-090 | Unique identifier |
| Realm | 1-9 | Parent realm system |
| Name | Procedurally generated | E.g., "Andromeda's Veil" |
| Difficulty | 0.5x - 3.0x | Resource multiplier, NPC aggression |
| Age | 1-10 (billion years) | Affects star/planet distribution |
| Size Class | Dwarf (3 galaxies), Medium (7), Giant (11) | Number of galaxies |
| Stability | 0.0 - 1.0 | Wormhole reliability, event frequency |
| Wealth | 0.0 - 2.0 | Resource abundance multiplier |
| Conflict | 0.0 - 2.0 | Pirate activity, NPC aggression |
| Anomaly | 0.0 - 2.0 | Special event frequency |
| Tech Level | 1-10 | Base technology available |
| Wormhole Density | 0-100 | Connections per system on average |

### 2.4 Galaxy Generation

Each galaxy within a universe contains exactly 499 solar systems arranged in a spiral formation.

**Galaxy Spiral Generation Algorithm (Pseudo-code):**

```
function generateGalaxy(seed, universeProps):
    rng = seededRNG(seed)
    galaxy = new Galaxy()
    galaxy.systems = []
    
    // Spiral arm parameters
    arms = rng.int(2, 5)
    armAngle = 360 / arms
    armWinding = rng.float(0.3, 0.8)
    
    centerX, centerY = 10000, 10000
    
    for i in range(499):
        arm = i % arms
        distanceFactor = (i / 499) * 0.9 + 0.1
        
        angle = (arm * armAngle) + (distanceFactor * 360 * armWinding)
        distance = distanceFactor * 9000
        
        angle += rng.float(-15, 15) * (1 - distanceFactor + 0.1)
        distance += rng.float(-500, 500)
        
        x = centerX + cos(angle) * distance
        y = centerY + sin(angle) * distance
        
        system = generateSolarSystem(i+1, x, y, seed+i, universeProps)
        galaxy.systems.append(system)
    
    galaxy.wormholes = generateWormholeNetwork(galaxy, universeProps.wormholeDensity)
    assignCoordinates(galaxy)
    return galaxy
```

**Coordinate System:** Every solar system is addressed as [Galaxy]:[System]:[Position] (e.g., 3:152:7).

**Galaxy Map Grid:**
- Systems are positioned on a 20000x20000 unit grid
- Distance between systems calculated as Euclidean distance
- Fleet travel time = distance / fleet speed
- Scanner range determined by sensor technology level

### 2.5 Solar System Generation

Each solar system revolves around a star with orbiting planets, moons, and other celestial objects.

**Star Class Properties:**

| Class | Color | Temp (K) | Mass (M☉) | Luminosity (L☉) | Mineral Bonus | Energy Bonus | Frequency |
|-------|-------|----------|-----------|-----------------|---------------|--------------|-----------|
| O | Blue | 30K-50K | 16+ | 30,000+ | +200% | +300% | 0.003% |
| B | Blue-white | 10K-30K | 2.1-16 | 25-30,000 | +150% | +200% | 0.13% |
| A | White | 7.5K-10K | 1.4-2.1 | 5-25 | +100% | +150% | 0.6% |
| F | Yellow-white | 6K-7.5K | 1.04-1.4 | 1.5-5 | +50% | +75% | 3% |
| G | Yellow | 5.2K-6K | 0.8-1.04 | 0.6-1.5 | +25% | +25% | 7.6% |
| K | Orange | 3.7K-5.2K | 0.45-0.8 | 0.08-0.6 | +10% | +10% | 12.1% |
| M | Red | 2.4K-3.7K | 0.08-0.45 | <0.08 | Base | Base | 76.4% |

**Resource Modifier by Star Class:**
`ResourceProduction = BaseProduction × (1 + StarClassBonus × PlanetClassModifier)`

### 2.6 Planet Generation

**Planet Classes:**

| Class | Description | Min Fields | Max Fields | Habitable | Metal | Crystal | Deuterium | Food | Frequency |
|-------|-------------|------------|------------|-----------|-------|---------|-----------|------|-----------|
| **Terran** | Earth-like, optimal | 60 | 80 | Yes | 1.0x | 1.0x | 1.0x | 1.5x | 5% |
| **Oceanic** | Water world | 40 | 55 | Yes | 0.7x | 1.3x | 1.5x | 2.0x | 5% |
| **Continental** | Mixed terrain | 55 | 75 | Yes | 1.1x | 1.1x | 1.0x | 1.3x | 8% |
| **Arid** | Dry, desert-like | 45 | 65 | Yes | 1.3x | 0.8x | 0.7x | 0.5x | 10% |
| **Tundra** | Cold, icy | 40 | 60 | Yes | 1.2x | 0.9x | 1.3x | 0.4x | 10% |
| **Gas Giant** | No solid surface | 10 | 25 | No | 0.5x | 2.0x | 3.0x | 0.0x | 15% |
| **Barren** | Rocky, no atmosphere | 20 | 40 | No | 1.5x | 0.5x | 0.3x | 0.0x | 15% |
| **Lava** | Volcanic, extreme heat | 15 | 35 | No | 2.0x | 0.3x | 0.1x | 0.0x | 8% |
| **Ice** | Frozen, cryogenic | 20 | 40 | No | 0.6x | 1.5x | 2.0x | 0.0x | 12% |
| **Desert** | Sandy, extreme temp swing | 30 | 50 | No | 1.4x | 0.6x | 0.5x | 0.1x | 12% |

**Colonization Cost by Planet Class:**
`ColonizationCost = BaseCost × PlanetClassMultiplier`

Multipliers: Terran=1.0, Oceanic=1.2, Continental=1.1, Arid=1.5, Tundra=1.8, Gas Giant=5.0, Barren=2.0, Lava=3.0, Ice=2.5, Desert=1.5

### 2.7 Moon Generation

**Moon Types:**

| Type | Diameter (km) | Fields | Metal | Crystal | Deuterium | Special Chance |
|------|--------------|--------|-------|---------|-----------|----------------|
| Rocky | 500-3,000 | 5-15 | 1.2x | 0.8x | 0.5x | 5% |
| Volcanic | 800-4,000 | 8-20 | 1.5x | 0.5x | 0.3x | 10% |
| Ice | 600-3,500 | 4-12 | 0.5x | 1.0x | 2.0x | 8% |
| Ocean | 1,000-4,500 | 6-18 | 0.3x | 1.5x | 1.5x | 15% |
| Barren | 300-2,000 | 2-8 | 1.0x | 0.5x | 0.3x | 3% |

**Moon Special Properties:**
- **Crystal Caverns:** +50% crystal production on parent planet
- **Ancient Battery:** Stores 10% of overflow energy
- **Sensor Array:** Doubles scanner range in the system
- **Wormhole Anchor:** Creates a stable wormhole to a random system
- **Ship Graveyard:** 5% chance/day to find random ship blueprint
- **Living Ocean:** +25% food production, unique aquatic research options

### 2.8 Special Celestial Objects

**Asteroid Belts:** 30% of systems contain 1-3 belts. Yield 100-10,000 units per harvest. 24h cooldown. 2% chance for rare blueprints.

**Nebulae:** 5% of systems. -50% scanner accuracy, +25% deuterium production. -30% shield regeneration in combat. +50% research from observatory.

**Black Holes:** 1% of systems. 3x fuel consumption. 50% slower fleet speed. 5% ship destruction on failed escape. 2x research speed. Ships at position 1 are destroyed.

**Ancient Ruins:** 3% of systems. Exploration time 12-72h. Rewards: Blueprints (30%), Tech boost (25%), Resources (25%), Artifacts (15%), Nothing (5%).

**Jump Gates:** Player-built; 0.5% natural occurrence. Instant travel between paired gates. Build Cost: 10M metal, 5M crystal, 2M deuterium. Build Time: 14 days. 10K deuterium/day upkeep. Max 10 gates per player.

### 2.9 Wormhole Network

| Type | Stability Range | Travel Reduction | Max Mass | Decay Rate | Special |
|------|----------------|-----------------|----------|------------|---------|
| Stable | 0.7-1.0 | 70-100% | 5K-10K | 0.001-0.005 | Reliable |
| Unstable | 0.2-0.7 | 20-70% | 1K-5K | 0.005-0.05 | May collapse |
| Ancient | 0.5-0.9 | 50-90% | 8K-15K | 0.001-0.01 | Discoverable via research |
| Artificial | 0.8-1.0 | 80-100% | 10K-20K | 0.0001-0.001 | Player-built |

Travel time reduction formula: `TravelTimeReduction = Stability × 0.9 + 0.1` (10-100% reduction of normal travel time).

---

## 3. Empire & Player Systems

### 3.1 Player Progression: Ranks

| Rank | Title | XP Required | Unlocks |
|------|-------|-------------|---------|
| 1 | Commander | 0 | Basic buildings, 1 colony |
| 2 | Fleet Captain | 10,000 | Frigates, 2 colonies, espionage |
| 3 | Star Lord | 60,000 | Cruisers, 3 colonies, alliances |
| 4 | Sector Governor | 260,000 | Battleships, 5 colonies, market |
| 5 | System Overlord | 1,060,000 | Carriers, 10 colonies, federation |
| 6 | Nebula Prince | 4,060,000 | Dreadnoughts, 20 colonies, terraforming |
| 7 | Galactic Emperor | 16,060,000 | Titans, 50 colonies, jump gates |
| 8 | Cosmic Emperor | 64,060,000 | Juggernauts, 100 colonies, realm travel |
| 9 | Celestial God | 264,060,000 | Motherships, 500 colonies, inter-realm |
| 10 | Supreme Dominion Lord | 1,264,060,000 | Flagships, 1,000 colonies, all systems |

**XP Gain Sources:**
- Resource collected: 1 XP per 10,000 units
- Buildings constructed: 100 XP × building level
- Research completed: 500 XP × tech level
- Ships built: 10 XP × ship base cost / 1000
- Combat victory: 1000 XP × enemy fleet power / 10000
- Planet colonized: 5000 XP
- Mission completed: 100-500,000 XP
- Achievement earned: 5,000-500,000 XP
- PvP kill: 5% of opponent's XP value

**Rank Benefits:**
- Each rank adds +1 to max building queue
- Each rank adds +5% resource production
- Each rank adds +1 to max concurrent fleets
- Each rank adds +5 to max colony count
- Higher ranks unlock ship classes and technologies

### 3.2 Experience & Leveling

**Max Level:** 999
**XP Formula:** `XP(level N) = floor(1000 × N^1.5)`

- Level 10: 31,622 XP
- Level 50: 353,553 XP
- Level 100: 1,000,000 XP
- Level 500: 11,180,339 XP
- Level 999: 31,606,960 XP

**Level Perks (every 10 levels):**
- +1% resource production
- +1% fleet attack power
- +1% defense power
- +1 to max building queue (up to 20)

### 3.3 Empire Types

| Empire Type | Focus | Bonus | Penalty |
|-------------|-------|-------|---------|
| **Technocracy** | Research | +25% research speed | -10% ship hull HP |
| **Militaristic** | Combat | +20% ship attack | -15% research speed |
| **Commercial** | Economy | +20% trade income, -10% market fees | -10% ship defense |
| **Industrial** | Production | +20% building speed, +15% resource output | -10% espionage defense |
| **Expansionist** | Colonization | -30% colonization cost, +2 max colonies per rank | -10% ship armor |
| **Diplomatic** | Diplomacy | +30% alliance bonuses, +1 envoy | -10% fleet power |
| **Spiritual** | Population | +25% population growth, +20% happiness | -10% research speed |
| **Balanced** | All-rounder | +5% to all categories | No penalty |

### 3.4 Government Forms

| Government | Unlock | Effect |
|------------|--------|--------|
| **Autocracy** | Default | +10% building speed, -10% happiness |
| **Democracy** | Social Paradigm Lv.3 | +15% research speed, -5% building speed |
| **Theocracy** | Social Paradigm Lv.5 | +25% population growth, -10% resource production |
| **Oligarchy** | Social Paradigm Lv.8 | +20% trade income, +10% corruption |
| **Meritocracy** | Social Paradigm Lv.10 | +10% all production, -10% population growth |
| **Hive Mind** | Psychic Network Lv.5 | +30% efficiency, -50% diplomacy |
| **Corporatocracy** | Galactic Commerce Lv.6 | +40% trade income, +15% corruption |
| **Military Junta** | Military Doctrine Lv.8 | +25% fleet power, -20% research speed |
| **Synthetic Collective** | AI Consciousness Lv.10 | +50% building speed, no population, -50% food production |
| **Galactic Empire** | Imperial Mandate Lv.12 | +15% all stats, +25% influence cost, +50% war weariness |

### 3.5 Race/Civilization Selection

| Race | Homeworld Preference | Core Bonus | Special Ability |
|------|---------------------|------------|----------------|
| **Humans** | Terran/Continental | +10% all resources | Adaptive: +5% to any chosen focus |
| **Xylos** | Arid/Desert | +20% metal, +15% energy | Sandstorm Cloak: -30% enemy accuracy in home systems |
| **Aquari** | Oceanic | +30% crystal, +20% food | Tidal Control: +2 fields on oceanic worlds |
| **Krynn** | Tundra/Ice | +25% deuterium, +15% research | Cryogenic Stasis: +15% max population |
| **Ignar** | Lava | +40% metal, +25% energy | Magma Forge: +20% ship build speed |
| **Verdani** | Terran/Continental | +30% food, +25% population | Symbiosis: +0.5% resource production per 1M population |
| **Chimera** | Gas Giant (floating) | +20% crystal, +30% deuterium | Gas Harvesters: Can build mines on gas giants without tech |

### 3.6 Population Simulation

**Population Capacity:**
`MaxPopulation = BaseCapacity × (1 + HousingBonus%) × PlanetClassMultiplier × TechMultiplier`
`BaseCapacity = PlanetDiameter² × π × 0.1 / 100000`

**Population Growth:**
`GrowthRate = 0.01 × BirthRate × MigrationModifier × HappinessModifier × HealthModifier`
`BirthRate = 0.5 + (FoodSurplus / (Population × 10))`
`MigrationModifier = (Happiness - 50) / 100`
`HappinessModifier = Happiness / 100`
`HealthModifier = 1.0 - (Crime / 200)`

**Population Death:**
`DeathRate = 0.005 × (1 - HealthModifier) × (1 + PollutionModifier)`
`HealthModifier = HospitalLevel × 0.05`
`PollutionModifier = TotalBuildings × 0.001`

**Happiness:**
`Happiness = clamp(0, 200, BaseHappiness + Modifiers)`

Happiness Modifiers:
- Per building on planet: -0.5
- Per military unit: -0.1
- Each resource deficit: -10
- Food surplus per 1000 pop: +1
- Entertainment building level: +2 per level
- Crime level: -Crimerate × 0.5
- Tax rate > 30%: -(TaxRate - 30) × 1.5

Happiness Effects:
- 0-25: Rebellion risk (5% base), -50% production
- 26-50: Unrest, -25% production, 1% rebellion risk
- 51-75: Content, no bonuses
- 76-100: Happy, +10% production
- 101-150: Joyful, +20% production, +10% research
- 151-200: Ecstatic, +35% production, +20% research, +1 free building queue

**Crime & Corruption:**
`CrimeRate = 10 × (1 - Happiness/200) × OverpopulationFactor × (1 - SecurityLevel × 0.1)`
`OverpopulationFactor = max(1.0, Population / MaxPopulation × 2)`
`Corruption = (TotalColonies × 0.5 + TotalPopulation × 0.0001) × (1 - GovernmentAntiCorruption)`

### 3.7 Resource System

**Resource Types:**

| Resource | Symbol | Primary Use |
|----------|--------|-------------|
| **Credits** | C | Primary currency, market, fees, taxes |
| **Metal** | M | Ships, buildings, defense |
| **Crystal** | Cry | Electronics, research, advanced ships |
| **Deuterium** | D | Fuel, power, weapons |
| **Energy** | E | Building operations, shields |
| **Food** | F | Population sustenance |
| **Water** | W | Population, terraforming |
| **Alloys** | A | Advanced construction |
| **Research Points** | RP | Technology research |
| **Influence** | I | Diplomacy, claims, policies |

**Resource Production Formulas:**

Metal Mine: `Production = 30 × Level × 1.1^Level × PlanetBonus × StarBonus × EmpireBonus`  
Crystal Plant: `Production = 20 × Level × 1.1^Level × PlanetBonus × StarBonus × EmpireBonus`  
Deuterium Synth: `Production = 10 × Level × 1.1^Level × PlanetBonus × StarBonus × EmpireBonus`  
Solar Plant: `Energy = 20 × Level × 1.1^Level × StarBonus × PlanetBonus`  
Fusion Reactor: `Energy = 50 × Level × 1.2^Level × TechBonus`  
Food Processor: `Food = BaseFarm × Level × 1.1^Level × PlanetBonus × TechBonus`  
Alloy Foundry: `Alloys = 5 × Level × 1.15^Level × TechBonus`

**Storage Capacities:**
`StorageCapacity = BaseStorage × 1.5^StorageLevel × PlanetMultiplier × TechMultiplier`
BaseStorage = 100,000 per resource per colony.

**Resource Production Tick (every 60 seconds):**
- Calculate production - consumption per resource
- If net positive: add to storage (capped at capacity)
- If net negative: deduct from storage; if deficit, apply penalties

**Deficit Penalties:**
- Energy Deficit: All production reduced by (Deficit%/2), defenses at 50%
- Food Deficit: Population decline, happiness -20
- Water Deficit: Happiness -10, population growth -50%
- Metal/Crystal/Deuterium Deficit: Cannot build/queue items requiring that resource

### 3.8 Trade Routes

**Internal Trade Routes:**
`Cost = 10,000M + 5,000Cry + 2,000D` | `Time = 24 hours`
`Capacity = 10,000 × (1 + TradeTechLevel × 0.1) × (1 + CargoShips × 0.05)`

Route Types: Resource Transfer, Balanced Distribution, Concentrate Production

**Logistics Efficiency:**
`Efficiency = 1.0 - (Distance × 0.00001) - (PiracyThreat × 0.1)` (Minimum 0.25)

---

## 4. Colony & Building System

### 4.1 Colony Overview

**Colony Count:** 1-1000 per player (rank-gated)

**Acquisition Methods:**
1. Colony Ship Build: Cost 50K/25K/10K, 12h base
2. Conquest: Capture enemy colony via ground combat
3. Purchase: Buy from another player via marketplace
4. Trade: Exchange colonies with other players
5. Event Reward: Special event colonies

### 4.2 Building Categories

**Resource Buildings:**

| Building | Function | Base Cost (M/Cry/D) | Base Time |
|----------|----------|-------------------|-----------|
| Metal Mine | Produces Metal | 60/15/0 | 1m |
| Crystal Plant | Produces Crystal | 48/24/0 | 1m |
| Deuterium Synthesizer | Produces Deuterium | 225/75/0 | 2m |
| Solar Plant | Produces Energy | 75/30/0 | 1m |
| Fusion Reactor | Produces Energy (uses D) | 900/360/180 | 30m |
| Food Processor | Produces Food | 120/40/0 | 2m |
| Water Purifier | Produces Water | 80/20/0 | 1m |
| Alloy Foundry | Produces Alloys (uses M+Cry) | 500/250/100 | 15m |
| Gas Extractor | Deuterium from Gas Giants | 400/200/100 | 10m |

**Infrastructure Buildings:**

| Building | Function | Base Cost (M/Cry/D) | Base Time |
|----------|----------|-------------------|-----------|
| Metal Storage | +Metal capacity | 2000/0/0 | 5m |
| Crystal Storage | +Crystal capacity | 2000/0/0 | 5m |
| Deuterium Tank | +Deuterium capacity | 2000/0/0 | 5m |
| Underground Storage | +50% all storage | 5000/2500/500 | 1h |
| Robot Factory | +10% building speed per level | 500/250/100 | 30m |
| Nanite Factory | -Level% build time (max -50%) | 1M/500K/100K | 24h |
| Space Dock | Required for larger shipyard | 10K/5K/2K | 2h |
| Orbital Platform | Extra queue (max +3) | 50K/25K/10K | 12h |
| Planetary Shield | Defense vs bombardment | 25K/15K/5K | 6h |

**Military Buildings:**

| Building | Function | Base Cost (M/Cry/D) | Base Time |
|----------|----------|-------------------|-----------|
| Shipyard | Ship construction | 400/200/100 | 30m |
| Defense Platform | Orbital defense | 2000/1000/500 | 1h |
| Missile Silo | Interplanetary missiles | 5000/2500/1000 | 2h |
| Shield Dome | Planetary shield HP | 10000/5000/2000 | 4h |
| Ion Cannon | Ground ion weapon | 8000/4000/1500 | 3h |
| Plasma Turret | Ground plasma weapon | 12000/6000/2000 | 5h |
| Barracks | Ground troop training | 1000/500/200 | 30m |
| Orbital Shipyard | Build capitals (Lv.12 Shipyard req) | 100K/50K/25K | 48h |

**Research Buildings:**

| Building | Function | Base Cost (M/Cry/D) | Base Time |
|----------|----------|-------------------|-----------|
| Research Lab | Research points per hour | 200/400/100 | 30m |
| Observatory | +5% research speed per level | 500/1000/200 | 1h |
| Academy | Officer training capacity | 5000/3000/1000 | 4h |
| Quantum Computer | +10% research speed per level | 10K/20K/5K | 12h |
| Think Tank | Shared research bonus (alliance) | 50K/100K/25K | 48h |

**Special Buildings:**

| Building | Function | Base Cost | Time | Max Level |
|----------|----------|-----------|------|-----------|
| Terraformer | Change planet class | 100K/50K/20K | 72h | 20 |
| Capital | Empire capital designation | 200K/100K/50K | 168h | 1 |
| Death Star | Planet-destroying weapon | 10M/5M/2M | 720h | 1 |
| Jump Gate | System-to-system portal | 5M/2.5M/1M | 336h | 10 |
| Trade Port | Trade route capacity +1 | 20K/10K/5K | 8h | 20 |
| Embassy | Alliance member capacity | 10K/5K/2.5K | 4h | 20 |
| Recycling Plant | Ships deconstruct into 50% resources | 25K/12.5K/5K | 12h | 15 |

### 4.3 Building Cost & Time Formulas

**Cost Scaling:**
`BuildingCost(level) = BaseCost × 1.5^(level - 1)`

**Time Scaling:**
`BuildingTime(level) = BaseTime × 1.4^(level - 1) / (1 + RobotFactoryLevel × 0.1) / (1 + NaniteFactoryLevel × 0.5)`

**Time Examples (1m base):**

| Level | Multiplier | Time |
|-------|-----------|------|
| 1 | 1.0x | 1m |
| 5 | 3.84x | 3m 50s |
| 10 | 20.5x | 20m 30s |
| 15 | 109.7x | 1h 50m |
| 20 | 587.9x | 9h 48m |
| 25 | 3,147x | 52h |

**Practical Maximum Level:** ~35-40 for resource, ~20-25 for military, ~15-20 for special.

**Energy Balance:**
`PlanetEnergyBalance = TotalEnergyProduction - TotalEnergyConsumption`
If negative: all resource production reduced proportionally.

### 4.4 Building Queue System

- Base Queue Slots: 2 per colony
- Additional: +1 per 10 player levels, +1 per rank, +1 from Orbital Platform (max +3)
- Max Queue Slots: 20
- Cancel gives 50% resource refund
- Rush cost = remaining time × resource rate

### 4.5 Colony Specializations

| Specialization | Bonus | Penalty |
|----------------|-------|---------|
| Mining World | +50% metal, +25% crystal | -25% research speed |
| Industrial World | +50% building speed, +30% ship speed | -20% food production |
| Research World | +50% research speed, +25% RP | -20% resource production |
| Military World | +25% ship attack, +25% defense | -30% resource production |
| Agricultural World | +100% food, +50% water | -30% metal production |
| Trade Hub | +50% trade income, +100% route capacity | -20% all production |
| Fortress World | +100% defense HP, +50% shield | -40% resources, -30% research |

### 4.6 Terraforming Mechanics

Terraforming changes planet class. Unlock: Graviton Lv.5.

**Terraforming Path:**
- Barren → Desert → Arid → Continental → Terran
- Ice → Tundra → Continental → Terran
- Lava → Arid → Continental → Terran

**Cost:** `100000 × TargetLevel^1.5`  
**Time:** `24h × (Target - Current) × (1 / TerraformerLevel × 0.5)`  
**Success:** `50% + TerraformerLevel × 2.5%` (capped at 100% at Lv.20)  
**Failure:** Lose 50% invested resources, planet becomes Scarred (-20% production 7 days)

---

## 5. Research & Technology System

### 5.1 Technology Overview

14 distinct tech trees, each with 1-255 levels. Technologies provide passive bonuses, unlock buildings/ships, and enable advanced mechanics.

`RPperHour = ResearchLabLevel × 1.5^Level × PlanetBonus × (1 + ObservatoryLevel × 0.05) × AllianceBonus`

### 5.2 Technology Trees

**Energy Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Energy Technology | 50 | +10% energy production | None |
| Solar Technology | 30 | +10% solar output | Energy Lv.2 |
| Fusion Technology | 40 | +10% fusion output, -5% D use | Energy Lv.5 |
| Anti-Matter | 30 | +15% energy | Energy Lv.10, Fusion Lv.10 |
| Zero-Point Energy | 20 | +20% energy, credit income | Anti-Matter Lv.10 |
| Energy Weapons | 50 | +5% energy weapon damage | Energy Lv.3 |

**Laser Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Laser Technology | 50 | +5% laser damage | None |
| Focused Optics | 30 | +3% laser accuracy | Laser Lv.3 |
| Pulsed Lasers | 40 | +2% laser fire rate | Laser Lv.5 |
| Beam Cannons | 35 | Unlocks beam weapons | Laser Lv.8 |
| Phased Arrays | 25 | +5% shield penetration | Laser Lv.12, Shields Lv.8 |
| X-Ray Lasers | 20 | +10% armor penetration | Laser Lv.15 |
| Gamma Ray Lasers | 15 | +15% damage, 5% crit | Laser Lv.20 |

**Ion Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Ion Technology | 40 | +5% ion damage | Energy Lv.3 |
| Ion Shields | 30 | +5% shield HP vs ion | Ion Lv.3 |
| Ion Propulsion | 25 | +5% engine speed | Ion Lv.5 |
| Ion Cannons | 35 | +5% ion cannon damage | Ion Lv.5 |
| EMP Technology | 25 | +5% EMP chance | Ion Lv.8 |
| Disruptor | 20 | +5% system disruption | Ion Lv.12 |

**Plasma Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Plasma Technology | 40 | +5% plasma damage | Energy Lv.5, Laser Lv.5 |
| Plasma Cannons | 30 | Unlocks plasma weapons | Plasma Lv.3 |
| Plasma Shielding | 25 | +5% plasma resistance | Plasma Lv.5, Shields Lv.5 |
| Plasma Propulsion | 20 | +10% capital ship speed | Plasma Lv.8 |
| Plasma Bombs | 15 | +10% bombardment damage | Plasma Lv.10 |
| Super Plasma | 10 | +25% plasma damage, +10% pen | Plasma Lv.15 |

**Graviton Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Graviton Technology | 30 | Unlocks gravity tech | Energy Lv.8 |
| Gravity Wells | 25 | +5% enemy speed reduction | Graviton Lv.3 |
| Gravity Shields | 20 | +5% shield strength | Graviton Lv.5 |
| Gravity Cannons | 15 | Unlocks gravity weapons | Graviton Lv.8 |
| Terraforming | 20 | -10% terraforming cost/time | Graviton Lv.5 |
| Black Hole Generator | 5 | Creates temp black hole | Graviton Lv.15 |
| Warp Drive | 15 | -5% fleet travel time | Graviton Lv.10, Engine Lv.12 |

**Computer Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Computer Technology | 50 | +5% all ship systems | None |
| AI Systems | 30 | +5% resource efficiency | Computer Lv.5 |
| Quantum Computing | 25 | +10% research speed | Computer Lv.8 |
| Neural Networks | 20 | +5% espionage defense | Computer Lv.10, AI Lv.5 |
| Predictive Algorithms | 15 | +5% combat evasion | Computer Lv.12, Quantum Lv.5 |
| AI Consciousness | 10 | Unlocks synthetic pop | Computer Lv.20, Neural Lv.10 |

**Weapons Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Weapons Technology | 70 | +3% all weapon damage | None |
| Targeting Systems | 40 | +3% accuracy | Weapons Lv.3 |
| Fire Control | 30 | +2% fire rate | Weapons Lv.5 |
| Artillery | 25 | +10% weapon range | Weapons Lv.8 |
| Rapid Fire | 20 | +5% rapid fire chance | Weapons Lv.10 |
| Siege Weapons | 15 | +15% bombardment damage | Weapons Lv.12 |
| Titan Weapons | 10 | Unlocks titan weapon mounts | Weapons Lv.15 |

**Shielding Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Shielding Technology | 70 | +5% shield HP | None |
| Shields (Basic) | 40 | Unlocks T1 shields | Shielding Lv.3 |
| Deflector Shields | 30 | +3% damage deflection | Shielding Lv.5 |
| Energy Shields | 25 | +10% energy-to-shield | Shielding Lv.8 |
| Phase Shields | 20 | +5% phase chance | Shielding Lv.10 |
| Quantum Barriers | 15 | +10% shield HP, +5% resist | Shielding Lv.12 |
| Singularity Shield | 10 | 1% absorb entire attack | Shielding Lv.15 |

**Armor Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Armor Technology | 70 | +5% hull HP | None |
| Composite Armor | 40 | +5% armor value | Armor Lv.3 |
| Reactive Armor | 30 | +3% armor pen resistance | Armor Lv.5 |
| Ablative Armor | 25 | +5% damage reduction | Armor Lv.8 |
| Nanite Armor | 20 | +5% self-repair | Armor Lv.10 |
| Adamantium Alloy | 15 | +15% hull HP, +10% armor | Armor Lv.12 |
| Living Metal | 10 | 2% hull regen/tick (out of combat) | Armor Lv.15 |

**Engine Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Engine Technology | 60 | +5% speed | None |
| Impulse Drive | 40 | Unlocks T1 engines | Engine Lv.3 |
| Warp Drive | 30 | -5% travel time | Engine Lv.8, Graviton Lv.5 |
| Hyperdrive | 25 | -10% travel time, +20% speed | Engine Lv.12 |
| Quantum Drive | 20 | +25% speed, -5% fuel use | Engine Lv.15 |
| Transwarp Drive | 15 | +50% speed, inter-realm travel | Engine Lv.18 |
| Slipstream Drive | 10 | +100% speed, +25% evasion | Engine Lv.20 |

**Expedition Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Expedition Technology | 50 | +5% expedition rewards | None |
| Scanning | 40 | +5% scan radius | Expedition Lv.3 |
| Anomaly Research | 30 | -10% anomaly research time | Expedition Lv.5 |
| Xenology | 25 | +10% alien artifact value | Expedition Lv.8 |
| Archeology | 20 | +15% ancient ruin rewards | Expedition Lv.10 |
| Progenitor Studies | 15 | Unlocks Progenitor tech | Expedition Lv.12 |
| Dimensional Research | 10 | 1% special event chance | Expedition Lv.15 |

**Espionage Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Espionage Technology | 40 | +1 spy level per 2 levels | Computer Lv.3 |
| Encryption | 30 | +5% counter-espionage | Espionage Lv.3 |
| Decryption | 25 | +5% espionage success | Espionage Lv.5 |
| Stealth Technology | 20 | +3% fleet stealth | Espionage Lv.8 |
| Neural Scanners | 15 | +10% intel gathered | Espionage Lv.10 |
| Mind Control | 10 | Unlocks infiltration | Espionage Lv.12 |

**Intergalactic Tree:**
| Tech | Cap | Effect | Prereq |
|------|-----|--------|--------|
| Intergalactic Research | 50 | +5% shared research | Research Lab Lv.10 |
| Galactic Networking | 30 | -5% alliance research | Intergalactic Lv.3 |
| Unified Theory | 20 | +10% cross-tech synergy | Intergalactic Lv.5 |
| Transcendence | 10 | Unlocks Transcendence path | Intergalactic Lv.15 |

### 5.3 Research Cost & Time Formulas

**Cost:** `ResearchCost(level) = BaseCost × 1.6^(level - 1)`

**Time:** `ResearchTime(level) = BaseTime × 1.6^(level - 1) / (ResearchLabLevel × 0.5) / (1 + ObservatoryLevel × 0.05) / AllianceTechBonus`

BaseTime for most technologies: 60 seconds.

**Example (Energy Tech, Research Lab Lv.15):**
- Level 1: 8s
- Level 5: 52s
- Level 10: 9m
- Level 15: 1.6h
- Level 20: 16.8h
- Level 25: 7.3 days

### 5.4 Intergalactic Research Network

`TotalLabContribution = sum(ResearchLabLevel_i × 1.5^Level_i for all colonies i)`
`ResearchSpeedBonus = 1 + (TotalLabContribution / 1000) × 0.01`

Unlock: Intergalactic Research Lv.1 (requires 10 colonies with Research Lab Lv.5+).

### 5.5 Technology Dependencies

Technologies are organized in a DAG. Example:
```
Energy Lv.3 → Laser Lv.1 → Ion Lv.1 → Plasma Lv.1 → Graviton Lv.1
                              ↓
                      Weapons Lv.3 → ...
```

### 5.6 Unique Technologies per Realm

| Realm | Unique Tech | Effect |
|-------|-------------|--------|
| Nexus Crown | Galactic Mandate | +10% all production, +10% influence |
| Aurora Reach | Solar Convergence | +50% energy from stars |
| Verdant Expanse | Genesis Engine | +100% food, +50% pop growth |
| Crimson Verge | Blood Star Forge | +25% combat damage, -25% military cost |
| Oblivion Gate | Void Resonance | +50% espionage, +25% crit, -25% hull |
| Celestial Arc | Ancient Core Tap | +30% research speed |
| Void Walker | Anomaly Stabilizer | Nullify negative anomalies |
| Iron Dominion | Forge of Worlds | +30% building speed, +1 queue |
| Eternal Edge | Frontier Spirit | +50% expedition rewards |

### 5.7 Research Queue

- Queue Slots: 1 base + 1 per 10 Research Lab levels (max 10)
- Max queued: 20 research items
- Priority system: higher priority gets RP allocation first
- Cancel: 100% RP refund, 50% resource refund

---

## 6. Ship & Fleet System

### 6.1 Ship Categories

90+ ship classes across 13 tiers:

**Small Craft:**

| Class | Hull | Speed | Cargo | Cost | Time | Role |
|-------|------|-------|-------|------|------|------|
| Scout | 100 | 2000 | 500 | 500/250/100 | 10m | Exploration |
| Probe | 50 | 3000 | 100 | 200/100/50 | 5m | One-way scan |
| Interceptor | 200 | 1800 | 100 | 1000/500/200 | 15m | Fast attack |
| Bomber | 400 | 800 | 400 | 1500/750/300 | 20m | Bombardment |
| Corvette | 800 | 1500 | 500 | 3000/1500/500 | 30m | Escort |
| Fighter | 300 | 2200 | 50 | 800/400/150 | 12m | Dogfighting |
| Reaper | 600 | 1600 | 200 | 2000/1000/400 | 25m | Anti-fighter |

**Medium Ships:**

| Class | Hull | Speed | Cargo | Cost | Time | Role |
|-------|------|-------|-------|------|------|------|
| Destroyer | 2000 | 1200 | 1200 | 6000/3000/1000 | 45m | General combat |
| Frigate | 1500 | 1400 | 1500 | 5000/2500/800 | 35m | Support |
| Cruiser | 5000 | 1000 | 3000 | 15000/7500/2000 | 1.5h | Line combat |
| Artillery | 3000 | 900 | 1000 | 12000/6000/2000 | 1h | Long-range |
| Mine Layer | 2500 | 1100 | 4000 | 8000/4000/1500 | 45m | Area denial |

**Capital Ships:**

| Class | Hull | Speed | Cargo | Cost | Time | Role |
|-------|------|-------|-------|------|------|------|
| Battleship | 15000 | 800 | 6000 | 45K/22.5K/7.5K | 6h | Heavy combat |
| Carrier | 10000 | 700 | 20000 | 35K/17.5K/5K | 8h | Fighter support |
| Dreadnought | 30000 | 600 | 8000 | 90K/45K/15K | 12h | Siege/tank |
| Battlecruiser | 20000 | 900 | 5000 | 65K/32.5K/10K | 8h | Fast capital |

**Titan-Class:**

| Class | Hull | Speed | Cargo | Cost | Time | Role |
|-------|------|-------|-------|------|------|------|
| Titan | 100000 | 400 | 25000 | 500K/250K/100K | 48h | Fleet anchor |
| Leviathan | 200000 | 300 | 50000 | 1M/500K/200K | 72h | Super tank |
| Colossus | 80000 | 500 | 100000 | 750K/375K/150K | 60h | Transport/siege |

**Super-Capital:**

| Class | Hull | Speed | Cargo | Cost | Time | Role |
|-------|------|-------|-------|------|------|------|
| Juggernaut | 500000 | 200 | 100000 | 5M/2.5M/1M | 168h | Mobile fortress |
| Mothership | 300000 | 350 | 500000 | 3M/1.5M/500K | 240h | Mobile base |
| Flagship | 1000000 | 500 | 200000 | 10M/5M/2M | 720h | Empire symbol |

### 6.2 Ship Statistics

Every ship has:
- HullHP, Health, Armor (6 types), Shields (6 types), Power, Engine, Speed, Maneuverability, Cargo, Fuel, Crew, Attack, Defense, Accuracy, Evasion, Crit, SensorRange, Stealth, RepairRate, MoraleBonus, Mass

### 6.3 Ship Build Formulas

**Build Cost:**
`FinalCost = floor(BaseCost × BuildCostMultiplier × RaceBonus)`
`BuildCostMultiplier = 1.0 / (1 + NaniteFactoryLevel × 0.05)`

**Build Time:**
`ShipBuildTime = BaseTime / (1 + ShipyardLevel × 0.1) / (1 + NaniteFactoryLevel × 0.5) / RaceBuildBonus`

Example: Battleship at Shipyard Lv.10, Nanite Lv.5: 21600 / 2.0 / 3.5 = 51 minutes.

**Maximum Batch:** `ShipyardLevel × 10`  
Total time = `BuildTime × (1 + 0.02 × (batchSize - 1))`

### 6.4 Fleet Management

**Fleet Composition:**
Each fleet: FleetID, Name, Ships[], Position, Destination, Speed, TotalCargo, TotalFuel, Commander, Mission

**Formations:**

| Formation | Attack | Defense | Speed | Special |
|-----------|--------|---------|-------|---------|
| Line | 0% | 0% | None | Balanced |
| Wedge | +15% front | -10% flank | -10% | Breakthrough |
| Sphere | -20% | +25% all | None | Defensive |
| Vanguard | +25% vanguard | -15% rear | None | Spearhead |
| Screen | +10% | +10% | +20% | Recon |
| Swarm | +10% per attacker | -20% | +30% | Ambush |
| Delta | +20% accuracy | +10% evasion | +15% | Precision |

**Movement:**
`TravelTime = Distance / FleetSpeed`
`Distance = sqrt((x1-x2)² + (y1-y2)²)`
`FleetFuelCost = Distance × TotalMass / (1 + EngineTech × 0.05)`

### 6.5 Cargo & Logistics

`TimeToLoad = cargoUnits / (DockCranes × 100)`, minimum 10 minutes.

### 6.6 Crew System

`CrewLevel = floor(sqrt(CrewXP / 1000))`

Bonuses per level: +1% accuracy, +1% evasion, +0.5% damage, +1% repair rate.

Crew Specializations: Gunnery, Engineering, Navigation, Tactical, Medical, Logistics.

### 6.7 Officers & Commanders

| Rank | XP | Bonuses |
|------|-----|---------|
| Ensign | 0 | +2% fleet stats |
| Lieutenant | 10K | +5% fleet stats |
| Commander | 50K | +10% fleet stats |
| Captain | 200K | +15%, 1 ability |
| Admiral | 1M | +25%, 2 abilities |
| Fleet Admiral | 5M | +40%, 3 abilities |

Officer Abilities: Tactical Genius, Defensive Formation, Emergency Repairs, Scouting, Rally, Overload, Tactical Retreat.

### 6.8 Ship Module System

Ships have weapon (1-12), shield (0-6), armor (0-6), engine (1-4), sensor (0-3), special (0-3) slots.

**Module Examples:**
| Module | Effect | Slots | Tech |
|--------|--------|-------|------|
| Light Laser | 50 dmg kinetic | 1 | Laser Lv.1 |
| Heavy Laser | 200 dmg kinetic | 2 | Laser Lv.5 |
| Ion Cannon | 100 dmg EMP, 25% shield bypass | 2 | Ion Lv.3 |
| Plasma Cannon | 400 dmg thermal, 175% armor pen | 3 | Plasma Lv.3 |
| Missile Launcher | 300 dmg explosive, ignores shields | 2 | Weapons Lv.5 |
| Shield Generator | +500 shield HP | 1 | Shields Lv.3 |
| Cloaking Device | 80% stealth | 2 | Espionage Lv.10 |
| Quantum Core | +20% all stats 3rds (10r cd) | 3 | Quantum Lv.5 |

---

## 7. Combat System

### 7.1 Fleet Combat Resolution

Combat is resolved in discrete rounds via server-authoritative simulation.

**Combat Flow:**
```
1. Initiative Phase
2. Targeting Phase
3. Attack Phase (hit/miss/crit)
4. Damage Phase (shields/hull)
5. Special Phase (status effects)
6. Morale Phase
7. Withdrawal Phase
8. Repeat until elimination or retreat
```

**Initiative:** `ShipSpeed + Maneuverability + Random(0,100) + CommanderBonus`

**Hit Chance:** `80% + AttackerAccuracy - TargetEvasion + FormationBonus + Random(-10,10)`
Clamped to [5%, 99%].

**Critical Hits:** `BaseCrit = 5%`, Max 50%. Crit = damage × 2.0, penetrates 50% armor.

**Damage Calculation:**
```
BaseDamage = WeaponDamage × (1 + WeaponTech × 0.03) × (1 + ShipAttackBonus)
RangeModifier = 1.0 at optimal, degrades beyond
EffectiveArmor = TargetArmor × (1 - ArmorPenetration/100)

If shields > 0:
  ShieldDamage = BaseDamage × RangeModifier × (1 - ShieldResistance)
  Shields -= ShieldDamage
  Overflow → hull with armor reduction
Else:
  HullDamage = BaseDamage × RangeModifier × (1 - EffectiveArmor/(EffectiveArmor+100))
  Hull -= HullDamage
```

### 7.2 Damage Types

| Type | Used By | Armor Pen | Shield Bypass | Special |
|------|---------|-----------|---------------|---------|
| Kinetic | Gauss, Railguns | 25% | 0% | +vs hull |
| Energy | Lasers, Beams | 10% | 0% | +vs shields |
| Thermal | Plasma, Fusion | 50% | 25% | +vs armor |
| Explosive | Missiles, Torpedoes | 25% | 100% | Ignores shields |
| EMP | Ion, Disruptors | 0% | 50% | System disable |
| Quantum | Advanced weapons | 75% | 75% | Ignores most defenses |

### 7.3 Combat Ranges

| Range | Distance | Modifiers |
|-------|----------|-----------|
| Point Blank | <100 | +20% damage, -20% evasion |
| Short | 100-500 | Standard |
| Medium | 500-2000 | -10% accuracy |
| Long | 2000-5000 | -30% accuracy, -20% damage |
| Extreme | >5000 | -50% accuracy, -40% damage |

### 7.4 Shield Mechanics

`ShieldHP = BaseShield × (1 + ShieldTech × 0.05) × ModuleBonuses`  
`RegenPerRound = 5-15% of max`  
Resistances: Kinetic 25%, Energy 50%, Thermal 25%, Explosive 0%, EMP 10%, Quantum 10%.

### 7.5 Combat Rounds

Max 50 rounds. Each round: apply shield regen, hull repair, status effects, check morale, check retreat.

### 7.6 Retreat Mechanics

`Success = 30% + (FleetSpeed - EnemySpeed)/100 + CommanderBonus`  
Max 95%, Min 5%. Available after round 3. Failure gives -20% evasion next round.  
Emergency retreat: lose 25% of ships, instant escape.

### 7.7 Combat Report

Full JSON report with battle ID, timestamp, location, attacker/defender details, ships lost, damage dealt, rounds, outcome, loot, debris, XP, and per-round event log. 

Debris field: 30% of destroyed ship resources, harvestable for 7 days.

### 7.8 Ground Combat

**Ground Units:**
| Unit | Attack | Defense | HP | Cost (M/Cry/D) |
|------|--------|---------|----|-----------------|
| Infantry | 10 | 5 | 100 | 100/50/25 |
| Marine | 25 | 15 | 200 | 250/100/50 |
| Armor | 40 | 30 | 500 | 500/200/100 |
| Mech | 80 | 50 | 2000 | 2000/1000/500 |
| TitanWalker | 300 | 200 | 10000 | 50K/25K/10K |

**Defender Bonus:** `1.0 + BunkerLevel × 0.1 + ShieldActive × 0.25`  
Maximum 20 rounds. Winner controls planet.

### 7.9 Orbital Bombardment

`BombardmentDamage = sum(BomberBombDamage × BomberCount)`  
`StructureDamage = Bombardment × (1 - ShieldDomeReduction) / StructureDefense`  
`PopulationKilled = Bombardment × 0.001 × (1 - ShelterLevel × 0.2)`

Types: Precision (-50% collateral), Full (+25% collateral), Terror (+50% pop damage, -20 rep).

### 7.10 Blockades & Sieges

**Blockade:** Fleet orbits enemy planet 24h+. No resources in/out, -50% production, no ship/building construction.

**Siege:** After 72h blockade. -100% production, -2% pop/day, -5% defense/day, -10 morale/day. Auto-surrender 5%/day after 14 days.

### 7.11 PvP Rules

**Newbie Protection:**
- Tier 1 (0-1000 pts): Full protection, 7 days minimum
- Tier 2 (1000-5000): Soft protection
- Tier 3 (5000+): No protection

**Combat Cooldowns:**
- Fleet: 5 min after combat
- Same attacker vs same target: 1h
- Colony from same attacker: 24h truce
- System truce: 2h after any combat

**War Declaration:**
- Cost: 100K Influence
- Duration: 24h min, 14 days max
- No cooldowns between warring parties
- Peace treaty after 24h minimum
- Surrender: war reparations (10-50% stockpiles), lose 1-3 colonies

### 7.12 PvE Combat

**Pirates:** Raider (Lv.1-10), Marauder (Lv.5-25), Corsair (Lv.10-40), Warlord (Lv.20-60).  
Rewards: Resources (10-50% of fleet value), 2% ship BP chance, credits.

**Alien Creatures:** Space Amoeba, Crystalline Entity, Void Swarm, Space Dragon, Kraken.

**Boss Monsters:**
| Boss | HP | Shields | Fleet Power Required | Rewards |
|------|----|---------|---------------------|---------|
| Devourer | 1M | 500K | 500K | 100M resources, Legendary BP |
| World Eater | 5M | 2M | 2.5M | 500M resources, Titan BP |
| Void Phantom | 10M | 5M | 5M | Void-tech BP |
| Celestial Guardian | 50M | 25M | 25M | Progenitor BP |
| The Crimson King | 100M | 50M | 50M | Legendary commander, title |
| Oblivion Entity | 1B | 500M | 500M | Transcendence key |

### 7.13 Alliance War System

War score: +10 per 1000 FP destroyed, +100 per colony capture, +5 per system/hour, +1 per 100K resources.  
Victory: >200 score difference (surrender), >500 (forced), 80% territory (domination).  
Rewards: 10% of loser's alliance bank, war trophy, ranking points, temporary border control.

---

## 8. Economy & Trading System

### 8.1 Resource Market

**Order Types:**
- Buy Orders: Post want-to-buy, 1% fee (premium 0.5%), 1-14 day duration
- Sell Orders: Post want-to-sell, 1% fee (premium 0.5%), 1-14 day duration
- Instant Orders: Buy at best ask + 2% / Sell at best bid - 2%, 2% fee

**Exchange Rates:**
1 Credit = 100 Metal = 50 Crystal = 20 Deuterium = 10 Alloys = 100 Food = 50 Water

Market fluctuates ±20% from reference based on supply/demand (moving average of last 100 trades).

### 8.2 Celestial Marketplace

Buy/sell entire planets and moons:
- Fee: 5% of sale price
- Escrow: buyer pays → held → transfer → seller receives
- Restrictions: No homeworld, no active combat, max 3 listings

### 8.3 Trade Routes

`Cost: 10K/5K/2K` | `Time: 12h` | `Capacity: 10,000 units/h base`
Route Types: Regular, Surplus (auto-send above threshold), Balanced (two-way), Market.

### 8.4 Tax System

**Income Tax:** `Population × TaxRate × (1 - Corruption×0.01 - TaxRate×0.005)`  
Tax rate slider: 0-50%. Happiness -1 per 1% over 30%.

**Trade Tax:** 5% market / 2% direct P2P.  
**Wealth Tax:** 0.1% of total resource value/day (max 1M credits/day).

### 8.5 Maintenance Costs

**Ships:** `ShipCost × 0.001 per day in credits`  
Unpaid for 7 days: -50% stats. After 14 days: 20%/day mutiny chance.

**Buildings:** `BuildingCost × 0.0001 per day`  
Unpaid: -50% output. After 14 days: shutdown.

### 8.6 Resource Sinks

1. Ship maintenance
2. Building maintenance
3. Market fees (1-2% per trade)
4. War costs (declaration fees, troop upkeep)
5. Terraforming
6. Research (escalating costs)
7. Jump gates (build + upkeep)
8. Alliance donations
9. Auction house
10. Tax evasion fines (random audit)
11. Ship scrapping (50% return)
12. Building deconstruction (25% return with fee)

---

## 9. Crafting & Blueprint System

### 9.1 Blueprint Acquisition

| Method | Common | Uncommon | Rare | Legendary |
|--------|--------|----------|------|-----------|
| Research Discovery | 60% | 30% | 10% | 0% |
| Ancient Ruins | 0% | 40% | 35% | 25% |
| PvE Bosses | 0% | 0% | 50% | 50% |
| Market | All | All | All | All |
| Event Rewards | Variable | | | |
| Alliance Research | Common-Rare | | | |

### 9.2 Blueprint Levels

- **Original:** Unlimited uses. From research breakthroughs, high-tier ruins. Tradeable.
- **Copy:** 3-10 uses. From reverse engineering. Tradeable.
- **Destroyed:** 1 use. From one-time events. Tradeable.

### 9.3 Component Types

| Component | Tier | Materials | Time | Facility |
|-----------|------|-----------|------|----------|
| Circuit Board | 1 | 100M+200Cry | 5m | Electronics Lab |
| Processor | 2 | 500M+1KCry+100D | 15m | Electronics Lab |
| Quantum Chip | 3 | 2K+5KCry+1KD | 1h | Quantum Lab |
| Alloy Plate | 1 | 500M+100Cry | 2m | Foundry |
| Reinforced Frame | 2 | 2K+500Cry+200D | 30m | Foundry |
| EM Coil | 2 | 1K+1.5KCry+500D | 30m | Electronics Lab |
| Graviton Lens | 3 | 5K+10KCry+5KD | 4h | Quantum Lab |

### 9.4 Manufacturing

Raw Materials → Components → Assemblies → Finished Product

Facilities: Electronics Lab (1-20), Foundry (1-20), Chemical Lab (1-15), Bio Lab (1-10), Quantum Lab (1-10), Assembly Plant (1-15). Each level -5% time, -2% cost.

### 9.5 Reverse Engineering

`SuccessChance = 30% + ResearchLabLevel × 1.5% + ReverseEngineeringTech × 3%`  
Max 95%. Duration: 24-168h. Cost: 100K-1M credits.

Results: Success (Copy BP, 3-5 uses OR 1-3 tech levels), Partial (Destroyed BP, 1 use), Failure (50% cost lost), Critical Failure (target lost, 5%).

### 9.6 Quality System

| Quality | Time Mod | Stat Mod | Market Value | Frequency |
|---------|----------|----------|-------------|-----------|
| Standard | 1.0x | 1.0x | 1.0x | 60% |
| Improved | 1.2x | 1.25x | 2x | 25% |
| Advanced | 1.5x | 1.5x | 5x | 10% |
| Superior | 2.0x | 2.0x | 20x | 4% |
| Legendary | 3.0x | 3.0x | 100x | 1% |

**Quality Determination:**
`QualityRoll = Random(0,100) + CraftingSkill × 0.5 + FacilityLevel × 0.5`

### 9.7 Crafting Formulas

`ComponentCost = BaseMaterials × (1 + (Tier-1) × 0.5) × BlueprintRarityMultiplier`  
Rarity Multipliers: Common 1.0, Uncommon 1.5, Rare 2.0, Epic 3.0, Legendary 5.0.

`AssemblyTime = sum(component times) × 1.5 / (1 + AssemblyPlantLevel × 0.1)`  

Quality from components: each Legendary component adds +60 quality (caps at 100).

---

## 10. Diplomacy & Alliance System

### 10.1 Alliance Creation

Requirements: Rank 3+, 1M credits, 100K influence.  
Choose name (3-30 chars), tag (2-5 upper), description (500 chars), public/private.

### 10.2 Alliance Ranks

| Rank | Title | Permissions |
|------|-------|-------------|
| 1 | Initiate | Chat, info |
| 2 | Member | Bank donate, alliance structures |
| 3 | Veteran | Invite, Intel |
| 4 | Officer | Kick initiates, diplomacy, war funds |
| 5 | Executive | Kick any (except leader), treasury (limited) |
| 6 | Co-Leader | All except disband, full treasury |
| 7 | Founder | Full control, transfer leadership |

### 10.3 Diplomatic Relations

Relation level: -100 (War) to +100 (Allied).  
Actions modify relations: Attack member (-30), Attack ally (-50), War (-100), Trade agreement (+2/day), Research agreement (+1/day), Mutual defense (+3/day).

### 10.4 Treaties

| Treaty | Duration | Effect | Cost |
|--------|----------|--------|------|
| Non-Aggression Pact | 14-30d | No attacks, +5 rel/day | 50K influence |
| Trade Pact | 7-30d | -50% trade fees | 100K influence |
| Research Agreement | 7-30d | +10% research speed | 200K influence |
| Mutual Defense | 30d | Attack one = attack both | 500K influence |
| Full Alliance | Indefinite | All above + shared vision | 1M influence |
| Federation Charter | Seasonal | Alliance of alliances | 5M influence |

### 10.5 Alliance Warfare

Shared fleet control, coordinated attacks (+5% per allied fleet), fleet pooling (up to 5 contributors).  
War score: fleet kills, colony captures, system occupation, resource stolen minus losses.  
Surrender: >200 score difference or >500 forced after 7 days.

### 10.6 Alliance Bank

Withdrawal limits per rank: Member 10K/day up to Founder unlimited.  
Transaction log public to alliance. Auto-contributions available.  
Optional alliance tax 0-10% on member production. War chest reserves.

### 10.7 Alliance Research

Shared techs: Alliance Network (+1% trade/level), Joint Operations (+2% combat/level), Shared Knowledge (+3% research/level), Unified Economy (+5% sharing/level), Communal Defense (+5% defense/level), Diplomatic Corps (+1 envoy/level).

Time reduced by contributing members: `Time = BaseTime / (1 + 0.1 × ContributingMembers)`

### 10.8 Alliance Communication

Channels: Chat (WebSocket), Mail (30d), Bulletin Board (5 pinned), Calendar, Battle Reports, Intel Board.

### 10.9 Alliance Rankings

`Score = TotalFleetPower × 0.3 + TotalEconomicPower × 0.3 + TotalResearchPower × 0.2 + TotalMilitaryScore × 0.2`  

Weekly rewards: Top 1 (+50% bank income, +20% bonuses), Top 10 (+25%), Top 50 (+10%), Top 100 (+5%).

### 10.10 Federation Mechanics

Alliance of alliances: 5+ alliances, all Rank 10+, 100+ members, Federation Charter active.  
Council (1 leader per alliance), shared territory, Federation bank, Federation fleet, Federation vote (2/3 majority).  
Dissolution: 75% vote, 14-day cooldown, proportional bank distribution.

---

## 11. Espionage & Intelligence System

### 11.1 Espionage Missions

| Mission | Success Base | Duration | Risk |
|---------|-------------|----------|------|
| Spy | 70% | 2-4h | Low |
| Deep Cover | 50% | 12-24h | Medium |
| Sabotage | 40% | 24-48h | High |
| Infiltrate | 30% | 48-96h | Very High |
| Steal Technology | 25% | 24-72h | Very High |
| Assassinate | 15% | 72-168h | Extreme |
| Subterfuge | 35% | 12-36h | High |

**Mission Cost:** `SpyCost = BaseCost × (1 + TargetRank × 0.2) × (1 + TargetEspDefense × 0.1)`

### 11.2 Success Formulas

```
SuccessChance = SpyLevel×3 + EspTech×2 + MissionBase - TargetEspDef×2 - TargetLevel×0.5 + Random(-10,10)
DetectionChance = TargetEspDefLevel×3 + CounterEspTech×2 + Random(-10,10) - SpyStealth

Outcomes:
  Success: Success >= Detection + 20 → Full intel
  Partial: Success >= Detection - 10 → Partial intel, spy compromised
  Failure: Success < Detection - 10 → Spy compromised
  Critical: Success < Detection - 30 → Spy captured
```

### 11.3 Intel Levels

| Level | Information Revealed |
|-------|---------------------|
| 1 | Basic colony info, resource levels |
| 2 | Fleet presence, approximate strength |
| 3 | Active research, building queue |
| 4 | Full fleet composition, defense layout |
| 5 | Alliance communications, active missions |
| 6 | Technology levels, blueprints in queue |
| 7 | Diplomatic relations, trade routes |
| 8 | Commander stats, officer assignments |
| 9 | Full blueprint library, research history |
| 10 | Complete empire intelligence |

### 11.4 Counter-Espionage

**Defense Structures:**
- Security Center: +10% detection per level
- Neural Scanner: +5% spy identification per level
- Encryption Hub: +3% intel reduction per level

**Counter-Operations:**
- Counter-Spy: Actively hunt enemy spies. `Detection = SecurityLevel × 5 + Random(0,100)`
- Intel Sanitization: Clear intel collected by enemy. Cost: 100K credits.
- Decoy Operations: Feed false intel. `Success = EspTech × 2 + Random(0,50)`

### 11.5 Spy Training & Equipment

**Spy Ranks:**
| Rank | Training Cost | Bonus |
|------|-------------|-------|
| Rookie | 10K credits | +0 espionage |
| Agent | 100K credits | +10 espionage |
| Operative | 500K credits | +25 espionage |
| Specialist | 2M credits | +50 espionage |
| Master | 10M credits | +100 espionage |
| Legend | 50M credits | +200 espionage |

**Spy Equipment:**
- Cloaking Module: +20 stealth
- Codebreaker: +15 decryption
- Neural Editor: +10 disguise
- Quantum Communicator: -25% detection risk
- Self-Destruct Implant: Spy destroyed on capture, no intel leak

---

## 12. Missions & Campaign System

### 12.1 Mission Types

| Type | Frequency | Duration | Rewards |
|------|-----------|----------|---------|
| **Story Missions** | One-time | Variable | XP, blueprints, unique ships |
| **Side Missions** | Repeatable (weekly) | Hours-days | Resources, credits |
| **Daily Missions** | Daily | <24h | Small rewards, currency |
| **Weekly Missions** | Weekly | <7d | Medium rewards |
| **Event Missions** | Event-triggered | Event duration | Event tokens, exclusive items |
| **Alliance Missions** | Weekly | <7d | Alliance XP, bank funds |
| **Tutorial Missions** | One-time (new players) | One-time | Starter resources, ships |

### 12.2 Mission Structure

```
Mission {
  id: string
  name: string
  type: MissionType
  description: string
  requirements: {
    playerLevel: number
    rank: number
    tech: [TechRequirement]
    ships: [ShipRequirement]
    buildings: [BuildingRequirement]
  }
  objectives: [Objective]
    - type: 'gather' | 'build' | 'research' | 'kill' | 'explore' | 'colonize' | 'trade' | 'espionage'
    - target: string | number
    - count: number
    - current: number
  rewards: {
    xp: number
    credits: number
    resources: { [resourceType]: number }
    blueprints: [string]
    ships: [ShipReward]
    items: [ItemReward]
    achievements: [string]
  }
  timeLimit: number (seconds, 0 = no limit)
  cooldown: number (seconds, 0 = one-time)
}
```

### 12.3 Campaign Structure

**Chapters:** 10 chapters, each covering a major narrative arc.

**Acts:** 3 acts per chapter (Beginning, Rising Action, Climax).

**Episodes:** 5-10 episodes per act. Each episode is a story mission.

Total: ~200+ story missions at launch.

**Campaign Narrative Overview:**
- Act 1 (Chapters 1-3): Rise of Your Empire — Establish colonies, meet neighbors, first contact.
- Act 2 (Chapters 4-6): The Great Schism — First major war, ancient threat revealed.
- Act 3 (Chapters 7-8): Shadow War — Espionage, betrayal, secret technologies.
- Act 4 (Chapters 9-10): Transcendence — Endgame, cosmic threats, ascension.

### 12.4 Mission Generation Algorithm

```
function generateMission(type, playerLevel, universeState):
    difficulty = clamp(1, 10, floor(playerLevel / 10) + universeState.difficulty)
    
    // Select objective pool based on type
    objectivePool = getObjectivePool(type, difficulty)
    
    // Select 1-3 objectives
    objectives = weightedSample(objectivePool, count: random(1, 3))
    
    // Scale rewards to difficulty
    baseReward = getBaseReward(type, difficulty)
    rewardMultiplier = 1.0 + (difficulty - 1) × 0.25
    
    // Add context (NPC, location, flavor)
    context = generateMissionContext(type, universeState)
    
    return createMission(objectives, baseReward × rewardMultiplier, context)
```

### 12.5 Mission Rewards

**Formula:**
```
MissionReward = BaseReward × (1 + PlayerLevel × 0.05) × DifficultyMultiplier × TypeMultiplier

DifficultyMultiplier: 1.0 to 5.0
TypeMultiplier:
  Story: 1.5x
  Side: 0.8x
  Daily: 0.5x
  Weekly: 2.0x
  Event: 1.0x (event tokens instead of resources)
  Alliance: 1.2x (to alliance bank)
```

### 12.6 Tutorial Missions

Progressive introduction of game systems:
1. "First Contact" — UI navigation, resource collection
2. "Building Foundations" — Build metal mine, crystal plant
3. "Power Up" — Solar plant, energy management
4. "Research" — Start first research
5. "Defense" — Build shipyard, first ships
6. "Exploration" — Send scout to nearby system
7. "Expansion" — Build colony ship, colonize second planet
8. "Trade" — First market transaction
9. "Combat" — Attack pirate fleet
10. "Alliance" — Join or create alliance

---

## 13. Events & Seasons

### 13.1 Recurring Events

| Event | Frequency | Duration | Description |
|-------|-----------|----------|-------------|
| **Resource Boom** | Monthly | 72h | +50% resource production |
| **Combat Tournament** | Bi-weekly | 48h | PvP tournament with brackets |
| **Research Fest** | Monthly | 48h | -25% research time |
| **Trade Fair** | Bi-weekly | 48h | -50% market fees |
| **Exploration Event** | Monthly | 72h | Double expedition rewards |
| **Pirate Hunt** | Weekly | 24h | Bonus rewards for pirate kills |
| **Mining Rush** | Weekly | 24h | +100% metal production |

### 13.2 Seasonal Events

| Event | Season | Duration | Theme |
|-------|--------|----------|-------|
| **New Dawn** | New Year | 7 days | Celebration, reset goals |
| **Valentine's Convergence** | February | 72h | Diplomacy bonuses, gifts |
| **Equinox Storm** | March | 48h | Combat event, storm mechanics |
| **Anniversary** | Game launch date | 7 days | Special rewards, nostalgia |
| **Summer Solstice** | June | 72h | Solar energy bonuses |
| **Harvest Festival** | September | 72h | Food production, trade |
| **Hallowed Void** | October | 7 days | Horror theme, special monsters |
| **Winter Convergence** | December | 14 days | Holiday theme, generous rewards |

### 13.3 Universe-wide Events

| Event | Frequency | Effect |
|-------|-----------|--------|
| **Alien Invasion** | Every 3 months | NPC alien fleet attacks all players in universe |
| **Cosmic Phenomenon** | Random | Nebula storms, gravity waves, solar flares |
| **Wormhole Storm** | Monthly | Wormholes destabilize, new ones form |
| **Ancient Awakening** | Every 6 months | Ancient ruins become active, bosses spawn |
| **Reality Fracture** | Seasonal (Oblivion Gate) | Dimensional rift, special loot |

### 13.4 Realm Events

| Event | Realm | Description |
|-------|-------|-------------|
| **Realm War** | Crimson Verge | All-vs-all realm combat tournament |
| **Realm Tournament** | All seasonal | Seasonal competition with rankings |
| **Realm Merge** | Event | Two realms temporarily connected |
| **Conquest** | Iron Dominion | Territory control event |

### 13.5 Event Rewards

**Event Currency:** Each event has unique tokens (e.g., "Bone Fragments" for Hallowed Void).  
**Reward Tiers:**
- Participation: Small resource pack
- Milestone 1: Blueprint (common)
- Milestone 2: Ship (limited)
- Milestone 3: Blueprint (rare)
- Milestone 4: Exclusive cosmetic
- Milestone 5: Legendary item
- Leaderboard Top 10: Unique title + exclusive ship skin

### 13.6 Seasonal Content Rotation

- 3-month seasons for competitive realms
- Permanent realms get events without reset
- Season pass: Free + Premium track ($14.99)
- Season pass levels: 50 tiers of rewards
- Season tokens: Earned from gameplay, used in season shop

### 13.7 Limited-time Items

- Ships: Seasonal variants (e.g., "Ghost Frigate" — Hallowed Void exclusive)
- Cosmetics: Planet skins, ship skins, UI themes, name colors
- Modules: Event-exclusive modules (not strictly better, but unique playstyle)

---

## 14. Achievements & Rankings

### 14.1 Achievement Categories

| Category | Focus | Example Achievements | Total |
|----------|-------|---------------------|-------|
| **Exploration** | Discover systems, ruins | "First Contact" — Explore 100 systems | 50 |
| **Combat** | PvP/PvE victories | "The Butcher" — Win 1000 PvP battles | 100 |
| **Economy** | Resources, trade | "Tycoon" — Accumulate 1B credits | 50 |
| **Research** | Tech levels | "Sage" — Research 1000 tech levels total | 30 |
| **Diplomacy** | Alliances, relations | "Diplomat" — Establish 10 trade pacts | 25 |
| **Building** | Colony development | "Architect" — Reach level 100 on any building | 30 |
| **Collector** | Blueprints, ships | "Completionist" — Collect 50 unique ship BPs | 40 |
| **Social** | Community | "Popular" — Have 100 alliance members | 15 |
| **Event** | Events | "Champion" — Win any tournament | 20 |
| **Hidden** | Secret | Various discoveries | 25 |

### 14.2 Achievement Tiers

| Tier | Requirement | Reward |
|------|------------|--------|
| **Bronze** | Complete base achievement | 5K XP, title prefix "Bronze" |
| **Silver** | 2x base requirements | 25K XP, title prefix "Silver" |
| **Gold** | 5x base requirements | 100K XP, title prefix "Gold", cosmetic |
| **Platinum** | 10x base requirements | 500K XP, title prefix "Platinum", rare cosmetic |
| **Diamond** | 25x base requirements | 2M XP, title prefix "Diamond", legendary cosmetic |

### 14.3 Leaderboards

| Leaderboard | Formula | Update Frequency |
|-------------|---------|-----------------|
| **Player Power** | Sum of all colony scores | Hourly |
| **Fleet Power** | Sum of all ship military values | Real-time |
| **Economic Power** | Resource production per hour | Hourly |
| **Research Power** | Total research levels achieved | Daily |
| **Military Power** | Ships destroyed + victories | Real-time |
| **Combined Score** | Weighted average of all above | Hourly |

**Score Formula:**
```
PlayerScore = FleetPower × 0.25 + EconomicPower × 0.25 + ResearchPower × 0.20 + MilitaryScore × 0.20 + SocialScore × 0.10

FleetPower = sum(shipCount × shipMilitaryValue)
EconomicPower = totalResourceProductionPerHour × 100
ResearchPower = sum(techLevel²) × 1000
MilitaryScore = (PvPKills × 100) + (PvEKills × 10) + (BossKills × 1000)
SocialScore = (AllianceMembers × 50) + (TradeVolume / 10000)
```

### 14.4 Ranking Decay

```
ActiveDecay: 0% (playing regularly)
InactiveDecay: 
  - 7 days inactive: -5% score per day
  - 30 days inactive: -10% score per day
  - 90 days inactive: account frozen (can be reactivated)
  
ScoreDecay = CurrentScore × (0.95 ^ inactiveDays) for first 30 days
```

### 14.5 Hall of Fame

| Category | Criteria | Reward |
|----------|----------|--------|
| **Season Winners** | #1 in seasonal realm | Eternal title, platinum trophy, exclusive cosmetic |
| **Top 10** | End-of-season top 10 | Gold trophy, title |
| **Top 100** | End-of-season top 100 | Silver trophy |
| **All-time Greats** | Cumulative score leaders | Statue in Nexus Crown capital |
| **First Achievers** | First to reach milestones | "Pioneer" title, name in credits |

### 14.6 Statistics Tracking

```
TrackedStats (per player):
  - Systems explored: number
  - Planets colonized: current + total
  - Ships built: total by class
  - Ships destroyed: total by cause
  - Resources mined: total by type
  - Resources traded: volume
  - Research completed: total tech levels
  - Battles fought: PvP, PvE, total
  - Battles won: by type
  - Espionage missions: attempted, succeeded, failed
  - Colonies conquered: captured + lost
  - Alliances joined: count
  - Wars fought: count, won, lost
  - Playtime: total hours
  - Credits earned: total from all sources
  - Credits spent: total
  - Blueprints found: total
  - Achievements earned: count by tier
  - Events participated: count
  - Bosses killed: count by type
  - Largest fleet: max fleet power
  - Most damage: in a single battle
  - Longest streak: consecutive daily logins
  - Rankings: historical best
```

---

## 15. Economy Balance

### 15.1 Resource Generation Rates

**Per Planet Type (at level 10 mine/plant):**

| Planet Type | Metal/h | Crystal/h | Deuterium/h | Food/h | Energy (net) |
|-------------|---------|-----------|-------------|--------|-------------|
| Terran | 4,140 | 3,220 | 1,610 | 12,000 | 4,500 |
| Oceanic | 2,900 | 4,186 | 2,415 | 16,000 | 3,750 |
| Continental | 4,554 | 3,542 | 1,610 | 10,400 | 4,125 |
| Arid | 5,382 | 2,576 | 1,127 | 4,000 | 5,625 |
| Tundra | 4,968 | 2,898 | 2,093 | 3,200 | 3,000 |
| Gas Giant | 2,070 | 6,440 | 4,830 | 0 | 9,375 |
| Barren | 6,210 | 1,610 | 483 | 0 | 1,875 |
| Lava | 8,280 | 966 | 161 | 0 | 1,125 |
| Ice | 2,484 | 4,830 | 3,220 | 0 | 1,500 |
| Desert | 5,796 | 1,932 | 805 | 800 | 6,750 |

### 15.2 Build Cost Scaling

Building costs scale exponentially: `BaseCost × 1.5^(level-1)`.  
At level 20: 587.9x base cost.  
At level 30: 19,152x base cost.  
At level 40: 623,273x base cost.

**Practical implications:**
- Level 1-10: Cheap, fast (first day)
- Level 11-20: Moderate (first week)
- Level 21-30: Expensive (first month)
- Level 31-40: Very expensive (3-6 months)
- Level 41+: Endgame grind (years)

### 15.3 Research Cost Scaling

Research cost: `BaseCost × 1.6^(level-1)`

Research cost grows faster than building cost (1.6 vs 1.5 per level), making it the primary long-term resource sink.

Total RP to reach level X: `sum(BaseCost × 1.6^(n-1) for n=1 to X)`  
Level 10: ~744x base RP  
Level 20: ~81,000x base RP  
Level 30: ~8.9Mx base RP

### 15.4 Ship Cost Balance

Ships follow a tiered pricing structure:
- Small craft: 0.5K-3K metal
- Medium: 5K-15K metal
- Capital: 35K-90K metal
- Titan: 500K-1M metal
- Super-capital: 3M-10M metal

**Ship-to-economy ratio:** A maxed economy (Lv.30 mines, 10 colonies) produces ~500K metal/hour. A Battleship costs 45K metal → ~5 minutes of production. A Titan costs 500K metal → ~1 hour. A Juggernaut costs 5M metal → ~10 hours. This ensures meaningful but achievable production times.

### 15.5 Combat Balance (Rock-Paper-Scissors)

```
Fighters > Bombers > Capital Ships > Fighters
Scouts > Corvettes > Destroyers > Scouts
Cruisers > Battleships > Dreadnoughts > Cruisers
Carriers > Fighters > Anti-Fighter (Reapers) > Carriers
Missiles > Shields > Energy Weapons > Armor > Missiles
```

**Strength Multipliers:**
- Strong against: 2.0x damage dealt, 0.5x damage received
- Weak against: 0.5x damage dealt, 2.0x damage received  
- Neutral: 1.0x both ways

### 15.6 Time-to-Progress Curves

| Milestone | Time to Reach (active play) |
|-----------|---------------------------|
| First colony established | 1 minute |
| Rank 2 (Fleet Captain) | 1 hour |
| Rank 3 (Star Lord) | 1 day |
| Rank 4 (Sector Governor) | 1 week |
| Rank 5 (System Overlord) | 1 month |
| Rank 6 (Nebula Prince) | 3 months |
| Rank 7 (Galactic Emperor) | 6 months |
| Rank 8 (Cosmic Emperor) | 1 year |
| Rank 9 (Celestial God) | 2 years |
| Rank 10 (Supreme Dominion Lord) | 3+ years |

### 15.7 Catch-Up Mechanics

**New Player Boost:**
- First 7 days: 2x resource production
- First 30 days: 1.5x XP gain
- First 90 days: +1 building queue
- Mentor system: Veteran players pair with new players for bonuses

**Weak Player Boost:**
- If below 50% of average power in universe: +25% production
- If below 25%: +50% production
- If below 10%: +100% production

**Passive Catch-Up:**
- Research speed bonus for techs where average level > 10: `1 + (AverageLevel - PlayerLevel) × 0.02`
- Building speed bonus for buildings below universe average

### 15.8 Inflation Controls

| Mechanism | Effect |
|-----------|--------|
| Resource sinks (maintenance) | Removes 5-10% of produced resources daily |
| Market fees | Removes 1-2% of traded value |
| Exponential research costs | Primary long-term sink |
| War costs | Removes resources from economy |
| Building maintenance | Ongoing drain |
| Ship maintenance | Fleet size gating |

**Credit Supply:** Credits are earned from taxes and trade, spent on fees and maintenance. The system is designed to have slight deflationary pressure to maintain credit value.

### 15.9 Premium vs Free Balance

| Feature | Free | Premium ($9.99/mo) |
|---------|------|-------------------|
| Building queues | 2 per colony | 3 per colony |
| Fleet slots | 5 | 10 |
| Research queue | 2 | 4 |
| Market fee | 1% | 0.5% |
| Resource production | 100% | 110% |
| Daily rush completions | 1 | 5 |
| Trade routes | 3 | 10 |
| Active espionage missions | 2 | 5 |

**Design Goal:** Premium is convenience, not power. A free player with better strategy should defeat a premium player with poor strategy.

### 15.10 Endgame Economy

At endgame (Rank 8+, 100+ colonies):
- Resource production: 10M-100M metal/hour
- Research costs: Billions of RP per level
- Ship costs: Millions per capital ship
- Fleet maintenance: 100K-1M credits/day
- Market liquidity: Billions in daily volume

**Endgame Activities:**
- Realm wars and territory control
- Federation politics
- Boss hunting (realm bosses)
- Blueprint collection and crafting
- Alliance governance
- Competitive tournaments
- Seasonal realm competition

---

## 16. UI/UX Design Guidelines

### 16.1 Color Palette

**Primary Backgrounds:**
- Deep Space: `#0a0e1a` (main background)
- Card Background: `#0f172a` (primary surface)
- Section Background: `#1e293b` (secondary surface)
- Border/Divider: `#334155` (tertiary surface)
- Hover State: `#475569`

**Text Colors:**
- Primary Text: `#f1f5f9` (headings, primary content)
- Secondary Text: `#94a3b8` (body text)
- Tertiary Text: `#64748b` (metadata, labels)
- Disabled: `#475569`

**Accent Colors by Realm:**
| Realm | Primary Accent | Secondary |
|-------|---------------|-----------|
| Nexus Crown | `#fbbf24` (gold) | `#d97706` |
| Aurora Reach | `#a78bfa` (purple) | `#7c3aed` |
| Verdant Expanse | `#34d399` (green) | `#059669` |
| Crimson Verge | `#f87171` (red) | `#dc2626` |
| Oblivion Gate | `#818cf8` (indigo) | `#4f46e5` |
| Celestial Arc | `#38bdf8` (sky blue) | `#0284c7` |
| Void Walker | `#c084fc` (violet) | `#9333ea` |
| Iron Dominion | `#fb923c` (orange) | `#ea580c` |
| Eternal Edge | `#2dd4bf` (teal) | `#0d9488` |

**Status Colors:**
- Success: `#22c55e`
- Warning: `#eab308`
- Error: `#ef4444`
- Info: `#3b82f6`
- Neutral: `#6b7280`

**Rarity Colors:**
- Common: `#94a3b8` (gray)
- Uncommon: `#22c55e` (green)
- Rare: `#3b82f6` (blue)
- Epic: `#a855f7` (purple)
- Legendary: `#eab308` (gold)

### 16.2 Typography

**Headings:**
- H1: 32px, Bold, Letter-spacing: -0.02em
- H2: 24px, Bold, Letter-spacing: -0.01em
- H3: 20px, Semi-bold
- H4: 18px, Semi-bold
- H5: 16px, Medium
- H6: 14px, Medium

**Body Text:**
- Primary: 14px, Regular, Line-height: 1.5
- Secondary: 13px, Regular
- Small: 12px, Regular
- Tiny: 11px, Regular

**Monospace (Data, Code, Stats):**
- Font: 'JetBrains Mono' or 'Fira Code'
- Data display: 14px, Medium
- Resource numbers: 14px, Semi-bold, Tabular numbers
- Code/logs: 13px, Regular

**Font Stack:**
- UI: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`
- Data: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`

### 16.3 Design Principles

1. **Information Density:** Show critical data at a glance. Use tables, tooltips, and collapsible sections.
2. **Progressive Disclosure:** Show basics first, expand details on interaction. Never overwhelm.
3. **Consistent Patterns:** Same actions in same places. Build muscle memory.
4. **Status Visibility:** Always show resource totals, timers, queues. Use badges and indicators.
5. **Feedback:** Every action has immediate visual feedback (loading, success, error, animation).
6. **Forgiveness:** Confirm destructive actions (war, dismantle, attack). Allow cancellation where possible.
7. **Accessibility:** Meet WCAG 2.1 AA standards. Support keyboard navigation. Screen reader compatible.
8. **Performance:** First paint < 2s. Subsequent navigation < 500ms. WebSocket for real-time.
9. **Responsive:** Desktop-first with adaptive tablet/mobile layouts. Critical features on all sizes.

### 16.4 Key Screens

**Dashboard (Overview):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Empire Name] [Rank] [Level] [Credits] [Resources Bar]       │
├──────────────────────┬───────────────────────────────────────┤
│ Active Fleets         │ Notifications / Events               │
│ - Fleet A (Idle)     │ - Battle report                      │
│ - Fleet B (Moving)   │ - Construction complete              │
│ - Fleet C (Returning)│ - Research complete                  │
├──────────────────────┼───────────────────────────────────────┤
│ Colony Quick-View     │ Active Queues                        │
│ - Colony 1 (40/60)   │ - Building: Metal Mine Lv.12 (2h)    │
│ - Colony 2 (12/40)   │ - Research: Laser Lv.15 (4h)         │
│ - Colony 3 (30/50)   │ - Shipyard: Cruiser ×5 (3h)          │
├──────────────────────┴───────────────────────────────────────┤
│ Universe Status / Events                                     │
│ [Resource Boom active - 48h remaining]                       │
│ [Pirate activity elevated in Galaxy 4]                       │
└──────────────────────────────────────────────────────────────┘
```

**Galaxy View:**
- Interactive star map with pan/zoom
- Systems shown as dots colored by star class
- Wormhole connections as lines
- Player systems highlighted with empire color
- Enemy/friendly system distinction
- Filters: star class, resource richness, player presence, danger level
- Click system → System View

**System View:**
```
┌──────────────────────────────────────────────────────────────┐
│ [System 3:152] [Star: G-type] [Coordinates: 4523, 7812]     │
├──────────────────────────────────────────────────────────────┤
│ Planet 1: Terran [Occupied: Player123]                       │
│   ├─ Metal Mine Lv.14 │ Crystal Plant Lv.12 │ ...           │
│   └─ Fleet: 5 ships (idle)                                  │
│ Planet 2: Barren [Uncolonized]                               │
│ Planet 3: Gas Giant [Uncolonized]                            │
│ ┌─ Moon 3a: Volcanic [Uncolonized]                           │
│ Asteroid Belt: [Mine] [Resource: 4,200 Metal]                │
├──────────────────────────────────────────────────────────────┤
│ Nearby: System 3:153 (0.5h flight), System 3:151 (1.2h)     │
│ Wormhole to: System 3:201 (stable, 0.1h flight)              │
└──────────────────────────────────────────────────────────────┘
```

**Planet View (Colony):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Planet Name] [Terran] [Colony of Player123] [60/60 fields] │
├──────────────────────┬───────────────────────────────────────┤
│ Resources             │ Population                            │
│ Metal: 452,300/1M    │ Pop: 45,230 │ Happy: 85 │ Crime: 5%  │
│ Crystal: 231,000...  │ Growth: +120/h │ Morale: Content     │
├──────────────────────┼───────────────────────────────────────┤
│ Buildings [Filter]    │ Building Queue [2 slots]              │
│ ⬛ Metal Mine Lv.14  │ [1] Metal Mine → Lv.15 (2h 30m)     │
│ ⬛ Crystal Plant Lv.12│ [2] Solar Plant → Lv.10 (1h)        │
│ ⬛ Solar Plant Lv.9   │ [+ Add to Queue]                    │
│ ⬛ Research Lab Lv.10 │                                      │
│ ⬛ Shipyard Lv.8      │                                      │
│ [Build] [Upgrade]     │                                      │
├──────────────────────┴───────────────────────────────────────┤
| Planet Actions: [Colonize] [Specialize] [Terraform] [Rename] |
└──────────────────────────────────────────────────────────────┘
```

**Fleet View:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Fleet Name: Strike Force Alpha] [Commander: Admiral Vex]   │
├──────────────────────┬───────────────────────────────────────┤
│ Composition           │ Stats                                │
│ ✦ Battleship ×3     │ Power: 45,230 │ Speed: 800            │
│ ⬟ Cruiser ×5        │ Cargo: 33,000/50,000                  │
│ ▷ Frigate ×8         │ Fuel: 5,000/10,000                   │
│ ▸ Corvette ×12       │ Morale: 85%                          │
├──────────────────────┼───────────────────────────────────────┤
│ Location              │ Orders                               │
│ System 3:152          │ [Move] [Attack] [Deploy] [Patrol]   │
│ → Destination: none   │ [Return] [Scuttle]                  │
│ Status: Idle          │                                      │
└──────────────────────────────────────────────────────────────┘
```

**Combat Report:**
```
┌──────────────────────────────────────────────────────────────┐
│ ⚔ Battle Report: BTL-20260628-001234                       │
│ Location: System 3:152                                      │
│ Date: 2026-06-28 14:30 UTC                                  │
├──────────────────────┬───────────────────────────────────────┤
│ Attacker (You)       │ Defender (Enemy123)                  │
│ Ships lost: 5        │ Ships lost: 12                       │
│ Damage dealt: 45,000 │ Damage dealt: 32,000                 │
│ ⬟ Cruiser ×2 lost   │ ⬟ Destroyer ×8 lost                 │
│ ▷ Frigate ×3 lost   │ ▸ Corvette ×12 lost                  │
├──────────────────────┴───────────────────────────────────────┤
│ ⚡ Victory!                                              │
│ Loot: Metal 5,000 │ Crystal 2,500                          │
│ Debris: Metal 15,000 │ Crystal 7,500                       │
│ XP earned: 1,250                                            │
├──────────────────────────────────────────────────────────────┤
│ Round-by-round [Expand]                                      │
│ Round 1: Cruiser#1 → Destroyer#3: 450 dmg (hit)            │
│ Round 2: ...                                                │
└──────────────────────────────────────────────────────────────┘
```

**Research Tree:**
- Interactive tree/graph visualization showing dependencies
- Techs color-coded by unlock status (locked/available/researched/in-progress)
- Filter by category, search by name
- Tooltip on hover: cost, time, effect
- Research queue on right panel
- Progress bar for active research

**Shipyard:**
```
┌──────────────────────────────────────────────────────────────┐
│ Shipyard Lv.8 [Colony: PlanetName]                          │
├──────────────────────────────────────────────────────────────┤
│ [Ship Classes] [All] [Small] [Medium] [Capital] [Titan]     │
├──────────────────────────────────────────────────────────────┤
│ Cruiser ────────────────────────────────────────────────   │
│ Hull: 5,000 │ Speed: 1,000 │ Cargo: 3,000 │ Weapons: 4     │
│ Cost: 15,000M │ 7,500C │ 2,000D │ Time: 1h 30m             │
│ [Build 1] [Build ×10] [Build ×100]                          │
├──────────────────────────────────────────────────────────────┤
│ Production Queue [3/5 slots]                                 │
│ [1] Cruiser ×5 → Complete in 7h 30m                        │
│ [2] Frigate ×10 → Complete in 5h 50m                       │
│ [3] Scout ×1 → Complete in 10m                             │
└──────────────────────────────────────────────────────────────┘
```

**Marketplace:**
```
┌──────────────────────────────────────────────────────────────┐
│ Marketplace │ [Buy] [Sell] [My Orders] [Trade History]      │
├──────────────┬───────────────────────────────────────────────┤
│ Filter        │ Order Book: Metal (C)                        │
│ Resource: All│                                               │
│ Min Qty: 0   │ Bids              │ Asks                     │
│ Max Qty: ∞   │ 100K @ 95C        │ 50K @ 105C              │
│              │ 200K @ 94C        │ 100K @ 106C             │
│              │ 500K @ 93C        │ 200K @ 108C             │
│ [Your Credits: 1,234,567]        │ [Instant Buy] [Sell]    │
└──────────────┴───────────────────────────────────────────────┘
```

**Alliance Management:**
```
┌──────────────────────────────────────────────────────────────┐
│ [Alliance Name] [Tag] [Rank] [Members: 25/50]              │
├───────┬──────────┬──────────┬──────────┬────────────────────┤
│ Chat  │ Members  │ Bank     │ Research │ Diplomacy          │
├───────┴──────────┴──────────┴──────────┴────────────────────┤
│ Alliance Info │ Description │ Treaties │ War Status          │
│ Message of the Day: [Edit]                                  │
│ Alliance Calendar: [Next event: Raid on Galaxy 4 - 2d]      │
└──────────────────────────────────────────────────────────────┘
```

### 16.5 Responsive Design Considerations

| Breakpoint | Target | Layout Changes |
|------------|--------|----------------|
| ≥1400px | Desktop (HD+) | Full layout, 3-4 columns, expanded navigation |
| 1024-1399px | Desktop | 2-3 columns, sidebar collapsed by default |
| 768-1023px | Tablet | 1-2 columns, bottom navigation, touch-friendly |
| 480-767px | Large Phone | Single column, bottom tab bar, simplified tables |
| <480px | Phone | Single column, critical info only, scalable interactions |

**Mobile-Specific:**
- Swipe gestures for navigation
- Long-press for context menus
- Touch targets ≥ 44px
- Pull-to-refresh for resource update
- Simplified construction/research queue (show only active items)
- Critical notifications persist (attack alerts, completion timers)

### 16.6 Accessibility Guidelines

**WCAG 2.1 AA Compliance:**
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: All actions via keyboard (Tab, Enter, Space, Arrow keys)
- Focus indicators: Visible focus ring on all interactive elements
- Screen reader: ARIA labels, roles, live regions for dynamic content
- Text resizing: Up to 200% without loss of content or functionality
- Motion: Respect `prefers-reduced-motion`
- Color: Not sole indicator of status (use icons + text + color)

**Specific Implementation:**
- All icons have `aria-hidden="true"` with accompanying text
- Tables have proper `<th>` scope and `aria-sort` for sortable columns
- Real-time updates use `aria-live="polite"` for non-critical, `aria-live="assertive"` for combat alerts
- Timers count down visibly and audibly for critical events
- Error messages linked to inputs via `aria-describedby`
- Skip-to-content link as first focusable element

### 16.7 Loading & Empty States

**Loading States:**
- Skeleton screens matching layout structure (not spinners)
- Shimmer animation for content-in-progress
- Progressive loading: critical data first, details after

**Empty States:**
- First-time user: "Welcome! Here's what to do first..."
- No colonies: "Send a colony ship to claim a planet"
- No fleet: "Build your first ship at the Shipyard"
- No research: "Start researching at the Lab"
- No alliance: "Join an alliance for bonuses and protection"

### 16.8 Notification System

**Notification Types:**
- **System:** Resource collection, construction complete, research done (toast, top-right)
- **Combat:** Attack incoming, battle report (modal + sound + screen flash)
- **Fleet:** Arrival, engagement, destruction (toast + sound)
- **Diplomacy:** Message, treaty offer, alliance invite (badge on communication icon)
- **Market:** Order filled, trade completed (toast)
- **Event:** Event started/ended, milestone reached (modal)

**Notification Settings:**
- Per-category toggle (on/off)
- Sound on/off
- Browser push notifications (desktop)
- Email digest (daily/weekly)

---

## Appendix A: Data Storage & Performance Notes

### A.1 Database Design Considerations

- **PostgreSQL** with TimescaleDB extension for time-series (resource production, combat logs)
- **Redis** for caching: active fleets, resource rates, session data
- **Sharding:** By universe (90 shards), with cross-shard queries for inter-universe operations
- **Estimated data size:** ~500GB for core game state at launch, growing ~100GB/year per 100K active players
- **Tick data:** Economy tick (60s) updates 6.6M celestial bodies → batch update with delta compression

### A.2 Performance Targets

| Operation | Target Latency | Notes |
|-----------|---------------|-------|
| UI page load | < 2s | SSR for initial, SPA for subsequent |
| API response (read) | < 100ms | Cached where possible |
| API response (write) | < 500ms | Queue-based for complex operations |
| Combat resolution | < 5s for 1000v1000 | Server-side simulation |
| Economy tick | < 30s for all 90 universes | Batch processing, distributed workers |
| WebSocket push | < 200ms | Real-time fleet movement, combat |
| Market order matching | < 1s | In-memory order book |

### A.3 Caching Strategy

- **Hot data (seconds):** Active fleets, combat state, resource rates — Redis
- **Warm data (minutes):** Colony details, building queues, research — Redis with TTL
- **Cold data (hours):** Historical data, battle reports, messages — PostgreSQL
- **Archive (months):** Old battle reports, old messages — Compressed, moved to cold storage

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| 4X | eXplore, eXpand, eXploit, eXterminate — core game pillars |
| Colony | A settled planet under player control |
| Realm | A group of 10 universes with shared rules/themes |
| System | A solar system containing a star and orbiting bodies |
| Tick | A game time increment (60s for economy, 100ms for combat) |
| Deuterium | Fuel resource used for ship movement and advanced weapons |
| Credits | Primary currency used for trading and fees |
| Influence | Diplomatic currency used for treaties and claims |
| RP | Research Points — generated by labs, spent on technologies |
| Fields | Buildable slots on a planet (determine max building count) |
| Ship Class | A type of ship with defined stats (e.g., Cruiser, Battleship) |
| Fleet | A group of ships operating as a unit |
| Blueprint | A design that enables construction of ships/modules/items |
| Jump Gate | Player-built structure for instant system-to-system travel |
| Wormhole | Natural passage connecting distant systems |
| Federation | Alliance of alliances — endgame political structure |
| Terraforming | Changing a planet's class to a more habitable type |
| Nanite Factory | Special building that reduces construction time |
| Ground Combat | Planetary invasion using ground troops |
| Debris Field | Remains of destroyed ships, harvestable for resources |
| Newbie Protection | Temporary invulnerability for new players |
| War Score | Numerical measure of success in inter-alliance warfare |

---

## Appendix C: Launch Content Roadmap

| Milestone | Content | Metrics |
|-----------|---------|---------|
| **Alpha** (Month 6) | Core loop, 1 realm (10 universes), basic ships, 5 building types | Internal testing |
| **Beta** (Month 9) | All 9 realms, 50+ ships, all buildings, PvP, alliances | 10K testers |
| **Launch** (Month 12) | Full 90 universes, 90+ ships, all mechanics, campaigns | 100K+ players |
| **Season 1** (Month 15) | First seasonal realm, special event, new ships | Retention metrics |
| **Season 2** (Month 18) | Federation mechanics, new boss, crafting expansion | Engagement |
| **Year 2** | Space station mechanics, player-owned starports, VR integration experiments | Growth |

---

*Document Version 1.0 — This is a living document. All numbers, formulas, and mechanics are subject to balance adjustment and iterative design changes based on playtesting and community feedback.*
