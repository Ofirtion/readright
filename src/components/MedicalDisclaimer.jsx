// MedicalDisclaimer.jsx
// =================================
// Small inline disclaimer card. Used in:
//   - Dashboard (always visible, near AI insights)
//   - Landing page footer
// Important: ReadRight is NOT a diagnostic tool. We say so clearly.

import React from 'react';
import { Info } from 'lucide-react';
import { colors } from '../lib/theme';

export default function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div
        className="rounded-xl p-3 text-xs flex items-start gap-2"
        style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}
      >
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.textMuted }} />
        <div>
          התובנות באפליקציה אינדיקטיביות בלבד ואינן מהוות אבחון.
          לקשיי קריאה משמעותיים — מומלץ לפנות לקלינאית תקשורת או יועצת חינוכית.
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-3"
      style={{ backgroundColor: colors.creamDark, border: `1px solid ${colors.border}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: colors.cream }}
      >
        <Info className="w-5 h-5" style={{ color: colors.rust }} />
      </div>
      <div className="text-sm" style={{ color: colors.textSecondary, lineHeight: 1.6 }}>
        <div className="font-bold mb-1" style={{ color: colors.navy }}>
          הערה חשובה
        </div>
        <p>
          <strong>ReadRight אינה כלי אבחון רפואי או חינוכי.</strong>{' '}
          התובנות והמדדים שמופיעים כאן הם הערכה אינדיקטיבית בלבד, ואינם תחליף לאבחון מקצועי
          על ידי קלינאית תקשורת, פסיכולוג חינוכי, או יועצת חינוכית.
        </p>
        <p className="mt-2">
          אם הילד מתקשה בקריאה באופן עקבי לאורך זמן, ניתן לבדוק עם מומחה מוסמך.
        </p>
      </div>
    </div>
  );
}
