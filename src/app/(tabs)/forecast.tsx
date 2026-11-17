import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, Screen, Table, P } from '../../components/ui';
import { canOpenFullReport } from '../../logic/entitlements';
import { useStore } from '../../store';
import { reading } from '../../engine/reading';
import { MONTHS, YEAR_THEME } from '../../content/en';
import { C, F } from '../../theme';

const r12 = (a: any) => reading(a, new Date()).months;

export default function Forecast() {
  const router = useRouter();
  const { s, active } = useStore();
  if (!active) return null;
  const open = canOpenFullReport(s.ent);
  const shown = open ? r12(active) : r12(active).slice(0, 3);
  return (
    <Screen>
      <Eyebrow>Forecast</Eyebrow><H1>Next 12 months</H1>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 160, borderBottomWidth: 1, borderColor: C.border, paddingBottom: 4 }}>
        {shown.map((p) => (
          <View key={`${p.year}-${p.month}`} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
            <Text style={{ color: C.text, fontFamily: F.sansSemi, fontSize: 11 }}>{p.number}</Text>
            <View style={{ width: '100%', height: p.number * 14, backgroundColor: C.gold, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
            <Text style={{ color: C.muted, fontFamily: F.sans, fontSize: 9 }}>{MONTHS[p.month - 1]}</Text></View>))}
      </View>
      <Table head={['Month', 'No.', 'Theme']} widths={[1, 0.6, 2]} rows={shown.map((p) => [`${MONTHS[p.month - 1]} ${p.year}`, p.number, YEAR_THEME[p.number].name])} />
      {!open ? <Card gold><P muted={false}>The other nine months, with what each one means for you, are in your full report.</P><Button title="Unlock with Ank Pro" onPress={() => router.push('/paywall')} /></Card> : null}
      <P size={13}>Month numbers follow your Personal Year. They are prompts for reflection, not predictions.</P>
    </Screen>
  );
}
