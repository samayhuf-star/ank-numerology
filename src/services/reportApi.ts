import { CONFIG } from '../config';
import type { Order } from '../store';

/** Contract for the report backend (to be built): POST {apiUrl}/name-report
 *  body: Order. The server renders the Name Report PDF in `language` (per-script fonts) and emails it to `email`.
 *  Returns 202 when queued. The app keeps the order and retries until it gets a 2xx. */
export async function submitOrder(o: Order): Promise<boolean> {
  if (!CONFIG.apiUrl) return false;
  try {
    const r = await fetch(`${CONFIG.apiUrl}/name-report`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(o) });
    return r.ok;
  } catch { return false; }
}
export async function flush(orders: Order[]): Promise<Order[]> {
  const left: Order[] = [];
  for (const o of orders) if (!(await submitOrder(o))) left.push(o);
  return left;
}
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
