import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface VaultItem {
  id: string;
  planetId: string | null;
  vaultType: string;
  itemType: string;
  itemName: string;
  quantity: number;
  rarity: string;
  metadata: any;
  depositedAt: string;
}

interface VaultStats {
  totalItems: number;
  totalQuantity: number;
  byRarity: Record<string, number>;
  byType: Record<string, number>;
  uniqueItems: number;
}

const RARITY_COLORS: Record<string, string> = {
  common: "bg-slate-600/20 text-slate-300 border-slate-600/30",
  uncommon: "bg-green-600/20 text-green-300 border-green-600/30",
  rare: "bg-blue-600/20 text-blue-300 border-blue-600/30",
  epic: "bg-purple-600/20 text-purple-300 border-purple-600/30",
  legendary: "bg-amber-600/20 text-amber-300 border-amber-600/30",
  mythic: "bg-red-600/20 text-red-300 border-red-600/30",
};

const VAULT_ICONS: Record<string, string> = {
  resource: "💎",
  item: "📦",
  artifact: "🏺",
  currency: "💰",
};

export default function PlanetVault() {
  const { toast } = useToast();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [activeTab, setActiveTab] = useState("items");
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositForm, setDepositForm] = useState({ vaultType: "resource", itemType: "", itemName: "", quantity: 1, rarity: "common" });
  const [filterType, setFilterType] = useState<string>("");

  const fetchItems = async (vaultType?: string) => {
    try {
      const url = vaultType ? `/api/planet-vault/items?vaultType=${vaultType}` : "/api/planet-vault/items";
      const d = await apiRequest("GET", url);
      if (d?.items) setItems(d.items);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const d = await apiRequest("GET", "/api/planet-vault/stats");
      if (d?.stats) setStats(d.stats);
    } catch {}
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchItems(filterType || undefined);
  }, [filterType]);

  const handleDeposit = async () => {
    if (!depositForm.itemType || !depositForm.itemName) {
      toast({ title: "Missing Fields", description: "Item type and name required.", variant: "destructive" });
      return;
    }
    try {
      await apiRequest("POST", "/api/planet-vault/deposit", depositForm);
      toast({ title: "Deposited", description: `${depositForm.itemName} x${depositForm.quantity} added to vault.` });
      fetchItems(filterType || undefined);
      fetchStats();
      setDepositOpen(false);
      setDepositForm({ vaultType: "resource", itemType: "", itemName: "", quantity: 1, rarity: "common" });
    } catch (e: any) {
      toast({ title: "Deposit Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleWithdraw = async (itemId: string, quantity?: number) => {
    try {
      await apiRequest("POST", "/api/planet-vault/withdraw", { itemId, quantity });
      toast({ title: "Withdrawn", description: "Items removed from vault." });
      fetchItems(filterType || undefined);
      fetchStats();
    } catch (e: any) {
      toast({ title: "Withdraw Failed", description: e.message, variant: "destructive" });
    }
  };

  const vaultTypes = ["resource", "item", "artifact", "currency"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-orbitron font-bold text-white">Planet Vault</h1>
            <p className="text-sm text-slate-400">Planet-level storage for resources, items, artifacts, and currency</p>
          </div>
          <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500">Deposit Item</Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Deposit to Vault</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {vaultTypes.map(vt => (
                    <Button key={vt} variant={depositForm.vaultType === vt ? "default" : "outline"} size="sm"
                      className={depositForm.vaultType === vt ? "bg-indigo-600" : "border-slate-600 text-slate-300"}
                      onClick={() => setDepositForm(f => ({ ...f, vaultType: vt }))}>
                      {VAULT_ICONS[vt]} {vt}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Item Type</label>
                  <Input value={depositForm.itemType} onChange={e => setDepositForm(f => ({ ...f, itemType: e.target.value }))}
                    placeholder="e.g., metal, crystal, plasteel" className="bg-slate-800 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Item Name</label>
                  <Input value={depositForm.itemName} onChange={e => setDepositForm(f => ({ ...f, itemName: e.target.value }))}
                    placeholder="e.g., Refined Metal" className="bg-slate-800 border-slate-600 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Quantity</label>
                    <Input type="number" min={1} value={depositForm.quantity}
                      onChange={e => setDepositForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Rarity</label>
                    <select value={depositForm.rarity}
                      onChange={e => setDepositForm(f => ({ ...f, rarity: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white text-sm">
                      {Object.keys(RARITY_COLORS).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500" onClick={handleDeposit}>Deposit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats && (
            <>
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
                  <div className="text-xs text-slate-400">Unique Items</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalQuantity.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total Quantity</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.uniqueItems}</div>
                  <div className="text-xs text-slate-400">Unique Types</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="py-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {Object.entries(stats.byRarity).sort(([,a], [,b]) => b - a).map(([k]) => k).slice(0, 3).join(", ")}
                  </div>
                  <div className="text-xs text-slate-400">Top Rarities</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setFilterType(v === "items" ? "" : v); }} className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="items" className="text-slate-300 data-[state=active]:bg-slate-700">All Items</TabsTrigger>
            {vaultTypes.map(vt => (
              <TabsTrigger key={vt} value={vt} className="text-slate-300 data-[state=active]:bg-slate-700">
                {VAULT_ICONS[vt]} {vt.charAt(0).toUpperCase() + vt.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {["items", ...vaultTypes].map(tab => (
            <TabsContent key={tab} value={tab}>
              <ScrollArea className="h-[500px]">
                {items.length === 0 ? (
                  <Card className="bg-slate-800/30 border-slate-700">
                    <CardContent className="py-12 text-center text-slate-400">Vault is empty.</CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(item => (
                      <Card key={item.id} className="bg-slate-800/30 border-slate-700 hover:border-slate-600 transition-colors">
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{VAULT_ICONS[item.vaultType] || "📦"}</span>
                              <div>
                                <div className="font-semibold text-white text-sm">{item.itemName}</div>
                                <div className="text-xs text-slate-400">{item.itemType}</div>
                              </div>
                            </div>
                            <Badge className={`text-xs ${RARITY_COLORS[item.rarity] || RARITY_COLORS.common}`}>
                              x{item.quantity}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 text-xs">
                            <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                              {item.rarity}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-white"
                                onClick={() => handleWithdraw(item.id, 1)}>Take 1</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-red-400 hover:text-red-300"
                                onClick={() => handleWithdraw(item.id)}>All</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
