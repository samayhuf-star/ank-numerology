import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Card, H1, P, Screen } from '../components/ui';
import { useStore } from '../store';
import { t } from '../i18n';
export default function Limit() {
  const router = useRouter(); const { s } = useStore();
  return (
    <Screen><H1>{t(s.language, 'limit.title')}</H1><P>{t(s.language, 'limit.body')}</P>
      <Card gold><P muted={false}>Name Report · $9.99 once. Includes 5 free checks every day for life.</P></Card>
      <Card><P muted={false}>Pro · from $3.99 a month. Unlimited checks.</P></Card>
      <Button title="Get the Name Report · $9.99" onPress={() => router.replace('/name-report')} />
      <Button kind="ghost" title="See Pro plans" onPress={() => router.replace('/paywall')} />
      <Button kind="ghost" title="Not now" onPress={() => router.back()} />
    </Screen>
  );
}
