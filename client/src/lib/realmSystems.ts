import { REALMS, SERVER_INFO, type RealmDef, type ServerRegion } from "../../../shared/config/realmConfig";
export { REALMS, SERVER_INFO };
export type { RealmDef, ServerRegion };
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { const r = await fetch(`/api${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }, ...options }); const p = await r.json().catch(() => ({})); if (!r.ok) throw new Error(p.error ?? p.message ?? `Request failed (${r.status})`); return p as T; }
export const realmSystems = { list: () => request<{ realms: unknown[]; selectedRealmId: string; selectedRealm: unknown }>("/universe/realms"), select: (realmId: string) => request(`/universe/realms/select`, { method: "POST", body: JSON.stringify({ realmId }) }), getLocal: (realmId?: string) => REALMS.find((realm) => realm.id === realmId) ?? REALMS[0], getServer: (region: ServerRegion) => SERVER_INFO[region] };
export default realmSystems;
