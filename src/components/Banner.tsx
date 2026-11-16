import React from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store';
import { C, F } from '../theme';
export function NameReportBanner() {
  const router = useRouter(); const { s, active } = useStore();
  if (!active || s.paidProfiles.includes(active.id)) return null;
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push('/name-report')}
      style={{ backgroundColor: C.card, borderColor: C.gold, borderWidth: 1, borderRadius: 16, padding: 14 }}>
      <Text style={{ fontFamily: F.sansSemi, color: C.gold, fontSize: 15 }}>Name Report · $9.99</Text>
      <Text style={{ fontFamily: F.sans, color: C.muted, fontSize: 13 }}>Check your name and see what to change. Includes 5 free checks every day for life.</Text>
    </Pressable>
  );
}
