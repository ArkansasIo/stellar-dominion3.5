export type ResearchLabDomain = "military" | "government" | "civilian" | "scientific" | "industrial";

export interface ResearchLabAdminInput {
  labLevel: number;
  queueLength: number;
  speedMultiplier: number;
  durabilityPercent: number;
  activeBonusCount: number;
}

export interface ResearchLabAdminScore {
  throughput: number;
  stability: number;
  efficiency: number;
  governance: number;
  total: number;
}

export interface ResearchLabAdministrationState {
  score: ResearchLabAdminScore;
  domainCapacity: Record<ResearchLabDomain, number>;
  recommendations: string[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(input: ResearchLabAdminInput): Required<ResearchLabAdminInput> {
  return {
    labLevel: Math.max(1, Math.floor(input.labLevel || 1)),
    queueLength: Math.max(0, Math.floor(input.queueLength || 0)),
    speedMultiplier: Math.max(0.1, Number(input.speedMultiplier || 1)),
    durabilityPercent: clamp(Number(input.durabilityPercent || 0), 0, 100),
    activeBonusCount: Math.max(0, Math.floor(input.activeBonusCount || 0)),
  };
}

export function calculateResearchLabAdminScore(input: ResearchLabAdminInput): ResearchLabAdminScore {
  const normalized = normalize(input);

  const throughput = clamp(
    20 + normalized.labLevel * 2 + normalized.speedMultiplier * 18 + normalized.activeBonusCount * 3 - normalized.queueLength * 0.7,
    0,
    100,
  );

  const stability = clamp(
    15 + normalized.durabilityPercent * 0.85 + normalized.labLevel * 0.8 - Math.max(0, normalized.queueLength - 8) * 1.2,
    0,
    100,
  );

  const efficiency = clamp(
    18 + normalized.speedMultiplier * 26 + normalized.activeBonusCount * 4 - normalized.queueLength * 0.6,
    0,
    100,
  );

  const governance = clamp(
    25 + normalized.labLevel * 1.4 + normalized.durabilityPercent * 0.45 + normalized.activeBonusCount * 2.5,
    0,
    100,
  );

  const total = clamp(Math.round((throughput + stability + efficiency + governance) / 4), 0, 100);

  return {
    throughput: Math.round(throughput),
    stability: Math.round(stability),
    efficiency: Math.round(efficiency),
    governance: Math.round(governance),
    total,
  };
}

export function calculateResearchLabDomainCapacity(input: ResearchLabAdminInput): Record<ResearchLabDomain, number> {
  const normalized = normalize(input);
  const base = normalized.labLevel * 12 + normalized.activeBonusCount * 4 + normalized.speedMultiplier * 20;

  return {
    military: Math.max(0, Math.round(base * 0.95 + normalized.durabilityPercent * 0.12)),
    government: Math.max(0, Math.round(base * 0.75 + normalized.durabilityPercent * 0.2)),
    civilian: Math.max(0, Math.round(base * 0.88 + normalized.durabilityPercent * 0.16)),
    scientific: Math.max(0, Math.round(base * 1.2 + normalized.durabilityPercent * 0.1)),
    industrial: Math.max(0, Math.round(base * 0.9 + normalized.durabilityPercent * 0.14)),
  };
}

export function buildResearchLabAdministrationState(input: ResearchLabAdminInput): ResearchLabAdministrationState {
  const score = calculateResearchLabAdminScore(input);
  const domainCapacity = calculateResearchLabDomainCapacity(input);

  const recommendations: string[] = [];
  if (score.stability < 60) {
    recommendations.push("Increase lab durability support before scaling queue depth.");
  }
  if (score.throughput < 65) {
    recommendations.push("Raise active speed bonuses or reduce low-priority queue items.");
  }
  if (score.governance < 70) {
    recommendations.push("Allocate more government oversight personnel to administration tracks.");
  }
  if (score.efficiency >= 80 && score.stability >= 80) {
    recommendations.push("Lab administration is optimized; authorize advanced multi-domain cloning programs.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Administration baseline is stable. Maintain current queue and staffing balance.");
  }

  return {
    score,
    domainCapacity,
    recommendations,
  };
}
