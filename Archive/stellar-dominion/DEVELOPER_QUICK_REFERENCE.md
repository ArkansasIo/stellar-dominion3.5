# Stellar Dominion - Developer Quick Reference

**Version:** 3.0 | **Status:** Production Ready | **Last Updated:** March 9, 2026
**New in v3.0:** Research Lab System, Game Assets System, 13+ API Endpoints ✨

---

## 🚀 Quick Start

### Starting the Dev Server
```bash
cd "d:\New folder\StellarDominion-2\StellarDominion-2"
npm run dev
# Server running on http://localhost:5000
```

### Type Checking
```bash
npm run check
# Validates TypeScript without building
```

### Database Migrations
```bash
npm run db:push
# Applies schema changes to PostgreSQL
```

### Production Build
```bash
npm run build
npm start
```

---

## ✨ NEW: Research Lab System (v3.0)

### Quick Reference

**Files:**
- `shared/config/researchQueueConfig.ts` - Lab configs & mechanics
- `server/services/researchLabService.ts` - Business logic (16 methods)
- `server/routes-researchlab.ts` - API endpoints (13+)
- `client/src/pages/ResearchLab.tsx` - React UI
- `docs/ResearchLab.md` - Full documentation

**Key Imports:**
```typescript
import {
  LAB_TIERS,                    // 8 lab configurations
  RESEARCH_BONUSES,             // 4 bonus types
  RESEARCH_ACCELERATION,        // Speedup mechanics
  ResearchQueuedItem,          // Type definitions
} from '@shared/config';

import { ResearchLabService } from '@/server/services/researchLabService';
```

**Quick Usage:**
```typescript
// Get labs
const labs = await ResearchLabService.getAvailableLabs(userId);

// Queue research
const item = await ResearchLabService.queueResearch(userId, 'tech-id', 'high');

// Accelerate (25/50/75/100%)
const result = await ResearchLabService.accelerateResearch(userId, itemId, 50);

// Get speed
const speed = await ResearchLabService.calculateSpeedMultiplier(userId);
```

**API Endpoints:**
```
GET    /api/research/labs                    - Available labs
POST   /api/research/labs/switch              - Change lab
GET    /api/research/queue                   - Get queue
POST   /api/research/queue/add                - Add research
POST   /api/research/accelerate               - Speed up
GET    /api/research/diagnostics              - Lab stats
```

---

## ✨ NEW: Game Assets System (v3.0)

**Files:**
- `shared/config/gameAssetsConfig.ts` - 100+ assets
- `client/src/pages/GameAssetsGallery.tsx` - UI showcase

**Quick Usage:**
```typescript
import {
  ASSET_SIZES,          // 7 size standards
  MENU_ASSETS,          // UI icons (26)
  PLANET_ASSETS,        // Planets (11)
  SHIP_ASSETS,          // Ships (10)
  getAssetById,
  getAssetsByCategory,
} from '@shared/config';

const asset = getAssetById('menu-research');
const menuAssets = MENU_ASSETS.filter(a => a.size === 'large');
```

---

## 📁 Project Structure Quick Guide

```
StellarDominion-2/
├─ client/                    # React Frontend
│  ├─ src/pages/
│  │  ├─ ResearchLab.tsx       # 🆕 Lab management UI
│  │  ├─ GameAssetsGallery.tsx # 🆕 Assets showcase
│  │  └─ [51+ other pages]
│  ├─ src/components/        # Reusable UI components
│  ├─ src/lib/               # Game logic, systems
│  └─ index.html             # Entry point
│
├─ server/                    # Express Backend
│  ├─ routes-researchlab.ts   # 🆕 Lab API (13+ endpoints)
│  ├─ services/
│  │  └─ researchLabService.ts # 🆕 Lab business logic
│  ├─ index.ts              # Main server entry
│  ├─ routes.ts             # 8+ API endpoints
│  ├─ storage.ts            # Database interface
│  ├─ logger.ts             # Logging utilities
│  └─ config/               # Server configuration
│
├─ shared/                    # Shared Code
│  ├─ config/
│  │  ├─ gameAssetsConfig.ts        # 🆕 100+ game assets
│  │  ├─ researchQueueConfig.ts     # 🆕 Lab system config
│  │  ├─ technologyTreeConfig.ts    # Tech tree (1,970 lines)
│  │  ├─ [27 other configs]
│  │  └─ index.ts                   # Export hub
│  ├─ schema.ts             # 🆕 Updated DB schema (7 new fields)
│  └─ errors/                # Error types
│
├─ docs/                      # Documentation
│  ├─ ResearchLab.md          # 🆕 Complete Research Lab guide
│  ├─ ResearchLabTestSummary.md # 🆕 Implementation summary
│  ├─ TechnologyTree.md       # Tech tree documentation
│  └─ [other docs]
│
├─ DEVELOPER_QUICK_REFERENCE.md # This file (updated v3.0)
├─ package.json              # Dependencies
└─ .env                       # Secrets (local only)

```

---

## 🔧 Common Development Tasks

### Adding a New Page/Feature

1. **Define Data Model** (if needed)
   ```typescript
   // shared/schema.ts
   export const myNewTable = pgTable('my_new_table', {
     id: text('id').primaryKey(),
     userId: text('user_id').notNull(),
     data: jsonb('data').notNull(),
     createdAt: timestamp('created_at').defaultNow(),
   });
   ```

2. **Add Database Methods**
   ```typescript
   // server/storage.ts
   async getMyData(userId: string): Promise<any> {
     const result = await this.db.select().from(myNewTable)
       .where(eq(myNewTable.userId, userId));
     return result;
   }
   ```

3. **Create API Route**
   ```typescript
   // server/routes.ts
   app.get('/api/mydata', (req, res) => {
     const userId = req.session?.userId;
     if (!userId) return res.status(401).json({ error: 'Unauthorized' });
     
     const data = storage.getMyData(userId);
     res.json(data);
   });
   ```

4. **Build React Component**
   ```typescript
   // client/src/pages/MyPage.tsx
   import { useQuery } from '@tanstack/react-query';
   
   export default function MyPage() {
     const { data, isLoading } = useQuery({
       queryKey: ['mydata'],
       queryFn: () => fetch('/api/mydata').then(r => r.json()),
     });
     
     if (isLoading) return <div>Loading...</div>;
     return <div>{/* Render data */}</div>;
   }
   ```

### Accessing Game Configuration

```typescript
// Import from centralized hub
import {
  PROGRESSION_CONSTANTS,
  ENTITY_ARCHETYPES_90,
  ENEMY_RACES,
  MEGASTRUCTURES,
  COMBAT_CONFIG,
  GAME_CONFIG,
} from '@/shared/config';

// Use in code
const levelMult = 1.0 + (0.01 * playerLevel);
const tierMult = 1.0 + (0.05 * playerTier);
const totalMult = levelMult * tierMult;

// All archetypes available
ENTITY_ARCHETYPES_90.forEach(archetype => {
  console.log(archetype.name);
});

// Enemy AI available
const krell = ENEMY_RACES.find(r => r.name === 'Krell Dominion');
```

### Running a Combat Simulation

```typescript
import { simulateCombat } from '@/lib/gameLogic';

const attackerFleet = {
  lightFighter: 10,
  cruiser: 5,
};

const defenderFleet = {
  battleship: 3,
  fighter: 20,
};

const result = simulateCombat(attackerFleet, defenderFleet);
console.log(result.winner);        // "attacker" | "defender" | "draw"
console.log(result.attackerLosses); // Metal value of losses
console.log(result.log);            // Battle round-by-round logs
```

### Adding a New Achievement

```typescript
// shared/config/achievementsConfig.ts
export const ACHIEVEMENTS = [
  {
    id: 'my_achievement',
    title: 'My Achievement',
    description: 'Do something awesome',
    category: 'exploration',
    rarity: 'rare',
    requirement: 10,
    progress: 0,
    completed: false,
    rewards: {
      xp: 1000,
      prestige: 50,
    },
  },
  // ... more achievements
];
```

---

## 📊 Database Schema Reference

### Players Table
```typescript
{
  id: string,              // Primary key
  username: string,        // Unique username
  password: string,       // SHA-256 hashed
  
  // Progression
  empireLevel: number,    // 1-999
  empireExperience: number,
  tier: number,           // 1-99
  tierExperience: number,
  prestigeLevel: number,  // Prestige cycle
  
  // Resources
  metal: number,
  crystal: number,
  energy: number,
  deuterium: number,
  
  // State JSON objects
  buildings: object,      // { roboticsFactory: 5, ... }
  research: object,       // { energyProduction: 3, ... }
  units: object,          // { lightFighter: 100, ... }
  
  // 🆕 Research Lab System (v3.0)
  researchQueue: jsonb,      // Queue items
  researchHistory: jsonb,    // Completed research
  activeResearch: jsonb,     // Current research
  researchBonuses: jsonb,    // Active bonuses
  researchModifiers: jsonb,  // Tech modifiers
  researchLab: jsonb,        // Equipped lab
  availableLabs: jsonb,      // Unlocked labs
  
  // 🆕 Travel System
  known_planets: jsonb,      // Discovered locations
  travel_state: jsonb,       // Current travel
  travel_log: jsonb,         // Travel history
  
  // Timestamps
  createdAt: Date,
  lastActiveAt: Date,
}
```

### Expeditions Table
```typescript
{
  id: string,
  userId: string,
  name: string,
  type: 'exploration' | 'military' | 'scientific' | 'trade' | 'conquest',
  targetCoordinates: string,  // "[X:Y:Z]"
  status: 'preparing' | 'in_progress' | 'completed' | 'failed',
  
  fleetComposition: object,   // { lightFighter: 10, cruiser: 5, ... }
  troopComposition: object,   // { marine: 100, commando: 5, ... }
  
  startedAt: Date,
  completedAt?: Date,
}
```

---

        <![CDATA[
---

## 🎮 Research Lab System (v3.0)

### Lab Configuration
```typescript
// 8 total lab configurations
LAB_TIERS = [
  { type: 'standard', level: 1, speedMod: 1.0, capacity: 5 },
  { type: 'standard', level: 2, speedMod: 1.2, capacity: 7 },
  { type: 'advanced', level: 1, speedMod: 1.5, capacity: 10 },
  { type: 'elite', level: 1, speedMod: 2.0, capacity: 15 },
  { type: 'ancient', level: 1, speedMod: 3.0, capacity: 20 },
  { type: 'megastructure', level: 1, speedMod: 5.0, capacity: 50 },
  // Plus progressive levels (2-12) for each
];

// Speed calculation
Speed = LAB_SPEED × BONUS_MULTIPLIERS × MODIFIER_MULTIPLIERS
```

### Research Acceleration
```typescript
// 4 speedup options with costs
25%:  1.5× cost, +25% speed boost
50%:  3.0× cost, +50% speed boost
75%:  6.0× cost, +75% speed boost
100%: 10.0× cost, instant completion

// Cost calculation
totalCost = baseCost × speedupMultiplier.costMultiplier
```

### Access Research Service
```typescript
import { ResearchLabService } from '@/server/services/researchLabService';

// In api route
app.get('/api/research/labs', async (req, res) => {
  const userId = req.session?.userId;
  const labs = await ResearchLabService.getAvailableLabs(userId);
  res.json(labs);
});
```

### React Component Testing
```typescript
// Test in ResearchLab.tsx
const { data: labData } = useQuery({
  queryKey: ["activeLab"],
  queryFn: () => fetch("/api/research/labs/active").then(r => r.json())
});

const { mutate: accelerate } = useMutation({
  mutationFn: (data) => fetch("/api/research/accelerate", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(r => r.json()),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["researchQueue"] })
});
```

---

## 🎨 Game Assets System (v3.0)

### Asset Categories
```typescript
// 100+ assets across 5 categories
MENU_ASSETS:       26 items (navigation, buildings, resources, status)
PLANET_ASSETS:     11 items (terrestrial, gas giants, exotic)
SHIP_ASSETS:       10 items (fighters, capitals, special)
TECH_BRANCH_ASSETS: 11 items (armor, shields, weapons, etc.)
BACKGROUND_ASSETS: Various background images

// Size standards (OGame convention)
Icon (24×24), Small (48×48), Medium (96×96), Large (192×192),
XL (384×384), 2XL (768×768), 3XL+ (1024+)
```

### Access Game Assets
```typescript
import {
  getAssetById,
  getAssetsByCategory,
  getAssetPlaceholder,
  MENU_ASSETS,
  PLANET_ASSETS,
} from '@/shared/config';

// Find specific asset
const asset = getAssetById('menu-research');

// Get all menu assets
const menus = getAssetsByCategory('menu');

// Get placeholder for development
const placeholder = getAssetPlaceholder('medium');
```

---

### Progression System
**Files:** `progressionSystemConfig.ts`
```typescript
// Constants
MAX_LEVEL: 999
MAX_TIER: 99
BASE_EXP_REQUIREMENT: 100
EXP_SCALING_FACTOR: 1.15

// Functions
calculateLevelMultiplier(level) → 1.0 + (0.01 × level)
calculateTierMultiplier(tier) → 1.0 + (0.05 × tier)
calculateStatValue(baseStat, level, tier) → baseStat × levelMult × tierMult
addExperience(entity, amount) → updates entity progress
setLevelAndTier(entity, level, tier) → direct assignment
```

### 4X Economy
**Files:** `gameConfig.ts`, `resourceConfig.ts`, `facilitiesConfig.ts`
```typescript
// Resources
Metal:      Base cost unit          (1.0x)
Crystal:    Technology component    (1.5x)
Deuterium:  Fuel/energy             (2.0x)

// Buildings produce resources
Production = BaseRate × Level × ResearchBonuses × 6 turns/min

// Tech tree has prerequisites
Tech(A) requires Tech(B) and Level 50+

// Prestige multipliers
resourceMultiplier: 1.0 - 3.0x
experienceMultiplier: 1.0 - 3.0x
researchMultiplier: 1.0 - 3.0x
```

### RTS Fleet System
**Files:** `unitData.ts`, `combatSystem.ts`
```typescript
// Fleet power calculation
fleetPower = Σ(unit.attack + unit.shield + unit.hull/10) × count

// Commander bonus
totalPower = fleetPower × commanderBonus(1.0-3.0x)

// Combat simulator
const battle = simulateCombat(attackerFleet, defenderFleet);
// Returns: winner, rounds, losses, debris, loot, log

// Unit construction
BUILD_QUEUE: FIFO construction queue
QUEUE_BONUS: Production multipliers apply
RESOURCE_COST: metal + crystal + deuterium
```

### Turn-Based Combat
**Files:** `combatEngine.ts`, `combatSystem.ts`
```typescript
// Turn system
6 turns per minute generated
+360 turns per hour
24-hour offline cap = 8,640 max
Current max = 1,000 turns

// Combat round (up to 6)
Round 1-6:
  1. Select targets (priority algorithm)
  2. Calculate attack damage
  3. Apply shield/armor/hull damage
  4. Damage shields regenerate
  5. Resolve casualties
  6. Log round

// Damage layers
Weapon Damage → Shield (up to maxShield)
Remaining → Armor (penetration calculation)
Remaining → Hull (health reduction)
```

### Galaxy & AI
**Files:** `enemyRacesConfig.ts`
```typescript
// 5 Enemy Races
Krell Dominion:     Warmonger, +30% combat
Zenith Collective:  Logical, +35% research
Varanthi Federation:Trader, +35% economy
Void Swarm:         Aggressive, +35% expansion
Celestial Ascendancy:Isolationist, balanced

// AI Behavior
decideAction(gameState) → AIAction
calculateRelationshipChange(event) → ±relationship
willHonorAlliance() → boolean (honor system)
shouldRetreat() → boolean (combat logic)

// Personality traits (0-100)
aggression, caution, greed, honor, cunning
```

---

## 🔌 API Endpoints Reference

### 🆕 Research Lab (v3.0) - 13+ Endpoints
```
GET    /api/research/labs                      - Get available labs
GET    /api/research/labs/active               - Get current lab
POST   /api/research/labs/switch                - Switch lab
GET    /api/research/queue                     - Get research queue
POST   /api/research/queue/add                  - Add to queue
POST   /api/research/queue/remove               - Remove from queue
POST   /api/research/queue/reorder              - Reorder queue
POST   /api/research/accelerate                 - Speed up research
GET    /api/research/bonuses/active             - Get active bonuses
POST   /api/research/bonuses/apply              - Apply bonus
GET    /api/research/diagnostics                - Get lab stats
GET    /api/research/speed-multiplier           - Get speed calc
```

### Technology Tree & Research
```
GET    /api/research/tree/stats                - Tree statistics
GET    /api/research/tree/branches              - All branches
GET    /api/research/tree/branch/:id            - Branch techs
GET    /api/research/tech/:id                   - Tech details
GET    /api/research/search?q=query             - Search techs
GET    /api/research/available                  - Available techs
GET    /api/research/rarity/:rarity             - Filter by rarity
```

---
```
POST   /api/auth/register       - Create new account
POST   /api/auth/login          - Authenticate user
POST   /api/auth/logout         - End session
GET    /api/auth/status         - Check auth status
```

### Game State
```
GET    /api/game/state          - Get player state
PATCH  /api/game/state          - Update player state
POST   /api/game/reset          - Hard reset (prestige)
```

### Resources
```
GET    /api/resources           - Get resource amounts
POST   /api/resources/transfer  - Trade with player
```

### Research
```
GET    /api/research            - Get tech tree progress
POST   /api/research/start      - Start researching tech
```

### Fleet
```
GET    /api/fleet               - Get fleet composition
POST   /api/fleet/build         - Add ship to queue
DELETE /api/fleet/:id           - Scrap ship
POST   /api/fleet/simulate      - Battle simulation
```

### Expeditions
```
GET    /api/expeditions         - List expeditions
POST   /api/expeditions         - Launch expedition
GET    /api/expeditions/:id     - Get expedition details
```

### Alliance
```
GET    /api/alliance            - Get alliance info
POST   /api/alliance/join       - Request to join
POST   /api/alliance/create     - Create alliance
```

---

## 🐛 Debugging Tips

### Check Database Connection
```typescript
// server/index.ts
console.log('Database URL:', process.env.DATABASE_URL);
console.log('Connected:', db ? 'Yes' : 'No');
```

### Verify Player State
```typescript
// Check if account can save
const state = await storage.getPlayerState(userId);
if (!state) {
  await storage.createPlayerState(userId, defaultState);
}
```

### Test Combat Simulation
```typescript
import { simulateCombat } from '@/lib/gameLogic';

const result = simulateCombat(
  { lightFighter: 10 },
  { cruiser: 5 }
);
console.log('Battle result:', result);
```

### Enable TypeScript Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## 📈 Performance Optimization

### Database Query
```typescript
// ❌ Bad - Full table scan
const user = await db.query.players.findFirst();

// ✅ Good - Indexed query
const user = await db.select().from(players)
  .where(eq(players.id, userId));
```

### React Component
```typescript
// ❌ Bad - Re-renders constantly
export function MyComponent(props) {
  return <div>{props.data}</div>;
}

// ✅ Good - Memoized
export const MyComponent = memo(function MyComponent(props) {
  return <div>{props.data}</div>;
});
```

### API Calls
```typescript
// ❌ Bad - New query every render
const data = useQuery({
  queryKey: ['data', Math.random()],
  queryFn: fetchData,
});

// ✅ Good - Stable query key
const data = useQuery({
  queryKey: ['data', userId],
  queryFn: () => fetchData(userId),
});
```

---

## 🔐 Security Checklist

- [ ] Validate all user input on server
- [ ] Use parameterized queries (Drizzle ORM)
- [ ] Hash passwords with SHA-256+
- [ ] Check authentication before API calls
- [ ] Verify permissions for admin operations
- [ ] Log sensitive actions (economy, level changes)
- [ ] Prevent SQL injection (ORM handles this)
- [ ] Sanitize error messages (don't leak DB info)
- [ ] Rate limit API endpoints
- [ ] Validate resource amounts (no negative resources)

---

## 📚 Configuration File Guide

### How to Add a New Config

1. **Create file** in `shared/config/myNewConfig.ts`
   ```typescript
   export const MY_CONFIG = {
     // ... data
   };
   ```

2. **Export from index** in `shared/config/index.ts`
   ```typescript
   export * from './myNewConfig';
   export { MY_CONFIG } from './myNewConfig';
   ```

3. **Use in code**
   ```typescript
   import { MY_CONFIG } from '@/shared/config';
   ```

### Config Organization Best Practices
- Keep configs DRY (don't repeat values)
- Use constants for magic numbers
- Export both named and default exports
- Group related configs in same file
- Add JSDoc comments with examples
- Keep file size under 1000 lines

---

## 🚢 Deployment Checklist

Before going to production:

- [ ] All TypeScript compiles (`npm run check`)
- [ ] No console.log or debug code
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] HTTPS enabled (if public)
- [ ] Database backups scheduled
- [ ] Monitoring/alerting set up
- [ ] Load testing done
- [ ] Security audit completed

---

## 🆘 Common Issues & Solutions

### Issue: Port 5000 already in use
```powershell
# Kill process holding port
Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue `
  | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Start dev server
npm run dev
```

### Issue: Database connection fails
```typescript
// Check env file has DATABASE_URL
console.log(process.env.DATABASE_URL);

// Make sure PostgreSQL is running
// Login: psql -U postgres

// Create database if needed
// CREATE DATABASE stellar_dominion;
```

### Issue: TypeScript errors on import
```typescript
// Make sure export exists in shared/config/index.ts
// Check spelling matches exactly
// Restart TypeScript server (Ctrl+Shift+P → TypeScript: Restart TS Server)
```

### Issue: React component not updating
```typescript
// Check useQuery key is stable
// Check state update in component
// Use React DevTools to verify props/state
// Clear browser cache (Ctrl+Shift+Delete)
```

---

## 📖 Documentation Links

- **Framework Validation:** [FRAMEWORK_VALIDATION.md](./FRAMEWORK_VALIDATION.md)
- **Architecture:** [FRAMEWORK_ARCHITECTURE.md](./FRAMEWORK_ARCHITECTURE.md)
- **Game Design:** [GAME_DESIGN.md](./GAME_DESIGN.md)
- **Developer Guide:** [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Architecture Details:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🎯 Key Metrics

| Metric | Value |
|--------|-------|
| Game Pages | 53 |
| Config Files | 27 |
| API Routes | 8+ |
| Entity Types | 90 |
| Technologies | 25+ |
| Enemy Races | 5 |
| Megastructures | 10 |
| Max Level | 999 |
| Max Tier | 99 |
| Turn Rate | 6/minute |
| Combat Rounds | 6 max |
| TypeScript Errors | 0 ✅ |
| Dev Server Status | Running ✅ |

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** March 9, 2026  
**Status:** Production Ready ✅

For more detailed information, see the complete framework documentation.
