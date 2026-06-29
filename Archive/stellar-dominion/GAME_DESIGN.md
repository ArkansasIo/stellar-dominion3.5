# Stellar Dominion - Game Design Document

**Version:** 0.8.2-beta  
**Last Updated:** December 2, 2024  
**Game Type:** 4X (Explore, Expand, Exploit, Exterminate) Strategy Game

---

## Table of Contents

1. [Game Overview](#game-overview)
2. [Core Mechanics](#core-mechanics)
3. [Systems Design](#systems-design)
4. [Progression Systems](#progression-systems)
5. [Balancing](#balancing)
6. [Victory Conditions](#victory-conditions)
7. [Inspiration & References](#inspiration--references)

---

## Game Overview

### Concept
Stellar Dominion is a turn-based 4X space strategy game inspired by Stellaris. Players control an interstellar empire, managing resources, researching technologies, and expanding across the galaxy through exploration, trade, and conquest.

### Target Audience
- 4X Strategy Game Fans (Stellaris, Civilization, Master of Orion)
- Sci-Fi Enthusiasts
- Strategy Game Players
- Ages 16+

### Core Loop
1. **Plan** - Set research, build units, schedule expeditions
2. **Execute** - Fleets move, battles occur, resources accumulate
3. **Adapt** - React to outcomes, adjust strategy, prepare for next turn
4. **Progress** - Unlock new technologies and expand empire

### Key Features
- 🔬 **Deep Research System** - 25+ technologies with prerequisites and bonuses
- 🚀 **Expedition System** - Fleet/troop expeditions to explore and conquer
- ⚔️ **Strategic Combat** - Position-based battles with tactical elements
- 🌍 **Galaxy Exploration** - Procedurally-generated universe
- 🤝 **Diplomacy & Trade** - Form alliances, trade resources
- 💰 **Economy** - Resource management and market trading

---

## Core Mechanics

### 1. Turn System

**Implementation:** 3-5 game turns per minute (configurable)

- Each turn represents a game tick where:
  - Resources are collected/consumed
  - Construction completes
  - Research progresses
  - Fleets move and battles resolve
  - Missions arrive at destinations

**Turn Structure:**
```
Turn Phase 1: Resource Collection
  - Calculate production based on buildings
  - Calculate consumption based on military
  - Apply research bonuses

Turn Phase 2: Expedition Resolution
  - Check if expeditions arrived
  - Resolve encounters
  - Award resources/discoveries

Turn Phase 3: Fleet Movement
  - Process fleet movements
  - Check for interceptions
  - Execute pending attacks

Turn Phase 4: Research Progression
  - Advance research in current tech
  - Unlock new technologies if complete
```

### 2. Resource Economy

**Four Core Resources:**

| Resource | Use | Production | Consumption |
|----------|-----|-----------|------------|
| **Metal** | Construction, armor | Metal Mine | Buildings, units |
| **Crystal** | Advanced tech | Crystal Mine | Research, ships |
| **Deuterium** | Fuel, power | Refinery | Fleets, weapons |
| **Energy** | Power generation | Power Plant | All buildings |

**Resource Mechanics:**
- Production = Building Level × Base Production × Research Bonus
- Consumption = Building Count × Base Consumption + Fleet Size × Fuel Use
- Net = Production - Consumption
- Storage = Building Level × Storage Capacity

### 3. Building System

**Colony Buildings (Planetary):**
- Metal Mine (Level 1-30) - Produces metal
- Crystal Mine (Level 1-30) - Produces crystal
- Refinery (Level 1-20) - Produces deuterium
- Power Plant (Level 1-25) - Produces energy
- Robotics Factory (Level 1-15) - Constructs units
- Shipyard (Level 1-20) - Constructs ships
- Research Lab (Level 1-15) - Researches technologies
- Storage Facility (Level 1-25) - Increases resource storage

**Orbital Structures:**
- Defense Platform (Level 1-10) - Defensive weaponry
- Solar Collector (Level 1-15) - Energy production
- Shield Generator (Level 1-10) - Shield defense
- Sensor Array (Level 1-10) - Espionage/detection

**Construction Mechanics:**
- Time = Base Time × (1 - Research Bonus%)
- Cost = Resource Cost × Building Level
- Can queue multiple buildings (FIFO)
- Cannot start new construction if storage < 25% of cost

### 4. Unit System

**Military Units:**

| Unit | Cost | Production Time | Purpose |
|------|------|-----------------|---------|
| Fighter | Low | Fast | Space superiority |
| Corvette | Low | Medium | Reconnaissance |
| Destroyer | Medium | Medium | Balanced combat |
| Cruiser | Medium | Slow | Heavy firepower |
| Battleship | High | Slow | Massive damage |
| Transport | Low | Fast | Resource transport |

**Ground Units:**
- Soldier - Basic infantry
- Scout - Reconnaissance
- Tank - Heavy ground unit
- Bomber - Anti-structure

**Unit Stats:**
```typescript
{
  armor: number,           // Damage reduction
  attack: number,          // Damage per hit
  health: number,          // HP
  speed: number,           // Movement speed
  range: number,           // Attack range
  special: string,         // Special ability
  cost: { metal, crystal, deuterium },
  productionTime: number   // Turns to build
}
```

---

## Systems Design

### 1. Technology Tree System

**Features:**
- 25+ researches across 3 areas: Physics, Society, Engineering
- Tier-based progression (Tier 1-5)
- Prerequisites create tech dependencies
- Research bonuses (production, damage, armor, etc.)
- Equal opportunity - no tech is locked by gameplay

**Technology Areas:**

#### Physics (9 Technologies)
Focus on energy, weapons, and propulsion

1. **Energy Production** (Tier 1)
   - Unlocks: Basic power plants
   - Bonus: +10% energy production
   - Cost: 500 credits, 200 metal

2. **Metal Extraction** (Tier 1)
   - Unlocks: Metal mines
   - Bonus: +5% metal production
   - Cost: 400 credits, 150 metal

3. **Weapon Systems** (Tier 2)
   - Requires: Energy Production
   - Bonus: +15% weapon damage
   - Cost: 800 credits, 400 crystal

4. **Armor Technology** (Tier 2)
   - Requires: Metal Extraction
   - Bonus: +10% armor
   - Cost: 700 credits, 300 crystal

5. **Shields** (Tier 3)
   - Requires: Armor, Weapon Systems
   - Bonus: +25% shield capacity
   - Cost: 1200 credits, 600 crystal

6. **Sensors** (Tier 3)
   - Requires: Energy, Weapon Systems
   - Bonus: +50% detection range
   - Cost: 1000 credits, 500 crystal

7. **Cloaking Technology** (Tier 4)
   - Requires: Sensors, Shields
   - Bonus: Can hide 20% of fleet
   - Cost: 2000 credits, 1000 crystal

8. **Warp Drive** (Tier 4)
   - Requires: Shields, Propulsion
   - Bonus: +100% fleet movement speed
   - Cost: 2500 credits, 1200 crystal

9. **Quantum Physics** (Tier 5)
   - Requires: Cloaking, Warp Drive
   - Bonus: Unlock quantum weapons
   - Cost: 5000 credits, 2500 crystal

#### Society (8 Technologies)
Focus on diplomacy, culture, and information

1. **Espionage** (Tier 2)
   - Bonus: +20% intel gathering
   - Cost: 900 credits, 400 crystal

2. **Diplomacy** (Tier 1)
   - Bonus: +30% diplomatic influence
   - Cost: 600 credits, 250 crystal

3. **Trade Networks** (Tier 3)
   - Requires: Diplomacy
   - Bonus: +15% trade income
   - Cost: 1100 credits, 500 crystal

4. **Ancient Civilizations** (Tier 4)
   - Requires: Espionage, Sensors
   - Bonus: Discover artifacts (+50% research)
   - Cost: 1800 credits, 900 crystal

5. **Information Systems** (Tier 3)
   - Bonus: +25% communication range
   - Cost: 1000 credits, 450 crystal

6. **Cultural Development** (Tier 2)
   - Bonus: +10% happiness, +5% growth
   - Cost: 700 credits, 300 crystal

7. **Alien Contact** (Tier 4)
   - Requires: Ancient Civilizations
   - Bonus: Can contact alien civilizations
   - Cost: 2000 credits, 1000 crystal

8. **Ancient Weapons** (Tier 5)
   - Requires: Alien Contact
   - Bonus: Unlock ancient technology
   - Cost: 4500 credits, 2200 crystal

#### Engineering (8 Technologies)
Focus on production and infrastructure

1. **Crystal Processing** (Tier 1)
   - Bonus: +8% crystal production
   - Cost: 500 credits, 150 metal

2. **Deuterium Synthesis** (Tier 2)
   - Requires: Crystal Processing
   - Bonus: +12% deuterium production
   - Cost: 800 credits, 350 crystal

3. **Shipyard Upgrade** (Tier 2)
   - Bonus: +20% ship production speed
   - Cost: 900 credits, 400 crystal

4. **Defense Systems** (Tier 3)
   - Requires: Shipyard
   - Bonus: +30% defense building health
   - Cost: 1100 credits, 500 crystal

5. **Robot Factory** (Tier 2)
   - Bonus: Unlock robot units
   - Cost: 700 credits, 320 crystal

6. **Solar Power Plant** (Tier 3)
   - Requires: Energy, Crystal
   - Bonus: +40% energy from solar
   - Cost: 1000 credits, 450 crystal

7. **Nanite Assembler** (Tier 4)
   - Requires: Robot, Solar
   - Bonus: +50% production speed
   - Cost: 2000 credits, 900 crystal

8. **Dyson Sphere** (Tier 5)
   - Requires: Nanite, Solar
   - Bonus: +200% energy production
   - Cost: 4800 credits, 2400 crystal

### 2. Combat System

**Battle Resolution:**

1. **Pre-Combat Phase**
   - Armies positioned
   - Bonuses calculated (research, tech)
   - Initial positioning matters

2. **Combat Phase (5 rounds)**
   ```
   For each round:
     1. Calculate attacker damage = attacker_attack × (1 + attack_bonus)
     2. Calculate defender reduction = defender_armor × (1 + armor_bonus)
     3. Actual damage = max(1, attacker_damage - defender_reduction)
     4. Apply to defender health
     5. If defender health <= 0: Unit destroyed
   ```

3. **Post-Combat Phase**
   - Calculate casualties
   - Award experience to survivors
   - Update battle logs
   - Determine winner

**Example Combat:**
```
Attacker: 10 Fighters (10 attack, 5 armor, 20 health each)
Defender: 5 Corvettes (15 attack, 8 armor, 30 health each)

Round 1:
  Fighters attack:
    Damage = 10 × 1.1 (research bonus) = 11
    Reduction = 8 × 1.05 = 8.4
    Actual damage = 11 - 8.4 = 2.6 per corvette
    5 corvettes × 2.6 = 13 damage total → Kills 1 corvette (30 health)
  
  Corvettes attack:
    Damage = 15 × 1.1 = 16.5
    Reduction = 5 × 1.08 = 5.4
    Actual damage = 16.5 - 5.4 = 11.1 per fighter
    5 corvettes × (11.1 × 1) = 55.5 damage → Kills 2.7 = 3 fighters

Round 2-5: Similar calculations...

Result: Fighters win with ~4 survivors
```

### 3. Expedition System

**Expedition Types:**

#### Exploration
- **Duration:** 10-30 turns
- **Fleet:** Small (5-10 ships)
- **Objective:** Discover new worlds, gather resources
- **Rewards:** Resources (+500 metal/crystal), Research bonus (+5%)
- **Encounters:** Mineral deposits, ancient ruins, hostile aliens

#### Military
- **Duration:** 20-40 turns
- **Fleet:** Large (20-50 ships)
- **Objective:** Conquer enemy territories
- **Rewards:** Territory control, resources from conquest
- **Encounters:** Enemy fleets, defense stations, reinforcements

#### Scientific
- **Duration:** 15-35 turns
- **Fleet:** Medium (10-20 ships)
- **Objective:** Discover new technologies
- **Rewards:** Instant tech unlock, research bonus
- **Encounters:** Ancient technology, scientific phenomena

#### Trade
- **Duration:** 5-15 turns
- **Fleet:** Small (2-5 ships)
- **Objective:** Establish trade routes
- **Rewards:** Recurring trade income, alliances
- **Encounters:** Trade opportunities, piracy, negotiations

#### Conquest
- **Duration:** 30-50 turns
- **Fleet:** Very Large (50+ ships)
- **Objective:** Annex entire star systems
- **Rewards:** New colonies, massive resources
- **Encounters:** Heavy combat, negotiations, natural disasters

**Expedition Mechanics:**
```typescript
interface Expedition {
  id: string;
  leaderId: string;           // Player leading expedition
  name: string;
  type: "exploration" | "military" | "scientific" | "trade" | "conquest";
  targetCoordinates: string;  // Galaxy coordinates [X:Y:Z]
  status: "preparing" | "in_progress" | "completed" | "failed";
  fleetComposition: {         // Ships
    corvettes: number;
    destroyers: number;
    cruisers: number;
    // ...
  };
  troopComposition: {         // Ground units
    soldiers: number;
    scouts: number;
    tanks: number;
    // ...
  };
  discoveries: any[];         // Found resources, artifacts
  casualties: Record<string, number>;
  resources: Record<string, number>;
  startedAt: Date;
  completedAt?: Date;
}
```

### 4. Research System

**Research Mechanics:**
- One active research at a time
- Can queue multiple researches
- Research points accumulate from labs
- Each tech has prerequisites
- Completion instantly unlocks benefits

**Research Bonuses:**
- Production increases (metal, crystal, deuterium, energy)
- Military bonuses (damage, armor, speed)
- Building bonuses (construction time, capacity)
- Special abilities (cloaking, shields, sensors)

### 5. Diplomacy & Alliance System

**Alliance Features:**
- Create alliances
- Set diplomatic status (ally, neutral, hostile)
- Share research with allies
- Mutual defense pacts
- Trade agreements
- Sanctions on hostile empires

**Diplomatic Actions:**
- Declare War (50% damage bonus vs target)
- Make Peace (restore relations)
- Trade Resources (player-to-player)
- Form Alliance (group up to 5 empires)
- Apply Sanctions (reduce target production)
- Sign Non-Aggression Pact (temporary peace)

### 6. Market System

**Trading Mechanics:**
- Players post buy/sell orders
- Orders match when price meets
- 2% transaction fee
- Market history tracks all trades
- Prices fluctuate based on supply/demand

**Strategies:**
- Buy low, sell high (speculation)
- Bulk buying to corner market
- Price fixing with allies
- Market manipulation (controversial)

---

## Progression Systems

### 1. Empire Level System

**Levels:** 1-50+ (infinite scale)

| Level | Milestone | Features Unlocked |
|-------|-----------|-------------------|
| 1 | Game Start | Basic buildings, 1 colony |
| 5 | Early Expansion | 2nd colony, advanced units |
| 10 | Mid Game | Alliances, market access |
| 15 | Advanced Tech | Tier 3 technologies |
| 20 | War | Large fleet capacity |
| 25 | Dominion | 5+ colonies, advanced diplomacy |
| 30+ | Endgame | Ancient technologies, galaxy control |

### 2. Kardashev Scale

Measures civilization advancement:

**Scale:**
```
0.1 - 10% planetary energy
0.5 - 50% planetary energy
1.0 - 100% planetary energy control (peak civilization)
1.5 - Multi-star system control
2.0 - Galaxy control
3.0 - Universal control (theoretical)
```

**Advancement:**
- Each completed tech adds 0.05-0.2 to scale
- Resource production increases scale
- Colony count increases scale
- Reaches max at ~1.8 (full galaxy control)

### 3. Achievement System

**Achievements:**
- First Settlement (1 colony)
- Researcher (5 technologies)
- Admiral (50 ships)
- Diplomat (2 alliances)
- Conqueror (3 enemy planets)
- Wealthy (1M credits)
- Ancient One (discover artifact)
- Galaxy Master (50% map explored)

---

## Balancing

### Economy Balance

**Resource Generation:**
- Turn 1: +10 metal, +5 crystal
- Turn 10: +50 metal, +25 crystal, +10 deuterium
- Turn 100: +500 metal, +250 crystal, +100 deuterium

**Unit Costs:**
- Fighter: 10 metal, 5 crystal (1 turn)
- Corvette: 20 metal, 10 crystal (2 turns)
- Destroyer: 50 metal, 30 crystal (5 turns)
- Cruiser: 100 metal, 75 crystal (10 turns)

**Building Costs:**
- Level 1: 100 metal
- Level 5: 500 metal
- Level 10: 1000 metal
- Level 15+: Exponential scaling

### Combat Balance

**Armor vs Damage:**
- Without research: Armor = 50% damage reduction
- With research: Armor = 60-75% reduction
- Prevents full dominance by one strategy

**Fleet Composition:**
- Small fast units vs large slow units (rock-paper-scissors)
- Diverse fleet > single unit type
- Incentivizes tactical thinking

### Research Balance

**Early Game Advantage:** First movers get 10% bonus on first 3 techs
**Mid Game Catch-up:** Techs cost same for all players
**Late Game Balance:** Most powerful techs same for everyone

---

## Victory Conditions

### Military Victory
- Conquer 50% of star systems
- Win 10 major battles
- Control territory: 30+ planets

**Win Condition:** Achieve all three milestones

### Economic Victory
- Accumulate 10M credits
- Trade with 5+ players regularly
- Control market: Buy orders > 1M credits

**Win Condition:** Achieve all three milestones

### Scientific Victory
- Research all 25 technologies
- Reach Kardashev scale 1.8+
- Unlock all ancient technologies

**Win Condition:** Achieve all three milestones

### Diplomatic Victory
- Form 5-player alliance
- All alliance members agree on victory
- Have 80% player support vote

**Win Condition:** Alliance maintains 10 consecutive turns in power

---

## Inspiration & References

### Design Inspiration
- **Stellaris** - Technology tree, empire progression, galaxy exploration
- **Civilization** - Turn-based gameplay, research systems, resource management
- **Master of Orion** - Space 4X mechanics, fleet combat, diplomacy
- **StarCraft** - Combat mechanics, unit balance, strategic depth

### Unique Elements
- **Expedition system** - Combines exploration with resource gathering
- **Tier-based tech** - Progressive unlocks with clear progression
- **Multi-victory paths** - Players choose their strategy
- **Real-time turns** - 3-5 turns per minute keeps pace engaging
- **Player interaction** - Market, diplomacy, and trade encourage interaction

---

## Future Expansions

### Planned Features
- Multiplayer campaigns (co-op mode)
- Asteroid mining (resource collection)
- Space stations (orbital infrastructure)
- Terraforming (colony transformation)
- Anomalies (special events affecting gameplay)
- Achievements & statistics
- Seasonal events & tournaments
- Mobile companion app

### Community Features
- Player clans/guilds
- Tournament systems
- Streaming integration
- Custom game modes
- Modding support (future)

---

**End of Game Design Document**

For technical implementation details, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
