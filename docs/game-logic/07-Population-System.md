# Population System

## Population Types

| Type | Role | Job Assignment | Consumption Modifier |
|------|------|---------------|---------------------|
| Workers | Resource production (mines, farms, factories) | Manual assignment | 1.0x |
| Scientists | Research output, tech discovery | Research labs | 1.0x |
| Soldiers | Ground combat, garrison duty | Barracks, military bases | 1.2x |
| Marines | Ship boarding, planetary assault | Marine barracks | 1.3x |
| Officers | Military leadership, fleet command | Academies, command centers | 1.5x |
| Colonists | New colony foundation, population growth | Colony ships, immigration | 0.8x |
| Engineers | Building construction, ship maintenance | Engineering bays | 1.1x |
| Merchants | Trade route income, marketplace taxes | Trade depots, markets | 1.0x |
| Children | No job; becomes adult at age 16 | N/A | 0.5x |
| Elderly | Reduced output; experience bonus | Retirement (optional jobs) | 0.7x |

## Population Growth

### Base Growth Formula

```
growthPerHour = currentPopulation × (birthRate - deathRate) × habitabilityBonus

where:
  birthRate     = baseBirthRate × housingModifier × foodModifier × happinessModifier
                  × healthcareModifier × governmentModifier
  deathRate     = baseDeathRate × ageDistribution × diseaseMultiplier
                  × pollutionModifier × healthcareEfficiency × starvationMultiplier
  habitabilityBonus = planetHabitability / 100  (range: 0.1 to 1.5)
```

### Birth Rate Factors

| Factor | Effect | Range |
|--------|--------|-------|
| Base birth rate | 0.02 (per hour per 1000 pop) | Fixed |
| Housing modifier | `min(housingCapacity / population, 2.0)` | 0.3 – 2.0 |
| Food supply modifier | `min(foodAvailable / foodRequired, 1.5)` | 0.0 – 1.5 |
| Happiness modifier | `(happiness / 100) × 0.5 + 0.5` | 0.5 – 1.0 |
| Healthcare modifier | `1 + healthcareLevel × 0.1` | 1.0 – 2.0 |
| Government modifier | Varies by type (e.g., Pro-Natalist: 1.5) | 0.5 – 1.5 |

### Death Rate Factors

| Factor | Effect | Range |
|--------|--------|-------|
| Base death rate | 0.008 (per hour per 1000 pop) | Fixed |
| Age distribution | `elderlyPercentage × 0.5 + childrenPercentage × 0.2` | 0.1 – 2.0 |
| Disease multiplier | `1 + diseaseLevel × 0.3` | 1.0 – 4.0 |
| Pollution modifier | `1 + pollutionLevel × 0.15` | 1.0 – 2.5 |
| Healthcare efficiency | `1 / (1 + healthcareLevel × 0.25)` | 0.3 – 1.0 |
| Starvation multiplier | `1 + max(0, 1 - foodPerCapita / 0.5) × 3.0` | 1.0 – 4.0 |

## Happiness System

### Happiness Formula

```
happiness = baseHappiness + buildingBonuses - taxes - pollution - crime + entertainment

where:
  baseHappiness    = 50 (default)
  buildingBonuses  = sum of parks, monuments, entertainment centers bonuses
  taxes            = taxRate × 1.5  (capped at 60)
  pollution        = pollutionLevel × 2
  crime            = crimeRate × 3
  entertainment    = entertainmentLevel × 5
```

### Happiness Thresholds

| Happiness | State | Effects |
|-----------|-------|---------|
| 0 – 19 | Rebellious | Riots, production -50%, rebellion chance |
| 20 – 39 | Unhappy | Production -20%, emigration risk |
| 40 – 59 | Content | No bonuses or penalties |
| 60 – 79 | Happy | Production +10%, growth +5% |
| 80 – 100 | Ecstatic | Production +25%, growth +15%, tourism +50% |

## Morale System

### Morale Formula

```
morale = happiness × 0.7 + security × 0.3 - warWeariness

where:
  happiness     = current happiness level (0-100)
  security      = (garrisonStrength × 10 + defenseBuildingBonus) capped at 100
  warWeariness  = sum over active wars: warDurationDays × 0.5 + casualties × 0.01
                  - warPropagandaBonus
```

### Morale Effects

| Morale | Combat Bonus | Build Speed | Research |
|--------|-------------|-------------|----------|
| 0 – 19 | -30% | -50% | -40% |
| 20 – 39 | -15% | -25% | -20% |
| 40 – 59 | 0% | 0% | 0% |
| 60 – 79 | +10% | +10% | +5% |
| 80 – 100 | +25% | +20% | +15% |

## Crime System

### Crime Formula

```
crimeRate = (1 - policeLevel × 0.2) × (unemploymentRate × 0.5 + povertyRate × 0.3 + corruptionRate × 0.2)

where:
  policeLevel     = 0 (none) to 5 (maximum)
  unemploymentRate = unemployedPopulation / totalAdultPopulation (0.0 to 1.0)
  povertyRate     = populationBelowPovertyLine / totalPopulation
  corruptionRate  = computed from corruption formula
```

### Crime Effects

| Crime Rate | Effect |
|------------|--------|
| 0 – 0.1 | Low crime; minimal impact |
| 0.1 – 0.3 | Moderate crime; -5% production, some buildings damaged |
| 0.3 – 0.5 | High crime; -15% production, building damage, pop loss |
| 0.5+ | Anarchy; -40% production, random building destruction, pop exodus |

## Corruption Formula

```
corruptionRate = colonyCount × 0.01 - governmentEfficiency

where:
  colonyCount        = total colonies in empire
  governmentEfficiency = varies by government type (0.2 to 1.0)
```

## Disease System

### Disease Types

| Type | Transmission | Base Deadliness | Cure Research Cost |
|------|-------------|-----------------|-------------------|
| Viral | Airborne, Contact | 0.3 | 500 RP |
| Bacterial | Waterborne, Food | 0.2 | 300 RP |
| Parasitic | Vector, Direct | 0.15 | 400 RP |
| Genetic | Hereditary | 0.4 | 1000 RP |
| Nanite | Self-replicating nanobots | 0.6 | 2000 RP |

### Infection Spread Formula

```
newInfections = currentInfections × spreadRate × populationDensity × (1 - quarantineEffectiveness)

where:
  spreadRate            = baseRate × (1 - healthcareLevel × 0.1) × environmentFactor
  populationDensity     = population / (colonyArea × 1000)
  quarantineEffectiveness = 0 if no quarantine, 0.3 minimal, 0.6 moderate, 0.9 full
```

### Cure Research

```
researchTime = cureCost / researchPerHour × (1 + complexityPenalty)
```

## Food & Water Consumption

### Food Consumption

```
foodPerHour = population × 0.5 × (1 + consumptionRate)

where:
  consumptionRate = sum of consumption modifiers from population type mix
                    (Soldiers +0.2, Marines +0.3, Officers +0.5)
```

### Water Consumption

```
waterPerHour = population × 0.3 × (1 + climateFactor)

where:
  climateFactor = |planetTemperature - 20| / 100
                  (hot or cold planets increase water usage, range 0.0 to 0.5)
```

## Sanitation System

### Waste Management

| Sanitation Level | Pollution Reduction | Cost/Hour (credits) |
|-----------------|---------------------|--------------------|
| None | 0% | 0 |
| Basic | 25% | 100 × population |
| Standard | 50% | 300 × population |
| Advanced | 75% | 800 × population |
| Closed-Loop | 95% | 2000 × population |

### Pollution Accumulation

```
pollutionPerHour = industrialOutput × 0.01 + population × 0.001 - sanitationReduction

accumulatedPollution += pollutionPerHour - naturalDecay × pollutionLevel
```

## Population Cap

```
maxPopulation = housingCapacity × (1 + techBonus + buildingBonus)

where:
  housingCapacity = sum of all housing units from residential districts and buildings
  techBonus       = population technology level × 0.05 (max 0.5)
  buildingBonus   = from specific buildings (e.g., Arcologies: +0.3)
```

## Population Assignment

| Category | Jobs | Controlled By |
|----------|------|--------------|
| Resource Production | Mining, Farming, Energy | Priority sliders |
| Research | Lab work, Theory | Scientist count |
| Military | Garrison, Training | Soldier/Marine count |
| Construction | Building, Shipbuilding | Engineer count |
| Trade | Routes, Market | Merchant count |

### Auto-Assignment Priority System

```
if idlePopulation > 0:
  1. Assign to food production until foodPerHour >= consumption
  2. Assign to energy production until energyPerHour >= demand
  3. Assign to mineral production
  4. Assign to research based on science priority slider
  5. Assign to military based on military priority slider
  6. Remaining population assigned to trade or left idle
```

## Migration Between Colonies

### Migration Formula

```
migrationRate = (destinationHappiness - originHappiness) × 0.01 × transportCapacity

migration per hour = max(0, migrationRate) × destinationHousingAvailability

where:
  destinationHousingAvailability = 1 if housingSpace > 0, else 0
```

## Forced Labor

| Mechanic | Production Boost | Happiness Penalty |
|----------|-----------------|-------------------|
| Overtime mandate | +20% | -10 happiness |
| Double shifts | +40% | -20 happiness |
| Exhaustion quotas | +60% | -35 happiness |
| Penal colonies | +80% | -50 happiness |

## Slavery System

### Ethics Restrictions

| Government Type | Slavery Allowed | Slavery Type |
|----------------|---------------|--------------|
| Democracy | No | N/A |
| Republic | No | N/A |
| Oligarchy | No (late game) | N/A |
| Dictatorship | Yes | Chattel |
| Theocracy | Yes (conditionally) | Indentured |
| Feudal Empire | Yes | Serfdom |
| Corporate State | Yes (via contracts) | Indentured |
| Hive Mind | N/A (assimilation) | N/A |

### Slavery Mechanics

```
slaveOutput    = baseOutput × 0.6  (reduced efficiency)
slaveUpkeep    = baseUpkeep × 0.3  (lower upkeep)
happinessPenalty = slavePercentage × 50  (free pop happiness loss)

rebellionRisk = slavePercentage × 0.3 + happinessPenalty × 0.02
                - garrisonLevel × 0.1
```

### Rebellion Trigger

```
if rebellionRisk > random(0, 1):
    slaveUprising on colony
    effects: -50% production, building damage, pop losses
    requires military suppression
```
