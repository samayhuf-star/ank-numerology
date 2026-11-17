// Long-form reference tables for the Complete Report. All text is original and written as prompts for reflection,
// in the Indian / Chaldean tradition. Planetary friendships follow the classical Parashari table.

export type Profile = {
  planet: string; element: string; nature: string; keywords: string[];
  core: string[]; inner: string;
  career: string; careers: string[]; money: string; love: string; family: string; health: string; spirit: string;
  strengths: string[]; challenges: string[];
  gem: string; metal: string; direction: string; mantra: string; colours: string; avoidColours: string; days: string; avoidDays: string;
  dates: string; pinnacle: string; challenge: string;
};

export const NUM: Record<number, Profile> = {
  1: {
    planet: 'Sun', element: 'Fire', nature: 'Active, leading, self-starting', keywords: ['Leadership', 'Independence', 'Initiative', 'Pride'],
    core: [
      'Number 1 people are the ones who go first. You like to decide, to start and to own the result. Even in a group you tend to end up holding the plan, because you cannot stay comfortable waiting for someone else to begin.',
      'Your best quality is clarity of purpose. When you know what you want, you move with a steadiness that other people borrow. Your weak point is the same energy turned inward: a fixed idea of how things should be done, and little patience for advice that arrives uninvited.',
      'You grow fastest when you lead by example instead of by pressure. Share credit early, ask one real question before you decide, and your natural authority starts to feel safe to the people around you.',
    ],
    inner: 'Inside, you carry a quiet need to be respected. Praise matters to you more than you admit, and being overlooked stings. You recover quickly, but you rarely forget.',
    career: 'You do well where you can decide, carry responsibility and be seen for results. You usually feel stuck in roles with many approvers and slow feedback.',
    careers: ['Own business or startup', 'Senior management', 'Government and administration', 'Politics and public life', 'Sport and coaching', 'Medicine and surgery'],
    money: 'Money comes through initiative and position, not through waiting. You earn well when you hold the lead, and you spend well on image and comfort. Keep a fixed saving habit so that pride never becomes the reason for a large purchase.',
    love: 'You love with loyalty and warmth, and you want a partner who admires you without competing. Arguments start when you try to win instead of to understand. Letting your partner lead sometimes is a real gift.',
    family: 'You are the protector of the family and often its quiet decision maker. Children respond to your confidence. Take care not to let your standards sound like criticism.',
    health: 'Tendencies concentrate around the heart, back, eyes and blood pressure, often through stress and pride. Regular exercise, sun in the morning and real rest keep your energy even. This is not medical advice.',
    spirit: 'Your spiritual work is humility: learning to serve without needing to be seen. Morning routines, sunrise practice and gratitude suit you.',
    strengths: ['Decisive', 'Brave', 'Self-driven', 'Generous when respected', 'Natural leader'],
    challenges: ['Ego', 'Stubbornness', 'Impatience', 'Hard to take advice', 'Overworking'],
    gem: 'Ruby (or garnet / red spinel as gentler substitutes)', metal: 'Gold or copper', direction: 'East', mantra: 'Om Suryaya Namah', colours: 'Gold, orange, warm yellow', avoidColours: 'Black, dark blue', days: 'Sunday, Monday', avoidDays: 'Saturday',
    dates: '1, 10, 19, 28', pinnacle: 'A phase of taking charge: promotion, independence, a visible role. Use it to build something under your own name.', challenge: 'The lesson is to lead without dominating. Practise listening to the end before answering.',
  },
  2: {
    planet: 'Moon', element: 'Water', nature: 'Receptive, caring, intuitive', keywords: ['Sensitivity', 'Partnership', 'Intuition', 'Patience'],
    core: [
      'Number 2 people read the room before they speak. You notice moods, small changes in tone and what is not being said, and you tend to adjust yourself so that the group stays at ease. That makes you a trusted friend and an excellent partner.',
      'Your strength is empathy and tact. Your weakness is that you can lose your own view while keeping others comfortable. When you stay quiet for peace, a resentment can build unseen.',
      'You thrive when you keep one clear boundary and one honest sentence a day. Partnerships work best when you say what you need early, in a calm voice, instead of hoping to be guessed.',
    ],
    inner: 'Your moods move like tides. Some days you are warm and certain, other days you doubt everything. Regular sleep and a steady routine are your anchors.',
    career: 'You shine in roles that involve care, design, mediation, or teamwork, and you do your best work in a pair. Pressure and open conflict drain you quickly.',
    careers: ['Counselling and therapy', 'Hospitality and food', 'Design and fine arts', 'Nursing and caregiving', 'HR and mediation', 'Shipping, water and dairy trades'],
    money: 'Money comes through steady work and good partnerships. Spending follows mood, so give yourself a 24 hour pause before any large purchase. Joint ventures work for you if roles and shares are written down.',
    love: 'You are a devoted, gentle partner who loves deeply and remembers small things. You need reassurance in words. Avoid testing a partner with silence. Ask directly instead.',
    family: 'Home is your base and you keep the family connected. You often carry the emotional load unseen. Share it before it turns into fatigue.',
    health: 'Tendencies concentrate around digestion, sleep, water balance and nerves. Warm food, a quiet evening and time near water help. This is not medical advice.',
    spirit: 'Your practice is trust. Evening reflection, music, prayer by water and journaling suit you.',
    strengths: ['Empathetic', 'Diplomatic', 'Loyal', 'Intuitive', 'Good listener'],
    challenges: ['Mood swings', 'Indecision', 'Over-pleasing', 'Oversensitivity', 'Dependence on approval'],
    gem: 'Pearl (or moonstone)', metal: 'Silver', direction: 'North-west', mantra: 'Om Chandraya Namah', colours: 'White, cream, pale green', avoidColours: 'Red, black', days: 'Monday, Sunday', avoidDays: 'Saturday',
    dates: '2, 11, 20, 29', pinnacle: 'A phase of partnership and patience: collaboration, marriage or a close alliance moves forward. Results come gradually.', challenge: 'The lesson is to hold your own view while staying kind. Say one honest thing a day.',
  },
  3: {
    planet: 'Jupiter', element: 'Ether', nature: 'Expressive, wise, expanding', keywords: ['Expression', 'Wisdom', 'Optimism', 'Teaching'],
    core: [
      'Number 3 people carry a natural optimism and a gift for explaining things. You like ideas, conversation and the feeling of growing. Others come to you for advice, even when you do not feel like an expert.',
      'Your strength is vision and generosity. Your weakness is spreading yourself across many interests, or speaking with more certainty than the facts support. Pride in your own knowledge can slow your learning.',
      'You flourish when you pick one subject and teach it for years. Depth turns your charm into authority, and authority is what makes your advice count.',
    ],
    inner: 'You believe things will work out, and often they do, but you dislike being questioned on details. Keep a notebook so that big ideas become small steps.',
    career: 'You do well in teaching, advising, writing, law, finance and any role that rewards judgement and communication. You need room to grow, and dislike close micromanagement.',
    careers: ['Teaching and training', 'Law and advisory', 'Banking and finance', 'Writing, publishing, media', 'Spiritual and wellness guidance', 'Consulting'],
    money: 'Wealth builds slowly through knowledge and trust. You are generous and can overspend on others or on learning. Set aside a fixed portion before you give.',
    love: 'You are warm, cheerful and idealistic in love. You want a partner who respects your mind. Conflicts arise when you lecture. Ask for their view first.',
    family: 'You are the teacher of the family, often the source of values. Children learn from your stories more than your rules.',
    health: 'Tendencies concentrate around the liver, weight, thighs and sugar balance, mostly through rich food and low movement. Walk daily and moderate sweets. This is not medical advice.',
    spirit: 'Your path is wisdom with humility. Study, teaching, charity and a regular Thursday practice suit you.',
    strengths: ['Wise', 'Optimistic', 'Articulate', 'Generous', 'Principled'],
    challenges: ['Scattered focus', 'Overconfidence', 'Overspending', 'Preachiness', 'Weight and sugar'],
    gem: 'Yellow sapphire (or citrine / yellow topaz)', metal: 'Gold', direction: 'North-east', mantra: 'Om Gurave Namah', colours: 'Yellow, saffron, cream', avoidColours: 'Black, dark grey', days: 'Thursday, Sunday', avoidDays: 'Wednesday, Friday',
    dates: '3, 12, 21, 30', pinnacle: 'A phase of growth and recognition: studies, teaching, advisory roles and expansion open up. Learning pays well now.', challenge: 'The lesson is focus. Finish one project before starting the next.',
  },
  4: {
    planet: 'Rahu', element: 'Air', nature: 'Practical, unconventional, intense', keywords: ['Structure', 'Persistence', 'Analysis', 'Non-conformity'],
    core: [
      'Number 4 people build. You see how things are put together, and you are comfortable with long, careful work that others skip. You often think differently from the crowd, and you are not easily impressed by tradition for its own sake.',
      'Your strength is discipline and original thinking. Your weakness is a tendency to expect obstacles, to guard yourself and to swing suddenly between enthusiasm and withdrawal. Life often tests you on stability first and rewards you later.',
      'You succeed when you keep systems simple and routines fixed. Writing a plan, tracking progress and asking a trusted person to review your decisions protect you from sudden mistakes.',
    ],
    inner: 'You feel things strongly but keep them private. When you feel unseen, you can become blunt or defensive. A few honest friends matter more than many acquaintances.',
    career: 'You do well in technical, analytical and structural fields: engineering, technology, research, operations, real estate and unconventional businesses. Predictable, rule-heavy workplaces may feel limiting.',
    careers: ['Engineering and construction', 'Software and technology', 'Research and analytics', 'Real estate and land', 'Operations and logistics', 'Politics and activism'],
    money: 'Income rises step by step, often after delays. You can have sudden gains and sudden losses, so keep a reserve and avoid speculation. Put agreements in writing.',
    love: 'You are loyal but reserved, and you show love through practical help. You need space and a partner who accepts your unusual views. Talk before suspicion grows.',
    family: 'You protect the family by planning for it. Avoid being strict by habit. Children need to hear that you are proud, not only that you are watching.',
    health: 'Tendencies concentrate around nerves, skin, sleep and the digestive tract, usually under stress. Steady routine, early sleep and reduced screens help. This is not medical advice.',
    spirit: 'Your path is steadiness and truth. Structured practice, service work and honest accounts help to calm restlessness.',
    strengths: ['Disciplined', 'Original', 'Dependable', 'Analytical', 'Hard-working'],
    challenges: ['Rigidity', 'Suspicion', 'Sudden mood change', 'Delays', 'Difficulty trusting'],
    gem: 'Hessonite (gomed) (traditional; many prefer a plain blue or grey stone)', metal: 'Mixed alloy', direction: 'South-west', mantra: 'Om Rahave Namah', colours: 'Blue, grey, earth tones', avoidColours: 'Red, black', days: 'Saturday, Sunday, Monday', avoidDays: 'Tuesday',
    dates: '4, 13, 22, 31', pinnacle: 'A phase of building: a base is laid through steady effort, property, systems or a new skill. Slow progress is the point.', challenge: 'The lesson is patience with structure. Do the boring step every day.',
  },
  5: {
    planet: 'Mercury', element: 'Earth / Air', nature: 'Quick, versatile, communicative', keywords: ['Speed', 'Communication', 'Trade', 'Freedom'],
    core: [
      'Number 5 people move fast in mind and body. You learn quickly, adapt easily and enjoy variety. You are good with words, with numbers and with people, and you tend to see opportunity before others do.',
      'Your strength is flexibility and wit. Your weakness is restlessness: starting more than you finish, changing direction when it gets routine and spending faster than you earn. Nerves can also run ahead of rest.',
      'You succeed when you set short, visible goals and keep one fixed commitment as an anchor. Freedom works best inside a frame.',
    ],
    inner: 'You get bored easily and anxious when nothing changes. A walk, a call or a new task usually fixes the feeling. Avoid solving boredom with risk.',
    career: 'You do well in trade, sales, media, travel, marketing, technology and any work that needs talking, numbers and speed. You dislike repetition and rigid hours.',
    careers: ['Trade and commerce', 'Sales and marketing', 'Media and communication', 'Travel and transport', 'Accounting and analytics', 'Technology and startups'],
    money: 'You can earn quickly through deals, skills and contacts. Money also leaves quickly. Automate savings and keep large decisions for a calm day.',
    love: 'You are charming, playful and curious. You want a partner who keeps pace with your mind. Commitment works better when it stays fresh through shared plans and travel.',
    family: 'You keep the family lively and informed. Children enjoy your humour. Be present for routine moments too, not only for the exciting ones.',
    health: 'Tendencies concentrate around the nervous system, lungs, skin and sleep. Breathing practice, early sleep and fewer stimulants steady you. This is not medical advice.',
    spirit: 'Your path is focus. Short daily practice, breath work and learning through travel suit you.',
    strengths: ['Quick learner', 'Adaptable', 'Persuasive', 'Money-minded', 'Curious'],
    challenges: ['Restlessness', 'Nervousness', 'Overcommitting', 'Impulsive spending', 'Inconsistency'],
    gem: 'Emerald (or green aventurine / peridot)', metal: 'Brass or bronze', direction: 'North', mantra: 'Om Budhaya Namah', colours: 'Green, light grey, white', avoidColours: 'Dark red', days: 'Wednesday, Friday', avoidDays: 'Tuesday, Thursday',
    dates: '5, 14, 23', pinnacle: 'A phase of change and movement: travel, relocation, new contacts and new methods. Keep options open and decisions documented.', challenge: 'The lesson is commitment. Choose one direction for ninety days.',
  },
  6: {
    planet: 'Venus', element: 'Water / Earth', nature: 'Harmonious, artistic, devoted', keywords: ['Love', 'Beauty', 'Responsibility', 'Comfort'],
    core: [
      'Number 6 people care about beauty, comfort and the people close to them. You have taste, a warm presence and a gift for making a place feel like home. People trust you with their feelings.',
      'Your strength is warmth and responsibility. Your weakness is giving too much, expecting appreciation in return and sometimes holding on to people or habits that you should release. Comfort can also turn into indulgence.',
      'You flourish when you give with limits and receive without guilt. A pleasant routine, a clean space and honest conversations keep your life balanced.',
    ],
    inner: 'You feel responsible for other people\'s happiness. When something is out of harmony at home, it follows you everywhere. Rest is not selfish for you. It is maintenance.',
    career: 'You do well in the arts, hospitality, beauty, fashion, wellness, education and any role that involves caring for people or creating something lovely.',
    careers: ['Design, fashion and beauty', 'Arts, music and film', 'Hospitality and events', 'Healthcare and wellness', 'Teaching and childcare', 'Luxury and lifestyle business'],
    money: 'You earn through skill, taste and relationships. You spend on home, family and comfort. Set a fixed budget for pleasure so that generosity never strains your savings.',
    love: 'You are romantic, loyal and generous. You want security and affection. Jealousy and expectation are your trouble spots. Say what you want clearly instead of waiting to be understood.',
    family: 'You are the heart of the family and often its host. You carry more than you show. Ask for help early.',
    health: 'Tendencies concentrate around the throat, kidneys, hormones, weight and sugar, often linked to comfort eating. Balanced meals and regular movement help. This is not medical advice.',
    spirit: 'Your path is love without attachment. Devotional music, flowers, service and a Friday practice suit you.',
    strengths: ['Caring', 'Artistic', 'Responsible', 'Charming', 'Loyal'],
    challenges: ['Over-giving', 'Jealousy', 'Indulgence', 'Perfectionism at home', 'Taking criticism personally'],
    gem: 'Diamond (or white sapphire / opal / zircon)', metal: 'Silver or platinum', direction: 'South-east', mantra: 'Om Shukraya Namah', colours: 'White, pink, pastel blue', avoidColours: 'Orange, dark red', days: 'Friday, Wednesday', avoidDays: 'Sunday, Monday',
    dates: '6, 15, 24', pinnacle: 'A phase of home and relationships: marriage, family growth, a new home or a creative project that grows with care.', challenge: 'The lesson is balance. Give from surplus, not from exhaustion.',
  },
  7: {
    planet: 'Ketu', element: 'Air / Ether', nature: 'Reflective, analytical, detached', keywords: ['Insight', 'Research', 'Solitude', 'Spirituality'],
    core: [
      'Number 7 people live partly in thought. You observe, analyse and look for the reason behind things. You value privacy, and you often feel you were born a little outside the crowd.',
      'Your strength is depth and independent judgement. Your weakness is withdrawal: doubting too long, keeping feelings to yourself and finding it hard to ask for help. Others may read your quiet as coldness.',
      'You are at your best when you give your mind a focused field to study and give your heart a small, safe circle. Share one thought a day with someone you trust.',
    ],
    inner: 'You carry a rich inner life and a need for quiet. Too much noise or too many people tire you. Time alone is your recharge, not a problem.',
    career: 'You do well in research, science, analysis, writing, healing, spirituality and technical specialities. You prefer to work independently and dislike constant meetings.',
    careers: ['Research and science', 'Data and analysis', 'Writing and philosophy', 'Healing and counselling', 'Astrology and spirituality', 'Specialist technical work'],
    money: 'Income comes through expertise, not through hustle. You may undervalue your own work. Price it, state it and keep records. Avoid lending because of sympathy.',
    love: 'You are loyal, thoughtful and private in love. You need a partner who respects quiet and does not push for constant talk. Tell them when you are retreating and when you will be back.',
    family: 'You teach by example and prefer a calm home. Make time for shared meals so that your presence is felt, not only assumed.',
    health: 'Tendencies concentrate around the nerves, sleep, stomach and skin, often through overthinking. Quiet walks, a consistent bedtime and time in nature help. This is not medical advice.',
    spirit: 'This is the most spiritual number. Meditation, silence, study and time near water or in nature suit you.',
    strengths: ['Insightful', 'Independent', 'Analytical', 'Calm under pressure', 'Intuitive'],
    challenges: ['Withdrawal', 'Overthinking', 'Doubt', 'Hard to ask for help', 'Misread as cold'],
    gem: 'Cat\'s eye (or moonstone / pearl as gentler substitutes)', metal: 'Mixed alloy or silver', direction: 'South', mantra: 'Om Ketave Namah', colours: 'Sea green, white, soft yellow', avoidColours: 'Dark red, black', days: 'Monday, Sunday', avoidDays: 'Saturday',
    dates: '7, 16, 25', pinnacle: 'A phase of study and inner work: research, a retreat, a spiritual turn or deeper expertise. Rest is productive here.', challenge: 'The lesson is trust. Let one person in on your plans.',
  },
  8: {
    planet: 'Saturn', element: 'Air / Earth', nature: 'Disciplined, enduring, karmic', keywords: ['Discipline', 'Authority', 'Karma', 'Endurance'],
    core: [
      'Number 8 people are built for the long road. You take responsibility seriously, and life often hands you more of it than you asked for. Results come later than you expect, and they tend to last.',
      'Your strength is endurance and judgement. Your weakness is heaviness: expecting the worst, working too long without rest, and being hard on yourself and on others. You may feel older than your age when you are young, and younger later.',
      'You grow by being fair, patient and consistent. Treat time as an ally, give credit to people who help, and let yourself enjoy a result before chasing the next one.',
    ],
    inner: 'You do not show how much you feel. You may carry duty for years before anyone notices. Celebration and rest are not rewards for you, they are required maintenance.',
    career: 'You do well in business, law, administration, construction, industry, mining, property and large organisations. Authority builds slowly but holds.',
    careers: ['Business and industry', 'Law and justice', 'Administration and government', 'Property and construction', 'Finance and auditing', 'Manufacturing and metals'],
    money: 'Money comes through steady work and time. Early years may feel tight. Later, wealth is solid. Avoid shortcuts and agreements that rely on trust only. Pay debts on time.',
    love: 'You are serious, loyal and slow to open. Affection shows as support. Speak warm words aloud. Do not assume that they are understood.',
    family: 'You are the pillar of the family. Take care that responsibility does not become control. Allow others to share the load.',
    health: 'Tendencies concentrate around bones, joints, teeth, knees and fatigue, often from long work. Stretching, calcium rich food and regular rest help. This is not medical advice.',
    spirit: 'Your path is service and surrender. Saturday practice, charity to workers and the elderly, and disciplined silence suit you.',
    strengths: ['Patient', 'Responsible', 'Fair', 'Strong under pressure', 'Long-term thinker'],
    challenges: ['Heaviness', 'Delays', 'Harshness with self', 'Pessimism', 'Overwork'],
    gem: 'Blue sapphire (strong; try a substitute such as amethyst or blue iolite first)', metal: 'Iron or steel', direction: 'West', mantra: 'Om Shanaishcharaya Namah', colours: 'Dark blue, black, deep grey', avoidColours: 'Red, bright orange', days: 'Saturday, Wednesday, Friday', avoidDays: 'Sunday, Tuesday',
    dates: '8, 17, 26', pinnacle: 'A phase of authority and results: a senior position, a larger business or a long project that pays now. Hard work shows.', challenge: 'The lesson is balance of work and rest. Schedule one full day off each week.',
  },
  9: {
    planet: 'Mars', element: 'Fire', nature: 'Energetic, courageous, driven', keywords: ['Courage', 'Energy', 'Humanitarian', 'Completion'],
    core: [
      'Number 9 people act. You are brave, direct and generous, and you finish what you commit to. You often take the side of the person who needs defending, and you will work hard for a cause you believe in.',
      'Your strength is courage and a big heart. Your weakness is a short fuse, impatience and taking on problems that are not yours. The same fire that protects people can burn a relationship in one sharp sentence.',
      'You flourish when you pick a goal, move your body daily and pause before reacting. Count to ten, then speak. Your best leadership is protective, not forceful.',
    ],
    inner: 'You carry a lot of fire and a surprising amount of tenderness. When you are hurt, you answer with anger first. Physical activity is the best release for you.',
    career: 'You do well in action-oriented work: the armed services, police, sport, surgery, engineering, real estate, entrepreneurship and campaigns for a cause.',
    careers: ['Defence, police and security', 'Sport and fitness', 'Surgery and emergency care', 'Engineering and construction', 'Real estate and land', 'Social causes and NGOs'],
    money: 'You earn through energy, courage and bold moves. You can spend impulsively or give away more than you should. Set a fixed saving and a fixed giving amount each month.',
    love: 'You are passionate, protective and loyal. Arguments flare fast and fade fast, but words can stay. Apologise early. Your partner needs to feel safe in your anger.',
    family: 'You are the family\'s defender. Channel the protection into planning and doing, not into control. Children admire your courage. Show them your gentle side too.',
    health: 'Tendencies concentrate around blood pressure, heat, injuries, headaches and inflammation. Regular exercise, cooling food and anger release practice help. This is not medical advice.',
    spirit: 'Your path is compassion. Service, sport as meditation and a Tuesday practice suit you. Letting go of grudges is the real strength training.',
    strengths: ['Courageous', 'Generous', 'Decisive', 'Energetic', 'Protective'],
    challenges: ['Anger', 'Impatience', 'Taking risks', 'Overextending', 'Holding grudges'],
    gem: 'Red coral', metal: 'Copper', direction: 'South', mantra: 'Om Mangalaya Namah', colours: 'Red, maroon, coral, saffron', avoidColours: 'Black, dark blue', days: 'Tuesday, Thursday, Sunday', avoidDays: 'Wednesday',
    dates: '9, 18, 27', pinnacle: 'A phase of action and completion: a big push, a finished project or a cause you commit to. Energy is high, so pace yourself.', challenge: 'The lesson is to cool before reacting. Move your body first, speak second.',
  },
};

/** Classical planetary friendship between the nine number planets (Parashari). */
export const REL: Record<number, { friend: number[]; neutral: number[]; enemy: number[] }> = {
  1: { friend: [2, 3, 9], neutral: [5], enemy: [6, 8, 4, 7] },
  2: { friend: [1, 5], neutral: [3, 6, 8, 9], enemy: [4, 7] },
  3: { friend: [1, 2, 9], neutral: [8], enemy: [5, 6, 4, 7] },
  4: { friend: [5, 6, 8], neutral: [3], enemy: [1, 2, 9] },
  5: { friend: [1, 6], neutral: [3, 8, 9, 7], enemy: [2, 4] },
  6: { friend: [5, 8, 4, 7], neutral: [3, 9], enemy: [1, 2] },
  7: { friend: [9, 6, 8], neutral: [5, 3], enemy: [1, 2] },
  8: { friend: [5, 6, 4], neutral: [3], enemy: [1, 2, 9] },
  9: { friend: [1, 2, 3], neutral: [6, 8, 7], enemy: [5] },
};

export type Rel = 'same' | 'friend' | 'neutral' | 'enemy';
export const relation = (a: number, b: number): Rel => a === b ? 'same' : REL[a].friend.includes(b) ? 'friend' : REL[a].enemy.includes(b) ? 'enemy' : 'neutral';
export const REL_TEXT: Record<Rel, string> = {
  same: 'Same energy. It repeats and strengthens the number.',
  friend: 'Friendly. The two support each other.',
  neutral: 'Neutral. Neither helps nor hinders much.',
  enemy: 'Tense. The two pull in different directions and need care.',
};

export const PAIR_LIFE: Record<string, string> = {
  same: 'In relationships and business the same number doubles the strengths and the faults. You understand each other quickly and may amplify the same blind spot.',
  friend: 'This is a naturally supportive pairing. Each side comes easily to the other and goals tend to line up.',
  neutral: 'This pairing depends on effort. There is no pull in either direction, so shared habits and clear talk decide the result.',
  enemy: 'This pairing brings friction. Different speeds and values show up quickly. It can work, but needs patience, clear roles and respect for differences.',
};

/** Chaldean compound numbers 10–52 with their traditional titles. Descriptions are original. */
export const COMPOUND: Record<number, { title: string; mood: 'good' | 'mixed' | 'caution'; text: string }> = {
  10: { title: 'Wheel of Fortune', mood: 'good', text: 'Rise and fall in turn. Honour and good luck come, and so do reversals. Success holds when it is built on steady work and not on one lucky turn.' },
  11: { title: 'Clenched Hand', mood: 'caution', text: 'Hidden tests and private struggles. Strength is there, but so are traps set by others or by haste. Care in contracts and trust is essential.' },
  12: { title: 'The Sacrifice', mood: 'caution', text: 'Anxiety and a sense of carrying the weight of others. Wise handling turns this into leadership. Avoid becoming the one who always gives in.' },
  13: { title: 'Upheaval and Rebuilding', mood: 'caution', text: 'Big changes that clear the old to make room for the new. Often called a karmic number. Work, discipline and patience turn disruption into progress.' },
  14: { title: 'Movement and Risk', mood: 'mixed', text: 'Travel, change, speculation and talent with words. Gains are real, and so are impulsive mistakes. Plan before moving and do not gamble.' },
  15: { title: 'The Magician', mood: 'good', text: 'Charm, skill and persuasion. People are drawn to you and money is attracted. Use influence honestly, because the same gift can mislead.' },
  16: { title: 'The Shattered Tower', mood: 'caution', text: 'A pride that is tested by sudden loss or exposure. Ego and over-reliance on plans are the warning. Humility keeps it from happening.' },
  17: { title: 'Star of the Magi', mood: 'good', text: 'Protection, peace and lasting success after a hard stretch. Considered one of the most favourable numbers. Keeps its promise when you stay principled.' },
  18: { title: 'Spirit Against Matter', mood: 'caution', text: 'A conflict between material goals and deeper values, with quarrels and rivalries. Handle disputes calmly and avoid shortcuts.' },
  19: { title: 'Prince of Heaven', mood: 'good', text: 'Honour, leadership and success earned through merit. A karmic tone of independence: do not isolate yourself, and do not become overbearing.' },
  20: { title: 'The Awakening', mood: 'good', text: 'A call to new purpose, a calling or reckoning. Plans made in earlier years finally move. Listen to the inner voice and act on it.' },
  21: { title: 'Crown of the Magi', mood: 'good', text: 'Advancement, reward and honours after effort. Success usually arrives in the later part of a project. Keep going through the middle.' },
  22: { title: 'Good Man, Submission', mood: 'caution', text: 'Kindness that others can exploit, and plans that stall under pressure. Strong boundaries and good advisers protect you.' },
  23: { title: 'Royal Star of the Lion', mood: 'good', text: 'Success, protection of seniors and help from people in power. Gains through communication and trade. Remain grateful to supporters.' },
  24: { title: 'Love and Prosperity', mood: 'good', text: 'Good fortune in love, money and partnerships, and help from others. Keep promises and avoid favouritism.' },
  25: { title: 'Observer and Analyst', mood: 'mixed', text: 'Success through study, patience and the lessons of early setbacks. Insight grows by testing ideas. Avoid cynicism.' },
  26: { title: 'Partnership Warning', mood: 'caution', text: 'Partnerships and shared money can bring loss when trust is placed carelessly. Vet partners and keep clear records.' },
  27: { title: 'The Sceptre', mood: 'good', text: 'Authority, reward for effort and the ability to lead. Strong creative and organising power. Use command with fairness.' },
  28: { title: 'Trust and Contradiction', mood: 'mixed', text: 'Leadership that is tested by reversals, delays and reliance on others. Keep a reserve and a plan B. Persist.' },
  29: { title: 'Uncertainty and Deception', mood: 'caution', text: 'Mixed signals, unreliable allies and changes of plan. Verify claims and move slowly in new ventures and new friendships.' },
  30: { title: 'The Thinker', mood: 'mixed', text: 'A deep, independent mind that works best alone. Success comes from thought and craft. Risk is isolation, so stay connected.' },
  31: { title: 'The Recluse', mood: 'mixed', text: 'Self-contained, private and able to build quietly. Success through focus. Watch for stubbornness and keep a few close allies.' },
  32: { title: 'Communicator', mood: 'good', text: 'Magnetism and gifts in speech and exchange. Good for business and public roles. Steady commitment prevents scattering.' },
  33: { title: 'Love and Fortune', mood: 'good', text: 'Warmth, favourable relationships and good luck through people. Avoid favouritism and stay grounded.' },
  34: { title: 'Analyst of Detail', mood: 'mixed', text: 'Skill in finer points, patience and learning from experience. Early delay is followed by steady gains.' },
  35: { title: 'Partnership Caution', mood: 'caution', text: 'Joint money and contracts need care. Honest records, written terms and a cautious partner choice protect you.' },
  36: { title: 'The Sceptre of Service', mood: 'good', text: 'Authority exercised through service, with creative and caring gifts. Gains come through loyal teams.' },
  37: { title: 'Good Fortune in Partnerships', mood: 'good', text: 'Successful alliances, friendships and love. Do not rely only on luck. Maintain the relationships that support you.' },
  38: { title: 'Reliance on Others', mood: 'mixed', text: 'Success depends on helpers and timing. Build a small trusted team and do not carry everything alone.' },
  39: { title: 'Uncertain Ground', mood: 'caution', text: 'Changing circumstances and unreliable promises. Verify before committing and keep your own backup.' },
  40: { title: 'The Planner', mood: 'good', text: 'Strong planning, organisation and endurance. Progress through method. Allow room for people and feelings.' },
  41: { title: 'The Self-Contained', mood: 'mixed', text: 'Independence and a gift for working alone. Real success when focused. Reach out before isolation sets in.' },
  42: { title: 'Communication and Contacts', mood: 'good', text: 'Expression, advice and travel favour you. Success through words, contacts and teaching.' },
  43: { title: 'Revolution and Disruption', mood: 'caution', text: 'Unrest, unexpected change and tension with authority. Stay steady, avoid rash steps and work through proper channels.' },
  44: { title: 'Trial by Difficulty', mood: 'caution', text: 'Obstacles that test resolve, often involving rivals. Strategy, patience and fair play carry you through.' },
  45: { title: 'Support and Protection', mood: 'good', text: 'Help from allies and gains after setbacks. Authority grows when you stay honest.' },
  46: { title: 'Gains Through Help', mood: 'good', text: 'Rewards from partnerships and from helping others. Good for teamwork and community roles.' },
  47: { title: 'Fortune in Relations', mood: 'good', text: 'Favourable partnerships and recognition. Keep promises and avoid overreach.' },
  48: { title: 'Help and Alliances', mood: 'good', text: 'Strong support from friends and helpers. Success comes through cooperation and shared goals.' },
  49: { title: 'Changing Fortune', mood: 'mixed', text: 'Ups and downs that teach resilience. Savings and reserves matter most.' },
  50: { title: 'Self-Reliance', mood: 'mixed', text: 'Strength in independence and some risk of loneliness. Succeeds when pride does not block cooperation.' },
  51: { title: 'The Warrior', mood: 'good', text: 'Courage, command and victory through action. Use force wisely, avoid unnecessary conflicts.' },
  52: { title: 'Intuition and Insight', mood: 'good', text: 'Intuitive judgement and a gift for guiding others. Success through trust in your instincts, checked by facts.' },
};
export const compound = (n: number) => COMPOUND[n] ?? null;

/** What each number brings when it appears as a pinnacle or personal cycle, by age band. */
export const AGE_BAND = ['Early life', 'Early adulthood', 'Mid life', 'Later life'];

/** Karmic debt numbers found in compound numbers. */
export const KARMIC_DEBT: Record<number, string> = {
  13: 'Linked to avoiding effort in the past. The lesson is steady, patient work. Shortcuts cost more than they save.',
  14: 'Linked to misuse of freedom or excess. The lesson is moderation and commitment. Choose a direction and stay with it.',
  16: 'Linked to ego and broken trust. The lesson is humility. Change comes suddenly when pride leads decisions.',
  19: 'Linked to misuse of power. The lesson is to lead with fairness and to accept help from others.',
};

/** Personal day number: best use. Used for the calendar. */
export const DAY_USE: Record<number, string> = {
  1: 'Start, decide, sign', 2: 'Listen, partner, wait', 3: 'Speak, write, meet', 4: 'Plan, file, repair',
  5: 'Travel, sell, learn', 6: 'Family, care, home', 7: 'Study, rest, reflect', 8: 'Money, business, goals', 9: 'Finish, give, clear',
};
export const DAY_START = [1, 3, 5, 8];
export const DAY_QUIET = [7, 9];

/** Pairing guide for a number with each other number (for partners, friends, co-founders). */
export const PAIR_NOTE_SHORT: Record<number, string> = {
  1: 'Brings drive and direction. Give credit, share decisions.',
  2: 'Brings calm and empathy. Speak plainly.',
  3: 'Brings advice and optimism. Do not lecture.',
  4: 'Brings structure and honesty. Keep an open mind.',
  5: 'Brings speed and ideas. Agree on commitments in writing.',
  6: 'Brings warmth and care. Do not take advantage.',
  7: 'Brings depth and independence. Respect quiet.',
  8: 'Brings discipline and long-term view. Show appreciation.',
  9: 'Brings courage and energy. Keep tempers cool.',
};
