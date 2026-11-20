import type { Order } from '../store';

/** Merge only the attempted orders; a background retry must not erase a newer checkout. */
export function mergePending(current: Order[], attempted: Order[], remaining: Order[]): Order[] {
  const originals = new Map(attempted.map(o => [o.id, o]));
  const left = new Map(remaining.map(o => [o.id, o]));
  return current.flatMap(o => originals.get(o.id) !== o ? [o] : left.has(o.id) ? [left.get(o.id)!] : []);
}
