import React, { useState } from 'react';
import { Platform, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Localization from 'expo-localization';
import { Button, Card, Chip, DateTimePickerModal, Field, H1, LoShuGridView, P, PickerField, Screen } from '../components/ui';
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
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOB_MIN = new Date(1900, 0, 1);
const DOB_DEFAULT = new Date(1990, 0, 1);
/** Number of onboarding screens (read by the autopilot panel). */
export const ONBOARDING_SCREENS = 10;

function pad2(n: number) { return String(n).padStart(2, '0'); }
function dateFromTime(hhmm: string) {
  const [h, mi] = hhmm.split(':').map((x) => parseInt(x, 10));
  return new Date(1990, 0, 1, Number.isFinite(h) ? h : 8, Number.isFinite(mi) ? mi : 0, 0, 0);
}

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
  const [showDob, setShowDob] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const L = (k: Parameters<typeof t>[1]) => t(lang, k);

  const day = parseInt(d, 10), month = parseInt(m, 10), year = parseInt(y, 10);
  const dateOk = isValidDate(day, month, year) && year >= 1900 && year <= new Date().getFullYear();
  const nameOk = name.replace(/[^A-Za-z]/g, '').length >= 2;
  const timeOk = /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);
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
  if (step === 5) {
    const dobFields = (
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Field label={L('dob.day')} value={d} onChangeText={(v) => setD(v.replace(/\D/g, '').slice(0, 2))} keyboardType="number-pad" maxLength={2} /></View>
        <View style={{ flex: 1 }}><Field label={L('dob.month')} value={m} onChangeText={(v) => setM(v.replace(/\D/g, '').slice(0, 2))} keyboardType="number-pad" maxLength={2} /></View>
        <View style={{ flex: 1.4 }}><Field label={L('dob.year')} value={y} onChangeText={(v) => setY(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} /></View>
      </View>
    );
    const applyDob = (dt: Date) => { setD(String(dt.getDate())); setM(String(dt.getMonth() + 1)); setY(String(dt.getFullYear())); };
    return (
    <Screen><H1>{L('dob.title')}</H1><P>{L('dob.body')}</P>
      {Platform.OS === 'web' ? dobFields : (
        <>
          <PickerField label={L('dob.select')} value={dateOk ? `${day} ${MONTHS[month - 1]} ${year}` : ''} placeholder={L('dob.select')} onPress={() => setShowDob(true)} />
          <DateTimePickerModal visible={showDob} mode="date" value={dateOk ? new Date(year, month - 1, day) : DOB_DEFAULT}
            minimumDate={DOB_MIN} maximumDate={new Date()} onSelect={applyDob} onClose={() => setShowDob(false)} />
        </>
      )}
      {d && m && y.length === 4 && !dateOk ? <Text accessibilityRole="alert" style={{ color: C.warn, fontFamily: F.sans }}>{L('dob.error')}</Text> : null}
      <View style={{ flex: 1 }} /><Button title={L('continue')} disabled={!dateOk} onPress={next} /></Screen>);
  }
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
      {Platform.OS === 'web' ? (
        <Field label={`${L('alerts.time')} (24h, HH:MM)`} value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" maxLength={5} />
      ) : (
        <>
          <PickerField label={L('alerts.time')} value={time} onPress={() => setShowTime(true)} />
          <DateTimePickerModal visible={showTime} mode="time" value={dateFromTime(time)}
            onSelect={(dt) => setTime(`${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`)} onClose={() => setShowTime(false)} />
        </>
      )}
      <View style={{ flex: 1 }} /><Button title={L('continue')} disabled={!timeOk || tips === 'unset'} onPress={finish} /></Screen>);
}
