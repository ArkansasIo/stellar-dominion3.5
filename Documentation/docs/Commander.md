# Commander System

The commander system is the RPG layer of universe-empire-dominion. Players manage a commander character with races, classes, equipment, talent trees, a gacha recruitment system, government leader appointments, and a vault/bank for storing resources and items.

> **Source:** `shared/config/commander/vault/commanderBankVault.ts`
> **Source:** `shared/config/commander/vault/vaultBankSystem.ts`
> **Source:** `shared/config/commander/talent-tree/commanderTalentTree.ts`
> **Source:** `shared/config/commander/talent-tree/commanderTalentTreeConfig.ts`
> **Source:** `server/routes-commanders.ts`
> **Source:** `client/src/pages/Commander.tsx`
> **Source:** `client/src/lib/commanderTypes.ts`
> **Source:** `client/src/lib/commanderSystems.ts`

---

## Commander Identity

### Races (8 total)

| Race | Name | Bonuses |
|------|------|---------|
| Terran | Terran Union | +5% All Resource Production, +5% Research Speed |
| Aquarian | Aquarian Dominion | +20% Deuterium Production, +10% Biological Research |
| Mechborn | The Mechborn | +20% Construction Speed, -10% Building Cost |
| Lithoid | Lithoid Crag | +15% Metal/Crystal Production, +10% Ship Armor |
| Zypherian | Zypherian Collective | +25% Fleet Coordination, +10% Collective Research |
| Vortexborn | Vortexborn | +20% Exotic Research, +15% Warp Speed |
| Silicate | Silicate Constructs | +30% Crystal Production, +20% Energy Efficiency |
| Ethereal | Ethereal Beings | +20% Spiritual Research, +15% Quantum Technology |

### Classes (6 total)

| Class | Name | Bonuses | Sub-Classes |
|-------|------|---------|-------------|
| Admiral | Fleet Admiral | +10% Ship Attack, +10% Fleet Speed | Tactician, Corsair |
| Industrialist | Industrialist | +15% Resource Production, +10% Cargo Capacity | Logistician, Geologist |
| Scientist | Chief Scientist | +20% Research Speed, +5% Shield Tech | Technomancer, Xenobiologist |
| Diplomat | Diplomat | +25% Diplomacy, +15% Trade Revenue | Negotiator |
| Explorer | Explorer | +20% Exploration Speed, +15% Archaeological Findings | Navigator, Archaeologist |
| Merchant | Merchant | +30% Market Profits, +20% Resource Trading | Trader |

### Sub-Classes (10 total)

| Sub-Class | Parent Class | Bonuses |
|-----------|-------------|---------|
| Grand Tactician | Admiral | +10% Evasion, +5% Crit Chance |
| Void Corsair | Admiral | +20% Loot Capacity, +10% Recycler Speed |
| Master Logistician | Industrialist | +10% Energy Output, -10% Ship Fuel Cost |
| Deep Core Geologist | Industrialist | +15% Crystal Production, +5% Mine Depth |
| Technomancer | Scientist | +10% Computer Tech, -10% Research Cost |
| Xenobiologist | Scientist | +20% Pop Growth, +10% Terraforming |
| Master Negotiator | Diplomat | +30% Alliance Bonus, +15% Peace Treaty Stability |
| Master Navigator | Explorer | +25% Exploration Speed, +20% Warp Accuracy |
| Black Market Trader | Merchant | +40% Market Profits, +20% Black Market Access |
| Archaeologist | Explorer | +35% Ancient Discovery Rate, +20% Artifact Value |

> **Source:** `client/src/lib/commanderTypes.ts` — `RACES`, `CLASSES`, `SUBCLASSES`

---

## Commander Stats

| Stat | Description | Primary Benefit |
|------|-------------|-----------------|
| Warfare | Combat proficiency | Ship damage output |
| Logistics | Supply chain management | Resource production |
| Science | Research capability | Research speed |
| Engineering | Construction skill | Build speed |

Stats start at 1 and increase via skill points (2 per level-up) and equipment bonuses.

### Skill Definitions

| Skill | Stat | Max Level | Effect per Level |
|-------|------|-----------|------------------|
| Combat Training | Warfare | 10 | +5% attack |
| Resource Management | Logistics | 10 | +2% production |
| Research Genius | Science | 10 | -3% research time |
| Construction Expert | Engineering | 10 | -3% build time |

> **Source:** `client/src/pages/Commander.tsx` — `skillDefinitions`

---

## Equipment System

### Equipment Slots (12 total)

| Slot | Label | Type | Description |
|------|-------|------|-------------|
| primaryWeapon | Primary Weapon | Weapon | Main offensive weapon system |
| secondaryWeapon | Secondary Weapon | Weapon | Backup weapon system |
| armorCore | Armor Core | Armor | Primary body armor plating |
| shieldMatrix | Shield Matrix | Armor | Defensive energy shielding |
| commandModule | Command Module | Module | Fleet synchronization package |
| navModule | Navigation Module | Module | Jump coordination systems |
| tacticalSuite | Tactical Suite | Module | Threat analysis overlays |
| logisticsRig | Logistics Rig | Module | Supply chain optimization |
| scienceCore | Science Core | Module | Research accelerators |
| engineeringTools | Engineering Tools | Module | Construction coordination |
| relicHarness | Relic Harness | Module | Ancient artifact relay frame |
| droneBay | Drone Bay | Module | Support drone slot |

### Equipment Item Properties

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| type | weapon/armor/module/blueprint/material | Item category |
| rarity | common/uncommon/rare/epic/legendary | Quality tier |
| level | number | Item level |
| itemClass | string | Weapon/armor class (e.g., "Plasma Arsenal") |
| itemSubClass | string | Variant (e.g., "Assault") |
| itemSubType | string | Role (e.g., "Frontline") |
| stats | object | warfare/logistics/science/engineering bonuses |
| tempering | number (0-10) | Upgrade level |
| masterwork | boolean | Masterwork quality flag |

### Equipment Templates (180 total)
Generated from 6 weapon classes, 6 armor classes, 6 module classes, and 10 variants each:

- **Weapon Classes**: Kinetic, Plasma, Ion, Rail, Particle, Gravity
- **Armor Classes**: Plate, Composite, Nano, Reactive, Aegis, Phase
- **Module Classes**: Tactical, Logistic, Science, Engineering, Sensory, Quantum
- **Variants**: Assault, Vanguard, Sentinel, Recon, Prime, Warden, Spectral, Marauder, Aegis, Zenith

Rarity scales with template level: levels 1-2 = common, 3-4 = uncommon, 5-6 = rare, 7-8 = epic, 9+ = legendary.

> **Source:** `client/src/lib/commanderTypes.ts` — `COMMANDER_EQUIPMENT_SLOT_DEFINITIONS`, `COMMANDER_EQUIPMENT_TEMPLATES`

---

## Loadout Summary System

The `buildCommanderLoadoutSummary()` function computes derived stats from equipped items:

### Core Stats (base + equipment bonuses)
- **Warfare**: base warfare + sum of weapon item warfare bonuses
- **Logistics**: base logistics + sum of module logistics bonuses
- **Science**: base science + sum of module science bonuses
- **Engineering**: base engineering + sum of all item engineering bonuses

### Sub-Stats (derived formulas)

| Sub-Stat | Formula |
|----------|---------|
| Command Power | warfare * 8 + level * 6 + weaponBonus * 12 |
| Tactical Agility | warfare * 4 + science * 3 + engineering * 2 |
| Sustainment | logistics * 7 + engineering * 4 + armorBonus * 5 |
| Civic Control | logistics * 3 + science * 2 + level * 5 |
| Research Cadence | science * 9 + moduleScience * 8 + level * 2 |
| Construction Tempo | engineering * 8 + logistics * 2 + armorBonus * 4 |

### Attributes (composite scores, clamped 1-999)

| Attribute | Derived From |
|-----------|-------------|
| Combat | (commandPower + tacticalAgility) / 12 |
| Strategy | (science * 7 + level * 5 + moduleScience * 9) / 6 |
| Resilience | (sustainment + armorBonus * 12) / 9 |
| Leadership | (level * 10 + civicControl) / 11 |
| Logistics | (sustainment + logistics * 12) / 10 |
| Innovation | (researchCadence + science * 10) / 11 |
| Governance | (civicControl + logistics * 8) / 10 |
| Adaptability | (level * 6 + engineering * 7 + science * 5) / 7 |

### Sub-Attributes

| Attribute | Formula |
|-----------|---------|
| Equipment Score | Sum of rarity + stat + tempering + masterwork scores per item |
| Inventory Load | Total inventory item count |
| Upgrade Readiness | (equipmentScore + level * 12 + engineering * 9) / 10 |
| Specialization Depth | Sum of all core stats / 2 |
| Active Slots | Count of equipped items |

> **Source:** `client/src/lib/commanderSystems.ts` — `buildCommanderLoadoutSummary()`

---

## Talent Tree System

### PoE2-Inspired Deep Passive Tree

A massive passive skill tree with level 1-999 progression and tier 1-99 nodes.

### Talent Tree Configuration

| Parameter | Value |
|-----------|-------|
| Max Level | 999 |
| Max Tier | 99 |
| Levels per Tier | ~10 |
| Branches | 6 (warfare, logistics, science, engineering, diplomacy, espionage) |

### Talent Branches

| Branch | Label | Primary Stat | Bonus Scale |
|--------|-------|-------------|-------------|
| warfare | Warfare Doctrine | attackPower | 1.8x |
| logistics | Logistics Chain | resourceEfficiency | 1.4x |
| science | Scientific Mastery | researchSpeed | 1.6x |
| engineering | Engineering Matrix | buildSpeed | 1.5x |
| diplomacy | Diplomatic Influence | tradeBonus | 1.3x |
| espionage | Shadow Intelligence | intelPower | 1.7x |

### Title Progression

| Tier Range | Title |
|------------|-------|
| 1-10 | Cadet |
| 11-20 | Lieutenant |
| 21-30 | Commander |
| 31-40 | Captain |
| 41-50 | Commodore |
| 51-60 | Admiral |
| 61-70 | High Admiral |
| 71-80 | Star Marshal |
| 81-90 | Grand Regent |
| 91-99 | Eternal Strategos |

### Node Rarities

| Rarity | Description | Point Cost Range |
|--------|-------------|------------------|
| Normal | Basic stat boost | 1-5 points |
| Notable | Significant enhancement | 3-10 points |
| Keystone | Major milestone bonus | 5-10 points |
| Ascendancy | Ultimate capstone ability | 12-20 points |

### Ascendancy Classes (6 major trees)

Each class has 3 sub-class specializations with 19-20 nodes each:

| Class | Sub-Classes | Focus |
|-------|-------------|-------|
| Warlord | Vanguard, Berserker, Tactician | Offensive combat, risk/reward, fleet buffs |
| Architect | Trade Mogul (+ 2 others) | Economy, trade, resource production |
| (+ 4 more classes) | Various | Science, diplomacy, espionage, logistics |

### Talent Node Structure

```typescript
{
  id: string;              // e.g., "wv_1"
  name: string;            // e.g., "Blade Initiate"
  description: string;     // e.g., "+10% weapon damage"
  rarity: normal|notable|keystone|ascendancy;
  tier: number;            // 1-99
  requiredLevel: number;   // 10-999
  requiredPoints: number;  // 1-20
  x: number;               // Grid position
  y: number;               // Grid position
  modifiers: StatModifier[];
  requires?: string[];     // Prerequisite node IDs
}
```

> **Source:** `shared/config/commander/talent-tree/commanderTalentTree.ts` — `TALENT_TREES[]`
> **Source:** `shared/config/commander/talent-tree/commanderTalentTreeConfig.ts`

---

## Gacha System

Commander recruitment via gacha pulls using Command Seals currency.

### Rarity Tiers

| Tier | Name | Base Probability | Soft Pity Start | Hard Pity |
|------|------|------------------|-----------------|-----------|
| 1 | Common | Highest | - | - |
| 2 | Uncommon | Low | - | - |
| 3 | Rare | Low | - | - |
| 4 | Epic | Very Low | Configurable | Configurable |
| 5 | Legendary | Ultra Low | Configurable | Guaranteed |

### Pity System
- **Soft Pity**: Rates increase as pulls approach guarantee threshold
- **Hard Pity**: 100% guarantee after configured pull count
- Pity counters reset on legendary/epic pulls

### Pull Mechanics
1. Costs Command Seals (default: 150 per pull)
2. Rolls rarity using pity-adjusted probabilities
3. Picks random commander from rarity pool
4. Adds recruited commander to player inventory
5. Updates pity counters

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/commanders` | Full commander catalog with rarity distribution |
| GET | `/api/commanders/gacha/status` | Currency, pity counters, pull rates |
| POST | `/api/commanders/gacha/pull` | Execute a gacha pull |
| GET | `/api/commanders/inventory` | Recruited commander roster |

> **Source:** `server/routes-commanders.ts`

---

## Commander Profile

Player-customizable commander metadata.

### Profile Fields

| Field | Type | Description |
|-------|------|-------------|
| callsign | string | Player-chosen callsign |
| fleetTitle | string | Display title |
| bio | string | Commander biography (600 chars max) |
| doctrineNotes | string | Strategic doctrine notes |
| race | RaceId | Selected race |
| classId | ClassId | Selected class |
| subClassId | SubClassId | Selected sub-class |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/commanders/profile/me` | Get current profile |
| PUT | `/api/commanders/profile/me` | Update profile fields |

> **Source:** `server/routes-commanders.ts` — Commander Profile routes

---

## Vault & Bank System

Centralized storage for resources, currencies, items, and equipment.

### Vault Components

| Component | Description |
|-----------|-------------|
| Vault | Secure item storage with capacity limits |
| Bank | Currency storage with interest and lending |
| Item Storage | Equipment and consumable storage with tabs |
| Currency Exchange | Convert between currency types |
| Insurance | Protect items from loss |
| Transfer System | Move items between accounts |
| Auction House | Player-to-player trading |
| Storage Upgrades | Expand vault and bank capacity |

### Currency Types

| Currency | Max Storage | Tradeable | Source |
|----------|-------------|-----------|--------|
| Credits | 999,999,999 | Yes | Missions, Trading, Mining |
| Command Seals | 99,999 | No | Daily Login, Achievements, Events |
| Prestige Tokens | 99,999 | No | Battle Victories, Rankings |
| Dark Energy | 99,999 | No | Void Rifts, Expeditions |
| Void Marks | 9,999 | No | Deep Void Expeditions, Legendary Events |

### Currency Exchange Rates (Credits base)

| From | To Credits | From Credits |
|------|------------|--------------|
| Credits | 1x | - |
| Command Seals | 100x | 0.01x |
| Prestige Tokens | 1,000x | 0.001x |
| Dark Energy | 10,000x | 0.0001x |
| Void Marks | 100,000x | 0.00001x |

### Vault Operations

| Operation | Function | Description |
|-----------|----------|-------------|
| Add Item | `addToVault()` | Store items with auto-stacking |
| Remove Item | `removeFromVault()` | Retrieve items (bound check) |
| Deposit Currency | `depositCurrency()` | Bank deposit with capacity check |
| Withdraw Currency | `withdrawCurrency()` | Bank withdrawal |
| Exchange Currency | `exchangeCurrency()` | Convert between types at market rates |
| Purchase Insurance | `purchaseInsurance()` | Protect items for 30 days |
| Upgrade Vault | `upgradeVault()` | Expand capacity (+10 slots per level) |
| Process Interest | `processBankInterest()` | Hourly interest on stored credits |
| Process Loans | `processLoans()` | Loan interest and default penalties |

### Vault Capacity
- **Base**: 50 item slots
- **Per Upgrade**: +10 slots
- **Cost**: 5,000 * 2^(current level) credits

### Insurance
- **Premium**: base_value * rarity_multiplier * 0.1
- **Coverage**: 10x premium amount
- **Duration**: 30 days
- **Rarity Multipliers**: common=1, uncommon=2, rare=4, epic=8, legendary=16, mythic=32

### Transfer System
- **Fee**: 5% of total transferred value
- Includes both item values and currency amounts
- Records full transfer history

> **Source:** `shared/config/commander/vault/commanderBankVault.ts`

---

## Vault & Bank System (Extended)

An expanded vault system with multi-tab storage, resource warehouse, and alliance shared storage.

### Vault Tabs

| Tab | Name | Base Capacity | Max Level | Upgrade Cost Multiplier |
|-----|------|---------------|-----------|------------------------|
| currency | Currency Vault | 100 | 50 | 2.0x |
| resources | Resource Warehouse | 200 | 50 | 1.8x |
| items | Item Storage | 150 | 40 | 2.2x |
| equipment | Equipment Locker | 100 | 30 | 2.5x |
| special | Special Vault | 50 | 20 | 3.0x |
| shared | Alliance Vault | 100 | 30 | 2.0x |

### Extended Currency Types

| Currency | Max Storage | Tradeable | Droppable |
|----------|-------------|-----------|-----------|
| Credits | 999,999,999 | Yes | Yes |
| Dark Matter | 999,999 | No | No |
| Antimatter | 999,999 | No | No |
| Void Shards | 999,999 | Yes | No |
| Stellar Essence | 999,999 | No | No |
| Cosmic Dust | 9,999,999 | Yes | Yes |
| Command Tokens | 99,999 | No | No |
| Prestige Points | 99,999,999 | No | No |

### Resource Types

| Resource | Base Value | Tradeable |
|----------|------------|-----------|
| Metal | 1 | Yes |
| Crystal | 2 | Yes |
| Deuterium | 3 | Yes |
| Plasma | 5 | Yes |
| Titanium | 10 | Yes |
| Quantum Fiber | 15 | Yes |
| Neutronium | 25 | Yes |
| Void Crystal | 50 | No |
| Stellar Alloy | 75 | No |
| Cosmic Alloy | 100 | No |

### Vault Tab Capacity Formula
```
capacity = baseCapacity * 1.5^(level - 1)
```

### Upgrade Cost Formula
```
credits = 10,000 * upgradeCostMultiplier^currentLevel
darkMatter = 5 * currentLevel
```

### Interest System
- **Rate**: 1% per day on stored credits
- Applied hourly, capped at 1 day accumulation
- Full transaction logging

### Insurance
- **Cost**: 1,000 credits per day of coverage
- Protects vault contents from theft events

> **Source:** `shared/config/commander/vault/vaultBankSystem.ts`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/commanders` | Full commander catalog |
| GET | `/api/commanders/gacha/status` | Gacha pull status |
| POST | `/api/commanders/gacha/pull` | Execute gacha pull |
| GET | `/api/commanders/inventory` | Recruited commander roster |
| GET | `/api/commanders/profile/me` | Commander profile |
| PUT | `/api/commanders/profile/me` | Update commander profile |

> **Source:** `server/routes-commanders.ts`

---

## Client Page

### Commander Page (`Commander.tsx`)

The commander page has 11 tabs:

| Tab | Description |
|-----|-------------|
| Profile | Commander stats, equipment slots, government tie-ins, dossier metadata |
| Loadout | Equipment inventory matrix, core/sub stats, attribute scores |
| Skills | Skill point allocation across 4 stat branches |
| Raids | Raid participation stats and role specialization |
| Talent Tree | Browse and unlock talent nodes across 6 branches |
| Gacha | Pull commanders using Command Seals |
| Achievements | Track unlocked milestones |
| Identity | Select race, class, and sub-class |
| Gov Leaders | View and manage government leader appointments |
| Inventory | Browse all owned equipment items |
| Smithy | Craft and temper equipment from blueprints |

### Key Interactions
- **Rename commander**, empire, and home world
- **Equip/unequip** items across 12 equipment slots
- **Allocate skill points** (2 per level)
- **Unlock talent nodes** from the PoE2-style tree
- **Pull gacha** to recruit new commanders to roster
- **Save dossier metadata** (callsign, fleet title, bio, doctrine notes)
- **Select race/class/sub-class** identity with server persistence

> **Source:** `client/src/pages/Commander.tsx`
