// Terms.jsx — תנאי שימוש של ReadRight
// =================================
// Version 2 — strengthened compared to v1. Still a draft, but covers gaps
// an Israeli lawyer would flag:
//   - Clearer definitions section
//   - Specific subscription billing terms
//   - Refund and cancellation policy
//   - Liability limits with appropriate caveats
//   - Force majeure
//   - Severability
//   - Notice provisions
//   - Specific dispute resolution

import React from 'react';
import { ArrowRight, FileText, AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../lib/theme';

const LAST_UPDATED = '12 במאי 2025';
const COMPANY_NAME = '[Company Name / Owner Name]';
const CONTACT_EMAIL = 'hello@readright.app';
const LEGAL_EMAIL = 'legal@readright.app';
const COURT_LOCATION = 'תל אביב';

function TermsEnglish({ onNavigate }) {
  return (
    <div dir="ltr" className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-6 text-sm font-bold transition hover:gap-3" style={{ color: colors.navy }}>
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.sunLight }}>
            <FileText className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>ReadRight</div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              Terms of Service
            </h1>
          </div>
        </div>

        <div className="text-xs mb-8" style={{ color: colors.textMuted }}>Last updated: May 12, 2025 · v2.0</div>

        <div className="rounded-2xl p-6 mb-8 text-sm leading-relaxed" style={{ backgroundColor: colors.sunLight, color: colors.navy }}>
          <p>
            Welcome to ReadRight. This document is a legal agreement between you and {COMPANY_NAME}.
            Using the service means you agree to these terms. <strong>Please read carefully.</strong>
          </p>
          <p className="mt-2">
            If you don't agree with any of the terms, please don't use the service.
          </p>
        </div>

        <SectionENT number="1" title="Eligibility & use">
          <p>You must be <strong>18 years or older</strong> and have full legal capacity. Use is permitted only by parents, legal guardians, teachers with parental approval, or speech therapists in professional treatment context.</p>
          <p>By using the service, you explicitly confirm: (1) you are the child's parent/guardian, or have authorization from them; (2) you understand the app records the child's voice; (3) you agree recordings stay on your device; (4) you are responsible for explaining to the child that they are being recorded, age-appropriately.</p>
        </SectionENT>

        <SectionENT number="2" title="Account">
          <p>You're responsible for keeping your login secure. Don't share credentials. Notify us immediately of unauthorized access at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a>. No duplicate accounts; we may merge or delete them.</p>
        </SectionENT>

        <SectionENT number="3" title="Acceptable use">
          <p>You agree NOT to: use the service for illegal purposes; upload copyright-infringing content; upload offensive, threatening, racist, or sexual material; attempt to hack or overload the service; use automated tools (scrapers, bots) without permission; share accounts; reverse-engineer; or use it to build a competing product.</p>
          <p>Violations may result in immediate termination without refund.</p>
        </SectionENT>

        <SectionENT number="4" title="Your content">
          <p>Content you upload (text, links, files) remains <strong>your property</strong>. You grant us a limited, non-exclusive, non-transferable license solely to operate the service for you. The license ends when you delete the content or your account.</p>
          <p>You warrant that: you have the right to use the content; it doesn't infringe third-party rights; it's age-appropriate.</p>
        </SectionENT>

        <SectionENT number="5" title="Subscription & billing">
          <p>New users get a <strong>30-day free trial</strong> with full access. No credit card required during the trial. After trial, accounts auto-downgrade to "restricted free" (1 child, 1 story) unless you upgrade.</p>
          <p><strong>Premium plans:</strong> Monthly ($12/mo) or Yearly ($99/yr, saves ~30%). Schools: $999/classroom (30 students) per year. All prices include applicable tax.</p>
          <p>Subscriptions auto-renew. Cancel anytime from the dashboard — billing stops at the end of the current period.</p>
          <p><strong>Refunds:</strong> Full refund within 30 days of first charge, no questions asked. After 30 days, refunds at our discretion. Email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a>.</p>
        </SectionENT>

        <SectionENT number="6" title="Intellectual property">
          <p>All rights in the service — code, design, stories, logo, name, UI — belong to us or our licensors. These terms grant no IP rights beyond the right to use the service. You may not copy, distribute, publish, or commercially use any part without our written consent.</p>
        </SectionENT>

        <SectionENT number="7" title="AS-IS warranty">
          <p>
            The service is provided <strong>"as is"</strong> without warranty of any kind. We do not guarantee 100% accurate speech recognition (especially for children's Hebrew/English), 100% uptime, compatibility with every device, or that pedagogical recommendations suit every child.
          </p>
        </SectionENT>

        <SectionENT number="8" title="Medical / educational disclaimer">
          <div className="rounded-xl p-4 mt-3" style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}>
            <p className="font-black mb-2" style={{ color: colors.rust }}>
              ⚠️ ReadRight is NOT a medical, psychological, or educational diagnostic tool.
            </p>
            <p>
              Insights and recommendations are <strong>indicative only</strong> and are not a substitute for professional evaluation by a certified speech-language pathologist, educational psychologist, school counselor, or pediatrician. If you suspect dyslexia, ADHD, or significant reading difficulty — please consult a qualified professional.
            </p>
          </div>
        </SectionENT>

        <SectionENT number="9" title="Limitation of liability">
          <p>
            To the extent permitted by law, neither the company nor its directors, employees, or partners will be liable for indirect, incidental, consequential, or punitive damages; lost revenue, lost data, or lost opportunities; lost recordings due to browser-history deletion, device replacement, or hardware failure; decisions you make based on app recommendations; speech recognition or vowelization errors; or third-party service failures (Google, Stripe, etc.).
          </p>
          <p>
            Our total aggregate liability is limited to <strong>amounts you paid us in the past 12 months</strong>, or <strong>$150 USD</strong>, whichever is greater.
          </p>
        </SectionENT>

        <SectionENT number="10" title="Force majeure">
          <p>
            We are not liable for delays or non-performance due to causes beyond our reasonable control, including war, hostilities, strikes, natural disasters, pandemics, prolonged power outages, infrastructure failures (Google, Vercel, Stripe), government actions, etc.
          </p>
        </SectionENT>

        <SectionENT number="11" title="Changes">
          <p>
            We may update the service or these terms. Material changes will be notified 14 days in advance by email. Continued use after a change means you accept it.
          </p>
        </SectionENT>

        <SectionENT number="12" title="Termination">
          <p>
            You can cancel anytime from the dashboard. Cancellation doesn't automatically refund unused time (except within 30 days of first payment). We may terminate accounts for material breach, fraud suspicion, or legal requirements; for less serious issues we will give warning first.
          </p>
        </SectionENT>

        <SectionENT number="13" title="Governing law">
          <p>
            These terms are governed by the laws of <strong>Israel</strong>, without regard to conflict-of-law principles. Any dispute will be exclusively heard in the competent courts of <strong>Tel Aviv, Israel</strong>.
          </p>
          <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
            For US users: governing law may differ based on local consumer protection statutes. Mandatory consumer rights under your local law are not waived.
          </p>
        </SectionENT>

        <SectionENT number="14" title="Contact">
          <div className="rounded-xl p-4 mt-3 space-y-2" style={{ backgroundColor: colors.creamDark }}>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4" style={{ color: colors.rust }} /><div className="text-sm"><strong>General:</strong> <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a></div></div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4" style={{ color: colors.rust }} /><div className="text-sm"><strong>Legal:</strong> <a href={`mailto:${LEGAL_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{LEGAL_EMAIL}</a></div></div>
          </div>
        </SectionENT>

        <div className="rounded-2xl p-5 mt-8 text-xs" style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}>
          <strong style={{ color: colors.rust }}>Important legal note:</strong> This is a summary translation of our Hebrew Terms of Service. Before commercial launch in the US, a US attorney review is required for proper consumer protection compliance (CCPA, state laws). The Hebrew version is the legally authoritative document for the Israeli market.
        </div>
      </div>
    </div>
  );
}

function SectionENT({ number, title, children }) {
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

export default function Terms({ onNavigate }) {
  const { i18n } = useTranslation();
  if (i18n.language === 'en') {
    return <TermsEnglish onNavigate={onNavigate} />;
  }
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 mb-6 text-sm font-bold transition hover:gap-3"
          style={{ color: colors.navy }}
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.sunLight }}
          >
            <FileText className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
              ReadRight
            </div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              תנאי שימוש
            </h1>
          </div>
        </div>

        <div className="text-xs mb-8 flex items-center justify-between" style={{ color: colors.textMuted }}>
          <span>עודכן לאחרונה: {LAST_UPDATED}</span>
          <span>גרסה 2.0</span>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl p-6 mb-8 text-sm leading-relaxed"
          style={{ backgroundColor: colors.sunLight, color: colors.navy }}
        >
          <p>
            ברוכים הבאים ל-ReadRight! המסמך הזה הוא הסכם משפטי בינך לבין {COMPANY_NAME}.
            השימוש בשירות מהווה הסכמתך לתנאים הללו במלואם. <strong>אנא קרא בעיון לפני השימוש.</strong>
          </p>
          <p className="mt-2">
            אם אתה לא מסכים לאחד או יותר מהתנאים — אנא לא תשתמש בשירות.
          </p>
        </div>

        <Section number="1" title="הגדרות">
          <p>במסמך זה:</p>
          <ul>
            <li><strong>"השירות"</strong> או <strong>"האפליקציה"</strong> — אפליקציית ReadRight על כל גרסאותיה, כולל אתר, מובייל, ומכשירים נלווים.</li>
            <li><strong>"החברה"</strong> או <strong>"אנחנו"</strong> — {COMPANY_NAME}, מפעילי השירות.</li>
            <li><strong>"המשתמש"</strong> או <strong>"אתה"</strong> — האדם המבוגר הרשום לשירות, הורה / אפוטרופוס / מורה.</li>
            <li><strong>"הילד"</strong> — קטין שהמשתמש יצר לו פרופיל באפליקציה.</li>
            <li><strong>"תוכן משתמש"</strong> — כל טקסט, קובץ, קישור או חומר אחר שהמשתמש מעלה לשירות.</li>
            <li><strong>"מנוי"</strong> — תוכנית תשלום פעילה בשירות.</li>
          </ul>
        </Section>

        <Section number="2" title="זכאות ושימוש">
          <Subsection title="2.1 גיל">
            <p>על מנת להירשם ולהשתמש בשירות, עליך להיות בן <strong>18 שנים ומעלה</strong> ולהיות בעל כשרות משפטית מלאה.</p>
          </Subsection>

          <Subsection title="2.2 תפקיד">
            <p>הגישה לשירות מותרת אך ורק ל:</p>
            <ul>
              <li><strong>הורים / אפוטרופוסים חוקיים</strong> של הילד</li>
              <li><strong>מורים / מורות</strong> בעלי הסכמה מההורים</li>
              <li><strong>קלינאיות תקשורת / מאבחנים</strong> במסגרת טיפול מקצועי, בהסכמת ההורה</li>
            </ul>
          </Subsection>

          <Subsection title="2.3 הסכמה להקלטה">
            <p>
              על ידי שימוש בשירות, אתה <strong>מצהיר ומסכים</strong> במפורש:
            </p>
            <ul>
              <li>אתה ההורה / אפוטרופוס של הילד, או יש לך אישור מהם להגדיר אותו בשירות</li>
              <li>אתה מבין שהאפליקציה <strong>מקליטה את הילד בקול</strong> בזמן שהוא קורא</li>
              <li>אתה מסכים שההקלטות יישמרו במכשיר שלך</li>
              <li>אתה אחראי להסביר לילד שהוא מוקלט, באופן המתאים לגילו ולהבנתו</li>
              <li>אתה אחראי להבטיח שלא יוקלטו אנשים אחרים שלא נתנו את הסכמתם</li>
            </ul>
          </Subsection>
        </Section>

        <Section number="3" title="חשבון משתמש">
          <Subsection title="3.1 הקמת חשבון">
            <p>
              כדי להשתמש בכל הפיצ'רים, עליך ליצור חשבון. אתה אחראי לוודא שהמידע שאתה מספק (אימייל, שם) הוא <strong>מדויק ועדכני</strong>.
            </p>
          </Subsection>

          <Subsection title="3.2 אבטחת חשבון">
            <p>
              אתה אחראי לאבטחת חשבונך. אסור לחלוק את פרטי הכניסה עם אחרים.
              במקרה של שימוש לא מורשה בחשבונך — עליך להודיע לנו מיידית ב-{CONTACT_EMAIL}.
            </p>
          </Subsection>

          <Subsection title="3.3 פרופיל אחד למשתמש">
            <p>
              אסור ליצור חשבונות מרובים לאותו אדם. אנחנו רשאים לאחד או למחוק חשבונות כפולים.
            </p>
          </Subsection>
        </Section>

        <Section number="4" title="השימוש המותר">
          <p>בעת השימוש בשירות, אתה <strong>מתחייב לא לעשות</strong>:</p>
          <ul>
            <li>שימוש לכל מטרה לא חוקית, לא מוסרית, או בניגוד לתקנת הציבור</li>
            <li>העלאת תוכן המפר זכויות יוצרים של אחרים</li>
            <li>העלאת תוכן פוגעני, מאיים, מטעה, גזעני, מיני, או לא ראוי</li>
            <li>ניסיון לפרוץ, להפיל, או להעמיס יתר על המידה את השירות</li>
            <li>שימוש בכלים אוטומטיים (scrapers, bots) ללא אישור מפורש</li>
            <li>שיתוף חשבון עם אחרים, או שימוש בחשבון של מישהו אחר</li>
            <li>הנדסה לאחור של השירות, או ניסיון להעתיק את הקוד</li>
            <li>שימוש בשירות לתחרות איתנו או לפיתוח מוצר תחרותי</li>
          </ul>
          <p>
            הפרה של אחד מהסעיפים הללו מהווה <strong>הפרה מהותית</strong> של ההסכם ומקנה לנו זכות
            להפסיק את חשבונך מיידית, ללא החזר כספי.
          </p>
        </Section>

        <Section number="5" title="תוכן שמעלה המשתמש">
          <Subsection title="5.1 בעלות">
            <p>
              כל תוכן שאתה מעלה (טקסטים, קישורים, קבצים) נשאר <strong>בבעלותך המלאה</strong>.
              אנחנו לא טוענים זכויות על התוכן שלך.
            </p>
          </Subsection>

          <Subsection title="5.2 רישיון לנו">
            <p>
              על ידי העלאת תוכן, אתה מעניק לנו רישיון <strong>מוגבל, לא בלעדי, ולא ניתן להעברה</strong>
              להשתמש בתוכן <strong>אך ורק</strong> כדי להפעיל עבורך את השירות (לדוגמה: לנקד אותו, להציג אותו לילד).
              הרישיון מסתיים מיידית כשאתה מוחק את התוכן או את החשבון.
            </p>
          </Subsection>

          <Subsection title="5.3 התחייבותך">
            <p>אתה מצהיר ומתחייב ש:</p>
            <ul>
              <li>יש לך זכות מלאה להשתמש בתוכן שאתה מעלה</li>
              <li>התוכן לא מפר זכויות של אף צד שלישי</li>
              <li>התוכן מתאים לשימוש על ידי ילדים</li>
            </ul>
          </Subsection>
        </Section>

        <Section number="6" title="מנויים ותשלומים">
          <Subsection title="6.1 תקופת ניסיון">
            <p>
              משתמשים חדשים מקבלים <strong>30 ימי ניסיון בחינם</strong> עם גישה מלאה לכל הפיצ'רים.
              לא נדרש כרטיס אשראי במהלך תקופת הניסיון.
            </p>
          </Subsection>

          <Subsection title="6.2 לאחר הניסיון">
            <p>
              בתום 30 ימי הניסיון, החשבון יעבור אוטומטית למצב <strong>חינמי מוגבל</strong>:
            </p>
            <ul>
              <li>ילד אחד פעיל (הילד הראשון שיצרת)</li>
              <li>גישה לסיפור אחד קבוע מראש</li>
              <li>נתוני שאר הילדים נשמרים אך מוקפאים</li>
            </ul>
            <p>אתה יכול לשדרג למנוי בתשלום בכל עת ולפתוח את כל הפיצ'רים.</p>
          </Subsection>

          <Subsection title="6.3 תוכניות תשלום">
            <ul>
              <li><strong>Premium חודשי:</strong> ₪49 לחודש, מחויב מדי חודש</li>
              <li><strong>Premium שנתי:</strong> ₪399 לשנה (₪33 לחודש), מחויב מראש</li>
              <li><strong>בתי ספר:</strong> ₪3,500 לכיתה (30 תלמידים) לשנה</li>
            </ul>
            <p>
              <strong>כל המחירים כוללים מע"מ.</strong> נשמרת לנו הזכות לעדכן את המחירים בהודעה מוקדמת של 30 ימים.
            </p>
          </Subsection>

          <Subsection title="6.4 חידוש אוטומטי">
            <p>
              מנויים מתחדשים אוטומטית בתום כל תקופה. אתה יכול לבטל את החידוש האוטומטי בכל עת
              מתוך הדשבורד, או על ידי פנייה אלינו. הביטול ייכנס לתוקף בתום התקופה הנוכחית.
            </p>
          </Subsection>

          <Subsection title="6.5 מדיניות החזרים">
            <p>
              אנחנו מציעים <strong>החזר כספי מלא תוך 30 ימים</strong> מהחיוב הראשון, ללא שאלות.
              מעבר ל-30 ימים, החזרים יינתנו לפי שיקול דעתנו ובכפוף לחוק.
            </p>
            <p>
              לבקשת החזר: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a>
            </p>
          </Subsection>

          <Subsection title="6.6 כישלון תשלום">
            <p>
              אם תשלום נכשל (לדוגמה: כרטיס אשראי שפג תוקפו), נשלח לך הודעה ונאפשר עד 7 ימים לעדכן את אמצעי התשלום.
              לאחר מכן, החשבון יעבור אוטומטית למצב חינמי מוגבל.
            </p>
          </Subsection>
        </Section>

        <Section number="7" title="קניין רוחני">
          <p>
            כל הזכויות בשירות — כולל הקוד, העיצוב, הסיפורים שלנו, הלוגו, השם, והממשק — שייכות לנו או למורשים שלנו.
            התנאים האלה לא מעבירים לך אף זכות בקניין הרוחני, מלבד הזכות להשתמש בשירות לפי התנאים האלה.
          </p>
          <p>
            <strong>אסור</strong>: להעתיק, להפיץ, לפרסם, או לעשות שימוש מסחרי בכל חלק של השירות, אלא אם קיבלת אישור בכתב מאיתנו.
          </p>
        </Section>

        <Section number="8" title="שירות ללא ערבות (AS IS)">
          <p>
            השירות מוצע <strong>"כמות שהוא" וללא כל ערבות מכל סוג</strong>, מפורשת או משתמעת, במידה המותרת בחוק.
          </p>
          <p>אנחנו לא ערבים ש:</p>
          <ul>
            <li>זיהוי הדיבור יהיה מדויק ב-100% (במיוחד בעברית של ילדים, מבטאים, רעשי רקע)</li>
            <li>השירות יהיה זמין תמיד וללא תקלות</li>
            <li>השירות יעבוד על כל מכשיר או דפדפן</li>
            <li>השירות יענה לצרכים הספציפיים שלך</li>
            <li>ההמלצות הפדגוגיות יתאימו לכל ילד</li>
            <li>הניקוד האוטומטי יהיה תמיד נכון</li>
          </ul>
        </Section>

        <Section number="9" title="דיסקליימר רפואי וחינוכי">
          <div
            className="rounded-xl p-4 mt-3"
            style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
          >
            <p className="font-black mb-2" style={{ color: colors.rust }}>
              ⚠️ ReadRight אינה כלי אבחון רפואי, פסיכולוגי, או חינוכי-טיפולי.
            </p>
            <p>
              התובנות, המדדים, וההמלצות שהאפליקציה מספקת הם <strong>אינדיקטיביים בלבד</strong>
              ואינם מהווים תחליף לאבחון מקצועי על ידי:
            </p>
            <ul className="mt-2">
              <li>קלינאי/ת תקשורת מוסמך/ת</li>
              <li>פסיכולוג/ית חינוכי/ת</li>
              <li>יועצ/ת חינוכי/ת</li>
              <li>רופא/ת ילדים מתמחה</li>
            </ul>
            <p className="mt-2">
              אם אתה חושד שילדך סובל מדיסלקציה, הפרעת קשב, או קושי קריאה משמעותי —
              <strong> פנה לאיש מקצוע מוסמך</strong>. ReadRight היא כלי תמיכה, לא תחליף לאבחון.
            </p>
          </div>
        </Section>

        <Section number="10" title="הגבלת אחריות">
          <p>
            במידה המותרת על פי החוק, החברה, מנהליה, עובדיה, ושותפיה <strong>לא יישאו באחריות</strong> ל:
          </p>
          <ul>
            <li>נזק עקיף, מקרי, תוצאתי, או עונשי (Indirect, incidental, consequential, or punitive)</li>
            <li>אובדן הכנסה, אובדן נתונים, אובדן הזדמנויות</li>
            <li>אובדן הקלטות עקב מחיקת היסטוריית הדפדפן, החלפת מכשיר, או תקלת חומרה</li>
            <li>החלטות שתקבל על בסיס המלצות האפליקציה</li>
            <li>שגיאות בזיהוי דיבור, בניקוד, או בהערכת רמת קושי</li>
            <li>נזק שנגרם כתוצאה מתקלות בצדדים שלישיים (Google, Stripe, וכו')</li>
          </ul>
          <p>
            סך החבות הכוללת שלנו, בכל מקרה, מוגבלת <strong>לסכום ששילמת לנו ב-12 החודשים האחרונים</strong>,
            או <strong>₪500</strong> — לפי הגבוה מביניהם.
          </p>
          <p className="text-xs mt-2">
            ההגבלות לעיל לא חלות על נזק שנגרם בכוונה תחילה, או על נושאים שלפי החוק לא ניתן להגביל לגביהם אחריות.
          </p>
        </Section>

        <Section number="11" title="כוח עליון">
          <p>
            אנחנו לא נישא באחריות לעיכוב או אי-ביצוע של חובותינו כתוצאה מ<strong>כוח עליון</strong> — לרבות
            אך לא רק: מלחמה, פעולות איבה, שביתות, אסונות טבע, מגיפות, הפסקות חשמל ארוכות, נפילת ספקי
            תשתית (Google, Vercel, Stripe), פעולות ממשלתיות, או כל אירוע מחוץ לשליטתנו הסבירה.
          </p>
        </Section>

        <Section number="12" title="שינויים בשירות ובתנאים">
          <Subsection title="12.1 שינויים בשירות">
            <p>
              אנחנו רשאים לעדכן, לשנות, או להפסיק את השירות (כולו או חלקו) בכל עת. נשתדל לתת הודעה מוקדמת
              לפני שינויים משמעותיים. במקרה של הפסקת השירות, נאפשר לך להוריד את הנתונים שלך לפחות 30 ימים מראש.
            </p>
          </Subsection>

          <Subsection title="12.2 שינויים בתנאים">
            <p>
              אנחנו רשאים לעדכן את התנאים האלה. שינוי מהותי יודע <strong>14 ימים מראש</strong> באימייל.
              המשך השימוש לאחר השינוי = הסכמה לתנאים החדשים.
            </p>
          </Subsection>
        </Section>

        <Section number="13" title="סיום שימוש">
          <Subsection title="13.1 סיום על ידך">
            <p>
              אתה יכול לבטל את חשבונך בכל עת מתוך הדשבורד או באמצעות פנייה ל-{CONTACT_EMAIL}.
              ביטול לא מקנה החזר אוטומטי על תקופה שלא נוצלה (למעט בתוך 30 ימים מהתשלום הראשון).
            </p>
          </Subsection>

          <Subsection title="13.2 סיום מצדנו">
            <p>אנחנו רשאים להפסיק את חשבונך, ללא הודעה מוקדמת, אם:</p>
            <ul>
              <li>תפר באופן מהותי את התנאים האלה</li>
              <li>תספק מידע שגוי בעת ההרשמה</li>
              <li>נחשוד בפעילות מרמה או הונאה</li>
              <li>נדרש לכך לפי החוק או דרישת רשות מוסמכת</li>
            </ul>
            <p>במקרים פחות חמורים נשלח קודם אזהרה ונאפשר תיקון.</p>
          </Subsection>
        </Section>

        <Section number="14" title="הודעות">
          <p>
            כל הודעה אלינו תישלח לכתובת <a href={`mailto:${LEGAL_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{LEGAL_EMAIL}</a>.
            הודעות מאיתנו אליך יישלחו לכתובת האימייל שרשמת בחשבונך, או יוצגו באפליקציה.
          </p>
        </Section>

        <Section number="15" title="הוראות שונות">
          <Subsection title="15.1 הסכם שלם">
            <p>
              התנאים האלה, יחד עם מדיניות הפרטיות שלנו, מהווים את ההסכם השלם בינך לבינינו ומחליפים כל הסכם או הבנה קודמת.
            </p>
          </Subsection>

          <Subsection title="15.2 העדר ויתור">
            <p>
              אי-אכיפת זכות מהתנאים האלה לא תיחשב לוויתור עליה.
            </p>
          </Subsection>

          <Subsection title="15.3 ניתוקיות (Severability)">
            <p>
              אם סעיף כלשהו בתנאים האלה ייקבע כבטל או בלתי-ניתן לאכיפה, יתר הסעיפים יישארו בתוקף מלא.
              הסעיף הבטל יוחלף בסעיף תקף הקרוב ביותר במשמעות לסעיף המקורי.
            </p>
          </Subsection>

          <Subsection title="15.4 העברת זכויות">
            <p>
              אתה לא רשאי להעביר את זכויותיך מההסכם הזה ללא אישורנו בכתב. אנחנו רשאים להעביר את זכויותינו
              במסגרת מיזוג, רכישה, או מכירת השירות, בהודעה מוקדמת אליך.
            </p>
          </Subsection>
        </Section>

        <Section number="16" title="חוק חל וסמכות שיפוט">
          <p>
            התנאים האלה כפופים לחוקי <strong>מדינת ישראל</strong> בלבד, ללא תקנות הברירה של הדין הבינלאומי הפרטי.
          </p>
          <p>
            כל מחלוקת תידון בלעדית בבתי המשפט המוסמכים ב<strong>{COURT_LOCATION}</strong>.
            אתה ואנחנו מסכימים לסמכות שיפוט בלעדית של בתי משפט אלו.
          </p>
        </Section>

        <Section number="17" title="ליצירת קשר">
          <div className="rounded-xl p-4 mt-3 space-y-2" style={{ backgroundColor: colors.creamDark }}>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: colors.rust }} />
              <div className="text-sm">
                <strong>שאלות כלליות:</strong>{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{CONTACT_EMAIL}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" style={{ color: colors.rust }} />
              <div className="text-sm">
                <strong>שאלות משפטיות:</strong>{' '}
                <a href={`mailto:${LEGAL_EMAIL}`} style={{ color: colors.rust, fontWeight: 700 }}>{LEGAL_EMAIL}</a>
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
          ולא חליפה לייעוץ משפטי מקצועי. לפני שימוש מסחרי, שילוב במוסדות חינוך, או פעילות מול גופים גדולים —
          יש להתייעץ עם עורך דין המתמחה בדיני אינטרנט והגנת הצרכן. מסמך זה נכתב על מנת לכסות את הסטנדרטים
          המקובלים בענף ה-Ed-Tech בישראל, אך נושאים ספציפיים (לדוגמה, רגולציה במשרד החינוך, השתתפות בתוכניות
          מימון ממשלתיות, או מכרזים) עשויים לדרוש סעיפים נוספים.
        </div>
      </div>
    </div>
  );
}

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
