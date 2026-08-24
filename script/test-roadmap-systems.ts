import assert from "node:assert/strict";
import {
  ACHIEVEMENT_MILESTONES,
  COMPETITION_TYPES,
  GLOBAL_EVENTS,
  NARRATIVE_ARCS,
  RELEASE_GATES,
  ROADMAP_MILESTONES,
  SEASON_REWARDS,
  SUPPORTED_LOCALES,
  TUTORIAL_MISSIONS,
} from "../shared/config/liveOpsRoadmap";

assert.equal(NARRATIVE_ARCS.length, 4, "four narrative arcs must be defined");
assert.ok(NARRATIVE_ARCS.some((arc) => arc.status === "active"));
assert.equal(TUTORIAL_MISSIONS.length, 7, "the new-player tutorial must have seven missions");
assert.equal(COMPETITION_TYPES.length, 4, "four player competition formats must be available");
assert.equal(GLOBAL_EVENTS.length, 3, "three global event definitions must be seeded");
assert.equal(SEASON_REWARDS.length, 30, "Season 1 must have a full 30-tier track");
assert.equal(ACHIEVEMENT_MILESTONES.length, 6, "achievement milestone definitions must be present");
assert.equal(RELEASE_GATES.length, 4, "launch gates must cover beta, release, and post-launch operations");
assert.ok(SUPPORTED_LOCALES.some((locale) => locale.code === "en" && locale.status === "active"));
assert.ok(ROADMAP_MILESTONES.some((milestone) => milestone.startsWith("M6.1")));
assert.ok(ROADMAP_MILESTONES.some((milestone) => milestone.startsWith("M7.2")));
assert.ok(ROADMAP_MILESTONES.some((milestone) => milestone.startsWith("M8.3")));
assert.ok(COMPETITION_TYPES.every((type) => type.maxParticipants > 0 && type.entryCost >= 0));
assert.ok(SEASON_REWARDS.every((reward, index) => reward.tier === index + 1 && reward.xpRequired > 0));
console.log(`Roadmap systems verified: ${NARRATIVE_ARCS.length} arcs, ${TUTORIAL_MISSIONS.length} tutorials, ${COMPETITION_TYPES.length} competition formats, ${GLOBAL_EVENTS.length} events, ${SEASON_REWARDS.length} season tiers.`);
