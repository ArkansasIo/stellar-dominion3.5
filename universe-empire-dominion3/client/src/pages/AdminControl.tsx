import { useEffect, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import {
  DEFAULT_ADMIN_CONTROL_PLANE_STATE,
  type AdminControlPlaneState,
} from "@/lib/adminControlSystems";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, ShieldCheck, RefreshCw, Activity, Users, Globe, Coins, Swords, Rocket, ClipboardList, AlertTriangle, Play, Save } from "lucide-react";
import {
  type AdminMeResponse,
  type AdminUsersResponse,
  type AdminOverviewResponse,
  type AdminAuditResponse,
  type AdminAccountsResponse,
  type AdminOperationsResponse,
  type ServerSettings,
  type RulesContent,
  type DeveloperShortcutsResponse,
  type AdminControlPlaneResponse,
  DEFAULT_SERVER_SETTINGS,
  DEFAULT_RULES,
  fetchJson,
} from "./admin/types";
import { DashboardTab } from "./admin/DashboardTab";
import { PlayersTab } from "./admin/PlayersTab";
import { LiveOpsTab } from "./admin/LiveOpsTab";
import { AuditTab } from "./admin/AuditTab";

export default function AdminControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [serverForm, setServerForm] = useState<ServerSettings>(DEFAULT_SERVER_SETTINGS);
  const [rulesForm, setRulesForm] = useState<RulesContent>(DEFAULT_RULES);
  const [controlPlaneForm, setControlPlaneForm] = useState<AdminControlPlaneState>(DEFAULT_ADMIN_CONTROL_PLANE_STATE);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [seasonName, setSeasonName] = useState("");
  const [seasonActive, setSeasonActive] = useState(false);

  const { data: meData, isLoading: meLoading } = useQuery<AdminMeResponse>({
    queryKey: ["admin-me"],
    queryFn: () => fetchJson<AdminMeResponse>("/api/admin/me"),
    retry: false,
  });
  const { data: overviewData } = useQuery<AdminOverviewResponse>({
    queryKey: ["admin-overview"],
    queryFn: () => fetchJson<AdminOverviewResponse>("/api/admin/overview"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 20000,
  });
  const { data: usersData } = useQuery<AdminUsersResponse>({
    queryKey: ["admin-users"],
    queryFn: () => fetchJson<AdminUsersResponse>("/api/admin/users"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 20000,
  });
  const { data: accountsData } = useQuery<AdminAccountsResponse>({
    queryKey: ["admin-accounts"],
    queryFn: () => fetchJson<AdminAccountsResponse>("/api/admin/accounts"),
    enabled: !!meData?.isAdmin,
  });
  const { data: auditData } = useQuery<AdminAuditResponse>({
    queryKey: ["admin-audit"],
    queryFn: () => fetchJson<AdminAuditResponse>("/api/admin/audit"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 15000,
  });
  const { data: operationsData } = useQuery<AdminOperationsResponse>({
    queryKey: ["admin-operations"],
    queryFn: () => fetchJson<AdminOperationsResponse>("/api/admin/operations"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 15000,
  });
  const { data: serverSettingsData } = useQuery<{ settings: ServerSettings }>({
    queryKey: ["admin-server-settings"],
    queryFn: () => fetchJson<{ settings: ServerSettings }>("/api/admin/server-settings"),
    enabled: !!meData?.isAdmin,
  });
  const { data: rulesData } = useQuery<{ content: RulesContent }>({
    queryKey: ["admin-rules-content"],
    queryFn: () => fetchJson<{ content: RulesContent }>("/api/admin/rules-content"),
    enabled: !!meData?.isAdmin,
  });
  const { data: devData } = useQuery<DeveloperShortcutsResponse>({
    queryKey: ["admin-developer-shortcuts"],
    queryFn: () => fetchJson<DeveloperShortcutsResponse>("/api/admin/developer-shortcuts"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 10000,
  });
  const { data: controlPlaneData } = useQuery<AdminControlPlaneResponse>({
    queryKey: ["admin-control-plane"],
    queryFn: () => fetchJson<AdminControlPlaneResponse>("/api/admin/control-plane"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 15000,
  });
  const { data: statusData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["admin-server-status"],
    queryFn: () => fetchJson<{ success: boolean; data: any }>("/api/status"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 10000,
  });

  useEffect(() => { if (serverSettingsData?.settings) setServerForm(serverSettingsData.settings); }, [serverSettingsData]);
  useEffect(() => { if (rulesData?.content) setRulesForm(rulesData.content); }, [rulesData]);
  useEffect(() => { if (controlPlaneData?.state) setControlPlaneForm(controlPlaneData.state); }, [controlPlaneData]);

  const adminPermissions = meData?.permissions || [];
  const isFounder = adminPermissions.includes("all_access");
  const canAdministrate = isFounder || adminPermissions.includes("administrate");
  const canUseMasquerade = devData?.policy?.features.masquerade ?? (controlPlaneForm.featureFlags.allowMasquerade || isFounder);
  const canUseWorldTools = devData?.policy?.features.advancedWorldTools ?? (controlPlaneForm.featureFlags.advancedWorldTools || isFounder);
  const canUseLiveOps = devData?.policy?.features.liveOpsOverrides ?? (controlPlaneForm.featureFlags.liveOpsOverridesEnabled || isFounder);
  const canViewAudit = devData?.policy?.features.auditStreamVisible ?? (controlPlaneForm.featureFlags.auditStreamVisible || isFounder);
  const privilegedSessionFresh = devData?.policy?.sessionFresh ?? true;

  const invalidateAdmin = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
    queryClient.invalidateQueries({ queryKey: ["admin-server-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-rules-content"] });
    queryClient.invalidateQueries({ queryKey: ["admin-developer-shortcuts"] });
    queryClient.invalidateQueries({ queryKey: ["admin-server-status"] });
    queryClient.invalidateQueries({ queryKey: ["admin-control-plane"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "muted" | "banned" }) =>
      fetchJson(`/api/admin/users/${userId}/status`, { method: "POST", body: JSON.stringify({ status }) }),
    onSuccess: () => invalidateAdmin(),
    onError: (error: Error) => toast({ title: "User update failed", description: error.message, variant: "destructive" }),
  });

  const serverSettingsMutation = useMutation({
    mutationFn: (payload: ServerSettings) => fetchJson("/api/admin/server-settings", { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Server settings saved", description: "Server settings were updated." }); },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const rulesMutation = useMutation({
    mutationFn: (payload: RulesContent) => fetchJson("/api/admin/rules-content", { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Rules content saved" }); },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const shortcutMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, { method: "POST", body: JSON.stringify(payload || {}) }),
    onSuccess: (_payload, variables) => {
      invalidateAdmin();
      if (variables.url.includes("impersonate") || variables.url.includes("stop-impersonation")) { window.location.reload(); return; }
      toast({ title: "Action applied" });
    },
    onError: (error: Error) => toast({ title: "Action failed", description: error.message, variant: "destructive" }),
  });

  const operationsMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, { method: "POST", body: JSON.stringify(payload || {}) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Operation queued" }); },
    onError: (error: Error) => toast({ title: "Operation failed", description: error.message, variant: "destructive" }),
  });

  const createAdminMutation = useMutation({
    mutationFn: ({ identifier, role }: { identifier: string; role: string }) =>
      fetchJson("/api/admin/accounts", { method: "POST", body: JSON.stringify({ identifier, role }) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Admin created" }); },
    onError: (error: Error) => toast({ title: "Admin creation failed", description: error.message, variant: "destructive" }),
  });

  const removeAdminMutation = useMutation({
    mutationFn: (userId: string) => fetchJson(`/api/admin/accounts/${userId}`, { method: "DELETE" }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Admin removed" }); },
    onError: (error: Error) => toast({ title: "Admin removal failed", description: error.message, variant: "destructive" }),
  });

  const controlPlaneMutation = useMutation({
    mutationFn: (payload: {
      featureFlags?: Partial<AdminControlPlaneState["featureFlags"]>;
      security?: Partial<AdminControlPlaneState["security"]>;
      broadcast?: Partial<AdminControlPlaneState["broadcast"]>;
      liveOps?: Partial<AdminControlPlaneState["liveOps"]>;
      support?: Partial<AdminControlPlaneState["support"]>;
    }) => fetchJson("/api/admin/control-plane", { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Control plane saved" }); },
    onError: (error: Error) => toast({ title: "Control plane update failed", description: error.message, variant: "destructive" }),
  });

  const broadcastMutation = useMutation({
    mutationFn: (payload: AdminControlPlaneState["broadcast"]) =>
      fetchJson("/api/admin/control-plane/broadcast", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => { invalidateAdmin(); toast({ title: "Broadcast updated" }); },
    onError: (error: Error) => toast({ title: "Broadcast failed", description: error.message, variant: "destructive" }),
  });

  const updateControlPlane = (payload: {
    featureFlags?: Partial<AdminControlPlaneState["featureFlags"]>;
    security?: Partial<AdminControlPlaneState["security"]>;
    broadcast?: Partial<AdminControlPlaneState["broadcast"]>;
    liveOps?: Partial<AdminControlPlaneState["liveOps"]>;
    support?: Partial<AdminControlPlaneState["support"]>;
  }) => {
    setControlPlaneForm((prev) => ({
      featureFlags: { ...prev.featureFlags, ...(payload.featureFlags || {}) },
      security: { ...prev.security, ...(payload.security || {}) },
      broadcast: { ...prev.broadcast, ...(payload.broadcast || {}) },
      liveOps: { ...prev.liveOps, ...(payload.liveOps || {}) },
      support: { ...prev.support, ...(payload.support || {}) },
    }));
    controlPlaneMutation.mutate(payload);
  };

  const handleToggleMaintenance = () => {
    const next = !serverForm.maintenanceMode;
    setServerForm((p) => ({ ...p, maintenanceMode: next }));
    serverSettingsMutation.mutate({ ...serverForm, maintenanceMode: next });
  };

  if (meLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-400 flex items-center gap-2"><RefreshCw className="w-5 h-5 animate-spin" /> Loading admin control systems...</div>
        </div>
      </GameLayout>
    );
  }

  if (!meData?.isAdmin) {
    return (
      <GameLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-orbitron font-bold text-slate-100 flex items-center gap-2"><ShieldAlert className="w-8 h-8 text-red-500" /> Admin Control Locked</h2>
          <Card className="border-red-800 bg-red-950/50">
            <CardContent className="p-6">
              <p className="text-slate-300 mb-4">This route requires an administrator session.</p>
              <div className="flex gap-3">
                <Button asChild className="bg-red-600 hover:bg-red-500"><a href="/admin-login">Open Admin Login</a></Button>
                <Button asChild variant="outline" className="border-slate-700 text-slate-300"><a href="/">Return to Title Page</a></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 text-xs">Admin Control</Badge>
          <Badge variant="outline" className="uppercase tracking-widest px-3 py-1 text-xs border-slate-700 text-slate-300">{meData.role || "admin"}</Badge>
          {devData?.masqueradingAsUserId ? <Badge className="bg-amber-900/50 text-amber-300 border border-amber-700">Impersonating {devData.masqueradingAsUserId}</Badge> : null}
          {devData?.policy?.incidentLockdownEnabled ? <Badge className="bg-red-900/50 text-red-300 border border-red-700"><AlertTriangle className="w-3 h-3 mr-1" /> Lockdown</Badge> : null}
        </div>
        <h2 className="text-3xl font-orbitron font-bold text-slate-100 flex items-center gap-2"><ShieldCheck className="w-8 h-8 text-emerald-500" /> Admin Control Panel</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto flex-wrap bg-slate-900/80 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Activity className="w-4 h-4 mr-1" /> Dashboard</TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Users className="w-4 h-4 mr-1" /> Players</TabsTrigger>
            <TabsTrigger value="universe" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Globe className="w-4 h-4 mr-1" /> Universe</TabsTrigger>
            <TabsTrigger value="economy" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Coins className="w-4 h-4 mr-1" /> Economy</TabsTrigger>
            <TabsTrigger value="combat" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Swords className="w-4 h-4 mr-1" /> Combat</TabsTrigger>
            <TabsTrigger value="fleet" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Rocket className="w-4 h-4 mr-1" /> Fleet</TabsTrigger>
            <TabsTrigger value="liveops" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Play className="w-4 h-4 mr-1" /> LiveOps</TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><ClipboardList className="w-4 h-4 mr-1" /> Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardTab
              overviewData={overviewData}
              auditData={auditData}
              statusData={statusData}
              serverForm={serverForm}
              privilegedSessionFresh={privilegedSessionFresh}
              canUseLiveOps={canUseLiveOps}
              onBackup={() => operationsMutation.mutate({ url: "/api/admin/operations/backup" })}
              onRestart={() => operationsMutation.mutate({ url: "/api/admin/operations/restart" })}
              onToggleMaintenance={handleToggleMaintenance}
              onNavigateToPlayers={() => setActiveTab("players")}
            />
          </TabsContent>

          <TabsContent value="players" className="mt-6">
            <PlayersTab
              usersData={usersData}
              accountsData={accountsData}
              meData={meData}
              devData={devData}
              canAdministrate={canAdministrate}
              canUseMasquerade={canUseMasquerade}
              isFounder={isFounder}
              privilegedSessionFresh={privilegedSessionFresh}
              onStatusChange={(userId, status) => statusMutation.mutate({ userId, status })}
              onImpersonate={(id) => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/impersonate", payload: { identifier: id } })}
              onCreateAdmin={(identifier, role) => createAdminMutation.mutate({ identifier, role })}
              onRemoveAdmin={(userId) => removeAdminMutation.mutate(userId)}
              isPending={createAdminMutation.isPending || removeAdminMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="universe" className="mt-6 space-y-4">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Universe Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[["universeName", "Universe Name"], ["numberOfGalaxies", "Galaxies"], ["systemsPerGalaxy", "Systems/Galaxy"], ["positionsPerSystem", "Positions/System"], ["economySpeed", "Economy Speed"], ["researchSpeed", "Research Speed"], ["gameSpeed", "Game Speed"], ["fleetSpeed", "Fleet Speed"], ["fleetSpeedWar", "War Fleet"], ["fleetSpeedHolding", "Holding Fleet"], ["fleetSpeedPeaceful", "Peaceful Fleet"], ["registrationPlanetAmount", "Registration Planets"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: key === "universeName" ? e.target.value : Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {[["maintenanceMode", "Maintenance Mode"], ["allowNewRegistrations", "Allow Registrations"], ["peaceMode", "Peace Mode"], ["darkMatterRegenEnabled", "Dark Matter Regen"], ["allianceCombatSystemOn", "Alliance Combat"], ["debrisFieldDeuteriumOn", "Deuterium Debris"], ["rapidFireEnabled", "Rapid Fire"], ["highscoreAdminVisible", "Admins in Highscore"]].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between border border-slate-700/50 rounded-lg p-3 bg-slate-800/30 cursor-pointer">
                    <span className="text-sm text-slate-300">{label}</span>
                    <input type="checkbox" checked={Boolean(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: e.target.checked }))} className="w-4 h-4" />
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500"><Save className="w-4 h-4 mr-2" /> Save Universe Settings</Button>
                <Button variant="destructive" onClick={() => setShowResetConfirm(true)} disabled={!canUseLiveOps || !privilegedSessionFresh}><AlertTriangle className="w-4 h-4 mr-2" /> Reset Universe</Button>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Active Server Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[["Success / Failed", `${statusData?.data?.requests?.successfulRequests ?? 0} / ${statusData?.data?.requests?.failedRequests ?? 0}`], ["Avg Response", `${Math.round(statusData?.data?.requests?.averageResponseTime ?? 0)} ms`], ["Cache Hit", `${Math.round(statusData?.data?.database?.cacheHitRate ?? 0)}%`], ["DB Connections", `${statusData?.data?.database?.connections ?? 0}`]].map(([t, v]) => (
                  <div key={t} className="rounded-lg border border-slate-700/50 p-4 bg-slate-800/30">
                    <div className="text-xs uppercase text-slate-500">{t}</div>
                    <div className="mt-1 text-2xl font-bold text-slate-100">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="economy" className="mt-6">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Economy Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[["resourceRate", "Resource Rate"], ["basicIncomeMetal", "Metal Income"], ["basicIncomeCrystal", "Crystal Income"], ["basicIncomeDeuterium", "Deuterium Income"], ["basicIncomeEnergy", "Energy Income"], ["planetFieldsBonus", "Planet Fields Bonus"], ["planetRelocationCost", "Relocation Cost"], ["planetRelocationDuration", "Relocation Duration"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                  </div>
                ))}
              </div>
              <hr className="border-slate-700/50" />
              <h4 className="text-sm font-semibold text-slate-300">Dark Matter Economy</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[["darkMatterBonus", "DM Bonus"], ["darkMatterRegenAmount", "Regen Amount"], ["darkMatterRegenPeriod", "Regen Period (s)"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                  </div>
                ))}
              </div>
              <hr className="border-slate-700/50" />
              <h4 className="text-sm font-semibold text-slate-300">Expedition Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[["expeditionLootRate", "Loot Rate %"], ["expeditionDelayRate", "Delay Rate %"], ["expeditionBlackHoleRate", "Black Hole Rate %"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                  </div>
                ))}
              </div>
              <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500"><Save className="w-4 h-4 mr-2" /> Save Economy Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="combat" className="mt-6">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Combat Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[["battleEngine", "Battle Engine"], ["defenseRepairRate", "Defense Repair %"], ["debrisFieldFromShips", "Debris from Ships %"], ["debrisFieldFromDefense", "Debris from Defense %"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    {key === "battleEngine" ? (
                      <select value={serverForm.battleEngine} onChange={(e) => setServerForm((p) => ({ ...p, battleEngine: e.target.value as "rust" | "php" }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">
                        <option value="rust">Rust Engine</option>
                        <option value="php">PHP Engine</option>
                      </select>
                    ) : (
                      <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                    )}
                  </div>
                ))}
              </div>
              <hr className="border-slate-700/50" />
              <h4 className="text-sm font-semibold text-slate-300">Unit Stats Editor</h4>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[["attack", "Attack"], ["defense", "Defense"], ["hull", "Hull"], ["shield", "Shield"], ["speed", "Speed"]].map(([k, l]) => (
                  <div key={k}><label className="text-xs text-slate-500">{l}</label><input className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200" /></div>
                ))}
              </div>
              <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500"><Save className="w-4 h-4 mr-2" /> Save Combat Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="mt-6">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-100">Fleet Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[["fleetSpeed", "Fleet Speed"], ["fleetSpeedWar", "War Speed"], ["fleetSpeedHolding", "Holding Speed"], ["fleetSpeedPeaceful", "Peaceful Speed"], ["allianceCooldownDays", "Alliance Cooldown (days)"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400">{label}</label>
                    <input value={String(serverForm[key as keyof ServerSettings])} onChange={(e) => setServerForm((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200" />
                  </div>
                ))}
              </div>
              <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500"><Save className="w-4 h-4 mr-2" /> Save Fleet Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="liveops" className="mt-6">
            <LiveOpsTab
              controlPlaneForm={controlPlaneForm}
              setControlPlaneForm={setControlPlaneForm}
              updateControlPlane={updateControlPlane}
              onApplyBroadcast={() => broadcastMutation.mutate(controlPlaneForm.broadcast)}
              onDisableBanner={() => { const next = { ...controlPlaneForm.broadcast, enabled: false }; setControlPlaneForm((p) => ({ ...p, broadcast: next })); broadcastMutation.mutate(next); }}
              broadcastPending={broadcastMutation.isPending}
              canUseLiveOps={canUseLiveOps}
              privilegedSessionFresh={privilegedSessionFresh}
              seasonName={seasonName}
              setSeasonName={setSeasonName}
              seasonActive={seasonActive}
              setSeasonActive={setSeasonActive}
              onSaveSeason={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/season", payload: { name: seasonName, active: seasonActive } })}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditTab
              auditData={auditData}
              operationsData={operationsData}
              devData={devData}
              canViewAudit={canViewAudit}
              canUseMasquerade={canUseMasquerade}
              canUseWorldTools={canUseWorldTools}
              canUseLiveOps={canUseLiveOps}
              privilegedSessionFresh={privilegedSessionFresh}
              onImpersonate={(id) => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/impersonate", payload: { identifier: id } })}
              onStopImpersonation={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/stop-impersonation" })}
              onShortcut={(url, payload) => shortcutMutation.mutate({ url, payload })}
              rulesForm={rulesForm}
              setRulesForm={setRulesForm}
              onSaveRules={() => rulesMutation.mutate(rulesForm)}
              rulesPending={rulesMutation.isPending}
              statusData={statusData}
            />
          </TabsContent>
        </Tabs>

        <div className={`fixed bottom-4 right-4 p-3 rounded-lg border text-sm ${!privilegedSessionFresh ? "bg-amber-950 border-amber-700 text-amber-300" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
          {!privilegedSessionFresh ? <><AlertTriangle className="w-4 h-4 inline mr-1" /> Session expired — re-auth at /admin-login</> : "Session active"}
        </div>
      </div>
    </GameLayout>
  );
}
