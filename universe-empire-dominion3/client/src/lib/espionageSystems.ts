export interface SpyMission {
  id: string;
  targetId: string;
  targetName: string;
  missionType: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "detected";
  startedAt: number;
  completesAt: number;
  report?: SpyReport;
}

export interface SpyReport {
  missionId: string;
  category: string;
  success: boolean;
  detected: boolean;
  intel: Record<string, any>;
  confidence: number;
  timestamp: number;
}

export interface EspionageStats {
  successRate: number;
  detectionChance: number;
  activeMissions: number;
  completedMissions: number;
  detectedMissions: number;
  researchLevel: number;
  counterIntelLevel: number;
}

export interface CounterIntelStatus {
  active: boolean;
  level: number;
  expiresAt: number | null;
  bonus: number;
}

export async function fetchEspionageStats(): Promise<EspionageStats> {
  const res = await fetch("/api/espionage/stats", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load espionage stats");
  return res.json();
}

export async function sendSpy(targetId: string, missionType: string): Promise<{ success: boolean; mission: SpyMission }> {
  const res = await fetch("/api/espionage/send-spy", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId, missionType }),
  });
  if (!res.ok) throw new Error("Failed to send spy");
  return res.json();
}

export async function fetchMissions(): Promise<SpyMission[]> {
  const res = await fetch("/api/espionage/missions", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load missions");
  const data = await res.json();
  return data.missions || [];
}

export async function fetchReport(missionId: string): Promise<SpyReport> {
  const res = await fetch(`/api/espionage/report/${missionId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load report");
  return res.json();
}

export async function activateCounterIntel(): Promise<CounterIntelStatus> {
  const res = await fetch("/api/espionage/activate-defense", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to activate counter-intel");
  return res.json();
}
