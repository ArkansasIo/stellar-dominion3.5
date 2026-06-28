# Backend Console Workflows

This folder contains console and monitoring helpers for the current game backend.

## Purpose

These tools are intended for development and operations support around:

- server health visibility
- database monitoring
- auth/session monitoring
- performance observation
- log export workflows

## Current Layout

```text
server/console/
  index.ts
  database-monitor.ts
  auth-monitor.ts
  performance-monitor.ts
  log-export.ts
  README.md
```

## Typical Usage

Run the app normally with:

```bash
npm run dev
```

Run a console helper directly with `tsx` when you need focused operational visibility.

## Notes

- these workflows support the live TypeScript backend
- they are project operations tools, not player-facing gameplay systems
- keep console docs aligned with actual scripts in this folder if new monitors are added or renamed
