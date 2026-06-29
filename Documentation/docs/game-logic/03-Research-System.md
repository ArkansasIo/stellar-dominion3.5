# Research System

## Tech Tree Structure

14 research branches, each containing 5-15 technologies:

| Branch ID | Branch Name | Focus | Tech Count |
|-----------|-------------|-------|------------|
| `espionage` | Espionage | Scanning, counter-intel | 8 |
| `weapons` | Weapons | Ship weapon damage | 12 |
| `shielding` | Shielding | Shield strength, regen | 10 |
| `armor` | Armor | Hull durability | 8 |
| `propulsion` | Propulsion | Speed, fuel efficiency | 10 |
| `energy` | Energy | Power gen, efficiency | 9 |
| `laser` | Laser Tech | Laser weapons | 7 |
| `ion` | Ion Tech | Ion weapons | 7 |
| `plasma` | Plasma Tech | Plasma weapons | 7 |
| `hyperspace` | Hyperspace | Warp travel, wormholes | 12 |
| `combat` | Combat | Ground troops, marines | 8 |
| `defense` | Defense | Turrets, shields | 8 |
| `economy` | Economy | Production, storage | 10 |
| `special` | Special | Artifacts, unique tech | 5 |

## Technology Schema

Each technology is defined by:

```json
{
  "id": "plasma_weapon_3",
  "name": "Plasma Cannon III",
  "description": "Increases plasma weapon damage by 15%",
  "branch": "plasma",
  "level": 3,
  "cost": { "metal": 10000, "crystal": 8000, "deuterium": 4000 },
  "time": 5400,
  "effects": { "plasmaDamageMultiplier": 0.15 },
  "prerequisites": ["plasma_weapon_2", "energy_tech_4"],
  "maxLevel": 15,
  "category": "weapon"
}
```

## Research Cost Formula

```
cost = baseCost × 1.6^level
```

Per level scaling:

| Level | Multiplier |
|-------|------------|
| 1 | ×1.6 |
| 5 | ×10.5 |
| 10 | ×110.0 |
| 15 | ×1152.0 |

Each technology has its own `baseCost` vector (metal, crystal, deuterium).

## Research Time Formula

```
time = baseTime × 1.4^level / (1 + labLevelBonus)
```

| Variable | Description |
|----------|-------------|
| `baseTime` | Per-technology base time in seconds |
| `labLevelBonus` | `sum(labLevelAcrossEmpire) × 0.02` |
| `level` | Target research level |

### Example

Plasma Cannon III, baseTime=3600s, level=3, empire has 5 labs at levels 8, 10, 7, 5, 12:

```
labLevelBonus = (8+10+7+5+12) × 0.02 = 42 × 0.02 = 0.84
time = 3600 × 1.4^3 / (1 + 0.84) = 3600 × 2.744 / 1.84 = 5366s ≈ 89 min
```

## Intergalactic Research Network

The network shares research progress across all colonies:

```
sharedLevel = sum(allColonyLabLevels) × networkMultiplier
```

| Network Level | networkMultiplier |
|---------------|-------------------|
| 1 | 0.05 |
| 2 | 0.10 |
| 3 | 0.15 |
| 4 | 0.20 |
| 5 | 0.25 |
| 6 | 0.30 |
| 7 | 0.35 |
| 8 | 0.40 |

The shared level contributes as bonus levels for time reduction. Max shared bonus: `+20 effective lab levels`.

## Technology Dependencies Graph

Technologies form a directed acyclic graph (DAG). A technology cannot be researched until all prerequisites are met.

Example subgraph for **Plasma Cannon IV**:

```
laser_tech_3 ──→ ion_tech_2 ──→ plasma_tech_1 ──→ plasma_weapon_1
                                                       │
                                                       ↓
                                               plasma_weapon_2
                                                       │
                                                       ↓
                                               plasma_weapon_3
                                                       │
                                              ┌────────┴────────┐
                                         energy_tech_6   plasma_weapon_4
```

A technology with no prerequisites is a **root tech** (e.g. `energy_tech_1`).

## Research Queue Mechanics

- Each Research Lab provides **1 research queue slot**
- A planet with L5 lab + L3 lab = 2 parallel projects
- Max parallel projects per empire: `min(totalLabs, 10)`
- Queue ordering: projects process in FIFO order per lab
- Queue can hold up to 5 pending projects per slot

### Rescheduling

Researching a prerequisite while a dependent is queued auto-pauses the dependent. Paused projects retain 100% progress.

## Instant Research (Rush)

```
rushCost = researchTimeRemaining × 2 × (1 + 0.01 × currentLevel)
```

Cost is in Credits. Minimum rush cost: 1000 CR. Rush is available when `timeRemaining > 60s`.

## Technology Effects

Technologies affect the following systems:

| Effect Category | Example | Applied To |
|----------------|---------|------------|
| Damage bonus | `+5% laser damage` | All ships with laser weapons |
| Shield bonus | `+3% shield HP` | All ships |
| Speed bonus | `+10% warp speed` | Ships with warp drives |
| Production bonus | `+5% metal output` | All mines |
| Building unlock | `Allows Nanite Factory` | Building system |
| Ship unlock | `Allows Battlecruiser` | Shipyard blueprints |
| Defense unlock | `Allows Plasma Turret` | Defense structures |
| Cost reduction | `-2% building cost` | All buildings |

Bonuses are applied additively within each branch. Two +10% weapon techs give +20%.

## Unique Technologies per Realm

Each realm (game server) has 3-5 unique technologies available only in that realm:

| Realm Theme | Example Unique Tech | Effect |
|-------------|---------------------|--------|
| Void | Quantum Entanglement | +50% sensor range |
| Ember | Solar Focusing | +100% solar plant output |
| Crystal | Harmonic Resonance | +30% crystal production |
| Nebula | Gas Core Mining | +25% deuterium output |

Unique techs are gated behind special questlines or world boss drops.

## Research Point Generation

```
pointsPerHour = sum(labLevels × baseProduction × bonuses)
```

| Factor | Value |
|--------|-------|
| `baseProduction` | 10 RP/hour per lab level |
| `bonuses` | Sum of additive bonuses |
| RP cap per lab | 5000 RP stored max |

### Scientist Assignment

Players can assign up to `labLevel × 2` scientists to a lab:

```
bonus = assignedScientists × 0.02 × (1 + scientistLevel × 0.1)
```

Scientists have levels 1-50. Higher levels provide diminishing returns beyond level 30.
