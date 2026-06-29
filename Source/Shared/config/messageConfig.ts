export const MESSAGE_CATEGORIES = [
  { id: "direct", name: "Direct Message", description: "Private message between players", icon: "Mail", color: "#6366f1" },
  { id: "system", name: "System", description: "Automated system messages", icon: "Settings", color: "#94a3b8" },
  { id: "combat", name: "Combat Report", description: "Battle results and attack notifications", icon: "Sword", color: "#ef4444" },
  { id: "trade", name: "Trade", description: "Trade offers and market notifications", icon: "Gem", color: "#22c55e" },
  { id: "alliance", name: "Alliance", description: "Alliance-wide announcements", icon: "Users", color: "#ec4899" },
  { id: "notification", name: "Notification", description: "Event and achievement notifications", icon: "Bell", color: "#f59e0b" },
] as const;

export const MESSAGE_LIMITS = {
  maxMessagesPerDay: 100,
  maxRecipients: 1,
  maxSubjectLength: 120,
  maxBodyLength: 5000,
  maxSearchResults: 50,
} as const;

export const AUTO_DELETE_DAYS: Record<string, number> = {
  system: 30,
  combat: 90,
  trade: 30,
  notification: 14,
  direct: -1,
  alliance: -1,
};

export const NOTIFICATION_TYPES = [
  { id: "battle", name: "Battle Alert", description: "Your planet is under attack", enabled: true },
  { id: "construction", name: "Construction Complete", description: "Building or ship construction finished", enabled: true },
  { id: "research", name: "Research Complete", description: "Technology research finished", enabled: true },
  { id: "trade", name: "Trade Received", description: "Incoming trade offer", enabled: true },
  { id: "alliance", name: "Alliance Activity", description: "Alliance events and messages", enabled: true },
  { id: "friend", name: "Friend Activity", description: "Friend online or events", enabled: false },
] as const;
