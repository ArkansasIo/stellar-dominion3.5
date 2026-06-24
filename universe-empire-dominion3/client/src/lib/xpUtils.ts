import { emitXpGain } from "@/components/XpWidget";
import type { XpSource } from "@shared/config/xpConfig";

async function apiRequest(method: string, url: string, data?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const storedUser = localStorage.getItem('stellar_username');
  const storedPass = localStorage.getItem('stellar_password');
  if (storedUser && storedPass) {
    headers['Authorization'] = `Basic ${btoa(`${storedUser}:${storedPass}`)}`;
  }
  const res = await fetch(url, { method, headers, body: data ? JSON.stringify(data) : undefined, credentials: 'include' });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

export async function awardXp(amount: number, source: XpSource, options?: {
  category?: string; page?: string; subPage?: string; action?: string; label?: string
}) {
  try {
    const result = await apiRequest('POST', '/api/player/xp/award', { amount, source, ...options });
    if (result?.level) {
      emitXpGain(amount, source);
    }
    return result;
  } catch {
    return null;
  }
}
