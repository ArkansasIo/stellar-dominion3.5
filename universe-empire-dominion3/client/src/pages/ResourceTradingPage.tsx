import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, TrendingUp, Clock, X } from "lucide-react";

type MarketResponse = { market: Record<string, any> };
type MyOrdersResponse = { orders: any[]; count: number };
type OpenOrdersResponse = { orders: any[]; count: number };
type HistoryResponse = { history: any[]; count: number };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function ResourceTradingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: marketData } = useQuery<MarketResponse>({
    queryKey: ["rt-market"],
    queryFn: () => fetchJson("/api/resource-trading/market"),
  });

  const { data: myOrdersData } = useQuery<MyOrdersResponse>({
    queryKey: ["rt-my-orders"],
    queryFn: () => fetchJson("/api/resource-trading/my-orders"),
  });

  const { data: openOrdersData } = useQuery<OpenOrdersResponse>({
    queryKey: ["rt-open-orders"],
    queryFn: () => fetchJson("/api/resource-trading/open-orders"),
  });

  const { data: historyData } = useQuery<HistoryResponse>({
    queryKey: ["rt-history"],
    queryFn: () => fetchJson("/api/resource-trading/history"),
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => fetchJson("/api/resource-trading/cancel-order", { method: "POST", body: JSON.stringify({ orderId }) }),
    onSuccess: () => { toast({ title: "Order cancelled" }); queryClient.invalidateQueries({ queryKey: ["rt-my-orders"] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-emerald-400" /> Resource Trading
          </h1>
          <p className="text-slate-400 mt-1">Trade metal, crystal, and deuterium on the open market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData?.market && Object.entries(marketData.market).map(([resource, data]: [string, any]) => (
            <Card key={resource} className="bg-slate-900/80 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white capitalize flex items-center justify-between">
                  <span>{resource}</span>
                  <Badge variant="outline">{data.volume24h || 0} vol</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-800 rounded">
                    <div className="text-slate-400">Last Price</div>
                    <div className="text-white font-bold">{data.lastPrice?.toFixed(1) || "—"}</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded">
                    <div className="text-slate-400">Spread</div>
                    <div className="text-white font-bold">{data.spreadPercentage || "—"}%</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded">
                    <div className="text-slate-400">Highest Bid</div>
                    <div className="text-green-400 font-bold">{data.highestBid?.toFixed(1) || "—"}</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded">
                    <div className="text-slate-400">Lowest Ask</div>
                    <div className="text-red-400 font-bold">{data.lowestAsk === Infinity ? "—" : data.lowestAsk?.toFixed(1) || "—"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="my-orders" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="my-orders">My Orders ({myOrdersData?.count || 0})</TabsTrigger>
            <TabsTrigger value="open-orders">Open Orders ({openOrdersData?.count || 0})</TabsTrigger>
            <TabsTrigger value="history">History ({historyData?.count || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-orders" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardContent className="p-4">
                {myOrdersData?.orders?.length ? (
                  <div className="space-y-2">
                    {myOrdersData.orders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-3">
                          <Badge variant={o.type === "buy" ? "default" : "secondary"}>{o.type}</Badge>
                          <span className="text-white text-sm">{o.quantity} {o.resource}</span>
                          <span className="text-xs text-slate-400">@ {o.pricePerUnit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={o.status === "open" ? "outline" : o.status === "filled" ? "default" : "secondary"}>{o.status}</Badge>
                          {o.status === "open" && (
                            <Button size="sm" variant="ghost" onClick={() => cancelMutation.mutate(o.id)}>
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500">No orders</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open-orders" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardContent className="p-4">
                {openOrdersData?.orders?.length ? (
                  <div className="space-y-2">
                    {openOrdersData.orders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-3">
                          <Badge variant={o.type === "buy" ? "default" : "secondary"}>{o.type}</Badge>
                          <span className="text-white text-sm">{o.quantity} {o.resource}</span>
                          <span className="text-xs text-slate-400">@ {o.pricePerUnit}</span>
                        </div>
                        <span className="text-xs text-slate-500">{o.userId?.slice(0, 8)}...</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500">No open orders</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardContent className="p-4">
                {historyData?.history?.length ? (
                  <div className="space-y-2">
                    {historyData.history.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">{o.type}</Badge>
                          <span className="text-white text-sm">{o.quantity} {o.resource}</span>
                          <span className="text-xs text-slate-400">@ {o.pricePerUnit}</span>
                        </div>
                        <Badge variant="outline">{o.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500">No trade history</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
