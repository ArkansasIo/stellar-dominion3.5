import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Rocket, Send, Shield, Crosshair, Eye, Globe, Pickaxe, ShoppingBag,
  Users, Swords, Navigation, Clock, AlertTriangle, CheckCircle2,
  Target, MapPin, Layers, Zap, ArrowRight, Activity, Truck,
  Search, Orbit, BookOpen, Briefcase, Flag, Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MissionTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  duration: string;
  minLevel: number;
  rewards: string;
  color: string;
}

const MISSION_TYPES: MissionTemplate[] = [
  { id: "attack", type: "attack", name: "Attack Mission", description: "Launch a military strike against an enemy target", icon: Crosshair, duration: "30 min", minLevel: 1, rewards: "Resources, territory", color: "text-red-500" },
  { id: "transport", type: "transport", name: "Transport", description: "Move resources between your colonies", icon: Truck, duration: "15 min", minLevel: 1, rewards: "Resource redistribution", color: "text-blue-500" },
  { id: "defend", type: "defend", name: "Defend", description: "Protect a planet or station from attack", icon: Shield, duration: "45 min", minLevel: 2, rewards: "Defense bonus, XP", color: "text-green-500" },
  { id: "spy", type: "espionage", name: "Espionage", description: "Gather intelligence on enemy empires", icon: Eye, duration: "20 min", minLevel: 2, rewards: "Intel, vision", color: "text-purple-500" },
  { id: "colonize", type: "colonize", name: "Colonize", description: "Establish a new colony on an unclaimed world", icon: Globe, duration: "2 hours", minLevel: 3, rewards: "New colony", color: "text-cyan-500" },
  { id: "expedition", type: "expedition", name: "Expedition", description: "Explore deep space for resources and discoveries", icon: Navigation, duration: "1 hour", minLevel: 2, rewards: "Resources, relics", color: "text-orange-500" },
  { id: "harvest", type: "harvest", name: "Harvest", description: "Collect resources from asteroid fields", icon: Pickaxe, duration: "25 min", minLevel: 1, rewards: "Raw resources", color: "text-yellow-500" },
  { id: "trade", type: "trade", name: "Trade Route", description: "Establish a trade route with an ally", icon: ShoppingBag, duration: "40 min", minLevel: 2, rewards: "Credits, relations", color: "text-emerald-500" },
  { id: "escort", type: "escort", name: "Escort", description: "Protect a friendly fleet through dangerous space", icon: Users, duration: "35 min", minLevel: 3, rewards: "Reputation, credits", color: "text-indigo-500" },
  { id: "patrol", type: "patrol", name: "Patrol", description: "Secure a sector against pirate activity", icon: Activity, duration: "30 min", minLevel: 2, rewards: "Security, XP", color: "text-sky-500" },
  { id: "blockade", type: "blockade", name: "Blockade", description: "Cut off enemy supply lines", icon: Ban, duration: "1.5 hours", minLevel: 4, rewards: "Strategy advantage", color: "text-rose-500" },
  { id: "bombardment", type: "bombardment", name: "Bombardment", description: "Orbital bombardment of surface targets", icon: Target, duration: "20 min", minLevel: 3, rewards: "Defense destruction", color: "text-red-600" },
];

interface ActiveMission {
  id: string;
  type: string;
  target: string;
  status: string;
  progress: number;
  fleetSize: number;
  launchedAt: string;
  completionTime?: string;
}

export default function Missions() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [target, setTarget] = useState("");
  const [fleetSize, setFleetSize] = useState(1);

  const { data: activeMissions, refetch: refetchMissions } = useQuery<ActiveMission[]>({
    queryKey: ["/api/game/missions"],
    queryFn: async () => {
      const res = await fetch("/api/game/missions", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 10000,
  });

  const launchMissionMutation = useMutation({
    mutationFn: async (missionType: string) => {
      const res = await fetch("/api/game/send-fleet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ missionType, destination: target, ships: { lightFighter: fleetSize } }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Mission Launched", description: "Fleet dispatched successfully." });
      setTarget("");
      setSelectedType(null);
      refetchMissions();
    },
    onError: (err: Error) => {
      toast({ title: "Launch Failed", description: err.message, variant: "destructive" });
    },
  });

  const processMissionsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/game/process-missions", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Missions Processed", description: "All due missions have been resolved." });
      refetchMissions();
    },
  });

  const missionCategories = [
    { label: "Combat", types: ["attack", "defend", "blockade", "bombardment"], icon: Swords, color: "text-red-500" },
    { label: "Logistics", types: ["transport", "harvest", "trade"], icon: Truck, color: "text-blue-500" },
    { label: "Exploration", types: ["expedition", "colonize", "patrol"], icon: Navigation, color: "text-green-500" },
    { label: "Covert", types: ["spy", "escort"], icon: Eye, color: "text-purple-500" },
  ];

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-foreground flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-500" />
              Mission Command
            </h1>
            <p className="text-muted-foreground mt-1">
              Dispatch fleets on strategic missions across the galaxy
            </p>
          </div>
          <Button variant="outline" onClick={() => processMissionsMutation.mutate()} disabled={processMissionsMutation.isPending}>
            <Clock className="w-4 h-4 mr-2" />
            Process Due Missions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="all" onValueChange={(v) => setSelectedType(v === "all" ? null : v)}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All Missions</TabsTrigger>
                {missionCategories.map((cat) => (
                  <TabsTrigger key={cat.label} value={cat.label.toLowerCase()}>
                    <cat.icon className={cn("w-4 h-4 mr-1.5", cat.color)} />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {MISSION_TYPES.map((mission) => (
                    <Card
                      key={mission.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50",
                        selectedType === mission.id && "border-primary ring-1 ring-primary"
                      )}
                      onClick={() => setSelectedType(mission.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <mission.icon className={cn("w-5 h-5", mission.color)} />
                          <CardTitle className="text-sm">{mission.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-xs text-muted-foreground">{mission.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{mission.duration}</Badge>
                          <Badge variant="secondary" className="text-xs">Lv.{mission.minLevel}</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        {mission.rewards}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {missionCategories.map((cat) => (
                <TabsContent key={cat.label} value={cat.label.toLowerCase()} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {MISSION_TYPES.filter(m => cat.types.includes(m.type)).map((mission) => (
                      <Card
                        key={mission.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedType === mission.id && "border-primary ring-1 ring-primary"
                        )}
                        onClick={() => setSelectedType(mission.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <mission.icon className={cn("w-5 h-5", mission.color)} />
                            <CardTitle className="text-sm">{mission.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-xs text-muted-foreground">{mission.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{mission.duration}</Badge>
                            <Badge variant="secondary" className="text-xs">Lv.{mission.minLevel}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground">
                          {mission.rewards}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Launch Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedType ? (
                  <>
                    <div className="text-sm font-medium text-primary">
                      {MISSION_TYPES.find(m => m.id === selectedType)?.name}
                    </div>
                    <div>
                      <label className="text-xs font-medium">Target Coordinates</label>
                      <Input
                        placeholder="e.g. 1:2:3:4"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Fleet Size</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button variant="outline" size="sm" onClick={() => setFleetSize(Math.max(1, fleetSize - 1))}>-</Button>
                        <span className="text-sm font-bold w-8 text-center">{fleetSize}</span>
                        <Button variant="outline" size="sm" onClick={() => setFleetSize(Math.min(100, fleetSize + 1))}>+</Button>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => launchMissionMutation.mutate(selectedType)}
                      disabled={!target || launchMissionMutation.isPending}
                    >
                      {launchMissionMutation.isPending ? "Launching..." : "Launch Mission"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Select a mission type to begin
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Active Missions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!activeMissions || activeMissions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-xs">
                    <Send className="w-6 h-6 mx-auto mb-1 opacity-30" />
                    <p>No active missions</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeMissions.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                        <div>
                          <span className="font-medium capitalize">{m.type}</span>
                          <span className="text-muted-foreground ml-1">{m.target}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{m.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
