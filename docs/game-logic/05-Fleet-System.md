# Fleet System

## Ship Classes (13 Tiers, 90+ Classes)

| Tier | Category | Examples | Min Cargo | Max Attack |
|------|----------|----------|-----------|------------|
| 1 | Scout | Pathfinder, Explorer | 100 | 5 |
| 2 | Light Fighter | Saber, Rapier | 50 | 20 |
| 3 | Heavy Fighter | Gladius, Manticore | 100 | 40 |
| 4 | Bomber | Hellion, Reaver | 200 | 80 |
| 5 | Frigate | Trident, Sentinel | 500 | 60 |
| 6 | Destroyer | Annihilator, Vanquisher | 800 | 150 |
| 7 | Cruiser | Eclipse, Dauntless | 1500 | 300 |
| 8 | Battlecruiser | Behemoth, Tyrant | 2000 | 500 |
| 9 | Battleship | Leviathan, Colossus | 5000 | 1000 |
| 10 | Carrier | Ark, Nexus | 10000 | 400 |
| 11 | Dreadnought | Doomsday, Omega | 15000 | 2500 |
| 12 | Titan | Imperator, Eternity | 50000 | 5000 |
| 13 | Worldship | Genesis, Oblivion | 500000 | 15000 |

## Ship Stat Definitions

| Stat | Description | Range | Affected By |
|------|-------------|-------|-------------|
| Hull Points | Total HP | 100-5,000,000 | Armor tech |
| Health | Current damage state | 0-HP | Repairs |
| Armor (×6 types) | Damage reduction per type | 0-50,000 | Armor tech |
| Shields (×6 types) | Absorb damage per type | 0-100,000 | Shield tech |
| Weapons (×12 types) | Damage output per type | 0-50,000 | Weapon tech |
| Power | Energy available | 0-100,000 | Engine type |
| Engine | Propulsion type | See table | Propulsion tech |
| Speed | Travel speed (units/sec) | 100-50,000 | Engine, tech |
| Maneuverability | Evasion bonus | 0-50 | Engine type |
| Cargo Capacity | Resource transport | 0-500,000 | Hull size |
| Fuel Capacity | Deuterium storage | 0-100,000 | Fuel tanks |
| Crew Capacity | Max crew on board | 0-100,000 | Ship class |
| Attack | Aggregate attack power | 0-50,000 | Weapons |
| Defense | Aggregate defense | 0-25,000 | Armor + shields |
| Accuracy | Hit chance modifier | 0-30% | Sensors |
| Evasion | Dodge chance | 0-60% | Maneuverability |
| Critical Hit | Double damage chance | 0-25% | Targeting system |
| Sensor Range | Detection range | 0-500 | Sensor array |
| Stealth Rating | Cloaking ability | 0-100 | Cloaking device |
| Repair Rate | HP/sec in dock | 0-5000 | Nanite repair |
| Morale Bonus | Combat effectiveness | 0-15% | Crew morale |

### Engine Types

| Engine Type | Speed Multiplier | Fuel Efficiency | Power Cost |
|-------------|-----------------|-----------------|------------|
| Ion | ×1.0 | 1.0 | 10 |
| Fusion | ×1.5 | 0.8 | 25 |
| Antimatter | ×2.5 | 0.5 | 50 |
| Quantum | ×4.0 | 0.4 | 100 |
| Warp | ×6.0 | 0.2 | 200 |
| Zero-Point | ×10.0 | 0.1 | 500 |
| Tachyon | ×15.0 | 0.05 | 1000 |
| Dimensional | ×25.0 | 0.02 | 5000 |

## Ship Cost Formulas

```
metalCost = baseMetal × 1.8^tier
crystalCost = baseCrystal × 1.6^tier
deuteriumCost = baseDeuterium × 1.4^tier
buildTime = baseTime × 1.5^tier / (1 + shipyardLevel × 0.05 + naniteLevel × 0.1)
```

### Example: Frigate (Tier 5)

| Resource | baseCost | Formula | Cost at T5 |
|----------|----------|---------|------------|
| Metal | 2,000 | `2000 × 1.8^5` | 37,792 |
| Crystal | 1,000 | `1000 × 1.6^5` | 10,486 |
| Deuterium | 500 | `500 × 1.4^5` | 2,688 |
| Time | 1800s | `1800 × 1.5^5 / (1 + speedBuffs)` | 13,671s |

## Ship Build Queue

- Each Shipyard has its own queue
- Queues default to 5 slots (can be expanded to 15 with upgrades)
- Ships are built sequentially per queue
- **Batch ordering**: build up to 1000 identical ships in one slot

### Rush Build

```
rushCost = remainingTime × 3 Credits/second
```

## Fleet Composition Rules

| Rule | Limit |
|------|-------|
| Max ships per fleet | 100,000 |
| Max fleet size (cargo units) | 10,000,000 |
| Max fleets per player | 20 (base) + research bonus |
| Max allied fleet per system | 500,000 ships |
| One Worldship per fleet | Limit 1 |
| Titans per fleet | `min(fleetSlots, 5)` |

## Fleet Movement

```
travelTime = distance / speed × fuelConsumption
```

| Variable | Description |
|----------|-------------|
| `distance` | Euclidean distance between systems |
| `speed` | Ship's max speed (slowest ship in fleet) |
| `fuelConsumption` | Engine modifier |

### Fuel Consumption

```
fuelUsed = distance × fuelConsumptionRate × shipCount × deuteriumPerUnit
```

Fleets without sufficient fuel slow to **20% speed**. Stranded fleets can be rescued by refueling missions.

## Fleet Formations

| Formation | Bonus | Penalty | Best For |
|-----------|-------|---------|----------|
| Line | None | None | Balanced |
| Vanguard | +20% attack | -15% defense | Offense |
| Flanking | +30% accuracy | -10% armor | Ambush |
| Turtle | +40% defense | -30% attack | Defense |
| Wolfpack | +25% critical | -25% shields | Hit-and-run |
| Spearhead | +15% speed, +15% attack | -20% shields | Breakthrough |
| ShieldWall | +50% shields | -30% attack | Protect carriers |
| Diamond | +10% all stats | None | Elite squads |

Formations are set before combat and cannot be changed mid-battle.

## Crew System

### Crew Types

| Type | Role | Stat Affected |
|------|------|---------------|
| Engineer | Repairs, power | Shield regen, repair rate |
| Gunner | Weapon accuracy | Accuracy, critical hit |
| Pilot | Ship handling | Evasion, speed |
| Marine | Boarding | Invasion power |
| Scientist | Research | RP generation, sensor range |
| Medic | Crew recovery | Morale, crew survival |

### Crew Training & Experience

```
crewXPPerBattle = 10 × (enemyLevel / crewLevel)
crewLevel = floor(sqrt(totalXP / 100))
```

Each crew level provides `+1%` to their stat. Max crew level: 100.

### Crew Specialization

At level 25, 50, and 75, crew gain a specialization:

- **Engineer**: Power Efficiency / Repair Expertise / Shield Focus
- **Gunner**: Rapid Fire / Critical瞄准 / Piercing Shot
- **Pilot**: Evasive Maneuvers / Speed Demon / Formation Leader

## Officer System

### Officer Roles

| Role | Primary Stat | Secondary Stat |
|------|-------------|----------------|
| Admiral | Fleet attack bonus | All ship stats +2% |
| Captain | Ship-specific buff | Crew morale +10% |
| Tactical | Weapon damage | Accuracy |
| Engineering | Shield/armor | Repair speed |
| Navigation | Fleet speed | Fuel efficiency |
| Science | Sensor range | Research speed |

### Officer Skills

Each officer has 3 skill slots unlocked at levels 1, 10, and 25.

```
skillEffect = baseEffect × (1 + officerLevel × 0.01)
```

Skills include: `Fleet Command`, `Overcharge Weapons`, `Reinforce Shields`, `Tactical Retreat`, `Scout Range`, `Resource Efficiency`.

### Officer Levels

```
xpRequired = 1000 × 1.5^level
officerMaxLevel = 60
```

## Hero/Commander System

Named heroes with unique abilities:

| Hero | Faction | Ability | Effect |
|------|---------|---------|--------|
| Admiral Zhao | Terran | "Last Stand" | Fleet gets +100% shields at 10% HP |
| Commander Rex | Cygnus | "Rally" | All ships +30% attack for 2 rounds |
| Empress Kaela | Void | "Phase Shift" | 50% dodge for 1 round |
| Overlord Grimm | Hive | "Swarm" | Summon 10% of fleet as drones |

Heroes are obtained through events, world boss loot, and premium draws. Each hero can be upgraded (5 star max) for increased ability potency.

## Ship Fitting / Modules

Ships have module slots determined by class:

| Slot Type | Available On | Examples |
|-----------|-------------|----------|
| Weapon Mount | All combat ships | Laser Cannon, Ion Cannon, Plasma Turret |
| Shield Generator | Tier 3+ | Standard, Heavy, Quantum, Void |
| Armor Plating | All ships | Light, Standard, Reactive, Ablative |
| Engine | All ships | Ion, Fusion, Antimatter, Quantum, Warp |
| Sensor Array | Tier 2+ | Standard, Long Range, Targeting, Stealth |
| Special Module | Tier 5+ | Cloaking Device, Repair Bay, Cargo Hold |

Module effects stack additively within category. A ship with 4 weapon mounts and +10% laser damage each gets `+40%` laser damage total.
