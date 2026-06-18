# Interplanetary Power Grid & AIC Resource Network

## Player fantasy and core loop

The player is the architect of an energy civilization. Every planet, moon, station, stellar collector, and resource field is both a local economy and a node in a larger strategic network.

The core loop is:

1. Survey bodies for energy and strategic resources.
2. Build local generation and black-start storage.
3. Link nodes using orbital relays, microwave links, laser lanes, and wormhole conduits.
4. Select an AIC doctrine and allocate civilian, industrial, research, and defense loads.
5. Spend resources on repairs, technologies, and infrastructure projects.
6. Process cycles to settle energy, storage, extraction, research, maintenance, wear, and incidents.
7. Respond to faults, attacks, fuel shortages, stellar weather, and demand spikes.
8. Expand from a planetary grid to a stellar and interstellar energy economy.

## Generation

- Helium-3 fusion is the dependable planetary and lunar workhorse.
- Orbital solar crowns provide fast stellar power but suffer alignment and storm risks.
- Dyson swarms provide extreme baseload with large construction and coordination costs.
- Geothermal mantle taps provide stable local power on volcanic worlds and tidal moons.
- Antimatter catalysis supplies compact peak power at severe containment risk.
- Penrose engines are final-era exotic generators for singularity sites.

Each source defines output, stability, ramp speed, valid locations, fuel, byproducts, and failure risks.

## Transmission and storage

- Superconductive grids distribute power on a world.
- Microwave constellations serve orbital facilities and moons.
- Coherent lasers transfer dense power between aligned planets.
- Orbital relays convert, buffer, route, meter, and island the network.
- Quantum nodes carry authenticated command data but do not transmit usable energy.
- Wormhole conduits provide late-game interstellar energy exchange.

Every lane has capacity, flow, efficiency, integrity, threat, and recurring maintenance. Storage provides peak shaving, emergency discharge, black-start capacity, fleet charging, and surplus capture.

## AIC management

The Autonomous Infrastructure Core:

- forecasts population, industry, fleet, weather, and research demand;
- dispatches generation and storage;
- selects routes using loss, congestion, threat, and integrity;
- isolates faults and creates temporary microgrids;
- schedules extraction and construction loads;
- detects false telemetry and hostile control signals;
- records major decisions in an audit log;
- enforces minimum safety constraints.

The five doctrines are Balanced Steward, Expansion Director, Scientific Ascendancy, Fortress Protocol, and Blackout Survival.

## Resources

Bulk resources are metal, crystal, deuterium, and energy. Strategic resources are helium-3, antimatter, exotic matter, quantum cores, credits, and data.

Remote extraction scales with delivered power, integrity, automation, technology, and infrastructure projects. Surplus energy earns market credits. Active lanes and maintenance debt create recurring costs. Data and powered laboratories produce research points.

## Technology eras

### Era I: Planetary electrification

- Predictive Smart Grid
- High-Temperature Superconductors
- Closed Helium-3 Fusion Cycle

### Era II: Orbital integration

- Adaptive Beam Forming
- Flux Compression Batteries
- Autonomous Resource Fields

### Era III: Stellar infrastructure

- Dyson Swarm Operations
- Entangled Command Fabric
- Antimatter Grid Catalysis

### Era IV: Interstellar resilience

- Self-Healing Infrastructure
- Vacuum Energy Cells
- Wormhole Power Conduits

### Era V: Transcendent energy economy

- Penrose Extraction Engine
- Sentient Dispatch Covenant
- Stellar Matter Economy

## Implemented infrastructure projects

- Helios Collector Ring
- Aurelia Black-Start Reserve
- Vulcan Industrial Heat Loop
- Selene Containment Citadel
- Khepri Autonomous Drone Cloud
- Lagrange AIC Expansion
- System Relay Redundancy
- Interstellar Energy Exchange

Projects have prerequisites, strategic material and credit costs, cycle durations, queue progress, and permanent mechanical effects.

## Incident and failure system

Implemented incidents include coronal mass ejections, relay sabotage, containment drift, thermal saturation, false telemetry, and collector orbital drift.

Nodes can become nominal, strained, brownout, blackout, or isolated. Incidents have severity, targets, response costs, deadlines, immediate damage, persistent penalties, and escalation consequences. Unresolved critical incidents can disable links or force nodes into blackout.

## Cycle settlement

Each cycle:

1. Recalculates generation from integrity, upgrades, projects, and incidents.
2. Calculates transmission loss from active lanes, technology, doctrine, and AIC infrastructure.
3. Allocates delivered power across node demand.
4. Charges storage from surplus or discharges it into a deficit.
5. Applies brownout, blackout, population, wear, and maintenance consequences.
6. Calculates link flow and utilization damage.
7. Advances construction using industrial allocation.
8. Applies completed-project effects.
9. Produces resources, credits, data, and research.
10. Charges maintenance costs.
11. Ages incidents and applies escalation damage.
12. Performs deterministic incident-risk checks and writes the audit log.

## Persistent state

The browser automatically saves a versioned snapshot after every command. It contains doctrine, priorities, stockpiles, technologies, projects, incidents, nodes, storage, links, lifetime statistics, and audit history. Invalid or obsolete snapshots safely return to the canonical starting state.

## Interface features

- Single-cycle and five-cycle processing
- Doctrine selection and normalized priority controls
- Node isolation, reconnection, and repair
- Lane activation, shutdown, flow monitoring, and repair
- Construction commissioning and queue monitoring
- Stockpile, extraction, maintenance, storage, and lifetime analytics
- Technology prerequisites and purchasing
- Incident response and audit history
- AIC forecasts, manual incident drills, automation control, pause, persistence, and reset
- Reference catalogs for all generation and transmission families

## Implementation boundary

`client/src/lib/interplanetaryPowerGrid.ts` owns static catalog data.

`client/src/lib/interplanetaryPowerSimulation.ts` owns serializable state, transactions, cycle settlement, incidents, projects, economy, and progression rules.

`client/src/pages/PowerGrid.tsx` owns presentation, player input, and browser persistence.

The simulation has no React dependency and can later move behind server APIs without rewriting its rules.

Run `npm run smoke:power-grid` to verify cycle settlement, link control, incident creation, research, construction, and permanent project effects.
