// Traditional Lo Shu / Indian numerology associations, written as prompts for reflection.
// Source tables for "friendly numbers" must be cited before launch (see launch checklist).
export const PLANET: Record<number, string> = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

export const MULANK: Record<number, { short: string; strengths: string; watch: string; work: string }> = {
  1: { short: 'Leader. Independent, ambitious, likes to go first.', strengths: 'Initiative, confidence, drive', watch: 'Stubbornness, ego, impatience with advice', work: 'Leadership, own business, government, sport' },
  2: { short: 'Peacemaker. Sensitive, cooperative, intuitive.', strengths: 'Empathy, tact, partnership', watch: 'Mood swings, indecision, over-pleasing', work: 'Counselling, design, hospitality, teamwork roles' },
  3: { short: 'Communicator. Optimistic, creative, a natural teacher.', strengths: 'Expression, wisdom, optimism', watch: 'Scattered focus, pride, overspending', work: 'Teaching, advisory, writing, law' },
  4: { short: 'Builder. Practical, disciplined, unconventional.', strengths: 'Structure, persistence, analysis', watch: 'Rigidity, suspicion, sudden swings', work: 'Engineering, technology, operations, research' },
  5: { short: 'Mover. Quick, curious, good with people and money.', strengths: 'Adaptability, speed, communication', watch: 'Restlessness, nervousness, overcommitting', work: 'Trade, media, sales, travel' },
  6: { short: 'Carer. Warm, artistic, devoted to home.', strengths: 'Charm, responsibility, taste', watch: 'Indulgence, jealousy, over-giving', work: 'Arts, hospitality, wellness, design' },
  7: { short: 'Seeker. Reflective, analytical, private.', strengths: 'Insight, research, independence', watch: 'Withdrawal, doubt, restlessness', work: 'Research, spirituality, writing, analysis' },
  8: { short: 'Achiever. Disciplined, patient, built for the long game.', strengths: 'Endurance, authority, practicality', watch: 'Heaviness, delay, harshness with self', work: 'Business, law, property, administration' },
  9: { short: 'Energetic, direct and generous. Acts first, plans second.', strengths: 'Courage, energy, generosity, finishes what it starts once committed', watch: 'Impatience, short temper, taking on other people\'s problems', work: 'Action and clear goals: operations, sales, engineering, business' },
};

export const BHAGYANK: Record<number, { theme: string; tension: string }> = {
  1: { theme: 'Becoming your own authority', tension: 'Going alone versus asking for help' },
  2: { theme: 'Learning partnership and patience', tension: 'Pleasing others versus your own view' },
  3: { theme: 'Teaching, advising and expressing', tension: 'Many interests versus one finished thing' },
  4: { theme: 'Building something solid through steady work and structure', tension: 'Speed versus patience: structure pays slowly' },
  5: { theme: 'Change, freedom and communication', tension: 'Variety versus commitment' },
  6: { theme: 'Home, care and responsibility', tension: 'Duty versus personal space' },
  7: { theme: 'Study, inner life and depth', tension: 'Solitude versus connection' },
  8: { theme: 'Work, money and authority earned over time', tension: 'Results versus rest' },
  9: { theme: 'Service, completion and wide concern', tension: 'Letting go versus holding on' },
};

export const DIGIT_HAVE: Record<number, { area: string; meaning: string }> = {
  1: { area: 'Willpower, self-expression', meaning: 'You start things and speak up' },
  2: { area: 'Intuition, sensitivity', meaning: 'You read people well' },
  3: { area: 'Imagination, intellect', meaning: 'Ideas come easily' },
  4: { area: 'Order, practicality', meaning: 'You build routine and finish tasks' },
  5: { area: 'Balance, memory', meaning: 'You adapt and keep steady' },
  6: { area: 'Home, care', meaning: 'You make time for family' },
  7: { area: 'Analysis, inner life', meaning: 'You think things through alone' },
  8: { area: 'Money discipline', meaning: 'You handle money with care' },
  9: { area: 'Ambition, humanity', meaning: 'Big goals, concern for others, strong drive' },
};

export const DIGIT_MISSING: Record<number, { area: string; pattern: string; practice: string }> = {
  1: { area: 'Self-expression', pattern: 'You may hold back your view', practice: 'Say one clear opinion each day' },
  2: { area: 'Sensitivity', pattern: 'You may miss how others feel', practice: 'Ask one caring question daily' },
  3: { area: 'Ideas', pattern: 'Slow to start creative work', practice: 'Write or sketch for 10 minutes daily' },
  4: { area: 'Order, routine', pattern: 'You may skip planning', practice: 'Keep one fixed daily schedule' },
  5: { area: 'Balance, memory', pattern: 'Mood swings, forgetting', practice: 'Short daily review of what you did' },
  6: { area: 'Home, care', pattern: 'Family time slips', practice: 'Book family time weekly' },
  7: { area: 'Reflection', pattern: 'Acting without pausing', practice: 'Ten quiet minutes each day' },
  8: { area: 'Money discipline', pattern: 'Spending without tracking', practice: 'Track spending on the 1st of each month' },
  9: { area: 'Purpose', pattern: 'Goals feel vague', practice: 'Write one goal and one deadline' },
};

export const ARROW_MISSING: Record<string, string> = {
  planning: 'Plans may stay loose. Write the plan and the first step.',
  willpower: 'Follow-through can fade. Make small commitments and keep them.',
  action: 'Ideas may not become action. Start with five minutes.',
  determination: 'A tendency to hesitate or delay commitments. Set deadlines, tell someone your deadline, and review weekly.',
  intuition: 'You may over-rely on proof. Notice first impressions, then check facts.',
};

export const YEAR_THEME: Record<number, { name: string; focus: string }> = {
  1: { name: 'Beginnings', focus: 'Start the thing you have put off' },
  2: { name: 'Patience', focus: 'Partnerships, listening, small steady steps' },
  3: { name: 'Expression', focus: 'Speak, write, publish, meet people' },
  4: { name: 'Structure', focus: 'Routine, savings, paperwork. Build the base' },
  5: { name: 'Change', focus: 'Travel, new people, risk. Practise balance' },
  6: { name: 'Home and care', focus: 'Family and commitments' },
  7: { name: 'Study and rest', focus: 'Reflect, learn, review' },
  8: { name: 'Money and authority', focus: 'Business and money results. Track spending' },
  9: { name: 'Completion', focus: 'Let go of what is done. Close loops' },
};

export const DAY_GOOD: Record<number, { good: string; easy: string }> = {
  1: { good: 'Starting things, leading, decisions', easy: 'Arguments over small points' },
  2: { good: 'Listening, partnerships, quiet work', easy: 'Rushing others' },
  3: { good: 'Sending that message, creative work, meeting friends', easy: 'Scattering energy across too many tasks' },
  4: { good: 'Planning, paperwork, finishing chores', easy: 'Big spontaneous decisions' },
  5: { good: 'Travel, sales, learning something new', easy: 'Overcommitting your time' },
  6: { good: 'Family, care, beautifying your space', easy: 'Taking on everyone\'s problems' },
  7: { good: 'Study, reflection, time alone', easy: 'Large social plans' },
  8: { good: 'Money tasks, business, long-term goals', easy: 'Harsh words, overworking' },
  9: { good: 'Finishing, giving, clearing clutter', easy: 'Starting big new projects' },
};

export const LUCKY: Record<number, { colours: string; days: string }> = {
  1: { colours: 'Gold, orange', days: 'Sunday' }, 2: { colours: 'White, cream', days: 'Monday' },
  3: { colours: 'Yellow', days: 'Thursday' }, 4: { colours: 'Blue, grey', days: 'Saturday' },
  5: { colours: 'Green', days: 'Wednesday' }, 6: { colours: 'Pink, light blue', days: 'Friday' },
  7: { colours: 'Sea green, white', days: 'Monday' }, 8: { colours: 'Dark blue, black', days: 'Saturday' },
  9: { colours: 'Red, gold, warm orange', days: 'Tuesday, Thursday' },
};
export const luckyColourShort = (n: number) => LUCKY[n].colours.split(',')[0];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
