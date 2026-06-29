# Galactic Market

The galactic market system encompasses resource trading, player-to-player exchange, auction houses, research trading, and a premium storefront. It supports both NPC vendor transactions and full player-driven order matching.

> **Source:** `server/routes-resource-trading.ts`
> **Source:** `server/routes-trading.ts`
> **Source:** `shared/schema.ts`
> **Source:** `client/src/pages/Market.tsx`
> **Source:** `client/src/pages/Storefront.tsx`
> **Source:** `client/src/lib/marketData.ts`
> **Source:** `shared/config/economy/resourceSettings.ts`
> **Source:** `shared/config/economy/devicePrices.ts`

---

## System Architecture

The market is split into several subsystems:

| Subsystem | Scope | Location |
|-----------|-------|----------|
| NPC Marketplace | Buy/sell items from vendors | `Market.tsx` — Marketplace tab |
| Resource Trading | Player-to-player resource orders | `routes-resource-trading.ts` |
| Research Trading | Player-to-player research deals | `routes-trading.ts` |
| Auction House | Timed bid/buyout listings | `Market.tsx` — Auction House tab |
| Resource Exchange | Convert between resource types | `Market.tsx` — Exchange tab |
| Price Trends | Market history and analytics | `Market.tsx` — Price Trends tab |
| Storefront | Premium currency purchases | `Storefront.tsx` |

---

## NPC Vendors

Three vendor archetypes offer different item categories:

| Vendor | Type | Specialty | Inventory |
|--------|------|-----------|-----------|
| Foreman Jaxon | Official Industrial | Construction Materials | Plasteel, Nanofiber, Quantum Circuit |
| Dr. Aris Thorne | Scientific | High-Tech Components | Quantum Circuit, Fusion Core, AI Targeting Matrix, Nanofiber |
| The Broker | Black Market | Contraband & Rare Tech | Override Chip, Combat Stims, Precursor Relic, Dark Matter, Fusion Core |

### Market Items

| Item | Type | Rarity | Metal | Crystal | Deuterium |
|------|------|--------|-------|---------|-----------|
| Reinforced Plasteel | Material | Common | 500 | 0 | 0 |
| Carbon Nanofiber | Material | Uncommon | 200 | 300 | 0 |
| Quantum Circuit | Component | Common | 100 | 400 | 50 |
| Micro-Fusion Core | Component | Rare | 1,000 | 1,000 | 500 |
| AI Targeting Matrix | Component | Uncommon | 500 | 800 | 200 |
| Decrypted Override Chip | Commodity | Contraband | 0 | 5,000 | 2,000 |
| Combat Stims | Commodity | Contraband | 0 | 1,000 | 1,000 |
| Precursor Relic | Commodity | Legendary | 50,000 | 50,000 | 50,000 |
| Stabilized Dark Matter | Material | Rare | 0 | 0 | 10,000 |

### Buy/Sell Mechanics
- **Buy**: Pay listed price in metal/crystal/deuterium
- **Sell**: Receive 50% of base price (50% liquidity discount)
- Items are categorized by rarity: common, uncommon, rare, legendary, contraband

> **Source:** `client/src/lib/marketData.ts` — `MARKET_ITEMS[]`, `VENDORS[]`

---

## Resource Trading (Player-to-Player)

Full order-book style trading for metal, crystal, and deuterium.

### Trading Configuration

| Parameter | Value |
|-----------|-------|
| Trade Tax Rate | 5% per transaction |
| Minimum Trade Amount | 10 units |
| Maximum Trade Amount | 100,000 units |
| Tradeable Resources | metal, crystal, deuterium |

### Order Types
- **Buy Order**: Player offers to buy resources at a specified price per unit
- **Sell Order**: Player offers to sell resources at a specified price per unit

### Order Matching
Orders are matched automatically when a new order is placed:
- **Buy matches Sell**: When sell price <= buy price
- **Sell matches Buy**: When buy price >= sell price
- Matches execute at the resting order's price
- Partial fills are supported; unfilled quantity remains open

### Order States
| Status | Description |
|--------|-------------|
| `open` | Active order awaiting matches |
| `filled` | Fully matched and executed |
| `partial` | Partially matched, remainder still open |
| `cancelled` | Player cancelled before full fill |

### Market Data
The market data endpoint aggregates all open orders per resource:
```json
{
  "metal": {
    "lastPrice": 100,
    "buyOrders": 5,
    "sellOrders": 3,
    "highestBid": 105,
    "lowestAsk": 98,
    "volume24h": 15000,
    "spreadPercentage": "2.10"
  }
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resource-trading/market` | Current market data per resource |
| POST | `/api/resource-trading/place-order` | Place a buy or sell order |
| POST | `/api/resource-trading/cancel-order` | Cancel an open order |
| GET | `/api/resource-trading/my-orders` | Get current player's orders |
| GET | `/api/resource-trading/open-orders` | Get all open orders (filterable) |
| GET | `/api/resource-trading/history` | Get player's filled trade history |

### Place Order Request
```json
{
  "type": "buy",
  "resource": "metal",
  "quantity": 5000,
  "pricePerUnit": 12
}
```

> **Source:** `server/routes-resource-trading.ts`

---

## Research Trading

Player-to-player trading of research technologies and discoveries.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trading/request/create` | Create a new trade request |
| GET | `/api/trading/active` | Get all active trades for user |
| GET | `/api/trading/:tradeId` | Get specific trade details |
| POST | `/api/trading/:tradeId/accept` | Accept a trade request |
| POST | `/api/trading/:tradeId/reject` | Reject a trade request |
| POST | `/api/trading/:tradeId/cancel` | Cancel a trade request |
| POST | `/api/trading/:tradeId/settle` | Complete trade settlement |
| GET | `/api/trading/history` | Get trade history |
| GET | `/api/trading/rating/:playerId` | Get player trade rating |
| GET | `/api/trading/statistics` | Get trade statistics |
| PUT | `/api/trading/:tradeId/offer` | Update trade offer |
| GET | `/api/trading/marketplace` | Browse marketplace trades |
| GET | `/api/trading/search` | Search by player or research type |
| POST | `/api/trading/validate` | Validate trade value fairness |
| GET | `/api/trading/recommendations` | Get personalized trade recommendations |
| POST | `/api/trading/simulate` | Simulate trade outcome |
| POST | `/api/trading/:tradeId/dispute` | Start a trade dispute |
| POST | `/api/trading/player/:playerId/rate` | Rate a trade partner |
| POST | `/api/trading/player/:playerId/block` | Block a player from trading |
| GET | `/api/trading/blocked` | Get blocked players list |
| GET | `/api/trading/pending` | Get pending trades requiring action |
| POST | `/api/trading/accept-bulk` | Accept multiple trades at once |
| GET | `/api/trading/eligible` | Validate player trading eligibility |
| GET | `/api/trading/available-research` | Get research available for trade |

> **Source:** `server/routes-trading.ts`

---

## Auction House

Timed player-to-player item auctions with bidding and buyout.

### Listing Properties

| Field | Description |
|-------|-------------|
| Item Type | equipment, material, resource, blueprint, artifact |
| Rarity | common, uncommon, rare, epic, legendary |
| Starting Price | Minimum opening bid |
| Buyout Price | Optional instant-purchase price |
| Bid Increment | Minimum increase for new bids |
| Duration | 6, 12, 24, 48, or 72 hours |
| Status | active, sold, expired, cancelled |

### Auction Mechanics
- Players create listings with a starting price and optional buyout
- Other players place bids (minimum = current bid + increment)
- Highest bidder when timer expires wins the item
- Buyout immediately completes the auction
- Seller's own listings are marked "Your Listing"
- Expired auctions show "Auction Ended"

### Filtering & Sorting
- **Search**: Text search across item names
- **Item Type Filter**: All, Equipment, Materials, Resources, Blueprints, Artifacts
- **Sort**: Newest, Ending Soon, Price Low-High, Price High-Low

### API Endpoints (via Market page)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auctions` | List active auctions |
| POST | `/api/auctions` | Create new auction listing |
| POST | `/api/auctions/:id/bid` | Place a bid |
| POST | `/api/auctions/:id/buyout` | Execute buyout |
| GET | `/api/auctions/user/listings` | Get current player's listings |
| GET | `/api/auctions/user/bids` | Get current player's active bids |

> **Source:** `client/src/pages/Market.tsx` — `AuctionHouseContent`

---

## Resource Exchange

Convert between metal, crystal, and deuterium at market rates.

- **Fee**: 10% conversion fee on all exchanges
- **Direction**: Select source and target resource
- **Amount**: Enter quantity to convert
- **Rates**: Determined by server-side market calculation

The exchange uses a mutation endpoint:
```
POST /api/market/exchange
{ from: "metal", to: "crystal", amount: 1000 }
```

Returns converted amount after fee deduction.

> **Source:** `client/src/pages/Market.tsx` — Exchange tab

---

## Database Schema

### Market Orders Table (`market_orders`)

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Unique order ID |
| user_id | varchar (FK) | Owner player |
| type | varchar | "buy" or "sell" |
| resource | varchar | "metal", "crystal", "deuterium" |
| amount | integer | Resource quantity |
| price_per_unit | real | Price per unit |
| status | varchar | "active", "completed", "cancelled" |
| created_at | timestamp | Order creation time |
| completed_at | timestamp | Fill completion time |

### Auction Listings Table (`auction_listings`)

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Unique listing ID |
| seller_id | varchar (FK) | Seller player |
| seller_name | varchar | Display name |
| item_type | varchar | "equipment", "material", "resource", "blueprint", "artifact" |
| item_id | varchar | Item identifier |
| item_name | varchar | Display name |
| item_rarity | varchar | "common" through "legendary" |
| quantity | integer | Stack count |
| starting_price | integer | Opening bid |
| buyout_price | integer | Optional instant-buy |
| current_bid | integer | Highest bid |
| bid_increment | integer | Minimum bid increase |
| duration | integer | Hours |
| expires_at | timestamp | Auction end time |
| status | varchar | "active", "sold", "expired", "cancelled" |

### Auction Bids Table (`auction_bids`)

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Bid ID |
| auction_id | varchar (FK) | Parent listing |
| bidder_id | varchar (FK) | Bidder player |
| bidder_name | varchar | Display name |
| bid_amount | integer | Bid value |
| created_at | timestamp | Bid time |

### Trade Offers Table (`trade_offers`)

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Offer ID |
| sender_id | varchar (FK) | Initiating player |
| receiver_id | varchar (FK) | Receiving player |
| offer_metal/crystal/deuterium | integer | What sender offers |
| request_metal/crystal/deuterium | integer | What sender requests |
| offer_items | jsonb | Items offered |
| request_items | jsonb | Items requested |
| status | varchar | "pending", "accepted", "declined", "cancelled", "expired", "countered" |
| expires_at | timestamp | Offer expiration |

### Trade History Table (`trade_history`)

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Record ID |
| trade_offer_id | varchar | Source offer |
| sender_gave | jsonb | Resources/items sent |
| receiver_gave | jsonb | Resources/items received |
| result | varchar | "completed", "cancelled", "expired" |
| completed_at | timestamp | Execution time |

> **Source:** `shared/schema.ts` — `marketOrders`, `auctionListings`, `auctionBids`, `tradeOffers`, `tradeHistory`

---

## Resource Base Prices

| Resource | Base Price | Delta | Production Rate | Limit |
|----------|------------|-------|-----------------|-------|
| Ore | 11 | 5 | 75,000/hr | 500M |
| Organics | 5 | 2 | 5,000/hr | 500M |
| Goods | 15 | 7 | 75,000/hr | 500M |
| Energy | 3 | 1 | 75,000/hr | 5B |

Default planet production: 20.0 units/hr per resource type.

> **Source:** `shared/config/economy/resourceSettings.ts` — `RESOURCE_SETTINGS`

## Device Prices

| Device | Cost |
|--------|------|
| Genesis Device | 100,000,000 |
| Beacon | 100 |
| Emergency Warp | 100,000,000 |
| Warp Edit | 100,000 |
| Mine Deflector | 10 |
| Escape Pod | 100,000 |
| Fuel Scoop | 100,000 |

> **Source:** `shared/config/economy/devicePrices.ts` — `DEVICE_PRICES`

---

## Storefront

Premium currency store for boosters, cosmetics, resources, and bundles.

### Currencies
| Currency | Color | Usage |
|----------|-------|-------|
| Silver | Slate | Basic purchases |
| Gold | Yellow | Premium items |
| Platinum | Indigo | High-tier bundles |

### Categories
- **Boosters**: Temporary progression accelerators
- **Cosmetics**: Visual customization items
- **Resources**: Direct resource packs
- **Bundles**: Multi-item value packages

### Store Mechanics
- Browse by category with quantity selection (1-99)
- Checkout preview shows total cost, grant quantity, and affordability
- Purchase grants `grantItemId` x `grantQuantity`
- Balance displayed as wallet card at top of page
- Links to Story Mode, Season Pass, and Battle Pass

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/storefront/catalog` | Full item catalog with categories |
| GET | `/api/storefront/balance` | Player's currency balances |
| POST | `/api/storefront/preview-checkout` | Preview purchase before confirming |
| POST | `/api/storefront/purchase` | Execute purchase |

> **Source:** `client/src/pages/Storefront.tsx`

---

## Client Pages

### Market Page (`Market.tsx`)
- **Marketplace Tab**: NPC vendor browsing with buy/sell mode toggle
- **Auction House Tab**: Player auctions with create, bid, buyout, and search
- **Resource Exchange Tab**: Convert between metal/crystal/deuterium with 10% fee
- **Player Orders Tab**: View and manage your open resource orders
- **Trade History Tab**: Review past completed trades
- **Price Trends Tab**: Market analytics and price movement tracking
- Stats dashboard: metal, crystal, deuterium balances and today's trade count
- URL-synced tabs via query parameters

### Storefront Page (`Storefront.tsx`)
- Wallet display with Silver/Gold/Platinum balances
- Category filtering: All, Boosters, Cosmetics, Resources, Bundles
- Checkout preview with affordability check
- Quantity controls with quick-select buttons (x1, x5, x10)
- Store strategy guide for progression recommendations

> **Source:** `client/src/pages/Market.tsx`
> **Source:** `client/src/pages/Storefront.tsx`
