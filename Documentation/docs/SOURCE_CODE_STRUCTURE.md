# Source Code Structure

## Client (`client/src/`)
```
client/src/
├── App.tsx                    # Router with all routes
├── components/
│   ├── layout/
│   │   └── GameLayout.tsx     # Main layout with sidebar navigation
│   ├── ui/                    # shadcn/ui components (button, card, tabs, etc.)
│   ├── views3d/               # 3D scene components
│   └── game/                  # Game-specific components
├── pages/                     # 87 page components (see docs/pages/)
├── lib/
│   ├── gameContext.tsx         # Global game state provider
│   ├── queryClient.ts         # React Query setup
│   ├── api-client.ts          # Typed API client
│   ├── resourceMath.ts        # Resource production formulas
│   ├── commanderTypes.ts      # Commander race/class/subclass definitions
│   ├── governmentData.ts      # Government types and policies
│   ├── factionData.ts         # 12 factions with bonuses
│   ├── blueprintSystem.ts     # Manufacturing blueprint system
│   ├── marketData.ts          # NPC market items
│   ├── vendorData.ts          # 12 NPC vendors
│   ├── kardashevScale.ts      # 18-level Kardashev scale
│   ├── turnBasedMmorpg.ts     # Client-side tick engine
│   └── empireManager.ts       # Player empire management
├── hooks/                     # Custom React hooks
├── assets/                    # Static assets
└── index.css                  # Global styles (Tailwind)
```

## Server (`server/`)
```
server/
├── index.ts                   # Express app startup, route registration, cron init
├── basicAuth.ts               # Auth middleware (session + Basic auth + dev bypass)
├── db.ts                      # Database connection pool
├── gameEngine.ts              # Resource production, building, construction queue
├── storage.ts                 # Data access layer (2700+ lines)
├── logger.ts                  # Structured logging
├── routes*.ts                 # 68 route files (see docs/routes/)
├── services/                  # 45+ service files
│   ├── cronService.ts         # Cron job management
│   ├── gameJobs.ts            # 9 game tick jobs (resource, turn, construction, etc.)
│   ├── turnSystemService.ts   # Turn generation and spending
│   ├── researchLabService.ts  # Research lab management
│   ├── megastructureService.ts # Megastructure operations
│   ├── tradingService.ts      # Market orders + auctions
│   ├── researchTradingService.ts # Research trading with disputes
│   ├── autoBuyResourcesService.ts # Auto-buy rules (stubbed)
│   ├── currencyService.ts     # Currency operations
│   ├── bankService.ts         # Banking operations
│   ├── raidOperationsService.ts # Raid combat
│   ├── technologyService.ts   # Tech tree operations
│   ├── researchProgressionService.ts # Research progression
│   ├── debugService.ts        # Debug log collection
│   ├── issueService.ts        # Issue tracking
│   ├── warningService.ts      # Warning system
│   ├── serverStatusService.ts # Health monitoring
│   ├── ogameCatalogService.ts # OGame compendium
│   └── civilizationSystemService.ts # Civilization subsystems
├── systems/                   # Game systems (Xenoberage)
│   ├── resourceProductionSystem.ts # Resource production formulas
│   ├── schedulerSystem.ts     # Tick scheduler (stubbed)
│   └── index.ts               # System exports
├── middleware/                 # Express middleware
├── console/                   # CLI tools and monitors
└── vite.ts                    # Vite dev server setup
```

## Shared (`shared/`)
```
shared/
├── schema.ts                  # Drizzle ORM schema (2100+ lines, 80+ tables)
├── api-types.ts               # Full API type definitions (586 lines)
├── types.ts                   # Basic entity interfaces
├── gamedata.ts                # Game data exports
├── expeditionData.ts          # Expedition data
├── types/
│   ├── civilization.ts        # Civilization system types (422 lines)
│   ├── armyUnitTypes.ts       # Army unit classification
│   └── expeditions.ts         # Expedition types
├── config/                    # 100+ config files
│   ├── index.ts               # Central re-export barrel
│   ├── empireProfileConfig.ts # 9-attribute empire profile
│   ├── dimensionalAnomaliesConfig.ts # 90 anomalies
│   ├── resourceRefineryConfig.ts # 7 refinery types
│   ├── blueprintChargeSystem.ts # Blueprint charges + printer
│   ├── enhancedTradingConfig.ts # Trading enhancements
│   ├── turnSystemConfig.ts    # Turn mechanics
│   ├── weeklyMissionsConfig.ts # Weekly missions
│   ├── pathOfAscensionConfig.ts # 99-tier progression
│   ├── governmentProgressionTreeConfig.ts # Government tree
│   ├── technologyTreeConfig.ts # Tech tree
│   ├── buildingsProgression.ts # Building costs/production
│   ├── resourcesProgression.ts # 28 resource types
│   ├── resourceElementsConfig.ts # 18 elements taxonomy
│   ├── combatConfig.ts        # Combat formulas
│   ├── currencyConfig.ts      # 3-tier currency
│   ├── autoBuyResourcesConfig.ts # Auto-buy rules
│   ├── researchTradingConfig.ts # Research trading limits
│   ├── rankSystemConfig.ts    # S/SS/SSS rank system
│   ├── starRankIntegration.ts # Universal star rating
│   ├── megastructuresConfig.ts # Megastructure definitions
│   ├── civilizationJobsConfig.ts # Civilization jobs
│   ├── civilizationSubsystemsConfig.ts # Civilization subsystems
│   ├── resourceConfig.ts      # Core resource definitions
│   ├── cssConfig.ts           # Theme system (1000+ lines)
│   ├── gameConfig.ts          # Base game config
│   ├── systemConfig.ts        # System settings
│   ├── players/playerSettings.ts # Starting values
│   ├── commander/             # Commander subsystems
│   ├── combat/                # Combat configs
│   ├── economy/               # Economy configs
│   ├── ships/                 # Ship configs
│   ├── defense/               # Defense configs
│   ├── universe/              # Universe generation
│   └── xenoberage/            # Xenoberage subsystem (12 files)
└── sql/                       # SQL schemas, views, seeds
```

## Migrations (`migrations/`)
```
migrations/
├── 0000_serious_surge.sql     # Initial schema
├── 0001_mysterious_*.sql      # Additional tables
├── 0002_lonely_the_fury.sql   # empire_profiles + path_of_ascension + weekly_missions
├── 0003_curvy_mojo.sql        # dimensional_anomalies
├── 0004_overjoyed_firebrand.sql # player_refineries
├── meta/
│   ├── _journal.json          # Migration journal
│   ├── 0000_snapshot.json     # Schema snapshot
│   ├── 0001_snapshot.json
│   ├── 0002_snapshot.json
│   └── 0003_snapshot.json
```
