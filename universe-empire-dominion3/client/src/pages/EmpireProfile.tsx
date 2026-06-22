import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Swords, Coins, FlaskConical, Factory, Handshake, Eye, Compass, Landmark, Lightbulb,
  Crown, TrendingUp, Zap, Award, ChevronUp, ChevronDown, Edit3, Shield, Star,
  BarChart3, GitBranch, Target, BookOpen, Users, Globe,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, any> = {
  Swords, Coins, FlaskConical, Factory, Handshake, Eye, Compass, Landmark, Lightbulb,
};

const ATTRIBUTE_DESCRIPTIONS: Record<string, { description: string; benefits: string[]; synergies: string[] }> = {
  military: {
    description: "Military prowess determines your empire's combat effectiveness and defensive capabilities.",
    benefits: [
      "Increases fleet combat damage by 2% per level",
      "Improves planetary defense effectiveness by 3% per level",
      "Unlocks advanced military technologies at higher levels",
      "Reduces ship construction time by 1% per level",
    ],
    synergies: ["Industry", "Research", "Governance"],
  },
  economy: {
    description: "Economic strength drives resource generation and trade efficiency across your empire.",
    benefits: [
      "Increases resource production by 3% per level",
      "Improves market trade ratios by 2% per level",
      "Reduces construction costs by 1% per level",
      "Unlocks advanced economic policies at higher levels",
    ],
    synergies: ["Industry", "Diplomacy", "Innovation"],
  },
  research: {
    description: "Research capability accelerates technology development and scientific advancement.",
    benefits: [
      "Increases research speed by 4% per level",
      "Reduces technology costs by 2% per level",
      "Unlocks exclusive research branches at higher levels",
      "Improves lab efficiency by 3% per level",
    ],
    synergies: ["Innovation", "Industry", "Exploration"],
  },
  industry: {
    description: "Industrial capacity determines production throughput and infrastructure development.",
    benefits: [
      "Increases factory output by 3% per level",
      "Reduces build times by 2% per level",
      "Improves refinery efficiency by 2% per level",
      "Unlocks advanced production chains at higher levels",
    ],
    synergies: ["Economy", "Research", "Military"],
  },
  diplomacy: {
    description: "Diplomatic skill enhances alliance capabilities and inter-empire relations.",
    benefits: [
      "Improves alliance bonuses by 5% per level",
      "Increases trade deal value by 3% per level",
      "Reduces diplomatic action cooldowns by 2% per level",
      "Unlocks advanced diplomatic options at higher levels",
    ],
    synergies: ["Economy", "Governance", "Espionage"],
  },
  espionage: {
    description: "Espionage capability enables intelligence gathering and covert operations.",
    benefits: [
      "Increases scan success rate by 3% per level",
      "Reduces detection risk by 2% per level",
      "Unlocks advanced espionage missions at higher levels",
      "Improves intelligence gathering speed by 4% per level",
    ],
    synergies: ["Military", "Diplomacy", "Exploration"],
  },
  exploration: {
    description: "Exploration prowess expands your empire's reach and discovery capabilities.",
    benefits: [
      "Increases exploration speed by 3% per level",
      "Improves anomaly discovery rate by 4% per level",
      "Reduces travel time by 1% per level",
      "Unlocks exclusive exploration paths at higher levels",
    ],
    synergies: ["Research", "Espionage", "Innovation"],
  },
  governance: {
    description: "Governance effectiveness improves empire management and policy implementation.",
    benefits: [
      "Increases colony stability by 2% per level",
      "Improves population happiness by 3% per level",
      "Reduces corruption by 2% per level",
      "Unlocks advanced governance policies at higher levels",
    ],
    synergies: ["Diplomacy", "Military", "Economy"],
  },
  innovation: {
    description: "Innovation drives technological breakthroughs and unique capability unlocks.",
    benefits: [
      "Increases rare technology discovery by 5% per level",
      "Improves blueprint research speed by 3% per level",
      "Unlocks exclusive innovation paths at higher levels",
      "Increases chance of critical research breakthroughs by 2% per level",
    ],
    synergies: ["Research", "Exploration", "Economy"],
  },
};

interface EmpireAttribute {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effects: Array<{ type: string; target: string; value: number; description: string }>;
}

interface EmpireProfile {
  [key: string]: any;
  id: string;
  userId: string;
  military: number;
  economy: number;
  research: number;
  industry: number;
  diplomacy: number;
  espionage: number;
  exploration: number;
  governance: number;
  innovation: number;
  attributePoints: Record<string, number>;
  availablePoints: number;
  totalPointsEarned: number;
  empireName: string | null;
  empireTitle: string | null;
  powerRating: number;
}

const DEFAULT_PROFILE: EmpireProfile = {
  id: "",
  userId: "",
  military: 1,
  economy: 1,
  research: 1,
  industry: 1,
  diplomacy: 1,
  espionage: 1,
  exploration: 1,
  governance: 1,
  innovation: 1,
  attributePoints: { military: 0, economy: 0, research: 0, industry: 0, diplomacy: 0, espionage: 0, exploration: 0, governance: 0, innovation: 0 },
  availablePoints: 0,
  totalPointsEarned: 0,
  empireName: null,
  empireTitle: null,
  powerRating: 0,
};

function calculateCost(level: number, baseCost: number, multiplier: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

function getOverallLevel(p: EmpireProfile): number {
  const attrs = [p.military, p.economy, p.research, p.industry,
    p.diplomacy, p.espionage, p.exploration, p.governance, p.innovation];
  return Math.floor(attrs.reduce((a, b) => a + b, 0) / attrs.length);
}

function getTierName(level: number): string {
  if (level >= 90) return "Universal Sovereign";
  if (level >= 75) return "Galactic Overlord";
  if (level >= 60) return "Interstellar Lord";
  if (level >= 45) return "Planetary Ruler";
  if (level >= 30) return "Colonial Pioneer";
  if (level >= 15) return "Expander";
  return "Rising Empire";
}

function AttributeCard({
  attr,
  level,
  pointsSpent,
  availablePoints,
  onAllocate,
  isAllocating,
}: {
  attr: EmpireAttribute;
  level: number;
  pointsSpent: number;
  availablePoints: number;
  onAllocate: (attr: string, points: number) => void;
  isAllocating: boolean;
}) {
  const [allocAmount, setAllocAmount] = useState(1);
  const totalCost = Array.from({ length: allocAmount }, (_, i) =>
    calculateCost(level + i, attr.baseCost, attr.costMultiplier)
  ).reduce((a, b) => a + b, 0);
  const canAfford = availablePoints >= totalCost && level + allocAmount <= attr.maxLevel;
  const IconComponent = ICON_MAP[attr.icon] || Swords;
  const progress = (level / attr.maxLevel) * 100;

  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute inset-0 opacity-5", attr.color.replace("text-", "bg-"))} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-slate-100", attr.color)}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">{attr.name}</CardTitle>
              <CardDescription className="text-xs">Lv.{level} / {attr.maxLevel}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {pointsSpent.toLocaleString()} pts spent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground leading-relaxed">{attr.description}</p>

        <div className="space-y-1">
          {attr.effects.map((effect, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-muted-foreground">{effect.description}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllocAmount(Math.max(1, allocAmount - 1))}
              disabled={allocAmount <= 1}
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
            <span className="w-12 text-center text-sm font-mono">{allocAmount}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllocAmount(Math.min(10, attr.maxLevel - level, allocAmount + 1))}
              disabled={allocAmount >= 10 || level + allocAmount >= attr.maxLevel}
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-1 text-right text-xs text-muted-foreground">
            Cost: <span className="font-mono text-foreground">{totalCost.toLocaleString()}</span>
          </div>
          <Button
            size="sm"
            onClick={() => onAllocate(attr.id, allocAmount)}
            disabled={!canAfford || isAllocating}
            className="min-w-[80px]"
          >
            {isAllocating ? "Allocating..." : "Upgrade"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmpireProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("attributes");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newEmpireName, setNewEmpireName] = useState("");

  const { data: configData } = useQuery<{ success: boolean; attributes: EmpireAttribute[] }>({
    queryKey: ["/api/empire-profile/config"],
    queryFn: async () => {
      const res = await fetch("/api/empire-profile/config", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const { data: profileData, isLoading } = useQuery<{ success: boolean; profile: EmpireProfile }>({
    queryKey: ["/api/empire-profile"],
    queryFn: async () => {
      const res = await fetch("/api/empire-profile", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
  });

  const { data: playerProfile } = useQuery<{ uid: string; displayName: string; level: number; prestigeLevel: number }>({
    queryKey: ["/api/player-profile"],
    queryFn: async () => {
      const res = await fetch("/api/player-profile", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load player profile");
      return res.json();
    },
  });

  const allocateMutation = useMutation({
    mutationFn: async ({ attribute, points }: { attribute: string; points: number }) => {
      const res = await fetch("/api/empire-profile/allocate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attribute, points }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to allocate");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/empire-profile"] });
      toast({ title: "Points allocated", description: "Attribute upgraded successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Allocation failed", description: error.message, variant: "destructive" });
    },
  });

  const renameMutation = useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch("/api/empire-profile/rename", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ empireName: newName }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to rename empire");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/empire-profile"] });
      toast({ title: "Empire renamed", description: "Your empire has been successfully renamed" });
      setIsRenameDialogOpen(false);
      setNewEmpireName("");
    },
    onError: (error: Error) => {
      toast({ title: "Rename failed", description: error.message, variant: "destructive" });
    },
  });

  const profile = profileData?.profile ?? DEFAULT_PROFILE;
  const attributes = configData?.attributes || [];
  const overallLevel = getOverallLevel(profile);
  const tierName = profile.empireTitle || getTierName(overallLevel);

  const getAttributeRank = (level: number): string => {
    if (level >= 50) return "Legendary";
    if (level >= 40) return "Epic";
    if (level >= 30) return "Rare";
    if (level >= 20) return "Uncommon";
    if (level >= 10) return "Common";
    return "Novice";
  };

  const getPowerDistribution = () => {
    const total = attributes.reduce((sum, attr) => sum + (profile[attr.id] || 1), 0);
    return attributes.map(attr => ({
      ...attr,
      level: profile[attr.id] || 1,
      percentage: total > 0 ? Math.round(((profile[attr.id] || 1) / total) * 100) : 0,
    }));
  };

  const powerDistribution = getPowerDistribution();

  if (isLoading) {
    return (
      <GameLayout title="Empire Profile" subtitle="Manage your empire attributes">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading empire profile...</div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Empire Profile" subtitle="Manage your empire attributes and development">
      <div className="space-y-6">
        {/* Empire Header Card */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                      {profile.empireName || "Unnamed Empire"}
                    </h2>
                    {playerProfile?.uid && (
                      <Badge variant="outline" className="font-mono text-xs">
                        UID: {playerProfile.uid}
                      </Badge>
                    )}
                  </div>
                  <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename Empire</DialogTitle>
                        <DialogDescription>
                          Enter a new name for your empire. This will be displayed across all empire interfaces.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter empire name..."
                          value={newEmpireName}
                          onChange={(e) => setNewEmpireName(e.target.value)}
                          maxLength={50}
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => renameMutation.mutate(newEmpireName)}
                            disabled={!newEmpireName.trim() || renameMutation.isPending}
                          >
                            {renameMutation.isPending ? "Renaming..." : "Rename Empire"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <p className="text-sm text-muted-foreground">{tierName}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Tier {Math.floor(overallLevel / 15) + 1}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/50 border border-amber-200">
                  <div className="text-2xl font-bold text-primary">{overallLevel}</div>
                  <div className="text-xs text-muted-foreground">Overall Level</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 border border-amber-200">
                  <div className="text-2xl font-bold text-amber-500">{(profile.powerRating || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Power Rating</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 border border-amber-200">
                  <div className="text-2xl font-bold text-emerald-500">{(profile.availablePoints || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Available Points</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 border border-amber-200">
                  <div className="text-2xl font-bold text-slate-400">{(profile.totalPointsEarned || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attributes" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Attributes
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="information" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Information
            </TabsTrigger>
          </TabsList>

          {/* Attributes Tab */}
          <TabsContent value="attributes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Attribute Allocation</CardTitle>
                <CardDescription>
                  Invest attribute points to enhance your empire's capabilities. Each level provides permanent bonuses.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attributes.map((attr) => (
                <AttributeCard
                  key={attr.id}
                  attr={attr}
                  level={profile[attr.id] || 1}
                  pointsSpent={profile.attributePoints[attr.id] || 0}
                  availablePoints={profile.availablePoints || 0}
                  onAllocate={(attribute, points) =>
                    allocateMutation.mutate({ attribute, points })
                  }
                  isAllocating={allocateMutation.isPending}
                />
              ))}
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Empire Overview
                </CardTitle>
                <CardDescription>
                  Quick summary of your empire's development and power distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {attributes.map((attr) => {
                    const level = profile[attr.id] || 1;
                    const IconComponent = ICON_MAP[attr.icon] || Swords;
                    const rank = getAttributeRank(level);
                    return (
                      <div key={attr.id} className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className={cn("p-2 rounded-lg", attr.color)}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{attr.name}</div>
                          <div className="text-xs text-muted-foreground">Lv.{level} • {rank}</div>
                        </div>
                        <Progress value={(level / attr.maxLevel) * 100} className="w-16 h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Power Distribution Analysis
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your empire's attribute investment and strategic focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {powerDistribution.map((attr) => {
                    const IconComponent = ICON_MAP[attr.icon] || Swords;
                    return (
                      <div key={attr.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className={cn("w-4 h-4", attr.color)} />
                            <span className="text-sm font-medium">{attr.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">Lv.{attr.level}</span>
                            <span className="text-sm font-mono font-bold">{attr.percentage}%</span>
                          </div>
                        </div>
                        <Progress value={attr.percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Strongest Attribute</div>
                    <div className="text-lg font-bold text-slate-900">
                      {powerDistribution.length > 0
                        ? powerDistribution.reduce((max, attr) => attr.level > max.level ? attr : max).name
                        : "None"}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Weakest Attribute</div>
                    <div className="text-lg font-bold text-slate-900">
                      {powerDistribution.length > 0
                        ? powerDistribution.reduce((min, attr) => attr.level < min.level ? attr : min).name
                        : "None"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="information" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Empire Development Guide
                </CardTitle>
                <CardDescription>
                  Understanding attribute systems, synergies, and strategic progression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Attribute System Overview</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 text-xs text-slate-600">
                    <p>Your empire has 9 core attributes that define its capabilities and strategic focus. Each attribute can be upgraded using attribute points earned through gameplay. Higher levels provide permanent bonuses and unlock new capabilities.</p>
                    <p>Attribute points are earned through various activities including completing missions, winning battles, discovering anomalies, and progressing through the game. Points can be allocated freely, but consider synergies between attributes for optimal empire development.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Attribute Details & Game Logic</h3>
                  <div className="space-y-3">
                    {attributes.map((attr) => {
                      const info = ATTRIBUTE_DESCRIPTIONS[attr.id];
                      if (!info) return null;
                      const IconComponent = ICON_MAP[attr.icon] || Swords;
                      return (
                        <div key={attr.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={cn("p-2 rounded-lg", attr.color)}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">{attr.name}</div>
                              <div className="text-xs text-slate-600 mt-1">{info.description}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs font-bold text-slate-700 mb-1">Benefits:</div>
                              <ul className="space-y-1">
                                {info.benefits.map((benefit, i) => (
                                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                    <Zap className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-700 mb-1">Synergistic Attributes:</div>
                              <div className="flex flex-wrap gap-1">
                                {info.synergies.map((synergy) => (
                                  <Badge key={synergy} variant="outline" className="text-[10px]">
                                    {synergy}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Progression & Tier System</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 text-xs text-slate-600">
                    <div>
                      <div className="font-bold text-slate-700 mb-1">Tier Progression</div>
                      <p>Your empire's overall level determines its tier, ranging from "Rising Empire" to "Universal Sovereign". Each tier represents significant power and influence in the galaxy.</p>
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 mb-1">Attribute Ranks</div>
                      <p>Individual attributes have ranks: Novice (1-9), Common (10-19), Uncommon (20-29), Rare (30-39), Epic (40-49), and Legendary (50+). Higher ranks unlock special bonuses and prestige.</p>
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 mb-1">Power Rating</div>
                      <p>Power rating is a composite score representing your empire's overall strength. It's calculated based on all attribute levels, facilities, fleet power, and other factors. Higher power ratings improve your ranking on leaderboards.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Strategic Recommendations</h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2 text-xs text-blue-700">
                    <p><strong>Early Game:</strong> Focus on Economy and Industry to establish a strong resource base. This provides the foundation for all other development.</p>
                    <p><strong>Mid Game:</strong> Balance Military and Research to expand your capabilities. Military ensures protection while Research unlocks advanced technologies.</p>
                    <p><strong>Late Game:</strong> Invest in Innovation and Exploration to gain unique advantages. These attributes provide exclusive paths and rare opportunities.</p>
                    <p><strong>Diplomacy:</strong> Consider investing in Diplomacy if you play in a social or alliance-focused manner. It enhances cooperative gameplay options.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
