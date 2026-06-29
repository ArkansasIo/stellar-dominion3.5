# Stellar Dominion - Developer Guide

**Version:** 0.8.2-beta  
**Last Updated:** December 2, 2024

---

## Quick Developer Setup

### 1. Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd stellar-dominion

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development
npm run dev
```

### 2. Database Setup
```bash
# Run migrations
npm run db:push

# Seed data (optional)
npm run seed

# View database schema
npm run db:studio
```

### 3. Type Checking
```bash
# Check TypeScript errors
npm run check

# Watch mode
npm run check -- --watch
```

---

## Project Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | UI components & pages |
| **State** | React Query | Server state management |
| **Styling** | TailwindCSS + Radix UI | Component library |
| **Backend** | Express.js + Node.js | REST API server |
| **Database** | PostgreSQL (Neon) | Data persistence |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Routing** | Wouter | Client-side navigation |
| **Build** | Vite | Fast build & dev server |

### Directory Structure

```
stellar-dominion/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/                  # Page components (one per route)
│   │   │   ├── TechnologyTree.tsx  # 🔬 Research tech tree interface
│   │   │   ├── Expeditions.tsx     # 🚀 Expedition management UI
│   │   │   ├── Fleet.tsx           # ⚔️ Fleet command interface
│   │   │   ├── Resources.tsx       # 💰 Resource overview
│   │   │   ├── Facilities.tsx      # 🏗️ Building management
│   │   │   └── ... (30+ pages)
│   │   ├── components/
│   │   │   ├── ui/                 # Radix UI components
│   │   │   ├── charts/             # Recharts visualizations
│   │   │   └── custom/             # Custom game components
│   │   ├── lib/
│   │   │   ├── gameContext.tsx     # Game state context
│   │   │   ├── queryClient.ts      # React Query config
│   │   │   └── hooks/              # Custom React hooks
│   │   ├── App.tsx                 # Main app router
│   │   └── main.tsx                # Entry point
│   └── index.html                  # HTML template
│
├── server/                          # Backend application
│   ├── routes.ts                   # 🌐 API route handlers
│   ├── storage.ts                  # 💾 Database operations
│   ├── index.ts                    # Server entry point
│   ├── logger.ts                   # Structured logging
│   ├── auth/                       # Authentication handlers
│   ├── db/
│   │   └── index.ts                # Database connection
│   └── middleware/                 # Express middleware
│
├── shared/                          # Shared between frontend & backend
│   └── schema.ts                   # 📋 Database schema + types
│
├── sql/                             # Database seed data
│   ├── seed_tech_tree.sql          # Technology data
│   └── stellaris_tech_seed.sql     # Alternate seed
│
├── docs/                            # Documentation
│   ├── GAME_DESIGN.md              # 📖 Game design document
│   ├── DEVELOPER_GUIDE.md          # 👨‍💻 This file
│   └── ARCHITECTURE.md             # 🏗️ Architecture details
│
├── README.md                        # Project overview
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                  # Vite configuration
└── drizzle.config.ts               # Drizzle ORM config
```

---

## Database Schema Reference

### Core Tables (`shared/schema.ts`)

#### Users & Sessions
```typescript
// #tag: authentication, session-management
users {
  id: UUID (primary key)
  username: string (unique)
  email: string (unique)
  passwordHash: string
  createdAt: timestamp
}

sessions {
  sid: string (primary key)
  sess: JSON (session data)
  expire: timestamp
}
```

#### Player Game State
```typescript
// #tag: game-state, progression
playerStates {
  id: UUID (primary key)
  userId: UUID (foreign key → users)
  
  // Progression
  setupComplete: boolean
  empireLevel: integer
  kardashevProgress: JSON
  totalTurns: integer
  
  // Resources: { metal, crystal, deuterium, energy }
  resources: JSON
  
  // Infrastructure
  buildings: JSON          // { metalMine: 5, shipyard: 2, ... }
  orbitalBuildings: JSON
  
  // Military
  units: JSON              // { fighters: 100, cruisers: 5, ... }
  
  // Research
  research: JSON           // { completed: [...], inProgress: {...} }
  
  // Economy
  commander: JSON
  government: JSON
  artifacts: JSON
}
```

#### Missions & Expeditions
```typescript
// #tag: fleet-movement, space-exploration
missions {
  id: UUID (primary key)
  userId: UUID
  type: string             // "attack", "transport", "espionage", etc.
  status: string           // "outbound", "return", "completed"
  target: string           // Galaxy coordinates [X:Y:Z]
  origin: string
  units: JSON              // Fleet composition
  departureTime: timestamp
  arrivalTime: timestamp
}

// #tag: space-exploration, fleet-management
expeditions {
  id: UUID (primary key)
  leaderId: UUID
  name: string
  type: string             // exploration, military, scientific, trade, conquest
  targetCoordinates: string
  status: string           // preparing, in_progress, completed, failed
  fleetComposition: JSON   // Ships and vessels
  troopComposition: JSON   // Ground units
  discoveries: JSON        // Resources found
  casualties: JSON         // Units lost
  startedAt: timestamp
  completedAt: timestamp
}

// #tag: space-exploration, encounters
expeditionTeams {
  id: UUID
  expeditionId: UUID
  unitId: UUID
  role: string             // commander, soldier, scout, scientist
  health: integer
  experience: integer
}

// #tag: space-exploration, encounters
expeditionEncounters {
  id: UUID
  expeditionId: UUID
  encounterType: string    // hostile, peaceful, discovery, environmental
  description: text
  rewards: JSON
  losses: JSON
}
```

#### Research System
```typescript
// #tag: research-tree, technology-progression
researchAreas {
  id: UUID (primary key)
  name: string             // "Physics", "Society", "Engineering"
  description: text
}

// #tag: research-tree, technology-progression
researchSubcategories {
  id: UUID
  areaId: UUID
  name: string             // e.g., "Propulsion", "Weapons"
  description: text
}

// #tag: research-tree, technology-progression
researchTechnologies {
  id: UUID
  subcategoryId: UUID
  name: string
  tier: integer            // 1-5
  cost: JSON               // { energy, credits }
  researchTime: integer
  prerequisites: JSON      // Array of required tech IDs
  bonuses: JSON            // { productionBonus, damageBonus, ... }
}

// #tag: research-tree, player-progression
playerResearchProgress {
  id: UUID
  playerId: UUID
  technologyId: UUID
  status: string           // locked, available, in_progress, completed
  progress: real           // 0-100%
  startedAt: timestamp
  completedAt: timestamp
}
```

#### Diplomacy & Economy
```typescript
// #tag: alliance-system, diplomacy
alliances {
  id: UUID
  leaderId: UUID
  name: string
  description: text
  members: JSON
  createdAt: timestamp
}

// #tag: player-trading, economy
marketOrders {
  id: UUID
  userId: UUID
  type: string             // "buy" or "sell"
  resource: string         // "metal", "crystal", "deuterium"
  amount: integer
  pricePerUnit: real
  status: string           // "active", "completed", "cancelled"
}
```

#### Combat & Battles
```typescript
// #tag: combat-system, space-battles
battles {
  id: UUID
  attackerId: UUID
  defenderId: UUID
  location: string
  attackerUnits: JSON
  defenderUnits: JSON
  winner: string
  casualties: JSON
  timestamp: timestamp
}

// #tag: combat-system, battle-logs
battleLogs {
  id: UUID
  battleId: UUID
  round: integer
  description: text
  damage: integer
  casualties: JSON
}
```

---

## API Routes Reference

### Authentication (`#tag: authentication`)
```
GET    /api/auth/user              - Get current user
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout
```

### Player State (`#tag: game-state`)
```
GET    /api/player/state           - Get player state
PUT    /api/player/state           - Update player state
POST   /api/player/setup           - Complete setup
```

### Resources (`#tag: resources, economy`)
```
GET    /api/resources              - Get resource overview
PUT    /api/resources/transfer     - Transfer resources
```

### Research (`#tag: research-tree, technology`)
```
GET    /api/research/areas         - Get research areas
GET    /api/research/subcategories - Get subcategories
GET    /api/research/technologies  - Get technologies
GET    /api/research/progress      - Get player progress
POST   /api/research/start         - Start researching tech
```

### Expeditions (`#tag: space-exploration, fleet`)
```
GET    /api/expeditions            - List expeditions
POST   /api/expeditions            - Create expedition
GET    /api/expeditions/:id/team   - Get expedition team
POST   /api/expeditions/:id/team   - Add team member
GET    /api/expeditions/:id/encounters - Get encounters
```

### Fleet (`#tag: fleet-management, military`)
```
GET    /api/fleet                  - List player ships
POST   /api/fleet                  - Build ship
GET    /api/fleet/:id              - Get ship details
PUT    /api/fleet/:id              - Update ship
DELETE /api/fleet/:id              - Scrap ship
```

### Combat (`#tag: combat-system`)
```
POST   /api/battles                - Initiate battle
GET    /api/battles                - Battle history
GET    /api/battles/:id/logs       - Battle round logs
```

### Alliance (`#tag: alliance-system, diplomacy`)
```
GET    /api/alliances              - List alliances
POST   /api/alliances              - Create alliance
POST   /api/alliances/:id/join     - Join alliance
```

### Market (`#tag: economy, player-trading`)
```
GET    /api/market/orders          - List market orders
POST   /api/market/orders          - Create order
DELETE /api/market/orders/:id      - Cancel order
```

---

## Key Components & Hooks

### Frontend Components

#### Pages (Main Views)

**TechnologyTree.tsx** `#tag: research-tree, ui, interactive`
- Displays research tech tree with expandable cards
- Shows technology tiers, costs, and prerequisites
- Interactive status tracking (locked, available, in_progress, completed)
- Tabbed navigation by subcategory
- **Key Functions:**
  - `fetchResearchData()` - Load research tree from API
  - `canUnlock(tech)` - Check if tech can be started
  - `startResearch(techId)` - Begin researching technology

**Expeditions.tsx** `#tag: space-exploration, fleet-management, ui`
- Launch interface for fleet/troop expeditions
- Fleet composition selector (corvettes, destroyers, etc.)
- Troop composition selector (soldiers, scouts, tanks)
- Team member health tracking
- Encounter log viewer
- **Key Functions:**
  - `launchExpedition()` - Create new expedition
  - `addTeamMember(unitId, role)` - Add unit to expedition
  - `resolveEncounter(encounterId)` - Handle expedition event

**Fleet.tsx** `#tag: fleet-management, military, ui`
- Fleet overview with ship listings
- Build new ships interface
- Fleet composition management
- Movement orders interface
- **Key Functions:**
  - `buildShip(shipType, quantity)` - Queue ship construction
  - `moveFleet(targetCoords)` - Set fleet destination
  - `combineFleets()` - Merge fleets

### Custom Hooks

```typescript
// #tag: game-state, hooks, state-management
usePlayerState()
- Returns: { state, updateState }
- Fetches player state from API
- Caches with React Query

// #tag: research-tree, hooks
useResearchTree()
- Returns: { areas, subcategories, technologies, progress }
- Loads all research data
- Updates on research completion

// #tag: fleet-management, hooks
useFleet()
- Returns: { ships, buildShip, moveFleet }
- Manages player fleet data
- Handles ship construction queue

// #tag: space-exploration, hooks
useExpeditions()
- Returns: { expeditions, launchExpedition, resolveEncounter }
- Tracks active expeditions
- Handles expedition events
```

---

## Storage Interface (`server/storage.ts`)

All database operations go through the `storage` object implementing `IStorage` interface.

### Example Usage

```typescript
// #tag: database, crud-operations
// Get player state
const state = await storage.getPlayerState(userId);

// Update player state
const updated = await storage.updatePlayerState(userId, {
  resources: { metal: 1000, crystal: 500 },
  empireLevel: 5
});

// Get expeditions
const expeditions = await storage.getExpeditions(userId);

// Create expedition
const exp = await storage.createExpedition(
  userId,
  "Deep Space Exploration",
  "exploration",
  "[5:3:2]",
  { corvettes: 5, destroyers: 2 },    // Fleet
  { soldiers: 100, scouts: 20 }       // Troops
);
```

---

## Adding New Features

### Step 1: Define Data Model
**File:** `shared/schema.ts`

```typescript
// #tag: database-schema, new-feature
export const newFeatureTable = pgTable("new_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // ... other columns
  createdAt: timestamp("created_at").defaultNow(),
});

export type NewFeature = typeof newFeatureTable.$inferSelect;
```

### Step 2: Create Storage Methods
**File:** `server/storage.ts`

```typescript
// #tag: database, crud-operations
interface IStorage {
  getNewFeature(userId: string): Promise<NewFeature | undefined>;
  createNewFeature(userId: string, data: any): Promise<NewFeature>;
  updateNewFeature(id: string, updates: Partial<NewFeature>): Promise<NewFeature>;
}

// Implementation
async getNewFeature(userId: string): Promise<NewFeature | undefined> {
  const result = await db.select()
    .from(newFeatureTable)
    .where(eq(newFeatureTable.userId, userId))
    .limit(1);
  return result[0];
}
```

### Step 3: Add API Routes
**File:** `server/routes.ts`

```typescript
// #tag: api-routes, rest-endpoints
app.get("/api/new-feature", isAuthenticated, async (req, res) => {
  try {
    const userId = getUserId(req);
    const feature = await storage.getNewFeature(userId);
    res.json(feature);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
```

### Step 4: Build Frontend Component
**File:** `client/src/pages/NewFeature.tsx`

```typescript
// #tag: react-component, ui, page
import { useQuery, useMutation } from "@tanstack/react-query";

export default function NewFeature() {
  const { data: feature } = useQuery({
    queryKey: ["new-feature"],
    queryFn: () => fetch("/api/new-feature").then(r => r.json())
  });

  return <div>{/* Component JSX */}</div>;
}
```

### Step 5: Register Route
**File:** `client/src/App.tsx`

```typescript
import NewFeature from "@/pages/NewFeature";

// In Router:
<Route path="/new-feature" component={NewFeature} />
```

---

## Code Quality Guidelines

### TypeScript

- ✅ Use strict mode (`strict: true`)
- ✅ Prefer `type` over `interface` for consistency
- ✅ Use discriminated unions for complex types
- ✅ Add JSDoc comments to public functions

```typescript
/**
 * Launches a new space expedition
 * @tag #space-exploration #fleet-management
 * @param userId - Player identifier
 * @param name - Expedition name
 * @returns Created expedition object
 * @throws Error if insufficient resources
 */
async launchExpedition(userId: string, name: string): Promise<Expedition>
```

### Component Development

- ✅ Use functional components with hooks
- ✅ Add `data-testid` to interactive elements
- ✅ Use Radix UI components for consistency
- ✅ Keep components under 500 lines
- ✅ Extract hooks for complex logic

```typescript
// ✅ Good
export default function TechCard({ tech }: { tech: Technology }) {
  return (
    <Card data-testid={`tech-card-${tech.id}`}>
      {/* JSX */}
    </Card>
  );
}

// ❌ Avoid: Too long, missing data-testid
```

### Error Handling

```typescript
// ✅ Good
try {
  const result = await storage.createExpedition(...);
  res.json(result);
} catch (error: any) {
  console.error("Failed to create expedition:", error);
  res.status(500).json({ message: "Failed to create expedition" });
}

// ❌ Avoid: Swallowing errors
try {
  await operation();
} catch (e) {
  // Silent fail
}
```

---

## Performance Tips

### Database
- Use indexes on frequently queried columns
- Batch operations when possible
- Use `limit` clauses for list endpoints
- Cache expensive computations

### Frontend
- Use React Query for server state caching
- Implement virtual scrolling for large lists
- Lazy load page components with code splitting
- Memoize expensive computations

### API
- Paginate large result sets
- Use compression (gzip)
- Set appropriate cache headers
- Implement rate limiting

---

## Testing

### Running Tests
```bash
# Type checking
npm run check

# (Integration/E2E tests coming soon)
```

### Manual Testing Checklist
- [ ] Create new account and complete setup
- [ ] Research technology and verify bonuses apply
- [ ] Launch expedition and check team roster
- [ ] Build ships and verify production
- [ ] Test market orders
- [ ] Verify combat resolution

---

## Debugging

### Server Logs
```bash
# View server logs in real-time
npm run dev

# Filter by keyword
# Search for "ERROR" or "expedition"
```

### Database
```bash
# Launch database UI
npm run db:studio

# View schema
npm run db:studio

# Execute raw queries
# (Use execute_sql tool)
```

### Browser DevTools
- Network tab: Monitor API calls
- Console: Check for JS errors
- React DevTools: Inspect component state
- LocalStorage: Verify cached data

---

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
```
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=5000
```

### Database Migration
```bash
# Push schema changes
npm run db:push

# Verify schema
npm run db:studio
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Database connection fails | Check DATABASE_URL env var |
| Migration timeout | Use `npm run db:push --force` |
| Type errors in schema | Check Drizzle ORM syntax |
| API returning 401 | Verify user is authenticated |
| React Query stale data | Call `queryClient.invalidateQueries()` |
| Hot reload not working | Restart dev server |

---

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Query Docs](https://tanstack.com/query/)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated:** December 2, 2024  
**Developed by:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))
