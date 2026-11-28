import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Localization from 'expo-localization';
import { Button, Card, Chip, Field, H1, P, Picker, Screen } from '../components/ui';
import { LoShuGridView } from '../components/ui';
import { useStore } from '../store';
import { t } from '../i18n';
import { LANGUAGES } from '../i18n/languages';
import { coverage } from '../i18n';
import { fromLocale } from '../i18n';
import { bhagyank, isValidDate, loShuGrid, mulank } from '../engine/numerology';
import { canCheck, recordCheck } from '../logic/entitlements';
import { daysIndex } from '../engine/cycles';
import { requestPermission } from '../services/notifications';
import { setPushConsent } from '../services/push';
import { C, F } from '../theme';

const FOCUS = ['Career', 'Money', 'Relationships', 'Name change', 'Daily guidance', 'Lucky numbers', 'Business name'];
/** Number of onboarding screens (read by the autopilot panel). */
export const ONBOARDING_SCREENS = 10;

const DEMO = { 1: 1, 2: 1, 3: 1, 7: 1, 9: 2 } as Record<number, number>;

export default function Onboarding() {
  const router = useRouter();
  const { s, set } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('');
  const [lang, setLang] = useState(() => fromLocale(Localization.getLocales()[0]?.languageTag));
  const [focus, setFocus] = useState<string[]>([]);
  const [daily, setDaily] = useState(true);
  const [tips, setTips] = useState<'unset' | 'yes' | 'no'>('unset');
  const [time, setTime] = useState('08:00');
  const [tried, setTried] = useState(false);
  const L = (k: Parameters<typeof t>[1]) => t(lang, k);

  const day = parseInt(d, 10), month = parseInt(m, 10), year = parseInt(y, 10);
  const dateOk = isValidDate(day, month, year) && year >= 1900 && year <= new Date().getFullYear();
  const nameOk = name.replace(/[^A-Za-z]/g, '').length >= 2;
  const timeOk = /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);
  const [hh, mm] = time.split(':');
  const dim = (month >= 1 && month <= 12 && year >= 1900) ? new Date(Date.UTC(year, month, 0)).getUTCDate() : 31;
  const monthName = (n: string) => new Date(2000, +n - 1, 1).toLocaleString(lang, { month: 'long' });
  const dobErr = (tried && !dateOk) ? {
    day: !d ? L('dob.pickDay') : (day > dim ? L('dob.error') : undefined),
    month: !m ? L('dob.pickMonth') : undefined,
    year: !y ? L('dob.pickYear') : (dateOk ? undefined : L('dob.error')),
  } : {} as Record<string, string | undefined>;
  const next = () => setStep((x) => x + 1);

  async function finish() {
    if (daily || tips === 'yes') await requestPermission().catch(() => false);
    setPushConsent(tips === 'yes');
    const today = daysIndex(new Date());
    const id = `p${Date.now()}`;
    const usage = recordCheck(s.ent, s.usage, today); // the first, free check
    set({ onboarded: true, language: lang, focus, profiles: [{ id, name: name.trim(), day, month, year }], activeId: id,
      usage, notif: { daily, tips, time }, startDay: today, lastOpenDay: today });
    router.replace('/result');
  }

  const dots = <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>{Array.from({ length: ONBOARDING_SCREENS }).map((_, i) => <View key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === step ? C.gold : C.border }} />)}</View>;

  if (step === 0) return (
    <Screen><View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
      <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.serif, fontSize: 40, color: C.gold }}>9</Text></View>
      <H1>{L('welcome.title')}</H1><P>{L('welcome.body')}</P></View>
      {dots}<Button title={L('next')} onPress={next} /><Button kind="ghost" title={L('skip')} onPress={() => setStep(4)} /></Screen>);
  if (step === 1) return (
    <Screen><View style={{ flex: 1, justifyContent: 'center', gap: 16 }}><Card><LoShuGridView counts={DEMO} /></Card><H1>{L('intro2.title')}</H1><P>{L('intro2.body')}</P></View>
      {dots}<Button title={L('next')} onPress={next} /><Button kind="ghost" title={L('skip')} onPress={() => setStep(4)} /></Screen>);
  if (step === 2) return (
    <Screen><View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
      <Card><P muted={false}>{L('how.birth')}</P><P muted={false}>{L('how.destiny')}</P><P muted={false}>{L('how.name')}</P></Card>
      <H1>{L('how.title')}</H1><P>{L('how.body')}</P></View>
      {dots}<Button title={L('next')} onPress={next} /><Button kind="ghost" title={L('skip')} onPress={() => setStep(4)} /></Screen>);
  if (step === 3) return (
    <Screen><View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
      <Card><P muted={false}>{L('intro3.free')}</P><P muted={false}>{L('intro3.report')}</P><P muted={false}>{L('intro3.pro')}</P></Card>
      <H1>{L('intro3.title')}</H1><P>{L('intro3.body')}</P></View>
      {dots}<Button title={L('begin')} onPress={next} /></Screen>);
  if (step === 4) return (
    <Screen><H1>{L('name.title')}</H1><P>{L('name.body')}</P>
      <Field label={L('name.field')} value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" textContentType="name" returnKeyType="next" />
      <P size={12}>{L('name.hint')}</P><View style={{ flex: 1 }} /><Button title={L('continue')} disabled={!nameOk} onPress={next} /></Screen>);
  if (step === 5) return (
    <Screen><H1>{L('dob.title')}</H1><P>{L('dob.body')}</P>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Picker label={L('dob.day')} value={d} options={Array.from({ length: dim }, (_, i) => String(i + 1))} onChange={setD} error={dobErr.day} />
        <Picker label={L('dob.month')} value={m} options={Array.from({ length: 12 }, (_, i) => String(i + 1))} display={monthName} onChange={setM} error={dobErr.month} />
        <Picker label={L('dob.year')} value={y} options={Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => String(new Date().getFullYear() - i))} onChange={setY} error={dobErr.year} />
      </View>
      {tried && !dateOk ? <Text accessibilityRole="alert" style={{ color: '#E5484D', fontFamily: F.sansSemi }}>{L('dob.fix')}</Text> : null}
      <View style={{ flex: 1 }} /><Button title={L('continue')} onPress={() => { if (dateOk) { setTried(false); next(); } else setTried(true); }} /></Screen>);
  if (step === 6) return (
    <Screen><View style={{ flex: 1, justifyContent: 'center', gap: 16 }}><Card><LoShuGridView counts={loShuGrid(day, month, year)} /></Card>
      <H1>{L('preview.title')}</H1>
      <P muted={false}>{t(lang, 'preview.body', { birth: mulank(day), destiny: bhagyank(day, month, year) })}</P><P size={12}>{L('preview.note')}</P></View>
      {dots}<Button title={L('continue')} onPress={next} /></Screen>);
  if (step === 7) return (
    <Screen><H1>{L('lang.title')}</H1><P>{L('lang.body')}</P>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{LANGUAGES.map((l) => <Chip key={l.code} label={l.native} on={lang === l.code} onPress={() => setLang(l.code)} />)}</View>
      {coverage(lang) < 1 ? <Text style={{ color: '#8a8aa0', fontSize: 12, marginTop: 8 }}>App screens for this language are still being translated and show in English for now. You can still order your Name Report in it where available.</Text> : null}
      <P size={12}>{L('lang.note')}</P><Button title={L('continue')} onPress={next} /></Screen>);
  if (step === 8) return (
    <Screen><H1>{L('focus.title')}</H1><P>{L('focus.body')}</P>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{FOCUS.map((f) => <Chip key={f} label={f} on={focus.includes(f)} onPress={() => setFocus((x) => x.includes(f) ? x.filter((i) => i !== f) : [...x, f])} />)}</View>
      <View style={{ flex: 1 }} /><Button title={L('continue')} onPress={next} /></Screen>);
  return (
    <Screen><H1>{L('alerts.title')}</H1>
      <Card><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 16 }}>{L('alerts.daily')}</Text><P size={13}>{L('alerts.dailyBody')}</P></View>
        <Switch accessibilityLabel={L('alerts.daily')} value={daily} onValueChange={setDaily} trackColor={{ true: C.gold, false: C.border }} /></View></Card>
      <Card><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 16 }}>{L('alerts.tips')}</Text><P size={13}>{L('alerts.tipsBody')}</P>
        <View style={{ flexDirection: 'row', gap: 8 }}><Chip label={L('alerts.yes')} on={tips === 'yes'} onPress={() => setTips('yes')} /><Chip label={L('alerts.no')} on={tips === 'no'} onPress={() => setTips('no')} /></View></Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Picker label={`${L('alerts.time')}: ${L('alerts.hour')}`} value={hh} options={Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))} onChange={(v) => setTime(`${v}:${mm || '00'}`)} error={tried && !timeOk ? L('alerts.pickTime') : undefined} />
        <Picker label={L('alerts.minute')} value={mm} options={Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))} onChange={(v) => setTime(`${hh || '08'}:${v}`)} error={tried && !timeOk ? L('alerts.pickTime') : undefined} />
      </View>
      {tried && tips === 'unset' ? <Text accessibilityRole="alert" style={{ color: '#E5484D', fontFamily: F.sans }}>{L('alerts.pickTips')}</Text> : null}
      <View style={{ flex: 1 }} /><Button title={L('continue')} onPress={() => { if (timeOk && tips !== 'unset') finish(); else setTried(true); }} /></Screen>);
}
