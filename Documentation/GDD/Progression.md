# Progression System Reference

## Civilization Tiers (1–15)

| Tier | Title | Min Score | Min Colonies | Min Research |
|------|-------|-----------|-------------|-------------|
| 1 | Outpost | 0 | 1 | 0 |
| 2 | Settlement | 1,000 | 1 | 5 |
| 3 | Colony | 5,000 | 2 | 15 |
| 4 | Province | 25,000 | 3 | 30 |
| 5 | Planetary State | 75,000 | 4 | 50 |
| 6 | Planetary Government | 200,000 | 5 | 75 |
| 7 | Star Nation | 500,000 | 6 | 100 |
| 8 | Star Kingdom | 1,000,000 | 7 | 150 |
| 9 | Stellar Empire | 2,500,000 | 8 | 200 |
| 10 | Galactic Empire | 5,000,000 | 9 | 300 |
| 11 | Galactic Federation | 10,000,000 | 10 | 400 |
| 12 | Galactic Dominion | 25,000,000 | 12 | 500 |
| 13 | Intergalactic Empire | 50,000,000 | 15 | 650 |
| 14 | Universal Empire | 100,000,000 | 20 | 800 |
| 15 | Ascendant Civilization | 250,000,000 | 25 | 1,000 |

**Progress formula:** `Math.min(scoreRatio, colonyRatio, researchRatio)`

**Source:** `shared/config/civilizationTierConfig.ts`
**API:** `POST /api/progression/civilization-tier` `{ score, colonies, totalResearchLevels }`

## Technology Ages (1–8)

| Age | Name | Description |
|-----|------|-------------|
| 1 | Primitive | Early spaceflight, basic industrial capacity |
| 2 | Industrial | Mass production, orbital infrastructure |
| 3 | Space Age | Full solar system colonization |
| 4 | Interstellar | Hyperspace travel, cross-system trade |
| 5 | Galactic | Spacetime manipulation, instant travel |
| 6 | Quantum | Subspace comms, teleportation |
| 7 | Dark Matter | Reality-warping weapons |
| 8 | Transcendent | Reality manipulation, ascension |

**Source:** `shared/config/technologyAgeConfig.ts`
**API:** `POST /api/progression/technology-age` `{ requirements: { "techId": level, ... } }`

## Empire Score Ranks (1–7)

| Rank | Title | Score Range | Bonuses |
|------|-------|------------|---------|
| 1 | New Commander | 0–4,999 | — |
| 2 | Scout | 5,000–24,999 | +2% production |
| 3 | Captain | 25,000–99,999 | +5% prod, +2% attack |
| 4 | Commodore | 100,000–499,999 | +8% prod, +5% attack, +3% def |
| 5 | Admiral | 500,000–4,999,999 | +10% prod, +8% attack, +5% def, +5% research |
| 6 | Fleet Marshal | 5,000,000–99,999,999 | +15% prod, +12% attack, +8% def, +8% research |
| 7 | Grand Admiral | 100,000,000+ | +20% prod, +18% attack, +12% def, +12% research |

**Source:** `shared/config/empireScoreRankConfig.ts`
**API:** `POST /api/progression/score-rank` `{ totalScore }`

## Commander Level Milestones (1–100)

Milestone unlocks at levels: 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100.

Each milestone grants a title, bonus type, and feature unlock.

**Source:** `shared/config/commanderLevelConfig.ts`
**API:** `POST /api/progression/commander-level` `{ level }`

## Score Calculation

```
economy_score  = Σ building_levels × 10
research_score = Σ research_levels × 15
fleet_score    = Σ ship_count × (metal + crystal cost) / 1000
defense_score  = Σ defense_count × (metal + crystal + deuterium) / 1000
military_score = fleet_score + defense_score
total_score    = economy + research + military
```

**SQL function:** `database/functions/001_calculate_empire_score.sql`
**API:** `POST /api/progression/calculate-score` `{ fleetScore, defenseScore, researchScore, economyScore }`

## OGame Building Costs

```
cost(level) = baseCost × growthRate^(level-1)
```

**Source:** `shared/config/ogameProgressionConfig.ts`
**API:** `POST /api/progression/building-cost` `{ buildingId, level }`
**API:** `POST /api/progression/building-production` `{ buildingId, level, energyFactor? }`
