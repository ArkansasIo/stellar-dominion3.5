# Universe Empire Dominion - Complete API Guide

**Version:** 2.0.0  
**Last Updated:** June 15, 2026  
**Environment:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)

---

## Overview

The Universe Empire Dominion API provides a comprehensive RESTful interface for managing all aspects of the game, including player state, resources, buildings, research, fleets, combat, and more.

### Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:5001/api
```

### Response Format

All API responses follow a standard format:

```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "timestamp": string,
  "code": string // Error code (only on errors)
}
```

### Pagination Format

Paginated endpoints return:

```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

---

## Getting Started

### Installation

#### Client-Side (TypeScript/JavaScript)

```typescript
import api from '@/lib/api-client';

// All API methods are available through the api object
const response = await api.player.getState();
```

#### Server-Side Integration

```typescript
import { registerCoreApiRoutes } from './server/routes-api-core';

// Register in your Express app
registerCoreApiRoutes(app);
```

### Quick Start Example

```typescript
// 1. Register a new user
const registerResponse = await api.auth.register('username', 'password');

// 2. Login
const loginResponse = await api.auth.login('username', 'password');

// 3. Get player state
const stateResponse = await api.player.getState();
console.log(stateResponse.data);

// 4. Update resources
await api.resources.update({ metal: 1000, crystal: 500 });

// 5. Start research
await api.research.start('energy_technology', 'high');
```

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```typescript
{
  username: string;    // 3-50 characters
  password: string;    // 6-100 characters
  email?: string;      // Optional, valid email
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    userId: string,
    username: string
  }
}
```

**Example:**
```typescript
const response = await api.auth.register('commander123', 'securePass123', 'user@example.com');
```

---

### Login

Authenticate and create a session.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    userId: string,
    username: string
  }
}
```

**Example:**
```typescript
const response = await api.auth.login('commander123', 'securePass123');
```

---

### Logout

End the current session.

**Endpoint:** `POST /api/auth/logout`

**Response:**
```typescript
{
  success: true
}
```

**Example:**
```typescript
await api.auth.logout();
```

---

## API Endpoints

### Player State

#### Get Player State

Retrieve complete player game state.

**Endpoint:** `GET /api/player/state`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    userId: string,
    setupComplete: boolean,
    planetName: string,
    coordinates: string,
    resources: {
      metal: number,
      crystal: number,
      deuterium: number,
      energy: number
    },
    buildings: { [buildingId: string]: number },
    research: { [techId: string]: number },
    tier: number,
    tierExperience: number,
    empireLevel: number,
    empireExperience: number
  }
}
```

**Example:**
```typescript
const state = await api.player.getState();
console.log(`Planet: ${state.data.planetName}`);
console.log(`Resources: ${state.data.resources.metal} metal`);
```

---

#### Update Player State

Update player state with partial data.

**Endpoint:** `PATCH /api/game/state`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  planetName?: string,
  resources?: Partial<Resources>,
  buildings?: Partial<Buildings>,
  // ... any player state field
}
```

**Example:**
```typescript
await api.player.updateState({
  planetName: "New Terra",
  resources: { metal: 5000 }
});
```

---

### Resources

#### Get Resources

Get current resource levels.

**Endpoint:** `GET /api/resources`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    metal: number,
    crystal: number,
    deuterium: number,
    energy: number
  }
}
```

---

#### Update Resources

Modify resource amounts.

**Endpoint:** `PATCH /api/resources`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  metal?: number,
  crystal?: number,
  deuterium?: number,
  energy?: number
}
```

**Example:**
```typescript
await api.resources.update({
  metal: 1000,
  crystal: 500,
  deuterium: 250
});
```

---

### Buildings

#### Get All Buildings

Retrieve all buildings and their levels.

**Endpoint:** `GET /api/buildings`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    [buildingId: string]: {
      id: string,
      name: string,
      level: number,
      maxLevel: number,
      cost: Resources,
      production?: Partial<Resources>,
      buildTime: number
    }
  }
}
```

---

#### Build Structure

Start building or upgrading a structure.

**Endpoint:** `POST /api/buildings/build`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  buildingId: string,
  level?: number  // Optional, defaults to current + 1
}
```

**Example:**
```typescript
await api.buildings.build('metal_mine', 5);
```

---

#### Get Build Queue

Get current building queue.

**Endpoint:** `GET /api/buildings/queue`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      buildingId: string,
      level: number,
      startTime: string,
      endTime: string,
      cost: Resources
    }
  ]
}
```

---

### Research

#### Get Research Tree

Get all available technologies.

**Endpoint:** `GET /api/research/tree`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    [techId: string]: {
      id: string,
      name: string,
      description: string,
      category: string,
      level: number,
      maxLevel: number,
      cost: Resources,
      researchTime: number,
      requirements?: { [techId: string]: number },
      bonuses?: TechBonus[]
    }
  }
}
```

---

#### Start Research

Begin researching a technology.

**Endpoint:** `POST /api/research/start`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  techId: string,
  priority?: 'low' | 'normal' | 'high'
}
```

**Example:**
```typescript
await api.research.start('energy_technology', 'high');
```

---

#### Get Research Queue

Get current research queue.

**Endpoint:** `GET /api/research/queue`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      techId: string,
      level: number,
      startTime: string,
      endTime: string,
      progress: number,
      priority: 'low' | 'normal' | 'high'
    }
  ]
}
```

---

### Fleet Management

#### Get All Fleets

Retrieve all player fleets.

**Endpoint:** `GET /api/fleet`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      name: string,
      ownerId: string,
      ships: { [shipType: string]: number },
      location: string,
      destination?: string,
      status: 'idle' | 'moving' | 'combat' | 'returning',
      mission?: string
    }
  ]
}
```

---

#### Create Fleet

Create a new fleet.

**Endpoint:** `POST /api/fleet`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  name: string,
  ships: { [shipType: string]: number },
  destination?: string
}
```

**Example:**
```typescript
await api.fleet.create('Attack Fleet Alpha', {
  light_fighter: 50,
  cruiser: 10,
  battleship: 5
});
```

---

#### Send Fleet

Send a fleet on a mission.

**Endpoint:** `POST /api/fleet/:fleetId/send`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  destination: string,  // Coordinates like "[1:2:3]"
  mission: 'attack' | 'transport' | 'colonize' | 'spy' | 'defend'
}
```

**Example:**
```typescript
await api.fleet.send('fleet-id-123', '[5:10:3]', 'attack');
```

---

### Combat

#### Get Combat Formations

Get available combat formations.

**Endpoint:** `GET /api/combat/formations`  
**Auth Required:** No

**Response:**
```typescript
{
  success: true,
  data: [
    {
      name: string,
      bonus: number,
      offense: number,
      defense: number
    }
  ]
}
```

---

#### Simulate Combat

Simulate a battle between two forces.

**Endpoint:** `POST /api/combat/simulate`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  attacker: {
    ships: { [shipType: string]: number },
    formation?: string,
    bonuses?: number[]
  },
  defender: {
    ships: { [shipType: string]: number },
    formation?: string,
    bonuses?: number[]
  }
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    winner: 'attacker' | 'defender' | 'draw',
    attackerLosses: { [shipType: string]: number },
    defenderLosses: { [shipType: string]: number },
    loot?: Resources,
    report: string
  }
}
```

---

### Currency & Banking

#### Get Currency Balance

Get player currency balances.

**Endpoint:** `GET /api/currency/balance`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    silver: number,
    gold: number,
    platinum: number
  }
}
```

---

#### Deposit to Bank

Deposit currency to bank account.

**Endpoint:** `POST /api/bank/deposit`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  amount: number
}
```

**Example:**
```typescript
await api.bank.deposit(10000);
```

---

#### Withdraw from Bank

Withdraw currency from bank account.

**Endpoint:** `POST /api/bank/withdraw`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  amount: number
}
```

**Example:**
```typescript
await api.bank.withdraw(5000);
```

---

### Alliances

#### Get All Alliances

List all alliances.

**Endpoint:** `GET /api/alliances`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      name: string,
      tag: string,
      description?: string,
      leaderId: string,
      memberCount: number,
      level: number,
      createdAt: string
    }
  ]
}
```

---

#### Create Alliance

Create a new alliance.

**Endpoint:** `POST /api/alliances/create`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  name: string,
  tag: string,      // 2-5 characters
  description?: string
}
```

**Example:**
```typescript
await api.alliance.create('Galactic Empire', 'GE', 'Dominate the galaxy');
```

---

#### Join Alliance

Join an existing alliance.

**Endpoint:** `POST /api/alliances/:allianceId/join`  
**Auth Required:** Yes

**Example:**
```typescript
await api.alliance.join('alliance-id-123');
```

---

### Market & Trading

#### Get Market Orders

List active market orders.

**Endpoint:** `GET /api/market/orders`  
**Auth Required:** Yes

**Query Parameters:**
```typescript
{
  resource?: string,
  type?: 'buy' | 'sell',
  minPrice?: number,
  maxPrice?: number
}
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      sellerId: string,
      sellerName: string,
      resource: string,
      quantity: number,
      price: number,
      type: 'buy' | 'sell',
      status: 'active' | 'completed' | 'cancelled',
      createdAt: string
    }
  ]
}
```

---

#### Create Market Order

Create a buy or sell order.

**Endpoint:** `POST /api/market/order/create`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  resource: string,
  quantity: number,
  price: number,
  type: 'buy' | 'sell'
}
```

**Example:**
```typescript
await api.market.createOrder({
  resource: 'metal',
  quantity: 10000,
  price: 2.5,
  type: 'sell'
});
```

---

### Auctions

#### Get Auction Listings

Get active auction listings.

**Endpoint:** `GET /api/auctions`  
**Auth Required:** Yes

**Query Parameters:**
```typescript
{
  itemType?: string,
  search?: string,
  sortBy?: 'newest' | 'ending_soon' | 'price_low' | 'price_high'
}
```

---

#### Create Auction

Create a new auction listing.

**Endpoint:** `POST /api/auctions`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  itemType: string,
  itemId: string,
  itemName: string,
  itemDescription?: string,
  itemRarity?: string,
  quantity: number,
  startingPrice: number,
  buyoutPrice?: number,
  bidIncrement?: number,
  duration: number  // Hours (1-72)
}
```

**Example:**
```typescript
await api.auction.create({
  itemType: 'ship',
  itemId: 'battleship_mk2',
  itemName: 'Battleship MK-II',
  itemDescription: 'Powerful warship',
  itemRarity: 'rare',
  quantity: 1,
  startingPrice: 50000,
  buyoutPrice: 100000,
  bidIncrement: 5000,
  duration: 24
});
```

---

#### Place Bid

Bid on an auction.

**Endpoint:** `POST /api/auctions/:auctionId/bid`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  bidAmount: number
}
```

**Example:**
```typescript
await api.auction.bid('auction-id-123', 55000);
```

---

#### Buyout Auction

Instantly purchase an auction at buyout price.

**Endpoint:** `POST /api/auctions/:auctionId/buyout`  
**Auth Required:** Yes

**Example:**
```typescript
await api.auction.buyout('auction-id-123');
```

---

### Expeditions

#### Get All Expeditions

List player expeditions.

**Endpoint:** `GET /api/expeditions`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      leaderId: string,
      name: string,
      type: 'exploration' | 'mining' | 'combat' | 'research',
      status: 'preparing' | 'active' | 'completed' | 'failed',
      targetCoordinates: string,
      fleetComposition: { [shipType: string]: number },
      troopComposition: { [unitType: string]: number },
      startedAt: string,
      completedAt?: string,
      discoveries: any[],
      casualties: { [unitType: string]: number }
    }
  ]
}
```

---

#### Create Expedition

Launch a new expedition.

**Endpoint:** `POST /api/expeditions`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  name: string,
  type: 'exploration' | 'mining' | 'combat' | 'research',
  targetCoordinates: string,
  fleetComposition: { [shipType: string]: number },
  troopComposition: { [unitType: string]: number }
}
```

**Example:**
```typescript
await api.expeditions.create({
  name: 'Deep Space Mission Alpha',
  type: 'exploration',
  targetCoordinates: '[10:15:7]',
  fleetComposition: { scout: 5, cruiser: 2 },
  troopComposition: { marine: 100 }
});
```

---

### Empire & Progression

#### Get Empire Value

Calculate total empire value.

**Endpoint:** `GET /api/empire/value`  
**Auth Required:** Yes

**Response:**
```typescript
{
  success: true,
  data: {
    userId: string,
    resourceValue: number,
    currencyValue: number,
    totalValue: number,
    calculatedAt: string
  }
}
```

---

#### Get Empire Rankings

Get top empires by value.

**Endpoint:** `GET /api/empire/rankings`  
**Auth Required:** No

**Response:**
```typescript
{
  success: true,
  data: [
    {
      userId: string,
      username: string,
      totalValue: number,
      rank: number
    }
  ]
}
```

---

#### Add Tier Experience

Add experience to tier progression.

**Endpoint:** `POST /api/progression/tier/add-xp`  
**Auth Required:** Yes

**Request Body:**
```typescript
{
  amount: number
}
```

**Example:**
```typescript
await api.progression.addTierXP(1000);
```

---

### Status & Health

#### Health Check

Check API health status.

**Endpoint:** `GET /api/health`  
**Auth Required:** No

**Response:**
```typescript
{
  success: true,
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy',
    uptime: number,
    timestamp: string,
    version: string
  }
}
```

---

#### Get System Metrics

Get detailed system metrics (admin only).

**Endpoint:** `GET /api/status/metrics`  
**Auth Required:** Yes (Admin)

**Response:**
```typescript
{
  success: true,
  data: {
    cpu: { usage: number, uptime: number },
    memory: { used: number, total: number, percentage: number },
    database: {
      connections: number,
      maxConnections: number,
      activeQueries: number,
      cacheHitRate: number
    },
    requests: {
      totalRequests: number,
      requestsPerSecond: number,
      averageResponseTime: number,
      p95ResponseTime: number,
      p99ResponseTime: number
    }
  }
}
```

---

## Error Handling

### Error Response Format

```typescript
{
  success: false,
  message: string,
  code: string,
  timestamp: string,
  errors?: Array<{ field: string, message: string }>
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Not authenticated | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `INSUFFICIENT_RESOURCES` | Not enough resources | 400 |
| `CONFLICT` | Resource conflict | 409 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

### Error Handling Example

```typescript
try {
  const response = await api.buildings.build('metal_mine', 10);
  console.log('Building started:', response.data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.code}: ${error.message}`);
    if (error.errors) {
      error.errors.forEach(e => {
        console.error(`  ${e.field}: ${e.message}`);
      });
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Rules

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| General API | 60 requests | 1 minute |
| Expensive Operations | 10 requests | 1 minute |

### Rate Limit Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1623456789
```

### Handling Rate Limits

```typescript
try {
  await api.player.getState();
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    const retryAfter = error.retryAfter || 60;
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  }
}
```

---

## Best Practices

### 1. Use TypeScript Types

```typescript
import type { PlayerState, Resources } from '@shared/api-types';

const state: PlayerState = await api.player.getState().then(r => r.data);
```

### 2. Handle Errors Gracefully

```typescript
const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
};

const state = await safeApiCall(() => api.player.getState());
```

### 3. Use React Query for Caching

```typescript
import { useQuery } from '@tanstack/react-query';

function PlayerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['player-state'],
    queryFn: () => api.player.getState(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000 // 1 minute
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Planet: {data.data.planetName}</div>;
}
```

### 4. Batch Requests When Possible

```typescript
// Instead of multiple sequential calls
const [state, resources, buildings] = await Promise.all([
  api.player.getState(),
  api.resources.get(),
  api.buildings.getAll()
]);
```

### 5. Implement Retry Logic

```typescript
const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## Code Examples

### Complete Player Dashboard

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

function PlayerDashboard() {
  const queryClient = useQueryClient();

  // Fetch player state
  const { data: playerState } = useQuery({
    queryKey: ['player-state'],
    queryFn: () => api.player.getState()
  });

  // Fetch resources
  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.resources.get()
  });

  // Build structure mutation
  const buildMutation = useMutation({
    mutationFn: (buildingId: string) => api.buildings.build(buildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-state'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  const handleBuild = (buildingId: string) => {
    buildMutation.mutate(buildingId);
  };

  return (
    <div>
      <h1>Planet: {playerState?.data.planetName}</h1>
      <div>
        <h2>Resources</h2>
        <p>Metal: {resources?.data.metal}</p>
        <p>Crystal: {resources?.data.crystal}</p>
        <p>Deuterium: {resources?.data.deuterium}</p>
      </div>
      <button onClick={() => handleBuild('metal_mine')}>
        Build Metal Mine
      </button>
    </div>
  );
}
```

### Fleet Management System

```typescript
import { useState } from 'react';
import api from '@/lib/api-client';

function FleetManager() {
  const [fleets, setFleets] = useState([]);

  const loadFleets = async () => {
    const response = await api.fleet.getAll();
    setFleets(response.data);
  };

  const createFleet = async () => {
    await api.fleet.create('New Fleet', {
      light_fighter: 10,
      cruiser: 5
    });
    await loadFleets();
  };

  const sendFleet = async (fleetId: string) => {
    await api.fleet.send(fleetId, '[5:10:3]', 'attack');
    await loadFleets();
  };

  return (
    <div>
      <button onClick={createFleet}>Create Fleet</button>
      {fleets.map(fleet => (
        <div key={fleet.id}>
          <h3>{fleet.name}</h3>
          <p>Status: {fleet.status}</p>
          <button onClick={() => sendFleet(fleet.id)}>
            Send on Mission
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Support

For issues, questions, or feature requests:

- **GitHub Issues:** https://github.com/your-repo/issues
- **Documentation:** https://docs.your-domain.com
- **Discord:** https://discord.gg/your-server

---

**Last Updated:** June 15, 2026  
**API Version:** 2.0.0  
**Maintained by:** Universe Empire Dominion Development Team