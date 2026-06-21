# Stellar Dominion - Complete Enhanced Edition PRD

## Project Overview
**Name:** Stellar Dominion (universe-empire-dominion3)
**Version:** 2.0.0
**Date:** June 19, 2026

---

## UNIVERSE SYSTEM

### Configuration
- **9 Universes** with unique characteristics
- **30 Galaxies** per universe
- **999 Systems** per galaxy
- **15 Positions** per system
- **Max Players:** 999,999 per universe

### Universes
| # | Name | Speed | Economy | Fleet | Special |
|---|------|-------|---------|-------|---------|
| 1 | Alpha Centauri | 1x | 1x | 1x | Original |
| 2 | Orion Nebula | 2x | 2x | 2x | Fast-paced |
| 3 | Andromeda | 1.5x | 1.5x | 1.5x | Balanced |
| 4 | Triangulum | 1x | 0.8x | 2.5x | Combat |
| 5 | Sagittarius | 1x | 3x | 1x | Economy |
| 6 | Cygnus | 1.5x | 1.5x | 3x | Exploration |
| 7 | Perseus | 3x | 3x | 2x | New Player |
| 8 | Draco | 1x | 0.5x | 1x | Hardcore |
| 9 | Phoenix | 2x | 2x | 2x | Latest |

### Universe Generation
- 3 presets: starter (1 galaxy, 200 systems), standard (3 galaxies, 7500 systems), vast (10 galaxies, 200K systems)
- Seeded RNG for deterministic generation
- 7 star classes (O through M) with frequency distribution
- Planet types: terrestrial, super_earth, gas_giant, ice_giant, desert
- Hazards: radiation, asteroid_field, cosmic_storm, ion_storm

---

## RESOURCE SYSTEM

### Resources (7 types)
| Resource | Base Production | Scaling |
|----------|----------------|---------|
| Metal | 30 \* level \* (1 + level/10) | divisor 10 |
| Crystal | 20 \* level \* (1 + level/10) | divisor 10 |
| Deuterium | 10 \* level \* (1 + level/12) | divisor 12 |
| Energy | 20 + energyTech \* 5 | per tech level |
| Credits | Variable | from production |
| Food | Variable | from colonist production |
| Water | Variable | from life support |

### Building Types (7)
- metalMine, crystalMine, deuteriumSynthesizer, solarPlant, roboticsFactory, shipyard, auxiliary
- Cost scaling: baseCost \* 1.15^level
- Build time: ceil(totalCost / (2500 \* (1 + roboticsLevel))) seconds

### Economy Resources (4)
- ore, organics, goods, energy
- Dynamic port pricing: price = basePrice + delta \* (supply - demand) / (supply + demand)

---

## COMBAT SYSTEM

### Core Combat Engine
- 10 unit types with attack/defense/health/speed
- Research bonuses: weaponsTech +5%/lvl, shieldingTech +5%/lvl, armourTech +3%/lvl
- Critical hit: 5% base, 1.5x multiplier
- Max 100 rounds, attacker wins by default
- Damage: max(1, attack - defense\*0.5) \* variance \* crit
- Casualties: ceil(totalDamage / 100)
- Plunder: 30% of defender resources

### Client Combat Engines
| Engine | Focus |
|--------|-------|
| combatEngine.ts | Ship-to-ship with weapon-armor matrix |
| gameLogic.ts | OGame-style fleet combat |
| combatSystem.ts | Commander-influenced PvP |

### Combat Config
- 4 modes: Solo PvE, Group PvE, Solo PvP, Group PvP
- 7 formations: balanced, aggressive, defensive, flanking, pincer, circle, wedge
- 5 PvE difficulties: easy (0.7x HP) to nightmare (4x HP, 10x loot)
- 7 PvP ranks: Recruit (0-1000) to Mythic (10000+)

### Fleet Command
- 8 formations: line, arrow, sphere, spread, clamp, wall, delta, vanguard
- 8 commands: Focus Fire, Evasive Maneuvers, Emergency Repairs, Overcharge, Shield Wall, Blitz Attack, Fortress Mode, Doomsday Protocol
- 8 defense platforms

### Army System
- 15 ship types, tiers 1-99, max level 999
- 18 army categories, 32 sub-categories
- 20 unit templates, 30 ship blueprints
- 15 army subsystems (ground/armor/mech/support/air)
- 9 tier classes for building structures
- 18 job categories, 32 sub-categories
- 6 research categories

---

## STARSHIP SYSTEM

### 20+ Unit Types
| Class | Units | Cost Range |
|-------|-------|-----------|
| Fighter | Viper, Cobra, Wraith | 3K-50K metal |
| Capital | Hammerhead, Leviathan, Reaper, Obliterator, Devastator | 100K-5M |
| Super | Mothership, Planet Killer | 5M-12M |
| Titan | Avatar, Erebus, Ragnarok | 12M-40M |
| Civilian | Hermes, Hercules, Exodus, Scavenger, Seeker Drone | 5K-500K |
| Troop | Space Marine, Exo-Trooper, Colonist | 10K-100K |
| Vehicle | Hover Tank, Titan Mech | 50K-1M |

### Ship Fitting (90+ modules)
- 5 slot types: high, mid, low, rig, subsystem
- 6 module categories: weapons, defense, propulsion, electronic, engineering, utility
- Tech I through Tech III, meta levels 0-14
- CPU, powergrid, capacitor management

---

## COMMANDER SYSTEM

### Core
- 8 races, 6 classes, 10 subclasses
- 12 equipment slots
- 42 commander archetypes
- 180+ equipment templates
- Star/S-rank progression (S=10x, SS=100x, SSS=1000x)

### Gacha System
- 5 rarities: Common 40%, Uncommon 35%, Rare 18%, Epic 5.5%, Legendary 1.5%
- Soft pity at pull 70, hard pity at 90
- 10 banner types

### Skill Tree
- 12 skill classes (warrior, mage, ranger, rogue, summoner, engineer, paladin, necromancer, elementalist, shadow, berserker, guardian)
- PoE2-inspired skill gem + support gem system
- 32+ skill gems, 15 support gems

### Talent Tree
- Level 1-999 progression, tier 1-99 nodes
- 6 classes \* 3 sub-classes = 18 sub-trees
- 314 total talent nodes
- Rarities: normal, notable, keystone, ascendancy

### Mastery
- 10 mastery tiers (Initiate to Mythic)
- 20 stat keys, 4 domains
- 18 commander mastery classes

### Vault & Bank
- 5-8 currencies, 10 resources
- 50-75 upgradeable slots
- Bank with interest, insurance, currency exchange

---

## GOVERNMENT SYSTEM

### Government Types (10)
Democracy, Monarchy, Technocracy, Junta, Corporate, Theocracy, Anarchy, Oligarchy, Federation, Dictatorship

### Government Progression
- 3 pillars × 5 nodes × 5 ranks = 75 total nodes
- Stability, Law, Economic pillars
- Node costs scale by 1.1x per rank
- Unlock time scales by 1.08x per rank

### Government Buildings
- 18 building categories, 32 sub-categories
- 23 government leader types

### Pressure Model
- 8 governance systems, 8 mechanics
- 5 output pressures: legitimacy, control, growth, innovation, bureaucracy
- 10 regime profiles

---

## RESEARCH SYSTEM

### Technology Tree
- 11 branches: armor, shields, weapons, propulsion, sensors, power, computing, engineering, resources, medical, hyperspace
- 7 tech classes, 6 tech types
- Tier 1-99, Level 1-999
- 900+ technologies planned

### Scaling
- Level: 1.15^(level-1)
- Tier: 1.25^(tier-1)
- Research cost: 100 \* level \* tier \* (1.2^level) \* (1.3^tier)
- Research time: ceil(5 \* level \* tier) turns

### 90-Skill System
- EVE-Online-inspired training
- 10 categories, training time: baseTime \* rank \* 2^(level-1) / attributeModifier

---

## ORBITAL SYSTEMS

### Orbital Stations
- Class multipliers: common 1.0x to transcendent 5.0x
- Module slots at levels 1/10/25/50/100
- Max 20 stations per player

### Orbital Defense
- 7 platform classes, 15+ modules, 8 abilities
- 15 technologies (tier 1-5 prerequisite tree)
- 5 threat profiles, 5 doctrines, 5 orbit zones

### Megastructures
- Classes: production/research/defense/mobility/exotic/superweapon
- Exponential cost scaling for level/tier upgrades

---

## SOCIAL SYSTEMS

### Alliances
- 1-50 members, creation cost: 100K metal / 50K crystal / 10K deuterium
- 3 upgrades, 3 research tracks, 3 technologies
- Shared resources and bonuses

### Raids
- 6-player teams, 90 boss types
- Role-based combat: tank/dps/healer/support
- Commander power calculation

### Social Features
- Friends list, Messages, Forums (basic implementations)
- Guilds with roles and treasury

---

## PROGRESSION SYSTEMS

### Empire Progression
- 21 tiers (Novice to Absolute)
- 999 empire levels
- Prestige system

### Kardashev Scale
- 18 levels from "Planetary Settler" to "Supreme Omnipotent"
- Bonuses: 0% to +2000% production, +3000% fleet power
- Unlocks: Dyson Spheres, Ring Worlds, Death Stars

### Achievements
- 130 achievements across 5 categories
- 10 quests with multi-objective chains
- 7 tiers: bronze=100 to diamond=2000 points

### Story Mode
- 12 Acts of campaign story
- 7 element types with weakness chart
- Chapter progression with NPCs and rewards

### Live Ops
- Battle Pass, Season Pass, Storefront
- Time-limited events

---

## ADVANCED SYSTEMS

### Espionage
- 4 mission types: scan (50 deut), espionage (150 deut), sabotage (300 deut + 500 gold), steal_research (400 deut + 1000 gold)
- Success: 0.4 + spyLevel\*0.02 - targetDefense\*0.01
- Sabotage reduces building by 15%, research steal takes 10%

### Expeditions
- Fleet-based expedition system
- Success: 0.3 + (fleetPower/difficulty)\*0.4, capped 95%
- 3 outcomes: success/partial/failure

### Spore Drive
- FTL jump drive system
- Jump success: (stability/100) \* (safetyRating/100)
- 7 rarity tiers, mycelial network

### Life Support
- Food/water production vs consumption
- Oxygen levels, population happiness
- Worker assignment to subsystems

### Ranking System
- Elo-style rating: expectedScore = 1/(1+10^(ratingDiff/400))
- Composite scoring with weighted components

---

## DATABASE

72 PostgreSQL tables via Drizzle ORM:
- User accounts, sessions, player states
- Troops, squads, missions, battles
- Alliances, guilds, teams, raids
- Market orders, auctions, trades
- Research areas, technologies, progress
- Expeditions, encounters
- Colonies, starbases, moon bases
- Megastructures, achievements
- Items, currency, banking
- Universe events, bosses
- Story campaigns, missions

---

## TECH STACK

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Query, Tailwind |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Basic Auth, Replit OIDC |
| Shared | TypeScript configs, Zod schemas |
| Build | Vite, Electron |
| Deploy | Docker, Railway, Render, Vercel, Firebase |

---

## TESTING

- Backend: 94.7% pass rate
- All 90 starships: ✅
- All 10 motherships: ✅
- 9 universes × 30 galaxies: ✅
- Commander system: ✅
- Government system: ✅
- Population system: ✅
- Scanner system: ✅

---

## NEXT ACTIONS

1. Full espionage system implementation
2. Forums thread management and moderation
3. Real-time messaging
4. Friend recommendations and online status
5. Realm-specific game logic
6. Full 3D viewer integration
7. Training center mechanics
8. Universe event trigger system
9. Enhanced scanner visualization
10. Commander management UI enhancements

---

## FUTURE ENHANCEMENTS

- Real-time WebSocket updates
- Mothership construction UI
- Alliance war system
- Seasonal events
- Achievement system enhancements
- NPC faction diplomacy
- Planetary siege mechanics
- Deep space exploration
