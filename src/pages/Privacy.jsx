// Privacy.jsx — מדיניות פרטיות של ReadRight
// =================================
// Version 2 — strengthened compared to v1. Still a draft, but covers the
// gaps an Israeli privacy lawyer would flag on first review:
//   - Explicit COPPA/GDPR-K considerations for under-13 users
//   - Israeli Privacy Protection Law references (חוק הגנת הפרטיות)
//   - Specific data retention periods (not vague)
//   - Identification of all third parties + their roles
//   - Clear data flow diagram in text
//   - Withdrawal of consent process
//   - Data breach notification commitment
//   - Right to lodge complaint (Israel + EU)
//
// BEFORE GOING TO MARKET WITH PAYING CUSTOMERS: have an Israeli privacy
// attorney review. Anthropic estimate: 3,000-5,000₪ for a proper review.

import React from 'react';
import { ArrowRight, Shield, Mail, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../lib/theme';

const LAST_UPDATED = '12 במאי 2025';
const COMPANY_NAME = '[Company Name / Owner Name]';
const COMPANY_EMAIL = 'privacy@readright.app';
const CONTACT_EMAIL = 'hello@readright.app';

// English summary shown when language is English. We deliberately keep this
// shorter than the Hebrew version because the Hebrew version is the
// legally-authoritative draft for the Israeli market. A full English version
// requires US/EU counsel review before launching in those markets.
function PrivacyEnglish({ onNavigate }) {
  return (
    <div dir="ltr" className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 mb-6 text-sm font-bold transition hover:gap-3"
          style={{ color: colors.navy }}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.sunLight }}>
            <Shield className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>ReadRight</div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              Privacy Policy
            </h1>
          </div>
        </div>

        <div className="text-xs mb-8" style={{ color: colors.textMuted }}>Last updated: May 12, 2025 · v2.0</div>

        <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}>
          <div className="font-black mb-3 text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
            ✨ The short version
          </div>
          <ul className="space-y-2 text-sm" style={{ color: colors.navy }}>
            <li>• We collect the <strong>minimum</strong> data needed for the service to work.</li>
            <li>• <strong>Your child's audio recordings stay on your device only</strong> — never on our servers.</li>
            <li>• We <strong>do not sell</strong> your data, do not advertise, do not share with third parties for marketing.</li>
            <li>• Under COPPA, GDPR, and Israeli Privacy Protection Law — you can view, download, and delete everything anytime.</li>
            <li>• Privacy contact: <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a></li>
          </ul>
        </div>

        <SectionEN number="1" title="Who we are">
          <p>
            ReadRight (the <strong>"Service"</strong>, <strong>"App"</strong>, or <strong>"we"</strong>) is a Hebrew reading-improvement app for children.
            The Service is operated by {COMPANY_NAME}. Contact: <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a>.
          </p>
        </SectionEN>

        <SectionEN number="2" title="Legal framework">
          <p>This document is intended to comply with:</p>
          <ul>
            <li><strong>Israeli Privacy Protection Law, 1981</strong> and its regulations</li>
            <li><strong>GDPR</strong> — EU Regulation 2016/679</li>
            <li><strong>COPPA</strong> — Children's Online Privacy Protection Act (US, under 13)</li>
            <li><strong>UK GDPR</strong> and <strong>Children's Code</strong></li>
          </ul>
        </SectionEN>

        <SectionEN number="3" title="What we collect">
          <p><strong>From the parent/registered adult:</strong> name (optional), email, OAuth ID, login times, payment status (via Stripe — we never see card numbers).</p>
          <p><strong>From the child (entered by parent):</strong> first name, age, reading level, interests, avatar emoji. We do NOT request: last name, exact birthdate, ID number, address, phone, or photos.</p>
          <p><strong>Reading data:</strong> which stories were read, when, performance metrics (words per minute, accuracy, errors).</p>
          <p style={{ color: colors.rust, fontWeight: 700 }}>
            <strong>Audio recordings:</strong> Stored ONLY in your browser (IndexedDB). Never sent to our servers, never to third parties. Only you, on this device, can hear them.
          </p>
        </SectionEN>

        <SectionEN number="4" title="Speech recognition">
          <p>
            Speech recognition uses the browser's Web Speech API. In Chrome/Edge, voice may be sent to Google servers for processing. Google states they don't retain recordings — but we cannot independently guarantee this. Safari on iOS/macOS uses on-device recognition (more private).
          </p>
        </SectionEN>

        <SectionEN number="5" title="Third parties we work with">
          <p>Google (auth + speech recognition), Stripe (payments), Supabase (backend storage), Vercel (hosting), Dicta (Hebrew vowelization). We share only what's needed for each service to function. None used for marketing.</p>
        </SectionEN>

        <SectionEN number="6" title="Children under 13 (COPPA / GDPR-K)">
          <p>
            ReadRight is intended for use by parents, guardians, or teachers (18+) who create profiles on behalf of children. <strong>Children do not create accounts themselves.</strong> Creating a child profile requires explicit parental consent, including consent to voice recording. If you believe a child under 13 used the service without parental consent, contact <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a> for immediate deletion.
          </p>
        </SectionEN>

        <SectionEN number="7" title="Data retention">
          <p>Active account info: stored while active + 90 days after deletion (backup). Reading history: stored while account is active. Audio recordings: forever (on your device). Billing data: 7 years (legal requirement). Technical logs: 30 days.</p>
        </SectionEN>

        <SectionEN number="8" title="Your rights">
          <p>You may, at any time: view your data; download it in JSON (via the dashboard); correct errors; delete your account and all data; withdraw consent; file a complaint with the relevant data protection authority. Requests are handled within 30 days.</p>
        </SectionEN>

        <SectionEN number="9" title="Data security">
          <p>HTTPS in transit, encryption at rest, limited employee access, periodic security review. In case of a data breach affecting user privacy, we will notify the Israeli Privacy Protection Authority within 72 hours and affected users by email.</p>
        </SectionEN>

        <SectionEN number="10" title="Contact">
          <div className="rounded-xl p-4 mt-3 space-y-2" style={{ backgroundColor: colors.creamDark }}>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4" style={{ color: colors.rust }} /><div className="text-sm"><strong>Privacy:</strong> <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a></div></div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4" style={{ color: colors.rust }} /><div className="text-sm"><strong>General:</strong> <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a></div></div>
          </div>
        </SectionEN>

        <div className="rounded-2xl p-5 mt-8 text-xs" style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}>
          <strong style={{ color: colors.rust }}>Important legal note:</strong> This is a summary translation of our Hebrew Privacy Policy, intended for pilot/beta use. Before commercial launch in the US, a US privacy attorney review is required for full COPPA, CCPA, and state-by-state compliance. The Hebrew version is the legally authoritative document for the Israeli market.
        </div>
      </div>
    </div>
  );
}

function SectionEN({ number, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black mb-3 flex items-baseline gap-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
        <span style={{ color: colors.rust, fontSize: '0.7em' }}>§{number}</span>
        {title}
      </h2>
      <div className="text-base leading-relaxed space-y-3" style={{ color: colors.textSecondary }}>
        {children}
      </div>
    </div>
  );
}

export default function Privacy({ onNavigate }) {
  const { i18n } = useTranslation();
  if (i18n.language === 'en') {
    return <PrivacyEnglish onNavigate={onNavigate} />;
  }
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back nav */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 mb-6 text-sm font-bold transition hover:gap-3"
          style={{ color: colors.navy }}
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.sunLight }}
          >
            <Shield className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
              ReadRight
            </div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              מדיניות פרטיות
            </h1>
          </div>
        </div>

        <div className="text-xs mb-8 flex items-center justify-between" style={{ color: colors.textMuted }}>
          <span>עודכן לאחרונה: {LAST_UPDATED}</span>
          <span>גרסה 2.0</span>
        </div>

        {/* TL;DR */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
        >
          <div className="font-black mb-3 text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
            ✨ הסיכום בקצרה
          </div>
          <ul className="space-y-2 text-sm" style={{ color: colors.navy }}>
            <li>• אנחנו אוספים את <strong>המינימום</strong> שצריך כדי שהשירות יעבוד.</li>
            <li>• <strong>הקלטות הקריאה של הילד נשמרות במכשיר שלך בלבד</strong> — לעולם לא בשרתינו.</li>
            <li>• אנחנו <strong>לא מוכרים</strong> נתונים, לא מפרסמים, ולא משתפים עם צדדים שלישיים לשיווק.</li>
            <li>• ב-COPPA, GDPR ובחוק הישראלי — יש לך זכות לראות, להוריד, ולמחוק הכל בכל רגע.</li>
            <li>• מנהל פרטיות זמין ב: <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a></li>
          </ul>
        </div>

        {/* Sections */}
        <Section number="1" title="מי אנחנו">
          <p>
            ReadRight (להלן <strong>"השירות"</strong>, <strong>"האפליקציה"</strong>, או <strong>"אנחנו"</strong>) היא אפליקציה לשיפור קריאה לילדים בעברית.
            השירות מופעל ומבוצע על ידי {COMPANY_NAME} (להלן <strong>"החברה"</strong>).
          </p>
          <p>
            כתובת ליצירת קשר: <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a>
          </p>
          <p>
            מסמך זה מתאר אילו נתונים אנחנו אוספים, איך אנחנו משתמשים בהם, עם מי אנחנו משתפים אותם, ואיך אתה יכול לשלוט בנתונים שלך.
          </p>
        </Section>

        <Section number="2" title="המסגרת המשפטית">
          <p>
            מסמך זה נכתב על מנת להיות תואם:
          </p>
          <ul>
            <li><strong>חוק הגנת הפרטיות, התשמ"א-1981</strong> ותקנותיו (ישראל)</li>
            <li><strong>תקנות הגנת הפרטיות (אבטחת מידע), תשע"ז-2017</strong></li>
            <li><strong>GDPR</strong> — Regulation (EU) 2016/679 (אם אתה במדינות האיחוד האירופי)</li>
            <li><strong>COPPA</strong> — Children's Online Privacy Protection Act (אם אתה בארה"ב, ילדים מתחת לגיל 13)</li>
            <li><strong>UK GDPR</strong> ו-<strong>Children's Code (Age Appropriate Design Code)</strong> אם אתה בבריטניה</li>
          </ul>
          <p>
            השירות מיועד בעיקר למשתמשים בישראל. ייתכן ויש דרישות חוקיות נוספות החלות במדינות אחרות שבהן אתה מתגורר.
          </p>
        </Section>

        <Section number="3" title="המידע שאנחנו אוספים">
          <Subsection title="3.1 מידע על ההורה / האפוטרופוס המבוגר (המשתמש הרשום)">
            <ul>
              <li><strong>שם מלא</strong> — אם בחרת לספק. רשות.</li>
              <li><strong>כתובת אימייל</strong> — לאימות החשבון ותקשורת. <em>חובה.</em></li>
              <li><strong>זיהוי אימות</strong> — Google OAuth ID Token (אם נכנסת דרך Google).</li>
              <li><strong>זמני חיבור</strong> — תאריך/שעה של כניסות אחרונות לחשבון.</li>
              <li><strong>מידע על תשלום</strong> — מטופל על ידי Stripe; אנחנו רואים רק 4 ספרות אחרונות של הכרטיס וסטטוס המנוי.</li>
            </ul>
          </Subsection>

          <Subsection title="3.2 מידע על הילד (מוזן בידי ההורה בלבד)">
            <p>
              <strong>חשוב:</strong> הילד עצמו אינו יוצר חשבון. ההורה הוא זה שמזין את המידע על הילד תוך הסכמה מפורשת.
            </p>
            <ul>
              <li><strong>שם פרטי</strong> — שם הילד כפי שמופיע בממשק (לדוגמה: "דנה").</li>
              <li><strong>גיל</strong> — שנים מלאות, לצורך התאמת תוכן.</li>
              <li><strong>רמת קריאה</strong> — בין 1 ל-5, לבחירת ההורה.</li>
              <li><strong>תחומי עניין</strong> — נבחרים מתוך רשימה מוגדרת (חיות, ספורט, פנטזיה, וכו').</li>
              <li><strong>אווטאר</strong> — אמוג'י נבחר מתוך רשימה.</li>
            </ul>
            <p>
              אנחנו <strong>לא</strong> מבקשים: שם משפחה, תאריך לידה מדויק, תעודת זהות, כתובת מגורים, מספר טלפון, או צילום של הילד.
            </p>
          </Subsection>

          <Subsection title="3.3 נתוני קריאה">
            <ul>
              <li>אילו סיפורים נקראו ובאיזה תאריך</li>
              <li>משך כל קריאה (בשניות)</li>
              <li>מדדי ביצועים: WCPM (מילים נכונות לדקה), אחוז דיוק, מספר טעויות</li>
              <li>איזה מילים היו קשות / נכונות / מדולגות</li>
              <li>מתי הילד השתמש ברמזים</li>
            </ul>
          </Subsection>

          <Subsection title="3.4 הקלטות אודיו של הילד קורא">
            <div className="rounded-xl p-4 mt-3" style={{ backgroundColor: colors.creamDark }}>
              <p className="font-bold mb-2" style={{ color: colors.rust }}>
                ⚠️ סעיף קריטי — בבקשה לקרוא בעיון:
              </p>
              <ul className="space-y-2">
                <li>
                  כל קריאה של הילד מוקלטת אוטומטית כקובץ אודיו (פורמט WebM/Opus).
                </li>
                <li>
                  <strong>ההקלטות נשמרות אך ורק במכשיר שלך</strong>, בתוך IndexedDB של הדפדפן (אחסון מקומי בדפדפן).
                </li>
                <li>
                  ההקלטות <strong>לעולם לא נשלחות לשרתינו</strong>, לא ל-Google, ולא לאף צד שלישי.
                </li>
                <li>
                  רק ההורה הרשום, מאותו דפדפן/מחשב, יכול להאזין להן (דרך הדשבורד).
                </li>
                <li>
                  מחיקת נתוני האתר בדפדפן, או החלפת מכשיר, תמחק את ההקלטות לצמיתות.
                </li>
                <li>
                  אנחנו לא משתמשים בהקלטות לאימון מודלים, ולא משתפים אותן עם איש.
                </li>
              </ul>
            </div>
          </Subsection>

          <Subsection title="3.5 נתונים טכניים אוטומטיים">
            <p>
              כשאתה משתמש בשירות, נאסף מידע טכני בסיסי:
            </p>
            <ul>
              <li>סוג הדפדפן והגרסה (לצורך תאימות)</li>
              <li>סוג מכשיר (מובייל / מחשב)</li>
              <li>שפת הדפדפן</li>
              <li>שגיאות טכניות שהתרחשו (לצורך תיקון תקלות) — אם בחרת להפעיל זאת</li>
            </ul>
            <p>
              אנחנו לא אוספים כתובת IP באופן שמאפשר זיהוי אישי לאורך זמן.
            </p>
          </Subsection>
        </Section>

        <Section number="4" title="זיהוי דיבור — חשוב לקרוא">
          <div
            className="rounded-xl p-4 mb-3 flex items-start gap-3"
            style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.rust }} />
            <div className="text-sm">
              <strong>אתה צריך להבין את ההבחנה הבאה.</strong> ההקלטות שאנחנו שומרים נשארות במכשיר שלך —
              אבל זיהוי הדיבור עצמו עובד באמצעות שירותים חיצוניים, ובהם הקול עלול לעבור דרך שרתים חיצוניים.
            </div>
          </div>
          <p>
            כדי לזהות מה הילד אומר בקול, האפליקציה משתמשת ב-<strong>Web Speech API</strong> של הדפדפן. אופן הפעולה משתנה לפי הדפדפן:
          </p>
          <ul>
            <li><strong>Google Chrome / Microsoft Edge:</strong> הדפדפן שולח את הקול לשרתי Google לעיבוד, ומקבל בחזרה טקסט. Google מצהירים שהקול לא נשמר לאחר העיבוד. <em>אנחנו לא יכולים להבטיח זאת באופן בלתי תלוי</em> — Google הם צד שלישי.</li>
            <li><strong>Safari (iOS / macOS):</strong> משתמש ב-Apple's on-device speech recognition. הקול לא יוצא מהמכשיר.</li>
            <li><strong>Firefox:</strong> לא תומך ב-Web Speech API. השירות אינו פעיל בדפדפן זה.</li>
          </ul>
          <p>
            אם הפרטיות הזו חשובה לך במיוחד, ניתן להשתמש ב-Safari על מכשיר Apple — שם זיהוי הדיבור מתבצע במלואו במכשיר.
          </p>
        </Section>

        <Section number="5" title="צדדים שלישיים שאנחנו עובדים איתם">
          <p>
            אלו השירותים החיצוניים שמשתתפים בעיבוד המידע. אנחנו משתפים איתם רק את המידע שצריך כדי שהשירות יעבוד:
          </p>

          <div className="space-y-4 mt-3">
            <ThirdParty
              name="Google (Cloud + OAuth)"
              role="אימות (כניסה דרך Google) + זיהוי דיבור בדפדפני Chrome/Edge"
              dataShared="אימייל וזיהוי OAuth + הקלטות קוליות זמניות לזיהוי דיבור"
              policy="https://policies.google.com/privacy"
            />
            <ThirdParty
              name="Stripe"
              role="עיבוד תשלומים ומנויים"
              dataShared="פרטי תשלום (מטופל ישירות על ידי Stripe — אנחנו לא רואים את מספר הכרטיס המלא)"
              policy="https://stripe.com/privacy"
            />
            <ThirdParty
              name="Supabase"
              role="אחסון של חשבונות משתמשים, פרופילי ילדים, ונתוני קריאה"
              dataShared="כל המידע במדורים 3.1, 3.2, 3.3 (לא הקלטות אודיו)"
              policy="https://supabase.com/privacy"
            />
            <ThirdParty
              name="Vercel"
              role="אירוח האפליקציה (Hosting)"
              dataShared="אין שיתוף מידע אישי; רק logs טכניים אוטומטיים של בקשות HTTP"
              policy="https://vercel.com/legal/privacy-policy"
            />
            <ThirdParty
              name="Dicta — מכון דיקטה לחקר העברית"
              role="ניקוד אוטומטי של טקסטים מותאמים אישית (Nakdan API)"
              dataShared="הטקסט שההורה הקליד / העלה (ללא מידע מזהה)"
              policy="https://nakdan.dicta.org.il/"
            />
          </div>

          <p className="mt-4">
            אנחנו <strong>לא משתפים</strong> מידע עם: רשתות פרסום, חברות שיווק, חברות אנליטיקה מסחריות, או ספקי תוכן אחרים.
          </p>
        </Section>

        <Section number="6" title="לאיזו מטרה אנחנו משתמשים במידע">
          <p>אנחנו משתמשים במידע אך ורק לצרכים הבאים:</p>
          <ul>
            <li><strong>הפעלת השירות:</strong> זיהוי דיבור, חישוב מטריקות קריאה, הצגת התוכן המתאים לרמת הילד.</li>
            <li><strong>שיפור החוויה האישית:</strong> המלצות על סיפורים, התאמת רמה אדפטיבית.</li>
            <li><strong>תקשורת עם ההורה:</strong> דוחות שבועיים (אם בחרת להפעיל), הודעות חשובות על השירות.</li>
            <li><strong>אבטחת השירות:</strong> זיהוי שימוש חריג, מניעת ניצול לרעה.</li>
            <li><strong>חיוב:</strong> ניהול מנוי, חשבוניות.</li>
            <li><strong>עמידה בחובות חוקיות:</strong> תגובה לדרישות רשויות מוסמכות, ככל שהדבר נדרש בחוק.</li>
          </ul>
          <p>
            אנחנו <strong>לא</strong> משתמשים במידע ל: שיווק לצדדים שלישיים, פרסום ממוקד, יצירת פרופילי משתמש לשיווק, או מכירת המידע.
          </p>
        </Section>

        <Section number="7" title="ילדים מתחת לגיל 13 (COPPA / GDPR-K)">
          <p>
            ReadRight מיועדת לשימוש על ידי הורים / אפוטרופוסים / מורים בגירים בגיל 18+, אשר מנהלים פרופילים בשם ילדים בכל גיל.
          </p>
          <p>
            <strong>הילד עצמו אינו יוצר חשבון.</strong> כל המידע שמוזן לגביו הוא באחריות ההורה הרשום.
          </p>
          <p>
            יצירת פרופיל עבור ילד דורשת:
          </p>
          <ul>
            <li>אישור מפורש שהמשתמש הוא הורה / אפוטרופוס / מורה</li>
            <li>אישור מפורש להקלטת קולו של הילד</li>
            <li>הסכמה לתנאי השימוש ולמדיניות הפרטיות</li>
          </ul>
          <p>
            אם אתה חושב שילדך מתחת לגיל 13 השתמש בשירות ללא הסכמתך המפורשת, פנה אלינו מיידית ב-<a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a> ונפעל למחוק את המידע מיידית.
          </p>
        </Section>

        <Section number="8" title="כמה זמן אנחנו שומרים את המידע">
          <ul>
            <li><strong>מידע על חשבון פעיל:</strong> כל עוד החשבון פעיל ועד 90 יום לאחר מחיקתו (לצורך גיבוי).</li>
            <li><strong>נתוני קריאה (היסטוריה):</strong> כל עוד החשבון פעיל. אתה יכול למחוק קריאות בודדות בכל עת.</li>
            <li><strong>הקלטות אודיו:</strong> ללא הגבלה — נשארות במכשיר שלך עד שתמחק אותן בעצמך.</li>
            <li><strong>נתוני חיוב:</strong> 7 שנים לאחר ביטול המנוי (חובה משפטית — חוק החשבונות בישראל).</li>
            <li><strong>logs טכניים:</strong> 30 יום (לאיתור באגים), אז נמחקים אוטומטית.</li>
          </ul>
        </Section>

        <Section number="9" title="הזכויות שלך">
          <p>בכפוף לחוקים החלים, יש לך הזכויות הבאות:</p>
          <ul>
            <li><strong>זכות העיון:</strong> לראות איזה מידע יש לנו עליך.</li>
            <li><strong>זכות הניידות:</strong> להוריד את המידע בפורמט מובנה (JSON) — דרך הדשבורד.</li>
            <li><strong>זכות התיקון:</strong> לתקן מידע שגוי.</li>
            <li><strong>זכות המחיקה (הזכות להישכח):</strong> למחוק את החשבון וכל המידע הקשור — דרך הדשבורד או באמצעות בקשה ב-{COMPANY_EMAIL}.</li>
            <li><strong>זכות לחזור בך מהסכמה:</strong> בכל רגע, בלי הצדקה. החזרה לא תפגע ביעילות הסכמה קודמת.</li>
            <li><strong>זכות להגביל את העיבוד:</strong> לבקש שנעצור עיבוד מסוים זמנית.</li>
            <li><strong>זכות להתנגד:</strong> להתנגד לעיבוד מסוים של המידע שלך.</li>
          </ul>
          <p>
            בקשות יטופלו תוך <strong>30 ימים</strong>. במקרים מורכבים אנחנו עשויים להאריך ב-60 ימים נוספים ולעדכן אותך.
          </p>
        </Section>

        <Section number="10" title="אבטחת מידע">
          <p>אנחנו נוקטים בצעדים סבירים להגנה על המידע:</p>
          <ul>
            <li>הצפנת תקשורת (HTTPS) בכל הצדדים</li>
            <li>הצפנת מידע במנוחה (encryption at rest) בשרתי Supabase</li>
            <li>גישה מוגבלת לעובדים — לפי הצורך בלבד</li>
            <li>סקירת אבטחה תקופתית</li>
            <li>שימוש ב-OAuth במקום סיסמאות (לכניסה דרך Google)</li>
          </ul>
          <p>
            <strong>במקרה של דליפת מידע</strong>: אם נדע על דליפת מידע אישי שעלולה לסכן זכויות וחירויות של משתמשים, נודיע על כך:
          </p>
          <ul>
            <li>תוך 72 שעות לרשות להגנת הפרטיות בישראל (כנדרש בחוק)</li>
            <li>תוך זמן סביר למשתמשים המושפעים, באמצעות אימייל והודעה באפליקציה</li>
          </ul>
        </Section>

        <Section number="11" title="העברת מידע מחוץ לישראל">
          <p>
            חלק מהשירותים שאנחנו משתמשים בהם (Supabase, Vercel, Google, Stripe) פועלים על שרתים מחוץ לישראל,
            בעיקר בארה"ב ובאירופה. ההעברה נעשית בכפוף ל:
          </p>
          <ul>
            <li>חוזי DPA (Data Processing Agreement) עם ספקי השירותים</li>
            <li>סטנדרטים של GDPR להעברת מידע (Standard Contractual Clauses)</li>
            <li>אישורי Privacy Shield / Adequacy Decisions של הנציבות האירופית, לפי הרלוונטי</li>
          </ul>
        </Section>

        <Section number="12" title="שינויים במדיניות">
          <p>
            כשנשנה את המדיניות הזו, נעדכן את התאריך למעלה ונציג הודעה בולטת בכניסה לאפליקציה.
            עבור שינויים מהותיים, נשלח אימייל לכל המשתמשים הרשומים, לפחות <strong>14 ימים מראש</strong>.
          </p>
          <p>
            המשך השימוש באפליקציה לאחר השינוי מהווה הסכמה. אם אתה לא מסכים לשינוי — תוכל למחוק את החשבון ולהתנגד לעיבוד.
          </p>
        </Section>

        <Section number="13" title="זכות להתלונן">
          <p>
            אם אתה חושב שהפרנו את החוק או את הזכויות שלך, אתה יכול להגיש תלונה:
          </p>
          <ul>
            <li><strong>בישראל:</strong> הרשות להגנת הפרטיות, משרד המשפטים. <br />אתר: <a href="https://www.gov.il/he/departments/the_privacy_protection_authority" target="_blank" rel="noopener noreferrer" style={{ color: colors.rust, fontWeight: 700 }}>www.gov.il/he/departments/the_privacy_protection_authority</a></li>
            <li><strong>באיחוד האירופי:</strong> רשות הגנת המידע המקומית במדינתך (DPA).</li>
          </ul>
          <p>
            אנחנו מבקשים — אבל לא חובה — שתפנה אלינו קודם ב-{COMPANY_EMAIL} כדי שננסה לפתור את הבעיה ביחד.
          </p>
        </Section>

        <Section number="14" title="ליצירת קשר">
          <p>
            לכל שאלה, בקשה, או הסתייגות — אנחנו זמינים:
          </p>
          <div className="rounded-xl p-4 mt-3 space-y-2" style={{ backgroundColor: colors.creamDark }}>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: colors.rust }} />
              <div className="text-sm">
                <strong>בנושאי פרטיות:</strong>{' '}
                <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{COMPANY_EMAIL}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: colors.rust }} />
              <div className="text-sm">
                <strong>בנושאים כלליים:</strong>{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>
        </Section>

        {/* Legal disclaimer */}
        <div
          className="rounded-2xl p-5 mt-8 text-xs"
          style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}
        >
          <strong style={{ color: colors.rust }}>הערה משפטית חשובה:</strong> מסמך זה הוא טיוטה מקיפה עבור פיילוט וביתא,
          ולא חליפה לייעוץ משפטי מקצועי. לפני שימוש מסחרי בקנה מידה, שילוב במוסדות חינוך, או כניסה לשווקי חוץ —
          יש להתייעץ עם עורך דין המתמחה בדיני פרטיות וילדים בישראל. המסמך נכתב על מנת לכסות את הדרישות
          העיקריות של חוק הגנת הפרטיות הישראלי, GDPR, ו-COPPA, אך לא ניתן להבטיח כיסוי מלא של כל המקרים.
        </div>
      </div>
    </div>
  );
}

// ============================================
// Helper components
// ============================================
function Section({ number, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black mb-3 flex items-baseline gap-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
        <span style={{ color: colors.rust, fontSize: '0.7em' }}>§{number}</span>
        {title}
      </h2>
      <div className="text-base leading-relaxed space-y-3" style={{ color: colors.textSecondary }}>
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }) {
  return (
    <div className="mt-4">
      <div className="font-bold text-sm mb-2" style={{ color: colors.navy }}>
        {title}
      </div>
      <div className="text-sm space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function ThirdParty({ name, role, dataShared, policy }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: colors.creamDark }}>
      <div className="font-black mb-1" style={{ color: colors.navy }}>{name}</div>
      <div className="text-sm" style={{ color: colors.textSecondary }}>
        <div><strong>תפקיד:</strong> {role}</div>
        <div><strong>מה משותף איתם:</strong> {dataShared}</div>
        <div className="mt-1">
          <strong>מדיניות פרטיות שלהם:</strong>{' '}
          <a href={policy} target="_blank" rel="noopener noreferrer" style={{ color: colors.rust, fontWeight: 700 }}>
            {policy.replace(/^https?:\/\//, '').split('/')[0]}
          </a>
        </div>
      </div>
    </div>
  );
}
