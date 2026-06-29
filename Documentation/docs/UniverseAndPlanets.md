# Universe & Planets System

## Overview

The Universe & Planets system provides the foundational infrastructure for procedural universe generation, stellar navigation, interstellar travel, planet colonization, megastructure construction, and orbital station management. It spans shared configuration, server services, API routes, and client-side UI pages across a 256-galaxy, 64-sectors-per-galaxy, 128-systems-per-sector universe.

> **Source:** `shared/config/universeConfig.ts`
> **Source:** `shared/config/universeGenerationConfig.ts`
> **Source:** `shared/config/universeStructureConfig.ts`

---

## Coordinate System

All celestial locations use a hierarchical coordinate system with 5 or 6 levels:

```
[galaxy:sector:system:position:index]
```

| Field | Range | Description |
|---|---|---|
| `galaxy` | 1–256 | Galaxy index |
| `sector` | 1–64 | Sector within galaxy |
| `system` | 1–128 | Solar system within sector |
| `x`, `y`, `z` | continuous | Precise location in light-years |

> **Source:** `shared/config/interstellarTravelConfig.ts:11-18`

---

## Universe Configuration

### Universe Presets

Three presets control generation scale:

| Preset | Galaxies | Sectors | Systems/Sector | Star Density | Total Systems |
|---|---|---|---|---|---|
| `starter` | 1 | 10 | 20 | 15% | 200 |
| `standard` | 3 | 50 | 50 | 25% | 7,500 |
| `vast` | 10 | 200 | 100 | 40% | 2,000,000 |

> **Source:** `shared/config/universeGenerationConfig.ts:40-91`

### Full Configuration Parameters

```typescript
interface UniverseConfig {
  seed: number;              // Deterministic generation seed
  size: 'small' | 'medium' | 'large' | 'massive' | 'infinite';
  galaxies: number;          // 1–256
  sectorsPerGalaxy: number;  // 1–64
  systemsPerSector: number;  // 1–128
  starDensity: number;       // 0–100%
  planetDensity: number;     // Average planets per system
  asteroidsPerSystem: number;
  hazardDensity: number;     // 0–100%
  universeAge: number;       // 13,800 million years
  gravity: number;           // G constant (9.81)
  ftlSpeedLimit: number;     // Max LY/turn (50–200)
  wormholeFrequency: number; // 0–100% chance
}
```

> **Source:** `shared/config/universeGenerationConfig.ts:14-38`
> **Source:** `shared/config/universeConfig.ts:1-184`

### Universe Limits

```
Max galaxies:             256
Sectors per galaxy:       64
Systems per sector:       128
Min planets per system:   0
Max planets per system:   15
Min moons per planet:     0
Max moons per planet:     82
Asteroid belt chance:     30%
Comet chance:             10%
```

> **Source:** `shared/config/universeConfig.ts:7-17`

---

## Procedural Generation

### Seeded Random Generation

The `SeededRandom` class produces deterministic sequences from a seed string using FNV-1a hashing and a linear congruential generator. The same seed always produces the same universe.

> **Source:** `server/services/universeSeedService.ts:75-103`
> **Source:** `client/src/lib/universeSeed.ts:70-124`

### UniverseGenerator Class

The `UniverseGenerator` class in `universeGenerationConfig.ts` generates full universe state, individual systems, stars, planets, and hazards:

```typescript
class UniverseGenerator {
  generateUniverse(): UniverseState;
  generateSystem(params: ProcGenerationParams): GeneratedSystem;
}
```

Key behaviors:
- Star types follow real astronomical frequency distribution via `STAR_TYPE_DISTRIBUTION`
- Planet count per system: `Math.floor(rng() * (planetDensity * 4)) + 1`
- 30% chance of secondary star, 10% chance of tertiary star
- Hazards generated based on `hazardDensity` config
- Habitable zones calculated from star luminosity: `sqrt(luminosity) × 0.95` to `sqrt(luminosity) × 1.37`

> **Source:** `shared/config/universeGenerationConfig.ts:236-503`

### UniverseGenerator (Client-Side)

The client has its own `UniverseGenerator` class that generates systems, sectors, and galaxies from a seed:

```typescript
class UniverseGenerator {
  generateSystemFromSeed(galaxy, sector, system): GeneratedSystem;
  generateSectorFromSeed(galaxy, sector): GeneratedSector;
  generateGalaxyFromSeed(galaxy): GeneratedGalaxy;
  getPlanetBySeed(galaxy, sector, system, orbit): GeneratedPlanet | null;
}
```

It uses `UNIVERSE_CONFIG` parameters and star type distribution to produce consistent client-side views.

> **Source:** `client/src/lib/universeSeed.ts:552-976`

### Name Generation

Names are generated using phonemic syllable combinations:

- Star names: prefix + suffix, constellation + Greek letter, or 2–3 syllable phoneme clusters
- Planet names: Roman numeral suffixes or 2–3 syllable phonemes
- 40+ star name prefixes, 10+ suffixes, 24 Greek letters, 44 constellations, 80+ syllables

> **Source:** `shared/config/universeConfig.ts:45-101`
> **Source:** `client/src/lib/universeSeed.ts:565-623`

### Utility Functions

```typescript
createUniverseState(presetName)     // Create universe from preset
getTotalSystems(config)             // Galaxies × Sectors × Systems
estimateUniverseSize(universeState) // "X/Y systems discovered (Z%)"
```

> **Source:** `shared/config/universeGenerationConfig.ts:523-539`

---

## Star System

### Star Classification (Hertzsprung-Russell)

| Class | Color | Temp (K) | Mass (M☉) | Luminosity | Frequency | Rarity |
|---|---|---|---|---|---|---|
| O | Blue | 30,000 | 60 | 1,000,000 | 0.003% | Legendary |
| B | Blue-White | 20,000 | 6 | 20,000 | 0.13% | Epic |
| A | White | 8,500 | 2 | 25 | 0.6% | Rare |
| F | Yellow-White | 6,500 | 1.3 | 3 | 3% | Uncommon |
| G | Yellow | 5,500 | 1 | 1 | 7.6% | Common |
| K | Orange | 4,500 | 0.7 | 0.4 | 12.1% | Common |
| M | Red | 3,000 | 0.3 | 0.04 | 76.5% | Common |

> **Source:** `shared/config/universeConfig.ts:104-112`
> **Source:** `shared/config/navigationConfig.ts:73-84`
> **Source:** `shared/config/universeGenerationConfig.ts:509-517`

### Star Types (Structure Config)

26 pre-defined star objects with classification, mass, temperature, and descriptions:

- Types: O-type, B-type, A-type, F-type, G-type, K-type, M-type
- Sub-types: blue-giant, red-supergiant, main-sequence, white-supergiant, orange-dwarf, yellow-dwarf, red-dwarf, giant, pulsating-giant, etc.
- Each has physical characteristics (mass in M☉, temperature in K)

> **Source:** `shared/config/universeStructureConfig.ts:76-363`

### Special Star Types

```
neutron_star:    chance 0.5%, mass 1.4–3 M☉, pulsar chance 30%
white_dwarf:     chance 2%, mass 0.5–1.4 M☉
```

> **Source:** `shared/config/universeConfig.ts:147-149`

---

## Galaxy System

### Galaxy Types

| Type | Arms | Density Multiplier | Habitable Chance |
|---|---|---|---|
| Spiral | 2–6 | 1.0 | 10% |
| Elliptical | 0 | 1.5 | 5% |
| Irregular | 0 | 0.7 | 8% |
| Lenticular | 0 | 1.2 | 7% |
| Ring | 1 | 0.8 | 6% |

> **Source:** `shared/config/universeConfig.ts:128-133`

### Pre-Defined Galaxies

26 named galaxies (Andromeda, Bode's Galaxy, Cartwheel Galaxy, etc.) with types, classifications, and characteristics.

> **Source:** `shared/config/universeStructureConfig.ts:32-70`

### Nearby Galaxies (Client Reference)

Real astronomical galaxies used as reference: Milky Way, Andromeda (M31), Triangulum (M33), Large/Small Magellanic Cloud, Sagittarius Dwarf, Ursa Minor Dwarf, Sculptor Dwarf.

> **Source:** `client/src/lib/solSystemData.ts:892-965`

---

## Planet Types & Statistics

### Planet Classification System

The `PLANET_TYPES` registry contains 50+ unique planet types organized into four families:

| Family | Count | Examples |
|---|---|---|
| Terrestrial | 12 | Earth-Like, Desert, Ice, Jungle, Ocean, Volcanic, Mountain, Storm, Cavern, Poison |
| Gas Giants | 4 | Jupiter-Class, Saturn-Class, Neptune-Class, Brown Dwarf, Storm Giant |
| Small Bodies | 6 | Small/Large Asteroid, Terrestrial Moon, Icy Moon, Volcanic Moon, Active Comet |
| Exotic | 3 | Ring World, Dyson Sphere, Neutron Star System |

> **Source:** `shared/config/planetTypesConfig.ts:84-798`

### Planet Type Structure

Each planet type has comprehensive properties:

```typescript
interface PlanetType {
  id: string;
  name: string;
  family: string;           // Parent category
  type: string;             // Main type
  subType: string;          // Variation
  class: string;            // Habitability class (Ideal/Marginal/Resource/Hostile/Uninhabitable/Legendary)
  subClass: string;         // Specific variant
  description: string;
  stats: PlanetStats;       // Physical, atmospheric, climate, resource stats
  basePossibleColonies: number;
  baseProductionMultiplier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  discoveryValue: number;
  dangers?: string[];
  opportunities?: string[];
  specialFeatures?: string[];
}
```

> **Source:** `shared/config/planetTypesConfig.ts:53-78`

### PlanetStats Properties

```typescript
interface PlanetStats {
  diameter: number;              // km
  mass: number;                  // Earth masses
  gravity: number;               // G-force (0.1–3.0x)
  axialTilt: number;             // degrees
  dayLength: number;             // hours
  yearLength: number;            // days
  atmospherePressure: number;    // atm (0–5)
  atmosphereComposition: { nitrogen?, oxygen?, carbon?, other? };
  avgTemp: number;               // Celsius
  minTemp: number;
  maxTemp: number;
  waterCoverage: number;         // % of surface
  habitabilityIndex: number;     // 0–100
  biodiversityPotential: number; // 0–100
  metalRichness: number;         // 0–100
  crystalRichness: number;       // 0–100
  deuteriumRichness: number;     // 0–100
  biologicalResources: number;   // 0–100
  radioactivity: number;         // 0–100
  seismicActivity: number;       // 0–100
  magneticField: number;         // 0–100
  stormIntensity: number;        // 0–100
}
```

> **Source:** `shared/config/planetTypesConfig.ts:11-51`

### Planet Rarity Distribution

```
common:    common, uncommon types (rocky-barren, swamp, poison, desert, storm, mountain)
uncommon:  ice-world, jungle, ocean, volcanic, terrestrial, moon types, gas giants
rare:      earth-like, cavern, active comet, neptune-class
epic:      brown dwarf, storm giant, neutron star system
legendary: ring world, dyson sphere
```

> **Source:** `shared/config/planetTypesConfig.ts:802-826`

### Planet Utility Functions

```typescript
getPlanetType(id)                    // Lookup by ID
getPlanetsByFamily(family)           // Filter by family
getPlanetsByClass(className)         // Filter by class
getPlanetsByRarity(rarity)           // Filter by rarity
getHabitablePlanets()                // habitabilityIndex >= 30
getResourceRichPlanets()             // metal/crystal/deuterium richness >= 50
calculateColonyCost(planetType)      // { metal, crystal, deuterium }
getPlanetProductionBonus(planetType) // production multipliers
describePlanet(planetType)           // formatted description string
```

> **Source:** `shared/config/planetTypesConfig.ts:832-895`

### Navigation Planet Types

The `navigationConfig.ts` defines a parallel set of planet types for navigation:

```typescript
type PlanetType = 'terrestrial' | 'super_earth' | 'mini_neptune' | 'gas_giant' |
  'ice_giant' | 'lava' | 'desert' | 'ocean' | 'terrestrial_paradise' | 'dead' | 'tidal_locked';
```

With `PLANET_CHARACTERISTICS` mapping each type to size, gravity, habitability, resources, and rarity.

> **Source:** `shared/config/navigationConfig.ts:90-198`

---

## Moon System

### Moon Types (Structure Config)

26 named moons with classifications:

- Types: icy, rocky, volcanic, ice-rock, gas, metallic
- Sub-types: geologically-active, airless, tidal-locked, dusty, geysers, co-orbital, frozen, etc.
- Classes: satellite, saturnian, uranian, martian, solar, hot, irregular, etc.
- Examples: Luna, Titan, Europa, Ganymede, Callisto, Enceladus, Io, Triton, Phobos, Deimos

> **Source:** `shared/config/universeStructureConfig.ts:662-949`

### Moon Types (Planet Types Config)

Moon types defined in `planetTypesConfig.ts`:

| Type | Class | Habitability | Resources |
|---|---|---|---|
| Terrestrial Moon | Marginal | 35 | Metal-rich |
| Icy Moon | Resource | 25 | Water-rich |
| Volcanic Moon | Hostile | 20 | Geothermal |

> **Source:** `shared/config/planetTypesConfig.ts:550-707`

### Moon API Routes

- `GET /api/moons/planet/:planetId` — Get all moons for a planet
- `GET /api/moons/:moonId` — Get specific moon details
- `GET /api/moons/:moonId/stats` — Moon stats, sub-stats, attributes
- `GET /api/moons/:moonId/status` — Condition, stability, health, alerts
- `GET /api/moons/:moonId/attributes` — Physical properties, biome, atmosphere
- `GET /api/moons/:moonId/details` — Development stage, population, GDP, defense, anomalies
- `POST /api/moons/:moonId/colonize` — Colonize a moon (costs metal/crystal/deuterium)
- `POST /api/moons/:moonId/upgrade` — Upgrade moon level
- `POST /api/moons/:moonId/build-base` — Construct moon base (outpost, military-base, research-station, mining-colony, refinery, spaceport, megastructure-anchor)
- `POST /api/moons/generate` — Generate new moon (admin)

> **Source:** `server/routes-moons.ts`

---

## Navigation & Exploration

### Celestial Object Types

```typescript
type CelestialObjectType = 'star' | 'planet' | 'moon' | 'asteroid' |
  'nebula' | 'blackhole' | 'station' | 'debris' | 'anomaly';
```

> **Source:** `shared/config/navigationConfig.ts:13`

### Navigation Hazards

12 hazard types with severity, damage, difficulty, and avoidability:

| Hazard | Base Damage | Shield Drain | Difficulty | Avoidable |
|---|---|---|---|---|
| Radiation | 2 | 5 | 20 | Yes |
| Solar Flare | 10 | 15 | 40 | No |
| Asteroid Field | 5 | 0 | 30 | Yes |
| Cosmic Storm | 15 | 20 | 60 | No |
| Dimensional Anomaly | 20 | 25 | 80 | No |
| Pirate Activity | 0 | 0 | 10 | Yes |
| Sensor Deadzone | 0 | 0 | 50 | Yes |
| Space Debris | 3 | 0 | 25 | Yes |
| Starfield Effect | 50 | 50 | 100 | No |
| Temporal Distortion | 25 | 30 | 90 | No |
| Gravity Well | 10 | 10 | 35 | Yes |
| Ion Storm | 12 | 18 | 45 | No |

> **Source:** `shared/config/navigationConfig.ts:204-311`

### Sensor Systems

Three tiers of sensor arrays:

| Sensor | Scan Range | Detailed Range | Life Detection | Wormhole Detection | Accuracy |
|---|---|---|---|---|---|
| Basic | 1,000 km | 500 km | No | No | 60% |
| Advanced | 5,000 km | 2,000 km | Yes | No | 85% |
| Military | 10,000 km | 5,000 km | Yes | Yes | 95% |

> **Source:** `shared/config/navigationConfig.ts:380-459`

### Navigation Functions

```typescript
calculateNavigationDifficulty(hazards, distance, pilotSkill): number
calculateExplorationReward(site, exhaustion): number
getSensorRange(array, powerLevel): number
canNavigateHazard(pilotSkill, hazard, shipShielding, shipArmor): boolean
estimateExplorationTime(site, teamSkill): number
selectOptimalRoute(hazards, pilotSkill, shipSpec): NavigationHazard[]
```

> **Source:** `shared/config/navigationConfig.ts:500-566`

---

## Interstellar Travel

### Stargates (Ancient Network)

4 pre-defined ancient stargates with instant intergalactic travel:

| Gate | Galaxy | Sector | Diameter | Efficiency | Max Distance |
|---|---|---|---|---|---|
| Alpha Gate | 1 | 1 | 1,000 km | 95% | 1,000,000 LY |
| Beta Gate | 1 | 50 | 900 km | 92% | 1,000,000 LY |
| Gamma Gate | 2 | 1 | 1,100 km | 98% | 1,000,000 LY |
| Delta Gate | 1 | 200 | 800 km | 88% | 1,000,000 LY |

- No fuel cost (powered by ancient technology)
- Travel time: 3–6 turns
- Unlimited ship size
- Network connections between gates

> **Source:** `shared/config/interstellarTravelConfig.ts:39-150`

### Jumpgates (Player-Built)

Player-constructable gates with upgrade system:

```typescript
interface Jumpgate {
  diameter: number;              // 100–500 km
  energyOutput: number;          // 10,000–50,000 MW
  efficiency: number;            // 70–95%
  level: number;                 // 1–999
  tier: number;                  // 1–99
  maxTravelDistance: number;     // 50–5,000 LY
  travelTime: number;            // 1–10 turns
  maxShipSize: number;           // 50,000–1,000,000 HP
  simultaneousJumps: number;
  shieldStrength: number;
  defensiveWeapons: number;
  linkedGates: string[];
  networkName: string;
}
```

> **Source:** `shared/config/interstellarTravelConfig.ts:156-205`

### Wormholes (Natural Phenomena)

2 pre-defined wormholes:

| Wormhole | Difficulty | Stability | Travel Time | Casualties | Skill Required |
|---|---|---|---|---|---|
| Tau-1 | Hard | 85% | 8 turns | 5% | 60 |
| Omega Rift | Expert | 65% | 20 turns | 25% | 85 |

Features:
- One-way or two-way travel
- Seasonal availability (some)
- Energy requirement: 500–1,500 deuterium
- Max ship size: 30,000–50,000 HP
- Dangers: tidal forces, radiation, dimensional shearing

> **Source:** `shared/config/interstellarTravelConfig.ts:211-311`

### FTL Drives

4 drive classes:

| Drive | Class | Speed (LY/turn) | Jump Range | Tech Level | Failure Rate |
|---|---|---|---|---|---|
| Standard | Civilian | 10 | 50 LY | 5 | 2% |
| Military | Military | 25 | 200 LY | 15 | 1% |
| Experimental | Experimental | 50 | 500 LY | 25 | 5% |
| Ancient | Ancient | 100 | 1,000 LY | 50 | 0% |

Features:
- Fuel efficiency: 2–10 LY per unit deuterium
- Charge time: 0.5–3 turns
- Capabilities: blind jumps, starfield operation, stealth, tow vessels
- Warp bubble protection (military+)

> **Source:** `shared/config/interstellarTravelConfig.ts:317-457`

### Travel Calculation Functions

```typescript
calculateDistance(from, to): number              // Light-years
calculateTravelTime(distance, ftlDrive, gate): number   // Turns
calculateTravelCost(distance, ftlDrive): { deuterium, energy }
buildTravelRoute(name, from, to, method, ftlDrive): TravelRoute
getNearbyWormholes(coords, radiusLY): Wormhole[]
```

> **Source:** `shared/config/interstellarTravelConfig.ts:463-578`

---

## Megastructures

### Overview

Megastructures support 999 levels and 99 tiers across 10 base types plus 90 generated infrastructure templates (10 families × 9 variants = 100 total).

> **Source:** `shared/config/megastructuresConfig.ts`

### Megastructure Types (Base)

| Type | Class | Function |
|---|---|---|
| Dyson Sphere | Infrastructure/Support | Stellar energy harvesting |
| Ringworld | Infrastructure/Support | Planetary-scale habitat |
| Megaforge | Production/Hybrid | Weapon and unit production |
| Research Nexus | Research/Support | Scientific breakthrough acceleration |
| Orbital Fortress | Defense/Defensive | Planetary defense |
| Generation Ship | Mobility/Support | Interstellar colonization |
| Matter Converter | Production/Hybrid | Universal matter-energy conversion |
| Dimensional Gate | Exotic/Experimental | Exotic teleportation |
| Stellar Engine | Mobility/Hybrid | Star system propulsion |
| Nova Cannon | Superweapon/Offensive | Stellar-scale weapon |

> **Source:** `shared/config/megastructuresConfig.ts:797-1066`

### Infrastructure Families

10 families with 9 variant subtypes each:

1. Habitat Ring, 2. Energy Spire, 3. Logistics Hub, 4. Terraform Array, 5. Starlift Anchor
6. Quantum Grid, 7. Orbital Arcology, 8. Stellar Harvester, 9. Void Refinery, 10. Transit Lattice

Variant sizes: Alpha (huge), Beta (massive), Gamma (planetary), Delta (colossal), Epsilon (solar), Zeta (massive), Eta (planetary), Theta (solar), Iota (galactic)

> **Source:** `shared/config/megastructuresConfig.ts:13-36`

### Categories & Sub-Categories

18 categories with 32 sub-categories:

| Category | Sub-Categories |
|---|---|
| Infrastructure | habitat-construction, energy-grid, transit-network |
| Production | factory-complex, matter-fabrication, resource-extraction |
| Research | scientific-array, computation-matrix, quantum-laboratory |
| Defense | planetary-fortress, orbital-shield |
| Mobility | ftl-drive, starlift-system |
| Exotic | dimensional-rift, reality-anchor |
| Superweapon | stellar-weapon, planetary-annihilator |
| Civilization | culture-nexus, population-center |
| Economic | trade-exchange, market-nexus |
| Diplomatic | diplomatic-station, peace-beacon |
| Exploration | survey-array |
| Colonization | relay-network, settlement-complex |
| Communication | broadcast-tower |
| Surveillance | sensor-array |
| Terraforming | terraforming-engine |
| Ecological | biome-reconstructor |
| Temporal | temporal-observatory |
| Dimensional Forge | forge-nexus |

> **Source:** `shared/config/megastructuresConfig.ts:159-268`

### Tier System

9 tier classes (Alpha through Omega), each spanning ~11 tiers:

| Class | Tiers | Rank |
|---|---|---|
| Alpha | 1–11 | Pioneer |
| Beta | 12–22 | Apprentice |
| Gamma | 23–33 | Journeyman |
| Delta | 34–44 | Adept |
| Epsilon | 45–55 | Expert |
| Zeta | 56–66 | Master |
| Eta | 67–77 | Grand Master |
| Theta | 78–88 | Archon |
| Omega | 89–99 | Transcendent/Mythic |

Each tier has 99 unique titles from "Novice Constructor" to "The Infinite Architect".

> **Source:** `shared/config/megastructuresConfig.ts:139-525`

### Progression Multipliers

```typescript
Level multiplier: 1.0 + (0.015 × (level - 1))  // 1.0x to 15.98x
Tier multiplier:  1.0 + (0.08 × (tier - 1))    // 1.0x to 8.84x
```

> **Source:** `shared/config/megastructuresConfig.ts:1082-1098`

### Megastructure Functions

```typescript
createMegastructure(templateId, customId, level, tier, x, y, z, sector): Megastructure
upgradeMegastructureLevel(mega, levels): Megastructure
upgradeMegastructureTier(mega, tiers): Megastructure
toggleMegastructure(mega, active): Megastructure
updateMegastructureEfficiency(mega, efficiency): Megastructure
getOffensivePower(mega): number
getDefensivePower(mega): number
getStrategicValue(mega): number
calculateMegastructureConstructionCost(templateOrId, level, tier): MegastructureCost
calculateMegastructureUpgradeCost(templateOrId, currentLevel, currentTier, targetLevel, targetTier): MegastructureCost
```

> **Source:** `shared/config/megastructuresConfig.ts:1160-1415`

### Megastructure API Routes

- `GET /api/megastructures/templates` — Template catalog
- `GET /api/megastructures/player` — Player's megastructures
- `POST /api/megastructures/construct` — Build megastructure
- `POST /api/megastructures/:id/upgrade-level` — Upgrade level
- `POST /api/megastructures/:id/upgrade-tier` — Upgrade tier
- `POST /api/megastructures/:id/operational` — Toggle operational state

> **Source:** `server/routes-megastructures.ts`

---

## Orbital Stations

### Overview

36 orbital station definitions across 18 categories with 32 sub-categories, tiers 1–99, levels 1–999.

> **Source:** `shared/config/orbitalStationsConfig.ts`

### Station Classes

| Class | Title | Description |
|---|---|---|
| common | Station | Basic functionality |
| uncommon | Outpost | Enhanced capabilities |
| rare | Base | Advanced systems |
| epic | Complex | High-tier operations |
| legendary | Fortress | Endgame structures |
| mythic | Citadel | Near-capability |
| transcendent | Nexus | Ultimate structures |

> **Source:** `shared/config/orbitalStationsConfig.ts:11-17`

### Station Categories (18)

| Category | Sub-Categories |
|---|---|
| Command & Control | Tactical Command, Strategic Operations |
| Energy Systems | Fusion Power Core, Antimatter Reactor |
| Defense Systems | Kinetic Defense, Energy Shield |
| Manufacturing | Fabrication Bay, Assembly Dock |
| Research & Development | Science Division, Advanced Tech Lab |
| Logistics & Supply | Supply Depot, Transit Hub |
| Communications | Sensor Network, Signal Relay |
| Habitation | Crew Quarters, Life Support |
| Mining & Extraction | Orbital Mining, Resource Processing |
| Trade & Commerce | Market Hub, Trade Terminal |
| Military Operations | Infantry Garrison, Mechanized Division |
| Shipyard Operations | Light Vessel Shipyard, Capital Ship Drydock |
| Intelligence | Spy Network |
| Diplomacy | Embassy Complex |
| Terraforming | Atmospheric Processor |
| Anomaly Research | Void Research, Artifact Analysis |
| Medical | Medical Bay |
| Megastructure Support | Construction Support, Power Relay |

> **Source:** `shared/config/orbitalStationsConfig.ts:274-433`

### Station Types

```typescript
type OrbitalStationType = 'surface' | 'lunar' | 'orbital' | 'deep_space' | 'lagrange_point';
type OrbitalStationSubType = 'fixed' | 'modular' | 'mobile' | 'anchored' | 'ring_segment';
```

### Station Ranks

Initiate (T1–10) → Operator (11–20) → Engineer (21–30) → Specialist (31–40) → Expert (41–50) → Master (51–60) → Elite (61–70) → Veteran (71–80) → Legend (81–90) → Mythic (91–99)

> **Source:** `shared/config/orbitalStationsConfig.ts:115-126`

### Station API Routes

- `GET /api/orbital-stations/status` — Full state with global bonuses
- `GET /api/orbital-stations/platforms` — Platform types
- `GET /api/orbital-stations/satellites` — Satellite types
- `GET /api/orbital-stations/defense-systems` — Defense systems
- `GET /api/orbital-stations/offense-systems` — Offense systems
- `GET /api/orbital-stations/shield-systems` — Shield systems
- `POST /api/orbital-stations/build` — Build new station
- `POST /api/orbital-stations/upgrade` — Upgrade station tier
- `POST /api/orbital-stations/deploy-satellite` — Deploy satellite
- `POST /api/orbital-stations/install-defense` — Install defense system
- `POST /api/orbital-stations/install-offense` — Install offense system
- `POST /api/orbital-stations/install-shield` — Install shield system
- `POST /api/orbital-stations/tick` — Process station tick
- `GET /api/orbital-stations/scores` — Defense/offense/production scores

> **Source:** `server/routes-orbital-stations.ts`

---

## Celestial Objects & Browsing

### Celestial Object Classification

The `celestialObjects.ts` client library defines a comprehensive taxonomy:

| Object | Sizes | Types/Classes |
|---|---|---|
| Planet | tiny–jovian | 9 classes, 13 types |
| Moon | tiny–large | 6 types, 5 classes |
| Star | — | 9 spectral classes, 10 star types |
| Asteroid | tiny–large | 6 classes |
| Comet | — | 4 types |
| Nebula | — | 5 types |
| Black Hole | — | 3 danger levels |

> **Source:** `client/src/lib/celestialObjects.ts`

### Sol System Data

Complete reference data for the Solar System including 8 planets, 5 dwarf planets, 19 moons, with real physical properties (mass, radius, orbital period, atmosphere, composition).

Nearby galaxy reference: 7 galaxies with types, sizes, star counts, diameters, and coordinates.

> **Source:** `client/src/lib/solSystemData.ts`

### Planet Utilities

`planetUtils.ts` provides deterministic planet detail generation from a seed:

```typescript
getPlanetDetails(seed): PlanetDetails  // Returns class, type, atmosphere, gravity, temp, features
```

Planet classes: M (Minshara/Earth-like), H (Desert), L (Marginally Habitable), K (Adaptable), Y (Demon Class), D (Barren), J (Gas Giant), T (Frozen)

> **Source:** `client/src/lib/planetUtils.ts`

### Planet Dossier

`planetDossier.ts` creates comprehensive planet reports:

```typescript
createPlanetDossier(planet: PlanetDossierInput): PlanetDossier
```

Returns: archetype, status (condition, colonyReadiness, strategicValue, threatLevel), physical properties, atmosphere, biosphere, geology, colony data, and 6 assessment attributes.

> **Source:** `client/src/lib/planetDossier.ts`

### Celestial Browser Page

Client page for browsing celestial objects with tabs for planets, stars, and other objects. Displays sample data and allows navigation to planet details.

> **Source:** `client/src/pages/CelestialBrowser.tsx`

---

## Warp Network

### Warp Gates

Player-constructable warp gates with energy costs, cooldowns, and linked gate networks.

Features:
- Owned/unclaimed status
- Level-based upgrades
- Energy cost and cooldown management
- Linked gate networks for route planning

> **Source:** `client/src/pages/WarpNetwork.tsx`

### Trade Routes

NPC merchant networks connecting systems for automated trade.

### Wormhole Routes

Special frontier features including wormhole-based shortcuts between distant regions.

> **Source:** `client/src/pages/WarpNetwork.tsx:7-9`

---

## API Endpoints

### Planets API

| Endpoint | Method | Description |
|---|---|---|
| `/api/planets` | GET | List all planets |
| `/api/planets/:id` | GET | Get planet by ID |
| `/api/planets/:id/colonize` | POST | Colonize planet |
| `/api/planets/:id/build` | POST | Build/upgrade structure |
| `/api/planets/:id/sub-planes` | GET | Moon and station data |
| `/api/planets/:id/sub-planes/:type/upgrade` | POST | Upgrade moon/station module |
| `/api/planets/:id/defense` | GET | Defense systems |
| `/api/planets/:id/defense/upgrade` | POST | Upgrade defense system |
| `/api/planets/:id/occupation` | GET | Occupation state |
| `/api/planets/:id/occupation/garrison` | POST | Deploy/withdraw troops |
| `/api/planets/:id/occupation/policy` | POST | Set tax rate |
| `/api/planets/:id/occupation/suppress` | POST | Suppression sweep |
| `/api/planets/:id/occupation/extract` | POST | Extract resources |
| `/api/planets/:id/occupation/fortify` | POST | Upgrade fortifications |
| `/api/planets/types` | GET | Planet type catalog (with filters) |
| `/api/planets/types/:id` | GET | Specific planet type details |

> **Source:** `server/routes-planets.ts`
> **Source:** `server/routes-travel.ts:134-158`

### Galaxy API

| Endpoint | Method | Description |
|---|---|---|
| `/api/galaxy/:universe/:galaxy/:sector/:system` | GET | Get system data |
| `/api/galaxy/:universe/:galaxy/:sector/:system/scan` | POST | Deep scan |

> **Source:** `server/routes-galaxy.ts`

### Moons API

| Endpoint | Method | Description |
|---|---|---|
| `/api/moons/planet/:planetId` | GET | Moons for planet |
| `/api/moons/:moonId` | GET | Moon details |
| `/api/moons/:moonId/stats` | GET | Moon stats |
| `/api/moons/:moonId/status` | GET | Moon status |
| `/api/moons/:moonId/attributes` | GET | Moon attributes |
| `/api/moons/:moonId/details` | GET | Moon details/history |
| `/api/moons/:moonId/colonize` | POST | Colonize moon |
| `/api/moons/:moonId/upgrade` | POST | Upgrade moon level |
| `/api/moons/:moonId/build-base` | POST | Build moon base |
| `/api/moons/generate` | POST | Generate new moon |

> **Source:** `server/routes-moons.ts`

### Megastructures API

| Endpoint | Method | Description |
|---|---|---|
| `/api/megastructures/templates` | GET | Template catalog |
| `/api/megastructures/player` | GET | Player megastructures |
| `/api/megastructures/construct` | POST | Build megastructure |
| `/api/megastructures/:id/upgrade-level` | POST | Upgrade level |
| `/api/megastructures/:id/upgrade-tier` | POST | Upgrade tier |
| `/api/megastructures/:id/operational` | POST | Toggle operational |

> **Source:** `server/routes-megastructures.ts`

### Orbital Stations API

| Endpoint | Method | Description |
|---|---|---|
| `/api/orbital-stations/status` | GET | Full station state |
| `/api/orbital-stations/platforms` | GET | Platform types |
| `/api/orbital-stations/satellites` | GET | Satellite types |
| `/api/orbital-stations/defense-systems` | GET | Defense systems |
| `/api/orbital-stations/offense-systems` | GET | Offense systems |
| `/api/orbital-stations/shield-systems` | GET | Shield systems |
| `/api/orbital-stations/build` | POST | Build station |
| `/api/orbital-stations/upgrade` | POST | Upgrade tier |
| `/api/orbital-stations/deploy-satellite` | POST | Deploy satellite |
| `/api/orbital-stations/install-defense` | POST | Install defense |
| `/api/orbital-stations/install-offense` | POST | Install offense |
| `/api/orbital-stations/install-shield` | POST | Install shield |
| `/api/orbital-stations/tick` | POST | Process tick |
| `/api/orbital-stations/scores` | GET | Station scores |

> **Source:** `server/routes-orbital-stations.ts`

### Travel API

| Endpoint | Method | Description |
|---|---|---|
| `/api/travel/stargates` | GET | List stargates |
| `/api/travel/wormholes` | GET | List wormholes (with proximity filter) |
| `/api/travel/ftl-drives` | GET | List FTL drives (with class/tech filter) |
| `/api/travel/route/calculate` | POST | Calculate travel route |
| `/api/travel/player/state` | GET | Player travel state |
| `/api/travel/player/route` | POST | Set player route |

> **Source:** `server/routes-travel.ts`

### Biomes API

| Endpoint | Method | Description |
|---|---|---|
| `/api/biomes/catalog` | GET | Full biome catalog |
| `/api/biomes/catalog/:id` | GET | Specific biome |
| `/api/biomes/environment/:environment` | GET | Biomes by environment |
| `/api/biomes/letter/:letter` | GET | Biomes by letter |
| `/api/biomes/rarity/:rarity` | GET | Biomes by rarity |

> **Source:** `server/routes-travel.ts:161-218`

### Universe Seed API

| Endpoint | Method | Description |
|---|---|---|
| `/api/universe/seed/config` | GET | User seed config |
| `/api/universe/seed/select` | POST | Set custom seed |
| `/api/universe/seed/reset` | POST | Reset to default seed |
| `/api/universe/seed/system/:galaxy/:sector/:system` | GET | Generate system |
| `/api/universe/seed/sector/:galaxy/:sector` | GET | Sector preview |
| `/api/universe/seed/galaxy/:galaxy/summary` | GET | Galaxy summary |

> **Source:** `server/routes-universe-seed.ts`

---

## Client-Side Pages

### Galaxy Page

Interactive system viewer showing orbital positions in a star system. Displays planets, asteroid belts, nebulae, black holes, and stations. Supports deep scanning and navigation to planet details.

> **Source:** `client/src/pages/Galaxy.tsx`

### Universe Page

High-level universe map showing galaxies, sectors, and systems. Supports seed selection and universe configuration. Displays system ownership and activity.

> **Source:** `client/src/pages/Universe.tsx`

### PlanetDetail Page

Comprehensive planet view with tabs for overview, dossier, resources, buildings, defense, environment, and events. Includes colonization, building upgrades, and habitat systems.

> **Source:** `client/src/pages/PlanetDetail.tsx`

### Stations Page

Orbital station management with tabs for moon bases, orbital stations, and infrastructure. Displays construction options, upgrade paths, and habitat systems. Includes wormhole stronghold programs.

> **Source:** `client/src/pages/Stations.tsx`

### MegaStructures Page

Megastructure catalog and management. Categories include network, production, research, defense, mobility, exotic, superweapon, civilization, economic, diplomatic, exploration, colonization, communication, surveillance, terraforming, ecological, temporal, and dimensional forge.

> **Source:** `client/src/pages/MegaStructures.tsx`

### Interstellar Page

Interstellar travel interface with stargate network, FTL drive selection, wormhole navigation, and route calculation. Displays destinations, travel costs, and navigation hazards.

> **Source:** `client/src/pages/Interstellar.tsx`

### CelestialBrowser Page

Browsing interface for all celestial objects (planets, stars, moons, asteroids, etc.) with filtering and navigation to detail pages.

> **Source:** `client/src/pages/CelestialBrowser.tsx`

### WarpNetwork Page

Warp gate management and trade route visualization. Shows gate ownership, energy costs, cooldowns, linked networks, and wormhole routes.

> **Source:** `client/src/pages/WarpNetwork.tsx`

---

## Server Services

### Universe Seed Service

Manages per-user deterministic universe seeds with system/sector/galaxy generation:

```typescript
class UniverseSeedService {
  static getSeedForUser(userId): Promise<UniverseSeedSetting>
  static setSeedForUser(userId, seed): Promise<UniverseSeedSetting>
  static resetSeedForUser(userId): Promise<UniverseSeedSetting>
  static getConfigForUser(userId): Promise<{selected, defaults, limits, functions}>
  static generateSystem(seed, galaxy, sector, system): UniverseSeedSystem
  static generateSectorPreview(seed, galaxy, sector, limit): UniverseSeedSectorPreview
  static generateGalaxySummary(seed, galaxy, sectorCount, systemsPerSector): UniverseSeedGalaxySummary
}
```

Features:
- FNV-1a hashing for seed normalization
- Deterministic star type selection via cumulative probability distribution
- Planet type selection from `UNIVERSE_CONFIG.generation.planetTypeDistribution`
- Habitability inference based on planet type and temperature
- Procedural name generation from prefix/suffix syllable pools

> **Source:** `server/services/universeSeedService.ts`

---

## Resource Distribution

### Star Type Resource Multipliers

| Star | Metal | Crystal | Deuterium | Energy |
|---|---|---|---|---|
| O | 0.5 | 2.0 | 3.0 | 5.0 |
| B | 0.7 | 1.8 | 2.5 | 4.0 |
| A | 0.9 | 1.5 | 2.0 | 3.0 |
| F | 1.0 | 1.2 | 1.5 | 2.0 |
| G | 1.0 | 1.0 | 1.0 | 1.0 |
| K | 1.2 | 0.9 | 0.8 | 0.7 |
| M | 1.5 | 0.7 | 0.6 | 0.5 |

### Orbit Position Resource Multipliers

| Position | Metal | Crystal | Deuterium | Energy |
|---|---|---|---|---|
| Inner | 1.5 | 1.2 | 0.5 | 2.0 |
| Habitable | 1.0 | 1.0 | 1.0 | 1.0 |
| Outer | 0.7 | 1.3 | 2.0 | 0.5 |

> **Source:** `shared/config/universeConfig.ts:164-179`

### Special Objects

| Object | Chance | Notes |
|---|---|---|
| Black Hole | 0.1% | Mass 3–1 billion M☉ |
| Neutron Star | 0.5% | Mass 1.4–3 M☉, 30% pulsar |
| White Dwarf | 2% | Mass 0.5–1.4 M☉ |
| Nebula | 1% | 5 types (emission, reflection, dark, planetary, supernova remnant) |
| Wormhole | 0.01% | Unstable by default |
| Dyson Structure | 0.001% | Swarm, ring, sphere |

> **Source:** `shared/config/universeConfig.ts:136-162`

---

**Last Updated:** 2026-06-18
**Version:** 2.0.0
**Status:** Comprehensive documentation with source file links
