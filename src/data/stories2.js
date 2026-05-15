// Additional stories — expanding the library from 5 to 15
// All stories include full Hebrew niqqud and word-level metadata for ASR matching

export const ADDITIONAL_STORIES = [

  // ============================================
  // LEVEL 1 — Very Beginners
  // ============================================
  {
    id: 'butterfly-garden',
    title: "הַפַּרְפַּר וְהַפֶּרַח",
    subtitle: "סִפּוּר עַל חֲבֵרוּת",
    level: 1,
    category: 'nature',
    interests: ['nature', 'animals', 'friends'],
    emoji: "🦋",
    estimatedMinutes: 2,
    paragraphs: [
      {
        illustration: "🌷",
        words: [
          { text: "בַּגַּן", plain: "בגן", hint: "בַּ-גַּן" },
          { text: "יֵשׁ", plain: "יש", hint: "יֵשׁ" },
          { text: "פֶּרַח", plain: "פרח", hint: "פֶּ-רַח" },
          { text: "אָדֹם", plain: "אדום", hint: "אָ-דֹם", alternates: ["אדם"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַפֶּרַח", plain: "הפרח", hint: "הַ-פֶּ-רַח" },
          { text: "יָפֶה", plain: "יפה", hint: "יָ-פֶה" },
          { text: "מְאֹד", plain: "מאוד", hint: "מְ-אֹד", alternates: ["מאד"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🦋",
        words: [
          { text: "פַּרְפַּר", plain: "פרפר", hint: "פַּרְ-פַּר" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: "הִגִּיעַ", plain: "הגיע", hint: "הִ-גִּי-עַ" },
          { text: "לַגַּן", plain: "לגן", hint: "לַ-גַּן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "רָאָה", plain: "ראה", hint: "רָ-אָה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַפֶּרַח", plain: "הפרח", hint: "הַ-פֶּ-רַח" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💬",
        words: [
          { text: "\"שָׁלוֹם", plain: "שלום", hint: "שָׁ-לוֹם" },
          { text: "פֶּרַח\"", plain: "פרח", hint: "פֶּ-רַח" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "הַפַּרְפַּר", plain: "הפרפר", hint: "הַ-פַּרְ-פַּר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"רוֹצֶה", plain: "רוצה", hint: "רוֹ-צֶה" },
          { text: "לִהְיוֹת", plain: "להיות", hint: "לִהְ-יוֹת" },
          { text: "חָבֵר", plain: "חבר", hint: "חָ-בֵר" },
          { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
          { text: "?\"", plain: "?", isPunct: true }
        ]
      },
      {
        illustration: "❤️",
        words: [
          { text: "הַפֶּרַח", plain: "הפרח", hint: "הַ-פֶּ-רַח" },
          { text: "חִיֵּךְ", plain: "חייך", hint: "חִ-יֵּךְ", alternates: ["חיך"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"כֵּן", plain: "כן", hint: "כֵּן" },
          { text: "!", plain: "!", isPunct: true },
          { text: "בּוֹא", plain: "בוא", hint: "בּוֹא" },
          { text: "אֵלַי", plain: "אלי", hint: "אֵ-לַי" },
          { text: ".\"", plain: ".", isPunct: true },
          { text: "וְהֵם", plain: "והם", hint: "וְ-הֵם" },
          { text: "הָיוּ", plain: "היו", hint: "הָ-יוּ" },
          { text: "חֲבֵרִים", plain: "חברים", hint: "חֲ-בֵ-רִים" },
          { text: "טוֹבִים", plain: "טובים", hint: "טוֹ-בִים" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'rainy-day',
    title: "יוֹם גָּשׁוּם",
    subtitle: "סִפּוּר עַל הַחֹרֶף",
    level: 1,
    category: 'nature',
    interests: ['nature', 'friends'],
    emoji: "☔",
    estimatedMinutes: 2,
    paragraphs: [
      {
        illustration: "🌧️",
        words: [
          { text: "הַיּוֹם", plain: "היום", hint: "הַ-יּוֹם" },
          { text: "יוֹרֵד", plain: "יורד", hint: "יוֹ-רֵד" },
          { text: "גֶּשֶׁם", plain: "גשם", hint: "גֶּ-שֶׁם" },
          { text: ".", plain: ".", isPunct: true },
          { text: "נֹעַם", plain: "נועם", hint: "נֹ-עַם", alternates: ["נעם"] },
          { text: "מַבִּיט", plain: "מביט", hint: "מַ-בִּיט" },
          { text: "בַּחַלּוֹן", plain: "בחלון", hint: "בַּ-חַ-לּוֹן" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "☂️",
        words: [
          { text: "אִמָּא", plain: "אמא", hint: "אִ-מָּא" },
          { text: "אוֹמֶרֶת", plain: "אומרת", hint: "אוֹ-מֶ-רֶת" },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"קַח", plain: "קח", hint: "קַח" },
          { text: "מִטְרִיָּה", plain: "מטרייה", hint: "מִטְ-רִ-יָּה", alternates: ["מטריה"] },
          { text: "!\"", plain: "!", isPunct: true },
          { text: "נֹעַם", plain: "נועם", hint: "נֹ-עַם", alternates: ["נעם"] },
          { text: "שָׂמֵחַ", plain: "שמח", hint: "שָׂ-מֵ-חַ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💧",
        words: [
          { text: "בַּחוּץ", plain: "בחוץ", hint: "בַּ-חוּץ" },
          { text: "יֵשׁ", plain: "יש", hint: "יֵשׁ" },
          { text: "שְׁלוּלִיּוֹת", plain: "שלוליות", hint: "שְׁ-לוּ-לִ-יּוֹת", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "נֹעַם", plain: "נועם", hint: "נֹ-עַם", alternates: ["נעם"] },
          { text: "קוֹפֵץ", plain: "קופץ", hint: "קוֹ-פֵץ" },
          { text: "בְּתוֹכָן", plain: "בתוכן", hint: "בְּ-תוֹ-כָן" },
          { text: "!", plain: "!", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'birthday-cake',
    title: "עוּגַת יוֹם הֻלֶּדֶת",
    subtitle: "סִפּוּר עַל מַתָּנָה",
    level: 1,
    category: 'friends',
    interests: ['friends', 'humor'],
    emoji: "🎂",
    estimatedMinutes: 2,
    paragraphs: [
      {
        illustration: "🎉",
        words: [
          { text: "הַיּוֹם", plain: "היום", hint: "הַ-יּוֹם" },
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "הֻלֶּדֶת", plain: "הולדת", hint: "הֻ-לֶּ-דֶת", alternates: ["הלדת"] },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "מַיָּה", plain: "מיה", hint: "מַ-יָּה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "בַּת", plain: "בת", hint: "בַּת" },
          { text: "שֶׁבַע", plain: "שבע", hint: "שֶׁ-בַע" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🎂",
        words: [
          { text: "אַבָּא", plain: "אבא", hint: "אַ-בָּא" },
          { text: "הֵכִין", plain: "הכין", hint: "הֵ-כִין" },
          { text: "עוּגָה", plain: "עוגה", hint: "עוּ-גָה" },
          { text: "גְּדוֹלָה", plain: "גדולה", hint: "גְּ-דוֹ-לָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "יֵשׁ", plain: "יש", hint: "יֵשׁ" },
          { text: "עָלֶיהָ", plain: "עליה", hint: "עָ-לֶי-הָ" },
          { text: "שִׁבְעָה", plain: "שבעה", hint: "שִׁבְ-עָה" },
          { text: "נֵרוֹת", plain: "נרות", hint: "נֵ-רוֹת" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🎁",
        words: [
          { text: "מַיָּה", plain: "מיה", hint: "מַ-יָּה" },
          { text: "מְכַבָּה", plain: "מכבה", hint: "מְ-כַ-בָּה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַנֵּרוֹת", plain: "הנרות", hint: "הַ-נֵּ-רוֹת" },
          { text: ".", plain: ".", isPunct: true },
          { text: "כֻּלָּם", plain: "כולם", hint: "כֻּ-לָּם", alternates: ["כלם"] },
          { text: "שָׁרִים", plain: "שרים", hint: "שָׁ-רִים" },
          { text: "וְצוֹחֲקִים", plain: "וצוחקים", hint: "וְ-צוֹ-חֲ-קִים" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 2 — Beginners
  // ============================================
  {
    id: 'ocean-mystery',
    title: "הַתַּעֲלוּמָה בְּחוֹף הַיָּם",
    subtitle: "מַסַּע מַרְתֵּק לְעוֹלָם הַשֶּׁקֶט",
    level: 2,
    category: 'adventure',
    interests: ['mystery', 'adventure', 'nature'],
    emoji: "🌊",
    estimatedMinutes: 4,
    paragraphs: [
      {
        illustration: "🏖️",
        words: [
          { text: "בְּבֹקֶר", plain: "בבוקר", hint: "בְּ-בֹ-קֶר", alternates: ["בבקר"] },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "יוֹנָתָן", plain: "יונתן", hint: "יוֹ-נָ-תָן" },
          { text: "וּמִיכָאֵל", plain: "ומיכאל", hint: "וּ-מִי-כָאֵל" },
          { text: "הָלְכוּ", plain: "הלכו", hint: "הָלְ-כוּ" },
          { text: "לְחוֹף", plain: "לחוף", hint: "לְ-חוֹף" },
          { text: "הַיָּם", plain: "הים", hint: "הַ-יָּם" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🐚",
        words: [
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "מָצְאוּ", plain: "מצאו", hint: "מָצְ-אוּ" },
          { text: "צֶדֶף", plain: "צדף", hint: "צֶ-דֶף" },
          { text: "מוּזָר", plain: "מוזר", hint: "מוּ-זָר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "סָגֹל", plain: "סגול", hint: "סָ-גֹל", alternates: ["סגל"] },
          { text: "וְיָרֹק", plain: "וירוק", hint: "וְ-יָ-רֹק", alternates: ["וירק"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "👂",
        words: [
          { text: "מִיכָאֵל", plain: "מיכאל", hint: "מִי-כָאֵל" },
          { text: "הִצְמִיד", plain: "הצמיד", hint: "הִצְ-מִיד" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַצֶּדֶף", plain: "הצדף", hint: "הַ-צֶּ-דֶף" },
          { text: "לְאָזְנוֹ", plain: "לאוזנו", hint: "לְ-אָזְ-נוֹ", alternates: ["לאזנו"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "שָׁמַע", plain: "שמע", hint: "שָׁ-מַע" },
          { text: "קוֹל", plain: "קול", hint: "קוֹל" },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "יְלָדִים", plain: "ילדים", hint: "יְ-לָ-דִים" },
          { text: "צוֹחֲקִים", plain: "צוחקים", hint: "צוֹ-חֲ-קִים" },
          { text: "!", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "🌊",
        words: [
          { text: "\"זֶה", plain: "זה", hint: "זֶה" },
          { text: "צֶדֶף", plain: "צדף", hint: "צֶ-דֶף" },
          { text: "קָסוּם\"", plain: "קסום", hint: "קָ-סוּם" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "יוֹנָתָן", plain: "יונתן", hint: "יוֹ-נָ-תָן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "לָקְחוּ", plain: "לקחו", hint: "לָקְ-חוּ" },
          { text: "אוֹתוֹ", plain: "אותו", hint: "אוֹ-תוֹ" },
          { text: "הַבַּיְתָה", plain: "הביתה", hint: "הַ-בַּיְ-תָה" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌙",
        words: [
          { text: "בַּלַּיְלָה", plain: "בלילה", hint: "בַּ-לַּיְ-לָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הַצֶּדֶף", plain: "הצדף", hint: "הַ-צֶּ-דֶף" },
          { text: "הִתְחִיל", plain: "התחיל", hint: "הִתְ-חִיל" },
          { text: "לִזְהֹר", plain: "לזהור", hint: "לִזְ-הֹר", alternates: ["לזהר"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "יוֹנָתָן", plain: "יונתן", hint: "יוֹ-נָ-תָן" },
          { text: "וּמִיכָאֵל", plain: "ומיכאל", hint: "וּ-מִי-כָאֵל" },
          { text: "יָדְעוּ", plain: "ידעו", hint: "יָדְ-עוּ" },
          { text: "שֶׁמָּחָר", plain: "שמחר", hint: "שֶׁ-מָּ-חָר" },
          { text: "תִּהְיֶה", plain: "תהיה", hint: "תִּהְ-יֶה" },
          { text: "הַרְפַּתְקָה", plain: "הרפתקה", hint: "הַרְ-פַּתְ-קָה", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'soccer-dream',
    title: "הַחֲלוֹם שֶׁל אִיתַי",
    subtitle: "סִפּוּר עַל אִמּוּן וְהַתְמָדָה",
    level: 2,
    category: 'sports',
    interests: ['sports', 'friends'],
    emoji: "⚽",
    estimatedMinutes: 3,
    paragraphs: [
      {
        illustration: "⚽",
        words: [
          { text: "אִיתַי", plain: "איתי", hint: "אִי-תַי" },
          { text: "אוֹהֵב", plain: "אוהב", hint: "אוֹ-הֵב" },
          { text: "כַּדּוּרֶגֶל", plain: "כדורגל", hint: "כַּ-דּוּ-רֶ-גֶל", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "מְשַׂחֵק", plain: "משחק", hint: "מְ-שַׂ-חֵק" },
          { text: "כָּל", plain: "כל", hint: "כָּל" },
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💪",
        words: [
          { text: "אֲבָל", plain: "אבל", hint: "אֲ-בָל" },
          { text: "אִיתַי", plain: "איתי", hint: "אִי-תַי" },
          { text: "לֹא", plain: "לא", hint: "לֹא", alternates: ["לא"] },
          { text: "טוֹב", plain: "טוב", hint: "טוֹב" },
          { text: "מְאוֹד", plain: "מאוד", hint: "מְ-אוֹד", alternates: ["מאד"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "רוֹצֶה", plain: "רוצה", hint: "רוֹ-צֶה" },
          { text: "לְהִשְׁתַּפֵּר", plain: "להשתפר", hint: "לְ-הִשְׁ-תַּ-פֵּר", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🏃",
        words: [
          { text: "כָּל", plain: "כל", hint: "כָּל" },
          { text: "בֹּקֶר", plain: "בוקר", hint: "בֹּ-קֶר", alternates: ["בקר"] },
          { text: ",", plain: ",", isPunct: true },
          { text: "אִיתַי", plain: "איתי", hint: "אִי-תַי" },
          { text: "רָץ", plain: "רץ", hint: "רָץ" },
          { text: "בַּפַּארְק", plain: "בפארק", hint: "בַּ-פַּארְק" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אַחַר", plain: "אחר", hint: "אַ-חַר" },
          { text: "כָּךְ", plain: "כך", hint: "כָּךְ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "מִתְאַמֵּן", plain: "מתאמן", hint: "מִתְ-אַ-מֵּן" },
          { text: "עִם", plain: "עם", hint: "עִם" },
          { text: "הַכַּדּוּר", plain: "הכדור", hint: "הַ-כַּ-דּוּר" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🥅",
        words: [
          { text: "אַחֲרֵי", plain: "אחרי", hint: "אַ-חֲ-רֵי" },
          { text: "חֳדָשִׁים", plain: "חודשים", hint: "חֳ-דָ-שִׁים", alternates: ["חדשים"] },
          { text: "רַבִּים", plain: "רבים", hint: "רַ-בִּים" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אִיתַי", plain: "איתי", hint: "אִי-תַי" },
          { text: "הִבְקִיעַ", plain: "הבקיע", hint: "הִבְ-קִי-עַ", isHard: true },
          { text: "גּוֹל", plain: "גול", hint: "גּוֹל" },
          { text: "רִאשׁוֹן", plain: "ראשון", hint: "רִא-שׁוֹן" },
          { text: "!", plain: "!", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "הֲכִי", plain: "הכי", hint: "הֲ-כִי" },
          { text: "מְאֻשָּׁר", plain: "מאושר", hint: "מְ-אֻ-שָּׁר", alternates: ["מאשר"] },
          { text: "בָּעוֹלָם", plain: "בעולם", hint: "בָּ-עוֹ-לָם" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 3 — Intermediate
  // ============================================
  {
    id: 'inventor-girl',
    title: "הַמַּמְצִיאָה הַקְּטַנָּה",
    subtitle: "סִפּוּר עַל סַקְרָנוּת וְיָדַע",
    level: 3,
    category: 'science',
    interests: ['science', 'humor'],
    emoji: "🔬",
    estimatedMinutes: 5,
    paragraphs: [
      {
        illustration: "🧪",
        words: [
          { text: "שִׁירָה", plain: "שירה", hint: "שִׁי-רָה" },
          { text: "הָיְתָה", plain: "הייתה", hint: "הָיְ-תָה", alternates: ["היתה"] },
          { text: "יַלְדָּה", plain: "ילדה", hint: "יַלְ-דָּה" },
          { text: "סַקְרָנִית", plain: "סקרנית", hint: "סַקְ-רָ-נִית" },
          { text: "בְּמְיֻחָד", plain: "במיוחד", hint: "בְּ-מְיֻ-חָד", alternates: ["במיחד"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "כָּל", plain: "כל", hint: "כָּל" },
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "שָׁאֲלָה", plain: "שאלה", hint: "שָׁ-אֲ-לָה" },
          { text: "מֵאָה", plain: "מאה", hint: "מֵ-אָה" },
          { text: "שְׁאֵלוֹת", plain: "שאלות", hint: "שְׁ-אֵ-לוֹת" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💡",
        words: [
          { text: "\"לָמָּה", plain: "למה", hint: "לָ-מָּה" },
          { text: "הַשָּׁמַיִם", plain: "השמיים", hint: "הַ-שָּׁ-מַ-יִם", alternates: ["השמים"] },
          { text: "כְּחֻלִּים", plain: "כחולים", hint: "כְּ-חֻ-לִּים", alternates: ["כחלים"] },
          { text: "?\"", plain: "?", isPunct: true },
          { text: "\"אֵיךְ", plain: "איך", hint: "אֵיךְ" },
          { text: "צִפֳּרִים", plain: "ציפורים", hint: "צִ-פֳּ-רִים", alternates: ["צפרים"] },
          { text: "טָסוֹת", plain: "טסות", hint: "טָ-סוֹת" },
          { text: "?\"", plain: "?", isPunct: true },
          { text: "אַבָּא", plain: "אבא", hint: "אַ-בָּא" },
          { text: "וְאִמָּא", plain: "ואמא", hint: "וְ-אִ-מָּא" },
          { text: "תָּמִיד", plain: "תמיד", hint: "תָּ-מִיד" },
          { text: "עָנוּ", plain: "ענו", hint: "עָ-נוּ" },
          { text: "לָהּ", plain: "לה", hint: "לָהּ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "⚙️",
        words: [
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "שִׁירָה", plain: "שירה", hint: "שִׁי-רָה" },
          { text: "הֶחְלִיטָה", plain: "החליטה", hint: "הֶחְ-לִי-טָה", isHard: true },
          { text: "לְהַמְצִיא", plain: "להמציא", hint: "לְ-הַמְ-צִיא" },
          { text: "מַשֶּׁהוּ", plain: "משהו", hint: "מַ-שֶּׁ-הוּ" },
          { text: "חָדָשׁ", plain: "חדש", hint: "חָ-דָשׁ" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "אָסְפָה", plain: "אספה", hint: "אָסְ-פָה" },
          { text: "קַרְטוֹנִים", plain: "קרטונים", hint: "קַרְ-טוֹ-נִים" },
          { text: ",", plain: ",", isPunct: true },
          { text: "גּוּמִיּוֹת", plain: "גומיות", hint: "גּוּ-מִ-יּוֹת" },
          { text: "וַחֲבָלִים", plain: "וחבלים", hint: "וַ-חֲ-בָ-לִים" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🤖",
        words: [
          { text: "אַחֲרֵי", plain: "אחרי", hint: "אַ-חֲ-רֵי" },
          { text: "שָׁעוֹת", plain: "שעות", hint: "שָׁ-עוֹת" },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "עֲבוֹדָה", plain: "עבודה", hint: "עֲ-בוֹ-דָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "בָּנְתָה", plain: "בנתה", hint: "בָּנְ-תָה" },
          { text: "רוֹבּוֹט", plain: "רובוט", hint: "רוֹ-בּוֹט" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: "שֶׁאוֹסֵף", plain: "שאוסף", hint: "שֶׁ-אוֹ-סֵף" },
          { text: "צַעֲצוּעִים", plain: "צעצועים", hint: "צַ-עֲ-צוּ-עִים", isHard: true },
          { text: "!", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "🏆",
        words: [
          { text: "אִמָּא", plain: "אמא", hint: "אִ-מָּא" },
          { text: "וְאַבָּא", plain: "ואבא", hint: "וְ-אַ-בָּא" },
          { text: "הִתְפַּעֲלוּ", plain: "התפעלו", hint: "הִתְ-פַּ-עֲ-לוּ", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"שִׁירָה", plain: "שירה", hint: "שִׁי-רָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אַתְּ", plain: "את", hint: "אַתְּ" },
          { text: "מַמְצִיאָה", plain: "ממציאה", hint: "מַמְ-צִי-אָה" },
          { text: "אֲמִתִּית\"", plain: "אמיתית", hint: "אֲ-מִ-תִּית", alternates: ["אמתית"] },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "אַבָּא", plain: "אבא", hint: "אַ-בָּא" },
          { text: "בְּגַאֲוָה", plain: "בגאווה", hint: "בְּ-גַ-אֲ-וָה", alternates: ["בגאוה"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'lion-mouse',
    title: "הָאַרְיֵה וְהָעַכְבָּר",
    subtitle: "מַעֲשִׂיָּה עַל חֲבֵרוּת לֹא צְפוּיָה",
    level: 3,
    category: 'animals',
    interests: ['animals', 'friends'],
    emoji: "🦁",
    estimatedMinutes: 5,
    paragraphs: [
      {
        illustration: "🌳",
        words: [
          { text: "בְּיַעַר", plain: "ביער", hint: "בְּ-יַ-עַר" },
          { text: "גָּדוֹל", plain: "גדול", hint: "גָּ-דוֹל" },
          { text: "וְצָפוּף", plain: "וצפוף", hint: "וְ-צָ-פוּף" },
          { text: ",", plain: ",", isPunct: true },
          { text: "חַי", plain: "חי", hint: "חַי" },
          { text: "אַרְיֵה", plain: "אריה", hint: "אַרְ-יֵה" },
          { text: "אַדִּיר", plain: "אדיר", hint: "אַ-דִּיר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "מֶלֶךְ", plain: "מלך", hint: "מֶ-לֶךְ" },
          { text: "הַחַיּוֹת", plain: "החיות", hint: "הַ-חַ-יּוֹת" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🐭",
        words: [
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "כְּשֶׁהָאַרְיֵה", plain: "כשהאריה", hint: "כְּ-שֶׁ-הָ-אַרְ-יֵה" },
          { text: "יָשַׁן", plain: "ישן", hint: "יָ-שַׁן" },
          { text: ",", plain: ",", isPunct: true },
          { text: "עַכְבָּר", plain: "עכבר", hint: "עַכְ-בָּר" },
          { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
          { text: "טִפֵּס", plain: "טיפס", hint: "טִ-פֵּס" },
          { text: "עָלָיו", plain: "עליו", hint: "עָ-לָיו" },
          { text: "בְּטָעוּת", plain: "בטעות", hint: "בְּ-טָ-עוּת" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "😤",
        words: [
          { text: "הָאַרְיֵה", plain: "האריה", hint: "הָ-אַרְ-יֵה" },
          { text: "הִתְעוֹרֵר", plain: "התעורר", hint: "הִתְ-עוֹ-רֵר" },
          { text: "וְכָעַס", plain: "וכעס", hint: "וְ-כָ-עַס" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"אֲנִי", plain: "אני", hint: "אֲ-נִי" },
          { text: "אֹכַל", plain: "אוכל", hint: "אֹ-כַל", alternates: ["אכל"] },
          { text: "אוֹתְךָ", plain: "אותך", hint: "אוֹתְ-ךָ" },
          { text: "!\"", plain: "!", isPunct: true },
          { text: "נָהַם", plain: "נהם", hint: "נָ-הַם" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָעַכְבָּר", plain: "העכבר", hint: "הָ-עַכְ-בָּר" },
          { text: "רָעַד", plain: "רעד", hint: "רָ-עַד" },
          { text: "מִפַּחַד", plain: "מפחד", hint: "מִ-פַּ-חַד" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🙏",
        words: [
          { text: "\"בְּבַקָּשָׁה", plain: "בבקשה", hint: "בְּ-בַ-קָּ-שָׁה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אַל", plain: "אל", hint: "אַל" },
          { text: "תֹּאכַל", plain: "תאכל", hint: "תֹּא-כַל" },
          { text: "אוֹתִי\"", plain: "אותי", hint: "אוֹ-תִי" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִתְחַנֵּן", plain: "התחנן", hint: "הִתְ-חַ-נֵּן", isHard: true },
          { text: "הָעַכְבָּר", plain: "העכבר", hint: "הָ-עַכְ-בָּר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: "אוּכַל", plain: "אוכל", hint: "אוּ-כַל" },
          { text: "לַעֲזֹר", plain: "לעזור", hint: "לַ-עֲ-זֹר", alternates: ["לעזר"] },
          { text: "לְךָ", plain: "לך", hint: "לְ-ךָ" },
          { text: ".\"", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "😄",
        words: [
          { text: "הָאַרְיֵה", plain: "האריה", hint: "הָ-אַרְ-יֵה" },
          { text: "צָחַק", plain: "צחק", hint: "צָ-חַק" },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"אַתָּה", plain: "אתה", hint: "אַ-תָּה" },
          { text: "תַּעֲזֹר", plain: "תעזור", hint: "תַּ-עֲ-זֹר", alternates: ["תעזר"] },
          { text: "לִי", plain: "לי", hint: "לִי" },
          { text: "?\"", plain: "?", isPunct: true },
          { text: "אֲבָל", plain: "אבל", hint: "אֲ-בָל" },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "שִׁחְרֵר", plain: "שחרר", hint: "שִׁחְ-רֵר" },
          { text: "אוֹתוֹ", plain: "אותו", hint: "אוֹ-תוֹ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🪤",
        words: [
          { text: "כַּעֲבֹר", plain: "כעבור", hint: "כַּ-עֲ-בֹר", alternates: ["כעבר"] },
          { text: "שָׁבוּעַ", plain: "שבוע", hint: "שָׁ-בוּ-עַ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הָאַרְיֵה", plain: "האריה", hint: "הָ-אַרְ-יֵה" },
          { text: "נִלְכַּד", plain: "נלכד", hint: "נִלְ-כַּד" },
          { text: "בְּרֶשֶׁת", plain: "ברשת", hint: "בְּ-רֶ-שֶׁת" },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "צַיָּדִים", plain: "ציידים", hint: "צַ-יָּ-דִים", alternates: ["צידים"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָעַכְבָּר", plain: "העכבר", hint: "הָ-עַכְ-בָּר" },
          { text: "שָׁמַע", plain: "שמע", hint: "שָׁ-מַע" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "שַׁאֲגוֹתָיו", plain: "שאגותיו", hint: "שַׁ-אֲ-גוֹ-תָיו", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "✂️",
        words: [
          { text: "הָעַכְבָּר", plain: "העכבר", hint: "הָ-עַכְ-בָּר" },
          { text: "רָץ", plain: "רץ", hint: "רָץ" },
          { text: "וְכִרְסֵם", plain: "וכרסם", hint: "וְ-כִרְ-סֵם", isHard: true },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַחֲבָלִים", plain: "החבלים", hint: "הַ-חֲ-בָ-לִים" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָאַרְיֵה", plain: "האריה", hint: "הָ-אַרְ-יֵה" },
          { text: "הִשְׁתַּחְרֵר", plain: "השתחרר", hint: "הִשְׁ-תַּחְ-רֵר", isHard: true },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"תּוֹדָה", plain: "תודה", hint: "תּוֹ-דָה" },
          { text: "חָבֵר", plain: "חבר", hint: "חָ-בֵר" },
          { text: "קָטָן\"", plain: "קטן", hint: "קָ-טָן" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 4 — Advanced
  // ============================================
  {
    id: 'time-machine',
    title: "מְכוֹנַת הַזְּמַן שֶׁל סָבָּא",
    subtitle: "הַרְפַּתְקָה בֵּין הַתְּקוּפוֹת",
    level: 4,
    category: 'fantasy',
    interests: ['fantasy', 'adventure', 'science', 'history'],
    emoji: "⏰",
    estimatedMinutes: 6,
    paragraphs: [
      {
        illustration: "🏠",
        words: [
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "רוֹנִי", plain: "רוני", hint: "רוֹ-נִי" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "מַדְעָן", plain: "מדען", hint: "מַ-דְ-עָן" },
          { text: "מְפֻרְסָם", plain: "מפורסם", hint: "מְ-פֻרְ-סָם", alternates: ["מפרסם"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "בַּמַּרְתֵּף", plain: "במרתף", hint: "בַּ-מַּרְ-תֵּף", isHard: true },
          { text: "שֶׁלּוֹ", plain: "שלו", hint: "שֶׁ-לּוֹ" },
          { text: "הָיוּ", plain: "היו", hint: "הָ-יוּ" },
          { text: "הַמְצָאוֹת", plain: "המצאות", hint: "הַמְ-צָ-אוֹת" },
          { text: "מַרְהִיבוֹת", plain: "מרהיבות", hint: "מַרְ-הִי-בוֹת", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🔧",
        words: [
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "רוֹנִי", plain: "רוני", hint: "רוֹ-נִי" },
          { text: "גִּלָּה", plain: "גילה", hint: "גִּ-לָּה", alternates: ["גלה"] },
          { text: "מַשֶּׁהוּ", plain: "משהו", hint: "מַ-שֶּׁ-הוּ" },
          { text: "מַדְהִים", plain: "מדהים", hint: "מַ-דְ-הִים" },
          { text: ":", plain: ":", isPunct: true },
          { text: "תֵּבָה", plain: "תיבה", hint: "תֵּ-בָה" },
          { text: "מַתַּכְתִּית", plain: "מתכתית", hint: "מַ-תַּכְ-תִּית", isHard: true },
          { text: "עִם", plain: "עם", hint: "עִם" },
          { text: "כַּפְתּוֹרִים", plain: "כפתורים", hint: "כַּפְ-תּוֹ-רִים" },
          { text: "מְהַבְהֲבִים", plain: "מהבהבים", hint: "מְ-הַבְ-הֲ-בִים", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "❓",
        words: [
          { text: "\"סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: ",", plain: ",", isPunct: true },
          { text: "מָה", plain: "מה", hint: "מָה" },
          { text: "זֶה", plain: "זה", hint: "זֶה" },
          { text: "?\"", plain: "?", isPunct: true },
          { text: "שָׁאַל", plain: "שאל", hint: "שָׁ-אַל" },
          { text: ".", plain: ".", isPunct: true },
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: "חִיֵּךְ", plain: "חייך", hint: "חִ-יֵּךְ", alternates: ["חיך"] },
          { text: "בְּמִסְתּוֹרִיּוּת", plain: "במסתוריות", hint: "בְּ-מִסְ-תּוֹ-רִ-יּוּת", isHard: true },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"זוֹ", plain: "זו", hint: "זוֹ" },
          { text: "מְכוֹנַת", plain: "מכונת", hint: "מְ-כוֹ-נַת" },
          { text: "הַזְּמַן", plain: "הזמן", hint: "הַ-זְּ-מַן" },
          { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
          { text: ".\"", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🦖",
        words: [
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "נִכְנְסוּ", plain: "נכנסו", hint: "נִכְ-נְ-סוּ" },
          { text: "פְּנִימָה", plain: "פנימה", hint: "פְּ-נִי-מָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: "לָחַץ", plain: "לחץ", hint: "לָ-חַץ" },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "כַּפְתּוֹר", plain: "כפתור", hint: "כַּפְ-תּוֹר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "מָצְאוּ", plain: "מצאו", hint: "מָצְ-אוּ" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "עַצְמָם", plain: "עצמם", hint: "עַצְ-מָם" },
          { text: "בְּתוֹךְ", plain: "בתוך", hint: "בְּ-תוֹךְ" },
          { text: "יַעַר", plain: "יער", hint: "יַ-עַר" },
          { text: "פְּרֵהִיסְטוֹרִי", plain: "פרהיסטורי", hint: "פְּ-רֵ-הִיסְ-טוֹ-רִי", isHard: true },
          { text: "!", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "👀",
        words: [
          { text: "דִּינוֹזָאוּר", plain: "דינוזאור", hint: "דִּי-נוֹ-זָ-אוּר" },
          { text: "עֲנָקִי", plain: "ענקי", hint: "עֲ-נָ-קִי" },
          { text: "עָמַד", plain: "עמד", hint: "עָ-מַד" },
          { text: "מוּלָם", plain: "מולם", hint: "מוּ-לָם" },
          { text: ".", plain: ".", isPunct: true },
          { text: "רוֹנִי", plain: "רוני", hint: "רוֹ-נִי" },
          { text: "נֶחְרַד", plain: "נחרד", hint: "נֶחְ-רַד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אֲבָל", plain: "אבל", hint: "אֲ-בָל" },
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: "הִרְגִּיעַ", plain: "הרגיע", hint: "הִרְ-גִּי-עַ" },
          { text: "אוֹתוֹ", plain: "אותו", hint: "אוֹ-תוֹ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌌",
        words: [
          { text: "אַחֲרֵי", plain: "אחרי", hint: "אַ-חֲ-רֵי" },
          { text: "שֶׁחָקְרוּ", plain: "שחקרו", hint: "שֶׁ-חָקְ-רוּ" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַסְּבִיבָה", plain: "הסביבה", hint: "הַ-סְּ-בִי-בָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "חָזְרוּ", plain: "חזרו", hint: "חָזְ-רוּ" },
          { text: "לְמַעְבָּדָתוֹ", plain: "למעבדתו", hint: "לְ-מַעְ-בָּ-דָ-תוֹ", isHard: true },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "📚",
        words: [
          { text: "\"זוֹ", plain: "זו", hint: "זוֹ" },
          { text: "הָיְתָה", plain: "הייתה", hint: "הָיְ-תָה", alternates: ["היתה"] },
          { text: "הַהַרְפַּתְקָה", plain: "ההרפתקה", hint: "הַ-הַרְ-פַּתְ-קָה", isHard: true },
          { text: "הֲכִי", plain: "הכי", hint: "הֲ-כִי" },
          { text: "מַדְהִימָה", plain: "מדהימה", hint: "מַ-דְ-הִי-מָה" },
          { text: "בְּחַיַּי\"", plain: "בחיי", hint: "בְּ-חַ-יַּי" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "רוֹנִי", plain: "רוני", hint: "רוֹ-נִי" },
          { text: ".", plain: ".", isPunct: true },
          { text: "סָבָּא", plain: "סבא", hint: "סָ-בָּא" },
          { text: "הִבְטִיחַ", plain: "הבטיח", hint: "הִבְ-טִי-חַ" },
          { text: "לְקַחַת", plain: "לקחת", hint: "לְ-קַ-חַת" },
          { text: "אוֹתוֹ", plain: "אותו", hint: "אוֹ-תוֹ" },
          { text: "שׁוּב", plain: "שוב", hint: "שׁוּב" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'desert-journey',
    title: "מַסַּע בַּמִּדְבָּר",
    subtitle: "סִפּוּר עַל אֹמֶץ וְהִשָּׂרְדוּת",
    level: 4,
    category: 'adventure',
    interests: ['adventure', 'nature', 'history'],
    emoji: "🐪",
    estimatedMinutes: 6,
    paragraphs: [
      {
        illustration: "☀️",
        words: [
          { text: "הַשֶּׁמֶשׁ", plain: "השמש", hint: "הַ-שֶּׁ-מֶשׁ" },
          { text: "הִכְּתָה", plain: "הכתה", hint: "הִ-כְּ-תָה" },
          { text: "בְּעָצְמָה", plain: "בעוצמה", hint: "בְּ-עָצְ-מָה", alternates: ["בעצמה"] },
          { text: "רַבָּה", plain: "רבה", hint: "רַ-בָּה" },
          { text: "בַּמִּדְבָּר", plain: "במדבר", hint: "בַּ-מִּ-דְ-בָּר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אֲדִיר", plain: "אדיר", hint: "אֲ-דִיר" },
          { text: "וְאַחוֹתוֹ", plain: "ואחותו", hint: "וְ-אַ-חוֹ-תוֹ" },
          { text: "מַעֲיָן", plain: "מעיין", hint: "מַ-עֲ-יָן", alternates: ["מעין"] },
          { text: "צָעֲדוּ", plain: "צעדו", hint: "צָ-עֲ-דוּ" },
          { text: "לְצַד", plain: "לצד", hint: "לְ-צַד" },
          { text: "הַגְּמַל", plain: "הגמל", hint: "הַ-גְּ-מַל" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "💧",
        words: [
          { text: "\"אֲנִי", plain: "אני", hint: "אֲ-נִי" },
          { text: "צְמֵאָה", plain: "צמאה", hint: "צְ-מֵ-אָה" },
          { text: "נוֹרָא\"", plain: "נורא", hint: "נוֹ-רָא" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אָמְרָה", plain: "אמרה", hint: "אָמְ-רָה" },
          { text: "מַעֲיָן", plain: "מעיין", hint: "מַ-עֲ-יָן", alternates: ["מעין"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "אֲדִיר", plain: "אדיר", hint: "אֲ-דִיר" },
          { text: "הוֹשִׁיט", plain: "הושיט", hint: "הוֹ-שִׁיט" },
          { text: "לָהּ", plain: "לה", hint: "לָהּ" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַמֵּימִיָּה", plain: "המימייה", hint: "הַ-מֵּי-מִ-יָּה", alternates: ["המימיה"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🐍",
        words: [
          { text: "פִּתְאוֹם", plain: "פתאום", hint: "פִּתְ-אוֹם" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הַגְּמַל", plain: "הגמל", hint: "הַ-גְּ-מַל" },
          { text: "נֶעֱצַר", plain: "נעצר", hint: "נֶ-עֱ-צַר" },
          { text: ".", plain: ".", isPunct: true },
          { text: "נָחָשׁ", plain: "נחש", hint: "נָ-חָשׁ" },
          { text: "אָרֹךְ", plain: "ארוך", hint: "אָ-רֹךְ", alternates: ["ארך"] },
          { text: "וְצָהֹב", plain: "וצהוב", hint: "וְ-צָ-הֹב", alternates: ["וצהב"] },
          { text: "חָצָה", plain: "חצה", hint: "חָ-צָה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַדֶּרֶךְ", plain: "הדרך", hint: "הַ-דֶּ-רֶךְ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🏜️",
        words: [
          { text: "אֲדִיר", plain: "אדיר", hint: "אֲ-דִיר" },
          { text: "לֹא", plain: "לא", hint: "לֹא", alternates: ["לא"] },
          { text: "פָּחַד", plain: "פחד", hint: "פָּ-חַד" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "זָכַר", plain: "זכר", hint: "זָ-כַר" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "מַה", plain: "מה", hint: "מַה" },
          { text: "שֶּׁאַבָּא", plain: "שאבא", hint: "שֶּׁ-אַ-בָּא" },
          { text: "לִמֵּד", plain: "לימד", hint: "לִ-מֵּד", alternates: ["למד"] },
          { text: "אוֹתוֹ", plain: "אותו", hint: "אוֹ-תוֹ" },
          { text: ":", plain: ":", isPunct: true },
          { text: "לְהִשָּׁאֵר", plain: "להישאר", hint: "לְ-הִ-שָּׁ-אֵר", alternates: ["להשאר"] },
          { text: "רָגוּעַ", plain: "רגוע", hint: "רָ-גוּ-עַ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌅",
        words: [
          { text: "בָּעֶרֶב", plain: "בערב", hint: "בָּ-עֶ-רֶב" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הֵם", plain: "הם", hint: "הֵם" },
          { text: "הִגִּיעוּ", plain: "הגיעו", hint: "הִ-גִּי-עוּ" },
          { text: "לְנָוֵה", plain: "לנווה", hint: "לְ-נָ-וֵה", alternates: ["לנוה"] },
          { text: "מִדְבָּר", plain: "מדבר", hint: "מִדְ-בָּר" },
          { text: "יָרֹק", plain: "ירוק", hint: "יָ-רֹק", alternates: ["ירק"] },
          { text: ".", plain: ".", isPunct: true },
          { text: "מַעְיָנוֹת", plain: "מעיינות", hint: "מַעְ-יָ-נוֹת", alternates: ["מעינות"] },
          { text: "קְרִירִים", plain: "קרירים", hint: "קְ-רִי-רִים" },
          { text: "זָרְמוּ", plain: "זרמו", hint: "זָרְ-מוּ" },
          { text: "בַּסְּבִיבָה", plain: "בסביבה", hint: "בַּ-סְּ-בִי-בָה" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌟",
        words: [
          { text: "\"הִצְלַחְנוּ", plain: "הצלחנו", hint: "הִצְ-לַחְ-נוּ" },
          { text: "!\"", plain: "!", isPunct: true },
          { text: "אָמְרָה", plain: "אמרה", hint: "אָמְ-רָה" },
          { text: "מַעֲיָן", plain: "מעיין", hint: "מַ-עֲ-יָן", alternates: ["מעין"] },
          { text: "בְּשִׂמְחָה", plain: "בשמחה", hint: "בְּ-שִׂמְ-חָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אֲדִיר", plain: "אדיר", hint: "אֲ-דִיר" },
          { text: "הוֹדָה", plain: "הודה", hint: "הוֹ-דָה" },
          { text: "לַגְּמַל", plain: "לגמל", hint: "לַ-גְּ-מַל" },
          { text: "הַנֶּאֱמָן", plain: "הנאמן", hint: "הַ-נֶּ-אֱ-מָן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַמַּסָּע", plain: "המסע", hint: "הַ-מַּ-סָּע" },
          { text: "לִמֵּד", plain: "לימד", hint: "לִ-מֵּד", alternates: ["למד"] },
          { text: "אוֹתָם", plain: "אותם", hint: "אוֹ-תָם" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "מַשְׁמָעוּת", plain: "משמעות", hint: "מַשְׁ-מָ-עוּת" },
          { text: "הָאֹמֶץ", plain: "האומץ", hint: "הָ-אֹ-מֶץ", alternates: ["האמץ"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  // ============================================
  // LEVEL 5 — Expert
  // ============================================
  {
    id: 'wise-king',
    title: "הַמֶּלֶךְ הֶחָכָם וְהָאִכָּר",
    subtitle: "מַעֲשִׂיָּה עַתִּיקָה עַל חָכְמָה",
    level: 5,
    category: 'history',
    interests: ['history', 'mystery'],
    emoji: "👑",
    estimatedMinutes: 7,
    paragraphs: [
      {
        illustration: "🏰",
        words: [
          { text: "בְּמַמְלָכָה", plain: "בממלכה", hint: "בְּ-מַמְ-לָ-כָה" },
          { text: "רְחוֹקָה", plain: "רחוקה", hint: "רְ-חוֹ-קָה" },
          { text: "חַי", plain: "חי", hint: "חַי" },
          { text: "מֶלֶךְ", plain: "מלך", hint: "מֶ-לֶךְ" },
          { text: "חָכָם", plain: "חכם", hint: "חָ-כָם" },
          { text: "וְצוֹדֵק", plain: "וצודק", hint: "וְ-צוֹ-דֵק" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "הָיָה", plain: "היה", hint: "הָ-יָה" },
          { text: "אָהוּב", plain: "אהוב", hint: "אָ-הוּב" },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "כָּל", plain: "כל", hint: "כָּל" },
          { text: "תּוֹשָׁבָיו", plain: "תושביו", hint: "תּוֹ-שָׁ-בָיו", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🌾",
        words: [
          { text: "יוֹם", plain: "יום", hint: "יוֹם" },
          { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִגִּיעַ", plain: "הגיע", hint: "הִ-גִּי-עַ" },
          { text: "לַאֲרְמוֹן", plain: "לארמון", hint: "לַ-אֲרְ-מוֹן" },
          { text: "אִכָּר", plain: "איכר", hint: "אִ-כָּר" },
          { text: "זָקֵן", plain: "זקן", hint: "זָ-קֵן" },
          { text: "וְהִתְלוֹנֵן", plain: "והתלונן", hint: "וְ-הִתְ-לוֹ-נֵן", isHard: true },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"אֲדוֹנִי", plain: "אדוני", hint: "אֲ-דוֹ-נִי" },
          { text: "הַמֶּלֶךְ", plain: "המלך", hint: "הַ-מֶּ-לֶךְ" },
          { text: ",", plain: ",", isPunct: true },
          { text: "שְׁכֵנִי", plain: "שכני", hint: "שְׁ-כֵ-נִי" },
          { text: "גָּנַב", plain: "גנב", hint: "גָּ-נַב" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "פָּרָתִי", plain: "פרתי", hint: "פָּ-רָ-תִי" },
          { text: ".\"", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🤔",
        words: [
          { text: "הַמֶּלֶךְ", plain: "המלך", hint: "הַ-מֶּ-לֶךְ" },
          { text: "הִקְשִׁיב", plain: "הקשיב", hint: "הִקְ-שִׁיב" },
          { text: "בְּרֹב", plain: "ברוב", hint: "בְּ-רֹב", alternates: ["ברב"] },
          { text: "קֶשֶׁב", plain: "קשב", hint: "קֶ-שֶׁב" },
          { text: ".", plain: ".", isPunct: true },
          { text: "אַחַר", plain: "אחר", hint: "אַ-חַר" },
          { text: "כָּךְ", plain: "כך", hint: "כָּךְ" },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "זִמֵּן", plain: "זימן", hint: "זִ-מֵּן", alternates: ["זמן"] },
          { text: "גַּם", plain: "גם", hint: "גַּם" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַשָּׁכֵן", plain: "השכן", hint: "הַ-שָּׁ-כֵן" },
          { text: "הַמּוּאֲשָׁם", plain: "המואשם", hint: "הַ-מּוּ-אֲ-שָׁם", isHard: true },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "⚖️",
        words: [
          { text: "\"הָאִכָּר", plain: "האיכר", hint: "הָ-אִ-כָּר" },
          { text: "מְשַׁקֵּר", plain: "משקר", hint: "מְ-שַׁ-קֵּר" },
          { text: "!\"", plain: "!", isPunct: true },
          { text: "צָעַק", plain: "צעק", hint: "צָ-עַק" },
          { text: "הַשָּׁכֵן", plain: "השכן", hint: "הַ-שָּׁ-כֵן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "\"הַפָּרָה", plain: "הפרה", hint: "הַ-פָּ-רָה" },
          { text: "שַׁיֶּכֶת", plain: "שייכת", hint: "שַׁ-יֶּ-כֶת", alternates: ["שיכת"] },
          { text: "לִי", plain: "לי", hint: "לִי" },
          { text: "מִיָּמִים", plain: "מימים", hint: "מִ-יָּ-מִים" },
          { text: "יָמִימָה", plain: "ימימה", hint: "יָ-מִי-מָה" },
          { text: "!\"", plain: "!", isPunct: true }
        ]
      },
      {
        illustration: "💭",
        words: [
          { text: "הַמֶּלֶךְ", plain: "המלך", hint: "הַ-מֶּ-לֶךְ" },
          { text: "הִתְבּוֹנֵן", plain: "התבונן", hint: "הִתְ-בּוֹ-נֵן" },
          { text: "בִּשְׁנֵיהֶם", plain: "בשניהם", hint: "בִּשְׁ-נֵי-הֶם" },
          { text: "וְאָמַר", plain: "ואמר", hint: "וְ-אָ-מַר" },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"הָבִיאוּ", plain: "הביאו", hint: "הָ-בִי-אוּ" },
          { text: "לִי", plain: "לי", hint: "לִי" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַפָּרָה", plain: "הפרה", hint: "הַ-פָּ-רָה" },
          { text: ".\"", plain: ".", isPunct: true },
          { text: "כֻּלָּם", plain: "כולם", hint: "כֻּ-לָּם", alternates: ["כלם"] },
          { text: "הִמְתִּינוּ", plain: "המתינו", hint: "הִמְ-תִּי-נוּ" },
          { text: "בְּצִפִּיָּה", plain: "בציפייה", hint: "בְּ-צִ-פִּ-יָּה", alternates: ["בצפיה"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🐄",
        words: [
          { text: "כְּשֶׁהַפָּרָה", plain: "כשהפרה", hint: "כְּ-שֶׁ-הַ-פָּ-רָה" },
          { text: "הִגִּיעָה", plain: "הגיעה", hint: "הִ-גִּי-עָה" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הַמֶּלֶךְ", plain: "המלך", hint: "הַ-מֶּ-לֶךְ" },
          { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
          { text: "לָאִכָּר", plain: "לאיכר", hint: "לָ-אִ-כָּר" },
          { text: ":", plain: ":", isPunct: true },
          { text: "\"קְרָא", plain: "קרא", hint: "קְ-רָא" },
          { text: "לָהּ", plain: "לה", hint: "לָהּ" },
          { text: "בַּשֵּׁם", plain: "בשם", hint: "בַּ-שֵּׁם" },
          { text: ".\"", plain: ".", isPunct: true },
          { text: "הָאִכָּר", plain: "האיכר", hint: "הָ-אִ-כָּר" },
          { text: "קָרָא", plain: "קרא", hint: "קָ-רָא" },
          { text: "\"דּוֹבָה", plain: "דובה", hint: "דּוֹ-בָה" },
          { text: "!\"", plain: "!", isPunct: true },
          { text: "וְהַפָּרָה", plain: "והפרה", hint: "וְ-הַ-פָּ-רָה" },
          { text: "רָצָה", plain: "רצה", hint: "רָ-צָה" },
          { text: "אֵלָיו", plain: "אליו", hint: "אֵ-לָיו" },
          { text: "מִיָּד", plain: "מיד", hint: "מִ-יָּד" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "👑",
        words: [
          { text: "הַשָּׁכֵן", plain: "השכן", hint: "הַ-שָּׁ-כֵן" },
          { text: "נִכְלַם", plain: "נכלם", hint: "נִכְ-לַם" },
          { text: "וְהִתְוַדָּה", plain: "והתוודה", hint: "וְ-הִתְ-וַ-דָּה", isHard: true, alternates: ["והתודה"] },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "הַגְּנֵבָה", plain: "הגנבה", hint: "הַ-גְּ-נֵ-בָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הַמֶּלֶךְ", plain: "המלך", hint: "הַ-מֶּ-לֶךְ" },
          { text: "פָּסַק", plain: "פסק", hint: "פָּ-סַק" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַדִּין", plain: "הדין", hint: "הַ-דִּין" },
          { text: "בְּצֶדֶק", plain: "בצדק", hint: "בְּ-צֶ-דֶק" },
          { text: ".", plain: ".", isPunct: true },
          { text: "מֵאָז", plain: "מאז", hint: "מֵ-אָז" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הוּא", plain: "הוא", hint: "הוּא" },
          { text: "נוֹדַע", plain: "נודע", hint: "נוֹ-דַע" },
          { text: "בְּחָכְמָתוֹ", plain: "בחוכמתו", hint: "בְּ-חָכְ-מָ-תוֹ", alternates: ["בחכמתו"] },
          { text: "בְּכָל", plain: "בכל", hint: "בְּ-כָל" },
          { text: "הָאָרֶץ", plain: "הארץ", hint: "הָ-אָ-רֶץ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  },

  {
    id: 'starship-mission',
    title: "מִשִּׁימָה בְּחֶלְקֵי הַחָלָל",
    subtitle: "סִפּוּר עָתִידָנִי עַל גְּבוּרָה וְיֶדַע",
    level: 5,
    category: 'space',
    interests: ['space', 'science', 'adventure'],
    emoji: "🚀",
    estimatedMinutes: 7,
    paragraphs: [
      {
        illustration: "🛸",
        words: [
          { text: "בִּשְׁנַת", plain: "בשנת", hint: "בִּשְׁ-נַת" },
          { text: "2150", plain: "2150", hint: "2150" },
          { text: ",", plain: ",", isPunct: true },
          { text: "אֲנִיַּת", plain: "אניית", hint: "אֲ-נִ-יַּת", alternates: ["אנית"] },
          { text: "הֶחָלָל", plain: "החלל", hint: "הֶ-חָ-לָל" },
          { text: "\"שַׁחְרִית\"", plain: "שחרית", hint: "שַׁחְ-רִית" },
          { text: "יָצְאָה", plain: "יצאה", hint: "יָצְ-אָה" },
          { text: "לְמַסַּע", plain: "למסע", hint: "לְ-מַ-סָּע" },
          { text: "הָרְפַתְקָנִי", plain: "הרפתקני", hint: "הָ-רְ-פַתְ-קָ-נִי", isHard: true },
          { text: "לְכוֹכַב", plain: "לכוכב", hint: "לְ-כוֹ-כַב" },
          { text: "מַאְדִים", plain: "מאדים", hint: "מַאְ-דִים" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "👩‍🚀",
        words: [
          { text: "הַקַּפְּטָנִית", plain: "הקפטנית", hint: "הַ-קַּ-פְּ-טָ-נִית", isHard: true },
          { text: "טַל", plain: "טל", hint: "טַל" },
          { text: "פִּקְּדָה", plain: "פיקדה", hint: "פִּ-קְּ-דָה", alternates: ["פקדה"] },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "צֶוֶת", plain: "צוות", hint: "צֶ-וֶת" },
          { text: "שֶׁל", plain: "של", hint: "שֶׁל" },
          { text: "חֲמִשָּׁה", plain: "חמישה", hint: "חֲ-מִ-שָּׁה", alternates: ["חמשה"] },
          { text: "מַדְעָנִים", plain: "מדענים", hint: "מַ-דְ-עָ-נִים" },
          { text: ".", plain: ".", isPunct: true },
          { text: "מַטָּרָתָם", plain: "מטרתם", hint: "מַ-טָּ-רָ-תָם" },
          { text: ":", plain: ":", isPunct: true },
          { text: "לְגַלּוֹת", plain: "לגלות", hint: "לְ-גַ-לּוֹת" },
          { text: "מַיִם", plain: "מים", hint: "מַ-יִם" },
          { text: "מִתַּחַת", plain: "מתחת", hint: "מִ-תַּ-חַת" },
          { text: "לִפְנֵי", plain: "לפני", hint: "לִ-פְ-נֵי" },
          { text: "הַשֶּׁטַח", plain: "השטח", hint: "הַ-שֶּׁ-טַח" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "⚠️",
        words: [
          { text: "בְּאֶמְצַע", plain: "באמצע", hint: "בְּ-אֶמְ-צַע" },
          { text: "הַמַּסָּע", plain: "המסע", hint: "הַ-מַּ-סָּע" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הִתְעוֹרְרָה", plain: "התעוררה", hint: "הִתְ-עוֹ-רְ-רָה" },
          { text: "תַּקָּלָה", plain: "תקלה", hint: "תַּ-קָּ-לָה" },
          { text: "בִּמְעַרְכוֹת", plain: "במערכות", hint: "בִּ-מְ-עַרְ-כוֹת" },
          { text: "הַחַמְצָן", plain: "החמצן", hint: "הַ-חַמְ-צָן" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָאוֹר", plain: "האור", hint: "הָ-אוֹר" },
          { text: "הָאָדֹם", plain: "האדום", hint: "הָ-אָ-דֹם", alternates: ["האדם"] },
          { text: "הִבְהֵב", plain: "הבהב", hint: "הִבְ-הֵב" },
          { text: "וְהָאַזְעָקָה", plain: "והאזעקה", hint: "וְ-הָ-אַזְ-עָ-קָה", isHard: true },
          { text: "צָרְחָה", plain: "צרחה", hint: "צָרְ-חָה" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🧠",
        words: [
          { text: "טַל", plain: "טל", hint: "טַל" },
          { text: "שָׁמְרָה", plain: "שמרה", hint: "שָׁמְ-רָה" },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "קֹר", plain: "קור", hint: "קֹר", alternates: ["קר"] },
          { text: "רוּחַ", plain: "רוח", hint: "רוּ-חַ" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הִיא", plain: "היא", hint: "הִיא" },
          { text: "חָשְׁבָה", plain: "חשבה", hint: "חָשְׁ-בָה" },
          { text: "בִּמְהִירוּת", plain: "במהירות", hint: "בִּ-מְ-הִי-רוּת" },
          { text: "וְהוֹרְתָה", plain: "והורתה", hint: "וְ-הוֹ-רְ-תָה" },
          { text: "לַצֶּוֶת", plain: "לצוות", hint: "לַ-צֶּ-וֶת" },
          { text: "לְהַעֲבִיר", plain: "להעביר", hint: "לְ-הַ-עֲ-בִיר" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הָאֶנֶרְגְיָה", plain: "האנרגיה", hint: "הָ-אֶ-נֶרְ-גְ-יָה", isHard: true },
          { text: "לְמַעֲרֶכֶת", plain: "למערכת", hint: "לְ-מַ-עֲ-רֶ-כֶת" },
          { text: "הַגִּבּוּי", plain: "הגיבוי", hint: "הַ-גִּ-בּוּי", alternates: ["הגבוי"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🔧",
        words: [
          { text: "תּוֹךְ", plain: "תוך", hint: "תּוֹךְ" },
          { text: "דַּקּוֹת", plain: "דקות", hint: "דַּ-קּוֹת" },
          { text: "סְפוּרוֹת", plain: "ספורות", hint: "סְ-פוּ-רוֹת" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הַמַּהַנְדֵּס", plain: "המהנדס", hint: "הַ-מַּ-הַנְ-דֵּס", isHard: true },
          { text: "תִּקֵּן", plain: "תיקן", hint: "תִּ-קֵּן", alternates: ["תקן"] },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַתַּקָּלָה", plain: "התקלה", hint: "הַ-תַּ-קָּ-לָה" },
          { text: ".", plain: ".", isPunct: true },
          { text: "הָאַזְעָקָה", plain: "האזעקה", hint: "הָ-אַזְ-עָ-קָה", isHard: true },
          { text: "נִדְמְכָה", plain: "נדמכה", hint: "נִדְ-מְ-כָה" },
          { text: "וְהָאוֹר", plain: "והאור", hint: "וְ-הָ-אוֹר" },
          { text: "חָזַר", plain: "חזר", hint: "חָ-זַר" },
          { text: "לְהִיוֹת", plain: "להיות", hint: "לְ-הִ-יוֹת" },
          { text: "יָרֹק", plain: "ירוק", hint: "יָ-רֹק", alternates: ["ירק"] },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🪐",
        words: [
          { text: "כְּשֶׁהֵם", plain: "כשהם", hint: "כְּ-שֶׁ-הֵם" },
          { text: "סוֹף", plain: "סוף", hint: "סוֹף" },
          { text: "סוֹף", plain: "סוף", hint: "סוֹף" },
          { text: "נָחֲתוּ", plain: "נחתו", hint: "נָ-חֲ-תוּ" },
          { text: "עַל", plain: "על", hint: "עַל" },
          { text: "פְּנֵי", plain: "פני", hint: "פְּ-נֵי" },
          { text: "מַאְדִים", plain: "מאדים", hint: "מַאְ-דִים" },
          { text: ",", plain: ",", isPunct: true },
          { text: "הַצֶּוֶת", plain: "הצוות", hint: "הַ-צֶּ-וֶת" },
          { text: "מָצָא", plain: "מצא", hint: "מָ-צָא" },
          { text: "מַיִם", plain: "מים", hint: "מַ-יִם" },
          { text: "בְּדִיּוּק", plain: "בדיוק", hint: "בְּ-דִ-יּוּק" },
          { text: "בַּמָּקוֹם", plain: "במקום", hint: "בַּ-מָּ-קוֹם" },
          { text: "שֶׁחָזוּ", plain: "שחזו", hint: "שֶׁ-חָ-זוּ" },
          { text: ".", plain: ".", isPunct: true }
        ]
      },
      {
        illustration: "🏅",
        words: [
          { text: "טַל", plain: "טל", hint: "טַל" },
          { text: "וְהַצֶּוֶת", plain: "והצוות", hint: "וְ-הַ-צֶּ-וֶת" },
          { text: "הָפְכוּ", plain: "הפכו", hint: "הָ-פְ-כוּ" },
          { text: "לְגִבּוֹרֵי", plain: "לגיבורי", hint: "לְ-גִ-בּוֹ-רֵי", alternates: ["לגבורי"] },
          { text: "כּוֹכָב", plain: "כוכב", hint: "כּוֹ-כָב" },
          { text: "לֶכֶת", plain: "לכת", hint: "לֶ-כֶת" },
          { text: ".", plain: ".", isPunct: true },
          { text: "תַּגְלִיתָם", plain: "תגליתם", hint: "תַּ-גְ-לִי-תָם", isHard: true },
          { text: "פָּתְחָה", plain: "פתחה", hint: "פָּתְ-חָה" },
          { text: "אֶת", plain: "את", hint: "אֶת" },
          { text: "הַדֶּרֶךְ", plain: "הדרך", hint: "הַ-דֶּ-רֶךְ" },
          { text: "לְהִתְיַשְּׁבוּת", plain: "להתיישבות", hint: "לְ-הִתְ-יַ-שְּׁ-בוּת", isHard: true, alternates: ["להתישבות"] },
          { text: "אֱנוֹשִׁית", plain: "אנושית", hint: "אֱ-נוֹ-שִׁית" },
          { text: "בֶּחָלָל", plain: "בחלל", hint: "בֶּ-חָ-לָל" },
          { text: ".", plain: ".", isPunct: true }
        ]
      }
    ]
  }

];
