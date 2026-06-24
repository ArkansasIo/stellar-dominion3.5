import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useGame } from "@/lib/gameContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  User, Shield, Trophy, BarChart3, Key, Link as LinkIcon, HardDrive, Clock, Star,
  Globe, Settings, LogOut, Download, Upload, Trash2, Eye, Lock, Mail, Smartphone,
  Save, Plus, Swords, Coins, FlaskConical, Building2, TrendingUp, Crown,
  Activity, CheckCircle2, AlertTriangle, Rocket, Users, Newspaper, FileText,
  HelpCircle, ScrollText, MessageSquare, ChevronRight,
} from "lucide-react";

interface UserData {
  id: string; username: string; email: string; displayName: string;
  createdAt: string; lastLoginAt: string; tier: "free" | "premium" | "vip";
  level: number; playTimeMinutes: number; empiresCreated: number; achievementsUnlocked: number;
}

interface SaveSlot {
  slot: number; name: string; exists: boolean; lastSaved?: string; empireName?: string;
  race?: string; level?: number; government?: string; systems?: number;
  fleetPower?: number; playstyle?: string; researchLevel?: number;
}

const TIER_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  premium: { label: "Premium", className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  vip: { label: "VIP", className: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
};

const LINK_ITEMS = [
  { label: "Empire Profile", href: "/empire-profile", icon: Crown, color: "text-amber-400" },
  { label: "Settings", href: "/settings", icon: Settings, color: "text-slate-400" },
  { label: "Alliance", href: "/alliance", icon: Users, color: "text-blue-400" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "text-yellow-400" },
  { label: "Season Hub", href: "/season", icon: Star, color: "text-purple-400" },
  { label: "Forums", href: "/forums", icon: MessageSquare, color: "text-green-400" },
  { label: "Patch Notes", href: "/patch-notes", icon: ScrollText, color: "text-cyan-400" },
  { label: "News Feed", href: "/news-feed", icon: Newspaper, color: "text-orange-400" },
];

const SUPPORT_ITEMS = [
  { label: "Contact Support", icon: Mail }, { label: "Report Bug", icon: AlertTriangle },
  { label: "FAQ", icon: HelpCircle }, { label: "Terms of Service", icon: FileText },
  { label: "Privacy Policy", icon: Shield },
];

const RECENT_ACTIVITY = [
  { action: "Login", detail: "Session started", time: "2m ago", icon: LogOut, color: "text-cyan-400" },
  { action: "Building Completed", detail: "Solar Plant Lv.13", time: "1h ago", icon: Building2, color: "text-emerald-400" },
  { action: "Battle Won", detail: "Defended Kepler-186f", time: "3h ago", icon: Swords, color: "text-red-400" },
  { action: "Research Completed", detail: "Warp Drive Mk.II", time: "5h ago", icon: FlaskConical, color: "text-purple-400" },
  { action: "Achievement Unlocked", detail: "First Blood", time: "1d ago", icon: Trophy, color: "text-amber-400" },
];

const ACHIEVEMENT_CATEGORIES = [
  { id: "combat", label: "Combat", icon: Swords, color: "text-red-400", count: 8, unlocked: 5 },
  { id: "economy", label: "Economy", icon: Coins, color: "text-amber-400", count: 6, unlocked: 4 },
  { id: "exploration", label: "Exploration", icon: Globe, color: "text-cyan-400", count: 7, unlocked: 3 },
  { id: "diplomacy", label: "Diplomacy", icon: Users, color: "text-blue-400", count: 5, unlocked: 2 },
  { id: "research", label: "Research", icon: FlaskConical, color: "text-purple-400", count: 6, unlocked: 3 },
];

const ACHIEVEMENTS = [
  { name: "First Blood", desc: "Win your first battle", progress: 1, total: 1, unlocked: true, date: "2026-03-10", category: "combat", rarity: "common", points: 10 },
  { name: "Fleet Commander", desc: "Build 100 ships", progress: 89, total: 100, unlocked: false, date: null, category: "combat", rarity: "uncommon", points: 25 },
  { name: "Trade Mogul", desc: "Complete 200 trades", progress: 234, total: 200, unlocked: true, date: "2026-05-20", category: "economy", rarity: "rare", points: 50 },
  { name: "Star Explorer", desc: "Discover 50 star systems", progress: 47, total: 50, unlocked: false, date: null, category: "exploration", rarity: "uncommon", points: 25 },
  { name: "Diplomat Supreme", desc: "Form 5 alliances", progress: 2, total: 5, unlocked: false, date: null, category: "diplomacy", rarity: "rare", points: 50 },
  { name: "Tech Pioneer", desc: "Research 100 technologies", progress: 156, total: 100, unlocked: true, date: "2026-06-01", category: "research", rarity: "epic", points: 100 },
  { name: "Empire Builder", desc: "Create 3 empires", progress: 3, total: 3, unlocked: true, date: "2026-04-15", category: "exploration", rarity: "common", points: 15 },
  { name: "War Hero", desc: "Win 50 battles", progress: 72, total: 50, unlocked: true, date: "2026-05-01", category: "combat", rarity: "epic", points: 100 },
];

function formatPlayTime(m: number): string {
  const h = Math.floor(m / 60);
  return h >= 100 ? `${Math.floor(h / 100)}d ${h % 100}h` : `${h}h ${m % 60}m`;
}

function formatTimeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";
}

function StatRow({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

export default function Account() {
  const { username, logout } = useGame();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileVisible, setProfileVisible] = useState(true);
  const [activityVisible, setActivityVisible] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: userData } = useQuery<UserData>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load user data");
      const d = await res.json();
      return {
        id: d.id || "user-001", username: d.username || d.firstName || username || "Commander",
        email: d.email || "commander@stellar-dominion.io",
        displayName: d.displayName || d.firstName || username || "Commander",
        createdAt: d.createdAt || "2026-01-15T00:00:00Z",
        lastLoginAt: d.lastLoginAt || new Date().toISOString(),
        tier: d.tier || "free", level: d.level || 24, playTimeMinutes: d.playTimeMinutes || 14400,
        empiresCreated: d.empiresCreated || 3, achievementsUnlocked: d.achievementsUnlocked || 12,
      };
    },
  });

  const { data: slotsData } = useQuery<{ slots: SaveSlot[] }>({
    queryKey: ["/api/save-slots"],
    queryFn: async () => {
      const res = await fetch("/api/save-slots", { credentials: "include" });
      if (!res.ok) return { slots: Array.from({ length: 5 }, (_, i) => ({ slot: i + 1, name: `Slot ${i + 1}`, exists: false })) };
      return res.json();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (p: { currentPassword: string; newPassword: string }) => {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error("Failed to change password");
      return res.json();
    },
    onSuccess: () => { toast({ title: "Password Changed", description: "Your password has been updated." }); setCurrentPassword(""); setNewPassword(""); },
    onError: (err: any) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Failed to delete account");
      return res.json();
    },
    onSuccess: () => { toast({ title: "Account Deleted", description: "Your account has been permanently deleted." }); logout(); },
    onError: (err: any) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const loadSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/load", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to load save");
      return res.json();
    },
    onSuccess: () => { toast({ title: "Save Loaded", description: "Empire data loaded successfully." }); },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slot: number) => {
      const res = await fetch("/api/save-slots/delete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ slot }),
      });
      if (!res.ok) throw new Error("Failed to delete save");
      return res.json();
    },
    onSuccess: () => { toast({ title: "Save Deleted", description: "Save slot cleared." }); },
  });

  const user = userData || {
    id: "user-001", username: username || "Commander", email: "commander@stellar-dominion.io",
    displayName: username || "Commander", createdAt: "2026-01-15T00:00:00Z",
    lastLoginAt: new Date().toISOString(), tier: "free" as const, level: 24,
    playTimeMinutes: 14400, empiresCreated: 3, achievementsUnlocked: 12,
  };

  const slots: SaveSlot[] = slotsData?.slots || Array.from({ length: 5 }, (_, i) => ({ slot: i + 1, name: `Slot ${i + 1}`, exists: false }));
  const tierInfo = TIER_BADGES[user.tier] || TIER_BADGES.free;
  const usedStorage = slots.filter(s => s.exists).length;
  const statsData = {
    empire: { systems: 47, fleetPower: 128500, research: 156, resources: 2450000 },
    combat: { fought: 89, won: 72, lost: 17, shipsDestroyed: 3420, shipsLost: 890, resourcesPlundered: 890000 },
    economy: { produced: 5670000, trades: 234, allianceContributions: 45 },
    progression: { xp: 124500, highestLevel: 24, buildings: 342, shipsBuilt: 189 },
  };
  const winRate = statsData.combat.fought > 0 ? Math.round((statsData.combat.won / statsData.combat.fought) * 100) : 0;
  const totalUnlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalPoints = ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.points, 0);
  const rarestAchievement = ACHIEVEMENTS.find(a => a.rarity === "epic" && a.unlocked);

  return (
    <GameLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              ACCOUNT
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account, saves, and preferences</p>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />Log Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900/80 border border-slate-700/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <User className="w-4 h-4 mr-1.5" />Overview
            </TabsTrigger>
            <TabsTrigger value="saves" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <HardDrive className="w-4 h-4 mr-1.5" />Save Slots
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
              <BarChart3 className="w-4 h-4 mr-1.5" />Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Trophy className="w-4 h-4 mr-1.5" />Achievements
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
              <Shield className="w-4 h-4 mr-1.5" />Security
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <LinkIcon className="w-4 h-4 mr-1.5" />Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-cyan-500/20">
                    {getInitials(user.displayName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
                      <Badge variant="outline" className={tierInfo.className}>{tierInfo.label}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">@{user.username}</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3" />Last login {formatTimeAgo(user.lastLoginAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Play Time", value: formatPlayTime(user.playTimeMinutes), icon: Clock, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/10" },
                { label: "Empires Created", value: String(user.empiresCreated), icon: Globe, color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/10" },
                { label: "Achievements", value: `${user.achievementsUnlocked}/32`, icon: Trophy, color: "text-emerald-400", bg: "from-emerald-500/20 to-green-500/10" },
                { label: "Current Level", value: `Lv.${user.level}`, icon: Star, color: "text-purple-400", bg: "from-purple-500/20 to-violet-500/10" },
              ].map((s) => (
                <Card key={s.label} className="bg-slate-900/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", s.bg)}>
                      <s.icon className={cn("w-5 h-5", s.color)} />
                    </div>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {RECENT_ACTIVITY.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800">
                          <item.icon className={cn("w-4 h-4", item.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium">{item.action}</div>
                          <div className="text-xs text-slate-500">{item.detail}</div>
                        </div>
                        <span className="text-xs text-slate-600 whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saves" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <Card key={slot.slot} className={cn("bg-slate-900/80 border transition-all", slot.exists ? "border-slate-700/50 hover:border-slate-600" : "border-slate-700/30 border-dashed")}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", slot.exists ? "bg-blue-500/20" : "bg-slate-800/50")}>
                          <Save className={cn("w-4 h-4", slot.exists ? "text-blue-400" : "text-slate-600")} />
                        </div>
                        <span className="text-xs text-slate-500 font-mono">SLOT {slot.slot}</span>
                      </div>
                      {slot.exists && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-red-400" onClick={() => deleteSlotMutation.mutate(slot.slot)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {slot.exists ? (
                      <>
                        <h4 className="font-semibold text-white text-sm mb-1 truncate">{slot.empireName || slot.name}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{slot.race || "Unknown"}</Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{slot.government || "Republic"}</Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{slot.playstyle || "Balanced"}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          {[{ v: slot.systems || 0, l: "Systems" }, { v: (slot.fleetPower || 0).toLocaleString(), l: "Fleet" }, { v: `Lv.${slot.level || 1}`, l: "Research" }].map((m) => (
                            <div key={m.l} className="p-1.5 rounded bg-slate-800/60">
                              <div className="text-white text-xs font-semibold">{m.v}</div>
                              <div className="text-slate-500 text-[10px]">{m.l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-3"><Clock className="w-3 h-3" /> Saved {slot.lastSaved || "Unknown"}</div>
                        <Button className="w-full h-8 text-xs bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700/50 font-orbitron tracking-wider" onClick={() => loadSlotMutation.mutate(slot.slot)} disabled={loadSlotMutation.isPending}>
                          <Rocket className="w-3 h-3 mr-1" />Load Empire
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-700/30">
                          <Plus className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-xs mb-3">Empty Slot</p>
                        <Link href="/season">
                          <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px]">
                            <Plus className="w-3 h-3 mr-1" /> Create Empire
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/save-slots">
                <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"><Plus className="w-4 h-4 mr-2" /> New Game</Button>
              </Link>
              <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"><Upload className="w-4 h-4 mr-2" /> Import Save</Button>
            </div>
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><HardDrive className="w-3 h-3" /> Storage Usage</span>
                  <span className="text-xs text-slate-400">{usedStorage}/5 slots</span>
                </div>
                <Progress value={(usedStorage / 5) * 100} className="h-2 bg-slate-800 [&>div]:bg-blue-500" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-emerald-300 flex items-center gap-2"><Globe className="w-4 h-4" /> Empire Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <StatRow label="Star Systems Controlled" value={statsData.empire.systems.toLocaleString()} icon={Globe} color="text-cyan-400" />
                  <StatRow label="Total Fleet Power" value={statsData.empire.fleetPower.toLocaleString()} icon={Swords} color="text-red-400" />
                  <StatRow label="Technologies Researched" value={statsData.empire.research.toLocaleString()} icon={FlaskConical} color="text-purple-400" />
                  <StatRow label="Total Resources Gathered" value={statsData.empire.resources.toLocaleString()} icon={Coins} color="text-amber-400" />
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-red-300 flex items-center gap-2"><Swords className="w-4 h-4" /> Combat Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <span className="text-sm text-slate-300">Battles Fought</span>
                    <div className="text-right"><span className="text-sm font-bold text-white">{statsData.combat.fought}</span><div className="text-[10px] text-slate-500">{statsData.combat.won}W / {statsData.combat.lost}L</div></div>
                  </div>
                  <StatRow label="Win Rate" value={`${winRate}%`} icon={TrendingUp} color="text-emerald-400" />
                  <StatRow label="Ships Destroyed" value={statsData.combat.shipsDestroyed.toLocaleString()} icon={Swords} color="text-red-400" />
                  <StatRow label="Ships Lost" value={statsData.combat.shipsLost.toLocaleString()} icon={AlertTriangle} color="text-amber-400" />
                  <StatRow label="Resources Plundered" value={statsData.combat.resourcesPlundered.toLocaleString()} icon={Coins} color="text-amber-400" />
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-amber-300 flex items-center gap-2"><Coins className="w-4 h-4" /> Economy Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <StatRow label="Total Resources Produced" value={statsData.economy.produced.toLocaleString()} icon={Coins} color="text-amber-400" />
                  <StatRow label="Trades Completed" value={statsData.economy.trades.toLocaleString()} icon={TrendingUp} color="text-emerald-400" />
                  <StatRow label="Alliance Contributions" value={statsData.economy.allianceContributions.toLocaleString()} icon={Users} color="text-blue-400" />
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Progression Statistics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <StatRow label="Total XP Gained" value={statsData.progression.xp.toLocaleString()} icon={Star} color="text-purple-400" />
                  <StatRow label="Highest Empire Level" value={`Lv.${statsData.progression.highestLevel}`} icon={Crown} color="text-amber-400" />
                  <StatRow label="Buildings Constructed" value={statsData.progression.buildings.toLocaleString()} icon={Building2} color="text-cyan-400" />
                  <StatRow label="Ships Built" value={statsData.progression.shipsBuilt.toLocaleString()} icon={Rocket} color="text-red-400" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <div className="grid grid-cols-5 gap-3">
              {ACHIEVEMENT_CATEGORIES.map((cat) => (
                <Card key={cat.id} className="bg-slate-900/80 border-slate-700/50">
                  <CardContent className="p-3 text-center">
                    <cat.icon className={cn("w-5 h-5 mx-auto mb-1", cat.color)} />
                    <div className="text-white text-sm font-semibold">{cat.unlocked}/{cat.count}</div>
                    <div className="text-[10px] text-slate-500">{cat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{totalUnlocked}</div>
                  <div className="text-xs text-slate-500">Unlocked</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{totalPoints}</div>
                  <div className="text-xs text-slate-500">Points</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardContent className="p-4 text-center">
                  <Crown className="w-6 h-6 text-amber-300 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white truncate">{rarestAchievement?.name || "None"}</div>
                  <div className="text-xs text-slate-500">Rarest</div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="combat" className="w-full">
              <TabsList className="bg-slate-900/80 border border-slate-700/50 p-1">
                {ACHIEVEMENT_CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs">
                    <cat.icon className="w-3 h-3 mr-1" />{cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {ACHIEVEMENT_CATEGORIES.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="space-y-3 mt-4">
                  {ACHIEVEMENTS.filter((a) => a.category === cat.id).map((ach) => {
                    const pct = Math.min((ach.progress / ach.total) * 100, 100);
                    return (
                      <Card key={ach.name} className={cn("bg-slate-900/80 border transition-all", ach.unlocked ? "border-amber-500/30" : "border-slate-700/50")}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xl", ach.unlocked ? "bg-amber-500/20" : "bg-slate-800/60")}>
                              {ach.unlocked ? "🏆" : "🔒"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-white text-sm">{ach.name}</h4>
                                <Badge variant="outline" className={cn("text-[10px]", ach.rarity === "epic" ? "border-purple-500/50 text-purple-300" : ach.rarity === "rare" ? "border-blue-500/50 text-blue-300" : ach.rarity === "uncommon" ? "border-emerald-500/50 text-emerald-300" : "border-slate-600 text-slate-400")}>{ach.rarity}</Badge>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">{ach.desc}</p>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500">{ach.progress}/{ach.total}</span>
                                <span className="text-slate-400">{ach.points} pts</span>
                              </div>
                              <Progress value={pct} className="h-1.5 bg-slate-800 [&>div]:bg-amber-500" />
                              {ach.unlocked && ach.date && (
                                <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Unlocked {ach.date}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-red-300 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">Current Password</Label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-600" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs">New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-600" placeholder="Enter new password" />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-500 text-white" disabled={!currentPassword || !newPassword || changePasswordMutation.isPending} onClick={() => changePasswordMutation.mutate({ currentPassword, newPassword })}>
                    <Key className="w-4 h-4 mr-2" />{changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-red-300 flex items-center gap-2"><Shield className="w-4 h-4" /> Two-Factor Authentication</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div><div className="text-sm text-white">Authenticator App</div><div className="text-xs text-slate-500">Use an authenticator app for 2FA</div></div>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-slate-700/50" />
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Active Sessions</h4>
                    <div className="space-y-2">
                      {[{ device: "Chrome · Windows", ip: "192.168.1.1", current: true, time: "Now" }, { device: "Firefox · macOS", ip: "10.0.0.42", current: false, time: "2h ago" }].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-800/30 text-xs">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", s.current ? "bg-emerald-500" : "bg-slate-600")} />
                            <span className="text-white">{s.device}</span>
                            <span className="text-slate-600">{s.ip}</span>
                          </div>
                          <span className="text-slate-500">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Login History</h4>
                    <div className="space-y-1">{["Today 14:32", "Yesterday 09:15", "Jun 20 18:42"].map((t, i) => <div key={i} className="text-xs text-slate-400 p-1">{t}</div>)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Data Management</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"><Download className="w-4 h-4 mr-2" /> Export Save Data</Button>
                  <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"><Upload className="w-4 h-4 mr-2" /> Import Save Data</Button>
                  <Separator className="bg-slate-700/50" />
                  {!showDeleteConfirm ? (
                    <Button variant="outline" className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Type "DELETE" to confirm account deletion</p>
                      <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className="bg-slate-800/50 border-red-500/30 text-white text-xs" placeholder='Type "DELETE"' />
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white text-xs" disabled={deleteConfirm !== "DELETE"} onClick={() => deleteAccountMutation.mutate(deleteConfirm)}>Confirm Delete</Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 text-xs" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirm(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2"><Eye className="w-4 h-4" /> Privacy Settings</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div><div className="text-sm text-white">Profile Visibility</div><div className="text-xs text-slate-500">Allow others to view your profile</div></div>
                    <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div><div className="text-sm text-white">Activity Visibility</div><div className="text-xs text-slate-500">Show your activity to others</div></div>
                    <Switch checked={activityVisible} onCheckedChange={setActivityVisible} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-6 mt-6">
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-blue-300 flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Quick Links</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {LINK_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Card className="bg-slate-800/50 border-slate-700/30 hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group">
                        <CardContent className="p-4 text-center">
                          <item.icon className={cn("w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform", item.color)} />
                          <div className="text-sm text-white font-medium">{item.label}</div>
                          <ChevronRight className="w-4 h-4 text-slate-600 mx-auto mt-1 group-hover:text-slate-400" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Support</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUPPORT_ITEMS.map((item) => (
                    <Button key={item.label} variant="outline" className="h-auto p-3 justify-start border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white">
                      <item.icon className="w-4 h-4 mr-2 text-slate-500" /><span className="text-xs">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
