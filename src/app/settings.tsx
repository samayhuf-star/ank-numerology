import React, { useState } from 'react';
import { Linking, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, H1, P, Screen } from '../components/ui';
import { useStore, freshState } from '../store';
import { LANGUAGES } from '../i18n/languages';
import { coverage } from '../i18n';
import { requestPermission, cancelAllReminders } from '../services/notifications';
import { CONFIG } from '../config';
import { C, F } from '../theme';

export default function Settings() {
  const router = useRouter(); const { s, set } = useStore();
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function removeData() {
    setBusy(true); setError('');
    try {
      await cancelAllReminders();
      if (!(await set(freshState()))) { setError('The deletion has not been saved yet. Retry the save notice before closing Ank.'); return; }
      router.replace('/onboarding');
    } catch { setError('We couldn’t clear reminders. Your saved profiles have not been removed. Try again.'); }
    finally { setBusy(false); }
  }
  const setNotif = async (p: Partial<typeof s.notif>) => { if ((p.daily || p.tips === 'yes') && !(await requestPermission())) return; set({ notif: { ...s.notif, ...p } }); };
  return (
    <Screen><H1>Settings</H1>
      <Card><P muted={false}>Your report account</P><P>Verify your email to buy and restore reports. Free readings remain available without signing in.</P><Button title="Manage email sign-in" onPress={() => router.push('/account')} /></Card>
      <Card><View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text }}>Daily number</Text></View>
        <Switch accessibilityLabel="Daily number" value={s.notif.daily} onValueChange={(v) => setNotif({ daily: v })} trackColor={{ true: C.gold, false: C.border }} /></View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text }}>Name Report tips and offers</Text></View>
          <Switch accessibilityLabel="Name Report tips and offers" value={s.notif.tips === 'yes'} onValueChange={(v) => setNotif({ tips: v ? 'yes' : 'no' })} trackColor={{ true: C.gold, false: C.border }} /></View></Card>
      <Text style={{ fontFamily: F.sansSemi, color: C.muted }}>Language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{LANGUAGES.map((l) => <Chip key={l.code} label={l.native} on={s.language === l.code} onPress={() => set({ language: l.code })} />)}</View>
      {coverage(s.language) < 1 ? <Text style={{ color: '#8a8aa0', fontSize: 12, marginTop: 8 }}>App screens for this language are still being translated and show in English for now. You can still order your Name Report in it where available.</Text> : null}
      <P size={12}>Right-to-left languages apply fully after you restart the app.</P>
      <Button kind="ghost" title="Restore Purchases" onPress={() => router.push('/paywall')} />
      <Button kind="ghost" title="Privacy Policy" onPress={() => Linking.openURL(CONFIG.privacyUrl)} />
      <Button kind="ghost" title="Terms of Use" onPress={() => Linking.openURL(CONFIG.termsUrl)} />
      <Button kind="ghost" title="Contact support" onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} />
      {deleting ? <Card><P muted={false}>Delete all profiles and local history?</P><P>This also removes pending email orders from this phone and cancels its reminders. It does not cancel your App Store subscription or delete purchase records held by the report service.</P>
        {error ? <Text accessibilityRole="alert" style={{ color: C.warn }}>{error}</Text> : null}
        <Button title={busy ? 'Deleting…' : 'Yes, delete local data'} disabled={busy} onPress={removeData} />
        <Button kind="ghost" title="Keep my data" disabled={busy} onPress={() => setDeleting(false)} /></Card> : <Button kind="ghost" title="Delete my data on this device" onPress={() => setDeleting(true)} />}
    </Screen>
  );
}
