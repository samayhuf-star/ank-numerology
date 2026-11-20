import { CONFIG } from '../config';
import type { Order } from '../store';
import type { RestoredProfile } from '../logic/restore';

export type SubmitResult = 'sent' | 'retry' | 'rejected';
const MAX_ORDER_AGE_MS = 14 * 24 * 3600 * 1000;

/** Contract: POST {apiUrl}/name-report, body: Order (carries appUserId so the server can verify the purchase with RevenueCat).
 *  The server renders the report PDF in `language` and emails it to `email`.
 *  'sent' = 2xx. 'retry' = network/5xx/429/402 (purchase may not have reached RevenueCat yet), the app keeps the order.
 *  'rejected' = any other 4xx, retrying cannot help, so the order is dropped. */
export async function submitOrder(o: Order): Promise<SubmitResult> {
  if (!CONFIG.apiUrl) return 'retry';
  try {
    const r = await fetch(`${CONFIG.apiUrl}/name-report`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(o) });
    if (r.ok) return 'sent';
    return r.status === 402 || r.status === 408 || r.status === 429 || r.status >= 500 ? 'retry' : 'rejected';
  } catch { return 'retry'; }
}
export async function flush(orders: Order[]): Promise<Order[]> {
  const left: Order[] = [];
  for (const o of orders) {
    if (Date.now() - o.createdAt > MAX_ORDER_AGE_MS) continue;
    if ((await submitOrder(o)) === 'retry') left.push(o);
  }
  return left;
}

export type Restorable = { profiles: RestoredProfile[]; unused: number };
/** Asks the server which reports this purchaser has bought (verified against RevenueCat). Null when the backend cannot be reached. */
export async function fetchRestorable(appUserId: string): Promise<Restorable | null> {
  if (!CONFIG.apiUrl || !appUserId) return null;
  try {
    const r = await fetch(`${CONFIG.apiUrl}/purchased-reports`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ appUserId }) });
    if (!r.ok) return null;
    const j = await r.json();
    return { profiles: Array.isArray(j.profiles) ? j.profiles : [], unused: Number(j.unused) || 0 };
  } catch { return null; }
}
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
