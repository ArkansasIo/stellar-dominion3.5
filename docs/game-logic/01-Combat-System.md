# Combat System

## Combat Flow

Combat proceeds through a strict sequence of phases:

1. **Attack Declaration** -- Attacker selects target fleet/planet and launches
2. **Travel Time** -- Fleet travels from origin to target
3. **Arrival** -- Fleet enters orbit; defender is notified
4. **Combat Phase 1 (Long Range)** -- Range > 500 units; sniper/cannon/missile fire
5. **Combat Phase 2 (Medium Range)** -- Range 100-500 units; all energy weapons
6. **Combat Phase 3 (Short Range)** -- Range < 100 units; all weapons, fighters, bombers
7. **Phase 4 (Boarding)** -- Marines deploy if all defenses down
8. **Damage Calculation** -- All damage tallied per ship
9. **Result** -- Winner determined; report generated

Each combat round lasts 30 seconds. Phases 1-3 may repeat for up to 6 rounds total.

## Initiative

Determines firing order within each phase.

```
initiative = baseInitiative + speedBonus + commanderBonus
```

| Component | Source | Range |
|-----------|--------|-------|
| `baseInitiative` | Ship class table | 1-100 |
| `speedBonus` | `shipSpeed / 1000` | 0-50 |
| `commanderBonus` | Commander Tactical skill / 2 | 0-25 |

Ships with higher initiative fire first. Ties are broken by `baseInitiative`, then randomly.

## Accuracy

Determines whether a shot hits its target.

```
accuracy = baseAccuracy + (sensorBonus - targetEvasion) + levelBonus
```

| Variable | Description |
|----------|-------------|
| `baseAccuracy` | Ship class base (20-95%) |
| `sensorBonus` | Sum of sensor module bonuses (0-30%) |
| `targetEvasion` | Target's evasion rating (0-60%) |
| `levelBonus` | Ship level / tech level bonus: `+0.5% per level` |

Minimum accuracy floor: **10%**. Maximum accuracy cap: **98%**.

## Damage Formula

```
damage = weaponDamage × (1 + attackBonus) × (1 - targetDefensePenalty) - armorReduction
```

| Variable | Description |
|----------|-------------|
| `weaponDamage` | Raw weapon damage value |
| `attackBonus` | Sum of all attack modifiers |
| `targetDefensePenalty` | Defense modifier (0.0 - 0.5) |
| `armorReduction` | Flat armor value of target |

Minimum damage floor: **1** (grazing hit).

## Shield Interaction

Damage is resolved against defensive layers in order:

```
1. damageRemaining -= shields[currentType]
2. damageRemaining -= armorValue
3. hull -= damageRemaining * hullDamageMultiplier
```

### Shield Regeneration

Per combat round, each ship regenerates shields:

```
shieldsRegenerated = maxShields × 0.10 × (1 + regenBonus)
```

Shield regeneration applies at the **start** of each new round.

### Armor Penetration Types

| Type | Bypasses | Effective Against |
|------|----------|-------------------|
| Kinetic | 10% shields | Hull, armor |
| Energy | 20% armor | Shields |
| Explosive | 30% armor | Stationary targets |
| Plasma | 15% shields, 15% armor | All-around |
| Quantum | 50% shields, 25% armor | High-shield targets |
| Biological | Ignores armor | Organic hulls |

Armor penetration reduces effective defense by the listed percentage.

### Weapon Range Categories

| Category | Max Range | Damage Falloff | Examples |
|----------|-----------|----------------|----------|
| Melee | 10 | None | Boarding pods |
| Short | 150 | `× max(0.5, 1 - (range/150))` | Laser, Fighter |
| Medium | 500 | `× max(0.3, 1 - (range/500))` | Ion, Plasma, Gauss |
| Long | 1500 | `× max(0.1, 1 - (range/1500))` | Railgun, Missile, Cannon |
| Extreme | 5000 | `× max(0.05, 1 - (range/5000))` | Sniper artillery |

## Fleet Retreat Mechanics

Starting round 2, either side may attempt retreat:

```
retreatChance = baseChance + commanderSkill × 0.05
```

| Variable | Base Value |
|----------|------------|
| `baseChance` | 20% per round |
| `commanderSkill` | Navigation skill (0-100) |
| Max retreat chance | 60% per round |

Retreat succeeds on a roll. Failed retreat locks fleet for 1 round. Successful retreat removes fleet from combat after 1 more round (pursuit fire allowed).

## Combat Report Structure (JSON Schema)

```json
{
  "battleId": "uuid",
  "timestamp": "ISO8601",
  "attacker": { "playerId": "string", "fleetId": "string" },
  "defender": { "playerId": "string", "fleetIdOrPlanet": "string" },
  "rounds": [
    {
      "round": 1,
      "phase": "long_range",
      "actions": [
        {
          "sourceShipId": "uuid",
          "targetShipId": "uuid",
          "weaponType": "string",
          "damageDealt": 0,
          "shieldsAbsorbed": 0,
          "armorAbsorbed": 0,
          "hullDamage": 0,
          "shipDestroyed": false
        }
      ]
    }
  ],
  "casualties": { "attacker": [ "shipId" ], "defender": [ "shipId" ] },
  "loot": { "metal": 0, "crystal": 0, "deuterium": 0 },
  "debris": { "metal": 0, "crystal": 0 },
  "winner": "attacker | defender | draw",
  "retreat": { "attacker": false, "defender": false, "round": 0 }
}
```

## PvP Protection Rules

| Protection Type | Conditions | Effects |
|-----------------|------------|---------|
| **Newbie Protection** | Account age < 7 days OR score < 5000 | Cannot be attacked; cannot attack |
| **Tournament Protection** | Player opted in for tournament | Immune to attacks during event |
| **Vacation Mode** | Player activated vacation (24h cooldown) | Fleet recalled, immune to attack |
| **Noob-Fleet Save** | Fleet in transit > 10 min duration | Cannot be intercepted |
| **Score Gap** | Attacker score > 5× defender score | Attack blocked |

Players lose vacation protection if they have active fleets or initiate attacks.

## NPC Combat

### Pirates

- Spawn in unclaimed systems
- Strength scales with system distance from capital
- Drop: 30-60% of fleet cost as loot
- Aggression range: 2 sectors

### Alien Hives

- Static nests on hostile planets
- Each hive has a **Hive Mind** HP pool
- Killing 50% of drones triggers swarm retaliation
- Loot drops: rare artifacts, research data

### Space Creatures

- Roaming neutral mobs in deep space
- Types: Void Wyrm, Crystal Leviathan, Nebula Kraken
- Unique loot tables per creature type

## World Boss Combat

Bosses spawn weekly in designated systems. Alliances/groups may attack together.

### Phases

| Phase | Trigger | Behavior |
|-------|---------|----------|
| Phase 1 | 100%-75% HP | Standard attacks, moderate damage |
| Phase 2 | 75%-40% HP | Adds spawn every 30s, AOE attacks |
| Phase 3 | 40%-15% HP | Enrage timer starts, damage +50% |
| Phase 4 | 15%-0% HP | Boss focuses weakest target, gains shield |

### Enrage Timer

```
enrageTimer = 300 seconds (Phase 3 trigger)
After enrage: bossDamageMultiplier = 1.5 + 0.1 × secondsSinceEnrage
```

### Loot Tables

| Contribution % | Loot Tier | Guaranteed Drops |
|----------------|-----------|------------------|
| Top 1 | 40%+ | Legendary artifact, hero shards |
| Top 5 | 20%+ | Rare blueprints, premium currency |
| Top 20 | 5%+ | Resources, common blueprints |
| Participants | <5% | Participation reward |

## Ground Invasion

### Invasion Power Formula

```
invasionPower = marineCount × (1 + techBonus + commanderBonus + equipmentBonus)
```

| Variable | Description |
|----------|-------------|
| `marineCount` | Number of marines deployed |
| `techBonus` | Ground combat tech level × 0.05 |
| `commanderBonus` | Commander ground skill × 0.01 |
| `equipmentBonus` | Sum of equipment modifiers |

### Planetary Defense Formula

```
defensePower = turretCount × basePower × (1 + shieldBonus + techBonus)
```

| Variable | Description |
|----------|-------------|
| `turretCount` | Number of defensive turrets |
| `basePower` | Per-turret base power |
| `shieldBonus` | Planetary shield generator level × 0.1 |
| `techBonus` | Defense tech level × 0.05 |

### Orbital Bombardment

Bombardment deals damage directly to planetary defenses and population:

```
bombardmentDamage = fleetBombardPower × (1 - planetShieldReduction)
populationLoss = bombardmentDamage × 0.01
defenseDamage = bombardmentDamage × 0.5
```

Bombarding a planet reduces its resource production by `populationLoss%` and destroys `defenseDamage` worth of turrets.
