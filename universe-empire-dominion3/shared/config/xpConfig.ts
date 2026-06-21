export type XpSource = "combat" | "mining" | "exploration" | "crafting" | "research" | "trading" | "social" | "construction" | "fleet" | "diplomacy" | "daily" | "weekly" | "achievement" | "story";

export interface XpTier {
  level: number;
  name: string;
  title: string;
  xpRequired: number;
  totalXpRequired: number;
  color: string;
  glowColor: string;
  badge: string;
  rewards: { credits: number; resources: { metal: number; crystal: number; deuterium: number } };
  unlocks: string[];
}

export interface XpSourceConfig {
  id: XpSource;
  label: string;
  icon: string;
  color: string;
  baseXp: number;
  multiplier: number;
  description: string;
}

const SOURCE_CONFIGS: XpSourceConfig[] = [
  { id: "combat", label: "Combat", icon: "⚔️", color: "#ef4444", baseXp: 50, multiplier: 1.0, description: "XP earned from destroying enemies and winning battles" },
  { id: "mining", label: "Mining", icon: "⛏️", color: "#f59e0b", baseXp: 20, multiplier: 0.8, description: "XP earned from resource extraction operations" },
  { id: "exploration", label: "Exploration", icon: "🔭", color: "#3b82f6", baseXp: 40, multiplier: 1.2, description: "XP earned from discovering new systems and anomalies" },
  { id: "crafting", label: "Crafting", icon: "🔧", color: "#6b7280", baseXp: 30, multiplier: 0.9, description: "XP earned from building ships and equipment" },
  { id: "research", label: "Research", icon: "🔬", color: "#8b5cf6", baseXp: 35, multiplier: 1.1, description: "XP earned from completing technology research" },
  { id: "trading", label: "Trading", icon: "💰", color: "#10b981", baseXp: 15, multiplier: 0.7, description: "XP earned from market transactions" },
  { id: "social", label: "Social", icon: "🤝", color: "#14b8a6", baseXp: 25, multiplier: 0.85, description: "XP earned from alliance and guild activities" },
  { id: "construction", label: "Construction", icon: "🏗️", color: "#f97316", baseXp: 30, multiplier: 0.9, description: "XP earned from building and upgrading structures" },
  { id: "fleet", label: "Fleet", icon: "🚀", color: "#6366f1", baseXp: 45, multiplier: 1.0, description: "XP earned from fleet operations and maneuvers" },
  { id: "diplomacy", label: "Diplomacy", icon: "📜", color: "#06b6d4", baseXp: 30, multiplier: 0.95, description: "XP earned from diplomatic actions" },
  { id: "daily", label: "Daily", icon: "📅", color: "#ec4899", baseXp: 100, multiplier: 1.5, description: "XP earned from completing daily objectives" },
  { id: "weekly", label: "Weekly", icon: "🎯", color: "#f97316", baseXp: 200, multiplier: 2.0, description: "XP earned from completing weekly missions" },
  { id: "achievement", label: "Achievement", icon: "🏆", color: "#eab308", baseXp: 500, multiplier: 3.0, description: "XP earned from unlocking achievements" },
  { id: "story", label: "Story", icon: "📖", color: "#a855f7", baseXp: 150, multiplier: 1.8, description: "XP earned from story missions" },
];

function generateTiers(): XpTier[] {
  const tiers: XpTier[] = [];
  let totalXp = 0;

  const tierDefs: Array<{ level: number; name: string; title: string; color: string; glow: string; badge: string; xpBase: number; xpScale: number }> = [
    { level: 1, name: "Dust Walker", title: "Scrap Collector", color: "#94a3b8", glow: "#cbd5e1", badge: "🥉", xpBase: 100, xpScale: 1.0 },
    { level: 5, name: "Salvage Runner", title: "Junkyard Scout", color: "#a8a29e", glow: "#d6d3d1", badge: "🥉", xpBase: 250, xpScale: 1.1 },
    { level: 10, name: "Scrap Mechanic", title: "Jury-Rigger", color: "#78716c", glow: "#a8a29e", badge: "🥈", xpBase: 600, xpScale: 1.15 },
    { level: 15, name: "Metal Seeker", title: "Ore Hunter", color: "#d97706", glow: "#fbbf24", badge: "🥈", xpBase: 1200, xpScale: 1.2 },
    { level: 20, name: "Crystal Gatherer", title: "Deep Miner", color: "#2563eb", glow: "#60a5fa", badge: "🥈", xpBase: 2000, xpScale: 1.25 },
    { level: 25, name: "Hull Builder", title: "Frame Welder", color: "#059669", glow: "#34d399", badge: "🥇", xpBase: 3500, xpScale: 1.3 },
    { level: 30, name: "Shipwright", title: "Vessel Architect", color: "#7c3aed", glow: "#a78bfa", badge: "🥇", xpBase: 5500, xpScale: 1.35 },
    { level: 35, name: "Scout Pilot", title: "Pathfinder", color: "#0891b2", glow: "#22d3ee", badge: "🥇", xpBase: 8000, xpScale: 1.4 },
    { level: 40, name: "Void Walker", title: "Star Wanderer", color: "#4f46e5", glow: "#818cf8", badge: "👑", xpBase: 12000, xpScale: 1.45 },
    { level: 45, name: "Sector Surveyor", title: "Galaxy Cartographer", color: "#0d9488", glow: "#2dd4bf", badge: "👑", xpBase: 18000, xpScale: 1.5 },
    { level: 50, name: "Laser Jockey", title: "Plasma Technician", color: "#dc2626", glow: "#f87171", badge: "👑", xpBase: 25000, xpScale: 1.55 },
    { level: 55, name: "Shield Warden", title: "Defense Architect", color: "#2563eb", glow: "#60a5fa", badge: "⭐", xpBase: 35000, xpScale: 1.6 },
    { level: 60, name: "Fleet Lieutenant", title: "Squad Leader", color: "#9333ea", glow: "#c084fc", badge: "⭐", xpBase: 50000, xpScale: 1.65 },
    { level: 65, name: "Diplomat", title: "Envoy", color: "#0891b2", glow: "#22d3ee", badge: "⭐", xpBase: 70000, xpScale: 1.7 },
    { level: 70, name: "Trade Runner", title: "Merchant Captain", color: "#16a34a", glow: "#4ade80", badge: "💎", xpBase: 100000, xpScale: 1.75 },
    { level: 75, name: "Tech Adept", title: "Science Officer", color: "#7c3aed", glow: "#a78bfa", badge: "💎", xpBase: 140000, xpScale: 1.8 },
    { level: 80, name: "Battalion Leader", title: "Regiment Commander", color: "#dc2626", glow: "#f87171", badge: "💎", xpBase: 200000, xpScale: 1.85 },
    { level: 85, name: "Station Commander", title: "Platform Governor", color: "#d97706", glow: "#fbbf24", badge: "🌟", xpBase: 280000, xpScale: 1.9 },
    { level: 90, name: "Void Admiral", title: "Deep Space Lord", color: "#4f46e5", glow: "#818cf8", badge: "🌟", xpBase: 400000, xpScale: 1.95 },
    { level: 95, name: "Cosmic Warden", title: "Galaxy Guardian", color: "#0d9488", glow: "#2dd4bf", badge: "🌟", xpBase: 550000, xpScale: 2.0 },
    { level: 99, name: "Absolute Dominion", title: "Supreme Ruler", color: "#f59e0b", glow: "#fcd34d", badge: "🏆", xpBase: 750000, xpScale: 2.0 },
  ];

  const allLevels = new Set<number>();
  for (const def of tierDefs) allLevels.add(def.level);
  for (let i = 1; i <= 99; i++) allLevels.add(i);

  const sortedLevels = Array.from(allLevels).sort((a, b) => a - b);
  let tierIdx = 0;

  for (const level of sortedLevels) {
    const def = tierDefs.find((d) => d.level === level) || tierDefs[Math.min(tierIdx, tierDefs.length - 1)];
    if (tierDefs.some((d) => d.level === level)) tierIdx = tierDefs.findIndex((d) => d.level === level);

    const xpRequired = Math.round(def.xpBase * Math.pow(def.xpScale, (level - def.level) / 5));
    totalXp += xpRequired;

    tiers.push({
      level,
      name: def.name,
      title: def.title,
      xpRequired,
      totalXpRequired: totalXp,
      color: def.color,
      glowColor: def.glow,
      badge: def.badge,
      rewards: {
        credits: Math.round(xpRequired * 2),
        resources: { metal: Math.round(level * 100), crystal: Math.round(level * 60), deuterium: Math.round(level * 20) },
      },
      unlocks: level % 10 === 0 ? [`New tier unlocked at level ${level}`] : [],
    });
  }

  return tiers;
}

export const XP_TIERS: XpTier[] = generateTiers();
export const XP_SOURCES: XpSourceConfig[] = SOURCE_CONFIGS;
export const MAX_LEVEL = 99;

export function getXpTier(level: number): XpTier | undefined {
  return XP_TIERS.find((t) => t.level === level);
}

export function getNearestTier(level: number): XpTier {
  let closest = XP_TIERS[0];
  for (const tier of XP_TIERS) {
    if (tier.level <= level) closest = tier;
  }
  return closest;
}

export function calculateLevelFromXp(totalXp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  let accumulatedXp = 0;

  for (let i = 0; i < XP_TIERS.length; i++) {
    const tier = XP_TIERS[i];
    const nextTier = XP_TIERS[i + 1];

    if (!nextTier || totalXp < accumulatedXp + tier.xpRequired) {
      const currentXp = totalXp - accumulatedXp;
      return {
        level: tier.level,
        currentXp,
        nextLevelXp: tier.xpRequired,
        progress: Math.min(100, (currentXp / tier.xpRequired) * 100),
      };
    }
    accumulatedXp += tier.xpRequired;
  }

  return { level: 99, currentXp: 0, nextLevelXp: 1, progress: 100 };
}

export function getXpForAction(source: XpSource, difficulty: number = 1, tier: number = 1): number {
  const config = SOURCE_CONFIGS.find((s) => s.id === source);
  if (!config) return 0;
  return Math.round(config.baseXp * config.multiplier * difficulty * (1 + tier * 0.05));
}

export function formatXp(xp: number): string {
  if (xp >= 1000000000) return `${(xp / 1000000000).toFixed(1)}B`;
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

export function getSourceColor(source: XpSource): string {
  return SOURCE_CONFIGS.find((s) => s.id === source)?.color || "#6b7280";
}

export function getSourceIcon(source: XpSource): string {
  return SOURCE_CONFIGS.find((s) => s.id === source)?.icon || "⭐";
}
