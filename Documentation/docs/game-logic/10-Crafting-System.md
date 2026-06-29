# Crafting System

## Blueprint System

### Blueprint Types

| Type | Uses | Tradeable | Copyable | Durability |
|------|------|-----------|----------|------------|
| Original | Infinite | No | Yes (limited) | Permanent |
| Copy | 10-50 uses | Yes | No | Depletes per use |
| Destroyed | 1 use | No | No | Consumed on use |
| Template | Infinite (per faction) | No | Yes (research) | Permanent |

### Blueprint Acquisition

| Method | Rarity Bias | Success Rate | Cooldown |
|--------|-------------|-------------|----------|
| Research Discovery | Common-Uncommon | 5-15% per breakthrough | Random |
| Exploration Find | Rare-Legendary | 0.1-5% per anomaly | Per system |
| Marketplace Purchase | Common-Rare | 100% (price dependant) | Always available |
| Event Rewards | Variable | Quest dependent | Quest specific |
| Reverse Engineering | Based on target | `skill × 0.1 + labLevel × 0.05` | 30 days |
| Trade | Variable | Negotiation | Per agreement |

### Blueprint Rarity

| Rarity | Base Value | Research Cost to Unlock | Stat Multiplier | Drop Weight |
|--------|-----------|------------------------|-----------------|-------------|
| Common | 100 credits | 500 RP | 1.0x | 50% |
| Uncommon | 500 credits | 2000 RP | 1.3x | 30% |
| Rare | 2500 credits | 8000 RP | 1.6x | 15% |
| Epic | 10000 credits | 30000 RP | 2.0x | 4% |
| Legendary | 50000 credits | 100000 RP | 2.5x | 1% |

## Manufacturing Pipeline

### Production Stages

```
Raw Materials → Components → Assemblies → Finished Product
```

**Example Pipeline for a Plasma Cannon:**

1. **Raw Materials**: Titanium ore + Silicon + Rare earth elements
2. **Components**: Plasma coils (circuits) + Heat sinks (mechanical) + Focusing crystals (chemical)
3. **Assemblies**: Plasma chamber assembly + Targeting system + Power coupling
4. **Finished Product**: Plasma Cannon

### Component Types

| Component Type | Primary Input | Base Craft Time | Storage Size |
|---------------|--------------|-----------------|--------------|
| Electronic Circuits | Silicon, Copper | 2 hours | 0.1 m³ |
| Mechanical Parts | Steel, Titanium | 3 hours | 0.5 m³ |
| Chemical Compounds | Carbon, Hydrogen, Various gases | 4 hours | 0.2 m³ |
| Biological Agents | Organic compounds, Cultures | 6 hours | 0.3 m³ |
| Quantum Processors | Exotic matter, Rare earths | 10 hours | 0.05 m³ |
| Energy Cells | Lithium, Deuterium | 1.5 hours | 0.4 m³ |

## Manufacturing Formula

```
time = baseTime × (1 - factoryLevel × 0.05) × (1 - naniteBonus)

where:
  baseTime      = base crafting time in hours
  factoryLevel  = 0 (basic) to 10 (advanced industrial)
  naniteBonus   = 0 to 0.5 (from nanite forge technology)

example:
  Plasma Cannon, baseTime = 24h, factoryLevel = 5, naniteBonus = 0.2
  time = 24 × (1 - 5 × 0.05) × (1 - 0.2)
  time = 24 × 0.75 × 0.8 = 14.4 hours
```

## Quality System

### Quality Levels

| Quality | Stat Multiplier | Market Value Multiplier | Achievable At |
|---------|----------------|------------------------|---------------|
| Standard | 1.0x | 1.0x | Always |
| Improved | 1.2x | 1.5x | Crafter level 3+ |
| Advanced | 1.5x | 2.5x | Crafter level 5+ |
| Superior | 2.0x | 5.0x | Crafter level 7+ |
| Legendary | 3.0x | 15.0x | Crafter level 10+, special materials |

### Quality Formula

```
quality = baseQuality + crafterSkillBonus + factoryLevelBonus + materialQualityBonus

where:
  baseQuality         = 1 (Standard)
  crafterSkillBonus   = assigned engineer level × 0.15
  factoryLevelBonus   = factoryLevel × 0.1
  materialQualityBonus = average material quality × 0.2
  materialQualityBonus uses: 1 (Common), 2 (Uncommon), 3 (Rare),
                             4 (Epic), 5 (Legendary)

finalQuality determines output tier:
  1.0 - 1.4: Standard
  1.5 - 2.4: Improved
  2.5 - 3.4: Advanced
  3.5 - 4.4: Superior
  4.5+:      Legendary
```

## Reverse Engineering

### Process

```
researchTime = itemTier × 100 / (labLevel × 20 + engineerLevel × 10)
successProb = engineerLevel × 0.1 + labLevel × 0.05 - itemComplexity × 0.02
```

| Action | Result on Success | Result on Failure |
|--------|------------------|-------------------|
| Full reverse engineering | Gain Original blueprint | Gain Destroyed blueprint |
| Rapid analysis | Gain Destroyed blueprint | Nothing (item lost) |
| Partial scan | Gain research progress toward blueprint | Lose scan data |

### Reverse Engineering Targets

| Target Type | Complexity | Base Time | Value of Blueprint |
|-------------|-----------|-----------|-------------------|
| Enemy weapon | 3-5 | 40h | High |
| Enemy armor | 2-4 | 30h | Medium-High |
| Enemy ship component | 4-7 | 60h | Very High |
| Alien artifact | 8-10 | 100h | Legendary |

## Component Requirements by Item Category

| Final Product | Circuits | Mechanics | Chemicals | Biological | Quantum | Energy |
|--------------|----------|-----------|-----------|------------|---------|--------|
| Small Weapon | 1 | 1 | 0 | 0 | 0 | 1 |
| Medium Weapon | 2 | 3 | 1 | 0 | 0 | 2 |
| Heavy Weapon | 4 | 6 | 2 | 0 | 0 | 4 |
| Ship Hull (small) | 2 | 8 | 1 | 0 | 1 | 2 |
| Ship Hull (large) | 8 | 24 | 4 | 0 | 3 | 8 |
| Medical Kit | 1 | 0 | 2 | 3 | 0 | 1 |
| Research Module | 5 | 2 | 1 | 0 | 2 | 2 |
| Shield Generator | 3 | 2 | 1 | 0 | 2 | 5 |

## Manufacturing Queue System

### Queue Management

- Maximum 10 parallel queues per colony
- **Priority levels**: 1 (highest) through 5 (lowest)
- Queue can reorder items by priority
- Rush orders: 2x material cost for 50% time reduction

### Queue Formula

```
queueTime = sum(itemTime × (1 - parallelReduction × workerCount))

where:
  parallelReduction = 0.15 per additional worker assigned to same item
  max workers per queue = 5
```

## Crafting Station Types

| Station | Unlock Cost | Max Level | Production Speed Bonus | Specialization |
|---------|------------|-----------|----------------------|----------------|
| Workshop | 1000 credits | 3 | 1.0x | Basic components |
| Factory | 10000 credits | 6 | 1.5x | Mechanical & circuits |
| Industrial Complex | 100000 credits | 9 | 2.5x | All standard crafting |
| Nanite Forge | 1000000 credits | 12 | 5.0x | Quantum & advanced |
| Bio-Lab | 50000 credits | 7 | 2.0x | Biological agents |
| Shipyard | 250000 credits | 10 | 3.0x | Ship assembly only |
