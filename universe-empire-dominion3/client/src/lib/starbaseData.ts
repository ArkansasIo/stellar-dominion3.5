import type { StarbaseType, StarbaseModule } from "@shared/config/starbaseConfig";

export type StarbaseRecord = {
  id: string;
  playerId: string;
  starbaseType: StarbaseType;
  name: string;
  level: number;
  coordinates: string;
  metalStorage: number;
  crystalStorage: number;
  deuteriumStorage: number;
  metalProductionRate: number;
  crystalProductionRate: number;
  deuteriumProductionRate: number;
  hangarSlots: number;
  researchSlots: number;
  defenseLevel: number;
  isActive: boolean;
  lastResourceUpdate: string | null;
  builtAt: string;
  createdAt: string;
  updatedAt: string;
};

export type StarbaseWithType = StarbaseRecord & {
  typeInfo: {
    id: StarbaseType;
    name: string;
    description: string;
    icon: string;
    maxLevel: number;
    moduleSlots: number;
  };
  computedStats: Record<string, number>;
  upgradeCost: { metal: number; crystal: number; deuterium: number; credits: number };
  buildTime: number;
};

export async function fetchStarbases(): Promise<StarbaseWithType[]> {
  const res = await fetch("/api/starbases", { credentials: "include" });
  const data = await res.json();
  return data.starbases || [];
}

export async function fetchStarbaseTypes() {
  const res = await fetch("/api/starbases/types", { credentials: "include" });
  const data = await res.json();
  return data.types || [];
}

export async function fetchStarbaseModules(starbaseType: StarbaseType): Promise<StarbaseModule[]> {
  const res = await fetch(`/api/starbase/modules/${starbaseType}`, { credentials: "include" });
  const data = await res.json();
  return data.modules || [];
}

export async function buildStarbase(starbaseType: StarbaseType, name?: string, coordinates?: string) {
  const res = await fetch("/api/starbases/build", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ starbaseType, name, coordinates }),
  });
  return res.json();
}

export async function upgradeStarbase(starbaseId: string) {
  const res = await fetch(`/api/starbases/${starbaseId}/upgrade`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function renameStarbase(starbaseId: string, name: string) {
  const res = await fetch(`/api/starbases/${starbaseId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function toggleStarbase(starbaseId: string) {
  const res = await fetch(`/api/starbases/${starbaseId}/toggle`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function deleteStarbase(starbaseId: string) {
  const res = await fetch(`/api/starbases/${starbaseId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}
