# Economy & Resources

The backbone of any stellar empire is its economy. Universe Empire Dominion uses a multi-layered economy system spanning resource production, market trading, banking, currency exchange, and a full storefront for premium purchases.

## Table of Contents

- [Core Resources](#core-resources)
- [Resource Production System](#resource-production-system)
- [Building System](#building-system)
- [Market & Trading System](#market--trading-system)
- [Bank Vault System](#bank-vault-system)
- [Auto-Buy Resources](#auto-buy-resources)
- [Currency System](#currency-system)
- [Device Prices](#device-prices)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Client-Side Economy Pages](#client-side-economy-pages)

---

## Core Resources

The game uses four primary resources. Each has a base price, production rate, storage limit, and market delta that controls price volatility.

> **Source:** `shared/config/economy/resourceSettings.ts`

| Resource | Base Price | Market Delta | Production Rate | Storage Limit | Production Multiplier |
|----------|-----------|-------------|-----------------|---------------|----------------------|
| **Metal** | 11 | 5 | 75,000 | 500,000,000 | 0.25 |
| **Crystal** | 5 | 2 | 5,000 | 500,000,000 | 0.50 |
| **Deuterium** | 15 | 7 | 75,000 | 500,000,000 | 0.25 |
| **Energy** | 3 | 1 | 75,000 | 5,000,000,000 | 0.50 |

**Resource Descriptions:**
- **Metal** -- Primary construction material for structures, ship hulls, and armor. High abundance, mined via Metal Mine.
- **Crystal** -- Used for electronics, research, energy weapons, and shields. Medium abundance, mined via Crystal Mine.
- **Deuterium** -- Fuel for ships, research, and fusion reactors. Low abundance (hard to refine), produced by Deuterium Synthesizer.
- **Energy** -- Powers all mines and synthesizers. Produced by Solar Plant, Fusion Reactor, and Solar Satellites. If energy balance goes negative, production of all other resources drops in efficiency.

---

## Resource Production System

### Base Production Rates (per second)

> **Source:** `shared/config/gameConfig.ts`

```typescript
resources: {
  metalPerSecond: 0.1,
  crystalPerSecond: 0.05,
  deuteriumPerSecond: 0.02,
  energyPerSecond: 0.15,
}
```

### Production Calculation

> **Source:** `server/gameEngine.ts` -- `calculateProduction()`

Production per hour is calculated using building levels and research bonuses:

```
Metal  = floor(30 * metalMineLevel * (1 + metalMineLevel / 10))
Crystal = floor(20 * crystalMineLevel * (1 + crystalMineLevel / 10))
Deuterium = floor(10 * deuteriumSynthesizerLevel * (1 + deuteriumSynthesizerLevel / 12))
Energy = floor(20 + energyTech * 5)
```

### Resource Tick Processing

> **Source:** `server/gameEngine.ts` -- `processResourceTick()`

The game engine processes resource production asynchronously:

1. Loads the player's buildings and research levels
2. Calculates elapsed time since last update
3. Computes production based on `calculateProduction()`
4. Adds produced resources to current stockpile
5. Persists updated resource state and timestamp

```typescript
// Simplified resource tick
const elapsedHours = (Date.now() - lastResourceUpdate) / 3600000;
const produced = {
  metal: floor(productionPerHour.metal * elapsedHours),
  crystal: floor(productionPerHour.crystal * elapsedHours),
  deuterium: floor(productionPerHour.deuterium * elapsedHours),
};
```

### Client-Side Resource Math

> **Source:** `client/src/lib/resourceMath.ts`

The client mirrors server production calculations for real-time display:

```typescript
calculateMineProductionPerHour(level, baseRate, scalingDivisor, bonusMultiplier)
// = floor(baseRate * level * (1 + level / scalingDivisor) * bonusMultiplier)

calculateSolarEnergyPerHour(level)
// = floor(20 * level * (1 + level / 10))
```

Energy balance accounts for consumption from mines:

```
energyConsumption = (metalMineLevel * 10) + (crystalMineLevel * 10) + (deuteriumLevel * 20)
netEnergy = energyProduction - energyConsumption
```

### Difficulty Multipliers

> **Source:** `shared/config/gameConfig.ts` -- `empireDifficulty`

| Difficulty | Resource Multiplier | Combat Multiplier | Research Multiplier |
|-----------|--------------------|-------------------|---------------------|
| Peaceful | 1.5x | 0.3x | 0.8x |
| Easy | 1.3x | 0.5x | 0.9x |
| Normal | 1.0x | 1.0x | 1.0x |
| Hard | 0.8x | 1.5x | 1.1x |
| Extreme | 0.6x | 2.0x | 1.3x |
| Impossible | 0.4x | 3.0x | 1.5x |

---

## Building System

### Building Costs

> **Source:** `server/gameEngine.ts` -- `BUILDING_COSTS`

| Building | Metal | Crystal | Deuterium |
|----------|-------|---------|-----------|
| Metal Mine | 60 | 15 | 0 |
| Crystal Mine | 48 | 24 | 0 |
| Deuterium Synthesizer | 225 | 75 | 0 |
| Solar Plant | 75 | 30 | 0 |
| Robotics Factory | 400 | 120 | 200 |
| Shipyard | 400 | 200 | 100 |

> **Source:** `shared/config/gameConfig.ts` -- `GAME_CONFIG.buildings`

### Cost Scaling

> **Source:** `server/gameEngine.ts` -- `calculateBuildingCost()`

Building costs scale exponentially with each level upgrade:

```
cost = floor(baseCost * 1.15^currentLevel)
```

### Build Time Calculation

> **Source:** `server/gameEngine.ts` -- `calculateBuildTime()`

```
buildTimeSeconds = max(1, ceil(totalCost / (2500 * (1 + roboticsFactoryLevel))))
```

The Robotics Factory level reduces build time proportionally.

### Construction Queue

> **Source:** `server/gameEngine.ts` -- `processConstructionQueue()`

- Maximum 5 buildings in queue simultaneously
- Buildings are processed when their `completeAt` timestamp is reached
- Completed buildings automatically increment the building level

---

## Market & Trading System

The game features three distinct trading systems: resource trading, player-to-player trade offers, and an auction house.

### Resource Trading (Market Orders)

> **Source:** `server/routes-resource-trading.ts`

**Trading Configuration:**

| Parameter | Value |
|-----------|-------|
| Trade Tax Rate | 5% |
| Min Trade Amount | 10 |
| Max Trade Amount | 100,000 |
| Tradeable Resources | Metal, Crystal, Deuterium |

**Order Matching Logic:**

Orders are automatically matched when prices overlap:
- Buy orders match sell orders where `sellPrice <= buyPrice`
- Sell orders match buy orders where `buyPrice >= sellPrice`
- Partial fills are supported

**Order Statuses:** `open`, `filled`, `cancelled`, `partial`

### Trade Offers (Player-to-Player)

> **Source:** `shared/schema.ts` -- `tradeOffers`, `tradeHistory`

Direct player-to-player trading with mail integration:

- Each offer specifies offered resources/items and requested resources/items
- Supports counter-offers and negotiation
- Messages can accompany trade offers
- Status tracking: `pending`, `accepted`, `declined`, `cancelled`, `expired`, `countered`

### Research Trading

> **Source:** `server/routes-trading.ts`

Player-to-player trading of research technologies with:
- Trade request creation and management
- Trade validation and simulation
- Player rating system
- Dispute resolution
- Blocked player lists

### Auction House

> **Source:** `shared/schema.ts` -- `auctionListings`, `auctionBids`

Player-to-player auction system for items:

- Listings support equipment, materials, resources, blueprints, and artifacts
- Rarity tiers: `common`, `uncommon`, `rare`, `epic`, `legendary`
- Supports starting price, buyout price, and bid increments
- Configurable duration: 6, 12, 24, 48, or 72 hours
- Bidding system with minimum increment enforcement

---

## Bank Vault System

> **Source:** `server/routes-bank-vault.ts`
> **Source:** `shared/config/commander/vault/commanderBankVault.ts`

The Commander Bank & Vault provides centralized storage for resources, equipment, items, and currencies.

### Components

1. **Vault** -- Secure item storage with capacity limits
2. **Bank** -- Resource storage with interest and lending
3. **Item Storage** -- Equipment and consumable storage
4. **Currency Exchange** -- Convert between currencies
5. **Insurance** -- Protect items from loss
6. **Transfer System** -- Move items between accounts
7. **Storage Upgrades** -- Expand vault and bank capacity

### Bank Currencies

| Currency | Description | Max Storage | Exchange Rate |
|----------|-------------|-------------|---------------|
| Credits | Standard galactic currency | 999,999,999 | 1.0 |
| Command Seals | Gacha pulls and commander recruitment | 99,999 | 100 credits |
| Prestige Tokens | High-ranking battle victories | 99,999 | 1,000 credits |
| Dark Energy | Exotic currency from void rifts | 99,999 | 10,000 credits |
| Void Marks | Deepest void exploration | 9,999 | 100,000 credits |

### Bank Configuration

> **Source:** `shared/config/economy/resourceSettings.ts`

| Parameter | Value |
|-----------|-------|
| Interest Rate | 0.015% per tick |
| Payment Fee | 5% |
| Loan Interest | 0.10% per tick |
| Loan Factor | 10% |
| Loan Limit | 25% of deposits |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bank-vault/status` | GET | Full bank/vault state |
| `/api/bank-vault/currencies` | GET | Currency balances |
| `/api/bank-vault/vault` | GET | Vault items by tab |
| `/api/bank-vault/vault/add` | POST | Add item to vault |
| `/api/bank-vault/vault/remove` | POST | Remove item from vault |
| `/api/bank-vault/deposit` | POST | Deposit currency |
| `/api/bank-vault/withdraw` | POST | Withdraw currency |
| `/api/bank-vault/exchange` | POST | Exchange currencies |
| `/api/bank-vault/insurance` | POST | Purchase insurance |
| `/api/bank-vault/upgrade-vault` | POST | Upgrade vault capacity |
| `/api/bank-vault/stats` | GET | Bank statistics |

---

## Auto-Buy Resources

> **Source:** `server/routes-autobuyresources.ts`

Automated resource purchasing system with rule-based execution.

### Features

- **Session Management** -- Initialize, pause, and resume auto-buy sessions
- **Rule System** -- Create, update, delete, and toggle auto-buy rules
- **Manual Purchases** -- Execute one-off purchases with price limits
- **Market Analysis** -- Get resource market analysis by resource type
- **Seller Profiles** -- View seller reputation and history
- **Statistics & History** -- Track purchase statistics and history
- **Resource Limits** -- Set maximum purchase limits
- **Alerts** -- Active alerts for price changes
- **Recommendations** -- AI-suggested purchases
- **Simulation** -- Simulate purchases over a period

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/autobuy/session/initialize` | POST | Initialize session |
| `/api/autobuy/session` | GET | Get session state |
| `/api/autobuy/session/pause` | POST | Pause session |
| `/api/autobuy/session/resume` | POST | Resume session |
| `/api/autobuy/rules/create` | POST | Create rule |
| `/api/autobuy/rules` | GET | Get all rules |
| `/api/autobuy/rules/:ruleId` | PUT | Update rule |
| `/api/autobuy/rules/:ruleId` | DELETE | Delete rule |
| `/api/autobuy/rules/:ruleId/toggle` | POST | Toggle rule |
| `/api/autobuy/purchase` | POST | Manual purchase |
| `/api/autobuy/market/:resource` | GET | Market analysis |
| `/api/autobuy/statistics` | GET | Purchase statistics |
| `/api/autobuy/history` | GET | Purchase history |
| `/api/autobuy/limits` | POST | Set resource limits |
| `/api/autobuy/alerts` | GET | Active alerts |
| `/api/autobuy/recommendations` | GET | Recommended purchases |
| `/api/autobuy/simulate` | GET | Simulate purchases |

---

## Currency System

> **Source:** `shared/config/currencyConfig.ts`

### Currency Types

| Currency | Symbol | Rarity | Exchange Rate | Use Cases |
|----------|--------|--------|---------------|-----------|
| **Gold** | Au | Common | 1.0 (base) | Trading, transactions, construction acceleration, equipment, repairs |
| **Silver** | Ag | Common | 0.1 (10 Silver = 1 Gold) | Small transactions, trading |
| **Platinum** | Pt | Rare | 10.0 (1 Platinum = 10 Gold) | Premium features, cosmetics, battle pass, alliance management |

### Conversion Rates

```
1 Platinum = 10 Gold
10 Silver  = 1 Gold
```

### Currency Uses

| Use | Currencies | Fee/Bonus |
|-----|-----------|-----------|
| Trading | Gold, Silver | 2% conversion bonus |
| Player Transactions | Gold, Platinum | 1% transaction fee |
| NPC Purchases | Gold, Silver, Platinum | 5% volume discount |
| Construction Acceleration | Platinum | 1 Pt/hour |
| Research Acceleration | Platinum | 1 Pt/hour |
| Alliance Management | Platinum | 100 Pt creation, 10 Pt/day maintenance |
| Cosmetics | Platinum | 50 Pt per skin |
| Battle Pass | Platinum | 100 Pt per season |
| Auction House | Gold | 5% listing fee, 10% sale fee |
| Equipment Repair | Gold | 10 Gold per durability point |

### Wealth Limits

| Currency | Max Per Player | Daily Earning Cap |
|----------|---------------|-------------------|
| Gold | 9,999,999 | 100,000 |
| Silver | 99,999,999 | -- |
| Platinum | 999,999 | -- |

---

## Device Prices

> **Source:** `shared/config/economy/devicePrices.ts`

Special devices and equipment with fixed costs:

| Device | Price (Credits) |
|--------|----------------|
| Dev Genesis | 100,000,000 |
| Dev Beacon | 100 |
| Dev Emergency Warp | 100,000,000 |
| Dev Warp Edit | 100,000 |
| Dev Mine Deflector | 10 |
| Dev Escape Pod | 100,000 |
| Dev Fuel Scoop | 100,000 |

---

## API Endpoints

### Resource Trading

> **Source:** `server/routes-resource-trading.ts`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resource-trading/market` | GET | Current market data |
| `/api/resource-trading/place-order` | POST | Place buy/sell order |
| `/api/resource-trading/cancel-order` | POST | Cancel an order |
| `/api/resource-trading/my-orders` | GET | Player's orders |
| `/api/resource-trading/open-orders` | GET | All open market orders |
| `/api/resource-trading/history` | GET | Trade history |

### Research Trading

> **Source:** `server/routes-trading.ts`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trading/request/create` | POST | Create trade request |
| `/api/trading/active` | GET | Active trades |
| `/api/trading/:tradeId` | GET | Get specific trade |
| `/api/trading/:tradeId/accept` | POST | Accept trade |
| `/api/trading/:tradeId/reject` | POST | Reject trade |
| `/api/trading/:tradeId/cancel` | POST | Cancel trade |
| `/api/trading/:tradeId/settle` | POST | Settle trade |
| `/api/trading/history` | GET | Trade history |
| `/api/trading/rating/:playerId` | GET | Player trade rating |
| `/api/trading/statistics` | GET | Trade statistics |
| `/api/trading/:tradeId/offer` | PUT | Update offer |
| `/api/trading/marketplace` | GET | Marketplace trades |
| `/api/trading/search` | GET | Search marketplace |
| `/api/trading/validate` | POST | Validate trade value |
| `/api/trading/recommendations` | GET | Trade recommendations |
| `/api/trading/simulate` | POST | Simulate trade outcome |
| `/api/trading/:tradeId/dispute` | POST | Start dispute |
| `/api/trading/player/:playerId/rate` | POST | Rate trade partner |
| `/api/trading/player/:playerId/block` | POST | Block player |
| `/api/trading/blocked` | GET | Blocked players |
| `/api/trading/pending` | GET | Pending trades |
| `/api/trading/accept-bulk` | POST | Accept bulk trades |
| `/api/trading/eligible` | GET | Player eligibility |
| `/api/trading/available-research` | GET | Available research for trading |

---

## Database Schema

> **Source:** `shared/schema.ts`

### Market Orders

```sql
market_orders
  id              VARCHAR (PK)
  user_id         VARCHAR (FK -> users)
  type            VARCHAR ("buy" | "sell")
  resource        VARCHAR ("metal" | "crystal" | "deuterium")
  amount          INTEGER
  price_per_unit  REAL
  status          VARCHAR ("active" | "completed" | "cancelled")
  created_at      TIMESTAMP
  completed_at    TIMESTAMP
```

### Auction Listings

```sql
auction_listings
  id                VARCHAR (PK)
  seller_id         VARCHAR (FK -> users)
  seller_name       VARCHAR
  item_type         VARCHAR ("equipment" | "material" | "resource" | "blueprint" | "artifact")
  item_id           VARCHAR
  item_name         VARCHAR
  item_description  TEXT
  item_rarity       VARCHAR ("common" | "uncommon" | "rare" | "epic" | "legendary")
  item_data         JSONB
  quantity          INTEGER
  starting_price    INTEGER
  buyout_price      INTEGER
  current_bid       INTEGER
  bid_increment     INTEGER
  current_bidder_id VARCHAR (FK -> users)
  current_bidder_name VARCHAR
  bid_count         INTEGER
  duration          INTEGER (hours)
  expires_at        TIMESTAMP
  status            VARCHAR ("active" | "sold" | "expired" | "cancelled")
  created_at        TIMESTAMP
  completed_at      TIMESTAMP
```

### Auction Bids

```sql
auction_bids
  id           VARCHAR (PK)
  auction_id   VARCHAR (FK -> auction_listings)
  bidder_id    VARCHAR (FK -> users)
  bidder_name  VARCHAR
  bid_amount   INTEGER
  created_at   TIMESTAMP
```

### Trade Offers

```sql
trade_offers
  id                VARCHAR (PK)
  sender_id         VARCHAR (FK -> users)
  sender_name       VARCHAR
  receiver_id       VARCHAR (FK -> users)
  receiver_name     VARCHAR
  offer_metal       INTEGER
  offer_crystal     INTEGER
  offer_deuterium   INTEGER
  offer_items       JSONB
  request_metal     INTEGER
  request_crystal   INTEGER
  request_deuterium INTEGER
  request_items     JSONB
  message           TEXT
  status            VARCHAR ("pending" | "accepted" | "declined" | "cancelled" | "expired" | "countered")
  sender_message_id    VARCHAR
  receiver_message_id  VARCHAR
  counter_offer_id     VARCHAR
  original_offer_id    VARCHAR
  expires_at        TIMESTAMP
  created_at        TIMESTAMP
  updated_at        TIMESTAMP
  completed_at      TIMESTAMP
```

### Trade History

```sql
trade_history
  id             VARCHAR (PK)
  trade_offer_id VARCHAR
  sender_id      VARCHAR
  sender_name    VARCHAR
  receiver_id    VARCHAR
  receiver_name  VARCHAR
  sender_gave    JSONB
  receiver_gave  JSONB
  result         VARCHAR ("completed" | "cancelled" | "expired")
  completed_at   TIMESTAMP
```

### Bank & Currency Tables

> **Source:** `shared/schema.ts`

Bank accounts, transactions, and player currency balances are stored in the player state JSONB fields (`resources`, `travelState`, etc.) and managed through the bank vault routes.

---

## Client-Side Economy Pages

### Resources Page

> **Source:** `client/src/pages/Resources.tsx`

Displays and manages resource production infrastructure:

- **Resource Overview** -- Metal, Crystal, Deuterium, and Energy stats with production rates and storage capacity
- **Building Cards** -- Upgrade Metal Mine, Crystal Mine, Deuterium Synthesizer, and Solar Plant
- **Resource Projections** -- 1-hour, 6-hour, and 24-hour production forecasts
- **Construction Queue** -- Active building upgrades with countdown timers
- **Refinery Systems** -- Metal Refinery, Crystal Purification Grid, and Deuterium Fractionation Line
- **Storage Facilities** -- Visual storage capacity meters for each resource

### Market Page

> **Source:** `client/src/pages/Market.tsx`

Full-featured trading interface with tabs:

- **Marketplace** -- Buy/sell items from NPC vendors (Official, Scientist, Black Market)
- **Auction House** -- Player-to-player auctions with bidding, buyout, and listing creation
- **Resource Exchange** -- Convert between Metal, Crystal, and Deuterium (10% fee)
- **Player Orders** -- View and manage market orders
- **Trade History** -- Recent trade history
- **Price Trends** -- Market price trend analysis

### Storefront Page

> **Source:** `client/src/pages/Storefront.tsx`

Premium store for boosters, cosmetics, resources, and bundles:

- **Wallet** -- Silver, Gold, and Platinum balances
- **Categories** -- All, Boosters, Cosmetics, Resources, Bundles
- **Checkout Preview** -- Review totals and affordability before purchasing
- **Quantity Selector** -- Bulk purchase support (1-99 items)
- **Strategy Guide** -- Recommended spending cadence for efficient progression

---

## Resource Loop Diagram

```
Mines ──────────> Raw Resources ──────────> Storage
  │                                          │
  ├── Solar Plant (Power)                    ├── Construction (Buildings)
  │                                          ├── Fabrication (Ships/Defense)
  │                                          └── Research (Technology)
  │
Market <──────────> Trade <──────────> Resources
  │
Combat Loot ───────> Plunder ───────> Resources
```

---

## Summary

The economy system in Universe Empire Dominion is a complex, interconnected web of production, trading, banking, and premium currencies. Key balance points include:

- **Resource scarcity** controlled by production multipliers and storage limits
- **Market dynamics** driven by player-to-player trading with tax fees
- **Progression gates** through exponential building cost scaling
- **Premium monetization** via Platinum currency for accelerators and cosmetics
- **Strategic depth** through multiple currency tiers and exchange rates
