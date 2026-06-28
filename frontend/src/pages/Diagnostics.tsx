import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Bug, AlertCircle, Zap, Terminal, Clock } from "lucide-react";
import { useState } from "react";

export default function Diagnostics() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const mockIssues = [
    {
      id: "issue_1",
      title: "High Memory Usage Detected",
      severity: "critical",
      status: "open",
      occurrences: 12,
      lastSeen: "5 minutes ago",
    },
    {
      id: "issue_2",
      title: "Database Query Timeout",
      severity: "high",
      status: "investigating",
      occurrences: 3,
      lastSeen: "30 minutes ago",
    },
    {
      id: "issue_3",
      title: "API Response Degradation",
      severity: "medium",
      status: "open",
      occurrences: 5,
      lastSeen: "1 hour ago",
    },
  ];

  const mockWarnings = [
    {
      id: "warn_1",
      level: "emergency",
      title: "CPU Load Critical",
      message: "Server CPU usage exceeded 90% for 2+ minutes",
      source: "System Monitor",
      timestamp: Date.now() - 60000,
    },
    {
      id: "warn_2",
      level: "alert",
      title: "Disk Space Low",
      message: "Available disk space below 15%",
      source: "Storage Monitor",
      timestamp: Date.now() - 300000,
    },
    {
      id: "warn_3",
      level: "caution",
      title: "Cache Hit Rate Declining",
      message: "Cache hit rate dropped to 65%",
      source: "Cache Manager",
      timestamp: Date.now() - 600000,
    },
  ];

  const mockDebugLogs = [
    {
      timestamp: Date.now(),
      level: "error",
      source: "DatabaseService",
      message: "Connection pool exhausted",
      duration: 245,
    },
    {
      timestamp: Date.now() - 30000,
      level: "warn",
      source: "AuthService",
      message: "Brute force login attempt detected from 192.168.1.1",
    },
    {
      timestamp: Date.now() - 60000,
      level: "info",
      source: "CacheService",
      message: "Cache invalidation completed",
      duration: 125,
    },
  ];

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
                  <p className="text-3xl font-bold text-red-600">3</p>
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
                  <p className="text-3xl font-bold text-orange-600">8</p>
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
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                </div>
                <Bug className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                    {mockIssues.slice(0, 2).map((issue) => (
                      <div key={issue.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900">{issue.title}</h4>
                          <Badge className="bg-red-100 text-red-800">{issue.severity}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">
                          {issue.occurrences} occurrences • Last seen {issue.lastSeen}
                        </p>
                      </div>
                    ))}
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
                    {mockWarnings.slice(0, 2).map((warn) => (
                      <div key={warn.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-slate-900">{warn.title}</h4>
                          <Badge className={levelColors[warn.level]}>{warn.level}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">{warn.source}</p>
                      </div>
                    ))}
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
                    {mockIssues.map((issue) => (
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
                        <p className="text-sm mb-3">Last seen: {issue.lastSeen}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    ))}
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
                    {mockWarnings.map((warn) => (
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
                          <Button size="sm" variant="ghost">
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    {mockDebugLogs.map((log, idx) => (
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
