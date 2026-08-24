import { strict as assert } from "node:assert";
import { generateMoonProfile, generateMoonsForWorld, getWorldCatalog, getWorldSizeProfile, resolveWorldArchetype, stableMoonId, stableWorldId, WORLD_CLASS_CODES, WORLD_CLASS_COUNT, WORLD_SIZE_PROFILES, type WorldSize } from "../shared/config/worldMoonTaxonomy";

const catalog = getWorldCatalog();
assert.equal(WORLD_CLASS_COUNT, 42, "catalog must contain exactly 42 classes");
assert.equal(catalog.totalClasses, 42);
assert.equal(WORLD_SIZE_PROFILES.length, 9);
assert.deepEqual(WORLD_CLASS_CODES.slice(0, 26), Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)));
assert.equal(new Set(WORLD_CLASS_CODES).size, 42, "class codes must be unique");
assert.equal(new Set(catalog.classes.map((entry) => entry.id)).size, 42, "catalog IDs must be unique");
for (const size of WORLD_SIZE_PROFILES) {
  assert.equal(getWorldSizeProfile(size.size).size, size.size);
  assert.ok(size.maximumMoons >= 0 && size.maximumMoons <= 12);
  assert.ok(size.buildSlots >= 2);
}
for (const entry of catalog.classes) {
  assert.match(entry.id, /^WCA-[A-Z]{1,2}-4$/);
  assert.ok(entry.biome.length > 0 && entry.subBiome.length > 0);
  assert.ok(entry.specialSystems.length > 0);
  assert.ok(entry.environment.habitability >= 0 && entry.environment.habitability <= 100);
  assert.ok(entry.supportedSizes.length === 9);
  for (const size of [1, 4, 9]) {
    const world = resolveWorldArchetype(entry.classCode, size);
    const id = stableWorldId(entry.classCode, size, 7);
    assert.equal(world.classCode, entry.classCode);
    assert.equal(id, `WRL-${entry.classCode}-${size}-007`);
    const moons = generateMoonsForWorld(id, entry.classCode, size as WorldSize);
    assert.ok(moons.length <= getWorldSizeProfile(size).maximumMoons);
    for (const moon of moons) {
      assert.equal(moon.parentWorldId, id);
      assert.equal(moon.id, stableMoonId(id, moon.orbitSlot));
      assert.ok(moon.condition >= 0 && moon.condition <= 100);
      assert.ok(moon.developmentLevel >= 1 && moon.developmentLevel <= 20);
      assert.ok(moon.specialSystems.length > 0);
    }
  }
}
const sample = resolveWorldArchetype("AP", 9);
const sampleMoon = generateMoonProfile("WRL-AP-9-001", sample, 9, 1);
assert.equal(sample.className, "Paragon");
assert.equal(sampleMoon.archetypeId, "M09");
console.log(JSON.stringify({ passed: true, totalClasses: catalog.totalClasses, totalSizes: catalog.sizes.length, moonArchetypes: catalog.moons.length, sample: { world: sample.id, moon: sampleMoon.id } }, null, 2));
