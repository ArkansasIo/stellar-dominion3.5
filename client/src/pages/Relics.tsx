import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Compass, FlaskConical, Lock, Shield, Sparkles, Wrench } from "lucide-react";
import { useArtifactRelicSystems } from "@/lib/artifactRelicSystems";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

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

type BackendRelicCatalog = {
  id: string;
  name: string;
  description: string;
  rarity: keyof typeof rarityClass;
  effects?: string[];
};

type BackendRelicInventoryItem = {
  id: string;
  relicId?: string;
  name: string;
  condition?: number;
  isEquipped?: boolean;
  acquiredAt?: string;
};

export default function Relics() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    state,
    summary,
    unlockRelic,
    upgradeRelic,
    startResearch,
    launchExpedition,
  } = useArtifactRelicSystems();

  const activeResearch = state.research.find((research) => research.status === "in_progress");

  const { data: relicCatalog = [] } = useQuery<BackendRelicCatalog[]>({
    queryKey: ["relic-catalog"],
    queryFn: async () => {
      const response = await fetch("/api/relics", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load relic catalog");
      }
      return response.json();
    },
  });

  const { data: relicInventory = [] } = useQuery<BackendRelicInventoryItem[]>({
    queryKey: ["relic-inventory"],
    queryFn: async () => {
      const response = await fetch("/api/relics/inventory", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to load relic inventory");
      }
      return response.json();
    },
  });

  const updateInventory = async () => {
    await queryClient.invalidateQueries({ queryKey: ["relic-inventory"] });
  };

  const equipRelicMutation = useMutation({
    mutationFn: async ({ relicId, action }: { relicId: string; action: "equip" | "unequip" }) => {
      const response = await fetch(`/api/relics/${relicId}/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Failed to ${action} relic`);
      }
      return payload;
    },
    onSuccess: async (_payload, variables) => {
      await updateInventory();
      toast({
        title: variables.action === "equip" ? "Relic equipped" : "Relic unequipped",
        description: "Persistent relic inventory updated.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Relic action failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.92)), url(${BACKGROUND_ASSETS.ASTEROID_FIELD.path})` }}>
          <div className="p-5 lg:p-6 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <img src={MENU_ASSETS.NAVIGATION.EMPIRE.path} alt="Icon" className="w-8 h-8 rounded-lg border border-white/10 bg-white/10 p-1.5 object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }} />
              <h1 className="text-2xl font-bold">Relic Systems</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">Operate relic upgrades, relic research, and expedition support from one command panel.</p>
            <div className="flex flex-wrap gap-3">
              {[{ label: "Transport", image: SHIP_ASSETS.SPECIAL.TRANSPORT.path }, { label: "Exploration", image: MENU_ASSETS.NAVIGATION.EXPLORATION.path }, { label: "Background", image: OGAMEX_FEATURED_ASSETS.BACKGROUND.path }].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <img src={item.image} alt={item.label} className="w-10 h-10 rounded-lg border border-white/10 bg-black/10 p-1.5 object-contain" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = TEMP_THEME_IMAGE; }} />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Unlocked Relics</div>
              <div className="text-2xl font-bold text-slate-900">{summary.unlockedRelics}/{summary.totalRelics}</div>
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
              <div className="text-xs uppercase text-slate-500">Relic Shards</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.relicShards}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-4">
              <div className="text-xs uppercase text-slate-500">Research Data</div>
              <div className="text-2xl font-bold text-slate-900">{state.resources.researchData}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Persistent Relic Inventory
            </CardTitle>
            <CardDescription>Server-backed relic ownership and equip state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {relicInventory.length === 0 ? (
              <p className="text-sm text-slate-500">No inventory relics found.</p>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {relicInventory.map((relic) => {
                  const catalogEntry = relicCatalog.find((entry) => entry.id === relic.relicId);
                  const displayName = catalogEntry?.name || relic.name;
                  const displayDescription = catalogEntry?.description || "Recovered relic awaiting full analysis.";
                  const displayEffects = catalogEntry?.effects || [];
                  const displayRarity = catalogEntry?.rarity || "common";

                  return (
                    <div key={relic.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{displayName}</div>
                          <p className="text-sm text-slate-600">{displayDescription}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={rarityClass[displayRarity]}>
                            {displayRarity}
                          </Badge>
                          {relic.isEquipped && <Badge className="bg-emerald-100 text-emerald-700">Equipped</Badge>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="rounded border border-slate-200 bg-white px-3 py-2">
                          <span className="text-slate-500">Condition:</span> <span className="font-semibold">{relic.condition ?? 100}%</span>
                        </div>
                        <div className="rounded border border-slate-200 bg-white px-3 py-2">
                          <span className="text-slate-500">Acquired:</span> <span className="font-semibold">{relic.acquiredAt ? new Date(relic.acquiredAt).toLocaleDateString() : "Unknown"}</span>
                        </div>
                      </div>

                      {displayEffects.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {displayEffects.map((effect) => (
                            <div key={`${relic.id}-${effect}`} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 rounded px-2 py-1">
                              {effect}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {relic.isEquipped ? (
                          <Button
                            variant="outline"
                            onClick={() => equipRelicMutation.mutate({ relicId: relic.id, action: "unequip" })}
                            disabled={equipRelicMutation.isPending}
                            data-testid={`button-unequip-persistent-relic-${relic.id}`}
                          >
                            Unequip
                          </Button>
                        ) : (
                          <Button
                            onClick={() => equipRelicMutation.mutate({ relicId: relic.id, action: "equip" })}
                            disabled={equipRelicMutation.isPending}
                            data-testid={`button-equip-persistent-relic-${relic.id}`}
                          >
                            Equip
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {state.relics.map((relic) => {
            const locked = relic.unlockCost > 0;
            const upgradeEssence = Math.floor(18 * relic.level);
            const upgradeShards = Math.floor(14 * relic.level);

            return (
              <Card key={relic.id} className="bg-white border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        {relic.name}
                      </CardTitle>
                      <CardDescription>{relic.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={rarityClass[relic.rarity]}>{relic.rarity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <span className="text-slate-500">Level:</span> <span className="font-semibold">{relic.level}</span>
                    </div>
                    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <span className="text-slate-500">Research:</span> <span className="font-semibold">{relic.researchLevel}</span>
                    </div>
                  </div>

                  <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm">
                    Condition: <span className="font-semibold">{relic.condition}%</span>
                    <Progress value={relic.condition} className="h-2 mt-2" />
                  </div>

                  <div className="space-y-1">
                    {relic.bonuses.map((bonus, index) => (
                      <div key={`${relic.id}-bonus-${index}`} className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 rounded px-2 py-1">
                        {bonus}
                      </div>
                    ))}
                  </div>

                  {locked ? (
                    <Button
                      className="w-full"
                      onClick={() => unlockRelic(relic.id)}
                      disabled={state.resources.relicEssence < relic.unlockCost}
                      data-testid={`button-unlock-relic-${relic.id}`}
                    >
                      <Lock className="w-4 h-4 mr-2" /> Unlock ({relic.unlockCost} essence)
                    </Button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => upgradeRelic(relic.id)}
                        disabled={state.resources.relicEssence < upgradeEssence || state.resources.relicShards < upgradeShards}
                        data-testid={`button-upgrade-relic-${relic.id}`}
                      >
                        <Wrench className="w-4 h-4 mr-1" /> Upgrade
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startResearch("relic", relic.id)}
                        disabled={!!activeResearch}
                        data-testid={`button-research-relic-${relic.id}`}
                      >
                        <FlaskConical className="w-4 h-4 mr-1" /> Research
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => launchExpedition("relic", relic.id)}
                        disabled={state.resources.archaeologyCrews <= 0}
                        data-testid={`button-expedition-relic-${relic.id}`}
                      >
                        <Compass className="w-4 h-4 mr-1" /> Expedition
                      </Button>
                    </div>
                  )}

                  {locked && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      Locked relic. Unlock before upgrade/research/expedition operations.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-600" /> Relic Research & Expedition Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.research.filter((research) => research.targetType === "relic").length === 0 && state.expeditions.filter((expedition) => expedition.targetType === "relic").length === 0 ? (
              <p className="text-sm text-slate-500">No relic activity yet.</p>
            ) : (
              <>
                {state.research
                  .filter((research) => research.targetType === "relic")
                  .map((research) => (
                    <div key={research.id} className="rounded border border-slate-200 p-2 bg-slate-50 text-sm text-slate-700">
                      Research: {research.targetName} • {research.status}
                      {research.status === "in_progress" && (
                        <Progress value={msToProgress(research.startedAt, research.endsAt)} className="h-2 mt-2" />
                      )}
                    </div>
                  ))}

                {state.expeditions
                  .filter((expedition) => expedition.targetType === "relic")
                  .map((expedition) => (
                    <div key={expedition.id} className="rounded border border-slate-200 p-2 bg-slate-50 text-sm text-slate-700">
                      Expedition: {expedition.name} • {expedition.status}
                      {expedition.status === "in_progress" && (
                        <Progress value={msToProgress(expedition.startedAt, expedition.endsAt)} className="h-2 mt-2" />
                      )}
                    </div>
                  ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
