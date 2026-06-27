# Quick Start Guide

Get Universe Empire Dominion running in 5 minutes.

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

> **Source:** .env.example

Edit `.env` with your database URL. For local PostgreSQL:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stellar_dominion
```

### 3. Start Development Server

```bash
npm run dev
```

> **Source:** script/dev.ts

This automatically:
- Checks for `DATABASE_URL`
- Starts both frontend (Vite) and backend (Express)
- Falls back to client-only mode if no database

### 4. Initialize Database

```bash
npm run db:push
```

> **Source:** server/db/index.ts

### 5. Open Browser

Navigate to `http://localhost:5000` (or the port shown in terminal).

## Create Admin Account

```bash
npm run admin:create -- admin YourPassword123! founder
```

> **Source:** server/adminCli.ts

Then visit `/admin/login` to access the admin panel.

## Deploy to Production

Quickest path (Railway):

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Deploy from GitHub repo
4. Add PostgreSQL database
5. Set `SESSION_SECRET` in Variables
6. Done

> **Source:** railway.json

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start full-stack dev server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema to database |
| `npm run admin` | Admin CLI tool |
| `npm run admin:create` | Create admin account |
| `npm run admin:manage` | Manage admin accounts |

> **Source:** package.json

## Project Structure

```
server/          Backend (Express, API routes, services)
client/          Frontend (React, pages, components)
shared/          Shared types, configs, schema
script/          Build and utility scripts
scripts/         Patch and image generation scripts
config/          Game and deployment config
docs/            Documentation
```

## Next Steps

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full deployment guide
- [ADMIN_ACCOUNT.md](ADMIN_ACCOUNT.md) - Admin setup
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Development workflow
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
