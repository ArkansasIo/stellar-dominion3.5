import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, Users, Shield } from "lucide-react";
import { Link } from "wouter";
import { useGame } from "@/lib/gameContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ForumReply = {
  id: string;
  authorName: string;
  content: string;
  createdAt: number;
};

type ForumThread = {
  id: string;
  title: string;
  category: string;
  authorName: string;
  content: string;
  createdAt: number;
  replies: ForumReply[];
};

export default function Forums() {
  const { isLoggedIn, username, isActualAdmin } = useGame();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ["/api/forums/threads"],
    queryFn: async () => {
      const response = await fetch("/api/forums/threads", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load forum threads");
      return response.json() as Promise<{ success: boolean; threads: ForumThread[] }>;
    },
    refetchInterval: 30000,
  });

  const createThreadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/forums/threads", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category: "General", username }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to create thread");
      return payload;
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forums/threads"] });
      toast({ title: "Thread posted", description: "Your forum thread is now live." });
    },
    onError: (error: Error) => {
      toast({ title: "Post failed", description: error.message, variant: "destructive" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ threadId, replyText }: { threadId: string; replyText: string }) => {
      const response = await fetch(`/api/forums/threads/${threadId}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText, username }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to post reply");
      return payload;
    },
    onSuccess: (_, variables) => {
      setReplyDrafts((prev) => ({ ...prev, [variables.threadId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["/api/forums/threads"] });
      toast({ title: "Reply posted", description: "Your response has been added." });
    },
    onError: (error: Error) => {
      toast({ title: "Reply failed", description: error.message, variant: "destructive" });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/forums/reset", {
        method: "POST",
        credentials: "include",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Forum reset failed");
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forums/threads"] });
      toast({ title: "Forum reset", description: "All threads and replies were cleared." });
    },
    onError: (error: Error) => {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    },
  });

  const forumThreads: ForumThread[] = data?.threads || [];

  const moderationRules = [
    "No harassment, hate speech, or targeted abuse.",
    "Post battle reports with complete context and evidence.",
    "Keep trade and recruitment in their dedicated channels.",
    "Report exploit discussions privately to admins.",
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-900" data-testid="button-back-home-forums">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold text-slate-900 mb-4">Forums</h1>
          <p className="text-xl text-slate-600 font-rajdhani max-w-2xl mx-auto">
            Community coordination hub using your main account session.
          </p>
        </div>

        {!isLoggedIn && (
          <Card className="bg-amber-50 border-amber-200 mb-6">
            <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-semibold text-amber-900">Forum login uses your main account</div>
                <div className="text-sm text-amber-800">Sign in once through game auth to post and reply.</div>
              </div>
              <Link href="/auth">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">Login with Main Account</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isLoggedIn && (
          <Card className="bg-white border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-slate-900">Create Thread</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Thread title"
                data-testid="input-forum-thread-title"
              />
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="What strategy, report, or request do you want to discuss?"
                rows={4}
                data-testid="input-forum-thread-content"
              />
              <div className="flex justify-between gap-3">
                <div className="text-xs text-slate-500">Posting as {username || "Commander"}</div>
                <div className="flex gap-2">
                  {isActualAdmin && (
                    <Button
                      variant="destructive"
                      onClick={() => resetMutation.mutate()}
                      disabled={resetMutation.isPending}
                      data-testid="button-forum-reset"
                    >
                      {resetMutation.isPending ? "Resetting..." : "Reset Forum"}
                    </Button>
                  )}
                  <Button
                    onClick={() => createThreadMutation.mutate()}
                    disabled={createThreadMutation.isPending || title.trim().length < 4 || content.trim().length < 8}
                    data-testid="button-forum-post-thread"
                  >
                    {createThreadMutation.isPending ? "Posting..." : "Post Thread"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Users className="w-5 h-5 text-blue-500" /> Global Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">Discuss strategy, progression, and patches with other commanders.</p>
              <Link href="/messages">
                <Button variant="outline" className="w-full">Open Messages</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Shield className="w-5 h-5 text-emerald-600" /> Alliance Boards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">Coordinate raids, diplomacy, and support operations with allied players.</p>
              <Link href="/alliance">
                <Button variant="outline" className="w-full">Open Alliance</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-slate-900">Featured Threads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {forumThreads.length === 0 && (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-600 text-sm">
                  No threads yet. Create the first forum topic.
                </div>
              )}
              {forumThreads.map((thread) => (
                <div key={thread.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{thread.title}</div>
                    <div className="text-xs text-slate-500">{thread.category}</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {thread.replies?.length || 0} replies • by {thread.authorName || "Commander"}
                  </div>
                  <div className="text-sm text-slate-700 mt-2">{thread.content}</div>

                  {thread.replies?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {thread.replies.slice(-3).map((reply) => (
                        <div key={reply.id} className="rounded border border-slate-200 bg-white p-2">
                          <div className="text-xs text-slate-500">{reply.authorName || "Commander"}</div>
                          <div className="text-sm text-slate-700">{reply.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={replyDrafts[thread.id] || ""}
                        onChange={(event) => setReplyDrafts((prev) => ({ ...prev, [thread.id]: event.target.value }))}
                        placeholder="Reply to this thread"
                        data-testid={`input-forum-reply-${thread.id}`}
                      />
                      <Button
                        variant="outline"
                        onClick={() => replyMutation.mutate({ threadId: thread.id, replyText: (replyDrafts[thread.id] || "").trim() })}
                        disabled={replyMutation.isPending || (replyDrafts[thread.id] || "").trim().length < 2}
                        data-testid={`button-forum-reply-${thread.id}`}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Forum Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {moderationRules.map((rule) => (
                <div key={rule} className="text-sm text-slate-600">• {rule}</div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
