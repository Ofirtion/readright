// Story library — initial seed of 5 stories at different levels
// Each story has full Hebrew niqqud and word-level metadata

import { ADDITIONAL_STORIES } from './stories2';

const ORIGINAL_STORIES = [
  // ============================================
  // LEVEL 2 — Beginners (כיתה ב')
  // ============================================
  {
    id: 'cat-space',
    title: "דָּנָה וְהֶחָתוּל מֵהֶחָלָל",
    subtitle: "הַרְפַּתְקָה בְּכוֹכָב הַשַּׁעֲשׁוּעִים",
    level: 2,
    category: 'fantasy',
    interests: ['fantasy', 'space', 'animals'],
    emoji: "🐱",
    estimatedMinutes: 4,
    paragraphs: [
      {
        illustration: "🌳",
        words: [
          { text: "בְּעֶרֶב", plain: "בערב", hint: "בְּ-עֶ-רֶב" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "כְּשֶׁדָּנָה", plain: "כשדנה", hint: "כְּ-שֶׁ-דָּ-נָה" },
          { text: "שִׂחֲקָה", plain: "שיחקה", hint: "שִׂ-חֲ-קָה" },
          { text: "בְּגַן", plain: "בגן", hint: "בְּ-גַן" },
          { text: "הַשַּׁעֲשׁוּעִים", plain: "השעשועים", hint: "הַ-שַׁ-עֲ-שׁוּ-עִים", isHard: true },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "שָׁמְעָה", plain: "שמעה", hint: "שָׁמְ-עָה" },
          { text: "רַעַשׁ", plain: "רעש", hint: "רַ-עַשׁ" },
          { text: "מוּזָר", plain: "מוזר", hint: "מוּ-זָר" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "✨",
        words: [
          { text: "בֵּין", plain: "בין", hint: "בֵּין" },
          { text: "הַשִּׂיחִים", plain: "השיחים", hint: "הַ-שִׂי-חִים" },
          { text: "הִתְגַּלָּה", plain: "התגלה", hint: "הִתְ-גַּ-לָּה", isHard: true },
          { text: "חָתוּל", plain: "חתול", hint: "חָ-תוּל" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: ",", plain: ",", isPunct: true },
          { text: "כָּחוֹל", plain: "כחול", hint: "כָּ-חוֹל" },
          { text: "כְּמוֹ", plain: "כמו", hint: "כְּ-מוֹ" },
          { text: "שָׁמַיִם", plain: "שמיים", hint: "שָׁ-מַ-יִם", alternates: ["שמים"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "עֵינָיו", plain: "עיניו", hint: "עֵי-נָיו" },
          { text: "נָצְצוּ", plain: "נצצו", hint: "נָצְ-צוּ" },
          { text: "כְּמוֹ", plain: "כמו", hint: "כְּ-מוֹ" },
          { text: "כּוֹכָבִים", plain: "כוכבים", hint: "כּוֹ-כָ-בִים", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💬",
        words: [
          { text: "\"שָׁלוֹם", plain: "שלום", hint: "שָׁ-לוֹם" },
          { text: "חָתוּל", plain: "חתול", hint: "חָ-תוּל" },
          { text: "קָטָן\"", plain: "קטן", hint: "קָ-טָן" },
          { text: ",", plain: ",", isPunct: true },
          { text: "לָחֲשָׁה", plain: "לחשה", hint: "לָ-חֲ-שָׁה" },
          { text: "דָּנָה", plain: "דנה", hint: "דָּ-נָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַחָתוּל", plain: "החתול", hint: "הַ-חָ-תוּל" },
          { text: "פָּתַח", plain: "פתח", hint: "פָּ-תַח" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "פִּיו", plain: "פיו", hint: "פִּיו" },
          { text: ",", plain: ",", isPunct: true },
          { text: "וּבִמְקוֹם", plain: "ובמקום", hint: "וּ-בִמְ-קוֹם" },
          { text: "מְיָאוּ", plain: "מיאו", hint: "מְ-יָאוּ" },
          { text: "יָצְאוּ", plain: "יצאו", hint: "יָצְ-אוּ" },
          { text: "מִמֶּנּוּ", plain: "ממנו", hint: "מִ-מֶּ-נּוּ", isHard: true },
          { text: "מִלִּים", plain: "מילים", hint: "מִ-לִּים", alternates: ["מלים"] },
          { text: "!", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "🚀",
        words: [
          { text: "\"שְׁמִי", plain: "שמי", hint: "שְׁ-מִי" },
          { text: "זוּזוּ\"", plain: "זוזו", hint: "זוּ-זוּ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "הַחָתוּל", plain: "החתול", hint: "הַ-חָ-תוּל" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"בָּאתִי", plain: "באתי", hint: "בָּא-תִי" },
          { text: "מִכּוֹכָב", plain: "מכוכב", hint: "מִ-כּוֹ-כָב" },
          { text: "רָחוֹק", plain: "רחוק", hint: "רָ-חוֹק" },
          { text: ",", plain: ",", isPunct: true },
          { text: "וַאֲנִי", plain: "ואני", hint: "וַ-אֲ-נִי" },
          { text: "צָרִיךְ", plain: "צריך", hint: "צָ-רִיךְ" },
          { text: "עֶזְרָה", plain: "עזרה", hint: "עֶזְ-רָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "סְפִינַת", plain: "ספינת", hint: "סְ-פִי-נַת", isHard: true },
          { text: "הֶחָלָל", plain: "החלל", hint: "הֶ-חָ-לָל" },
          { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
          { text: "הִתְקַלְקְלָה", plain: "התקלקלה", hint: "הִתְ-קַלְ-קְ-לָה", isHard: true },
          { text: "!\"", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "🤝",
        words: [
          { text: "דָּנָה", plain: "דנה", hint: "דָּ-נָה" },
          { text: "לֹא", plain: "לא", hint: "לֹא" },
          { text: "פָּחֲדָה", plain: "פחדה", hint: "פָּ-חֲ-דָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "אָהֲבָה", plain: "אהבה", hint: "אָ-הֲ-בָה" },
          { text: "הַרְפַּתְקָאוֹת", plain: "הרפתקאות", hint: "הַרְ-פַּתְ-קָ-אוֹת", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"בּוֹא", plain: "בוא", hint: "בּוֹא" },
          { text: "אִתִּי\"", plain: "איתי", hint: "אִ-תִּי", alternates: ["אתי"] },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "אָמְרָה", plain: "אמרה", hint: "אָמְ-רָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"נִמְצָא", plain: "נמצא", hint: "נִמְ-צָא" },
          { text: "פִּתְרוֹן", plain: "פתרון", hint: "פִּתְ-רוֹן" },
          { text: "בְּיַחַד\"", plain: "ביחד", hint: "בְּ-יַ-חַד" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌟",
        words: [
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "בָּדְקוּ", plain: "בדקו", hint: "בָּדְ-קוּ" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַסְּפִינָה", plain: "הספינה", hint: "הַ-סְּ-פִי-נָה" },
          { text: "וְתִקְּנוּ", plain: "ותיקנו", hint: "וְ-תִ-קְּ-נוּ", alternates: ["ותקנו"] },
          { text: "אוֹתָהּ", plain: "אותה", hint: "אוֹ-תָהּ" },
          { text: ".", plain: ".", isPunct: true },
          { text: "לִפְנֵי", plain: "לפני", hint: "לִפְ-נֵי" },
          { text: "שֶׁזוּזוּ", plain: "שזוזו", hint: "שֶׁ-זוּ-זוּ" },
          { text: "טָס", plain: "טס", hint: "טָס" },
          { text: "חֲזָרָה", plain: "חזרה", hint: "חֲ-זָ-רָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "נָתַן", plain: "נתן", hint: "נָ-תַן" },
          { text: "לְדָנָה", plain: "לדנה", hint: "לְ-דָ-נָה" },
          { text: "כּוֹכָב", plain: "כוכב", hint: "כּוֹ-כָב" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: "וְזוֹהֵר", plain: "וזוהר", hint: "וְ-זוֹ-הֵר", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"תּוֹדָה", plain: "תודה", hint: "תּוֹ-דָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "חֲבֵרָה", plain: "חברה", hint: "חֲ-בֵ-רָה" },
          { text: "אֲמִתִּית\"", plain: "אמיתית", hint: "אֲ-מִ-תִּית", alternates: ["אמתית"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 1 — First readers (כיתה א')
  // ============================================
  {
    id: 'puppy-first-day',
    title: "הַכַּלְבְּלָב הַקָּטָן",
    subtitle: "יוֹם רִאשׁוֹן בְּבַיִת חָדָשׁ",
    level: 1,
    category: 'animals',
    interests: ['animals', 'friends'],
    emoji: "🐶",
    estimatedMinutes: 2,
    paragraphs: [
      {
        illustration: "🏠",
        words: [
          { text: "לְרוֹן", plain: "לרון", hint: "לְ-רוֹן" },
          { text: "יֵשׁ", plain: "יש", hint: "יֵשׁ" },
          { text: "כֶּלֶב", plain: "כלב", hint: "כֶּ-לֶב" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַשֵּׁם", plain: "השם", hint: "הַ-שֵּׁם" },
          { text: "שֶׁלּוֹ", plain: "שלו", hint: "שֶׁ-לּוֹ" },
          { text: "צ'וֹפֶּר", plain: "צופר", hint: "צ'וֹ-פֶּר" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🦴",
        words: [
          { text: "צ'וֹפֶּר", plain: "צופר", hint: "צ'וֹ-פֶּר" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "לְשַׂחֵק", plain: "לשחק", hint: "לְ-שַׂ-חֵק" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "עֶצֶם", plain: "עצם", hint: "עֶ-צֶם" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "רוֹן", plain: "רון", hint: "רוֹן" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌳",
        words: [
          { text: "בַּבֹּקֶר", plain: "בבוקר", hint: "בַּ-בֹּ-קֶר" },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "הוֹלְכִים", plain: "הולכים", hint: "הוֹלְ-כִים" },
          { text: "לַגַּן", plain: "לגן", hint: "לַ-גַּן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "בָּעֶרֶב", plain: "בערב", hint: "בָּ-עֶ-רֶב" },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "יְשֵׁנִים", plain: "ישנים", hint: "יְ-שֵׁ-נִים" },
          { text: "בְּיַחַד", plain: "ביחד", hint: "בְּ-יַ-חַד" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "❤️",
        words: [
          { text: "רוֹן", plain: "רון", hint: "רוֹן" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "צ'וֹפֶּר", plain: "צופר", hint: "צ'וֹ-פֶּר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "וְצ'וֹפֶּר", plain: "וצופר", hint: "וְ-צ'וֹ-פֶּר" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "רוֹן", plain: "רון", hint: "רוֹן" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 3 — Intermediate (כיתה ג'-ד')
  // ============================================
  {
    id: 'forest-mystery',
    title: "תַּעֲלוּמַת הַיַּעַר הַקָּסוּם",
    subtitle: "מָה הִסְתַּתֵּר מֵאֲחוֹרֵי הָעֵץ?",
    level: 3,
    category: 'mystery',
    interests: ['mystery', 'adventure', 'fantasy', 'nature'],
    emoji: "🌲",
    estimatedMinutes: 5,
    paragraphs: [
      {
        illustration: "🌲",
        words: [
          { text: "מַאיָה", plain: "מאיה", hint: "מַא-יָה" },
          { text: "וְיוֹנָתָן", plain: "ויונתן", hint: "וְ-יוֹ-נָ-תָן" },
          { text: "טִיְּלוּ", plain: "טיילו", hint: "טִיְּ-לוּ", alternates: ["טילו"], isHard: true },
          { text: "בַּיַּעַר", plain: "ביער", hint: "בַּ-יַּ-עַר" },
          { text: "הָעַתִּיק", plain: "העתיק", hint: "הָ-עַ-תִּיק" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָעֵצִים", plain: "העצים", hint: "הָ-עֵ-צִים" },
          { text: "הָיוּ", plain: "היו", hint: "הָ-יוּ" },
          { text: "גְּבוֹהִים", plain: "גבוהים", hint: "גְּ-בוֹ-הִים" },
          { text: "וַעֲנָקִיִּים", plain: "וענקיים", hint: "וַ-עֲ-נָ-קִיִּים", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🔍",
        words: [
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "שָׁמְעוּ", plain: "שמעו", hint: "שָׁמְ-עוּ" },
          { text: "צְלִיל", plain: "צליל", hint: "צְ-לִיל" },
          { text: "מְשֻׁנֶּה", plain: "משונה", hint: "מְ-שֻׁ-נֶּה", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַצְּלִיל", plain: "הצליל", hint: "הַ-צְּ-לִיל" },
          { text: "הִתְקָרֵב", plain: "התקרב", hint: "הִתְ-קָ-רֵב" },
          { text: "אֲלֵיהֶם", plain: "אליהם", hint: "אֲ-לֵי-הֶם" },
          { text: "לְאַט", plain: "לאט", hint: "לְ-אַט" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "✨",
        words: [
          { text: "מֵאֲחוֹרֵי", plain: "מאחורי", hint: "מֵ-אֲ-חוֹ-רֵי", isHard: true },
          { text: "עֵץ", plain: "עץ", hint: "עֵץ" },
          { text: "עָבֹה", plain: "עבה", hint: "עָ-בֹה" },
          { text: "הִתְגַּלְּתָה", plain: "התגלתה", hint: "הִתְ-גַּ-לְּ-תָה", isHard: true },
          { text: "יְצוּרָה", plain: "יצורה", hint: "יְ-צוּ-רָה" },
          { text: "קְטַנָּה", plain: "קטנה", hint: "קְ-טַ-נָּה" },
          { text: "וּמְאִירָה", plain: "ומאירה", hint: "וּ-מְ-אִי-רָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָיוּ", plain: "היו", hint: "הָ-יוּ" },
          { text: "לָהּ", plain: "לה", hint: "לָהּ" },
          { text: "כְּנָפַיִם", plain: "כנפיים", hint: "כְּ-נָ-פַ-יִם", alternates: ["כנפים"] },
          { text: "שְׁקוּפוֹת", plain: "שקופות", hint: "שְׁ-קוּ-פוֹת" },
          { text: "וְעֵינַיִם", plain: "ועיניים", hint: "וְ-עֵי-נַ-יִם", alternates: ["ועינים"] },
          { text: "יְרֻקּוֹת", plain: "ירוקות", hint: "יְ-רֻ-קּוֹת" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🧚",
        words: [
          { text: "\"אַל", plain: "אל", hint: "אַל" },
          { text: "תִּפְחֲדוּ\"", plain: "תפחדו", hint: "תִּפְ-חֲ-דוּ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמְרָה", plain: "אמרה", hint: "אָמְ-רָה" },
          { text: "הַיְּצוּרָה", plain: "היצורה", hint: "הַ-יְּ-צוּ-רָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"אֲנִי", plain: "אני", hint: "אֲ-נִי" },
          { text: "פֵיָה", plain: "פיה", hint: "פֵי-ָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "וְהָיַעַר", plain: "והיער", hint: "וְ-הָ-יַ-עַר" },
          { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
          { text: "בְּסַכָּנָה", plain: "בסכנה", hint: "בְּ-סַ-כָּ-נָה", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "אֲנִי", plain: "אני", hint: "אֲ-נִי" },
          { text: "צְרִיכָה", plain: "צריכה", hint: "צְ-רִי-כָה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "עֶזְרַתְכֶם", plain: "עזרתכם", hint: "עֶזְ-רַתְ-כֶם", isHard: true },
          { text: ".\"", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🤝",
        words: [
          { text: "מַאיָה", plain: "מאיה", hint: "מַא-יָה" },
          { text: "וְיוֹנָתָן", plain: "ויונתן", hint: "וְ-יוֹ-נָ-תָן" },
          { text: "הִבִּיטוּ", plain: "הביטו", hint: "הִ-בִּי-טוּ" },
          { text: "זֶה", plain: "זה", hint: "זֶה" },
          { text: "בָּזֶה", plain: "בזה", hint: "בָּ-זֶה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "יָדְעוּ", plain: "ידעו", hint: "יָדְ-עוּ" },
          { text: "שֶׁזֶּה", plain: "שזה", hint: "שֶׁ-זֶּה" },
          { text: "יִהְיֶה", plain: "יהיה", hint: "יִהְ-יֶה" },
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "מְיֻחָד", plain: "מיוחד", hint: "מְ-יֻ-חָד", alternates: ["מיחד"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "וְכָךְ", plain: "וכך", hint: "וְ-כָךְ" },
          { text: "הִתְחִילָה", plain: "התחילה", hint: "הִתְ-חִי-לָה" },
          { text: "הַרְפַּתְקָה", plain: "הרפתקה", hint: "הַרְ-פַּתְ-קָה", isHard: true },
          { text: "שֶׁלֹּא", plain: "שלא", hint: "שֶׁ-לֹּא" },
          { text: "יִשְׁכְּחוּ", plain: "ישכחו", hint: "יִשְׁ-כְּ-חוּ" },
          { text: "לְעוֹלָם", plain: "לעולם", hint: "לְ-עוֹ-לָם" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 2 — More options
  // ============================================
  {
    id: 'dino-egg',
    title: "הַבֵּיצָה שֶׁל הַדִּינוֹזָאוּר",
    subtitle: "מָה הִתְחַבֵּא בְּתוֹךְ הַבֵּיצָה?",
    level: 2,
    category: 'dinosaurs',
    interests: ['dinosaurs', 'adventure', 'science'],
    emoji: "🦕",
    estimatedMinutes: 3,
    paragraphs: [
      {
        illustration: "🥚",
        words: [
          { text: "אֵיתָן", plain: "איתן", hint: "אֵי-תָן" },
          { text: "מָצָא", plain: "מצא", hint: "מָ-צָא" },
          { text: "בֵּיצָה", plain: "ביצה", hint: "בֵּי-צָה" },
          { text: "גְּדוֹלָה", plain: "גדולה", hint: "גְּ-דוֹ-לָה" },
          { text: "בַּחוֹף", plain: "בחוף", hint: "בַּ-חוֹף" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַבֵּיצָה", plain: "הביצה", hint: "הַ-בֵּי-צָה" },
          { text: "הָיְתָה", plain: "היתה", hint: "הָיְ-תָה" },
          { text: "יְרֻקָּה", plain: "ירוקה", hint: "יְ-רֻ-קָּה" },
          { text: "וּמְנֻמֶּרֶת", plain: "ומנומרת", hint: "וּ-מְ-נֻ-מֶּ-רֶת", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🏠",
        words: [
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "לָקַח", plain: "לקח", hint: "לָ-קַח" },
          { text: "אוֹתָהּ", plain: "אותה", hint: "אוֹ-תָהּ" },
          { text: "הַבַּיְתָה", plain: "הביתה", hint: "הַ-בַּיְ-תָה" },
          { text: "וְשָׂם", plain: "ושם", hint: "וְ-שָׂם" },
          { text: "עָלֶיהָ", plain: "עליה", hint: "עָ-לֶי-הָ" },
          { text: "שְׂמִיכָה", plain: "שמיכה", hint: "שְׂ-מִי-כָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אַחֲרֵי", plain: "אחרי", hint: "אַ-חֲ-רֵי" },
          { text: "שָׁבוּעַ", plain: "שבוע", hint: "שָׁ-בוּ-עַ" },
          { text: "הַבֵּיצָה", plain: "הביצה", hint: "הַ-בֵּי-צָה" },
          { text: "הִתְחִילָה", plain: "התחילה", hint: "הִתְ-חִי-לָה" },
          { text: "לִרְעֹד", plain: "לרעוד", hint: "לִ-רְ-עֹד" },
          { text: "!", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "🦖",
        words: [
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "נִסְדְּקָה", plain: "נסדקה", hint: "נִסְ-דְּ-קָה", isHard: true },
          { text: ",", plain: ",", isPunct: true },
          { text: "וּמִתּוֹכָהּ", plain: "ומתוכה", hint: "וּ-מִ-תּוֹ-כָהּ", isHard: true },
          { text: "יָצָא", plain: "יצא", hint: "יָ-צָא" },
          { text: "דִּינוֹזָאוּר", plain: "דינוזאור", hint: "דִּי-נוֹ-זָ-אוּר", isHard: true },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אֵיתָן", plain: "איתן", hint: "אֵי-תָן" },
          { text: "לֹא", plain: "לא", hint: "לֹא" },
          { text: "הֶאֱמִין", plain: "האמין", hint: "הֶ-אֱ-מִין" },
          { text: "לְעֵינָיו", plain: "לעיניו", hint: "לְ-עֵי-נָיו" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "❤️",
        words: [
          { text: "הַדִּינוֹזָאוּר", plain: "הדינוזאור", hint: "הַ-דִּי-נוֹ-זָ-אוּר" },
          { text: "הִבִּיט", plain: "הביט", hint: "הִ-בִּיט" },
          { text: "בְּאֵיתָן", plain: "באיתן", hint: "בְּ-אֵי-תָן" },
          { text: "וְחִיֵּךְ", plain: "וחייך", hint: "וְ-חִי-יֵךְ", alternates: ["וחיך"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"אַתָּה", plain: "אתה", hint: "אַ-תָּה" },
          { text: "הַאַבָּא", plain: "האבא", hint: "הַ-אַ-בָּא" },
          { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
          { text: "עַכְשָׁו\"", plain: "עכשיו", hint: "עַכְ-שָׁו" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "בְּשִׂמְחָה", plain: "בשמחה", hint: "בְּ-שִׂמְ-חָה" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 1 — Simpler story
  // ============================================
  {
    id: 'red-apple',
    title: "הַתַּפּוּחַ הָאָדֹם",
    subtitle: "סִפּוּר עַל יַלְדָּה רְעֵבָה",
    level: 1,
    category: 'friends',
    interests: ['friends', 'humor'],
    emoji: "🍎",
    estimatedMinutes: 2,
    paragraphs: [
      {
        illustration: "🍎",
        words: [
          { text: "לְתָמָר", plain: "לתמר", hint: "לְ-תָ-מָר" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "תַּפּוּחַ", plain: "תפוח", hint: "תַּ-פּוּ-חַ" },
          { text: "אָדֹם", plain: "אדום", hint: "אָ-דֹם", alternates: ["אדם"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "תַּפּוּחַ", plain: "תפוח", hint: "תַּ-פּוּ-חַ" },
          { text: "גָּדוֹל", plain: "גדול", hint: "גָּ-דוֹל" },
          { text: "וּמָתוֹק", plain: "ומתוק", hint: "וּ-מָ-תוֹק" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "👧",
        words: [
          { text: "תָּמָר", plain: "תמר", hint: "תָּ-מָר" },
          { text: "הָיְתָה", plain: "היתה", hint: "הָיְ-תָה" },
          { text: "רְעֵבָה", plain: "רעבה", hint: "רְ-עֵ-בָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "רָצְתָה", plain: "רצתה", hint: "רָצְ-תָה" },
          { text: "לֶאֱכֹל", plain: "לאכול", hint: "לֶ-אֱ-כֹל" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַתַּפּוּחַ", plain: "התפוח", hint: "הַ-תַּ-פּוּ-חַ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🐦",
        words: [
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: "צִפּוֹר", plain: "ציפור", hint: "צִ-פּוֹר", alternates: ["צפור"] },
          { text: "קְטַנָּה", plain: "קטנה", hint: "קְ-טַ-נָּה" },
          { text: "בָּאָה", plain: "באה", hint: "בָּ-אָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "גַּם", plain: "גם", hint: "גַּם" },
          { text: "הָיְתָה", plain: "היתה", hint: "הָיְ-תָה" },
          { text: "רְעֵבָה", plain: "רעבה", hint: "רְ-עֵ-בָה" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💕",
        words: [
          { text: "תָּמָר", plain: "תמר", hint: "תָּ-מָר" },
          { text: "חָתְכָה", plain: "חתכה", hint: "חָתְ-כָה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַתַּפּוּחַ", plain: "התפוח", hint: "הַ-תַּ-פּוּ-חַ" },
          { text: "לִשְׁנַיִם", plain: "לשניים", hint: "לִשְׁ-נַ-יִם", alternates: ["לשנים"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "חֵצִי", plain: "חצי", hint: "חֵ-צִי" },
          { text: "לָהּ", plain: "לה", hint: "לָהּ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "וְחֵצִי", plain: "וחצי", hint: "וְ-חֵ-צִי" },
          { text: "לַצִּפּוֹר", plain: "לציפור", hint: "לַ-צִּ-פּוֹר", alternates: ["לצפור"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "כָּכָה", plain: "ככה", hint: "כָּ-כָה" },
          { text: "כֻּלָּם", plain: "כולם", hint: "כֻּ-לָּם", alternates: ["כלם"] },
          { text: "שְׂמֵחִים", plain: "שמחים", hint: "שְׂ-מֵ-חִים" },
          { text: "!", plain: "!", isPunct: true }
        ]
      }
    ]
  }
];

import { ENGLISH_STORIES } from './stories.en';
import i18n from '../i18n';

// Combine original and additional stories (Hebrew)
const HEBREW_STORIES = [...ORIGINAL_STORIES, ...ADDITIONAL_STORIES];

// STORIES is now language-aware. Components that import STORIES get whichever
// language is currently active. When the user switches language, components
// re-render via useTranslation() hook → fresh read from STORIES.
//
// Why a getter instead of a plain const? React components reading top-level
// constants don't re-evaluate on language change. Functions do.
export const STORIES = new Proxy([], {
  get(target, prop) {
    const stories = i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
    const value = stories[prop];
    return typeof value === 'function' ? value.bind(stories) : value;
  },
  has(target, prop) {
    const stories = i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
    return prop in stories;
  },
  ownKeys() {
    const stories = i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
    return Reflect.ownKeys(stories);
  },
  getOwnPropertyDescriptor(target, prop) {
    const stories = i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
    return Object.getOwnPropertyDescriptor(stories, prop);
  },
});

// Helper: count words in a story (excluding punctuation)
export function countWords(story) {
  return story.paragraphs.reduce((acc, p) =>
    acc + p.words.filter(w => !w.isPunct).length, 0
  );
}

// Helper: get stories filtered by level and/or interests (language-aware)
export function getStoriesFor(level, interestIds = []) {
  const stories = i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
  return stories.filter(story => {
    const levelMatch = story.level === level;
    const interestMatch = interestIds.length === 0 ||
      story.interests.some(i => interestIds.includes(i));
    return levelMatch || interestMatch;
  }).sort((a, b) => {
    if (a.level === level && b.level !== level) return -1;
    if (b.level === level && a.level !== level) return 1;
    return 0;
  });
}

// Get a single story by ID. Searches BOTH language datasets so that
// stories saved by ID continue to work even if the user switches language.
export function getStoryById(id) {
  return [...HEBREW_STORIES, ...ENGLISH_STORIES].find(s => s.id === id);
}

// Get all stories in the currently active language
export function getCurrentLanguageStories() {
  return i18n.language === 'en' ? ENGLISH_STORIES : HEBREW_STORIES;
}
