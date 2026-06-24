import { db } from "../db";
import { playerStates, missions, users } from "../../shared/schema";
import { eq, and, sql, lt, gte } from "drizzle-orm";

const VACATION_MODE_COOLDOWN_HOURS = 48;
const VACATION_MODE_MIN_INACTIVITY_DAYS = 7;
const MAX_VACATION_DAYS = 30;

class VacationService {
  async enableVacationMode(userId: string): Promise<{ success: boolean; message: string }> {
    const activeMissions = await db
      .select()
      .from(missions)
      .where(
        and(
          eq(missions.userId, userId),
          sql`${missions.status} IN ('outbound', 'return')`
        )
      )
      .limit(1);

    if (activeMissions.length > 0) {
      return { success: false, message: "Cannot activate vacation mode while fleets are in transit" };
    }

    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) return { success: false, message: "Player state not found" };

    const vacationUntil = new Date(Date.now() + MAX_VACATION_DAYS * 24 * 3600 * 1000);

    await db
      .update(playerStates)
      .set({
        resources: {
          ...((state.resources as any) || {}),
          vacationMode: true,
          vacationUntil,
          vacationStartedAt: new Date(),
        },
        updatedAt: new Date(),
      })
      .where(eq(playerStates.userId, userId));

    return { success: true, message: "Vacation mode activated. Your account is now protected." };
  }

  async disableVacationMode(userId: string): Promise<{ success: boolean; message: string }> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) return { success: false, message: "Player state not found" };

    const resources = (state.resources as any) || {};
    const vacationUntil = resources.vacationUntil;
    const vacationStartedAt = resources.vacationStartedAt;

    if (!resources.vacationMode) {
      return { success: false, message: "Vacation mode is not active" };
    }

    const hoursSinceActivation = vacationStartedAt
      ? (Date.now() - new Date(vacationStartedAt).getTime()) / 3600000
      : 0;

    if (hoursSinceActivation < VACATION_MODE_COOLDOWN_HOURS) {
      const remaining = Math.ceil(VACATION_MODE_COOLDOWN_HOURS - hoursSinceActivation);
      return {
        success: false,
        message: `Vacation mode was activated less than 48 hours ago. Please wait ${remaining} more hour${remaining > 1 ? 's' : ''}.`,
      };
    }

    resources.vacationMode = false;
    delete resources.vacationUntil;
    delete resources.vacationStartedAt;

    await db
      .update(playerStates)
      .set({ resources, updatedAt: new Date() })
      .where(eq(playerStates.userId, userId));

    return { success: true, message: "Vacation mode deactivated. Welcome back!" };
  }

  async getVacationStatus(userId: string): Promise<{
    inVacation: boolean;
    vacationUntil: string | null;
    vacationStartedAt: string | null;
    remainingDays: number;
    canDeactivate: boolean;
    deactivationWaitHours: number;
  }> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);

    if (!state) {
      return {
        inVacation: false,
        vacationUntil: null,
        vacationStartedAt: null,
        remainingDays: 0,
        canDeactivate: false,
        deactivationWaitHours: 0,
      };
    }

    const resources = (state.resources as any) || {};
    const inVacation = !!resources.vacationMode;
    const vacationUntil = resources.vacationUntil || null;
    const vacationStartedAt = resources.vacationStartedAt || null;

    const remainingDays = vacationUntil
      ? Math.max(0, Math.ceil((new Date(vacationUntil).getTime() - Date.now()) / 86400000))
      : 0;

    const hoursSinceActivation = vacationStartedAt
      ? (Date.now() - new Date(vacationStartedAt).getTime()) / 3600000
      : 999;

    const canDeactivate = hoursSinceActivation >= VACATION_MODE_COOLDOWN_HOURS;
    const deactivationWaitHours = Math.max(0, Math.ceil(VACATION_MODE_COOLDOWN_HOURS - hoursSinceActivation));

    return {
      inVacation,
      vacationUntil: vacationUntil?.toISOString ? vacationUntil.toISOString() : vacationUntil,
      vacationStartedAt: vacationStartedAt?.toISOString ? vacationStartedAt.toISOString() : vacationStartedAt,
      remainingDays,
      canDeactivate,
      deactivationWaitHours,
    };
  }

  async isInVacation(userId: string): Promise<boolean> {
    const [state] = await db
      .select()
      .from(playerStates)
      .where(eq(playerStates.userId, userId))
      .limit(1);
    if (!state) return false;
    const resources = (state.resources as any) || {};
    return !!resources.vacationMode;
  }

  async getPlayersInVacation(): Promise<string[]> {
    const vacationPlayers = await db
      .select({ userId: playerStates.userId })
      .from(playerStates)
      .where(sql`${playerStates.resources}->>'vacationMode' = 'true'`);

    return vacationPlayers.map((p) => p.userId);
  }

  async autoExpireVacation(): Promise<number> {
    const expired = await db
      .select({ userId: playerStates.userId, resources: playerStates.resources })
      .from(playerStates)
      .where(
        and(
          sql`${playerStates.resources}->>'vacationMode' = 'true'`,
          sql`(${playerStates.resources}->>'vacationUntil')::timestamp < NOW()`
        )
      );

    let count = 0;
    for (const player of expired) {
      const resources = player.resources as any;
      if (resources) {
        resources.vacationMode = false;
        delete resources.vacationUntil;
        delete resources.vacationStartedAt;

        await db
          .update(playerStates)
          .set({ resources, updatedAt: new Date() })
          .where(eq(playerStates.userId, player.userId));
        count++;
      }
    }

    return count;
  }
}

export const vacationService = new VacationService();
