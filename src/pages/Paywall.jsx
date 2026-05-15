// Paywall.jsx — מסך paywall
// =================================
// Shown to restricted_free users when they try to read a story other than
// their selected one, or open a child profile other than their selected one.
// Strong visual + clear CTA to upgrade.

import React, { useEffect } from 'react';
import { Lock, Sparkles, Crown, ArrowRight, Check } from 'lucide-react';
import { colors, fonts } from '../lib/theme';
import { useSubscription } from '../lib/subscription';
import Layout from '../components/Layout';
import { trackPaywallHit } from '../lib/analytics';

export default function Paywall({ onNavigate, reason }) {
  const sub = useSubscription();

  useEffect(() => {
    trackPaywallHit({ reason: reason || 'unknown' });
  }, [reason]);

  // Different message per blocking reason
  const messages = {
    extra_story: {
      title: 'הסיפור הזה נעול 🔒',
      subtitle: 'בתוכנית החינמית, יש לך גישה לסיפור אחד.',
    },
    extra_child: {
      title: 'הילד הזה נעול 🔒',
      subtitle: 'בתוכנית החינמית, יש לך גישה לפרופיל ילד אחד.',
    },
    custom_story: {
      title: 'יצירת סיפורים מותאמים — Premium',
      subtitle: 'יצירת סיפורים אישיים זמינה ב-Premium בלבד.',
    },
    default: {
      title: 'הפיצ\'ר הזה נעול 🔒',
      subtitle: 'התוכנית החינמית מציעה גישה מצומצמת.',
    },
  };

  const msg = messages[reason] || messages.default;

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Lock icon hero */}
        <div className="relative inline-block mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.sunLight }}
          >
            <Lock className="w-10 h-10" style={{ color: colors.rust }} />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.sun }}
          >
            <Sparkles className="w-5 h-5" style={{ color: colors.navy }} />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
          {msg.title}
        </h1>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: colors.textSecondary }}>
          {msg.subtitle} שדרג ל-Premium כדי לפתוח את כל הפיצ'רים.
        </p>

        {/* What you unlock with premium */}
        <div
          className="rounded-3xl p-8 mb-8 text-right"
          style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Crown className="w-6 h-6" style={{ color: colors.sun }} />
            <div>
              <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
                Premium משפחתי
              </div>
              <div className="text-2xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                מ-₪33 לחודש
              </div>
            </div>
          </div>

          <ul className="space-y-3">
            {[
              'גישה מלאה לכל 16 הסיפורים',
              'עד 3 ילדים בחשבון',
              'יצירת סיפורים מותאמים אישית',
              'ייבוא תוכן מטקסט / URL / קובץ',
              'דוחות שבועיים במייל',
              'תמיכה מהירה',
            ].map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.navy }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: colors.green }} />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => onNavigate('pricing')}
            className="px-8 py-4 rounded-full text-base font-black transition hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.sun, color: colors.navy }}
          >
            <Sparkles className="w-4 h-4" />
            ראה תוכניות ומחירים
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-4 rounded-full text-base font-bold transition hover:scale-105"
            style={{ backgroundColor: 'transparent', color: colors.navy, border: `1.5px solid ${colors.border}` }}
          >
            חזרה לתוכן הנגיש
          </button>
        </div>

        <p className="text-xs" style={{ color: colors.textMuted }}>
          תוכל לבטל בכל עת · 30 ימים החזר כספי מלא
        </p>
      </div>
    </Layout>
  );
}
