# Celestial Service — `celestialService.ts`

## Overview

Handles discovery, ownership, and marketplace trading of celestial bodies (planets, moons, asteroids, gas giants, specials).

---

## Celestial Search

### `searchCelestial(playerId, coordinates, scanType) → CelestialResult`

Primary function for discovering new celestial bodies.

```typescript
interface CelestialResult {
  celestialBody: CelestialBody | null;
  isNewDiscovery: boolean;
  cooldownExpires: Date | null;
}

interface CelestialBody {
  id: string;
  coordinates: Coordinates;
  type: 'planet' | 'moon' | 'asteroid' | 'gas_giant' | 'special';
  name: string;
  size: number;
  temperature: number;
  resources: ResourceBonuses; // Production % bonuses per resource
  slots: number;             // Building slots
  fields: number;            // Available construction fields
  ownerId: string | null;
  isListed: boolean;
  specialProperties: string[]; // e.g. 'gaia', 'toxic', 'barren', 'crystal_rich'
}
```

**Internal sub-steps:**

#### `isOnCooldown(playerId, coordinates, scanType) → boolean`

```
cooldownDuration = {
  basic: 3600 * 1000,     // 1 hour
  deep:  3600 * 24 * 1000, // 24 hours
}
lastScan = getLastScan(playerId, coordinates)
return now - lastScan.timestamp < cooldownDuration[scanType]
```

- Scan cooldown is per-player, per-coordinate, per-scanType
- Using a `Deep Scan Probe` item bypasses cooldown

#### `generateCelestialBody(coordinates) → CelestialBody`

Deterministic generation using seeded RNG:

```
seed = hash(coordinates.x, coordinates.y, coordinates.z)
rng = seededRandom(seed)

celestial.type = rollType(rng)
celestial.size = rollSize(rng, celestial.type)
celestial.temperature = rollTemperature(rng, coordinates.z)
celestial.resources = generateResources(rng, celestial.type)
celestial.slots = calculateSlots(celestial.size)
celestial.fields = calculateFields(celestial.size)
celestial.specialProperties = rollSpecials(rng)
```

- Same coordinates always generate same celestial body (deterministic)
- Type weights: planet 60%, moon 15%, asteroid 15%, gas_giant 8%, special 2%
- Special bodies (gaia, paradise, artifact worlds) are rare (2%)

#### `addToKnownPlanets(playerId, celestialBody) → void`

Stores the discovered body in the player's known planets list. Does NOT grant ownership — only visibility.

#### `setScanCooldown(playerId, coordinates, scanType, 24h) → void`

Records the cooldown expiry timestamp for the given scan.

---

## Discovered Celestials

### `getDiscovered(playerId) → KnownPlanet[]`

```typescript
interface KnownPlanet extends CelestialBody {
  isOwned: boolean;
  isClaimable: boolean;
  marketplaceStatus: 'none' | 'listed' | 'sold' | 'expired';
  listingPrice?: number;
}
```

Returns all celestial bodies the player has discovered, filtered by:
- Bodies the player scanned directly
- Bodies shared by alliance members
- Public system scan results (capital system always visible)

---

## Claim Celestial

### `claimCelestial(playerId, celestialId) → ClaimResult`

```typescript
interface ClaimResult {
  success: boolean;
  colonyId?: string;
  cost: ResourceCost;
  error?: string;
}
```

**Logic:**
1. Check `celestial.ownerId === null` (unclaimed)
2. Check player has available colony slots (max colonies = `5 + colonizationTechLevel`)
3. Calculate claim cost:
   ```
   cost.credits = 1000 × (1 + distanceFromCapital × 0.1)
   cost.metal  = 500 × planet.size / 10
   ```
4. Deduct resources from player via `resourceTransaction`
5. Set `celestial.ownerId = playerId`
6. Create initial colony with basic buildings (command center, storage)
7. Return success

---

## Takeover Celestial

### `takeoverCelestial(playerId, celestialId, fleetId) → TakeoverResult`

```typescript
interface TakeoverResult {
  success: boolean;
  combatReport: CombatReport | null;
  fleetDamage: number;
  ownershipTransferred: boolean;
}
```

**Requirements:**
- Fleet must be at the celestial's coordinates (or in orbit)
- Celestial must be owned by another player
- Fleet must have ground assault capability (marines, troops)

**Combat:**
1. Planetary defenses fire on incoming fleet (simplified calculation)
   ```
   defenseDamage = sum(defenseTurret.attack × defenseTurret.count)
   fleetDefense = sum(ship.hull × ship.count) × 0.1
   ```
2. Fleet takes `defenseDamage - fleetDefense` damage (min 0)
3. If fleet survives (operational ships > 0), ownership transfers
4. Planetary defenses are destroyed on successful takeover
5. Buildings remain intact (70% chance per building)
6. Full combat report returned

---

## Marketplace: List Celestial

### `listCelestial(playerId, celestialId, price) → ListingResult`

```typescript
interface ListingResult {
  success: boolean;
  listingId: string;
  fee: number;
  expiresAt: Date;
}
```

**Logic:**
1. Verify `celestial.ownerId === playerId`
2. Check celestial not already listed
3. Calculate listing fee: `listingFee = price × 0.02` (2% flat fee)
4. Deduct fee from player's credits
5. Create marketplace listing with 7-day expiry
6. Set `celestial.isListed = true`

---

## Marketplace: Buy Celestial

### `buyCelestial(buyerId, listingId) → BuyResult`

```typescript
interface BuyResult {
  success: boolean;
  transaction: TransactionResult;
  newOwnerId: string;
}
```

**Logic:**
1. Verify listing is active (not expired/sold)
2. Verify buyer has sufficient credits
3. Check buyer has available colony slots
4. Transfer credits from buyer → seller (minus 5% marketplace fee)
5. Transfer celestial ownership: `celestial.ownerId = buyerId`
6. Remove listing from marketplace
7. Set `celestial.isListed = false`
8. Log full transaction record

---

## Marketplace: Cancel Listing

### `cancelListing(playerId, listingId) → CancelResult`

```typescript
interface CancelResult {
  success: boolean;
  refundAmount: number;
  penaltyAmount: number;
}
```

**Logic:**
1. Verify listing's seller matches `playerId`
2. Calculate penalty: `penalty = listingFee × 0.5` (50% of original fee)
3. Refund remaining: `refund = listingFee - penalty`
4. Remove listing
5. Set `celestial.isListed = false`

---

## Marketplace: Get Listings

### `getMarketListings(filters) → MarketplaceListing[]`

```typescript
interface MarketplaceFilters {
  type?: CelestialType[];
  minPrice?: number;
  maxPrice?: number;
  galaxy?: number;
  sortBy?: 'price' | 'size' | 'date';
  page: number;
  limit: number;
}

interface MarketplaceListing {
  listingId: string;
  celestial: CelestialBody;
  sellerId: string;
  sellerName: string;
  price: number;
  listedAt: Date;
  expiresAt: Date;
}
```

- Pagination: default 20 per page, max 100
- Expired listings auto-removed on query
- Results cached for 60 seconds

---

## Scan Cooldowns

### `getSearchCooldowns(playerId) → Cooldown[]`

```typescript
interface Cooldown {
  coordinates: Coordinates;
  scanType: 'basic' | 'deep';
  expiresAt: Date;
  remainingMs: number;
}
```

Returns all active scan cooldowns for the player. Cooldowns are per-coordinate, per-type.

**Cooldown rules:**
- `basic` scan: 1 hour cooldown
- `deep` scan: 24 hours cooldown
- Cooldown shared across all alliance members (alliance scanning limit)
- Using `Advanced Scanner` item: reduces cooldown by 50%
- Building a `Scan Array` on a planet: -10% cooldown per level
