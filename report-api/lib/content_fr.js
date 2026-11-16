// French interpretation copy for the full Name Report. Reviewed-quality draft.
const PLANET = { 1: 'Soleil', 2: 'Lune', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercure', 6: 'Vénus', 7: 'Ketu', 8: 'Saturne', 9: 'Mars' };

const MULANK = {
  1: { title: 'Le Meneur', planet: 'Soleil',
    summary: 'Indépendant, original et déterminé. Tu es le plus heureux quand tu fixes ta propre direction et tu n’aimes pas être contrôlé.',
    strengths: 'Leadership, originalité, courage, volonté forte, ambition.',
    challenges: 'Ego, obstination, impatience, difficulté à recevoir des ordres.',
    career: 'Fondateur, dirigeant, administration, rôles de pionnier — partout où tu mènes.',
    relationships: 'Loyal et protecteur, mais il te faut un partenaire qui respecte ton indépendance.',
    health: 'Surveille le cœur, les yeux et la tension; la lumière du soleil et le repos te restaurent.' },
  2: { title: 'Le Diplomate', planet: 'Lune',
    summary: 'Doux, intuitif et coopératif. Tu lis bien les gens et apportes l’harmonie à tout groupe.',
    strengths: 'Sensibilité, tact, esprit d’équipe, imagination, patience.',
    challenges: 'Hypersensibilité, sautes d’humeur, indécision, dépendance aux autres.',
    career: 'Conseil, hôtellerie, design, partenariats, rôles de soutien.',
    relationships: 'Attentionné et romantique; a besoin de réconfort et de sécurité émotionnelle.',
    health: 'Soigne la digestion, le sommeil et l’équilibre des liquides; l’eau et la routine aident.' },
  3: { title: 'Le Communicateur', planet: 'Jupiter',
    summary: 'Expressif, optimiste et créatif. Les mots, l’enseignement et la chaleur sont tes dons.',
    strengths: 'Créativité, optimisme, expression, savoir, générosité.',
    challenges: 'Énergie dispersée, bavardage, exagération, impatience face aux détails.',
    career: 'Enseignement, écriture, médias, droit, conseil, arts de la scène.',
    relationships: 'Joyeux et sociable; s’épanouit avec quelqu’un qui partage ta curiosité.',
    health: 'Surveille le foie, le poids et la gorge; la modération te maintient en forme.' },
  4: { title: 'Le Bâtisseur', planet: 'Rahu',
    summary: 'Pratique, méthodique et fiable. Tu construis, pas à pas, des choses qui durent.',
    strengths: 'Discipline, méthode, fiabilité, travail acharné, honnêteté.',
    challenges: 'Rigidité, excès de prudence, résistance au changement, surmenage.',
    career: 'Ingénierie, opérations, immobilier, systèmes, métiers qualifiés.',
    relationships: 'Stable et digne de confiance; montre son amour par les actes, non les mots.',
    health: 'Surveille le système nerveux et le dos; l’ancrage et les pauses comptent.' },
  5: { title: 'L’Explorateur', planet: 'Mercure',
    summary: 'Polyvalent, vif et épris de liberté. Tu as soif de changement, de voyages et d’expériences nouvelles.',
    strengths: 'Adaptabilité, communication, esprit, réseautage, débrouillardise.',
    challenges: 'Agitation, inconstance, impulsivité, excès.',
    career: 'Vente, commerce, marketing, voyage, technologie — tout ce qui bouge vite.',
    relationships: 'Charmant et espiègle; a besoin d’espace et de stimulation mentale.',
    health: 'Soigne les nerfs et la peau; apaise l’esprit, évite les excitants.' },
  6: { title: 'Le Protecteur', planet: 'Vénus',
    summary: 'Aimant, responsable et artistique. Le foyer, la beauté et les êtres chers passent en premier.',
    strengths: 'Amour, responsabilité, esthétique, harmonie, service.',
    challenges: 'Inquiétude, don de soi excessif, perfectionnisme, difficulté à dire non.',
    career: 'Design, bien-être, hôtellerie, soins, entreprise familiale, arts.',
    relationships: 'Profondément dévoué et attentionné; le foyer et la famille sont au centre.',
    health: 'Soigne la gorge, les reins et le cœur; la beauté et le repos te guérissent.' },
  7: { title: 'Le Chercheur', planet: 'Ketu',
    summary: 'Réfléchi, analytique et spirituel. La profondeur et les questions cachées derrière les choses t’attirent.',
    strengths: 'Analyse, intuition, recherche, indépendance, profondeur.',
    challenges: 'Isolement, rumination, scepticisme, détachement.',
    career: 'Recherche, spiritualité, analyse, informatique, investigation, écriture.',
    relationships: 'Discret et loyal; a besoin de solitude et d’un partenaire qui le comprend.',
    health: 'Soigne l’anxiété et le système nerveux; la nature et le calme te restaurent.' },
  8: { title: 'Le Dirigeant', planet: 'Saturne',
    summary: 'Ambitieux, organisé et résilient. Fait pour la responsabilité, l’argent et le long terme.',
    strengths: 'Ambition, gestion, endurance, équité, sens du concret.',
    challenges: 'Surmenage, dureté, retards, pression, contrôle.',
    career: 'Affaires, finance, droit, administration, grandes organisations.',
    relationships: 'Protecteur et engagé; la réussite et la sécurité expriment l’amour.',
    health: 'Soigne les os, les articulations et les dents; la patience et la discipline paient.' },
  9: { title: 'L’Humaniste', planet: 'Mars',
    summary: 'Généreux, courageux et idéaliste. Tu ressens fort et veux que ton travail ait du sens.',
    strengths: 'Courage, compassion, énergie, idéalisme, leadership.',
    challenges: 'Colère, impatience, impulsivité, en prendre trop sur soi.',
    career: 'Défense, médecine, travail social, sport, grandes causes, chirurgie.',
    relationships: 'Passionné et protecteur; a besoin d’une cause et d’un partenaire fidèle.',
    health: 'Soigne les inflammations, les accidents et le sang; l’exercice canalise ton feu.' },
};

const BHAGYANK = {
  1: 'Ta destinée récompense l’initiative, le leadership et l’autonomie. La vie te pousse vers l’avant.',
  2: 'Ton chemin se déploie par les relations, la patience et la coopération. Tu es fait pour rassembler les gens.',
  3: 'La vie s’ouvre par l’expression de soi, l’apprentissage et la joie. Le savoir et la communication te portent.',
  4: 'Ta fortune se bâtit par la discipline, la structure et l’effort honnête dans le temps. Pas de raccourcis, mais un sol ferme.',
  5: 'Le changement est ta destinée : voyage, adaptation et variété. Tu es fait pour te mouvoir et relier.',
  6: 'Ton chemin est le soin, la famille et la responsabilité portés avec grâce. La beauté et le service sont ta fortune.',
  7: 'Ta destinée est intérieure : sagesse, spécialisation et maîtrise silencieuse. La profondeur plutôt que le bruit.',
  8: 'Tu es fait pour la réussite, l’autorité et les résultats matériels gagnés par la persévérance.',
  9: 'Ta destinée est de donner : service, compassion et une cause plus grande que toi.',
};

const DIGIT_HAVE = {
  1: 'Un fort sentiment de soi, de l’individualité et la confiance d’exprimer qui tu es.',
  2: 'Sensibilité, intuition et tact — tu sens l’ambiance et traites les gens avec soin.',
  3: 'Imagination et créativité mentale — les idées, les mots et les images viennent aisément.',
  4: 'Sens pratique et habileté concrète — tu sais organiser et bâtir dans le monde réel.',
  5: 'Équilibre émotionnel et un centre stable — le cœur de la grille te tient ensemble.',
  6: 'Amour du foyer, créativité et soin — tu crées la beauté et prends soin des autres.',
  7: 'Apprendre par l’expérience — tu gagnes en sagesse par ce que la vie t’offre.',
  8: 'Un sens de l’ordre, de la méthode et du détail — tu mets du système partout.',
  9: 'Ambition, élan et humanité — de l’énergie et le souhait de servir un but plus grand.',
};

const DIGIT_MISSING = {
  1: { lesson: 'Trouver ta voix et t’affirmer demande un effort conscient.', remedy: 'Exprime-toi tôt; tiens de petites promesses envers toi-même pour bâtir la confiance.' },
  2: { lesson: 'Faire confiance à l’intuition et lire les autres peut être un axe de progrès.', remedy: 'Marque une pause avant de décider; remarque tes premières impressions et honore-les.' },
  3: { lesson: 'Mettre tes pensées en mots ou en images peut demander de la pratique.', remedy: 'Écris ou dessine chaque jour, ne serait-ce qu’une ligne; partage une idée par jour.' },
  4: { lesson: 'La routine, l’ordre et la persévérance méritent d’être bâtis délibérément.', remedy: 'Utilise des listes et des horaires fixes; finis une tâche avant la suivante.' },
  5: { lesson: 'Rester équilibré sous pression est une leçon.', remedy: 'Respire avant de réagir; garde un rythme quotidien régulier.' },
  6: { lesson: 'Exprimer le soin et créer un foyer apaisé est un thème à développer.', remedy: 'Fais de petits gestes d’attention une habitude; prends soin de ton espace.' },
  7: { lesson: 'La patience et apprendre des revers font partie de ton chemin.', remedy: 'Réfléchis aux leçons, non aux pertes; réserve du temps à l’étude tranquille.' },
  8: { lesson: 'La méthode, le détail et la gestion de l’argent récompensent l’attention.', remedy: 'Suis tes revenus et dépenses; maîtrise un système à la fois.' },
  9: { lesson: 'Canaliser ton élan vers un but plus grand est le travail.', remedy: 'Donne du temps à une cause; dirige ton énergie vers quelque chose au-delà de toi.' },
};

const YEAR_THEME = {
  1: 'Commencements. Sème, repars à neuf, prends les devants. Ce que tu commences maintenant donne le ton pour neuf ans.',
  2: 'Patience et partenariat. Bâtis des relations, coopère, laisse mûrir. Lentement est le bon rythme.',
  3: 'Expression et joie. Crée, socialise, communique. Ton optimisme attire les occasions.',
  4: 'Travail et fondations. Bâtis la structure, sois discipliné, soigne les détails. L’effort d’aujourd’hui paie demain.',
  5: 'Changement et liberté. Attends-toi au mouvement, aux voyages et aux chemins nouveaux. Reste souple et ouvert.',
  6: 'Responsabilité et foyer. La famille, l’amour et le devoir occupent le devant. Nourris ce qui compte.',
  7: 'Réflexion et profondeur. Étudie, repose-toi, va vers l’intérieur. Une année pour comprendre plutôt que forcer.',
  8: 'Puissance et récompense. L’ambition, l’argent et la reconnaissance se précisent. Agis avec intégrité.',
  9: 'Achèvement et lâcher-prise. Termine, pardonne, laisse aller. Dégage le terrain pour un nouveau cycle.',
};

const LUCKY = {
  1: { colour: 'Or, orange, jaune', avoid: 'Noir, bleu foncé', days: 'Dimanche, lundi', friendly: [1,2,3,9], gem: 'Rubis', metal: 'Or', direction: 'Est', deity: 'Surya' },
  2: { colour: 'Blanc, crème, vert clair', avoid: 'Rouge, noir', days: 'Dimanche, lundi, vendredi', friendly: [1,2,7], gem: 'Perle', metal: 'Argent', direction: 'Nord-ouest', deity: 'Chandra' },
  3: { colour: 'Jaune, or, violet', avoid: 'Bleu', days: 'Jeudi, vendredi', friendly: [3,6,9], gem: 'Saphir jaune', metal: 'Or', direction: 'Nord-est', deity: 'Brihaspati' },
  4: { colour: 'Gris, bleu, tons électriques', avoid: 'Rouge vif', days: 'Samedi, dimanche', friendly: [1,4,8], gem: 'Hessonite (Gomed)', metal: 'Mélange', direction: 'Sud-ouest', deity: 'Rahu' },
  5: { colour: 'Vert, gris clair, blanc', avoid: 'Tons sombres', days: 'Mercredi, vendredi', friendly: [1,3,5], gem: 'Émeraude', metal: 'Bronze', direction: 'Nord', deity: 'Budha' },
  6: { colour: 'Bleu, rose, blanc', avoid: 'Noir', days: 'Vendredi, mardi', friendly: [3,6,9], gem: 'Diamant / saphir blanc', metal: 'Argent', direction: 'Sud-est', deity: 'Shukra' },
  7: { colour: 'Vert clair, blanc, tons pâles', avoid: 'Rouge foncé', days: 'Dimanche, lundi', friendly: [2,4,7], gem: 'Œil-de-chat', metal: 'Mélange', direction: 'Sud', deity: 'Ketu' },
  8: { colour: 'Bleu foncé, noir, gris', avoid: 'Orange vif', days: 'Samedi, dimanche', friendly: [4,5,8], gem: 'Saphir bleu', metal: 'Fer', direction: 'Ouest', deity: 'Shani' },
  9: { colour: 'Rouge, rose, cramoisi', avoid: 'Noir', days: 'Mardi, jeudi', friendly: [3,6,9], gem: 'Corail rouge', metal: 'Cuivre', direction: 'Sud', deity: 'Mangal' },
};

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
  thinking: 'le Mental — comment tu penses, planifies et imagines',
  feeling: 'le Cœur — comment tu ressens, relies et crées',
  practical: 'les Mains — comment tu agis, organises et bâtis',
};
const ARROWS = {
  planning: 'un don pour l’ordre, la méthode et mener un projet à terme',
  willpower: 'une forte détermination et la volonté de franchir les obstacles',
  action: 'une énergie remuante et un besoin de rester actif et occupé',
  determination: 'la persévérance — une fois décidé, tu abandonnes rarement',
  intuition: 'un savoir intérieur naturel et une sensibilité spirituelle',
};
const ARROWS_MISSING = {
  planning: 'La structure et la persévérance méritent d’être bâties avec listes et routines.',
  willpower: 'La confiance sous pression grandit par de petits engagements tenus.',
  action: 'L’élan aide — commence avant de te sentir prêt.',
  determination: 'Finir ce que tu commences est la leçon; choisis moins de choses, achève-les.',
  intuition: 'Te fier à ton instinct s’améliore par la réflexion calme et la pratique.',
};

const AFFIRMATIONS = {
  1: 'Je mène ma propre vie avec confiance et courage.',
  2: 'Je fais confiance à mon intuition et crée l’harmonie autour de moi.',
  3: 'Je m’exprime librement et j’attire la joie.',
  4: 'Je bâtis mon avenir avec patience et discipline.',
  5: 'J’accueille le changement et j’avance en liberté.',
  6: 'Je donne et reçois de l’amour, et mon foyer est ma force.',
  7: 'Je fais confiance à la sagesse que je tire de chaque expérience.',
  8: 'Je gère mon monde avec équité et j’atteins un succès durable.',
  9: 'J’utilise mon énergie pour servir un but plus grand que moi.',
};

module.exports = { PLANET, MULANK, BHAGYANK, DIGIT_HAVE, DIGIT_MISSING, YEAR_THEME, LUCKY, COMPAT, PLANES, ARROWS, ARROWS_MISSING, AFFIRMATIONS };
