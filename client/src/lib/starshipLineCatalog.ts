export interface ShipyardCategoryRequirements {
  shipyardLevel: number;
  researchTotal: number;
}

export interface ShipyardCategorySystem {
  id: string;
  name: string;
  doctrine: string;
  description: string;
  icon: "fighter" | "frigate" | "destroyer" | "cruiser" | "battleship" | "carrier" | "support";
  order: number;
  requirements: ShipyardCategoryRequirements;
}

export interface StarshipBlueprintRequirements {
  categoryId: string;
  shipyardLevel: number;
  categoryLevel: number;
  kardashevLevel: number;
}

export interface StarshipLineBlueprint {
  id: string;
  categoryId: string;
  categoryName: string;
  hullClass: string;
  role: string;
  sequence: number;
  name: string;
  description: string;
  doctrine: string;
  stats: {
    hull: number;
    shields: number;
    firepower: number;
    cargo: number;
    speed: number;
  };
  requirements: StarshipBlueprintRequirements;
}

export interface ShipyardCategoryUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentBonus: number;
  nextBonus: number;
}

export interface StarshipBlueprintUpgradeSnapshot {
  maxLevel: number;
  buildTimeSeconds: number;
  cost: { metal: number; crystal: number; deuterium: number };
  currentHullBonus: number;
  nextHullBonus: number;
  currentFirepowerBonus: number;
  nextFirepowerBonus: number;
}

type CategorySeed = {
  id: string;
  name: string;
  doctrine: string;
  description: string;
  icon: ShipyardCategorySystem["icon"];
  hullClass: string;
  role: string;
  variants: string[];
};

const CATEGORY_SEEDS: CategorySeed[] = [
  { id: "corvette-patrols", name: "Corvette Patrols", doctrine: "Starter patrol flotillas hold lanes and train crews into real command structures.", description: "Entry hulls that adapt rookie escort doctrine into imperial patrol service.", icon: "fighter", hullClass: "Corvette", role: "Patrol", variants: ["Needle Patrol Corvette", "Sentinel Patrol Corvette", "Warden Patrol Corvette"] },
  { id: "frigate-command", name: "Frigate Command", doctrine: "Flexible frontline frigates define early war lines and expedition security.", description: "General frigate tracks for screening, skirmish response, and disciplined fleet movement.", icon: "frigate", hullClass: "Frigate", role: "Line Frigate", variants: ["Lancer Command Frigate", "Bulwark Command Frigate", "Sovereign Command Frigate"] },
  { id: "assault-frigates", name: "Assault Frigates", doctrine: "Compact warships trade utility for pressure, resilience, and close combat impact.", description: "Heavier frigate doctrines tuned for direct fights, hard tackles, and breach actions.", icon: "frigate", hullClass: "Assault Frigate", role: "Assault", variants: ["Raptor Assault Frigate", "Bastion Assault Frigate", "Revenant Assault Frigate"] },
  { id: "logistics-frigates", name: "Logistics Frigates", doctrine: "Fast repair hulls keep light wings alive before cruiser logistics come online.", description: "Support frigates that project triage beams, shield packets, and fleet sustain.", icon: "frigate", hullClass: "Logistics Frigate", role: "Field Support", variants: ["Mercy Logistics Frigate", "Safeguard Logistics Frigate", "Halo Logistics Frigate"] },
  { id: "covert-exploration", name: "Covert Exploration Wings", doctrine: "Survey first, infiltrate second, strike only when the map is ours.", description: "Exploration and covert-ops inspired frigates for probes, cloaks, and data recovery.", icon: "fighter", hullClass: "Covert Frigate", role: "Exploration", variants: ["Pathseer Covert Frigate", "Ghostchart Covert Frigate", "Nightscan Covert Frigate"] },
  { id: "stealth-bombers", name: "Stealth Bomber Wings", doctrine: "Disappear into dark vectors, break capitals, vanish before response fleets align.", description: "Cloaked strike frigates specialized in torpedo ambushes and infrastructure raids.", icon: "fighter", hullClass: "Stealth Bomber", role: "Ambush", variants: ["Shade Bomber", "Voidspike Bomber", "Eclipse Bomber"] },
  { id: "interceptor-wings", name: "Interceptor Wings", doctrine: "Nothing escapes a fleet that owns the first lock and the last orbit.", description: "Ultra-fast tacklers and screen breakers patterned after elite interceptor doctrines.", icon: "fighter", hullClass: "Interceptor", role: "Tackle", variants: ["Skyknife Interceptor", "Aegis Interceptor", "Starlance Interceptor"] },
  { id: "destroyer-command", name: "Destroyer Command", doctrine: "Destroyers turn frigate skirmishes into kill zones with anti-screen dominance.", description: "Primary destroyer command tracks for anti-fighter batteries and line breaking.", icon: "destroyer", hullClass: "Destroyer", role: "Screen Breaker", variants: ["Hammerfall Destroyer", "Dominion Destroyer", "Vigil Destroyer"] },
  { id: "tactical-command-destroyers", name: "Tactical Command Destroyers", doctrine: "Micro-jumps and formation control let smaller fleets seize tempo from larger ones.", description: "Experimental destroyers that reposition formations and puncture enemy timing.", icon: "destroyer", hullClass: "Tactical Destroyer", role: "Control", variants: ["Vector Command Destroyer", "Shunt Command Destroyer", "Pivot Command Destroyer"] },
  { id: "interdictor-screens", name: "Interdictor Screens", doctrine: "Trap the grid, deny escape, and make every wrong warp fatal.", description: "Destroyer-grade interdiction hulls for bubble deployment and pursuit denial.", icon: "destroyer", hullClass: "Interdictor", role: "Interdiction", variants: ["Snare Interdictor", "Lockweb Interdictor", "Eventide Interdictor"] },
  { id: "cruiser-command", name: "Cruiser Command", doctrine: "Cruisers hold the center of doctrine, endurance, and adaptable fleet output.", description: "Baseline command cruiser families for broad campaign duty and line leadership.", icon: "cruiser", hullClass: "Cruiser", role: "Command Cruiser", variants: ["Meridian Cruiser", "Peregrine Cruiser", "Sovereign Cruiser"] },
  { id: "heavy-assault-cruisers", name: "Heavy Assault Cruisers", doctrine: "Push elite cruiser mass into the fight where line ships would buckle.", description: "Advanced assault cruiser formations built for pressure, shock, and staying power.", icon: "cruiser", hullClass: "Heavy Assault Cruiser", role: "Heavy Assault", variants: ["Glaive Assault Cruiser", "Citadel Assault Cruiser", "Ironveil Assault Cruiser"] },
  { id: "recon-cruisers", name: "Recon Cruisers", doctrine: "Win the fight before first volley by owning signal, range, and confusion.", description: "Electronic warfare and cloaked scouting cruisers for intel-driven engagements.", icon: "cruiser", hullClass: "Recon Cruiser", role: "Recon", variants: ["Oracle Recon Cruiser", "Ghostline Recon Cruiser", "Nullveil Recon Cruiser"] },
  { id: "logistics-cruisers", name: "Logistics Cruisers", doctrine: "Major fleets survive because their logistics crews remain one cycle ahead of collapse.", description: "Heavy support cruisers delivering shield, armor, and capacitor sustain.", icon: "cruiser", hullClass: "Logistics Cruiser", role: "Fleet Sustain", variants: ["Aurelia Logistics Cruiser", "Bulwark Logistics Cruiser", "Cathedral Logistics Cruiser"] },
  { id: "strategic-cruisers", name: "Strategic Cruisers", doctrine: "Modular hulls let one command track answer many wars.", description: "Adaptive cruiser systems with configurable mission packages and specialist cores.", icon: "cruiser", hullClass: "Strategic Cruiser", role: "Modular", variants: ["Chimera Strategic Cruiser", "Labyrinth Strategic Cruiser", "Paragon Strategic Cruiser"] },
  { id: "battlecruiser-command", name: "Battlecruiser Command", doctrine: "Battlecruisers bridge mass and aggression where cruisers stop and battleships slow.", description: "Mainline battlecruisers for heavy response groups and regional fleet anchors.", icon: "cruiser", hullClass: "Battlecruiser", role: "Heavy Line", variants: ["Halberd Battlecruiser", "Vanguard Battlecruiser", "Crownbreaker Battlecruiser"] },
  { id: "command-ships", name: "Command Ships", doctrine: "Doctrine bonuses turn good fleets into coordinated, terrifying machinery.", description: "Flag command hulls built around aura bursts, command uplinks, and warfare boosts.", icon: "cruiser", hullClass: "Command Ship", role: "Fleet Command", variants: ["Throne Command Ship", "Marshal Command Ship", "Imperium Command Ship"] },
  { id: "battleship-command", name: "Battleship Command", doctrine: "Battleships define decisive engagements through range, tank, and brutal stability.", description: "Core battleship command families for late-game line warfare.", icon: "battleship", hullClass: "Battleship", role: "Line Battleship", variants: ["Paladin Battleship", "Leviathan Battleship", "Dominus Battleship"] },
  { id: "marauder-commands", name: "Marauder Commands", doctrine: "Siege-fit battleships grind down targets that ordinary lines merely threaten.", description: "Elite bastion battleships with concentrated damage and self-contained staying power.", icon: "battleship", hullClass: "Marauder", role: "Bastion Siege", variants: ["Bastion Marauder", "Apex Marauder", "Judicator Marauder"] },
  { id: "black-ops-wings", name: "Black Ops Wings", doctrine: "Secret wars demand battleships that move through shadows, not parades.", description: "Covert battleship command for clandestine fleets, bridge insertion, and precision hunts.", icon: "battleship", hullClass: "Black Ops Battleship", role: "Covert Capital", variants: ["Nightbridge Black Ops", "Phantom Black Ops", "Oblivion Black Ops"] },
  { id: "industrial-haulers", name: "Industrial Haulers", doctrine: "Wars are won by the hulls that keep ore, munitions, and food moving.", description: "Standard industrial starships for freight, service, and colony support.", icon: "support", hullClass: "Industrial", role: "Hauler", variants: ["Merchant Hauler", "Prospector Hauler", "Frontier Hauler"] },
  { id: "blockade-runners", name: "Blockade Runners", doctrine: "Profit survives where brute cargo dies.", description: "High-speed covert transports for dangerous routes, data lanes, and precious cargo.", icon: "support", hullClass: "Blockade Runner", role: "Smuggler Transport", variants: ["Needler Blockade Runner", "Shade Blockade Runner", "Whisper Blockade Runner"] },
  { id: "deep-space-transports", name: "Deep Space Transports", doctrine: "Protected logistics keeps empires supplied in hostile constellations.", description: "Defended heavy transports for rough campaign routes and contested markets.", icon: "support", hullClass: "Deep Space Transport", role: "Armored Freight", variants: ["Bastion Transport", "Citadel Transport", "Atlas Transport"] },
  { id: "mining-barges", name: "Mining Barges", doctrine: "Industrial command starts with extracting enough mass to matter.", description: "Bulk extraction platforms for asteroid fields, moons, and frontier resource belts.", icon: "support", hullClass: "Mining Barge", role: "Extraction", variants: ["Deepcore Barge", "Stripline Barge", "Aurora Barge"] },
  { id: "exhumers", name: "Exhumers", doctrine: "Refined extraction turns frontier belts into imperial megaproject fuel.", description: "Elite resource harvesters built around premium yield, survivability, and control suites.", icon: "support", hullClass: "Exhumer", role: "Advanced Extraction", variants: ["Nova Exhumer", "Radiant Exhumer", "Sunvein Exhumer"] },
  { id: "freighter-command", name: "Freighter Command", doctrine: "Empire-scale commerce depends on absurd cargo volume more than elegance.", description: "Bulk strategic freighters for core logistics, construction stock, and war reserve movement.", icon: "support", hullClass: "Freighter", role: "Bulk Freight", variants: ["Atlas Freighter", "Monarch Freighter", "Citadel Freighter"] },
  { id: "jump-freighters", name: "Jump Freighters", doctrine: "Strategic logistics bends distance until supply becomes a weapon.", description: "FTL freight hulls that move high-value cargo through dangerous distances.", icon: "support", hullClass: "Jump Freighter", role: "Strategic Freight", variants: ["Starbridge Jump Freighter", "Longhaul Jump Freighter"] },
  { id: "industrial-command-ships", name: "Industrial Command Ships", doctrine: "Mining empires need command hulls that multiply every extractor in the belt.", description: "Industrial support capitals coordinating miners, barges, and refinery field teams.", icon: "support", hullClass: "Industrial Command Ship", role: "Industrial Command", variants: ["Orison Command Ship", "Foundry Command Ship"] },
  { id: "dreadnought-sieges", name: "Dreadnought Sieges", doctrine: "Capitals exist to break citadels, stations, and worlds that refuse surrender.", description: "Siege capitals focused on anti-structure bombardment and apex gun platforms.", icon: "battleship", hullClass: "Dreadnought", role: "Siege Capital", variants: ["Dominion Dreadnought", "Anvil Dreadnought"] },
  { id: "carrier-groups", name: "Carrier Groups", doctrine: "Fighter projection rewrites every battle radius in the theater.", description: "Capital carriers that project strike wings, support drones, and remote pressure.", icon: "carrier", hullClass: "Carrier", role: "Strike Projection", variants: ["Atlas Carrier", "Ark Carrier"] },
  { id: "force-auxiliary-corps", name: "Force Auxiliary Corps", doctrine: "When capitals bleed, force auxiliaries decide which side still has a fleet.", description: "Dedicated capital logistics hulls for triage, repair webs, and recovery control.", icon: "carrier", hullClass: "Force Auxiliary", role: "Capital Logistics", variants: ["Sanctuary Auxiliary", "Aegis Auxiliary"] },
  { id: "apex-capital-command", name: "Apex Capital Command", doctrine: "Supercarriers and titans exist to embody empire-scale supremacy, terror, and final escalation.", description: "The apex starship command ladder merging supercarrier projection and titan authority.", icon: "carrier", hullClass: "Supercapital", role: "Apex Command", variants: ["Eminence Supercarrier", "Omnistar Titan"] },
];

export const SHIPYARD_CATEGORY_SYSTEMS: ShipyardCategorySystem[] = CATEGORY_SEEDS.map((entry, index) => ({
  id: `shipyard-category-${entry.id}`,
  name: entry.name,
  doctrine: entry.doctrine,
  description: entry.description,
  icon: entry.icon,
  order: index + 1,
  requirements: {
    shipyardLevel: 1 + Math.floor(index / 3),
    researchTotal: Math.max(0, index * 3),
  },
}));

const CATEGORY_INDEX = new Map(CATEGORY_SEEDS.map((entry) => [`shipyard-category-${entry.id}`, entry]));

export const STARSHIP_LINE_BLUEPRINTS: StarshipLineBlueprint[] = SHIPYARD_CATEGORY_SYSTEMS.flatMap((category, index) => {
  const seed = CATEGORY_INDEX.get(category.id)!;
  return seed.variants.map((variant, variantIndex) => {
    const sequence = variantIndex + 1;
    const powerBase = 220 + index * 38 + variantIndex * 34;
    const capitalWeight = category.icon === "carrier" ? 2.1 : category.icon === "battleship" ? 1.72 : category.icon === "cruiser" ? 1.38 : category.icon === "destroyer" ? 1.16 : 1;
    const logisticsWeight = category.icon === "support" ? 1.45 : 1;

    return {
      id: `${category.id}-${String(sequence).padStart(2, "0")}`,
      categoryId: category.id,
      categoryName: category.name,
      hullClass: seed.hullClass,
      role: seed.role,
      sequence,
      name: variant,
      description: `${variant} belongs to ${category.name}, a Spaceship Command-inspired doctrine line redesigned for Stellar Dominion around ${category.doctrine.toLowerCase()}`,
      doctrine: category.doctrine,
      stats: {
        hull: Math.floor((920 + powerBase * 7.4) * capitalWeight),
        shields: Math.floor((160 + powerBase * 1.9) * capitalWeight),
        firepower: Math.floor((150 + powerBase * 2.8) * (category.icon === "support" ? 0.82 : capitalWeight)),
        cargo: Math.floor((520 + powerBase * 3.5) * logisticsWeight * (category.icon === "carrier" ? 1.25 : 1)),
        speed: Math.max(22, Math.floor(180 - index * 2.4 - variantIndex * 5 - (category.icon === "battleship" ? 18 : category.icon === "carrier" ? 26 : 0))),
      },
      requirements: {
        categoryId: category.id,
        shipyardLevel: category.requirements.shipyardLevel + variantIndex,
        categoryLevel: Math.max(1, variantIndex + Math.floor(index / 8)),
        kardashevLevel: Math.min(6, 1 + Math.floor(index / 6)),
      },
    };
  });
});

export const STARSHIP_LINE_COUNTS = {
  categories: SHIPYARD_CATEGORY_SYSTEMS.length,
  blueprints: STARSHIP_LINE_BLUEPRINTS.length,
};

export function getStarshipBlueprintsByCategory(categoryId: string): StarshipLineBlueprint[] {
  return STARSHIP_LINE_BLUEPRINTS.filter((blueprint) => blueprint.categoryId === categoryId);
}

export function getShipyardCategoryUpgradeSnapshot(category: ShipyardCategorySystem, level: number): ShipyardCategoryUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  return {
    maxLevel: 12,
    buildTimeSeconds: Math.floor((36 + category.order * 3) * (1 + safeLevel * 0.18)),
    cost: {
      metal: Math.floor((180 + category.order * 24) * Math.pow(1.42, safeLevel)),
      crystal: Math.floor((120 + category.order * 18) * Math.pow(1.38, safeLevel)),
      deuterium: Math.floor((90 + category.order * 14) * Math.pow(1.34, safeLevel)),
    },
    currentBonus: safeLevel * (2 + Math.floor(category.order / 6)),
    nextBonus: (safeLevel + 1) * (2 + Math.floor(category.order / 6)),
  };
}

export function getStarshipBlueprintUpgradeSnapshot(blueprint: StarshipLineBlueprint, level: number): StarshipBlueprintUpgradeSnapshot {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const powerBand = 1 + blueprint.sequence * 0.22 + blueprint.requirements.kardashevLevel * 0.08;

  return {
    maxLevel: 8,
    buildTimeSeconds: Math.floor((28 + blueprint.requirements.shipyardLevel * 5 + blueprint.sequence * 3) * (1 + safeLevel * 0.14)),
    cost: {
      metal: Math.floor((220 * powerBand + blueprint.stats.hull * 0.08) * Math.pow(1.32, safeLevel)),
      crystal: Math.floor((160 * powerBand + blueprint.stats.shields * 0.2) * Math.pow(1.3, safeLevel)),
      deuterium: Math.floor((120 * powerBand + blueprint.stats.firepower * 0.16) * Math.pow(1.28, safeLevel)),
    },
    currentHullBonus: safeLevel * (3 + blueprint.sequence),
    nextHullBonus: (safeLevel + 1) * (3 + blueprint.sequence),
    currentFirepowerBonus: safeLevel * (4 + blueprint.requirements.kardashevLevel),
    nextFirepowerBonus: (safeLevel + 1) * (4 + blueprint.requirements.kardashevLevel),
  };
}
