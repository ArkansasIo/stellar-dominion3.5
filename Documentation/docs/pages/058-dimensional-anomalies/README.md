# 058 - Dimensional Anomalies
- **Route:** `/dimensional-anomalies`
- **Page:** `client/src/pages/DimensionalAnomalies.tsx`
- **Routes:** `server/routes-dimensional-anomalies.ts`
- **Config:** `shared/config/dimensionalAnomaliesConfig.ts`
- **Schema:** `dimensional_anomalies` table
- **Description:** 90 unique dimensional gate anomalies across 5 regions (Core, Outer Rim, Deep Space, Exotic Space, Unknown Space).
- **Key Features:** Region filter, rarity system (common→mythic), discover/explore mechanics, cooldown timers, lore text, reward preview, danger levels.
- **Anomaly Types:** wormhole, rift, void_portal, temporal, nexus, gate, abyss, shard, mirror, echo
- **API:** `GET /api/anomalies`, `GET /api/anomalies/config`, `POST /api/anomalies/discover/:id`, `POST /api/anomalies/explore/:id`, `GET /api/anomalies/stats`
