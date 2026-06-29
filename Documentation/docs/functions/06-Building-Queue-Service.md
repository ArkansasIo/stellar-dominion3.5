# Building & Research Queue Service

## Overview

Manages the construction queue for planetary buildings and the research queue for empire-wide technology. Both queues support ordering, cancellation with refunds, and acceleration using resources.

---

## Building Queue

### `addToBuildQueue(planetId, buildingType, targetLevel) → QueueEntry`

```typescript
interface QueueEntry {
  id: string;
  planetId?: string;
  playerId?: string;
  itemType: string;
  targetLevel: number;
  startTime: Date;
  endTime: Date;
  status: 'queued' | 'building' | 'completed' | 'cancelled';
  progress: number; // 0–100
  cost: ResourceCost;
}
```

**Logic:**

1. **Prerequisite Check:**
   ```
   prereqs = getPrerequisites(buildingType, targetLevel)
   for each prereq:
     if not planetHasBuilding(planetId, prereq.type, prereq.level):
       return { error: `Missing prerequisite: ${prereq.type} Lv${prereq.level}` }
   ```

2. **Resource Check:**
   ```
   cost = calculateResourceCost(buildingType, targetLevel)
   if planet.resources < cost:
     return { error: 'Insufficient resources' }
   ```

3. **Queue Limit Check:**
   - Maximum 5 items per planet queue (10 with premium)
   - If queue full: return `QUEUE_FULL` error

4. **Resource Deduction:**
   ```
   resourceTransaction(playerId, 'deduct', cost, `Building ${buildingType} Lv${targetLevel}`)
   ```
   Resources deducted **upfront** — cancellation refunds 50%.

5. **Calculate Build Time:**
   ```
   buildTime = calculateBuildTime(buildingType, targetLevel, planetBonuses)
   startTime = now
   endTime = startTime + buildTime
   // If queue not empty: endTime = lastEntry.endTime + buildTime
   ```

6. **Insert Queue Entry:**
   - If queue is empty: start immediately
   - If queue has items: append to end, status = `queued`

---

## Research Queue

### `addToResearchQueue(playerId, techId) → QueueEntry`

```typescript
interface ResearchQueueEntry extends QueueEntry {
  techId: string;
  researchPointsPerTick: number;
}
```

**Logic:**

1. **Prerequisite Check:**
   ```
   prereqs = getTechPrerequisites(techId)
   for each prereq:
     if not playerHasTech(playerId, prereq.techId):
       return { error: `Missing prerequisite tech: ${prereq.techId}` }
   ```

2. **Cost Check:**
   ```
   cost = getResearchCost(techId)
   // Cost can be paid in resources OR research points
   if player.researchPoints >= cost.rp AND player.resources >= cost.resources:
     // Acceptable
   else:
     return { error: 'Insufficient research points or resources' }
   ```

3. **Deduct Cost:**
   ```
   resourceTransaction(playerId, 'deduct', cost.resources, `Research ${techId}`)
   researchTransaction(playerId, 'deduct', cost.rp, `Research ${techId}`)
   ```

4. **Calculate Research Time:**
   ```
   researchTime = calculateResearchTime(techId, playerTechLevel, empireBonuses)
   endTime = now + researchTime
   ```

5. **Insert to Queue:**
   - Single research slot per player (no parallel research by default)
   - Parallel research can be unlocked via `Parallel Research` tech (max 3 slots)

---

## Process Build Queue (Tick)

### `processBuildQueue() → Tick function`

Server tick function (runs every 1 second):

```
for each active build entry (status === 'building'):
  entry.elapsed = now - entry.startTime
  entry.progress = (entry.elapsed / totalDuration) × 100

  if now >= entry.endTime:
    completeBuild(entry)
```

**`completeBuild(entry)`:**
1. Set `entry.status = 'completed'`
2. Apply building level increase: `planet.buildings[entry.itemType].level = entry.targetLevel`
3. Trigger building effects:
   - Recalculate production (`calculateResourceProduction`)
   - Recalculate storage (`calculateStorageCapacity`)
   - Update defense power
   - Update shipyard capacity
4. Start next item in queue:
   ```
   nextEntry = popNext(planet.buildQueue)
   if nextEntry:
     nextEntry.status = 'building'
     nextEntry.startTime = now
     nextEntry.endTime = now + nextEntry.duration
   ```
5. Notify player: `{ type: 'BUILD_COMPLETE', building: entry.itemType, level: entry.targetLevel }`

---

## Process Research Queue (Tick)

### `processResearchQueue() → Tick function`

```
for each active research entry:
  entry.progress = (elapsed / totalDuration) × 100

  if now >= entry.endTime:
    completeResearch(entry)
```

**`completeResearch(entry)`:**
1. Set `entry.status = 'completed'`
2. Apply technology unlock: `player.technologies[entry.techId].unlocked = true`
3. Apply tech bonuses:
   - Stat modifiers (attack, defense, speed, production)
   - Unlock new buildings / ships / abilities
   - Passive effects (scan range, trade income, etc.)
4. Start next item in research queue (if parallel, per-slot)
5. Notify player: `{ type: 'RESEARCH_COMPLETE', tech: entry.techId }`

---

## Cancel Queue Entry

### `cancelQueueEntry(queueId) → RefundResult`

```typescript
interface RefundResult {
  success: boolean;
  refund: ResourceCost;
  penalty: ResourceCost;
}
```

**Logic:**

```
refund = {
  metal:     floor(cost.metal × 0.5),
  crystal:   floor(cost.crystal × 0.5),
  deuterium: floor(cost.deuterium × 0.5),
  credits:   floor(cost.credits × 0.5),
}
penalty = cost - refund
```

1. Set `entry.status = 'cancelled'`
2. Return 50% of resources to player via `resourceTransaction`
3. If the cancelled entry was actively `building`: shift next entry forward, start immediately
4. If cancelled entry was `queued`: simply remove from queue, no shift needed

**Special cases:**
- If >90% complete: cancellation returns 75% refund (player changed mind late)
- Buildings destroyed during construction: 100% refund
- Server rollback/crash: 100% refund on affected entries

---

## Accelerate Queue Entry

### `accelerateQueueEntry(queueId, resourceSpend) → AccelerationResult`

```typescript
interface AccelerationResult {
  newEndTime: Date;
  timeReduced: number; // seconds
  resourceSpent: ResourceAmount;
}
```

**Cost per hour reduction formula:**

```
costPerHourReduced = baseCost × (hoursReduced / totalHours) × 2.0
```

- Reducing 1 hour from build time costs `2 × (hourlyEquivalentCost)`
- Maximum reduction: 90% of remaining time (cannot skip last 10%)
- Instant complete option:
  ```
  instantCost = remainingCost × 3.0
  resourceTransaction(playerId, 'deduct', instantCost)
  entry.endTime = now  // completes on next tick
  ```

---

## Reorder Queue

### `reorderQueue(queueId, newPosition) → QueueReorderResult`

```typescript
interface QueueReorderResult {
  success: boolean;
  queue: QueueEntry[]; // reordered
}
```

**Logic:**
1. Queue is 0-indexed (position 0 = next to build)
2. Cannot reorder an already-building entry (position 0 with `status === 'building'`)
3. Remove entry from current position, insert at `newPosition`
4. Recalculate start/end times for all entries after position 0:
   ```
   for i = 1 to queue.length:
     queue[i].startTime = queue[i-1].endTime
     queue[i].endTime = queue[i].startTime + queue[i].duration
   ```

---

## Get Queue Status

### `getQueueStatus(planetId/playerId) → QueueEntry[] with progress`

Returns all queue entries with real-time progress.

```
for each entry:
  if status === 'building':
    entry.progress = floor((now - entry.startTime) / (entry.endTime - entry.startTime) × 100)
  elif status === 'queued':
    // Calculate estimated start time based on preceding entries
    entry.progress = 0
    entry.estimatedStart = precedingEntry.endTime
  elif status === 'completed':
    entry.progress = 100
```

**Progress formula:**

```
progress% = max(0, min(100, ((currentTime - startTime) / totalDuration) × 100))
```

**Response structure:**

```typescript
interface QueueStatusResponse {
  active: QueueEntry | null;        // Currently building/researching
  queued: QueueEntry[];             // Waiting items
  completed: QueueEntry[];          // Recently completed (last 24h)
  totalActiveTime: number;          // Remaining seconds for active item
  totalQueueTime: number;           // Total seconds for entire queue
}
```

---

## Error Handling Summary

| Error | Cause | Resolution |
|-------|-------|------------|
| `INSUFFICIENT_RESOURCES` | Player lacks resources for cost | Player must gather resources |
| `QUEUE_FULL` | Max queue size reached | Wait for completion or cancel |
| `PREREQ_NOT_MET` | Missing building/tech level | Build/research prerequisite first |
| `ALREADY_IN_QUEUE` | Duplicate item already queued | Cancel existing or wait |
| `INVALID_ITEM` | Item type does not exist | Check item registry |
| `CANCEL_NOT_ALLOWED` | Item in final 10% cannot cancel | N/A |
| `NOT_OWNER` | Player does not own planet | N/A |
