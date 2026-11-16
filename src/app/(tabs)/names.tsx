import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, Field, H1, P, Screen, Table } from '../../components/ui';
import { LockIcon } from '../../components/TabIcon';
import { useStore } from '../../store';
import { nameReport, checkSpelling } from '../../engine/nameReport';
import { canCheck, recordCheck } from '../../logic/entitlements';
import { daysIndex } from '../../engine/cycles';
import { C, F } from '../../theme';

export default function Names() {
  const router = useRouter(); const { s, set, active } = useStore();
  const [spell, setSpell] = useState(''); const [out, setOut] = useState<ReturnType<typeof checkSpelling> | null>(null);
  if (!active) return null;
  const paid = s.paidProfiles.includes(active.id);
  const today = daysIndex(new Date());
  const gate = canCheck(s.ent, s.usage, today);

  if (!paid && !s.ent.pro) return (
    <Screen><Eyebrow>Names</Eyebrow><H1>Is your name working for you?</H1>
      <Card style={{ opacity: 0.6 }}><P>Name number, spelling options and what to change appear here.</P></Card>
      <View style={{ alignItems: 'center' }}><LockIcon size={32} /></View>
      <View style={{ flex: 1 }} /><Button title="Get the Name Report · $9.99" onPress={() => router.push('/name-report')} />
      <Button kind="ghost" title="See Pro plans" onPress={() => router.push('/paywall')} /></Screen>);

  const base = nameReport(active.name, active.day, active.month, active.year);
  function run() {
    if (!gate.allowed) { router.push('/limit'); return; }
    setOut(checkSpelling(spell, active!.day, active!.month, active!.year));
    set({ usage: recordCheck(s.ent, s.usage, today) });
  }
  return (
    <Screen><Eyebrow>Names</Eyebrow><H1>Name check</H1>
      <Card gold><Text style={{ fontFamily: F.sans, color: C.muted, fontSize: 12 }}>Your name today</Text>
        <Text style={{ fontFamily: F.serif, fontSize: 22, color: C.text }}>{base.current.spelling}</Text>
        <Text style={{ fontFamily: F.sansSemi, color: C.gold }}>{`Name number ${base.current.number}${base.current.compound ? ` (from ${base.current.compound})` : ''}`}</Text>
        <P size={13}>{base.verdict === 'keep' ? 'Your name number matches your birth numbers. Keeping this spelling is reasonable.' : 'Your name number does not match your birth numbers. Compare the spellings below.'}</P></Card>
      <Table head={['Spelling', 'No.', 'Notes']} widths={[2, 0.6, 1.6]} rows={base.options.map((o) => [o.spelling, o.number, [o.matchesMulank && 'Matches Mulank', o.matchesBhagyank && 'Matches Bhagyank', o.addsMissing.length && `Adds ${o.addsMissing[0]}`].filter(Boolean).join(', ') || '-'])} />
      <Field label="Try your own spelling" value={spell} onChangeText={setSpell} autoCapitalize="words" />
      {out ? <Card><Text style={{ fontFamily: F.sansSemi, color: C.text }}>{`${out.spelling}: number ${out.number}`}</Text><P size={13}>{[out.matchesMulank && 'Matches your Mulank.', out.matchesBhagyank && 'Matches your Bhagyank.', out.addsMissing.length && `Adds missing digit ${out.addsMissing[0]}.`].filter(Boolean).join(' ') || 'No match with your birth numbers.'}</P></Card> : null}
      <Button title={spell.trim().length < 2 ? 'Enter a spelling' : gate.allowed ? 'Check spelling' : 'No checks left today'} disabled={spell.trim().length < 2} onPress={run} />
      {gate.allowed && gate.remaining !== null ? <P size={12}>{`${gate.remaining} checks left today`}</P> : null}
    </Screen>
  );
}
