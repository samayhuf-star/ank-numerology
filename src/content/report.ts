// Long-form copy for the paid Full Future Report. Written as reflection prompts, not guarantees.
// Wellbeing text is lifestyle only and never medical advice.

export type Area = { career: string; money: string; love: string; wellbeing: string; remedy: string };

export const AREA: Record<number, Area> = {
  1: {
    career: 'You do best where you can decide and be seen deciding: your own business, a team you lead, or a role with clear ownership. Being one of many in a slow chain drains you. Pick one bold project each year and let your name sit on it.',
    money: 'Money tends to come through initiative rather than salary alone. You earn well when you start, sell or lead. Your risk is spending on image or gambling on pride. Keep a fixed reserve you do not touch while chasing the next big move.',
    love: 'You love loyally and want respect in return. You can sound commanding when you mean to be protective. Ask before you decide for two, and say the soft thing out loud as often as the strong one.',
    wellbeing: 'Your energy runs high and then crashes. Build a morning routine with sunlight and movement, and take real days off before you are forced to. Watch long hours of tension in the head and shoulders.',
    remedy: 'Start the day facing the morning sun for a few minutes. Wear or carry gold or orange on days that matter. Sunday suits fresh starts. Giving wheat or jaggery to someone in need is the traditional gesture.',
  },
  2: {
    career: 'You shine in roles built on trust: advising, designing, caring, hosting, negotiating, or any partnership. You read a room before anyone speaks. Choose workplaces where kindness is not treated as weakness.',
    money: 'You do better with a partner or a team than alone, and you tend to save quietly. Your risk is lending to people you cannot say no to. Decide a monthly amount you are willing to give away, and hold the line.',
    love: 'You feel deeply and remember everything. You need calm, warm words more than gifts. When you go quiet, say so, rather than hoping to be guessed.',
    wellbeing: 'Your mood follows the moon and your sleep. Keep fixed sleep hours, drink enough water, and protect evenings from noise. Gentle walks near water or green spaces restore you faster than push-hard workouts.',
    remedy: 'White and cream suit you. Monday is a good day to start gentle things. Offering milk or rice, or simply sitting quietly at dusk, is the traditional practice.',
  },
  3: {
    career: 'You grow by teaching, advising, writing, speaking, law, or guiding people. You carry more wisdom than you give yourself credit for. Choose one subject to be known for and go deep rather than wide.',
    money: 'Money improves when you share knowledge and get paid for it. You are generous and can overspend on others or on learning. Pay yourself first each month, then be generous with the rest.',
    love: 'You are warm, honest and a good talker. You may lecture when you should listen. Plan simple shared rituals, and let your partner finish before you offer the answer.',
    wellbeing: 'You may carry stress in digestion and the lower back when life gets scattered. Keep meals regular, stretch daily, and avoid doing five things at once.',
    remedy: 'Yellow suits you. Thursday is your day for study, teaching and blessings. Giving books, food or help to a teacher or elder is the traditional practice.',
  },
  4: {
    career: 'You are the one who makes systems work: engineering, technology, operations, research, accounts, building. You see flaws others miss. Pick work with clear structure and room to improve it, and avoid pointless politics.',
    money: 'You build slowly and steadily, with sudden turns now and then. Keep records, avoid shortcuts and schemes, and treat unusual offers with suspicion. Your wealth is made by systems, not by luck.',
    love: 'You show love by doing, fixing and providing, and may forget to say it. Plan regular, small, warm gestures. Do not let suspicion write the story before you have asked.',
    wellbeing: 'Overthinking and irregular routine are your triggers. Fix your sleep and meal times, move your body daily, and take real breaks from screens. Unpredictable moods ease when your day has a clear shape.',
    remedy: 'Blue and grey suit you. Saturday is your day for discipline and clearing clutter. Helping workers or those in need without announcing it is the traditional practice.',
  },
  5: {
    career: 'You win through speed, communication and people: trade, sales, media, travel, marketing, consulting. You learn fast and adapt faster. Keep a few lines of income so boredom does not decide for you.',
    money: 'You are good with money and with opportunities. You also spend as fast as you earn when bored. Automate savings the day income arrives, and take only risks you can describe in one sentence.',
    love: 'You are charming and playful, and need freedom without distance. Commitment feels easier when it still includes novelty. Say what you need before restlessness starts speaking for you.',
    wellbeing: 'Your nervous system runs fast. Protect sleep, cut late-night scrolling, and stay hydrated. Short, varied exercise suits you better than a rigid plan.',
    remedy: 'Green suits you. Wednesday suits learning, trade and communication. Feeding birds or donating green vegetables is the traditional gesture.',
  },
  6: {
    career: 'You do well in beauty, arts, hospitality, wellness, design, teaching and family business: anywhere warmth and taste matter. You hold teams together. Do not let helpfulness become unpaid extra work.',
    money: 'Comfort comes naturally to you, and so does spending on home, family and appearance. Decide a monthly budget for pleasure and keep a separate fund for family needs, so one does not eat the other.',
    love: 'You are devoted and want a beautiful, peaceful home. You can over-give and then feel unseen. Say what you need while you still feel generous, not after resentment builds.',
    wellbeing: 'Rich food, sweets and late evenings can add up. Keep home meals simple and walk after dinner. Time with people you love is real medicine for you, but keep time for yourself too.',
    remedy: 'Pink and light blue suit you. Friday suits beauty, love and celebration. Fresh flowers at home and giving to women in need is the traditional practice.',
  },
  7: {
    career: 'You are a researcher and a thinker: analysis, writing, study, spirituality, technology, healing arts. You need depth and quiet. Choose roles that reward judgment over constant meetings.',
    money: 'Money is not your first interest, which is why it needs a system. Automate savings and bills, and use a trusted adviser for big decisions. Your insight is valuable; learn to price it.',
    love: 'You need space to think and a partner who does not take that personally. Share your inner world in small doses. Silence is not distance, but your partner cannot see that unless you tell them.',
    wellbeing: 'Your mind keeps working when your body should rest. Keep screen-free time, spend time in nature, and keep a simple reflective habit such as a short evening journal.',
    remedy: 'Sea green and white suit you. Monday is calm and reflective. Quiet time at a place of worship or in nature is the traditional practice.',
  },
  8: {
    career: 'You are built for the long game: business, law, property, administration, large organisations. Rewards come later than for others, and larger. Do not compare your year three with someone else\'s year one.',
    money: 'Wealth comes through disciplined work, patience and responsibility. Delays are real, so build slowly and avoid debt taken out of pride. Pay people fairly and on time. That is part of your luck.',
    love: 'You love seriously, and work can leave little energy for tenderness. Be on time, show up, and say thank you often. A small warm gesture each day matters more than an annual grand one.',
    wellbeing: 'You carry heaviness in the body when overworked: back, joints, tiredness. Keep strict rest days, and build slow strength, such as walking, stretching or yoga, into your week.',
    remedy: 'Dark blue and black suit you. Saturday is for discipline and service. Helping workers, the elderly or those in need, quietly and regularly, is the traditional practice.',
  },
  9: {
    career: 'You are driven, direct and brave: defence, sport, surgery, construction, leadership, entrepreneurship, activism. You thrive on action and finishing. Pick causes bigger than yourself and avoid roles that are all talk.',
    money: 'You earn through energy and courage, and can spend the same way, quickly and on impulse. Wait 48 hours before big purchases, and keep part of your income out of reach for impulse moments.',
    love: 'You are passionate, generous and protective. Temper can arrive faster than you mean it to. Pause before you answer when angry, and apologise first when you are wrong. It costs you nothing and earns a lot.',
    wellbeing: 'You carry a lot of heat: anger, head tension, injuries from rushing. Burn it off with daily vigorous movement, and cool down with water and early nights.',
    remedy: 'Red, gold and warm orange suit you. Tuesday and Thursday are your days for action and generosity. Giving food to those in need and helping with a real cause is the traditional practice.',
  },
};

export type YearDeep = { headline: string; story: string; do: string[]; avoid: string[]; money: string; relationships: string; work: string };

export const YEAR_DEEP: Record<number, YearDeep> = {
  1: { headline: 'A year to start', story: 'A new nine-year cycle opens. Whatever you plant now sets the tone for years. Doors tend to open for people who move first, and the main risk is waiting for a perfect moment that never comes.',
    do: ['Launch the project, job change or habit you keep postponing', 'Make decisions yourself and say them plainly', 'Meet new people and be visible'], avoid: ['Waiting for permission', 'Starting five things at once', 'Arguing about small points'],
    money: 'Income grows through initiative. Set one clear target and take one bold step toward it in the first quarter.', relationships: 'New people arrive; existing relationships ask you to treat them as equals, not followers.', work: 'Put your name on something. Leadership chances tend to come early in the year.' },
  2: { headline: 'A year to build patiently', story: 'After a push, the pace slows. Partnerships, listening and quiet progress matter more than speed. What looks slow is root growth.',
    do: ['Work with a partner or a team', 'Listen first and decide after', 'Repair a strained relationship'], avoid: ['Forcing results', 'Taking sides in other people\'s quarrels', 'Deciding while hurt'],
    money: 'Steady beats spectacular. Joint ventures and savings plans work well; one-person gambles do not.', relationships: 'A good year to deepen bonds, apologise, forgive and be forgiven.', work: 'Support roles and joint projects reward you. Be patient with approvals and replies.' },
  3: { headline: 'A year to express', story: 'Ideas, speech and creativity come alive. People are ready to hear you. The risk is spreading yourself too thin over too many invitations.',
    do: ['Write, teach, post, perform or pitch', 'Say yes to events that grow your circle', 'Finish a creative project'], avoid: ['Gossip and exaggeration', 'Overspending on fun', 'Leaving things half done'],
    money: 'Money follows visibility. Share your knowledge and price it. Watch social spending.', relationships: 'Social life expands. Be honest rather than just charming.', work: 'Communication roles, teaching and advising go well. Pick one message and repeat it.' },
  4: { headline: 'A year to build the base', story: 'A hardworking year. Paperwork, routines, health habits and savings matter more than excitement. What you structure now holds weight for the next five years.',
    do: ['Fix systems, records, taxes and contracts', 'Build a savings and fitness routine', 'Learn a practical skill'], avoid: ['Shortcuts and risky schemes', 'Rigid thinking', 'Overworking without rest'],
    money: 'Slow growth and tidy accounts. Avoid speculation. Clear old debts.', relationships: 'Commitment through action. Show up, fix things, and say the caring words too.', work: 'Operations, planning and technical work pay off. Delays are normal, not a verdict.' },
  5: { headline: 'A year of change', story: 'Things move. Travel, new people, sudden offers and shifts of plan are likely. Freedom is the gift; scattered energy is the cost.',
    do: ['Say yes to travel, learning and new contacts', 'Keep a clear weekly plan so change does not become chaos', 'Try a new way of earning'], avoid: ['Impulsive big commitments', 'Burning bridges', 'Overpromising your time'],
    money: 'Opportunities arrive quickly, and so does spending. Automate savings, and test risks small.', relationships: 'New connections and shifting bonds. Be clear about what you want before you promise.', work: 'Sales, media, trade and travel-related work do well. Move, but with a plan.' },
  6: { headline: 'A year of home and care', story: 'Family, home, relationships and responsibility come to the front. Beauty and comfort matter. The risk is carrying everyone else\'s load.',
    do: ['Invest in home, health and close relationships', 'Take on responsibility you actually want', 'Make your space beautiful'], avoid: ['Over-giving until resentful', 'Overspending on comfort', 'Meddling in other people\'s choices'],
    money: 'Spending on home and family rises. Budget for it, and keep a separate reserve.', relationships: 'A good year for marriage, family decisions and deeper commitment.', work: 'Service, design, teaching and care roles are favoured. Do not work for free by default.' },
  7: { headline: 'A year to study and reflect', story: 'The outer world slows so the inner one can catch up. Study, rest, research and review matter more than launches. Answers come in quiet.',
    do: ['Study, research and reflect', 'Rest, travel for rest, spend time in nature', 'Review the last six years honestly'], avoid: ['Big launches or major risks', 'Isolating from people who love you', 'Doubting yourself into inaction'],
    money: 'Not a year for speculation. Review, learn, plan and wait for next year to push.', relationships: 'You may want space. Say so kindly, and stay in touch with those who matter.', work: 'Research, writing, training and planning go well. Visible launches go slower.' },
  8: { headline: 'A year of money and authority', story: 'Results arrive: earnings, responsibility, authority and consequences, good and bad. This is a year to be fair, disciplined and ambitious in the same breath.',
    do: ['Go after a bigger role, deal or income target', 'Keep precise accounts and contracts', 'Be fair and keep promises'], avoid: ['Harshness with yourself or others', 'Debt taken on out of pride', 'Skipping rest'],
    money: 'Business and income results are strongest. Keep clean books, pay on time, and invest in assets, not show.', relationships: 'Work can crowd out love. Schedule time, and show up when you said you would.', work: 'Authority, promotion and larger projects are possible. Delay is part of the test.' },
  9: { headline: 'A year to complete', story: 'A nine-year cycle closes. Finish what is finished, forgive what needs forgiving and let go of what has run its course. This clears the way for the new cycle ahead.',
    do: ['Finish projects and close old loops', 'Let go of people, habits and things that have run their course', 'Give, serve and forgive'], avoid: ['Starting large new ventures', 'Clinging to the past', 'Anger over what cannot change'],
    money: 'Clear debts and tidy accounts. Give where you can. New investments are better timed for next year.', relationships: 'Some bonds end gently and some deepen. Release without bitterness.', work: 'Wrap up, hand over, train successors. Plant the idea for next year, but do not launch it yet.' },
};

export const MONTH_NOTE: Record<number, { mood: string; use: string; care: string }> = {
  1: { mood: 'Fresh energy and a push to begin', use: 'Start the new thing, ask for the role, make the first call', care: 'Impatience and rushing others' },
  2: { mood: 'Gentle, relational and slower', use: 'Listen, repair, partner up, finish quiet tasks', care: 'Oversensitivity and indecision' },
  3: { mood: 'Social, creative and talkative', use: 'Publish, pitch, teach, meet people', care: 'Scattered focus and overspending' },
  4: { mood: 'Practical and heavy on detail', use: 'Paperwork, planning, savings, health routines', care: 'Rigidity and overwork' },
  5: { mood: 'Quick, changeable and restless', use: 'Travel, sales, learning, new contacts', care: 'Impulsive promises and spending' },
  6: { mood: 'Warm, homely and responsible', use: 'Family, home, relationships, beautifying your space', care: 'Over-giving and resentment' },
  7: { mood: 'Quiet, inward and thoughtful', use: 'Study, rest, review, plan', care: 'Withdrawal and overthinking' },
  8: { mood: 'Driven, serious and money-focused', use: 'Business deals, big goals, finances, authority tasks', care: 'Harshness and overwork' },
  9: { mood: 'Intense, closing and generous', use: 'Finish, give, clear out, forgive', care: 'Temper and clinging to the past' },
};

export const PAIR_NOTE = (m: number, b: number): string => {
  if (m === b) return `Your Mulank and Bhagyank are both ${m}. The same energy shows up in who you are and where life is taking you, which gives you unusual clarity and little contradiction. The cost is that the shadow side repeats too. Work on the watch-outs deliberately, because nothing balances them for you.`;
  const flow = [[1, 5], [1, 3], [1, 9], [2, 7], [3, 5], [3, 9], [4, 8], [5, 6], [6, 8], [6, 9]].some(([x, y]) => (x === m && y === b) || (x === b && y === m));
  return flow
    ? `Your Mulank ${m} and Bhagyank ${b} tend to work with each other. What you naturally do supports where life is taking you, so effort feels more rewarded and less forced. Use this: when you are unsure, act in line with both numbers together.`
    : `Your Mulank ${m} and Bhagyank ${b} pull in somewhat different directions. This is not bad luck; it is a growth edge. Early life can feel like being asked to be two people. Over time you learn to use ${m} for how you work and ${b} for where you are heading, and that tension becomes depth.`;
};
