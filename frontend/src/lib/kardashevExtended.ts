// Kardashev Scale Extended - Empire Progression System
// 99 Tiers with 5 Categories, 32 Sub-Categories, Classes, Types, Ranks, Titles,
// Stats, Attributes, Subjects, and a 1-999 Level System

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type KardashevCategory =
  | "Planetary"
  | "Stellar"
  | "Galactic"
  | "Universal"
  | "Transcendent";

// 32 Sub-Categories: 7 Planetary + 7 Stellar + 7 Galactic + 6 Universal + 5 Transcendent = 32
export type KardashevSubCategory =
  // Planetary (7)
  | "Local Planetary"
  | "Regional Planetary"
  | "Continental"
  | "Oceanic"
  | "Atmospheric"
  | "Orbital"
  | "Subterranean"
  // Stellar (7)
  | "Binary Stellar"
  | "Trinary Stellar"
  | "Asteroid Belt"
  | "Nebular"
  | "Dwarf Stellar"
  | "Giant Stellar"
  | "Neutron Stellar"
  // Galactic (7)
  | "Galactic Arm"
  | "Galactic Core"
  | "Star Cluster"
  | "Cosmic Void"
  | "Galactic Halo"
  | "Cosmic Filament"
  | "Supercluster"
  // Universal (6)
  | "Observable Universe"
  | "Dark Matter Domain"
  | "Dark Energy Domain"
  | "Quantum Realm"
  | "Multiversal"
  | "Dimensional"
  // Transcendent (5)
  | "Metaphysical"
  | "Omniscient"
  | "Omnipotent"
  | "Eternal"
  | "Infinite";

export type KardashevClass = "Alpha" | "Beta" | "Gamma" | "Delta" | "Omega";
export type KardashevSubClass = "I" | "II" | "III" | "IV" | "V" | "VI";

export type KardashevType =
  | "Settler"
  | "Developer"
  | "Controller"
  | "Dominator"
  | "Transcendent";

export type KardashevSubType =
  | "Nascent"
  | "Emerging"
  | "Established"
  | "Dominant"
  | "Supreme"
  | "Ascendant"
  | "Omnipotent";

export interface KardashevStats {
  primary: {
    power: number;
    efficiency: number;
    stability: number;
    expansion: number;
  };
  secondary: {
    militaryStrength: number;
    diplomaticInfluence: number;
    scientificOutput: number;
    economicGrowth: number;
    culturalSpread: number;
    spiritualAscension: number;
  };
}

export interface KardashevAttributes {
  primary: {
    dominance: number;
    knowledge: number;
    wisdom: number;
    power: number;
    harmony: number;
  };
  secondary: {
    resilience: number;
    adaptability: number;
    creativity: number;
    unity: number;
    transcendence: number;
  };
}

export interface KardashevSubject {
  name: string;
  description: string;
  detail: string;
  attribute: string;
}

export interface KardashevTierExtended {
  tier: number;
  name: string;
  category: KardashevCategory;
  subCategory: KardashevSubCategory;
  class: KardashevClass;
  subClass: KardashevSubClass;
  type: KardashevType;
  subType: KardashevSubType;
  rank: string;
  title: string;
  description: string;
  subDescription: string;
  details: string;
  stats: KardashevStats;
  attributes: KardashevAttributes;
  subjects: KardashevSubject[];
  requirementsMetal: number;
  requirementsCrystal: number;
  requirementsDeuterium: number;
  requiredResearchPoints: number;
  levelRange: [number, number];
  bonuses: {
    resourceProduction: number;
    energyProduction: number;
    buildSpeed: number;
    researchSpeed: number;
    fleetPower: number;
    defensePower: number;
    maxPlanets: number;
    maxFleets: number;
    maxBuildings: number;
    maxResearch: number;
  };
  effects: string[];
  unlocks: string[];
}

// ============================================================
// SUB-CATEGORY METADATA (32 total)
// ============================================================

interface SubCategoryMeta {
  category: KardashevCategory;
  tierStart: number;
  tierCount: number;
  tierNames: string[];
  rankNames: string[];
  titles: string[];
  subjectTemplates: Array<{ name: string; description: string; detail: string; attribute: string }>;
  effectTemplates: string[];
  unlockTemplates: string[];
  descriptionTemplate: string;
  subDescriptionTemplate: string;
  detailsTemplate: string;
}

const SUB_CATEGORY_META: Record<KardashevSubCategory, SubCategoryMeta> = {
  "Local Planetary": {
    category: "Planetary",
    tierStart: 1, tierCount: 3,
    tierNames: ["Planetary Settler", "Planetary Pioneer", "Planetary Master"],
    rankNames: ["Citizen", "Sergeant", "Captain"],
    titles: ["The Grounded", "The Builder", "The Cultivator"],
    subjectTemplates: [
      { name: "Surface Mining", description: "Basic surface resource extraction", detail: "Mechanical drills and mining robots extract raw materials from planetary surface deposits with increasing efficiency", attribute: "Industrial" },
      { name: "Atmospheric Processing", description: "Capturing and filtering atmospheric gases", detail: "Harvests planetary atmosphere for breathable gases and industrial chemicals using molecular sieves", attribute: "Scientific" },
      { name: "Settlement Planning", description: "Strategic placement of habitation zones", detail: "Urban algorithms optimize the placement of cities, farms, and factories for maximum productive output", attribute: "Administrative" },
    ],
    effectTemplates: ["Surface Mining Active", "Basic Atmosphere Control", "Settlement Networks"],
    unlockTemplates: ["Basic Mining", "Robotics Factory", "Colony Hub"],
    descriptionTemplate: "Initial colonization of a planetary surface with foundational resource extraction and settlement.",
    subDescriptionTemplate: "The empire takes its first steps on solid ground, learning to exploit the natural bounty of a single world.",
    detailsTemplate: "Early-stage planetary civilization focused on mastering the basics of resource extraction, environmental adaptation, and sustainable settlement construction. Every great galactic empire begins here.",
  },
  "Regional Planetary": {
    category: "Planetary",
    tierStart: 4, tierCount: 3,
    tierNames: ["Regional Settler", "Regional Pioneer", "Regional Master"],
    rankNames: ["Lieutenant", "Commander", "Colonel"],
    titles: ["The Networker", "The Organizer", "The Regional Overlord"],
    subjectTemplates: [
      { name: "Regional Networks", description: "Connecting multiple settlements into regional hubs", detail: "Infrastructure spanning continental regions enables efficient resource distribution and defensive coordination", attribute: "Logistical" },
      { name: "Terraforming Basics", description: "Modifying local environments for habitation", detail: "Basic climate and terrain modification technologies prepare hostile zones for colonization", attribute: "Environmental" },
      { name: "Regional Governance", description: "Administrative systems spanning multiple cities", detail: "Unified governance structures manage resource allocation, defense, and expansion across entire regions", attribute: "Political" },
    ],
    effectTemplates: ["Regional Trade Active", "Basic Terraforming", "Administrative Networks"],
    unlockTemplates: ["Regional Headquarters", "Climate Modifier", "Transport Network"],
    descriptionTemplate: "Expansion across multiple regions with unified governance and resource sharing.",
    subDescriptionTemplate: "The empire weaves together distant settlements into a coherent regional power with unified purpose.",
    detailsTemplate: "Regional consolidation phase where scattered settlements are integrated into a coherent power structure. Resource flows are optimized across terrain boundaries, and defensive zones are established.",
  },
  "Continental": {
    category: "Planetary",
    tierStart: 7, tierCount: 3,
    tierNames: ["Continental Scout", "Continental Pioneer", "Continental Master"],
    rankNames: ["Brigadier", "General", "Field Marshal"],
    titles: ["The Continental", "The Unifier", "The Continental Emperor"],
    subjectTemplates: [
      { name: "Continental Infrastructure", description: "Massive transport and utility networks spanning continents", detail: "Planet-spanning rail, energy, and communication systems reduce travel time and enable rapid mobilization", attribute: "Engineering" },
      { name: "Continental Defense Grid", description: "Defense systems covering entire continental masses", detail: "Shield generators, anti-orbital platforms, and regional defense networks create impenetrable fortresses", attribute: "Military" },
      { name: "Mass Production", description: "Industrial complexes producing at continental scale", detail: "Automated mega-factories produce goods at volumes sufficient to supply entire continental populations", attribute: "Industrial" },
    ],
    effectTemplates: ["Continental Grid Online", "Mass Production Active", "Continental Defense"],
    unlockTemplates: ["Maglev Network", "Defense Grid", "Mega Factory"],
    descriptionTemplate: "Full continental mastery with unified infrastructure and industrial capacity.",
    subDescriptionTemplate: "The empire commands entire continents as single productive units, with seamless integration of industry and defense.",
    detailsTemplate: "Continental-scale industrial civilization where geographic barriers have been completely overcome by engineering. Resources flow freely across the entire landmass.",
  },
  "Oceanic": {
    category: "Planetary",
    tierStart: 10, tierCount: 3,
    tierNames: ["Oceanic Scout", "Oceanic Pioneer", "Oceanic Master"],
    rankNames: ["Admiral", "Fleet Admiral", "Grand Admiral"],
    titles: ["The Diver", "The Depths Master", "The Oceanic Sovereign"],
    subjectTemplates: [
      { name: "Underwater Cities", description: "Habitats beneath planetary oceans", detail: "Pressurized mega-structures housing millions of inhabitants in oceanic environments using force-field technology", attribute: "Architectural" },
      { name: "Aquatic Resource Extraction", description: "Mining oceanic floors for rare minerals", detail: "Deep-sea automated mining operations continuously extract rare minerals from ocean beds and hydrothermal vents", attribute: "Industrial" },
      { name: "Tidal Energy Harvesting", description: "Converting ocean motion into power", detail: "Vast arrays of tidal generators and thermal gradient engines convert ocean dynamics into clean energy", attribute: "Energy" },
    ],
    effectTemplates: ["Oceanic Cities Online", "Tidal Energy Active", "Deep Sea Mining"],
    unlockTemplates: ["Submarine Factory", "Ocean Power Plant", "Deep Core Drill"],
    descriptionTemplate: "Colonization and exploitation of planetary oceans and their vast resources.",
    subDescriptionTemplate: "The empire extends dominion beneath the waves, tapping the vast untouched resources of planetary oceans.",
    detailsTemplate: "Oceanic expansion phase where the last unexploited environments of a planet are brought under productive control. Underwater cities rival surface metropolises in scale.",
  },
  "Atmospheric": {
    category: "Planetary",
    tierStart: 13, tierCount: 3,
    tierNames: ["Atmospheric Scout", "Atmospheric Pioneer", "Atmospheric Master"],
    rankNames: ["Wing Commander", "Air Marshal", "Supreme Air Marshal"],
    titles: ["The Cloud Rider", "The Sky Lord", "The Atmospheric Sovereign"],
    subjectTemplates: [
      { name: "Floating Platforms", description: "Cities and factories suspended in upper atmosphere", detail: "Gravity-assisted platforms utilizing atmospheric currents for energy and positioning house millions in the sky", attribute: "Architectural" },
      { name: "Weather Control", description: "Planetary weather manipulation systems", detail: "Ionospheric emitters and atmospheric conditioners control weather patterns, eliminating natural disasters", attribute: "Environmental" },
      { name: "Atmospheric Collection", description: "Harvesting rare elements from upper atmosphere", detail: "High-altitude collection systems gather rare isotopes and exotic gases carried up from lower layers", attribute: "Scientific" },
    ],
    effectTemplates: ["Sky Cities Active", "Weather Control Online", "Atmospheric Harvest"],
    unlockTemplates: ["Floating City", "Weather Controller", "Atmospheric Collector"],
    descriptionTemplate: "Mastery of planetary atmosphere with floating cities and weather manipulation.",
    subDescriptionTemplate: "The empire takes to the skies, building among the clouds and controlling the very weather itself.",
    detailsTemplate: "Atmospheric mastery phase where the entire planetary atmosphere becomes a habitable and productive environment. Weather is now a tool rather than a hazard.",
  },
  "Orbital": {
    category: "Planetary",
    tierStart: 16, tierCount: 3,
    tierNames: ["Orbital Pioneer", "Orbital Commander", "Orbital Lord"],
    rankNames: ["Space Captain", "Space Commodore", "Space Marshal"],
    titles: ["The Orbiter", "The Station Master", "The Orbital Sovereign"],
    subjectTemplates: [
      { name: "Space Stations", description: "Permanent orbital habitats and industrial platforms", detail: "Massive ring-shaped habitats in stable planetary orbits house industrial complexes and millions of workers", attribute: "Engineering" },
      { name: "Orbital Bombardment", description: "Strategic weapons platforms in planetary orbit", detail: "Kinetic impactors, laser arrays, and particle beam emitters in geostationary orbits provide absolute planetary control", attribute: "Military" },
      { name: "Solar Collection Arrays", description: "Vast orbital solar energy collectors", detail: "Thin-film solar arrays in high orbit collect unfiltered solar radiation and beam it to planetary receivers", attribute: "Energy" },
    ],
    effectTemplates: ["Orbital Stations Active", "Orbital Defense Online", "Solar Arrays Deployed"],
    unlockTemplates: ["Space Station", "Orbital Cannon", "Solar Collector Array"],
    descriptionTemplate: "Complete mastery of near-orbital space with stations, defenses, and solar energy.",
    subDescriptionTemplate: "The empire reaches beyond the atmosphere into the first realm of space, establishing permanent orbital presence.",
    detailsTemplate: "Orbital colonization phase marking the first true expansion off a planetary surface. Orbital infrastructure becomes the foundation for all future space expansion.",
  },
  "Subterranean": {
    category: "Planetary",
    tierStart: 19, tierCount: 3,
    tierNames: ["Subterranean Pioneer", "Subterranean Engineer", "Planetary Overlord"],
    rankNames: ["Mining Director", "Core Engineer", "Planetary Emperor"],
    titles: ["The Delver", "The Core Master", "The World Emperor"],
    subjectTemplates: [
      { name: "Deep Core Mining", description: "Extracting materials from planetary core", detail: "Geothermal taps and deep-bore extraction systems reaching planetary cores harvest exotic heavy elements", attribute: "Industrial" },
      { name: "Underground Cities", description: "Habitats deep beneath the planetary surface", detail: "Massive cavern systems housing billions beneath protective kilometers of rock, immune to surface hazards", attribute: "Architectural" },
      { name: "Geothermal Power", description: "Extracting energy from planetary heat", detail: "Deep geothermal wells tap the immense thermal energy stored in planetary mantles for virtually unlimited power", attribute: "Energy" },
    ],
    effectTemplates: ["Core Mines Active", "Underground Cities Online", "Geothermal Plants"],
    unlockTemplates: ["Core Extractor", "Underground Megacity", "Geothermal Array"],
    descriptionTemplate: "Total planetary mastery including the deepest subterranean reaches and planetary core.",
    subDescriptionTemplate: "The empire completes its conquest of a world by mastering even the deepest levels of planetary geology.",
    detailsTemplate: "Complete planetary mastery phase where every layer of a world — from upper atmosphere to planetary core — is under full productive control. A true Type I Kardashev civilization.",
  },
  "Binary Stellar": {
    category: "Stellar",
    tierStart: 22, tierCount: 3,
    tierNames: ["Binary Scout", "Binary Explorer", "Binary Controller"],
    rankNames: ["System Lieutenant", "System Captain", "System Commander"],
    titles: ["The Twin Seeker", "The Binary Pilot", "The Twin Star Lord"],
    subjectTemplates: [
      { name: "Binary Orbit Navigation", description: "Precise navigation in binary gravitational fields", detail: "Advanced gravity calculations enable safe transit through the complex Lagrange points of binary systems", attribute: "Navigation" },
      { name: "Gravitational Slingshot", description: "Accelerating ships using dual gravity wells", detail: "Ships thread between the two stars in carefully calculated arcs to achieve extreme velocities", attribute: "Propulsion" },
      { name: "Roche Lobe Harvesting", description: "Mining matter flowing between binary stars", detail: "Material flowing between binary stars through their shared Roche lobe is captured for raw resources", attribute: "Industrial" },
    ],
    effectTemplates: ["Binary Navigation Active", "Slingshot Maneuvers", "Roche Harvesting"],
    unlockTemplates: ["Binary Pilot Training", "Slingshot Drive", "Roche Collector"],
    descriptionTemplate: "Colonization of binary star systems with mastery of complex gravitational dynamics.",
    subDescriptionTemplate: "The empire reaches outward into the stellar neighborhood, establishing footholds around twin stars.",
    detailsTemplate: "First stellar expansion phase where the empire leaves its home system to colonize binary star systems. Complex gravitational dynamics present new challenges and opportunities.",
  },
  "Trinary Stellar": {
    category: "Stellar",
    tierStart: 25, tierCount: 3,
    tierNames: ["Trinary Scout", "Trinary Explorer", "Trinary Controller"],
    rankNames: ["Stellar Lieutenant", "Stellar Captain", "Stellar Commander"],
    titles: ["The Triple Seeker", "The Trinary Navigator", "The Triple Star Lord"],
    subjectTemplates: [
      { name: "Three-Body Mastery", description: "Understanding complex 3-body orbital mechanics", detail: "Advanced computational models predict stable and chaotic regions in trinary gravitational systems", attribute: "Scientific" },
      { name: "Multi-Star Energy Harvest", description: "Collecting energy from three stellar bodies", detail: "Distributed solar collection arrays across three stellar bodies provide exponentially greater energy yields", attribute: "Energy" },
      { name: "Stellar Weather Prediction", description: "Forecasting violent stellar interactions", detail: "Predictive systems warn colonies of dangerous flares and coronal mass ejections from interacting stars", attribute: "Scientific" },
    ],
    effectTemplates: ["Three-Body Solved", "Triple Solar Arrays", "Stellar Weather Service"],
    unlockTemplates: ["Three-Body Computer", "Triple Array", "Stellar Forecast System"],
    descriptionTemplate: "Mastery of trinary star systems and their extreme gravitational complexities.",
    subDescriptionTemplate: "The empire navigates the chaotic dance of triple stars, finding stability amid cosmic turmoil.",
    detailsTemplate: "Advanced stellar colonization phase tackling the mathematical complexity of three-body gravitational systems. Success here marks a civilization capable of advanced astrophysical engineering.",
  },
  "Asteroid Belt": {
    category: "Stellar",
    tierStart: 28, tierCount: 3,
    tierNames: ["Belt Scout", "Belt Explorer", "Belt Controller"],
    rankNames: ["Belt Miner", "Belt Captain", "Belt Admiral"],
    titles: ["The Rock Hopper", "The Belt Runner", "The Belt Sovereign"],
    subjectTemplates: [
      { name: "Asteroid Mining", description: "Large-scale resource extraction from asteroid fields", detail: "Swarms of mining drones continuously process metallic and carbonaceous asteroids for vast resource yields", attribute: "Industrial" },
      { name: "Belt Fortification", description: "Converting asteroids into defensive platforms", detail: "Hollowed-out asteroids transformed into weapons platforms and camouflaged military bases", attribute: "Military" },
      { name: "Habitat Asteroids", description: "Transforming asteroids into habitable space stations", detail: "Rotating hollowed asteroids provide artificial gravity and natural radiation shielding for colonies", attribute: "Architectural" },
    ],
    effectTemplates: ["Belt Mining Active", "Asteroid Fortresses", "Habitat Rocks"],
    unlockTemplates: ["Mining Drone Swarm", "Asteroid Fortress", "Rotating Habitat"],
    descriptionTemplate: "Full exploitation of asteroid belt resources with military fortification.",
    subDescriptionTemplate: "The empire turns the primordial rubble of star system formation into its greatest industrial asset.",
    detailsTemplate: "Asteroid belt colonization phase where the raw mineral wealth scattered across the belt is systematically harvested. Belt cities and fortresses form a distributed network of industrial power.",
  },
  "Nebular": {
    category: "Stellar",
    tierStart: 31, tierCount: 3,
    tierNames: ["Nebular Scout", "Nebular Explorer", "Nebular Master"],
    rankNames: ["Nebula Scout", "Nebula Captain", "Nebula Admiral"],
    titles: ["The Cloud Walker", "The Nebula Pioneer", "The Nebula Sovereign"],
    subjectTemplates: [
      { name: "Nebula Gas Harvesting", description: "Collecting gases from stellar nebulae", detail: "Vast collection arrays absorb molecular clouds for fuel, atmosphere generation, and rare isotope extraction", attribute: "Industrial" },
      { name: "Star Formation Guidance", description: "Guiding stellar formation within nebulae", detail: "Targeted compression of gas clouds creates useful star types in desired locations for future colonization", attribute: "Engineering" },
      { name: "Nebular Observatory", description: "Using nebulae as natural telescopes", detail: "The turbulent gas and dust of nebulae create natural focusing effects for cosmic-scale observations", attribute: "Scientific" },
    ],
    effectTemplates: ["Nebula Harvest Active", "Star Formation Guide", "Nebula Observatory"],
    unlockTemplates: ["Gas Harvester", "Stellar Seed", "Nebula Lens"],
    descriptionTemplate: "Exploitation of nebular gas clouds for resources and controlled star formation.",
    subDescriptionTemplate: "The empire reaches into the cosmic nurseries of new stars, shaping creation itself.",
    detailsTemplate: "Nebular engineering phase where the raw material of future stars is harvested or guided into formation. This marks the beginning of true stellar-scale engineering capability.",
  },
  "Dwarf Stellar": {
    category: "Stellar",
    tierStart: 34, tierCount: 3,
    tierNames: ["Dwarf Scout", "Dwarf Explorer", "Dwarf Controller"],
    rankNames: ["Dwarf Analyst", "Dwarf Captain", "Dwarf Admiral"],
    titles: ["The Ember Seeker", "The White Dweller", "The Dwarf Star Lord"],
    subjectTemplates: [
      { name: "White Dwarf Harvesting", description: "Extracting energy and matter from white dwarf stars", detail: "Super-dense matter collection and crystalline carbon (diamond) mining from compressed white dwarf material", attribute: "Industrial" },
      { name: "Red Dwarf Colonization", description: "Establishing long-term colonies around M-class stars", detail: "Habitats optimized for the dimmer, redder light of M-class dwarf stars providing trillions of years of stable energy", attribute: "Colonization" },
      { name: "Brown Dwarf Tapping", description: "Extracting fuel from sub-stellar objects", detail: "Deuterium and helium-3 extraction from sub-stellar brown dwarfs provides virtually unlimited fusion fuel", attribute: "Energy" },
    ],
    effectTemplates: ["Dwarf Harvest Active", "Red Dwarf Colonies", "Brown Dwarf Taps"],
    unlockTemplates: ["Dwarf Collector", "Long-Duration Habitat", "Deuterium Extractor"],
    descriptionTemplate: "Colonization and exploitation of dwarf star systems across multiple spectral classes.",
    subDescriptionTemplate: "The empire exploits the quiet, long-lived worlds of dwarf stars for stable multi-billion-year power sources.",
    detailsTemplate: "Dwarf stellar colonization phase exploiting the longevity and stability of small stellar objects. Red dwarf colonies can sustain civilizations for trillions of years.",
  },
  "Giant Stellar": {
    category: "Stellar",
    tierStart: 37, tierCount: 3,
    tierNames: ["Giant Scout", "Giant Explorer", "Giant Controller"],
    rankNames: ["Giant Analyst", "Giant Commander", "Giant Admiral"],
    titles: ["The Giant Tamer", "The Stellar Giant", "The Giant Star Lord"],
    subjectTemplates: [
      { name: "Red Giant Infrastructure", description: "Operations around expanded giant stars", detail: "Heat-shielded megastructures operating in the superheated environments of giant stars harvest enormous energy", attribute: "Engineering" },
      { name: "Supernova Prediction", description: "Forecasting and preparing for stellar explosions", detail: "Advanced models predict supernova timing decades in advance, allowing evacuation and energy harvesting", attribute: "Scientific" },
      { name: "Giant Energy Harvest", description: "Collecting the immense output of giant stars", detail: "Partial Dyson spheres around giant stars collect hundreds of times more energy than solar-type stars", attribute: "Energy" },
    ],
    effectTemplates: ["Giant Infrastructure Active", "Supernova Prediction", "Giant Energy Harvest"],
    unlockTemplates: ["Heat Shield Array", "Supernova Predictor", "Giant Dyson Shell"],
    descriptionTemplate: "Exploitation of giant star systems with extreme energy collection and supernova prediction.",
    subDescriptionTemplate: "The empire conquers the most luminous stellar objects, harvesting their tremendous power output.",
    detailsTemplate: "Giant stellar exploitation phase where the enormous energy output of evolved giant stars is systematically harvested. Supernova prediction ensures colonies are protected from stellar catastrophes.",
  },
  "Neutron Stellar": {
    category: "Stellar",
    tierStart: 40, tierCount: 3,
    tierNames: ["Neutron Scout", "Neutron Adept", "Neutron Master"],
    rankNames: ["Neutron Researcher", "Neutron Captain", "Neutron Admiral"],
    titles: ["The Pulsar Rider", "The Neutron Tamer", "The Neutron Star Lord"],
    subjectTemplates: [
      { name: "Pulsar Navigation", description: "Using pulsar timing signals as navigation beacons", detail: "Rapidly rotating pulsars serve as natural lighthouses enabling precise position fixing across galactic distances", attribute: "Navigation" },
      { name: "Neutron Star Mining", description: "Extracting super-dense exotic materials", detail: "Exotic matter extraction from neutron star surfaces using force-field stabilized collectors yields unprecedented material densities", attribute: "Industrial" },
      { name: "Magnetar Energy Tap", description: "Harvesting energy from magnetar magnetic fields", detail: "The most powerful magnetic fields in the universe are tapped for enormous clean energy generation", attribute: "Energy" },
    ],
    effectTemplates: ["Pulsar Navigation Active", "Neutron Mining Online", "Magnetar Tap"],
    unlockTemplates: ["Pulsar Beacon", "Neutron Extractor", "Magnetar Tap Array"],
    descriptionTemplate: "Mastery of neutron stars, pulsars, and magnetars for navigation and extreme resource extraction.",
    subDescriptionTemplate: "The empire masters the most exotic stellar remnants, wielding forces that dwarf conventional stars.",
    detailsTemplate: "Neutron stellar mastery phase where the densest, most extreme stellar objects become productive assets. Mastery here marks the transition from stellar to galactic civilization.",
  },
  "Galactic Arm": {
    category: "Galactic",
    tierStart: 43, tierCount: 3,
    tierNames: ["Arm Wanderer", "Arm Colonist", "Arm Dominator"],
    rankNames: ["Arm Scout", "Arm Commander", "Arm Governor"],
    titles: ["The Arm Walker", "The Arm Pioneer", "The Arm Sovereign"],
    subjectTemplates: [
      { name: "Arm Navigation", description: "Traversing the dense star fields of galactic spiral arms", detail: "Mapping and navigating the hundreds of billions of stars within galactic arm structures requires sophisticated AI", attribute: "Navigation" },
      { name: "Arm Trade Routes", description: "Establishing commerce along galactic arms", detail: "Trade corridors connecting thousands of star systems within a galactic arm create the foundation of galactic economy", attribute: "Economic" },
      { name: "Arm Military Network", description: "Defensive coordination across galactic arms", detail: "Rapid response fleets and communication networks protect hundreds of thousands of systems simultaneously", attribute: "Military" },
    ],
    effectTemplates: ["Arm Navigation Active", "Arm Trade Routes", "Arm Defense Network"],
    unlockTemplates: ["Galactic Map", "Trade Corridor", "Arm Fleet Command"],
    descriptionTemplate: "Dominion across an entire galactic spiral arm with interconnected systems.",
    subDescriptionTemplate: "The empire stretches across the star-dense regions of a galactic arm, connecting thousands of star systems.",
    detailsTemplate: "Galactic arm colonization phase where the empire expands across an entire structural arm of the galaxy. Hundreds of thousands of star systems fall under unified command.",
  },
  "Galactic Core": {
    category: "Galactic",
    tierStart: 46, tierCount: 3,
    tierNames: ["Core Pioneer", "Core Sovereign", "Core Emperor"],
    rankNames: ["Core Explorer", "Core Commander", "Core Emperor"],
    titles: ["The Core Seeker", "The Core Lord", "The Core Emperor"],
    subjectTemplates: [
      { name: "Black Hole Operations", description: "Utilizing the central supermassive black hole", detail: "Energy extraction from galactic center black holes using Penrose processes yields staggering power output", attribute: "Energy" },
      { name: "Core Fortress", description: "Military stronghold at the galactic center", detail: "Impenetrable defensive network utilizing the dense star field and extreme gravity of the galactic core", attribute: "Military" },
      { name: "Stellar Density Exploitation", description: "Taking advantage of extreme star density", detail: "Thousands of stars packed within a few light-years provide enormous resource concentration for industrial use", attribute: "Industrial" },
    ],
    effectTemplates: ["Black Hole Power Plant", "Core Fortress Active", "Density Exploitation"],
    unlockTemplates: ["Penrose Extractor", "Core Citadel", "Dense Cluster Harvester"],
    descriptionTemplate: "Control of the galactic core and its supermassive black hole for ultimate power.",
    subDescriptionTemplate: "The empire claims the very center of the galaxy, wielding the power of the supermassive black hole.",
    detailsTemplate: "Galactic core control phase representing total mastery of an entire galaxy. The supermassive black hole at the galactic center becomes the ultimate power source.",
  },
  "Star Cluster": {
    category: "Galactic",
    tierStart: 49, tierCount: 3,
    tierNames: ["Cluster Scout", "Cluster Commander", "Cluster Overlord"],
    rankNames: ["Cluster Analyst", "Cluster Captain", "Cluster Admiral"],
    titles: ["The Cluster Walker", "The Cluster Lord", "The Cluster Sovereign"],
    subjectTemplates: [
      { name: "Cluster Colonization", description: "Rapid colonization of dense star clusters", detail: "Dense star clusters provide thousands of colonization targets within compact space for rapid expansion", attribute: "Colonization" },
      { name: "Globular Defense", description: "Fortifying ancient globular star clusters", detail: "Ancient globular clusters house vast military installations in their dense, radiation-rich cores", attribute: "Military" },
      { name: "Cluster Economics", description: "Trading within densely packed stellar systems", detail: "Close proximity of systems within clusters enables trade networks with near-zero transportation costs", attribute: "Economic" },
    ],
    effectTemplates: ["Cluster Colonization Active", "Globular Fortresses", "Cluster Markets"],
    unlockTemplates: ["Cluster Colonizer", "Globular Citadel", "Cluster Exchange"],
    descriptionTemplate: "Dominion over star clusters with dense colonization and fortification.",
    subDescriptionTemplate: "The empire seizes the ancient stellar nurseries of globular clusters as strategic strongholds.",
    detailsTemplate: "Star cluster control phase where extremely dense stellar regions are exploited for their resource and strategic value. Globular clusters become impregnable fortresses.",
  },
  "Cosmic Void": {
    category: "Galactic",
    tierStart: 52, tierCount: 3,
    tierNames: ["Void Walker", "Void Seeker", "Void Master"],
    rankNames: ["Void Pathfinder", "Void Captain", "Void Admiral"],
    titles: ["The Void Wanderer", "The Void Pioneer", "The Void Sovereign"],
    subjectTemplates: [
      { name: "Void Crossing", description: "Traversing the vast empty spaces between galaxy clusters", detail: "Technologies enabling transit across cosmic voids spanning hundreds of millions of light-years in acceptable timeframes", attribute: "Navigation" },
      { name: "Void Stations", description: "Isolated outposts in intergalactic space", detail: "Lonely waypoints maintained by advanced civilizations for communication and refueling across void spaces", attribute: "Logistical" },
      { name: "Void Harvesting", description: "Extracting resources from seemingly empty space", detail: "Even cosmic voids contain sparse matter that can be harvested at the scales available to void-spanning civilizations", attribute: "Industrial" },
    ],
    effectTemplates: ["Void Transit Active", "Void Stations Online", "Void Harvesting"],
    unlockTemplates: ["Void Drive", "Void Station", "Vacuum Harvester"],
    descriptionTemplate: "Mastery of the vast empty voids between galaxy clusters for intergalactic expansion.",
    subDescriptionTemplate: "The empire bridges the unfathomable void between galaxy clusters, establishing presence in the emptiest regions of the cosmos.",
    detailsTemplate: "Void crossing phase representing the empire's expansion beyond the confines of a single galaxy into intergalactic space. Void stations enable communication and transit across billions of light-years.",
  },
  "Galactic Halo": {
    category: "Galactic",
    tierStart: 55, tierCount: 3,
    tierNames: ["Halo Pioneer", "Halo Explorer", "Halo Lord"],
    rankNames: ["Halo Surveyor", "Halo Captain", "Halo Admiral"],
    titles: ["The Halo Seeker", "The Halo Explorer", "The Halo Sovereign"],
    subjectTemplates: [
      { name: "Dark Matter Mapping", description: "Charting galactic halo dark matter distributions", detail: "The galactic halo contains vast quantities of dark matter that can be detected, mapped, and eventually manipulated", attribute: "Scientific" },
      { name: "Halo Star Mining", description: "Extracting resources from outlying halo stars", detail: "Ancient Population II stars in galactic halos contain unique pre-galactic chemical compositions not found elsewhere", attribute: "Industrial" },
      { name: "Halo Defense Perimeter", description: "Defensive network at the galactic edge", detail: "Sensor arrays and defensive installations at the galactic halo provide advance warning of extragalactic threats", attribute: "Military" },
    ],
    effectTemplates: ["Halo Mapping Active", "Halo Mining Online", "Halo Defense Line"],
    unlockTemplates: ["Dark Matter Scanner", "Halo Miner", "Halo Sentinel"],
    descriptionTemplate: "Control of the galactic halo for dark matter research and outer defense.",
    subDescriptionTemplate: "The empire extends to the very edges of the galaxy, mastering the sparse stellar halo.",
    detailsTemplate: "Galactic halo control phase where the outermost regions of the galaxy, including its dark matter halo, fall under imperial control. The galactic edge becomes a fortified frontier.",
  },
  "Cosmic Filament": {
    category: "Galactic",
    tierStart: 58, tierCount: 3,
    tierNames: ["Filament Scout", "Filament Weaver", "Filament Master"],
    rankNames: ["Filament Pathfinder", "Filament Commander", "Filament Admiral"],
    titles: ["The Web Walker", "The Filament Weaver", "The Filament Sovereign"],
    subjectTemplates: [
      { name: "Filament Navigation", description: "Traveling along the cosmic web's filament highways", detail: "The largest structures in the universe serve as natural highways connecting galaxy clusters for advanced civilizations", attribute: "Navigation" },
      { name: "Filament Colonization", description: "Establishing presence along cosmic filaments", detail: "Galaxy clusters strung along cosmic filaments provide natural way stations for civilizations spanning the cosmic web", attribute: "Colonization" },
      { name: "Web Engineering", description: "Reshaping the structure of cosmic web filaments", detail: "Gravitational engineering at cosmic scales redirects filament flows to concentrate resources in desired regions", attribute: "Engineering" },
    ],
    effectTemplates: ["Filament Navigation Active", "Filament Colonies Online", "Web Engineering"],
    unlockTemplates: ["Filament Drive", "Filament Colony", "Web Manipulator"],
    descriptionTemplate: "Dominion across the cosmic web's galaxy-connecting filaments.",
    subDescriptionTemplate: "The empire claims the very threads of the cosmic web, the largest structures in all of existence.",
    detailsTemplate: "Cosmic filament control phase where the empire spans the largest structures in the known universe. Cosmic filaments, stretching for billions of light-years, become imperial highways.",
  },
  "Supercluster": {
    category: "Galactic",
    tierStart: 61, tierCount: 3,
    tierNames: ["Supercluster Seeker", "Supercluster Architect", "Supercluster Emperor"],
    rankNames: ["Supercluster Pioneer", "Supercluster Commander", "Supercluster Emperor"],
    titles: ["The Attractor Seeker", "The Supercluster Lord", "The Supercluster Emperor"],
    subjectTemplates: [
      { name: "Supercluster Domain", description: "Control of entire galaxy superclusters", detail: "Attractor regions like the Great Attractor become domains of supercluster-spanning empires spanning millions of galaxies", attribute: "Political" },
      { name: "Supercluster Engineering", description: "Reshaping supercluster-scale gravitational dynamics", detail: "Manipulating the gravitational dynamics of entire superclusters concentrates resources in desired regions", attribute: "Engineering" },
      { name: "Universal Position", description: "Strategic positioning within the universal structure", detail: "Understanding and exploiting the hierarchical structure of the universe for maximum strategic advantage", attribute: "Strategic" },
    ],
    effectTemplates: ["Supercluster Domain Active", "Supercluster Engineering", "Universal Positioning"],
    unlockTemplates: ["Attractor Control", "Supercluster Engineer", "Universal Navigator"],
    descriptionTemplate: "Total control of galaxy superclusters, the largest gravitationally-bound structures.",
    subDescriptionTemplate: "The empire spans entire galaxy superclusters, wielding gravity itself as a tool of dominion.",
    detailsTemplate: "Supercluster control phase marking the transition from galactic to universal civilization. Hundreds of thousands of galaxies fall under a unified imperial structure.",
  },
  "Observable Universe": {
    category: "Universal",
    tierStart: 64, tierCount: 3,
    tierNames: ["Universe Seeker", "Universe Controller", "Universe Master"],
    rankNames: ["Universal Scout", "Universal Commander", "Universal Master"],
    titles: ["The Universe Seeker", "The Universal Lord", "The Universal Sovereign"],
    subjectTemplates: [
      { name: "Hubble Volume Mastery", description: "Control of the entire observable universe", detail: "The 93 billion light-year diameter observable universe becomes a single unified domain of the empire", attribute: "Political" },
      { name: "Universal Constants Tuning", description: "Adjusting fundamental physical constants", detail: "Fine-tuning the constants of physics across all space optimizes energy extraction and material properties", attribute: "Scientific" },
      { name: "Cosmological Engineering", description: "Shaping the large-scale structure of the universe", detail: "Redirecting galaxy flows, adjusting the cosmic web structure, and seeding new star formation on universal scales", attribute: "Engineering" },
    ],
    effectTemplates: ["Observable Universe Control", "Constants Tuning Active", "Cosmological Engineering"],
    unlockTemplates: ["Hubble Volume Map", "Constants Adjuster", "Cosmological Engine"],
    descriptionTemplate: "Mastery of the entire observable universe and its fundamental physical constants.",
    subDescriptionTemplate: "The empire's reach encompasses all that can be seen or known, the entire observable cosmos.",
    detailsTemplate: "Observable universe control phase marking the apex of physical civilization. All 2 trillion galaxies within the observable universe acknowledge imperial authority.",
  },
  "Dark Matter Domain": {
    category: "Universal",
    tierStart: 67, tierCount: 3,
    tierNames: ["Dark Matter Initiate", "Dark Matter Adept", "Dark Matter Lord"],
    rankNames: ["Dark Analyst", "Dark Commander", "Dark Lord"],
    titles: ["The Shadow Seeker", "The Dark Matter Adept", "The Dark Matter Sovereign"],
    subjectTemplates: [
      { name: "Dark Matter Manipulation", description: "Controlling the invisible scaffolding of the universe", detail: "95% of the universe's mass becomes accessible through advanced dark matter interaction technologies", attribute: "Scientific" },
      { name: "Dark Matter Weapons", description: "Weaponizing dark matter interactions", detail: "Dark matter bombs and dark matter beam weapons phase through conventional matter defenses unimpeded", attribute: "Military" },
      { name: "Gravitational Architects", description: "Reshaping dark matter halos to control gravity", detail: "Manipulating the dark matter halos of galaxies and clusters reshapes gravitational dynamics across universal scales", attribute: "Engineering" },
    ],
    effectTemplates: ["Dark Matter Control", "Shadow Weapons Active", "Gravity Architecture"],
    unlockTemplates: ["Dark Matter Manipulator", "Shadow Bomb", "Gravity Architect"],
    descriptionTemplate: "Mastery of dark matter, the invisible mass that shapes all cosmic structure.",
    subDescriptionTemplate: "The empire extends its dominion into the invisible realm of dark matter, the hidden backbone of cosmic structure.",
    detailsTemplate: "Dark matter mastery phase where the empire gains access to the 27% of universal mass-energy comprising dark matter. Dark matter manipulation enables unprecedented gravitational engineering.",
  },
  "Dark Energy Domain": {
    category: "Universal",
    tierStart: 70, tierCount: 3,
    tierNames: ["Dark Energy Initiate", "Dark Energy Adept", "Dark Energy Lord"],
    rankNames: ["Energy Analyst", "Energy Commander", "Energy Lord"],
    titles: ["The Expansion Seeker", "The Dark Energy Adept", "The Dark Energy Sovereign"],
    subjectTemplates: [
      { name: "Expansion Control", description: "Manipulating cosmic expansion via dark energy", detail: "Tapping into dark energy to accelerate or decelerate cosmic expansion in specific regions as needed", attribute: "Engineering" },
      { name: "Dark Energy Engines", description: "Powering technology directly from dark energy", detail: "Engines drawing on the latent dark energy permeating all space provide effectively unlimited fuel anywhere in the universe", attribute: "Energy" },
      { name: "Universal Stabilization", description: "Preventing Big Rip scenarios through dark energy management", detail: "Active management of dark energy density prevents the eventual tearing apart of all matter by accelerating expansion", attribute: "Scientific" },
    ],
    effectTemplates: ["Expansion Control Active", "Dark Energy Engines", "Universal Stabilizer"],
    unlockTemplates: ["Expansion Controller", "Dark Energy Engine", "Universe Stabilizer"],
    descriptionTemplate: "Control of dark energy, the force driving the accelerating expansion of the universe.",
    subDescriptionTemplate: "The empire taps into the mysterious force constituting 68% of all mass-energy in the universe.",
    detailsTemplate: "Dark energy mastery phase providing access to the most abundant energy source in existence. Control of dark energy enables manipulation of cosmic expansion and virtually unlimited power generation.",
  },
  "Quantum Realm": {
    category: "Universal",
    tierStart: 73, tierCount: 3,
    tierNames: ["Quantum Pioneer", "Quantum Adept", "Quantum Master"],
    rankNames: ["Quantum Scout", "Quantum Commander", "Quantum Master"],
    titles: ["The Probability Rider", "The Quantum Lord", "The Quantum Sovereign"],
    subjectTemplates: [
      { name: "Quantum Tunneling Transport", description: "Instantaneous transport via quantum tunneling", detail: "Ships and matter phase through quantum tunnels to emerge anywhere in the universe instantaneously without traversing space", attribute: "Navigation" },
      { name: "Wave Function Control", description: "Collapsing probability waves to desired outcomes", detail: "Reality itself becomes malleable as wave functions are deliberately collapsed to produce desired macroscopic outcomes", attribute: "Scientific" },
      { name: "Quantum Entanglement Network", description: "Instantaneous communication across infinite distances", detail: "Quantum entangled communication arrays provide zero-lag communication regardless of distance", attribute: "Communication" },
    ],
    effectTemplates: ["Quantum Transport Active", "Wave Function Control", "Entanglement Network"],
    unlockTemplates: ["Quantum Tunnel Drive", "Probability Engine", "Entanglement Comms"],
    descriptionTemplate: "Mastery of quantum mechanics enabling instantaneous transport and probability control.",
    subDescriptionTemplate: "The empire penetrates to the quantum bedrock of reality, wielding probability itself as a weapon.",
    detailsTemplate: "Quantum realm mastery phase where the empire operates at the fundamental level of quantum mechanics. Probability itself becomes a controllable variable.",
  },
  "Multiversal": {
    category: "Universal",
    tierStart: 76, tierCount: 3,
    tierNames: ["Multiverse Explorer", "Multiverse Navigator", "Multiverse Sovereign"],
    rankNames: ["Multiverse Scout", "Multiverse Commander", "Multiverse Sovereign"],
    titles: ["The Parallel Seeker", "The Multiverse Navigator", "The Multiverse Sovereign"],
    subjectTemplates: [
      { name: "Parallel Universe Access", description: "Crossing between parallel universes", detail: "Technologies allowing transit between the infinite parallel versions of reality harvest resources from all possible universes", attribute: "Navigation" },
      { name: "Timeline Manipulation", description: "Editing the histories of parallel timelines", detail: "Altering events in parallel universe histories to optimize conditions across the multiverse for imperial benefit", attribute: "Strategic" },
      { name: "Universal Selection", description: "Choosing favorable universe branches", detail: "Navigating to universe branches with favorable physical constants and historical conditions for expansion", attribute: "Strategic" },
    ],
    effectTemplates: ["Parallel Access Active", "Timeline Editing", "Universe Selection"],
    unlockTemplates: ["Parallel Drive", "Timeline Editor", "Universe Selector"],
    descriptionTemplate: "Access to and control of parallel universes and alternate timelines.",
    subDescriptionTemplate: "The empire shatters the walls between realities, claiming dominion across infinite parallel universes.",
    detailsTemplate: "Multiversal expansion phase where the empire extends beyond a single universe into the infinite multiverse. Access to all possible universes provides limitless resources and strategic options.",
  },
  "Dimensional": {
    category: "Universal",
    tierStart: 79, tierCount: 3,
    tierNames: ["Dimensional Walker", "Dimensional Weaver", "Dimensional Architect"],
    rankNames: ["Dimension Scout", "Dimension Commander", "Dimension Architect"],
    titles: ["The Dimension Walker", "The Dimension Weaver", "The Dimension Architect"],
    subjectTemplates: [
      { name: "Higher Dimensional Access", description: "Accessing dimensions beyond three-dimensional space", detail: "Operations in 4D, 5D and higher dimensional spaces provide geometric and strategic advantages incomprehensible to lesser civilizations", attribute: "Scientific" },
      { name: "Dimension Folding", description: "Folding space via higher dimensional shortcuts", detail: "Shortcuts through higher dimensions allow instantaneous transit across any distance within or between universes", attribute: "Navigation" },
      { name: "Dimensional Architecture", description: "Constructing structures in higher dimensions", detail: "Buildings and fortifications constructed in higher dimensional space are invisible to and impenetrable by conventional forces", attribute: "Engineering" },
    ],
    effectTemplates: ["Higher Dimensions Active", "Space Folding Online", "Dimensional Architecture"],
    unlockTemplates: ["Dimension Drive", "Space Folder", "Hyperspace Builder"],
    descriptionTemplate: "Mastery of higher spatial dimensions beyond three-dimensional space.",
    subDescriptionTemplate: "The empire transcends the three-dimensional prison of space, moving freely through higher geometric dimensions.",
    detailsTemplate: "Dimensional mastery phase marking the transition from physical to transcendent civilization. Access to higher dimensions provides capabilities that transcend all conventional limitations.",
  },
  "Metaphysical": {
    category: "Transcendent",
    tierStart: 82, tierCount: 4,
    tierNames: ["Metaphysical Initiate", "Metaphysical Adept", "Metaphysical Master", "Metaphysical Transcendent"],
    rankNames: ["Metaphysical Seeker", "Metaphysical Adept", "Metaphysical Master", "Metaphysical Lord"],
    titles: ["The Thought Projector", "The Reality Perceiver", "The Metaphysical Master", "The Metaphysical Sovereign"],
    subjectTemplates: [
      { name: "Consciousness Projection", description: "Projecting awareness across all of existence", detail: "Pure thought manifests physical effects across unlimited distances without any physical medium", attribute: "Psychic" },
      { name: "Reality Perception", description: "Direct perception of reality's underlying structure", detail: "Transcending sensory limitations reveals the true mathematical nature of all existence simultaneously", attribute: "Perceptual" },
      { name: "Mind-Matter Interface", description: "Direct mental control of physical reality", detail: "Thought alone reshapes matter, energy, and space without any technological intermediary", attribute: "Telekinetic" },
    ],
    effectTemplates: ["Thought Projection Active", "Reality Perception Online", "Mind-Matter Interface"],
    unlockTemplates: ["Consciousness Projector", "Reality Scanner", "Mind Engine"],
    descriptionTemplate: "Transcendence of physical limitations through metaphysical mastery and consciousness expansion.",
    subDescriptionTemplate: "The empire dissolves the boundary between mind and matter, between thought and reality.",
    detailsTemplate: "Metaphysical ascension phase where the empire begins to transcend the purely physical. Consciousness itself becomes a tool of imperial power, capable of directly shaping reality.",
  },
  "Omniscient": {
    category: "Transcendent",
    tierStart: 86, tierCount: 4,
    tierNames: ["Omniscient Seeker", "Omniscient Adept", "Omniscient Master", "Omniscient Transcendent"],
    rankNames: ["Knowledge Seeker", "Knowledge Adept", "Knowledge Master", "Knowledge Lord"],
    titles: ["The All-Knowing Seeker", "The Omniscient Adept", "The Omniscient Master", "The Omniscient Sovereign"],
    subjectTemplates: [
      { name: "Universal Knowledge", description: "Access to all information in existence", detail: "Complete awareness of all past, present and future states across all realities simultaneously without processing lag", attribute: "Cognitive" },
      { name: "Perfect Prediction", description: "Knowing all future outcomes simultaneously", detail: "Deterministic forecasting of every quantum event across infinite parallel universes provides perfect strategic advantage", attribute: "Predictive" },
      { name: "Information Omnipresence", description: "Simultaneous awareness of all events everywhere", detail: "Every event in all of existence is perceived instantly, creating an all-encompassing awareness of reality", attribute: "Awareness" },
    ],
    effectTemplates: ["Universal Knowledge Access", "Perfect Prediction Active", "Omnipresent Awareness"],
    unlockTemplates: ["Omniscience Engine", "Future Oracle", "Universal Sensor"],
    descriptionTemplate: "Attainment of omniscience - complete knowledge of all that is, was, and will be.",
    subDescriptionTemplate: "The empire achieves perfect knowledge, accessing the complete information content of all existence.",
    detailsTemplate: "Omniscient ascension phase where the empire achieves total informational awareness. No secrets exist, no surprises are possible, and every strategic decision is made with perfect information.",
  },
  "Omnipotent": {
    category: "Transcendent",
    tierStart: 90, tierCount: 4,
    tierNames: ["Omnipotent Initiate", "Omnipotent Adept", "Omnipotent Ascendant", "Omnipotent Supreme"],
    rankNames: ["Power Seeker", "Power Adept", "Power Lord", "Supreme Lord"],
    titles: ["The Power Initiate", "The Omnipotent Adept", "The Omnipotent Ascendant", "The Omnipotent Supreme"],
    subjectTemplates: [
      { name: "Reality Creation", description: "Creating new realities from nothing", detail: "Ex nihilo creation of universes, dimensions, and realms of existence at will with arbitrary physical laws", attribute: "Creative" },
      { name: "Absolute Power", description: "Unlimited capacity for any conceivable action", detail: "No physical, logical, or metaphysical constraint can limit the scope of action of the fully omnipotent empire", attribute: "Power" },
      { name: "Existence Control", description: "Determining what exists and what does not", detail: "The empire decides what is real, unmakes existing entities, and creates new forms of being from pure will", attribute: "Existential" },
    ],
    effectTemplates: ["Reality Creation Active", "Absolute Power Online", "Existence Control"],
    unlockTemplates: ["Reality Creator", "Power Absolute", "Existence Engine"],
    descriptionTemplate: "Attainment of omnipotence - unlimited power to do anything conceivable.",
    subDescriptionTemplate: "The empire becomes the source of all power, the unmoved mover behind all of existence.",
    detailsTemplate: "Omnipotent ascension phase where the empire achieves unlimited power. All physical, dimensional, and metaphysical constraints dissolve before the empire's will.",
  },
  "Eternal": {
    category: "Transcendent",
    tierStart: 94, tierCount: 3,
    tierNames: ["Eternal Seeker", "Eternal Being", "Eternal Lord"],
    rankNames: ["Time Seeker", "Time Lord", "Eternal Lord"],
    titles: ["The Timeless Seeker", "The Eternal Being", "The Eternal Lord"],
    subjectTemplates: [
      { name: "Timeless Existence", description: "Transcending all temporal limitations", detail: "Existence outside of time itself enables interaction with any moment in the temporal flow freely", attribute: "Temporal" },
      { name: "Death Transcendence", description: "Moving beyond the cycle of existence and non-existence", detail: "The empire transcends death itself, existing as an eternal constant regardless of temporal disruption", attribute: "Existential" },
      { name: "Causal Engineering", description: "Reshaping cause and effect relationships", detail: "Manipulating causality directly allows rewriting of history and predetermined control of future outcomes", attribute: "Causal" },
    ],
    effectTemplates: ["Timeless Existence Active", "Death Transcended", "Causal Engineering"],
    unlockTemplates: ["Time Transcender", "Existence Anchor", "Causality Engine"],
    descriptionTemplate: "Transcendence of time itself, achieving eternal existence beyond temporal limitations.",
    subDescriptionTemplate: "The empire steps outside the river of time, becoming an eternal constant in all possible histories.",
    detailsTemplate: "Eternal ascension phase where the empire transcends temporal existence. Time becomes a navigable medium rather than an inescapable flow.",
  },
  "Infinite": {
    category: "Transcendent",
    tierStart: 97, tierCount: 3,
    tierNames: ["Infinite Pioneer", "Infinite Master", "Supreme Omnipotent"],
    rankNames: ["Infinite Seeker", "Infinite Lord", "Supreme Omnipotent"],
    titles: ["The Infinite Pioneer", "The Infinite Master", "Supreme Omnipotent"],
    subjectTemplates: [
      { name: "Boundless Dominion", description: "Control beyond any limit or boundary", detail: "All concepts of space, time, matter, energy, and existence itself fall under absolute dominion of the infinite empire", attribute: "Absolute" },
      { name: "Ultimate Transcendence", description: "The final state of all possible advancement", detail: "The apex of all possible progression - a state beyond description, comprehension, or limitation of any kind", attribute: "Transcendent" },
      { name: "Infinite Creation", description: "Endlessly creating new forms of existence", detail: "The infinite empire perpetually creates new universes, dimensions, and forms of being as an expression of boundless will", attribute: "Creative" },
    ],
    effectTemplates: ["Infinite Dominion Active", "Ultimate Transcendence", "Infinite Creation"],
    unlockTemplates: ["Infinite Engine", "Transcendence Core", "Creation Matrix"],
    descriptionTemplate: "Achievement of infinite power and transcendence - the ultimate state of imperial advancement.",
    subDescriptionTemplate: "The empire achieves what no measure can contain: infinite power, infinite knowledge, infinite existence.",
    detailsTemplate: "The final tier of advancement. The empire transcends all conceivable limits, becoming a force of infinite creative and destructive power. The Planetary Settler has become the Supreme Omnipotent.",
  },
};

// ============================================================
// LOOKUP TABLES FOR CLASSIFICATIONS
// ============================================================

const CLASSES: KardashevClass[] = ["Alpha", "Beta", "Gamma", "Delta", "Omega"];
const SUB_CLASSES: KardashevSubClass[] = ["I", "II", "III", "IV", "V", "VI"];

const TYPES_BY_TIER_RANGE: Array<[number, number, KardashevType]> = [
  [1, 20, "Settler"],
  [21, 40, "Developer"],
  [41, 60, "Controller"],
  [61, 80, "Dominator"],
  [81, 99, "Transcendent"],
];

const SUB_TYPES: KardashevSubType[] = [
  "Nascent", "Emerging", "Established", "Dominant", "Supreme", "Ascendant", "Omnipotent",
];

const GLOBAL_RANKS = [
  "Pioneer", "Scout", "Settler", "Colonist", "Ranger", "Explorer", "Surveyor",
  "Lieutenant", "Captain", "Commander", "Colonel", "Brigadier", "General",
  "Admiral", "Fleet Admiral", "Grand Admiral", "Marshal", "Field Marshal",
  "Regent", "Viceroy", "Governor", "Sovereign", "Emperor", "High Emperor",
  "Galactic Ruler", "Galactic Emperor", "Universal Lord", "Universal Master",
  "Cosmic Lord", "Cosmic Emperor", "Transcendent Being", "Omnipotent Lord",
  "Supreme Commander", "Grand Sovereign", "Eternal Lord", "Infinite Being",
  "Ultimate Sovereign", "Supreme Omnipotent",
];

// ============================================================
// GENERATION HELPERS
// ============================================================

function getSubCategoryForTier(tier: number): KardashevSubCategory {
  for (const [subCat, meta] of Object.entries(SUB_CATEGORY_META) as Array<[KardashevSubCategory, SubCategoryMeta]>) {
    if (tier >= meta.tierStart && tier <= meta.tierStart + meta.tierCount - 1) {
      return subCat;
    }
  }
  return "Infinite"; // fallback
}

function getTypeForTier(tier: number): KardashevType {
  for (const [start, end, type] of TYPES_BY_TIER_RANGE) {
    if (tier >= start && tier <= end) return type;
  }
  return "Transcendent";
}

function getSubTypeForTier(tier: number): KardashevSubType {
  const typeRanges: Array<[number, number]> = [
    [1, 20], [21, 40], [41, 60], [61, 80], [81, 99],
  ];
  for (const [start, end] of typeRanges) {
    if (tier >= start && tier <= end) {
      const span = end - start;
      const pos = tier - start;
      const idx = Math.min(Math.floor((pos / span) * SUB_TYPES.length), SUB_TYPES.length - 1);
      return SUB_TYPES[idx];
    }
  }
  return "Omnipotent";
}

function generateStats(tier: number): KardashevStats {
  const scale = tier / 99;
  const pow = Math.pow(scale, 0.7);
  return {
    primary: {
      power: Math.round(pow * 999),
      efficiency: Math.round((0.1 + pow * 0.9) * 100),
      stability: Math.round((0.5 + pow * 0.5) * 100),
      expansion: Math.round(pow * 100),
    },
    secondary: {
      militaryStrength: Math.round(pow * 9999),
      diplomaticInfluence: Math.round(pow * 9999),
      scientificOutput: Math.round(pow * 9999),
      economicGrowth: Math.round(pow * 9999),
      culturalSpread: Math.round(pow * 9999),
      spiritualAscension: Math.round(pow * 9999),
    },
  };
}

function generateAttributes(tier: number): KardashevAttributes {
  const scale = tier / 99;
  const pow = Math.pow(scale, 0.6);
  return {
    primary: {
      dominance: Math.round(pow * 100),
      knowledge: Math.round(pow * 100),
      wisdom: Math.round(pow * 100),
      power: Math.round(pow * 100),
      harmony: Math.round((1 - Math.pow(1 - scale, 2)) * 100),
    },
    secondary: {
      resilience: Math.round((0.1 + pow * 0.9) * 100),
      adaptability: Math.round(pow * 100),
      creativity: Math.round(pow * 100),
      unity: Math.round(pow * 100),
      transcendence: Math.round(Math.pow(scale, 1.5) * 100),
    },
  };
}

function generateBonuses(tier: number) {
  const t = tier - 1;
  const scale = t / 98;
  return {
    resourceProduction: Math.round(scale * 5000),
    energyProduction: Math.round(scale * 5000),
    buildSpeed: Math.round(scale * 5000),
    researchSpeed: Math.round(scale * 5000),
    fleetPower: Math.round(scale * 8000),
    defensePower: Math.round(scale * 8000),
    maxPlanets: tier === 1 ? 1 : Math.round(Math.pow(10, 0.5 + scale * 5.5)),
    maxFleets: tier === 1 ? 1 : Math.round(Math.pow(10, 0.3 + scale * 5.7)),
    maxBuildings: Math.max(5, Math.round(5 + scale * 999995)),
    maxResearch: Math.max(3, Math.round(3 + scale * 9997)),
  };
}

function generateRequirements(tier: number) {
  if (tier === 1) return { requirementsMetal: 0, requirementsCrystal: 0, requirementsDeuterium: 0, requiredResearchPoints: 0 };
  const base = Math.pow(10, (tier - 1) * 15 / 98);
  return {
    requirementsMetal: Math.round(base * 1000),
    requirementsCrystal: Math.round(base * 750),
    requirementsDeuterium: Math.round(base * 500),
    requiredResearchPoints: Math.round(base * 100),
  };
}

function getLevelRange(tier: number): [number, number] {
  // Tiers 1-90 get 10 levels each (900 total), tiers 91-99 get 11 levels each (99 total) = 999
  if (tier <= 90) {
    const start = (tier - 1) * 10 + 1;
    return [start, start + 9];
  } else {
    const start = 900 + (tier - 91) * 11 + 1;
    return [start, start + 10];
  }
}

function getRankForTier(tier: number): string {
  const idx = Math.min(Math.floor(((tier - 1) / 98) * (GLOBAL_RANKS.length - 1)), GLOBAL_RANKS.length - 1);
  return GLOBAL_RANKS[idx];
}

// ============================================================
// GENERATE ALL 99 TIERS
// ============================================================

function buildTier(tier: number): KardashevTierExtended {
  const subCat = getSubCategoryForTier(tier);
  const meta = SUB_CATEGORY_META[subCat];
  const posInSubCat = tier - meta.tierStart;
  const name = meta.tierNames[posInSubCat] ?? meta.tierNames[meta.tierNames.length - 1];
  const rank = meta.rankNames[posInSubCat] ?? getRankForTier(tier);
  const title = meta.titles[posInSubCat] ?? meta.titles[meta.titles.length - 1];

  const classIdx = (tier - 1) % CLASSES.length;
  const subClassIdx = (tier - 1) % SUB_CLASSES.length;

  const subjects: KardashevSubject[] = meta.subjectTemplates.map(s => ({ ...s }));

  return {
    tier,
    name,
    category: meta.category,
    subCategory: subCat,
    class: CLASSES[classIdx],
    subClass: SUB_CLASSES[subClassIdx],
    type: getTypeForTier(tier),
    subType: getSubTypeForTier(tier),
    rank,
    title,
    description: meta.descriptionTemplate,
    subDescription: meta.subDescriptionTemplate,
    details: meta.detailsTemplate,
    stats: generateStats(tier),
    attributes: generateAttributes(tier),
    subjects,
    ...generateRequirements(tier),
    levelRange: getLevelRange(tier),
    bonuses: generateBonuses(tier),
    effects: meta.effectTemplates.map(e => `${e} (Tier ${tier})`),
    unlocks: meta.unlockTemplates.map(u => `${u} Mk.${posInSubCat + 1}`),
  };
}

export const KARDASHEV_TIERS_EXTENDED: Record<number, KardashevTierExtended> = (() => {
  const result: Record<number, KardashevTierExtended> = {};
  for (let t = 1; t <= 99; t++) {
    result[t] = buildTier(t);
  }
  return result;
})();

// ============================================================
// CATEGORY & SUB-CATEGORY REGISTRIES
// ============================================================

export const KARDASHEV_CATEGORIES: Record<KardashevCategory, {
  name: KardashevCategory;
  description: string;
  subDescription: string;
  tierRange: [number, number];
  subCategories: KardashevSubCategory[];
  color: string;
}> = {
  "Planetary": {
    name: "Planetary",
    description: "Mastery of a single planet and its surrounding space.",
    subDescription: "The earliest stage of civilizational growth, confined to one world. Seven domains of planetary mastery must be conquered before the stars beckon.",
    tierRange: [1, 21],
    subCategories: ["Local Planetary", "Regional Planetary", "Continental", "Oceanic", "Atmospheric", "Orbital", "Subterranean"],
    color: "green",
  },
  "Stellar": {
    name: "Stellar",
    description: "Command of star systems and their diverse stellar bodies.",
    subDescription: "The empire escapes its cradle world and masters the full diversity of stellar objects from binary stars to exotic neutron stars.",
    tierRange: [22, 42],
    subCategories: ["Binary Stellar", "Trinary Stellar", "Asteroid Belt", "Nebular", "Dwarf Stellar", "Giant Stellar", "Neutron Stellar"],
    color: "yellow",
  },
  "Galactic": {
    name: "Galactic",
    description: "Dominion spanning entire galaxies and galactic structures.",
    subDescription: "The empire grows to encompass hundreds of billions of stars, mastering galactic arms, cores, clusters, and the vast voids between galaxies.",
    tierRange: [43, 63],
    subCategories: ["Galactic Arm", "Galactic Core", "Star Cluster", "Cosmic Void", "Galactic Halo", "Cosmic Filament", "Supercluster"],
    color: "blue",
  },
  "Universal": {
    name: "Universal",
    description: "Control of universal-scale phenomena and the fundamental laws of physics.",
    subDescription: "The empire transcends conventional astronomy to manipulate dark matter, dark energy, quantum reality, and even parallel universes.",
    tierRange: [64, 81],
    subCategories: ["Observable Universe", "Dark Matter Domain", "Dark Energy Domain", "Quantum Realm", "Multiversal", "Dimensional"],
    color: "purple",
  },
  "Transcendent": {
    name: "Transcendent",
    description: "Existence beyond physical law, achieving metaphysical and infinite power.",
    subDescription: "The final stage of advancement. Physical reality is left behind as the empire ascends to metaphysical omniscience, omnipotence, eternal existence, and infinite transcendence.",
    tierRange: [82, 99],
    subCategories: ["Metaphysical", "Omniscient", "Omnipotent", "Eternal", "Infinite"],
    color: "gold",
  },
};

export const KARDASHEV_SUB_CATEGORIES: Record<KardashevSubCategory, {
  name: KardashevSubCategory;
  category: KardashevCategory;
  tierRange: [number, number];
  description: string;
}> = Object.fromEntries(
  (Object.entries(SUB_CATEGORY_META) as Array<[KardashevSubCategory, SubCategoryMeta]>).map(([subCat, meta]) => [
    subCat,
    {
      name: subCat,
      category: meta.category,
      tierRange: [meta.tierStart, meta.tierStart + meta.tierCount - 1] as [number, number],
      description: meta.descriptionTemplate,
    },
  ])
) as Record<KardashevSubCategory, { name: KardashevSubCategory; category: KardashevCategory; tierRange: [number, number]; description: string }>;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getExtendedTier(tier: number): KardashevTierExtended {
  const clamped = Math.max(1, Math.min(99, Math.round(tier)));
  return KARDASHEV_TIERS_EXTENDED[clamped];
}

export function getTierForLevel(level: number): number {
  const clamped = Math.max(1, Math.min(999, Math.round(level)));
  if (clamped <= 900) {
    return Math.ceil(clamped / 10);
  }
  return 91 + Math.floor((clamped - 901) / 11);
}

export function getLevelProgressWithinTier(level: number): { levelInTier: number; totalInTier: number; percentage: number } {
  const tier = getTierForLevel(level);
  const [start, end] = getLevelRange(tier);
  const totalInTier = end - start + 1;
  const levelInTier = level - start + 1;
  return { levelInTier, totalInTier, percentage: Math.round((levelInTier / totalInTier) * 100) };
}

export function calculateExtendedProgress(currentTier: number, metal: number, crystal: number, deuterium: number): number {
  if (currentTier >= 99) return 100;
  const next = KARDASHEV_TIERS_EXTENDED[currentTier + 1];
  if (!next || next.requirementsMetal === 0) return 100;
  const mp = Math.min(metal / next.requirementsMetal, 1);
  const cp = Math.min(crystal / next.requirementsCrystal, 1);
  const dp = Math.min(deuterium / next.requirementsDeuterium, 1);
  return Math.round(((mp + cp + dp) / 3) * 100);
}

export const TOTAL_TIERS = 99;
export const TOTAL_LEVELS = 999;
export const TOTAL_CATEGORIES = 5;
export const TOTAL_SUB_CATEGORIES = 32;
