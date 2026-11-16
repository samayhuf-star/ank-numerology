import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, LoShuGridView, P, Screen, Table, Tile } from '../components/ui';
import { useStore } from '../store';
import { reading } from '../engine/reading';
import { BHAGYANK, DIGIT_HAVE, DIGIT_MISSING, ARROW_MISSING, LUCKY, MULANK, PLANET, YEAR_THEME, MONTHS } from '../content/en';
import { t } from '../i18n';
import { C, F } from '../theme';

const H2 = ({ children }: { children: string }) => <Text style={{ fontFamily: F.serif, fontSize: 20, color: C.text, marginTop: 8 }}>{children}</Text>;

export default function FutureReport() {
  const router = useRouter();
  const { s, active } = useStore();
  if (!active) return null;
  const now = new Date();
  const r = reading(active, now);
  const mk = MULANK[r.mulank], bh = BHAGYANK[r.bhagyank];
  const bhMissing = r.missing.includes(r.bhagyank);
  return (
    <Screen>
      <Eyebrow>Future Report · free</Eyebrow>
      <H1>{active.name}</H1>
      <P>{`Born ${active.day}/${active.month}/${active.year}. Built around your Lo Shu grid.`}</P>

      <H2>Your core numbers</H2>
      <View style={{ flexDirection: 'row', gap: 10 }}><Tile label="Mulank" value={r.mulank} sub={`Born on the ${active.day}`} /><Tile label="Bhagyank" value={r.bhagyank} sub="Full birth date" /><Tile label={`Year ${now.getFullYear()}`} value={r.personalYear} sub="Personal Year" /></View>
      <Table head={['Number', 'Working', 'Result']} widths={[1, 2.2, 0.8]} rows={[
        ['Mulank', `${active.day} → ${String(active.day).split('').join(' + ')}`, r.mulank],
        ['Bhagyank', `${[...`${active.day}${active.month}${active.year}`].join('+')} → ${r.bhagyank}`, r.bhagyank],
        ['Personal Year', `day + month + ${now.getFullYear()} → ${r.personalYear}`, r.personalYear]]} />

      <H2>{`Mulank ${r.mulank} · ${PLANET[r.mulank]}`}</H2>
      <Table head={['Area', 'Reading']} widths={[1, 2.5]} rows={[['Summary', mk.short], ['Strengths', mk.strengths], ['Watch-outs', mk.watch], ['Work', mk.work]]} />
      <H2>{`Bhagyank ${r.bhagyank} · ${PLANET[r.bhagyank]}`}</H2>
      <Table head={['Area', 'Reading']} widths={[1, 2.5]} rows={[['Long-run theme', bh.theme], ['Tension with Mulank', bh.tension]]} />
      {bhMissing ? <P size={13}>{`Because ${r.bhagyank} is also missing from your Lo Shu grid, it is the skill to grow on purpose.`}</P> : null}

      <H2>Your Lo Shu grid</H2>
      <Card><LoShuGridView counts={r.counts} /><P size={13}>{`Filled squares are digits in your birth date. Missing: ${r.missing.join(', ') || 'none'}.`}</P></Card>

      <H2>Digits you have</H2>
      <Table head={['Digit', 'Meaning', 'In your chart']} widths={[0.9, 1.4, 2]} rows={r.present.map((d) => [`${d}${r.counts[d] > 1 ? ` (x${r.counts[d]})` : ''}`, DIGIT_HAVE[d].area, DIGIT_HAVE[d].meaning])} />

      <H2>Digits you are missing</H2>
      {r.missing.length ? <Table head={['No.', 'Pattern', 'Practice']} widths={[0.5, 1.6, 1.8]} rows={r.missing.map((d) => [d, DIGIT_MISSING[d].pattern, DIGIT_MISSING[d].practice])} /> : <P>Every digit from 1 to 9 is present in your birth date.</P>}

      <H2>Planes and arrows</H2>
      <Table head={['Line', 'Theme', 'Your chart']} widths={[1.2, 1.4, 1.4]} rows={r.lines.map((l) => [l.digits.join(' · '), l.name, l.status === 'complete' ? 'Complete' : l.status === 'empty' ? 'All three missing' : `${l.present.join(', ')} present`])} />
      {r.missingArrows.map((a) => <Card key={a.id}><Text style={{ fontFamily: F.sansSemi, color: C.text }}>{`Missing arrow ${a.digits.join('-')}: ${a.name}`}</Text><P size={13}>{ARROW_MISSING[a.id]}</P></Card>)}

      <H2>Your 12-month forecast</H2>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 150, borderBottomWidth: 1, borderColor: C.border, paddingBottom: 4 }}>
        {r.months.map((p) => (
          <View key={`${p.year}-${p.month}`} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
            <Text style={{ color: C.text, fontFamily: F.sansSemi, fontSize: 11 }}>{p.number}</Text>
            <View style={{ width: '100%', height: p.number * 13, backgroundColor: C.gold, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
            <Text style={{ color: C.muted, fontFamily: F.sans, fontSize: 9 }}>{MONTHS[p.month - 1]}</Text></View>))}
      </View>

      <H2>Your next five years</H2>
      <Table head={['Year', 'No.', 'Theme', 'Focus']} widths={[0.8, 0.5, 1.3, 2]} rows={r.years.map((y) => [y.year, y.number, YEAR_THEME[y.number].name, YEAR_THEME[y.number].focus])} />

      <H2>Lucky numbers and colours</H2>
      <Table head={['Item', 'Suggestion']} widths={[1, 2]} rows={[['Colours', LUCKY[r.mulank].colours], ['Good days', LUCKY[r.mulank].days], ['Numbers to build', r.missing.join(', ') || 'None']]} />

      <Card><P size={12}>{t(s.language, 'disclaimer')}</P></Card>
      <Button title="Done" onPress={() => router.back()} />
      {!s.paidProfiles.includes(active.id) && <Button kind="ghost" title="See the Name Report · $9.99" onPress={() => router.push('/name-report')} />}
    </Screen>
  );
}
