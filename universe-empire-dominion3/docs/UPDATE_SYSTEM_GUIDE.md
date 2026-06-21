# Update System Guide

Guide for the server and client update system.

---

## Overview

The update system handles server-side and client-side updates, version management, and hot-reloading.

---

## Server Update System

### Core Files

| File | Purpose |
|------|---------|
| `server/update-manager.ts` | Server-side update management — version checking, update application, restart handling |
| `server/loadEnv.ts` | Environment variable loading for update configuration |

> **Source:** `server/update-manager.ts`
> **Source:** `server/loadEnv.ts`

### How It Works

1. `server/update-manager.ts` checks for available updates
2. Downloads and applies updates
3. Manages server restart if needed
4. Tracks version history

### Configuration

Update settings are managed through environment variables loaded by `server/loadEnv.ts`.

> **Source:** `server/loadEnv.ts`

---

## Client Update System

### Core Files

| File | Purpose |
|------|---------|
| `client/src/lib/update-client.ts` | Client-side update logic — version checking, cache invalidation, asset updates |

> **Source:** `client/src/lib/update-client.ts`

### How It Works

1. Client checks server for version updates
2. Downloads updated assets if available
3. Invalidates browser cache
4. Reloads with new version

---

## Update Flow

```
Server Update:
  update-manager.ts → Check version → Download → Apply → Restart

Client Update:
  update-client.ts → Check version → Download assets → Cache invalidate → Reload
```

> **Source:** `server/update-manager.ts`
> **Source:** `client/src/lib/update-client.ts`

---

## Version Management

| Component | Location |
|-----------|----------|
| Server version | `server/update-manager.ts` |
| Client version | `client/src/lib/update-client.ts` |
| Package version | `package.json` |

> **Source:** `server/update-manager.ts`
> **Source:** `client/src/lib/update-client.ts`

---

## Hot Reload

Development hot reload is handled by Vite:

| File | Purpose |
|------|---------|
| `server/vite.ts` | Vite dev server integration for HMR |
| `server/index.ts` | Server entry with Vite middleware |

> **Source:** `server/vite.ts`
> **Source:** `server/index.ts`

---

## Troubleshooting

### Common Issues

1. **Update not applying** — Check `server/update-manager.ts` logs
2. **Client cache issues** — Clear browser cache, check `client/src/lib/update-client.ts`
3. **Version mismatch** — Verify `package.json` version matches server/client versions
4. **Hot reload not working** — Check `server/vite.ts` configuration

> **Source:** `server/update-manager.ts`
> **Source:** `client/src/lib/update-client.ts`
> **Source:** `server/vite.ts`
