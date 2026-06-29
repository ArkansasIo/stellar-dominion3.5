# Neon Database Setup

Guide for setting up Neon PostgreSQL for Universe Empire Dominion.

## Why Neon

- Free tier: 3 projects, 3GB storage each
- Serverless PostgreSQL 16
- Auto-scaling compute
- Automatic backups
- Works with all deployment platforms

## Setup

### 1. Create Account

Go to [neon.tech](https://neon.tech) and sign up with GitHub or email.

### 2. Create Project

- Name: `stellar-dominion`
- Region: Choose closest to your users
- PostgreSQL version: 16

### 3. Get Connection String

In project dashboard > Connection string > Pooled connection:

```
postgresql://user:password@ep-random-hash.us-east-2.aws.neon.tech/stellar_dominion?sslmode=require
```

### 4. Configure

Set `DATABASE_URL` in your environment:

```bash
DATABASE_URL=postgresql://user:password@ep-random-hash.us-east-2.aws.neon.tech/stellar_dominion?sslmode=require
```

> **Source:** .env.example

### 5. Initialize Schema

```bash
npm run db:push
```

> **Source:** server/db/index.ts

## How the App Connects

The database connection in `server/db/index.ts` auto-fallbacks:

> **Source:** server/db/index.ts

- If `DATABASE_URL` contains `neon.tech` or is empty, it falls back to local PostgreSQL at `localhost:15432`
- Otherwise, it connects to the URL in `DATABASE_URL`

Connection pool settings (in `server/config/databaseConfig.ts`):

> **Source:** server/config/databaseConfig.ts

| Setting | Value |
|---------|-------|
| Pool min | 1 |
| Pool max | 20 |
| Idle timeout | 30s |
| Connection timeout | 2s |
| Query timeout | 30s |
| Max retries | 3 |
| Retry delay | 1s |

## Platform Integration

### Railway

Railway auto-provisions PostgreSQL. Neon is not needed unless you prefer external database.

### Render

Use Render's PostgreSQL or connect Neon via `DATABASE_URL`.

### Vercel

Neon is recommended for Vercel since it's serverless-friendly.

### Fly.io

Use `fly postgres` or Neon.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Endpoint disabled" | Go to Neon dashboard > Compute > ensure endpoint is ON |
| "Connection refused" | Verify connection string, check Neon endpoint is active |
| SSL errors | Ensure `?sslmode=require` is in connection string |
| App falls back to local | Neon URL detected as broken; check endpoint status |

## Resources

- [Neon Docs](https://neon.tech/docs)
- [Neon Dashboard](https://console.neon.tech)
