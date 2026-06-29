# World of Warships-Style Technology Tree System

Branching progression system for Stellar Dominion — each race has a unique tech tree with fork points, side branches, and cross-dependencies.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Tree Structure](#tree-structure)
3. [Race-Specific Trees](#race-specific-trees)
4. [Fork Points & Branching Logic](#fork-points--branching-logic)
5. [Shared Modules](#shared-modules)
6. [Tier Progression](#tier-progression)
7. [Research Mechanics](#research-mechanics)
8. [Cross-Branch Dependencies](#cross-branch-dependencies)
9. [Full Tree Diagrams](#full-tree-diagrams)
10. [Implementation](#implementation)

---

## Design Philosophy

Inspired by World of Warships tech trees:

- **Main trunk** — linear core progression every player follows
- **Fork points** — at specific tiers, players choose between 2-3 specializations
- **Side branches** — optional research paths for niche advantages
- **Shared modules** — weapons/engines/shields usable across multiple hulls
- **Race identity** — each race's tree reflects their biology and philosophy
- **Meaningful choices** — no "wrong" pick, just different playstyles

---

## Tree Structure

### Node Types

| Type | Symbol | Description |
|------|--------|-------------|
| Trunk | `T` | Main progression — must research to advance |
| Fork | `F` | Branch point — choose 1 of 2-3 paths |
| Side | `S` | Optional side branch — bonus techs |
| Shared | `M` | Module — reusable across branches |
| Capstone | `C` | Tier capstone — ultimate tech for that tier |
| Apex | `A` | Final tier unlock — race-defining technology |

### Visual Notation

```
[T1]──[T2]──[T3]──[F]──┬──[T4a]──[T5a]──[C]
                        └──[T4b]──[T5b]──[C]
                              │
                              └──[S] (side branch)
```

---

## Race-Specific Trees

Each race has **5 main branches** mirroring WoWs ship classes:

| Branch | WoWs Equivalent | Stellar Dominion Focus |
|--------|----------------|----------------------|
| **Hull** | Ship hulls | Empire infrastructure, buildings, defenses |
| **Weapons** | Main battery | Offensive technologies, ship weapons |
| **Propulsion** | Engines | Movement, FTL, fleet speed |
| **Systems** | Fire control / AA | Computing, sensors, intelligence |
| **Special** | Unique branch | Race-defining specialty |

### Hull Branch (Empire Infrastructure)

**Trunk:**
```
Colony Foundation → Planetary Gov → Orbital Network → Deep Space Hub → Stellar Citadel → Galactic Core
```

**Fork Points:**

| Tier | Fork | Path A | Path B | Path C |
|------|------|--------|--------|--------|
| 2 | Military vs Economic | Military Academy | Trade Hub | — |
| 4 | Fortification vs Mobility | Fortress World | Nomad Fleet | — |
| 6 | Specialization | Science Nexus | War Factory | Ecumenopolis |
| 8 | Philosophy | Authoritarian Spire | Democratic Council | Hive Nexus |

### Weapons Branch

**Trunk:**
```
Kinetic Projectiles → Energy Beams → Directed Plasma → Antimatter → Singularity → Exotic Matter
```

**Fork Points:**

| Tier | Fork | Path A | Path B | Path C |
|------|------|--------|--------|--------|
| 2 | Range vs Damage | Long-Range Battery | Close-Range Burst | — |
| 4 | Area vs Precision | Swarm Missiles | Sniper Railgun | — |
| 6 | Energy vs Kinetic | Particle Beam | Kinetic Lance | — |
| 8 | Destruction vs Control | Nova Bomb | Stasis Field | — |

### Propulsion Branch

**Trunk:**
```
Ion Thrusters → Fusion Drive → Ion Pulse → Warp Drive → Fold Drive → Transcendence
```

**Fork Points:**

| Tier | Fork | Path A | Path B |
|------|------|--------|--------|
| 2 | Speed vs Range | Fast Drive | Long-Range Drive |
| 4 | Combat vs Economic | Combat Maneuvers | Colony Transport |
| 6 | Conventional vs Exotic | Improved Warp | Rift Drive |
| 8 | Transcendence Path | Dimensional Shift | Void Walking |

### Systems Branch

**Trunk:**
```
Basic Sensors → Radar Grid → Quantum Scanners → AI Network → Hive Intelligence → Singularity Mind
```

**Fork Points:**

| Tier | Fork | Path A | Path B |
|------|------|--------|--------|
| 2 | Detection vs Stealth | Scanner Array | ECM Suite |
| 4 | Electronic vs Psychic | Cyber Warfare | Telepathy |
| 6 | Individual vs Collective | AI Advisor | Collective Mind |
| 8 | Transcendence | Omniscience | Hive God |

### Special Branch (Race-Unique)

Each race has a completely unique 5th branch:

| Race | Special Branch | Theme |
|------|---------------|-------|
| Terran | Adaptability | Versatile hybrid techs, quick respec |
| Aquarian | Bio-Integration | Organic ships, living weapons |
| Mechborn | Singularity | Pure machine perfection, zero-point energy |
| Lithoid | Crystal Resonance | Mineral-based superweapons |
| Zypherian | Swarm Evolution | Exponential growth, overwhelming numbers |
| Vortexborn | Dimensional | Phase-shifting, reality warping |
| Silicate | Harmonic | Frequency weapons, resonance shields |
| Ethereal | Transcendence | Spirit tech, quantum states |

---

## Fork Points & Branching Logic

### Fork Mechanic

When a player reaches a `Fork` node:

1. All child paths are **unlocked simultaneously** for preview
2. Player **chooses one path** to actively research
3. The other paths remain visible but locked
4. **Re-spec available** at a cost (credits + time penalty)

### Fork Categories

| Fork Type | Description | Example |
|-----------|-------------|---------|
| **Binary** | Choose A or B | Speed vs Range drive |
| **Trinary** | Choose A, B, or C | Science Nexus / War Factory / Ecumenopolis |
| **Mutually Exclusive** | Can never have both | Authoritarian vs Democratic |
| **Soft Fork** | Can eventually research both (expensive) | Weapon type A vs B |
| **Hard Fork** | Permanent choice | Race-defining philosophy at Tier 8 |

### Fork Resolution

```typescript
interface ForkPoint {
  id: string;
  tier: number;
  type: 'binary' | 'trinary' | 'mutually_exclusive' | 'soft' | 'hard';
  options: ForkOption[];
  unlockedBy: string[];  // prerequisite tech IDs
}

interface ForkOption {
  id: string;
  name: string;
  branchPath: string[];  // tech IDs in this path
  description: string;
  playstyle: string;
  tradeoffs: {
    bonus: string;
    penalty: string;
  };
}
```

---

## Shared Modules

Like WoWs shared hull modules, certain techs can be equipped across multiple branches:

### Weapon Modules (Shared Across Hull Types)

| Module | Tier | Stats | Compatible Hulls |
|--------|------|-------|-----------------|
| Light Laser | 1 | 50 DPS, 5km range | All |
| Plasma Torch | 3 | 120 DPS, 3km range | Frigate, Destroyer |
| Kinetic Battery | 5 | 200 DPS, 8km range | Cruiser, Battleship |
| Antimatter Lance | 7 | 500 DPS, 10km range | Battleship, Dreadnought |
| Singularity Beam | 9 | 1000 DPS, 12km range | Dreadnought only |

### Engine Modules

| Module | Tier | Speed | Fuel | Compatible |
|--------|------|-------|------|-----------|
| Ion Thruster | 1 | +20% | Standard | All |
| Fusion Drive | 3 | +40% | Deuterium | All |
| Warp Nacelle | 5 | +60% | Crystal | Cruiser+ |
| Fold Drive | 7 | +80% | Exotic | Battleship+ |

### Shield Modules

| Module | Tier | HP | Regen | Compatible |
|--------|------|-----|-------|-----------|
| Basic Shield | 1 | 100 | 1/s | All |
| Deflector | 3 | 250 | 3/s | All |
| Barrier | 5 | 500 | 5/s | Cruiser+ |
| Null Field | 7 | 1000 | 10/s | Battleship+ |

---

## Tier Progression

### 10 Tiers (WoWs-Style)

| Tier | Name | Unlock Requirement | Research Cost Multiplier | Time Multiplier |
|------|------|-------------------|-------------------------|-----------------|
| I | Starter | Account creation | 1× | 1× |
| II | Developing | Tier I capstone | 2× | 2× |
| III | Established | Tier II capstone + 1000 turns | 4× | 3× |
| IV | Advanced | Tier III fork completion | 8× | 5× |
| V | Elite | Tier IV capstone + empire level 100 | 16× | 8× |
| VI | Master | Tier V capstone + empire level 200 | 32× | 12× |
| VII | Legendary | Tier VI fork + alliance rank 5 | 64× | 20× |
| VIII | Mythical | Tier VII capstone + empire level 500 | 128× | 30× |
| IX | Transcendent | Tier VIII fork + prestige 1 | 256× | 50× |
| X | Apex | Tier IX capstone + all branches forked | 512× | 80× |

### Tier Unlock Gates

Each tier requires:
1. **Previous tier capstone** researched
2. **Empire level** threshold met
3. **Turn count** minimum reached
4. **Fork decisions** from previous tier completed
5. **Resource stockpile** minimum (proves economic readiness)

---

## Research Mechanics

### Research Queue

```
┌─────────────────────────────────────────┐
│           RESEARCH QUEUE                │
│  [Slot 1] ████████░░ 80%  - 2h 30m     │
│  [Slot 2] ███░░░░░░░ 30%  - 8h 15m     │
│  [Slot 3] ░░░░░░░░░░ 0%   - queued     │
│  [Slot 4] 🔒 Unlock at Tier V          │
└─────────────────────────────────────────┘
```

### Research Speed Factors

| Factor | Modifier | Source |
|--------|----------|--------|
| Lab Level | +10% per level | Building upgrade |
| Government Bonus | +5-25% | Government type |
| Race Bonus | +5-20% | Species trait |
| Commander Skill | +2-15% | Commander tech tree |
| Alliance Bonus | +3-10% | Alliance research sharing |
| Overwork Penalty | -20% | >3 active research |
| Focus Bonus | +30% | Single research focus |

### Research Cost Formula

```
baseCost = tier_base × 2^(tier-1) × 1.5^(level-1)
finalCost = baseCost × race_modifier × government_modifier
researchTime = ceil(finalCost / research_speed) turns
```

### XP & Discovery

```
researchXP = researchCost × 0.1
discoveryChance = 15% + (streak × 2%) + (lab_level × 1%)
discoveryBonus = random(tech_unlock, resource_bonus, speed_boost, breakthrough)
```

---

## Cross-Branch Dependencies

### Dependency Types

| Type | Description | Example |
|------|-------------|---------|
| **Hard Gate** | Must have prerequisite | Weapons Tier 4 requires Hull Tier 3 |
| **Soft Gate** | Bonus if prerequisite met | Shield +20% if Hull Tier 5 researched |
| **Cross-Link** | Two branches feed into one | Weapons + Propulsion → Missile Platform |
| **Convergence** | Multiple paths merge | Tier 7 requires 3 of 5 branches |
| **Divergence** | One tech splits across branches | AI Core enables Computing AND Sensors |

### Cross-Branch Map

```
Hull ──────────┬──────────────────┐
               │                  │
Weapons ───────┼──→ Tier 6 ──────┤
               │    Capstone     │
Propulsion ────┼──────────────────┤
               │                  │
Systems ───────┴──→ Tier 7 ──────┤
                            Gate  │
Special ────────────────────────→ Tier 8 Apex
```

### Convergence Requirements

| Tier | Requirement |
|------|-------------|
| Tier 6 | Hull + Weapons (any fork) |
| Tier 7 | 3 of 5 branches at Tier 6 |
| Tier 8 | All 5 branches at Tier 7 |
| Tier 9 | Tier 8 capstone + prestige |
| Tier 10 | Tier 9 + all branches forked + apex research |

---

## Full Tree Diagrams

### Terran Tree (Sample)

```
TIER I: Starter
  [Colony Foundation] ── [Basic Kinetics] ── [Ion Thrusters] ── [Basic Sensors] ── [Adaptability Core]

TIER II: Developing
  [Planetary Gov] ── [Laser Battery] ── [Fusion Drive] ── [Radar Grid] ── [Versatile Framework]
       │
       └── [F] Military Academy / Trade Hub

TIER III: Established
  [Orbital Network] ── [Plasma Torches] ── [Ion Pulse] ── [Quantum Scanners] ── [Hybrid Hull]
       │                    │
       └── [F] Fortress World / Nomad Fleet
                    │
                    └── [S] Orbital Weapons Platform

TIER IV: Advanced
  [Deep Space Hub] ── [Antimatter Weapons] ── [Warp Drive] ── [AI Network] ── [Adaptive AI]
       │
       └── [F] Science Nexus / War Factory / Ecumenopolis

TIER V: Elite
  [Stellar Citadel] ── [Singularity Weapons] ── [Fold Drive] ── [Hive Intelligence] ── [Rapid Adaptation]
       │
       └── [F] Authoritarian Spire / Democratic Council

TIER VI: Master — CAPSTONE: Terran Convergence
  Requires: Hull + Weapons Tier 5
  [Galactic Core] ── [Exotic Matter] ── [Transcendence] ── [Singularity Mind] ── [Universal Adaptability]

TIER VII: Legendary — GATE: 3 of 5 branches
  [Terran Ascendancy] ── [Nova Weaponry] ── [Void Walking] ── [Omniscience] ── [Terran Legacy]

TIER VIII: Mythical
  [Empire Eternal] ── [Star Buster] ── [Dimensional Shift] ── [Hive God] ── [Species Perfection]

TIER IX: Transcendent — Requires Prestige 1
  [Transcendent Core] ── [Reality Cutter] ── [Phase Shift] ── [Cosmic Mind] ── [Transcendence]

TIER X: Apex — Requires ALL branches + Apex Research
  [TERRAN APEX: The Inevitable]
  "Your empire becomes the standard by which all others are measured."
```

### Aquarian Tree (Sample — Bio-Theme)

```
TIER I: Starter
  [Coral Colony] ── [Bioluminescent Spines] ── [Current Rider] ── [Tidal Sense] ── [Symbiotic Core]

TIER II: Developing
  [Reef Network] ── [Acid Spray] ── [Deep Vent Drive] ── [Hydrophone Array] ── [Living Hull]
       │
       └── [F] Warrior Caste / Scholar Caste

TIER III: Established
  [Tidal Station] ── [Thermal Vent Projector] ── [Pressure Wave] ── [Coral Computer] ── [Bio-Armor]
       │
       └── [F] Leviathan Path / Symbiote Path

TIER IV: Advanced
  [Abyssal Hub] ── [Kraken Tentacle Array] ── [Abyssal Current] ── [Coral Network] ── [Regeneration]
       │
       └── [F] Deep One / Surface Dweller

TIER V: Elite
  [Leviathan Citadel] ── [Maelstrom Cannon] ── [Tidal Gate] ── [Abyssal Intelligence] ── [Living Weapons]
       │
       └── [F] The Deep / The Surface

TIER VI: Master — CAPSTONE: Aquarian Convergence
  [Oceanic Core] ── [Abyssal Annihilator] ── [Tsunami Drive] ── [Oceanic Mind] ── [Living Fleet]

TIER VII: Legendary
  [Tidal Ascendancy] ── [Maelstrom Nova] ── [Depth Charge FTL] ── [Hive Ocean] ── [Abyssal Legacy]

TIER VIII: Mythical
  [Eternal Ocean] ── [World Ender] ── [Dimensional Current] ── [Oceanic God] ── [Species Apex]

TIER IX: Transcendent
  [Transcendent Tide] ── [Entropy Beam] ── [Phase Tide] ── [Cosmic Ocean] ── [Transcendence]

TIER X: Apex — AQUARIAN APEX: The Eternal Tide
  "The ocean does not erode — it adapts, it surrounds, it consumes."
```

### Mechborn Tree (Sample — Machine-Theme)

```
TIER I: Starter
  [Assembly Line] ── [Pulse Laser] ── [Hover Drive] ── [Basic CPU] ── [Efficiency Matrix]

TIER II: Developing
  [Factory Complex] ── [Auto-Cannon] ── [Jet Drive] ── [Network Node] ── [Overclocking]
       │
       └── [F] War Machine / Production Machine

TIER III: Established
  [Orbital Yard] ── [Plasma Conduit] ── [Quantum Drive] ── [Processing Core] ── [Self-Repair]
       │
       └── [F] Annihilator / Constructor

TIER IV: Advanced
  [Mega-Factory] ── [Beam Array] ── [Phase Translocator] ── [AI Core] ── [Nanite Swarm]
       │
       └── [F] Destroyer Mind / Builder Mind

TIER V: Elite
  [Singularity Forge] ── [Singularity Cannon] ── [Fold Engine] ── [Godlike AI] ── [Perfect Machine]
       │
       └── [F] Utopian Perfection / Total War

TIER VI: Master — CAPSTONE: Mechborn Convergence
  [Infinite Engine] ── [Reality Shredder] ── [Zero-Point Drive] ── [Cosmic Computer] ── [Machine God]

TIER VII: Legendary
  [Machine Ascendancy] ── [Annihilation Array] ── [Dimensional Engine] ── [Infinite Mind] ── [Machine Legacy]

TIER VIII: Mythical
  [The Singularity] ── [Star Forger] ── [Reality Engine] ── [Omniscient Network] ── [Species Perfection]

TIER IX: Transcendent
  [Transcendent Machine] ── [Entropy Cannon] ── [Phase Engine] ── [Cosmic Network] ── [Transcendence]

TIER X: Apex — MECHBORN APEX: The Perfect Machine
  "Efficiency is not a goal — it is a state of being."
```

---

## Implementation

### Data Structure

```typescript
interface WoWsTechNode {
  id: string;
  name: string;
  tier: number;
  branch: TechBranch;
  type: 'trunk' | 'fork' | 'side' | 'shared' | 'capstone' | 'apex';
  race: RaceId | 'universal';
  
  // Prerequisites
  prerequisiteTechs: string[];
  unlockRequirements: {
    empireLevel?: number;
    turnCount?: number;
    forkCompleted?: string[];
    prestigeLevel?: number;
    resourceStockpile?: ResourceCost;
  };
  
  // Fork data (only for fork nodes)
  fork?: {
    forkType: 'binary' | 'trinary' | 'mutually_exclusive' | 'soft' | 'hard';
    options: ForkOption[];
  };
  
  // Research data
  researchCost: ResourceCost;
  researchTime: number;  // turns
  researchXP: number;
  
  // Effects
  bonuses: TechBonus[];
  unlocks: string[];  // other tech IDs this unlocks
  flavorText: string;
  raceNames?: Partial<Record<RaceId, { displayName: string; flavorText: string }>>;
}
```

### Config File

Create `shared/config/wowsTechTreeConfig.ts` with:
- All 8 race trees (5 branches × 10 tiers = 40 nodes per race = 320 nodes)
- Shared module catalog (50+ modules)
- Fork point definitions
- Cross-branch dependency graph
- Tier unlock gates

### Migration from Existing System

| Existing System | Action |
|----------------|--------|
| `technologyTreeConfig.ts` (11 branches) | Map to WoWs 5-branch system |
| `researchProgression.ts` (13 branches) | Merge into WoWs trunk |
| `researchTechnologyLibraryConfig.ts` (18 categories) | Use as sub-node detail |
| `researchTechnologyTreeCatalog.ts` (270 nodes) | Replace with WoWs tree |

### Page Updates

| Page | Update |
|------|--------|
| Research page | Visual tree renderer with fork points |
| Fleet page | Shared module equipper |
| Empire page | Tier progress indicator |
| Commander page | Race-specific tree preview |

---

## Summary

| Metric | Value |
|--------|-------|
| Races | 8 |
| Branches per race | 5 |
| Tiers | 10 |
| Nodes per race | ~40 (trunk) + ~20 (side) = ~60 |
| Total nodes | 480 (8 races × 60) |
| Fork points | ~32 (8 races × 4 tiers × 1 fork avg) |
| Shared modules | ~50 |
| Cross-branch deps | ~20 convergence gates |

This system provides deep, meaningful progression with racial identity while maintaining the WoWs-style "choose your path" branching.
