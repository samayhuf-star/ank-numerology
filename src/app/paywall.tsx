import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, H1, P, Screen } from '../components/ui';
import { useStore } from '../store';
import { purchasesReady, refreshEntitlements, restore, showProPaywall } from '../services/purchases';
import { C, F } from '../theme';

// Pro plans are shown with RevenueCat's own paywall. Restore Purchases is always available.
export default function Paywall() {
  const router = useRouter(); const { set } = useStore();
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  async function apply() { const e = await refreshEntitlements(); if (e) set((c) => ({ ent: { pro: e.pro, reportBuyer: e.reportBuyer || c.ent.reportBuyer } })); return e; }
  async function open() {
    setBusy(true); setMsg('');
    try { if (!purchasesReady()) { setMsg('Purchases are not set up in this build yet.'); return; } await showProPaywall(); const e = await apply(); if (e?.pro) router.back(); }
    catch (e: any) { setMsg(e?.message ?? 'Something went wrong. Please try again.'); } finally { setBusy(false); }
  }
  async function doRestore() {
    setBusy(true); setMsg('');
    try { const e = await restore(); if (e) set((c) => ({ ent: { pro: e.pro, reportBuyer: e.reportBuyer || c.ent.reportBuyer } })); setMsg(e?.pro || e?.reportBuyer ? 'Purchases restored.' : 'No purchases found to restore.'); }
    catch { setMsg('Could not restore. Please try again.'); } finally { setBusy(false); }
  }
  useEffect(() => { open(); /* eslint-disable-next-line */ }, []);
  return (
    <Screen><H1>Ank Pro</H1><P>Unlimited checks for every profile. Try 7 days free, then $1.99 a week. Cancel any time in your App Store settings.</P>
      {busy ? <ActivityIndicator color={C.gold} /> : null}
      {msg ? <Text accessibilityRole="alert" style={{ color: C.muted, fontFamily: F.sans }}>{msg}</Text> : null}
      <Button title="See Pro plans" onPress={open} /><Button kind="ghost" title="Restore Purchases" onPress={doRestore} /><Button kind="ghost" title="Close" onPress={() => router.back()} /></Screen>);
}
