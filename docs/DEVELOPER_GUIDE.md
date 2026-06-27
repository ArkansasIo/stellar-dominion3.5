# Developer Guide

Onboarding guide for new developers working on Universe Empire Dominion 3.

---

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

---

## Project Structure

```
universe-empire-dominion3/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.tsx          # Root routing (wouter)
│   │   ├── main.tsx         # Entry point
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── views3d/     # 3D scene rendering
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Client-side logic & data
│   │   └── pages/           # Page components (80+)
│   └── package.json
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # Route registration hub
│   ├── routes-*.ts          # 65+ route modules
│   ├── services/            # 29 business logic services
│   ├── gameEngine.ts        # Turn processing engine
│   ├── combatEngine.ts      # Combat resolution engine
│   ├── storage.ts           # Database access layer
│   ├── db/                  # Database connection & init
│   └── middleware/          # Auth middleware
├── shared/                  # Shared between client & server
│   ├── schema.ts            # Drizzle ORM schema (72+ tables)
│   ├── api-types.ts         # API type definitions
│   ├── types.ts             # Additional types
│   ├── config/              # 93+ game configuration files
│   ├── sql/                 # SQL seed data
│   └── expeditionData.ts    # Expedition definitions
├── docs/                    # Documentation
└── package.json
```

> **Source:** `client/src/App.tsx`
> **Source:** `client/src/main.tsx`
> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `shared/schema.ts`

---

## Key Files

### Client

| File | Purpose | What to Edit |
|------|---------|--------------|
| `client/src/App.tsx` | All routes | Add new pages |
| `client/src/main.tsx` | Entry point | rarely |
| `client/src/lib/gameContext.tsx` | Global state | Add game state |
| `client/src/lib/api-client.ts` | API calls | Add API methods |
| `client/src/lib/queryClient.ts` | Query config | rarely |
| `client/src/hooks/useAuth.ts` | Auth state | rarely |
| `client/src/components/ui/` | UI library | Add UI components |

> **Source:** `client/src/App.tsx`
> **Source:** `client/src/lib/gameContext.tsx`
> **Source:** `client/src/lib/api-client.ts`
> **Source:** `client/src/hooks/useAuth.ts`

### Server

| File | Purpose | What to Edit |
|------|---------|--------------|
| `server/index.ts` | Server entry | rarely |
| `server/routes.ts` | Route hub | Register new routes |
| `server/routes-*.ts` | Route modules | Add API endpoints |
| `server/services/*.ts` | Business logic | Add/change game logic |
| `server/gameEngine.ts` | Turn processing | Modify turn behavior |
| `server/combatEngine.ts` | Combat logic | Modify combat formulas |
| `server/storage.ts` | DB queries | Add database operations |

> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `server/gameEngine.ts`
> **Source:** `server/combatEngine.ts`
> **Source:** `server/storage.ts`

### Shared

| File | Purpose | What to Edit |
|------|---------|--------------|
| `shared/schema.ts` | DB schema | Add/modify tables |
| `shared/api-types.ts` | API types | Add type definitions |
| `shared/config/*.ts` | Game config | Tune game balance |

> **Source:** `shared/schema.ts`
> **Source:** `shared/api-types.ts`
> **Source:** `shared/config/`

---

## Adding a New Feature

### 1. Add Database Table (if needed)

Edit `shared/schema.ts` to add the table using Drizzle ORM.

> **Source:** `shared/schema.ts`

### 2. Add Configuration (if needed)

Add a config file in `shared/config/` with game data/constants.

> **Source:** `shared/config/`

### 3. Add Storage Functions

Add database access functions in `server/storage.ts`.

> **Source:** `server/storage.ts`

### 4. Add Service (if complex logic)

Add a service in `server/services/` for business logic.

> **Source:** `server/services/`

### 5. Add API Route

Create `server/routes-<feature>.ts` and register it in `server/routes.ts`.

> **Source:** `server/routes.ts`

### 6. Add Client Logic

Add client-side logic in `client/src/lib/` if needed.

> **Source:** `client/src/lib/`

### 7. Add Page Component

Create `client/src/pages/<Feature>.tsx` and add route in `client/src/App.tsx`.

> **Source:** `client/src/App.tsx`

---

## Adding a New Route

### 1. Create Route Module

```typescript
// server/routes-<feature>.ts
import { Router } from "express";

const router = Router();

router.get("/api/<feature>", async (req, res) => {
  // implementation
});

export default router;
```

### 2. Register in Routes Hub

```typescript
// server/routes.ts
import featureRoutes from "./routes-<feature>";
app.use(featureRoutes);
```

> **Source:** `server/routes.ts`

---

## Adding a New Page

### 1. Create Page Component

```typescript
// client/src/pages/<Feature>.tsx
export default function FeaturePage() {
  return <div>...</div>;
}
```

### 2. Add Route in App.tsx

```typescript
// client/src/App.tsx
<Route path="/feature" component={lazy(() => import("./pages/<Feature>"))} />
```

> **Source:** `client/src/App.tsx`

---

## Database

### Connection

PostgreSQL via `pg` driver + Drizzle ORM.

> **Source:** `server/db/index.ts`

### Schema

72+ tables defined with Drizzle ORM.

> **Source:** `shared/schema.ts`

### Migrations

Schema initialization via `server/db/init.ts`.

> **Source:** `server/db/init.ts`

### Seed Data

SQL seed data in `shared/sql/settings/index.ts` and `server/db/system-settings-seed.ts`.

> **Source:** `shared/sql/settings/index.ts`
> **Source:** `server/db/system-settings-seed.ts`

---

## Configuration System

93+ config files in `shared/config/` define all game constants, shared between client and server.

Key config categories:
- **Core:** `gameConfig.ts`, `turnSystemConfig.ts`
- **Combat:** `combatConfig.ts`, `weaponsAndDefenseConfig.ts`
- **Economy:** `resourceConfig.ts`, `economy/`
- **Research:** `technologyTreeConfig.ts`, `research*.ts`
- **Progression:** `governmentProgressionTreeConfig.ts`, `civilizationJobsConfig.ts`
- **Ships:** `staryardConfig.ts`, `shipClassificationSystem.ts`
- **Commander:** `commander/` (skills, talent-tree, mastery, gacha, vault)
- **Army:** `combat/army/` (categories, subsystems, units)
- **Social:** `multiplayerBonusesConfig.ts`
- **Meta:** `megastructuresConfig.ts`, `orbitalStationsConfig.ts`, `achievementsConfig.ts`

> **Source:** `shared/config/gameConfig.ts`
> **Source:** `shared/config/turnSystemConfig.ts`
> **Source:** `shared/config/combatConfig.ts`
> **Source:** `shared/config/technologyTreeConfig.ts`
> **Source:** `shared/config/resourceConfig.ts`

---

## Authentication

| File | Purpose |
|------|---------|
| `server/basicAuth.ts` | Basic HTTP auth |
| `server/replitAuth.ts` | Replit OAuth |
| `server/middleware/adminIpCheck.ts` | Admin IP whitelist |
| `client/src/hooks/useAuth.ts` | Client auth state |
| `client/src/lib/authUtils.ts` | Client auth utils |

> **Source:** `server/basicAuth.ts`
> **Source:** `server/replitAuth.ts`
> **Source:** `server/middleware/adminIpCheck.ts`
> **Source:** `client/src/hooks/useAuth.ts`

---

## Game Engine

The turn processing engine handles all time-based game mechanics.

> **Source:** `server/gameEngine.ts`

The combat engine handles all battle calculations.

> **Source:** `server/combatEngine.ts`

---

## Storage Layer

All database access goes through `server/storage.ts`, which wraps Drizzle ORM queries.

> **Source:** `server/storage.ts`

---

## Useful Commands

```bash
# Start dev server (client + server)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:push
```

---

## Troubleshooting

### Common Issues

1. **Database connection failed** — Check `DATABASE_URL` in `.env`
2. **Port already in use** — Change port in `server/index.ts`
3. **Missing tables** — Run `npm run db:push` to apply schema
4. **Config not found** — Check imports in `shared/config/index.ts`

> **Source:** `server/db/index.ts`
> **Source:** `server/index.ts`
> **Source:** `server/db/init.ts`
> **Source:** `shared/config/index.ts`
