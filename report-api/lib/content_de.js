// German interpretation copy for the full Name Report. Reviewed-quality draft.
const PLANET = { 1: 'Sonne', 2: 'Mond', 3: 'Jupiter', 4: 'Rahu', 5: 'Merkur', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars' };

const MULANK = {
  1: { title: 'Der Anführer', planet: 'Sonne',
    summary: 'Unabhängig, originell und zielstrebig. Am glücklichsten bist du, wenn du deine eigene Richtung bestimmst, und Kontrolle magst du nicht.',
    strengths: 'Führungsstärke, Originalität, Mut, starker Wille, Ehrgeiz.',
    challenges: 'Ego, Sturheit, Ungeduld, Schwierigkeiten, sich unterzuordnen.',
    career: 'Gründer, Führungskraft, Verwaltung, Pionierrollen — überall, wo du führst.',
    relationships: 'Treu und beschützend, braucht aber einen Partner, der deine Unabhängigkeit achtet.',
    health: 'Achte auf Herz, Augen und Blutdruck; Sonnenlicht und Ruhe stärken dich.' },
  2: { title: 'Der Diplomat', planet: 'Mond',
    summary: 'Sanft, intuitiv und kooperativ. Du liest Menschen gut und bringst Harmonie in jede Gruppe.',
    strengths: 'Feingefühl, Takt, Teamgeist, Fantasie, Geduld.',
    challenges: 'Überempfindlichkeit, Stimmungsschwankungen, Unentschlossenheit, Abhängigkeit von anderen.',
    career: 'Beratung, Gastgewerbe, Design, Partnerschaften, unterstützende Rollen.',
    relationships: 'Fürsorglich und romantisch; braucht Bestätigung und emotionale Sicherheit.',
    health: 'Achte auf Verdauung, Schlaf und Flüssigkeitshaushalt; Wasser und Routine helfen.' },
  3: { title: 'Der Kommunikator', planet: 'Jupiter',
    summary: 'Ausdrucksstark, optimistisch und kreativ. Worte, Lehre und Wärme sind deine Gaben.',
    strengths: 'Kreativität, Optimismus, Ausdruck, Wissen, Großzügigkeit.',
    challenges: 'Zerstreute Energie, Vielrederei, Übertreibung, Ungeduld mit Details.',
    career: 'Lehre, Schreiben, Medien, Recht, Beratung, darstellende Kunst.',
    relationships: 'Fröhlich und gesellig; blüht mit jemandem auf, der deine Neugier teilt.',
    health: 'Achte auf Leber, Gewicht und Hals; Maß halten hält dich gesund.' },
  4: { title: 'Der Erbauer', planet: 'Rahu',
    summary: 'Praktisch, systematisch und verlässlich. Du baust Schritt für Schritt Dinge, die Bestand haben.',
    strengths: 'Disziplin, Methode, Verlässlichkeit, Fleiß, Ehrlichkeit.',
    challenges: 'Starrheit, Übervorsicht, Veränderungsscheu, Überarbeitung.',
    career: 'Technik, Betrieb, Immobilien, Systeme, Handwerk.',
    relationships: 'Beständig und zuverlässig; zeigt Liebe durch Taten, nicht Worte.',
    health: 'Achte auf Nervensystem und Rücken; Erdung und Pausen sind wichtig.' },
  5: { title: 'Der Entdecker', planet: 'Merkur',
    summary: 'Vielseitig, schnell und freiheitsliebend. Du sehnst dich nach Veränderung, Reisen und neuen Erfahrungen.',
    strengths: 'Anpassungsfähigkeit, Kommunikation, Witz, Vernetzung, Einfallsreichtum.',
    challenges: 'Ruhelosigkeit, Unbeständigkeit, Impulsivität, Maßlosigkeit.',
    career: 'Vertrieb, Handel, Marketing, Reisen, Technik — alles Schnelllebige.',
    relationships: 'Charmant und verspielt; braucht Freiraum und geistige Anregung.',
    health: 'Achte auf Nerven und Haut; beruhige den Geist, meide Aufputschmittel.' },
  6: { title: 'Der Fürsorgliche', planet: 'Venus',
    summary: 'Liebevoll, verantwortungsbewusst und künstlerisch. Heim, Schönheit und geliebte Menschen stehen an erster Stelle.',
    strengths: 'Liebe, Verantwortung, Ästhetik, Harmonie, Dienstbereitschaft.',
    challenges: 'Sorge, Übergeben, Perfektionismus, Schwierigkeiten, Nein zu sagen.',
    career: 'Design, Wellness, Gastgewerbe, Heilberufe, Familienbetrieb, Kunst.',
    relationships: 'Zutiefst hingebungsvoll und fürsorglich; Heim und Familie stehen im Mittelpunkt.',
    health: 'Achte auf Hals, Nieren und Herz; Schönheit und Ruhe heilen dich.' },
  7: { title: 'Der Suchende', planet: 'Ketu',
    summary: 'Nachdenklich, analytisch und spirituell. Dich zieht die Tiefe an und die Fragen hinter den Dingen.',
    strengths: 'Analyse, Intuition, Forschung, Unabhängigkeit, Tiefe.',
    challenges: 'Rückzug, Grübeln, Skepsis, Distanziertheit.',
    career: 'Forschung, Spiritualität, Analyse, IT, Ermittlung, Schreiben.',
    relationships: 'Zurückhaltend und treu; braucht Alleinsein und einen Partner, der das versteht.',
    health: 'Achte auf Ängste und das Nervensystem; Natur und Stille stärken dich.' },
  8: { title: 'Der Macher', planet: 'Saturn',
    summary: 'Ehrgeizig, organisiert und widerstandsfähig. Geschaffen für Verantwortung, Geld und das lange Spiel.',
    strengths: 'Ehrgeiz, Management, Ausdauer, Gerechtigkeit, Zielstrebigkeit.',
    challenges: 'Arbeitssucht, Härte, Verzögerungen, Druck, Kontrolle.',
    career: 'Wirtschaft, Finanzen, Recht, Verwaltung, große Organisationen.',
    relationships: 'Beschützend und verbindlich; Erfolg und Sicherheit sind Ausdruck der Liebe.',
    health: 'Achte auf Knochen, Gelenke und Zähne; Geduld und Disziplin zahlen sich aus.' },
  9: { title: 'Der Menschenfreund', planet: 'Mars',
    summary: 'Großzügig, mutig und idealistisch. Du empfindest stark und willst, dass deine Arbeit Bedeutung hat.',
    strengths: 'Mut, Mitgefühl, Energie, Idealismus, Führungskraft.',
    challenges: 'Jähzorn, Ungeduld, Impulsivität, sich zu viel aufbürden.',
    career: 'Verteidigung, Medizin, Sozialarbeit, Sport, soziale Anliegen, Chirurgie.',
    relationships: 'Leidenschaftlich und beschützend; braucht ein Anliegen und einen treuen Partner.',
    health: 'Achte auf Entzündungen, Unfälle und Blut; Bewegung lenkt dein Feuer.' },
};

const BHAGYANK = {
  1: 'Dein Schicksal belohnt Initiative, Führung und Eigenständigkeit. Das Leben drängt dich nach vorn.',
  2: 'Dein Weg entfaltet sich über Beziehungen, Geduld und Zusammenarbeit. Du bist bestimmt, Menschen zusammenzubringen.',
  3: 'Das Leben öffnet sich durch Selbstausdruck, Lernen und Freude. Wissen und Kommunikation tragen dich.',
  4: 'Dein Glück baut sich über Disziplin, Struktur und ehrliche Arbeit mit der Zeit auf. Keine Abkürzungen, aber fester Boden.',
  5: 'Wandel ist dein Schicksal: Reisen, Anpassung und Vielfalt. Du bist bestimmt, dich zu bewegen und zu verbinden.',
  6: 'Dein Weg ist Fürsorge, Familie und Verantwortung, mit Anmut getragen. Schönheit und Dienst sind dein Glück.',
  7: 'Dein Schicksal weist nach innen: Weisheit, Spezialisierung und stille Meisterschaft. Tiefe statt Lärm.',
  8: 'Du bist bestimmt für Erfolg, Autorität und materielle Ergebnisse, durch Beharrlichkeit erarbeitet.',
  9: 'Dein Schicksal ist das Geben: Dienst, Mitgefühl und ein größeres Anliegen über dich hinaus.',
};

const DIGIT_HAVE = {
  1: 'Ein starkes Selbstgefühl, Individualität und das Selbstvertrauen, zu zeigen, wer du bist.',
  2: 'Feingefühl, Intuition und Takt — du spürst die Stimmung und gehst behutsam mit Menschen um.',
  3: 'Fantasie und geistige Kreativität — Ideen, Worte und Bilder fließen leicht.',
  4: 'Praktischer Sinn und handwerkliches Können — du kannst in der realen Welt ordnen und bauen.',
  5: 'Emotionale Balance und ein ruhiger Kern — das Herz des Rasters hält dich zusammen.',
  6: 'Liebe zu Heim, Kreativität und Fürsorge — du schaffst Schönheit und kümmerst dich um andere.',
  7: 'Lernen durch Erfahrung — du wirst weiser durch das, was das Leben dir gibt.',
  8: 'Ein Sinn für Ordnung, Methode und Detail — du bringst System in alles.',
  9: 'Ehrgeiz, Antrieb und Menschlichkeit — Energie und der Wunsch, einem größeren Zweck zu dienen.',
};

const DIGIT_MISSING = {
  1: { lesson: 'Die eigene Stimme zu finden und sich zu behaupten erfordert bewusste Anstrengung.', remedy: 'Sprich früh aus, was du denkst; halte kleine Versprechen an dich selbst, um Selbstvertrauen aufzubauen.' },
  2: { lesson: 'Der Intuition zu vertrauen und andere zu lesen kann ein Wachstumsfeld sein.', remedy: 'Halte vor Entscheidungen inne; nimm erste Eindrücke wahr und achte sie.' },
  3: { lesson: 'Gedanken in Worte oder Bilder zu fassen braucht vielleicht Übung.', remedy: 'Schreibe oder skizziere täglich, sei es eine Zeile; teile eine Idee pro Tag.' },
  4: { lesson: 'Routine, Ordnung und Durchhalten lohnt sich, bewusst aufzubauen.', remedy: 'Nutze Checklisten und feste Zeiten; beende eine Aufgabe vor der nächsten.' },
  5: { lesson: 'Unter Druck emotional ausgeglichen zu bleiben ist eine Lektion.', remedy: 'Atme vor dem Reagieren; halte einen gleichmäßigen Tagesrhythmus.' },
  6: { lesson: 'Fürsorge zu zeigen und ein geborgenes Heim zu schaffen ist ein Thema zum Hineinwachsen.', remedy: 'Mach kleine Gesten der Fürsorge zur Gewohnheit; pflege deinen Raum.' },
  7: { lesson: 'Geduld und aus Rückschlägen zu lernen gehört zu deinem Weg.', remedy: 'Denke über Lektionen nach, nicht über Verluste; nimm dir Zeit für stilles Lernen.' },
  8: { lesson: 'Methode, Detail und Umgang mit Geld belohnen Aufmerksamkeit.', remedy: 'Verfolge Einnahmen und Ausgaben; meistere ein System nach dem anderen.' },
  9: { lesson: 'Den Antrieb auf einen größeren Zweck zu lenken ist die Aufgabe.', remedy: 'Schenke einem Anliegen Zeit; richte deine Energie auf etwas über dich selbst hinaus.' },
};

const YEAR_THEME = {
  1: 'Anfänge. Säe Samen, beginne neu, übernimm die Führung. Was du jetzt beginnst, prägt neun Jahre.',
  2: 'Geduld und Partnerschaft. Baue Beziehungen, arbeite zusammen, lass die Dinge reifen. Langsam ist das richtige Tempo.',
  3: 'Ausdruck und Freude. Gestalte, pflege Kontakte, kommuniziere. Dein Optimismus zieht Gelegenheiten an.',
  4: 'Arbeit und Grundlagen. Baue Struktur, sei diszipliniert, kümmere dich um die Details. Mühe jetzt zahlt sich später aus.',
  5: 'Wandel und Freiheit. Rechne mit Bewegung, Reisen und neuen Wegen. Bleib flexibel und offen.',
  6: 'Verantwortung und Heim. Familie, Liebe und Pflicht rücken in den Mittelpunkt. Pflege, was zählt.',
  7: 'Besinnung und Tiefe. Lerne, ruhe, gehe nach innen. Ein Jahr zum Verstehen statt zum Drängen.',
  8: 'Kraft und Lohn. Ehrgeiz, Geld und Anerkennung rücken in den Fokus. Handle mit Integrität.',
  9: 'Abschluss und Loslassen. Beende, vergib, lass los. Mach den Boden frei für einen neuen Zyklus.',
};

const LUCKY = {
  1: { colour: 'Gold, Orange, Gelb', avoid: 'Schwarz, Dunkelblau', days: 'Sonntag, Montag', friendly: [1,2,3,9], gem: 'Rubin', metal: 'Gold', direction: 'Osten', deity: 'Surya' },
  2: { colour: 'Weiß, Creme, Hellgrün', avoid: 'Rot, Schwarz', days: 'Sonntag, Montag, Freitag', friendly: [1,2,7], gem: 'Perle', metal: 'Silber', direction: 'Nordwesten', deity: 'Chandra' },
  3: { colour: 'Gelb, Gold, Violett', avoid: 'Blau', days: 'Donnerstag, Freitag', friendly: [3,6,9], gem: 'Gelber Saphir', metal: 'Gold', direction: 'Nordosten', deity: 'Brihaspati' },
  4: { colour: 'Grau, Blau, elektrische Töne', avoid: 'Leuchtendes Rot', days: 'Samstag, Sonntag', friendly: [1,4,8], gem: 'Hessonit (Gomed)', metal: 'Mischung', direction: 'Südwesten', deity: 'Rahu' },
  5: { colour: 'Grün, Hellgrau, Weiß', avoid: 'Dunkle Töne', days: 'Mittwoch, Freitag', friendly: [1,3,5], gem: 'Smaragd', metal: 'Bronze', direction: 'Norden', deity: 'Budha' },
  6: { colour: 'Blau, Rosa, Weiß', avoid: 'Schwarz', days: 'Freitag, Dienstag', friendly: [3,6,9], gem: 'Diamant / Weißer Saphir', metal: 'Silber', direction: 'Südosten', deity: 'Shukra' },
  7: { colour: 'Hellgrün, Weiß, blasse Töne', avoid: 'Dunkelrot', days: 'Sonntag, Montag', friendly: [2,4,7], gem: 'Katzenauge', metal: 'Mischung', direction: 'Süden', deity: 'Ketu' },
  8: { colour: 'Dunkelblau, Schwarz, Grau', avoid: 'Leuchtendes Orange', days: 'Samstag, Sonntag', friendly: [4,5,8], gem: 'Blauer Saphir', metal: 'Eisen', direction: 'Westen', deity: 'Shani' },
  9: { colour: 'Rot, Rosa, Purpurrot', avoid: 'Schwarz', days: 'Dienstag, Donnerstag', friendly: [3,6,9], gem: 'Rote Koralle', metal: 'Kupfer', direction: 'Süden', deity: 'Mangal' },
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
  thinking: 'der Verstand — wie du denkst, planst und dir Dinge vorstellst',
  feeling: 'das Herz — wie du fühlst, dich verbindest und erschaffst',
  practical: 'die Hände — wie du handelst, ordnest und baust',
};
const ARROWS = {
  planning: 'eine Begabung für Ordnung, Methode und das Durchziehen von Vorhaben',
  willpower: 'starke Entschlossenheit und der Wille, Hindernisse zu überwinden',
  action: 'rastlose Energie und ein Drang, aktiv und beschäftigt zu bleiben',
  determination: 'Beharrlichkeit — einmal entschieden, gibst du selten auf',
  intuition: 'ein natürliches inneres Wissen und spirituelles Feingefühl',
};
const ARROWS_MISSING = {
  planning: 'Struktur und Durchhalten lohnt sich, mit Listen und Routinen aufzubauen.',
  willpower: 'Zuversicht unter Druck wächst mit kleinen, gehaltenen Vorsätzen.',
  action: 'Schwung hilft — beginne, bevor du dich bereit fühlst.',
  determination: 'Zu Ende zu bringen, was du beginnst, ist die Lektion; wähle weniger, vollende es.',
  intuition: 'Dem Bauchgefühl zu vertrauen wächst mit stiller Besinnung und Übung.',
};

const AFFIRMATIONS = {
  1: 'Ich führe mein eigenes Leben mit Selbstvertrauen und Mut.',
  2: 'Ich vertraue meiner Intuition und schaffe Harmonie um mich herum.',
  3: 'Ich drücke mich frei aus und ziehe Freude an.',
  4: 'Ich baue meine Zukunft mit Geduld und Disziplin.',
  5: 'Ich heiße Wandel willkommen und bewege mich in Freiheit.',
  6: 'Ich gebe und empfange Liebe, und mein Heim ist meine Stärke.',
  7: 'Ich vertraue der Weisheit, die ich aus jeder Erfahrung gewinne.',
  8: 'Ich lenke meine Welt mit Gerechtigkeit und erreiche bleibenden Erfolg.',
  9: 'Ich nutze meine Energie, um einem Zweck zu dienen, der größer ist als ich.',
};

module.exports = { PLANET, MULANK, BHAGYANK, DIGIT_HAVE, DIGIT_MISSING, YEAR_THEME, LUCKY, COMPAT, PLANES, ARROWS, ARROWS_MISSING, AFFIRMATIONS };
