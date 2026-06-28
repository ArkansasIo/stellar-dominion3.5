import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, Swords, Zap } from "lucide-react";
import { BACKGROUND_ASSETS, SHIP_ASSETS, MENU_ASSETS, OGAMEX_FEATURED_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type BossRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "transcendent";

type BossRecord = {
  id: string;
  name: string;
  description: string | null;
  bossType: string;
  rarity: BossRarity;
  healthPoints: number;
  attackPower: number;
  defense: number;
  speed: number;
  abilities: string[];
  recommendedLevel: number;
  recommendedPlayers: number;
  minPlayers: number;
};
type RaidRole = "tank" | "dps" | "healer" | "support";
type RaidCommanderProfile = {
  career: { rank: string; rating: number; specialization: RaidRole; bossKills: number };
  rolePower: Record<RaidRole, number>;
  recommendedRole: RaidRole;
  winRate: number;
};

const rarityFilters: BossRarity[] = [
  "common",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "transcendent",
];

const rarityBadgeClass: Record<BossRarity, string> = {
  common: "bg-slate-100 text-slate-800 border-slate-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-violet-100 text-violet-800 border-violet-200",
  legendary: "bg-amber-100 text-amber-800 border-amber-200",
  mythic: "bg-rose-100 text-rose-800 border-rose-200",
  transcendent: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
};

async function fetchBosses(): Promise<BossRecord[]> {
  const response = await fetch("/api/bosses", { credentials: "include" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to load boss catalog");
  }
  return response.json();
}

async function challengeBoss({ boss, role }: { boss: BossRecord; role: RaidRole }) {
  const response = await fetch(`/api/bosses/${boss.id}/challenge`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bossName: boss.name, recommendedLevel: boss.recommendedLevel, role }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Failed to challenge boss");
  }

  return payload;
}

export default function RaidBosses() {
  const [selectedRarity, setSelectedRarity] = useState<BossRarity | null>(null);
  const [selectedBossId, setSelectedBossId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RaidRole>("dps");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bosses = [], isLoading } = useQuery<BossRecord[]>({
    queryKey: ["bosses"],
    queryFn: fetchBosses,
  });
  const { data: commanderProfile } = useQuery<RaidCommanderProfile>({
    queryKey: ["raid-commander-profile"],
    queryFn: async () => {
      const response = await fetch("/api/raids/commander-profile", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load raid commander profile");
      return response.json();
    },
  });

  const filteredBosses = useMemo(
    () => (selectedRarity ? bosses.filter((boss) => boss.rarity === selectedRarity) : bosses),
    [bosses, selectedRarity]
  );

  const selectedBoss =
    filteredBosses.find((boss) => boss.id === selectedBossId) ?? filteredBosses[0] ?? null;

  const averageRecommendedLevel =
    filteredBosses.length > 0
      ? Math.round(
          filteredBosses.reduce((sum, boss) => sum + Number(boss.recommendedLevel || 0), 0) /
            filteredBosses.length
        )
      : 0;

  const maxHealth = filteredBosses.reduce(
    (highest, boss) => Math.max(highest, Number(boss.healthPoints || 0)),
    0
  );

  const challengeMutation = useMutation({
    mutationFn: challengeBoss,
    onSuccess: async (data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["raid-commander-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/game/state"] }),
      ]);
      toast({
        title: data.victory ? "Boss defeated" : "Assault repelled",
        description: `${variables.boss.name}: ${data.message || "Encounter resolved."}${data.rewards?.experience ? ` +${data.rewards.experience} XP` : ""}`,
        variant: data.victory ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Challenge failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="raid-bosses-page">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src={BACKGROUND_ASSETS.COMBAT.path} alt="Raid Bosses" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <div className="flex gap-2 items-center">
              <img src={SHIP_ASSETS.CAPITALS.BATTLESHIP.path} alt="Battleship" className="w-12 h-12 object-contain" />
              <img src={SHIP_ASSETS.CAPITALS.DESTROYER.path} alt="Destroyer" className="w-12 h-12 object-contain" />
              <img src={MENU_ASSETS.NAVIGATION.MILITARY.path} alt="Military" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white drop-shadow">Raid Bosses</h1>
              <p className="text-blue-300 font-rajdhani text-lg">Inspect elite threats, compare boss stat profiles, and dispatch challenge fleets.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Visible Bosses</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-slate-900">{filteredBosses.length}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-blue-700">Avg Recommended</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-blue-900">Lv {averageRecommendedLevel}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-red-700">Max Health Pool</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-red-900">{maxHealth.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-amber-700">Catalog Scope</div>
              <div className="mt-2 text-2xl font-orbitron font-bold text-amber-900">{bosses.length}</div>
            </CardContent>
          </Card>
        </div>

        {commanderProfile && (
          <Card className="border-cyan-200 bg-cyan-50">
            <CardContent className="grid gap-4 p-4 md:grid-cols-4">
              <div><div className="text-xs uppercase text-cyan-700">Raid Rank</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.rank}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Boss Kills</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.career.bossKills}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Selected Role Power</div><div className="font-orbitron font-bold text-cyan-950">{commanderProfile.rolePower[selectedRole].toLocaleString()}</div></div>
              <div><div className="text-xs uppercase text-cyan-700">Recommended Role</div><div className="font-orbitron font-bold capitalize text-cyan-950">{commanderProfile.recommendedRole}</div></div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle className="text-base font-orbitron">Boss Assault Role</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {(["tank", "dps", "healer", "support"] as RaidRole[]).map((role) => (
              <Button key={role} variant={selectedRole === role ? "default" : "outline"} className="capitalize" onClick={() => setSelectedRole(role)}>
                {role}{commanderProfile ? ` • ${commanderProfile.rolePower[role].toLocaleString()}` : ""}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-orbitron text-indigo-900">Boss Hunt Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm text-indigo-900 md:grid-cols-3">
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Compare attack and defense bias first so group composition matches the boss damage profile.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Use rarity filters to narrow preparation around progression-appropriate encounters.
            </div>
            <div className="rounded border border-indigo-200 bg-white/80 p-3">
              Launch only when deuterium reserves can sustain both deployment and follow-up attempts.
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {rarityFilters.map((rarity) => (
            <Button
              key={rarity}
              variant={selectedRarity === rarity ? "default" : "outline"}
              className="capitalize"
              onClick={() => setSelectedRarity(selectedRarity === rarity ? null : rarity)}
            >
              {rarity}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr,1fr]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {isLoading && (
              <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
                <CardContent className="p-6 text-sm text-slate-500">Loading boss catalog...</CardContent>
              </Card>
            )}

            {!isLoading && filteredBosses.length === 0 && (
              <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
                <CardContent className="p-10 text-center text-slate-500">
                  No bosses match the current rarity filter.
                </CardContent>
              </Card>
            )}

            {filteredBosses.map((boss) => {
              const isSelected = selectedBoss?.id === boss.id;

              return (
                <Card
                  key={boss.id}
                  className={`border shadow-sm transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="font-orbitron text-lg text-slate-900">{boss.name}</CardTitle>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                          {boss.bossType.replace(/_/g, " ")}
                        </p>
                      </div>
                      <Badge variant="outline" className={rarityBadgeClass[boss.rarity]}>
                        {boss.rarity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {boss.description || "No dossier available for this encounter."}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Health</div>
                        <div className="mt-2 text-lg font-orbitron font-bold text-red-700">
                          {boss.healthPoints.toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Attack</div>
                        <div className="mt-2 text-lg font-orbitron font-bold text-orange-700">{boss.attackPower}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Defense</div>
                        <div className="mt-2 text-lg font-orbitron font-bold text-blue-700">{boss.defense}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase tracking-wider text-slate-500">Speed</div>
                        <div className="mt-2 text-lg font-orbitron font-bold text-amber-700">{boss.speed}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <div>Recommended level: {boss.recommendedLevel}+</div>
                      <div>Recommended players: {boss.recommendedPlayers}</div>
                      <div>Minimum players: {boss.minPlayers}</div>
                    </div>

                    {boss.abilities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {boss.abilities.slice(0, 4).map((ability) => (
                          <Badge key={ability} variant="outline" className="bg-white text-xs">
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button variant={isSelected ? "default" : "outline"} onClick={() => setSelectedBossId(boss.id)}>
                        {isSelected ? "Inspecting" : "Inspect Boss"}
                      </Button>
                      <Button
                        onClick={() => challengeMutation.mutate({ boss, role: selectedRole })}
                        disabled={challengeMutation.isPending}
                        data-testid={`button-challenge-boss-${boss.id}`}
                      >
                        Challenge Boss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl text-slate-900">Boss Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!selectedBoss ? (
                <p className="text-slate-500">
                  Select a boss to view tactical preparation notes and recommended engagement pressure.
                </p>
              ) : (
                <>
                  <div>
                    <div className="font-orbitron text-lg font-bold text-slate-900">{selectedBoss.name}</div>
                    <div className="mt-1 text-slate-500">{selectedBoss.bossType.replace(/_/g, " ")}</div>
                  </div>

                  <Badge variant="outline" className={rarityBadgeClass[selectedBoss.rarity]}>
                    {selectedBoss.rarity}
                  </Badge>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Crown className="h-4 w-4 text-slate-400" />
                        Encounter Profile
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Recommended level: {selectedBoss.recommendedLevel}+</div>
                        <div>Recommended squad: {selectedBoss.recommendedPlayers}</div>
                        <div>Minimum squad: {selectedBoss.minPlayers}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Shield className="h-4 w-4 text-slate-400" />
                        Threat Readout
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>Attack bias: {selectedBoss.attackPower > selectedBoss.defense ? "High" : "Balanced"}</div>
                        <div>Mobility risk: {selectedBoss.speed > 70 ? "Elevated" : "Manageable"}</div>
                        <div>
                          Readiness index:{" "}
                          {Math.round(
                            (selectedBoss.attackPower + selectedBoss.defense + selectedBoss.speed) / 3
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Zap className="h-4 w-4 text-slate-400" />
                        Tactical Advice
                      </div>
                      <div className="mt-3 space-y-2 text-slate-700">
                        <div>
                          Primary risk:{" "}
                          {selectedBoss.attackPower > selectedBoss.defense ? "Burst damage spikes" : "Attrition wall"}
                        </div>
                        <div>
                          Suggested counter:{" "}
                          {selectedBoss.speed > 70 ? "Control plus accuracy coverage" : "Sustained damage cycles"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}
