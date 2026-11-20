import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Linking, Pressable, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import type { Entitlements, Usage } from '../logic/entitlements.ts';
import { newUsage } from '../logic/entitlements.ts';
import { createSaveQueue } from '../logic/persistence';
import { C, F } from '../theme';
import { CONFIG } from '../config';

export type Profile = { id: string; name: string; day: number; month: number; year: number };
export type Notif = { daily: boolean; tips: 'unset' | 'yes' | 'no'; time: string };
export type State = {
  loaded: boolean; onboarded: boolean; language: string; focus: string[];
  profiles: Profile[]; activeId: string | null;
  usage: Usage; ent: Entitlements; paidProfiles: string[]; unusedReports: number;
  notif: Notif; startDay: number; lastOpenDay: number; email: string;
  pendingOrders: Order[];
  accountId?: string; // Pins saved report access to its verified account without changing old saved keys.
};
export type Order = {
  id: string; appUserId: string; email: string; language: string; profile: Profile; tips: boolean; createdAt: number;
  purchaseState?: 'awaiting_purchase' | 'confirmed';
  deliveryState?: 'queued' | 'needs_attention';
  ownerId?: string;
};
const KEY = 'ank.state.v1';
const initial: State = {
  loaded: false, onboarded: false, language: 'en', focus: [], profiles: [], activeId: null,
  usage: newUsage(), ent: { reportBuyer: false, pro: false }, paidProfiles: [], unusedReports: 0,
  notif: { daily: false, tips: 'unset', time: '08:00' }, startDay: 0, lastOpenDay: 0, email: '', pendingOrders: [],
};
type Ctx = { s: State; set: (p: Partial<State> | ((s: State) => Partial<State>)) => Promise<boolean>; active: Profile | null };
const StoreCtx = createContext<Ctx | null>(null);

function decode(raw: string | null): State {
  if (raw === null) return { ...initial, loaded: true };
  const saved = JSON.parse(raw);
  if (!saved || typeof saved !== 'object' || Array.isArray(saved) || !Array.isArray(saved.profiles)) throw new Error('Invalid saved history');
  if (!saved.profiles.every((p: Profile) => p && typeof p.id === 'string' && typeof p.name === 'string' && Number.isInteger(p.day) && Number.isInteger(p.month) && Number.isInteger(p.year))) throw new Error('Invalid saved profile');
  if (saved.pendingOrders !== undefined && (!Array.isArray(saved.pendingOrders) || !saved.pendingOrders.every((o: Order) => o && typeof o.id === 'string' && typeof o.email === 'string' && typeof o.appUserId === 'string' && o.profile && typeof o.profile.id === 'string' && typeof o.profile.name === 'string' && Number.isFinite(o.createdAt)))) throw new Error('Invalid orders');
  return { ...initial, ...saved, loaded: true, ent: { ...initial.ent, ...saved.ent }, notif: { ...initial.notif, ...saved.notif } };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const current = useRef(initial);
  const writable = useRef(false);
  const [save] = useState(() => createSaveQueue<State>(async value => {
    const { loaded: _loaded, ...rest } = value;
    await AsyncStorage.setItem(KEY, JSON.stringify(rest));
  }, setSaveError));
  const load = useCallback(async () => {
    writable.current = false;
    try {
      const value = decode(await AsyncStorage.getItem(KEY));
      current.current = value; setS(value); setLoadError(false); writable.current = true;
    } catch {
      setLoadError(true); await SplashScreen.hideAsync().catch(() => {});
    }
  }, []);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  const set = useCallback((p: Partial<State> | ((state: State) => Partial<State>)) => {
    if (!writable.current) return Promise.resolve(false);
    const next = { ...current.current, ...(typeof p === 'function' ? p(current.current) : p) };
    current.current = next; setS(next);
    return save(next);
  }, [save]);
  const active = useMemo(() => s.profiles.find(p => p.id === s.activeId) ?? s.profiles[0] ?? null, [s.profiles, s.activeId]);
  if (loadError) return <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', padding: 28, gap: 16 }}>
    <Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 24 }}>Your saved profiles are protected</Text>
    <Text style={{ fontFamily: F.sans, color: C.muted }}>We couldn’t load your history. Nothing has been replaced. Please retry before reinstalling.</Text>
    <Pressable accessibilityRole="button" onPress={() => { void load(); }} style={{ paddingVertical: 14 }}><Text style={{ color: C.gold }}>Try again</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={() => { void Linking.openURL(`mailto:${CONFIG.supportEmail}`); }} style={{ paddingVertical: 14 }}><Text style={{ color: C.gold }}>Contact support</Text></Pressable>
  </View>;
  return <StoreCtx.Provider value={{ s, set, active }}>
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {saveError && <View style={{ padding: 18, paddingTop: 56, borderBottomColor: C.warn, borderBottomWidth: 1 }}>
        <Text accessibilityRole="alert" style={{ fontFamily: F.sans, color: C.warn }}>Changes aren’t saved yet. Keep Ank open and retry.</Text>
        <Pressable accessibilityRole="button" onPress={() => { void save(current.current); }} style={{ paddingVertical: 12 }}><Text style={{ color: C.gold }}>Retry save</Text></Pressable>
      </View>}
      {!s.loaded ? <ActivityIndicator color={C.gold} /> : children}
    </View>
  </StoreCtx.Provider>;
}
export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}
export const freshState = (): State => ({ ...initial, usage: newUsage(), loaded: true });
