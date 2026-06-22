<p align="center">
  <img src="docs/assets/logo.png" alt="Stellar Dominion Logo" width="400"/>
</p>

<h1 align="center">Stellar Dominion</h1>

<p align="center">
  A next-generation 4X space strategy MMORPG<br/>
  Build your empire. Conquer the galaxy. Command your fleet.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.6.0-blue" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
  <img src="https://img.shields.io/badge/alpha-1.5.0-orange" alt="Alpha"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL"/>
</p>

---

## Overview

**Stellar Dominion** is a massively multiplayer online 4X strategy game set in a procedurally generated persistent galaxy. Inspired by classics like **OGame** and **Stellaris**, it combines real-time resource management, deep fleet combat, RPG progression, and social systems into a modern browser-based experience.

### Key Features

- **Real-time economy** — Metal, Crystal, Deuterium, and Energy production with building and research scaling
- **Fleet combat** — 6 ship classes, 5 flange formations, weapon-armor matrix, and PvP/PvE battle modes
- **Research tree** — 900+ technologies across weapons, shielding, drives, and empire upgrades
- **Empire progression** — 999 empire levels, 21 tiers, prestige system, and 10 government types
- **Commander system** — Gacha-style commanders with skill and talent trees
- **Alliances & guilds** — Social features, raids, inter-galactic banking, and bounty systems
- **Megastructures** — Build colossal empire-defining structures
- **Market & trading** — Player-driven economy with auctions and port trading
- **Procedural galaxy** — Persistent, generated universe with star systems and planets
- **Desktop & web** — Runs in any browser or as an Electron desktop app (Windows, macOS, Linux)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.6, Vite 7, TailwindCSS 4, Radix UI (shadcn/ui) |
| Animation | Framer Motion 12 |
| Routing | Wouter 3 |
| State | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Backend | Express.js 4, Node.js 20+ |
| Database | PostgreSQL 16 (Neon serverless) |
| ORM | Drizzle ORM 0.39 |
| Auth | Passport.js + express-session |
| WebSocket | ws 8 |
| Desktop | Electron 42 |
| Build | esbuild (server), Vite (client) |
| Icons | Lucide React |

---

## Quick Start

### Prerequisites

- Node.js >= 20
- PostgreSQL 16+ (or a Neon serverless connection string)

### 1. Install dependencies

```bash
cd universe-empire-dominion3
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and session secret
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Seed the game catalog

```bash
npm run db:seed:ogame
```

### 5. Start development

```bash
npm run dev
```

The app runs at **http://localhost:5001**.

### Docker (alternative)

```bash
docker-compose up -d
```

This starts PostgreSQL, the app server, and an Nginx reverse proxy.

---

## Project Structure

```
stellar-dominion3.5/
├── universe-empire-dominion3/     # Main application
│   ├── client/src/                # React 19 frontend (85 pages, 65 components)
│   │   ├── pages/                 # Game pages (Overview, Fleet, Combat, Galaxy, ...)
│   │   ├── components/ui/         # shadcn/Radix UI primitives
│   │   └── lib/                   # Game logic, data definitions, utilities
│   ├── server/                    # Express.js backend
│   │   ├── gameEngine.ts          # Core game tick engine
│   │   ├── combatEngine.ts        # Battle simulation engine
│   │   ├── storage.ts             # Database access layer (72 tables)
│   │   ├── routes*.ts             # 65+ API route modules
│   │   ├── services/              # 29 business logic services
│   │   └── systems/               # 12 game system modules
│   ├── shared/                    # Shared TypeScript layer
│   │   ├── schema.ts              # Drizzle ORM schema (72 tables)
│   │   ├── config/                # 95+ game configuration files
│   │   └── sql/                   # Seeds, triggers, views
│   ├── docs/                      # 80+ documentation files
│   ├── script/                    # Build and utility scripts
│   ├── migrations/                # Database migrations
│   └── config/                    # Deployment configs (Docker, Railway, Render, ...)
├── game-source/                   # Legacy PHP/Laravel OGameX reference
│   └── rust/                      # Rust battle engine (FFI, 200x faster than PHP)
├── java/niverse3d/                # LibGDX 3D space viewer prototype
├── threejs_galaxy_viewer_project/ # Three.js browser galaxy viewer
└── README.md
```

---

## Game Systems

| System | Description |
|--------|-------------|
| Turn System | Offline time converts to turns; drives all progression |
| Resource Economy | Metal, Crystal, Deuterium, Energy with mine/building scaling |
| Combat | PvE/PvP with formations, crit system, and 100-round battles |
| Research | 900+ technologies across 10+ categories |
| Fleet | 6 ship classes with fitting and blueprint crafting |
| Alliances | Group management, raids, and diplomacy |
| Government | 10 government types with ethics and civics |
| Commanders | Gacha recruitment with skill trees and talent systems |
| Megastructures | Late-game empire-defining constructions |
| Espionage | Scanning, intelligence, and sabotage |
| Market | Player trading, auctions, port commerce |
| Colonization | Expand across star systems and planets |
| Guilds | Player organizations with shared objectives |
| Achievements | Progression milestones and rewards |
| Live Ops | Server-wide events and seasonal content |

---

## Deployment

Stellar Dominion supports multiple deployment targets:

| Platform | Config |
|----------|--------|
| Docker | `Dockerfile` + `docker-compose.yml` |
| Railway | `railway.json` |
| Render | `render.yaml` |
| Fly.io | `fly.toml` |
| Vercel | `vercel.json` |
| Heroku | `Procfile` |
| Firebase | `firebase.json` |
| Electron | `electron-builder.json` |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session secret |
| `ADMIN_USERNAME` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password |
| `AUTH_BYPASS` | Skip auth in development (set `true`) |

---

## Building for Desktop

```bash
# Build and package for Windows + Linux
npm run electron:build

# Dev mode with Electron
npm run electron:dev
```

Produces installers for Windows (NSIS/portable), macOS (DMG/ZIP), and Linux (AppImage).

---

## Documentation

Extensive docs live in [`universe-empire-dominion3/docs/`](universe-empire-dominion3/docs/):

- [Architecture](universe-empire-dominion3/docs/ARCHITECTURE.md) — System design and data flow
- [Game Design](universe-empire-dominion3/docs/GAME_DESIGN.md) — Core loops, formulas, balance
- [Systems Overview](universe-empire-dominion3/docs/SYSTEMS_OVERVIEW.md) — All 41 game systems
- [Deployment Guide](universe-empire-dominion3/docs/DEPLOYMENT_GUIDE.md) — Platform setup
- [API Routes](universe-empire-dominion3/docs/API_ROUTES.md) — 65+ API endpoints
- [Combat](universe-empire-dominion3/docs/Combat.md) — Battle mechanics and unit stats
- [Technology](universe-empire-dominion3/docs/Technology.md) — Research tree
- [Economy](universe-empire-dominion3/docs/Economy.md) — Resource production formulas
- [Ships](universe-empire-dominion3/docs/Ships.md) — Fleet composition and stats
- [Game Engine](docs/GAME_ENGINE.md) — Engine internals and technical details

---

## License

MIT License. Copyright 2025-2026 Stephen (ArkansasIo).

**Stellar Dominion™** and **ArkansasIo™** are trademarks of Stephen.
