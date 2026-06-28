# Universe System

## Universe Overview

### 90 Universes Across 9 Realm Systems

| Realm | Name | Universes | Difficulty Tier | Theme |
|-------|------|-----------|-----------------|-------|
| Realm I | The Core Worlds | 10 (U1-U10) | Beginner (Tier 1) | Safe, abundant, low conflict |
| Realm II | The Outer Rim | 10 (U11-U20) | Easy (Tier 2) | Moderate resources, early conflicts |
| Realm III | The Verge | 10 (U21-U30) | Medium (Tier 3) | Mixed challenges, pirate presence |
| Realm IV | The Expanse | 10 (U31-U40) | Medium-Hard (Tier 4) | Scarce resources, hostile natives |
| Realm V | The Rift | 10 (U41-U50) | Hard (Tier 5) | Anomaly-rich, dangerous space |
| Realm VI | The Void | 10 (U51-U60) | Very Hard (Tier 6) | Minimal resources, extreme hazards |
| Realm VII | The Abyss | 10 (U61-U70) | Expert (Tier 7) | Warzone, ruined civilizations |
| Realm VIII | The Nexus | 10 (U71-U80) | Master (Tier 8) | Cosmic phenomena, ancient threats |
| Realm IX | Eternity's Edge | 10 (U81-U90) | Nightmare (Tier 9) | End-game content, eldritch horrors |

### Realm System Bonuses & Restrictions

| Realm | Bonus | Restriction | Entry Cost |
|-------|-------|-------------|------------|
| Core Worlds | +50% starting resources, +30% growth | No PvP in U1-U3 | Free |
| Outer Rim | +20% trade income | Cap on fleet size (100 ships) | 10,000 credits |
| The Verge | +25% combat XP gain | No research pacts with Core | 50,000 credits |
| The Expanse | +50% rare resource spawns | -20% planetary habitability | 200,000 credits |
| The Rift | +100% anomaly rewards | -30% shield effectiveness | 500,000 credits |
| The Void | +50% energy collection | No food production (synthesize only) | 1,000,000 credits |
| The Abyss | Double loot from wrecks | Permanent war weariness, no decay | 5,000,000 credits |
| The Nexus | Access to precursor tech | Random realm events affect all colonies | 20,000,000 credits |
| Eternity's Edge | Victory counts ×3 | Permadeath mode (no respawn) | 100,000,000 credits |

## Universe Generation

### Seed-Based Generation

```
universeSeed = baseSeed + universeIndex × 100000
random.setSeed(universeSeed)

generationOrder:
  1. Universe layout (size, shape)
  2. Galaxy generation (count, types, positions)
  3. Solar system generation per galaxy
  4. Planet/moon generation per system
  5. Special object placement
  6. Resource distribution
  7. Initial faction placement
```

### Generation Parameters

```
universeWidth  = 1000 + realmIndex × 100  (parsecs)
universeHeight = 1000 + realmIndex × 100
galaxyCount   = 2 + realmIndex × 1  (2 to 10)

factionsPerUniverse = 3 + realmIndex × 1 (max 12)
neutralFactions    = 2 + realmIndex × 0.5
```

## Galaxy Generation

### Galaxy Types

| Type | Shape | Star Count | Spawn Weight | Special Features |
|------|-------|-----------|-------------|------------------|
| Spiral | 4-6 arms | 600-1000 | 45% | Rich core, arm resources |
| Elliptical | Spherical | 800-1200 | 20% | Dense core, frequent anomalies |
| Irregular | Amorphous | 400-700 | 15% | Starburst regions, pirate havens |
| Ring | Toroidal | 500-800 | 10% | Ring highways, fast travel |
| Barred Spiral | 2 arms + bar | 700-1100 | 10% | Bar region: high-value resources |

### Galaxy Generation Formula

```
systemCount = minSystems + random(0, maxSystems - minSystems) × densityModifier

where:
  densityModifier = 0.5 (sparse) to 2.0 (dense)
  galaxySize modifier rolls per universe
```

## Solar System Generation

### Generation Pipeline

```
starTypeWeightedRandom() → planetCount(starType) → for each orbit:
  rollPlanetType(starType, orbitIndex) → planetSize(orbitIndex) → resources(planetType)
  → rollMoonCount(planetSize) → for each moon: moonType → moonSize → resources

then: placeAsteroidBelt() → placeSpecialObjects() → placeResources()
```

### Star Types

| Type | Class | Mass (Solar) | Temp (K) | Color | Frequency |
|------|-------|-------------|----------|-------|-----------|
| O | Blue supergiant | 16-100 | 30,000-50,000 | Blue | 0.01% |
| B | Blue-white main seq | 2.1-16 | 10,000-30,000 | Blue-white | 0.13% |
| A | White main seq | 1.4-2.1 | 7,500-10,000 | White | 0.6% |
| F | Yellow-white main seq | 1.04-1.4 | 6,000-7,500 | Yellow-white | 3% |
| G | Yellow main seq | 0.8-1.04 | 5,200-6,000 | Yellow | 7.6% |
| K | Orange main seq | 0.45-0.8 | 3,700-5,200 | Orange | 12.1% |
| M | Red dwarf | 0.08-0.45 | 2,400-3,700 | Red | 76.5% |

### Planet Count per Star Type

| Star Type | Min Planets | Max Planets | Terrestrial Chance | Gas Giant Chance |
|-----------|-------------|-------------|-------------------|------------------|
| O | 0 | 2 | 5% | 95% |
| B | 0 | 4 | 15% | 85% |
| A | 2 | 6 | 30% | 70% |
| F | 3 | 8 | 40% | 60% |
| G | 4 | 9 | 50% | 50% |
| K | 4 | 8 | 60% | 40% |
| M | 3 | 7 | 70% | 30% |

## Planet Type Generation Weights

### By Star Type & Orbit Position

| Orbit Zone | G-type Star Planet Weights | Habitability |
|------------|---------------------------|-------------|
| Inner (0-0.5 AU) | Barren 40%, Volcanic 30%, Desert 25%, Terran 5% | 10-40% |
| Habitable (0.5-1.5 AU) | Terran 20%, Continental 25%, Oceanic 15%, Jungle 10%, Desert 20%, Arctic 10% | 40-100% |
| Outer (1.5-5 AU) | Gas Giant 60%, Ice 20%, Barren 15%, Volcanic 5% | 5-30% |
| Fringe (5+ AU) | Gas Giant 40%, Ice 40%, Barren 20% | 5-15% |

*Planet type weights vary based on star class (hotter stars shift habitable zone outward).*

## Planet Resources

### Base Resource Generation

```
baseResources:
  minerals = planetSize × typeModifier × 100 + randomVariation(-20%, +20%)
  food     = planetSize × habitability × 50
  energy   = planetSize × (1 - axialTilt / 90) × 100  (solar)
  research = planetType × 10 + ancientRuins bonus

typeModifier by planet type:
  Terran: 1.0, Continental: 1.2, Oceanic: 0.8, Jungle: 1.5,
  Desert: 1.8, Arctic: 1.4, Volcanic: 2.5, Barren: 2.0, Gas Giant: 3.0, Ice: 1.2
```

### Planet Size Formula

```
planetSize = sqrt(orbitIndex × starLuminosityModifier) × random(0.5, 1.5) × sizeModifier

where:
  orbitIndex         = position from star (1 = closest)
  sizeModifier       = 0.3 (small) to 3.0 (massive)
  resulting radius   = 2000 km to 80000 km (gas giants: 20000-75000 km)

size categories:
  Tiny (< 3000 km): -50% slots, -50% resources
  Small (3k-7k km): -25% slots, -25% resources
  Medium (7k-12k km): standard
  Large (12k-20k km): +25% slots, +25% resources
  Huge (> 20k km): +50% slots, +50% resources (gas giants occupy only)
```

## Moon Generation

### Moon Types

| Type | Size Range | Frequency | Resources | Special |
|------|-----------|-----------|-----------|---------|
| Rocky | 100-2000 km | 55% | Low minerals | None |
| Ice | 200-3000 km | 20% | Water, rare gasses | Can be mined |
| Volcanic | 300-1500 km | 10% | High minerals, sulfur | Hazardous |
| Ocean | 500-3000 km | 8% | Food source (aquatic) | Rare |
| Artificial | Variable | 2% | Research bonus | Ancient ruins |
| Habitable | 1000-4000 km | 5% | All resources | Low habitability (30%) |

### Moon Count

```
moonCount = random(0, maxMoons(planetSize))

where:
  maxMoons(Tiny)    = 0
  maxMoons(Small)   = 1
  maxMoons(Medium)  = 3
  maxMoons(Large)   = 6
  maxMoons(Huge)    = 12
  maxMoons(Gas Giant) = random(4, 20)
```

## Special Objects

### Object Types & Rarity

| Object | Rarity | Spawn Weight | Realm Availability | Effects |
|--------|--------|-------------|-------------------|---------|
| Wormhole | Uncommon | 5% | All | Instant travel to paired wormhole |
| Black Hole | Uncommon | 3% | All (rare in Core) | Gravity well, research bonus |
| Nebula | Common | 15% | All | -50% sensor range, +25% damage (some types) |
| Asteroid Field | Common | 20% | All | Mining bonus, navigation hazard |
| Ancient Ruins | Rare | 2% | Realm III+ | Tech discovery, special resources |
| Jump Gate | Rare | 1% | Realm V+ | Instant fleet travel to any gate |
| Stargate | Epic | 0.1% | Realm VII+ | Cross-realm travel |
| Dyson Sphere | Legendary | 0.01% | Realm IX only | Infinite energy (unique per universe) |

### Spawn Rules

```
specialObjectChance = baseWeight × realmMultiplier × (1 + universeIndex × 0.01)

each system independently rolls for each object type
max special objects per system: 3
guaranteed: each galaxy has at least 1 wormhole pair and 1 nebula
```

## Universe Difficulty Tiers

| Tier | Enemy AI Bonus | Hazard Damage | Loot Quality Mod | Resource Scarcity |
|------|---------------|---------------|-----------------|-------------------|
| 1 (Beginner) | 0.8x | 0.5x | 1.5x | 0.5x (abundant) |
| 2 (Easy) | 0.9x | 0.7x | 1.3x | 0.7x |
| 3 (Medium) | 1.0x | 1.0x | 1.0x | 1.0x (standard) |
| 4 (Medium-Hard) | 1.2x | 1.2x | 1.0x | 1.3x |
| 5 (Hard) | 1.5x | 1.5x | 1.2x | 1.7x |
| 6 (Very Hard) | 2.0x | 2.0x | 1.5x | 2.5x |
| 7 (Expert) | 2.5x | 2.5x | 2.0x | 4.0x |
| 8 (Master) | 3.5x | 3.5x | 3.0x | 6.0x |
| 9 (Nightmare) | 5.0x | 5.0x | 5.0x | 10.0x |

## Universe Reset / Rotation

### Rotation Schedule

```
each universe persists for:
  beginner tiers (1-3): 30 days
  medium tiers (4-6): 60 days  
  high tiers (7-8): 90 days
  nightmare (9): 120 days

end of rotation:
  top 10% factions by score receive rewards
  universe resets with new seed
  progress saved as "legacy score"
```

### Legacy Rewards

```
legacyPoints = score × tierMultiplier

tierMultiplier:
  Tier 1-2: 1x
  Tier 3-4: 2x
  Tier 5-6: 3x
  Tier 7-8: 5x
  Tier 9: 10x
```

New game unlocks (cosmetic, starting bonuses, unique commanders) earned via legacy points.

## New Universe Creation Rules

### Player-Created Universes

```
creationCost = 500000 credits + 1000 legacy points

customization options:
  - Universe name (32 chars max)
  - Realm assignment (Tier 1-9)
  - Galaxy type (or random)
  - Faction count (3-16)
  - Resource multiplier (0.5x to 3.0x)
  - Difficulty overrides
  - Public/Private/Invite-only
  - Password protection
  
creationCooldown = 7 days per player
maxActiveUniverses = 2 per player (3 with premium)
```

### Universe Merge Rules

When population drops below 10% of starting faction count for 48 hours:

```
mergeTarget = universe with nearest difficulty tier
factions transferred to target universe
ships distributed to nearest friendly systems
buildings converted to credits (50% value)
```
