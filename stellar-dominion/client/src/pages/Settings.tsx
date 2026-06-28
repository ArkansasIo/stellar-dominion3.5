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
  User as UserIcon, Languages, Zap, Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
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
      compactView: boolean;
      showAnimations: boolean;
      showResourceRates: boolean;
      language: string;
      timeFormat: string;
      numberFormat: string;
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
  const { config, updateConfig, cronJobs, toggleCronJob, runCronJob, isAdmin, isActualAdmin, adminRole, toggleAdmin, username, logout } = useGame();
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
   const { toast } = useToast();
  
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
    compactView: false,
    showAnimations: true,
    showResourceRates: true,
      language: "en",
      timeFormat: "24h",
      numberFormat: "comma",
  });

  const [soundSettings, setSoundSettings] = useState({
    enabled: true,
    volume: 50,
    alertSounds: true,
    ambientSounds: false
  });

   const [privacySettings, setPrivacySettings] = useState({
      hideOnlineStatus: false,
      blockStrangers: false,
   });

   const { data: accountSettings } = useQuery<AccountSettingsResponse>({
      queryKey: ["account-settings"],
      queryFn: () => fetchJson<AccountSettingsResponse>("/api/account/settings"),
   });

   const { data: playerOptions } = useQuery<PlayerOptions>({
      queryKey: ["player-options"],
      queryFn: () => fetchJson<PlayerOptions>("/api/settings/player/options"),
   });

   const { data: adminOperations } = useQuery<AdminOperationLogResponse>({
      queryKey: ["admin-operations"],
      queryFn: () => fetchJson<AdminOperationLogResponse>("/api/admin/operations"),
      enabled: isAdmin,
      refetchInterval: isAdmin ? 15000 : false,
   });

   useEffect(() => {
      if (!accountSettings) {
         return;
      }

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

      setNotifications(playerOptions.notifications);
      setDisplaySettings({
         darkMode: playerOptions.display.darkMode,
         compactView: playerOptions.display.compactView,
         showAnimations: playerOptions.display.showAnimations,
         showResourceRates: playerOptions.display.showResourceRates,
         language: playerOptions.display.language,
         timeFormat: playerOptions.display.timeFormat,
         numberFormat: playerOptions.display.numberFormat,
      });
      setSoundSettings(playerOptions.sound);
      setPrivacySettings(playerOptions.privacy);
   }, [playerOptions]);

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
      mutationFn: () => fetchJson<PlayerOptions>("/api/settings/player/options", {
         method: "PUT",
         body: JSON.stringify({
            notifications,
            display: displaySettings,
            sound: soundSettings,
            privacy: privacySettings,
         }),
      }),
      onSuccess: () => {
         toast({ title: "Options saved", description: "Settings menus and submenus updated." });
         queryClient.invalidateQueries({ queryKey: ["player-options"] });
      },
      onError: (error: Error) => {
         toast({ title: "Unable to save options", description: error.message, variant: "destructive" });
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
         toast({ title: "Universe reset queued", description: result.message, variant: "destructive" });
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
              <TabsTrigger value="notifications" className="font-orbitron"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
              <TabsTrigger value="display" className="font-orbitron"><Monitor className="w-4 h-4 mr-2" /> Display</TabsTrigger>
              <TabsTrigger value="sound" className="font-orbitron"><Volume2 className="w-4 h-4 mr-2" /> Sound</TabsTrigger>
              {isAdmin && <TabsTrigger value="game" className="font-orbitron text-red-600"><Zap className="w-4 h-4 mr-2" /> Game Rules</TabsTrigger>}
              {isAdmin && <TabsTrigger value="server" className="font-orbitron text-red-600"><Server className="w-4 h-4 mr-2" /> Server</TabsTrigger>}
              {isAdmin && <TabsTrigger value="cron" className="font-orbitron text-red-600"><Clock className="w-4 h-4 mr-2" /> Cron Jobs</TabsTrigger>}
           </TabsList>

           {/* ACCOUNT TAB */}
           <TabsContent value="account" className="mt-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200" data-testid="card-display-theme">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Palette className="w-5 h-5 text-purple-600" /> Theme & Appearance
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Moon className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Dark Mode</div>
                                <div className="text-xs text-slate-500">Use dark theme for reduced eye strain</div>
                             </div>
                          </div>
                          <Switch 
                             checked={displaySettings.darkMode}
                             onCheckedChange={(v) => setDisplaySettings({...displaySettings, darkMode: v})}
                          />
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
              </div>
           </TabsContent>

           {/* SOUND TAB */}
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
