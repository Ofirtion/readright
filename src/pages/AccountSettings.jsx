// AccountSettings.jsx — מסך החשבון של ההורה
// =================================
// Where they see their plan, days left, next charge date, and can:
//   - Upgrade (if trial or restricted)
//   - Cancel (if premium)
//   - Switch monthly ↔ yearly (premium)

import React, { useState } from 'react';
import { CreditCard, Calendar, Crown, AlertTriangle, ArrowRight, CheckCircle2, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import {
  useSubscription,
  mockCancelSubscription,
} from '../lib/subscription';
import Layout from '../components/Layout';

export default function AccountSettings({ onNavigate }) {
  const { user, getChildren } = useAuth();
  const sub = useSubscription();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const childrenList = getChildren();

  const handleCancel = async () => {
    setCancelling(true);
    // Mock: in production, this calls Stripe to cancel-at-period-end
    await new Promise((resolve) => setTimeout(resolve, 800));
    mockCancelSubscription();
    setShowCancelConfirm(false);
    setCancelling(false);
  };

  // Format ISO date as Hebrew date string
  const fmtDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="text-xs font-bold tracking-wider mb-2" style={{ color: colors.rust }}>
            ההגדרות שלך
          </div>
          <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
            ניהול חשבון
          </h1>
        </div>

        {/* Plan card */}
        <div
          className="rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{
            backgroundColor: sub.isPremium ? colors.navy : colors.creamLight,
            border: `1px solid ${sub.isPremium ? colors.navy : colors.border}`,
            color: sub.isPremium ? colors.cream : colors.navy,
          }}
        >
          {/* Decorative orb for premium */}
          {sub.isPremium && (
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colors.sun} 0%, transparent 70%)` }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs font-bold tracking-wider mb-2" style={{ color: sub.isPremium ? colors.sun : colors.rust }}>
                  התוכנית הנוכחית
                </div>
                <div className="flex items-center gap-3 mb-2">
                  {sub.isPremium && <Crown className="w-7 h-7" style={{ color: colors.sun }} />}
                  {sub.isTrial && <Clock className="w-7 h-7" style={{ color: colors.rust }} />}
                  {sub.isRestricted && <AlertTriangle className="w-7 h-7" style={{ color: colors.textMuted }} />}
                  <h2 className="text-3xl font-black" style={{ fontFamily: fonts.display }}>
                    {sub.label}
                  </h2>
                </div>
                {sub.isTrial && (
                  <p style={{ color: 'inherit', opacity: 0.85 }}>
                    תהנה מכל הפיצ'רים במשך ה-{sub.daysLeftInTrial} הימים הקרובים.
                  </p>
                )}
                {sub.isPremium && (
                  <p style={{ color: 'rgba(250,246,239,0.85)' }}>
                    גישה מלאה לכל הסיפורים, עד 3 ילדים, ללא הגבלה.
                  </p>
                )}
                {sub.isRestricted && (
                  <p style={{ color: colors.textSecondary }}>
                    תקופת הניסיון הסתיימה. שדרג כדי לפתוח את כל הסיפורים והילדים שוב.
                  </p>
                )}
              </div>
            </div>

            {/* Premium details */}
            {sub.isPremium && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Stat
                  label="חיוב הבא"
                  value={fmtDate(sub.raw?.nextRenewalAt) || '—'}
                  premium
                />
                <Stat
                  label="סוג חיוב"
                  value={sub.plan === 'premium_monthly' ? 'חודשי · ₪49' : 'שנתי · ₪399'}
                  premium
                />
              </div>
            )}

            {sub.raw?.cancelledAt && sub.isPremium && (
              <div
                className="rounded-2xl p-4 mb-6 flex items-start gap-3"
                style={{ backgroundColor: 'rgba(245,165,36,0.15)', border: `1px solid ${colors.sun}` }}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.sun }} />
                <div className="text-sm">
                  <strong>המנוי בוטל.</strong> תמשיך/י לקבל גישה מלאה עד {fmtDate(sub.raw.nextRenewalAt)}. אחרי תאריך זה, החשבון יעבור למצב חינמי.
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {(sub.isTrial || sub.isRestricted) && (
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-6 py-3 rounded-full text-sm font-black transition hover:scale-105 flex items-center gap-2"
                  style={{ backgroundColor: colors.sun, color: colors.navy }}
                >
                  <Sparkles className="w-4 h-4" />
                  שדרג ל-Premium
                </button>
              )}

              {sub.isPremium && !sub.raw?.cancelledAt && (
                <>
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-5 py-2.5 rounded-full text-sm font-bold transition hover:scale-105"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.cream, border: `1px solid rgba(255,255,255,0.3)` }}
                  >
                    שנה תוכנית
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-5 py-2.5 rounded-full text-sm font-bold transition"
                    style={{ backgroundColor: 'transparent', color: 'rgba(250,246,239,0.6)', textDecoration: 'underline' }}
                  >
                    בטל מנוי
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cancel confirm */}
        {showCancelConfirm && (
          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: colors.creamLight, border: `2px solid ${colors.rust}` }}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: colors.rust }} />
              <div>
                <h3 className="font-black text-lg mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  לבטל את המנוי?
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  תמשיך/י לקבל גישה מלאה עד <strong>{fmtDate(sub.raw?.nextRenewalAt)}</strong>. אחרי זה, החשבון יעבור למצב חינמי
                  (ילד אחד, סיפור אחד). הנתונים של שאר הילדים יישמרו, ויפתחו שוב כשתשדרג בחזרה.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-3 rounded-full text-sm font-bold transition disabled:opacity-50"
                style={{ backgroundColor: colors.rust, color: colors.cream }}
              >
                {cancelling ? 'מבטל...' : 'אשר ביטול'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelling}
                className="px-6 py-3 rounded-full text-sm font-bold transition"
                style={{ backgroundColor: 'transparent', color: colors.navy, border: `1.5px solid ${colors.border}` }}
              >
                ביטול
              </button>
            </div>
          </div>
        )}

        {/* Usage summary */}
        <div
          className="rounded-3xl p-6 mb-6"
          style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
        >
          <h3 className="font-black text-lg mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
            השימוש שלך
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="ילדים בחשבון" value={`${childrenList.length} / ${sub.maxChildren}`} />
            <Stat label="חשבון נוצר" value={fmtDate(user?.created_at) || '—'} />
          </div>
        </div>

        {/* Payment info — mock for now */}
        {sub.isPremium && (
          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
                פרטי תשלום
              </h3>
              <button
                className="text-sm font-bold flex items-center gap-1"
                style={{ color: colors.rust }}
                onClick={() => alert('בגרסת הפרודקשן יפתח Stripe Customer Portal לעדכון הכרטיס')}
              >
                עדכן <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: colors.cream }}>
              <CreditCard className="w-5 h-5" style={{ color: colors.navy }} />
              <div className="text-sm">
                <div className="font-bold" style={{ color: colors.navy }}>•••• •••• •••• 4242</div>
                <div className="text-xs" style={{ color: colors.textMuted }}>תאריך תפוגה: 12/27</div>
              </div>
            </div>
            <div className="text-xs mt-3" style={{ color: colors.textMuted }}>
              💡 בגרסת mock — אין כרטיס אמיתי. בפרודקשן ינוהל דרך Stripe Customer Portal.
            </div>
          </div>
        )}

        {/* Help links */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: colors.creamDark }}>
          <div className="text-sm font-bold mb-3" style={{ color: colors.navy }}>
            צריך עזרה?
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="mailto:hello@readright.app" className="underline" style={{ color: colors.rust, fontWeight: 700 }}>
              ✉️ צור קשר
            </a>
            <span style={{ color: colors.textMuted }}>·</span>
            <button onClick={() => onNavigate('privacy')} className="underline" style={{ color: colors.rust, fontWeight: 700 }}>
              מדיניות פרטיות
            </button>
            <span style={{ color: colors.textMuted }}>·</span>
            <button onClick={() => onNavigate('terms')} className="underline" style={{ color: colors.rust, fontWeight: 700 }}>
              תנאי שימוש
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value, premium }) {
  return (
    <div>
      <div className="text-xs font-bold tracking-wider mb-1" style={{ color: premium ? 'rgba(250,246,239,0.6)' : colors.textMuted }}>
        {label}
      </div>
      <div className="text-base font-black" style={{ color: premium ? colors.cream : colors.navy }}>
        {value}
      </div>
    </div>
  );
}
