# Research API Endpoint Map

Visual guide to the Research API structure and endpoint organization.

```
/api/research
│
├─ Tree Information (Public)
│  ├─ GET /tree/stats                      [Tree statistics]
│  ├─ GET /tree/branches                   [List all branches]
│  └─ GET /tree/branch/{branchId}          [Get branch techs]
│
├─ Technology Details (Public)
│  ├─ GET /tech/{techId}                   [Tech full details]
│  └─ GET /tech/path/{fromId}/{toId}       [Research path between techs]
│
├─ Search & Filter (Public)
│  ├─ GET /search?q=query&rarity=epic      [Search by name/description]
│  ├─ GET /available?playerLevel=10        [Filter by player level]
│  └─ GET /rarity/{rarity}                 [Filter by rarity]
│
├─ Calculations (Public)
│  ├─ POST /calculate-cost                 [Calculate research cost]
│  └─ GET /starter-techs                   [Get starting technologies]
│
└─ Player Research (Requires Authentication)
   ├─ GET /player/progress                 [Get research history]
   ├─ POST /player/start                   [Start researching tech]
   ├─ POST /player/complete                [Complete current research]
   └─ GET /player/recommended              [Get recommendations]
```

## Endpoint Categories

### 1. Tree Information
Browse the overall technology tree structure.

```
GET /api/research/tree/stats
├─ Returns: totalTechnologies, branchBreakdown, classBreakdown
├─ Use: Get overview of entire system
└─ Example: Dashboard, admin stats

GET /api/research/tree/branches
├─ Returns: Array of branch info (id, name, count, averageLevel)
├─ Use: Display branch selection UI
└─ Example: Tech browser root view

GET /api/research/tree/branch/{branchId}
├─ Returns: All techs in branch, grouped by class
├─ Use: Browse specific branch
└─ Example: View all armor techs
```

### 2. Technology Details
Get detailed information about specific technologies.

```
GET /api/research/tech/{techId}
├─ Returns: Full tech node with prerequisites, unlocks, upgrades
├─ Use: Display tech details panel
└─ Example: Click on tech to see full info

GET /api/research/tech/path/{fromId}/{toId}
├─ Returns: Research path with all intermediate techs
├─ Use: Plan research strategy
└─ Example: "How do I get from basic armor to military alloy?"
```

### 3. Search & Filter
Find technologies by criteria.

```
GET /api/research/search?q=shield&rarity=epic
├─ Returns: Matching techs (limited to 50)
├─ Use: Search bar functionality
└─ Example: Find all shield-related epic techs

GET /api/research/available?playerLevel=10
├─ Returns: Techs available at player level
├─ Use: Show available research options
└─ Example: What can a level 10 player research?

GET /api/research/rarity/{rarity}
├─ Returns: All techs of specific rarity
├─ Use: Filter by rarity level
└─ Example: Show all common techs for tutorials
```

### 4. Calculations
Calculate costs and find optimal techs.

```
POST /api/research/calculate-cost
├─ Request: { level, tier, branchName }
├─ Returns: baseCost, timeRequired, multipliers
├─ Use: Show cost preview before research
└─ Example: How much does level 5 armor cost?

GET /api/research/starter-techs
├─ Returns: All techs with no prerequisites
├─ Use: Show starting options
└─ Example: First tech recommendations
```

### 5. Player Research (Authenticated)
Track and manage player's research progress.

```
GET /api/research/player/progress
├─ Returns: researchedCount, currentResearch, researchedTechs
├─ Use: Load player's research state
├─ Auth: Required
└─ Example: Restore player state on login

POST /api/research/player/start
├─ Request: { techId }
├─ Returns: currentResearch info
├─ Auth: Required
└─ Example: Player clicks "Start Research"

POST /api/research/player/complete
├─ Returns: completedTech, researchedCount
├─ Auth: Required
└─ Example: Research timer expires, unlock tech

GET /api/research/player/recommended
├─ Returns: Recommended techs based on level/researched
├─ Auth: Required
└─ Example: Show "Next Steps" recommendations
```

## Request/Response Patterns

### Pattern 1: Simple GET (Tree/Tech Info)
```
GET /api/research/tree/branches

Response 200:
{
  "branches": [
    { "id": "armor", "name": "Armor", "count": 600, ... },
    ...
  ]
}

Response 500:
{
  "message": "Failed to fetch branches"
}
```

### Pattern 2: Search/Filter with Query Params
```
GET /api/research/search?q=shield&rarity=epic

Query Params:
  q: "shield"
  rarity: "epic"

Response 200:
{
  "query": "shield",
  "results": [ ... ],
  "total": 45
}
```

### Pattern 3: Parametrized GET (Single Resource)
```
GET /api/research/tech/armor-light-basic-composite-1

Response 200:
{
  "id": "armor-light-basic-composite-1",
  "name": "Basic Composite Armor",
  ...
}

Response 404:
{
  "message": "Technology not found"
}
```

### Pattern 4: POST with Calculation
```
POST /api/research/calculate-cost
Content-Type: application/json

{
  "level": 5,
  "tier": 2,
  "branchName": "armor"
}

Response 200:
{
  "baseCost": 250,
  "timeRequired": 10,
  "levelMultiplier": 1.74,
  "tierMultiplier": 1.56,
  ...
}

Response 400:
{
  "message": "Missing required parameters"
}
```

### Pattern 5: Authenticated Action (Player)
```
POST /api/research/player/start
Authorization: Cookie (session)
Content-Type: application/json

{
  "techId": "armor-light-basic-composite-2"
}

Response 200:
{
  "success": true,
  "currentResearch": { ... },
  "message": "Research started: Basic Composite Armor II"
}

Response 400 - Missing Prerequisites:
{
  "message": "Missing prerequisites",
  "missingPrerequisites": [ ... ]
}

Response 401:
{
  "message": "Not authenticated"
}
```

## Common Workflows

### Workflow 1: Browse and Learn
1. GET `/tree/branches` - Get branch list
2. GET `/tree/branch/armor` - View armor tech tree
3. GET `/tech/armor-light-basic-composite-1` - View tech details
4. GET `/tech/path/armor-light-basic-composite-1/armor-military-alloy-1` - Plan path

### Workflow 2: Player First Time
1. GET `/starter-techs` - Show starting options
2. POST `/player/start` - Player picks one
3. Store `currentResearch` data locally
4. GET `/player/recommended` - Show next options
5. On game turn update, check if research complete
6. POST `/player/complete` - Unlock tech

### Workflow 3: Search for Specific Tech
1. GET `/search?q=shield` - Find shield techs
2. GET `/search?q=shield&rarity=epic` - Filter to epic
3. GET `/tech/shields-multi-phase-military-1` - View chosen tech
4. POST `/player/start` - Begin research

### Workflow 4: Show Available Options
1. GET `/available?playerLevel=10` - What's available
2. GET `/player/progress` - What player already has
3. GET `/player/recommended` - What player should do next
4. Filter out already researched from available

### Workflow 5: Calculate Before Research
1. User hovers over tech
2. POST `/calculate-cost` - Get exact cost/time
3. Show preview: "This will take 15 turns and cost 450 SC"
4. User confirms

## Performance Notes

### Caching Opportunities
- `/tree/stats` - Cache for 5 minutes (changes rarely)
- `/tree/branches` - Cache for 5 minutes
- `/search` - Client-side caching of results
- `/available?playerLevel=X` - Cache per player level

### Bulk Loading Pattern
```typescript
// Instead of individual requests:
const tech1 = GET /tech/id1          // 1 request
const tech2 = GET /tech/id2          // 2 requests
const tech3 = GET /tech/id3          // 3 requests

// Consider:
const branch = GET /tree/branch/armor  // 1 request gets all at once
// Then filter locally
```

### Client-Side Storage
```typescript
// On app startup, load once:
const stats = GET /tree/stats;
const allTechs = GET /tree/branch/armor; // + other branches

// Then use locally for:
- Filtering
- Searching
- Displaying
- Path calculation (O(n) locally is fine)
```

## Error Handling Patterns

### Pattern 1: Missing Tech
```
GET /api/research/tech/invalid-id

Response 404:
{
  "message": "Technology not found"
}

Client: Show "Technology not found" error
```

### Pattern 2: Invalid Parameter
```
POST /api/research/calculate-cost
{ "level": 5 }  // Missing tier and branchName

Response 400:
{
  "message": "Missing required parameters"
}

Client: Show form validation error
```

### Pattern 3: Prerequisite Violation
```
POST /api/research/player/start
{ "techId": "armor-military-alloy-1" }  // Player doesn't have prerequisites

Response 400:
{
  "message": "Missing prerequisites",
  "missingPrerequisites": [
    "armor-materials-military",
    "armor-alloy-processing"
  ]
}

Client: Show "You must research X first" with clickable prerequisite
```

### Pattern 4: Not Authenticated
```
GET /api/research/player/progress
// No valid session

Response 401:
{
  "message": "Not authenticated"
}

Client: Redirect to login
```

### Pattern 5: Server Error
```
GET /api/research/tree/stats

Response 500:
{
  "message": "Failed to fetch tree statistics"
}

Client: Show "Server error, try again later"
```

## Testing Checklist

- [ ] GET all public endpoints (no auth required)
- [ ] GET authenticated endpoints without session (should 401)
- [ ] GET authenticated endpoints with session (should work)
- [ ] POST starts research with valid tech
- [ ] POST starts research with invalid tech (should 404)
- [ ] POST starts research with missing prerequisites (should 400)
- [ ] POST completes research (should unlock tech)
- [ ] Search with no results
- [ ] Search with multiple results
- [ ] Calculate-cost with valid params
- [ ] Calculate-cost with invalid params (should 400)
- [ ] Path should fail if techs not found
- [ ] Path should work across branches

