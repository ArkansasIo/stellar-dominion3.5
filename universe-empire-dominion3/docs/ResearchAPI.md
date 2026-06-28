# Technology Research API

REST API reference for the Technology Tree and Research System.

## Base URL

```
/api/research
```

## Source Files

> **Source:** server/routes-research.ts
> **Source:** server/routes-researchlab.ts
> **Source:** server/routes-researchxp.ts
> **Source:** server/routes-recommendations.ts
> **Source:** shared/config/technologyTreeConfig.ts
> **Source:** shared/config/technologyTreeExpandedConfig.ts

## Endpoints

### Tree Information (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tree/stats` | Tree statistics (total techs, branch breakdown) |
| GET | `/tree/branches` | List all branches |
| GET | `/tree/branch/{branchId}` | Get branch technologies |

### Technology Details (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tech/{techId}` | Full tech details |
| GET | `/tech/path/{fromId}/{toId}` | Research path between techs |

### Search & Filter (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=query&rarity=epic` | Search by name/description |
| GET | `/available?playerLevel=10` | Filter by player level |
| GET | `/rarity/{rarity}` | Filter by rarity tier |

### Calculations (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/calculate-cost` | Calculate research cost |
| GET | `/starter-techs` | Get starting technologies |

### Player Research (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/player/progress` | Get research history |
| POST | `/player/start` | Start researching a technology |
| POST | `/player/complete` | Complete current research |
| GET | `/player/recommended` | Get recommendations |

### Research Lab (Auth Required)

> **Source:** server/routes-researchlab.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lab/list` | List all labs |
| POST | `/lab/build` | Build a new lab |
| POST | `/lab/upgrade` | Upgrade a lab |
| GET | `/queue/status` | Get research queue |
| POST | `/queue/add` | Add research to queue |
| POST | `/queue/prioritize` | Prioritize queue item |
| POST | `/queue/cancel` | Cancel queued research |

### Research XP (Auth Required)

> **Source:** server/routes-researchxp.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/xp/status` | Get XP status |
| POST | `/xp/gain` | Gain XP from research |

### Recommendations

> **Source:** server/routes-recommendations.ts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recommended` | Get recommended technologies |

## Technology Tree Structure

> **Source:** shared/config/technologyTreeConfig.ts

11 branches:
- armor, shields, weapons, propulsion, sensors
- power, computing, engineering, resources, medical, hyperspace

2,453+ technologies with:
- Multi-level classification (branch > class > type > category > subcategory)
- Exponential progression (level: 1.15^n, tier: 1.25^n)
- Prerequisite tracking with dependency resolution
- Comprehensive stats system

## Testing

> **Source:** docs/ResearchAPITesting.md

Quick test:
```bash
curl "http://localhost:5000/api/research/tree/stats"
```

## Documentation

- [ResearchAPIEndpointMap.md](ResearchAPIEndpointMap.md) - Visual endpoint map
- [ResearchAPITesting.md](ResearchAPITesting.md) - Testing guide
- [ResearchImplementationGuide.md](ResearchImplementationGuide.md) - Implementation guide
- [ResearchLab.md](ResearchLab.md) - Lab system docs
- [ResearchLabTestSummary.md](ResearchLabTestSummary.md) - Lab test results
- [ResearchDocumentationIndex.md](ResearchDocumentationIndex.md) - Documentation index
