// Time utility functions for real-time displays

export function getTimeRemaining(endTime: number): number {
  return Math.max(0, endTime - Date.now());
}

export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export function getProgressPercentage(startTime: number, endTime: number): number {
  const now = Date.now();
  const totalDuration = endTime - startTime;
  const elapsed = Math.max(0, now - startTime);
  const progress = Math.min(100, (elapsed / totalDuration) * 100);
  return Math.floor(progress);
}

export function calculateBuildTime(level: number, baseTime: number, gameSpeed: number): number {
  // Building time increases with level
  const levelMultiplier = Math.pow(1.15, level);
  const adjustedTime = (baseTime * levelMultiplier) / gameSpeed;
  return Math.round(adjustedTime);
}

export function calculateResearchTime(level: number, baseTime: number, gameSpeed: number): number {
  // Research time increases with level
  const levelMultiplier = Math.pow(1.2, level);
  const adjustedTime = (baseTime * levelMultiplier) / gameSpeed;
  return Math.round(adjustedTime);
}

export function calculateUnitBuildTime(unitCount: number, baseTime: number, gameSpeed: number): number {
  // Unit time scales linearly per unit
  const adjustedTime = (baseTime * unitCount) / gameSpeed;
  return Math.round(adjustedTime);
}
