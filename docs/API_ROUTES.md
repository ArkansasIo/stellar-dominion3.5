# API Routes Reference

**Version:** 2.0.0
**Last Updated:** June 18, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Player & Game State](#player--game-state)
3. [Progression](#progression)
4. [Currency & Bank](#currency--bank)
5. [Empire & Rankings](#empire--rankings)
6. [Inventory](#inventory)
7. [Facilities & Buildings](#facilities--buildings)
8. [Combat & Raids](#combat--raids)
9. [Auction House](#auction-house)
10. [Market & Trading](#market--trading)
11. [Messages](#messages)
12. [Alliances](#alliances)
13. [Account Management](#account-management)
14. [Achievements](#achievements)
15. [Admin](#admin)
16. [Army Buildings](#army-buildings)
17. [Army System](#army-system)
18. [Artifacts](#artifacts)
19. [Assets & Asset Library](#assets--asset-library)
20. [Autobuy Resources](#autobuy-resources)
21. [Bank Vault](#bank-vault)
22. [Civilization](#civilization)
23. [Commanders](#commanders)
24. [Constructor Yard](#constructor-yard)
25. [Custom Labs](#custom-labs)
26. [Database Admin](#database-admin)
27. [Diagnostics](#diagnostics)
28. [Empire Combat Universe](#empire-combat-universe)
29. [Espionage](#espionage)
30. [Expeditions](#expeditions)
31. [Forums](#forums)
32. [Friends](#friends)
33. [Galaxy](#galaxy)
34. [Game Actions](#game-actions)
35. [Government Buildings](#government-buildings)
36. [Government Leaders](#government-leaders)
37. [Government Progression](#government-progression)
38. [Guilds](#guilds)
39. [High Command](#high-command)
40. [Leaderboard](#leaderboard)
41. [Life Support](#life-support)
42. [Live Ops](#live-ops)
43. [Megastructures](#megastructures)
44. [Moons](#moons)
45. [Multiplayer Bonuses](#multiplayer-bonuses)
46. [OGame Integration](#ogame-integration)
47. [Orbital Stations](#orbital-stations)
48. [phpMyAdmin](#phpmyadmin)
49. [Planets](#planets)
50. [Realms](#realms)
51. [Recommendations](#recommendations)
52. [Research](#research)
53. [Research Labs](#research-labs)
54. [Research XP](#research-xp)
55. [Resource Trading](#resource-trading)
56. [Settings](#settings)
57. [Smithy](#smithy)
58. [Spore Drive](#spore-drive)
59. [Status & Health](#status--health)
60. [Trades](#trades)
61. [Trading Requests](#trading-requests)
62. [Travel](#travel)
63. [Turn System](#turn-system)
64. [Unit Taxonomy](#unit-taxonomy)
65. [Unit Systems](#unit-systems)
66. [Universe Seed](#universe-seed)
67. [World Actions](#world-actions)

---

## Authentication

> **Source:** server/basicAuth.ts
> **Source:** server/routes.ts:49-105

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Authenticate and create a session |
| POST | `/api/auth/logout` | End current session |
| GET | `/api/auth/user` | Get current authenticated user |
| POST | `/api/auth/reset-password` | Request a password reset |
| POST | `/api/admin/login` | Admin login with security code |

### POST `/api/auth/register`

> **Source:** server/basicAuth.ts:342-387

```typescript
Body: { username: string, password: string, email: string, firstName?: string }
Response: { message: string, user: { id: string, username: string } }
```

### POST `/api/auth/login`

> **Source:** server/basicAuth.ts:389-437

```typescript
Body: { username: string, password: string }
Response: { message: string, user: { id: string, username: string } }
```

### POST `/api/auth/logout`

> **Source:** server/basicAuth.ts:614-620

```typescript
Response: { message: string }
```

### GET `/api/auth/user`

> **Source:** server/basicAuth.ts:539-612

```typescript
Response: { id: string, username: string, email: string, firstName: string, isAdmin: boolean, adminRole: string | null }
```

---

## Player & Game State

> **Source:** server/routes.ts:109-139

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/player/state` | Fetch complete player game state |
| GET | `/api/game/state` | Get game state (backward-compatible alias) |
| PATCH | `/api/game/state` | Update player state with partial data |

### GET `/api/player/state`

> **Source:** server/routes.ts:109-117

```typescript
Response: PlayerState
```

### PATCH `/api/game/state`

> **Source:** server/routes.ts:130-139

```typescript
Body: Partial<PlayerState>
Response: PlayerState
```

---

## Progression

> **Source:** server/routes.ts:143-183

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progression/tier` | Get current tier and experience |
| POST | `/api/progression/tier/add-xp` | Add tier experience |
| GET | `/api/progression/empire` | Get empire level and experience |
| POST | `/api/progression/empire/add-xp` | Add empire experience |

---

## Currency & Bank

> **Source:** server/routes.ts:187-275

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/currency/balance` | Get currency balances |
| POST | `/api/currency/add` | Add currency (admin/system) |
| GET | `/api/currency/transactions` | Get transaction history (last 50) |
| GET | `/api/bank/account` | Get bank account details |
| POST | `/api/bank/deposit` | Deposit currency |
| POST | `/api/bank/withdraw` | Withdraw currency |
| GET | `/api/bank/transactions` | Get bank transaction history |

---

## Empire & Rankings

> **Source:** server/routes.ts:279-296

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/empire/value` | Calculate total empire value |
| GET | `/api/empire/rankings` | Get top 100 empires by value |

---

## Inventory

> **Source:** server/routes.ts:300-311

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get player inventory items |

---

## Facilities & Buildings

> **Source:** server/routes.ts:315-318

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/facilities/types` | Get facility type definitions |

---

## Combat & Raids

> **Source:** server/routes.ts:322-439

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/combat/formations` | Get combat formation options |
| GET | `/api/knowledge/types` | Get knowledge type definitions |
| GET | `/api/knowledge/progress/:type` | Get knowledge progress for a type |
| GET | `/api/bosses` | Get boss definitions (filterable by rarity) |
| POST | `/api/bosses/:bossId/challenge` | Challenge a raid boss |

---

## Auction House

> **Source:** server/routes.ts:443-673

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auctions` | List active auction listings |
| POST | `/api/auctions` | Create a new auction listing |
| GET | `/api/auctions/user/listings` | Get current user's listings |
| GET | `/api/auctions/user/bids` | Get current user's bids |
| POST | `/api/auctions/:auctionId/bid` | Place a bid on an auction |
| POST | `/api/auctions/:auctionId/buyout` | Instantly buy an auction |

### GET `/api/auctions`

Query params: `itemType`, `search`, `sortBy` (`newest` | `ending_soon` | `price_low` | `price_high`)

### POST `/api/auctions`

```typescript
Body: {
  itemType: string, itemId?: string, itemName: string,
  itemDescription?: string, itemRarity?: string,
  quantity?: number, startingPrice: number,
  buyoutPrice?: number, bidIncrement?: number,
  duration?: number // hours (1-72, default 24)
}
```

---

## Market & Trading

> **Source:** server/routes.ts (auction endpoints above serve the market)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/orders` | Get market orders |
| POST | `/api/market/orders` | Create a market order |

---

## Messages

> **Source:** server/routes-messages.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get player messages |
| POST | `/api/messages` | Send a message |
| GET | `/api/messages/:id` | Get a specific message |
| POST | `/api/messages/:id/read` | Mark message as read |
| DELETE | `/api/messages/:id` | Delete a message |

---

## Alliances

> **Source:** server/routes-alliances.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alliances` | List player alliances |
| POST | `/api/alliances` | Create a new alliance |
| GET | `/api/alliances/list` | List all alliances |
| POST | `/api/alliances/create` | Create an alliance |
| POST | `/api/alliances/join` | Join an alliance |
| POST | `/api/alliances/leave` | Leave an alliance |
| GET | `/api/alliances/diplomacy` | Get diplomacy relations |
| POST | `/api/alliances/diplomacy` | Propose diplomacy |
| GET | `/api/alliances/wars` | Get active wars |
| POST | `/api/alliances/wars/declare` | Declare war |

---

## Account Management

> **Source:** server/routes-account.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/account/profile` | Get user profile |
| PATCH | `/api/account/profile` | Update user profile |
| POST | `/api/account/change-password` | Change account password |
| GET | `/api/account/commander` | Get commander profile |
| PUT | `/api/account/commander` | Update commander profile |

---

## Achievements

> **Source:** server/routes-achievements.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/achievements` | List all achievements |
| GET | `/api/achievements/:id` | Get achievement details |
| GET | `/api/achievements/progress` | Get achievement progress |
| POST | `/api/achievements/claim/:id` | Claim an achievement reward |

---

## Admin

> **Source:** server/routes-admin.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/status` | Get admin system status |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id` | Update a user |
| POST | `/api/admin/users/:id/ban` | Ban a user |
| POST | `/api/admin/users/:id/mute` | Mute a user |
| POST | `/api/admin/users/:id/impersonate` | Impersonate a user |
| POST | `/api/admin/universe/reset` | Reset the universe |
| POST | `/api/admin/backup` | Create a backup |
| GET | `/api/admin/audit-log` | Get audit log |
| POST | `/api/admin/config/update` | Update admin config |

---

## Army Buildings

> **Source:** server/routes-army-building-structures.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/army-buildings/catalog` | Get building catalog |
| GET | `/api/army-buildings/meta` | Get building metadata |
| GET | `/api/army-buildings/player` | Get player's buildings |
| POST | `/api/army-buildings/construct` | Construct a building |
| POST | `/api/army-buildings/upgrade` | Upgrade a building |
| POST | `/api/army-buildings/demolish` | Demolish a building |

---

## Army System

> **Source:** server/routes-army-system.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/army/subsystems` | Get army subsystem data |
| GET | `/api/army/units` | Get unit roster |
| GET | `/api/army/status` | Get army status |
| POST | `/api/army/deploy` | Deploy units |
| POST | `/api/army/recall` | Recall units |
| POST | `/api/army/training/start` | Start unit training |
| POST | `/api/army/training/complete` | Complete unit training |

---

## Artifacts

> **Source:** server/routes-artifacts.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artifacts/summary` | Get artifact summary |

---

## Assets & Asset Library

> **Source:** server/routes-assets.ts
> **Source:** server/routes-game-asset-library.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/category/:category` | Get assets by category |
| GET | `/api/assets/:id` | Get asset details |
| POST | `/api/assets/upload` | Upload an asset |
| GET | `/api/assets/manifest/bundle/:bundleId/stats` | Get bundle stats |
| GET | `/api/asset-library` | List asset library |
| GET | `/api/asset-library/list` | List all library items |
| GET | `/api/asset-library/collection/:collection` | Get collection items |

---

## Autobuy Resources

> **Source:** server/routes-autobuyresources.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/autobuy/session/initialize` | Initialize autobuy session |
| GET | `/api/autobuy/session` | Get autobuy session state |
| POST | `/api/autobuy/rules` | Create autobuy rule |
| GET | `/api/autobuy/rules` | List autobuy rules |
| PUT | `/api/autobuy/rules` | Update autobuy rule |
| DELETE | `/api/autobuy/rules` | Delete autobuy rule |
| POST | `/api/autobuy/execute` | Execute autobuy |
| GET | `/api/autobuy/market` | Get market data for autobuy |

---

## Bank Vault

> **Source:** server/routes-bank-vault.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bank-vault/status` | Get vault status |
| POST | `/api/bank-vault/deposit` | Deposit items |
| POST | `/api/bank-vault/withdraw` | Withdraw items |
| POST | `/api/bank-vault/exchange` | Exchange currencies |
| POST | `/api/bank-vault/insurance` | Purchase insurance |
| POST | `/api/bank-vault/upgrade` | Upgrade vault |
| GET | `/api/bank-vault/items/:tab` | Get items by tab |

---

## Civilization

> **Source:** server/routes-civilization-system.ts
> **Source:** server/routes-civilization.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/civilization/state` | Get civilization state |
| GET | `/api/civilization/subsystems` | Get subsystem data |
| GET | `/api/civilization/jobs` | Get available jobs |
| POST | `/api/civilization/assign` | Assign a job |
| POST | `/api/civilization/upgrade` | Upgrade subsystem |
| GET | `/api/civilization/projection` | Get civilization projection |
| GET | `/api/config/civilization-jobs` | Get job config |
| GET | `/api/config/civilization-jobs/domain/:domain` | Jobs by domain |
| GET | `/api/config/civilization-jobs/class/:class` | Jobs by class |
| GET | `/api/config/civilization-jobs/rarity/:rarity` | Jobs by rarity |
| GET | `/api/config/civilization-jobs/classes` | Get job classes |
| GET | `/api/config/civilization-jobs/types` | Get job types |
| GET | `/api/config/civilization-jobs/projection` | Job projection |

---

## Commanders

> **Source:** server/routes-commanders.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/commanders` | List all commanders |
| GET | `/api/commanders/gacha/status` | Get gacha status |
| POST | `/api/commanders/gacha/pull` | Pull from gacha |
| GET | `/api/commanders/inventory` | Get commander inventory |
| GET | `/api/commanders/profile/me` | Get own commander profile |
| PUT | `/api/commanders/profile/me` | Update own commander profile |

---

## Constructor Yard

> **Source:** server/routes-constructor-yard.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/constructor-yard/meta` | Get constructor yard metadata |
| GET | `/api/constructor-yard/catalog` | Get catalog |
| GET | `/api/constructor-yard/status` | Get construction status |
| POST | `/api/constructor-yard/preview` | Preview construction |
| POST | `/api/constructor-yard/start` | Start construction |
| POST | `/api/constructor-yard/complete` | Complete construction |
| POST | `/api/constructor-yard/complete-all` | Complete all constructions |

---

## Custom Labs

> **Source:** server/routes-customlabs.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/labs/create` | Create a lab |
| GET | `/api/labs` | List labs |
| GET | `/api/labs/:id` | Get lab details |
| PUT | `/api/labs/:id` | Update lab |
| DELETE | `/api/labs/:id` | Delete lab |
| POST | `/api/labs/:id/upgrade` | Upgrade lab |
| POST | `/api/labs/:id/research` | Start research in lab |
| GET | `/api/labs/:id/research/status` | Get research status |

---

## Database Admin

> **Source:** server/routes-database-admin.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/db-admin/tables` | List database tables |
| GET | `/api/db-admin/tables/:name/rows` | Get table rows |
| POST | `/api/db-admin/tables/:name/rows` | Insert table rows |
| PUT | `/api/db-admin/tables/:name/rows/:id` | Update table row |
| DELETE | `/api/db-admin/tables/:name/rows/:id` | Delete table row |
| POST | `/api/db-admin/query` | Execute raw query |
| GET | `/api/db-admin/schema` | Get database schema |
| POST | `/api/db-admin/export` | Export database |

---

## Diagnostics

> **Source:** server/routes-diagnostics.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diagnostics/debug` | Get debug info |
| GET | `/api/diagnostics/issues` | List issues |
| GET | `/api/diagnostics/warnings` | List warnings |
| POST | `/api/diagnostics/issues` | Report an issue |
| PUT | `/api/diagnostics/issues/:id` | Update an issue |
| POST | `/api/diagnostics/warnings/:id/acknowledge` | Acknowledge a warning |

---

## Empire Combat Universe

> **Source:** server/routes-empire-combat-universe.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/empire/combat/profiles` | Get combat profiles |
| GET | `/api/empire/combat/effects` | Get combat effects |
| GET | `/api/empire/combat/progression` | Get combat progression |
| GET | `/api/empire/combat/track` | Get combat track |
| GET | `/api/empire/combat/entities` | Get combat entities |
| GET | `/api/empire/combat/events` | Get combat events |
| GET | `/api/empire/combat/bosses` | Get bosses |
| GET | `/api/empire/combat/npcs` | Get NPCs |

---

## Espionage

> **Source:** server/routes-espionage.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/espionage/scan` | Perform a scan |
| POST | `/api/espionage/spy` | Spy on a target |
| POST | `/api/espionage/sabotage` | Sabotage a target |
| GET | `/api/espionage/reports` | Get espionage reports |
| GET | `/api/espionage/agents` | Get agents |
| GET | `/api/espionage/config` | Get espionage config |

---

## Expeditions

> **Source:** server/routes-expeditions.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expeditions/catalog` | Get expedition catalog |
| GET | `/api/expeditions/tiers` | Get expedition tiers |
| GET | `/api/expeditions/levels` | Get expedition levels |

---

## Forums

> **Source:** server/routes-forums.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forums/threads` | List forum threads |
| GET | `/api/forums/threads/:id` | Get thread details |
| POST | `/api/forums/threads` | Create a thread |
| POST | `/api/forums/threads/:id/replies` | Reply to a thread |

---

## Friends

> **Source:** server/routes-friends.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/friends/requests` | Get friend requests |
| POST | `/api/friends/request` | Send friend request |
| POST | `/api/friends/accept/:id` | Accept friend request |
| DELETE | `/api/friends/:id` | Remove friend |

---

## Galaxy

> **Source:** server/routes-galaxy.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/galaxy/system/:systemId` | Get galaxy system |
| GET | `/api/galaxy/search` | Search galaxy |
| GET | `/api/galaxy/scan/:positionId` | Scan a position |
| GET | `/api/galaxy/top-players` | Get top players |
| GET | `/api/galaxy/recent-activity` | Get recent activity |

---

## Game Actions

> **Source:** server/routes-gameactions.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/action/build` | Build a structure |
| POST | `/api/game/action/build-ship` | Build a ship |
| POST | `/api/game/action/fleet/send` | Send a fleet |
| POST | `/api/game/action/fleet/recall` | Recall a fleet |
| POST | `/api/game/action/research` | Start research |
| GET | `/api/game/action/resources/tick` | Resource tick |
| GET | `/api/game/action/construction/missions` | Get construction missions |
| POST | `/api/game/action/mission/start` | Start a mission |

---

## Game Resources & Fleet

> **Source:** server/routes-game.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/game/resources` | Get resources |
| GET | `/api/game/fleet` | Get fleet data |
| GET | `/api/game/technology` | Get technology data |

---

## Government Buildings

> **Source:** server/routes-government-buildings.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/government-buildings` | List all government buildings |
| GET | `/api/government-buildings/:category` | Get buildings by category |
| GET | `/api/government-buildings/:category/sub-categories` | Get sub-categories |
| GET | `/api/government-buildings/:category/:subCategoryId` | Get buildings by sub-category |

---

## Government Leaders

> **Source:** server/routes-government-leaders.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/government/leaders/types` | Get leader types |
| GET | `/api/government/leaders/classes` | Get leader classes |
| GET | `/api/government/appointments` | Get appointments |
| POST | `/api/government/appointments` | Make an appointment |
| DELETE | `/api/government/appointments/:slot` | Remove an appointment |

---

## Government Progression

> **Source:** server/routes-government-progression.ts
> **Source:** shared/config/governmentProgressionTreeConfig.ts
> **Source:** server/services/governmentProgressionService.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/government/progression` | Get progression tree |
| GET | `/api/government/progression/status` | Get user progression status |
| GET | `/api/government/progression/pillars` | Get pillar status |
| GET | `/api/government/progression/available` | Get available nodes |
| POST | `/api/government/progression/unlock` | Unlock a node |
| POST | `/api/government/progression/rank-up` | Rank up a node |
| POST | `/api/government/progression/xp` | Add government XP |
| POST | `/api/government/progression/reset` | Reset progression |

---

## Guilds

> **Source:** server/routes-guilds.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/guilds` | List guilds |
| POST | `/api/guilds` | Create a guild |
| GET | `/api/guilds/:id` | Get guild details |
| POST | `/api/guilds/join` | Join a guild |
| POST | `/api/guilds/leave` | Leave a guild |
| GET | `/api/guilds/:id/chat` | Get guild chat |
| POST | `/api/guilds/:id/chat` | Send guild chat message |

---

## High Command

> **Source:** server/routes-high-command.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/high-command/status` | Get high command status |
| GET | `/api/high-command/ranks` | Get ranks |
| GET | `/api/high-command/officer-slots` | Get officer slots |
| GET | `/api/high-command/strategic-orders` | Get strategic orders |
| GET | `/api/high-command/leader-synergies` | Get leader synergies |
| GET | `/api/high-command/bonuses` | Get bonuses |
| POST | `/api/high-command/assign-officer` | Assign an officer |
| POST | `/api/high-command/remove-officer` | Remove an officer |
| POST | `/api/high-command/issue-order` | Issue a strategic order |
| POST | `/api/high-command/cancel-order` | Cancel a strategic order |
| POST | `/api/high-command/join-war-council` | Join war council |
| POST | `/api/high-command/leave-war-council` | Leave war council |
| POST | `/api/high-command/prestige` | Prestige high command |
| POST | `/api/high-command/rank-up` | Rank up |

---

## Leaderboard

> **Source:** server/routes-leaderboard.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get main leaderboard |
| GET | `/api/leaderboard/:type` | Get leaderboard by type |
| GET | `/api/leaderboard/rank/:userId` | Get user rank |

---

## Life Support

> **Source:** server/routes-lifesupport.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lifesupport/status` | Get life support status |
| GET | `/api/lifesupport/buildings` | Get life support buildings |
| GET | `/api/lifesupport/factory-jobs` | Get factory jobs |
| GET | `/api/lifesupport/population` | Get population data |
| GET | `/api/lifesupport/food-demand` | Get food demand |
| GET | `/api/lifesupport/water-demand` | Get water demand |
| POST | `/api/lifesupport/assign` | Assign life support |

---

## Live Ops

> **Source:** server/routes-liveops.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/liveops/battle-pass` | Get battle pass |
| GET | `/api/liveops/battle-pass/missions` | Get battle pass missions |
| GET | `/api/liveops/season-pass` | Get season pass |
| GET | `/api/liveops/store/featured` | Get featured store items |
| GET | `/api/liveops/store/category/:category` | Get store items by category |
| POST | `/api/liveops/store/purchase` | Purchase store item |
| GET | `/api/liveops/story` | Get story content |
| POST | `/api/liveops/story/progress` | Advance story progress |
| GET | `/api/liveops/commander/talents` | Get commander talents |
| POST | `/api/liveops/commander/talents/unlock` | Unlock a talent |

---

## Megastructures

> **Source:** server/routes-megastructures.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/megastructures/templates` | Get megastructure templates |
| GET | `/api/megastructures/player` | Get player megastructures |
| POST | `/api/megastructures/construct` | Construct megastructure |
| POST | `/api/megastructures/upgrade-level` | Upgrade level |
| POST | `/api/megastructures/upgrade-tier` | Upgrade tier |
| POST | `/api/megastructures/toggle` | Toggle megastructure |

---

## Moons

> **Source:** server/routes-moons.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/moons/planet/:planetId` | Get moons for planet |
| GET | `/api/moons/:moonId` | Get moon details |
| POST | `/api/moons/generate` | Generate a moon |
| POST | `/api/moons/:moonId/build` | Build on moon |
| POST | `/api/moons/:moonId/upgrade` | Upgrade moon module |
| POST | `/api/moons/:moonId/assign` | Assign to moon |
| GET | `/api/moons/:moonId/modules` | Get moon modules |
| GET | `/api/moons/types` | Get moon types |
| GET | `/api/moons/rarity` | Get moon rarity tiers |

---

## Multiplayer Bonuses

> **Source:** server/routes-multiplayerbonuses.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alliances/bonuses/research` | Get alliance research bonuses |
| POST | `/api/alliances/research/join` | Join alliance research |
| GET | `/api/alliances/bonuses/history` | Get bonus history |
| GET | `/api/alliances/bonuses/summary` | Get bonus summary |

---

## OGame Integration

> **Source:** server/routes-ogame.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ogame/seed` | Seed OGame data |
| GET | `/api/ogame/categories` | Get categories |
| GET | `/api/ogame/entries` | Get entries |
| GET | `/api/ogame/entries/:id` | Get entry by ID |
| GET | `/api/ogame/grouped` | Get grouped entries |
| POST | `/api/ogame/cost` | Calculate cost |
| POST | `/api/ogame/production` | Calculate production |
| POST | `/api/ogame/combat-rating` | Calculate combat rating |

---

## Orbital Stations

> **Source:** server/routes-orbital-stations.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orbital-stations/status` | Get station status |
| GET | `/api/orbital-stations/platforms` | Get platforms |
| GET | `/api/orbital-stations/satellites` | Get satellites |
| GET | `/api/orbital-stations/bonuses` | Get station bonuses |
| POST | `/api/orbital-stations/build` | Build station |
| POST | `/api/orbital-stations/upgrade` | Upgrade station |
| POST | `/api/orbital-stations/defense` | Configure defense |
| POST | `/api/orbital-stations/offense` | Configure offense |
| POST | `/api/orbital-stations/shield` | Configure shield |

---

## phpMyAdmin

> **Source:** server/routes-phpmyadmin.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/phpmyadmin` | Admin dashboard |
| POST | `/phpmyadmin/login` | Admin login |
| GET | `/phpmyadmin/dashboard` | Dashboard view |
| GET | `/phpmyadmin/tables` | List tables |
| GET | `/phpmyadmin/tables/:name` | View table |

---

## Planets

> **Source:** server/routes-planets.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/planets` | List player planets |
| GET | `/api/planets/:id` | Get planet details |
| POST | `/api/planets/build` | Build on planet |
| POST | `/api/planets/upgrade` | Upgrade planet |
| POST | `/api/planets/colonize` | Colonize a planet |
| POST | `/api/planets/occupy` | Occupy a planet |
| GET | `/api/planets/:id/resources` | Get planet resources |
| GET | `/api/planets/:id/occupation` | Get occupation status |
| POST | `/api/planets/:id/garrison/extract` | Extract garrison |

---

## Realms

> **Source:** server/routes-realms.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/realms` | List realms |
| GET | `/api/realms/:id` | Get realm details |
| POST | `/api/realms/:id/join` | Join a realm |

---

## Recommendations

> **Source:** server/routes-recommendations.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/recommendations` | Get research recommendations |
| GET | `/api/research/recommendations/strategy` | Get strategy recommendations |

---

## Research

> **Source:** server/routes-research.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/tech-tree` | Get full tech tree |
| GET | `/api/research/branch/:branch` | Get branch details |
| GET | `/api/research/tech/:id` | Get tech details |
| GET | `/api/research/progress` | Get research progress |
| GET | `/api/research/available` | Get available research |
| POST | `/api/research/start` | Start research |
| POST | `/api/research/cancel` | Cancel research |
| GET | `/api/research/rarity/:rarity` | Get techs by rarity |
| GET | `/api/research/rarity/:rarity/progression` | Get rarity progression |

---

## Research Labs

> **Source:** server/routes-researchlab.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/labs` | List research labs |
| GET | `/api/research/labs/:id` | Get lab details |
| POST | `/api/research/labs/assign` | Assign researcher |
| GET | `/api/research/queue` | Get research queue |
| POST | `/api/research/queue/add` | Add to queue |
| POST | `/api/research/queue/reorder` | Reorder queue |
| POST | `/api/research/accelerate` | Accelerate research |
| GET | `/api/research/labs/tiers` | Get lab tiers |

---

## Research XP

> **Source:** server/routes-researchxp.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research/xp` | Get research XP |
| GET | `/api/research/xp/stats` | Get XP statistics |
| GET | `/api/research/xp/levels` | Get XP levels |
| GET | `/api/research/xp/discoveries` | Get discoveries |
| GET | `/api/research/xp/rankings` | Get XP rankings |
| POST | `/api/research/xp/add` | Add research XP |
| POST | `/api/research/xp/discover` | Record a discovery |

---

## Resource Trading

> **Source:** server/routes-resource-trading.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trading/orders` | List trading orders |
| GET | `/api/trading/history` | Get trade history |
| GET | `/api/trading/rates` | Get exchange rates |
| POST | `/api/trading/orders` | Create a trading order |
| POST | `/api/trading/quick-exchange` | Quick currency exchange |
| DELETE | `/api/trading/orders/:id` | Cancel a trading order |
| POST | `/api/trading/orders/:id/fill` | Fill a trading order |

---

## Settings

> **Source:** server/routes-settings.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get player settings |
| PUT | `/api/settings` | Update player settings |
| GET | `/api/settings/notifications` | Get notification settings |
| PUT | `/api/settings/notifications` | Update notification settings |
| GET | `/api/settings/display` | Get display settings |
| PUT | `/api/settings/display` | Update display settings |

---

## Smithy

> **Source:** server/routes-smithy.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/smithy/status` | Get smithy status |
| GET | `/api/smithy/materials` | Get materials |
| GET | `/api/smithy/enchantments` | Get enchantments |
| GET | `/api/smithy/blueprints` | Get blueprints |
| POST | `/api/smithy/temper` | Temper an item |
| POST | `/api/smithy/masterwork` | Create masterwork |
| POST | `/api/smithy/salvage` | Salvage an item |
| POST | `/api/smithy/enchant` | Enchant an item |
| POST | `/api/smithy/learn` | Learn a blueprint |

---

## Spore Drive

> **Source:** server/routes-spore-drive.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/spore-drive/ship/:shipId` | Get drive for ship |
| GET | `/api/spore-drive/:driveId` | Get drive details |
| POST | `/api/spore-drive/generate` | Generate a drive |
| POST | `/api/spore-drive/:driveId/jump` | Execute a jump |
| POST | `/api/spore-drive/:driveId/consume` | Consume drive energy |
| GET | `/api/spore-drive/mycelial` | Get mycelial data |
| GET | `/api/spore-drive/types` | Get drive types |
| GET | `/api/spore-drive/rarity` | Get drive rarity tiers |

---

## Status & Health

> **Source:** server/routes-status.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status/detailed` | Get detailed status |
| GET | `/api/status/health` | Health check |
| GET | `/api/status/metrics` | Get system metrics |
| GET | `/api/status/database` | Get database status |

---

## Trades

> **Source:** server/routes-trades.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trades/incoming` | Get incoming trades |
| GET | `/api/trades/outgoing` | Get outgoing trades |
| POST | `/api/trades/create` | Create a trade offer |
| POST | `/api/trades/accept/:id` | Accept a trade |
| POST | `/api/trades/reject/:id` | Reject a trade |
| DELETE | `/api/trades/:id` | Cancel a trade |

---

## Trading Requests

> **Source:** server/routes-trading.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trading/request/create` | Create trading request |
| GET | `/api/trading/requests` | List trading requests |
| GET | `/api/trading/requests/:id` | Get request details |
| GET | `/api/trading/requests/:id/history` | Get request history |
| GET | `/api/trading/requests/:id/statistics` | Get request statistics |
| GET | `/api/trading/requests/:id/ratings` | Get ratings |
| POST | `/api/trading/requests/:id/accept` | Accept request |
| POST | `/api/trading/requests/:id/reject` | Reject request |

---

## Travel

> **Source:** server/routes-travel.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel/route` | Calculate travel route |
| GET | `/api/travel/cost` | Calculate travel cost |
| GET | `/api/travel/stargates` | List stargates |
| GET | `/api/travel/wormholes` | List wormholes |
| GET | `/api/travel/ftl-drives` | List FTL drives |
| GET | `/api/travel/planets/:type` | Get planets by type |
| GET | `/api/travel/biomes` | List biomes |
| GET | `/api/travel/biomes/:id` | Get biome details |

---

## Turn System

> **Source:** server/routes-turnsystem.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/turns/config` | Get turn configuration |
| GET | `/api/turns/history` | Get turn history |
| GET | `/api/turns/research-mechanics` | Get research mechanics |
| POST | `/api/turns/use` | Use a turn |
| POST | `/api/turns/boost` | Boost a turn |

---

## Unit Taxonomy

> **Source:** server/routes-unit-taxonomy.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/unit-taxonomy/meta` | Get taxonomy metadata |
| GET | `/api/unit-taxonomy/domains` | List domains |
| GET | `/api/unit-taxonomy/domain/:domain` | Get domain details |
| GET | `/api/unit-taxonomy/domain/:domain/category/:id` | Get category |
| GET | `/api/unit-taxonomy/domain/:domain/category/:id/sub-category/:id` | Get sub-category |
| GET | `/api/unit-taxonomy/tier-class` | Get tier classes |
| GET | `/api/unit-taxonomy/level-bands` | Get level bands |

---

## Unit Systems

> **Source:** server/routes-unitsystems.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/unit-systems/state` | Get unit system state |
| GET | `/api/unit-systems/templates` | Get unit templates |
| GET | `/api/unit-systems/blueprints` | Get starship blueprints |
| GET | `/api/unit-systems/construction` | Get construction queue |
| POST | `/api/unit-systems/train` | Train units |
| POST | `/api/unit-systems/untrain` | Untrain units |
| POST | `/api/unit-systems/combat` | Combat simulation |
| POST | `/api/unit-systems/simulate` | Simulate combat |
| POST | `/api/unit-systems/construct` | Construct starship |

---

## Universe Seed

> **Source:** server/routes-universe-seed.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/universe/seed` | Get seed configuration |
| GET | `/api/universe/seed/config` | Get seed config details |
| GET | `/api/universe/seed/system/:coords` | Get system by coordinates |
| GET | `/api/universe/seed/stats` | Get universe statistics |
| POST | `/api/universe/seed/generate` | Generate universe |

---

## World Actions

> **Source:** server/routes-worldactions.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/world/exchange` | Exchange resources |
| GET | `/api/world/market/history` | Get market history |
| GET | `/api/world/market/trends` | Get market trends |
| GET | `/api/world/market/stats` | Get market statistics |
| POST | `/api/world/market/auction` | Create auction |
| GET | `/api/world/market/auctions` | List auctions |
| POST | `/api/world/market/auction/bid` | Place auction bid |

---

## Error Handling

All routes return standard HTTP error codes:

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (not logged in) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not found |
| `409` | Conflict (e.g. username taken) |
| `500` | Server error |

Error response format:

```typescript
{ message: string, code?: string, errors?: Array<{ field: string, message: string }> }
```

---

## Authentication

> **Source:** server/basicAuth.ts:623-672

All protected routes require authentication via:

1. **Session cookie** — HTTP-only `connect.sid` cookie set during login
2. **Basic Auth header** — `Authorization: Basic <base64(user:pass)>`
3. **Dev bypass** — auto-authenticates in development when `DEV_AUTH_BYPASS` is enabled

The `isAuthenticated` middleware at `server/basicAuth.ts:623` checks session first, then falls back to Basic Auth, then dev bypass.
