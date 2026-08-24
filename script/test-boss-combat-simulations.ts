import assert from "node:assert/strict";
import {
  ARC_BOSS_RECORDS,
  BOSS_TAXONOMY,
  BOSS_VARIANTS,
  type BossClassDefinition,
} from "../shared/config/bossTaxonomyConfig";
import {
  VOID_EMPEROR_DROP_DISTRIBUTION,
  VOID_EMPEROR_LEGENDARY_RECIPES,
} from "../shared/config/voidEmperorRewards";

type SimulationResult = {
  classId: string;
  subclassId: string;
  typeId: string;
  rounds: number;
  damageDealt: number;
  damageTaken: number;
  triggeredAbilities: string[];
  outcome: "victory" | "repelled";
};

function classModifier(bossClass: BossClassDefinition, phase: number): number {
  const modifiers: Record<string, number> = {
    abyssal: 1.08,
    iron: 1.14,
    swarm: phase % 2 === 0 ? 1.22 : 0.94,
    psionic: phase % 3 === 0 ? 1.3 : 0.9,
    necrotic: phase >= 5 ? 1.18 : 1,
    celestial: phase === 4 ? 1.28 : 0.98,
    temporal: phase === 6 ? 1.42 : 0.92,
    bioforge: phase % 2 === 1 ? 1.2 : 0.95,
    void: phase >= 7 ? 1.45 : 1.1,
  };
  return modifiers[bossClass.id] ?? 1;
}

function simulateEncounter(boss: typeof BOSS_VARIANTS[number], bossClass: BossClassDefinition): SimulationResult {
  let bossHealth = boss.healthPoints;
  let commanderHull = 1_000_000;
  let damageDealt = 0;
  let damageTaken = 0;
  const triggeredAbilities: string[] = [];
  const rounds = 8;

  for (let phase = 1; phase <= rounds; phase += 1) {
    const ability = boss.abilities[(phase - 1) % Math.max(1, boss.abilities.length)];
    if (ability) triggeredAbilities.push(ability);

    const mitigation = bossClass.id === "iron" ? 0.78 : bossClass.id === "void" && phase >= 7 ? 1.08 : 0.92;
    const playerDamage = Math.round((18_500 + phase * 1_250) / Math.max(0.72, mitigation));
    const incoming = Math.round(boss.attackPower * classModifier(bossClass, phase) * (phase >= 7 ? 1.1 : 0.85));
    damageDealt += playerDamage;
    damageTaken += incoming;
    bossHealth = Math.max(0, bossHealth - playerDamage);
    commanderHull = Math.max(0, commanderHull - incoming);

    if (bossClass.id === "swarm" && phase === 4) bossHealth += Math.round(boss.healthPoints * 0.04);
    if (bossClass.id === "necrotic" && phase === 5) commanderHull = Math.min(1_000_000, commanderHull + 35_000);
    if (bossClass.id === "temporal" && phase === 6) bossHealth = Math.min(boss.healthPoints, bossHealth + Math.round(boss.healthPoints * 0.06));
    if (bossClass.id === "void" && phase === 8) damageTaken += 25_000;
  }

  return {
    classId: bossClass.id,
    subclassId: boss.bossSubclass,
    typeId: boss.bossType,
    rounds,
    damageDealt,
    damageTaken,
    triggeredAbilities: [...new Set(triggeredAbilities)],
    outcome: bossHealth === 0 && commanderHull > 0 ? "victory" : "repelled",
  };
}

function validateCatalog() {
  assert.equal(BOSS_TAXONOMY.length, 9, "Expected exactly nine boss classes");
  assert.equal(BOSS_TAXONOMY.reduce((sum, bossClass) => sum + bossClass.subclasses.length, 0), 27, "Expected 27 subclasses");
  assert.equal(BOSS_VARIANTS.length, 54, "Expected 54 typed boss variants");
  assert.equal(ARC_BOSS_RECORDS.length, 9, "Expected one arc boss per class");
  assert.equal(VOID_EMPEROR_LEGENDARY_RECIPES.length, 5, "Expected five Void Emperor legendary recipes");

  for (const pool of VOID_EMPEROR_DROP_DISTRIBUTION.pools) {
    assert.ok(pool.entries.length > 0, `${pool.id} pool must contain entries`);
    const weightTotal = pool.entries.reduce((sum, entry) => sum + entry.weight, 0);
    if (pool.id === "guaranteed") {
      assert.ok(pool.entries.every((entry) => entry.weight === 100), "Guaranteed entries must always drop");
    } else {
      assert.equal(weightTotal, 100, `${pool.id} weights must normalize to 100`);
    }
  }
}

function runAllSimulations() {
  validateCatalog();
  const results: SimulationResult[] = [];

  for (const bossClass of BOSS_TAXONOMY) {
    for (const bossSubclass of bossClass.subclasses) {
      const subclassVariants = BOSS_VARIANTS.filter((boss) => boss.bossClass === bossClass.id && boss.bossSubclass === bossSubclass.id);
      assert.equal(subclassVariants.length, 2, `${bossClass.id}/${bossSubclass.id} must have two type simulations`);
      for (const boss of subclassVariants) {
        const result = simulateEncounter(boss, bossClass);
        assert.equal(result.rounds, 8);
        assert.ok(result.damageDealt > 0);
        assert.ok(result.damageTaken > 0);
        assert.ok(result.triggeredAbilities.length > 0);
        results.push(result);
      }
    }
  }

  assert.equal(results.length, 54, "Every typed boss variant must be simulated");
  const classCoverage = new Set(results.map((result) => result.classId));
  const subclassCoverage = new Set(results.map((result) => `${result.classId}/${result.subclassId}`));
  assert.equal(classCoverage.size, 9, "All nine boss classes must be covered");
  assert.equal(subclassCoverage.size, 27, "All 27 boss subclasses must be covered");

  const victoryCount = results.filter((result) => result.outcome === "victory").length;
  const repelledCount = results.length - victoryCount;
  console.log(`Boss combat simulations passed: ${results.length} typed encounters`);
  console.log(`Class coverage: ${classCoverage.size}/9 | Subclass coverage: ${subclassCoverage.size}/27`);
  console.log(`Outcomes: ${victoryCount} victories, ${repelledCount} repelled assaults`);
  console.log(`Mechanic traces: ${results.reduce((sum, result) => sum + result.triggeredAbilities.length, 0)} ability triggers`);
}

runAllSimulations();
