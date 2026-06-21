export const REALM_LIST = [
  { id: "nexus-alpha", name: "Nexus Alpha", description: "The flagship server with the largest player base and most active economy.", region: "NA" as const, maxPlayers: 12000, status: "active" as const, color: "#6366f1", bonus: "+10% resource production" },
  { id: "cygnus-eu", name: "Cygnus EU", description: "European-focused server with balanced gameplay and strong alliance scene.", region: "EU" as const, maxPlayers: 10000, status: "active" as const, color: "#22c55e", bonus: "+10% research speed" },
  { id: "orion-apac", name: "Orion APAC", description: "Asia-Pacific server with fast-paced combat and competitive rankings.", region: "APAC" as const, maxPlayers: 9000, status: "active" as const, color: "#f59e0b", bonus: "+15% combat XP" },
  { id: "vanguard", name: "Vanguard", description: "Hardcore server with increased difficulty and richer rewards.", region: "NA" as const, maxPlayers: 8000, status: "active" as const, color: "#ef4444", bonus: "+25% all rewards" },
  { id: "pioneer", name: "Pioneer", description: "Beginner-friendly server with tutorials and mentorship programs.", region: "Global" as const, maxPlayers: 15000, status: "active" as const, color: "#8b5cf6", bonus: "+20% XP for first 30 days" },
] as const;

export const REALM_FEATURES = {
  crossRealmChat: false,
  realmWars: true,
  leaderboards: true,
  realmEvents: true,
  crossRealmTrade: false,
} as const;

export const REALM_SELECTION_CONFIG = {
  canChangeRealm: true,
  cooldownDays: 7,
  transferCost: { credits: 50000, darkmatter: 100 },
  maxTransfersPerMonth: 2,
} as const;

export type RealmRegion = typeof REALM_LIST[number]["region"];
export type RealmStatus = typeof REALM_LIST[number]["status"];
