import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Landmark, Coins, Package, TrendingUp, Shield } from "lucide-react";

type BankVaultStatusResponse = {
  success: boolean;
  vault: any;
  bank: any;
  insurancePolicies: any[];
  storageUpgrades: any[];
  totalValue: number;
  stats: any;
};

type CurrenciesResponse = { success: boolean; currencies: any[] };
type VaultResponse = { success: boolean; items: any[]; usedSlots: number; maxSlots: number };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function BankVault() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery<BankVaultStatusResponse>({
    queryKey: ["bank-vault-status"],
    queryFn: () => fetchJson("/api/bank-vault/status"),
  });

  const { data: currenciesData } = useQuery<CurrenciesResponse>({
    queryKey: ["bank-vault-currencies"],
    queryFn: () => fetchJson("/api/bank-vault/currencies"),
  });

  const { data: vaultData } = useQuery<VaultResponse>({
    queryKey: ["bank-vault-vault"],
    queryFn: () => fetchJson("/api/bank-vault/vault"),
  });

  const upgradeVaultMutation = useQuery({
    queryKey: ["bank-vault-upgrade-vault"],
    queryFn: () => fetchJson("/api/bank-vault/upgrade-vault", { method: "POST" }),
    enabled: false,
  });

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Landmark className="w-8 h-8 text-amber-400" /> Bank & Vault
          </h1>
          <p className="text-slate-400 mt-1">Manage currencies, store items, and secure your assets</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{status?.totalValue?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-400">Total Value</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{status?.vault?.usedSlots || 0}/{status?.vault?.maxSlots || 0}</p>
              <p className="text-xs text-slate-400">Vault Slots</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{status?.insurancePolicies?.length || 0}</p>
              <p className="text-xs text-slate-400">Insurance Policies</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{status?.bank?.totalInterestEarned?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-400">Interest Earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="currencies" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="currencies"><Coins className="w-4 h-4 mr-1" /> Currencies</TabsTrigger>
            <TabsTrigger value="vault"><Package className="w-4 h-4 mr-1" /> Vault</TabsTrigger>
            <TabsTrigger value="stats"><TrendingUp className="w-4 h-4 mr-1" /> Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="currencies" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currenciesData?.currencies?.map((c: any) => (
                <Card key={c.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">{c.name || c.id}</span>
                      <Badge variant="outline">{c.symbol}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{c.balance?.toLocaleString() || 0}</div>
                    <div className="text-xs text-slate-400">Max: {c.maxStorage?.toLocaleString() || "∞"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vault" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Vault Contents</span>
                  <Badge variant="outline">{status?.vault?.usedSlots || 0}/{status?.vault?.maxSlots || 0} slots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vaultData?.items?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vaultData.items.map((item: any, i: number) => (
                      <div key={item.instanceId || i} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="text-white font-bold">{item.name || item.itemId}</div>
                        <div className="text-xs text-slate-400">Qty: {item.quantity || 1}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500">Vault is empty</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader><CardTitle className="text-white">Bank Statistics</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400">Total Deposited</div>
                    <div className="text-lg font-bold text-green-400">{status?.bank?.totalDeposited?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400">Total Withdrawn</div>
                    <div className="text-lg font-bold text-red-400">{status?.bank?.totalWithdrawn?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400">Interest Earned</div>
                    <div className="text-lg font-bold text-amber-400">{status?.bank?.totalInterestEarned?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
