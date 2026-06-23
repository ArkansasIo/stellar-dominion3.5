import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Newspaper, Radio, AlertTriangle, Swords, TrendingUp, Star, Megaphone,
  Clock, Pin, Tag, ChevronRight, Send, RefreshCw, Bell, Globe
} from "lucide-react";

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  category: "update" | "event" | "announcement" | "war" | "economy" | "patch";
  author: string;
  createdAt: string;
  pinned: boolean;
  tags: string[];
};

type Announcement = {
  id: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  expiresAt?: string;
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  update: { icon: Star, color: "text-blue-400", bg: "bg-blue-900/30", label: "Update" },
  event: { icon: Globe, color: "text-green-400", bg: "bg-green-900/30", label: "Event" },
  announcement: { icon: Megaphone, color: "text-purple-400", bg: "bg-purple-900/30", label: "Announcement" },
  war: { icon: Swords, color: "text-red-400", bg: "bg-red-900/30", label: "War Alert" },
  economy: { icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-900/30", label: "Economy" },
  patch: { icon: Radio, color: "text-cyan-400", bg: "bg-cyan-900/30", label: "Patch" },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  low: { color: "text-slate-400", bg: "bg-slate-800", label: "Low" },
  medium: { color: "text-blue-400", bg: "bg-blue-900/30", label: "Medium" },
  high: { color: "text-amber-400", bg: "bg-amber-900/30", label: "High" },
  critical: { color: "text-red-400", bg: "bg-red-900/30", label: "Critical" },
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCompose, setShowCompose] = useState(false);
  const [composeTitle, setComposeTitle] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeCategory, setComposeCategory] = useState<string>("announcement");

  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/news", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load news");
      return res.json();
    },
  });

  const { data: announcementData } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load announcements");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const composeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/news", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: composeTitle, content: composeContent, category: composeCategory }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "Article Published", description: "Your news article has been published." });
      setShowCompose(false);
      setComposeTitle("");
      setComposeContent("");
      setComposeCategory("announcement");
    },
    onError: (e: Error) => toast({ title: "Publish Failed", description: e.message, variant: "destructive" }),
  });

  const articles: NewsArticle[] = newsData?.articles || [];
  const announcements: Announcement[] = announcementData?.announcements || [];
  const pinnedArticles = articles.filter((a) => a.pinned);
  const filteredArticles = categoryFilter === "all" ? articles : articles.filter((a) => a.category === categoryFilter);
  const criticalAnnouncements = announcements.filter((a) => a.priority === "critical" || a.priority === "high");

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Live Ticker */}
        {criticalAnnouncements.length > 0 && (
          <div className="bg-gradient-to-r from-red-900/40 to-amber-900/40 border border-red-600/30 rounded-lg p-3 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <Bell className="w-4 h-4 text-red-400 animate-pulse" />
                <Badge className="bg-red-900/50 text-red-400 border-red-600/30 text-xs">LIVE</Badge>
              </div>
              <div className="overflow-hidden">
                <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap text-sm text-slate-300">
                  {criticalAnnouncements.map((a, i) => (
                    <span key={a.id} className="mx-8">
                      <AlertTriangle className="w-3 h-3 inline text-amber-400 mr-1" />
                      {a.message}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-blue-400" /> Galactic News Feed
            </h1>
            <p className="text-slate-400 mt-1">Stay updated with events, alerts, and empire intelligence</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCompose(!showCompose)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Send className="w-4 h-4 mr-2" /> Publish Article
            </Button>
          </div>
        </div>

        {/* Compose Form */}
        {showCompose && (
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Publish News Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Article title..." value={composeTitle} onChange={(e) => setComposeTitle(e.target.value)} className="bg-slate-800 border-slate-600 text-white" />
              <Textarea placeholder="Article content..." value={composeContent} onChange={(e) => setComposeContent(e.target.value)} className="bg-slate-800 border-slate-600 text-white min-h-[100px]" />
              <div className="flex gap-2">
                <Select value={composeCategory} onValueChange={setComposeCategory}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="war">War Alert</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => composeMutation.mutate()} disabled={!composeTitle || !composeContent || composeMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                  {composeMutation.isPending ? "Publishing..." : "Publish"}
                </Button>
                <Button variant="outline" onClick={() => setShowCompose(false)} className="border-slate-600 text-slate-400">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements Bar */}
        {announcements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.slice(0, 4).map((ann) => {
              const pc = PRIORITY_CONFIG[ann.priority] || PRIORITY_CONFIG.low;
              return (
                <Card key={ann.id} className={`bg-slate-900/80 border-slate-700 ${ann.priority === "critical" ? "border-red-600/50" : ""}`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Megaphone className={`w-4 h-4 shrink-0 ${pc.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{ann.message}</p>
                      <p className="text-xs text-slate-500">{formatTimeAgo(ann.createdAt)}</p>
                    </div>
                    <Badge className={`${pc.bg} ${pc.color} text-xs border-0`}>{pc.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("all")}
            className={categoryFilter === "all" ? "bg-blue-600" : "border-slate-600 text-slate-400"}
          >
            All ({articles.length})
          </Button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const count = articles.filter((a) => a.category === key).length;
            return (
              <Button
                key={key}
                variant={categoryFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(key)}
                className={categoryFilter === key ? "bg-blue-600" : "border-slate-600 text-slate-400"}
              >
                <Icon className="w-3 h-3 mr-1" /> {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Pinned Articles */}
        {pinnedArticles.length > 0 && categoryFilter === "all" && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Pin className="w-4 h-4" /> PINNED
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedArticles.map((article) => {
                const cat = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.announcement;
                const Icon = cat.icon;
                return (
                  <Card
                    key={article.id}
                    className={`bg-slate-900/80 border-slate-700 hover:border-blue-600/50 cursor-pointer transition-all ${cat.bg}`}
                    onClick={() => setSelectedArticle(selectedArticle?.id === article.id ? null : article)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${cat.bg} ${cat.color} text-xs border-0`}>
                          <Icon className="w-3 h-3 mr-1" /> {cat.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          <Pin className="w-3 h-3 mr-1" /> Pinned
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-base mt-2">{article.title}</CardTitle>
                      <CardDescription className="text-slate-400 text-xs">
                        {article.author} · {formatTimeAgo(article.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300 line-clamp-2">{article.content}</p>
                      {selectedArticle?.id === article.id && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="text-sm text-slate-300">{article.content}</p>
                          {article.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  <Tag className="w-2 h-2 mr-1" /> {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3">
            {categoryFilter === "all" ? "ALL ARTICLES" : `${CATEGORY_CONFIG[categoryFilter]?.label.toUpperCase()} ARTICLES`}
          </h2>
          <div className="space-y-3">
            {filteredArticles.map((article) => {
              const cat = CATEGORY_CONFIG[article.category] || CATEGORY_CONFIG.announcement;
              const Icon = cat.icon;
              const isSelected = selectedArticle?.id === article.id;
              return (
                <Card
                  key={article.id}
                  className={`bg-slate-900/80 border-slate-700 hover:border-slate-500 cursor-pointer transition-all ${isSelected ? "border-blue-500/50" : ""}`}
                  onClick={() => setSelectedArticle(isSelected ? null : article)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${cat.bg} shrink-0`}>
                        <Icon className={`w-5 h-5 ${cat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm">{article.title}</h3>
                          {article.pinned && <Pin className="w-3 h-3 text-amber-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{article.author} · {formatTimeAgo(article.createdAt)}</p>
                        <p className={`text-sm text-slate-300 ${isSelected ? "" : "line-clamp-2"}`}>{article.content}</p>
                        {isSelected && article.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                <Tag className="w-2 h-2 mr-1" /> {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge className={`${cat.bg} ${cat.color} text-xs border-0 shrink-0`}>{cat.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
