# Fleet Service — `fleetService.ts`

## Overview

Manages fleet creation, movement, merging, splitting, deployment, and lifecycle. Fleets are collections of ship groups that travel between celestial bodies and perform missions.

---

## Fleet Creation

### `createFleet(playerId, planetId, ships, name) → Fleet`

```typescript
interface CreateFleetInput {
  ships: ShipGroupSelection[]; // { shipType, quantity }
  name: string;
}

interface Fleet {
  id: string;
  playerId: string;
  name: string;
  ships: ShipGroup[];
  position: Coordinates;
  originPlanetId: string;
  destination: Coordinates | null;
  speed: number;
  fuel: number;
  status: FleetStatus;
  morale: number;
  mission: MissionType | null;
  createdAt: Date;
}
```

**Logic:**
1. Validate player owns the specified ships on the origin planet
2. Deduct ships from planet's shipyard inventory
3. Assign unique fleet ID
4. Set initial position to origin planet coordinates
5. Calculate fleet speed (slowest ship determines fleet speed)
6. Set fuel to max capacity
7. Return new Fleet object

---

## Fleet Dispatch

### `dispatchFleet(fleetId, destination, mission) → DispatchResult`

```typescript
interface DispatchInput {
  destination: Coordinates;
  mission: 'attack' | 'transport' | 'colonize' | 'scavenge' | 'deploy' | 'explore' | 'trade';
}

interface DispatchResult {
  success: boolean;
  travelTime: number;     // seconds
  fuelCost: number;
  arrivalTime: Date;
  error?: string;
}
```

**Validation:**
- Fleet must be idle (not already in transit)
- Fleet must have fuel for the trip (or refuel from planet reserves)
- Destination must be valid coordinates within the galaxy
- Mission-type checks (e.g., colonize requires colony ship)

---

## Travel Time Calculation

### `calculateTravelTime(startCoords, endCoords, fleetSpeed, fuelEfficiency) → {time, fuelCost}`

```
distance = sqrt((x1-x2)^2 + (y1-y2)^2 + (z1-z2)^2)
baseTime = distance × 1000 / fleetSpeed
timeWithModifiers = baseTime × (1 - navigationBonus) × (1 / fleetSpeedBoost)
fuelCost = distance × fuelConsumptionRate × (1 / fuelEfficiency)
```

- `fleetSpeed` = slowest ship's base speed in the fleet
- `fuelConsumptionRate` = average of all ships' fuel burn rates
- Navigation bonus from tech upgrades (max 30% reduction)
- Fleet speed boost from admiral/commander (max 20% increase)
- Minimum travel time: 10 seconds (for same-system jumps)

---

## Fleet Recall

### `recallFleet(fleetId) → RecallResult`

```typescript
interface RecallResult {
  success: boolean;
  returnTime: number;
  returnArrival: Date;
  fuelCostRefund: number; // partial fuel refund
}
```

**Logic:**
1. Calculate current position (linear interpolation along route)
2. Reverse direction toward origin
3. New travel time: `remainingDistance × 1000 / fleetSpeed`
4. 70% of unused fuel is refunded
5. On arrival: fleet returns to origin planet, status → IDLE
6. If fleet was attacking: retreat rules apply instead of recall

---

## Fleet Merging

### `mergeFleets(targetFleetId, sourceFleetId) → MergeResult`

```typescript
interface MergeResult {
  success: boolean;
  mergedFleet: Fleet;
  removedFleetId: string;
}
```

**Constraints:**
- Both fleets must be at the same coordinates (same planet or same space location)
- Both fleets must belong to the same player
- Source fleet is deleted after transfer; ships are added to target fleet
- Morale of target fleet: weighted average by ship count
- Fuel of target fleet: sum of both fleets (capped at max)

---

## Fleet Splitting

### `splitFleet(fleetId, shipSelection) → SplitResult`

```typescript
interface SplitResult {
  success: boolean;
  originalFleet: Fleet;  // reduced by selected ships
  newFleet: Fleet;       // created from selected ships
}
```

**Logic:**
1. Validate requested ships exist in source fleet
2. Deduct selected ships from source fleet
3. Create new fleet ID with selected ships
4. New fleet starts at same position with same destination
5. Name auto-generated: `{originalName} Split 1`
6. Fuel split proportionally by ship count ratio

---

## Fleet Deployment

### `deployFleet(fleetId, targetPlanetId) → DeployResult`

**Mission types:**

| Mission | Effect |
|---------|--------|
| Colonize | Colony ship lands, creates new colony on uncolonized planet |
| Reinforce | Ships land and merge into planet's defensive garrison |
| Resupply | Deliver resources to planet |
| Scavenge | Collect debris field at target coordinates |

```typescript
interface DeployResult {
  success: boolean;
  outcome: 'colonized' | 'reinforced' | 'resupplied' | 'scavenged';
  details: {
    colonyId?: string;
    shipsLanded?: ShipGroup[];
    resourcesDelivered?: ResourceAmount;
    debrisCollected?: ResourceAmount;
  };
}
```

---

## Auto-Return

### `returnFleet(fleetId) → Auto-return after mission completion`

Triggered automatically when:
- Attack mission completes (victory or defeat)
- Transport delivers cargo
- Scavenge field is depleted

Auto-return dispatches fleet back to origin planet with `return` mission type.

---

## Fleet Position Updates (Tick)

### `updateFleetPositions() → Tick function`

Called every server tick (default 1 second). Moves all in-transit fleets:

```
for each fleet in transit:
  progress = (now - fleet.departureTime) / fleet.totalTravelTime
  fleet.position = lerp(fleet.origin.coords, fleet.destination.coords, progress)
  fleet.fuel -= fuelConsumptionPerTick

  if progress >= 1.0:
    fleet.position = fleet.destination
    executeMission(fleet)
```

- Executes mission when fleet arrives at destination
- If fuel reaches 0 mid-journey: fleet becomes stranded (derelict)
- Stranded fleets can be rescued by allied fleets sending fuel

---

## Fuel Consumption

### `fuelConsumption(fleet, distance) → fuelUsed`

```
perShipConsumption = ship.fuelRate × distance × (1 + shipMass × 0.001)
fleetConsumption = sum(ship.count × perShipConsumption for each ship group)
```

- Fuel type: deuterium (primary) or energy cells (for energy-only ships)
- Overweight penalty: if cargo filled >80%, fuel consumption +20%
- Efficiency tech reduces consumption by up to 25%

---

## Fleet Maintenance

### `fleetMaintenance(fleet) → hourlyCost`

```
hourlyCost.credits   = sum(ship.count × ship.creditMaintenance for each ship group)
hourlyCost.deuterium = sum(ship.count × 0.1 for each ship group)  // idling in dock
```

- Maintenance is only charged for idle/stationary fleets
- In-transit fleets pay no hourly maintenance (fuel consumption replaces it)
- Maintenance cost doubles for fleets with `DAMAGED` status
- Unpaid maintenance for 48h leads to fleet morale decay

---

## Fleet Morale

### `fleetMorale(fleet) → currentMorale`

```
morale = baseMorale (default 100)
  - lossesOverTime × 2
  - timeInTransit > 24h → decay of 5 per day
  - enemyTerritory → -10
  + victoryBonus: +15 per win
  + suppliesDelivered: +5
```

**Effects on combat:**
- `morale > 80`: +10% damage, +5% evasion
- `morale 50–80`: normal performance
- `morale 20–50`: -10% damage, -5% accuracy
- `morale < 20`: chance of mutiny (5% per hour, ships desert)

---

## Fleet Movement Queue (Waypoints)

### `fleetMovementQueue(fleet) → waypoint following`

```typescript
interface MovementQueue {
  waypoints: Coordinates[];
  currentIndex: number;
  loop: boolean;  // patrol mode
}
```

- Fleets can have up to 10 waypoints queued
- After reaching final waypoint: fleet stops or loops (patrol)
- Waypoints can be dynamically added/removed mid-transit
- Patrol route bonus: +5 morale, +10% scavenge yield
