# Game Design Document (GDD): Xenoberage

## 1. Overview

**Title:** Xenoberage (Universe Empire Dominion)
**Genre:** Browser-based MMO, 4X Space Strategy
**Platform:** Web (Node.js/Express backend, React/TypeScript frontend)
**Database:** PostgreSQL via Drizzle ORM

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG`
> **Source:** `shared/schema.ts` - Database schema
> **Source:** `client/src/lib/gameLogic.ts` - Core game logic

---

## 2. Core Gameplay Loop

Players manage a space empire: build structures, research technologies, construct fleets, colonize planets, engage in PvP/PvE combat, and ascend through the Kardashev scale. The game is turn-based with turns regenerating over time (6 per minute, max 1000).

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.turns`

---

## 3. Resources

Four primary resources drive the economy:

| Resource | Base Rate/s | Usage |
|----------|-------------|-------|
| Metal | 0.1 | Buildings, ships, structures |
| Crystal | 0.5 | Buildings, ships, research |
| Deuterium | 0.02 | Ships, FTL travel, advanced tech |
| Energy | 0.15 | Powering buildings and fleets |

New players start with 1000 metal, 500 crystal, 0 deuterium, 0 energy.

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.resources`, `GAME_CONFIG.gameplay.newPlayerStartingResources`

---

## 4. Buildings

Buildings are constructed on planets and provide production, research, or military capabilities.

| Building | Metal | Crystal | Deuterium | Time (s) |
|----------|-------|---------|-----------|----------|
| Metal Mine | 60 | 15 | 5 | 30 |
| Crystal Mine | 48 | 24 | 10 | 30 |
| Deuterium Synthesizer | 225 | 75 | 30 | 30 |
| Solar Plant | 75 | 30 | 0 | 30 |
| Robotics Factory | 400 | 120 | 200 | 120 |
| Shipyard | 400 | 200 | 100 | 120 |
| Research Lab | 200 | 400 | 200 | 120 |

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.buildings`

---

## 5. Ships & Units

| Ship | Metal | Crystal | Deuterium | Build Time (s) |
|------|-------|---------|-----------|-----------------|
| Light Fighter | 3,000 | 1,000 | 400 | 10 |
| Heavy Fighter | 6,000 | 4,000 | 1,000 | 30 |
| Cruiser | 20,000 | 7,000 | 2,000 | 60 |
| Battleship | 45,000 | 15,000 | 4,000 | 120 |
| Small Cargo | 2,000 | 2,000 | 500 | 15 |
| Large Cargo | 6,000 | 6,000 | 1,000 | 30 |
| Colony Ship | 10,000 | 20,000 | 1,000 | 45 |

Each ship has stats: attack, hull, shield, and cargo capacity. Ships are defined in the client unit data module.

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.units`
> **Source:** `client/src/lib/unitData.ts` - Ship stats

---

## 6. Technology Tree

The tech tree contains **900+ technologies** across **11 branches**:

1. **Armor** (90 techs) - Plating systems: Light, Medium, Heavy, Military
2. **Shields** (90 techs) - Kinetic, Thermal, Radiative, Combat shields
3. **Weapons** (100 techs) - Ballistic, Energy, Missile, Plasma weapons
4. **Propulsion** (80 techs) - Ion drives, FTL engines, Warp drives
5. **Sensors** (70 techs) - Radar, Scanners, Detection systems
6. **Power** (70 techs) - Fusion reactors, Solar arrays, Antimatter
7. **Computing** (60 techs) - AI systems, Navigation, Hacking
8. **Engineering** (60 techs) - Automation, Construction, Fabrication
9. **Resources** (60 techs) - Mining, Refining, Processing
10. **Medical** (60 techs) - Healing, Life support, Augmentation
11. **Hyperspace** (60 techs) - FTL, Wormholes, Teleportation

### Tech Classes
- `basic` -> `standard` -> `advanced` -> `military` -> `experimental` -> `ancient` -> `exotic`

### Scaling
- Level scaling: `1.15^(level-1)`
- Tier scaling: `1.25^(tier-1)`
- Research cost: `100 * level * tier * (1.2^level) * (1.3^tier)`

> **Source:** `shared/config/technologyTreeConfig.ts` - Full tech tree
> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.technology`

---

## 7. Planet Types

**50+ unique planet types** across 4 families:

### Terrestrial (12 types)
Earth-Like, Desert, Ice, Jungle, Ocean, Rocky Barren, Volcanic, Swamp, Mountain, Storm, Cavern, Poison

### Gas Giants (5 types)
Jupiter-Class, Saturn-Class, Neptune-Class, Brown Dwarf, Storm Giant

### Small Bodies & Moons (6 types)
Small Asteroid, Large Asteroid, Terrestrial Moon, Icy Moon, Volcanic Moon, Active Comet

### Exotic (3 types)
Ring World, Dyson Sphere, Neutron Star System

### Planet Classification
- **Ideal**: habitability 100%, max colonies 5
- **Marginal**: habitability 25-70%, 1-3 colonies
- **Hostile**: habitability 15-20%, 1 colony
- **Uninhabitable**: habitability 0-5%, 1 colony (mining/research only)
- **Legendary**: habitability 90-100%, 100+ colonies

> **Source:** `shared/config/planetTypesConfig.ts` - Full planet type system

---

## 8. Universe Generation

Procedural universe with hierarchical structure:
- **Galaxies** -> **Sectors** -> **Systems** -> **Planets**

### Presets
| Preset | Galaxies | Sectors/Galaxy | Systems/Sector | Total Systems |
|--------|----------|----------------|----------------|---------------|
| Starter | 1 | 10 | 20 | 200 |
| Standard | 3 | 50 | 50 | 7,500 |
| Vast | 10 | 200 | 100 | 200,000 |

### Star Types (frequency)
- M (76.45%), K (12.1%), G (7.6%), F (3%), A (0.6%), B (0.13%), O (0.0003%)

> **Source:** `shared/config/universeGenerationConfig.ts` - Universe generation engine

---

## 9. Combat System

### Mechanics
- Ships fire at random targets each round
- Shields absorb damage first, then hull takes damage
- Shields regenerate fully between rounds
- Max 6 combat rounds (simplified OGame-style)
- Winner determined by surviving fleet
- 30% of destroyed metal/crystal becomes debris
- Loot limited by cargo capacity of surviving attackers

### Espionage
- Probe count + level difference determines intelligence gathered
- Resources -> Units -> Defense -> Buildings -> Tech revealed at increasing level gaps
- Counter-espionage chance: 2% per probe sent

> **Source:** `client/src/lib/gameLogic.ts` - `simulateCombat`, `simulateEspionage`

---

## 10. Empire Progression

### Tier System (1-21)
Each tier provides resource, experience, and research multipliers:

| Tier | Name | Resource Multiplier | XP Required |
|------|------|---------------------|-------------|
| 1 | Novice | 1.0x | 1,000 |
| 5 | Expert | 1.5x | 20,000 |
| 10 | Mythic | 2.7x | 150,000 |
| 15 | Divine | 5.0x | 750,000 |
| 21 | Absolute | 10.0x | 10,000,000 |

### Empire Levels (1-999)
- Base XP requirement: 1000
- XP multiplier per level: 1.1x
- Milestones at levels 10, 25, 50, 100, 250, 500, 999

### Kardashev Scale (18 levels)
Requirements scale with metal, crystal, deuterium, and research thresholds.

> **Source:** `shared/config/gameConfig.ts` - `TIER_CONFIG`, `EMPIRE_LEVEL_CONFIG`, `GAME_CONFIG.kardashev`

---

## 11. Government Types

| Government | Efficiency | Corruption | Stability |
|------------|------------|------------|-----------|
| Democracy | 1.2x | 0.5 | 1.0 |
| Corporate | 1.4x | 1.2 | 0.8 |
| Military | 1.0x | 0.8 | 0.9 |
| Theocracy | 0.9x | 0.6 | 1.1 |
| Monarchy | 1.1x | 1.0 | 1.0 |

> **Source:** `shared/config/gameConfig.ts` - `GOVERNMENT_MULTIPLIERS`

---

## 12. Races

| Race | Production | Combat | Research |
|------|------------|--------|----------|
| Terran | 1.0x | 1.0x | 1.0x |
| Humanoid | 0.95x | 1.05x | 1.0x |
| Silicon | 1.1x | 0.9x | 1.05x |
| Energy | 0.9x | 1.1x | 1.0x |
| Hybrid | 1.0x | 1.0x | 1.05x |

> **Source:** `shared/config/gameConfig.ts` - `RACE_BONUSES`

---

## 13. Difficulty System

| Level | Name | Multiplier | Resources | Research | Combat |
|-------|------|------------|-----------|----------|--------|
| 0 | Peaceful | 0.5x | 1.5x | 0.8x | 0.3x |
| 1 | Easy | 0.75x | 1.3x | 0.9x | 0.5x |
| 2 | Normal | 1.0x | 1.0x | 1.0x | 1.0x |
| 3 | Hard | 1.5x | 0.8x | 1.1x | 1.5x |
| 4 | Extreme | 2.0x | 0.6x | 1.3x | 2.0x |
| 5 | Impossible | 3.0x | 0.4x | 1.5x | 3.0x |

Kardashev levels multiply difficulty: 1-3 (1.0x), 4-6 (1.5x), 7-9 (2.0x), 10-12 (2.5x), 13-15 (3.0x), 16-18 (4.0x).

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.empireDifficulty`

---

## 14. NPC Factions (12 Major Factions)

| Faction | Leader | Homeworld | Bonus |
|---------|--------|-----------|-------|
| Terran Empire | Emperor Hadrian | Terra Prime | Balanced |
| Zyx Collective | The Nexus | Zyx-9 | Production +20%, Research +30% |
| Void Corsairs | Captain Blackmaw | Rogue Station Epsilon | Combat +40%, Stealth +30% |
| Merchant Guilds | Trade Master Voss | Commerce Hub Nexus | Trading +50% |
| Ancient Order | High Priestess Kael | The Hidden Sanctum | Mysticism +40% |
| Shadow Syndicate | The Phantom | Unknown | Espionage +50% |
| Precursor Cult | Oracle Sentinel | The Precursor Vault | Artifacts +30% |
| Iron Dominion | War General Kronus | Fortress World Khorne | Combat +50% |
| Free Alliance | President Charter | Liberty Station | Diplomacy +40% |
| Star Forgers | Architect Construct-7 | Construction Sphere 1 | Megastructures +40% |
| Xenobiology Institute | Dr. Synthesis Prime | Research Station Genesis | Research +30% |
| Eternal Watchers | First Guardian | The Eternal Observatory | Wisdom +30% |

> **Source:** `shared/config/gameConfig.ts` - `NPC_FACTIONS`

---

## 15. NPC Vendors

Six merchants sell specialized items:

| Vendor | Faction | Specialty | Rep Required |
|--------|---------|-----------|--------------|
| Trader Zek | Merchant Guilds | Rare artifacts | 100 |
| Blacksmith Thorne | Star Forgers | Megastructure blueprints | 150 |
| Archivist Vel | Ancient Order | Ancient knowledge | 200 |
| Spymaster Shadowfox | Shadow Syndicate | Espionage equipment | 180 |
| Weapons Master Kron | Iron Dominion | Military hardware | 120 |
| Captain Blackmaw | Void Corsairs | Contraband | 50 |

> **Source:** `shared/config/gameConfig.ts` - `NPC_VENDORS`

---

## 16. Relics & Artifacts

15+ unique relics across categories: Navigation, Knowledge, Power, Magic, Blueprint, Weapon, Technology. Rarities range from Rare to Mythic.

Example relics: Ancient Compass (exploration 1.5x), Void Stone (damage 2.0x), Dyson Sphere Blueprint (energy 10x), Antimatter Launcher (damage 5.0x).

> **Source:** `shared/config/gameConfig.ts` - `RELICS`

---

## 17. Story Mode (12 Acts)

A 12-act campaign with 3 chapters each, featuring NPCs, rewards, and escalating difficulty:

1. **Genesis** - Establish your first colony
2. **Expansion** - Expand across the stars
3. **First Contact** - Discover alien civilizations
4. **Conflict Rises** - Wage your first wars
5. **Ancient Awakening** - Uncover ancient technology
6. **Galactic Politics** - Forge alliances
7. **Dark Forces** - Combat ancient evil
8. **Dimensional Rift** - Seal interdimensional tears
9. **Corporate Conspiracy** - Expose corruption
10. **The Kardashev Challenge** - Build a Dyson Sphere
11. **The Ascendant Path** - Transcend mortality
12. **Eternity's End** - Rule all existence

> **Source:** `shared/config/gameConfig.ts` - `STORY_MODE`

---

## 18. Element System

Seven elements with strengths and weaknesses:

| Element | Damage | Special | Weak To |
|---------|--------|---------|---------|
| Fire | 1.3x | Defense -20% | Water |
| Water | 1.2x | Defense +10% | Lightning |
| Lightning | 1.4x | Speed +25% | Earth |
| Earth | 1.0x | Defense +30% | Fire |
| Ice | 1.15x | Speed -30% | Fire |
| Shadow | 1.25x | Stealth +50% | Light |
| Light | 1.0x | Defense +40%, Heal +50% | Shadow |

> **Source:** `shared/config/gameConfig.ts` - `STORY_MODE.elements`

---

## 19. Market & Trading

- **Transaction fee:** 2%
- **Order expiration:** 24 hours
- **Price range:** 0.001 - 1000 per unit
- **Player-to-player trades** via direct offers with counter-offer support
- **Auction house** with buyout and bidding

> **Source:** `shared/config/gameConfig.ts` - `GAME_CONFIG.market`
> **Source:** `shared/schema.ts` - `marketOrders`, `auctionListings`, `tradeOffers`

---

## 20. Social Systems

- **Alliances:** 1-50 members, creation costs resources
- **Guilds:** Enhanced organizations with leadership, treasury, and influence
- **Teams:** 6-player squads for raids
- **Friends:** Max 50 per player, with favorites and notes
- **Messages:** Player-to-player, combat reports, espionage reports, system

> **Source:** `shared/schema.ts` - `alliances`, `guilds`, `teams`, `friends`, `messages`

---

## 21. PvE Content

- **Universe Events:** 50 event types (boss raids, meteor strikes, invasions, anomalies)
- **Boss Encounters:** 90 unique bosses with loot tables
- **Raid Groups:** 6-50 players for coordinated boss fights
- **Raid Finder:** Matchmaking system with role preferences (tank, dps, healer, support)

> **Source:** `shared/schema.ts` - `universeEvents`, `universeBosses`, `bossEncounters`, `raidGroups`

---

## 22. Megastructures

End-game constructs including Dyson Spheres, Ring Worlds, Matrioshka Brains, Megastructure Fleets, and Stellar Engines. Each has resource production, storage, combat stats, and crew requirements.

> **Source:** `shared/schema.ts` - `megaStructures`

---

## 23. Durability System

Equipment, fleets, and buildings degrade over time and in combat:
- **Equipment durability** with degradation rates and repair costs
- **Fleet durability** tracking battle damage per ship type
- **Building structural integrity** from attacks
- **Repair history** logging all maintenance actions

> **Source:** `shared/schema.ts` - `equipmentDurability`, `fleetDurability`, `buildingDurability`, `repairHistory`

---

## 24. Currency System

Three-tier currency: **Silver** (basic), **Gold** (premium), **Platinum** (elite).
- Earned through gameplay, quests, combat
- Bank system with interest (5% default)
- Transaction logging for all currency movements

> **Source:** `shared/schema.ts` - `playerCurrency`, `bankAccounts`, `currencyTransactions`
