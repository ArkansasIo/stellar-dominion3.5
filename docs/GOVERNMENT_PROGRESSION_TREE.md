# Government Progression Tree

**Last Updated:** June 18, 2026

---

## Overview

The Government Progression Tree is a hierarchical system where players unlock governance nodes to enhance their empire's capabilities. Inspired by EVE Online's faction philosophies, it features three core pillars:

- **Stability** — Authority, Control, Security (Red)
- **Law** — Rules, Justice, Legitimacy (Blue)
- **Economic** — Trade, Commerce, Prosperity (Green)

---

## Architecture

### Config

> **Source:** shared/config/governmentProgressionTreeConfig.ts

Defines all governance nodes with properties:
- ID, name, description
- Pillar (stability, law, economic)
- Tier (1-3)
- Level requirements
- Effects (military, resources, infrastructure, etc.)
- Costs (resource costs to unlock)
- Unlock time

### Service

> **Source:** server/services/governmentProgressionService.ts

Manages:
- User government progression state
- Node unlocking and ranking up
- Effect calculation and progression
- Persistent storage of progression data

### API Routes

> **Source:** server/routes-government-progression.ts

REST endpoints for progression management.

### Frontend

> **Source:** client/src/pages/Government.tsx

Integrated into the Government page with a progression status query.

---

## Core Concepts

### Government Nodes

Each node has:
- **ID** — unique identifier (e.g., `gov-stability-t1-n1`)
- **Tier** — 1, 2, or 3
- **Requirements** — minimum level and pillar points
- **Rank System** — nodes can be ranked up to 5 times
- **Effects** — game modifiers that scale with rank

### Progression Formulas

```
Cost = Base Cost × (1.1)^rank
Time = Base Time × (1.08)^rank
Effect = Base Effect × (1.05)^rank
Pillar Level = Pillar Points ÷ 50
```

### Pillar Points

Earned by:
- Unlocking nodes (10 points per rank)
- Ranking up nodes (5 bonus points)
- Government XP with pillar bonus

---

## Available Nodes

### Stability Pillar

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Martial Authority | 1 | 5 | +5% Military Power, Stability +0.1 |
| Provincial Control | 1 | 10 | +8% Infrastructure, Stability +0.15 |
| Absolute Authority | 2 | 15 | +12% Military Power, Stability +0.25 |
| Security Apparatus | 2 | 20 | +25% Law Enforcement, Morale -0.05 |
| Iron Fist Doctrine | 3 | 30 | +25% Military Power, Stability +0.4 |

### Law Pillar

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Legal Foundation | 1 | 5 | +10% Law Enforcement, Trade +3% |
| Civic Rights | 1 | 10 | +12% Population Morale, Resources +5% |
| Democratic Assembly | 2 | 15 | +20% Population Morale, Trade +10%, Science +8% |
| Commercial Law | 2 | 20 | +25% Trade Benefit, Economic +15% |
| Justice Perfect | 3 | 30 | +40% Law Enforcement, Trade +15% |

### Economic Pillar

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Free Market Initiative | 1 | 5 | +8% Trade, Resources +5%, Economic +10% |
| Commercial Networks | 1 | 10 | +15% Trade, Resources +10%, Economic +18% |
| Capitalist Expansion | 2 | 15 | +30% Economic, Resources +20%, Trade +20% |
| Production Optimization | 2 | 20 | +15% Infrastructure, Resources +15%, Economic +20% |
| Economic Dominance | 3 | 30 | +50% Economic, Resources +35%, Trade +30% |

---

## API Endpoints

> **Source:** server/routes-government-progression.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/government/progression` | Get full tree |
| GET | `/api/government/progression/status` | Get user progression status |
| GET | `/api/government/progression/pillars` | Get pillar breakdown |
| GET | `/api/government/progression/available` | Get available nodes |
| POST | `/api/government/progression/unlock` | Unlock a node |
| POST | `/api/government/progression/rank-up` | Rank up a node |
| POST | `/api/government/progression/xp` | Add government XP |
| POST | `/api/government/progression/reset` | Reset progression |

---

## Game Effects

Active nodes provide bonuses in:
- Military Power — combat effectiveness
- Resource Modifiers — production output
- Infrastructure — building speed and capacity
- Population Morale — citizen happiness
- Trade Benefit — trading route efficiency
- Science Bonus — research speed
- Law Enforcement — crime/espionage prevention
- Economic Growth — wealth accumulation
- Stability Generation — passive stability increase

---

## Integration Status

- [x] Config file created (`shared/config/governmentProgressionTreeConfig.ts`)
- [x] Service file created (`server/services/governmentProgressionService.ts`)
- [x] API routes created (`server/routes-government-progression.ts`)
- [x] Frontend integrated (`client/src/pages/Government.tsx`)
- [x] Routes registered in server
- [x] Exports added to `shared/config/index.ts`
- [ ] Database schema (if using persistent DB instead of storage)
- [ ] Gameplay integration (award XP from activities)
- [ ] Balance pass (cost, time, effects)
