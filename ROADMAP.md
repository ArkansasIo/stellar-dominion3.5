# Development Roadmap

**Project:** Universe Civilization: Empires at War  
**Status:** Active Development — v1.2.0  
**Last Updated:** 2025-06-15

---

## Overview

This roadmap outlines the planned development phases for Universe Civilization: Empires at War. Each phase builds on the previous, incrementally adding depth, content, and polish. Milestones are subject to change based on community feedback and development velocity.

---

## Phase 1: Core Foundation

**Theme:** *Lay the groundwork.*

**Target:** v0.1.0 — v0.1.5

### Features
- [x] Project scaffolding (TypeScript, React 19, Node.js, PostgreSQL)
- [x] OGame-inspired resource production loop (Metal, Crystal, Deuterium, Energy)
- [x] Building system (Robotics Factory, Shipyard, Research Lab)
- [x] Basic authentication (register, login, logout, session management)
- [x] Player state persistence and retrieval
- [x] Turn-based game tick engine (3–5 turns/min)
- [x] Minimal UI shell with resource overview
- [x] RESTful API layer with Express.js

### Milestones
- M1.1: Running dev environment with hot reload
- M1.2: Player can register, log in, and see resource production
- M1.3: Buildings can be constructed and produce resources
- M1.4: Game tick processes all players' resource production

---

## Phase 2: Universes & Galaxy

**Theme:** *A universe to explore.*

**Target:** v0.2.0 — v0.2.5

### Features
- [x] Multi-universe support (90 universes at launch)
- [x] Procedural galaxy generation (stars, planets, moons)
- [x] 9 realm systems with distinct rulesets
- [x] Coordinate system (Galaxy.SolarSystem.Planet)
- [x] Universe-specific configuration (speed, resource rate, PvP settings)
- [x] Cross-universe player profiles
- [x] Celestial body browsing (galaxy view)

### Milestones
- M2.1: Universe generator produces valid, persistent galaxies
- M2.2: Players can select and join different universes
- M2.3: Galaxy view renders solar systems with celestial bodies
- M2.4: Multi-universe deployment operational

---

## Phase 3: Combat

**Theme:** *War in the stars.*

**Target:** v0.3.0 — v0.3.5 (+ v0.8.0 ground combat)

### Features
- [x] Fleet combat with round-based resolution
- [x] 6 ship classes (Light Fighter through Carrier)
- [x] Weapon-Armor matrix (5 damage types × 5 armor types)
- [x] Combat formation system (5 formations)
- [x] Debris field generation and harvesting
- [x] Combat reports with round-by-round detail
- [x] ESPionage system
- [ ] Ground combat (Phase 3 continuation)
- [ ] Planetary invasion mechanics
- [ ] World boss encounters

### Milestones
- M3.1: Two players can engage in combat
- M3.2: Combat reports are generated and viewable
- M3.3: Debris fields appear after battles and can be harvested
- M3.4: Ground combat system operational

---

## Phase 4: Social Systems

**Theme:** *Strength in numbers.*

**Target:** v0.4.0 — v0.4.5

### Features
- [x] Alliance creation and management
- [x] Alliance rank system (Leader, Officer, Member, Recruit)
- [x] Alliance diplomacy (NAP, trade agreements, war)
- [x] Alliance bank with deposit/withdraw logs
- [x] Alliance chat and bulletin board
- [x] Alliance-wide research projects
- [x] Player-to-player messaging
- [ ] Alliance raids and cooperative attacks
- [ ] Shared alliance territory

### Milestones
- M4.1: Players can create and join alliances
- M4.2: Alliances can declare war and manage diplomacy
- M4.3: Alliance bank operational with full audit trail
- M4.4: Cross-alliance communication and coordination tools

---

## Phase 5: Systems Depth

**Theme:** *Mastery through knowledge.*

**Target:** v0.5.0 — v0.6.5

### Features
- [x] Research tree (900+ technologies, 6 disciplines)
- [x] Research queue with prerequisite validation
- [x] Empire-wide and specialization bonuses
- [x] Research lab building chain (levels 1–25)
- [x] Intergalactic Research Network
- [x] Blueprint system with rarity tiers
- [x] Crafting system from raw materials
- [ ] Item dismantling and salvage
- [ ] Officer/commander system with talent trees
- [ ] ESPionage depth: counter-intelligence, codebreaking

### Milestones
- M5.1: Research tree is populated and browsable
- M5.2: Players can queue and complete research
- M5.3: Blueprints drop from NPCs and events
- M5.4: Crafting system produces usable items

---

## Phase 6: Content & Events

**Theme:** *A living galaxy.*

**Target:** v0.7.0 — v0.9.0

### Features
- [x] Marketplace with buy/sell order books
- [x] Resource trading and trade routes
- [x] NPC merchants and limited-time deals
- [x] Global and realm-specific events
- [x] Season pass framework (12-week seasons)
- [x] Achievement system (150+ achievements)
- [x] Daily login rewards and streaks
- [x] World boss encounters
- [ ] Mission and campaign system
- [ ] Story-driven narrative arcs
- [ ] Player-generated content (tournaments, competitions)

### Milestones
- M6.1: Marketplace operational with player trading
- M6.2: First global event runs successfully
- M6.3: Season 1 launches with full track
- M6.4: Achievement system tracks and rewards player milestones

---

## Phase 7: Polish & Performance

**Theme:** *Smooth is fast.*

**Target:** v1.0.0 release candidate

### Features
- [ ] UI/UX overhaul with consistent design system
- [ ] Mobile-responsive layout
- [ ] Performance optimization (query tuning, caching, CDN)
- [ ] Balance pass across all systems (economy, combat, research)
- [ ] Accessibility audit and improvements
- [ ] Onboarding flow for new players
- [ ] Tutorial missions
- [ ] Error handling and user feedback improvements
- [ ] Localization/i18n framework

### Milestones
- M7.1: Lighthouse scores ≥ 90 on all pages
- M7.2: P95 API response times < 200ms
- M7.3: Full balance spreadsheet reviewed and applied
- M7.4: New player can reach mid-game without external guidance

---

## Phase 8: Launch & Live Operations

**Theme:** *To the stars.*

**Target:** v1.0.0 — v1.x.x

### Features
- [ ] Closed beta with limited player access
- [ ] Open beta with progression wipe
- [ ] Full release (90 universes, 9 realms)
- [ ] Monitoring and alerting infrastructure
- [ ] Player support ticketing system
- [ ] Anti-cheat and fair-play systems
- [ ] Live operations runbook
- [ ] Community management tools
- [ ] Content update pipeline (events, seasons, balance patches)
- [ ] Celestial search, takeover, and marketplace (v1.1)
- [ ] Full GDD and UML documentation suite (v1.2)

### Milestones
- M8.1: Closed beta with 500 active players
- M8.2: Open beta stress test with 5000 concurrent players
- M8.3: v1.0 production launch
- M8.4: First content patch post-launch
- M8.5: Post-launch documentation and quality-of-life updates

---

## Future Considerations (Post-Launch)

These features are under exploration for post-launch updates and expansions:

- **Mobile App:** Native iOS/Android client
- **Player Stations:** Buildable space stations with trade and defense functionality
- **Fleet Carriers:** Mobile command ships that deploy fighter wings
- **Galaxy Map:** Interactive 3D galaxy visualization
- **Clan Wars:** Structured alliance vs. alliance competitive seasons
- **Modding Support:** Player-created content and custom scenarios
- **E-Sports Integration:** Tournament mode with spectator capabilities
- **Cross-Server Play:** Universe bridging and migration

---

## Timeline

| Phase | Version(s) | Estimated Window | Status |
|-------|-----------|-----------------|--------|
| 1. Core Foundation | v0.1.x | Q1 2024 | ✅ Complete |
| 2. Universes & Galaxy | v0.2.x | Q2 2024 | ✅ Complete |
| 3. Combat | v0.3.x, v0.8.x | Q2 2024 – Q1 2025 | ✅ Complete |
| 4. Social Systems | v0.4.x | Q3 2024 | ✅ Complete |
| 5. Systems Depth | v0.5.x – v0.6.x | Q3–Q4 2024 | ✅ Complete |
| 6. Content & Events | v0.7.x – v0.9.x | Q4 2024 – Q1 2025 | ✅ Complete |
| 7. Polish & Performance | v1.0.0-rc | Q1 2025 | 🔄 In Progress |
| 8. Launch & Live Ops | v1.0.0+ | Q1–Q2 2025 | 🔄 In Progress |

---

*This roadmap is a living document and will be updated as development progresses. Priorities may shift based on player feedback, technical constraints, and strategic opportunities.*
