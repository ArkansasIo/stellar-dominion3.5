# Universe Empire Dominion — Development Log

**Project:** Stellar Dominion / Universe Empire Dominion  
**Current package version:** Alpha 1.5.0  
**Log reconstructed:** June 18, 2026  
**Primary stack:** React 19, TypeScript, Vite, Express, PostgreSQL, Drizzle ORM  
**Legacy foundations:** Universe Empires / Xenobe Rage, OGameX-derived systems and assets  

---

## Purpose

This is the consolidated development record for the game. It was reconstructed from the current source tree, Git history, Markdown documentation, UML design documents, staged implementation notes, build scripts, tests, and the active worktree.

The repository contains several snapshots and imported foundations. Unless a section says otherwise, the current implementation is the top-level application built from:

- `client/src/` — current React game client
- `server/` — current Express API and game services
- `shared/` — shared schema, types, and game configuration
- `script/` — build, administration, seed, and smoke-test tools
- `migrations/` and `sql/` — database schema and setup material
- `docs/` — current subsystem notes and historical implementation records

Large directories such as `stellar-dominion/`, `stellar-dominion3/`, `game-source/`, and `xenoberage/` are retained as snapshots, migration sources, legacy references, or imported foundations. They should not automatically be treated as the canonical runtime.

---

## Project Vision

Universe Empire Dominion is a browser-first 4X space-strategy MMORPG combining:

- empire, colony, government, and civilization management
- persistent resources, construction, research, and technology trees
- fleets, ship fitting, orbital defense, ground armies, and combat
- exploration, galaxies, anomalies, wormholes, and interstellar travel
- alliances, diplomacy, social systems, raids, markets, and trade
- commander progression, ranks, rarity tiers, achievements, and artifacts
- a modern React interface over TypeScript services and PostgreSQL persistence
- selected mechanics, data, and lessons migrated from older PHP and OGameX code

The documented core loop remains:

1. Plan research, construction, fleets, and expansion.
2. Execute actions through timed or turn-based systems.
3. Resolve production, travel, combat, events, and missions.
4. Adapt the empire and progress into larger strategic systems.

---

## Development Timeline

### Foundation period — staged game construction

The `docs/STAGE-1.md` through `docs/STAGE-10.md` records describe the first complete implementation sequence.

#### Stage 1 — Project scaffold and configuration

- Established the project layout and configuration.
- Created the base client/server development structure.
- Prepared the codebase for shared game models and modular systems.

#### Stage 2 — Core data models and types

- Added shared domain types for players, planets, ships, resources, and game state.
- Established model boundaries used by later UI, API, and simulation code.

#### Stage 3 — Player management

- Added player identity and management flows.
- Established the base for account state, progression, and administration.

#### Stage 4 — Universe, sectors, and planets

- Added universe and system generation concepts.
- Introduced sectors, planets, colonies, coordinates, and world-state management.

#### Stage 5 — Ships and shipyard

- Added ship definitions and ship-management workflows.
- Created shipyard and construction concepts used by fleets and combat.

#### Stage 6 — Combat

- Added combat resolution and combat-facing UI.
- Established fleets, damage, defenses, reports, and battle outcomes.

#### Stage 7 — Research and technology

- Added research progression and technology prerequisites.
- Established the technology tree as a major empire-progression track.

#### Stage 8 — Economy and market

- Added resource management, production, exchange, and market concepts.
- Connected economic progression to construction, research, and military growth.

#### Stage 9 — Administration

- Added administrative tools and dashboards.
- Introduced account, universe, server, and diagnostic control surfaces.

#### Stage 10 — Game loop, AI, and events

- Added the game-loop structure that coordinates timed systems.
- Introduced AI/event processing and recurring world updates.
- Completed the original ten-stage framework.

---

### December 2, 2024 — documented beta architecture

The architecture and game-design documents identify this phase as version `0.8.2-beta`.

Major documented systems included:

- React client with page, component, hook, and React Query layers
- Express REST API with middleware and storage boundaries
- PostgreSQL persistence through Drizzle ORM
- configurable game turns, production, construction, fleet movement, and research
- procedural galaxy and planet content
- expeditions, diplomacy, trade, and strategic combat
- 4X progression influenced by Stellaris, Civilization, Master of Orion, EVE Online, and OGame

This documentation is historically useful, but some counts, paths, and implementation claims have since been superseded by the Alpha 1.5.0 codebase.

---

### June 15, 2026 — repository consolidation and delivery tooling

Git history records a major consolidation day:

- Added comprehensive API implementation for server and client.
- Added executable server/client builds and launcher scripts.
- Added launcher error handling and troubleshooting documentation.
- Added the complete UML architecture and design reference.
- Added a comprehensive repository map, feature references, and documentation links.
- Renamed Xenobe Rage / Blacknova Traders references to Universe Empires across project documentation.

Delivery and operations work from this period includes:

- development and production start scripts
- Windows, Linux, macOS, and Raspberry Pi executable targets
- Electron desktop build targets
- Docker, Railway, Render, Fly.io, Vercel, and nginx configuration
- PostgreSQL setup and Drizzle migration commands
- administrative account and command-line tooling
- updater and launcher documentation

---

### June 17, 2026 — progression and presentation expansion

Commit `a3b1f1a` added or stabilized:

- S, SS, and SSS rank progression
- 12 star levels
- 9 rarity tiers
- 9 visual themes
- related TypeScript corrections

This expanded the game’s progression language beyond the earlier level, tier, prestige, and commander systems.

---

### June 18, 2026 — infrastructure fixes and strategic-system expansion

Completed commits:

- Added the interplanetary power-grid system and server-status improvements.
- Fixed the database status query using an invalid `schema_name` column.
- Prevented an account-setup runtime failure when selected race data is unavailable.

Active worktree development:

- interplanetary power simulation and UI integration
- orbital-defense simulation, page, route registration, documentation, and smoke test
- raid-operation service work across raid bosses, raid finder, and raid pages
- commander and universe page updates
- authentication, account setup, layout, and game-context adjustments
- server route expansion and missing-route integration
- build-script and package-script updates

The active work is not yet one clean committed milestone. Files currently include both staged and unstaged modifications, so this section should be updated after the systems are verified and committed.

---

## Current Architecture

### Client

The current client contains approximately 250 authored files under `client/src/`.

Major interface families include:

- account setup, authentication, settings, privacy, and terms
- empire overview, command center, progression, and planet management
- galaxy, universe, exploration, navigation, expeditions, and celestial browsing
- fleet, shipyard, ship fitting, army, ground combat, and orbital defense
- research lab, technology tree, skills, blueprints, artifacts, and relics
- resources, facilities, market, merchants, and power grid
- government, factions, alliances, guilds, forums, friends, and messages
- raids, raid bosses, raid finder, battle logs, and combat reports
- admin, diagnostics, database administration, and server console
- 3D scene/viewer entry points and imported game-asset galleries

Shared game state is coordinated through React context, hooks, API clients, and query caching. The interface also contains a reusable component library and a centralized visual theme system.

### Server

The current server contains approximately 140 authored files.

Its responsibilities include:

- authentication and account state
- REST route registration and validation
- storage and database access
- game-loop and turn processing
- combat and fleet operations
- research, achievements, labs, and multiplayer bonuses
- colonies, galaxies, realms, and exploration
- alliances, social systems, markets, and administration
- server health, diagnostics, and operational controls
- raid operations and newer strategic simulations

The server is still partly transitional: mature database-backed systems coexist with routes and services that are being moved away from mock or placeholder behavior.

### Shared domain layer

The `shared/` directory contains approximately 136 authored files and serves as the common contract between client and server.

It includes:

- Drizzle schema and database types
- game constants and configuration catalogs
- technologies, units, ships, buildings, planets, and progression
- commander, government, faction, alliance, rarity, rank, and reward systems
- OGameX compatibility and imported data bridges

### Data and persistence

The primary database is PostgreSQL with Drizzle ORM.

The repository includes:

- schema definitions and migrations
- SQL setup/reference files
- seed scripts
- database status and administrative tools
- Docker-based local database configuration

Persistence is established for many core systems, but the source audit still identifies specific services that use partial, placeholder, or mock storage.

### Additional runtimes and reference implementations

- `backend/` contains a small Python service/configuration layer.
- `java/` contains a 3D-oriented Java prototype.
- `threejs_galaxy_viewer_project/` contains a standalone Three.js galaxy-viewer project.
- `game-source/` contains a large imported OGameX-oriented PHP/TypeScript/Rust source tree and rewrite material.
- `xenoberage/` contains the legacy PHP Universe Empires foundation.

These are valuable migration and design sources, but their presence creates duplicate implementations that need explicit ownership boundaries.

---

## Implemented Gameplay Systems

Based on source files, subsystem documentation, and completed source-audit items, the project has implementation coverage for:

- player accounts, race selection, authentication, and administration
- empire state, colonies, planets, facilities, and resource production
- canonical server-generated galaxy data and system navigation
- fleets, missions, colonization, scans, attacks, and travel
- shipyards, ship catalogs, construction queues, and ship fitting
- 90+ documented ship modules across weapons, defense, propulsion, electronic warfare, engineering, and rigs
- combat resolution, combat reports, and persisted battle history
- research, technology trees, research labs, achievements, and progression
- armies, troop equipment, and deployment
- alliances, diplomacy actions, alliance chat, friends, guilds, and social pages
- market exchange and broader economy interfaces
- anomalies, exploration actions, gates, and celestial browsing
- artifacts, relics, blueprints, commanders, ranks, rarity, and achievements
- mining-operation persistence
- raid-facing UI, with current backend service expansion underway
- interplanetary power-grid simulation
- orbital-defense system implementation in the active worktree
- diagnostics, server health, database administration, and admin tools
- desktop, standalone executable, container, and hosted deployment paths

“Implementation coverage” means meaningful source and/or API behavior exists. It does not guarantee that every page is balanced, fully persisted, multiplayer-safe, or production-ready.

---

## Verification and Test Tooling

The package currently exposes:

- `npm run check` — TypeScript validation
- `npm run build` — production application build
- `npm run smoke:raid-operations` — raid operations smoke test
- `npm run smoke:power-grid` — interplanetary power-grid smoke test
- `npm run smoke:orbital-defense` — orbital-defense smoke test
- `npm run smoke:all` — combined strategic-system smoke suite
- `npm run smoke:life-support` — life-support smoke test
- database generation, push, and seed commands

The repository also contains backend tests, research test summaries, framework validation documents, and imported upstream test infrastructure.

Test documentation should be treated as evidence for the revision it describes, not as proof that the current uncommitted worktree passes. A release log entry should record the exact commands and results after each milestone.

---

## Known Gaps and Technical Debt

The current source audit in `docs/MissingSystemsTodo.md` leaves these major items open:

### Research trading

Replace remaining mocks with database-backed flows for:

- listings and listing details
- status changes, cancellation, settlement, and history
- ratings and reputation
- disputes and player blocking
- bulk acceptance and eligibility checks
- recommendations

### Game-asset management

Replace service stubs with production storage behavior for:

- asset and bundle CRUD
- manifest generation and versioning
- CDN synchronization
- integrity validation
- cache control
- rollback
- statistics and reporting

### Server status metrics

- Replace placeholder database-connection metrics with live pool/database measurements.

### Cross-cutting debt

- Define one canonical application tree and archive or clearly label snapshots.
- Reduce duplicated documentation between root, `docs/md-documents/`, and nested project copies.
- Repair stale absolute links that still point to previous local drives or folder names.
- Normalize Markdown character encoding where emoji and box-drawing characters are mojibake.
- Reconcile old version labels such as `0.8.2-beta` with package version `1.5.0`.
- Audit secrets and local credential files before any public release.
- Confirm which Python, Java, Three.js, PHP, and Rust components remain shipping targets.
- Continue replacing UI-only success states with authoritative server transactions.
- Add repeatable end-to-end tests for the full plan → execute → resolve → persist game loop.

---

## UML and Design Record

The main UML references are:

- `STELLAR_DOMINION_UML_DESIGN.md` — complete modern and legacy architecture reference
- `docs/md-documents/UML.md` — canonical documentation-set UML
- `xenoberage/XENOBE_RAGE_UML_DESIGN.md` — legacy PHP architecture
- `docs/Xenoberage-ERD.md` — legacy/integration data model
- `docs/Xenoberage-API-Design.md` — API migration design
- `docs/Xenoberage-Integration-Plan.md` — integration sequence

Together they describe:

- the modern five-layer game framework
- the legacy four-layer PHP framework
- client, API, service, storage, and database boundaries
- game-loop, turn, combat, economy, research, fleet, colony, and market flows
- authentication and deployment
- database relationships and legacy migration paths

The UML is broad and useful as an architecture atlas. Source code remains authoritative where diagrams and implementation differ.

---

## Repository Health Snapshot — June 18, 2026

### Strong areas

- unusually broad game-system coverage
- extensive shared configuration and content catalogs
- clear client/server/shared separation in the modern application
- substantial architecture, API, deployment, and subsystem documentation
- active smoke-test expansion for newly added strategic systems
- retained legacy sources for migration and provenance
- multiple packaging and deployment options

### Risk areas

- duplicated project snapshots make ownership and release scope ambiguous
- some documentation is stale, duplicated, or encoding-damaged
- active changes span authentication, global game state, routes, and major gameplay systems at once
- several backend services still contain mocks or placeholders
- generated/imported code dramatically increases audit and maintenance surface
- release confidence depends on completing type-check, build, smoke, database, and browser-flow verification

---

## Recommended Next Milestone

### Alpha 1.5.1 — Strategic Infrastructure Stabilization

1. Finish and commit the power-grid, orbital-defense, and raid-operation work as separately reviewable units.
2. Run TypeScript validation, production build, and all smoke tests.
3. Exercise authentication, account setup, universe, raids, power grid, and orbital defense in the browser.
4. Verify new routes against a real PostgreSQL database.
5. Update API and UML references for the new services.
6. Replace placeholder database pool metrics.
7. Move the remaining research-trading mocks behind database-backed transactions.
8. Mark snapshot/reference directories explicitly and publish one canonical source map.

### Suggested release gate

A milestone should be called complete only when:

- source changes are committed with a focused message
- type checking and production build pass
- relevant smoke and integration tests pass
- database migrations are reproducible
- critical UI flows are manually or automatically verified
- the API map and this development log are updated
- unresolved mocks or known failures are recorded

---

## Ongoing Entry Template

Use this format for future work:

```md
## YYYY-MM-DD — Milestone name

### Added
- New player-facing behavior.

### Changed
- Existing behavior or architecture updated.

### Fixed
- Defect and its user-visible effect.

### Verification
- `npm run check` — pass/fail
- `npm run build` — pass/fail
- relevant smoke tests — pass/fail
- browser/database verification — result

### Known follow-ups
- Remaining limitation, migration, balance issue, or technical debt.
```

---

## Source Notes

This log synthesizes the repository rather than duplicating every file name. Its primary evidence includes:

- Git history through June 18, 2026
- the active Git worktree
- `README.md`, `GAME_DESIGN.md`, `GDD.md`, and `ARCHITECTURE.md`
- `STELLAR_DOMINION_UML_DESIGN.md`
- `IMPLEMENTATION_SUMMARY.md` and `API_IMPLEMENTATION_SUMMARY.md`
- `SERVER_STATUS_REPORT.md` and `SHIP_FITTING_SYSTEM.md`
- `docs/STAGE-1.md` through `docs/STAGE-10.md`
- `docs/MissingSystemsTodo.md`
- research, power-grid, orbital-defense, Xenobe integration, API, build, and deployment documentation
- package scripts and current client/server/shared source layout

Update this document whenever a gameplay milestone, architecture boundary, release status, or major known gap changes.
