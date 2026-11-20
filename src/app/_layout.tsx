import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useFonts, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { I18nManager } from 'react-native';
import { StoreProvider, useStore } from '../store';
import { initPurchases, refreshEntitlements } from '../services/purchases';
import { restoreReports } from '../services/restoreReports';
import { reschedule } from '../services/notifications';
import { flush } from '../services/reportApi';
import { daysIndex } from '../engine/cycles';
import { isRtl } from '../i18n/languages';
import { C } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Boot() {
  const { s, set, active } = useStore();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Fraunces_700Bold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });

  useEffect(() => { if (fontsLoaded && s.loaded) SplashScreen.hideAsync().catch(() => {}); }, [fontsLoaded, s.loaded]);

  // Right-to-left languages (Urdu, Sindhi). Takes effect on next launch on native.
  useEffect(() => {
    const rtl = isRtl(s.language);
    if (s.loaded && I18nManager.isRTL !== rtl) { I18nManager.allowRTL(rtl); I18nManager.forceRTL(rtl); }
  }, [s.loaded, s.language]);

  useEffect(() => {
    if (!s.loaded) return;
    const today = daysIndex(new Date());
    set((cur) => ({ lastOpenDay: today, startDay: cur.startDay || today }));
    if (initPurchases()) refreshEntitlements().then(async (e) => {
      if (!e) return;
      set((cur) => ({ ent: { pro: e.pro, reportBuyer: e.reportBuyer || cur.ent.reportBuyer } }));
      // Reinstall / new phone: the store says they bought a report but this device has no paid profiles, so rebuild them from the server ledger.
      if (e.reportBuyer && s.paidProfiles.length === 0) {
        const rep = await restoreReports({ profiles: s.profiles, paidProfiles: s.paidProfiles, ent: { pro: e.pro, reportBuyer: true } });
        if (rep) { const { restoredCount, ...patch } = rep; set(patch); }
      }
    }).catch(() => {});
    if (s.pendingOrders.length) flush(s.pendingOrders).then((left) => set({ pendingOrders: left })).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.loaded]);

  // Keep the rolling notification schedule fresh whenever relevant settings change.
  useEffect(() => {
    if (!s.loaded || !s.onboarded) return;
    reschedule(s, active).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.loaded, s.onboarded, s.notif, s.ent.reportBuyer, s.paidProfiles.length, active?.id]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const screen = (r.notification.request.content.data as any)?.screen;
      if (screen === 'name-report') router.push('/name-report');
    });
    return () => sub.remove();
  }, [router]);

  if (!fontsLoaded || !s.loaded) return null;
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} />
    </>
  );
}
export default function Root() { return <StoreProvider><Boot /></StoreProvider>; }
