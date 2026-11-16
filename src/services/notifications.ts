import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { plan, type NudgeContext } from '../engine/nudges.ts';
import { todayNumber, daysIndex } from '../engine/cycles.ts';
import { DAY_GOOD, luckyColourShort } from '../content/en.ts';
import { reading } from '../engine/reading.ts';
import type { State, Profile } from '../store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
});

const CHANNEL = 'daily';

export async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Daily numbers and tips', importance: Notifications.AndroidImportance.DEFAULT });
  }
}
export async function requestPermission(): Promise<boolean> {
  await ensureChannel();
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted || cur.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) return true;
  const r = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: false, allowSound: true } });
  return r.granted || r.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
}

const parseTime = (hhmm: string) => { const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10)); return { h: isFinite(h) ? h : 8, m: isFinite(m) ? m : 0 }; };
const at = (base: Date, addDays: number, h: number, m: number) => { const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + addDays, h, m, 0, 0); return d; };

/** Rolling schedule. iOS keeps at most 64 pending local notifications, so we schedule 14 days and refresh on every app open. */
export async function reschedule(s: State, p: Profile | null, now = new Date()) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!p) return 0;
  const { h, m } = parseTime(s.notif.time);
  const DAYS = 14;
  let n = 0;
  const first = at(now, 0, h, m) > now ? 0 : 1;
  const trigger = (date: Date) => ({ type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL } as const);

  if (s.notif.daily) {
    for (let i = first; i < first + DAYS; i++) {
      const date = at(now, i, h, m);
      const t = todayNumber(p.day, p.month, date);
      const good = DAY_GOOD[t.day].good;
      await Notifications.scheduleNotificationAsync({ content: { title: `Today is a ${t.day} day`, body: `Good for: ${good}.` }, trigger: trigger(date) });
      n++;
    }
  }
  if (s.notif.tips === 'yes' && s.ent.reportBuyer === false && !s.paidProfiles.length) {
    const ctx = (date: Date): NudgeContext => {
      const t = todayNumber(p.day, p.month, date);
      const next = todayNumber(p.day, p.month, at(date, 31, 12, 0));
      const r = reading(p, date);
      return { firstName: p.name.split(' ')[0] || 'there', personalDay: t.day, nextMonthNumber: next.month, missing: r.missing, luckyColour: luckyColourShort(r.mulank) };
    };
    const today = daysIndex(now);
    const nudges = plan({ optedIn: true, purchased: false, startDay: s.startDay || today, lastOpenDay: s.lastOpenDay || today }, today + first, DAYS, ctx(now));
    for (const nd of nudges) {
      const date = at(now, nd.day - today, (h + 4) % 24, m);
      if (date <= now) continue;
      const c = ctx(date);
      await Notifications.scheduleNotificationAsync({ content: { title: nd.title, body: nd.body, data: { screen: 'name-report', angle: nd.angle, firstName: c.firstName } }, trigger: trigger(date) });
      n++;
    }
  }
  return n;
}
