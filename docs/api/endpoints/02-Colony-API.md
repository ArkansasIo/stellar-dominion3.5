# Colony API

Endpoints for establishing, managing, and upgrading player colonies on celestial bodies.

---

## Authentication

All endpoints marked **Auth: required** must include a valid JWT bearer token:

```
Authorization: Bearer <token>
```

---

## GET /api/colonies

List all colonies owned by the authenticated player.

### Query Parameters

| Field      | Type   | Required | Default | Description                          |
|------------|--------|----------|---------|--------------------------------------|
| page       | number | No       | 1       | Page number for pagination           |
| limit      | number | No       | 20      | Items per page (max 100)             |
| planetType | string | No       | —       | Filter by planet type (terran, desert, gas, ice, lava, ocean) |
| galaxy     | number | No       | —       | Filter by galaxy ID                  |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/colonies?page=1&limit=10&galaxy=3"
```

### Response Schema (200)

```json
{
  "colonies": [
    {
      "id": "col-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "New Terra",
      "galaxy": 3,
      "system": 142,
      "planet": 4,
      "planetType": "terran",
      "diameter": 12800,
      "temperature": 22,
      "capital": true,
      "population": 12500,
      "populationCapacity": 25000,
      "resourceProduction": {
        "metal": { "base": 120, "bonus": 30, "total": 150, "perHour": true },
        "crystal": { "base": 80, "bonus": 15, "total": 95, "perHour": true },
        "deuterium": { "base": 40, "bonus": 5, "total": 45, "perHour": true },
        "energy": { "base": 200, "used": 145, "available": 55, "perHour": true }
      },
      "resourceStorage": {
        "metal": 100000,
        "crystal": 75000,
        "deuterium": 50000
      },
      "buildingCount": 12,
      "queueLength": 2,
      "createdAt": "2026-06-10T08:00:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### Status Codes

| Code | Description   |
|------|---------------|
| 200  | Success       |
| 401  | Unauthorized  |

---

## GET /api/colonies/:id

Get detailed information about a specific colony.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Response Schema (200)

```json
{
  "colony": {
    "id": "col-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "New Terra",
    "galaxy": 3,
    "system": 142,
    "planet": 4,
    "planetType": "terran",
    "diameter": 12800,
    "temperature": 22,
    "capital": true,
    "fields": { "total": 163, "used": 47, "available": 116 },
    "population": {
      "current": 12500,
      "capacity": 25000,
      "growth": { "rate": 45, "perHour": true },
      "satisfaction": 82
    },
    "createdAt": "2026-06-10T08:00:00Z",
    "lastActive": "2026-06-28T09:00:00Z"
  },
  "buildings": [
    {
      "type": "metal_mine",
      "level": 12,
      "status": "active",
      "production": 120,
      "energyCost": 15,
      "nextLevelCost": { "metal": 2400, "crystal": 1200, "deuterium": 0, "energy": 18 }
    }
  ],
  "resources": {
    "metal": { "current": 45000, "capacity": 100000, "production": 150 },
    "crystal": { "current": 28000, "capacity": 75000, "production": 95 },
    "deuterium": { "current": 12000, "capacity": 50000, "production": 45 },
    "energy": { "current": 55, "available": 55, "production": 200, "consumption": 145 }
  },
  "queue": [
    {
      "id": "q-1234-5678-90ab-cdef",
      "buildingType": "crystal_mine",
      "targetLevel": 10,
      "startTime": "2026-06-28T08:00:00Z",
      "endTime": "2026-06-28T14:30:00Z",
      "progress": 0.45
    }
  ]
}
```

### Status Codes

| Code | Description     |
|------|-----------------|
| 200  | Success         |
| 401  | Unauthorized    |
| 404  | Colony not found|

---

## POST /api/colonies

Establish a new colony on an unoccupied, discovered celestial body. Requires a colony ship in orbit.

### Request Body

```json
{
  "galaxy": 3,
  "system": 155,
  "planet": 7,
  "colonyShipId": "ship-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

| Field        | Type   | Required | Description                             |
|--------------|--------|----------|-----------------------------------------|
| galaxy       | number | Yes      | Galaxy ID                               |
| system       | number | Yes      | System ID                               |
| planet       | number | Yes      | Planet slot                             |
| colonyShipId | string | Yes      | UUID of the colony ship to be consumed  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"galaxy": 3, "system": 155, "planet": 7, "colonyShipId": "ship-a1b2c3d4-e5f6-7890-abcd-ef1234567890"}' \
  "https://api.universe-civ.com/api/colonies"
```

### Response Schema (200)

```json
{
  "colony": {
    "id": "col-b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Colony",
    "galaxy": 3,
    "system": 155,
    "planet": 7,
    "planetType": "desert",
    "diameter": 10400,
    "temperature": 48,
    "capital": false,
    "fields": { "total": 98, "used": 1, "available": 97 },
    "population": { "current": 100, "capacity": 500, "growth": { "rate": 2, "perHour": true } },
    "createdAt": "2026-06-28T10:30:00Z"
  }
}
```

### Error Responses

**400 — Invalid Coordinates**

```json
{
  "error": "invalid_coordinates",
  "message": "No discoverable celestial body at galaxy 3, system 155, planet 7."
}
```

**400 — No Colony Ship**

```json
{
  "error": "no_colony_ship",
  "message": "A colony ship is required to establish a colony. No valid colony ship found.",
  "details": "The specified ship does not exist, is not at the target location, or is not a colony ship."
}
```

**400 — Already Occupied**

```json
{
  "error": "already_occupied",
  "message": "This celestial body already has a colony."
}
```

### Status Codes

| Code | Description                               |
|------|-------------------------------------------|
| 200  | Colony established                        |
| 400  | Invalid coordinates / no colony ship / occupied |
| 401  | Unauthorized                              |

---

## POST /api/colonies/:id/upgrade

Queue a building upgrade on a colony.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Request Body

```json
{
  "buildingType": "metal_mine",
  "targetLevel": 13
}
```

| Field        | Type   | Required | Description                                 |
|--------------|--------|----------|---------------------------------------------|
| buildingType | string | Yes      | Building type identifier                    |
| targetLevel  | number | Yes      | Desired level (must be current level + 1)  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"buildingType": "metal_mine", "targetLevel": 13}' \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/upgrade"
```

### Response Schema (200)

```json
{
  "queueEntry": {
    "id": "q-5678-90ab-cdef-1234",
    "buildingType": "metal_mine",
    "currentLevel": 12,
    "targetLevel": 13,
    "cost": { "metal": 2400, "crystal": 1200, "deuterium": 0 },
    "duration": 3600,
    "startTime": "2026-06-28T10:30:00Z",
    "endTime": "2026-06-28T11:30:00Z",
    "position": 1
  }
}
```

### Error Responses

**400 — Prerequisites Not Met**

```json
{
  "error": "prerequisites_not_met",
  "message": "Metal Mine level 13 requires Robotics Factory level 5 (current: 3).",
  "missing": { "robotics_factory": { "required": 5, "current": 3 } }
}
```

**400 — Insufficient Resources**

```json
{
  "error": "insufficient_resources",
  "message": "Need 2400 metal, 1200 crystal. Missing: 800 metal.",
  "deficit": { "metal": 800, "crystal": 0, "deuterium": 0 }
}
```

**400 — Queue Full**

```json
{
  "error": "queue_full",
  "message": "Colony build queue is full (max 5 entries). Complete or cancel an existing upgrade first."
}
```

### Status Codes

| Code | Description                          |
|------|--------------------------------------|
| 200  | Upgrade queued                       |
| 400  | Prerequisites / resources / queue full |
| 401  | Unauthorized                         |
| 404  | Colony not found                     |

---

## POST /api/colonies/:id/cancel

Cancel a queued building upgrade and receive a resource refund.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Request Body

```json
{
  "queueEntryId": "q-5678-90ab-cdef-1234"
}
```

| Field        | Type   | Required | Description                 |
|--------------|--------|----------|-----------------------------|
| queueEntryId | string | Yes      | UUID of the queue entry     |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"queueEntryId": "q-5678-90ab-cdef-1234"}' \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/cancel"
```

### Response Schema (200)

```json
{
  "refund": {
    "metal": 1920,
    "crystal": 960,
    "deuterium": 0
  }
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Cancelled / refunded |
| 401  | Unauthorized      |
| 404  | Colony or queue entry not found |

---

## POST /api/colonies/:id/rename

Rename a colony.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Request Body

```json
{
  "name": "New Proxima"
}
```

| Field | Type   | Required | Description                              |
|-------|--------|----------|------------------------------------------|
| name  | string | Yes      | New colony name (3–50 characters)        |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Proxima"}' \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/rename"
```

### Response Schema (200)

```json
{
  "colony": {
    "id": "col-a1b2c3d4-...",
    "name": "New Proxima"
  }
}
```

### Status Codes

| Code | Description    |
|------|----------------|
| 200  | Renamed        |
| 400  | Invalid name   |
| 401  | Unauthorized   |
| 404  | Colony not found |

---

## POST /api/colonies/:id/terraform

Terraform a planet to change its type. Costs significant resources and takes time.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Request Body

```json
{
  "targetPlanetType": "terran"
}
```

| Field           | Type   | Required | Description                              |
|-----------------|--------|----------|------------------------------------------|
| targetPlanetType| string | Yes      | Desired planet type (terran, desert, gas, ice, lava, ocean) |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetPlanetType": "terran"}' \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/terraform"
```

### Response Schema (200)

```json
{
  "cost": {
    "credits": 250000,
    "metal": 50000,
    "crystal": 35000,
    "deuterium": 20000,
    "energy": 5000
  },
  "time": 86400,
  "result": {
    "previousType": "desert",
    "newType": "terran",
    "fields": { "previous": 98, "new": 163 },
    "temperature": { "previous": 48, "new": 22 },
    "diameter": { "previous": 10400, "new": 12800 },
    "completedAt": "2026-06-29T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description            |
|------|------------------------|
| 200  | Terraforming started   |
| 400  | Invalid target type / insufficient resources |
| 401  | Unauthorized           |
| 404  | Colony not found       |

---

## GET /api/colonies/:id/buildings

Get all buildings and their levels for a colony.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/buildings"
```

### Response Schema (200)

```json
{
  "buildings": [
    {
      "type": "metal_mine",
      "level": 12,
      "status": "active",
      "effects": {
        "production": { "metal": 120 },
        "energyCost": 15,
        "storageBonus": 0
      }
    },
    {
      "type": "crystal_mine",
      "level": 9,
      "status": "upgrading",
      "effects": {
        "production": { "crystal": 80 },
        "energyCost": 12,
        "storageBonus": 0
      }
    },
    {
      "type": "robotics_factory",
      "level": 5,
      "status": "active",
      "effects": {
        "buildSpeed": 1.5,
        "energyCost": 20
      }
    },
    {
      "type": "shipyard",
      "level": 4,
      "status": "active",
      "effects": {
        "shipBuildSpeed": 1.3,
        "allowedShips": ["light_fighter", "heavy_fighter", "cruiser", "colony_ship"]
      }
    }
  ]
}
```

### Status Codes

| Code | Description      |
|------|------------------|
| 200  | Success          |
| 401  | Unauthorized     |
| 404  | Colony not found |

---

## GET /api/colonies/:id/queue

Get the current build queue for a colony.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the colony       |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/colonies/col-a1b2c3d4-e5f6-7890-abcd-ef1234567890/queue"
```

### Response Schema (200)

```json
{
  "queue": [
    {
      "id": "q-5678-90ab-cdef-1234",
      "buildingType": "crystal_mine",
      "currentLevel": 9,
      "targetLevel": 10,
      "cost": { "metal": 1800, "crystal": 900, "deuterium": 0 },
      "startTime": "2026-06-28T08:00:00Z",
      "endTime": "2026-06-28T14:30:00Z",
      "progress": 0.45,
      "position": 1
    },
    {
      "id": "q-90ab-cdef-1234-5678",
      "buildingType": "solar_plant",
      "currentLevel": 8,
      "targetLevel": 9,
      "cost": { "metal": 1200, "crystal": 600, "deuterium": 0 },
      "startTime": "2026-06-28T14:30:00Z",
      "endTime": "2026-06-28T16:45:00Z",
      "progress": 0.0,
      "position": 2
    }
  ]
}
```

### Status Codes

| Code | Description      |
|------|------------------|
| 200  | Success          |
| 401  | Unauthorized     |
| 404  | Colony not found |
