/**
 * Research Analytics Dashboard
 * Displays statistics, insights, and trends about research progress
 * @tag #research #analytics #ui #dashboard
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import './ResearchAnalyticsDashboard.css';

type ResearchTechDetail = {
  id: string;
  class?: string;
  tier?: string;
};

type PlayerResearchProgress = {
  researchedTechs: string[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: 'include' });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Request failed');
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
  // Fetch research stats
  const { data: xpStats, isLoading: xpLoading } = useQuery({
    queryKey: ['research-xp-stats'],
    queryFn: () => fetchJson<any>('/api/research/xp/stats'),
  });

  // Fetch discoveries
  const { data: discoveries, isLoading: discoveriesLoading } = useQuery({
    queryKey: ['research-discoveries'],
    queryFn: async () => {
      const data = await fetchJson<{ discoveries: any[] }>('/api/research/discoveries?limit=20');
      return data.discoveries;
    },
  });

  // Fetch recommendations for insights
  const { data: recommendations } = useQuery({
    queryKey: ['research-recommendations'],
    queryFn: async () => {
      const data = await fetchJson<{ recommendations: any[] }>('/api/research/recommendations?limit=3');
      return data.recommendations;
    },
  });

  // Fetch leaderboard for context
  const { data: leaderboard } = useQuery({
    queryKey: ['research-xp-leaderboard'],
    queryFn: async () => {
      const data = await fetchJson<{ leaderboard: any[] }>('/api/research/leaderboard?limit=10');
      return data.leaderboard;
    },
  });

  const { data: progress } = useQuery<PlayerResearchProgress>({
    queryKey: ['research-player-progress'],
    queryFn: () => fetchJson<PlayerResearchProgress>('/api/research/player/progress'),
  });

  const researchedTechIds = progress?.researchedTechs || [];

  const { data: researchedTechDetails } = useQuery<ResearchTechDetail[]>({
    queryKey: ['research-tech-details', researchedTechIds],
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

  // Calculate analytics
  const analytics = useMemo(() => {
    if (!xpStats) return null;

    const stats: ResearchStats = {
      totalXP: xpStats.totalXP || 0,
      currentLevel: xpStats.currentLevel || 1,
      researchesCompleted: xpStats.researchesCompleted || 0,
      averageCompletionTime: 0,
      mostActiveBranch: 'Unknown',
      discoveryStreak: xpStats.discoveryStreak || 0,
    };

    if (stats.researchesCompleted > 0) {
      stats.averageCompletionTime = Math.round(stats.totalXP / stats.researchesCompleted / 100);
    }

    return stats;
  }, [xpStats]);

  // Calculate level progress
  const levelProgress = useMemo(() => {
    if (!xpStats) return 0;
    return parseFloat(xpStats.xpProgress) || 0;
  }, [xpStats]);

  // Find player rank
  const playerRank = useMemo(() => {
    if (!leaderboard || !xpStats) return 'Unknown';
    const rank = leaderboard.findIndex(
      (entry: any) => entry.totalXP <= xpStats.totalXP
    );
    return rank === -1 ? leaderboard.length + 1 : rank + 1;
  }, [leaderboard, xpStats]);

  const tierDistribution = useMemo(() => {
    const labels = ['Basic', 'Standard', 'Advanced', 'Military'];
    const source = researchedTechDetails || [];
    const total = source.length || 1;

    const counts = source.reduce((acc, tech) => {
      const rawTier = String(tech.tier || '').toLowerCase();
      const tier = rawTier.includes('military')
        ? 'Military'
        : rawTier.includes('advanced')
        ? 'Advanced'
        : rawTier.includes('standard')
        ? 'Standard'
        : 'Basic';
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
      const key = String(tech.class || 'Other').trim() || 'Other';
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
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="research-analytics-dashboard">
      <h2>Research Analytics</h2>

      {/* Stats Overview */}
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

      {/* Level Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Level {xpStats.currentLevel} Progress</span>
          <span className="progress-text">{levelProgress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
        </div>
        <div className="progress-footer">
          {xpStats.currentLevelXP} / {xpStats.nextLevelXP} XP
        </div>
      </div>

      {/* Recent Discoveries */}
      <div className="discoveries-section">
        <h3>Recent Discoveries</h3>
        {discoveriesLoading ? (
          <div className="loading">Loading discoveries...</div>
        ) : discoveries && discoveries.length > 0 ? (
          <div className="discoveries-list">
            {discoveries.slice(0, 5).map((discovery: any) => (
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

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>Recommended Research</h3>
        {recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.slice(0, 3).map((tech: any) => (
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

      {/* Charts */}
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
            {(classDistribution.length > 0 ? classDistribution : [{ label: 'Other', count: 0, percentage: 0 }]).map((entry) => (
              <div key={entry.label} className="class-bar">
                <div className="bar-label">{entry.label}</div>
                <div className="bar-fill" style={{ width: `${entry.percentage}%` }} />
                <div className="bar-value">{entry.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3>Insights</h3>
        <div className="insights-list">
          <div className="insight">
            <span className="insight-icon">⭐</span>
            <span>You're on a {analytics.discoveryStreak}-discovery streak!</span>
          </div>
          <div className="insight">
            <span className="insight-icon">🎯</span>
            <span>Specializing in armor and weapons technologies</span>
          </div>
          <div className="insight">
            <span className="insight-icon">🚀</span>
            <span>Average research time: {analytics.averageCompletionTime} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalyticsDashboard;
