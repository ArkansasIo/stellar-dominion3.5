export type RaidRole = "tank" | "dps" | "healer" | "support";

export interface RaidCareer {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  rating: number;
  rank: string;
  specialization: RaidRole;
  participations: number;
  victories: number;
  bossKills: number;
  totalDamage: number;
  unitsLost: number;
  unitsSaved: number;
  commendations: number;
  streak: number;
  bestStreak: number;
  lastRaidAt: string | null;
  unlockedPerks: string[];
}

export interface RaidResolutionInput {
  raidId: string;
  raidType: string;
  role: RaidRole;
  victory: boolean;
  participantCount: number;
  roleDiversity: number;
  attackerLosses: number;
  defenderLosses: number;
  baseRewards: { credits: number; metal: number; crystal: number };
  bossRarity?: string;
}

const RAID_RANKS = [
  { rating: 0, name: "Cadet Raider" },
  { rating: 1100, name: "Strike Leader" },
  { rating: 1250, name: "Assault Captain" },
  { rating: 1450, name: "Raid Marshal" },
  { rating: 1700, name: "Titan Breaker" },
  { rating: 2000, name: "Dominion Warmaster" },
];

const ROLE_PERKS: Record<RaidRole, string[]> = {
  tank: ["Bulwark Formation", "Threat Lock", "Last Stand"],
  dps: ["Focused Barrage", "Execution Window", "Overkill Salvage"],
  healer: ["Combat Recovery", "Emergency Triage", "Casualty Reversal"],
  support: ["Target Painting", "Fleet Uplink", "Tactical Resupply"],
};

function finite(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rankForRating(rating: number) {
  return [...RAID_RANKS].reverse().find((rank) => rating >= rank.rating)?.name || RAID_RANKS[0].name;
}

function levelFromExperience(experience: number) {
  return Math.max(1, Math.min(100, Math.floor(Math.sqrt(Math.max(0, experience) / 180)) + 1));
}

export function normalizeRaidCareer(raw: any): RaidCareer {
  const experience = Math.max(0, finite(raw?.experience));
  const level = levelFromExperience(experience);
  const nextLevelXp = Math.pow(level, 2) * 180;
  const specialization = (["tank", "dps", "healer", "support"].includes(raw?.specialization)
    ? raw.specialization
    : "dps") as RaidRole;
  const rating = Math.max(800, finite(raw?.rating, 1000));
  const unlockedPerks = ROLE_PERKS[specialization].slice(0, Math.min(3, Math.floor(level / 8)));

  return {
    level,
    experience,
    experienceToNextLevel: Math.max(0, nextLevelXp - experience),
    rating,
    rank: rankForRating(rating),
    specialization,
    participations: Math.max(0, finite(raw?.participations)),
    victories: Math.max(0, finite(raw?.victories)),
    bossKills: Math.max(0, finite(raw?.bossKills)),
    totalDamage: Math.max(0, finite(raw?.totalDamage)),
    unitsLost: Math.max(0, finite(raw?.unitsLost)),
    unitsSaved: Math.max(0, finite(raw?.unitsSaved)),
    commendations: Math.max(0, finite(raw?.commendations)),
    streak: Math.max(0, finite(raw?.streak)),
    bestStreak: Math.max(0, finite(raw?.bestStreak)),
    lastRaidAt: typeof raw?.lastRaidAt === "string" ? raw.lastRaidAt : null,
    unlockedPerks,
  };
}

export function setRaidSpecialization(raw: any, specialization: RaidRole): RaidCareer {
  return normalizeRaidCareer({ ...raw, specialization });
}

export function calculateCommanderRaidPower(commander: any, careerRaw: any, role: RaidRole) {
  const career = normalizeRaidCareer(careerRaw);
  const stats = commander?.stats || {};
  const skills = commander?.skills || {};
  const base =
    finite(stats.level, 1) * 120 +
    finite(stats.attack) * 3 +
    finite(stats.defense) * 2.6 +
    finite(stats.leadership) * 4 +
    finite(skills.warfare) * 95 +
    finite(skills.logistics) * 55 +
    finite(skills.engineering) * 45;
  const specializationBonus = career.specialization === role ? 1.16 : 1;
  return Math.max(500, Math.round((base + career.level * 85 + career.rating * 0.35) * specializationBonus));
}

export function resolveCommanderRaidCareer(raw: any, input: RaidResolutionInput) {
  const career = normalizeRaidCareer(raw);
  const roleBonus = career.specialization === input.role ? 1.15 : 1;
  const diversityBonus = 1 + Math.min(0.18, input.roleDiversity * 0.045);
  const bossMultiplier = input.raidType === "boss_raid" ? 1.35 : 1;
  const victoryMultiplier = input.victory ? 1 : 0.45;
  const experienceGain = Math.round((180 + input.defenderLosses * 2.2 + input.participantCount * 35) * roleBonus * bossMultiplier * victoryMultiplier);
  const ratingDelta = input.victory ? 18 + input.roleDiversity * 3 : -12;
  const nextStreak = input.victory ? career.streak + 1 : 0;
  const lossMitigation = input.role === "healer" ? 0.25 : input.role === "tank" ? 0.12 : input.role === "support" ? 0.08 : 0;
  const unitsSaved = Math.round(input.attackerLosses * lossMitigation);
  const rewardMultiplier = roleBonus * diversityBonus * (1 + Math.min(0.2, career.streak * 0.025));
  const rewards = {
    credits: Math.round(input.baseRewards.credits * victoryMultiplier * rewardMultiplier),
    metal: Math.round(input.baseRewards.metal * victoryMultiplier * rewardMultiplier),
    crystal: Math.round(input.baseRewards.crystal * victoryMultiplier * rewardMultiplier),
    experience: experienceGain,
    commendations: input.victory ? 1 + (input.raidType === "boss_raid" ? 2 : 0) : 0,
  };

  const next = normalizeRaidCareer({
    ...career,
    experience: career.experience + experienceGain,
    rating: career.rating + ratingDelta,
    participations: career.participations + 1,
    victories: career.victories + (input.victory ? 1 : 0),
    bossKills: career.bossKills + (input.victory && input.raidType === "boss_raid" ? 1 : 0),
    totalDamage: career.totalDamage + input.defenderLosses,
    unitsLost: career.unitsLost + Math.max(0, input.attackerLosses - unitsSaved),
    unitsSaved: career.unitsSaved + unitsSaved,
    commendations: career.commendations + rewards.commendations,
    streak: nextStreak,
    bestStreak: Math.max(career.bestStreak, nextStreak),
    lastRaidAt: new Date().toISOString(),
  });

  return { career: next, rewards, unitsSaved, ratingDelta };
}

export function buildRaidReadiness(commander: any, careerRaw: any) {
  const career = normalizeRaidCareer(careerRaw);
  const roles: RaidRole[] = ["tank", "dps", "healer", "support"];
  const rolePower = Object.fromEntries(
    roles.map((role) => [role, calculateCommanderRaidPower(commander, career, role)]),
  ) as Record<RaidRole, number>;
  const recommendedRole = roles.reduce((best, role) => rolePower[role] > rolePower[best] ? role : best);
  return {
    career,
    rolePower,
    recommendedRole,
    winRate: career.participations ? Math.round((career.victories / career.participations) * 100) : 0,
    casualtyEfficiency: career.unitsLost + career.unitsSaved
      ? Math.round((career.unitsSaved / (career.unitsLost + career.unitsSaved)) * 100)
      : 0,
  };
}
