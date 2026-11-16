import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, P, Screen, Tile } from '../components/ui';
import { LockIcon } from '../components/TabIcon';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { YEAR_THEME, MONTHS } from '../content/en';
import { C, F } from '../theme';

export default function Result() {
  const router = useRouter();
  const { s, active } = useStore();
  if (!active) return null;
  const r = reading(active, new Date());
  const th = YEAR_THEME[r.personalYear];
  const nextYear = r.years[1];
  const paid = s.paidProfiles.includes(active.id);
  return (
    <Screen>
      <Eyebrow>Your free future reading</Eyebrow>
      <H1>{`${active.name.split(' ')[0]}, your future in numbers`}</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tile label="Mulank" value={r.mulank} /><Tile label="Bhagyank" value={r.bhagyank} /><Tile label={`Year ${new Date().getFullYear()}`} value={r.personalYear} />
      </View>
      <Card><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>{`${new Date().getFullYear()} is a Year ${r.personalYear}: ${th.name.toLowerCase()}`}</Text>
        <P size={14}>{`${th.focus}. ${nextYear ? `Next year, ${nextYear.year}, is a Year ${nextYear.number}: ${YEAR_THEME[nextYear.number].name.toLowerCase()}.` : ''}`}</P></Card>
      <Card><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>Your next three months</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {r.months.slice(0, 3).map((p) => (
            <View key={`${p.year}-${p.month}`} style={{ flex: 1, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 12, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>{MONTHS[p.month - 1]}</Text>
              <Text style={{ fontFamily: F.serif, fontSize: 28, color: C.gold }}>{p.number}</Text></View>))}
        </View></Card>
      {!paid && <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>Name Report</Text><P size={13}>Name analysis, name check, what to change</P></View><LockIcon /></Card>}
      <View style={{ flex: 1 }} />
      <Button title="Read my full future report · free" onPress={() => router.push('/future-report')} />
      <Button kind="ghost" title={paid ? 'Open my Name Report' : 'See the Name Report · $9.99'} onPress={() => router.push(paid ? '/(tabs)/names' : '/name-report')} />
      <Button kind="ghost" title="Go to the app" onPress={() => router.replace('/(tabs)/today')} />
    </Screen>
  );
}
