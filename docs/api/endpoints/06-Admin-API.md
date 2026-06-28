# Admin API

Restricted endpoints for game administrators. All endpoints require **Admin Authentication**.

---

## Authentication

All Admin API endpoints require an admin-level JWT token:

```
Authorization: Bearer <admin-token>
```

Additionally, the request must come from a whitelisted admin IP address or include a valid admin API key header:

```
X-Admin-Key: <admin-api-key>
```

---

## POST /api/admin/players/search

Search for players by various criteria.

### Request Body

```json
{
  "query": "Proxima",
  "filters": {
    "isBanned": false,
    "minScore": 1000,
    "maxScore": null,
    "allianceId": null,
    "galaxy": null,
    "createdAfter": "2026-01-01T00:00:00Z",
    "createdBefore": null,
    "lastActiveAfter": null
  }
}
```

| Field   | Type   | Required | Description                               |
|---------|--------|----------|-------------------------------------------|
| query   | string | No       | Search by player name or email (partial)  |
| filters | object | No       | Optional filter criteria                  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"query": "Proxima", "filters": {"isBanned": false, "minScore": 1000}}' \
  "https://api.universe-civ.com/api/admin/players/search"
```

### Response Schema (200)

```json
{
  "players": [
    {
      "id": "player-uuid-1",
      "username": "CaptainProxima",
      "email": "cap***@example.com",
      "score": 1250000,
      "isBanned": false,
      "isActive": true,
      "alliance": { "id": "alliance-id", "name": "Galactic Republic", "tag": "GAR" },
      "colonyCount": 5,
      "fleetCount": 8,
      "totalResearchLevel": 42,
      "createdAt": "2026-05-15T10:00:00Z",
      "lastActiveAt": "2026-06-28T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Status Codes

| Code | Description      |
|------|------------------|
| 200  | Success          |
| 401  | Unauthorized     |
| 403  | Forbidden (not admin) |

---

## GET /api/admin/players/:id

Get full player details including all game data.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the player       |

### Example Request

```bash
curl -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  "https://api.universe-civ.com/api/admin/players/player-uuid-1"
```

### Response Schema (200)

```json
{
  "player": {
    "id": "player-uuid-1",
    "username": "CaptainProxima",
    "email": "captain@example.com",
    "isBanned": false,
    "banHistory": [],
    "isActive": true,
    "lastLogin": "2026-06-28T09:00:00Z",
    "lastIp": "192.168.1.100",
    "registrationIp": "10.0.0.5",
    "createdAt": "2026-05-15T10:00:00Z",
    "settings": {
      "language": "en",
      "notifications": { "email": true, "push": false }
    }
  },
  "gameData": {
    "score": 1250000,
    "rank": 42,
    "colonies": [
      {
        "id": "col-a1b2c3d4-...",
        "name": "New Terra",
        "galaxy": 3, "system": 142, "planet": 4,
        "planetType": "terran",
        "capital": true,
        "buildings": { "metalMine": 12, "crystalMine": 9 }
      }
    ],
    "fleets": [
      {
        "id": "fleet-a1b2c3d4-...",
        "name": "Strike Force Alpha",
        "status": "docked",
        "shipCount": 45
      }
    ],
    "research": {
      "technologies": { "tech_laser_1": 5, "tech_energy_1": 8 },
      "currentQueue": { "techId": "tech_hyperspace_1", "progress": 0.35 }
    },
    "alliance": { "id": "alliance-id", "name": "Galactic Republic", "tag": "GAR", "rank": "member" },
    "resources": { "credits": 500000, "metal": 350000, "crystal": 200000, "deuterium": 80000 },
    "premium": { "darkMatter": 1500, "purchased": 500, "earned": 1000 }
  },
  "auditLog": [
    { "action": "login", "timestamp": "2026-06-28T09:00:00Z", "ip": "192.168.1.100" },
    { "action": "resource_deduction", "timestamp": "2026-06-28T08:30:00Z", "details": "Claimed planet c7a9f1d2-... cost 5000 credits" }
  ]
}
```

### Status Codes

| Code | Description          |
|------|----------------------|
| 200  | Success              |
| 401  | Unauthorized         |
| 403  | Forbidden (not admin)|
| 404  | Player not found     |

---

## POST /api/admin/players/:id/ban

Ban a player from the game.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the player       |

### Request Body

```json
{
  "reason": "Multi-accounting / botting detected.",
  "duration": 604800,
  "permanent": false
}
```

| Field     | Type    | Required | Description                                        |
|-----------|---------|----------|----------------------------------------------------|
| reason    | string  | Yes      | Reason for the ban (logged in audit)               |
| duration  | number  | No       | Ban duration in seconds (ignored if permanent)     |
| permanent | boolean | No       | If true, ban is permanent (default: false)         |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Multi-accounting detected.", "duration": 604800, "permanent": false}' \
  "https://api.universe-civ.com/api/admin/players/player-uuid-1/ban"
```

### Response Schema (200)

```json
{
  "success": true,
  "ban": {
    "id": "ban-11223344-...",
    "playerId": "player-uuid-1",
    "reason": "Multi-accounting detected.",
    "permanent": false,
    "duration": 604800,
    "expiresAt": "2026-07-05T10:30:00Z",
    "issuedBy": "admin-uuid",
    "issuedAt": "2026-06-28T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description                   |
|------|-------------------------------|
| 200  | Player banned                 |
| 400  | Invalid duration / already banned |
| 401  | Unauthorized                  |
| 403  | Forbidden (not admin)         |
| 404  | Player not found              |

---

## POST /api/admin/players/:id/unban

Unban a previously banned player.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the player       |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/admin/players/player-uuid-1/unban"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": "Player CaptainProxima has been unbanned."
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Player unbanned       |
| 400  | Player is not banned  |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |
| 404  | Player not found      |

---

## POST /api/admin/players/:id/message

Send a system message to a player. The message appears in the player's in-game inbox.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the player       |

### Request Body

```json
{
  "subject": "Warning: Inactivity",
  "message": "Your account has been inactive for 30 days. Please log in to avoid deletion."
}
```

| Field   | Type   | Required | Description                    |
|---------|--------|----------|--------------------------------|
| subject | string | Yes      | Message subject (max 100 chars)|
| message | string | Yes      | Message body (max 2000 chars)  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Warning: Inactivity", "message": "Your account has been inactive for 30 days."}' \
  "https://api.universe-civ.com/api/admin/players/player-uuid-1/message"
```

### Response Schema (200)

```json
{
  "success": true,
  "messageId": "sysmsg-11223344-..."
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Message sent          |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |
| 404  | Player not found      |

---

## POST /api/admin/players/:id/resources

Adjust a player's resources. Can add or remove any resource type.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the player       |

### Request Body

```json
{
  "resources": {
    "credits": 1000000,
    "metal": 500000,
    "crystal": 250000,
    "deuterium": 100000,
    "darkMatter": 500
  },
  "reason": "Compensation for server outage on 2026-06-27"
}
```

| Field     | Type   | Required | Description                               |
|-----------|--------|----------|-------------------------------------------|
| resources | object | Yes      | Resources to add (use negative to deduct) |
| reason    | string | Yes      | Reason for adjustment (logged in audit)   |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"resources": {"credits": 1000000, "metal": 500000, "crystal": 250000, "deuterium": 100000}, "reason": "Compensation for server outage"}' \
  "https://api.universe-civ.com/api/admin/players/player-uuid-1/resources"
```

### Response Schema (200)

```json
{
  "success": true,
  "previousBalance": { "credits": 500000, "metal": 350000, "crystal": 200000, "deuterium": 80000 },
  "newBalance": { "credits": 1500000, "metal": 850000, "crystal": 450000, "deuterium": 180000 },
  "adjustment": { "credits": 1000000, "metal": 500000, "crystal": 250000, "deuterium": 100000 }
}
```

### Status Codes

| Code | Description                            |
|------|----------------------------------------|
| 200  | Resources adjusted                     |
| 400  | Invalid amount / player would go negative |
| 401  | Unauthorized                           |
| 403  | Forbidden (not admin)                  |
| 404  | Player not found                       |

---

## POST /api/admin/universes/create

Create a new game universe (game world).

### Request Body

```json
{
  "name": "Andromeda",
  "galaxyCount": 9,
  "difficulty": "normal",
  "speedMultiplier": 1.0,
  "settings": {
    "fleetSpeed": 1.0,
    "economySpeed": 1.0,
    "researchSpeed": 1.0,
    "resourceMultiplier": 1.0,
    "debrisMultiplier": 0.3,
    "newbieProtection": { "enabled": true, "duration": 604800, "maxScore": 50000 },
    "maxColoniesPerPlayer": 9
  }
}
```

| Field           | Type   | Required | Default  | Description                              |
|-----------------|--------|----------|----------|------------------------------------------|
| name            | string | Yes      | —        | Universe name                            |
| galaxyCount     | number | Yes      | —        | Number of galaxies (1–99)                |
| difficulty      | string | No       | normal   | `easy`, `normal`, `hard`, `expert`       |
| speedMultiplier | number | No       | 1.0      | Game speed multiplier (0.5–5.0)          |
| settings        | object | No       | —        | Advanced universe settings               |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Andromeda", "galaxyCount": 9, "difficulty": "normal", "speedMultiplier": 1.0}' \
  "https://api.universe-civ.com/api/admin/universes/create"
```

### Response Schema (200)

```json
{
  "success": true,
  "universe": {
    "id": "uni-a1b2c3d4-...",
    "name": "Andromeda",
    "galaxyCount": 9,
    "difficulty": "normal",
    "speedMultiplier": 1.0,
    "status": "inactive",
    "createdAt": "2026-06-28T10:30:00Z",
    "estimatedSize": "5.2 GB"
  }
}
```

### Status Codes

| Code | Description            |
|------|------------------------|
| 200  | Universe created       |
| 400  | Invalid parameters     |
| 401  | Unauthorized           |
| 403  | Forbidden (not admin)  |

---

## POST /api/admin/universes/:id/reset

Reset a universe to its initial state. Requires explicit confirmation.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the universe       |

### Request Body

```json
{
  "confirm": true,
  "backupFirst": true
}
```

| Field      | Type    | Required | Description                                   |
|------------|---------|----------|-----------------------------------------------|
| confirm    | boolean | Yes      | Must be `true` to proceed                     |
| backupFirst| boolean | No       | If true, creates a backup before resetting    |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"confirm": true, "backupFirst": true}' \
  "https://api.universe-civ.com/api/admin/universes/uni-a1b2c3d4-.../reset"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": "Universe Andromeda has been reset.",
  "backup": { "id": "backup-11223344-...", "size": "5.2 GB", "createdAt": "2026-06-28T10:30:00Z" },
  "playersAffected": 1240
}
```

### Status Codes

| Code | Description                |
|------|----------------------------|
| 200  | Universe reset             |
| 400  | Confirmation not provided  |
| 401  | Unauthorized               |
| 403  | Forbidden (not admin)      |
| 404  | Universe not found         |

---

## POST /api/admin/events/create

Create a new in-game event.

### Request Body

```json
{
  "type": "resource_boost",
  "name": "Double Resources Weekend",
  "startDate": "2026-07-01T00:00:00Z",
  "endDate": "2026-07-03T23:59:59Z",
  "config": {
    "multiplier": 2.0,
    "affectedResources": ["metal", "crystal", "deuterium"],
    "affectsAlliances": true
  }
}
```

| Field     | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| type      | string | Yes      | Event type: `resource_boost`, `combat_event`, `expedition_bonus`, `build_speed`, `research_speed`, `custom` |
| name      | string | Yes      | Display name for the event                       |
| startDate | string | Yes      | ISO 8601 start timestamp                         |
| endDate   | string | Yes      | ISO 8601 end timestamp                           |
| config    | object | Yes      | Event-specific configuration parameters          |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"type": "resource_boost", "name": "Double Resources Weekend", "startDate": "2026-07-01T00:00:00Z", "endDate": "2026-07-03T23:59:59Z", "config": {"multiplier": 2.0, "affectedResources": ["metal", "crystal", "deuterium"], "affectsAlliances": true}}' \
  "https://api.universe-civ.com/api/admin/events/create"
```

### Response Schema (200)

```json
{
  "success": true,
  "event": {
    "id": "evt-a1b2c3d4-...",
    "type": "resource_boost",
    "name": "Double Resources Weekend",
    "startDate": "2026-07-01T00:00:00Z",
    "endDate": "2026-07-03T23:59:59Z",
    "config": { "multiplier": 2.0, "affectedResources": ["metal", "crystal", "deuterium"], "affectsAlliances": true },
    "status": "scheduled",
    "createdBy": "admin-uuid",
    "createdAt": "2026-06-28T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Event created         |
| 400  | Invalid dates / config |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |

---

## POST /api/admin/events/:id/start

Force-start a scheduled event immediately.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the event        |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/admin/events/evt-a1b2c3d4-.../start"
```

### Response Schema (200)

```json
{
  "success": true,
  "event": { "id": "evt-a1b2c3d4-...", "status": "active", "startedAt": "2026-06-28T10:30:00Z" }
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Event started            |
| 400  | Event already active / ended |
| 401  | Unauthorized             |
| 403  | Forbidden (not admin)    |
| 404  | Event not found          |

---

## POST /api/admin/events/:id/end

Force-end an active event immediately.

### Path Parameters

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | string | UUID of the event        |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/admin/events/evt-a1b2c3d4-.../end"
```

### Response Schema (200)

```json
{
  "success": true,
  "event": { "id": "evt-a1b2c3d4-...", "status": "ended", "endedAt": "2026-06-28T10:30:00Z" }
}
```

### Status Codes

| Code | Description             |
|------|-------------------------|
| 200  | Event ended             |
| 400  | Event not active        |
| 401  | Unauthorized            |
| 403  | Forbidden (not admin)   |
| 404  | Event not found         |

---

## GET /api/admin/stats

Get overall server statistics.

### Example Request

```bash
curl -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  "https://api.universe-civ.com/api/admin/stats"
```

### Response Schema (200)

```json
{
  "players": { "total": 15842, "activeToday": 3201, "activeWeek": 10450, "newToday": 45 },
  "empires": { "total": 15200, "withAlliance": 12400, "topScore": 28500000 },
  "fleets": { "total": 85000, "inTransit": 3200, "inCombat": 145 },
  "activeUsers": { "current": 1240, "peakToday": 2100, "peakAllTime": 5500 },
  "serverLoad": {
    "cpu": { "current": 45, "average": 52, "max": 78 },
    "memory": { "used": "12.5 GB", "total": "32 GB", "percentage": 39 },
    "dbConnections": { "active": 42, "idle": 18, "max": 200 }
  },
  "dbSize": "45.2 GB",
  "uptime": 1209600,
  "version": "2.5.1",
  "lastRestart": "2026-06-15T00:00:00Z"
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Stats returned        |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |

---

## GET /api/admin/logs

View audit logs with optional filters.

### Query Parameters

| Field     | Type   | Required | Default | Description                              |
|-----------|--------|----------|---------|------------------------------------------|
| type      | string | No       | —       | Filter by log type (ban, resource, login, admin_action, system) |
| playerId  | string | No       | —       | Filter by player UUID                    |
| dateFrom  | string | No       | —       | ISO 8601 start date                      |
| dateTo    | string | No       | —       | ISO 8601 end date                        |
| page      | number | No       | 1       | Page number                              |
| limit     | number | No       | 50      | Items per page (max 200)                 |

### Example Request

```bash
curl -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  "https://api.universe-civ.com/api/admin/logs?type=ban&dateFrom=2026-06-01T00:00:00Z&page=1&limit=20"
```

### Response Schema (200)

```json
{
  "logs": [
    {
      "id": "log-11223344-...",
      "type": "ban",
      "action": "player_banned",
      "adminId": "admin-uuid-1",
      "adminName": "AdminUser",
      "playerId": "player-uuid-1",
      "playerName": "CaptainProxima",
      "details": { "reason": "Multi-accounting detected.", "duration": 604800, "permanent": false },
      "ipAddress": "192.168.1.100",
      "timestamp": "2026-06-28T10:30:00Z"
    },
    {
      "id": "log-22334455-...",
      "type": "resource",
      "action": "resource_adjustment",
      "adminId": "admin-uuid-1",
      "adminName": "AdminUser",
      "playerId": "player-uuid-2",
      "playerName": "JediMaster",
      "details": { "adjustment": { "credits": 1000000 }, "reason": "Compensation" },
      "ipAddress": "192.168.1.100",
      "timestamp": "2026-06-27T14:00:00Z"
    }
  ],
  "total": 2450,
  "page": 1,
  "limit": 20
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Logs returned         |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |

---

## POST /api/admin/config

Update a game configuration value. Changes may require a server restart.

### Request Body

```json
{
  "key": "economy.baseProductionMultiplier",
  "value": 1.5
}
```

| Field | Type   | Required | Description                             |
|-------|--------|----------|-----------------------------------------|
| key   | string | Yes      | Dot-notation config key                 |
| value | any    | Yes      | New value (type depends on key)         |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"key": "economy.baseProductionMultiplier", "value": 1.5}' \
  "https://api.universe-civ.com/api/admin/config"
```

### Response Schema (200)

```json
{
  "success": true,
  "key": "economy.baseProductionMultiplier",
  "previousValue": 1.0,
  "newValue": 1.5,
  "requiresRestart": false
}
```

### Status Codes

| Code | Description               |
|------|---------------------------|
| 200  | Config updated            |
| 400  | Invalid key / value type  |
| 401  | Unauthorized              |
| 403  | Forbidden (not admin)     |

---

## GET /api/admin/config

Get all current game configuration values.

### Example Request

```bash
curl -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  "https://api.universe-civ.com/api/admin/config"
```

### Response Schema (200)

```json
{
  "config": {
    "economy": {
      "baseProductionMultiplier": 1.5,
      "maxColoniesPerPlayer": 9,
      "debrisMultiplier": 0.3,
      "newbieProtectionDuration": 604800
    },
    "combat": {
      "maxRounds": 8,
      "fleetSaveTimeout": 300,
      "debrisFieldRate": 0.3
    },
    "research": {
      "baseRPPointPerLab": 10,
      "scientistRPPRate": 3,
      "maxQueueSize": 3
    },
    "fleets": {
      "baseSpeed": 2500,
      "fuelConsumptionMultiplier": 1.0,
      "maxFleetsPerPlayer": 50
    },
    "alliances": {
      "maxMembers": 100,
      "creationCost": 50000,
      "minScoreToCreate": 100000
    },
    "server": {
      "maintenanceMode": false,
      "maintenanceMessage": "",
      "maxPlayersPerUniverse": 10000,
      "tickRate": 1000
    }
  }
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Config returned       |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |

---

## POST /api/admin/maintenance

Enable or disable maintenance mode. When enabled, all non-admin API requests receive a maintenance response.

### Request Body

```json
{
  "enabled": true,
  "message": "The universe is undergoing scheduled maintenance. Estimated downtime: 2 hours."
}
```

| Field   | Type    | Required | Description                                     |
|---------|---------|----------|-------------------------------------------------|
| enabled | boolean | Yes      | Enable or disable maintenance mode              |
| message | string  | No       | Maintenance message shown to players (max 500)  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "X-Admin-Key: <admin-key>" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true, "message": "Scheduled maintenance. Estimated downtime: 2 hours."}' \
  "https://api.universe-civ.com/api/admin/maintenance"
```

### Response Schema (200)

```json
{
  "success": true,
  "maintenance": {
    "enabled": true,
    "message": "The universe is undergoing scheduled maintenance. Estimated downtime: 2 hours.",
    "setAt": "2026-06-28T10:30:00Z",
    "setBy": "admin-uuid"
  }
}
```

### Status Codes

| Code | Description           |
|------|-----------------------|
| 200  | Maintenance mode toggled |
| 401  | Unauthorized          |
| 403  | Forbidden (not admin) |
