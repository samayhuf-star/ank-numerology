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
    return <View key={i} style={{ flexDirection: 'row', gap: 10 }}>{b.items.map((s) => <Tile key={s.label} label={s.label} value={s.value} sub={s.sub} />)}</View>;
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
