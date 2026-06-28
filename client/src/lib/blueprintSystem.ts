import { SHIPYARD_CATEGORY_SYSTEMS, STARSHIP_LINE_BLUEPRINTS } from "@/lib/starshipLineCatalog";

export interface BlueprintRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
}

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "exotic";
export type Rank = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX" | "X";

export interface BlueprintCategory {
  id: string;
  label: string;
  summary: string;
  blueprintClass: string;
  blueprintSubClass: string;
  type: string;
  facilityRequirement: string;
  techDiscipline: string;
}

export interface Blueprint {
  id: string;
  name: string;
  displayName: string;
  description: string;
  detailedDescription: string;
  type: string;
  outputId: string;
  outputName: string;
  outputQuantity: number;
  category: string;
  categoryLabel: string;
  blueprintClass: string;
  blueprintSubClass: string;
  itemType: string;
  itemSubType: string;
  facilityRequirement: string;
  techDiscipline: string;
  blueprintKind: "original" | "copy";
  rarity: Rarity;
  level: number;
  rank: Rank;
  color: string;
  baseManufacturingTime: number;
  baseMaterialNeeded: BlueprintRequirement[];
  maxRuns: number;
  currentRuns: number;
  remainingRuns: number;
  isOriginal: boolean;
  isCopy: boolean;
  quality: number;
  baseSuccessRate: number;
  materialEfficiency: number;
  timeEfficiency: number;
  status: "active" | "used_up" | "archived";
  location: string;
  owner: string;
  createdAt: number;
}

export interface ProductionJob {
  id: string;
  blueprintId: string;
  blueprintName: string;
  quantity: number;
  status: "queued" | "in_progress" | "completed" | "failed";
  startTime: number;
  endTime: number;
  totalTime: number;
  progress: number;
  successRate: number;
  wasSuccessful?: boolean;
  outputQuantity?: number;
  failureReason?: string;
}

type MaterialProfile = "light" | "medium" | "heavy" | "precision" | "industrial" | "science" | "civic";

type VariantSeed = {
  slug: string;
  displayName: string;
  outputName: string;
  rarity: Rarity;
  rank: Rank;
  level: number;
  description: string;
  detail: string;
  itemSubType: string;
  outputQuantity?: number;
};

type CategorySeed = BlueprintCategory & {
  materialProfile: MaterialProfile;
  variants: VariantSeed[];
};

export const rarityColors: Record<Rarity, string> = {
  common: "#94a3b8",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
  exotic: "#ec4899",
};

const rarityEfficiency: Record<Rarity, { material: number; time: number; success: number }> = {
  common: { material: 96, time: 94, success: 84 },
  uncommon: { material: 98, time: 96, success: 82 },
  rare: { material: 101, time: 100, success: 79 },
  epic: { material: 104, time: 104, success: 76 },
  legendary: { material: 108, time: 108, success: 72 },
  exotic: { material: 112, time: 112, success: 68 },
};

const profileTimeMultiplier: Record<MaterialProfile, number> = {
  light: 140,
  medium: 180,
  heavy: 260,
  precision: 165,
  industrial: 210,
  science: 200,
  civic: 170,
};

function req(profile: MaterialProfile, level: number, quantity: number): BlueprintRequirement[] {
  const n = Math.max(1, level);
  const q = Math.max(1, quantity);
  const tables: Record<MaterialProfile, BlueprintRequirement[]> = {
    light: [{ itemId: "metal", itemName: "Metal", quantity: 120 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 60 * n }],
    medium: [{ itemId: "metal", itemName: "Metal", quantity: 180 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 120 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 30 * n }],
    heavy: [{ itemId: "metal", itemName: "Metal", quantity: 320 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 180 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 95 * n }],
    precision: [{ itemId: "metal", itemName: "Metal", quantity: 90 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 150 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 55 * n }],
    industrial: [{ itemId: "metal", itemName: "Metal", quantity: 220 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 140 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 70 * n }],
    science: [{ itemId: "metal", itemName: "Metal", quantity: 80 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 170 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 80 * n }],
    civic: [{ itemId: "metal", itemName: "Metal", quantity: 140 * n }, { itemId: "crystal", itemName: "Crystal", quantity: 90 * n }, { itemId: "deuterium", itemName: "Deuterium", quantity: 25 * n }],
  };
  return tables[profile].map((item) => ({ ...item, quantity: Math.ceil(item.quantity * q) }));
}

const CATEGORIES: CategorySeed[] = [
  { id: "interceptor_hulls", label: "Interceptor Hulls", summary: "Fast attack and escort hulls.", blueprintClass: "Starship", blueprintSubClass: "Interceptor", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Combat Aerodynamics", materialProfile: "light", variants: [{ slug: "skybolt", displayName: "Skybolt Interceptor", outputName: "Skybolt Interceptor", rarity: "common", rank: "I", level: 4, description: "Fast patrol interceptor.", detail: "Built for rapid-response wings.", itemSubType: "light interceptor" }, { slug: "aegis", displayName: "Aegis Interceptor", outputName: "Aegis Interceptor", rarity: "uncommon", rank: "II", level: 9, description: "Shield-forward interceptor.", detail: "Holds the escort line longer.", itemSubType: "shield interceptor" }, { slug: "eclipse", displayName: "Eclipse Interceptor", outputName: "Eclipse Interceptor", rarity: "rare", rank: "III", level: 15, description: "Silent pursuit interceptor.", detail: "Used in low-signature hunter wings.", itemSubType: "stealth interceptor" }] },
  { id: "corvette_hulls", label: "Corvette Hulls", summary: "Escort and skirmish corvettes.", blueprintClass: "Starship", blueprintSubClass: "Corvette", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Fleet Screening", materialProfile: "medium", variants: [{ slug: "pathfinder", displayName: "Pathfinder Corvette", outputName: "Pathfinder Corvette", rarity: "common", rank: "II", level: 8, description: "Balanced escort corvette.", detail: "Used on trade and patrol lanes.", itemSubType: "escort corvette" }, { slug: "halberd", displayName: "Halberd Corvette", outputName: "Halberd Corvette", rarity: "rare", rank: "III", level: 18, description: "Strike-tuned corvette.", detail: "Pushes skirmish pressure into mid-tier fleets.", itemSubType: "lance corvette" }] },
  { id: "frigate_hulls", label: "Frigate Hulls", summary: "Midline fleet frigates.", blueprintClass: "Starship", blueprintSubClass: "Frigate", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Naval Tactics", materialProfile: "medium", variants: [{ slug: "bastion", displayName: "Bastion Frigate", outputName: "Bastion Frigate", rarity: "uncommon", rank: "III", level: 16, description: "Defensive frigate frame.", detail: "Anchors frontier combat lines.", itemSubType: "defense frigate" }, { slug: "revenant", displayName: "Revenant Frigate", outputName: "Revenant Frigate", rarity: "epic", rank: "V", level: 28, description: "Breakthrough frigate.", detail: "Designed for aggressive assault windows.", itemSubType: "attack frigate" }] },
  { id: "destroyer_hulls", label: "Destroyer Hulls", summary: "Heavy pursuit and siege destroyers.", blueprintClass: "Starship", blueprintSubClass: "Destroyer", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Capital Gunnery", materialProfile: "heavy", variants: [{ slug: "dominion", displayName: "Dominion Destroyer", outputName: "Dominion Destroyer", rarity: "rare", rank: "IV", level: 24, description: "Imperial line destroyer.", detail: "Bridges heavy escort and cruiser doctrine.", itemSubType: "line destroyer" }, { slug: "siege", displayName: "Siege Destroyer", outputName: "Siege Destroyer", rarity: "legendary", rank: "VI", level: 36, description: "Siege destroyer chassis.", detail: "Built for bombardment and sustained attack runs.", itemSubType: "siege destroyer" }] },
  { id: "cruiser_hulls", label: "Cruiser Hulls", summary: "Doctrine anchors and long-range cruisers.", blueprintClass: "Starship", blueprintSubClass: "Cruiser", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Operational Fleet Design", materialProfile: "heavy", variants: [{ slug: "meridian", displayName: "Meridian Cruiser", outputName: "Meridian Cruiser", rarity: "rare", rank: "III", level: 25, description: "Balanced cruiser hull.", detail: "Supports independent deployments.", itemSubType: "balanced cruiser" }, { slug: "sovereign", displayName: "Sovereign Cruiser", outputName: "Sovereign Cruiser", rarity: "epic", rank: "V", level: 34, description: "Doctrine cruiser frame.", detail: "Carries stronger command relay logic.", itemSubType: "command cruiser" }, { slug: "eclipse", displayName: "Eclipse Cruiser", outputName: "Eclipse Cruiser", rarity: "legendary", rank: "VI", level: 42, description: "Shadow cruiser pattern.", detail: "Pushes stealth deeper into cruiser-class warships.", itemSubType: "shadow cruiser" }] },
  { id: "battleship_hulls", label: "Battleship Hulls", summary: "Fleet anchors and warship patterns.", blueprintClass: "Starship", blueprintSubClass: "Battleship", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "High-Mass Naval Construction", materialProfile: "heavy", variants: [{ slug: "paladin", displayName: "Paladin Battleship", outputName: "Paladin Battleship", rarity: "epic", rank: "VI", level: 45, description: "Heavy line battleship.", detail: "Designed for sustained broadside warfare.", itemSubType: "line battleship" }, { slug: "leviathan", displayName: "Leviathan Battleship", outputName: "Leviathan Battleship", rarity: "exotic", rank: "VIII", level: 58, description: "Apex battleship hull.", detail: "Used by endgame imperial spearheads.", itemSubType: "apex battleship" }] },
  { id: "carrier_hulls", label: "Carrier Hulls", summary: "Carrier deployment hulls.", blueprintClass: "Starship", blueprintSubClass: "Carrier", type: "Hull", facilityRequirement: "Starship Constructor Yard", techDiscipline: "Strike Wing Coordination", materialProfile: "heavy", variants: [{ slug: "atlas", displayName: "Atlas Carrier", outputName: "Atlas Carrier", rarity: "legendary", rank: "VII", level: 52, description: "Fleet carrier hull.", detail: "Coordinates strike craft from protected bays.", itemSubType: "fleet carrier" }, { slug: "ark", displayName: "Ark Carrier", outputName: "Ark Carrier", rarity: "exotic", rank: "IX", level: 64, description: "Strategic carrier hull.", detail: "Supports deep-space campaign endurance.", itemSubType: "strategic carrier" }] },
  { id: "industrial_hulls", label: "Industrial Hulls", summary: "Trade and transport ship frames.", blueprintClass: "Industrial", blueprintSubClass: "Freighter", type: "Ship", facilityRequirement: "Orbital Shipyard", techDiscipline: "Logistics Engineering", materialProfile: "industrial", variants: [{ slug: "merchant", displayName: "Merchant Hauler", outputName: "Merchant Hauler", rarity: "common", rank: "I", level: 5, description: "Bulk trade hauler.", detail: "Keeps empire supply lines moving.", itemSubType: "trade hauler" }, { slug: "prospector", displayName: "Prospector Freighter", outputName: "Prospector Freighter", rarity: "rare", rank: "III", level: 20, description: "Resource-lift freighter.", detail: "Moves ore and crystal from mining fronts.", itemSubType: "resource freighter" }] },
  { id: "colony_platforms", label: "Colony Platforms", summary: "Colonization deployment kits.", blueprintClass: "Expansion", blueprintSubClass: "Colonization", type: "Platform", facilityRequirement: "Expansion Fabrication Wing", techDiscipline: "Colonial Systems", materialProfile: "industrial", variants: [{ slug: "seedship", displayName: "Seedship Module", outputName: "Seedship Module", rarity: "uncommon", rank: "II", level: 12, description: "First-wave colony package.", detail: "Brings life support and admin systems.", itemSubType: "seedship module" }, { slug: "arcpod", displayName: "Frontier Arc Pod", outputName: "Frontier Arc Pod", rarity: "epic", rank: "V", level: 33, description: "Hostile-world colonization pod.", detail: "Supports harsher climates before full build-out.", itemSubType: "frontier pod" }] },
  { id: "station_modules", label: "Station Modules", summary: "Orbital frames and station shell packs.", blueprintClass: "Infrastructure", blueprintSubClass: "Station Module", type: "Structure", facilityRequirement: "Orbital Assembly Dock", techDiscipline: "Station Architecture", materialProfile: "industrial", variants: [{ slug: "framepack", displayName: "Orbital Frame Pack", outputName: "Orbital Frame Pack", rarity: "rare", rank: "III", level: 22, description: "Primary orbital shell package.", detail: "Extends station bodies and service rings.", itemSubType: "frame module" }, { slug: "ringcore", displayName: "Bastion Ring Core", outputName: "Bastion Ring Core", rarity: "legendary", rank: "VI", level: 44, description: "Advanced ring core segment.", detail: "Used in major orbital bastions.", itemSubType: "ring core" }] },
  { id: "weapon_batteries", label: "Weapon Batteries", summary: "Ship and fortress armament batteries.", blueprintClass: "Equipment", blueprintSubClass: "Weapon Array", type: "Equipment", facilityRequirement: "Military Fabrication Bay", techDiscipline: "Directed Weapons", materialProfile: "precision", variants: [{ slug: "emberlance", displayName: "Ember Lance Battery", outputName: "Ember Lance Battery", rarity: "common", rank: "II", level: 7, description: "Baseline beam battery.", detail: "Reliable hardpoint package for ships and platforms.", itemSubType: "beam battery" }, { slug: "stormrail", displayName: "Stormrail Siege Battery", outputName: "Stormrail Siege Battery", rarity: "rare", rank: "IV", level: 23, description: "High-velocity siege rail battery.", detail: "Built to crack plated targets and hard emplacements.", itemSubType: "siege rail battery" }] },
  { id: "missile_systems", label: "Missile Systems", summary: "Guided munitions and salvo racks.", blueprintClass: "Equipment", blueprintSubClass: "Missile Rack", type: "Equipment", facilityRequirement: "Military Fabrication Bay", techDiscipline: "Munitions Ordnance", materialProfile: "precision", variants: [{ slug: "scythe", displayName: "Scythe Missile Rack", outputName: "Scythe Missile Rack", rarity: "uncommon", rank: "II", level: 11, description: "Multi-role missile pack.", detail: "Fits screening ships that need flexible salvos.", itemSubType: "guided missile rack" }, { slug: "starfall", displayName: "Starfall Torpedo Matrix", outputName: "Starfall Torpedo Matrix", rarity: "epic", rank: "V", level: 31, description: "Heavy torpedo assembly.", detail: "A warhead lattice tuned for capital puncture roles.", itemSubType: "torpedo matrix" }] },
  { id: "shield_matrices", label: "Shield Matrices", summary: "Deflector, barrier, and bulwark emitters.", blueprintClass: "Equipment", blueprintSubClass: "Shield Generator", type: "Equipment", facilityRequirement: "Defense Grid Foundry", techDiscipline: "Field Harmonization", materialProfile: "science", variants: [{ slug: "aurelian", displayName: "Aurelian Shield Matrix", outputName: "Aurelian Shield Matrix", rarity: "common", rank: "II", level: 10, description: "Frontline shield matrix.", detail: "Commonly issued to line escorts and station collars.", itemSubType: "deflector matrix" }, { slug: "citadel", displayName: "Citadel Bulwark Matrix", outputName: "Citadel Bulwark Matrix", rarity: "legendary", rank: "VI", level: 41, description: "Fortress-grade barrier matrix.", detail: "Projects layered envelopes for capitals and bastions.", itemSubType: "fortress barrier matrix" }] },
  { id: "armor_plating", label: "Armor Plating", summary: "Hull reinforcement and reactive armor suites.", blueprintClass: "Equipment", blueprintSubClass: "Armor Suite", type: "Equipment", facilityRequirement: "Defense Grid Foundry", techDiscipline: "Metallurgy and Plating", materialProfile: "heavy", variants: [{ slug: "wardsteel", displayName: "Wardsteel Armor Suite", outputName: "Wardsteel Armor Suite", rarity: "common", rank: "I", level: 6, description: "Reinforced armor suite.", detail: "A dependable base for survivability upgrades.", itemSubType: "reinforced armor" }, { slug: "onyx", displayName: "Onyx Reactive Bastion Plate", outputName: "Onyx Reactive Bastion Plate", rarity: "epic", rank: "V", level: 30, description: "Reactive armor lattice.", detail: "Channels impact shock into ablative layers.", itemSubType: "reactive armor plate" }] },
  { id: "engine_modules", label: "Engine Modules", summary: "Propulsion cores and maneuver assemblies.", blueprintClass: "Equipment", blueprintSubClass: "Propulsion", type: "Equipment", facilityRequirement: "Propulsion Forge", techDiscipline: "Impulse Dynamics", materialProfile: "precision", variants: [{ slug: "sunsprint", displayName: "Sunsprint Drive Core", outputName: "Sunsprint Drive Core", rarity: "common", rank: "II", level: 9, description: "Fast-response engine core.", detail: "Improves acceleration windows for patrol hulls.", itemSubType: "drive core" }, { slug: "voidwake", displayName: "Voidwake Phase Thrusters", outputName: "Voidwake Phase Thrusters", rarity: "rare", rank: "IV", level: 21, description: "Advanced phase-thrust assembly.", detail: "Used when maneuver authority matters as much as thrust.", itemSubType: "phase thruster assembly" }, { slug: "kingmaker", displayName: "Kingmaker Strategic FTL Spine", outputName: "Kingmaker Strategic FTL Spine", rarity: "legendary", rank: "VII", level: 49, description: "Strategic transit spine.", detail: "Bridges late-game capitals into deep theaters.", itemSubType: "ftl spine" }] },
  { id: "drone_wings", label: "Drone Wings", summary: "Autonomous drones and strike craft packs.", blueprintClass: "Equipment", blueprintSubClass: "Drone Wing", type: "Equipment", facilityRequirement: "Autonomous Systems Foundry", techDiscipline: "Drone Coordination", materialProfile: "science", variants: [{ slug: "skimmer", displayName: "Skimmer Drone Wing", outputName: "Skimmer Drone Wing", rarity: "uncommon", rank: "II", level: 13, description: "Recon and harassment drones.", detail: "Supports screening fleets with scouting pressure.", itemSubType: "recon drone wing", outputQuantity: 4 }, { slug: "mantis", displayName: "Mantis Assault Drone Wing", outputName: "Mantis Assault Drone Wing", rarity: "rare", rank: "IV", level: 24, description: "Combat drone attack wing.", detail: "Pairs precision tracking with disposable strike mass.", itemSubType: "assault drone wing", outputQuantity: 3 }] },
  { id: "mining_lasers", label: "Mining Lasers", summary: "Extraction beams and asteroid cutting systems.", blueprintClass: "Industrial", blueprintSubClass: "Mining Module", type: "Equipment", facilityRequirement: "Resource Tool Fabricator", techDiscipline: "Extraction Optics", materialProfile: "precision", variants: [{ slug: "deepcore", displayName: "Deepcore Extraction Laser", outputName: "Deepcore Extraction Laser", rarity: "common", rank: "I", level: 5, description: "Baseline mineral extractor.", detail: "Cuts ore seams cleanly for colony and station miners.", itemSubType: "extraction laser" }, { slug: "aurora", displayName: "Aurora Crystal Lance", outputName: "Aurora Crystal Lance", rarity: "epic", rank: "V", level: 29, description: "Crystal-optimized mining lance.", detail: "Preserves volatile lattice integrity during crystal harvesting.", itemSubType: "crystal lance" }] },
  { id: "refinery_modules", label: "Refinery Modules", summary: "Ore, gas, and isotope processing modules.", blueprintClass: "Industrial", blueprintSubClass: "Refinery", type: "Module", facilityRequirement: "Refinery Systems Complex", techDiscipline: "Industrial Processing", materialProfile: "industrial", variants: [{ slug: "orewash", displayName: "Orewash Refinery Module", outputName: "Orewash Refinery Module", rarity: "common", rank: "II", level: 8, description: "Standard ore refining unit.", detail: "Improves yield quality on early industrial chains.", itemSubType: "ore refinery module" }, { slug: "isotope", displayName: "Isotope Fractionation Stack", outputName: "Isotope Fractionation Stack", rarity: "rare", rank: "IV", level: 26, description: "Fuel-grade isotope stack.", detail: "Separates reactor stock from mixed feedstock.", itemSubType: "isotope refinery stack" }, { slug: "nova", displayName: "Nova Plasma Reformer", outputName: "Nova Plasma Reformer", rarity: "epic", rank: "VI", level: 40, description: "Late-stage plasma refinery core.", detail: "Converts unstable stellar residue into premium industrial stock.", itemSubType: "plasma refinery core" }] },
  { id: "research_apparatus", label: "Research Apparatus", summary: "Laboratory instruments and field science rigs.", blueprintClass: "Science", blueprintSubClass: "Research Instrument", type: "Equipment", facilityRequirement: "Research Hub Prototype Lab", techDiscipline: "Applied Science", materialProfile: "science", variants: [{ slug: "helix", displayName: "Helix Research Suite", outputName: "Helix Research Suite", rarity: "uncommon", rank: "III", level: 14, description: "General-purpose research suite.", detail: "Supports material and systems experimentation.", itemSubType: "research suite" }, { slug: "singularity", displayName: "Singularity Analysis Cradle", outputName: "Singularity Analysis Cradle", rarity: "legendary", rank: "VII", level: 47, description: "Exotic anomaly lab cradle.", detail: "Reserved for high-risk prototype programs.", itemSubType: "anomaly analysis cradle" }] },
  { id: "data_cores", label: "Data Cores", summary: "Manufacturing algorithms and science datasets.", blueprintClass: "Science", blueprintSubClass: "Data Core", type: "Item", facilityRequirement: "Research Hub Prototype Lab", techDiscipline: "Computational Synthesis", materialProfile: "science", variants: [{ slug: "foundry", displayName: "Foundry Data Core", outputName: "Foundry Data Core", rarity: "common", rank: "II", level: 12, description: "Industrial process dataset.", detail: "Feeds fabrication planners with stable throughput logic.", itemSubType: "industrial data core", outputQuantity: 2 }, { slug: "oracle", displayName: "Oracle Predictive Core", outputName: "Oracle Predictive Core", rarity: "epic", rank: "VI", level: 38, description: "Advanced simulation core.", detail: "Compresses campaign-scale forecasts into machine logic.", itemSubType: "predictive data core" }] },
  { id: "infantry_gear", label: "Infantry Gear", summary: "Ground trooper kits, armor, and specialist kits.", blueprintClass: "Military", blueprintSubClass: "Infantry Equipment", type: "Equipment", facilityRequirement: "Planetary Defense Forge", techDiscipline: "Combined Arms Logistics", materialProfile: "civic", variants: [{ slug: "vanguard", displayName: "Vanguard Infantry Kit", outputName: "Vanguard Infantry Kit", rarity: "common", rank: "I", level: 4, description: "Standard trooper deployment kit.", detail: "Equips new garrisons with armor and telemetry.", itemSubType: "trooper equipment kit", outputQuantity: 8 }, { slug: "warden", displayName: "Warden Breach Harness", outputName: "Warden Breach Harness", rarity: "rare", rank: "III", level: 18, description: "Heavy assault harness.", detail: "Used by boarding teams and breach units.", itemSubType: "breach assault harness", outputQuantity: 4 }] },
  { id: "vehicle_chassis", label: "Vehicle Chassis", summary: "Ground armor, walkers, and support vehicle frames.", blueprintClass: "Military", blueprintSubClass: "Vehicle Frame", type: "Hull", facilityRequirement: "Planetary Defense Forge", techDiscipline: "Armor Doctrine", materialProfile: "heavy", variants: [{ slug: "rhino", displayName: "Rhino Siege Chassis", outputName: "Rhino Siege Chassis", rarity: "uncommon", rank: "III", level: 17, description: "Armored assault frame.", detail: "Supports planetary breach columns and mechanized assaults.", itemSubType: "siege vehicle chassis" }, { slug: "titanwalker", displayName: "Titanwalker Frame", outputName: "Titanwalker Frame", rarity: "legendary", rank: "VI", level: 39, description: "Heavy walker frame.", detail: "Deploys as a mobile citadel in high-intensity wars.", itemSubType: "heavy walker chassis" }] },
  { id: "habitat_systems", label: "Habitat Systems", summary: "Population support modules and life-grid interiors.", blueprintClass: "Civic", blueprintSubClass: "Habitat Module", type: "Structure", facilityRequirement: "Civilian Fabrication Sphere", techDiscipline: "Habitation Engineering", materialProfile: "civic", variants: [{ slug: "greenring", displayName: "Greenring Habitat Module", outputName: "Greenring Habitat Module", rarity: "common", rank: "II", level: 9, description: "Standard population habitat.", detail: "Adds housing, atmosphere control, and recovery commons.", itemSubType: "habitat module" }, { slug: "skyward", displayName: "Skyward Arcology Spine", outputName: "Skyward Arcology Spine", rarity: "epic", rank: "V", level: 32, description: "High-density arcology segment.", detail: "Expands orbital and lunar population capacity at megacity scale.", itemSubType: "arcology spine" }] },
  { id: "medical_suites", label: "Medical Suites", summary: "Biostasis, surgery, and recovery systems.", blueprintClass: "Civic", blueprintSubClass: "Medical Module", type: "Equipment", facilityRequirement: "Medical Systems Atelier", techDiscipline: "Regenerative Medicine", materialProfile: "science", variants: [{ slug: "lifeline", displayName: "Lifeline Med Suite", outputName: "Lifeline Med Suite", rarity: "uncommon", rank: "II", level: 10, description: "General colony medical suite.", detail: "Bundles emergency care, diagnostics, and surgery automation.", itemSubType: "medical suite" }, { slug: "phoenix", displayName: "Phoenix Biostasis Vault", outputName: "Phoenix Biostasis Vault", rarity: "epic", rank: "V", level: 35, description: "Advanced stasis recovery vault.", detail: "Preserves critical personnel during system evacuations.", itemSubType: "biostasis vault" }] },
  { id: "sensor_arrays", label: "Sensor Arrays", summary: "Scanning packages and strategic surveillance nodes.", blueprintClass: "Systems", blueprintSubClass: "Sensor Package", type: "Equipment", facilityRequirement: "Recon Electronics Lab", techDiscipline: "Sensor Fusion", materialProfile: "science", variants: [{ slug: "farseer", displayName: "Farseer Sensor Array", outputName: "Farseer Sensor Array", rarity: "uncommon", rank: "II", level: 11, description: "Wide-band sensor package.", detail: "Maps fleets, anomalies, and trade traffic with clarity.", itemSubType: "wide-band sensor array" }, { slug: "ghosteye", displayName: "Ghosteye Silent Array", outputName: "Ghosteye Silent Array", rarity: "rare", rank: "IV", level: 25, description: "Low-signature surveillance array.", detail: "Used by espionage wings and stealth cruisers.", itemSubType: "silent sensor array" }] },
  { id: "command_uplinks", label: "Command Uplinks", summary: "Fleet uplinks, strategy relays, and command bridges.", blueprintClass: "Systems", blueprintSubClass: "Command Relay", type: "Module", facilityRequirement: "Command Nexus Workshop", techDiscipline: "Battle Network Doctrine", materialProfile: "science", variants: [{ slug: "banner", displayName: "Banner Command Uplink", outputName: "Banner Command Uplink", rarity: "uncommon", rank: "III", level: 15, description: "Tactical fleet uplink.", detail: "Improves cohesion between mixed squadrons and stations.", itemSubType: "tactical uplink" }, { slug: "throne", displayName: "Throne Strategic Relay", outputName: "Throne Strategic Relay", rarity: "legendary", rank: "VII", level: 46, description: "Empire command relay.", detail: "Extends doctrine bonuses through regional command webs.", itemSubType: "strategic relay" }] },
  { id: "ai_cores", label: "AI Cores", summary: "Machine logic cores for industry, combat, and science.", blueprintClass: "Systems", blueprintSubClass: "AI Core", type: "Item", facilityRequirement: "Synthetic Cognition Forge", techDiscipline: "Cognitive Engineering", materialProfile: "science", variants: [{ slug: "scribe", displayName: "Scribe Automation Core", outputName: "Scribe Automation Core", rarity: "uncommon", rank: "III", level: 16, description: "Industrial automation core.", detail: "Optimizes build queues, stock control, and throughput.", itemSubType: "automation core" }, { slug: "archon", displayName: "Archon War-AI Core", outputName: "Archon War-AI Core", rarity: "exotic", rank: "VIII", level: 55, description: "Strategic combat intelligence core.", detail: "Reserved for elite command stacks and adaptive battle plans.", itemSubType: "war-ai core" }] },
  { id: "terraforming_rigs", label: "Terraforming Rigs", summary: "Planetary climate shaping and biosphere seeding rigs.", blueprintClass: "Expansion", blueprintSubClass: "Terraforming Rig", type: "Structure", facilityRequirement: "Planetary Engineering Dock", techDiscipline: "Climate Transformation", materialProfile: "industrial", variants: [{ slug: "rainmaker", displayName: "Rainmaker Terraforming Rig", outputName: "Rainmaker Terraforming Rig", rarity: "rare", rank: "IV", level: 28, description: "Atmosphere and water cycle rig.", detail: "Begins ecological stabilization for hostile worlds.", itemSubType: "atmospheric terraforming rig" }, { slug: "gaia", displayName: "Gaia Genesis Rig", outputName: "Gaia Genesis Rig", rarity: "exotic", rank: "IX", level: 61, description: "Late-stage biosphere seeding rig.", detail: "Pushes frontier worlds into paradise-grade stability.", itemSubType: "biosphere genesis rig" }] },
  { id: "lunar_installations", label: "Lunar Installations", summary: "Moon-base systems, seals, and launch infrastructure.", blueprintClass: "Infrastructure", blueprintSubClass: "Lunar Facility", type: "Structure", facilityRequirement: "Lunar Base Construction Ring", techDiscipline: "Selenic Engineering", materialProfile: "industrial", variants: [{ slug: "moonseal", displayName: "Moonseal Hab Dome", outputName: "Moonseal Hab Dome", rarity: "common", rank: "II", level: 10, description: "Baseline lunar dome.", detail: "Supports early moon colonization and sealed crews.", itemSubType: "lunar hab dome" }, { slug: "catapult", displayName: "Mass Driver Catapult", outputName: "Mass Driver Catapult", rarity: "rare", rank: "IV", level: 24, description: "Lunar launch infrastructure.", detail: "Fires processed ore and logistics capsules into orbit.", itemSubType: "lunar launch system" }] },
  { id: "orbital_habitats", label: "Orbital Habitats", summary: "Spokes, rings, and zero-g living districts.", blueprintClass: "Infrastructure", blueprintSubClass: "Orbital Habitat", type: "Structure", facilityRequirement: "Orbital Assembly Dock", techDiscipline: "Orbital Civil Design", materialProfile: "civic", variants: [{ slug: "halo", displayName: "Halo Habitat Ring", outputName: "Halo Habitat Ring", rarity: "uncommon", rank: "III", level: 18, description: "Rotational habitat ring.", detail: "Expands civilian presence and workforce capacity.", itemSubType: "habitat ring" }, { slug: "solace", displayName: "Solace Embassy Habitat", outputName: "Solace Embassy Habitat", rarity: "epic", rank: "VI", level: 37, description: "Diplomatic orbital habitat.", detail: "Blends habitation, culture districts, and emissary security.", itemSubType: "diplomatic habitat" }] },
  { id: "megastructure_segments", label: "Megastructure Segments", summary: "Scaffold sections, nodes, and stellar-scale frames.", blueprintClass: "Megastructure", blueprintSubClass: "Segment", type: "Structure", facilityRequirement: "Megastructure Assembly Spine", techDiscipline: "Macro-Scale Construction", materialProfile: "heavy", variants: [{ slug: "sunspine", displayName: "Sunspine Segment", outputName: "Sunspine Segment", rarity: "legendary", rank: "VIII", level: 54, description: "Primary megastructure segment.", detail: "Forms the early frame of stellar engineering projects.", itemSubType: "primary segment" }, { slug: "crown", displayName: "Crown Nexus Segment", outputName: "Crown Nexus Segment", rarity: "exotic", rank: "X", level: 68, description: "Apex nexus segment.", detail: "Supports final-stage harmonics and power transfer.", itemSubType: "nexus segment" }] },
  { id: "defense_platforms", label: "Defense Platforms", summary: "Static orbital defense and perimeter bastions.", blueprintClass: "Military", blueprintSubClass: "Defense Platform", type: "Structure", facilityRequirement: "Orbital Defense Yard", techDiscipline: "Fortress Warfare", materialProfile: "heavy", variants: [{ slug: "bulwark", displayName: "Bulwark Defense Platform", outputName: "Bulwark Defense Platform", rarity: "rare", rank: "IV", level: 20, description: "Static defense bastion.", detail: "Anchors chokepoints with shield hardpoints and heavy guns.", itemSubType: "orbital defense platform" }, { slug: "sunbreaker", displayName: "Sunbreaker Fortress Platform", outputName: "Sunbreaker Fortress Platform", rarity: "exotic", rank: "IX", level: 63, description: "Apex fortress platform.", detail: "Represents an endgame orbital denial tool.", itemSubType: "fortress defense platform" }] },
];

function buildBlueprint(category: CategorySeed, variant: VariantSeed, index: number): Blueprint {
  const efficiency = rarityEfficiency[variant.rarity];
  const outputQuantity = variant.outputQuantity ?? 1;

  return {
    id: `${category.id}_${variant.slug}`,
    name: `${variant.displayName} Blueprint Original`,
    displayName: variant.displayName,
    description: variant.description,
    detailedDescription: `${variant.detail} This original blueprint belongs to the ${category.label} library, is built through ${category.facilityRequirement}, and advances ${category.techDiscipline}.`,
    type: category.type,
    outputId: `${category.id}_${variant.slug}_output`,
    outputName: variant.outputName,
    outputQuantity,
    category: category.id,
    categoryLabel: category.label,
    blueprintClass: category.blueprintClass,
    blueprintSubClass: category.blueprintSubClass,
    itemType: category.type,
    itemSubType: variant.itemSubType,
    facilityRequirement: category.facilityRequirement,
    techDiscipline: category.techDiscipline,
    blueprintKind: "original",
    rarity: variant.rarity,
    level: variant.level,
    rank: variant.rank,
    color: rarityColors[variant.rarity],
    baseManufacturingTime: Math.ceil((profileTimeMultiplier[category.materialProfile] * variant.level + 180) * outputQuantity),
    baseMaterialNeeded: req(category.materialProfile, variant.level, outputQuantity),
    maxRuns: 0,
    currentRuns: 0,
    remainingRuns: 0,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    baseSuccessRate: efficiency.success,
    materialEfficiency: efficiency.material,
    timeEfficiency: efficiency.time,
    status: "active",
    location: category.facilityRequirement,
    owner: "Imperial Foundry",
    createdAt: Date.UTC(2525, index % 12, Math.max(1, (index % 28) + 1)),
  };
}

function getStarshipMaterialProfile(hullClass: string): MaterialProfile {
  const normalized = hullClass.toLowerCase();
  if (normalized.includes("supercapital") || normalized.includes("dreadnought") || normalized.includes("carrier") || normalized.includes("battleship")) return "heavy";
  if (normalized.includes("industrial") || normalized.includes("freighter") || normalized.includes("transport") || normalized.includes("barge") || normalized.includes("exhumer")) return "industrial";
  if (normalized.includes("covert") || normalized.includes("recon") || normalized.includes("logistics") || normalized.includes("strategic")) return "science";
  if (normalized.includes("interceptor") || normalized.includes("corvette") || normalized.includes("frigate")) return "light";
  if (normalized.includes("destroyer")) return "medium";
  return "heavy";
}

function getStarshipRarity(hullClass: string, sequence: number): Rarity {
  const normalized = hullClass.toLowerCase();
  if (normalized.includes("supercapital") || normalized.includes("titan")) return sequence === 1 ? "legendary" : "exotic";
  if (normalized.includes("force auxiliary") || normalized.includes("dreadnought") || normalized.includes("carrier")) return sequence === 1 ? "epic" : "legendary";
  if (normalized.includes("marauder") || normalized.includes("black ops") || normalized.includes("strategic")) return sequence === 1 ? "rare" : sequence === 2 ? "epic" : "legendary";
  return sequence === 1 ? "common" : sequence === 2 ? "uncommon" : "rare";
}

function getStarshipRank(level: number): Rank {
  if (level >= 66) return "X";
  if (level >= 58) return "IX";
  if (level >= 50) return "VIII";
  if (level >= 44) return "VII";
  if (level >= 38) return "VI";
  if (level >= 32) return "V";
  if (level >= 26) return "IV";
  if (level >= 20) return "III";
  if (level >= 12) return "II";
  return "I";
}

const STARSHIP_BLUEPRINT_CATEGORIES: BlueprintCategory[] = SHIPYARD_CATEGORY_SYSTEMS.map((category) => ({
  id: `starship-command-${category.id}`,
  label: category.name,
  summary: `${category.description} Doctrine track: ${category.doctrine}`,
  blueprintClass: "Spaceship Command",
  blueprintSubClass: category.name,
  type: "Starship Hull",
  facilityRequirement: "Starship Constructor Yard",
  techDiscipline: category.doctrine,
}));

const STARSHIP_BLUEPRINTS: Blueprint[] = STARSHIP_LINE_BLUEPRINTS.map((blueprint, index) => {
  const category = STARSHIP_BLUEPRINT_CATEGORIES.find((entry) => entry.id === `starship-command-${blueprint.categoryId}`)!;
  const level = 8 + Math.floor(index * 0.7) + blueprint.requirements.kardashevLevel * 3;
  const rarity = getStarshipRarity(blueprint.hullClass, blueprint.sequence);
  const profile = getStarshipMaterialProfile(blueprint.hullClass);
  const efficiency = rarityEfficiency[rarity];

  return {
    id: `starship_blueprint_${blueprint.id}`,
    name: `${blueprint.name} Blueprint Original`,
    displayName: blueprint.name,
    description: blueprint.description,
    detailedDescription: `${blueprint.description} This command-hull blueprint is synchronized with the Advanced Constructor Dock and unlock path requirements from the Spaceship Command-inspired shipyard matrix.`,
    type: "Starship Hull",
    outputId: `starship_output_${blueprint.id}`,
    outputName: blueprint.name,
    outputQuantity: 1,
    category: category.id,
    categoryLabel: category.label,
    blueprintClass: category.blueprintClass,
    blueprintSubClass: blueprint.hullClass,
    itemType: "Starship Hull",
    itemSubType: blueprint.role.toLowerCase(),
    facilityRequirement: category.facilityRequirement,
    techDiscipline: category.techDiscipline,
    blueprintKind: "original",
    rarity,
    level,
    rank: getStarshipRank(level),
    color: rarityColors[rarity],
    baseManufacturingTime: Math.ceil((profileTimeMultiplier[profile] * level + blueprint.stats.hull * 0.08) * Math.max(1, blueprint.sequence)),
    baseMaterialNeeded: req(profile, Math.max(1, Math.floor(level / 2)), Math.max(1, Math.ceil((blueprint.stats.hull + blueprint.stats.firepower) / 4500))),
    maxRuns: 0,
    currentRuns: 0,
    remainingRuns: 0,
    isOriginal: true,
    isCopy: false,
    quality: 100,
    baseSuccessRate: efficiency.success,
    materialEfficiency: efficiency.material,
    timeEfficiency: efficiency.time,
    status: "active",
    location: category.facilityRequirement,
    owner: "Imperial Foundry",
    createdAt: Date.UTC(2526, index % 12, Math.max(1, (index % 28) + 1)),
  };
});

const BASE_BLUEPRINT_MANUFACTURING_CATEGORIES: BlueprintCategory[] = CATEGORIES.map(({ materialProfile: _materialProfile, variants: _variants, ...category }) => category);
const BASE_BLUEPRINT_LIBRARY: Blueprint[] = CATEGORIES.flatMap((category) => category.variants.map((variant, index) => buildBlueprint(category, variant, index)));

export const BLUEPRINT_MANUFACTURING_CATEGORIES: BlueprintCategory[] = [
  ...BASE_BLUEPRINT_MANUFACTURING_CATEGORIES,
  ...STARSHIP_BLUEPRINT_CATEGORIES,
];
export const BASE_BLUEPRINTS: Blueprint[] = [
  ...BASE_BLUEPRINT_LIBRARY,
  ...STARSHIP_BLUEPRINTS,
];
export const BLUEPRINT_LIBRARY_STATS = {
  totalCategories: BLUEPRINT_MANUFACTURING_CATEGORIES.length,
  totalBlueprints: BASE_BLUEPRINTS.length,
  totalClasses: new Set(BASE_BLUEPRINTS.map((blueprint) => blueprint.blueprintClass)).size,
  totalSubClasses: new Set(BASE_BLUEPRINTS.map((blueprint) => blueprint.blueprintSubClass)).size,
  totalTypes: new Set(BASE_BLUEPRINTS.map((blueprint) => blueprint.itemType)).size,
  totalSubTypes: new Set(BASE_BLUEPRINTS.map((blueprint) => blueprint.itemSubType)).size,
  rarityCount: new Set(BASE_BLUEPRINTS.map((blueprint) => blueprint.rarity)).size,
};

export function calculateManufacturingCost(blueprint: Blueprint, quantity: number, industrySkill: number = 1): BlueprintRequirement[] {
  const wastePercentage = (100 - blueprint.materialEfficiency) * (1 - industrySkill * 0.01);
  const materialWaste = 1 + wastePercentage / 100;
  return blueprint.baseMaterialNeeded.map((reqItem) => ({ ...reqItem, quantity: Math.ceil(reqItem.quantity * quantity * materialWaste) }));
}

export function calculateManufacturingTime(blueprint: Blueprint, quantity: number, industrySkill: number = 1, shipdyardLevel: number = 1): number {
  let baseTime = blueprint.baseManufacturingTime * quantity;
  const timeReduction = blueprint.timeEfficiency * (1 + industrySkill * 0.05);
  baseTime = baseTime * (1 - timeReduction / 100);
  baseTime = baseTime / (1 + shipdyardLevel * 0.1);
  return Math.ceil(baseTime);
}

export function calculateSuccessRate(blueprint: Blueprint, industrySkill: number = 1, scientistSkill: number = 1): number {
  let successRate = blueprint.baseSuccessRate + industrySkill * 2;
  if (blueprint.blueprintClass === "Starship") successRate += scientistSkill * 1.5;
  if (blueprint.isCopy) successRate = successRate * (blueprint.quality / 100);
  return Math.min(100, Math.max(0, successRate));
}

export function createBlueprintCopy(original: Blueprint, runs: number = 10, quality: number = 85): Blueprint {
  const rarityScale: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "exotic"];
  let copyRarity = original.rarity;
  if (quality < 90 && original.rarity !== "common") {
    copyRarity = rarityScale[Math.max(0, rarityScale.indexOf(original.rarity) - 1)];
  }

  return {
    ...original,
    id: `${original.id}_copy_${Date.now()}`,
    name: `${original.displayName} Blueprint Copy`,
    isOriginal: false,
    isCopy: true,
    blueprintKind: "copy",
    maxRuns: runs,
    currentRuns: runs,
    remainingRuns: runs,
    quality,
    rarity: copyRarity,
    color: rarityColors[copyRarity],
    status: "active",
  };
}

export function completeManufacturingJob(job: ProductionJob, blueprint: Blueprint): ProductionJob {
  const wasSuccessful = Math.random() * 100 <= blueprint.baseSuccessRate;
  return {
    ...job,
    status: wasSuccessful ? "completed" : "failed",
    wasSuccessful,
    progress: 100,
    outputQuantity: wasSuccessful ? job.quantity * blueprint.outputQuantity : 0,
    failureReason: wasSuccessful ? undefined : "Manufacturing failed due to process issues",
  };
}
