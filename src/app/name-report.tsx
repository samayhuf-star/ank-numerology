import React, { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, Eyebrow, Field, H1, P, Screen } from '../components/ui';
import { useStore, type Order } from '../store';
import { t } from '../i18n';
import { LANGUAGES, REPORT_LANGS } from '../i18n/languages';
import { buyNameReport, getAppUserId } from '../services/purchases';
import { submitOrder, validEmail } from '../services/reportApi';
import { CONFIG } from '../config';
import { C, F } from '../theme';
import { View } from 'react-native';
import { useReportPrice } from '../components/ReportBlocks';

export default function NameReport() {
  const router = useRouter(); const { s, set, active } = useStore();
  const [step, setStep] = useState<'offer' | 'language' | 'email' | 'sent'>('offer');
  const [email, setEmail] = useState(s.email); const [lang, setLang] = useState('en'); // report language is chosen before ordering; English by default
  const [tips, setTips] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const price = useReportPrice();
  if (!active) return null;

  async function pay() {
    setErr(''); setBusy(true);
    // A purchase made earlier but never used (e.g. the order failed, or restored on a new phone) is spent first instead of charging again.
    if (s.unusedReports <= 0) {
      const res = await buyNameReport(active!.id, email.trim());
      if (!res.ok) { setBusy(false); if (!res.cancelled) setErr(res.message ?? 'Purchase failed'); return; }
    }
    const order: Order = { id: `o${Date.now()}`, appUserId: await getAppUserId(), email: email.trim(), language: lang, profile: active!, tips, createdAt: Date.now() };
    const sent = await submitOrder(order);
    set((cur) => ({
      email: email.trim(), paidProfiles: [...new Set([...cur.paidProfiles, active!.id])],
      unusedReports: Math.max(0, cur.unusedReports - (s.unusedReports > 0 ? 1 : 0)),
      ent: { ...cur.ent, reportBuyer: true }, pendingOrders: sent === 'retry' ? [...cur.pendingOrders, order] : cur.pendingOrders,
    }));
    setBusy(false); setStep('sent');
  }

  if (step === 'offer') return (
    <Screen><Eyebrow>Name Report</Eyebrow><H1>Is your name helping your numbers?</H1>
      <Card gold>{['Part 1, Name Match: your name worked out letter by letter and compared with your birth numbers, with spelling options', 'Part 2, Future Report: your past, this year, each month and the next five years', 'Career, money, love and health, with a 30-day plan', 'Lucky dates, phone, house and vehicle numbers', 'Opens in the app and is emailed as a PDF in the language you choose'].map((x) => <P key={x} muted={false}>{`• ${x}`}</P>)}</Card>
      <Card><P muted={false}>{`${price}, once for this profile. You also get 5 free name checks every day for life.`}</P></Card>
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
      <Field label={t(s.language, 'report.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <P size={12}>{`Report language: ${LANGUAGES.find((l) => l.code === lang)?.english ?? 'English'}`}</P>
      <Chip label={t(s.language, 'report.tips')} on={tips} onPress={() => setTips(!tips)} />
      <P size={12}>{t(s.language, 'report.privacy')}</P>
      {err ? <Text accessibilityRole="alert" style={{ color: C.warn, fontFamily: F.sans }}>{err}</Text> : null}
      {busy ? <ActivityIndicator color={C.gold} /> : <Button title={t(s.language, 'report.pay')} disabled={!validEmail(email)} onPress={pay} />}
      <P size={12}>{`Terms: ${CONFIG.termsUrl}  Privacy: ${CONFIG.privacyUrl}`}</P></Screen>);
  return (
    <Screen><H1>{t(s.language, 'report.sent.title')}</H1><P>{t(s.language, 'report.sent.body')}</P>
      <Card gold><P muted={false}>{t(s.language, 'report.unlocked')}</P></Card>
      <Button title="Open my Name Report" onPress={() => router.replace('/(tabs)/names')} /></Screen>);
}
