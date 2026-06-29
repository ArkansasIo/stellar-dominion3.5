# Ship Statistics System

## Overview

Every ship in Universe Civilization: Empires at War is defined by a comprehensive set of interlocking statistics. This document details every stat, its behavior, scaling, and interactions.

---

## 1. Core Stats

### Hull

Base structural integrity of the ship. Determines damage threshold before shields are bypassed.

```
hullDamageThreshold = hull × 0.1
```

| Tier | Min Hull | Max Hull |
|------|----------|----------|
| 1 | 100 | 500 |
| 2 | 500 | 2,000 |
| 3 | 2,000 | 10,000 |
| 4 | 10,000 | 50,000 |
| 5 | 50,000 | 250,000 |

### Health

Total hit points. Ship is destroyed when health reaches 0.

```
health = baseHealth × (1 + hullUpgradeLevel × 0.15)
```

---

## 2. Armor System (6 Types)

Each type of damage has a corresponding armor stat that reduces incoming damage of that type.

| Armor Type | Countered By | Reduction Formula |
|------------|-------------|-------------------|
| Kinetic | Projectile weapons | `damage *= 1 - (armor / (armor + 100))` |
| Energy | Beam/Laser weapons | Same formula |
| Explosive | Missile/Torpedo | Same formula |
| Plasma | Plasma weapons | Same formula |
| Quantum | Disruptor/Quantum | Same formula |
| Biological | Bio/Chemical | Same formula |

Each armor stat ranges from 0 to 10,000. Damage reduction scales logarithmically past 1,000.

---

## 3. Shields System (6 Types)

Each shield type provides capacity and regeneration for its damage type.

### Shield Capacity

```
shieldCapacity_type = baseShield_type × (1 + shieldTech × 0.1)
```

### Shield Regeneration

Regeneration occurs every 5 seconds out of combat, or every 10 seconds in combat.

```
shieldRegen_type = baseRegen_type × (1 + shieldTech × 0.05) / tick
```

### Shield Interaction with Armor

Shields absorb damage before armor. Once shields are depleted, armor applies.

---

## 4. Weapons System (12 Types)

| Weapon | Damage Type | Range | Accuracy | Fire Rate | Special |
|--------|-------------|-------|----------|-----------|---------|
| Laser | Energy | Short | High | Fast | Low power cost |
| Ion | Energy | Medium | Medium | Medium | Shield damage bonus (+25%) |
| Plasma | Plasma | Medium | Medium | Medium | Armor penetration (+15%) |
| Gauss | Kinetic | Long | High | Slow | High single-shot damage |
| Missile | Explosive | Long | Low | Slow | AoE splash (radius 2) |
| Railgun | Kinetic | Very Long | Medium | Very Slow | Ignores 50% armor |
| Beam | Energy | Short | Very High | Continuous | Damage ramps (+10%/s) |
| Disruptor | Quantum | Medium | Medium | Medium | Disables systems (20% chance) |
| Cannon | Explosive | Medium | Medium | Slow | Balanced all-rounder |
| Torpedo | Explosive | Short | Low | Very Slow | Massive damage, ignores shields |
| Fighter | Kinetic | Short | High | Very Fast | Anti-ship, small payload |
| Bomber | Explosive | Medium | Medium | Fast | Anti-structure bonus (+50%) |

### Weapon Damage Calculation

```
finalDamage = weaponDamage × (1 + attackTech × 0.05) × (1 + commanderAttackBonus)
  × damageTypeMultiplier × random(0.9, 1.1)
```

### Accuracy Check

```
hitChance = weaponAccuracy × (1 + accuracyBonus - targetEvasion)
if random(0, 1) < hitChance → hit
else → miss
```

---

## 5. Power System

### Power Generation

```
totalPower = reactorOutput × (1 + powerTech × 0.08)
```

### Power Allocation

Systems require power to function. Insufficient power causes penalties:

| System | Power Cost | Penalty at <100% |
|--------|-----------|-------------------|
| Weapons | Per weapon × 10 | -50% damage at 50% power |
| Shields | Per shield × 15 | -50% capacity at 50% power |
| Engines | Per engine × 8 | -50% speed at 50% power |
| Sensors | 20 | -75% range at 50% power |

---

## 6. Engine System (8 Types)

| Engine | Speed Bonus | Fuel Efficiency | Signature | Tech Required |
|--------|-------------|-----------------|-----------|---------------|
| Ion | +20% | 1.0 | 1.0 | None |
| Fusion | +40% | 0.8 | 1.2 | Tech Lv 5 |
| Antimatter | +70% | 0.5 | 1.5 | Tech Lv 10 |
| Quantum | +100% | 0.4 | 1.8 | Tech Lv 15 |
| Warp | +150% | 0.3 | 2.5 | Tech Lv 20 |
| Zero-Point | +200% | 0.2 | 3.0 | Tech Lv 25 |
| Tachyon | +300% | 0.1 | 4.0 | Tech Lv 30 |
| Dimensional | +500% | 0.05 | 5.0 | Tech Lv 35 |

### Fuel Efficiency

```
fuelConsumptionRate = baseConsumption / efficiency
```

---

## 7. Speed & Maneuverability

### Speed Values

| Speed Type | Description | Scaling |
|-----------|-------------|---------|
| Base Speed | Movement on galaxy map | `baseSpeed × (1 + engineBonus)` |
| Combat Speed | Speed during combat | `baseSpeed × 0.6` |
| Hyperspace Speed | Inter-system travel | `baseSpeed × (1 + hyperspaceTech × 0.2)` |

### Maneuverability

```
turnRate = baseTurnRate × (1 - massPenalty) × (1 + maneuverTech × 0.05)
combatEvasion = turnRate × 0.02  // % chance to evade in combat
```

---

## 8. Cargo, Fuel, Crew

### Cargo

| Cargo Type | Capacity | Used By |
|-----------|----------|---------|
| Resources | Varies | Minerals, credits, deuterium |
| Troops | Varies | Ground forces for invasions |
| Equipment | Varies | Modules, components |

### Fuel

```
fuelCapacity = engineTier × 1000
fuelConsumption_perUnit = consumptionRate × distance × (1 + shipMass)
```

### Crew

```
crewCapacity = shipClass × 50
requiredCrew = shipClass × 30
```

If `requiredCrew > availableCrew` → stat penalties apply (up to -50%).

---

## 9. Composite Stats

| Stat | Formula | Description |
|------|---------|-------------|
| Attack | `average(weaponDamages) × (1 + attackTech × 0.05)` | Composite offensive power |
| Defense | `average(armors) × (1 + defenseTech × 0.05) + shields` | Composite defensive power |
| Accuracy | `average(weaponAccuracies)` | Base hit chance |
| Evasion | `maneuverability × 0.5 + engineSignatureReduction` | Base dodge chance |

### Critical Hits

```
critChance = baseCritChance + accuracyBonus × 0.01
critMultiplier = 2.0 + criticalTechLevel × 0.1

onCrit: damage *= critMultiplier
```

---

## 10. Sensor & Stealth

```
sensorRange = baseRange × (1 + sensorTech × 0.1)
scanStrength = baseStrength × (1 + sensorTech × 0.08)
signatureReduction = engine.stealth × 0.5 + cloakingDevice.strength
cloakingStrength = baseCloak × (1 + cloakTech × 0.1)
```

Detection occurs when `scanStrength > targetSignature`.

---

## 11. Repair & Morale

```
repairRate_HPperHour = baseRepair × (1 + repairTech × 0.1) × (1 + crewMoraleBonus)
moraleBonus = moralePercentage × 0.01  // applied to all stats
```

---

## 12. Stat Scaling

### Per Level

```
stat_atLevel(level) = baseStat × (1 + (level - 1) × growthRate)
growthRate = 0.1 for Common, 0.12 for Rare, 0.15 for Epic, 0.2 for Legendary
```

### Module Effects

Modules add flat or percentage bonuses:

```json
{
  "moduleId": "reinforced_hull_3",
  "effects": [
    { "stat": "hull", "type": "flat", "value": 500 },
    { "stat": "health", "type": "percent", "value": 0.1 }
  ]
}
```

### Commander/Crew Effects

```
statWithCommander = baseStat × (1 + commanderSkill × 0.02 + crewSynergy × 0.01)
```

---

## 13. Ship Class Stat Ranges

| Class | HP Range | Armor Avg | Speed | Weapons | Cargo | Crew |
|-------|----------|-----------|-------|---------|-------|------|
| Fighter | 100-500 | 50 | 200-300 | 1-2 | 10 | 1-3 |
| Corvette | 500-2K | 150 | 180-250 | 2-4 | 50 | 5-15 |
| Frigate | 2K-8K | 300 | 150-200 | 4-8 | 200 | 20-50 |
| Destroyer | 8K-20K | 500 | 120-180 | 6-12 | 500 | 50-100 |
| Cruiser | 20K-80K | 800 | 100-150 | 8-16 | 2K | 100-300 |
| Battlecruiser | 50K-150K | 1,200 | 80-120 | 12-20 | 5K | 200-500 |
| Battleship | 150K-500K | 2,000 | 60-100 | 16-24 | 10K | 500-1K |
| Carrier | 100K-400K | 1,500 | 50-80 | 8-12 | 50K | 1K-3K |
| Dreadnought | 500K-2M | 5,000 | 40-60 | 20-30 | 20K | 2K-5K |
| Titan | 2M-10M | 10,000 | 20-40 | 30-50 | 100K | 5K-20K |
