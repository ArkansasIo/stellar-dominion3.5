import { useQuery } from "@tanstack/react-query";
import { Boxes, CheckCircle2, CircleDashed, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

type ModuleStatus = "implemented" | "foundation" | "planned";
type ModuleDefinition = { id: string; name: string; domain: string; status: ModuleStatus; description: string; routes: string[]; dependencies: string[] };
type SystemsResponse = { modules: ModuleDefinition[]; totals: Record<ModuleStatus, number>; generatedAt: number; message: string };

const modulePaths: Record<string, string> = {
  market: "/stargate-market", mothership: "/stargate-worlds", worlds: "/stargate-worlds", commander: "/stargate-social", alliances: "/stargate-social", rankings: "/stargate-progression", ascension: "/stargate-progression", protection: "/stargate-operations", events: "/stargate-operations", combat: "/stargate-operations", intelligence: "/stargate-arsenal", armory: "/stargate-arsenal", "turn-engine": "/stargate-command", personnel: "/stargate-command",
};

const tone: Record<ModuleStatus, string> = { implemented: "bg-emerald-600", foundation: "bg-blue-700", planned: "bg-slate-600" };

export default function StargateSystems() {
  const { data, isLoading, error } = useQuery<SystemsResponse>({ queryKey: ["/api/stargate/systems"], queryFn: async () => (await apiRequest("GET", "/api/stargate/systems")).json() });
  if (isLoading) return <GameLayout><div className="p-8 font-rajdhani text-slate-300">Loading strategic systems registry...</div></GameLayout>;
  if (!data || error) return <GameLayout><div className="p-8 font-rajdhani text-rose-300">Systems registry unavailable: {(error as Error)?.message || "No registry returned."}</div></GameLayout>;

  return <GameLayout><div className="sd-win-command space-y-6 pb-10"><section className="sd-win-window rounded-2xl border border-blue-400/45 bg-[linear-gradient(135deg,rgba(7,28,61,0.95),rgba(20,92,168,0.92))] p-6 shadow-2xl shadow-blue-950/25"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="mb-2 flex items-center gap-2 text-cyan-200"><Boxes className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-[0.3em]">Complete Systems Registry</span></div><h1 className="font-orbitron text-3xl font-bold text-white">Stargate Systems</h1><p className="mt-2 max-w-3xl font-rajdhani text-blue-100">Every supplied StargateWars system now has a registered module contract, server file, API boundary, delivery state, and dependency chain.</p></div><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-emerald-500/20 px-3 py-2 text-emerald-100"><strong className="block text-lg">{data.totals.implemented}</strong>Active</div><div className="rounded-lg bg-blue-500/20 px-3 py-2 text-blue-100"><strong className="block text-lg">{data.totals.foundation}</strong>Foundation</div><div className="rounded-lg bg-slate-500/20 px-3 py-2 text-slate-100"><strong className="block text-lg">{data.totals.planned}</strong>Planned</div></div></div></section><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.modules.map((module) => <Card key={module.id} className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="font-orbitron text-base">{module.name}</CardTitle><CardDescription className="mt-1 capitalize">{module.domain}</CardDescription></div><Badge className={tone[module.status]}>{module.status}</Badge></div></CardHeader><CardContent><p className="min-h-14 text-sm text-slate-700">{module.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{module.dependencies.map((dependency) => <Badge key={dependency} variant="outline" className="border-blue-200 text-blue-700">{dependency}</Badge>)}{!module.dependencies.length && <Badge variant="outline" className="border-emerald-200 text-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3" />Base contract</Badge>}</div><Link href={modulePaths[module.id] || "/stargate-systems"}><a className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900">Open system module <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a></Link></CardContent></Card>)}</section><div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700"><CircleDashed className="mr-2 inline h-4 w-4 text-blue-700" />{data.message}</div></div></GameLayout>;
}
