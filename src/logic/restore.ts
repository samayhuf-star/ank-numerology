// Rebuilds locally-saved report access from what the server's purchase ledger says was bought.
// Local profile ids do not survive a reinstall, so profiles are matched on name + date of birth.
export type RestoredProfile = { fp: string; name: string; day: number; month: number; year: number };
type P = { id: string; name: string; day: number; month: number; year: number };

const norm = (s: string) => String(s || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const same = (a: P, r: RestoredProfile) => norm(a.name) === norm(r.name) && a.day === r.day && a.month === r.month && a.year === r.year;

/** Marks every restored profile as paid, adding any profile that is missing on this device. Pure and idempotent. */
export function mergeRestored<T extends P>(profiles: T[], paidProfiles: string[], restored: RestoredProfile[]): { profiles: T[]; paidProfiles: string[] } {
  const out = [...profiles];
  const paid = new Set(paidProfiles);
  for (const r of restored) {
    const hit = out.find((p) => same(p, r));
    if (hit) { paid.add(hit.id); continue; }
    const added = { id: `r${r.fp}`, name: r.name, day: r.day, month: r.month, year: r.year } as T;
    out.push(added);
    paid.add(added.id);
  }
  return { profiles: out, paidProfiles: [...paid] };
}
