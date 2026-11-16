import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, Eyebrow, H1, P, Screen, Tile } from '../../components/ui';
import { NameReportBanner } from '../../components/Banner';
import { useStore } from '../../store';
import { reading } from '../../engine/reading';
import { DAY_GOOD, LUCKY, YEAR_THEME } from '../../content/en';
import { t } from '../../i18n';
import { C, F } from '../../theme';

export default function Today() {
  const router = useRouter(); const { s, active } = useStore();
  if (!active) return null;
  const now = new Date(); const r = reading(active, now); const dg = DAY_GOOD[r.today.day];
  return (
    <Screen>
      <Eyebrow>{now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</Eyebrow>
      <H1>{`Today is a ${r.today.day} day`}</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tile label="Day" value={r.today.day} /><Tile label="Month" value={r.today.month} /><Tile label="Year" value={r.today.year} />
      </View>
      <Card><Text style={{ fontFamily: F.sansSemi, color: C.text }}>Good for</Text><P>{dg.good}</P>
        <Text style={{ fontFamily: F.sansSemi, color: C.text }}>Go easy on</Text><P>{dg.easy}</P>
        <Text style={{ fontFamily: F.sansSemi, color: C.text }}>Lucky colour</Text><P>{LUCKY[r.mulank].colours}</P></Card>
      <Card><Text style={{ fontFamily: F.sansSemi, color: C.text }}>{`This year: ${YEAR_THEME[r.personalYear].name}`}</Text><P>{YEAR_THEME[r.personalYear].focus}</P></Card>
      <NameReportBanner />
      <Button kind="ghost" title="Open my Future Report" onPress={() => router.push('/future-report')} />
      <Button kind="ghost" title="Settings" onPress={() => router.push('/settings')} />
      <P size={12}>{t(s.language, 'disclaimer')}</P>
    </Screen>
  );
}
