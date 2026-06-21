import { BOUNTY_CONFIG, Bounty as BountyType } from "../../shared/config/xenoberage/bountyConfig";
import { db } from "../db";
import { bounties, playerStates } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

/**
 * Place a bounty on a target player.
 * Amount is limited by maxValue percentage of placer's networth.
 */
export async function placeBounty(
  placerId: string,
  targetId: string,
  amount: number,
  placerNetworth: number
): Promise<{ success: boolean; message: string; bounty?: BountyType }> {
  const maxAmount = placerNetworth * BOUNTY_CONFIG.maxValue;
  const cappedAmount = Math.min(amount, maxAmount);

  if (cappedAmount <= 0) {
    return { success: false, message: "Invalid bounty amount" };
  }

  const placerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, placerId),
  });

  if (!placerState) {
    return { success: false, message: "Placer not found" };
  }

  const resources = (placerState.resources as any) || {};
  const credits = resources.credits || 0;

  if (credits < cappedAmount) {
    return { success: false, message: "Insufficient credits to place bounty" };
  }

  await db.update(playerStates).set({
    resources: { ...resources, credits: credits - cappedAmount },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, placerId));

  const bounty: BountyType = {
    id: crypto.randomUUID(),
    placerId,
    targetId,
    amount: cappedAmount,
    active: true,
    createdAt: new Date(),
  };

  await db.insert(bounties).values({
    id: bounty.id,
    placerId,
    targetId,
    amount: cappedAmount,
    active: true,
  });

  return { success: true, message: `Bounty of ${cappedAmount} placed`, bounty };
}

/**
 * Calculate bounty on attacker if networth ratio is exceeded.
 * If attacker is significantly weaker than defender, bounty is placed.
 */
export function calculateBountyAttacker(
  attackerNetworth: number,
  defenderNetworth: number,
  ratio: number = BOUNTY_CONFIG.ratio
): { shouldBounty: boolean; bountyAmount: number } {
  if (ratio <= 0) return { shouldBounty: false, bountyAmount: 0 };

  const ratioCheck = attackerNetworth / defenderNetworth;
  if (ratioCheck < ratio) {
    const bountyAmount = Math.floor(defenderNetworth * BOUNTY_CONFIG.maxValue);
    return { shouldBounty: true, bountyAmount };
  }

  return { shouldBounty: false, bountyAmount: 0 };
}

/**
 * Check if a target is eligible for bounty placement.
 * Target must have minimum turns played.
 */
export function checkBountyEligibility(
  target: { turnsPlayed: number },
  minTurns: number = BOUNTY_CONFIG.minTurns
): boolean {
  if (minTurns <= 0) return true;
  return target.turnsPlayed >= minTurns;
}

/**
 * Claim a bounty reward after defeating the target.
 * Transfers bounty amount from placer to attacker.
 */
export async function claimBounty(
  attackerId: string,
  targetId: string
): Promise<{ success: boolean; reward: number; message: string }> {
  const activeBounty = await db.query.bounties.findFirst({
    where: and(
      eq(bounties.targetId, targetId),
      eq(bounties.active, true)
    ),
  });

  if (!activeBounty) {
    return { success: false, reward: 0, message: "No active bounty found for target" };
  }

  if (activeBounty.placerId === attackerId) {
    return { success: false, reward: 0, message: "Cannot claim your own bounty" };
  }

  const attackerState = await db.query.playerStates.findFirst({
    where: eq(playerStates.userId, attackerId),
  });

  if (!attackerState) {
    return { success: false, reward: 0, message: "Attacker not found" };
  }

  const resources = (attackerState.resources as any) || {};
  const reward = activeBounty.amount;

  await db.update(playerStates).set({
    resources: { ...resources, credits: (resources.credits || 0) + reward },
    updatedAt: new Date(),
  }).where(eq(playerStates.userId, attackerId));

  await db.update(bounties).set({
    active: false,
    claimedBy: attackerId,
    claimedAt: new Date(),
  }).where(eq(bounties.id, activeBounty.id));

  return {
    success: true,
    reward,
    message: `Bounty claimed! ${reward} credits transferred.`,
  };
}

/**
 * Apply bounty penalties when player has active bounty.
 * Restricts access to special ports.
 */
export function applyBountyPenalties(
  userId: string,
  hasActiveBounty: boolean,
  restrictAllSpecial: boolean = true
): { canAccessSpecialPorts: boolean; restrictions: string[] } {
  if (!hasActiveBounty) {
    return { canAccessSpecialPorts: true, restrictions: [] };
  }

  const restrictions: string[] = [];
  if (restrictAllSpecial) {
    restrictions.push("special_ports");
  }

  return {
    canAccessSpecialPorts: false,
    restrictions,
  };
}
