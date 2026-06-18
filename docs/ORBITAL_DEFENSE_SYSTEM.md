# Satellite & Orbital Platform Warfare System

## Scope

The orbital-defense subsystem models armed satellites, static defense platforms, carriers, command stations, and orbital fortresses. It is a persistent strategic layer with construction, fitting, power and heat budgets, technology prerequisites, level and tier progression, active abilities, doctrine, combat simulation, damage, repairs, salvage, and experience.

## Platform categories

### Satellites

- Watcher Defense Satellite: sensor, stealth detection, point defense, and fire-control support.
- Lancer Strike Satellite: offensive interceptor for fighters, raiders, and convoy interdiction.

### Platforms

- Javelin Missile Platform: long-range missiles, retaliation, and orbital denial.
- Aegis Shield Platform: projected shields, point defense, repair, and fleet protection.
- Bastion Gun Platform: heavy kinetic weapons for capital-ship denial.

### Stations and fortresses

- Raptor Orbital Carrier: drone patrols, interceptors, missile defense, and area control.
- Nexus Command Platform: command, sensors, coordinated fire, shield support, and repairs.
- Citadel Orbital Fortress: maximum-tier siege, defense, command, hangar, and logistics integration.

Each hull has a role, category, starting tier, maximum tier, maximum level, hull, armor, shield, power, heat capacity, sensors, tracking, evasion, command, crew, slot layout, default modules, abilities, construction cost, and technology gate.

## Levels and tiers

- Levels improve hull, armor, shields, power, heat capacity, and combat output.
- Upgrade costs scale with current level and tier.
- Every tenth level raises the platform tier when its hull class allows it.
- Tier growth represents major refits and increases the scaling applied to all base systems.
- Platforms gain combat experience. Each 1,000 experience can award an additional level.

## Module categories

- Weapons: pulse lasers, rail batteries, missile cells, ion lances, graviton siege weapons, and point defense.
- Shields: directional deflectors and fortress shield matrices.
- Armor: composite and adaptive reactive armor.
- Reactors: fusion and antimatter power cores.
- Sensors: quantum aperture radar.
- Utilities: predictive fire control, nanite repair, and stealth baffling.
- Hangars: interceptor drone wings.

Every module has a tier, category, power use, heat output, build cost, optional technology gate, and category-specific substats.

### Weapon substats

- Base damage
- Rate of fire
- Accuracy
- Range
- Tracking
- Damage type
- Shield penetration
- Armor penetration
- Critical chance
- Ammunition
- Preferred target class

### Defensive substats

- Shield capacity
- Armor
- Hull reinforcement
- Shield recharge
- Point-defense strength
- Damage-type resistances

### Support substats

- Reactor output
- Heat capacity
- Sensor strength
- Tracking
- Evasion
- Repair rate
- Command strength
- Drone combat power

## Power and heat

Platforms calculate total module power consumption against reactor and hull generation. They also compare weapon and module heat against heat capacity.

- A power deficit proportionally reduces effective damage and readiness.
- Heat saturation proportionally reduces sustained damage and readiness.
- Reactors increase available power and cooling.
- Heavy weapons and fortress shields require advanced reactors to operate efficiently.

This makes slot count alone insufficient: an overloaded platform can mount impressive systems while performing poorly.

## Combat layers

Orbital combat resolves in rounds:

1. Fleet sensors contest enemy stealth and evasion.
2. Tracking and doctrine determine firing accuracy.
3. Point-defense systems intercept missiles and drones.
4. Platform weapons deal shield, armor, and hull damage.
5. Critical synchronized firing solutions may increase damage.
6. Enemy fire selects a surviving platform and checks accuracy against evasion.
7. Shields absorb damage first.
8. Armor mitigates and absorbs penetrating damage.
9. Remaining damage is applied to hull.
10. Shield recharge and nanite repair operate after attacks.
11. Platforms at zero hull are disabled and removed from the surviving network.

Combat produces a persistent report containing rounds, abilities, damage dealt, damage taken, interceptions, disabled platforms, damaged platforms, salvage, and experience.

## Threat profiles

- Pirate Fighter Swarm
- Stealth Corvette Raid
- Capital Assault Group
- Planetary Siege Taskforce
- Dreadnought Incursion

Threats define tier, attack strength, accuracy, evasion, shields, armor, hull, missile volume, damage type, target class, and maximum combat rounds.

## Doctrines

- Sentinel Network: balanced detection, tracking, defense, and interception.
- Bastion Doctrine: maximum shield and armor survival.
- Hunter-Killer Doctrine: precision alpha-strike damage.
- Orbital Interdiction: missile, drone, and fighter suppression.
- Retaliation Protocol: absorbs opening damage and strengthens counters.

Changing doctrine propagates to every deployed platform.

## Active abilities

- Weapons Overcharge
- Aegis Pulse
- Kill-Zone Prediction
- Drone Interceptor Screen
- Phase-Cloak Ambush
- Emergency Nanite Repair
- Retaliation Protocol
- Orbital Denial Salvo

Abilities have trigger rules, effects, and combat-round cooldowns. The combat engine activates them automatically when their tactical conditions are met.

## Technology tree

The five-tier tree includes:

- Orbital Ballistics
- Smart Munitions
- Shield Projection
- Quantum Sensor Apertures
- Predictive Combat AI
- Drone Coordination Mesh
- Layered Shield Harmonics
- Adaptive Armor Materials
- Ion Harmonic Weapons
- Orbital Nanite Repair
- Stealth Orbit Engineering
- Orbital Battle Network
- Antimatter Reactors
- Orbital Fortress Engineering
- Graviton Focusing

Technologies unlock hulls, modules, abilities, and fleet-wide bonuses. Higher-tier research enforces prerequisite chains.

## Persistence and architecture

`client/src/lib/orbitalDefenseSystem.ts` owns catalog data, serializable state, stat calculation, progression transactions, construction, fitting, repair, and deterministic combat rules.

`client/src/pages/OrbitalDefense.tsx` owns presentation, player commands, and browser persistence.

The system stores platforms, levels, tiers, experience, modules, health layers, ammunition, readiness, cooldowns, resources, technologies, battle reports, and alerts.

Run `npm run smoke:orbital-defense` to verify research, fitting, upgrades, doctrine propagation, construction, and combat reporting.

## Expanded operations and logistics

### Orbit zones

Platforms can be reassigned between Low Defense Orbit, the Geostationary Shield Ring, High Polar Watch, the Lunar Lagrange Bastion, and the Outer Interception Shell. Each zone has capacity, sensor, defense, damage, and upkeep modifiers.

### Service queues

Construction, upgrades, repairs, and resupply can enter a persistent operations queue. Advancing the orbital cycle progresses every order, completes finished work, recharges shields, reduces ability cooldowns, raises readiness, generates sensor research, and charges platform upkeep.

### Refit and inventory

Installed modules can be removed into persistent inventory and installed on another compatible platform without paying for the same equipment twice. Slot compatibility remains enforced. Decommissioning a platform recovers all modules and salvages a portion of its construction resources.

### Platform command

Every asset can be:

- renamed;
- assigned to an orbit zone;
- given a local doctrine independent of the fleet default;
- upgraded or repaired;
- queued for ammunition and readiness resupply;
- decommissioned.

### Orbital missions

Platforms can conduct patrol, recon, interception, escort, and pirate-suppression missions. Missions have duration, risk, assigned platforms, progress, rewards, and success or failure consequences. Mission success uses deployed combat power and sensor strength; failure damages readiness and integrity.

### Upkeep and records

Every platform and fitted module contributes to recurring credit upkeep, modified by orbit. Lifetime records track victories, defeats, damage dealt, damage taken, missile interceptions, and salvage value.
