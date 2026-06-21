/**
 * MASSIVE MASTERY SYSTEM GENERATOR
 * Generates:
 *   - 99 mastery tiers
 *   - 999 levels across skill trees
 *   - 90 categories with subcategories
 *   - 900 classes (90 categories × 10 subcategories)
 *   - 350 classes and subclasses
 *   - 190 types and subtypes for theme
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "shared", "config", "mastery");

try { mkdirSync(outDir, { recursive: true }); } catch {}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 99 MASTERY TIERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TIER_NAMES: string[] = [];
const TIER_PREFIXES = [
  "Novice","Initiate","Apprentice","Student","Acolyte","Disciple","Practitioner","Skilled",
  "Proficient","Competent","Capable","Adept","Seasoned","Veteran","Experienced","Accomplished",
  "Master","Expert","Specialist","Authority","Virtuoso","Luminary","Champion","Hero",
  "Mythic","Legendary","Epic","Peerless","Transcendent","Celestial","Divine","Ascendant",
  "Supreme","Sovereign","Overlord","Tyrant","Warlord","Conqueror","Dominator","Sovereign",
  "Titan","Colossus","Leviathan","Behemoth","Archon","Seraph","Cherub","Nephilim",
  "Elder","Ancient","Primordial","Cosmic","Stellar","Galactic","Universal","Infinite",
  "Omniscient","Omnipotent","Omnipresent","Alpha","Omega","Zenith","Apex","Pinnacle",
  "Crescendo","Fulcrum","Nexus","Aperture","Meridian","Zenith","Climax","Culmination",
  "Vanguard","Paragon","Exemplar","Prodigy","Sage","Oracle","Prophet","Visionary",
  "Ascendant","Celestial","Radiant","Luminous","Resplendent","Astral","Aetherial","Empyrean",
  "Ineffable","Unfathomable","Unimaginable","Transcendent","Incomprehensible","Absolute","Final","Ultimate","Supreme"
];
for (let i = 0; i < 99; i++) TIER_NAMES.push(TIER_PREFIXES[i] || `Tier-${i + 1}`);

const LEVELS_PER_TIER = Math.ceil(999 / 99);

interface MasteryTierDef {
  tier: number;
  name: string;
  color: string;
  minLevel: number;
  maxLevel: number;
  xpMultiplier: number;
  description: string;
}

const TIER_COLORS = [
  "#94a3b8","#8b9ab0","#7e94c0","#74a0d0","#69ade0","#5eb8f0",
  "#4cc3f7","#3bcdf8","#2dd8f5","#20e3ee","#19edd5","#22f5b8",
  "#34f09a","#4ae87d","#65de62","#82d24a","#9fc435","#bcc422",
  "#d8b814","#f2a80a","#ff9605","#ff8203","#ff6d02","#f55902",
  "#e64703","#d63606","#c6270b","#b51a11","#a6101a","#970925",
  "#880630","#78063c","#690849","#5b0c56","#4e1164","#421872",
  "#371f80","#2d288e","#25329c","#1f3caa","#1a47b8","#1752c6",
  "#155ed4","#146ae2","#1676f0","#1c82fc","#288eff","#3a9aff",
  "#4da8ff","#62b6ff","#78c4ff","#8ed2ff","#a4e0ff","#baeeff",
  "#d0fcff","#c4f0e8","#b8e4d0","#acd8b8","#a0ccA0","#94c088",
  "#88b470","#7ca858","#709c40","#649028","#588410","#4c7808",
  "#406c04","#346002","#285402","#1c4802","#103c02","#083004",
  "#042406","#021808","#021008","#020808","#020406","#020204",
  "#040208","#06020c","#080210","#0a0214","#0c0218","#0e021c",
  "#100220","#120224","#140228","#16022c","#180230","#1a0234",
  "#1c0238","#1e023c","#200240","#220244","#240248","#26024c",
  "#280250","#2a0254","#2c0258","#2e025c","#300260"
];

const masteryTiers: MasteryTierDef[] = [];
for (let i = 0; i < 99; i++) {
  const min = i * LEVELS_PER_TIER + 1;
  const max = Math.min((i + 1) * LEVELS_PER_TIER, 999);
  masteryTiers.push({
    tier: i + 1,
    name: TIER_NAMES[i],
    color: TIER_COLORS[i % TIER_COLORS.length],
    minLevel: min,
    maxLevel: max,
    xpMultiplier: 1 + (i * 0.15),
    description: `Tier ${i + 1} mastery — ${TIER_NAMES[i]} rank commanders.`,
  });
}

const tiersTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export const TOTAL_TIERS = 99;
export const TOTAL_LEVELS = 999;
export const LEVELS_PER_TIER = ${LEVELS_PER_TIER};

export interface MasteryTier {
  tier: number;
  name: string;
  color: string;
  minLevel: number;
  maxLevel: number;
  xpMultiplier: number;
  description: string;
}

export const MASTERY_TIERS: MasteryTier[] = ${JSON.stringify(masteryTiers, null, 2)};
`;

writeFileSync(resolve(outDir, "masteryTiers.ts"), tiersTs);
console.log(`✅ masteryTiers.ts — 99 tiers, ${999} levels`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 90 CATEGORIES WITH SUBCATEGORIES (900 total)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CATEGORY_SEEDS: Array<{ name: string; prefix: string; subs: string[]; icon: string; color: string }> = [
  { name: "Fleet Command", prefix: "FC", icon: "🚀", color: "#ef4444", subs: ["Battleline Tactics","Carrier Operations","Escourt Doctrine","Capital Ship Mastery","Fleet Logistics","Rapid Deployment","Flotilla Coordination","Armada Strategy","Naval Gunnery","Siege Warfare"] },
  { name: "Ground Warfare", prefix: "GW", icon: "⚔️", color: "#f97316", subs: ["Infantry Doctrine","Mech Armor","Urban Combat","Jungle Warfare","Arctic Operations","Desert Tactics","Mountain Assault","Amphibious Ops","Drop Pod Assault","Trench Warfare"] },
  { name: "Ordnance", prefix: "ORD", icon: "💥", color: "#dc2626", subs: ["Kinetic Weapons","Energy Weapons","Plasma Systems","Missile Tech","Torpedo Systems","Orbital Bombardment","EMP Warfare","Antimatter Weapons","Dark Matter Arms","Nova Charges"] },
  { name: "Defensive Systems", prefix: "DS", icon: "🛡️", color: "#2563eb", subs: ["Shield Matrix","Point Defense","Armor Plating","Electronic Countermeasures","Hull Reinforcement","Damage Control","Force Fields","Reflective Coating","Ablative Armor","Hardpoint Defense"] },
  { name: "Starship Engineering", prefix: "SSE", icon: "🔧", color: "#7c3aed", subs: ["Hull Design","Engine Systems","Power Core","Warp Drive","Impulse Motors","Thruster Array","Structural Integrity","Emergency Systems","Modular Design","Exotic Matter"] },
  { name: "Warp Technology", prefix: "WT", icon: "🌀", color: "#06b6d4", subs: ["Subspace Theory","Jump Gate Ops","Folding Space","Blink Drive","Quantum Tunneling","Wormhole Stabilization","Dimensional Bypass","Hyperlane Navigation","Slipstream Travel","Warp Bubble Control"] },
  { name: "Astrogation", prefix: "AST", icon: "🧭", color: "#0891b2", subs: ["Stellar Cartography","Deep Space Navigation","Gravitational Mapping","Asteroid Avoidance","Nebula Transit","Black Hole Skirting","Pulsar Timing","Galactic Positioning","Comet Trail Riding","Dark Sector Mapping"] },
  { name: "Communications", prefix: "COM", icon: "📡", color: "#0284c7", subs: ["Subspace Relay","Quantum Entanglement","Laser Comm","Tachyon Burst","Neutrino Beam","Ansible Network","Fleet Broadcast","Encrypted Channel","Emergency Signal","Universal Translator"] },
  { name: "Cyber Warfare", prefix: "CW", icon: "💻", color: "#4f46e5", subs: ["System Hacking","Viral Implants","Data Siphon","Firewall Bypass","Neural Jamming","Code Injection","Trojan Deployment","Logic Bomb","Decryption Suite","AI Countermeasures"] },
  { name: "Espionage", prefix: "ESP", icon: "🕵️", color: "#6366f1", subs: ["Infiltration","Sabotage","Disinformation","Cover Operations","Asset Recruitment","Dead Drops","Surveillance","Exfiltration","Deep Cover","Counter-Intelligence"] },
  { name: "Diplomacy", prefix: "DIP", icon: "🤝", color: "#8b5cf6", subs: ["Trade Negotiation","Treaty Drafting","Cultural Exchange","Mediation","Sanctions","Public Relations","Interstellar Law","Ambassador Training","Summit Planning","Peace Accord"] },
  { name: "Governance", prefix: "GOV", icon: "🏛️", color: "#a78bfa", subs: ["Colonial Administration","Tax Policy","Legal Framework","Bureaucracy","Public Services","Infrastructure Planning","Census Management","Civic Programs","Emergency Governance","Diplomatic Protocol"] },
  { name: "Mining Operations", prefix: "MNO", icon: "⛏️", color: "#d97706", subs: ["Asteroid Mining","Planetary Extraction","Deep Core Drilling","Gas Giant Harvesting","Ocean Mining","Glacier Excavation","Volcanic Sampling","Moon Quarry","Orbital Mining","Subsurface Radar"] },
  { name: "Refining", prefix: "REF", icon: "🏭", color: "#b45309", subs: ["Metal Processing","Crystal Synthesis","Deuterium Fusion","Alloy Smelting","Gas Purification","Isotope Separation","Nanomaterial Production","Rare Element Extraction","Plasma Refining","Carbon Cycling"] },
  { name: "Manufacturing", prefix: "MFG", icon: "⚙️", color: "#92400e", subs: ["Component Assembly","Weapon Fabrication","Ship Construction","Electronic Manufacturing","Chemical Synthesis","Bio-Engineering","3D Printing","Mass Production","Custom Fabrication","Nano Assembly"] },
  { name: "Energy Systems", prefix: "ENS", icon: "⚡", color: "#eab308", subs: ["Solar Collection","Fusion Reactors","Antimatter Cells","Zero-Point Energy","Plasma Conduits","Bio-Electricity","Dark Energy Tap","Stellar Engine","Energy Storage","Power Distribution"] },
  { name: "Propulsion", prefix: "PRP", icon: "💨", color: "#a3e635", subs: ["Ion Thrusters","Fusion Drive","Antimatter Drive","Solar Sail","Ramscoop","Mass Driver","Photon Sail","Plasma Thruster","Graviton Drive","Alcubierre Drive"] },
  { name: "Biology", prefix: "BIO", icon: "🧬", color: "#22c55e", subs: ["Xenobiology","Genetic Engineering","Bio-Synthesis","Pathogen Study","Ecological Design","Terraforming","Cloning","Cryogenics","DNA Repair","Microbiome"] },
  { name: "Medicine", prefix: "MED", icon: "🏥", color: "#16a34a", subs: ["Trauma Surgery","Nanomedicine","Regeneration","Stasis Medicine","Neural Repair","Immune Enhancement","Genetic Therapy","Radiation Treatment","Bio-Prosthetics","Emergency Med"] },
  { name: "Chemistry", prefix: "CHM", icon: "🧪", color: "#15803d", subs: ["Organic Synthesis","Inorganic Compounds","Polymer Science","Catalysis","Electrochemistry","Photochemistry","Thermochemistry","Quantum Chemistry","Astrochemistry","Nanochemistry"] },
  { name: "Physics", prefix: "PHY", icon: "⚛️", color: "#84cc16", subs: ["Quantum Mechanics","Relativity","Thermodynamics","Electromagnetism","Nuclear Physics","Particle Physics","String Theory","Plasma Physics","Gravitational Theory","Dark Matter Physics"] },
  { name: "Mathematics", prefix: "MTH", icon: "📐", color: "#10b981", subs: ["Calculus","Topology","Number Theory","Statistics","Linear Algebra","Complex Analysis","Graph Theory","Chaos Theory","Information Theory","Category Theory"] },
  { name: "Computer Science", prefix: "CS", icon: "🖥️", color: "#14b8a6", subs: ["Algorithms","Machine Learning","Quantum Computing","Distributed Systems","Cryptography","Neural Networks","Compiler Design","Data Structures","Operating Systems","Network Protocols"] },
  { name: "Materials Science", prefix: "MAT", icon: "🔬", color: "#0d9488", subs: ["Metallurgy","Ceramics","Composites","Polymers","Semiconductors","Superconductors","Nanomaterials","Biomaterials","Smart Materials","Exotic Matter"] },
  { name: "Robotics", prefix: "ROB", icon: "🤖", color: "#0f766e", subs: ["Drone Systems","Manipulator Arms","Autonomous Nav","Swarm Logic","Humanoid Design","Soft Robotics","Bio-Robots","Micro-Bots","Mecha Frames","Robotic Surgery"] },
  { name: "Artificial Intelligence", prefix: "AI", icon: "🧠", color: "#134e4a", subs: ["Neural Architecture","Natural Language","Computer Vision","Decision Systems","Pattern Recognition","Predictive Models","Generative AI","Ethical AI","Self-Evolving AI","Collective Intelligence"] },
  { name: "Quantum Sciences", prefix: "QS", icon: "🔮", color: "#7c3aed", subs: ["Quantum Computing","Quantum Encryption","Quantum Sensors","Quantum Teleportation","Quantum Entanglement","Quantum Field Theory","Loop Quantum Gravity","Quantum Cosmology","Quantum Biology","Quantum Metrology"] },
  { name: "Exotic Matter", prefix: "XM", icon: "💎", color: "#c084fc", subs: ["Dark Matter Manipulation","Antimatter Containment","Strange Matter","Exotic States","Negative Energy","Phased Matter","Tachyon Fields","Spacetime Foam","Vacuum Energy","Dimensional Matter"] },
  { name: "Gravitics", prefix: "GRV", icon: "🌍", color: "#a855f7", subs: ["Gravity Control","Anti-Gravity","Graviton Emission","Tidal Manipulation","Orbital Mechanics","Gravity Lensing","Mass Reduction","Spacetime Warping","Gravity Shields","Gravitational Waves"] },
  { name: "Astrometrics", prefix: "AM", icon: "🌟", color: "#9333ea", subs: ["Stellar Classification","Cosmic Distance","Redshift Analysis","Spectroscopy","Astrophotometry","Radio Astronomy","X-Ray Astronomy","Neutrino Astronomy","Gravitational Mapping","Exoplanet Detection"] },
  { name: "Planetary Science", prefix: "PS", icon: "🪐", color: "#7e22ce", subs: ["Geology","Atmospheric Science","Oceanography","Climatology","Seismology","Volcanology","Glaciology","Paleontology","Mineralogy","Geomorphology"] },
  { name: "Terraforming", prefix: "TFR", icon: "🌱", color: "#6b21a8", subs: ["Atmosphere Seeding","Water Generation","Soil Chemistry","Temperature Control","Ecosystem Design","Pollution Cleanup","Biome Creation","Weather Control","Magnetic Field Gen","Ocean Seeding"] },
  { name: "Colonization", prefix: "COL", icon: "🏠", color: "#581c87", subs: ["Settlement Design","Life Support","Colony Management","Resource Allocation","Expansion Planning","Population Growth","Cultural Preservation","Frontier Survival","Outpost Building","Habitat Modules"] },
  { name: "Architecture", prefix: "ARC", icon: "🏗️", color: "#3b0764", subs: ["Space Stations","Orbital Habitats","Planetary Cities","Deep Space Platforms","Underground Bunkers","Floating Cities","Dyson Structures","Ring Worlds","Mega-Structures","Asteroid Bases"] },
  { name: "Logistics", prefix: "LOG", icon: "📦", color: "#1e3a5f", subs: ["Supply Chains","Warehouse Systems","Route Optimization","Cargo Management","Fleet Scheduling","Inventory Control","Distribution Networks","Cold Storage","Emergency Reserves","Just-In-Time"] },
  { name: "Trading", prefix: "TRD", icon: "💰", color: "#ca8a04", subs: ["Commodity Markets","Futures Trading","Arbitrage","Currency Exchange","Risk Management","Market Analysis","Trade Routes","Supply-Demand","Price Controls","Bazaar Networks"] },
  { name: "Finance", prefix: "FIN", icon: "📊", color: "#a16207", subs: ["Investment Banking","Credit Systems","Insurance","Bond Markets","Venture Capital","Asset Management","Fiscal Policy","Monetary Theory","Accounting","Auditing"] },
  { name: "Economics", prefix: "ECO", icon: "📈", color: "#854d0e", subs: ["Microeconomics","Macroeconomics","Game Theory","Behavioral Econ","Development Econ","International Trade","Labor Economics","Public Finance","Industrial Organization","Econometrics"] },
  { name: "Social Sciences", prefix: "SSC", icon: "👥", color: "#713f12", subs: ["Sociology","Psychology","Anthropology","Political Science","Geography","Demography","Criminology","Linguistics","Archaeology","Ethnography"] },
  { name: "Cultural Studies", prefix: "CST", icon: "🎭", color: "#422006", subs: ["Art History","Literature","Music Theory","Philosophy","Religious Studies","Folklore","Mythology","Cinema Studies","Fashion Theory","Culinary Arts"] },
  { name: "Education", prefix: "EDU", icon: "📚", color: "#1d4ed8", subs: ["Pedagogy","Curriculum Design","E-Learning","Mentorship","Assessment Methods","Special Education","Adult Education","Training Systems","Knowledge Management","Academic Research"] },
  { name: "Leadership", prefix: "LDR", icon: "👑", color: "#4338ca", subs: ["Command Presence","Decision Making","Team Building","Conflict Resolution","Strategic Planning","Motivation","Delegation","Crisis Management","Vision Setting","Change Management"] },
  { name: "Strategy", prefix: "STR", icon: "♟️", color: "#3730a3", subs: ["Grand Strategy","Operational Planning","Tactical Doctrine","Wargaming","Intelligence Analysis","Force Projection","Asymmetric Warfare","Deterrence","Alliance Strategy","Economic Warfare"] },
  { name: "Tactics", prefix: "TAC", icon: "🎯", color: "#312e81", subs: ["Flanking Maneuvers","Ambush Tactics","Blitzkrieg","Defensive Posture","Combined Arms","Hit and Run","Siege Tactics","Retreat and Regroup","Night Operations","Amphibious Assault"] },
  { name: "Reconnaissance", prefix: "REC", icon: "👁️", color: "#1e1b4b", subs: ["Scout Ships","Probe Drones","Sensor Sweeps","Recon Fighters","Stealth Scans","Long Range Detection","Signal Intelligence","Visual Surveillance","Infrared Mapping","Gravitational Sensing"] },
  { name: "Supply Chain", prefix: "SCC", icon: "🔗", color: "#0c4a6e", subs: ["Procurement","Vendor Relations","Quality Control","Transportation","Warehousing","Reverse Logistics","Procurement Ethics","Global Sourcing","Inventory Analytics","Demand Forecasting"] },
  { name: "Construction", prefix: "CON", icon: "🔩", color: "#075985", subs: ["Foundation Work","Structural Assembly","Interior Fit-Out","Exterior Cladding","Mechanical Systems","Electrical Systems","Plumbing","Fire Safety","Seismic Retrofitting","Smart Building"] },
  { name: "Infrastructure", prefix: "INF", icon: "🌉", color: "#0369a1", subs: ["Road Networks","Power Grids","Water Systems","Communication Lines","Transport Hubs","Public Transit","Telecommunications","Waste Management","Green Infrastructure","Smart Cities"] },
  { name: "Environmental", prefix: "ENV", icon: "🌿", color: "#0e7490", subs: ["Pollution Control","Conservation","Renewable Energy","Carbon Capture","Water Treatment","Soil Remediation","Wildlife Protection","Climate Modeling","Waste Recycling","Sustainable Design"] },
  { name: "Agriculture", prefix: "AGR", icon: "🌾", color: "#0891b2", subs: ["Hydroponics","Vertical Farming","Genetic Crops","Aquaculture","Agroforestry","Soil Science","Pest Management","Irrigation Systems","Food Processing","Agricultural Robotics"] },
  { name: "Food Science", prefix: "FDS", icon: "🍽️", color: "#155e75", subs: ["Nutrition","Food Preservation","Fermentation","Food Chemistry","Packaging Science","Flavor Science","Food Safety","Microbiology","Dietary Engineering","Synthetic Nutrition"] },
  { name: "Textiles", prefix: "TEX", icon: "🧵", color: "#164e63", subs: ["Fiber Science","Weaving","Dyeing","Smart Fabrics","Protective Clothing","Nanofibers","Bio-Textiles","Sustainable Fabrics","Military Gear","Space Suits"] },
  { name: "Transportation", prefix: "TRN", icon: "🚄", color: "#1e3a5f", subs: ["Ground Transport","Air Transport","Space Transport","Maglev Systems","Hyperloop","Autonomous Vehicles","Public Transit","Freight Systems","Interplanetary Travel","Pedestrian Design"] },
  { name: "Mining Technology", prefix: "MNT", icon: "🔨", color: "#44403c", subs: ["Drilling Systems","Blasting Tech","Conveyor Systems","Ventilation","Rock Mechanics","Mine Safety","Automation","Exploration Geophysics","Tailings Management","Mine Reclamation"] },
  { name: "Energy Harvesting", prefix: "EHR", icon: "🔋", color: "#57534e", subs: ["Piezoelectric","Thermoelectric","Triboelectric","Photovoltaic","Wind Turbines","Tidal Energy","Geothermal","Biomass","Hydroelectric","Osmotic Power"] },
  { name: "Entertainment", prefix: "ENT", icon: "🎮", color: "#78716c", subs: ["Game Design","Virtual Reality","Holographic Theater","Music Production","Sports Systems","Social Gaming","Immersive Cinema","Theme Parks","Interactive Art","Digital Fashion"] },
  { name: "Tourism", prefix: "TRS", icon: "✈️", color: "#a8a29e", subs: ["Space Tourism","Planetary Resorts","Adventure Travel","Cultural Tourism","Eco-Tourism","Luxury Cruises","Historical Sites","Wildlife Tours","Medical Tourism","Dark Tourism"] },
  { name: "Archaeology", prefix: "ARC2", icon: "🏺", color: "#78716c", subs: ["Excavation Methods","Dating Techniques","Artifact Conservation","Paleolithic Studies","Marine Archaeology","Aerial Survey","DNA Analysis","3D Scanning","Digital Reconstruction","Cultural Heritage"] },
  { name: "History", prefix: "HIS", icon: "📜", color: "#a16207", subs: ["Ancient Civilizations","Medieval Period","Renaissance","Industrial Revolution","Modern History","Military History","Maritime History","Economic History","Technological History","Social History"] },
  { name: "Linguistics", prefix: "LIN", icon: "💬", color: "#4d7c0f", subs: ["Phonetics","Syntax","Semantics","Pragmatics","Sociolinguistics","Computational Linguistics","Historical Linguistics","Neurolinguistics","Applied Linguistics","Language Documentation"] },
  { name: "Hazardous Materials", prefix: "HZM", icon: "☢️", color: "#dc2626", subs: ["Radiation Handling","Chemical Safety","Biological Hazards","Nuclear Waste","Plasma Containment","Antimatter Safety","Exotic Materials","Emergency Response","Decontamination","Hazard Assessment"] },
  { name: "Emergency Systems", prefix: "EMS", icon: "🚨", color: "#ea580c", subs: ["Evacuation Procedures","Fire Suppression","Flood Control","Seismic Response","Medical Emergency","Hazmat Response","Search and Rescue","Crisis Communication","Disaster Recovery","Civil Defense"] },
  { name: "Intelligence", prefix: "INT", icon: "🔍", color: "#7c2d12", subs: ["SIGINT","HUMINT","MASINT","GEOINT","OSINT","CYBINT","TECHINT","COMINT","FISINT","RADINT"] },
  { name: "Counter-Intelligence", prefix: "CI", icon: "🔒", color: "#431407", subs: ["Mole Hunting","Deception Ops","Double Agents","Defensive Security","Compartmentalization","Polygraph Systems","Surveillance Detection","Damage Assessment","Source Protection","Disinformation"] },
  { name: "Security", prefix: "SEC", icon: "🔐", color: "#1c1917", subs: ["Perimeter Defense","Access Control","Threat Assessment","Physical Security","Network Security","Personnel Security","Facility Security","Transport Security","Maritime Security","Space Security"] },
  { name: "Propaganda", prefix: "PRO", icon: "📺", color: "#44403c", subs: ["Media Control","Public Messaging","Cultural Influence","Digital Propaganda","Censorship","Narrative Shaping","Emotional Appeals","Myth Making","Symbolism","Counter-Narrative"] },
  { name: "Psychological Ops", prefix: "PSY", icon: "🧠", color: "#57534e", subs: ["Morale Operations","Deception","Intimidation","Recruitment","Information Warfare","Cultural Operations","Leaflet Campaigns","Radio Broadcasts","Social Media Ops","Cognitive Warfare"] },
  { name: "Naval Architecture", prefix: "NAR", icon: "🚢", color: "#0369a1", subs: ["Hull Design","Hydrodynamics","Buoyancy Systems","Marine Propulsion","Deck Systems","Navigation Equipment","Safety Systems","Weather Resistance","Underwater Design","Ice Breaking"] },
  { name: "Aerospace", prefix: "AER", icon: "✈️", color: "#1d4ed8", subs: ["Aerodynamics","Flight Control","Avionics","Propulsion Integration","Thermal Protection","Structural Design","Cockpit Systems","Landing Gear","Payload Integration","Flight Testing"] },
  { name: "Ordnance Engineering", prefix: "ORE", icon: "💣", color: "#b91c1c", subs: ["Explosive Design","Fuze Systems","Warhead Design","Propellant Tech","Ballistics","Guidance Systems","Detonation Sequencing","Safety Mechanisms","Fuzing Logic","Warhead Materials"] },
  { name: "Ballistics", prefix: "BAL", icon: "🎯", color: "#991b1b", subs: ["External Ballistics","Terminal Ballistics","Interior Ballistics","Trajectory Computing","Wind Correction","Gravity Compensation","Ricochet Analysis","Penetration Mechanics","Fragmentation","Armor Defeat"] },
  { name: "Explosives", prefix: "EXP", icon: "🧨", color: "#7f1d1d", subs: ["High Explosives","Low Explosives","Shaped Charges","Thermobaric","Plastic Explosives","Propellants","Pyrotechnics","Chemical Synthesis","Safety Protocols","Storage Systems"] },
  { name: "Warhead Design", prefix: "WDS", icon: "💨", color: "#6b1212", subs: ["Kinetic Warheads","Cluster Munitions","Penetrators","Incendiary","Nuclear Warheads"," EMP Warheads","Chemical Warheads","Biological Warheads","Stealth Warheads","Smart Warheads"] },
  { name: "Bio-Engineering", prefix: "BEN", icon: "🧫", color: "#15803d", subs: ["Gene Editing","Protein Engineering","Synthetic Biology","Bioinformatics","Metabolic Engineering","Tissue Engineering","Bioprinting","Bioremediation","Enzyme Design","Bio-Informatics"] },
  { name: "Nanotechnology", prefix: "NAN", icon: "🔬", color: "#166534", subs: ["Molecular Assembly","Nanobots","Nanomedicine","Nanoelectronics","Nanomaterials","Nanophotonics","Nanofabrication","Nano-Optics","Nano-Fluidics","Nano-Bio Interface"] },
  { name: "Plasma Physics", prefix: "PLP", icon: "🔮", color: "#7e22ce", subs: ["Magnetic Confinement","Inertial Fusion","Plasma Acceleration","Plasma Thrusters","Plasma Cutting","Plasma Chemistry","Plasma Diagnostics","Plasma Instabilities","Plasma Turbulence","Plasma Astrophysics"] },
  { name: "Thermal Engineering", prefix: "THE", icon: "🌡️", color: "#dc2626", subs: ["Heat Transfer","Cryogenics","Thermal Insulation","Cooling Systems","Heat Exchangers","Thermal Management","Phase Change","Radiative Cooling","Thermal Shock","Heat Pipes"] },
  { name: "Optics", prefix: "OPT", icon: "🔭", color: "#2563eb", subs: ["Laser Technology","Adaptive Optics","Fiber Optics","Lens Design","Spectroscopy","Holography","Photonic Computing","Quantum Optics","Nonlinear Optics","Metamaterial Optics"] },
  { name: "Acoustics", prefix: "ACO", icon: "🔊", color: "#1d4ed8", subs: ["Sonar Systems","Noise Control","Ultrasonics","Acoustic Materials","Room Acoustics","Psychoacoustics","Acoustic Holography","Structural Acoustics","Bioacoustics","Acoustic Metamaterials"] },
  { name: "Semiconductor", prefix: "SEM", icon: "💾", color: "#4f46e5", subs: ["Chip Design","Photolithography","Doping","Clean Room","Wafer Processing","Packaging","Testing","Yield Optimization","New Materials","Quantum Dots"] },
  { name: "Power Systems", prefix: "PWS", icon: "🔌", color: "#ea580c", subs: ["Grid Management","Transformer Design","Power Electronics","Battery Systems","Fuel Cells","Capacitor Banks","Superconducting Cables","Microgrids","Smart Grids","Wireless Power"] },
  { name: "Storage Systems", prefix: "STS", icon: "📦", color: "#c2410c", subs: ["Battery Tech","Hydrogen Storage","Compressed Gas","Flywheels","Pumped Hydro","Thermal Storage","Chemical Storage","Gravitational","Magnetic Storage","Nuclear Storage"] },
  { name: "Waste Management", prefix: "WAM", icon: "♻️", color: "#16a34a", subs: ["Recycling","Composting","Incineration","Landfill Management","Hazardous Waste","E-Waste","Plasma Gasification","Bioremediation","Zero Waste","Circular Economy"] },
  { name: "Water Systems", prefix: "WAS", icon: "💧", color: "#0284c7", subs: ["Desalination","Water Purification","Piping Systems","Reservoir Design","Rainwater Harvesting","Greywater Reuse","Flood Control","Aquifer Management","Ice Harvesting","Atmospheric Water"] },
  { name: "Atmospheric Science", prefix: "ATM", icon: "🌤️", color: "#0ea5e9", subs: ["Meteorology","Climate Science","Air Quality","Atmospheric Chemistry","Cloud Physics","Radiation Budget","Weather Modeling","Extreme Weather","Atmospheric Dynamics","Paleoclimate"] },
  { name: "Seismology", prefix: "SEI", icon: "🏔️", color: "#78716c", subs: ["Earthquake Detection","Seismic Waves","Fault Analysis","Tsunami Warning","Seismic Tomography","Microseismic Monitoring","Induced Seismicity","Seismic Hazard","Building Codes","Early Warning"] },
  { name: "Volcanology", prefix: "VLC", icon: "🌋", color: "#dc2626", subs: ["Magma Dynamics","Eruption Prediction","Volcanic Gases","Lava Flows","Pyroclastic Flows","Volcanic Hazards","Geothermal Energy","Volcanic Soils","Monitoring Systems","Volcanic Petrology"] },
  { name: "Oceanography", prefix: "OCN", icon: "🌊", color: "#0284c7", subs: ["Physical Oceanography","Chemical Oceanography","Marine Biology","Deep Sea Exploration","Ocean Currents","Tidal Systems","Coral Reef Science","Marine Geology","Polar Oceans","Ocean Acidification"] },
  { name: "Glaciology", prefix: "GLC", icon: "🧊", color: "#93c5fd", subs: ["Ice Core Analysis","Glacial Dynamics","Permafrost","Ice Sheet Modeling","Glacial Erosion","Sea Ice","Iceberg Tracking","Cryoconite","Glacial Lakes","Paleoglaciology"] },
  { name: "Demography", prefix: "DEM", icon: "📊", color: "#6366f1", subs: ["Population Dynamics","Migration Patterns","Fertility Studies","Mortality Analysis","Age Structure","Urbanization","Population Forecasting","Census Methods","Spatial Demography","Historical Demography"] },
  { name: "Anthropology", prefix: "ANT", icon: "🗿", color: "#a16207", subs: ["Cultural Anthropology","Physical Anthropology","Archaeological Anthropology","Linguistic Anthropology","Medical Anthropology","Digital Anthropology","Urban Anthropology","Applied Anthropology","Visual Anthropology","Business Anthropology"] },
  { name: "Political Science", prefix: "POL", icon: "🗳️", color: "#1e40af", subs: ["Comparative Politics","International Relations","Political Theory","Public Administration","Political Economy","Electoral Systems","Constitutional Law","Political Behavior","Conflict Studies","Political Communication"] },
  { name: "Philosophy", prefix: "PHI", icon: "🤔", color: "#5b21b6", subs: ["Ethics","Epistemology","Metaphysics","Logic","Aesthetics","Political Philosophy","Philosophy of Mind","Philosophy of Science","Existentialism","Phenomenology"] },
  { name: "Law", prefix: "LAW", icon: "⚖️", color: "#1e3a5f", subs: ["Criminal Law","Civil Law","International Law","Corporate Law","Environmental Law","Space Law","Cyber Law","Intellectual Property","Human Rights","Maritime Law"] },
  { name: "Ethics", prefix: "ETH", icon: "🎖️", color: "#7c2d12", subs: ["Bioethics","AI Ethics","Military Ethics","Environmental Ethics","Medical Ethics","Business Ethics","Research Ethics","Engineering Ethics","Digital Ethics","Space Ethics"] },
  { name: "Public Health", prefix: "PHL", icon: "🏥", color: "#16a34a", subs: ["Epidemiology","Health Policy","Community Health","Global Health","Mental Health","Occupational Health","Environmental Health","Health Education","Biostatistics","Health Systems"] },
  { name: "Nutrition", prefix: "NUT", icon: "🥗", color: "#65a30d", subs: ["Clinical Nutrition","Sports Nutrition","Military Nutrition","Space Nutrition","Pediatric Nutrition","Geriatric Nutrition","Nutraceuticals","Diet Planning","Supplementation","Metabolic Science"] },
  { name: "Sports Science", prefix: "SPT", icon: "🏅", color: "#ea580c", subs: ["Exercise Physiology","Biomechanics","Sport Psychology","Performance Analysis","Recovery Science","Training Methods","Nutrition for Sports","Anti-Doping","Equipment Design","Athletic Performance"] },
];

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories: SkillSubcategory[];
}

interface SkillSubcategory {
  id: string;
  name: string;
  description: string;
  skillCount: number;
}

const categories: SkillCategory[] = CATEGORY_SEEDS.map((seed, idx) => ({
  id: `cat_${seed.prefix.toLowerCase()}_${idx + 1}`,
  name: seed.name,
  icon: seed.icon,
  color: seed.color,
  description: `Mastery in ${seed.name.toLowerCase()} for stellar empire command.`,
  subcategories: seed.subs.map((sub, si) => ({
    id: `sub_${seed.prefix.toLowerCase()}_${idx + 1}_${si + 1}`,
    name: sub,
    description: `Specialization in ${sub.toLowerCase()}.`,
    skillCount: 10,
  })),
}));

const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

const categoriesTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export const TOTAL_CATEGORIES = ${categories.length};
export const TOTAL_SUBCATEGORIES = ${totalSubcategories};

export interface SkillSubcategory {
  id: string;
  name: string;
  description: string;
  skillCount: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories: SkillSubcategory[];
}

export const SKILL_CATEGORIES: SkillCategory[] = ${JSON.stringify(categories, null, 2)};
`;

writeFileSync(resolve(outDir, "skillCategories.ts"), categoriesTs);
console.log(`✅ skillCategories.ts — ${categories.length} categories, ${totalSubcategories} subcategories`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 900 CLASS ENTRIES (distributed across categories)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ClassEntry {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  description: string;
  maxLevel: number;
  icon: string;
  color: string;
  primaryStat: string;
  secondaryStat: string;
  passiveBonus: string;
  activeAbility: string;
}

const STAT_KEYS = [
  "attackPower","defenseRating","fleetSpeed","researchRate","buildSpeed","resourceOutput",
  "tradeBonus","diplomacyRating","espionagePower","colonyGrowth","criticalStrike","evasion",
  "morale","leadershipRadius","intelRange","shipCapacity","shieldStrength","weaponAccuracy",
  "fuelEfficiency","constructionCost"
];

const PASSIVE_TEMPLATES = [
  "+{v}% {s} bonus","-{v}% {s} penalty","+{v}% to all {s}","+{v} flat {s}",
  "+{v}% {s} per tier","-{v}% {s} cost","+{v} {s} aura","+{v}% {s} efficiency"
];
const ACTIVE_TEMPLATES = [
  "Surge of {s}: +{v}% for 30s","Fortify: +{v}% {s} for 20s",
  "Overcharge: +{v}% {s} at cost of fuel","Emergency: restore {v} {s}",
  "Focus: double {s} for 15s","Rally: +{v}% {s} to fleet"
];

const classEntries: ClassEntry[] = [];
for (const cat of categories) {
  for (const sub of cat.subcategories) {
    classEntries.push({
      id: `cls_${sub.id}`,
      name: sub.name,
      categoryId: cat.id,
      categoryName: cat.name,
      subcategoryId: sub.id,
      subcategoryName: sub.name,
      description: `Mastery class for ${sub.name.toLowerCase()}.`,
      maxLevel: 999,
      icon: cat.icon,
      color: cat.color,
      primaryStat: STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)],
      secondaryStat: STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)],
      passiveBonus: pick(PASSIVE_TEMPLATES).replace("{v}", String(Math.floor(Math.random() * 20) + 1)).replace(/\{s\}/g, "stat"),
      activeAbility: pick(ACTIVE_TEMPLATES).replace("{v}", String(Math.floor(Math.random() * 50) + 10)).replace(/\{s\}/g, "stat"),
    });
  }
}

const classesTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export const TOTAL_CLASSES = ${classEntries.length};

export interface ClassEntry {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  description: string;
  maxLevel: number;
  icon: string;
  color: string;
  primaryStat: string;
  secondaryStat: string;
  passiveBonus: string;
  activeAbility: string;
}

export const CLASS_ENTRIES: ClassEntry[] = ${JSON.stringify(classEntries, null, 2)};
`;

writeFileSync(resolve(outDir, "classEntries.ts"), classesTs);
console.log(`✅ classEntries.ts — ${classEntries.length} class entries`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 350 CLASSES AND SUBCLASSES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DOMAINS = ["Warfare","Science","Economy","Leadership","Exploration","Mysticism"] as const;
type Domain = typeof DOMAINS[number];

const CLASS_TEMPLATES: Record<Domain, Array<{ name: string; tagline: string; subClasses: string[]; icon: string }>> = {
  Warfare: [
    { name: "Grand Admiral", tagline: "Supreme Fleet Commander", subClasses: ["Dreadnought Commander","Carrier Admiral","Battlecruiser Captain","Destroyer Lead","Frigate Commander","Cruiser Tactician","Flagship Operator","Armada Director","Fleet Marshal","Strike Force Lead"], icon: "👑" },
    { name: "Battle Commander", tagline: "Frontline War Leader", subClasses: ["Assault Commander","Siege Master","Rapid Strike Lead","Holdout Commander","Flanking Expert","Combined Arms Lead","Blitz Commander","Defensive Anchor","Trench Master","Spearhead Lead"], icon: "⚔️" },
    { name: "Weapons Specialist", tagline: "Armament Virtuoso", subClasses: ["Kinetic Expert","Energy Weapons Master","Plasma Specialist","Missile Commander","Torpedo Expert","Orbital Bombardier","EMP Tactician","Dark Matter Gunner","Nova Charge Master","Exotic Weapons Lead"], icon: "💥" },
    { name: "Shield Master", tagline: "Defense Architect", subClasses: ["Bubble Shield Expert","Point Defense Lead","Armor Specialist","Hull Engineer","Damage Control Lead","Force Field Master","Reflective Defense","Ablative Expert","Hardpoint Commander","Layered Defense Lead"], icon: "🛡️" },
    { name: "Strike Commander", tagline: "Surgical Assault Leader", subClasses: ["Assault Drop Lead","Precision Strike","Sabotage Commander","Target Elimination","Hit Squad Lead","Wetwork Commander","Decapitation Strike","Strategic Removal","Raider Commander","Night Assault Lead"], icon: "🎯" },
    { name: "Siege Marshal", tagline: "Fortification Breaker", subClasses: ["Planetary Bombardier","Station Breaker","Orbital Siege Master","Trench Breaker","Wall Breaker","Bunker Buster","Dome Destroyer","Gate Crusher","Breach Commander","Devastation Lead"], icon: "💣" },
    { name: "Interceptor Lead", tagline: "Fast Attack Commander", subClasses: ["Corvette Commander","Squadron Lead","Interceptor Ace","Scout Wing Lead","Picket Commander","Screen Lead","Chase Commander","Outrider Lead","Vanguard Commander","Pursuit Master"], icon: "🚀" },
    { name: "Defensive Marshal", tagline: "Fortress Commander", subClasses: ["Station Commander","Planetary Defense Lead","Orbital Defense Master","Garrison Commander","Bastion Lead","Citadel Commander","Fortress Architect","Bunker Commander","Bulwark Lead","Wall Commander"], icon: "🏰" },
    { name: "Fleet Tactician", tagline: "Battle Strategy Master", subClasses: ["Formation Expert","Flanking Specialist","Encirclement Master","Withdrawal Tactician","Pursuit Planner","Ambush Commander","Feint Master","Crossfire Expert","Hammer Anvil Lead","Mobile Warfare Lead"], icon: "♟️" },
    { name: "Warlord", tagline: "Conquest Champion", subClasses: ["Sector Warlord","System Conqueror","Galactic Warlord","Frontier Warlord","Pirate King","Rebel Commander","Insurgent Lead","Liberation Commander","Expansion Warlord","Dominion Warlord"], icon: "🏴" },
  ],
  Science: [
    { name: "Chief Scientist", tagline: "Research Director", subClasses: ["Quantum Researcher","Astrophysics Lead","Xenobiology Director","Materials Scientist","Theoretical Physics Lead","Experimental Science Lead","Applied Research Director","Innovation Director","Discovery Lead","Breakthrough Specialist"], icon: "🔬" },
    { name: "Technology Architect", tagline: "Tech Systems Master", subClasses: ["Quantum Computing Lead","AI Systems Architect","Network Design Lead","Cybernetics Director","Holographics Lead","Nanotechnology Lead","Robotics Director","Biotech Architect","Energy Tech Lead","Exotic Tech Specialist"], icon: "💻" },
    { name: "Medic General", tagline: "Medical Corps Commander", subClasses: ["Trauma Specialist","Nanomedicine Expert","Regeneration Lead","Stasis Medicine Lead","Field Medic Commander","Combat Surgeon","Bio-Engineering Lead","Genetic Medicine Lead","Emergency Medicine Lead","Research Physician"], icon: "🏥" },
    { name: "Astrocartographer", tagline: "Star Map Master", subClasses: ["Deep Space Mapper","Galaxy Cartographer","Nebula Surveyor","Star Cluster Analyst","Void Navigator","Dark Matter Mapper","Dimensional Cartographer","Exoplanet Surveyor","Wormhole Mapper","Anomaly Locator"], icon: "🗺️" },
    { name: "Xenobiologist", tagline: "Alien Life Expert", subClasses: ["Alien Anatomy Expert","Xeno-Language Specialist","Ecological Designer","Genetic Adaptation Lead","Symbiosis Engineer","Bio-Sphere Architect","Extremophile Researcher","Evolutionary Analyst","Alien Medicine Expert","Contact Biology Lead"], icon: "🧬" },
    { name: "Energy Physicist", tagline: "Power Systems Scientist", subClasses: ["Fusion Researcher","Antimatter Specialist","Zero-Point Expert","Dark Energy Researcher","Plasma Physicist","Photonic Engineer","Vacuum Energy Specialist","Stellar Energy Harvester","Gravity Power Expert","Quantum Energy Lead"], icon: "⚡" },
    { name: "Terraforming Director", tagline: "World Shaper", subClasses: ["Atmospheric Engineer","Hydrology Lead","Soil Architect","Climate Designer","Biome Creator","Ocean Engineer","Magnetic Field Generator","Terraform Automation Lead","Planet Cracker Specialist","World Builder"], icon: "🌍" },
    { name: "Cryptography Expert", tagline: "Code Master", subClasses: ["Quantum Cryptographer","Code Breaker","Cipher Designer","Encryption Lead","Steganography Expert","Blockchain Architect","Post-Quantum Crypto Lead","Network Security Lead","Digital Forensics Expert","Crypto-Archaeologist"], icon: "🔐" },
    { name: "Materials Innovator", tagline: "Substance Engineer", subClasses: ["Superconductor Expert","Metamaterials Lead","Smart Material Designer","Self-Healing Material Lead","Exotic Matter Specialist","Nanomaterial Engineer","Crystal Engineer","Polymer Scientist","Composite Material Lead","Bio-Material Specialist"], icon: "💎" },
    { name: "Chrono-Physicist", tagline: "Time Manipulator", subClasses: ["Temporal Mechanics Lead","Stasis Field Expert","Time Dilation Specialist","Causality Engineer","Chroniton Researcher","Temporal Shield Lead","Paradox Prevention Lead","Timeline Analyst","Entropy Specialist","Entropy Reversal Lead"], icon: "⏳" },
  ],
  Economy: [
    { name: "Trade Mogul", tagline: "Market Dominator", subClasses: ["Commodity Baron","Futures Master","Arbitrage Expert","Currency Dealer","Market Maker","Trade Route King","Bazaar Lord","Exchange Controller","Supply Chain Master","Cartel Leader"], icon: "💰" },
    { name: "Mining Tycoon", tagline: "Resource Empire Builder", subClasses: ["Asteroid Baron","Planetary Miner Lead","Deep Core Drilling Master","Gas Giant Harvester","Ocean Mining Lead","Crystal Mining Expert","Rare Elements Hunter","Moon Quarry Commander","Orbital Mining Lead","Exotic Resource Specialist"], icon: "⛏️" },
    { name: "Industrialist", tagline: "Manufacturing Giant", subClasses: ["Factory Foreman","Shipyard Master","Weapon Foundry Lead","Electronics Manufacturing Lead","Chemical Plant Director","Assembly Line Master","Custom Fabrication Lead","Mass Production Expert","Nano Fabrication Lead","Bio-Production Director"], icon: "🏭" },
    { name: "Banker Supreme", tagline: "Financial Titan", subClasses: ["Investment Banking Lead","Credit Authority","Insurance Magnate","Bond Market Master","Venture Capital Lead","Asset Management Director","Fiscal Strategist","Monetary Policy Lead","Hedge Fund Manager","Private Equity Lead"], icon: "🏦" },
    { name: "Logistics Director", tagline: "Supply Chain Master", subClasses: ["Route Optimizer","Cargo Manager","Warehouse Director","Fleet Scheduler","Distribution Lead","Cold Chain Master","Emergency Supply Lead","Port Authority Lead","Customs Expert","Inventory Master"], icon: "📦" },
    { name: "Market Analyst", tagline: "Trend Oracle", subClasses: ["Data Analytics Lead","Sentiment Reader","Algorithmic Trader","Pattern Recognition Expert","Quantitative Analyst","Risk Modeler","Market Predictor","Social Metrics Lead","Supply Demand Analyst","Competitive Intelligence Lead"], icon: "📈" },
    { name: "Infrastructure Builder", tagline: "Civilization Architect", subClasses: ["City Planner","Transit Authority Lead","Power Grid Director","Water Systems Master","Communication Network Lead","Smart City Architect","Bridge Builder","Tunnel Master","Space Elevator Engineer","Orbital Ring Designer"], icon: "🏗️" },
    { name: "Energy Baron", tagline: "Power Empire Builder", subClasses: ["Solar Farm Commander","Fusion Plant Director","Antimatter Facility Lead","Wind Energy Master","Geothermal Expert","Hydroelectric Director","Energy Storage Lead","Grid Distribution Master","Wireless Power Lead","Energy Market Controller"], icon: "⚡" },
    { name: "Agriculture Magnate", tagline: "Food Empire Builder", subClasses: ["Hydroponics Master","Vertical Farm Commander","Genetic Crop Expert","Aquaculture Lead","Agroforestry Expert","Soil Science Lead","Pest Management Director","Irrigation Systems Master","Food Processing Lead","Agricultural Robotics Lead"], icon: "🌾" },
    { name: "Merchant Prince", tagline: "Trade Route Warlord", subClasses: ["Silk Road Commander","Black Market Master","Flea Market Baron","Auction House Master","Bounty Board Commander","Guild Merchant Lead","Peddler Network Lead","Smuggler King","Fence Commander","Trade Federation Lead"], icon: "🏴‍☠️" },
  ],
  Leadership: [
    { name: "High Chancellor", tagline: "Supreme Ruler", subClasses: ["Emperor","Dictator","Council Chair","Planetary Governor","Sector Administrator","Colonial Overseer","Frontier Governor","Population Controller","Emergency Authority","Transitional Leader"], icon: "👑" },
    { name: "Diplomat Supreme", tagline: "Ambassador Extraordinaire", subClasses: ["Treaty Negotiator","Trade Ambassador","Cultural Liaison","Peace Envoy","Crisis Diplomat","Summit Planner","Interstellar Mediator","Alliance Coordinator","Detente Specialist","Goodwill Ambassador"], icon: "🤝" },
    { name: "Espionage Director", tagline: "Shadow Commander", subClasses: ["Spy Master","Saboteur Chief","Disinformation Lead","Deep Cover Handler","Asset Handler","Signals Intelligence Lead","Counter-Espionage Chief","Dead Drop Commander","Infiltration Lead","Exfiltration Expert"], icon: "🕵️" },
    { name: "Propaganda Minister", tagline: "Narrative Controller", subClasses: ["Media Commander","Public Messaging Lead","Cultural Influence Director","Digital Propaganda Lead","Censorship Chief","Narrative Shaping Expert","Myth Maker","Symbolism Director","Counter-Narrative Lead","Emotional Warfare Lead"], icon: "📺" },
    { name: "Fleet Governor", tagline: "Naval Territory Ruler", subClasses: ["Sector Admiral","Deep Space Governor","Trade Route Controller","Border Patrol Commander","Immigration Director","Customs Authority","Maritime Law Enforcer","Piracy Suppression Lead","Fleet Colony Governor","Expedition Leader"], icon: "⚓" },
    { name: "Senate Leader", tagline: "Parliament Head", subClasses: ["Majority Leader","Minority Leader","Committee Chair","Floor Whip","Rules Committee Lead","Budget Authority Lead","Foreign Relations Chair","Defense Committee Chair","Appropriations Lead","Ethics Committee Chair"], icon: "🏛️" },
    { name: "Revolution Commander", tagline: "Uprising Leader", subClasses: ["Insurgent Chief","Rebel Alliance Lead","Freedom Fighter","Liberation Army Commander","Resistance Lead","Underground Railroad Lead","Guerrilla Commander","Sabotage Network Lead","Propaganda Resistance Lead","Insurrection Architect"], icon: "🏴" },
    { name: "Guild Master", tagline: "Professional Head", subClasses: ["Crafts Guild Lead","Merchant Guild Commander","Scholars Guild Head","Warriors Guild Lead","Thieves Guild Commander","Mages Guild Lead","Engineers Guild Head","Healers Guild Lead","Explorers Guild Head","Mixed Guild Leader"], icon: "📋" },
    { name: "Cultural Director", tagline: "Society Shaper", subClasses: ["Arts Commissioner","Heritage Preservation Lead","Education Director","Sports Authority Lead","Religious Affairs Lead","Youth Programs Director","Elder Council Lead","Immigration Culture Lead","Festival Director","Museum Director"], icon: "🎭" },
    { name: "Admiralty Council", tagline: "Naval Command Board", subClasses: ["Strategic Command","Operational Planning Board","Tactical Review Board","Fleet Intelligence Board","Naval Academy Director","Ship Design Board","Port Authority Board","Logistics Command","Communications Board","Emergency Command"], icon: "⚓" },
  ],
  Exploration: [
    { name: "Pathfinder Prime", tagline: "Frontier Scout", subClasses: ["System Scout","Nebula Explorer","Void Walker","Deep Space Pathfinder","Wormhole Tracker","Anomaly Hunter","Signal Chaser","Derelict Finder","Lost Colony Seeker","Ruin Archaeologist"], icon: "🧭" },
    { name: "Survey Commander", tagline: "Cartography Master", subClasses: ["Planetary Surveyor","Star System Mapper","Galaxy Mapper Lead","Resource Surveyor","Hazard Assessment Lead","Population Survey Lead","Infrastructure Surveyor","Environmental Survey Lead","Geological Survey Lead","Bathymetric Surveyor"], icon: "🗺️" },
    { name: "Salvage Master", tagline: "Wreckage Recovery", subClasses: ["Battlefield Salvager","Derelict Scavenger","Debris Field Collector","Ship Wreck Hunter","Station Wreck Specialist","Artifact Recoverer","Technology Salvage Lead","Resource Recycler","Salvage Fleet Commander","Deep Wreck Specialist"], icon: "♻️" },
    { name: "Pioneer Lead", tagline: "First Contact Specialist", subClasses: ["First Landing Commander","Settlement Founder","Resource Prospector","Wilderness Expert","Habitat Builder","Colony Seed Lead","Outpost Builder","Frontier Medic","Communications Pioneer","Supply Chain Pioneer"], icon: "🏕️" },
    { name: "Void Navigator", tagline: "Deep Space Explorer", subClasses: ["Interstellar Navigator","Wormhole Pilot","Hyperspace Cartographer","Deep Void Walker","Anomaly Skipper","Gravity Well Navigator","Nebula Pilot","Asteroid Field Runner","Dark Sector Navigator","Rift Walker"], icon: "🌌" },
    { name: "Anomaly Hunter", tagline: "Mystery Seeker", subClasses: ["Signal Analyst","Anomaly Classification Lead","Xenotech Examiner","Dimensional Rift Investigator","Time Distortion Expert","Energy Anomaly Lead","Gravitational Anomaly Seeker","Biological Anomaly Expert","Structural Anomaly Lead","Cosmic Mystery Solver"], icon: "❓" },
    { name: "Derelict Specialist", tagline: "Ghost Ship Expert", subClasses: ["Ship Boarding Lead","Station Exploration Expert","Hazard Assessment Lead","Loot Recovery Specialist","AI System Recovery Lead","Crew Status Assessor","Structural Integrity Lead","System Reboot Expert","Data Recovery Lead","Artifact Identification"], icon: "👻" },
    { name: "Planet Scanner", tagline: "World Analyst", subClasses: ["Atmospheric Scanner","Geological Scanner Lead","Biological Scanner Expert","Mineral Scanner Lead","Population Scanner","Infrastructure Scanner","Defense Scanner Lead","Resource Scanner Commander","Anomaly Scanner Lead","Hazard Scanner Expert"], icon: "🔍" },
  ],
  Mysticism: [
    { name: "Void Sage", tagline: "Dark Energy Weaver", subClasses: ["Dark Matter Manipulator","Void Touch Master","Shadow Weave Expert","Null Space Walker","Void Shield Specialist","Entropy Artist","Nothingness Channeler","Void Stalker","Anti-Matter Mystic","Dark Energy Sculptor"], icon: "🌑" },
    { name: "Cosmic Seer", tagline: "Fate Reader", subClasses: ["Timeline Viewer","Probability Weaver","Destiny Shaper","Fate Manipulator","Omen Reader","Prophecy Channeler","Causality Bender","Event Horizon Reader","Cosmic Pattern Analyst","Fate Breaker"], icon: "🔮" },
    { name: "Stellar Shaman", tagline: "Star Spirit Caller", subClasses: ["Star Fire Caller","Nebula Spirit Guide","Solar Wind Rider","Cosmic Storm Channeler","Pulsar Listener","Quasar Communion","Dark Star Worshipper","Binary Star Binder","Red Giant Sage","White Dwarf Keeper"], icon: "⭐" },
    { name: "Gravity Mystic", tagline: "Force Bender", subClasses: ["Gravity Weaver","Anti-Gravity Dancer","Tidal Force Master","Orbital Resonance Channeler","Black Hole Whisperer","Wormhole Sculptor","Spacetime Weaver","Mass Shifter","Inertia Controller","Graviton Singer"], icon: "🌀" },
    { name: "Dimension Walker", tagline: "Reality Traveler", subClasses: ["Parallel World Walker","Dimensional Rift Opener","Timeline Hopper","Reality Anchor","Plane Shifter","Void Bridge Builder","Dimensional Barrier Expert","Cross-Reality Messenger","Phase Drifter","Multiverse Cartographer"], icon: "🕳️" },
    { name: "Quantum Mystic", tagline: "Probability Controller", subClasses: ["Superposition Master","Entanglement Weaver","Observer Effect Controller","Quantum Tunneling Guide","Wave Function Shaper","Collapse Director","Quantum Field Singer","Particle Animator","Photon Whisperer","Quantum Entangler"], icon: "⚛️" },
    { name: "Entropic Sage", tagline: "Decay Master", subClasses: ["Chaos Weaver","Disorder Channeler","Decay Accelerator","Entropy Shield","Chaos Sculptor","Randomness Oracle","Thermal Death Prophet","Chaos Theory Mystic","Fractal Seer","Entropy Reverser"], icon: "💀" },
    { name: "Time Keeper", tagline: "Chronal Warden", subClasses: ["Time Slow Caster","Time Speed Controller","Temporal Anchor","Chronal Shield Master","Timeline Pruner","Time Loop Controller","Entropy Reversal Mage","Frozen Time Keeper","Temporal Echo Summoner","Eternal Witness"], icon: "⏳" },
  ],
};

interface MasteryClassDef {
  id: string;
  name: string;
  domain: Domain;
  tagline: string;
  description: string;
  lore: string;
  icon: string;
  color: string;
  primaryStats: string[];
  secondaryStats: string[];
  maxMasteryLevel: number;
  subclasses: MasterySubClassDef[];
}

interface MasterySubClassDef {
  id: string;
  name: string;
  description: string;
  specialty: string;
  primaryStat: string;
  secondaryStat: string;
  statBonus: number;
}

// Additional class templates per domain to reach 350 total
const EXTRA_CLASSES: Record<Domain, Array<{ name: string; tagline: string; subClasses: string[]; icon: string }>> = {
  Warfare: [
    { name: "Carrier Wing Lead", tagline: "Fighter Group Commander", subClasses: ["Bomber Squadron Lead","Interceptor Wing Lead","Drone Fleet Commander","Fighter Ace Lead","Hangar Master","Launch Control Lead","Deck Officer","Air Group Commander","Strike Package Lead","CAP Commander"], icon: "✈️" },
    { name: "Boarding Commander", tagline: "Ship Assault Leader", subClasses: ["Breaching Team Lead","Ship Capture Specialist","Counter-Boarding Master","Hull Walker Lead","Space Marine Commander","EVA Assault Lead","Airlock Commander","Gravity Board Lead","EMP Board Lead","Stealth Board Lead"], icon: "🗡️" },
    { name: "Orbital Commander", tagline: "Space Superiority Lead", subClasses: ["Orbit Control Lead","De-Orbit Specialist","Anti-Satellite Commander","Orbital Bombardment Lead","Orbital Defense Lead","Space Station Commander","Lagrange Point Commander","Orbital Fleet Lead","High Orbit Lead","Low Orbit Lead"], icon: "🌍" },
    { name: "Missile Marshal", tagline: "Long Range Strike", subClasses: ["ICBM Commander","Cruise Missile Lead","Anti-Ship Missile Lead","SAM Commander","Ballistic Expert","Hypersonic Strike Lead","Salvo Commander","Guidance Specialist","Warhead Director","Launch Control Commander"], icon: "🚀" },
    { name: "Electronic Warfare Lead", tagline: "Signal Disruptor", subClasses: ["Jamming Commander","Radar Specialist","ECM Lead","ECCM Expert","SIGINT Lead","Decoy Commander","Countermeasure Lead","Chaff Director","Flare Commander","Frequency Hopper Lead"], icon: "📻" },
    { name: "Submarine Commander", tagline: "Undersea Wolf", subClasses: ["Torpedo Lead","Depth Charge Expert","Sonar Commander","Silent Running Lead","Ambush Commander","Wolfpack Lead","Hunter Killer Lead","Patrol Commander","Attack Sub Lead","Boomer Commander"], icon: "🔱" },
    { name: "Recon Commander", tagline: "Intelligence Gatherer", subClasses: ["Aerial Recon Lead","Satellite Recon Commander","Ground Recon Lead","Naval Recon Lead","Electronic Recon Lead","Deep Recon Lead","Forward Observer Lead","ISR Commander","Morse Lead","Stealth Recon Lead"], icon: "👁️" },
    { name: "Demolition Chief", tagline: "Structure Destroyer", subClasses: ["Breaching Charge Expert","Tunnel Warfare Lead","Building Demolition Lead","Bridge Destroyer","Dam Breaker","Tunnel Boring Lead","Controlled Collapse Expert","Underwater Demolition Lead","Sabotage Demolition Lead","Precision Demolition Lead"], icon: "🧨" },
    { name: "Mech Commander", tagline: "Walking War Machine", subClasses: ["Assault Mech Lead","Sniper Mech Commander","Support Mech Lead","Heavy Mech Commander","Light Mech Lead","Artillery Mech Commander","Scout Mech Lead","Assault Mech Specialist","Urban Mech Lead","Siege Mech Commander"], icon: "🤖" },
    { name: "Carrier Pilot", tagline: "Elite Fighter Ace", subClasses: ["Bomber Pilot","Interceptor Pilot","Recon Pilot","Strike Pilot","SEAD Pilot","Wild Weasel Lead","Fighter Lead","CAP Commander","CAS Pilot","Aggressor Pilot"], icon: "🛩️" },
    { name: "Artillery Commander", tagline: "Long Range Devastation", subClasses: ["Rocket Artillery Lead","Howitzer Commander","Mortar Team Lead","Railgun Artillery Lead","Plasma Artillery Lead","MLRS Commander","Self-Propelled Lead","Towed Artillery Lead","Naval Gunfire Lead","Aerial Bombardment Lead"], icon: "💣" },
    { name: "Fortification Engineer", tagline: "Defensive Structure Master", subClasses: ["Bunker Builder","Trench Network Lead","Minefield Commander","Obstacle Designer","Wire Network Lead","Pillbox Commander","Underground Bunker Lead","Coastal Defense Lead","Air Defense Network Lead","Integrated Defense Lead"], icon: "🏰" },
    { name: "Quick Reaction Force", tagline: "Rapid Response Unit", subClasses: ["QRF Commander","Spearhead Lead","Reaction Strike Lead","Rescue Force Commander","Emergency Assault Lead","Flash Mob Lead","Lightning Strike Commander","Rapid Deployment Lead","Blitz Response Lead","Hot LZ Commander"], icon: "⚡" },
    { name: "Sniper Commander", tagline: "Precision Elimination", subClasses: ["Counter-Sniper Lead","Long Range Elimination","Anti-Material Lead","Spotter Team Lead","Urban Sniper Lead","Forest Sniper Lead","Mountain Sniper Lead","Vehicle Mounted Sniper Lead","Cyber Sniper Lead","Ghost Commander"], icon: "🎯" },
    { name: "Mine Warfare Lead", tagline: "Naval Mine Expert", subClasses: ["Mine Layer Commander","Mine Sweeper Lead","Mine Countermeasure Lead","Offshore Mining Lead","Channel Mining Lead","Bottom Mine Expert","Influence Mine Lead","Adaptive Mine Lead","Mine Clearance Lead","Minefield Analyst"], icon: "💣" },
    { name: "Naval Gunnery Officer", tagline: "Ship Weapons Expert", subClasses: ["Main Battery Commander","CIWS Director","Missile Fire Control Lead","Torpedo Fire Control Lead","Deck Gun Commander","Anti-Aircraft Lead","Close-In Defense Lead","Fire Control Radar Lead","Weapon Systems Lead","Ammunition Commander"], icon: "⚓" },
    { name: "Air Defense Commander", tagline: "Sky Shield Master", subClasses: ["SAM Network Lead","AAA Commander","CIWS Network Lead","Layered Air Defense Lead","Integrated Air Defense Lead","Mobile Air Defense Lead","Theater Air Defense Lead","Point Defense Lead","Ballistic Missile Defense Lead","Drone Swarm Defense Lead"], icon: "🛡️" },
    { name: "Close Protection Specialist", tagline: "VIP Bodyguard", subClasses: ["Executive Protection Lead","Secure Transport Lead","Advance Team Lead","Threat Assessment Lead","Counter-Assault Lead","Medical Protection Lead","Cyber Protection Lead","Counter-Sniper Lead","Secure Facility Lead","Dignitary Escort Lead"], icon: "👤" },
    { name: "Combat Engineer", tagline: "Battlefield Builder", subClasses: ["Route Clearance Lead","Bridge Building Lead","Obstacle Construction Lead","Mine Countermeasure Lead","Breaching Lead","Construction Equipment Lead","Field Fortification Lead","Water Supply Lead","Power Generation Lead","Heavy Equipment Lead"], icon: "🔧" },
    { name: "Amphibious Commander", tagline: "Land-Sea Assault", subClasses: ["Beach Landing Lead","Ship-to-Shore Lead","Underwater Approach Lead","Landing Craft Lead","Amphibious Vehicle Lead","Shore Party Lead","Combat Swimmer Lead","Amphibious Recon Lead","Beach Master Lead","Maritime Raid Lead"], icon: "🌊" },
  ],
  Science: [
    { name: "Quantum Engineer", tagline: "Quantum Systems Master", subClasses: ["Qubit Architect","Entanglement Specialist","Quantum Processor Lead","Quantum Memory Lead","Error Correction Lead","Topological QC Lead","Photonic QC Lead","Trapped Ion Lead","Superconducting QC Lead","Quantum Networking Lead"], icon: "⚛️" },
    { name: "Nanotechnology Director", tagline: "Nano Systems Architect", subClasses: ["Nanobot Swarm Lead","Nano Medicine Lead","Nano Material Lead","Nano Electronics Lead","Nano Assembly Lead","Nano Sensor Lead","Nano Robot Lead","Nano Filter Lead","Nano Energy Lead","Nano Bio Lead"], icon: "🔬" },
    { name: "Cybernetics Lead", tagline: "Human-Machine Fusion", subClasses: ["Neural Interface Lead","Prosthetics Designer","Cyber Eye Expert","Cyber Limb Lead","Brain-Computer Interface Lead","Sensory Enhancement Lead","Exoskeleton Lead","Cyber Skin Lead","Implant Designer","Augmentation Lead"], icon: "🦾" },
    { name: "Genetics Director", tagline: "DNA Master", subClasses: ["Gene Therapy Lead","Cloning Specialist","Genome Mapping Lead","CRISPR Expert","Genetic Screening Lead","Breeding Program Lead","Xenogenetics Lead","Epigenetics Lead","Genetic Privacy Lead","Synthetic Biology Lead"], icon: "🧬" },
    { name: "Astrophysics Director", tagline: "Star Scientist", subClasses: ["Stellar Physics Lead","Black Hole Researcher","Neutron Star Expert","Galaxy Formation Lead","Cosmic Background Lead","Dark Energy Researcher","Gravitational Wave Lead","Exoplanet Scientist","Solar Physics Lead","Nebula Researcher"], icon: "🌟" },
    { name: "Robotics Director", tagline: "Machine Intelligence", subClasses: ["Autonomous Systems Lead","Humanoid Robotics Lead","Industrial Robotics Lead","Medical Robotics Lead","Military Robotics Lead","Space Robotics Lead","Micro Robotics Lead","Soft Robotics Lead","Swarm Robotics Lead","Bio-Hybrid Robotics Lead"], icon: "🤖" },
    { name: "Computer Vision Lead", tagline: "Image Intelligence", subClasses: ["Object Detection Lead","Facial Recognition Lead","Satellite Image Analysis","Medical Imaging Lead","Autonomous Vision Lead","3D Reconstruction Lead","Motion Tracking Lead","Scene Understanding Lead","Document Analysis Lead","Forensic Image Lead"], icon: "👁️" },
    { name: "Machine Learning Director", tagline: "AI Training Master", subClasses: ["Deep Learning Lead","Reinforcement Learning Lead","NLP Lead","Computer Vision ML Lead","Generative AI Lead","Transfer Learning Lead","Federated Learning Lead","Edge AI Lead","AutoML Lead","Explainable AI Lead"], icon: "🧠" },
    { name: "Quantum Sensing Lead", tagline: "Ultra-Precise Detection", subClasses: ["Atomic Clock Lead","Quantum Magnetometer Lead","Quantum Gravity Lead","Quantum Radar Lead","Quantum Imaging Lead","Quantum Navigation Lead","Quantum Communication Lead","Quantum Encryption Lead","Quantum Simulation Lead","Quantum Metrology Lead"], icon: "📡" },
    { name: "Plasma Physics Director", tagline: "Fusion Energy Master", subClasses: ["Tokamak Lead","Stellarator Lead","Inertial Confinement Lead","Plasma Accelerator Lead","Plasma Thruster Lead","Plasma Processing Lead","Plasma Diagnostic Lead","Plasma Heating Lead","Plasma Control Lead","Plasma Material Lead"], icon: "🔮" },
    { name: "Materials Engineer", tagline: "Substance Creator", subClasses: ["Metallic Glass Lead","Graphene Specialist","Carbon Nanotube Lead","Metamaterials Lead","Smart Material Lead","Self-Healing Material Lead","Phase Change Material Lead","Aerogel Specialist","Superconductor Lead","Biomimetic Material Lead"], icon: "💎" },
    { name: "Space Weather Expert", tagline: "Cosmic Climate", subClasses: ["Solar Flare Predictor","Coronal Mass Ejection Lead","Magnetosphere Expert","Radiation Belt Lead","Cosmic Ray Forecaster","Geomagnetic Storm Lead","Aurora Specialist","Solar Wind Analyst","Heliophysics Lead","Space Climate Director"], icon: "🌤️" },
    { name: "Terraforming Specialist", tagline: "World Builder", subClasses: ["Atmosphere Engineer","Water Cycle Designer","Biome Architect","Soil Creator","Climate Controller","Ocean Builder","Magnetic Field Generator","Magnetic Shield Designer","Population Seeding Lead","Ecosystem Balancer"], icon: "🌍" },
    { name: "Fusion Engineer", tagline: "Star in a Bottle", subClasses: ["Magnetic Confinement Lead","Inertial Fusion Lead","Fusion-Fission Hybrid Lead","Helium-3 Specialist","Deuterium-Tritium Lead","Proton-Boron Lead","Fusion Materials Lead","Fusion Fuel Cycle Lead","Fusion Power Plant Lead","Fusion Propulsion Lead"], icon: "☀️" },
    { name: "Cryogenics Director", tagline: "Absolute Zero Master", subClasses: ["Cryo Preservation Lead","Superconductor Cryo Lead","Cryogenic Storage Lead","Cryoprobe Specialist","Cryo Surgery Lead","Liquid Gas Handling Lead","Cryogenic Shield Lead","Cryogenic Propellant Lead","Cryogenic Manufacturing Lead","Deep Freeze Lead"], icon: "❄️" },
  ],
  Economy: [
    { name: "Trade Route Master", tagline: "Interstellar Commerce", subClasses: ["Route Optimizer","Caravan Commander","Trade Hub Manager","Border Trade Lead","Smuggling Network Lead","Legal Trade Lead","Trade Agreement Negotiator","Market Access Lead","Tariff Strategist","Trade War Commander"], icon: "🛤️" },
    { name: "Resource Extraction Baron", tagline: "Mining Empire", subClasses: ["Asteroid Mining Fleet","Planetary Mining Lead","Deep Core Operations","Gas Harvesting Lead","Ocean Mining Fleet","Crystal Mining Lead","Rare Elements Lead","Exotic Mining Lead","Strip Mining Lead","Underground Mining Lead"], icon: "⛏️" },
    { name: "Financial Strategist", tagline: "Market Manipulator", subClasses: ["Hedge Fund Commander","Market Maker Lead","Arbitrage Specialist","Options Master","Derivatives Expert","Algorithmic Trading Lead","High Frequency Lead","Quantitative Strategy Lead","Risk Arbitrage Lead","Distressed Asset Lead"], icon: "📊" },
    { name: "Industrial Designer", tagline: "Product Architecture", subClasses: ["Product Design Lead","Process Optimization Lead","Quality Engineering Lead","Automation Lead","Lean Manufacturing Lead","Six Sigma Lead","Supply Chain Design Lead","Factory Layout Lead","R&D Integration Lead","Cost Engineering Lead"], icon: "🏗️" },
    { name: "Real Estate Magnate", tagline: "Property Empire", subClasses: ["Commercial Real Estate Lead","Residential Development Lead","Industrial Property Lead","Land Acquisition Lead","Property Management Lead","Construction Development Lead","Mixed-Use Developer Lead","Smart Building Lead","Space Real Estate Lead","Planetary Land Baron Lead"], icon: "🏢" },
    { name: "Insurance Director", tagline: "Risk Manager", subClasses: ["Underwriting Lead","Claims Management Lead","Catastrophe Modeling Lead","Reinsurance Lead","Actuarial Science Lead","Risk Assessment Lead","Fraud Detection Lead","Policy Design Lead","Broker Network Lead","Specialty Insurance Lead"], icon: "📋" },
    { name: "Shipping Magnate", tagline: "Cargo Empire", subClasses: ["Container Shipping Lead","Bulk Carrier Lead","Tanker Fleet Lead","Reefer Fleet Lead","Heavy Lift Lead","Ro-Ro Fleet Lead","Barge Operations Lead","Express Shipping Lead","Courier Network Lead","Logistics Fleet Lead"], icon: "🚢" },
    { name: "Retail Empire Builder", tagline: "Consumer Mastery", subClasses: ["Department Store Lead","E-Commerce Lead","Franchise Operations Lead","Supply Chain Retail Lead","Customer Experience Lead","Merchandising Lead","Visual Merchandising Lead","Loss Prevention Lead","Loyalty Program Lead","Omnichannel Lead"], icon: "🛒" },
    { name: "Energy Trader", tagline: "Power Commerce", subClasses: ["Oil Trading Lead","Gas Trading Lead","Electricity Trading Lead","Carbon Credit Trading Lead","Renewable Energy Trader Lead","Futures Energy Lead","Energy Derivatives Lead","Power Purchase Lead","Energy Arbitrage Lead","Energy Storage Trading Lead"], icon: "⚡" },
    { name: "Consulting Director", tagline: "Strategy Advisor", subClasses: ["Management Consulting Lead","Technology Consulting Lead","Financial Advisory Lead","Risk Consulting Lead","Digital Transformation Lead","Operations Consulting Lead","HR Consulting Lead","Strategy Consulting Lead","Change Management Lead","Innovation Consulting Lead"], icon: "📋" },
    { name: "Venture Capital Lead", tagline: "Startup Investor", subClasses: ["Seed Stage Lead","Series A Lead","Growth Equity Lead","Impact Investing Lead","Angel Network Lead","Due Diligence Lead","Portfolio Management Lead","Deal Flow Lead","Exit Strategy Lead","Tech Investment Lead"], icon: "🚀" },
    { name: "Public Finance Director", tagline: "Government Money", subClasses: ["Tax Authority Lead","Bond Issuance Lead","Budget Director","Debt Management Lead","Sovereign Wealth Lead","Municipal Finance Lead","Public Procurement Lead","Fiscal Policy Lead","Treasury Operations Lead","Revenue Service Lead"], icon: "🏛️" },
    { name: "Supply Chain Optimizer", tagline: "Efficiency Master", subClasses: ["Demand Planning Lead","Inventory Optimization Lead","Supplier Management Lead","Transportation Optimization Lead","Warehouse Optimization Lead","Order Fulfillment Lead","Reverse Logistics Lead","Network Design Lead","S&OP Lead","Last Mile Lead"], icon: "🔗" },
    { name: "Export-Import Specialist", tagline: "Global Trade", subClasses: ["Export Compliance Lead","Import Documentation Lead","Customs Broker Lead","Trade Finance Lead","Foreign Exchange Lead","Letters of Credit Lead","Incoterms Specialist","Trade Agreement Lead","Export Licensing Lead","Sanctions Compliance Lead"], icon: "🌐" },
    { name: "Commodities Director", tagline: "Raw Material Market", subClasses: ["Precious Metals Lead","Agricultural Commodities Lead","Energy Commodities Lead","Industrial Metals Lead","Soft Commodities Lead","Futures Market Lead","Options Market Lead","Spot Market Lead","Derivatives Lead","Clearing House Lead"], icon: "📦" },
  ],
  Leadership: [
    { name: "Intelligence Director", tagline: "Information Supremacy", subClasses: ["CIA Lead","NSA Lead","DIA Lead","NGA Lead","NRO Lead","FBI Intelligence Lead","HUMINT Lead","SIGINT Lead","GEOINT Lead","OSINT Lead"], icon: "🔍" },
    { name: "Military Governor", tagline: "Occupation Authority", subClasses: ["Provincial Governor","City Administrator","Civil Affairs Lead","Martial Law Commander","Reconstruction Lead","Population Management Lead","Resource Allocation Lead","Justice System Lead","Infrastructure Restore Lead","Cultural Affairs Lead"], icon: "🏛️" },
    { name: "Counter-Terrorism Director", tagline: "Threat Elimination", subClasses: ["Tactical Response Lead","Intelligence Fusion Lead","Financial Counter-Terror Lead","Cyber Counter-Terror Lead","Border Security Lead","Critical Infrastructure Lead","Hostage Rescue Lead","Surveillance Lead"," informant Network Lead","Prevention Strategy Lead"], icon: "🚨" },
    { name: "Emergency Management Director", tagline: "Crisis Commander", subClasses: ["Disaster Response Lead","Recovery Operations Lead","Mitigation Planning Lead","Preparedness Lead","Continuity of Government Lead","Evacuation Planning Lead","Mutual Aid Lead","Public Warning Lead","Resource Staging Lead","After-Action Lead"], icon: "🆘" },
    { name: "Cyber Command Lead", tagline: "Digital Warfare Chief", subClasses: ["Defensive Cyber Lead","Offensive Cyber Lead","Cyber Intelligence Lead","Critical Infrastructure Cyber Lead","Cyber Policy Lead","Cyber Training Lead","Incident Response Lead","Threat Hunting Lead","Vulnerability Management Lead","Cyber Forensics Lead"], icon: "💻" },
    { name: "Space Command Director", tagline: "Orbital Authority", subClasses: ["Space Traffic Lead","Orbital Defense Lead","Satellite Operations Lead","Deep Space Monitoring Lead","Planetary Defense Lead","Space Asset Protection Lead","Launch Operations Lead","Space Intelligence Lead","Orbital Construction Lead","Space Warfare Lead"], icon: "🛸" },
    { name: "Homeland Security Director", tagline: "Domestic Shield", subClasses: ["Border Security Lead","Port Security Lead","Aviation Security Lead","Critical Infrastructure Lead","Cybersecurity Lead","Immigration Enforcement Lead","Coast Guard Lead","Secret Service Lead","FEMA Lead","Intelligence Fusion Lead"], icon: "🛡️" },
    { name: "Diplomatic Corps Commander", tagline: "Foreign Relations", subClasses: ["Ambassador Network Lead","Consul General Lead","Trade Representative Lead","Arms Control Lead","Human Rights Lead","Cultural Exchange Lead","Treaty Negotiation Lead","Multilateral Affairs Lead","Regional Affairs Lead","Special Envoy Lead"], icon: "🤝" },
    { name: "Joint Chiefs Chairman", tagline: "Military Supreme", subClasses: ["Army Chief Lead","Navy Chief Lead","Air Force Chief Lead","Marine Corps Chief Lead","Coast Guard Chief Lead","Space Force Chief Lead","Cyber Command Lead","Special Operations Lead","Reserve Forces Lead","National Guard Lead"], icon: "⭐" },
    { name: "Political Strategist", tagline: "Power Broker", subClasses: ["Campaign Manager Lead","Policy Director Lead","Opposition Research Lead","Coalition Builder Lead","Fundraising Lead","Grassroots Organizer Lead","Media Relations Lead","Crisis Communications Lead","Polling Director Lead","Platform Development Lead"], icon: "🗳️" },
    { name: "Civil Rights Director", tagline: "Equality Champion", subClasses: ["Anti-Discrimination Lead","Voting Rights Lead","Equal Pay Lead","Disability Rights Lead","Immigration Rights Lead","Criminal Justice Reform Lead","Educational Equity Lead","Healthcare Equity Lead","Environmental Justice Lead","Labor Rights Lead"], icon: "✊" },
    { name: "Public Administration Lead", tagline: "Government Operations", subClasses: ["Budget Director Lead","Personnel Director Lead","Procurement Lead","Performance Management Lead","Program Evaluation Lead","Strategic Planning Lead","Public Engagement Lead","Intergovernmental Affairs Lead","Regulatory Affairs Lead","Ombudsman Lead"], icon: "📋" },
    { name: "Coalition Warfare Director", tagline: "Alliance Commander", subClasses: ["NATO Lead","Coalition Planning Lead","Interoperability Lead","Combined Operations Lead","Joint Intelligence Lead","Allied Logistics Lead","Coalition Communications Lead","Partner Nation Lead","Coalition Air Lead","Coalition Naval Lead"], icon: "🌐" },
    { name: "Special Envoy", tagline: "Personal Representative", subClasses: ["Peace Envoy Lead","Trade Envoy Lead","Humanitarian Envoy Lead","Conflict Resolution Lead","Mediation Lead","Goodwill Ambassador Lead","Cultural Diplomacy Lead","Track II Diplomacy Lead","Back Channel Lead","Special Negotiation Lead"], icon: "🕊️" },
    { name: "Shadow Government Director", tagline: "Covert Authority", subClasses: ["Covert Operations Lead","False Flag Lead","Plausible Deniability Lead","Black Project Lead","Deep State Lead","Continuity Planning Lead","Emergency Authority Lead","Secret Communications Lead","Hidden Infrastructure Lead","Legacy System Lead"], icon: "🎭" },
  ],
  Exploration: [
    { name: "Deep Space Captain", tagline: "Void Pioneer", subClasses: ["Long Range Explorer","Wormhole Scout","Anomaly Chaser","Dark Sector Navigator","Interstellar Pathfinder","Comet Rider","Asteroid Hopper","Nebula Runner","Void Cartographer","Rift Walker"], icon: "🚀" },
    { name: "Planetary Surveyor", tagline: "World Analyst", subClasses: ["Geological Surveyor","Atmospheric Analyst","Biological Surveyor","Resource Assessor","Hazard Evaluator","Population Scanner","Infrastructure Mapper","Climate Analyst","Seismic Surveyor","Mineral Prospector"], icon: "🌍" },
    { name: "Xenarchaeologist", tagline: "Alien Ruin Explorer", subClasses: ["Artifact Hunter","Ruin Mapper","Xenotech Analyst","Alien Language Decoder","Timeline Reconstructor","Culture Profiler","Technology Reverse Engineer","Relic Conservation Lead","Site Director","Excavation Manager"], icon: "🏺" },
    { name: "Salvage Fleet Commander", tagline: "Wreck Recovery", subClasses: ["Battlefield Salvage Lead","Derelict Recovery Lead","Deep Space Salvage Lead","Station Wreck Lead","Debris Field Lead","Resource Recovery Lead","Technology Salvage Lead","Artifact Recovery Lead","Salvage Operations Lead","Salvage Fleet Lead"], icon: "♻️" },
    { name: "Frontier Pioneer", tagline: "Settlement Founder", subClasses: ["First Landing Lead","Outpost Builder Lead","Colony Seed Lead","Resource Prospector Lead","Wilderness Guide Lead","Habitat Engineer Lead","Community Builder Lead","Supply Chain Pioneer Lead","Communication Pioneer Lead","Defense Pioneer Lead"], icon: "🏕️" },
    { name: "Void Cartographer", tagline: "Space Mapper", subClasses: ["Star System Mapper Lead","Galaxy Mapper Lead","Nebula Mapper Lead","Wormhole Mapper Lead","Dimensional Map Lead","Dark Sector Map Lead","Void Navigation Lead","Astrogation Chart Lead","Route Planning Lead","Hazard Map Lead"], icon: "🗺️" },
    { name: "Wormhole Explorer", tagline: "Dimensional Traveler", subClasses: ["Wormhole Discovery Lead","Stability Analysis Lead","Exit Point Mapping Lead","Transit Safety Lead","Wormhole Defense Lead","Wormhole Mining Lead","Wormhole Commerce Lead","Wormhole Warfare Lead","Wormhole Science Lead","Wormhole Engineering Lead"], icon: "🌀" },
    { name: "Anomaly Researcher", tagline: "Cosmic Mystery Solver", subClasses: ["Signal Analyst Lead","Anomaly Classifier Lead","Dimensional Rift Lead","Time Distortion Lead","Energy Anomaly Lead","Gravitational Anomaly Lead","Biological Anomaly Lead","Structural Anomaly Lead","Cosmic Mystery Lead","Anomaly containment Lead"], icon: "❓" },
    { name: "Planet Breaker", tagline: "World Destroyer", subClasses: ["Core Destabilizer Lead","Atmospheric Stripper Lead","Tidal Force Weapon Lead","Orbital Bombardment Lead","Planetary Mining Lead","Resource Extraction Lead","Planet Cracker Lead","Magnetic Disruption Lead","Crust Penetrator Lead","World Ender Lead"], icon: "💥" },
    { name: "Void Warden", tagline: "Space Guardian", subClasses: ["Trade Route Guardian Lead","Pirate Hunter Lead","Void Rescue Lead","Derelict Watcher Lead","Navigation Beacon Lead","Emergency Beacon Lead","Deep Space Patrol Lead","Search and Rescue Lead","Distress Signal Lead","Void Safety Lead"], icon: "🛡️" },
    { name: "Starship Archaeologist", tagline: "Ancient Ship Hunter", subClasses: ["Ancient Vessel Lead","Lost Fleet Lead","Historical Ship Lead","Legendary Ship Lead","Prototype Ship Lead","Alien Ship Lead","Derelict Ship Lead","Ship Graveyard Lead","Ghost Ship Lead","Starship Relic Lead"], icon: "⚓" },
    { name: "Nebula Navigator", tagline: "Storm Rider", subClasses: ["Ion Storm Rider","Plasma Storm Lead","Radiation Storm Lead","Magnetic Storm Lead","Gravity Storm Lead","Dark Nebula Lead","Emission Nebula Lead","Reflection Nebula Lead","Planetary Nebula Lead","Supernova Remnant Lead"], icon: "🌌" },
    { name: "Exoplanet Hunter", tagline: "World Finder", subClasses: ["Transit Method Lead","Radial Velocity Lead","Direct Imaging Lead","Gravitational Lensing Lead","Habitability Assessor Lead","Atmosphere Analyzer Lead","Biosignature Hunter Lead","Ocean World Lead","Gas Giant Lead","Rocky World Lead"], icon: "🔭" },
    { name: "Cosmic Cartographer", tagline: "Universe Mapper", subClasses: ["Local Group Mapper Lead","Galaxy Cluster Lead","Supercluster Lead","Cosmic Web Mapper Lead","Dark Matter Map Lead","Void Mapper Lead","Filament Mapper Lead","Great Wall Mapper Lead","Cosmic Horizon Lead","Multiverse Mapper Lead"], icon: "🗺️" },
    { name: "Derelict Specialist", tagline: "Ghost Ship Expert", subClasses: ["Ship Assessment Lead","Hull Integrity Lead","System Evaluation Lead","Loot Assessment Lead","Hazard Rating Lead","Crew Status Lead","AI Recovery Lead","Data Extraction Lead","Structural Analysis Lead","Salvage Priority Lead"], icon: "👻" },
  ],
  Mysticism: [
    { name: "Cosmic Entity Channeler", tagline: "Divine Messenger", subClasses: ["Celestial Being Caller","Star Spirit Guide","Cosmic Force Weaver","Divine Energy Channeler","Celestial Harmony Lead","Cosmic Consciousness Lead","Stellar Deity Lead","Universal Force Lead","Cosmic Will Lead","Divine Intervention Lead"], icon: "✨" },
    { name: "Fate Weaver", tagline: "Destiny Controller", subClasses: ["Fate Spinner","Destiny Shaper","Probability Manipulator","Timeline Weaver","Causality Artist","Karmic Force Lead","Fate Breaker","Destiny Defender","Fate Assassin","Chronicle Keeper"], icon: "🕸️" },
    { name: "Void Prophet", tagline: "Dark Oracle", subClasses: ["Void Speaker","Dark Visionary","Null Prophet","Empty Seer","Void Reader","Nothingness Oracle","Void Whisperer","Dark Fate Reader","Void Interpreter","Void Walker"], icon: "🌑" },
    { name: "Star Binder", tagline: "Cosmic Force Wielder", subClasses: ["Star Fire Weaver","Solar Wind Rider","Stellar Energy Binder","Cosmic Force Channeler","Star Light Sculptor","Stellar Resonance Lead","Star Core Touch Lead","Solar Flare Caller","Stellar Harmony Lead","Star Power Master"], icon: "⭐" },
    { name: "Reality Sculptor", tagline: "World Shaper", subClasses: ["Reality Bender","Reality Anchor","Reality Shifter","Reality Weaver","Reality Stitcher","Reality Breaker","Reality Guardian","Reality Artist","Reality Engineer","Reality Master"], icon: "🌀" },
    { name: "Void Necromancer", tagline: "Death Energy Master", subClasses: ["Soul Reaper","Void Death Channeler","Entropy Master","Decay Accelerator","Life Force Drainer","Death Energy Weaver","Soul Collector","Void Spirit Caller","Mortality Controller","Death Oracle"], icon: "💀" },
    { name: "Chrono Mage", tagline: "Time Wizard", subClasses: ["Time Stopper","Time Accelerator","Time Reverser","Timeline Editor","Temporal Shield","Time Loop Creator","Chronal Anchor","Temporal Assassin","Time Paradox Manager","Eternal Keeper"], icon: "⏳" },
    { name: "Dimension Walker", tagline: "Plane Traveler", subClasses: ["Planar Explorer","Dimension Hopper","Reality Skipper","Phase Drifter","Dimensional Bridge","Cross-Reality Lead","Plane Shifter","Void Walker","Dimensional Anchor","Reality Anchor"], icon: "🕳️" },
    { name: "Psionic Commander", tagline: "Mind Master", subClasses: ["Telepath","Telekinetic","Psychic Shielder","Mind Reader","Thought Projector","Psionic Assault Lead","Memory Manipulator","Dream Walker","Consciousness Explorer","Psionic Network Lead"], icon: "🧠" },
    { name: "Elemental Conductor", tagline: "Nature's Voice", subClasses: ["Fire Caller","Water Shaper","Earth Mover","Wind Singer","Lightning Caller","Nature's Voice","Storm Chaser","Elemental Fusion Lead","Elemental Shield Lead","Elemental Assault Lead"], icon: "🌪️" },
    { name: "Blood Mage", tagline: "Life Force Channeler", subClasses: ["Blood Sacrifice Lead","Life Drain Lead","Blood Shield Lead","Blood Weapon Lead","Blood Puppet Lead","Hemomancy Lead","Vital Force Master","Blood Pact Lead","Crimson Sorcery Lead","Vampire Lord Lead"], icon: "🩸" },
    { name: "Shadow Master", tagline: "Darkness Wielder", subClasses: ["Shadow Walker","Shadow Shield","Shadow Strike","Shadow Clone","Shadow Network Lead","Darkness Weaver","Umbra Master","Shadow Assassin","Shadow Puppeteer","Void Shadow Lead"], icon: "👤" },
    { name: "Cosmic Healer", tagline: "Universal Restorer", subClasses: ["Celestial Healing Lead","Stellar Restoration Lead","Cosmic Regeneration Lead","Universal Medicine Lead","Star Light Healing Lead","Cosmic Purification Lead","Divine Healing Lead","Astral Healing Lead","Cosmic Balance Lead","Life Force Channeler Lead"], icon: "💚" },
    { name: "Rune Master", tagline: "Symbol Power", subClasses: ["Rune Carver","Rune Reader","Rune Shield","Rune Weapon","Rune Portal","Rune Golem","Rune Language Lead","Rune Network Lead","Rune Trap Lead","Ancient Rune Lead"], icon: "ᚱ" },
    { name: "Void Alchemist", tagline: "Transmutation Master", subClasses: ["Void Transmutation Lead","Matter Creation Lead","Energy Conversion Lead","Soul Alchemy Lead","Void Elixir Lead","Philosopher Stone Lead","Transmutation Circle Lead","Void Catalyst Lead","Alchemical Fusion Lead","Void Forge Lead"], icon: "⚗️" },
    { name: "Cosmic Oracle", tagline: "Future Seer", subClasses: ["Timeline Viewer","Probability Reader","Event Predictor","Cosmic Pattern Reader","Fate Interpreter","Destiny Reader","Cosmic Whisperer","Universal Memory","Cosmic Archive Lead","Truth Seeker Lead"], icon: "🔮" },
  ],
};

let classCount = 0;
const allMasteryClasses: MasteryClassDef[] = [];

// Generate additional classes programmatically to reach 350+ total
// Additional generated classes to reach 350+
const EXTRA_GENERATED_CLASSES: Record<Domain, Array<{ name: string; tagline: string; subClasses: string[]; icon: string }>> = {
  Warfare: [
    { name: "Warden General", tagline: "Prison Authority", subClasses: ["Maximum Security Lead","Min Security Lead","Solitary Lead","Work Camp Lead","Transit Lead","Rehabilitation Lead","Parole Board Lead","Prison Intelligence Lead","Prison Defense Lead","Emergency Lockdown Lead"], icon: "🔒" },
    { name: "Border Marshal", tagline: "Boundary Guardian", subClasses: ["Land Border Lead","Sea Border Lead","Air Border Lead","Space Border Lead","Dimensional Border Lead","Digital Border Lead","Trade Border Lead","Smuggling Interception Lead","Border Patrol Lead","Checkpoint Commander Lead"], icon: "🚧" },
    { name: "Arsenal Commander", tagline: "Weapons Depot Master", subClasses: ["Storage Lead","Distribution Lead","Testing Lead","Manufacturing Lead","Quality Control Lead","Maintenance Lead","Security Lead","Inventory Lead","Demolition Lead","Research Lead"], icon: "💣" },
    { name: "Siege Engine Master", tagline: "Battering Expert", subClasses: ["Trebuchet Lead","Catapult Lead","Ballista Lead","Siege Tower Lead","Battering Ram Lead","Tunnel Boring Lead","Ladder Assault Lead","Fire Ship Lead","Boiling Oil Lead","Greek Fire Lead"], icon: "🏰" },
    { name: "Mercenary Captain", tagline: "Hired Blade", subClasses: ["Company Commander","Squad Leader","Fire Team Lead","Sniper Team Lead","Demolitions Team Lead","Recon Team Lead","Heavy Weapons Lead","Medic Team Lead","Engineer Team Lead","Logistics Lead"], icon: "💰" },
    { name: "Gladiator Champion", tagline: "Arena Master", subClasses: ["Duel Champion","Team Battle Lead","Siege Battle Lead","Beast Slayer","Chariot Racing Lead","Net Fighter Lead","Trident Master Lead","Dual Wield Lead","Shield Bearer Lead","Crowd Favorite Lead"], icon: "🏟️" },
    { name: "Guerrilla Commander", tagline: "Asymmetric Warfare", subClasses: ["Ambush Commander","Sabotage Lead","IED Expert Lead","Tunnel Warfare Lead","Urban Guerrilla Lead","Jungle Guerrilla Lead","Mountain Guerrilla Lead","Desert Guerrilla Lead","Maritime Guerrilla Lead","Cyber Guerrilla Lead"], icon: "🌳" },
    { name: "Naval Infantry Commander", tagline: "Ship-to-Shore", subClasses: ["Beach Assault Lead","Harbor Defense Lead","Amphibious Recon Lead","Ship Security Lead","Boarding Team Lead","Anti-Piracy Lead","Coastal Patrol Lead","Riverine Lead","Landing Force Lead","Maritime Raid Lead"], icon: "⚓" },
    { name: "Armored Division Lead", tagline: "Tank Commander", subClasses: ["Main Battle Tank Lead","Light Tank Lead","Heavy Tank Lead","Recon Tank Lead","Tank Destroyer Lead","Armored Car Lead","IFV Commander Lead","APC Commander Lead","Self-Propelled Lead","Tank Platoon Lead"], icon: "🐲" },
    { name: "Special Forces Commander", tagline: "Elite Operator", subClasses: ["Direct Action Lead","Special Recon Lead","Unconventional Warfare Lead","Counter-Terrorism Lead","Hostage Rescue Lead","High Value Target Lead","Foreign Internal Defense Lead","Information Operations Lead","Counter-Proliferation Lead","Personnel Recovery Lead"], icon: "🎖️" },
    { name: "Battleline Commander", tagline: "Frontline Master", subClasses: ["Frontline Commander","Reserve Line Lead","Defensive Line Lead","Attack Line Lead","Support Line Lead","Flank Guard Lead","Rear Guard Lead","Advance Guard Lead","Main Body Lead","Rear Echelon Lead"], icon: "⚔️" },
    { name: "War Dog Handler", tagline: "Battle Companion", subClasses: ["Scout Dog Lead","Attack Dog Lead","Sentry Dog Lead","Mine Detection Lead","Tracker Dog Lead","Guard Dog Lead","Recon Dog Lead","Combat Search Dog Lead","Cavalry Dog Lead","War Dog Commander Lead"], icon: "🐕" },
    { name: "Siege Breaker", tagline: "Fortification Killer", subClasses: ["Wall Breaker","Gate Breaker","Tunnel Breaker","Breaching Charge Lead","Sapper Lead","Demo Team Lead","Underground Warfare Lead","Fortification Destroyer Lead","Obstacle Breacher Lead","Clearing Team Lead"], icon: "💥" },
    { name: "Siege Defender", tagline: "Wall Keeper", subClasses: ["Gate Defense Lead","Wall Defense Lead","Tower Defense Lead","Moat Defense Lead","Counter-Mine Lead","Repair Team Lead","Supply Defense Lead","Medical Defense Lead","Artillery Defense Lead","Counter-Siege Lead"], icon: "🏰" },
    { name: "Air Cavalry Commander", tagline: "Helicopter Warfare", subClasses: ["Attack Helicopter Lead","Transport Helicopter Lead","Scout Helicopter Lead","Gunship Lead","Medevac Lead","Supply Drop Lead","Air Assault Lead","Air Recon Lead","Anti-Submarine Lead","CSAR Lead"], icon: "🚁" },
    { name: "Rocket Artillery Marshal", tagline: "Fire Saturation", subClasses: ["MLRS Commander","Rocket Battery Lead","Grad System Lead","HIMARS Lead","Multiple Launch Lead","Counter-Battery Lead","Fire Support Lead","Area Saturation Lead","Precision Strike Lead","Rapid Fire Lead"], icon: "🚀" },
    { name: "Convoy Commander", tagline: "Escort Master", subClasses: ["Convoy Defense Lead","Escort Fleet Lead","Mine Sweeper Lead","Anti-Submarine Lead","Air Defense Lead","Electronic Warfare Lead","Rescue Commander Lead","Logistics Escort Lead","VIP Escort Lead","Supply Convoy Lead"], icon: "🚢" },
    { name: "Fire Support Commander", tagline: "Artillery Control", subClasses: ["Target Acquisition Lead","Fire Direction Lead","Forward Observer Lead","Mortar Team Lead","Rocket Team Lead","Naval Gunfire Lead","Air Support Lead","CAS Coordinator Lead","Fire Mission Lead","Artillery Intel Lead"], icon: "🎯" },
    { name: "Field Marshal", tagline: "Army Commander", subClasses: ["Infantry Commander Lead","Armor Commander Lead","Artillery Commander Lead","Engineer Commander Lead","Signal Commander Lead","Recon Commander Lead","Supply Commander Lead","Medical Commander Lead","Aviation Commander Lead","Special Forces Commander Lead"], icon: "⭐" },
    { name: "Master-at-Arms", tagline: "Military Police", subClasses: ["Law Enforcement Lead","Military Justice Lead","Detention Lead","Investigation Lead","Traffic Control Lead","Force Protection Lead","Evidence Collection Lead","Witness Protection Lead","Patrol Lead","Emergency Response Lead"], icon: "⚖️" },
    { name: "Weapons Officer", tagline: "Gunnery Chief", subClasses: ["Main Battery Officer","Missile Officer","Torpedo Officer","CIWS Officer","Fire Control Officer","Ammunition Officer","Weapons Maintenance Officer","Deck Gun Officer","Anti-Air Officer","Close Defense Officer"], icon: "💣" },
    { name: "Combat Medic Officer", tagline: "Battlefield Doctor", subClasses: ["Trauma Lead","Triage Lead","Evacuation Lead","Field Surgery Lead","Psychological Lead","Preventive Medicine Lead","Medical Supply Lead","Combat Life Saver Lead","Combat Casualty Lead","Veterinary Lead"], icon: "🏥" },
    { name: "Intelligence Officer", tagline: "Intel Chief", subClasses: ["HUMINT Officer","SIGINT Officer","GEOINT Officer","OSINT Officer","CI Officer","Collection Officer","Analysis Officer","Dissemination Officer","Counterintelligence Officer","Operations Officer"], icon: "🔍" },
    { name: "Naval Flight Officer", tagline: "Pilot Commander", subClasses: ["Fighter Pilot Lead","Bomber Pilot Lead","Recon Pilot Lead","Anti-Submarine Pilot Lead","Transport Pilot Lead","Search and Rescue Pilot Lead","Medevac Pilot Lead","Electronic Warfare Pilot Lead","Helicopter Pilot Lead","Drone Pilot Lead"], icon: "✈️" },
    { name: "Master Builder", tagline: "Construction Chief", subClasses: ["Fortification Builder Lead","Bridge Builder Lead","Road Builder Lead","Tunnel Builder Lead","Base Builder Lead","Runway Builder Lead","Harbor Builder Lead","Power Plant Builder Lead","Water Treatment Builder Lead","Communications Tower Lead"], icon: "🏗️" },
    { name: "Signal Corps Commander", tagline: "Communications Chief", subClasses: ["Radio Lead","Satellite Lead","Cyber Lead","Radar Lead","Electronic Warfare Lead","Signal Intelligence Lead","Network Operations Lead","Visual Signals Lead","Carrier Pigeon Lead","Emergency Communications Lead"], icon: "📡" },
    { name: "Logistics Officer", tagline: "Supply Chief", subClasses: ["Procurement Lead","Transport Lead","Warehousing Lead","Distribution Lead","Maintenance Lead","Fuel Management Lead","Ammunition Supply Lead","Ration Supply Lead","Equipment Supply Lead","Personnel Supply Lead"], icon: "📦" },
    { name: "Explosive Ordnance Disposal", tagline: "Bomb Specialist", subClasses: ["IED Disposal Lead","UXO Clearance Lead","Mine Disposal Lead","Underwater EOD Lead","CBRN Disposal Lead","Vehicle Borne IED Lead","Suicide Vest Disposal Lead","Improvised Munitions Lead","Post-Blast Analysis Lead","Render Safe Lead"], icon: "💣" },
  ],
  Science: [
    { name: "Quantum Gravity Researcher", tagline: "Unification Seeker", subClasses: ["Loop Quantum Gravity Lead","String Theory Lead","Causal Set Lead","Asymptotic Safety Lead","Spin Foam Lead","Twistor Theory Lead","Quantum Cosmology Lead","Black Hole Information Lead","Holographic Principle Lead","ER=EPR Lead"], icon: "⚛️" },
    { name: "Astrobiology Director", tagline: "Life Beyond Earth", subClasses: ["Biosignature Detection Lead","Extremophile Research Lead","Panspermia Lead","Abiogenesis Lead","SETI Director Lead","Drake Equation Lead","Habitability Assessment Lead","Exoplanet Atmosphere Lead","Mars Life Lead","Europa Life Lead"], icon: "🔬" },
    { name: "Neutrino Physicist", tagline: "Ghost Particle Expert", subClasses: ["Neutrino Detection Lead","Neutrino Oscillation Lead","Neutrino Mass Lead","Neutrino Source Lead","Neutrino Detector Lead","Neutrino Telescope Lead","Neutrino Astronomy Lead","Neutrino Communication Lead","Neutrino Physics Lead","Neutrino Technology Lead"], icon: "👻" },
    { name: "Antimatter Engineer", tagline: "Anti-Universe", subClasses: ["Antimatter Production Lead","Antimatter Storage Lead","Antimatter Propulsion Lead","Antimatter Weapon Lead","Antimatter Energy Lead","Antimatter Research Lead","Antimatter Safety Lead","Antimatter Containment Lead","Antimatter Medical Lead","Antimatter Communication Lead"], icon: "⚡" },
    { name: "Superconductor Director", tagline: "Zero Resistance", subClasses: ["Room Temperature SC Lead","High-Tc SC Lead","Low-Tc SC Lead","SC Wire Lead","SC Magnet Lead","SC Motor Lead","SC Energy Storage Lead","SC Quantum Lead","SC Medical Lead","SC Computing Lead"], icon: "🧲" },
    { name: "Photonics Director", tagline: "Light Manipulator", subClasses: ["Laser Weapon Lead","Photonic Computing Lead","Fiber Optic Lead","LIDAR Lead","Holography Lead","Optical Communication Lead","Photovoltaic Lead","LED Technology Lead","Laser Surgery Lead","Laser Manufacturing Lead"], icon: "💡" },
    { name: "Genomics Director", tagline: "Genome Master", subClasses: ["Human Genome Lead","Plant Genome Lead","Animal Genome Lead","Microbial Genome Lead","Metagenomics Lead","Epigenomics Lead","Transcriptomics Lead","Proteomics Lead","Metabolomics Lead","Comparative Genomics Lead"], icon: "🧬" },
    { name: "Materials Innovator Lead", tagline: "Substance Creator Supreme", subClasses: ["Self-Healing Material Supreme","Programmable Matter Lead","4D Printing Material Lead","Graphene Applications Lead","Carbon Nanotube Applications Lead","Metamaterials Applications Lead","Biodegradable Material Lead","Ultra-Strong Material Lead","Ultra-Light Material Lead","Smart Coating Lead"], icon: "💎" },
    { name: "Quantum Computing Director", tagline: "Quantum Processor Master", subClasses: ["Qubit Architecture Lead","Error Correction Lead","Quantum Algorithm Lead","Quantum Software Lead","Quantum Networking Lead","Quantum Memory Lead","Quantum Processor Lead","Quantum Simulation Lead","Quantum Machine Learning Lead","Quantum Cryptography Lead"], icon: "🖥️" },
    { name: "Space Weather Director", tagline: "Cosmic Climate Master", subClasses: ["Solar Forecast Lead","Geomagnetic Storm Lead","Radiation Forecast Lead","Solar Wind Lead","Coronal Mass Lead","Solar Flare Lead","Cosmic Ray Lead","Aurora Forecast Lead","Magnetosphere Lead","Heliosphere Lead"], icon: "🌤️" },
    { name: "Fusion Energy Director", tagline: "Star Power Master", subClasses: ["Tokamak Master Lead","Stellarator Master Lead","ICF Master Lead","Fusion Materials Master Lead","Fusion Fuel Cycle Master Lead","Fusion Power Plant Master Lead","Fusion Propulsion Master Lead","Fusion Safety Master Lead","Fusion Economics Lead","Fusion Timeline Lead"], icon: "☀️" },
    { name: "Cryogenics Supreme Director", tagline: "Absolute Zero Master Supreme", subClasses: ["Cryo Preservation Supreme","Superconductor Cryo Supreme","Cryogenic Storage Supreme","Cryoprobe Supreme","Cryo Surgery Supreme","Liquid Gas Supreme","Cryogenic Shield Supreme","Cryogenic Propellant Supreme","Cryogenic Manufacturing Supreme","Deep Freeze Supreme"], icon: "❄️" },
    { name: "Robotics Supreme Director", tagline: "Machine Intelligence Supreme", subClasses: ["Autonomous Systems Supreme","Humanoid Robotics Supreme","Industrial Robotics Supreme","Medical Robotics Supreme","Military Robotics Supreme","Space Robotics Supreme","Micro Robotics Supreme","Soft Robotics Supreme","Swarm Robotics Supreme","Bio-Hybrid Supreme"], icon: "🤖" },
  ],
  Economy: [
    { name: "Agricultural Empire Builder", tagline: "Food Dynasty", subClasses: ["Grain Empire Lead","Livestock Empire Lead","Dairy Empire Lead","Fruit Empire Lead","Vegetable Empire Lead","Fishery Empire Lead","Forestry Empire Lead","Vineyard Empire Lead","Spice Trade Lead","Herb Empire Lead"], icon: "🌾" },
    { name: "Transportation Mogul", tagline: "Moving Empire", subClasses: ["Airline Empire Lead","Shipping Empire Lead","Rail Empire Lead","Trucking Empire Lead","Courier Empire Lead","Taxi Empire Lead","Ride Share Lead","Drone Delivery Lead","Space Transport Lead","Pipeline Empire Lead"], icon: "🚚" },
    { name: "Construction Baron", tagline: "Building Empire", subClasses: ["Residential Construction Lead","Commercial Construction Lead","Industrial Construction Lead","Infrastructure Construction Lead","Marine Construction Lead","Underground Construction Lead","Space Construction Lead","Bridge Construction Lead","Tunnel Construction Lead","Dam Construction Lead"], icon: "🏗️" },
    { name: "Luxury Goods Baron", tagline: "Premium Market", subClasses: ["Jewelry Empire Lead","Fashion Empire Lead","Watch Empire Lead","Art Dealer Lead","Wine Empire Lead","Car Empire Lead","Real Estate Luxury Lead","Yacht Empire Lead","Private Jet Lead","Concierge Lead"], icon: "💎" },
    { name: "Energy Dynasty", tagline: "Power Empire", subClasses: ["Oil Dynasty Lead","Gas Dynasty Lead","Coal Dynasty Lead","Nuclear Dynasty Lead","Solar Dynasty Lead","Wind Dynasty Lead","Hydro Dynasty Lead","Geothermal Dynasty Lead","Fusion Dynasty Lead","Hydrogen Dynasty Lead"], icon: "⚡" },
    { name: "Technology Mogul", tagline: "Silicon Empire", subClasses: ["Software Empire Lead","Hardware Empire Lead","Cloud Empire Lead","AI Empire Lead","Gaming Empire Lead","Social Media Empire Lead","E-Commerce Empire Lead","Fintech Empire Lead","Health Tech Lead","Space Tech Lead"], icon: "💻" },
    { name: "Shipping Baron", tagline: "Maritime Trade Master", subClasses: ["Container Shipping Baron","Bulk Carrier Baron","Tanker Baron","LNG Baron","Ro-Ro Baron","Cruise Baron","Ferry Baron","Tug Baron","Dredging Baron","Offshore Baron"], icon: "🚢" },
    { name: "Retail Baron", tagline: "Consumer Empire", subClasses: ["Supermarket Baron","Department Store Baron","Discount Baron","Specialty Baron","Convenience Baron","Online Retail Baron","Wholesale Baron","Franchise Baron","Pop-up Baron","Outlet Baron"], icon: "🛒" },
    { name: "Mining Baron Supreme", tagline: "Extraction Supreme", subClasses: ["Gold Baron","Silver Baron","Copper Baron","Iron Baron","Diamond Baron","Uranium Baron","Lithium Baron","Cobalt Baron","Platinum Baron","Rare Earth Baron"], icon: "⛏️" },
    { name: "Manufacturing Baron Supreme", tagline: "Production Supreme", subClasses: ["Automotive Baron","Aerospace Baron","Electronics Baron","Pharmaceutical Baron","Textile Baron","Food Processing Baron","Chemical Baron","Steel Baron","Cement Baron","Glass Baron"], icon: "🏭" },
    { name: "Real Estate Baron Supreme", tagline: "Property Supreme", subClasses: ["Commercial RE Baron","Residential RE Baron","Industrial RE Baron","Land Baron","Development Baron","Property Management Baron","REIT Baron","Hospitality Baron","Mixed-Use Baron","Smart City Baron"], icon: "🏢" },
    { name: "Banking Baron", tagline: "Financial Supreme", subClasses: ["Investment Banking Baron","Commercial Banking Baron","Central Banking Baron","Private Banking Baron","Merchant Banking Baron","Savings Bank Baron","Credit Union Baron","Online Banking Baron","Islamic Banking Baron","Shadow Banking Baron"], icon: "🏦" },
    { name: "Telecommunications Baron", tagline: "Connection Empire", subClasses: ["Mobile Network Baron","Internet Service Baron","Satellite Comm Baron","Cable Network Baron","Fiber Network Baron","5G Baron","IoT Baron","Cloud Network Baron","Data Center Baron","Streaming Network Baron"], icon: "📱" },
  ],
  Leadership: [
    { name: "Grand Marshal", tagline: "Military Authority", subClasses: ["Army Marshal","Navy Marshal","Air Force Marshal","Space Force Marshal","Marine Marshal","Coast Guard Marshal","Reserve Marshal","National Guard Marshal","Cyber Marshal","Joint Operations Marshal"], icon: "⭐" },
    { name: "Prime Minister", tagline: "Head of Government", subClasses: ["Cabinet Leader","Parliament Leader","Policy Director","Budget Director","Foreign Affairs Lead","Defense Director","Interior Director","Finance Director","Justice Director","Trade Director"], icon: "🏛️" },
    { name: "Grand Vizier", tagline: "Shadow Ruler", subClasses: ["Court Minister","Treasury Minister","Military Minister","Foreign Minister","Interior Minister","Justice Minister","Education Minister","Health Minister","Commerce Minister","Infrastructure Minister"], icon: "🎭" },
    { name: "Emperor", tagline: "Supreme Ruler", subClasses: ["Imperial Guard Commander","Imperial Advisor","Imperial Chancellor","Imperial Treasurer","Imperial General","Imperial Admiral","Imperial Ambassador","Imperial Judge","Imperial Architect","Imperial Physician"], icon: "👑" },
    { name: "High Councilor", tagline: "Decision Authority", subClasses: ["Strategic Decision Lead","Emergency Decision Lead","Budget Decision Lead","Policy Decision Lead","Personnel Decision Lead","Technology Decision Lead","Military Decision Lead","Diplomatic Decision Lead","Legal Decision Lead","Infrastructure Decision Lead"], icon: "📋" },
    { name: "Overlord", tagline: "Supreme Controller", subClasses: ["Territory Controller","Population Controller","Resource Controller","Military Controller","Technology Controller","Economic Controller","Cultural Controller","Information Controller","Space Controller","Dimensional Controller"], icon: "👑" },
    { name: "War Chief", tagline: "Battle Authority", subClasses: ["Tactical Commander","Strategic Commander","Operational Commander","Intelligence Commander","Logistics Commander","Engineering Commander","Medical Commander","Communications Commander","Aviation Commander","Naval Commander"], icon: "⚔️" },
    { name: "Grand Duke", tagline: "Provincial Authority", subClasses: ["Ducal Army Lead","Ducal Navy Lead","Ducal Treasury Lead","Ducal Justice Lead","Ducal Education Lead","Ducal Health Lead","Ducal Infrastructure Lead","Ducal Trade Lead","Ducal Defense Lead","Ducal Culture Lead"], icon: "🏰" },
    { name: "Caliph", tagline: "Spiritual Authority", subClasses: ["Religious Court Lead","Spiritual Education Lead","Charitable Foundation Lead","Religious Architecture Lead","Religious Music Lead","Religious Scholarship Lead","Religious Medicine Lead","Religious Trade Lead","Religious Diplomacy Lead","Religious Defense Lead"], icon: "🕌" },
    { name: "Grand Commander", tagline: "Combined Authority", subClasses: ["Joint Force Commander","Combined Operations Lead","Allied Commander","Coalition Commander","Integrated Command Lead","Unified Command Lead","Strategic Command Lead","Operational Command Lead","Tactical Command Lead","Theater Command Lead"], icon: "⭐" },
    { name: "Supreme Chancellor", tagline: "Civil Authority", subClasses: ["Civil Administration Lead","Public Service Lead","Regulatory Authority Lead","Legislative Authority Lead","Executive Authority Lead","Judicial Authority Lead","Electoral Authority Lead","Fiscal Authority Lead","Defense Authority Lead","Foreign Authority Lead"], icon: "🏛️" },
    { name: "Grand Inquisitor", tagline: "Truth Authority", subClasses: ["Heresy Investigation Supreme","Tech Heresy Supreme","Witch Trial Supreme","Purification Supreme","Re-education Supreme","Inquisitorial Court Supreme","Spy Network Supreme","Faith Security Supreme","Temple Guard Supreme","Sacred Archive Supreme"], icon: "🔍" },
    { name: "Supreme Director", tagline: "Operations Authority", subClasses: ["Strategic Operations Lead","Tactical Operations Lead","Intelligence Operations Lead","Logistics Operations Lead","Communications Operations Lead","Engineering Operations Lead","Medical Operations Lead","Financial Operations Lead","Personnel Operations Lead","Security Operations Lead"], icon: "📋" },
  ],
  Exploration: [
    { name: "Wormhole Cartographer", tagline: "Path Maker", subClasses: ["Entrance Mapper","Exit Mapper","Stability Mapper","Transit Time Mapper","Traffic Mapper","Safety Mapper","Defense Mapper","Commerce Mapper","Science Mapper","Anomaly Mapper"], icon: "🗺️" },
    { name: "Salvage Prime", tagline: "Recovery Master", subClasses: ["Battlefield Salvage Prime","Derelict Salvage Prime","Deep Space Salvage Prime","Station Salvage Prime","Wormhole Salvage Prime","Void Salvage Prime","Dark Sector Salvage Prime","Ancient Salvage Prime","Exotic Salvage Prime","Emergency Salvage Prime"], icon: "♻️" },
    { name: "Planet Breaker Prime", tagline: "World Destroyer Supreme", subClasses: ["Core Destabilizer Supreme","Atmospheric Stripper Supreme","Tidal Force Supreme","Orbital Bombardment Supreme","Planet Cracker Supreme","Magnetic Disruption Supreme","Crust Penetrator Supreme","World Ender Supreme","System Killer Supreme","Galaxy Scourge Supreme"], icon: "💥" },
    { name: "Cosmic Prospector Prime", tagline: "Master Prospector", subClasses: ["Star Prospector Prime","Planet Prospector Prime","Asteroid Prospector Prime","Nebula Prospector Prime","Void Prospector Prime","Dark Sector Prospector Prime","Wormhole Prospector Prime","Dimensional Prospector Prime","Energy Prospector Prime","Exotic Prospector Prime"], icon: "⛏️" },
    { name: "Void Navigator Prime", tagline: "Master Navigator", subClasses: ["Interstellar Navigator Prime","Wormhole Pilot Prime","Hyperspace Cartographer Prime","Deep Void Walker Prime","Anomaly Skipper Prime","Gravity Well Navigator Prime","Nebula Pilot Prime","Asteroid Field Runner Prime","Dark Sector Navigator Prime","Rift Walker Prime"], icon: "🧭" },
    { name: "Signal Hunter", tagline: "Mystery Seeker", subClasses: ["Radio Signal Lead","Optical Signal Lead","Gravitational Signal Lead","Neutrino Signal Lead","Cosmic Ray Signal Lead","Dark Energy Signal Lead","Dark Matter Signal Lead","Dimensional Signal Lead","Time Signal Lead","Void Signal Lead"], icon: "📡" },
    { name: "Void Rescue Prime", tagline: "Distress Master", subClasses: ["Ship Rescue Prime","Station Rescue Prime","Planetary Rescue Prime","Void Rescue Prime","Dark Sector Rescue Prime","Wormhole Rescue Prime","Dimensional Rescue Prime","Emergency Extraction Prime","Search and Rescue Prime","Medical Evacuation Prime"], icon: "🆘" },
    { name: "Wreck Diver", tagline: "Deep Recovery", subClasses: ["Deep Wreck Diver","Space Wreck Diver","Planetary Wreck Diver","Underwater Wreck Diver","Volcanic Wreck Diver","Icy Wreck Diver","Toxic Wreck Diver","Radiation Wreck Diver","Void Wreck Diver","Ancient Wreck Diver"], icon: "🤿" },
    { name: "Frontier Scout Prime", tagline: "First Explorer", subClasses: ["System Scout Prime","Galaxy Scout Prime","Void Scout Prime","Dark Sector Scout Prime","Wormhole Scout Prime","Dimensional Scout Prime","Anomaly Scout Prime","Resource Scout Prime","Hazard Scout Prime","Population Scout Prime"], icon: "🔍" },
    { name: "Star Captain", tagline: "Ship Commander", subClasses: ["Explorer Captain","Combat Captain","Diplomacy Captain","Science Captain","Trade Captain","Salvage Captain","Pioneer Captain","Patrol Captain","Escort Captain","Raid Captain"], icon: "🚀" },
    { name: "Void Admiral", tagline: "Fleet in the Dark", subClasses: ["Exploration Fleet Admiral","Combat Fleet Admiral","Trade Fleet Admiral","Salvage Fleet Admiral","Research Fleet Admiral","Colonial Fleet Admiral","Patrol Fleet Admiral","Defense Fleet Admiral","Strike Fleet Admiral","Guardian Fleet Admiral"], icon: "⚓" },
    { name: "Cosmic Surveyor Supreme", tagline: "Universal Surveyor", subClasses: ["Star Surveyor Supreme","Planet Surveyor Supreme","Asteroid Surveyor Supreme","Nebula Surveyor Supreme","Void Surveyor Supreme","Dark Sector Surveyor Supreme","Wormhole Surveyor Supreme","Dimensional Surveyor Supreme","Energy Surveyor Supreme","Exotic Surveyor Supreme"], icon: "📡" },
    { name: "Void Pioneer Supreme", tagline: "First Beyond Supreme", subClasses: ["First Colony Supreme","First Contact Supreme","First Expedition Supreme","First Survey Supreme","First Mining Supreme","First Settlement Supreme","First Outpost Supreme","First Bridge Supreme","First Gate Supreme","First Discovery Supreme"], icon: "🏕️" },
  ],
  Mysticism: [
    { name: "Cosmic Bard", tagline: "Song of Creation", subClasses: ["Creation Song Lead","Harmony Song Lead","Destruction Song Lead","Healing Song Lead","Power Song Lead","Shield Song Lead","Weapon Song Lead","Transport Song Lead","Communication Song Lead","Transformation Song Lead"], icon: "🎵" },
    { name: "Void Monk", tagline: "Inner Void Walker", subClasses: ["Void Meditation Lead","Void Breathing Lead","Void Body Lead","Void Mind Lead","Void Spirit Lead","Void Fist Lead","Void Shield Lead","Void Step Lead","Void Sight Lead","Void Voice Lead"], icon: "🧘" },
    { name: "Cosmic Witch", tagline: "Hex Weaver", subClasses: ["Curse Hex Lead","Blessing Hex Lead","Transformation Hex Lead","Protection Hex Lead","Destruction Hex Lead","Healing Hex Lead","Knowledge Hex Lead","Power Hex Lead","Luck Hex Lead","Domination Hex Lead"], icon: "🧙" },
    { name: "Void Paladin", tagline: "Void Knight", subClasses: ["Void Smite Lead","Void Shield Lead","Void Heal Lead","Void Aura Lead","Void Strike Lead","Void Charge Lead","Void Retribution Lead","Void Blessing Lead","Void Judgment Lead","Void Crusade Lead"], icon: "🗡️" },
    { name: "Cosmic Assassin", tagline: "Reality Killer", subClasses: ["Dimensional Strike Lead","Timeline Assassination Lead","Void Strike Lead","Shadow Kill Lead","Silent Death Lead","Poison Touch Lead","Critical Strike Lead","Chain Kill Lead","Ghost Kill Lead","Time Kill Lead"], icon: "🗡️" },
    { name: "Void Warlock", tagline: "Void Spellcaster", subClasses: ["Void Bolt Lead","Void Blast Lead","Void Rain Lead","Void Chain Lead","Void Beam Lead","Void Shield Spell Lead","Void Summon Lead","Void Teleport Lead","Void Curse Lead","Void Drain Lead"], icon: "🔮" },
    { name: "Cosmic Cleric", tagline: "Divine Channeler", subClasses: ["Divine Heal Lead","Divine Shield Lead","Divine Smite Lead","Divine Blessing Lead","Divine Revive Lead","Divine Purify Lead","Divine Protection Lead","Divine Sight Lead","Divine Restoration Lead","Divine Wrath Lead"], icon: "✝️" },
    { name: "Void Ranger", tagline: "Void Tracker", subClasses: ["Void Arrow Lead","Void Trap Lead","Void Pet Lead","Void Track Lead","Void Scout Lead","Void Snare Lead","Void Venom Lead","Void Strike Range Lead","Void Beast Lead","Void Wilderness Lead"], icon: "🏹" },
    { name: "Cosmic Sorcerer", tagline: "Cosmic Spellcaster", subClasses: ["Cosmic Fire Lead","Cosmic Ice Lead","Cosmic Lightning Lead","Cosmic Earth Lead","Cosmic Wind Lead","Cosmic Water Lead","Cosmic Light Lead","Cosmic Dark Lead","Cosmic Void Lead","Cosmic Chaos Lead"], icon: "🧙" },
    { name: "Void Berserker", tagline: "Frenzy Master", subClasses: ["Void Rage Lead","Void Fury Lead","Void Wrath Lead","Void Berserk Lead","Void Bloodlust Lead","Void Pain Lead","Void Strength Lead","Void Speed Lead","Void Endurance Lead","Void Violence Lead"], icon: "😡" },
    { name: "Cosmic Necromancer", tagline: "Undead Commander", subClasses: ["Skeleton Army Lead","Zombie Horde Lead","Ghost Fleet Lead","Spectral Army Lead","Lich Lord Lead","Death Knight Lead","Vampire Lord Lead","Wraith Commander Lead","Phantom Lead","Soul Army Lead"], icon: "💀" },
    { name: "Void Sorcerer Supreme", tagline: "Spellcaster Supreme", subClasses: ["Void Bolt Supreme","Void Blast Supreme","Void Rain Supreme","Void Chain Supreme","Void Beam Supreme","Void Shield Supreme","Void Summon Supreme","Void Teleport Supreme","Void Curse Supreme","Void Drain Supreme"], icon: "🔮" },
    { name: "Cosmic Druid", tagline: "Nature Avatar", subClasses: ["Star Fire Druid","Solar Wind Druid","Nebula Druid","Gravity Druid","Plasma Druid","Photon Druid","Dark Energy Druid","Dark Matter Druid","Void Nature Druid","Cosmic Nature Druid"], icon: "🌿" },
    { name: "Void Templar", tagline: "Holy Warrior", subClasses: ["Void Crusader Lead","Void Templar Lead","Void Inquisitor Lead","Void Exorcist Lead","Void Purifier Lead","Void Champion Lead","Void Defender Lead","Void Avenger Lead","Void Martyr Lead","Void Prophet Lead"], icon: "⚔️" },
  ],
};

const DOMAIN_GENERATED: Record<Domain, Array<{ name: string; tagline: string; subClasses: string[]; icon: string }>> = {
  Warfare: [
    { name: "Aegis Commander", tagline: "Shield Wall Tactician", subClasses: ["Forward Shield Lead","Rear Guard Shield","Mobile Shield Lead","Static Defense Shield","Energy Shield Specialist","Fleet Shield Coordinator","Planetary Shield Master","Layered Defense Commander","Adaptive Shield Lead","Emergency Shield Lead"], icon: "🛡️" },
    { name: "Tyrant Lord", tagline: "Total Domination", subClasses: ["Subjugation Lead","Oppression Commander","Iron Fist Lead","Blitz Tyrant","Conquest Tyrant","Puppet Master Lead","Fear Commander","Intimidation Lead","Crushing Force Lead","Absolute Authority Lead"], icon: "👑" },
    { name: "Void Raider", tagline: "Piracy Commander", subClasses: ["Plunder Lead","Raid Commander","Hit and Run Lead","Ambush Raider","Boarding Raider","Fleet Raider","Cargo Raider","Supply Raider","Commerce Raider","Privateer Captain"], icon: "🏴‍☠️" },
    { name: "Berserker Chief", tagline: "Frenzy Warrior", subClasses: ["Blood Fury Lead","Battle Trance Lead","Rage Channeler","Pain Ignore Lead","Adrenaline Master","Berserk Assault Lead","Frenzy Shield Lead","Unstoppable Lead","Death Wish Lead","War Cry Commander"], icon: "😱" },
    { name: "Phalanx Master", tagline: "Formation Expert", subClasses: ["Shield Wall","Spear Line","Testudo Lead","Wedge Formation","Echelon Lead","Column Formation","Circle Defense","Line Abreast","Line astern","Schiltron Lead"], icon: "⚔️" },
    { name: "Dreadnought Captain", tagline: "Capital Ship Master", subClasses: ["Broadside Captain","Main Battery Lead","Hull Defense Lead","Engine Room Lead","Bridge Commander","Damage Control Lead","Fire Control Lead","Magazine Lead","CIC Commander","Flag Bridge Lead"], icon: "🚢" },
  ],
  Science: [
    { name: "Bioforge Director", tagline: "Living Systems Creator", subClasses: ["Living Ship Lead","Biomech Designer","Organic Computing Lead","Bio-Structure Lead","Symbiotic Systems Lead","Living Weapon Lead","Bio-Armor Lead","Living Material Lead","Bioprinting Lead","Organic Electronics Lead"], icon: "🧫" },
    { name: "Singularity Researcher", tagline: "Infinity Scientist", subClasses: ["Singularity Prevention Lead","Information Paradox Lead","Infinite Density Lead","Event Horizon Lead","Hawking Radiation Lead","Spaghettification Lead","Quantum Hair Lead","Firewall Paradox Lead","Complementarity Lead","Cosmic Censorship Lead"], icon: "♾️" },
    { name: "Exotic Matter Engineer", tagline: "Impossible Material Master", subClasses: ["Negative Mass Lead","Exotic States Lead","Phased Matter Lead","Tachyon Material Lead","Dimensional Material Lead","Null Energy Lead","Vacuum Energy Lead","Casimir Effect Lead","Dark Sector Material Lead","Antigravity Material Lead"], icon: "💎" },
    { name: "Bioethics Director", tagline: "Science Ethics Leader", subClasses: ["Gene Editing Ethics Lead","AI Ethics Lead","Human Enhancement Ethics Lead","Animal Testing Ethics Lead","Research Ethics Lead","Clinical Trial Ethics Lead","Data Ethics Lead","Environmental Ethics Lead","Military Ethics Lead","Space Ethics Lead"], icon: "⚖️" },
    { name: "Astrochemistry Lead", tagline: "Space Chemistry Expert", subClasses: ["Interstellar Chemistry Lead","Nebula Chemistry Lead","Planetary Atmosphere Lead","Comet Chemistry Lead","Asteroid Chemistry Lead","Stellar Chemistry Lead","Dark Cloud Chemistry Lead","Protostar Chemistry Lead","Molecular Cloud Lead","Organic Space Chemistry Lead"], icon: "🧪" },
    { name: "Metamaterials Director", tagline: "Light Bender", subClasses: ["Invisibility Cloak Lead","Perfect Lens Lead","Acoustic Cloak Lead","Thermal Cloak Lead","Electromagnetic Cloak Lead","Superlens Lead","Negative Index Lead","Transformation Optics Lead","Metamaterial Antenna Lead","Metamaterial Sensor Lead"], icon: "🔮" },
  ],
  Economy: [
    { name: "Monopoly Commander", tagline: "Market Dominator", subClasses: ["Vertical Monopoly Lead","Horizontal Monopoly Lead","Regional Monopoly Lead","Digital Monopoly Lead","Resource Monopoly Lead","Service Monopoly Lead","Platform Monopoly Lead","Network Monopoly Lead","Brand Monopoly Lead","Patent Monopoly Lead"], icon: "🏆" },
    { name: "Cartel Director", tagline: "Price Fixer Supreme", subClasses: ["OPEC Lead","Diamond Cartel Lead","Steel Cartel Lead","Pharmaceutical Cartel Lead","Technology Cartel Lead","Agricultural Cartel Lead","Shipping Cartel Lead","Banking Cartel Lead","Mining Cartel Lead","Energy Cartel Lead"], icon: "🏴" },
    { name: "Speculation Baron", tagline: "High Risk Trader", subClasses: ["Currency Speculation Lead","Commodity Speculation Lead","Derivatives Speculation Lead","Options Speculation Lead","Margin Trading Lead","Short Selling Lead","Leveraged Trading Lead","Hedging Specialist Lead","Spread Trading Lead","Pairs Trading Lead"], icon: "📈" },
    { name: "Waste Baron", tagline: "Recycling Empire", subClasses: ["E-Waste Recycling Lead","Metal Recycling Lead","Plastic Recycling Lead","Chemical Recycling Lead","Organic Recycling Lead","Nuclear Waste Lead","Hazardous Waste Lead","Construction Waste Lead","Medical Waste Lead","Space Debris Lead"], icon: "♻️" },
    { name: "Patent Troller", tagline: "Intellectual Property", subClasses: ["Patent Acquisition Lead","Licensing Empire Lead","Litigation Strategy Lead","Defensive Patent Lead","Offensive Patent Lead","Portfolio Management Lead","Patent Mining Lead","Standards Essential Lead","Design Patent Lead","Trade Secret Lead"], icon: "📜" },
    { name: "Shadow Banker", tagline: "Offshore Finance", subClasses: ["Offshore Banking Lead","Shell Company Lead","Money Laundering Lead","Tax Haven Lead","Private Banking Lead","Trust Fund Lead","Hedge Fund Lead","Family Office Lead","Wealth Preservation Lead","Asset Protection Lead"], icon: "🏦" },
  ],
  Leadership: [
    { name: "Palace Guard Commander", tagline: "Royal Protection", subClasses: ["Inner Circle Lead","Outer Ring Lead","Gate Commander","Tower Watch Lead","Patrol Commander","Intelligence Guard Lead","Emergency Response Lead","Close Protection Lead","Counter-Assault Lead","Dungeon Master Lead"], icon: "🏰" },
    { name: "Inquisitor General", tagline: "Truth Seeker", subClasses: ["Heresy Hunter","Witch Finder Lead","Tech Inquisitor Lead","Political Inquisitor Lead","Financial Inquisitor Lead","Moral Inquisitor Lead","Knowledge Inquisitor Lead","Digital Inquisitor Lead","Cyber Inquisitor Lead","Void Inquisitor Lead"], icon: "🔍" },
    { name: "Regent Sovereign", tagline: "Throne Holder", subClasses: ["Regent Council Lead","Succession Manager Lead","Crown Regent Lead","Regency Authority Lead","Regent Diplomat Lead","Regent Commander Lead","Regent Treasurer Lead","Regent Judge Lead","Regent Scholar Lead","Regent Guardian Lead"], icon: "👑" },
    { name: "Shadow Chancellor", tagline: "Hidden Authority", subClasses: ["Black Operations Lead","Covert Governance Lead","Underground Authority Lead","Secret Order Lead","Hidden Council Lead","Veiled Power Lead","Silent Authority Lead","Invisible Hand Lead","Phantom Government Lead","Shadow State Lead"], icon: "🎭" },
    { name: "Fleet Comptroller", tagline: "Naval Finance", subClasses: ["Ship Budget Lead","Crew Pay Lead","Supply Budget Lead","Repair Budget Lead","Construction Budget Lead","Fuel Budget Lead","Arsenal Budget Lead","Training Budget Lead","Insurance Budget Lead","Retirement Budget Lead"], icon: "💰" },
    { name: "Planetary Governor", tagline: "World Authority", subClasses: ["Continental Governor Lead","Oceanic Governor Lead","Polar Governor Lead","Tropical Governor Lead","Desert Governor Lead","Urban Governor Lead","Rural Governor Lead","Frontier Governor Lead","Colony Governor Lead","Mining Colony Governor Lead"], icon: "🌍" },
  ],
  Exploration: [
    { name: "Void Cartographer Prime", tagline: "Master Mapper", subClasses: ["Star System Mapper","Galaxy Mapper Lead","Dimensional Mapper Lead","Void Map Lead","Anomaly Map Lead","Wormhole Map Lead","Time Map Lead","Energy Map Lead","Matter Map Lead","Dark Sector Map Lead"], icon: "🗺️" },
    { name: "Cosmic Prospect", tagline: "Resource Seeker", subClasses: ["Star Prospector Lead","Planet Prospector Lead","Asteroid Prospector Lead","Nebula Prospector Lead","Void Prospector Lead","Dark Sector Prospector Lead","Wormhole Prospector Lead","Dimensional Prospector Lead","Energy Prospector Lead","Exotic Prospector Lead"], icon: "⛏️" },
    { name: "Ghost Ship Hunter", tagline: "Phantom Finder", subClasses: ["Derelict Tracker","Ghost Fleet Lead","Abandoned Ship Lead","Missing Ship Lead","Lost Colony Ship Lead","Vanished Fleet Lead","Phantom Signal Lead","Ghost Planet Lead","Lost World Lead","Vanished Civilization Lead"], icon: "👻" },
    { name: "Cosmic Archaeologist", tagline: "Ancient Finder", subClasses: ["Ancient Civilization Lead","Lost Technology Lead","Forgotten World Lead","Extinct Species Lead","Ancient Artifact Lead","Mysterious Structure Lead","Ruined Megastructure Lead","Ancient Database Lead","Fossil World Lead","Dead Empire Lead"], icon: "🏺" },
    { name: "Void Miner", tagline: "Deep Space Resource", subClasses: ["Asteroid Field Miner","Comet Miner","Nebula Miner","Void Miner","Dark Matter Miner","Energy Field Miner","Gravitational Miner","Dimensional Miner","Plasma Miner","Exotic Resource Miner"], icon: "⛏️" },
    { name: "Star Mapper Prime", tagline: "Cosmic Surveyor", subClasses: ["Local Star Mapper","Cluster Mapper Lead","Supercluster Mapper Lead","Filament Mapper Lead","Void Mapper Lead","Dark Energy Mapper Lead","Dark Matter Mapper Lead","Cosmic Web Mapper Lead","Horizon Mapper Lead","Multiverse Mapper Lead"], icon: "⭐" },
  ],
  Mysticism: [
    { name: "Void Ascendant", tagline: "Beyond Mortality", subClasses: ["Void Transcendence Lead","Mortal Shed Lead","Void Form Lead","Void Mind Lead","Void Soul Lead","Void Body Lead","Void Spirit Lead","Void Essence Lead","Void Consciousness Lead","Void Eternity Lead"], icon: "🌌" },
    { name: "Cosmic Architect", tagline: "Reality Designer", subClasses: ["Reality Foundation Lead","Reality Structure Lead","Reality Bridge Lead","Reality Gate Lead","Reality Tower Lead","Reality Palace Lead","Reality Fortress Lead","Reality Garden Lead","Reality Library Lead","Reality Temple Lead"], icon: "🏗️" },
    { name: "Entropy Lord", tagline: "Decay Master Supreme", subClasses: ["Heat Death Herald","Chaos Commander Lead","Randomness Lord Lead","Decay Accelerator Lead","Order Destroyer Lead","Pattern Dissolver Lead","Structure Unmaker Lead","Energy Drainer Lead","Matter Dissolver Lead","Timeline Scrambler Lead"], icon: "💀" },
    { name: "Psionic Overlord", tagline: "Mind Supreme", subClasses: ["Mass Telepath","Mass Telekinesis Lead","Mass Mind Control Lead","Psionic Network Master","Psionic Amplifier Lead","Psionic Shield Master","Psionic Assault Supreme","Psionic Healing Lead","Psionic Warfare Lead","Psionic Evolution Lead"], icon: "🧠" },
    { name: "Void Alchemist Supreme", tagline: "Transmutation Grandmaster", subClasses: ["Grand Transmutation Lead","Void Philosopher Stone Lead","Grand Elixir Lead","Universal Transmutation Lead","Cosmic Alchemy Lead","Void Creation Lead","Grand Catalyst Lead","Eternal Flame Lead","Void Forge Supreme Lead","Grand Crucible Lead"], icon: "⚗️" },
    { name: "Cosmic Sage", tagline: "Universal Wisdom", subClasses: ["Universal Knowledge Lead","Cosmic Truth Lead","Universal Harmony Lead","Cosmic Balance Lead","Universal Truth Lead","Cosmic Order Lead","Universal Law Lead","Cosmic Purpose Lead","Universal Will Lead","Cosmic Destiny Lead"], icon: "🔮" },
  ],
};

// Combine base templates with extra templates and generated templates
for (const [domain, baseTemplates] of Object.entries(CLASS_TEMPLATES) as [Domain, typeof CLASS_TEMPLATES[Domain]][]) {
  const extras = EXTRA_CLASSES[domain] || [];
  const generated = DOMAIN_GENERATED[domain] || [];
  const extraGenerated = EXTRA_GENERATED_CLASSES[domain] || [];
  const allTemplates = [...baseTemplates, ...extras, ...generated, ...extraGenerated];

  // Add auto-generated classes to reach 350+ total
  const AUTO_NAMES: Record<Domain, string[]> = {
    Warfare: ["Phalanx Warlord","Trench Marshal","Rapid Assault Lead","Heavy Siege Master","Counter-Attack Commander","Defensive Anchor","Mobile Warfare Lead","Static Defense Master","Combined Arms Chief","Fleet Screen Lead","Battle Group Commander","Task Force Lead","Expeditionary Force Lead","Defense in Depth Lead","Operational Reserve Lead","Rear Area Security Lead"],
    Science: ["Biotech Innovator","Cybernetics Innovator","Energy Innovator","Materials Innovator","Robotics Innovator","Quantum Innovator","Space Innovator","Medical Innovator","Agricultural Innovator","Environmental Innovator","Physics Innovator","Chemistry Innovator","Mathematics Innovator","Computer Innovator","Nanotech Innovator","Astro Innovator"],
    Economy: ["Micro Enterprise Lead","Small Business Lead","Medium Enterprise Lead","Large Enterprise Lead","Conglomerate Lead","Multinational Lead","Startup Incubator Lead","Venture Accelerator Lead","Market Platform Lead","Digital Marketplace Lead","B2B Commerce Lead","B2C Commerce Lead","C2C Commerce Lead","Government Contract Lead","Non-Profit Lead","Social Enterprise Lead"],
    Leadership: ["Crisis Commander","Peace Time Commander","Wartime Commander","Transitional Commander","Reconstruction Commander","Development Commander","Humanitarian Commander","Disaster Commander","Civil Defense Commander","Emergency Commander","Security Commander","Safety Commander","Protection Commander","Defense Commander","Offense Commander","Intelligence Commander"],
    Exploration: ["Deep Void Survey Lead","Dark Nebula Explorer","Star Cluster Scout","Galaxy Arm Scout","Void Edge Scout","Rift Valley Scout","Nebula Core Scout","Asteroid Belt Scout","Comet Trail Scout","Solar Wind Rider","Gravity Well Scout","Magnetic Anomaly Scout","Energy Field Scout","Dimensional Pocket Scout","Temporal Anomaly Scout","Quantum Fluctuation Scout"],
    Mysticism: ["Void Elementalist","Cosmic Shaman","Void Necromancer","Cosmic Warlock","Void Paladin Supreme","Cosmic Ranger Supreme","Void Sorcerer","Cosmic Druid Supreme","Void Templar Supreme","Cosmic Berserker Supreme","Void Cleric Supreme","Cosmic Monk Supreme","Void Assassin Supreme","Cosmic Bard Supreme","Void Witch Supreme","Cosmic Necromancer Supreme"],
  };

  const autoNames = AUTO_NAMES[domain] || [];
  for (const autoName of autoNames) {
    allTemplates.push({
      name: autoName,
      tagline: `${autoName} Specialist`,
      subClasses: Array.from({ length: 10 }, (_, i) => `${autoName} ${["Alpha","Bravo","Charlie","Delta","Echo","Foxtrot","Golf","Hotel","India","Juliet"][i]}`),
      icon: domain === "Warfare" ? "⚔️" : domain === "Science" ? "🔬" : domain === "Economy" ? "💰" : domain === "Leadership" ? "👑" : domain === "Exploration" ? "🧭" : "🔮",
    });
  }

  for (const tmpl of allTemplates) {
    allMasteryClasses.push({
      id: `mc_${domain.toLowerCase()}_${classCount}`,
      name: tmpl.name,
      domain,
      tagline: tmpl.tagline,
      description: `A ${domain.toLowerCase()} mastery class focused on ${tmpl.tagline.toLowerCase()}.`,
      lore: `The ${tmpl.name} has commanded respect across the galaxy for generations.`,
      icon: tmpl.icon,
      color: domain === "Warfare" ? "#ef4444" : domain === "Science" ? "#a78bfa" : domain === "Economy" ? "#fbbf24" : domain === "Leadership" ? "#34d399" : domain === "Exploration" ? "#06b6d4" : "#c084fc",
      primaryStats: [STAT_KEYS[classCount % STAT_KEYS.length], STAT_KEYS[(classCount + 1) % STAT_KEYS.length]],
      secondaryStats: [STAT_KEYS[(classCount + 2) % STAT_KEYS.length], STAT_KEYS[(classCount + 3) % STAT_KEYS.length]],
      maxMasteryLevel: 999,
      subclasses: tmpl.subClasses.map((sc, si) => ({
        id: `sc_${domain.toLowerCase()}_${classCount}_${si}`,
        name: sc,
        description: `Specialization in ${sc.toLowerCase()} within ${tmpl.name}.`,
        specialty: sc,
        primaryStat: STAT_KEYS[(classCount + si) % STAT_KEYS.length],
        secondaryStat: STAT_KEYS[(classCount + si + 5) % STAT_KEYS.length],
        statBonus: 10 + si * 3,
      })),
    });
    classCount++;
  }
}

const masteryClassesTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export type MasteryDomain = "Warfare" | "Science" | "Economy" | "Leadership" | "Exploration" | "Mysticism";

export const MASTERY_DOMAINS: Record<MasteryDomain, { color: string; icon: string; description: string }> = {
  Warfare:    { color: "#ef4444", icon: "⚔️",  description: "Masters of combat, fleet command, and military operations" },
  Science:    { color: "#a78bfa", icon: "🔬",  description: "Pioneers of research, technology, and scientific discovery" },
  Economy:    { color: "#fbbf24", icon: "💰",  description: "Controllers of trade, industry, and resource empires" },
  Leadership: { color: "#34d399", icon: "👑",  description: "Architects of diplomacy, governance, and grand strategy" },
  Exploration:{ color: "#06b6d4", icon: "🧭",  description: "Voyagers into the unknown reaches of the cosmos" },
  Mysticism:  { color: "#c084fc", icon: "🔮",  description: "Wielders of arcane forces beyond mortal understanding" },
};

export interface MasterySubClassDef {
  id: string;
  name: string;
  description: string;
  specialty: string;
  primaryStat: string;
  secondaryStat: string;
  statBonus: number;
}

export interface MasteryClassDef {
  id: string;
  name: string;
  domain: MasteryDomain;
  tagline: string;
  description: string;
  lore: string;
  icon: string;
  color: string;
  primaryStats: string[];
  secondaryStats: string[];
  maxMasteryLevel: number;
  subclasses: MasterySubClassDef[];
}

export const TOTAL_MASTERY_CLASSES = ${allMasteryClasses.length};
export const TOTAL_SUBCLASSES = ${allMasteryClasses.reduce((acc, c) => acc + c.subclasses.length, 0)};

export const MASTERY_CLASSES: MasteryClassDef[] = ${JSON.stringify(allMasteryClasses, null, 2)};
`;

writeFileSync(resolve(outDir, "masteryClasses.ts"), masteryClassesTs);
console.log(`✅ masteryClasses.ts — ${allMasteryClasses.length} classes, ${allMasteryClasses.reduce((a, c) => a + c.subclasses.length, 0)} subclasses`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 190 TYPES AND SUBTYPES FOR THEME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const THEME_FAMILIES = [
  { name: "Elemental", types: ["Fire","Ice","Lightning","Earth","Wind","Water","Light","Darkness","Void","Plasma"] },
  { name: "Cosmic", types: ["Star","Nebula","Black Hole","Pulsar","Quasar","Supernova","Gravity","Dark Matter","Dark Energy","Cosmic Ray"] },
  { name: "Biological", types: ["Organic","Synthetic","Hybrid","Crystalline","Fungal","Venomous","Regenerative","Parasitic","Symbiotic","Mutagenic"] },
  { name: "Mechanical", types: ["Kinetic","Pneumatic","Hydraulic","Magnetic","Electric","Piezoelectric","Thermal","Acoustic","Optical","Gravitonic"] },
  { name: "Chemical", types: ["Acid","Base","Catalyst","Solvent","Polymer","Colloid","Suspension","Emulsion","Aerosol","Gel"] },
  { name: "Energy", types: ["Thermal","Radiant","Kinetic","Potential","Chemical","Nuclear","Electrical","Magnetic","Elastic","Surface"] },
  { name: "Dimensional", types: ["Planar","Temporal","Spatial","Quantum","Void","Mirror","Fractal","Recursive","Infinite","Paradox"] },
  { name: "Spectral", types: ["Ultraviolet","Infrared","X-Ray","Gamma","Radio","Microwave","Visible","Infrared","Terahertz","Neutrino"] },
  { name: "Metaphysical", types: ["Spiritual","Psychic","Telepathic","Empathic","Clairvoyant","Precognitive","Telekinetic","Astral","Ethereal","Arcane"] },
  { name: "Technological", types: ["Nanotech","Cybernetic","Holographic","Photonic","Quantum Computing","AI-Driven","Blockchain","Biometric","Synthetic","Hybrid"] },
  { name: "Strategic", types: ["Offensive","Defensive","Balanced","Guerrilla","Siege","Hit-and-Run","Fortification","Ambush","Encirclement","Attrition"] },
  { name: "Tactical", types: ["Flanking","Overwatch","Assault","Recon","Support","Command","Logistics","Medical","Engineer","Special"] },
  { name: "Economic", types: ["Production","Trade","Investment","Extraction","Manufacturing","Service","Agriculture","Mining","Energy","Technology"] },
  { name: "Social", types: ["Diplomatic","Cultural","Religious","Militant","Academic","Artistic","Athletic","Political","Legal","Economic"] },
  { name: "Environmental", types: ["Atmospheric","Aquatic","Terrestrial","Cryogenic","Volcanic","Desertic","Tropical","Arctic","Void","Hybrid"] },
  { name: "Astral", types: ["Celestial","Ethereal","Planar","Void","Astral","Shadow","Light","Prismatic","Radiant","Obscured"] },
  { name: "Arcane", types: ["Runic","Sigil","Glyph","Tome","Crystal","Essence","Ritual","Invocation","Enchantment","Transmutation"] },
  { name: "Martial", types: ["Sword","Shield","Spear","Bow","Gun","Cannon","Blade","Fist","Polearm","Thrown"] },
  { name: "Cybernetic", types: ["Neural","Ocular","Skeletal","Muscular","Dermal","Visceral","Sensory","Motor","Synaptic","Interface"] },
  { name: "Psionic", types: ["Telekinesis","Clairvoyance","Telepathy","Pyrokinesis","Cryokinesis","Electrokinesis","Geomancy","Aeromancy","Hydromancy","Umbramancy"] },
];

interface ThemeType {
  id: string;
  family: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subTypes: ThemeSubType[];
}

interface ThemeSubType {
  id: string;
  name: string;
  description: string;
  modifier: string;
  icon: string;
}

const THEME_ICONS: Record<string, string[]> = {
  Fire: ["🔥","🌋","☄️","☀️","💥","🔥","🜂","🜃","🜄","🜁"],
  Ice: ["❄️","🧊","⛄","🌨️","🥶","💎","🔷","❄","🌀","💠"],
  Lightning: ["⚡","🌩️","⚡","💥","🔌","✨","⚡","⚡","💫","🌟"],
  Earth: ["🌍","⛰️","🪨","🏔️","🌋","🪨","🏔️","⛰️","🌍","💎"],
  Wind: ["💨","🌬️","🌪️","🌀","✈️","🍃","💨","🌬️","⛅","🌥️"],
  Water: ["💧","🌊","🌊","💦","💧","🧊","💧","💦","🌊","💧"],
  Light: ["✨","💡","☀️","🌟","💫","⭐","✨","💡","☀️","🌟"],
  Darkness: ["🌑","🖤","⬛","🌑","🌑","🖤","⬛","🌑","🌑","🖤"],
};

const allThemeTypes: ThemeType[] = [];
let themeIdx = 0;
for (const family of THEME_FAMILIES) {
  for (const typeName of family.types) {
    const subTypeCount = 5;
    allThemeTypes.push({
      id: `theme_${themeIdx}`,
      family: family.name,
      name: typeName,
      description: `${typeName}-themed abilities within the ${family.name} family.`,
      icon: THEME_ICONS[typeName]?.[0] || "✦",
      color: `hsl(${themeIdx * (360 / 190)}, 70%, 50%)`,
      subTypes: Array.from({ length: subTypeCount }, (_, si) => ({
        id: `subtype_${themeIdx}_${si}`,
        name: `${typeName} ${["Mastery","Expertise","Mastery II","Mastery III","Supremacy"][si]}`,
        description: `Advanced ${typeName.toLowerCase()} sub-type for ${family.name.toLowerCase()} theme.`,
        modifier: `${["Power","Precision","Duration","Range","Potency"][si]}: +${(si + 1) * 5}%`,
        icon: THEME_ICONS[typeName]?.[si] || "✦",
      })),
    });
    themeIdx++;
  }
}

const themeTypesTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export const TOTAL_THEME_TYPES = ${allThemeTypes.length};
export const TOTAL_THEME_SUBTYPES = ${allThemeTypes.reduce((a, t) => a + t.subTypes.length, 0)};

export const THEME_FAMILIES = ${JSON.stringify(THEME_FAMILIES.map(f => f.name))};

export interface ThemeSubType {
  id: string;
  name: string;
  description: string;
  modifier: string;
  icon: string;
}

export interface ThemeType {
  id: string;
  family: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subTypes: ThemeSubType[];
}

export const THEME_TYPES: ThemeType[] = ${JSON.stringify(allThemeTypes, null, 2)};
`;

writeFileSync(resolve(outDir, "themeTypes.ts"), themeTypesTs);
console.log(`✅ themeTypes.ts — ${allThemeTypes.length} theme types, ${allThemeTypes.reduce((a, t) => a + t.subTypes.length, 0)} subtypes`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKILL TREE: 999 LEVELS ACROSS 99 TIERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  level: number;
  branch: string;
  type: "normal" | "notable" | "keystone" | "legendary";
  cost: number;
  effects: Record<string, number>;
  prerequisiteIds: string[];
}

const BRANCHES = ["warfare","logistics","science","engineering","diplomacy","espionage","exploration","mysticism","industry","command"] as const;

const allSkillTreeNodes: SkillTreeNode[] = [];
let nodeId = 0;

for (let tier = 1; tier <= 99; tier++) {
  const nodesPerTier = tier <= 10 ? 3 : tier <= 30 ? 4 : tier <= 60 ? 5 : tier <= 80 ? 6 : 7;
  const branchForTier = BRANCHES[tier % BRANCHES.length];

  for (let ni = 0; ni < nodesPerTier; ni++) {
    const level = (tier - 1) * LEVELS_PER_TIER + Math.floor((ni / nodesPerTier) * LEVELS_PER_TIER) + 1;
    const type: SkillTreeNode["type"] =
      ni === 0 ? "notable" :
      ni === nodesPerTier - 1 ? (tier % 10 === 0 ? "keystone" : "notable") :
      tier === 99 ? "legendary" : "normal";

    const prerequisiteIds: string[] = [];
    if (tier > 1) {
      const prevTierNodes = allSkillTreeNodes.filter(n => n.tier === tier - 1);
      if (prevTierNodes.length > 0) {
        prerequisiteIds.push(prevTierNodes[Math.min(ni, prevTierNodes.length - 1)].id);
      }
    }

    const effectKey = STAT_KEYS[nodeId % STAT_KEYS.length];
    const effectValue = type === "legendary" ? 50 : type === "keystone" ? 25 : type === "notable" ? 15 : 5 + (tier % 10);

    allSkillTreeNodes.push({
      id: `stn_${nodeId}`,
      name: `${TIER_NAMES[tier - 1]} ${["Core","Node","Focus","Aspect","Mastery","Apex","Zenith"][ni % 7]}`,
      description: `${type === "legendary" ? "Legendary" : type === "keystone" ? "Keystone" : type === "notable" ? "Notable" : "Standard"} skill node for ${branchForTier} at tier ${tier}.`,
      tier,
      level,
      branch: branchForTier,
      type,
      cost: type === "legendary" ? 10 : type === "keystone" ? 5 : type === "notable" ? 3 : 1,
      effects: { [effectKey]: effectValue },
      prerequisiteIds,
    });
    nodeId++;
  }
}

const skillTreeTs = `// AUTO-GENERATED: ${new Date().toISOString()}
export const SKILL_TREE_MAX_LEVEL = 999;
export const SKILL_TREE_MAX_TIER = 99;
export const SKILL_TREE_LEVELS_PER_TIER = ${LEVELS_PER_TIER};
export const TOTAL_SKILL_TREE_NODES = ${allSkillTreeNodes.length};

export type SkillBranch = "warfare" | "logistics" | "science" | "engineering" | "diplomacy" | "espionage" | "exploration" | "mysticism" | "industry" | "command";

export type NodeType = "normal" | "notable" | "keystone" | "legendary";

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  level: number;
  branch: SkillBranch;
  type: NodeType;
  cost: number;
  effects: Record<string, number>;
  prerequisiteIds: string[];
}

export const BRANCH_NAMES: Record<SkillBranch, string> = {
  warfare: "Warfare Doctrine",
  logistics: "Logistics Chain",
  science: "Scientific Mastery",
  engineering: "Engineering Matrix",
  diplomacy: "Diplomatic Influence",
  espionage: "Shadow Intelligence",
  exploration: "Frontier Explorer",
  mysticism: "Arcane Weaving",
  industry: "Industrial Titan",
  command: "Command Authority",
};

export const SKILL_TREE_NODES: SkillTreeNode[] = ${JSON.stringify(allSkillTreeNodes, null, 2)};
`;

writeFileSync(resolve(outDir, "skillTreeNodes.ts"), skillTreeTs);
console.log(`✅ skillTreeNodes.ts — ${allSkillTreeNodes.length} nodes across 99 tiers, 999 levels`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDEX FILE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const indexTs = `// AUTO-GENERATED MASTERY SYSTEM INDEX
// ${new Date().toISOString()}
// ============================================================
// 99 Tiers | 999 Levels | 90 Categories | 900+ Classes
// 350+ Mastery Classes | 190 Theme Types
// ============================================================

export { MASTERY_TIERS, TOTAL_TIERS, TOTAL_LEVELS, LEVELS_PER_TIER } from "./masteryTiers";
export type { MasteryTier } from "./masteryTiers";

export { SKILL_CATEGORIES, TOTAL_CATEGORIES, TOTAL_SUBCATEGORIES } from "./skillCategories";
export type { SkillCategory, SkillSubcategory } from "./skillCategories";

export { CLASS_ENTRIES, TOTAL_CLASSES } from "./classEntries";
export type { ClassEntry } from "./classEntries";

export { MASTERY_CLASSES, MASTERY_DOMAINS, TOTAL_MASTERY_CLASSES, TOTAL_SUBCLASSES } from "./masteryClasses";
export type { MasteryClassDef, MasterySubClassDef, MasteryDomain } from "./masteryClasses";

export { THEME_TYPES, THEME_FAMILIES, TOTAL_THEME_TYPES, TOTAL_THEME_SUBTYPES } from "./themeTypes";
export type { ThemeType, ThemeSubType } from "./themeTypes";

export { SKILL_TREE_NODES, SKILL_TREE_MAX_LEVEL, SKILL_TREE_MAX_TIER, TOTAL_SKILL_TREE_NODES, BRANCH_NAMES } from "./skillTreeNodes";
export type { SkillTreeNode, SkillBranch, NodeType } from "./skillTreeNodes";
`;

writeFileSync(resolve(outDir, "index.ts"), indexTs);
console.log(`✅ index.ts — barrel export`);
console.log(`\n🎯 MASTERY SYSTEM GENERATED:`);
console.log(`   99 tiers | 999 levels`);
console.log(`   ${categories.length} categories | ${totalSubcategories} subcategories`);
console.log(`   ${classEntries.length} class entries`);
console.log(`   ${allMasteryClasses.length} mastery classes | ${allMasteryClasses.reduce((a, c) => a + c.subclasses.length, 0)} subclasses`);
console.log(`   ${allThemeTypes.length} theme types | ${allThemeTypes.reduce((a, t) => a + t.subTypes.length, 0)} subtypes`);
console.log(`   ${allSkillTreeNodes.length} skill tree nodes`);
