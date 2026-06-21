import {
  buildRaidReadiness,
  calculateCommanderRaidPower,
  normalizeRaidCareer,
  resolveCommanderRaidCareer,
  setRaidSpecialization,
} from "../server/services/raidOperationsService";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const commander = {
  stats: { level: 20, attack: 80, defense: 65, leadership: 55 },
  skills: { warfare: 6, logistics: 4, engineering: 3 },
};

let career = normalizeRaidCareer(null);
career = setRaidSpecialization(career, "healer");
const healerPower = calculateCommanderRaidPower(commander, career, "healer");
const dpsPower = calculateCommanderRaidPower(commander, career, "dps");
assert(healerPower > dpsPower, "Specialization bonus was not applied.");

const result = resolveCommanderRaidCareer(career, {
  raidId: "smoke-raid",
  raidType: "boss_raid",
  role: "healer",
  victory: true,
  participantCount: 6,
  roleDiversity: 4,
  attackerLosses: 120,
  defenderLosses: 640,
  baseRewards: { credits: 1000, metal: 5000, crystal: 2200 },
});

assert(result.career.victories === 1, "Victory was not recorded.");
assert(result.career.bossKills === 1, "Boss kill was not recorded.");
assert(result.career.unitsSaved > 0, "Healer casualty mitigation was not applied.");
assert(result.rewards.experience > 0, "Raid experience was not awarded.");

const readiness = buildRaidReadiness(commander, result.career);
assert(readiness.rolePower.healer > readiness.rolePower.dps, "Readiness did not preserve specialization.");
assert(readiness.winRate === 100, "Win rate is incorrect.");

console.log(`Raid operations smoke test passed at rating ${result.career.rating}.`);
