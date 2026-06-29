# Event System

## Overview

The Event System powers all timed, recurring, and special gameplay events across the game. Events drive player engagement, provide rewards, and create dynamic content.

---

## 1. Event Types

| Type | Scope | Duration | Frequency |
|------|-------|----------|-----------|
| **Universe** | Single universe | 1-7 days | Weekly rotation |
| **Realm** | Entire realm system | 3-14 days | Bi-weekly |
| **Alliance** | Per alliance | 1-7 days | Scheduled |
| **Personal** | Single player | 24h-7d | Triggered |
| **Seasonal** | All servers | 7-30 days | Quarterly |
| **Holiday** | All servers | 3-14 days | Real-world holidays |

---

## 2. Event Scheduling

### Cron-Based Scheduling

```json
{
  "eventId": "resource_boom_weekly",
  "schedule": "0 12 * * 1",     // Every Monday at 12:00 UTC
  "duration": 86400,             // 24 hours in seconds
  "type": "resource_boom",
  "params": {
    "multiplier": 2.0,
    "affectedResources": ["credits", "minerals", "deuterium"]
  }
}
```

### Manual Scheduling

Used for live operations team to trigger events on demand:

```
POST /api/admin/events/trigger
{
  "eventTemplateId": "world_boss_invasion",
  "targetUniverse": "UC-AR-01",
  "startTime": "2026-07-01T18:00:00Z",
  "duration": 7200
}
```

### Participation Requirements

| Requirement | Check |
|-------------|-------|
| Minimum level | `player.level >= event.minLevel` |
| Alliance membership | `player.allianceId != null` |
| Fleet strength | `player.fleetPower >= event.minFleetPower` |
| Location | `player.isInRegion(event.regionId)` |
| Previous completion | `!event.isCompleted(player.id)` |

---

## 3. Event Rewards

### Reward Types

| Reward | Description | Example |
|--------|-------------|---------|
| Resources | Credits, minerals, deuterium, rare elements | 10,000 credits |
| Blueprints | Ship/module schematics | BP: Warp Engine Mk3 |
| Ships | Pre-built ships | 1x Frigate |
| Titles | Cosmetic name prefixes | "Star Lord" |
| Cosmetics | Ship skins, avatar frames | Golden Phoenix skin |
| Premium Currency | Purchased currency | 50 Nexus Crystals |

### Reward Table

```json
{
  "rank": 1,
  "rewards": [
    { "type": "premium_currency", "amount": 500 },
    { "type": "blueprint", "itemId": "battlecruiser_mk5", "quantity": 1 },
    { "type": "title", "titleId": "galactic_conqueror" },
    { "type": "cosmetic", "itemId": "skin_imperial_gold" }
  ]
}
```

---

## 4. Leaderboard Events

Players compete for rank-based rewards.

### Scoring Metrics

| Metric | Weight | Example Event |
|--------|--------|---------------|
| Points | 1.0x | Standard PvP tournament |
| Kills | 1.5x | "Hunt Season" — PvP focus |
| Resources Collected | 0.5x | "Resource Rush" — gather focus |
| Exploration Distance | 2.0x | "Deep Space" — exploration focus |

### Leaderboard Tiers

```
Tier 1 (Rank 1-10):    x5 reward multiplier
Tier 2 (Rank 11-100):  x3 reward multiplier
Tier 3 (Rank 101-500): x2 reward multiplier
Tier 4 (Rank 501+):    x1 reward multiplier
```

---

## 5. Cooperative Events

All players vs. AI threat with cumulative progress goals.

### Example: "Pirate Invasion"

```
Total Fleet Power: 100,000,000
Phase 1: Defeat 10,000 pirate ships (unlocks Phase 2)
Phase 2: Destroy 5 pirate motherships (unlocks Phase 3)
Phase 3: Kill Pirate Lord (final boss)

Reward: All participants receive tiered rewards based on contribution %
```

### Cumulative Goals

```
globalProgress = currentHits / totalHits
milestones: [25%, 50%, 75%, 100%]
each milestone unlocks a global reward for all participants
```

---

## 6. World Boss Events

### Spawn Rules

- Random spawn in designated boss regions
- Spawn timer: 2 hours after previous boss kill
- Announcement: 30-minute warning before spawn
- Max 50 participants per boss instance

### Boss Stats

| Boss | HP | Attack | Defense | Phases |
|------|-----|--------|---------|--------|
| C'tan Shard | 50M | 25,000 | 15,000 | 3 |
| Void Leviathan | 100M | 40,000 | 20,000 | 4 |
| The Obliterator | 200M | 75,000 | 35,000 | 5 |
| Celestial Devourer | 500M | 120,000 | 60,000 | 6 |

### Phase Mechanics

```
Phase 1 (100%-75% HP):  Standard attacks
Phase 2 (75%-50% HP):   AoE attack unlocked (+50% damage)
Phase 3 (50%-25% HP):   Shield regenerates 5%/10s, enrage timer starts
Phase 4 (25%-0% HP):    All attacks doubled, spawns minions
```

### Loot Distribution

```
contributionPercent = playerDamage / totalDamage
lootRolls = floor(contributionPercent × 10) + 1  // min 1 roll
```

### Respawn Timer

```
respawnTimer = baseTimer × (1 - 0.1 × bossTier)
baseTimer = 7200 seconds (2 hours)
```

---

## 7. Tournament Events

### Bracket Structure

```
256 players → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1
```

### Matchmaking

```
match(playerA, playerB):
    return fleetPower(playerA) within 10% of fleetPower(playerB)
```

### Elimination

- Single elimination format
- Losing player eliminated from tournament
- Winner advances to next round
- Byes granted if bracket count is uneven

---

## 8. Resource Boom Events

```
productionMultiplier = 1.0 + (eventMultiplier - 1.0) × hoursRemaining / totalHours
type: "resource_boom"
triggerConditions: { "activePlayers > 1000", "serverAge > 7 days" }
```

Affected resources gain a production bonus for the event duration.

---

## 9. Event Configuration Format

```json
{
  "$schema": "event-config-v1.json",
  "eventId": "string",
  "eventType": "universe | realm | alliance | personal | seasonal | holiday",
  "name": { "en": "English Name", "fr": "French Name" },
  "description": { "en": "English description" },
  "schedule": {
    "type": "cron | manual | trigger",
    "cron": "0 0 * * *",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "duration": 86400
  },
  "requirements": {
    "minLevel": 10,
    "minFleetPower": 5000,
    "allianceRequired": false
  },
  "rewards": [
    { "rank": 1, "rewards": [...] }
  ],
  "balancing": {
    "scaling": "linear | exponential | fixed",
    "baseMultiplier": 1.0,
    "levelFactor": 0.1
  }
}
```

---

## 10. Event Balancing

Reward scaling by player level:

```
finalReward = baseReward × (1 + playerLevel × levelFactor)
levelFactor = 0.05  // 5% more reward per level
```

---

## 11. Recurring Event Schedule

| Day | Event | Type |
|-----|-------|------|
| Monday | Resource Boom | Universe |
| Tuesday | Pirate Hunt | Universe |
| Wednesday | Alliance War | Alliance |
| Thursday | Exploration Rush | Universe |
| Friday | World Boss | Realm |
| Saturday | PvP Tournament | Realm |
| Sunday | Mega Weekend (all bonuses) | Universe |
