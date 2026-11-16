// Daily nudges for users who have not bought the Name Report (the future reading is free).
// Pure functions: scheduling and copy only. The app schedules the result as local notifications.
export type Angle =
  | 'personalDay' | 'missingDigits' | 'nameCheck' | 'forecast' | 'languages'
  | 'value' | 'luckyColour' | 'arrow' | 'routinePlan' | 'phoneCheck';

export const ANGLES: Angle[] = [
  'personalDay', 'missingDigits', 'nameCheck', 'forecast', 'languages',
  'value', 'luckyColour', 'arrow', 'routinePlan', 'phoneCheck',
];

export type NudgeContext = {
  firstName: string;
  personalDay: number;
  nextMonthNumber: number;
  missing: number[]; // missing Lo Shu digits
  luckyColour: string;
};

export type Nudge = { angle: Angle; title: string; body: string; day: number };

export function copyFor(angle: Angle, c: NudgeContext): { title: string; body: string } {
  const miss = c.missing.length ? c.missing.join(', ') : 'none';
  // The future reading is free. Every angle points at the paid Name Report.
  switch (angle) {
    case 'personalDay': return { title: `Today is a ${c.personalDay} day, ${c.firstName}`, body: 'Does your name number work with it? Your Name Report shows where it stands.' };
    case 'missingDigits': return { title: 'Can your name add a missing digit?', body: c.missing.length ? `Your grid is missing ${miss}. See how each spelling option changes it.` : 'Your grid has every digit. See what your name adds on top.' };
    case 'nameCheck': return { title: 'Is your name working for you?', body: 'See spelling options and which number each one gives.' };
    case 'forecast': return { title: `Next month is a ${c.nextMonthNumber} month`, body: 'Check your name against the year ahead in the Name Report.' };
    case 'languages': return { title: 'Your Name Report, your language', body: 'Comes in English, Hindi, Tamil, German, French and 20 more languages.' };
    case 'value': return { title: 'One price, yours for good', body: 'The Name Report is $9.99 once, and includes 5 free checks every day for life.' };
    case 'luckyColour': return { title: `Your colour today: ${c.luckyColour}`, body: 'The Name Report also checks your name against your lucky numbers.' };
    case 'arrow': return { title: 'What does your name add to your grid?', body: 'See which Lo Shu lines your name number makes stronger.' };
    case 'routinePlan': return { title: 'How to start a new spelling', body: 'Step by step: signature, documents and everyday use.' };
    case 'phoneCheck': return { title: 'Does your phone number match you?', body: 'Check phone, vehicle and house numbers in the Name Report.' };
  }
}

export type NudgeState = { optedIn: boolean; purchased: boolean; startDay: number; lastOpenDay: number };

/** Next `count` days of nudges, starting at `today` (integer day index). Empty when not allowed. */
export function plan(state: NudgeState, today: number, count: number, ctx: NudgeContext, pauseAfterIdleDays = 30): Nudge[] {
  if (!state.optedIn || state.purchased) return [];
  if (today - state.lastOpenDay > pauseAfterIdleDays) return [];
  const out: Nudge[] = [];
  for (let d = today; d < today + count; d++) {
    const angle = ANGLES[(((d - state.startDay) % ANGLES.length) + ANGLES.length) % ANGLES.length];
    out.push({ angle, day: d, ...copyFor(angle, ctx) });
  }
  return out;
}
