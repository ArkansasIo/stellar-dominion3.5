export type RealmTier = "Sovereign" | "Dominion" | "Ascendant" | "Warfront" | "Prosperity" | "Industrial" | "Strike" | "Shadow" | "Endgame";
export type ServerRegion = "nexus-alpha" | "cygnus-eu" | "orion-apac";
export type RealmStatus = "live" | "new" | "full" | "locked";
export type RealmBonusType = "research" | "production" | "defense" | "economy" | "military" | "espionage" | "colonization" | "diplomacy";

export interface RealmBonus {
  type: RealmBonusType;
  value: number;
  label: string;
}

export interface RealmDef {
  id: string;
  name: string;
  tier: RealmTier;
  tierNumber: number;
  universe: string;
  universeDescription: string;
  server: ServerRegion;
  serverLabel: string;
  status: RealmStatus;
  icon: string;
  bannerGradient: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  population: string;
  populationCount: number;
  onlinePlayers: number;
  totalEmpires: number;
  avgPower: number;
  description: string;
  lore: string;
  bonuses: RealmBonus[];
  features: string[];
  restrictions: string[];
  recommendedFor: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Veteran";
  startResources: {
    credits: number;
    minerals: number;
    energy: number;
    alloys: number;
    research: number;
    influence: number;
  };
  specialMechanic: string;
  seasonalEvent: string;
  maxAllianceSize: number;
  galaxySize: "Small" | "Medium" | "Large" | "Massive";
  speedMultiplier: number;
}

export const SERVER_INFO: Record<ServerRegion, { name: string; region: string; latency: string; status: "healthy" | "degraded" | "offline"; uptime: string }> = {
  "nexus-alpha": { name: "Nexus Alpha", region: "US East (Virginia)", latency: "~20ms", status: "healthy", uptime: "99.97%" },
  "cygnus-eu": { name: "Cygnus", region: "EU West (Frankfurt)", latency: "~35ms", status: "healthy", uptime: "99.94%" },
  "orion-apac": { name: "Orion", region: "APAC (Singapore)", latency: "~45ms", status: "healthy", uptime: "99.91%" },
};

export const REALMS: RealmDef[] = [
  {
    id: "realm-01",
    name: "Asgard Prime",
    tier: "Sovereign",
    tierNumber: 1,
    universe: "Nexus Crown",
    universeDescription: "The apex cluster of the known galaxy",
    server: "nexus-alpha",
    serverLabel: "Nexus Alpha (US)",
    status: "live",
    icon: "👑",
    bannerGradient: "from-yellow-500 via-amber-500 to-orange-600",
    accentColor: "#f59e0b",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    population: "14.2M",
    populationCount: 14200000,
    onlinePlayers: 487000,
    totalEmpires: 128400,
    avgPower: 847000,
    description: "The crown jewel of the galactic order. Asgard Prime is the seat of supreme command, where the most powerful empires vie for dominion over the known universe.",
    lore: "Founded at the dawn of the galactic age, Asgard Prime has been the crucible where legends are forged. Its councils shape the fate of billions, and its fleets patrol the most contested corridors of space.",
    bonuses: [
      { type: "diplomacy", value: 15, label: "+15% Diplomacy" },
      { type: "production", value: 10, label: "+10% Production" },
    ],
    features: ["Apex Fleet Command", "Galactic Council Access", "Prestige Diplomacy", "Crown World Events"],
    restrictions: ["Minimum 500K power to enter", "Monthly maintenance tax +20%"],
    recommendedFor: ["Diplomacy mains", "Alliance leaders", "Endgame players"],
    difficulty: "Veteran",
    startResources: { credits: 50000, minerals: 30000, energy: 20000, alloys: 15000, research: 10000, influence: 5000 },
    specialMechanic: "Crown Authority — Hold the Throne to receive +25% to all production and unique Crown Edicts.",
    seasonalEvent: "War of Crowns — Quarterly empire-vs-empire tournament for control of the Crown World.",
    maxAllianceSize: 40,
    galaxySize: "Massive",
    speedMultiplier: 1.0,
  },
  {
    id: "realm-02",
    name: "Midgard Frontier",
    tier: "Dominion",
    tierNumber: 2,
    universe: "Nexus Crown",
    universeDescription: "The apex cluster of the known galaxy",
    server: "nexus-alpha",
    serverLabel: "Nexus Alpha (US)",
    status: "live",
    icon: "🌍",
    bannerGradient: "from-green-500 via-emerald-500 to-teal-600",
    accentColor: "#10b981",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    population: "11.8M",
    populationCount: 11800000,
    onlinePlayers: 412000,
    totalEmpires: 105200,
    avgPower: 623000,
    description: "The heartland of expansion and opportunity. Midgard Frontier rewards balanced empire-building with generous colonization bonuses and thriving trade networks.",
    lore: "Once a scattered collection of frontier worlds, Midgard has unified under a banner of cooperative growth. Its worlds bloom with diverse populations and its trade routes span the sector.",
    bonuses: [
      { type: "colonization", value: 20, label: "+20% Colonization" },
      { type: "economy", value: 10, label: "+10% Economy" },
    ],
    features: ["Colonial Expansion Bonus", "Trade Route Mastery", "Population Growth +25%", "Frontier Markets"],
    restrictions: [],
    recommendedFor: ["New players", "Economy builders", "Expansion specialists"],
    difficulty: "Beginner",
    startResources: { credits: 40000, minerals: 40000, energy: 25000, alloys: 10000, research: 8000, influence: 3000 },
    specialMechanic: "Frontier Spirit — Each new colony provides a stacking +2% bonus to all resource production for 30 days.",
    seasonalEvent: "Gold Rush — Limited-time resource spikes appear across the frontier, rewarding fast expansion.",
    maxAllianceSize: 35,
    galaxySize: "Large",
    speedMultiplier: 1.1,
  },
  {
    id: "realm-03",
    name: "Alfheim Radiant",
    tier: "Ascendant",
    tierNumber: 3,
    universe: "Aurora Reach",
    universeDescription: "A luminous region of scientific discovery",
    server: "cygnus-eu",
    serverLabel: "Cygnus (EU)",
    status: "live",
    icon: "🔬",
    bannerGradient: "from-blue-500 via-cyan-500 to-sky-600",
    accentColor: "#06b6d4",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    population: "9.4M",
    populationCount: 9400000,
    onlinePlayers: 315000,
    totalEmpires: 82100,
    avgPower: 534000,
    description: "The intellectual capital of the galaxy. Alfheim Radiant accelerates all research and unlocks unique technologies unavailable elsewhere.",
    lore: "Alfheim's ancient precursor libraries hold secrets that accelerate scientific progress by decades. Empires here pioneer breakthroughs that reshape galactic civilization.",
    bonuses: [
      { type: "research", value: 25, label: "+25% Research" },
    ],
    features: ["Accelerated Research", "Unique Tech Trees", "Lab Synergy Bonuses", "Science Council"],
    restrictions: ["Military production -10%"],
    recommendedFor: ["Tech rushers", "Research specialists", "Science Victory seekers"],
    difficulty: "Intermediate",
    startResources: { credits: 35000, minerals: 25000, energy: 30000, alloys: 8000, research: 20000, influence: 4000 },
    specialMechanic: "Resonance Fields — Research buildings produce 50% more when adjacent to other research buildings.",
    seasonalEvent: "Technological Singularity — A precursor artifact activates, doubling all research for 72 hours.",
    maxAllianceSize: 30,
    galaxySize: "Medium",
    speedMultiplier: 1.0,
  },
  {
    id: "realm-04",
    name: "Jotunheim Bastion",
    tier: "Warfront",
    tierNumber: 4,
    universe: "Aurora Reach",
    universeDescription: "A luminous region of scientific discovery",
    server: "cygnus-eu",
    serverLabel: "Cygnus (EU)",
    status: "live",
    icon: "⚔️",
    bannerGradient: "from-red-500 via-orange-500 to-amber-600",
    accentColor: "#ef4444",
    textColor: "text-red-400",
    borderColor: "border-red-500/40",
    glowColor: "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    population: "8.9M",
    populationCount: 8900000,
    onlinePlayers: 298000,
    totalEmpires: 76400,
    avgPower: 712000,
    description: "The militarized frontier where only the strongest survive. Jotunheim Bastion amplifies defense and assault capabilities for total war doctrine.",
    lore: "Born from centuries of border conflict, Jotunheim's worlds are fortified citadels. Its shipyards produce warships of unmatched durability, and its commanders are feared across the sector.",
    bonuses: [
      { type: "defense", value: 20, label: "+20% Defense" },
      { type: "military", value: 15, label: "+15% Military" },
    ],
    features: ["Fortress World Bonus", "Shipyard Speed +30%", "Defense Grid Supreme", "Warlord Council"],
    restrictions: ["Research speed -15%"],
    recommendedFor: ["PvP players", "Defense builders", "Fleet commanders"],
    difficulty: "Advanced",
    startResources: { credits: 30000, minerals: 35000, energy: 20000, alloys: 25000, research: 5000, influence: 3000 },
    specialMechanic: "Iron Wall — Defensive structures have +40% HP and repair 2x faster after combat.",
    seasonalEvent: "Siege of Jotunheim — Massive AI armada attacks all border systems, rewarding defenders with exclusive blueprints.",
    maxAllianceSize: 45,
    galaxySize: "Large",
    speedMultiplier: 1.0,
  },
  {
    id: "realm-05",
    name: "Vanaheim Bloom",
    tier: "Prosperity",
    tierNumber: 5,
    universe: "Verdant Expanse",
    universeDescription: "A lush region of abundant natural resources",
    server: "orion-apac",
    serverLabel: "Orion (APAC)",
    status: "live",
    icon: "💰",
    bannerGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    accentColor: "#34d399",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-400/40",
    glowColor: "shadow-[0_0_30px_rgba(52,211,153,0.2)]",
    population: "10.6M",
    populationCount: 10600000,
    onlinePlayers: 378000,
    totalEmpires: 94300,
    avgPower: 489000,
    description: "The wealthiest realm in the galaxy. Vanaheim Bloom offers unparalleled resource generation and economic supremacy for trade-focused empires.",
    lore: "Vanaheim's verdant worlds produce rare minerals and bio-resources found nowhere else. Its merchant princes trade across all realms, and its banks underwrite galactic commerce.",
    bonuses: [
      { type: "economy", value: 25, label: "+25% Economy" },
      { type: "production", value: 10, label: "+10% Production" },
    ],
    features: ["Resource Surge Events", "Trade Route Mastery", "Market Fee -50%", "Merchant Guilds"],
    restrictions: ["Fleet capacity -10%"],
    recommendedFor: ["Economy mains", "Trade empires", "Passive builders"],
    difficulty: "Intermediate",
    startResources: { credits: 60000, minerals: 50000, energy: 30000, alloys: 12000, research: 7000, influence: 4000 },
    specialMechanic: "Bloom Cycle — Every 48 hours, resource production doubles for 6 hours across all colonies.",
    seasonalEvent: "Harvest Festival — Double resource drops from all planetary events for one week.",
    maxAllianceSize: 30,
    galaxySize: "Medium",
    speedMultiplier: 1.2,
  },
  {
    id: "realm-06",
    name: "Svartalf Forge",
    tier: "Industrial",
    tierNumber: 6,
    universe: "Verdant Expanse",
    universeDescription: "A lush region of abundant natural resources",
    server: "orion-apac",
    serverLabel: "Orion (APAC)",
    status: "live",
    icon: "🔨",
    bannerGradient: "from-slate-400 via-zinc-500 to-neutral-600",
    accentColor: "#a1a1aa",
    textColor: "text-zinc-400",
    borderColor: "border-zinc-500/40",
    glowColor: "shadow-[0_0_30px_rgba(161,161,170,0.2)]",
    population: "7.7M",
    populationCount: 7700000,
    onlinePlayers: 256000,
    totalEmpires: 67800,
    avgPower: 598000,
    description: "The industrial backbone of the galaxy. Svartalf Forge excels in shipbuilding, blueprint mastery, and producing elite hull components.",
    lore: "Svartalf's foundries burn with plasma fires visible from orbit. Its engineers craft vessels and weapons that set the standard for galactic military hardware.",
    bonuses: [
      { type: "production", value: 25, label: "+25% Production" },
      { type: "military", value: 10, label: "+10% Military" },
    ],
    features: ["Shipyard Speed +50%", "Blueprint Mastery", "Alloy Production +40%", "Forge World Bonus"],
    restrictions: ["Research cost +10%"],
    recommendedFor: ["Ship builders", "Industrialists", "Blueprint collectors"],
    difficulty: "Intermediate",
    startResources: { credits: 25000, minerals: 60000, energy: 25000, alloys: 30000, research: 6000, influence: 2500 },
    specialMechanic: "Forge Mastery — Ship construction costs -20% and build speed +30% for all vessels.",
    seasonalEvent: "Grand Forge — Players compete to build the most ships in 48 hours, with top builders earning legendary blueprints.",
    maxAllianceSize: 35,
    galaxySize: "Medium",
    speedMultiplier: 1.0,
  },
  {
    id: "realm-07",
    name: "Muspel Pyre",
    tier: "Strike",
    tierNumber: 7,
    universe: "Crimson Verge",
    universeDescription: "A volatile frontier of constant conflict",
    server: "nexus-alpha",
    serverLabel: "Nexus Alpha (US)",
    status: "live",
    icon: "🔥",
    bannerGradient: "from-orange-500 via-red-500 to-rose-600",
    accentColor: "#f97316",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/40",
    glowColor: "shadow-[0_0_30px_rgba(249,115,22,0.2)]",
    population: "6.3M",
    populationCount: 6300000,
    onlinePlayers: 234000,
    totalEmpires: 58900,
    avgPower: 678000,
    description: "The burning crucible of galactic warfare. Muspel Pyre rewards aggressive expansion, raiding, and total fleet superiority.",
    lore: "Muspel's worlds orbit unstable stars, and its people are forged in the fires of constant conflict. Only the aggressive thrive here — the timid are consumed.",
    bonuses: [
      { type: "military", value: 25, label: "+25% Military" },
      { type: "production", value: 10, label: "+10% Production" },
    ],
    features: ["Raid Bonus +30%", "Fleet Speed +20%", "Pillage Rewards", "Warlord Rank System"],
    restrictions: ["Defense structures -20% effectiveness", "Alliance size capped at 25"],
    recommendedFor: ["PvP raiders", "Aggressive players", "Fleet combat specialists"],
    difficulty: "Advanced",
    startResources: { credits: 30000, minerals: 25000, energy: 20000, alloys: 20000, research: 5000, influence: 2000 },
    specialMechanic: "Inferno Rage — Winning battles grants stacking +5% fleet attack bonus (max +50%) that decays over time.",
    seasonalEvent: "Inferno War — All shields are disabled for 24 hours, turning the realm into a kill-or-be-killed free-for-all.",
    maxAllianceSize: 25,
    galaxySize: "Small",
    speedMultiplier: 1.3,
  },
  {
    id: "realm-08",
    name: "Niflheim Veil",
    tier: "Shadow",
    tierNumber: 8,
    universe: "Crimson Verge",
    universeDescription: "A volatile frontier of constant conflict",
    server: "cygnus-eu",
    serverLabel: "Cygnus (EU)",
    status: "live",
    icon: "🌑",
    bannerGradient: "from-purple-500 via-violet-500 to-indigo-600",
    accentColor: "#a855f7",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    population: "5.8M",
    populationCount: 5800000,
    onlinePlayers: 198000,
    totalEmpires: 51200,
    avgPower: 512000,
    description: "The unseen hand of galactic politics. Niflheim Veil is the realm of spies, saboteurs, and shadow emperors who rule from the darkness.",
    lore: "Hidden within dense nebulae, Niflheim's worlds are shrouded in perpetual twilight. Its intelligence networks span the galaxy, and its agents move unseen between empires.",
    bonuses: [
      { type: "espionage", value: 30, label: "+30% Espionage" },
      { type: "diplomacy", value: 10, label: "+10% Diplomacy" },
    ],
    features: ["Spy Network Supreme", "Intel Gathering +40%", "Sabotage Mastery", "Shadow Council"],
    restrictions: ["Fleet visibility -20%", "Public intel -30%"],
    recommendedFor: ["Espionage mains", "Spy enthusiasts", "Information warfare"],
    difficulty: "Advanced",
    startResources: { credits: 35000, minerals: 20000, energy: 25000, alloys: 10000, research: 15000, influence: 8000 },
    specialMechanic: "Veil of Shadows — Espionage actions cost 30% less and have +25% success rate. Assassination missions unlock at lower empire levels.",
    seasonalEvent: "Shadow Games — Espionage point leaderboard with exclusive spy-themed cosmetics and agent skins.",
    maxAllianceSize: 20,
    galaxySize: "Small",
    speedMultiplier: 1.0,
  },
  {
    id: "realm-09",
    name: "Hel Nexus",
    tier: "Endgame",
    tierNumber: 9,
    universe: "Oblivion Gate",
    universeDescription: "The bleeding edge of galactic collapse",
    server: "orion-apac",
    serverLabel: "Orion (APAC)",
    status: "live",
    icon: "💀",
    bannerGradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    accentColor: "#f43f5e",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/40",
    glowColor: "shadow-[0_0_30px_rgba(244,63,94,0.2)]",
    population: "4.9M",
    populationCount: 4900000,
    onlinePlayers: 167000,
    totalEmpires: 42800,
    avgPower: 923000,
    description: "The ultimate proving ground. Hel Nexus is reserved for veteran empires seeking the apex of power through ascension loops and cosmic mastery.",
    lore: "At the edge of galactic collapse, Hel Nexus exists in a state of perpetual entropy. Only the most advanced empires can survive here, where the laws of physics bend and reality fractures.",
    bonuses: [
      { type: "production", value: 15, label: "+15% Production" },
      { type: "research", value: 15, label: "+15% Research" },
      { type: "military", value: 15, label: "+15% Military" },
    ],
    features: ["Ascension Loops", "Reality Warping", "Omega Technologies", "Nexus Collapse Events"],
    restrictions: ["Minimum 2M power to enter", "No new accounts", "Permanent death mode optional"],
    recommendedFor: ["Veteran players", "Ascension chasers", "Hardcore gamers"],
    difficulty: "Veteran",
    startResources: { credits: 80000, minerals: 60000, energy: 50000, alloys: 40000, research: 30000, influence: 10000 },
    specialMechanic: "Entropy Surge — Every 72 hours, a random system undergoes an entropy event, reshaping the map and creating new opportunities.",
    seasonalEvent: "Nexus Collapse — The galaxy map partially resets every season, forcing empires to re-expand and re-fortify.",
    maxAllianceSize: 20,
    galaxySize: "Small",
    speedMultiplier: 1.5,
  },
];

export function getRealmById(id: string): RealmDef | undefined {
  return REALMS.find((r) => r.id === id);
}

export function getRealmsByServer(server: ServerRegion): RealmDef[] {
  return REALMS.filter((r) => r.server === server);
}

export function getRealmsByDifficulty(difficulty: RealmDef["difficulty"]): RealmDef[] {
  return REALMS.filter((r) => r.difficulty === difficulty);
}

export function getTotalPopulation(): string {
  const total = REALMS.reduce((sum, r) => sum + r.populationCount, 0);
  if (total >= 1_000_000_000) return `${(total / 1_000_000_000).toFixed(1)}B`;
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}M`;
  return total.toLocaleString();
}

export function getTotalOnlinePlayers(): number {
  return REALMS.reduce((sum, r) => sum + r.onlinePlayers, 0);
}

export function getTotalEmpires(): number {
  return REALMS.reduce((sum, r) => sum + r.totalEmpires, 0);
}
