# Stellar Dominion™ — Universe Empire Dominions

> **A Next-Generation 4X Space Strategy MMORPG**
> Built with React 19, TypeScript, Express.js, PostgreSQL + Drizzle ORM
>
> **Legacy Foundation:** Universe Empires
> **Live Version:** Alpha 1.5.0
> **Trademark:** Stellar Dominion™ and ArkansasIo™ are trademarks of Stephen

---

## 1. Quick Navigation

| Section | Link | Description |
|---------|------|-------------|
| Architecture | [docs/Architecture.md](docs/Architecture.md) | Complete system architecture |
| UML Design | [docs/STELLAR_DOMINION_UML_DESIGN.md](docs/STELLAR_DOMINION_UML_DESIGN.md) | Full UML diagrams and design |
| API Reference | [docs/API_COMPLETE_GUIDE.md](docs/API_COMPLETE_GUIDE.md) | Complete API routes guide |
| Game Design | [docs/Xenoberage-GDD.md](docs/Xenoberage-GDD.md) | Game design document |
| Database ERD | [docs/Xenoberage-ERD.md](docs/Xenoberage-ERD.md) | Entity relationship diagrams |
| Developer Guide | [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Development guidelines |
| Quick Start | [docs/QUICK_START.md](docs/QUICK_START.md) | Getting started guide |
| Framework Architecture | [docs/FRAMEWORK_ARCHITECTURE.md](docs/FRAMEWORK_ARCHITECTURE.md) | 5-Layer framework details |
| Systems Overview | [docs/SYSTEMS_OVERVIEW.md](docs/SYSTEMS_OVERVIEW.md) | All game systems overview |
| Combat System | [docs/Combat.md](docs/Combat.md) | Combat system design |
| Economy | [docs/Economy.md](docs/Economy.md) | Resource economy |
| Ships | [docs/Ships.md](docs/Ships.md) | Ship types and stats |
| Technology | [docs/Technology.md](docs/Technology.md) | Technology tree |
| Universe & Planets | [docs/UniverseAndPlanets.md](docs/UniverseAndPlanets.md) | Universe generation |
| Interstellar Travel | [docs/Interstellar.md](docs/Interstellar.md) | Space travel system |
| Market | [docs/Market.md](docs/Market.md) | Market and trading |
| Commander | [docs/Commander.md](docs/Commander.md) | Commander system |
| Social | [docs/Social.md](docs/Social.md) | Social and diplomacy |
| Research API | [docs/ResearchAPI.md](docs/ResearchAPI.md) | Research API design |
| Research Lab | [docs/ResearchLab.md](docs/ResearchLab.md) | Research lab system |
| Research Summary | [docs/ResearchSystemSummary.md](docs/ResearchSystemSummary.md) | Research system overview |
| Government Progression | [docs/GOVERNMENT_PROGRESSION_TREE.md](docs/GOVERNMENT_PROGRESSION_TREE.md) | Government system |
| Deployment Guide | [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Deployment instructions |
| Deployment Checklist | [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) | Pre-deployment checks |
| Deployment Status | [docs/DEPLOYMENT_STATUS.md](docs/DEPLOYMENT_STATUS.md) | Current deployment status |
| Hosting Guide | [docs/HOSTING_GUIDE.md](docs/HOSTING_GUIDE.md) | Hosting setup |
| Railway Deploy | [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md) | Railway deployment |
| Neon DB Setup | [docs/NEON_SETUP.md](docs/NEON_SETUP.md) | Neon PostgreSQL setup |
| Admin Account | [docs/ADMIN_ACCOUNT.md](docs/ADMIN_ACCOUNT.md) | Admin account setup |
| Scripts | [docs/SCRIPTS.md](docs/SCRIPTS.md) | Build/utility scripts |
| Workflows | [docs/WORKFLOWS_CONFIG.md](docs/WORKFLOWS_CONFIG.md) | CI/CD workflows |
| Integration Plan | [docs/Xenoberage-Integration-Plan.md](docs/Xenoberage-Integration-Plan.md) | Universe Empires migration plan |
| Migration Checklist | [docs/Xenoberage-Migration-Checklist.md](docs/Xenoberage-Migration-Checklist.md) | Migration tasks |
| Session Auth | [docs/Xenoberage-Session-Auth.md](docs/Xenoberage-Session-Auth.md) | Authentication design |
| API Design | [docs/Xenoberage-API-Design.md](docs/Xenoberage-API-Design.md) | API design spec |
| Stages 1-10 | [docs/STAGE-1.md](docs/STAGE-1.md) through [docs/STAGE-10.md](docs/STAGE-10.md) | Development stages |
| Merge Checklist | [docs/MERGE_CHECKLIST.md](docs/MERGE_CHECKLIST.md) | Merge validation |

---

## 2. Architecture Map

```
STELLAR DOMINION SYSTEM ARCHITECTURE
=========================================================

  ┌─────────────────────── CLIENT ───────────────────────┐
  │  React 19 + Vite 7 + TailwindCSS 4                  │
  │                                                       │
  │  App Entry:  client/src/App.tsx                       │
  │  Main Mount: client/src/main.tsx                      │
  │  Game State: client/src/lib/gameContext.tsx            │
  │                                                       │
  │  85 Pages → client/src/pages/                         │
  │  65 Components → client/src/components/               │
  │  70 Lib Files → client/src/lib/                       │
  │  5 Hooks → client/src/hooks/                          │
  └───────────────────┬───────────────────────────────────┘
                      │ HTTP / REST API
  ┌───────────────────┴───────────────────────────────────┐
  │                       SERVER                           │
  │  Express.js + TypeScript + tsx                        │
  │                                                       │
  │  Entry Point: server/index.ts                         │
  │  Game Engine: server/gameEngine.ts                    │
  │  Combat Engine: server/combatEngine.ts                │
  │  Storage Layer: server/storage.ts                     │
  │  Auth: server/basicAuth.ts                            │
  │  Vite Dev: server/vite.ts                             │
  │                                                       │
  │  65 Route Files → server/routes-*.ts                  │
  │  29 Services → server/services/                       │
  │  8 Route Modules → server/routes/                     │
  │  6 Console Modules → server/console/                  │
  └───────────────────┬───────────────────────────────────┘
                      │ Drizzle ORM
  ┌───────────────────┴───────────────────────────────────┐
  │                    SHARED LAYER                        │
  │                                                       │
  │  Schema: shared/schema.ts (72 tables)                 │
  │  Types: shared/types.ts                               │
  │  API Types: shared/api-types.ts                       │
  │  Game Data: shared/gamedata.ts                        │
  │  Expeditions: shared/expeditionData.ts                │
  │  Config: shared/config/ (95+ files)                   │
  │  OGameX: shared/ogamex/ (7 files)                     │
  │  SQL: shared/sql/ (seeds, triggers, views)            │
  └───────────────────┬───────────────────────────────────┘
                      │
  ┌───────────────────┴───────────────────────────────────┐
  │                    DATABASE                            │
  │  PostgreSQL via @neondatabase/serverless               │
  │                                                       │
  │  Connection: server/db/index.ts                       │
  │  Init Schema: server/db/init.ts                       │
  │  Seed Settings: server/db/system-settings-seed.ts     │
  │  SQL Init: server/db/init_schema.sql                  │
  │  72 Tables in shared/schema.ts                        │
  │  SQL Seeds: shared/sql/seeds/                         │
  │  SQL Triggers: shared/sql/triggers/                   │
  │  SQL Views: shared/sql/views/                         │
  └───────────────────────────────────────────────────────┘
```

---

## 3. Project Structure

```
universe-empire-dominion3/
├── client/                          # React 19 frontend
│   └── src/
│       ├── App.tsx                  # Router, providers, layout
│       ├── main.tsx                 # React DOM render
│       ├── index.css                # Global styles
│       ├── xenoberage-api.ts        # Legacy API bridge
│       ├── xenoberage-types.ts      # Legacy types
│       ├── blink/                   # Blink integration
│       ├── styles/                  # Style utilities
│       ├── pages/ (85 files)        # Page components
│       │   ├── Overview.tsx
│       │   ├── Auth.tsx
│       │   ├── AccountSetup.tsx
│       │   ├── Resources.tsx
│       │   ├── Facilities.tsx
│       │   ├── Fleet.tsx
│       │   ├── Shipyard.tsx
│       │   ├── Combat.tsx
│       │   ├── BattleLogs.tsx
│       │   ├── Research.tsx
│       │   ├── TechnologyTree.tsx
│       │   ├── TechTree.tsx
│       │   ├── ResearchLab.tsx
│       │   ├── ResearchAnalyticsDashboard.tsx
│       │   ├── Expeditions.tsx
│       │   ├── Exploration.tsx
│       │   ├── Galaxy.tsx
│       │   ├── Universe.tsx
│       │   ├── UniverseGenerator.tsx
│       │   ├── UniverseEvents.tsx
│       │   ├── PlanetDetail.tsx
│       │   ├── Colonies.tsx
│       │   ├── Stations.tsx
│       │   ├── MegaStructures.tsx
│       │   ├── Alliance.tsx
│       │   ├── Guilds.tsx
│       │   ├── Factions.tsx
│       │   ├── Messages.tsx
│       │   ├── Market.tsx
│       │   ├── Merchants.tsx
│       │   ├── Commander.tsx
│       │   ├── Government.tsx
│       │   ├── EmpireView.tsx
│       │   ├── EmpireProgression.tsx
│       │   ├── EmpirePlanetViewer.tsx
│       │   ├── EmpireCommandCenter.tsx
│       │   ├── CelestialBrowser.tsx
│       │   ├── Achievements.tsx
│       │   ├── Settings.tsx
│       │   ├── Admin.tsx
│       │   ├── AdminControl.tsx
│       │   ├── AdminLogin.tsx
│       │   ├── DatabaseAdmin.tsx
│       │   ├── ServerConsole.tsx
│       │   ├── Diagnostics.tsx
│       │   ├── Army.tsx
│       │   ├── ArmyManagement.tsx
│       │   ├── Artifacts.tsx
│       │   ├── Blueprints.tsx
│       │   ├── CivilizationManagement.tsx
│       │   ├── CivilizationSystems.tsx
│       │   ├── Skills.tsx
│       │   ├── Fitting.tsx
│       │   ├── FittingEnhanced.tsx
│       │   ├── GroundCombat.tsx
│       │   ├── OrbitalDefense.tsx
│       │   ├── PowerGrid.tsx
│       │   ├── PlanetaryOccupation.tsx
│       │   ├── PlanetCommand.tsx
│       │   ├── Forums.tsx
│       │   ├── FriendsList.tsx
│       │   ├── KnowledgeLibrary.tsx
│       │   ├── Leaderboard.tsx
│       │   ├── Navigation.tsx
│       │   ├── Interstellar.tsx
│       │   ├── WarpNetwork.tsx
│       │   ├── Raids.tsx
│       │   ├── RaidBosses.tsx
│       │   ├── RaidFinder.tsx
│       │   ├── Relics.tsx
│       │   ├── BattlePass.tsx
│       │   ├── SeasonPass.tsx
│       │   ├── StoryMode.tsx
│       │   ├── TrainingCenter.tsx
│       │   ├── Storefront.tsx
│       │   ├── ThreeDViewerPortal.tsx
│       │   ├── BiomeCodex.tsx
│       │   ├── BiomeDetail.tsx
│       │   ├── GameAssetsGallery.tsx
│       │   ├── OgameCompendium.tsx
│       │   ├── About.tsx
│       │   ├── Terms.tsx
│       │   ├── Privacy.tsx
│       │   └── not-found.tsx
│       ├── components/ (65 files)
│       │   ├── ui/ (55 files)       # Radix UI primitives
│       │   │   ├── accordion.tsx
│       │   │   ├── alert-dialog.tsx
│       │   │   ├── alert.tsx
│       │   │   ├── aspect-ratio.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── breadcrumb.tsx
│       │   │   ├── button.tsx
│       │   │   ├── button-group.tsx
│       │   │   ├── calendar.tsx
│       │   │   ├── card.tsx
│       │   │   ├── carousel.tsx
│       │   │   ├── chart.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── collapsible.tsx
│       │   │   ├── command.tsx
│       │   │   ├── context-menu.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── drawer.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── empty.tsx
│       │   │   ├── field.tsx
│       │   │   ├── form.tsx
│       │   │   ├── hover-card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── input-group.tsx
│       │   │   ├── input-otp.tsx
│       │   │   ├── item.tsx
│       │   │   ├── kbd.tsx
│       │   │   ├── label.tsx
│       │   │   ├── menubar.tsx
│       │   │   ├── navigation-menu.tsx
│       │   │   ├── pagination.tsx
│       │   │   ├── popover.tsx
│       │   │   ├── progress.tsx
│       │   │   ├── radio-group.tsx
│       │   │   ├── resizable.tsx
│       │   │   ├── scroll-area.tsx
│       │   │   ├── select.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── sheet.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── skeleton.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── sonner.tsx
│       │   │   ├── spinner.tsx
│       │   │   ├── switch.tsx
│       │   │   ├── table.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── toast.tsx
│       │   │   ├── toaster.tsx
│       │   │   ├── toggle.tsx
│       │   │   ├── toggle-group.tsx
│       │   │   └── tooltip.tsx
│       │   ├── layout/
│       │   │   └── GameLayout.tsx
│       │   ├── game/
│       │   │   ├── HabitatSystemsPanel.tsx
│       │   │   └── PlanetDossierPanel.tsx
│       │   ├── research/
│       │   │   ├── TechTreeVisualization.tsx
│       │   │   └── TechTreeVisualization.css
│       │   ├── shipyard/
│       │   │   └── AdvancedConstructorDock.tsx
│       │   ├── views3d/
│       │   │   ├── BrowserStrategyScene.tsx
│       │   │   ├── index.ts
│       │   │   ├── placeholderAssets.ts
│       │   │   ├── sceneConfig.ts
│       │   │   └── SceneLayer.tsx
│       │   ├── AdminPanel.tsx
│       │   ├── CombatReport.tsx
│       │   ├── ConstructionQueue.tsx
│       │   ├── Dashboard.tsx
│       │   ├── EventLog.tsx
│       │   ├── GameLoop.tsx
│       │   ├── Market.tsx
│       │   ├── PlayerList.tsx
│       │   ├── ResearchLab.tsx
│       │   ├── ResourceManager.tsx
│       │   ├── ShipList.tsx
│       │   ├── Shipyard.tsx
│       │   ├── TechTree.tsx
│       │   └── UniverseMap.tsx
│       ├── hooks/ (5 files)
│       │   ├── use-mobile.tsx
│       │   ├── use-toast.ts
│       │   ├── useApi.ts
│       │   ├── useAuth.ts
│       │   └── useCivilizationArmy.ts
│       └── lib/ (70 files)
│           ├── achievementsSystem.ts
│           ├── adminControlSystems.ts
│           ├── allianceData.ts
│           ├── allianceSystems.ts
│           ├── api-client.ts
│           ├── artifactData.ts
│           ├── artifactRelicSystems.ts
│           ├── authUtils.ts
│           ├── blink.ts
│           ├── blueprintSystem.ts
│           ├── celestialObjects.ts
│           ├── colonySystems.ts
│           ├── combatEngine.ts
│           ├── combatSystem.ts
│           ├── commanderSystems.ts
│           ├── commanderTypes.ts
│           ├── cronData.ts
│           ├── empireManager.ts
│           ├── environmentSystems.ts
│           ├── facilityExpansionCatalog.ts
│           ├── facilityOperationsCatalog.ts
│           ├── factionData.ts
│           ├── gameContext.tsx
│           ├── gameLogic.ts
│           ├── governmentData.ts
│           ├── governmentSystems.ts
│           ├── interplanetaryPowerGrid.ts
│           ├── interplanetaryPowerSimulation.ts
│           ├── interstellarData.ts
│           ├── kardashevScale.ts
│           ├── kardashevUpgradeCatalog.ts
│           ├── marketData.ts
│           ├── megastructureExpansionCatalog.ts
│           ├── megaStructures.ts
│           ├── militaryAttributes.ts
│           ├── militaryData.ts
│           ├── ogameBuildings.ts
│           ├── ogameResearch.ts
│           ├── ogameShips.ts
│           ├── orbitalDefenseSystem.ts
│           ├── planetDossier.ts
│           ├── planetUtils.ts
│           ├── queryClient.ts
│           ├── refinerySystemsCatalog.ts
│           ├── researchData.ts
│           ├── researchLabAdministration.ts
│           ├── researchTechnologyTreeCatalog.ts
│           ├── resourceMath.ts
│           ├── shipFittingModules.ts
│           ├── skills90System.ts
│           ├── skillsData.ts
│           ├── solSystemData.ts
│           ├── spaceAnomalies.ts
│           ├── starshipLineCatalog.ts
│           ├── startingColonies.ts
│           ├── stationData.ts
│           ├── techData.ts
│           ├── technologyDivisionCatalog.ts
│           ├── technologyTypes.ts
│           ├── timeUtils.ts
│           ├── turnBasedMmorpg.ts
│           ├── unitData.ts
│           ├── unitPersonnelGenClone.ts
│           ├── universeEvents.ts
│           ├── universeSeed.ts
│           ├── update-client.ts
│           ├── utils.ts
│           ├── vendorData.ts
│           ├── warpNetwork.ts
│           └── wormholeStrongholdCatalog.ts
│
├── server/                          # Express.js backend
│   ├── index.ts                     # Server entry point
│   ├── gameEngine.ts                # Core game loop
│   ├── combatEngine.ts              # Combat resolution
│   ├── storage.ts                   # Database gateway
│   ├── basicAuth.ts                 # Auth middleware
│   ├── logger.ts                    # Logging system
│   ├── vite.ts                      # Vite dev server
│   ├── static.ts                    # Static file serving
│   ├── consoleMenu.ts               # Console dashboard
│   ├── update-manager.ts            # Update management
│   ├── admin-manager.ts             # Admin management
│   ├── adminCli.ts                  # Admin CLI
│   ├── adminPermissions.ts          # Admin permissions
│   ├── loadEnv.ts                   # Environment loader
│   ├── replitAuth.ts                # Replit auth
│   ├── terminalUI.ts                # Terminal UI
│   ├── routes.ts                    # Core routes
│   ├── routes/ (8 modules)          # Route modules
│   │   ├── admin.py
│   │   ├── combat.py
│   │   ├── event.py
│   │   ├── market.py
│   │   ├── player.py
│   │   ├── research.py
│   │   ├── ship.py
│   │   └── universe.py
│   ├── services/ (29 files)
│   │   ├── achievementService.ts
│   │   ├── armyBuildingStructuresService.ts
│   │   ├── armySystemService.ts
│   │   ├── autoBuyResourcesService.ts
│   │   ├── civilizationSystemService.ts
│   │   ├── constructorYardService.ts
│   │   ├── customLabService.ts
│   │   ├── debugService.ts
│   │   ├── fleetService.ts
│   │   ├── gameAssetsService.ts
│   │   ├── governmentProgressionService.ts
│   │   ├── issueService.ts
│   │   ├── megastructureService.ts
│   │   ├── missingFeatureService.ts
│   │   ├── multiplayerBonusesService.ts
│   │   ├── ogameCatalogService.ts
│   │   ├── ogameMissionService.ts
│   │   ├── raidOperationsService.ts
│   │   ├── researchLabService.ts
│   │   ├── researchRecommendationsService.ts
│   │   ├── researchTradingService.ts
│   │   ├── researchXPService.ts
│   │   ├── resourceService.ts
│   │   ├── serverStatusService.ts
│   │   ├── technologyService.ts
│   │   ├── turnSystemService.ts
│   │   ├── universeResetService.ts
│   │   ├── universeSeedService.ts
│   │   └── warningService.ts
│   ├── console/ (6 files)
│   │   ├── index.ts
│   │   ├── auth-monitor.ts
│   │   ├── database-monitor.ts
│   │   ├── log-export.ts
│   │   ├── performance-monitor.ts
│   │   └── README.md
│   ├── config/ (2 files)
│   │   ├── databaseConfig.ts
│   │   └── startupConfig.ts
│   ├── db/ (4 files)
│   │   ├── index.ts
│   │   ├── init.ts
│   │   ├── init_schema.sql
│   │   └── system-settings-seed.ts
│   ├── errors/
│   ├── game/
│   ├── middleware/
│   │   └── adminIpCheck.ts
│   ├── models/
│   ├── database/
│   └── universe/
│
├── shared/                          # Shared TypeScript code
│   ├── schema.ts                    # Drizzle ORM schema (72 tables)
│   ├── types.ts                     # Core types
│   ├── api-types.ts                 # API types
│   ├── gamedata.ts                  # Game data
│   ├── expeditionData.ts            # Expedition data
│   ├── config/ (95+ files)          # Game configuration
│   ├── ogamex/ (7 files)            # OGameX integration
│   ├── sql/                         # SQL utilities
│   │   ├── full_game_foundation.sql
│   │   ├── seed_tech_tree.sql
│   │   ├── seed_tech_tree_quick.sql
│   │   ├── stellaris_tech_seed.sql
│   │   ├── schema/
│   │   ├── seeds/
│   │   ├── settings/
│   │   ├── triggers/
│   │   ├── views/
│   │   └── options/
│   └── types/
│
├── script/ (24 files)               # Build and utility scripts
│   ├── dev.ts
│   ├── build.ts
│   ├── create-admin.ts
│   ├── create-new-admin.ts
│   ├── manage-admin.ts
│   ├── create-db.js
│   ├── debug.ts
│   ├── generate-research.ts
│   ├── researches.ts
│   ├── researchRecommendationsService.ts
│   ├── seed-ogame-catalog.ts
│   ├── seed-test-users.ts
│   ├── smoke-life-support.ts
│   ├── smoke-orbital-defense.ts
│   ├── smoke-power-grid.ts
│   ├── smoke-raid-operations.ts
│   ├── build-complete-system.cjs
│   ├── build-desktop-app.cjs
│   ├── build-exe.cjs
│   ├── client-launcher.cjs
│   ├── game-launcher.cjs
│   ├── generate-talent-tree.cjs
│   ├── backend_test.py
│   └── ogamex_mass_rewrite.py
│
├── scripts/ (8 files)               # Deployment and ops scripts
│   ├── create-patch.js
│   ├── deploy-patch.js
│   ├── generate-game-images.py
│   ├── install.ps1
│   ├── install.sh
│   ├── restart-server.bat
│   ├── setup-postgres.ps1
│   └── start-server.bat
│
├── docs/ (77 files)                 # Documentation
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
├── Dockerfile
├── docker-compose.yml
├── Procfile
├── railway.json
└── .env.local
```

---

## 4. Tech Stack

| Layer | Technology | Version | Source |
|-------|-----------|---------|--------|
| UI Framework | React | 19.2.0 | [package.json](package.json) |
| Language | TypeScript | 5.6.3 | [tsconfig.json](tsconfig.json) |
| Build Tool | Vite | 7.1.9 | [vite.config.ts](vite.config.ts) |
| CSS Framework | TailwindCSS | 4.1.14 | [package.json](package.json) |
| UI Primitives | Radix UI | ^1.x - ^2.x | [package.json](package.json) |
| Animation | Framer Motion | 12.23.24 | [package.json](package.json) |
| Routing | Wouter | 3.3.5 | [package.json](package.json) |
| Server State | TanStack React Query | 5.60.5 | [package.json](package.json) |
| Forms | React Hook Form | 7.66.0 | [package.json](package.json) |
| Charts | Recharts | 2.15.4 | [package.json](package.json) |
| Validation | Zod | 3.25.76 | [package.json](package.json) |
| Web Server | Express.js | 4.21.2 | [package.json](package.json) |
| Database | PostgreSQL | via pg 8.20.0 | [package.json](package.json) |
| ORM | Drizzle ORM | 0.39.1 | [package.json](package.json) |
| DB Schema Validation | Drizzle Zod | 0.7.0 | [package.json](package.json) |
| Auth | Passport + express-session | 0.7.0 / 1.18.1 | [package.json](package.json) |
| WebSocket | ws | 8.18.0 | [package.json](package.json) |
| Server TS Runner | tsx | 4.21.0 | [package.json](package.json) |
| Desktop | Electron | 42.4.1 | [package.json](package.json) |
| Bundler (server) | esbuild | 0.25.0 | [package.json](package.json) |
| Toast Notifications | Sonner | 2.0.7 | [package.json](package.json) |
| Command Menu | cmdk | 1.1.1 | [package.json](package.json) |

---

## 5. Quick Start

```bash
# Install dependencies
npm install

# Start development (full stack)
npm run dev              # → http://localhost:3000

# Or start separately
npm run dev:client       # → http://localhost:5001
npm run dev:server       # → Port 3000

# Production build
npm run build
npm run start            # → node dist/index.cjs

# Type checking
npm run check

# Database operations
npm run db:push          # Push schema to DB
npm run db:generate      # Generate migrations

# Admin
npm run admin            # Admin CLI
npm run admin:manage     # Manage admins
npm run admin:create     # Create admin

# Seeding
npm run db:seed:ogame    # Seed OGame catalog

# Smoke tests
npm run smoke:life-support
```

| Script | Description | Source |
|--------|-------------|--------|
| `npm run dev` | Full-stack dev server | [script/dev.ts](script/dev.ts) |
| `npm run build` | Production build | [script/build.ts](script/build.ts) |
| `npm run start` | Production server | [package.json](package.json) |
| `npm run check` | TypeScript validation | [tsconfig.json](tsconfig.json) |
| `npm run db:push` | Push schema to DB | [drizzle.config.ts](drizzle.config.ts) |
| `npm run db:generate` | Generate migrations | [drizzle.config.ts](drizzle.config.ts) |
| `npm run db:seed:ogame` | Seed OGame catalog | [script/seed-ogame-catalog.ts](script/seed-ogame-catalog.ts) |
| `npm run admin` | Admin CLI | [server/adminCli.ts](server/adminCli.ts) |
| `npm run admin:manage` | Manage admins | [script/manage-admin.ts](script/manage-admin.ts) |
| `npm run admin:create` | Create admin | [script/create-new-admin.ts](script/create-new-admin.ts) |
| `npm run smoke:life-support` | Life support smoke test | [script/smoke-life-support.ts](script/smoke-life-support.ts) |

---

## 6. API Routes Reference

> **Source:** `server/routes.ts` — Core route mounting point (622 lines)

### Core Routes — `server/routes.ts`

| Endpoint Prefix | Description | Line |
|-----------------|-------------|------|
| `/api/auth/*` | User registration, login, session | [server/routes.ts](server/routes.ts) |
| `/api/player/*` | Player state, profile | [server/routes.ts](server/routes.ts) |
| `/api/game/*` | Game state, tick processing | [server/routes.ts](server/routes.ts) |
| `/api/market/*` | Market orders | [server/routes.ts](server/routes.ts) |
| `/api/auction/*` | Auction house | [server/routes.ts](server/routes.ts) |
| `/api/trade/*` | Player trading | [server/routes.ts](server/routes.ts) |
| `/api/bank/*` | Banking | [server/routes.ts](server/routes.ts) |
| `/api/currency/*` | Silver/Gold/Platinum | [server/routes.ts](server/routes.ts) |
| `/api/empire/*` | Empire overview | [server/routes.ts](server/routes.ts) |
| `/api/items/*` | Inventory | [server/routes.ts](server/routes.ts) |
| `/api/commander/*` | Commander management | [server/routes.ts](server/routes.ts) |

### Complete Route Files

| File | Endpoint Prefix | Description | Source |
|------|----------------|-------------|--------|
| `server/routes.ts` | `/api/auth/*`, `/api/player/*`, `/api/game/*`, `/api/market/*`, `/api/auction/*`, `/api/trade/*`, `/api/bank/*`, `/api/currency/*`, `/api/empire/*`, `/api/items/*`, `/api/commander/*` | Core API routes | [server/routes.ts](server/routes.ts) |
| `server/routes-account.ts` | `/api/account/*` | Account management, profile settings | [server/routes-account.ts](server/routes-account.ts) |
| `server/routes-achievements.ts` | `/api/achievements/*` | Achievement tracking and rewards | [server/routes-achievements.ts](server/routes-achievements.ts) |
| `server/routes-admin.ts` | `/api/admin/*` | Admin panel, user management, universe reset | [server/routes-admin.ts](server/routes-admin.ts) |
| `server/routes-alliances.ts` | `/api/alliances/*` | Alliance create/join/leave, ranks | [server/routes-alliances.ts](server/routes-alliances.ts) |
| `server/routes-army-building-structures.ts` | `/api/army-buildings/*` | Army facility construction | [server/routes-army-building-structures.ts](server/routes-army-building-structures.ts) |
| `server/routes-army-system.ts` | `/api/army/*` | Troop management, squad formation | [server/routes-army-system.ts](server/routes-army-system.ts) |
| `server/routes-artifacts.ts` | `/api/artifacts/*` | Artifact discovery and equipping | [server/routes-artifacts.ts](server/routes-artifacts.ts) |
| `server/routes-assets.ts` | `/api/assets/*` | Asset gallery, asset loading | [server/routes-assets.ts](server/routes-assets.ts) |
| `server/routes-autobuyresources.ts` | `/api/autobuy/*` | Automated resource purchasing | [server/routes-autobuyresources.ts](server/routes-autobuyresources.ts) |
| `server/routes-bank-vault.ts` | `/api/bank-vault/*` | Vault deposit/withdraw, exchange, insurance, upgrade | [server/routes-bank-vault.ts](server/routes-bank-vault.ts) |
| `server/routes-civilization-system.ts` | `/api/civilization/*` | Civilization subsystems, jobs | [server/routes-civilization-system.ts](server/routes-civilization-system.ts) |
| `server/routes-civilization.ts` | `/api/config/civilization-jobs/*` | Civilization config endpoints | [server/routes-civilization.ts](server/routes-civilization.ts) |
| `server/routes-combat.ts` | `/api/combat/*` | Combat initiation, battle reports | [server/routes-combat.ts](server/routes-combat.ts) |
| `server/routes-commanders.ts` | `/api/commanders/*` | Commander recruitment, skill trees | [server/routes-commanders.ts](server/routes-commanders.ts) |
| `server/routes-constructor-yard.ts` | `/api/constructor-yard/*` | Ship/station construction | [server/routes-constructor-yard.ts](server/routes-constructor-yard.ts) |
| `server/routes-customlabs.ts` | `/api/labs/*` | Lab specialization, research | [server/routes-customlabs.ts](server/routes-customlabs.ts) |
| `server/routes-database-admin.ts` | `/api/db-admin/*` | Database management, queries | [server/routes-database-admin.ts](server/routes-database-admin.ts) |
| `server/routes-diagnostics.ts` | `/api/diagnostics/*` | System health, performance | [server/routes-diagnostics.ts](server/routes-diagnostics.ts) |
| `server/routes-empire-combat-universe.ts` | `/api/empire/combat/*` | Galaxy-wide empire warfare | [server/routes-empire-combat-universe.ts](server/routes-empire-combat-universe.ts) |
| `server/routes-espionage.ts` | `/api/espionage/*` | Spy missions, intelligence | [server/routes-espionage.ts](server/routes-espionage.ts) |
| `server/routes-expeditions.ts` | `/api/expeditions/*` | Create, manage, resolve expeditions | [server/routes-expeditions.ts](server/routes-expeditions.ts) |
| `server/routes-forums.ts` | `/api/forums/*` | Forum posts, threads | [server/routes-forums.ts](server/routes-forums.ts) |
| `server/routes-friends.ts` | `/api/friends/*` | Friend requests, block list | [server/routes-friends.ts](server/routes-friends.ts) |
| `server/routes-galaxy.ts` | `/api/galaxy/*` | Galaxy map, star systems | [server/routes-galaxy.ts](server/routes-galaxy.ts) |
| `server/routes-game.ts` | `/api/game/*` | State sync, tick processing | [server/routes-game.ts](server/routes-game.ts) |
| `server/routes-game-asset-library.ts` | `/api/asset-library/*` | Asset library browsing | [server/routes-game-asset-library.ts](server/routes-game-asset-library.ts) |
| `server/routes-gameactions.ts` | `/api/game/action/*` | Action processing | [server/routes-gameactions.ts](server/routes-gameactions.ts) |
| `server/routes-government-buildings.ts` | `/api/government-buildings/*` | Government facility management | [server/routes-government-buildings.ts](server/routes-government-buildings.ts) |
| `server/routes-government-leaders.ts` | `/api/government/leaders/*` | Leader election, bonuses | [server/routes-government-leaders.ts](server/routes-government-leaders.ts) |
| `server/routes-government-progression.ts` | `/api/government/progression/*` | Government tree advancement | [server/routes-government-progression.ts](server/routes-government-progression.ts) |
| `server/routes-guilds.ts` | `/api/guilds/*` | Guild creation, management | [server/routes-guilds.ts](server/routes-guilds.ts) |
| `server/routes-high-command.ts` | `/api/high-command/*` | Strategic commands, buffs | [server/routes-high-command.ts](server/routes-high-command.ts) |
| `server/routes-leaderboard.ts` | `/api/leaderboard/*` | Rankings by various criteria | [server/routes-leaderboard.ts](server/routes-leaderboard.ts) |
| `server/routes-lifesupport.ts` | `/api/lifesupport/*` | Colony life support management | [server/routes-lifesupport.ts](server/routes-lifesupport.ts) |
| `server/routes-liveops.ts` | `/api/liveops/*` | Events, promotions | [server/routes-liveops.ts](server/routes-liveops.ts) |
| `server/routes-megastructures.ts` | `/api/megastructures/*` | Dyson Sphere, Ring World, etc. | [server/routes-megastructures.ts](server/routes-megastructures.ts) |
| `server/routes-messages.ts` | `/api/messages/*` | In-game messaging system | [server/routes-messages.ts](server/routes-messages.ts) |
| `server/routes-missing.ts` | `/api/raids/*`, `/api/relics/*`, `/api/events/*`, `/api/expeditions/*`, `/api/exploration/*` | Feature stubs/unimplemented | [server/routes-missing.ts](server/routes-missing.ts) |
| `server/routes-moons.ts` | `/api/moons/*` | Moon base management | [server/routes-moons.ts](server/routes-moons.ts) |
| `server/routes-multiplayerbonuses.ts` | `/api/alliances/bonuses/*` | Multiplayer cooperation bonuses | [server/routes-multiplayerbonuses.ts](server/routes-multiplayerbonuses.ts) |
| `server/routes-ogame.ts` | `/api/ogame/*` | OGameX compatibility layer | [server/routes-ogame.ts](server/routes-ogame.ts) |
| `server/routes-orbital-stations.ts` | `/api/orbital-stations/*` | Station building, management | [server/routes-orbital-stations.ts](server/routes-orbital-stations.ts) |
| `server/routes-phpmyadmin.ts` | `/phpmyadmin/*` | Database admin web interface | [server/routes-phpmyadmin.ts](server/routes-phpmyadmin.ts) |
| `server/routes-planets.ts` | `/api/planets/*` | Planet management, resources | [server/routes-planets.ts](server/routes-planets.ts) |
| `server/routes-realms.ts` | `/api/realms/*` | Realm management, territories | [server/routes-realms.ts](server/routes-realms.ts) |
| `server/routes-recommendations.ts` | `/api/research/recommendations/*` | Research/gameplay suggestions | [server/routes-recommendations.ts](server/routes-recommendations.ts) |
| `server/routes-research.ts` | `/api/research/*` | Technology research | [server/routes-research.ts](server/routes-research.ts) |
| `server/routes-researchlab.ts` | `/api/research/labs/*`, `/api/research/queue/*` | Lab management, specialization | [server/routes-researchlab.ts](server/routes-researchlab.ts) |
| `server/routes-researchxp.ts` | `/api/research/xp/*` | Research experience, discoveries | [server/routes-researchxp.ts](server/routes-researchxp.ts) |
| `server/routes-resource-trading.ts` | `/api/trading/*` | Resource exchange | [server/routes-resource-trading.ts](server/routes-resource-trading.ts) |
| `server/routes-settings.ts` | `/api/settings/*` | Player preferences, config | [server/routes-settings.ts](server/routes-settings.ts) |
| `server/routes-smithy.ts` | `/api/smithy/*` | Equipment crafting, upgrading | [server/routes-smithy.ts](server/routes-smithy.ts) |
| `server/routes-spore-drive.ts` | `/api/spore-drive/*` | Spore drive system | [server/routes-spore-drive.ts](server/routes-spore-drive.ts) |
| `server/routes-status.ts` | `/api/status/*` | Server status dashboard | [server/routes-status.ts](server/routes-status.ts) |
| `server/routes-trades.ts` | `/api/trades/*` | Trade offers, history | [server/routes-trades.ts](server/routes-trades.ts) |
| `server/routes-trading.ts` | `/api/trading/request/*` | Research trading marketplace | [server/routes-trading.ts](server/routes-trading.ts) |
| `server/routes-travel.ts` | `/api/travel/*` | Interstellar navigation | [server/routes-travel.ts](server/routes-travel.ts) |
| `server/routes-turnsystem.ts` | `/api/turns/*` | Turn generation, spending | [server/routes-turnsystem.ts](server/routes-turnsystem.ts) |
| `server/routes-unit-taxonomy.ts` | `/api/unit-taxonomy/*` | Unit classification system | [server/routes-unit-taxonomy.ts](server/routes-unit-taxonomy.ts) |
| `server/routes-unitsystems.ts` | `/api/unit-systems/*` | Unit management, upgrades | [server/routes-unitsystems.ts](server/routes-unitsystems.ts) |
| `server/routes-universe-seed.ts` | `/api/universe/seed/*` | Universe generation | [server/routes-universe-seed.ts](server/routes-universe-seed.ts) |
| `server/routes-worldactions.ts` | `/api/world/*` | Global interaction actions | [server/routes-worldactions.ts](server/routes-worldactions.ts) |
| `server/routes-api-core.ts` | `/api/health`, `/api/status` | Server health, system status | [server/routes-api-core.ts](server/routes-api-core.ts) |

---

## 7. Services Reference

> **Source:** `server/services/` — 29 service files

| Service | Purpose | Key Functions | Source |
|---------|---------|---------------|--------|
| `turnSystemService.ts` | Turn generation and processing | Turn generation, offline turns, tick processing | [server/services/turnSystemService.ts](server/services/turnSystemService.ts) |
| `resourceService.ts` | Resource economy | Resource production, storage, consumption | [server/services/resourceService.ts](server/services/resourceService.ts) |
| `fleetService.ts` | Fleet management | Ship composition, fleet orders | [server/services/fleetService.ts](server/services/fleetService.ts) |
| `technologyService.ts` | Technology tree | Tech research, prerequisites, effects | [server/services/technologyService.ts](server/services/technologyService.ts) |
| `researchLabService.ts` | Research labs | Lab management, specialization | [server/services/researchLabService.ts](server/services/researchLabService.ts) |
| `researchXPService.ts` | Research XP | XP gain, discovery bonuses | [server/services/researchXPService.ts](server/services/researchXPService.ts) |
| `researchTradingService.ts` | Research trading | Trade values, cooldowns, ratings | [server/services/researchTradingService.ts](server/services/researchTradingService.ts) |
| `researchRecommendationsService.ts` | Research recommendations | Suggest research paths | [server/services/researchRecommendationsService.ts](server/services/researchRecommendationsService.ts) |
| `achievementService.ts` | Achievements | Achievement tracking, rewards | [server/services/achievementService.ts](server/services/achievementService.ts) |
| `armySystemService.ts` | Army system | Troop management, squads | [server/services/armySystemService.ts](server/services/armySystemService.ts) |
| `armyBuildingStructuresService.ts` | Army buildings | Military facility management | [server/services/armyBuildingStructuresService.ts](server/services/armyBuildingStructuresService.ts) |
| `autoBuyResourcesService.ts` | Auto-buy resources | Automated purchasing | [server/services/autoBuyResourcesService.ts](server/services/autoBuyResourcesService.ts) |
| `civilizationSystemService.ts` | Civilization system | Civilization management, jobs | [server/services/civilizationSystemService.ts](server/services/civilizationSystemService.ts) |
| `constructorYardService.ts` | Constructor yard | Ship/station construction | [server/services/constructorYardService.ts](server/services/constructorYardService.ts) |
| `customLabService.ts` | Custom labs | Lab specialization | [server/services/customLabService.ts](server/services/customLabService.ts) |
| `debugService.ts` | Debug utilities | Debug logging, diagnostics | [server/services/debugService.ts](server/services/debugService.ts) |
| `gameAssetsService.ts` | Game assets | Asset management, loading | [server/services/gameAssetsService.ts](server/services/gameAssetsService.ts) |
| `governmentProgressionService.ts` | Government progression | Government tree advancement | [server/services/governmentProgressionService.ts](server/services/governmentProgressionService.ts) |
| `issueService.ts` | Issue tracking | Bug/issue management | [server/services/issueService.ts](server/services/issueService.ts) |
| `megastructureService.ts` | Megastructures | Dyson Sphere, Ring World, etc. | [server/services/megastructureService.ts](server/services/megastructureService.ts) |
| `missingFeatureService.ts` | Missing features | Feature stubs, expeditions | [server/services/missingFeatureService.ts](server/services/missingFeatureService.ts) |
| `multiplayerBonusesService.ts` | MP bonuses | Multiplayer cooperation bonuses | [server/services/multiplayerBonusesService.ts](server/services/multiplayerBonusesService.ts) |
| `ogameCatalogService.ts` | OGame catalog | OGameX asset catalog | [server/services/ogameCatalogService.ts](server/services/ogameCatalogService.ts) |
| `ogameMissionService.ts` | OGame missions | OGameX mission handling | [server/services/ogameMissionService.ts](server/services/ogameMissionService.ts) |
| `raidOperationsService.ts` | Raid operations | Raid management, combat | [server/services/raidOperationsService.ts](server/services/raidOperationsService.ts) |
| `serverStatusService.ts` | Server status | Status monitoring, health | [server/services/serverStatusService.ts](server/services/serverStatusService.ts) |
| `universeResetService.ts` | Universe reset | Universe wipe/regeneration | [server/services/universeResetService.ts](server/services/universeResetService.ts) |
| `universeSeedService.ts` | Universe seed | Procedural universe generation | [server/services/universeSeedService.ts](server/services/universeSeedService.ts) |
| `warningService.ts` | Warning system | Player warnings, alerts | [server/services/warningService.ts](server/services/warningService.ts) |

---

## 8. Database Schema

> **Source:** `shared/schema.ts` — 72 Drizzle ORM table definitions

### Core Player Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `users` | User accounts | [shared/schema.ts:30](shared/schema.ts) |
| `sessions` | Session storage | [shared/schema.ts:19](shared/schema.ts) |
| `playerStates` | Player game state | [shared/schema.ts:46](shared/schema.ts) |
| `playerProfiles` | Player profiles | [shared/schema.ts:894](shared/schema.ts) |
| `playerCurrency` | Currency balances | [shared/schema.ts:1865](shared/schema.ts) |
| `currencyTransactions` | Currency history | [shared/schema.ts:1890](shared/schema.ts) |
| `adminUsers` | Admin accounts | [shared/schema.ts:735](shared/schema.ts) |

### Combat & Military Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `troops` | Player troops | [shared/schema.ts:156](shared/schema.ts) |
| `squads` | Squad formations | [shared/schema.ts:216](shared/schema.ts) |
| `missions` | Active missions | [shared/schema.ts:236](shared/schema.ts) |
| `battles` | Battle records | [shared/schema.ts:505](shared/schema.ts) |
| `battleLogs` | Battle logs | [shared/schema.ts:538](shared/schema.ts) |
| `combatStats` | Combat statistics | [shared/schema.ts:1588](shared/schema.ts) |
| `pveCombatLogs` | PvE combat logs | [shared/schema.ts:1769](shared/schema.ts) |
| `raids` | Raid instances | [shared/schema.ts:1528](shared/schema.ts) |
| `raidCombats` | Raid combat records | [shared/schema.ts:1559](shared/schema.ts) |
| `raidGroups` | Raid groups | [shared/schema.ts:1718](shared/schema.ts) |
| `raidFinder` | Raid matchmaking | [shared/schema.ts:1743](shared/schema.ts) |

### Economy & Trading Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `marketOrders` | Market buy/sell | [shared/schema.ts:320](shared/schema.ts) |
| `auctionListings` | Auction listings | [shared/schema.ts:340](shared/schema.ts) |
| `auctionBids` | Auction bids | [shared/schema.ts:390](shared/schema.ts) |
| `tradeOffers` | Player trade offers | [shared/schema.ts:406](shared/schema.ts) |
| `tradeHistory` | Trade history | [shared/schema.ts:462](shared/schema.ts) |
| `bankAccounts` | Bank accounts | [shared/schema.ts:1910](shared/schema.ts) |
| `bankTransactions` | Bank transactions | [shared/schema.ts:1938](shared/schema.ts) |
| `items` | Item definitions | [shared/schema.ts:1800](shared/schema.ts) |
| `playerItems` | Player inventory | [shared/schema.ts:1843](shared/schema.ts) |

### Building & Structure Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `queueItems` | Build queue | [shared/schema.ts:485](shared/schema.ts) |
| `playerColonies` | Player colonies | [shared/schema.ts:799](shared/schema.ts) |
| `starbases` | Starbases | [shared/schema.ts:814](shared/schema.ts) |
| `moonBases` | Moon bases | [shared/schema.ts:850](shared/schema.ts) |
| `megaStructures` | Mega structures | [shared/schema.ts:960](shared/schema.ts) |
| `resourceFields` | Resource fields | [shared/schema.ts:778](shared/schema.ts) |

### Durability Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `equipmentDurability` | Equipment wear | [shared/schema.ts:559](shared/schema.ts) |
| `fleetDurability` | Ship wear | [shared/schema.ts:579](shared/schema.ts) |
| `buildingDurability` | Building wear | [shared/schema.ts:597](shared/schema.ts) |
| `repairHistory` | Repair records | [shared/schema.ts:615](shared/schema.ts) |
| `durabilityDegradationLog` | Degradation log | [shared/schema.ts:631](shared/schema.ts) |

### Research Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `researchAreas` | Research domains | [shared/schema.ts:647](shared/schema.ts) |
| `researchSubcategories` | Research subcategories | [shared/schema.ts:656](shared/schema.ts) |
| `researchTechnologies` | Tech definitions | [shared/schema.ts:665](shared/schema.ts) |
| `playerResearchProgress` | Player research progress | [shared/schema.ts:677](shared/schema.ts) |

### Expedition Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `expeditions` | Expeditions | [shared/schema.ts:690](shared/schema.ts) |
| `expeditionTeams` | Expedition teams | [shared/schema.ts:713](shared/schema.ts) |
| `expeditionEncounters` | Expedition encounters | [shared/schema.ts:723](shared/schema.ts) |

### Social Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `messages` | In-game mail | [shared/schema.ts:262](shared/schema.ts) |
| `alliances` | Alliances | [shared/schema.ts:287](shared/schema.ts) |
| `allianceMembers` | Alliance members | [shared/schema.ts:304](shared/schema.ts) |
| `friends` | Friend connections | [shared/schema.ts:1394](shared/schema.ts) |
| `friendRequests` | Friend requests | [shared/schema.ts:1421](shared/schema.ts) |
| `guilds` | Guilds | [shared/schema.ts:1442](shared/schema.ts) |
| `guildMembers` | Guild members | [shared/schema.ts:1479](shared/schema.ts) |
| `teams` | Teams | [shared/schema.ts:1498](shared/schema.ts) |

### World Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `continents` | Continents | [shared/schema.ts:746](shared/schema.ts) |
| `countries` | Countries | [shared/schema.ts:755](shared/schema.ts) |
| `territories` | Territories | [shared/schema.ts:766](shared/schema.ts) |
| `universeEvents` | Universe events | [shared/schema.ts:1618](shared/schema.ts) |
| `universeBosses` | Universe bosses | [shared/schema.ts:1651](shared/schema.ts) |
| `bossEncounters` | Boss encounters | [shared/schema.ts:1688](shared/schema.ts) |
| `empireValues` | Empire valuations | [shared/schema.ts:1958](shared/schema.ts) |
| `empireDifficulties` | Empire difficulty | [shared/schema.ts:1096](shared/schema.ts) |

### NPC & Lore Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `npcFactions` | NPC factions | [shared/schema.ts:1291](shared/schema.ts) |
| `npcVendors` | NPC vendors | [shared/schema.ts:1316](shared/schema.ts) |
| `relics` | Relics | [shared/schema.ts:1343](shared/schema.ts) |
| `relicInventory` | Relic inventory | [shared/schema.ts:1373](shared/schema.ts) |
| `achievements` | Achievement definitions | [shared/schema.ts:1240](shared/schema.ts) |
| `elementBuffs` | Element buffs | [shared/schema.ts:1269](shared/schema.ts) |
| `systemSettings` | System settings | [shared/schema.ts:1148](shared/schema.ts) |

### Story Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `storyCampaigns` | Story campaigns | [shared/schema.ts:1162](shared/schema.ts) |
| `storyMissions` | Story missions | [shared/schema.ts:1194](shared/schema.ts) |

### OGameX Tables
| Table | Purpose | Source |
|-------|---------|--------|
| `ogameCatalogCategories` | OGameX categories | [shared/schema.ts:1989](shared/schema.ts) |
| `ogameCatalogEntries` | OGameX entries | [shared/schema.ts:2002](shared/schema.ts) |

---

## 9. Game Systems

### Core Systems

| System | Config Files | Source |
|--------|-------------|--------|
| Turn System | `turnSystemConfig.ts` | [shared/config/turnSystemConfig.ts](shared/config/turnSystemConfig.ts) |
| Game Balance | `gameConfig.ts`, `classicGameConfig.ts` | [shared/config/gameConfig.ts](shared/config/gameConfig.ts), [shared/config/classicGameConfig.ts](shared/config/classicGameConfig.ts) |
| Progression | `progressionSystem.ts`, `progressionSystemConfig.ts` | [shared/config/progressionSystem.ts](shared/config/progressionSystem.ts), [shared/config/progressionSystemConfig.ts](shared/config/progressionSystemConfig.ts) |
| Combat | `combatConfig.ts`, `shared/config/combat/` | [shared/config/combatConfig.ts](shared/config/combatConfig.ts) |
| Economy | `shared/config/economy/` | [shared/config/economy/resourceSettings.ts](shared/config/economy/resourceSettings.ts), [shared/config/economy/devicePrices.ts](shared/config/economy/devicePrices.ts) |
| Currency | `currencyConfig.ts` | [shared/config/currencyConfig.ts](shared/config/currencyConfig.ts) |
| Durability | `durabilityConfig.ts` | [shared/config/durabilityConfig.ts](shared/config/durabilityConfig.ts) |

### Research & Technology

| System | Config Files | Source |
|--------|-------------|--------|
| Technology Tree | `technologyTreeConfig.ts`, `technologyTreeExpandedConfig.ts`, `technologyTreeCustomConfig.ts` | [shared/config/technologyTreeConfig.ts](shared/config/technologyTreeConfig.ts) |
| Research Progression | `researchProgression.ts` | [shared/config/researchProgression.ts](shared/config/researchProgression.ts) |
| Research XP | `researchXPConfig.ts` | [shared/config/researchXPConfig.ts](shared/config/researchXPConfig.ts) |
| Research Queue | `researchQueueConfig.ts` | [shared/config/researchQueueConfig.ts](shared/config/researchQueueConfig.ts) |
| Research Trading | `researchTradingConfig.ts` | [shared/config/researchTradingConfig.ts](shared/config/researchTradingConfig.ts) |
| Research Library | `researchTechnologyLibraryConfig.ts` | [shared/config/researchTechnologyLibraryConfig.ts](shared/config/researchTechnologyLibraryConfig.ts) |
| Research Operations | `researchTechnologyOperationsConfig.ts` | [shared/config/researchTechnologyOperationsConfig.ts](shared/config/researchTechnologyOperationsConfig.ts) |
| Custom Labs | `customLabConfig.ts` | [shared/config/customLabConfig.ts](shared/config/customLabConfig.ts) |

### Military & Units

| System | Config Files | Source |
|--------|-------------|--------|
| Unit Definitions | `unitConfig.ts` | [shared/config/combat/army/unitConfig.ts](shared/config/combat/army/unitConfig.ts) |
| Unit Progression | `unitsProgression.ts` | [shared/config/combat/army/unitsProgression.ts](shared/config/combat/army/unitsProgression.ts) |
| Unit Systems | `unitSystemsConfig.ts` | [shared/config/combat/army/unitSystemsConfig.ts](shared/config/combat/army/unitSystemsConfig.ts) |
| Unit Job Taxonomy | `unitJobTaxonomyConfig.ts` | [shared/config/combat/army/unitJobTaxonomyConfig.ts](shared/config/combat/army/unitJobTaxonomyConfig.ts) |
| Unit Research | `unitResearchConfig.ts` | [shared/config/combat/army/unitResearchConfig.ts](shared/config/combat/army/unitResearchConfig.ts) |
| Army Categories | `armyCategoriesConfig.ts` | [shared/config/combat/army/armyCategoriesConfig.ts](shared/config/combat/army/armyCategoriesConfig.ts) |
| Army Subsystems | `armySubsystemsConfig.ts` | [shared/config/combat/army/armySubsystemsConfig.ts](shared/config/combat/army/armySubsystemsConfig.ts) |
| Army Buildings | `armyBuildingStructuresConfig.ts` | [shared/config/combat/army/armyBuildingStructuresConfig.ts](shared/config/combat/army/armyBuildingStructuresConfig.ts) |
| Army Management | `armyManagementSystem.ts` | [shared/config/combat/army/armyManagementSystem.ts](shared/config/combat/army/armyManagementSystem.ts) |
| Fleet Command | `fleetCommandSystem.ts` | [shared/config/combat/fleet/fleetCommandSystem.ts](shared/config/combat/fleet/fleetCommandSystem.ts) |
| Combat Settings | `combatSettings.ts` | [shared/config/combat/combatSettings.ts](shared/config/combat/combatSettings.ts) |
| High Command | `highCommandSystem.ts` | [shared/config/highCommandSystem.ts](shared/config/highCommandSystem.ts) |
| Ship Classification | `shipClassificationSystem.ts` | [shared/config/shipClassificationSystem.ts](shared/config/shipClassificationSystem.ts) |
| Starship Taxonomy | `starshipSystemsAndStructuresTaxonomyConfig.ts` | [shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts](shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts) |
| Starship Line Catalog | `starshipLineCatalog.ts` | [client/src/lib/starshipLineCatalog.ts](client/src/lib/starshipLineCatalog.ts) |

### Commander System

| System | Config Files | Source |
|--------|-------------|--------|
| Skill Tree | `commanderSkillTreeSystem.ts` | [shared/config/commander/skills/commanderSkillTreeSystem.ts](shared/config/commander/skills/commanderSkillTreeSystem.ts) |
| Talent Tree | `commanderTalentTree.ts`, `commanderTalentTreeConfig.ts` | [shared/config/commander/talent-tree/commanderTalentTree.ts](shared/config/commander/talent-tree/commanderTalentTree.ts) |
| Gacha | `commanderGachaCommandNexus.ts` | [shared/config/commander/gacha/commanderGachaCommandNexus.ts](shared/config/commander/gacha/commanderGachaCommandNexus.ts) |
| Bank Vault | `commanderBankVault.ts`, `vaultBankSystem.ts` | [shared/config/commander/vault/commanderBankVault.ts](shared/config/commander/vault/commanderBankVault.ts) |
| Mastery | `commanderMasteryConfig.ts` | [shared/config/commander/mastery/commanderMasteryConfig.ts](shared/config/commander/mastery/commanderMasteryConfig.ts) |

### Government System

| System | Config Files | Source |
|--------|-------------|--------|
| Government Tree | `governmentProgressionTreeConfig.ts` | [shared/config/governmentProgressionTreeConfig.ts](shared/config/governmentProgressionTreeConfig.ts) |
| Government Leaders | `governmentLeadersConfig.ts` | [shared/config/governmentLeadersConfig.ts](shared/config/governmentLeadersConfig.ts) |
| Government Buildings | `governmentBuildingStructuresConfig.ts` | [shared/config/governmentBuildingStructuresConfig.ts](shared/config/governmentBuildingStructuresConfig.ts) |

### Civilization System

| System | Config Files | Source |
|--------|-------------|--------|
| Civilization Jobs | `civilizationJobsConfig.ts` | [shared/config/civilizationJobsConfig.ts](shared/config/civilizationJobsConfig.ts) |
| Civilization Subsystems | `civilizationSubsystemsConfig.ts` | [shared/config/civilizationSubsystemsConfig.ts](shared/config/civilizationSubsystemsConfig.ts) |
| Civilization Military Jobs | `civilizationMilitaryJobConfig.ts` | [shared/config/civilizationMilitaryJobConfig.ts](shared/config/civilizationMilitaryJobConfig.ts) |

### Universe & Exploration

| System | Config Files | Source |
|--------|-------------|--------|
| Universe Config | `universeConfig.ts` | [shared/config/universeConfig.ts](shared/config/universeConfig.ts) |
| Universe Generation | `universeGenerationConfig.ts` | [shared/config/universeGenerationConfig.ts](shared/config/universeGenerationConfig.ts) |
| Universe Structure | `universeStructureConfig.ts` | [shared/config/universeStructureConfig.ts](shared/config/universeStructureConfig.ts) |
| Interstellar Travel | `interstellarTravelConfig.ts` | [shared/config/interstellarTravelConfig.ts](shared/config/interstellarTravelConfig.ts) |
| Navigation | `navigationConfig.ts` | [shared/config/navigationConfig.ts](shared/config/navigationConfig.ts) |
| Warp Network | `warpNetwork.ts` | [client/src/lib/warpNetwork.ts](client/src/lib/warpNetwork.ts) |
| Spore Drive | `sporeDriveSystem.ts` | [shared/config/sporeDriveSystem.ts](shared/config/sporeDriveSystem.ts) |
| Planet Types | `planetTypesConfig.ts` | [shared/config/planetTypesConfig.ts](shared/config/planetTypesConfig.ts) |
| Planet Progression | `planetsProgression.ts` | [shared/config/planetsProgression.ts](shared/config/planetsProgression.ts) |
| Moon Progression | `moonsProgression.ts` | [shared/config/moonsProgression.ts](shared/config/moonsProgression.ts) |
| Enhanced Moon System | `enhancedMoonSystem.ts` | [shared/config/enhancedMoonSystem.ts](shared/config/enhancedMoonSystem.ts) |

### Construction & Buildings

| System | Config Files | Source |
|--------|-------------|--------|
| Facilities | `facilitiesConfig.ts` | [shared/config/facilitiesConfig.ts](shared/config/facilitiesConfig.ts) |
| Building Progression | `buildingsProgression.ts` | [shared/config/buildingsProgression.ts](shared/config/buildingsProgression.ts) |
| Constructor Yard | `constructorYardSystemsConfig.ts` | [shared/config/constructorYardSystemsConfig.ts](shared/config/constructorYardSystemsConfig.ts) |
| Staryard | `staryardConfig.ts` | [shared/config/staryardConfig.ts](shared/config/staryardConfig.ts) |
| Factory Jobs | `buildingFactoryJobArchetypesConfig.ts` | [shared/config/buildingFactoryJobArchetypesConfig.ts](shared/config/buildingFactoryJobArchetypesConfig.ts) |
| Factory Tiers | `buildingFactoryTierConfig.ts` | [shared/config/buildingFactoryTierConfig.ts](shared/config/buildingFactoryTierConfig.ts) |
| Civilian Structures | `civilianStructuresConfig.ts` | [shared/config/civilianStructuresConfig.ts](shared/config/civilianStructuresConfig.ts) |
| Framing Buildings | `framingBuildingStructuresConfig.ts` | [shared/config/framingBuildingStructuresConfig.ts](shared/config/framingBuildingStructuresConfig.ts) |

### Orbital & Megastructures

| System | Config Files | Source |
|--------|-------------|--------|
| Megastructures | `megastructuresConfig.ts` | [shared/config/megastructuresConfig.ts](shared/config/megastructuresConfig.ts) |
| Orbital Stations | `orbitalStationsConfig.ts`, `orbitalStationsSystem.ts` | [shared/config/orbitalStationsConfig.ts](shared/config/orbitalStationsConfig.ts) |
| Satellite Network | `satelliteNetworkConfig.ts` | [shared/config/satelliteNetworkConfig.ts](shared/config/satelliteNetworkConfig.ts) |

### Equipment & Items

| System | Config Files | Source |
|--------|-------------|--------|
| Equipment Loadouts | `equipmentLoadoutSystem.ts` | [shared/config/economy/crafting/equipmentLoadoutSystem.ts](shared/config/economy/crafting/equipmentLoadoutSystem.ts) |
| Equipment Tempering | `equipmentTemperingSystem.ts` | [shared/config/economy/crafting/equipmentTemperingSystem.ts](shared/config/economy/crafting/equipmentTemperingSystem.ts) |
| Smithy | `smithySystem.ts` | [shared/config/economy/crafting/smithySystem.ts](shared/config/economy/crafting/smithySystem.ts) |
| Blueprints | `eveBlueprintSystem.ts` | [shared/config/eveBlueprintSystem.ts](shared/config/eveBlueprintSystem.ts) |
| Items | `itemsConfig.ts` | [shared/config/itemsConfig.ts](shared/config/itemsConfig.ts) |
| Shipyard | `shipyardSystem.ts` | [shared/config/ships/shipyard/shipyardSystem.ts](shared/config/ships/shipyard/shipyardSystem.ts) |

### Social & Multiplayer

| System | Config Files | Source |
|--------|-------------|--------|
| Multiplayer Bonuses | `multiplayerBonusesConfig.ts` | [shared/config/multiplayerBonusesConfig.ts](shared/config/multiplayerBonusesConfig.ts) |
| Live Operations | `liveOpsContentConfig.ts` | [shared/config/liveOpsContentConfig.ts](shared/config/liveOpsContentConfig.ts) |
| Achievements | `achievementsConfig.ts`, `achievementSystemConfig.ts` | [shared/config/achievementsConfig.ts](shared/config/achievementsConfig.ts) |
| Protection System | `protectionSystemConfig.ts` | [shared/config/protectionSystemConfig.ts](shared/config/protectionSystemConfig.ts) |
| Rank System | `rankSystemConfig.ts` | [shared/config/rankSystemConfig.ts](shared/config/rankSystemConfig.ts) |

### Enemy & World

| System | Config Files | Source |
|--------|-------------|--------|
| Enemy Races | `enemyRacesConfig.ts` | [shared/config/enemyRacesConfig.ts](shared/config/enemyRacesConfig.ts) |
| Entity Archetypes | `entityArchetypesConfig.ts` | [shared/config/entityArchetypesConfig.ts](shared/config/entityArchetypesConfig.ts) |
| Entity Scaling | `entitiesExpansionConfig.ts` | [shared/config/entitiesExpansionConfig.ts](shared/config/entitiesExpansionConfig.ts) |
| Resource Elements | `resourceElementsConfig.ts` | [shared/config/resourceElementsConfig.ts](shared/config/resourceElementsConfig.ts) |
| Life Support | `lifeSupportSystemsConfig.ts` | [shared/config/lifeSupportSystemsConfig.ts](shared/config/lifeSupportSystemsConfig.ts) |
| Resource Progression | `resourcesProgression.ts` | [shared/config/resourcesProgression.ts](shared/config/resourcesProgression.ts) |

### OGameX Integration

| System | Config Files | Source |
|--------|-------------|--------|
| OGameX Assets | `ogamexAssetsConfig.ts` | [shared/config/ogamexAssetsConfig.ts](shared/config/ogamexAssetsConfig.ts) |
| OGame Catalog | `ogameCatalogConfig.ts` | [shared/config/ogameCatalogConfig.ts](shared/config/ogameCatalogConfig.ts) |
| OGameX Bridge | `shared/ogamex/` | [shared/ogamex/index.ts](shared/ogamex/index.ts) |
| Starfleet Biomes | `starfleetBiomeCatalogConfig.ts` | [shared/config/starfleetBiomeCatalogConfig.ts](shared/config/starfleetBiomeCatalogConfig.ts) |

### System & Admin

| System | Config Files | Source |
|--------|-------------|--------|
| Server Config | `serverConfig.ts` | [shared/config/serverConfig.ts](shared/config/serverConfig.ts) |
| System Config | `systemConfig.ts` | [shared/config/systemConfig.ts](shared/config/systemConfig.ts) |
| Status Config | `statusConfig.ts` | [shared/config/statusConfig.ts](shared/config/statusConfig.ts) |
| Game Assets | `gameAssetsConfig.ts` | [shared/config/gameAssetsConfig.ts](shared/config/gameAssetsConfig.ts) |
| Auto-Buy Resources | `autoBuyResourcesConfig.ts` | [shared/config/autoBuyResourcesConfig.ts](shared/config/autoBuyResourcesConfig.ts) |
| Theme System | `themeSystemConfig.ts` | [shared/config/themeSystemConfig.ts](shared/config/themeSystemConfig.ts) |
| Title Screen | `titleScreenConfig.ts` | [shared/config/titleScreenConfig.ts](shared/config/titleScreenConfig.ts) |
| Library | `libraryConfig.ts` | [shared/config/libraryConfig.ts](shared/config/libraryConfig.ts) |
| Star Rarity | `starRaritySystem.ts` | [shared/config/starRaritySystem.ts](shared/config/starRaritySystem.ts) |
| Empire Combat Universe | `empireCombatUniverseSystemsConfig.ts` | [shared/config/empireCombatUniverseSystemsConfig.ts](shared/config/empireCombatUniverseSystemsConfig.ts) |
| Admin Config | `adminConfig.ts`, `adminCredentialsConfig.ts` | [shared/config/adminConfig.ts](shared/config/adminConfig.ts) |
| User Accounts | `userAccountsConfig.ts` | [shared/config/userAccountsConfig.ts](shared/config/userAccountsConfig.ts) |
| User Permissions | `userPermissionConfig.ts` | [shared/config/userPermissionConfig.ts](shared/config/userPermissionConfig.ts) |
| Players Config | `shared/config/players/` | [shared/config/players/playerSettings.ts](shared/config/players/playerSettings.ts) |
| Server Settings | `shared/config/server/` | [shared/config/server/serverSettings.ts](shared/config/server/serverSettings.ts) |
| Game Settings | `shared/config/game/` | [shared/config/game/gameSettings.ts](shared/config/game/gameSettings.ts) |
| Defense Config | `shared/config/defense/` | [shared/config/defense/orbital/](shared/config/defense/orbital/) |
| CSS Config | `cssConfig.ts` | [shared/config/cssConfig.ts](shared/config/cssConfig.ts) |

---

## 10. Frontend Pages

> **Source:** `client/src/pages/` — 85 page components

| Page | Route | Purpose | Source |
|------|-------|---------|--------|
| Overview | `/` | Dashboard, resource overview, quick actions | [client/src/pages/Overview.tsx](client/src/pages/Overview.tsx) |
| Auth | `/auth` | Login/Register forms | [client/src/pages/Auth.tsx](client/src/pages/Auth.tsx) |
| Account Setup | `/account-setup` | Initial configuration | [client/src/pages/AccountSetup.tsx](client/src/pages/AccountSetup.tsx) |
| Resources | `/resources` | Resource management, rates | [client/src/pages/Resources.tsx](client/src/pages/Resources.tsx) |
| Facilities | `/facilities` | Building management | [client/src/pages/Facilities.tsx](client/src/pages/Facilities.tsx) |
| Fleet | `/fleet` | Fleet composition, management | [client/src/pages/Fleet.tsx](client/src/pages/Fleet.tsx) |
| Shipyard | `/shipyard` | Ship construction | [client/src/pages/Shipyard.tsx](client/src/pages/Shipyard.tsx) |
| Combat | `/combat` | Combat interface | [client/src/pages/Combat.tsx](client/src/pages/Combat.tsx) |
| Battle Logs | `/battle-logs` | Combat history | [client/src/pages/BattleLogs.tsx](client/src/pages/BattleLogs.tsx) |
| Research | `/research` | Research management | [client/src/pages/Research.tsx](client/src/pages/Research.tsx) |
| Technology Tree | `/technology-tree` | Tech visualization | [client/src/pages/TechnologyTree.tsx](client/src/pages/TechnologyTree.tsx) |
| Tech Tree | `/tech-tree` | Alternative tech view | [client/src/pages/TechTree.tsx](client/src/pages/TechTree.tsx) |
| Research Lab | `/research-lab` | Lab management | [client/src/pages/ResearchLab.tsx](client/src/pages/ResearchLab.tsx) |
| Research Analytics | `/research-analytics` | Research data dashboard | [client/src/pages/ResearchAnalyticsDashboard.tsx](client/src/pages/ResearchAnalyticsDashboard.tsx) |
| Expeditions | `/expeditions` | Expedition management | [client/src/pages/Expeditions.tsx](client/src/pages/Expeditions.tsx) |
| Exploration | `/exploration` | Exploration interface | [client/src/pages/Exploration.tsx](client/src/pages/Exploration.tsx) |
| Galaxy | `/galaxy` | Galaxy map view | [client/src/pages/Galaxy.tsx](client/src/pages/Galaxy.tsx) |
| Universe | `/universe` | Universe overview | [client/src/pages/Universe.tsx](client/src/pages/Universe.tsx) |
| Universe Generator | `/universe-generator` | Procedural generation | [client/src/pages/UniverseGenerator.tsx](client/src/pages/UniverseGenerator.tsx) |
| Universe Events | `/universe-events` | Event log | [client/src/pages/UniverseEvents.tsx](client/src/pages/UniverseEvents.tsx) |
| Planet Detail | `/planet-detail` | Planet management | [client/src/pages/PlanetDetail.tsx](client/src/pages/PlanetDetail.tsx) |
| Colonies | `/colonies` | Colony management | [client/src/pages/Colonies.tsx](client/src/pages/Colonies.tsx) |
| Stations | `/stations` | Orbital stations | [client/src/pages/Stations.tsx](client/src/pages/Stations.tsx) |
| Mega Structures | `/megastructures` | End-game constructs | [client/src/pages/MegaStructures.tsx](client/src/pages/MegaStructures.tsx) |
| Alliance | `/alliance` | Alliance management | [client/src/pages/Alliance.tsx](client/src/pages/Alliance.tsx) |
| Guilds | `/guilds` | Guild management | [client/src/pages/Guilds.tsx](client/src/pages/Guilds.tsx) |
| Factions | `/factions` | Faction relationships | [client/src/pages/Factions.tsx](client/src/pages/Factions.tsx) |
| Messages | `/messages` | In-game mail | [client/src/pages/Messages.tsx](client/src/pages/Messages.tsx) |
| Market | `/market` | Trading marketplace | [client/src/pages/Market.tsx](client/src/pages/Market.tsx) |
| Merchants | `/merchants` | NPC merchants | [client/src/pages/Merchants.tsx](client/src/pages/Merchants.tsx) |
| Commander | `/commander` | Commander management | [client/src/pages/Commander.tsx](client/src/pages/Commander.tsx) |
| Government | `/government` | Government system | [client/src/pages/Government.tsx](client/src/pages/Government.tsx) |
| Empire View | `/empire` | Empire overview | [client/src/pages/EmpireView.tsx](client/src/pages/EmpireView.tsx) |
| Empire Progression | `/empire-progression` | Leveling status | [client/src/pages/EmpireProgression.tsx](client/src/pages/EmpireProgression.tsx) |
| Empire Planet Viewer | `/empire-planets` | All colonies view | [client/src/pages/EmpirePlanetViewer.tsx](client/src/pages/EmpirePlanetViewer.tsx) |
| Empire Command Center | `/empire-command` | Empire command interface | [client/src/pages/EmpireCommandCenter.tsx](client/src/pages/EmpireCommandCenter.tsx) |
| Celestial Browser | `/celestial` | Universe exploration | [client/src/pages/CelestialBrowser.tsx](client/src/pages/CelestialBrowser.tsx) |
| Achievements | `/achievements` | Achievement progress | [client/src/pages/Achievements.tsx](client/src/pages/Achievements.tsx) |
| Settings | `/settings` | Player preferences | [client/src/pages/Settings.tsx](client/src/pages/Settings.tsx) |
| Admin | `/admin` | Game administration | [client/src/pages/Admin.tsx](client/src/pages/Admin.tsx) |
| Admin Control | `/admin-control` | Admin control panel | [client/src/pages/AdminControl.tsx](client/src/pages/AdminControl.tsx) |
| Admin Login | `/admin-login` | Admin authentication | [client/src/pages/AdminLogin.tsx](client/src/pages/AdminLogin.tsx) |
| Database Admin | `/db-admin` | Database administration | [client/src/pages/DatabaseAdmin.tsx](client/src/pages/DatabaseAdmin.tsx) |
| Server Console | `/console` | Server monitoring | [client/src/pages/ServerConsole.tsx](client/src/pages/ServerConsole.tsx) |
| Diagnostics | `/diagnostics` | System diagnostics | [client/src/pages/Diagnostics.tsx](client/src/pages/Diagnostics.tsx) |
| Army | `/army` | Troop management | [client/src/pages/Army.tsx](client/src/pages/Army.tsx) |
| Army Management | `/army-management` | Army management | [client/src/pages/ArmyManagement.tsx](client/src/pages/ArmyManagement.tsx) |
| Artifacts | `/artifacts` | Artifact collection | [client/src/pages/Artifacts.tsx](client/src/pages/Artifacts.tsx) |
| Blueprints | `/blueprints` | Blueprint system | [client/src/pages/Blueprints.tsx](client/src/pages/Blueprints.tsx) |
| Civilization Management | `/civilization` | Civilization management | [client/src/pages/CivilizationManagement.tsx](client/src/pages/CivilizationManagement.tsx) |
| Civilization Systems | `/civilization-systems` | Civilization subsystems | [client/src/pages/CivilizationSystems.tsx](client/src/pages/CivilizationSystems.tsx) |
| Skills | `/skills` | Skill trees | [client/src/pages/Skills.tsx](client/src/pages/Skills.tsx) |
| Fitting | `/fitting` | Ship fitting | [client/src/pages/Fitting.tsx](client/src/pages/Fitting.tsx) |
| Fitting Enhanced | `/fitting-enhanced` | Advanced ship fitting | [client/src/pages/FittingEnhanced.tsx](client/src/pages/FittingEnhanced.tsx) |
| Ground Combat | `/ground-combat` | Ground combat interface | [client/src/pages/GroundCombat.tsx](client/src/pages/GroundCombat.tsx) |
| Orbital Defense | `/orbital-defense` | Orbital defense management | [client/src/pages/OrbitalDefense.tsx](client/src/pages/OrbitalDefense.tsx) |
| Power Grid | `/power-grid` | Interplanetary power grid | [client/src/pages/PowerGrid.tsx](client/src/pages/PowerGrid.tsx) |
| Planetary Occupation | `/planetary-occupation` | Planetary occupation | [client/src/pages/PlanetaryOccupation.tsx](client/src/pages/PlanetaryOccupation.tsx) |
| Planet Command | `/planet-command` | Planet command interface | [client/src/pages/PlanetCommand.tsx](client/src/pages/PlanetCommand.tsx) |
| Forums | `/forums` | Forum system | [client/src/pages/Forums.tsx](client/src/pages/Forums.tsx) |
| Friends List | `/friends` | Social connections | [client/src/pages/FriendsList.tsx](client/src/pages/FriendsList.tsx) |
| Knowledge Library | `/knowledge` | Research library | [client/src/pages/KnowledgeLibrary.tsx](client/src/pages/KnowledgeLibrary.tsx) |
| Leaderboard | `/leaderboard` | Rankings | [client/src/pages/Leaderboard.tsx](client/src/pages/Leaderboard.tsx) |
| Navigation | `/navigation` | Ship navigation | [client/src/pages/Navigation.tsx](client/src/pages/Navigation.tsx) |
| Interstellar | `/interstellar` | Multi-system travel | [client/src/pages/Interstellar.tsx](client/src/pages/Interstellar.tsx) |
| Warp Network | `/warp-network` | Warp gate system | [client/src/pages/WarpNetwork.tsx](client/src/pages/WarpNetwork.tsx) |
| Raids | `/raids` | Raid management | [client/src/pages/Raids.tsx](client/src/pages/Raids.tsx) |
| Raid Bosses | `/raid-bosses` | Boss encounters | [client/src/pages/RaidBosses.tsx](client/src/pages/RaidBosses.tsx) |
| Raid Finder | `/raid-finder` | Group finder | [client/src/pages/RaidFinder.tsx](client/src/pages/RaidFinder.tsx) |
| Relics | `/relics` | Relic collection | [client/src/pages/Relics.tsx](client/src/pages/Relics.tsx) |
| Battle Pass | `/battle-pass` | Battle pass system | [client/src/pages/BattlePass.tsx](client/src/pages/BattlePass.tsx) |
| Season Pass | `/season-pass` | Season pass system | [client/src/pages/SeasonPass.tsx](client/src/pages/SeasonPass.tsx) |
| Story Mode | `/story` | Narrative campaign | [client/src/pages/StoryMode.tsx](client/src/pages/StoryMode.tsx) |
| Training Center | `/training` | Training center | [client/src/pages/TrainingCenter.tsx](client/src/pages/TrainingCenter.tsx) |
| Storefront | `/storefront` | In-game store | [client/src/pages/Storefront.tsx](client/src/pages/Storefront.tsx) |
| 3D Viewer Portal | `/3d-viewer` | 3D viewer | [client/src/pages/ThreeDViewerPortal.tsx](client/src/pages/ThreeDViewerPortal.tsx) |
| Biome Codex | `/biome-codex` | Biome encyclopedia | [client/src/pages/BiomeCodex.tsx](client/src/pages/BiomeCodex.tsx) |
| Biome Detail | `/biome-detail` | Biome detail view | [client/src/pages/BiomeDetail.tsx](client/src/pages/BiomeDetail.tsx) |
| Game Assets Gallery | `/assets` | Asset viewer | [client/src/pages/GameAssetsGallery.tsx](client/src/pages/GameAssetsGallery.tsx) |
| OGame Compendium | `/ogamex` | OGameX reference | [client/src/pages/OgameCompendium.tsx](client/src/pages/OgameCompendium.tsx) |
| About | `/about` | Game info | [client/src/pages/About.tsx](client/src/pages/About.tsx) |
| Terms | `/terms` | Terms of service | [client/src/pages/Terms.tsx](client/src/pages/Terms.tsx) |
| Privacy | `/privacy` | Privacy policy | [client/src/pages/Privacy.tsx](client/src/pages/Privacy.tsx) |
| not-found | `*` | 404 page | [client/src/pages/not-found.tsx](client/src/pages/not-found.tsx) |

---

## 11. Scripts Reference

### Build & Dev Scripts (`script/`)

> **Source:** `script/` — 24 build, utility, and test scripts

| Script | Purpose | Source |
|--------|---------|--------|
| `dev.ts` | Full-stack dev server launcher | [script/dev.ts](script/dev.ts) |
| `build.ts` | Production build | [script/build.ts](script/build.ts) |
| `create-admin.ts` | Create admin user | [script/create-admin.ts](script/create-admin.ts) |
| `create-new-admin.ts` | Create new admin account | [script/create-new-admin.ts](script/create-new-admin.ts) |
| `manage-admin.ts` | Manage admin accounts | [script/manage-admin.ts](script/manage-admin.ts) |
| `create-db.js` | Create database | [script/create-db.js](script/create-db.js) |
| `debug.ts` | Debug utilities | [script/debug.ts](script/debug.ts) |
| `generate-research.ts` | Generate research data | [script/generate-research.ts](script/generate-research.ts) |
| `researches.ts` | Research data generation | [script/researches.ts](script/researches.ts) |
| `researchRecommendationsService.ts` | Research recommendations script | [script/researchRecommendationsService.ts](script/researchRecommendationsService.ts) |
| `seed-ogame-catalog.ts` | Seed OGameX catalog | [script/seed-ogame-catalog.ts](script/seed-ogame-catalog.ts) |
| `seed-test-users.ts` | Seed test user accounts | [script/seed-test-users.ts](script/seed-test-users.ts) |
| `smoke-life-support.ts` | Life support smoke test | [script/smoke-life-support.ts](script/smoke-life-support.ts) |
| `smoke-orbital-defense.ts` | Orbital defense smoke test | [script/smoke-orbital-defense.ts](script/smoke-orbital-defense.ts) |
| `smoke-power-grid.ts` | Power grid smoke test | [script/smoke-power-grid.ts](script/smoke-power-grid.ts) |
| `smoke-raid-operations.ts` | Raid operations smoke test | [script/smoke-raid-operations.ts](script/smoke-raid-operations.ts) |
| `build-complete-system.cjs` | Complete system build | [script/build-complete-system.cjs](script/build-complete-system.cjs) |
| `build-desktop-app.cjs` | Desktop app build | [script/build-desktop-app.cjs](script/build-desktop-app.cjs) |
| `build-exe.cjs` | Windows EXE build | [script/build-exe.cjs](script/build-exe.cjs) |
| `client-launcher.cjs` | Client launcher | [script/client-launcher.cjs](script/client-launcher.cjs) |
| `game-launcher.cjs` | Game launcher | [script/game-launcher.cjs](script/game-launcher.cjs) |
| `generate-talent-tree.cjs` | Generate talent tree data | [script/generate-talent-tree.cjs](script/generate-talent-tree.cjs) |
| `backend_test.py` | Backend test suite | [script/backend_test.py](script/backend_test.py) |
| `ogamex_mass_rewrite.py` | OGameX mass rewrite tool | [script/ogamex_mass_rewrite.py](script/ogamex_mass_rewrite.py) |

### Deployment & Ops Scripts (`scripts/`)

> **Source:** `scripts/` — 8 deployment and operations scripts

| Script | Purpose | Source |
|--------|---------|--------|
| `create-patch.js` | Create patch file | [scripts/create-patch.js](scripts/create-patch.js) |
| `deploy-patch.js` | Deploy patch | [scripts/deploy-patch.js](scripts/deploy-patch.js) |
| `generate-game-images.py` | Generate game images | [scripts/generate-game-images.py](scripts/generate-game-images.py) |
| `install.ps1` | PowerShell install script | [scripts/install.ps1](scripts/install.ps1) |
| `install.sh` | Bash install script | [scripts/install.sh](scripts/install.sh) |
| `restart-server.bat` | Restart server (Windows) | [scripts/restart-server.bat](scripts/restart-server.bat) |
| `setup-postgres.ps1` | PostgreSQL setup (Windows) | [scripts/setup-postgres.ps1](scripts/setup-postgres.ps1) |
| `start-server.bat` | Start server (Windows) | [scripts/start-server.bat](scripts/start-server.bat) |

---

## Feature Flags Reference

### Implemented Features

| Feature | Status | Source |
|---------|--------|--------|
| User Registration/Login | Complete | [server/routes.ts](server/routes.ts) |
| Session Auth | Complete | [server/basicAuth.ts](server/basicAuth.ts) |
| Turn System (6/min) | Complete | [server/services/turnSystemService.ts](server/services/turnSystemService.ts) |
| Resource Economy | Complete | [server/gameEngine.ts](server/gameEngine.ts) |
| Building Construction | Complete | [server/gameEngine.ts](server/gameEngine.ts) |
| Ship Construction | Complete | [server/gameEngine.ts](server/gameEngine.ts) |
| Combat Formations | Complete | [server/routes-combat.ts](server/routes-combat.ts) |
| Technology Tree | Complete | [shared/config/technologyTreeConfig.ts](shared/config/technologyTreeConfig.ts) |
| Research Queue | Complete | [shared/schema.ts](shared/schema.ts) |
| Research XP | Complete | [shared/config/researchXPConfig.ts](shared/config/researchXPConfig.ts) |
| Research Labs | Complete | [server/services/researchLabService.ts](server/services/researchLabService.ts) |
| Bank Vault System | Complete | [server/routes-bank-vault.ts](server/routes-bank-vault.ts) |
| Currency System | Complete | [shared/config/currencyConfig.ts](shared/config/currencyConfig.ts) |
| Auction House | Complete | [server/routes.ts](server/routes.ts) |
| Market Orders | Complete | [shared/schema.ts](shared/schema.ts) |
| Player-to-Player Trades | Complete | [server/routes-trading.ts](server/routes-trading.ts) |
| Expedition System | Complete | [server/routes-expeditions.ts](server/routes-expeditions.ts) |
| Alliance System | Complete | [server/routes-alliances.ts](server/routes-alliances.ts) |
| Achievements | Complete | [shared/config/achievementsConfig.ts](shared/config/achievementsConfig.ts) |
| Prestige System | Complete | [shared/schema.ts](shared/schema.ts) |
| Durability System | Complete | [shared/config/durabilityConfig.ts](shared/config/durabilityConfig.ts) |
| Empire Progression | Complete | [shared/config/progressionSystem.ts](shared/config/progressionSystem.ts) |
| Universe Generation | Complete | [server/services/universeSeedService.ts](server/services/universeSeedService.ts) |
| Civilization System | Complete | [server/services/civilizationSystemService.ts](server/services/civilizationSystemService.ts) |
| Government System | Complete | [shared/config/governmentProgressionTreeConfig.ts](shared/config/governmentProgressionTreeConfig.ts) |
| Commander Skills/Talents | Complete | [shared/config/commander/skills/commanderSkillTreeSystem.ts](shared/config/commander/skills/commanderSkillTreeSystem.ts) |
| Life Support Systems | Complete | [shared/config/lifeSupportSystemsConfig.ts](shared/config/lifeSupportSystemsConfig.ts) |
| Mega Structures | Complete | [shared/config/megastructuresConfig.ts](shared/config/megastructuresConfig.ts) |
| Orbital Stations | Complete | [shared/config/orbitalStationsConfig.ts](shared/config/orbitalStationsConfig.ts) |
| Starbases | Complete | [shared/schema.ts](shared/schema.ts) |
| Moon Bases | Complete | [shared/schema.ts](shared/schema.ts) |
| Player Colonies | Complete | [shared/schema.ts](shared/schema.ts) |
| Equipment Loadouts | Complete | [shared/config/economy/crafting/equipmentLoadoutSystem.ts](shared/config/economy/crafting/equipmentLoadoutSystem.ts) |
| Equipment Tempering | Complete | [shared/config/economy/crafting/equipmentTemperingSystem.ts](shared/config/economy/crafting/equipmentTemperingSystem.ts) |
| Blueprint System | Complete | [shared/config/eveBlueprintSystem.ts](shared/config/eveBlueprintSystem.ts) |
| Smithy System | Complete | [shared/config/economy/crafting/smithySystem.ts](shared/config/economy/crafting/smithySystem.ts) |
| Army System | Complete | [server/services/armySystemService.ts](server/services/armySystemService.ts) |
| Guild System | Complete | [server/routes-guilds.ts](server/routes-guilds.ts) |
| Friends System | Complete | [server/routes-friends.ts](server/routes-friends.ts) |
| Live Operations | Complete | [shared/config/liveOpsContentConfig.ts](shared/config/liveOpsContentConfig.ts) |
| Multiplayer Bonuses | Complete | [shared/config/multiplayerBonusesConfig.ts](shared/config/multiplayerBonusesConfig.ts) |
| Auto-Buy Resources | Complete | [server/services/autoBuyResourcesService.ts](server/services/autoBuyResourcesService.ts) |
| Custom Labs | Complete | [server/services/customLabService.ts](server/services/customLabService.ts) |
| Constructor Yard | Complete | [server/services/constructorYardService.ts](server/services/constructorYardService.ts) |
| Enemy Races (5) | Complete | [shared/config/enemyRacesConfig.ts](shared/config/enemyRacesConfig.ts) |
| Knowledge System | Complete | [client/src/pages/KnowledgeLibrary.tsx](client/src/pages/KnowledgeLibrary.tsx) |
| Raid Boss System | Complete | [server/services/raidOperationsService.ts](server/services/raidOperationsService.ts) |
| 55+ Radix UI Components | Complete | [client/src/components/ui/](client/src/components/ui/) |
| 85 Game Pages | Complete | [client/src/pages/](client/src/pages/) |
| 65 Route Files | Complete | [server/routes-*.ts](server/) |
| 29 Game Services | Complete | [server/services/](server/services/) |
| Docker Support | Complete | [Dockerfile](Dockerfile) |
| Vite Dev Server | Complete | [vite.config.ts](vite.config.ts) |
| Drizzle ORM Migrations | Complete | [drizzle.config.ts](drizzle.config.ts) |
| OGameX Integration | Complete | [shared/ogamex/](shared/ogamex/) |
| Spore Drive System | Complete | [shared/config/sporeDriveSystem.ts](shared/config/sporeDriveSystem.ts) |
| Ship Fitting | Complete | [client/src/pages/Fitting.tsx](client/src/pages/Fitting.tsx) |
| Ground Combat | Complete | [client/src/pages/GroundCombat.tsx](client/src/pages/GroundCombat.tsx) |
| Orbital Defense | Complete | [client/src/pages/OrbitalDefense.tsx](client/src/pages/OrbitalDefense.tsx) |
| Power Grid | Complete | [client/src/pages/PowerGrid.tsx](client/src/pages/PowerGrid.tsx) |
| Battle Pass | Complete | [client/src/pages/BattlePass.tsx](client/src/pages/BattlePass.tsx) |
| Season Pass | Complete | [client/src/pages/SeasonPass.tsx](client/src/pages/SeasonPass.tsx) |
| Story Mode | Complete | [client/src/pages/StoryMode.tsx](client/src/pages/StoryMode.tsx) |
| Biome Codex | Complete | [client/src/pages/BiomeCodex.tsx](client/src/pages/BiomeCodex.tsx) |
| Storefront | Complete | [client/src/pages/Storefront.tsx](client/src/pages/Storefront.tsx) |

### In Development

| Feature | Status | Source |
|---------|--------|--------|
| Real-time Leaderboards | In Progress | [server/routes-leaderboard.ts](server/routes-leaderboard.ts) |
| Mobile Optimization | In Progress | [client/src/hooks/use-mobile.tsx](client/src/hooks/use-mobile.tsx) |

### Planned

| Feature | Priority |
|---------|----------|
| Redis Cache Layer | Medium |
| WebSocket Real-time | High |
| Job Queue (BullMQ) | Medium |
| Microservices | Low |
| GraphQL API | Low |
| Mobile App | Low |

---

## License

This project is licensed under the **AGPL v3** license.
Based on Universe Empires.

---

*Document generated from source code analysis — 2026*
*Repository: https://github.com/ArkansasIo/stellar-dominion3.git*
*Universe Empires Legacy: https://github.com/ArkansasIo/xenoberage.git*
