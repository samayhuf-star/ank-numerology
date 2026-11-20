import { fetchRestorable } from './reportApi';
import { getAppUserId } from './purchases';
import { mergeRestored } from '../logic/restore';
import type { State } from '../store';

/** Rebuilds paid-report access from the server ledger (verified against RevenueCat).
 *  Returns a state patch, or null when the backend/purchases are unreachable so the caller can say so. */
export async function restoreReports(cur: Pick<State, 'profiles' | 'paidProfiles' | 'ent'>): Promise<(Partial<State> & { restoredCount: number }) | null> {
  const id = await getAppUserId();
  const r = id ? await fetchRestorable(id) : null;
  if (!r) return null;
  const m = mergeRestored(cur.profiles, cur.paidProfiles, r.profiles);
  const any = r.profiles.length > 0 || r.unused > 0;
  return {
    profiles: m.profiles, paidProfiles: m.paidProfiles, unusedReports: r.unused,
    ent: any ? { ...cur.ent, reportBuyer: true } : cur.ent,
    restoredCount: r.profiles.length,
  };
}
