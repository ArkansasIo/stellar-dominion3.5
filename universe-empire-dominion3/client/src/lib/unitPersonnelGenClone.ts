import { UnitItem, unitData } from "./unitData";
import { generateTroopName, getRandomRank, getRandomTitle, getEquipmentFor } from "./militaryData";
import { getTroopStats } from "./militaryAttributes";

export type PersonnelStatus = "active" | "reserve" | "wounded" | "kia" | "training";

export type TroopSpecialization = "infantry" | "cavalry" | "archer" | "mage" | "support" | "siege";

export interface PersonnelStats {
  strength: number;
  endurance: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface PersonnelEquipment {
  weapon: { name: string; rarity: string; damage: number; weight: number } | null;
  armor: { name: string; rarity: string; defense: number; weight: number; evade: number } | null;
  helmet: { name: string; rarity: string; defense: number } | null;
  shield: { name: string; rarity: string; defense: number } | null;
}

export interface PersonnelProgress {
  level: number;
  experience: number;
  morale: number;
  fatigue: number;
  combatReadiness: number;
}

export interface MilitaryPersonnel {
  id: string;
  unitId: string;
  displayName: string;
  rank: string;
  title: string;
  specialization: TroopSpecialization;
  status: PersonnelStatus;
  stats: PersonnelStats;
  equipment: PersonnelEquipment;
  progress: PersonnelProgress;
  assignedFrameId?: string;
  createdAt: number;
}

export interface MilitaryUnitInstance {
  id: string;
  unit: UnitItem;
  quantity: number;
  activePersonnel: MilitaryPersonnel[];
  reservePersonnel: MilitaryPersonnel[];
  createdAt: number;
  tags: string[];
}

export interface PersonnelGenerationOptions {
  specialization?: TroopSpecialization;
  status?: PersonnelStatus;
  level?: number;
  morale?: number;
  fatigue?: number;
  assignedFrameId?: string;
  seed?: number;
}

export interface UnitInstanceOptions {
  reserveRatio?: number;
  personnelOverrides?: PersonnelGenerationOptions;
  tags?: string[];
}

export type UnitPersonnelDomain = "military" | "government" | "civilian" | "scientific" | "industrial";

export interface DomainPersonnelProfile {
  id: string;
  unitId: string;
  domain: UnitPersonnelDomain;
  displayName: string;
  role: string;
  grade: string;
  status: PersonnelStatus;
  stats: PersonnelStats;
  progress: PersonnelProgress;
  tags: string[];
  createdAt: number;
}

export interface DomainPersonnelGenerationOptions {
  domain?: UnitPersonnelDomain;
  role?: string;
  grade?: string;
  status?: PersonnelStatus;
  level?: number;
  morale?: number;
  fatigue?: number;
  tags?: string[];
  seed?: number;
}

export interface DomainUnitInstance {
  id: string;
  unit: UnitItem;
  domain: UnitPersonnelDomain;
  quantity: number;
  activePersonnel: DomainPersonnelProfile[];
  reservePersonnel: DomainPersonnelProfile[];
  createdAt: number;
  tags: string[];
}

const UNIT_LOOKUP = new Map<string, UnitItem>(unitData.map((entry) => [entry.id, entry]));

function createRng(seed?: number): () => number {
  if (seed === undefined) {
    return () => Math.random();
  }

  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function randomId(prefix: string, rng: () => number): string {
  const stamp = Date.now().toString(36);
  const randomChunk = Math.floor(rng() * 1_000_000_000).toString(36);
  return `${prefix}_${stamp}_${randomChunk}`;
}

function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function specializationFromUnit(unit: UnitItem): TroopSpecialization {
  if (unit.class === "troop") return "infantry";
  if (unit.class === "vehicle") return "siege";
  if (unit.class === "defense") return "support";
  if (unit.class === "fighter") return "cavalry";
  if (unit.class === "capital" || unit.class === "super" || unit.class === "titan") return "siege";
  return "support";
}

function classFromSpecialization(specialization: TroopSpecialization): string {
  if (specialization === "cavalry") return "knight";
  if (specialization === "archer") return "ranger";
  if (specialization === "mage") return "mage";
  if (specialization === "support") return "healer";
  if (specialization === "siege") return "engineer";
  return "warrior";
}

function calculateCombatReadiness(level: number, morale: number, fatigue: number): number {
  const readiness = 50 + level * 4 + morale * 0.3 - fatigue * 0.5;
  return clamp(Math.round(readiness), 0, 100);
}

const DOMAIN_ROLES: Record<UnitPersonnelDomain, string[]> = {
  military: ["Line Commander", "Strike Officer", "Tactical Specialist", "Defensive Coordinator"],
  government: ["Policy Analyst", "Administrative Director", "Diplomatic Envoy", "Civil Affairs Officer"],
  civilian: ["Colony Supervisor", "Resource Planner", "Infrastructure Foreman", "Logistics Lead"],
  scientific: ["Research Analyst", "Lab Systems Engineer", "Experimental Coordinator", "Data Architect"],
  industrial: ["Factory Operations Lead", "Production Engineer", "Shipyard Controller", "Maintenance Director"],
};

const DOMAIN_GRADES: Record<UnitPersonnelDomain, string[]> = {
  military: ["Cadet", "Lieutenant", "Captain", "Major", "Colonel", "Commander"],
  government: ["Clerk", "Minister", "Senior Minister", "Council Director", "Chancellor"],
  civilian: ["Apprentice", "Technician", "Senior Technician", "Chief Supervisor", "Sector Manager"],
  scientific: ["Junior Researcher", "Researcher", "Senior Researcher", "Principal Scientist", "Lab Director"],
  industrial: ["Operator", "Senior Operator", "Engineer", "Chief Engineer", "Industrial Marshal"],
};

function pickFromArray<T>(entries: T[], rng: () => number, fallback: T): T {
  if (!entries.length) {
    return fallback;
  }
  return entries[randomInt(0, entries.length - 1, rng)] ?? fallback;
}

function buildDomainStats(domain: UnitPersonnelDomain, rng: () => number): PersonnelStats {
  const baseline = {
    military: { strength: 82, endurance: 74, dexterity: 68, intelligence: 58, wisdom: 52, charisma: 50 },
    government: { strength: 42, endurance: 50, dexterity: 54, intelligence: 82, wisdom: 80, charisma: 84 },
    civilian: { strength: 50, endurance: 60, dexterity: 58, intelligence: 60, wisdom: 62, charisma: 58 },
    scientific: { strength: 38, endurance: 44, dexterity: 62, intelligence: 90, wisdom: 86, charisma: 56 },
    industrial: { strength: 64, endurance: 72, dexterity: 66, intelligence: 70, wisdom: 60, charisma: 52 },
  }[domain];

  const variance = () => randomInt(-6, 6, rng);
  return {
    strength: clamp(baseline.strength + variance(), 1, 100),
    endurance: clamp(baseline.endurance + variance(), 1, 100),
    dexterity: clamp(baseline.dexterity + variance(), 1, 100),
    intelligence: clamp(baseline.intelligence + variance(), 1, 100),
    wisdom: clamp(baseline.wisdom + variance(), 1, 100),
    charisma: clamp(baseline.charisma + variance(), 1, 100),
  };
}

export function getDomainForUnitClass(unitClass: UnitItem["class"]): UnitPersonnelDomain {
  if (unitClass === "troop" || unitClass === "fighter" || unitClass === "capital" || unitClass === "super" || unitClass === "titan") {
    return "military";
  }
  if (unitClass === "defense") {
    return "government";
  }
  if (unitClass === "vehicle") {
    return "industrial";
  }
  if (unitClass === "civilian") {
    return "civilian";
  }
  return "scientific";
}

function createPersonnelProgress(options: PersonnelGenerationOptions, rng: () => number): PersonnelProgress {
  const level = options.level ?? randomInt(1, 8, rng);
  const morale = clamp(options.morale ?? randomInt(55, 95, rng), 0, 100);
  const fatigue = clamp(options.fatigue ?? randomInt(0, 35, rng), 0, 100);
  const experience = level * level * 100 + randomInt(0, 99, rng);

  return {
    level,
    morale,
    fatigue,
    experience,
    combatReadiness: calculateCombatReadiness(level, morale, fatigue),
  };
}

export function generateMilitaryPersonnel(unitId: string, options: PersonnelGenerationOptions = {}): MilitaryPersonnel {
  const unit = UNIT_LOOKUP.get(unitId);
  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`);
  }

  const rng = createRng(options.seed);
  const specialization = options.specialization ?? specializationFromUnit(unit);
  const unitClass = classFromSpecialization(specialization);
  const stats = getTroopStats(unitClass);
  const equipment = getEquipmentFor(specialization) ?? { weapon: null, armor: null, helmet: null, shield: null };
  const progress = createPersonnelProgress(options, rng);

  return {
    id: randomId("prs", rng),
    unitId,
    displayName: generateTroopName(),
    rank: getRandomRank(),
    title: getRandomTitle(specialization),
    specialization,
    status: options.status ?? "active",
    stats,
    equipment,
    progress,
    assignedFrameId: options.assignedFrameId,
    createdAt: Date.now(),
  };
}

export function generateMilitaryPersonnelBatch(
  unitId: string,
  count: number,
  options: PersonnelGenerationOptions = {},
): MilitaryPersonnel[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) =>
    generateMilitaryPersonnel(unitId, {
      ...options,
      seed: options.seed === undefined ? undefined : options.seed + index,
    }),
  );
}

export function cloneMilitaryPersonnel(
  personnel: MilitaryPersonnel,
  overrides: Partial<MilitaryPersonnel> = {},
): MilitaryPersonnel {
  return {
    ...personnel,
    ...overrides,
    stats: { ...personnel.stats, ...(overrides.stats ?? {}) },
    equipment: {
      weapon: overrides.equipment?.weapon ?? (personnel.equipment.weapon ? { ...personnel.equipment.weapon } : null),
      armor: overrides.equipment?.armor ?? (personnel.equipment.armor ? { ...personnel.equipment.armor } : null),
      helmet: overrides.equipment?.helmet ?? (personnel.equipment.helmet ? { ...personnel.equipment.helmet } : null),
      shield: overrides.equipment?.shield ?? (personnel.equipment.shield ? { ...personnel.equipment.shield } : null),
    },
    progress: { ...personnel.progress, ...(overrides.progress ?? {}) },
  };
}

export function cloneMilitaryPersonnelBatch(personnel: MilitaryPersonnel[]): MilitaryPersonnel[] {
  return personnel.map((entry) => cloneMilitaryPersonnel(entry));
}

export function generateMilitaryUnitInstance(
  unitId: string,
  quantity: number,
  options: UnitInstanceOptions = {},
): MilitaryUnitInstance {
  const unit = UNIT_LOOKUP.get(unitId);
  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`);
  }

  const safeQuantity = Math.max(0, Math.floor(quantity));
  const reserveRatio = clamp(options.reserveRatio ?? 0.25, 0, 0.8);
  const reserveCount = Math.floor(safeQuantity * reserveRatio);
  const activeCount = safeQuantity - reserveCount;

  const activePersonnel = generateMilitaryPersonnelBatch(unitId, activeCount, {
    ...options.personnelOverrides,
    status: "active",
  });

  const reservePersonnel = generateMilitaryPersonnelBatch(unitId, reserveCount, {
    ...options.personnelOverrides,
    status: "reserve",
    seed: options.personnelOverrides?.seed === undefined ? undefined : options.personnelOverrides.seed + 100_000,
  });

  return {
    id: randomId("unit", Math.random),
    unit,
    quantity: safeQuantity,
    activePersonnel,
    reservePersonnel,
    createdAt: Date.now(),
    tags: options.tags ? [...options.tags] : [],
  };
}

export function cloneMilitaryUnitInstance(
  instance: MilitaryUnitInstance,
  overrides: Partial<MilitaryUnitInstance> = {},
): MilitaryUnitInstance {
  return {
    ...instance,
    ...overrides,
    unit: overrides.unit ?? { ...instance.unit },
    activePersonnel: overrides.activePersonnel
      ? cloneMilitaryPersonnelBatch(overrides.activePersonnel)
      : cloneMilitaryPersonnelBatch(instance.activePersonnel),
    reservePersonnel: overrides.reservePersonnel
      ? cloneMilitaryPersonnelBatch(overrides.reservePersonnel)
      : cloneMilitaryPersonnelBatch(instance.reservePersonnel),
    tags: overrides.tags ? [...overrides.tags] : [...instance.tags],
  };
}

export function generateMilitaryRosterFromFleet(
  fleet: Record<string, number>,
  options: UnitInstanceOptions = {},
): MilitaryUnitInstance[] {
  return Object.entries(fleet)
    .filter(([, quantity]) => quantity > 0)
    .map(([unitId, quantity]) => generateMilitaryUnitInstance(unitId, quantity, options));
}

export function generateDomainPersonnelProfile(
  unitId: string,
  options: DomainPersonnelGenerationOptions = {},
): DomainPersonnelProfile {
  const unit = UNIT_LOOKUP.get(unitId);
  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`);
  }

  const rng = createRng(options.seed);
  const domain = options.domain ?? getDomainForUnitClass(unit.class);
  const progress = createPersonnelProgress(options, rng);
  const role = options.role ?? pickFromArray(DOMAIN_ROLES[domain], rng, "Specialist");
  const grade = options.grade ?? pickFromArray(DOMAIN_GRADES[domain], rng, "Operator");
  const displayName = domain === "military" ? generateTroopName() : `${grade} ${role}`;

  return {
    id: randomId("dps", rng),
    unitId,
    domain,
    displayName,
    role,
    grade,
    status: options.status ?? "active",
    stats: domain === "military" ? getTroopStats(classFromSpecialization(specializationFromUnit(unit))) : buildDomainStats(domain, rng),
    progress,
    tags: options.tags ? [...options.tags] : [],
    createdAt: Date.now(),
  };
}

export function generateDomainPersonnelBatch(
  unitId: string,
  count: number,
  options: DomainPersonnelGenerationOptions = {},
): DomainPersonnelProfile[] {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, index) =>
    generateDomainPersonnelProfile(unitId, {
      ...options,
      seed: options.seed === undefined ? undefined : options.seed + index,
    }),
  );
}

export function cloneDomainPersonnelProfile(
  profile: DomainPersonnelProfile,
  overrides: Partial<DomainPersonnelProfile> = {},
): DomainPersonnelProfile {
  return {
    ...profile,
    ...overrides,
    stats: { ...profile.stats, ...(overrides.stats ?? {}) },
    progress: { ...profile.progress, ...(overrides.progress ?? {}) },
    tags: overrides.tags ? [...overrides.tags] : [...profile.tags],
  };
}

export function editDomainPersonnelProfile(
  profile: DomainPersonnelProfile,
  edit: {
    displayName?: string;
    role?: string;
    grade?: string;
    status?: PersonnelStatus;
    statDelta?: Partial<PersonnelStats>;
    progressDelta?: Partial<PersonnelProgress>;
    tags?: string[];
  },
): DomainPersonnelProfile {
  const nextStats = {
    strength: clamp(profile.stats.strength + (edit.statDelta?.strength ?? 0), 1, 100),
    endurance: clamp(profile.stats.endurance + (edit.statDelta?.endurance ?? 0), 1, 100),
    dexterity: clamp(profile.stats.dexterity + (edit.statDelta?.dexterity ?? 0), 1, 100),
    intelligence: clamp(profile.stats.intelligence + (edit.statDelta?.intelligence ?? 0), 1, 100),
    wisdom: clamp(profile.stats.wisdom + (edit.statDelta?.wisdom ?? 0), 1, 100),
    charisma: clamp(profile.stats.charisma + (edit.statDelta?.charisma ?? 0), 1, 100),
  };

  const nextProgress = {
    level: clamp(profile.progress.level + (edit.progressDelta?.level ?? 0), 1, 999),
    morale: clamp(profile.progress.morale + (edit.progressDelta?.morale ?? 0), 0, 100),
    fatigue: clamp(profile.progress.fatigue + (edit.progressDelta?.fatigue ?? 0), 0, 100),
    experience: Math.max(0, profile.progress.experience + (edit.progressDelta?.experience ?? 0)),
    combatReadiness: 0,
  };

  nextProgress.combatReadiness = calculateCombatReadiness(nextProgress.level, nextProgress.morale, nextProgress.fatigue);

  return {
    ...profile,
    displayName: edit.displayName ?? profile.displayName,
    role: edit.role ?? profile.role,
    grade: edit.grade ?? profile.grade,
    status: edit.status ?? profile.status,
    stats: nextStats,
    progress: nextProgress,
    tags: edit.tags ? [...edit.tags] : [...profile.tags],
  };
}

export function generateDomainUnitInstance(
  unitId: string,
  quantity: number,
  options: UnitInstanceOptions & DomainPersonnelGenerationOptions = {},
): DomainUnitInstance {
  const unit = UNIT_LOOKUP.get(unitId);
  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`);
  }

  const safeQuantity = Math.max(0, Math.floor(quantity));
  const reserveRatio = clamp(options.reserveRatio ?? 0.25, 0, 0.8);
  const reserveCount = Math.floor(safeQuantity * reserveRatio);
  const activeCount = safeQuantity - reserveCount;
  const domain = options.domain ?? getDomainForUnitClass(unit.class);

  const activePersonnel = generateDomainPersonnelBatch(unitId, activeCount, {
    ...options,
    domain,
    status: "active",
  });

  const reservePersonnel = generateDomainPersonnelBatch(unitId, reserveCount, {
    ...options,
    domain,
    status: "reserve",
    seed: options.seed === undefined ? undefined : options.seed + 100_000,
  });

  return {
    id: randomId("dus", Math.random),
    unit,
    domain,
    quantity: safeQuantity,
    activePersonnel,
    reservePersonnel,
    createdAt: Date.now(),
    tags: options.tags ? [...options.tags] : [],
  };
}

export function cloneDomainUnitInstance(
  instance: DomainUnitInstance,
  overrides: Partial<DomainUnitInstance> = {},
): DomainUnitInstance {
  return {
    ...instance,
    ...overrides,
    unit: overrides.unit ?? { ...instance.unit },
    activePersonnel: overrides.activePersonnel
      ? overrides.activePersonnel.map((profile) => cloneDomainPersonnelProfile(profile))
      : instance.activePersonnel.map((profile) => cloneDomainPersonnelProfile(profile)),
    reservePersonnel: overrides.reservePersonnel
      ? overrides.reservePersonnel.map((profile) => cloneDomainPersonnelProfile(profile))
      : instance.reservePersonnel.map((profile) => cloneDomainPersonnelProfile(profile)),
    tags: overrides.tags ? [...overrides.tags] : [...instance.tags],
  };
}
