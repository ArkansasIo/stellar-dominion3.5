export interface ForumThread {
  id: string;
  title: string;
  category: string;
  authorId: string;
  authorName: string;
  content: string;
  replyCount: number;
  pinned: boolean;
  locked: boolean;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ForumThreadListResponse {
  success: boolean;
  threads: ForumThread[];
  count: number;
}

export async function fetchThreads(category?: string): Promise<ForumThread[]> {
  const url = category && category !== "all" ? `/api/forums/threads?category=${encodeURIComponent(category)}` : "/api/forums/threads";
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load threads");
  const data: ForumThreadListResponse = await res.json();
  return data.threads || [];
}

export async function fetchThread(threadId: string): Promise<ForumThread> {
  const res = await fetch(`/api/forums/threads/${threadId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load thread");
  const data = await res.json();
  return data.thread;
}

export async function createThread(title: string, category: string, content: string, username: string): Promise<ForumThread> {
  const res = await fetch("/api/forums/threads", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, category, content, username }),
  });
  if (!res.ok) throw new Error("Failed to create thread");
  const data = await res.json();
  return data.thread;
}

export async function postReply(threadId: string, content: string, username: string): Promise<ForumReply> {
  const res = await fetch(`/api/forums/threads/${threadId}/reply`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, username }),
  });
  if (!res.ok) throw new Error("Failed to post reply");
  const data = await res.json();
  return data.reply;
}

export async function resetForums(): Promise<void> {
  const res = await fetch("/api/forums/reset", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to reset forums");
}
