import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
export function TabIcon({ name, color }: { name: 'today' | 'chart' | 'names' | 'forecast'; color: string }) {
  const p = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2 } as const;
  if (name === 'today') return <Svg {...p}><Circle cx="12" cy="12" r="4" /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Svg>;
  if (name === 'chart') return <Svg {...p}><Rect x="3" y="3" width="7" height="7" rx="1" /><Rect x="14" y="3" width="7" height="7" rx="1" /><Rect x="3" y="14" width="7" height="7" rx="1" /><Rect x="14" y="14" width="7" height="7" rx="1" /></Svg>;
  if (name === 'names') return <Svg {...p}><Path d="M4 20l4-12 4 12M5.5 16h5M16 8v12M16 8l4 0" /></Svg>;
  return <Svg {...p}><Rect x="3" y="5" width="18" height="16" rx="2" /><Path d="M3 10h18M8 3v4M16 3v4" /></Svg>;
}
export function LockIcon({ size = 22 }: { size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E8B960" strokeWidth={2}><Rect x="5" y="11" width="14" height="9" rx="2" /><Path d="M8 11V8a4 4 0 018 0v3" /></Svg>;
}
