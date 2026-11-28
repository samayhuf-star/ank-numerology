import React from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, TextInput, TextInputProps } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';

export function Screen({ children, scroll = true, pad = 24 }: { children: React.ReactNode; scroll?: boolean; pad?: number }) {
  const inner = <View style={{ padding: pad, gap: 16, flexGrow: 1 }}>{children}</View>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
      {scroll ? <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">{inner}</ScrollView> : inner}
    </SafeAreaView>
  );
}
export const H1 = ({ children }: { children: React.ReactNode }) => <Text accessibilityRole="header" style={s.h1}>{children}</Text>;
export const Eyebrow = ({ children }: { children: React.ReactNode }) => <Text style={s.eyebrow}>{String(children).toUpperCase()}</Text>;
export const P = ({ children, muted = true, size = 15 }: { children: React.ReactNode; muted?: boolean; size?: number }) =>
  <Text style={{ fontFamily: F.sans, fontSize: size, lineHeight: size * 1.5, color: muted ? C.muted : C.text }}>{children}</Text>;
export const Card = ({ children, style, gold }: { children: React.ReactNode; style?: ViewStyle; gold?: boolean }) =>
  <View style={[s.card, gold && { borderColor: C.gold, borderWidth: 2 }, style]}>{children}</View>;
export function Button({ title, onPress, kind = 'primary', disabled }: { title: string; onPress: () => void; kind?: 'primary' | 'ghost'; disabled?: boolean }) {
  const primary = kind === 'primary';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.btn, primary ? { backgroundColor: C.gold } : { height: 48 }, disabled && { opacity: 0.4 }, pressed && { opacity: 0.8 }]}>
      <Text style={{ fontFamily: primary ? F.sansSemi : F.sansMed, fontSize: primary ? 17 : 15, color: primary ? C.ink : C.muted }}>{title}</Text>
    </Pressable>
  );
}
export function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card style={{ flex: 1, padding: 14 }}>
      <Text style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>{label}</Text>
      <Text style={{ fontFamily: F.serif, fontSize: 38, color: C.gold }}>{value}</Text>
      {sub ? <Text style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>{sub}</Text> : null}
    </Card>
  );
}
export function Field({ label, ...rest }: { label: string } & TextInputProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: F.sansSemi, fontSize: 13, color: C.muted }}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={C.border} {...rest}
        style={{ height: 52, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, color: C.text, fontSize: 17, paddingHorizontal: 16, fontFamily: F.sans }} />
    </View>
  );
}
export function PickerField({ label, value, placeholder, onPress }: { label: string; value: string; placeholder?: string; onPress: () => void }) {
  const empty = !value;
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: F.sansSemi, fontSize: 13, color: C.muted }}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
        style={{ height: 52, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, justifyContent: 'center', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 17, fontFamily: F.sans, color: empty ? C.border : C.text }}>{empty ? (placeholder ?? '') : value}</Text>
      </Pressable>
    </View>
  );
}
export function DateTimePickerModal({
  visible, mode, value, onSelect, onClose, minimumDate, maximumDate, doneLabel = 'Done',
}: {
  visible: boolean; mode: 'date' | 'time'; value: Date; onSelect: (date: Date) => void; onClose: () => void;
  minimumDate?: Date; maximumDate?: Date; doneLabel?: string;
}) {
  if (Platform.OS === 'web' || !visible) return null;
  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') onClose();
    if (event.type === 'set' && date) onSelect(date);
  }
  const picker = (
    <DateTimePicker value={value} mode={mode} display={Platform.OS === 'ios' ? 'spinner' : 'default'} is24Hour
      themeVariant="dark" textColor={C.text} onChange={handleChange} minimumDate={minimumDate} maximumDate={maximumDate} />
  );
  if (Platform.OS !== 'ios') return picker;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,20,43,0.72)' }} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: C.card, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingBottom: 24 }}>
          <View style={{ alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 12 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={doneLabel} onPress={() => { onSelect(value); onClose(); }} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.sansSemi, fontSize: 17, color: C.gold }}>{doneLabel}</Text>
            </Pressable>
          </View>
          {picker}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={onPress}
      style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: on ? C.gold : C.border, backgroundColor: on ? C.gold : C.card, justifyContent: 'center' }}>
      <Text style={{ fontFamily: F.sansMed, fontSize: 15, color: on ? C.ink : C.text }}>{label}</Text>
    </Pressable>
  );
}
export function Table({ head, rows, widths }: { head: string[]; rows: (string | number)[][]; widths?: number[] }) {
  const w = (i: number) => ({ flex: widths?.[i] ?? 1 });
  return (
    <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 14, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', backgroundColor: C.soft, padding: 10, gap: 8 }}>{head.map((h, i) => <Text key={i} style={[s.th, w(i)]}>{h}</Text>)}</View>
      {rows.map((r, ri) => (
        <View key={ri} style={{ flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderTopColor: C.border }}>
          {r.map((c, i) => <Text key={i} style={[s.td, w(i)]}>{String(c)}</Text>)}
        </View>
      ))}
    </View>
  );
}
export function LoShuGridView({ counts, size = 54 }: { counts: Record<number, number>; size?: number }) {
  const L = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
  return (
    <View style={{ gap: 8 }} accessible accessibilityLabel={`Lo Shu grid. Missing digits: ${[1,2,3,4,5,6,7,8,9].filter((d) => !counts[d]).join(', ') || 'none'}`}>
      {L.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: 8 }}>
          {row.map((d) => {
            const n = counts[d] ?? 0;
            return (
              <View key={d} style={{ flex: 1, height: size, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: n ? C.gold : C.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: F.serif, fontSize: 24, color: n ? C.ink : C.border }}>{n ? String(d).repeat(n) : ''}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  h1: { fontFamily: F.serif, fontSize: 30, lineHeight: 35, color: C.text },
  eyebrow: { fontFamily: F.sansSemi, fontSize: 13, color: C.gold, letterSpacing: 0.6 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 8 },
  btn: { width: '100%', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  th: { fontFamily: F.sansSemi, fontSize: 12, color: C.text },
  td: { fontFamily: F.sans, fontSize: 13, color: C.muted, lineHeight: 18 },
});
