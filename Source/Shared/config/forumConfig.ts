export const FORUM_CATEGORIES = [
  { id: "general", name: "General", description: "General discussion about the game", icon: "MessageSquare", color: "#6366f1" },
  { id: "strategy", name: "Strategy", description: "Build orders, tactics, and empire optimization", icon: "Target", color: "#f59e0b" },
  { id: "economy", name: "Economy", description: "Resource management, trading, and market discussion", icon: "Gem", color: "#22c55e" },
  { id: "alliance", name: "Alliance", description: "Alliance recruitment, diplomacy, and coordination", icon: "Users", color: "#ec4899" },
  { id: "bug-reports", name: "Bug Reports", description: "Report bugs and issues with the game", icon: "Bug", color: "#ef4444" },
  { id: "feedback", name: "Feedback", description: "Suggestions and feedback for game improvements", icon: "Lightbulb", color: "#8b5cf6" },
] as const;

export const THREAD_LIMITS = {
  minTitleLength: 4,
  maxTitleLength: 120,
  minContentLength: 8,
  maxContentLength: 10000,
  maxRepliesPerThread: 500,
  maxThreadsPerDay: 10,
} as const;

export const MODERATION_CONFIG = {
  canPin: ["admin", "moderator"],
  canLock: ["admin", "moderator"],
  canDelete: ["admin", "moderator"],
  canBan: ["admin"],
  canEditOwn: true,
  editTimeLimitMinutes: 15,
} as const;

export const POST_COOLDOWN_MS = 5000;

export const FORUM_SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "most-replies", label: "Most Replies" },
  { id: "last-activity", label: "Last Activity" },
] as const;
