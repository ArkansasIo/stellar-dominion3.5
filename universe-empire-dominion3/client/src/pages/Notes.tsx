import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pin, PinOff, Trash2, Edit3, Search, X } from "lucide-react";

interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}

const CATEGORIES = ["general", "research", "fleet", "alliance", "trade", "other"];
const CATEGORY_COLORS: Record<string, string> = {
  general: "#888",
  research: "#64b5f6",
  fleet: "#81c784",
  alliance: "#ffb74d",
  trade: "#e57373",
  other: "#ba68c8",
};

export default function Notes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => fetchJson<Note[]>("/api/notes"),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: string; tags: string[]; isPinned: boolean; color: string | null }) =>
      fetchJson<Note>("/api/notes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setShowEditor(false);
      setEditing(null);
      toast({ title: "Note created" });
    },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) =>
      fetchJson<Note>(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setShowEditor(false);
      setEditing(null);
      toast({ title: "Note updated" });
    },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJson(`/api/notes/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Note deleted" });
    },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const filtered = notes.filter((n) => {
    if (filterCategory && n.category !== filterCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string)?.trim();
    if (!title) { toast({ title: "Title required", variant: "destructive" }); return; }
    const payload = {
      title,
      content: (form.get("content") as string) || "",
      category: (form.get("category") as string) || "general",
      tags: (form.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) || [],
      isPinned: editing?.isPinned || false,
      color: null,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const togglePin = (note: Note) => {
    updateMutation.mutate({ id: note.id, data: { isPinned: !note.isPinned } });
  };

  return (
    <GameLayout>
      <div className="notes-container">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="notes-toolbar">
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <Input
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button size="sm" onClick={() => { setEditing(null); setShowEditor(true); }}>
                <Plus className="h-4 w-4 mr-1" /> New Note
              </Button>
            </div>

            <div className="notes-filter-bar">
              <button
                className={`notes-filter-tag ${!filterCategory ? "active" : ""}`}
                onClick={() => setFilterCategory(null)}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`notes-filter-tag ${filterCategory === cat ? "active" : ""}`}
                  onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  style={{ borderColor: filterCategory === cat ? CATEGORY_COLORS[cat] : undefined }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {showEditor && (
              <form onSubmit={handleSave} className="notes-editor sd-card">
                <Input name="title" defaultValue={editing?.title || ""} placeholder="Note title" required />
                <Textarea name="content" defaultValue={editing?.content || ""} placeholder="Write your note..." />
                <div className="notes-editor-footer">
                  <div className="flex gap-2 items-center">
                    <select name="category" defaultValue={editing?.category || "general"} className="sd-input text-sm px-2 py-1">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Input name="tags" defaultValue={editing?.tags?.join(", ") || ""} placeholder="Tags (comma-sep)" className="max-w-[200px]" />
                  </div>
                  <div className="notes-editor-actions">
                    <Button type="submit" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editing ? "Update" : "Create"}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowEditor(false); setEditing(null); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="notes-empty">Loading...</div>
            ) : sorted.length === 0 ? (
              <div className="notes-empty">
                {search || filterCategory ? "No notes match your filters." : "No notes yet. Create your first note!"}
              </div>
            ) : (
              <div className="notes-grid">
                {sorted.map((note) => (
                  <div key={note.id} className={`notes-card sd-card ${note.isPinned ? "pinned" : ""}`}>
                    <div className="notes-card-header">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="notes-category-indicator"
                          style={{ backgroundColor: CATEGORY_COLORS[note.category] || "#888" }}
                        />
                        <div className="notes-card-title">{note.title}</div>
                      </div>
                      <div className="notes-card-date">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`notes-card-content ${note.content.length > 150 ? "collapsed" : ""}`}>
                      {note.content}
                    </div>
                    <div className="notes-card-footer">
                      <div className="notes-card-tags">
                        {note.tags?.map((tag) => (
                          <span key={tag} className="notes-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="notes-card-actions">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePin(note)} title={note.isPinned ? "Unpin" : "Pin"}>
                          {note.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditing(note); setShowEditor(true); }} title="Edit">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteMutation.mutate(note.id)} title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
