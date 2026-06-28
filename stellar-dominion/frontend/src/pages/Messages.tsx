import GameLayout from "@/components/layout/GameLayout";
import { BattleReport, EspionageReport } from "@/lib/gameLogic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Mail, Send, Trash2, Reply, AlertCircle, User, Shield, Flag, Skull, Crosshair, ArrowRightLeft, Check, X, RefreshCw, Box, Gem, Database, Clock, ArrowRight, History } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/gameContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type MessagesMainTab = "messages" | "trades";
type MessagesSubTab = "inbox" | "sent" | "compose";
type TradesSubTab = "incoming" | "outgoing" | "history";

interface TradeOffer {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  offerMetal: number;
  offerCrystal: number;
  offerDeuterium: number;
  offerItems: any[];
  requestMetal: number;
  requestCrystal: number;
  requestDeuterium: number;
  requestItems: any[];
  message: string | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}

function TradeOfferCard({ trade, isIncoming, onAccept, onDecline, onCancel }: { 
  trade: TradeOffer; 
  isIncoming: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    accepted: "bg-green-100 text-green-700 border-green-300",
    declined: "bg-red-100 text-red-700 border-red-300",
    cancelled: "bg-slate-100 text-slate-700 border-slate-300",
    expired: "bg-slate-100 text-slate-600 border-slate-300",
    countered: "bg-purple-100 text-purple-700 border-purple-300"
  };

  const hasOffer = trade.offerMetal > 0 || trade.offerCrystal > 0 || trade.offerDeuterium > 0;
  const hasRequest = trade.requestMetal > 0 || trade.requestCrystal > 0 || trade.requestDeuterium > 0;

  return (
    <Card className="border-2" data-testid={`card-trade-${trade.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            <div>
              <p className="font-bold">
                {isIncoming ? `From: ${trade.senderName}` : `To: ${trade.receiverName}`}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(trade.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge className={statusColors[trade.status] || statusColors.pending}>
            {trade.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-bold text-green-700 mb-2">
              {isIncoming ? "You Receive" : "You Offer"}
            </p>
            {hasOffer ? (
              <div className="space-y-1 text-sm">
                {trade.offerMetal > 0 && (
                  <div className="flex items-center gap-2">
                    <Box className="w-3 h-3 text-slate-600" />
                    <span>{trade.offerMetal.toLocaleString()} Metal</span>
                  </div>
                )}
                {trade.offerCrystal > 0 && (
                  <div className="flex items-center gap-2">
                    <Gem className="w-3 h-3 text-blue-600" />
                    <span>{trade.offerCrystal.toLocaleString()} Crystal</span>
                  </div>
                )}
                {trade.offerDeuterium > 0 && (
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-green-600" />
                    <span>{trade.offerDeuterium.toLocaleString()} Deuterium</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nothing</p>
            )}
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-bold text-red-700 mb-2">
              {isIncoming ? "You Give" : "You Request"}
            </p>
            {hasRequest ? (
              <div className="space-y-1 text-sm">
                {trade.requestMetal > 0 && (
                  <div className="flex items-center gap-2">
                    <Box className="w-3 h-3 text-slate-600" />
                    <span>{trade.requestMetal.toLocaleString()} Metal</span>
                  </div>
                )}
                {trade.requestCrystal > 0 && (
                  <div className="flex items-center gap-2">
                    <Gem className="w-3 h-3 text-blue-600" />
                    <span>{trade.requestCrystal.toLocaleString()} Crystal</span>
                  </div>
                )}
                {trade.requestDeuterium > 0 && (
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-green-600" />
                    <span>{trade.requestDeuterium.toLocaleString()} Deuterium</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nothing</p>
            )}
          </div>
        </div>

        {trade.message && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-1">Message</p>
            <p className="text-sm text-slate-700">{trade.message}</p>
          </div>
        )}

        {trade.expiresAt && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Expires: {new Date(trade.expiresAt).toLocaleString()}</span>
          </div>
        )}

        {trade.status === "pending" && (
          <div className="flex gap-2">
            {isIncoming ? (
              <>
                <Button 
                  className="flex-1" 
                  onClick={onAccept}
                  data-testid={`button-accept-trade-${trade.id}`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={onDecline}
                  data-testid={`button-decline-trade-${trade.id}`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onCancel}
                data-testid={`button-cancel-trade-${trade.id}`}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Trade
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateTradeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [offerMetal, setOfferMetal] = useState(0);
  const [offerCrystal, setOfferCrystal] = useState(0);
  const [offerDeuterium, setOfferDeuterium] = useState(0);
  const [requestMetal, setRequestMetal] = useState(0);
  const [requestCrystal, setRequestCrystal] = useState(0);
  const [requestDeuterium, setRequestDeuterium] = useState(0);
  const { toast } = useToast();

  const createTradeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create trade");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Trade offer sent!" });
      setOpen(false);
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setRecipient("");
    setMessage("");
    setOfferMetal(0);
    setOfferCrystal(0);
    setOfferDeuterium(0);
    setRequestMetal(0);
    setRequestCrystal(0);
    setRequestDeuterium(0);
  };

  const handleSubmit = () => {
    if (!recipient) {
      toast({ title: "Error", description: "Please enter a recipient", variant: "destructive" });
      return;
    }
    
    createTradeMutation.mutate({
      receiverName: recipient,
      offerMetal,
      offerCrystal,
      offerDeuterium,
      requestMetal,
      requestCrystal,
      requestDeuterium,
      message
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-trade">
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          New Trade Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Trade Offer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Recipient Username</label>
            <Input 
              placeholder="Player name" 
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              data-testid="input-trade-recipient"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-bold text-green-700">You Offer</p>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Box className="w-3 h-3" /> Metal
                </label>
                <Input 
                  type="number" 
                  value={offerMetal}
                  onChange={e => setOfferMetal(parseInt(e.target.value) || 0)}
                  data-testid="input-offer-metal"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Gem className="w-3 h-3" /> Crystal
                </label>
                <Input 
                  type="number" 
                  value={offerCrystal}
                  onChange={e => setOfferCrystal(parseInt(e.target.value) || 0)}
                  data-testid="input-offer-crystal"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Deuterium
                </label>
                <Input 
                  type="number" 
                  value={offerDeuterium}
                  onChange={e => setOfferDeuterium(parseInt(e.target.value) || 0)}
                  data-testid="input-offer-deuterium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-red-700">You Request</p>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Box className="w-3 h-3" /> Metal
                </label>
                <Input 
                  type="number" 
                  value={requestMetal}
                  onChange={e => setRequestMetal(parseInt(e.target.value) || 0)}
                  data-testid="input-request-metal"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Gem className="w-3 h-3" /> Crystal
                </label>
                <Input 
                  type="number" 
                  value={requestCrystal}
                  onChange={e => setRequestCrystal(parseInt(e.target.value) || 0)}
                  data-testid="input-request-crystal"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Deuterium
                </label>
                <Input 
                  type="number" 
                  value={requestDeuterium}
                  onChange={e => setRequestDeuterium(parseInt(e.target.value) || 0)}
                  data-testid="input-request-deuterium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Message (Optional)</label>
            <Textarea 
              placeholder="Add a message to your trade offer..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              data-testid="input-trade-message"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={createTradeMutation.isPending}>
            {createTradeMutation.isPending ? "Sending..." : "Send Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Messages() {
  const { messages, sendMessage, markMessageRead, deleteMessage } = useGame();
  const [mainTab, setMainTab] = useState<MessagesMainTab>("messages");
  const [messagesSubTab, setMessagesSubTab] = useState<MessagesSubTab>("inbox");
  const [tradesSubTab, setTradesSubTab] = useState<TradesSubTab>("incoming");
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const subParam = params.get("sub");

    if (tabParam === "messages" || tabParam === "trades") {
      setMainTab(tabParam);

      if (tabParam === "messages" && (subParam === "inbox" || subParam === "sent" || subParam === "compose")) {
        setMessagesSubTab(subParam);
      }

      if (tabParam === "trades" && (subParam === "incoming" || subParam === "outgoing" || subParam === "history")) {
        setTradesSubTab(subParam);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", mainTab);
    params.set("sub", mainTab === "messages" ? messagesSubTab : tradesSubTab);

    const nextUrl = `/messages?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [mainTab, messagesSubTab, tradesSubTab]);

  const inbox = messages.filter((m: any) => m.to === "Commander");
  const sent = messages.filter((m: any) => m.from === "Commander");

  const activeMessage = messages.find(m => m.id === selectedMsg);

  const handleSend = () => {
     if (!composeTo || !composeSubject || !composeBody) {
        alert("Please fill in all fields.");
        return;
     }
     sendMessage(composeTo, composeSubject, composeBody);
     setComposeTo("");
     setComposeSubject("");
     setComposeBody("");
  };

  // Trade queries
  const { data: incomingTrades = [], refetch: refetchIncoming } = useQuery({
    queryKey: ["/api/trades/incoming"],
    queryFn: async () => {
      const res = await fetch("/api/trades/incoming", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: outgoingTrades = [], refetch: refetchOutgoing } = useQuery({
    queryKey: ["/api/trades/outgoing"],
    queryFn: async () => {
      const res = await fetch("/api/trades/outgoing", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: tradeHistory = [] } = useQuery({
    queryKey: ["/api/trades/history"],
    queryFn: async () => {
      const res = await fetch("/api/trades/history", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const acceptTrade = useMutation({
    mutationFn: async (tradeId: string) => {
      const res = await fetch(`/api/trades/${tradeId}/accept`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Trade accepted! Resources exchanged." });
      refetchIncoming();
      queryClient.invalidateQueries({ queryKey: ["/api/trades/history"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const declineTrade = useMutation({
    mutationFn: async (tradeId: string) => {
      const res = await fetch(`/api/trades/${tradeId}/decline`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Trade declined." });
      refetchIncoming();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const cancelTrade = useMutation({
    mutationFn: async (tradeId: string) => {
      const res = await fetch(`/api/trades/${tradeId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Trade cancelled." });
      refetchOutgoing();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const refreshTrades = () => {
    refetchIncoming();
    refetchOutgoing();
    queryClient.invalidateQueries({ queryKey: ["/api/trades/history"] });
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900" data-testid="text-messages-title">Subspace Communications</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Encrypted messaging terminal & player trading.</p>
        </div>

        <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as MessagesMainTab)} className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="messages" data-testid="tab-messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="trades" data-testid="tab-trades">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Trades
              {incomingTrades.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{incomingTrades.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Message List */}
              <Card className="bg-white border-slate-200 col-span-1 flex flex-col">
                <Tabs value={messagesSubTab} onValueChange={(value) => setMessagesSubTab(value as MessagesSubTab)} className="flex-1 flex flex-col">
                   <div className="p-4 border-b border-slate-100">
                      <TabsList className="w-full grid grid-cols-3">
                         <TabsTrigger value="inbox">Inbox</TabsTrigger>
                         <TabsTrigger value="sent">Sent</TabsTrigger>
                         <TabsTrigger value="compose">Compose</TabsTrigger>
                      </TabsList>
                   </div>

                   <TabsContent value="inbox" className="flex-1 p-0 m-0 flex flex-col overflow-hidden">
                      <ScrollArea className="flex-1">
                         {inbox.length === 0 && <div className="p-8 text-center text-slate-500">No messages received.</div>}
                         {inbox.map(msg => (
                            <div 
                               key={msg.id} 
                               className={cn(
                                  "p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors",
                                  selectedMsg === msg.id && "bg-blue-50 border-l-4 border-l-primary",
                                  !msg.read && "bg-slate-50 font-bold"
                               )}
                               onClick={() => {
                                  setSelectedMsg(msg.id);
                                  markMessageRead(msg.id);
                               }}
                               data-testid={`message-item-${msg.id}`}
                            >
                               <div className="flex justify-between items-start mb-1">
                                  <span className={cn("text-sm flex items-center gap-1", !msg.read ? "text-slate-900" : "text-slate-600")}>
                                     {msg.type === "combat" && <Crosshair className="w-3 h-3 text-red-500" />}
                                     {msg.type === "player" && <ArrowRightLeft className="w-3 h-3 text-green-500" />}
                                     {msg.from}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                               </div>
                               <div className={cn("text-sm truncate", !msg.read ? "text-slate-900" : "text-slate-500")}>{msg.subject}</div>
                            </div>
                         ))}
                      </ScrollArea>
                   </TabsContent>

                   <TabsContent value="sent" className="flex-1 p-0 m-0 flex flex-col overflow-hidden">
                      <ScrollArea className="flex-1">
                         {sent.length === 0 && <div className="p-8 text-center text-slate-500">No messages sent.</div>}
                         {sent.map(msg => (
                            <div 
                               key={msg.id} 
                               className={cn(
                                  "p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors",
                                  selectedMsg === msg.id && "bg-blue-50 border-l-4 border-l-primary"
                               )}
                               onClick={() => setSelectedMsg(msg.id)}
                            >
                               <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm text-slate-600">To: {msg.to}</span>
                                  <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</span>
                               </div>
                               <div className="text-sm text-slate-500 truncate">{msg.subject}</div>
                            </div>
                         ))}
                      </ScrollArea>
                   </TabsContent>
                   
                   <TabsContent value="compose" className="flex-1 p-4 m-0 space-y-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-slate-500">Recipient</label>
                         <Input 
                            placeholder="Player Name or Coordinates" 
                            value={composeTo}
                            onChange={e => setComposeTo(e.target.value)}
                            className="bg-slate-50 border-slate-200"
                            data-testid="input-compose-to"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase text-slate-500">Subject</label>
                         <Input 
                            placeholder="Subject" 
                            value={composeSubject}
                            onChange={e => setComposeSubject(e.target.value)}
                            className="bg-slate-50 border-slate-200"
                            data-testid="input-compose-subject"
                         />
                      </div>
                      <div className="space-y-2 flex-1">
                         <label className="text-xs font-bold uppercase text-slate-500">Message</label>
                         <Textarea 
                            placeholder="Type your message..." 
                            value={composeBody}
                            onChange={e => setComposeBody(e.target.value)}
                            className="bg-slate-50 border-slate-200 h-[200px] resize-none"
                            data-testid="input-compose-body"
                         />
                      </div>
                      <Button className="w-full" onClick={handleSend} data-testid="button-send-message">
                         <Send className="w-4 h-4 mr-2" /> Send Transmission
                      </Button>
                   </TabsContent>
                </Tabs>
              </Card>

              {/* Message Reader */}
              <Card className="bg-white border-slate-200 lg:col-span-2 flex flex-col h-full">
                {activeMessage ? (
                   <>
                      <CardHeader className="border-b border-slate-100 pb-4">
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <CardTitle className="text-xl font-bold text-slate-900">{activeMessage.subject}</CardTitle>
                               <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <User className="w-4 h-4" />
                                  <span>{activeMessage.from === "Commander" ? `To: ${activeMessage.to}` : `From: ${activeMessage.from}`}</span>
                                  <span className="text-slate-300">|</span>
                                  <span>{new Date(activeMessage.timestamp).toLocaleString()}</span>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               {activeMessage.type === "system" && <Badge variant="outline" className="border-blue-200 text-blue-600">System</Badge>}
                               {activeMessage.type === "combat" && <Badge variant="outline" className="border-red-200 text-red-600">Combat Report</Badge>}
                               {activeMessage.type === "espionage" && <Badge variant="outline" className="border-yellow-200 text-yellow-600">Espionage</Badge>}
                               {activeMessage.type === "alliance" && <Badge variant="outline" className="border-green-200 text-green-600">Alliance</Badge>}
                               {activeMessage.type === "player" && <Badge variant="outline" className="border-purple-200 text-purple-600">Player</Badge>}
                            </div>
                         </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-6 overflow-y-auto">
                         {activeMessage.espionageReport ? (
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                   <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-orbitron font-bold text-lg text-slate-900">Planetary Intelligence</h3>
                                      <Badge variant="outline" className="text-xs">Counter-Intel: {activeMessage.espionageReport.counterEspionage}%</Badge>
                                   </div>
                                   
                                   <div className="grid grid-cols-2 gap-6">
                                      <div>
                                         <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Resources</h4>
                                         <div className="space-y-1 font-mono text-sm">
                                            <div className="flex justify-between"><span>Metal:</span> <span>{activeMessage.espionageReport.resources.metal.toLocaleString()}</span></div>
                                            <div className="flex justify-between"><span>Crystal:</span> <span>{activeMessage.espionageReport.resources.crystal.toLocaleString()}</span></div>
                                            <div className="flex justify-between"><span>Deuterium:</span> <span>{activeMessage.espionageReport.resources.deuterium.toLocaleString()}</span></div>
                                            <div className="flex justify-between"><span>Energy:</span> <span>{activeMessage.espionageReport.resources.energy.toLocaleString()}</span></div>
                                         </div>
                                      </div>
                                      
                                      {activeMessage.espionageReport.units && (
                                         <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Fleet Detected</h4>
                                            <div className="space-y-1 font-mono text-sm">
                                               {Object.entries(activeMessage.espionageReport.units).map(([u, c]) => (
                                                  <div key={u} className="flex justify-between capitalize"><span>{u.replace(/([A-Z])/g, ' $1').trim()}:</span> <span>{c}</span></div>
                                               ))}
                                            </div>
                                         </div>
                                      )}
                                   </div>
                                   
                                   {activeMessage.espionageReport.buildings && (
                                      <div className="mt-4 pt-4 border-t border-slate-200">
                                         <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Structures</h4>
                                         <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm">
                                            {Object.entries(activeMessage.espionageReport.buildings).map(([b, l]) => (
                                               <div key={b} className="flex justify-between capitalize"><span>{b.replace(/([A-Z])/g, ' $1').trim()}:</span> <span>{l}</span></div>
                                            ))}
                                         </div>
                                      </div>
                                   )}
                                </div>
                            </div>
                         ) : activeMessage.battleReport ? (
                            <div className="space-y-6">
                               <div className="flex justify-between items-center bg-slate-100 p-4 rounded">
                                  <div className="text-center">
                                     <div className="font-bold text-lg text-slate-900">Attacker</div>
                                     <div className="text-red-600 font-mono">Lost: {activeMessage.battleReport.attackerLosses.toLocaleString()}</div>
                                  </div>
                                  <div className="font-orbitron text-2xl font-bold text-slate-900 bg-white px-4 py-2 rounded border border-slate-200">
                                     {activeMessage.battleReport.winner === "attacker" ? "VICTORY" : activeMessage.battleReport.winner === "defender" ? "DEFEAT" : "DRAW"}
                                  </div>
                                  <div className="text-center">
                                     <div className="font-bold text-lg text-slate-900">Defender</div>
                                     <div className="text-red-600 font-mono">Lost: {activeMessage.battleReport.defenderLosses.toLocaleString()}</div>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                     <div className="font-bold text-sm uppercase text-slate-500 mb-2">Loot Obtained</div>
                                     <div className="space-y-1 font-mono text-sm">
                                        <div className="flex justify-between"><span>Metal:</span> <span className="text-slate-900">{activeMessage.battleReport.loot.metal.toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span>Crystal:</span> <span className="text-blue-600">{activeMessage.battleReport.loot.crystal.toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span>Deuterium:</span> <span className="text-green-600">{activeMessage.battleReport.loot.deuterium.toLocaleString()}</span></div>
                                     </div>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                     <div className="font-bold text-sm uppercase text-slate-500 mb-2">Debris Field</div>
                                     <div className="space-y-1 font-mono text-sm">
                                        <div className="flex justify-between"><span>Metal:</span> <span className="text-slate-900">{activeMessage.battleReport.debris.metal.toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span>Crystal:</span> <span className="text-blue-600">{activeMessage.battleReport.debris.crystal.toLocaleString()}</span></div>
                                     </div>
                                  </div>
                               </div>

                               <div className="bg-slate-900 text-green-400 p-4 rounded font-mono text-xs h-40 overflow-y-auto">
                                  {activeMessage.battleReport.log.map((line, i) => (
                                     <div key={i}>{line}</div>
                                  ))}
                               </div>
                            </div>
                         ) : (
                            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                               {activeMessage.body}
                            </div>
                         )}
                      </CardContent>
                      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 rounded-b-lg">
                         {activeMessage.from !== "Commander" && activeMessage.type !== "combat" && (
                            <Button variant="outline" onClick={() => {
                               setComposeTo(activeMessage.from);
                               setComposeSubject(`Re: ${activeMessage.subject}`);
                            }}>
                               <Reply className="w-4 h-4 mr-2" /> Reply
                            </Button>
                         )}
                         <Button variant="destructive" onClick={() => {
                            deleteMessage(activeMessage.id);
                            setSelectedMsg(null);
                         }}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                         </Button>
                      </div>
                   </>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                      <Mail className="w-16 h-16 mb-4 opacity-20" />
                      <p>Select a message to read</p>
                   </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" onClick={refreshTrades} data-testid="button-refresh-trades">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <CreateTradeDialog onSuccess={refreshTrades} />
            </div>

            <Tabs value={tradesSubTab} onValueChange={(value) => setTradesSubTab(value as TradesSubTab)} className="w-full">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="incoming" data-testid="tab-incoming-trades">
                  Incoming
                  {incomingTrades.length > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">{incomingTrades.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="outgoing" data-testid="tab-outgoing-trades">
                  Outgoing
                  {outgoingTrades.length > 0 && (
                    <Badge className="ml-2 bg-blue-500 text-white">{outgoingTrades.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-trade-history">
                  <History className="w-4 h-4 mr-1" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="incoming" className="mt-4">
                {incomingTrades.length === 0 ? (
                  <Card className="p-8 text-center text-slate-500">
                    <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No incoming trade offers.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incomingTrades.map((trade: TradeOffer) => (
                      <TradeOfferCard 
                        key={trade.id} 
                        trade={trade} 
                        isIncoming={true}
                        onAccept={() => acceptTrade.mutate(trade.id)}
                        onDecline={() => declineTrade.mutate(trade.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="outgoing" className="mt-4">
                {outgoingTrades.length === 0 ? (
                  <Card className="p-8 text-center text-slate-500">
                    <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No outgoing trade offers.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {outgoingTrades.map((trade: TradeOffer) => (
                      <TradeOfferCard 
                        key={trade.id} 
                        trade={trade} 
                        isIncoming={false}
                        onCancel={() => cancelTrade.mutate(trade.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {tradeHistory.length === 0 ? (
                  <Card className="p-8 text-center text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No trade history yet.</p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {tradeHistory.map((trade: any) => (
                      <Card key={trade.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Check className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-bold">
                                {trade.senderName} <ArrowRight className="w-4 h-4 inline" /> {trade.receiverName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(trade.completedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={trade.result === "completed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}>
                            {trade.result}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
