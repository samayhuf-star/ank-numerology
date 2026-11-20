import { CONFIG } from '../config.ts';
import type { Order } from '../store';
import type { RestoredProfile } from '../logic/restore';

export type SubmitResult = 'sent' | 'retry' | 'rejected';
function apiBase(): string {
  try {
    const url = new URL(CONFIG.apiUrl.trim());
    return url.protocol === 'https:' ? url.toString().replace(/\/$/, '') : '';
  } catch { return ''; }
}
async function request(path: string, body?: unknown): Promise<Response | null> {
  const base = apiBase(); if (!base) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const session = await import('./authSession').then(m => m.accessToken()).catch(() => null);
    return await fetch(`${base}${path}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'content-type': 'application/json', ...(session ? { Authorization: `Bearer ${session}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
  } catch { return null; } finally { clearTimeout(timer); }
}
/** Never begin a new checkout against an absent or unready email service. */
export async function reportServiceReady(appUserId: string): Promise<boolean> {
  const r = await request('/health');
  if (!r?.ok || !appUserId) return false;
  try { return (await r.json()).ready === true && (await fetchRestorable(appUserId)) !== null; } catch { return false; }
}
/** Accepted means the email provider accepted the message, not proof of inbox delivery. */
export async function submitOrder(o: Order): Promise<SubmitResult> {
  const r = await request('/name-report', o);
  if (!r) return 'retry';
  if (r.ok) {
    try { return (await r.json()).ok === true ? 'sent' : 'rejected'; } catch { return 'retry'; }
  }
  return r.status === 402 || r.status === 408 || r.status === 429 || r.status >= 500 ? 'retry' : 'rejected';
}
/** Paid deliveries never expire silently. Rejected orders remain visible for support/manual retry. */
export async function flush(orders: Order[]): Promise<Order[]> {
  const left: Order[] = [];
  for (const o of orders) {
    if (o.purchaseState === 'awaiting_purchase' || o.deliveryState === 'needs_attention') { left.push(o); continue; }
    const result = await submitOrder(o);
    if (result !== 'sent') left.push({ ...o, deliveryState: result === 'rejected' ? 'needs_attention' : 'queued' });
  }
  return left;
}
export type Restorable = { profiles: RestoredProfile[]; unused: number };
export async function fetchRestorable(appUserId: string): Promise<Restorable | null> {
  if (!appUserId) return null;
  const r = await request('/purchased-reports', { appUserId });
  if (!r?.ok) return null;
  try {
    const j = await r.json();
    if (j.ok !== true || !Array.isArray(j.profiles) || !Number.isSafeInteger(j.unused) || j.unused < 0) return null;
    return { profiles: j.profiles, unused: j.unused };
  } catch { return null; }
}
export const validEmail = (e: string) => e.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
