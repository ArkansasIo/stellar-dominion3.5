# Overview

Stellar Dominion is a comprehensive 4X space strategy MMORPG browser game with heavy focus on:
- **Real-time Resource Management** - 3-resource economy (Metal, Crystal, Deuterium) with dynamic pricing
- **Fleet Combat & Tactics** - Multi-layer damage system, combat formations, detailed battle logs
- **RPG Progression** - Empire leveling (1-999), tier system (1-21), prestige mechanics
- **Knowledge Mastery** - 10 knowledge types across 4 classes and 5 tiers with synergy system
- **Player Economy** - Bank system, 3-tier currency (Silver/Gold/Platinum), trading, auctions
- **Persistent Galaxy** - Procedurally generated, deterministic universe with 10 planet classes
- **53 Game Pages** - Comprehensive UI for all systems with modern dashboard styling
- **22 Config Systems** - Highly customizable game mechanics and balancing

Modern tech stack: React 18+/TypeScript frontend, Express.js backend, PostgreSQL database, Drizzle ORM, TailwindCSS/Radix UI for UI.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
- **Framework**: React 18+ with TypeScript (Vite bundler).
- **UI**: Shadcn/UI (built on Radix UI) and Tailwind CSS for styling, including light/dark modes.
- **Routing**: Wouter.
- **State Management**: React Context API (`GameContext`) for global game state.
- **Data Fetching**: TanStack Query (React Query) for server state.
- **Design Pattern**: Component-based architecture with a central `GameContext` managing resources, buildings, fleets, missions, and real-time game ticks via a client-side game loop. A simulated game loop runs every second to update game state.

## Backend
- **Framework**: Express.js with TypeScript (Node.js).
- **Database**: Drizzle ORM with Neon PostgreSQL (serverless).
- **Authentication**: Username/password with SHA-256 hashing.
- **Session Management**: Express-session with `connect-pg-simple` for PostgreSQL session storage.
- **API Pattern**: RESTful API under `/api` for authentication, game state, missions, messaging, alliances, and market operations.
- **Session Strategy**: Server-side sessions stored in PostgreSQL with HTTP-only cookies, expiring after 7 days.
- **Design Decision**: Single-page application (SPA) architecture; Express serves as an API and static file server.

## Data Storage
- **Primary Database**: PostgreSQL via Neon.
- **ORM**: Drizzle with Zod for schema validation.
- **Schema Design**: Heavily denormalized, utilizing JSONB columns for `player_states` to store complete game state (resources, buildings, research, units) as single records with nested objects. This optimizes for read-heavy queries and simplifies API interactions.
- **Key Tables**: `users`, `player_states`, `missions`, `messages`, `alliances`, `market_orders`, `auction_listings`, `auction_bids`, `queue_items`, `sessions`.

## Configuration System
- **Game Configuration**: `shared/config/gameConfig.ts` for resource rates, costs, combat stats, tech progression, market economy, Kardashev scale, and race bonuses.
- **System Configuration**: `shared/config/systemConfig.ts` for server settings, database, authentication, logging, caching, rate limiting, and monitoring.

## Administration System
- **Admin Ranks**: 5 hierarchical levels (Founder to Junior Moderator).
- **Admin Departments**: Moderation, Technical, Events, Support, Economy Teams.
- **Features**: RBAC with permission inheritance, audit logging, support ticket system, economy adjustment, backup management.

## User Permission System
- **User Tiers**: 5 progression levels (Newbie to Emperor) with unlockable features.
- **Features**: Tier-based rate limiting, account status management (active, restricted), badges, achievements, granular permission matrix, activity logging.

## Authentication and Authorization
- **Method**: Local username/password authentication with SHA-256.
- **Session**: PostgreSQL-backed server-side sessions via `connect-pg-simple` and HTTP-only cookies.
- **Authorization**: Session-based with middleware checking `req.session.userId`.
- **First-Time Setup**: Empire setup screen for new users.

## Game Systems

### Core Mechanics
- **Combat Engine**: Multi-layer damage (shield, armor, hull), evasion, accuracy, weapon effectiveness, target prioritization, detailed battle logs. Combat formations include Balanced, Aggressive, Defensive, Flanking, Pincer tactics.
- **Kardashev Scale**: 21-level empire progression based on resource accumulation, unlocking tech and buildings across all civilization tiers.
- **Turn-Based MMORPG Mechanics**: Tick-based game loop (1-second), queue processing for construction/research, mission lifecycle, per-tick resource production, atomic spending operations.

### Player Progression
- **Empire Progression System**: Comprehensive leveling system (1-999) with experience tracking. Tier system with 21 tiers granting progression bonuses and unlocks. Prestige system for hard resets with permanent multipliers.
- **Empire Value Calculation**: Total wealth = (Metal × 1) + (Crystal × 1.5) + (Deuterium × 2) + (Silver × 1) + (Gold × 100) + (Platinum × 10,000). Used for rankings and leaderboards.
- **Bank System**: Full banking interface with deposits, withdrawals, transaction history, account management, and compound interest.

### Knowledge & Mastery
- **Knowledge Library System**: Master 10 knowledge types (Military, Engineering, Science, Agriculture, Commerce, Diplomacy, Exploration, Arcane, Medicine, Espionage) across 4 classes (Novice/Apprentice/Journeyman/Expert) and 5 tiers (Foundation/Intermediate/Advanced/Master/Supreme). 2000+ total mastery points.
- **Knowledge Synergies**: Combining knowledge types grants unique bonuses (e.g., Military + Engineering = +20% combat building efficiency, Science + Arcane = +15% research speed).
- **Knowledge Generation**: Scientist units generate research points with multipliers based on knowledge class mastery.

### Economy & Trading
- **Currency System**: Three-tier currency economy (Silver, Gold, Platinum) with conversion rates and transaction logging. 20+ uses: trading, construction acceleration, research speedup, equipment purchase, alliance management, cosmetics, battle pass, premium features, espionage theft mechanics, dynamic market prices.
- **Auction House**: Player-to-player trading with item listings (common to legendary rarity), starting price/buyout, bid increments, duration (6-72 hours), bid history, search/filter/sort, real-time status.
- **Market System**: Buy/sell orders for resources with player-driven pricing.

### Universe & Content
- **Universe Generation**: Procedurally generated, deterministic universe with 10 planet classes, 7 asteroid types, 9 star types. Multi-level galactic hierarchy: Galaxies → Quadrants → Sectors → Systems → Planets. Planets divided into Continents → Countries → Territories.
- **Resource Fields & Mining**: Mineable Resource Fields generating Metal/Crystal/Deuterium with extraction units and depletion tracking. Player Colonies manage populations and resources.
- **Technology System**: 120+ facilities, 7 rarity tiers, 9 tech classes, synergies, progression trees unlocked through research.
- **Unit Management**: Civilians, Military, Specialist unit types with 5 classes (Warrior, Ranger, Mage, Paladin, Rogue). Training, ranks, jobs, equipment, sustenance (food/water).
- **Unit Research System**: 6 research categories (unit types, classes, jobs, training, genetics, combat) with 3 tiers enabling new unit classifications.

### Game Systems
- **Turn System**: 6 turns per minute with 24-hour offline accumulation cap, max 1000 current turns, server-side accrual with atomic operations.
- **Expeditions**: Fleet/troop composition, 5 types (Exploration/Military/Scientific/Trade/Conquest), encounter management, resource rewards.
- **Battles**: Space vs Ground, casualties tracking, formation tactics, detailed battle logs.
- **Alliances**: Diplomacy, mutual defense, trade routes, sanctions, raid groups.
- **Achievements & Quests**: Milestone tracking, rewards, progression unlocks.
- **Admin System**: 5 hierarchical admin ranks (Founder to Junior Moderator) with departments, audit logging, economy adjustment, backup management.

# External Dependencies

## Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Replit Infrastructure**: Deployment platform.

## NPM Packages (Key)
- **@neondatabase/serverless**: PostgreSQL driver.
- **drizzle-orm**: Type-safe ORM.
- **express**: Web server framework.
- **express-session**: Session management.
- **connect-pg-simple**: PostgreSQL session store.
- **@tanstack/react-query**: Server state management.
- **wouter**: Client-side routing.
- **zod**: Runtime type validation.
- **@radix-ui/***: Headless UI primitives.
- **framer-motion**: Animation library.
- **recharts**: Chart/graph library.

## Vite Plugins
- **@replit/vite-plugin-cartographer**: Code navigation.
- **@replit/vite-plugin-dev-banner**: Development environment indicator.
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error display.