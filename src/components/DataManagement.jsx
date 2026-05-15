// DataManagement.jsx
// =================================
// GDPR-style "manage my data" panel for the parent dashboard.
// Two actions:
//   1. Download all my data as JSON
//   2. Delete my account + all data (with double confirm)

import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { colors, fonts } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import { downloadAllUserData, deleteAllUserData } from '../lib/dataExport';

export default function DataManagement({ onNavigate }) {
  const { signOut } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadResult, setDownloadResult] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadResult(null);
    try {
      const result = await downloadAllUserData();
      setDownloadResult({ ok: true, ...result });
    } catch (err) {
      setDownloadResult({ ok: false, error: err.message });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText.trim() !== 'מחק') return;
    setDeleting(true);
    try {
      await deleteAllUserData();
      await signOut();
      // Signed-out state will redirect to Landing via App.jsx auth gates
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message);
      setDeleting(false);
    }
  };

  return (
    <div
      className="rounded-3xl p-6 mb-8"
      style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.greenLight }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: colors.green }} />
        </div>
        <div>
          <div className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
            הנתונים שלך
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            יש לך שליטה מלאה על המידע שלך
          </div>
        </div>
      </div>

      {/* Download */}
      <div
        className="rounded-2xl p-5 mb-3 flex items-start gap-4"
        style={{ backgroundColor: colors.cream }}
      >
        <Download className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.navy }} />
        <div className="flex-1">
          <div className="font-bold mb-1" style={{ color: colors.navy }}>
            הורד את כל הנתונים שלך
          </div>
          <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
            תקבל קובץ JSON עם כל המידע: הפרופיל שלך, פרופילי הילדים, כל היסטוריית הקריאות,
            הסיפורים שיצרת, וכל הנתונים הסטטיסטיים.
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: colors.navy, color: colors.sun }}
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                מכין קובץ...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                הורד עכשיו
              </>
            )}
          </button>
          {downloadResult && downloadResult.ok && (
            <div className="mt-3 text-xs" style={{ color: colors.green }}>
              ✓ הקובץ הורד: {downloadResult.filename}
            </div>
          )}
          {downloadResult && !downloadResult.ok && (
            <div className="mt-3 text-xs" style={{ color: colors.rust }}>
              שגיאה: {downloadResult.error}
            </div>
          )}
        </div>
      </div>

      {/* Delete account */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ backgroundColor: colors.cream, border: `1px solid ${colors.rustLight}` }}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.rust }} />
        <div className="flex-1">
          <div className="font-bold mb-1" style={{ color: colors.navy }}>
            מחק את החשבון ואת כל הנתונים
          </div>
          <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
            פעולה זו תמחק לצמיתות: את הפרופיל שלך, כל פרופילי הילדים, כל היסטוריית הקריאות,
            כל ההקלטות, וכל הסיפורים המותאמים. הפעולה <strong>אינה הפיכה</strong>.
          </div>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2"
              style={{ backgroundColor: 'transparent', color: colors.rust, border: `1.5px solid ${colors.rust}` }}
            >
              <Trash2 className="w-4 h-4" />
              ברצוני למחוק את החשבון
            </button>
          ) : (
            <div
              className="mt-2 p-4 rounded-xl"
              style={{ backgroundColor: colors.rustLight }}
            >
              <div className="text-sm font-bold mb-3" style={{ color: colors.navy }}>
                אחרון: כדי לאשר, הקלד <strong style={{ color: colors.rust }}>מחק</strong> בתיבה
              </div>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="הקלד: מחק"
                className="w-full px-4 py-2.5 rounded-xl text-base outline-none mb-3"
                style={{
                  backgroundColor: colors.cream,
                  border: `1.5px solid ${colors.border}`,
                  color: colors.navy,
                  fontFamily: fonts.display,
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText.trim() !== 'מחק' || deleting}
                  className="px-4 py-2 rounded-full text-sm font-bold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ backgroundColor: colors.rust, color: colors.cream }}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      מוחק...
                    </>
                  ) : (
                    'מחק הכל לצמיתות'
                  )}
                </button>
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteConfirmText(''); }}
                  disabled={deleting}
                  className="px-4 py-2 rounded-full text-sm font-bold transition"
                  style={{ backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.border}` }}
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with policy links */}
      <div
        className="mt-5 pt-4 text-xs flex flex-wrap items-center gap-4"
        style={{ color: colors.textMuted, borderTop: `1px solid ${colors.border}` }}
      >
        <button onClick={() => onNavigate('privacy')} className="hover:underline" style={{ color: colors.rust, fontWeight: 700 }}>
          מדיניות פרטיות
        </button>
        <span>·</span>
        <button onClick={() => onNavigate('terms')} className="hover:underline" style={{ color: colors.rust, fontWeight: 700 }}>
          תנאי שימוש
        </button>
        <span>·</span>
        <a href="mailto:privacy@readright.app" className="hover:underline" style={{ color: colors.rust, fontWeight: 700 }}>
          ליצירת קשר
        </a>
      </div>
    </div>
  );
}
