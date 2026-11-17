import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, LoShuGridView, P, Screen, Table, Tile } from '../components/ui';
import { LockIcon } from '../components/TabIcon';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { buildReport, type Block } from '../engine/fullReport';
import { canOpenFullReport } from '../logic/entitlements';
import { t } from '../i18n';
import { C, F } from '../theme';

const H2 = ({ children }: { children: string }) => <Text style={{ fontFamily: F.serif, fontSize: 20, color: C.text, marginTop: 6 }}>{children}</Text>;

function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => {
    if (b.k === 'h') return <H2 key={i}>{b.t}</H2>;
    if (b.k === 'p') return <P key={i}>{b.t}</P>;
    if (b.k === 'bul') return <View key={i} style={{ gap: 6 }}>{b.items.map((x) => <P key={x} muted={false}>{`• ${x}`}</P>)}</View>;
    if (b.k === 'table') return <Table key={i} head={b.head} rows={b.rows} widths={b.widths} />;
    return <View key={i} style={{ flexDirection: 'row', gap: 10 }}>{b.items.map((s) => <Tile key={s.label} label={s.label} value={s.value} sub={s.sub} />)}</View>;
  })}</>;
}

// The full report is paid. Without Ank Pro this screen only shows what is inside and how to unlock it.
export default function FutureReport() {
  const router = useRouter();
  const { s, active } = useStore();
  const [i, setI] = useState(0);
  const now = useMemo(() => new Date(), []);
  const unlocked = !!active && canOpenFullReport(s.ent);
  const pages = useMemo(() => (active && unlocked ? buildReport(active, now) : []), [active, unlocked, now]);
  if (!active) return null;

  if (!unlocked) {
    const preview = buildReport(active, now);
    return (
      <Screen>
        <Eyebrow>Full Future Report</Eyebrow>
        <H1>{`${preview.length} pages about your past, present and future`}</H1>
        <Card gold><LockIcon /><P muted={false}>Your full report opens with the one-time Full Report or with Ank Pro (monthly or yearly).</P></Card>
        <Table head={['Inside', 'Pages']} widths={[2.4, 0.6]} rows={[
          ['Who you are and where life is heading', 4], ['Your Lo Shu grid, strengths, gaps and arrows', 4], ['Your last three years', 1], ['This year in detail', 2], ['Month by month for 12 months', 6], ['Best and careful windows', 1], ['Your next five years, year by year', 5], ['Career, money, love and wellbeing', 5], ['Lucky colours, remedies and a 30-day plan', 2]]} />
        <Button title="Unlock with Ank Pro, monthly or yearly" onPress={() => router.push('/paywall')} />
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
