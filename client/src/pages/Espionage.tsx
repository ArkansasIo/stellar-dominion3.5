import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye, Shield, Crosshair, Radio, Search, Target, AlertTriangle,
  User, ShieldOff, Activity, Clock, Zap, Server, FileSearch,
  BookOpen, Scan, Globe, Lock, Unlock, ChevronRight, List,
  BarChart3, Swords, Gem, Send, Ban, CheckCircle2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const INTEL_CATEGORIES = [
  { id: "resources", label: "Resources", icon: BarChart3, description: "Reveal resource stockpiles" },
  { id: "fleet", label: "Fleet", icon: Swords, description: "Reveal fleet composition" },
  { id: "buildings", label: "Buildings", icon: Server, description: "Reveal building levels" },
  { id: "research", label: "Research", icon: BookOpen, description: "Reveal research progress" },
  { id: "missions", label: "Missions", icon: Send, description: "Reveal active missions" },
];

interface EspionageStats {
  espionageTech: number;
  counterIntelligence: number;
  activeSpyMissions: number;
  successRate: number;
}

interface IntelReport {
  timestamp: number;
  quality: number;
  intel: Record<string, any>;
  detected?: boolean;
}

interface SpyMission {
  id: string;
  targetUserId: string;
  targetName: string;
  numSpies: number;
  status: "active" | "completed" | "detected";
  launchedAt: string;
  completedAt?: string;
  report?: IntelReport;
}

export default function Espionage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [targetUsername, setTargetUsername] = useState("");
  const [numSpies, setNumSpies] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["resources", "fleet"]);
  const [activeTab, setActiveTab] = useState("operations");

  const { data: stats, isLoading: statsLoading } = useQuery<EspionageStats>({
    queryKey: ["/api/espionage/stats"],
    queryFn: async () => {
      const res = await fetch("/api/espionage/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch espionage stats");
      return res.json();
    },
  });

  const { data: missions, refetch: refetchMissions } = useQuery<SpyMission[]>({
    queryKey: ["/api/espionage/missions"],
    queryFn: async () => {
      const res = await fetch("/api/espionage/missions", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === "history",
  });

  const sendSpyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/espionage/send-spy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetUserId: targetUsername,
          numSpies,
          categories: selectedCategories,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Spy Mission Launched", description: `Sent ${numSpies} probes to ${targetUsername}.` });
      setTargetUsername("");
      refetchMissions();
    },
    onError: (err: Error) => {
      toast({ title: "Mission Failed", description: err.message, variant: "destructive" });
    },
  });

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const successRate = stats ? Math.min(0.95, Math.max(0.1, 0.65 + stats.espionageTech * 0.05 - 0.01 * (stats.counterIntelligence || 1) + Math.min(0.2, numSpies * 0.05))) : 0.65;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-foreground flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-500" />
              Espionage Directorate
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligence gathering, counter-intelligence, and covert operations
            </p>
          </div>
          {stats && (
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{stats.espionageTech}</div>
                <div className="text-xs text-muted-foreground">Espionage Tech</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.counterIntelligence}</div>
                <div className="text-xs text-muted-foreground">Counter-Intel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.activeSpyMissions}</div>
                <div className="text-xs text-muted-foreground">Active Ops</div>
              </div>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="operations">
              <Crosshair className="w-4 h-4 mr-2" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="w-4 h-4 mr-2" />
              Mission History
            </TabsTrigger>
            <TabsTrigger value="defenses">
              <Shield className="w-4 h-4 mr-2" />
              Counter-Intel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-purple-500" />
                    Launch Spy Mission
                  </CardTitle>
                  <CardDescription>Send espionage probes to gather intelligence on other empires</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Target Empire</label>
                    <Input
                      placeholder="Enter target username or ID..."
                      value={targetUsername}
                      onChange={(e) => setTargetUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Number of Spies</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setNumSpies(Math.max(1, numSpies - 1))}>-</Button>
                      <span className="text-xl font-bold w-16 text-center">{numSpies}</span>
                      <Button variant="outline" size="sm" onClick={() => setNumSpies(Math.min(50, numSpies + 1))}>+</Button>
                      <span className="text-xs text-muted-foreground ml-2">Cost: {numSpies * 100}M / {numSpies * 100}C / {numSpies * 50}D</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Intel Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {INTEL_CATEGORIES.map((cat) => {
                        const active = selectedCategories.includes(cat.id);
                        return (
                          <Button
                            key={cat.id}
                            variant={active ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleCategory(cat.id)}
                          >
                            <cat.icon className="w-4 h-4 mr-1.5" />
                            {cat.label}
                          </Button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      More categories = higher detection risk but more intel
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Estimated Success Rate</label>
                    <div className="flex items-center gap-3">
                      <Progress value={successRate * 100} className="flex-1" />
                      <span className="text-sm font-bold">{(successRate * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => sendSpyMutation.mutate()}
                    disabled={!targetUsername || numSpies < 1 || sendSpyMutation.isPending}
                    className="w-full"
                  >
                    {sendSpyMutation.isPending ? "Launching..." : "Launch Spy Mission"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-purple-500" />
                    Intelligence Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Espionage Tech Level</span>
                    <Badge>{stats?.espionageTech || 1}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Counter-Intelligence</span>
                    <Badge>{stats?.counterIntelligence || 1}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Active Operations</span>
                    <Badge variant="secondary">{stats?.activeSpyMissions || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Base Success Rate</span>
                    <Badge variant="outline">{((stats?.successRate || 0.65) * 100).toFixed(0)}%</Badge>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Higher espionage tech improves success rate</p>
                    <p>• More spies increase success but raise detection risk</p>
                    <p>• Target's counter-intelligence reduces effectiveness</p>
                    <p>• Successful missions reveal valuable intel</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Mission History
                </CardTitle>
                <CardDescription>Past and present intelligence operations</CardDescription>
              </CardHeader>
              <CardContent>
                {!missions || missions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No espionage missions yet</p>
                    <p className="text-sm">Launch your first spy operation to gather intel</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {mission.status === "active" ? (
                            <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
                          ) : mission.status === "detected" ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          <div>
                            <div className="text-sm font-medium">{mission.targetName}</div>
                            <div className="text-xs text-muted-foreground">
                              {mission.numSpies} spies &bull; {new Date(mission.launchedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          mission.status === "active" ? "secondary" :
                          mission.status === "detected" ? "destructive" : "default"
                        }>
                          {mission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defenses" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Counter-Intelligence Status
                  </CardTitle>
                  <CardDescription>Your defenses against enemy espionage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Counter-Intelligence Level</span>
                    <Badge>{stats?.counterIntelligence || 1}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Detection Chance (per spy mission)</span>
                    <Badge variant="outline">{Math.min(80, (stats?.counterIntelligence || 1) * 5 + 25)}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>Intel Leak Reduction</span>
                    <Badge variant="secondary">-{(stats?.counterIntelligence || 1) * 2}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    Security Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-2 bg-muted rounded">
                    <Shield className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Research Counter-Intelligence to reduce enemy spy success rates</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted rounded">
                    <Server className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Build sensor phalanxes to detect incoming spy probes</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-muted rounded">
                    <User className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>Assign a commander with security traits for bonus defense</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
