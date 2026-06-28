# Text UML

## Application Context

```text
+---------------------------+
|        Player Browser     |
+-------------+-------------+
              |
              v
+-------------+-------------+
| React Client Application  |
| - Auth title page         |
| - Shared GameLayout       |
| - System pages            |
| - Feature pages           |
+-------------+-------------+
              |
              v
+-------------+-------------+
| Express API Server        |
| - auth/session routes     |
| - settings routes         |
| - health/status routes    |
| - gameplay routes         |
+-------------+-------------+
              |
              v
+-------------+-------------+
| Storage / Database Layer  |
| - player state            |
| - settings                |
| - account data            |
| - gameplay records        |
+---------------------------+
```

## Frontend Module View

```text
+-------------------+
| App Router        |
+---------+---------+
          |
          +-------------------------------+
          |                               |
          v                               v
+---------+---------+         +-----------+-----------+
| Auth.tsx          |         | In-Game Pages         |
| - login/register  |         | - empire              |
| - nine realms     |         | - research            |
| - server health   |         | - military            |
+-------------------+         | - exploration         |
                              | - diplomacy           |
                              | - economy             |
                              | - system              |
                              +-----------+-----------+
                                          |
                                          v
                              +-----------+-----------+
                              | GameLayout.tsx        |
                              | - top bar             |
                              | - sidebar nav         |
                              | - submenu cards       |
                              | - mobile sheet menu   |
                              | - device prefs        |
                              +-----------------------+
```

## Settings Flow

```text
Player
  -> Settings.tsx
  -> PUT /api/settings/player/options
  -> routes-settings.ts
  -> storage.setSetting(...)
  -> persisted player option payload
  -> GET /api/settings/player/options
  -> GameLayout.tsx consumes options
  -> document root datasets/classes update
```

## Imported Source Boundary

```text
+-------------------------+      +--------------------------+
| ogamex-source/          | ---> | generated/ogamex-ts/     |
| vendored upstream ref   |      | bulk rewrite scaffolds   |
+-------------------------+      +-------------+------------+
                                                |
                                                v
                                   +------------+------------+
                                   | shared/ogamex/          |
                                   | curated TS bridge code  |
                                   +------------+------------+
                                                |
                                                v
                                   +------------+------------+
                                   | live app runtime usage  |
                                   +-------------------------+
```

## Navigation Model

```text
GameLayout
  -> MenuSection
    -> NavGroup
      -> NavItem
        -> Page Route
          -> Submenu sibling cards
```

## Current Top-Level Domain Map

```text
Universe Empire Dominions
  -> Empire
  -> Research
  -> Military
  -> Exploration
  -> Diplomacy
  -> Economy
  -> System
```

## Runtime Interaction Summary

```text
Auth Page
  -> enters game
  -> in-game route
  -> GameLayout wraps page
  -> page fetches data with TanStack Query
  -> API returns state
  -> layout + page render shared shell and local content
```
