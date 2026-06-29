# Mission & Campaign System

## Overview

The Mission & Campaign System provides structured, narrative-driven content for players. Missions progress through a branching campaign, with daily/weekly side content and tutorial flows for new players.

---

## 1. Mission Types

| Type | Persistence | Reset | Max Active |
|------|-------------|-------|------------|
| **Story** | Sequential, one-time | Never | 1 |
| **Side** | Optional, repeatable | After completion | 5 |
| **Daily** | Repeatable | 24h from completion | 10 |
| **Weekly** | Repeatable | 7d from completion | 3 |
| **Event** | Limited time | Event end | Varies |
| **Alliance** | Co-op | Weekly | 5 |
| **Tutorial** | One-time | Never | N/A |

---

## 2. Campaign Structure

### Acts → Chapters → Missions

```
Campaign
├── Act I: "Awakening" (Chapters 1-5)
│   ├── Chapter 1: First Contact
│   │   ├── Mission 1: Build Your First Outpost
│   │   ├── Mission 2: Scan the Neighboring System
│   │   └── Mission 3: Defeat the Pirate Scout
│   ├── Chapter 2: ...
│   └── Chapter 5: The Signal
├── Act II: "Expansion" (Chapters 6-10)
├── Act III: "Conflict" (Chapters 11-15)
└── Act IV: "Ascension" (Chapters 16-20)
```

### Campaign Narrative Overview

| Act | Title | Summary | Level Range |
|-----|-------|---------|-------------|
| I | Awakening | Player crash-lands on frontier planet, establishes first colony, discovers ancient signal | 1-25 |
| II | Expansion | Player builds fleet, allies with factions, explores neighboring systems | 25-75 |
| III | Conflict | Rival empire declares war, player must defend and push back | 75-200 |
| IV | Ascension | Ancient precursor threat awakens, player unites galaxy for final battle | 200+ |

---

## 3. Mission Requirements

### Requirement Types

| Requirement | Example | Validation |
|-------------|---------|-----------|
| Level | `minLevel: 10` | `player.level >= 10` |
| Resources | `cost: { credits: 5000 }` | `player.resources.credits >= 5000` |
| Fleet | `fleetPower: 2000` | `player.fleetPower >= 2000` |
| Buildings | `buildings: { shipyard: 3 }` | `player.buildingLevel("shipyard") >= 3` |
| Research | `research: { warpDrive: 2 }` | `player.researchLevel("warpDrive") >= 2` |
| Alliance | `allianceLevel: 5` | `player.alliance.level >= 5` |

---

## 4. Mission Objectives

### Objective Types

| Type | Description | Progress Tracking |
|------|-------------|-------------------|
| `build` | Construct X building to level Y | `buildingLevel >= target` |
| `research` | Research X technology to level Y | `researchLevel >= target` |
| `defeat` | Defeat X enemies (PvE or PvP) | `killCount >= target` |
| `collect` | Gather X resources | `resourcesCollected >= target` |
| `explore` | Scan coordinates (x, y, z) | `coordinatesScanned === target` |
| `trade` | Trade X amount on marketplace | `tradeVolume >= target` |
| `reach_level` | Reach player level X | `player.level >= target` |
| `have_fleet` | Assemble fleet of X power | `fleetPower >= target` |
| `ally_joined` | Join or create alliance | `player.allianceId != null` |
| `conquer` | Claim X celestial bodies | `claimedBodies >= target` |

### Objective Progress Tracking

```typescript
interface ObjectiveProgress {
  objectiveId: string;
  type: ObjectiveType;
  current: number;        // Current progress
  target: number;         // Required target
  completed: boolean;     // current >= target
  lastUpdated: Date;
}
```

Progress is updated via event listeners:

```
on ResourceCollected(playerId, amount, type):
    forEach activeMission where objective.type === "collect":
        if objective.matches(resourceType):
            objective.progress += amount
            checkCompletion(objective)
```

---

## 5. Mission Rewards

### Reward Types

| Reward | Distribution |
|--------|-------------|
| XP | Direct to player XP pool |
| Resources | Credits, minerals, deuterium |
| Blueprints | Unlockable ship/module schematics |
| Items | Consumables, boosters, modules |
| Reputation | Faction standing increase |
| Special Unlocks | Building/research caps, unique ships |

### Reward Scaling Formula

```
reward = baseReward × (1 + level × 0.1) × difficultyMultiplier
```

| Variable | Description |
|----------|-------------|
| `baseReward` | Mission-defined base amount |
| `level` | Player level at mission start |
| `0.1` | Scaling factor per level |
| `difficultyMultiplier` | Mission difficulty tier (1.0-5.0) |

### Example Rewards Table

| Mission Level | XP Reward | Credit Reward | Blueprint Chance |
|---------------|-----------|---------------|------------------|
| 1-10 | 100-500 | 500-2,000 | 5% |
| 11-25 | 500-2,000 | 2,000-10,000 | 10% |
| 26-50 | 2,000-10,000 | 10,000-50,000 | 15% |
| 51-100 | 10,000-50,000 | 50,000-200,000 | 25% |
| 100+ | 50,000-500,000 | 200,000-1M | 40% |

---

## 6. Mission Chains

### Sequential Chains

Missions can form chains where completion of one unlocks the next.

```json
{
  "chainId": "precursor_artifacts",
  "missions": ["pa_01", "pa_02", "pa_03", "pa_04"],
  "unlockCondition": "previous.completed",
  "branching": {
    "pa_02": {
      "choice_a": { "nextMission": "pa_03_a", "rewards": "combat_bonus" },
      "choice_b": { "nextMission": "pa_03_b", "rewards": "research_bonus" }
    }
  }
}
```

### Branching Paths

```
Mission A
  ├── Choice 1 (Combat route) → Mission B1 → Mission C1 → Ending Alpha
  └── Choice 2 (Diplomacy route) → Mission B2 → Mission C2 → Ending Beta
```

---

## 7. Procedural Mission Generation

Templates populate dynamic parameters to generate unique missions.

### Template Schema

```json
{
  "templateId": "scan_sector",
  "type": "side",
  "objectives": [
    {
      "type": "explore",
      "targetCount": "random(1, 3)",
      "regionRadius": "level * 10",
      "reward": { "credits": "level * 100", "xp": "level * 50" }
    }
  ],
  "difficulty": "playerLevel * 0.8"
}
```

### Mission Difficulty Calculation

```
missionDifficulty = baseDifficulty × (1 + playerLevel × 0.1) × realmSpeedMultiplier

difficultyTier:
  < 100    → Easy
  100-500 → Normal
  500-2K  → Hard
  2K-10K  → Very Hard
  > 10K   → Elite
```

---

## 8. Mission Cooldown & Reset Rules

| Type | Cooldown | Reset Behavior |
|------|----------|----------------|
| Daily | 24h from completion | All daily missions reset at 00:00 UTC if not completed |
| Weekly | 7d from completion | All weekly missions reset Monday 00:00 UTC |
| Side | 4h from completion | Timer per mission slot |
| Event | Until event ends | No individual cooldown |
| Alliance | 7d from completion | Shared alliance cooldown |

---

## 9. Campaign Completion Rewards

| Act | Reward |
|-----|--------|
| I | Unique ship: **Ranger-class Scout**, Title: "Survivor" |
| II | Unique ship: **Colony Cruiser**, Title: "Explorer" |
| III | Unique ship: **Warlord-class Dreadnought**, Title: "Conqueror" |
| IV | Unique ship: **Ascendant-class Titan**, Title: "Galactic Emperor", Skin: "Champion of the Galaxy" |

---

## 10. Mission Journal UI Flow

```
HUD → Mission Journal (hotkey: J)
├── Campaign Tab
│   ├── Act progression bar
│   ├── Chapter list (locked/unlocked/current/completed)
│   └── Active Story Mission (tracking)
├── Daily Tab
│   └── List of active daily missions with progress
├── Weekly Tab
│   └── List of active weekly missions
├── Side Missions Tab
│   └── Generated missions (max 5 active)
└── Event Tab (visible during events)
    └── Limited-time missions
```

---

## 11. Tutorial Mission Flow

New players are guided through an automated tutorial mission chain that triggers on account creation.

```
Step 1:  "Welcome Commander"          → Click system map
Step 2:  "Build Your First Outpost"   → Build command center (auto-queued)
Step 3:  "Gather Resources"           → Assign workers to mine
Step 4:  "Construct a Shipyard"       → Build shipyard
Step 5:  "Build a Scout Ship"         → Queue scout in shipyard
Step 6:  "Scan the Unknown"           → Deploy first probe
Step 7:  "Claim Your First Planet"    → Claim discovered body
Step 8:  "Meet Your Neighbors"        → Open galactic chat
Step 9:  "Join an Alliance"           → Browse and join alliance
Step 10: "Your First Mission"         → Accept Act I, Chapter 1
```

Tutorial missions are automatically accepted and guided with UI highlights. Each step rewards resources to bootstrap the player.
