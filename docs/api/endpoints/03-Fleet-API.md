# Fleet API

Endpoints for creating, managing, dispatching, and merging player fleets.

---

## Authentication

All endpoints marked **Auth: required** must include a valid JWT bearer token:

```
Authorization: Bearer <token>
```

---

## GET /api/fleets

List all fleets belonging to the authenticated player.

### Query Parameters

| Field  | Type   | Required | Default | Description                                          |
|--------|--------|----------|---------|------------------------------------------------------|
| status | string | No       | —       | Filter by status: `docked`, `underway`, `in_combat`, `repairing` |
| page   | number | No       | 1       | Page number                                          |
| limit  | number | No       | 20      | Items per page (max 100)                             |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/fleets?status=docked&page=1&limit=20"
```

### Response Schema (200)

```json
{
  "fleets": [
    {
      "id": "fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Strike Force Alpha",
      "status": "docked",
      "position": { "galaxy": 3, "system": 142, "planet": 4 },
      "shipCount": 45,
      "totalPower": 18500,
      "cargo": { "used": 12000, "capacity": 50000 },
      "speed": 4500,
      "createdAt": "2026-06-15T10:00:00Z"
    },
    {
      "id": "fleet-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Transport 3",
      "status": "underway",
      "position": { "galaxy": 3, "system": 140, "planet": null },
      "destination": { "galaxy": 3, "system": 200, "planet": 5 },
      "mission": "transport",
      "shipCount": 10,
      "totalPower": 500,
      "cargo": { "used": 45000, "capacity": 50000 },
      "speed": 2500,
      "arrivalTime": "2026-06-28T14:00:00Z",
      "createdAt": "2026-06-27T08:00:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 20
}
```

### Status Codes

| Code | Description   |
|------|---------------|
| 200  | Success       |
| 401  | Unauthorized  |

---

## POST /api/fleets

Create a new fleet from ships docked at a colony.

### Request Body

```json
{
  "planetId": "col-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "ships": [
    { "type": "light_fighter", "count": 30 },
    { "type": "cruiser", "count": 5 },
    { "type": "colony_ship", "count": 1 }
  ],
  "name": "Expedition Force"
}
```

| Field    | Type   | Required | Description                                       |
|----------|--------|----------|---------------------------------------------------|
| planetId | string | Yes      | UUID of the colony to take ships from             |
| ships    | array  | Yes      | Array of ship type / count objects                |
| name     | string | No       | Fleet name (auto-generated if omitted)            |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"planetId": "col-a1b2c3d4-e5f6-7890-abcd-ef1234567890", "ships": [{"type": "light_fighter", "count": 30}, {"type": "cruiser", "count": 5}], "name": "Expedition Force"}' \
  "https://api.universe-civ.com/api/fleets"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Expedition Force",
    "status": "docked",
    "position": { "galaxy": 3, "system": 142, "planet": 4 },
    "ships": [
      { "type": "light_fighter", "count": 30 },
      { "type": "cruiser", "count": 5 }
    ],
    "shipCount": 35,
    "totalPower": 16500,
    "cargo": { "used": 0, "capacity": 22000 },
    "speed": 4200,
    "fuel": { "current": 1000, "capacity": 1000 },
    "createdAt": "2026-06-28T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description          |
|------|----------------------|
| 200  | Fleet created        |
| 400  | Invalid ships / insufficient ships at colony |
| 401  | Unauthorized         |

---

## GET /api/fleets/:id

Get detailed information about a specific fleet.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Strike Force Alpha",
    "status": "docked",
    "position": { "galaxy": 3, "system": 142, "planet": 4, "type": "planet" },
    "mission": null
  },
  "ships": [
    { "type": "light_fighter", "count": 30, "hull": 0.95, "shield": 1.0 },
    { "type": "cruiser", "count": 5, "hull": 0.90, "shield": 1.0 },
    { "type": "battleship", "count": 2, "hull": 1.0, "shield": 1.0 }
  ],
  "crew": { "current": 185, "capacity": 200, "morale": 0.92 },
  "cargo": {
    "used": 12000,
    "capacity": 50000,
    "resources": { "metal": 8000, "crystal": 4000, "deuterium": 0 }
  },
  "stats": {
    "totalPower": 18500,
    "hullPoints": 45000,
    "shieldPoints": 12000,
    "speed": 4500,
    "fuelConsumption": 120
  },
  "createdAt": "2026-06-15T10:00:00Z"
}
```

### Status Codes

| Code | Description     |
|------|-----------------|
| 200  | Success         |
| 401  | Unauthorized    |
| 404  | Fleet not found |

---

## POST /api/fleets/:id/dispatch

Send a fleet to a target coordinate with a specific mission type.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Request Body

```json
{
  "galaxy": 3,
  "system": 200,
  "planet": 5,
  "mission": "attack"
}
```

| Field   | Type   | Required | Description                                               |
|---------|--------|----------|-----------------------------------------------------------|
| galaxy  | number | Yes      | Target galaxy ID                                          |
| system  | number | Yes      | Target system ID                                          |
| planet  | number | Yes      | Target planet slot                                        |
| mission | string | Yes      | Mission type: `attack`, `transport`, `colonize`, `deploy`, `probe` |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"galaxy": 3, "system": 200, "planet": 5, "mission": "attack"}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/dispatch"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-...",
    "name": "Strike Force Alpha",
    "status": "underway"
  },
  "arrivalTime": "2026-06-28T12:15:00Z",
  "travelTime": 6300,
  "fuelCost": 450,
  "distance": 58,
  "mission": "attack"
}
```

### Status Codes

| Code | Description         |
|------|---------------------|
| 200  | Fleet dispatched    |
| 400  | Invalid mission / insufficient fuel |
| 401  | Unauthorized        |
| 404  | Fleet not found     |

---

## POST /api/fleets/:id/recall

Recall a fleet that is currently in transit, sending it back to its origin.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/recall"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-...",
    "status": "returning",
    "origin": { "galaxy": 3, "system": 142, "planet": 4 }
  },
  "returnTime": "2026-06-28T13:45:00Z",
  "fuelCost": 450
}
```

### Status Codes

| Code | Description        |
|------|--------------------|
| 200  | Fleet recalled     |
| 400  | Fleet not in transit |
| 401  | Unauthorized       |
| 404  | Fleet not found    |

---

## POST /api/fleets/:id/attack

Initiate an attack on a celestial body or planet. The fleet must be at the target location.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Request Body

```json
{
  "targetCelestialId": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f"
}
```

**OR**

```json
{
  "targetPlanetId": "col-b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

| Field             | Type   | Required | Description                              |
|-------------------|--------|----------|------------------------------------------|
| targetCelestialId | string | No*      | UUID of the celestial body to attack     |
| targetPlanetId    | string | No*      | UUID of the colony planet to attack      |

*Exactly one of `targetCelestialId` or `targetPlanetId` must be provided.

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetCelestialId": "c7a9f1d2-e4b8-4c3a-9f6d-2e1a8b7c0d5f"}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/attack"
```

### Response Schema (200)

```json
{
  "combatReport": {
    "id": "cr-9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    "attacker": { "id": "attacker-uuid", "name": "WarlordX" },
    "defender": { "id": "defender-uuid", "name": "PeacefulFarmer" },
    "target": { "id": "c7a9f1d2-...", "name": "Proxima IV", "type": "celestial" },
    "rounds": [
      {
        "round": 1,
        "attackerShips": { "lightFighter": 30, "cruiser": 5 },
        "defenderShips": { "rocketLauncher": 20, "lightLaser": 15 },
        "attackerLosses": { "lightFighter": 3 },
        "defenderLosses": { "rocketLauncher": 5, "lightLaser": 2 },
        "attackerDamage": 7200,
        "defenderDamage": 1800
      }
    ],
    "outcome": "attacker_victory",
    "attackerLosses": { "lightFighter": 8, "cruiser": 1 },
    "defenderLosses": { "rocketLauncher": 15, "lightLaser": 10 },
    "loot": { "metal": 12000, "crystal": 6000, "deuterium": 2000 },
    "debrisField": { "metal": 3500, "crystal": 1800 },
    "duration": 35,
    "fledShips": { "defender": {} }
  }
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Combat resolved          |
| 400  | Fleet not at location / invalid target |
| 401  | Unauthorized             |
| 404  | Fleet or target not found|

---

## POST /api/fleets/:id/deploy

Deploy a fleet to one of your own colonies, transferring ships and cargo.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Request Body

```json
{
  "targetPlanetId": "col-b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

| Field          | Type   | Required | Description                    |
|----------------|--------|----------|--------------------------------|
| targetPlanetId | string | Yes      | UUID of the target colony      |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetPlanetId": "col-b2c3d4e5-f6a7-8901-bcde-f12345678901"}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/deploy"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-...",
    "status": "docked",
    "position": { "galaxy": 3, "system": 200, "planet": 5 }
  },
  "shipsTransferred": 35,
  "cargoTransferred": { "metal": 8000, "crystal": 4000, "deuterium": 0 }
}
```

### Status Codes

| Code | Description        |
|------|--------------------|
| 200  | Deployment complete|
| 400  | Not your colony / fleet not at location |
| 401  | Unauthorized       |
| 404  | Fleet or colony not found |

---

## POST /api/fleets/:id/split

Split a fleet into two separate fleets. The original fleet retains the specified ships, the new fleet gets the rest. To move ships *out* of the original, list them in `ships`.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Request Body

```json
{
  "newName": "Scout Wing",
  "ships": [
    { "type": "light_fighter", "count": 10 },
    { "type": "cruiser", "count": 2 }
  ]
}
```

| Field   | Type   | Required | Description                                       |
|---------|--------|----------|---------------------------------------------------|
| newName | string | Yes      | Name for the new fleet                            |
| ships   | array  | Yes      | Ships to move to the new fleet                    |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"newName": "Scout Wing", "ships": [{"type": "light_fighter", "count": 10}, {"type": "cruiser", "count": 2}]}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/split"
```

### Response Schema (200)

```json
{
  "originalFleet": {
    "id": "fleet-a1b2c3d4-...",
    "name": "Strike Force Alpha",
    "shipCount": 25,
    "ships": [
      { "type": "light_fighter", "count": 20 },
      { "type": "cruiser", "count": 3 },
      { "type": "battleship", "count": 2 }
    ]
  },
  "newFleet": {
    "id": "fleet-d4e5f6a7-b8c9-0123-defa-1234567890ab",
    "name": "Scout Wing",
    "shipCount": 12,
    "ships": [
      { "type": "light_fighter", "count": 10 },
      { "type": "cruiser", "count": 2 }
    ]
  }
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Fleet split       |
| 400  | Invalid ship counts / exceeds available |
| 401  | Unauthorized      |
| 404  | Fleet not found   |

---

## POST /api/fleets/:id/merge

Merge another fleet into this fleet. Both fleets must be at the same location and both must belong to the player.

### Path Parameters

| Field | Type   | Description                  |
|-------|--------|------------------------------|
| id    | string | UUID of the target fleet     |

### Request Body

```json
{
  "sourceFleetId": "fleet-d4e5f6a7-b8c9-0123-defa-1234567890ab"
}
```

| Field        | Type   | Required | Description                            |
|--------------|--------|----------|----------------------------------------|
| sourceFleetId| string | Yes      | UUID of the fleet to merge into target |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"sourceFleetId": "fleet-d4e5f6a7-b8c9-0123-defa-1234567890ab"}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/merge"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-...",
    "name": "Strike Force Alpha",
    "shipCount": 37,
    "ships": [
      { "type": "light_fighter", "count": 30 },
      { "type": "cruiser", "count": 5 },
      { "type": "battleship", "count": 2 }
    ],
    "cargo": { "used": 12000, "capacity": 70000 }
  }
}
```

### Status Codes

| Code | Description                               |
|------|-------------------------------------------|
| 200  | Fleets merged                             |
| 400  | Fleets not at same location / same fleet  |
| 401  | Unauthorized                              |
| 404  | Source or target fleet not found          |

---

## POST /api/fleets/:id/rename

Rename a fleet.

### Path Parameters

| Field | Type   | Description           |
|-------|--------|-----------------------|
| id    | string | UUID of the fleet     |

### Request Body

```json
{
  "name": "Armada Omega"
}
```

| Field | Type   | Required | Description                        |
|-------|--------|----------|------------------------------------|
| name  | string | Yes      | New fleet name (3–50 characters)   |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Armada Omega"}' \
  "https://api.universe-civ.com/api/fleets/fleet-a1b2c3d4-e5f6-7890-abcd-ef1234567890/rename"
```

### Response Schema (200)

```json
{
  "fleet": {
    "id": "fleet-a1b2c3d4-...",
    "name": "Armada Omega"
  }
}
```

### Status Codes

| Code | Description    |
|------|----------------|
| 200  | Renamed        |
| 400  | Invalid name   |
| 401  | Unauthorized   |
| 404  | Fleet not found|

---

## GET /api/fleets/transit

Get all fleets currently in transit (status: `underway` or `returning`).

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/fleets/transit"
```

### Response Schema (200)

```json
{
  "fleets": [
    {
      "id": "fleet-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Transport 3",
      "status": "underway",
      "position": { "galaxy": 3, "system": 140, "planet": null },
      "destination": { "galaxy": 3, "system": 200, "planet": 5 },
      "origin": { "galaxy": 3, "system": 142, "planet": 4 },
      "mission": "transport",
      "ships": [
        { "type": "cargo_ship", "count": 8 },
        { "type": "light_fighter", "count": 2 }
      ],
      "shipCount": 10,
      "cargo": { "used": 45000, "capacity": 50000 },
      "departureTime": "2026-06-27T08:00:00Z",
      "arrivalTime": "2026-06-28T14:00:00Z",
      "progress": 0.75
    }
  ]
}
```

### Status Codes

| Code | Description   |
|------|---------------|
| 200  | Success       |
| 401  | Unauthorized  |
