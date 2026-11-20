import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, Field, H1, P, Screen } from '../components/ui';
import { useAuth } from '../services/auth';
import { freshState, useStore } from '../store';
import { validEmail } from '../services/reportApi';
import { cancelAllReminders } from '../services/notifications';
import { C, F } from '../theme';
import { CONFIG } from '../config';

export default function AccountScreen() {
  const auth = useAuth(); const { s, set } = useStore(); const router = useRouter();
  const [email, setEmail] = useState(s.email); const [sentTo, setSentTo] = useState(''); const [code, setCode] = useState('');
  const [waitUntil, setWaitUntil] = useState(0); const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false); const lock = useRef(false);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const cooldown = Math.max(0, Math.ceil((waitUntil - now) / 1000));
  async function action(fn: () => Promise<void>) {
    if (lock.current) return; lock.current = true; setBusy(true); setError('');
    try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : 'Please try again.'); }
    finally { lock.current = false; setBusy(false); }
  }
  const send = () => action(async () => {
    await auth.request(sentTo || email); setSentTo((sentTo || email).trim().toLowerCase()); setCode(''); setWaitUntil(Date.now() + 60_000);
  });
  const verify = () => action(async () => { await auth.verify(sentTo, code); setCode(''); });
  const remove = () => action(async () => {
    await cancelAllReminders(); await auth.deleteAccount();
    if (!(await set(freshState()))) throw new Error('Your online account was deleted. Keep Ank open and use Retry save to finish clearing local data.');
    router.replace('/onboarding');
  });
  const alert = error || auth.error;
  return <Screen>
    <Eyebrow>Your Ank account</Eyebrow><H1>{auth.account ? 'Your reports, protected' : sentTo ? 'Check your email' : 'Keep your reports with you'}</H1>
    <Card gold><P muted={false}>{auth.account ? auth.account.email : 'One email. One code. No password.'}</P>
      <P>{auth.account ? 'Use this same verified email to restore reports on another phone. Your saved profiles stay on this device.' : 'Verify your email before purchasing or restoring a report. Free readings do not require sign-in.'}</P></Card>
    {busy || !auth.loaded ? <ActivityIndicator color={C.gold} accessibilityLabel="Signing in" /> : null}
    {alert ? <Text accessibilityRole="alert" style={{ color: C.warn, fontFamily: F.sans }}>{alert}</Text> : null}
    {auth.account ? <>
      <P>{auth.billingReady ? '✓ Email verified · purchase account connected' : 'Email verified. Your purchase account still needs to connect.'}</P>
      {!auth.billingReady && <Button title="Retry account connection" disabled={busy} onPress={() => action(auth.retry)} />}
      <Button title="Continue" disabled={busy} onPress={() => router.back()} />
      <Button kind="ghost" title="Sign out" disabled={busy} onPress={() => action(auth.signOut)} />
      <P size={12}>Signing out pauses report delivery. It does not erase local profiles or cancel subscriptions.</P>
      {deleting ? <Card><P muted={false}>Permanently delete your account?</P><P>This deletes email sign-in and all profiles and pending orders on this phone. You may lose account-based restoration. App Store subscriptions are not cancelled; purchase and delivery records may be retained for legal or support obligations.</P>
        <Button title="Delete account and local data" disabled={busy} onPress={remove} /><Button kind="ghost" title="Keep my account" disabled={busy} onPress={() => setDeleting(false)} /></Card> : <Button kind="ghost" title="Delete my account" disabled={busy} onPress={() => setDeleting(true)} />}
    </> : sentTo ? <>
      <P>{`Enter the newest code sent to ${sentTo}. Check spam if it has not arrived. Never share it.`}</P>
      <Field label="Email verification code" value={code} onChangeText={text => setCode(text.replace(/\D/g, '').slice(0, 10))} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" autoCorrect={false} maxLength={10} editable={!busy} />
      <Button title="Verify email" disabled={busy || code.length < 6} onPress={verify} />
      <Button kind="ghost" title={cooldown ? `Resend code in ${cooldown}s` : 'Send a new code'} disabled={busy || cooldown > 0} onPress={send} />
      <Button kind="ghost" title="Use another email" disabled={busy} onPress={() => { setSentTo(''); setCode(''); setError(''); }} />
    </> : <>
      <Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" textContentType="emailAddress" autoComplete="email" autoCapitalize="none" autoCorrect={false} editable={!busy} />
      <Button title="Email me a sign-in code" disabled={busy || !auth.loaded || !validEmail(email) || cooldown > 0} onPress={send} />
      <P size={12}>By continuing, you agree to Ank’s Terms and Privacy Policy. Sign-in emails are separate from optional report tips.</P>
      <Button kind="ghost" title="Continue without signing in" disabled={busy} onPress={() => router.back()} />
    </>}
    <Button kind="ghost" title="Privacy policy" onPress={() => Linking.openURL(CONFIG.privacyUrl)} />
    <Button kind="ghost" title="Terms of use" onPress={() => Linking.openURL(CONFIG.termsUrl)} />
    <Button kind="ghost" title="Contact support" onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} />
  </Screen>;
}
