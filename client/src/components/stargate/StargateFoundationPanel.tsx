import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleDashed, Link2, ShieldAlert } from "lucide-react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

type ModuleStatus = "implemented" | "foundation" | "planned";
type ModuleDefinition = { id: string; name: string; domain: string; status: ModuleStatus; description: string; routes: string[]; dependencies: string[] };

type ModuleResponse = { module: ModuleDefinition };

const statusTone: Record<ModuleStatus, string> = {
  implemented: "bg-emerald-600",
  foundation: "bg-blue-700",
  planned: "bg-slate-600",
};

export function StargateFoundationPanel({ moduleId, title, description }: { moduleId: string; title: string; description: string }) {
  const { data, isLoading, error } = useQuery<ModuleResponse>({
    queryKey: ["/api/stargate/systems", moduleId],
    queryFn: async () => (await apiRequest("GET", `/api/stargate/systems/${moduleId}`)).json(),
  });

  if (isLoading) return <GameLayout><div className="p-8 font-rajdhani text-slate-300">Synchronizing strategic module...</div></GameLayout>;
  if (!data || error) return <GameLayout><div className="p-8 font-rajdhani text-rose-300">Strategic module unavailable: {(error as Error)?.message || "No module specification returned."}</div></GameLayout>;
  const module = data.module;

  return <GameLayout><div className="sd-win-command space-y-6 pb-10">
    <section className="sd-win-window rounded-2xl border border-blue-400/45 bg-[linear-gradient(135deg,rgba(7,28,61,0.95),rgba(20,92,168,0.92))] p-6 shadow-2xl shadow-blue-950/25"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="mb-2 flex items-center gap-2 text-cyan-200"><CircleDashed className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-[0.3em]">Strategic Systems Registry</span></div><h1 className="font-orbitron text-3xl font-bold text-white">{title}</h1><p className="mt-2 max-w-2xl font-rajdhani text-blue-100">{description}</p></div><Badge className={`${statusTone[module.status]} px-3 py-1.5 text-xs uppercase tracking-wider`}>{module.status}</Badge></div></section>
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"><Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Module Contract</CardTitle><CardDescription>{module.description}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4"><div className="text-xs font-bold uppercase tracking-wider text-blue-800">Delivery state</div><p className="mt-2 text-sm text-slate-700">{module.status === "foundation" ? "Files, safe routes, balance contracts, and dependencies are in place. High-impact transactions remain unavailable until their persistence and protection prerequisites are complete." : module.status === "implemented" ? "This capability is currently connected to server-authoritative strategic gameplay." : "This capability is documented and reserved for a later release."}</p></div><div><div className="mb-2 flex items-center gap-2 font-semibold text-slate-800"><Link2 className="h-4 w-4 text-blue-700" />Registered API paths</div><div className="space-y-2">{module.routes.map((route) => <div key={route} className="rounded-lg border border-blue-100 bg-white px-3 py-2 font-mono text-xs text-slate-700">{route}</div>)}</div></div></CardContent></Card><Card className="sd-win-window border-blue-300/70 bg-white/90"><CardHeader><CardTitle className="font-orbitron text-lg">Dependencies</CardTitle><CardDescription>Systems are activated in dependency order to avoid unsafe or incomplete multiplayer transactions.</CardDescription></CardHeader><CardContent>{module.dependencies.length ? <div className="space-y-3">{module.dependencies.map((dependency) => <div key={dependency} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3"><CheckCircle2 className="h-5 w-5 text-blue-700" /><span className="font-semibold capitalize text-slate-800">{dependency.replace(/-/g, " ")}</span></div>)}</div> : <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="h-5 w-5" />This foundational contract has no upstream Stargate module dependency.</div>}<div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><ShieldAlert className="h-5 w-5 shrink-0" />Foundation pages accurately disclose the delivery state. They do not simulate active market, world, social, or prestige transactions.</div></CardContent></Card></section>
  </div></GameLayout>;
}
