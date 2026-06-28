# Fleet API

**Base URL:** `/api/fleets`  
**Auth Required:** Yes (Bearer access token) for all endpoints  
**Content-Type:** `application/json`

---

## GET `/api/fleets`

List all fleets belonging to the authenticated player.

### Auth Required
Yes

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | *all* | Filter by status: `idle`, `en_route`, `returning`, `deployed`, `attacking` |
| `universeId` | uuid | *current* | Filter by universe |
| `page` | integer | `1` | Page number for pagination |
| `limit` | integer | `20` | Results per page (max 100) |
| `sort` | string | `-createdAt` | Sort field and direction (`createdAt`, `-createdAt`, `name`, `-name`) |

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "fleets": [
      {
        "id": "uuid",
        "name": "string",
        "status": "idle | en_route | returning | deployed | attacking",
        "coordinates": {
          "galaxy": "integer",
          "solarSystem": "integer",
          "planet": "integer"
        },
        "targetCoordinates": {
          "galaxy": "integer",
          "solarSystem": "integer",
          "planet": "integer"
        } | null,
        "speed": "integer",
        "fuel": "integer",
        "maxFuel": "integer",
        "cargoCapacity": "integer",
        "cargoUsed": "integer",
        "missionType": "attack | transport | deploy | espionage | colonize | harvest | null",
        "arrivalAt": "ISO 8601 timestamp | null",
        "returnAt": "ISO 8601 timestamp | null",
        "composition": {
          "shipType": "count"
        },
        "createdAt": "ISO 8601 timestamp"
      }
    ],
    "pagination": {
      "page": "integer",
      "limit": "integer",
      "total": "integer",
      "totalPages": "integer"
    }
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `401` | `UNAUTHORIZED` | Invalid or expired token |
| `422` | `INVALID_UNIVERSE` | The specified universe does not exist |

---

## POST `/api/fleets`

Create a new fleet from available ships at a colony.

### Auth Required
Yes

### Request Body
```json
{
  "name": "string (3-50 chars)",
  "originColonyId": "uuid",
  "composition": {
    "lightFighter": "integer (>= 0)",
    "heavyFighter": "integer (>= 0)",
    "cruiser": "integer (>= 0)",
    "battleship": "integer (>= 0)",
    "destroyer": "integer (>= 0)",
    "carrier": "integer (>= 0)",
    "smallCargo": "integer (>= 0)",
    "largeCargo": "integer (>= 0)",
    "espionageProbe": "integer (>= 0)",
    "recycler": "integer (>= 0)",
    "colonyShip": "integer (>= 0)",
    "deathstar": "integer (>= 0)"
  }
}
```

### Response `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "status": "idle",
    "coordinates": {
      "galaxy": "integer",
      "solarSystem": "integer",
      "planet": "integer"
    },
    "speed": "integer",
    "fuel": "integer",
    "maxFuel": "integer",
    "cargoCapacity": "integer",
    "cargoUsed": 0,
    "composition": {
      "lightFighter": "integer",
      "heavyFighter": "integer",
      "cruiser": "integer",
      "battleship": "integer",
      "destroyer": "integer",
      "carrier": "integer",
      "smallCargo": "integer",
      "largeCargo": "integer",
      "espionageProbe": "integer",
      "recycler": "integer",
      "colonyShip": "integer",
      "deathstar": "integer"
    },
    "createdAt": "ISO 8601 timestamp"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid request body |
| `400` | `INVALID_NAME` | Name must be 3-50 characters |
| `404` | `COLONY_NOT_FOUND` | Origin colony does not exist |
| `403` | `COLONY_NOT_OWNED` | You do not own the origin colony |
| `422` | `INSUFFICIENT_SHIPS` | You do not have enough ships of a requested type |
| `422` | `EMPTY_FLEET` | Fleet must contain at least one ship |

---

## GET `/api/fleets/:id`

Get detailed information about a specific fleet.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Fleet ID |

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "ownerId": "uuid",
    "ownerName": "string",
    "status": "idle | en_route | returning | deployed | attacking",
    "coordinates": {
      "galaxy": "integer",
      "solarSystem": "integer",
      "planet": "integer"
    },
    "targetCoordinates": {
      "galaxy": "integer",
      "solarSystem": "integer",
      "planet": "integer"
    } | null,
    "speed": "integer",
    "fuel": "integer",
    "maxFuel": "integer",
    "cargoCapacity": "integer",
    "cargoUsed": "integer",
    "cargo": {
      "metal": "integer",
      "crystal": "integer",
      "deuterium": "integer"
    },
    "missionType": "string | null",
    "departureAt": "ISO 8601 timestamp",
    "arrivalAt": "ISO 8601 timestamp | null",
    "returnAt": "ISO 8601 timestamp | null",
    "composition": {
      "shipType": "count"
    },
    "combatStats": {
      "attackPower": "integer",
      "defensePower": "integer",
      "shieldPower": "integer"
    },
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `401` | `UNAUTHORIZED` | Invalid or expired token |
| `404` | `FLEET_NOT_FOUND` | Fleet does not exist |
| `403` | `ACCESS_DENIED` | You do not own this fleet (unless viewing via espionage) |

---

## POST `/api/fleets/:id/dispatch`

Dispatch a fleet to target coordinates with a mission type.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Fleet ID |

### Request Body
```json
{
  "target": {
    "galaxy": "integer (1-9)",
    "solarSystem": "integer (1-499)",
    "planet": "integer (1-15)"
  },
  "missionType": "attack | transport | deploy | espionage | colonize | harvest",
  "speed": "integer (10-100, percentage of max speed, default: 100)",
  "cargo": {
    "metal": "integer (optional, for transport missions)",
    "crystal": "integer (optional, for transport missions)",
    "deuterium": "integer (optional, for transport missions)"
  }
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "en_route",
    "missionType": "string",
    "targetCoordinates": {
      "galaxy": "integer",
      "solarSystem": "integer",
      "planet": "integer"
    },
    "departureAt": "ISO 8601 timestamp",
    "arrivalAt": "ISO 8601 timestamp",
    "returnAt": "ISO 8601 timestamp",
    "fuelConsumed": "integer",
    "duration": "integer (seconds)"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid target coordinates or missing fields |
| `400` | `INVALID_COORDINATES` | Coordinates are out of valid range |
| `400` | `INVALID_MISSION_TYPE` | Unknown mission type |
| `403` | `FLEET_NOT_IDLE` | Only idle fleets can be dispatched |
| `403` | `FLEET_NOT_OWNED` | You do not own this fleet |
| `422` | `INSUFFICIENT_FUEL` | Fleet does not have enough fuel for the trip |
| `422` | `INSUFFICIENT_CARGO` | Cargo exceeds fleet capacity |

---

## POST `/api/fleets/:id/recall`

Recall a fleet that is currently en route or returning.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Fleet ID |

### Request Body
None

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "returning",
    "previousStatus": "en_route | returning",
    "returnAt": "ISO 8601 timestamp (updated)",
    "recalledAt": "ISO 8601 timestamp"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `403` | `FLEET_NOT_IN_MOTION` | Only fleets that are en route or returning can be recalled |
| `403` | `FLEET_NOT_OWNED` | You do not own this fleet |
| `404` | `FLEET_NOT_FOUND` | Fleet does not exist |

---

## POST `/api/fleets/:id/attack`

Dispatch a fleet specifically for an attack mission (shorthand).

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Fleet ID |

### Request Body
```json
{
  "target": {
    "galaxy": "integer",
    "solarSystem": "integer",
    "planet": "integer"
  },
  "speed": "integer (10-100, optional)"
}
```

### Response `200 OK`
Same structure as `POST /api/fleets/:id/dispatch` with `missionType: "attack"`.

### Error Codes
Same as `POST /api/fleets/:id/dispatch`.

---

## POST `/api/fleets/:id/deploy`

Deploy a fleet to one of your own colonies.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Fleet ID |

### Request Body
```json
{
  "targetColonyId": "uuid",
  "speed": "integer (10-100, optional)"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "en_route",
    "missionType": "deploy",
    "targetColonyId": "uuid",
    "targetCoordinates": {
      "galaxy": "integer",
      "solarSystem": "integer",
      "planet": "integer"
    },
    "arrivalAt": "ISO 8601 timestamp",
    "duration": "integer (seconds)"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing target colony ID |
| `403` | `FLEET_NOT_IDLE` | Only idle fleets can be deployed |
| `403` | `FLEET_NOT_OWNED` | You do not own this fleet |
| `404` | `COLONY_NOT_FOUND` | Target colony does not exist |
| `403` | `COLONY_NOT_OWNED` | You do not own the target colony |

---

## POST `/api/fleets/:id/split`

Split a fleet into two fleets by moving a subset of ships to a new fleet.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Source fleet ID |

### Request Body
```json
{
  "newFleetName": "string (3-50 chars)",
  "shipsToSplit": {
    "lightFighter": "integer (>= 0)",
    "heavyFighter": "integer (>= 0)",
    "cruiser": "integer (>= 0)",
    "battleship": "integer (>= 0)",
    "destroyer": "integer (>= 0)",
    "carrier": "integer (>= 0)",
    "smallCargo": "integer (>= 0)",
    "largeCargo": "integer (>= 0)",
    "espionageProbe": "integer (>= 0)",
    "recycler": "integer (>= 0)",
    "colonyShip": "integer (>= 0)",
    "deathstar": "integer (>= 0)"
  }
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "sourceFleet": {
      "id": "uuid",
      "composition": { "shipType": "count" }
    },
    "newFleet": {
      "id": "uuid",
      "name": "string",
      "status": "idle",
      "coordinates": {
        "galaxy": "integer",
        "solarSystem": "integer",
        "planet": "integer"
      },
      "composition": { "shipType": "count" }
    }
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Invalid request body |
| `400` | `INVALID_NAME` | New fleet name must be 3-50 characters |
| `403` | `FLEET_NOT_IDLE` | Only idle fleets can be split |
| `403` | `FLEET_NOT_OWNED` | You do not own this fleet |
| `422` | `INSUFFICIENT_SHIPS` | Source fleet does not have enough of the requested ships |
| `422` | `EMPTY_SPLIT` | Cannot split zero ships |
| `422` | `SPLIT_ALL_SHIPS` | Must leave at least one ship in the source fleet |

---

## POST `/api/fleets/:id/merge`

Merge another fleet into this fleet. Both fleets must be idle and at the same coordinates.

### Auth Required
Yes

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Target fleet ID (fleet to merge into) |

### Request Body
```json
{
  "sourceFleetId": "uuid"
}
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "targetFleet": {
      "id": "uuid",
      "composition": { "shipType": "count" },
      "cargo": {
        "metal": "integer",
        "crystal": "integer",
        "deuterium": "integer"
      }
    },
    "mergedFleetId": "uuid (source fleet is deleted after merge)"
  }
}
```

### Error Codes
| Code | Message | Description |
|------|---------|-------------|
| `400` | `VALIDATION_ERROR` | Missing source fleet ID |
| `403` | `FLEET_NOT_IDLE` | Both fleets must be idle to merge |
| `403` | `SAME_FLEET` | Cannot merge a fleet into itself |
| `403` | `FLEET_NOT_OWNED` | You do not own one of the fleets |
| `422` | `DIFFERENT_LOCATION` | Fleets must be at the same coordinates to merge |
| `404` | `FLEET_NOT_FOUND` | Source fleet does not exist |

---

## Common Response Format

All responses follow the standard envelope:

```json
{
  "success": true | false,
  "data": { ... } | null,
  "error": {
    "code": "string",
    "message": "string",
    "details": {} | null
  } | null
}
```

## Fleet Statuses

| Status | Description |
|--------|-------------|
| `idle` | Fleet is parked at a colony or coordinates, awaiting orders |
| `en_route` | Fleet is traveling to its target destination |
| `returning` | Fleet is returning to its origin after completing a mission |
| `attacking` | Fleet is engaged in combat (transitional state) |
| `deployed` | Fleet is stationed at a non-owned location (occupation) |

## Ship Types Reference

| Key | Class | Cargo | Speed | Fuel | Attack | Shield | Armor |
|-----|-------|-------|-------|------|--------|--------|-------|
| `lightFighter` | Light Fighter | 50 | 12,500 | 20 | 50 | 10 | 400 |
| `heavyFighter` | Heavy Fighter | 100 | 10,000 | 75 | 150 | 25 | 1,000 |
| `cruiser` | Cruiser | 800 | 9,000 | 300 | 400 | 50 | 2,700 |
| `battleship` | Battleship | 1,500 | 7,000 | 1,000 | 1,000 | 200 | 6,000 |
| `destroyer` | Destroyer | 2,000 | 5,000 | 2,000 | 2,000 | 500 | 11,000 |
| `carrier` | Carrier | 10,000 | 4,000 | 2,500 | 100 | 100 | 9,000 |
| `smallCargo` | Small Cargo | 5,000 | 10,000 | 10 | 5 | 10 | 400 |
| `largeCargo` | Large Cargo | 25,000 | 7,500 | 50 | 5 | 25 | 1,200 |
| `espionageProbe` | Espionage Probe | 5 | 100,000,000 | 1 | 0 | 0 | 1 |
| `recycler` | Recycler | 20,000 | 2,000 | 900 | 1 | 10 | 1,600 |
| `colonyShip` | Colony Ship | 7,500 | 2,500 | 1,000 | 50 | 100 | 3,000 |
| `deathstar` | Deathstar | 1,000,000 | 100 | 10,000 | 200,000 | 10,000 | 500,000 |
