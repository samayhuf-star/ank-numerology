import React from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, TextInput, TextInputProps } from 'react-native';
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
/** Tap-to-choose list in a bottom sheet. Nothing to type, so nothing can be mistyped. Shows `error` in red under the box. */
export function Picker({ label, value, options, onChange, display, error, placeholder = 'Select' }: { label: string; value: string; options: string[]; onChange: (v: string) => void; display?: (v: string) => string; error?: string; placeholder?: string }) {
  const [open, setOpen] = React.useState(false);
  const show = (v: string) => (display ? display(v) : v);
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={{ fontFamily: F.sansSemi, fontSize: 13, color: C.muted }}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => setOpen(true)}
        style={{ height: 52, borderRadius: 14, borderWidth: error ? 2 : 1, borderColor: error ? '#E5484D' : C.border, backgroundColor: C.card, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text numberOfLines={1} style={{ fontFamily: F.sans, fontSize: 17, color: value ? C.text : C.muted, flex: 1 }}>{value ? show(value) : placeholder}</Text>
        <Text style={{ color: C.muted }}>▾</Text>
      </Pressable>
      {error ? <Text accessibilityRole="alert" style={{ color: '#E5484D', fontSize: 12, fontFamily: F.sans }}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: '#000A' }]} onPress={() => setOpen(false)} />
          <View style={{ maxHeight: '70%', backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 28 }}>
            <Text style={{ fontFamily: F.sansSemi, fontSize: 18, color: C.text, marginBottom: 8 }}>{label}</Text>
            <FlatList data={options} keyExtractor={(x) => x} initialNumToRender={24}
              initialScrollIndex={Math.max(0, options.indexOf(value))} getItemLayout={(_, i) => ({ length: 48, offset: 48 * i, index: i })}
              renderItem={({ item }) => (
                <Pressable accessibilityRole="button" onPress={() => { onChange(item); setOpen(false); }} style={{ height: 48, justifyContent: 'center', paddingHorizontal: 8, backgroundColor: item === value ? C.bg : 'transparent', borderRadius: 10 }}>
                  <Text style={{ fontFamily: F.sans, fontSize: 17, color: item === value ? C.gold : C.text }}>{show(item)}</Text>
                </Pressable>
              )} />
          </View>
        </View>
      </Modal>
    </View>
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
