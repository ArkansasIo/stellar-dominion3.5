# Ship Fitting System

**Last Updated:** June 18, 2026

---

## Overview

EVE Online-inspired module management system with 90+ modules across multiple categories, classes, and types. Players customize starships with weapons, defense systems, propulsion, electronic warfare, and engineering modules.

---

## Architecture

### Module Catalog

> **Source:** client/src/lib/shipFittingModules.ts

Contains 90+ module definitions with full stat blocks, slot types, tech levels, meta levels, and requirements.

### Fitting Pages

> **Source:** client/src/pages/Fitting.tsx
> **Source:** client/src/pages/FittingEnhanced.tsx

Two fitting interface implementations:
- `Fitting.tsx` — basic fitting page
- `FittingEnhanced.tsx` — advanced fitting page with full module browser

---

## Module Categories

1. **Weapons (30)** — Projectile, Energy, Hybrid, Missile, Drone, Smart Bomb
2. **Defense (25)** — Shield Boosters/Extenders/Hardeners, Armor Repairers/Plates/Hardeners
3. **Propulsion (8)** — Afterburners, Microwarpdrives, Inertial Stabilizers, Overdrive Injectors
4. **Electronic Warfare (12)** — ECM, Dampeners, Webifiers, Disruptors, Scramblers, Painters, Boosters
5. **Engineering (20)** — Damage Modules, Power/CPU, Capacitor, Cargo
6. **Rigs (15)** — Armor, Shield, Weapon, Propulsion, Electronic, Utility

---

## Slot Types

| Slot | Color | Contents |
|------|-------|----------|
| High | Red | Weapons, drones, utility |
| Mid | Blue | Shield, propulsion, EWAR, capacitor, sensors |
| Low | Green | Armor, damage amps, engineering, cargo |
| Rig | Purple | Permanent modifications (destroyed on removal) |

---

## Module Properties

> **Source:** client/src/lib/shipFittingModules.ts

```typescript
interface ShipModule {
  id: string;
  name: string;
  description: string;
  category: string;          // weapon, defense, propulsion, electronic, engineering, utility
  class: string;             // projectile, energy, shield, armor, etc.
  subclass: string;          // autocannon, pulse_laser, booster, etc.
  type: string;              // high, mid, low, rig
  size: string;              // small, medium, large, capital, universal
  meta: number;              // 0-14 (0=T1, 5=T2, 6+=Faction/Officer/Deadspace)
  tech: number;              // 1-3
  cpu: number;
  powergrid: number;
  calibration?: number;      // rigs only
  capacitor?: number;
  stats: Record<string, number | string | boolean>;
  requirements?: { skills?: Record<string, number>; shipSize?: string[] };
  price: { isk: number; materials?: Record<string, number> };
}
```

---

## Ship Sizes

- **Small** — Frigates, Destroyers
- **Medium** — Cruisers, Battlecruisers
- **Large** — Battleships, Dreadnoughts
- **Capital** — Carriers, Supercarriers, Titans
- **Universal** — Fits all ship sizes

---

## Tech & Meta Levels

| Level | Description |
|-------|-------------|
| Tech I | Standard, affordable, low skill requirements |
| Tech II | Advanced, expensive, higher skill requirements |
| Tech III | Elite, very expensive, very high skill requirements |
| Meta 0 | Tech I baseline |
| Meta 1-4 | Improved T1 variants (faction drops) |
| Meta 5 | Tech II |
| Meta 6 | Faction modules |
| Meta 7 | Officer modules |
| Meta 8 | Deadspace modules |
| Meta 14 | Storyline modules |

---

## Resource Constraints

Ships have limited resources:
- **CPU (Teraflops)** — electronic/sensor modules use more
- **Powergrid (Megawatts)** — weapons use significant
- **Calibration** — only used by rigs (typically 400 total)

---

## Stacking Penalties

Multiple modules of the same type have diminishing returns:
- 1st: 100%, 2nd: 87%, 3rd: 57%, 4th: 28%, 5th: 11%, 6th+: minimal

---

## Helper Functions

> **Source:** client/src/lib/shipFittingModules.ts

```typescript
getModulesByCategory(category: string): ShipModule[]
getModulesByType(type: string): ShipModule[]
getModulesBySize(size: string): ShipModule[]
getModuleById(id: string): ShipModule | undefined
getModulesByClass(moduleClass: string): ShipModule[]
getModulesBySubclass(subclass: string): ShipModule[]
getTechLevelModules(techLevel: number): ShipModule[]
getMetaLevelModules(metaLevel: number): ShipModule[]
```

---

## Shared Config

> **Source:** shared/config/index.ts

Module-related configuration is exported from the shared config index.

---

**See also:**
- [API_ROUTES.md](./API_ROUTES.md) — Related API endpoints
