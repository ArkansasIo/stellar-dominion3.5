// Re-export shared realm configuration from the shared root. This module lives
// under client/src/lib, so reaching the repository-level shared/ directory
// requires traversing four parent directories.
export {
  REALMS,
  SERVER_INFO,
  type RealmDef,
  type ServerRegion,
} from "../../../../shared/config/realmConfig";

import {
  REALMS,
  SERVER_INFO,
  type ServerRegion,
} from "../../../../shared/config/realmConfig";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload.error ?? payload.message ?? `Request failed (${response.status})`,
    );
  }
  return payload as T;
}

export const realmSystems = {
  list: () =>
    request<{
      realms: unknown[];
      selectedRealmId: string;
      selectedRealm: unknown;
    }>("/universe/realms"),
  select: (realmId: string) =>
    request("/universe/realms/select", {
      method: "POST",
      body: JSON.stringify({ realmId }),
    }),
  getLocal: (realmId?: string) =>
    REALMS.find((realm) => realm.id === realmId) ?? REALMS[0],
  getServer: (region: ServerRegion) => SERVER_INFO[region],
};

export default realmSystems;
