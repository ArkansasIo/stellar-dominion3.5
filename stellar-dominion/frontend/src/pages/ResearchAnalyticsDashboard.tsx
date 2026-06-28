/**
 * Research Analytics Dashboard
 * Displays statistics, insights, and trends about research progress
 * @tag #research #analytics #ui #dashboard
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import './ResearchAnalyticsDashboard.css';

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
    queryFn: async () => {
      const response = await fetch('/api/research/xp/stats', { credentials: 'include' });
      return response.json();
    },
  });

  // Fetch discoveries
  const { data: discoveries, isLoading: discoveriesLoading } = useQuery({
    queryKey: ['research-discoveries'],
    queryFn: async () => {
      const response = await fetch('/api/research/discoveries?limit=20', { credentials: 'include' });
      const data = await response.json();
      return data.discoveries;
    },
  });

  // Fetch recommendations for insights
  const { data: recommendations } = useQuery({
    queryKey: ['research-recommendations'],
    queryFn: async () => {
      const response = await fetch('/api/research/recommendations?limit=3', { credentials: 'include' });
      const data = await response.json();
      return data.recommendations;
    },
  });

  // Fetch leaderboard for context
  const { data: leaderboard } = useQuery({
    queryKey: ['research-xp-leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/research/leaderboard?limit=10', { credentials: 'include' });
      const data = await response.json();
      return data.leaderboard;
    },
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
            <div className="tier-bar">
              <div className="bar-label">Basic</div>
              <div className="bar-fill" style={{ width: '40%' }} />
              <div className="bar-value">40%</div>
            </div>
            <div className="tier-bar">
              <div className="bar-label">Standard</div>
              <div className="bar-fill" style={{ width: '35%' }} />
              <div className="bar-value">35%</div>
            </div>
            <div className="tier-bar">
              <div className="bar-label">Advanced</div>
              <div className="bar-fill" style={{ width: '20%' }} />
              <div className="bar-value">20%</div>
            </div>
            <div className="tier-bar">
              <div className="bar-label">Military</div>
              <div className="bar-fill" style={{ width: '5%' }} />
              <div className="bar-value">5%</div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Research by Class</h3>
          <div className="chart-placeholder">
            <div className="class-bar">
              <div className="bar-label">Armor</div>
              <div className="bar-fill" style={{ width: '25%' }} />
              <div className="bar-value">25%</div>
            </div>
            <div className="class-bar">
              <div className="bar-label">Weapons</div>
              <div className="bar-fill" style={{ width: '25%' }} />
              <div className="bar-value">25%</div>
            </div>
            <div className="class-bar">
              <div className="bar-label">Shields</div>
              <div className="bar-fill" style={{ width: '20%' }} />
              <div className="bar-value">20%</div>
            </div>
            <div className="class-bar">
              <div className="bar-label">Other</div>
              <div className="bar-fill" style={{ width: '30%' }} />
              <div className="bar-value">30%</div>
            </div>
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
