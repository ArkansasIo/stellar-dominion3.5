import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock, Play, Pause, RotateCcw, CheckCircle2, XCircle, AlertTriangle,
  Timer, Activity, Database, Zap, RefreshCw, BarChart3, Settings,
  Calendar, Factory, Compass,
} from "lucide-react";
import { useState } from "react";

interface CronJob {
  id: string;
  name: string;
  description: string | null;
  job_type: string;
  schedule_type: string;
  interval_ms: number;
  cron_expression: string | null;
  enabled: boolean;
  last_run_at: string | null;
  last_run_duration_ms: number;
  last_run_status: string;
  last_run_error: string | null;
  run_count: number;
  consecutive_failures: number;
  max_failures: number;
  params: Record<string, any>;
}

interface CronLog {
  id: number;
  job_id: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: string;
  records_processed: number;
  records_affected: number;
  error_message: string | null;
}

interface GameTick {
  id: number;
  tick_type: string;
  tick_number: number;
  started_at: string;
  finished_at: string | null;
  duration_ms: number;
  players_processed: number;
  resources_updated: number;
  constructions_completed: number;
  turns_generated: number;
  errors: number;
}

const JOB_ICONS: Record<string, any> = {
  resource_tick: Zap,
  turn_tick: Clock,
  construction_tick: RotateCcw,
  daily_reset: RefreshCw,
  weekly_reset: Calendar,
  market_tick: BarChart3,
  maintenance_tick: Settings,
  refinery_tick: Factory,
  anomaly_respawn: Compass,
};


function formatInterval(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h`;
  return `${Math.round(ms / 86400000)}d`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleString();
}

export default function CronDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("jobs");
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [editInterval, setEditInterval] = useState<number>(10000);
  const [editCronExpr, setEditCronExpr] = useState<string>("");

  const { data: jobsData } = useQuery<{ success: boolean; jobs: CronJob[] }>({
    queryKey: ["/api/cron/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/cron/jobs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: logsData } = useQuery<{ success: boolean; logs: CronLog[] }>({
    queryKey: ["/api/cron/logs"],
    queryFn: async () => {
      const res = await fetch("/api/cron/logs?limit=50", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const { data: ticksData } = useQuery<{ success: boolean; ticks: GameTick[] }>({
    queryKey: ["/api/cron/ticks"],
    queryFn: async () => {
      const res = await fetch("/api/cron/ticks?limit=20", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ jobId, enabled }: { jobId: string; enabled: boolean }) => {
      const res = await fetch(`/api/cron/jobs/${jobId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cron/jobs"] });
      toast({ title: "Job updated" });
    },
  });

  const runMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`/api/cron/jobs/${jobId}/run`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cron/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cron/logs"] });
      toast({ title: "Job executed" });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ jobId, intervalMs, cronExpression }: { jobId: string; intervalMs?: number; cronExpression?: string }) => {
      const res = await fetch(`/api/cron/jobs/${jobId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ intervalMs, cronExpression }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cron/jobs"] });
      toast({ title: "Schedule updated" });
      setEditingJob(null);
    },
  });

  const jobs = jobsData?.jobs || [];
  const logs = logsData?.logs || [];
  const ticks = ticksData?.ticks || [];

  const activeJobs = jobs.filter((j) => j.enabled).length;
  const failedJobs = jobs.filter((j) => j.consecutive_failures > 0).length;
  const totalRuns = jobs.reduce((sum, j) => sum + j.run_count, 0);

  return (
    <GameLayout title="Cron Dashboard" subtitle="Server-side job scheduling and game ticks">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{activeJobs}</div>
              <div className="text-xs text-muted-foreground">Active Jobs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{failedJobs}</div>
              <div className="text-xs text-muted-foreground">Failed Jobs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{totalRuns}</div>
              <div className="text-xs text-muted-foreground">Total Runs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{ticks.length}</div>
              <div className="text-xs text-muted-foreground">Game Ticks</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="ticks">Game Ticks</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-3">
            {jobs.map((job) => {
              const Icon = JOB_ICONS[job.id] || Clock;
              const isEditing = editingJob === job.id;
              return (
                <Card key={job.id} className={cn("transition-all", !job.enabled && "opacity-60")}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", job.enabled ? "bg-green-500/10" : "bg-slate-100")}>
                          <Icon className={cn("w-5 h-5", job.enabled ? "text-green-500" : "text-slate-400")} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{job.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Every {formatInterval(job.interval_ms)} | Runs: {job.run_count} | Last: {formatTime(job.last_run_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.consecutive_failures > 0 && (
                          <Badge variant="destructive" className="text-[10px]">
                            {job.consecutive_failures} failures
                          </Badge>
                        )}
                        <Badge variant={job.last_run_status === "success" ? "default" : "destructive"} className="text-[10px]">
                          {job.last_run_status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDuration(job.last_run_duration_ms)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (isEditing) {
                              setEditingJob(null);
                            } else {
                              setEditingJob(job.id);
                              setEditInterval(job.interval_ms);
                              setEditCronExpr(job.cron_expression || "");
                            }
                          }}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleMutation.mutate({ jobId: job.id, enabled: !job.enabled })}
                          disabled={toggleMutation.isPending}
                        >
                          {job.enabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runMutation.mutate(job.id)}
                          disabled={runMutation.isPending}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {job.last_run_error && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">{job.last_run_error}</div>
                    )}
                    {isEditing && (
                      <div className="mt-3 p-3 bg-slate-50 rounded border space-y-3">
                        <div className="text-xs font-medium text-muted-foreground">Schedule Configuration</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground">Interval (ms)</label>
                            <input
                              type="number"
                              value={editInterval}
                              onChange={(e) => setEditInterval(parseInt(e.target.value) || 0)}
                              className="w-full mt-1 px-2 py-1 text-xs border rounded bg-white"
                            />
                            <div className="text-[10px] text-muted-foreground mt-1">
                              = {formatInterval(editInterval)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Cron Expression (optional)</label>
                            <input
                              type="text"
                              value={editCronExpr}
                              onChange={(e) => setEditCronExpr(e.target.value)}
                              placeholder="*/5 * * * *"
                              className="w-full mt-1 px-2 py-1 text-xs border rounded bg-white font-mono"
                            />
                            <div className="text-[10px] text-muted-foreground mt-1">
                              e.g. */10 * * * * (every 10 min)
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => scheduleMutation.mutate({
                              jobId: job.id,
                              intervalMs: editInterval,
                              cronExpression: editCronExpr || undefined,
                            })}
                            disabled={scheduleMutation.isPending}
                          >
                            Save Schedule
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingJob(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="logs" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Cron Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 font-mono text-xs">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-2 rounded bg-slate-50">
                        {log.status === "success" ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                        )}
                        <span className="text-muted-foreground">{formatTime(log.started_at)}</span>
                        <span className="font-medium">{log.job_id}</span>
                        <span className="text-muted-foreground">{log.duration_ms}ms</span>
                        {log.records_affected > 0 && (
                          <Badge variant="secondary" className="text-[10px]">{log.records_affected} affected</Badge>
                        )}
                        {log.error_message && (
                          <span className="text-red-500 truncate max-w-[200px]">{log.error_message}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticks" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Game Tick History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 text-xs">
                    {ticks.map((tick) => (
                      <div key={tick.id} className="flex items-center gap-4 p-3 rounded bg-slate-50">
                        <Badge variant="outline" className="capitalize">{tick.tick_type}</Badge>
                        <span className="text-muted-foreground">{formatTime(tick.started_at)}</span>
                        <span>{tick.duration_ms}ms</span>
                        {tick.players_processed > 0 && <span>{tick.players_processed} players</span>}
                        {tick.resources_updated > 0 && <span className="text-green-600">{tick.resources_updated} resources</span>}
                        {tick.constructions_completed > 0 && <span className="text-blue-600">{tick.constructions_completed} built</span>}
                        {tick.turns_generated > 0 && <span className="text-amber-600">{tick.turns_generated} turns</span>}
                        {tick.errors > 0 && <span className="text-red-600">{tick.errors} errors</span>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
