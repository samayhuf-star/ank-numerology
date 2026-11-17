import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, P, Screen, Tile } from '../components/ui';
import { LockIcon } from '../components/TabIcon';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { hook, monthLabel, windows } from '../engine/fullReport';
import { canOpenFullReport } from '../logic/entitlements';
import { YEAR_THEME, MONTHS } from '../content/en';
import { C, F } from '../theme';

// The free reading is one page. It gives one real insight and one real date, and keeps the rest for the full report.
export default function Result() {
  const router = useRouter();
  const { s, active } = useStore();
  if (!active) return null;
  const now = new Date();
  const r = reading(active, now);
  const th = YEAR_THEME[r.personalYear];
  const h = hook(active, now);
  const w = windows(r.months);
  const open = canOpenFullReport(s.ent, s.paidProfiles, active.id);
  return (
    <Screen>
      <Eyebrow>Your free reading</Eyebrow>
      <H1>{`${active.name.split(' ')[0]}, something stands out in your numbers`}</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tile label="Mulank" value={r.mulank} /><Tile label="Bhagyank" value={r.bhagyank} /><Tile label={`Year ${now.getFullYear()}`} value={r.personalYear} />
      </View>
      <Card gold>
        <Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 16 }}>{h.title}</Text>
        <P muted={false}>{h.shown}</P>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><LockIcon size={16} /><Text style={{ fontFamily: F.sans, fontSize: 13, color: C.muted, flex: 1 }}>What it means for your career, love and money is in your full report.</Text></View>
      </Card>
      <Card>
        <Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>{`${now.getFullYear()} is a Year ${r.personalYear}: ${th.name.toLowerCase()}`}</Text>
        <P size={14}>{th.focus}.</P>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {r.months.slice(0, 3).map((p) => (
            <View key={`${p.year}-${p.month}`} style={{ flex: 1, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 12, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>{MONTHS[p.month - 1]}</Text>
              <Text style={{ fontFamily: F.serif, fontSize: 28, color: C.gold }}>{p.number}</Text></View>))}
        </View>
      </Card>
      <Card>
        <Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>Two dates in your next 12 months</Text>
        <P muted={false}>{w.start ? `Strong window to start something: ${monthLabel(w.start)}` : 'Steady months ahead'}</P>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><LockIcon size={16} /><Text style={{ fontFamily: F.sans, fontSize: 14, color: C.muted, flex: 1 }}>{open ? (w.slow ? `Month to slow down: ${monthLabel(w.slow)}` : 'No slow-down month') : 'Month to slow down: unlocks with your full report'}</Text></View>
      </Card>
      <View style={{ flex: 1 }} />
      {open ? <Button title="Open my full future report" onPress={() => router.push('/future-report')} /> : <>
        <Button title="Unlock the full report · $9.99" onPress={() => router.push('/name-report')} />
        <Button kind="ghost" title="Or get Ank Pro, monthly or yearly" onPress={() => router.push('/paywall')} />
        <P size={12}>29 pages on your past, present and next five years, with a month-by-month forecast.</P></>}
      <Button kind="ghost" title="Go to the app" onPress={() => router.replace('/(tabs)/today')} />
    </Screen>
  );
}
