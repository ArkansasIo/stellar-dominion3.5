# Occupation Service — `occupationService.ts`

## Overview

Manages planetary occupation: attackers can occupy enemy planets to extract resources. Occupations persist until broken, negotiated, or abandoned.

---

## Occupy Planet

### `occupyPlanet(attackerId, targetPlanetId, fleetId) → OccupationResult`

```typescript
interface OccupationResult {
  success: boolean;
  occupationId: string;
  garrisonRequired: number;
  extractedResources: ResourceAmount; // initial extraction
  resistanceLevel: number;
  error?: string;
}
```

**Preconditions:**
1. Target planet must be owned by another player (or unclaimed with colony)
2. Planet must not already be occupied (no active occupation)
3. Fleet must be at planet coordinates
4. Fleet must have ground troops (marines: minimum 10 units)

**Occupation Force Calculation:**

```
defensePower = planet.defenseTurrets.attack × 1.5 + garrisonTroops × 2
garrisonRequired = ceil(defensePower × 0.6)
```

- Fleet must have garrison power >= garrisonRequired
- If insufficient: occupation fails, fleet takes 20% damage from counter-fire
- On success: apply garrison fleet (ships are marked as "occupation force")

**Occupation Setup:**
```typescript
interface Occupation {
  id: string;
  planetId: string;
  attackerId: string;
  defenderId: string;
  garrisonFleetId: string;
  startTime: Date;
  resistanceModifier: number;
  totalExtracted: ResourceAmount;
  status: 'active' | 'liberated' | 'abandoned' | 'negotiated';
}
```

---

## Resource Extraction

### `resourceExtraction(occupationId) → HourlyExtraction`

Called every hour for each active occupation.

```typescript
interface HourlyExtraction {
  metal: number;
  crystal: number;
  deuterium: number;
  credits: number;
  efficiency: number;
  resistance: number;
}
```

**Core Formula:**

```
extractionRate = planetProduction × occupationEfficiency × (1 − resistanceModifier)
```

**Occupation Efficiency:**
```
efficiency = garrisonPower / defensePower
```

- `garrisonPower`: sum of occupying ships' attack values
- `defensePower`: sum of planet's defensive structures × 1.5
- Capped at `0.1 ≤ efficiency ≤ 1.0`
- If `efficiency < 0.3`: extraction rate is halved (garrison too weak)

**Resistance Modifier:**

```
resistanceModifier = populationMorale × 0.4 + undergroundResistance × 0.3 + rebellionChance × 0.3
```

- `populationMorale`: starts at 0.5, increases by 0.05 per day of occupation, decreases by 0.1 per liberation attempt
- `undergroundResistance`: built by defender using hidden resources (max 0.8)
- `rebellionChance`: scales with occupation duration and defender activity

**Transfer:**
- Extracted resources are deducted from the occupied planet's production
- Resources are added directly to the occupying player's treasury
- Attacker receives notification: `"Your occupying forces extracted {amount} from {planet}"`

---

## Break Occupation

### `breakOccupation(defenderId, occupationId, fleetId) → LiberationResult`

```typescript
interface LiberationResult {
  success: boolean;
  combatReport: CombatReport;
  moraleBoost: number;
  extractedLost: ResourceAmount; // resources lost during occupation
}
```

**Liberation Combat:**
1. Liberation fleet engages occupation garrison
2. Simplified combat: `liberationPower vs garrisonPower`
3. Garrison defends with 20% combat bonus (entrenched bonus)
4. If liberation wins → occupation ends, garrison fleet destroyed
5. If garrison wins → liberation fleet takes 30% damage, must retreat

**Population Morale Boost:**
```
moraleBoost = 25 + (occupationDays × 5)
```

- Max boost: 50
- Boost decays by 2 per day after liberation

---

## Occupation Tick

### `occupationTick() → Process all active occupations hourly`

Server-side tick function:

```
for each active occupation:
  result = resourceExtraction(occupation.id)
  occupation.totalExtracted += result

  // Check for rebellion
  if rebellionCheck(occupation):
    rebellionEvent(occupation)

  // Check for abandonment
  if garrisonPower < requiredPower × 0.1:
    autoAbandon(occupation)

  // Update resistance modifier
  occupation.resistanceModifier = recalculateResistance(occupation)

  // Notify both players
  notifyExtraction(occupation.attackerId, result)
  notifyOccupationStatus(occupation.defenderId, occupation)
```

**Rebellion check:**
```
rebellionChance = baseChance(0.001) × occupationDays × (1 - garrisonPower / requiredPower)
```

- On rebellion: planet flips to defender control immediately
- 25% of garrison fleet is destroyed in the uprising

---

## Occupation Defense Boost

### `occupationDefenseBoost(occupationId, reinforcementFleetId) → BoostResult`

Send additional ships to strengthen the occupation garrison.

```
newGarrisonPower = currentGarrisonPower + reinforcementPower
efficiency = newGarrisonPower / defensePower
```

- Reinforcements must be dispatched to the occupied planet
- Maximum garrison: `defensePower × 2`
- Each reinforcement reduces extraction efficiency for 24h (−10% per reinforcement)

---

## Negotiate Occupation

### `negotiateOccupation(occupationId, terms) → NegotiationResult`

```typescript
interface NegotiationTerms {
  resourcePayment: ResourceAmount; // One-time payment to occupying player
  duration: number;                // Occupation end delay (hours)
  reparations: ResourceAmount;    // Weekly payment for X weeks
}

interface NegotiationResult {
  accepted: boolean;
  occupationEndTime: Date | null;
  paymentSchedule: PaymentSchedule[];
}
```

**Logic:**
1. Attacker proposes terms or defender counter-offers
2. Both parties must explicitly accept
3. On acceptance:
   - Payment deducted from defender immediately
   - Occupation ends immediately or after specified delay
   - Reparations schedule created
4. Default on reparations: occupation resumes with −20% resistance modifier penalty

**AI acceptance threshold:**
```
acceptanceChance = (paymentValue / expectedExtraction × 30days) × 0.5
```

- NPC attackers auto-accept if `acceptanceChance > 0.6`

---

## Occupation Report

### `occupationReport(occupationId) → OccupationStatus`

```typescript
interface OccupationStatus {
  occupationId: string;
  planetName: string;
  planetCoordinates: Coordinates;
  attackerId: string;
  defenderId: string;
  duration: number;          // hours since start
  totalExtracted: ResourceAmount;
  garrison: {
    ships: ShipGroup[];
    garrisonPower: number;
    morale: number;
  };
  resistanceModifier: number;
  status: OccupationStatus;
  extractionRate: ResourceAmount; // per hour
}
```

Available to both attacker and defender (different views). Defender sees extraction totals but not garrison composition.

---

## Edge Cases

| Situation | Behavior |
|-----------|----------|
| Defender goes inactive > 30 days | Occupation auto-wins, planet transfers to attacker |
| Attacker goes inactive > 14 days | Garrison auto-abandons, occupation ends |
| Planet owner changes during occupation | Occupation continues with new owner |
| Alliance war ends | Occupations between warring sides enter 48h ceasefire |
| Planet is colonized while occupied | Not possible — occupied planets cannot be re-colonized |
