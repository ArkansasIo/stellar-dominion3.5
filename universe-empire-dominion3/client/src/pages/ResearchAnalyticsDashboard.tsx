/**
 * Research Analytics Dashboard
 * Displays statistics, insights, and trends about research progress
 * @tag #research #analytics #ui #dashboard
 */

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Zap, Target, TrendingUp, Award, Compass, BarChart3, Rocket } from "lucide-react";
import "./ResearchAnalyticsDashboard.css";

type ResearchTechDetail = {
  id: string;
  class?: string;
  tier?: string;
};

type PlayerResearchProgress = {
  researchedTechs: string[];
};

type DiscoveryEntry = {
  id: string;
  discoveryType: string;
  xpGained: number;
  discoveredAt: string;
};

type RecommendationEntry = {
  id: string;
  name: string;
  class?: string;
  recommendationScore?: number;
};

type LeaderboardEntry = {
  totalXP: number;
};

type XpStatsResponse = {
  totalXP?: number;
  currentLevel?: number;
  researchesCompleted?: number;
  discoveryStreak?: number;
  xpProgress?: string | number;
  currentLevelXP?: number;
  nextLevelXP?: number;
};

type XpNextLevelInfo = {
  currentLevel: number;
  nextLevel: number;
  currentLevelXP: number;
  nextLevelXPNeeded: number;
  xpUntilNextLevel: number;
  percentToNextLevel: string;
};

type XpConfigResponse = {
  xpConfig: any;
  xpLevelConfig: any;
  discoveryTypes: Record<string, string>;
};

type StrategyAnalysis = {
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  overallScore?: number;
};

type ResearchPath = {
  steps?: { techId: string; name: string; prerequisites: string[] }[];
  totalSteps?: number;
  estimatedTurns?: number;
};

type OptimalQueue = {
  orderedTechIds?: string[];
  estimatedTotalTurns?: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload as T;
}

interface ResearchStats {
  totalXP: number;
  currentLevel: number;
  researchesCompleted: number;
  averageCompletionTime: number;
  mostActiveBranch: string;
  discoveryStreak: number;
}

export const ResearchAnalyticsDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [goalTechId, setGoalTechId] = useState("");
  const [queueTechIds, setQueueTechIds] = useState("");
  const [levelToCheck, setLevelToCheck] = useState("1");
  const [completeTechId, setCompleteTechId] = useState("");
  const [completeTier, setCompleteTier] = useState("Basic");
  const [completeClass, setCompleteClass] = useState("Military");
  const [completeTurns, setCompleteTurns] = useState("10");
  const { data: xpStats, isLoading: xpLoading } = useQuery<XpStatsResponse>({
    queryKey: ["research-xp-stats"],
    queryFn: () => fetchJson<XpStatsResponse>("/api/research/xp/stats"),
  });

  const { data: discoveries, isLoading: discoveriesLoading } = useQuery<DiscoveryEntry[]>({
    queryKey: ["research-discoveries"],
    queryFn: async () => {
      const data = await fetchJson<{ discoveries: DiscoveryEntry[] }>("/api/research/discoveries?limit=20");
      return data.discoveries;
    },
  });

  const { data: recommendations } = useQuery<RecommendationEntry[]>({
    queryKey: ["research-recommendations"],
    queryFn: async () => {
      const data = await fetchJson<{ recommendations: RecommendationEntry[] }>("/api/research/recommendations?limit=3");
      return data.recommendations;
    },
  });

  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ["research-xp-leaderboard"],
    queryFn: async () => {
      const data = await fetchJson<{ leaderboard: LeaderboardEntry[] }>("/api/research/leaderboard?limit=10");
      return data.leaderboard;
    },
  });

  const { data: progress } = useQuery<PlayerResearchProgress>({
    queryKey: ["research-player-progress"],
    queryFn: () => fetchJson<PlayerResearchProgress>("/api/research/player/progress"),
  });

  const { data: xpConfig } = useQuery<XpConfigResponse>({
    queryKey: ["research-xp-config"],
    queryFn: () => fetchJson<XpConfigResponse>("/api/research/xp/config"),
  });

  const { data: nextLevelInfo } = useQuery<XpNextLevelInfo>({
    queryKey: ["research-xp-next-level"],
    queryFn: () => fetchJson<XpNextLevelInfo>("/api/research/xp/next-level-info"),
    enabled: !!xpStats,
  });

  const { data: levelRewards } = useQuery<any>({
    queryKey: ["research-xp-level-rewards", levelToCheck],
    queryFn: () => fetchJson<any>(`/api/research/xp/level-rewards/${levelToCheck}`),
    enabled: !!levelToCheck,
  });

  const { data: strategyAnalysis } = useQuery<StrategyAnalysis>({
    queryKey: ["research-strategy"],
    queryFn: () => fetchJson<StrategyAnalysis>("/api/research/recommendations/strategy"),
  });

  const completeResearchMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/research/xp/complete-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techId: completeTechId,
          techTier: completeTier,
          techClass: completeClass,
          baseTurns: parseInt(completeTurns) || 10,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to complete research");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Research Complete", description: `Earned ${data.xpGained || 0} XP. Discovery: ${data.discovery ? "Yes!" : "No"}` });
      queryClient.invalidateQueries({ queryKey: ["research-xp-stats"] });
      queryClient.invalidateQueries({ queryKey: ["research-discoveries"] });
      setCompleteTechId("");
    },
    onError: (err: any) => {
      toast({ title: "Research Failed", description: err.message, variant: "destructive" });
    },
  });

  const researchPathMutation = useMutation({
    mutationFn: async (goalTechId: string) => {
      const res = await fetch("/api/research/recommendations/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalTechId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get research path");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Research Path Calculated", description: `${data.totalSteps || 0} steps, ~${data.estimatedTurns || 0} turns` });
    },
    onError: (err: any) => {
      toast({ title: "Path Calculation Failed", description: err.message, variant: "destructive" });
    },
  });

  const optimizeQueueMutation = useMutation({
    mutationFn: async (techIds: string[]) => {
      const res = await fetch("/api/research/recommendations/optimize-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techIds }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to optimize queue");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Queue Optimized", description: `${data.orderedTechIds?.length || 0} techs ordered, ~${data.estimatedTotalTurns || 0} total turns` });
    },
    onError: (err: any) => {
      toast({ title: "Optimization Failed", description: err.message, variant: "destructive" });
    },
  });

  const researchedTechIds = progress?.researchedTechs || [];

  const { data: researchedTechDetails } = useQuery<ResearchTechDetail[]>({
    queryKey: ["research-tech-details", researchedTechIds],
    queryFn: async () => {
      const details = await Promise.all(
        researchedTechIds.slice(0, 75).map((techId) =>
          fetchJson<ResearchTechDetail>(`/api/research/tech/${encodeURIComponent(techId)}`).catch(() => null)
        )
      );
      return details.filter((item): item is ResearchTechDetail => Boolean(item));
    },
    enabled: researchedTechIds.length > 0,
  });

  const analytics = useMemo(() => {
    if (!xpStats) return null;

    const stats: ResearchStats = {
      totalXP: xpStats.totalXP || 0,
      currentLevel: xpStats.currentLevel || 1,
      researchesCompleted: xpStats.researchesCompleted || 0,
      averageCompletionTime: 0,
      mostActiveBranch: "Unknown",
      discoveryStreak: xpStats.discoveryStreak || 0,
    };

    if (stats.researchesCompleted > 0) {
      stats.averageCompletionTime = Math.round(stats.totalXP / stats.researchesCompleted / 100);
    }

    return stats;
  }, [xpStats]);

  const levelProgress = useMemo(() => {
    if (!xpStats) return 0;
    return parseFloat(String(xpStats.xpProgress || 0)) || 0;
  }, [xpStats]);

  const playerRank = useMemo(() => {
    if (!leaderboard || !xpStats) return "Unknown";
    const rank = leaderboard.findIndex((entry) => entry.totalXP <= (xpStats.totalXP || 0));
    return rank === -1 ? leaderboard.length + 1 : rank + 1;
  }, [leaderboard, xpStats]);

  const tierDistribution = useMemo(() => {
    const labels = ["Basic", "Standard", "Advanced", "Military"];
    const source = researchedTechDetails || [];
    const total = source.length || 1;

    const counts = source.reduce((acc, tech) => {
      const rawTier = String(tech.tier || "").toLowerCase();
      const tier = rawTier.includes("military")
        ? "Military"
        : rawTier.includes("advanced")
          ? "Advanced"
          : rawTier.includes("standard")
            ? "Standard"
            : "Basic";
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return labels.map((label) => {
      const count = counts[label] || 0;
      const percentage = Math.round((count / total) * 100);
      return { label, count, percentage };
    });
  }, [researchedTechDetails]);

  const classDistribution = useMemo(() => {
    const source = researchedTechDetails || [];
    const total = source.length || 1;
    const counts = source.reduce((acc, tech) => {
      const key = String(tech.class || "Other").trim() || "Other";
      const normalized = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      acc[normalized] = (acc[normalized] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([label, count]) => ({
        label,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 6);
  }, [researchedTechDetails]);

  if (xpLoading || !analytics) {
    return (
      <GameLayout>
        <div className="rounded-2xl border border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-6 text-[var(--sd-text-secondary)] shadow-sm">
          Loading analytics...
        </div>
      </GameLayout>
    );
  }

  const currentLevel = xpStats?.currentLevel || analytics.currentLevel;
  const currentLevelXP = xpStats?.currentLevelXP || 0;
  const nextLevelXP = xpStats?.nextLevelXP || 0;

  return (
    <GameLayout>
      <div className="research-analytics-dashboard">
        <h2>Research Analytics</h2>

        <div className="analytics-grid stats-section">
          <div className="stat-card">
            <div className="stat-label">Total XP</div>
            <div className="stat-value">{analytics.totalXP.toLocaleString()}</div>
            <div className="stat-subtext">Experience accumulated</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Level</div>
            <div className="stat-value">{analytics.currentLevel}</div>
            <div className="stat-subtext">Research mastery level</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{analytics.researchesCompleted}</div>
            <div className="stat-subtext">Technologies researched</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Rank</div>
            <div className="stat-value">#{playerRank}</div>
            <div className="stat-subtext">Global leaderboard</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{analytics.discoveryStreak}</div>
            <div className="stat-subtext">Discovery streak</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Avg Time</div>
            <div className="stat-value">{analytics.averageCompletionTime}h</div>
            <div className="stat-subtext">Per technology</div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Level {nextLevelInfo?.currentLevel || currentLevel} → {nextLevelInfo?.nextLevel || currentLevel + 1}</span>
            <span className="progress-text">{nextLevelInfo?.percentToNextLevel || levelProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${parseFloat(nextLevelInfo?.percentToNextLevel || String(levelProgress))}%` }} />
          </div>
          <div className="progress-footer">
            {nextLevelInfo?.currentLevelXP || currentLevelXP} / {nextLevelInfo?.nextLevelXPNeeded || nextLevelXP} XP
            {nextLevelInfo?.xpUntilNextLevel !== undefined && (
              <span className="ml-2 text-xs opacity-70">({nextLevelInfo.xpUntilNextLevel} XP remaining)</span>
            )}
          </div>
        </div>

        <div className="discoveries-section">
          <h3>Recent Discoveries</h3>
          {discoveriesLoading ? (
            <div className="loading">Loading discoveries...</div>
          ) : discoveries && discoveries.length > 0 ? (
            <div className="discoveries-list">
              {discoveries.slice(0, 5).map((discovery) => (
                <div key={discovery.id} className="discovery-item">
                  <div className="discovery-type">{discovery.discoveryType}</div>
                  <div className="discovery-xp">+{discovery.xpGained} XP</div>
                  <div className="discovery-time">
                    {new Date(discovery.discoveredAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No discoveries yet</div>
          )}
        </div>

        <div className="recommendations-section">
          <h3>Recommended Research</h3>
          {recommendations && recommendations.length > 0 ? (
            <div className="recommendations-list">
              {recommendations.slice(0, 3).map((tech) => (
                <div key={tech.id} className="recommendation-item">
                  <div className="rec-name">{tech.name}</div>
                  <div className="rec-score">Score: {tech.recommendationScore?.toFixed(0)}</div>
                  <div className="rec-class">{tech.class}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No recommendations available</div>
          )}
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h3>Tier Distribution</h3>
            <div className="chart-placeholder">
              {tierDistribution.map((entry) => (
                <div key={entry.label} className="tier-bar">
                  <div className="bar-label">{entry.label}</div>
                  <div className="bar-fill" style={{ width: `${entry.percentage}%` }} />
                  <div className="bar-value">{entry.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <h3>Research by Class</h3>
            <div className="chart-placeholder">
              {(classDistribution.length > 0 ? classDistribution : [{ label: "Other", count: 0, percentage: 0 }]).map((entry) => (
                <div key={entry.label} className="class-bar">
                  <div className="bar-label">{entry.label}</div>
                  <div className="bar-fill" style={{ width: `${entry.percentage}%` }} />
                  <div className="bar-value">{entry.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research XP Tools */}
        <div className="analytics-grid" style={{ gap: "16px", marginTop: "20px" }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="w-4 h-4" /> Complete Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Tech ID" value={completeTechId} onChange={(e) => setCompleteTechId(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <select value={completeTier} onChange={(e) => setCompleteTier(e.target.value)} className="border rounded p-1.5 text-sm">
                  <option>Basic</option><option>Standard</option><option>Advanced</option><option>Military</option>
                </select>
                <select value={completeClass} onChange={(e) => setCompleteClass(e.target.value)} className="border rounded p-1.5 text-sm">
                  <option>Military</option><option>Civilian</option><option>Science</option><option>Engineering</option>
                </select>
                <Input type="number" placeholder="Turns" value={completeTurns} onChange={(e) => setCompleteTurns(e.target.value)} />
              </div>
              <Button onClick={() => completeResearchMutation.mutate()} disabled={!completeTechId || completeResearchMutation.isPending} className="w-full">
                <Zap className="w-4 h-4 mr-2" /> Complete & Earn XP
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="w-4 h-4" /> Level Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input type="number" placeholder="Level" value={levelToCheck} onChange={(e) => setLevelToCheck(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["research-xp-level-rewards"] })}>
                  Check
                </Button>
              </div>
              {levelRewards?.rewards && (
                <div className="text-sm space-y-1">
                  {levelRewards.rewards.bonusXP && <div>Bonus XP: <strong>{levelRewards.rewards.bonusXP}</strong></div>}
                  {levelRewards.rewards.title && <div>Title: <strong>{levelRewards.rewards.title}</strong></div>}
                  {levelRewards.rewards.unlock && <div>Unlock: <strong>{levelRewards.rewards.unlock}</strong></div>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Compass className="w-4 h-4" /> Research Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Goal Tech ID" value={goalTechId} onChange={(e) => setGoalTechId(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={() => goalTechId && researchPathMutation.mutate(goalTechId)} disabled={!goalTechId || researchPathMutation.isPending}>
                  Calculate
                </Button>
              </div>
              {researchPathMutation.data && (
                <div className="text-sm space-y-1">
                  <div>Steps: <strong>{researchPathMutation.data.totalSteps || 0}</strong></div>
                  <div>Est. Turns: <strong>{researchPathMutation.data.estimatedTurns || 0}</strong></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-4 h-4" /> Optimize Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Tech IDs (comma separated)" value={queueTechIds} onChange={(e) => setQueueTechIds(e.target.value)} />
              <Button onClick={() => {
                const ids = queueTechIds.split(",").map(s => s.trim()).filter(Boolean);
                if (ids.length > 0) optimizeQueueMutation.mutate(ids);
              }} disabled={!queueTechIds || optimizeQueueMutation.isPending} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" /> Optimize Order
              </Button>
              {optimizeQueueMutation.data && (
                <div className="text-sm space-y-1">
                  <div>Optimal Order: <strong>{optimizeQueueMutation.data.orderedTechIds?.join(", ") || "N/A"}</strong></div>
                  <div>Total Turns: <strong>{optimizeQueueMutation.data.estimatedTotalTurns || 0}</strong></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Strategy Analysis */}
        {strategyAnalysis && (
          <div className="analytics-grid" style={{ gap: "16px", marginTop: "20px" }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4" /> Strategy Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strategyAnalysis.overallScore !== undefined && (
                  <div className="text-center p-3 bg-slate-50 rounded">
                    <div className="text-2xl font-bold">{strategyAnalysis.overallScore}</div>
                    <div className="text-xs text-slate-500">Overall Score</div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="font-semibold text-green-700 mb-1">Strengths</div>
                    {(strategyAnalysis.strengths || []).map((s, i) => (
                      <div key={i} className="text-xs p-1.5 bg-green-50 rounded mb-1">{s}</div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-red-700 mb-1">Weaknesses</div>
                    {(strategyAnalysis.weaknesses || []).map((w, i) => (
                      <div key={i} className="text-xs p-1.5 bg-red-50 rounded mb-1">{w}</div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-blue-700 mb-1">Recommendations</div>
                    {(strategyAnalysis.recommendations || []).map((r, i) => (
                      <div key={i} className="text-xs p-1.5 bg-blue-50 rounded mb-1">{r}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* XP Config Info */}
        {xpConfig && (
          <div className="analytics-grid" style={{ gap: "16px", marginTop: "20px" }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4" /> XP Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {xpConfig.xpLevelConfig && (
                    <>
                      <div className="p-2 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Max Level</div>
                        <div className="font-bold">{xpConfig.xpLevelConfig.MAX_LEVEL || "N/A"}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Base XP</div>
                        <div className="font-bold">{xpConfig.xpLevelConfig.BASE_XP || "N/A"}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Growth Rate</div>
                        <div className="font-bold">{xpConfig.xpLevelConfig.GROWTH_RATE || "N/A"}</div>
                      </div>
                    </>
                  )}
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500">Discovery Types</div>
                    <div className="font-bold">{Object.keys(xpConfig.discoveryTypes || {}).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="insights-section">
          <h3>Insights</h3>
          <div className="insights-list">
            <div className="insight">
              <span className="insight-icon">*</span>
              <span>You're on a {analytics.discoveryStreak}-discovery streak!</span>
            </div>
            <div className="insight">
              <span className="insight-icon">+</span>
              <span>Specializing in armor and weapons technologies</span>
            </div>
            <div className="insight">
              <span className="insight-icon">&gt;</span>
              <span>Average research time: {analytics.averageCompletionTime} hours</span>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default ResearchAnalyticsDashboard;
