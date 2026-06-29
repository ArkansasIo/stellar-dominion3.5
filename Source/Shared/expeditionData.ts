/**
 * Expedition System Catalog Data
 *
 * Contains:
 *  – 18 expedition categories
 *  – 32 sub-categories (2 each for the first 16 categories)
 *  – 7 expedition types with 5 sub-types each
 *  – 99 expedition tiers (with tier classes, sub-classes, ranks, titles,
 *    stats, sub-stats, descriptions, sub-descriptions, attributes,
 *    sub-attributes, and subjects)
 *  – 999 expedition levels
 */

import type {
  ExpeditionCategory,
  ExpeditionType,
  ExpeditionTier,
  ExpeditionLevel,
  TierClass,
  ExpeditionStats,
  ExpeditionAttributes,
  ExpeditionSubject,
} from "./types/expeditions";

// ─── Helper constants ─────────────────────────────────────────────────────────

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
  6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
};

// ─── 18 Expedition Categories (16 with 2 sub-categories each = 32 total) ─────

export const EXPEDITION_CATEGORIES: ExpeditionCategory[] = [
  {
    id: "stellar-exploration",
    name: "Stellar Exploration",
    description: "Chart unexplored star systems and catalogue celestial phenomena.",
    subDescription: "Expeditions that push the boundaries of the known galaxy, mapping stars, nebulae, and stellar nurseries.",
    icon: "star",
    subCategories: [
      { id: "stellar-cartography", categoryId: "stellar-exploration", name: "Stellar Cartography", description: "Precise mapping of star positions and gravitational fields.", subDescription: "Creates navigational charts used by all subsequent fleets in the region.", availableTypes: ["exploration", "scientific"] },
      { id: "star-system-survey", categoryId: "stellar-exploration", name: "Star System Survey", description: "Detailed survey of planetary bodies orbiting a target star.", subDescription: "Identifies habitable zones, resource deposits, and strategic positions.", availableTypes: ["exploration", "scientific", "trade"] },
    ],
  },
  {
    id: "planetary-conquest",
    name: "Planetary Conquest",
    description: "Seize control of inhabited or uninhabited worlds.",
    subDescription: "Full military campaigns targeting planetary surfaces, involving ground troops and orbital support.",
    icon: "globe",
    subCategories: [
      { id: "ground-assault", categoryId: "planetary-conquest", name: "Ground Assault", description: "Coordinated infantry and armour assault on a planetary surface.", subDescription: "Requires a large troop contingent and orbital fire-support to succeed.", availableTypes: ["military", "conquest"] },
      { id: "orbital-bombardment", categoryId: "planetary-conquest", name: "Orbital Bombardment", description: "Fleet-based bombardment to weaken enemy planetary defences.", subDescription: "Precedes ground assaults and reduces enemy fortification rating by up to 60%.", availableTypes: ["military", "conquest"] },
    ],
  },
  {
    id: "asteroid-mining",
    name: "Asteroid Mining",
    description: "Extract precious metals, crystals, and deuterium from asteroid belts.",
    subDescription: "Industrial expeditions deploying automated drilling rigs and mining corvettes.",
    icon: "pickaxe",
    subCategories: [
      { id: "core-drilling", categoryId: "asteroid-mining", name: "Core Drilling", description: "Deep-core extraction from metal-rich asteroids.", subDescription: "Yields large amounts of metal with moderate deuterium consumption.", availableTypes: ["trade", "exploration"] },
      { id: "belt-survey", categoryId: "asteroid-mining", name: "Belt Survey", description: "Rapid cataloguing of asteroid density, composition, and hazard level.", subDescription: "Produces a survey report that boosts subsequent mining yields by 25%.", availableTypes: ["exploration", "scientific"] },
    ],
  },
  {
    id: "nebula-mapping",
    name: "Nebula Mapping",
    description: "Navigate and analyse the complex particle clouds of interstellar nebulae.",
    subDescription: "Dangerous but rewarding expeditions through high-density gas and plasma regions.",
    icon: "cloud",
    subCategories: [
      { id: "particle-analysis", categoryId: "nebula-mapping", name: "Particle Analysis", description: "Collect and analyse exotic particles suspended in nebular gas clouds.", subDescription: "Particles may unlock advanced research technologies when delivered to a research lab.", availableTypes: ["scientific", "exploration"] },
      { id: "navigation-charting", categoryId: "nebula-mapping", name: "Navigation Charting", description: "Establish safe transit corridors through hazardous nebular fields.", subDescription: "Reduces travel time through nebulae by 40% for all future fleets.", availableTypes: ["exploration", "trade"] },
    ],
  },
  {
    id: "wormhole-reconnaissance",
    name: "Wormhole Reconnaissance",
    description: "Probe unstable wormholes and assess feasibility of long-range transit.",
    subDescription: "High-risk missions that can open permanent wormhole highways or trigger collapse events.",
    icon: "zap",
    subCategories: [
      { id: "wormhole-stabilization", categoryId: "wormhole-reconnaissance", name: "Wormhole Stabilization", description: "Deploy stabiliser beacons to keep a transient wormhole open for fleet transit.", subDescription: "Requires advanced wormhole-tech research to attempt.", availableTypes: ["scientific", "military", "exploration"] },
      { id: "transit-probing", categoryId: "wormhole-reconnaissance", name: "Transit Probing", description: "Send unmanned probes through a wormhole to determine exit coordinates.", subDescription: "Provides destination data before committing a full fleet.", availableTypes: ["exploration", "scientific"] },
    ],
  },
  {
    id: "alien-artifact-recovery",
    name: "Alien Artifact Recovery",
    description: "Locate and secure artefacts left by ancient or alien civilisations.",
    subDescription: "Covert excavations at ruins and debris sites with potentially powerful rewards.",
    icon: "gem",
    subCategories: [
      { id: "ancient-site-excavation", categoryId: "alien-artifact-recovery", name: "Ancient Site Excavation", description: "Systematic archaeological dig at a known or suspected ruins site.", subDescription: "Risk of triggering automated defence systems dormant for millennia.", availableTypes: ["scientific", "military", "exploration"] },
      { id: "artifact-analysis", categoryId: "alien-artifact-recovery", name: "Artifact Analysis", description: "On-site analysis and documentation of recovered alien technology.", subDescription: "May unlock unique research paths unavailable through conventional means.", availableTypes: ["scientific"] },
    ],
  },
  {
    id: "deep-space-survey",
    name: "Deep Space Survey",
    description: "Long-range missions to regions beyond current star-chart boundaries.",
    subDescription: "Extended expeditions requiring significant logistical support and fuel reserves.",
    icon: "telescope",
    subCategories: [
      { id: "long-range-probe-deployment", categoryId: "deep-space-survey", name: "Long-Range Probe Deployment", description: "Launch autonomous probes into uncharted deep space and retrieve their data.", subDescription: "Probes transmit for up to 48 in-game hours before requiring retrieval.", availableTypes: ["exploration", "scientific"] },
      { id: "signal-triangulation", categoryId: "deep-space-survey", name: "Signal Triangulation", description: "Use multiple relay ships to triangulate the origin of anomalous deep-space signals.", subDescription: "May reveal derelict ships, distress beacons, or hostile installations.", availableTypes: ["exploration", "military"] },
    ],
  },
  {
    id: "colony-establishment",
    name: "Colony Establishment",
    description: "Found new outposts and colonial settlements on discovered worlds.",
    subDescription: "Long-term investment missions that expand your empire's resource base and population.",
    icon: "home",
    subCategories: [
      { id: "pioneer-settlement", categoryId: "colony-establishment", name: "Pioneer Settlement", description: "Transport and settle the first wave of colonists on a virgin world.", subDescription: "Colony produces basic resources within 10 in-game days of founding.", availableTypes: ["trade", "exploration"] },
      { id: "terraforming-operations", categoryId: "colony-establishment", name: "Terraforming Operations", description: "Deploy atmospheric processors and biosphere seeders to make a world habitable.", subDescription: "Increases colony population cap by 300% when fully completed.", availableTypes: ["scientific", "trade"] },
    ],
  },
  {
    id: "military-incursion",
    name: "Military Incursion",
    description: "Offensive fleet actions against enemy territories and installations.",
    subDescription: "High-intensity combat operations designed to degrade enemy capabilities.",
    icon: "shield",
    subCategories: [
      { id: "rapid-strike", categoryId: "military-incursion", name: "Rapid Strike", description: "Fast, concentrated attack on a single high-value target.", subDescription: "Lower casualties but limited ability to hold captured positions.", availableTypes: ["military", "conquest"] },
      { id: "siege-operations", categoryId: "military-incursion", name: "Siege Operations", description: "Sustained blockade and bombardment to force a defended world to capitulate.", subDescription: "Takes longer but results in total surrender and annexation.", availableTypes: ["military", "conquest"] },
    ],
  },
  {
    id: "scientific-research",
    name: "Scientific Research",
    description: "In-field scientific expeditions to gather empirical data from the cosmos.",
    subDescription: "Research-focused missions that feed data back to your empire's laboratories.",
    icon: "flask",
    subCategories: [
      { id: "atmospheric-study", categoryId: "scientific-research", name: "Atmospheric Study", description: "Measure atmospheric composition, weather patterns, and storm activity on target worlds.", subDescription: "Informs terraforming blueprints and atmospheric-weapon research.", availableTypes: ["scientific"] },
      { id: "cosmic-phenomenon-analysis", categoryId: "scientific-research", name: "Cosmic Phenomenon Analysis", description: "Document and analyse rare cosmic events such as pulsars, magnetars, and gamma-ray bursts.", subDescription: "Yields breakthrough research bonuses when a rare phenomenon is observed.", availableTypes: ["scientific", "exploration"] },
    ],
  },
  {
    id: "diplomatic-mission",
    name: "Diplomatic Mission",
    description: "Forge alliances, negotiate treaties, and build influence across star systems.",
    subDescription: "Non-combat missions with high diplomatic rewards but vulnerability to ambush.",
    icon: "handshake",
    subCategories: [
      { id: "first-contact", categoryId: "diplomatic-mission", name: "First Contact", description: "Establish initial communication with a newly discovered civilisation.", subDescription: "Outcome depends on approach: peaceful (trade bonus) or aggressive (war penalty).", availableTypes: ["diplomatic", "exploration"] },
      { id: "treaty-negotiation", categoryId: "diplomatic-mission", name: "Treaty Negotiation", description: "Formal summit to negotiate non-aggression, trade, or mutual-defence pacts.", subDescription: "Successful treaties reduce inter-faction conflict probability for 30 days.", availableTypes: ["diplomatic", "trade"] },
    ],
  },
  {
    id: "trade-route-establishment",
    name: "Trade Route Establishment",
    description: "Open and secure profitable inter-system commercial routes.",
    subDescription: "Economic missions that generate passive resource income once routes are active.",
    icon: "coins",
    subCategories: [
      { id: "merchant-convoy", categoryId: "trade-route-establishment", name: "Merchant Convoy", description: "Escort a convoy of merchant vessels along a newly mapped route.", subDescription: "Establishes a permanent trade lane generating 5% passive income per cycle.", availableTypes: ["trade", "diplomatic"] },
      { id: "market-scouting", categoryId: "trade-route-establishment", name: "Market Scouting", description: "Survey local economies to identify high-demand commodities and pricing opportunities.", subDescription: "Increases trade profit margins by 20% for 7 in-game days after completion.", availableTypes: ["trade", "exploration"] },
    ],
  },
  {
    id: "pirate-suppression",
    name: "Pirate Suppression",
    description: "Hunt down and eliminate organised piracy threatening your trade lanes.",
    subDescription: "Law-enforcement operations that improve security ratings across controlled systems.",
    icon: "skull",
    subCategories: [
      { id: "patrol-operation", categoryId: "pirate-suppression", name: "Patrol Operation", description: "Regular armed patrol of high-risk shipping corridors to deter raider activity.", subDescription: "Reduces pirate encounter rate in patrolled zones by 50% for 14 days.", availableTypes: ["military", "trade"] },
      { id: "bounty-hunting", categoryId: "pirate-suppression", name: "Bounty Hunting", description: "Track and capture or eliminate specific notorious pirate captains.", subDescription: "Rewards include rare loot drops and significant reputation gains.", availableTypes: ["military"] },
    ],
  },
  {
    id: "fleet-patrol",
    name: "Fleet Patrol",
    description: "Routine patrol missions to maintain a visible military presence across territories.",
    subDescription: "Defensive posture operations that deter aggression and gather intelligence passively.",
    icon: "radar",
    subCategories: [
      { id: "border-surveillance", categoryId: "fleet-patrol", name: "Border Surveillance", description: "Systematic sweep of border systems to detect incoming threats.", subDescription: "Provides 6-hour advance warning of any incoming enemy fleet.", availableTypes: ["military", "exploration"] },
      { id: "escort-duty", categoryId: "fleet-patrol", name: "Escort Duty", description: "Protect high-value assets such as colony ships, research vessels, or diplomats.", subDescription: "Failure results in the loss of the escorted asset; success grants prestige.", availableTypes: ["military", "diplomatic"] },
    ],
  },
  {
    id: "resource-extraction",
    name: "Resource Extraction",
    description: "Large-scale extraction of raw materials from uninhabited systems.",
    subDescription: "Industrial operations that dramatically boost resource income for a limited duration.",
    icon: "mining",
    subCategories: [
      { id: "mineral-harvesting", categoryId: "resource-extraction", name: "Mineral Harvesting", description: "Mass deployment of mining fleets to strip-mine a target body.", subDescription: "Yields up to 50,000 metal and 20,000 crystal per completed operation.", availableTypes: ["trade", "exploration"] },
      { id: "energy-collection", categoryId: "resource-extraction", name: "Energy Collection", description: "Place collection arrays at stellar energy-rich zones such as near a magnetar.", subDescription: "Provides a persistent +25% energy generation bonus to the owning system.", availableTypes: ["scientific", "trade"] },
    ],
  },
  {
    id: "emergency-response",
    name: "Emergency Response",
    description: "Rapid-response missions to natural disasters, distress calls, and crises.",
    subDescription: "Humanitarian and defensive operations with significant diplomatic and morale rewards.",
    icon: "alert",
    subCategories: [
      { id: "rescue-mission", categoryId: "emergency-response", name: "Rescue Mission", description: "Extract survivors from a disaster zone, derelict vessel, or occupied territory.", subDescription: "Rescued population contributes to colony growth upon return.", availableTypes: ["diplomatic", "military"] },
      { id: "disaster-relief", categoryId: "emergency-response", name: "Disaster Relief", description: "Deliver vital supplies and medical aid to colonies struck by disaster.", subDescription: "Restores colony stability and boosts loyalty ratings.", availableTypes: ["diplomatic", "trade"] },
    ],
  },
  {
    id: "black-hole-investigation",
    name: "Black Hole Investigation",
    description: "Study the gravitational and radiative properties of stellar black holes.",
    subDescription: "Extreme-environment missions requiring heavily shielded vessels and elite crews.",
    icon: "circle-dot",
    subCategories: [],
  },
  {
    id: "void-anomaly-study",
    name: "Void Anomaly Study",
    description: "Classify and investigate dimensional anomalies and voidspace rifts.",
    subDescription: "The most dangerous and least understood expedition category; potential for extraordinary rewards.",
    icon: "infinity",
    subCategories: [],
  },
];

// ─── 7 Expedition Types with 5 Sub-types each ────────────────────────────────

export const EXPEDITION_TYPES: ExpeditionType[] = [
  {
    id: "exploration",
    name: "Exploration",
    description: "Chart the unknown and expand your empire's knowledge base.",
    subDescription: "Prioritises sensor range, speed, and data-gathering over combat capability.",
    icon: "compass",
    subTypes: [
      { id: "deep-survey", typeId: "exploration", name: "Deep Survey", description: "Extended-range survey into uncharted space.", subDescription: "Maximises data return but requires long deployment.", bonusMultiplier: 1.3 },
      { id: "quick-scan", typeId: "exploration", name: "Quick Scan", description: "Rapid in-and-out scan of a target zone.", subDescription: "Faster but lower data quality.", bonusMultiplier: 0.8 },
      { id: "anomaly-chase", typeId: "exploration", name: "Anomaly Chase", description: "Target and investigate a known anomaly signature.", subDescription: "High variance: big reward or catastrophic failure.", bonusMultiplier: 1.6 },
      { id: "probe-relay", typeId: "exploration", name: "Probe Relay", description: "Establish a network of relay probes for persistent coverage.", subDescription: "Provides ongoing intel after mission completes.", bonusMultiplier: 1.1 },
      { id: "celestial-census", typeId: "exploration", name: "Celestial Census", description: "Systematic enumeration of all bodies in a star system.", subDescription: "Foundational data for colonisation planning.", bonusMultiplier: 1.0 },
    ],
  },
  {
    id: "military",
    name: "Military",
    description: "Project power through armed force against hostile targets.",
    subDescription: "Optimises fleet attack rating, troop morale, and combat resilience.",
    icon: "shield",
    subTypes: [
      { id: "strike-force", typeId: "military", name: "Strike Force", description: "Fast-moving offensive unit targeting a single objective.", subDescription: "High damage, low staying power.", bonusMultiplier: 1.4 },
      { id: "siege-group", typeId: "military", name: "Siege Group", description: "Heavy fleet configuration for sustained offensive operations.", subDescription: "Slow but overwhelming force; ideal for fortified positions.", bonusMultiplier: 1.2 },
      { id: "recon-in-force", typeId: "military", name: "Recon-in-Force", description: "Armed reconnaissance that engages targets of opportunity.", subDescription: "Balanced combat and intelligence gathering.", bonusMultiplier: 1.0 },
      { id: "rapid-reaction", typeId: "military", name: "Rapid Reaction", description: "Quick-response force for emergency reinforcement.", subDescription: "Reduces response time by 50% at the cost of heavy equipment.", bonusMultiplier: 0.9 },
      { id: "shock-assault", typeId: "military", name: "Shock Assault", description: "Overwhelming initial strike designed to break enemy morale.", subDescription: "Very high casualties but near-certain early-phase victory.", bonusMultiplier: 1.5 },
    ],
  },
  {
    id: "scientific",
    name: "Scientific",
    description: "Advance your empire's technological knowledge through field research.",
    subDescription: "Yields research points, technology bonuses, and rare data packages.",
    icon: "flask",
    subTypes: [
      { id: "field-lab", typeId: "scientific", name: "Field Lab", description: "Mobile research station operating from a target site.", subDescription: "Best data quality; vulnerable without escort.", bonusMultiplier: 1.4 },
      { id: "sample-collection", typeId: "scientific", name: "Sample Collection", description: "Targeted collection of physical samples from target bodies.", subDescription: "Returns physical artefacts with manufacturing applications.", bonusMultiplier: 1.2 },
      { id: "sensor-array-deployment", typeId: "scientific", name: "Sensor Array Deployment", description: "Place a permanent sensor array at a site of scientific interest.", subDescription: "Provides ongoing data after the expedition returns.", bonusMultiplier: 1.1 },
      { id: "exobiology-survey", typeId: "scientific", name: "Exobiology Survey", description: "Catalogue alien life forms at a biosphere target.", subDescription: "Rare bio-samples can unlock genetic engineering research.", bonusMultiplier: 1.3 },
      { id: "stellar-physics-study", typeId: "scientific", name: "Stellar Physics Study", description: "Study stellar magnetic fields, emission spectra, and plasma dynamics.", subDescription: "Advances energy-generation research tree.", bonusMultiplier: 1.0 },
    ],
  },
  {
    id: "trade",
    name: "Trade",
    description: "Generate economic returns through commercial activity and resource exchange.",
    subDescription: "Focuses on cargo capacity, route security, and negotiation bonuses.",
    icon: "coins",
    subTypes: [
      { id: "bulk-transport", typeId: "trade", name: "Bulk Transport", description: "Move large quantities of raw resources between systems.", subDescription: "High cargo capacity; slow and requires armed escort.", bonusMultiplier: 1.0 },
      { id: "luxury-convoy", typeId: "trade", name: "Luxury Convoy", description: "Transport high-value luxury goods for maximum profit margins.", subDescription: "Small cargo, enormous profit; prime target for pirates.", bonusMultiplier: 1.8 },
      { id: "resource-arbitrage", typeId: "trade", name: "Resource Arbitrage", description: "Exploit price differentials between distant markets.", subDescription: "Requires accurate market intelligence to maximise returns.", bonusMultiplier: 1.5 },
      { id: "supply-run", typeId: "trade", name: "Supply Run", description: "Emergency resupply of a besieged or resource-starved colony.", subDescription: "Low profit but high diplomatic reward.", bonusMultiplier: 0.7 },
      { id: "market-establishment", typeId: "trade", name: "Market Establishment", description: "Found a permanent trading post at a lucrative location.", subDescription: "One-time cost; generates passive income indefinitely.", bonusMultiplier: 1.3 },
    ],
  },
  {
    id: "conquest",
    name: "Conquest",
    description: "Annex enemy or unclaimed systems to expand your territorial control.",
    subDescription: "Long-term campaigns requiring sustained logistical and military commitment.",
    icon: "flag",
    subTypes: [
      { id: "system-annexation", typeId: "conquest", name: "System Annexation", description: "Full military annexation of an entire star system.", subDescription: "Most costly but permanently adds the system to your empire.", bonusMultiplier: 2.0 },
      { id: "resource-seizure", typeId: "conquest", name: "Resource Seizure", description: "Rapid seizure of a resource-rich site without full occupation.", subDescription: "Drains enemy economy; hard to hold long-term.", bonusMultiplier: 1.3 },
      { id: "puppet-installation", typeId: "conquest", name: "Puppet Installation", description: "Install a friendly local leader to control a system without direct occupation.", subDescription: "Cheaper than annexation but the puppet may rebel.", bonusMultiplier: 1.0 },
      { id: "liberation-campaign", typeId: "conquest", name: "Liberation Campaign", description: "Free a system occupied by a hostile empire and claim it yourself.", subDescription: "Grants major diplomacy bonus with freed population.", bonusMultiplier: 1.4 },
      { id: "scorched-earth", typeId: "conquest", name: "Scorched Earth", description: "Deny a contested system to the enemy by stripping its resources.", subDescription: "Destroys value but denies the enemy critical supplies.", bonusMultiplier: 0.6 },
    ],
  },
  {
    id: "diplomatic",
    name: "Diplomatic",
    description: "Project soft power and build inter-faction relationships.",
    subDescription: "Non-combat missions with high influence and alliance rewards.",
    icon: "handshake",
    subTypes: [
      { id: "envoy-dispatch", typeId: "diplomatic", name: "Envoy Dispatch", description: "Send a diplomatic envoy to open formal relations.", subDescription: "Foundation for future trade and alliance agreements.", bonusMultiplier: 1.0 },
      { id: "cultural-exchange", typeId: "diplomatic", name: "Cultural Exchange", description: "Facilitate cultural and knowledge exchange between empires.", subDescription: "Boosts research speed by 10% for both parties.", bonusMultiplier: 1.1 },
      { id: "summit-conference", typeId: "diplomatic", name: "Summit Conference", description: "High-level diplomatic summit at a neutral location.", subDescription: "Can result in formal alliances or end active conflicts.", bonusMultiplier: 1.5 },
      { id: "intelligence-sharing", typeId: "diplomatic", name: "Intelligence Sharing", description: "Exchange classified intelligence with a trusted ally.", subDescription: "Mutual vision-sharing for shared systems.", bonusMultiplier: 1.2 },
      { id: "aid-package", typeId: "diplomatic", name: "Aid Package", description: "Deliver humanitarian or economic aid to a struggling faction.", subDescription: "Creates a long-term diplomatic debt.", bonusMultiplier: 0.8 },
    ],
  },
  {
    id: "emergency",
    name: "Emergency",
    description: "Respond to crises, disasters, and emergency distress calls.",
    subDescription: "Time-critical missions with humanitarian rewards and morale bonuses.",
    icon: "alert-triangle",
    subTypes: [
      { id: "sar-mission", typeId: "emergency", name: "Search and Rescue", description: "Locate and extract personnel from dangerous situations.", subDescription: "Boosts fleet morale upon successful rescue.", bonusMultiplier: 1.0 },
      { id: "hazmat-response", typeId: "emergency", name: "Hazmat Response", description: "Contain and neutralise a toxic or radioactive hazard.", subDescription: "Requires specialised containment vessels.", bonusMultiplier: 0.9 },
      { id: "evacuation-op", typeId: "emergency", name: "Evacuation Operation", description: "Mass evacuation of a colony under imminent threat.", subDescription: "Saves population points for future redeployment.", bonusMultiplier: 1.1 },
      { id: "epidemic-response", typeId: "emergency", name: "Epidemic Response", description: "Deploy medical ships to halt a spreading biological outbreak.", subDescription: "Prevents colony population loss from disease.", bonusMultiplier: 1.0 },
      { id: "infrastructure-repair", typeId: "emergency", name: "Infrastructure Repair", description: "Emergency engineering teams rebuild critical damaged infrastructure.", subDescription: "Restores full production capacity after combat damage.", bonusMultiplier: 0.8 },
    ],
  },
];

// ─── Tier generation helpers ──────────────────────────────────────────────────

const TIER_CLASSES: TierClass[] = [
  "Initiate", "Apprentice", "Scout", "Journeyman", "Adept",
  "Expert", "Master", "Grandmaster", "Elite", "Legendary",
];

const TIER_RANKS: Record<TierClass, string[]> = {
  Initiate:    ["Cadet I", "Cadet II", "Cadet III", "Cadet IV", "Cadet V", "Cadet VI", "Cadet VII", "Cadet VIII", "Cadet IX", "Cadet X"],
  Apprentice:  ["Trainee I", "Trainee II", "Trainee III", "Trainee IV", "Trainee V", "Trainee VI", "Trainee VII", "Trainee VIII", "Trainee IX", "Trainee X"],
  Scout:       ["Scout I", "Scout II", "Scout III", "Scout IV", "Scout V", "Scout VI", "Scout VII", "Scout VIII", "Scout IX", "Scout X"],
  Journeyman:  ["Journeyman I", "Journeyman II", "Journeyman III", "Journeyman IV", "Journeyman V", "Journeyman VI", "Journeyman VII", "Journeyman VIII", "Journeyman IX", "Journeyman X"],
  Adept:       ["Adept I", "Adept II", "Adept III", "Adept IV", "Adept V", "Adept VI", "Adept VII", "Adept VIII", "Adept IX", "Adept X"],
  Expert:      ["Expert I", "Expert II", "Expert III", "Expert IV", "Expert V", "Expert VI", "Expert VII", "Expert VIII", "Expert IX", "Expert X"],
  Master:      ["Master I", "Master II", "Master III", "Master IV", "Master V", "Master VI", "Master VII", "Master VIII", "Master IX", "Master X"],
  Grandmaster: ["Grandmaster I", "Grandmaster II", "Grandmaster III", "Grandmaster IV", "Grandmaster V", "Grandmaster VI", "Grandmaster VII", "Grandmaster VIII", "Grandmaster IX", "Grandmaster X"],
  Elite:       ["Elite I", "Elite II", "Elite III", "Elite IV", "Elite V", "Elite VI", "Elite VII", "Elite VIII", "Elite IX", "Elite X"],
  Legendary:   ["Legendary I", "Legendary II", "Legendary III", "Legendary IV", "Legendary V", "Legendary VI", "Legendary VII", "Legendary VIII", "Legendary IX", "Legendary X"],
};

const TIER_TITLES: Record<TierClass, string[]> = {
  Initiate:    ["Novice Voyager", "Frontier Cadet", "Starling", "Void Learner", "Galaxy Newcomer", "Horizon Seeker", "Celestial Cadet", "Cosmos Initiate", "Star Initiate", "Galactic Initiate"],
  Apprentice:  ["Stellar Apprentice", "Nebula Apprentice", "Orbital Apprentice", "Deep Space Apprentice", "Warp Apprentice", "Void Apprentice", "Cosmic Apprentice", "Sector Apprentice", "Frontier Apprentice", "Galactic Apprentice"],
  Scout:       ["Stellar Scout", "Nebula Scout", "Deep Scout", "Warp Scout", "Void Scout", "Cosmic Scout", "Sector Scout", "Frontier Scout", "Expedition Scout", "Galactic Scout"],
  Journeyman:  ["Star Journeyman", "Cosmic Journeyman", "Void Journeyman", "Deep-Space Journeyman", "Orbital Journeyman", "Sector Journeyman", "Nebula Journeyman", "Warp Journeyman", "Frontier Journeyman", "Galactic Journeyman"],
  Adept:       ["Star Adept", "Celestial Adept", "Void Adept", "Nebula Adept", "Deep-Space Adept", "Orbital Adept", "Warp Adept", "Sector Adept", "Cosmic Adept", "Galactic Adept"],
  Expert:      ["Star Expert", "Cosmic Expert", "Nebula Expert", "Warp Expert", "Void Expert", "Orbital Expert", "Sector Expert", "Deep-Space Expert", "Frontier Expert", "Galactic Expert"],
  Master:      ["Star Master", "Celestial Master", "Void Master", "Nebula Master", "Orbital Master", "Warp Master", "Sector Master", "Cosmic Master", "Deep-Space Master", "Galactic Master"],
  Grandmaster: ["Star Grandmaster", "Celestial Grandmaster", "Void Grandmaster", "Nebula Grandmaster", "Orbital Grandmaster", "Warp Grandmaster", "Sector Grandmaster", "Cosmic Grandmaster", "Deep-Space Grandmaster", "Galactic Grandmaster"],
  Elite:       ["Star Elite", "Celestial Elite", "Void Elite", "Nebula Elite", "Orbital Elite", "Warp Elite", "Sector Elite", "Cosmic Elite", "Deep-Space Elite", "Galactic Elite"],
  Legendary:   ["Star Legend", "Celestial Legend", "Void Legend", "Nebula Legend", "Orbital Legend", "Warp Legend", "Sector Legend", "Cosmic Legend", "Deep-Space Legend", "Galactic Legend"],
};

const TIER_DESCRIPTIONS: Record<TierClass, string> = {
  Initiate:    "Entry-level expeditions suitable for newly commissioned commanders. Low risk, low reward.",
  Apprentice:  "Expeditions requiring basic fleet management and combat awareness.",
  Scout:       "Moderate-risk missions probing the edges of charted space.",
  Journeyman:  "Mid-tier operations where situational awareness becomes critical.",
  Adept:       "Challenging expeditions demanding effective fleet and troop coordination.",
  Expert:      "High-stakes missions where a single miscalculation can be fatal.",
  Master:      "Near-elite operations reserved for seasoned commanders.",
  Grandmaster: "Extremely demanding missions that test every facet of command capability.",
  Elite:       "Frontier of human endurance and tactical mastery in deep space.",
  Legendary:   "The most dangerous expeditions in the galaxy. Only the greatest survive.",
};

const TIER_SUB_DESCRIPTIONS: Record<TierClass, string> = {
  Initiate:    "Commanders at this tier learn the fundamentals of fleet management and interstellar navigation.",
  Apprentice:  "Developing commanders begin to face genuine threats and must adapt their strategies.",
  Scout:       "Scout-tier commanders are trusted with independent operations beyond patrol range.",
  Journeyman:  "Journeymen command mixed-arms forces and must manage logistics under pressure.",
  Adept:       "Adept commanders lead combined fleet and ground operations with real strategic stakes.",
  Expert:      "Expert missions require pre-battle intelligence, precise fleet positioning, and contingency planning.",
  Master:      "Master-tier expeditions push commanders into contested deep space with limited support.",
  Grandmaster: "Grandmaster operations may involve multiple simultaneous theatres of war.",
  Elite:       "Elite missions involve asymmetric threats, extreme environments, and zero margin for error.",
  Legendary:   "Legendary expeditions are galaxy-altering events; success reshapes the balance of power.",
};

/** Generate the subjects for a tier (3 sample subjects per tier) */
function buildSubjects(tier: number): ExpeditionSubject[] {
  return [
    {
      id: `subj-${tier}-planet`,
      name: "Planetary Body",
      description: "A solid or gaseous world targeted by the expedition.",
      subDescription: `Tier ${tier} planetary targets feature ${tier > 50 ? "extreme" : "moderate"} environmental hazards.`,
      details: [
        { key: "gravity", label: "Gravitational Pull", description: `${(tier * 0.1).toFixed(1)}g surface gravity` },
        { key: "atmosphere", label: "Atmosphere Type", description: tier > 70 ? "Toxic / Corrosive" : tier > 40 ? "Thin / Breathable" : "Standard" },
        { key: "resource_density", label: "Resource Density", description: `${Math.min(tier, 99)}% of maximum theoretical yield` },
      ],
    },
    {
      id: `subj-${tier}-anomaly`,
      name: "Spatial Anomaly",
      description: "A localised distortion in space-time or electromagnetic environment.",
      subDescription: `Tier ${tier} anomalies require ${tier > 60 ? "specialised containment equipment" : "standard sensor arrays"}.`,
      details: [
        { key: "intensity", label: "Anomaly Intensity", description: `Class ${Math.ceil(tier / 10)} anomaly field` },
        { key: "radius", label: "Effect Radius", description: `${tier * 0.5} AU` },
        { key: "stability", label: "Stability Rating", description: tier > 80 ? "Unstable" : tier > 50 ? "Semi-stable" : "Stable" },
      ],
    },
    {
      id: `subj-${tier}-installation`,
      name: "Interstellar Installation",
      description: "A man-made or alien-constructed structure in space.",
      subDescription: `Tier ${tier} installations may be defended by ${tier > 40 ? "automated weapon platforms" : "basic security drones"}.`,
      details: [
        { key: "size", label: "Installation Size", description: `Class ${Math.ceil(tier / 11)} structure` },
        { key: "faction", label: "Faction Affiliation", description: tier > 75 ? "Unknown / Hostile" : "Neutral / Unaffiliated" },
        { key: "tech_level", label: "Technology Level", description: `Level ${tier} equivalent technology` },
      ],
    },
  ];
}

/** Build a single ExpeditionStats object scaled by tier (1-99) */
function buildStats(tier: number): ExpeditionStats {
  const s = tier;
  return {
    power:      Math.round(s * 10.1),
    speed:      Math.round(s * 5.5 + 50),
    range:      Math.round(s * 8.2 + 100),
    stealth:    Math.round(s * 3.3),
    resilience: Math.round(s * 7.0 + 30),
    subStats: {
      powerRegen:       Math.round(s * 0.5),
      speedBoost:       Math.round(s * 0.3),
      rangeExtension:   Math.round(s * 1.2),
      stealthBonus:     Math.round(s * 0.2),
      resilienceBonus:   Math.round(s * 0.8),
    },
  };
}

/** Build ExpeditionAttributes scaled by tier (1-99) */
function buildAttributes(tier: number): ExpeditionAttributes {
  const t = tier;
  return {
    fleetStrength:   Math.round(t * 12),
    troopCapacity:   Math.round(t * 50),
    cargoCapacity:   Math.round(t * 500),
    scanRadius:      Math.round(t * 2.5 + 10),
    combatRating:    Math.round(t * 8 + 20),
    subAttributes: {
      hazardTolerance:       Math.round(t * 1.0),
      crewMorale:            Math.min(100, Math.round(50 + t * 0.5)),
      logisticsEfficiency:   Math.round(t * 0.8 + 10),
      intelligenceGain:      Math.round(t * 0.6 + 5),
      diplomaticInfluence:   Math.round(t * 0.4),
    },
  };
}

// ─── Generate 99 Expedition Tiers ────────────────────────────────────────────

export const EXPEDITION_TIERS: ExpeditionTier[] = Array.from({ length: 99 }, (_, i) => {
  const tier = i + 1;

  // Determine tier class (10 classes for 99 tiers).
  // Initiate spans tiers 1–9 (9 tiers) because the overall range is 1-99 (99 tiers),
  // and 9 + 9×10 = 99 fits perfectly with classes Apprentice through Legendary each
  // covering exactly 10 tiers (10–19, 20–29, … 90–99).
  let classIndex: number;
  let subClassNum: number;
  if (tier <= 9) {
    classIndex = 0;
    subClassNum = tier;
  } else {
    classIndex = Math.floor((tier - 10) / 10) + 1;
    subClassNum = ((tier - 10) % 10) + 1;
  }

  const tierClass = TIER_CLASSES[Math.min(classIndex, 9)];
  const tierSubClass = ROMAN[subClassNum] ?? `${subClassNum}`;
  const rankList = TIER_RANKS[tierClass];
  const titleList = TIER_TITLES[tierClass];
  const rankIdx = Math.min(subClassNum - 1, rankList.length - 1);

  return {
    tier,
    tierClass,
    tierSubClass,
    name: `${tierClass} ${tierSubClass}`,
    rank: rankList[rankIdx],
    title: titleList[rankIdx],
    description: TIER_DESCRIPTIONS[tierClass],
    subDescription: TIER_SUB_DESCRIPTIONS[tierClass],
    stats: buildStats(tier),
    attributes: buildAttributes(tier),
    subjects: buildSubjects(tier),
    minPlayerLevel: Math.ceil(tier * 10.1),
  };
});

// ─── Generate 999 Expedition Levels ──────────────────────────────────────────

const LEVEL_BAND_NAMES = [
  "Rookie", "Novice", "Learner", "Cadet", "Trainee",
  "Aspirant", "Seeker", "Pathfinder", "Trailblazer", "Voyager",
  "Starfarer", "Nebula Rider", "Void Walker", "Warp Runner", "Deep Diver",
  "Horizon Chaser", "Cosmic Wanderer", "Galaxy Strider", "Star Conqueror", "Legend",
];

/** XP required to reach a given level (exponential curve) */
function levelXp(level: number): number {
  return Math.round(100 * Math.pow(level, 1.85));
}

export const EXPEDITION_LEVELS: ExpeditionLevel[] = (() => {
  const levels: ExpeditionLevel[] = [];
  let cumulative = 0;
  for (let level = 1; level <= 999; level++) {
    const xpReq = level === 1 ? 0 : levelXp(level);
    cumulative += xpReq;

    const bandIndex = Math.min(Math.floor((level - 1) / 50), LEVEL_BAND_NAMES.length - 1);
    const bandName = LEVEL_BAND_NAMES[bandIndex];
    const withinBand = ((level - 1) % 50) + 1;

    // Which tier is unlocked at this level?
    const tierUnlocked = Math.min(99, Math.ceil(level / 10.1));

    // Special title every 100 levels
    const specialTitle = level % 100 === 0 ? `${bandName} Centurion ${level / 100}` : undefined;

    levels.push({
      level,
      name: `${bandName} ${withinBand}`,
      xpRequired: xpReq,
      cumulativeXp: cumulative,
      tierUnlocked,
      rewards: {
        metal:     Math.round(level * 50),
        crystal:   Math.round(level * 25),
        deuterium: Math.round(level * 10),
        xp:        Math.round(level * 5),
        tierUnlock: tierUnlocked,
        specialTitle,
      },
      description: `Level ${level} — ${bandName} progression stage ${withinBand}.`,
    });
  }
  return levels;
})();

// ─── Convenience lookup maps ──────────────────────────────────────────────────

export const CATEGORY_MAP = new Map(EXPEDITION_CATEGORIES.map(c => [c.id, c]));
export const TYPE_MAP = new Map(EXPEDITION_TYPES.map(t => [t.id, t]));
export const TIER_MAP = new Map(EXPEDITION_TIERS.map(t => [t.tier, t]));
export const LEVEL_MAP = new Map(EXPEDITION_LEVELS.map(l => [l.level, l]));
