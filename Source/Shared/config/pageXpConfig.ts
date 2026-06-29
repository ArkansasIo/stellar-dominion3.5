export interface PageXpSource {
  page: string;
  subPage?: string;
  action: string;
  label: string;
  baseXp: number;
  cooldownSeconds: number;
  category: "resource" | "combat" | "construction" | "research" | "fleet" | "exploration" | "trading" | "social" | "diplomacy" | "administration" | "achievement";
}

export const PAGE_XP_SOURCES: PageXpSource[] = [
  // Overview / Dashboard
  { page: "overview", action: "view", label: "View Dashboard", baseXp: 5, cooldownSeconds: 300, category: "administration" },

  // Resources
  { page: "resources", action: "collect", label: "Collect Resources", baseXp: 10, cooldownSeconds: 60, category: "resource" },
  { page: "resources", subPage: "metal-mine", action: "upgrade", label: "Upgrade Metal Mine", baseXp: 25, cooldownSeconds: 0, category: "resource" },
  { page: "resources", subPage: "crystal-mine", action: "upgrade", label: "Upgrade Crystal Mine", baseXp: 25, cooldownSeconds: 0, category: "resource" },
  { page: "resources", subPage: "deuterium-synth", action: "upgrade", label: "Upgrade Deuterium Synthesizer", baseXp: 25, cooldownSeconds: 0, category: "resource" },
  { page: "resources", subPage: "solar-plant", action: "upgrade", label: "Upgrade Solar Plant", baseXp: 20, cooldownSeconds: 0, category: "resource" },
  { page: "resources", subPage: "fusion-reactor", action: "upgrade", label: "Upgrade Fusion Reactor", baseXp: 35, cooldownSeconds: 0, category: "resource" },
  { page: "resources", subPage: "storage", action: "upgrade", label: "Upgrade Storage", baseXp: 15, cooldownSeconds: 0, category: "resource" },
  { page: "resources", action: "auto-buy", label: "Auto-Buy Resources", baseXp: 8, cooldownSeconds: 120, category: "resource" },

  // Facilities
  { page: "facilities", subPage: "robotics", action: "upgrade", label: "Upgrade Robotics Factory", baseXp: 30, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "shipyard", action: "upgrade", label: "Upgrade Shipyard", baseXp: 30, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "research-lab", action: "upgrade", label: "Upgrade Research Lab", baseXp: 30, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "nanite", action: "upgrade", label: "Upgrade Nanite Factory", baseXp: 50, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "terraformer", action: "upgrade", label: "Upgrade Terraformer", baseXp: 60, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "missile-silo", action: "upgrade", label: "Upgrade Missile Silo", baseXp: 20, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "alliance-depot", action: "upgrade", label: "Upgrade Alliance Depot", baseXp: 20, cooldownSeconds: 0, category: "construction" },
  { page: "facilities", subPage: "space-dock", action: "upgrade", label: "Upgrade Space Dock", baseXp: 40, cooldownSeconds: 0, category: "construction" },

  // Shipyard
  { page: "shipyard", action: "build", label: "Build Ships", baseXp: 20, cooldownSeconds: 0, category: "fleet" },
  { page: "shipyard", subPage: "build", action: "queue", label: "Queue Ship Construction", baseXp: 15, cooldownSeconds: 0, category: "fleet" },

  // Fleet
  { page: "fleet", action: "deploy", label: "Deploy Fleet", baseXp: 30, cooldownSeconds: 0, category: "fleet" },
  { page: "fleet", subPage: "mission", action: "send", label: "Send Fleet Mission", baseXp: 35, cooldownSeconds: 0, category: "fleet" },
  { page: "fleet", subPage: "recall", action: "recall", label: "Recall Fleet", baseXp: 10, cooldownSeconds: 0, category: "fleet" },
  { page: "fleet", subPage: "fleet-save", action: "save", label: "Fleet Save", baseXp: 15, cooldownSeconds: 300, category: "fleet" },

  // Fleet Yard
  { page: "fleet-yard", action: "view", label: "View Fleet Yard", baseXp: 5, cooldownSeconds: 300, category: "fleet" },
  { page: "fleet-yard", subPage: "repair", action: "repair", label: "Repair Fleet", baseXp: 20, cooldownSeconds: 0, category: "fleet" },

  // Orbital Defense
  { page: "orbital-defense", action: "build", label: "Build Defense", baseXp: 20, cooldownSeconds: 0, category: "combat" },
  { page: "orbital-defense", subPage: "shield-dome", action: "upgrade", label: "Upgrade Shield Dome", baseXp: 35, cooldownSeconds: 0, category: "combat" },
  { page: "orbital-defense", subPage: "missile", action: "launch", label: "Launch Missiles", baseXp: 25, cooldownSeconds: 0, category: "combat" },

  // Research
  { page: "research", action: "start", label: "Start Research", baseXp: 30, cooldownSeconds: 0, category: "research" },
  { page: "research", subPage: "technology", action: "complete", label: "Complete Research", baseXp: 60, cooldownSeconds: 0, category: "research" },
  { page: "research", subPage: "lab", action: "upgrade", label: "Upgrade Lab", baseXp: 30, cooldownSeconds: 0, category: "research" },
  { page: "research", subPage: "xp", action: "earn", label: "Earn Research XP", baseXp: 15, cooldownSeconds: 60, category: "research" },

  // Galaxy
  { page: "galaxy", action: "scan", label: "Scan Galaxy", baseXp: 15, cooldownSeconds: 60, category: "exploration" },
  { page: "galaxy", subPage: "system", action: "view", label: "View System", baseXp: 8, cooldownSeconds: 120, category: "exploration" },
  { page: "galaxy", subPage: "planet", action: "probe", label: "Probe Planet", baseXp: 20, cooldownSeconds: 0, category: "exploration" },

  // Espionage
  { page: "espionage", action: "scan", label: "Espionage Scan", baseXp: 25, cooldownSeconds: 0, category: "exploration" },
  { page: "espionage", subPage: "sabotage", action: "execute", label: "Sabotage Operation", baseXp: 50, cooldownSeconds: 0, category: "exploration" },
  { page: "espionage", subPage: "steal", action: "research", label: "Steal Research", baseXp: 45, cooldownSeconds: 0, category: "exploration" },

  // Combat
  { page: "combat", action: "attack", label: "Attack Target", baseXp: 50, cooldownSeconds: 0, category: "combat" },
  { page: "combat", subPage: "acs", action: "join", label: "Join ACS Attack", baseXp: 40, cooldownSeconds: 0, category: "combat" },
  { page: "combat", subPage: "acs", action: "create", label: "Create ACS Group", baseXp: 25, cooldownSeconds: 0, category: "combat" },
  { page: "combat", subPage: "destroy", action: "launch", label: "Destroy Mission", baseXp: 35, cooldownSeconds: 0, category: "combat" },
  { page: "combat", subPage: "battle-report", action: "view", label: "View Battle Report", baseXp: 10, cooldownSeconds: 120, category: "combat" },

  // Expeditions
  { page: "expeditions", action: "launch", label: "Launch Expedition", baseXp: 40, cooldownSeconds: 0, category: "exploration" },
  { page: "expeditions", subPage: "result", action: "claim", label: "Claim Expedition Rewards", baseXp: 25, cooldownSeconds: 0, category: "exploration" },

  // Planets
  { page: "planets", action: "view", label: "View Planet", baseXp: 5, cooldownSeconds: 300, category: "administration" },
  { page: "planets", subPage: "colony", action: "build", label: "Build Colony", baseXp: 50, cooldownSeconds: 0, category: "exploration" },
  { page: "planets", subPage: "colonize", action: "send", label: "Send Colony Ship", baseXp: 45, cooldownSeconds: 0, category: "exploration" },

  // Moons
  { page: "moons", action: "build", label: "Build Moon Base", baseXp: 40, cooldownSeconds: 0, category: "construction" },
  { page: "moons", subPage: "phalanx", action: "scan", label: "Phalanx Scan", baseXp: 20, cooldownSeconds: 0, category: "exploration" },
  { page: "moons", subPage: "jump-gate", action: "jump", label: "Jump Gate Transfer", baseXp: 35, cooldownSeconds: 0, category: "fleet" },

  // Debris / Recyclers
  { page: "debris", action: "collect", label: "Collect Debris", baseXp: 20, cooldownSeconds: 0, category: "resource" },
  { page: "debris", subPage: "recycler", action: "send", label: "Send Recyclers", baseXp: 15, cooldownSeconds: 0, category: "fleet" },

  // Market / Trading
  { page: "market", action: "create-order", label: "Create Market Order", baseXp: 15, cooldownSeconds: 60, category: "trading" },
  { page: "market", subPage: "trade", action: "execute", label: "Execute Trade", baseXp: 20, cooldownSeconds: 0, category: "trading" },
  { page: "market", subPage: "auction", action: "bid", label: "Place Auction Bid", baseXp: 12, cooldownSeconds: 60, category: "trading" },

  // Alliances
  { page: "alliance", action: "create", label: "Create Alliance", baseXp: 100, cooldownSeconds: 0, category: "social" },
  { page: "alliance", subPage: "members", action: "invite", label: "Invite Member", baseXp: 15, cooldownSeconds: 60, category: "social" },
  { page: "alliance", subPage: "diplomacy", action: "send", label: "Diplomatic Message", baseXp: 12, cooldownSeconds: 120, category: "diplomacy" },

  // Guilds
  { page: "guilds", action: "create", label: "Create Guild", baseXp: 80, cooldownSeconds: 0, category: "social" },
  { page: "guilds", subPage: "raid", action: "start", label: "Start Guild Raid", baseXp: 60, cooldownSeconds: 0, category: "combat" },

  // Messaging
  { page: "messages", action: "send", label: "Send Message", baseXp: 5, cooldownSeconds: 120, category: "social" },
  { page: "messages", subPage: "report", action: "read", label: "Read Report", baseXp: 3, cooldownSeconds: 300, category: "administration" },

  // Commander
  { page: "commander", action: "upgrade", label: "Upgrade Commander", baseXp: 30, cooldownSeconds: 0, category: "administration" },
  { page: "commander", subPage: "skills", action: "assign", label: "Assign Skill Points", baseXp: 15, cooldownSeconds: 60, category: "administration" },

  // Government
  { page: "government", action: "change", label: "Change Government", baseXp: 50, cooldownSeconds: 0, category: "administration" },
  { page: "government", subPage: "progression", action: "advance", label: "Advance Government", baseXp: 40, cooldownSeconds: 0, category: "administration" },

  // Empire
  { page: "empire", action: "view", label: "View Empire", baseXp: 5, cooldownSeconds: 300, category: "administration" },
  { page: "empire", subPage: "profile", action: "update", label: "Update Empire Profile", baseXp: 15, cooldownSeconds: 120, category: "administration" },
  { page: "empire", subPage: "progression", action: "level", label: "Empire Level Up", baseXp: 100, cooldownSeconds: 0, category: "achievement" },

  // Settings
  { page: "settings", action: "update", label: "Update Settings", baseXp: 5, cooldownSeconds: 600, category: "administration" },

  // Achievements
  { page: "achievements", action: "unlock", label: "Unlock Achievement", baseXp: 100, cooldownSeconds: 0, category: "achievement" },

  // Weekly Missions
  { page: "weekly-missions", action: "complete", label: "Complete Weekly Mission", baseXp: 75, cooldownSeconds: 0, category: "achievement" },

  // Season Pass
  { page: "season", action: "level", label: "Season Level Up", baseXp: 50, cooldownSeconds: 0, category: "achievement" },

  // Story Mode
  { page: "story", action: "complete", label: "Complete Story Mission", baseXp: 80, cooldownSeconds: 0, category: "exploration" },

  // Construction (generic building)
  { page: "construction", action: "complete", label: "Complete Construction", baseXp: 25, cooldownSeconds: 0, category: "construction" },
  { page: "construction", subPage: "queue", action: "add", label: "Add to Queue", baseXp: 10, cooldownSeconds: 30, category: "construction" },

  // Banking
  { page: "bank", action: "deposit", label: "Deposit Resources", baseXp: 10, cooldownSeconds: 120, category: "resource" },
  { page: "bank", subPage: "withdraw", action: "withdraw", label: "Withdraw Resources", baseXp: 10, cooldownSeconds: 120, category: "resource" },
  { page: "bank", subPage: "vault", action: "upgrade", label: "Upgrade Vault", baseXp: 30, cooldownSeconds: 0, category: "construction" },

  // Starbases
  { page: "starbases", action: "build", label: "Build Starbase", baseXp: 45, cooldownSeconds: 0, category: "construction" },
  { page: "starbases", subPage: "upgrade", action: "upgrade", label: "Upgrade Starbase", baseXp: 35, cooldownSeconds: 0, category: "construction" },

  // MegaStructures
  { page: "megastructures", action: "start", label: "Start Megastructure", baseXp: 100, cooldownSeconds: 0, category: "construction" },
  { page: "megastructures", subPage: "phase", action: "complete", label: "Complete Megastructure Phase", baseXp: 150, cooldownSeconds: 0, category: "construction" },

  // Raids
  { page: "raids", action: "start", label: "Start Raid", baseXp: 50, cooldownSeconds: 0, category: "combat" },
  { page: "raids", subPage: "boss", action: "defeat", label: "Defeat Raid Boss", baseXp: 100, cooldownSeconds: 0, category: "combat" },

  // Relics / Artifacts
  { page: "relics", action: "collect", label: "Collect Relic", baseXp: 30, cooldownSeconds: 0, category: "exploration" },
  { page: "artifacts", action: "research", label: "Research Artifact", baseXp: 35, cooldownSeconds: 0, category: "research" },

  // Power Grid
  { page: "power-grid", action: "balance", label: "Balance Power Grid", baseXp: 15, cooldownSeconds: 120, category: "resource" },

  // Outlaw/Vacation
  { page: "outlaw", action: "status", label: "Check Outlaw Status", baseXp: 0, cooldownSeconds: 600, category: "administration" },
  { page: "vacation", action: "activate", label: "Activate Vacation Mode", baseXp: 0, cooldownSeconds: 86400, category: "administration" },
  { page: "vacation", subPage: "deactivate", action: "deactivate", label: "Deactivate Vacation Mode", baseXp: 20, cooldownSeconds: 0, category: "administration" },
];

export function getPageXp(page: string, action: string, subPage?: string): PageXpSource | undefined {
  return PAGE_XP_SOURCES.find(
    (s) => s.page === page && s.action === action && (s.subPage === subPage || (!s.subPage && !subPage))
  );
}

export function getPageXpSources(page: string): PageXpSource[] {
  return PAGE_XP_SOURCES.filter((s) => s.page === page);
}

export function getXpSourcesByCategory(category: PageXpSource["category"]): PageXpSource[] {
  return PAGE_XP_SOURCES.filter((s) => s.category === category);
}
