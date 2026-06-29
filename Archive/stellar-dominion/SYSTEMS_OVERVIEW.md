# Stellar Dominion - Systems Overview

**Version:** 0.9.0-beta  
**Last Updated:** December 2, 2024

---

## Quick System Reference

### 📊 Empire Progression System
**File:** `shared/config/gameConfig.ts` + `server/storage.ts`

**Features:**
- Empire levels 1-999 with experience tracking
- 21 tier progression levels with bonuses
- Prestige system for hard resets
- Rank progression (S+ to E)
- Combat power calculation
- Milestone achievements
- Experience logging

**API Routes:**
- `GET /api/progression/empire` - Fetch empire level
- `POST /api/progression/empire/add-xp` - Add empire experience
- `GET /api/progression/tier` - Fetch tier level
- `POST /api/progression/tier/add-xp` - Add tier experience

**Database Tables:**
- `player_states` (empireLevel, empireExperience, tier, tierExperience, prestigeLevel)

---

### 💰 Currency System
**File:** `shared/config/currencyConfig.ts` + `server/storage.ts`

**Three-Tier Economy:**
- **Silver** (1x value) - Base currency for everyday transactions
- **Gold** (100x value) - Premium currency for advanced features
- **Platinum** (10,000x value) - Ultra-premium for exclusive items

**Uses (20+):**
- Trading and commerce
- Construction acceleration
- Research speedup
- Equipment purchase
- Alliance management
- Cosmetics and customization
- Battle pass premium
- Premium features
- Espionage theft mechanics
- Dynamic market pricing

**API Routes:**
- `GET /api/currency/balance` - Fetch balances
- `POST /api/currency/add` - Add currency
- `GET /api/currency/transactions` - View transaction history

**Database Tables:**
- `player_currency` (silver, gold, platinum)
- `currency_transactions` (log of all transfers)

---

### 🏦 Bank System
**File:** `server/storage.ts` (methods: getBankAccount, depositToBankAccount, withdrawFromBankAccount)

**Features:**
- Player bank accounts with balances
- Deposit currency with transaction logging
- Withdraw currency with balance checking
- Transaction history tracking
- Compound interest (planned)
- Account statements

**API Routes:**
- `GET /api/bank/account` - Fetch bank account
- `POST /api/bank/deposit` - Deposit currency
- `POST /api/bank/withdraw` - Withdraw currency
- `GET /api/bank/transactions` - View transaction history

**Database Tables:**
- `bank_accounts` (userId, accountBalance, totalDeposited, createdAt, updatedAt)
- `bank_transactions` (detailed transaction log)

---

### 📊 Empire Value & Rankings
**File:** `server/storage.ts` (methods: calculateEmpireValue, getEmpireRankings)

**Calculation Formula:**
```
Total Value = (Metal × 1) + (Crystal × 1.5) + (Deuterium × 2)
            + (Silver × 1) + (Gold × 100) + (Platinum × 10,000)
            + [Buildings/Fleet value estimation]
```

**Features:**
- Real-time empire value calculation
- Leaderboard rankings (top 100)
- Wealth tracking per component
- Value history tracking

**API Routes:**
- `GET /api/empire/value` - Calculate current value
- `GET /api/empire/rankings` - Fetch leaderboards

**Database Tables:**
- `empire_values` (userId, resourceValue, currencyValue, totalValue, updatedAt)

---

### 🧠 Knowledge Library System
**File:** `client/src/pages/KnowledgeLibrary.tsx` + `shared/config/libraryConfig.ts`

**10 Knowledge Types:**
1. **Military** - Combat & warfare tactics (+20% combat efficiency)
2. **Engineering** - Building & construction (+25% build speed)
3. **Science** - Research & discovery (+15% research speed)
4. **Agriculture** - Food & resources (+30% production)
5. **Commerce** - Trading & economy (+25% trade profit)
6. **Diplomacy** - Alliance & negotiation (better treaty terms)
7. **Exploration** - Discovery & expansion (+10% fleet speed)
8. **Arcane** - Magic & mystical arts (special abilities)
9. **Medicine** - Healing & health (+50% unit regeneration)
10. **Espionage** - Spying & intelligence (+40% detection range)

**4 Knowledge Classes (with bonuses):**
- Novice (Levels 1-10, +10% bonus)
- Apprentice (Levels 11-30, +25% bonus)
- Journeyman (Levels 31-50, +50% bonus)
- Expert (Levels 51-100, +100% bonus)

**5 Knowledge Tiers:**
- Foundation Tier (1-100 levels)
- Intermediate Tier (1-100 levels)
- Advanced Tier (1-100 levels)
- Master Tier (1-100 levels)
- Supreme Tier (1-100 levels)

**Total Mastery Points: 2000+** across all knowledge types, classes, and tiers

**Synergies (6 Major Combinations):**
- Military + Engineering = +20% combat building efficiency
- Science + Arcane = +15% research speed
- Commerce + Diplomacy = +25% trade profit
- Exploration + Navigation = +10% fleet speed
- Medicine + Agriculture = +30% population growth
- Espionage + Intelligence = +40% detection range

**API Routes:**
- `GET /api/knowledge/types` - List all knowledge types
- `GET /api/knowledge/progress/:type` - Fetch knowledge progress

**Frontend:**
- KnowledgeLibrary.tsx page with 4 tabs (Types, Classes, Progression, Synergies)

---

### 🏗️ Facilities System
**File:** `shared/config/facilitiesConfig.ts`

**120+ Facilities** organized in 7 categories:
1. **Resource Facilities** (Metal Mine, Crystal Mine, Refinery, etc.)
2. **Energy Facilities** (Solar Power Plant, Nuclear Reactor, etc.)
3. **Storage Facilities** (Storage Tank, Crystal Storage, etc.)
4. **Military Facilities** (Barracks, Shipyard, Weapons Factory, etc.)
5. **Research Facilities** (Laboratory, Tech Center, etc.)
6. **Civilian Facilities** (Residential, Market, Bank, etc.)
7. **Special Facilities** (Megastructures, Starbase, etc.)

**Features:**
- Multi-tier facility levels
- Production bonuses
- Resource costs
- Time requirements
- Research prerequisites

**API Routes:**
- `GET /api/facilities/types` - List facility types

---

### ⚔️ Combat System
**File:** `shared/config/combatConfig.ts`

**Combat Formations (5 Types):**
1. **Balanced** (1.0x bonus) - Uniform offense & defense
2. **Aggressive** (1.5x bonus) - +40% offense, -20% defense
3. **Defensive** (0.7x bonus) - +50% defense, -30% offense
4. **Flanking** (1.8x bonus) - +80% offense, -40% defense
5. **Pincer** (2.0x bonus) - +100% offense, -30% defense

**Multi-Layer Damage:**
- Shield layer (reduces damage)
- Armor layer (reduces penetrating damage)
- Hull layer (structural integrity)

**Mechanics:**
- Evasion and accuracy calculations
- Weapon effectiveness vs unit types
- Target prioritization
- Casualty tracking
- Detailed battle logs

**API Routes:**
- `GET /api/combat/formations` - List formations

---

### 🎯 Inventory & Items
**File:** `shared/config/itemsConfig.ts` + `shared/schema.ts`

**1000+ Item Types** planned across:
- Equipment (weapons, armor, tools)
- Consumables (food, potions, fuel)
- Artifacts (relics with special effects)
- Cosmetics (skins, colors, effects)
- Blueprints (building/research unlocks)

**Rarity Tiers:**
- Common
- Uncommon
- Rare
- Epic
- Legendary

**API Routes:**
- `GET /api/inventory` - Fetch player items

---

### 📋 Database Schema Summary

**Key Tables:**
- `users` - Player accounts
- `player_states` - Game state (resources, buildings, units, progression)
- `player_currency` - Currency balances
- `currency_transactions` - Transaction log
- `bank_accounts` - Bank account info
- `bank_transactions` - Bank transaction log
- `empire_values` - Empire value tracking
- `playerItems` - Inventory
- `missions`, `expeditions`, `alliances`, `battles` - Game activities
- `research_progress`, `building_durability` - Game mechanics
- `sessions` - User sessions (PostgreSQL)

---

### 🎨 Frontend Pages (53 Total)

**Key Pages:**
- `TechTree.tsx` - Technology tree with 120+ facilities, tiers, formations
- `KnowledgeLibrary.tsx` - Knowledge mastery system
- `EmpireProgression.tsx` - Empire level and tier tracking
- `Resources.tsx` - Resource management
- `Facilities.tsx` - Building management
- `Fleet.tsx` - Fleet composition
- `Combat.tsx` - Battle interface
- `Alliance.tsx` - Alliance management
- `Market.tsx` - Trading system
- `Admin.tsx` - Admin panel

**Common Layout:**
- GameLayout wrapper
- Modern dashboard styling
- White backgrounds, slate borders
- Font-Orbitron (titles) + Font-Rajdhani (body)
- Light/dark mode support
- Responsive grid layouts

---

## Configuration Files (22 Total)

All game mechanics are configurable via YAML-like TypeScript configs:

| File | Purpose | Exports |
|------|---------|---------|
| `gameConfig.ts` | Core game mechanics | Resources, buildings, costs, rates |
| `facilitiesConfig.ts` | 120+ facilities | Types, levels, bonuses, costs |
| `combatConfig.ts` | Combat mechanics | Damage, formations, units |
| `libraryConfig.ts` | Knowledge system | Types, classes, tiers |
| `currencyConfig.ts` | Currency system | Conversion rates, uses |
| `unitConfig.ts` | Unit system | Types, classes, costs |
| `universeConfig.ts` | Universe generation | Star types, planet classes |
| `achievementsConfig.ts` | Achievements | Milestones, rewards |
| `itemsConfig.ts` | Item database | 1000+ items, rarities |
| ... and 13 more | ... | ... |

---

## API Endpoint Summary

**Total API Routes:** 40+

| Category | Count | Examples |
|----------|-------|----------|
| Authentication | 3 | register, login, logout |
| Player State | 2 | getState, setup |
| Progression | 4 | tier/empire XP management |
| Currency | 3 | balance, add, transactions |
| Bank | 4 | account, deposit, withdraw, transactions |
| Empire Value | 2 | calculate, rankings |
| Knowledge | 2 | types, progress |
| Facilities | 1 | types |
| Combat | 1 | formations |
| Inventory | 1 | items |
| Missions | 2 | list, complete |
| Alliances | 2+ | list, create, join |
| Market | 2+ | orders, trading |
| ... more | ... | expeditions, research, battles, etc. |

---

## Performance Metrics

**Frontend:**
- 53 pages bundled (~2.5MB gzipped)
- React Query for caching & sync
- Virtualization for long lists
- Lazy loading for pages

**Backend:**
- Express.js + Node.js
- PostgreSQL connection pooling
- Drizzle ORM with query optimization
- Session storage in PostgreSQL
- Rate limiting: 60 req/min per user

**Database:**
- Neon serverless PostgreSQL
- 50+ tables
- Denormalized schema for performance
- JSONB columns for complex data
- Indexes on frequently queried columns

---

## Future Roadmap

- [ ] Real-time websocket updates for battles
- [ ] Story mode campaign (12 acts)
- [ ] Guild raid system
- [ ] NPC merchant system
- [ ] Celestial browsing with 3D graphics
- [ ] Universe events and boss encounters
- [ ] Advanced trading with smart contracts
- [ ] Mobile app support
- [ ] Leaderboard statistics and filters
- [ ] Replay system for battles
