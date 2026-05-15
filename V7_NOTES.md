# ReadRight v7 — מה חדש + הוראות הפעלה

## פיצ'רים חדשים בגרסה הזו

### 1. שיפור משפטי משמעותי (Privacy + Terms v2.0)
- מדיניות פרטיות הוארכה מ-9 ל-14 סעיפים
- תנאי שימוש הוארכו מ-10 ל-17 סעיפים
- כיסוי מפורט של: COPPA, GDPR-K, חוק הגנת הפרטיות הישראלי
- רשימה מפורטת של כל הצדדים השלישיים
- תקופות שמירת מידע מפורטות
- מדיניות החזרים מפורשת

### 2. רצף ימים ומדליות (Streak + Badges)
- מודול חדש: `src/lib/achievements.js`
- 14 מדליות לפי קטגוריות: מילסטונים, רצף, ביצועים, התמדה
- רצף ימים מחושב אוטומטית מהיסטוריית הקריאות
- מוצג בדשבורד בכל ילד

### 3. הורדת הקלטה לשיתוף עם קלינאית
- כפתור הורדה ליד כל הקלטה ב-RecordingsPanel
- שם הקובץ הופך לידידותי: `readright_שם-סיפור_2025-05-12.webm`
- אפשר לשלוח ישירות בוואטסאפ או אימייל

### 4. דף עזרה + FAQ (Help.jsx)
- 6 קטגוריות, 30+ שאלות נפוצות
- חיפוש פנימי
- נגיש גם בלי הרשמה

### 5. PostHog Analytics
- מודול חדש: `src/lib/analytics.js`
- מעקב אחר eventים מרכזיים (signin, reading_completed, upgrade, paywall_hit)
- **לא פעיל עד שתוסיף את ה-KEY** — ראה הוראות הפעלה למטה

### 6. Sentry Error Tracking
- מודול חדש: `src/lib/errorTracking.js`
- ErrorBoundary בכל האפליקציה — אם משהו נופל, המשתמש רואה הודעה ידידותית
- **לא פעיל עד שתוסיף את ה-DSN** — ראה הוראות הפעלה למטה

---

## הפעלת PostHog (Analytics)

### למה
לדעת מה משתמשים עושים. בלי זה, אתה עיוור בפיילוט.

### צעדים (5 דקות)
1. גש ל-https://posthog.com והירשם (חינמי עד 1M events/חודש)
2. צור פרויקט חדש בשם "ReadRight"
3. עבור ל-Project Settings → API Keys → העתק את **Project API Key**
4. בפרויקט Vercel שלך → Settings → Environment Variables → הוסף:
   ```
   VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxx
   VITE_POSTHOG_HOST=https://app.posthog.com   (או https://eu.posthog.com אם אתה באירופה)
   ```
5. Trigger redeploy ב-Vercel

מעכשיו, כל event יישלח אוטומטית ל-PostHog. תוכל לראות:
- כמה משתמשים נרשמו
- כמה סיפורים נקראים בכל יום
- כמה אנשים פגעו ב-paywall
- כמה שדרגו ל-Premium

---

## הפעלת Sentry (Error Tracking)

### למה
אם משהו נופל אצל משתמש, אתה רוצה לדעת לפני שהוא יכתוב לך — או לפני שהוא ינטוש.

### צעדים (5 דקות)
1. גש ל-https://sentry.io והירשם (חינמי עד 5K errors/חודש)
2. צור פרויקט חדש → בחר **React**
3. העתק את ה-**DSN** שיופיע (מתחיל ב-`https://xxx@xxx.ingest.sentry.io/xxx`)
4. בפרויקט Vercel שלך → Settings → Environment Variables → הוסף:
   ```
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```
5. Trigger redeploy

מעכשיו, כל שגיאה JavaScript לא צפויה תופיע ב-Sentry עם stack trace מלא.

---

## דברים שעוד לא בנינו (לתגובה הבאה)

לא הספקתי לבנות:
- **ספר הדרכה אינטראקטיבי** (Onboarding tutorial) - 3 שלבים בפעם הראשונה
- **הקראת ההורה** (Parent recording mode)
- **חגיגת מדליה חדשה** - אנימציה חמה כשמשיגים מדליה
- **דף לאנדינג ל-pricing** (mini upsell ל-paywall)

תגיד "המשך" בתגובה הבאה ואני אבנה גם אותם.

---

## גודל הbundle

- v6: 385KB / 110KB gzip
- v7: 639KB / 193KB gzip (+254KB)

תוספת הגודל נובעת מ-PostHog (~80KB) ו-Sentry (~170KB). זה גודל סביר עבור אפליקציה מתפעלת,
אבל לפני go-live בקנה מידה — שווה לעבור ל-code splitting כדי שמשתמשים שלא משתמשים ב-Help/Pricing
לא יורידו אותם בטעינה ראשונה.

---

## הערות אבטחה

- **PostHog**: מוגדר עם autocapture מצומצם, ללא session replay (פרטיות ילדים). שמות ילדים לעולם לא נשלחים.
- **Sentry**: מוגדר עם `sendDefaultPii: false` + beforeSend שמנקה PII.
- **שניהם**: מכבדים `Do Not Track` של הדפדפן ולא פועלים בלי key מפורש.
