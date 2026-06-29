# Ground Combat System

## Ground Unit Types

| Unit | Attack | Defense | HP | Speed | Cost (CR) | Training Time |
|------|--------|---------|----|-------|-----------|---------------|
| Marine | 10 | 8 | 50 | 10 | 500 | 60s |
| Heavy Infantry | 15 | 15 | 100 | 7 | 1200 | 120s |
| Sniper | 25 | 5 | 30 | 12 | 2000 | 180s |
| Walker | 20 | 30 | 200 | 5 | 5000 | 300s |
| Tank | 40 | 25 | 300 | 6 | 8000 | 400s |
| Hover Tank | 35 | 20 | 200 | 9 | 7500 | 360s |
| Artillery | 50 | 10 | 100 | 4 | 10000 | 480s |
| Drone | 8 | 5 | 25 | 15 | 300 | 30s |
| Mech | 60 | 50 | 500 | 5 | 25000 | 600s |
| Commander | 30 | 30 | 200 | 10 | 10000 | 900s |
| Special Forces | 45 | 35 | 150 | 14 | 15000 | 720s |
| Militia | 5 | 3 | 20 | 8 | 50 | 10s |
| Guard | 12 | 18 | 80 | 6 | 800 | 90s |

### Special Abilities

| Unit | Ability | Effect |
|------|---------|--------|
| Sniper | Precision Shot | Ignores 50% armor, +100% accuracy |
| Artillery | Barrage | Hits 3 targets at 50% damage |
| Drone | Swarm | +5% attack per allied drone in battle |
| Mech | Siege Mode | +100% vs buildings, -50% speed |
| Commander | Leadership | +10% to all allied units |
| Special Forces | Infiltrate | Bypasses minefields |

## Unit Stats

Each unit has the following core stats:

```
attack       = baseAttack × (1 + techBonus + commanderBonus)
defense      = baseDefense × (1 + techBonus + armorBonus)
health       = baseHealth × (1 + techBonus)
speed        = baseSpeed × (1 + movementTechBonus)
armor        = baseArmor × (1 + armorTechBonus)
cost         = baseCost × (1 - massProductionBonus)
trainingTime = baseTime / (1 + academyLevel × 0.05)
```

## Invasion Mechanics

### Required Marines

```
requiredMarines = planetDefense × difficultyMultiplier
```

| Variable | Description |
|----------|-------------|
| `planetDefense` | Total defense power of the planet |
| `difficultyMultiplier` | 1.0 base, +0.1 per planetary shield level |

If the attacker deploys fewer than `requiredMarines`, the invasion fails automatically.

### Initial Deployment

```
landedTroops = min(deployedMarines, transportCapacity × landingCraftCount)
transportCapacity = perShipCapacity × (1 + techBonus)
```

Transports unload over 3 rounds. Attacker may abort landing in the first round (50% losses).

## Combat Resolution Per Round

Ground combat proceeds in rounds. Each round has 4 phases:

1. **Artillery Phase** -- Artillery and bombardment fire first
2. **Ranged Phase** -- Snipers, special forces fire
3. **Assault Phase** -- All units engage
4. **Morale Phase** -- Check morale, apply penalties

### Damage per round

```
roundDamage = unitAttack × (1 + moraleModifier) × random(0.85, 1.15)
unitDefense = unitDefense × (1 + terrainBonus + fortificationBonus)
actualDamage = max(1, roundDamage - unitDefense / 2)
```

Units with HP ≤ 0 are removed. Morale starts at 100 and decreases by 5 per round (minimum 25).

### Morale Effects

| Morale | Effect |
|--------|--------|
| 100-75 | +10% attack |
| 74-50 | No modifier |
| 49-25 | -15% attack, -10% defense |
| <25 | Units may flee (10% chance per round) |

## Planetary Defense Structures

### Turret Types

| Turret | basePower | Range | Special |
|--------|-----------|-------|---------|
| Laser Turret | 50 | Short | +10% accuracy |
| Ion Turret | 75 | Medium | Disables units (20% chance) |
| Plasma Turret | 120 | Medium | +25% vs mechs |
| Gauss Turret | 100 | Long | Ignores 30% armor |
| Missile Turret | 150 | Long | AOE 2 targets |

### Defense Upgrades

```
turretPower = basePower × (1 + shieldGeneratorLevel × 0.1 + techBonus)
turretHP = 500 × (1 + fortificationLevel × 0.2)
```

### Shield Generators

```
shieldHP = 5000 × 1.2^level
shieldRegenPerRound = shieldHP × 0.05
```

Shield generators absorb **30%** of all incoming damage before turrets take hits.

### Bunkers

```
bunkerHP = 2000 × 1.3^level
garrisonSlots = 5 × level
bunkerDefenseBonus = 0.10 × level
```

Units inside bunkers receive `defenseBonus` to defense.

### Minefields

```
mineDamage = 200 × 1.2^level
mineCount = 10 × level
```

Minefields are hidden. Attacking units trigger mines on entry (50% detection chance by scouts).

### Orbital Defense Platforms

Stationed in orbit, these fire on incoming troop transports before landing:

```
platformPower = 300 × level × (1 + techBonus)
landingDenied% = platformPower / (platformPower + transportHull)
```

Each platform level shoots down `2%` of incoming landing craft per round.

## Ground Combat Report Structure

```json
{
  "battleId": "uuid",
  "planetId": "string",
  "attacker": { "playerId": "string", "troops": [ { "type": "Marine", "count": 500 } ] },
  "defender": { "playerId": "string", "troops": [...], "turrets": [...] },
  "rounds": [
    {
      "round": 1,
      "phase": "artillery",
      "attackerDamage": 1200,
      "defenderDamage": 800,
      "attackerCasualties": { "Marine": 10, "Tank": 1 },
      "defenderCasualties": { "LaserTurret": 2, "Guard": 5 }
    }
  ],
  "result": "attacker_victory | defender_victory | stalemate",
  "loot": { "metal": 5000, "crystal": 2000 },
  "occupation": { "garrisonSize": 200, "resistanceLevel": 15 }
}
```

## Occupation Mechanics

### Garrison

After victory, the attacker leaves a garrison:

```
minGarrison = planetPopulation × 0.01
maxResourceExtraction = garrisonSize × 2 units/hour
```

### Resource Extraction

```
extractionRate = garrisonSize × 0.5 × (1 - resistanceLevel × 0.02)
```

Resistance level starts at `10` and increases by `1 per day` of occupation (max 100). Above 80 resistance, extraction drops to 0.

### Resistance

Resistance is generated by the planet's population:

```
resistanceGrowth = 2 + population / 10000 per day
```

Garrison size > `population × 0.02` halves resistance growth. Special forces reduce resistance by `5` per mission.

## Planetary Bombardment Effects

Orbital bombardment from fleet weapons affects ground units and population:

```
groundDamage = fleetBombardPower × 0.3 × (1 - shieldGeneratorAbsorption)
populationKilled = fleetBombardPower × 0.001
buildingDamage% = fleetBombardPower × 0.0001 (max 30%)
```

Heavy bombardment reduces **morale** of defending troops by `-20` per round. Bombardment continues during ground combat unless defender has orbital defenses.

### Bombardment Types

| Weapon Type | Ground Effectiveness | Population Damage |
|-------------|---------------------|-------------------|
| Kinetic | 40% | Low |
| Energy | 60% | Medium |
| Explosive | 100% | High |
| Plasma | 80% | Very High |
| Biological | 20% | Extreme (toxin) |

## Fortification System

Before combat, the defender can construct fortifications:

```
fortificationLevel = min(defenseTechLevel, maxPlanetLevel)
fortificationHP = 1000 × 1.5^level
defenseBonus = 0.05 × level
```

### Fortification Types

| Type | Bonus | Cost | Build Time |
|------|-------|------|------------|
| Trenches | +15% defense | 500 MT | 30 min |
| Walls | +25% defense, +500 HP | 2000 MT | 60 min |
| Bunkers | +5 garrison slots | 5000 MT | 120 min |
| Shield Bunker | +10% shield to all | 10000 CRY | 180 min |
| Citadel | +50% defense, +2000 HP | 50000 MT | 480 min |

Fortifications can be damaged by bombardment. Repairs cost 50% of build cost and take 25% of build time.

### Fortification Damage

```
damageToFort = bombardmentDamage × 0.5 / (1 + fortificationLevel × 0.2)
```

When fortifications reach 0 HP, they are destroyed and provide no further bonus.
