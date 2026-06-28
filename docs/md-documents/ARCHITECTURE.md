# Architecture

## High-Level Shape

The application is a TypeScript full-stack browser game with:

- React on the client
- Express on the server
- shared config and domain modules in `shared/`
- Drizzle-backed persistence and settings/state access on the server

The codebase is organized around one live app plus two imported-source support areas:

- `shared/ogamex`: curated handwritten TypeScript ports used by live code
- `generated/ogamex-ts`: bulk-generated migration scaffolds
- `ogamex-source`: vendored upstream reference source and asset origin

## Runtime Layers

```text
Browser UI
  -> React pages, components, hooks, shared GameLayout
  -> TanStack Query for server state fetches and mutations
  -> Wouter route navigation

Express API
  -> auth/session middleware
  -> route groups for state, settings, health, gameplay systems
  -> storage abstraction for persistence

Shared Domain
  -> configs, asset registries, shared types, imported-source bridge logic

Persistence
  -> PostgreSQL-compatible database access through Drizzle/storage
```

## Frontend Architecture

### Page Layer

Primary page modules live in [client/src/pages](/d:/New%20folder/StellarDominion-2/client/src/pages).

The current route set is grouped into:

- empire
- research
- military
- exploration
- diplomacy
- economy
- system/support

### Shared Layout

The most important frontend architecture decision is the shared shell in [GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx).

Responsibilities of `GameLayout`:

- draw the top resource bar
- draw the left navigation tree
- calculate the active section/group/page context
- expose submenu sibling cards
- adapt to mobile and touch interaction
- apply display preferences from player options
- show shared build/version footer metadata

The title/auth page is intentionally outside this shell and lives in [Auth.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Auth.tsx).

### Display Preference Pipeline

Mobile and touch support is implemented as a full layout pipeline:

1. defaults defined in [server/routes-settings.ts](/d:/New%20folder/StellarDominion-2/server/routes-settings.ts)
2. UI controls exposed in [Settings.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Settings.tsx)
3. layout consumption in [GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx)
4. dataset/class flags applied to the document root for styling and interaction changes

This gives the app a central place to manage:

- device profile
- browser width
- touch mode
- compact UI
- reduced motion
- sticky mobile bars

## Backend Architecture

### Express Route Groups

The server is centered around route modules and storage-backed handlers.

Important route domains include:

- authentication and account flows
- player state and setup
- settings and per-player options
- turn/status/health endpoints
- gameplay data endpoints used by page-level queries

### Storage Boundary

The backend uses a storage abstraction so page routes do not directly embed all persistence logic.

This makes it easier to:

- keep route handlers thin
- normalize settings/state updates
- evolve persistence without rewriting page handlers
- mix handwritten game logic with imported-source ports carefully

## Imported Source Boundary

The imported upstream source is not the live runtime.

Architecture rule:

- `ogamex-source/` is vendored reference
- `generated/ogamex-ts/` is machine-assisted migration output
- `shared/ogamex/` is the curated bridge where runtime-safe TypeScript ports live

This boundary matters because the project should not imply that the entire upstream tree is already production-ready TypeScript.

## Asset Architecture

Imported and native assets are registered through shared config rather than scattered ad hoc usage.

Key references:

- [shared/config/ogamexAssetsConfig.ts](/d:/New%20folder/StellarDominion-2/shared/config/ogamexAssetsConfig.ts)
- [GameAssetsGallery.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/GameAssetsGallery.tsx)

This supports:

- consistent asset provenance
- shared art usage across pages
- gallery/documentation visibility
- future replacement or expansion without hunting raw paths across the app

## Architectural Priorities

1. One consistent in-game layout across main pages and sub pages
2. Clear separation between live game code and imported reference code
3. Shared config-driven assets and menus
4. Per-player settings that affect the shell globally
5. Incremental migration instead of risky one-shot rewrites

## Current Technical Risks

- many gameplay pages exist, but simulation depth varies by subsystem
- imported-source scaffolds still need manual curation before production use
- documentation can drift quickly unless the canonical docs remain centralized

## Current Source Of Truth

For architecture questions, treat these as the primary references:

- [client/src/components/layout/GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx)
- [client/src/pages/Auth.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Auth.tsx)
- [client/src/pages/Settings.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Settings.tsx)
- [server/routes-settings.ts](/d:/New%20folder/StellarDominion-2/server/routes-settings.ts)
- [shared/config/ogamexAssetsConfig.ts](/d:/New%20folder/StellarDominion-2/shared/config/ogamexAssetsConfig.ts)
