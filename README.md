# ReadRight 📚

אב-טיפוס לאפליקציית קריאה חכמה לילדים, מבוססת על Web Speech API לזיהוי דיבור בעברית בזמן אמת.

## הפעלה מקומית

```bash
npm install
npm run dev
```

האפליקציה תרוץ על http://localhost:5173

## בנייה לפרודקשן

```bash
npm run build
npm run preview
```

## דרישות דפדפן

זיהוי הדיבור (Web Speech API) דורש:
- **Chrome** (Desktop / Android) ✅
- **Edge** (Desktop / Android) ✅
- **Safari** ⚠️ תמיכה מוגבלת בעברית
- **Firefox** ❌ לא תומך

חייבים לרוץ על **HTTPS** (או localhost) כדי שהמיקרופון יעבוד.

## דיפלוי

מומלץ Vercel, Netlify, או GitHub Pages — כולם מספקים HTTPS אוטומטית.

### דיפלוי מהיר ל-Vercel:
1. דחוף את הקוד ל-GitHub
2. היכנס ל-vercel.com → New Project → Import Repository
3. Vercel יזהה אוטומטית שזה Vite ויפרוס

## טכנולוגיות

- **React 18** + **Vite** — frontend framework
- **Tailwind CSS** — styling
- **Web Speech API** — זיהוי דיבור בעברית
- **Web Audio API** — ניטור עוצמת מיקרופון בזמן אמת
- **Lucide Icons** — אייקונים

## מבנה הפרויקט

```
readright/
├── src/
│   ├── App.jsx       # כל הלוגיקה והממשק
│   ├── main.jsx      # entry point
│   └── index.css     # Tailwind imports
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## הרחבות עתידיות

המוצר האמיתי ידרוש:
- Backend עם Whisper מותאם לעברית של ילדים
- מאגר סיפורים דינמי (Claude API)
- שמירת התקדמות ב-database
- דשבורד הורה
- COPPA / GDPR-K compliance
