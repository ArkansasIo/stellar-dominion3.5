# Interstellar Travel

The interstellar travel system provides galaxy-wide movement through stargates, jumpgates, wormholes, FTL drives, and warp networks. Players navigate a multi-galaxy universe using advanced propulsion technologies and ancient gateway infrastructure.

> **Source:** `shared/config/interstellarTravelConfig.ts`
> **Source:** `shared/config/navigationConfig.ts`
> **Source:** `shared/config/universeConfig.ts`
> **Source:** `server/routes-travel.ts`
> **Source:** `client/src/pages/Interstellar.tsx`
> **Source:** `client/src/pages/WarpNetwork.tsx`
> **Source:** `client/src/lib/warpNetwork.ts`
> **Source:** `client/src/lib/interstellarData.ts`

---

## Travel Methods

### 1. Sublight (Impulse)
- Used for local system travel (planet to moon, planet to debris field)
- Slow but energy-efficient
- No deuterium cost for intra-system movement

### 2. FTL (Warp/Hyperspace)
- Used for interstellar and intergalactic travel
- Consumes **Deuterium** based on distance and drive efficiency
- Speed depends on equipped FTL drive class
- Distance calculated using 3D coordinates across galaxy/sector/system axes

### 3. Jump Gates (Player-Built)
- Instant travel between two owned or linked gates
- **Cooldown**: 300 seconds between jumps
- **Deuterium cost**: Scaled by gate level and jump distance
- Gates can be claimed, upgraded, and linked into networks

### 4. Stargate Network (Ancient)
- Ancient network of 9-symbol coordinate addresses
- Instant travel to specific secret coordinates or event locations
- **Deuterium cost**: 5,000 per dial
- Requires finding Glyph Sequences (Artifacts) or knowing valid addresses
- Connected gates form a mesh network across galaxies

### 5. Wormholes (Natural Phenomena)
- Naturally occurring shortcuts between distant locations
- Variable stability (0-100%), size, and danger level
- Some are one-way, seasonal, or require specific ship sizes
- Entry and exit coordinates are fixed but traversal has hazard checks

---

## Coordinate System

The universe uses a hierarchical coordinate system:

```
[galaxy:sector:system]
```

| Parameter | Range | Description |
|-----------|-------|-------------|
| Galaxy | 1-256 | Major galactic cluster |
| Sector | 1-64 | Region within a galaxy |
| System | 1-128 | Individual star system |
| Planet | 1-15 | Body within a system |

Example: `1:102:8` = Galaxy 1, Sector 102, System 8

> **Source:** `shared/config/universeConfig.ts` — `UNIVERSE_CONFIG.size`

---

## Universe Parameters

| Parameter | Value |
|-----------|-------|
| Total Galaxies | 256 |
| Sectors per Galaxy | 64 |
| Systems per Sector | 128 |
| Planets per System | 0-15 |
| Moons per Planet | 0-82 |
| Asteroid Belt Chance | 30% |
| Comet Chance | 10% |
| Wormhole Spawn Chance | 0.01% |
| Black Hole Chance | 0.1% |

Star type distribution follows realistic proportions: 76.5% M-class (Red Dwarf), 12.1% K-class, 7.6% G-class, with rare O/B/A types at 0.003%-0.6%.

> **Source:** `shared/config/universeConfig.ts` — `UNIVERSE_CONFIG.generation`

---

## Stargate System

Ancient gate infrastructure providing instant intergalactic travel.

### Existing Stargates

| Gate | Location | Diameter | Efficiency | Travel Time |
|------|----------|----------|------------|-------------|
| Alpha Gate | 1:1:1 | 1,000 km | 95% | 5 turns |
| Beta Gate | 1:50:100 | 900 km | 92% | 4 turns |
| Gamma Gate | 2:1:1 | 1,100 km | 98% | 6 turns |
| Delta Gate | 1:200:500 | 800 km | 88% | 3 turns |

### Stargate Properties
- **Max Travel Distance**: 1,000,000 light-years (effectively unlimited)
- **Max Ship Size**: Unlimited
- **Connected Gates**: Form a mesh network (Alpha <-> Beta, Alpha <-> Gamma, Beta <-> Delta)
- **Construction**: Built by "Ancient Ancients" ~10 million years ago

### Stargate Dialing (Client)
The `Interstellar.tsx` page provides a stargate dialing interface:
- Enter a 9-symbol address (format: `galaxy-sector-system`)
- Matches against known gate addresses from `/api/travel/stargates`
- Special address `777` triggers an unknown sector jump
- Costs 5,000 deuterium per dial

> **Source:** `shared/config/interstellarTravelConfig.ts` — `STARGATES[]`
> **Source:** `client/src/pages/Interstellar.tsx` — `handleStargateDial()`

---

## FTL Drive System

Technology-based faster-than-light propulsion systems.

### Drive Classes

| Drive | Class | Max Speed | Fuel Efficiency | Jump Range | Tech Required |
|-------|-------|-----------|----------------|------------|---------------|
| Standard FTL | Civilian | 10 LY/turn | 5 LY/unit | 50 LY | Level 5 |
| Military FTL | Military | 25 LY/turn | 3 LY/unit | 200 LY | Level 15 |
| Experimental FTL | Experimental | 50 LY/turn | 2 LY/unit | 500 LY | Level 25 |
| Ancient FTL | Ancient | 100 LY/turn | 10 LY/unit | 1,000 LY | Level 50 |

### Drive Capabilities

| Feature | Standard | Military | Experimental | Ancient |
|---------|----------|----------|--------------|---------|
| Known Coordinate Jumps | Yes | Yes | Yes | Yes |
| Blind Jumps | No | Yes | Yes | Yes |
| Warp Bubble | No | Yes | Yes | Yes |
| Stealth | No | Yes | Yes | Yes |
| Tow Vessels | No | Yes | No | Yes |
| Failure Rate | 2% | 1% | 5% | 0% |

### Travel Time Calculation

```
travelTime = ceil(distance / drive.maxSpeed)
```

Without FTL: 1 turn per light-year.

### Travel Cost Calculation

```
jumpsNeeded = ceil(distance / drive.jumpRange)
deuterium = jumpsNeeded * drive.deuteriumPerJump
energy = jumpsNeeded * drive.powerRequired
```

> **Source:** `shared/config/interstellarTravelConfig.ts` — `FTL_DRIVES[]`, `calculateTravelTime()`, `calculateTravelCost()`

---

## Wormhole System

Natural spatial phenomena connecting distant locations.

### Known Wormholes

| Wormhole | Entrance | Exit | Stability | Travel Time | Difficulty |
|----------|----------|------|-----------|-------------|------------|
| Tau-1 | 1:75:250 | 1:125:750 | 85% | 8 turns | Hard |
| Omega Rift | 2:200:400 | 3:1:1 | 65% | 20 turns | Expert |

### Wormhole Properties
- **Entrance/Exit Coordinates**: Fixed 3D positions
- **Diameter**: 480-800 km at entrance, varies at exit
- **Max Ship Size**: 30,000-50,000 hull points
- **Min Ship Size**: 1,000-5,000 hull points
- **Energy Requirement**: 500-1,500 deuterium
- **Piloting Skill Required**: 60-85
- **Expected Casualties**: 5-25%

### Special Properties
- **One-Way**: Some wormholes only traverse in one direction
- **Seasonal**: Some only passable during specific turn windows
- **Hazards**: Tidal forces, radiation, dimensional shearing, ship deformation
- **Rewards**: Rare isotopes, ancient artifacts, exotic matter samples

> **Source:** `shared/config/interstellarTravelConfig.ts` — `WORMHOLES[]`

---

## Warp Network

Player-managed network of warp gates and automated trade routes.

### Warp Gate Mechanics

| Gate | Coordinates | Level | Energy Cost | Cooldown |
|------|-------------|-------|-------------|----------|
| Homeworld Gate | 1:102:8 | 10 | 500 | 300s |
| Alpha Centauri Gate | 1:102:9 | 8 | 800 | 300s |
| Sirius Gate | 1:105:4 | 6 | 1,200 | 300s |
| Proxima Station Gate | 1:110:2 | 9 | 600 | 300s |
| Nebula Gate | 2:040:1 | 5 | 2,000 | 300s |
| Outpost Gate | 1:001:1 | 4 | 1,500 | 300s |

### Warp Time Formula
```
warpTime = max(60, 300 - (gateLevel * 20) + (distance * 10)) seconds
```

### Warp Cost Formula
```
warpCost = ceil(500 * (1 + (distance / 100))) deuterium
```

### Trade Routes
Automated resource trading between connected locations:

| Route | Resource | Profit | Risk | Frequency |
|-------|----------|--------|------|-----------|
| 1:102:8 -> 1:105:4 | Metal | +25% | 2/10 | 1h |
| 1:105:4 -> 1:110:2 | Crystal | +40% | 4/10 | 2h |
| 1:110:2 -> 1:102:8 | Deuterium | +35% | 3/10 | 1h |
| 1:102:8 -> 2:040:1 | Metal | +100% | 9/10 | 4h |

### Network Management
- **Claim unowned gates** to expand your network
- **Optimize routes** to reduce risk and increase frequency
- **Connect gates** into efficient travel clusters
- **Monitor statistics**: active routes, total profit, average risk, network efficiency

> **Source:** `client/src/lib/warpNetwork.ts` — `WARP_GATES[]`, `TRADE_ROUTES[]`
> **Source:** `client/src/pages/WarpNetwork.tsx`

---

## Navigation & Hazards

### Celestial Object Types
`star`, `planet`, `moon`, `asteroid`, `nebula`, `blackhole`, `station`, `debris`, `anomaly`

### Star Classes
| Class | Color | Temp (K) | Mass | Rarity |
|-------|-------|----------|------|--------|
| O | Blue | 30,000 | 60 | Legendary |
| B | Blue-White | 10,000 | 18 | Rare |
| A | White | 7,500 | 3.2 | Uncommon |
| F | Yellow-White | 6,000 | 1.6 | Uncommon |
| G | Yellow | 5,500 | 1.0 | Common |
| K | Orange | 3,700 | 0.78 | Common |
| M | Red | 2,400 | 0.51 | Common |

### Navigation Hazards

| Hazard | Base Damage | Shield Drain | Difficulty | Avoidable |
|--------|-------------|--------------|------------|-----------|
| Radiation | 2 | 5 | 20 | Yes |
| Solar Flare | 10 | 15 | 40 | No |
| Asteroid Field | 5 | 0 | 30 | Yes |
| Cosmic Storm | 15 | 20 | 60 | No |
| Dimensional Anomaly | 20 | 25 | 80 | No |
| Pirate Activity | 0 | 0 | 10 | Yes |
| Starfield Effect | 50 | 50 | 100 | No |
| Gravity Well | 10 | 10 | 35 | Yes |
| Ion Storm | 12 | 18 | 45 | No |

### Navigation Difficulty Formula
```
difficulty = 10 + (sum of hazard difficulties * severity) + min(20, distance/1000) - pilotSkill/5
```

> **Source:** `shared/config/navigationConfig.ts`

---

## Destinations Catalog

Pre-defined interstellar destinations with properties:

| ID | Name | Coords | Distance | Danger | Type |
|----|------|--------|----------|--------|------|
| sol_earth | Earth (Sol) | 1:1:100:3 | 0 ly | Low | Colony |
| homeworld | Homeworld | 1:102:8 | 0.5 ly | Low | Colony |
| alpha_centauri | Alpha Centauri Outpost | 1:102:9 | 4.3 ly | Low | Colony |
| sirius_b | Sirius Mining Belt | 1:105:4 | 8.6 ly | Medium | Asteroid |
| proxima | Proxima Station | 1:110:2 | 12.5 ly | Low | Station |
| orion_nebula | Orion Nebula | 2:040:1 | 1,344 ly | High | Nebula |
| cygnus_x1 | Cygnus Black Hole | 4:200:15 | 6,000 ly | Extreme | Black Hole |
| nova_gate | Nova Gate | 2:250:3 | 2,300 ly | High | Gate |

> **Source:** `client/src/lib/interstellarData.ts` — `DESTINATIONS[]`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel/stargates` | List all stargates with connection info |
| GET | `/api/travel/wormholes` | List wormholes, optional nearby filter |
| GET | `/api/travel/ftl-drives` | List FTL drives, filterable by class/tech level |
| POST | `/api/travel/route/calculate` | Calculate travel time, cost, and route |
| GET | `/api/travel/player/state` | Get player's active route and travel log |
| POST | `/api/travel/player/route` | Register and start a new travel route |

### Route Calculation Request
```json
{
  "from": { "galaxy": 1, "sector": 102, "system": 8, "x": 0, "y": 0, "z": 0 },
  "to": { "galaxy": 2, "sector": 40, "system": 1, "x": 0, "y": 0, "z": 0 },
  "method": "warp",
  "ftlDriveId": "ftl-military"
}
```

### Route Calculation Response
```json
{
  "distance": 1344,
  "travelTime": 54,
  "travelCost": { "deuterium": 300, "energy": 3000 },
  "route": { "id": "route-...", "name": "...", "danger": 13 }
}
```

> **Source:** `server/routes-travel.ts`

---

## Client Pages

### Interstellar Page (`Interstellar.tsx`)
- **Gallery Tab**: Browse all destinations with distance, type, and danger level; click to visit instantly
- **Hyperspace Tab**: Flight computer for calculating jump vectors; select target, preview cost/time, engage hyperdrive
- **Jump Gate Tab**: View and activate jump gates for instant travel between owned gates
- **Stargate Tab**: Dial 9-symbol addresses for ancient stargate network travel
- Shows current location, fuel reserves, and route preview with danger indicators

### Warp Network Page (`WarpNetwork.tsx`)
- **Warp Gates Tab**: Manage owned and unclaimed gates; claim, upgrade, and initiate jumps
- **Trade Routes Tab**: Activate and optimize automated trading routes for profit
- **Wormholes Tab**: Stabilize and route fleets through wormhole connections
- Dashboard with statistics: owned gates, active routes, total profit, average risk, network efficiency, wormhole metrics, and frontier links

> **Source:** `client/src/pages/Interstellar.tsx`
> **Source:** `client/src/pages/WarpNetwork.tsx`
