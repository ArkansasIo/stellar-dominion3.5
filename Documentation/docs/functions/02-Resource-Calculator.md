# Resource Calculator — Resource Service

## Overview

All resource production, storage, cost, and transaction logic. Resources tracked: Metal, Crystal, Deuterium, Energy, Credits, Research Points.

---

## Production Calculation

### `calculateResourceProduction(planet, buildings) → productionRates`

Calculates per-hour production rates for a planet based on its buildings and base attributes.

```typescript
interface ProductionRates {
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
  energyPerHour: number;
  creditsPerHour: number;
}
```

**Formula per resource:**

```
baseRate = planet.temperatureBonus × buildingOutput(level)
productionRate = baseRate × sumOfAllBonuses - maintenanceCost
```

- Temperature bonus: `metal: 1 + max(0, (temperature - 100) / 200)`, `crystal/deuterium: 1 + max(0, (200 - temperature) / 200)`
- Building output: defined per building level (e.g., Metal Mine Lvl 10 → `30 × 10 × 1.1^10`)
- Bonuses: planet specials, empire perks, officer bonuses, alliance bonuses

---

## Storage Calculation

### `calculateStorageCapacity(planet, buildings) → storageLimits`

```typescript
interface StorageLimits {
  metal: number;
  crystal: number;
  deuterium: number;
  totalCapacity: number;
}
```

**Formula:**

```
storage = baseStorage × 1.5^level + warehouseAdditions
```

- Base storage per resource: 10,000
- Each storage building level increases capacity by 50%
- Underground storage (secret) adds fixed bonuses
- Energy silos for deuterium storage bonus

---

## Cost Calculation

### `calculateResourceCost(itemType, level) → resourceCost`

Returns resource cost to build/upgrade an item to the given level.

```typescript
interface ResourceCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}
```

**Formula (standard geometric progression):**

```
cost = baseCost × growthFactor^(level - 1)
```

- `baseCost`: metal/crystal/deuterium/energy required for level 1
- `growthFactor`: typically 1.5–2.0 depending on item type
- Example: Metal Mine: base `{metal: 60, crystal: 15}`, growth 1.5 → level 5 costs `{metal: 60×1.5^4, crystal: 15×1.5^4}`

---

## Build Time Calculation

### `calculateBuildTime(itemType, level, planetBonuses) → timeSeconds`

```
baseTime = (metalCost + crystalCost) / (buildingSpeed × 3600)
timeWithBonuses = baseTime × (1 - sumOfTimeReductions) × (1 / robotFactoryBonus)
```

- `buildingSpeed`: server config (default 1.0 for normal speed)
- Time reductions: commander perks, alliance bonuses, event boosts
- Robot factory bonus: each level reduces build time by 5% (multiplicative, not additive)
- Minimum build time: 1 second

---

## Research Time Calculation

### `calculateResearchTime(techId, level, empireBonuses) → timeSeconds`

```
baseTime = (metalCost + crystalCost) / (researchSpeed × 3600)
finalTime = baseTime × (1 - (researchLabLevel × 0.05)) × (1 - empireResearchBonus)
```

- Research lab level: each level reduces time by 5%
- `researchSpeed`: server config
- Empire bonuses: officer perks, event multipliers
- Minimum research time: 1 second

---

## Production Bonus Application

### `applyProductionBonuses(baseProduction, bonuses) → finalProduction`

```typescript
interface ProductionBonus {
  type: 'percent' | 'flat' | 'multiplier';
  source: string; // e.g. 'officer', 'alliance', 'artifact', 'event'
  value: number;
}
```

**Application order:**
1. Flat bonuses applied first: `production += flatBonus`
2. Percent bonuses: `production *= (1 + sumOfPercentBonuses / 100)`
3. Multiplier bonuses: `production *= productOfMultipliers`

---

## Hourly Production Tick

### `hourlyProductionTick(planet) → updatedResources`

Called every hour for every planet with production:

```
for each resource:
  planet.resource += calculateResourceProduction(planet, buildings)[resource]
  planet.resource = handleResourceCap(planet.resource, storageLimit)
```

- Deduct energy deficit: if `energyPerHour < 0`, production of all resources reduced by `(abs(deficit) / totalConsumption) × production`
- Apply decay on inactive planets (see below)
- Log production in resource history

---

## Resource Cap Handling

### `handleResourceCap(resources, storageLimit) → cappedResources`

```
capped.metal     = min(resources.metal, storageLimit.metal)
capped.crystal   = min(resources.crystal, storageLimit.crystal)
capped.deuterium = min(resources.deuterium, storageLimit.deuterium)
```

- Resources exceeding storage are lost (no overflow)
- Warning sent to player when storage > 90% full
- Marketplace/black market can temporarily exceed cap (escrow system)

---

## Resource Transaction

### `resourceTransaction(playerId, type, amount, reason) → TransactionResult`

```typescript
interface TransactionResult {
  success: boolean;
  newBalance: ResourceBalance;
  transactionId: string;
  error?: string;
}
```

**Logic:**
1. Validate sufficient balance (for deductions)
2. Create transaction record: `{ playerId, type, amount, reason, timestamp, balanceBefore, balanceAfter }`
3. Update player resources atomically
4. Return success/failure
5. Rollback on failure if partial deduction occurs

All transactions are logged immutably in the transaction history table.

---

## Daily Maintenance Cost

Calculated every 24h:

```
dailyCost.metal     = sum(building.metalMaintenance × building.level)
dailyCost.crystal   = sum(building.crystalMaintenance × building.level)
dailyCost.energy    = sum(building.energyConsumption × building.level)
dailyCost.credits   = sum(fleet.count × fleet.creditMaintenance)
```

- If resources insufficient for maintenance, buildings/fleet operate at reduced efficiency
- 24h grace period before buildings start de-leveling
- Fleet morale drops 10/day if maintenance unpaid

---

## Resource Decay (Inactive Players)

Applied every hour for players inactive > 7 days:

```
decayRate = min(0.05, 0.01 × daysInactive)
for each resource:
  lost = resource × decayRate
  resource -= lost
```

- Decay stops when resources reach `storage × 0.1`
- Reactivation bonus: first login after >30 days inactive grants +50% production for 48h

---

## Resource Theft (Raids)

When a fleet raids a planet:

```
theftRate = min(0.5, cargoCapacity / planetStorage)
stolen.metal     = floor(planet.metal × theftRate)
stolen.crystal   = floor(planet.crystal × theftRate)
stolen.deuterium = floor(planet.deuterium × theftRate)
```

- Maximum 50% of each resource can be stolen per raid
- Actual stolen amount limited by fleet cargo capacity
- Planetary defenses reduce theft rate by `1 - (defensePower / (defensePower + 1000))`

---

## Trade Route Income

### `tradeRouteIncome(tradeRoute) → hourlyIncome`

```
income = baseTradeValue × distanceMultiplier × shipCount × securityMultiplier
```

- `distanceMultiplier`: `log10(distanceInSystems + 1) × 0.5`
- `securityMultiplier`: 1.0 for safe route, 0.5 for pirate-prone, 0.0 for blocked routes
- Income split: 70% to route owner, 30% to destination system owner

---

## Marketplace Price Calculation

### `marketplacePrice(resourceType, supply, demand) → pricePerUnit`

```
basePrice = { metal: 1, crystal: 2, deuterium: 4, credits: 0.01 }
price = basePrice × (1 + (demand - supply) / max(supply, 1) × 0.1)
```

- Price fluctuates based on global supply/demand
- Price bounds: 0.5× to 5× base price
- Server-wide price index updated hourly
- Black market prices: 2× marketplace price, no fees, anonymous
