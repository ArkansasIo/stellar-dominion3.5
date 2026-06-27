# Ships & Starship Systems

Comprehensive documentation for the ship construction, fitting, taxonomy, and fleet management systems in Universe Empire Dominion 3.

> **Source:** `shared/config/combat/army/unitConfig.ts`
> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts`
> **Source:** `shared/config/constructorYardSystemsConfig.ts`
> **Source:** `shared/config/staryardConfig.ts`
> **Source:** `client/src/lib/unitData.ts`
> **Source:** `client/src/lib/starshipLineCatalog.ts`
> **Source:** `client/src/lib/shipFittingModules.ts`
> **Source:** `server/routes-constructor-yard.ts`
> **Source:** `server/routes-unit-taxonomy.ts`
> **Source:** `server/routes-unitsystems.ts`
> **Source:** `client/src/pages/Shipyard.tsx`
> **Source:** `client/src/pages/Fleet.tsx`
> **Source:** `client/src/pages/Fitting.tsx`

---

## Table of Contents

1. [Overview](#overview)
2. [Unit Types & Definitions](#unit-types--definitions)
3. [Ship Taxonomy & Classification](#ship-taxonomy--classification)
4. [Constructor Yard System](#constructor-yard-system)
5. [Staryard System](#staryard-system)
6. [Ship Fitting Modules](#ship-fitting-modules)
7. [Starship Blueprints & Line Catalog](#starship-blueprints--line-catalog)
8. [API Endpoints](#api-endpoints)
9. [Client Pages](#client-pages)

---

## Overview

The ship system is a multi-layered framework covering unit construction, starship taxonomy, constructor yard progression, staryard operations, ship fitting, and fleet deployment. Units are built at the Shipyard, classified through a 240-entry taxonomy, upgraded via the Constructor Yard and Staryard, customized with 90+ fitting modules, and deployed through the Fleet Command interface.

**Key statistics:**
- **25 unit types** across 8 classes (fighters, capitals, super capitals, titans, civilians, troops, vehicles)
- **240 taxonomy entries** across 9 categories (weapons, shields, armor, motherships, starbases, moon bases, space stations, planets, moons)
- **198 constructor yard tiers** (99 mothership + 99 starship)
- **99 staryard tiers** across 18 categories and 32 sub-categories
- **90+ fitting modules** across 6 categories with 5 slot types
- **90 starship blueprints** across 30 shipyard categories

---

## Unit Types & Definitions

> **Source:** `client/src/lib/unitData.ts`
> **Source:** `shared/config/combat/army/unitConfig.ts`

### Unit Class Enum

```typescript
type UnitClass = "fighter" | "capital" | "civilian" | "defense" | "troop" | "vehicle" | "super" | "titan";
```

> **Source:** `client/src/lib/unitData.ts:7`

### Unit Item Interface

Every unit in the game is represented by a `UnitItem`:

```typescript
interface UnitItem {
  id: string;
  name: string;
  description: string;
  class: UnitClass;
  icon: any;
  cost: { metal: number; crystal: number; deuterium: number };
  stats: { structure: number; shield: number; attack: number; cargo: number; speed: number };
  requirements?: { [key: string]: number };
}
```

> **Source:** `client/src/lib/unitData.ts:9-28`

### Fighters

Small, agile, and cheap. Used in swarms.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Attack | Speed |
|---|---|---|---|---|---|---|---|---|
| `lightFighter` | Viper | 3,000 | 1,000 | 0 | 4,000 | 10 | 50 | 12,500 |
| `heavyFighter` | Cobra | 6,000 | 4,000 | 0 | 10,000 | 25 | 150 | 10,000 |
| `interceptor` | Wraith | 15,000 | 10,000 | 2,000 | 25,000 | 50 | 400 | 15,000 |

> **Source:** `client/src/lib/unitData.ts:31-58`

### Capital Ships

The heavy hitters of the fleet.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Attack | Speed |
|---|---|---|---|---|---|---|---|---|
| `cruiser` | Hammerhead | 20,000 | 7,000 | 2,000 | 27,000 | 50 | 400 | 15,000 |
| `battleship` | Leviathan | 45,000 | 15,000 | 0 | 60,000 | 200 | 1,000 | 10,000 |
| `battlecruiser` | Reaper | 30,000 | 40,000 | 15,000 | 70,000 | 400 | 700 | 10,000 |
| `destroyer` | Obliterator | 60,000 | 50,000 | 15,000 | 110,000 | 500 | 2,000 | 5,000 |
| `bomber` | Devastator | 50,000 | 25,000 | 15,000 | 75,000 | 500 | 1,000 | 4,000 |

> **Source:** `client/src/lib/unitData.ts:60-105`

### Super Capital

Massive strategic assets requiring Shipyard Level 8+.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Attack | Speed |
|---|---|---|---|---|---|---|---|---|
| `mothership` | Mothership | 1,000,000 | 500,000 | 100,000 | 1,500,000 | 10,000 | 5,000 | 2,000 |
| `deathstar` | Planet Killer | 5,000,000 | 4,000,000 | 1,000,000 | 9,000,000 | 50,000 | 200,000 | 100 |

> **Source:** `client/src/lib/unitData.ts:107-125`

### Titans

The ultimate pinnacle of naval engineering. Requires Shipyard Level 12 and Megastructure Engineering.

| ID | Name | Class | Metal | Crystal | Deut | Hull | Shield | Attack | Speed |
|---|---|---|---|---|---|---|---|---|---|
| `titanPrometheus` | Avatar | Prometheus | 10,000,000 | 8,000,000 | 5,000,000 | 25,000,000 | 1,000,000 | 5,000,000 | 50 |
| `titanAtlas` | Erebus | Atlas | 12,000,000 | 10,000,000 | 4,000,000 | 40,000,000 | 2,000,000 | 3,000,000 | 40 |
| `titanHyperion` | Ragnarok | Hyperion | 9,000,000 | 7,000,000 | 3,000,000 | 20,000,000 | 500,000 | 8,000,000 | 60 |

> **Source:** `client/src/lib/unitData.ts:127-154`

### Civilian Ships

Support and logistics vessels.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Cargo | Speed |
|---|---|---|---|---|---|---|---|---|
| `smallCargo` | Hermes | 2,000 | 2,000 | 0 | 4,000 | 10 | 5,000 | 5,000 |
| `largeCargo` | Hercules | 6,000 | 6,000 | 0 | 12,000 | 25 | 25,000 | 7,500 |
| `colonyShip` | Exodus | 10,000 | 20,000 | 10,000 | 30,000 | 100 | 7,500 | 2,500 |
| `recycler` | Scavenger | 10,000 | 6,000 | 2,000 | 16,000 | 10 | 20,000 | 2,000 |
| `espionageProbe` | Seeker Drone | 0 | 1,000 | 0 | 1,000 | 0 | 5 | 100,000,000 |

> **Source:** `client/src/lib/unitData.ts:156-201`

### Troops & Personnel

Ground forces for planetary invasion and defense.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Attack |
|---|---|---|---|---|---|---|---|
| `marine` | Space Marine | 100 | 50 | 0 | 100 | 5 | 10 |
| `exoTrooper` | Exo-Trooper | 500 | 200 | 50 | 500 | 20 | 50 |
| `colonist` | Colonist | 50 | 50 | 0 | 50 | 0 | 0 |

> **Source:** `client/src/lib/unitData.ts:203-230`

### Ground Vehicles

Armored vehicles for planetary combat.

| ID | Name | Metal | Crystal | Deut | Hull | Shield | Attack |
|---|---|---|---|---|---|---|---|
| `hoverTank` | Hover Tank | 2,000 | 500 | 100 | 2,000 | 100 | 200 |
| `battleMech` | Titan Mech | 10,000 | 5,000 | 1,000 | 10,000 | 500 | 1,000 |

> **Source:** `client/src/lib/unitData.ts:232-250`

### Unit Progression (RPG-style)

The `unitConfig.ts` defines a parallel RPG-style unit system for ground forces:

- **Unit Statuses:** Untrained (Lv 0) → Recruit (Lv 1) → Trained (Lv 2) → Veteran (Lv 3) → Elite (Lv 4) → Legend (Lv 5)
- **Unit Types:** Civilian, Military, Specialist
- **Unit Classes:** Warrior, Ranger, Mage, Paladin, Rogue
- **Jobs:** Miner, Farmer, Builder, Trader, Soldier, Officer, Engineer, Scientist
- **Base Attributes:** Strength, Constitution, Dexterity, Intelligence, Wisdom, Charisma (1-20 range)
- **Training Levels:** Basic (1h) → Standard (2h) → Advanced (4h) → Master (8h) → Legendary (16h)

> **Source:** `shared/config/combat/army/unitConfig.ts:12-252`

### Shipyard Level Requirements

Ship class unlock requirements are determined by Shipyard building level:

- **Fighters/Civilians/Troops/Vehicles:** Shipyard Level 1
- **Capital Ships:** Shipyard Level 4
- **Super Capital (Mothership/Planet Killer):** Shipyard Level 8
- **Titans:** Shipyard Level 12

> **Source:** `client/src/pages/Shipyard.tsx:147`

---

## Ship Taxonomy & Classification

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts`

The taxonomy system defines 240 entries across 9 categories, each with a hierarchical classification:

### Taxonomy Categories (240 total)

| Category | Count | Description |
|---|---|---|
| `starship-weapon` | 30 | Weapons: Projectile, Energy, Missile, Exotic |
| `starship-shield` | 30 | Shields: Deflection, Absorption, Adaptive, Flux |
| `starship-armor` | 30 | Armor: Composite, Reactive, Nanoforge, Ablative |
| `mothership` | 25 | Command Core, Support Matrix, Carrier Frame, Strategic Relay |
| `starbase` | 25 | Defense Hub, Resource Hub, Command Hub, Trade Hub |
| `moon-base` | 25 | Excavation, Fortification, Observation, Refinery |
| `space-station` | 25 | Civilian, Military, Industrial, Scientific |
| `planet` | 25 | Terrestrial, Gas Giant, Frozen, Exotic |
| `moon` | 25 | Rocky, Icy, Metallic, Fractured |

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:52-62`

### Taxonomy Entry Structure

Each entry contains:

```typescript
interface StarshipStructureTaxonomyEntry {
  id: string;          // e.g. "starship-weapon-01"
  code: string;        // e.g. "STARSHIP-WEAPON-01"
  category: TaxonomyCategory;
  name: string;
  class: string;       // e.g. "Projectile", "Energy"
  subClass: string;    // e.g. "Light Battery", "Line Battery"
  type: string;        // e.g. "Kinetic", "Laser"
  subType: string;     // e.g. "Burst", "Sustained"
  tier: number;        // 1-12
  rank: number;        // 1-240 global rank
  rarity: TaxonomyRarity; // common | uncommon | rare | epic | legendary
  description: string;
  tags: string[];
}
```

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:36-50`

### Rarity System

Rarity is determined by global rank:

| Rank Range | Rarity |
|---|---|
| 1-59 | Common |
| 60-109 | Uncommon |
| 110-159 | Rare |
| 160-209 | Epic |
| 210-240 | Legendary |

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:133-139`

### Weapon Classes

- **Projectile:** Kinetic, Rail weapons
- **Energy:** Laser, Plasma, Disruptor weapons
- **Missile:** Guided ordnance systems
- **Exotic:** Fusion, exotic matter weapons

Sub-types include: Burst, Sustained, Penetrator, Scatter, Overcharged

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:77-81`

### Shield Classes

- **Deflection:** Particle, Phase shields
- **Absorption:** Harmonic, Quantum shields
- **Adaptive:** Reflective, Resonant shields
- **Flux:** Pulse, Constant, Reactive shields

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:82-87`

### Armor Classes

- **Composite:** Ceramic, Carbide plating
- **Reactive:** Titanium, Graphene plating
- **Nanoforge:** Voidsteel, Neutronium plating
- **Ablative:** Layered, Segmented plating

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:88-94`

### Lookup Functions

```typescript
getTaxonomyEntryById(id: string): StarshipStructureTaxonomyEntry | undefined;
getTaxonomyEntriesByCategory(category: TaxonomyCategory): StarshipStructureTaxonomyEntry[];
getTaxonomyEntriesByClass(cls: string): StarshipStructureTaxonomyEntry[];
getTaxonomyEntriesBySubClass(subClass: string): StarshipStructureTaxonomyEntry[];
getTaxonomyEntriesByType(type: string): StarshipStructureTaxonomyEntry[];
getTaxonomyEntriesBySubType(subType: string): StarshipStructureTaxonomyEntry[];
getTaxonomyEntriesByRarity(rarity: TaxonomyRarity): StarshipStructureTaxonomyEntry[];
```

> **Source:** `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts:234-263`

---

## Constructor Yard System

> **Source:** `shared/config/constructorYardSystemsConfig.ts`
> **Source:** `server/routes-constructor-yard.ts`

The Constructor Yard manages two domains of upgradeable facilities:

### Domains

| Domain | Entries | Description |
|---|---|---|
| `mothership` | 99 tiers | Mothership Constructor Yard |
| `starship` | 99 tiers | Starship Shipyard |

> **Source:** `shared/config/constructorYardSystemsConfig.ts:223-224`

### Yard Entry Structure

```typescript
interface YardEntry {
  id: string;              // e.g. "mothership-yard-tier-01"
  code: string;            // e.g. "MOT-T01"
  domain: YardDomain;      // 'mothership' | 'starship'
  name: string;
  class: string;           // Mothership: Flag/Siege/Support/Carrier/Command Core
                           // Starship: Interceptor/Frigate/Cruiser/Battleship/Dreadnought
  subClass: string;        // Atlas/Leviathan/Bastion/Aegis/Ascendant or Raider/Guardian/etc.
  type: string;            // Fortress/Assault/Logistics/Intel/Terraform or Kinetic/Energy/etc.
  subType: string;         // Prime/Vanguard/Sentinel/Overlord/Dominion or Burst/Sustained/etc.
  tier: number;            // 1-99
  rarity: number;          // 1-9
  requiredLevel: number;   // 1-999
  maxLevel: number;        // 999
  rankTitle: string;       // Cadet-1 through GrandAdmiral-10
  stats: YardStats;
  subStats: YardSubStats;
  effects: YardEffect[];
  buffs: YardBuff[];
  debuffs: YardDebuff[];
  baseUpgradeCost: { metal: number; crystal: number; deuterium: number };
  baseUpgradeTimeSec: number;
}
```

> **Source:** `shared/config/constructorYardSystemsConfig.ts:56-83`

### Yard Stats

```typescript
interface YardStats {
  hull: number;
  shields: number;
  firepower: number;
  speed: number;
  accuracy: number;
  cargo: number;
}

interface YardSubStats {
  critChance: number;
  evasion: number;
  resistance: number;
  regen: number;
  fuelEfficiency: number;
  commandSync: number;
}
```

> **Source:** `shared/config/constructorYardSystemsConfig.ts:14-30`

### Rank Title Progression

| Tier Range | Rank |
|---|---|
| 1-9 | Cadet-1 to Cadet-9 |
| 10-19 | Ensign-1 to Ensign-10 |
| 20-29 | Lieutenant-1 to Lieutenant-10 |
| 30-39 | Commander-1 to Commander-10 |
| 40-49 | Captain-1 to Captain-10 |
| 50-59 | Commodore-1 to Commodore-10 |
| 60-69 | RearAdmiral-1 to RearAdmiral-10 |
| 70-79 | ViceAdmiral-1 to ViceAdmiral-10 |
| 80-89 | Admiral-1 to Admiral-10 |
| 90-99 | GrandAdmiral-1 to GrandAdmiral-10 |

> **Source:** `shared/config/constructorYardSystemsConfig.ts:99-110`

### Stat Scaling

Stats scale exponentially with tier and level:

- **Hull:** `base * (1 + tier * 0.08) * 2.2 * 1.012^(level-1)`
- **Shields:** `base * (1 + tier * 0.08) * 1.9 * 1.012^(level-1)`
- **Firepower:** `base * (1 + tier * 0.08) * 2.1 * 1.012^(level-1)`
- **Speed:** `base * 0.6 + tier * (2 or 4) * 1.006^(level-1)`
- **Cargo:** `base * (1 + tier * 0.08) * (2.8 or 1.3) * 1.01^(level-1)`

Mothership entries use higher base values (220) compared to starship (140).

> **Source:** `shared/config/constructorYardSystemsConfig.ts:127-153`

### Upgrade Cost Formula

```typescript
cost = baseCost * steps * 1.045^(currentLevel - 1)
// where steps = targetLevel - currentLevel
```

> **Source:** `shared/config/constructorYardSystemsConfig.ts:260-271`

### Upgrade Time Formula

```typescript
time = baseTimeSec * max(1, steps) * 1.02^(tier - 1)
// minimum 30 seconds
```

> **Source:** `shared/config/constructorYardSystemsConfig.ts:273-279`

### Constructor Yard Effects

Each yard entry provides:

- **Tactical Output:** `4 + tier * 0.35`% offensive system boost
- **Defensive Matrix:** `3 + tier * 0.3`% shield/hull mitigation
- **Overclock Pulse:** `5 + tier * 0.28`% temporary firepower/speed (600s)
- **Logistics Surge:** `4 + tier * 0.22`% fuel/queue reduction (900s)

> **Source:** `shared/config/constructorYardSystemsConfig.ts:162-193`

---

## Staryard System

> **Source:** `shared/config/staryardConfig.ts`

The Staryard defines 99 tiers across 18 categories and 32 sub-categories, linked to a 1-999 level system.

### Categories (18)

| # | Category | Primary Class | Primary Type |
|---|---|---|---|
| 1 | Alpha Strike Corps | Assault | Strike |
| 2 | Vanguard Assault Division | Vanguard | Assault |
| 3 | Shield Wall Garrison | Defense | Shield |
| 4 | Fortress Bastion Order | Fortress | Bastion |
| 5 | Fleet Command Bridge | Command | Fleet |
| 6 | Carrier Battle Group | Carrier | Battle |
| 7 | Rapid Strike Wing | Rapid | Strike |
| 8 | Deep Space Escort Fleet | Escort | Patrol |
| 9 | Electronic Warfare Division | Electronic | Warfare |
| 10 | Sensor Intelligence Network | Sensor | Intel |
| 11 | Celestial Mining Guild | Industrial | Mining |
| 12 | Supply Chain Logistics | Logistics | Supply |
| 13 | Colonial Vanguard Corps | Civilian | Colonial |
| 14 | Research & Science Division | Science | Research |
| 15 | Siege Engine Battalion | Siege | Bombardment |
| 16 | Medical Corps Division | Medical | Support |
| 17 | Special Operations Force | SpecOps | Covert |
| 18 | Titan Ascendant Order | Titan | Ascendant |

> **Source:** `shared/config/staryardConfig.ts:98-122`

### Sub-Categories (32)

Each category has 1-3 sub-categories with specific specializations:

- Interceptor Squadron, Bomber Wing (Alpha Strike Corps)
- Strike Package Unit, Anti-Capital Team (Vanguard Assault Division)
- Point Defense Battery, Perimeter Guard Screen (Shield Wall Garrison)
- Hardened Core Unit, Siege Resistance Force (Fortress Bastion Order)
- Task Force HQ, Strategic C2 Bridge (Fleet Command Bridge)
- Black Ops Command Cell (Special Operations Force)
- Multi-Role Carrier Wing, Assault Carrier Group (Carrier Battle Group)
- Rapid Deployment Strike, Forward Scout Unit (Rapid Strike Wing)
- Convoy Defense Screen, Patrol Escort Unit (Deep Space Escort Fleet)
- ECM Battery Group, SIGINT Collection Node (Electronic Warfare Division)
- Deep Scan Array, ELINT Network Hub (Sensor Intelligence Network)
- Mineral Survey Team, Heavy Extraction Rig (Celestial Mining Guild)
- Fuel Depot Station, Cargo Transport Unit (Supply Chain Logistics)
- Advance Scout Force, Settlement Ship Unit (Colonial Vanguard Corps)
- Science Platform Array, Astrometry Station Hub (Research & Science Division)
- Orbital Bombardment Group (Siege Engine Battalion)
- Trauma Bay Unit (Medical Corps Division)
- Titan Vanguard Order (Titan Ascendant Order)

> **Source:** `shared/config/staryardConfig.ts:136-175`

### Tier Entry Structure

```typescript
interface StaryardTierEntry {
  id: string;              // e.g. "staryard-tier-01"
  tier: number;            // 1-99
  name: string;
  rank: string;            // e.g. "Novice I"
  title: string;           // e.g. "Cadet"
  category: string;
  subCategory: string;
  class: string;           // Recruit, Scout, Warrior, etc.
  subClass: string;        // Alpha, Beta, Gamma, etc.
  type: string;
  subType: string;
  stats: StaryardStats;
  subStats: StaryardSubStats;
  attributes: StaryardAttributes;
  subAttributes: StaryardSubAttributes;
  subjects: StaryardSubject[];
  levelRange: { min: number; max: number };
}
```

> **Source:** `shared/config/staryardConfig.ts:56-76`

### Staryard Stats

```typescript
interface StaryardStats {
  hull: number;       // 1000 * 1.08^(tier-1)
  shields: number;    // 800 * 1.08^(tier-1)
  firepower: number;  // 500 * 1.08^(tier-1)
  speed: number;      // 100 * 1.04^(tier-1)
  range: number;      // 150 * 1.03^(tier-1)
  cargo: number;      // 5000 * 1.06^(tier-1)
}

interface StaryardSubStats {
  hullRegen: number;
  shieldRegen: number;
  critChance: number;     // max 50%
  evasion: number;        // max 60%
  accuracy: number;       // max 99%
  fuelEfficiency: number; // max 99%
}
```

> **Source:** `shared/config/staryardConfig.ts:14-30`, `271-293`

### Rank Groups

Tiers 1-99 are mapped through 10 rank groups:

| Rank Group | Tiers |
|---|---|
| Novice | 1-9 |
| Apprentice | 10-19 |
| Journeyman | 20-29 |
| Veteran | 30-39 |
| Expert | 40-49 |
| Master | 50-59 |
| Grandmaster | 60-69 |
| Champion | 70-79 |
| Legend | 80-89 |
| Ascendant | 90-99 |

Each tier within a group uses Roman numerals (I-X).

> **Source:** `shared/config/staryardConfig.ts:196-209`

### Faction & Doctrine System

Each tier entry is assigned from rotating lists:

- **Factions:** Star Republic, Iron Dominion, Void Collective, Solar Covenant, Nebula Confederation, Aether League, Quantum Union, Nova Alliance, Deep Space Authority, Eclipse Order
- **Doctrines:** Blitzkrieg Assault, Fortress Defense, Electronic Supremacy, Resource Dominance, Colonial Expansion, Scientific Advancement, Covert Operations, Carrier Strike, Heavy Siege, Rapid Maneuver
- **Specializations:** Anti-Fighter, Anti-Capital, Point Defense, Long-Range Strike, Electronic Warfare, Resource Extraction, Colonization, Research, Medical Support, Covert Ops
- **Formations:** Arrow Formation, Shield Wall, Dispersed Screen, Globe Formation, Line Abreast, Column Formation, Diamond Pattern, Hammer & Anvil, Pincer Maneuver, Orbital Ring

> **Source:** `shared/config/staryardConfig.ts:245-267`

### Level Range System

Each tier maps to 10 levels in a 1-999 level system:

```
Tier 1:   Levels 1-10
Tier 2:   Levels 11-20
Tier 99:  Levels 981-990
```

> **Source:** `shared/config/staryardConfig.ts:346-354`

### Subjects (Per Tier)

Each tier entry includes 5 subjects:
1. **Combat Doctrine** - Engagement protocols
2. **Fleet Composition** - Standard fleet makeup
3. **Technology Level** - Tech classification and access rights
4. **Resource Requirements** - Maintenance and resource costs
5. **Training Standard** - Personnel training requirements

> **Source:** `shared/config/staryardConfig.ts:297-342`

---

## Ship Fitting Modules

> **Source:** `client/src/lib/shipFittingModules.ts`

The fitting system provides 90+ modules across 6 categories and 5 slot types.

### Module Interface

```typescript
interface ShipModule {
  id: string;
  name: string;
  description: string;
  category: string;    // weapon, defense, propulsion, electronic, engineering, utility
  class: string;       // projectile, energy, hybrid, missile, shield, armor, etc.
  subclass: string;    // autocannon, pulse_laser, railgun, booster, hardener, etc.
  type: string;        // high, mid, low, rig, subsystem
  size: string;        // small, medium, large, capital, universal
  meta: number;        // 0-14
  tech: number;        // 1-3
  cpu: number;
  powergrid: number;
  calibration?: number;
  capacitor?: number;
  stats: { [key: string]: number | string | boolean };
  requirements?: { skills?: { [key: string]: number }; shipSize?: string[] };
  price: { isk: number; materials?: { [key: string]: number } };
}
```

> **Source:** `client/src/lib/shipFittingModules.ts:5-29`

### Slot Types

| Slot | Description | Color |
|---|---|---|
| `high` | Weapons and utility modules | Red |
| `mid` | Defense, propulsion, and EWAR | Blue |
| `low` | Engineering and damage mods | Green |
| `rig` | Permanent ship modifications | Purple |
| `subsystem` | T3 ship subsystems | Orange |

> **Source:** `client/src/lib/shipFittingModules.ts:1856-1862`

### Module Categories

| Category | Icon | Description |
|---|---|---|
| `weapon` | Target | Weapons (30 modules) |
| `defense` | Shield | Defense (25 modules) |
| `propulsion` | Navigation | Propulsion |
| `electronic` | Cpu | Electronic Warfare |
| `engineering` | Cog | Engineering |
| `utility` | Settings | Utility |

> **Source:** `client/src/lib/shipFittingModules.ts:1846-1853`

### Weapons (High Slots - 30 modules)

#### Projectile Weapons
- **125mm Autocannon I** - Small projectile, kinetic/explosive, 12 damage, 5km range
- **150mm Autocannon II** - Advanced small autocannon, meta 5, 18 damage, 6km range
- **425mm Artillery I** - Medium artillery, 180 damage, 25km range, high alpha

#### Energy Weapons
- **Small Pulse Laser I** - Short range, high tracking, EM/thermal, 15 damage, 4.5km
- **Medium Beam Laser I** - Long range, focused damage, 95 damage, 35km range
- **Tachyon Beam Laser I** - Large long-range beam, 450 damage, 80km range

#### Hybrid Weapons
- **75mm Railgun I** - Small hybrid, kinetic/thermal, 14 damage, 12km range
- **Heavy Neutron Blaster I** - Close range, 125 damage, 8km range

#### Missile Launchers
- **Light Missile Launcher I** - Frigate missiles, 45 damage, 25km range
- **Heavy Missile Launcher I** - Cruiser missiles, 180 damage, 60km range
- **Cruise Missile Launcher I** - Battleship missiles, 650 damage, 150km range
- **Torpedo Launcher I** - Anti-capital, 1850 damage, 80km range

#### Drones
- **Small Drone Bay** - Light drones, 10 bandwidth, 25 capacity
- **Medium Drone Bay** - Medium drones, 25 bandwidth, 75 capacity

#### Smart Bombs
- **EM Smart Bomb I** - AOE EM damage, 1000 damage, 6km range

> **Source:** `client/src/lib/shipFittingModules.ts:32-436`

### Defense (Mid Slots - 25 modules)

#### Shield Boosters
- **Small/Medium/Large Shield Booster I** - Repair 60/240/960 shield HP per cycle

#### Shield Extenders
- **Small Shield Extender I** - +400 max shield HP
- **Medium Shield Extender II** - +1800 max shield HP (meta 5)

#### Shield Hardeners
- **EM/Thermal/Kinetic/Explosive Shield Hardener I** - +30% resistance per type
- **Kinetic Shield Hardener II** - +40% kinetic resistance (meta 5)

#### Propulsion
- **1MN/10MN Afterburner I** - +125% velocity
- **5MN/50MN Microwarpdrive I** - +500% velocity with signature bloom

#### Electronic Warfare
- **Multispectral ECM I** - Jam all sensor types, 50km range
- **Scan Resolution Dampener I** - Reduce target lock speed
- **Stasis Webifier I** - -50% target velocity, 10km range
- **Warp Disruptor I** - Prevent warp, 20km range
- **Warp Scrambler I** - Prevent warp + disable MWD, 9km range
- **Target Painter I** - +25% target signature radius

#### Capacitor
- **Small Capacitor Booster I** - Inject 150 capacitor units
- **Medium Capacitor Battery I** - +15% cap, +10% recharge, 20% neut resist

#### Sensor
- **Sensor Booster I** - +15% scan resolution and target range
- **Tracking Computer I** - +10% turret tracking and range

> **Source:** `client/src/lib/shipFittingModules.ts:438-993`

### Engineering (Low Slots - 20 modules)

#### Armor Repairers
- **Small/Medium Armor Repairer** - Repair 50/280 armor HP per cycle

#### Armor Plates
- **Small/Medium/Large Armor Plate I** - +400/1600/6400 armor HP

#### Armor Hardeners
- **EM/Thermal/Kinetic/Explosive Armor Hardener I** - +30% armor resistance

#### Damage Modules
- **Gyrostabilizer I** - +10% projectile damage, +5% ROF
- **Heat Sink I** - +10% energy weapon damage
- **Magnetic Field Stabilizer I** - +10% hybrid weapon damage
- **Ballistic Control System I** - +10% missile damage
- **Drone Damage Amplifier I** - +10% drone damage

#### Power/CPU
- **Power Diagnostic System I** - +5% capacitor, shield, powergrid, recharge
- **Reactor Control Unit I** - +10% powergrid output
- **Co-Processor I** - +10% CPU output

#### Cargo/Utility
- **Expanded Cargohold I** - +25% cargo capacity
- **Inertial Stabilizers I** - -15% inertia (agility)
- **Overdrive Injector System I** - +5% max velocity

> **Source:** `client/src/lib/shipFittingModules.ts:995-1461`

### Rigs (15 modules)

Permanent modifications with calibration costs:

- **Auxiliary Nano Pump I** - +15% armor repair, -10% armor HP
- **Core Defense Field Extender I** - +15% shield HP, +10% signature radius
- **Capacitor Control Circuit I** - +15% cap recharge, -10% shield boost
- **Warhead Calefaction Catalyst I** - +10% missile damage, -10% missile velocity
- **Burst Aerator I** - +10% turret ROF, -10% cap capacity
- **Cargohold Optimization I** - +20% cargo, -10% velocity
- **Polycarbon Engine Housing I** - +10% velocity, -10% cargo
- **Targeting System Subcontroller I** - +20% targeting range, -10% scan res
- **Drone Damage Amplifier I** - +10% drone damage, -10% drone HP
- **Hyperspatial Velocity Optimizer I** - +20% warp speed, -10% cap capacity
- **Small Low Friction Nozzle Joints I** - -10% signature radius, -10% velocity
- **Anti-EM Screen Reinforcer I** - +15% EM armor resist, -5% explosive resist
- **Anti-Kinetic Screen Reinforcer I** - +15% kinetic shield resist, -5% EM resist
- **Ionic Field Projector I** - +15% scan resolution, -10% targeting range
- **Auxiliary Thrusters I** - -10% inertia, -10% structure HP

> **Source:** `client/src/lib/shipFittingModules.ts:1463-1809`

### Tech Levels

| Level | Name | Description |
|---|---|---|
| 1 | Tech I | Standard modules |
| 2 | Tech II | Advanced modules |
| 3 | Tech III | Elite modules |

### Meta Levels

| Level | Name | Quality |
|---|---|---|
| 0 | Tech I | Standard |
| 1-4 | Meta 1-4 | Improved to Exceptional |
| 5 | Tech II | Advanced |
| 6 | Faction | Faction |
| 7 | Officer | Officer |
| 8 | Deadspace | Deadspace |
| 14 | Storyline | Storyline |

> **Source:** `client/src/lib/shipFittingModules.ts:1868-1886`

### Module Lookup Functions

```typescript
getModulesByCategory(category: string): ShipModule[];
getModulesByType(type: string): ShipModule[];
getModulesBySize(size: string): ShipModule[];
getModuleById(id: string): ShipModule | undefined;
getModulesByClass(moduleClass: string): ShipModule[];
getModulesBySubclass(subclass: string): ShipModule[];
getTechLevelModules(techLevel: number): ShipModule[];
getMetaLevelModules(metaLevel: number): ShipModule[];
```

> **Source:** `client/src/lib/shipFittingModules.ts:1812-1843`

---

## Starship Blueprints & Line Catalog

> **Source:** `client/src/lib/starshipLineCatalog.ts`

The line catalog defines 30 shipyard categories with 90 starship blueprints.

### Category Structure

```typescript
interface ShipyardCategorySystem {
  id: string;
  name: string;
  doctrine: string;
  description: string;
  icon: "fighter" | "frigate" | "destroyer" | "cruiser" | "battleship" | "carrier" | "support";
  order: number;
  requirements: { shipyardLevel: number; researchTotal: number };
}
```

> **Source:** `client/src/lib/starshipLineCatalog.ts:6-14`

### Blueprint Structure

```typescript
interface StarshipLineBlueprint {
  id: string;
  categoryId: string;
  categoryName: string;
  hullClass: string;
  role: string;
  sequence: number;        // 1-3 variants per category
  name: string;
  description: string;
  doctrine: string;
  stats: { hull: number; shields: number; firepower: number; cargo: number; speed: number };
  requirements: {
    categoryId: string;
    shipyardLevel: number;
    categoryLevel: number;
    kardashevLevel: number;   // 1-6
  };
}
```

> **Source:** `client/src/lib/starshipLineCatalog.ts:23-41`

### Shipyard Categories (30)

| # | Category | Hull Class | Role | Icon |
|---|---|---|---|---|
| 1 | Corvette Patrols | Corvette | Patrol | fighter |
| 2 | Frigate Command | Frigate | Line Frigate | frigate |
| 3 | Assault Frigates | Assault Frigate | Assault | frigate |
| 4 | Logistics Frigates | Logistics Frigate | Field Support | frigate |
| 5 | Covert Exploration Wings | Covert Frigate | Exploration | fighter |
| 6 | Stealth Bomber Wings | Stealth Bomber | Ambush | fighter |
| 7 | Interceptor Wings | Interceptor | Tackle | fighter |
| 8 | Destroyer Command | Destroyer | Screen Breaker | destroyer |
| 9 | Tactical Command Destroyers | Tactical Destroyer | Control | destroyer |
| 10 | Interdictor Screens | Interdictor | Interdiction | destroyer |
| 11 | Cruiser Command | Cruiser | Command Cruiser | cruiser |
| 12 | Heavy Assault Cruisers | Heavy Assault Cruiser | Heavy Assault | cruiser |
| 13 | Recon Cruisers | Recon Cruiser | Recon | cruiser |
| 14 | Logistics Cruisers | Logistics Cruiser | Fleet Sustain | cruiser |
| 15 | Strategic Cruisers | Strategic Cruiser | Modular | cruiser |
| 16 | Battlecruiser Command | Battlecruiser | Heavy Line | cruiser |
| 17 | Command Ships | Command Ship | Fleet Command | cruiser |
| 18 | Battleship Command | Battleship | Line Battleship | battleship |
| 19 | Marauder Commands | Marauder | Bastion Siege | battleship |
| 20 | Black Ops Wings | Black Ops Battleship | Covert Capital | battleship |
| 21 | Industrial Haulers | Industrial | Hauler | support |
| 22 | Blockade Runners | Blockade Runner | Smuggler Transport | support |
| 23 | Deep Space Transports | Deep Space Transport | Armored Freight | support |
| 24 | Mining Barges | Mining Barge | Extraction | support |
| 25 | Exhumers | Exhumer | Advanced Extraction | support |
| 26 | Freighter Command | Freighter | Bulk Freight | support |
| 27 | Jump Freighters | Jump Freighter | Strategic Freight | support |
| 28 | Industrial Command Ships | Industrial Command Ship | Industrial Command | support |
| 29 | Dreadnought Sieges | Dreadnought | Siege Capital | battleship |
| 30 | Carrier Groups | Carrier | Strike Projection | carrier |
| 31 | Force Auxiliary Corps | Force Auxiliary | Capital Logistics | carrier |
| 32 | Apex Capital Command | Supercapital | Apex Command | carrier |

> **Source:** `client/src/lib/starshipLineCatalog.ts:72-105`

### Blueprint Variants (Examples)

Each category has 2-3 named variants:

**Corvette Patrols:**
- Needle Patrol Corvette
- Sentinel Patrol Corvette
- Warden Patrol Corvette

**Battleship Command:**
- Paladin Battleship
- Leviathan Battleship
- Dominus Battleship

**Carrier Groups:**
- Atlas Carrier
- Ark Carrier

**Apex Capital Command:**
- Eminence Supercarrier
- Omnistar Titan

> **Source:** `client/src/lib/starshipLineCatalog.ts:72-105`

### Blueprint Stat Scaling

Stats are computed per blueprint based on category index, variant, and hull class:

```typescript
hull = (920 + powerBase * 7.4) * capitalWeight
shields = (160 + powerBase * 1.9) * capitalWeight
firepower = (150 + powerBase * 2.8) * (support ? 0.82 : capitalWeight)
cargo = (520 + powerBase * 3.5) * logisticsWeight * (carrier ? 1.25 : 1)
speed = max(22, 180 - index * 2.4 - variant * 5 - hullClassPenalty)
```

Where `powerBase = 220 + categoryIndex * 38 + variantIndex * 34`

> **Source:** `client/src/lib/starshipLineCatalog.ts:130-155`

### Upgrade Snapshots

**Category Upgrade:**
- Max Level: 12
- Cost scales: `base * 1.42^level`
- Current bonus: `level * (2 + floor(order / 6))`

**Blueprint Upgrade:**
- Max Level: 8
- Cost scales: `base * 1.32^level`
- Hull bonus: `level * (3 + sequence)`
- Firepower bonus: `level * (4 + kardashevLevel)`

> **Source:** `client/src/lib/starshipLineCatalog.ts:166-197`

---

## API Endpoints

### Constructor Yard API

> **Source:** `server/routes-constructor-yard.ts`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/constructor-yard/meta` | Get aggregate metadata | Yes |
| GET | `/api/constructor-yard/catalog` | List entries (optional `?domain=` filter) | Yes |
| GET | `/api/constructor-yard/entries/:entryId` | Get single entry by ID | Yes |
| GET | `/api/constructor-yard/status/me` | Get player's constructor yard status | Yes |
| POST | `/api/constructor-yard/upgrade/preview` | Preview upgrade cost/time | Yes |
| POST | `/api/constructor-yard/upgrade/start` | Start an upgrade | Yes |
| POST | `/api/constructor-yard/upgrade/complete` | Complete a ready upgrade | Yes |

**Request/Response Examples:**

```json
// POST /api/constructor-yard/upgrade/start
// Body: { "entryId": "starship-yard-tier-05", "targetLevel": 6 }
// Response: { "success": true, "message": "Upgrade started", "state": {...} }

// POST /api/constructor-yard/upgrade/preview
// Body: { "entryId": "mothership-yard-tier-10", "targetLevel": 15 }
// Response: { "success": true, "cost": { "metal": 50000, "crystal": 35000, "deuterium": 25000 }, "timeSec": 1800 }
```

> **Source:** `server/routes-constructor-yard.ts:22-117`

### Unit Taxonomy API

> **Source:** `server/routes-unit-taxonomy.ts`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/unit-taxonomy/meta` | Aggregate metadata | No |
| GET | `/api/unit-taxonomy/categories` | All 18 categories | No |
| GET | `/api/unit-taxonomy/categories/:domain` | Categories by domain | No |
| GET | `/api/unit-taxonomy/subcategories` | All 32 sub-categories | No |
| GET | `/api/unit-taxonomy/subcategories/:categoryId` | Sub-categories for a category | No |
| GET | `/api/unit-taxonomy/tiers` | All 99 tier definitions | No |
| GET | `/api/unit-taxonomy/tiers/:tier` | Tier class for specific tier | No |
| GET | `/api/unit-taxonomy/levels` | Level band definitions (1-999) | No |
| GET | `/api/unit-taxonomy/levels/:level` | Band info and stat multiplier | No |
| GET | `/api/unit-taxonomy/entries` | All taxonomy entries | No |
| GET | `/api/unit-taxonomy/entries/domain/:domain` | Entries by domain | No |
| GET | `/api/unit-taxonomy/entries/category/:categoryId` | Entries by category | No |
| GET | `/api/unit-taxonomy/entries/:id` | Single entry by ID | No |

**Valid Domains:** `civilization`, `military`, `government`

> **Source:** `server/routes-unit-taxonomy.ts:27-189`

### Unit Systems API

> **Source:** `server/routes-unitsystems.ts`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/unit-systems/state` | Full player unit system state | Yes |
| GET | `/api/unit-systems/templates` | All unit templates | No |
| GET | `/api/unit-systems/templates/:domain` | Templates by domain | No |
| GET | `/api/unit-systems/blueprints` | Starship blueprints | No |
| POST | `/api/unit-systems/train` | Queue unit training | Yes |
| POST | `/api/unit-systems/untrain` | Remove units from pool | Yes |
| POST | `/api/unit-systems/training/process` | Process training queue | Yes |
| POST | `/api/unit-systems/combat/simulate` | Simulate combat | No |
| POST | `/api/unit-systems/yard/construct` | Queue starship construction | Yes |
| POST | `/api/unit-systems/yard/process` | Process construction yard | Yes |

**Valid Domains:** `troop`, `civilian`, `government`, `military`

```json
// POST /api/unit-systems/train
// Body: { "unitId": "marine", "quantity": 50, "toState": "trained" }

// POST /api/unit-systems/combat/simulate
// Body: { "attacker": { "units": [...] }, "defender": { "units": [...] } }
// Response: { "success": true, "result": { "winner": "attacker", "losses": {...} } }
```

> **Source:** `server/routes-unitsystems.ts:118-273`

---

## Client Pages

### Shipyard Page

> **Source:** `client/src/pages/Shipyard.tsx`

The Shipyard page is the central hub for fleet construction and management.

**Tabs:**
1. **Combat Fleet** - Fighters and capital ships (fighters, cruisers, battleships, battlecruisers, destroyers, bombers)
2. **Civil Ships** - Transport, colonization, and resource gathering vessels
3. **Personnel** - Ground forces (marines, exo-troopers, colonists)
4. **Vehicles** - Ground vehicles (hover tanks, battle mechs)
5. **Constructor Yard** - Starship constructor yard upgrades with `AdvancedConstructorDock` component
6. **Motherships** - Mobile command fortresses with mothership constructor yard
7. **Titans** - Ultimate military vessels requiring Shipyard Level 12

**Key Features:**
- Fleet power calculation: `attack + shield + structure/10` per unit
- Production queue with real-time countdown timers
- Constructor yard upgrade panels with progress tracking
- Shipyard level requirements for each unit class
- Resource cost validation before building

**Constructor Yard Panels:**
- Starship Constructor Yard: Upgrade live starship production lines
- Mothership Constructor Yard: Build command cores, carrier cradles, siege hull sections

> **Source:** `client/src/pages/Shipyard.tsx:261-357`

### Fleet Page

> **Source:** `client/src/pages/Fleet.tsx`

The Fleet page manages fleet deployment and mission execution.

**Tabs:**
1. **Dispatch Fleet** - Select units, set target coordinates, choose mission type
2. **Active Missions** - Monitor in-flight fleets with ETAs and progress bars
3. **Fleet Templates** - Pre-configured fleet compositions (Raiding Party Alpha, Colony Ship I)
4. **Combat Simulator** - Estimate battle outcomes before attacking

**Mission Types:**
| Type | Description |
|---|---|
| `attack` | Engage enemy defenses |
| `transport` | Deliver resources |
| `espionage` | Gather intelligence |
| `sabotage` | Destroy structures |
| `colonize` | Establish new colony |
| `deploy` | Station fleet at target |

**Personnel Assignment System:**
- **Pilots:** +2% speed per pilot (max +24%)
- **Gunners:** +2% accuracy and attack per gunner (max +20% accuracy, +30% attack)
- **Officers:** +2% shield and +3% morale per officer (max +18% shield, +25% morale)
- Auto-assign calculates recommended crew based on ship count

**Fleet Composition:**
- Slowest unit determines fleet speed
- Total fleet power calculated across all selected units
- URL parameters sync state (galaxy, system, planet, mission, tab)

> **Source:** `client/src/pages/Fleet.tsx:63-856`

### Fitting Page

> **Source:** `client/src/pages/Fitting.tsx`

The Fitting page provides a ship customization interface.

**Features:**
- Ship selection dropdown
- Resource monitoring (CPU, Powergrid, Calibration)
- Slot-based module fitting (High, Mid, Low, Rig)
- Module filtering by slot type and ship size
- Real-time resource usage tracking
- Save fitting configuration

**Slot Types:**
| Slot | Icon | Color |
|---|---|---|
| High | Target | Red |
| Mid | Navigation | Blue |
| Low | Cog | Green |
| Rig | Settings | Purple |

**Resource System:**
- Each module consumes CPU and Powergrid
- Rigs consume Calibration instead
- Progress bars show usage vs. capacity
- Modules filter by ship size compatibility

**API Endpoints Used:**
- `GET /api/fitting/modules` - Load all available modules
- `GET /api/fitting/ship/:shipId` - Load ship fitting state
- `POST /api/fitting/fit` - Save fitting configuration

> **Source:** `client/src/pages/Fitting.tsx:72-323`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Pages                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Shipyard │  │  Fleet   │  │ Fitting  │  │Constructor│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐   │
│  │              Client Libraries                         │   │
│  │  unitData.ts  starshipLineCatalog.ts                  │   │
│  │  shipFittingModules.ts                                │   │
│  └───────────────────────┬──────────────────────────────┘   │
├──────────────────────────┼──────────────────────────────────┤
│                    API Layer                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │constructor│  │unit-     │  │unit-     │  │fitting   │   │
│  │-yard     │  │taxonomy  │  │systems   │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
├───────┼──────────────┼──────────────┼──────────────┼────────┤
│                    Shared Config                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │constructor│  │starship  │  │staryard  │  │unitConfig│   │
│  │Yard      │  │Taxonomy  │  │Config    │  │          │   │
│  │Systems   │  │Config    │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

1. **Unit Construction:** Player selects unit on Shipyard page → validates resources/requirements → calls `buildUnit()` → production queue processes
2. **Constructor Yard Upgrade:** Player selects yard entry → preview cost → start upgrade → wait for timer → complete upgrade
3. **Starship Construction:** Player selects blueprint → calls `/api/unit-systems/yard/construct` → construction yard processes
4. **Fleet Dispatch:** Player selects units → assigns personnel → sets coordinates → chooses mission → calls `/api/game/send-fleet`
5. **Ship Fitting:** Player selects ship → browses modules → fits to slots → saves configuration
6. **Taxonomy Lookup:** Any system queries taxonomy entries by category, class, rarity, or ID
