import React, { useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCivilizationState,
  useSubsystems,
  useCivilizationJobs,
  useWorkforceAssignments,
  useWorkforceProjection,
  useAssignWorkforce,
  useUpgradeSubsystem,
  useRemoveAssignment,
} from "@/hooks/useCivilizationArmy";
import type { CivilizationSubsystem, CivilizationJob, WorkforceAssignment } from "@shared/types/civilization";
import {
  Users, Wheat, Droplets, TrendingUp, Settings, ArrowUp, Trash2,
  Search, Activity, BarChart3, BriefcaseBusiness, Shield, Star, Zap,
  ChevronRight, Lock, CheckCircle2, AlertCircle, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAIN_COLORS: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  civilization: { text: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-700/50", gradient: "from-emerald-500 to-teal-600" },
  military: { text: "text-red-400", bg: "bg-red-900/20", border: "border-red-700/50", gradient: "from-red-500 to-orange-600" },
};

const RARITY_COLORS: Record<string, string> = {
  common: "text-slate-400",
  uncommon: "text-emerald-400",
  rare: "text-blue-400",
  epic: "text-violet-400",
  legendary: "text-amber-400",
};

export default function CivilizationManagement() {
  const { data: stateData, isLoading: stateLoading } = useCivilizationState();
  const { data: subsystems, isLoading: systemsLoading } = useSubsystems();
  const { data: jobs, isLoading: jobsLoading } = useCivilizationJobs();
  const { data: assignments } = useWorkforceAssignments();
  const { data: projection } = useWorkforceProjection();

  const assignMutation = useAssignWorkforce();
  const upgradeMutation = useUpgradeSubsystem();
  const removeMutation = useRemoveAssignment();

  const [jobSearch, setJobSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [assignCount, setAssignCount] = useState(5);
  const [activeTab, setActiveTab] = useState("subsystems");

  const summary = stateData?.data;
  const currentAssignments: WorkforceAssignment[] = assignments || [];
  const systemList: CivilizationSubsystem[] = subsystems || [];
  const jobList: CivilizationJob[] = jobs || [];

  const jobsById = useMemo(() => {
    return new Map<string, CivilizationJob>(jobList.map((job) => [job.id, job]));
  }, [jobList]);

  const filteredJobs = useMemo(() => {
    const term = jobSearch.trim().toLowerCase();
    if (!term) return jobList.slice(0, 30);
    return jobList
      .filter((job: CivilizationJob) => {
        return (
          job.name.toLowerCase().includes(term) ||
          job.class.toLowerCase().includes(term) ||
          (job.subclass || "").toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term)
        );
      })
      .slice(0, 30);
  }, [jobList, jobSearch]);

  const selectedJob = useMemo(
    () => (selectedJobId ? jobsById.get(selectedJobId) : undefined),
    [jobsById, selectedJobId]
  );

  const totalAssignedEmployees = useMemo(
    () => currentAssignments.reduce((sum, assignment) => sum + assignment.employees, 0),
    [currentAssignments]
  );

  const uniqueAssignedRoles = currentAssignments.length;

  const totalSubsystemLevel = useMemo(() => {
    const subsystemStates: Array<{ systemId: string; level: number }> =
      summary?.state?.subsystemStates || [];
    return subsystemStates.reduce((sum, s) => sum + s.level, 0);
  }, [summary]);

  if (stateLoading || systemsLoading || jobsLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-slate-400 animate-pulse">Loading civilization management...</div>
        </div>
      </GameLayout>
    );
  }

  const subsystemStates: Array<{ systemId: string; level: number }> =
    summary?.state?.subsystemStates || [];
  const subsystemStateMap = new Map<string, number>(
    subsystemStates.map((state) => [state.systemId, state.level] as [string, number])
  );

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-orbitron font-bold text-slate-900">Civilization Management</h1>
          <p className="text-slate-600 font-rajdhani text-sm">
            Manage subsystem progression, workforce allocation, and civilization development
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold">Workforce</p>
                  <p className="text-2xl font-orbitron text-white">{projection?.totalWorkforce ?? 0}</p>
                </div>
                <Users className="w-6 h-6 text-slate-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 border-emerald-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-emerald-400 font-semibold">Food Demand</p>
                  <p className="text-2xl font-orbitron text-emerald-300">{projection?.foodRequired ?? 0}</p>
                </div>
                <Wheat className="w-6 h-6 text-emerald-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-950/50 to-cyan-900/30 border-cyan-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-cyan-400 font-semibold">Water Demand</p>
                  <p className="text-2xl font-orbitron text-cyan-300">{projection?.waterRequired ?? 0}</p>
                </div>
                <Droplets className="w-6 h-6 text-cyan-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-950/50 to-indigo-900/30 border-indigo-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-indigo-400 font-semibold">Productivity</p>
                  <p className="text-2xl font-orbitron text-indigo-300">{projection?.productivityGenerated ?? 0}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-indigo-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-900 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-violet-400" />
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Assigned Employees</p>
              </div>
              <p className="text-xl font-orbitron text-white">{totalAssignedEmployees}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BriefcaseBusiness className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Active Roles</p>
              </div>
              <p className="text-xl font-orbitron text-white">{uniqueAssignedRoles}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Subsystem Level</p>
              </div>
              <p className="text-xl font-orbitron text-white">{totalSubsystemLevel}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-700/50">
            <TabsTrigger value="subsystems" className="text-slate-400 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Subsystems ({systemList.length})
            </TabsTrigger>
            <TabsTrigger value="workforce" className="text-slate-400 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Workforce ({currentAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subsystems" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {systemList.map((system: CivilizationSubsystem) => {
                const currentLevel = subsystemStateMap.get(system.id) ?? 0;
                const nextLevel = Math.min(system.maxLevel, currentLevel + 1);
                const canUpgrade = currentLevel < system.maxLevel;
                const progress = system.maxLevel > 0 ? (currentLevel / system.maxLevel) * 100 : 0;
                const isMaxed = currentLevel >= system.maxLevel;

                return (
                  <Card key={system.id} className="bg-slate-900 border-slate-700/50 hover:border-slate-600 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br", isMaxed ? "from-amber-500 to-orange-600" : "from-slate-700 to-slate-800")}>
                            {isMaxed ? <Star className="w-5 h-5 text-white" /> : <Settings className="w-5 h-5 text-slate-300" />}
                          </div>
                          <div>
                            <CardTitle className="text-white text-base">{system.name}</CardTitle>
                            <Badge variant="outline" className={cn("text-[10px] mt-0.5", isMaxed ? "border-amber-700/50 text-amber-400" : "border-slate-700 text-slate-500")}>
                              {system.systemType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-orbitron text-white">
                            {currentLevel}<span className="text-slate-500 text-sm">/{system.maxLevel}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-slate-400 leading-relaxed">{system.description}</p>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 uppercase font-semibold">Progress</span>
                          <span className="text-slate-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", isMaxed ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-cyan-500 to-blue-500")}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5">
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Efficiency</p>
                          <p className="text-sm font-orbitron text-white">{Math.round(system.efficiency * 100)}%</p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5">
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Prod / Turn</p>
                          <p className="text-sm font-orbitron text-white">{system.productionPerTurn ?? 0}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <div>Population Required: {system.populationRequired ?? 0}</div>
                        <div>
                          Cost/Turn: Food {system.costPerTurn?.food ?? 0} · Water {system.costPerTurn?.water ?? 0} · Credits {system.costPerTurn?.credits ?? 0}
                        </div>
                      </div>

                      <Button
                        disabled={!canUpgrade || upgradeMutation.isPending}
                        className={cn(
                          "w-full font-orbitron text-xs tracking-wider",
                          canUpgrade
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        )}
                        onClick={() =>
                          upgradeMutation.mutate({
                            systemId: system.id,
                            targetLevel: nextLevel,
                          })
                        }
                      >
                        {isMaxed ? (
                          <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> MAX LEVEL</>
                        ) : upgradeMutation.isPending ? (
                          "UPGRADING..."
                        ) : (
                          <><ArrowUp className="w-3.5 h-3.5 mr-1.5" /> UPGRADE TO {nextLevel}</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BriefcaseBusiness className="w-4 h-4 text-emerald-400" />
                      Assign Workforce
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Search jobs..."
                        value={jobSearch}
                        onChange={(event) => setJobSearch(event.target.value)}
                        className="bg-slate-800 border-slate-700 text-white pl-10 placeholder:text-slate-500"
                      />
                    </div>
                    <select
                      className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                      value={selectedJobId}
                      onChange={(event) => setSelectedJobId(event.target.value)}
                    >
                      <option value="">Select job...</option>
                      {filteredJobs.map((job: CivilizationJob) => (
                        <option key={job.id} value={job.id}>
                          {job.name} ({job.class}/{job.subclass || "general"})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={assignCount}
                        onChange={(event) => setAssignCount(Math.max(1, Number(event.target.value) || 1))}
                        className="bg-slate-800 border-slate-700 text-white flex-1"
                      />
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron text-xs tracking-wider px-6"
                        disabled={!selectedJobId || assignMutation.isPending}
                        onClick={() => assignMutation.mutate({ jobId: selectedJobId, employees: assignCount })}
                      >
                        {assignMutation.isPending ? "..." : "ASSIGN"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedJob && (
                  <Card className={cn("bg-slate-900 border", DOMAIN_COLORS[selectedJob.domain]?.border || "border-slate-700/50")}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm">Role Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px]", DOMAIN_COLORS[selectedJob.domain]?.text, DOMAIN_COLORS[selectedJob.domain]?.border)}>
                          {selectedJob.domain}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                          {selectedJob.class}
                        </Badge>
                        {selectedJob.subclass && (
                          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                            {selectedJob.subclass}
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn("text-[10px]", RARITY_COLORS[selectedJob.rarity])}>
                          {selectedJob.rarity}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{selectedJob.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{selectedJob.description}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-emerald-950/30 border border-emerald-800/50 rounded p-2 text-center">
                          <div className="text-[10px] text-emerald-400 uppercase">Food</div>
                          <div className="font-orbitron text-sm text-emerald-300">{selectedJob.resourceDemands?.food ?? 0}</div>
                        </div>
                        <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-2 text-center">
                          <div className="text-[10px] text-cyan-400 uppercase">Water</div>
                          <div className="font-orbitron text-sm text-cyan-300">{selectedJob.resourceDemands?.water ?? 0}</div>
                        </div>
                        <div className="bg-indigo-950/30 border border-indigo-800/50 rounded p-2 text-center">
                          <div className="text-[10px] text-indigo-400 uppercase">Prod</div>
                          <div className="font-orbitron text-sm text-indigo-300">{selectedJob.resourceDemands?.productivity ?? 0}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-2">
                <Card className="bg-slate-900 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        Active Assignments
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                        {currentAssignments.length} roles · {totalAssignedEmployees} workers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentAssignments.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No assignments yet.</p>
                        <p className="text-xs text-slate-600 mt-1">Select a job and assign workers to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentAssignments.map((assignment: WorkforceAssignment) => {
                          const job = jobsById.get(assignment.jobId);
                          const domainStyle = DOMAIN_COLORS[job?.domain || "civilization"];
                          return (
                            <div
                              key={assignment.id}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg border bg-slate-800/50 transition-all hover:bg-slate-800",
                                domainStyle?.border || "border-slate-700/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br", domainStyle?.gradient || "from-slate-700 to-slate-800")}>
                                  {job?.domain === "military" ? (
                                    <Shield className="w-4 h-4 text-white" />
                                  ) : (
                                    <BriefcaseBusiness className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {job?.name || assignment.jobId}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {job?.class || "unknown"}
                                    {job?.subclass ? ` / ${job.subclass}` : ""}
                                    <span className="mx-1.5">·</span>
                                    <span className={cn(RARITY_COLORS[job?.rarity || "common"])}>{job?.rarity}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-sm font-orbitron text-white">{assignment.employees}</div>
                                  <div className="text-[10px] text-slate-500">workers</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30"
                                  onClick={() => removeMutation.mutate(assignment.id)}
                                  disabled={removeMutation.isPending}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
