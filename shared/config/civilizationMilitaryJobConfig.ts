export type JobDomain = 'civilization' | 'military';
export type JobRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface CivilizationMilitaryJobArchetype {
  id: string;
  name: string;
  domain: JobDomain;
  unitType: string;
  jobType: string;
  subType: string;
  class: string;
  subClass: string;
  title: string;
  rank: number;
  tier: number;
  rarity: JobRarity;
  baseProductivity: number;
  foodDemandPerHour: number;
  waterDemandPerHour: number;
  salaryUpkeepPerHour: {
    credits: number;
    alloys: number;
    data: number;
  };
  unlockLevel: number;
  strategicFocus: string[];
}

const JOB_CLASS_FAMILIES = [
  {
    domain: 'civilization' as const,
    class: 'Governance',
    subClass: 'Administrative Core',
    jobType: 'Administration',
    unitType: 'Executive Unit',
    titlePrefix: 'Governorate',
    focus: ['stability', 'policy', 'civil-order'],
  },
  {
    domain: 'civilization' as const,
    class: 'Infrastructure',
    subClass: 'Urban Engineering',
    jobType: 'Infrastructure',
    unitType: 'Works Unit',
    titlePrefix: 'Arcology Works',
    focus: ['construction', 'maintenance', 'habitats'],
  },
  {
    domain: 'civilization' as const,
    class: 'Science',
    subClass: 'Research Directorate',
    jobType: 'Research',
    unitType: 'Lab Unit',
    titlePrefix: 'Research Cell',
    focus: ['innovation', 'analysis', 'discoveries'],
  },
  {
    domain: 'civilization' as const,
    class: 'Industry',
    subClass: 'Production Grid',
    jobType: 'Manufacturing',
    unitType: 'Factory Unit',
    titlePrefix: 'Forge Wing',
    focus: ['production', 'efficiency', 'supply-chain'],
  },
  {
    domain: 'civilization' as const,
    class: 'Commerce',
    subClass: 'Trade Syndicate',
    jobType: 'Trade',
    unitType: 'Market Unit',
    titlePrefix: 'Trade Desk',
    focus: ['trade', 'tax', 'market-flow'],
  },
  {
    domain: 'military' as const,
    class: 'Fleet',
    subClass: 'Naval Command',
    jobType: 'Naval Operations',
    unitType: 'Fleet Unit',
    titlePrefix: 'Fleet Group',
    focus: ['space-control', 'escort', 'strike'],
  },
  {
    domain: 'military' as const,
    class: 'Ground Forces',
    subClass: 'Planetary Corps',
    jobType: 'Ground Operations',
    unitType: 'Troop Unit',
    titlePrefix: 'Legion Cell',
    focus: ['assault', 'defense', 'occupation'],
  },
  {
    domain: 'military' as const,
    class: 'Intelligence',
    subClass: 'Covert Division',
    jobType: 'Intelligence Operations',
    unitType: 'SpecOps Unit',
    titlePrefix: 'Cipher Team',
    focus: ['intel', 'infiltration', 'counter-ops'],
  },
  {
    domain: 'military' as const,
    class: 'Strategic Command',
    subClass: 'Doctrine Authority',
    jobType: 'Strategic Operations',
    unitType: 'Command Unit',
    titlePrefix: 'Doctrine Cell',
    focus: ['command', 'logistics', 'campaign-planning'],
  },
] as const;

const ROLE_VARIANTS = [
  { subType: 'Cadet', suffix: 'Cadet', rarity: 'common' as const, productivityFactor: 0.82 },
  { subType: 'Operator', suffix: 'Operator', rarity: 'common' as const, productivityFactor: 0.9 },
  { subType: 'Specialist', suffix: 'Specialist', rarity: 'uncommon' as const, productivityFactor: 1 },
  { subType: 'Senior Specialist', suffix: 'Senior Specialist', rarity: 'uncommon' as const, productivityFactor: 1.08 },
  { subType: 'Lead', suffix: 'Lead', rarity: 'rare' as const, productivityFactor: 1.16 },
  { subType: 'Commander', suffix: 'Commander', rarity: 'rare' as const, productivityFactor: 1.25 },
  { subType: 'Director', suffix: 'Director', rarity: 'epic' as const, productivityFactor: 1.35 },
  { subType: 'Chief', suffix: 'Chief', rarity: 'epic' as const, productivityFactor: 1.46 },
  { subType: 'Admiral', suffix: 'Admiral', rarity: 'legendary' as const, productivityFactor: 1.58 },
  { subType: 'Grand Marshal', suffix: 'Grand Marshal', rarity: 'legendary' as const, productivityFactor: 1.72 },
] as const;

function round(value: number, digits = 2): number {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function rarityForTier(tier: number): JobRarity {
  if (tier >= 9) return 'legendary';
  if (tier >= 7) return 'epic';
  if (tier >= 5) return 'rare';
  if (tier >= 3) return 'uncommon';
  return 'common';
}

export const CIVILIZATION_MILITARY_JOB_ARCHETYPES_90: CivilizationMilitaryJobArchetype[] = JOB_CLASS_FAMILIES.flatMap((family, classIndex) =>
  ROLE_VARIANTS.map((role, roleIndex) => {
    const tier = roleIndex + 1;
    const rank = classIndex * ROLE_VARIANTS.length + roleIndex + 1;
    const domainFactor = family.domain === 'military' ? 1.14 : 1;
    const baseProductivity = round((84 + classIndex * 7 + roleIndex * 5.5) * role.productivityFactor * domainFactor, 1);
    const foodDemandPerHour = round((1.1 + roleIndex * 0.08) * (family.domain === 'military' ? 1.1 : 1), 2);
    const waterDemandPerHour = round((1.15 + roleIndex * 0.07) * (family.domain === 'military' ? 1.08 : 1), 2);
    const unlockLevel = 4 + classIndex * 3 + roleIndex;

    return {
      id: `${family.domain}-${family.jobType.toLowerCase().replace(/\s+/g, '-')}-${role.subType.toLowerCase().replace(/\s+/g, '-')}-${rank}`,
      name: `${family.titlePrefix} ${role.suffix}`,
      domain: family.domain,
      unitType: family.unitType,
      jobType: family.jobType,
      subType: role.subType,
      class: family.class,
      subClass: family.subClass,
      title: `${family.class} ${role.suffix}`,
      rank,
      tier,
      rarity: role.rarity ?? rarityForTier(tier),
      baseProductivity,
      foodDemandPerHour,
      waterDemandPerHour,
      salaryUpkeepPerHour: {
        credits: Math.floor(26 + tier * 8 + classIndex * 6),
        alloys: Math.floor((tier - 1) * 1.7 + classIndex * 0.8),
        data: Math.floor(2 + tier * 1.4 + classIndex),
      },
      unlockLevel,
      strategicFocus: [...family.focus],
    };
  })
);

export const CIVILIZATION_MILITARY_JOB_META = {
  total: CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.length,
  domains: {
    civilization: CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.filter((entry) => entry.domain === 'civilization').length,
    military: CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.filter((entry) => entry.domain === 'military').length,
  },
  classes: Array.from(new Set(CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.map((entry) => entry.class))),
  subClasses: Array.from(new Set(CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.map((entry) => entry.subClass))),
  jobTypes: Array.from(new Set(CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.map((entry) => entry.jobType))),
  subTypes: Array.from(new Set(CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.map((entry) => entry.subType))),
  unitTypes: Array.from(new Set(CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.map((entry) => entry.unitType))),
};

export function getJobArchetypesByDomain(domain: JobDomain): CivilizationMilitaryJobArchetype[] {
  return CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.filter((entry) => entry.domain === domain);
}

export function getJobArchetypesByClass(jobClass: string): CivilizationMilitaryJobArchetype[] {
  const normalized = jobClass.trim().toLowerCase();
  return CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.filter((entry) => entry.class.toLowerCase() === normalized);
}

export function getJobArchetypeById(id: string): CivilizationMilitaryJobArchetype | undefined {
  return CIVILIZATION_MILITARY_JOB_ARCHETYPES_90.find((entry) => entry.id === id);
}

export function estimateFoodWaterForJobAssignments(assignments: Array<{ jobId: string; count: number }>) {
  return assignments.reduce(
    (accumulator, assignment) => {
      const entry = getJobArchetypeById(assignment.jobId);
      if (!entry || assignment.count <= 0) {
        return accumulator;
      }

      const count = Math.max(0, Math.floor(assignment.count));
      return {
        foodDemandPerHour: round(accumulator.foodDemandPerHour + entry.foodDemandPerHour * count, 2),
        waterDemandPerHour: round(accumulator.waterDemandPerHour + entry.waterDemandPerHour * count, 2),
        workforce: accumulator.workforce + count,
      };
    },
    {
      foodDemandPerHour: 0,
      waterDemandPerHour: 0,
      workforce: 0,
    }
  );
}

export function estimateProductivityForAssignments(assignments: Array<{ jobId: string; count: number }>) {
  return assignments.reduce(
    (sum, assignment) => {
      const entry = getJobArchetypeById(assignment.jobId);
      if (!entry || assignment.count <= 0) {
        return sum;
      }

      return round(sum + entry.baseProductivity * Math.max(0, Math.floor(assignment.count)), 2);
    },
    0
  );
}
