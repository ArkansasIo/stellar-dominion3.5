# Research Implementation Guide

Guide for using and extending the Technology Research System.

## Source Files

> **Source:** server/routes-research.ts
> **Source:** server/routes-researchlab.ts
> **Source:** server/services/researchLabService.ts
> **Source:** shared/config/technologyTreeConfig.ts
> **Source:** shared/config/technologyTreeExpandedConfig.ts
> **Source:** shared/config/technologyTreeQuickReference.ts

## System Overview

- 2,453+ technologies across 11 branches
- Multi-level classification system
- Exponential progression (level: 1.15^n, tier: 1.25^n)
- Prerequisite tracking with dependency resolution
- Comprehensive stats system
- Player research tracking
- REST API with 20+ endpoints

## File Structure

```
shared/config/
  technologyTreeConfig.ts           Base framework & TechTreeManager class
  technologyTreeExpandedConfig.ts   Procedural generators (2,453 techs)
  technologyTreeQuickReference.ts   40+ utility functions
  researchQueueConfig.ts            Lab configs, bonuses, penalties

server/
  routes-research.ts                Research API endpoints
  routes-researchlab.ts             Lab API endpoints
  services/researchLabService.ts    Lab business logic (16 methods)
  services/researchXPService.ts     XP tracking
  services/researchTradingService.ts Trading
  services/researchRecommendationsService.ts Recommendations
```

## Technology Tree Architecture

### Branches

11 technology branches:
- armor, shields, weapons, propulsion, sensors
- power, computing, engineering, resources, medical, hyperspace

### Classification Hierarchy

```
Branch > Class > Type > Category > Subcategory > Classification
```

### Progression Scaling

| Factor | Formula | Description |
|--------|---------|-------------|
| Level | 1.15^n | Per-level cost increase |
| Tier | 1.25^n | Per-tier cost increase |

### Stats System

- Primary stats (direct effects)
- Secondary stats (derived effects)
- Resistance stats (damage reduction)
- Efficiency stats (resource bonuses)
- Reliability stats (proc chances)

## Extending the System

### Adding New Technologies

1. Define in `shared/config/technologyTreeExpandedConfig.ts`
2. Set prerequisites, costs, and stats
3. Run `npm run db:push` to update schema
4. Test with `curl /api/research/tree/stats`

### Adding New Branches

1. Add branch definition to `technologyTreeConfig.ts`
2. Create procedural generator in `technologyTreeExpandedConfig.ts`
3. Add utility functions to `technologyTreeQuickReference.ts`

### Custom Research Mechanics

1. Extend `researchLabService.ts` with new methods
2. Add API endpoints in `routes-researchlab.ts`
3. Update database schema if needed
