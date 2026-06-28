# Technology Research System - Implementation Guide

Complete guide for using and extending the Technology Research System in StellarDominion.

## System Overview

The Technology Research System provides:
- **2,453+ technologies** across 11 branches (armor, shields, weapons, propulsion, sensors, power, computing, engineering, resources, medical, hyperspace)
- **Multi-level classification** (branch → class → type → category → subcategory → classification)
- **Exponential progression** with level (1.15^n) and tier (1.25^n) scaling
- **Prerequisite tracking** with dependency resolution
- **Comprehensive stats system** with primary, secondary, resistance, efficiency, and reliability
- **Player research tracking** with current research and researched tech storage
- **REST API** with 20+ endpoints for querying and managing research

## Architecture

### File Structure
```
shared/config/
├── technologyTreeConfig.ts           # Base framework & TechTreeManager class
├── technologyTreeExpandedConfig.ts   # Procedural generators (2,453 techs)
├── technologyTreeQuickReference.ts   # 40+ utility functions
└── index.ts                          # Exports all tech tree items

server/
├── routes-research.ts                # REST API endpoints
└── index.ts                          # Route registration

docs/
├── TechnologyTree.md                 # Full tech tree documentation
└── ResearchAPI.md                    # API reference guide
```

### Core Components

#### 1. TechTreeManager (Singleton)
```typescript
class TechTreeManager {
  getTechnology(id: string): TechnologyNode | undefined
  getTechByBranch(branch: TechBranch): TechnologyNode[]
  getTechByClass(techClass: TechClass): TechnologyNode[]
  getTechThatUnlock(prerequisiteId: string): TechnologyNode[]
  getPrerequisites(techId: string): TechnologyNode[]
  calculateTotalResearchCost(techId: string): number
  getAvailableUpgrades(techId: string): TechnologyNode[]
  getTechByBranchAndClass(branch: TechBranch, class: TechClass): TechnologyNode[]
  getStartingTechs(): TechnologyNode[]
  calculateStatBonus(techId: string, level: number, tier: number): Record<string, number>
  getResearchPath(fromId: string, toId: string): TechnologyNode[]
  getTotalTechCount(): number
  getTreeStatistics(): TreeStatistics
}
```

#### 2. TechnologyNode Interface
```typescript
interface TechnologyNode {
  id: string
  name: string
  branch: TechBranch                    // 11 branches
  class: TechClass                      // 7 classes
  type: string                          // 6+ types per branch
  category: string                      // 5+ categories per type
  subcategory: string                   // Multiple per category
  classification: string                // Unique classification
  
  level: number                         // 1-20+
  tier: number                          // 1-10
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  
  description: string
  researchCost: number                  // Science Points
  researchTime: number                  // Turns
  industrialCost: number                // Industrial capacity
  energyCost: number                    // Energy units
  
  stats: {
    primary: Record<string, number>     // Main bonuses
    secondary: Record<string, number>   // Secondary effects
    resistance: Record<string, number>  // Damage resistances
    efficiency: number                  // 0-1 scale
    reliability: number                 // 0-1 scale
  }
  
  bonuses: Record<string, number>
  penalties: Record<string, number>
  
  prerequisiteTechs: string[]           // Tech IDs
  unlocksUpgrades: string[]             // Tech IDs of upgrades
  maxUpgradeLevel: number
  upgradeSlots: number
  
  isResearchable: boolean
  isAvailableInMultiplayer: boolean
  factionLocked?: string                // Optional faction restriction
  minimumLevel: number                  // Player level requirement
  minimumTechLevel: number              // Total researched tech level requirement
  
  discoveryBonus: number                // XP bonus if discovered first
  passiveEffect?: string                // Description of passive effect
  stackable: boolean                    // Can apply multiple times
}
```

#### 3. TECH_PROGRESSION Formulas
```typescript
TECH_PROGRESSION = {
  levelBonus: (level: number, baseStat: number) => 
    baseStat * (1.15 ** (level - 1))
    
  tierBonus: (tier: number, baseStat: number) => 
    baseStat * (1.25 ** (tier - 1))
    
  combinedMultiplier: (level: number, tier: number) => 
    (1.15 ** (level - 1)) * (1.25 ** (tier - 1))
    
  researchCostForTech: (branchName: string, level: number, tier: number) =>
    (baseByBranch[branchName] || 100) * 
    (1.15 ** (level - 1)) * 
    (1.25 ** (tier - 1))
    
  researchTimeForTech: (level: number, tier: number) =>
    Math.ceil(5 * (1.1 ** (level - 1)) * (1.2 ** (tier - 1)))
}
```

## Usage Patterns

### Pattern 1: Query Single Technology
```typescript
import { getTechById } from '@/shared/config';

const tech = getTechById('armor-light-basic-composite-1');
if (tech) {
  console.log(`${tech.name}: ${tech.description}`);
  console.log(`Cost: ${tech.researchCost} SC`);
  console.log(`Time: ${tech.researchTime} turns`);
  console.log(`Stats:`, tech.stats);
}
```

### Pattern 2: Browse Branch
```typescript
import { getTechsByBranch, type TechBranch } from '@/shared/config';

const armors = getTechsByBranch('armor' as TechBranch);
console.log(`Found ${armors.length} armor technologies`);

// Group by class
const byClass = new Map<string, typeof armors>();
armors.forEach(tech => {
  if (!byClass.has(tech.class)) byClass.set(tech.class, []);
  byClass.get(tech.class)!.push(tech);
});

console.log(`Basic armor count: ${byClass.get('basic')?.length || 0}`);
```

### Pattern 3: Find Research Path
```typescript
import { techTreeManager } from '@/shared/config';

const path = techTreeManager.getResearchPath(
  'armor-light-basic-composite-1',
  'armor-military-alloy-5'
);

console.log(`Research path has ${path.length} steps`);
path.forEach((tech, idx) => {
  console.log(`${idx + 1}. ${tech.name} (${tech.researchCost} SC)`);
});

const totalCost = techTreeManager.calculateTotalResearchCost(
  'armor-military-alloy-5'
);
console.log(`Total cost: ${totalCost} SC`);
```

### Pattern 4: Filter Available Techs
```typescript
import { getAllTechnologies } from '@/shared/config';

const epicTechs = getAllTechnologies()
  .filter(tech => tech.rarity === 'epic' && tech.level <= 10);

const factionSpecific = getAllTechnologies()
  .filter(tech => tech.factionLocked === 'Military');

const noPrereqs = getAllTechnologies()
  .filter(tech => tech.prerequisiteTechs.length === 0);

console.log(`Epic techs: ${epicTechs.length}`);
console.log(`Military faction techs: ${factionSpecific.length}`);
console.log(`Starting techs: ${noPrereqs.length}`);
```

### Pattern 5: Calculate Stats with Bonuses
```typescript
import { techTreeManager, TECH_PROGRESSION } from '@/shared/config';

const tech = getTechById('armor-light-basic-composite-1')!;
const level = 5;
const tier = 2;

// Get stats at specific level/tier
const statBonus = techTreeManager.calculateStatBonus(tech.id, level, tier);

// Apply to base value
const baseArmor = tech.stats.primary.armor_rating || 10;
const boostedArmor = baseArmor * TECH_PROGRESSION.levelBonus(level, 1);

console.log(`Base armor: ${baseArmor}`);
console.log(`Boosted armor at L${level}: ${boostedArmor}`);
console.log(`All bonuses:`, statBonus);
```

### Pattern 6: API Integration (Client-Side)
```typescript
// Get all techs in a branch
const response = await fetch('/api/research/tree/branch/armor');
const data = await response.json();
console.log(`Armor techs: ${data.count}`);

// Get tech details
const techDetails = await fetch('/api/research/tech/armor-light-basic-composite-1');
const tech = await techDetails.json();
console.log(`${tech.name}: ${tech.researchCost} SC`);

// Start research
const startRes = await fetch('/api/research/player/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ techId: 'armor-light-basic-composite-2' })
});
const result = await startRes.json();
console.log(result.message);
```

## Building with Extensions

### Adding New Technologies

**Method 1: Add to Base Config**
```typescript
// In technologyTreeConfig.ts - add to appropriate array
const ARMOR_TECHS: TechnologyNode[] = [
  // ... existing techs
  {
    id: "armor-custom-experimental-1",
    name: "Custom Experimental Armor",
    branch: "armor",
    class: "experimental",
    // ... full node properties
  }
];
```

**Method 2: Extend via Generator**
```typescript
// In technologyTreeExpandedConfig.ts - create new generator
function generateCustomTechs(): TechnologyNode[] {
  const techs: TechnologyNode[] = [];
  
  for (let i = 1; i <= 50; i++) {
    techs.push({
      id: `custom-tech-${i}`,
      name: `Custom Tech ${i}`,
      // ... properties
    });
  }
  
  return techs;
}

export const CUSTOM_TECHS = generateCustomTechs();
```

**Method 3: Add to Exports**
```typescript
// In shared/config/index.ts
export { CUSTOM_TECHS } from './technologyTreeCustomConfig';
export * as CustomTechConfig from './technologyTreeCustomConfig';
```

### Creating New Branches

```typescript
// In technologyTreeConfig.ts - extend TechBranch type
type TechBranch = 'armor' | 'shields' | /* ... */ | 'newbranch';

// Create new generator
function generateNewBranchTechs(): TechnologyNode[] {
  // Generate 100-500 technologies for new branch
  return [];
}

export const NEWBRANCH_TECHS = generateNewBranchTechs();

// Add to TechTreeManager
private allTechs: TechnologyNode[] = [
  ...ARMOR_TECHS,
  // ... existing
  ...NEWBRANCH_TECHS
];
```

## Database Integration (Future)

When connecting to database, create tables:

```sql
-- Player research progression
CREATE TABLE player_researched_tech (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  tech_id VARCHAR(255),
  level INT DEFAULT 1,
  tier INT DEFAULT 1,
  researched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, tech_id)
);

-- Active research
CREATE TABLE player_active_research (
  id SERIAL PRIMARY KEY,
  player_id UUID REFERENCES users(id),
  tech_id VARCHAR(255) UNIQUE,
  start_turn INT,
  completion_turn INT,
  progress FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faction research bonuses
CREATE TABLE faction_research_bonus (
  id SERIAL PRIMARY KEY,
  faction_id VARCHAR(255),
  tech_branch VARCHAR(50),
  bonus_percentage FLOAT,
  UNIQUE(faction_id, tech_branch)
);
```

## Statistics

### Current System State
- **Total Technologies**: 2,453+
- **Branches**: 11
- **Classes per Branch**: 5-7
- **Average Techs per Branch**: 223
- **Rarities**: 6 (common, uncommon, rare, epic, legendary, mythic)
- **Max Level**: 20+
- **Max Tier**: 10
- **Stat Categories**: 5 (primary, secondary, resistance, efficiency, reliability)

### Distribution
| Branch | Techs | Generator | Avg Level |
|--------|-------|-----------|-----------|
| Armor | 600 | 5×8×5×3 | 8.5 |
| Shields | 250 | 5×5×5×2 | 7.8 |
| Weapons | 420 | 7×6×5×2 | 9.2 |
| Propulsion | 250 | 5×5×5×2 | 7.5 |
| Sensors | 168 | 7×6×4 | 6.8 |
| Power | 150 | 6×5×5 | 7.2 |
| Computing | 100 | 5×5×4 | 6.5 |
| Engineering | 120 | 6×5×4 | 7.0 |
| Resources | 120 | 6×5×4 | 7.0 |
| Medical | 150 | 6×5×5 | 7.8 |
| Hyperspace | 125 | 5×5×5 | 8.2 |

## Performance Considerations

### Optimization Tips
1. **Use getTechById()** for O(1) lookups (uses Map internally)
2. **Cache getTechsByBranch()** results if calling multiple times
3. **Lazy-load expanded techs** - only generated when imported
4. **Filter client-side** - fetch all once, filter/sort in memory
5. **Batch API requests** - get tree stats once at startup

### Caching Strategy
```typescript
// Cache branch techs on first load
const cachedBranches = new Map<TechBranch, TechnologyNode[]>();

export function getCachedBranch(branch: TechBranch) {
  if (!cachedBranches.has(branch)) {
    cachedBranches.set(branch, getTechsByBranch(branch));
  }
  return cachedBranches.get(branch)!;
}
```

## Debugging

### Common Issues

**Issue: Tech not found**
```typescript
const tech = getTechById('armor-light-basic-composite-1');
if (!tech) {
  console.log('Available techs:', getAllTechnologies().length);
  console.log('Branch armor:', getTechsByBranch('armor').length);
}
```

**Issue: Prerequisite validation fails**
```typescript
const prerequisites = techTreeManager.getPrerequisites(techId);
prerequisites.forEach(prereq => {
  console.log(`Need: ${prereq.name} (${prereq.id})`);
});
```

**Issue: Cost calculation incorrect**
```typescript
const tech = getTechById(techId)!;
const baseCost = TECH_PROGRESSION.researchCostForTech('armor', tech.level, tech.tier);
const withPrereqs = techTreeManager.calculateTotalResearchCost(techId);
console.log(`Base: ${baseCost}, With prereqs: ${withPrereqs}`);
```

## Resources

- **API Docs**: [ResearchAPI.md](ResearchAPI.md)
- **Tech Tree Reference**: [TechnologyTree.md](TechnologyTree.md)
- **Quick Functions**: See `technologyTreeQuickReference.ts` for 40+ utility functions
- **Type Definitions**: See `technologyTreeConfig.ts` for complete interface definitions

