// MicrophoneTest.jsx — Diagnostic page for "the microphone isn't working"
// =================================
// This is the page you send a user to when they report a problem.
// It checks each piece of the audio stack and shows results visually.
// They can screenshot it and send back — instant debug info.
//
// Tested checks (in order):
//   1. Is the browser supported? (Chrome/Edge/Safari/Firefox detection)
//   2. Is the page on HTTPS? (required for getUserMedia in most browsers)
//   3. Does MediaDevices exist? (some embedded browsers lack it)
//   4. Does MediaRecorder exist? (iOS Safari < 14.3 doesn't have it)
//   5. Can we get microphone permission?
//   6. Which audio codecs does the browser support?
//   7. Live test: can we actually record 2 seconds of audio?
//   8. Did we receive any audio chunks?

import React, { useState, useRef } from 'react';
import { ArrowRight, Mic, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { colors, fonts } from '../lib/theme';

export default function MicrophoneTest({ onNavigate }) {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const streamRef = useRef(null);

  const runTests = async () => {
    setRunning(true);
    setResults(null);

    const checks = [];
    const ua = navigator.userAgent || '';

    // 1. Browser detection
    const isChrome = /Chrome/.test(ua) && !/Edg|OPR/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    const isFirefox = /Firefox|FxiOS/.test(ua);
    const isEdge = /Edg/.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);

    const browserName = isEdge ? 'Edge' : isChrome ? 'Chrome' : isSafari ? 'Safari' : isFirefox ? 'Firefox' : 'Unknown';
    const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop';

    checks.push({
      label: `דפדפן: ${browserName} (${platform})`,
      status: isFirefox ? 'warning' : 'ok',
      detail: isFirefox ? 'Firefox לא תומך בזיהוי דיבור עברי. נסה Chrome.' : null,
    });

    // 2. HTTPS check
    const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    checks.push({
      label: 'חיבור מאובטח (HTTPS)',
      status: isSecure ? 'ok' : 'fail',
      detail: isSecure ? null : 'הדף לא נטען דרך HTTPS. הדפדפן יחסום את המיקרופון.',
    });

    // 3. MediaDevices
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    checks.push({
      label: 'גישה למכשירי מדיה',
      status: hasMediaDevices ? 'ok' : 'fail',
      detail: hasMediaDevices ? null : 'הדפדפן לא תומך ב-getUserMedia. נסה דפדפן חדש יותר.',
    });

    // 4. MediaRecorder
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    checks.push({
      label: 'הקלטת אודיו (MediaRecorder)',
      status: hasMediaRecorder ? 'ok' : 'fail',
      detail: hasMediaRecorder ? null : 'הדפדפן לא תומך בהקלטה. iOS דורש Safari 14.3 ומעלה.',
    });

    // 5. SpeechRecognition (needed for the reading recognition itself)
    const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    checks.push({
      label: 'זיהוי דיבור (Web Speech API)',
      status: hasSR ? 'ok' : 'fail',
      detail: hasSR ? null : 'הדפדפן לא תומך בזיהוי דיבור. נסה Chrome או Safari.',
    });

    // 6. Codec support
    if (hasMediaRecorder) {
      const codecs = [
        { name: 'webm/opus', value: 'audio/webm;codecs=opus' },
        { name: 'webm', value: 'audio/webm' },
        { name: 'mp4 (iOS)', value: 'audio/mp4' },
        { name: 'ogg/opus', value: 'audio/ogg;codecs=opus' },
      ];
      const supportedCodecs = codecs.filter(c => MediaRecorder.isTypeSupported(c.value));
      checks.push({
        label: `codecs נתמכים: ${supportedCodecs.length > 0 ? supportedCodecs.map(c => c.name).join(', ') : 'אין'}`,
        status: supportedCodecs.length > 0 ? 'ok' : 'fail',
        detail: supportedCodecs.length === 0 ? 'אף codec לא נתמך. ההקלטה לא תעבוד.' : null,
      });
    }

    // 7. Permission + live recording test
    if (hasMediaDevices && hasMediaRecorder) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        checks.push({ label: 'גישה למיקרופון אושרה', status: 'ok' });

        // Try to record 2 seconds and see if data comes through
        const isIOSLocal = isIOS;
        const mimeOrder = isIOSLocal
          ? ['audio/mp4', 'audio/aac', '']
          : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', ''];
        const chosenMime = mimeOrder.find(m => m === '' || MediaRecorder.isTypeSupported(m));

        const recorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);
        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        let recorderError = null;
        recorder.onerror = (e) => { recorderError = e.error || e; };

        recorder.start(500);

        // Record for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        await new Promise(resolve => {
          recorder.addEventListener('stop', resolve, { once: true });
          try { recorder.stop(); } catch (e) { resolve(); }
        });

        if (recorderError) {
          checks.push({
            label: 'בדיקת הקלטה',
            status: 'fail',
            detail: 'הדפדפן זרק שגיאה בזמן הקלטה: ' + String(recorderError),
          });
        } else if (chunks.length === 0) {
          checks.push({
            label: 'בדיקת הקלטה',
            status: 'fail',
            detail: 'ההקלטה התחילה אבל לא הגיעו נתונים. ייתכן בעיה ב-codec.',
          });
        } else {
          const totalSize = chunks.reduce((s, c) => s + c.size, 0);
          checks.push({
            label: `בדיקת הקלטה הצליחה (${(totalSize / 1024).toFixed(1)}KB ב-2 שניות)`,
            status: 'ok',
          });
        }

        // Cleanup
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      } catch (err) {
        checks.push({
          label: 'גישה למיקרופון',
          status: 'fail',
          detail: err.name === 'NotAllowedError'
            ? 'הגישה נדחתה. אפשר מיקרופון בהגדרות הדפדפן.'
            : 'שגיאה: ' + err.message,
        });
      }
    }

    setResults({ checks, ua, time: new Date().toLocaleString('he-IL') });
    setRunning(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 mb-6 text-sm font-bold transition hover:gap-3"
          style={{ color: colors.navy }}
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.sunLight }}
          >
            <Mic className="w-7 h-7" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
              אבחון
            </div>
            <h1 className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              בדיקת מיקרופון
            </h1>
          </div>
        </div>

        <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
          הבדיקה תוודא שהמיקרופון, ההקלטה וזיהוי הדיבור עובדים במכשיר שלך.
          הבדיקה נמשכת כ-3 שניות.
        </p>

        {!results && !running && (
          <button
            onClick={runTests}
            className="w-full py-4 rounded-2xl text-base font-black transition hover:scale-105 flex items-center justify-center gap-3"
            style={{ backgroundColor: colors.navy, color: colors.sun }}
          >
            <Mic className="w-5 h-5" />
            התחל בדיקה
          </button>
        )}

        {running && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
          >
            <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" style={{ color: colors.rust }} />
            <div className="font-bold" style={{ color: colors.navy }}>בודק...</div>
            <div className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              אם המכשיר ביקש אישור למיקרופון — אשר.
            </div>
          </div>
        )}

        {results && (
          <div>
            {/* Summary */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                backgroundColor: results.checks.every(c => c.status === 'ok') ? colors.greenLight :
                  results.checks.some(c => c.status === 'fail') ? colors.rustLight : colors.sunLight,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                {results.checks.every(c => c.status === 'ok')
                  ? '✅ הכל עובד מצוין'
                  : results.checks.some(c => c.status === 'fail')
                    ? '❌ נמצאו בעיות'
                    : '⚠️ הכל עובד אבל יש אזהרות'}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                בדיקה התבצעה ב-{results.time}
              </div>
            </div>

            {/* Detailed checks */}
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
            >
              {results.checks.map((check, i) => {
                const Icon = check.status === 'ok' ? CheckCircle : check.status === 'fail' ? XCircle : AlertCircle;
                const iconColor = check.status === 'ok' ? colors.green : check.status === 'fail' ? colors.rust : colors.sun;
                return (
                  <div
                    key={i}
                    className="p-4 flex items-start gap-3"
                    style={{ borderTop: i > 0 ? `1px solid ${colors.border}` : 'none' }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{ color: colors.navy }}>
                        {check.label}
                      </div>
                      {check.detail && (
                        <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                          {check.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech info — for sending to support */}
            <details
              className="rounded-2xl p-4 text-xs"
              style={{ backgroundColor: colors.creamDark, color: colors.textMuted }}
            >
              <summary className="cursor-pointer font-bold" style={{ color: colors.navy }}>
                מידע טכני (לשליחה לתמיכה)
              </summary>
              <div className="mt-3 font-mono break-all" style={{ fontSize: '11px' }}>
                <div><strong>User-Agent:</strong> {results.ua}</div>
                <div className="mt-1"><strong>URL:</strong> {window.location.href}</div>
                <div className="mt-1"><strong>זמן:</strong> {results.time}</div>
              </div>
            </details>

            <div className="flex gap-3 mt-4">
              <button
                onClick={runTests}
                className="flex-1 py-3 rounded-full text-sm font-bold transition hover:scale-105"
                style={{ backgroundColor: colors.creamDark, color: colors.navy }}
              >
                בדוק שוב
              </button>
              <a
                href={`mailto:hello@readright.app?subject=דיווח בדיקת מיקרופון&body=${encodeURIComponent(
                  'תוצאות בדיקה:\n\n' +
                  results.checks.map(c => `${c.status === 'ok' ? '✅' : c.status === 'fail' ? '❌' : '⚠️'} ${c.label}${c.detail ? '\n   ' + c.detail : ''}`).join('\n') +
                  '\n\nUser-Agent: ' + results.ua +
                  '\nURL: ' + window.location.href +
                  '\nזמן: ' + results.time
                )}`}
                className="flex-1 py-3 rounded-full text-sm font-bold transition hover:scale-105 text-center"
                style={{ backgroundColor: colors.navy, color: colors.sun }}
              >
                שלח לתמיכה
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
