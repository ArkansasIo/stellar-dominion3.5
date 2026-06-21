import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Swords, Coins, FlaskConical, Factory, Handshake, Eye, Compass, Landmark, Lightbulb,
  Crown, TrendingUp, Zap, Award, ChevronUp, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, any> = {
  Swords, Coins, FlaskConical, Factory, Handshake, Eye, Compass, Landmark, Lightbulb,
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

  const profile = profileData?.profile ?? DEFAULT_PROFILE;
  const attributes = configData?.attributes || [];
  const overallLevel = getOverallLevel(profile);
  const tierName = profile.empireTitle || getTierName(overallLevel);

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
    <GameLayout title="Empire Profile" subtitle="Manage your empire attributes">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {profile.empireName || "Unnamed Empire"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{tierName}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{overallLevel}</div>
                  <div className="text-xs text-muted-foreground">Overall Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">{(profile.powerRating || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Power Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">{(profile.availablePoints || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Available Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">{(profile.totalPointsEarned || 0).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="attributes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attributes.map((attr) => (
                <AttributeCard
                  key={attr.id}
                  attr={attr}
                  level={(profile as any)[attr.id] || 1}
                  pointsSpent={(profile.attributePoints as any)[attr.id] || 0}
                  availablePoints={profile.availablePoints || 0}
                  onAllocate={(attribute, points) =>
                    allocateMutation.mutate({ attribute, points })
                  }
                  isAllocating={allocateMutation.isPending}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Empire Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {attributes.map((attr) => {
                    const level = (profile as any)[attr.id] || 1;
                    const IconComponent = ICON_MAP[attr.icon] || Swords;
                    return (
                      <div key={attr.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <IconComponent className={cn("w-5 h-5", attr.color)} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{attr.name}</div>
                          <div className="text-xs text-muted-foreground">Lv.{level}</div>
                        </div>
                        <Progress value={(level / attr.maxLevel) * 100} className="w-16 h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
