import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, LoShuGridView, P, Screen } from '../components/ui';
import { Blocks, PitchStrip, useReportPrice } from '../components/ReportBlocks';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { buildFreeFlow } from '../engine/freeFlow';
import { canOpenFullReport } from '../logic/entitlements';
import { C, F } from '../theme';
import { noteSuccess } from '../lib/reviewPrompt';

// The free reading is a short guided flow: one idea per card, the working shown, and a pitch under each card.
// The last card is the offer. Paid users go straight to their Complete Report.
export default function Result() {
  const router = useRouter();
  const { s, active } = useStore();
  const [i, setI] = useState(0);
  const now = useMemo(() => new Date(), []);
  const price = useReportPrice();
  if (!active) return null;
  const cards = buildFreeFlow(active, now);
  const open = canOpenFullReport(s.paidProfiles, active.id);
  const last = cards.length; // index of the offer card
  const r = reading(active, now);
  const unlock = () => router.push('/name-report');

  if (i === last) return (
    <Screen>
      <Eyebrow>Your Complete Report</Eyebrow>
      <H1>{`${active.name.split(' ')[0]}, your full report is ready`}</H1>
      <Card gold>
        {['Part 1: your name worked out letter by letter and matched against your birth numbers, with spelling options', 'Part 2: your past, this year, each month, the next five years, career, money, love and health', 'A 30-day action plan and lucky dates', 'Opens in the app and can be emailed as a PDF in your language'].map((x) => <P key={x} muted={false}>{`\u2022 ${x}`}</P>)}
      </Card>
      <Card><Text style={{ fontFamily: F.serif, fontSize: 30, color: C.gold }}>{price}</Text><P size={13}>One payment for this profile. No subscription.</P></Card>
      {open ? <Button title="Open my Complete Report" onPress={() => router.push('/future-report')} /> : <Button title={`Get the Complete Report · ${price}`} onPress={unlock} />}
      <Button kind="ghost" title="Back" onPress={() => setI(i - 1)} />
      <Button kind="ghost" title="Go to the app" onPress={() => { noteSuccess(1); router.replace('/(tabs)/today'); }} />
    </Screen>);

  const c = cards[i];
  return (
    <Screen>
      <View style={{ height: 4, backgroundColor: C.soft, borderRadius: 2 }}><View style={{ height: 4, width: `${((i + 1) / (cards.length + 1)) * 100}%`, backgroundColor: C.gold, borderRadius: 2 }} /></View>
      <Eyebrow>{c.kicker}</Eyebrow>
      <H1>{c.title}</H1>
      <Blocks blocks={c.blocks} />
      {c.grid ? <Card><View style={{ alignItems: 'center' }}><LoShuGridView counts={r.counts} size={54} /></View></Card> : null}
      {!open && i > 1 ? <PitchStrip onPress={unlock} /> : null}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button kind="ghost" title="Back" disabled={i === 0} onPress={() => setI(i - 1)} /></View>
        <View style={{ flex: 1 }}><Button title="Next" onPress={() => setI(i + 1)} /></View>
      </View>
    </Screen>
  );
}
