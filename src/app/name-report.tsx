import React, { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Chip, Eyebrow, Field, H1, P, Screen } from '../components/ui';
import { useStore, type Order } from '../store';
import { t } from '../i18n';
import { LANGUAGES } from '../i18n/languages';
import { buyNameReport } from '../services/purchases';
import { submitOrder, validEmail } from '../services/reportApi';
import { CONFIG } from '../config';
import { C, F } from '../theme';
import { View } from 'react-native';

export default function NameReport() {
  const router = useRouter(); const { s, set, active } = useStore();
  const [step, setStep] = useState<'offer' | 'email' | 'sent'>('offer');
  const [email, setEmail] = useState(s.email); const [lang, setLang] = useState(s.language);
  const [tips, setTips] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  if (!active) return null;

  async function pay() {
    setErr(''); setBusy(true);
    const res = await buyNameReport(active!.id, email.trim());
    if (!res.ok) { setBusy(false); if (!res.cancelled) setErr(res.message ?? 'Purchase failed'); return; }
    const order: Order = { id: `o${Date.now()}`, email: email.trim(), language: lang, profile: active!, tips, createdAt: Date.now() };
    const sent = await submitOrder(order);
    set((cur) => ({
      email: email.trim(), paidProfiles: [...new Set([...cur.paidProfiles, active!.id])],
      ent: { ...cur.ent, reportBuyer: true }, pendingOrders: sent ? cur.pendingOrders : [...cur.pendingOrders, order],
    }));
    setBusy(false); setStep('sent');
  }

  if (step === 'offer') return (
    <Screen><Eyebrow>Name Report</Eyebrow><H1>Is your name helping your numbers?</H1>
      <Card gold>{['Name number worked out step by step', 'Five spelling options with the number each one gives', 'Which spelling adds your missing digits', 'What to change and how to start using it', 'Phone, vehicle and house number check', 'Delivered as a PDF in your language'].map((x) => <P key={x} muted={false}>{`• ${x}`}</P>)}</Card>
      <Card><P muted={false}>$9.99, once. You also get 5 free checks every day for life.</P></Card>
      <Button title="Continue · $9.99" onPress={() => setStep('email')} /><Button kind="ghost" title="Not now" onPress={() => router.back()} /></Screen>);
  if (step === 'email') return (
    <Screen><H1>{t(s.language, 'report.send.title')}</H1><P>{t(s.language, 'report.send.body')}</P>
      <Field label={t(s.language, 'report.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <Text style={{ fontFamily: F.sansSemi, fontSize: 13, color: C.muted }}>Name Report language</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{LANGUAGES.map((l) => <Chip key={l.code} label={l.native} on={lang === l.code} onPress={() => setLang(l.code)} />)}</View>
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
