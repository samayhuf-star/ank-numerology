import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, LoShuGridView, P, Screen, Table, Tile } from '../components/ui';
import { LockIcon } from '../components/TabIcon';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { buildComplete } from '../engine/complete';
import { Blocks, useReportPrice } from '../components/ReportBlocks';
import { canOpenFullReport } from '../logic/entitlements';
import { t } from '../i18n';
import { C, F } from '../theme';

// The Complete Report is paid (one-time, per profile). Without it this screen only shows what is inside and how to unlock it.
export default function FutureReport() {
  const router = useRouter();
  const { s, active } = useStore();
  const [i, setI] = useState(0);
  const now = useMemo(() => new Date(), []);
  const unlocked = !!active && canOpenFullReport(s.paidProfiles, active.id);
  const pages = useMemo(() => (active && unlocked ? buildComplete(active, now) : []), [active, unlocked, now]);
  const price = useReportPrice();
  if (!active) return null;

  if (!unlocked) {
    const preview = buildComplete(active, now);
    return (
      <Screen>
        <Eyebrow>Complete Report</Eyebrow>
        <H1>{`${preview.length} pages: your name, your numbers and your future`}</H1>
        <Card gold><LockIcon /><P muted={false}>One payment for this profile opens the whole report. Ank Pro does not include it.</P></Card>
        <Table head={['Inside', 'Pages']} widths={[2.4, 0.6]} rows={[
          ['Part 1: your name worked out step by step and matched to your birth numbers', 9], ['Part 2: who you are and where life is heading', 3], ['Your Lo Shu grid, strengths, gaps and arrows', 4], ['Your last three years and this year in detail', 3], ['Month by month for 12 months', 6], ['Best and careful windows', 1], ['Your next five years, year by year', 5], ['Career, money, love and wellbeing', 5], ['Lucky colours, remedies and a 30-day plan', 2]]} />
        <Button title={`Get the Complete Report · ${price}`} onPress={() => router.push('/name-report')} />
        <Button kind="ghost" title="Back" onPress={() => router.back()} />
      </Screen>);
  }

  const r = reading(active, now);
  const p = pages[i];
  return (
    <Screen>
      <Eyebrow>{`${p.kicker} · page ${i + 1} of ${pages.length}`}</Eyebrow>
      <H1>{p.title}</H1>
      <Blocks blocks={p.blocks} />
      <Card><View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}><View style={{ width: 120 }}><LoShuGridView counts={r.counts} size={30} /></View><View style={{ flex: 1 }}><P size={12}>{`Your Lo Shu grid · ${active.name}`}</P></View></View></Card>
      <P size={12}>{t(s.language, 'disclaimer')}</P>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button kind="ghost" title="Previous" disabled={i === 0} onPress={() => setI(i - 1)} /></View>
        <View style={{ flex: 1 }}>{i < pages.length - 1 ? <Button title="Next page" onPress={() => setI(i + 1)} /> : <Button title="Done" onPress={() => router.back()} />}</View>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={{ color: C.muted, fontFamily: F.sans, textAlign: 'center' }}>Close report</Text></Pressable>
    </Screen>
  );
}
