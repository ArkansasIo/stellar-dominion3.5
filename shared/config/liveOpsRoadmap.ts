export type RoadmapStatus = "planned" | "active" | "complete";

export interface NarrativeArc {
  id: string;
  title: string;
  subtitle: string;
  chapters: number;
  theme: string;
  status: RoadmapStatus;
  rewardTrack: string[];
}

export interface TutorialMission {
  id: string;
  order: number;
  title: string;
  objective: string;
  system: string;
  reward: string;
}

export interface CompetitionType {
  id: string;
  name: string;
  description: string;
  scoring: string;
  maxParticipants: number;
  entryCost: number;
}

export interface GlobalEventDefinition {
  id: string;
  name: string;
  description: string;
  durationHours: number;
  objective: string;
  status: RoadmapStatus;
  reward: string;
}

export interface SeasonReward {
  tier: number;
  xpRequired: number;
  freeReward: string;
  premiumReward: string;
}

export interface AchievementMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  reward: string;
}

export const NARRATIVE_ARCS: NarrativeArc[] = [
  { id: "arc-dawn", title: "The First Signal", subtitle: "A transmission older than the stars", chapters: 5, theme: "Discovery", status: "active", rewardTrack: ["Explorer Badge", "Astrometrics Blueprint", "Dawn Banner"] },
  { id: "arc-iron", title: "Iron Meridian", subtitle: "The frontier answers with fire", chapters: 6, theme: "War", status: "planned", rewardTrack: ["Meridian Hull Plating", "Veteran Title", "War Chest"] },
  { id: "arc-veil", title: "The Glass Veil", subtitle: "Diplomacy at the edge of reality", chapters: 6, theme: "Diplomacy", status: "planned", rewardTrack: ["Veil Diplomatic Seal", "Alliance Charter", "Influence Cache"] },
  { id: "arc-ascension", title: "The Ascension Protocol", subtitle: "Every empire must choose what it becomes", chapters: 8, theme: "Endgame", status: "planned", rewardTrack: ["Ascendant Frame", "Kardashev Relic", "Season Finale Title"] },
];

export const TUTORIAL_MISSIONS: TutorialMission[] = [
  { id: "tutorial-command", order: 1, title: "Establish Command", objective: "Review the command center and confirm your homeworld", system: "Empire Core", reward: "+500 metal, Command License" },
  { id: "tutorial-production", order: 2, title: "Light the Foundries", objective: "Upgrade one production building and collect its output", system: "Resources", reward: "+300 crystal, Builder XP" },
  { id: "tutorial-research", order: 3, title: "First Principles", objective: "Start one technology or skill training queue", system: "Research", reward: "+1,000 research XP" },
  { id: "tutorial-fleet", order: 4, title: "Raise the Fleet", objective: "Commission and move a scout fleet", system: "Military", reward: "Scout Squadron" },
  { id: "tutorial-defense", order: 5, title: "Hold the Line", objective: "Activate one planetary or orbital defense", system: "Defense", reward: "+1,000 deuterium, Defender Badge" },
  { id: "tutorial-market", order: 6, title: "Open Commerce", objective: "Inspect the marketplace and create or accept a trade", system: "Marketplace", reward: "+250 credits, Trader XP" },
  { id: "tutorial-story", order: 7, title: "Answer the Signal", objective: "Complete the first narrative mission of The First Signal", system: "Campaign", reward: "Dawn Signal Fragment" },
];

export const COMPETITION_TYPES: CompetitionType[] = [
  { id: "fleet-trials", name: "Fleet Trials", description: "Score points through verified PvP victories and efficient fleet survival", scoring: "Victory points minus casualty ratio", maxParticipants: 64, entryCost: 0 },
  { id: "industry-cup", name: "Industry Cup", description: "Compete to produce and deliver the greatest verified resource output", scoring: "Weighted resource value delivered", maxParticipants: 128, entryCost: 500 },
  { id: "explorer-rally", name: "Explorer Rally", description: "Race across the frontier while maximizing discovery quality", scoring: "Discovery value divided by travel time", maxParticipants: 64, entryCost: 250 },
  { id: "grand-strategy", name: "Grand Strategy", description: "A seasonal empire score competition spanning economy, research, diplomacy, and combat", scoring: "Composite empire score", maxParticipants: 256, entryCost: 1_000 },
];

export const GLOBAL_EVENTS: GlobalEventDefinition[] = [
  { id: "event-signal-storm", name: "Signal Storm", description: "A sector-wide anomaly makes every expedition a chance to uncover the First Signal", durationHours: 72, objective: "Community discovery points", status: "active", reward: "Global research multiplier and Signal Cache" },
  { id: "event-frontier-day", name: "Frontier Day", description: "Founders compete to expand the safe frontier before the next season begins", durationHours: 168, objective: "Collective colonies founded", status: "planned", reward: "Frontier monument and universal title" },
  { id: "event-void-convergence", name: "Void Convergence", description: "An endgame raid window where all realms contribute to a single threat meter", durationHours: 48, objective: "Damage the convergence core", status: "planned", reward: "Realm-wide relic drop table" },
];

export const SEASON_REWARDS: SeasonReward[] = Array.from({ length: 30 }, (_, index) => {
  const tier = index + 1;
  return {
    tier,
    xpRequired: tier * 1_000,
    freeReward: tier % 5 === 0 ? `Milestone Crate ${tier / 5}` : `${tier * 100} credits`,
    premiumReward: tier % 10 === 0 ? `Season Relic ${tier / 10}` : `Season Materials ${tier * 25}`,
  };
});

export const ACHIEVEMENT_MILESTONES: AchievementMilestone[] = [
  { id: "milestone-market-maker", title: "Market Maker", description: "Complete 25 player-to-player trades", category: "Economy", target: 25, reward: "Broker title and 2,500 credits" },
  { id: "milestone-event-pioneer", title: "Event Pioneer", description: "Participate in the first global event", category: "Events", target: 1, reward: "Pioneer badge and event cache" },
  { id: "milestone-season-veteran", title: "Season Veteran", description: "Reach tier 30 on a season track", category: "Season", target: 30, reward: "Veteran frame and relic choice" },
  { id: "milestone-campaign-hero", title: "Campaign Hero", description: "Complete every chapter in an active narrative arc", category: "Campaign", target: 5, reward: "Arc title and narrative relic" },
  { id: "milestone-fair-play", title: "Clean Hands", description: "Complete 100 verified actions without an integrity flag", category: "Fair Play", target: 100, reward: "Trust seal and alliance reputation" },
  { id: "milestone-kardashev", title: "Star-Forged", description: "Reach Kardashev Tier 10", category: "Progression", target: 10, reward: "Star-forged emblem and fleet modifier" },
];

export const RELEASE_GATES = [
  { id: "closed-beta", label: "Closed beta access", target: "500 active players", status: "planned" as RoadmapStatus },
  { id: "open-beta", label: "Open beta stress test", target: "5,000 concurrent players", status: "planned" as RoadmapStatus },
  { id: "launch", label: "v1.0 production launch", target: "90 universes across 9 realms", status: "planned" as RoadmapStatus },
  { id: "post-launch", label: "First content patch", target: "Events, seasons, and balance patch pipeline", status: "planned" as RoadmapStatus },
];

export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", status: "active" },
  { code: "es", name: "Español", status: "planned" },
  { code: "fr", name: "Français", status: "planned" },
  { code: "de", name: "Deutsch", status: "planned" },
  { code: "ja", name: "日本語", status: "planned" },
  { code: "ko", name: "한국어", status: "planned" },
] as const;

export const ROADMAP_MILESTONES = [
  "M6.1 Marketplace operational with player trading",
  "M6.2 First global event runs successfully",
  "M6.3 Season 1 launches with full track",
  "M6.4 Achievement system tracks and rewards milestones",
  "M7.1 Lighthouse scores ≥ 90 on all pages",
  "M7.2 P95 API response times < 200ms",
  "M7.3 Balance spreadsheet reviewed and applied",
  "M7.4 New player reaches mid-game without external guidance",
  "M8.1 Closed beta with 500 active players",
  "M8.2 Open beta stress test with 5,000 concurrent players",
  "M8.3 v1.0 production launch",
  "M8.4 First content patch post-launch",
  "M8.5 Documentation and quality-of-life update",
];
