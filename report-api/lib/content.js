// Rich English interpretation copy for the full Name Report (10-20 pages).
// Non-English locales fall back to English until native-reviewed translations land.

const PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

const MULANK = {
  1: { title: 'The Leader', planet: 'Sun',
    summary: 'Independent, original and driven. You are happiest setting your own direction and dislike being controlled.',
    strengths: 'Leadership, originality, courage, strong will, ambition.',
    challenges: 'Ego, stubbornness, impatience, difficulty taking orders.',
    career: 'Founder, manager, government, pioneer roles, anything where you lead.',
    relationships: 'Loyal and protective, but needs a partner who respects your independence.',
    health: 'Watch the heart, eyes and blood pressure; sunlight and rest restore you.' },
  2: { title: 'The Diplomat', planet: 'Moon',
    summary: 'Gentle, intuitive and cooperative. You read people well and bring harmony to any group.',
    strengths: 'Sensitivity, tact, teamwork, imagination, patience.',
    challenges: 'Over-sensitivity, mood swings, indecision, dependence on others.',
    career: 'Counselling, hospitality, design, partnerships, support roles.',
    relationships: 'Caring and romantic; needs reassurance and emotional safety.',
    health: 'Mind digestion, sleep and fluid balance; water and routine help.' },
  3: { title: 'The Communicator', planet: 'Jupiter',
    summary: 'Expressive, optimistic and creative. Words, teaching and warmth are your gifts.',
    strengths: 'Creativity, optimism, expression, knowledge, generosity.',
    challenges: 'Scattered energy, over-talking, exaggeration, impatience with detail.',
    career: 'Teaching, writing, media, law, advisory, performing arts.',
    relationships: 'Fun and sociable; thrives with someone who shares your curiosity.',
    health: 'Mind the liver, weight and throat; moderation keeps you well.' },
  4: { title: 'The Builder', planet: 'Rahu',
    summary: 'Practical, systematic and reliable. You build things that last, step by step.',
    strengths: 'Discipline, method, reliability, hard work, honesty.',
    challenges: 'Rigidity, over-caution, resistance to change, overwork.',
    career: 'Engineering, operations, real estate, systems, skilled trades.',
    relationships: 'Steady and dependable; shows love through actions, not words.',
    health: 'Watch the nervous system and back; grounding and breaks matter.' },
  5: { title: 'The Explorer', planet: 'Mercury',
    summary: 'Versatile, quick and freedom-loving. You crave change, travel and new experiences.',
    strengths: 'Adaptability, communication, wit, networking, resourcefulness.',
    challenges: 'Restlessness, inconsistency, impulsiveness, over-indulgence.',
    career: 'Sales, trading, marketing, travel, tech, anything fast-moving.',
    relationships: 'Charming and playful; needs space and mental stimulation.',
    health: 'Mind the nerves and skin; calm the mind, avoid stimulants.' },
  6: { title: 'The Nurturer', planet: 'Venus',
    summary: 'Caring, responsible and artistic. Home, beauty and people you love come first.',
    strengths: 'Love, responsibility, aesthetics, harmony, service.',
    challenges: 'Worry, over-giving, perfectionism, difficulty saying no.',
    career: 'Design, wellness, hospitality, healing, family business, the arts.',
    relationships: 'Deeply devoted and nurturing; home and family are central.',
    health: 'Mind the throat, kidneys and heart; beauty and rest heal you.' },
  7: { title: 'The Seeker', planet: 'Ketu',
    summary: 'Thoughtful, analytical and spiritual. You are drawn to depth and the questions behind things.',
    strengths: 'Analysis, intuition, research, independence, depth.',
    challenges: 'Isolation, over-thinking, scepticism, detachment.',
    career: 'Research, spirituality, analysis, IT, investigation, writing.',
    relationships: 'Private and loyal; needs solitude and a partner who understands it.',
    health: 'Mind anxiety and the nervous system; nature and quiet restore you.' },
  8: { title: 'The Executive', planet: 'Saturn',
    summary: 'Ambitious, organised and resilient. Built for responsibility, money and the long game.',
    strengths: 'Ambition, management, endurance, fairness, material focus.',
    challenges: 'Workaholism, hardness, delays, pressure, control.',
    career: 'Business, finance, law, administration, large organisations.',
    relationships: 'Protective and committed; success and security express love.',
    health: 'Mind bones, joints and teeth; patience and discipline pay off.' },
  9: { title: 'The Humanitarian', planet: 'Mars',
    summary: 'Generous, courageous and idealistic. You feel strongly and want your work to mean something.',
    strengths: 'Courage, compassion, energy, idealism, leadership.',
    challenges: 'Temper, impatience, impulsiveness, taking on too much.',
    career: 'Defence, medicine, social work, sport, causes, surgery.',
    relationships: 'Passionate and protective; needs a cause and a loyal partner.',
    health: 'Mind inflammation, accidents and blood; exercise channels your fire.' },
};

const BHAGYANK = {
  1: 'Your destiny rewards initiative, leadership and standing on your own. Life pushes you to the front.',
  2: 'Your path unfolds through relationships, patience and cooperation. You are meant to bring people together.',
  3: 'Life opens up through self-expression, learning and joy. Knowledge and communication carry you.',
  4: 'Your fortune is built through discipline, structure and honest effort over time. No shortcuts, but solid ground.',
  5: 'Change is your destiny: travel, adaptability and variety. You are meant to move and connect.',
  6: 'Your path is care, family and responsibility carried gracefully. Beauty and service are your fortune.',
  7: 'Your destiny is inward: wisdom, specialisation and quiet mastery. Depth over noise.',
  8: 'You are meant for achievement, authority and material results earned through persistence.',
  9: 'Your destiny is to give: service, compassion and a wider cause larger than yourself.',
};

const DIGIT_HAVE = {
  1: 'A strong sense of self, individuality and the confidence to express who you are.',
  2: 'Sensitivity, intuition and tact — you feel the room and handle people with care.',
  3: 'Imagination and mental creativity — ideas, words and images come easily.',
  4: 'Practicality and hands-on ability — you can organise and build in the real world.',
  5: 'Emotional balance and a steady centre — the heart of the grid holds you together.',
  6: 'Love of home, creativity and care — you create beauty and look after others.',
  7: 'Learning through experience — you grow wiser through what life hands you.',
  8: 'A sense of order, method and detail — you bring system to everything.',
  9: 'Ambition, drive and humanity — energy and a wish to serve a bigger purpose.',
};

const DIGIT_MISSING = {
  1: { lesson: 'Finding your voice and asserting yourself takes conscious effort.', remedy: 'Speak up early; keep small promises to yourself to build self-trust.' },
  2: { lesson: 'Trusting intuition and reading others can be a growth area.', remedy: 'Pause before deciding; notice first impressions and honour them.' },
  3: { lesson: 'Putting thoughts into words or images may need practice.', remedy: 'Write or sketch daily, even a line; share one idea a day.' },
  4: { lesson: 'Routine, order and follow-through are worth building deliberately.', remedy: 'Use checklists and fixed times; finish one task before the next.' },
  5: { lesson: 'Staying emotionally balanced under pressure is a lesson.', remedy: 'Breathe before reacting; keep a steady daily rhythm.' },
  6: { lesson: 'Expressing care and creating a settled home is a theme to grow into.', remedy: 'Make small acts of care a habit; tend your space.' },
  7: { lesson: 'Patience and learning from setbacks is part of your path.', remedy: 'Reflect on lessons, not losses; make time for quiet study.' },
  8: { lesson: 'Method, detail and money-management reward attention.', remedy: 'Track income and spending; master one system at a time.' },
  9: { lesson: 'Channelling drive toward a bigger purpose is the work.', remedy: 'Give time to a cause; aim energy at something beyond yourself.' },
};

const YEAR_THEME = {
  1: 'Beginnings. Plant seeds, start fresh, take the lead. What you begin now sets the tone for nine years.',
  2: 'Patience and partnership. Build relationships, cooperate, let things ripen. Slow is the right speed.',
  3: 'Expression and joy. Create, socialise, communicate. Your optimism attracts opportunity.',
  4: 'Work and foundations. Build structure, be disciplined, handle the details. Effort now pays later.',
  5: 'Change and freedom. Expect movement, travel and new paths. Stay flexible and open.',
  6: 'Responsibility and home. Family, love and duty take centre stage. Nurture what matters.',
  7: 'Reflection and depth. Study, rest, go inward. A year to understand rather than push.',
  8: 'Power and reward. Ambition, money and recognition come into focus. Act with integrity.',
  9: 'Completion and release. Finish, forgive, let go. Clear the ground for a new cycle.',
};

const LUCKY = {
  1: { colour: 'Gold, orange, yellow', avoid: 'Black, dark blue', days: 'Sunday, Monday', friendly: [1,2,3,9], gem: 'Ruby', metal: 'Gold', direction: 'East', deity: 'Surya' },
  2: { colour: 'White, cream, light green', avoid: 'Red, black', days: 'Sunday, Monday, Friday', friendly: [1,2,7], gem: 'Pearl', metal: 'Silver', direction: 'North-West', deity: 'Chandra' },
  3: { colour: 'Yellow, gold, purple', avoid: 'Blue', days: 'Thursday, Friday', friendly: [3,6,9], gem: 'Yellow Sapphire', metal: 'Gold', direction: 'North-East', deity: 'Brihaspati' },
  4: { colour: 'Grey, blue, electric shades', avoid: 'Bright red', days: 'Saturday, Sunday', friendly: [1,4,8], gem: 'Hessonite (Gomed)', metal: 'Mixed', direction: 'South-West', deity: 'Rahu' },
  5: { colour: 'Green, light grey, white', avoid: 'Dark shades', days: 'Wednesday, Friday', friendly: [1,3,5], gem: 'Emerald', metal: 'Bronze', direction: 'North', deity: 'Budha' },
  6: { colour: 'Blue, pink, white', avoid: 'Black', days: 'Friday, Tuesday', friendly: [3,6,9], gem: 'Diamond / White Sapphire', metal: 'Silver', direction: 'South-East', deity: 'Shukra' },
  7: { colour: 'Light green, white, pale shades', avoid: 'Dark red', days: 'Sunday, Monday', friendly: [2,4,7], gem: "Cat's Eye", metal: 'Mixed', direction: 'South', deity: 'Ketu' },
  8: { colour: 'Dark blue, black, grey', avoid: 'Bright orange', days: 'Saturday, Sunday', friendly: [4,5,8], gem: 'Blue Sapphire', metal: 'Iron', direction: 'West', deity: 'Shani' },
  9: { colour: 'Red, pink, crimson', avoid: 'Black', days: 'Tuesday, Thursday', friendly: [3,6,9], gem: 'Red Coral', metal: 'Copper', direction: 'South', deity: 'Mangal' },
};

// Compatibility by Mulank: friendly / neutral / challenging
const COMPAT = {
  1: { friendly: [1,2,3,5,9], neutral: [4,6], challenging: [7,8] },
  2: { friendly: [1,2,5,7], neutral: [3,4,9], challenging: [6,8] },
  3: { friendly: [3,5,6,9], neutral: [1,2,7], challenging: [4,8] },
  4: { friendly: [1,5,6,7,8], neutral: [4,9], challenging: [2,3] },
  5: { friendly: [1,3,5,6,9], neutral: [2,4,7], challenging: [8] },
  6: { friendly: [3,5,6,8,9], neutral: [1,2], challenging: [4,7] },
  7: { friendly: [1,4,5,7], neutral: [2,6], challenging: [3,8,9] },
  8: { friendly: [4,5,6,8], neutral: [1,7], challenging: [2,3,9] },
  9: { friendly: [1,3,5,6,9], neutral: [2,4], challenging: [7,8] },
};

const PLANES = {
  thinking: 'the Mind — how you think, plan and imagine',
  feeling: 'the Heart — how you feel, relate and create',
  practical: 'the Hands — how you act, organise and build',
};
const ARROWS = {
  planning: 'a gift for order, method and seeing a project through',
  willpower: 'strong determination and the will to push past obstacles',
  action: 'restless energy and a drive to keep busy and active',
  determination: 'persistence — once decided, you rarely give up',
  intuition: 'a natural inner knowing and spiritual sensitivity',
};
const ARROWS_MISSING = {
  planning: 'Structure and follow-through are worth building with lists and routines.',
  willpower: 'Confidence under pressure grows with small, kept commitments.',
  action: 'Momentum helps — start before you feel ready.',
  determination: 'Finishing what you start is the lesson; pick fewer things, complete them.',
  intuition: 'Trusting your gut improves with quiet reflection and practice.',
};

const AFFIRMATIONS = {
  1: 'I lead my own life with confidence and courage.',
  2: 'I trust my intuition and create harmony around me.',
  3: 'I express myself freely and attract joy.',
  4: 'I build my future with patience and discipline.',
  5: 'I welcome change and move with freedom.',
  6: 'I give and receive love, and my home is my strength.',
  7: 'I trust the wisdom I gain from every experience.',
  8: 'I manage my world with fairness and achieve lasting success.',
  9: 'I use my energy to serve a purpose greater than myself.',
};

module.exports = { PLANET, MULANK, BHAGYANK, DIGIT_HAVE, DIGIT_MISSING, YEAR_THEME, LUCKY, COMPAT, PLANES, ARROWS, ARROWS_MISSING, AFFIRMATIONS };
