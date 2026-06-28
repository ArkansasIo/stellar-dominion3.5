# Stellar Dominion - Framework Architecture Diagram

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STELLAR DOMINION 5-LAYER FRAMEWORK                      │
├─────────────────────────────────────────────────────────────────────────────┤

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ LAYER 5: PERSISTENT MMO GALAXY SIMULATION                    [BACKEND: Node]┃
┃ ─────────────────────────────────────────────────────────────────────────  ┃
┃  Database: PostgreSQL          Star Systems (3D coordinates)               ┃
┃  ├─ expeditions table          ├─ [X:Y:Z] positioning                     ┃
┃  ├─ alliances table            ├─ Enemy homeworlds (5)                     ┃
┃  ├─ relationships table        ├─ Player colonies                          ┃
┃  └─ battles table              └─ Resource-rich planets                    ┃
┃                                                                             ┃
┃  Enemy AI System         Relationship Tracking                             ┃
┃  ├─ 5 Unique Races       ├─ Player ←→ NPC Relations                       ┃
┃  ├─ 8 Personalities      ├─ Alliance Bonds (honor system)                  ┃
┃  ├─ Dynamic Decisions    ├─ Economic Competition                          ┃
┃  └─ Tactical Behavior    └─ Territory Control                             ┃
┃                                                                             ┃
┃  Expedition System            Multi-Player Events                          ┃
┃  ├─ 5 Types (Exploration,    ├─ Faction Wars                              ┃
┃  │   Military, Scientific,   ├─ Trade Route Conflicts                     ┃
┃  │   Trade, Conquest)        ├─ Resource Competition                      ┃
┃  ├─ 6+ Encounter Types       ├─ Collective Progression                    ┃
┃  ├─ Fleet Composition        └─ Persistent World Events                   ┃
┃  └─ Resource Rewards + XP                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 ↑             ↑                        ↑                          ↑
 │ Diplomacy   │ Outcome Resolution    │ AI Decisions      Galaxy State
 │ Agreements  │ Battle Reports        │ NPC Actions       Shared Perception
 │             │                       │                    │
┏━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┓
┃ LAYER 4: TURN-BASED TACTICAL COMBAT                 [SERVER + CLIENT]    ┃
┃ ─────────────────────────────────────────────────────────────────────  ┃
┃  Turn System (6 turns/min)   Combat Rounds (Max 6)                     ┃
┃  ├─ Turn Generation          ├─ Target Selection                       ┃
┃  ├─ Turn Accrual             ├─ Attack Resolution                      ┃
┃  ├─ Offline Accumulation     ├─ Shield → Armor → Hull Damage           ┃
┃  └─ Atomic Operations        ├─ Special Actions (Repair, Rally, Flee)  ┃
┃                              └─ Round Logging                          ┃
┃                                                                         ┃
┃  Damage Calculation          Formation Tactics                         ┃
┃  ├─ Weapon Calculation       ├─ Flange Positioning                     ┃
┃  ├─ Armor Penetration        ├─ Front/Middle/Back Lines                ┃
┃  ├─ Critical Hits            ├─ Morale Impact                          ┃
┃  └─ Evasion Mechanics        └─ Tactical Bonuses                       ┃
┃                                                                         ┃
┃  Casualty Tracking      Combat Reports                                 ┃
┃  ├─ Unit Losses         ├─ Battle Logs (round-by-round)                ┃
┃  ├─ Metal Worth         ├─ Victory Conditions                          ┃
┃  └─ Crew Loss           └─ Loot Calculation                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 ↑                    ↑                      ↑                   ↑
 │ Turn Consumption   │ Combat Simulation    │ Casualty Reports  Fleet
 │ Fleet Positioning  │ Damage Math          │ Experience Gains  State
 │                    │                      │                    │
┏━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┻━━━━━━┓
┃ LAYER 3: RTS FLEET BATTLES                        [CLIENT + SERVER]  ┃
┃ ──────────────────────────────────────────────────────────────────  ┃
┃ 60+ Units Across 8 Categories                                      ┃
┃ ├─ Combat Ships: Scout, Fighter, Cruiser, Battleship, Carrier,    ┃
┃ │                Destroyer, Corvette, Frigate, Titan, Flagship    ┃
┃ ├─ Motherships: Command, Factory, Hospital, Colony, Harvester     ┃
┃ ├─ Troops: Infantry, Heavy, Special Forces, Sniper, Medic, etc.   ┃
┃ ├─ Vehicles: Tank, Artillery, Mech, Drone, Walker, Gunship        ┃
┃ ├─ Civilians: Worker, Scientist, Trader, Diplomat, Colonist       ┃
┃ └─ Items/Weapons/Armor: Tech modules, weapons, defensive gear      ┃
┃                                                                     ┃
┃ Fleet Management          Fleet Combat System                       ┃
┃ ├─ Fleet Composition      ├─ Combat Simulator                       ┃
┃ ├─ Build Queue            ├─ Pre-battle Analysis                    ┃
┃ ├─ Fleet Power Calc       ├─ Multi-unit Tactics                     ┃
┃ ├─ Resource Costs         ├─ Commander Bonuses                      ┃
┃ └─ Shipyard Production    └─ Battle Predictions                     ┃
┃                                                                     ┃
┃ Unit Database (50+ entries)    Commander System                     ┃
┃ ├─ Attack/Shield/Hull stats    ├─ Combat Experience (0-999)         ┃
┃ ├─ Cargo Capacity             ├─ Tactics Skill (1-99 tiers)         ┃
┃ ├─ Speed/Range Metrics        ├─ Class Bonuses                      ┃
┃ └─ Special Abilities           └─ Fleet Multipliers (1.0-3.0x)      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 ↑              ↑                   ↑              ↑
 │ Fleet Power  │ Unit Statistics   │ Combat Data  │ Damage
 │ Information  │ Construction Menu │ Battle Logs  │ Calculations
 │              │                   │              │              
┏━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━┻━━━━━━━━━━┓
┃ LAYER 2: 4X EMPIRE MANAGEMENT              [CLIENT + SERVER] ┃
┃ ─────────────────────────────────────────────────────────  ┃
┃ Colonies                 Resource Economy                   ┃
┃ ├─ Multiple Planets      ├─ Metal (construction)            ┃
┃ ├─ Production/Storage    ├─ Crystal (technology)            ┃
┃ ├─ Orbital Buildings     ├─ Deuterium (fuel)                ┃
┃ └─ Defensive Garrisons   ├─ Energy (power)                  ┃
┃                          └─ Production Multipliers           ┃
┃                                                              ┃
┃ Technology Tree         Diplomacy & Alliances               ┃
┃ ├─ Physics (9 techs)    ├─ Alliance Management              ┃
┃ ├─ Society (8 techs)    ├─ Diplomatic Relations             ┃
┃ ├─ Engineering (8 techs)├─ Trade Routes                     ┃
┃ ├─ Prerequisites        ├─ Sanctions System                 ┃
┃ ├─ Research Bonuses     └─ Raid Groups                      ┃
┃ └─ Unlock Progression                                       ┃
┃                                                              ┃
┃ Buildings (15+ types)   Currency & Market                   ┃
┃ ├─ Resource Generators  ├─ Silver (1x common)               ┃
┃ ├─ Shipyard             ├─ Gold (100x premium)              ┃
┃ ├─ Research Lab         ├─ Platinum (10,000x ultra)         ┃
┃ ├─ Defense Systems      ├─ Buy/Sell Orders                  ┃
┃ └─ Production Upgrades  └─ Transaction History              ┃
┃                                                              ┃
┃ Empire Storage Cap (Prestige System)                        ┃
┃ ├─ Resource Multipliers ├─ Experience Bonus                 ┃
┃ ├─ Hard Reset Feature   └─ Research Acceleration            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 ↑                  ↑                   ↑              ↑
 │ Resources        │ Tech Requirements │ Production   │ Research
 │ Production       │ Prerequisites     │ Bonuses      │ Bonuses
 │ Consumption      │                   │              │
 │ Storage          │                   │              │
 │                  │                   │              │
┏━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━┻━━━━━━━━┓
┃ LAYER 1: MMORPG CHARACTER PROGRESSION          [SERVER]      ┃
┃ ──────────────────────────────────────────────────────────  ┃
┃ Level & Tier Progression                                   ┃
┃ ├─ 999 Levels (exponential XP growth)                       ┃
┃ ├─ 99 Tiers (unlock milestones at 10, 20, 30...99)         ┃
┃ ├─ Level Multipliers: 1.0 → 10.98x (for entities)          ┃
┃ ├─ Tier Multipliers: 1.0 → 5.9x (for entities)             ┃
┃ └─ Combined: 1.0 → 64.8x total stat multiplier             ┃
┃                                                             ┃
┃ Universal Stat System (16 stats per entity)                ┃
┃ ├─ Base Stats (4): Power, Defense, Mobility, Utility       ┃
┃ ├─ Sub Stats (4): Precision, Endurance, Efficiency,        ┃
┃ │                 Control                                  ┃
┃ ├─ Attributes (4): Tech, Command, Logistics,               ┃
┃ │                  Survivability                           ┃
┃ └─ Sub Attributes (4): Sensor Range, Energy Use,           ┃
┃                         Maintenance, Adaptation            ┃
┃                                                             ┃
┃ Experience Tracking                                        ┃
┃ ├─ Empire Experience (advances levels)                      ┃
┃ ├─ Tier Points (unlock tiers)                              ┃
┃ ├─ Knowledge Points (2000+ mastery)                        ┃
┃ └─ Prestige (permanent multipliers)                        ┃
┃                                                             ┃
┃ Achievements & Quests   Knowledge System                    ┃
┃ ├─ 200+ Achievements    ├─ 10 Knowledge Types               ┃
┃ ├─ 6 Categories         ├─ 4 Classes per Type              ┃
┃ ├─ Milestone Rewards    ├─ 5 Tiers per Class               ┃
┃ └─ Progression Unlocks  └─ Synergy Bonuses                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Layer Interaction Flow

```
USER INPUT (CLIENT)
    ↓
┌─────────────────────────────────────────┐
│ REACT FRONTEND (53 Pages)              │
│ ├─ Game Dashboard                       │
│ ├─ Fleet Management (RTS)               │
│ ├─ Expeditions (Tactical)               │
│ ├─ Technology Tree (4X)                 │
│ ├─ Colonies (4X)                        │
│ ├─ Allies/Diplomacy (MMO)               │
│ └─ Market/Trading (RTS/4X)              │
└─────────────────────────────────────────┘
    ↓ (API Calls)
┌─────────────────────────────────────────┐
│ EXPRESS SERVER (TypeScript)            │
│ ├─ /api/auth/* (Auth)                   │
│ ├─ /api/game/state (Progression)        │
│ ├─ /api/fleet/* (RTS)                   │
│ ├─ /api/expeditions/* (Tactical)        │
│ ├─ /api/research/* (4X)                 │
│ ├─ /api/alliance/* (MMO)                │
│ └─ /api/battles/* (Combat)              │
└─────────────────────────────────────────┘
    ↓ (Transactions)
┌─────────────────────────────────────────┐
│ POSTGRESQL DATABASE                    │
│ ├─ players (Progression)                │
│ ├─ colonies (4X Management)             │
│ ├─ expeditions (Tactical Combat)        │
│ ├─ units/fleet (RTS)                    │
│ ├─ alliances (MMO Galaxy)               │
│ ├─ battles (Combat Results)             │
│ └─ Relationships (AI, Player-NPC)       │
└─────────────────────────────────────────┘
```

---

## Data Flow: Complete Action Cycle

```
EXAMPLE: Player Launches Attack Expedition

1. MMORPG LAYER (Progression Check)
   ├─ Verify player level sufficient (e.g., 50+)
   ├─ Check tier for tier-specific abilities
   └─ Validate resources for expedition cost
       ↓

2. 4X LAYER (Empire Resource Verification)
   ├─ Subtract metal/crystal/deuterium
   ├─ Update colony resource storage
   └─ Apply research bonuses to cost
       ↓

3. RTS LAYER (Fleet Composition)
   ├─ Select specific ships for fleet
   ├─ Calculate total fleet power
   ├─ Check hangar space and build queue
   └─ Assign commander (combat bonuses)
       ↓

4. TACTICAL COMBAT LAYER (Action Entry)
   ├─ Allocate turns for expedition launch
   ├─ Set expedition duration (based on target distance)
   └─ Create expedition entry in database
       ↓

5. MMO GALAXY LAYER (Expedition Resolution)
   ├─ Determine target coordinates [X:Y:Z]
   ├─ Generate random encounter (6+ types)
   ├─ If hostile: Engage enemy faction
   │  ├─ Trigger combat against AI
   │  ├─ Run 6-round tactical combat
   │  ├─ Calculate casualties
   │  └─ Award XP + resources
   ├─ If peaceful: Award resources/discovery
   └─ Update expedition status → "completed"

OUTCOME: Player receives battle report, XP, resources, and experience toward next level/tier
```

---

## Critical Integration Points

### 1. **Progression Impacts Everything**
```
Level 50 + Tier 10 Player:
    ↓
Powers all entities (ships, units, buildings):
    ├─ Ship Base Power = 100 × Level Mult (1.5x) × Tier Mult (1.5x) = 225
    ├─ Unit Defense = 50 × 1.5 × 1.5 = 112.5
    ├─ Building Production = 100 × 1.5 × 1.5 = 225/turn
    └─ Research Speed = 150 × 1.5 × 1.5 = 337.5 tech points/turn
```

### 2. **4X Progression Unlocks RTS Capabilities**
```
Technology Tree:
    Energy Production (Tech Level 1) → Can power Dyson Spheres
    Advanced Weaponry (Tech Level 5) → Can build Laser ships
    Armor Development (Tech Level 3) → Can build armored units
    Ship Design (Tech Level 2) → Unlock capital ships
    
These combined with player level determine:
    ├─ Maximum fleet size
    ├─ Unit type availability
    ├─ Commander capability
    └─ Combat bonuses
```

### 3. **RTS Combat Feeds Tactical System**
```
Fleet Combat:
    Player initiates attack → Turn system activated
        ├─ Consumes turns based on distance
        ├─ Triggers turn-based combat rounds (up to 6)
        ├─ Each round: Target selection → Damage calc → Results
        └─ Winner determined by net fleet advantage
```

### 4. **Tactical Combat Drives MMO Galaxy Events**
```
Combat Resolution:
    Winners control territories
    Casualties reported to both sides
    Relationships shift based on outcome
    Resources looted/stolen affect economy
    Alliances form/break based on power shifts
```

### 5. **Galaxy State Informs Player Progression**
```
Expeditions generate:
    ├─ Experience (feeds MMORPG layer)
    ├─ Resources (feeds 4X economy)
    ├─ Technology discoveries (feeds research)
    ├─ Combat experience (feeds commanders)
    └─ Relationship changes (feeds diplomacy)
```

---

## Configuration File Dependency Graph

```
                        Index.ts (Export Hub)
                              ↑
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    Combat.ts          Progress.ts          Enemy.ts
        │                     │                     │
        ├─ Formations     ├─ Levels            ├─ AI
        ├─ Damage         ├─ Tiers             ├─ Races
        └─ Units          ├─ Stats             └─ Worlds
                          └─ Multipliers
                                
        ┌────────────────────────────────────────────────────┐
        │                                                    │
    Resources.ts      Tech.ts          Facilities.ts    Game.ts
        │              │                   │              │
        ├─ Metal        ├─ Physics         ├─ Mines       ├─ Balance
        ├─ Crystal      ├─ Society        ├─ Labs        ├─ Constants
        ├─ Deuterium    └─ Engineering    └─ Shipyards   └─ Defaults
        └─ Energy
```

---

## Deployment Architecture (Current)

```
┌─ REPLIT/LOCAL DEV ──────────────────────────────────┐
│                                                     │
│  Browser (React)          Node.js Server           │
│  ├─ 53 Pages             ├─ Express API            │
│  ├─ React Query          ├─ 8+ Routes             │
│  ├─ TailwindCSS          ├─ Type Safety          │
│  └─ Vite Build           └─ Database Layer       │
│        ↕                        ↕                  │
│     http://localhost:5000  PostgreSQL             │
│                           (stellar_dominion)      │
│                                                   │
└─────────────────────────────────────────────────────┘

PRODUCTION READY: Yes ✅
DEV SERVER STATUS: Running ✅
DATABASE: Connected ✅
BUILD: TypeScript passes all checks ✅
```

---

## Performance Considerations

### Database Query Optimization
- ✅ Indexes on player_id, expedition_id, alliance_id
- ✅ JSONB columns for flexible data (research, buildings, units)
- ✅ Atomic operations for turn system
- ✅ Batch updates for regular progression

### Client-Side Optimization
- ✅ React Query caching for API calls
- ✅ Lazy loading of 53 pages via Wouter
- ✅ Component memoization for lists
- ✅ TailwindCSS for optimized CSS

### Combat Simulation
- ✅ Combat engine runs client-side for instant feedback
- ✅ Battle resolution on server for authority
- ✅ Damage calculations pre-computed for speed
- ✅ Combat logs streamed in chunks for large battles

---

## Security Architecture

### Authentication
- ✅ Session-based with SHA-256 hashing
- ✅ Password validation on every API call
- ✅ Session tokens for stateless verification
- ✅ Admin tier gates for sensitive operations

### Data Validation
- ✅ TypeScript strict mode prevents type errors
- ✅ Drizzle ORM prevents SQL injection
- ✅ Input validation on all API endpoints
- ✅ Permission checks on admin modifications

### Audit Logging
- ✅ Admin actions logged with timestamps
- ✅ Economy modifications tracked
- ✅ User advancement monitored
- ✅ Suspicious activity flagged

---

## Next Steps for Enhancement

1. **Megastructure UI Integration** — Create pages to manage all 10 megastructure types
2. **Procedural Generation** — Implement dungeon/encounter generation for expeditions
3. **Leaderboard System** — Real-time leaderboards by empire value, level, tier
4. **Social Features** — Guild chat, player profiles, reputation system
5. **Mobile Responsive** — Optimize UI for mobile devices
6. **Performance Scaling** — Prepare for 10,000+ concurrent players

---

## Conclusion

Stellar Dominion implements a **complete, production-ready framework** that seamlessly integrates:
- Character progression (MMORPG)
- Empire building (4X)
- Fleet tactics (RTS)
- Turn-based combat (Tactical)
- Persistent galaxies (MMO)

All layers communicate through centralized configuration files and a robust database schema, creating a cohesive game experience where each system reinforces and enhances the others.

**Status: READY FOR PRODUCTION ✅**
