import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MARKET_ITEMS, VENDORS, MarketItem, Vendor } from "@/lib/marketData";
import { 
  ShoppingBag, AlertTriangle, Zap, User, Shield, Box, Gem, Database, 
  ArrowRight, ArrowLeft, RefreshCw, TrendingUp, TrendingDown, History,
  ArrowUpDown, Clock, Coins, BarChart3, Gavel, Search, Plus, Timer, Tag,
  Package, Crown, Sparkles, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type MarketTab = "market" | "auction" | "exchange" | "history" | "prices";

const ItemCard = ({ 
  item, 
  mode, 
  inventoryCount, 
  onBuy, 
  onSell, 
  canAfford 
}: { 
  item: MarketItem, 
  mode: "buy" | "sell", 
  inventoryCount: number, 
  onBuy: () => void, 
  onSell: () => void,
  canAfford: boolean
}) => {
  const Icon = item.icon;
  const isContraband = item.rarity === "contraband";
  const isLegendary = item.rarity === "legendary";

  const priceMult = mode === "buy" ? 1 : 0.5;
  const costMetal = Math.floor(item.basePrice.metal * priceMult);
  const costCrystal = Math.floor(item.basePrice.crystal * priceMult);
  const costDeut = Math.floor(item.basePrice.deuterium * priceMult);

  return (
    <Card className={cn(
      "group overflow-hidden transition-all hover:shadow-md border-slate-200",
      isContraband ? "bg-slate-900 border-purple-900/50 text-slate-100" : "bg-white",
      isLegendary ? "border-amber-400/50 shadow-amber-100" : ""
    )} data-testid={`card-item-${item.id}`}>
      <div className="h-24 relative border-b border-border/10 bg-slate-50/50 flex items-center justify-center">
         <Icon className={cn("w-12 h-12 transition-transform group-hover:scale-110", isContraband ? "text-purple-400" : "text-slate-400")} />
         <div className="absolute top-2 right-2">
            {isContraband && <Badge variant="destructive" className="bg-purple-600 hover:bg-purple-700">ILLEGAL</Badge>}
            {!isContraband && <Badge variant="outline" className="bg-white/80">{item.type}</Badge>}
         </div>
         {inventoryCount > 0 && (
            <div className="absolute bottom-2 right-2 text-xs font-mono bg-slate-800 text-white px-2 py-1 rounded">
               Owned: {inventoryCount}
            </div>
         )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className={cn("text-base font-orbitron truncate", isContraband ? "text-purple-300" : "text-slate-900")}>
           {item.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2 text-sm h-20">
         <p className={cn("text-xs line-clamp-3", isContraband ? "text-slate-400" : "text-muted-foreground")}>
            {item.description}
         </p>
      </CardContent>

      <div className="px-6 pb-2 space-y-1">
         {costMetal > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-slate-400" : "text-slate-500"}>Metal</span>
               <span className={isContraband ? "text-slate-300" : "text-slate-700"}>{costMetal.toLocaleString()}</span>
            </div>
         )}
         {costCrystal > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-purple-400/70" : "text-blue-500/70"}>Crystal</span>
               <span className={isContraband ? "text-purple-300" : "text-blue-700"}>{costCrystal.toLocaleString()}</span>
            </div>
         )}
         {costDeut > 0 && (
            <div className="flex justify-between text-xs">
               <span className={isContraband ? "text-green-400/70" : "text-green-500/70"}>Deuterium</span>
               <span className={isContraband ? "text-green-300" : "text-green-700"}>{costDeut.toLocaleString()}</span>
            </div>
         )}
      </div>

      <CardFooter className="pt-2">
         {mode === "buy" ? (
            <Button 
               className={cn("w-full h-8 text-xs font-orbitron", isContraband ? "bg-purple-700 hover:bg-purple-600" : "bg-primary hover:bg-primary/90")}
               disabled={!canAfford}
               onClick={onBuy}
               data-testid={`button-buy-${item.id}`}
            >
               {canAfford ? "PURCHASE" : "INSUFFICIENT FUNDS"}
            </Button>
         ) : (
            <Button 
               variant="outline"
               className={cn("w-full h-8 text-xs font-orbitron", isContraband ? "border-purple-700 text-purple-400 hover:bg-purple-900/50" : "")}
               disabled={inventoryCount <= 0}
               onClick={onSell}
               data-testid={`button-sell-${item.id}`}
            >
               SELL ITEM
            </Button>
         )}
      </CardFooter>
    </Card>
  );
};

// Auction House types
interface AuctionListing {
  id: string;
  sellerId: string;
  sellerName: string;
  itemType: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  itemRarity: string;
  itemData?: any;
  quantity: number;
  startingPrice: number;
  buyoutPrice?: number;
  currentBid: number;
  bidIncrement: number;
  currentBidderId?: string;
  currentBidderName?: string;
  bidCount: number;
  duration: number;
  expiresAt: string;
  status: string;
  createdAt: string;
}

const RARITY_COLORS: Record<string, string> = {
  common: "border-slate-300 bg-slate-50",
  uncommon: "border-green-400 bg-green-50",
  rare: "border-blue-400 bg-blue-50",
  epic: "border-purple-400 bg-purple-50",
  legendary: "border-amber-400 bg-amber-50"
};

const RARITY_BADGE_COLORS: Record<string, string> = {
  common: "bg-slate-100 text-slate-700",
  uncommon: "bg-green-100 text-green-700",
  rare: "bg-blue-100 text-blue-700",
  epic: "bg-purple-100 text-purple-700",
  legendary: "bg-amber-100 text-amber-700"
};

const formatTimeRemaining = (expiresAt: string) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
};

const AuctionCard = ({ 
  auction, 
  onBid, 
  onBuyout,
  isOwn 
}: { 
  auction: AuctionListing;
  onBid: (id: string, amount: number) => void;
  onBuyout: (id: string) => void;
  isOwn: boolean;
}) => {
  const [bidAmount, setBidAmount] = useState(
    (auction.currentBid || auction.startingPrice) + auction.bidIncrement
  );
  const currentPrice = auction.currentBid || auction.startingPrice;
  const timeLeft = formatTimeRemaining(auction.expiresAt);
  const isExpired = timeLeft === "Expired";

  return (
    <Card className={cn(
      "group overflow-hidden transition-all hover:shadow-lg border-2",
      RARITY_COLORS[auction.itemRarity] || RARITY_COLORS.common
    )} data-testid={`auction-card-${auction.id}`}>
      <div className="h-20 relative border-b border-border/10 bg-white/50 flex items-center justify-center">
        <Package className="w-10 h-10 text-slate-400" />
        <div className="absolute top-2 right-2">
          <Badge className={cn("text-[10px]", RARITY_BADGE_COLORS[auction.itemRarity])}>
            {auction.itemRarity.toUpperCase()}
          </Badge>
        </div>
        {auction.quantity > 1 && (
          <div className="absolute bottom-2 right-2 text-xs font-mono bg-slate-800 text-white px-2 py-0.5 rounded">
            x{auction.quantity}
          </div>
        )}
      </div>

      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-sm font-orbitron truncate flex items-center gap-2">
          {auction.itemName}
          {auction.itemRarity === "legendary" && <Crown className="w-3 h-3 text-amber-500" />}
        </CardTitle>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="uppercase tracking-wide">{auction.itemType}</span>
          <span>•</span>
          <span>by {auction.sellerName}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2 text-xs">
        {auction.itemDescription && (
          <p className="text-slate-500 line-clamp-2 mb-2">{auction.itemDescription}</p>
        )}
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Current Bid</span>
            <span className="font-mono font-bold text-slate-900">{currentPrice.toLocaleString()} <Box className="w-3 h-3 inline text-slate-400" /></span>
          </div>
          {auction.buyoutPrice && (
            <div className="flex justify-between">
              <span className="text-slate-500">Buyout</span>
              <span className="font-mono text-amber-600">{auction.buyoutPrice.toLocaleString()} <Box className="w-3 h-3 inline text-amber-400" /></span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1"><Timer className="w-3 h-3" /> Time Left</span>
            <span className={cn("font-mono", isExpired ? "text-red-500" : "text-slate-700")}>{timeLeft}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Bids</span>
            <span className="font-mono text-slate-700">{auction.bidCount}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 flex-col gap-2">
        {!isOwn && !isExpired && (
          <>
            <div className="flex gap-2 w-full">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="h-8 text-xs font-mono flex-1"
                min={currentPrice + auction.bidIncrement}
                data-testid={`input-bid-${auction.id}`}
              />
              <Button
                size="sm"
                className="h-8 text-xs font-orbitron"
                onClick={() => onBid(auction.id, bidAmount)}
                data-testid={`button-bid-${auction.id}`}
              >
                <Gavel className="w-3 h-3 mr-1" /> BID
              </Button>
            </div>
            {auction.buyoutPrice && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs font-orbitron border-amber-400 text-amber-700 hover:bg-amber-50"
                onClick={() => onBuyout(auction.id)}
                data-testid={`button-buyout-${auction.id}`}
              >
                <Sparkles className="w-3 h-3 mr-1" /> BUYOUT {auction.buyoutPrice.toLocaleString()}
              </Button>
            )}
          </>
        )}
        {isOwn && (
          <Badge variant="secondary" className="w-full justify-center py-1">Your Listing</Badge>
        )}
        {isExpired && !isOwn && (
          <Badge variant="destructive" className="w-full justify-center py-1">Auction Ended</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

const AuctionHouseContent = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAuction, setNewAuction] = useState({
    itemType: "equipment",
    itemId: "",
    itemName: "",
    itemDescription: "",
    itemRarity: "common",
    quantity: 1,
    startingPrice: 100,
    buyoutPrice: 0,
    bidIncrement: 10,
    duration: 24
  });

  const { data: auctions = [], isLoading } = useQuery({
    queryKey: ['/api/auctions', itemTypeFilter, searchTerm, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (itemTypeFilter !== "all") params.append("itemType", itemTypeFilter);
      if (searchTerm) params.append("search", searchTerm);
      if (sortBy) params.append("sortBy", sortBy);
      const res = await fetch(`/api/auctions?${params}`, { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ['/api/auctions/user/listings'],
    queryFn: async () => {
      const res = await fetch('/api/auctions/user/listings', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: myBids = [] } = useQuery({
    queryKey: ['/api/auctions/user/bids'],
    queryFn: async () => {
      const res = await fetch('/api/auctions/user/bids', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newAuction) => {
      const res = await fetch('/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create auction');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auctions/user/listings'] });
      setCreateDialogOpen(false);
      setNewAuction({
        itemType: "equipment",
        itemId: "",
        itemName: "",
        itemDescription: "",
        itemRarity: "common",
        quantity: 1,
        startingPrice: 100,
        buyoutPrice: 0,
        bidIncrement: 10,
        duration: 24
      });
    }
  });

  const bidMutation = useMutation({
    mutationFn: async ({ auctionId, bidAmount }: { auctionId: string; bidAmount: number }) => {
      const res = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bidAmount })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auctions/user/bids'] });
    }
  });

  const buyoutMutation = useMutation({
    mutationFn: async (auctionId: string) => {
      const res = await fetch(`/api/auctions/${auctionId}/buyout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
    }
  });

  const myListingIds = myListings.map((a: AuctionListing) => a.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-auction-search"
            />
          </div>
          <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
            <SelectTrigger className="w-40" data-testid="select-item-type">
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="material">Materials</SelectItem>
              <SelectItem value="resource">Resources</SelectItem>
              <SelectItem value="blueprint">Blueprints</SelectItem>
              <SelectItem value="artifact">Artifacts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40" data-testid="select-sort-by">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-orbitron" data-testid="button-create-auction">
              <Plus className="w-4 h-4 mr-2" /> Create Auction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-orbitron">Create New Auction</DialogTitle>
              <DialogDescription>
                List an item for other players to bid on.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Type</Label>
                  <Select value={newAuction.itemType} onValueChange={(v) => setNewAuction({...newAuction, itemType: v})}>
                    <SelectTrigger data-testid="select-new-item-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="blueprint">Blueprint</SelectItem>
                      <SelectItem value="artifact">Artifact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rarity</Label>
                  <Select value={newAuction.itemRarity} onValueChange={(v) => setNewAuction({...newAuction, itemRarity: v})}>
                    <SelectTrigger data-testid="select-new-rarity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  value={newAuction.itemName}
                  onChange={(e) => setNewAuction({...newAuction, itemName: e.target.value, itemId: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                  placeholder="e.g. Ancient Plasma Sword"
                  data-testid="input-new-item-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newAuction.itemDescription}
                  onChange={(e) => setNewAuction({...newAuction, itemDescription: e.target.value})}
                  placeholder="Brief description of the item"
                  data-testid="input-new-description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Starting Price</Label>
                  <Input
                    type="number"
                    value={newAuction.startingPrice}
                    onChange={(e) => setNewAuction({...newAuction, startingPrice: Number(e.target.value)})}
                    min={1}
                    data-testid="input-new-starting-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyout Price</Label>
                  <Input
                    type="number"
                    value={newAuction.buyoutPrice}
                    onChange={(e) => setNewAuction({...newAuction, buyoutPrice: Number(e.target.value)})}
                    min={0}
                    placeholder="0 = no buyout"
                    data-testid="input-new-buyout"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (hrs)</Label>
                  <Select value={String(newAuction.duration)} onValueChange={(v) => setNewAuction({...newAuction, duration: Number(v)})}>
                    <SelectTrigger data-testid="select-new-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(newAuction)}
                disabled={!newAuction.itemName || newAuction.startingPrice <= 0}
                data-testid="button-confirm-create"
              >
                Create Auction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase">Active Auctions</div>
                <div className="text-xl font-orbitron font-bold text-blue-900">{auctions.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-green-600 uppercase">My Listings</div>
                <div className="text-xl font-orbitron font-bold text-green-900">{myListings.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-purple-600 uppercase">My Active Bids</div>
                <div className="text-xl font-orbitron font-bold text-purple-900">{myBids.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Timer className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-amber-600 uppercase">Ending Soon</div>
                <div className="text-xl font-orbitron font-bold text-amber-900">
                  {auctions.filter((a: AuctionListing) => {
                    const hoursLeft = (new Date(a.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
                    return hoursLeft > 0 && hoursLeft < 6;
                  }).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Loading auctions...</p>
        </div>
      ) : auctions.length === 0 ? (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-12 text-center text-slate-400">
            <Gavel className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No auctions found</p>
            <p className="text-sm">Be the first to create an auction!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {auctions.map((auction: AuctionListing) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              isOwn={myListingIds.includes(auction.id)}
              onBid={(id, amount) => bidMutation.mutate({ auctionId: id, bidAmount: amount })}
              onBuyout={(id) => buyoutMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VendorProfile = ({ vendor, active, onClick }: { vendor: Vendor, active: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border-2",
      active 
        ? "bg-primary/5 border-primary" 
        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200",
      vendor.type === "black_market" && active ? "bg-slate-900 border-purple-500 text-white" : "",
      vendor.type === "black_market" && !active ? "bg-slate-900/90 border-transparent hover:border-purple-500/50 text-slate-300" : ""
    )}
    data-testid={`vendor-${vendor.id}`}
  >
     <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white", vendor.avatarColor)}>
        {vendor.type === "official" && <User className="w-6 h-6" />}
        {vendor.type === "scientist" && <Zap className="w-6 h-6" />}
        {vendor.type === "black_market" && <AlertTriangle className="w-6 h-6" />}
     </div>
     <div className="flex-1">
        <h4 className="font-orbitron font-bold text-sm">{vendor.name}</h4>
        <p className="text-xs opacity-70 font-rajdhani uppercase tracking-wider">{vendor.title}</p>
     </div>
     {active && <ArrowRight className="w-4 h-4 opacity-50" />}
  </div>
);

const mockTradeHistory = [
  { id: 1, type: "buy", item: "Alloy Plates", amount: 10, cost: { metal: 5000 }, date: "2 hours ago" },
  { id: 2, type: "sell", item: "Crystal Shards", amount: 50, cost: { crystal: 2500 }, date: "5 hours ago" },
  { id: 3, type: "buy", item: "Fusion Cells", amount: 5, cost: { deuterium: 1000 }, date: "1 day ago" }
];

const mockPriceChanges = [
  { item: "Alloy Plates", change: 5.2, direction: "up" },
  { item: "Crystal Shards", change: -2.1, direction: "down" },
  { item: "Fusion Cells", change: 0, direction: "stable" },
  { item: "Neural Matrix", change: 12.5, direction: "up" }
];

export default function Market() {
  const { resources, inventory, buyItem, sellItem } = useGame();
  const [activeTab, setActiveTab] = useState<MarketTab>("market");
  const [selectedVendorId, setSelectedVendorId] = useState(VENDORS[0].id);
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [exchangeAmount, setExchangeAmount] = useState("1000");
  const [exchangeFrom, setExchangeFrom] = useState("metal");
  const [exchangeTo, setExchangeTo] = useState("crystal");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "market" || tabParam === "auction" || tabParam === "exchange" || tabParam === "history" || tabParam === "prices") {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);

    const nextUrl = `/market?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [activeTab]);

  const selectedVendor = VENDORS.find(v => v.id === selectedVendorId) || VENDORS[0];
  
  const displayItems = mode === "buy" 
    ? MARKET_ITEMS.filter(item => selectedVendor.inventory.includes(item.id))
    : MARKET_ITEMS.filter(item => (inventory[item.id] || 0) > 0);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galactic Trade Network</h2>
             <p className="text-muted-foreground font-rajdhani text-lg">Acquire construction materials, rare parts, and exotic commodities.</p>
           </div>
           <div className="flex gap-2 bg-white p-1 rounded border border-slate-200">
              <Button 
                size="sm" 
                variant={mode === "buy" ? "default" : "ghost"} 
                onClick={() => setMode("buy")}
                className="w-32 font-orbitron"
                data-testid="button-mode-buy"
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> BUY
              </Button>
              <Button 
                size="sm" 
                variant={mode === "sell" ? "default" : "ghost"} 
                onClick={() => setMode("sell")}
                className="w-32 font-orbitron"
                data-testid="button-mode-sell"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> SELL
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" data-testid="card-stats-metal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
                  <Box className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-600 uppercase">Metal</div>
                  <div className="text-xl font-orbitron font-bold text-slate-900">{Math.floor(resources.metal).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" data-testid="card-stats-crystal">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Crystal</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">{Math.floor(resources.crystal).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" data-testid="card-stats-deuterium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Deuterium</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">{Math.floor(resources.deuterium).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" data-testid="card-stats-trades">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Today's Trades</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">{mockTradeHistory.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MarketTab)} className="w-full">
           <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start">
              <TabsTrigger value="market" className="font-orbitron" data-testid="tab-market"><ShoppingBag className="w-4 h-4 mr-2" /> Marketplace</TabsTrigger>
              <TabsTrigger value="auction" className="font-orbitron" data-testid="tab-auction"><Gavel className="w-4 h-4 mr-2" /> Auction House</TabsTrigger>
              <TabsTrigger value="exchange" className="font-orbitron" data-testid="tab-exchange"><ArrowUpDown className="w-4 h-4 mr-2" /> Resource Exchange</TabsTrigger>
              <TabsTrigger value="history" className="font-orbitron" data-testid="tab-history"><History className="w-4 h-4 mr-2" /> Trade History</TabsTrigger>
              <TabsTrigger value="prices" className="font-orbitron" data-testid="tab-prices"><BarChart3 className="w-4 h-4 mr-2" /> Price Trends</TabsTrigger>
           </TabsList>

           <TabsContent value="market" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Available Vendors</h3>
                    {VENDORS.map(vendor => (
                       <VendorProfile 
                          key={vendor.id} 
                          vendor={vendor} 
                          active={selectedVendorId === vendor.id} 
                          onClick={() => setSelectedVendorId(vendor.id)} 
                       />
                    ))}

                    <Card className="bg-slate-50 border-slate-200 mt-6">
                       <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Your Wallet</CardTitle>
                       </CardHeader>
                       <CardContent className="text-xs space-y-2">
                          <div className="flex justify-between">
                             <span className="text-slate-500 flex items-center gap-1"><Box className="w-3 h-3" /> Metal</span>
                             <span className="font-mono">{Math.floor(resources.metal).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-blue-500 flex items-center gap-1"><Gem className="w-3 h-3" /> Crystal</span>
                             <span className="font-mono">{Math.floor(resources.crystal).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-green-500 flex items-center gap-1"><Database className="w-3 h-3" /> Deuterium</span>
                             <span className="font-mono">{Math.floor(resources.deuterium).toLocaleString()}</span>
                          </div>
                       </CardContent>
                    </Card>
                 </div>

                 <div className="lg:col-span-3">
                    <Card className={cn("border-none shadow-none bg-transparent")}>
                       <div className="flex items-center gap-4 mb-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md", selectedVendor.avatarColor)}>
                             {selectedVendor.type === "official" && <User className="w-8 h-8" />}
                             {selectedVendor.type === "scientist" && <Zap className="w-8 h-8" />}
                             {selectedVendor.type === "black_market" && <AlertTriangle className="w-8 h-8" />}
                          </div>
                          <div>
                             <h3 className="text-xl font-orbitron font-bold">{selectedVendor.name}</h3>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Badge variant="secondary" className="text-[10px] h-5">{selectedVendor.specialty}</Badge>
                                <span className="font-rajdhani uppercase tracking-widest text-xs">{selectedVendor.title}</span>
                             </div>
                             <p className="text-sm text-slate-600 italic">"{selectedVendor.description}"</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayItems.length === 0 && (
                             <div className="col-span-full text-center py-12 text-muted-foreground">
                                <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No items available in this category.</p>
                             </div>
                          )}
                          
                          {displayItems.map(item => {
                             const cost = item.basePrice;
                             const canAfford = 
                                resources.metal >= cost.metal && 
                                resources.crystal >= cost.crystal && 
                                resources.deuterium >= cost.deuterium;

                             return (
                                <ItemCard 
                                   key={item.id} 
                                   item={item} 
                                   mode={mode} 
                                   inventoryCount={inventory[item.id] || 0}
                                   canAfford={canAfford}
                                   onBuy={() => buyItem(item.id, item.basePrice)}
                                   onSell={() => sellItem(item.id, item.basePrice)}
                                />
                             );
                          })}
                       </div>
                    </Card>
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="auction" className="mt-6">
              <AuctionHouseContent />
           </TabsContent>

           <TabsContent value="exchange" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="bg-white border-slate-200" data-testid="card-exchange">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <ArrowUpDown className="w-5 h-5 text-blue-600" /> Resource Exchange
                       </CardTitle>
                       <CardDescription>Convert resources at market rates. A 10% fee applies to all exchanges.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">From</label>
                             <select 
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                                value={exchangeFrom}
                                onChange={e => setExchangeFrom(e.target.value)}
                             >
                                <option value="metal">Metal</option>
                                <option value="crystal">Crystal</option>
                                <option value="deuterium">Deuterium</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">To</label>
                             <select 
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                                value={exchangeTo}
                                onChange={e => setExchangeTo(e.target.value)}
                             >
                                <option value="metal">Metal</option>
                                <option value="crystal">Crystal</option>
                                <option value="deuterium">Deuterium</option>
                             </select>
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Amount</label>
                          <Input 
                             type="number"
                             value={exchangeAmount}
                             onChange={e => setExchangeAmount(e.target.value)}
                             className="bg-slate-50 font-mono"
                             data-testid="input-exchange-amount"
                          />
                       </div>

                       <div className="bg-slate-50 p-4 rounded border border-slate-200">
                          <div className="flex justify-between text-sm mb-2">
                             <span className="text-slate-500">Exchange Rate</span>
                             <span className="font-mono">1 : 1.5</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="text-slate-500">Fee (10%)</span>
                             <span className="font-mono text-red-600">-{Math.floor(parseInt(exchangeAmount) * 0.1).toLocaleString()}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-sm font-bold">
                             <span className="text-slate-700">You Receive</span>
                             <span className="font-mono text-green-600">{Math.floor(parseInt(exchangeAmount) * 0.9 * 1.5).toLocaleString()}</span>
                          </div>
                       </div>

                       <Button className="w-full" onClick={() => alert("Exchanging " + exchangeAmount + " resources!")} data-testid="button-exchange">
                          <ArrowUpDown className="w-4 h-4 mr-2" /> Exchange Resources
                       </Button>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-slate-200" data-testid="card-exchange-rates">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-slate-900">
                          <BarChart3 className="w-5 h-5 text-green-600" /> Current Exchange Rates
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium">Metal → Crystal</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 0.67</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                             <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium">Metal → Deuterium</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 0.33</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                             <div className="flex items-center gap-2">
                                <Gem className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Crystal → Metal</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 1.5</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
                             <div className="flex items-center gap-2">
                                <Gem className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Crystal → Deuterium</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 0.5</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                             <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">Deuterium → Metal</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 3</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                             <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">Deuterium → Crystal</span>
                             </div>
                             <span className="font-mono text-slate-900">1 : 2</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>

           <TabsContent value="history" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-trade-history">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <History className="w-5 h-5 text-purple-600" /> Trade History
                    </CardTitle>
                    <CardDescription>Your recent market transactions.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {mockTradeHistory.length === 0 ? (
                       <div className="text-center py-12 text-slate-400">
                          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p>No trade history yet. Start buying or selling items!</p>
                       </div>
                    ) : (
                       <div className="space-y-3">
                          {mockTradeHistory.map(trade => (
                             <div key={trade.id} className={cn("flex items-center justify-between p-4 rounded border", trade.type === "buy" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200")}>
                                <div className="flex items-center gap-4">
                                   <div className={cn("w-10 h-10 rounded flex items-center justify-center", trade.type === "buy" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600")}>
                                      {trade.type === "buy" ? <ShoppingBag className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                                   </div>
                                   <div>
                                      <div className="font-bold text-sm text-slate-900">{trade.item}</div>
                                      <div className="text-xs text-slate-500">Quantity: {trade.amount}</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="font-mono text-sm font-bold">{Object.values(trade.cost)[0].toLocaleString()} {Object.keys(trade.cost)[0]}</div>
                                   <div className="text-xs text-slate-400">{trade.date}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="prices" className="mt-6">
              <Card className="bg-white border-slate-200" data-testid="card-price-trends">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                       <BarChart3 className="w-5 h-5 text-green-600" /> Market Price Trends
                    </CardTitle>
                    <CardDescription>24-hour price changes for popular items.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {mockPriceChanges.map(item => (
                          <div key={item.item} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                             <span className="font-medium text-slate-900">{item.item}</span>
                             <div className={cn("flex items-center gap-1 font-mono", item.direction === "up" ? "text-green-600" : item.direction === "down" ? "text-red-600" : "text-slate-500")}>
                                {item.direction === "up" && <TrendingUp className="w-4 h-4" />}
                                {item.direction === "down" && <TrendingDown className="w-4 h-4" />}
                                {item.change > 0 ? "+" : ""}{item.change}%
                             </div>
                          </div>
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
