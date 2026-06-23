import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, Users, Activity, Server, Database, Ban, Lock, Eye, Terminal, RefreshCw, AlertTriangle, UserCog, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AdminUser = {
   id: string;
   name: string;
   email: string;
   status: "active" | "muted" | "banned";
   role: string;
   lastLogin: string | null;
   ip: string;
};

type AdminUsersResponse = {
   users: AdminUser[];
};

type AdminOverviewResponse = {
   totalUsers: number;
   bannedUsers: number;
   mutedUsers: number;
   activeUsersEstimate: number;
};

type AdminAuditResponse = {
   logs: Array<{
      id: string;
      timestamp: number;
      actorId: string;
      action: string;
      targetUserId?: string;
      details?: string;
   }>;
};

type AdminConsoleExecuteResponse = {
   success: boolean;
   output: string;
};

type AdminUserDetailResponse = {
   user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: "active" | "muted" | "banned";
      createdAt: string | null;
      lastLogin: string | null;
   };
};

type AdminSettings = {
   maintenanceMode: boolean;
   peaceMode: boolean;
   resourceRate: number;
   gameSpeed: number;
   fleetSpeed: number;
   allowNewRegistrations: boolean;
   adminBroadcastEnabled: boolean;
};

type AdminSettingsResponse = {
   settings: AdminSettings;
};

type AdminAccountsResponse = {
   accounts: Array<{
      id: string;
      userId: string;
      role: string;
      permissions: string[];
      createdAt: string;
      username: string;
      email: string;
   }>;
};

type AdminOperationsResponse = {
   operations: Array<{
      id: string;
      type: "backup_snapshot" | "reset_universe" | "restart_server";
      status: "queued" | "completed";
      requestedBy: string;
      requestedAt: number;
      completedAt?: number;
      notes?: string;
   }>;
};

type CronJobRecord = {
   id: string;
   name: string;
   description: string | null;
   job_type: string;
   schedule_type: string;
   interval_ms: number;
   enabled: boolean;
   last_run_at: string | null;
   last_run_duration_ms: number;
   last_run_status: string;
   last_run_error: string | null;
   run_count: number;
   consecutive_failures: number;
};

type CronJobsResponse = {
   success: boolean;
   jobs: CronJobRecord[];
};

type CronLogRecord = {
   id: number;
   job_id: string;
   started_at: string;
   finished_at: string | null;
   duration_ms: number;
   status: string;
   records_processed: number;
   records_affected: number;
   error_message: string | null;
};

type CronLogsResponse = {
   success: boolean;
   logs: CronLogRecord[];
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

export default function Admin() {
   const { config, updateConfig, addEvent } = useGame();
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const [search, setSearch] = useState("");
   const [adminIdentifier, setAdminIdentifier] = useState("");
   const [adminRoleInput, setAdminRoleInput] = useState("moderator");
  
   const { data: usersData } = useQuery<AdminUsersResponse>({
      queryKey: ["admin-users"],
      queryFn: () => fetchJson<AdminUsersResponse>("/api/admin/users"),
      refetchInterval: 20000,
   });

   const { data: overviewData } = useQuery<AdminOverviewResponse>({
      queryKey: ["admin-overview"],
      queryFn: () => fetchJson<AdminOverviewResponse>("/api/admin/overview"),
      refetchInterval: 20000,
   });

   const { data: auditData } = useQuery<AdminAuditResponse>({
      queryKey: ["admin-audit"],
      queryFn: () => fetchJson<AdminAuditResponse>("/api/admin/audit"),
      refetchInterval: 15000,
   });

   const { data: settingsData } = useQuery<AdminSettingsResponse>({
      queryKey: ["admin-settings"],
      queryFn: () => fetchJson<AdminSettingsResponse>("/api/admin/settings"),
      refetchInterval: 20000,
   });

   const { data: accountsData } = useQuery<AdminAccountsResponse>({
      queryKey: ["admin-accounts"],
      queryFn: () => fetchJson<AdminAccountsResponse>("/api/admin/accounts"),
      refetchInterval: 20000,
   });

   const { data: operationsData } = useQuery<AdminOperationsResponse>({
      queryKey: ["admin-operations"],
      queryFn: () => fetchJson<AdminOperationsResponse>("/api/admin/operations"),
      refetchInterval: 15000,
   });

   const { data: cronJobsData } = useQuery<CronJobsResponse>({
      queryKey: ["admin-cron-jobs"],
      queryFn: () => fetchJson<CronJobsResponse>("/api/cron/jobs"),
      refetchInterval: 10000,
   });

   const { data: cronLogsData } = useQuery<CronLogsResponse>({
      queryKey: ["admin-cron-logs"],
      queryFn: () => fetchJson<CronLogsResponse>("/api/cron/logs?limit=30"),
      refetchInterval: 10000,
   });

   const toggleCronMutation = useMutation({
      mutationFn: ({ jobId, enabled }: { jobId: string; enabled: boolean }) =>
         fetchJson(`/api/cron/jobs/${jobId}/toggle`, {
            method: "POST",
            body: JSON.stringify({ enabled }),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-cron-jobs"] });
         toast({ title: "Cron job updated", description: "Job toggle state saved." });
      },
      onError: (error: Error) => {
         toast({ title: "Toggle failed", description: error.message, variant: "destructive" });
      },
   });

   const runCronMutation = useMutation({
      mutationFn: (jobId: string) =>
         fetchJson(`/api/cron/jobs/${jobId}/run`, { method: "POST" }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-cron-jobs"] });
         queryClient.invalidateQueries({ queryKey: ["admin-cron-logs"] });
         toast({ title: "Job executed", description: "Cron job triggered successfully." });
      },
      onError: (error: Error) => {
         toast({ title: "Execution failed", description: error.message, variant: "destructive" });
      },
   });

   const updateStatusMutation = useMutation({
      mutationFn: ({ userId, status }: { userId: string; status: "active" | "muted" | "banned" }) =>
         fetchJson(`/api/admin/users/${userId}/status`, {
            method: "POST",
            body: JSON.stringify({ status }),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-users"] });
         queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      },
      onError: (error: Error) => {
         toast({ title: "Moderation update failed", description: error.message, variant: "destructive" });
      },
   });

   const consoleCommandMutation = useMutation({
      mutationFn: (command: string) =>
         fetchJson<AdminConsoleExecuteResponse>("/api/admin/console/execute", {
            method: "POST",
            body: JSON.stringify({ command }),
         }),
      onSuccess: (result) => {
         setConsoleLog((prev) => [...prev, result.output]);
         queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      },
      onError: (error: Error) => {
         setConsoleLog((prev) => [...prev, `Command failed: ${error.message}`]);
         toast({ title: "Command failed", description: error.message, variant: "destructive" });
      },
   });

   const viewUserDetailMutation = useMutation({
      mutationFn: (userId: string) => fetchJson<AdminUserDetailResponse>(`/api/admin/users/${userId}`),
      onSuccess: (payload) => {
         const user = payload.user;
         toast({
            title: `User: ${user.name}`,
            description: `${user.email} • ${user.role} • ${user.status} • Joined ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}`,
         });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to load user details", description: error.message, variant: "destructive" });
      },
   });

   const patchSettingsMutation = useMutation({
      mutationFn: (nextSettings: Partial<AdminSettings>) =>
         fetchJson<AdminSettingsResponse>("/api/admin/settings", {
            method: "PATCH",
            body: JSON.stringify(nextSettings),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Admin settings saved", description: "Live admin settings updated." });
      },
      onError: (error: Error) => {
         toast({ title: "Settings update failed", description: error.message, variant: "destructive" });
      },
   });

   const createAdminAccountMutation = useMutation({
      mutationFn: ({ identifier, role }: { identifier: string; role: string }) =>
         fetchJson("/api/admin/accounts", {
            method: "POST",
            body: JSON.stringify({ identifier, role }),
         }),
      onSuccess: () => {
         setAdminIdentifier("");
         queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Admin account created", description: "User promoted successfully." });
      },
      onError: (error: Error) => {
         toast({ title: "Failed to create admin account", description: error.message, variant: "destructive" });
      },
   });

   const removeAdminAccountMutation = useMutation({
      mutationFn: (userId: string) =>
         fetchJson(`/api/admin/accounts/${userId}`, {
            method: "DELETE",
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Admin account removed", description: "Admin privileges revoked." });
      },
      onError: (error: Error) => {
         toast({ title: "Failed to remove admin account", description: error.message, variant: "destructive" });
      },
   });

   const queueBackupMutation = useMutation({
      mutationFn: () => fetchJson("/api/admin/operations/backup", { method: "POST" }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Backup created", description: "Snapshot operation completed." });
      },
      onError: (error: Error) => {
         toast({ title: "Backup failed", description: error.message, variant: "destructive" });
      },
   });

   const queueRestartMutation = useMutation({
      mutationFn: () => fetchJson("/api/admin/operations/restart", { method: "POST" }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Restart queued", description: "Server restart request has been queued." });
      },
      onError: (error: Error) => {
         toast({ title: "Restart request failed", description: error.message, variant: "destructive" });
      },
   });

   const queueResetMutation = useMutation({
      mutationFn: () => fetchJson("/api/admin/operations/reset-universe", { method: "POST", body: JSON.stringify({ confirmText: "RESET" }) }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
         queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
         toast({ title: "Universe reset complete", description: "Reset operation completed and starter states were rebuilt." });
      },
      onError: (error: Error) => {
         toast({ title: "Reset request failed", description: error.message, variant: "destructive" });
      },
   });

   const adminUsers = usersData?.users || [];
   const filteredUsers = adminUsers.filter((user) => {
      const key = search.toLowerCase();
      if (!key) return true;
      return user.name.toLowerCase().includes(key) || user.email.toLowerCase().includes(key);
   });

  const [consoleCommand, setConsoleCommand] = useState("");
  const [consoleLog, setConsoleLog] = useState<string[]>([
     "> System initialized...",
     "> Admin panel loaded.",
     "> Waiting for input..."
  ]);

  const handleBan = (id: string) => {
     const target = adminUsers.find((user) => user.id === id);
     if (!target) return;
     updateStatusMutation.mutate({ userId: id, status: target.status === "banned" ? "active" : "banned" });
  };

  const handleMute = (id: string) => {
     const target = adminUsers.find((user) => user.id === id);
     if (!target) return;
     updateStatusMutation.mutate({ userId: id, status: target.status === "muted" ? "active" : "muted" });
  };

  const executeCommand = () => {
     if (!consoleCommand) return;
     
     const cmd = consoleCommand.trim();
     setConsoleLog(prev => [...prev, `> ${cmd}`]);
     if (cmd === "clear") {
        setConsoleLog([]);
        setConsoleCommand("");
        return;
     }

     consoleCommandMutation.mutate(cmd);
     
     setConsoleCommand("");
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 text-xs">Restricted Area</Badge>
              <Badge variant="outline" className="border-red-500 text-red-500 uppercase tracking-widest px-3 py-1 text-xs animate-pulse">Level 5 Clearance</Badge>
           </div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
             <ShieldAlert className="w-8 h-8 text-red-600" /> Administration Control
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Server management, user moderation, and system diagnostics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Active Users</div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{overviewData?.activeUsersEstimate ?? 0}</div>
                 </div>
                 <Users className="w-8 h-8 text-blue-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Server Load</div>
                    <div className="text-3xl font-mono font-bold text-green-600">{Math.min(100, Math.max(3, (overviewData?.totalUsers || 0) % 87))}%</div>
                 </div>
                 <Activity className="w-8 h-8 text-green-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Muted Users</div>
                    <div className="text-3xl font-mono font-bold text-purple-600">{overviewData?.mutedUsers ?? 0}</div>
                 </div>
                 <Database className="w-8 h-8 text-purple-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Banned Users</div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{overviewData?.bannedUsers ?? 0}</div>
                 </div>
                 <Server className="w-8 h-8 text-slate-500 opacity-50" />
              </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="users" className="font-orbitron"><Users className="w-4 h-4 mr-2" /> User Management</TabsTrigger>
              <TabsTrigger value="console" className="font-orbitron"><Terminal className="w-4 h-4 mr-2" /> System Console</TabsTrigger>
              <TabsTrigger value="config" className="font-orbitron"><RefreshCw className="w-4 h-4 mr-2" /> Global Config</TabsTrigger>
               <TabsTrigger value="logs" className="font-orbitron"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
               <TabsTrigger value="cron" className="font-orbitron"><Clock className="w-4 h-4 mr-2" /> Cron Jobs</TabsTrigger>
           </TabsList>

           {/* USERS TAB */}
           <TabsContent value="users" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>User Database</CardTitle>
                    <CardDescription>Manage player accounts and permissions.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex justify-between mb-4">
                       <Input placeholder="Search users..." className="max-w-sm bg-slate-50" value={search} onChange={(event) => setSearch(event.target.value)} />
                       <Button variant="outline" onClick={() => {
                          const header = "id,name,email,status,role,lastLogin,ip";
                          const rows = filteredUsers.map((u) => `${u.id},${u.name},${u.email},${u.status},${u.role},${u.lastLogin || ""},${u.ip}`);
                          const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `stellar-users-${Date.now()}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ title: "Export complete", description: `${filteredUsers.length} users exported to CSV.` });
                       }}><Users className="w-4 h-4 mr-2" /> Export CSV</Button>
                    </div>
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead>User</TableHead>
                             <TableHead>Role</TableHead>
                             <TableHead>Status</TableHead>
                             <TableHead>Last Login</TableHead>
                             <TableHead>IP Address</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredUsers.map(user => (
                             <TableRow key={user.id}>
                                <TableCell>
                                   <div className="font-medium">{user.name}</div>
                                   <div className="text-xs text-slate-500">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                   <Badge variant="outline" className={user.role === "admin" ? "border-red-200 text-red-600" : "border-slate-200 text-slate-600"}>
                                      {user.role}
                                   </Badge>
                                </TableCell>
                                <TableCell>
                                   <Badge className={
                                      user.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200" : 
                                      user.status === "banned" ? "bg-red-100 text-red-700 hover:bg-red-200" : 
                                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                   }>
                                      {user.status}
                                   </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">{user.ip}</TableCell>
                                <TableCell className="text-right space-x-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => viewUserDetailMutation.mutate(user.id)} disabled={viewUserDetailMutation.isPending}>
                                      <Eye className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-yellow-600" onClick={() => handleMute(user.id)}>
                                      <Lock className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleBan(user.id)}>
                                      <Ban className="w-4 h-4" />
                                   </Button>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* CONSOLE TAB */}
           <TabsContent value="console" className="mt-6">
              <Card className="bg-slate-950 border-slate-800 text-green-500 font-mono">
                 <CardHeader className="border-b border-slate-900 pb-2">
                    <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                       <Terminal className="w-4 h-4" /> Root Terminal Access
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="h-[400px] overflow-y-auto p-4 space-y-1">
                       {consoleLog.map((log, i) => (
                          <div key={i}>{log}</div>
                       ))}
                       <div className="animate-pulse">_</div>
                    </div>
                    <div className="p-2 border-t border-slate-900 flex items-center gap-2 bg-slate-900">
                       <span className="text-green-500 font-bold">{">"}</span>
                       <input 
                          className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder-green-800" 
                          placeholder="Enter system command..."
                          value={consoleCommand}
                          disabled={consoleCommandMutation.isPending}
                          onChange={(e) => setConsoleCommand(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                          autoFocus
                       />
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* CONFIG TAB */}
           <TabsContent value="config" className="mt-6">
              <Card className="bg-white border-slate-200">
                 <CardHeader>
                    <CardTitle>Global Server Configuration</CardTitle>
                    <CardDescription>Warning: Changes here affect all players immediately.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded border border-red-100">
                             <AlertTriangle className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                             <div className="font-bold text-red-900">Emergency Maintenance Mode</div>
                             <div className="text-sm text-red-700">Disconnects all non-admin users and locks login.</div>
                          </div>
                       </div>
                       <Switch checked={Boolean(settingsData?.settings.maintenanceMode)} onCheckedChange={(v) => patchSettingsMutation.mutate({ maintenanceMode: v })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Economy Scaling</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Resource Generation</label>
                                <Input type="number" className="w-20 h-8" value={settingsData?.settings.resourceRate || 1} onChange={(e) => patchSettingsMutation.mutate({ resourceRate: parseInt(e.target.value) || 1 })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Build Speed</label>
                                <Input type="number" className="w-20 h-8" value={settingsData?.settings.gameSpeed || 1} onChange={(e) => patchSettingsMutation.mutate({ gameSpeed: parseInt(e.target.value) || 1 })} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Combat Settings</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Fleet Speed</label>
                                <Input type="number" className="w-20 h-8" value={settingsData?.settings.fleetSpeed || 1} onChange={(e) => patchSettingsMutation.mutate({ fleetSpeed: parseInt(e.target.value) || 1 })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Force Peace Mode</label>
                                <Switch checked={Boolean(settingsData?.settings.peaceMode)} onCheckedChange={(v) => patchSettingsMutation.mutate({ peaceMode: v })} />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Admin Accounts</h3>
                          <div className="flex items-center gap-2">
                             <Input
                                placeholder="Username or email"
                                value={adminIdentifier}
                                onChange={(event) => setAdminIdentifier(event.target.value)}
                             />
                             <Input
                                className="w-36"
                                placeholder="role"
                                value={adminRoleInput}
                                onChange={(event) => setAdminRoleInput(event.target.value)}
                             />
                             <Button
                                onClick={() => createAdminAccountMutation.mutate({ identifier: adminIdentifier.trim(), role: adminRoleInput.trim() || "moderator" })}
                                disabled={createAdminAccountMutation.isPending || !adminIdentifier.trim()}
                             >
                                <UserCog className="w-4 h-4 mr-2" /> Add
                             </Button>
                          </div>

                          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                             {(accountsData?.accounts || []).map((account) => (
                                <div key={account.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-2">
                                   <div>
                                      <div className="text-sm font-semibold text-slate-900">{account.username}</div>
                                      <div className="text-xs text-slate-500">{account.email} • {account.role}</div>
                                   </div>
                                   <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => removeAdminAccountMutation.mutate(account.userId)}
                                      disabled={removeAdminAccountMutation.isPending}
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </Button>
                                </div>
                             ))}
                             {(accountsData?.accounts || []).length === 0 && (
                                <div className="text-xs text-slate-500">No admin accounts found.</div>
                             )}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Operations</h3>
                          <div className="flex flex-wrap gap-2">
                             <Button variant="outline" onClick={() => queueBackupMutation.mutate()} disabled={queueBackupMutation.isPending}>Create Backup</Button>
                             <Button variant="outline" onClick={() => queueRestartMutation.mutate()} disabled={queueRestartMutation.isPending}>Queue Restart</Button>
                             <Button variant="destructive" onClick={() => queueResetMutation.mutate()} disabled={queueResetMutation.isPending}>Queue Reset</Button>
                          </div>
                          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                             {(operationsData?.operations || []).map((operation) => (
                                <div key={operation.id} className="bg-slate-50 border border-slate-200 rounded p-2">
                                   <div className="text-sm font-semibold text-slate-900">{operation.type}</div>
                                   <div className="text-xs text-slate-500">{operation.status} • {new Date(operation.requestedAt).toLocaleString()}</div>
                                </div>
                             ))}
                             {(operationsData?.operations || []).length === 0 && (
                                <div className="text-xs text-slate-500">No operations queued yet.</div>
                             )}
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>
           
            {/* LOGS TAB */}
            <TabsContent value="logs" className="mt-6">
               <Card className="bg-white border-slate-200">
                  <CardContent className="p-0">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Level</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Event</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {(auditData?.logs || []).map((log) => (
                              <TableRow key={log.id}>
                                 <TableCell className="font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                                 <TableCell>
                                    <Badge variant="outline" className={
                                       log.action.includes("status") ? "text-yellow-600 border-yellow-200" : "text-blue-600 border-blue-200"
                                    }>{log.action.includes("status") ? "WARN" : "INFO"}</Badge>
                                 </TableCell>
                                 <TableCell className="text-sm font-bold text-slate-700">Admin</TableCell>
                                 <TableCell className="text-sm text-slate-600">{log.details || log.action}</TableCell>
                              </TableRow>
                           ))}
                           {(auditData?.logs || []).length === 0 && (
                             <TableRow>
                               <TableCell colSpan={4} className="text-center text-slate-500 py-8">No audit entries yet.</TableCell>
                             </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* CRON JOBS TAB */}
            <TabsContent value="cron" className="mt-6">
               <div className="space-y-6">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Scheduled Cron Jobs</CardTitle>
                        <CardDescription>Manage server-side scheduled tasks. Toggle enabled/disabled or trigger immediate execution.</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Job Name</TableHead>
                                 <TableHead>Type</TableHead>
                                 <TableHead>Interval</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Last Run</TableHead>
                                 <TableHead>Runs</TableHead>
                                 <TableHead>Failures</TableHead>
                                 <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {(cronJobsData?.jobs || []).map((job) => (
                                 <TableRow key={job.id}>
                                    <TableCell>
                                       <div className="font-medium text-sm">{job.name}</div>
                                       <div className="text-xs text-slate-500">{job.id}</div>
                                    </TableCell>
                                    <TableCell>
                                       <Badge variant="outline" className="text-xs">{job.job_type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono text-slate-600">
                                       {job.interval_ms >= 86400000 ? `${Math.round(job.interval_ms / 86400000)}d` :
                                        job.interval_ms >= 3600000 ? `${Math.round(job.interval_ms / 3600000)}h` :
                                        job.interval_ms >= 60000 ? `${Math.round(job.interval_ms / 60000)}m` :
                                        `${Math.round(job.interval_ms / 1000)}s`}
                                    </TableCell>
                                    <TableCell>
                                       <Badge className={
                                          job.enabled ?
                                             (job.last_run_status === "error" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700") :
                                             "bg-slate-100 text-slate-600"
                                       }>
                                          {job.enabled ? (job.last_run_status === "error" ? "Warning" : "Running") : "Disabled"}
                                       </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                       {job.last_run_at ? new Date(job.last_run_at).toLocaleString() : "Never"}
                                       {job.last_run_duration_ms > 0 && (
                                          <div className="text-xs text-slate-400">{job.last_run_duration_ms}ms</div>
                                       )}
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">{job.run_count}</TableCell>
                                    <TableCell>
                                       <span className={`text-xs font-mono ${job.consecutive_failures > 0 ? "text-red-600" : "text-slate-500"}`}>
                                          {job.consecutive_failures}
                                       </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs"
                                          onClick={() => runCronMutation.mutate(job.id)}
                                          disabled={runCronMutation.isPending || !job.enabled}
                                       >
                                          <RefreshCw className="w-3 h-3 mr-1" /> Run
                                       </Button>
                                       <Switch
                                          checked={job.enabled}
                                          onCheckedChange={(v) => toggleCronMutation.mutate({ jobId: job.id, enabled: v })}
                                          disabled={toggleCronMutation.isPending}
                                       />
                                    </TableCell>
                                 </TableRow>
                              ))}
                              {(cronJobsData?.jobs || []).length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                                       No cron jobs registered. Jobs will appear after server initialization.
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="text-sm">Recent Cron Execution Logs</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Job</TableHead>
                                 <TableHead>Started</TableHead>
                                 <TableHead>Duration</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Processed</TableHead>
                                 <TableHead>Affected</TableHead>
                                 <TableHead>Error</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {(cronLogsData?.logs || []).map((log) => (
                                 <TableRow key={log.id}>
                                    <TableCell className="text-xs font-mono">{log.job_id}</TableCell>
                                    <TableCell className="text-xs text-slate-500">{new Date(log.started_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-xs font-mono">{log.duration_ms}ms</TableCell>
                                    <TableCell>
                                       <Badge variant="outline" className={
                                          log.status === "success" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
                                       }>
                                          {log.status}
                                       </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{log.records_processed}</TableCell>
                                    <TableCell className="text-xs">{log.records_affected}</TableCell>
                                    <TableCell className="text-xs text-red-500 max-w-[200px] truncate">{log.error_message || "-"}</TableCell>
                                 </TableRow>
                              ))}
                              {(cronLogsData?.logs || []).length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500 py-4">No execution logs yet.</TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

        </Tabs>
      </div>
    </GameLayout>
  );
}
