# Research API - Quick Start & Testing Guide

Fast-track guide to testing and integrating the Research API.

## Quick Start (5 minutes)

### 1. Start the Server
```bash
cd "d:\New folder\StellarDominion-2\StellarDominion-2"
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Test a Simple Endpoint
```bash
# Get tree statistics
curl "http://localhost:5000/api/research/tree/stats"
```

Expected response (under 100ms):
```json
{
  "totalTechnologies": 2453,
  "branchBreakdown": {
    "armor": 600,
    "shields": 250,
    ...
  },
  ...
}
```

### 3. Get All Branches
```bash
curl "http://localhost:5000/api/research/tree/branches"
```

See all 11 branches with tech counts.

### 4. View Armor Technologies
```bash
curl "http://localhost:5000/api/research/tree/branch/armor"
```

Lists all 600 armor technologies grouped by class.

### 5. Get Single Tech Details
```bash
curl "http://localhost:5000/api/research/tech/armor-light-basic-composite-1"
```

See prerequisites, unlocks, stats, costs, everything.

---

## Testing with cURL

### Test All Public Endpoints

```bash
# ========== TREE INFO ==========

# Get overall statistics
curl "http://localhost:5000/api/research/tree/stats"

# List all branches
curl "http://localhost:5000/api/research/tree/branches"

# Get armors
curl "http://localhost:5000/api/research/tree/branch/armor"

# Get shields
curl "http://localhost:5000/api/research/tree/branch/shields"

# Get weapons
curl "http://localhost:5000/api/research/tree/branch/weapons"


# ========== TECH DETAILS ==========

# Get armor tech
curl "http://localhost:5000/api/research/tech/armor-light-basic-composite-1"

# Get shield tech
curl "http://localhost:5000/api/research/tech/shields-kinetic-basic-1"

# Get path between techs
curl "http://localhost:5000/api/research/tech/path/armor-light-basic-composite-1/armor-light-basic-composite-2"


# ========== SEARCH & FILTER ==========

# Search for "shield"
curl "http://localhost:5000/api/research/search?q=shield"

# Search for "shield" AND epic rarity
curl "http://localhost:5000/api/research/search?q=shield&rarity=epic"

# Get techs available at level 5
curl "http://localhost:5000/api/research/available?playerLevel=5"

# Get techs available at level 20
curl "http://localhost:5000/api/research/available?playerLevel=20"

# Get all rare techs
curl "http://localhost:5000/api/research/rarity/rare"

# Get all epic techs
curl "http://localhost:5000/api/research/rarity/epic"


# ========== CALCULATIONS ==========

# Calculate cost for level 5, tier 2 armor tech
curl -X POST "http://localhost:5000/api/research/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{"level": 5, "tier": 2, "branchName": "armor"}'

# Calculate cost for level 3, tier 1 weapon tech
curl -X POST "http://localhost:5000/api/research/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{"level": 3, "tier": 1, "branchName": "weapons"}'

# Get starter technologies
curl "http://localhost:5000/api/research/starter-techs"
```

### Test Authenticated Endpoints

```bash
# First, login a user
curl -c cookies.txt -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'

# Now use the cookies for authenticated requests

# Get player progress (should be empty initially)
curl -b cookies.txt "http://localhost:5000/api/research/player/progress"

# Start researching a tech
curl -b cookies.txt -X POST "http://localhost:5000/api/research/player/start" \
  -H "Content-Type: application/json" \
  -d '{"techId": "armor-light-basic-composite-1"}'

# Get player progress again (should show current research)
curl -b cookies.txt "http://localhost:5000/api/research/player/progress"

# Get recommendations
curl -b cookies.txt "http://localhost:5000/api/research/player/recommended"

# Complete the research
curl -b cookies.txt -X POST "http://localhost:5000/api/research/player/complete"

# Get progress again (should show researched tech)
curl -b cookies.txt "http://localhost:5000/api/research/player/progress"
```

---

## Testing with Postman

### Setup

1. Get [Postman Desktop App](https://www.postman.com/downloads/)
2. Import this collection (copy into Postman):

```json
{
  "info": {
    "name": "Research API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Public Endpoints",
      "item": [
        {
          "name": "Get Tree Stats",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/tree/stats"
          }
        },
        {
          "name": "Get Branches",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/tree/branches"
          }
        },
        {
          "name": "Get Armor Branch",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/tree/branch/armor"
          }
        },
        {
          "name": "Get Single Tech",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/tech/armor-light-basic-composite-1"
          }
        },
        {
          "name": "Search Techs",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/search?q=shield&rarity=epic"
          }
        }
      ]
    },
    {
      "name": "Authenticated Endpoints",
      "item": [
        {
          "name": "Get Player Progress",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/research/player/progress"
          }
        },
        {
          "name": "Start Research",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/research/player/start",
            "body": {
              "raw": "{\"techId\": \"armor-light-basic-composite-2\"}"
            }
          }
        }
      ]
    }
  ]
}
```

### Environment Variables

Set in Postman:
```
base_url = http://localhost:5000
```

---

## Integration in React Components

### Example 1: Display Tech Tree

```typescript
import { useEffect, useState } from 'react';

export function TechTreeBrowser() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/research/tree/branches')
      .then(res => res.json())
      .then(data => {
        setBranches(data.branches);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading tech tree...</div>;

  return (
    <div>
      <h2>Technology Branches</h2>
      {branches.map(branch => (
        <div key={branch.id}>
          <h3>{branch.name}</h3>
          <p>{branch.description}</p>
          <p>Technologies: {branch.count}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Search Techs

```typescript
import { useState } from 'react';

export function SearchTechs() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async (q: string) => {
    const res = await fetch(`/api/research/search?q=${q}`);
    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={() => search(query)}
        placeholder="Search technologies..."
      />
      {results.map(tech => (
        <div key={tech.id}>
          <h4>{tech.name}</h4>
          <p>{tech.branch} - Level {tech.level}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Start Research

```typescript
export function ResearchButton({ techId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const startResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/research/player/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techId })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        onSuccess();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={startResearch} disabled={loading}>
      {loading ? 'Starting...' : 'Start Research'}
    </button>
  );
}
```

### Example 4: Show Player Recommendations

```typescript
import { useEffect, useState } from 'react';

export function ResearchRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch('/api/research/player/recommended')
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations));
  }, []);

  return (
    <div>
      <h3>Recommended Technologies</h3>
      <ul>
        {recommendations.map(tech => (
          <li key={tech.id}>
            <strong>{tech.name}</strong>
            <p>Cost: {tech.researchCost} SC | Time: {tech.researchTime} turns</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Performance Testing

### Load Test: Get Tree Stats
```bash
# 100 requests in sequence
for i in {1..100}; do
  curl "http://localhost:5000/api/research/tree/stats" > /dev/null
  echo "Request $i complete"
done
```

### Response Time Check
```bash
# Measure time for single request
time curl "http://localhost:5000/api/research/tree/stats"
```

Expected: Under 100ms for most endpoints

### Data Size
```bash
# Check response size
curl "http://localhost:5000/api/research/tree/stats" | wc -c
# Should be < 5KB

curl "http://localhost:5000/api/research/tree/branch/armor" | wc -c
# Should be < 200KB
```

---

## Troubleshooting

### Server Not Starting
```bash
# Check if port 5000 is in use
netstat -a | grep 5000

# Kill process on port 5000
taskkill /F /IM node.exe
```

### API Returns 500 Error
1. Check server logs
2. Verify all imports in routes-research.ts
3. Run `npm run check` to check types

### Authentication Not Working
1. Make sure to login first
2. Save cookies: `curl -c cookies.txt`
3. Use cookies in subsequent requests: `curl -b cookies.txt`

### Tech Not Found
1. Verify tech ID is correct (case-sensitive)
2. Check via `/research/tree/branch/armor` first

### Cannot Research Due to Missing Prerequisites
1. Get prerequisites: `GET /api/research/tech/{techId}`
2. Look at `prerequisites` array
3. Research each prerequisite first
4. Use `GET /api/research/tech/path/{from}/{to}` to see full path

---

## Common Endpoints for Copy-Paste

### Get all armor techs
```
http://localhost:5000/api/research/tree/branch/armor
```

### Get all shields
```
http://localhost:5000/api/research/tree/branch/shields
```

### Search for "weapon"
```
http://localhost:5000/api/research/search?q=weapon
```

### Get player's research status
```
http://localhost:5000/api/research/player/progress
```

### Get recommendations
```
http://localhost:5000/api/research/player/recommended
```

---

## Next: Build Frontend

See `docs/ResearchImplementationGuide.md` for component architecture.

Key components to build:
- TechTreeBrowser - Browse all techs
- ResearchProgress - Show current research
- ResearchStartButton - Begin research
- RecommendationPanel - Show next steps

