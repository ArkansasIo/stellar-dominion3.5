# Celestial API

Endpoints for discovering, searching, claiming, and trading celestial bodies in the Universe Civilization universe.

---

## Authentication

All endpoints marked **Auth: required** must include a valid JWT bearer token:

```
Authorization: Bearer <token>
```

---

## GET /api/celestial/discovered

List all celestial bodies the player has discovered.

### Query Parameters

| Field    | Type   | Required | Default | Description                                      |
|----------|--------|----------|---------|--------------------------------------------------|
| page     | number | No       | 1       | Page number for pagination                       |
| limit    | number | No       | 20      | Items per page (max 100)                         |
| type     | string | No       | —       | Filter by type: `planet` or `moon`               |
| galaxy   | number | No       | —       | Filter by galaxy ID                              |
| system   | number | No       | —       | Filter by system ID                              |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/celestial/discovered?page=1&limit=20&type=planet&galaxy=3"
```

### Response Schema

```json
{
  "celestials": [
    {
      "id": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f",
      "type": "planet",
      "galaxy": 3,
      "system": 142,
      "planet": 4,
      "name": "Proxima IV",
      "planetType": "terran",
      "diameter": 12800,
      "temperature": 22,
      "resources": {
        "metal": { "base": 450, "bonus": 0, "total": 450 },
        "crystal": { "base": 280, "bonus": 15, "total": 295 },
        "deuterium": { "base": 180, "bonus": 0, "total": 180 }
      },
      "isClaimed": true,
      "claimedBy": "player-uuid",
      "claimedAt": "2026-06-15T10:30:00Z",
      "imageUrl": "https://assets.universe-civ.com/celestial/terran_4.png"
    }
  ],
  "total": 47,
  "page": 1,
  "limit": 20
}
```

### Status Codes

| Code | Description      |
|------|------------------|
| 200  | Success          |
| 401  | Unauthorized     |

---

## POST /api/celestial/search

Search for a celestial body at specific galaxy/system/planet coordinates. Triggers a 24-hour cooldown on the target system.

### Request Body

```json
{
  "galaxy": 3,
  "system": 142,
  "planet": 4,
  "type": "planet"
}
```

| Field   | Type   | Required | Description                   |
|---------|--------|----------|-------------------------------|
| galaxy  | number | Yes      | Galaxy ID (1–9)               |
| system  | number | Yes      | System ID (1–499)             |
| planet  | number | Yes      | Planet slot (1–15)            |
| type    | string | Yes      | `planet` or `moon`            |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"galaxy": 3, "system": 142, "planet": 4, "type": "planet"}' \
  "https://api.universe-civ.com/api/celestial/search"
```

### Response Schema (200)

```json
{
  "celestial": {
    "id": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f",
    "type": "planet",
    "galaxy": 3,
    "system": 142,
    "planet": 4,
    "name": "Proxima IV",
    "planetType": "terran",
    "diameter": 12800,
    "temperature": 22,
    "resources": { "metal": 450, "crystal": 295, "deuterium": 180 },
    "isClaimed": false
  },
  "isNewDiscovery": true,
  "cooldownExpires": "2026-06-29T10:30:00Z"
}
```

### Error Responses

**400 — On Cooldown**

```json
{
  "error": "on_cooldown",
  "message": "This system is on scan cooldown. Try again after 2026-06-29T10:30:00Z.",
  "cooldownExpires": "2026-06-29T10:30:00Z"
}
```

**401 — Unauthorized**

```json
{
  "error": "unauthorized",
  "message": "Authentication required."
}
```

**404 — Invalid Coordinates**

```json
{
  "error": "invalid_coordinates",
  "message": "No celestial body found at galaxy 3, system 999, planet 4."
}
```

### Status Codes

| Code | Description        |
|------|--------------------|
| 200  | Discovery result   |
| 400  | On cooldown        |
| 401  | Unauthorized       |
| 404  | Invalid coordinates|

---

## POST /api/celestial/:id/claim

Claim a discovered but unclaimed celestial body. Costs resources based on planet type and size.

### Path Parameters

| Field | Type   | Description                     |
|-------|--------|---------------------------------|
| id    | string | UUID of the celestial body      |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/celestial/c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f/claim"
```

### Response Schema (200)

```json
{
  "celestial": {
    "id": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f",
    "isClaimed": true,
    "claimedBy": "player-uuid",
    "claimedAt": "2026-06-28T10:30:00Z"
  },
  "resourcesSpent": {
    "credits": 5000,
    "metal": 2000,
    "crystal": 1500,
    "deuterium": 500
  }
}
```

### Error Responses

**400 — Already Claimed**

```json
{
  "error": "already_claimed",
  "message": "This celestial body has already been claimed.",
  "claimedBy": "other-player-uuid",
  "claimedAt": "2026-06-20T14:00:00Z"
}
```

**400 — Insufficient Resources**

```json
{
  "error": "insufficient_resources",
  "message": "You need 5000 credits, 2000 metal, 1500 crystal, 500 deuterium to claim this planet.",
  "deficit": { "credits": 1200, "metal": 0, "crystal": 0, "deuterium": 0 }
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Claim successful         |
| 400  | Already claimed / insufficient resources |
| 401  | Unauthorized             |

---

## POST /api/celestial/:id/takeover

Attempt to take over an already-claimed celestial body by force. Requires a fleet to be dispatched to the target.

### Path Parameters

| Field | Type   | Description                     |
|-------|--------|---------------------------------|
| id    | string | UUID of the celestial body      |

### Request Body

```json
{
  "fleetId": "f8b2e3d4-5c6a-7b8d-9e0f-1a2b3c4d5e6f"
}
```

| Field   | Type   | Required | Description                        |
|---------|--------|----------|------------------------------------|
| fleetId | string | Yes      | UUID of the attacking fleet        |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"fleetId": "f8b2e3d4-5c6a-7b8d-9e0f-1a2b3c4d5e6f"}' \
  "https://api.universe-civ.com/api/celestial/c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f/takeover"
```

### Response Schema (200)

```json
{
  "success": true,
  "combatReport": {
    "id": "cr-9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    "attacker": { "id": "player-uuid", "name": "CaptainProxima" },
    "defender": { "id": "defender-uuid", "name": "LordXandar" },
    "target": { "id": "c7a9f1d2-...", "name": "Proxima IV" },
    "rounds": [
      {
        "round": 1,
        "attackerShips": { "lightFighter": 50, "cruiser": 10 },
        "defenderShips": { "heavyFighter": 20, "destroyer": 5 },
        "attackerLosses": { "lightFighter": 5 },
        "defenderLosses": { "heavyFighter": 3 },
        "attackerDamage": 8500,
        "defenderDamage": 3200
      }
    ],
    "outcome": "attacker_victory",
    "attackerLosses": { "lightFighter": 12, "cruiser": 1 },
    "defenderLosses": { "heavyFighter": 8, "destroyer": 2 },
    "loot": { "metal": 15000, "crystal": 8000, "deuterium": 3000 },
    "debrisField": { "metal": 4500, "crystal": 2200 },
    "duration": 45,
    "fledShips": { "defender": { "lightFighter": 2 } }
  }
}
```

### Error Responses

**400 — Invalid Fleet**

```json
{
  "error": "invalid_fleet",
  "message": "Fleet not found or does not belong to you."
}
```

**400 — Fleet Too Far**

```json
{
  "error": "fleet_too_far",
  "message": "Fleet is not at the target location. Current position: galaxy 3, system 140. Required: galaxy 3, system 142.",
  "distance": 2,
  "maxDistance": 0
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Combat result            |
| 400  | Invalid fleet / too far  |
| 401  | Unauthorized             |

---

## GET /api/celestial/market

List celestial bodies currently listed for sale.

### Query Parameters

| Field    | Type   | Required | Default | Description                     |
|----------|--------|----------|---------|---------------------------------|
| page     | number | No       | 1       | Page number                     |
| limit    | number | No       | 20      | Items per page (max 100)        |
| type     | string | No       | —       | Filter by planet type           |
| minPrice | number | No       | —       | Minimum price in credits        |
| maxPrice | number | No       | —       | Maximum price in credits        |
| galaxy   | number | No       | —       | Filter by galaxy                |

### Example Request

```bash
curl "https://api.universe-civ.com/api/celestial/market?page=1&limit=10&type=terran&minPrice=10000"
```

### Response Schema (200)

```json
{
  "listings": [
    {
      "id": "l9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
      "seller": { "id": "seller-uuid", "name": "TradeLord42" },
      "celestial": {
        "id": "c7a9f1d2-...",
        "type": "planet",
        "galaxy": 3,
        "system": 142,
        "planet": 4,
        "name": "Proxima IV",
        "planetType": "terran",
        "temperature": 22,
        "diameter": 12800
      },
      "price": {
        "credits": 50000,
        "metal": 0,
        "crystal": 0,
        "deuterium": 0
      },
      "listedAt": "2026-06-25T08:00:00Z",
      "expiresAt": "2026-07-25T08:00:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200  | Success     |

---

## POST /api/celestial/market/list

List a claimed celestial body for sale on the marketplace.

### Request Body

```json
{
  "celestialId": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f",
  "price": {
    "credits": 50000,
    "metal": 0,
    "crystal": 0,
    "deuterium": 0
  }
}
```

| Field       | Type   | Required | Description                               |
|-------------|--------|----------|-------------------------------------------|
| celestialId | string | Yes      | UUID of the celestial body to sell        |
| price       | object | Yes      | Price; at least one resource must be > 0  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"celestialId": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f", "price": {"credits": 50000, "metal": 0, "crystal": 0, "deuterium": 0}}' \
  "https://api.universe-civ.com/api/celestial/market/list"
```

### Response Schema (200)

```json
{
  "listing": {
    "id": "l9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    "seller": { "id": "player-uuid", "name": "TradeLord42" },
    "celestial": { "id": "c7a9f1d2-...", "name": "Proxima IV" },
    "price": { "credits": 50000, "metal": 0, "crystal": 0, "deuterium": 0 },
    "listedAt": "2026-06-28T10:30:00Z",
    "expiresAt": "2026-07-28T10:30:00Z"
  }
}
```

### Error Responses

**400 — Not Owner**

```json
{
  "error": "not_owner",
  "message": "You do not own this celestial body."
}
```

**400 — Already Listed**

```json
{
  "error": "already_listed",
  "message": "This celestial body is already listed on the marketplace.",
  "existingListingId": "l9b8c7d6-..."
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Listing created          |
| 400  | Not owner / already listed |
| 401  | Unauthorized             |

---

## POST /api/celestial/market/buy/:listingId

Purchase a celestial body listed on the marketplace. Resources are deducted from the buyer and credited to the seller.

### Path Parameters

| Field     | Type   | Description                   |
|-----------|--------|-------------------------------|
| listingId | string | UUID of the marketplace listing |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/celestial/market/buy/l9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d"
```

### Response Schema (200)

```json
{
  "celestial": {
    "id": "c7a9f1d2-...",
    "name": "Proxima IV",
    "isClaimed": true,
    "claimedBy": "buyer-player-uuid",
    "claimedAt": "2026-06-28T11:00:00Z"
  },
  "transaction": {
    "id": "tx-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "type": "celestial_purchase",
    "listingId": "l9b8c7d6-...",
    "sellerId": "seller-uuid",
    "buyerId": "buyer-uuid",
    "price": { "credits": 50000, "metal": 0, "crystal": 0, "deuterium": 0 },
    "processedAt": "2026-06-28T11:00:00Z"
  }
}
```

### Error Responses

**400 — Insufficient Resources**

```json
{
  "error": "insufficient_resources",
  "message": "You need 50000 credits to complete this purchase.",
  "deficit": { "credits": 12000 }
}
```

**400 — Already Sold**

```json
{
  "error": "already_sold",
  "message": "This listing has already been sold."
}
```

### Status Codes

| Code | Description                  |
|------|------------------------------|
| 200  | Purchase successful          |
| 400  | Insufficient resources / sold|
| 401  | Unauthorized                 |

---

## DELETE /api/celestial/market/:listingId

Cancel an active marketplace listing. Only the seller can cancel.

### Path Parameters

| Field     | Type   | Description                   |
|-----------|--------|-------------------------------|
| listingId | string | UUID of the marketplace listing |

### Example Request

```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/celestial/market/l9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d"
```

### Response Schema (200)

```json
{
  "success": true
}
```

### Error Responses

**400 — Not Owner**

```json
{
  "error": "not_owner",
  "message": "You are not the seller of this listing."
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Listing cancelled |
| 400  | Not owner         |
| 401  | Unauthorized      |

---

## GET /api/celestial/cooldowns

Get all active search cooldowns for the authenticated player.

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/celestial/cooldowns"
```

### Response Schema (200)

```json
{
  "cooldowns": [
    {
      "target": { "galaxy": 3, "system": 142, "planet": 4, "type": "planet" },
      "scanType": "deep",
      "expiresAt": "2026-06-29T10:30:00Z",
      "remainingSeconds": 85421
    },
    {
      "target": { "galaxy": 1, "system": 55, "planet": 7, "type": "moon" },
      "scanType": "standard",
      "expiresAt": "2026-06-29T08:15:00Z",
      "remainingSeconds": 78200
    }
  ]
}
```

### Status Codes

| Code | Description   |
|------|---------------|
| 200  | Success       |
| 401  | Unauthorized  |
