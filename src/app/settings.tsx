import React from 'react';
import { Linking, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, H1, P, Screen } from '../components/ui';
import { useStore, resetAll } from '../store';
import { LANGUAGES } from '../i18n/languages';
import { requestPermission } from '../services/notifications';
import { openCustomerCenter } from '../services/purchases';
import { CONFIG } from '../config';
import { C, F } from '../theme';

export default function Settings() {
  const router = useRouter(); const { s, set } = useStore();
  const setNotif = async (p: Partial<typeof s.notif>) => { if ((p.daily || p.tips === 'yes') && !(await requestPermission())) return; set({ notif: { ...s.notif, ...p } }); };
  return (
    <Screen><H1>Settings</H1>
      <Card><View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text }}>Daily number</Text></View>
        <Switch accessibilityLabel="Daily number" value={s.notif.daily} onValueChange={(v) => setNotif({ daily: v })} trackColor={{ true: C.gold, false: C.border }} /></View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text }}>Name Report tips and offers</Text></View>
          <Switch accessibilityLabel="Name Report tips and offers" value={s.notif.tips === 'yes'} onValueChange={(v) => setNotif({ tips: v ? 'yes' : 'no' })} trackColor={{ true: C.gold, false: C.border }} /></View></Card>
      <Text style={{ fontFamily: F.sansSemi, color: C.muted }}>Language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{LANGUAGES.map((l) => <Chip key={l.code} label={l.native} on={s.language === l.code} onPress={() => set({ language: l.code })} />)}</View>
      <P size={12}>Right-to-left languages apply fully after you restart the app.</P>
      {s.ent.pro ? <Button kind="ghost" title="Manage subscription" onPress={() => { void openCustomerCenter(); }} /> : null}
      <Button kind="ghost" title="Restore Purchases" onPress={() => router.push('/paywall')} />
      <Button kind="ghost" title="Privacy Policy" onPress={() => Linking.openURL(CONFIG.privacyUrl)} />
      <Button kind="ghost" title="Terms of Use" onPress={() => Linking.openURL(CONFIG.termsUrl)} />
      <Button kind="ghost" title="Contact support" onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} />
      <Button kind="ghost" title="Delete my data on this device" onPress={async () => { await resetAll(); set({ onboarded: false, profiles: [], activeId: null, paidProfiles: [], email: '', pendingOrders: [] }); router.replace('/onboarding'); }} />
    </Screen>
  );
}
