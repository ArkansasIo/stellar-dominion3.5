# Technology Research API Documentation

Complete REST API reference for the Technology Tree and Research System.

## Base URL
```
/api/research
```

## Authentication
Most endpoints are public. Endpoints requiring authentication will return `401 Unauthorized` if the user is not logged in.

---

## 1. Tech Tree Queries

### Get Tech Tree Statistics
**GET** `/tree/stats`

Get overall statistics about the technology tree.

**Response:**
```json
{
  "totalTechnologies": 2453,
  "branchBreakdown": {
    "armor": 600,
    "shields": 250,
    "weapons": 420,
    "propulsion": 250,
    "sensors": 168,
    "power": 150,
    "computing": 100,
    "engineering": 120,
    "resources": 120,
    "medical": 150,
    "hyperspace": 125
  },
  "classBreakdown": {
    "basic": 500,
    "standard": 450,
    "advanced": 400,
    "military": 350,
    "experimental": 300,
    "ancient": 250,
    "exotic": 203
  },
  "averageLevelByBranch": {
    "armor": 8.5,
    "shields": 9.2,
    ...
  },
  "tierDistribution": { ... }
}
```

---

### Get All Tech Branches
**GET** `/tree/branches`

Get list of all available research branches.

**Response:**
```json
{
  "branches": [
    {
      "id": "armor",
      "name": "Armor",
      "description": "Defensive plating and hull reinforcement technologies",
      "count": 600,
      "averageLevel": 8.5
    },
    {
      "id": "shields",
      "name": "Shields",
      "description": "Energy shield generation and modulation systems",
      "count": 250,
      "averageLevel": 9.2
    },
    ...
  ]
}
```

---

### Get Technologies in a Branch
**GET** `/tree/branch/{branchId}`

Get all technologies in a specific research branch.

**Parameters:**
- `branchId` (path) - Branch ID (armor, shields, weapons, propulsion, sensors, power, computing, engineering, resources, medical, hyperspace)

**Response:**
```json
{
  "branch": "armor",
  "count": 600,
  "byClass": {
    "basic": [
      {
        "id": "armor-light-basic-composite-1",
        "name": "Basic Composite Armor",
        "branch": "armor",
        "class": "basic",
        "level": 1,
        "tier": 1,
        "rarity": "common",
        "description": "...",
        "researchCost": 100,
        "researchTime": 5,
        ...
      },
      ...
    ],
    "standard": [...],
    ...
  },
  "techs": [...]
}
```

---

### Get Technology Details
**GET** `/tech/{techId}`

Get comprehensive information about a specific technology.

**Parameters:**
- `techId` (path) - Technology ID

**Response:**
```json
{
  "id": "armor-light-basic-composite-1",
  "name": "Basic Composite Armor",
  "branch": "armor",
  "class": "basic",
  "type": "light",
  "level": 1,
  "tier": 1,
  "rarity": "common",
  "description": "Lightweight composite armor plating for basic hull protection",
  "researchCost": 100,
  "researchTime": 5,
  "industrialCost": 50,
  "energyCost": 10,
  "stats": {
    "primary": {
      "armor_rating": 10,
      "weight": 5,
      "durability": 100
    },
    "secondary": {
      "heat_resistance": 5
    },
    "resistance": {
      "kinetic": 15,
      "thermal": 5,
      "radiation": 0
    },
    "efficiency": 0.85,
    "reliability": 0.95
  },
  "bonuses": {
    "hull_protection": 15,
    "impact_resistance": 10
  },
  "penalties": {
    "reactor_efficiency": -2
  },
  "prerequisites": [
    {
      "id": "armor-materials-basic",
      "name": "Basic Armor Materials",
      "researchCost": 75
    }
  ],
  "unlocks": [
    {
      "id": "armor-light-standard-composite-1",
      "name": "Standard Composite Armor",
      "branch": "armor"
    }
  ],
  "upgrades": [
    {
      "id": "armor-light-basic-composite-2",
      "name": "Basic Composite Armor II",
      "level": 2,
      "tier": 1
    }
  ],
  "totalResearchCostIncludingPrerequisites": 200,
  "isResearchable": true,
  "minimumLevel": 1
}
```

---

### Get Research Path Between Techs
**GET** `/tech/path/{fromId}/{toId}`

Calculate the research path needed to progress from one technology to another.

**Parameters:**
- `fromId` (path) - Starting technology ID
- `toId` (path) - Target technology ID

**Response:**
```json
{
  "from": "armor-light-basic-composite-1",
  "to": "armor-military-alloy-1",
  "pathLength": 4,
  "totalResearchCost": 850,
  "techs": [
    {
      "id": "armor-light-basic-composite-1",
      "name": "Basic Composite Armor",
      "level": 1,
      "tier": 1,
      "researchCost": 100
    },
    {
      "id": "armor-materials-standard",
      "name": "Standard Armor Materials",
      "level": 2,
      "tier": 1,
      "researchCost": 150
    },
    ...
  ]
}
```

---

## 2. Search & Filter

### Search Technologies
**GET** `/search`

Search technologies by name or description.

**Query Parameters:**
- `q` (string, optional) - Search query
- `rarity` (string, optional) - Filter by rarity (common, uncommon, rare, epic, legendary, mythic)

**Example:** `GET /api/research/search?q=shield&rarity=epic`

**Response:**
```json
{
  "query": "shield",
  "results": [
    {
      "id": "shields-kinetic-advanced-1",
      "name": "Advanced Kinetic Shield",
      "branch": "shields",
      "class": "advanced",
      "level": 5,
      "tier": 2,
      "rarity": "rare"
    },
    ...
  ],
  "total": 45
}
```

---

### Get Available Technologies
**GET** `/available`

Get technologies available to a player at their current level.

**Query Parameters:**
- `playerLevel` (number, optional) - Player level (default: 1)

**Example:** `GET /api/research/available?playerLevel=10`

**Response:**
```json
{
  "playerLevel": 10,
  "availableCount": 250,
  "techs": [
    {
      "id": "armor-light-basic-composite-1",
      "name": "Basic Composite Armor",
      "branch": "armor",
      "class": "basic",
      "level": 1,
      "minimumLevel": 1
    },
    ...
  ]
}
```

---

### Get Technologies by Rarity
**GET** `/rarity/{rarity}`

Get all technologies of a specific rarity level.

**Parameters:**
- `rarity` (path) - common, uncommon, rare, epic, legendary, or mythic

**Response:**
```json
{
  "rarity": "epic",
  "count": 200,
  "techs": [
    {
      "id": "shields-multi-phase-military-1",
      "name": "Military Multi-Phase Shield",
      "branch": "shields",
      "class": "military",
      "level": 8,
      "researchCost": 500
    },
    ...
  ]
}
```

---

## 3. Progression & Calculations

### Calculate Research Cost
**POST** `/calculate-cost`

Calculate the research cost for a technology based on level and tier modifiers.

**Request Body:**
```json
{
  "level": 5,
  "tier": 2,
  "branchName": "armor"
}
```

**Response:**
```json
{
  "level": 5,
  "tier": 2,
  "baseCost": 250,
  "timeRequired": 10,
  "levelMultiplier": 1.74,
  "tierMultiplier": 1.56,
  "combinedMultiplier": 2.72
}
```

---

### Get Starter Technologies
**GET** `/starter-techs`

Get all technologies that have no prerequisites (good starting points).

**Response:**
```json
{
  "count": 11,
  "techs": [
    {
      "id": "armor-light-basic-composite-1",
      "name": "Basic Composite Armor",
      "branch": "armor",
      "description": "...",
      "researchCost": 100,
      "researchTime": 5
    },
    {
      "id": "shields-kinetic-basic-1",
      "name": "Basic Kinetic Shield",
      "branch": "shields",
      "description": "...",
      "researchCost": 100,
      "researchTime": 5
    },
    ...
  ]
}
```

---

## 4. Player Research Progress (Authenticated)

### Get Player Research Progress
**GET** `/player/progress`

Get the player's research history and current research. **Requires authentication.**

**Response:**
```json
{
  "researchedCount": 15,
  "currentResearch": {
    "techId": "armor-light-basic-composite-2",
    "startTurn": 50,
    "completionTurn": 55,
    "progress": 0.6
  },
  "researchedTechs": [
    "armor-light-basic-composite-1",
    "armor-materials-basic",
    ...
  ]
}
```

---

### Start Research on Technology
**POST** `/player/start`

Begin researching a technology. **Requires authentication.**

**Request Body:**
```json
{
  "techId": "armor-light-basic-composite-2"
}
```

**Valid Response (200):**
```json
{
  "success": true,
  "currentResearch": {
    "techId": "armor-light-basic-composite-2",
    "startTurn": 50,
    "completionTurn": 55,
    "progress": 0
  },
  "message": "Research started: Basic Composite Armor II"
}
```

**Error Response (400) - Missing Prerequisites:**
```json
{
  "message": "Missing prerequisites",
  "missingPrerequisites": [
    "armor-materials-standard",
    "armor-light-reinforcement-1"
  ]
}
```

**Error Response (400) - Already Researched:**
```json
{
  "message": "Technology already researched"
}
```

---

### Complete Current Research
**POST** `/player/complete`

Complete the current research and unlock the technology. **Requires authentication.**

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "completedTech": "Basic Composite Armor II",
  "researchedCount": 16
}
```

---

### Get Recommended Technologies
**GET** `/player/recommended`

Get recommended technologies based on player level and researched technologies. **Requires authentication.**

**Response:**
```json
{
  "playerLevel": 10,
  "researchedCount": 15,
  "recommendedCount": 42,
  "recommendations": [
    {
      "id": "armor-light-basic-composite-2",
      "name": "Basic Composite Armor II",
      "branch": "armor",
      "class": "basic",
      "level": 2,
      "rarity": "common",
      "researchCost": 120,
      "researchTime": 6
    },
    {
      "id": "shields-kinetic-standard-1",
      "name": "Standard Kinetic Shield",
      "branch": "shields",
      "class": "standard",
      "level": 3,
      "rarity": "uncommon",
      "researchCost": 180,
      "researchTime": 8
    },
    ...
  ]
}
```

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | Success | Request successful |
| 400 | Bad Request | Invalid parameters or missing prerequisites |
| 401 | Unauthorized | Authentication required but not provided |
| 404 | Not Found | Technology or branch not found |
| 500 | Internal Server Error | Server error during processing |

---

## Usage Examples

### Example 1: Find armor technologies and see available upgrades
```bash
# Get all armor technologies
GET /api/research/tree/branch/armor

# Get details on a specific armor tech
GET /api/research/tech/armor-light-basic-composite-1

# Check what this tech unlocks
# (see 'unlocks' in response)
```

### Example 2: Plan research path
```bash
# Get a research path from one tech to another
GET /api/research/tech/path/armor-light-basic-composite-1/armor-military-alloy-1

# This shows you all intermediate techs needed
```

### Example 3: Start researching as a player
```bash
# Get recommended techs for current level
GET /api/research/player/recommended

# Choose one and start research
POST /api/research/player/start
{
  "techId": "armor-light-basic-composite-2"
}

# Later, complete the research
POST /api/research/player/complete

# Check progress
GET /api/research/player/progress
```

### Example 4: Search and filter
```bash
# Search for shield technologies
GET /api/research/search?q=shield

# Get epic rarity techs
GET /api/research/rarity/epic

# Get techs available at player level 5
GET /api/research/available?playerLevel=5
```

---

## Integration Notes

### With Player State
Research progress is stored in the player's state:
```json
{
  "researchedTechnologies": ["tech-id-1", "tech-id-2"],
  "currentResearch": {
    "techId": "tech-id-3",
    "startTurn": 50,
    "completionTurn": 55,
    "progress": 0.6
  }
}
```

### With Game Mechanics
- **Armor techs** modify ship hull defense values
- **Shield techs** unlock defensive subsystems
- **Weapon techs** increase combat damage output
- **Propulsion techs** increase movement speed
- **Sensor techs** increase detection range
- **Power techs** increase energy generation
- **Computing techs** unlock AI capabilities
- **Medical techs** unlock healing abilities
- **Hyperspace techs** unlock FTL travel
- **Engineering techs** unlock building capabilities
- **Resource techs** increase gathering speeds

### Progression Formula
```
Research Cost = Base Cost * Level Multiplier * Tier Multiplier
Level Multiplier = 1.15^(level-1)
Tier Multiplier = 1.25^(tier-1)
```

---

## Rate Limiting
No rate limiting is currently implemented. Monitor API usage and implement if needed.

--- 

## Future Endpoints (Planned)
- `GET /api/research/player/history` - View past research
- `GET /api/research/faction/{factionId}` - Faction-specific techs
- `POST /api/research/batch-complete` - Complete multiple research items
- `GET /api/research/compare/{techId1}/{techId2}` - Compare two techs
- `GET /api/research/requirements/{techId}` - All requirements chain
