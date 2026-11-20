import React, { useRef, useState } from 'react';
import { ActivityIndicator, Linking, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, Eyebrow, Field, H1, P, Screen } from '../components/ui';
import { useStore, type Order } from '../store';
import { useAuth, verifiedPurchaseIdentity } from '../services/auth';
import { t } from '../i18n';
import { LANGUAGES, REPORT_LANGS } from '../i18n/languages';
import { buyNameReport, getAppUserId } from '../services/purchases';
import { submitOrder, validEmail, reportServiceReady } from '../services/reportApi';
import { CONFIG } from '../config';
import { C, F } from '../theme';
import { View } from 'react-native';
import { useReportPrice } from '../components/ReportBlocks';

export default function NameReport() {
  const router = useRouter(); const { s, set, active } = useStore();
  const auth = useAuth();
  const [step, setStep] = useState<'offer' | 'language' | 'email' | 'sent'>('offer');
  const [email, setEmail] = useState(s.email); const [lang, setLang] = useState('en'); // report language is chosen before ordering; English by default
  const [tips, setTips] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const price = useReportPrice();
  const inFlight = useRef(false);
  const [delivery, setDelivery] = useState<'sent' | 'retry' | 'rejected'>('retry');
  const [recipient, setRecipient] = useState(email);
  const pending = s.pendingOrders.find(o => o.profile.id === active?.id);
  if (!active) return null;

  async function pay() {
    if (inFlight.current || !active) return;
    if (!auth.account) { router.push('/account'); return; }
    if (!auth.billingReady) { setErr('Finish connecting your verified account before continuing. No purchase was started.'); return; }
    inFlight.current = true; setErr(''); setBusy(true);
    let order: Order | undefined = pending;
    try {
      const ownerId = await verifiedPurchaseIdentity();
      if (!ownerId) { setErr('Sign in again to continue. You have not been charged.'); return; }
      if (order?.ownerId && order.ownerId !== ownerId) { setErr('This saved order belongs to another account. Sign in with its email or contact support; do not buy again.'); return; }
      if (!order) {
        const appUserId = await getAppUserId();
        if (!appUserId) { setErr('Purchases are not configured in this build. You have not been charged.'); return; }
        if (!(await reportServiceReady(appUserId))) { setErr('Secure email delivery is not available for your account in this build yet. You have not been charged. Please contact support.'); return; }
        const alreadyPaid = s.paidProfiles.includes(active.id);
        order = { id: `o${Date.now()}-${Math.random().toString(36).slice(2)}`, ownerId, appUserId, email: email.trim(), language: lang, profile: { ...active }, tips, createdAt: Date.now(), purchaseState: alreadyPaid ? 'confirmed' : 'awaiting_purchase', deliveryState: 'queued' };
        // Persist the purchase intent first so a crash cannot turn a retry into a second charge.
        const saved = await set(cur => ({ email: order!.email, pendingOrders: [...cur.pendingOrders, order!] }));
        if (!saved) { setErr('We couldn’t save your order. No purchase was started. Retry the save notice first.'); return; }
        if (!alreadyPaid && s.unusedReports <= 0) {
          const result = await buyNameReport(order.profile.id, order.email);
          if (!result.ok) {
            if (result.cancelled) await set(cur => ({ pendingOrders: cur.pendingOrders.filter(o => o.id !== order!.id) }));
            else setErr('Payment could not be confirmed. Restore purchases before trying again; we will not automatically charge twice.');
            return;
          }
        }
      } else if (order.purchaseState === 'awaiting_purchase' && s.unusedReports <= 0 && !s.paidProfiles.includes(order.profile.id)) {
        setErr('This order has an unconfirmed payment. Use Restore Purchases before trying again. No second purchase has been started.'); return;
      }
      const consumesCredit = order.purchaseState === 'awaiting_purchase' && s.unusedReports > 0;
      order = { ...order, purchaseState: 'confirmed', deliveryState: 'queued' };
      const saved = await set(cur => ({
        paidProfiles: [...new Set([...cur.paidProfiles, order!.profile.id])],
        unusedReports: Math.max(0, cur.unusedReports - (consumesCredit ? 1 : 0)),
        ent: { ...cur.ent, reportBuyer: true }, pendingOrders: cur.pendingOrders.map(o => o.id === order!.id ? order! : o),
      }));
      if (!saved) { setErr('Your report purchase is recorded in memory, but the save failed. Keep Ank open and retry saving before delivery. Do not buy again.'); return; }
      const result = await submitOrder(order);
      await set(cur => ({ pendingOrders: result === 'sent' ? cur.pendingOrders.filter(o => o.id !== order!.id) : cur.pendingOrders.map(o => o.id === order!.id ? { ...o, deliveryState: result === 'rejected' ? 'needs_attention' : 'queued' } : o) }));
      setDelivery(result); setRecipient(order.email); setStep('sent');
    } catch {
      setErr('We couldn’t complete this step. Your saved order is kept. Restore or retry delivery instead of purchasing again.');
    } finally { inFlight.current = false; setBusy(false); }
  }

  if (step === 'offer') return (
    <Screen><Eyebrow>Name Report</Eyebrow><H1>Is your name helping your numbers?</H1>
      <Card gold>{['Part 1, Name Match: your name worked out letter by letter and compared with your birth numbers, with spelling options', 'Part 2, Future Report: your past, this year, each month and the next five years', 'Career, money, love and health, with a 30-day plan', 'Lucky dates, phone, house and vehicle numbers', 'Opens in the app and is emailed as a PDF in the language you choose'].map((x) => <P key={x} muted={false}>{`• ${x}`}</P>)}</Card>
      <Card><P muted={false}>{`${price}, once for this profile. You also get 5 free name checks every day for life.`}</P></Card>
      {pending && <Card><P muted={false}>You have a saved order for this profile. Delivery retries won’t start another purchase.</P><Button title="Check or retry this order" onPress={() => setStep('email')} /><Button kind="ghost" title="Restore purchases" onPress={() => router.push('/paywall')} /></Card>}
      <Button title={`Choose language · ${price}`} onPress={() => setStep('language')} /><Button kind="ghost" title="Not now" onPress={() => router.back()} /></Screen>);
  if (step === 'language') {
    const meta = REPORT_LANGS.find((l) => l.code === lang);
    return (
      <Screen><H1>Which language should your report be in?</H1><P>You choose before you pay. English is selected by default.</P>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {REPORT_LANGS.map((rl) => { const l = LANGUAGES.find((x) => x.code === rl.code)!; return <Chip key={rl.code} label={rl.beta ? `${l.native} (beta)` : l.native} on={lang === rl.code} onPress={() => setLang(rl.code)} />; })}
        </View>
        {meta && !meta.full ? <Card><P muted={false}>{`The full 60-page report is in English for now. ${LANGUAGES.find((l) => l.code === lang)?.english} gets the shorter 12-page edition${meta.beta ? ', and this translation is a beta awaiting native review' : ''}.`}</P></Card> : null}
        <Button title="Continue" onPress={() => setStep('email')} /><Button kind="ghost" title="Back" onPress={() => setStep('offer')} /></Screen>);
  }
  if (step === 'email') return (
    <Screen><H1>{t(s.language, 'report.send.title')}</H1><P>{t(s.language, 'report.send.body')}</P>
      {auth.account ? <Card><P>{`Verified account: ${auth.account.email}`}</P><P size={12}>The report recipient below can be different. Ownership stays with your verified account.</P><Button kind="ghost" title="Manage account" onPress={() => router.push('/account')} /></Card> : <Card><P muted={false}>Verify your email before checkout</P><P>No password, and no charge for signing in.</P><Button title="Sign in with an email code" onPress={() => router.push('/account')} /></Card>}
      <Field label={t(s.language, 'report.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <P size={12}>{`Report language: ${LANGUAGES.find((l) => l.code === lang)?.english ?? 'English'}`}</P>
      <Chip label={t(s.language, 'report.tips')} on={tips} onPress={() => setTips(!tips)} />
      <P size={12}>{t(s.language, 'report.privacy')}</P>
      {err ? <Text accessibilityRole="alert" style={{ color: C.warn, fontFamily: F.sans }}>{err}</Text> : null}
      {busy ? <ActivityIndicator color={C.gold} /> : <Button title={pending || s.paidProfiles.includes(active.id) ? 'Retry email delivery — no new charge' : t(s.language, 'report.pay')} disabled={!pending && !validEmail(email)} onPress={pay} />}
      <Button kind="ghost" title="Restore purchases" onPress={() => router.push('/paywall')} />
      <Button kind="ghost" title="Contact support" onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} />
      <Button kind="ghost" title="Terms of use" onPress={() => Linking.openURL(CONFIG.termsUrl)} />
      <Button kind="ghost" title="Privacy policy" onPress={() => Linking.openURL(CONFIG.privacyUrl)} /></Screen>);
  return (
    <Screen><H1>{delivery === 'sent' ? 'Email accepted' : delivery === 'retry' ? 'Your email is still pending' : 'Your email needs attention'}</H1>
      <P>{delivery === 'sent' ? `The email service accepted your report for ${recipient}. Check your inbox and spam folder; inbox delivery isn’t guaranteed yet.` : delivery === 'retry' ? 'Your report is unlocked, but the email has not been accepted yet. Your order is saved for retry. Do not buy again.' : 'Your report is unlocked, but the delivery service rejected the email request. Your order is kept. Contact support with the order reference; do not buy again.'}</P>
      <Card gold><P muted={false}>{t(s.language, 'report.unlocked')}</P><P size={12}>{`Order: ${pending?.id ?? 'accepted'} · ${recipient}`}</P></Card>
      {delivery !== 'sent' && <Button title="Retry delivery — no new charge" onPress={() => setStep('email')} />}
      <Button kind="ghost" title="Contact support" onPress={() => Linking.openURL(`mailto:${CONFIG.supportEmail}`)} />
      <Button title="Open my Name Report" onPress={() => router.replace('/(tabs)/names')} /></Screen>);
}
