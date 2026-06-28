import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, Users, Activity, Server, Database, Ban, Lock, Eye, Terminal, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function Admin() {
  const { config, updateConfig, resources, addEvent } = useGame();
  
  const [mockUsers, setMockUsers] = useState([
     { id: "1", name: "Commander", email: "player@example.com", status: "active", role: "admin", lastLogin: "Just now", ip: "192.168.1.1" },
     { id: "2", name: "DarkLord99", email: "evil@example.com", status: "active", role: "user", lastLogin: "2 hours ago", ip: "10.0.0.5" },
     { id: "3", name: "TraderJoe", email: "joe@example.com", status: "banned", role: "user", lastLogin: "5 days ago", ip: "172.16.0.2" },
     { id: "4", name: "NoobMaster", email: "new@example.com", status: "active", role: "user", lastLogin: "1 day ago", ip: "192.168.1.50" },
     { id: "5", name: "SpammerBot", email: "bot@spam.net", status: "muted", role: "user", lastLogin: "10 mins ago", ip: "45.33.22.11" },
  ]);

  const [consoleCommand, setConsoleCommand] = useState("");
  const [consoleLog, setConsoleLog] = useState<string[]>([
     "> System initialized...",
     "> Admin panel loaded.",
     "> Waiting for input..."
  ]);

  const handleBan = (id: string) => {
     setMockUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
  };

  const handleMute = (id: string) => {
     setMockUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "muted" ? "active" : "muted" } : u));
  };

  const executeCommand = () => {
     if (!consoleCommand) return;
     
     const cmd = consoleCommand.trim();
     setConsoleLog(prev => [...prev, `> ${cmd}`]);
     
     if (cmd === "help") {
        setConsoleLog(prev => [...prev, "Available commands: help, clear, status, give_res [amount], kick_all"]);
     } else if (cmd === "clear") {
        setConsoleLog([]);
     } else if (cmd === "status") {
        setConsoleLog(prev => [...prev, `Server Status: ONLINE | Load: 12% | Users: ${mockUsers.length}`]);
     } else if (cmd.startsWith("give_res")) {
        addEvent("Admin Action", "Resources generated via console.", "warning");
        setConsoleLog(prev => [...prev, "Resources added to current user."]);
     } else {
        setConsoleLog(prev => [...prev, `Unknown command: ${cmd}`]);
     }
     
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
                    <div className="text-3xl font-mono font-bold text-slate-900">1,248</div>
                 </div>
                 <Users className="w-8 h-8 text-blue-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Server Load</div>
                    <div className="text-3xl font-mono font-bold text-green-600">12%</div>
                 </div>
                 <Activity className="w-8 h-8 text-green-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">DB Size</div>
                    <div className="text-3xl font-mono font-bold text-purple-600">4.2 GB</div>
                 </div>
                 <Database className="w-8 h-8 text-purple-500 opacity-50" />
              </CardContent>
           </Card>
           <Card className="bg-white border-slate-200">
              <CardContent className="p-6 flex items-center justify-between">
                 <div>
                    <div className="text-sm font-bold text-slate-500 uppercase">Uptime</div>
                    <div className="text-3xl font-mono font-bold text-slate-900">14d 2h</div>
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
                       <Input placeholder="Search users..." className="max-w-sm bg-slate-50" />
                       <Button variant="outline" onClick={() => alert("Exporting user data to CSV...")}><Users className="w-4 h-4 mr-2" /> Export CSV</Button>
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
                          {mockUsers.map(user => (
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
                                <TableCell className="text-slate-500 text-sm">{user.lastLogin}</TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">{user.ip}</TableCell>
                                <TableCell className="text-right space-x-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => alert("Viewing user: " + user.name)}>
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
                       <Switch checked={config.maintenanceMode} onCheckedChange={(v) => updateConfig({ maintenanceMode: v })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Economy Scaling</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Resource Generation</label>
                                <Input type="number" className="w-20 h-8" value={config.resourceRate} onChange={(e) => updateConfig({ resourceRate: parseInt(e.target.value) })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Build Speed</label>
                                <Input type="number" className="w-20 h-8" value={config.gameSpeed} onChange={(e) => updateConfig({ gameSpeed: parseInt(e.target.value) })} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Combat Settings</h3>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Fleet Speed</label>
                                <Input type="number" className="w-20 h-8" value={config.fleetSpeed} onChange={(e) => updateConfig({ fleetSpeed: parseInt(e.target.value) })} />
                             </div>
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Force Peace Mode</label>
                                <Switch checked={config.peaceMode} onCheckedChange={(v) => updateConfig({ peaceMode: v })} />
                             </div>
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
                          {[
                             { time: "10:42:11", level: "INFO", source: "System", msg: "Daily cron job executed successfully." },
                             { time: "10:41:05", level: "WARN", source: "Auth", msg: "Failed login attempt from 192.168.1.55" },
                             { time: "10:35:22", level: "INFO", source: "Economy", msg: "Market rates updated." },
                             { time: "10:30:00", level: "ERROR", source: "Combat", msg: "Simulation timeout in sector 4:22." },
                             { time: "10:15:11", level: "INFO", source: "System", msg: "Backup snapshot created." },
                          ].map((log, i) => (
                             <TableRow key={i}>
                                <TableCell className="font-mono text-xs text-slate-500">{log.time}</TableCell>
                                <TableCell>
                                   <Badge variant="outline" className={
                                      log.level === "ERROR" ? "text-red-600 border-red-200" : 
                                      log.level === "WARN" ? "text-yellow-600 border-yellow-200" : 
                                      "text-blue-600 border-blue-200"
                                   }>{log.level}</Badge>
                                </TableCell>
                                <TableCell className="text-sm font-bold text-slate-700">{log.source}</TableCell>
                                <TableCell className="text-sm text-slate-600">{log.msg}</TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </TabsContent>

        </Tabs>
      </div>
    </GameLayout>
  );
}
