import { useCallback, useEffect, useMemo, useState } from "react";
import { ARTIFACTS, Artifact, ArtifactRarity } from "@/lib/artifactData";

type TargetType = "artifact" | "relic";

type ActivityStatus = "idle" | "in_progress" | "completed";

export interface SystemArtifact extends Artifact {
  level: number;
  researchLevel: number;
  unlocked: boolean;
}

export interface SystemRelic {
  id: string;
  name: string;
  rarity: ArtifactRarity;
  description: string;
  bonuses: string[];
  level: number;
  researchLevel: number;
  condition: number;
  equipped: boolean;
  unlockCost: number;
}

export interface SystemResearch {
  id: string;
  targetType: TargetType;
  targetId: string;
  targetName: string;
  status: ActivityStatus;
  startedAt?: number;
  endsAt?: number;
  durationMinutes: number;
  cost: number;
}

export interface ArchaeologySite {
  id: string;
  name: string;
  difficulty: "low" | "medium" | "high";
  status: ActivityStatus;
  startedAt?: number;
  endsAt?: number;
  rewardPreview: string;
}

export interface RelicExpedition {
  id: string;
  name: string;
  targetType: TargetType;
  targetId: string;
  status: ActivityStatus;
  successChance: number;
  startedAt?: number;
  endsAt?: number;
  notes: string;
}

interface SystemResources {
  relicShards: number;
  relicEssence: number;
  researchData: number;
  archaeologyCrews: number;
}

interface SystemLogItem {
  id: string;
  timestamp: number;
  message: string;
}

interface ArtifactRelicState {
  resources: SystemResources;
  artifacts: SystemArtifact[];
  relics: SystemRelic[];
  research: SystemResearch[];
  sites: ArchaeologySite[];
  expeditions: RelicExpedition[];
  log: SystemLogItem[];
}

const STORAGE_KEY = "ued_artifact_relic_system_v1";

const initialRelics: SystemRelic[] = [
  {
    id: "relic_oracle_lens",
    name: "Oracle Lens",
    rarity: "rare",
    description: "Ancient lens that reveals hidden civilization signatures.",
    bonuses: ["+8% archaeology success", "+5% expedition scouting"],
    level: 1,
    researchLevel: 0,
    condition: 100,
    equipped: true,
    unlockCost: 0,
  },
  {
    id: "relic_singularity_spindle",
    name: "Singularity Spindle",
    rarity: "epic",
    description: "A gravity spindle used to stabilize dangerous dig zones.",
    bonuses: ["+12% relic shard yield", "+6% artifact upgrade efficiency"],
    level: 1,
    researchLevel: 0,
    condition: 100,
    equipped: false,
    unlockCost: 180,
  },
  {
    id: "relic_echo_core",
    name: "Echo Core",
    rarity: "legendary",
    description: "Resonance core that can reactivate dormant precursor vaults.",
    bonuses: ["+15% research data", "+10% expedition success"],
    level: 1,
    researchLevel: 0,
    condition: 100,
    equipped: false,
    unlockCost: 300,
  },
];

function createInitialState(): ArtifactRelicState {
  const artifacts: SystemArtifact[] = ARTIFACTS.map((artifact, index) => ({
    ...artifact,
    level: 1,
    researchLevel: 0,
    unlocked: index < 2,
  }));

  return {
    resources: {
      relicShards: 220,
      relicEssence: 140,
      researchData: 200,
      archaeologyCrews: 3,
    },
    artifacts,
    relics: initialRelics,
    research: [],
    sites: [
      {
        id: "site_shattered_orbit",
        name: "Shattered Orbit Vault",
        difficulty: "low",
        status: "idle",
        rewardPreview: "Shards + common artifact fragments",
      },
      {
        id: "site_helios_crypt",
        name: "Helios Crypt",
        difficulty: "medium",
        status: "idle",
        rewardPreview: "Essence + rare relic traces",
      },
      {
        id: "site_abyssal_archive",
        name: "Abyssal Archive",
        difficulty: "high",
        status: "idle",
        rewardPreview: "Research data + epic discoveries",
      },
    ],
    expeditions: [],
    log: [
      {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        message: "Artifact command initialized. Archaeology crews are awaiting orders.",
      },
    ],
  };
}

function rarityWeight(rarity: ArtifactRarity): number {
  switch (rarity) {
    case "common":
      return 1;
    case "uncommon":
      return 1.2;
    case "rare":
      return 1.45;
    case "epic":
      return 1.8;
    case "legendary":
      return 2.2;
    case "ancient":
      return 2.8;
    default:
      return 1;
  }
}

function addLog(state: ArtifactRelicState, message: string): ArtifactRelicState {
  const item: SystemLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    message,
  };

  return {
    ...state,
    log: [item, ...state.log].slice(0, 80),
  };
}

function withSync(state: ArtifactRelicState): ArtifactRelicState {
  const now = Date.now();
  let next = state;

  const activeResearch = next.research.find((research) => research.status === "in_progress");
  if (activeResearch?.endsAt && activeResearch.endsAt <= now) {
    if (activeResearch.targetType === "artifact") {
      next = {
        ...next,
        artifacts: next.artifacts.map((artifact) =>
          artifact.id === activeResearch.targetId
            ? { ...artifact, researchLevel: artifact.researchLevel + 1 }
            : artifact,
        ),
      };
    } else {
      next = {
        ...next,
        relics: next.relics.map((relic) =>
          relic.id === activeResearch.targetId
            ? { ...relic, researchLevel: relic.researchLevel + 1 }
            : relic,
        ),
      };
    }

    next = {
      ...next,
      research: next.research.map((research) =>
        research.id === activeResearch.id ? { ...research, status: "completed" } : research,
      ),
    };

    next = addLog(next, `Research completed: ${activeResearch.targetName}`);
  }

  const activeSites = next.sites.filter((site) => site.status === "in_progress" && site.endsAt && site.endsAt <= now);
  if (activeSites.length > 0) {
    for (const site of activeSites) {
      const siteBonus = site.difficulty === "low" ? 1 : site.difficulty === "medium" ? 1.5 : 2.1;
      next = {
        ...next,
        resources: {
          ...next.resources,
          relicShards: next.resources.relicShards + Math.floor(30 * siteBonus),
          relicEssence: next.resources.relicEssence + Math.floor(18 * siteBonus),
          researchData: next.resources.researchData + Math.floor(22 * siteBonus),
          archaeologyCrews: next.resources.archaeologyCrews + 1,
        },
      };

      if (Math.random() > 0.68) {
        const lockedArtifact = next.artifacts.find((artifact) => !artifact.unlocked);
        if (lockedArtifact) {
          next = {
            ...next,
            artifacts: next.artifacts.map((artifact) =>
              artifact.id === lockedArtifact.id ? { ...artifact, unlocked: true } : artifact,
            ),
          };
          next = addLog(next, `Archaeology breakthrough: ${lockedArtifact.name} blueprint recovered.`);
        }
      }

      next = addLog(next, `${site.name} excavation completed. Rewards delivered to artifact vault.`);
    }

    next = {
      ...next,
      sites: next.sites.map((site) =>
        activeSites.some((s) => s.id === site.id)
          ? { ...site, status: "completed", startedAt: undefined, endsAt: undefined }
          : site,
      ),
    };
  }

  const activeExpeditions = next.expeditions.filter((expedition) => expedition.status === "in_progress" && expedition.endsAt && expedition.endsAt <= now);
  if (activeExpeditions.length > 0) {
    for (const expedition of activeExpeditions) {
      const success = Math.random() <= expedition.successChance;
      if (success) {
        const shardGain = Math.floor(28 + expedition.successChance * 30);
        const essenceGain = Math.floor(12 + expedition.successChance * 20);
        next = {
          ...next,
          resources: {
            ...next.resources,
            relicShards: next.resources.relicShards + shardGain,
            relicEssence: next.resources.relicEssence + essenceGain,
            archaeologyCrews: next.resources.archaeologyCrews + 1,
          },
        };
        next = addLog(next, `${expedition.name} returned successfully with ${shardGain} shards and ${essenceGain} essence.`);
      } else {
        next = {
          ...next,
          resources: {
            ...next.resources,
            archaeologyCrews: next.resources.archaeologyCrews + 1,
          },
        };
        next = addLog(next, `${expedition.name} failed to secure findings. Crew returned with no artifacts.`);
      }
    }

    next = {
      ...next,
      expeditions: next.expeditions.map((expedition) =>
        activeExpeditions.some((active) => active.id === expedition.id)
          ? { ...expedition, status: "completed", startedAt: undefined, endsAt: undefined }
          : expedition,
      ),
    };
  }

  return next;
}

export function useArtifactRelicSystems() {
  const [state, setState] = useState<ArtifactRelicState>(() => {
    if (typeof window === "undefined") return createInitialState();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createInitialState();
      const parsed = JSON.parse(raw) as ArtifactRelicState;
      return withSync(parsed);
    } catch {
      return createInitialState();
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => withSync(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const upgradeArtifact = useCallback((artifactId: string) => {
    setState((prev) => {
      const artifact = prev.artifacts.find((item) => item.id === artifactId);
      if (!artifact || !artifact.unlocked) return prev;

      const cost = Math.floor(24 * artifact.level * rarityWeight(artifact.rarity));
      if (prev.resources.relicShards < cost) return addLog(prev, `Upgrade blocked: ${artifact.name} requires ${cost} relic shards.`);

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          relicShards: prev.resources.relicShards - cost,
        },
        artifacts: prev.artifacts.map((item) =>
          item.id === artifactId ? { ...item, level: item.level + 1 } : item,
        ),
      };

      next = addLog(next, `${artifact.name} upgraded to level ${artifact.level + 1}.`);
      return next;
    });
  }, []);

  const unlockRelic = useCallback((relicId: string) => {
    setState((prev) => {
      const relic = prev.relics.find((item) => item.id === relicId);
      if (!relic) return prev;
      if (relic.unlockCost <= 0) return prev;
      if (prev.resources.relicEssence < relic.unlockCost) {
        return addLog(prev, `Unlock blocked: ${relic.name} requires ${relic.unlockCost} relic essence.`);
      }

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          relicEssence: prev.resources.relicEssence - relic.unlockCost,
        },
        relics: prev.relics.map((item) =>
          item.id === relicId ? { ...item, unlockCost: 0 } : item,
        ),
      };

      next = addLog(next, `${relic.name} unlocked for relic operations.`);
      return next;
    });
  }, []);

  const upgradeRelic = useCallback((relicId: string) => {
    setState((prev) => {
      const relic = prev.relics.find((item) => item.id === relicId);
      if (!relic || relic.unlockCost > 0) return prev;

      const essenceCost = Math.floor(18 * relic.level * rarityWeight(relic.rarity));
      const shardCost = Math.floor(14 * relic.level * rarityWeight(relic.rarity));
      if (prev.resources.relicEssence < essenceCost || prev.resources.relicShards < shardCost) {
        return addLog(prev, `Upgrade blocked: ${relic.name} requires ${essenceCost} essence and ${shardCost} shards.`);
      }

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          relicEssence: prev.resources.relicEssence - essenceCost,
          relicShards: prev.resources.relicShards - shardCost,
        },
        relics: prev.relics.map((item) =>
          item.id === relicId
            ? { ...item, level: item.level + 1, condition: Math.min(100, item.condition + 4) }
            : item,
        ),
      };

      next = addLog(next, `${relic.name} upgraded to level ${relic.level + 1}.`);
      return next;
    });
  }, []);

  const startResearch = useCallback((targetType: TargetType, targetId: string) => {
    setState((prev) => {
      if (prev.research.some((research) => research.status === "in_progress")) {
        return addLog(prev, "Research bay occupied. Complete active research before starting another.");
      }

      const target = targetType === "artifact"
        ? prev.artifacts.find((item) => item.id === targetId)
        : prev.relics.find((item) => item.id === targetId);

      if (!target) return prev;

      const targetLevel = targetType === "artifact"
        ? (target as SystemArtifact).researchLevel
        : (target as SystemRelic).researchLevel;

      const cost = 60 + targetLevel * 35;
      if (prev.resources.researchData < cost) {
        return addLog(prev, `Research blocked: ${target.name} requires ${cost} research data.`);
      }

      const durationMinutes = 3 + targetLevel * 2;
      const now = Date.now();
      const project: SystemResearch = {
        id: `research-${now}-${Math.random().toString(36).slice(2, 7)}`,
        targetType,
        targetId,
        targetName: target.name,
        status: "in_progress",
        startedAt: now,
        endsAt: now + durationMinutes * 60 * 1000,
        durationMinutes,
        cost,
      };

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          researchData: prev.resources.researchData - cost,
        },
        research: [project, ...prev.research].slice(0, 25),
      };

      next = addLog(next, `Research started on ${target.name} (ETA ${durationMinutes}m).`);
      return next;
    });
  }, []);

  const startArchaeology = useCallback((siteId: string) => {
    setState((prev) => {
      const site = prev.sites.find((item) => item.id === siteId);
      if (!site || site.status === "in_progress") return prev;
      if (prev.resources.archaeologyCrews <= 0) {
        return addLog(prev, `Archaeology blocked: no available crews for ${site.name}.`);
      }

      const minutes = site.difficulty === "low" ? 4 : site.difficulty === "medium" ? 6 : 9;
      const now = Date.now();

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          archaeologyCrews: prev.resources.archaeologyCrews - 1,
        },
        sites: prev.sites.map((item) =>
          item.id === siteId
            ? {
                ...item,
                status: "in_progress" as ActivityStatus,
                startedAt: now,
                endsAt: now + minutes * 60 * 1000,
              }
            : item,
        ),
      };

      next = addLog(next, `Archaeology crew deployed to ${site.name}.`);
      return next;
    });
  }, []);

  const launchExpedition = useCallback((targetType: TargetType, targetId: string) => {
    setState((prev) => {
      if (prev.resources.archaeologyCrews <= 0) {
        return addLog(prev, "Expedition blocked: no available field crew.");
      }

      const target = targetType === "artifact"
        ? prev.artifacts.find((item) => item.id === targetId)
        : prev.relics.find((item) => item.id === targetId);

      if (!target) return prev;

      const modifier = targetType === "artifact"
        ? rarityWeight((target as SystemArtifact).rarity)
        : rarityWeight((target as SystemRelic).rarity);

      const expeditionMinutes = Math.max(3, Math.floor(8 - modifier));
      const successChance = Math.min(0.94, 0.52 + modifier * 0.14);
      const now = Date.now();
      const expedition: RelicExpedition = {
        id: `expedition-${now}-${Math.random().toString(36).slice(2, 8)}`,
        name: `${target.name} Recovery Operation`,
        targetType,
        targetId,
        status: "in_progress",
        successChance,
        startedAt: now,
        endsAt: now + expeditionMinutes * 60 * 1000,
        notes: `Specialized ${targetType} strike team searching nearby anomaly clusters.`,
      };

      let next = {
        ...prev,
        resources: {
          ...prev.resources,
          archaeologyCrews: prev.resources.archaeologyCrews - 1,
        },
        expeditions: [expedition, ...prev.expeditions].slice(0, 30),
      };

      next = addLog(next, `Expedition launched: ${expedition.name}.`);
      return next;
    });
  }, []);

  const resetSystems = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  const summary = useMemo(() => {
    const unlockedArtifacts = state.artifacts.filter((artifact) => artifact.unlocked);
    const unlockedRelics = state.relics.filter((relic) => relic.unlockCost <= 0);

    return {
      unlockedArtifacts: unlockedArtifacts.length,
      totalArtifacts: state.artifacts.length,
      unlockedRelics: unlockedRelics.length,
      totalRelics: state.relics.length,
      activeResearch: state.research.filter((research) => research.status === "in_progress").length,
      activeSites: state.sites.filter((site) => site.status === "in_progress").length,
      activeExpeditions: state.expeditions.filter((expedition) => expedition.status === "in_progress").length,
    };
  }, [state]);

  return {
    state,
    summary,
    upgradeArtifact,
    unlockRelic,
    upgradeRelic,
    startResearch,
    startArchaeology,
    launchExpedition,
    resetSystems,
  };
}
