// Check limits. Pure functions so every rule can be tested.
// Free: 1 check, ever. Name Report buyer: 5 checks a day, for life. Pro: unlimited.
export const FREE_CHECKS = 1;
export const BUYER_DAILY_CHECKS = 5;

export type Entitlements = { reportBuyer: boolean; pro: boolean };
export type Usage = { freeUsed: number; day: number; today: number };
export type CheckResult =
  | { allowed: true; plan: 'pro' | 'buyer' | 'free'; remaining: number | null }
  | { allowed: false; reason: 'free_used' | 'daily_limit'; resetsOnDay?: number };

export const newUsage = (): Usage => ({ freeUsed: 0, day: 0, today: 0 });

function rolled(u: Usage, day: number): Usage { return u.day === day ? u : { ...u, day, today: 0 }; }

export function canCheck(e: Entitlements, usage: Usage, day: number): CheckResult {
  const u = rolled(usage, day);
  if (e.pro) return { allowed: true, plan: 'pro', remaining: null };
  if (e.reportBuyer) {
    return u.today < BUYER_DAILY_CHECKS
      ? { allowed: true, plan: 'buyer', remaining: BUYER_DAILY_CHECKS - u.today }
      : { allowed: false, reason: 'daily_limit', resetsOnDay: day + 1 };
  }
  return u.freeUsed < FREE_CHECKS
    ? { allowed: true, plan: 'free', remaining: FREE_CHECKS - u.freeUsed }
    : { allowed: false, reason: 'free_used' };
}

/** Returns the new usage after a check, or the same usage if the check is not allowed. */
export function recordCheck(e: Entitlements, usage: Usage, day: number): Usage {
  const r = canCheck(e, usage, day);
  const u = rolled(usage, day);
  if (!r.allowed) return u;
  if (r.plan === 'pro') return u;
  if (r.plan === 'buyer') return { ...u, today: u.today + 1 };
  return { ...u, freeUsed: u.freeUsed + 1 };
}

/** The Name Report is bought per profile. Pro does not include it (assumption, confirm with Samay). */
export const canOpenNameReport = (paidProfileIds: string[], profileId: string) => paidProfileIds.includes(profileId);

/** The 29-page Full Future Report opens with a Pro subscription (any profile) or the one-time purchase (that profile). */
export const canOpenFullReport = (e: Entitlements, paidProfileIds: string[], profileId: string) =>
  e.pro || paidProfileIds.includes(profileId);
