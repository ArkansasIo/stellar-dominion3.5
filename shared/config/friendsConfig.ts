export const FRIEND_LIMITS = {
  maxFriends: 100,
  maxPendingRequests: 20,
  maxRequestsPerDay: 10,
  minSearchQueryLength: 2,
} as const;

export const FRIEND_FEATURES = {
  onlineStatus: true,
  nicknames: true,
  favorites: true,
  recommendations: true,
  mutualFriends: true,
  lastSeenTimestamp: true,
} as const;

export const ONLINE_STATUS_CONFIG = {
  idleTimeoutMinutes: 15,
  offlineThresholdMinutes: 30,
  statusOptions: ["online", "idle", "offline", "do-not-disturb"] as const,
  showLastSeen: true,
  showGameActivity: true,
};

export type OnlineStatus = typeof ONLINE_STATUS_CONFIG.statusOptions[number];
