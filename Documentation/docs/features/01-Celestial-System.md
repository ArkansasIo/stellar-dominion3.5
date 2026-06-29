# Celestial Body System

## Overview

The celestial body system allows players to discover, claim, take over, and trade planets and moons across the galaxy. It encompasses scanning mechanics, ownership mechanics, combat resolution, and a player-driven marketplace.

---

## 1. Celestial Body Types

| Type | Description | Subtypes |
|------|-------------|----------|
| **Planet** | Discoverable celestial body; distinct from colony planets (which are built). Can be claimed and developed. | Terran, Barren, Gas Giant, Ice, Desert, Volcanic, Ocean, Lush |
| **Moon** | Orbits a planet. Smaller size, lower resource yield, but faster development. | Rocky, Ice, Volcanic, Subterranean |

**Key distinction:** Colony planets are constructed by players via buildings. Celestial planets/moons are pre-existing bodies discovered through scanning.

---

## 2. Discovery Mechanics

### Scanning Probes

Players construct and deploy scanning probes to specific coordinates `(x, y, z)`.

```
probe_cost = 100 credits + 50 deuterium
probe_build_time = 300 seconds
probe_range = base_range × (1 + scanning_tech_level × 0.15)
```

### Scan Resolution

Upon probe arrival at coordinates:

1. If a celestial body exists at coordinates → body is revealed and added to player's `knownPlanets`
2. If no body exists → "No celestial body found" result
3. Discovery radius: `scanRadius = probe_power × 5` (celestial units)

### Per-Target Cooldown

Each set of coordinates has a **24-hour cooldown** per target. Once scanned (success or failure), those coordinates cannot be re-scanned until the cooldown expires.

---

## 3. Search Cooldown System

### `scanCooldowns` Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `playerId` | UUID | FK to players |
| `scanType` | ENUM | `'probe'`, `'deep_scan'`, `'survey'` |
| `targetCoordinates` | JSONB | `{x, y, z}` |
| `expiresAt` | TIMESTAMPTZ | When cooldown ends |
| `createdAt` | TIMESTAMPTZ | When scan was initiated |

### Cooldown Logic

```
on ScanAttempt(coordinates):
    if existsActiveCooldown(playerId, coordinates, scanType):
        reject("Cooldown active. Expires at: {expiresAt}")
    else:
        insert scanCooldown { playerId, scanType, coordinates, expiresAt: now + 24h }
        executeScan(coordinates)
```

### Cooldown Cleanup

A background job runs every hour, deleting expired cooldowns via:

```sql
DELETE FROM scanCooldowns WHERE expiresAt < NOW();
```

---

## 4. Claiming Celestial Bodies

Only the first player to discover a body may claim it (before anyone else can take it over).

### Claim Requirements

- Player must have the body in their `knownPlanets`
- Player must have sufficient resources
- No existing claim or ownership

### Claim Cost Formula

```
claimCost = baseCost × planetSize × difficultyMultiplier
```

| Variable | Description |
|----------|-------------|
| `baseCost` | Base resource cost (e.g., 1000 credits, 500 minerals) |
| `planetSize` | Size class multiplier (Small=1.0, Medium=1.5, Large=2.5, Huge=4.0) |
| `difficultyMultiplier` | Realm difficulty factor (Beginner=0.8, Intermediate=1.0, Advanced=1.3, Veteran=1.6) |

### Claim Effect

On successful claim:
- `ownerId` set on celestial body record
- Construction queue unlocked for body
- Planetary defenses initialized at base level
- Discovery reward granted to claiming player

---

## 5. Takeover Mechanics

To take over another player's celestial body, an attacking fleet must be present at the body's coordinates.

### Requirements

- Fleet at target coordinates
- Fleet has attack capability (>0 total attack power)
- Target body is owned by another player
- Body is not under a protection period (new claim: 48h protection)

### Combat Resolution

Simple simulated combat — no real-time battle animation.

```
attackPower = fleetPower × (1 + techBonus)
defensePower = celestialDefense × (1 + garrisonBonus)
```

| Variable | Source |
|----------|--------|
| `fleetPower` | Sum of all ship attack stats in fleet |
| `techBonus` | Attack technology level × 0.05 |
| `celestialDefense` | Base defense + turrets + shield generators |
| `garrisonBonus` | Garrisoned ship defense contribution × 0.02 |

### Takeover Success Roll

```
attackRoll = random(0, attackPower)
defenseRoll = random(0, defensePower)

success = attackRoll > defenseRoll
```

If `success = true`: ownership transfers to attacker. If `success = false`: attacker fleet takes damage, defender gets notified.

### Fleet Damage on Failed Attempt

```
damagePercent = (defenseRoll - attackRoll) / defenseRoll
fleetLoss = fleetShips × min(damagePercent, 0.75)
```

On **successful** takeover, attacker loses 25% of fleet (cost of conquest).

---

## 6. Celestial Marketplace

Players may list claimed celestial bodies for sale on the galactic marketplace.

### Listing a Body

```
listingFee = baseListingFee + planetTier × 500 credits
listingDuration = 7 days (configurable: 1, 3, 7, 14, 30 days)
```

| Field | Description |
|-------|-------------|
| `sellerId` | Current owner |
| `celestialBodyId` | FK to celestial body |
| `price` | { credits, minerals, deuterium } — seller-defined |
| `listingFee` | Non-refundable listing cost |
| `listingDuration` | How long listing remains active |
| `listedAt` | Timestamp of listing |
| `expiresAt` | Auto-expiration timestamp |

### Buy Mechanics

1. Buyer initiates purchase
2. System escrows buyer's payment
3. Ownership transfers from seller to buyer
4. Seller receives payment (minus 5% market tax)
5. Listing is removed
6. Body's protection period resets (48h for new owner)

### Pricing Formula (Suggested Price)

```
suggestedPrice = baseValue × typeMultiplier × resourceMultiplier × locationMultiplier × improvementMultiplier

baseValue      = 5000 credits
typeMultiplier = {Terran: 2.0, Lush: 1.8, Ocean: 1.5, Barren: 0.8, Gas: 0.6, ...}
resourceMultiplier = 1 + (rareResources / 10) + (commonResources / 20)
locationMultiplier = 1 + (proximityToHub / 100) × 0.5
improvementMultiplier = 1 + buildingCount × 0.05 + defenseLevel × 0.1
```

### Cancel Listing

```
on CancelListing(listing):
    refund = listingFee × 0.7   // 30% cancellation penalty
    seller.refund(refund)
    listing.remove()
```

---

## 7. Known Planets Storage

Each player's discovered planets are stored as a JSONB array in `playerStates.knownPlanets`.

### Schema

```json
{
  "knownPlanets": [
    {
      "celestialBodyId": "uuid",
      "discoveredAt": "2026-06-28T12:00:00Z",
      "coordinates": { "x": 123, "y": 456, "z": 789 },
      "name": "Kepler-442b",
      "type": "Terran",
      "size": "Medium",
      "claimed": false
    }
  ]
}
```

---

## 8. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/celestial/list` | List discoverable bodies in range |
| `POST` | `/api/celestial/search` | Deploy scan probe to coordinates |
| `POST` | `/api/celestial/claim` | Claim a discovered body |
| `POST` | `/api/celestial/takeover` | Initiate fleet takeover |
| `POST` | `/api/celestial/list-market` | List a body for sale |
| `POST` | `/api/celestial/buy` | Purchase a listed body |
| `POST` | `/api/celestial/cancel-listing` | Cancel marketplace listing |
| `GET` | `/api/celestial/cooldowns` | Get active scan cooldowns |
| `GET` | `/api/celestial/market` | View marketplace listings |
| `GET` | `/api/celestial/known` | Get player's known planets |
