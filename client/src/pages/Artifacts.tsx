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
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";
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

const TEMP_THEME_IMAGE = "/theme-temp.png";

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
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.ASTEROID_FIELD.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Artifacts" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Artifact & Relic Command</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Excavate ancient artifacts, research lost technologies, and launch recovery expeditions.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Artifacts", image: SHIP_ASSETS.CAPITALS.BATTLECRUISER.path }, { label: "Research", image: MENU_ASSETS.BUILDINGS.SHIPYARD.path }, { label: "Expeditions", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" onClick={resetSystems} data-testid="button-reset-artifact-systems">
            Reset System
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden mx-auto mb-2"><img src={SHIP_ASSETS.CAPITALS.BATTLECRUISER.path} alt="Relic Shards" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <div className="text-xs uppercase text-slate-500">Relic Shards</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicShards}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden mx-auto mb-2"><img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Relic Essence" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <div className="text-xs uppercase text-slate-500">Relic Essence</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicEssence}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden mx-auto mb-2"><img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Research Data" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
              <div className="text-xs uppercase text-slate-500">Research Data</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.researchData}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden mx-auto mb-2"><img src={SHIP_ASSETS.CAPITALS.CORVETTE.path} alt="Archaeology Crews" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} /></div>
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
