import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/lib/gameContext";
import { getCurrentKardashevUpgradeLevel } from "@/lib/kardashevUpgradeCatalog";
import {
  RESEARCH_TREE_CATEGORIES,
  RESEARCH_TREE_COUNTS,
  getResearchTreeBranchesByCategory,
  getResearchTreeNodesByCategory,
  getResearchTreeUpgradeSnapshot,
} from "@/lib/researchTechnologyTreeCatalog";
import { cn } from "@/lib/utils";
import { Atom, Cog, FlaskConical, Microscope, Search, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORY_ICONS = {
  physics: Atom,
  society: Microscope,
  engineering: Cog,
} as const;

const CATEGORY_TONES = {
  physics: "border-blue-200 bg-blue-50 text-blue-700",
  society: "border-emerald-200 bg-emerald-50 text-emerald-700",
  engineering: "border-orange-200 bg-orange-50 text-orange-700",
} as const;

export default function TechnologyTree() {
  const [query, setQuery] = useState("");
  const {
    research,
    resources,
    kardashevSystems,
    researchTreeSystems,
    upgradeResearchTreeSystem,
  } = useGame();

  const kardashevLevel = getCurrentKardashevUpgradeLevel(kardashevSystems);
  const totalTreeLevels = Object.values(researchTreeSystems).reduce((sum, value) => sum + (value || 0), 0);
  const completedNodes = Object.values(researchTreeSystems).filter((value) => (value || 0) > 0).length;
  const search = query.trim().toLowerCase();

  const categorySummaries = useMemo(
    () =>
      RESEARCH_TREE_CATEGORIES.map((category) => {
        const nodes = getResearchTreeNodesByCategory(category.id);
        const unlocked = nodes.filter((node) => {
          const priorMet = !node.requirements.priorNodeId || (researchTreeSystems[node.requirements.priorNodeId] || 0) > 0;
          return (
            priorMet &&
            (research[node.requirements.anchorResearchId] || 0) >= node.requirements.anchorLevel &&
            kardashevLevel >= node.requirements.kardashevLevel
          );
        }).length;
        const completed = nodes.filter((node) => (researchTreeSystems[node.id] || 0) > 0).length;

        return {
          ...category,
          nodes,
          unlocked,
          completed,
          totalLevels: nodes.reduce((sum, node) => sum + (researchTreeSystems[node.id] || 0), 0),
        };
      }),
    [kardashevLevel, research, researchTreeSystems],
  );

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-2" style={{ minHeight: 140 }}>
          <img src="/assets/backgrounds/deep_space.png" alt="Technology Tree" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/60 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-6">
            <img src="/assets/research/astrophysics.png" alt="Research" className="w-20 h-20 rounded-xl object-cover ring-2 ring-teal-400/60 shadow-lg" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white drop-shadow">Research Technology Tree</h2>
              <p className="text-teal-300 font-rajdhani text-lg">90 upgrade nodes per category — hull doctrine, capital command, logistics, and covert fleets.</p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] shadow-sm">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Deep Research Matrix
              </div>
              <div>
                <h3 className="text-2xl font-orbitron font-bold text-[var(--sd-text-primary)]">Three category research lattice</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--sd-text-secondary)]">
                  Physics, Society, and Engineering now each carry 90 upgradeable nodes. Branches unfold through anchor technologies, Kardashev progression,
                  prior node mastery, and starship command doctrine while keeping the same top-level menu structure.
                </p>
              </div>
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sd-text-secondary)]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search branch, node, specialty, or doctrine..."
                  className="pl-9"
                  data-testid="input-tech-search"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--sd-text-secondary)]">Tree Nodes</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-[var(--sd-text-primary)]">{RESEARCH_TREE_COUNTS.totalNodes}</div>
                <div className="text-xs text-[var(--sd-text-secondary)]">{RESEARCH_TREE_COUNTS.nodesPerCategory} per category</div>
              </div>
              <div className="rounded-2xl border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--sd-text-secondary)]">Completed Nodes</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-emerald-700">{completedNodes}</div>
                <div className="text-xs text-[var(--sd-text-secondary)]">Total tree levels {totalTreeLevels}</div>
              </div>
              <div className="rounded-2xl border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--sd-text-secondary)]">Kardashev Gate</div>
                <div className="mt-1 text-2xl font-orbitron font-bold text-amber-700">Level {kardashevLevel}</div>
                <div className="text-xs text-[var(--sd-text-secondary)]">Advanced nodes unlock with empire progression</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categorySummaries.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <Card key={category.id} className="border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", CATEGORY_TONES[category.id])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--sd-text-primary)]">{category.label}</div>
                      <div className="text-xs text-[var(--sd-text-secondary)]">{category.summary}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                      <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Nodes</div>
                      <div className="mt-1 font-bold text-[var(--sd-text-primary)]">{category.nodes.length}</div>
                    </div>
                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                      <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Unlocked</div>
                      <div className="mt-1 font-bold text-blue-700">{category.unlocked}</div>
                    </div>
                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                      <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Levels</div>
                      <div className="mt-1 font-bold text-emerald-700">{category.totalLevels}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue={RESEARCH_TREE_CATEGORIES[0].id} className="w-full">
          <TabsList className="grid h-14 w-full grid-cols-3 border border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-1">
            {RESEARCH_TREE_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex h-full gap-2 font-orbitron data-[state=active]:bg-[var(--sd-panel-bottom)]">
                  <Icon className="h-5 w-5" /> {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {RESEARCH_TREE_CATEGORIES.map((category) => {
            const branches = getResearchTreeBranchesByCategory(category.id);
            const nodes = getResearchTreeNodesByCategory(category.id);
            const searchMatches = search
              ? nodes.filter(
                  (node) =>
                    node.title.toLowerCase().includes(search) ||
                    node.branchName.toLowerCase().includes(search) ||
                    node.specialty.toLowerCase().includes(search) ||
                    node.description.toLowerCase().includes(search),
                )
              : [];

            return (
              <TabsContent key={category.id} value={category.id} className="mt-6 space-y-6">
                <Card className="border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[var(--sd-text-primary)]">{category.label} Strategic Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-4 text-sm text-[var(--sd-text-secondary)]">{category.doctrine}</div>
                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-4 text-sm text-[var(--sd-text-secondary)]">
                      This category contains {RESEARCH_TREE_COUNTS.nodesPerCategory} upgradeable nodes across {branches.length} branches, using the same menu and sub-menu structure while adding deeper node detail, gating, and bonus visibility.
                    </div>
                  </CardContent>
                </Card>

                {search ? (
                  <div className="space-y-4">
                    <div className="text-sm text-[var(--sd-text-secondary)]">{searchMatches.length} matching node{searchMatches.length === 1 ? "" : "s"} in {category.label}.</div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {searchMatches.map((node) => {
                        const level = researchTreeSystems[node.id] || 0;
                        const snapshot = getResearchTreeUpgradeSnapshot(node, level);
                        const priorMet = !node.requirements.priorNodeId || (researchTreeSystems[node.requirements.priorNodeId] || 0) > 0;
                        const requirementsMet =
                          priorMet &&
                          (research[node.requirements.anchorResearchId] || 0) >= node.requirements.anchorLevel &&
                          kardashevLevel >= node.requirements.kardashevLevel;
                        const canAfford =
                          resources.metal >= snapshot.cost.metal &&
                          resources.crystal >= snapshot.cost.crystal &&
                          resources.deuterium >= snapshot.cost.deuterium;

                        return (
                          <Card key={node.id} className="border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] shadow-sm">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <CardTitle className="text-base text-[var(--sd-text-primary)]">{node.title}</CardTitle>
                                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">{node.branchName} • Node {node.sequence}</div>
                                </div>
                                <Badge variant="outline" className={CATEGORY_TONES[category.id]}>{node.phase}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm text-[var(--sd-text-secondary)]">{node.description}</p>
                              <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                                <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Node Effect</div>
                                <div className="mt-1 text-sm font-medium text-[var(--sd-text-primary)]">{node.effect}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3"><div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Current Bonus</div><div className="mt-1 text-lg font-bold text-emerald-700">+{snapshot.currentBonus}%</div></div>
                                <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3"><div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Next Level</div><div className="mt-1 text-lg font-bold text-blue-700">+{snapshot.nextBonus}%</div></div>
                              </div>
                              <Button className="w-full font-orbitron tracking-wider" disabled={!requirementsMet || !canAfford || level >= snapshot.maxLevel} onClick={() => upgradeResearchTreeSystem(node.id, node.title, snapshot.cost, snapshot.buildTimeSeconds * 1000)}>
                                {level >= snapshot.maxLevel ? "MAX LEVEL" : !requirementsMet ? "REQUIREMENTS NOT MET" : canAfford ? `UPGRADE TO LEVEL ${level + 1}` : "INSUFFICIENT RESOURCES"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Tabs defaultValue={branches[0]?.id || ""} className="w-full">
                    <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-2">
                      {branches.map((branch) => (
                        <TabsTrigger key={branch.id} value={branch.id} className="data-[state=active]:bg-[var(--sd-panel-bottom)]">
                          {branch.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {branches.map((branch) => {
                      const branchNodes = nodes.filter((node) => node.branchId === branch.id);
                      const branchLevels = branchNodes.reduce((sum, node) => sum + (researchTreeSystems[node.id] || 0), 0);
                      const completed = branchNodes.filter((node) => (researchTreeSystems[node.id] || 0) > 0).length;
                      const progress = Math.round((completed / branchNodes.length) * 100);

                      return (
                        <TabsContent key={branch.id} value={branch.id} className="mt-6 space-y-4">
                          <Card className="border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)]">
                            <CardContent className="grid gap-4 p-5 md:grid-cols-4">
                              <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                                <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Branch</div>
                                <div className="mt-1 text-lg font-bold text-[var(--sd-text-primary)]">{branch.name}</div>
                              </div>
                              <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                                <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Nodes</div>
                                <div className="mt-1 text-lg font-bold text-[var(--sd-text-primary)]">{branchNodes.length}</div>
                              </div>
                              <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                                <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Completed</div>
                                <div className="mt-1 text-lg font-bold text-emerald-700">{completed}</div>
                              </div>
                              <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-4">
                                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">
                                  <span>Branch Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="mt-2 text-xs text-[var(--sd-text-secondary)]">Total branch levels {branchLevels}</div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {branchNodes.map((node) => {
                              const level = researchTreeSystems[node.id] || 0;
                              const snapshot = getResearchTreeUpgradeSnapshot(node, level);
                              const priorMet = !node.requirements.priorNodeId || (researchTreeSystems[node.requirements.priorNodeId] || 0) > 0;
                              const requirementsMet =
                                priorMet &&
                                (research[node.requirements.anchorResearchId] || 0) >= node.requirements.anchorLevel &&
                                kardashevLevel >= node.requirements.kardashevLevel;
                              const canAfford =
                                resources.metal >= snapshot.cost.metal &&
                                resources.crystal >= snapshot.cost.crystal &&
                                resources.deuterium >= snapshot.cost.deuterium;

                              return (
                                <Card key={node.id} className="border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] shadow-sm" data-testid={`card-tech-node-${node.id}`}>
                                  <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <CardTitle className="text-base text-[var(--sd-text-primary)]">{node.title}</CardTitle>
                                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--sd-text-secondary)]">Node {node.sequence} • Level {level}</div>
                                      </div>
                                      <Badge variant="outline" className={CATEGORY_TONES[category.id]}>
                                        {node.phase}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <p className="text-sm text-[var(--sd-text-secondary)]">{node.description}</p>

                                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                                      <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Specialty</div>
                                      <div className="mt-1 text-sm font-medium text-[var(--sd-text-primary)]">{node.specialty}</div>
                                      <div className="mt-2 text-xs text-[var(--sd-text-secondary)]">{node.effect}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                                        <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Current Bonus</div>
                                        <div className="mt-1 text-lg font-bold text-emerald-700">+{snapshot.currentBonus}%</div>
                                      </div>
                                      <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3">
                                        <div className="text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Next Level</div>
                                        <div className="mt-1 text-lg font-bold text-blue-700">+{snapshot.nextBonus}%</div>
                                      </div>
                                    </div>

                                    <div className="rounded-lg border border-dashed border-[var(--sd-panel-border)] bg-[var(--sd-panel-top)] p-3 text-sm">
                                      <div className="mb-2 text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">Requirements</div>
                                      <div className="space-y-1 text-[var(--sd-text-secondary)]">
                                        <div>{node.requirements.anchorResearchLabel}: {(research[node.requirements.anchorResearchId] || 0)} / {node.requirements.anchorLevel}</div>
                                        <div>Kardashev: {kardashevLevel} / {node.requirements.kardashevLevel}</div>
                                        <div>{node.requirements.priorNodeId ? `Prior node: ${priorMet ? "Complete" : "Locked"}` : "Branch origin node"}</div>
                                      </div>
                                    </div>

                                    <div className="rounded-lg border border-[var(--sd-panel-border)] bg-[var(--sd-panel-bottom)] p-3 text-sm">
                                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--sd-text-secondary)]">
                                        <TrendingUp className="h-3.5 w-3.5 text-primary" /> Upgrade Costs
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between"><span className="text-[var(--sd-text-secondary)]">Metal</span><span className={cn(resources.metal < snapshot.cost.metal && "font-bold text-red-600")}>{snapshot.cost.metal.toLocaleString()}</span></div>
                                        <div className="flex items-center justify-between"><span className="text-[var(--sd-text-secondary)]">Crystal</span><span className={cn(resources.crystal < snapshot.cost.crystal && "font-bold text-red-600")}>{snapshot.cost.crystal.toLocaleString()}</span></div>
                                        <div className="flex items-center justify-between"><span className="text-[var(--sd-text-secondary)]">Deuterium</span><span className={cn(resources.deuterium < snapshot.cost.deuterium && "font-bold text-red-600")}>{snapshot.cost.deuterium.toLocaleString()}</span></div>
                                        <div className="flex items-center justify-between pt-1 text-xs text-[var(--sd-text-secondary)]"><span>Upgrade Time</span><span>{snapshot.buildTimeSeconds}s</span></div>
                                      </div>
                                    </div>

                                    <Button
                                      className="w-full font-orbitron tracking-wider"
                                      disabled={!requirementsMet || !canAfford || level >= snapshot.maxLevel}
                                      onClick={() => upgradeResearchTreeSystem(node.id, node.title, snapshot.cost, snapshot.buildTimeSeconds * 1000)}
                                    >
                                      {level >= snapshot.maxLevel ? "MAX LEVEL" : !requirementsMet ? "REQUIREMENTS NOT MET" : canAfford ? `UPGRADE TO LEVEL ${level + 1}` : "INSUFFICIENT RESOURCES"}
                                    </Button>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </GameLayout>
  );
}
