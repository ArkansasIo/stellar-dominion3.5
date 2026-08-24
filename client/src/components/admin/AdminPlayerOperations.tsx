import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Database, PackagePlus, RotateCcw, Search, ShieldAlert, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { AdminHubPlayerDetail, AdminHubPlayerSummary } from "@shared/config/adminConsole";

async function fetchAdminJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || "Admin operation failed");
  return payload as T;
}

const RESOURCE_FIELDS = [
  { key: "naquadah", label: "Naquadah" },
  { key: "food", label: "Food" },
  { key: "water", label: "Water" },
  { key: "metal", label: "Metal" },
  { key: "crystal", label: "Crystal" },
  { key: "deuterium", label: "Deuterium" },
  { key: "energy", label: "Energy" },
  { key: "credits", label: "Credits" },
  { key: "darkMatter", label: "Dark Matter" },
] as const;

type DeltaState = Record<(typeof RESOURCE_FIELDS)[number]["key"], string>;

const DEFAULT_DELTAS: DeltaState = {
  naquadah: "0",
  food: "0",
  water: "0",
  metal: "0",
  crystal: "0",
  deuterium: "0",
  energy: "0",
  credits: "0",
  darkMatter: "0",
};

export default function AdminPlayerOperations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedIdentifier, setSelectedIdentifier] = useState("");
  const [deltas, setDeltas] = useState<DeltaState>(DEFAULT_DELTAS);
  const [empireLevel, setEmpireLevel] = useState("1");
  const [tier, setTier] = useState("1");

  const playersQuery = useQuery<{ players: AdminHubPlayerSummary[]; total: number }>({
    queryKey: ["admin-hub-players", submittedSearch],
    queryFn: () => fetchAdminJson(`/api/admin/hub/players?q=${encodeURIComponent(submittedSearch)}&limit=50`),
    refetchInterval: 20000,
  });

  const selectedQuery = useQuery<{ player: AdminHubPlayerDetail }>({
    queryKey: ["admin-hub-player", selectedIdentifier],
    queryFn: () => fetchAdminJson(`/api/admin/hub/players/${encodeURIComponent(selectedIdentifier)}`),
    enabled: Boolean(selectedIdentifier),
  });

  const selectedPlayer = selectedQuery.data?.player;
  const deltaPayload = useMemo(() => {
    const resources = Object.fromEntries(
      Object.entries(deltas)
        .map(([key, value]) => [key, Number(value)])
        .filter(([, value]) => Number.isFinite(value) && value !== 0),
    );
    return { resources };
  }, [deltas]);

  const invalidatePlayer = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-hub-players"] });
    queryClient.invalidateQueries({ queryKey: ["admin-hub-player", selectedIdentifier] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
  };

  const actionMutation = useMutation({
    mutationFn: ({ url, body }: { url: string; body: Record<string, unknown> }) =>
      fetchAdminJson(url, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (_payload, variables) => {
      invalidatePlayer();
      setDeltas(DEFAULT_DELTAS);
      toast({ title: "Admin operation applied", description: `${variables.url.split("/").pop()} completed and audited.` });
    },
    onError: (error: Error) => toast({ title: "Admin operation blocked", description: error.message, variant: "destructive" }),
  });

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  };

  const runReset = (scope: "resources" | "progress") => {
    if (!selectedIdentifier) return;
    const warning = scope === "progress"
      ? "Reset this player’s resources, buildings, research, units, empire level, and tier?"
      : "Reset this player’s resource balances?";
    if (!window.confirm(warning)) return;
    actionMutation.mutate({
      url: `/api/admin/hub/players/${encodeURIComponent(selectedIdentifier)}/reset`,
      body: { scope },
    });
  };

  return (
    <Card className="border-blue-500/30 bg-slate-950/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5 text-cyan-600" /> Player Operations Subpage</CardTitle>
        <CardDescription>Search a player, inspect the authoritative state, and apply audited operations through the server control plane.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={submitSearch} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search username, email, or user id" className="pl-9" aria-label="Search players" />
          </div>
          <Button type="submit"><Search className="mr-2 h-4 w-4" /> Search Players</Button>
        </form>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.35fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Directory</div>
              <Badge variant="outline">{playersQuery.data?.total ?? 0} total</Badge>
            </div>
            <div className="max-h-[360px] space-y-2 overflow-y-auto">
              {(playersQuery.data?.players || []).map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedIdentifier === player.id ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40"}`}
                  onClick={() => setSelectedIdentifier(player.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-slate-900">{player.username || player.email || player.id}</span>
                    <Badge variant={player.moderationStatus === "active" ? "secondary" : "destructive"}>{player.moderationStatus}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{player.planetName || "No capital"} · {player.coordinates || "—"}</div>
                  <div className="mt-1 text-[11px] text-slate-400">Empire {player.empireLevel} · Tier {player.tier} · {player.id}</div>
                </button>
              ))}
              {!playersQuery.data?.players?.length ? <div className="rounded-lg border border-dashed p-5 text-center text-sm text-slate-500">No player records match the current search.</div> : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Selected player</div>
                  <div className="mt-1 font-semibold text-slate-900">{selectedPlayer?.username || selectedPlayer?.email || selectedIdentifier || "Choose a player"}</div>
                </div>
                {selectedPlayer ? <Badge variant="outline">{selectedPlayer.moderationStatus}</Badge> : null}
              </div>
              {selectedPlayer ? (
                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div><div className="text-xs text-slate-500">Capital</div><div className="font-semibold">{selectedPlayer.planetName}</div></div>
                  <div><div className="text-xs text-slate-500">Coordinates</div><div className="font-semibold">{selectedPlayer.coordinates}</div></div>
                  <div><div className="text-xs text-slate-500">Empire</div><div className="font-semibold">{selectedPlayer.empireLevel}</div></div>
                  <div><div className="text-xs text-slate-500">Tier</div><div className="font-semibold">{selectedPlayer.tier}</div></div>
                </div>
              ) : <div className="text-sm text-slate-500">Select a directory record to load authoritative player state.</div>}
            </div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold text-cyan-950"><PackagePlus className="h-4 w-4" /> Resource grant / correction</div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {RESOURCE_FIELDS.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={`admin-delta-${field.key}`} className="text-xs text-slate-600">{field.label}</Label>
                    <Input id={`admin-delta-${field.key}`} type="number" value={deltas[field.key]} onChange={(event) => setDeltas((current) => ({ ...current, [field.key]: event.target.value }))} />
                  </div>
                ))}
              </div>
              <Button className="mt-4" disabled={!selectedIdentifier || actionMutation.isPending || !Object.keys(deltaPayload.resources).length} onClick={() => actionMutation.mutate({ url: `/api/admin/hub/players/${encodeURIComponent(selectedIdentifier)}/grant-resources`, body: deltaPayload })}>
                Apply Resource Delta
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold text-violet-950"><ArrowUpRight className="h-4 w-4" /> Progression override</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="admin-empire-level" className="text-xs">Empire level</Label><Input id="admin-empire-level" type="number" min="1" max="999" value={empireLevel} onChange={(event) => setEmpireLevel(event.target.value)} /></div>
                  <div><Label htmlFor="admin-tier" className="text-xs">Tier</Label><Input id="admin-tier" type="number" min="1" max="21" value={tier} onChange={(event) => setTier(event.target.value)} /></div>
                </div>
                <Button variant="outline" className="mt-4" disabled={!selectedIdentifier || actionMutation.isPending} onClick={() => actionMutation.mutate({ url: `/api/admin/hub/players/${encodeURIComponent(selectedIdentifier)}/progression`, body: { empireLevel: Number(empireLevel), tier: Number(tier) } })}>Set Progression</Button>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold text-amber-950"><RotateCcw className="h-4 w-4" /> Guarded resets</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled={!selectedIdentifier || actionMutation.isPending} onClick={() => runReset("resources")}>Reset Resources</Button>
                  <Button variant="destructive" disabled={!selectedIdentifier || actionMutation.isPending} onClick={() => runReset("progress")}>Reset Progress</Button>
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-amber-900"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> Destructive controls require developer permission and confirm before execution.</div>
              </div>
            </div>

            {selectedPlayer ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900"><Database className="h-4 w-4 text-slate-500" /> State snapshot</div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 md:grid-cols-4">
                  <div><div className="text-slate-400">Naquadah</div><div className="font-semibold text-slate-900">{selectedPlayer.resources.naquadah ?? 0}</div></div>
                  <div><div className="text-slate-400">Food</div><div className="font-semibold text-slate-900">{selectedPlayer.resources.food ?? 0}</div></div>
                  <div><div className="text-slate-400">Water</div><div className="font-semibold text-slate-900">{selectedPlayer.resources.water ?? 0}</div></div>
                  <div><div className="text-slate-400">Guild</div><div className="font-semibold text-slate-900">{selectedPlayer.guild?.name || "Independent"}</div></div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
