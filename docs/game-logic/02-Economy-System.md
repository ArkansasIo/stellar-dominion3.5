# Economy System

## Resource Types

| Resource | Symbol | Primary Use | Rarity |
|----------|--------|-------------|--------|
| Credits | `CR` | Universal currency, trade, rush fees | Common |
| Metal | `MT` | Ship hulls, buildings, defenses | Common |
| Crystal | `CRY` | Electronics, weapons, research | Common |
| Deuterium | `DE` | Fuel, advanced weapons, warp drives | Uncommon |
| Energy | `EN` | Powers buildings and production | Base resource |
| Food | `FO` | Population upkeep, crew morale | Common |
| Water | `WA` | Terraforming, colony maintenance | Common |
| Alloys | `AL` | Advanced ship/building construction | Rare |
| Research Points | `RP` | Technology research | Special |
| Influence | `IN` | Diplomacy, alliance actions | Special |

## Base Production Formulas

Production per building level `L`:

```
mineProduction(L) = baseRate × L × 1.1^(L-1)
crystalProduction(L) = baseRate × L × 1.1^(L-1)
deuteriumProduction(L) = baseRate × L × 1.15^(L-1) × energyConsumed
solarProduction(L) = baseRate × L × 1.1^(L-1) × planetSunlightModifier
fusionProduction(L) = baseRate × L × 1.2^(L-1) × deuteriumConsumed
```

| Building | baseRate | Unit |
|----------|----------|------|
| Metal Mine | 30 | MT/hour |
| Crystal Plant | 20 | CRY/hour |
| Deuterium Synthesizer | 10 | DE/hour |
| Solar Plant | 50 | EN/hour |
| Fusion Reactor | 100 | EN/hour |

## Production Multiplier Stacking

Bonuses stack **additively** within the same category, **multiplicatively** across categories.

```
finalProduction = baseProduction × (1 + sum(additiveBonuses)) × Π(1 + multiplicativeBonuses)
```

**Additive category examples:**
- Building level bonuses
- Technology bonuses
- Officer skill bonuses
- Alliance perks

**Multiplicative categories:**
- Planet special modifiers (resource-rich, volcanic, etc.)
- Temporary boosts (events, items, artifacts)
- Government type bonus

### Example

Metal Mine L10 produces: `30 × 10 × 1.1^9 = 30 × 10 × 2.3579 = 707.38 MT/hr`

With +60% from tech, +25% from officer (additive → +85%), ×1.5 from planet modifier:
`707.38 × (1 + 0.85) × 1.5 = 707.38 × 1.85 × 1.5 = 1962.98 MT/hr`

## Storage Formulas

```
capacity = baseStorage × 1.5^storageLevel
```

| Storage Building | baseStorage |
|------------------|-------------|
| Metal Storage | 100,000 |
| Crystal Storage | 75,000 |
| Deuterium Storage | 50,000 |

Planet-wide storage is the **sum** of all storage building capacities on that planet.

### Overflow Rule

When production exceeds storage, overflow is **lost**. Maximum 24h of production can accumulate.

## Resource Cost Formulas

```
cost(L) = baseCost × 1.5^L
```

Where `L` is the target level after upgrade. Example for a Metal Mine:

| Level | Cost (Metal) |
|-------|-------------|
| 1 | `60 × 1.5^1 = 90` |
| 5 | `60 × 1.5^5 = 60 × 7.59 = 455` |
| 10 | `60 × 1.5^10 = 60 × 57.66 = 3,460` |
| 20 | `60 × 1.5^20 = 60 × 3325 = 199,526` |

## Market Exchange Rates

The marketplace uses a dynamic pricing curve:

```
price(resource, volume) = basePrice × (1 + 0.01 × volume / totalVolume)
sellPrice(resource, volume) = basePrice × 0.95 × (1 - 0.005 × volume / totalVolume)
```

| Resource Pair | basePrice |
|---------------|-----------|
| CR → MT | 1 CR = 2 MT |
| CR → CRY | 1 CR = 1 CRY |
| CR → DE | 1 CR = 0.5 DE |
| MT → CRY | 1 MT = 0.45 CRY |
| MT → DE | 1 MT = 0.2 DE |
| CRY → DE | 1 CRY = 0.4 DE |

Market fees: **5%** flat on all trades. Volume-based price shifts reset daily.

## Trade Route Income

```
incomePerHour = routeEfficiency × cargoCapacity × distanceMultiplier
```

| Variable | Description |
|----------|-------------|
| `routeEfficiency` | `0.5` base, modified by tech and alliance perks |
| `cargoCapacity` | Minimum cargo between two ports |
| `distanceMultiplier` | Distance in sectors × 0.01 (max 2.0) |

Routes require a trading ship stationed at origin. Pirates may intercept (15% base chance).

## Tax System

```
taxIncome = population × taxRate × (1 - corruptionRate)
```

| Variable | Description |
|----------|-------------|
| `population` | Total colony population |
| `taxRate` | 0.0 - 0.30 (set by player) |
| `corruptionRate` | `0.01 × colonyCount + 0.001 × empireScore` |

Higher tax rate increases `corruptionRate` by `0.001 per 1% above 10%`. Corruption lowers tax efficiency and increases building costs.

## Maintenance Costs

```
maintenancePerHour = baseMaintenance × (1 + 0.02 × level)
```

| Building | baseMaintenance | Resource |
|----------|-----------------|----------|
| Metal Mine | 2 | Energy |
| Crystal Plant | 4 | Energy |
| Deuterium Synthesizer | 10 | Energy |
| Research Lab | 5 | Energy + Credits |

Military ships also have maintenance: `shipMaintenance = shipCost × 0.001 / hour` in Credits.

## Resource Sinks

| Sink | Resource | Amount Formula |
|------|----------|----------------|
| Building upgrades | MT, CRY, DE | `cost(L)` |
| Ship construction | MT, CRY, DE | Per ship blueprint |
| Research projects | RP, CR | `researchCost(L)` |
| Ship repairs | MT, CR | `damage% × buildCost × 0.3` |
| Trade fees | CR | `volume × 0.05` |
| Fleet maintenance | CR | Sum of ship maintenance |
| Alliance donations | CR, MT, CRY | Player-set amount |
| Terraforming | WA, CR | Per planet type |

## Inflation Control Mechanics

Resources decay on unused planets to prevent hoarding:

```
planetaryStorage = min(hourlyProduction × 24, capacity)
excessDecay = max(0, stored - planetaryStorage) × 0.10 per hour
```

Upkeep scaling doubles every 20 levels (exponential curve). Market volume caps limit daily trade to `50,000 × playerLevel` units per resource.

## Resource Theft During Raids

When a fleet wins against a planet:

```
stolen = min(availableResources, cargoCapacity × raidingEfficiency)
raidingEfficiency = 0.50 × (1 + commanderRaidBonus)
```

Defender keeps 50% of remaining resources behind a `protectedAmount` wall:
```
protectedAmount = 2 × storageCapacity × 0.05
```

## Celestial Marketplace Pricing

Celestial bodies (moons, asteroids) have local markets with premium/discount:

```
localPrice = basePrice × (1 + distanceFromCenter × 0.001) × (1 - localProductionBonus)
```

Trading in allied celestial markets reduces fees by 50%.
