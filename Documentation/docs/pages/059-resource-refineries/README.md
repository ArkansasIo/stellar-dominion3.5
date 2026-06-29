# 059 - Resource Refineries
- **Route:** `/resource-refineries`
- **Page:** `client/src/pages/ResourceRefineries.tsx`
- **Routes:** `server/routes-resource-refineries.ts`
- **Config:** `shared/config/resourceRefineryConfig.ts`
- **Schema:** `player_refineries` table
- **Description:** 7 refinery types for resource conversion and production. Build, upgrade, select recipes, start/pause, collect.
- **Refinery Types:** Metal Refinery, Crystal Purifier, Deuterium Synthesizer, Dark Matter Extractor, Energy Converter, Resource Recycler, Antimatter Lab
- **Key Features:** Recipe selection, production tracking, efficiency/throughput stats, upgrade paths, pending output display, resource cost calculator.
- **API:** `GET /api/refineries`, `GET /api/refineries/config`, `POST /api/refineries/build`, `POST /api/refineries/upgrade/:id`, `POST /api/refineries/set-recipe/:id`, `POST /api/refineries/collect/:id`, `POST /api/refineries/toggle/:id`
