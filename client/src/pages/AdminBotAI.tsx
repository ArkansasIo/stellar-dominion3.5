import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Play, Square, Plus, Trash2 } from "lucide-react";

type BotInfoResponse = {
  isBot: boolean;
  playerId: string;
};

export default function AdminBotAI() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [botName, setBotName] = useState("");
  const [strategyJson, setStrategyJson] = useState(`{
  "nodeDataArray": [
    { "key": 1, "category": "Start", "text": "Start" },
    { "key": 2, "category": "Label", "text": "main_loop" },
    { "key": 3, "category": "Cond", "text": "context.resources.metal < 10000" },
    { "key": 4, "category": "Action", "text": "return 60" },
    { "key": 5, "category": "Branch", "text": "main_loop" },
    { "key": 6, "category": "End", "text": "End" }
  ],
  "linkDataArray": [
    { "from": 1, "to": 2 },
    { "from": 2, "to": 3 },
    { "from": 3, "to": 4, "text": "yes" },
    { "from": 3, "to": 5, "text": "no" },
    { "from": 4, "to": 5 },
    { "from": 5, "to": 6 }
  ]
}`);

  const addBot = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: botName }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { toast({ title: "Bot created" }); setBotName(""); queryClient.invalidateQueries({ queryKey: ["/api/admin/bots"] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const createStrategy = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/bots/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Strategy", source: strategyJson }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { toast({ title: "Strategy created" }); queryClient.invalidateQueries({ queryKey: ["/api/admin/bots/strategies"] }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const { data: bots } = useQuery<BotInfoResponse[]>({
    queryKey: ["/api/admin/bots"],
  });

  return (
    <GameLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Bot AI System</h1>
        </div>

        <Tabs defaultValue="bots">
          <TabsList>
            <TabsTrigger value="bots">Bot Management</TabsTrigger>
            <TabsTrigger value="strategies">Strategy Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Create Bot</CardTitle><CardDescription>Add a new automated bot player</CardDescription></CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Bot name..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <Button onClick={() => addBot.mutate()} disabled={!botName}><Plus className="w-4 h-4 mr-1" />Add Bot</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Strategy JSON Editor</CardTitle><CardDescription>Edit the visual block strategy as JSON</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={strategyJson}
                  onChange={(e) => setStrategyJson(e.target.value)}
                  className="font-mono text-xs min-h-[300px]"
                />
                <Button onClick={() => createStrategy.mutate()}>Save Strategy</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
