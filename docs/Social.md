# Social Systems

The Social module encompasses all player-to-player and player-to-group interaction systems: Alliances, Guilds, Friends, Forums, and Messaging. These systems enable cooperative gameplay, diplomacy, communication, and community building across the galaxy.

> **Source:** `server/routes-alliances.ts` - alliances API
> **Source:** `server/routes-guilds.ts` - guilds API
> **Source:** `server/routes-friends.ts` - friends API
> **Source:** `server/routes-forums.ts` - forums API
> **Source:** `server/routes-messages.ts` - messages API
> **Source:** `client/src/pages/Alliance.tsx` - Alliance command center UI
> **Source:** `client/src/pages/Guilds.tsx` - Guild management UI
> **Source:** `client/src/pages/FriendsList.tsx` - Friends network UI
> **Source:** `client/src/pages/Forums.tsx` - Community forums UI
> **Source:** `client/src/pages/Messages.tsx` - Messaging and trading UI
> **Source:** `client/src/lib/allianceSystems.ts` - Alliance upgrade/research/technology logic
> **Source:** `client/src/lib/allianceData.ts` - Alliance type definitions and mock data

---

## Table of Contents

1. [Alliance System](#alliance-system)
2. [Guild System](#guild-system)
3. [Friends System](#friends-system)
4. [Forum System](#forum-system)
5. [Messaging & Trade System](#messaging--trade-system)
6. [API Reference](#api-reference)

---

## Alliance System

Alliances are large-scale player factions (up to **150 members**) that provide collective bonuses through upgrades, research, and technology unlocks. Each alliance has a tag, treasury, diplomatic relations, war tracking, and joint military operations.

### Alliance Structure

| Rank | Permissions |
|------|------------|
| `leader` | Full control: create diplomacy, launch/resolve operations, manage members |
| `officer` | Can launch/resolve joint operations and manage diplomacy |
| `member` | Standard participation, can join operations |
| `recruit` | New member with limited access |

### Alliance Treasury

Each alliance maintains a shared treasury of four resources:

| Resource | Default Balance |
|----------|----------------|
| Metal | 350,000 |
| Crystal | 280,000 |
| Deuterium | 220,000 |
| Credits | 180,000 |

Members contribute resources to fund upgrades, research, and technology unlocks. The treasury is stored per-alliance and persisted via the `storage` layer.

### Alliance Systems (Upgrades, Research, Technologies)

The alliance systems engine (`allianceSystems.ts`) provides three progression tracks, all funded from the shared treasury:

#### Upgrade Tracks

| ID | Name | Max Level | Cost Scale | Bonuses Per Level |
|----|------|-----------|------------|-------------------|
| `command_nexus` | Command Nexus | 12 | 1.32x | +0.8% Economy, +0.4% Diplomacy |
| `fortress_grid` | Fortress Grid | 10 | 1.35x | +1.0% Defense, +0.3% Fleet Coordination |
| `logistics_web` | Logistics Web | 10 | 1.34x | +0.9% Fleet Coordination, +0.4% Expedition Intel |

Cost formula: `baseCost * (costScale ^ currentLevel)` for each resource.

#### Research Tracks

| ID | Name | Max Level | Cost Scale | Bonuses Per Level |
|----|------|-----------|------------|-------------------|
| `collective_ai` | Collective AI Models | 15 | 1.30x | +1.2% Research Speed, +0.3% Expedition Intel |
| `quantum_treaties` | Quantum Treaty Simulation | 10 | 1.28x | +1.0% Diplomacy Strength, +0.5% Economy |
| `deep_range_cartography` | Deep-Range Cartography | 12 | 1.31x | +1.1% Expedition Intel, +0.4% Fleet Coordination |

#### Technology Unlocks (One-time)

| ID | Name | Cost | Bonus Unlock |
|----|------|------|-------------|
| `stellar_trade_web` | Stellar Trade Web | 70K/52K/28K/42K | +6% Economy Boost |
| `phalanx_harmonics` | Phalanx Harmonics | 64K/58K/36K/30K | +5% Fleet, +4% Defense |
| `diplomatic_entanglement` | Diplomatic Entanglement | 46K/62K/32K/48K | +8% Diplomacy, +2% Research |

### Bonus Profile

All alliance systems contribute to a unified `AllianceBonusProfile`:

| Bonus | Source |
|-------|--------|
| `economyBoost` | Command Nexus + Stellar Trade Web |
| `researchSpeed` | Collective AI + Quantum Treaties |
| `fleetCoordination` | Fortress Grid + Logistics Web + Phalanx Harmonics |
| `defenseMatrix` | Fortress Grid + Phalanx Harmonics |
| `diplomacyStrength` | Command Nexus + Quantum Treaties + Diplomatic Entanglement |
| `expeditionIntel` | Logistics Web + Collective AI + Deep-Range Cartography |

### Diplomacy System

Alliances maintain bilateral diplomatic relations with five states:

| State | Description |
|-------|-------------|
| `war` | Active military conflict; war record created on both sides |
| `hostile` | Strategic warning issued |
| `neutral` | Default state |
| `friendly` | Diplomatic talks opened |
| `allied` | Formal alliance proposed |

Diplomacy actions are **reciprocal** — when Alliance A declares war on Alliance B, both alliances receive war records and updated diplomacy entries. Actions available:

- `proposeAlliance` → Sets state to `allied`
- `openTalks` → Sets state to `friendly`
- `issueWarning` → Sets state to `hostile`
- `declareWar` → Sets state to `war`, creates war records on both sides

### War Records

Each war record tracks:

```typescript
{
  id: string;
  enemyAllianceId: string;
  enemyTag: string;
  enemyName: string;
  startDate: string;
  kills: number;
  deaths: number;
  status: "active" | "ended";
  updatedAt: string;
}
```

### Joint Operations (Alliance Combat System)

Alliance members can coordinate military operations against target coordinates.

**Mission Types:**

| Type | Success Threshold | Description |
|------|-------------------|-------------|
| `raid` | 1,800 power | Quick strike operation |
| `siege` | 4,000 power | Extended assault |
| `expedition` | 2,500 power | Exploration mission |

**Operation Lifecycle:**

1. **Draft** — Created by any member with initial power contribution
2. **Launched** — Officers/leaders launch; 10-minute resolution timer set
3. **Completed/Failed** — Resolution rolls `totalPower + random(0-1500)` against threshold

**Rewards:** Successful operations yield `totalPower * 0.45` credits; failures yield `totalPower * 0.08`.

Members can join draft operations to add power (+500 per reinforcement). Maximum 150 operations stored per alliance.

---

## Guild System

Guilds are smaller player organizations focused on cooperative resource management and research contributions.

### Guild Structure

| Field | Description |
|-------|-------------|
| `name` | Unique guild name (min 3 characters) |
| `description` | Guild charter/manifesto |
| `leaderId` | User ID of the guild leader |
| `level` | Guild progression level |
| `totalMembers` | Current member count |
| `maxMembers` | Member capacity |
| `treasury` | Shared resource pool |
| `influence` | Guild influence score |
| `isRecruiting` | Whether new members can join |

### Member Roles

Members are tracked with roles and contribution metrics:

```typescript
{
  id: string;
  guildId: string;
  playerId: string;
  role: "leader" | "member";
  joinedAt: string;
  contributedCurrency: number;
  contributedResearch: number;
}
```

### Guild Chat

Each guild has a persistent chat stream (last 100 messages) stored as a settings entry. Chat messages include sender ID, name, content, and timestamp. Only guild members can read and post.

### Guild Operations

- **Create** — Name + description; founder becomes leader
- **Join** — Must be recruiting and not at capacity; adds member with role `member`
- **Leave** — Leader must transfer leadership first if others remain; last member leaving disbands the guild
- **View Roster** — Members listed with roles and contributions

---

## Friends System

The friends system provides a social roster with friend requests, favorites, and nicknames.

### Friend Record

```typescript
{
  id: string;
  friendId: string;
  nickname: string | null;
  friendName: string;
  isOnline: boolean;
  lastSeen: string;
  isFavorite: boolean;
  notes: string | null;
}
```

### Friend Requests

Requests include an optional message and are validated against:

- Cannot friend yourself
- Cannot duplicate existing friendships
- Cannot send duplicate pending requests
- Cannot accept a request you already received (prevent self-acceptance)

### Operations

| Operation | Endpoint | Description |
|-----------|----------|-------------|
| List friends | `GET /api/friends` | All friends with names resolved |
| List requests | `GET /api/friends/requests` | Incoming friend requests |
| Send request | `POST /api/friends/requests` | By username + optional message |
| Accept | `POST /api/friends/requests/:id/accept` | Accept incoming request |
| Reject | `POST /api/friends/requests/:id/reject` | Decline incoming request |
| Remove | `DELETE /api/friends/:friendId` | Remove from friends list |
| Favorite | `PATCH /api/friends/:friendId/favorite` | Toggle favorite status |
| Nickname | `PATCH /api/friends/:friendId/nickname` | Set custom alias |

---

## Forum System

An in-game community forum with threads, replies, and admin moderation. Forum data is stored in-memory (non-persistent across server restarts).

### Thread Structure

```typescript
{
  id: string;
  title: string;
  category: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  replies: ForumReply[];
}
```

### Forum Rules

- Thread title must be at least 4 characters
- Thread content must be at least 8 characters
- Reply content must be at least 2 characters
- Admin users can reset the entire forum

### Moderation

Admin users (verified via `adminUsers` table) have access to the forum reset endpoint which clears all threads and replies.

---

## Messaging & Trade System

The messaging system combines private messaging with an integrated player-to-player trading system.

### Message Types

| Type | Description |
|------|-------------|
| `system` | Server-generated notifications |
| `combat` | Battle reports with loot/debris data |
| `espionage` | Spy reports with fleet/building/resource intel |
| `alliance` | Alliance-wide communications |
| `player` | Direct player-to-player messages |

### Message Structure

Messages include sender/receiver IDs, subject, body, read status, and optional structured data:

- `battleReport` — Contains winner, losses, loot, debris, and combat log
- `espionageReport` — Contains counter-espionage %, resources, units, buildings

### Trade System

The trade subsystem is accessed through the Messages page and supports resource-for-resource exchanges:

**Trade Offer Structure:**

```typescript
{
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  offerMetal: number;
  offerCrystal: number;
  offerDeuterium: number;
  requestMetal: number;
  requestCrystal: number;
  requestDeuterium: number;
  message: string | null;
  status: "pending" | "accepted" | "declined" | "cancelled" | "expired" | "countered";
  expiresAt: string | null;
  createdAt: string;
}
```

**Trade Lifecycle:**

1. **Create** — Sender specifies recipient, offered resources, and requested resources
2. **Pending** — Awaits recipient action
3. **Accept** — Resources are exchanged between players
4. **Decline** — Trade is rejected
5. **Cancel** — Sender withdraws the offer

---

## API Reference

### Alliance Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/alliances` | Yes | List all alliances with member counts |
| GET | `/api/alliances/mine` | Yes | Current user's alliance with full roster |
| POST | `/api/alliances` | Yes | Create new alliance `{name, tag, description}` |
| POST | `/api/alliances/:id/join` | Yes | Join an alliance |
| POST | `/api/alliances/:id/leave` | Yes | Leave an alliance |
| GET | `/api/alliances/:id/members` | Yes | List alliance members |
| GET | `/api/alliances/:id/diplomacy` | Yes | Get diplomacy relations |
| GET | `/api/alliances/:id/wars` | Yes | Get war records |
| POST | `/api/alliances/:id/diplomacy/actions` | Yes | Execute diplomatic action |
| GET | `/api/alliances/:id/operations` | Yes | List joint operations |
| POST | `/api/alliances/:id/operations` | Yes | Create new operation |
| POST | `/api/alliances/:id/operations/:opId/join` | Yes | Join an operation |
| POST | `/api/alliances/:id/operations/:opId/launch` | Yes | Launch operation (leader/officer) |
| POST | `/api/alliances/:id/operations/:opId/resolve` | Yes | Resolve operation (leader/officer) |

### Guild Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/guilds` | Yes | List all guilds |
| GET | `/api/guilds/mine` | Yes | Current user's guild |
| POST | `/api/guilds` | Yes | Create guild `{name, description}` |
| POST | `/api/guilds/:guildId/join` | Yes | Join a guild |
| POST | `/api/guilds/:guildId/leave` | Yes | Leave a guild |
| GET | `/api/guilds/:guildId/members` | Yes | List guild members |
| GET | `/api/guilds/:guildId/chat` | Yes | Get guild chat messages |
| POST | `/api/guilds/:guildId/chat` | Yes | Post guild chat message |

### Friend Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/friends` | Yes | List friends |
| GET | `/api/friends/requests` | Yes | List incoming requests |
| POST | `/api/friends/requests` | Yes | Send friend request |
| POST | `/api/friends/requests/:id/accept` | Yes | Accept request |
| POST | `/api/friends/requests/:id/reject` | Yes | Reject request |
| DELETE | `/api/friends/:friendId` | Yes | Remove friend |
| PATCH | `/api/friends/:friendId/favorite` | Yes | Toggle favorite |
| PATCH | `/api/friends/:friendId/nickname` | Yes | Set nickname |

### Forum Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/forums/threads` | No | List all threads |
| POST | `/api/forums/threads` | Yes | Create new thread |
| POST | `/api/forums/threads/:threadId/reply` | Yes | Reply to thread |
| POST | `/api/forums/reset` | Yes (Admin) | Reset all forums |

### Message Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages` | Yes | List messages (limit param, max 200) |
| POST | `/api/messages` | Yes | Send message `{toUserId/to, subject, body, type}` |
| PATCH | `/api/messages/:id/read` | Yes | Mark message as read |
| DELETE | `/api/messages/:id` | Yes | Delete message |
