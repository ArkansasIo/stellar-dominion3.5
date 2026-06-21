import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import {
  ADMIN_FEATURES,
  ADMIN_SUBSYSTEMS,
  buildAdminControlSummary,
  DEFAULT_ADMIN_CONTROL_PLANE_STATE,
  type AdminControlPlaneState,
  type AdminSubsystemId,
} from "@/lib/adminControlSystems";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Ban,
  Cpu,
  Database,
  HardDrive,
  Lock,
  MemoryStick,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wand2,
} from "lucide-react";
import type { SystemMetricsSnapshot } from "@shared/config/statusConfig";

type AdminMeResponse = {
  isAdmin: boolean;
  role: string | null;
  permissions?: string[];
  masqueradingAsUserId?: string | null;
  actingAdminUserId?: string | null;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: "active" | "muted" | "banned";
  role: string;
  lastLogin: string | null;
  ip: string;
};

type AdminUsersResponse = { users: AdminUser[] };

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

type AdminAccountsResponse = {
  accounts: Array<{
    id: string;
    userId: string;
    role: string;
    username: string;
    email: string;
    permissions?: string[];
    createdAt?: string | number | null;
  }>;
};

type AdminOperationsResponse = {
  operations: Array<{
    id: string;
    type: string;
    status: string;
    requestedBy: string;
    requestedAt: number;
    completedAt?: number;
    notes?: string;
  }>;
};

type ServerSettings = {
  universeName: string;
  economySpeed: number;
  researchSpeed: number;
  fleetSpeedWar: number;
  fleetSpeedHolding: number;
  fleetSpeedPeaceful: number;
  planetFieldsBonus: number;
  basicIncomeMetal: number;
  basicIncomeCrystal: number;
  basicIncomeDeuterium: number;
  basicIncomeEnergy: number;
  registrationPlanetAmount: number;
  darkMatterBonus: number;
  darkMatterRegenEnabled: boolean;
  darkMatterRegenAmount: number;
  darkMatterRegenPeriod: number;
  planetRelocationCost: number;
  planetRelocationDuration: number;
  allianceCooldownDays: number;
  battleEngine: "rust" | "php";
  allianceCombatSystemOn: boolean;
  debrisFieldFromShips: number;
  debrisFieldFromDefense: number;
  debrisFieldDeuteriumOn: boolean;
  rapidFireEnabled: boolean;
  defenseRepairRate: number;
  expeditionLootRate: number;
  expeditionDelayRate: number;
  expeditionBlackHoleRate: number;
  highscoreAdminVisible: boolean;
  numberOfGalaxies: number;
  systemsPerGalaxy: number;
  positionsPerSystem: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  peaceMode: boolean;
  resourceRate: number;
  gameSpeed: number;
  fleetSpeed: number;
};

type RulesContent = {
  rulesContent: string;
  legalContent: string;
  privacyPolicyContent: string;
  termsContent: string;
  contactContent: string;
};

type DeveloperShortcutsResponse = {
  presets: Array<{ id: string; label: string }>;
  buildingCatalog: string[];
  researchCatalog: string[];
  unitCatalog: string[];
  currentUserId: string;
  actingAdminUserId: string | null;
  masqueradingAsUserId: string | null;
  policy: {
    isFounder: boolean;
    incidentLockdownEnabled: boolean;
    commandApprovalMode: "single" | "dual" | "founder";
    privilegedSessionTimeoutMinutes: number;
    features: {
      masquerade: boolean;
      advancedWorldTools: boolean;
      liveOpsOverrides: boolean;
      auditStreamVisible: boolean;
    };
    support: AdminControlPlaneState["support"];
    requiresFounderApproval: boolean;
    requiresDualApproval: boolean;
    sessionFresh: boolean;
  };
  recentActions: string[];
  worldObjects: Array<{
    id: string;
    type: "planet" | "moon" | "debris";
    coordinates: string;
    name: string;
    ownerUserId?: string;
    createdAt: number;
  }>;
  userDirectory: Array<{
    id: string;
    username: string;
    email: string;
  }>;
};

type AdminControlPlaneResponse = {
  state: AdminControlPlaneState;
};

function formatAdminUptime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

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
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

const DEFAULT_SERVER_SETTINGS: ServerSettings = {
  universeName: "Nexus Crown",
  economySpeed: 4,
  researchSpeed: 8,
  fleetSpeedWar: 3,
  fleetSpeedHolding: 2,
  fleetSpeedPeaceful: 6,
  planetFieldsBonus: 25,
  basicIncomeMetal: 30,
  basicIncomeCrystal: 15,
  basicIncomeDeuterium: 8,
  basicIncomeEnergy: 20,
  registrationPlanetAmount: 1,
  darkMatterBonus: 2500,
  darkMatterRegenEnabled: true,
  darkMatterRegenAmount: 100,
  darkMatterRegenPeriod: 3600,
  planetRelocationCost: 5000,
  planetRelocationDuration: 3600,
  allianceCooldownDays: 3,
  battleEngine: "rust",
  allianceCombatSystemOn: true,
  debrisFieldFromShips: 30,
  debrisFieldFromDefense: 0,
  debrisFieldDeuteriumOn: false,
  rapidFireEnabled: true,
  defenseRepairRate: 70,
  expeditionLootRate: 100,
  expeditionDelayRate: 10,
  expeditionBlackHoleRate: 2,
  highscoreAdminVisible: false,
  numberOfGalaxies: 9,
  systemsPerGalaxy: 499,
  positionsPerSystem: 16,
  maintenanceMode: false,
  allowNewRegistrations: true,
  peaceMode: false,
  resourceRate: 4,
  gameSpeed: 4,
  fleetSpeed: 4,
};

const DEFAULT_RULES: RulesContent = {
  rulesContent: "",
  legalContent: "",
  privacyPolicyContent: "",
  termsContent: "",
  contactContent: "",
};

export default function AdminControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSubsystem, setActiveSubsystem] = useState<AdminSubsystemId>("command");
  const [activeControlSubMenu, setActiveControlSubMenu] = useState("overview");
  const [targetIdentifier, setTargetIdentifier] = useState("");
  const [serverForm, setServerForm] = useState<ServerSettings>(DEFAULT_SERVER_SETTINGS);
  const [rulesForm, setRulesForm] = useState<RulesContent>(DEFAULT_RULES);
  const [controlPlaneForm, setControlPlaneForm] = useState<AdminControlPlaneState>(DEFAULT_ADMIN_CONTROL_PLANE_STATE);
  const [resourceForm, setResourceForm] = useState({
    metal: "0",
    crystal: "0",
    deuterium: "0",
    energy: "0",
    credits: "0",
    food: "0",
    water: "0",
    darkMatter: "0",
  });
  const [buildingKey, setBuildingKey] = useState("metalMine");
  const [buildingLevel, setBuildingLevel] = useState("30");
  const [researchKey, setResearchKey] = useState("energyTech");
  const [researchLevel, setResearchLevel] = useState("10");
  const [unitId, setUnitId] = useState("lightFighter");
  const [unitAmount, setUnitAmount] = useState("100");
  const [worldType, setWorldType] = useState<"planet" | "moon" | "debris">("planet");
  const [worldCoordinates, setWorldCoordinates] = useState("1:1:1");
  const [worldName, setWorldName] = useState("Admin Created World Object");
  const [newAdminIdentifier, setNewAdminIdentifier] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("moderator");

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

  const { data: statusData } = useQuery<{ success: boolean; data: SystemMetricsSnapshot }>({
    queryKey: ["admin-server-status"],
    queryFn: () => fetchJson<{ success: boolean; data: SystemMetricsSnapshot }>("/api/status"),
    enabled: !!meData?.isAdmin,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (serverSettingsData?.settings) {
      setServerForm(serverSettingsData.settings);
    }
  }, [serverSettingsData]);

  useEffect(() => {
    if (rulesData?.content) {
      setRulesForm(rulesData.content);
    }
  }, [rulesData]);

  useEffect(() => {
    if (controlPlaneData?.state) {
      setControlPlaneForm(controlPlaneData.state);
    }
  }, [controlPlaneData]);

  useEffect(() => {
    if (devData?.buildingCatalog?.length) {
      setBuildingKey((current) => (devData.buildingCatalog.includes(current) ? current : devData.buildingCatalog[0]));
    }
    if (devData?.researchCatalog?.length) {
      setResearchKey((current) => (devData.researchCatalog.includes(current) ? current : devData.researchCatalog[0]));
    }
    if (devData?.unitCatalog?.length) {
      setUnitId((current) => (devData.unitCatalog.includes(current) ? current : devData.unitCatalog[0]));
    }
  }, [devData]);

  const activeUsers = useMemo(() => usersData?.users || [], [usersData]);
  const activeSubsystemDefinition = useMemo(
    () => ADMIN_SUBSYSTEMS.find((subsystem) => subsystem.id === activeSubsystem) || ADMIN_SUBSYSTEMS[0],
    [activeSubsystem],
  );
  const controlSummary = useMemo(() => buildAdminControlSummary(controlPlaneForm), [controlPlaneForm]);
  const adminPermissions = meData?.permissions || [];
  const isFounder = adminPermissions.includes("all_access");
  const canAdministrate = isFounder || adminPermissions.includes("administrate");
  const visibleAdminRoles = useMemo(
    () => ["viewer", "moderator", "suadmin", "administrator", ...(isFounder ? ["devadmin", "founder"] : [])],
    [isFounder],
  );
  const canUseMasquerade = devData?.policy?.features.masquerade ?? (controlPlaneForm.featureFlags.allowMasquerade || isFounder);
  const canUseWorldTools = devData?.policy?.features.advancedWorldTools ?? (controlPlaneForm.featureFlags.advancedWorldTools || isFounder);
  const canUseLiveOps = devData?.policy?.features.liveOpsOverrides ?? (controlPlaneForm.featureFlags.liveOpsOverridesEnabled || isFounder);
  const canViewAudit = devData?.policy?.features.auditStreamVisible ?? (controlPlaneForm.featureFlags.auditStreamVisible || isFounder);
  const privilegedSessionFresh = devData?.policy?.sessionFresh ?? true;

  useEffect(() => {
    if (!activeSubsystemDefinition.subMenus.some((menu) => menu.id === activeControlSubMenu)) {
      setActiveControlSubMenu(activeSubsystemDefinition.subMenus[0]?.id || "overview");
    }
  }, [activeControlSubMenu, activeSubsystemDefinition]);

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
      fetchJson(`/api/admin/users/${userId}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => invalidateAdmin(),
    onError: (error: Error) => toast({ title: "User update failed", description: error.message, variant: "destructive" }),
  });

  const serverSettingsMutation = useMutation({
    mutationFn: (payload: ServerSettings) =>
      fetchJson("/api/admin/server-settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Server settings saved", description: "Imported OGameX server settings were updated." });
    },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const rulesMutation = useMutation({
    mutationFn: (payload: RulesContent) =>
      fetchJson("/api/admin/rules-content", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Rules content saved", description: "Rules, legal, privacy, terms, and contact text updated." });
    },
    onError: (error: Error) => toast({ title: "Save failed", description: error.message, variant: "destructive" }),
  });

  const shortcutMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, {
        method: "POST",
        body: JSON.stringify(payload || {}),
      }),
    onSuccess: (_payload, variables) => {
      invalidateAdmin();
      if (variables.url.includes("impersonate") || variables.url.includes("stop-impersonation")) {
        window.location.reload();
        return;
      }
      toast({ title: "Developer shortcut applied", description: "Admin action executed successfully." });
    },
    onError: (error: Error) => toast({ title: "Shortcut failed", description: error.message, variant: "destructive" }),
  });

  const operationsMutation = useMutation({
    mutationFn: ({ url, payload }: { url: string; payload?: Record<string, unknown> }) =>
      fetchJson(url, {
        method: "POST",
        body: JSON.stringify(payload || {}),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Operation queued", description: "Administrative operation was accepted." });
    },
    onError: (error: Error) => toast({ title: "Operation failed", description: error.message, variant: "destructive" }),
  });

  const createAdminMutation = useMutation({
    mutationFn: ({ identifier, role }: { identifier: string; role: string }) =>
      fetchJson("/api/admin/accounts", {
        method: "POST",
        body: JSON.stringify({ identifier, role }),
      }),
    onSuccess: () => {
      setNewAdminIdentifier("");
      invalidateAdmin();
      toast({ title: "Admin account created", description: "The selected user now has administrative access." });
    },
    onError: (error: Error) => toast({ title: "Admin account creation failed", description: error.message, variant: "destructive" }),
  });

  const removeAdminMutation = useMutation({
    mutationFn: (userId: string) =>
      fetchJson(`/api/admin/accounts/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Admin account removed", description: "Administrative access has been revoked." });
    },
    onError: (error: Error) => toast({ title: "Admin account removal failed", description: error.message, variant: "destructive" }),
  });

  const controlPlaneMutation = useMutation({
    mutationFn: (payload: {
      featureFlags?: Partial<AdminControlPlaneState["featureFlags"]>;
      security?: Partial<AdminControlPlaneState["security"]>;
      broadcast?: Partial<AdminControlPlaneState["broadcast"]>;
      liveOps?: Partial<AdminControlPlaneState["liveOps"]>;
      support?: Partial<AdminControlPlaneState["support"]>;
    }) =>
      fetchJson("/api/admin/control-plane", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Control plane saved", description: "Admin subsystem settings synchronized." });
    },
    onError: (error: Error) => toast({ title: "Control plane update failed", description: error.message, variant: "destructive" }),
  });

  const broadcastMutation = useMutation({
    mutationFn: (payload: AdminControlPlaneState["broadcast"]) =>
      fetchJson("/api/admin/control-plane/broadcast", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      invalidateAdmin();
      toast({ title: "Broadcast updated", description: "Admin broadcast state applied." });
    },
    onError: (error: Error) => toast({ title: "Broadcast failed", description: error.message, variant: "destructive" }),
  });

  const updateControlPlane = (payload: {
    featureFlags?: Partial<AdminControlPlaneState["featureFlags"]>;
    security?: Partial<AdminControlPlaneState["security"]>;
    broadcast?: Partial<AdminControlPlaneState["broadcast"]>;
    liveOps?: Partial<AdminControlPlaneState["liveOps"]>;
    support?: Partial<AdminControlPlaneState["support"]>;
  }) => {
    const nextState: AdminControlPlaneState = {
      featureFlags: {
        ...controlPlaneForm.featureFlags,
        ...(payload.featureFlags || {}),
      },
      security: {
        ...controlPlaneForm.security,
        ...(payload.security || {}),
      },
      broadcast: {
        ...controlPlaneForm.broadcast,
        ...(payload.broadcast || {}),
      },
      liveOps: {
        ...controlPlaneForm.liveOps,
        ...(payload.liveOps || {}),
      },
      support: {
        ...controlPlaneForm.support,
        ...(payload.support || {}),
      },
    };

    setControlPlaneForm(nextState);
    controlPlaneMutation.mutate(payload);
  };

  if (meLoading) {
    return (
      <GameLayout>
        <div className="p-6 text-slate-500">Loading admin control systems...</div>
      </GameLayout>
    );
  }

  if (!meData?.isAdmin) {
    return (
      <GameLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-600" /> Admin Control Locked
            </h2>
            <p className="text-muted-foreground">This route requires an administrator session.</p>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle>Administrator login required</CardTitle>
              <CardDescription>
                Use the dedicated admin sign-in route to authenticate with an administrator account before entering this panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild className="bg-red-600 hover:bg-red-500">
                <a href="/admin-login">Open Admin Login</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/">Return to Title Page</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <Badge variant="destructive" className="uppercase tracking-widest px-3 py-1 text-xs">Admin Control</Badge>
            <Badge variant="outline" className="uppercase tracking-widest px-3 py-1 text-xs">
              {meData.role || "admin"}
            </Badge>
            {devData?.masqueradingAsUserId ? (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                Impersonating {devData.masqueradingAsUserId}
              </Badge>
            ) : null}
          </div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" /> OGameX Admin Control Integration
          </h2>
          <p className="text-muted-foreground">
            Unified admin panel with imported server settings, rules editors, moderation, operations, and developer shortcuts.
          </p>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Policy Status</CardTitle>
            <CardDescription>Current control-plane posture applied to sensitive admin actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={canUseMasquerade ? "secondary" : "destructive"}>Masquerade {canUseMasquerade ? "enabled" : "locked"}</Badge>
              <Badge variant={canUseWorldTools ? "secondary" : "destructive"}>World tools {canUseWorldTools ? "enabled" : "locked"}</Badge>
              <Badge variant={canUseLiveOps ? "secondary" : "destructive"}>LiveOps {canUseLiveOps ? "enabled" : "locked"}</Badge>
              <Badge variant={canViewAudit ? "secondary" : "destructive"}>Audit stream {canViewAudit ? "visible" : "hidden"}</Badge>
              <Badge variant="outline">Approval mode: {devData?.policy?.commandApprovalMode || controlPlaneForm.security.commandApprovalMode}</Badge>
              <Badge variant="outline">Support visibility: {devData?.policy?.support.playerVisibility || controlPlaneForm.support.playerVisibility}</Badge>
            </div>
            {!privilegedSessionFresh ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Your privileged admin session expired for protected actions. Sign in again through `/admin-login` before running sensitive tools.
              </div>
            ) : null}
            {devData?.policy?.incidentLockdownEnabled ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                Incident lockdown is active. Non-founder admins will be blocked from high-risk account, live-ops, and world-tool actions.
              </div>
            ) : null}
            {devData?.policy?.requiresFounderApproval ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                Founder approval mode is active. Destructive control-plane actions require a founder session.
              </div>
            ) : null}
            {devData?.policy?.requiresDualApproval ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Dual approval mode is active. Sensitive actions are restricted until the posture is lowered or a founder handles them.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Admin Control Plane Systems</CardTitle>
            <CardDescription>Main systems, sub systems, menus, sub menus, features, functions, and admin logic routing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ADMIN_SUBSYSTEMS.map((subsystem) => (
                <button
                  key={subsystem.id}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    activeSubsystem === subsystem.id ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                  onClick={() => setActiveSubsystem(subsystem.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">{subsystem.name}</div>
                    <Badge variant="outline">{subsystem.subMenus.length} submenus</Badge>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{subsystem.description}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subsystem.subMenus.slice(0, 3).map((menu) => (
                      <Badge key={menu.id} variant="secondary">{menu.label}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase text-slate-500">Active System</div>
                    <div className="font-semibold text-slate-900">{activeSubsystemDefinition.pageTitle}</div>
                  </div>
                  <Badge>{activeSubsystemDefinition.menuLabel}</Badge>
                </div>
                <div className="text-sm text-slate-600">{activeSubsystemDefinition.description}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeSubsystemDefinition.subMenus.map((menu) => (
                    <Button
                      key={menu.id}
                      size="sm"
                      variant={activeControlSubMenu === menu.id ? "default" : "outline"}
                      onClick={() => setActiveControlSubMenu(menu.id)}
                    >
                      {menu.label}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="font-semibold text-slate-900">
                    {activeSubsystemDefinition.subMenus.find((menu) => menu.id === activeControlSubMenu)?.pageTitle}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {activeSubsystemDefinition.subMenus.find((menu) => menu.id === activeControlSubMenu)?.description}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(activeSubsystemDefinition.subMenus.find((menu) => menu.id === activeControlSubMenu)?.functions || []).map((feature) => (
                      <Badge key={feature} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase text-slate-500">Logic Summary</div>
                <div className="mt-3 space-y-2">
                  {controlSummary.guardedFeatures.map((item) => (
                    <div key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{item}</div>
                  ))}
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Incident State: {controlSummary.incidentState}
                  </div>
                  <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
                    LiveOps: {controlSummary.liveOpsState}
                  </div>
                  <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
                    Broadcast: {controlSummary.broadcastState}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Users</div><div className="text-2xl font-bold">{overviewData?.totalUsers ?? 0}</div></div><Users className="w-6 h-6 text-blue-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Active</div><div className="text-2xl font-bold">{overviewData?.activeUsersEstimate ?? 0}</div></div><Activity className="w-6 h-6 text-emerald-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Muted</div><div className="text-2xl font-bold">{overviewData?.mutedUsers ?? 0}</div></div><Lock className="w-6 h-6 text-amber-500" /></CardContent></Card>
          <Card><CardContent className="p-5 flex items-center justify-between"><div><div className="text-xs uppercase text-slate-500">Banned</div><div className="text-2xl font-bold">{overviewData?.bannedUsers ?? 0}</div></div><Ban className="w-6 h-6 text-red-500" /></CardContent></Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start h-auto flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="control-plane">Control Plane</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="server">Server Settings</TabsTrigger>
            <TabsTrigger value="rules">Rules & Legal</TabsTrigger>
            <TabsTrigger value="developer">Developer Shortcuts</TabsTrigger>
            <TabsTrigger value="logs">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Control Status</CardTitle>
                  <CardDescription>Live administrator session and imported server controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="font-semibold">Maintenance Mode</div>
                      <div className="text-sm text-slate-500">Lock gameplay while administrators perform maintenance.</div>
                    </div>
                    <Switch
                      checked={serverForm.maintenanceMode}
                      onCheckedChange={(checked) => setServerForm((prev) => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="font-semibold">Peace Mode</div>
                      <div className="text-sm text-slate-500">Disable hostile tempo while systems are stabilized.</div>
                    </div>
                    <Switch
                      checked={serverForm.peaceMode}
                      onCheckedChange={(checked) => setServerForm((prev) => ({ ...prev, peaceMode: checked }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><div className="text-xs uppercase text-slate-500">Universe</div><div className="font-semibold">{serverForm.universeName}</div></div>
                    <div><div className="text-xs uppercase text-slate-500">Economy</div><div className="font-semibold">{serverForm.economySpeed}x</div></div>
                    <div><div className="text-xs uppercase text-slate-500">Research</div><div className="font-semibold">{serverForm.researchSpeed}x</div></div>
                  </div>
                  <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Apply Server Toggles
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>Administrative operations and server workflow controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/backup" })} disabled={!privilegedSessionFresh}>Create Backup</Button>
                    <Button variant="outline" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/restart" })} disabled={!canUseLiveOps || !privilegedSessionFresh}>Queue Restart</Button>
                    <Button variant="destructive" onClick={() => operationsMutation.mutate({ url: "/api/admin/operations/reset-universe", payload: { confirmText: "RESET" } })} disabled={!canUseLiveOps || !privilegedSessionFresh}>Reset Universe</Button>
                  </div>
                  {!canUseLiveOps ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      LiveOps override actions are currently disabled by the control plane.
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    {(operationsData?.operations || []).map((operation) => (
                      <div key={operation.id} className="border rounded-lg p-3">
                        <div className="font-semibold">{operation.type}</div>
                        <div className="text-xs text-slate-500">{operation.status} · {new Date(operation.requestedAt).toLocaleString()}</div>
                        {operation.notes ? <div className="text-sm text-slate-600 mt-1">{operation.notes}</div> : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Live Server Health</CardTitle>
                <CardDescription>Real-time metrics mirrored from the server status service into the admin plane.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Health Score</div>
                    <div className="mt-1 text-2xl font-bold">{statusData?.data.healthCheck.overallScore ?? 0}</div>
                    <div className="text-xs text-slate-500">{statusData?.data.healthCheck.status ?? "offline"}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Uptime</div>
                    <div className="mt-1 text-2xl font-bold">{formatAdminUptime((statusData?.data.cpu.uptime ?? 0) * 1000)}</div>
                    <div className="text-xs text-slate-500">Live process time</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Request Rate</div>
                    <div className="mt-1 text-2xl font-bold">{(statusData?.data.requests.requestsPerSecond ?? 0).toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Requests per second</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Database</div>
                    <div className="mt-1 text-2xl font-bold">{statusData?.data.database.connections ?? 0}</div>
                    <div className="text-xs text-slate-500">Open connections</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4 flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-cyan-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">CPU</div>
                      <div className="text-sm text-slate-600">{Math.round(statusData?.data.cpu.usage ?? 0)}% usage</div>
                      <div className="text-xs text-slate-500">Load 1m: {(statusData?.data.cpu.loadAverage.oneMinute ?? 0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 flex items-start gap-3">
                    <MemoryStick className="w-5 h-5 text-violet-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Memory</div>
                      <div className="text-sm text-slate-600">{Math.round(statusData?.data.memory.usage ?? 0)}% usage</div>
                      <div className="text-xs text-slate-500">{statusData?.data.memory.used ?? 0} / {statusData?.data.memory.total ?? 0} MB</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 flex items-start gap-3">
                    <HardDrive className="w-5 h-5 text-slate-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Disk</div>
                      <div className="text-sm text-slate-600">{Math.round(statusData?.data.disk.usage ?? 0)}% usage</div>
                      <div className="text-xs text-slate-500">{statusData?.data.disk.used ?? 0} / {statusData?.data.disk.total ?? 0} GB</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {Object.entries(statusData?.data.healthCheck.checks || {}).map(([key, check]) => (
                    <div key={key} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold capitalize">{key}</div>
                        <Badge variant="outline">{check.status}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{check.message || "No issues detected."}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="control-plane" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{activeSubsystemDefinition.pageTitle}</CardTitle>
                  <CardDescription>{activeSubsystemDefinition.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="text-xs uppercase text-slate-500">Subsystem Menus</div>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {activeSubsystemDefinition.subMenus.map((menu) => (
                          <button
                            key={menu.id}
                            className={`rounded-lg border p-3 text-left transition-all ${
                              activeControlSubMenu === menu.id ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-white"
                            }`}
                            onClick={() => setActiveControlSubMenu(menu.id)}
                          >
                            <div className="font-semibold text-slate-900">{menu.label}</div>
                            <div className="mt-1 text-xs text-slate-500">{menu.pageTitle}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-xs uppercase text-slate-500">Feature Logic</div>
                      <div className="mt-3 space-y-3">
                        {activeSubsystemDefinition.featureIds.map((featureId) => {
                          const feature = ADMIN_FEATURES[featureId];
                          return (
                            <div key={featureId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <div className="font-semibold text-slate-900">{feature.name}</div>
                              <div className="mt-1 text-sm text-slate-600">{feature.description}</div>
                              <div className="mt-2 text-xs text-slate-500">Function: {feature.functionLabel}</div>
                              <div className="mt-1 text-xs text-slate-500">Logic: {feature.logic}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Security and Approval</CardTitle>
                        <CardDescription>Threat posture, privileged session windows, and command approval mode.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-sm font-medium mb-1">Threat Level</div>
                            <Select
                              value={controlPlaneForm.security.threatLevel}
                              onValueChange={(value) => updateControlPlane({ security: { threatLevel: value as AdminControlPlaneState["security"]["threatLevel"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="guarded">Guarded</SelectItem>
                                <SelectItem value="elevated">Elevated</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Approval Mode</div>
                            <Select
                              value={controlPlaneForm.security.commandApprovalMode}
                              onValueChange={(value) => updateControlPlane({ security: { commandApprovalMode: value as AdminControlPlaneState["security"]["commandApprovalMode"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single Approval</SelectItem>
                                <SelectItem value="dual">Dual Approval</SelectItem>
                                <SelectItem value="founder">Founder Approval</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Privileged Session Timeout</div>
                            <Input
                              value={String(controlPlaneForm.security.privilegedSessionTimeoutMinutes)}
                              onChange={(event) => setControlPlaneForm((prev) => ({ ...prev, security: { ...prev.security, privilegedSessionTimeoutMinutes: Number(event.target.value) || 0 } }))}
                              onBlur={() => updateControlPlane({ security: { privilegedSessionTimeoutMinutes: controlPlaneForm.security.privilegedSessionTimeoutMinutes } })}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Audit Retention Days</div>
                            <Input
                              value={String(controlPlaneForm.security.auditRetentionDays)}
                              onChange={(event) => setControlPlaneForm((prev) => ({ ...prev, security: { ...prev.security, auditRetentionDays: Number(event.target.value) || 0 } }))}
                              onBlur={() => updateControlPlane({ security: { auditRetentionDays: controlPlaneForm.security.auditRetentionDays } })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {[
                            ["adminBroadcastEnabled", "Admin Broadcast"],
                            ["allowMasquerade", "Masquerade"],
                            ["advancedWorldTools", "Advanced World Tools"],
                            ["liveOpsOverridesEnabled", "LiveOps Overrides"],
                            ["incidentLockdownEnabled", "Incident Lockdown"],
                            ["auditStreamVisible", "Audit Stream Visible"],
                          ].map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                              <div className="font-medium">{label}</div>
                              <Switch
                                checked={Boolean(controlPlaneForm.featureFlags[key as keyof AdminControlPlaneState["featureFlags"]])}
                                onCheckedChange={(checked) => updateControlPlane({ featureFlags: { [key]: checked } as Partial<AdminControlPlaneState["featureFlags"]> })}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>LiveOps and Support Routing</CardTitle>
                        <CardDescription>Temporary admin logic for event presets, multipliers, and support queue systems.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-sm font-medium mb-1">Event Preset</div>
                            <Select
                              value={controlPlaneForm.liveOps.eventPreset}
                              onValueChange={(value) => updateControlPlane({ liveOps: { eventPreset: value as AdminControlPlaneState["liveOps"]["eventPreset"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="boosted">Boosted</SelectItem>
                                <SelectItem value="war-economy">War Economy</SelectItem>
                                <SelectItem value="recovery">Recovery</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Ticket Queue Mode</div>
                            <Select
                              value={controlPlaneForm.support.ticketQueueMode}
                              onValueChange={(value) => updateControlPlane({ support: { ticketQueueMode: value as AdminControlPlaneState["support"]["ticketQueueMode"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="triage">Triage</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Escalation Policy</div>
                            <Select
                              value={controlPlaneForm.support.escalationPolicy}
                              onValueChange={(value) => updateControlPlane({ support: { escalationPolicy: value as AdminControlPlaneState["support"]["escalationPolicy"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="fast-track">Fast Track</SelectItem>
                                <SelectItem value="founder-review">Founder Review</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Player Visibility</div>
                            <Select
                              value={controlPlaneForm.support.playerVisibility}
                              onValueChange={(value) => updateControlPlane({ support: { playerVisibility: value as AdminControlPlaneState["support"]["playerVisibility"] } })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="detailed">Detailed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {[
                            ["dropRateModifier", "Drop Rate %"],
                            ["upkeepModifier", "Upkeep %"],
                            ["buildRateModifier", "Build Rate %"],
                            ["turnMultiplier", "Turn Multiplier %"],
                          ].map(([key, label]) => (
                            <div key={key}>
                              <div className="text-sm font-medium mb-1">{label}</div>
                              <Input
                                value={String(controlPlaneForm.liveOps[key as keyof AdminControlPlaneState["liveOps"]])}
                                onChange={(event) => setControlPlaneForm((prev) => ({ ...prev, liveOps: { ...prev.liveOps, [key]: Number(event.target.value) || 0 } }))}
                                onBlur={() => updateControlPlane({ liveOps: { [key]: Number(controlPlaneForm.liveOps[key as keyof AdminControlPlaneState["liveOps"]]) || 0 } as Partial<AdminControlPlaneState["liveOps"]> })}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Broadcast Center</CardTitle>
                      <CardDescription>System-wide admin banner with audience and severity routing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                        <div className="xl:col-span-2">
                          <div className="text-sm font-medium mb-1">Banner Title</div>
                          <Input value={controlPlaneForm.broadcast.title} onChange={(event) => setControlPlaneForm((prev) => ({ ...prev, broadcast: { ...prev.broadcast, title: event.target.value } }))} />
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Severity</div>
                          <Select value={controlPlaneForm.broadcast.severity} onValueChange={(value) => setControlPlaneForm((prev) => ({ ...prev, broadcast: { ...prev.broadcast, severity: value as AdminControlPlaneState["broadcast"]["severity"] } }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Audience</div>
                          <Select value={controlPlaneForm.broadcast.audience} onValueChange={(value) => setControlPlaneForm((prev) => ({ ...prev, broadcast: { ...prev.broadcast, audience: value as AdminControlPlaneState["broadcast"]["audience"] } }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="admins">Admins</SelectItem>
                              <SelectItem value="active-players">Active Players</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Banner Body</div>
                        <Textarea value={controlPlaneForm.broadcast.body} onChange={(event) => setControlPlaneForm((prev) => ({ ...prev, broadcast: { ...prev.broadcast, body: event.target.value } }))} className="min-h-28" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">Broadcast Enabled</div>
                          <div className="text-sm text-slate-500">Toggle whether the current banner is active.</div>
                        </div>
                        <Switch checked={controlPlaneForm.broadcast.enabled} onCheckedChange={(checked) => setControlPlaneForm((prev) => ({ ...prev, broadcast: { ...prev.broadcast, enabled: checked } }))} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => broadcastMutation.mutate(controlPlaneForm.broadcast)}
                          disabled={broadcastMutation.isPending}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" /> Apply Broadcast
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const next = { ...controlPlaneForm.broadcast, enabled: false };
                            setControlPlaneForm((prev) => ({ ...prev, broadcast: next }));
                            broadcastMutation.mutate(next);
                          }}
                        >
                          Disable Banner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User and Admin Accounts</CardTitle>
                <CardDescription>Moderation and access visibility across player and admin accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold mb-2">Admin Accounts</div>
                    {canAdministrate ? (
                      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_auto]">
                          <Input
                            value={newAdminIdentifier}
                            onChange={(event) => setNewAdminIdentifier(event.target.value)}
                            placeholder="username, email, or user id"
                          />
                          <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {visibleAdminRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => createAdminMutation.mutate({ identifier: newAdminIdentifier.trim(), role: newAdminRole })}
                            disabled={!newAdminIdentifier.trim() || createAdminMutation.isPending}
                          >
                            Add Admin
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Founder and devadmin roles are available only to founder sessions.
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Your role can review admin accounts but cannot create or remove them.
                      </div>
                    )}
                    <div className="space-y-2">
                      {(accountsData?.accounts || []).map((account) => (
                        <div key={account.id} className="border rounded-lg p-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold">{account.username}</div>
                            <div className="text-xs text-slate-500">{account.email} · {account.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{account.role}</Badge>
                            {canAdministrate && account.userId !== meData?.actingAdminUserId ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeAdminMutation.mutate(account.userId)}
                                disabled={removeAdminMutation.isPending}
                              >
                                Remove
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Player Accounts</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeUsers.slice(0, 12).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </TableCell>
                            <TableCell><Badge variant="outline">{user.status}</Badge></TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ userId: user.id, status: user.status === "muted" ? "active" : "muted" })}>Mute</Button>
                              <Button size="sm" variant="destructive" onClick={() => statusMutation.mutate({ userId: user.id, status: user.status === "banned" ? "active" : "banned" })}>Ban</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="server" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Runtime Snapshot</CardTitle>
                  <CardDescription>Current process, database, and request telemetry for the running server.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Success / Failed</div>
                    <div className="mt-1 text-2xl font-bold">{statusData?.data.requests.successfulRequests ?? 0} / {statusData?.data.requests.failedRequests ?? 0}</div>
                    <div className="text-xs text-slate-500">API outcomes</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Average Response</div>
                    <div className="mt-1 text-2xl font-bold">{Math.round(statusData?.data.requests.averageResponseTime ?? 0)} ms</div>
                    <div className="text-xs text-slate-500">P95 {Math.round(statusData?.data.requests.p95ResponseTime ?? 0)} ms</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Cache Hit Rate</div>
                    <div className="mt-1 text-2xl font-bold">{Math.round(statusData?.data.database.cacheHitRate ?? 0)}%</div>
                    <div className="text-xs text-slate-500">{statusData?.data.database.totalDataSize ?? "0B"} data size</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase text-slate-500">Slow Queries</div>
                    <div className="mt-1 text-2xl font-bold">{statusData?.data.database.slowQueries ?? 0}</div>
                    <div className="text-xs text-slate-500">{statusData?.data.database.activeQueries ?? 0} active</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imported OGameX Server Settings</CardTitle>
                  <CardDescription>Universe, economy, battle, expedition, and galaxy configuration mirrored into the new backend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      ["universeName", "Universe Name"],
                      ["economySpeed", "Economy Speed"],
                      ["researchSpeed", "Research Speed"],
                      ["fleetSpeedWar", "War Fleet Speed"],
                      ["fleetSpeedHolding", "Holding Fleet Speed"],
                      ["fleetSpeedPeaceful", "Peaceful Fleet Speed"],
                      ["planetFieldsBonus", "Planet Fields Bonus"],
                      ["registrationPlanetAmount", "Registration Planets"],
                      ["darkMatterBonus", "Dark Matter Bonus"],
                      ["defenseRepairRate", "Defense Repair Rate"],
                      ["numberOfGalaxies", "Galaxies"],
                      ["systemsPerGalaxy", "Systems per Galaxy"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <div className="text-sm font-medium mb-1">{label}</div>
                        <Input
                          value={String(serverForm[key as keyof ServerSettings])}
                          onChange={(event) =>
                            setServerForm((prev) => ({
                              ...prev,
                              [key]: key === "universeName" ? event.target.value : Number(event.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      ["darkMatterRegenEnabled", "Dark Matter Regen"],
                      ["allianceCombatSystemOn", "Alliance Combat"],
                      ["debrisFieldDeuteriumOn", "Deuterium Debris"],
                      ["rapidFireEnabled", "Rapid Fire"],
                      ["highscoreAdminVisible", "Show Admins in Highscore"],
                      ["allowNewRegistrations", "Allow Registrations"],
                    ].map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="font-medium">{label}</div>
                        <Switch
                          checked={Boolean(serverForm[key as keyof ServerSettings])}
                          onCheckedChange={(checked) =>
                            setServerForm((prev) => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => serverSettingsMutation.mutate(serverForm)} disabled={serverSettingsMutation.isPending}>
                    <Server className="w-4 h-4 mr-2" /> Save Server Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rules, Legal, Privacy, and Contact</CardTitle>
                <CardDescription>Editable policy content based on the OGameX admin legal editor layout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["rulesContent", "Rules"],
                  ["legalContent", "Legal"],
                  ["privacyPolicyContent", "Privacy Policy"],
                  ["termsContent", "Terms & Conditions"],
                  ["contactContent", "Contact"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <div className="font-medium mb-2">{label}</div>
                    <Textarea
                      value={rulesForm[key as keyof RulesContent]}
                      onChange={(event) => setRulesForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      className="min-h-32"
                    />
                  </div>
                ))}
                <Button onClick={() => rulesMutation.mutate(rulesForm)} disabled={rulesMutation.isPending}>
                  <Database className="w-4 h-4 mr-2" /> Save Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developer" className="mt-6">
            <div className="space-y-4">
              {!canUseMasquerade || !canUseWorldTools || !privilegedSessionFresh ? (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle>Developer Tool Guardrails</CardTitle>
                    <CardDescription>Current control-plane policy affecting impersonation and deep world tools.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-amber-950">
                    {!canUseMasquerade ? <div>Masquerade is disabled by the control plane.</div> : null}
                    {!canUseWorldTools ? <div>Advanced world tools are disabled by the control plane.</div> : null}
                    {!privilegedSessionFresh ? <div>Your privileged session has expired. Re-authenticate at `/admin-login` to run protected developer actions.</div> : null}
                  </CardContent>
                </Card>
              ) : null}
              <Card>
                <CardHeader>
                  <CardTitle>Target Player</CardTitle>
                  <CardDescription>Choose a player by username, email, or user id for developer shortcut actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={targetIdentifier} onChange={(event) => setTargetIdentifier(event.target.value)} placeholder="player username, email, or user id" />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/impersonate", payload: { identifier: targetIdentifier } })} disabled={!targetIdentifier || !canUseMasquerade || !privilegedSessionFresh}>
                      <Users className="w-4 h-4 mr-2" /> Impersonate
                    </Button>
                    <Button variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/stop-impersonation" })}>
                      Restore Admin
                    </Button>
                    {(devData?.presets || []).map((preset) => (
                      <Button key={preset.id} variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/apply-preset", payload: { identifier: targetIdentifier, preset: preset.id } })} disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}>
                        <Wand2 className="w-4 h-4 mr-2" /> {preset.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Grants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(resourceForm).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm font-medium mb-1">{key}</div>
                          <Input value={value} onChange={(event) => setResourceForm((prev) => ({ ...prev, [key]: event.target.value }))} />
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => shortcutMutation.mutate({
                        url: "/api/admin/developer-shortcuts/grant-resources",
                        payload: { identifier: targetIdentifier, resources: resourceForm },
                      })}
                      disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}
                    >
                      Grant Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>State Editors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Building Key</div><Input value={buildingKey} onChange={(event) => setBuildingKey(event.target.value)} list="building-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Level</div><Input value={buildingLevel} onChange={(event) => setBuildingLevel(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/set-building-level", payload: { identifier: targetIdentifier, buildingKey, level: buildingLevel } })} disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}>Set Building</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Research Key</div><Input value={researchKey} onChange={(event) => setResearchKey(event.target.value)} list="research-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Level</div><Input value={researchLevel} onChange={(event) => setResearchLevel(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/set-research-level", payload: { identifier: targetIdentifier, researchKey, level: researchLevel } })} disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}>Set Research</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                      <div><div className="text-sm font-medium mb-1">Unit Id</div><Input value={unitId} onChange={(event) => setUnitId(event.target.value)} list="unit-catalog" /></div>
                      <div><div className="text-sm font-medium mb-1">Amount</div><Input value={unitAmount} onChange={(event) => setUnitAmount(event.target.value)} /></div>
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/add-unit", payload: { identifier: targetIdentifier, unitId, amount: unitAmount } })} disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}>Add Unit</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["resources", "units", "buildings", "research"].map((scope) => (
                        <Button key={scope} variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/reset-player", payload: { identifier: targetIdentifier, scope } })} disabled={!targetIdentifier || !canUseWorldTools || !privilegedSessionFresh}>
                          Reset {scope}
                        </Button>
                      ))}
                    </div>
                    <datalist id="building-catalog">{(devData?.buildingCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                    <datalist id="research-catalog">{(devData?.researchCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                    <datalist id="unit-catalog">{(devData?.unitCatalog || []).map((entry) => <option key={entry} value={entry} />)}</datalist>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>World Object Tools</CardTitle>
                    <CardDescription>Create or delete planets, moons, and debris markers at coordinates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input value={worldType} onChange={(event) => setWorldType(event.target.value as "planet" | "moon" | "debris")} placeholder="planet" />
                      <Input value={worldCoordinates} onChange={(event) => setWorldCoordinates(event.target.value)} placeholder="1:1:1" />
                      <Input value={worldName} onChange={(event) => setWorldName(event.target.value)} placeholder="object name" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/world-object", payload: { action: "create", type: worldType, coordinates: worldCoordinates, name: worldName } })} disabled={!canUseWorldTools || !privilegedSessionFresh}>
                        Create
                      </Button>
                      <Button variant="outline" onClick={() => shortcutMutation.mutate({ url: "/api/admin/developer-shortcuts/world-object", payload: { action: "delete", type: worldType, coordinates: worldCoordinates, name: worldName } })} disabled={!canUseWorldTools || !privilegedSessionFresh}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Shortcut Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(devData?.recentActions || []).slice(0, 8).map((entry, index) => (
                      <div key={`${entry}-${index}`} className="border rounded-lg p-2 text-sm text-slate-700">{entry}</div>
                    ))}
                    {(devData?.worldObjects || []).slice(0, 8).map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-2 text-sm">
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-xs text-slate-500">{entry.type} · {entry.coordinates}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Administrative actions and imported control operations.</CardDescription>
              </CardHeader>
              <CardContent>
                {canViewAudit ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(auditData?.logs || []).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell className="text-xs text-slate-500">{log.targetUserId || "-"}</TableCell>
                          <TableCell className="text-sm text-slate-600">{log.details || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Audit visibility is disabled by the current control-plane posture for this session.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
