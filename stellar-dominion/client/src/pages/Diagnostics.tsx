import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Bug, AlertCircle, Zap, Terminal, Clock } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type IssueRecord = {
  id: string;
  title: string;
  severity: string;
  status: string;
  occurrences?: number;
  lastSeen?: string | number;
};

type WarningRecord = {
  id: string;
  level: string;
  title: string;
  message: string;
  source: string;
  timestamp: number;
};

type DebugRecord = {
  timestamp: number;
  level: string;
  source: string;
  message: string;
  duration?: number;
};

type WrappedResponse<T> = {
  success: boolean;
  data: T;
  count?: number;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload as T;
}

export default function Diagnostics() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const queryClient = useQueryClient();

  const { data: issuesResponse } = useQuery<WrappedResponse<IssueRecord[]>>({
    queryKey: ["diagnostics-issues"],
    queryFn: () => fetchJson<WrappedResponse<IssueRecord[]>>("/api/diagnostics/issues"),
    refetchInterval: 15000,
  });

  const { data: warningsResponse } = useQuery<WrappedResponse<WarningRecord[]>>({
    queryKey: ["diagnostics-warnings"],
    queryFn: () => fetchJson<WrappedResponse<WarningRecord[]>>("/api/diagnostics/warnings"),
    refetchInterval: 15000,
  });

  const { data: debugResponse } = useQuery<WrappedResponse<DebugRecord[]>>({
    queryKey: ["diagnostics-debug"],
    queryFn: () => fetchJson<WrappedResponse<DebugRecord[]>>("/api/diagnostics/debug?limit=100"),
    refetchInterval: 10000,
  });

  const acknowledgeWarningMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/diagnostics/warnings/${id}/acknowledge`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics-warnings"] });
    },
  });

  const resolveIssueMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/diagnostics/issues/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ notes: "Resolved from diagnostics console" }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics-issues"] });
    },
  });

  const issues = issuesResponse?.data || [];
  const warnings = warningsResponse?.data || [];
  const debugLogs = debugResponse?.data || [];
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved").length;
  const unresolvedIssues = issues.filter((issue) => issue.status !== "resolved").length;
  const warningAlerts = warnings.filter((warn) => warn.level === "alert" || warn.level === "emergency").length;
  const avgLogDuration = debugLogs.length
    ? Math.round(debugLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / debugLogs.length)
    : 0;

  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const levelColors: Record<string, string> = {
    emergency: "bg-red-100 text-red-800",
    alert: "bg-orange-100 text-orange-800",
    caution: "bg-yellow-100 text-yellow-800",
    notice: "bg-blue-100 text-blue-800",
  };

  const logLevelColors: Record<string, string> = {
    error: "text-red-600",
    warn: "text-orange-600",
    info: "text-blue-600",
    debug: "text-gray-600",
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2" data-testid="text-diagnostics-title">
            <Terminal className="w-8 h-8 text-primary" /> System Diagnostics
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Real-time error tracking, warnings, and debug information.</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-600">{issues.filter((issue) => issue.severity === "critical").length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold">Active Warnings</p>
                  <p className="text-3xl font-bold text-orange-600">{warnings.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-bold">Debug Entries</p>
                  <p className="text-3xl font-bold text-blue-600">{debugLogs.length}</p>
                </div>
                <Bug className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Open Issues</div><div className="text-2xl font-orbitron font-bold text-red-700">{unresolvedIssues}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Resolved Issues</div><div className="text-2xl font-orbitron font-bold text-emerald-700">{resolvedIssues}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">High Alerts</div><div className="text-2xl font-orbitron font-bold text-amber-700">{warningAlerts}</div></CardContent></Card>
          <Card className="bg-white border-slate-200"><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Avg Log Duration</div><div className="text-2xl font-orbitron font-bold text-blue-700">{avgLogDuration}ms</div></CardContent></Card>
        </div>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-indigo-900">Incident Response Doctrine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-indigo-900">
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Resolve critical issues first, then clear high-volume warnings to reduce alert fatigue.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Acknowledge repeated warnings only after root causes are documented in operations notes.</div>
            <div className="rounded border border-indigo-200 bg-white/70 p-3">Use debug duration trends to identify services that need profiling during peak events.</div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
            <TabsTrigger value="overview" className="font-orbitron">
              <Zap className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="issues" className="font-orbitron">
              <AlertTriangle className="w-4 h-4 mr-2" /> Issues
            </TabsTrigger>
            <TabsTrigger value="warnings" className="font-orbitron">
              <AlertCircle className="w-4 h-4 mr-2" /> Warnings
            </TabsTrigger>
            <TabsTrigger value="debug" className="font-orbitron">
              <Terminal className="w-4 h-4 mr-2" /> Debug Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" /> Recent Critical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issues.slice(0, 2).map((issue) => (
                      <div key={issue.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900">{issue.title}</h4>
                          <Badge className="bg-red-100 text-red-800">{issue.severity}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">
                          {issue.occurrences || 1} occurrences • Last seen {issue.lastSeen ? new Date(issue.lastSeen).toLocaleString?.() || issue.lastSeen : "recently"}
                        </p>
                      </div>
                    ))}
                    {issues.length === 0 && <div className="text-sm text-slate-500">No active issues detected.</div>}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" /> Recent Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {warnings.slice(0, 2).map((warn) => (
                      <div key={warn.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900">{warn.title}</h4>
                          <Badge className={levelColors[warn.level]}>{warn.level}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">{warn.source}</p>
                      </div>
                    ))}
                    {warnings.length === 0 && <div className="text-sm text-slate-500">No active warnings.</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>System Issues</CardTitle>
                <CardDescription>Detected problems and errors requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-4 border rounded-lg ${severityColors[issue.severity]}`}
                        data-testid={`issue-card-${issue.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold">{issue.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">{issue.status}</Badge>
                            <Badge>{issue.occurrences}x</Badge>
                          </div>
                        </div>
                        <p className="text-sm mb-3">Last seen: {issue.lastSeen ? new Date(issue.lastSeen).toLocaleString?.() || issue.lastSeen : "recently"}</p>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => resolveIssueMutation.mutate(issue.id)}>
                          Resolve Issue
                        </Button>
                      </div>
                    ))}
                    {issues.length === 0 && <div className="text-sm text-slate-500">No issues found.</div>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Warnings Tab */}
          <TabsContent value="warnings" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Active Warnings</CardTitle>
                <CardDescription>System alerts and cautions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {warnings.map((warn) => (
                      <div
                        key={warn.id}
                        className={`p-4 border rounded-lg ${levelColors[warn.level]}`}
                        data-testid={`warning-card-${warn.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold">{warn.title}</h4>
                            <p className="text-sm mt-1">{warn.message}</p>
                          </div>
                          <Badge variant="outline">{warn.source}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-slate-600">
                            {new Date(warn.timestamp).toLocaleTimeString()}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => acknowledgeWarningMutation.mutate(warn.id)}>
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    ))}
                    {warnings.length === 0 && <div className="text-sm text-slate-500">No warnings found.</div>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Debug Logs Tab */}
          <TabsContent value="debug" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Debug Logs</CardTitle>
                <CardDescription>System and application debug information</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4 font-mono text-sm">
                    {debugLogs.map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded" data-testid={`debug-log-${idx}`}>
                        <div className="flex items-start gap-3">
                          <span className={`font-bold ${logLevelColors[log.level]}`}>[{log.level.toUpperCase()}]</span>
                          <span className="text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="text-primary font-bold">{log.source}</span>
                        </div>
                        <p className="mt-1 text-slate-700">{log.message}</p>
                        {log.duration && <p className="text-xs text-slate-500 mt-1">Duration: {log.duration}ms</p>}
                      </div>
                    ))}
                    {debugLogs.length === 0 && <div className="text-sm text-slate-500">No debug entries available.</div>}
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
