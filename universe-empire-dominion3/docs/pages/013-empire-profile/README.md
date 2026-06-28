# 013 - Empire Profile
- **Route:** `/empire-profile`
- **Page:** `client/src/pages/EmpireProfile.tsx`
- **Routes:** `server/routes-empire-profile.ts`
- **Config:** `shared/config/empireProfileConfig.ts`
- **Schema:** `empire_profiles` table (9 integer attributes + JSONB tracking)
- **Description:** 9-attribute empire specialization system. Allocate points to Military, Economy, Research, Industry, Diplomacy, Espionage, Exploration, Governance, Innovation.
- **Key Features:** Attribute cards with upgrade controls, cost calculator, power rating, tier names, overview tab.
- **API:** `GET /api/empire-profile`, `PUT /api/empire-profile/allocate`, `GET /api/empire-profile/config`, `POST /api/empire-profile/grant-points`
