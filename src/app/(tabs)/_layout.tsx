import React from 'react';
import { Tabs } from 'expo-router';
import { TabIcon } from '../../components/TabIcon';
import { useStore } from '../../store';
import { t } from '../../i18n';
import { C } from '../../theme';

export default function TabsLayout() {
  const { s } = useStore();
  const L = (k: Parameters<typeof t>[1]) => t(s.language, k);
  const opt = (title: string, name: 'today' | 'chart' | 'names' | 'forecast') => ({
    title, tabBarIcon: ({ color }: { color: unknown }) => <TabIcon name={name} color={String(color)} />,
  });
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.gold, tabBarInactiveTintColor: C.muted,
      tabBarStyle: { backgroundColor: C.card, borderTopColor: C.border } }}>
      <Tabs.Screen name="today" options={opt(L('tabs.today'), 'today')} />
      <Tabs.Screen name="chart" options={opt(L('tabs.chart'), 'chart')} />
      <Tabs.Screen name="names" options={opt(L('tabs.names'), 'names')} />
      <Tabs.Screen name="forecast" options={opt(L('tabs.forecast'), 'forecast')} />
    </Tabs>
  );
}
