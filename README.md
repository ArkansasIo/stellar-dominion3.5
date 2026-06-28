<p align="center">
  <img src="docs/assets/logo.png" alt="Universe Civilization: Empires at War" width="480"/>
</p>

<h1 align="center">🌌 Universe Civilization: Empires at War</h1>

<p align="center">
  <em>A persistent browser-based sci-fi MMORPG & 4X strategy game</em><br />
  Build your empire. Colonize the stars. Dominate 90 universes.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="Version 2.0.0"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT"/>
  <img src="https://img.shields.io/badge/status-alpha-orange" alt="Status Alpha"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js" alt="Node.js 20+"/>
  <img src="https://img.shields.io/badge/SQLite3-003B57?logo=sqlite" alt="SQLite3"/>
  <img src="https://img.shields.io/badge/Socket.IO-010101?logo=socket.io" alt="Socket.IO"/>
</p>

---

## 📖 Project Overview

**Universe Civilization: Empires at War** is a massively multiplayer online 4X strategy game set across **90 procedurally generated universes** organized into **9 realm systems**. Players start with a single colony and expand into sprawling interstellar empires managing thousands of worlds, fleets, and diplomatic relations — all from within a web browser.

Inspired by classics like *OGame*, *Stellaris*, and *EVE Online*, the game combines real-time resource management, deep tactical combat, RPG-style progression, and persistent social systems into a modern, real-time browser-based experience. The game ticks forward continuously — your empire grows, your fleets fly, and your rivals scheme, even while you are offline.

### The 9 Realms

| Realm | Theme |
|-------|-------|
| **Aetheris** | The luminous core — high-resource starter systems |
| **Nyx** | Shadow sector — high risk, high reward |
| **Ignis** | Volcanic systems — rare minerals, harsh conditions |
| **Glaciem** | Frozen expanse — slow growth, ancient ruins |
| **Ferrum** | Industrial heartland — manufacturing focus |
| **Crystalis** | Crystal fields — advanced technology bonuses |
| **Nebula** | Gas giant clusters — research and trade hubs |
| **Void** | Empty space — uncharted territory, hidden threats |
| **Omega** | Endgame realm — endgame bosses and content |

---

## ✨ Key Features

- **Persistent MMO Universe** — Real-time game engine ticks 24/7; your empire never sleeps
- **90 Procedurally Generated Universes** — 9 realms × 10 universes each, each with unique star systems, planets, and resource distributions
- **Massive Scale** — Manage 1,000+ colonies per player across multiple universes
- **Fleet Combat System** — Tactical PvP and PvE battles with ship classes, formations, and weapon-armor matrices
- **Ground Combat** — Planetary invasion and defense with ground troops, fortifications, and orbital bombardment
- **Deep Research Trees** — 900+ technologies across weapons, shields, drives, empire management, and specializations
- **Complete Economy** — 4 primary resources (Metal, Crystal, Deuterium, Energy) with mining, refining, and trading
- **Player-Driven Marketplace** — Buy/sell orders, auctions, and inter-realm commerce
- **Alliance & Diplomacy** — Alliances, non-aggression pacts, trade agreements, shared territory, and alliance wars
- **Espionage System** — Scan enemy colonies, steal intelligence, launch sabotage operations
- **Crafting & Blueprints** — Research and build custom ships, weapons, modules, and structures
- **Population Simulation** — Colonies have populations that grow, require resources, and provide tax income
- **Commander System** — Recruit and level up commanders with unique skill trees and talent builds
- **Government & Civics** — Choose from 10 government types with unique bonuses and policy options
- **Megastructures** — Build galaxy-spanning structures: Dyson spheres, ring worlds, gate networks
- **Live Events** — Server-wide events, seasonal content, universe crises, and boss invasions
- **Real-Time Updates** — WebSocket-powered live updates for fleet movements, battles, and chat
- **Cross-Platform** — Runs in any modern browser; Electron desktop build available

---

## 📸 Screenshots

<p align="center">
  <i>Screenshots coming soon. Stay tuned for previews of the galaxy map, colony management, fleet view, and combat replays.</i>
</p>

---

## 🎮 Game Systems Overview

### Universe System
90 unique universes split across 9 thematic realms, each procedurally seeded with star systems, planets, moons, asteroid belts, and special anomalies. Players can settle and operate across multiple universes simultaneously, using gate networks to travel between realms.

### Empire Management
Each player controls an empire with persistent progression across 999 levels and 21 tiers. Manage resources, population, taxation, government policies, and territorial claims. Prestige system allows veterans to reset for permanent bonuses.

### Colony Management
Build and manage thousands of colonies simultaneously. Each colony has its own production chain, population, defense grid, and specializations. Construct buildings (mines, factories, labs, shipyards, defensive structures) and assign colonists to optimize output.

### Fleet System
Construct and customize fleets using 6+ ship classes (Fighter, Frigate, Cruiser, Destroyer, Battleship, Carrier) with modular fitting (weapons, shields, armor, special modules). Fleets can be assigned to missions: patrol, attack, defend, transport, colonize, or explore.

### Combat System
Two-phased combat: **Space phase** — fleet-vs-fleet battles with formation positioning, range mechanics, and morale. **Ground phase** — planetary invasions with troop deployments, fortifications, and bombardment support. Battles are simulated in real-time with full replay support.

### Research
900+ technologies organized into specialized trees: Weapons, Shielding, Propulsion, Energy, Manufacturing, Xenobiology, Psionics, and Temporal. Research is queued and progresses over time, with bonuses from labs, scientists, and certain government types.

### Crafting
Blueprints are earned through research, exploration, or trade. Craft custom ships, modules, weapons, and structures using refined resources. Quality tiers and rarity levels affect performance.

### Economy
Full player-driven economy with resource extraction, refining, manufacturing, and trade. The marketplace supports buy/sell orders, auctions, and direct trading. Resource exchange rates fluctuate based on supply, demand, and realm conditions.

### Diplomacy
Form alliances, sign treaties (NAP, trade pacts, defense pacts, shared vision), declare war, or negotiate peace. Alliances can control territory, build shared structures, and wage coordinated wars.

### Espionage
Deploy spy satellites, infiltrate enemy colonies, steal research data, sabotage production, or launch counter-intelligence operations. Espionage level determines scan depth and success rates.

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript 5.6** | Type-safe development |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI / shadcn/ui** | Accessible component primitives |
| **React Router** | Client-side routing |
| **Socket.IO Client** | Real-time WebSocket communication |
| **TanStack React Query 5** | Server state management |
| **React Hook Form + Zod** | Form validation |
| **Framer Motion** | Animations |
| **Wouter** | Lightweight routing alternative |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20+** | Runtime |
| **Express.js 4** | HTTP server & API framework |
| **TypeScript 5.6** | Type-safe development |
| **Socket.IO** | Real-time bidirectional events |
| **Better-SQLite3** | Embedded database engine |
| **Drizzle ORM** | Type-safe query builder & migrations |
| **JWT + bcrypt** | Authentication & password hashing |
| **Zod** | Runtime validation |

### Database
| Technology | Purpose |
|------------|---------|
| **SQLite3** | Primary database (embedded, zero-config) |
| **Drizzle Kit** | Schema management & migrations |

### Infrastructure
| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Nginx** | Reverse proxy |
| **Electron** | Desktop application build |
| **esbuild** | Server bundling |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20 (recommended: 20 LTS)
- **npm** >= 9 or **pnpm** >= 8

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ArkansasIo/universe-civilization.git
cd universe-civilization

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your configuration (database path, JWT secret, etc.)

# 4. Initialize the database
npm run db:generate
npm run db:push

# 5. Seed the game data
npm run db:seed:ogame

# 6. Start development servers
npm run dev
```

The application will be available at **http://localhost:5000** (client) and **http://localhost:5001** (API server).

> **Note:** By default, the development setup uses SQLite3 — no external database server required.

### Docker Deployment

```bash
docker-compose up -d
```

Starts the application, database, and reverse proxy in containers.

---

## 📁 Project Structure

```
universe-civilization/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/             # Game pages
│   │   ├── components/        # UI components
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & game logic
│   │   └── styles/            # Global styles
│   ├── index.html
│   └── package.json
├── server/                    # Express.js backend
│   ├── index.ts               # Server entry point
│   ├── gameEngine.ts          # Core game loop & tick engine
│   ├── combatEngine.ts        # Battle simulation engine
│   ├── storage.ts             # Database access layer
│   ├── routes-*.ts            # API route modules (65+)
│   ├── services/              # Business logic services
│   ├── systems/               # Game system modules
│   ├── middleware/             # Express middleware
│   └── config/                # Server configuration
├── shared/                    # Shared TypeScript code
│   ├── schema.ts              # Drizzle ORM schema
│   ├── types.ts               # Shared type definitions
│   ├── gamedata.ts            # Game data constants
│   └── config/                # Game configuration files
├── database/                  # Database scripts & seeds
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # System design
│   ├── GDD.md                 # Game Design Document
│   ├── API_ROUTES.md          # API endpoint reference
│   ├── Combat.md              # Combat mechanics
│   ├── Economy.md             # Resource formulas
│   ├── Technology.md          # Research tree docs
│   └── Ships.md               # Fleet & ship stats
├── scripts/                   # Build & utility scripts
├── migrations/                # Database migrations
├── docker-compose.yml         # Docker setup
├── Dockerfile                 # Container build
├── drizzle.config.ts          # Drizzle configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Workspace root
```

---

## 💻 Development

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (client + server) |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start backend dev server only |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:seed:ogame` | Seed initial game catalog data |
| `npm run admin:create` | Create an admin user |

### Code Style

- **TypeScript** — Strict mode enabled; avoid `any` types where possible
- **ESLint** — Follows the project ESLint configuration
- **Formatting** — Use consistent 2-space indentation
- **Naming** — camelCase for variables/functions, PascalCase for types/components, kebab-case for files
- **APIs** — RESTful endpoints with Zod validation on inputs
- **Database** — Schema first with Drizzle ORM; always generate migrations after schema changes

---

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Code of conduct
- Development workflow
- Pull request process
- Coding standards

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|----------|-------------|
| [Game Design Document](docs/GDD.md) | Core game loops, formulas, balancing |
| [Architecture](docs/ARCHITECTURE.md) | System architecture & data flow |
| [Systems Overview](docs/SYSTEMS_OVERVIEW.md) | All 41 game systems |
| [API Routes](docs/API_ROUTES.md) | Complete API endpoint reference |
| [Combat](docs/Combat.md) | Battle mechanics & unit stats |
| [Economy](docs/Economy.md) | Resource production & economy formulas |
| [Technology](docs/Technology.md) | Research tree overview |
| [Ships](docs/Ships.md) | Fleet composition & ship statistics |
| [Database Schema](docs/SQL_DATABASE.md) | Entity relationship diagrams & table definitions |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Platform-specific deployment instructions |
| [UML Diagrams](docs/UML.md) | Class diagrams & system relationships |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Universe Civilization: Empires at War</b> — Copyright 2025-2026 Stephen<br />
  Built with ❤️ for the 4X strategy and space MMO community
</p>
