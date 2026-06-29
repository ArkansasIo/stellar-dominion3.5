# Colony System

## Colony Establishment

### Colony Ship Dispatch

```
colonyShipCost = 5000 + population × 100
colonyShipBuildTime = 20 hours × (1 - shipyardLevel × 0.05)
colonyShipPopulation = 100 + cargoModules × 50
```

### Landing & Initial Settlement

| Phase | Duration | Requirements | Effects |
|-------|----------|-------------|---------|
| Orbital Survey | 2 hours | Colony ship in orbit | Reveals resources, hazards |
| Landing | 4 hours | Survey complete | Establishes landing zone |
| Initial Settlement | 24 hours | Landing complete | Builds first habitation module |
| Colony Established | 48 hours | Settlement complete | Colony operational, can build |

### Initial Colony Setup

```
startingBuildings:
  - Habitation Module (housing: 200)
  - Basic Generator (energy: +50)
  - Water Extractor (water: +100/hour)
  - Landing Pad (ship docking: 1)

initialPopulation = colonyShipPopulation (100-500)
startingResources = colonyShipCargo × 50 credits worth of supplies
```

## Planet Class Effects

| Planet Class | Habitability | Resource Bonus | Building Restrictions | Population Cap Mod |
|-------------|-------------|----------------|----------------------|-------------------|
| Terran | 100% | None | None | 1.0x |
| Continental | 85% | +10% food | None | 0.9x |
| Oceanic | 70% | +20% food, -10% minerals | No mines on surface | 0.8x |
| Jungle | 60% | +30% food, -20% energy | Energy limited | 0.7x |
| Desert | 50% | +20% minerals | Water buildings required | 0.6x |
| Arctic | 40% | +20% research (cold) | Food limited | 0.5x |
| Volcanic | 30% | +40% minerals, +30% energy | Housing limited | 0.4x |
| Gas Giant | 20% | +50% energy (collectors) | No ground buildings | 0.1x (stations) |
| Barren | 10% | +50% minerals | Full domed buildings required | 0.3x |
| Death World | 5% | +100% military units | Extreme hazards | 0.2x |

### Habitability Formula

```
effectiveHabitability = baseHabitability × (1 + terraformingProgress) + techModifiers

growthMultiplier = effectiveHabitability / 100
happinessModifier = (effectiveHabitability - 50) × 0.2
```

## Colony Buildings

### Building Categories (40+ types)

| Category | Examples | Count |
|----------|----------|-------|
| Resource | Mine, Farm, Energy Plant, Water Extractor | 8 |
| Industrial | Factory, Assembly Plant, Refinery, Nanite Forge | 6 |
| Research | Lab, Observatory, Quantum Computer, Xenostudy Center | 5 |
| Military | Barracks, Shield Generator, Planetary Cannon, Orbital Station | 7 |
| Infrastructure | Housing, Road Network, Transit Hub, Storage Depot | 6 |
| Happiness | Park, Monument, Entertainment Center, Holo-Theater | 5 |
| Special | Trade Port, Embassy, Academy, Governor's Mansion | 5+ |

### Construction Formula

```
buildTime = baseTime × (1 - engineerBonus - techBonus - specializationBonus)
buildCost = baseCost × (1 - efficiencyModifiers)

where:
  engineerBonus = assigned engineers / required engineers × 0.3 (max 0.3)
  techBonus     = construction tech level × 0.05 (max 0.5)
  specializationBonus = colony specialization × 0.1 (max 0.2)
```

## District System

| District Type | Buildings Slots Per Tier | Specialization Bonus | Population Capacity |
|--------------|-------------------------|---------------------|-------------------|
| Residential | 2 / 4 / 6 | +10% happiness | 500 / 1500 / 3000 |
| Industrial | 3 / 5 / 8 | +15% production | 100 / 300 / 500 |
| Commercial | 2 / 4 / 6 | +15% trade income | 200 / 600 / 1000 |
| Research | 2 / 3 / 5 | +20% research speed | 100 / 300 / 500 |
| Military | 2 / 4 / 6 | +15% unit damage | 400 / 1000 / 2000 |
| Agricultural | 3 / 6 / 10 | +25% food output | 50 / 150 / 300 |
| Administrative | 1 / 2 / 3 | +10% all outputs | 300 / 800 / 1500 |

### District Tiers

Upgrade cost: `tier × 5000 credits + tier × 1000 minerals`

*All district bonuses stack with building bonuses.*
*Adjacent districts of same type: +5% bonus per adjacency.*

## City Planning

### Adjacency Bonuses

| Building A | Building B | Bonus |
|-----------|-----------|-------|
| Research Lab | University | +15% research |
| Factory | Power Plant | -10% energy cost |
| Farm | Water Extractor | +20% food |
| Military Base | Shield Generator | +25% shield HP |
| Trade Port | Commercial District | +30% trade income |
| Entertainment Center | Residential District | +15% happiness |

### Specialization Bonus

```
colonySpecialization = determined by district majority type
  majority = highest total district tier sum

specializationPerks:
  Research Colony: science +25%, happiness -5 (dull life)
  Industrial Colony: production +30%, pollution +20%
  Agri-Colony: food +40%, growth +10%
  Military Colony: unit damage +20%, build speed +15%
  Trade Colony: income +30%, influence +1/turn
  Administrative: all outputs +10%
```

## Terraforming

### Planet Class Changes

```
cost = baseCost × (currentHabitability / targetHabitability) × planetSize × 10000
time = cost / terraformingLevel × 100 (hours)

prerequisites per class target:
  To Terran:  Atmospheric Processors, Hydro-Engineering, Biosphere Adaptation
  To Continental: Atmospheric Processors required
  To Oceanic: Hydro-Engineering required
  To Desert: Un-terraform (planetary engineering)
```

### Terraforming Stages

| Stage | Cost % | Time % | Habitability Improvement |
|-------|--------|--------|------------------------|
| Atmosphere | 40% | 50% | +15% |
| Hydrosphere | 30% | 30% | +10% |
| Biosphere | 20% | 15% | +10% |
| Stabilization | 10% | 5% | +5% |

## Colony Defense

### Shield Generators

```
shieldHP = baseHP × (1 + generatorLevel × 0.5) × (1 + techBonus)
shieldRegen = shieldHP × 0.05 per hour

powerDrain = shieldHP × 0.001 per hour
```

### Planetary Weapons

| Weapon | Damage | Range | Power Cost | Requires |
|--------|--------|-------|------------|----------|
| Planetary Cannon | 500 | Orbital | 200 | Military District T2 |
| Missile Battery | 200 | System | 100 | Military District T1 |
| Ion Cannon | 350 | Orbital (disables) | 300 | Military District T3 |
| Planetary Shield | N/A (defense) | Colony-wide | 500 | Military District T3 |
| Orbital Ring | 750 | System | 1000 | Mega-engineering |

### Garrison Forces

```
garrisonStrength = soldierCount × soldierPower × (1 + militaryBuildingBonus)
  + marineCount × marinePower × 1.5

ground combat:
  attackerOdds = attackerPower / (attackerPower + defenderPower)
```

## Colony Trade

### Trade Routes

```
routeIncome = sourceIncome × 0.1 + destinationIncome × 0.1
              + distanceBonus × tradeShipEfficiency

where:
  sourceIncome      = colony credit income
  distanceBonus     = max(0, distanceInSystems × 0.01)
  tradeShipEfficiency = trade ship level × 0.2

max routes per colony = 3 + tradePortLevel × 2
```

### Resource Import/Export

| Resource | Export Price | Import Price | Auto-Manage |
|----------|-------------|-------------|-------------|
| Food | 2 credits/unit | 5 credits/unit | Yes |
| Minerals | 3 credits/unit | 8 credits/unit | Yes |
| Energy | 4 credits/unit | 10 credits/unit | Yes |
| Consumer Goods | 10 credits/unit | 25 credits/unit | Yes |
| Rare Elements | 50 credits/unit | 100 credits/unit | Manual only |

## Colony Events

| Event | Probability | Positive Effects | Negative Effects |
|-------|------------|-----------------|------------------|
| Earthquake | 2%/year | Rare mineral deposits exposed | Building damage (-20%), pop loss |
| Meteor Strike | 1%/year | Researchable impact site | Building destroyed, pop loss |
| Plague Outbreak | 3%/year | Medical research boost | Population -10%, -30 happiness |
| Resource Discovery | 5%/year | +1000 of random resource | None |
| Rebellion | Depends | None (quashed) | Production -50%, building damage |
| Festival | 2%/year | +20 happiness for 30 days | None |
| Trade Ship Arrival | 8%/year | Rare goods available | None (all positive) |

## Colony Abandonment

```
abandonTime = 24 hours × population / 100
refund = buildingValue × 0.5 + population × 0.1

population relocates to nearest colony
colony marked as "Ruins" -- can be recolonized at 50% cost

cannot abandon capital colony
cannot abandon with active enemy blockade
```

## Automated Building Management

### AI Governor Tiers

| Tier | Unlock | Features |
|------|--------|----------|
| Basic | Default | Auto-assign workers, maintain buildings |
| Standard | Administrative tech 1 | Auto-build housing when full, balance resources |
| Advanced | Administrative tech 3 | Auto-build economy buildings, handle deficits |
| Expert | Administrative tech 5 | Full automation, specialization-aware, event response |

## Colony Templates

### Template System

Save colony layout for quick deployment:

```
templateContents = { buildingPositions, districtLayout, specialization, priorityList }
applyTemplate = instantPlacement (costs resources) or buildQueue (builds over time)

maxSavedTemplates = 5 + administrativeTechLevel
```

### Quick Build

```
quickBuildCost = normalCost × 1.5
quickBuildTime = totalBuildTime × 0.3

activates all queued builds simultaneously
available: 1 use per 30 days (shared cooldown)
```
