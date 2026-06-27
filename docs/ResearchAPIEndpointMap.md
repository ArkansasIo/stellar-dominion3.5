# Research API Endpoint Map

Visual guide to the Research API structure.

## Source Files

> **Source:** server/routes-research.ts
> **Source:** server/routes-researchlab.ts
> **Source:** server/routes-researchxp.ts
> **Source:** server/routes-recommendations.ts

## Endpoint Tree

```
/api/research
|
+-- Tree Information (Public)
|   +-- GET  /tree/stats                    [Tree statistics]
|   +-- GET  /tree/branches                 [List all branches]
|   +-- GET  /tree/branch/{branchId}        [Get branch techs]
|
+-- Technology Details (Public)
|   +-- GET  /tech/{techId}                 [Tech full details]
|   +-- GET  /tech/path/{fromId}/{toId}     [Research path]
|
+-- Search & Filter (Public)
|   +-- GET  /search?q=query&rarity=epic    [Search by name/desc]
|   +-- GET  /available?playerLevel=10      [Filter by level]
|   +-- GET  /rarity/{rarity}               [Filter by rarity]
|
+-- Calculations (Public)
|   +-- POST /calculate-cost                [Calculate research cost]
|   +-- GET  /starter-techs                 [Starting technologies]
|
+-- Player Research (Auth Required)
|   +-- GET  /player/progress               [Research history]
|   +-- POST /player/start                  [Start research]
|   +-- POST /player/complete               [Complete current]
|   +-- GET  /player/recommended            [Recommendations]
|
+-- Research Lab (Auth Required)
|   +-- GET  /lab/list                      [List all labs]
|   +-- POST /lab/build                     [Build a lab]
|   +-- POST /lab/upgrade                   [Upgrade a lab]
|   +-- GET  /queue/status                  [Research queue]
|   +-- POST /queue/add                     [Add to queue]
|   +-- POST /queue/prioritize              [Prioritize item]
|   +-- POST /queue/cancel                  [Cancel item]
|
+-- Research XP (Auth Required)
|   +-- GET  /xp/status                     [XP status]
|   +-- POST /xp/gain                       [Gain XP]
|
+-- Recommendations (Auth Required)
    +-- GET  /recommended                   [Get recommendations]
```

## Authentication

| Section | Auth Required |
|---------|--------------|
| Tree Information | No |
| Technology Details | No |
| Search & Filter | No |
| Calculations | No |
| Player Research | Yes (session cookie) |
| Research Lab | Yes (session cookie) |
| Research XP | Yes (session cookie) |
| Recommendations | Yes (session cookie) |

## Technology Configuration

> **Source:** shared/config/technologyTreeConfig.ts
> **Source:** shared/config/technologyTreeExpandedConfig.ts

11 branches, 2,453+ technologies, exponential progression scaling.
