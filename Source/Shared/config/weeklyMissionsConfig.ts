export interface WeeklyMissionState {
  weekId: string;
  weekStart: string;
  weekEnd: string;
  missions: WeeklyMissionAssignment[];
  totalScore?: number;
  bonusScore?: number;
  bonusPool?: number;
  completedCount?: number;
  totalCount?: number;
  streak?: number;
  claimed?: boolean;
}

export interface WeeklyMissionAssignment {
  id?: string;
  missionId?: string;
  templateId?: string;
  progress?: number;
  currentProgress?: number;
  target?: number;
  objectiveTarget?: number;
  completed?: boolean;
  status?: string;
  completedAt?: string;
  claimedAt?: string;
  reward?: any;
  rewardCredits?: number;
  rewardResources?: Record<string, number>;
  rewardXp?: number;
}

export function getWeekId(): string {
  return "";
}

export function getWeekStart(weekId: string): Date {
  return new Date();
}

export function getWeekEnd(weekId: string): Date {
  return new Date();
}

export function selectWeeklyMissions(weekId: string, count: number): any[] {
  return [];
}

export function buildWeeklyMissionState(weekId: string, missionIds: string[]): WeeklyMissionState {
  return {
    weekId,
    weekStart: "",
    weekEnd: "",
    missions: [],
    bonusPool: 0,
    completedCount: 0,
    totalCount: missionIds.length,
    streak: 0,
  };
}

export function calculateWeeklyBonus(state: WeeklyMissionState): number {
  return 1;
}
