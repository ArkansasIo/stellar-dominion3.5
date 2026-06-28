# Building System

## Building Categories

### Resource Buildings

| Building | Produces | baseRate | Notes |
|----------|----------|----------|-------|
| Metal Mine | Metal | 30/hr | Requires energy |
| Crystal Plant | Crystal | 20/hr | Requires energy |
| Deuterium Synthesizer | Deuterium | 10/hr | Consumes energy |
| Solar Plant | Energy | 50/hr | Uses sunlight |
| Fusion Reactor | Energy | 100/hr | Consumes deuterium |

### Storage Buildings

| Building | baseStorage | Resource |
|----------|-------------|----------|
| Metal Storage | 100,000 | Metal |
| Crystal Storage | 75,000 | Crystal |
| Deuterium Storage | 50,000 | Deuterium |

### Military Buildings

| Building | Purpose | maxLevel |
|----------|---------|----------|
| Shipyard | Construct ships | 40 |
| Defense Platform | Build turrets | 30 |
| Shield Dome | Planetary shield | 20 |
| Missile Silo | Anti-ballistic missiles | 15 |

### Research Buildings

| Building | Effect | maxLevel |
|----------|--------|----------|
| Research Lab | Research queue + RP generation | 30 |
| Observatory | Sensor range, espionage | 15 |
| Archive | RP storage cap + research speed | 10 |
| Academy | Officer training speed | 15 |

### Special Buildings

| Building | Effect | Unlock Condition |
|----------|--------|------------------|
| Nanite Factory | Build speed `×(1 + 0.5 × level)` | Shipyard L10 |
| Terraformer | Add colony slots | Research L10 |
| Death Star | Superweapon, massive firepower | Shipyard L25 |
| Alliance Depot | Alliance resource storage | Alliance L3 |

## Build Cost Formula

```
cost(L) = baseCost × 1.5^L
```

| Building | baseCost (Metal) | baseCost (Crystal) | baseCost (Deuterium) |
|----------|-----------------|-------------------|---------------------|
| Metal Mine | 60 | 15 | 0 |
| Crystal Plant | 48 | 24 | 0 |
| Deuterium Synthesizer | 225 | 75 | 0 |
| Solar Plant | 75 | 30 | 0 |
| Fusion Reactor | 900 | 360 | 180 |
| Research Lab | 200 | 400 | 200 |
| Shipyard | 400 | 200 | 100 |
| Metal Storage | 1000 | 500 | 0 |
| Crystal Storage | 1000 | 500 | 0 |
| Deuterium Storage | 1000 | 500 | 0 |
| Nanite Factory | 10000 | 5000 | 5000 |

## Build Time Formula

```
time = baseTime × 1.4^L / (1 + naniteLevel × 0.5 + speedMultiplier)
```

| Variable | Description |
|----------|-------------|
| `baseTime` | Per-building base construction time (seconds) |
| `L` | Target building level |
| `naniteLevel` | Nanite Factory level on the planet |
| `speedMultiplier` | Server speed, commander bonuses, event boosts |

### Example

Research Lab to L8, baseTime=1200s, naniteLevel=3, speedMultiplier=0 (no bonuses):

```
time = 1200 × 1.4^8 / (1 + 3 × 0.5) = 1200 × 14.76 / 2.5 = 7085s ≈ 118 min
```

## Construction Queue

- **Max 5 parallel queues** per planet
- Each queue processes one building at a time (sequential within queue)
- Queues can be reordered (paid operation)
- Cancel construction refunds **70%** of resources

### Queue Priority

```
totalTime = sum(times[allQueuedItems])
```

Items can be **prioritized** — a prioritized item jumps to front of its queue and costs `+10%` of total queue time in Credits.

## Building Destruction Mechanics

When a planet is conquered:

- **Military buildings**: 50% destroyed
- **Resource buildings**: 30% destroyed
- **Storage buildings**: 20% destroyed
- **Research/Special buildings**: 10% destroyed

Players may voluntarily **deconstruct** a building:

```
refund = cost(level) × 0.40
deconstructionTime = buildTime(level) × 0.25
```

## Planet Type Building Restrictions

| Planet Type | Bonus | Restriction |
|-------------|-------|-------------|
| Terran | +10% production | None |
| Desert | +20% metal, -20% crystal | No crystal plants > L15 |
| Oceanic | +30% crystal | No mines > L15 |
| Volcanic | +40% metal, +20% energy | No deuterium > L10 |
| Gas Giant | +50% deuterium | No mines, no crystal plants |
| Ice | +20% research speed | -20% production |
| Barren | No bonus | All buildings to L20 max |
| Artificial | Player-defined bonus | Requires terraformer |

## Building Prerequisites Graph

Example: **Nanite Factory**

```
Metal Mine L5 ──→ Crystal Plant L5 ──→ Research Lab L10
                                            │
                                            ↓
Deuterium Synthesizer L5 ──→ Shipyard L10 ──→ Nanite Factory L1
```

A building shows as locked (red) in UI if prerequisites are not met.

## Building Effects

| Building | Effect Formula | Notes |
|----------|---------------|-------|
| Metal Mine | `30 × L × 1.1^(L-1)` MT/hr | Requires `energy = 2 × L × 1.1^(L-1)` |
| Crystal Plant | `20 × L × 1.1^(L-1)` CRY/hr | Requires `energy = 4 × L × 1.1^(L-1)` |
| Deuterium Synthesizer | `10 × L × 1.15^(L-1)` DE/hr | Requires `energy = 10 × L` |
| Research Lab | `10 × L` RP/hr + queue slots | RP generation per planet |
| Shipyard | Ship build speed `×(1 + 0.05 × L)` | Caps at L40 |
| Shield Dome | `5000 × 1.2^L` shield HP | Planetary shield strength |
| Storage | `baseStorage × 1.5^L` capacity | Summed for total capacity |
| Nanite Factory | Build speed `×(1 + 0.5 × L)` | Global effect, stacks |
| Defense Platform | `+3 turret slots per level` | Max 100 turrets |
| Missile Silo | `+5 missiles capacity per level` | ABM and ICMB |
| Academy | `+5% officer XP per level` | Officer training speed |

## Building Maintenance Costs

| Building | Maintenance |
|----------|-------------|
| Metal Mine | `2 × L × 1.1^(L-1)` Energy/hr |
| Crystal Plant | `4 × L × 1.1^(L-1)` Energy/hr |
| Deuterium Synthesizer | `10 × L` Energy/hr |
| Solar Plant | `0` (self-powered) |
| Fusion Reactor | `10 × L` Deuterium/hr |
| Shield Dome | `100 × 1.2^L` Energy/hr |
| All other buildings | `5 Credits/hr × L` |

If energy maintenance exceeds production, buildings shut down in reverse priority order (Resource → Military → Research → Special).

## Auto-Upgrade and Batch Upgrade Mechanics

### Auto-Upgrade

Players may toggle auto-upgrade on any building:

```
autoUpgradeCost = cost(currentLevel + 1)
autoUpgradeTrigger = when resources >= autoUpgradeCost
```

Auto-upgrade queues the next level automatically.

### Batch Upgrade

Up to 10 levels may be queued at once:

```
batchTime = sum(baseTime × 1.4^(L + i) / (1 + naniteLevel × 0.5), i = 0..batchSize-1)
batchCost = sum(baseCost × 1.5^(L + i), i = 0..batchSize-1)
```

Batch upgrades receive a **2% discount** per level beyond the first (up to 10% total). Batch construction may be cancelled (70% refund of total cost).
