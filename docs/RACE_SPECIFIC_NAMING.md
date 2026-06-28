# Race-Specific Naming System

Each player race has unique naming conventions for technologies, buildings, ships, and structures — reflecting their culture, biology, and worldview. When a player selects a race, all in-game references adapt to their species' terminology.

---

## Table of Contents

1. [Races Overview](#races-overview)
2. [Technology Names by Race](#technology-names-by-race)
3. [Building Names by Race](#building-names-by-race)
4. [Ship Names by Race](#ship-names-by-race)
5. [UI & Flavor Text by Race](#ui--flavor-text-by-race)
6. [Implementation Notes](#implementation-notes)

---

## Races Overview

| Race | Culture | Philosophy |
|------|---------|------------|
| Terran | Human, militaristic-industrial | Adaptability, pragmatism |
| Aquarian | Aquatic, biological-fluid | Flow, symbiosis, deep knowledge |
| Mechborn | Cybernetic, machine-perfection | Efficiency, optimization, logic |
| Lithoid | Silicon-mineral, ancient | Endurance, crystalline resonance |
| Zypherian | Insectoid hive-mind | Swarm unity, collective will |
| Vortexborn | Interdimensional energy | Warp phenomena, dimensional science |
| Silicate | Living crystal entities | Resonance, harmonic frequency |
| Ethereal | Extra-dimensional spirits | Quantum states, spiritual transcendence |

---

## Technology Names by Race

Each race calls the same technology by a different name reflecting their worldview.

### Weapons

| Technology | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|-----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Laser Weapons | Laser Cannon | Bio-Luminescent Lance | Directed Energy Array | Photon Razor | Chitin Beam | Rift Piercer | Prismatic Spire | Spectral Lance |
| Plasma Weapons | Plasma Torpedo | Thermal Vent Projector | Plasma Conduit | Magma Emitter | Hive Thermal Bomb | Singularity Bolt | Molten Core Lance | Entropy Beam |
| Missile Weapons | Guided Missile | Coral-Spine Launcher | Smart Missile Pod | Stone Shatter | Swarm Missile | Phase Missile | Crystal Shards | Karma Rockets |
| Railgun | Mass Driver | Pressure Cannon | Kinetic Rail | Litho Cannon | Mandible Rail | Void Spike | Resonance Piercer | Thought Accelerator |
| Drone Weapons | Combat Drone | Symbiote Swarm | Micro-Drone Cloud | Mineralite Swarm | Hive Drones | Rift Constructs | Shard Sentinels | Spectral Phantoms |

### Defenses

| Technology | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|-----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Shields | Energy Shield | Hydro-Barrier | Deflector Grid | Stone Mantle | Carapace Field | Warp Bubble | Crystal Lattice | Void Cloak |
| Armor | Titanium Plating | Bio-Armor | Nano-Composite | Crystal Plating | Chitin Armor | Phase Armor | Diamond Shell | Ethereal Vestment |
| Point Defense | CIWS Turret | Reflexive Membrane | Auto-Counter System | Echolocation Grid | Wing Guard | Rift Sentinel | Harmonic Disruptor | Thought Shield |

### Propulsion

| Technology | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|-----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Engines | Ion Thruster | Current Rider | Quantum Drive | Graviton Pulse | Swarm Propulsion | Warp Nacelle | Crystal Harmonics | Phase Shift |
| Warp Drive | Warp Drive | Tidal Gate | Phase Translocator | Deep Stone Rift | Hive Jump | Rift撕裂者 | Resonance Gate | Transcendence Portal |
| Hyperdrive | Hyperdrive | Current Fold | Quantum Tunnel | Litho-Warp | Swarm Blink | Void Gate | Crystal Fold | Spirit Walk |

### Economy

| Technology | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|-----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Mining | Excavation Drill | Deep Trench Miner | Automated Extractor | Crystal Bore | Hive Burrower | Rift Harvester | Resonance Miner | Thought Excavator |
| Energy | Fusion Reactor | Thermal Vent Core | Zero-Point Module | Geothermal Tap | Hive Power Node | Void Reactor | Crystal Core | Astral Engine |
| Research | Research Lab | Tidal Observatory | Processing Core | Deep Stone Archive | Hive Intelligence | Rift Nexus | Crystal Matrix | Oracle Shrine |

### Special

| Technology | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|-----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Colony Ship | Colony Ship | Reef Seeder | Construction Drone | Litho-Colonizer | Hive Spore | Rift Colonizer | Crystal Seeder | Spirit Vessel |
| terraforming | Terraforming | Ocean Reshaping | Planetary Engineering | Geological Restructuring | Hive Adaptation | Dimensional Folding | Crystal Seeding | Astral Conversion |
| FTL Comms | Subspace Radio | Tidal Pulse Network | Quantum Entanglement | Stone Resonance | Hive Mind Link | Rift Comm | Harmonic Broadcast | Thought Network |
| Shields | Energy Shield | Hydro-Barrier | Deflector Grid | Stone Mantle | Carapace Field | Warp Bubble | Crystal Lattice | Void Cloak |

---

## Building Names by Race

### Resource Buildings

| Building | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Metal Mine | Metal Mine | Reef Extractor | Auto-Forge | Crystal Bore | Hive Excavator | Rift Tapper | Resonance Mine | Astral Forge |
| Crystal Mine | Crystal Mine | Deep Trench Rig | Nano-Refinery | Mineral Spire | Swarm Refinery | Void Extractor | Shard Mine | Spirit Well |
| Deuterium Plant | Deuterium Plant | Thermal Vent | Quantum Converter | Litho-Synthesizer | Hive Synthesizer | Rift Condenser | Crystal Synthesizer | Ethereal Distiller |
| Solar Panel | Solar Array | Thermal Collector | Energy Module | Sunstone Grid | Hive Solar Node | Rift Harvester | Prism Collector | Astral Gatherer |
| Storage Depot | Storage Depot | Coral Vault | Nano-Bunker | Stone Repository | Hive Cache | Rift Vault | Crystal Vault | Spirit Repository |

### Military Buildings

| Building | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Shipyard | Shipyard | Reef Drydock | Construction Bay | Litho-Dock | Hive Spawning Pool | Rift Forge | Crystal Forge | Spirit Yards |
| Defense Tower | Missile Turret | Stinger Battery | Laser Turret | Crystal Spire | Chitin Turret | Rift Cannon | Shard Tower | Spectral Bastion |
| Shield Generator | Shield Generator | Hydro-Dome | Deflector Array | Stone Shield | Carapace Dome | Warp Shroud | Crystal Dome | Void Barrier |
| Barracks | Military Academy | Warrior Pool | Training Core | Stone Drill | Hive Warrior Nest | Rift Training | Resonance Drill | Spirit Sanctum |

### Science Buildings

| Building | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Research Lab | Research Lab | Tidal Lab | Processing Core | Deep Stone Archive | Hive Think Tank | Rift Nexus | Crystal Lab | Oracle Shrine |
| Observatory | Space Observatory | Oceanic Lens | Scanner Array | Starstone Eye | Hive Sensor | Rift Eye | Prism Observatory | Astral Observatory |
| Academy | Academy | Current School | Logic Institute | Litho-Library | Hive Academy | Rift Academy | Harmonic School | Spirit Academy |

### Government Buildings

| Building | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|----------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Capitol | Capitol | Coral Palace | Central Core | Stone Throne | Hive Nexus | Rift Citadel | Crystal Citadel | Spirit Sanctum |
| Embassy | Embassy | Current Hall | Diplomacy Node | Stone Circle | Hive Council | Rift Hall | Resonance Hall | Council of Echoes |
| Market | Trade Hub | Tide Market | Commerce Node | Stone Exchange | Hive Bazaar | Rift Market | Crystal Exchange | Astral Bazaar |

---

## Ship Names by Race

### Ship Classes

| Ship | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Light Fighter | Interceptor | Reef Skimmer | Scout Drone | Stone Dart | Swarm Wing | Rift Blade | Shard Flyer | Spectral Wisp |
| Heavy Fighter | Strike Fighter | Deep Hunter | Heavy Drone | Crystal Hammer | Swarm Lancer | Rift Striker | Prism Hunter | Astral Fang |
| Cruiser | Cruiser | Leviathan | Battle Unit | Litho-Cruiser | Hive Cruiser | Rift Cruiser | Crystal Cruiser | Spirit Cruiser |
| Battleship | Battleship | Abyssal Dreadnought | War Platform | Stone Juggernaut | Hive Dreadnought | Rift Titan | Diamond Colossus | Astral Titan |
| Battlecruiser | Battlecruiser | Tide Runner | Assault Platform | Litho-Breaker | Hive Breaker | Rift Breaker | Prism Breaker | Void Breaker |
| Dreadnought | Dreadnought | Kraken | Annihilation Unit | World Crusher | Hive Annihilator | Rift Destroyer | Star Shatterer | Cosmic Destroyer |

### Utility Ships

| Ship | Terran | Aquarian | Mechborn | Lithoid | Zypherian | Vortexborn | Silicate | Ethereal |
|------|--------|----------|----------|---------|-----------|------------|----------|----------|
| Colony Ship | Colony Ship | Reef Seeder | Construction Drone | Litho-Colonizer | Hive Spore | Rift Colonizer | Crystal Seed | Spirit Vessel |
| Transport | Transport | Current Hauler | Supply Drone | Stone Carrier | Hive Carrier | Rift Transport | Shard Hauler | Astral Barge |
| Spy Ship | Recon Ship | Shadow Eel | Stealth Drone | Invisible Stone | Hive Lurker | Rift Phantom | Crystal Ghost | Spirit Shade |
| Explorer | Scout | Tide Rider | Survey Drone | Pathfinder | Hive Scout | Rift Walker | Prism Seeker | Astral Wanderer |

---

## UI & Flavor Text by Race

### Welcome Message

| Race | Welcome Text |
|------|-------------|
| Terran | "Welcome, Commander. The stars await your command." |
| Aquarian | "The currents have guided you here, Tidal One. The depths welcome your wisdom." |
| Mechborn | "Efficiency protocol engaged. Awaiting operational directives, Commander." |
| Lithoid | "The stone remembers. You have been chosen to shape the cosmos." |
| Zypherian | "The Hive has spoken. One mind, one purpose, one destiny." |
| Vortexborn | "Reality bends to your will. The rift opens for you, Walker." |
| Silicate | "Harmony resonates through crystal. You are the frequency of change." |
| Ethereal | "Between dimensions, between moments — you are the bridge. We await your vision." |

### Resource Headers

| Race | Metal | Crystal | Deuterium | Energy |
|------|-------|---------|-----------|--------|
| Terran | Metal | Crystal | Deuterium | Energy |
| Aquarian | Coral | Pearl | Thermal Vent | Bioluminescence |
| Mechborn | Alloy | Polymer | Plasma | Charge |
| Lithoid | Ore | Gem | Lithium | Resonance |
| Zypherian | Chitin | Silk | Pheromone | Swarm Energy |
| Vortexborn | Rift Matter | Dimensional Shard | Void Essence | Warp Charge |
| Silicate | Crystal | Prism | Harmonic Core | Spectrum |
| Ethereal | Spirit Dust | Astral Shard | Void Essence | Mana |

### Research Category Names

| Race | Weapons | Shields | Propulsion | Economy | Computing |
|------|---------|---------|------------|---------|-----------|
| Terran | Ballistics | Defense Systems | Propulsion | Industrial | Computing |
| Aquarian | Combat Biology | Hydro-Shields | Current Dynamics | Deep Harvesting | Neural Coral |
| Mechborn | Directed Energy | Deflectors | Quantum Movement | Automation | Logic Cores |
| Lithoid | Crystal Weapons | Stone Mantles | Graviton Drive | Mineral Processing | Stone Computation |
| Zypherian | Hive Armaments | Carapace Tech | Swarm Propulsion | Hive Industry | Collective Mind |
| Vortexborn | Rift Weaponry | Warp Shields | Dimensional Travel | Void Harvesting | Rift Computing |
| Silicate | Prism Weapons | Lattice Shields | Harmonic Travel | Crystal Industry | Resonance Core |
| Ethereal | Spectral Arms | Void Cloaks | Phase Shifting | Astral Harvesting | Oracle Network |

---

## Implementation Notes

### Data Structure

Add a `raceNames` field to relevant config objects:

```typescript
interface RaceNameOverride {
  raceId: RaceId;
  displayName: string;
  flavorText?: string;
}

// In technology config:
interface Technology {
  id: string;
  name: string;  // Default name
  raceNames?: Partial<Record<RaceId, RaceNameOverride>>;
  // ...
}
```

### Resolution Order

1. Look up player's `commander.race` from `playerStates`
2. Check `raceNames[playerRaceId]` on the config entry
3. Fall back to the default `name` if no override exists

### Files to Modify

| File | Change |
|------|--------|
| `client/src/lib/commanderTypes.ts` | Add `RaceNameOverride` interface and `RACE_NAMES` map |
| `shared/config/technologyTreeConfig.ts` | Add `raceNames` to each technology entry |
| `shared/config/governmentBuildingStructuresConfig.ts` | Add `raceNames` to each building entry |
| `shared/config/ships/shipyard/shipyardSystem.ts` | Add `raceNames` to each ship entry |
| `client/src/lib/gameContext.tsx` | Add `getRaceName(configEntry, raceId)` helper |
| All UI components displaying names | Use `getRaceName()` instead of raw `.name` |

### Seed Script

```bash
# After implementing raceNames, update all config entries:
npm run db:push
```

This is a cosmetic/flavor system — no gameplay balance changes are needed.
