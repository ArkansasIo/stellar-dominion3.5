<!-- FILE: GAME_DESIGN.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-18 -->
# Game Design Document - Stellar Dominion

> **Source:** All source files referenced inline.

---

## Core Game Loop

> **Source:** server/gameEngine.ts (379 lines)

The core loop is driven by `processCoreGameTick()` which executes two phases:

1. **Resource Tick** (`processResourceTick`) — Calculates elapsed time, applies production rates from buildings/research, updates resource totals in DB
2. **Construction Queue** (`processConstructionQueue`) — Checks cronJobs for completed buildings, increments building levels, removes from queue

### Production Formula
```
metal = 30 * metalMineLevel * (1 + metalMineLevel / 10)
crystal = 20 * crystalMineLevel * (1 + crystalMineLevel / 10)
deuterium = 10 * deuteriumLevel * (1 + deuteriumLevel / 12)
energy = 20 + energyTechLevel * 5
```

### Building Cost Scaling
```
cost = baseCost * (1.15 ^ currentLevel)
```

### Build Time
```
time = ceil(totalCost / (2500 * (1 + roboticsFactoryLevel)))
```

---

## Combat System

> **Source:** server/combatEngine.ts (326 lines)
> **Source:** shared/config/combatConfig.ts (109 lines)

### Unit Stats

| Unit | Attack | Defense | Health | Speed |
|------|--------|---------|--------|-------|
| Light Fighter | 50 | 20 | 100 | 12 |
| Heavy Fighter | 80 | 40 | 150 | 10 |
| Cruiser | 120 | 60 | 400 | 8 |
| Battleship | 200 | 100 | 600 | 6 |
| Battlecruiser | 300 | 150 | 1000 | 4 |
| Dreadnought | 300 | 150 | 1000 | 4 |

### Research Bonuses
- Weapons Tech: +5% attack per level
- Shielding Tech: +5% defense per level
- Armour Tech: +3% health per level
- Combustion Drive: +2% speed per level

### Combat Mechanics
- Max rounds: 100
- Critical chance: 5% base
- Critical multiplier: 1.5x
- Damage variance: ±20%
- Minimum damage: 1

### Damage Formula
```
baseDamage = attacker.attack - defender.defense * 0.5
damage = baseDamage * (1 + (random - 0.5) * 0.4) * critMultiplier
```

### Battle Modes (combatConfig)

| Mode | Players | Max Units | Flange Bonus |
|------|---------|-----------|--------------|
| Solo PvE | 1 | 500 | 0 |
| Group PvE | 2-6 | 2000 | 15% |
| Solo PvP | 1 | 500 | 0 |
| Group PvP | 2-6 | 2000 | 25% |

### Flange Formations
- Balanced: 1.0x offense/defense
- Aggressive: 1.4x offense, 0.8x defense
- Defensive: 0.7x offense, 1.5x defense
- Flanking: 1.8x offense (requires position advantage)
- Pincer: 2.0x offense (requires team coordination)

---

## Economy System

> **Source:** shared/config/gameConfig.ts (673 lines)
> **Source:** shared/config/economy/ (7 subdirectories)

### Base Resource Production (per second)
- Metal: 0.1
- Crystal: 0.05
- Deuterium: 0.02
- Energy: 0.15

### Building Costs

| Building | Metal | Crystal | Deuterium | Time |
|----------|-------|---------|-----------|------|
| Metal Mine | 60 | 15 | 5 | 30s |
| Crystal Mine | 48 | 24 | 10 | 30s |
| Deuterium Synth | 225 | 75 | 30 | 30s |
| Solar Plant | 75 | 30 | 0 | 30s |
| Robotics Factory | 400 | 120 | 200 | 120s |
| Shipyard | 400 | 200 | 100 | 120s |
| Research Lab | 200 | 400 | 200 | 120s |

### Ship Costs

| Ship | Metal | Crystal | Deuterium |
|------|-------|---------|-----------|
| Light Fighter | 3,000 | 1,000 | 400 |
| Heavy Fighter | 6,000 | 4,000 | 1,000 |
| Cruiser | 20,000 | 7,000 | 2,000 |
| Battleship | 45,000 | 15,000 | 4,000 |
| Small Cargo | 2,000 | 2,000 | 500 |
| Large Cargo | 6,000 | 6,000 | 1,000 |
| Colony Ship | 10,000 | 20,000 | 1,000 |

### Currency System
- **Silver**: Basic currency (earned from combat, quests)
- **Gold**: Premium currency (earned from achievements, trading)
- **Platinum**: Rare currency (earned from raids, events)

> **Source:** shared/schema.ts:1864-1907 (playerCurrency, currencyTransactions)

### Trading
- Market orders (buy/sell with limit orders)
- Auction house (bidding with buyout option)
- Player-to-player trade offers (mail integrated)
- Trade history tracking

---

## Research System

> **Source:** shared/config/technologyTreeConfig.ts (1541 lines)
> **Source:** shared/config/researchProgression.ts (792 lines)

### Technology Branches (11)
1. Armor & Plating
2. Shields & Protection
3. Weapons & Ordnance
4. Propulsion & FTL
5. Sensors & Detection
6. Power Generation
7. AI & Computing
8. Engineering & Construction
9. Material Processing
10. Medical & Life Support
11. Advanced Physics & Teleportation

### Tech Classes
basic, standard, advanced, military, experimental, ancient, exotic

### Research Progression
- 13 research branches: energy, propulsion, weapons, defense, shields, construction, computers, espionage, megastructure, economy, genetics, quantum, exotic
- Tier unlock requirements scale with progression
- Base cost multiplier: 1.75x per level

> **Source:** shared/config/researchProgression.ts:47-58

---

## Progression System

> **Source:** shared/config/progressionSystem.ts (335 lines)
> **Source:** shared/config/progressionSystemConfig.ts (554 lines)

### Universal Progression
- **Tiers**: 1-99 (10 levels per tier)
- **Levels**: 1-999
- **Level multiplier**: 1.015 per level (~16x at level 999)
- **Tier multiplier**: 1.08 per tier (~9x at tier 99)

### Stat Scaling
- Base stat: 10
- Growth per level: +5
- Growth per tier: +50
- Tier multiplier increment: +5% per tier
- Level multiplier increment: +1% per level

### Experience Scaling
- Base XP requirement: 100
- XP scaling factor: 1.15x per level
- Tier requirement: 1000 points base, 1.25x scaling

---

## Social Systems

> **Source:** shared/schema.ts (tables: alliances, guilds, teams, friends)

### Alliances
- Name, tag, description, announcement
- Shared resource pool
- Member ranks: leader, officer, member, recruit

### Guilds
- Level progression, treasury, influence
- Custom roles and permissions
- Max 100 members
- Join requirements (level-based)

### Teams (Raids)
- Max 6 players per team
- Guild-affiliated or independent
- Raid participation and win tracking

### Friends
- Friend requests with messages
- Online status, favorite flag
- Max 50 friends per player

---

## Universe System

> **Source:** shared/config/universeGenerationConfig.ts (539 lines)
> **Source:** shared/config/planetTypesConfig.ts (895 lines)

### Universe Presets

| Preset | Size | Galaxies | Sectors | Stars |
|--------|------|----------|---------|-------|
| Starter | Small | 1 | 10 | 200 |
| Standard | Medium | 3 | 30 | 1,800 |
| Large | Large | 7 | 50 | 7,000 |
| Massive | Massive | 15 | 100 | 30,000 |

### Planet Types (50+)
Each planet has full stats: diameter, mass, gravity, atmosphere, temperature, water coverage, habitability, resource richness, radioactivity, seismic activity, magnetic field, storm intensity.

### Physical Properties
- Diameter (km)
- Mass (Earth masses)
- Gravity (0.1-3.0 G)
- Atmosphere pressure (0-5 atm)
- Water coverage (0-100%)
- Habitability index (0-100)

---

*Game design document with source references.*
