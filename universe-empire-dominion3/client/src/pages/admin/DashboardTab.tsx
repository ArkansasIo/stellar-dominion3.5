import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Users, Globe, Cpu, HardDrive, MemoryStick, RefreshCw, Download, Pause, Play, AlertTriangle, Rocket } from "lucide-react";
import type { SystemMetricsSnapshot } from "@shared/config/statusConfig";
import type { AdminOverviewResponse, AdminAuditResponse, ServerSettings } from "./types";
import { formatAdminUptime } from "./types";

type Props = {
  overviewData: AdminOverviewResponse | undefined;
  auditData: AdminAuditResponse | undefined;
  statusData: { success: boolean; data: SystemMetricsSnapshot } | undefined;
  serverForm: ServerSettings;
  privilegedSessionFresh: boolean;
  canUseLiveOps: boolean;
  onBackup: () => void;
  onRestart: () => void;
  onToggleMaintenance: () => void;
  onNavigateToPlayers: () => void;
};

export function DashboardTab({ overviewData, auditData, statusData, serverForm, privilegedSessionFresh, canUseLiveOps, onBackup, onRestart, onToggleMaintenance, onNavigateToPlayers }: Props) {
  const cpuUsage = Math.round(statusData?.data.cpu.usage ?? 0);
  const memUsage = Math.round(statusData?.data.memory.usage ?? 0);
  const diskUsage = Math.round(statusData?.data.disk.usage ?? 0);
  const healthScore = statusData?.data.healthCheck.overallScore ?? 0;
  const healthStatus = statusData?.data.healthCheck.status ?? "offline";
  const recentLogs = (auditData?.logs || []).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase text-slate-400">Total Players</div>
              <div className="text-2xl font-bold text-slate-100">{overviewData?.totalUsers ?? 0}</div>
              <div className="text-xs text-slate-500">{overviewData?.activeUsersEstimate ?? 0} online</div>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase text-slate-400">Active Universes</div>
              <div className="text-2xl font-bold text-slate-100">1</div>
              <div className="text-xs text-slate-500">{serverForm.universeName}</div>
            </div>
            <Globe className="w-6 h-6 text-emerald-500" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase text-slate-400">CPU / Memory</div>
              <div className="text-2xl font-bold text-slate-100">{cpuUsage}% / {memUsage}%</div>
              <div className="text-xs text-slate-500">Load: {(statusData?.data.cpu.loadAverage.oneMinute ?? 0).toFixed(2)}</div>
            </div>
            <Cpu className="w-6 h-6 text-cyan-500" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase text-slate-400">Uptime</div>
              <div className="text-2xl font-bold text-slate-100">{formatAdminUptime((statusData?.data.cpu.uptime ?? 0) * 1000)}</div>
              <div className="text-xs text-slate-500">{(statusData?.data.requests.requestsPerSecond ?? 0).toFixed(1)} req/s</div>
            </div>
            <Activity className="w-6 h-6 text-violet-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-cyan-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-200">CPU</div>
              <div className="text-sm text-slate-400">{cpuUsage}% usage</div>
              <Progress value={cpuUsage} className="mt-1 h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-start gap-3">
            <MemoryStick className="w-5 h-5 text-violet-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-200">Memory</div>
              <div className="text-sm text-slate-400">{memUsage}% · {statusData?.data.memory.used ?? 0}/{statusData?.data.memory.total ?? 0} MB</div>
              <Progress value={memUsage} className="mt-1 h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-200">Disk</div>
              <div className="text-sm text-slate-400">{diskUsage}% · {statusData?.data.disk.used ?? 0}/{statusData?.data.disk.total ?? 0} GB</div>
              <Progress value={diskUsage} className="mt-1 h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardHeader><CardTitle className="text-slate-100 text-lg">System Health</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${healthScore >= 80 ? "bg-green-500" : healthScore >= 50 ? "bg-amber-500" : "bg-red-500"}`} />
              <span className="text-slate-300">Overall: {healthStatus} (Score: {healthScore})</span>
            </div>
            {Object.entries(statusData?.data.healthCheck.checks || {}).map(([key, check]) => (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${check.status === "ok" ? "bg-green-500" : check.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                <span className="text-sm text-slate-400 capitalize">{key}: {check.message || check.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardHeader><CardTitle className="text-slate-100 text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onBackup} disabled={!privilegedSessionFresh}>
              <Download className="w-4 h-4 mr-2" /> Backup
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onRestart} disabled={!canUseLiveOps || !privilegedSessionFresh}>
              <RefreshCw className="w-4 h-4 mr-2" /> Restart
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onToggleMaintenance}>
              {serverForm.maintenanceMode ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {serverForm.maintenanceMode ? "Disable Maint." : "Maintenance"}
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onNavigateToPlayers}>
              <Users className="w-4 h-4 mr-2" /> Players
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader><CardTitle className="text-slate-100 text-lg">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-300 truncate">{log.action} {log.targetUserId ? `→ ${log.targetUserId}` : ""}</div>
                    <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {recentLogs.length === 0 && <div className="text-slate-500 text-sm">No recent activity</div>}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
