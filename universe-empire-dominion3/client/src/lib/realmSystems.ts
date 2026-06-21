export interface Realm {
  id: string;
  slug: string;
  name: string;
  description: string;
  region: string;
  maxPlayers: number;
  currentPlayers: number;
  status: string;
  color: string;
  bonusDescription: string;
  bonusMultiplier: number;
}

export interface RealmSelection {
  success: boolean;
  selectedRealmId: string;
  selectedRealm: Realm;
}

export interface RealmStatus {
  realms: Realm[];
  selectedRealmId: string;
  selectedRealm: Realm | null;
}

export async function fetchRealms(): Promise<RealmStatus> {
  const res = await fetch("/api/universe/realms", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load realms");
  return res.json();
}

export async function selectRealm(realmId: string): Promise<RealmSelection> {
  const res = await fetch("/api/universe/realms/select", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ realmId }),
  });
  if (!res.ok) throw new Error("Failed to select realm");
  return res.json();
}
