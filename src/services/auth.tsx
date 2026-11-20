import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useStore } from '../store';
import { Account, accessToken, currentAccount, deleteAuthAccount, loadAuth, requestEmailCode, signOutAuth, subscribeAuth, verifyEmailCode } from './authSession';
import { connectPurchaseAccount, disconnectPurchaseAccount, getAppUserId, initPurchases } from './purchases';

type Auth = { account: Account | null; loaded: boolean; billingReady: boolean; error: string; request: (email: string) => Promise<void>; verify: (email: string, code: string) => Promise<void>; retry: () => Promise<void>; signOut: () => Promise<void>; deleteAccount: () => Promise<void> };
const Context = createContext<Auth | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { s, set } = useStore();
  const [account, setAccount] = useState<Account | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [billingReady, setBillingReady] = useState(false);
  const [error, setError] = useState('');
  const snapshot = useRef(s);
  useEffect(() => { snapshot.current = s; }, [s]);
  const sync = useCallback(async () => {
    setBillingReady(false); setError('');
    try {
      initPurchases();
      await loadAuth(); await accessToken();
      const user = currentAccount(); setAccount(user);
      if (!user) return;
      if (snapshot.current.accountId && snapshot.current.accountId !== user.id) throw new Error('Sign in with the account that owns these saved reports.');
      const result = await connectPurchaseAccount(user.id);
      if (currentAccount()?.id !== user.id) return;
      const saved = await set(cur => ({ accountId: user.id, ent: { pro: result.ent.pro, reportBuyer: result.ent.reportBuyer || cur.ent.reportBuyer }, pendingOrders: cur.pendingOrders.map(o => !o.ownerId && o.appUserId === result.previous ? { ...o, ownerId: user.id } : o) }));
      if (!saved) throw new Error('Your account is verified, but the report link has not been saved. Retry the save notice, then try again here.');
      if (currentAccount()?.id === user.id) setBillingReady(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Sign-in could not be restored. Please try again.'); }
    finally { setLoaded(true); }
  }, [set]);
  useEffect(() => {
    const unsub = subscribeAuth(() => { setAccount(currentAccount()); setBillingReady(false); });
    void Promise.resolve().then(sync);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') void sync(); });
    return () => { unsub(); sub.remove(); };
  }, [sync]);
  async function verify(email: string, code: string) {
    await verifyEmailCode(email, code, snapshot.current.accountId);
    await sync();
  }
  async function signOut() {
    await signOutAuth(); setBillingReady(false);
    await disconnectPurchaseAccount();
    await set(cur => ({ ent: { pro: false, reportBuyer: cur.ent.reportBuyer }, unusedReports: 0 }));
  }
  async function deleteAccount() {
    await deleteAuthAccount(); setBillingReady(false);
    await disconnectPurchaseAccount();
  }
  const value: Auth = { account, loaded, billingReady, error, request: requestEmailCode, verify, retry: sync, signOut, deleteAccount };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth() {
  const value = useContext(Context); if (!value) throw new Error('AuthProvider missing'); return value;
}
export async function verifiedPurchaseIdentity(): Promise<string | null> {
  const token = await accessToken(); const user = currentAccount();
  return token && user && await getAppUserId() === user.id ? user.id : null;
}
