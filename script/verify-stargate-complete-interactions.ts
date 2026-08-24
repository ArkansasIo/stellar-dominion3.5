import assert from "node:assert/strict";
import { eq, inArray } from "drizzle-orm";
import { db, pool } from "../server/db";
import { playerStates, users } from "../shared/schema";
import { applyToAlliance, approveAllianceApplication, createAlliance, getAllianceState } from "../server/services/stargate/allianceService";
import { executeAscension, previewAscension } from "../server/services/stargate/ascensionService";
import { recruitOfficer, updateCommanderProfile } from "../server/services/stargate/commanderService";
import { getEventState } from "../server/services/stargate/eventService";
import { createMarketOffer, exchangeMarketUnits, getMarketState, purchaseMarketOffer, recruitMercenaries } from "../server/services/stargate/marketService";
import { buyMothership, claimExploration, startExploration } from "../server/services/stargate/mothershipService";
import { fortifyWorld, getWorldState, upgradeWorldBonus } from "../server/services/stargate/planetService";
import { getProtectionState, setVacationMode } from "../server/services/stargate/protectionService";
import { getRankings } from "../server/services/stargate/rankingService";
import { executeRaid } from "../server/services/stargateWarsService";

const ALPHA = "test-complete-alpha";
const BETA = "test-complete-beta";

async function seed() {
  await db.delete(playerStates).where(inArray(playerStates.userId, [ALPHA, BETA]));
  await db.delete(users).where(inArray(users.id, [ALPHA, BETA]));
  await db.insert(users).values([{ id: ALPHA, username: "Complete Alpha", email: "complete-alpha@local.invalid" }, { id: BETA, username: "Complete Beta", email: "complete-beta@local.invalid" }]);
  const strategic = { race: "tauri", attackTurns: 100, marketTurns: 3, unitProduction: 10, spyLevel: 1, antiSpyLevel: 1, technologies: { offense: 0, defense: 0, covert: 0, antiCovert: 0, unique: 0, mercenary: 0 }, glory: 100, reputation: 30, ascensionPoints: 0, ascensionLevel: 0, armory: { inventory: {} }, lastTurnAt: Date.now(), logs: [] };
  await db.insert(playerStates).values([
    { userId: ALPHA, setupComplete: true, planetName: "Alpha Prime", resources: { naquadah: 400_000, bankedNaquadah: 0 }, units: { untrained: 1_000, lifers: 12, attackTroops: 30, defenseTroops: 20, attackWeapons: 30, defenseWeapons: 20, covertAgents: 5, antiIntelAgents: 4 }, commander: {}, government: { stargateWars: strategic } },
    { userId: BETA, setupComplete: true, planetName: "Beta Prime", resources: { naquadah: 250_000, bankedNaquadah: 0 }, units: { untrained: 600, lifers: 4, attackTroops: 10, defenseTroops: 10 }, commander: {}, government: { stargateWars: { ...strategic, race: "asgard", glory: 0, reputation: 0 } } },
  ]);
}

async function main() {
  await seed();
  const beforeMarket = await getMarketState(ALPHA);
  const exchanged = await exchangeMarketUnits(ALPHA, "untrained", 10);
  assert.equal(exchanged.units.untrained, beforeMarket.units.untrained + 10, "exchange should add untrained personnel");
  const offered = await createMarketOffer(ALPHA, "untrained", 5, 200);
  const alphaOffer = offered.market.offers.find((entry) => entry.sellerId === ALPHA);
  assert.ok(alphaOffer, "market offer should be visible");
  const purchased = await purchaseMarketOffer(BETA, alphaOffer!.id, 3);
  assert.ok((purchased.units.untrained || 0) >= 603, "purchase should deliver listed units to buyer");
  const mercenaries = await recruitMercenaries(ALPHA, "attackTroop", 5);
  assert.ok((mercenaries.units.attackTroops || 0) >= 35, "mercenary recruitment should add attack troops");

  const mothership = await buyMothership(ALPHA, "Aegis Command");
  assert.equal(mothership.mothership.owned, true, "mothership should be commissioned");
  const exploring = await startExploration(ALPHA);
  assert.ok(exploring.mothership.explorationReadyAt, "exploration should schedule completion");
  const claimed = await claimExploration(ALPHA, Number(exploring.mothership.explorationReadyAt) + 1);
  const discoveredWorld = claimed.discoveredWorld;
  assert.ok(discoveredWorld, "exploration should claim a strategic world after readiness");
  const worldId = discoveredWorld.id;
  await upgradeWorldBonus(ALPHA, worldId, "income");
  const fortified = await fortifyWorld(ALPHA, worldId, 4);
  assert.ok(fortified.worlds.find((world) => world.id === worldId)?.defenses === 4, "fortification should persist world defenses");

  const commander = await updateCommanderProfile(ALPHA, "Alpha Marshal", 0.2);
  assert.equal(commander.commander.name, "Alpha Marshal", "commander profile should persist");
  const officer = await recruitOfficer(ALPHA, "offense");
  assert.equal(officer.commander.officers.length, 1, "officer recruitment should persist");
  await createAlliance(ALPHA, "Complete Systems", "CSYS");
  await applyToAlliance(BETA, ALPHA);
  const leaderAlliance = await getAllianceState(ALPHA);
  assert.equal(leaderAlliance.alliance.applications.length, 1, "alliance application should reach leader");
  await approveAllianceApplication(ALPHA, BETA);
  const memberAlliance = await getAllianceState(BETA);
  assert.equal(memberAlliance.alliance.tag, "CSYS", "application approval should join the alliance");

  await setVacationMode(BETA, true);
  const protection = await getProtectionState(BETA);
  assert.equal(protection.protection.vacationMode, true, "vacation protection should persist");
  await assert.rejects(() => executeRaid(ALPHA, BETA, 1), /vacation mode/, "vacation protection must block hostile raids");
  const rankings = await getRankings(ALPHA, "overall");
  assert.ok(rankings.standings.length >= 2, "rankings should include both controlled realms");
  const preview = await previewAscension(ALPHA);
  assert.ok(preview.preview.preserved.includes("lifers"), "ascension preview should expose preserved progress");
  const ascended = await executeAscension(ALPHA);
  assert.equal(ascended.history[0]?.level, 1, "Ascension should record permanent progression history");
  const events = await getEventState(ALPHA);
  assert.ok(events.count >= 8, "interactive actions should generate event history");

  console.log(JSON.stringify({
    market: { untrainedAfterExchange: exchanged.units.untrained, mercenaries: mercenaries.units.attackTroops, offerPurchased: alphaOffer?.id },
    worlds: { mothership: mothership.mothership.name, discoveredWorld: discoveredWorld.name, defenses: fortified.worlds.find((world) => world.id === worldId)?.defenses },
    social: { commander: commander.commander.name, alliance: memberAlliance.alliance.tag, officers: officer.commander.officers.length },
    progression: { rankingEntries: rankings.standings.length, ascensionLevel: ascended.history[0]?.level },
    operations: { vacationMode: protection.protection.vacationMode, events: events.count },
  }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await pool.end(); });
