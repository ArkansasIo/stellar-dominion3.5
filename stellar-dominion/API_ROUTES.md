# Stellar Dominion - API Routes Reference

**Version:** 0.9.0-beta  
**Last Updated:** December 2, 2024

---

## Authentication Routes

### POST `/api/auth/register`
Register a new player account.
```typescript
Body: { username: string, password: string }
Response: { userId: string, username: string }
```

### POST `/api/auth/login`
Log in to existing account.
```typescript
Body: { username: string, password: string }
Response: { userId: string, session: string }
```

### POST `/api/auth/logout`
End current session.
```typescript
Response: { success: true }
```

---

## Player State Routes

### GET `/api/player/state`
Fetch complete player game state.
```typescript
Response: {
  userId: string
  empireLevel: number
  tier: number
  resources: { metal: number, crystal: number, deuterium: number }
  buildings: { [key: string]: number }
  units: { [key: string]: number }
}
```

### POST `/api/player/setup`
Initial empire setup for new players.
```typescript
Body: { empireSetupData }
Response: { playerState }
```

---

## Progression Routes

### GET `/api/progression/tier`
Fetch current tier and tier experience.
```typescript
Response: { tier: number, tierExperience: number }
```

### POST `/api/progression/tier/add-xp`
Add experience to tier progression.
```typescript
Body: { amount: number }
Response: { tier: number, tierExperience: number }
```

### GET `/api/progression/empire`
Fetch empire level and experience.
```typescript
Response: { empireLevel: number, empireExperience: number }
```

### POST `/api/progression/empire/add-xp`
Add experience to empire progression.
```typescript
Body: { amount: number }
Response: { empireLevel: number, empireExperience: number }
```

---

## Currency Routes

### GET `/api/currency/balance`
Fetch player currency balances.
```typescript
Response: { silver: number, gold: number, platinum: number }
```

### POST `/api/currency/add`
Add currency to player account (admin/system only).
```typescript
Body: { silver?: number, gold?: number, platinum?: number, reason?: string }
Response: { silver: number, gold: number, platinum: number }
```

### GET `/api/currency/transactions`
Fetch transaction history (last 50).
```typescript
Response: [{ id, userId, type, amount, reason, timestamp }]
```

---

## Bank Routes

### GET `/api/bank/account`
Fetch bank account details.
```typescript
Response: { accountBalance: number, totalDeposited: number, updatedAt: string }
```

### POST `/api/bank/deposit`
Deposit currency to bank account.
```typescript
Body: { amount: number }
Response: { accountBalance: number, updatedAt: string }
```

### POST `/api/bank/withdraw`
Withdraw currency from bank account.
```typescript
Body: { amount: number }
Response: { accountBalance: number, updatedAt: string }
Error: "Insufficient funds"
```

### GET `/api/bank/transactions`
Fetch bank transaction history (last 50).
```typescript
Response: [{
  id: string
  userId: string
  transactionType: "deposit" | "withdrawal"
  amount: number
  balanceBefore: number
  balanceAfter: number
  timestamp: string
}]
```

---

## Empire Value Routes

### GET `/api/empire/value`
Calculate and fetch total empire value.
```typescript
Response: {
  userId: string
  resourceValue: number
  currencyValue: number
  totalValue: number
  calculatedAt: string
}
```

### GET `/api/empire/rankings`
Fetch top 100 empires by value.
```typescript
Response: [{
  userId: string
  totalValue: number
  rank: number
  username: string
}]
```

---

## Knowledge Routes

### GET `/api/knowledge/types`
Fetch all knowledge types.
```typescript
Response: {
  types: ["Military", "Engineering", "Science", ...]
  total: number
}
```

### GET `/api/knowledge/progress/:type`
Fetch knowledge progress for specific type.
```typescript
Response: {
  type: string
  level: number
  progress: number
  mastery: number
}
```

---

## Facility Routes

### GET `/api/facilities/types`
Fetch facility types and counts.
```typescript
Response: {
  types: ["resource", "energy", "storage", "military", "research", "civilian", "special"]
  totalFacilities: number
}
```

---

## Combat Routes

### GET `/api/combat/formations`
Fetch combat formation options.
```typescript
Response: [{
  name: string
  bonus: number
  offense: number
  defense: number
}]
```

---

## Unit Systems Routes

### GET `/api/unit-systems/templates`
Fetch all unit templates (troop, civilian, government, military).
```typescript
Response: {
  success: true
  total: number
  templates: UnitTemplate[]
}
```

### GET `/api/unit-systems/templates/:domain`
Fetch templates for a specific domain.
```typescript
Params: domain = "troop" | "civilian" | "government" | "military"
Response: {
  success: true
  domain: string
  total: number
  templates: UnitTemplate[]
}
```

### GET `/api/unit-systems/blueprints`
Fetch all starship blueprints for construction yard.
```typescript
Response: {
  success: true
  total: number
  blueprints: StarshipBlueprint[]
}
```

### POST `/api/unit-systems/train`
Queue unit training (untrained→trained or trained→elite).
```typescript
Body: {
  state: PlayerUnitSystemState
  unitId: string
  quantity: number
  toState: "trained" | "elite"
}
Response: { success: true, message: string, state: PlayerUnitSystemState }
```

### POST `/api/unit-systems/untrain`
Revert trained/elite units back to untrained.
```typescript
Body: {
  state: PlayerUnitSystemState
  unitId: string
  quantity: number
  fromState: "trained" | "elite"
}
Response: { success: true, message: string, state: PlayerUnitSystemState }
```

### POST `/api/unit-systems/training/process`
Process completed training queue entries.
```typescript
Body: {
  state: PlayerUnitSystemState
  now?: number // timestamp override
}
Response: { success: true, state: PlayerUnitSystemState }
```

### POST `/api/unit-systems/combat/simulate`
Simulate combat between two unit groups.
```typescript
Body: {
  attacker: CombatSideInput
  defender: CombatSideInput
}
Response: {
  success: true
  result: CombatSimulationResult
}
```

### POST `/api/unit-systems/yard/construct`
Queue starship blueprint construction in construction yard.
```typescript
Body: {
  state: PlayerUnitSystemState
  blueprintId: string
  quantity: number
}
Response: { success: true, message: string, state: PlayerUnitSystemState }
```

### POST `/api/unit-systems/yard/process`
Process construction yard queue completion.
```typescript
Body: {
  state: PlayerUnitSystemState
  now?: number // timestamp override
}
Response: { success: true, state: PlayerUnitSystemState }
```

---

## Archetype & Life Support Routes

### GET `/api/config/building-archetypes`
Fetch all 90 building archetypes.
```typescript
Response: {
  success: true
  total: 90
  items: BuildingArchetype[]
}
```

### GET `/api/config/building-archetypes/meta`
Fetch building archetype metadata and category grouping.
```typescript
Response: {
  success: true
  meta: {
    total: number
    categories: string[]
    subCategories: string[]
    types: string[]
    subTypes: string[]
    classes: string[]
    subClasses: string[]
  }
  groupedByCategory: Record<string, BuildingArchetype[]>
}
```

### GET `/api/config/factory-job-archetypes`
Fetch all 90 factory job archetypes.
```typescript
Response: {
  success: true
  total: 90
  items: FactoryJobArchetype[]
}
```

### GET `/api/config/factory-job-archetypes/meta`
Fetch factory job archetype metadata and job grouping.
```typescript
Response: {
  success: true
  meta: {
    total: number
    categories: string[]
    subCategories: string[]
    types: string[]
    subTypes: string[]
    classes: string[]
    subClasses: string[]
    jobCategories: string[]
    subJobCategories: string[]
  }
  groupedByJobCategory: Record<string, FactoryJobArchetype[]>
}
```

### GET `/api/config/entity-archetypes/meta`
Fetch meta summary for the main 90-entity archetype catalog.
```typescript
Response: {
  success: true
  total: number
  meta: EntityArchetypeMeta
}
```

### GET `/api/config/frame-systems`
Fetch frame system definitions and tier bonuses.
```typescript
Response: {
  success: true
  frameSystems: {
    categories: Record<string, { name: string, description: string, subCategories: string[] }>
    tiers: FrameSystemTier[]
  }
}
```

### GET `/api/config/population-system`
Fetch population system configuration.
```typescript
Response: {
  success: true
  populationSystem: {
    base: Record<string, number>
    classes: Record<string, PopulationClassConfig>
    happinessModifiers: Record<string, number>
  }
}
```

### GET `/api/config/food-system`
Fetch food production, consumption, and storage rules.
```typescript
Response: {
  success: true
  foodSystem: FoodSystemConfig
}
```

### GET `/api/config/water-system`
Fetch water production, consumption, and storage rules.
```typescript
Response: {
  success: true
  waterSystem: WaterSystemConfig
}
```

### GET `/api/config/life-support-systems`
Fetch the complete frame, population, food, and water system bundle.
```typescript
Response: {
  success: true
  systems: {
    frame: unknown
    population: unknown
    food: unknown
    water: unknown
  }
}
```

### GET `/api/population/snapshot`
Fetch live population, food, water, and frame telemetry for the authenticated player.
```typescript
Response: {
  success: true
  snapshot: {
    frameTier: number
    frame: {
      name: string
      populationCapacityBonus: number
      foodEfficiencyBonus: number
      waterEfficiencyBonus: number
      stabilityBonus: number
    }
    population: {
      current: number
      capacity: number
      utilization: number
      happiness: number
      estimatedGrowthPerHour: number
      classes: Record<string, number>
    }
    food: {
      stock: number
      productionPerHour: number
      demandPerHour: number
      netPerHour: number
      pressure: "surplus" | "stable" | "strained" | "critical"
      hoursToDepletion: number | null
    }
    water: {
      stock: number
      productionPerHour: number
      demandPerHour: number
      netPerHour: number
      pressure: "surplus" | "stable" | "strained" | "critical"
      hoursToDepletion: number | null
    }
  }
}
```

---

## Government Leader Routes

### GET `/api/government-leaders`
Fetch all government leader definitions (23 total).
```typescript
Response: {
  success: true
  total: number
  leaders: GovernmentLeaderType[]
  leaderTypes: string[]
  leaderClasses: string[]
}
```

### GET `/api/government-leaders/type/:type`
Filter government leaders by type.
```typescript
Params: { type: string }
Response: {
  success: true
  type: string
  total: number
  leaders: GovernmentLeaderType[]
}
```

### GET `/api/government-leaders/class/:leaderClass`
Filter government leaders by class.
```typescript
Params: { leaderClass: string }
Response: {
  success: true
  leaderClass: string
  total: number
  leaders: GovernmentLeaderType[]
}
```

---

## Inventory Routes

### GET `/api/inventory`
Fetch player inventory items.
```typescript
Response: [{
  id: string
  playerId: string
  itemId: string
  quantity: number
  rarity: string
}]
```

---

## Mission Routes

### GET `/api/missions`
Fetch player missions.
```typescript
Response: [{ id, userId, type, status, target, reward }]
```

### POST `/api/missions/:id/complete`
Mark mission as complete.
```typescript
Response: { completed: true, rewards: {} }
```

---

## Alliance Routes

### GET `/api/alliances`
Fetch player alliances.
```typescript
Response: [{ id, name, leader, members, level }]
```

### POST `/api/alliances/create`
Create new alliance.
```typescript
Body: { name: string, description?: string }
Response: { allianceId, name }
```

---

## Market Routes

### GET `/api/market/orders`
Fetch market orders.
```typescript
Response: [{ id, resource, price, quantity, seller }]
```

### POST `/api/market/order/create`
Create market order.
```typescript
Body: { resource: string, quantity: number, price: number, type: "buy" | "sell" }
Response: { orderId, status }
```

---

## Error Handling

All routes follow standard HTTP error codes:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

Error response format:
```typescript
{ message: string, code?: string }
```

---

## Rate Limiting

API rate limits:
- **Login**: 5 attempts per 15 minutes per IP
- **General API**: 60 requests per minute per user
- **Expensive Operations**: 10 requests per minute (expeditions, battles, etc.)

---

## Authentication

All protected routes require valid session via HTTP-only cookie set during login. Session expires after 7 days of inactivity.
