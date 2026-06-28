import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag, TrendingUp, TrendingDown, BarChart3, Coins,
  ArrowRightLeft, Warehouse, Gem, Package, Zap, Globe,
  Users, Clock, ArrowUp, ArrowDown, Banknote, Database,
  Handshake, Activity, Tag, Search, Filter, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TradeOffer {
  id: string;
  offerType: "buy" | "sell";
  resource: string;
  amount: number;
  price: number;
  currency: string;
  sellerName: string;
  expiresAt: string;
  createdAt: string;
}

interface MarketPrice {
  resource: string;
  buyPrice: number;
  sellPrice: number;
  volume24h: number;
  priceChange24h: number;
}

const RESOURCES = [
  { id: "metal", name: "Metal", icon: Database, color: "text-gray-400" },
  { id: "crystal", name: "Crystal", icon: Gem, color: "text-blue-400" },
  { id: "deuterium", name: "Deuterium", icon: Zap, color: "text-cyan-400" },
  { id: "antimatter", name: "Antimatter", icon: AtomIcon, color: "text-purple-400" },
  { id: "quantum_crystals", name: "Quantum Crystals", icon: Gem, color: "text-pink-400" },
  { id: "exotic_gas", name: "Exotic Gas", icon: WindIcon, color: "text-green-400" },
];

function AtomIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/></svg>; }
function WindIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h8.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h13.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M7 16h8.5a2.5 2.5 0 1 1-2.5 2.5"/></svg>; }

export default function CommerceHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("market");
  const [sellResource, setSellResource] = useState("metal");
  const [sellAmount, setSellAmount] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1);
  const [buyResource, setBuyResource] = useState("crystal");
  const [buyAmount, setBuyAmount] = useState(1000);

  const { data: marketPrices } = useQuery<MarketPrice[]>({
    queryKey: ["/api/trading/prices"],
    queryFn: async () => {
      const res = await fetch("/api/trading/prices", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: activeTrades, refetch: refetchTrades } = useQuery<TradeOffer[]>({
    queryKey: ["/api/trading/active"],
    queryFn: async () => {
      const res = await fetch("/api/trading/active", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === "active",
  });

  const createTradeMutation = useMutation({
    mutationFn: async (data: { resource: string; amount: number; price: number; type: "buy" | "sell" }) => {
      const res = await fetch("/api/trading/request/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Order Placed", description: "Your trade order has been listed on the market." });
      refetchTrades();
    },
    onError: (err: Error) => {
      toast({ title: "Order Failed", description: err.message, variant: "destructive" });
    },
  });

  const mockPrices: MarketPrice[] = [
    { resource: "Metal", buyPrice: 0.8, sellPrice: 1.0, volume24h: 1250000, priceChange24h: 2.3 },
    { resource: "Crystal", buyPrice: 1.2, sellPrice: 1.5, volume24h: 890000, priceChange24h: -0.8 },
    { resource: "Deuterium", buyPrice: 2.0, sellPrice: 2.5, volume24h: 450000, priceChange24h: 5.1 },
    { resource: "Antimatter", buyPrice: 15.0, sellPrice: 20.0, volume24h: 50000, priceChange24h: 12.4 },
    { resource: "Quantum Crystals", buyPrice: 8.0, sellPrice: 12.0, volume24h: 25000, priceChange24h: -3.2 },
    { resource: "Exotic Gas", buyPrice: 5.0, sellPrice: 7.5, volume24h: 75000, priceChange24h: 8.7 },
  ];

  const prices = marketPrices && marketPrices.length > 0 ? marketPrices : mockPrices;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-500" />
            Commerce Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Trade resources, manage offers, and track galactic market prices
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="market">
              <BarChart3 className="w-4 h-4 mr-2" />
              Market Prices
            </TabsTrigger>
            <TabsTrigger value="sell">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sell Resources
            </TabsTrigger>
            <TabsTrigger value="buy">
              <TrendingDown className="w-4 h-4 mr-2" />
              Buy Resources
            </TabsTrigger>
            <TabsTrigger value="active">
              <Activity className="w-4 h-4 mr-2" />
              My Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Galactic Market Overview
                </CardTitle>
                <CardDescription>Real-time resource prices across the galaxy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prices.map((price) => (
                    <Card key={price.resource} className="bg-muted/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{price.resource}</CardTitle>
                          <Badge variant={price.priceChange24h >= 0 ? "secondary" : "destructive"} className="text-[10px]">
                            {price.priceChange24h >= 0 ? <ArrowUp className="w-3 h-3 mr-0.5 inline" /> : <ArrowDown className="w-3 h-3 mr-0.5 inline" />}
                            {Math.abs(price.priceChange24h)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Buy</span>
                            <span className="font-mono font-bold text-green-500">{price.buyPrice.toFixed(2)} c</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sell</span>
                            <span className="font-mono font-bold text-red-500">{price.sellPrice.toFixed(2)} c</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">24h Volume</span>
                            <span className="font-mono">{(price.volume24h / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sell" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Create Sell Order
                  </CardTitle>
                  <CardDescription>List resources for sale on the open market</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Resource</label>
                    <div className="flex flex-wrap gap-2">
                      {RESOURCES.map((res) => (
                        <Button
                          key={res.id}
                          variant={sellResource === res.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSellResource(res.id)}
                        >
                          <res.icon className={cn("w-4 h-4 mr-1", res.color)} />
                          {res.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount</label>
                    <Input
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price per Unit (credits)</label>
                    <Input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                      min={0.01}
                      step={0.01}
                    />
                  </div>
                  <div className="p-3 bg-muted rounded text-sm">
                    <div className="flex justify-between">
                      <span>Total Value</span>
                      <span className="font-bold font-mono">{(sellAmount * sellPrice).toLocaleString()} credits</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => createTradeMutation.mutate({ resource: sellResource, amount: sellAmount, price: sellPrice, type: "sell" })}
                    disabled={createTradeMutation.isPending}
                  >
                    List for Sale
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-blue-500" />
                    Your Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {RESOURCES.map((res) => (
                    <div key={res.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="flex items-center gap-1">
                        <res.icon className={cn("w-4 h-4", res.color)} />
                        {res.name}
                      </span>
                      <span className="font-mono">{(Math.random() * 100000).toFixed(0)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buy" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    Buy Resources
                  </CardTitle>
                  <CardDescription>Purchase resources from the galactic market</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Resource</label>
                    <div className="flex flex-wrap gap-2">
                      {RESOURCES.map((res) => (
                        <Button
                          key={res.id}
                          variant={buyResource === res.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBuyResource(res.id)}
                        >
                          <res.icon className={cn("w-4 h-4 mr-1", res.color)} />
                          {res.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount</label>
                    <Input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="p-3 bg-muted rounded text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Cost</span>
                      <span className="font-bold font-mono">{buyAmount} credits</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Available offers</span>
                      <span>{Math.floor(Math.random() * 20 + 1)} listings</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled>
                    Purchase (Coming Soon)
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-emerald-500" />
                    Best Offers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {RESOURCES.slice(0, 4).map((res) => (
                      <div key={res.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <res.icon className={cn("w-4 h-4", res.color)} />
                          <div>
                            <div className="text-xs font-medium">{res.name}</div>
                            <div className="text-[10px] text-muted-foreground">Best: {(Math.random() * 2 + 0.5).toFixed(2)} c/u</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{Math.floor(Math.random() * 10 + 1)} offers</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Your Active Orders
                </CardTitle>
                <CardDescription>Track your current buy and sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                {!activeTrades || activeTrades.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No active orders</p>
                    <p className="text-sm">Create a buy or sell order to get started trading</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={trade.offerType === "sell" ? "destructive" : "default"}>
                            {trade.offerType === "sell" ? "SELL" : "BUY"}
                          </Badge>
                          <div>
                            <div className="text-sm font-medium capitalize">{trade.resource}</div>
                            <div className="text-xs text-muted-foreground">
                              {trade.amount.toLocaleString()} units @ {trade.price} credits
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{new Date(trade.createdAt).toLocaleDateString()}</Badge>
                      </div>
                    ))}
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
