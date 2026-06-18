import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";

type StoreCategory = "boosters" | "cosmetics" | "resources" | "bundles";
type StoreCurrency = "silver" | "gold" | "platinum";

interface StorefrontItem {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  currency: StoreCurrency;
  price: number;
  grantItemId: string;
  grantQuantity: number;
  tags: string[];
}

interface StoreCatalogResponse {
  items: StorefrontItem[];
  categories: StoreCategory[];
  featured?: StorefrontItem[];
  byCategory?: Record<string, StorefrontItem[]>;
}

interface CurrencyBalance {
  silver: number;
  gold: number;
  platinum: number;
}

interface CheckoutPreviewResponse {
  item: StorefrontItem;
  quantity: number;
  totalCost: number;
  totalGrantQuantity: number;
  affordable: boolean;
  balance: CurrencyBalance;
}

const currencyColor: Record<StoreCurrency, string> = {
  silver: "text-slate-700",
  gold: "text-yellow-700",
  platinum: "text-indigo-700",
};

export default function Storefront() {
  const { toast } = useToast();
  const [category, setCategory] = useState<"all" | StoreCategory>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const getQuantityForItem = (itemId: string) => quantities[itemId] || 1;
  const setItemQuantity = (itemId: string, nextQuantity: number) => {
    const safeQuantity = Math.max(1, Math.min(99, nextQuantity));
    setQuantities((current) => ({ ...current, [itemId]: safeQuantity }));
  };

  const { data: catalog } = useQuery<StoreCatalogResponse>({
    queryKey: ["/api/storefront/catalog"],
    queryFn: async () => {
      const res = await fetch("/api/storefront/catalog", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load storefront catalog");
      return res.json();
    },
  });

  const { data: balance } = useQuery<CurrencyBalance>({
    queryKey: ["/api/storefront/balance"],
    queryFn: async () => {
      const res = await fetch("/api/storefront/balance", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load storefront balance");
      return res.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await apiRequest("POST", "/api/storefront/purchase", { itemId, quantity });
      return res.json();
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/storefront/balance"] });
      toast({ title: "Purchase successful", description: `Bought ${variables.quantity}x item(s).` });
    },
    onError: (error: any) => {
      toast({ title: "Purchase failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const visibleItems = useMemo(() => {
    const entries = catalog?.items || [];
    if (category === "all") return entries;
    return entries.filter((entry) => entry.category === category);
  }, [catalog?.items, category]);

  useEffect(() => {
    if (!selectedItemId && visibleItems.length > 0) {
      setSelectedItemId(visibleItems[0].id);
    }
  }, [selectedItemId, visibleItems]);

  const selectedQuantity = selectedItemId ? getQuantityForItem(selectedItemId) : 1;
  const totalVisibleItems = visibleItems.length;
  const visibleByCurrency = visibleItems.reduce(
    (acc, item) => {
      acc[item.currency] += 1;
      return acc;
    },
    { silver: 0, gold: 0, platinum: 0 } as Record<StoreCurrency, number>
  );

  const { data: checkoutPreview, isLoading: previewLoading } = useQuery<CheckoutPreviewResponse>({
    queryKey: ["/api/storefront/preview-checkout", selectedItemId, selectedQuantity],
    enabled: Boolean(selectedItemId),
    queryFn: async () => {
      const res = await fetch("/api/storefront/preview-checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selectedItemId, quantity: selectedQuantity }),
      });
      if (!res.ok) throw new Error("Failed to load checkout preview");
      return res.json();
    },
  });

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Storefront</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Purchase boosters, cosmetics, resources, and bundles for story and seasonal progression.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/story-mode">
              <Button variant="outline" size="sm">Open Story Mode</Button>
            </Link>
            <Link href="/season-pass">
              <Button variant="outline" size="sm">Open Season Pass</Button>
            </Link>
            <Link href="/battle-pass">
              <Button variant="outline" size="sm">Open Battle Pass</Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Wallet</CardTitle>
            <CardDescription>Current account balances</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <div className="text-xs uppercase text-slate-500">Silver</div>
              <div className="text-2xl font-orbitron text-slate-900">{(balance?.silver || 0).toLocaleString()}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="text-xs uppercase text-yellow-600">Gold</div>
              <div className="text-2xl font-orbitron text-yellow-900">{(balance?.gold || 0).toLocaleString()}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded p-3">
              <div className="text-xs uppercase text-indigo-600">Platinum</div>
              <div className="text-2xl font-orbitron text-indigo-900">{(balance?.platinum || 0).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Visible Items</div>
              <div className="text-2xl font-bold text-slate-900">{totalVisibleItems}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Silver Items</div>
              <div className="text-2xl font-bold text-slate-700">{visibleByCurrency.silver}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Gold Items</div>
              <div className="text-2xl font-bold text-yellow-700">{visibleByCurrency.gold}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="text-xs uppercase text-slate-500">Platinum Items</div>
              <div className="text-2xl font-bold text-indigo-700">{visibleByCurrency.platinum}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={category} onValueChange={(value) => setCategory(value as "all" | StoreCategory)}>
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="boosters">Boosters</TabsTrigger>
            <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Checkout Preview</CardTitle>
            <CardDescription>Review totals and affordability before confirming a purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            {previewLoading ? (
              <div className="text-sm text-slate-500">Loading checkout preview...</div>
            ) : checkoutPreview ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="text-xs uppercase text-slate-500">Item</div>
                  <div className="text-sm font-semibold text-slate-900">{checkoutPreview.item.name}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="text-xs uppercase text-slate-500">Quantity</div>
                  <div className="text-lg font-orbitron text-slate-900">{checkoutPreview.quantity}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="text-xs uppercase text-slate-500">Total Cost</div>
                  <div className={`text-lg font-orbitron ${currencyColor[checkoutPreview.item.currency]}`}>
                    {checkoutPreview.totalCost.toLocaleString()} {checkoutPreview.item.currency}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="text-xs uppercase text-slate-500">Total Grant</div>
                  <div className="text-lg font-orbitron text-slate-900">{checkoutPreview.totalGrantQuantity.toLocaleString()}</div>
                </div>
                <div className={`rounded p-3 border ${checkoutPreview.affordable ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                  <div className={`text-xs uppercase ${checkoutPreview.affordable ? "text-emerald-700" : "text-rose-700"}`}>Affordability</div>
                  <div className={`text-lg font-orbitron ${checkoutPreview.affordable ? "text-emerald-900" : "text-rose-900"}`}>
                    {checkoutPreview.affordable ? "Ready" : "Insufficient"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">Select an item to preview checkout.</div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => {
            const quantity = getQuantityForItem(item.id);
            const totalCost = item.price * quantity;
            const totalGrant = item.grantQuantity * quantity;
            const canAfford = (balance?.[item.currency] || 0) >= totalCost;
            return (
              <Card key={item.id} className={`bg-white ${selectedItemId === item.id ? "border-primary" : "border-slate-200"}`}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{item.name}</span>
                    <Badge variant="outline" className="capitalize">{item.category}</Badge>
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600">Grants: {totalGrant}x {item.grantItemId}</div>
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-slate-500">Quantity</div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setItemQuantity(item.id, quantity - 1)}
                        disabled={quantity <= 1 || purchaseMutation.isPending}
                      >
                        -
                      </Button>
                      <Select
                        value={String(quantity)}
                        onValueChange={(value) => setItemQuantity(item.id, Number(value))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 5, 10, 20, 50, 99].map((value) => (
                            <SelectItem key={`${item.id}-qty-${value}`} value={String(value)}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setItemQuantity(item.id, quantity + 1)}
                        disabled={quantity >= 99 || purchaseMutation.isPending}
                      >
                        +
                      </Button>
                      <div className="ml-auto flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setItemQuantity(item.id, 1)} disabled={purchaseMutation.isPending}>x1</Button>
                        <Button size="sm" variant="ghost" onClick={() => setItemQuantity(item.id, 5)} disabled={purchaseMutation.isPending}>x5</Button>
                        <Button size="sm" variant="ghost" onClick={() => setItemQuantity(item.id, 10)} disabled={purchaseMutation.isPending}>x10</Button>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-orbitron ${currencyColor[item.currency]}`}>
                    {totalCost.toLocaleString()} {item.currency}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={`${item.id}-${tag}`} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    disabled={!canAfford || purchaseMutation.isPending}
                    onClick={() => purchaseMutation.mutate({ itemId: item.id, quantity })}
                  >
                    {canAfford ? `Purchase x${quantity}` : "Insufficient Funds"}
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setSelectedItemId(item.id)}
                  >
                    Preview Checkout
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Store Strategy Guide</CardTitle>
            <CardDescription>Recommended spending cadence for efficient progression.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Early Game</div>
              <div>Prioritize silver-cost resource packs and short-duration boosters.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Mid Campaign</div>
              <div>Mix cosmetics with utility bundles that amplify mission throughput.</div>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">Season Push</div>
              <div>Reserve premium currencies for high-value bundles and pass accelerators.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
