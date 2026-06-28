import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { TECHS } from "@/lib/techData";
import { OGAME_RESEARCH } from "@/lib/ogameResearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Search, CheckCircle2, Clock3, Beaker } from "lucide-react";
import { useMemo, useState } from "react";

type TechNode = {
  id: string;
  name: string;
  description: string;
  field: string;
  baseCost: { metal: number; crystal: number; deuterium: number; energy?: number };
  baseTime: number;
  prerequisites: Record<string, number>;
  effects: string[];
};

const normalizeField = (raw: string): string => {
  if (raw === "esp") return "espionage";
  if (raw === "upgrade") return "advanced";
  return raw;
};

const prettify = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const buildTechTree = (): TechNode[] => {
  const merged = new Map<string, TechNode>();

  for (const item of OGAME_RESEARCH) {
    merged.set(item.id, {
      id: item.id,
      name: item.name,
      description: item.description,
      field: normalizeField(item.category),
      baseCost: item.cost,
      baseTime: item.time,
      prerequisites: item.prerequisites || {},
      effects: item.bonus
        ? Object.entries(item.bonus).map(([k, v]) => `${prettify(k)}: ${String(v)}`)
        : [],
    });
  }

  for (const item of TECHS) {
    const existing = merged.get(item.id);
    const fromTechData: TechNode = {
      id: item.id,
      name: item.name,
      description: item.description,
      field: normalizeField(item.area),
      baseCost: item.baseCost,
      baseTime: item.tier * 90,
      prerequisites: Object.fromEntries((item.requirements || []).map((r) => [r, 1])),
      effects: item.effects.map((e) => `${e.name}: ${e.value}${e.perLevel ? ` (${e.perLevel})` : ""}`),
    };

    if (!existing) {
      merged.set(item.id, fromTechData);
      continue;
    }

    // Keep prerequisite graph from OGAME data when available, enrich display from TECHS flavor text/effects.
    merged.set(item.id, {
      ...existing,
      description: fromTechData.description || existing.description,
      effects: fromTechData.effects.length > 0 ? fromTechData.effects : existing.effects,
    });
  }

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const getResearchCost = (base: TechNode["baseCost"], level: number) => {
  const multiplier = Math.pow(2, Math.max(level, 0));
  return {
    metal: Math.ceil((base.metal || 0) * multiplier),
    crystal: Math.ceil((base.crystal || 0) * multiplier),
    deuterium: Math.ceil((base.deuterium || 0) * multiplier),
    energy: base.energy ? Math.ceil(base.energy * multiplier) : 0,
  };
};

export default function TechnologyTree() {
  const [query, setQuery] = useState("");
  const { research, resources, updateResearch, queue } = useGame();
  const allTech = useMemo(() => buildTechTree(), []);
  const fields = useMemo(() => ["all", ...Array.from(new Set(allTech.map((t) => t.field)))], [allTech]);
  const activeResearchIds = new Set(queue.filter((q) => q.type === "research").map((q) => q.id));

  const canStart = (tech: TechNode) => {
    const prereqOk = Object.entries(tech.prerequisites).every(
      ([id, level]) => (research[id] || 0) >= level,
    );
    const level = research[tech.id] || 0;
    const cost = getResearchCost(tech.baseCost, level);
    const resourceOk =
      (resources.metal || 0) >= cost.metal &&
      (resources.crystal || 0) >= cost.crystal &&
      (resources.deuterium || 0) >= cost.deuterium &&
      (cost.energy === 0 || (resources.energy || 0) >= cost.energy);

    return prereqOk && resourceOk && !activeResearchIds.has(tech.id);
  };

  const statusFor = (tech: TechNode): "researching" | "completed" | "available" | "locked" => {
    if (activeResearchIds.has(tech.id)) return "researching";
    if ((research[tech.id] || 0) > 0) return "completed";
    return Object.entries(tech.prerequisites).every(([id, level]) => (research[id] || 0) >= level)
      ? "available"
      : "locked";
  };

  const filtered = (field: string) =>
    allTech.filter((t) => {
      const fieldMatch = field === "all" || t.field === field;
      const queryMatch =
        query.trim().length === 0 ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase());
      return fieldMatch && queryMatch;
    });

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Research Technology Tree</h2>
          <p className="text-muted-foreground">Complete research matrix with all technologies, prerequisites, and live unlock states.</p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search technology, effect, or id..."
                className="pl-9"
                data-testid="input-tech-search"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
            {fields.map((field) => (
              <TabsTrigger
                key={field}
                value={field}
                className="capitalize bg-white border border-slate-200 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
              >
                {field}
              </TabsTrigger>
            ))}
          </TabsList>

          {fields.map((field) => (
            <TabsContent key={field} value={field} className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered(field).map((tech) => {
                  const level = research[tech.id] || 0;
                  const cost = getResearchCost(tech.baseCost, level);
                  const status = statusFor(tech);

                  return (
                    <Card key={tech.id} className="bg-white border-slate-200" data-testid={`tech-node-${tech.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-base text-slate-900">{tech.name}</CardTitle>
                            <CardDescription className="text-xs text-slate-500 mt-1">{tech.id}</CardDescription>
                          </div>
                          <Badge className="capitalize">{tech.field}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{tech.description}</p>

                        <div className="flex items-center gap-2">
                          {status === "researching" && <Clock3 className="h-4 w-4 text-blue-600" />}
                          {status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {status === "available" && <Beaker className="h-4 w-4 text-amber-600" />}
                          {status === "locked" && <Lock className="h-4 w-4 text-slate-500" />}
                          <span className="text-xs uppercase tracking-wide text-slate-500">{status}</span>
                          <span className="text-xs text-slate-700 ml-auto">Level {level}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="rounded border border-slate-200 p-2">Metal: {cost.metal.toLocaleString()}</div>
                          <div className="rounded border border-slate-200 p-2">Crystal: {cost.crystal.toLocaleString()}</div>
                          <div className="rounded border border-slate-200 p-2">Deut: {cost.deuterium.toLocaleString()}</div>
                          <div className="rounded border border-slate-200 p-2">Time: {Math.max(tech.baseTime, 30)}s</div>
                        </div>

                        {Object.keys(tech.prerequisites).length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Prerequisites</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(tech.prerequisites).map(([id, needed]) => {
                                const met = (research[id] || 0) >= needed;
                                return (
                                  <Badge key={`${tech.id}-${id}`} variant="outline" className={met ? "border-green-300" : "border-slate-300"}>
                                    {prettify(id)} L{needed}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {tech.effects.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-700 mb-1">Effects</p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              {tech.effects.slice(0, 3).map((effect, idx) => (
                                <li key={`${tech.id}-fx-${idx}`}>- {effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button
                          onClick={() => updateResearch(tech.id, tech.name, Math.max(tech.baseTime, 30) * 1000)}
                          disabled={!canStart(tech)}
                          className="w-full"
                          data-testid={`button-research-${tech.id}`}
                        >
                          {activeResearchIds.has(tech.id) ? "Researching..." : level > 0 ? "Upgrade Research" : "Start Research"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </GameLayout>
  );
}
