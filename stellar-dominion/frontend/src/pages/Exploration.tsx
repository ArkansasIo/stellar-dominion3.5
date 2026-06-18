import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Zap, AlertTriangle, Database, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { SPACE_ANOMALIES, generateAnomalyForCoordinates } from "@/lib/spaceAnomalies";
import { WARP_GATES, TRADE_ROUTES, calculateWarpTime, calculateWarpCost } from "@/lib/warpNetwork";
import { ACHIEVEMENTS, QUESTS } from "@/lib/achievementsSystem";
import { UNIVERSE_EVENTS, DEBRIS_FIELDS } from "@/lib/universeEvents";
import { cn } from "@/lib/utils";
import Navigation from "./Navigation";

export default function Exploration() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

  const rarityColors = {
    common: "bg-slate-100 text-slate-900",
    uncommon: "bg-green-100 text-green-900",
    rare: "bg-blue-100 text-blue-900",
    epic: "bg-purple-100 text-purple-900",
    legendary: "bg-yellow-100 text-yellow-900"
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <Navigation />
        
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Deep Space Exploration</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Discover anomalies, manage warp networks, and pursue achievements.</p>
        </div>

        <Tabs defaultValue="anomalies" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 h-16">
            <TabsTrigger value="anomalies" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Compass className="w-4 h-4" /> Anomalies
            </TabsTrigger>
            <TabsTrigger value="warp" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Zap className="w-4 h-4" /> Warp Network
            </TabsTrigger>
            <TabsTrigger value="trade" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Database className="w-4 h-4" /> Trade Routes
            </TabsTrigger>
            <TabsTrigger value="quests" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <Trophy className="w-4 h-4" /> Quests
            </TabsTrigger>
            <TabsTrigger value="events" className="font-orbitron flex flex-col items-center justify-center h-full gap-1">
              <AlertTriangle className="w-4 h-4" /> Events
            </TabsTrigger>
          </TabsList>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-orange-600" /> Space Anomalies
                </CardTitle>
                <CardDescription>Discover rare phenomena and exotic resources throughout the galaxy.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPACE_ANOMALIES.map(anomaly => (
                    <Card
                      key={anomaly.id}
                      className={cn("cursor-pointer transition-all", selectedAnomaly === anomaly.id ? "border-primary shadow-lg" : "border-slate-200")}
                      onClick={() => setSelectedAnomaly(anomaly.id)}
                      data-testid={`anomaly-card-${anomaly.id}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-orbitron font-bold text-slate-900">{anomaly.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{anomaly.coordinates}</div>
                          </div>
                          <Badge className={rarityColors[anomaly.rarity]}>
                            {anomaly.rarity}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="font-bold capitalize">{anomaly.type.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Hazard:</span>
                            <span className={cn("font-bold", anomaly.hazardLevel > 7 ? "text-red-600" : anomaly.hazardLevel > 4 ? "text-yellow-600" : "text-green-600")}>
                              {anomaly.hazardLevel}/10
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <div className="text-xs font-bold text-slate-700 mb-1">Potential Rewards:</div>
                            <div className="grid grid-cols-3 gap-1 text-center">
                              <div><span className="text-amber-600">{anomaly.rewards.metal.toLocaleString()}</span><div className="text-[10px]">Metal</div></div>
                              <div><span className="text-blue-600">{anomaly.rewards.crystal.toLocaleString()}</span><div className="text-[10px]">Crystal</div></div>
                              <div><span className="text-green-600">{anomaly.rewards.deuterium.toLocaleString()}</span><div className="text-[10px]">Deut</div></div>
                            </div>
                          </div>
                        </div>
                        {!anomaly.discovered && (
                          <Button size="sm" className="w-full mt-2 bg-orange-600 hover:bg-orange-700" onClick={() => alert("Scanning anomaly...")} data-testid={`btn-scan-anomaly-${anomaly.id}`}>
                            <Compass className="w-3 h-3 mr-1" /> Scan
                          </Button>
                        )}
                        {anomaly.discovered && (
                          <div className="text-xs text-green-600 font-bold text-center mt-2">✓ Discovered</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Warp Network Tab */}
          <TabsContent value="warp" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" /> Warp Gate Network
                </CardTitle>
                <CardDescription>Control warp gates for instant travel across the universe.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {WARP_GATES.map(gate => (
                    <Card key={gate.id} className="border-slate-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-orbitron font-bold">{gate.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{gate.coordinates}</div>
                          </div>
                          <Badge variant={gate.owned ? "default" : "secondary"}>
                            {gate.owned ? "Owned" : "Available"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 text-xs space-y-1">
                          <div>Level: <span className="font-bold">{gate.level}/10</span></div>
                          <div>Energy: <span className="font-bold">{gate.energyCost} Deut</span></div>
                          <div>Travel Time: <span className="font-bold">{Math.ceil(calculateWarpTime(gate.level, 1) / 60)}m</span></div>
                          <div>Cooldown: <span className="font-bold">{gate.cooldown}s</span></div>
                        </div>
                        {gate.linkedGates.length > 0 && (
                          <div className="text-xs bg-slate-50 p-2 rounded">
                            <div className="font-bold mb-1">Linked Gates: {gate.linkedGates.length}</div>
                          </div>
                        )}
                        <Button size="sm" className="w-full mt-2" variant={gate.owned ? "outline" : "default"} onClick={() => alert(gate.owned ? "Jumping to " + gate.name : "Capturing " + gate.name)} data-testid={`btn-gate-${gate.id}`}>
                          {gate.owned ? "Jump" : "Capture"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Routes Tab */}
          <TabsContent value="trade" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" /> Trade Route Network
                </CardTitle>
                <CardDescription>Establish profitable trade routes between systems.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRADE_ROUTES.map(route => (
                    <Card key={route.id} className="border-slate-200">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-bold">{route.from} → {route.to}</div>
                            <div className="text-xs text-slate-600">Resource: <span className="font-bold capitalize">{route.resource}</span></div>
                          </div>
                          <Badge className={route.active ? "bg-green-100 text-green-900" : "bg-slate-100 text-slate-900"}>
                            {route.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 text-xs gap-2">
                          <div>Profit: <span className="font-bold text-green-600">+{route.profit}%</span></div>
                          <div>Distance: <span className="font-bold">{route.distance} ly</span></div>
                          <div>Risk: <span className="font-bold">{route.risk}/10</span></div>
                          <div>Freq: <span className="font-bold">{route.frequency}h</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" /> Quests & Achievements
                </CardTitle>
                <CardDescription>Complete quests to earn rewards and unlock achievements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 mb-3">Active Quests</div>
                  {QUESTS.filter(q => q.active).map(quest => (
                    <Card key={quest.id} className={cn("cursor-pointer border-slate-200 transition-all", selectedQuest === quest.id ? "border-primary shadow-lg" : "")} onClick={() => setSelectedQuest(quest.id)} data-testid={`quest-card-${quest.id}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-bold text-slate-900">{quest.title}</div>
                            <div className="text-sm text-slate-600">{quest.description}</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-900">{quest.difficulty}</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          {quest.objectives.map(obj => (
                            <div key={obj.id} className="flex items-center gap-2">
                              <div className={cn("w-4 h-4 rounded border", obj.completed ? "bg-green-600 border-green-600" : "border-slate-300")} />
                              <span>{obj.title}</span>
                              <span className="text-slate-500">({obj.current}/{obj.target})</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> Universe Events & Debris
                </CardTitle>
                <CardDescription>Track active events and harvestable debris fields.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-bold text-slate-900 mb-3">Active Universe Events</div>
                  <div className="space-y-2">
                    {UNIVERSE_EVENTS.filter(e => e.active).map(event => (
                      <Card key={event.id} className={cn("border-l-4", event.severity > 7 ? "border-l-red-600" : event.severity > 4 ? "border-l-yellow-600" : "border-l-green-600")}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-bold">{event.title}</div>
                            <Badge variant="outline">Severity {event.severity}/10</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{event.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="font-bold text-slate-900 mb-3">Debris Fields</div>
                  <div className="space-y-2">
                    {DEBRIS_FIELDS.map(debris => (
                      <Card key={debris.id} className="border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-bold">{debris.name}</div>
                              <div className="text-xs text-slate-500">{debris.coordinates}</div>
                            </div>
                            {debris.harvestedBy && <Badge variant="secondary">Harvesting</Badge>}
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${debris.harvestProgress}%`}}></div>
                          </div>
                          <div className="grid grid-cols-3 text-xs">
                            <div><span className="text-amber-600">{debris.resources.metal.toLocaleString()}</span> Metal</div>
                            <div><span className="text-blue-600">{debris.resources.crystal.toLocaleString()}</span> Crystal</div>
                            <div><span className="text-green-600">{debris.resources.deuterium.toLocaleString()}</span> Deut</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
