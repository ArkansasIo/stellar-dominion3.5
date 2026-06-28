# Stellar Dominion - Architecture Document

**Version:** 0.8.2-beta  
**Last Updated:** December 2, 2024

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Pages (30+)  │  │ Components   │  │ Custom Hooks         │   │
│  │ - Fleet      │  │ - UI Library │  │ - usePlayerState()   │   │
│  │ - Research   │  │ - Charts     │  │ - useResearchTree()  │   │
│  │ - Expeditions│  │ - Forms      │  │ - useExpeditions()   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              React Query (Server State)                  │    │
│  │  Caching • Synchronization • Background Updates         │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Routes       │  │ Middleware   │  │ Controllers          │   │
│  │ - Auth       │  │ - Auth       │  │ - getPlayerState()   │   │
│  │ - Research   │  │ - Logging    │  │ - createExpedition() │   │
│  │ - Fleet      │  │ - CORS       │  │ - resolveBattle()    │   │
│  │ - Expeditions│  │ - Validation │  │ - researchTech()     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                            ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │         Storage Layer (Database Operations)             │    │
│  │  All database queries go through storage interface      │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ SQL
┌─────────────────────────────────────────────────────────────────┐
│                   DATA LAYER (PostgreSQL)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Tables: users, playerStates, expeditions, research...  │    │
│  │ Indexes: Fast queries on userId, expeditionId, etc.    │    │
│  │ Relationships: Foreign keys maintain referential        │    │
│  │              integrity                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Request → Response Flow
```
User Action
    ↓
React Event Handler
    ↓
useMutation() Call
    ↓
POST /api/endpoint
    ↓
Express Route Handler
    ↓
Validation (Zod)
    ↓
Storage Method Call
    ↓
Database Query (Drizzle ORM)
    ↓
PostgreSQL
    ↓
Drizzle Result
    ↓
Storage Method Returns
    ↓
Route Handler Response
    ↓
React Query Cache Update
    ↓
Component Re-render
    ↓
User Sees Result
```

### Expedition System Flow
```
Player Launches Expedition
    ↓ (name, type, targetCoords, fleetComp, troopComp)
    ↓
POST /api/expeditions
    ↓
storage.createExpedition()
    ↓
INSERT INTO expeditions
    ↓
Create expedition_teams rows
    ↓
Expedition created with status="preparing"
    ↓
Player adds team members
    ↓
POST /api/expeditions/:id/team
    ↓
storage.addTeamMember()
    ↓
INSERT INTO expedition_teams
    ↓
Team member added
    ↓
(Server-side: Every 5 turns, process expedition)
    ↓
Generate encounters
    ↓
POST encounter resolution
    ↓
Award resources/casualties
    ↓
Expedition status → "completed"
```

### Research Progression Flow
```
Player Clicks "Research Tech"
    ↓
POST /api/research/start {techId}
    ↓
Storage: upsertPlayerResearch()
    ↓
INSERT/UPDATE player_research_progress
    ↓
status = "in_progress"
    ↓
(Game Loop: Every 10 turns)
    ↓
Calculate research points from labs
    ↓
Add to progress % for active research
    ↓
If progress >= 100%
    ├─ Mark as "completed"
    ├─ Update playerState.research
    ├─ Apply bonuses (production, damage, etc.)
    ├─ Unlock new techs
    └─ Trigger dependent techs
    ↓
React Query invalidates queries
    ↓
UI refreshes with new tech status
```

---

## Component Hierarchy

```
App
├── LoadingSplash
│   └── Game initialization
├── Router (Wouter)
│   ├── /auth → Auth
│   ├── / → Overview
│   ├── /resources → Resources
│   ├── /facilities → Facilities
│   │   └── Building management
│   ├── /tech-tree → TechTree (old)
│   ├── /technology-tree → TechnologyTree
│   │   ├── ResearchAreaCard
│   │   ├── SubcategoryCard
│   │   │   └── TechCard
│   │   │       └── PrerequisiteDisplay
│   │   └── ProgressBar
│   ├── /expeditions → Expeditions
│   │   ├── ExpeditionCard
│   │   │   ├── FleetComposition
│   │   │   └── TroopComposition
│   │   ├── TeamRoster
│   │   ├── EncounterLog
│   │   └── LaunchInterface
│   ├── /fleet → Fleet
│   │   ├── ShipCard
│   │   └── ShipyardInterface
│   ├── /galaxy → Galaxy
│   └── ... (30+ pages)
│
└── Providers
    ├── GameProvider (Context)
    ├── QueryClientProvider (React Query)
    ├── TooltipProvider (Radix)
    └── Toaster (Sonner)
```

---

## State Management Strategy

### Global State (GameProvider)
```typescript
// #tag: state-management, context
interface GameState {
  user: User | null;
  playerState: PlayerState | null;
  isLoading: boolean;
  error: string | null;
}

interface GameContextType {
  state: GameState;
  updatePlayerState: (updates: Partial<PlayerState>) => Promise<void>;
  // ... other methods
}
```

### Server State (React Query)
```typescript
// #tag: state-management, caching
useQuery({
  queryKey: ["player-state"],      // Cache key
  queryFn: () => fetch("/api/player/state").then(r => r.json()),
  staleTime: 30000,                 // 30 seconds
  refetchInterval: 60000            // Refetch every minute
});
```

### Local State (useState)
```typescript
// #tag: state-management, local
const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
const [expeditionFilter, setExpeditionFilter] = useState<ExpeditionType>("all");
```

---

## Database Relationships

```
users
├── playerStates (1:1)
├── missions (1:N)
├── expeditions (1:N)
│   ├── expeditionTeams (1:N)
│   │   └── units (N:1)
│   └── expeditionEncounters (1:N)
├── playerResearchProgress (1:N)
│   └── researchTechnologies (N:1)
├── battles (1:N as attacker or defender)
│   └── battleLogs (1:N)
├── marketOrders (1:N)
└── allianceMembers (1:N)
    └── alliances (N:1)
```

---

## API Architecture

### Endpoint Organization

**Pattern:** `/api/{resource}/{action}`

```
/api/auth/*              - Authentication
/api/player/*            - Player state
/api/resources/*         - Resource management
/api/research/*          - Technology research
/api/expeditions/*       - Space expeditions
/api/fleet/*             - Fleet management
/api/battles/*           - Combat system
/api/missions/*          - Fleet missions
/api/alliances/*         - Alliance diplomacy
/api/market/*            - Trading market
```

### Request/Response Pattern

**Request:**
```typescript
{
  method: "POST",
  url: "/api/expeditions",
  headers: { "Content-Type": "application/json" },
  body: {
    name: "Deep Space Exploration",
    type: "exploration",
    targetCoordinates: "[5:3:2]",
    fleetComposition: { corvettes: 5 },
    troopComposition: { soldiers: 100 }
  }
}
```

**Response (Success):**
```typescript
{
  status: 200,
  body: {
    id: "uuid",
    leaderId: "uuid",
    name: "Deep Space Exploration",
    type: "exploration",
    status: "preparing",
    startedAt: "2024-12-02T20:40:00Z",
    discoveries: [],
    casualties: {}
  }
}
```

**Response (Error):**
```typescript
{
  status: 500,
  body: {
    message: "Failed to create expedition"
  }
}
```

---

## Performance Considerations

### Caching Strategy

```
┌─────────────────────────────────────┐
│    Browser Cache (LocalStorage)     │
│  - Static assets (fonts, icons)     │
│  - User preferences                 │
│  - Cache duration: 1 week           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   React Query Cache (Memory)        │
│  - API responses                    │
│  - Stale time: 30 seconds           │
│  - Cache time: 5 minutes            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Server Cache (Redis - future)      │
│  - Research costs & bonuses         │
│  - Static game data                 │
│  - Cache duration: 1 day            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Database Indexes                  │
│  - userId (players list)            │
│  - expeditionId (team queries)      │
│  - playerId (research progress)     │
└─────────────────────────────────────┘
```

### Scalability Points

| Component | Bottleneck | Solution |
|-----------|-----------|----------|
| **Database** | Large player base | Sharding, read replicas |
| **API Server** | Request throughput | Load balancing, caching |
| **Frontend** | Large lists | Virtual scrolling, pagination |
| **Real-time** | Turn processing | Job queue (Bull/BullMQ) |

---

## Security Architecture

### Authentication Flow
```
User Login
    ↓
Passport Local Strategy
    ↓
Hash comparison (bcrypt)
    ↓
Session creation
    ↓
Set httpOnly cookie
    ↓
Redirect to /
    ↓
Middleware: isAuthenticated checks req.user
```

### Authorization Pattern
```typescript
// #tag: security, authorization
app.get("/api/expeditions", isAuthenticated, async (req, res) => {
  const userId = getUserId(req);  // From authenticated session
  const expeditions = await storage.getExpeditions(userId);
  res.json(expeditions);
});
```

### Data Isolation
- Each player can only see their own resources
- Missions/expeditions scoped by userId
- Battle results verified server-side
- Market orders immutable after execution

---

## Deployment Architecture

### Development Environment
```
Vite Dev Server (port 5000)
    ↓ Hot Module Reload
Webpack Watch
    ↓
tsx Watcher (server)
    ↓
Auto-restart on changes
```

### Production Environment
```
┌──────────────────────┐
│   Nginx/Load         │
│   Balancer           │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  Node.js Process     │
│  (Cluster)           │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  PostgreSQL Pool     │
│  (Connection Pool)   │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  Redis Cache         │
│  (Optional)          │
└──────────────────────┘
```

---

## Error Handling Strategy

### Error Types

| Type | Handling | User Message |
|------|----------|--------------|
| **Validation** | 400 Bad Request | "Invalid input: {field}" |
| **Auth** | 401 Unauthorized | "Please log in" |
| **Permission** | 403 Forbidden | "Access denied" |
| **Not Found** | 404 Not Found | "Resource not found" |
| **Server** | 500 Server Error | "Something went wrong" |

### Error Flow
```typescript
// Client-side
const { mutate, isPending, error } = useMutation({
  mutationFn: async (data) => {
    const res = await fetch("/api/expeditions", { 
      method: "POST", 
      body: JSON.stringify(data) 
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  },
  onError: (error) => {
    toast.error(error.message);  // Show to user
  }
});

// Server-side
try {
  const expedition = await storage.createExpedition(...);
  res.json(expedition);
} catch (error: any) {
  logger.error("Expedition creation failed", error);
  res.status(500).json({ message: "Failed to create expedition" });
}
```

---

## Future Architecture Improvements

### Short Term (Next Sprint)
- [ ] Implement response caching middleware
- [ ] Add database connection pooling
- [ ] Implement request rate limiting
- [ ] Add input validation with Zod

### Medium Term (Next Quarter)
- [ ] Add Redis cache layer
- [ ] Implement job queue for turn processing
- [ ] Add WebSocket for real-time updates
- [ ] Implement GraphQL API alternative

### Long Term (Future)
- [ ] Microservices architecture
- [ ] Event sourcing for game events
- [ ] CQRS pattern for reporting
- [ ] Blockchain integration (NFT ships/items)

---

## Technology Decisions

### Why React?
- Large ecosystem
- Component reusability
- Strong TypeScript support
- Large community

### Why Express.js?
- Minimal, unopinionated
- Fast development
- Excellent middleware ecosystem
- Proven in production

### Why PostgreSQL?
- ACID compliance
- JSON support (JSONB)
- Full-text search
- Excellent TypeScript ORM (Drizzle)

### Why Drizzle ORM?
- Type-safe queries
- SQL-like syntax
- Schema migrations
- Zero runtime overhead

---

**Last Updated:** December 2, 2024  
**Developed by:** Stephen ([@ArkansasIo](https://github.com/ArkansasIo) | [@Apocalypsecoder0](https://github.com/Apocalypsecoder0))
