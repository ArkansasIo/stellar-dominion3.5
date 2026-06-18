# Level & Tier Progression System - Usage Examples

Complete guide for using the 999-level, 99-tier progression system.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Creating Entities](#creating-entities)
- [Leveling Up](#leveling-up)
- [Stat Calculations](#stat-calculations)
- [UI Integration](#ui-integration)
- [Advanced Features](#advanced-features)

---

## Basic Usage

### Import the System

```typescript
import {
  PROGRESSION_CONSTANTS,
  ProgressionTables,
  createEntityProgression,
  addExperience,
  setLevelAndTier,
  getProgressionSummary,
  getTierName,
  getTierColor,
} from '@/shared/config';
```

### Constants

```typescript
// Access progression constants
console.log(PROGRESSION_CONSTANTS.MAX_LEVEL); // 999
console.log(PROGRESSION_CONSTANTS.MAX_TIER); // 99
console.log(PROGRESSION_CONSTANTS.BASE_EXP_REQUIREMENT); // 100
```

---

## Creating Entities

### Create a New Entity with Progression

```typescript
import { createEntityProgression } from '@/shared/config';

// Define base stats
const baseStats = {
  // Base Stats
  power: 100,
  defense: 80,
  mobility: 60,
  utility: 50,
  
  // Sub Stats
  precision: 70,
  endurance: 75,
  efficiency: 65,
  control: 60,
  
  // Attributes
  tech: 50,
  command: 45,
  logistics: 55,
  survivability: 60,
  
  // Sub Attributes
  sensorRange: 40,
  energyUse: 30,
  maintenance: 35,
  adaptation: 45,
};

// Create entity at level 1, tier 1
const ship = createEntityProgression(
  'ship-001',
  'starship',
  'combat',
  'frigate',
  'rapid-strike',
  baseStats,
  1, // starting level
  1  // starting tier
);

console.log(ship);
/* Output:
{
  id: 'ship-001',
  entityType: 'starship',
  entitySubType: 'combat',
  entityClass: 'frigate',
  entitySubClass: 'rapid-strike',
  level: 1,
  tier: 1,
  experience: 0,
  tierPoints: 0,
  stats: {
    power: 100,
    defense: 80,
    mobility: 60,
    utility: 50,
    precision: 70,
    endurance: 75,
    efficiency: 65,
    control: 60,
    tech: 50,
    command: 45,
    logistics: 55,
    survivability: 60,
    sensorRange: 40,
    energyUse: 30,
    maintenance: 35,
    adaptation: 45
  },
  baseStats: { ... },
  levelMultiplier: 1.0,
  tierMultiplier: 1.0,
  totalMultiplier: 1.0
}
*/
```

### Create High-Level Entity

```typescript
// Create entity at level 500, tier 50
const legendaryShip = createEntityProgression(
  'ship-legendary-001',
  'starship',
  'combat',
  'battlecruiser',
  'titan-class',
  baseStats,
  500, // level 500
  50   // tier 50 (Cosmic tier)
);

console.log(legendaryShip.levelMultiplier); // 6.0 (1.0 + 0.01 * 499)
console.log(legendaryShip.tierMultiplier); // 3.45 (1.0 + 0.05 * 49)
console.log(legendaryShip.totalMultiplier); // 20.7
console.log(legendaryShip.stats.power); // Much higher than base 100!
```

---

## Leveling Up

### Add Experience and Auto-Level

```typescript
import { addExperience } from '@/shared/config';

let myShip = createEntityProgression(
  'ship-001',
  'starship',
  'combat',
  'frigate',
  'rapid-strike',
  baseStats
);

// Gain 1000 experience
myShip = addExperience(myShip, 1000);
console.log(myShip.level); // Automatically leveled up based on exp

// Gain more experience
myShip = addExperience(myShip, 50000);
console.log(myShip.level); // Level increased
console.log(myShip.tier); // Tier may have increased (every 10 levels)
console.log(myShip.stats); // Stats automatically recalculated
```

### Manually Set Level and Tier

```typescript
import { setLevelAndTier } from '@/shared/config';

// Set to specific level/tier (for admin commands, testing, etc.)
let maxedShip = setLevelAndTier(myShip, 999, 99);
console.log(maxedShip.level); // 999
console.log(maxedShip.tier); // 99
console.log(maxedShip.stats.power); // MAXIMUM POWER!
```

---

## Stat Calculations

### Calculate Individual Stat

```typescript
import { calculateStatValue } from '@/shared/config';

const basePower = 100;
const level = 50;
const tier = 5;

const finalPower = calculateStatValue(basePower, level, tier, 'power');
console.log(finalPower);
// Formula: (base * levelMult * tierMult) + levelBonus + tierBonus
```

### Calculate All Stats

```typescript
import { calculateAllStats } from '@/shared/config';

const stats = calculateAllStats(baseStats, 100, 10);
console.log(stats);
// Returns all 16 stats calculated for level 100, tier 10
```

### Access Level/Tier Tables

```typescript
import { ProgressionTables } from '@/shared/config';

// Get data for specific level
const levelData = ProgressionTables.getLevelData(50);
console.log(levelData);
/* Output:
{
  level: 50,
  expRequired: [exp for level 50],
  expTotal: [total exp to reach 50],
  tier: 5,
  statBonus: 245,
  multiplier: 1.49
}
*/

// Get data for specific tier
const tierData = ProgressionTables.getTierData(10);
console.log(tierData);
/* Output:
{
  tier: 10,
  minLevel: 91,
  pointsRequired: [points needed],
  statBonus: 450,
  multiplier: 1.45,
  unlocks: ['Elite Status', 'Special Abilities']
}
*/
```

---

## UI Integration

### Display Progression Summary

```typescript
import { getProgressionSummary, getTierName, getTierColor } from '@/shared/config';

const summary = getProgressionSummary(myShip);
console.log(summary);
/* Output:
{
  level: 50,
  tier: 5,
  expCurrent: 2500,
  expNext: 10000,
  expProgress: 25.0,
  tierProgress: 50.0,
  powerLevel: 15234
}
*/

// Display in UI
const tierName = getTierName(summary.tier); // "Advanced"
const tierColor = getTierColor(summary.tier); // "#CD7F32" (Bronze)
```

### React Component Example

```tsx
import { getProgressionSummary, getTierName, getTierColor } from '@/shared/config';

function EntityProgressionCard({ entity }: { entity: EntityProgression }) {
  const summary = getProgressionSummary(entity);
  const tierName = getTierName(entity.tier);
  const tierColor = getTierColor(entity.tier);
  
  return (
    <div className="progression-card">
      <h3>{entity.entityType} - {entity.entityClass}</h3>
      
      {/* Level Display */}
      <div className="level">
        <span>Level {summary.level}</span>
        <span style={{ color: tierColor }}>{tierName} (Tier {summary.tier})</span>
      </div>
      
      {/* Experience Bar */}
      <div className="exp-bar">
        <div 
          className="exp-fill" 
          style={{ width: `${summary.expProgress}%` }}
        />
        <span>{summary.expCurrent} / {summary.expNext} XP</span>
      </div>
      
      {/* Tier Progress */}
      <div className="tier-progress">
        <span>Tier Progress: {summary.tierProgress.toFixed(1)}%</span>
      </div>
      
      {/* Power Level */}
      <div className="power-level">
        <span>Power Level: {summary.powerLevel.toLocaleString()}</span>
      </div>
      
      {/* Stats Display */}
      <div className="stats-grid">
        <div className="stat">
          <label>Power</label>
          <span>{entity.stats.power}</span>
        </div>
        <div className="stat">
          <label>Defense</label>
          <span>{entity.stats.defense}</span>
        </div>
        <div className="stat">
          <label>Mobility</label>
          <span>{entity.stats.mobility}</span>
        </div>
        <div className="stat">
          <label>Utility</label>
          <span>{entity.stats.utility}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Advanced Features

### Calculate Experience Requirements

```typescript
import { calculateExpForLevel, calculateTotalExpForLevel, getLevelFromExperience } from '@/shared/config';

// Experience needed for next level
const expForLevel100 = calculateExpForLevel(100);
console.log(expForLevel100);

// Total experience needed to reach level 500
const totalExp = calculateTotalExpForLevel(500);
console.log(totalExp);

// Get level from experience amount
const level = getLevelFromExperience(1000000);
console.log(level); // Returns current level based on total exp
```

### Tier System Features

```typescript
import { calculateTierForLevel, getTierUnlocks } from '@/shared/config';

// Calculate tier from level
const tier = calculateTierForLevel(155);
console.log(tier); // 16

// Get unlocks for tier 20
const unlocks = getTierUnlocks(20);
console.log(unlocks); // ['Legendary Tier', 'Ultimate Weapons', ...]
```

### Generate Complete Tables

```typescript
import { generateLevelTable, generateTierTable } from '@/shared/config';

// Generate all 999 levels
const levelTable = generateLevelTable();
console.log(levelTable.get(1)); // Level 1 data
console.log(levelTable.get(999)); // Level 999 data

// Generate all 99 tiers
const tierTable = generateTierTable();
console.log(tierTable.get(1)); // Tier 1 data
console.log(tierTable.get(99)); // Tier 99 data
```

### Combat/Damage Calculation Example

```typescript
function calculateDamage(attacker: EntityProgression, defender: EntityProgression): number {
  // Use attacker's power stat and defender's defense stat
  const attackPower = attacker.stats.power;
  const defense = defender.stats.defense;
  
  // Factor in precision and endurance
  const accuracy = attacker.stats.precision / 100;
  const resilience = defender.stats.endurance / 100;
  
  // Calculate base damage
  const baseDamage = Math.max(0, attackPower - (defense * resilience));
  
  // Apply accuracy
  const finalDamage = baseDamage * accuracy;
  
  return Math.floor(finalDamage);
}

const damage = calculateDamage(attackerShip, defenderShip);
console.log(`Damage dealt: ${damage}`);
```

---

## Integration with 90 Entity Archetypes

```typescript
import { ENTITY_ARCHETYPES_90, createEntityProgression } from '@/shared/config';

// Get an archetype
const interceptor = ENTITY_ARCHETYPES_90.find(a => a.id === 'starship-001');

if (interceptor) {
  // Create entity from archetype
  const ship = createEntityProgression(
    'player-ship-001',
    interceptor.family,
    interceptor.type,
    interceptor.class,
    interceptor.subClass,
    interceptor.baseStats,
    1,
    1
  );
  
  console.log(`Created ${interceptor.name} with base power ${ship.stats.power}`);
}
```

---

## Database Integration Example

```typescript
// In server/storage.ts or similar

async function saveEntityProgression(entity: EntityProgression): Promise<void> {
  await db.insert(entityProgressions).values({
    id: entity.id,
    entityType: entity.entityType,
    entitySubType: entity.entitySubType,
    entityClass: entity.entityClass,
    entitySubClass: entity.entitySubClass,
    level: entity.level,
    tier: entity.tier,
    experience: entity.experience,
    tierPoints: entity.tierPoints,
    stats: entity.stats,
    baseStats: entity.baseStats,
  });
}

async function loadEntityProgression(id: string): Promise<EntityProgression | null> {
  const row = await db.query.entityProgressions.findFirst({
    where: eq(entityProgressions.id, id),
  });
  
  if (!row) return null;
  
  // Reconstruct entity with calculated multipliers
  return {
    ...row,
    levelMultiplier: calculateLevelMultiplier(row.level),
    tierMultiplier: calculateTierMultiplier(row.tier),
    totalMultiplier: calculateLevelMultiplier(row.level) * calculateTierMultiplier(row.tier),
  };
}
```

---

## API Endpoint Example

```typescript
// In server/routes.ts

app.post('/api/entities/:id/add-experience', async (req, res) => {
  const { id } = req.params;
  const { experience } = req.body;
  
  // Load entity
  let entity = await loadEntityProgression(id);
  if (!entity) {
    return res.status(404).json({ error: 'Entity not found' });
  }
  
  // Add experience and level up
  entity = addExperience(entity, experience);
  
  // Save updated entity
  await saveEntityProgression(entity);
  
  // Get summary for response
  const summary = getProgressionSummary(entity);
  
  res.json({
    success: true,
    entity,
    summary,
    tierName: getTierName(entity.tier),
    tierColor: getTierColor(entity.tier),
  });
});
```

---

## Testing Examples

```typescript
import { describe, it, expect } from 'vitest';
import { createEntityProgression, addExperience, setLevelAndTier } from '@/shared/config';

describe('Progression System', () => {
  const baseStats = {
    power: 100, defense: 80, mobility: 60, utility: 50,
    precision: 70, endurance: 75, efficiency: 65, control: 60,
    tech: 50, command: 45, logistics: 55, survivability: 60,
    sensorRange: 40, energyUse: 30, maintenance: 35, adaptation: 45,
  };
  
  it('should create entity at level 1', () => {
    const entity = createEntityProgression('test-1', 'unit', 'infantry', 'trooper', 'standard', baseStats);
    expect(entity.level).toBe(1);
    expect(entity.tier).toBe(1);
    expect(entity.experience).toBe(0);
  });
  
  it('should level up with experience', () => {
    let entity = createEntityProgression('test-2', 'unit', 'infantry', 'trooper', 'standard', baseStats);
    entity = addExperience(entity, 100000);
    expect(entity.level).toBeGreaterThan(1);
  });
  
  it('should calculate stats correctly at max level', () => {
    const entity = setLevelAndTier(
      createEntityProgression('test-3', 'unit', 'infantry', 'trooper', 'standard', baseStats),
      999,
      99
    );
    expect(entity.level).toBe(999);
    expect(entity.tier).toBe(99);
    expect(entity.stats.power).toBeGreaterThan(baseStats.power);
  });
});
```

---

## Notes

- **Exponential Scaling**: Experience requirements and stat bonuses scale exponentially
- **Automatic Tier Progression**: Tiers increase every 10 levels automatically
- **Multiplier Stacking**: Level and tier multipliers stack multiplicatively
- **Stat Preservation**: Base stats are always preserved; only calculated stats change
- **Performance**: Use `ProgressionTables` for cached level/tier data instead of recalculating

---

**For more information, see:**
- `shared/config/progressionSystemConfig.ts` - Full implementation
- `shared/config/entityArchetypesConfig.ts` - 90 entity archetypes
- `README.md` - Game documentation

**Last Updated:** March 9, 2026
