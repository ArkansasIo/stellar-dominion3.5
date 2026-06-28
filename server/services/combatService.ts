class CombatService {
  resolveCombat(attackerId: string, defenderId: string): any {
    return { success: true };
  }
}

export const combatService = new CombatService();
