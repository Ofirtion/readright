// Help.jsx — שאלות נפוצות וספר הדרכה בסיסי
// =================================
// Single page that combines:
//   - "Getting started" — quick onboarding overview
//   - FAQ — frequent questions organized by category
//   - Troubleshooting — common issues with microphone, recognition, etc.

import React, { useState } from 'react';
import {
  ArrowRight, HelpCircle, ChevronDown, Mic, BookOpen,
  Sparkles, Shield, Settings, AlertTriangle, Mail, PlayCircle, Search
} from 'lucide-react';
import { colors, fonts } from '../lib/theme';

// All FAQs organized by category
const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'איך להתחיל',
    icon: PlayCircle,
    color: 'sun',
    items: [
      {
        q: 'איך מתחילים?',
        a: 'ההרשמה אורכת פחות מדקה. נכנסים עם חשבון Google, ממלאים פרטים בסיסיים על הילד (שם, גיל, רמת קריאה משוערת ותחומי עניין), ואז בוחרים סיפור מהמאגר ומתחילים לקרוא בקול.',
      },
      {
        q: 'מה הילד צריך לעשות?',
        a: 'הילד פותח סיפור, לוחץ על כפתור המיקרופון, ומתחיל לקרוא בקול את המילים שהוא רואה. המערכת מאזינה, מסמנת כל מילה שהוא מצליח לקרוא נכון, ועוזרת לו במילים קשות.',
      },
      {
        q: 'באיזה גילאים זה מתאים?',
        a: 'ReadRight מתאימה לילדים מכיתות א\' עד ז\' (גילאים 6-13). יש 5 רמות קושי, מתחיל ועד מתקדם. אפשר להגדיר את הרמה ידנית, או לתת למערכת להתאים אוטומטית לפי הביצועים.',
      },
      {
        q: 'באיזה דפדפן זה הכי טוב?',
        a: 'Chrome ו-Edge הם הטובים ביותר לזיהוי דיבור בעברית. Safari עובד גם, וגם מציע פרטיות גבוהה יותר (זיהוי הדיבור מתבצע במכשיר עצמו ולא בענן). Firefox לצערנו לא נתמך.',
      },
    ],
  },
  {
    id: 'microphone',
    title: 'מיקרופון וזיהוי דיבור',
    icon: Mic,
    color: 'rust',
    items: [
      {
        q: 'המיקרופון לא עובד. מה לעשות?',
        a: '(1) ודא שאפשרת לדפדפן גישה למיקרופון — תופיע התראה בפעם הראשונה. (2) בדוק שהמיקרופון פעיל במכשיר עצמו. (3) רענן את הדף ונסה שוב. (4) במחשבים, בדוק את הגדרות הפרטיות של מערכת ההפעלה — לפעמים החסימה היא ברמת המערכת.',
      },
      {
        q: 'המערכת לא מזהה את הילד נכון',
        a: 'כמה סיבות אפשריות: רעש רקע (כדאי לקרוא בחדר שקט), הילד מדבר בלחישה (לעודד לקרוא בקול ברור), מיקרופון רחוק מדי (לקרב למיקרופון), או שהילד הוגה אחרת ממה שהמערכת מצפה. במקרים האחרונים — אפשר להשתמש בכפתור "רמז" כדי לראות את ההגייה.',
      },
      {
        q: 'אם המערכת טועה ולא מזהה מילה נכונה, מה לעשות?',
        a: 'הילד יכול ללחוץ על כפתור "הבא" אחרי 3 ניסיונות כדי להמשיך. אנחנו עובדים על שיפור הזיהוי בעברית של ילדים, במיוחד מבטאים שונים.',
      },
      {
        q: 'האם הקלטות הקול נשמרות?',
        a: 'כן — כל קריאה נשמרת אוטומטית כקובץ אודיו, אך **רק במכשיר שלך** (בדפדפן). ההקלטות לעולם לא נשלחות לשרתינו ולא לאף צד שלישי. רק ההורה יכול להאזין מהדשבורד. ראה מדיניות הפרטיות לפרטים נוספים.',
      },
    ],
  },
  {
    id: 'reading',
    title: 'קריאה ומתודולוגיה',
    icon: BookOpen,
    color: 'green',
    items: [
      {
        q: 'מה זה WCPM?',
        a: 'WCPM = Words Correct Per Minute, או "מילים נכונות לדקה". זה המדד הסטנדרטי הבינלאומי לשטף קריאה. ילד בכיתה א\' אמור להגיע ל-30-50 WCPM בסוף השנה. בכיתה ג\' — 80-100. אנחנו מציגים את המדד כדי לאפשר השוואה לסטנדרטים מקצועיים.',
      },
      {
        q: 'איך נקבעת רמת הקריאה?',
        a: 'בהתחלה — אתה ההורה בוחר רמה (1-5) בעת הגדרת הילד. עם הזמן, המערכת מציעה לעלות רמה כשהביצועים יציבים גבוהים (~95% דיוק וקצב טוב). אפשר תמיד לשנות ידנית.',
      },
      {
        q: 'הסיפורים יותר מדי קלים / יותר מדי קשים. מה אעשה?',
        a: 'אפשר להגדיר רמה אחרת לילד בהגדרות הילד, או לבחור סיפור מרמה אחרת מתוך הספרייה. אם רמה כלשהי לא מתאימה, אפשר גם להעלות תוכן משלך (טאב "הסיפורים שלי").',
      },
      {
        q: 'אפשר לקרוא את אותו סיפור כמה פעמים?',
        a: 'בהחלט! חזרה על סיפורים מוכרים היא חלק חשוב מבניית שטף הקריאה (זה נקרא "repeated reading" במחקר הפדגוגי). הילד יראה שהסיפור כבר נקרא, אבל יכול לקרוא שוב בכיף.',
      },
    ],
  },
  {
    id: 'subscription',
    title: 'מנוי וחשבון',
    icon: Settings,
    color: 'sun',
    items: [
      {
        q: 'כמה זה עולה?',
        a: '30 ימי ניסיון בחינם, ללא כרטיס אשראי. אחר כך: ₪49 לחודש, או ₪399 לשנה (₪33 לחודש — חיסכון של 32%). שתי התוכניות כוללות עד 3 ילדים, כל הסיפורים, וכל הפיצ\'רים.',
      },
      {
        q: 'מה קורה בסוף תקופת הניסיון?',
        a: 'החשבון עובר אוטומטית למצב "חינמי מוגבל" — ילד אחד פעיל וסיפור אחד. הנתונים של שאר הילדים נשמרים אבל מוקפאים. אפשר לשדרג ל-Premium בכל רגע ולפתוח הכל בחזרה.',
      },
      {
        q: 'איך מבטלים מנוי?',
        a: 'בכל עת, מתוך הדשבורד → "החשבון שלי" → "בטל מנוי". המנוי ימשיך עד תום התקופה ששילמת עליה, ואז יעבור למצב חינמי.',
      },
      {
        q: 'מקבלים החזר אם מבטלים?',
        a: '30 יום החזר כספי מלא מהחיוב הראשון, ללא שאלות. אחרי 30 יום — נשקול לפי המקרה. פנה אלינו ב-hello@readright.app.',
      },
      {
        q: 'יש הנחה למורים / בתי ספר?',
        a: 'יש לנו תוכנית בית ספר — ₪3,500 לכיתה לשנה (30 ילדים), עם דשבורד למורה ומנוי משפחתי חינם להורי התלמידים. פנה ל-schools@readright.app.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'פרטיות ובטיחות',
    icon: Shield,
    color: 'rust',
    items: [
      {
        q: 'איפה הנתונים שלי נשמרים?',
        a: 'נתוני החשבון (פרופיל הורה, פרופילי ילדים, היסטוריית קריאות) נשמרים בשרתי Supabase מאובטחים. ההקלטות הקוליות נשמרות **אך ורק במכשיר שלך** (IndexedDB של הדפדפן). אנחנו אף פעם לא רואים את ההקלטות.',
      },
      {
        q: 'איך מוחקים את החשבון?',
        a: 'מתוך הדשבורד → "הנתונים שלי" → "מחק את החשבון". הפעולה דורשת אישור (הקלדת "מחק") ומוחקת לצמיתות את כל המידע, כולל ההקלטות.',
      },
      {
        q: 'אפשר להוריד את כל המידע שלי?',
        a: 'כן — מתוך הדשבורד → "הנתונים שלי" → "הורד את כל הנתונים". תקבל קובץ JSON עם כל המידע על החשבון והילדים.',
      },
      {
        q: 'האם הילד יכול להיכנס לבד?',
        a: 'לא. ReadRight מיועדת לשימוש על ידי הורה / מורה / אפוטרופוס מבוגר (18+) שיוצר פרופיל לילד. הילד עצמו לא נרשם — ההורה מנהל את החשבון בשבילו.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'תקלות נפוצות',
    icon: AlertTriangle,
    color: 'rust',
    items: [
      {
        q: 'הדף לא נטען / הצליל לא עובד',
        a: '(1) רענן את הדף (Ctrl+R או F5). (2) נסה דפדפן אחר. (3) ודא שהאינטרנט שלך עובד. (4) אם הבעיה נמשכת, כתוב לנו ל-hello@readright.app עם תיאור הבעיה והדפדפן שבו אתה משתמש.',
      },
      {
        q: 'איבדתי את הסיפורים שלי / ההקלטות שלי',
        a: 'אם מחקת את היסטוריית הדפדפן או נתוני האתר — ההקלטות והגיבויים המקומיים נמחקים לצמיתות. נתוני הקריאות (מטריקות) נשמרים אצלנו בענן ויחזרו אוטומטית כשתיכנס מחדש.',
      },
      {
        q: 'מה זה ניקוד? למה חלק מהמילים נראות מסובכות?',
        a: 'הניקוד הוא הסימנים הקטנים מתחת לאותיות (קמץ, פתח, חיריק וכו\'). הם עוזרים לילד לקרוא נכון את המילים, במיוחד בעברית שבה מילים יכולות להיקרא בכמה דרכים. כל הסיפורים שלנו עם ניקוד מלא.',
      },
      {
        q: 'איך פונים אליכם?',
        a: 'באימייל ל-hello@readright.app. נשתדל לחזור תוך 24 שעות.',
      },
    ],
  },
];

export default function Help({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('getting-started');

  // Filter FAQs by search
  const filtered = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return item.q.toLowerCase().includes(lower) || item.a.toLowerCase().includes(lower);
    }),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back */}
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
            <HelpCircle className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
              עזרה
            </div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              איך אפשר לעזור?
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: colors.textMuted }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש בשאלות נפוצות..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl text-base outline-none transition"
            style={{
              backgroundColor: colors.creamLight,
              border: `1.5px solid ${colors.border}`,
              color: colors.navy,
            }}
          />
        </div>

        {/* Quick links */}
        {!search && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <QuickLink
              icon={Mail}
              label="צור קשר"
              description="hello@readright.app"
              onClick={() => window.location.href = 'mailto:hello@readright.app'}
            />
            <QuickLink
              icon={Shield}
              label="מדיניות פרטיות"
              description="איך הנתונים שלך מוגנים"
              onClick={() => onNavigate('privacy')}
            />
          </div>
        )}

        {/* FAQ categories */}
        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: colors.creamLight }}>
            <div className="text-5xl mb-3">🤔</div>
            <p style={{ color: colors.textSecondary }}>לא נמצאה תוצאה ל-"{search}"</p>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
              נסה חיפוש אחר, או כתוב לנו ב-{' '}
              <a href="mailto:hello@readright.app" style={{ color: colors.rust, fontWeight: 700 }}>
                hello@readright.app
              </a>
            </p>
          </div>
        )}

        {filtered.map((category) => {
          const isOpen = expandedCategory === category.id || search.length > 0;
          const Icon = category.icon;
          const colorPalette = {
            sun: { bg: colors.sunLight, icon: colors.rust },
            rust: { bg: colors.rustLight, icon: colors.rust },
            green: { bg: colors.greenLight, icon: colors.green },
          }[category.color] || { bg: colors.sunLight, icon: colors.rust };

          return (
            <div
              key={category.id}
              className="rounded-2xl mb-3 overflow-hidden"
              style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => setExpandedCategory(isOpen ? null : category.id)}
                className="w-full p-5 flex items-center gap-3 text-right transition hover:bg-black/5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colorPalette.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: colorPalette.icon }} />
                </div>
                <div className="flex-1">
                  <div className="font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    {category.title}
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    {category.items.length} שאלות
                  </div>
                </div>
                <ChevronDown
                  className="w-5 h-5 transition"
                  style={{
                    color: colors.textMuted,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: colors.border }}>
                  {category.items.map((item, idx) => (
                    <FaqItem key={idx} question={item.q} answer={item.a} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer contact */}
        <div
          className="rounded-2xl p-5 mt-8 text-center"
          style={{ backgroundColor: colors.navy, color: colors.cream }}
        >
          <div className="font-black mb-2" style={{ fontFamily: fonts.display }}>
            לא מצאת את התשובה?
          </div>
          <p className="text-sm mb-4" style={{ color: 'rgba(250,246,239,0.8)' }}>
            נשמח לעזור. השתדל לחזור אליך תוך 24 שעות.
          </p>
          <a
            href="mailto:hello@readright.app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition hover:scale-105"
            style={{ backgroundColor: colors.sun, color: colors.navy }}
          >
            <Mail className="w-4 h-4" />
            כתוב לנו
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-right flex items-start justify-between gap-3"
      >
        <div className="text-sm font-bold flex-1" style={{ color: colors.navy }}>
          {question}
        </div>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 mt-1 transition"
          style={{
            color: colors.textMuted,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div className="text-sm mt-2 leading-relaxed" style={{ color: colors.textSecondary }}>
          {answer}
        </div>
      )}
    </div>
  );
}

function QuickLink({ icon: Icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl p-4 text-right transition hover:scale-105"
      style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
    >
      <Icon className="w-5 h-5 mb-2" style={{ color: colors.rust }} />
      <div className="font-bold text-sm" style={{ color: colors.navy }}>
        {label}
      </div>
      <div className="text-xs" style={{ color: colors.textMuted }}>
        {description}
      </div>
    </button>
  );
}
