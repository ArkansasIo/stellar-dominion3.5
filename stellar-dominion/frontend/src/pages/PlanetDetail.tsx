import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, Thermometer, Droplets, Zap, Box, Gem, Database, 
  Building2, Users, Shield, ArrowLeft, Flag, Rocket, Factory
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

type PlanetDetailTab = "overview" | "resources" | "buildings" | "defense";

interface PlanetData {
  id: string;
  name: string;
  coordinates: string;
  type: string;
  class: string;
  size: string;
  temperature: number;
  habitability: number;
  waterPercentage: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  colonized: boolean;
  owner?: string;
  population?: number;
  defenses?: number;
  buildings?: {
    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    roboticsFactory: number;
  };
}

export default function PlanetDetail() {
  const [, params] = useRoute("/planet/:id");
  const planetId = params?.id || "";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<PlanetDetailTab>("overview");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "overview" || tabParam === "resources" || tabParam === "buildings" || tabParam === "defense") {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    if (!planet) return;

    if (!planet.colonized && (activeTab === "buildings" || activeTab === "defense")) {
      setActiveTab("overview");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);

    const nextUrl = `/planet/${planetId}?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeTab, planet, planetId]);

  // Fetch planet details
  const { data: planet, isLoading } = useQuery<PlanetData>({
    queryKey: ["planet", planetId],
    queryFn: async () => {
      const res = await fetch(`/api/planets/${planetId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load planet");
      return res.json();
    },
    enabled: !!planetId,
  });

  // Colonize planet mutation
  const colonizeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/planets/${planetId}/colonize`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to colonize planet");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Planet Colonized!",
        description: `${planet?.name} is now part of your empire.`,
      });
      queryClient.invalidateQueries({ queryKey: ["planet", planetId] });
      queryClient.invalidateQueries({ queryKey: ["/api/game/state"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Colonization Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Build structure mutation
  const buildMutation = useMutation({
    mutationFn: async (buildingType: string) => {
      const res = await fetch(`/api/planets/${planetId}/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingType }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to build structure");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Construction Started",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["planet", planetId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Construction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-slate-400">Loading planet data...</div>
        </div>
      </GameLayout>
    );
  }

  if (!planet) {
    return (
      <GameLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold mb-2">Planet Not Found</h3>
            <p className="text-muted-foreground mb-4">The planet you're looking for doesn't exist.</p>
            <Link href="/celestial-browser">
              <Button>Browse Celestial Objects</Button>
            </Link>
          </CardContent>
        </Card>
      </GameLayout>
    );
  }

  const classColors: { [key: string]: string } = {
    M: "bg-blue-100 text-blue-900",
    D: "bg-red-100 text-red-900",
    V: "bg-yellow-100 text-yellow-900",
    R: "bg-gray-100 text-gray-900",
    G: "bg-green-100 text-green-900",
    I: "bg-cyan-100 text-cyan-900",
    A: "bg-amber-100 text-amber-900",
    P: "bg-purple-100 text-purple-900",
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/celestial-browser">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-orbitron font-bold text-slate-900">{planet.name}</h2>
                <Badge className={classColors[planet.class] || "bg-slate-100"}>
                  Class {planet.class}
                </Badge>
                {planet.colonized && (
                  <Badge className="bg-green-100 text-green-800">
                    <Flag className="w-3 h-3 mr-1" /> Colonized
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-rajdhani">
                {planet.coordinates} • {planet.type} • {planet.size}
              </p>
            </div>
          </div>

          {!planet.colonized && (
            <Button 
              onClick={() => colonizeMutation.mutate()}
              disabled={colonizeMutation.isPending}
              size="lg"
              className="font-orbitron"
            >
              <Flag className="w-4 h-4 mr-2" />
              {colonizeMutation.isPending ? "Colonizing..." : "Colonize Planet"}
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-xs text-muted-foreground">Temperature</div>
              <div className="text-xl font-bold">{planet.temperature}K</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-xs text-muted-foreground">Water</div>
              <div className="text-xl font-bold">{planet.waterPercentage}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-xs text-muted-foreground">Habitability</div>
              <div className="text-xl font-bold">{planet.habitability}%</div>
            </CardContent>
          </Card>

          {planet.colonized && planet.population !== undefined && (
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-xs text-muted-foreground">Population</div>
                <div className="text-xl font-bold">{(planet.population / 1000).toFixed(0)}K</div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PlanetDetailTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="buildings" disabled={!planet.colonized}>Buildings</TabsTrigger>
            <TabsTrigger value="defense" disabled={!planet.colonized}>Defense</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="font-bold capitalize">{planet.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Size</div>
                    <div className="font-bold capitalize">{planet.size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Class</div>
                    <div className="font-bold">{planet.class}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Owner</div>
                    <div className="font-bold">{planet.owner || "Unclaimed"}</div>
                  </div>
                </div>

                {planet.colonized && planet.defenses !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Defense Level</div>
                    <div className="flex items-center gap-3">
                      <Progress value={(planet.defenses / 1000) * 100} className="flex-1" />
                      <span className="font-bold text-red-600">{planet.defenses}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-slate-600" />
                    Metal Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{planet.resources.metal.toLocaleString()}</div>
                  <Progress value={(planet.resources.metal / 150000) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-blue-600" />
                    Crystal Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{planet.resources.crystal.toLocaleString()}</div>
                  <Progress value={(planet.resources.crystal / 100000) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    Deuterium Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{planet.resources.deuterium.toLocaleString()}</div>
                  <Progress value={(planet.resources.deuterium / 50000) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Buildings Tab */}
          <TabsContent value="buildings" className="space-y-4">
            {planet.colonized && planet.buildings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Box className="w-5 h-5" />
                        Metal Mine
                      </span>
                      <Badge>Level {planet.buildings.metalMine}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => buildMutation.mutate("metalMine")}
                      disabled={buildMutation.isPending}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Upgrade Mine
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Gem className="w-5 h-5" />
                        Crystal Mine
                      </span>
                      <Badge>Level {planet.buildings.crystalMine}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => buildMutation.mutate("crystalMine")}
                      disabled={buildMutation.isPending}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Upgrade Mine
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Deuterium Synthesizer
                      </span>
                      <Badge>Level {planet.buildings.deuteriumSynthesizer}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => buildMutation.mutate("deuteriumSynthesizer")}
                      disabled={buildMutation.isPending}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Upgrade Synthesizer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Factory className="w-5 h-5" />
                        Robotics Factory
                      </span>
                      <Badge>Level {planet.buildings.roboticsFactory}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => buildMutation.mutate("roboticsFactory")}
                      disabled={buildMutation.isPending}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Upgrade Factory
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Colonize this planet to build structures
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Defense Tab */}
          <TabsContent value="defense" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Planetary Defense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-muted-foreground">Defense systems coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
