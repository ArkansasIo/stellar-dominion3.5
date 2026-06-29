# Developer Guide

## Purpose

This guide is for working on the current `Universe Empire Dominions` codebase, not the vendored upstream reference source.

Use this document when you need to:

- boot the project locally
- find the right place to add or update a page
- understand the shared layout rules
- work on settings, mobile support, or touch support
- continue the imported-source TypeScript migration safely

## Local Setup

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run dev:client
npm run dev:server
npm run build
npm run start
npm run check
npm run db:push
npm run smoke:life-support
```

## Core Working Areas

### Client

- [client/src/pages](/d:/New%20folder/StellarDominion-2/client/src/pages): route-level pages
- [client/src/components](/d:/New%20folder/StellarDominion-2/client/src/components): shared UI and layout
- [client/src/components/layout/GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx): shared in-game shell

### Server

- [server](/d:/New%20folder/StellarDominion-2/server): routes, storage, auth, health, settings
- [server/routes-settings.ts](/d:/New%20folder/StellarDominion-2/server/routes-settings.ts): per-player settings API defaults and persistence

### Shared

- [shared/config](/d:/New%20folder/StellarDominion-2/shared/config): config registries and asset maps
- [shared/ogamex](/d:/New%20folder/StellarDominion-2/shared/ogamex): curated TypeScript bridge modules for imported-source logic

## Layout Rules

### Title Page

The title/auth page is special and should not use the in-game sidebar shell.

Current title-page responsibilities:

- auth/account access
- `Nine Realms` panel
- `Server Health` panel
- public footer/header links

### In-Game Pages

Main in-game pages should use `GameLayout`.

When adding or fixing a page:

1. wrap the page in `GameLayout`
2. make sure the page appears in the correct menu group
3. provide a short description for submenu cards
4. keep layout spacing consistent with the shell

## Navigation Rules

The sidebar menu is grouped by system domain and is the main source of truth for in-game navigation.

If you add a new route:

1. create the page in `client/src/pages`
2. register the route in the client router
3. add the item to the proper menu section in `GameLayout.tsx`
4. decide whether it belongs in a submenu sibling group

## Mobile And Touch Support

Mobile and touch support is part of the current product requirements.

Relevant files:

- [client/src/pages/Settings.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Settings.tsx)
- [client/src/components/layout/GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx)
- [server/routes-settings.ts](/d:/New%20folder/StellarDominion-2/server/routes-settings.ts)

Current player-facing controls:

- device profile
- mobile optimization
- touch controls
- touch target size
- browser width
- sticky mobile bars

Developer expectations:

- avoid desktop-only assumptions
- keep tap targets usable
- make overflow behavior safe for smaller screens
- ensure menu access still works on mobile via the sheet menu

## Imported Source Workflow

There are three different imported-source areas and they should not be treated the same.

### `ogamex-source`

Vendored upstream reference source. Do not present it as live TypeScript runtime code.

### `generated/ogamex-ts`

Bulk-generated scaffolds. Useful for:

- symbol discovery
- migration planning
- quick reference during manual ports

Not useful as a drop-in production replacement without review.

### `shared/ogamex`

Curated TypeScript ports intended for real integration into the app.

This is the preferred place for runtime-safe imported domain logic.

## Documentation Rules

Canonical docs live in:

- [docs/README.md](/d:/New%20folder/StellarDominion-2/docs/README.md)
- [docs/md-documents](/d:/New%20folder/StellarDominion-2/docs/md-documents)

When updating docs:

- describe the live project first
- use `OGameX` only when talking about imported upstream assets or reference code
- do not claim a system is fully simulation-complete unless it is truly wired end to end

## Recommended Workflow For New Features

1. update or add the page
2. wire the route
3. link it into the sidebar group
4. verify submenu siblings
5. check desktop and mobile layouts
6. update canonical docs if the feature changes player-facing structure

## Verification

Use:

```bash
npm run check
```

Then manually verify:

- title page still renders correctly
- left sidebar works on desktop
- mobile sheet menu opens and closes
- settings changes affect shell behavior
- resource top bar still fits across widths
