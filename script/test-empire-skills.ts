import assert from "node:assert/strict";
import {
  EMPIRE_SKILLS,
  SKILL_CATEGORY_NAMES,
  createDefaultEmpireSkillState,
  calculateSkillTrainingSeconds,
  getSkillEffects,
} from "../shared/config/empireSkills";

assert.equal(EMPIRE_SKILLS.length, 32, "the empire skill catalog must contain exactly 32 skills");
assert.equal(Object.keys(SKILL_CATEGORY_NAMES).length, 8, "the catalog must expose eight skill disciplines");

const categoryCounts = Object.fromEntries(Object.keys(SKILL_CATEGORY_NAMES).map((category) => [category, 0]));
for (const definition of EMPIRE_SKILLS) {
  assert.ok(definition.id && definition.name && definition.description, `skill ${definition.id} needs complete metadata`);
  assert.equal(definition.maxLevel, 5);
  assert.ok(definition.baseTrainingSeconds >= 60);
  assert.ok(categoryCounts[definition.category] !== undefined, `unknown category ${definition.category}`);
  categoryCounts[definition.category] += 1;
  for (const prerequisiteId of Object.keys(definition.prerequisites)) {
    assert.ok(EMPIRE_SKILLS.some((candidate) => candidate.id === prerequisiteId), `${definition.id} references a missing prerequisite`);
  }
}
assert.deepEqual(Object.values(categoryCounts), [4, 4, 4, 4, 4, 4, 4, 4]);

const state = createDefaultEmpireSkillState();
const baselineTime = calculateSkillTrainingSeconds(EMPIRE_SKILLS[0], 1, state.attributes);
const advancedAttributes = { ...state.attributes, perception: 12, willpower: 10 };
const acceleratedTime = calculateSkillTrainingSeconds(EMPIRE_SKILLS[0], 1, advancedAttributes);
assert.ok(acceleratedTime < baselineTime, "higher attributes must reduce training time");

state.skills["combat-gunnery"] = 3;
state.skills["combat-ballistics"] = 2;
const effects = getSkillEffects(state);
assert.ok(effects.combatAttack > 0, "combat skills must contribute combat attack effects");
assert.ok(effects.missileDamage > 0, "ballistics must contribute missile damage effects");

console.log(JSON.stringify({
  skills: EMPIRE_SKILLS.length,
  categories: categoryCounts,
  baselineTrainingSeconds: baselineTime,
  acceleratedTrainingSeconds: acceleratedTime,
  sampleEffects: effects,
}, null, 2));
