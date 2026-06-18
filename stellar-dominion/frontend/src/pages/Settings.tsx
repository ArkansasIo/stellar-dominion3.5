import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
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
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { config, updateConfig, cronJobs, toggleCronJob, runCronJob, isAdmin, isActualAdmin, adminRole, toggleAdmin, username, logout } = useGame();
  const [, setLocation] = useLocation();
  const [displayName, setDisplayName] = useState(username || "Commander");
  const [commanderTitle, setCommanderTitle] = useState("commander");
  const [bioMessage, setBioMessage] = useState("");
  
  const [notifications, setNotifications] = useState({
    attackAlerts: true,
    buildComplete: true,
    researchComplete: true,
    fleetArrival: true,
    messages: true,
    allianceActivity: false
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    compactView: false,
    showAnimations: true,
    showResourceRates: true,
    language: "en"
  });

  const [soundSettings, setSoundSettings] = useState({
    enabled: true,
    volume: 50,
    alertSounds: true,
    ambientSounds: false
  });

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
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                             <UserIcon className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                             <div className="font-orbitron font-bold text-lg text-slate-900">{username || "Commander"}</div>
                             <div className="text-sm text-slate-500">Active since {new Date().toLocaleDateString()}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => alert("Avatar customization coming soon!")}>Change Avatar</Button>
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
                       </div>
                       
                       <Button className="w-full" onClick={() => alert("Profile updated: " + displayName)}>
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
                                   <div className="text-xs text-slate-500">*****@email.com</div>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" onClick={() => alert("Email change feature coming soon!")}>Change</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-slate-400" />
                                <div>
                                   <div className="font-medium text-slate-900">Password</div>
                                   <div className="text-xs text-slate-500">Last changed 30 days ago</div>
                                </div>
                             </div>
                             <Button variant="ghost" size="sm" onClick={() => alert("Password change feature coming soon!")}>Change</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-slate-400" />
                                <div>
                                   <div className="font-medium text-slate-900">Two-Factor Authentication</div>
                                   <div className="text-xs text-red-500">Not enabled</div>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" onClick={() => alert("2FA setup coming soon!")}>Enable</Button>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                             <div>
                                <div className="font-medium text-slate-900">Hide Online Status</div>
                                <div className="text-xs text-slate-500">Appear offline to other players</div>
                             </div>
                             <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div>
                                <div className="font-medium text-slate-900">Block Messages from Strangers</div>
                                <div className="text-xs text-slate-500">Only receive messages from allies</div>
                             </div>
                             <Switch />
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="bg-white border-red-200" data-testid="card-danger-zone">
                       <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-600">
                             <AlertTriangle className="w-5 h-5" /> Danger Zone
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-3">
                          <Button variant="outline" className="w-full justify-start text-slate-600" onClick={() => alert("Account data export downloading...")}>
                             <Download className="w-4 h-4 mr-2" /> Export Account Data
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-orange-600 hover:bg-orange-50" onClick={logout}>
                             <LogOut className="w-4 h-4 mr-2" /> Logout from All Devices
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={() => confirm("Are you sure? This cannot be undone!") && alert("Account deletion scheduled...")}>
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
                          <Switch defaultChecked />
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Mail className="w-5 h-5 text-slate-400" />
                             <div>
                                <div className="font-medium text-slate-900">Email Notifications</div>
                                <div className="text-xs text-slate-500">Send important alerts via email</div>
                             </div>
                          </div>
                          <Switch />
                       </div>
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
                          <Select defaultValue="24h">
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
                          <Select defaultValue="comma">
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
                         
                         <Button variant="outline" className="w-full justify-start" onClick={() => alert("Backup snapshot created successfully!")}>
                            <Save className="w-4 h-4 mr-2" /> Create Backup Snapshot
                         </Button>
                         <Button variant="outline" className="w-full justify-start" onClick={() => confirm("This will erase all universe data! Continue?") && alert("Universe reset in progress...")}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset Universe (Wipe Data)
                         </Button>
                         <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => confirm("Restart server now?") && alert("Server restarting...")}>
                            <Power className="w-4 h-4 mr-2" /> Force Server Restart
                         </Button>
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
