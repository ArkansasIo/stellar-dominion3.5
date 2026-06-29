# Realm Systems & Universes

## Overview

The game world is divided into **9 Realm Systems**, each containing **10 universes**. This creates 90 distinct playable universes with varying difficulty, speed, and thematic flavor.

---

## 1. Realm System Map

### Nexus Crown (US Server — Advanced, 1.0x)

The apex cluster of the known galaxy. Home to the oldest empires and most advanced technologies.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-NC-01 | Asgard Prime | Sovereign | Seat of ancient power, high-end PvP |
| UC-NC-02 | Asgard Bastion | Sovereign | Fortress world, defensive meta |
| UC-NC-03 | Asgard Gate | Sovereign | Trade hub, economic focus |
| UC-NC-04 | Asgard Forge | Sovereign | Industrial powerhouse |
| UC-NC-05 | Asgard Sanctum | Sovereign | Research and tech focus |
| UC-NC-06 | Midgard Prime | Dominion | Frontier of expansion |
| UC-NC-07 | Midgard Reach | Dominion | Exploration hotspot |
| UC-NC-08 | Midgard Vale | Dominion | Resource-rich colonies |
| UC-NC-09 | Midgard Haven | Dominion | Neutral trading ground |
| UC-NC-10 | Midgard Watch | Dominion | Military outpost cluster |

### Aurora Reach (EU Server — Intermediate, 1.0x)

A luminous region of nebulae and scientific discovery.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-AR-01 | Alfheim Prime | Ascendant | Center of scientific discovery |
| UC-AR-02 | Alfheim Glade | Ascendant | Lush research colonies |
| UC-AR-03 | Alfheim Spire | Ascendant | Ancient observation towers |
| UC-AR-04 | Alfheim Well | Ascendant | Energy research hub |
| UC-AR-05 | Alfheim Cradle | Ascendant | Birthplace of species |
| UC-AR-06 | Jotunheim Prime | Warfront | Fortress of the giants |
| UC-AR-07 | Jotunheim Pass | Warfront | Contested mountain route |
| UC-AR-08 | Jotunheim Gate | Warfront | Strategic chokepoint |
| UC-AR-09 | Jotunheim Waste | Warfront | Scorched battlefield |
| UC-AR-10 | Jotunheim Peak | Warfront | High-altitude fortress |

### Verdant Expanse (APAC Server — Beginner, 1.1x-1.2x)

Abundant natural resources and new player-friendly environment.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-VE-01 through UC-VE-10 | Vanaheim / Verdant variants | Prosperity | Rich resources, protected starts |

### Crimson Verge (SA Server — Advanced, 1.3x)

Volatile conflict frontier with accelerated gameplay.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-CV-01 through UC-CV-10 | Muspel / Crimson variants | Strike | High-risk high-reward PvP |

### Oblivion Gate (ME Server — Veteran, 1.5x)

Edge of galactic collapse. Fastest speed, highest difficulty, for veteran players only.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-OG-01 through UC-OG-10 | Hel / Oblivion variants | Endgame | Permadeath-lite, max difficulty |

### Celestial Arc (AF Server — Intermediate, 1.0x)

Precursor mysteries and industrial growth.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-CA-01 through UC-CA-10 | Svartalf / Arc variants | Industrial / Ascendant | Balanced mix |

### Void Walker (OCE Server — Advanced, 1.0x)

Dark spaces between galaxies. Stealth and ambush meta.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-VW-01 through UC-VW-10 | Niflheim / Void variants | Shadow | Cloaking emphasis |

### Iron Dominion (IN Server — Intermediate, 1.0x)

Militarized corridor with heavy industry.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-ID-01 through UC-ID-10 | Iron Bastion / Iron Foundry variants | Warfront / Industrial | War-focused |

### Eternal Edge (Antarctica Server — Beginner, 1.0x)

Farthest frontier. New player haven with Dominion and Prosperity realms.

| Universe | Name | Realm Type | Description |
|----------|------|------------|-------------|
| UC-EE-01 through UC-EE-10 | Eternal Frontier / Eternal Wilds variants | Dominion / Prosperity | Safest starting area |

---

## 2. Realm Bonuses

| Realm Type | Bonus |
|------------|-------|
| Sovereign | +15% research speed, +10% diplomatic influence |
| Dominion | +20% territory claiming speed, +10% resource storage |
| Ascendant | +15% scan range, +10% discovery rates |
| Warfront | +15% fleet attack, +10% combat XP |
| Prosperity | +25% resource production, +15% trade income |
| Strike | +20% critical hit chance, +10% salvage |
| Endgame | +30% all stats, permadeath mechanic (1 ship loss = permanent) |
| Industrial | +20% build speed, +15% module effectiveness |
| Shadow | +25% stealth, +20% first-strike damage |

---

## 3. Difficulty Progression

| Tier | Label | Systems | Speed Range | Recommended Level |
|------|-------|---------|-------------|-------------------|
| 1 | Beginner | Verdant Expanse, Eternal Edge | 1.0x-1.2x | 1-30 |
| 2 | Intermediate | Aurora Reach, Celestial Arc, Iron Dominion | 1.0x | 30-100 |
| 3 | Advanced | Nexus Crown, Crimson Verge, Void Walker | 1.0x-1.3x | 100-500 |
| 4 | Veteran | Oblivion Gate | 1.5x | 500+ |

---

## 4. Universe Selection UI Flow

```
Main Menu → Play → [Select Realm System] → [Select Universe] → [Create/Select Character]
                              ↓
                    [Show Realm Bonuses]
                              ↓
                    [Show Universe Info]
                              ↓
                    [Server Status: Online/Load]
```

### Universe Selection Panel

```
┌─────────────────────────────────────┐
│  Realm System: Aurora Reach         │
│  Server: EU  │  Difficulty: Medium  │
│  Speed: 1.0x │  Players: 2,456/5K  │
├─────────────────────────────────────┤
│  [UC-AR-01] Alfheim Prime  ▼  FULL │
│  [UC-AR-02] Alfheim Glade  ●  HIGH │
│  [UC-AR-03] Alfheim Spire  ●  MED  │
│  [UC-AR-04] Alfheim Well   ○  LOW  │
│  ...                                │
└─────────────────────────────────────┘
```

---

## 5. Realm Switching & Migration

### Rules

| Condition | Allowed? | Cost |
|-----------|----------|------|
| Same system, different universe | Yes | 500 credits |
| Different system, same tier | Yes | 2,000 credits |
| Higher tier → Lower tier | Yes | Free |
| Lower tier → Higher tier | No | — |
| During active war | No | — |
| Cooldown between migrations | 30 days | — |

### Migration Effects

- Buildings, research, fleet, and resources transfer
- Active construction/research queues are preserved
- Alliance membership transfers if target universe has same alliance presence
- Ongoing combat timers are cancelled

---

## 6. Seasonal Universe Rotation

Every 90 days, 2-3 universes per realm system are rotated out and replaced with seasonal variants.

| Season | Rotation | Theme |
|--------|----------|-------|
| Season 1 (Jan-Mar) | 2 per system | "Ancient Relics" |
| Season 2 (Apr-Jun) | 3 per system | "Pirate Uprising" |
| Season 3 (Jul-Sep) | 2 per system | "Resource Rush" |
| Season 4 (Oct-Dec) | 3 per system | "Holiday Conflict" |

---

## 7. Universe Interface Definition

```typescript
interface Universe {
  id: string;                    // UUID
  name: string;                  // "Alfheim Prime"
  number: number;                // 1-10 within system
  realmSystem: string;           // "Aurora Reach"
  realmSystemId: string;         // "AR"
  description: string;           // Flavor text
  galaxyCount: number;           // Number of galaxies (3-10)
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Veteran';
  speedMultiplier: number;       // 1.0 to 1.5
  isSeasonal: boolean;           // Is this a seasonal rotation?
  realmType: RealmType;          // Sovereign, Dominion, etc.
  server: string;                // US, EU, APAC, etc.
  maxPlayers: number;            // Server capacity
  activePlayers: number;         // Current population
}
```
