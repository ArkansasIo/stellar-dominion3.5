import GameLayout from "@/components/layout/GameLayout";
import { VENDORS, type Vendor } from "@/lib/vendorData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, MapPin, Store, MessageSquare, Heart, ShoppingBag } from "lucide-react";
import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const VendorTypeIcons: Record<string, React.ComponentType<{className?: string}>> = {
  merchant: ShoppingBag,
  diplomat: User,
  armorer: Store,
  scientist: MessageSquare,
  scout: MapPin,
  mystic: Heart,
  trainer: User,
};

const getVendorIcon = (type: string) => {
  const Icon = VendorTypeIcons[type];
  return Icon ? <Icon className="w-4 h-4" /> : null;
};

const VendorTypeColors: Record<string, string> = {
  merchant: "bg-green-100 text-green-800 border-green-300",
  diplomat: "bg-purple-100 text-purple-800 border-purple-300",
  armorer: "bg-red-100 text-red-800 border-red-300",
  scientist: "bg-blue-100 text-blue-800 border-blue-300",
  scout: "bg-orange-100 text-orange-800 border-orange-300",
  mystic: "bg-pink-100 text-pink-800 border-pink-300",
  trainer: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export default function Merchants() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(VENDORS[0]);
  const [reputation] = useState(72);

  const totalOfferings = selectedVendor?.offerings.reduce((sum, offering) => sum + offering.items.length, 0) || 0;

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900" data-testid="text-merchants-title">
            Galactic Merchants
          </h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Trade with vendors, accept quests, and discover exclusive goods.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Vendor List */}
          <Card className="bg-white border-slate-200 flex flex-col" data-testid="card-vendor-list">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-lg">Available Vendors</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-4">
                {VENDORS.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors border",
                      selectedVendor?.id === vendor.id
                        ? "bg-primary/10 border-primary text-primary font-bold"
                        : "border-transparent hover:bg-slate-100 text-slate-700"
                    )}
                    data-testid={`vendor-button-${vendor.id}`}
                  >
                    <div className="flex items-center gap-2">
                      {getVendorIcon(vendor.type)}
                      <span className="text-sm font-medium">{vendor.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{vendor.title}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Vendor Details */}
          {selectedVendor && (
            <Card className="bg-white border-slate-200 lg:col-span-2 flex flex-col" data-testid={`card-vendor-details-${selectedVendor.id}`}>
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900">{selectedVendor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedVendor.title}</p>
                  </div>
                  <Badge className={cn("border", VendorTypeColors[selectedVendor.type])}>
                    {selectedVendor.type}
                  </Badge>
                </div>
              </CardHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <TabsList className="mx-4 mt-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="offerings">Offerings</TabsTrigger>
                  <TabsTrigger value="quests">Quests</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase text-slate-500">Reputation</div>
                        <div className="text-xl font-bold text-slate-900">{reputation}%</div>
                      </div>
                      <div className="rounded border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase text-slate-500">Offerings</div>
                        <div className="text-xl font-bold text-slate-900">{totalOfferings}</div>
                      </div>
                      <div className="rounded border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs uppercase text-slate-500">Quest Lines</div>
                        <div className="text-xl font-bold text-slate-900">{selectedVendor.questsAvailable.length}</div>
                      </div>
                    </div>

                    <TabsContent value="overview" className="m-0 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Description</h4>
                        <p className="text-sm text-slate-700">{selectedVendor.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Personality</h4>
                        <p className="text-sm text-slate-700 italic">{selectedVendor.personality}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Specialty</h4>
                        <p className="text-sm text-slate-700">{selectedVendor.specialty}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="text-xs font-bold text-slate-600 mb-1">Location</p>
                          <p className="text-sm text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {selectedVendor.location}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="text-xs font-bold text-slate-600 mb-1">Availability</p>
                          <p className="text-sm text-slate-900">{selectedVendor.availability}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Trading Style</h4>
                        <p className="text-sm text-slate-700 bg-yellow-50 border border-yellow-200 p-3 rounded">{selectedVendor.tradingStyle}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Negotiation Guidance</h4>
                        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                          Higher reputation unlocks better contract terms, rare stock previews, and reduced transaction friction.
                          Mix trade volume with quest completion to maximize vendor trust.
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="offerings" className="m-0 space-y-4">
                      {selectedVendor.offerings.map((offering, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-900">{offering.category}</h4>
                            {offering.discountPercent && (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                {offering.discountPercent}% Off
                              </Badge>
                            )}
                          </div>
                          <ul className="space-y-1">
                            {offering.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-sm text-slate-700 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="quests" className="m-0 space-y-3">
                      {selectedVendor.questsAvailable.map((quest, idx) => (
                        <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{quest}</p>
                            <p className="text-xs text-slate-600 mt-1">Quest from {selectedVendor.name}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Accept
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
