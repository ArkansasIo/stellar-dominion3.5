import { config } from "dotenv";
import { db, pool } from "../server/db";
import { galaxies, sectors, type InsertGalaxy, type InsertSector } from "../shared/schema";
import { UNIVERSE_CONFIG } from "../shared/config/universeConfig";
import { classifyGalaxy, getGalaxyName } from "../shared/config/galaxyClassification";

config();

const DEFAULT_SEED = UNIVERSE_CONFIG.seed.default;
const GALAXY_COUNT = UNIVERSE_CONFIG.size.galaxyCount;
const SECTORS_PER_GALAXY = UNIVERSE_CONFIG.size.sectorsPerGalaxy;

const MORPHOLOGY_IDS = [
  'spiral-normal', 'spiral-barred', 'spiral-grand-design',
  'elliptical-e0', 'elliptical-e3', 'elliptical-e5', 'elliptical-e7',
  'lenticular', 'irregular', 'ring', 'companion', 'dwarf', 'giant',
  'interacting', 'peculiar', 'cd', 'magellanic',
] as const;

const SIZE_VARIANTS = ['miniature', 'small', 'medium', 'large', 'colossal', 'supergiant'] as const;

function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function fnv1a(str: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return hash || 1;
}

async function seedUniverse() {
  try {
    console.log("🌌 Seeding universe data...\n");

    // Clear existing data
    await db.delete(sectors);
    await db.delete(galaxies);
    console.log("  Cleared existing galaxy/sector data");

    const galaxyRows: InsertGalaxy[] = [];
    const sectorRows: InsertSector[] = [];

    for (let g = 1; g <= GALAXY_COUNT; g++) {
      const seedKey = `${DEFAULT_SEED}:galaxy-${g}`;
      const galaxyHash = fnv1a(seedKey);
      const rng = mulberry32(galaxyHash);

      const morphologyIdx = Math.floor(rng() * MORPHOLOGY_IDS.length);
      const morphology = MORPHOLOGY_IDS[morphologyIdx];

      const sizeIdx = Math.floor(rng() * SIZE_VARIANTS.length);
      const size = SIZE_VARIANTS[sizeIdx];

      const habitability = Math.floor(rng() * 100);
      const classification = classifyGalaxy(morphology as any, size as any, habitability);
      const name = getGalaxyName(morphology as any, galaxyHash);

      galaxyRows.push({
        galaxyId: g,
        name,
        morphology,
        sizeClass: size,
        habitability,
        starCount: 0,
        sectorCount: SECTORS_PER_GALAXY,
        seed: seedKey,
      });

      // Generate sectors for this galaxy
      for (let s = 1; s <= SECTORS_PER_GALAXY; s++) {
        const sectorSeed = `${DEFAULT_SEED}:galaxy-${g}:sector-${s}`;
        sectorRows.push({
          galaxyId: g,
          sectorNumber: s,
          systemCount: UNIVERSE_CONFIG.size.systemsPerSector,
          seed: sectorSeed,
        });
      }

      if (g % 32 === 0 || g === GALAXY_COUNT) {
        console.log(`  Generated ${g}/${GALAXY_COUNT} galaxies with sectors...`);
      }
    }

    console.log(`\n  Inserting ${galaxyRows.length} galaxies...`);
    for (let i = 0; i < galaxyRows.length; i += 50) {
      await db.insert(galaxies).values(galaxyRows.slice(i, i + 50));
    }

    console.log(`  Inserting ${sectorRows.length} sectors...`);
    for (let i = 0; i < sectorRows.length; i += 500) {
      await db.insert(sectors).values(sectorRows.slice(i, i + 500));
    }

    console.log("\n✅ Universe seeded successfully!");
    console.log(`   Galaxies: ${GALAXY_COUNT}`);
    console.log(`   Sectors: ${GALAXY_COUNT * SECTORS_PER_GALAXY}`);
    console.log(`   Systems per sector: ${UNIVERSE_CONFIG.size.systemsPerSector}`);
    console.log(`   Universe seed: ${DEFAULT_SEED}`);
    console.log("\n📝 Systems and planets will be generated on-demand and cached in the database.");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding universe:", error);
    process.exit(1);
  }
}

seedUniverse();
