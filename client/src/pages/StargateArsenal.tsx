import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Crosshair,
  Eye,
  FlaskConical,
  LockKeyhole,
  Radar,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";

type WeaponCategory = "attack" | "defense" | "covert";
type ArmoryAction = "buy" | "sell" | "equip" | "unequip" | "repair" | "scrap";

type StrategicState = {
  strategic: {
    race: string;
    spyLevel: number;
    antiSpyLevel: number;
    technologies: Record<string, number>;
    glory: number;
    reputation: number;
    ascensionLevel: number;
    logs: Array<{ id: string; kind: string; title: string; summary: string; createdAt: number }>;
  };
  resources: { naquadah: number };
  metrics: { strikeAction: number; defenseAction: number; covertAction: number; antiCovertAction: number };
};

type CatalogItem = {
  id: string;
  name: string;
  race: string;
  category: WeaponCategory;
  strength: number;
  purchaseCost: number;
  sellValue: number;
  durabilityMax: number;
  repairCost: number;
  requiredTechnology?: string;
  requiredLevel?: number;
  available: boolean;
  item: { owned: number; equipped: number; condition: number };
};

type ArmoryResponse = { catalog: CatalogItem[]; state: StrategicState };
type AscensionResponse = {
  rules: { requiredGlory: number; requiredReputation: number; requiredNaquadah: number; maximumAscensionLevel: number };
  eligible: boolean;
  unmet: string[];
  state: StrategicState;
};

const numberFormat = new Intl.NumberFormat("en-US");
const formatNumber = (value: number) => numberFormat.format(Math.max(0, Math.floor(value || 0)));

const categoryIcon: Record<WeaponCategory, typeof Crosshair> = {
  attack: Crosshair,
  defense: Shield,
  covert: Eye,
};

export default function StargateArsenal() {
  const [quantity, setQuantity] = useState("1");
  const [targetUserId, setTargetUserId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const { data: armory, isLoading, error } = useQuery<ArmoryResponse>({
    queryKey: ["/api/stargate/armory"],
    queryFn: async () => (await apiRequest("GET", "/api/stargate/armory")).json(),
  });
  const { data: ascension } = useQuery<AscensionResponse>({
    queryKey: ["/api/stargate/ascension"],
    queryFn: async () => (await apiRequest("GET", "/api/stargate/ascension")).json(),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/stargate/armory"] });
    queryClient.invalidateQueries({ queryKey: ["/api/stargate/ascension"] });
    queryClient.invalidateQueries({ queryKey: ["/api/stargate/state"] });
  };

  const orderMutation = useMutation({
    mutationFn: async ({ path, body }: { path: string; body: Record<string, unknown> }) => (await apiRequest("POST", path, body)).json(),
    onSuccess: (result: { success?: boolean; state?: StrategicState; damage?: number; target?: string | null }) => {
      if (result.state) queryClient.setQueryData(["/api/stargate/state"], result.state);
      refresh();
      if (typeof result.success === "boolean") setNotice(result.success ? `Covert order succeeded${result.target ? `; ${result.target} was disrupted by ${result.damage ?? 0}%.` : "."}` : "Covert order was disrupted by the target's defenses.");
      else setNotice("Strategic order completed.");
    },
    onError: (mutationError: Error) => setNotice(mutationError.message.replace(/^\d+:\s*/, "")),
  });

  const groupedCatalog = useMemo(() => {
    const groups: Record<WeaponCategory, CatalogItem[]> = { attack: [], defense: [], covert: [] };
    armory?.catalog.forEach((weapon) => groups[weapon.category].push(weapon));
    return groups;
  }, [armory]);

  const count = Math.max(1, Math.floor(Number(quantity) || 1));
  const state = armory?.state;

  if (isLoading) return <GameLayout><div className="p-8 font-rajdhani text-slate-300">Synchronizing armory manifests...</div></GameLayout>;
  if (!armory || !state || error) return <GameLayout><div className="p-8 font-rajdhani text-rose-300">Strategic Arsenal is unavailable: {(error as Error)?.message || "No armory manifest returned."}</div></GameLayout>;

  const submitArmory = (action: ArmoryAction, weaponId: string) => orderMutation.mutate({ path: "/api/stargate/armory", body: { action, weaponId, quantity: count } });
  const submitIntelLevel = (type: "spy" | "antiSpy") => orderMutation.mutate({ path: "/api/stargate/intelligence-level", body: { type } });
  const submitOperation = (path: "/api/stargate/recon" | "/api/stargate/sabotage") => orderMutation.mutate({ path, body: { targetUserId: targetUserId.trim() } });

  return (
    <GameLayout>
      <div className="sd-win-command space-y-6 pb-10">
        <section className="sd-win-window rounded-2xl border border-blue-400/45 bg-[linear-gradient(135deg,rgba(7,28,61,0.95),rgba(20,92,168,0.92))] p-6 shadow-2xl shadow-blue-950/25">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-cyan-200"><Wrench className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-[0.3em]">Strategic Logistics Deck</span></div>
              <h1 className="font-orbitron text-3xl font-bold text-white">Arsenal & Intelligence</h1>
              <p className="mt-2 max-w-2xl font-rajdhani text-base text-blue-100">Acquire equipment, preserve readiness, advance covert capability, and issue server-authoritative intelligence orders.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Readout label="Available Naquadah" value={formatNumber(state.resources.naquadah)} />
              <Readout label="Strike Action" value={formatNumber(state.metrics.strikeAction)} />
              <Readout label="Covert Action" value={formatNumber(state.metrics.covertAction)} />
              <Readout label="Doctrine" value={state.strategic.race.toUpperCase()} />
            </div>
          </div>
          {notice && <div className="mt-5 rounded-lg border border-cyan-200/35 bg-sky-950/35 px-4 py-3 font-rajdhani text-sm text-cyan-50">{notice}</div>}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Equipment Catalog</CardTitle><CardDescription>Each catalog item has doctrine, technology, durability, and economic requirements enforced by the server.</CardDescription></CardHeader><CardContent>
            <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4"><div><Label htmlFor="arsenal-quantity">Order quantity</Label><Input id="arsenal-quantity" className="mt-1 w-28" min="1" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div><p className="max-w-md text-xs text-slate-600">Sell and scrap require unequipped inventory. Repair restores the selected item’s shared service condition.</p></div>
            <div className="space-y-5">{(["attack", "defense", "covert"] as WeaponCategory[]).map((category) => <div key={category}><div className="mb-2 flex items-center gap-2"><Badge className="bg-blue-700 capitalize">{category}</Badge><span className="text-xs text-slate-500">Doctrine-compatible systems are ready for purchase and deployment.</span></div><div className="grid gap-3 md:grid-cols-2">{groupedCatalog[category].map((weapon) => <WeaponCard key={weapon.id} weapon={weapon} pending={orderMutation.isPending} onAction={submitArmory} />)}</div></div>)}</div>
          </CardContent></Card>

          <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Ascension Readiness</CardTitle><CardDescription>Readiness is evaluated but Ascension reset remains intentionally gated until the complete prestige lifecycle is implemented.</CardDescription></CardHeader><CardContent className="space-y-4">
            <div className={`rounded-xl border p-4 ${ascension?.eligible ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"}`}><div className="flex items-center gap-2 font-orbitron text-sm"><Sparkles className="h-4 w-4" />{ascension?.eligible ? "Ascension eligible" : "Ascension preparation"}</div><p className="mt-2 text-sm text-slate-600">{ascension?.eligible ? "All current readiness requirements are met." : "Continue developing Glory, Reputation, and unsecured strategic reserves."}</p></div>
            <Requirement label="Glory" value={ascension?.state.strategic.glory || 0} required={ascension?.rules.requiredGlory || 0} />
            <Requirement label="Reputation" value={ascension?.state.strategic.reputation || 0} required={ascension?.rules.requiredReputation || 0} />
            <Requirement label="Naquadah" value={ascension?.state.resources.naquadah || 0} required={ascension?.rules.requiredNaquadah || 0} />
            <div className="rounded-lg bg-sky-50 p-3 text-xs text-slate-600">Ascension Level {ascension?.state.strategic.ascensionLevel || 0} / {ascension?.rules.maximumAscensionLevel || 0}</div>
          </CardContent></Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Covert Development</CardTitle><CardDescription>Higher covert levels amplify agent capacity; all costs and outcomes are resolved on the server.</CardDescription></CardHeader><CardContent className="space-y-4">
            <CovertLevel label="Spy Level" value={state.strategic.spyLevel} icon={Eye} onUpgrade={() => submitIntelLevel("spy")} pending={orderMutation.isPending} />
            <CovertLevel label="Anti-Spy Level" value={state.strategic.antiSpyLevel} icon={LockKeyhole} onUpgrade={() => submitIntelLevel("antiSpy")} pending={orderMutation.isPending} />
            <div className="grid grid-cols-2 gap-3 text-sm"><PowerTile label="Covert" value={state.metrics.covertAction} icon={Eye} /><PowerTile label="Counter-covert" value={state.metrics.antiCovertAction} icon={LockKeyhole} /></div>
          </CardContent></Card>

          <Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Intelligence Operations</CardTitle><CardDescription>Recon reveals strategic information. Sabotage requires an equipped target armory item to produce a persistent damage result.</CardDescription></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="arsenal-target">Target user ID</Label><Input id="arsenal-target" className="mt-1" value={targetUserId} onChange={(event) => setTargetUserId(event.target.value)} placeholder="Target player UUID" /></div><div className="grid gap-3 sm:grid-cols-2"><Button variant="outline" disabled={orderMutation.isPending || !targetUserId.trim()} onClick={() => submitOperation("/api/stargate/recon")}><Radar className="mr-2 h-4 w-4" />Recon</Button><Button className="bg-blue-700 hover:bg-blue-600" disabled={orderMutation.isPending || !targetUserId.trim()} onClick={() => submitOperation("/api/stargate/sabotage")}><Crosshair className="mr-2 h-4 w-4" />Sabotage</Button></div><div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4"><div className="text-xs font-bold uppercase tracking-wider text-blue-800">Recent operational reports</div><div className="mt-3 space-y-2">{state.strategic.logs.filter((entry) => entry.kind === "intelligence" || entry.kind === "armory").slice(0, 5).map((entry) => <div key={entry.id} className="rounded-lg border border-blue-100 bg-white px-3 py-2"><div className="font-semibold text-slate-800">{entry.title}</div><div className="text-xs text-slate-600">{entry.summary}</div></div>)}{!state.strategic.logs.some((entry) => entry.kind === "intelligence" || entry.kind === "armory") && <div className="text-sm text-slate-500">No armory or intelligence reports recorded yet.</div>}</div></div></CardContent></Card>
        </section>
      </div>
    </GameLayout>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-cyan-200/35 bg-slate-950/55 px-3 py-3"><div className="text-[10px] uppercase tracking-wider text-cyan-100">{label}</div><div className="mt-1 font-orbitron text-sm text-white">{value}</div></div>;
}

function WeaponCard({ weapon, pending, onAction }: { weapon: CatalogItem; pending: boolean; onAction: (action: ArmoryAction, id: string) => void }) {
  const Icon = categoryIcon[weapon.category];
  const condition = weapon.item.condition;
  const lockMessage = weapon.race !== "any" ? `${weapon.race.toUpperCase()} doctrine` : weapon.requiredTechnology ? `${weapon.requiredTechnology} L${weapon.requiredLevel || 0}` : "Available";
  return <div className={`rounded-xl border p-4 ${weapon.available ? "border-blue-200 bg-white" : "border-slate-200 bg-slate-50 opacity-75"}`}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-blue-700" /><div><div className="font-orbitron text-sm font-bold text-slate-800">{weapon.name}</div><div className="text-xs text-slate-500">{weapon.strength} action strength · {lockMessage}</div></div></div><Badge variant={weapon.available ? "default" : "outline"} className={weapon.available ? "bg-blue-700" : ""}>{weapon.available ? "Ready" : "Locked"}</Badge></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded bg-blue-50 p-2"><div className="text-slate-500">Owned</div><strong>{formatNumber(weapon.item.owned)}</strong></div><div className="rounded bg-blue-50 p-2"><div className="text-slate-500">Equipped</div><strong>{formatNumber(weapon.item.equipped)}</strong></div><div className="rounded bg-blue-50 p-2"><div className="text-slate-500">Condition</div><strong>{condition}%</strong></div></div><Progress value={condition} className="mt-3 h-2" /><div className="mt-4 grid grid-cols-3 gap-2"><Button size="sm" disabled={pending || !weapon.available} onClick={() => onAction("buy", weapon.id)}>Buy</Button><Button size="sm" variant="outline" disabled={pending || !weapon.available} onClick={() => onAction("equip", weapon.id)}>Equip</Button><Button size="sm" variant="outline" disabled={pending} onClick={() => onAction("repair", weapon.id)}>Repair</Button><Button size="sm" variant="outline" disabled={pending} onClick={() => onAction("unequip", weapon.id)}>Unequip</Button><Button size="sm" variant="outline" disabled={pending} onClick={() => onAction("sell", weapon.id)}>Sell</Button><Button size="sm" variant="outline" disabled={pending} onClick={() => onAction("scrap", weapon.id)}>Scrap</Button></div><div className="mt-3 text-xs text-slate-500">Buy {formatNumber(weapon.purchaseCost)} · Sell {formatNumber(weapon.sellValue)} · Repair up to {formatNumber(weapon.repairCost)} each</div></div>;
}

function CovertLevel({ label, value, icon: Icon, onUpgrade, pending }: { label: string; value: number; icon: typeof Eye; onUpgrade: () => void; pending: boolean }) {
  const nextCost = 4_000 + value * 3_500;
  return <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-blue-700" /><div><div className="font-semibold text-slate-800">{label}</div><div className="text-xs text-slate-600">Level {value}</div></div></div><Button size="sm" disabled={pending} onClick={onUpgrade}><FlaskConical className="mr-2 h-3.5 w-3.5" />{formatNumber(nextCost)}</Button></div></div>;
}

function PowerTile({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Eye }) {
  return <div className="rounded-lg border border-blue-100 bg-white p-3"><div className="flex items-center gap-2 text-xs text-blue-700"><Icon className="h-3.5 w-3.5" />{label}</div><div className="mt-1 font-orbitron text-lg text-slate-800">{formatNumber(value)}</div></div>;
}

function Requirement({ label, value, required }: { label: string; value: number; required: number }) {
  const percent = required ? Math.min(100, (value / required) * 100) : 100;
  return <div><div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{label}</span><span className="font-semibold text-slate-800">{formatNumber(value)} / {formatNumber(required)}</span></div><Progress value={percent} className="h-2" /></div>;
}
