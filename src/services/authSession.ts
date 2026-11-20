import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AUTH_KEY, AUTH_URL } from './authConfig';

export type Account = { id: string; email: string };
type Session = { access_token: string; refresh_token: string; expires_at: number; user: Account };
const KEY = 'ank.email-session.v1';
const OPTIONS = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY };
let current: Session | null = null;
let ready: Promise<void> | null = null;
let refreshing: Promise<Session | null> | null = null;
let generation = 0;
let storageTail: Promise<void> = Promise.resolve();
function stored(fn: () => Promise<void>): Promise<void> {
  const run = storageTail.then(fn); storageTail = run.catch(() => {}); return run;
}
const listeners = new Set<() => void>();
export const subscribeAuth = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const currentAccount = () => current?.user ?? null;
const notify = () => { for (const fn of listeners) fn(); };

async function call(path: string, body?: unknown, token?: string) {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    return await fetch(`${AUTH_URL}${path}`, { method: body === undefined ? 'GET' : 'POST', headers: { apikey: AUTH_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
  } catch { throw new Error('Check your connection and try again.'); } finally { clearTimeout(timer); }
}
function parseSession(value: any): Session {
  if (!value?.access_token || !value?.refresh_token || typeof value.user?.id !== 'string' || typeof value.user?.email !== 'string' || !value.user.email_confirmed_at) throw new Error('Email verification did not finish. Request a new code.');
  const expiry = value.expires_at ?? Math.floor(Date.now() / 1000) + value.expires_in;
  if (!Number.isFinite(expiry)) throw new Error('Sign-in session is invalid. Please sign in again.');
  return { access_token: value.access_token, refresh_token: value.refresh_token, expires_at: expiry, user: { id: value.user.id, email: value.user.email } };
}
async function save(session: Session) {
  const expected = generation;
  await stored(async () => {
    if (expected !== generation) return;
    if (Platform.OS !== 'web') await SecureStore.setItemAsync(KEY, JSON.stringify(session), OPTIONS);
    if (expected === generation) { current = session; notify(); }
  });
}
export function loadAuth(): Promise<void> {
  if (!ready) ready = (async () => {
    if (Platform.OS === 'web') return;
    const raw = await SecureStore.getItemAsync(KEY, OPTIONS);
    if (!raw) return;
    const value = JSON.parse(raw);
    if (typeof value.access_token !== 'string' || typeof value.refresh_token !== 'string' || !Number.isFinite(value.expires_at) || typeof value.user?.id !== 'string' || typeof value.user?.email !== 'string') throw new Error('Your saved sign-in cannot be read. Sign in again; your profiles are safe.');
    current = value; notify();
  })();
  return ready;
}
export async function accessToken(): Promise<string | null> {
  await loadAuth();
  if (!current) return null;
  if (current.expires_at > Date.now() / 1000 + 60) return current.access_token;
  if (!refreshing) {
    const expected = generation;
    const refreshToken = current.refresh_token;
    refreshing = (async () => {
    const r = await call('/auth/v1/token?grant_type=refresh_token', { refresh_token: refreshToken });
    if (expected !== generation) return null;
    if (!r.ok) {
      if (r.status === 400 || r.status === 401) { await clearAuth(); return null; }
      throw new Error('Sign-in could not be refreshed. Please try again.');
    }
    const session = parseSession(await r.json());
    if (expected !== generation) return null;
    await save(session); return session;
  })().finally(() => { refreshing = null; });
  }
  return (await refreshing)?.access_token ?? null;
}
export async function requestEmailCode(email: string): Promise<void> {
  const r = await call('/functions/v1/ank-email-code', { email: email.trim().toLowerCase() });
  if (r.status === 429) throw new Error('Please wait before requesting another code. Try again in a minute.');
  if (!r.ok) throw new Error('Email sign-in is unavailable right now. You have not been charged. Try again later.');
}
export async function verifyEmailCode(email: string, code: string, allowedAccount?: string): Promise<Account> {
  const r = await call('/auth/v1/verify', { email: email.trim().toLowerCase(), token: code.trim(), type: 'email' });
  if (!r.ok) throw new Error(r.status === 429 ? 'Too many attempts. Wait a moment before trying again.' : 'This code is incorrect or expired. Check the newest email or request another code.');
  const session = parseSession(await r.json());
  if (allowedAccount && session.user.id !== allowedAccount) {
    await call('/auth/v1/logout?scope=local', {}, session.access_token);
    throw new Error('These saved reports belong to another account. Sign in with that email. To use a different account, first delete local data in Settings.');
  }
  generation += 1;
  await save(session); ready = Promise.resolve(); return session.user;
}
async function clearAuth() {
  generation += 1;
  current = null; ready = Promise.resolve(); notify();
  await stored(async () => { if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(KEY, OPTIONS); });
}
export async function signOutAuth(): Promise<void> {
  const token = await accessToken();
  if (token) {
    const r = await call('/auth/v1/logout?scope=local', {}, token);
    if (!r.ok && r.status !== 401) throw new Error('Sign-out could not finish. Please try again.');
  }
  await clearAuth();
}
export async function deleteAuthAccount(): Promise<void> {
  const token = await accessToken(); if (!token) throw new Error('Sign in before deleting your account.');
  const r = await call('/functions/v1/ank-delete-account', {}, token);
  if (!r.ok) throw new Error('Your account could not be deleted. Nothing was removed from this phone. Try again.');
  await clearAuth();
}
