# Stellar Dominion

A comprehensive 4X space strategy game built with React, Express, and PostgreSQL. Explore the galaxy, manage your empire, research technologies, and engage in epic space battles.

**Website:** [stellar-dominion.replit.dev](https://stellardominion.ca
**Version:** 1.0.0-release  
**Status:** 🟢 PRODUCTION READY
**Last Updated:** March 14, 2026

## March 14, 2026 Update

- Added structured entity archetype catalogs for starships, motherships, units, untrained units, jobs, megastructures, space stations, starbases, and moonbases.
- Added dedicated 90-entry building archetype and 90-entry factory job archetype catalogs.
- Added shared frame, population, food, and water system configuration with reusable demand, pressure, and growth helpers.
- Added life-support and archetype API routes, plus Colonies page telemetry for frame, population, food, and water snapshot data.
- Corrected the development startup flow so `npm run dev` launches the Express server with integrated Vite middleware when `DATABASE_URL` is available.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Game Systems](#game-systems)
- [Architecture](#architecture)
- [Development](#development)
- [Documentation](#documentation)
- [License](#license)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+, 22
- PostgreSQL (Neon database via Replit)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run db:push

# Type checking
npm run check

# Smoke test life support routes
npm run smoke:life-support

# Production build
npm run build
```

Access the game at `http://localhost:5001`

When `DATABASE_URL` is present, `npm run dev` starts the Express server with Vite middleware on `http://localhost:5001`. Without `DATABASE_URL`, it falls back to a client-only Vite server.
The life-support smoke test targets `http://localhost:5001` by default and accepts `BASE_URL` for alternate ports.

---

## ✨ Features

### Core Systems
- **🏗️ Colony Management** - Build and manage planetary colonies
- **🔬 Research Technology Tree** - 120+ facilities with tech trees
- **🚀 Fleet Management** - Build and command diverse spacecraft
- **⚔️ Combat System** - Multi-layer damage, tactics, battle formations
- **🗺️ Galaxy Exploration** - Procedurally-generated universe with expeditions
- **🤝 Alliance System** - Form alliances, trade resources, conduct diplomacy
- **💰 Market** - Buy/sell resources with other players
- **🏦 Bank System** - Deposit/withdraw currency, track transactions
- **📊 Empire Progression** - Empire leveling (1-999), tiers (1-21), rankings
- **🧠 Knowledge Library** - Master 10 knowledge types, 4 classes, 5 tiers (2000+ points)

### Expedition System
- **Fleet & Troop Composition** - Assemble diverse teams for missions
- **5 Expedition Types:**
  - Exploration (discover new worlds)
  - Military (conquer territories)
  - Scientific (unlock research bonuses)
  - Trade (establish commerce routes)
  - Conquest (expand empire)
- **Encounter Management** - Handle hostile, peaceful, and discovery encounters
- **Resource Rewards** - Gain resources from successful missions

### Technology Tree
- **Physics Research** - Propulsion, sensors, weapons
- **Society Research** - Diplomacy, espionage, culture
- **Engineering Research** - Structures, production, defense
- **Tier System** - Progressive technology unlocks
- **Prerequisites** - Technologies build on each other
- **Bonuses** - Research grants resource/production bonuses

### Level & Tier Progression System
- **999 Levels** - Comprehensive leveling system (Level 1-999) with exponential experience requirements
- **99 Tiers** - Advanced tier system (Tier 1-99) unlocked every 10 levels
- **Universal Application** - Applies to all game entities:
  - Stats (Power, Defense, Mobility, Utility)
  - Sub-Stats (Precision, Endurance, Efficiency, Control)
  - Attributes (Tech, Command, Logistics, Survivability)
  - Sub-Attributes (Sensor Range, Energy Use, Maintenance, Adaptation)
  - Types, Sub-Types, Classes, Sub-Classes
- **Dynamic Scaling** - Progressive multipliers for each level and tier
  - Level multipliers: 1.0 + (0.01 × level)
  - Tier multipliers: 1.0 + (0.05 × tier)
  - Combined multipliers stack for exponential growth
- **Tier Unlocks** - Major milestones at tiers 10, 20, 30, 40, 50, 60, 70, 80, 90, 99
  - Elite Status (Tier 10)
  - Legendary Tier (Tier 20)
  - Mythic Powers (Tier 30)
  - Transcendent Form (Tier 40)
  - Cosmic Ascension (Tier 50)
  - Dimensional Mastery (Tier 60)
  - Reality Warping (Tier 70)
  - Universal Entity (Tier 80)
  - Omnipotent Being (Tier 90)
  - Absolute Power (Tier 99)
- **Power Level** - Calculated from combined level, tier, and all stats
- **Tier Names** - Basic → Advanced → Elite → Legendary → Mythic → Transcendent → Cosmic → Dimensional → Reality Bender → Universal → Godlike
- **Visual Tiers** - Color-coded tier progression (Gray → Bronze → Silver → Purple → Blue → Green → Yellow → Orange → Red → Cyan → Magenta)

---

## 🎮 Game Systems

### Resource Management
- **Metal** - Basic construction material (value: 1x)
- **Crystal** - Advanced technology component (value: 1.5x)
- **Deuterium** - Fuel and energy source (value: 2x)
- **Energy** - Power generation and consumption

### Currency System
- **Silver** - Base currency (value: 1x, everyday transactions)
- **Gold** - Premium currency (value: 100x, advanced features)
- **Platinum** - Ultra-premium currency (value: 10,000x, exclusive items)
- **20+ Uses**: Trading, construction acceleration, research speedup, equipment, alliance management, cosmetics, battle pass, espionage, etc.

### Entity Archetypes (90 Types)
- **Starships (12 types)** - Interceptor, Battlecruiser, Dreadnought, Carrier, Scout, Bomber, Frigate, Destroyer, Corvette, Titan, Flagship, Assault Ship
- **Motherships (6 types)** - Command Ship, Factory Ship, Hospital Ship, Colony Ship, Resource Harvester, Mobile Fortress
- **Troops (10 types)** - Infantry, Heavy Infantry, Special Forces, Sniper, Medic, Engineer, Scout, Assault Team, Paratrooper, Commando
- **Units (10 types)** - Tank, Artillery, Mech, Drone, Walker, Gunship, Transport, Support Vehicle, Recon Unit, Heavy Armor
- **Untrained Units (6 types)** - Conscript, Militia, Volunteer, Reserve, Recruit, Cadet
- **Civilian Units (8 types)** - Worker, Scientist, Trader, Diplomat, Administrator, Colonist, Miner, Farmer
- **Military Units (10 types)** - Marine, Pilot, Officer, Sergeant, Captain, General, Admiral, Commander, Elite Guard, Spec Ops
- **Government Units (6 types)** - Governor, Senator, Minister, Ambassador, Intelligence Agent, Bureaucrat
- **Items (6 types)** - Power Cell, Medical Kit, Tech Module, Resource Pack, Blueprint, Artifact
- **Weapons (6 types)** - Laser Rifle, Plasma Cannon, Railgun, Missile Launcher, Energy Blade, Graviton Beam
- **Armors (5 types)** - Light Armor, Medium Armor, Heavy Armor, Power Armor, Shield Generator
- **Vehicles (5 types)** - APC, Hovertank, Assault Mech, Siege Engine, Battle Walker
- **Full Hierarchy** - Each archetype has: Type → SubType → Class → SubClass
- **Complete Stats** - 16 stat properties per archetype across 4 categories:
  - Base Stats: Power, Defense, Mobility, Utility
  - Sub Stats: Precision, Endurance, Efficiency, Control
  - Attributes: Tech, Command, Logistics, Survivability
  - Sub Attributes: Sensor Range, Energy Use, Maintenance, Adaptation

### Enemy Races & AI System (5 Factions)
- **The Krell Dominion** ⚔️ - Ruthless militaristic empire
  - Personality: Warmonger | Color: Dark Red | Homeworld: Krell Prime (Volcanic)
  - Bonuses: +30% Combat, +20% Expansion, -20% Diplomacy
  - Traits: Born Warriors, Aggressive Expansion, Fearless, Military Industrial Complex
  - Strategy: Military-focused with overwhelming force
  - Preferred Units: Battlecruisers, Dreadnoughts, Heavy Infantry, Tanks
  - AI Behavior: Aggressive counterattack, exploits weakness, 95% military priority
  
- **The Zenith Collective** 🤖 - Advanced AI civilization
  - Personality: Logical | Color: Dark Turquoise | Homeworld: Zenith Core (Artificial)
  - Bonuses: +35% Research, +20% Economy, +15% Combat
  - Traits: Machine Intelligence, Rapid Adaptation, Technological Superiority, Emotionless
  - Strategy: Technological superiority with efficient production
  - Preferred Units: Drones, Mechs, Scouts, Robot Factories
  - AI Behavior: Logical defense, exploits weaknesses, 90% research priority
  
- **The Varanthi Federation** 💰 - Diplomatic traders
  - Personality: Trader | Color: Gold | Homeworld: Varanthi Bazaar (Ocean Paradise)
  - Bonuses: +35% Economy, +30% Diplomacy, +15% Research
  - Traits: Master Traders, Diplomatic Excellence, Economic Powerhouse, Cultural Influence
  - Strategy: Economic dominance through trade networks
  - Preferred Units: Traders, Diplomats, Scouts, Transports, Governors
  - AI Behavior: Negotiates threats, offers alliances, 90% economy priority
  
- **The Void Swarm** 👾 - Hive mind bio-horrors
  - Personality: Aggressive | Color: Indigo | Homeworld: The Void Nest (Toxic)
  - Bonuses: +35% Expansion, +25% Combat, +20% Economy, -30% Diplomacy
  - Traits: Hive Mind, Rapid Reproduction, Biological Adaptation, Consume Everything
  - Strategy: Overwhelming numbers with rapid expansion
  - Preferred Units: Infantry, Militia, Conscripts, Assault Teams, Walkers
  - AI Behavior: Rush tactics, exploits all weaknesses, no diplomacy possible
  
- **The Celestial Ascendancy** ✨ - Ancient psychic empire
  - Personality: Isolationist | Color: Lavender | Homeworld: Celestial Sanctum (Crystal)
  - Bonuses: +25% Research, +20% Combat, +15% Economy
  - Traits: Psychic Powers, Ancient Knowledge, Dimensional Mastery, Superior Technology
  - Strategy: Balanced approach with unique abilities
  - Preferred Units: Commanders, Elite Guard, Flagships, Titans, Admirals
  - AI Behavior: Defensive posture, ignores weakness, rejects unauthorized trade

**AI Control Features:**
- Dynamic decision-making based on personality and game state
- Relationship system with memory of player actions
- Tactical behavior: attacks, retreats, negotiations, betrayals
- Honor system: races may or may not honor alliances
- Resource-driven expansion and military buildup
- Adaptive strategies based on player power level
- 8 personality types: Aggressive, Defensive, Expansionist, Trader, Isolationist, Warmonger, Peaceful, Logical
- 8 AI strategies: Rush, Turtle, Balanced, Economic, Military, Technological, Diplomatic, Mixed

**Homeworld Features:**
- Fully defended capitals with massive garrisons
- Unique planetary characteristics and resources
- Special structures: Shield grids, foundries, research complexes
- Population and production capacity
- Strategic locations across the galaxy

### Megastructures System (10 Types with 999 Levels & 99 Tiers)
- **Dyson Sphere** ☀️ - Stellar energy harvesting
  - Type: Infrastructure | Class: Support
  - Size: Galactic | Focus: Power generation and output
  - Base Power: 1000 | Output Scaling: 1.5x per level, 8.84x per tier
  
- **Ringworld** 🌍 - Planetary-scale habitat
  - Type: Infrastructure | Class: Support
  - Size: Solar | Focus: Capacity and construction
  - Base Capacity: 15,000 | Resilience Scaling: 900→1,900+
  
- **Megaforge** ⚙️ - Production and weapons manufacturing
  - Type: Production | Class: Hybrid
  - Size: Massive | Focus: Output and efficiency
  - Production Rate: 1500/turn | Crafting Speed: 5000→15,400+
  
- **Research Nexus** 🔬 - Scientific advancement hub
  - Type: Research | Class: Support
  - Size: Massive | Focus: Tech progress and control
  - Tech Stat: 300 | Research Acceleration: 99% efficiency
  
- **Orbital Fortress** 🛡️ - Planetary defense system
  - Type: Defense | Class: Defensive
  - Size: Huge | Focus: Armor, shields, and control
  - Armor Strength: 800 | Shield Capacity: 150,000+
  - Firepower: 800 | Critical Hit Range: 20,000 km
  
- **Generation Ship** 🚀 - Interstellar colonization
  - Type: Mobility | Class: Support
  - Size: Planetary | Focus: Logistics and cargo
  - Capacity: 12,000 | Logistics: 250
  
- **Matter Converter** ⚡ - Universal matter-energy transformation
  - Type: Production | Class: Hybrid
  - Size: Colossal | Focus: Resource processing
  - Conversion Rate: 1400 per turn | Tech Level: 250
  
- **Dimensional Gate** 🌀 - Exotic portal technology
  - Type: Exotic | Class: Experimental
  - Size: Massive | Focus: Teleportation and dimensional rifts
  - Control: 1500 | Tech: 350 (fastest research tier)
  - Reflection Chance: 80% (highest defensive tech)
  
- **Stellar Engine** ⭐ - Star system propulsion
  - Type: Mobility | Class: Hybrid
  - Size: Solar | Focus: Movement and logistics
  - Output: 1300 | Mobility: 1000+
  
- **Nova Cannon** 💥 - Ultimate superweapon
  - Type: Superweapon | Class: Offensive
  - Size: Colossal | Focus: Firepower and devastation
  - Firepower: 2000+ | Range: 100,000+ km
  - Damage Type: Stellar | Penetration: 150+

**Megastructure Progression System:**
- Level 1-999: Linear stat growth (1.0 to 15.98x multiplier)
- Tier 1-99: Exponential stat growth (1.0 to 8.84x multiplier)
- Combined multipliers stack multiplicatively for massive scaling
- Maintenance costs scale with level/tier
- Construction time depends on size and complexity

**Stat Categories:**
- **Base Stats**: Power, Efficiency, Resilience, Capacity
- **Sub Stats**: Precision, Endurance, Output, Control
- **Combat Stats**: 
  - Offensive: Firepower, Accuracy, Range, Rate of Fire, Ammo Capacity, Penetration, Critical Chance
  - Defensive: Armor, Shields, Shield Regen, Evasion, Damage Reduction, Reflection, Repair, Self-Healing
- **Attributes**: Tech, Command, Logistics, Survivability

**Strategic Ratings:**
- Offensive Power: Calculated from firepower, accuracy, penetration, and criticals
- Defensive Power: Calculated from armor, shields, damage reduction, and reflection
- Strategic Value: Combined offensive + defensive power adjusted by efficiency
- Threat Level: Dynamic based on weapon systems and activation status

### Knowledge & Learning
- **10 Knowledge Types**: Military, Engineering, Science, Agriculture, Commerce, Diplomacy, Exploration, Arcane, Medicine, Espionage
- **4 Knowledge Classes**: Novice, Apprentice, Journeyman, Expert
- **5 Knowledge Tiers**: Foundation, Intermediate, Advanced, Master, Supreme
- **2000+ Mastery Points**: Track progression across all systems
- **Synergy Bonuses**: Combining knowledge types unlocks unique bonuses

### Empire Progression
- **Empire Levels** - Progression system (1-999) with experience tracking
- **Tier System** - 21 tiers with progression bonuses and unlocks
- **Kardashev Scale** - Measure of civilization advancement
- **Prestige System** - Hard reset with permanent multipliers
- **Empire Value** - Total wealth calculation (resources + currency + fleet)
- **Leaderboards** - Rankings based on empire value
- **Units & Buildings** - Construct military and production facilities
- **Turn System** - 6 game turns per minute

### Combat
- **Battle System** - Fleet vs Fleet, Space vs Ground
- **Damage Calculation** - Based on unit types, research, bonuses
- **Casualty Tracking** - Monitor unit losses
- **Battle Logs** - Historical record of all engagements

### Diplomacy & Trade
- **Alliance System** - Join alliances for mutual defense
- **Trade Routes** - Establish commerce with other players
- **Market System** - Buy/sell orders for resources
- **Sanctions** - Economic pressure on rivals

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19, TailwindCSS, Radix UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Build:** Vite
- **Routing:** Wouter
- **Styling:** TailwindCSS + CVA

### Project Structure

```
stellar-dominion/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── TechnologyTree.tsx     # 🔬 Research tech tree UI
│   │   │   ├── Expeditions.tsx        # 🚀 Expedition management
│   │   │   ├── Fleet.tsx              # ⚔️ Fleet management
│   │   │   └── ...
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # Utilities and hooks
│   └── index.html            # Meta tags & entry point
│
├── server/                    # Backend Express application
│   ├── routes.ts             # 🌐 API routes and endpoints
│   ├── storage.ts            # 📊 Database storage interface
│   ├── db/                   # Database connection
│   ├── index.ts              # Server entry point
│   └── logger.ts             # Logging utilities
│
├── shared/                    # Shared code
│   └── schema.ts             # 📋 Database schema (Drizzle ORM)
│
├── sql/                       # Seed data
│   └── stellaris_tech_seed.sql
│
├── docs/                      # Documentation
│   ├── GAME_DESIGN.md        # 📖 Game design document
│   ├── DEVELOPER_GUIDE.md    # 👨‍💻 Developer documentation
│   └── ARCHITECTURE.md       # 🏗️ System architecture
│
└── package.json              # Dependencies
```

### Key Features by File

| File | Feature | Tags |
|------|---------|------|
| `client/src/pages/TechnologyTree.tsx` | 🔬 Research System | `#research #technology #ui` |
| `client/src/pages/Expeditions.tsx` | 🚀 Expedition System | `#expedition #fleet #troop` |
| `server/routes.ts` | 🌐 API Endpoints | `#api #routes #endpoints` |
| `shared/schema.ts` | 📋 Data Models | `#schema #database #entities` |
| `server/storage.ts` | 💾 Database Operations | `#database #crud #storage` |

---

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Run production build
npm run check         # Type checking with TypeScript
npm run db:push       # Push database schema changes

# Workflows (use from UI)
npm run dev:client    # Client-only development (Vite)
```

### Workflows

The project includes 4 automated workflows:

1. **Start application** - Runs development server with hot reload
2. **Database Setup** - Initializes and migrates database schema
3. **Production Build** - Compiles TypeScript and bundles assets
4. **Type Check** - Validates TypeScript without building

### Code Structure Conventions

- **Components** - Functional React components with TypeScript
- **Pages** - Full-page views in `client/src/pages/`
- **API Routes** - RESTful endpoints in `server/routes.ts`
- **Storage** - Database operations in `server/storage.ts`
- **Schema** - Data models in `shared/schema.ts`
- **Types** - TypeScript interfaces via Drizzle inference

### Adding a New Feature

1. **Define data model** in `shared/schema.ts`
2. **Create storage methods** in `server/storage.ts`
3. **Add API routes** in `server/routes.ts`
4. **Build UI components** in `client/src/pages/` or `client/src/components/`
5. **Connect frontend to API** using React Query hooks

---

## 📚 Documentation

### Documentation Files

- **[GAME_DESIGN.md](./GAME_DESIGN.md)** - Complete game design document
  - Game overview and concept
  - Core mechanics and systems
  - Progression and balancing
  - Player goals and victory conditions

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Developer documentation
  - Architecture overview
  - Database schema
  - API reference
  - Code examples
  - Setting up development environment

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
  - Technology stack
  - Component structure
  - Data flow
  - Performance considerations

### Source Code Documentation

All major functions and components include JSDoc comments with tags:

```typescript
/**
 * Launches a new expedition with fleet and troop composition
 * @tag #expedition #mission #space-exploration
 * @param userId - Player ID
 * @param name - Expedition name
 * @param type - Expedition type (exploration, military, scientific, trade, conquest)
 * @returns Created expedition object
 */
async createExpedition(userId: string, name: string, type: string, ...): Promise<any>
```

---

## 🎯 Game Progression

### Early Game (Turns 1-100)
- Build basic structures (Metal Mine, Crystal Mine, Refinery)
- Research foundational technologies (Metal Extraction, Crystal Processing)
- Build first combat units
- Explore nearby star systems

### Mid Game (Turns 100-500)
- Expand to multiple colonies
- Research advanced technologies (Armor, Weapons)
- Engage in trade with other players
- Form alliances

### Late Game (Turns 500+)
- Dominate through military or economic superiority
- Control entire regions of galaxy
- Conduct large-scale expeditions
- Reach high Kardashev scale

---

## 🔗 Game Systems Reference

### Technology Tree (25+ Technologies)
- **Physics (9 techs)**: Energy Production, Armor, Weapons, Propulsion, Shields, Sensors, Cloaking, Warp Drive, Quantum Physics
- **Society (8 techs)**: Espionage, Diplomacy, Trade Networks, Cultural Development, Information Systems, Ancient Civilizations, Alien Contact, Ancient Weapons
- **Engineering (8 techs)**: Metal Extraction, Crystal Processing, Deuterium Synthesis, Shipyard Upgrade, Defense Systems, Robot Factory, Solar Power Plant, Nanite Assembler

### Expedition Types
1. **Exploration** - Discover resources and artifacts
2. **Military** - Conquer territories
3. **Scientific** - Unlock research bonuses
4. **Trade** - Establish commerce
5. **Conquest** - Expand empire

### Resource Types
- Metal (construction)
- Crystal (technology)
- Deuterium (fuel)
- Energy (power)

---

## 🐛 Known Issues

- Database migrations may timeout on first push (use `npm run db:push --force`)
- Large galaxy maps may have performance issues with 10,000+ star systems
- Real-time battle animations need optimization for 50+ unit battles

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is an active development project. Contributions welcome!

### Development Guidelines
- Follow existing code style and conventions
- Add JSDoc comments for all functions
- Include proper error handling
- Test all new features
- Update documentation

---

## 📞 Support

- **GitHub Issues:** Report bugs and request features
- **Documentation:** See docs/ directory
- **Community:** Join our Discord (coming soon)

---

## 📈 Recent Updates (v1.0.0)

- ✨ **Megastructures System** - 10 unique mega-scale constructions with 999 levels and 99 tiers
  - Dyson Sphere, Ringworld, Megaforge, Research Nexus, Orbital Fortress
  - Generation Ship, Matter Converter, Dimensional Gate, Stellar Engine, Nova Cannon
  - Universal stat scaling: Level multipliers (1.0→15.98x), Tier multipliers (1.0→8.84x)
  - Complete stat systems: Base, Sub-Stats, Offense, Defense, Attributes
  - Strategic power calculations: Offensive, Defensive, Strategic Value ratings
  - Supports all megastructure types: Infrastructure, Production, Research, Defense, Exotic, Superweapons
  - Classes: Compact to Galactic sizes with unique construction requirements
  - Full upgrade system with level/tier progression and efficiency management
- ✨ **Enemy Races & AI System** - 5 unique enemy factions with AI control
  - The Krell Dominion (militaristic warmongers)
  - The Zenith Collective (logical AI civilization)
  - The Varanthi Federation (economic traders)
  - The Void Swarm (hive mind bio-horrors)
  - The Celestial Ascendancy (psychic isolationists)
  - Each with unique homeworld, bonuses, traits, and preferred strategies
  - Dynamic AI decision-making based on personality (8 types)
  - Relationship system with diplomatic stances
  - Tactical behaviors: attacks, retreats, negotiations, betrayals
  - Honor system for alliances
  - Resource-driven expansion and military AI
- ✨ **Level & Tier Progression System** - Complete 999-level, 99-tier progression system
  - Universal stat scaling for all entities (stats, sub-stats, attributes, sub-attributes)
  - Dynamic multipliers: Level (1.0 + 0.01×level), Tier (1.0 + 0.05×tier)
  - 11 tier milestones with unique unlocks (Elite → Legendary → Mythic → Cosmic → Godlike)
  - Experience-driven progression with exponential scaling
  - Power level calculation combining level, tier, and all stats
  - Color-coded tier visualization system
- ✨ **90 Entity Archetypes** - Comprehensive entity classification system
  - 12 starship types, 6 mothership types
  - 10 troop types, 10 unit types
  - Civilian, military, and government units (24 types)
  - Items, weapons, armors, vehicles (22 types)
  - Full hierarchical taxonomy: Type → SubType → Class → SubClass
  - 16 stat properties per archetype (base, sub, attributes, sub-attributes)
- ✨ **Complete Technology Tree** - Rebuilt research system with local data
  - 25+ technologies across Physics, Society, Engineering
  - Prerequisite system with dependency tracking
  - Research cost calculation with exponential scaling
  - Status tracking: locked, available, researching, completed
- ✨ **Max-State Boosting** - Server-side automatic stat maximization
  - All players automatically receive level 999, tier 99
  - All numeric stats maxed: resources, experience, progression values
  - Recursive value transformation for nested objects
- ✨ Bank system with deposits, withdrawals, and transaction history
- ✨ Empire progression with tier system and prestige mechanics
- ✨ Knowledge library with 10 knowledge types and synergy system
- ✨ 3-tier currency economy (Silver/Gold/Platinum)
- ✨ Empire value calculation and rankings leaderboard
- ✨ 53 game pages fully implemented
- ✨ 27 configuration files for all game systems
- ✨ 8+ API routes for progression and banking
- 🔧 Fixed account setup save failure (auto-create player state on first update)
- 🔧 Fixed critical database schema issues
- 🔧 Integrated all game source files with APIs

**Last Updated:** March 9, 2026  
**Developed by:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0])(https://github.com/Apocalypsecoder0))
