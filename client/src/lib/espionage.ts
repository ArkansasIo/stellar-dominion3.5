export type IntelCategory = "military" | "economy" | "research" | "fleet";
export interface EspionageStats { espionageTech: number; counterIntelligence: number; activeSpyMissions: number; successRate: number; }
export interface SpyMissionRequest { targetUserId: string; numSpies: number; categories: IntelCategory[]; }
export interface SpyMissionResult { missionId: string; success: boolean; detected: boolean; costDeducted: Record<string, number>; intelGathered: unknown; }
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`/api${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }, ...options }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.error ?? payload.message ?? `Request failed (${response.status})`); return payload as T; }
export const espionageSystems = { getStats: () => request<EspionageStats>("/espionage/stats"), sendSpy: (body: SpyMissionRequest) => request<SpyMissionResult>("/espionage/send-spy", { method: "POST", body: JSON.stringify(body) }), getMissions: async () => (await request<{ missions: unknown[] }>("/espionage/missions")).missions ?? [], getReport: (missionId: string) => request(`/espionage/report/${encodeURIComponent(missionId)}`) };
export default espionageSystems;
