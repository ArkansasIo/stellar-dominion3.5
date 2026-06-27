# Research API Testing Guide

Quick-start guide for testing the Research API.

## Source Files

> **Source:** server/routes-research.ts
> **Source:** server/routes-researchlab.ts
> **Source:** script/smoke-life-support.ts

## Quick Start

### 1. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

### 2. Test Endpoints

**Tree statistics:**
```bash
curl "http://localhost:5000/api/research/tree/stats"
```

**List branches:**
```bash
curl "http://localhost:5000/api/research/tree/branches"
```

**Search technologies:**
```bash
curl "http://localhost:5000/api/research/search?q=armor"
```

**Get tech details:**
```bash
curl "http://localhost:5000/api/research/tech/tech_001"
```

**Calculate research cost:**
```bash
curl -X POST "http://localhost:5000/api/research/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{"techId": "tech_001", "playerLevel": 10}'
```

### 3. Authenticated Endpoints

First authenticate:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' \
  -c cookies.txt
```

Then test:
```bash
# Research progress
curl http://localhost:5000/api/research/player/progress -b cookies.txt

# Start research
curl -X POST http://localhost:5000/api/research/player/start \
  -H "Content-Type: application/json" \
  -d '{"techId": "tech_001"}' \
  -b cookies.txt

# Lab list
curl http://localhost:5000/api/research/lab/list -b cookies.txt

# Add to queue
curl -X POST http://localhost:5000/api/research/queue/add \
  -H "Content-Type: application/json" \
  -d '{"techId": "tech_002", "priority": 1}' \
  -b cookies.txt
```

## Smoke Tests

> **Source:** script/smoke-life-support.ts

```bash
npm run smoke:life-support
```

Additional smoke tests:
- `script/smoke-raid-operations.ts`
- `script/smoke-power-grid.ts`
- `script/smoke-orbital-defense.ts`
