import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, Server, Shield, Monitor, Database, Power, Save, RefreshCw, 
  Clock, Play, Pause, Bell, Volume2, VolumeX, Eye, EyeOff, Globe, Palette, Moon, Sun,
  Mail, Key, Smartphone, Lock, LogOut, Trash2, Download, Upload, AlertTriangle, CheckCircle,
  User as UserIcon, Languages, Zap, Users, Loader2, Crown, Trophy, Target, BarChart3,
  Calendar, Clock3, ShieldCheck, Activity, HardDrive, Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MENU_ASSETS } from "@shared/config";

const TEMP_THEME_IMAGE = "/theme-temp.png";

type AccountSettingsResponse = {
   id: string;
   username: string;
   email: string;
   displayName: string;
   profileImageUrl: string;
   commanderTitle: string;
   bioMessage: string;
   twoFactorEnabled: boolean;
};

type PlayerOptions = {
   notifications: {
      attackAlerts: boolean;
      buildComplete: boolean;
      researchComplete: boolean;
      fleetArrival: boolean;
      messages: boolean;
      allianceActivity: boolean;
      browserNotifications: boolean;
      emailNotifications: boolean;
   };
   display: {
      darkMode: boolean;
   themePreset: "black-style" | "og-white" | "imperial-gold";
      compactView: boolean;
      showAnimations: boolean;
      showResourceRates: boolean;
      language: string;
      timeFormat: string;
      numberFormat: string;
      deviceProfile: string;
      mobileOptimized: boolean;
      touchControls: boolean;
      touchTargetSize: string;
      browserWidth: string;
      stickyMobileBars: boolean;
   };
   sound: {
      enabled: boolean;
      volume: number;
      alertSounds: boolean;
      ambientSounds: boolean;
   };
   privacy: {
      hideOnlineStatus: boolean;
      blockStrangers: boolean;
   };
};

type AdminOperationResponse = {
   success: boolean;
   message: string;
   operation: {
      id: string;
      type: "backup_snapshot" | "reset_universe" | "restart_server";
      status: "queued" | "completed";
      requestedAt: number;
   };
};

type AdminOperationLogResponse = {
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

type AdminIdentityResponse = {
   isAdmin: boolean;
   role: string | null;
   permissions: string[];
   masqueradingAsUserId: string | null;
   actingAdminUserId: string | null;
};

type AdminAccountRecord = {
   id: string;
   userId: string;
   role: string;
   permissions: string[];
   createdAt?: string | number;
   username: string;
   email: string;
};

type AdminAccountsResponse = {
   accounts: AdminAccountRecord[];
};

type ThemePreset = "black-style" | "og-white" | "imperial-gold";

const ADMIN_ROLE_OPTIONS = [
   { value: "administrator", label: "Admin", description: "Server controls, moderation, and admin account provisioning." },
   { value: "devadmin", label: "Dev Admin", description: "Admin access plus developer shortcuts, masquerade, and world tools." },
   { value: "suadmin", label: "Senior Admin", description: "Operations management and live override access without developer tools." },
   { value: "moderator", label: "Moderator", description: "Moderation and review workflows." },
   { value: "viewer", label: "Viewer", description: "Read-only admin visibility." },
] as const;

const PERMISSION_LABELS: Record<string, string> = {
   all_access: "All Access",
   administrate: "Administrate",
   manage: "Manage",
   moderate: "Moderate",
   view_only: "View Only",
   developer_tools: "Developer Tools",
   masquerade: "Masquerade",
   world_tools: "World Tools",
   liveops_override: "LiveOps Override",
};

const THEME_PRESET_OPTIONS: Array<{
   value: ThemePreset;
   label: string;
   description: string;
   helper: string;
   icon: typeof Moon;
   previewClassName: string;
}> = [
   {
      value: "black-style",
      label: "Black Style Theme",
      description: "The current dark command-shell look.",
      helper: "Neon accents, dark panels, and the current black interface style.",
      icon: Moon,
      previewClassName: "border-cyan-400/50 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_38%),linear-gradient(180deg,#182331,#070b11)]",
   },
   {
      value: "og-white",
      label: "OG White Theme",
      description: "The original brighter white interface look.",
      helper: "Light panels, pale chrome, and the earlier OG white presentation.",
      icon: Sun,
      previewClassName: "border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_38%),linear-gradient(180deg,#f8fbff,#e8eef7)]",
   },
   {
      value: "imperial-gold",
      label: "Imperial Gold Theme",
      description: "A ceremonial command deck for high-tier empires.",
      helper: "Obsidian panels, warm gold frames, and royal crimson accents.",
      icon: Zap,
      previewClassName: "border-amber-400/60 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent_38%),linear-gradient(180deg,#251b12,#090705)]",
   },
];

function formatAdminRole(role: string | null | undefined): string {
   const normalized = String(role || "viewer").trim().toLowerCase();
   if (normalized === "devadmin") return "Dev Admin";
   if (normalized === "suadmin") return "Senior Admin";
   return normalized
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
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
      throw new Error(payload?.message || payload?.error || "Request failed");
   }

   return payload as T;
}

export default function Settings() {
  const isDev = import.meta.env.DEV;
  const { config, updateConfig, cronJobs, toggleCronJob, runCronJob, isAdmin, isActualAdmin, adminRole, toggleAdmin, username, logout, isLoggedIn } = useGame();
  const [, setLocation] = useLocation();
   const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(username || "Commander");
  const [commanderTitle, setCommanderTitle] = useState("commander");
  const [bioMessage, setBioMessage] = useState("");
   const [accountEmail, setAccountEmail] = useState("");
   const [profileImageUrl, setProfileImageUrl] = useState("");
   const [newEmailInput, setNewEmailInput] = useState("");
   const [currentPasswordInput, setCurrentPasswordInput] = useState("");
   const [newPasswordInput, setNewPasswordInput] = useState("");
   const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
   const [deletePasswordInput, setDeletePasswordInput] = useState("");
   const [resetConfirmInput, setResetConfirmInput] = useState("");
   const [restartAcknowledge, setRestartAcknowledge] = useState(false);
   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
   const [adminIdentifier, setAdminIdentifier] = useState("");
   const [adminPassword, setAdminPassword] = useState("");
   const [newAdminIdentifier, setNewAdminIdentifier] = useState("");
   const [newAdminRole, setNewAdminRole] = useState("administrator");
   const { toast } = useToast();
   const lastAccountSettingsKeyRef = useRef<string>("");
   const lastPlayerOptionsKeyRef = useRef<string>("");
  
  const [notifications, setNotifications] = useState({
    attackAlerts: true,
    buildComplete: true,
    researchComplete: true,
    fleetArrival: true,
    messages: true,
      allianceActivity: false,
      browserNotifications: true,
      emailNotifications: true,
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    themePreset: "og-white" as ThemePreset,
    compactView: false,
    showAnimations: true,
    showResourceRates: true,
      language: "en",
      timeFormat: "24h",
      numberFormat: "comma",
      deviceProfile: "auto",
      mobileOptimized: true,
      touchControls: true,
      touchTargetSize: "comfortable",
      browserWidth: "standard",
      stickyMobileBars: true,
  });

  const [viewportInfo, setViewportInfo] = useState({
    width: 0,
    height: 0,
    orientation: "landscape",
    breakpoint: "desktop",
    touch: false,
    pixelRatio: 1,
  });

  const [soundSettings, setSoundSettings] = useState({
    enabled: true,
    volume: 80,
    alertSounds: true,
    ambientSounds: false,
  });

  type EmpireSaveSlot = {
    slot: number;
    name: string;
    planetName: string;
    empireLevel: number;
    tier: number;
    race: string;
    government: string;
    lastSaved: string | null;
    playTime: number;
  };

  const [empireSlots, setEmpireSlots] = useState<EmpireSaveSlot[]>([
    { slot: 1, name: "Primary Empire", planetName: "", empireLevel: 1, tier: 1, race: "terran", government: "democracy", lastSaved: null, playTime: 0 },
    { slot: 2, name: "Empty Slot", planetName: "", empireLevel: 0, tier: 0, race: "", government: "", lastSaved: null, playTime: 0 },
    { slot: 3, name: "Empty Slot", planetName: "", empireLevel: 0, tier: 0, race: "", government: "", lastSaved: null, playTime: 0 },
    { slot: 4, name: "Empty Slot", planetName: "", empireLevel: 0, tier: 0, race: "", government: "", lastSaved: null, playTime: 0 },
    { slot: 5, name: "Empty Slot", planetName: "", empireLevel: 0, tier: 0, race: "", government: "", lastSaved: null, playTime: 0 },
  ]);
  const [activeSlot, setActiveSlot] = useState(1);
  const [slotLoading, setSlotLoading] = useState<number | null>(null);

   const [privacySettings, setPrivacySettings] = useState({
      hideOnlineStatus: false,
      blockStrangers: false,
      showLastOnline: true,
      showEmpireLevel: true,
      showAllianceTag: true,
      allowSpectators: true,
      hideFromLeaderboard: false,
      showBattleReports: "everyone",
      profileVisibility: "alliance",
      showPlayTime: true,
      showAchievementProgress: false,
   });

   const [gameplaySettings, setGameplaySettings] = useState({
      autoUseTurns: false,
      turnsPerAction: 1,
      autoCollectResources: true,
      confirmFleetSend: true,
      confirmAttack: true,
      defaultFleetSpeed: "fast",
      autoRepairEquipment: false,
      autoRepairThreshold: 50,
      showDamageNumbers: true,
      showResourcePopups: true,
      combatLogVerbosity: "detailed",
      galaxyMapStyle: "standard",
      defaultGalaxyView: "system",
      showPlayerCoordinates: true,
      autoExpireOrders: true,
      orderExpiryDays: 7,
      preferredTradeResource: "metal",
      showMarketGraphs: true,
      defaultSortOrder: "power",
      enableQuickActions: true,
      enableSwipeActions: true,
      autoBookmarkPlanets: false,
      showFlightTimes: true,
      showResourceRatesOnPlanet: true,
      enableFleetPresets: true,
   });

   const [accessibilitySettings, setAccessibilitySettings] = useState({
      reducedMotion: false,
      highContrast: false,
      fontSize: "medium",
      colorBlindMode: "none",
      screenReaderMode: false,
      keyboardNavigation: true,
      focusIndicators: true,
      announceNotifications: true,
      pauseAnimationsOnHover: false,
      simplifyTransitions: false,
   });

   const [dataSettings, setDataSettings] = useState({
      autoSaveInterval: 30,
      enableCloudSync: true,
      exportFormat: "json",
      compressionEnabled: true,
      lastExportDate: null,
      storageUsed: 0,
   });

   const { data: accountSettings } = useQuery<AccountSettingsResponse>({
      queryKey: ["account-settings"],
      queryFn: () => fetchJson<AccountSettingsResponse>("/api/account/settings"),
   });

   const { data: playerOptions } = useQuery<PlayerOptions>({
      queryKey: ["player-options"],
      queryFn: () => fetchJson<PlayerOptions>("/api/settings/player/options"),
   });

   const { data: gameplayOptions } = useQuery<any>({
      queryKey: ["player-gameplay"],
      queryFn: () => fetchJson<any>("/api/settings/player/gameplay"),
   });

   const { data: accessibilityOptions } = useQuery<any>({
      queryKey: ["player-accessibility"],
      queryFn: () => fetchJson<any>("/api/settings/player/accessibility"),
   });

   const { data: dataOptions } = useQuery<any>({
      queryKey: ["player-data"],
      queryFn: () => fetchJson<any>("/api/settings/player/data"),
   });

   const { data: adminOperations } = useQuery<AdminOperationLogResponse>({
      queryKey: ["admin-operations"],
      queryFn: () => fetchJson<AdminOperationLogResponse>("/api/admin/operations"),
      enabled: isAdmin,
      refetchInterval: isAdmin ? 15000 : false,
   });

   const { data: adminIdentity } = useQuery<AdminIdentityResponse>({
      queryKey: ["admin-identity"],
      queryFn: () => fetchJson<AdminIdentityResponse>("/api/admin/me"),
      enabled: isLoggedIn,
   });

   const { data: adminAccounts } = useQuery<AdminAccountsResponse>({
      queryKey: ["admin-accounts"],
      queryFn: () => fetchJson<AdminAccountsResponse>("/api/admin/accounts"),
      enabled: isActualAdmin,
   });

   useEffect(() => {
      if (!accountSettings) {
         return;
      }

      const nextAccountSettingsKey = JSON.stringify(accountSettings);
      if (lastAccountSettingsKeyRef.current === nextAccountSettingsKey) {
         return;
      }
      lastAccountSettingsKeyRef.current = nextAccountSettingsKey;

      setDisplayName(accountSettings.displayName || username || "Commander");
      setCommanderTitle(accountSettings.commanderTitle || "commander");
      setBioMessage(accountSettings.bioMessage || "");
      setAccountEmail(accountSettings.email || "");
      setNewEmailInput(accountSettings.email || "");
      setProfileImageUrl(accountSettings.profileImageUrl || "");
      setTwoFactorEnabled(Boolean(accountSettings.twoFactorEnabled));
   }, [accountSettings, username]);

   useEffect(() => {
      if (!playerOptions) {
         return;
      }

      const nextPlayerOptionsKey = JSON.stringify(playerOptions);
      if (lastPlayerOptionsKeyRef.current === nextPlayerOptionsKey) {
         return;
      }
      lastPlayerOptionsKeyRef.current = nextPlayerOptionsKey;

      setNotifications(playerOptions.notifications || {});
      const display = playerOptions.display || {};
      setDisplaySettings({
         darkMode: display.themePreset !== "og-white",
         themePreset: display.themePreset || "og-white",
         compactView: display.compactView,
         showAnimations: display.showAnimations,
         showResourceRates: display.showResourceRates,
         language: display.language,
         timeFormat: display.timeFormat,
         numberFormat: display.numberFormat,
         deviceProfile: display.deviceProfile,
         mobileOptimized: display.mobileOptimized,
         touchControls: display.touchControls,
         touchTargetSize: display.touchTargetSize,
         browserWidth: display.browserWidth,
         stickyMobileBars: display.stickyMobileBars,
      });
      setSoundSettings(playerOptions.sound);
      setPrivacySettings(playerOptions.privacy);
   }, [playerOptions]);

   useEffect(() => {
      if (gameplayOptions) setGameplaySettings(prev => ({ ...prev, ...gameplayOptions }));
   }, [gameplayOptions]);

   useEffect(() => {
      if (accessibilityOptions) setAccessibilitySettings(prev => ({ ...prev, ...accessibilityOptions }));
   }, [accessibilityOptions]);

   useEffect(() => {
      if (dataOptions) setDataSettings(prev => ({ ...prev, ...dataOptions }));
   }, [dataOptions]);

   useEffect(() => {
      const updateViewportInfo = () => {
         const width = window.innerWidth;
         const height = window.innerHeight;
         const breakpoint =
            width < 480 ? "small-phone" :
            width < 768 ? "phone" :
            width < 1024 ? "tablet" :
            width < 1440 ? "desktop" :
            "wide";

         setViewportInfo({
            width,
            height,
            orientation: width >= height ? "landscape" : "portrait",
            breakpoint,
            touch: window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0,
            pixelRatio: Number(window.devicePixelRatio || 1),
         });
      };

      updateViewportInfo();
      window.addEventListener("resize", updateViewportInfo);
      window.addEventListener("orientationchange", updateViewportInfo);

      return () => {
         window.removeEventListener("resize", updateViewportInfo);
         window.removeEventListener("orientationchange", updateViewportInfo);
      };
   }, []);

   const saveProfileMutation = useMutation({
      mutationFn: () => fetchJson("/api/account/profile", {
         method: "PATCH",
         body: JSON.stringify({ displayName, commanderTitle, bioMessage, profileImageUrl }),
      }),
      onSuccess: () => {
         toast({ title: "Profile updated", description: "Commander profile settings saved." });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to save profile", description: error.message, variant: "destructive" });
      },
   });

   const changeEmailMutation = useMutation({
      mutationFn: (email: string) => fetchJson("/api/account/email", {
         method: "POST",
         body: JSON.stringify({ email }),
      }),
      onSuccess: () => {
         toast({ title: "Email updated", description: "Your account email has been updated." });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to update email", description: error.message, variant: "destructive" });
      },
   });

   const changePasswordMutation = useMutation({
      mutationFn: (payload: { currentPassword: string; newPassword: string }) => fetchJson("/api/account/password", {
         method: "POST",
         body: JSON.stringify(payload),
      }),
      onSuccess: () => {
         toast({ title: "Password updated", description: "Your password has been changed." });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to update password", description: error.message, variant: "destructive" });
      },
   });

   const enableTwoFactorMutation = useMutation({
      mutationFn: () => fetchJson("/api/account/2fa/enable", { method: "POST" }),
      onSuccess: () => {
         setTwoFactorEnabled(true);
         toast({ title: "2FA enabled", description: "Two-factor protection is now active for this account." });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to enable 2FA", description: error.message, variant: "destructive" });
      },
   });

   const savePlayerOptionsMutation = useMutation({
      mutationFn: async () => {
         await fetchJson<PlayerOptions>("/api/settings/player/options", {
            method: "PUT",
            body: JSON.stringify({
               notifications,
               display: displaySettings,
               sound: soundSettings,
               privacy: privacySettings,
            }),
         });
         await fetchJson("/api/settings/player/gameplay", {
            method: "PUT",
            body: JSON.stringify(gameplaySettings),
         });
         await fetchJson("/api/settings/player/accessibility", {
            method: "PUT",
            body: JSON.stringify(accessibilitySettings),
         });
         await fetchJson("/api/settings/player/data", {
            method: "PUT",
            body: JSON.stringify(dataSettings),
         });
      },
      onSuccess: () => {
         toast({ title: "Options saved", description: "All settings menus and submenus updated." });
         queryClient.invalidateQueries({ queryKey: ["player-options"] });
         queryClient.invalidateQueries({ queryKey: ["player-gameplay"] });
         queryClient.invalidateQueries({ queryKey: ["player-accessibility"] });
         queryClient.invalidateQueries({ queryKey: ["player-data"] });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to save options", description: error.message, variant: "destructive" });
      },
   });

   const exportSettingsMutation = useMutation({
      mutationFn: () => fetchJson<any>("/api/settings/player/export", { method: "POST" }),
      onSuccess: (data) => {
         const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
         const url = URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = `stellar-settings-${Date.now()}.json`;
         a.click();
         URL.revokeObjectURL(url);
         setDataSettings(prev => ({ ...prev, lastExportDate: new Date().toISOString() }));
         toast({ title: "Settings exported", description: "Settings file downloaded." });
         queryClient.invalidateQueries({ queryKey: ["player-data"] });
      },
      onError: (error: Error) => {
         toast({ title: "Export failed", description: error.message, variant: "destructive" });
      },
   });

   const backupSnapshotMutation = useMutation({
      mutationFn: () => fetchJson<AdminOperationResponse>("/api/admin/operations/backup", {
         method: "POST",
      }),
      onSuccess: (result) => {
         toast({ title: "Backup created", description: result.message });
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
      },
      onError: (error: Error) => {
         toast({ title: "Backup failed", description: error.message, variant: "destructive" });
      },
   });

   const resetUniverseMutation = useMutation({
      mutationFn: () => fetchJson<AdminOperationResponse>("/api/admin/operations/reset-universe", {
         method: "POST",
         body: JSON.stringify({ confirmText: "RESET" }),
      }),
      onSuccess: (result) => {
         toast({ title: "Universe reset complete", description: result.message, variant: "destructive" });
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
      },
      onError: (error: Error) => {
         toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      },
   });

   const restartServerMutation = useMutation({
      mutationFn: () => fetchJson<AdminOperationResponse>("/api/admin/operations/restart", {
         method: "POST",
      }),
      onSuccess: (result) => {
         toast({ title: "Server restart queued", description: result.message, variant: "destructive" });
         queryClient.invalidateQueries({ queryKey: ["admin-operations"] });
      },
      onError: (error: Error) => {
         toast({ title: "Restart failed", description: error.message, variant: "destructive" });
      },
   });

   const adminLoginMutation = useMutation({
      mutationFn: (payload: { identifier: string; password: string }) => fetchJson<{
         message: string;
         user: {
            username: string;
         };
      }>("/api/admin/login", {
         method: "POST",
         body: JSON.stringify(payload),
      }),
      onSuccess: (result, variables) => {
         localStorage.setItem("stellar_username", result.user.username || variables.identifier);
         localStorage.setItem("stellar_password", variables.password);
         window.location.reload();
      },
      onError: (error: Error) => {
         toast({ title: "Admin login failed", description: error.message, variant: "destructive" });
      },
   });

   const createAdminAccountMutation = useMutation({
      mutationFn: (payload: { identifier: string; role: string }) => fetchJson<{
         success: boolean;
         user: { id: string; username: string; email: string; role: string };
      }>("/api/admin/accounts", {
         method: "POST",
         body: JSON.stringify(payload),
      }),
      onSuccess: async (result) => {
         toast({
            title: "Admin account granted",
            description: `${result.user.username || result.user.email} now has ${formatAdminRole(result.user.role)} access.`,
         });
         setNewAdminIdentifier("");
         setNewAdminRole("administrator");
         await queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
         await queryClient.invalidateQueries({ queryKey: ["admin-identity"] });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to grant admin access", description: error.message, variant: "destructive" });
      },
   });

   const removeAdminAccountMutation = useMutation({
      mutationFn: (userId: string) => fetchJson<{ success: boolean }>(`/api/admin/accounts/${userId}`, {
         method: "DELETE",
      }),
      onSuccess: async () => {
         toast({ title: "Admin access removed", description: "The account has been removed from the admin roster." });
         await queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
         await queryClient.invalidateQueries({ queryKey: ["admin-identity"] });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to remove admin access", description: error.message, variant: "destructive" });
      },
   });

   const exportAccountData = async () => {
      try {
         const exportData = await fetchJson<any>("/api/account/export");
         const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
         const downloadUrl = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = downloadUrl;
         link.download = `universee-mpires-dominions-account-${exportData.user?.username || "export"}.json`;
         document.body.appendChild(link);
         link.click();
         link.remove();
         URL.revokeObjectURL(downloadUrl);
         toast({ title: "Export ready", description: "Your account export has been downloaded." });
      } catch (error) {
         toast({ title: "Unable to export account", description: (error as Error).message, variant: "destructive" });
      }
   };

   const handleChangeEmail = () => {
      const nextEmail = newEmailInput.trim();
      if (!nextEmail) {
         toast({ title: "Email required", description: "Enter a valid email address.", variant: "destructive" });
         return;
      }
      setAccountEmail(nextEmail);
      changeEmailMutation.mutate(nextEmail);
   };

   const handleChangePassword = () => {
      const currentPassword = currentPasswordInput.trim();
      if (!currentPassword) {
         toast({ title: "Current password required", description: "Provide your current password.", variant: "destructive" });
         return;
      }
      const newPassword = newPasswordInput.trim();
      if (!newPassword) {
         toast({ title: "New password required", description: "Enter a new password.", variant: "destructive" });
         return;
      }
      changePasswordMutation.mutate({ currentPassword, newPassword });
      setCurrentPasswordInput("");
      setNewPasswordInput("");
   };

   const handleDeleteAccount = async () => {
      if (deleteConfirmInput.trim() !== "DELETE") {
         toast({ title: "Confirmation required", description: "Type DELETE to confirm account removal.", variant: "destructive" });
         return;
      }

      const currentPassword = deletePasswordInput.trim();
      if (!currentPassword) {
         toast({ title: "Password required", description: "Enter your password to delete account.", variant: "destructive" });
         return;
      }

      try {
         await fetchJson("/api/account", {
            method: "DELETE",
            body: JSON.stringify({ currentPassword, confirmText: "DELETE" }),
         });
         toast({ title: "Account deleted", description: "Your account has been permanently removed." });
         setLocation("/");
      } catch (error) {
         toast({ title: "Unable to delete account", description: (error as Error).message, variant: "destructive" });
      }
   };

   const handleAdminLogin = () => {
      const identifier = adminIdentifier.trim();
      const password = adminPassword.trim();

      if (!identifier || !password) {
         toast({ title: "Credentials required", description: "Enter an admin username or email and password.", variant: "destructive" });
         return;
      }

      adminLoginMutation.mutate({ identifier, password });
   };

   const handleCreateAdminAccount = () => {
      const identifier = newAdminIdentifier.trim();
      if (!identifier) {
         toast({ title: "Account required", description: "Enter the username or email to grant admin access.", variant: "destructive" });
         return;
      }

      createAdminAccountMutation.mutate({ identifier, role: newAdminRole });
   };

   const currentAdminPermissions = Array.isArray(adminIdentity?.permissions) ? adminIdentity!.permissions : [];
   const canAdministrate = currentAdminPermissions.includes("all_access") || currentAdminPermissions.includes("administrate");
   const canUseDevTools =
      currentAdminPermissions.includes("all_access") ||
      currentAdminPermissions.includes("developer_tools") ||
      currentAdminPermissions.includes("masquerade") ||
      currentAdminPermissions.includes("world_tools");

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-orbitron font-bold text-slate-900">System Configuration</h2>
             <p className="text-muted-foreground font-rajdhani text-lg">Manage server parameters, game rules, and account settings.</p>
           </div>
           {isActualAdmin && (
             <div className="flex items-center gap-2">
                {isAdmin && <Badge variant="destructive" className="animate-pulse">ADMIN MODE</Badge>}
                {!isAdmin && <Badge variant="secondary">USER VIEW</Badge>}
                <Button 
                   variant={isAdmin ? "destructive" : "outline"} 
                   size="sm"
                   onClick={toggleAdmin}
                   data-testid="button-toggle-admin-mode"
                >
                   {isAdmin ? "Switch to User View" : "Switch to Admin Mode"}
                </Button>
             </div>
           )}
        </div>

        <Tabs defaultValue="account" className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start overflow-x-auto">
              <TabsTrigger value="account" className="font-orbitron"><UserIcon className="w-4 h-4 mr-2" /> Account</TabsTrigger>
              {isActualAdmin && <TabsTrigger value="admin-access" className={cn("font-orbitron", "text-red-600")}><Shield className="w-4 h-4 mr-2" /> Admin Access</TabsTrigger>}
              <TabsTrigger value="notifications" className="font-orbitron"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
               <TabsTrigger value="display" className="font-orbitron"><Monitor className="w-4 h-4 mr-2" /> Display</TabsTrigger>
               <TabsTrigger value="gameplay" className="font-orbitron"><Zap className="w-4 h-4 mr-2" /> Gameplay</TabsTrigger>
               <TabsTrigger value="sound" className="font-orbitron"><Volume2 className="w-4 h-4 mr-2" /> Sound</TabsTrigger>
               <TabsTrigger value="accessibility" className="font-orbitron"><Eye className="w-4 h-4 mr-2" /> Accessibility</TabsTrigger>
               <TabsTrigger value="privacy" className="font-orbitron"><Shield className="w-4 h-4 mr-2" /> Privacy</TabsTrigger>
               <TabsTrigger value="data" className="font-orbitron"><Database className="w-4 h-4 mr-2" /> Data</TabsTrigger>
              {isAdmin && <TabsTrigger value="game" className="font-orbitron text-red-600"><Zap className="w-4 h-4 mr-2" /> Game Rules</TabsTrigger>}
              {isAdmin && <TabsTrigger value="server" className="font-orbitron text-red-600"><Server className="w-4 h-4 mr-2" /> Server</TabsTrigger>}
              {isAdmin && <TabsTrigger value="cron" className="font-orbitron text-red-600"><Clock className="w-4 h-4 mr-2" /> Cron Jobs</TabsTrigger>}
           </TabsList>

            {/* ACCOUNT TAB */}
            <TabsContent value="account" className="mt-6">
               <div className="space-y-6">
                  {/* Player Account Overview */}
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <UserIcon className="w-5 h-5 text-primary" /> Player Account Management
                        </CardTitle>
                        <CardDescription>Complete account overview and management system</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <UserIcon className="w-4 h-4 text-blue-600" />
                                 <div className="text-xs text-slate-600">Username</div>
                              </div>
                              <div className="text-lg font-bold text-slate-900">{username || "Commander"}</div>
                           </div>
                           <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <Mail className="w-4 h-4 text-green-600" />
                                 <div className="text-xs text-slate-600">Email</div>
                              </div>
                              <div className="text-sm font-mono text-slate-900 truncate">{accountEmail || "Not set"}</div>
                           </div>
                           <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <Calendar className="w-4 h-4 text-purple-600" />
                                 <div className="text-xs text-slate-600">Member Since</div>
                              </div>
                              <div className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
                           </div>
                           <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                 <ShieldCheck className="w-4 h-4 text-amber-600" />
                                 <div className="text-xs text-slate-600">Account Status</div>
                              </div>
                              <Badge variant="outline" className="text-xs">Active</Badge>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card className="bg-white border-slate-200" data-testid="card-account-profile">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-slate-900">
                              <UserIcon className="w-5 h-5 text-primary" /> Profile Settings
                           </CardTitle>
                           <CardDescription>Manage your commander identity and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                 <img
                                    src={MENU_ASSETS.NAVIGATION.SETTINGS.path}
                                    alt="profile"
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = TEMP_THEME_IMAGE; }}
                                 />
                              </div>
                              <div className="flex-1">
                                 <div className="font-orbitron font-bold text-lg text-slate-900">{username || "Commander"}</div>
                                 <div className="text-sm text-slate-500">Active since {new Date().toLocaleDateString()}</div>
                              </div>
                             <Badge variant="outline" className="text-xs">Profile</Badge>
                           </div>
                       
                       <Separator />
                       
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Display Name</label>
                             <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-slate-50 border-slate-200" data-testid="input-display-name" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Commander Title</label>
                             <Select value={commanderTitle} onValueChange={setCommanderTitle}>
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="commander">Commander</SelectItem>
                                   <SelectItem value="admiral">Admiral</SelectItem>
                                   <SelectItem value="general">General</SelectItem>
                                   <SelectItem value="emperor">Emperor</SelectItem>
                                   <SelectItem value="warlord">Warlord</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Bio / Status Message</label>
                             <Input value={bioMessage} onChange={(e) => setBioMessage(e.target.value)} placeholder="Set your status message..." className="bg-slate-50 border-slate-200" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Avatar URL</label>
                             <Input value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} placeholder="https://..." className="bg-slate-50 border-slate-200" />
                          </div>
                       </div>
                       
                        <Button className="w-full" onClick={() => saveProfileMutation.mutate()} disabled={saveProfileMutation.isPending}>
                           <Save className="w-4 h-4 mr-2" /> Save Profile Changes
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Empire Save Slots */}
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" data-testid="card-empire-slots">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <HardDrive className="w-5 h-5 text-amber-600" /> Empire Save Slots
                        </CardTitle>
                        <CardDescription>Manage up to 5 empire save slots. Switch between empires or start a new one.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                           <div className="text-sm text-slate-600">Active Slot: <Badge variant="outline" className="ml-1">Slot {activeSlot}</Badge></div>
                           <Button variant="outline" size="sm" onClick={() => {
                              toast({ title: "Slots Refreshed", description: "Empire save slots reloaded." });
                           }}>
                              <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                           </Button>
                        </div>
                        {empireSlots.map((slot) => {
                           const isActive = slot.slot === activeSlot;
                           const isEmpty = slot.empireLevel === 0;
                           return (
                              <div key={slot.slot} className={cn(
                                 "flex items-center justify-between p-3 rounded-lg border transition-all",
                                 isActive ? "bg-amber-100 border-amber-400 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300",
                                 isEmpty && !isActive && "opacity-60"
                              )}>
                                 <div className="flex items-center gap-3">
                                    <div className={cn(
                                       "w-10 h-10 rounded-lg flex items-center justify-center font-orbitron font-bold text-sm",
                                       isActive ? "bg-amber-500 text-white" : isEmpty ? "bg-slate-200 text-slate-400" : "bg-slate-100 text-slate-600"
                                    )}>
                                       {slot.slot}
                                    </div>
                                    <div>
                                       <div className="font-medium text-slate-900 text-sm">
                                          {isEmpty ? "Empty Slot" : slot.name}
                                          {isActive && <Badge variant="outline" className="ml-2 text-xs bg-amber-200 border-amber-400">Active</Badge>}
                                       </div>
                                       {!isEmpty && (
                                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                             <span>Lv.{slot.empireLevel}</span>
                                             <span className="text-slate-300">|</span>
                                             <span>Tier {slot.tier}</span>
                                             <span className="text-slate-300">|</span>
                                             <span className="capitalize">{slot.race}</span>
                                             {slot.lastSaved && (
                                                <>
                                                   <span className="text-slate-300">|</span>
                                                   <span>Saved {slot.lastSaved}</span>
                                                </>
                                             )}
                                          </div>
                                       )}
                                       {isEmpty && (
                                          <div className="text-xs text-slate-400 mt-0.5">No empire saved in this slot</div>
                                       )}
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    {!isEmpty && (
                                       <>
                                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => {
                                             setSlotLoading(slot.slot);
                                             setTimeout(() => {
                                                setActiveSlot(slot.slot);
                                                setSlotLoading(null);
                                                toast({ title: "Empire Loaded", description: `Switched to Slot ${slot.slot}: ${slot.name}` });
                                             }, 800);
                                          }} disabled={slotLoading !== null || isActive}>
                                             {slotLoading === slot.slot ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => {
                                             toast({ title: "Empire Saved", description: `Slot ${slot.slot} saved successfully.` });
                                          }}>
                                             <Save className="w-3 h-3" />
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-400" onClick={() => {
                                             const newSlots = [...empireSlots];
                                             newSlots[slot.slot - 1] = { ...newSlots[slot.slot - 1], name: "Empty Slot", planetName: "", empireLevel: 0, tier: 0, race: "", government: "", lastSaved: null, playTime: 0 };
                                             setEmpireSlots(newSlots);
                                             toast({ title: "Slot Cleared", description: `Slot ${slot.slot} has been cleared.` });
                                          }}>
                                             <Trash2 className="w-3 h-3" />
                                          </Button>
                                       </>
                                    )}
                                    {isEmpty && (
                                       <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-amber-600" onClick={() => {
                                          toast({ title: "New Empire", description: `Starting new empire in Slot ${slot.slot}...` });
                                       }}>
                                          <Play className="w-3 h-3 mr-1" /> Start
                                       </Button>
                                    )}
                                 </div>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card className="bg-white border-slate-200" data-testid="card-account-security">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Shield className="w-5 h-5 text-green-600" /> Security & Privacy
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                   <div className="font-medium text-slate-900">Email Address</div>
                                   <div className="text-xs text-slate-500">{accountEmail || "No email set"}</div>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" onClick={handleChangeEmail} disabled={changeEmailMutation.isPending}>Update</Button>
                          </div>
                          <Input value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)} placeholder="new-email@example.com" className="bg-slate-50 border-slate-200" />
                          
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-slate-400" />
                                <div>
                                   <div className="font-medium text-slate-900">Password</div>
                                   <div className="text-xs text-slate-500">Last changed 30 days ago</div>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" onClick={handleChangePassword} disabled={changePasswordMutation.isPending}>Update</Button>
                          </div>
                          <Input type="password" value={currentPasswordInput} onChange={(e) => setCurrentPasswordInput(e.target.value)} placeholder="Current password" className="bg-slate-50 border-slate-200" />
                          <Input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder="New password (min 6 characters)" className="bg-slate-50 border-slate-200" />
                          
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-slate-400" />
                                <div>
                                   <div className="font-medium text-slate-900">Two-Factor Authentication</div>
                                   <div className={cn("text-xs", twoFactorEnabled ? "text-green-600" : "text-red-500")}>{twoFactorEnabled ? "Enabled" : "Not enabled"}</div>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" onClick={() => enableTwoFactorMutation.mutate()} disabled={enableTwoFactorMutation.isPending || twoFactorEnabled}>
                                {twoFactorEnabled ? "Enabled" : "Enable"}
                             </Button>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                             <div>
                                <div className="font-medium text-slate-900">Hide Online Status</div>
                                <div className="text-xs text-slate-500">Appear offline to other players</div>
                             </div>
                             <Switch checked={privacySettings.hideOnlineStatus} onCheckedChange={(value) => setPrivacySettings({ ...privacySettings, hideOnlineStatus: value })} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div>
                                <div className="font-medium text-slate-900">Block Messages from Strangers</div>
                                <div className="text-xs text-slate-500">Only receive messages from allies</div>
                             </div>
                             <Switch checked={privacySettings.blockStrangers} onCheckedChange={(value) => setPrivacySettings({ ...privacySettings, blockStrangers: value })} />
                          </div>

                          <Button variant="outline" className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                             <Save className="w-4 h-4 mr-2" /> Save Privacy Options
                          </Button>
                       </CardContent>
                    </Card>

                     <Card className="bg-white border-red-200" data-testid="card-danger-zone">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-5 h-5" /> Danger Zone
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <Button variant="outline" className="w-full justify-start text-slate-600" onClick={exportAccountData}>
                              <Download className="w-4 h-4 mr-2" /> Export Account Data
                           </Button>
                           <Button variant="outline" className="w-full justify-start text-orange-600 hover:bg-orange-50" onClick={logout}>
                              <LogOut className="w-4 h-4 mr-2" /> Logout from All Devices
                           </Button>
                           <Input value={deleteConfirmInput} onChange={(e) => setDeleteConfirmInput(e.target.value)} placeholder="Type DELETE to confirm" className="bg-red-50 border-red-200" />
                           <Input type="password" value={deletePasswordInput} onChange={(e) => setDeletePasswordInput(e.target.value)} placeholder="Current password" className="bg-red-50 border-red-200" />
                           <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleDeleteAccount} disabled={deleteConfirmInput.trim() !== "DELETE" || !deletePasswordInput.trim()}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Account Permanently
                           </Button>
                        </CardContent>
                      </Card>
                   </div>
                   </div>

                   {/* Account Statistics */}
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <BarChart3 className="w-5 h-5 text-blue-600" /> Account Statistics
                        </CardTitle>
                        <CardDescription>Your account activity and progression overview</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="text-3xl font-bold text-primary">1,247</div>
                              <div className="text-xs text-slate-600 mt-1">Total Play Time (hrs)</div>
                           </div>
                           <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="text-3xl font-bold text-green-600">89</div>
                              <div className="text-xs text-slate-600 mt-1">Days Active</div>
                           </div>
                           <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="text-3xl font-bold text-purple-600">342</div>
                              <div className="text-xs text-slate-600 mt-1">Missions Completed</div>
                           </div>
                           <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="text-3xl font-bold text-amber-600">56</div>
                              <div className="text-xs text-slate-600 mt-1">Achievements Unlocked</div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Account Management Tools */}
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <SettingsIcon className="w-5 h-5 text-slate-600" /> Account Management Tools
                        </CardTitle>
                        <CardDescription>Advanced account controls and preferences</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <h3 className="text-sm font-bold text-slate-700">Data Management</h3>
                              <div className="space-y-2">
                                 <Button variant="outline" className="w-full justify-start" onClick={exportAccountData}>
                                    <Download className="w-4 h-4 mr-2" /> Export All Account Data
                                 </Button>
                                 <Button variant="outline" className="w-full justify-start" disabled>
                                    <Upload className="w-4 h-4 mr-2" /> Import Account Data
                                 </Button>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-sm font-bold text-slate-700">Session Management</h3>
                              <div className="space-y-2">
                                 <Button variant="outline" className="w-full justify-start text-orange-600 hover:bg-orange-50" onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" /> Logout from All Devices
                                 </Button>
                                 <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded border border-slate-200">
                                    This will terminate all active sessions across all devices.
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-sm font-bold text-slate-700">Account Information</h3>
                              <div className="space-y-1 text-xs">
                                 <div className="flex justify-between p-2 bg-slate-50 rounded">
                                    <span className="text-slate-600">Account ID:</span>
                                    <span className="font-mono text-slate-900">#{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                                 </div>
                                 <div className="flex justify-between p-2 bg-slate-50 rounded">
                                    <span className="text-slate-600">Created:</span>
                                    <span className="text-slate-900">{new Date().toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex justify-between p-2 bg-slate-50 rounded">
                                    <span className="text-slate-600">Last Login:</span>
                                    <span className="text-slate-900">Just now</span>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-sm font-bold text-slate-700">Account Actions</h3>
                              <div className="space-y-2">
                                 <Button variant="outline" className="w-full justify-start text-blue-600 hover:bg-blue-50" disabled>
                                    <Activity className="w-4 h-4 mr-2" /> View Activity Log
                                 </Button>
                                 <Button variant="outline" className="w-full justify-start text-purple-600 hover:bg-purple-50" disabled>
                                    <Shield className="w-4 h-4 mr-2" /> Security History
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                    </Card>
                </div>
            </TabsContent>

           {/* NOTIFICATIONS TAB */}
           <TabsContent value="notifications" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-notifications">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Bell className="w-5 h-5 text-yellow-600" /> Notification Preferences
                    </CardTitle>
                    <CardDescription>Control which events trigger alerts and notifications.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                          { key: "attackAlerts", icon: Shield, label: "Attack Alerts", desc: "Get notified when your planet is under attack", color: "text-red-500" },
                          { key: "buildComplete", icon: CheckCircle, label: "Build Complete", desc: "Notify when constructions finish", color: "text-green-500" },
                          { key: "researchComplete", icon: CheckCircle, label: "Research Complete", desc: "Notify when research completes", color: "text-blue-500" },
                          { key: "fleetArrival", icon: CheckCircle, label: "Fleet Arrival", desc: "Notify when fleets reach destination", color: "text-purple-500" },
                          { key: "messages", icon: Mail, label: "New Messages", desc: "Notify on incoming messages", color: "text-slate-500" },
                          { key: "allianceActivity", icon: Users, label: "Alliance Activity", desc: "Notify on alliance events", color: "text-orange-500" }
                       ].map(item => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", item.color)} />
                                <div>
                                   <div className="font-medium text-slate-900">{item.label}</div>
                                   <div className="text-xs text-slate-500">{item.desc}</div>
                                </div>
                             </div>
                             <Switch 
                                checked={notifications[item.key as keyof typeof notifications]}
                                onCheckedChange={(v) => setNotifications({...notifications, [item.key]: v})}
                             />
                          </div>
                       ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                       <h4 className="font-bold text-slate-900">Delivery Methods</h4>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Bell className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Browser Notifications</div>
                                <div className="text-xs text-slate-500">Show desktop notifications</div>
                             </div>
                          </div>
                          <Switch checked={notifications.browserNotifications} onCheckedChange={(value) => setNotifications({ ...notifications, browserNotifications: value })} />
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Mail className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Email Notifications</div>
                                <div className="text-xs text-slate-500">Send important alerts via email</div>
                             </div>
                          </div>
                          <Switch checked={notifications.emailNotifications} onCheckedChange={(value) => setNotifications({ ...notifications, emailNotifications: value })} />
                       </div>

                       <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                          <Save className="w-4 h-4 mr-2" /> Save Notification Settings
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>

           {/* DISPLAY TAB */}
           <TabsContent value="display" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 <Card className="bg-white border-slate-200" data-testid="card-display-theme">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Palette className="w-5 h-5 text-purple-600" /> Theme & Appearance
                       </CardTitle>
                    </CardHeader>
                   <CardContent className="space-y-4">
                       <div className="space-y-3">
                          {THEME_PRESET_OPTIONS.map((themeOption) => {
                             const ThemeIcon = themeOption.icon;
                             const isSelected = displaySettings.themePreset === themeOption.value;

                             return (
                                <button
                                   key={themeOption.value}
                                   type="button"
                                   className={cn(
                                      "w-full rounded-xl border p-4 text-left transition-all",
                                      isSelected
                                         ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                                         : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/80",
                                   )}
                                   onClick={() =>
                                      setDisplaySettings({
                                         ...displaySettings,
                                         themePreset: themeOption.value,
                                         darkMode: themeOption.value !== "og-white",
                                      })
                                   }
                                >
                                   <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                         <div className="rounded-lg border border-slate-200 bg-white p-2">
                                            <ThemeIcon className="w-5 h-5 text-slate-700" />
                                         </div>
                                         <div>
                                            <div className="font-medium text-slate-900">{themeOption.label}</div>
                                            <div className="text-xs text-slate-500">{themeOption.description}</div>
                                         </div>
                                      </div>
                                      {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                                   </div>
                                   <div className={cn("mt-3 h-16 rounded-lg border", themeOption.previewClassName)} />
                                   <div className="mt-3 text-xs text-slate-500">{themeOption.helper}</div>
                                </button>
                             );
                          })}
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Eye className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Compact View</div>
                                <div className="text-xs text-slate-500">Show more information in less space</div>
                             </div>
                          </div>
                          <Switch 
                             checked={displaySettings.compactView}
                             onCheckedChange={(v) => setDisplaySettings({...displaySettings, compactView: v})}
                          />
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Zap className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Animations</div>
                                <div className="text-xs text-slate-500">Enable smooth transitions and effects</div>
                             </div>
                          </div>
                          <Switch 
                             checked={displaySettings.showAnimations}
                             onCheckedChange={(v) => setDisplaySettings({...displaySettings, showAnimations: v})}
                          />
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200" data-testid="card-display-language">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Languages className="w-5 h-5 text-blue-600" /> Language & Region
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Interface Language</label>
                          <Select value={displaySettings.language} onValueChange={(v) => setDisplaySettings({...displaySettings, language: v})}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="pt">Português</SelectItem>
                                <SelectItem value="zh">中文</SelectItem>
                                <SelectItem value="ja">日本語</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Time Format</label>
                          <Select value={displaySettings.timeFormat} onValueChange={(v) => setDisplaySettings({ ...displaySettings, timeFormat: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                <SelectItem value="24h">24-hour</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Number Format</label>
                          <Select value={displaySettings.numberFormat} onValueChange={(v) => setDisplaySettings({ ...displaySettings, numberFormat: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="comma">1,234,567</SelectItem>
                                <SelectItem value="dot">1.234.567</SelectItem>
                                <SelectItem value="space">1 234 567</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                          <Save className="w-4 h-4 mr-2" /> Save Display Settings
                       </Button>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200" data-testid="card-display-mobile-touch">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Smartphone className="w-5 h-5 text-emerald-600" /> Mobile, Touch & Browser
                       </CardTitle>
                       <CardDescription>Optimize layout behavior for phones, tablets, touch screens, and browser widths.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Device Profile</label>
                          <Select value={displaySettings.deviceProfile} onValueChange={(v) => setDisplaySettings({ ...displaySettings, deviceProfile: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="auto">Auto Detect</SelectItem>
                                <SelectItem value="phone">Phone Layout</SelectItem>
                                <SelectItem value="tablet">Tablet Layout</SelectItem>
                                <SelectItem value="desktop">Desktop Layout</SelectItem>
                                <SelectItem value="wide">Wide Browser Layout</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Browser Width</label>
                          <Select value={displaySettings.browserWidth} onValueChange={(v) => setDisplaySettings({ ...displaySettings, browserWidth: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="compact">Compact Command</SelectItem>
                                <SelectItem value="standard">Standard Browser</SelectItem>
                                <SelectItem value="wide">Wide Browser</SelectItem>
                                <SelectItem value="full">Full Width</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Touch Target Size</label>
                          <Select value={displaySettings.touchTargetSize} onValueChange={(v) => setDisplaySettings({ ...displaySettings, touchTargetSize: v })}>
                             <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="comfortable">Comfortable</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>

                       <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div>
                                <div className="font-medium text-slate-900">Mobile Optimized Layout</div>
                                <div className="text-xs text-slate-500">Use drawer navigation, compact spacing, and mobile-friendly stacks.</div>
                             </div>
                             <Switch checked={displaySettings.mobileOptimized} onCheckedChange={(v) => setDisplaySettings({ ...displaySettings, mobileOptimized: v })} />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div>
                                <div className="font-medium text-slate-900">Touch Controls</div>
                                <div className="text-xs text-slate-500">Increase touch hit zones and enable touch-oriented interactions.</div>
                             </div>
                             <Switch checked={displaySettings.touchControls} onCheckedChange={(v) => setDisplaySettings({ ...displaySettings, touchControls: v })} />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div>
                                <div className="font-medium text-slate-900">Sticky Mobile Bars</div>
                                <div className="text-xs text-slate-500">Keep the top command and resource bar visible on small screens.</div>
                             </div>
                             <Switch checked={displaySettings.stickyMobileBars} onCheckedChange={(v) => setDisplaySettings({ ...displaySettings, stickyMobileBars: v })} />
                          </div>
                       </div>

                       <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                          <Save className="w-4 h-4 mr-2" /> Save Mobile & Touch Settings
                       </Button>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200 xl:col-span-3" data-testid="card-display-viewport-diagnostics">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Monitor className="w-5 h-5 text-cyan-600" /> Viewport Diagnostics
                       </CardTitle>
                       <CardDescription>Live screen and browser data so you can confirm how the interface is being classified.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Resolution</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{viewportInfo.width} x {viewportInfo.height}</div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Breakpoint</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{viewportInfo.breakpoint}</div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Orientation</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{viewportInfo.orientation}</div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Touch</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{viewportInfo.touch ? "Enabled" : "No"}</div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Pixel Ratio</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{viewportInfo.pixelRatio.toFixed(2)}x</div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-xs uppercase tracking-wider text-slate-500">Saved Layout</div>
                          <div className="mt-2 text-xl font-bold text-slate-900">{displaySettings.browserWidth}</div>
                       </div>
                    </CardContent>
                    </Card>
                </div>
            </TabsContent>
           <TabsContent value="sound" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-sound">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <Volume2 className="w-5 h-5 text-green-600" /> Audio Settings
                    </CardTitle>
                    <CardDescription>Configure game sounds and music.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="flex items-center gap-3">
                          {soundSettings.enabled ? <Volume2 className="w-6 h-6 text-green-500" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
                          <div>
                             <div className="font-medium text-slate-900">Master Sound</div>
                             <div className="text-xs text-slate-500">Enable or disable all game audio</div>
                          </div>
                       </div>
                       <Switch 
                          checked={soundSettings.enabled}
                          onCheckedChange={(v) => setSoundSettings({...soundSettings, enabled: v})}
                       />
                    </div>
                    
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-900">Master Volume</label>
                          <span className="font-mono text-primary">{soundSettings.volume}%</span>
                       </div>
                       <Slider 
                          value={[soundSettings.volume]} 
                          max={100}
                          disabled={!soundSettings.enabled}
                          onValueChange={(v) => setSoundSettings({...soundSettings, volume: v[0]})}
                       />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                             <div className="font-medium text-slate-900">Alert Sounds</div>
                             <div className="text-xs text-slate-500">Play sounds for important events</div>
                          </div>
                          <Switch 
                             checked={soundSettings.alertSounds}
                             disabled={!soundSettings.enabled}
                             onCheckedChange={(v) => setSoundSettings({...soundSettings, alertSounds: v})}
                          />
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                             <div className="font-medium text-slate-900">Ambient Sounds</div>
                             <div className="text-xs text-slate-500">Background space ambiance</div>
                          </div>
                          <Switch 
                             checked={soundSettings.ambientSounds}
                             disabled={!soundSettings.enabled}
                             onCheckedChange={(v) => setSoundSettings({...soundSettings, ambientSounds: v})}
                          />
                       </div>
                    </div>

                     <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" /> Save Sound Settings
                     </Button>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* GAMEPLAY TAB */}
            <TabsContent value="gameplay" className="mt-6">
               <div className="space-y-6">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <Zap className="w-5 h-5 text-amber-500" /> Gameplay Preferences
                        </CardTitle>
                        <CardDescription>Configure automation, combat behavior, fleet management, and UI preferences.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Automation</h3>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Auto-Use Turns</div><div className="text-xs text-slate-500">Automatically spend turns on actions</div></div>
                                 <Switch checked={gameplaySettings.autoUseTurns} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, autoUseTurns: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Auto-Collect Resources</div><div className="text-xs text-slate-500">Collect resources when arriving at planets</div></div>
                                 <Switch checked={gameplaySettings.autoCollectResources} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, autoCollectResources: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Auto-Repair Equipment</div><div className="text-xs text-slate-500">Auto-repair when durability is low</div></div>
                                 <Switch checked={gameplaySettings.autoRepairEquipment} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, autoRepairEquipment: v})} />
                              </div>
                              {gameplaySettings.autoRepairEquipment && (
                                 <div className="space-y-2 pl-4 border-l-2 border-amber-200">
                                    <div className="flex justify-between items-center">
                                       <label className="text-xs font-medium text-slate-700">Repair Threshold</label>
                                       <span className="text-xs font-mono text-slate-600">{gameplaySettings.autoRepairThreshold}%</span>
                                    </div>
                                    <Slider value={[gameplaySettings.autoRepairThreshold]} min={10} max={90} step={5} onValueChange={(v) => setGameplaySettings({...gameplaySettings, autoRepairThreshold: v[0]})} />
                                 </div>
                              )}
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Auto-Expire Orders</div><div className="text-xs text-slate-500">Auto-cancel stale market/trade orders</div></div>
                                 <Switch checked={gameplaySettings.autoExpireOrders} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, autoExpireOrders: v})} />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Combat & Fleet</h3>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Confirm Fleet Send</div><div className="text-xs text-slate-500">Show confirmation before launching fleet</div></div>
                                 <Switch checked={gameplaySettings.confirmFleetSend} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, confirmFleetSend: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Confirm Attack</div><div className="text-xs text-slate-500">Show confirmation before attacks</div></div>
                                 <Switch checked={gameplaySettings.confirmAttack} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, confirmAttack: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Show Damage Numbers</div><div className="text-xs text-slate-500">Display floating combat text</div></div>
                                 <Switch checked={gameplaySettings.showDamageNumbers} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, showDamageNumbers: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Show Flight Times</div><div className="text-xs text-slate-500">Display fleet travel duration</div></div>
                                 <Switch checked={gameplaySettings.showFlightTimes} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, showFlightTimes: v})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-700">Default Fleet Speed</label>
                                 <Select value={gameplaySettings.defaultFleetSpeed} onValueChange={(v) => setGameplaySettings({...gameplaySettings, defaultFleetSpeed: v})}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="slow">Slow (25%)</SelectItem>
                                       <SelectItem value="normal">Normal (50%)</SelectItem>
                                       <SelectItem value="fast">Fast (75%)</SelectItem>
                                       <SelectItem value="maximum">Maximum (100%)</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-700">Combat Log Verbosity</label>
                                 <Select value={gameplaySettings.combatLogVerbosity} onValueChange={(v) => setGameplaySettings({...gameplaySettings, combatLogVerbosity: v})}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="minimal">Minimal</SelectItem>
                                       <SelectItem value="normal">Normal</SelectItem>
                                       <SelectItem value="detailed">Detailed</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Galaxy & Navigation</h3>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Show Player Coordinates</div><div className="text-xs text-slate-500">Display [G:S:P] format coordinates</div></div>
                                 <Switch checked={gameplaySettings.showPlayerCoordinates} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, showPlayerCoordinates: v})} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Auto-Bookmark Planets</div><div className="text-xs text-slate-500">Auto-bookmark visited planets</div></div>
                                 <Switch checked={gameplaySettings.autoBookmarkPlanets} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, autoBookmarkPlanets: v})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-700">Default Galaxy View</label>
                                 <Select value={gameplaySettings.defaultGalaxyView} onValueChange={(v) => setGameplaySettings({...gameplaySettings, defaultGalaxyView: v})}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="system">System View</SelectItem>
                                       <SelectItem value="galaxy">Galaxy View</SelectItem>
                                       <SelectItem value="list">List View</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Trading & Economy</h3>
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                 <div><div className="font-medium text-sm text-slate-900">Show Market Graphs</div><div className="text-xs text-slate-500">Display price history charts</div></div>
                                 <Switch checked={gameplaySettings.showMarketGraphs} onCheckedChange={(v) => setGameplaySettings({...gameplaySettings, showMarketGraphs: v})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-700">Preferred Trade Resource</label>
                                 <Select value={gameplaySettings.preferredTradeResource} onValueChange={(v) => setGameplaySettings({...gameplaySettings, preferredTradeResource: v})}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="metal">Metal</SelectItem>
                                       <SelectItem value="crystal">Crystal</SelectItem>
                                       <SelectItem value="deuterium">Deuterium</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-700">Default Sort Order</label>
                                 <Select value={gameplaySettings.defaultSortOrder} onValueChange={(v) => setGameplaySettings({...gameplaySettings, defaultSortOrder: v})}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="power">Power</SelectItem>
                                       <SelectItem value="level">Level</SelectItem>
                                       <SelectItem value="name">Name</SelectItem>
                                       <SelectItem value="recent">Recent</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              {gameplaySettings.autoExpireOrders && (
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                       <label className="text-xs font-medium text-slate-700">Order Expiry Days</label>
                                       <span className="text-xs font-mono text-slate-600">{gameplaySettings.orderExpiryDays}d</span>
                                    </div>
                                    <Slider value={[gameplaySettings.orderExpiryDays]} min={1} max={30} step={1} onValueChange={(v) => setGameplaySettings({...gameplaySettings, orderExpiryDays: v[0]})} />
                                 </div>
                              )}
                           </div>
                        </div>

                        <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                           <Save className="w-4 h-4 mr-2" /> Save Gameplay Settings
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            {/* PRIVACY TAB */}
            <TabsContent value="privacy" className="mt-6">
               <Card className="bg-white border-slate-200">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Shield className="w-5 h-5 text-blue-600" /> Privacy & Visibility
                     </CardTitle>
                     <CardDescription>Control what other players can see about your empire and activity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Online Presence</h3>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Hide Online Status</div><div className="text-xs text-slate-500">Others cannot see when you are online</div></div>
                              <Switch checked={privacySettings.hideOnlineStatus} onCheckedChange={(v) => setPrivacySettings({...privacySettings, hideOnlineStatus: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Show Last Online</div><div className="text-xs text-slate-500">Display your last login timestamp</div></div>
                              <Switch checked={privacySettings.showLastOnline} onCheckedChange={(v) => setPrivacySettings({...privacySettings, showLastOnline: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Show Play Time</div><div className="text-xs text-slate-500">Display total play time on profile</div></div>
                              <Switch checked={privacySettings.showPlayTime} onCheckedChange={(v) => setPrivacySettings({...privacySettings, showPlayTime: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Allow Spectators</div><div className="text-xs text-slate-500">Let others view your empire</div></div>
                              <Switch checked={privacySettings.allowSpectators} onCheckedChange={(v) => setPrivacySettings({...privacySettings, allowSpectators: v})} />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Profile Display</h3>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Show Empire Level</div><div className="text-xs text-slate-500">Display empire level on profile</div></div>
                              <Switch checked={privacySettings.showEmpireLevel} onCheckedChange={(v) => setPrivacySettings({...privacySettings, showEmpireLevel: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Show Alliance Tag</div><div className="text-xs text-slate-500">Display alliance membership</div></div>
                              <Switch checked={privacySettings.showAllianceTag} onCheckedChange={(v) => setPrivacySettings({...privacySettings, showAllianceTag: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Hide From Leaderboard</div><div className="text-xs text-slate-500">Remove yourself from public rankings</div></div>
                              <Switch checked={privacySettings.hideFromLeaderboard} onCheckedChange={(v) => setPrivacySettings({...privacySettings, hideFromLeaderboard: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Show Achievement Progress</div><div className="text-xs text-slate-500">Display incomplete achievements</div></div>
                              <Switch checked={privacySettings.showAchievementProgress} onCheckedChange={(v) => setPrivacySettings({...privacySettings, showAchievementProgress: v})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-700">Profile Visibility</label>
                              <Select value={privacySettings.profileVisibility} onValueChange={(v) => setPrivacySettings({...privacySettings, profileVisibility: v})}>
                                 <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="everyone">Everyone</SelectItem>
                                    <SelectItem value="alliance">Alliance Only</SelectItem>
                                    <SelectItem value="friends">Friends Only</SelectItem>
                                    <SelectItem value="nobody">Nobody</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-700">Battle Reports Visibility</label>
                              <Select value={privacySettings.showBattleReports} onValueChange={(v) => setPrivacySettings({...privacySettings, showBattleReports: v})}>
                                 <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="everyone">Everyone</SelectItem>
                                    <SelectItem value="alliance">Alliance Only</SelectItem>
                                    <SelectItem value="self">Self Only</SelectItem>
                                    <SelectItem value="nobody">Nobody</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100">
                        <div><div className="font-medium text-slate-900">Block Stranger Messages</div><div className="text-xs text-slate-500">Only receive messages from alliance members and friends</div></div>
                        <Switch checked={privacySettings.blockStrangers} onCheckedChange={(v) => setPrivacySettings({...privacySettings, blockStrangers: v})} />
                     </div>

                     <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" /> Save Privacy Settings
                     </Button>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* ACCESSIBILITY TAB */}
            <TabsContent value="accessibility" className="mt-6">
               <Card className="bg-white border-slate-200">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Eye className="w-5 h-5 text-indigo-600" /> Accessibility
                     </CardTitle>
                     <CardDescription>Visual, motion, and navigation accessibility options.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Visual</h3>
                           <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-700">Font Size</label>
                              <Select value={accessibilitySettings.fontSize} onValueChange={(v) => setAccessibilitySettings({...accessibilitySettings, fontSize: v})}>
                                 <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium (Default)</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="x-large">Extra Large</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-700">Color Blind Mode</label>
                              <Select value={accessibilitySettings.colorBlindMode} onValueChange={(v) => setAccessibilitySettings({...accessibilitySettings, colorBlindMode: v})}>
                                 <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="protanopia">Protanopia (Red-Green)</SelectItem>
                                    <SelectItem value="deuteranopia">Deuteranopia (Green-Red)</SelectItem>
                                    <SelectItem value="tritanopia">Tritanopia (Blue-Yellow)</SelectItem>
                                    <SelectItem value="achromatopsia">Achromatopsia (Grayscale)</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">High Contrast</div><div className="text-xs text-slate-500">Increase visual contrast</div></div>
                              <Switch checked={accessibilitySettings.highContrast} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, highContrast: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Focus Indicators</div><div className="text-xs text-slate-500">Show focus outlines on interactive elements</div></div>
                              <Switch checked={accessibilitySettings.focusIndicators} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, focusIndicators: v})} />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Motion & Interaction</h3>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Reduced Motion</div><div className="text-xs text-slate-500">Minimize animations and transitions</div></div>
                              <Switch checked={accessibilitySettings.reducedMotion} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, reducedMotion: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Simplify Transitions</div><div className="text-xs text-slate-500">Use instant transitions instead of animations</div></div>
                              <Switch checked={accessibilitySettings.simplifyTransitions} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, simplifyTransitions: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Pause Animations on Hover</div><div className="text-xs text-slate-500">Stop animations when hovering</div></div>
                              <Switch checked={accessibilitySettings.pauseAnimationsOnHover} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, pauseAnimationsOnHover: v})} />
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                              <div><div className="font-medium text-sm text-slate-900">Keyboard Navigation</div><div className="text-xs text-slate-500">Navigate with keyboard shortcuts</div></div>
                              <Switch checked={accessibilitySettings.keyboardNavigation} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, keyboardNavigation: v})} />
                           </div>
                        </div>
                     </div>

                     <Separator />

                     <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Screen Reader & Notifications</h3>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                           <div><div className="font-medium text-sm text-slate-900">Screen Reader Mode</div><div className="text-xs text-slate-500">Optimize UI for screen readers</div></div>
                           <Switch checked={accessibilitySettings.screenReaderMode} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, screenReaderMode: v})} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                           <div><div className="font-medium text-sm text-slate-900">Announce Notifications</div><div className="text-xs text-slate-500">Announce new notifications audibly</div></div>
                           <Switch checked={accessibilitySettings.announceNotifications} onCheckedChange={(v) => setAccessibilitySettings({...accessibilitySettings, announceNotifications: v})} />
                        </div>
                     </div>

                     <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" /> Save Accessibility Settings
                     </Button>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* DATA MANAGEMENT TAB */}
            <TabsContent value="data" className="mt-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <Database className="w-5 h-5 text-cyan-600" /> Data & Sync
                        </CardTitle>
                        <CardDescription>Manage game data, cloud sync, and auto-save.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                           <div><div className="font-medium text-sm text-slate-900">Cloud Sync</div><div className="text-xs text-slate-500">Sync settings across devices</div></div>
                           <Switch checked={dataSettings.enableCloudSync} onCheckedChange={(v) => setDataSettings({...dataSettings, enableCloudSync: v})} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                           <div><div className="font-medium text-sm text-slate-900">Compression</div><div className="text-xs text-slate-500">Compress exported data files</div></div>
                           <Switch checked={dataSettings.compressionEnabled} onCheckedChange={(v) => setDataSettings({...dataSettings, compressionEnabled: v})} />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <label className="text-xs font-medium text-slate-700">Auto-Save Interval</label>
                              <span className="text-xs font-mono text-slate-600">{dataSettings.autoSaveInterval}s</span>
                           </div>
                           <Slider value={[dataSettings.autoSaveInterval]} min={10} max={120} step={5} onValueChange={(v) => setDataSettings({...dataSettings, autoSaveInterval: v[0]})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-medium text-slate-700">Export Format</label>
                           <Select value={dataSettings.exportFormat} onValueChange={(v) => setDataSettings({...dataSettings, exportFormat: v})}>
                              <SelectTrigger className="bg-slate-50 border-slate-200 h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="json">JSON</SelectItem>
                                 <SelectItem value="csv">CSV</SelectItem>
                                 <SelectItem value="xml">XML</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="text-xs text-slate-500">
                           {dataSettings.lastExportDate ? `Last export: ${new Date(dataSettings.lastExportDate).toLocaleDateString()}` : "No exports yet"}
                        </div>
                        <Button className="w-full" onClick={() => savePlayerOptionsMutation.mutate()} disabled={savePlayerOptionsMutation.isPending}>
                           <Save className="w-4 h-4 mr-2" /> Save Data Settings
                        </Button>
                     </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                           <Download className="w-5 h-5 text-green-600" /> Export & Import
                        </CardTitle>
                        <CardDescription>Backup or transfer your settings between accounts.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded border border-slate-100">
                           <div className="text-sm font-medium text-slate-900 mb-1">Export Settings</div>
                           <div className="text-xs text-slate-500 mb-3">Download all your settings as a JSON file that can be imported later.</div>
                           <Button variant="outline" className="w-full" onClick={() => exportSettingsMutation.mutate()} disabled={exportSettingsMutation.isPending}>
                              <Download className="w-4 h-4 mr-2" /> {exportSettingsMutation.isPending ? "Exporting..." : "Export Settings File"}
                           </Button>
                        </div>

                        <div className="p-4 bg-slate-50 rounded border border-slate-100">
                           <div className="text-sm font-medium text-slate-900 mb-1">Import Settings</div>
                           <div className="text-xs text-slate-500 mb-3">Restore settings from a previously exported file.</div>
                           <label className="flex items-center justify-center w-full h-10 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                              <Upload className="w-4 h-4 mr-2 text-slate-500" />
                              <span className="text-sm text-slate-600">Choose Settings File</span>
                              <input type="file" accept=".json" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 try {
                                    const text = await file.text();
                                    const data = JSON.parse(text);
                                    await fetchJson("/api/settings/player/import", { method: "POST", body: JSON.stringify(data) });
                                    toast({ title: "Settings imported", description: "Your settings have been restored." });
                                    queryClient.invalidateQueries({ queryKey: ["player-options"] });
                                    queryClient.invalidateQueries({ queryKey: ["player-gameplay"] });
                                    queryClient.invalidateQueries({ queryKey: ["player-accessibility"] });
                                    queryClient.invalidateQueries({ queryKey: ["player-data"] });
                                 } catch (err) {
                                    toast({ title: "Import failed", description: "Invalid settings file.", variant: "destructive" });
                                 }
                              }} />
                           </label>
                        </div>

                        <div className="p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-700">
                           <strong>Tip:</strong> Export your settings before making major changes so you can restore them if needed.
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

           {isActualAdmin && (
           <TabsContent value="admin-access" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 <Card className="bg-white border-slate-200 xl:col-span-2">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Shield className="w-5 h-5 text-red-600" /> Admin Authentication
                       </CardTitle>
                       <CardDescription>
                          Sign in with an admin account from Settings, review access level, and switch between player view and admin mode.
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {isActualAdmin ? (
                          <>
                             <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                   <Badge variant="destructive">{isAdmin ? "Admin Mode Active" : "Admin Account Authenticated"}</Badge>
                                   <Badge variant="secondary">{formatAdminRole(adminIdentity?.role || adminRole)}</Badge>
                                   {adminIdentity?.masqueradingAsUserId && <Badge variant="outline">Masquerading Session</Badge>}
                                </div>
                                <div className="text-sm text-slate-700">
                                   {isAdmin
                                      ? "Privileged systems are active for this session."
                                      : "This account has admin authority but is currently in player view."}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   <Button
                                      variant={isAdmin ? "destructive" : "outline"}
                                      onClick={toggleAdmin}
                                      data-testid="button-inline-toggle-admin-mode"
                                   >
                                      {isAdmin ? "Return to User View" : "Enable Admin Mode"}
                                   </Button>
                                   <Button variant="outline" onClick={() => setLocation("/admin")}>
                                      Open Control Panel
                                   </Button>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <div className="text-sm font-bold text-slate-700">Current Permission Envelope</div>
                                <div className="flex flex-wrap gap-2">
                                   {currentAdminPermissions.length === 0 && (
                                      <span className="text-sm text-slate-500">No admin permissions assigned.</span>
                                   )}
                                   {currentAdminPermissions.map((permission) => (
                                      <Badge key={permission} variant="outline" className="bg-slate-50">
                                         {PERMISSION_LABELS[permission] || permission}
                                      </Badge>
                                   ))}
                                </div>
                             </div>
                          </>
                       ) : (
                          <>
                             <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                Use an approved admin account to unlock protected configuration menus, the control panel, and developer systems.
                             </div>
                             {isDev && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                   Local development defaults: <span className="font-mono">admin / Admin@12345</span> or <span className="font-mono">devadmin / dev-password</span>
                                </div>
                             )}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <label className="text-sm font-bold text-slate-700">Admin Username or Email</label>
                                   <Input
                                      value={adminIdentifier}
                                      onChange={(e) => setAdminIdentifier(e.target.value)}
                                      placeholder="admin or admin@example.com"
                                      autoComplete="username"
                                      className="bg-slate-50 border-slate-200"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-sm font-bold text-slate-700">Admin Password</label>
                                   <Input
                                      type="password"
                                      value={adminPassword}
                                      onChange={(e) => setAdminPassword(e.target.value)}
                                      placeholder="Enter privileged password"
                                      autoComplete="current-password"
                                      className="bg-slate-50 border-slate-200"
                                   />
                                </div>
                             </div>
                             <Button className="w-full" onClick={handleAdminLogin} disabled={adminLoginMutation.isPending}>
                                {adminLoginMutation.isPending ? (
                                   <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating Admin
                                   </>
                                ) : (
                                   <>
                                      <Lock className="w-4 h-4 mr-2" /> Sign In As Admin
                                   </>
                                )}
                             </Button>
                          </>
                       )}
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Users className="w-5 h-5 text-slate-700" /> Role Matrix
                       </CardTitle>
                       <CardDescription>Regular admin and dev admin access are separated by real permission gates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {ADMIN_ROLE_OPTIONS.map((roleOption) => (
                          <div key={roleOption.value} className={cn(
                             "rounded-lg border p-3",
                             roleOption.value === "devadmin" ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50",
                           )}>
                             <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold text-slate-900">{roleOption.label}</div>
                                {roleOption.value === "devadmin" && <Badge variant="secondary">Elevated</Badge>}
                             </div>
                             <div className="mt-1 text-xs text-slate-600">{roleOption.description}</div>
                          </div>
                       ))}
                       <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                          {canUseDevTools
                             ? "This session can access developer-only systems such as masquerade, world tools, and shortcut controls."
                             : "Developer-only systems remain locked unless the account carries dev admin permissions."}
                       </div>
                    </CardContent>
                 </Card>
              </div>

              {isActualAdmin && (
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <Card className="bg-white border-slate-200">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Key className="w-5 h-5 text-blue-600" /> Admin Account Provisioning
                          </CardTitle>
                          <CardDescription>
                             Grant admin or dev admin roles to existing player accounts from inside Settings.
                          </CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          {!canAdministrate && (
                             <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                This account can view admin status, but it does not have permission to grant or remove admin roles.
                             </div>
                          )}
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Target Username or Email</label>
                             <Input
                                value={newAdminIdentifier}
                                onChange={(e) => setNewAdminIdentifier(e.target.value)}
                                placeholder="playername or player@example.com"
                                className="bg-slate-50 border-slate-200"
                                disabled={!canAdministrate}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Role Template</label>
                             <Select value={newAdminRole} onValueChange={setNewAdminRole} disabled={!canAdministrate}>
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   {ADMIN_ROLE_OPTIONS.map((roleOption) => (
                                      <SelectItem key={roleOption.value} value={roleOption.value}>
                                         {roleOption.label}
                                      </SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                             {(ADMIN_ROLE_OPTIONS.find((roleOption) => roleOption.value === newAdminRole)?.description) || "Permission template selected."}
                          </div>
                          <Button className="w-full" onClick={handleCreateAdminAccount} disabled={!canAdministrate || createAdminAccountMutation.isPending}>
                             {createAdminAccountMutation.isPending ? (
                                <>
                                   <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Granting Access
                                </>
                             ) : (
                                <>
                                   <Shield className="w-4 h-4 mr-2" /> Grant Admin Role
                                </>
                             )}
                          </Button>
                       </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900">
                             <Users className="w-5 h-5 text-green-600" /> Active Admin Accounts
                          </CardTitle>
                          <CardDescription>Review current admin accounts, roles, and permission bundles.</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-3">
                          {(adminAccounts?.accounts || []).length === 0 && (
                             <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                No admin accounts are registered yet.
                             </div>
                          )}
                          {(adminAccounts?.accounts || []).map((account) => (
                             <div key={account.userId} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                   <div>
                                      <div className="font-semibold text-slate-900">{account.username}</div>
                                      <div className="text-xs text-slate-500">{account.email || account.userId}</div>
                                   </div>
                                   <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant={account.role === "devadmin" ? "destructive" : "secondary"}>
                                         {formatAdminRole(account.role)}
                                      </Badge>
                                      {canAdministrate && account.userId !== adminIdentity?.actingAdminUserId && (
                                         <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAdminAccountMutation.mutate(account.userId)}
                                            disabled={removeAdminAccountMutation.isPending}
                                         >
                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                         </Button>
                                      )}
                                   </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {(account.permissions || []).map((permission) => (
                                      <Badge key={`${account.userId}-${permission}`} variant="outline" className="bg-white">
                                         {PERMISSION_LABELS[permission] || permission}
                                      </Badge>
                                   ))}
                                </div>
                             </div>
                          ))}
                       </CardContent>
                    </Card>
                </div>
              )}
            </TabsContent>
           )}

           {/* GAME RULES TAB (Admin Only) */}
           {isAdmin && (
             <TabsContent value="game" className="mt-6">
                <Card className="bg-white border-red-200 border-l-4 border-l-red-500">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900">
                         <Zap className="w-5 h-5 text-red-600" /> Universe Parameters
                         <Badge variant="destructive">Admin Only</Badge>
                      </CardTitle>
                      <CardDescription>Adjusting these values will instantly affect game logic for all players.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-8">
                      
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <div>
                               <label className="font-bold text-slate-900 block">Game Speed Multiplier</label>
                               <span className="text-xs text-slate-500">Affects build times, research, and production ticks.</span>
                            </div>
                            <div className="font-mono font-bold text-xl text-primary">{config.gameSpeed}x</div>
                         </div>
                         <Slider 
                            value={[config.gameSpeed]} 
                            min={1} max={10} step={1}
                            onValueChange={(v) => updateConfig({ gameSpeed: v[0] })}
                         />
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <div>
                               <label className="font-bold text-slate-900 block">Fleet Flight Speed</label>
                               <span className="text-xs text-slate-500">Multiplies the travel speed of all ships.</span>
                            </div>
                            <div className="font-mono font-bold text-xl text-blue-600">{config.fleetSpeed}x</div>
                         </div>
                         <Slider 
                            value={[config.fleetSpeed]} 
                            min={1} max={10} step={1}
                            onValueChange={(v) => updateConfig({ fleetSpeed: v[0] })}
                         />
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <div>
                               <label className="font-bold text-slate-900 block">Resource Production Rate</label>
                               <span className="text-xs text-slate-500">Global multiplier for all mines and synthesizers.</span>
                            </div>
                            <div className="font-mono font-bold text-xl text-green-600">{config.resourceRate}x</div>
                         </div>
                         <Slider 
                            value={[config.resourceRate]} 
                            min={1} max={20} step={1}
                            onValueChange={(v) => updateConfig({ resourceRate: v[0] })}
                         />
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 p-4 rounded border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded border border-slate-200">
                               <Shield className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                               <div className="font-bold text-slate-900">Peace Mode</div>
                               <div className="text-xs text-slate-500">Disable all combat missions between players.</div>
                            </div>
                         </div>
                         <Switch 
                            checked={config.peaceMode}
                            onCheckedChange={(v) => updateConfig({ peaceMode: v })}
                         />
                      </div>

                   </CardContent>
                </Card>
             </TabsContent>
           )}

           {/* SERVER CONFIG TAB (Admin Only) */}
           {isAdmin && (
             <TabsContent value="server" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="bg-white border-red-200 border-l-4 border-l-red-500">
                      <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-slate-900">
                            <Server className="w-5 h-5 text-slate-600" /> Server Settings
                            <Badge variant="destructive">Admin Only</Badge>
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Universe Name</label>
                            <Input 
                               value={config.universeName}
                               onChange={(e) => updateConfig({ universeName: e.target.value })}
                               className="bg-slate-50 border-slate-200"
                            />
                         </div>
                         
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Server Timezone</label>
                            <Select value={config.serverTimezone} onValueChange={(v) => updateConfig({ serverTimezone: v })}>
                               <SelectTrigger className="bg-slate-50 border-slate-200">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                                  <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                                  <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                                  <SelectItem value="CET">CET (Central European Time)</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>

                         <div className="flex items-center justify-between pt-4">
                            <span className="text-sm font-bold text-slate-700">Maintenance Mode</span>
                            <Switch 
                               checked={config.maintenanceMode}
                               onCheckedChange={(v) => updateConfig({ maintenanceMode: v })}
                            />
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="bg-white border-red-200 border-l-4 border-l-red-500">
                      <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-slate-900">
                            <Database className="w-5 h-5 text-blue-600" /> Data Management
                            <Badge variant="destructive">Admin Only</Badge>
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="text-sm text-slate-500 mb-4">
                            Manage local game data and server snapshots.
                         </div>
                         
                         <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => backupSnapshotMutation.mutate()}
                            disabled={backupSnapshotMutation.isPending || resetUniverseMutation.isPending || restartServerMutation.isPending}
                         >
                            <Save className="w-4 h-4 mr-2" /> {backupSnapshotMutation.isPending ? "Creating Backup..." : "Create Backup Snapshot"}
                         </Button>
                         <Button variant="outline" className="w-full justify-start" onClick={() => {
                           if (resetConfirmInput.trim() !== "RESET") {
                              toast({ title: "Reset cancelled", description: "Confirmation text did not match.", variant: "destructive" });
                              return;
                           }
                           resetUniverseMutation.mutate();
                         }} disabled={backupSnapshotMutation.isPending || resetUniverseMutation.isPending || restartServerMutation.isPending || resetConfirmInput.trim() !== "RESET"}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset Universe (Wipe Data)
                         </Button>
                         <Input value={resetConfirmInput} onChange={(e) => setResetConfirmInput(e.target.value)} placeholder="Type RESET to enable universe wipe" className="bg-red-50 border-red-200" />
                         <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {
                           if (!restartAcknowledge) {
                              toast({ title: "Restart blocked", description: "Enable acknowledgement toggle first.", variant: "destructive" });
                              return;
                           }
                           restartServerMutation.mutate();
                         }} disabled={backupSnapshotMutation.isPending || resetUniverseMutation.isPending || restartServerMutation.isPending || !restartAcknowledge}>
                            <Power className="w-4 h-4 mr-2" /> Force Server Restart
                         </Button>
                         <div className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-3">
                            <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">I understand restart impact</span>
                            <Switch checked={restartAcknowledge} onCheckedChange={setRestartAcknowledge} />
                         </div>

                         <Separator />

                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                               <Clock className="w-4 h-4" /> Recent Operations
                            </div>
                            <div className="space-y-2 max-h-44 overflow-auto pr-1">
                               {(adminOperations?.operations || []).length === 0 && (
                                  <div className="text-xs text-slate-500 border border-slate-200 rounded p-2">No operations recorded yet.</div>
                               )}
                               {(adminOperations?.operations || []).map((op) => (
                                  <div key={op.id} className="border border-slate-200 rounded p-2 bg-slate-50">
                                     <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-slate-800 uppercase">{op.type.replaceAll("_", " ")}</span>
                                        <Badge variant={op.status === "completed" ? "secondary" : "destructive"} className="text-[10px] uppercase">{op.status}</Badge>
                                     </div>
                                     <div className="text-[11px] text-slate-500 mt-1">{new Date(op.requestedAt).toLocaleString()}</div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </div>
             </TabsContent>
           )}

           {/* CRON JOBS TAB (Admin Only) */}
           {isAdmin && (
             <TabsContent value="cron" className="mt-6">
                <Card className="bg-white border-red-200 border-l-4 border-l-red-500">
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-900">
                         <Clock className="w-5 h-5 text-purple-600" /> Scheduled Tasks (Cron)
                         <Badge variant="destructive">Admin Only</Badge>
                      </CardTitle>
                      <CardDescription>Manage periodic background tasks and server automation.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                         {cronJobs.map(job => {
                            const isDue = Date.now() - job.lastRun >= job.interval;
                            return (
                               <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100">
                                  <div className="flex items-center gap-4">
                                     <div className={`w-2 h-2 rounded-full ${job.enabled ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                                     <div>
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                           {job.name}
                                           <Badge variant="outline" className="text-[10px] uppercase">{job.type}</Badge>
                                        </div>
                                        <div className="text-xs text-slate-500">{job.description}</div>
                                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                                           Interval: {job.interval / 1000}s | Last Run: {new Date(job.lastRun).toLocaleTimeString()}
                                        </div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Button variant="ghost" size="sm" onClick={() => runCronJob(job.id)}>
                                        <Play className="w-4 h-4" />
                                     </Button>
                                     <Switch 
                                        checked={job.enabled}
                                        onCheckedChange={() => toggleCronJob(job.id)}
                                     />
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   </CardContent>
                </Card>
             </TabsContent>
           )}
        </Tabs>
      </div>
    </GameLayout>
  );
}
