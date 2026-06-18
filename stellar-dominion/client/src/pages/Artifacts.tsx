import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { TECH_BRANCH_ASSETS } from "@shared/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Hexagon, Play, Clock, Sparkles, Box, History, TrendingUp, Target, 
  Zap, Shield, Sword, MapPin, Globe, Star, Award, Compass
} from "lucide-react";
import { Artifact, ArtifactRarity } from "@/lib/artifactData";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const TEMP_THEME_IMAGE = "/theme-temp.png";

const RarityBadge = ({ rarity }: { rarity: ArtifactRarity }) => {
   const colors = {
      common: "bg-slate-100 text-slate-600 border-slate-200",
      uncommon: "bg-green-100 text-green-700 border-green-200",
      rare: "bg-blue-100 text-blue-700 border-blue-200",
      epic: "bg-purple-100 text-purple-700 border-purple-200",
      legendary: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ancient: "bg-red-100 text-red-700 border-red-200"
   };
   return <Badge variant="outline" className={cn("uppercase text-[10px]", colors[rarity])}>{rarity}</Badge>;
};

const setBonus = [
  { set: "Precursor Set", pieces: 3, collected: 2, bonus: "+15% research speed when complete" },
  { set: "Ancient Armory", pieces: 4, collected: 1, bonus: "+20% fleet attack when complete" },
  { set: "Void Touched", pieces: 2, collected: 2, bonus: "+10% deuterium production (ACTIVE)" }
];

type ArtifactSummaryResponse = {
   totalExpeditions: number;
   successRate: number;
   artifactsFound: number;
   legendaryCount: number;
};

type DiscoveryLogResponse = {
   discoveries: Array<{
      id: string;
      name: string;
      location: string;
      date: string;
      rarity: ArtifactRarity;
      discoveryType: string;
      techId: string;
      xpGained: number;
   }>;
};

async function fetchJson<T>(url: string): Promise<T> {
   const response = await fetch(url, { credentials: "include" });
   const payload = await response.json().catch(() => null);
   if (!response.ok) {
      throw new Error(payload?.message || payload?.error || "Request failed");
   }
   return payload as T;
}

export default function Artifacts() {
  const { artifacts, activateArtifact } = useGame();

   const { data: artifactSummary } = useQuery<ArtifactSummaryResponse>({
      queryKey: ["artifact-summary"],
      queryFn: () => fetchJson<ArtifactSummaryResponse>("/api/artifacts/summary"),
   });

   const { data: discoveryLog } = useQuery<DiscoveryLogResponse>({
      queryKey: ["artifact-discovery-log"],
      queryFn: () => fetchJson<DiscoveryLogResponse>("/api/artifacts/discovery-log"),
   });

  const passiveArtifacts = artifacts.filter(a => a.type === "passive");
  const activeArtifacts = artifacts.filter(a => a.type === "active");

  const totalPower = artifacts.reduce((acc, a) => {
    const rarityValue = { common: 10, uncommon: 25, rare: 50, epic: 100, legendary: 200, ancient: 500 };
    return acc + (rarityValue[a.rarity] || 10);
  }, 0);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Xeno-Archaeology Vault</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Study and utilize powerful relics from lost civilizations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-artifacts">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="artifacts" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Total Artifacts</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{artifacts.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" data-testid="card-stats-power">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.POWER.path} alt="power" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-yellow-600 uppercase">Artifact Power</div>
                  <div className="text-xl font-orbitron font-bold text-yellow-900">{totalPower}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-active">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.HYPERSPACE.path} alt="active relics" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Active Relics</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{activeArtifacts.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-sets">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.ENGINEERING.path} alt="sets complete" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Sets Complete</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">1/3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="collection" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
              <TabsTrigger value="collection" className="font-orbitron" data-testid="tab-collection"><Hexagon className="w-4 h-4 mr-2" /> Collection</TabsTrigger>
              <TabsTrigger value="sets" className="font-orbitron" data-testid="tab-sets"><Award className="w-4 h-4 mr-2" /> Set Bonuses</TabsTrigger>
              <TabsTrigger value="expeditions" className="font-orbitron" data-testid="tab-expeditions"><Compass className="w-4 h-4 mr-2" /> Expeditions</TabsTrigger>
              <TabsTrigger value="history" className="font-orbitron" data-testid="tab-history"><History className="w-4 h-4 mr-2" /> Discovery Log</TabsTrigger>
           </TabsList>

           <TabsContent value="collection" className="mt-6 space-y-6">
              
              {activeArtifacts.length > 0 && (
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold font-orbitron text-slate-900 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-yellow-500" /> Active Relics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {activeArtifacts.map(artifact => {
                          const now = Date.now();
                          const onCooldown = artifact.lastUsed && (now - artifact.lastUsed < (artifact.cooldown || 0));
                          const timeLeft = onCooldown ? Math.ceil(((artifact.lastUsed! + artifact.cooldown!) - now) / 1000) : 0;
                          
                          return (
                             <Card key={artifact.id} className="bg-white border-slate-200 overflow-hidden relative group" data-testid={`card-artifact-${artifact.id}`}>
                                <div className="absolute top-0 right-0 p-4 z-10">
                                   <RarityBadge rarity={artifact.rarity} />
                                </div>
                                <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 w-full" />
                                <CardHeader>
                                   <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                                      <Sparkles className="w-5 h-5 text-yellow-500" />
                                      {artifact.name}
                                   </CardTitle>
                                   <CardDescription>{artifact.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                   <div className="bg-slate-50 p-3 rounded text-sm italic text-slate-600 border border-slate-100">
                                      "{artifact.lore}"
                                   </div>
                                   <div className="space-y-2">
                                      <div className="text-xs font-bold uppercase text-slate-500">Effects</div>
                                      {artifact.bonuses.map((b, i) => (
                                         <div key={i} className="text-sm font-medium text-slate-900 flex items-center gap-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                                            <Sparkles className="w-3 h-3 text-yellow-500" /> {b}
                                         </div>
                                      ))}
                                   </div>
                                   {artifact.cooldown && (
                                      <div className="text-xs text-slate-500 flex items-center gap-1">
                                         <Clock className="w-3 h-3" /> Cooldown: {Math.floor(artifact.cooldown / 60000)} minutes
                                      </div>
                                   )}
                                   <Button 
                                      className={cn("w-full font-orbitron", onCooldown ? "bg-slate-100 text-slate-400" : "bg-yellow-500 hover:bg-yellow-600 text-white")}
                                      disabled={!!onCooldown}
                                      onClick={() => activateArtifact(artifact.id)}
                                      data-testid={`button-activate-${artifact.id}`}
                                   >
                                      {onCooldown ? (
                                         <><Clock className="w-4 h-4 mr-2" /> Cooldown: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</>
                                      ) : (
                                         <><Play className="w-4 h-4 mr-2" /> ACTIVATE</>
                                      )}
                                   </Button>
                                </CardContent>
                             </Card>
                          )
                       })}
                    </div>
                 </div>
              )}

              <div className="space-y-4">
                 <h3 className="text-xl font-bold font-orbitron text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-blue-500" /> Passive Artifacts
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {passiveArtifacts.map(artifact => (
                       <Card key={artifact.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow" data-testid={`card-artifact-${artifact.id}`}>
                          <CardHeader className="pb-2">
                             <div className="flex justify-between items-start">
                                <CardTitle className="font-orbitron text-base flex items-center gap-2">
                                   <Hexagon className="w-4 h-4 text-blue-500" />
                                   {artifact.name}
                                </CardTitle>
                                <RarityBadge rarity={artifact.rarity} />
                             </div>
                             <CardDescription className="text-xs">{artifact.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                             <div className="bg-slate-50 p-2 rounded text-xs italic text-slate-500 border border-slate-100 mb-3">
                                "{artifact.lore}"
                             </div>
                             <div className="space-y-2 mt-2">
                                <div className="text-xs font-bold uppercase text-slate-500">Bonuses</div>
                                {artifact.bonuses.map((b, i) => (
                                   <div key={i} className="text-xs font-medium text-slate-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-2 border border-blue-100">
                                      <div className="w-1 h-1 bg-blue-500 rounded-full" /> {b}
                                   </div>
                                ))}
                             </div>
                          </CardContent>
                       </Card>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - passiveArtifacts.length) }).map((_, i) => (
                       <div key={`empty-${i}`} className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-6 text-slate-300 min-h-[200px]">
                          <Hexagon className="w-10 h-10 mb-2 opacity-20" />
                          <span className="text-sm font-bold">Empty Slot</span>
                          <span className="text-xs mt-1">Discover more artifacts</span>
                       </div>
                    ))}
                 </div>
              </div>

           </TabsContent>

           <TabsContent value="sets" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-set-bonuses">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Award className="w-5 h-5 text-green-600" /> Artifact Set Bonuses
                    </CardTitle>
                    <CardDescription>Collect complete sets for powerful bonuses.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {setBonus.map((set, i) => {
                          const isComplete = set.collected >= set.pieces;
                          return (
                             <div key={i} className={cn("p-4 rounded border", isComplete ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")}>
                                <div className="flex items-center justify-between mb-2">
                                   <div className="font-bold text-slate-900">{set.set}</div>
                                   <Badge variant="outline" className={isComplete ? "bg-green-100 text-green-700 border-green-300" : "bg-slate-100 text-slate-600"}>
                                      {set.collected}/{set.pieces}
                                   </Badge>
                                </div>
                                <Progress value={(set.collected / set.pieces) * 100} className="h-2 mb-2" />
                                <div className={cn("text-sm", isComplete ? "text-green-700 font-medium" : "text-slate-500")}>
                                   {set.bonus}
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="expeditions" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200" data-testid="card-expeditions">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Compass className="w-5 h-5 text-blue-600" /> Archaeological Expeditions
                       </CardTitle>
                       <CardDescription>Send teams to discover new artifacts in unexplored regions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="bg-blue-50 p-4 rounded border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                             <div className="font-bold text-blue-900">Active Expedition</div>
                             <Badge className="bg-blue-600">In Progress</Badge>
                          </div>
                          <div className="text-sm text-blue-700 mb-2">Exploring: Andromeda Sector, Ruins of Zeta Prime</div>
                          <Progress value={65} className="h-2 mb-2" />
                          <div className="flex justify-between text-xs text-blue-600">
                             <span>Progress: 65%</span>
                             <span>ETA: 4h 32m</span>
                          </div>
                       </div>
                       
                       <Separator />
                       
                       <div className="space-y-3">
                          <div className="text-sm font-bold text-slate-700">Available Sites</div>
                          {[
                            { name: "Nebula Graveyard", difficulty: "Medium", chance: "15% legendary", cost: 5000 },
                            { name: "Ancient Monolith", difficulty: "Hard", chance: "25% legendary", cost: 10000 },
                            { name: "Derelict Station", difficulty: "Easy", chance: "5% legendary", cost: 2000 }
                          ].map((site, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                                <div>
                                   <div className="font-medium text-slate-900">{site.name}</div>
                                   <div className="text-xs text-slate-500">{site.difficulty} • {site.chance}</div>
                                </div>
                                <Button size="sm" variant="outline" disabled>
                                   {site.cost.toLocaleString()} Deut
                                </Button>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200" data-testid="card-expedition-stats">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <TrendingUp className="w-5 h-5 text-green-600" /> Expedition Statistics
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
                             <div className="text-xs text-slate-500 uppercase">Total Expeditions</div>
                                <div className="text-2xl font-mono font-bold text-slate-900">{artifactSummary?.totalExpeditions ?? 0}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
                             <div className="text-xs text-slate-500 uppercase">Success Rate</div>
                                <div className="text-2xl font-mono font-bold text-green-600">{artifactSummary?.successRate ?? 0}%</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
                             <div className="text-xs text-slate-500 uppercase">Artifacts Found</div>
                                <div className="text-2xl font-mono font-bold text-purple-600">{artifactSummary?.artifactsFound ?? artifacts.length}</div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
                             <div className="text-xs text-slate-500 uppercase">Legendaries</div>
                                <div className="text-2xl font-mono font-bold text-yellow-600">{artifactSummary?.legendaryCount ?? artifacts.filter(a => a.rarity === "legendary" || a.rarity === "ancient").length}</div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>

           <TabsContent value="history" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-discovery-log">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <History className="w-5 h-5 text-purple-600" /> Discovery Log
                    </CardTitle>
                    <CardDescription>Record of all artifacts discovered through expeditions.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {(discoveryLog?.discoveries || []).length === 0 ? (
                       <div className="text-center py-12 text-slate-400">
                          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p>No discoveries yet. Launch an expedition to find artifacts!</p>
                       </div>
                    ) : (
                       <div className="space-y-3">
                          {(discoveryLog?.discoveries || []).map(entry => (
                             <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                                      <Hexagon className="w-5 h-5 text-purple-600" />
                                   </div>
                                   <div>
                                      <div className="font-bold text-sm text-slate-900">{entry.name}</div>
                                      <div className="text-xs text-slate-500 flex items-center gap-1">
                                         <MapPin className="w-3 h-3" /> {entry.location}
                                      </div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <RarityBadge rarity={entry.rarity} />
                                   <div className="text-xs text-slate-400 mt-1">{new Date(entry.date).toLocaleDateString()}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
