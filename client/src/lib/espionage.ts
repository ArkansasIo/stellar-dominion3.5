import { api } from "./api-client";

export type IntelCategory = "military" | "economy" | "research" | "fleet";

export interface EspionageStats {
  espionageTech: number;
  counterIntelligence: number;
  activeSpyMissions: number;
  successRate: number;
}

export interface SpyMissionRequest {
  targetUserId: string;
  numSpies: number;
  categories: IntelCategory[];
}

export interface SpyMissionResult {
  missionId: string;
  success: boolean;
  detected: boolean;
  costDeducted: Record<string, number>;
  intelGathered: unknown;
}

export const espionageSystems = {
  async getStats(): Promise<EspionageStats> {
    const response = await api.raw.get<EspionageStats>("/espionage/stats");
    return response.data as EspionageStats;
  },
  async sendSpy(request: SpyMissionRequest): Promise<SpyMissionResult> {
    const response = await api.raw.post<SpyMissionResult>("/espionage/send-spy", request);
    return response.data as SpyMissionResult;
  },
  async getMissions(): Promise<unknown[]> {
    const response = await api.raw.get<{ missions: unknown[] }>("/espionage/missions");
    return response.data?.missions ?? [];
  },
  async getReport(missionId: string): Promise<unknown> {
    const response = await api.raw.get(`/espionage/report/${encodeURIComponent(missionId)}`);
    return response.data;
  },
};

export default espionageSystems;
