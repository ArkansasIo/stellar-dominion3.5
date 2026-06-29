# Interplanetary Power Grid

**Last Updated:** June 18, 2026

---

## Overview

The Interplanetary Power Grid & AIC Resource Network models an energy civilization where every planet, moon, station, and resource field is both a local economy and a node in a larger strategic network.

### Core Loop

1. Survey bodies for energy and strategic resources
2. Build local generation and black-start storage
3. Link nodes using orbital relays, microwave links, laser lanes, and wormhole conduits
4. Select an AIC doctrine and allocate civilian, industrial, research, and defense loads
5. Spend resources on repairs, technologies, and infrastructure projects
6. Process cycles to settle energy, storage, extraction, research, maintenance, wear, and incidents
7. Respond to faults, attacks, fuel shortages, stellar weather, and demand spikes
8. Expand from a planetary grid to a stellar and interstellar energy economy

---

## Architecture

### Static Catalog

> **Source:** client/src/lib/interplanetaryPowerGrid.ts

Contains static data for all generation sources, transmission types, storage, doctrines, technologies, projects, and incidents.

### Simulation Engine

> **Source:** client/src/lib/interplanetaryPowerSimulation.ts

Owns serializable state, transactions, cycle settlement, incidents, projects, economy, and progression rules. Has no React dependency and can move behind server APIs without rewriting rules.

### Frontend

> **Source:** client/src/pages/PowerGrid.tsx

Presentation layer with player input and browser persistence.

---

## Generation Sources

- Helium-3 fusion — dependable planetary/lunar workhorse
- Orbital solar crowns — fast stellar power, alignment/storm risks
- Dyson swarms — extreme baseload, large construction costs
- Geothermal mantle taps — stable local power on volcanic worlds
- Antimatter catalysis — compact peak power, severe containment risk
- Penrose engines — final-era exotic generators for singularity sites

Each source defines output, stability, ramp speed, valid locations, fuel, byproducts, and failure risks.

---

## Transmission & Storage

- Superconductive grids — world distribution
- Microwave constellations — orbital facilities and moons
- Coherent lasers — dense power between aligned planets
- Orbital relays — convert, buffer, route, meter, island
- Quantum nodes — authenticated command data (no usable energy)
- Wormhole conduits — late-game interstellar exchange

Every lane has capacity, flow, efficiency, integrity, threat, and recurring maintenance.

---

## AIC Management

The Autonomous Infrastructure Core:
- Forecasts demand (population, industry, fleet, weather, research)
- Dispatches generation and storage
- Selects routes using loss, congestion, threat, integrity
- Isolates faults and creates temporary microgrids
- Schedules extraction and construction loads
- Detects false telemetry and hostile control signals
- Records decisions in an audit log
- Enforces minimum safety constraints

### Doctrines

1. Balanced Steward
2. Expansion Director
3. Scientific Ascendancy
4. Fortress Protocol
5. Blackout Survival

---

## Resources

- **Bulk**: metal, crystal, deuterium, energy
- **Strategic**: helium-3, antimatter, exotic matter, quantum cores, credits, data

Remote extraction scales with delivered power, integrity, automation, technology, and infrastructure projects.

---

## Technology Eras

| Era | Name | Key Technologies |
|-----|------|-----------------|
| I | Planetary Electrification | Predictive Smart Grid, High-Temp Superconductors, Closed He-3 Fusion |
| II | Orbital Integration | Adaptive Beam Forming, Flux Compression Batteries, Autonomous Resource Fields |
| III | Stellar Infrastructure | Dyson Swarm Operations, Entangled Command Fabric, Antimatter Grid Catalysis |
| IV | Interstellar Resilience | Self-Healing Infrastructure, Vacuum Energy Cells, Wormhole Power Conduits |
| V | Transcendent Energy Economy | Penrose Extraction Engine, Sentient Dispatch Covenant, Stellar Matter Economy |

---

## Cycle Settlement

Each cycle:
1. Recalculates generation from integrity, upgrades, projects, incidents
2. Calculates transmission loss from active lanes, technology, doctrine, AIC
3. Allocates delivered power across node demand
4. Charges storage from surplus or discharges into deficit
5. Applies brownout, blackout, population, wear, maintenance consequences
6. Calculates link flow and utilization damage
7. Advances construction using industrial allocation
8. Applies completed-project effects
9. Produces resources, credits, data, research
10. Charges maintenance costs
11. Ages incidents and applies escalation damage
12. Performs deterministic incident-risk checks and writes audit log

---

## Incidents

Implemented incidents:
- Coronal mass ejections
- Relay sabotage
- Containment drift
- Thermal saturation
- False telemetry
- Collector orbital drift

Node states: nominal, strained, brownout, blackout, isolated.

---

## Testing

```bash
npm run smoke:power-grid
```

Verifies cycle settlement, link control, incident creation, research, construction, and permanent project effects.
