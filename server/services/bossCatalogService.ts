import { db } from "../db";
import { universeBosses, universeEvents } from "../../shared/schema";
import { ALL_BOSS_RECORDS, RAID_EVENTS } from "../../shared/config/bossTaxonomyConfig";

export async function seedBossCatalogIfNeeded(): Promise<{ bosses: number; events: number; seeded: boolean }> {
  const existingBosses = await db.select({ id: universeBosses.id }).from(universeBosses);
  const existingEvents = await db.select({ id: universeEvents.id }).from(universeEvents);
  const bossIds = new Set(existingBosses.map((entry) => entry.id));
  const eventIds = new Set(existingEvents.map((entry) => entry.id));

  const missingBosses = ALL_BOSS_RECORDS.filter((boss) => !bossIds.has(boss.id)).map((boss) => ({
    id: boss.id,
    name: boss.name,
    description: boss.description,
    bossType: boss.bossType,
    rarity: boss.rarity,
    healthPoints: boss.healthPoints,
    attackPower: boss.attackPower,
    defense: boss.defense,
    speed: boss.speed,
    abilities: boss.abilities,
    recommendedLevel: boss.recommendedLevel,
    recommendedPlayers: boss.recommendedPlayers,
    minPlayers: boss.minPlayers,
    bossReward: boss.bossReward,
  }));

  const missingEvents = RAID_EVENTS.filter((event) => !eventIds.has(event.id)).map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    eventType: event.eventType,
    eventClass: event.eventClass,
    galaxyId: "Nexus-Alpha",
    sector: event.bossClass,
    duration: event.duration,
    participantLimit: event.participantLimit,
    minimumLevel: event.minimumLevel,
    rewards: event.rewards,
    difficulty: event.difficulty,
    status: event.status,
  }));

  if (missingBosses.length > 0) {
    await db.insert(universeBosses).values(missingBosses).onConflictDoNothing();
  }
  if (missingEvents.length > 0) {
    await db.insert(universeEvents).values(missingEvents).onConflictDoNothing();
  }

  return {
    bosses: ALL_BOSS_RECORDS.length,
    events: RAID_EVENTS.length,
    seeded: missingBosses.length > 0 || missingEvents.length > 0,
  };
}
