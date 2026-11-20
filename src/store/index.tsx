import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Entitlements, Usage } from '../logic/entitlements.ts';
import { newUsage } from '../logic/entitlements.ts';

export type Profile = { id: string; name: string; day: number; month: number; year: number };
export type Notif = { daily: boolean; tips: 'unset' | 'yes' | 'no'; time: string };
export type State = {
  loaded: boolean; onboarded: boolean; language: string; focus: string[];
  profiles: Profile[]; activeId: string | null;
  usage: Usage; ent: Entitlements; paidProfiles: string[]; unusedReports: number;
  notif: Notif; startDay: number; lastOpenDay: number; email: string;
  pendingOrders: Order[];
};
export type Order = { id: string; appUserId: string; email: string; language: string; profile: Profile; tips: boolean; createdAt: number };

const KEY = 'ank.state.v1';
const initial: State = {
  loaded: false, onboarded: false, language: 'en', focus: [], profiles: [], activeId: null,
  usage: newUsage(), ent: { reportBuyer: false, pro: false }, paidProfiles: [], unusedReports: 0,
  notif: { daily: false, tips: 'unset', time: '08:00' }, startDay: 0, lastOpenDay: 0, email: '', pendingOrders: [],
};

type Ctx = { s: State; set: (p: Partial<State> | ((s: State) => Partial<State>)) => void; active: Profile | null };
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const ready = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const saved = raw ? JSON.parse(raw) : {};
        setS({ ...initial, ...saved, loaded: true });
      } catch { setS({ ...initial, loaded: true }); }
      ready.current = true;
    })();
  }, []);
  useEffect(() => {
    if (!ready.current || !s.loaded) return;
    const { loaded, ...rest } = s;
    AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => {});
  }, [s]);
  const set = useCallback((p: Partial<State> | ((s: State) => Partial<State>)) =>
    setS((cur) => ({ ...cur, ...(typeof p === 'function' ? p(cur) : p) })), []);
  const active = useMemo(() => s.profiles.find((p) => p.id === s.activeId) ?? s.profiles[0] ?? null, [s.profiles, s.activeId]);
  return <StoreCtx.Provider value={{ s, set, active }}>{children}</StoreCtx.Provider>;
}
export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}
export const resetAll = () => AsyncStorage.removeItem(KEY);
