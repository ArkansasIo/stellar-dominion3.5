export interface GameMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface MessageFilter {
  from?: string;
  to?: string;
  type?: string;
  read?: boolean;
}

export interface SendMessagePayload {
  to: string;
  subject: string;
  body: string;
  type?: string;
}

export async function fetchMessages(filter?: MessageFilter): Promise<GameMessage[]> {
  const params = new URLSearchParams();
  if (filter?.from) params.set("from", filter.from);
  if (filter?.to) params.set("to", filter.to);
  if (filter?.type) params.set("type", filter.type);
  if (filter?.read !== undefined) params.set("read", String(filter.read));
  const url = `/api/messages${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load messages");
  const data = await res.json();
  return data.messages || data || [];
}

export async function sendMessage(payload: SendMessagePayload): Promise<GameMessage> {
  const res = await fetch("/api/messages", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to send message");
  const data = await res.json();
  return data.message || data;
}

export async function markAsRead(messageId: string): Promise<void> {
  const res = await fetch(`/api/messages/${messageId}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark message as read");
}

export async function deleteMessage(messageId: string): Promise<void> {
  const res = await fetch(`/api/messages/${messageId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete message");
}
