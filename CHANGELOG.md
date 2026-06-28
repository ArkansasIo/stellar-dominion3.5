# Changelog

All notable changes to **Universe Civilization: Empires at War** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-06-15

### Added
- Full Game Design Document (GDD) covering all game systems, mechanics, and progression
- Unified Modeling Language (UML) documentation suite with class, sequence, and state diagrams
- Architecture decision records (ADRs) for major system design choices
- API reference documentation covering all public and internal endpoints
- Database schema documentation with entity relationship diagrams
- Deployment and operations runbook for production infrastructure

### Changed
- Restructured `/docs` directory with clear separation of concerns
- Updated all inline code documentation to match new documentation standards

### Fixed
- Inconsistencies between API documentation and actual route implementations
- Missing endpoint parameter descriptions in several route handlers

---

## [1.1.0] - 2025-05-01

### Added
- Celestial search system: scan and discover celestial bodies across universes
- Celestial takeover mechanics: claim and contest control of unowned star systems
- Celestial marketplace: buy, sell, and trade celestial assets between players
- Expanded universe browser with filtering and sorting capabilities

### Changed
- `GET /api/celestial/search` now paginates results and supports advanced filters
- Celestial ownership records migrated to dedicated table with audit trail

### Fixed
- Race condition in celestial takeover resolution when multiple attackers target the same body
- Marketplace listing expiration edge case causing orphaned transactions

---

## [1.0.0] - 2025-03-20

### Added
- Full production release with 90 interconnected universes
- 9 realm systems with distinct rulesets, resource rates, and PvP settings
- Cross-universe travel and trade infrastructure
- Realm-specific leaderboards and rankings
- Global event system spanning all universes
- New player onboarding flow with tutorial missions
- Performance monitoring and telemetry pipeline

### Changed
- Authentication system migrated to JWT + refresh token architecture
- Database connection pool optimized for multi-universe queries
- API rate limiting now applied per-realm with configurable thresholds

### Fixed
- Memory leak in fleet movement scheduler under high server load
- Universe generation deadlock when creating 90 universes concurrently
- Alliance disband logic not properly cleaning up member states

---

## [0.9.0] - 2025-02-01

### Added
- Event system: time-limited global and realm-specific events
- Season pass framework with 12-week seasons, premium and free tracks
- Achievement system with 150+ achievements across 10 categories
- Player notification center with real-time push updates
- Daily login rewards and streak bonuses
- World boss encounters on a weekly rotation

### Changed
- UI navigation restructured to accommodate event and season hubs
- Achievement progress now tracked server-side with validation

### Fixed
- Event participation rewards not being distributed on event conclusion
- Season pass XP overflow not rolling over correctly

---

## [0.8.0] - 2025-01-01

### Added
- Ground combat system with infantry, armor, and artillery unit types
- Planetary invasion mechanics: orbital bombardment, drop pod deployment, siege warfare
- Planetary defense grid with shields, turrets, and garrison troops
- Ground combat report viewer with casualty breakdown
- Morale and suppression mechanics for ground forces
- Fortification system allowing defensive building upgrades

### Changed
- Colony screen now includes ground troop management tab
- Combat overview aggregates both space and ground phases

### Fixed
- Troop training queue not respecting building level caps
- Defense turret damage calculations not applying research bonuses

---

## [0.7.0] - 2024-11-15

### Added
- Player-driven marketplace with buy and sell order books
- Resource trading between players with immediate and auction modes
- Market price history charts (7d, 30d, all-time)
- Trade routes between allied colonies for reduced tax rates
- Merchant NPCs offering limited-time trade deals
- Economy dashboard with supply/demand analytics

### Changed
- Resource production formulas tuned for market equilibrium
- Transport ship capacity increased by 25% across all classes

### Fixed
- Order book not updating in real-time after trade execution
- Sell orders below market floor price being accepted

---

## [0.6.0] - 2024-10-01

### Added
- Blueprint system: learnable schematics for ships, buildings, and modules
- Crafting system: manufacture items from raw materials and components
- Blueprint rarity tiers: common, uncommon, rare, epic, legendary
- Component dismantling: salvage items back into base materials
- Blueprint trading and marketplace listing support
- Inventory system with categorization, stacking, and filtering

### Changed
- Ship construction now requires both resources and blueprints
- Building upgrades at level 10+ require rare components

### Fixed
- Blueprint drop rates on NPC ships not scaling with difficulty
- Crafting queue persisting phantom entries after completion

---

## [0.5.0] - 2024-08-15

### Added
- Research tree with 900+ technologies across 6 disciplines
- Technology categories: Weapons, Shielding, Drives, Production, Economy, Special
- Research queue supporting up to 5 concurrent projects
- Tech dependencies and prerequisite validation
- Empire-wide research bonuses and specialization paths
- Research lab building chain (levels 1-25)
- Intergalactic Research Network for alliance-wide collaboration

### Changed
- Research data migrated from JSON blobs to normalized relational tables
- Tech unlock notifications now link directly to their tech tree position

### Fixed
- Research progress not saving on server restart
- Prerequisite check failing for multi-parent technologies

---

## [0.4.0] - 2024-07-01

### Added
- Alliance system: create and manage player alliances
- Alliance ranks: Leader, Officer, Member, Recruit with granular permissions
- Alliance diplomacy: non-aggression pacts, trade agreements, war declarations
- Alliance bank: shared resource pool with deposit/withdraw logging
- Alliance chat channel and bulletin board
- Alliance-wide research bonuses and shared projects
- Alliance rankings and score tracking

### Changed
- Player profile now displays alliance affiliation and rank
- Attack confirmation includes alliance war status warnings

### Fixed
- Alliance invite expiration not cleaning up stale records
- Bank withdrawal permissions not checking rank hierarchy correctly

---

## [0.3.0] - 2024-05-15

### Added
- Fleet combat system with simultaneous round-based resolution
- 6 ship classes: Light Fighter, Heavy Fighter, Cruiser, Battleship, Destroyer, Carrier
- Ship statistics: attack, defense, speed, cargo capacity, fuel consumption
- Weapon-Armor matrix with 5 damage types and 5 armor types
- Combat formation system (5 formations with stat modifiers)
- Debris field generation from destroyed ships
- Combat reports with detailed round-by-round breakdown
- ESPionage system: scout enemy fleets and planets
- Rapid fire mechanic between ship classes

### Changed
- Fleet movement is now processed asynchronously with arrival/departure times
- Ship construction times rebalanced for competitive play

### Fixed
- Overflow error in combat damage calculation for very large fleets
- Debris field cleanup job not running on schedule

---

## [0.2.0] - 2024-04-01

### Added
- Universe system supporting multiple independent game universes
- Procedural galaxy generation with configurable size and density parameters
- 9 realm types: Standard, War, Peaceful, Resource-Rich, Research, Pirate, Anarchy, Tournament, Newbie
- Solar system generation: star types, planetary orbits, moon probabilities
- Coordinate system: Galaxy.SolarSystem.Planet (e.g., [1:234:5])
- Universe-specific game speed and rule configurations
- Cross-universe player profiles with per-universe progress

### Changed
- Player state now scoped to a specific universe
- Login flow includes universe selection for multi-universe players

### Fixed
- Galaxy generation producing duplicate coordinate assignments
- Universe config not propagating to new player registrations

---

## [0.1.0] - 2024-02-15

### Added
- Initial project setup with TypeScript, React, and Node.js toolchain
- Basic OGame-style gameplay loop: build, research, attack, repeat
- Resource production system (Metal, Crystal, Deuterium, Energy)
- Building system with robotics factory, shipyard, research lab
- Basic authentication: registration, login, session management
- Single-universe deployment with shared game world
- Player state management with PostgreSQL persistence
- Turn-based game tick system (3-5 turns per minute)
- Minimal UI with resource overview and building panels
- RESTful API structure following Express.js conventions

### Notes
- This is the initial foundation release. Many features are placeholders or minimal implementations intended for iteration in subsequent releases.
- The database schema uses JSONB extensively for rapid prototyping.
- No fleet combat, alliances, or research trees exist at this stage.
