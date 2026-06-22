# Stellar Dominion — Game Engine Technical Reference

Internal documentation for the custom-built game engines powering Stellar Dominion.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Game Engine](#core-game-engine)
3. [Combat Engine](#combat-engine)
4. [Client-Side Engines](#client-side-engines)
5. [Scheduler System](#scheduler-system)
6. [Rust Battle Engine (Legacy)](#rust-battle-engine-legacy)
7. [3D Visualization](#3d-visualization)
8. [Desktop Wrapper](#desktop-wrapper)

---

## Architecture Overview

Stellar Dominion does not use a traditional game engine (Unity, Unreal, Godot). It is a **custom browser MMORPG** built entirely from scratch with a TypeScript monorepo. The game logic runs server-side on Node.js/Express, with React 19 handling the client UI and WebSocket providing real-time updates.

```
┌──────────────────────────────────────────────────┐
│                 CLIENT (Browser)                  │
│  React 19 + Vite + TanStack Query                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │  Game UI   │  │  Combat    │  │  Galaxy    │  │
│  │  85 pages  │  │  Engine    │  │  Viewer    │  │
│  └────────────┘  └────────────┘  └────────────┘  │
├──────────────────────────────────────────────────┤
│                WEBSOCKET LAYER                    │
│                    ws 8.x                         │
├──────────────────────────────────────────────────┤
│                 SERVER (Node.js)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │   Game     │  │   Combat   │  │  Scheduler │  │
│  │   Engine   │  │   Engine   │  │  System    │  │
│  │  379 lines │  │  326 lines │  │  12 systems│  │
│  └────────────┘  └────────────┘  └────────────┘  │
│  ┌────────────┐  ┌────────────┐                  │
│  │  29        │  │  65+       │                  │
│  │  Services  │  │  Routes    │                  │
│  └────────────┘  └────────────┘                  │
├──────────────────────────────────────────────────┤
│              DATABASE LAYER                       │
│  PostgreSQL 16 (Neon) + Drizzle ORM              │
│  72 tables · Migrations · Triggers · Views       │
└──────────────────────────────────────────────────┘
```

---

## Core Game Engine

**File:** `server/gameEngine.ts` (379 lines)

The core engine drives the fundamental game loop through `processCoreGameTick()`, which executes two phases every tick:

### Phase 1: Resource Tick (`processResourceTick`)

Calculates elapsed time since last tick, applies production rates from buildings and research, and updates resource totals in the database.

**Production Formulas:**

```
Metal       = 30 × metalMineLevel × (1 + metalMineLevel / 10)
Crystal     = 20 × crystalMineLevel × (1 + crystalMineLevel / 10)
Deuterium   = 10 × deuteriumLevel × (1 + deuteriumLevel / 12)
Energy      = 20 + energyTechLevel × 5
```

**Base Production Rates (per second):**

| Resource | Rate |
|----------|------|
| Metal | 0.1 |
| Crystal | 0.05 |
| Deuterium | 0.02 |
| Energy | 0.15 |

### Phase 2: Construction Queue (`processConstructionQueue`)

Checks cron jobs for completed buildings, increments building levels, removes items from the queue, and processes queued ship construction.

**Building Cost Scaling:**

```
cost = baseCost × (1.15 ^ currentLevel)
```

**Build Time:**

```
time = ceil(totalCost / (2500 × (1 + roboticsFactoryLevel)))
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `calculateProduction()` | Compute resource output from building levels |
| `processResourceTick()` | Apply resource production for elapsed time |
| `startBuilding()` | Queue a new building construction |
| `buildShips()` | Queue ship construction |
| `processCoreGameTick()` | Main tick orchestrator |

---

## Combat Engine

**File:** `server/combatEngine.ts` (326 lines)

Handles all battle simulation with a round-based system.

### Unit Stats

| Unit | Attack | Defense | Health | Speed |
|------|--------|---------|--------|-------|
| Light Fighter | 50 | 20 | 100 | 12 |
| Heavy Fighter | 80 | 40 | 150 | 10 |
| Cruiser | 120 | 60 | 400 | 8 |
| Battleship | 200 | 100 | 600 | 6 |
| Battlecruiser | 300 | 150 | 1000 | 4 |
| Dreadnought | 300 | 150 | 1000 | 4 |

### Damage Formula

```
baseDamage = attacker.attack - defender.defense × 0.5
damage     = baseDamage × (1 + (random - 0.5) × 0.4) × critMultiplier
```

### Combat Mechanics

| Parameter | Value |
|-----------|-------|
| Max rounds | 100 |
| Critical chance | 5% base |
| Critical multiplier | 1.5× |
| Damage variance | ±20% |
| Minimum damage | 1 |
| Plunder rate | 30% of victory resources |

### Research Bonuses

| Tech | Bonus per Level |
|------|----------------|
| Weapons Tech | +5% attack |
| Shielding Tech | +5% defense |
| Armour Tech | +3% health |
| Combustion Drive | +2% speed |

### Battle Modes

| Mode | Players | Max Units | Flange Bonus |
|------|---------|-----------|--------------|
| Solo PvE | 1 | 500 | 0% |
| Group PvE | 2–6 | 2,000 | 15% |
| Solo PvP | 1 | 500 | 0% |
| Group PvP | 2–6 | 2,000 | 25% |

### Flange Formations

| Formation | Offense | Defense | Requirement |
|-----------|---------|---------|-------------|
| Balanced | 1.0× | 1.0× | None |
| Aggressive | 1.4× | 0.8× | None |
| Defensive | 0.7× | 1.5× | None |
| Flanking | 1.8× | — | Position advantage |
| Pincer | 2.0× | — | Team coordination |

### Key Functions

| Function | Purpose |
|----------|---------|
| `getUnitStats()` | Fetch unit stats with tech bonuses applied |
| `calculateDamage()` | Compute damage between attacker and defender |
| `simulateCombatRound()` | Process one round of combat |
| `simulateBattle()` | Run full battle (up to 100 rounds) |
| `calculateVictoryResources()` | Compute plunder after victory |

---

## Client-Side Engines

Three client-side engines provide UI-level simulation and preview:

### Combat Engine (Client)

**File:** `client/src/lib/combatEngine.ts` (413 lines)

Ship-to-ship combat simulation with a weapon-armor matrix for the fleet management UI. Used for pre-battle planning and real-time combat visualization.

### Game Logic

**File:** `client/src/lib/gameLogic.ts` (244 lines)

OGame-style fleet combat calculations for the fleet management interface. Provides instant feedback on fleet composition before committing to battle.

### Combat System

**File:** `client/src/lib/combatSystem.ts` (211 lines)

Commander-influenced PvP combat calculations. Factors in commander skills and talent trees when simulating PvP encounters.

---

## Scheduler System

**File:** `server/systems/schedulerSystem.ts`

Central game tick orchestrator that coordinates all time-based mechanics:

| Responsibility | Description |
|----------------|-------------|
| Turn processing | Advance game turns from offline time |
| Port production | Calculate trading port output |
| Construction queues | Process building and ship completions |
| Defense degradation | Reduce defense effectiveness over time |
| Apocalypse events | Trigger server-wide events |
| Colonization | Process new colony establishment |
| Scanning | Update intelligence data |
| Bounty system | Manage active bounties |

---

## Rust Battle Engine (Legacy)

**Location:** `game-source/rust/battle_engine_ffi/`

A high-performance battle simulation engine written in Rust, callable from PHP via FFI. Developed for the legacy OGameX codebase.

### Performance

| Metric | Rust Engine | PHP Engine | Improvement |
|--------|-------------|------------|-------------|
| 700K cruisers + 100K battleships | 175 ms | 54 s | **308× faster** |
| Memory usage | ~120 MB | ~480 MB | **4× less** |

### Architecture

- `battle_engine_ffi/` — The shared library (compiled to `.dll`/`.so`/`.dylib`)
- `battle_engine_debug/` — Test harness for benchmarking and validation

Called from PHP via FFI using:
```php
$ffi = FFI::cdef("...", "battle_engine_ffi.dll");
```

---

## 3D Visualization

Two prototype 3D visualization systems exist for galaxy and space viewing:

### Java/LibGDX 3D Viewer

**Location:** `java/niverse3d/`

- Built with **LibGDX** game framework (Java)
- LWJGL3 desktop backend
- 3D planet, fleet, and station visualization
- Built with Gradle, run via `gradlew.bat lwjgl3:run`

### Three.js Galaxy Viewer

**Location:** `threejs_galaxy_viewer_project/`

- Vanilla **JavaScript** with **Three.js**
- Stellaris-style galaxy map with camera controls
- Galaxy, system, and planet camera modes
- Procedural star systems and celestial objects
- Input: keyboard, mouse, and gamepad (Xbox/PS5)
- HUD overlays and ship visualization modes

---

## Desktop Wrapper

**File:** `electron-main.cjs`

Electron 42 wraps the web application as a native desktop app:

- Spawns the Express server as a child process
- Creates a BrowserWindow loading `http://localhost:5000`
- System tray integration with minimize-to-tray
- Auto-updater hooks
- Platform installers via `electron-builder`:
  - **Windows:** NSIS installer + portable `.exe`
  - **macOS:** DMG + ZIP
  - **Linux:** AppImage + DEB

---

## Related Documentation

- [Architecture](universe-empire-dominion3/docs/ARCHITECTURE.md) — Full system architecture
- [Systems Overview](universe-empire-dominion3/docs/SYSTEMS_OVERVIEW.md) — All 41 game systems
- [Combat](universe-empire-dominion3/docs/Combat.md) — Battle mechanics detail
- [Game Design](universe-empire-dominion3/docs/GAME_DESIGN.md) — Core loops and balance
- [Framework Architecture](universe-empire-dominion3/docs/FRAMEWORK_ARCHITECTURE.md) — Technical framework
- [Rust Engine README](universe-empire-dominion3/game-source/rust/README.md) — Rust battle engine docs
