# Combat Resolver — `combatService.ts`

## Overview

The combat resolver handles all PvP and PvE fleet engagements. Combat is resolved in discrete rounds with sequential phases. Each phase allows specific ship weapon types to fire.

---

## Core Function

### `resolveFleetBattle(fleet1, fleet2) → CombatResult`

Resolves a full battle between two fleets and returns a detailed combat report.

**Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| `fleet1` | `Fleet` | Attacking fleet (ship groups, positions, upgrades) |
| `fleet2` | `Fleet` | Defending fleet |

**Returns:** `CombatResult`

```typescript
interface CombatResult {
  winner: 'attacker' | 'defender' | 'draw';
  rounds: CombatRound[];
  attackerLosses: ShipLoss[];
  defenderLosses: ShipLoss[];
  debris: DebrisField;
  experienceGained: ExperienceMap;
  moraleChanges: MoraleDelta[];
  fleetStatusAfter: FleetStatus[];
  retreatedShips: ShipGroup[];
}
```

---

## Round-Based Resolution

Each round executes phases in strict order. A round lasts 30 seconds of simulation time.

```
ROUND LOOP:
  1. INITIATIVE    — Determine firing order per ship group
  2. LONG_RANGE    — Missiles, torpedoes, spinal cannons fire
  3. MEDIUM_RANGE  — Lasers, railguns, plasma cannons fire
  4. SHORT_RANGE   — Point-defense, fighters, bombers engage
  5. BOARDING      — Marines and boarding pods attempt capture
  6. REPAIR        — Ships regenerate shields; damage control
```

A round ends when all phases complete. Repeat until one side is eliminated, retreats, or round limit (100) is reached.

---

## Initiative Calculation

Each ship group's initiative determines when it fires within its weapon range phase.

```
initiative = baseInitiative + (crewExperience × 1.5) + commanderBonus + (morale × 0.5)
```

- Base initiative per ship class: Fighter=10, Corvette=8, Destroyer=6, Cruiser=4, Battleship=2, Carrier=1
- Higher initiative fires first within the same phase
- Ties broken by: speed > hull integrity > random

---

## Target Selection Algorithm

Each ship group selects targets using a priority-weighted system:

1. **Highest Threat** — Sum of `(weaponDamage × 1.2) + (utilityScore × 0.8)` per enemy ship, target ships with highest value
2. **Lowest Health** — Among remaining targets, prefer ships with lowest `(hullHP + shieldHP)`
3. **Random Weighted** — If multiple targets have equal priority, weighted random selection

Target selection re-evaluates each round.

Overkill protection: once a ship has taken enough damage to be destroyed, remaining shots from the same volley are redirected to the next valid target.

---

## Damage Calculation

```
damagePerShot = weaponDamage × (1 + attackBonus) × criticalMultiplier
damageAfterArmor = damagePerShot × (1 - armorReduction)
finalDamage = max(damageAfterArmor × (1 - evasionModifier), 0)
```

**Weapon vs Armor Modifiers:**

| Weapon Type | Light Armor | Medium Armor | Heavy Armor | Shield |
|-------------|-------------|--------------|-------------|--------|
| Laser       | 110%        | 90%          | 70%         | 150%   |
| Railgun     | 80%         | 120%         | 110%        | 50%    |
| Missile     | 60%         | 100%         | 130%        | 80%    |
| Plasma      | 90%         | 110%         | 120%        | 60%    |
| Spinal      | 50%         | 80%          | 150%        | 200%   |
| PointDef    | 100%        | 100%         | 100%        | 40%    |

---

## Shield Damage Absorption

Shields absorb damage before hull:

```typescript
shieldDamageTaken = min(shieldHP, rawDamage × shieldAbsorptionRate)
hullDamageTaken = rawDamage - shieldDamageTaken
```

- Shield absorption rate defaults to 0.8 (shields absorb 80% of incoming damage)
- Remaining 20% bleeds through to hull
- Shield regeneration per round: `shieldRegen = maxShieldHP × 0.15 + repairBonus`
- Shields start regeneration in the REPAIR phase
- Ships with zero shields take 100% damage to hull

---

## Critical Hits

Each shot has a chance to critically hit:

```
critChance = baseCrit + (crewExperience × 0.01) + targetingComputerBonus
critMultiplier = 2.0 + (critLevel × 0.5)
```

- Base crit chance: 5%
- On crit: double damage + chance to disable modules (engines, weapons, shields)
- Module disable chance on crit: 25%, lasts 2 rounds

---

## Evasion Check

Each shot is evaluated against the target's evasion:

```
evasion = baseEvasion + speedBonus + (pilotExperience × 0.02) + (morale × 0.01)
hitChance = max(attackersAccuracy - evasion, 0.05)
```

- Roll `rng(0, 1)` — if > hitChance, shot misses entirely (0 damage)
- Minimum 5% hit chance regardless of evasion
- Maximum 98% hit chance regardless of accuracy

---

## Retreat Attempt

Each round, after SHORT_RANGE phase, either side may attempt retreat:

```
retreatChance = baseRetreatChance × (lossRatio × 1.5) × (moraleFactor)
lossRatio = destroyedShips / totalShips
```

- A side with >70% losses automatically attempts retreat
- Retreat succeeds on `rng(0, 1) < retreatChance`
- Failed retreat: fleet remains, cannot attempt again for 1 round
- Successful retreat: surviving ships flee, battle ends
- PvE flag: NPCs never retreat unless `cowardiceLevel > 0.7`

---

## Fleet Destruction Check

After each round:

- A fleet with 0 operational ships (all destroyed or retreated) is eliminated
- A fleet with >90% losses and <10% morale automatically surrenders
- Surrender: remaining ships are captured (added to victor's fleet)

---

## Debris Field Generation

After combat, debris is calculated from destroyed ships:

```
debrisMetal   = destroyedShips.reduce(sum, s => s.metalCost × 0.3)
debrisCrystal = destroyedShips.reduce(sum, s => s.crystalCost × 0.3)
```

```typescript
interface DebrisField {
  metal: number;
  crystal: number;
  position: Coordinates;
  expiresAt: Date; // 72 hours before decay
}
```

Debris fields are persistent in space and can be collected by any player with a scavenger fleet.

---

## Combat Report Generation

```typescript
interface CombatReport {
  battleId: string;
  timestamp: Date;
  attacker: { id: string; fleetId: string };
  defender: { id: string; fleetId: string };
  rounds: CombatRound[];
  finalStatus: {
    winner: string;
    attackerRemaining: ShipGroup[];
    defenderRemaining: ShipGroup[];
  };
  debris: DebrisField;
  experience: { [playerId: string]: ExperienceGain };
  morale: { [playerId: string]: MoraleDelta };
  isPvP: boolean;
}

interface CombatRound {
  roundNumber: number;
  phaseEvents: PhaseEvent[];
  retreatAttempts: RetreatAttempt[];
  roundSummary: {
    attackerShipsLost: number;
    defenderShipsLost: number;
    attackerDamageDealt: number;
    defenderDamageDealt: number;
  };
}

interface PhaseEvent {
  phase: Phase;
  shots: ShotResult[];
  boardings: BoardingAttempt[];
}

interface ShotResult {
  attackerShipGroupId: string;
  targetShipGroupId: string;
  weaponType: string;
  hit: boolean;
  critical: boolean;
  damageDealt: number;
  shieldDamage: number;
  hullDamage: number;
  moduleDisabled: string | null;
}
```

---

## Experience Gain

Surviving crew gain experience based on combat performance:

```
experienceGain = baseXP × (enemyValue / friendlyValue) × shipSurvivalMultiplier
```

- `baseXP`: 100 per battle participation
- `enemyValue / friendlyValue`: ratio of fleet strengths (stronger enemies yield more XP)
- `shipSurvivalMultiplier`: 1.0 if ship survived, 0.3 if ship was destroyed but crew escaped
- Bonus XP for kills: `+50 × enemyShipLevel`
- Bonus XP for critical hits dealt: `+10 per critical`

---

## Morale Changes

Morale shifts based on battle outcome:

| Outcome | Attacker Change | Defender Change |
|---------|----------------|-----------------|
| Victory | +15 | -25 |
| Draw | -5 | -5 |
| Defeat (retreated) | -15 | +10 |
| Defeat (destroyed) | -30 | -10 |
| Surrender | -50 | +5 |

Additional modifiers:
- Per ship lost: `-2 × (lostShipValue / totalFleetValue)`
- Per enemy ship killed: `+1 × (killedShipValue / totalEnemyValue)`
- Experience-based cap: morale cannot exceed `50 + (crewExperience × 0.2)`

---

## Fleet Status After Combat

```typescript
enum FleetStatus {
  OPERATIONAL,      // Ready for next mission
  DAMAGED,          // Needs repairs (hull < 50%)
  REPAIRING,        // Currently in repair bay
  DESTROYED,        // All ships lost
  RETREATED,        // Successfully retreated, returning to origin
  CAPTURED,         // Surrendered ships under new ownership
}
```

- Ships at `< 50% hull` get `DAMAGED` status — move speed reduced by 30%
- Ships at `< 20% hull` are forced to repair at nearest allied station
- `DESTROYED` fleets are removed from the game world
- `RETREATED` fleets auto-navigate to their origin planet

---

## PvP vs PvE Differences

| Feature | PvP | PvE |
|---------|-----|-----|
| Round limit | 100 | 50 |
| Retreat allowed | Yes | NPC: conditionally |
| Experience gain | 100% | 70% |
| Morale impact | Full | 50% |
| Debris field | Full | 50% |
| Surrender enabled | Yes | No |
| Combat report detail | Full | Simplified (no enemy stats) |

---

## NPC Combat AI Decision Trees

NPC fleets use a decision tree evaluated at the start of each round:

```
ROOT: Evaluate threat level
├── threat < 0.3 (overwhelming force)
│   └── ATTACK_ALL — evenly distribute targets
├── threat 0.3–0.7 (balanced)
│   ├── own hp > 80% → ATTACK_WEAKEST — focus fire lowest health
│   └── own hp ≤ 80% → DEFENSIVE — prioritize shield regen, target highest threat
└── threat > 0.7 (outmatched)
    ├── can retreat → RETREAT
    └── cannot retreat → SUICIDE_RUN — target enemy flagship/carriers
```

- Threat level computed as `enemyPower / (allyPower + 1)`
- NPC personality traits (aggressive, defensive, cowardly) modify thresholds by ±0.15
