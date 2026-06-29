/**
 * Turn System Configuration
 * Manages game turn mechanics for all systems including research
 * @tag #turn-system #core #configuration
 */

export const TURN_CONFIG = {
  // Turn generation
  TURNS_PER_MINUTE: 4,           // 3-5 game turns per minute
  TURN_INTERVAL_MS: 15000,       // Ms between turns (60000 / 4)
  
  // Offline turn cap
  MAX_OFFLINE_TURNS: 8640,       // 24 hours worth of turns @ 4/min
  
  // Turn affinity
  TURNS_BEFORE_DECAY: 3,         // Turns before turn bonus decay
  TURN_DECAY_FACTOR: 0.95,       // Multiplier applied per decay period
};

// Research progression per turn
export const RESEARCH_TURN_MECHANICS = {
  // Base research progression
  BASE_PROGRESS_PER_TURN: 1,            // Base progress % per turn
  
  // Speed calculation
  SPEED_SCALING: 1.5,                  // Bonus per speed multiplier tier
  
  // Minimum turns for research
  MIN_TURNS_FOR_RESEARCH: 5,           // Minimum turns required
  
  // Turn completion thresholds
  COMPLETION_THRESHOLD: 100,           // % needed to complete
  
  // Turn overflow (bonus to next research)
  ENABLE_OVERFLOW: true,               // Carry over progress to next research
  OVERFLOW_MULTIPLIER: 0.25,           // 25% of overflow carries forward
  
  // Turn pause/resume
  ALLOW_PAUSE: true,                  // Can pause research
  PAUSE_PENALTY: 0.05,                // 5% progress lost on pause
};

// Turn events that affect research
export const TURN_EVENT_EFFECTS = {
  research_acceleration: {
    name: 'Research Acceleration',
    turnsReduced: 0.5,                 // Reduce by 50% of remaining turns
    speedBoost: 1.25,                  // 25% speed boost
  },
  
  research_boost: {
    name: 'Research Boost Event',
    progressGain: 0.15,                // +15% progress instantly
    speedBoost: 1.1,                   // +10% speed for next turns
    duration: 10,                      // Boost lasts for 10 turns
  },
  
  research_penalty: {
    name: 'Research Penalty',
    progressLoss: 0.10,                // -10% progress
    speedPenalty: 0.8,                 // -20% speed
    duration: 5,                       // Penalty lasts for 5 turns
  },
  
  lab_malfunction: {
    name: 'Lab Malfunction',
    progressLoss: 0.20,                // -20% progress instantly
    speedPenalty: 0.5,                 // -50% speed temporarily
    duration: 3,                       // Effect lasts 3 turns
  },
};

// Turn-based bonuses
export const TURN_BONUSES = {
  // Streak bonuses (consecutive turns without pause)
  RESEARCH_STREAK: {
    turns: 10,                         // After X turns
    speedBonus: 1.05,                  // +5% speed bonus
    maxStreaks: 5,                     // Max 5 stacks
  },
  
  // Time-of-day bonuses
  daily_bonus: {
    hour: 0,                           // UTC hour for peak bonus
    speedBonus: 1.15,                  // +15% during peak hours
    duration: 3,                       // Hours of effect
  },
};

// Turn requirements for events
export const TURN_REQUIREMENTS = {
  // Research can only complete on these turn intervals
  COMPLETION_INTERVALS: {
    standard: 1,                       // Can complete any turn
    rare: 5,                           // Must wait every 5th turn
    epic: 10,                          // Must wait every 10th turn
  },
  
  // Turn locks (certain techs locked by turn count)
  TIER_UNLOCK_TURNS: {
    tier_1: 0,                         // Available immediately
    tier_2: 100,                       // After 100 turns
    tier_3: 500,                       // After 500 turns
    tier_4: 2000,                      // After 2000 turns
    tier_5: 10000,                     // After 10000 turns
  },
};

/**
 * Turn progression tracker
 * Tracks player turn count and generates new turns
 */
export interface PlayerTurns {
  totalTurnsGenerated: number;         // All-time turns created
  currentTurn: number;                 // Current active turn
  lastTurnTimestamp: number;           // Timestamp of last turn
  turnsAvailable: number;              // Unclaimed turns
  currentResearchTurns: number;        // Turns spent on current research
  researchTurnHistory: {
    techId: string;
    turnsSpent: number;
    completedTurns: number;
  }[];
}

/**
 * Research turn state
 * Per-research turn tracking
 */
export interface ResearchTurnState {
  queueItemId: string;
  techId: string;
  turnsStarted: number;               // Turn count when started
  turnsSpent: number;                 // Total turns invested
  turnsRemaining: number;             // Estimated remaining
  progressFromTurns: number;          // % complete from turns
  lastTurnProc: number;              // Timestamp of last turn progression
  speedMultiplier: number;            // Current speed (affects turns/progress)
  paused: boolean;
  pausedAt?: number;
  pauseProgressLoss: number;          // Loss from pausing
}

/**
 * Calculate turns needed for research
 * @param baseTurns Base turns required
 * @param speedMultiplier Player speed multiplier
 * @param labSpeedMod Lab speed modifier
 * @returns Adjusted turn count
 */
export function calculateTurnsForResearch(
  baseTurns: number,
  speedMultiplier: number,
  labSpeedMod: number
): number {
  const adjustedTurns = baseTurns / (speedMultiplier * labSpeedMod);
  return Math.max(RESEARCH_TURN_MECHANICS.MIN_TURNS_FOR_RESEARCH, Math.ceil(adjustedTurns));
}

/**
 * Calculate progress per turn
 * @param speedMultiplier Player speed multiplier
 * @returns Progress percentage per turn
 */
export function calculateProgressPerTurn(speedMultiplier: number): number {
  return RESEARCH_TURN_MECHANICS.BASE_PROGRESS_PER_TURN * speedMultiplier;
}

/**
 * Calculate available offline turns
 * @param lastTurnTime Timestamp of last turn
 * @returns Number of offline turns generated
 */
export function calculateOfflineTurns(lastTurnTime: number): number {
  const now = Date.now();
  const timeDiff = now - lastTurnTime;
  const generatedTurns = Math.floor(timeDiff / TURN_CONFIG.TURN_INTERVAL_MS);
  return Math.min(generatedTurns, TURN_CONFIG.MAX_OFFLINE_TURNS);
}

/**
 * Apply turn event effects
 * @param research Current research state
 * @param eventType Type of turn event
 * @returns Updated research state with event applied
 */
export function applyTurnEvent(
  research: any,
  eventType: keyof typeof TURN_EVENT_EFFECTS
): any {
  const effect = TURN_EVENT_EFFECTS[eventType];
  if (!effect) return research;
  
  const updated = { ...research };
  
  // Apply progress changes
  if ('progressGain' in effect) {
    updated.progressPercent = Math.min(100, updated.progressPercent + (effect.progressGain * 100));
  }
  if ('progressLoss' in effect) {
    updated.progressPercent = Math.max(0, updated.progressPercent - (effect.progressLoss * 100));
  }
  
  // Apply speed changes
  if ('speedBoost' in effect) {
    updated.modifiers = updated.modifiers || {};
    updated.modifiers.eventSpeedBoost = effect.speedBoost;
  }
  if ('speedPenalty' in effect) {
    updated.modifiers = updated.modifiers || {};
    updated.modifiers.eventPenalty = effect.speedPenalty;
  }
  
  return updated;
}

/**
 * Check if research can complete this turn
 * @param research Research item
 * @param currentTurn Current turn number
 * @returns true if research can complete
 */
export function canCompleteThisTurn(research: any, currentTurn: number): boolean {
  const turnValue = research.modifiers?.completionTurnValue || 1;
  return currentTurn % turnValue === 0;
}

export default {
  TURN_CONFIG,
  RESEARCH_TURN_MECHANICS,
  TURN_EVENT_EFFECTS,
  TURN_BONUSES,
  TURN_REQUIREMENTS,
  calculateTurnsForResearch,
  calculateProgressPerTurn,
  calculateOfflineTurns,
  applyTurnEvent,
  canCompleteThisTurn,
};
