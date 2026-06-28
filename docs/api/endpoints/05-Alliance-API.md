# Alliance API

Endpoints for creating, managing, and interacting with player alliances.

---

## Authentication

All endpoints marked **Auth: required** must include a valid JWT bearer token:

```
Authorization: Bearer <token>
```

---

## POST /api/alliances

Create a new alliance.

### Request Body

```json
{
  "name": "Galactic Republic",
  "tag": "GAR",
  "description": "A peaceful alliance dedicated to exploration and trade."
}
```

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| name        | string | Yes      | Alliance name (3–30 characters)          |
| tag         | string | Yes      | Short tag (2–8 uppercase characters)     |
| description | string | No       | Alliance description (max 500 chars)     |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Galactic Republic", "tag": "GAR", "description": "A peaceful alliance dedicated to exploration and trade."}' \
  "https://api.universe-civ.com/api/alliances"
```

### Response Schema (200)

```json
{
  "alliance": {
    "id": "alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Galactic Republic",
    "tag": "GAR",
    "description": "A peaceful alliance dedicated to exploration and trade.",
    "founder": { "id": "player-uuid", "name": "SenatorPalp" },
    "members": [
      { "id": "player-uuid", "name": "SenatorPalp", "rank": "founder", "joinedAt": "2026-06-28T10:30:00Z" }
    ],
    "memberCount": 1,
    "stats": { "score": 0, "rank": 0, "totalMembers": 1 },
    "createdAt": "2026-06-28T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description            |
|------|------------------------|
| 200  | Alliance created       |
| 400  | Name/tag taken / invalid |
| 401  | Unauthorized           |

---

## GET /api/alliances

List all alliances with optional search and sorting.

### Query Parameters

| Field  | Type   | Required | Default | Description                           |
|--------|--------|----------|---------|---------------------------------------|
| search | string | No       | —       | Search by name or tag                 |
| page   | number | No       | 1       | Page number                           |
| limit  | number | No       | 20      | Items per page (max 100)              |
| sort   | string | No       | score   | Sort field: `score`, `name`, `members`, `created` |

### Example Request

```bash
curl "https://api.universe-civ.com/api/alliances?search=Galactic&page=1&limit=10&sort=score"
```

### Response Schema (200)

```json
{
  "alliances": [
    {
      "id": "alliance-a1b2c3d4-...",
      "name": "Galactic Republic",
      "tag": "GAR",
      "description": "A peaceful alliance dedicated to exploration and trade.",
      "memberCount": 45,
      "score": 12500000,
      "rank": 3,
      "averageScore": 277778,
      "founder": { "id": "founder-uuid", "name": "SenatorPalp" },
      "createdAt": "2026-05-01T08:00:00Z"
    },
    {
      "id": "alliance-b2c3d4e5-...",
      "name": "Dark Empire",
      "tag": "DE",
      "description": "We will rule the galaxy.",
      "memberCount": 82,
      "score": 28000000,
      "rank": 1,
      "averageScore": 341463,
      "founder": { "id": "founder2-uuid", "name": "DarthVader42" },
      "createdAt": "2026-04-15T10:00:00Z"
    }
  ],
  "total": 128,
  "page": 1,
  "limit": 10
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200  | Success     |

---

## GET /api/alliances/:id

Get detailed information about a specific alliance.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Example Request

```bash
curl "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Response Schema (200)

```json
{
  "alliance": {
    "id": "alliance-a1b2c3d4-...",
    "name": "Galactic Republic",
    "tag": "GAR",
    "description": "A peaceful alliance dedicated to exploration and trade.",
    "founder": { "id": "founder-uuid", "name": "SenatorPalp" },
    "createdAt": "2026-05-01T08:00:00Z",
    "settings": {
      "joinType": "application",
      "minScore": 100000,
      "language": "en"
    }
  },
  "members": [
    { "id": "member1-uuid", "name": "SenatorPalp", "rank": "founder", "score": 2500000, "joinedAt": "2026-05-01T08:00:00Z", "lastActive": "2026-06-28T09:00:00Z" },
    { "id": "member2-uuid", "name": "JediMaster", "rank": "leader", "score": 1800000, "joinedAt": "2026-05-02T10:00:00Z", "lastActive": "2026-06-28T08:00:00Z" },
    { "id": "member3-uuid", "name": "CloneTrooper99", "rank": "member", "score": 450000, "joinedAt": "2026-05-10T14:00:00Z", "lastActive": "2026-06-27T22:00:00Z" }
  ],
  "stats": {
    "score": 12500000,
    "rank": 3,
    "totalMembers": 45,
    "averageScore": 277778,
    "totalFleets": 320,
    "totalColonies": 180,
    "totalMilitaryPower": 4500000
  },
  "diplomacy": [
    { "with": { "id": "alliance-b2c3d4e5-...", "name": "Dark Empire", "tag": "DE" }, "relationType": "war", "establishedAt": "2026-06-20T12:00:00Z" },
    { "with": { "id": "alliance-c3d4e5f6-...", "name": "Trade Federation", "tag": "TF" }, "relationType": "nap", "establishedAt": "2026-06-01T08:00:00Z" }
  ]
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Success           |
| 404  | Alliance not found|

---

## POST /api/alliances/:id/join

Request to join an alliance (or auto-join if open enrollment). Requires the player to not already be in an alliance.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/join"
```

### Response Schema (200)

```json
{
  "success": true,
  "status": "pending",
  "message": "Your join request has been submitted. Waiting for approval."
}
```

### Status Codes

| Code | Description                       |
|------|-----------------------------------|
| 200  | Request submitted / auto-joined   |
| 400  | Already in alliance / banned      |
| 401  | Unauthorized                      |
| 404  | Alliance not found                |

---

## POST /api/alliances/:id/invite

Invite a player to join the alliance. Requires `leader` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "playerId": "player2-uuid"
}
```

| Field    | Type   | Required | Description               |
|----------|--------|----------|---------------------------|
| playerId | string | Yes      | UUID of the player to invite |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"playerId": "player2-uuid"}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/invite"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": "Invitation sent to JediMaster."
}
```

### Status Codes

| Code | Description                       |
|------|-----------------------------------|
| 200  | Invitation sent                   |
| 400  | Player already in alliance / invalid |
| 401  | Unauthorized                      |
| 403  | Insufficient permissions          |
| 404  | Alliance or player not found      |

---

## POST /api/alliances/:id/kick

Remove a member from the alliance. Requires `leader` rank or higher. Founder cannot be kicked.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "playerId": "member3-uuid"
}
```

| Field    | Type   | Required | Description                     |
|----------|--------|----------|---------------------------------|
| playerId | string | Yes      | UUID of the member to remove    |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"playerId": "member3-uuid"}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/kick"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": "CloneTrooper99 has been removed from the alliance."
}
```

### Status Codes

| Code | Description               |
|------|---------------------------|
| 200  | Member removed            |
| 400  | Cannot kick founder       |
| 401  | Unauthorized              |
| 403  | Insufficient permissions  |
| 404  | Alliance or player not found |

---

## POST /api/alliances/:id/leave

Leave the current alliance. If the founder leaves, leadership transfers to the next highest-ranking member.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/leave"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": "You have left the alliance."
}
```

### Status Codes

| Code | Description                              |
|------|------------------------------------------|
| 200  | Left alliance                            |
| 400  | Transfer needed (founder leaving) — retry with /transfer |
| 401  | Unauthorized                             |
| 404  | Alliance not found / not a member        |

---

## POST /api/alliances/:id/promote

Change a member's rank in the alliance. Requires `leader` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "playerId": "member2-uuid",
  "rank": "leader"
}
```

| Field    | Type   | Required | Description                                          |
|----------|--------|----------|------------------------------------------------------|
| playerId | string | Yes      | UUID of the member to promote/demote                 |
| rank     | string | Yes      | Target rank: `member`, `officer`, `leader`, `founder` |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"playerId": "member2-uuid", "rank": "leader"}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/promote"
```

### Response Schema (200)

```json
{
  "success": true,
  "member": { "id": "member2-uuid", "name": "JediMaster", "rank": "leader" }
}
```

### Status Codes

| Code | Description                 |
|------|-----------------------------|
| 200  | Rank changed                |
| 400  | Invalid rank / cannot promote self |
| 401  | Unauthorized                |
| 403  | Insufficient permissions    |
| 404  | Alliance or player not found|

---

## POST /api/alliances/:id/diplomacy

Set or update diplomatic relations with another alliance. Requires `leader` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "targetAllianceId": "alliance-c3d4e5f6-...",
  "relationType": "nap"
}
```

| Field            | Type   | Required | Description                                            |
|------------------|--------|----------|--------------------------------------------------------|
| targetAllianceId | string | Yes      | UUID of the target alliance                            |
| relationType     | string | Yes      | `neutral`, `nap` (non-aggression), `trade`, `alliance` |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetAllianceId": "alliance-c3d4e5f6-...", "relationType": "nap"}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/diplomacy"
```

### Response Schema (200)

```json
{
  "success": true,
  "diplomacy": {
    "with": { "id": "alliance-c3d4e5f6-...", "name": "Trade Federation", "tag": "TF" },
    "relationType": "nap",
    "establishedAt": "2026-06-28T10:30:00Z"
  }
}
```

### Status Codes

| Code | Description                 |
|------|-----------------------------|
| 200  | Diplomacy updated           |
| 400  | Invalid relation type / self-target |
| 401  | Unauthorized                |
| 403  | Insufficient permissions    |
| 404  | Alliance not found          |

---

## GET /api/alliances/:id/bank

Get the alliance bank details, including current resource balances and recent transactions.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/bank"
```

### Response Schema (200)

```json
{
  "resources": {
    "credits": 2500000,
    "metal": 1800000,
    "crystal": 1200000,
    "deuterium": 500000
  },
  "transactions": [
    {
      "id": "tx-11223344-...",
      "type": "deposit",
      "player": { "id": "member1-uuid", "name": "SenatorPalp" },
      "resources": { "credits": 500000, "metal": 200000, "crystal": 100000, "deuterium": 50000 },
      "timestamp": "2026-06-27T14:00:00Z"
    },
    {
      "id": "tx-22334455-...",
      "type": "withdrawal",
      "player": { "id": "member2-uuid", "name": "JediMaster" },
      "resources": { "metal": 300000, "crystal": 150000 },
      "reason": "Fleet construction",
      "timestamp": "2026-06-26T09:00:00Z"
    }
  ]
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Success           |
| 401  | Unauthorized      |
| 404  | Alliance not found|

---

## POST /api/alliances/:id/bank/deposit

Deposit resources into the alliance bank.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "resources": {
    "credits": 100000,
    "metal": 50000,
    "crystal": 25000,
    "deuterium": 10000
  }
}
```

| Field     | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| resources | object | Yes      | Resources to deposit (at least one > 0) |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resources": {"credits": 100000, "metal": 50000, "crystal": 25000, "deuterium": 10000}}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/bank/deposit"
```

### Response Schema (200)

```json
{
  "success": true,
  "deposited": { "credits": 100000, "metal": 50000, "crystal": 25000, "deuterium": 10000 },
  "newBalance": { "credits": 2600000, "metal": 1850000, "crystal": 1225000, "deuterium": 510000 }
}
```

### Status Codes

| Code | Description                  |
|------|------------------------------|
| 200  | Deposit successful           |
| 400  | Insufficient player resources|
| 401  | Unauthorized                 |
| 404  | Alliance not found           |

---

## POST /api/alliances/:id/bank/withdraw

Withdraw resources from the alliance bank. Requires `officer` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "resources": {
    "credits": 50000,
    "metal": 100000,
    "crystal": 0,
    "deuterium": 0
  }
}
```

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resources": {"credits": 50000, "metal": 100000, "crystal": 0, "deuterium": 0}}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/bank/withdraw"
```

### Response Schema (200)

```json
{
  "success": true,
  "withdrawn": { "credits": 50000, "metal": 100000, "crystal": 0, "deuterium": 0 },
  "newBalance": { "credits": 2550000, "metal": 1750000, "crystal": 1225000, "deuterium": 510000 }
}
```

### Error Responses

**403 — Insufficient Permissions**

```json
{
  "error": "insufficient_permissions",
  "message": "Withdrawal requires officer rank or higher. Your rank: member.",
  "requiredRanks": ["officer", "leader", "founder"],
  "currentRank": "member"
}
```

**400 — Insufficient Bank Balance**

```json
{
  "error": "insufficient_bank_balance",
  "message": "Alliance bank has only 50000 credits. You requested 200000.",
  "deficit": { "credits": 150000 }
}
```

### Status Codes

| Code | Description                    |
|------|--------------------------------|
| 200  | Withdrawal successful          |
| 400  | Insufficient bank balance      |
| 401  | Unauthorized                   |
| 403  | Insufficient permissions       |
| 404  | Alliance not found             |

---

## POST /api/alliances/:id/message

Send an internal message to all alliance members. Requires `officer` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "subject": "Operation Starfall",
  "message": "All members prepare your fleets. We attack at dawn."
}
```

| Field   | Type   | Required | Description                    |
|---------|--------|----------|--------------------------------|
| subject | string | Yes      | Message subject (max 100 chars)|
| message | string | Yes      | Message body (max 2000 chars)  |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Operation Starfall", "message": "All members prepare your fleets. We attack at dawn."}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/message"
```

### Response Schema (200)

```json
{
  "success": true,
  "message": { "id": "msg-11223344-...", "subject": "Operation Starfall", "sentAt": "2026-06-28T10:30:00Z" }
}
```

### Status Codes

| Code | Description                |
|------|----------------------------|
| 200  | Message sent               |
| 400  | Invalid subject/message    |
| 401  | Unauthorized               |
| 403  | Insufficient permissions   |
| 404  | Alliance not found         |

---

## GET /api/alliances/:id/messages

Get alliance messages. Returns messages sorted by most recent first.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Example Request

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/messages"
```

### Response Schema (200)

```json
{
  "messages": [
    {
      "id": "msg-11223344-...",
      "sender": { "id": "member1-uuid", "name": "SenatorPalp", "rank": "founder" },
      "subject": "Operation Starfall",
      "message": "All members prepare your fleets. We attack at dawn.",
      "sentAt": "2026-06-28T10:30:00Z",
      "readBy": 32,
      "totalMembers": 45
    },
    {
      "id": "msg-22334455-...",
      "sender": { "id": "member2-uuid", "name": "JediMaster", "rank": "leader" },
      "subject": "New Trade Routes",
      "message": "We have secured a new trade agreement with the Trade Federation.",
      "sentAt": "2026-06-27T15:00:00Z",
      "readBy": 40,
      "totalMembers": 45
    }
  ]
}
```

### Status Codes

| Code | Description       |
|------|-------------------|
| 200  | Success           |
| 401  | Unauthorized      |
| 404  | Alliance not found|

---

## POST /api/alliances/:id/war/declare

Declare war on another alliance. Requires `leader` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "targetAllianceId": "alliance-b2c3d4e5-...",
  "casusBelli": "They attacked our member's colony without provocation."
}
```

| Field            | Type   | Required | Description                              |
|------------------|--------|----------|------------------------------------------|
| targetAllianceId | string | Yes      | UUID of the alliance to declare war on   |
| casusBelli       | string | Yes      | Justification for the war (max 500 chars)|

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetAllianceId": "alliance-b2c3d4e5-...", "casusBelli": "They attacked our member colony without provocation."}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/war/declare"
```

### Response Schema (200)

```json
{
  "success": true,
  "war": {
    "id": "war-11223344-...",
    "declaredBy": { "id": "alliance-a1b2c3d4-...", "name": "Galactic Republic" },
    "declaredOn": { "id": "alliance-b2c3d4e5-...", "name": "Dark Empire" },
    "casusBelli": "They attacked our member colony without provocation.",
    "declaredAt": "2026-06-28T10:30:00Z",
    "status": "active"
  }
}
```

### Status Codes

| Code | Description                     |
|------|---------------------------------|
| 200  | War declared                    |
| 400  | Already at war / invalid target |
| 401  | Unauthorized                    |
| 403  | Insufficient permissions        |
| 404  | Alliance not found              |

---

## POST /api/alliances/:id/war/peace

Offer peace terms to end a war. Requires `leader` rank or higher.

### Path Parameters

| Field | Type   | Description                |
|-------|--------|----------------------------|
| id    | string | UUID of the alliance       |

### Request Body

```json
{
  "targetAllianceId": "alliance-b2c3d4e5-...",
  "terms": "Ceasefire immediately. Dark Empire pays 5 million credits in reparations."
}
```

| Field            | Type   | Required | Description                              |
|------------------|--------|----------|------------------------------------------|
| targetAllianceId | string | Yes      | UUID of the alliance to offer peace to   |
| terms            | string | Yes      | Proposed peace terms (max 1000 chars)    |

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetAllianceId": "alliance-b2c3d4e5-...", "terms": "Ceasefire immediately. Dark Empire pays 5 million credits in reparations."}' \
  "https://api.universe-civ.com/api/alliances/alliance-a1b2c3d4-e5f6-7890-abcd-ef1234567890/war/peace"
```

### Response Schema (200)

```json
{
  "success": true,
  "peaceOffer": {
    "id": "peace-11223344-...",
    "offeredBy": { "id": "alliance-a1b2c3d4-...", "name": "Galactic Republic" },
    "offeredTo": { "id": "alliance-b2c3d4e5-...", "name": "Dark Empire" },
    "terms": "Ceasefire immediately. Dark Empire pays 5 million credits in reparations.",
    "offeredAt": "2026-06-28T10:30:00Z",
    "status": "pending"
  }
}
```

### Status Codes

| Code | Description                      |
|------|----------------------------------|
| 200  | Peace offer sent                 |
| 400  | Not at war / invalid target      |
| 401  | Unauthorized                     |
| 403  | Insufficient permissions         |
| 404  | Alliance not found               |
