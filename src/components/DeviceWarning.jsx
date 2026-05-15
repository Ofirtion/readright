// DeviceWarning.jsx
// =================================
// Banner shown when the user is on a device where speech recognition
// is known to be unreliable (currently: Android Chrome, Firefox anywhere).
//
// Dismissable per-session — we don't nag, but we make sure the user knows.
//
// Where it's used: top of Landing, top of Home, top of Reading page.

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, X, Mail } from 'lucide-react';
import { colors, fonts } from '../lib/theme';
import { detectDevice, getDeviceWarningMessage } from '../lib/deviceDetect';

const DISMISS_KEY = 'readright_device_warning_dismissed_v1';

export default function DeviceWarning({ context = 'default', onSendToDesktop }) {
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    setMessage(getDeviceWarningMessage());
    setDevice(detectDevice());
    // We use sessionStorage so the warning re-appears in a new session
    // (helpful for long-lived tabs that the user later returns to).
    try {
      const d = sessionStorage.getItem(DISMISS_KEY);
      if (d === '1') setDismissed(true);
    } catch {}
  }, []);

  if (!message || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  const handleSendToDesktop = async () => {
    // Build a "continue on desktop" link that they can email/text themselves
    const url = window.location.href;
    const subject = encodeURIComponent('פתח את ReadRight במחשב');
    const body = encodeURIComponent(
      `שלום!\n\nכדי לפתוח את ReadRight במחשב נייח, לחץ על הקישור:\n\n${url}\n\n` +
      `מומלץ להשתמש ב-Chrome או Edge לחוויה הטובה ביותר.`
    );

    // Try Web Share API first (modern mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ReadRight',
          text: 'פתח את האפליקציה במחשב נייח לחוויה מיטבית',
          url,
        });
        return;
      } catch (e) {
        // user cancelled or share failed — fall back to mailto
      }
    }
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const bgColor = message.severity === 'error' ? colors.rustLight :
    message.severity === 'warning' ? colors.sunLight : colors.creamDark;
  const borderColor = message.severity === 'error' ? colors.rust :
    message.severity === 'warning' ? colors.sun : colors.border;

  return (
    <div
      className="rounded-2xl p-4 mb-4 relative"
      style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-black/10"
        style={{ color: colors.textMuted }}
        aria-label="סגור"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pl-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <Smartphone className="w-5 h-5" style={{ color: colors.rust }} />
        </div>

        <div className="flex-1">
          <div className="font-black text-sm mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
            {message.title}
          </div>
          <div className="text-sm mb-3 leading-relaxed" style={{ color: colors.textSecondary }}>
            {message.body}
          </div>

          {message.severity !== 'error' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSendToDesktop}
                className="px-4 py-2 rounded-full text-xs font-bold transition hover:scale-105 flex items-center gap-2"
                style={{ backgroundColor: colors.navy, color: colors.sun }}
              >
                <Mail className="w-3.5 h-3.5" />
                שלח קישור למחשב
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-full text-xs font-bold transition"
                style={{ backgroundColor: 'transparent', color: colors.navy, border: `1px solid ${colors.border}` }}
              >
                המשך בכל זאת
              </button>
            </div>
          )}

          {/* Test microphone link — gives them a way to see exactly what's wrong */}
          <div className="mt-3 text-xs">
            <a
              href="?test"
              className="underline"
              style={{ color: colors.rust, fontWeight: 700 }}
            >
              בדוק את המכשיר שלי
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
