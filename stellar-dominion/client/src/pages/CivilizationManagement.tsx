import React, { useMemo, useState } from 'react';
import GameLayout from '@/components/layout/GameLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCivilizationState,
  useSubsystems,
  useCivilizationJobs,
  useWorkforceAssignments,
  useWorkforceProjection,
  useAssignWorkforce,
  useUpgradeSubsystem,
  useRemoveAssignment,
} from '@/hooks/useCivilizationArmy';
import type { CivilizationSubsystem, CivilizationJob, WorkforceAssignment } from '@shared/types/civilization';

export default function CivilizationManagement() {
  const { data: stateData, isLoading: stateLoading } = useCivilizationState();
  const { data: subsystems, isLoading: systemsLoading } = useSubsystems();
  const { data: jobs, isLoading: jobsLoading } = useCivilizationJobs();
  const { data: assignments } = useWorkforceAssignments();
  const { data: projection } = useWorkforceProjection();

  const assignMutation = useAssignWorkforce();
  const upgradeMutation = useUpgradeSubsystem();
  const removeMutation = useRemoveAssignment();

  const [jobSearch, setJobSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [assignCount, setAssignCount] = useState(5);

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
          (job.subclass || '').toLowerCase().includes(term) ||
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

  if (stateLoading || systemsLoading || jobsLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading civilization management...</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Civilization Management</h1>
            <p className="text-sm text-slate-500">Manage subsystem progression and workforce allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Total Workforce</div>
              <div className="text-3xl font-bold text-slate-900">{projection?.totalWorkforce ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Food Required</div>
              <div className="text-3xl font-bold text-slate-900">{projection?.foodRequired ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Water Required</div>
              <div className="text-3xl font-bold text-slate-900">{projection?.waterRequired ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Productivity</div>
              <div className="text-3xl font-bold text-slate-900">{projection?.productivityGenerated ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Assigned Employees</div>
              <div className="text-2xl font-bold text-slate-900">{totalAssignedEmployees}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Active Roles</div>
              <div className="text-2xl font-bold text-slate-900">{uniqueAssignedRoles}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-500">Subsystem Coverage</div>
              <div className="text-2xl font-bold text-slate-900">{systemList.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subsystems" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subsystems">Subsystems</TabsTrigger>
            <TabsTrigger value="workforce">Workforce</TabsTrigger>
          </TabsList>

          <TabsContent value="subsystems" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {systemList.map((system: CivilizationSubsystem) => {
                const currentLevel = subsystemStateMap.get(system.id) ?? 0;
                const nextLevel = Math.min(system.maxLevel, currentLevel + 1);
                const canUpgrade = currentLevel < system.maxLevel;

                return (
                  <Card key={system.id} className="bg-white border-slate-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-slate-900">{system.name}</CardTitle>
                        <Badge variant="outline">{system.systemType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">{system.description}</p>
                      <div className="text-sm text-slate-500">
                        Level {currentLevel} / {system.maxLevel}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="rounded-md border border-slate-200 p-2 bg-slate-50">
                          <div className="text-slate-500">Efficiency</div>
                          <div className="font-semibold text-slate-900">{Math.round(system.efficiency * 100)}%</div>
                        </div>
                        <div className="rounded-md border border-slate-200 p-2 bg-slate-50">
                          <div className="text-slate-500">Production/Turn</div>
                          <div className="font-semibold text-slate-900">{system.productionPerTurn ?? 0}</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-slate-500">
                        <div>Population Required: {system.populationRequired ?? 0}</div>
                        <div>
                          Cost/Turn: Food {system.costPerTurn?.food ?? 0} · Water {system.costPerTurn?.water ?? 0} · Credits {system.costPerTurn?.credits ?? 0}
                        </div>
                      </div>
                      <Button
                        disabled={!canUpgrade || upgradeMutation.isPending}
                        className="w-full"
                        onClick={() =>
                          upgradeMutation.mutate({
                            systemId: system.id,
                            targetLevel: nextLevel,
                          })
                        }
                      >
                        {canUpgrade ? `Upgrade to ${nextLevel}` : 'Max Level'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-4">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Assign Workforce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Search jobs by name/class"
                  value={jobSearch}
                  onChange={(event) => setJobSearch(event.target.value)}
                />
                <select
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-900"
                  value={selectedJobId}
                  onChange={(event) => setSelectedJobId(event.target.value)}
                >
                  <option value="">Select job</option>
                  {filteredJobs.map((job: CivilizationJob) => (
                    <option key={job.id} value={job.id}>
                      {job.name} ({job.class}/{job.subclass || 'general'})
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  value={assignCount}
                  onChange={(event) => setAssignCount(Math.max(1, Number(event.target.value) || 1))}
                />
                <Button
                  className="w-full"
                  disabled={!selectedJobId || assignMutation.isPending}
                  onClick={() => assignMutation.mutate({ jobId: selectedJobId, employees: assignCount })}
                >
                  Assign Workforce
                </Button>
              </CardContent>
            </Card>

            {selectedJob && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Selected Role Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{selectedJob.domain}</Badge>
                    <Badge variant="outline">{selectedJob.class}</Badge>
                    {selectedJob.subclass && <Badge variant="outline">{selectedJob.subclass}</Badge>}
                    <Badge variant="outline">{selectedJob.rarity}</Badge>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{selectedJob.name}</div>
                    <div className="text-sm text-slate-600">{selectedJob.description}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="text-slate-500">Food Demand</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedJob.resourceDemands.food}</div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="text-slate-500">Water Demand</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedJob.resourceDemands.water}</div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <div className="text-slate-500">Productivity</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedJob.resourceDemands.productivity}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-3">
              {currentAssignments.length === 0 ? (
                <Card className="bg-white border-slate-200">
                  <CardContent className="pt-6 text-center text-slate-500">No assignments yet.</CardContent>
                </Card>
              ) : (
                currentAssignments.map((assignment: WorkforceAssignment) => (
                  <Card key={assignment.id} className="bg-white border-slate-200">
                    <CardContent className="pt-6 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{jobsById.get(assignment.jobId)?.name || assignment.jobId}</div>
                        <div className="text-xs text-slate-500">
                          {(jobsById.get(assignment.jobId)?.class || 'unknown')}
                          {jobsById.get(assignment.jobId)?.subclass
                            ? ` / ${jobsById.get(assignment.jobId)?.subclass}`
                            : ''}
                        </div>
                        <div className="text-sm text-slate-500">Employees: {assignment.employees}</div>
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => removeMutation.mutate(assignment.id)}
                        disabled={removeMutation.isPending}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
