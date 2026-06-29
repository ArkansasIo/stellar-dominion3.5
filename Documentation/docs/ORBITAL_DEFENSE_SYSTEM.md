# Orbital Defense System

**Last Updated:** June 18, 2026

---

## Overview

Models armed satellites, static defense platforms, carriers, command stations, and orbital fortresses. A persistent strategic layer with construction, fitting, power/heat budgets, technology prerequisites, level/tier progression, active abilities, doctrine, combat simulation, damage, repairs, salvage, and experience.

---

## Architecture

### System Library

> **Source:** client/src/lib/orbitalDefenseSystem.ts

Owns catalog data, serializable state, stat calculation, progression transactions, construction, fitting, repair, and deterministic combat rules.

### Frontend

> **Source:** client/src/pages/OrbitalDefense.tsx

Presentation layer with player commands and browser persistence.

---

## Platform Categories

### Satellites
- **Watcher Defense Satellite** — sensor, stealth detection, point defense, fire-control support
- **Lancer Strike Satellite** — offensive interceptor for fighters, raiders, convoy interdiction

### Platforms
- **Javelin Missile Platform** — long-range missiles, retaliation, orbital denial
- **Aegis Shield Platform** — projected shields, point defense, repair, fleet protection
- **Bastion Gun Platform** — heavy kinetic weapons for capital-ship denial

### Stations & Fortresses
- **Raptor Orbital Carrier** — drone patrols, interceptors, missile defense, area control
- **Nexus Command Platform** — command, sensors, coordinated fire, shield support, repairs
- **Citadel Orbital Fortress** — maximum-tier siege, defense, command, hangar, logistics

Each hull has: role, category, starting/max tier, max level, hull, armor, shield, power, heat capacity, sensors, tracking, evasion, command, crew, slot layout, default modules, abilities, construction cost, technology gate.

---

## Levels & Tiers

- Levels improve hull, armor, shields, power, heat capacity, combat output
- Upgrade costs scale with current level and tier
- Every 10th level raises platform tier (when hull class allows)
- Tier growth represents major refits with increased scaling
- Platforms gain combat experience (1,000 XP per additional level)

---

## Module Categories

- **Weapons** — pulse lasers, rail batteries, missile cells, ion lances, graviton siege weapons, point defense
- **Shields** — directional deflectors, fortress shield matrices
- **Armor** — composite and adaptive reactive armor
- **Reactors** — fusion and antimatter power cores
- **Sensors** — quantum aperture radar
- **Utilities** — predictive fire control, nanite repair, stealth baffling
- **Hangars** — interceptor drone wings

---

## Power & Heat

Platforms calculate module power consumption against reactor/hull generation. Weapon/module heat is compared against heat capacity.

- Power deficit proportionally reduces effective damage and readiness
- Heat saturation proportionally reduces sustained damage and readiness
- Heavy weapons and fortress shields require advanced reactors

---

## Combat Resolution

> **Source:** client/src/lib/orbitalDefenseSystem.ts

Combat resolves in rounds:
1. Fleet sensors contest enemy stealth and evasion
2. Tracking and doctrine determine firing accuracy
3. Point-defense intercepts missiles and drones
4. Platform weapons deal shield, armor, hull damage
5. Critical synchronized firing solutions may increase damage
6. Enemy fire selects a surviving platform, checks accuracy
7. Shields absorb first
8. Armor mitigates and absorbs penetrating damage
9. Remaining damage applied to hull
10. Shield recharge and nanite repair operate after attacks
11. Zero-hull platforms are disabled and removed

---

## Threat Profiles

- Pirate Fighter Swarm
- Stealth Corvette Raid
- Capital Assault Group
- Planetary Siege Taskforce
- Dreadnought Incursion

---

## Doctrines

- **Sentinel Network** — balanced detection, tracking, defense, interception
- **Bastion Doctrine** — maximum shield and armor survival
- **Hunter-Killer Doctrine** — precision alpha-strike damage
- **Orbital Interdiction** — missile, drone, fighter suppression
- **Retaliation Protocol** — absorbs opening damage, strengthens counters

---

## Active Abilities

- Weapons Overcharge
- Aegis Pulse
- Kill-Zone Prediction
- Drone Interceptor Screen
- Phase-Cloak Ambush
- Emergency Nanite Repair
- Retaliation Protocol
- Orbital Denial Salvo

Abilities activate automatically when tactical conditions are met.

---

## Technology Tree

Five-tier tree including: Orbital Ballistics, Smart Munitions, Shield Projection, Quantum Sensor Apertures, Predictive Combat AI, Drone Coordination Mesh, Layered Shield Harmonics, Adaptive Armor Materials, Ion Harmonic Weapons, Orbital Nanite Repair, Stealth Orbit Engineering, Orbital Battle Network, Antimatter Reactors, Orbital Fortress Engineering, Graviton Focusing.

---

## Expanded Operations

- **Orbit zones** — Low Defense Orbit, Geostationary Shield Ring, High Polar Watch, Lunar Lagrange Bastion, Outer Interception Shell
- **Service queues** — construction, upgrades, repairs, resupply
- **Refit and inventory** — modules can be removed and reinstalled
- **Platform command** — rename, assign zone, set local doctrine, upgrade, repair, resupply, decommission
- **Orbital missions** — patrol, recon, interception, escort, pirate-suppression
- **Upkeep** — recurring credit costs modified by orbit zone

---

## Testing

```bash
npm run smoke:orbital-defense
```

Verifies research, fitting, upgrades, doctrine propagation, construction, and combat reporting.
