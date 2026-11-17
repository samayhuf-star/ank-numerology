// Extended-chapter copy for the full (~60 page) Name Report. English only for now.
// Everything here is traditional numerology interpretation, written as tendencies, never as certainties.

const WORK = {
  1: { style: 'You work best with ownership: a clear goal, freedom in how you reach it and the authority to decide.', team: 'The one who sets direction and starts things.', pitfall: 'Doing everything yourself, or overriding people who think differently.', grow: 'Delegate one task a week and ask for input before you decide.' },
  2: { style: 'You work best in a calm, cooperative setting where your attention to people and detail is valued.', team: 'The glue: mediator, listener and quiet fixer.', pitfall: 'Avoiding hard conversations and taking criticism too personally.', grow: 'Say your view first in meetings, even if it is one sentence.' },
  3: { style: 'You work best where ideas, talking and variety are part of the day, and where you can show what you make.', team: 'The voice: pitching, teaching, presenting and cheering the room on.', pitfall: 'Starting many things, finishing few, and under-estimating admin.', grow: 'Pair every new idea with a deadline and one named next step.' },
  4: { style: 'You work best with a clear process, defined roles and time to do things properly.', team: 'The builder: planning, quality control and delivery.', pitfall: 'Resisting change and carrying more than your share out of habit.', grow: 'Try one small change to your routine each month on purpose.' },
  5: { style: 'You work best in fast, varied roles with movement, new people and quick feedback.', team: 'The connector: sales, networking, negotiating and troubleshooting.', pitfall: 'Boredom, restlessness and promising more than you can deliver.', grow: 'Commit to one long project and break it into short, visible wins.' },
  6: { style: 'You work best where you serve people, make things beautiful or keep a team healthy and together.', team: 'The carer: mentoring, hosting, service and standards.', pitfall: 'Taking on other people\'s problems and finding it hard to say no.', grow: 'Decide in advance what you will not take on, and say it kindly.' },
  7: { style: 'You work best with depth: research, analysis and long stretches of uninterrupted thinking.', team: 'The analyst: the person who checks the facts and sees what others miss.', pitfall: 'Withdrawing, over-analysing and keeping ideas to yourself.', grow: 'Share unfinished thinking early and let people react to it.' },
  8: { style: 'You work best with real responsibility: budgets, targets, teams and results you can measure.', team: 'The executive: strategy, money, structure and tough calls.', pitfall: 'Equating worth with output and being too hard on yourself or others.', grow: 'Schedule rest like a meeting and celebrate results out loud.' },
  9: { style: 'You work best when the work serves a bigger purpose and lets you use your energy and compassion.', team: 'The champion: motivating, campaigning and taking up a cause.', pitfall: 'Burning out, taking on too much and holding grudges when let down.', grow: 'Choose one cause to back fully instead of five to back partly.' },
};

const MONEY = {
  1: { style: 'You earn best when you lead or own the outcome. A fixed ceiling on income frustrates you.', build: 'Ventures, commissions, equity and roles with real authority.', risk: 'Big, ego-led bets and being reluctant to take advice on money.', tip: 'Keep a fixed reserve you never invest, then back yourself with the rest.' },
  2: { style: 'You earn steadily through partnerships and service, and you do well with a trusted money partner.', build: 'Steady salaries, joint ventures, hospitality, care and advisory work.', risk: 'Lending to friends and under-charging because you dislike negotiating.', tip: 'Write your rate down before every negotiation and do not discount on the spot.' },
  3: { style: 'Your income follows your visibility. The more people know what you offer, the more you earn.', build: 'Teaching, content, creative work, advisory and anything where your name builds value.', risk: 'Spending as freely as you earn and chasing several income ideas at once.', tip: 'Automate savings on the day income arrives, before the spending starts.' },
  4: { style: 'You build wealth slowly and solidly through discipline, property and systems.', build: 'Real estate, skilled trades, operations, savings plans and long-term assets.', risk: 'Being so careful that you miss good chances, or over-working for the same pay.', tip: 'Review your plan twice a year and allow one small, deliberate risk.' },
  5: { style: 'You earn through movement and deals: buying, selling, trading, travel and new markets.', build: 'Sales, trading, marketing, technology and anything with turnover and variety.', risk: 'Impulse spending, speculation and income that swings from month to month.', tip: 'Keep three months of costs in a boring account before taking any new risk.' },
  6: { style: 'You earn through care, trust and beauty, and money is closely tied to home and family.', build: 'Hospitality, design, education, wellness, family business and property.', risk: 'Over-spending on others and on comfort, or guaranteeing loans for family.', tip: 'Set a monthly giving budget so generosity stays a choice, not a leak.' },
  7: { style: 'You earn through expertise. People pay you for what you know that others do not.', build: 'Research, specialist consulting, technology, writing and finance analysis.', risk: 'Ignoring money matters, under-pricing yourself and avoiding sales.', tip: 'Put your pricing and invoicing on autopilot so money stays out of your head.' },
  8: { style: 'Money, power and responsibility are central themes, and you often earn more later than earlier.', build: 'Business ownership, management, finance, real estate and large-scale operations.', risk: 'Working for status, hard bargains that damage trust and cycles of big gain and big loss.', tip: 'Keep your dealings scrupulously fair; for you, reputation is the real balance sheet.' },
  9: { style: 'You earn through causes you believe in, and you are generous with money once you have it.', build: 'Healthcare, education, social enterprise, media, the arts and mission-led work.', risk: 'Giving away more than you can afford and leaving your own security till last.', tip: 'Pay yourself first: a fixed share to savings before any giving.' },
};

const LOVE = {
  1: { style: 'Loyal, direct and protective. You show love by taking charge and by fighting for the people you care about.', seeks: 'A partner with their own life and ambitions who respects your independence.', pitfall: 'Pride, giving orders and being slow to say sorry.', tip: 'Ask "What do you need from me right now?" before offering a solution.' },
  2: { style: 'Gentle, romantic and attentive. You notice moods and small details others miss.', seeks: 'Emotional safety, reassurance and a partner who listens without rushing.', pitfall: 'Holding hurt in silence and depending too much on one person.', tip: 'Say the small thing the day it happens, before it becomes a big thing.' },
  3: { style: 'Warm, playful and talkative. You keep a relationship alive with humour, words and new plans.', seeks: 'A partner who shares your curiosity and enjoys company and conversation.', pitfall: 'Flirting for attention, mood swings and avoiding serious talks with jokes.', tip: 'Make time for one conversation a week with no phones and no humour shield.' },
  4: { style: 'Steady and faithful. You show love through reliability, effort and building a shared future.', seeks: 'Stability, honesty and a partner who values commitment over drama.', pitfall: 'Being rigid, hard to surprise and quiet about feelings.', tip: 'Say "I love you" and "thank you" out loud, even if your actions already do.' },
  5: { style: 'Charming, adventurous and quick. You need a relationship that stays fresh and lets you breathe.', seeks: 'Fun, freedom, shared adventures and mental spark.', pitfall: 'Restlessness, mixed signals and leaving when it stops being new.', tip: 'Plan shared novelty on purpose: a trip, a class, a new routine together.' },
  6: { style: 'Devoted, caring and home-making. Love, family and beauty sit at the centre of your life.', seeks: 'A loving, committed partner and a warm, harmonious home.', pitfall: 'Controlling through care, jealousy and giving until you are drained.', tip: 'Let your partner care for you too, and ask for help without scorekeeping.' },
  7: { style: 'Private, thoughtful and loyal once trust is earned. You value depth over quantity.', seeks: 'A partner who gives you space, shares ideas and understands your silences.', pitfall: 'Withdrawing, being hard to read and keeping people at a distance.', tip: 'Tell your partner when you need quiet and when you will be back.' },
  8: { style: 'Committed and strong, with intense loyalty. You provide, protect and expect seriousness.', seeks: 'A partner you can respect, who matches your drive and is not intimidated by it.', pitfall: 'Putting work first, controlling money and hiding tenderness.', tip: 'Put one weekly date in the calendar with the same weight as a business meeting.' },
  9: { style: 'Passionate, generous and idealistic. You love big and forgive easily, though not forever.', seeks: 'Shared values, a sense of purpose and a partner who can keep up with your energy.', pitfall: 'Idealising people, temper flashes and holding on after it has ended.', tip: 'Choose partners for how they treat people when it is hard, not for their potential.' },
};

const HEALTH = {
  1: { focus: 'Heart, eyes, spine and blood pressure.', habits: 'Morning sunlight, regular cardio and honest rest. You tend to run on will until you crash.', watch: 'Stress headaches, overheating and ignoring early warning signs.' },
  2: { focus: 'Digestion, sleep, fluid balance and emotional wellbeing.', habits: 'A fixed sleep time, enough water, gentle exercise and time near water or nature.', watch: 'Mood swings, emotional eating and absorbing other people\'s stress.' },
  3: { focus: 'Liver, weight, throat and nerves.', habits: 'Moderation with food and drink, daily movement you enjoy and creative outlets.', watch: 'Over-indulgence, scattered energy and voice strain.' },
  4: { focus: 'Back, joints, nervous system and posture.', habits: 'Stretching, strength work, scheduled breaks and a firm stop-work time.', watch: 'Overwork, stiffness and worry that sits in the body.' },
  5: { focus: 'Nerves, lungs, skin and the digestive system.', habits: 'Variety in exercise, regular meals and breathing practices to slow the mind.', watch: 'Restlessness, insomnia and over-stimulation from too much input.' },
  6: { focus: 'Throat, kidneys, reproductive health and weight.', habits: 'Balanced meals, time for yourself and regular check-ups you do not postpone for others.', watch: 'Comfort eating, caring until exhausted and neglecting your own needs.' },
  7: { focus: 'Nerves, digestion, sleep and the immune system.', habits: 'Quiet time daily, nature, meditation and a consistent sleep routine.', watch: 'Overthinking, isolation and low energy when you skip solitude.' },
  8: { focus: 'Bones, joints, teeth, knees and chronic tension.', habits: 'Strength training, warmth, regular rest and holidays you actually take.', watch: 'Burnout, long working hours and carrying stress for years.' },
  9: { focus: 'Blood, muscles, head, inflammation and accident-proneness.', habits: 'Vigorous exercise, a cooling diet and a clear outlet for anger and energy.', watch: 'Impatience, short temper, injuries from rushing and overdoing it.' },
};

// Each vocation lists the Mulank/Bhagyank/Name numbers that traditionally suit it.
const VOCATIONS = [
  ['Entrepreneur / founder', [1, 8, 5]], ['Senior manager / executive', [1, 8, 4]], ['Government / administration', [1, 4, 8]],
  ['Teacher / lecturer / trainer', [3, 6, 2]], ['Writer / editor / journalist', [3, 5, 7]], ['Lawyer / judge / advisor', [3, 8, 6]],
  ['Doctor / nurse / healer', [6, 9, 2]], ['Counsellor / therapist / coach', [2, 6, 7]], ['Engineer / architect', [4, 8, 1]],
  ['Software / data / technology', [4, 5, 7]], ['Research / science / analysis', [7, 4, 2]], ['Accountant / auditor / banker', [8, 4, 6]],
  ['Sales / marketing / advertising', [5, 3, 1]], ['Trader / broker / investor', [5, 8, 3]], ['Travel / aviation / logistics', [5, 3, 9]],
  ['Hospitality / events / food', [6, 2, 3]], ['Designer / artist / photographer', [6, 3, 2]], ['Actor / singer / performer', [3, 6, 5]],
  ['Real estate / construction', [4, 8, 6]], ['Military / police / sports', [9, 1, 8]], ['Social work / NGO / public service', [9, 6, 2]],
  ['Spiritual / religious / astrology work', [7, 9, 3]], ['Politics / public leadership', [1, 8, 9]], ['Fashion / beauty / wellness', [6, 2, 5]],
  ['Mining / metals / manufacturing', [8, 4, 9]], ['Agriculture / environment', [4, 2, 6]], ['Finance / insurance / consulting', [8, 7, 4]],
  ['Film / media production', [3, 5, 9]], ['Education / publishing', [3, 7, 6]], ['Retail / e-commerce', [5, 6, 3]],
];

const REPEAT = {
  1: ['Once: a quiet, sometimes reserved voice; you hold your views close.', 'Twice: you communicate well and make your point clearly.', 'Three times: very talkative and expressive, strong ego; learn to listen.', 'Four or more: dominant and stubborn; softening your tone brings better results.'],
  2: ['Once: sensitive and intuitive, with a gentle manner.', 'Twice: highly sensitive; you may worry more than most and feel others\' moods.', 'Three times: over-sensitive and prone to anxiety; steady routines help.', 'Four or more: very reactive emotionally; protect your energy and ask for support.'],
  3: ['Once: a good memory and an analytical mind.', 'Twice: sharp, creative thinking and a love of ideas.', 'Three times: brilliant but restless; ideas outrun action.', 'Four or more: over-thinking and difficulty switching off; physical activity grounds you.'],
  4: ['Once: organised and practical; you value order.', 'Twice: very hard-working and methodical; take care not to get stuck in routine.', 'Three times: rigid and controlling about how things are done.', 'Four or more: stubborn and resistant to change; flexibility is your lesson.'],
  5: ['Once: balanced, with the numbers around it supporting your steadiness.', 'Twice: strong intuition and emotional balance, a calm centre.', 'Three times: restless and over-sensitive to what people think.', 'Four or more: emotional ups and downs; keep a steady daily rhythm.'],
  6: ['Once: caring, family-minded and creative.', 'Twice: strong love of beauty, home and comfort; a good host.', 'Three times: worry, attachment and a tendency to carry the family\'s burdens.', 'Four or more: over-attached and anxious about loved ones; practise letting go.'],
  7: ['Once: you learn through experience and trial.', 'Twice: spiritual and reflective; setbacks carry lessons.', 'Three times: heavy lessons and a tendency to feel misunderstood.', 'Four or more: withdrawn and pessimistic at times; seek company and light.'],
  8: ['Once: a good sense of order and detail.', 'Twice: strong sense of duty and responsibility.', 'Three times: perfectionist and pressured by money or structure.', 'Four or more: controlling and over-worried about security; trust more.'],
  9: ['Once: ambitious with a drive to achieve.', 'Twice: high energy, strong ambition and a big heart.', 'Three times: powerful drive that can turn to impatience or anger.', 'Four or more: very intense; channel energy into exercise and service.'],
};

// Traditional planetary remedies. Offered as cultural practice for reflection, not as a promise of results.
const PLANET_REMEDY = {
  1: { planet: 'Sun', mantra: 'Om Suryaya Namah', yantra: 'Surya Yantra', day: 'Sunday', give: 'Wheat or jaggery', habit: 'Greet the morning sun and offer water.' },
  2: { planet: 'Moon', mantra: 'Om Chandraya Namah', yantra: 'Chandra Yantra', day: 'Monday', give: 'Rice, milk or white sweets', habit: 'Spend time near water and keep a calm sleep routine.' },
  3: { planet: 'Jupiter', mantra: 'Om Brihaspataye Namah', yantra: 'Guru (Brihaspati) Yantra', day: 'Thursday', give: 'Yellow lentils or turmeric', habit: 'Respect teachers and share what you know freely.' },
  4: { planet: 'Rahu', mantra: 'Om Raam Rahave Namah', yantra: 'Rahu Yantra', day: 'Saturday', give: 'Mustard oil, blankets or sesame', habit: 'Keep your space tidy and finish what you start.' },
  5: { planet: 'Mercury', mantra: 'Om Budhaya Namah', yantra: 'Budha Yantra', day: 'Wednesday', give: 'Green moong or green vegetables', habit: 'Read, write and keep your words honest and kind.' },
  6: { planet: 'Venus', mantra: 'Om Shukraya Namah', yantra: 'Shukra Yantra', day: 'Friday', give: 'White rice, sugar or flowers', habit: 'Keep your home clean and fragrant and honour your partner.' },
  7: { planet: 'Ketu', mantra: 'Om Ketave Namah', yantra: 'Ketu Yantra', day: 'Tuesday or Saturday', give: 'Blankets, or food for animals', habit: 'Keep a daily quiet minute and simplify what you own.' },
  8: { planet: 'Saturn', mantra: 'Om Shanaishcharaya Namah', yantra: 'Shani Yantra', day: 'Saturday', give: 'Black sesame, oil or footwear', habit: 'Be punctual, fair and respectful to workers and elders.' },
  9: { planet: 'Mars', mantra: 'Om Mangalaya Namah', yantra: 'Mangal Yantra', day: 'Tuesday', give: 'Red lentils (masoor)', habit: 'Exercise daily and count to ten before reacting in anger.' },
};

// What each number total tends to mean on a mobile number, house number or vehicle number.
const TOTAL_MEANING = {
  1: { mobile: 'Confident, leader-like energy. Good for founders and decision-makers.', house: 'A bright, active home; good for independence, can feel a little lonely.', vehicle: 'Assertive, quick-moving; stay patient on the road.' },
  2: { mobile: 'Soft, relationship-friendly energy. Good for service work and partnerships.', house: 'A peaceful, emotional home that suits couples and families.', vehicle: 'Calm and cooperative; good for shared or family use.' },
  3: { mobile: 'Expressive and social. Good for teaching, media and sales.', house: 'A lively, welcoming home; good for children and gatherings.', vehicle: 'Cheerful and sociable; watch distraction and over-speeding.' },
  4: { mobile: 'Unconventional and hard-working; can bring sudden ups and downs.', house: 'A practical, structured home but one that can feel restless or heavy.', vehicle: 'Needs regular maintenance; steady but unpredictable.' },
  5: { mobile: 'Fast, adaptable and business-friendly. Good for sales, travel and trade.', house: 'Active, changeable home; good for people who move and meet often.', vehicle: 'Quick and flexible; good for frequent travel.' },
  6: { mobile: 'Charming and caring. Good for hospitality, beauty and relationship work.', house: 'A warm, comfortable, family-oriented home. Widely considered a gentle number.', vehicle: 'Comfortable and stable; suits family use.' },
  7: { mobile: 'Reflective and private. Good for study and specialist work, less so for sales.', house: 'A quiet, spiritual home; good for study and rest, can feel secluded.', vehicle: 'Smooth but can be erratic; check it regularly.' },
  8: { mobile: 'Serious, business and authority energy. Strong for finance and management.', house: 'A hard-working, disciplined home; can feel heavy without rest and light.', vehicle: 'Strong and durable; slow, deliberate driving suits it.' },
  9: { mobile: 'Energetic and bold. Good for campaigns, sport and leadership.', house: 'A busy, high-energy home; good for people who serve others, can feel tense.', vehicle: 'Powerful and fast; keep tempers and speed in check.' },
};

const MONTH_SHORT = {
  1: 'Start fresh; take the lead', 2: 'Patience; cooperate and wait', 3: 'Create, socialise, speak up', 4: 'Work, plan, handle details',
  5: 'Change, travel, be flexible', 6: 'Home, family, responsibilities', 7: 'Reflect, study, rest', 8: 'Business, money, results', 9: 'Finish, release, tidy up',
};

// Per-personal-year guidance used on the year-by-year pages.
const YEARX = {
  1: { career: 'A strong year to start a venture, change role or pitch big ideas. Take initiative rather than waiting.', money: 'Invest in yourself and new beginnings; income can rise through new ventures.', love: 'New people and fresh starts. Existing relationships need you to be present and direct.', health: 'Energy is high; build one new healthy habit you can keep for nine years.', do: 'Begin, decide and commit.', avoid: 'Over-reaching and going it alone.' },
  2: { career: 'Teamwork and patience win. Support others, build alliances and let projects mature.', money: 'Slow and steady. Save, consolidate and avoid rushing deals.', love: 'A relationship-focused year: deepening, healing and commitment.', health: 'Watch stress and sleep; gentle routines work better than extremes.', do: 'Listen, cooperate, wait for the right moment.', avoid: 'Forcing outcomes and ignoring your feelings.' },
  3: { career: 'Visibility and communication pay off. Launch, publish, teach or promote what you do.', money: 'Income through creativity and contacts; keep spending in check.', love: 'Social, playful and romantic. Good for new connections and celebrations.', health: 'Joy is medicine; mind indulgence and scattered energy.', do: 'Create, share and enjoy.', avoid: 'Gossip, overspending and spreading yourself thin.' },
  4: { career: 'Hard work, structure and detail. Build systems, finish backlogs and lay foundations.', money: 'Budget carefully; invest in assets and long-term security.', love: 'Commitment through effort: practical support and showing up matter most.', health: 'Back, joints and tiredness; schedule rest and steady exercise.', do: 'Plan, organise and persist.', avoid: 'Burnout and rigidity.' },
  5: { career: 'Change and opportunity: new roles, travel, networking and negotiation.', money: 'Income can swing; useful for sales and trade but avoid speculation.', love: 'Excitement and freedom; clear communication prevents mixed signals.', health: 'Nerves and restlessness; keep a consistent routine and sleep.', do: 'Stay flexible, explore and network.', avoid: 'Impulsive commitments and over-indulgence.' },
  6: { career: 'Responsibility, service and teamwork. Mentoring, family business and quality work thrive.', money: 'Household and family costs grow; steady, balanced income.', love: 'A year of love, marriage, family and home. Deep commitments are favoured.', health: 'Look after your own needs, not only others\'.', do: 'Nurture, serve and beautify your surroundings.', avoid: 'Martyrdom and control through care.' },
  7: { career: 'Study, specialise and think. Not the best year to force big launches; refine your craft.', money: 'Quiet financial year; review, learn and avoid risky moves.', love: 'Introspective; time alone and honest conversations over big gestures.', health: 'Rest, quiet and nature restore you; protect your sleep.', do: 'Reflect, learn and rest.', avoid: 'Isolation and overthinking.' },
  8: { career: 'Power, recognition and results. Good for promotions, deals and business expansion.', money: 'Often the strongest financial year of the cycle. Act with integrity and plan taxes.', love: 'Work can crowd out love; make time deliberately.', health: 'Pressure builds; schedule rest and checkups.', do: 'Lead, negotiate and build wealth ethically.', avoid: 'Workaholism and ruthless deals.' },
  9: { career: 'Completion: wrap up projects, clear clutter and let go of what has run its course.', money: 'Release old debts and unproductive commitments; avoid major new ones.', love: 'Endings and forgiveness; compassion opens the way to the next cycle.', health: 'Emotional release helps; mind temper and accidents.', do: 'Finish, forgive and give.', avoid: 'Clinging to what is over and starting too much.' },
};


// Past-year reflection prompts (used on the "Looking back" pages).
const REFLECT = {
  1: 'What did you start in that year, and what did it grow into?',
  2: 'Which relationship or partnership taught you patience then?',
  3: 'What did you create or share in that year that people responded to?',
  4: 'What foundation did you build then that you still rely on today?',
  5: 'What changed suddenly then, and what did the change free you to do?',
  6: 'Whose care or responsibility shaped that year for you?',
  7: 'What did you learn about yourself in that quieter time?',
  8: 'What did you achieve or earn then, and what did it cost you?',
  9: 'What did you finish or let go of in that year?',
};

const STRESS = {
  1: { stress: 'Feeling blocked, ignored or controlled.', calm: 'Physical effort and a clear solo task.', decide: 'Quickly and from the gut; check your decision with one trusted person.' },
  2: { stress: 'Conflict, criticism and feeling unappreciated.', calm: 'Quiet company, music and time near water.', decide: 'Slowly, after hearing everyone; set a deadline so you do decide.' },
  3: { stress: 'Boredom, isolation and being unable to express yourself.', calm: 'Talking it through, writing and creative play.', decide: 'By talking aloud; write the options down before you commit.' },
  4: { stress: 'Disorder, sudden change and unclear rules.', calm: 'Lists, tidying and steady routine.', decide: 'With facts and a plan; allow time for gut feeling too.' },
  5: { stress: 'Being confined, repetition and too much responsibility at once.', calm: 'Movement, travel and changing the scenery.', decide: 'Fast, but sleep on anything that is hard to undo.' },
  6: { stress: 'Family tension, feeling unneeded or overburdened.', calm: 'Cooking, tending the home and time with loved ones.', decide: 'By thinking of everyone involved; remember to include yourself.' },
  7: { stress: 'Noise, crowds and having no time alone.', calm: 'Solitude, nature, reading and meditation.', decide: 'After research and quiet; set a date so analysis does not become delay.' },
  8: { stress: 'Loss of control, money pressure and feeling disrespected.', calm: 'Structured exercise, planning and a good night\'s sleep.', decide: 'With data and a long view; consult someone before big, irreversible moves.' },
  9: { stress: 'Injustice, delay and feeling unappreciated for your effort.', calm: 'Vigorous exercise and helping someone else.', decide: 'From your values; wait a day before acting when angry.' },
};

// What a personal-month number is good for (traditional reading).
const ACTIVITY = {
  1: { good: 'Starting projects, applying, launching, asking for what you want.', care: 'Impatience and acting alone.' },
  2: { good: 'Partnerships, negotiation, healing conversations, patient progress.', care: 'Forcing deadlines or confrontation.' },
  3: { good: 'Presenting, celebrating, networking, creative work, social plans.', care: 'Overspending and scattered focus.' },
  4: { good: 'Planning, paperwork, repairs, budgeting and building routines.', care: 'Overwork and rigid thinking.' },
  5: { good: 'Travel, sales, negotiation, trying something new, meeting people.', care: 'Impulsive decisions and restless spending.' },
  6: { good: 'Family events, home improvements, commitments, caring and hosting.', care: 'Over-giving and family friction.' },
  7: { good: 'Study, research, rest, reviewing plans and spending time alone.', care: 'Big launches, rushing deals and isolation.' },
  8: { good: 'Business moves, financial planning, promotions, big decisions with data.', care: 'Overwork and hard bargaining.' },
  9: { good: 'Finishing projects, decluttering, forgiving, charity and wrapping up.', care: 'Starting major new things, temper and loose ends.' },
};

const FAQ = [
  ['Is numerology scientific?', 'No. Numerology is a traditional belief system, not a science. There is no evidence that numbers predict events. Use it for reflection and conversation, not for decisions about health, money or safety.'],
  ['Why does my report show both Mulank and Life Path?', 'They come from two traditions. Mulank and Bhagyank are the Indian approach; Life Path is the Western one. Where they agree, the theme is emphasised; where they differ, take what is useful.'],
  ['Which spelling of my name should I use?', 'Use the name you are most commonly called and sign. The report checks it and lists alternative spellings, but changing a name is a personal choice and should not be rushed.'],
  ['Should I change my name or phone number because of this report?', 'Not on this report alone. Treat suggestions as ideas to consider calmly. Legal name changes have real consequences for documents and records.'],
  ['What if I have missing numbers?', 'Everyone is missing some. A missing number marks a quality you build by practice, not a defect. The 30-day plan shows small habits for it.'],
  ['What about birth time or place?', 'Numerology uses your name and date of birth only. Astrology uses time and place.'],
  ['How accurate is it?', 'Readings are written in general terms that many people recognise in themselves. Notice what resonates and let go of what does not.'],
  ['Can I use it to match with a partner?', 'The compatibility pages show tendencies between numbers. Real relationships depend on communication, values and effort far more than on numbers.'],
];

module.exports = { WORK, MONEY, LOVE, HEALTH, VOCATIONS, REPEAT, PLANET_REMEDY, TOTAL_MEANING, MONTH_SHORT, YEARX, REFLECT, STRESS, ACTIVITY, FAQ };
