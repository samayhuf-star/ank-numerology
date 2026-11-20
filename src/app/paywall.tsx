import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, H1, P, Screen } from '../components/ui';
import { useStore } from '../store';
import { useAuth } from '../services/auth';
import { restoreReports } from '../services/restoreReports';
import { purchasesReady, refreshEntitlements, restore, showProPaywall } from '../services/purchases';
import { C, F } from '../theme';

// Pro plans are shown with RevenueCat's own paywall. Restore Purchases is always available.
export default function Paywall() {
  const router = useRouter(); const { s, set } = useStore();
  const auth = useAuth();
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  async function apply() { const e = await refreshEntitlements(); if (e) set((c) => ({ ent: { pro: e.pro, reportBuyer: e.reportBuyer || c.ent.reportBuyer } })); return e; }
  async function open() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMsg('');
    try { if (!purchasesReady()) { setMsg('Purchases are not set up in this build yet.'); return; } await showProPaywall(); const e = await apply(); if (e?.pro) router.back(); }
    catch (e: any) { setMsg(e?.message ?? 'Something went wrong. Please try again.'); } finally { inFlight.current = false; setBusy(false); }
  }
  async function doRestore() {
    if (!auth.account) { router.push('/account'); return; }
    if (!auth.billingReady) { setMsg('Connect your verified purchase account first. Open Manage account and retry.'); return; }
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMsg('');
    try {
      const e = await restore();
      if (e) set((c) => ({ ent: { pro: e.pro, reportBuyer: e.reportBuyer || c.ent.reportBuyer } }));
      // Report access is a list of paid profiles, not a store flag, so rebuild it from the server's purchase ledger.
      const rep = await restoreReports(s);
      if (rep) { const { restoredCount, ...patch } = rep; set(patch); }
      const found = !!(e?.pro || e?.reportBuyer || rep?.restoredCount || rep?.unusedReports);
      const parts = [e?.pro ? 'Ank Pro restored.' : '', rep?.restoredCount ? `${rep.restoredCount} Complete Report${rep.restoredCount > 1 ? 's' : ''} unlocked again.` : '', rep?.unusedReports ? 'You have a Complete Report you have not used yet. Open Name Report to get it.' : '', !rep && e?.reportBuyer ? 'Could not reach our server to unlock your reports. Check your connection and restore again.' : ''].filter(Boolean);
      setMsg(parts.length ? parts.join(' ') : found ? 'Purchases restored.' : 'No purchases found to restore.');
    } catch { setMsg('Could not restore. Please try again.'); } finally { inFlight.current = false; setBusy(false); }
  }
  // Do not open a purchase sheet automatically when the user came here to restore.
  return (
    <Screen><H1>Ank Pro</H1><P>Unlimited checks for every profile. See plans for the current App Store price, billing period and any trial you’re eligible for before confirming. Cancel in your App Store subscription settings.</P>
      {busy ? <ActivityIndicator color={C.gold} /> : null}
      {msg ? <Text accessibilityRole="alert" style={{ color: C.muted, fontFamily: F.sans }}>{msg}</Text> : null}
      <Button title="See Pro plans" disabled={busy} onPress={open} /><Button kind="ghost" title="Restore Purchases" disabled={busy} onPress={doRestore} /><Button kind="ghost" title={auth.account ? 'Manage account' : 'Sign in to restore reports'} disabled={busy} onPress={() => router.push('/account')} /><Button kind="ghost" title="Close" disabled={busy} onPress={() => router.back()} /></Screen>);
}
