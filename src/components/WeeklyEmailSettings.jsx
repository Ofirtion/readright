// WeeklyEmailPreview - shows parents what their weekly summary email will look like
// In production, this same HTML will be sent via Resend/SendGrid every Sunday morning.

import React, { useState } from 'react';
import { Mail, X, Bell, Check, AlertCircle } from 'lucide-react';
import { colors, fonts } from '../lib/theme';

export default function WeeklyEmailSettings({ child, sessions, parentEmail }) {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem(`weekly_email_${child.id}`);
    return saved === null ? true : saved === 'true';
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleToggle = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    localStorage.setItem(`weekly_email_${child.id}`, String(newVal));
  };

  // Get last 7 days of sessions
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekSessions = sessions.filter(s => new Date(s.created_at) >= oneWeekAgo);

  // Compute weekly metrics
  const weekMinutes = Math.round(weekSessions.reduce((s, x) => s + (x.duration_seconds || 0), 0) / 60);
  const weekWcpm = weekSessions.length > 0
    ? Math.round(weekSessions.reduce((s, x) => s + (x.wcpm || 0), 0) / weekSessions.length)
    : 0;
  const weekAccuracy = weekSessions.length > 0
    ? Math.round(weekSessions.reduce((s, x) => s + (x.accuracy || 0), 0) / weekSessions.length)
    : 0;

  return (
    <>
      {/* Settings panel */}
      <div className="rounded-3xl p-6 mb-8 flex items-center gap-4" style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: enabled ? colors.navy : colors.border }}
        >
          <Mail className="w-5 h-5" style={{ color: enabled ? colors.sun : colors.textMuted }} />
        </div>
        <div className="flex-1">
          <div className="font-black mb-0.5" style={{ color: colors.navy, fontFamily: fonts.display }}>
            סיכום שבועי במייל
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {enabled
              ? `סיכום על ההתקדמות של ${child.name} יישלח אליך כל יום ראשון בבוקר`
              : 'המייל השבועי כבוי כרגע'}
          </div>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="text-xs font-bold px-3 py-2 rounded-full transition hover:scale-105"
          style={{ color: colors.navy, border: `1px solid ${colors.border}` }}
        >
          תצוגה מקדימה
        </button>
        <button
          onClick={handleToggle}
          className="relative w-12 h-7 rounded-full transition"
          style={{ backgroundColor: enabled ? colors.green : colors.border }}
        >
          <div
            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform"
            style={{ right: enabled ? '0.125rem' : '1.375rem' }}
          />
        </button>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(26, 43, 74, 0.5)' }}
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: colors.border, backgroundColor: 'white' }}>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>תצוגה מקדימה של המייל השבועי</div>
                <div className="text-sm font-bold" style={{ color: colors.navy }}>אל: {parentEmail || 'parent@example.com'}</div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email content — designed like an actual email */}
            <div className="p-8" style={{ backgroundColor: colors.cream }}>
              {/* Email header */}
              <div className="text-center mb-8 pb-6" style={{ borderBottom: `2px solid ${colors.border}` }}>
                <div className="text-3xl mb-2">📚</div>
                <div className="text-xs font-bold tracking-widest mb-1" style={{ color: colors.rust }}>READRIGHT</div>
                <h1 className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  סיכום השבוע
                </h1>
                <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                  ההתקדמות של {child.name} בשבוע האחרון
                </p>
              </div>

              {/* Greeting */}
              <p className="text-base leading-relaxed mb-6" style={{ color: colors.navy }}>
                שלום,<br />
                הנה סיכום מהיר על ההתקדמות של <strong>{child.name}</strong> בשבוע האחרון.
                {weekSessions.length > 0 ? ' היו קריאות נהדרות!' : ' השבוע לא היו קריאות.'}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'white', border: `1px solid ${colors.border}` }}>
                  <div className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    {weekSessions.length}
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>קריאות</div>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'white', border: `1px solid ${colors.border}` }}>
                  <div className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    {weekMinutes}<span className="text-base"> דק׳</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>זמן קריאה</div>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'white', border: `1px solid ${colors.border}` }}>
                  <div className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    {weekWcpm}
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>WCPM ממוצע</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: colors.sunLight }}>
                <div className="font-black mb-3 flex items-center gap-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  ✨ הדגשי השבוע
                </div>
                <ul className="space-y-2 text-sm" style={{ color: colors.navy }}>
                  {weekSessions.length >= 3 && (
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.green }} />
                      <span>{child.name} קרא/ה {weekSessions.length} סיפורים השבוע — התמדה מצוינת!</span>
                    </li>
                  )}
                  {weekAccuracy >= 85 && (
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.green }} />
                      <span>דיוק ממוצע של {weekAccuracy}% — קריאה מדויקת ומהירה</span>
                    </li>
                  )}
                  {weekWcpm > 60 && (
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.green }} />
                      <span>שטף קריאה של {weekWcpm} מילים בדקה — מעולה לרמה {child.reading_level}</span>
                    </li>
                  )}
                  {weekSessions.length === 0 && (
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.rust }} />
                      <span>השבוע לא היו קריאות — שווה לעודד את {child.name} לחזור</span>
                    </li>
                  )}
                  {weekSessions.length > 0 && weekSessions.length < 3 && (
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.sun }} />
                      <span>קצב סולידי. נסו לכוון ל-3-4 קריאות בשבוע לתוצאות מקסימליות</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* AI recommendation */}
              <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: 'white', border: `1px solid ${colors.border}` }}>
                <div className="text-xs font-bold mb-2" style={{ color: colors.rust }}>המלצה מותאמת</div>
                <p className="text-sm leading-relaxed" style={{ color: colors.navy }}>
                  {weekAccuracy >= 90
                    ? `${child.name} מוכן/ה כנראה לעבור לרמה ${Math.min(child.reading_level + 1, 5)}. נסו סיפור חדש מהרמה הבאה השבוע.`
                    : weekAccuracy < 70 && weekSessions.length >= 3
                      ? `הדיוק של ${child.name} השתפר אבל עדיין יש מילים מאתגרות. כדאי לחזור על סיפורים שכבר קראתם, או לעבור זמנית לרמה קלה יותר לבניית ביטחון.`
                      : `המשיכו עם הקצב הנוכחי — ההתקדמות של ${child.name} יציבה ומעודדת.`}
                </p>
              </div>

              {/* CTA */}
              <div className="text-center">
                <a className="inline-block px-8 py-3 rounded-full font-bold text-sm" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                  צפה בדשבורד המלא →
                </a>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 text-xs" style={{ color: colors.textMuted, borderTop: `1px solid ${colors.border}` }}>
                <p>קיבלת את המייל הזה כי הפעלת התראות שבועיות עבור {child.name}</p>
                <p className="mt-1">
                  <a className="underline">ביטול התראות</a>
                  {' • '}
                  <a className="underline">הגדרות</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
