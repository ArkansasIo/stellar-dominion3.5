# Installation Guide

Step-by-step guide for setting up the Universe Empire Dominion 3 development environment.

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **PostgreSQL** 14+
- **npm** or **yarn**

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd universe-empire-dominion3
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/universe_empire
SESSION_SECRET=your-session-secret
```

> **Source:** `server/loadEnv.ts` — environment loading

---

## 4. Database Setup

### Create Database

```bash
createdb universe_empire
```

### Initialize Schema

```bash
npm run db:push
```

> **Source:** `server/db/init.ts` — schema initialization
> **Source:** `server/db/index.ts` — database connection
> **Source:** `shared/schema.ts` — schema definitions

### Seed Data (Optional)

```bash
npm run db:seed
```

> **Source:** `server/db/system-settings-seed.ts` — settings seed
> **Source:** `shared/sql/settings/index.ts` — SQL seeds

---

## 5. Start Development Server

```bash
npm run dev
```

This starts:
- Vite dev server (client) on port 5173
- Express server (API) on port 3000

> **Source:** `server/index.ts` — server entry
> **Source:** `server/vite.ts` — Vite dev server
> **Source:** `client/src/main.tsx` — client entry

---

## 6. Access the Application

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
universe-empire-dominion3/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.tsx          # Routing
│   │   ├── main.tsx         # Entry point
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Client logic
│   │   └── pages/           # Page components
│   └── package.json
├── server/                  # Express backend
│   ├── index.ts             # Server entry
│   ├── routes.ts            # Route hub
│   ├── routes-*.ts          # Route modules
│   ├── services/            # Business logic
│   ├── gameEngine.ts        # Turn engine
│   ├── combatEngine.ts      # Combat engine
│   ├── storage.ts           # Data access
│   └── db/                  # Database
├── shared/                  # Shared code
│   ├── schema.ts            # DB schema
│   ├── config/              # Game config
│   └── sql/                 # SQL seeds
└── package.json
```

> **Source:** `client/src/App.tsx`
> **Source:** `client/src/main.tsx`
> **Source:** `server/index.ts`
> **Source:** `server/routes.ts`
> **Source:** `shared/schema.ts`

---

## Production Build

### Build Client

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

> **Source:** `server/static.ts` — production static serving
> **Source:** `server/index.ts` — server entry

---

## Database Migrations

### Apply Schema Changes

```bash
npm run db:push
```

### Reset Database

```bash
npm run db:reset
```

> **Source:** `server/db/init.ts`

---

## Common Issues

### Database Connection Failed

Check that PostgreSQL is running and `DATABASE_URL` is correct in `.env`.

> **Source:** `server/db/index.ts`

### Port Already in Use

Change the port in `server/index.ts` or stop the conflicting process.

> **Source:** `server/index.ts`

### Missing Tables

Run `npm run db:push` to apply schema.

> **Source:** `server/db/init.ts`

### Environment Variables Not Loading

Check `server/loadEnv.ts` for required variables.

> **Source:** `server/loadEnv.ts`

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (client + server) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Apply database schema |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Reset database |
| `npm run lint` | Run linter |
| `npm run typecheck` | Run type checker |
