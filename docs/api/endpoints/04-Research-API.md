# Research API

Endpoints for managing technology research, the tech tree, and scientist assignments.

---

## Authentication

All endpoints marked **Auth: required** must include a valid JWT bearer token:

```
Authorization: Bearer <token>
```

---

## GET /api/research

Get the player's overall research status, including all technologies, active queue, and available research points.

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/research"
```

### Response Schema (200)

```json
{
  "technologies": [
    {
      "id": "tech_energy_1",
      "name": "Energy Technology",
      "level": 8,
      "effects": {
        "energyProduction": 1.16,
        "spyProbeSpeed": 1.08
      },
      "progress": {
        "currentRP": 4500,
        "requiredRP": 12800,
        "percentage": 35.2
      },
      "status": "researching"
    },
    {
      "id": "tech_laser_1",
      "name": "Laser Technology",
      "level": 5,
      "effects": {
        "laserWeaponPower": 1.10,
        "combatBonus": 0.05
      },
      "progress": {
        "currentRP": 12800,
        "requiredRP": 12800,
        "percentage": 100.0
      },
      "status": "completed"
    },
    {
      "id": "tech_plasma_1",
      "name": "Plasma Technology",
      "level": 0,
      "effects": {},
      "progress": {
        "currentRP": 0,
        "requiredRP": 25600,
        "percentage": 0.0
      },
      "status": "locked"
    }
  ],
  "queue": [
    {
      "id": "rq-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "techId": "tech_energy_1",
      "currentLevel": 8,
      "targetLevel": 9,
      "rpPerHour": 450,
      "scientistsAssigned": 15,
      "startTime": "2026-06-25T08:00:00Z",
      "estimatedCompletion": "2026-06-30T14:30:00Z",
      "progress": 0.35,
      "position": 1
    }
  ],
  "points": {
    "total": 450,
    "used": 450,
    "available": 0,
    "perHour": 450,
    "breakdown": {
      "fromLaboratories": 380,
      "fromScientists": 45,
      "fromAllianceBonus": 25
    }
  }
}
```

### Status Codes

| Code | Description   |
|------|---------------|
| 200  | Success       |
| 401  | Unauthorized  |

---

## POST /api/research/queue

Add a technology to the research queue. Only one tech can be actively researched at a time; additional entries are queued.

### Request Body

```json
{
  "techId": "tech_hyperspace_1"
}
```

| Field  | Type   | Required | Description                          |
|--------|--------|----------|--------------------------------------|
| techId | string | Yes      | Identifier of the technology to research |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"techId": "tech_hyperspace_1"}' \
  "https://api.universe-civ.com/api/research/queue"
```

### Response Schema (200)

```json
{
  "queueEntry": {
    "id": "rq-b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "techId": "tech_hyperspace_1",
    "currentLevel": 0,
    "targetLevel": 1,
    "rpRequired": 6400,
    "rpPerHour": 450,
    "duration": 51200,
    "position": 1,
    "startTime": "2026-06-28T10:30:00Z",
    "estimatedCompletion": "2026-06-30T04:43:20Z"
  }
}
```

### Error Responses

**400 — Prerequisites Not Met**

```json
{
  "error": "prerequisites_not_met",
  "message": "Hyperspace Technology requires Energy Technology level 5 (current: 3).",
  "missing": [
    { "techId": "tech_energy_1", "name": "Energy Technology", "requiredLevel": 5, "currentLevel": 3 }
  ]
}
```

**400 — Insufficient RP**

```json
{
  "error": "insufficient_rp",
  "message": "You need 6400 RP to research Hyperspace Technology level 1. You have 0 RP available.",
  "required": 6400,
  "available": 0
}
```

**400 — Already In Queue**

```json
{
  "error": "already_in_queue",
  "message": "Hyperspace Technology is already in your research queue."
}
```

### Status Codes

| Code | Description                                |
|------|--------------------------------------------|
| 200  | Added to queue                             |
| 400  | Prerequisites not met / insufficient RP / already queued |
| 401  | Unauthorized                               |

---

## POST /api/research/cancel

Cancel a research queue entry and receive a partial resource refund based on progress.

### Request Body

```json
{
  "queueEntryId": "rq-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

| Field        | Type   | Required | Description                     |
|--------------|--------|----------|---------------------------------|
| queueEntryId | string | Yes      | UUID of the queue entry to cancel |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"queueEntryId": "rq-a1b2c3d4-e5f6-7890-abcd-ef1234567890"}' \
  "https://api.universe-civ.com/api/research/cancel"
```

### Response Schema (200)

```json
{
  "refund": {
    "credits": 12000,
    "metal": 6000,
    "crystal": 4000,
    "deuterium": 1000
  }
}
```

### Status Codes

| Code | Description              |
|------|--------------------------|
| 200  | Cancelled / refunded     |
| 401  | Unauthorized             |
| 404  | Queue entry not found    |

---

## POST /api/research/accelerate

Accelerate an active research project by spending resources to instantly add RP progress.

### Request Body

```json
{
  "queueEntryId": "rq-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "resourceSpend": {
    "credits": 10000,
    "metal": 5000,
    "crystal": 3000,
    "deuterium": 1000
  }
}
```

| Field         | Type   | Required | Description                               |
|---------------|--------|----------|-------------------------------------------|
| queueEntryId  | string | Yes      | UUID of the queue entry to accelerate     |
| resourceSpend | object | Yes      | Resources to convert into RP              |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"queueEntryId": "rq-a1b2c3d4-e5f6-7890-abcd-ef1234567890", "resourceSpend": {"credits": 10000, "metal": 5000, "crystal": 3000, "deuterium": 1000}}' \
  "https://api.universe-civ.com/api/research/accelerate"
```

### Response Schema (200)

```json
{
  "newCompletionTime": "2026-06-29T08:15:00Z",
  "rpAdded": 2800,
  "totalProgress": 0.62,
  "resourcesSpent": { "credits": 10000, "metal": 5000, "crystal": 3000, "deuterium": 1000 }
}
```

### Status Codes

| Code | Description                  |
|------|------------------------------|
| 200  | Research accelerated         |
| 400  | Insufficient resources       |
| 401  | Unauthorized                 |
| 404  | Queue entry not found        |

---

## GET /api/research/tree

Get the full technology tree, optionally filtered by branch.

### Query Parameters

| Field  | Type   | Required | Default | Description                      |
|--------|--------|----------|---------|----------------------------------|
| branch | string | No       | —       | Filter by branch ID name         |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/research/tree?branch=combat"
```

### Response Schema (200)

```json
{
  "branches": [
    {
      "id": "combat",
      "name": "Combat Technologies",
      "position": 1,
      "technologies": [
        {
          "id": "tech_laser_1",
          "name": "Laser Technology",
          "maxLevel": 20,
          "description": "Improves laser weapon damage and unlocks advanced laser weapons.",
          "costMultiplier": 1.5,
          "baseCost": { "metal": 400, "crystal": 200, "deuterium": 0 },
          "baseTime": 3200,
          "prerequisites": [],
          "unlocks": ["tech_ion_1", "tech_gauss_1"]
        },
        {
          "id": "tech_ion_1",
          "name": "Ion Technology",
          "maxLevel": 15,
          "description": "Unlocks ion weapons that deal bonus shield damage.",
          "costMultiplier": 1.6,
          "baseCost": { "metal": 1000, "crystal": 500, "deuterium": 100 },
          "baseTime": 6400,
          "prerequisites": [
            { "techId": "tech_laser_1", "name": "Laser Technology", "requiredLevel": 5 }
          ],
          "unlocks": ["tech_plasma_1"]
        },
        {
          "id": "tech_plasma_1",
          "name": "Plasma Technology",
          "maxLevel": 10,
          "description": "Unlocks devastating plasma weapons with high base damage.",
          "costMultiplier": 1.8,
          "baseCost": { "metal": 4000, "crystal": 2000, "deuterium": 500 },
          "baseTime": 25600,
          "prerequisites": [
            { "techId": "tech_ion_1", "name": "Ion Technology", "requiredLevel": 5 },
            { "techId": "tech_energy_1", "name": "Energy Technology", "requiredLevel": 8 }
          ],
          "unlocks": []
        }
      ]
    },
    {
      "id": "energy",
      "name": "Energy Technologies",
      "position": 2,
      "technologies": [
        {
          "id": "tech_energy_1",
          "name": "Energy Technology",
          "maxLevel": 25,
          "description": "Increases energy production and unlocks advanced energy systems.",
          "costMultiplier": 1.4,
          "baseCost": { "metal": 200, "crystal": 100, "deuterium": 50 },
          "baseTime": 1600,
          "prerequisites": [],
          "unlocks": ["tech_hyperspace_1", "tech_shield_1"]
        }
      ]
    }
  ]
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200  | Success     |
| 401  | Unauthorized|

---

## GET /api/research/:techId

Get detailed information about a specific technology, including the player's current progress and next level cost.

### Path Parameters

| Field  | Type   | Description                          |
|--------|--------|--------------------------------------|
| techId | string | Identifier of the technology (e.g. `tech_laser_1`) |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/research/tech_laser_1"
```

### Response Schema (200)

```json
{
  "tech": {
    "id": "tech_laser_1",
    "name": "Laser Technology",
    "maxLevel": 20,
    "description": "Improves laser weapon damage and unlocks advanced laser weapons.",
    "branch": "combat",
    "baseCost": { "metal": 400, "crystal": 200, "deuterium": 0 },
    "baseTime": 3200,
    "costMultiplier": 1.5,
    "timeMultiplier": 1.4
  },
  "currentLevel": 5,
  "nextLevelCost": {
    "rpRequired": 12800,
    "resources": { "metal": 6400, "crystal": 3200, "deuterium": 0 },
    "time": 34560
  },
  "effects": {
    "current": {
      "laserWeaponPower": 1.10,
      "combatBonus": 0.05
    },
    "nextLevel": {
      "laserWeaponPower": 1.12,
      "combatBonus": 0.06
    }
  },
  "prerequisites": [],
  "unlocks": [
    { "techId": "tech_ion_1", "name": "Ion Technology", "requiredLevel": 5 },
    { "techId": "tech_gauss_1", "name": "Gauss Technology", "requiredLevel": 10 }
  ],
  "status": "completed"
}
```

### Status Codes

| Code | Description        |
|------|--------------------|
| 200  | Success            |
| 401  | Unauthorized       |
| 404  | Technology not found|

---

## POST /api/research/assign-scientists

Assign or reassign scientists to a research project to increase RP production rate.

### Request Body

```json
{
  "techId": "tech_energy_1",
  "count": 20
}
```

| Field  | Type   | Required | Description                                           |
|--------|--------|----------|-------------------------------------------------------|
| techId | string | Yes      | Technology ID to assign scientists to                 |
| count  | number | Yes      | Number of scientists to assign (0 to unassign all)    |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"techId": "tech_energy_1", "count": 20}' \
  "https://api.universe-civ.com/api/research/assign-scientists"
```

### Response Schema (200)

```json
{
  "newRate": 510,
  "completionEstimate": "2026-06-30T04:30:00Z",
  "scientistsAssigned": 20,
  "totalAvailable": 50,
  "remainingUnassigned": 30
}
```

### Status Codes

| Code | Description                     |
|------|---------------------------------|
| 200  | Scientists assigned             |
| 400  | Not enough available scientists |
| 401  | Unauthorized                    |
| 404  | Technology not found            |
