import { useEffect, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Clock,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Loader2,
  Trash2,
  Edit,
  Settings,
  TrendingUp,
  Calendar,
  Gauge,
} from "lucide-react";

type CronJob = {
  id: string;
  name: string;
  description: string | null;
  jobType: string;
  scheduleType: string;
  intervalMs: number;
  enabled: boolean;
  lastRunAt: string | null;
  lastRunDurationMs: number;
  lastRunStatus: string;
  lastRunError: string | null;
  runCount: number;
  consecutiveFailures: number;
  params: Record<string, any>;
};

type CronLog = {
  id: string;
  jobId: string;
  jobName: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number;
  error: string | null;
  output: Record<string, any>;
};

type GameTick = {
  id: string;
  tickType: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number;
  recordsProcessed: number;
  recordsAffected: number;
  metadata: Record<string, any>;
};

type CronTimer = {
  id: string;
  jobId: string;
  createdAt: string;
  expiresAt: string;
  metadata: Record<string, any>;
};

export default function CronJobsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "enabled" | "disabled" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch cron jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["cron-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/cron/jobs");
      if (!res.ok) throw new Error("Failed to fetch cron jobs");
      return res.json() as Promise<{ success: boolean; jobs: CronJob[] }>;
    },
    refetchInterval: 5000,
  });

  // Fetch cron logs
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["cron-logs"],
    queryFn: async () => {
      const res = await fetch("/api/cron/logs?limit=50");
      if (!res.ok) throw new Error("Failed to fetch cron logs");
      return res.json() as Promise<{ success: boolean; logs: CronLog[] }>;
    },
    refetchInterval: 10000,
  });

  // Fetch game ticks
  const { data: ticksData } = useQuery({
    queryKey: ["game-ticks"],
    queryFn: async () => {
      const res = await fetch("/api/cron/ticks?limit=20");
      if (!res.ok) throw new Error("Failed to fetch game ticks");
      return res.json() as Promise<{ success: boolean; ticks: GameTick[] }>;
    },
    refetchInterval: 10000,
  });

  // Fetch timers
  const { data: timersData } = useQuery({
    queryKey: ["cron-timers"],
    queryFn: async () => {
      const res = await fetch("/api/cron/timers");
      if (!res.ok) throw new Error("Failed to fetch timers");
      return res.json() as Promise<{ success: boolean; timers: CronTimer[] }>;
    },
    refetchInterval: 15000,
  });

  // Toggle job
  const toggleJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`/api/cron/jobs/${jobId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle job");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cron-jobs"] });
      toast({ title: "Job toggled successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    },
  });

  // Run job manually
  const runJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`/api/cron/jobs/${jobId}/run`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to run job");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cron-jobs", "cron-logs"] });
      toast({ title: "Job executed successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    },
  });

  const jobs = jobsData?.jobs || [];
  const logs = logsData?.logs || [];
  const ticks = ticksData?.ticks || [];
  const timers = timersData?.timers || [];

  // Filter jobs
  let filteredJobs = jobs;
  if (filterStatus === "enabled") {
    filteredJobs = filteredJobs.filter((j) => j.enabled);
  } else if (filterStatus === "disabled") {
    filteredJobs = filteredJobs.filter((j) => !j.enabled);
  } else if (filterStatus === "failed") {
    filteredJobs = filteredJobs.filter((j) => j.consecutiveFailures > 0);
  }

  if (searchQuery) {
    filteredJobs = filteredJobs.filter(
      (j) =>
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Group jobs by category
  const groupedJobs = {
    core: filteredJobs.filter((j) =>
      ["resource_tick", "turn_tick", "construction_tick", "refinery_tick"].includes(j.id)
    ),
    research: filteredJobs.filter((j) =>
      ["research_tick", "research_xp_distribution"].includes(j.id)
    ),
    fleet: filteredJobs.filter((j) =>
      ["fleet_maintenance", "mission_processing", "expedition_tick"].includes(j.id)
    ),
    economy: filteredJobs.filter((j) =>
      ["market_tick", "resource_trading_settlement", "merchant_stock_refresh"].includes(j.id)
    ),
    crafting: filteredJobs.filter((j) =>
      ["smithy_production", "blueprint_assembly"].includes(j.id)
    ),
    defense: filteredJobs.filter((j) =>
      ["orbital_station_maintenance", "moon_operations", "spore_drive_cooldown"].includes(j.id)
    ),
    events: filteredJobs.filter((j) =>
      ["anomaly_respawn", "raid_operations", "raid_rewards_distribution", "mega_structure_operations"].includes(j.id)
    ),
    systems: filteredJobs.filter((j) =>
      [
        "government_progression",
        "civilization_effects",
        "commander_experience",
        "alliance_treasury",
        "alliance_tech_sharing",
      ].includes(j.id)
    ),
    missions: filteredJobs.filter((j) =>
      [
        "daily_missions_reset",
        "weekly_missions_reset",
        "season_pass_progression",
        "achievement_checker",
      ].includes(j.id)
    ),
    resets: filteredJobs.filter((j) =>
      ["daily_reset", "weekly_reset", "monthly_reset"].includes(j.id)
    ),
    maintenance: filteredJobs.filter((j) =>
      [
        "maintenance_tick",
        "inactive_player_warning",
        "server_statistics",
        "backup_critical_data",
        "limited_event_processor",
        "leaderboard_update",
      ].includes(j.id)
    ),
  };

  const categoriesWithJobs = Object.entries(groupedJobs).filter(([_, jobs]) => jobs.length > 0);

  return (
    <GameLayout>
      <div className="cron-admin-container space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-8 h-8 text-blue-600" />
            Cron Job Management System
          </h1>
          <p className="text-slate-600 mt-2">
            Manage all server-side job scheduling, game ticks, and system maintenance tasks
          </p>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="ticks" className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Ticks
            </TabsTrigger>
            <TabsTrigger value="timers" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Timers
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* JOBS TAB */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="jobs-controls flex gap-2 mb-4">
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-slate-200 rounded-md text-sm"
              >
                <option value="all">All Jobs</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {jobsLoading ? (
              <Card>
                <CardContent className="py-12 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </CardContent>
              </Card>
            ) : categoriesWithJobs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-slate-500">
                  No cron jobs found matching your criteria
                </CardContent>
              </Card>
            ) : (
              categoriesWithJobs.map(([category, categoryJobs]) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize text-lg">{category} Jobs</CardTitle>
                        <CardDescription>{categoryJobs.length} job(s)</CardDescription>
                      </div>
                      <Badge variant="secondary">{categoryJobs.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Job Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Interval</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead>Run Count</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryJobs.map((job) => (
                          <TableRow key={job.id} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">{job.name}</span>
                                <span className="text-xs text-slate-500">{job.id}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {job.enabled ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <PauseCircle className="w-4 h-4 text-slate-400" />
                                )}
                                <span className="text-sm">
                                  {job.enabled ? "Enabled" : "Disabled"}
                                </span>
                                {job.consecutiveFailures > 0 && (
                                  <Badge variant="destructive" className="ml-auto">
                                    {job.consecutiveFailures} failures
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              <Badge variant="outline" className="capitalize">
                                {job.jobType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {(job.intervalMs / 1000).toFixed(0)}s
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {job.lastRunAt
                                ? new Date(job.lastRunAt).toLocaleTimeString()
                                : "Never"}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {job.runCount}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleJobMutation.mutate(job.id)}
                                  disabled={toggleJobMutation.isPending}
                                  title={job.enabled ? "Disable" : "Enable"}
                                >
                                  {job.enabled ? (
                                    <PauseCircle className="w-4 h-4" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => runJobMutation.mutate(job.id)}
                                  disabled={runJobMutation.isPending}
                                  title="Run now"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Cron Job Execution Logs
                </CardTitle>
                <CardDescription>Recent job execution history and results</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">No logs available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium">{log.jobName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={log.status === "success" ? "default" : "destructive"}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {new Date(log.startedAt).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.durationMs}ms
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                              {log.error ? (
                                <span className="text-red-600">{log.error}</span>
                              ) : (
                                JSON.stringify(log.output).substring(0, 50)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TICKS TAB */}
          <TabsContent value="ticks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Game Tick History
                </CardTitle>
                <CardDescription>Server game tick processing history</CardDescription>
              </CardHeader>
              <CardContent>
                {!ticks || ticks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">No tick data available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tick Type</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Records Processed</TableHead>
                          <TableHead>Records Affected</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ticks.map((tick) => (
                          <TableRow key={tick.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium capitalize">
                              {tick.tickType}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(tick.startedAt).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="text-sm font-mono">
                              {tick.durationMs}ms
                            </TableCell>
                            <TableCell className="text-sm">
                              {tick.recordsProcessed}
                            </TableCell>
                            <TableCell className="text-sm font-medium text-green-600">
                              {tick.recordsAffected}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TIMERS TAB */}
          <TabsContent value="timers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Active Timers
                </CardTitle>
                <CardDescription>Custom timers and scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                {!timers || timers.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">No active timers</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job ID</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Metadata</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timers.map((timer) => (
                          <TableRow key={timer.id}>
                            <TableCell className="font-mono text-sm">{timer.jobId}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(timer.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(timer.expiresAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                              {JSON.stringify(timer.metadata)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Cron Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{jobs.length}</div>
                  <p className="text-xs text-slate-500 mt-1">
                    {jobs.filter((j) => j.enabled).length} enabled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Recent Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {logs.length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {logs.filter((l) => l.status === "success").length} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Failed Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {jobs.filter((j) => j.consecutiveFailures > 0).length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Requiring attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Active Timers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {timers?.length || 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Scheduled events</p>
                </CardContent>
              </Card>
            </div>

            {/* Job Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance Summary</CardTitle>
                <CardDescription>Statistics for top 10 most executed jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs
                    .sort((a, b) => b.runCount - a.runCount)
                    .slice(0, 10)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{job.name}</p>
                          <p className="text-xs text-slate-500">
                            Last run: {job.lastRunDurationMs}ms
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{job.runCount}</p>
                          <p className="text-xs text-slate-500">executions</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        .cron-admin-container {
          padding: 1rem;
        }
        
        .page-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
      `}</style>
    </GameLayout>
  );
}
