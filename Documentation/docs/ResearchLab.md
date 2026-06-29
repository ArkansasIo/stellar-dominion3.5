# Research Lab System

Comprehensive research management system for Universe Empire Dominion.

## Source Files

> **Source:** server/routes-researchlab.ts
> **Source:** server/services/researchLabService.ts
> **Source:** shared/config/researchQueueConfig.ts
> **Source:** shared/config/gameAssetsConfig.ts

## Status

Complete and production-ready:
- 13+ API endpoints
- 7 JSONB fields in playerStates
- React UI with React Query v5
- Zero TypeScript errors

## Architecture

```
shared/config/
  gameAssetsConfig.ts          100+ game assets with OGame sizing
  researchQueueConfig.ts       Lab configs, bonuses, penalties

server/
  routes-researchlab.ts        13+ REST API endpoints
  services/researchLabService.ts  Business logic (16 methods)
```

## Features

- 8 configurable research labs with progression
- 20-item research queue with priority management
- Research acceleration (25/50/75/100% speedup options)
- Bonus/penalty system for dynamic gameplay
- Complete asset management for game UI

## Lab Progression

| Level | Cost Multiplier | Speed Bonus |
|-------|----------------|-------------|
| 1 | 1.0x | Base |
| 5 | 3.2x | +20% |
| 10 | 10.0x | +50% |
| 15 | 31.6x | +80% |
| 20 | 100.0x | +120% |

## API Endpoints

### Lab Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lab/list` | List all labs |
| POST | `/lab/build` | Build a new lab |
| POST | `/lab/upgrade` | Upgrade a lab |

### Queue Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/queue/status` | Get research queue |
| POST | `/queue/add` | Add research to queue |
| POST | `/queue/prioritize` | Prioritize queue item |
| POST | `/queue/cancel` | Cancel queued research |

### Acceleration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/accelerate` | Apply speedup to research |
| GET | `/accelerate/options` | Get available speedup options |

## Bonus/Penalty System

| Bonus Type | Effect |
|-----------|--------|
| Lab Synergy | +10% speed per adjacent lab |
| Tech Focus | +25% speed for primary branch |
| Resource Rush | -20% cost, -10% speed |
| Deep Study | +50% speed, +30% cost |

## Database Schema

7 JSONB fields added to `playerStates`:
- `researchLabs` - Lab configurations and levels
- `researchQueue` - Active research queue
- `researchProgress` - Current research progress
- `researchCompleted` - Completed technologies
- `researchBonuses` - Active bonuses
- `researchAccelerations` - Active speedups
- `researchStats` - Research statistics
