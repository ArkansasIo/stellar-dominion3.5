export type BossClassId =
  | "abyssal"
  | "iron"
  | "swarm"
  | "psionic"
  | "necrotic"
  | "celestial"
  | "temporal"
  | "bioforge"
  | "void";

export type BossRarity = "rare" | "epic" | "legendary" | "mythic" | "transcendent";

export interface BossTypeDefinition {
  id: string;
  name: string;
  description: string;
  subtypes: string[];
}

export interface BossSubclassDefinition {
  id: string;
  name: string;
  doctrine: string;
  types: BossTypeDefinition[];
}

export interface BossClassDefinition {
  id: BossClassId;
  name: string;
  doctrine: string;
  color: string;
  imagePath: string;
  subclasses: BossSubclassDefinition[];
  arcBoss: {
    id: string;
    name: string;
    title: string;
    description: string;
    rarity: BossRarity;
    abilities: string[];
    eventIds: string[];
  };
}

const type = (id: string, name: string, description: string, subtypes: string[]): BossTypeDefinition => ({ id, name, description, subtypes });
const subclass = (id: string, name: string, doctrine: string, types: BossTypeDefinition[]): BossSubclassDefinition => ({ id, name, doctrine, types });

export const BOSS_TAXONOMY: BossClassDefinition[] = [
  {
    id: "abyssal",
    name: "Abyssal Leviathan",
    doctrine: "Gravity, tidal pressure, and battlefield displacement.",
    color: "#22d3ee",
    imagePath: "/assets/bosses/boss-abyssal-leviathan.png",
    subclasses: [
      subclass("deepmaw", "Deepmaw", "Crushes formations with gravity wells.", [type("planetbreaker", "Planetbreaker", "Moon-scale jaws and impact charges.", ["tidal-crush", "mantle-rend"]), type("gravity-serpent", "Gravity Serpent", "Coils around fleets and bends trajectories.", ["orbit-lock", "event-horizon-coil"])]),
      subclass("voidfin", "Voidfin", "Hunts isolated targets across unstable lanes.", [type("rift-hunter", "Rift Hunter", "Ambushes from short-lived rifts.", ["blink-bite", "rift-mark"]), type("star-eater", "Star Eater", "Drains reactor light to accelerate.", ["solar-drain", "flare-spit"])]),
      subclass("maelstrom", "Maelstrom", "Turns the encounter arena into a moving hazard.", [type("storm-core", "Storm Core", "Builds an expanding gravity storm.", ["cyclone-field", "debris-orbit"]), type("mooncoil", "Mooncoil", "Weaponizes captured moons and stations.", ["satellite-slam", "lunar-shield"]) ]),
    ],
    arcBoss: { id: "arc-abyssal-leviathan", name: "Nhal'Zor, the Abyssal Leviathan", title: "The Ocean Beneath Stars", description: "A world-serpent that folds battlefields into tidal gravity seas.", rarity: "mythic", abilities: ["Tidal Cataclysm", "Gravity Coil", "Abyssal Regeneration"], eventIds: ["event-abyssal-tide", "event-abyssal-moonfall"] },
  },
  {
    id: "iron",
    name: "Iron Dreadnought",
    doctrine: "Armor, siege geometry, and overwhelming sustained fire.",
    color: "#f59e0b",
    imagePath: "/assets/bosses/boss-iron-dreadnought.png",
    subclasses: [
      subclass("bastion", "Bastion", "Builds layered defenses that must be dismantled in sequence.", [type("fortress-heart", "Fortress Heart", "Protects a reactor behind rotating bulwarks.", ["bastion-wall", "reactor-guard"]), type("shield-monolith", "Shield Monolith", "Projects interlocking shield lattices.", ["shield-spire", "kinetic-echo"])]),
      subclass("siege", "Siege", "Punishes static fleets with long-range salvos.", [type("rail-citadel", "Rail Citadel", "Charges a sector-spanning rail lance.", ["rail-lance", "armor-piercer"]), type("bombardier", "Bombardier", "Calls down precise orbital bombardment.", ["orbital-mark", "saturation-fire"])]),
      subclass("warcore", "Warcore", "Converts damage and destroyed modules into new weapons.", [type("arsenal-prime", "Arsenal Prime", "Swaps weapon packages between phases.", ["weapon-morph", "counter-battery"]), type("command-behemoth", "Command Behemoth", "Directs escort fleets through tactical signals.", ["formation-order", "reinforcement-wave"])]),
    ],
    arcBoss: { id: "arc-iron-dreadnought", name: "Aurex-9, the Iron Dreadnought", title: "Cathedral of War", description: "A sentient siege fleet whose reactor burns like a captive sun.", rarity: "mythic", abilities: ["Cathedral Broadside", "Fortress Protocol", "Redline Overdrive"], eventIds: ["event-iron-siege", "event-iron-armada"] },
  },
  {
    id: "swarm",
    name: "Swarm Matriarch",
    doctrine: "Exponential reinforcements, target marking, and adaptive biology.",
    color: "#facc15",
    imagePath: "/assets/bosses/boss-swarm-matriarch.png",
    subclasses: [
      subclass("brood", "Brood", "Multiplies bodies faster than fleets can clear them.", [type("egg-bastion", "Egg Bastion", "Spawns armored larvae in protected clusters.", ["hatch-cycle", "shell-bloom"]), type("queen-guard", "Queen Guard", "Redirects damage through elite sentinels.", ["bodyguard-swap", "royal-sting"])]),
      subclass("hive", "Hive", "Links units into a shared tactical organism.", [type("signal-hive", "Signal Hive", "Synchronizes all swarm attacks.", ["synaptic-link", "command-pulse"]), type("carapace-engine", "Carapace Engine", "Hardens the swarm after each phase.", ["adaptive-shell", "molting-surge"])]),
      subclass("plague", "Plague", "Disables fleets with corrosive spores and system infection.", [type("spore-cloud", "Spore Cloud", "Blinds sensors and corrupts targeting.", ["sensor-blight", "corrosive-mist"]), type("gene-horror", "Gene Horror", "Mutates tactics in response to player roles.", ["role-predator", "rapid-evolution"])]),
    ],
    arcBoss: { id: "arc-swarm-matriarch", name: "Xyra-Prime, the Swarm Matriarch", title: "Mother of a Million Wings", description: "A crystalline queen whose offspring rewrite the ecology of every raid zone.", rarity: "mythic", abilities: ["Broodstorm", "Adaptive Mutation", "Royal Signal"], eventIds: ["event-swarm-hatching", "event-swarm-plague"] },
  },
  {
    id: "psionic",
    name: "Psionic Oracle",
    doctrine: "Prediction, control, and attacks that weaponize commander intent.",
    color: "#c084fc",
    imagePath: "/assets/bosses/boss-psionic-oracle.png",
    subclasses: [
      subclass("oracle", "Oracle", "Reads future actions and counters repeated patterns.", [type("fate-reader", "Fate Reader", "Punishes the most likely player action.", ["probability-mark", "future-shock"]), type("astral-seer", "Astral Seer", "Creates false targets across the arena.", ["mirror-fleet", "decoy-constellation"])]),
      subclass("dominator", "Dominator", "Hijacks formation decisions and role assignments.", [type("mind-throne", "Mind Throne", "Temporarily swaps raid roles.", ["role-inversion", "command-silence"]), type("dream-engine", "Dream Engine", "Turns buffs into dangerous illusions.", ["phantom-buff", "sleep-vector"])]),
      subclass("resonant", "Resonant", "Amplifies every cast ability into an echo attack.", [type("thoughtstorm", "Thoughtstorm", "Repeats the last major player ability.", ["echo-cast", "memory-lance"]), type("chorus-core", "Chorus Core", "Stacks psychic resonance between targets.", ["resonance-chain", "harmonic-break"])]),
    ],
    arcBoss: { id: "arc-psionic-oracle", name: "Ilyth Vey, the Psionic Oracle", title: "The Answer Before the Question", description: "A mind beyond chronology that turns player strategy into ammunition.", rarity: "mythic", abilities: ["Predicted Cataclysm", "Role Inversion", "Oracle's Refrain"], eventIds: ["event-psionic-prophecy", "event-psionic-dream"] },
  },
  {
    id: "necrotic",
    name: "Necrotic Revenant",
    doctrine: "Attrition, resurrection, and weaponized battlefield remains.",
    color: "#34d399",
    imagePath: "/assets/bosses/boss-necrotic-revenant.png",
    subclasses: [
      subclass("grave", "Grave", "Turns defeated units into persistent hazards.", [type("bone-fleet", "Bone Fleet", "Raises destroyed ships as hostile echoes.", ["grave-launch", "skeletal-escort"]), type("tomb-warden", "Tomb Warden", "Locks defeated modules behind tomb shields.", ["coffin-field", "warden-mark"])]),
      subclass("wraith", "Wraith", "Phases through shields and drains commander resources.", [type("phase-stalker", "Phase Stalker", "Ignores the first layer of defense.", ["phase-breach", "spectral-dash"]), type("soul-drinker", "Soul Drinker", "Converts casualties into healing.", ["essence-leech", "wither-beam"])]),
      subclass("ossuary", "Ossuary", "Builds a fortress from accumulated battle remains.", [type("relic-casket", "Relic Casket", "Stores lethal attacks for later release.", ["relic-cache", "death-unseal"]), type("sepulcher", "Sepulcher", "Creates zones where defeated units cannot be revived.", ["final-rest", "null-requiem"])]),
    ],
    arcBoss: { id: "arc-necrotic-revenant", name: "Morduun, the Necrotic Revenant", title: "The Fleet That Would Not Die", description: "An undead admiral wearing centuries of defeated armadas as armor.", rarity: "mythic", abilities: ["Revenant Armada", "Soul Harvest", "Final Requiem"], eventIds: ["event-necrotic-grave", "event-necrotic-revenant"] },
  },
  {
    id: "celestial",
    name: "Celestial Seraph",
    doctrine: "Radiance, purification, and escalating holy machine phases.",
    color: "#60a5fa",
    imagePath: "/assets/bosses/boss-celestial-seraph.png",
    subclasses: [
      subclass("seraph", "Seraph", "Uses wing formations to control the entire encounter space.", [type("winged-court", "Winged Court", "Deploys orbiting wing sentinels.", ["halo-guard", "radiant-sweep"]), type("throneblade", "Throneblade", "Focuses a single target with stellar judgment.", ["judgment-ray", "crown-mark"])]),
      subclass("luminary", "Luminary", "Heals allies while burning away debuffs.", [type("sun-priest", "Sun Priest", "Restores boss armor through light pillars.", ["solar-rite", "purity-field"]), type("dawn-engine", "Dawn Engine", "Resets one damaged boss subsystem.", ["dawn-reset", "flare-bloom"])]),
      subclass("halo", "Halo", "Creates rotating safe and lethal zones.", [type("ringkeeper", "Ringkeeper", "Rotates damage corridors around the arena.", ["orbiting-lane", "ring-collapse"]), type("star-sentinel", "Star Sentinel", "Marks the fleet with beacon-based strikes.", ["beacon-lance", "constellation-net"])]),
    ],
    arcBoss: { id: "arc-celestial-seraph", name: "Astrael, the Celestial Seraph", title: "Crown of the First Light", description: "A star-forged judge whose wings turn every raid into a ritual of positioning.", rarity: "mythic", abilities: ["Seraphic Verdict", "Halo Rotation", "First-Light Ascension"], eventIds: ["event-celestial-dawn", "event-celestial-verdict"] },
  },
  {
    id: "temporal",
    name: "Temporal Archon",
    doctrine: "Timeline splits, delayed damage, and phase rewinds.",
    color: "#38bdf8",
    imagePath: "/assets/bosses/boss-temporal-archon.png",
    subclasses: [
      subclass("chronarch", "Chronarch", "Controls turn order and action timing.", [type("clockblade", "Clockblade", "Delays incoming damage into future rounds.", ["delayed-wound", "second-hand-strike"]), type("epoch-warden", "Epoch Warden", "Locks a phase until a timeline key is broken.", ["epoch-lock", "history-gate"])]),
      subclass("paradox", "Paradox", "Creates mutually exclusive versions of the boss.", [type("mirror-epoch", "Mirror Epoch", "Splits into two contradictory attack profiles.", ["dual-history", "paradox-bolt"]), type("loop-engine", "Loop Engine", "Repeats a prior encounter phase with altered stats.", ["phase-loop", "recursive-surge"])]),
      subclass("entropy", "Entropy", "Accelerates degradation and rewards decisive play.", [type("decay-star", "Decay Star", "Reduces fleet effectiveness each round.", ["entropy-aura", "rust-of-time"]), type("last-moment", "Last Moment", "Stores a lethal strike behind a countdown.", ["deadline-mark", "zero-second"])]),
    ],
    arcBoss: { id: "arc-temporal-archon", name: "Veyra-Null, the Temporal Archon", title: "Keeper of the Unspent Second", description: "A crystalline sovereign that edits the raid timeline while players are still acting.", rarity: "mythic", abilities: ["Timeline Fracture", "Phase Rewind", "The Last Second"], eventIds: ["event-temporal-loop", "event-temporal-collapse"] },
  },
  {
    id: "bioforge",
    name: "Bioforge Colossus",
    doctrine: "Adaptation, modular body plans, and industrial regeneration.",
    color: "#fb923c",
    imagePath: "/assets/bosses/boss-bioforge-colossus.png",
    subclasses: [
      subclass("forge", "Forge", "Builds new body modules from battlefield materials.", [type("furnace-heart", "Furnace Heart", "Raises heat until the arena becomes hazardous.", ["magma-cycle", "forge-vent"]), type("assembly-titan", "Assembly Titan", "Constructs a new limb or weapon each phase.", ["modular-limb", "rapid-assembly"])]),
      subclass("genetic", "Genetic", "Adapts resistances to the players' strongest damage type.", [type("gene-shifter", "Gene Shifter", "Changes defenses after repeated attacks.", ["resistance-swap", "mutation-burst"]), type("adaptation-core", "Adaptation Core", "Copies one player technology effect.", ["tech-mimic", "evolution-pulse"])]),
      subclass("industrial", "Industrial", "Uses drones, vats, and manufacturing lines as adds.", [type("vat-mother", "Vat Mother", "Spawns specialized worker organisms.", ["worker-wave", "growth-vat"]), type("refinery-beast", "Refinery Beast", "Converts debris into armor and fuel.", ["scrap-conversion", "fuel-rush"])]),
    ],
    arcBoss: { id: "arc-bioforge-colossus", name: "Kharox-Prime, the Bioforge Colossus", title: "The Factory That Learned Hunger", description: "A living industrial engine that grows a bespoke counter to every fleet.", rarity: "mythic", abilities: ["Adaptive Carapace", "Forgefall", "Modular Rebirth"], eventIds: ["event-bioforge-mutation", "event-bioforge-foundry"] },
  },
  {
    id: "void",
    name: "Void Emperor",
    doctrine: "Suppression, singularity hazards, and reality denial.",
    color: "#a78bfa",
    imagePath: "/assets/bosses/boss-void-emperor.png",
    subclasses: [
      subclass("emperor", "Emperor", "Suppresses player bonuses and dominates the arena.", [type("black-crown", "Black Crown", "Nullifies the strongest active buff.", ["crown-null", "sovereign-mark"]), type("gravity-regent", "Gravity Regent", "Pins fleets into a shrinking combat lane.", ["regent-well", "crush-vector"])]),
      subclass("singularity", "Singularity", "Creates local black holes that alter target priority.", [type("event-horizon", "Event Horizon", "Erases projectiles and summons.", ["horizon-pull", "lightless-zone"]), type("dark-star", "Dark Star", "Consumes a planet-side support effect.", ["planet-eclipse", "mass-shadow"])]),
      subclass("null", "Null", "Removes information, healing, and reliable targeting.", [type("silence-core", "Silence Core", "Disables one combat role's signature action.", ["command-null", "mute-field"]), type("unmaker", "Unmaker", "Deletes a damaged subsystem from the encounter rules.", ["rule-break", "unmake-ray"])]),
    ],
    arcBoss: { id: "arc-void-emperor", name: "Noctivar, the Void Emperor", title: "The Throne Outside Reality", description: "A crowned singularity that makes the absence of rules its primary weapon.", rarity: "transcendent", abilities: ["Imperial Null", "Event-Horizon Throne", "Unmake the Fleet"], eventIds: ["event-void-eclipse", "event-void-unmaking"] },
  },
];

export const BOSS_CLASS_IDS = BOSS_TAXONOMY.map((entry) => entry.id);
export const ARC_BOSSES = BOSS_TAXONOMY.map((entry) => entry.arcBoss);

export const RAID_EVENTS = BOSS_TAXONOMY.flatMap((bossClass, classIndex) => bossClass.arcBoss.eventIds.map((eventId, eventIndex) => ({
  id: eventId,
  name: `${bossClass.name}: ${eventIndex === 0 ? "Awakening" : "Final Convergence"}`,
  description: `${bossClass.arcBoss.name} has entered the sector. Assemble a raid team tuned for ${bossClass.name.toLowerCase()} mechanics and defeat its arc before the window closes.`,
  bossClass: bossClass.id,
  arcBossId: bossClass.arcBoss.id,
  eventType: "boss_raid",
  eventClass: eventIndex === 0 ? "legendary" : "mythic",
  difficulty: 7 + classIndex % 4 + eventIndex,
  participantLimit: eventIndex === 0 ? 24 : 36,
  minimumLevel: 20 + classIndex * 4,
  duration: eventIndex === 0 ? 180 : 240,
  status: "active",
  rewards: {
    credits: 5000 + classIndex * 1250,
    metal: 12000 + classIndex * 2500,
    crystal: 8000 + classIndex * 1800,
    arcShards: 1 + eventIndex,
  },
})));

export const BOSS_VARIANTS = BOSS_TAXONOMY.flatMap((bossClass, classIndex) => bossClass.subclasses.flatMap((bossSubclass, subclassIndex) => bossSubclass.types.map((bossType, typeIndex) => ({
  id: `boss-${bossClass.id}-${bossSubclass.id}-${bossType.id}`,
  name: `${bossType.name} ${bossClass.name}`,
  description: bossType.description,
  bossType: bossType.id,
  bossClass: bossClass.id,
  bossSubclass: bossSubclass.id,
  bossSubtypes: bossType.subtypes,
  rarity: (classIndex + subclassIndex + typeIndex) % 3 === 0 ? "epic" : "legendary" as BossRarity,
  healthPoints: 150000 + classIndex * 28000 + subclassIndex * 12000 + typeIndex * 7000,
  attackPower: 2400 + classIndex * 360 + subclassIndex * 150 + typeIndex * 80,
  defense: 1800 + classIndex * 260 + subclassIndex * 110 + typeIndex * 70,
  speed: 90 + classIndex * 12 + subclassIndex * 5,
  abilities: bossType.subtypes,
  recommendedLevel: 20 + classIndex * 4 + subclassIndex * 2,
  recommendedPlayers: 6 + subclassIndex * 2,
  minPlayers: 2 + subclassIndex,
  bossReward: { credits: 900 + classIndex * 180, metal: 2400 + classIndex * 420, crystal: 1500 + classIndex * 260, arcShards: 1 },
  imageUrl: bossClass.imagePath,
}))));

export const ARC_BOSS_RECORDS = BOSS_TAXONOMY.map((bossClass, classIndex) => ({
  id: bossClass.arcBoss.id,
  name: bossClass.arcBoss.name,
  description: bossClass.arcBoss.description,
  bossType: "arc_boss",
  bossClass: bossClass.id,
  bossSubclass: "arc",
  bossSubtypes: bossClass.arcBoss.abilities,
  rarity: bossClass.arcBoss.rarity,
  healthPoints: 900000 + classIndex * 140000,
  attackPower: 9800 + classIndex * 900,
  defense: 8200 + classIndex * 760,
  speed: 180 + classIndex * 18,
  abilities: bossClass.arcBoss.abilities,
  recommendedLevel: 45 + classIndex * 4,
  recommendedPlayers: 18 + classIndex,
  minPlayers: 6,
  bossReward: { credits: 12000 + classIndex * 1500, metal: 30000 + classIndex * 4000, crystal: 22000 + classIndex * 3000, arcShards: 5 },
  imageUrl: bossClass.imagePath,
}));

export const ALL_BOSS_RECORDS = [...BOSS_VARIANTS, ...ARC_BOSS_RECORDS];

export function getBossClass(classId: string): BossClassDefinition | undefined {
  return BOSS_TAXONOMY.find((entry) => entry.id === classId);
}

export function getBossEvent(eventId: string) {
  return RAID_EVENTS.find((event) => event.id === eventId);
}

export function getBossImagePath(classId: string): string {
  return getBossClass(classId)?.imagePath || "/assets/bosses/boss-celestial-seraph.png";
}

export const VOID_EMPEROR_DOSSIER = {
  bossId: "arc-void-emperor",
  title: "Noctivar, the Void Emperor",
  subtitle: "The Throne Outside Reality",
  encounter: {
    recommendedLevel: 77,
    squadSize: "18–24 commanders",
    damageWindow: "12 minutes or 8 phases",
    arena: "The Black Crown — a collapsing singularity with four gravity lanes",
    victoryCondition: "Break the Crown, survive Unmake the Fleet, and deal 100% hull damage before the final collapse.",
  },
  phases: [
    {
      phase: "I — Imperial Arrival",
      trigger: "100%–82% hull",
      mechanic: "Imperial Null marks the three highest-buff commanders and suppresses their active bonuses for 20 seconds. Black Crown emits four rotating gravity lanes.",
      counterplay: "Spread marked commanders across separate lanes, rotate defensive cooldowns, and do not stack all buffs before the mark resolves.",
    },
    {
      phase: "II — Event-Horizon Throne",
      trigger: "82%–55% hull",
      mechanic: "Three event horizons spawn. Each horizon pulls ships inward, deletes projectiles, and feeds Noctivar a 4% damage shield if left open for 12 seconds.",
      counterplay: "Assign one control group to each horizon. Use mobility or displacement effects to escape the pull, then destroy horizons in clockwise order.",
    },
    {
      phase: "III — Sovereign Eclipse",
      trigger: "55%–30% hull",
      mechanic: "The arena loses its safe lane. Every 18 seconds, Sovereign Mark selects a random role; that role receives 40% increased damage but cannot be healed by direct effects.",
      counterplay: "Use support cleansing and indirect regeneration on the marked role. DPS must burst the exposed crown nodes during the 6-second eclipse window.",
    },
    {
      phase: "IV — Unmake the Fleet",
      trigger: "30%–0% hull",
      mechanic: "Noctivar queues three Unmake rays. Each ray permanently disables one damaged subsystem and applies 25% max-hull damage. A fourth ray fires if the raid has exceeded the enrage timer.",
      counterplay: "Keep every subsystem above 35% before phase IV, interrupt the ray channel with coordinated burst, and reserve emergency mitigation for the third ray.",
    },
  ],
  mechanics: [
    { name: "Imperial Null", category: "Suppression", detail: "Removes the strongest active player buff from the marked commander and prevents reapplication for 20 seconds." },
    { name: "Gravity Crown", category: "Positioning", detail: "Four lanes rotate clockwise every 9 seconds. Crossing a dark seam deals 8% max hull damage and applies Slow 2." },
    { name: "Singularity Debt", category: "Escalation", detail: "Each unresolved event horizon grants Noctivar +4% attack and increases the next horizon count by one." },
    { name: "Unmake Ray", category: "Execution", detail: "A 5-second channel that permanently disables one subsystem and deals 25% max-hull damage. Interrupt threshold: 160,000 burst damage." },
    { name: "Reality Denial", category: "Healing", detail: "After 20% hull, healing is 50% less effective while direct resurrection is disabled." },
  ],
  roleCounterplay: [
    { role: "Tank", assignment: "Anchor the boss away from the active horizon and absorb Gravity Crown crossings.", priority: "Keep aggro stable through phase transitions." },
    { role: "DPS", assignment: "Destroy horizon nodes first, then burst Crown nodes during Sovereign Eclipse.", priority: "Save burst for Unmake Ray interrupts." },
    { role: "Healer", assignment: "Pre-shield marked roles and use indirect regeneration during Sovereign Eclipse.", priority: "Do not spend the final emergency cooldown before phase IV." },
    { role: "Support", assignment: "Cleanse suppression, rotate displacement immunity, and call the clockwise lane order.", priority: "Track Singularity Debt and announce the third horizon." },
  ],
  enrage: {
    timer: "12:00",
    softEnrage: "At 9:00, Gravity Crown rotation accelerates by 25% and event horizons gain +20% health.",
    hardEnrage: "At 12:00, Noctivar casts Unmake the Fleet every 20 seconds and gains +100% attack. The encounter is considered lost after three hard-enrage casts.",
  },
  drops: [
    { item: "Void Emperor Sigil", category: "Guaranteed", chance: "100%", quantity: "1", detail: "Arc token used to unlock Void-class commander upgrades." },
    { item: "Singularity Shard", category: "Guaranteed", chance: "100%", quantity: "5–8", detail: "Crafting material for null-field and gravity weapons." },
    { item: "Crown of the Unmade", category: "Mythic", chance: "8%", quantity: "1", detail: "Unique relic; grants Reality Denial resistance and +12% raid damage." },
    { item: "Event-Horizon Lance", category: "Legendary", chance: "14%", quantity: "1", detail: "Capital-ship weapon with a chance to ignore shield layers." },
    { item: "Noctivar's Mantle", category: "Legendary", chance: "18%", quantity: "1", detail: "Commander armor that reduces suppression duration by 35%." },
    { item: "Black Crown Blueprint", category: "Epic", chance: "28%", quantity: "1", detail: "Blueprint for a gravity-lane control module." },
    { item: "Void Alloy", category: "Material", chance: "65%", quantity: "120–240", detail: "High-density alloy for endgame hull and defense fabrication." },
    { item: "Credits", category: "Currency", chance: "100%", quantity: "18,000–32,000", detail: "Scales with damage contribution and phase interrupts." },
    { item: "Arc Reputation", category: "Progression", chance: "100%", quantity: "900–1,400", detail: "Advances the Void arc and unlocks the next event tier." },
  ],
};
