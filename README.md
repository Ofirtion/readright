# ReadRight 📚

אפליקציית AI לשיפור קריאה לילדים בעברית, עם זיהוי דיבור בזמן אמת.

🔴 **גרסה 0.3** — אפליקציה מלאה עם פרופילי ילדים, ספריית סיפורים, **ייבוא תוכן מותאם** (טקסט/URL/קובץ עם OCR), דשבורד התקדמות, ומערכת מייל שבועי.

## הפעלה מהירה

```bash
npm install
npm run dev
```

האפליקציה תרוץ על http://localhost:5173

## מבנה הפרויקט

```
readright/
├── src/
│   ├── App.jsx                    # ראוטר ראשי - מנהל את הניווט בין מסכים
│   ├── main.jsx                   # entry point
│   ├── index.css                  # Tailwind + RTL globals
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth פעיל (mock עם localStorage)
│   │   └── AuthContext.supabase.jsx  # גרסת Supabase מוכנה להחלפה
│   │
│   ├── pages/
│   │   ├── Landing.jsx            # דף נחיתה + Google Sign-In
│   │   ├── ChildOnboarding.jsx    # יצירת פרופיל ילד (5 שלבים)
│   │   ├── Home.jsx               # בית להורה - רשימת ילדים
│   │   ├── StoryLibrary.jsx       # ספריית 16 סיפורים + סיפורים מותאמים
│   │   ├── Reading.jsx            # מסך קריאה עם מיקרופון בזמן אמת
│   │   ├── Dashboard.jsx          # דשבורד התקדמות לילד
│   │   └── ImportContent.jsx      # ייבוא תוכן: טקסט/URL/קובץ עם OCR
│   │
│   ├── components/
│   │   ├── Layout.jsx             # כותרת + ניווט עליון משותפים
│   │   └── WeeklyEmailSettings.jsx # הגדרות מייל שבועי + תצוגה מקדימה
│   │
│   ├── data/
│   │   ├── stories.js             # 5 סיפורים מקוריים
│   │   └── stories2.js            # 11 סיפורים חדשים
│   │
│   └── lib/
│       ├── theme.js               # design tokens (צבעים, פונטים, רמות)
│       └── contentImport.js       # pipeline ייבוא: טקסט / URL / קובץ + OCR + ניקוד
│
├── public/
│   └── favicon.svg
├── index.html                     # RTL + Google Fonts
├── NEXT_STEPS.md                  # מדריך חיבור Supabase מלא
├── package.json
└── vite.config.js
```

## תכונות

### ✅ מה עובד עכשיו (mock auth)
- הרשמה / כניסה (mock)
- יצירת פרופילי ילדים מרובים
- ספריית 16 סיפורים בעברית עם ניקוד מלא
- **ייבוא תוכן מותאם:**
  - הדבקת טקסט גולמי
  - קישור לדף אינטרנט (חילוץ אוטומטי)
  - העלאת תמונה (OCR לעברית ב-Tesseract)
  - העלאת PDF (חילוץ + OCR לקבצים סרוקים)
  - ניקוד אוטומטי באמצעות Dicta Nakdan API
- 5 רמות קריאה (כיתה א׳ עד כיתה ז׳+)
- 12 תחומי עניין למיון אוטומטי
- זיהוי דיבור בזמן אמת (Web Speech API)
- מעקב מילה-במילה עם רמזים
- שמירת קריאות + מטריקות (WCPM, דיוק, טעויות)
- דשבורד עם גרף התקדמות
- תובנות AI אוטומטיות
- תצוגה מקדימה של מייל שבועי

### 🔌 מה דורש חיבור (ראה NEXT_STEPS.md)
- Google OAuth אמיתי
- שמירת נתונים ב-Supabase במקום localStorage
- שליחת מייל שבועי אמיתי (Resend / SendGrid)
- ייתכן ויידרש backend proxy לעקיפת CORS של Dicta בפרודקשן

## הסיפורים

16 סיפורים בעברית עם ניקוד מלא, מסודרים לפי רמה:

**רמה 1** (כיתה א׳ / מתחילים):
- התפוח האדום
- הכלבלב הקטן
- הפרפר והפרח
- יום גשום
- עוגת יום הולדת

**רמה 2** (כיתה ב׳):
- דנה והחתול מהחלל
- הביצה של הדינוזאור
- התעלומה בחוף הים
- החלום של איתי (כדורגל)

**רמה 3** (כיתה ג׳-ד׳):
- תעלומת היער הקסום
- הממציאה הקטנה
- האריה והעכבר

**רמה 4** (כיתה ה׳-ו׳):
- מכונת הזמן של סבא
- מסע במדבר

**רמה 5** (כיתה ז׳+):
- המלך החכם והאיכר
- משימה בחלקי החלל

## דרישות דפדפן

זיהוי הדיבור (Web Speech API) דורש:
- **Chrome** (Desktop / Android) ✅
- **Edge** (Desktop / Android) ✅
- **Safari** ⚠️ תמיכה מוגבלת בעברית
- **Firefox** ❌ לא תומך

חייבים HTTPS (או localhost) כדי שהמיקרופון יעבוד.

## דיפלוי

מומלץ Vercel — מספק HTTPS אוטומטית.

```bash
npm run build    # יוצר תיקיית dist/
npm run preview  # בודק את הגרסה הסופית מקומית
```

## טכנולוגיות

- **React 18** + **Vite** — frontend
- **Tailwind CSS** — styling
- **Web Speech API** — זיהוי דיבור עברית
- **Web Audio API** — ניטור מיקרופון
- **Lucide Icons** — אייקונים
- **localStorage** — אחסון זמני
- **Supabase** (בעתיד) — database + auth

## הצעדים הבאים

ראה [`NEXT_STEPS.md`](./NEXT_STEPS.md) למדריך מפורט על:
1. העלאה ל-GitHub
2. חיבור Supabase + Google OAuth
3. שליחת מייל שבועי אמיתי
