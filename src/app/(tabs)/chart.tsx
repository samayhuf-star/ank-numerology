import React from 'react';
import { Text, View } from 'react-native';
import { Card, Eyebrow, H1, LoShuGridView, P, Screen, Table, Tile } from '../../components/ui';
import { NameReportBanner } from '../../components/Banner';
import { LockIcon } from '../../components/TabIcon';
import { useStore } from '../../store';
import { reading } from '../../engine/reading';
import { chaldeanName } from '../../engine/numerology';
import { C, F } from '../../theme';

export default function Chart() {
  const { s, active } = useStore();
  if (!active) return null;
  const r = reading(active, new Date());
  const paid = s.paidProfiles.includes(active.id);
  const nm = paid ? chaldeanName(active.name) : null;
  return (
    <Screen>
      <Eyebrow>Your chart</Eyebrow><H1>{active.name}</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tile label="Mulank" value={r.mulank} /><Tile label="Bhagyank" value={r.bhagyank} />
        {paid ? <Tile label="Namank" value={nm!.value} sub={nm!.compound ? `from ${nm!.compound}` : undefined} />
          : <Card style={{ flex: 1, padding: 14, alignItems: 'center', justifyContent: 'center' }}><LockIcon /><Text style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, textAlign: 'center' }}>Namank{'\n'}In the Name Report</Text></Card>}
      </View>
      <Card><LoShuGridView counts={r.counts} /><P size={13}>{`Missing: ${r.missing.join(', ') || 'none'}`}</P></Card>
      <Table head={['Line', 'Theme', 'Status']} widths={[1.1, 1.4, 1.4]} rows={r.lines.map((l) => [l.digits.join(' · '), l.name, l.status === 'complete' ? 'Complete' : l.status === 'empty' ? 'Missing' : 'Partial'])} />
      <NameReportBanner />
    </Screen>
  );
}
