// UI labels per language + resolver that pairs labels with the right content pack and font.
const en = require('./content');
const hi = require('./content_hi');
const de = require('./content_de');
const fr = require('./content_fr');

const LABELS = {
  en: {
    dir: 'ltr', scripts: ['latin'],
    tagline: 'Lo Shu · Chaldean · Western', reportTitle: 'Your Name Report', born: 'Born',
    preparedOn: (d) => `Prepared on ${d} · A personalised numerology analysis`,
    kickers: { contents:'Your report', core:'At a glance', mulank:'Root number', bhagyank:'Destiny number', name:'Name analysis', loshu:'Birth chart', numbers:'Your numbers', forecast:'Forecast', lucky:'Your fortune', remedies:'Strengthen your chart' },
    titles: { contents:'What is inside', core:'Your core numbers', name:'Does your name suit you?', loshu:'Your Lo Shu grid', numbers:'Gifts and lessons', lucky:'Lucky guide & compatibility', remedies:'Remedies & affirmations' },
    contentsIntro: 'This is your complete numerology Name Report, calculated from your date of birth and the exact spelling of your name. It blends three systems — Indian Lo Shu, Chaldean name numbers and Western numerology — into one clear picture.',
    contentsNote: 'Each number is reduced to a single digit. Master numbers 11, 22 and 33 are kept only in the Western life path, never in the Indian system.',
    contentsRows: [['Core numbers','Your Mulank, Bhagyank, name number and life path at a glance'],['Mulank','Your root number: personality, strengths, career, relationships, health'],['Bhagyank','Your destiny number and the path your life tends to take'],['Name analysis','Whether your name spelling is in harmony, with options to consider'],['Lo Shu grid','Your birth grid, planes and arrows — and what they reveal'],['Present & missing numbers','Your natural gifts and the lessons to grow into'],['Forecast','Your personal year, the 9-year cycle and the next 12 months'],['Lucky guide & compatibility','Colours, days, gems, directions and which numbers suit you'],['Remedies & affirmations','Simple practices to strengthen your chart']],
    contentsHead: ['Section','What it covers'],
    coreHead: ['Number','Value','Ruling planet','In one line'],
    coreRows: ['Mulank (root)','Bhagyank (destiny)','Name number (Chaldean)','Life path (Western)'],
    coreCompare: 'How your core numbers compare', coreCaption: 'Taller bars simply mean a higher number — not better or worse. Harmony between these numbers matters more than their size.',
    oneLineLife: 'The overall journey of your life', compound: (c,v)=>`Compound ${c}, reduces to ${v}`, reduces:(v)=>`Reduces to ${v}`,
    mulankKV: ['Ruling planet','Strengths','Challenges','Career & work','Relationships','Health','Affirmation'],
    bhagyankKV: ['Ruling planet','Life theme','Best expressed through','Watch out for'],
    bhagyankTheme: (t)=>`${t} energy guides your destiny`,
    bhagyankNote: 'Your Mulank is how you are wired; your Bhagyank is where life tends to lead you. When they work together, life flows; when they pull apart, your name can help bring them into balance — which is what the next section checks.',
    nameHarmony: 'Your name is in harmony', nameTune: 'Your name could be tuned',
    nameKeep: (num,which)=>`Your name number is ${num}, which lines up with your ${which}. The spelling you use already supports your natural strengths — there is no need to change it.`,
    nameTuneBody: (num,mk,bh)=>`Your name number is ${num}, while your Mulank is ${mk} and Bhagyank is ${bh}. They do not yet align, so a small spelling change can bring your name into harmony with the numbers you were born with.`,
    letterByLetter: 'Your current name, number by number', letterHead: ['Letter','Value','Running total'],
    totalLine: (t,v)=> t>9 ? `Total ${t} → reduces to ${v}. (Chaldean: A I J Q Y=1, B K R=2, C G L S=3, D M T=4, E H N X=5, U V W=6, O Z=7, F P=8.)` : `Total ${t}. (Chaldean: A I J Q Y=1, B K R=2, C G L S=3, D M T=4, E H N X=5, U V W=6, O Z=7, F P=8.)`,
    considerSpellings: 'Spellings worth considering', spellHead: ['Spelling','Number','Why it helps'],
    matchesMulank: 'Matches your Mulank', matchesBhagyank: 'Matches your Bhagyank', balancedAlt: 'A balanced alternative',
    spellNote: 'A name change works best when it feels natural to say and write. Try a chosen spelling for a few weeks before making it official.',
    loshuIntro: 'Your Lo Shu grid is built from the digits of your date of birth. Where numbers repeat, that energy is strong; where they are missing, there is a lesson to grow into.',
    youHave: 'You have', missing: 'Missing', fullGrid: 'none — a rare full grid', none: 'none',
    lineNames: {thinking: 'Thinking plane', feeling: 'Feeling plane', practical: 'Practical plane', planning: 'Planning', willpower: 'Willpower', action: 'Action', determination: 'Determination', intuition: 'Intuition'},
    planesArrows: 'Your planes and arrows', lineHead: ['Line','Status','Meaning'],
    status: { complete:'Complete', partial:'Partial', empty:'Empty' },
    planeComplete:(m)=>`A complete ${m}`, planeEmpty:(m)=>`Missing — grow ${m}`, planePartial:(m)=>`Partly present — developing ${m}`,
    arrowSuffix: ' arrow', arrowPartial: 'Partly present — developing',
    presentTitle: 'What your present numbers give you', presentHead: ['No.','Count','Your natural gift'],
    strengthTitle: 'How strong each number is in your chart', strengthCaption: 'The tallest bars are your dominant energies; empty bars are your missing numbers.',
    missingTitle: 'Lessons from your missing numbers (with remedies)', missingHead: ['No.','The lesson','A simple remedy'],
    pyTitle: (n)=>`Your Personal Year ${n}`, pyBody: (n,theme)=>`You are currently in a Personal Year ${n}. ${theme}`,
    cycle: 'Your 9-year cycle', cycleCaption: 'Numerology moves in nine-year cycles. A 1 year begins a new chapter; a 9 year completes it. Knowing where you are helps you act with the current, not against it.',
    next12: 'The next 12 months', monthHead: ['Month','Personal month','Theme'],
    monthThemes: { 1:'Fresh starts', 2:'Patience, bonds', 3:'Express, connect', 4:'Work, order', 5:'Change, travel', 6:'Home, care', 7:'Rest, reflect', 8:'Push, rewards', 9:'Finish, release' },
    luckyTitle: 'Your lucky guide', luckyKV: ['Lucky colours','Colours to limit','Good days','Friendly numbers','Gemstone','Favourable metal','Lucky direction','Ruling deity'],
    whichSuit: 'Which numbers suit you', compatHead: ['Relationship','Numbers','Note'],
    friendly: 'Friendly', neutral: 'Neutral', challenging: 'Challenging',
    friendlyNote: 'Natural ease in love, work and friendship', neutralNote: 'Workable with understanding', challengingNote: 'Needs patience and compromise',
    compatNote: 'Compatibility here is based on your Mulank. For a full couple reading, both birth dates and names are compared.',
    practicesTitle: 'Simple practices', practiceHead: ['Practice','How'],
    practices: (lk, missingRemedy, aff) => [
      ['Wear your colours', `Bring ${lk.colour.split(',')[0].toLowerCase()} into your clothes or workspace on ${lk.days.split(',')[0]}.`],
      ['Use your numbers', `Favour your friendly numbers (${lk.friendly.join(', ')}) in phone numbers, house numbers and important dates where you can.`],
      ['Honour your day', `${lk.days.split(',')[0]} is your strongest day — begin important work then.`],
      ['Balance a missing number', missingRemedy],
      ['Daily affirmation', `"${aff}"`],
    ],
    balancedAlready: 'Your grid is already balanced — keep nurturing your strengths.',
    closing: 'Numerology does not replace your own choices — it is a mirror that helps you understand your natural tendencies and time your efforts. Use what resonates, and leave the rest.',
    footer: (name)=>`Ank Numerology · Name Report for ${name}`,
    disclaimer: 'This report is prepared for reflection and entertainment. Numerology is not a substitute for professional medical, legal or financial advice.',
  },
  hi: {
    dir: 'ltr', scripts: ['deva','latin'],
    tagline: 'लो शू · कैल्डियन · पाश्चात्य', reportTitle: 'आपकी नाम रिपोर्ट', born: 'जन्म',
    preparedOn: (d) => `${d} को तैयार · एक व्यक्तिगत अंक-ज्योतिष विश्लेषण`,
    kickers: { contents:'आपकी रिपोर्ट', core:'एक नज़र में', mulank:'मूलांक', bhagyank:'भाग्यांक', name:'नाम विश्लेषण', loshu:'जन्म चार्ट', numbers:'आपके अंक', forecast:'भविष्यफल', lucky:'आपका सौभाग्य', remedies:'अपना चार्ट मज़बूत करें' },
    titles: { contents:'इसमें क्या है', core:'आपके मुख्य अंक', name:'क्या आपका नाम आपके अनुकूल है?', loshu:'आपकी लो शू ग्रिड', numbers:'उपहार और सीख', lucky:'सौभाग्य मार्गदर्शिका और अनुकूलता', remedies:'उपाय और प्रतिज्ञान' },
    contentsIntro: 'यह आपकी संपूर्ण अंक-ज्योतिष नाम रिपोर्ट है, जो आपकी जन्मतिथि और आपके नाम की सटीक वर्तनी से गणना की गई है। यह तीन प्रणालियों — भारतीय लो शू, कैल्डियन नाम अंक और पाश्चात्य अंक-ज्योतिष — को एक स्पष्ट तस्वीर में जोड़ती है।',
    contentsNote: 'हर अंक को एक अंक में घटाया जाता है। मास्टर अंक 11, 22 और 33 केवल पाश्चात्य जीवन-पथ में रखे जाते हैं, भारतीय प्रणाली में कभी नहीं।',
    contentsRows: [['मुख्य अंक','आपका मूलांक, भाग्यांक, नाम अंक और जीवन-पथ एक नज़र में'],['मूलांक','आपका मूल अंक: व्यक्तित्व, शक्तियाँ, करियर, रिश्ते, स्वास्थ्य'],['भाग्यांक','आपका भाग्य अंक और जीवन जिस राह पर ले जाता है'],['नाम विश्लेषण','आपके नाम की वर्तनी अनुकूल है या नहीं, विकल्पों सहित'],['लो शू ग्रिड','आपकी जन्म ग्रिड, तल और तीर — और वे क्या बताते हैं'],['मौजूद और अनुपस्थित अंक','आपके स्वाभाविक उपहार और विकसित करने योग्य सीख'],['भविष्यफल','आपका व्यक्तिगत वर्ष, 9-वर्षीय चक्र और अगले 12 महीने'],['सौभाग्य और अनुकूलता','रंग, दिन, रत्न, दिशा और कौन-से अंक आपके अनुकूल हैं'],['उपाय और प्रतिज्ञान','आपके चार्ट को मज़बूत करने के सरल अभ्यास']],
    contentsHead: ['खंड','इसमें क्या है'],
    coreHead: ['अंक','मान','स्वामी ग्रह','एक पंक्ति में'],
    coreRows: ['मूलांक','भाग्यांक','नाम अंक (कैल्डियन)','जीवन-पथ (पाश्चात्य)'],
    coreCompare: 'आपके मुख्य अंकों की तुलना', coreCaption: 'ऊँची पट्टियाँ केवल बड़ा अंक दर्शाती हैं — अच्छा या बुरा नहीं। इन अंकों के बीच सामंजस्य उनके आकार से अधिक मायने रखता है।',
    oneLineLife: 'आपके जीवन की समग्र यात्रा', compound: (c,v)=>`संयुक्त ${c}, घटकर ${v}`, reduces:(v)=>`घटकर ${v}`,
    mulankKV: ['स्वामी ग्रह','शक्तियाँ','चुनौतियाँ','करियर और काम','रिश्ते','स्वास्थ्य','प्रतिज्ञान'],
    bhagyankKV: ['स्वामी ग्रह','जीवन का विषय','सर्वोत्तम अभिव्यक्ति','सावधानी'],
    bhagyankTheme: (t)=>`${t} की ऊर्जा आपके भाग्य का मार्गदर्शन करती है`,
    bhagyankNote: 'आपका मूलांक आपका स्वभाव है; आपका भाग्यांक वह दिशा है जिधर जीवन ले जाता है। जब दोनों मिलकर चलते हैं, जीवन सहज बहता है; जब अलग खिंचते हैं, तब आपका नाम उन्हें संतुलन में ला सकता है — यही अगला खंड जाँचता है।',
    nameHarmony: 'आपका नाम सामंजस्य में है', nameTune: 'आपका नाम समायोजित किया जा सकता है',
    nameKeep: (num,which)=>`आपका नाम अंक ${num} है, जो आपके ${which} से मेल खाता है। आपकी वर्तमान वर्तनी पहले से ही आपकी स्वाभाविक शक्तियों का साथ देती है — बदलने की आवश्यकता नहीं।`,
    nameTuneBody: (num,mk,bh)=>`आपका नाम अंक ${num} है, जबकि आपका मूलांक ${mk} और भाग्यांक ${bh} है। ये अभी मेल नहीं खाते, इसलिए वर्तनी में छोटा बदलाव आपके नाम को जन्म-अंकों के साथ सामंजस्य में ला सकता है।`,
    letterByLetter: 'आपका वर्तमान नाम, अक्षर-दर-अक्षर', letterHead: ['अक्षर','मान','कुल योग'],
    totalLine: (t,v)=> t>9 ? `कुल ${t} → घटकर ${v}। (कैल्डियन: A I J Q Y=1, B K R=2, C G L S=3, D M T=4, E H N X=5, U V W=6, O Z=7, F P=8।)` : `कुल ${t}। (कैल्डियन: A I J Q Y=1, B K R=2, C G L S=3, D M T=4, E H N X=5, U V W=6, O Z=7, F P=8।)`,
    considerSpellings: 'विचार करने योग्य वर्तनियाँ', spellHead: ['वर्तनी','अंक','यह क्यों लाभकारी है'],
    matchesMulank: 'आपके मूलांक से मेल', matchesBhagyank: 'आपके भाग्यांक से मेल', balancedAlt: 'एक संतुलित विकल्प',
    spellNote: 'नाम बदलना तब सबसे अच्छा काम करता है जब वह बोलने और लिखने में स्वाभाविक लगे। आधिकारिक बनाने से पहले कुछ सप्ताह चुनी हुई वर्तनी आज़माएँ।',
    loshuIntro: 'आपकी लो शू ग्रिड आपकी जन्मतिथि के अंकों से बनती है। जहाँ अंक दोहराते हैं, वह ऊर्जा प्रबल है; जहाँ अनुपस्थित हैं, वहाँ विकसित करने योग्य सीख है।',
    youHave: 'आपके पास है', missing: 'अनुपस्थित', fullGrid: 'कोई नहीं — एक दुर्लभ पूर्ण ग्रिड', none: 'कोई नहीं',
    lineNames: {thinking: 'विचार तल', feeling: 'भावना तल', practical: 'व्यावहारिक तल', planning: 'योजना', willpower: 'इच्छाशक्ति', action: 'कर्म', determination: 'दृढ़ निश्चय', intuition: 'अंतर्ज्ञान'},
    planesArrows: 'आपके तल और तीर', lineHead: ['रेखा','स्थिति','अर्थ'],
    status: { complete:'पूर्ण', partial:'आंशिक', empty:'रिक्त' },
    planeComplete:(m)=>`एक पूर्ण ${m}`, planeEmpty:(m)=>`अनुपस्थित — ${m} विकसित करें`, planePartial:(m)=>`आंशिक रूप से मौजूद — ${m} विकसित हो रहा`,
    arrowSuffix: ' तीर', arrowPartial: 'आंशिक रूप से मौजूद — विकसित हो रहा',
    presentTitle: 'आपके मौजूद अंक आपको क्या देते हैं', presentHead: ['अंक','गिनती','आपका स्वाभाविक उपहार'],
    strengthTitle: 'आपके चार्ट में हर अंक कितना प्रबल है', strengthCaption: 'सबसे ऊँची पट्टियाँ आपकी प्रमुख ऊर्जाएँ हैं; खाली पट्टियाँ आपके अनुपस्थित अंक हैं।',
    missingTitle: 'आपके अनुपस्थित अंकों से सीख (उपायों सहित)', missingHead: ['अंक','सीख','एक सरल उपाय'],
    pyTitle: (n)=>`आपका व्यक्तिगत वर्ष ${n}`, pyBody: (n,theme)=>`आप इस समय व्यक्तिगत वर्ष ${n} में हैं। ${theme}`,
    cycle: 'आपका 9-वर्षीय चक्र', cycleCaption: 'अंक-ज्योतिष नौ-वर्षीय चक्रों में चलती है। 1 का वर्ष नया अध्याय शुरू करता है; 9 का वर्ष उसे पूरा करता है। आप कहाँ हैं यह जानना आपको धारा के साथ चलने में मदद करता है।',
    next12: 'अगले 12 महीने', monthHead: ['महीना','व्यक्तिगत माह','विषय'],
    monthThemes: { 1:'नई शुरुआत', 2:'धैर्य, रिश्ते', 3:'अभिव्यक्ति, जुड़ाव', 4:'काम, व्यवस्था', 5:'बदलाव, यात्रा', 6:'घर, देखभाल', 7:'विश्राम, चिंतन', 8:'प्रयास, पुरस्कार', 9:'समापन, विमोचन' },
    luckyTitle: 'आपकी सौभाग्य मार्गदर्शिका', luckyKV: ['शुभ रंग','सीमित रखें','शुभ दिन','मित्र अंक','रत्न','शुभ धातु','शुभ दिशा','स्वामी देवता'],
    whichSuit: 'कौन-से अंक आपके अनुकूल हैं', compatHead: ['संबंध','अंक','टिप्पणी'],
    friendly: 'मित्रवत', neutral: 'तटस्थ', challenging: 'चुनौतीपूर्ण',
    friendlyNote: 'प्रेम, काम और मित्रता में स्वाभाविक सहजता', neutralNote: 'समझ के साथ निभने योग्य', challengingNote: 'धैर्य और समझौते की आवश्यकता',
    compatNote: 'यहाँ अनुकूलता आपके मूलांक पर आधारित है। पूर्ण युगल विश्लेषण के लिए दोनों की जन्मतिथि और नाम की तुलना की जाती है।',
    practicesTitle: 'सरल अभ्यास', practiceHead: ['अभ्यास','कैसे'],
    practices: (lk, missingRemedy, aff) => [
      ['अपने रंग पहनें', `${lk.days.split(',')[0]} को अपने कपड़ों या कार्यस्थल में ${lk.colour.split(',')[0]} रंग शामिल करें।`],
      ['अपने अंक अपनाएँ', `जहाँ संभव हो, फ़ोन नंबर, घर नंबर और महत्वपूर्ण तिथियों में अपने मित्र अंकों (${lk.friendly.join(', ')}) को प्राथमिकता दें।`],
      ['अपने दिन का सम्मान करें', `${lk.days.split(',')[0]} आपका सबसे प्रबल दिन है — महत्वपूर्ण काम तभी शुरू करें।`],
      ['एक अनुपस्थित अंक संतुलित करें', missingRemedy],
      ['दैनिक प्रतिज्ञान', `"${aff}"`],
    ],
    balancedAlready: 'आपकी ग्रिड पहले से संतुलित है — अपनी शक्तियों का पोषण करते रहें।',
    closing: 'अंक-ज्योतिष आपके अपने निर्णयों का स्थान नहीं लेती — यह एक दर्पण है जो आपकी स्वाभाविक प्रवृत्तियों को समझने और प्रयासों का समय तय करने में मदद करता है। जो उपयुक्त लगे उसे अपनाएँ, शेष को छोड़ दें।',
    footer: (name)=>`अंक न्यूमेरोलॉजी · ${name} के लिए नाम रिपोर्ट`,
    disclaimer: 'यह रिपोर्ट चिंतन और मनोरंजन के लिए तैयार की गई है। अंक-ज्योतिष पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।',
  },
  de: require('./labels_de'),
  fr: require('./labels_fr'),
};

const CONTENT = { en, hi, de, fr };

// Auto-load drop-in languages: lib/lang/<code>.js exporting { labels, content }
const fs = require('fs');
const path = require('path');
const langDir = path.join(__dirname, 'lang');
if (fs.existsSync(langDir)) {
  for (const f of fs.readdirSync(langDir).filter((x) => x.endsWith('.js') && !x.startsWith('_'))) {
    const code = f.replace(/\.js$/, '');
    const m = require(path.join(langDir, f));
    LABELS[code] = m.labels; CONTENT[code] = m.content;
  }
}

function resolve(lang) {
  const code = (LABELS[lang] ? lang : 'en');
  return { code, labels: LABELS[code], content: CONTENT[code] };
}

module.exports = { resolve, LABELS };
