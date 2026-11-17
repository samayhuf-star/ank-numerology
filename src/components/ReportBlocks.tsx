import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card, LoShuGridView, P, Table, Tile } from './ui';
import type { Block } from '../engine/fullReport';
import { C, F } from '../theme';
import { PRICE_FALLBACK } from '../engine/complete';
import { useEffect, useState } from 'react';
import { reportPrice } from '../services/purchases';

const H2 = ({ children }: { children: string }) => <Text style={{ fontFamily: F.serif, fontSize: 20, color: C.text, marginTop: 6 }}>{children}</Text>;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => {
    if (b.k === 'h') return <H2 key={i}>{b.t}</H2>;
    if (b.k === 'p') return <P key={i}>{b.t}</P>;
    if (b.k === 'bul') return <View key={i} style={{ gap: 6 }}>{b.items.map((x) => <P key={x} muted={false}>{`\u2022 ${x}`}</P>)}</View>;
    if (b.k === 'table') return <Table key={i} head={b.head} rows={b.rows} widths={b.widths} />;
    if (b.k === 'stats') return <View key={i} style={{ flexDirection: 'row', gap: 10 }}>{b.items.map((s) => <Tile key={s.label} label={s.label} value={s.value} sub={s.sub} />)}</View>;
    if (b.k === 'grid') return <View key={i} style={{ alignItems: 'center', gap: 6 }}><LoShuGridView counts={b.counts} />{b.caption ? <P size={12}>{b.caption}</P> : null}</View>;
    if (b.k === 'bars') { const max = b.max ?? Math.max(...b.items.map((x) => x.v), 1); return <View key={i} style={{ gap: 6 }}>{b.title ? <Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 13 }}>{b.title}</Text> : null}{b.items.map((x) => <View key={x.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text style={{ width: 54, color: C.text, fontSize: 12 }}>{x.l}</Text><View style={{ flex: 1, height: 14, backgroundColor: C.border, borderRadius: 7 }}><View style={{ width: `${Math.max(4, (x.v / max) * 100)}%`, height: 14, borderRadius: 7, backgroundColor: C.gold }} /></View><Text style={{ width: 22, color: C.text, fontSize: 12 }}>{x.v}</Text></View>)}{b.caption ? <P size={12}>{b.caption}</P> : null}</View>; }
    if (b.k === 'tiles') return <View key={i} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{b.items.map((t, j) => <View key={j} style={{ alignItems: 'center', minWidth: 34, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, backgroundColor: C.border }}><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 15 }}>{t.top}</Text><Text style={{ color: C.text, fontSize: 12 }}>{t.main}</Text></View>)}</View>;
    if (b.k === 'cal') return <View key={i} style={{ gap: 4 }}><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 13 }}>{b.title}</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{[...Array(b.startDow).fill(null), ...b.cells].map((c, j) => <View key={j} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 4 }}>{c ? <Text style={{ fontSize: 11, color: [1, 3, 5, 8].includes(c.pd) ? C.gold : C.text }}>{`${c.date}·${c.pd}`}</Text> : null}</View>)}</View></View>;
    return <Card key={i}><P size={13} muted={false}>{b.t}</P></Card>;
  })}</>;
}

/** Price shown on offers. Real store price when purchases are configured, otherwise India-or-world fallback by device region. */
export function useReportPrice() {
  const region = (() => { try { return Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1] ?? ''; } catch { return ''; } })();
  const fallback: string = region === 'IN' ? PRICE_FALLBACK.IN : PRICE_FALLBACK.world;
  const [p, setP] = useState(fallback);
  useEffect(() => { let on = true; reportPrice(fallback).then((x) => on && setP(x)); return () => { on = false; }; }, [fallback]);
  return p;
}

/** One-line pitch shown under each free card. */
export function PitchStrip({ onPress }: { onPress: () => void }) {
  const price = useReportPrice();
  return <Card gold><Text style={{ fontFamily: F.sansSemi, color: C.text, fontSize: 14 }}>Want the full picture?</Text><P size={13} muted={false}>The Complete Report shows your name worked out in detail, every year ahead and each month, in one report.</P><Button title={`Get the Complete Report · ${price}`} onPress={onPress} /></Card>;
}
export { LoShuGridView };
