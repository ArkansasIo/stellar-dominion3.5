import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Scale,
  TrendingUp,
  Lock,
  Star,
  Zap,
  AlertCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GovernmentNode {
  id: string;
  name: string;
  description: string;
  pillar: 'stability' | 'law' | 'economic';
  tier: number;
  requiredLevel: number;
  requiredPillarPoints: number;
  maxRank: number;
  icon: string;
  color: string;
  prerequisiteNodeIds: string[];
  effects: Record<string, number>;
}

interface GovernmentProgressionState {
  level: number;
  tier: number;
  totalXP: number;
  pillarPoints: Record<string, number>;
  unlockedNodes: string[];
  nodeRanks: Record<string, number>;
  activeEffects: Record<string, number>;
}

interface GovernmentStatus {
  progression: GovernmentProgressionState;
  availableNodes: GovernmentNode[];
  unlockedNodeDetails: GovernmentNode[];
  totalEffects: Record<string, number>;
}

const PILLAR_COLORS: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  stability: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: <Shield className="w-5 h-5" />,
  },
  law: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: <Scale className="w-5 h-5" />,
  },
  economic: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: <TrendingUp className="w-5 h-5" />,
  },
};

const GovernmentProgressionNode: React.FC<{
  node: GovernmentNode;
  isUnlocked: boolean;
  rank: number;
  canUnlock: boolean;
  onUnlock: (nodeId: string) => void;
  onRankUp: (nodeId: string) => void;
}> = ({ node, isUnlocked, rank, canUnlock, onUnlock, onRankUp }) => {
  const pillarInfo = PILLAR_COLORS[node.pillar];

  return (
    <Card
      className={cn(
        'h-full transition-all border-2',
        isUnlocked
          ? `${pillarInfo.border} ${pillarInfo.bg}`
          : 'border-dashed border-gray-300 bg-gray-50 opacity-60'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{node.icon}</span>
              <Badge variant="outline" className={pillarInfo.text}>
                {node.pillar}
              </Badge>
              {isUnlocked && (
                <Badge className="bg-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Rank {rank}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-orbitron">{node.name}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{node.description}</p>

        {!isUnlocked && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Level Requirements</span>
            </div>
            <div className="ml-6 space-y-1">
              <div>Requires Level: {node.requiredLevel}</div>
              <div>
                Requires {node.requiredPillarPoints} {node.pillar} points
              </div>
            </div>

            {node.prerequisiteNodeIds.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                Prerequisites: {node.prerequisiteNodeIds.length} node(s)
              </div>
            )}
          </div>
        )}

        {isUnlocked && (
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-gray-700">Node Effects:</div>
            <div className="space-y-1">
              {Object.entries(node.effects).map(
                ([key, value]) =>
                  value !== 0 && (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span
                        className={cn(
                          'font-mono font-bold',
                          value > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {value > 0 ? '+' : ''}{value.toFixed(2)}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex gap-2">
          {!isUnlocked && (
            <Button
              onClick={() => onUnlock(node.id)}
              disabled={!canUnlock}
              className="flex-1"
              size="sm"
              variant={canUnlock ? 'default' : 'secondary'}
            >
              {canUnlock ? 'Unlock' : 'Locked'}
            </Button>
          )}

          {isUnlocked && rank < node.maxRank && (
            <Button
              onClick={() => onRankUp(node.id)}
              className="flex-1"
              size="sm"
              variant="outline"
            >
              Rank Up ({rank}/{node.maxRank})
            </Button>
          )}

          {isUnlocked && rank >= node.maxRank && (
            <div className="flex-1 text-center py-2">
              <span className="text-xs font-semibold text-green-600">Max Rank</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PillarOverview: React.FC<{
  pillar: 'stability' | 'law' | 'economic';
  points: number;
  level: number;
  nodeCount: number;
}> = ({ pillar, points, level, nodeCount }) => {
  const pillarInfo = PILLAR_COLORS[pillar];

  return (
    <Card className={`${pillarInfo.border} ${pillarInfo.bg}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {pillarInfo.icon}
          {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs uppercase text-muted-foreground font-semibold mb-1">
            Pillar Level
          </div>
          <div className="text-3xl font-orbitron font-bold">{level}</div>
        </div>

        <div>
          <div className="text-xs uppercase text-muted-foreground font-semibold mb-1">
            Points Invested
          </div>
          <div className="text-2xl font-bold">{points}</div>
          <Progress value={(points % 100) / 100} className="mt-2 h-2" />
        </div>

        <div>
          <div className="text-xs uppercase text-muted-foreground font-semibold">
            Unlocked Nodes
          </div>
          <div className="text-xl font-bold">{nodeCount}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GovernmentProgressionTree() {
  const [status, setStatus] = useState<GovernmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<'stability' | 'law' | 'economic'>(
    'stability'
  );

  useEffect(() => {
    fetchGovernmentStatus();
    const interval = setInterval(fetchGovernmentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchGovernmentStatus = async () => {
    try {
      const response = await fetch('/api/government-progression/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch government progression:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockNode = async (nodeId: string) => {
    try {
      const response = await fetch('/api/government-progression/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, rank: 1 }),
      });
      if (response.ok) {
        await fetchGovernmentStatus();
      }
    } catch (error) {
      console.error('Failed to unlock node:', error);
    }
  };

  const handleRankUpNode = async (nodeId: string) => {
    try {
      const response = await fetch('/api/government-progression/rankup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });
      if (response.ok) {
        await fetchGovernmentStatus();
      }
    } catch (error) {
      console.error('Failed to rank up node:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Zap className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading government progression tree...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            Failed to Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load government progression data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredNodes = status.unlockedNodeDetails.filter(
    n => n.pillar === selectedPillar
  );
  const availableInPillar = status.availableNodes.filter(
    n => n.pillar === selectedPillar
  );
  const allPillarNodes = status.unlockedNodeDetails.filter(
    n => n.pillar === selectedPillar
  );

  const pillarStats = {
    stability: {
      points: status.progression.pillarPoints.stability || 0,
      level: Math.floor((status.progression.pillarPoints.stability || 0) / 50),
      unlocked: status.unlockedNodeDetails.filter(n => n.pillar === 'stability').length,
    },
    law: {
      points: status.progression.pillarPoints.law || 0,
      level: Math.floor((status.progression.pillarPoints.law || 0) / 50),
      unlocked: status.unlockedNodeDetails.filter(n => n.pillar === 'law').length,
    },
    economic: {
      points: status.progression.pillarPoints.economic || 0,
      level: Math.floor((status.progression.pillarPoints.economic || 0) / 50),
      unlocked: status.unlockedNodeDetails.filter(n => n.pillar === 'economic').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-orbitron font-bold text-slate-900">
          Government Progression Tree
        </h2>
        <p className="text-muted-foreground font-rajdhani text-lg mt-1">
          Unlock governance nodes in sequence to strengthen Stability, Law, and Economic Doctrine
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Government Level
          </CardTitle>
          <CardDescription>Progress through levels to unlock higher tier nodes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-orbitron font-bold">
                Level {status.progression.level}
              </div>
              <div className="text-sm text-muted-foreground">
                Tier {status.progression.tier}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {status.progression.totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>
          <Progress value={(status.progression.level / 100) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Pillar Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PillarOverview
          pillar="stability"
          points={pillarStats.stability.points}
          level={pillarStats.stability.level}
          nodeCount={pillarStats.stability.unlocked}
        />
        <PillarOverview
          pillar="law"
          points={pillarStats.law.points}
          level={pillarStats.law.level}
          nodeCount={pillarStats.law.unlocked}
        />
        <PillarOverview
          pillar="economic"
          points={pillarStats.economic.points}
          level={pillarStats.economic.level}
          nodeCount={pillarStats.economic.unlocked}
        />
      </div>

      {/* Pillar Nodes */}
      <Tabs value={selectedPillar} onValueChange={(value: any) => setSelectedPillar(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stability" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Stability
          </TabsTrigger>
          <TabsTrigger value="law" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Law
          </TabsTrigger>
          <TabsTrigger value="economic" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Economic
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPillar} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Nodes</CardTitle>
              <CardDescription>
                {availableInPillar.length > 0
                  ? `${availableInPillar.length} node(s) ready to unlock`
                  : 'All available nodes have been unlocked'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableInPillar.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Unlock more nodes by increasing your level or investing pillar points
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableInPillar.map(node => (
                    <GovernmentProgressionNode
                      key={node.id}
                      node={node}
                      isUnlocked={false}
                      rank={0}
                      canUnlock={true}
                      onUnlock={handleUnlockNode}
                      onRankUp={() => {}}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unlocked Nodes</CardTitle>
              <CardDescription>
                {filteredNodes.length} node(s) unlocked in this pillar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNodes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No nodes unlocked in this pillar yet
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNodes.map(node => (
                    <GovernmentProgressionNode
                      key={node.id}
                      node={node}
                      isUnlocked={true}
                      rank={status.progression.nodeRanks[node.id] || 1}
                      canUnlock={false}
                      onUnlock={() => {}}
                      onRankUp={handleRankUpNode}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Total Effects */}
      {Object.keys(status.totalEffects).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Total Active Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(status.totalEffects).map(([key, value]) => (
                <div key={key} className="p-3 border rounded-lg bg-slate-50">
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className={cn('text-xl font-bold font-mono', value > 0 ? 'text-green-600' : 'text-red-600')}>
                    {value > 0 ? '+' : ''}{value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
