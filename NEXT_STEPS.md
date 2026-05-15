# 📋 מה לעשות כשחוזרים — מדריך שלב-שלב

## מצב נוכחי

הפרויקט עבר שדרוג מ-MVP בודד לאפליקציה מלאה עם 16 סיפורים, מסכי הורה, ספריית סיפורים, דשבורד התקדמות, ומערכת מייל שבועי.

**הכל עובד עם mock auth (התחזות לאימות)** — הנתונים נשמרים ב-localStorage של הדפדפן. כל המסכים פעילים.

הצעד הבא: לחבר Supabase ו-Google Sign-In כדי שמשתמשים אמיתיים יוכלו להירשם.

---

## חלק 1: העלאת הקוד החדש ל-GitHub (~5 דקות)

### צעד 1: החלף את הקבצים במחשב

1. הורד את ה-ZIP החדש `readright-project-v2.zip`
2. פתח את התיקייה `D:\אבא\שיפור קריאה\readright-project\readright`
3. **גבה את הישנה:** שנה את שם התיקייה ל-`readright-old`
4. חלץ את ה-ZIP החדש למקום של הישנה

### צעד 2: התקן תלויות חדשות

ב-PowerShell, בתוך תיקיית הפרויקט:

```powershell
cd "D:\אבא\שיפור קריאה\readright-project\readright"
npm install
```

המתן ~30 שניות.

### צעד 3: בדוק מקומית

```powershell
npm run dev
```

פתח `http://localhost:5173`. אמור לעבוד:
- מסך נחיתה עם כפתורי "התחבר עם Google" + "התחבר במצב הדגמה"
- לחיצה על "מצב הדגמה" יוצרת משתמש דמה ומעבירה לעמוד יצירת פרופיל ילד
- שלבי onboarding: שם → גיל → רמה → אווטאר → תחומי עניין
- מסך הבית מציג את הילד שיצרת
- לחיצה על הילד → ספריית סיפורים (16 סיפורים)
- בחירת סיפור → מסך קריאה עם מיקרופון
- אחרי קריאה: הסשן נשמר
- חזרה הביתה → דשבורד → רואים סטטיסטיקות + תצוגה מקדימה של המייל השבועי

### צעד 4: עלה ל-GitHub

```powershell
git add .
git commit -m "v0.2 - full architecture with 16 stories"
git push
```

Vercel יזהה את ה-push אוטומטית ויפרוס תוך ~30 שניות. ראה ב-vercel.com.

**הצעד הזה בלבד נותן לך מוצר רציני עם 16 סיפורים שכל אחד יכול להריץ.**

---

## חלק 2: חיבור Supabase ל-Authentication אמיתי (~30 דקות)

### צעד 1: הגדרת Google OAuth ב-Google Cloud Console

1. גלוש ל-[console.cloud.google.com](https://console.cloud.google.com)
2. למעלה: בחר פרויקט קיים או צור חדש בשם `readright`
3. בתפריט השמאלי: **APIs & Services** → **OAuth consent screen**
   - User Type: **External**
   - App name: `ReadRight`
   - User support email: המייל שלך
   - Developer contact: המייל שלך
   - Save and Continue (דלג על Scopes)
   - הוסף את עצמך כ-Test User
4. **Credentials** → **+ Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `ReadRight Web`
   - **Authorized JavaScript origins:**
     - `http://localhost:5173`
     - `https://readright-mocha.vercel.app`
   - **Authorized redirect URIs:**
     - `https://gqswowdqfcbpfdpsgzoi.supabase.co/auth/v1/callback`
5. שמור את **Client ID** ו-**Client Secret** במקום בטוח

### צעד 2: הגדרת Google ב-Supabase

1. היכנס ל-[supabase.com/dashboard/project/gqswowdqfcbpfdpsgzoi](https://supabase.com/dashboard/project/gqswowdqfcbpfdpsgzoi)
2. בתפריט השמאלי: **Authentication** (אייקון של מנעול)
3. תת-תפריט: **Providers** (או **Sign In / Up**)
4. מצא את **Google** וסמן **Enable**
5. הדבק את ה-**Client ID** ו-**Client Secret** מ-Google Cloud
6. **Save**

### צעד 3: הגדר URL Configuration

עדיין באותו דף Authentication:
1. **URL Configuration**
2. **Site URL:** `https://readright-mocha.vercel.app`
3. **Redirect URLs:** הוסף את:
   - `https://readright-mocha.vercel.app/**`
   - `http://localhost:5173/**`

### צעד 4: שלוף את ה-API keys של Supabase

1. בפרויקט Supabase: **Project Settings** (אייקון גלגל בתחתית התפריט השמאלי)
2. **API Keys**
3. שמור 2 ערכים:
   - **Project URL:** `https://gqswowdqfcbpfdpsgzoi.supabase.co`
   - **anon / public key** (מתחיל ב-`eyJ...`)

### צעד 5: צור קובץ .env בפרויקט

ב-PowerShell, בתיקיית הפרויקט:

```powershell
notepad .env
```

הדבק את התוכן (החלף בערכים שלך):

```
VITE_SUPABASE_URL=https://gqswowdqfcbpfdpsgzoi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ_השאר_מה_שהעתקת
```

שמור וסגור.

**חשוב:** הקובץ `.env` כבר ב-.gitignore — לא יעלה ל-GitHub. זה נכון, ה-keys הללו צריכים להישאר פרטיים.

### צעד 6: הוסף את משתני הסביבה ב-Vercel

הקובץ `.env` עובד מקומית, אבל Vercel לא יראה אותו. צריך להוסיף ידנית:

1. [vercel.com/dashboard](https://vercel.com/dashboard) → readright → **Settings** → **Environment Variables**
2. הוסף שני משתנים:
   - `VITE_SUPABASE_URL` = `https://gqswowdqfcbpfdpsgzoi.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = ה-anon key
3. עבור כל אחד: סמן Production, Preview, Development
4. **Save**

### צעד 7: התקן את ספריית Supabase

ב-PowerShell:

```powershell
npm install @supabase/supabase-js
```

### צעד 8: החלף את AuthContext

ב-PowerShell, בתיקיית הפרויקט:

```powershell
# גיבוי של המוק
Rename-Item src/context/AuthContext.jsx src/context/AuthContext.mock.jsx

# הפעלת הגרסה האמיתית
Rename-Item src/context/AuthContext.supabase.jsx src/context/AuthContext.jsx
```

### צעד 9: זרע (Seed) את הסיפורים ל-Supabase

הסיפורים נמצאים ב-`src/data/stories.js` בקוד הלקוח. אבל אם תרצה שיהיו ב-DB:

1. ב-Supabase → SQL Editor → New Query
2. תזדקק לסקריפט המרה. בינתיים, הסיפורים פשוט יישארו בקוד — זה עובד מצוין ולא חובה ב-DB.

(נדבר על זה כשתחזור — תלוי אם נרצה שמורים יוכלו להוסיף סיפורים דרך האפליקציה).

### צעד 10: בדוק מקומית

```powershell
npm run dev
```

כעת:
- לחיצה על "התחבר עם Google" תפתח חלון Google אמיתי
- אישור → חזרה לאפליקציה כמשתמש מחובר
- כל הנתונים (ילדים, קריאות) נשמרים ב-Supabase האמיתי

### צעד 11: עלה לפרודקשן

```powershell
git add .
git commit -m "v0.3 - Real Supabase auth + Google Sign-In"
git push
```

Vercel יפרוס. **תוצאה:** אתר חי באינטרנט שכל אחד יכול להירשם אליו עם Google.

---

## חלק 3: שליחת המייל השבועי האמיתי (אופציונלי, ~30 דקות)

המייל השבועי מוצג כתצוגה מקדימה כרגע. כדי לשלוח אותו באמת:

### אפשרות א': Resend (מומלץ)

1. הירשם ל-[resend.com](https://resend.com) (3000 מיילים בחודש בחינם)
2. צור API key
3. צור Edge Function ב-Supabase שרצה כל יום ראשון ב-08:00
4. הפונקציה שולפת את כל המשתמשים, מחשבת מטריקות שבועיות, ושולחת מייל

זה דורש קוד נוסף שאוכל להכין כשתחזור.

### אפשרות ב': דחה זאת

המייל השבועי לא קריטי ל-MVP. ה-UI כבר מוכן וההורה רואה מה הוא יקבל. אפשר להוסיף שליחה אמיתית כשיהיו 50+ משתמשים.

---

## סדר עדיפויות מומלץ

1. **קודם כל:** עשה את חלק 1 (העלה לגיט). זה נותן לך אפליקציה מלאה עם 16 סיפורים — תוך 5 דקות.
2. **אחר כך:** עשה את חלק 2 (Supabase + Google). זה הופך אותה למוצר אמיתי. ~30 דקות.
3. **רק אחרי שיש משתמשים:** חלק 3 (מייל אמיתי).

---

## אם משהו לא עובד

שלח לי screenshot של ה-PowerShell + תיאור קצר של מה ניסית. אכוון אותך מדויק.
