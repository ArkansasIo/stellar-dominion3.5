import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Compass,
  FlaskConical,
  Hexagon,
  Layers,
  Pickaxe,
  Rocket,
  ScrollText,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useArtifactRelicSystems } from "@/lib/artifactRelicSystems";

const rarityClass = {
  common: "bg-slate-100 text-slate-700 border-slate-300",
  uncommon: "bg-green-100 text-green-700 border-green-300",
  rare: "bg-blue-100 text-blue-700 border-blue-300",
  epic: "bg-purple-100 text-purple-700 border-purple-300",
  legendary: "bg-amber-100 text-amber-700 border-amber-300",
  ancient: "bg-rose-100 text-rose-700 border-rose-300",
};

function msToProgress(startedAt?: number, endsAt?: number) {
  if (!startedAt || !endsAt) return 0;
  const total = endsAt - startedAt;
  const elapsed = Date.now() - startedAt;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.floor((elapsed / total) * 100)));
}

export default function Artifacts() {
  const {
    state,
    summary,
    upgradeArtifact,
    startResearch,
    startArchaeology,
    launchExpedition,
    resetSystems,
  } = useArtifactRelicSystems();

  const unlockedArtifacts = state.artifacts.filter((artifact) => artifact.unlocked);
  const activeResearch = state.research.find((research) => research.status === "in_progress");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/asteroid_field.png" alt="Artifacts" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-amber-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/assets/planets/ice.png" alt="Relic" className="w-20 h-20 rounded-xl object-cover ring-2 ring-amber-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Artifact & Relic Command</h2>
                <p className="text-amber-300 font-rajdhani text-lg">Upgrade artifacts, run archaeology digs, and launch recovery expeditions.</p>
              </div>
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={resetSystems} data-testid="button-reset-artifact-systems">
              Reset System
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Relic Shards</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicShards}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Relic Essence</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicEssence}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Research Data</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.researchData}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Archaeology Crews</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.archaeologyCrews}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Artifacts</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-slate-900">
              {summary.unlockedArtifacts}/{summary.totalArtifacts}
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Active Sites</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-slate-900">{summary.activeSites}</CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Expeditions</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-slate-900">{summary.activeExpeditions}</CardContent>
          </Card>
        </div>

        <Tabs defaultValue="artifacts" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
            <TabsTrigger value="artifacts"><Hexagon className="w-4 h-4 mr-2" /> Artifacts</TabsTrigger>
            <TabsTrigger value="research"><FlaskConical className="w-4 h-4 mr-2" /> Research</TabsTrigger>
            <TabsTrigger value="archaeology"><Pickaxe className="w-4 h-4 mr-2" /> Archaeology</TabsTrigger>
            <TabsTrigger value="expeditions"><Rocket className="w-4 h-4 mr-2" /> Expeditions</TabsTrigger>
            <TabsTrigger value="log"><ScrollText className="w-4 h-4 mr-2" /> Operations Log</TabsTrigger>
          </TabsList>

          <TabsContent value="artifacts" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {state.artifacts.map((artifact) => {
                const upgradeCost = Math.floor(24 * artifact.level * (artifact.rarity === "common" ? 1 : artifact.rarity === "uncommon" ? 1.2 : artifact.rarity === "rare" ? 1.45 : artifact.rarity === "epic" ? 1.8 : artifact.rarity === "legendary" ? 2.2 : 2.8));
                return (
                  <Card key={artifact.id} className="bg-white border-slate-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-slate-900 text-lg">{artifact.name}</CardTitle>
                          <CardDescription>{artifact.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className={rarityClass[artifact.rarity]}>{artifact.rarity}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-slate-500 italic">{artifact.lore}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                          <span className="text-slate-500">Level:</span> <span className="font-semibold">{artifact.level}</span>
                        </div>
                        <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                          <span className="text-slate-500">Research:</span> <span className="font-semibold">{artifact.researchLevel}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {artifact.bonuses.map((bonus, index) => (
                          <div key={`${artifact.id}-bonus-${index}`} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 rounded px-2 py-1">
                            {bonus}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => upgradeArtifact(artifact.id)}
                          disabled={!artifact.unlocked || state.resources.relicShards < upgradeCost}
                          data-testid={`button-upgrade-artifact-${artifact.id}`}
                        >
                          <Wrench className="w-4 h-4 mr-1" /> Upgrade ({upgradeCost})
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startResearch("artifact", artifact.id)}
                          disabled={!artifact.unlocked || !!activeResearch}
                          data-testid={`button-research-artifact-${artifact.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-1" /> Research
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => launchExpedition("artifact", artifact.id)}
                          disabled={!artifact.unlocked || state.resources.archaeologyCrews <= 0}
                          data-testid={`button-expedition-artifact-${artifact.id}`}
                        >
                          <Compass className="w-4 h-4 mr-1" /> Expedition
                        </Button>
                      </div>
                      {!artifact.unlocked && (
                        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                          Locked: discover this artifact through archaeology.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6 space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-indigo-600" /> Artifact Research Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.research.length === 0 ? (
                  <p className="text-sm text-slate-500">No research projects started yet.</p>
                ) : (
                  state.research.map((research) => (
                    <div key={research.id} className="rounded border border-slate-200 p-3 bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{research.targetName}</div>
                          <div className="text-xs text-slate-500 capitalize">{research.targetType} research • {research.durationMinutes} min</div>
                        </div>
                        <Badge className={research.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                          {research.status}
                        </Badge>
                      </div>
                      {research.status === "in_progress" && (
                        <div className="mt-2">
                          <Progress value={msToProgress(research.startedAt, research.endsAt)} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archaeology" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {state.sites.map((site) => (
                <Card key={site.id} className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">{site.name}</CardTitle>
                    <CardDescription>{site.rewardPreview}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={site.difficulty === "low" ? "bg-emerald-100 text-emerald-700" : site.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}>
                        {site.difficulty}
                      </Badge>
                      <Badge className={site.status === "in_progress" ? "bg-blue-100 text-blue-700" : site.status === "completed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                        {site.status}
                      </Badge>
                    </div>
                    {site.status === "in_progress" && (
                      <Progress value={msToProgress(site.startedAt, site.endsAt)} className="h-2" />
                    )}
                    <Button
                      className="w-full"
                      onClick={() => startArchaeology(site.id)}
                      disabled={site.status === "in_progress" || state.resources.archaeologyCrews <= 0}
                      data-testid={`button-start-site-${site.id}`}
                    >
                      <Pickaxe className="w-4 h-4 mr-2" /> {site.status === "in_progress" ? "Excavating..." : "Start Excavation"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expeditions" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-600" /> Artifact/Relic Expedition Ops</CardTitle>
                <CardDescription>Expeditions are launched from Artifact and Relic control panels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.expeditions.length === 0 ? (
                  <p className="text-sm text-slate-500">No expeditions launched yet.</p>
                ) : (
                  state.expeditions.map((expedition) => (
                    <div key={expedition.id} className="rounded border border-slate-200 p-3 bg-slate-50">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <div className="font-semibold text-slate-900">{expedition.name}</div>
                          <div className="text-xs text-slate-500">Success chance: {(expedition.successChance * 100).toFixed(0)}%</div>
                        </div>
                        <Badge className={expedition.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                          {expedition.status}
                        </Badge>
                      </div>
                      {expedition.status === "in_progress" && (
                        <div className="mt-2">
                          <Progress value={msToProgress(expedition.startedAt, expedition.endsAt)} className="h-2" />
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-2">{expedition.notes}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Operations Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {state.log.length === 0 ? (
                  <p className="text-sm text-slate-500">No operations logged.</p>
                ) : (
                  state.log.map((item) => (
                    <div key={item.id} className="rounded border border-slate-200 p-2 bg-slate-50 text-sm text-slate-700">
                      <span className="text-xs text-slate-500 mr-2">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      {item.message}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-slate-500">
          Research, archaeology, and expedition outcomes automatically resolve over time while the page is open.
        </div>
      </div>
    </GameLayout>
  );
}
