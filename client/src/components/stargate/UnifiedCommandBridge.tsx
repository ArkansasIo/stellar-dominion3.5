import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Box, FlaskConical, Rocket, Sparkles, Swords, Users } from "lucide-react";

import { useGame } from "@/lib/gameContext";
import { calculateResourceProduction } from "@/lib/resourceMath";
import { sumLegacyUnits, sumStrategicPersonnel } from "@/lib/unitState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StargateSnapshot = {
  strategic: { race: string; defcon: string; technologies: Record<string, number> };
  resources: { naquadah: number; bankedNaquadah: number };
  personnel: Record<string, number>;
  metrics: { naturalIncome: number; strikeAction: number; defenseAction: number; covertAction: number };
};

function value(value: number | undefined) {
  return Math.floor(Number(value || 0)).toLocaleString();
}

export function UnifiedCommandBridge() {
  const { buildings, research, units } = useGame();
  const { data: stargate } = useQuery<StargateSnapshot>({
    queryKey: ["/api/stargate/state", "unified-command-bridge"],
    queryFn: async () => {
      const response = await fetch("/api/stargate/state", { credentials: "include" });
      if (!response.ok) throw new Error("Strategic state unavailable");
      return response.json();
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const conventional = calculateResourceProduction(buildings);
  const legacyFleet = sumLegacyUnits(units);
  const strategicPersonnel = stargate ? sumStrategicPersonnel(stargate.personnel) : sumStrategicPersonnel(units);
  const researchLevels = Object.values(research).reduce((total, level) => total + Number(level || 0), 0);

  return (
    <Card className="sd-win-window border-cyan-700/60 shadow-lg" data-testid="card-unified-command-bridge">
      <CardHeader className="border-b border-cyan-800/50 pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <Sparkles className="h-5 w-5 text-cyan-300" /> Unified Command Network
            </CardTitle>
            <p className="mt-1 text-sm text-cyan-100/70">
              Conventional industry sustains empire growth; Naquadah fuels the strategic layer, personnel, intelligence, and realm operations.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-teal-400/60 text-teal-200">{stargate?.strategic.race || "Loading doctrine"}</Badge>
            <Badge variant="outline" className="border-indigo-400/60 text-indigo-200">DefCon: {stargate?.strategic.defcon || "—"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-cyan-900/70 bg-slate-950/45 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200/70"><Box className="h-3.5 w-3.5" /> Conventional industry</div>
            <div className="mt-1 font-mono text-lg font-bold text-cyan-100">+{value(conventional.metal + conventional.crystal + conventional.deuterium)}/h</div>
            <div className="text-xs text-cyan-100/55">Metal, Crystal, Deuterium</div>
          </div>
          <div className="rounded-lg border border-teal-800/70 bg-slate-950/45 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-teal-200/70"><Sparkles className="h-3.5 w-3.5" /> Naquadah command fund</div>
            <div className="mt-1 font-mono text-lg font-bold text-teal-100">{value(stargate?.resources.naquadah)}</div>
            <div className="text-xs text-teal-100/55">+{value(stargate?.metrics.naturalIncome)} / 30 min</div>
          </div>
          <div className="rounded-lg border border-blue-800/70 bg-slate-950/45 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-blue-200/70"><Rocket className="h-3.5 w-3.5" /> Legacy fleet</div>
            <div className="mt-1 font-mono text-lg font-bold text-blue-100">{value(legacyFleet)}</div>
            <div className="text-xs text-blue-100/55">Ships and legacy formations</div>
          </div>
          <div className="rounded-lg border border-indigo-800/70 bg-slate-950/45 p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200/70"><Users className="h-3.5 w-3.5" /> Strategic personnel</div>
            <div className="mt-1 font-mono text-lg font-bold text-indigo-100">{value(strategicPersonnel)}</div>
            <div className="text-xs text-indigo-100/55">Troops, agents, miners, lifers</div>
          </div>
        </div>

        <div className="grid gap-3 text-xs text-cyan-100/70 md:grid-cols-3">
          <div className="rounded-md border border-cyan-950 bg-black/25 p-3">Mine upgrades scale the conventional construction and fleet economy.</div>
          <div className="rounded-md border border-cyan-950 bg-black/25 p-3">Research has {value(researchLevels)} total levels and supports both conventional development and strategic readiness.</div>
          <div className="rounded-md border border-cyan-950 bg-black/25 p-3">Strategic action: {value(stargate?.metrics.strikeAction)} strike · {value(stargate?.metrics.defenseAction)} defense · {value(stargate?.metrics.covertAction)} covert.</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/resources"><Button variant="outline" size="sm" className="border-cyan-700 text-cyan-100 hover:bg-cyan-950/50"><Box className="mr-2 h-3.5 w-3.5" /> Industry</Button></Link>
          <Link href="/research"><Button variant="outline" size="sm" className="border-cyan-700 text-cyan-100 hover:bg-cyan-950/50"><FlaskConical className="mr-2 h-3.5 w-3.5" /> Research</Button></Link>
          <Link href="/fleet"><Button variant="outline" size="sm" className="border-cyan-700 text-cyan-100 hover:bg-cyan-950/50"><Rocket className="mr-2 h-3.5 w-3.5" /> Fleet</Button></Link>
          <Link href="/stargate-command"><Button size="sm" className="bg-cyan-600 text-slate-950 hover:bg-cyan-400"><Swords className="mr-2 h-3.5 w-3.5" /> Strategic Command</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}
