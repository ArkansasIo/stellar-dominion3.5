import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function apiRequest(method: string, url: string, data?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const storedUser = localStorage.getItem('stellar_username');
  const storedPass = localStorage.getItem('stellar_password');
  if (storedUser && storedPass) {
    headers['Authorization'] = `Basic ${btoa(`${storedUser}:${storedPass}`)}`;
  }
  const res = await fetch(url, { method, headers, body: data ? JSON.stringify(data) : undefined, credentials: 'include' });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res.json();
}

interface Provider {
  id: string; label: string; icon: string; color: string; description: string;
}

interface Connection {
  id: string; provider: string; label: string; status: string; lastUsedAt: string; createdAt: string;
}

function ProviderCard({ provider, onConnect }: { provider: Provider; onConnect: (id: string) => void }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onConnect(provider.id)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{provider.icon}</span>
          <div className="w-8 h-8 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: provider.color }} />
        </div>
        <CardTitle className="text-sm mt-2">{provider.label}</CardTitle>
        <CardDescription className="text-xs">{provider.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full text-xs">Connect</Button>
      </CardContent>
    </Card>
  );
}

export default function ConnectProvider() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [connectDialog, setConnectDialog] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState("");

  useEffect(() => {
    apiRequest("GET", "/api/connect/providers").then(d => d?.providers && setProviders(d.providers)).catch(() => {});
    apiRequest("GET", "/api/connect/connections").then(d => d?.connections && setConnections(d.connections)).catch(() => {});
  }, []);

  const handleConnect = async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    try {
      await apiRequest("POST", "/api/connect/connections", {
        provider: providerId,
        label: customLabel || provider?.label || providerId,
      });
      const d = await apiRequest("GET", "/api/connect/connections");
      if (d?.connections) setConnections(d.connections);
      setConnectDialog(null);
      setCustomLabel("");
      toast({ title: "Connected", description: `${provider?.label || providerId} linked successfully.` });
    } catch (e: any) {
      toast({ title: "Connection Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await apiRequest("DELETE", `/api/connect/connections/${id}`);
      setConnections(prev => prev.filter(c => c.id !== id));
      toast({ title: "Disconnected", description: "Connection removed." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-orbitron font-bold text-white">Connect Providers</h1>
          <p className="text-sm text-slate-400">Link external accounts and services to your empire</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="browse" className="text-slate-300 data-[state=active]:bg-slate-700">Browse</TabsTrigger>
            <TabsTrigger value="connected" className="text-slate-300 data-[state=active]:bg-slate-700">Connected ({connections.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {providers.map(provider => (
                <ProviderCard key={provider.id} provider={provider} onConnect={(id) => setConnectDialog(id)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connected" className="space-y-3">
            {connections.length === 0 ? (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-12 text-center text-slate-400">
                  No connections yet. Browse providers to connect.
                </CardContent>
              </Card>
            ) : (
              connections.map(conn => {
                const provider = providers.find(p => p.id === conn.provider);
                return (
                  <Card key={conn.id} className="bg-slate-800/30 border-slate-700">
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{provider?.icon || "🔌"}</span>
                        <div>
                          <div className="font-semibold text-white">{conn.label}</div>
                          <div className="text-xs text-slate-400">
                            Connected {new Date(conn.createdAt).toLocaleDateString()}
                            {conn.lastUsedAt && ` • Last used ${new Date(conn.lastUsedAt).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={conn.status === "active" ? "default" : "secondary"} className="text-xs">
                          {conn.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleDisconnect(conn.id)}>Disconnect</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!connectDialog} onOpenChange={(o) => { if (!o) setConnectDialog(null); }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Connect Provider</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <span className="text-4xl">{providers.find(p => p.id === connectDialog)?.icon}</span>
              <h3 className="text-lg font-semibold mt-2">{providers.find(p => p.id === connectDialog)?.label}</h3>
              <p className="text-sm text-slate-400">{providers.find(p => p.id === connectDialog)?.description}</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Connection Label</label>
              <Input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder={`My ${providers.find(p => p.id === connectDialog)?.label || ""}`}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <Button className="w-full" onClick={() => connectDialog && handleConnect(connectDialog)}>
              Confirm Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
