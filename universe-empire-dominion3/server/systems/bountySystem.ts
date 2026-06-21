import { BOUNTY_CONFIG, Bounty } from "../../shared/config/xenoberage/bountyConfig";
import { db } from "../db";
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
): Promise<{ success: boolean; message: string; bounty?: Bounty }> {
  const maxAmount = placerNetworth * BOUNTY_CONFIG.maxValue;
  const cappedAmount = Math.min(amount, maxAmount);

  if (cappedAmount <= 0) {
    return { success: false, message: "Invalid bounty amount" };
  }

  const bounty: Bounty = {
    id: crypto.randomUUID(),
    placerId,
    targetId,
    amount: cappedAmount,
    active: true,
    createdAt: new Date(),
  };

  // TODO: Insert bounty into database

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
  // TODO: Find active bounty for target, verify attacker defeated target
  // Transfer credits from placer to attacker, deactivate bounty

  return {
    success: true,
    reward: 0,
    message: "Bounty claimed",
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
