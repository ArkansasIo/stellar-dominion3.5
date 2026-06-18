export type OrbitalRole = "interceptor" | "gunship" | "missile" | "shield" | "command" | "sensor" | "carrier" | "fortress";
export type OrbitalDoctrine = "sentinel" | "bastion" | "hunter" | "interdiction" | "retaliation";
export type ModuleCategory = "weapon" | "shield" | "armor" | "reactor" | "sensor" | "utility" | "hangar";
export type DamageType = "kinetic" | "energy" | "explosive" | "ionic" | "graviton";
export type TargetClass = "fighter" | "capital" | "missile" | "stealth" | "structure";
export type OrbitalOrderType = "construct" | "upgrade" | "repair" | "resupply";
export type OrbitalMissionType = "patrol" | "recon" | "intercept" | "escort" | "suppression";

export interface OrbitalCost {
  metal: number;
  crystal: number;
  deuterium: number;
  credits: number;
}

export interface OrbitalPlatformClass {
  id: string;
  name: string;
  role: OrbitalRole;
  category: "satellite" | "platform" | "station";
  description: string;
  tier: number;
  maxTier: number;
  maxLevel: number;
  base: {
    hull: number;
    armor: number;
    shield: number;
    power: number;
    heatCapacity: number;
    sensor: number;
    tracking: number;
    evasion: number;
    command: number;
    crew: number;
  };
  slots: Partial<Record<ModuleCategory, number>>;
  defaultModules: string[];
  abilities: string[];
  cost: OrbitalCost;
  requiredTech?: string;
}

export interface OrbitalModule {
  id: string;
  name: string;
  category: ModuleCategory;
  tier: number;
  description: string;
  powerUse: number;
  heat: number;
  cost: OrbitalCost;
  requiredTech?: string;
  weapon?: {
    damage: number;
    damageType: DamageType;
    rateOfFire: number;
    accuracy: number;
    range: number;
    tracking: number;
    shieldPenetration: number;
    armorPenetration: number;
    criticalChance: number;
    ammunition: number;
    preferredTarget: TargetClass;
  };
  defense?: {
    shield: number;
    armor: number;
    hull: number;
    recharge: number;
    pointDefense: number;
    resistances?: Partial<Record<DamageType, number>>;
  };
  support?: {
    power: number;
    heatCapacity: number;
    sensor: number;
    tracking: number;
    evasion: number;
    repair: number;
    command: number;
    dronePower: number;
  };
}

export interface OrbitalAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  trigger: string;
  effect: string;
}

export interface OrbitalTechnology {
  id: string;
  tier: number;
  category: "weapons" | "defense" | "automation" | "sensors" | "logistics" | "command";
  name: string;
  description: string;
  effect: string;
  researchCost: number;
  prerequisites: string[];
}

export interface OrbitalPlatformInstance {
  id: string;
  classId: string;
  name: string;
  level: number;
  tier: number;
  experience: number;
  orbit: string;
  doctrine: OrbitalDoctrine;
  modules: string[];
  hull: number;
  shield: number;
  armor: number;
  integrity: number;
  ammunition: number;
  readiness: number;
  abilityCooldowns: Record<string, number>;
  kills: number;
}

export interface OrbitalResources extends OrbitalCost {
  research: number;
}

export interface OrbitalBattleRound {
  round: number;
  incomingStrength: number;
  damageDealt: number;
  damageTaken: number;
  missilesIntercepted: number;
  abilities: string[];
  log: string[];
}

export interface OrbitalBattleReport {
  id: string;
  cycle: number;
  threatId: string;
  victory: boolean;
  rounds: OrbitalBattleRound[];
  totalDamageDealt: number;
  totalDamageTaken: number;
  destroyedPlatforms: string[];
  damagedPlatforms: string[];
  salvage: OrbitalCost;
  experience: number;
}

export interface OrbitalOrder {
  id: string;
  type: OrbitalOrderType;
  targetId: string;
  progress: number;
  duration: number;
  label: string;
}

export interface OrbitalMission {
  id: string;
  type: OrbitalMissionType;
  platformIds: string[];
  orbitId: string;
  progress: number;
  duration: number;
  risk: number;
  status: "active" | "success" | "failed";
  reward: Partial<OrbitalResources>;
}

export interface OrbitZone {
  id: string;
  name: string;
  description: string;
  capacity: number;
  sensorBonus: number;
  defenseBonus: number;
  damageBonus: number;
  upkeepMultiplier: number;
}

export interface OrbitalDefenseState {
  version: 2;
  cycle: number;
  commandLevel: number;
  doctrine: OrbitalDoctrine;
  resources: OrbitalResources;
  unlockedTech: string[];
  platforms: OrbitalPlatformInstance[];
  inventory: Record<string, number>;
  orders: OrbitalOrder[];
  missions: OrbitalMission[];
  reports: OrbitalBattleReport[];
  alerts: string[];
  lifetime: {
    victories: number;
    defeats: number;
    damageDealt: number;
    damageTaken: number;
    missilesIntercepted: number;
    salvageValue: number;
  };
}

export interface ThreatProfile {
  id: string;
  name: string;
  description: string;
  tier: number;
  strength: number;
  accuracy: number;
  evasion: number;
  shield: number;
  armor: number;
  hull: number;
  missiles: number;
  damageType: DamageType;
  targetClass: TargetClass;
  rounds: number;
}

export interface PlatformStats {
  hull: number;
  armor: number;
  shield: number;
  shieldRecharge: number;
  powerGenerated: number;
  powerUsed: number;
  heatCapacity: number;
  heatGenerated: number;
  sensor: number;
  tracking: number;
  evasion: number;
  command: number;
  pointDefense: number;
  repair: number;
  damagePerRound: number;
  range: number;
  readiness: number;
}

export const ORBITAL_ABILITIES: OrbitalAbility[] = [
  { id: "overcharge", name: "Weapons Overcharge", description: "Push weapons beyond safe output for one decisive volley.", cooldown: 3, trigger: "Enemy capital ship detected", effect: "+45% damage and +35% heat this round." },
  { id: "aegis-pulse", name: "Aegis Pulse", description: "Projects a temporary shield envelope across nearby assets.", cooldown: 4, trigger: "Fleet shield falls below 45%", effect: "Restore 20% fleet shields and reduce incoming damage." },
  { id: "kill-zone", name: "Kill-Zone Prediction", description: "Command AI predicts enemy vectors and synchronizes all batteries.", cooldown: 3, trigger: "Opening combat round", effect: "+18 accuracy and +20 tracking for the fleet." },
  { id: "drone-screen", name: "Drone Interceptor Screen", description: "Launches sacrificial drones against fighters and missiles.", cooldown: 2, trigger: "Missile or fighter swarm detected", effect: "Intercept missiles and reduce swarm damage." },
  { id: "phase-cloak", name: "Phase-Cloak Ambush", description: "Masks emissions until the first firing solution is perfect.", cooldown: 5, trigger: "First round", effect: "+35% first-strike damage and reduced return accuracy." },
  { id: "emergency-repair", name: "Emergency Nanite Repair", description: "Seals hull breaches and restores critical systems.", cooldown: 4, trigger: "Hull falls below 50%", effect: "Restore 16% hull and 10% armor." },
  { id: "retaliation", name: "Retaliation Protocol", description: "Stores shield impacts and releases the energy as a counter-beam.", cooldown: 3, trigger: "Heavy shield damage", effect: "Returns 25% of absorbed shield damage." },
  { id: "orbital-denial", name: "Orbital Denial Salvo", description: "Saturates approach vectors with mines and long-range missiles.", cooldown: 4, trigger: "Enemy enters the defense perimeter", effect: "Deals opening explosive damage and lowers enemy evasion." },
];

export const ORBITAL_MODULES: OrbitalModule[] = [
  { id: "pulse-laser", name: "Pulse Laser Turret", category: "weapon", tier: 1, description: "Efficient rapid-tracking weapon for fighters and light ships.", powerUse: 45, heat: 26, cost: { metal: 500, crystal: 300, deuterium: 80, credits: 900 }, weapon: { damage: 72, damageType: "energy", rateOfFire: 4, accuracy: 92, range: 55, tracking: 36, shieldPenetration: 0.05, armorPenetration: 0.08, criticalChance: 0.05, ammunition: 0, preferredTarget: "fighter" } },
  { id: "rail-battery", name: "Heavy Rail Battery", category: "weapon", tier: 2, description: "Long-range kinetic battery with exceptional armor penetration.", powerUse: 90, heat: 58, cost: { metal: 1600, crystal: 650, deuterium: 180, credits: 2400 }, requiredTech: "orbital-ballistics", weapon: { damage: 260, damageType: "kinetic", rateOfFire: 1, accuracy: 79, range: 92, tracking: 10, shieldPenetration: 0.08, armorPenetration: 0.52, criticalChance: 0.1, ammunition: 80, preferredTarget: "capital" } },
  { id: "missile-cell", name: "Strategic Missile Cell", category: "weapon", tier: 2, description: "Guided multi-role missiles for standoff interception and retaliation.", powerUse: 34, heat: 20, cost: { metal: 1100, crystal: 500, deuterium: 450, credits: 2200 }, requiredTech: "smart-munitions", weapon: { damage: 190, damageType: "explosive", rateOfFire: 2, accuracy: 76, range: 100, tracking: 24, shieldPenetration: 0.18, armorPenetration: 0.3, criticalChance: 0.08, ammunition: 48, preferredTarget: "capital" } },
  { id: "ion-lance", name: "Ion Disruption Lance", category: "weapon", tier: 3, description: "Strips shield harmonics and disables electronic subsystems.", powerUse: 135, heat: 72, cost: { metal: 1900, crystal: 1700, deuterium: 500, credits: 4200 }, requiredTech: "ion-harmonics", weapon: { damage: 230, damageType: "ionic", rateOfFire: 1, accuracy: 86, range: 78, tracking: 18, shieldPenetration: 0.7, armorPenetration: 0.04, criticalChance: 0.07, ammunition: 0, preferredTarget: "structure" } },
  { id: "graviton-spike", name: "Graviton Siege Spike", category: "weapon", tier: 5, description: "Distorts local spacetime to crack fortress hulls.", powerUse: 330, heat: 190, cost: { metal: 12000, crystal: 9000, deuterium: 4200, credits: 18000 }, requiredTech: "graviton-focusing", weapon: { damage: 1100, damageType: "graviton", rateOfFire: 1, accuracy: 66, range: 88, tracking: 4, shieldPenetration: 0.9, armorPenetration: 0.62, criticalChance: 0.12, ammunition: 0, preferredTarget: "structure" } },
  { id: "point-defense", name: "Aegis Point-Defense Grid", category: "weapon", tier: 1, description: "Rapid cannons and interceptors destroy missiles and drones.", powerUse: 55, heat: 30, cost: { metal: 700, crystal: 350, deuterium: 120, credits: 1200 }, weapon: { damage: 40, damageType: "kinetic", rateOfFire: 8, accuracy: 96, range: 24, tracking: 55, shieldPenetration: 0, armorPenetration: 0.04, criticalChance: 0.02, ammunition: 160, preferredTarget: "missile" }, defense: { shield: 0, armor: 0, hull: 0, recharge: 0, pointDefense: 28 } },
  { id: "deflector", name: "Directional Deflector Array", category: "shield", tier: 1, description: "Rotates shield density toward predicted impact vectors.", powerUse: 70, heat: 18, cost: { metal: 650, crystal: 900, deuterium: 140, credits: 1600 }, defense: { shield: 520, armor: 0, hull: 0, recharge: 34, pointDefense: 0, resistances: { energy: 0.18, explosive: 0.08 } } },
  { id: "fortress-shield", name: "Fortress Shield Matrix", category: "shield", tier: 3, description: "Layered high-capacity screen for stations and shield platforms.", powerUse: 210, heat: 55, cost: { metal: 2600, crystal: 3900, deuterium: 800, credits: 6200 }, requiredTech: "layered-shields", defense: { shield: 2400, armor: 0, hull: 0, recharge: 125, pointDefense: 0, resistances: { energy: 0.28, ionic: 0.22, explosive: 0.12 } } },
  { id: "composite-armor", name: "Composite Whipple Armor", category: "armor", tier: 1, description: "Layered physical protection against kinetics and debris.", powerUse: 0, heat: 0, cost: { metal: 1200, crystal: 260, deuterium: 60, credits: 1300 }, defense: { shield: 0, armor: 750, hull: 300, recharge: 0, pointDefense: 0, resistances: { kinetic: 0.2, explosive: 0.12 } } },
  { id: "reactive-armor", name: "Adaptive Reactive Armor", category: "armor", tier: 3, description: "Reconfigures density and sacrificial layers against observed attacks.", powerUse: 35, heat: 12, cost: { metal: 3200, crystal: 1200, deuterium: 500, credits: 4800 }, requiredTech: "adaptive-materials", defense: { shield: 0, armor: 1900, hull: 650, recharge: 0, pointDefense: 0, resistances: { kinetic: 0.28, explosive: 0.3, graviton: 0.1 } } },
  { id: "fusion-reactor", name: "Compact Fusion Reactor", category: "reactor", tier: 1, description: "Reliable power core for satellites and light platforms.", powerUse: 0, heat: -25, cost: { metal: 800, crystal: 500, deuterium: 300, credits: 1500 }, support: { power: 240, heatCapacity: 80, sensor: 0, tracking: 0, evasion: 0, repair: 0, command: 0, dronePower: 0 } },
  { id: "antimatter-reactor", name: "Antimatter Power Core", category: "reactor", tier: 4, description: "Extreme compact output for fortress weapons and shield matrices.", powerUse: 0, heat: -80, cost: { metal: 5000, crystal: 4200, deuterium: 2200, credits: 9200 }, requiredTech: "antimatter-reactors", support: { power: 920, heatCapacity: 260, sensor: 0, tracking: 0, evasion: 0, repair: 0, command: 0, dronePower: 0 } },
  { id: "quantum-radar", name: "Quantum Aperture Radar", category: "sensor", tier: 2, description: "Detects stealth craft, cold missiles, and micro-warp signatures.", powerUse: 65, heat: 20, cost: { metal: 800, crystal: 1500, deuterium: 240, credits: 2900 }, requiredTech: "quantum-sensors", support: { power: 0, heatCapacity: 0, sensor: 48, tracking: 24, evasion: 0, repair: 0, command: 4, dronePower: 0 } },
  { id: "fire-control", name: "Predictive Fire-Control Core", category: "utility", tier: 2, description: "Coordinates target selection, lead solutions, and weapon timing.", powerUse: 45, heat: 18, cost: { metal: 600, crystal: 1200, deuterium: 180, credits: 2500 }, requiredTech: "combat-ai", support: { power: 0, heatCapacity: 0, sensor: 12, tracking: 32, evasion: 0, repair: 0, command: 12, dronePower: 0 } },
  { id: "nanite-repair", name: "Nanite Damage-Control Swarm", category: "utility", tier: 3, description: "Repairs armor and hull during and after combat.", powerUse: 60, heat: 24, cost: { metal: 1300, crystal: 1800, deuterium: 500, credits: 3900 }, requiredTech: "nanite-repair", support: { power: 0, heatCapacity: 0, sensor: 0, tracking: 0, evasion: 0, repair: 95, command: 0, dronePower: 0 } },
  { id: "interceptor-hangar", name: "Interceptor Drone Hangar", category: "hangar", tier: 2, description: "Launches autonomous fighters for patrol and missile interception.", powerUse: 85, heat: 35, cost: { metal: 1800, crystal: 1000, deuterium: 600, credits: 3600 }, requiredTech: "drone-coordination", support: { power: 0, heatCapacity: 0, sensor: 8, tracking: 8, evasion: 0, repair: 0, command: 0, dronePower: 210 }, defense: { shield: 0, armor: 0, hull: 0, recharge: 0, pointDefense: 20 } },
  { id: "stealth-baffling", name: "Emission Baffling Suite", category: "utility", tier: 2, description: "Reduces thermal, radar, and gravitic signatures.", powerUse: 35, heat: 8, cost: { metal: 700, crystal: 1300, deuterium: 350, credits: 2800 }, requiredTech: "stealth-orbits", support: { power: 0, heatCapacity: 30, sensor: 0, tracking: 0, evasion: 18, repair: 0, command: 0, dronePower: 0 } },
];

export const ORBITAL_PLATFORM_CLASSES: OrbitalPlatformClass[] = [
  { id: "watcher-sat", name: "Watcher Defense Satellite", role: "sensor", category: "satellite", description: "Low-cost early-warning satellite with point defense and fire-control support.", tier: 1, maxTier: 3, maxLevel: 20, base: { hull: 520, armor: 180, shield: 220, power: 180, heatCapacity: 150, sensor: 58, tracking: 42, evasion: 24, command: 8, crew: 0 }, slots: { weapon: 1, sensor: 1, reactor: 1, utility: 1 }, defaultModules: ["point-defense", "quantum-radar", "fusion-reactor"], abilities: ["phase-cloak"], cost: { metal: 1800, crystal: 1300, deuterium: 450, credits: 3200 } },
  { id: "lancer-sat", name: "Lancer Strike Satellite", role: "interceptor", category: "satellite", description: "Fast-tracking offensive satellite for anti-fighter and convoy interdiction.", tier: 1, maxTier: 4, maxLevel: 25, base: { hull: 680, armor: 240, shield: 260, power: 220, heatCapacity: 180, sensor: 38, tracking: 52, evasion: 20, command: 4, crew: 0 }, slots: { weapon: 2, shield: 1, reactor: 1, sensor: 1 }, defaultModules: ["pulse-laser", "point-defense", "deflector", "fusion-reactor"], abilities: ["overcharge"], cost: { metal: 2400, crystal: 1600, deuterium: 650, credits: 4200 } },
  { id: "javelin-platform", name: "Javelin Missile Platform", role: "missile", category: "platform", description: "Long-range guided-weapon platform for orbital denial and retaliation.", tier: 2, maxTier: 5, maxLevel: 30, base: { hull: 1500, armor: 620, shield: 480, power: 300, heatCapacity: 260, sensor: 42, tracking: 28, evasion: 8, command: 8, crew: 18 }, slots: { weapon: 3, armor: 1, reactor: 1, sensor: 1, utility: 1 }, defaultModules: ["missile-cell", "missile-cell", "point-defense", "composite-armor", "fusion-reactor"], abilities: ["orbital-denial"], cost: { metal: 5200, crystal: 2600, deuterium: 1700, credits: 8200 }, requiredTech: "smart-munitions" },
  { id: "aegis-platform", name: "Aegis Shield Platform", role: "shield", category: "platform", description: "Defensive anchor that projects shields and interception coverage over nearby assets.", tier: 2, maxTier: 5, maxLevel: 30, base: { hull: 1800, armor: 750, shield: 1600, power: 430, heatCapacity: 360, sensor: 34, tracking: 24, evasion: 4, command: 18, crew: 32 }, slots: { weapon: 2, shield: 3, armor: 1, reactor: 2, utility: 2 }, defaultModules: ["point-defense", "point-defense", "deflector", "deflector", "composite-armor", "fusion-reactor", "fire-control"], abilities: ["aegis-pulse", "emergency-repair"], cost: { metal: 6800, crystal: 5400, deuterium: 1900, credits: 11000 }, requiredTech: "shield-projection" },
  { id: "bastion-platform", name: "Bastion Gun Platform", role: "gunship", category: "platform", description: "Armored heavy-weapon platform built to stop capital ships at range.", tier: 3, maxTier: 6, maxLevel: 35, base: { hull: 3600, armor: 1900, shield: 1100, power: 620, heatCapacity: 520, sensor: 36, tracking: 18, evasion: 2, command: 10, crew: 70 }, slots: { weapon: 4, shield: 2, armor: 2, reactor: 2, sensor: 1, utility: 2 }, defaultModules: ["rail-battery", "rail-battery", "pulse-laser", "point-defense", "deflector", "composite-armor", "fusion-reactor", "fire-control"], abilities: ["overcharge", "retaliation"], cost: { metal: 12000, crystal: 6200, deuterium: 2800, credits: 18500 }, requiredTech: "orbital-ballistics" },
  { id: "raptor-carrier", name: "Raptor Orbital Carrier", role: "carrier", category: "station", description: "Drone and interceptor carrier that establishes persistent orbital patrol zones.", tier: 3, maxTier: 6, maxLevel: 35, base: { hull: 4200, armor: 1500, shield: 1400, power: 720, heatCapacity: 580, sensor: 52, tracking: 30, evasion: 3, command: 24, crew: 110 }, slots: { weapon: 2, shield: 2, armor: 1, reactor: 2, sensor: 1, utility: 2, hangar: 4 }, defaultModules: ["pulse-laser", "point-defense", "deflector", "composite-armor", "fusion-reactor", "quantum-radar", "interceptor-hangar", "interceptor-hangar"], abilities: ["drone-screen", "kill-zone"], cost: { metal: 15000, crystal: 8500, deuterium: 5200, credits: 24000 }, requiredTech: "drone-coordination" },
  { id: "nexus-command", name: "Nexus Command Platform", role: "command", category: "station", description: "Battle-management station that synchronizes sensors, shields, and firing solutions.", tier: 4, maxTier: 7, maxLevel: 40, base: { hull: 5200, armor: 2100, shield: 2500, power: 920, heatCapacity: 720, sensor: 82, tracking: 48, evasion: 2, command: 70, crew: 180 }, slots: { weapon: 3, shield: 3, armor: 2, reactor: 2, sensor: 3, utility: 4, hangar: 2 }, defaultModules: ["ion-lance", "pulse-laser", "point-defense", "fortress-shield", "composite-armor", "antimatter-reactor", "quantum-radar", "fire-control", "nanite-repair"], abilities: ["kill-zone", "aegis-pulse", "emergency-repair"], cost: { metal: 24000, crystal: 18000, deuterium: 7800, credits: 42000 }, requiredTech: "battle-network" },
  { id: "citadel-fortress", name: "Citadel Orbital Fortress", role: "fortress", category: "station", description: "A strategic orbital fortress combining siege weapons, layered shields, repair systems, and command AI.", tier: 5, maxTier: 8, maxLevel: 50, base: { hull: 12000, armor: 6800, shield: 6200, power: 1800, heatCapacity: 1450, sensor: 70, tracking: 36, evasion: 0, command: 85, crew: 520 }, slots: { weapon: 8, shield: 5, armor: 4, reactor: 3, sensor: 2, utility: 5, hangar: 3 }, defaultModules: ["graviton-spike", "rail-battery", "rail-battery", "missile-cell", "ion-lance", "point-defense", "point-defense", "fortress-shield", "fortress-shield", "reactive-armor", "antimatter-reactor", "quantum-radar", "fire-control", "nanite-repair", "interceptor-hangar"], abilities: ["orbital-denial", "aegis-pulse", "retaliation", "emergency-repair"], cost: { metal: 62000, crystal: 44000, deuterium: 22000, credits: 110000 }, requiredTech: "fortress-engineering" },
];

export const ORBITAL_TECHNOLOGIES: OrbitalTechnology[] = [
  { id: "orbital-ballistics", tier: 1, category: "weapons", name: "Orbital Ballistics", description: "Compensates for orbital velocity, gravity, and long-range target motion.", effect: "Unlocks rail batteries and Bastion platforms.", researchCost: 1200, prerequisites: [] },
  { id: "smart-munitions", tier: 1, category: "weapons", name: "Smart Munitions", description: "Networked seekers coordinate salvo timing and target selection.", effect: "Unlocks missile cells and Javelin platforms.", researchCost: 1300, prerequisites: [] },
  { id: "shield-projection", tier: 1, category: "defense", name: "Shield Projection", description: "Extends shield envelopes beyond a single structure.", effect: "Unlocks Aegis platforms and fleet shield abilities.", researchCost: 1450, prerequisites: [] },
  { id: "quantum-sensors", tier: 2, category: "sensors", name: "Quantum Sensor Apertures", description: "Detects stealth, cold missiles, and subspace disturbances.", effect: "+10 fleet detection; unlocks quantum radar.", researchCost: 2200, prerequisites: [] },
  { id: "combat-ai", tier: 2, category: "automation", name: "Predictive Combat AI", description: "Optimizes target priority and coordinated firing windows.", effect: "+8 fleet accuracy; unlocks fire-control cores.", researchCost: 2600, prerequisites: ["quantum-sensors"] },
  { id: "drone-coordination", tier: 2, category: "automation", name: "Drone Coordination Mesh", description: "Coordinates autonomous patrol and interception wings.", effect: "Unlocks hangars and Raptor carriers.", researchCost: 2800, prerequisites: ["combat-ai"] },
  { id: "layered-shields", tier: 3, category: "defense", name: "Layered Shield Harmonics", description: "Overlapping shield frequencies resist saturation attacks.", effect: "Unlocks fortress shields and improves recharge.", researchCost: 4200, prerequisites: ["shield-projection"] },
  { id: "adaptive-materials", tier: 3, category: "defense", name: "Adaptive Armor Materials", description: "Armor changes density and composition against observed threats.", effect: "Unlocks reactive armor; +8% armor mitigation.", researchCost: 4400, prerequisites: ["orbital-ballistics"] },
  { id: "ion-harmonics", tier: 3, category: "weapons", name: "Ion Harmonic Weapons", description: "Tunes ionic beams to collapse enemy shield frequencies.", effect: "Unlocks ion lances.", researchCost: 4600, prerequisites: ["shield-projection", "combat-ai"] },
  { id: "nanite-repair", tier: 3, category: "logistics", name: "Orbital Nanite Repair", description: "Autonomous damage control repairs structures during battle.", effect: "Unlocks repair swarms and improves post-battle recovery.", researchCost: 4800, prerequisites: ["combat-ai"] },
  { id: "stealth-orbits", tier: 3, category: "sensors", name: "Stealth Orbit Engineering", description: "Uses low-observable orbits and emission control for ambush platforms.", effect: "Unlocks emission baffling and Hunter doctrine bonuses.", researchCost: 5000, prerequisites: ["quantum-sensors"] },
  { id: "battle-network", tier: 4, category: "command", name: "Orbital Battle Network", description: "Links every platform into one resilient combat intelligence.", effect: "Unlocks Nexus command platforms and command-level bonuses.", researchCost: 7600, prerequisites: ["combat-ai", "layered-shields", "drone-coordination"] },
  { id: "antimatter-reactors", tier: 4, category: "logistics", name: "Antimatter Reactors", description: "Provides fortress-grade power density for advanced weapons.", effect: "Unlocks antimatter cores and raises power budget.", researchCost: 8200, prerequisites: ["battle-network"] },
  { id: "fortress-engineering", tier: 5, category: "defense", name: "Orbital Fortress Engineering", description: "Integrates siege weapons, layered defense, repair, and logistics.", effect: "Unlocks Citadel fortresses.", researchCost: 12500, prerequisites: ["antimatter-reactors", "nanite-repair", "adaptive-materials"] },
  { id: "graviton-focusing", tier: 5, category: "weapons", name: "Graviton Focusing", description: "Stabilizes weaponized spacetime gradients.", effect: "Unlocks graviton siege spikes.", researchCost: 14000, prerequisites: ["antimatter-reactors", "ion-harmonics"] },
];

export const THREAT_PROFILES: ThreatProfile[] = [
  { id: "pirate-swarm", name: "Pirate Fighter Swarm", description: "Numerous agile raiders using missiles and close-range lasers.", tier: 1, strength: 1450, accuracy: 72, evasion: 28, shield: 800, armor: 500, hull: 1800, missiles: 24, damageType: "explosive", targetClass: "fighter", rounds: 5 },
  { id: "stealth-raid", name: "Stealth Corvette Raid", description: "Low-signature strike craft attempt to blind sensors and destroy command assets.", tier: 2, strength: 2600, accuracy: 80, evasion: 36, shield: 1700, armor: 1200, hull: 2800, missiles: 18, damageType: "energy", targetClass: "stealth", rounds: 6 },
  { id: "capital-assault", name: "Capital Assault Group", description: "Cruisers and battleships conduct a direct orbital breakthrough.", tier: 3, strength: 5200, accuracy: 84, evasion: 10, shield: 4200, armor: 5200, hull: 7800, missiles: 36, damageType: "kinetic", targetClass: "capital", rounds: 7 },
  { id: "siege-taskforce", name: "Planetary Siege Taskforce", description: "Heavy siege vessels, electronic warfare, and saturation missile waves.", tier: 4, strength: 8800, accuracy: 87, evasion: 8, shield: 7600, armor: 9000, hull: 14000, missiles: 80, damageType: "ionic", targetClass: "structure", rounds: 8 },
  { id: "dreadnought", name: "Dreadnought Incursion", description: "A fortress-breaking dreadnought attacks with gravitic siege weapons.", tier: 5, strength: 14500, accuracy: 90, evasion: 3, shield: 13000, armor: 17000, hull: 26000, missiles: 48, damageType: "graviton", targetClass: "capital", rounds: 10 },
];

export const ORBITAL_DOCTRINES: Record<OrbitalDoctrine, { label: string; description: string; bonuses: string; accuracy: number; defense: number; damage: number; interception: number }> = {
  sentinel: { label: "Sentinel Network", description: "Balanced detection, interception, and sustained readiness.", bonuses: "+8 detection, +8 tracking", accuracy: 6, defense: 6, damage: 0, interception: 8 },
  bastion: { label: "Bastion Doctrine", description: "Prioritizes layered shields, armor, and survival.", bonuses: "+18% defense, -8% damage", accuracy: 0, defense: 18, damage: -8, interception: 6 },
  hunter: { label: "Hunter-Killer Doctrine", description: "Ambushes high-value targets with precision alpha strikes.", bonuses: "+16% damage, +10 accuracy", accuracy: 10, defense: -6, damage: 16, interception: 0 },
  interdiction: { label: "Orbital Interdiction", description: "Maximizes missile defense, fighter suppression, and zone denial.", bonuses: "+22 interception, +6 tracking", accuracy: 4, defense: 4, damage: 4, interception: 22 },
  retaliation: { label: "Retaliation Protocol", description: "Absorbs the opening attack before delivering a punishing counterstrike.", bonuses: "+12% defense, +12% counter damage", accuracy: 0, defense: 12, damage: 12, interception: 4 },
};

export const ORBIT_ZONES: OrbitZone[] = [
  { id: "low-orbit", name: "Low Defense Orbit", description: "Fast response over population and industrial centers.", capacity: 5, sensorBonus: 4, defenseBonus: 8, damageBonus: 0, upkeepMultiplier: 1.08 },
  { id: "geostationary", name: "Geostationary Shield Ring", description: "Stable anchor for shield platforms and command stations.", capacity: 6, sensorBonus: 8, defenseBonus: 12, damageBonus: 0, upkeepMultiplier: 1 },
  { id: "polar", name: "High Polar Watch", description: "Wide sensor coverage and repeated passes over every hemisphere.", capacity: 4, sensorBonus: 18, defenseBonus: 0, damageBonus: 2, upkeepMultiplier: 1.04 },
  { id: "lunar-lagrange", name: "Lunar Lagrange Bastion", description: "Protected logistics and heavy-weapons anchorage.", capacity: 8, sensorBonus: 5, defenseBonus: 6, damageBonus: 10, upkeepMultiplier: 0.95 },
  { id: "outer-intercept", name: "Outer Interception Shell", description: "Long-range engagement zone for missiles, carriers, and ambush satellites.", capacity: 7, sensorBonus: 12, defenseBonus: -4, damageBonus: 14, upkeepMultiplier: 1.16 },
];

export const ORBITAL_MISSIONS: Record<OrbitalMissionType, { label: string; duration: number; risk: number; description: string; reward: Partial<OrbitalResources> }> = {
  patrol: { label: "Orbital Patrol", duration: 2, risk: 8, description: "Maintain local security and suppress minor raiders.", reward: { credits: 2600, research: 240 } },
  recon: { label: "Deep-Space Recon", duration: 3, risk: 18, description: "Search approach corridors for stealth fleets and anomalies.", reward: { credits: 3400, research: 720, crystal: 500 } },
  intercept: { label: "Raid Interception", duration: 3, risk: 28, description: "Engage hostile scouts before they reach planetary orbit.", reward: { credits: 5200, research: 500, metal: 1100 } },
  escort: { label: "Convoy Escort", duration: 2, risk: 14, description: "Protect civilian and military logistics traffic.", reward: { credits: 4600, deuterium: 650 } },
  suppression: { label: "Pirate Suppression", duration: 4, risk: 38, description: "Strike hostile staging zones and missile caches.", reward: { credits: 7800, research: 900, metal: 1600, crystal: 900 } },
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function seeded(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function calculatePlatformStats(platform: OrbitalPlatformInstance, state: OrbitalDefenseState): PlatformStats {
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId);
  if (!hullClass) throw new Error(`Unknown orbital platform class: ${platform.classId}`);
  const modules = platform.modules.map((id) => ORBITAL_MODULES.find((module) => module.id === id)).filter((module): module is OrbitalModule => Boolean(module));
  const levelScale = 1 + (platform.level - 1) * 0.055;
  const tierScale = 1 + (platform.tier - hullClass.tier) * 0.18;
  const scale = levelScale * tierScale;
  let hull = hullClass.base.hull * scale;
  let armor = hullClass.base.armor * scale;
  let shield = hullClass.base.shield * scale;
  let powerGenerated = hullClass.base.power * scale;
  let powerUsed = 0;
  let heatCapacity = hullClass.base.heatCapacity * scale;
  let heatGenerated = 0;
  let sensor = hullClass.base.sensor;
  let tracking = hullClass.base.tracking;
  let evasion = hullClass.base.evasion;
  let command = hullClass.base.command;
  let pointDefense = 0;
  let repair = 0;
  let damagePerRound = 0;
  let range = 0;
  let shieldRecharge = 0;

  modules.forEach((module) => {
    powerUsed += module.powerUse;
    heatGenerated += module.heat;
    if (module.weapon) {
      damagePerRound += module.weapon.damage * module.weapon.rateOfFire * (module.weapon.accuracy / 100);
      range = Math.max(range, module.weapon.range);
    }
    if (module.defense) {
      hull += module.defense.hull;
      armor += module.defense.armor;
      shield += module.defense.shield;
      shieldRecharge += module.defense.recharge;
      pointDefense += module.defense.pointDefense;
    }
    if (module.support) {
      powerGenerated += module.support.power;
      heatCapacity += module.support.heatCapacity;
      sensor += module.support.sensor;
      tracking += module.support.tracking;
      evasion += module.support.evasion;
      repair += module.support.repair;
      command += module.support.command;
      damagePerRound += module.support.dronePower;
    }
  });

  const powerRatio = powerUsed > powerGenerated ? powerGenerated / powerUsed : 1;
  const heatRatio = heatGenerated > heatCapacity ? heatCapacity / heatGenerated : 1;
  const techAccuracy = state.unlockedTech.includes("combat-ai") ? 8 : 0;
  const techDefense = state.unlockedTech.includes("adaptive-materials") ? 1.08 : 1;
  const doctrine = ORBITAL_DOCTRINES[platform.doctrine];
  const orbit = ORBIT_ZONES.find((entry) => entry.name === platform.orbit || entry.id === platform.orbit);
  damagePerRound *= powerRatio * heatRatio * (1 + doctrine.damage / 100) * (1 + (orbit?.damageBonus ?? 0) / 100);
  shield *= techDefense * (1 + doctrine.defense / 100) * (1 + (orbit?.defenseBonus ?? 0) / 100);
  armor *= techDefense * (1 + doctrine.defense / 100) * (1 + (orbit?.defenseBonus ?? 0) / 100);

  return {
    hull: Math.round(hull),
    armor: Math.round(armor),
    shield: Math.round(shield),
    shieldRecharge: Math.round(shieldRecharge),
    powerGenerated: Math.round(powerGenerated),
    powerUsed: Math.round(powerUsed),
    heatCapacity: Math.round(heatCapacity),
    heatGenerated: Math.round(heatGenerated),
    sensor: Math.round(sensor + techAccuracy + (orbit?.sensorBonus ?? 0)),
    tracking: Math.round(tracking + doctrine.accuracy),
    evasion: Math.round(evasion),
    command: Math.round(command),
    pointDefense: Math.round(pointDefense + doctrine.interception),
    repair: Math.round(repair),
    damagePerRound: Math.round(damagePerRound),
    range: Math.round(range),
    readiness: Math.round(clamp(platform.readiness * powerRatio * heatRatio * (platform.integrity / 100))),
  };
}

export function createOrbitalDefenseState(): OrbitalDefenseState {
  const classes = ["watcher-sat", "lancer-sat", "aegis-platform"];
  const state: OrbitalDefenseState = {
    version: 2,
    cycle: 1,
    commandLevel: 1,
    doctrine: "sentinel",
    resources: { metal: 52000, crystal: 38000, deuterium: 22000, credits: 140000, research: 16000 },
    unlockedTech: ["orbital-ballistics", "smart-munitions", "shield-projection", "quantum-sensors"],
    platforms: classes.map((classId, index) => {
      const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === classId)!;
      return {
        id: `${classId}-${index + 1}`,
        classId,
        name: index === 0 ? "Argus Watch" : index === 1 ? "Vigilant Spear" : "Aurelia Aegis",
        level: index === 2 ? 3 : 2,
        tier: hullClass.tier,
        experience: 0,
        orbit: index === 0 ? "polar" : index === 1 ? "low-orbit" : "geostationary",
        doctrine: index === 2 ? "bastion" : "sentinel",
        modules: [...hullClass.defaultModules],
        hull: hullClass.base.hull,
        shield: hullClass.base.shield,
        armor: hullClass.base.armor,
        integrity: 100,
        ammunition: 100,
        readiness: 94,
        abilityCooldowns: {},
        kills: 0,
      };
    }),
    inventory: {},
    orders: [],
    missions: [],
    reports: [],
    alerts: ["Orbital defense network synchronized.", "Three platforms report combat readiness."],
    lifetime: { victories: 0, defeats: 0, damageDealt: 0, damageTaken: 0, missilesIntercepted: 0, salvageValue: 0 },
  };
  return refreshPlatformPools(state);
}

export function hydrateOrbitalDefenseState(raw: unknown): OrbitalDefenseState {
  if (!raw || typeof raw !== "object") return createOrbitalDefenseState();
  const state = raw as Partial<OrbitalDefenseState>;
  if (![1, 2].includes(state.version ?? 0) || !Array.isArray(state.platforms)) return createOrbitalDefenseState();
  const fallback = createOrbitalDefenseState();
  return refreshPlatformPools({
    ...fallback,
    ...state,
    version: 2,
    resources: { ...fallback.resources, ...state.resources },
    unlockedTech: state.unlockedTech ?? fallback.unlockedTech,
    inventory: state.inventory ?? {},
    orders: state.orders ?? [],
    missions: state.missions ?? [],
    reports: state.reports ?? [],
    alerts: state.alerts ?? fallback.alerts,
    lifetime: { ...fallback.lifetime, ...state.lifetime },
  });
}

function refreshPlatformPools(state: OrbitalDefenseState): OrbitalDefenseState {
  return {
    ...state,
    platforms: state.platforms.map((platform) => {
      const stats = calculatePlatformStats(platform, state);
      return {
        ...platform,
        hull: Math.min(platform.hull || stats.hull, stats.hull),
        armor: Math.min(platform.armor || stats.armor, stats.armor),
        shield: Math.min(platform.shield || stats.shield, stats.shield),
      };
    }),
  };
}

function canPay(resources: OrbitalResources, cost: OrbitalCost) {
  return resources.metal >= cost.metal && resources.crystal >= cost.crystal && resources.deuterium >= cost.deuterium && resources.credits >= cost.credits;
}

function pay(resources: OrbitalResources, cost: OrbitalCost): OrbitalResources {
  return {
    ...resources,
    metal: resources.metal - cost.metal,
    crystal: resources.crystal - cost.crystal,
    deuterium: resources.deuterium - cost.deuterium,
    credits: resources.credits - cost.credits,
  };
}

export function constructOrbitalPlatform(state: OrbitalDefenseState, classId: string): OrbitalDefenseState {
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === classId);
  if (!hullClass || !canPay(state.resources, hullClass.cost)) return state;
  if (hullClass.requiredTech && !state.unlockedTech.includes(hullClass.requiredTech)) return state;
  const instance: OrbitalPlatformInstance = {
    id: `${classId}-${state.cycle}-${state.platforms.length + 1}`,
    classId,
    name: `${hullClass.name} ${state.platforms.length + 1}`,
    level: 1,
    tier: hullClass.tier,
    experience: 0,
    orbit: "Unassigned defense orbit",
    doctrine: state.doctrine,
    modules: [...hullClass.defaultModules],
    hull: hullClass.base.hull,
    shield: hullClass.base.shield,
    armor: hullClass.base.armor,
    integrity: 100,
    ammunition: 100,
    readiness: 90,
    abilityCooldowns: {},
    kills: 0,
  };
  return refreshPlatformPools({
    ...state,
    cycle: state.cycle + 1,
    resources: pay(state.resources, hullClass.cost),
    platforms: [...state.platforms, instance],
    alerts: [`${instance.name} entered orbital service.`, ...state.alerts].slice(0, 20),
  });
}

export function upgradeOrbitalPlatform(state: OrbitalDefenseState, platformId: string): OrbitalDefenseState {
  const platform = state.platforms.find((entry) => entry.id === platformId);
  if (!platform) return state;
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
  if (platform.level >= hullClass.maxLevel) return state;
  const multiplier = Math.pow(1.13, platform.level - 1) * (1 + (platform.tier - hullClass.tier) * 0.35);
  const cost = {
    metal: Math.round(hullClass.cost.metal * 0.22 * multiplier),
    crystal: Math.round(hullClass.cost.crystal * 0.22 * multiplier),
    deuterium: Math.round(hullClass.cost.deuterium * 0.2 * multiplier),
    credits: Math.round(hullClass.cost.credits * 0.18 * multiplier),
  };
  if (!canPay(state.resources, cost)) return state;
  let tier = platform.tier;
  if ((platform.level + 1) % 10 === 0 && tier < hullClass.maxTier) tier += 1;
  const next = {
    ...state,
    cycle: state.cycle + 1,
    resources: pay(state.resources, cost),
    platforms: state.platforms.map((entry) => entry.id === platformId ? { ...entry, level: entry.level + 1, tier, readiness: clamp(entry.readiness + 5), integrity: clamp(entry.integrity + 4) } : entry),
    alerts: [`${platform.name} upgraded to level ${platform.level + 1}${tier > platform.tier ? ` and Tier ${tier}` : ""}.`, ...state.alerts].slice(0, 20),
  };
  return refreshPlatformPools(next);
}

export function repairOrbitalPlatform(state: OrbitalDefenseState, platformId: string): OrbitalDefenseState {
  const platform = state.platforms.find((entry) => entry.id === platformId);
  if (!platform) return state;
  const stats = calculatePlatformStats(platform, state);
  const damageRatio = 1 - ((platform.hull + platform.armor + platform.shield) / Math.max(1, stats.hull + stats.armor + stats.shield));
  const cost = { metal: Math.ceil(1600 * damageRatio), crystal: Math.ceil(900 * damageRatio), deuterium: Math.ceil(500 * damageRatio), credits: Math.ceil(3000 * damageRatio) };
  if (!canPay(state.resources, cost)) return state;
  return {
    ...state,
    cycle: state.cycle + 1,
    resources: pay(state.resources, cost),
    platforms: state.platforms.map((entry) => entry.id === platformId ? { ...entry, hull: stats.hull, armor: stats.armor, shield: stats.shield, integrity: 100, ammunition: 100, readiness: 100 } : entry),
    alerts: [`${platform.name} completed full repair, reload, and readiness certification.`, ...state.alerts].slice(0, 20),
  };
}

export function setOrbitalDoctrine(state: OrbitalDefenseState, doctrine: OrbitalDoctrine): OrbitalDefenseState {
  return {
    ...state,
    doctrine,
    platforms: state.platforms.map((platform) => ({ ...platform, doctrine })),
    alerts: [`${ORBITAL_DOCTRINES[doctrine].label} propagated to all orbital assets.`, ...state.alerts].slice(0, 20),
  };
}

export function researchOrbitalTechnology(state: OrbitalDefenseState, techId: string): OrbitalDefenseState {
  const technology = ORBITAL_TECHNOLOGIES.find((entry) => entry.id === techId);
  if (!technology || state.unlockedTech.includes(techId)) return state;
  if (!technology.prerequisites.every((id) => state.unlockedTech.includes(id)) || state.resources.research < technology.researchCost) return state;
  return {
    ...state,
    cycle: state.cycle + 1,
    commandLevel: state.commandLevel + (technology.category === "command" ? 1 : 0),
    resources: { ...state.resources, research: state.resources.research - technology.researchCost },
    unlockedTech: [...state.unlockedTech, techId],
    alerts: [`Research completed: ${technology.name}. ${technology.effect}`, ...state.alerts].slice(0, 20),
  };
}

export function installOrbitalModule(state: OrbitalDefenseState, platformId: string, moduleId: string): OrbitalDefenseState {
  const platform = state.platforms.find((entry) => entry.id === platformId);
  const module = ORBITAL_MODULES.find((entry) => entry.id === moduleId);
  if (!platform || !module || !canPay(state.resources, module.cost)) return state;
  if (module.requiredTech && !state.unlockedTech.includes(module.requiredTech)) return state;
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
  const used = platform.modules.filter((id) => ORBITAL_MODULES.find((entry) => entry.id === id)?.category === module.category).length;
  const capacity = hullClass.slots[module.category] ?? 0;
  if (used >= capacity) return state;
  return refreshPlatformPools({
    ...state,
    resources: pay(state.resources, module.cost),
    platforms: state.platforms.map((entry) => entry.id === platformId ? { ...entry, modules: [...entry.modules, moduleId] } : entry),
    alerts: [`${module.name} installed on ${platform.name}.`, ...state.alerts].slice(0, 20),
  });
}

export function removeOrbitalModule(state: OrbitalDefenseState, platformId: string, moduleIndex: number): OrbitalDefenseState {
  const platform = state.platforms.find((entry) => entry.id === platformId);
  const moduleId = platform?.modules[moduleIndex];
  if (!platform || !moduleId) return state;
  const modules = platform.modules.filter((_, index) => index !== moduleIndex);
  return refreshPlatformPools({
    ...state,
    inventory: { ...state.inventory, [moduleId]: (state.inventory[moduleId] ?? 0) + 1 },
    platforms: state.platforms.map((entry) => entry.id === platformId ? { ...entry, modules } : entry),
    alerts: [`${ORBITAL_MODULES.find((entry) => entry.id === moduleId)?.name ?? moduleId} removed from ${platform.name} and stored.`, ...state.alerts].slice(0, 20),
  });
}

export function installInventoryModule(state: OrbitalDefenseState, platformId: string, moduleId: string): OrbitalDefenseState {
  if ((state.inventory[moduleId] ?? 0) < 1) return state;
  const installed = installOrbitalModule({
    ...state,
    resources: {
      ...state.resources,
      metal: state.resources.metal + (ORBITAL_MODULES.find((entry) => entry.id === moduleId)?.cost.metal ?? 0),
      crystal: state.resources.crystal + (ORBITAL_MODULES.find((entry) => entry.id === moduleId)?.cost.crystal ?? 0),
      deuterium: state.resources.deuterium + (ORBITAL_MODULES.find((entry) => entry.id === moduleId)?.cost.deuterium ?? 0),
      credits: state.resources.credits + (ORBITAL_MODULES.find((entry) => entry.id === moduleId)?.cost.credits ?? 0),
    },
  }, platformId, moduleId);
  if (installed === state || !installed.platforms.find((entry) => entry.id === platformId)?.modules.includes(moduleId)) return state;
  return { ...installed, inventory: { ...installed.inventory, [moduleId]: installed.inventory[moduleId] - 1 } };
}

export function renameOrbitalPlatform(state: OrbitalDefenseState, platformId: string, name: string): OrbitalDefenseState {
  const cleanName = name.trim().slice(0, 48);
  if (!cleanName) return state;
  return {
    ...state,
    platforms: state.platforms.map((platform) => platform.id === platformId ? { ...platform, name: cleanName } : platform),
    alerts: [`Platform designation changed to ${cleanName}.`, ...state.alerts].slice(0, 20),
  };
}

export function assignOrbitalZone(state: OrbitalDefenseState, platformId: string, orbitId: string): OrbitalDefenseState {
  const zone = ORBIT_ZONES.find((entry) => entry.id === orbitId);
  if (!zone) return state;
  const occupied = state.platforms.filter((platform) => platform.orbit === orbitId && platform.id !== platformId).length;
  if (occupied >= zone.capacity) return state;
  return refreshPlatformPools({
    ...state,
    platforms: state.platforms.map((platform) => platform.id === platformId ? { ...platform, orbit: orbitId, readiness: clamp(platform.readiness - 3) } : platform),
    alerts: [`${state.platforms.find((platform) => platform.id === platformId)?.name ?? "Platform"} reassigned to ${zone.name}.`, ...state.alerts].slice(0, 20),
  });
}

export function setPlatformDoctrine(state: OrbitalDefenseState, platformId: string, doctrine: OrbitalDoctrine): OrbitalDefenseState {
  return refreshPlatformPools({
    ...state,
    platforms: state.platforms.map((platform) => platform.id === platformId ? { ...platform, doctrine } : platform),
  });
}

export function decommissionOrbitalPlatform(state: OrbitalDefenseState, platformId: string): OrbitalDefenseState {
  const platform = state.platforms.find((entry) => entry.id === platformId);
  if (!platform || state.platforms.length <= 1) return state;
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
  const inventory = { ...state.inventory };
  platform.modules.forEach((moduleId) => { inventory[moduleId] = (inventory[moduleId] ?? 0) + 1; });
  return {
    ...state,
    inventory,
    resources: {
      ...state.resources,
      metal: state.resources.metal + Math.round(hullClass.cost.metal * 0.38),
      crystal: state.resources.crystal + Math.round(hullClass.cost.crystal * 0.28),
      deuterium: state.resources.deuterium + Math.round(hullClass.cost.deuterium * 0.18),
      credits: state.resources.credits + Math.round(hullClass.cost.credits * 0.16),
    },
    platforms: state.platforms.filter((entry) => entry.id !== platformId),
    alerts: [`${platform.name} decommissioned; modules recovered to inventory.`, ...state.alerts].slice(0, 20),
  };
}

export function queueOrbitalOrder(state: OrbitalDefenseState, type: OrbitalOrderType, targetId: string): OrbitalDefenseState {
  if (state.orders.some((order) => order.targetId === targetId && order.type === type)) return state;
  if (type === "construct") {
    const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === targetId);
    if (!hullClass || !canPay(state.resources, hullClass.cost) || (hullClass.requiredTech && !state.unlockedTech.includes(hullClass.requiredTech))) return state;
    return {
      ...state,
      resources: pay(state.resources, hullClass.cost),
      orders: [...state.orders, { id: `construct-${targetId}-${state.cycle}`, type, targetId, progress: 0, duration: Math.max(2, hullClass.tier + 1), label: `Construct ${hullClass.name}` }],
      alerts: [`${hullClass.name} added to the orbital construction queue.`, ...state.alerts].slice(0, 20),
    };
  }
  const platform = state.platforms.find((entry) => entry.id === targetId);
  if (!platform) return state;
  const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
  const cost = type === "resupply"
    ? { metal: 180, crystal: 80, deuterium: 650, credits: 1200 }
    : type === "repair"
      ? { metal: 900, crystal: 450, deuterium: 240, credits: 1800 }
      : { metal: Math.round(hullClass.cost.metal * 0.2), crystal: Math.round(hullClass.cost.crystal * 0.2), deuterium: Math.round(hullClass.cost.deuterium * 0.18), credits: Math.round(hullClass.cost.credits * 0.16) };
  if (!canPay(state.resources, cost)) return state;
  return {
    ...state,
    resources: pay(state.resources, cost),
    orders: [...state.orders, { id: `${type}-${targetId}-${state.cycle}`, type, targetId, progress: 0, duration: type === "resupply" ? 1 : type === "repair" ? 2 : 3, label: `${type[0].toUpperCase()}${type.slice(1)} ${platform.name}` }],
    alerts: [`${platform.name}: ${type} order queued.`, ...state.alerts].slice(0, 20),
  };
}

export function launchOrbitalMission(state: OrbitalDefenseState, type: OrbitalMissionType, platformIds: string[], orbitId: string): OrbitalDefenseState {
  const definition = ORBITAL_MISSIONS[type];
  const validIds = platformIds.filter((id) => state.platforms.some((platform) => platform.id === id));
  if (!definition || validIds.length === 0 || !ORBIT_ZONES.some((zone) => zone.id === orbitId)) return state;
  if (state.missions.some((mission) => mission.status === "active" && mission.platformIds.some((id) => validIds.includes(id)))) return state;
  return {
    ...state,
    missions: [...state.missions, {
      id: `${type}-${state.cycle}-${state.missions.length}`,
      type,
      platformIds: validIds,
      orbitId,
      progress: 0,
      duration: definition.duration,
      risk: definition.risk,
      status: "active",
      reward: definition.reward,
    }],
    platforms: state.platforms.map((platform) => validIds.includes(platform.id) ? { ...platform, readiness: clamp(platform.readiness - 4) } : platform),
    alerts: [`${definition.label} launched with ${validIds.length} platform${validIds.length === 1 ? "" : "s"}.`, ...state.alerts].slice(0, 20),
  };
}

export function advanceOrbitalCycle(state: OrbitalDefenseState): OrbitalDefenseState {
  let next = { ...state, cycle: state.cycle + 1 };
  const completedOrders = next.orders.filter((order) => order.progress + 1 >= order.duration);
  next.orders = next.orders.map((order) => ({ ...order, progress: order.progress + 1 })).filter((order) => order.progress < order.duration);
  completedOrders.forEach((order) => {
    if (order.type === "construct") {
      const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === order.targetId);
      if (hullClass) {
        const instance: OrbitalPlatformInstance = {
          id: `${hullClass.id}-${next.cycle}-${next.platforms.length + 1}`, classId: hullClass.id, name: `${hullClass.name} ${next.platforms.length + 1}`,
          level: 1, tier: hullClass.tier, experience: 0, orbit: "low-orbit", doctrine: next.doctrine, modules: [...hullClass.defaultModules],
          hull: hullClass.base.hull, shield: hullClass.base.shield, armor: hullClass.base.armor, integrity: 100, ammunition: 100, readiness: 88, abilityCooldowns: {}, kills: 0,
        };
        next.platforms = [...next.platforms, instance];
        next.alerts = [`${instance.name} completed construction and entered service.`, ...next.alerts].slice(0, 20);
      }
    } else {
      const platform = next.platforms.find((entry) => entry.id === order.targetId);
      if (!platform) return;
      if (order.type === "upgrade") {
        const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
        const level = Math.min(hullClass.maxLevel, platform.level + 1);
        const tier = level % 10 === 0 ? Math.min(hullClass.maxTier, platform.tier + 1) : platform.tier;
        next.platforms = next.platforms.map((entry) => entry.id === platform.id ? { ...entry, level, tier, readiness: clamp(entry.readiness + 5), integrity: clamp(entry.integrity + 4) } : entry);
      }
      if (order.type === "repair") next.platforms = next.platforms.map((entry) => entry.id === platform.id ? { ...entry, integrity: 100, readiness: 100 } : entry);
      if (order.type === "resupply") next.platforms = next.platforms.map((entry) => entry.id === platform.id ? { ...entry, ammunition: 100, readiness: clamp(entry.readiness + 12) } : entry);
      next.alerts = [`Order completed: ${order.label}.`, ...next.alerts].slice(0, 20);
    }
  });

  next.missions = next.missions.map((mission) => {
    if (mission.status !== "active") return mission;
    const progress = mission.progress + 1;
    if (progress < mission.duration) return { ...mission, progress };
    const missionPower = mission.platformIds.reduce((sum, id) => {
      const platform = next.platforms.find((entry) => entry.id === id);
      return sum + (platform ? calculatePlatformStats(platform, next).damagePerRound + calculatePlatformStats(platform, next).sensor * 5 : 0);
    }, 0);
    const successChance = clamp(55 + missionPower / 300 - mission.risk, 20, 96);
    const success = seeded(next.cycle * 41 + mission.id.length) * 100 < successChance;
    if (success) {
      next.resources = Object.entries(mission.reward).reduce((resources, [key, value]) => ({ ...resources, [key]: resources[key as keyof OrbitalResources] + (value ?? 0) }), next.resources);
      next.alerts = [`${ORBITAL_MISSIONS[mission.type].label} succeeded. Rewards transferred.`, ...next.alerts].slice(0, 20);
    } else {
      next.platforms = next.platforms.map((platform) => mission.platformIds.includes(platform.id) ? { ...platform, integrity: clamp(platform.integrity - 8), readiness: clamp(platform.readiness - 14) } : platform);
      next.alerts = [`${ORBITAL_MISSIONS[mission.type].label} failed; assigned platforms took operational damage.`, ...next.alerts].slice(0, 20);
    }
    return { ...mission, progress, status: success ? "success" as const : "failed" as const };
  });

  const upkeep = next.platforms.reduce((sum, platform) => {
    const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
    const zone = ORBIT_ZONES.find((entry) => entry.id === platform.orbit);
    return sum + (hullClass.cost.credits * 0.006 + platform.modules.length * 22) * (zone?.upkeepMultiplier ?? 1);
  }, 0);
  next.resources = {
    ...next.resources,
    credits: Math.max(0, next.resources.credits - upkeep),
    research: next.resources.research + next.platforms.reduce((sum, platform) => sum + calculatePlatformStats(platform, next).sensor * 0.35, 0),
  };
  next.platforms = next.platforms.map((platform) => ({
    ...platform,
    shield: Math.min(calculatePlatformStats(platform, next).shield, platform.shield + calculatePlatformStats(platform, next).shieldRecharge),
    readiness: clamp(platform.readiness + 2),
    abilityCooldowns: Object.fromEntries(Object.entries(platform.abilityCooldowns).map(([id, cooldown]) => [id, Math.max(0, cooldown - 1)])),
  }));
  return refreshPlatformPools(next);
}

export function simulateOrbitalBattle(state: OrbitalDefenseState, threatId: string): OrbitalDefenseState {
  const threat = THREAT_PROFILES.find((entry) => entry.id === threatId);
  if (!threat || state.platforms.length === 0) return state;
  let enemyShield = threat.shield;
  let enemyArmor = threat.armor;
  let enemyHull = threat.hull;
  let incomingStrength = threat.strength;
  const platforms = state.platforms.map((platform) => ({ ...platform, abilityCooldowns: { ...platform.abilityCooldowns } }));
  const rounds: OrbitalBattleRound[] = [];
  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  const destroyedPlatforms: string[] = [];
  const damagedPlatforms = new Set<string>();
  const globalDoctrine = ORBITAL_DOCTRINES[state.doctrine];

  for (let round = 1; round <= threat.rounds && enemyHull > 0 && platforms.some((platform) => platform.hull > 0); round += 1) {
    const roundLog: string[] = [];
    const abilities: string[] = [];
    let fleetDamage = 0;
    let fleetInterception = globalDoctrine.interception;
    let fleetSensor = 0;

    platforms.forEach((platform) => {
      if (platform.hull <= 0) return;
      const stats = calculatePlatformStats(platform, state);
      fleetSensor += stats.sensor + stats.command * 0.25;
      fleetInterception += stats.pointDefense;
      let abilityMultiplier = 1;
      const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
      hullClass.abilities.forEach((abilityId) => {
        const cooldown = platform.abilityCooldowns[abilityId] ?? 0;
        if (cooldown > 0) {
          platform.abilityCooldowns[abilityId] = cooldown - 1;
          return;
        }
        const shouldTrigger =
          (abilityId === "kill-zone" && round === 1) ||
          (abilityId === "phase-cloak" && round === 1) ||
          (abilityId === "orbital-denial" && round === 1) ||
          (abilityId === "overcharge" && (threat.targetClass === "capital" || threat.targetClass === "structure")) ||
          (abilityId === "drone-screen" && (threat.missiles > 20 || threat.targetClass === "fighter")) ||
          (abilityId === "aegis-pulse" && platform.shield < stats.shield * 0.5) ||
          (abilityId === "emergency-repair" && platform.hull < stats.hull * 0.55) ||
          (abilityId === "retaliation" && round > 1);
        if (!shouldTrigger) return;
        const ability = ORBITAL_ABILITIES.find((entry) => entry.id === abilityId)!;
        abilities.push(`${platform.name}: ${ability.name}`);
        platform.abilityCooldowns[abilityId] = ability.cooldown;
        if (abilityId === "overcharge") abilityMultiplier *= 1.45;
        if (abilityId === "kill-zone") abilityMultiplier *= 1.2;
        if (abilityId === "phase-cloak") abilityMultiplier *= 1.35;
        if (abilityId === "orbital-denial") fleetDamage += 280 * platform.tier;
        if (abilityId === "drone-screen") fleetInterception += 35;
        if (abilityId === "aegis-pulse") platform.shield = Math.min(stats.shield, platform.shield + stats.shield * 0.2);
        if (abilityId === "emergency-repair") {
          platform.hull = Math.min(stats.hull, platform.hull + stats.hull * 0.16);
          platform.armor = Math.min(stats.armor, platform.armor + stats.armor * 0.1);
        }
        if (abilityId === "retaliation") abilityMultiplier *= 1.25;
      });

      const detection = clamp((fleetSensor + stats.sensor) / Math.max(1, threat.evasion * 2), 0.35, 1.2);
      const accuracy = clamp(0.65 + (stats.tracking + globalDoctrine.accuracy - threat.evasion) / 100, 0.25, 0.98);
      const readiness = stats.readiness / 100;
      const damage = stats.damagePerRound * detection * accuracy * readiness * abilityMultiplier;
      fleetDamage += damage;
      platform.ammunition = Math.max(0, platform.ammunition - platform.modules.filter((id) => (ORBITAL_MODULES.find((entry) => entry.id === id)?.weapon?.ammunition ?? 0) > 0).length * 3);
    });

    const critical = seeded(state.cycle * 100 + round * 17) < 0.12;
    if (critical) {
      fleetDamage *= 1.4;
      roundLog.push("Synchronized critical firing solution achieved.");
    }
    const shieldDamage = Math.min(enemyShield, fleetDamage);
    enemyShield -= shieldDamage;
    const afterShield = fleetDamage - shieldDamage;
    const armorDamage = Math.min(enemyArmor, afterShield * 0.62);
    enemyArmor -= armorDamage;
    const hullDamage = Math.max(0, afterShield - armorDamage);
    enemyHull -= hullDamage;
    totalDamageDealt += fleetDamage;

    const intercepted = Math.min(threat.missiles, Math.round(threat.missiles * clamp(fleetInterception / 180, 0, 0.9)));
    const missileReduction = 1 - (intercepted / Math.max(1, threat.missiles)) * 0.45;
    let enemyDamage = incomingStrength * missileReduction * (enemyHull / Math.max(1, threat.hull));
    if (state.doctrine === "bastion") enemyDamage *= 0.82;
    if (state.doctrine === "retaliation" && round === 1) enemyDamage *= 0.88;
    const living = platforms.filter((platform) => platform.hull > 0);
    const targetIndex = Math.floor(seeded(state.cycle * 33 + round * 9) * living.length);
    const target = living[targetIndex];
    if (target) {
      const stats = calculatePlatformStats(target, state);
      const hitChance = clamp((threat.accuracy - stats.evasion) / 100, 0.25, 0.95);
      enemyDamage *= hitChance;
      const shieldHit = Math.min(target.shield, enemyDamage);
      target.shield -= shieldHit;
      let remaining = enemyDamage - shieldHit;
      const armorMitigation = state.unlockedTech.includes("adaptive-materials") ? 0.38 : 0.3;
      const armorHit = Math.min(target.armor, remaining * (1 - armorMitigation));
      target.armor -= armorHit;
      remaining = Math.max(0, remaining - armorHit);
      target.hull -= remaining;
      totalDamageTaken += enemyDamage;
      if (enemyDamage > 0) damagedPlatforms.add(target.id);
      if (target.hull <= 0) {
        target.hull = 0;
        destroyedPlatforms.push(target.id);
        roundLog.push(`${target.name} was disabled in orbit.`);
      } else {
        target.shield = Math.min(stats.shield, target.shield + stats.shieldRecharge);
        target.hull = Math.min(stats.hull, target.hull + stats.repair * 0.25);
        target.armor = Math.min(stats.armor, target.armor + stats.repair * 0.15);
      }
    }

    incomingStrength *= 0.94;
    rounds.push({
      round,
      incomingStrength: Math.round(incomingStrength),
      damageDealt: Math.round(fleetDamage),
      damageTaken: Math.round(enemyDamage),
      missilesIntercepted: intercepted,
      abilities,
      log: roundLog,
    });
  }

  const victory = enemyHull <= 0;
  const experience = Math.round((threat.strength + threat.hull) * (victory ? 0.08 : 0.035));
  const salvageMultiplier = victory ? 1 : 0.3;
  const salvage = {
    metal: Math.round(threat.armor * 0.16 * salvageMultiplier),
    crystal: Math.round(threat.shield * 0.11 * salvageMultiplier),
    deuterium: Math.round(threat.strength * 0.05 * salvageMultiplier),
    credits: Math.round(threat.hull * 0.18 * salvageMultiplier),
  };
  const report: OrbitalBattleReport = {
    id: `orbital-${state.cycle}-${threat.id}`,
    cycle: state.cycle,
    threatId,
    victory,
    rounds,
    totalDamageDealt: Math.round(totalDamageDealt),
    totalDamageTaken: Math.round(totalDamageTaken),
    destroyedPlatforms,
    damagedPlatforms: [...damagedPlatforms],
    salvage,
    experience,
  };

  const survivors = platforms.filter((platform) => platform.hull > 0).map((platform) => {
    const gained = Math.round(experience / Math.max(1, platforms.length));
    const experienceTotal = platform.experience + gained;
    const levelGain = Math.floor(experienceTotal / 1000) - Math.floor(platform.experience / 1000);
    return {
      ...platform,
      experience: experienceTotal,
      level: platform.level + Math.max(0, levelGain),
      readiness: clamp(platform.readiness - (damagedPlatforms.has(platform.id) ? 16 : 5)),
      integrity: clamp(platform.integrity - (damagedPlatforms.has(platform.id) ? 12 : 2)),
      kills: platform.kills + (victory ? 1 : 0),
    };
  });

  return {
    ...state,
    cycle: state.cycle + 1,
    resources: {
      ...state.resources,
      metal: state.resources.metal + salvage.metal,
      crystal: state.resources.crystal + salvage.crystal,
      deuterium: state.resources.deuterium + salvage.deuterium,
      credits: state.resources.credits + salvage.credits,
      research: state.resources.research + Math.round(experience * 0.25),
    },
    platforms: survivors,
    reports: [report, ...state.reports].slice(0, 20),
    alerts: [`${victory ? "Victory" : "Defense failure"} against ${threat.name}: ${Math.round(totalDamageDealt)} damage dealt.`, ...state.alerts].slice(0, 20),
    lifetime: {
      victories: state.lifetime.victories + (victory ? 1 : 0),
      defeats: state.lifetime.defeats + (victory ? 0 : 1),
      damageDealt: state.lifetime.damageDealt + Math.round(totalDamageDealt),
      damageTaken: state.lifetime.damageTaken + Math.round(totalDamageTaken),
      missilesIntercepted: state.lifetime.missilesIntercepted + rounds.reduce((sum, round) => sum + round.missilesIntercepted, 0),
      salvageValue: state.lifetime.salvageValue + salvage.metal + salvage.crystal + salvage.deuterium + salvage.credits,
    },
  };
}

export function getFleetSummary(state: OrbitalDefenseState) {
  const stats = state.platforms.map((platform) => calculatePlatformStats(platform, state));
  return {
    platforms: state.platforms.length,
    combatPower: Math.round(stats.reduce((sum, entry) => sum + entry.damagePerRound, 0)),
    shields: Math.round(stats.reduce((sum, entry) => sum + entry.shield, 0)),
    armorHull: Math.round(stats.reduce((sum, entry) => sum + entry.armor + entry.hull, 0)),
    interception: Math.round(stats.reduce((sum, entry) => sum + entry.pointDefense, 0)),
    sensor: Math.round(stats.reduce((sum, entry) => sum + entry.sensor + entry.command * 0.3, 0)),
    readiness: Math.round(stats.reduce((sum, entry) => sum + entry.readiness, 0) / Math.max(1, stats.length)),
    upkeep: Math.round(state.platforms.reduce((sum, platform) => {
      const hullClass = ORBITAL_PLATFORM_CLASSES.find((entry) => entry.id === platform.classId)!;
      const zone = ORBIT_ZONES.find((entry) => entry.id === platform.orbit);
      return sum + (hullClass.cost.credits * 0.006 + platform.modules.length * 22) * (zone?.upkeepMultiplier ?? 1);
    }, 0)),
  };
}
