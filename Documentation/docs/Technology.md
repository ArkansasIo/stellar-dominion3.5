# Technology & Research System

> **Source:** `shared/config/technologyTreeConfig.ts` — Core type definitions, `TechnologyNode` interface, `TechBranch`, `TechClass`, `TechType`, `TechStats`, `TECH_PROGRESSION` scaling functions, and the `TechTreeManager` class.

The technology and research system governs all scientific advancement in the empire. Players research technologies across **11 major branches** organized into a deep progression tree with levels (1–999), tiers (1–99), and stat-based bonuses that scale exponentially.

---

## Architecture Overview

The technology system spans three layers:

| Layer | Files | Purpose |
|-------|-------|---------|
| **Shared Config** | `technologyTreeConfig.ts`, `technologyTreeExpandedConfig.ts`, `technologyTreeCustomConfig.ts`, `researchProgression.ts` | Data definitions, scaling math, tech generation |
| **Server API** | `server/routes-research.ts` | REST endpoints for research queries and player progress |
| **Client UI** | `client/src/pages/TechnologyTree.tsx`, `TechTree.tsx`, `client/src/lib/technologyTypes.ts`, `client/src/lib/technologyDivisionCatalog.ts`, `client/src/lib/researchTechnologyTreeCatalog.ts` | Browser-facing tech tree and encyclopedia |

> **Source:** `server/routes-research.ts` — All research API routes (`/api/research/*`).
> **Source:** `shared/schema.ts` — Database tables: `researchAreas`, `researchSubcategories`, `researchTechnologies`, `playerResearchProgress`.

---

## Technology Branches

There are **11 technology branches**, each covering a distinct domain:

| Branch | Key | Description |
|--------|-----|-------------|
| Armor & Plating | `armor` | Defensive hull reinforcement and armor plating |
| Shields | `shields` | Energy shield generation and modulation |
| Weapons | `weapons` | Combat offensive systems and ordnance |
| Propulsion | `propulsion` | Engine, drive, and FTL systems |
| Sensors | `sensors` | Detection, scanning, and reconnaissance |
| Power | `power` | Energy generation and reactor technology |
| Computing/AI | `computing` | Artificial intelligence and computation |
| Engineering | `engineering` | Construction, fabrication, and automation |
| Resources | `resources` | Mining, extraction, and material processing |
| Medical | `medical` | Life support, healing, and augmentation |
| Hyperspace | `hyperspace` | FTL travel, warp, and interdimensional physics |

> **Source:** `shared/config/technologyTreeConfig.ts:11-22` — `TechBranch` type definition.

---

## TechnologyNode Structure

Every technology in the tree is a `TechnologyNode` with these fields:

### Identification

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., `armor-light-basic-composite-1`) |
| `name` | `string` | Display name |
| `branch` | `TechBranch` | Which branch the tech belongs to |
| `class` | `TechClass` | Rarity class: `basic`, `standard`, `advanced`, `military`, `experimental`, `ancient`, `exotic` |
| `type` | `TechType` | Behavior type: `passive`, `active`, `upgrade`, `modification`, `utility`, `hybrid` |

### Classification Hierarchy

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | Top-level grouping (e.g., "Light Armor", "Kinetic Shields") |
| `subcategory` | `string` | Specific variant (e.g., "Composite", "Multi-Phase") |
| `classification` | `string` | Further specification (e.g., "Standard Grade", "Gen 2") |

### Progression

| Field | Type | Description |
|-------|------|-------------|
| `level` | `number` | Tech level (1–999) |
| `tier` | `number` | Tech tier (1–99) |
| `researchCost` | `number` | Science points required |
| `researchTime` | `number` | Turns to research |

### Requirements

| Field | Type | Description |
|-------|------|-------------|
| `prerequisiteTechs` | `string[]` | Tech IDs that must be researched first |
| `minimumLevel` | `number` | Minimum player level to research |
| `minimumTechLevel` | `number` | Minimum tech level gating |

### Resources & Cost

| Field | Type | Description |
|-------|------|-------------|
| `industrialCost` | `number` | Production cost |
| `energyCost` | `number` | Power requirement |
| `materialsNeeded` | `{ [resource: string]: number }` | Materials consumed |

### Performance Stats

| Field | Type | Description |
|-------|------|-------------|
| `stats.primary` | `TechStat[]` | Main stats (e.g., Armor Rating, Damage Per Shot) |
| `stats.secondary` | `TechStat[]` | Supporting stats (e.g., Accuracy, Range) |
| `stats.resistance` | `{ [type: string]: number }` | Damage resistances (kinetic, thermal, radiation) |
| `stats.efficiency` | `number` | 0–100% efficiency rating |
| `stats.reliability` | `number` | 0–100% reliability rating |

### Unlocks & Meta

| Field | Type | Description |
|-------|------|-------------|
| `unlocksUpgrades` | `string[]` | Tech IDs this tech unlocks |
| `maxUpgradeLevel` | `number` | Maximum upgrade level |
| `upgradeSlots` | `number` | Number of upgrade slots |
| `isResearchable` | `boolean` | Whether the tech can be researched |
| `factionLocked` | `string?` | Faction-specific lock (e.g., "Military") |
| `rarity` | `string` | `common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic` |
| `discoveryBonus` | `number` | % bonus if first to discover |

> **Source:** `shared/config/technologyTreeConfig.ts:51-112` — `TechnologyNode` interface definition.

---

## Scaling System

All technology stats scale via the `TECH_PROGRESSION` object using exponential formulas:

```
Level Multiplier = 1.15 ^ (level - 1)
Tier Multiplier  = 1.25 ^ (tier - 1)
Combined         = Level Multiplier × Tier Multiplier

Research Cost    = 100 × level × tier × (1.2 ^ level) × (1.3 ^ tier)
Research Time    = ceil(5 × level × tier) turns
```

At maximum (L99, T99), the combined multiplier reaches astronomical values, ensuring deep long-term progression.

> **Source:** `shared/config/technologyTreeConfig.ts:118-138` — `TECH_PROGRESSION` object with `levelMultiplier`, `tierMultiplier`, `combinedMultiplier`, `researchCostForTech`, `researchTimeForTech`.

---

## Tech Class & Rarity

| Class | Rarity | Description | Example |
|-------|--------|-------------|---------|
| `basic` | Common | Starting technologies | Basic Composite Plating |
| `standard` | Common | Standard-tier techs | Standard Steel Plating |
| `advanced` | Uncommon/Rare | Improved systems | Ceramic Layered Plating |
| `military` | Epic | Combat-focused, faction-locked | Military Titanium Armor |
| `experimental` | Epic | High risk/reward | Plasma Matrix Crystallization |
| `ancient` | Legendary | Precursor relics | Precursor Matter Assembler |
| `exotic` | Legendary/Mythic | Unknown origin | Temporal Distortion Field |

> **Source:** `shared/config/technologyTreeCustomConfig.ts:18-186` — Experimental and faction-specific techs with unique penalties and high-tier progression.

---

## Custom & Special Technologies

Beyond the 11 standard branches, the system supports special technology categories:

### Experimental Technologies
High-risk, high-reward techs that push the boundaries of known science. These carry **penalties** (e.g., system failure risk, crew radiation exposure) alongside massive bonuses.

**Example:** `Plasma Matrix Crystallization` (Level 50, Tier 5) — 10,000 Power Output, 98% efficiency, but 15% meltdown risk.

> **Source:** `shared/config/technologyTreeCustomConfig.ts:18-186`

### Faction-Specific Technologies
Unique techs locked to specific civilizations. Example: `Voth Phase-Shift Matrices` (faction-locked to "Voth") grants dimensional phasing evasion.

> **Source:** `shared/config/technologyTreeCustomConfig.ts:192-257`

### Ancient/Precursor Technologies
Ultra-rare techs from extinct civilizations. Example: `Precursor Matter Assembler` (Level 100, Tier 12) reduces megastructure build time by 90%.

> **Source:** `shared/config/technologyTreeCustomConfig.ts:263-335`

### Event/Limited-Edition Technologies
Special techs available during seasonal events. Example: `Festival Celebration Array` boosts crew morale and unlocks event activities.

> **Source:** `shared/config/technologyTreeCustomConfig.ts:341-399`

---

## Research Progression System

The `researchProgression.ts` file defines a parallel research system with **13 branches**:

- Energy, Propulsion, Weapons, Defense, Computers, Espionage, Megastructure, Economy, Genetics, Quantum, Exotic, Shields, Construction

Each research technology has:
- A `tier` (1–99) and `maxLevel` (up to 999)
- `baseCost` (metal, crystal, deuterium) and `baseTime`
- `unlocksBuild`, `unlocksUnit`, `unlocksResearch` arrays
- `bonusPerLevel` and `bonusPerTier` stat growth
- Prerequisite chain via `prerequisites` array

Tier unlock requirements gate progression:

| Tier | Requirement |
|------|-------------|
| 1 | None |
| 3 | Energy Technology Level 1 |
| 5 | Advanced Engineering Level 1 |
| 10 | Quantum Physics Level 5 |
| 15 | Exotic Matter Research Level 3 |
| 20 | Megastructure Engineering Level 10 |
| 25 | Ascension Studies Level 1 |
| 30 | Reality Engineering Level 1 |
| 50 | Godhood Studies Level 10 |
| 99 | Ultimate Knowledge Level 1 |

> **Source:** `shared/config/researchProgression.ts:47-58` — `RESEARCH_UNLOCK_REQS`.
> **Source:** `shared/config/researchProgression.ts:620-630` — `ALL_TECHNOLOGIES` master array.
> **Source:** `shared/config/researchProgression.ts:688-735` — `calculateResearchCost` and `calculateResearchTime`.

---

## Server API Routes

The research API is registered via `registerResearchRoutes(app)` and exposes these endpoints:

### Tech Tree Queries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/research/tree/stats` | Overall tree statistics (total techs, branch/class breakdown) |
| `GET` | `/api/research/tree/branches` | All 11 branches with descriptions and tech counts |
| `GET` | `/api/research/tree/branch/:branchId` | All techs in a branch, grouped by class |
| `GET` | `/api/research/tech/:techId` | Full tech detail including prerequisites, unlocks, upgrades |
| `GET` | `/api/research/tech/path/:fromId/:toId` | Research path between two techs (BFS) |

### Search & Filter

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/research/search?q=&rarity=` | Search by name/description with optional rarity filter |
| `GET` | `/api/research/available?playerLevel=X` | Techs available at a given player level |
| `GET` | `/api/research/rarity/:rarity` | All techs of a specific rarity |
| `POST` | `/api/research/calculate-cost` | Calculate research cost for a given level/tier/branch |

### Player Research

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/research/player/progress` | Player's researched techs and current research |
| `POST` | `/api/research/player/start` | Start researching a tech (validates prerequisites) |
| `POST` | `/api/research/player/complete` | Complete current research and unlock the tech |
| `GET` | `/api/research/player/recommended` | Get recommended techs based on level and completed research |

> **Source:** `server/routes-research.ts` — Full API implementation with 13 endpoints.

---

## Client-Side Types & UI

### technologyTypes.ts

Defines a client-side `Technology` interface used for the encyclopedia/tech card system:

- `TechRarity`: `common | uncommon | rare | epic | legendary | mythic | transcendent`
- `TechClass`: `energy | propulsion | weapons | defense | production | research | engineering | quantum | cosmic`
- `TechStatus`: `locked | available | researching | completed | obsolete`
- Each technology has `effects`, `attributes`, `stats`, and `synergizesWith` for combo bonuses

> **Source:** `client/src/lib/technologyTypes.ts:1-324`

### technologyDivisionCatalog.ts

Defines **18 Technology Divisions** — a categorization layer that groups related techs into operational domains:

| Division | Area | Specialty |
|----------|------|-----------|
| Energy Systems | Physics | Energy throughput |
| Laser Doctrine | Physics | Beam precision |
| Ion Dynamics | Physics | Ion stability |
| Hyperspace Frameworks | Physics | Subspace reliability |
| Plasma Systems | Physics | Plasma output |
| Combustion Labs | Engineering | Drive efficiency |
| Impulse Vector Bureau | Engineering | Maneuver response |
| Hyperspace Propulsion | Engineering | FTL transit speed |
| Espionage Analytics | Society | Intelligence resolution |
| Computer Cognition | Physics | Computation speed |
| Astrophysics Survey | Society | Survey quality |
| Research Network Command | Society | Research coordination |
| Graviton Dynamics | Physics | Field control |
| Weapons Engineering | Engineering | Weapons output |
| Shield Harmonization | Physics | Shield strength |
| Armour Materials | Engineering | Armor resilience |
| AI Synthesis | Physics | Automation depth |
| Quantum Entanglement | Physics | Quantum synchronization |

Each division contains 90 systems (9 phases × 10 modules) with upgrade snapshots calculating resource costs and bonus progression.

> **Source:** `client/src/lib/technologyDivisionCatalog.ts:69-150`

### researchTechnologyTreeCatalog.ts

Defines **3 research tree categories** (Physics, Society, Engineering) each with 9 branches and 10 phases per branch, totaling **270 nodes**:

- **Physics**: Warp Field Lattices, Cloaking Spectrums, Interdiction Resonance, Fighter Control Theory, Siege Reactor Maps, Triage Field Maths, Cyno Harmonics, Subcapital Targeting, Supercapital Tensors
- **Society**: Naval Officer Corps, Convoy Governance, Black Ops Protocols, Expedition Charters, Carrier Wing Culture, Capital Damage Control, Siege Administration, Mercantile Command, Supercapital Council
- **Engineering**: Frigate Doctrine, Destroyer Doctrine, Cruiser Doctrine, Battlecruiser Doctrine, Battleship Doctrine, Industrial Command, Capital Command, Carrier Operations, Titan Architecture

Each node requires an anchor research tech, a Kardashev level, and a prior node completion.

> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts:53-173`

---

## Client Pages

### TechnologyTree.tsx
The primary technology tree UI. Displays a tabbed view of the three research categories (Physics, Society, Engineering) with branch-level navigation, node cards showing current/next bonuses, upgrade costs, and requirement checks. Integrates with `useGame()` for player state.

> **Source:** `client/src/pages/TechnologyTree.tsx`

### TechTree.tsx
A comprehensive encyclopedia page covering buildings, ships, research, facilities, and progression systems. Displays OGame-sourced building/ship/research catalogs with searchable tables, facility type breakdowns, tier progression (1–21), combat formations, and currency economy overview.

> **Source:** `client/src/pages/TechTree.tsx`

---

## Database Schema

Research state is persisted across several database tables:

| Table | Purpose |
|-------|---------|
| `researchAreas` | Top-level research area definitions |
| `researchSubcategories` | Subcategories within each area |
| `researchTechnologies` | Individual technology definitions |
| `playerResearchProgress` | Per-player research completion tracking |

Player state also stores research data as JSON fields:

| Field | Type | Description |
|-------|------|-------------|
| `research` | `jsonb` | Tech levels map `{ techId: level }` |
| `researchQueue` | `jsonb` | Queued research items |
| `researchHistory` | `jsonb` | Completed research log |
| `activeResearch` | `jsonb` | Currently researching tech |
| `researchBonuses` | `jsonb` | Active research bonuses |
| `researchModifiers` | `jsonb` | Tech/government modifiers |
| `researchLab` | `jsonb` | Lab level, slots, speed multipliers |
| `researchXP` | `jsonb` | Research experience and milestones |

> **Source:** `shared/schema.ts:67-99` — Player state research fields.
> **Source:** `shared/schema.ts:646-680` — Dedicated research tables.

---

## TechTreeManager Class

The `TechTreeManager` is a singleton that indexes all technologies for fast queries:

| Method | Description |
|--------|-------------|
| `getTechnology(id)` | Lookup by ID |
| `getTechByBranch(branch)` | All techs in a branch |
| `getTechByClass(cls)` | All techs of a class |
| `getTechThatUnlock(prereqId)` | Techs unlocked by a prerequisite |
| `getPrerequisites(techId)` | All prerequisites for a tech |
| `calculateTotalResearchCost(techId)` | Total cost including all prerequisite chain |
| `getAvailableUpgrades(techId)` | Direct upgrades from a tech |
| `getStartingTechs()` | Techs with no prerequisites |
| `getResearchPath(from, to)` | BFS path between two techs |
| `calculateStatBonus(techId, level, tier)` | Scaled stat bonuses |
| `getTreeStatistics()` | Aggregate stats by branch and class |

> **Source:** `shared/config/technologyTreeConfig.ts:1230-1483` — `TechTreeManager` class.

---

## Utility Functions

Exported convenience wrappers:

```typescript
import {
  getTotalTechnologies,
  getAllTechnologies,
  getTechsByBranch,
  getTechById,
  calculateResearchPath,
  getTreeStats,
} from '@shared/config';
```

> **Source:** `shared/config/technologyTreeConfig.ts:1495-1541`

---

## Quick Reference

A quick reference module provides simplified wrappers for common operations:

```typescript
import {
  getArmorTechnologies,
  findTechnology,
  getLevelBonus,
  getTierBonus,
  getResearchCost,
  getUnlockedTechs,
  getPrerequisiteTechs,
  getTreeStatistics,
  filterTechs,
  calculateStatBonuses,
  buildResearchPlan,
  estimateResearchTime,
  getAvailableTechs,
  canResearch,
  getTechEffect,
} from '@shared/config/technologyTreeQuickReference';
```

> **Source:** `shared/config/technologyTreeQuickReference.ts` — Complete quick reference with 40+ utility functions.
