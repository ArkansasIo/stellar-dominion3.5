# Frontend Scaffold: Xenoberage

## Build & Config

| Config | File | Notes |
|--------|------|-------|
| Vite | `vite.config.ts` | React + Tailwind + Replit plugins |
| TypeScript | `tsconfig.json` | ES2020 target, strict mode, bundler resolution |
| Components | `components.json` | shadcn/ui new-york style, Lucide icons |

> **Source:** `vite.config.ts` - Build configuration
> **Source:** `tsconfig.json` - TypeScript configuration
> **Source:** `components.json` - shadcn/ui component configuration

### Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@/` | `client/src/` |
| `@shared/` | `shared/` |
| `@assets/` | `attached_assets/` |

### Build Output

- Root: `client/`
- Public: `client/public/`
- Output: `dist/public/`

---

## Pages (90+ Routes)

### Core Gameplay

| Page | File | Description |
|------|------|-------------|
| Overview | `pages/Overview.tsx` | Main dashboard / planet overview |
| Empire View | `pages/EmpireView.tsx` | Empire-wide status |
| Empire Command Center | `pages/EmpireCommandCenter.tsx` | Central command hub |
| Empire Progression | `pages/EmpireProgression.tsx` | Level/tier/Kardashev progression |
| Empire Planet Viewer | `pages/EmpirePlanetViewer.tsx` | Browse colonized planets |
| Planet Detail | `pages/PlanetDetail.tsx` | Individual planet stats |
| Planet Command | `pages/PlanetCommand.tsx` | Planet management actions |
| Settings | `pages/Settings.tsx` | Player settings |

### Resources & Economy

| Page | File | Description |
|------|------|-------------|
| Resources | `pages/Resources.tsx` | Resource production overview |
| Power Grid | `pages/PowerGrid.tsx` | Energy management |
| Market | `pages/Market.tsx` | Global buy/sell orders |
| Merchants | `pages/Merchants.tsx` | NPC vendor shop |
| Storefront | `pages/Storefront.tsx` | Premium store |

### Military & Combat

| Page | File | Description |
|------|------|-------------|
| Fleet | `pages/Fleet.tsx` | Ship management |
| Shipyard | `pages/Shipyard.tsx` | Ship construction |
| Combat | `pages/Combat.tsx` | PvP combat interface |
| Battle Logs | `pages/BattleLogs.tsx` | Combat history |
| Orbital Defense | `pages/OrbitalDefense.tsx` | Station defense systems |
| Ground Combat | `pages/GroundCombat.tsx` | Troop-based combat |
| Army | `pages/Army.tsx` | Troop roster |
| Army Management | `pages/ArmyManagement.tsx` | Squad/unit management |
| Training Center | `pages/TrainingCenter.tsx` | Troop training |

### Research & Technology

| Page | File | Description |
|------|------|-------------|
| Research | `pages/Research.tsx` | Tech tree browser |
| Research Lab | `pages/ResearchLab.tsx` | Active research management |
| Tech Tree | `pages/TechTree.tsx` | Visual tech tree |
| Technology Tree | `pages/TechnologyTree.tsx` | Alternative tree view |
| Research Analytics Dashboard | `pages/ResearchAnalyticsDashboard.tsx` | Research stats |

### Exploration & Universe

| Page | File | Description |
|------|------|-------------|
| Galaxy | `pages/Galaxy.tsx` | Galaxy map |
| Universe | `pages/Universe.tsx` | Universe-wide view |
| Universe Generator | `pages/UniverseGenerator.tsx` | Procedural generation |
| Navigation | `pages/Navigation.tsx` | Travel routes |
| Interstellar | `pages/Interstellar.tsx` | FTL travel |
| Warp Network | `pages/WarpNetwork.tsx` | Wormhole network |
| Exploration | `pages/Exploration.tsx` | Exploration missions |
| Expeditions | `pages/Expeditions.tsx` | Expedition system |
| Celestial Browser | `pages/CelestialBrowser.tsx` | Stars/planets browser |
| Biome Codex | `pages/BiomeCodex.tsx` | Planet biome database |
| Biome Detail | `pages/BiomeDetail.tsx` | Individual biome info |
| Knowledge Library | `pages/KnowledgeLibrary.tsx` | Discovered knowledge |

### Buildings & Infrastructure

| Page | File | Description |
|------|------|-------------|
| Facilities | `pages/Facilities.tsx` | Building management |
| Colonies | `pages/Colonies.tsx` | Colony list |
| Planetary Occupation | `pages/PlanetaryOccupation.tsx` | Territory control |
| Stations | `pages/Stations.tsx` | Orbital station management |
| MegaStructures | `pages/MegaStructures.tsx` | End-game megastructure UI |

### Social & Multiplayer

| Page | File | Description |
|------|------|-------------|
| Alliance | `pages/Alliance.tsx` | Alliance management |
| Guilds | `pages/Guilds.tsx` | Guild system |
| Friends List | `pages/FriendsList.tsx` | Social friends list |
| Messages | `pages/Messages.tsx` | In-game mail |
| Forums | `pages/Forums.tsx` | Community forums |
| Leaderboard | `pages/Leaderboard.tsx` | Player rankings |
| Factions | `pages/Factions.tsx` | NPC faction reputation |

### PvE Content

| Page | File | Description |
|------|------|-------------|
| Raids | `pages/Raids.tsx` | Raid management |
| Raid Bosses | `pages/RaidBosses.tsx` | Boss encounter list |
| Raid Finder | `pages/RaidFinder.tsx` | Matchmaking |
| Universe Events | `pages/UniverseEvents.tsx` | Active world events |

### Items & Equipment

| Page | File | Description |
|------|------|-------------|
| Artifacts | `pages/Artifacts.tsx` | Artifact collection |
| Relics | `pages/Relics.tsx` | Relic management |
| Blueprints | `pages/Blueprints.tsx` | Megastructure blueprints |
| Fitting | `pages/Fitting.tsx` | Ship fitting |
| Fitting Enhanced | `pages/FittingEnhanced.tsx` | Advanced fitting |
| Skills | `pages/Skills.tsx` | Skill tree |

### Progression & Meta

| Page | File | Description |
|------|------|-------------|
| Commander | `pages/Commander.tsx` | Commander character |
| Government | `pages/Government.tsx` | Government type selection |
| Achievements | `pages/Achievements.tsx` | Achievement tracker |
| Story Mode | `pages/StoryMode.tsx` | Campaign story |
| Battle Pass | `pages/BattlePass.tsx` | Seasonal pass |
| Season Pass | `pages/SeasonPass.tsx` | Season rewards |

### Civilization & Worldbuilding

| Page | File | Description |
|------|------|-------------|
| Civilization Management | `pages/CivilizationManagement.tsx` | Civ development |
| Civilization Systems | `pages/CivilizationSystems.tsx` | Civ tech branches |

### Admin & Tools

| Page | File | Description |
|------|------|-------------|
| Admin | `pages/Admin.tsx` | Admin dashboard |
| Admin Control | `pages/AdminControl.tsx` | Admin controls |
| Admin Login | `pages/AdminLogin.tsx` | Admin auth |
| Database Admin | `pages/DatabaseAdmin.tsx` | DB management |
| Server Console | `pages/ServerConsole.tsx` | Server terminal |
| Diagnostics | `pages/Diagnostics.tsx` | System diagnostics |

### 3D & Visuals

| Page | File | Description |
|------|------|-------------|
| ThreeD Viewer Portal | `pages/ThreeDViewerPortal.tsx` | 3D model viewer |
| Game Assets Gallery | `pages/GameAssetsGallery.tsx` | Asset browser |

### Auth & Legal

| Page | File | Description |
|------|------|-------------|
| Auth | `pages/Auth.tsx` | Login/register |
| Account Setup | `pages/AccountSetup.tsx` | New account wizard |
| OGame Compendium | `pages/OgameCompendium.tsx` | Reference database |
| About | `pages/About.tsx` | About page |
| Terms | `pages/Terms.tsx` | Terms of service |
| Privacy | `pages/Privacy.tsx` | Privacy policy |
| Not Found | `pages/not-found.tsx` | 404 page |

> **Source:** `client/src/pages/*.tsx` - All 90+ page components

---

## Client Libraries (60+ modules)

### Core Systems

| Library | File | Description |
|---------|------|-------------|
| API Client | `lib/api-client.ts` | HTTP request layer |
| Query Client | `lib/queryClient.ts` | React Query configuration |
| Auth Utils | `lib/authUtils.ts` | Authentication helpers |
| Utils | `lib/utils.ts` | General utilities (shadcn `cn`) |

### Game Data

| Library | File | Description |
|---------|------|-------------|
| Unit Data | `lib/unitData.ts` | Ship/unit definitions |
| Tech Data | `lib/techData.ts` | Technology definitions |
| Research Data | `lib/researchData.ts` | Research tree data |
| Market Data | `lib/marketData.ts` | Market pricing data |
| Faction Data | `lib/factionData.ts` | NPC faction data |
| Artifact Data | `lib/artifactData.ts` | Artifact definitions |
| Station Data | `lib/stationData.ts` | Station type data |
| Military Data | `lib/militaryData.ts` | Military unit data |
| Government Data | `lib/governmentData.ts` | Government type data |
| Skills Data | `lib/skillsData.ts` | Skill tree data |
| Interstellar Data | `lib/interstellarData.ts` | FTL/wormhole data |
| Vendor Data | `lib/vendorData.ts` | NPC vendor inventories |
| Cron Data | `lib/cronData.ts` | Scheduled task definitions |

### Game Logic

| Library | File | Description |
|---------|------|-------------|
| Game Logic | `lib/gameLogic.ts` | Combat simulation, espionage, sabotage |
| Combat System | `lib/combatSystem.ts` | Extended combat mechanics |
| Combat Engine | `lib/combatEngine.ts` | Low-level combat calculations |
| Resource Math | `lib/resourceMath.ts` | Resource calculation utilities |
| Empire Manager | `lib/empireManager.ts` | Empire state management |
| Colony Systems | `lib/colonySystems.ts` | Colony mechanics |
| Government Systems | `lib/governmentSystems.ts` | Government bonuses/effects |
| Commander Systems | `lib/commanderSystems.ts` | Commander progression |

### Tech Trees & Catalogs

| Library | File | Description |
|---------|------|-------------|
| Technology Types | `lib/technologyTypes.ts` | TypeScript tech interfaces |
| Technology Division Catalog | `lib/technologyDivisionCatalog.ts` | Tech division definitions |
| Research Technology Tree Catalog | `lib/researchTechnologyTreeCatalog.ts` | Full research tree |
| Research Lab Administration | `lib/researchLabAdministration.ts` | Lab management logic |
| Starship Line Catalog | `lib/starshipLineCatalog.ts` | Ship class definitions |
| OGame Buildings | `lib/ogameBuildings.ts` | OGame building reference |
| OGame Ships | `lib/ogameShips.ts` | OGame ship reference |
| OGame Research | `lib/ogameResearch.ts` | OGame research reference |
| Ship Fitting Modules | `lib/shipFittingModules.ts` | Fitting module data |
| Blueprint System | `lib/blueprintSystem.ts` | Blueprint crafting |
| Refinery Systems Catalog | `lib/refinerySystemsCatalog.ts` | Refinery operations |
| Facility Operations Catalog | `lib/facilityOperationsCatalog.ts` | Facility operations |
| Facility Expansion Catalog | `lib/facilityExpansionCatalog.ts` | Facility upgrades |
| Megastructure Expansion Catalog | `lib/megastructureExpansionCatalog.ts` | Megastructure upgrades |
| Kardashev Upgrade Catalog | `lib/kardashevUpgradeCatalog.ts` | Kardashev progression |
| Wormhole Stronghold Catalog | `lib/wormholeStrongholdCatalog.ts` | Wormhole data |

### Combat & Military

| Library | File | Description |
|---------|------|-------------|
| Military Attributes | `lib/militaryAttributes.ts` | Military stat definitions |
| Orbital Defense System | `lib/orbitalDefenseSystem.ts` | Station defense logic |
| Skills 90 System | `lib/skills90System.ts` | 90-skill progression |

### Universe & Navigation

| Library | File | Description |
|---------|------|-------------|
| Universe Seed | `lib/universeSeed.ts` | Procedural seed generation |
| Universe Events | `lib/universeEvents.ts` | World event logic |
| Celestial Objects | `lib/celestialObjects.ts` | Star/planet object definitions |
| Planet Utils | `lib/planetUtils.ts` | Planet calculation helpers |
| Planet Dossier | `lib/planetDossier.ts` | Planet detail data |
| Space Anomalies | `lib/spaceAnomalies.ts` | Anomaly definitions |
| Sol System Data | `lib/solSystemData.ts` | Solar system reference |
| Starting Colonies | `lib/startingColonies.ts` | New player colony data |
| Interplanetary Power Grid | `lib/interplanetaryPowerGrid.ts` | Power distribution |
| Interplanetary Power Simulation | `lib/interplanetaryPowerSimulation.ts` | Power simulation |
| Environment Systems | `lib/environmentSystems.ts` | Environmental mechanics |
| Warp Network | `lib/warpNetwork.ts` | Wormhole/fast-travel logic |
| Kardashev Scale | `lib/kardashevScale.ts` | Kardashev progression logic |
| Turn Based MMORPG | `lib/turnBasedMmorpg.ts` | Turn system engine |

### Social & Meta

| Library | File | Description |
|---------|------|-------------|
| Alliance Data | `lib/allianceData.ts` | Alliance definitions |
| Alliance Systems | `lib/allianceSystems.ts` | Alliance mechanics |
| Admin Control Systems | `lib/adminControlSystems.ts` | Admin tool logic |
| Achievements System | `lib/achievementsSystem.ts` | Achievement tracking |
| Artifact Relic Systems | `lib/artifactRelicSystems.ts` | Relic mechanics |
| Commander Types | `lib/commanderTypes.ts` | Commander TypeScript types |
| Blink | `lib/blink.ts` | Animation utilities |
| Time Utils | `lib/timeUtils.ts` | Time formatting |
| Update Client | `lib/update-client.ts` | Client update detection |
| Unit Personnel Gen Clone | `lib/unitPersonnelGenClone.ts` | Unit generation |
| Mega Structures | `lib/megaStructures.ts` | Megastructure logic |

> **Source:** `client/src/lib/*.ts` - All 60+ client library modules

---

## UI Component Library (shadcn/ui)

The project uses **shadcn/ui** with the `new-york` style variant.

### Configuration
- Style: `new-york`
- RSC: `false`
- TSX: `true`
- Base color: `neutral`
- CSS variables: enabled
- Icon library: `lucide`

### Component Aliases
| Alias | Path |
|-------|------|
| `@/components` | `client/src/components/` |
| `@/components/ui` | `client/src/components/ui/` |
| `@/lib` | `client/src/lib/` |
| `@/hooks` | `client/src/hooks/` |
| `@/lib/utils` | `client/src/lib/utils.ts` |

> **Source:** `components.json` - shadcn/ui configuration

---

## TypeScript Configuration

| Option | Value |
|--------|-------|
| Target | ES2020 |
| Module | ESNext |
| JSX | preserve |
| Strict | true |
| Module Resolution | bundler |
| Lib | esnext, dom, dom.iterable |
| Incremental | true |
| ESM Interop | true |
| Skip Lib Check | true |
| Allow Importing TS Extensions | true |
| No Emit | true |

### Included Paths
- `client/src/**/*`
- `shared/**/*`
- `server/**/*`
- `script/**/*`

> **Source:** `tsconfig.json` - Full TypeScript configuration

---

## Project Structure

```
universe-empire-dominion3/
├── client/
│   ├── src/
│   │   ├── pages/          # 90+ route components
│   │   ├── lib/            # 60+ game logic libraries
│   │   ├── components/
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Root app component
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Tailwind CSS entry
│   └── public/             # Static assets
├── shared/
│   ├── config/             # Game configuration
│   │   ├── gameConfig.ts
│   │   ├── technologyTreeConfig.ts
│   │   ├── planetTypesConfig.ts
│   │   └── universeGenerationConfig.ts
│   └── schema.ts           # Database schema (2020 lines)
├── server/                 # Backend API
├── migrations/             # Drizzle migrations
├── vite.config.ts          # Build config
├── tsconfig.json           # TypeScript config
├── components.json         # shadcn/ui config
└── drizzle.config.ts       # Database config
```
