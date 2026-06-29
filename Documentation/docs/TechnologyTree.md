# Technology Tree

> **Source:** `shared/config/technologyTreeConfig.ts` — Base tech tree with 11 branches, `TechnologyNode` interface, `TechTreeManager`, and `TECH_PROGRESSION` scaling.
> **Source:** `shared/config/technologyTreeExpandedConfig.ts` — Procedurally generated expanded techs (800+ entries per branch via generator functions).
> **Source:** `shared/config/technologyTreeCustomConfig.ts` — Custom/experimental/faction/ancient/event techs extending the base tree.

The Technology Tree is a deep, multi-layered progression system containing **2,453+ technologies** across **11 major branches**. Technologies are organized by category, subcategory, and classification, with each node supporting up to 99 tiers and 999 levels.

---

## Tree Structure

### Three-Layer Architecture

| Layer | File | Entry Count | Description |
|-------|------|-------------|-------------|
| **Base** | `technologyTreeConfig.ts` | ~50 handcrafted sample techs | Hand-tuned starting techs with full stats, descriptions, and flavor text |
| **Expanded** | `technologyTreeExpandedConfig.ts` | 800+ per branch (2,400+ total) | Procedurally generated variants across categories, materials, grades |
| **Custom** | `technologyTreeCustomConfig.ts` | 4 special categories | Experimental, faction-locked, ancient, and event-limited techs |

### Branch Counts

| Branch | Base Samples | Expanded Total | Categories |
|--------|-------------|----------------|------------|
| Armor | 6 | 600 | Light, Medium, Heavy, Ultra-Heavy, Exotic × 8 materials × 5 grades × 3 levels |
| Shields | 4 | 250 | Kinetic, Thermal, Radiation, EM, Exotic × 5 configurations × 5 generations × 2 levels |
| Weapons | 2 | 420 | Ballistic, Laser, Missile, Plasma, Pulse, Particle, Exotic × 6 configs × 5 grades × 2 levels |
| Propulsion | 1 | 250 | Ion, Plasma, Nuclear, Anti-Matter, Exotic × 5 configs × 5 versions × 2 levels |
| Sensors | 1 | 168 | Radar, LIDAR, Thermal, Gravitational, Quantum, Multispectral, Exotic × 6 ranges × 4 gens |
| Power | 1 | 150 | Fusion, Antimatter, Zero-Point, Quantum, Exotic, Stellar × 5 scales × 5 gens |
| Computing | 1 | 100 | Ship AI, Combat AI, Nav AI, Science AI, Exotic AI × 5 proficiencies × 4 versions |
| Engineering | 1 | 120 | Automation, Fabrication, Repair, Optimization, Modular, Adaptive × 5 complexity × 4 gens |
| Resources | 1 | 120 | Mining, Drilling, Purification, Refining, Synthesis, Crystallization × 5 efficiency × 4 scales |
| Medical | 1 | 150 | Healing, Regeneration, Resurrection, Enhancement, Prevention, Cryogenics × 5 effectiveness × 5 methods |
| Hyperspace | 1 | 125 | Warp, Jump Gate, Quantum Tunnel, Exotic Travel, Teleportation × 5 capabilities × 5 stability |

---

## Base Tech Tree Branches

> **Source:** `shared/config/technologyTreeConfig.ts:144-1224`

### Armor & Plating (90 base techs)

Categories: Light Armor, Medium Armor, Heavy Armor, Military Armor, Exotic Armor

Example progression:
```
Basic Composite Plating (L1, T1)
  → Reinforced Composite Plating (L2, T1) — requires Basic Composite
  → Ceramic Layered Plating (L3, T1) — requires Basic Composite
    → Military Titanium Armor (L6, T1) — requires Heavy Composite
```

Key stats: Armor Rating (10–250+), Weight, Cost Effectiveness, Kinetic/Thermal/Radiation resistance

Manufacturers: Terran Industries, Krell Defense Systems, Krell Military Complex

> **Source:** `shared/config/technologyTreeConfig.ts:144-441` — `ARMOR_TECHS` array.

### Shields (90 base techs)

Categories: Kinetic Shields, Thermal Shields, Radiation Shields, Combat Shields, Exotic Shields

Configurations: Single-Layer, Multi-Phase, Omni-Directional, Dynamic, Distributed

Key stats: Shield Strength (50–300+), Recharge Rate, Coverage, Stability

> **Source:** `shared/config/technologyTreeConfig.ts:447-694` — `SHIELD_TECHS` array.

### Weapons (100 base techs)

Categories: Ballistic, Energy, Missile, Plasma, Pulse, Particle, Exotic

Configurations: Standard, Rapid-Fire, Heavy, Point-Defense, Array, Swarm

Key stats: Damage Per Shot (30–300+), Fire Rate, Accuracy, Range

> **Source:** `shared/config/technologyTreeConfig.ts:700-800` — `WEAPONS_TECHS` array.

### Propulsion (80 base techs)

Categories: Sub-Light Engine, FTL Drive, Warp System

Key stats: Thrust Output (100–2000+), Fuel Efficiency, Power Consumption

> **Source:** `shared/config/technologyTreeConfig.ts:806-856` — `PROPULSION_TECHS` array.

### Sensors, Power, Computing, Engineering, Resources, Medical, Hyperspace

Each follows the same `TechnologyNode` pattern with branch-specific categories, stats, and scaling.

> **Source:** `shared/config/technologyTreeConfig.ts:862-1224` — Remaining branch arrays (`SENSOR_TECHS` through `HYPERSPACE_TECHS`).

---

## Expanded Tech Generation

> **Source:** `shared/config/technologyTreeExpandedConfig.ts`

The expanded config procedurally generates thousands of technology variants using combinatorial iteration. Each generator function produces a full `TechnologyNode[]` array:

| Generator Function | Branch | Output |
|--------------------|--------|--------|
| `generateArmorTechs()` | armor | 5 categories × 8 materials × 5 grades × 3 levels = **600 techs** |
| `generateShieldTechs()` | shields | 5 types × 5 configs × 5 gens × 2 levels = **250 techs** |
| `generateWeaponTechs()` | weapons | 7 types × 6 configs × 5 grades × 2 levels = **420 techs** |
| `generatePropulsionTechs()` | propulsion | 5 types × 5 configs × 5 versions × 2 levels = **250 techs** |
| `generateSensorTechs()` | sensors | 7 types × 6 ranges × 4 gens = **168 techs** |
| `generatePowerTechs()` | power | 6 types × 5 scales × 5 gens = **150 techs** |
| `generateComputingTechs()` | computing | 5 types × 5 proficiencies × 4 versions = **100 techs** |
| `generateEngineeringTechs()` | engineering | 6 systems × 5 complexity × 4 gens = **120 techs** |
| `generateResourceTechs()` | resources | 6 types × 5 efficiency × 4 scales = **120 techs** |
| `generateMedicalTechs()` | medical | 6 treatments × 5 effectiveness × 5 methods = **150 techs** |
| `generateHyperspaceTechs()` | hyperspace | 5 types × 5 capabilities × 5 stability = **125 techs** |

Each generated tech calculates:
- `researchCost`: `50-100 × (level+1) × tier × (1.2 ^ baseLevel)`
- `stats`: Based on `baseLevel` and `tier` with per-branch formulas
- `rarity`: Derived from category/material/grade position
- `manufacturer`: Rotated across Terran Industries, Krell Defense, Zenith

### Exports

```typescript
export const EXPANDED_ARMOR_TECHS = generateArmorTechs();
// ... all 11 expanded arrays

export function getAllExpandedTechnologies(): TechnologyNode[];
export function getExpandedTechCount(): {
  armor: number; shields: number; weapons: number; /* ... */
  total: number;
};
```

> **Source:** `shared/config/technologyTreeExpandedConfig.ts:862-918` — Exported expanded arrays and utility functions.

---

## Custom Tech Extensions

> **Source:** `shared/config/technologyTreeCustomConfig.ts`

### Experimental Technologies
High-tier techs with **both bonuses and penalties**:

| Tech | Branch | Level | Tier | Key Bonus | Key Penalty |
|------|--------|-------|------|-----------|-------------|
| Plasma Matrix Crystallization | power | 50 | 5 | Power Output ×5 | 15% meltdown risk |
| Temporal Distortion Field | hyperspace | 75 | 8 | Reaction Time ×3 | 50% causality violation risk |

### Faction-Specific Technologies
Locked to specific civilizations via `factionLocked` field:

| Tech | Faction | Branch | Effect |
|------|---------|--------|--------|
| Voth Phase-Shift Matrices | Voth | shields | 25% phase evasion chance |

### Ancient/Precursor Technologies
Ultra-rare techs from extinct civilizations:

| Tech | Branch | Level | Tier | Effect |
|------|--------|-------|------|--------|
| Precursor Matter Assembler | engineering | 100 | 12 | -90% megastructure build time |

### Event/Limited-Edition Technologies
Seasonal or time-limited techs:

| Tech | Branch | Rarity | Effect |
|------|--------|--------|--------|
| Festival Celebration Array | computing | special | +50 crew morale, 2× event points |

### Utility Functions

```typescript
getCustomTechsByClass(techClass: string): TechnologyNode[]
getCustomTechsByRarity(rarity: string): TechnologyNode[]
getAvailableCustomTechs(playerLevel: number): TechnologyNode[]
getFactionTechs(factionName?: string): TechnologyNode[]
getExperimentalTechs(): TechnologyNode[]
getActiveEventTechs(): TechnologyNode[]
calculateCustomTechResearchCost(tech, playerTechLevel): number
```

> **Source:** `shared/config/technologyTreeCustomConfig.ts:404-481`

---

## Quick Reference

> **Source:** `shared/config/technologyTreeQuickReference.ts` — 40+ utility functions organized into 8 sections.

### 1. Basic Queries
```typescript
getArmorTechnologies()          // All armor branch techs
findTechnology(id)              // Lookup by ID
getAllTechs()                   // All techs in the game
getTechCount()                  // Total count
getExpandedCount()              // Breakdown by branch
```

### 2. Progression & Scaling
```typescript
getLevelBonus(level, baseStat)          // 1.15^(level-1) × baseStat
getTierBonus(tier, baseStat)            // 1.25^(tier-1) × baseStat
getCombinedMultiplier(level, tier)      // Level × Tier multiplier
getResearchCost(branch, level, tier)     // Research point cost
getResearchTime(level, tier)            // Turns to research
```

### 3. Tech Tree Navigation
```typescript
getUnlockedTechs(prerequisiteId)        // Techs unlocked by a prereq
getPrerequisiteTechs(techId)            // All prereqs for a tech
getUpgrates(techId)                     // Direct upgrades
getTotalResearchCost(techId)            // Full prereq chain cost
findPath(fromId, toId)                  // BFS research path
```

### 4. Analysis & Filtering
```typescript
getTreeStatistics()                     // Aggregate stats
filterTechs({ branch, class, minLevel, maxLevel, rarity })
getStarterTechs()                       // No-prerequisite techs
getTechsByBranchAndClass(branch, cls)   // Filtered query
```

### 5. Stat Calculations
```typescript
calculateStatBonuses(techId, level, tier)  // Scaled stat map
getRawStats(tech)                          // Primary, secondary, resistances, bonuses
```

### 6. Research Planning
```typescript
buildResearchPlan(currentId, targetId)      // Ordered path
estimateResearchTime(tech)                   // Total turns including prereqs
getTotalResourceCost(techId)                 // { science, turns, industrial, energy }
```

### 7. Discovery & Availability
```typescript
getAvailableTechs(playerLevel)              // Techs at player level
getTechsByRarity(rarity)                   // Filter by rarity
getFactionTechs(faction)                   // Faction-locked techs
searchTechs(query)                          // Name/description search
```

### 8. Game Integration
```typescript
canResearch(tech, playerLevel, playerTechLevel, hasPrereqs)  // Boolean check
getTechEffect(tech)                       // Formatted bonus string
serializeTech(tech)                       // JSON serialization
```

---

## Research Tree Catalog

> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts` — Client-side research tree with 270 nodes across 3 categories.

### Categories

| Category | Nodes | Branches | Description |
|----------|-------|----------|-------------|
| **Physics** | 90 | 9 | Energy, field theory, and reality-scale computation |
| **Society** | 90 | 9 | Governance, expansion doctrine, intelligence, population cohesion |
| **Engineering** | 90 | 9 | Industrial implementation, drives, hulls, applied weapons |

### Phase Progression

Each branch progresses through 10 phases:

1. **Foundation** → 2. **Calibration** → 3. **Expansion** → 4. **Integration** → 5. **Dominance** → 6. **Ascension** → 7. **Synchronization** → 8. **Breakthrough** → 9. **Convergence** → 10. **Apex

### Node Requirements

Each node requires:
- **Anchor Research**: A specific base research tech at a minimum level
- **Kardashev Level**: Empire progression gate
- **Prior Node**: The previous node in the branch must be completed

### Upgrade Snapshots

```typescript
getResearchTreeUpgradeSnapshot(node, level): {
  maxLevel: 6;
  buildTimeSeconds: number;
  cost: { metal, crystal, deuterium };
  currentBonus: number;
  nextBonus: number;
}
```

> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts:156-173` — Upgrade cost calculation.

---

## Technology Division Catalog

> **Source:** `client/src/lib/technologyDivisionCatalog.ts` — 18 divisions with 90 systems each (1,620 total).

### Division Structure

Each division contains:
- **9 phases**: Initiation, Calibration, Synchronization, Expansion, Harmonization, Integration, Acceleration, Ascension, Apex
- **10 modules**: Framework, Array, Matrix, Directive, Engine, Protocol, Foundry, Suite, Lattice, Nexus
- **90 systems total** per division

### Upgrade System

```typescript
getTechnologyDivisionUpgradeSnapshot(system, divisionOrder, level): {
  maxLevel: 6;
  buildTimeSeconds: number;
  cost: { metal, crystal, deuterium };
  currentBonus: number;
  nextBonus: number;
}
```

Cost scaling uses `1.34^level` for metal, `1.32^level` for crystal, `1.28^level` for deuterium, with per-division and per-sequence weight multipliers.

> **Source:** `client/src/lib/technologyDivisionCatalog.ts:130-150`

---

## Client UI

### TechnologyTree.tsx

The primary tech tree interface at `/research-tree`. Features:
- Three-tab layout (Physics / Society / Engineering)
- Branch-level sub-tabs with progress bars
- Node cards showing current/next bonuses, costs, and requirements
- Search across titles, branch names, specialties, and descriptions
- Upgrade buttons with resource validation and requirement checks
- Summary stats: total nodes, completed nodes, Kardashev gate level

> **Source:** `client/src/pages/TechnologyTree.tsx:33-389`

### TechTree.tsx

The encyclopedia interface at `/tech-tree`. Features:
- Five-tab layout: Buildings, Ships, Research, Facilities, Progression
- Searchable data tables for buildings, ships, and research entries
- Facility type breakdown (7 categories, 120+ total)
- Tier progression system (Novice → Absolute, 1–21)
- Empire leveling milestones (1–999)
- Combat formations table (7 formations with offense/defense multipliers)
- 3-tier currency economy (Silver, Gold, Platinum)

> **Source:** `client/src/pages/TechTree.tsx:68-544`

---

## TechTreeManager

> **Source:** `shared/config/technologyTreeConfig.ts:1230-1483`

The `TechTreeManager` singleton provides O(1) lookups via indexed maps:

| Index | Map Type | Purpose |
|-------|----------|---------|
| `allTechs` | `Map<string, TechnologyNode>` | ID → Tech lookup |
| `techsByBranch` | `Map<TechBranch, TechnologyNode[]>` | Branch → Techs |
| `techsByClass` | `Map<TechClass, TechnologyNode[]>` | Class → Techs |
| `prerequisiteMap` | `Map<string, TechnologyNode[]>` | Prereq → Unlocked techs |

### Key Methods

| Method | Complexity | Description |
|--------|------------|-------------|
| `getTechnology(id)` | O(1) | Direct map lookup |
| `getTechByBranch(branch)` | O(1) | Branch index lookup |
| `getPrerequisites(techId)` | O(k) | k = number of prereqs |
| `calculateTotalResearchCost(techId)` | O(n) | Recursive prereq chain |
| `getResearchPath(from, to)` | O(V+E) | BFS graph traversal |
| `getStartingTechs()` | O(n) | Filter for zero-prereq techs |
| `getTreeStatistics()` | O(n) | Full tree scan for aggregates |

---

## Scaling Summary

```
Level Multiplier:  1.15 ^ (level - 1)
Tier Multiplier:   1.25 ^ (tier - 1)
Combined:          1.15^(L-1) × 1.25^(T-1)

Research Cost:     100 × L × T × 1.2^L × 1.3^T
Research Time:     ceil(5 × L × T) turns

At L1/T1:   1.0× multiplier, 156 SC cost, 5 turns
At L5/T3:   1.74× × 1.56× = 2.72× multiplier, 5,835 SC cost
At L10/T5:  4.05× × 2.44× = 9.88× multiplier, 115,005 SC cost
At L20/T10: 16.37× × 9.31× = 152.4× multiplier
```

> **Source:** `shared/config/technologyTreeConfig.ts:118-138` — `TECH_PROGRESSION` scaling formulas.
