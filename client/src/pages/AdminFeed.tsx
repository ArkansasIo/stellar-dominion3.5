import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Rss, Plus, Trash2, ExternalLink } from "lucide-react";

type FeedEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
};

export default function AdminFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");

  const { data: entries } = useQuery<{ entries: FeedEntry[] }>({
    queryKey: ["/api/feed"],
  });

  const createEntry = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, category }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Entry created" });
      setTitle(""); setDescription(""); setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/feed/${id}`, { method: "DELETE" });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/feed"] }); toast({ title: "Entry deleted" }); },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  return (
    <GameLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Rss className="w-6 h-6" />
          <h1 className="text-2xl font-bold">News Feed Manager</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/feed/rss", "_blank")}><ExternalLink className="w-4 h-4 mr-1" />RSS</Button>
          <Button variant="outline" onClick={() => window.open("/feed/atom", "_blank")}><ExternalLink className="w-4 h-4 mr-1" />Atom</Button>
          <Button variant="outline" onClick={() => window.open("/feed/json", "_blank")}><ExternalLink className="w-4 h-4 mr-1" />JSON</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Create New Entry</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Textarea placeholder="Content (HTML)" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[100px]" />
            <div className="flex gap-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="news">News</option>
                <option value="update">Update</option>
                <option value="event">Event</option>
                <option value="maintenance">Maintenance</option>
                <option value="announcement">Announcement</option>
              </select>
              <Button onClick={() => createEntry.mutate()} disabled={!title}><Plus className="w-4 h-4 mr-1" />Create</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Entries ({entries?.entries?.length ?? 0})</CardTitle></CardHeader>
          <CardContent>
            {(!entries?.entries || entries.entries.length === 0) ? (
              <p className="text-muted-foreground">No entries yet.</p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead className="w-24">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {entries.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell><Badge>{entry.category}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(entry.publishedAt).toLocaleDateString()}</TableCell>
                      <TableCell><Button size="sm" variant="destructive" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-4 h-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
