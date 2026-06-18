# 🌌 Stellar Dominion — Universe Empire Dominions

> **A Next-Generation 4X Space Strategy MMORPG**
> Built with React 19, TypeScript, Express.js, PostgreSQL + Drizzle ORM
>
> **Legacy Foundation:** Universe Empires
> **Live Version:** Alpha 1.5.0

---

## 📋 Quick Navigation

| Section | Link |
|---------|------|
| 🏗️ **Architecture Overview** | [docs/Architecture.md](docs/Architecture.md) |
| 📐 **Full UML Design** | [STELLAR_DOMINION_UML_DESIGN.md](STELLAR_DOMINION_UML_DESIGN.md) |
| 🗺️ **API Routes** | [docs/API_COMPLETE_GUIDE.md](docs/API_COMPLETE_GUIDE.md) |
| 🎮 **Game Design Document** | [docs/Xenoberage-GDD.md](docs/Xenoberage-GDD.md) |
| 📊 **Database ERD** | [docs/Xenoberage-ERD.md](docs/Xenoberage-ERD.md) |
| 🔧 **Developer Guide** | [docs/md-documents/DEVELOPER_GUIDE.md](docs/md-documents/DEVELOPER_GUIDE.md) |
| ⚡ **Quick Start** | [docs/md-documents/QUICK_START.md](docs/md-documents/QUICK_START.md) |

---

## 🏗️ System Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STELLAR DOMINION SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FRONTEND (React 19 + Vite + TailwindCSS)                              │
│  ├── 53+ Pages in frontend/src/pages/                                  │
│  ├── 50+ Radix UI Components in frontend/src/components/ui/            │
│  ├── 28 Services in server/services/                                   │
│  └── 60+ API Routes in server/routes/                                 │
│                                                                         │
│  BACKEND (Express.js + TypeScript)                                     │
│  ├── server/index.ts          ── Server entry point                    │
│  ├── server/gameEngine.ts     ── Core game loop                       │
│  ├── server/combatEngine.ts   ── Combat resolution                    │
│  ├── server/storage.ts        ── Database gateway (2,596 lines)       │
│  ├── server/basicAuth.ts      ── Authentication middleware            │
│  └── server/routes.ts         ── Core API routes (622 lines)          │
│                                                                         │
│  SHARED (configs, types, schema)                                       │
│  ├── shared/schema.ts         ── Drizzle ORM schema (2,020 lines)     │
│  ├── shared/config/           ── 100+ game config files              │
│  └── shared/ogamex/           ── OGameX integration bridge           │
│                                                                         │
│  DATABASE (PostgreSQL + Drizzle ORM)                                   │
│  ├── 30+ tables, JSONB for flexible player state                      │
│  └── Connection pool, migrations via drizzle-kit                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

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
npm run start

# Type checking
npm run check
```

### Useful Scripts

| Command | Description | File |
|---------|-------------|------|
| `npm run dev` | Full-stack dev server | [script/dev.ts](script/dev.ts) |
| `npm run build` | Production build | [script/build.ts](script/build.ts) |
| `npm run db:push` | Push schema to DB | [drizzle.config.ts](drizzle.config.ts) |
| `npm run db:generate` | Generate migrations | [drizzle.config.ts](drizzle.config.ts) |
| `npm run smoke:life-support` | Smoke tests | [script/smoke-life-support.ts](script/smoke-life-support.ts) |
| `npm run admin` | Admin CLI | [server/adminCli.ts](server/adminCli.ts) |
| `npm run check` | TypeScript validation | [tsconfig.json](tsconfig.json) |

---

## 📁 Complete File & Folder Map with Function Cross-References

### 🔴 SERVER LAYER — `/server/`

| File | Lines | Purpose | Key Functions/Exports |
|------|-------|---------|----------------------|
| `index.ts` | — | 🚀 Server entry point | Express app setup, middleware registration, route mounting, Vite integration |
| `gameEngine.ts` | 379 | 🎮 Core game loop | `processResourceTick()`, `startBuilding()`, `buildShips()`, `processConstructionQueue()`, `processCoreGameTick()`, `calculateProduction()`, `calculateBuildingCost()`, `calculateBuildTime()` |
| `combatEngine.ts` | — | ⚔️ Combat resolution | Damage calculations, round processing, loot/debris generation |
| `storage.ts` | 2,596 | 💾 Database gateway (all CRUD) | `getPlayerState()`, `updatePlayerState()`, `addCurrency()`, `getBankAccount()`, `depositToBank()`, `withdrawFromBank()`, `calculateEmpireValue()`, `getEmpireRankings()`, `getBosses()`, `createExpedition()`, `addTierExperience()`, `addEmpireExperience()` |
| `basicAuth.ts` | — | 🔐 Auth middleware | Session-based authentication, dev auth bypass |
| `logger.ts` | — | 📝 Logging system | Request logging, error logging, status monitoring |
| `vite.ts` | — | ⚡ Vite dev server | Hot Module Replacement, dev middleware |
| `static.ts` | — | 📦 Static file serving | Asset serving, caching headers |
| `consoleMenu.ts` | — | 🖥️ Console dashboard | Server console interface |
| `update-manager.ts` | — | 🔄 Update management | Auto-update checking, version management |

#### 🛣️ ROUTES — `/server/routes/`

| File | Lines | Purpose | API Endpoints |
|------|-------|---------|--------------|
| `routes.ts` | 622 | 🏛️ Core API | `/api/auth/*`, `/api/player/*`, `/api/game/*`, `/api/currency/*`, `/api/bank/*`, `/api/empire/*`, `/api/inventory/*`, `/api/facilities/*`, `/api/combat/*`, `/api/bosses/*`, `/api/auctions/*` |
| `routes-api-core.ts` | — | 🔧 Core system | Server health, system status |
| `routes-account.ts` | — | 👤 Account mgmt | Profile management, settings |
| `routes-admin.ts` | — | 👑 Admin panel | User management, game config, universe reset |
| `routes-alliances.ts` | — | 🤝 Alliances | Create/join/leave alliance, ranks |
| `routes-army-system.ts` | — | 🪖 Army system | Troop management, squad formation |
| `routes-army-building-structures.ts` | — | 🏗️ Army buildings | Army facility construction |
| `routes-artifacts.ts` | — | 📿 Artifacts | Artifact discovery, equipping |
| `routes-assets.ts` | — | 🖼️ Game assets | Asset gallery, asset loading |
| `routes-autobuyresources.ts` | — | 🤖 Auto-buy | Automated resource purchasing |
| `routes-bank-vault.ts` | 157 | 🏦 Bank & vault | Vault status, deposit/withdraw, exchange, insurance, upgrade |
| `routes-civilization.ts` | — | 🏛️ Civilization | Civilization state, progression |
| `routes-civilization-system.ts` | — | ⚙️ Civ subsystems | Subsystem management, jobs |
| `routes-combat.ts` | — | ⚔️ Combat | Combat initiation, battle reports |
| `routes-commanders.ts` | — | 👤 Commanders | Commander recruitment, skill trees |
| `routes-constructor-yard.ts` | — | 🏗️ Constructor yard | Ship/station construction |
| `routes-customlabs.ts` | — | 🔬 Custom labs | Lab specialization, research |
| `routes-database-admin.ts` | — | 🗄️ DB admin | Database management, queries |
| `routes-diagnostics.ts` | — | 🩺 Diagnostics | System health, performance |
| `routes-empire-combat-universe.ts` | — | 🌌 Empire combat | Galaxy-wide empire warfare |
| `routes-espionage.ts` | — | 🕵️ Espionage | Spy missions, intelligence |
| `routes-expeditions.ts` | — | 🚀 Expeditions | Create, manage, resolve expeditions |
| `routes-forums.ts` | — | 💬 Forums | Forum posts, threads |
| `routes-friends.ts` | — | 👥 Friends | Friend requests, block list |
| `routes-galaxy.ts` | — | 🌠 Galaxy | Galaxy map, star systems |
| `routes-game.ts` | — | 🎮 Game state | State sync, tick processing |
| `routes-gameactions.ts` | — | 🎯 Game actions | Action processing |
| `routes-government-buildings.ts` | — | 🏛️ Gov buildings | Government facility management |
| `routes-government-leaders.ts` | — | 👤 Gov leaders | Leader election, bonuses |
| `routes-government-progression.ts` | — | 📈 Gov progression | Government tree advancement |
| `routes-guilds.ts` | — | 🏰 Guilds | Guild creation, management |
| `routes-high-command.ts` | — | 🎖️ High command | Strategic commands, buffs |
| `routes-leaderboard.ts` | — | 🏆 Leaderboard | Rankings by various criteria |
| `routes-lifesupport.ts` | — | 🔋 Life support | Colony life support management |
| `routes-liveops.ts` | — | 🎊 Live operations | Events, promotions |
| `routes-megastructures.ts` | — | 🌌 Mega structures | Dyson Sphere, Ring World, etc. |
| `routes-messages.ts` | — | ✉️ Messages | In-game messaging system |
| `routes-missing.ts` | — | ❓ Missing features | Feature stubs/unimplemented |
| `routes-multiplayerbonuses.ts` | — | 🎁 MP bonuses | Multiplayer cooperation bonuses |
| `routes-ogame.ts` | — | 🎮 OGame integration | OGameX compatibility layer |
| `routes-orbital-stations.ts` | — | 🛸 Orbital stations | Station building, management |
| `routes-phpmyadmin.ts` | — | 🗄️ DB portal | Database admin web interface |
| `routes-planets.ts` | — | 🪐 Planets | Planet management, resources |
| `routes-realms.ts` | — | 👑 Realms | Realm management, territories |
| `routes-recommendations.ts` | — | 💡 Recommendations | Research/gameplay suggestions |
| `routes-research.ts` | — | 🔬 Research | Technology research |
| `routes-researchlab.ts` | — | 🧪 Research lab | Lab management, specialization |
| `routes-researchxp.ts` | — | ⭐ Research XP | Research experience, discoveries |
| `routes-resource-trading.ts` | — | 💰 Resource trading | Resource exchange |
| `routes-settings.ts` | — | ⚙️ Settings | Player preferences, config |
| `routes-smithy.ts` | — | 🔨 Smithy | Equipment crafting, upgrading |
| `routes-status.ts` | — | 📊 Status | Server status dashboard |
| `routes-trades.ts` | — | 🤝 Trades | Trade offers, history |
| `routes-trading.ts` | 401 | 📈 Trading | Research trading marketplace |
| `routes-travel.ts` | — | 🚀 Travel | Interstellar navigation |
| `routes-turnsystem.ts` | — | 🔄 Turn system | Turn generation, spending |
| `routes-unit-taxonomy.ts` | — | 📋 Unit taxonomy | Unit classification system |
| `routes-unitsystems.ts` | — | ⚙️ Unit systems | Unit management, upgrades |
| `routes-universe-seed.ts` | — | 🌱 Universe seed | Universe generation |
| `routes-worldactions.ts` | — | 🌍 World actions | Global interaction actions |

### 🔵 SHARED LAYER — `/shared/`

| File | Lines | Purpose | Key Content |
|------|-------|---------|-------------|
| `schema.ts` | 2,020 | 🗄️ Database schema | All 30+ Drizzle ORM table definitions: `users`, `playerStates`, `troops`, `squads`, `missions`, `messages`, `expeditions`, `expeditionTeams`, `expeditionEncounters`, `researchAreas`, `researchSubcategories`, `researchTechnologies`, `playerResearchProgress`, `battles`, `battleLogs`, `marketOrders`, `auctionListings`, `auctionBids`, `tradeOffers`, `tradeHistory`, `queueItems`, `alliances`, `allianceMembers`, `playerColonies`, `starbases`, `moonBases`, `playerProfiles`, `megaStructures`, `equipmentDurability`, `fleetDurability`, `buildingDurability`, `repairHistory`, `durabilityDegradationLog`, `continents`, `countries`, `territories`, `resourceFields`, `sessions`, `adminUsers`, `friends`, `guilds`, `guildMembers`, `items`, `playerItems`, `bankAccounts`, `bankTransactions`, `empireValues`, `playerCurrency`, `currencyTransactions` |
| `api-types.ts` | — | 📝 API types | All request/response type definitions |
| `types.ts` | — | 📝 Core types | Fundamental game type definitions |
| `gamedata.ts` | — | 📊 Game data | Static game data, constants |
| `expeditionData.ts` | — | 🚀 Expedition types | Expedition, encounter, reward data |

#### ⚙️ CONFIGURATION — `/shared/config/` (100+ Files)

| Config File | Purpose | Key Parameters |
|-------------|---------|---------------|
| `classicGameConfig.ts` | 🎮 Classic game balance (Universe Empires) | Scheduler timing, universe size, economy prices, combat params, newbie settings, turn limits, device prices, bank rates, colonization rules, base costs, upgrade system, bounty system, federation rules, xenobe settings, facility requirements |
| `gameConfig.ts` | 🎮 Game balance config | Core game balance parameters |
| `turnSystemConfig.ts` | 🔄 Turn system | TURNS_PER_MINUTE: 6, TURN_INTERVAL_MS: 10000, MAX_OFFLINE_TURNS: 360, turn bonuses, research turn mechanics, event effects |
| `combatConfig.ts` | ⚔️ Combat system | Damage formulas, armor penetration, critical rates, evasion |
| `economy/resourceSettings.ts` | 💰 Resource prices | Metal: 11, Crystal: 5, Deuterium: 15, Energy: 3 |
| `economy/devicePrices.ts` | 🛒 Device costs | Genesis: 100M, EWD: 100M, Warp: 100K, LSSD: 10B |
| `technologyTreeConfig.ts` | 🔬 Technology tree | Tech domains, prerequisites, effects, unlock conditions |
| `technologyTreeExpandedConfig.ts` | 🔬 Expanded tech tree | Additional technologies, research paths |
| `researchProgression.ts` | 📈 Research progression | Research level scaling, XP requirements |
| `researchXPConfig.ts` | ⭐ Research XP | XP gain rates, discovery bonuses |
| `researchQueueConfig.ts` | 📋 Research queue | Queue size limits, priority system |
| `researchTradingConfig.ts` | 🤝 Research trading | Trade values, cooldowns, rating system |
| `progressionSystem.ts` | 📈 Level/tier system | 999 Levels, 99 Tiers, stat multipliers |
| `progressionSystemConfig.ts` | ⚙️ Progression config | XP curves, threshold values |
| `buildingsProgression.ts` | 🏗️ Building scaling | Building cost/benefit scaling |
| `planetsProgression.ts` | 🪐 Planet progression | Planet leveling, colony bonuses |
| `moonsProgression.ts` | 🌙 Moon progression | Moon base upgrades, bonuses |
| `unitsProgression.ts` | ⚔️ Unit progression | Unit stat scaling by level/tier |
| `resourcesProgression.ts` | 📦 Resource scaling | Storage caps, production rates |
| `planetTypesConfig.ts` | 🪐 Planet types | Terran, Rocky, Gas, Barren, Desert, Water |
| `facilitiesConfig.ts` | 🏭 Facilities | Hydroponics, Shipyard, Solar, Research, Mining |
| `universeConfig.ts` | 🌌 Universe layout | Sector count, link limits, zones |
| `universeGenerationConfig.ts` | 🌱 Universe generation | Procedural generation parameters |
| `universeStructureConfig.ts` | 🏗️ Universe structure | Star system hierarchy |
| `commanderSkillTreeSystem.ts` | 👤 Commander skills | Skill trees, talent paths |
| `commanderTalentTree.ts` | 🌲 Talent trees | Class-specific talents |
| `commanderBankVault.ts` | 🏦 Bank vault | Vault storage, interest rates, insurance |
| `commanderGachaCommandNexus.ts` | 🎰 Gacha system | Commander recruitment system |
| `governmentProgressionTreeConfig.ts` | 🏛️ Government tree | Government types, policies, bonuses |
| `governmentLeadersConfig.ts` | 👤 Government leaders | Leader types, traits, election system |
| `governmentBuildingStructuresConfig.ts` | 🏛️ Gov buildings | Government facility types |
| `civilizationJobsConfig.ts` | 👷 Civilization jobs | Job types, workforce allocation |
| `civilizationSubsystemsConfig.ts` | ⚙️ Civ subsystems | Civilization management systems |
| `civilizationMilitaryJobConfig.ts` | 🪖 Military jobs | Military role assignments |
| `enemyRacesConfig.ts` | 👾 Enemy races | 5 Unique races, 8 personalities |
| `entityArchetypesConfig.ts` | 📋 Entity archetypes | Entity classification system |
| `entitiesExpansionConfig.ts` | 📈 Entity scaling | Entity stat progression |
| `equipmentLoadoutSystem.ts` | 🎒 Equipment loadouts | Loadout slots, restrictions |
| `equipmentTemperingSystem.ts` | 🔨 Equipment tempering | Upgrade system, success rates |
| `durabilityConfig.ts` | 🔧 Durability system | Degradation rates, repair costs |
| `weaponsAndDefenseConfig.ts` | ⚔️ Weapons/defense | Weapon stats, defense values |
| `unitConfig.ts` | 📋 Unit definitions | Unit stats, costs, requirements |
| `unitSystemsConfig.ts` | ⚙️ Unit systems | Unit interaction mechanics |
| `unitJobTaxonomyConfig.ts` | 📋 Unit jobs | Role classification for units |
| `unitResearchConfig.ts` | 🔬 Unit research | Unit-specific tech trees |
| `armyCategoriesConfig.ts` | 🪖 Army categories | Army unit categorization |
| `armySubsystemsConfig.ts` | ⚙️ Army subsystems | Army management systems |
| `armyBuildingStructuresConfig.ts` | 🏗️ Army buildings | Military facility definitions |
| `currencyConfig.ts` | 💰 Currency system | Silver/Gold/Platinum values |
| `autoBuyResourcesConfig.ts` | 🤖 Auto-buy | Auto-purchase thresholds |
| `itemsConfig.ts` | 📦 Items | Item definitions, rarities |
| `interstellarTravelConfig.ts` | 🚀 Travel | Travel costs, distances, warp gates |
| `navigationConfig.ts` | 🧭 Navigation | Coordinate systems, routing |
| `lifeSupportSystemsConfig.ts` | 🔋 Life support | Oxygen, water, food systems |
| `megastructuresConfig.ts` | 🌌 Mega structures | Dyson Sphere, Ring World, etc. |
| `orbitalStationsConfig.ts` | 🛸 Orbital stations | Station types, building costs |
| `orbitalStationsSystem.ts` | ⚙️ Station systems | Station management mechanics |
| `satelliteNetworkConfig.ts` | 🛰️ Satellites | Satellite deployment, bonuses |
| `staryardConfig.ts` | 🏗️ Staryard | Ship construction, upgrades |
| `smithySystem.ts` | 🔨 Smithy | Equipment crafting, repairs |
| `eveBlueprintSystem.ts` | 📜 Blueprints | Blueprint scanning, copying |
| `highCommandSystem.ts` | 🎖️ High command | Fleet commands, bonuses |
| `libraryConfig.ts` | 📚 Library | Knowledge library system |
| `liveOpsContentConfig.ts` | 🎊 Live ops | Events, seasonal content |
| `multiplayerBonusesConfig.ts` | 🎁 MP bonuses | Multiplayer cooperation bonuses |
| `protectionSystemConfig.ts` | 🛡️ Protection | Newbie protection, safe zones |
| `adminConfig.ts` | 👑 Admin configuration | Admin permissions, roles |
| `adminCredentialsConfig.ts` | 🔐 Admin credentials | Admin authentication |
| `userAccountsConfig.ts` | 👤 User accounts | Account settings, limits |
| `userPermissionConfig.ts` | 🔑 Permissions | Feature access control |
| `serverConfig.ts` | ⚙️ Server config | Server settings, limits |
| `statusConfig.ts` | 📊 Status config | Status display thresholds |
| `systemConfig.ts` | ⚙️ System config | Core system parameters |
| `gameAssetsConfig.ts` | 🖼️ Game assets | Asset definitions, paths |
| `ogameCatalogConfig.ts` | 📋 OGame catalog | OGameX asset catalog |
| `ogamexAssetsConfig.ts` | 🖼️ OGameX assets | Imported asset configurations |
| `starfleetBiomeCatalogConfig.ts` | 🌿 Biome catalog | Stellar biomes taxonomy |
| `starshipSystemsAndStructuresTaxonomy.ts` | 🚀 Ship taxonomy | Complete ship system classification |
| `achievementsConfig.ts` | 🏆 Achievements | Achievement definitions |
| `achievementSystemConfig.ts` | ⚙️ Achievement system | Achievement tracking, rewards |
| `buildingFactoryJobArchetypesConfig.ts` | 🏭 Factory jobs | Building production archetypes |
| `buildingFactoryTierConfig.ts` | 📈 Factory tiers | Factory efficiency by level |
| `civilianStructuresConfig.ts` | 🏠 Civilian structures | Housing, commercial buildings |
| `constructorYardSystemsConfig.ts` | 🏗️ Constructor yard | Construction systems |
| `customLabConfig.ts` | 🔬 Custom labs | Lab customization options |
| `empireCombatUniverseSystemsConfig.ts` | 🌌 Empire combat | Galaxy-wide warfare systems |
| `framingBuildingStructuresConfig.ts` | 🏗️ Framework buildings | Building framework definitions |
| `resourceElementsConfig.ts` | 🔬 Resource elements | Elemental resource types |

### 🟢 FRONTEND LAYER — `/frontend/src/`

| Path | Purpose | Key Components |
|------|---------|---------------|
| `App.tsx` | 🚀 App entry | Router, providers, layout |
| `main.tsx` | 🎯 Main entry | React DOM render, initial mount |

#### 📄 PAGES — `/frontend/src/pages/` (53+ Pages)

| Page | Path | Purpose | Key Features |
|------|------|---------|-------------|
| `Overview.tsx` | `/` | 🏠 Dashboard | Resource overview, quick actions |
| `Auth.tsx` | `/auth` | 🔐 Authentication | Login/Register forms |
| `AccountSetup.tsx` | `/account-setup` | ⚙️ Account setup | Initial configuration |
| `Resources.tsx` | `/resources` | 📦 Resources | Resource management, rates |
| `Facilities.tsx` | `/facilities` | 🏭 Facilities | Building management |
| `Fleet.tsx` | `/fleet` | 🚀 Fleet | Fleet composition, management |
| `Shipyard.tsx` | `/shipyard` | 🏗️ Shipyard | Ship construction |
| `Combat.tsx` | `/combat` | ⚔️ Combat | Combat interface |
| `BattleLogs.tsx` | `/battle-logs` | 📜 Battle logs | Combat history |
| `Research.tsx` | `/research` | 🔬 Research | Research management |
| `TechnologyTree.tsx` | `/technology-tree` | 🌲 Technology tree | Tech visualization |
| `TechTree.tsx` | `/tech-tree` | 🌲 Tech tree (legacy) | Alternative tech view |
| `ResearchLab.tsx` | `/research-lab` | 🧪 Research lab | Lab management |
| `ResearchAnalyticsDashboard.tsx` | `/research-analytics` | 📊 Research analytics | Research data |
| `Expeditions.tsx` | `/expeditions` | 🚀 Expeditions | Expedition management |
| `Exploration.tsx` | `/exploration` | 🗺️ Exploration | Exploration interface |
| `Galaxy.tsx` | `/galaxy` | 🌌 Galaxy | Galaxy map view |
| `Universe.tsx` | `/universe` | 🌠 Universe | Universe overview |
| `UniverseGenerator.tsx` | `/universe-generator` | 🌱 Universe gen | Procedural generation |
| `UniverseEvents.tsx` | `/universe-events` | 🌍 Universe events | Event log |
| `Planets.tsx` | `/planets` | 🪐 Planets | Player planets |
| `PlanetDetail.tsx` | `/planet-detail` | 🪐 Planet detail | Planet management |
| `Colonies.tsx` | `/colonies` | 🏘️ Colonies | Colony management |
| `Stations.tsx` | `/stations` | 🛸 Stations | Orbital stations |
| `MegaStructures.tsx` | `/megastructures` | 🌌 Mega structures | End-game constructs |
| `Alliance.tsx` | `/alliance` | 🤝 Alliance | Alliance management |
| `Guilds.tsx` | `/guilds` | 🏰 Guilds | Guild management |
| `Factions.tsx` | `/factions` | 🚩 Factions | Faction relationships |
| `Messages.tsx` | `/messages` | ✉️ Messages | In-game mail |
| `Market.tsx` | `/market` | 💰 Market | Trading marketplace |
| `Merchants.tsx` | `/merchants` | 🧑‍🌾 Merchants | NPC merchants |
| `Commander.tsx` | `/commander` | 👤 Commander | Commander management |
| `Government.tsx` | `/government` | 🏛️ Government | Government system |
| `EmpireView.tsx` | `/empire` | 👑 Empire | Empire overview |
| `EmpireProgression.tsx` | `/empire-progression` | 📈 Empire progress | Leveling status |
| `EmpirePlanetViewer.tsx` | `/empire-planets` | 🪐 Empire planets | All colonies view |
| `CelestialBrowser.tsx` | `/celestial` | 🔭 Celestial browser | Universe exploration |
| `Achievements.tsx` | `/achievements` | 🏆 Achievements | Achievement progress |
| `Settings.tsx` | `/settings` | ⚙️ Settings | Player preferences |
| `Admin.tsx` | `/admin` | 👑 Admin panel | Game administration |
| `AdminLogin.tsx` | `/admin-login` | 🔐 Admin login | Admin authentication |
| `ServerConsole.tsx` | `/console` | 🖥️ Server console | Server monitoring |
| `Diagnostics.tsx` | `/diagnostics` | 🩺 Diagnostics | System diagnostics |
| `Army.tsx` | `/army` | 🪖 Army | Troop management |
| `Artifacts.tsx` | `/artifacts` | 📿 Artifacts | Artifact collection |
| `Blueprints.tsx` | `/blueprints` | 📜 Blueprints | Blueprint system |
| `Construction.tsx` | `/construction` | 🏗️ Construction | Build queue |
| `ConstructorYard.tsx` | `/constructor-yard` | 🏗️ Constructor yard | Advanced construction |
| `Invention.tsx` | `/invention` | 💡 Invention | Technology invention |
| `KnowledgeLibrary.tsx` | `/knowledge` | 📚 Knowledge library | Research library |
| `Manufacturing.tsx` | `/manufacturing` | 🏭 Manufacturing | Production lines |
| `Materials.tsx` | `/materials` | 🔬 Materials | Material refinement |
| `Navigation.tsx` | `/navigation` | 🧭 Navigation | Ship navigation |
| `Interstellar.tsx` | `/interstellar` | 🚀 Interstellar | Multi-system travel |
| `WarpNetwork.tsx` | `/warp-network` | 🌐 Warp network | Warp gate system |
| `Raids.tsx` | `/raids` | ⚔️ Raids | Raid management |
| `RaidBosses.tsx` | `/raid-bosses` | 👾 Raid bosses | Boss encounters |
| `RaidFinder.tsx` | `/raid-finder` | 🔍 Raid finder | Group finder |
| `Relics.tsx` | `/relics` | 📿 Relics | Relic collection |
| `Refining.tsx` | `/refining` | ⚗️ Refining | Resource refinement |
| `FriendsList.tsx` | `/friends` | 👥 Friends | Social connections |
| `SolSystem.tsx` | `/sol-system` | ☀️ Sol System | Home system view |
| `StoryMode.tsx` | `/story` | 📖 Story mode | Narrative campaign |
| `GameAssetsGallery.tsx` | `/assets` | 🖼️ Asset gallery | Game asset viewer |
| `OgameCompendium.tsx` | `/ogamex` | 📚 OGame compendium | OGameX reference |
| `PlanetaryIndustry.tsx` | `/industry` | 🏭 Industry | Planetary production |
| `About.tsx` | `/about` | ℹ️ About | Game info |
| `Terms.tsx` | `/terms` | 📝 Terms | Terms of service |
| `Privacy.tsx` | `/privacy` | 🔒 Privacy | Privacy policy |
| `not-found.tsx` | `*` | 404 | Not found page |

#### 🧩 COMPONENTS — `/frontend/src/components/`

| Component | Purpose |
|-----------|---------|
| `Navigation.tsx` | 📋 Main game navigation |
| `ConstructionQueue.tsx` | 🏗️ Construction queue widget |
| `GovernmentProgressionTree.tsx` | 🏛️ Government tree visualization |
| `galaxy-viewer/GalaxyViewer.tsx` | 🌌 3D galaxy viewer |
| `layout/GameLayout.tsx` | 📐 Main game layout (sidebar + content) |
| `layout/GalaxyLayout.tsx` | 🌠 Galaxy-specific layout |
| `research/TechTreeVisualization.tsx` | 🌲 Tech tree visualization |
| `ui/*` (50+ components) | 🎨 Radix UI component library |

### 🟣 UNIVERSE EMPIRES LEGACY — `/xenoberage/`

| File | Purpose | Key Functions/Logic |
|------|---------|-------------------|
| `config/config.php` | ⚙️ All game balance constants | Scheduler timing, economy, combat, devices, banking, colonization, facilities, xenobe |
| `config/db_config.php` | 🗄️ Database config | MySQL/PostgreSQL connection settings |
| `global_includes.php` | 🔗 Central autoloader | Includes all 57 PHP files |
| `global_defines.php` | 📝 Event constants | 54 log type constants |
| `global_cleanups.php` | 🧹 Data cleanup | Value bounds enforcement |
| `classes/db.php` | 🗄️ DB singleton | PDO connection manager |
| `classes/user.php` | 👤 User class | Player info, equipment, turns |
| `classes/manage_player.php` | 👥 Player CRUD | Create/read/update/delete players |
| `classes/manage_planet.php` | 🪐 Planet CRUD | Create/read/update/delete planets |
| `classes/manage_sector.php` | 🌌 Sector CRUD | Sector management, links |
| `classes/manage_ship.php` | 🚀 Ship CRUD | Ship creation, equipment |
| `classes/manage_xenobe.php` | 👾 Xenobe CRUD | NPC management |
| `scheduler.php` | ⏰ Scheduler orchestrator | Runs all automated game events |
| `sched_turns.php` | 🔄 Turn generation | +3 turns per tick per player |
| `sched_ports.php` | 🏪 Port production | Regenerate port resources |
| `sched_planets.php` | 🪐 Planet production | Calculate planet resource output |
| `sched_igb.php` | 🏦 IGB processing | Interest, loans |
| `sched_ranking.php` | 🏆 Rankings | Recalculate player scores |
| `sched_news.php` | 📰 News | Generate game events |
| `sched_degrade.php` | 🔧 Defense degrade | Fighter degradation |
| `sched_apocalypse.php` | ☠️ Apocalypse | Space plague, plasma storms |
| `sched_thegovernor.php` | 👮 Governor | Value bounds cleanup |
| `sched_xenobe.php` | 👾 Xenobe AI | NPC behavior processing |
| `sched_tow.php` | 🚛 Federation tow | Tow oversized ships |
| `combat.php` | ⚔️ Combat engine | Damage calculation, rounds |
| `attack.php` | ⚔️ Attack interface | Player attack initiation |
| `planet.php` | 🪐 Planet management | Resource view, production |
| `port.php` | 🏪 Port trading | Buy/sell resources |
| `port2.php` | 🛒 Special port | Buy devices |
| `ship.php` | 🚀 Shipyard | Equipment upgrades |
| `move.php` | 🚀 Sector movement | Warp navigation |
| `rsmove.php` | 🌌 Real-space move | Distance-based movement |
| `galaxy.php` | 🌠 Galaxy map | Sector/zone visualization |
| `igb.php` | 🏦 IGB portal | Banking interface |
| `bounty.php` | 🎯 Bounty system | Place/claim bounties |
| `mail.php` | ✉️ Mail system | Inbox management |
| `teams.php` | 👥 Teams | Team management |
| `admin.php` | 👑 Admin panel | Game administration |
| `includes/*.php` | 🔧 50+ include files | Utility functions |

---

## 🎮 Game Logic & Features Reference

### ✅ Core Game Systems

```
📊 GAME SYSTEMS OVERVIEW
├── 🔄 Turn System          ─── server/services/turnSystemService.ts
├── 💰 Resource Economy     ─── server/services/resourceService.ts
├── 🚀 Fleet Management     ─── server/services/fleetService.ts
├── ⚔️ Combat Engine        ─── server/combatEngine.ts
├── 🔬 Technology Tree      ─── server/services/technologyService.ts
├── 🧪 Research Lab         ─── server/services/researchLabService.ts
├── ⭐ Research XP          ─── server/services/researchXPService.ts
├── 🚀 Expeditions          ─── shared/config/expeditionData.ts
├── 👤 Commander System     ─── server/services/missingFeatureService.ts
├── 🏛️ Government System    ─── server/services/governmentProgressionService.ts
├── 🌌 Universe Generation  ─── server/services/universeSeedService.ts
├── 🏗️ Construction Yard    ─── server/services/constructorYardService.ts
├── 🎯 Achievements         ─── server/services/achievementService.ts
├── 🪖 Army System           ─── server/services/armySystemService.ts
├── 🏛️ Civilization System   ─── server/services/civilizationSystemService.ts
├── 🏰 Guild System          ─── server/storage.ts (guild tables)
├── 🗺️ Exploration          ─── shared/config/interstellarTravelConfig.ts
└── 🔄 Universe Reset       ─── server/services/universeResetService.ts
```

### 📈 Progression Systems

```
📊 PROGRESSION SYSTEMS
├── 📈 Levels (1-999)       ─── shared/config/progressionSystem.ts
├── 📊 Tiers (1-99)         ─── shared/config/progressionSystemConfig.ts
├── ⭐ Prestige System        ─── shared/schema.ts (playerStates.prestigeLevel, prestigeBonus)
├── 🏆 Achievements (200+)  ─── shared/config/achievementsConfig.ts
├── 📚 Knowledge (10 types) ─── route: /api/knowledge/*
├── 🎖️ Commander Skills     ─── shared/config/commanderSkillTreeSystem.ts
├── 🌲 Commander Talents    ─── shared/config/commanderTalentTree.ts
└── 🏛️ Government Tree     ─── shared/config/governmentProgressionTreeConfig.ts
```

### ⚔️ Combat & Military Systems

```
⚔️ COMBAT & MILITARY
├── ⚔️ Combat Engine        ─── server/combatEngine.ts
├── 🚀 60+ Ship Types       ─── shared/config/unitConfig.ts
├── 🪖 Army Troops           ─── shared/schema.ts (troops, squads tables)
├── 🛡️ 5 Combat Formations  ─── route: /api/combat/formations
├── 🎯 Target Selection     ─── combat engine
├── 🛡️ Shield/Armor/Hull    ─── combat config
├── 💥 Critical Hits        ─── shared/config/combatConfig.ts
├── 🏃 Evasion Mechanics    ─── combat formulas
├── 🪖 Fighter Interception ─── combat formulas
└── 💣 Torpedo Damage       ─── combat formulas
```

### 🏪 Economy & Trading

```
💰 ECONOMY & TRADING
├── 💰 Resource Trading     ─── server/routes/resource-trading.ts
├── 🤝 Research Trading     ─── server/services/researchTradingService.ts
├── 🏦 Bank Vault System    ─── server/routes/bank-vault.ts
├── 🏪 Market Orders        ─── shared/schema.ts (marketOrders table)
├── 🏛️ Auction House        ─── shared/schema.ts (auctionListings, auctionBids)
├── 💰 Currency System      ─── shared/config/currencyConfig.ts
├── 🤖 Auto-Buy Resources   ─── server/services/autoBuyResourcesService.ts
└── 🔄 Trade Offers         ─── shared/schema.ts (tradeOffers, tradeHistory)
```

### 🚀 Exploration & Travel

```
🗺️ EXPLORATION & TRAVEL
├── 🚀 Interstellar Travel  ─── shared/config/interstellarTravelConfig.ts
├── 🧭 Navigation           ─── shared/config/navigationConfig.ts
├── 🌌 Galaxy Map           ─── route: /api/galaxy
├── 🌱 Universe Generation  ─── server/services/universeSeedService.ts
├── 🚀 Expeditions          ─── route: /api/expeditions
├── 🔭 Exploration          ─── frontend/src/pages/Exploration.tsx
├── 🌐 Warp Network         ─── frontend/src/pages/WarpNetwork.tsx
└── ⚡ Wormhole Travel      ─── shared/schema.ts (travelState.wormholes)
```

### 🏛️ Diplomacy & Social

```
🤝 DIPLOMACY & SOCIAL
├── 🤝 Alliances            ─── shared/schema.ts (alliances, allianceMembers)
├── 🏰 Guilds               ─── shared/schema.ts (guilds, guildMembers)
├── 👥 Friends              ─── shared/schema.ts (friends, friendRequests)
├── ✉️ Messages             ─── shared/schema.ts (messages)
├── 👑 Factions             ─── route: /api/factions
├── 🚩 Diplomacy Relations ─── shared/schema.ts (npcFactions)
└── 🧑‍🌾 NPC Vendors         ─── shared/schema.ts (npcVendors)
```

### 🌌 Mega Structures & Stations

```
🏗️ ADVANCED CONSTRUCTION
├── 🌌 Dyson Sphere         ─── shared/config/megastructuresConfig.ts
├── 💍 Ring World           ─── shared/config/megastructuresConfig.ts
├── 🧠 Matrioshka Brain     ─── shared/config/megastructuresConfig.ts
├── 🛸 Orbital Stations     ─── shared/config/orbitalStationsConfig.ts
├── 🌙 Moon Bases           ─── shared/schema.ts (moonBases table)
├── 🏗️ Starbases            ─── shared/schema.ts (starbases table)
└── 🛰️ Satellite Networks   ─── shared/config/satelliteNetworkConfig.ts
```

### 👑 Administration & Monitoring

```
🖥️ ADMINISTRATION
├── 👑 Admin Panel          ─── server/routes-admin.ts
├── 🩺 Server Console       ─── server/consoleMenu.ts
├── 📊 Performance Monitor  ─── server/console/performance-monitor.ts
├── 🗄️ Database Console     ─── server/console/database-monitor.ts
├── 🔐 Auth Monitor         ─── server/console/auth-monitor.ts
├── 📝 Log Export           ─── server/console/log-export.ts
├── 🗄️ PHPMyAdmin Portal    ─── server/routes-phpmyadmin.ts
└── 🩺 Diagnostics          ─── frontend/src/pages/Diagnostics.tsx
```

---

## 📚 Documentation Map

### Primary Documentation

| Document | Location | Description |
|----------|----------|-------------|
| 🏗️ **Architecture** | [docs/Architecture.md](docs/Architecture.md) | Complete system architecture |
| 📐 **UML Design** | [STELLAR_DOMINION_UML_DESIGN.md](STELLAR_DOMINION_UML_DESIGN.md) | Full UML diagrams & design |
| 🗺️ **API Routes** | [docs/API_COMPLETE_GUIDE.md](docs/API_COMPLETE_GUIDE.md) | Complete API reference |
| 🎮 **Game Design** | [docs/Xenoberage-GDD.md](docs/Xenoberage-GDD.md) | Game design document |
| 📊 **Database ERD** | [docs/Xenoberage-ERD.md](docs/Xenoberage-ERD.md) | Entity relationship diagrams |
| 🔧 **Developer Guide** | [docs/md-documents/DEVELOPER_GUIDE.md](docs/md-documents/DEVELOPER_GUIDE.md) | Development guidelines |
| ⚡ **Quick Start** | [docs/md-documents/QUICK_START.md](docs/md-documents/QUICK_START.md) | Getting started guide |
| 🏛️ **Framework Arch** | [docs/md-documents/FRAMEWORK_ARCHITECTURE.md](docs/md-documents/FRAMEWORK_ARCHITECTURE.md) | 5-Layer framework details |
| 🔄 **Systems Overview** | [docs/md-documents/SYSTEMS_OVERVIEW.md](docs/md-documents/SYSTEMS_OVERVIEW.md) | All game systems overview |

### Feature Documentation

| Document | Location | Covers |
|----------|----------|--------|
| ⚔️ Combat | [docs/Combat.md](docs/Combat.md) | Combat system design |
| 📈 Economy | [docs/Economy.md](docs/Economy.md) | Resource economy |
| 🚀 Ships | [docs/Ships.md](docs/Ships.md) | Ship types & stats |
| 🔬 Technology | [docs/Technology.md](docs/Technology.md) | Technology tree |
| 🌲 Tech Tree | [docs/TechnologyTree.md](docs/TechnologyTree.md) | Expanded tech tree |
| 🪐 Universe | [docs/UniverseAndPlanets.md](docs/UniverseAndPlanets.md) | Universe generation |
| 🏛️ Government | [docs/md-documents/GOVERNMENT_PROGRESSION_COMPLETE.md](docs/md-documents/GOVERNMENT_PROGRESSION_COMPLETE.md) | Government system |
| 🔬 Research API | [docs/ResearchAPI.md](docs/ResearchAPI.md) | Research API design |
| 🧪 Research Lab | [docs/ResearchLab.md](docs/ResearchLab.md) | Research lab system |
| 📊 Research Summary | [docs/ResearchSystemSummary.md](docs/ResearchSystemSummary.md) | Research system overview |
| 🚀 Interstellar | [docs/Interstellar.md](docs/Interstellar.md) | Space travel system |
| 💰 Market | [docs/Market.md](docs/Market.md) | Market & trading |
| 👤 Commander | [docs/Commander.md](docs/Commander.md) | Commander system |
| 👥 Social | [docs/Social.md](docs/Social.md) | Social & diplomacy |

### Integration & Migration

| Document | Location | Description |
|----------|----------|-------------|
| 🔄 Integration Plan | [docs/Xenoberage-Integration-Plan.md](docs/Xenoberage-Integration-Plan.md) | Universe Empires migration plan |
| ✅ Migration Checklist | [docs/Xenoberage-Migration-Checklist.md](docs/Xenoberage-Migration-Checklist.md) | Migration tasks |
| 🔐 Session Auth | [docs/Xenoberage-Session-Auth.md](docs/Xenoberage-Session-Auth.md) | Authentication design |
| 📋 API Design | [docs/Xenoberage-API-Design.md](docs/Xenoberage-API-Design.md) | API design spec |
| 🚀 Stage 1-10 | [docs/STAGE-*.md](docs/STAGE-*.md) | Development stages |
| 📋 Merge Checklist | [docs/MERGE_CHECKLIST.md](docs/MERGE_CHECKLIST.md) | Merge validation |

### Deployment & Operations

| Document | Location | Description |
|----------|----------|-------------|
| 🚀 Deployment Guide | [docs/md-documents/DEPLOYMENT_GUIDE.md](docs/md-documents/DEPLOYMENT_GUIDE.md) | Deployment instructions |
| 📋 Deployment Checklist | [docs/md-documents/DEPLOYMENT_CHECKLIST.md](docs/md-documents/DEPLOYMENT_CHECKLIST.md) | Pre-deployment checks |
| 📊 Deployment Status | [docs/md-documents/DEPLOYMENT_STATUS.md](docs/md-documents/DEPLOYMENT_STATUS.md) | Current deployment status |
| 📦 Deployment Files | [docs/md-documents/DEPLOYMENT_FILES_SUMMARY.md](docs/md-documents/DEPLOYMENT_FILES_SUMMARY.md) | File manifest |
| 🌐 Hosting Guide | [docs/md-documents/HOSTING_GUIDE.md](docs/md-documents/HOSTING_GUIDE.md) | Hosting setup |
| 🚆 Railway Deploy | [docs/md-documents/RAILWAY_DEPLOYMENT.md](docs/md-documents/RAILWAY_DEPLOYMENT.md) | Railway deployment |
| 🐳 Docker Setup | [railway.json](railway.json) | Docker/cloud config |
| 📄 Procfile | [Procfile](Procfile) | Heroku/Railway process |

### Legacy Documentation

| Document | Location | Description |
|----------|----------|-------------|
| 🏛️ Framework Summary | [docs/md-documents/FRAMEWORK_COMPLETE_SUMMARY.md](docs/md-documents/FRAMEWORK_COMPLETE_SUMMARY.md) | Framework overview |
| ✅ Framework Validation | [docs/md-documents/FRAMEWORK_VALIDATION.md](docs/md-documents/FRAMEWORK_VALIDATION.md) | Validation status |
| 🎮 Game Design | [docs/md-documents/GAME_DESIGN.md](docs/md-documents/GAME_DESIGN.md) | Original game design |
| 📊 Progression Examples | [docs/md-documents/PROGRESSION_SYSTEM_EXAMPLES.md](docs/md-documents/PROGRESSION_SYSTEM_EXAMPLES.md) | Progression examples |
| ⚡ Quick Reference | [docs/md-documents/DEVELOPER_QUICK_REFERENCE.md](docs/md-documents/DEVELOPER_QUICK_REFERENCE.md) | Quick reference |
| 🔧 Scripts Reference | [docs/md-documents/SCRIPTS.md](docs/md-documents/SCRIPTS.md) | Build/utility scripts |
| ⚙️ Workflows Config | [docs/md-documents/WORKFLOWS_CONFIG.md](docs/md-documents/WORKFLOWS_CONFIG.md) | CI/CD workflows |
| 🗄️ API Routes Index | [docs/md-documents/API_ROUTES.md](docs/md-documents/API_ROUTES.md) | API routes index |
| 🗄️ Neon DB Setup | [docs/md-documents/NEON_SETUP.md](docs/md-documents/NEON_SETUP.md) | Neon PostgreSQL setup |
| 👑 Admin Account | [docs/md-documents/ADMIN_ACCOUNT.md](docs/md-documents/ADMIN_ACCOUNT.md) | Admin account setup |
| 🏛️ Gov Implementation | [docs/md-documents/GOVERNMENT_PROGRESSION_IMPLEMENTATION.md](docs/md-documents/GOVERNMENT_PROGRESSION_IMPLEMENTATION.md) | Government implementation |
| 🎮 UML Diagram | [docs/md-documents/UML.md](docs/md-documents/UML.md) | Original UML diagrams |

---

## 🔬 Feature Flags Reference

### Implemented Features ✅

| Feature | Status | Key Files |
|---------|--------|-----------|
| ✅ User Registration/Login | **Complete** | `server/routes.ts` (POST /api/auth) |
| ✅ Session Auth | **Complete** | `server/basicAuth.ts` |
| ✅ Turn System (6/min) | **Complete** | `server/services/turnSystemService.ts` |
| ✅ Resource Economy | **Complete** | `server/gameEngine.ts` |
| ✅ Building Construction | **Complete** | `server/gameEngine.ts` (startBuilding, processConstructionQueue) |
| ✅ Ship Construction | **Complete** | `server/gameEngine.ts` (buildShips) |
| ✅ Combat Formations | **Complete** | `server/routes.ts` (5 formations) |
| ✅ Technology Tree | **Complete** | `shared/config/technologyTreeConfig.ts` |
| ✅ Research Queue | **Complete** | `shared/schema.ts` (researchQueue) |
| ✅ Research XP | **Complete** | `shared/config/researchXPConfig.ts` |
| ✅ Research Labs | **Complete** | `shared/schema.ts` (researchLab) |
| ✅ Bank Vault System | **Complete** | `server/routes-bank-vault.ts` |
| ✅ Currency System | **Complete** | `server/routes.ts` (Silver/Gold/Platinum) |
| ✅ Auction House | **Complete** | `server/routes.ts` (POST/GET /api/auctions) |
| ✅ Market Orders | **Complete** | `server/routes.ts` (marketOrders) |
| ✅ Player-to-Player Trades | **Complete** | `server/routes-trading.ts` |
| ✅ Expedition System | **Complete** | `server/services/missingFeatureService.ts` |
| ✅ Alliance System | **Complete** | `shared/schema.ts` (alliances, allianceMembers) |
| ✅ Achievements | **Complete** | `shared/config/achievementsConfig.ts` |
| ✅ Prestige System | **Complete** | `shared/schema.ts` (prestigeLevel, prestigeBonus) |
| ✅ Durability System | **Complete** | `shared/schema.ts` (equipment/fleet/building durability) |
| ✅ Empire Progression | **Complete** | `server/routes.ts` (Level/Tier/XP) |
| ✅ Universe Generation | **Complete** | `server/services/universeSeedService.ts` |
| ✅ Civilization System | **Complete** | `server/services/civilizationSystemService.ts` |
| ✅ Government System | **Complete** | `shared/config/governmentProgressionTreeConfig.ts` |
| ✅ Commander Skills/Talents | **Complete** | `shared/config/commanderSkillTreeSystem.ts` |
| ✅ Life Support Systems | **Complete** | `shared/config/lifeSupportSystemsConfig.ts` |
| ✅ Mega Structures | **Complete** | `shared/config/megastructuresConfig.ts` |
| ✅ Orbital Stations | **Complete** | `shared/config/orbitalStationsConfig.ts` |
| ✅ Starbases | **Complete** | `shared/schema.ts` (starbases) |
| ✅ Moon Bases | **Complete** | `shared/schema.ts` (moonBases) |
| ✅ Player Colonies | **Complete** | `shared/schema.ts` (playerColonies) |
| ✅ Equipment Loadouts | **Complete** | `shared/config/equipmentLoadoutSystem.ts` |
| ✅ Equipment Tempering | **Complete** | `shared/config/equipmentTemperingSystem.ts` |
| ✅ Blueprint System | **Complete** | `shared/config/eveBlueprintSystem.ts` |
| ✅ Smithy System | **Complete** | `shared/config/smithySystem.ts` |
| ✅ Army System | **Complete** | `shared/schema.ts` (troops, squads) |
| ✅ Guild System | **Complete** | `shared/schema.ts` (guilds, guildMembers) |
| ✅ Friends System | **Complete** | `shared/schema.ts` (friends, friendRequests) |
| ✅ Live Operations | **Complete** | `shared/config/liveOpsContentConfig.ts` |
| ✅ Multiplayer Bonuses | **Complete** | `shared/config/multiplayerBonusesConfig.ts` |
| ✅ Auto-Buy Resources | **Complete** | `server/services/autoBuyResourcesService.ts` |
| ✅ Custom Labs | **Complete** | `shared/config/customLabConfig.ts` |
| ✅ Constructor Yard | **Complete** | `server/services/constructorYardService.ts` |
| ✅ Enemy Races (5) | **Complete** | `shared/config/enemyRacesConfig.ts` |
| ✅ Knowledge System | **Complete** | `route: /api/knowledge/types` |
| ✅ Raid Boss System | **Complete** | `server/routes.ts` (/api/bosses) |
| ✅ 55+ Radix UI Components | **Complete** | `frontend/src/components/ui/*` |
| ✅ 53+ Game Pages | **Complete** | `frontend/src/pages/*` |
| ✅ 60+ API Route Files | **Complete** | `server/routes/*` |
| ✅ 28 Game Services | **Complete** | `server/services/*` |
| ✅ Docker Support | **Complete** | `Dockerfile`, `docker-compose.yml` |
| ✅ Vite Dev Server | **Complete** | `vite.config.ts` |
| ✅ Drizzle ORM Migrations | **Complete** | `drizzle.config.ts` |

### In Development 🚧

| Feature | Status | Key Files |
|---------|--------|-----------|
| 🚧 OGameX Full Integration | In Progress | `shared/ogamex/*`, `generated/ogamex-ts/*` |
| 🚧 Mega Structure UI | In Progress | `frontend/src/pages/MegaStructures.tsx` |
| 🚧 Procedural Expeditions | In Progress | `shared/config/expeditionData.ts` |
| 🚧 Real-time Leaderboards | In Progress | `server/routes-leaderboard.ts` |
| 🚧 Mobile Optimization | In Progress | `frontend/src/hooks/use-mobile.tsx` |

### Planned 📋

| Feature | Priority | Notes |
|---------|----------|-------|
| 📋 Redis Cache Layer | Medium | Performance scaling |
| 📋 WebSocket Real-time | High | Live game updates |
| 📋 Job Queue (BullMQ) | Medium | Turn processing |
| 📋 Microservices | Low | Long-term scalability |
| 📋 GraphQL API | Low | Alternative API |
| 📋 Mobile App | Low | React Native |

---

## 🗺️ Project Structure (Quick Reference)

```
stellar-dominion3/
├── 📁 server/               # Express.js backend (60+ routes, 28 services)
│   ├── 📁 routes/           # API route modules (60 files)
│   ├── 📁 services/         # Game logic services (28 services)
│   ├── 📁 db/               # Database connection & init
│   ├── 📁 config/           # Server configuration
│   ├── 📁 console/          # Server console & monitoring
│   ├── 📁 middleware/        # Express middleware
│   └── 📄 *.ts              # Core server files
│
├── 📁 shared/               # Shared TypeScript code
│   ├── 📁 config/           # Game configuration (100+ files)
│   ├── 📁 ogamex/           # OGameX integration
│   ├── 📁 types/            # Type definitions
│   ├── 📁 sql/              # SQL utilities
│   ├── 📄 schema.ts         # Database schema (2,020 lines)
│   └── 📄 *.ts              # Core shared files
│
├── 📁 frontend/             # React frontend (53+ pages)
│   └── 📁 src/
│       ├── 📁 pages/        # Page components
│       ├── 📁 components/   # UI & feature components
│       ├── 📁 hooks/        # Custom React hooks
│       ├── 📁 lib/          # Libraries & context
│       └── 📄 main.tsx      # Entry point
│
├── 📁 docs/                 # Documentation (60+ .md files)
│   ├── 📁 md-documents/     # Game design & architecture docs
│   └── 📄 *.md              # Feature & system docs
│
├── 📁 xenoberage/           # Universe Empires legacy reference
│   ├── 📁 classes/          # PHP classes
│   ├── 📁 includes/         # PHP includes
│   ├── 📁 config/           # PHP configuration
│   └── 📄 *.php             # PHP game pages (100+ files)
│
├── 📁 script/               # Build & utility scripts
├── 📁 generated/            # Generated TypeScript scaffolds
├── 📁 sql/                  # SQL scripts & references
├── 📁 config/               # Additional configs
│
├── 📄 package.json          # Dependencies & scripts
├── 📄 tsconfig.json         # TypeScript configuration
├── 📄 vite.config.ts        # Vite bundler configuration
├── 📄 drizzle.config.ts     # Drizzle ORM configuration
├── 📄 Dockerfile            # Docker build file
├── 📄 docker-compose.yml    # Docker compose setup
├── 📄 Procfile              # Platform process file
├── 📄 .env.local            # Local environment variables
└── 📄 STELLAR_DOMINION_UML_DESIGN.md  # Complete UML design doc
---

## ⚡ Tech Stack

```
Frontend:
├── React 19                  ─── UI framework
├── TypeScript 5.6            ─── Type-safe JavaScript
├── Vite 7                    ─── Build tool & HMR
├── Wouter                    ─── Lightweight routing
├── TanStack Query (React Query) ─── Server state management
├── TailwindCSS 4             ─── Utility-first CSS
├── Radix UI                  ─── Accessible UI primitives
├── Framer Motion             ─── Animation library
├── Recharts                  ─── Charts & graphs
├── Sonner                    ─── Toast notifications
└── React Hook Form           ─── Form management

Backend:
├── Express.js 4              ─── Web server framework
├── TypeScript 5.6            ─── Type-safe runtime
├── Drizzle ORM 0.39          ─── Type-safe database ORM
├── PostgreSQL                ─── Database (via pg)
├── Drizzle Zod               ─── Schema validation
├── Passport + Session        ─── Authentication
├── Express Session           ─── Session management
├── ws                        ─── WebSocket support
└── tsx                       ─── TypeScript execution

Dev Tools:
├── Vite 7                    ─── Frontend bundler
├── esbuild                   ─── Server bundler
├── Drizzle Kit               ─── Migration tool
├── TailwindCSS 4             ─── CSS framework
├── PostCSS                   ─── CSS processing
└── Electron 42               ─── Desktop build target
```

---

## 📜 License

This project is licensed under the **AGPL v3** license.
Based on Universe Empires.

---

*Document generated from source code analysis — 2026*
*Repository: https://github.com/ArkansasIo/stellar-dominion3.git*
*Universe Empires Legacy: https://github.com/ArkansasIo/xenoberage.git*