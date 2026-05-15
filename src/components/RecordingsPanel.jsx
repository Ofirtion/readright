// RecordingsPanel.jsx
// =================================
// Shown only in the parent dashboard, lists all audio recordings for one child.
// Per the product spec: only the parent can hear recordings; the child cannot
// access this panel. Storage is "unlimited" — we show usage so the parent knows.

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Trash2, Mic, HardDrive, Calendar, Volume2, Download } from 'lucide-react';
import { colors, fonts } from '../lib/theme';
import {
  getRecordingsForChild,
  getRecording,
  getRecordingPlaybackUrl,
  deleteRecording,
  getStorageUsage,
  formatBytes,
  formatDuration,
} from '../lib/audioStorage';

export default function RecordingsPanel({ childId, childName }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0); // 0-100
  const audioRef = useRef(null);
  const currentUrlRef = useRef(null);

  // Load recordings on mount and when childId changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [recs, bytes] = await Promise.all([
          getRecordingsForChild(childId),
          getStorageUsage(childId),
        ]);
        if (!cancelled) {
          setRecordings(recs);
          setUsage(bytes);
        }
      } catch (err) {
        console.error('Could not load recordings:', err);
        if (!cancelled) setRecordings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [childId]);

  // Clean up object URLs when unmounting
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async (recording) => {
    // If clicking the currently-playing one → pause
    if (playingId === recording.id && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return;
    }

    // Otherwise: stop any current playback, then start this one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    try {
      const url = await getRecordingPlaybackUrl(recording.id);
      if (!url) {
        console.warn('No URL for recording', recording.id);
        return;
      }
      currentUrlRef.current = url;

      const audio = new Audio(url);
      audio.addEventListener('timeupdate', () => {
        if (audio.duration > 0) {
          setPlayProgress((audio.currentTime / audio.duration) * 100);
        }
      });
      audio.addEventListener('ended', () => {
        setPlayingId(null);
        setPlayProgress(0);
        if (currentUrlRef.current) {
          URL.revokeObjectURL(currentUrlRef.current);
          currentUrlRef.current = null;
        }
      });
      audio.addEventListener('error', () => {
        console.error('Audio playback error');
        setPlayingId(null);
        setPlayProgress(0);
      });

      audioRef.current = audio;
      setPlayingId(recording.id);
      setPlayProgress(0);
      audio.play();
    } catch (err) {
      console.error('Could not play recording:', err);
      setPlayingId(null);
    }
  };

  const handleDownload = async (recording) => {
    try {
      const rec = await getRecording(recording.id);
      if (!rec || !rec.blob) return;

      // Build a friendly filename: "story-title__2025-05-12.webm"
      // We use WebM since that's what we recorded. Most modern players handle it.
      // (Converting to MP3 in-browser would need WASM ffmpeg, ~25MB — overkill for now.)
      const dateStr = new Date(rec.createdAt).toISOString().slice(0, 10);
      const safeTitle = (rec.storyTitle || 'recording')
        .replace(/[/\\?%*:|"<>]/g, '-') // strip filesystem-unsafe chars
        .substring(0, 50);
      const ext = (rec.mimeType || 'audio/webm').includes('mp4') ? 'm4a' : 'webm';
      const filename = `readright_${safeTitle}_${dateStr}.${ext}`;

      const url = URL.createObjectURL(rec.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      alert('שגיאה בהורדת ההקלטה: ' + err.message);
    }
  };

  const handleDelete = async (recording) => {
    const confirmed = window.confirm(
      `למחוק את ההקלטה של "${recording.storyTitle}" מ-${formatRelativeDate(recording.createdAt)}?\n\nפעולה זו אינה הפיכה.`
    );
    if (!confirmed) return;

    // If this one is currently playing, stop it
    if (playingId === recording.id && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
    }

    try {
      await deleteRecording(recording.id);
      // Refresh list
      const [recs, bytes] = await Promise.all([
        getRecordingsForChild(childId),
        getStorageUsage(childId),
      ]);
      setRecordings(recs);
      setUsage(bytes);
    } catch (err) {
      alert('שגיאה במחיקת ההקלטה: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl p-8 mb-8" style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}>
        <div className="text-center py-6" style={{ color: colors.textMuted }}>
          טוען הקלטות...
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="rounded-3xl p-8 mb-8" style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-4 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.border }}
          >
            <Mic className="w-5 h-5" style={{ color: colors.textMuted }} />
          </div>
          <div>
            <div className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
              הקלטות הקריאה
            </div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              עדיין אין הקלטות של {childName}.
              כל קריאה תישמר אוטומטית מהקריאה הבאה.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-6 mb-8"
      style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.rustLight }}
          >
            <Mic className="w-5 h-5" style={{ color: colors.rust }} />
          </div>
          <div>
            <div className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
              הקלטות הקריאה ({recordings.length})
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>
              נשמר באופן פרטי במחשב שלך · רק את/ה שומע/ת
            </div>
          </div>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textMuted }}>
            <HardDrive className="w-3 h-3" />
            <span>{formatBytes(usage)}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {recordings.map((rec) => {
          const isPlaying = playingId === rec.id;
          return (
            <div
              key={rec.id}
              className="flex items-center gap-3 p-3 rounded-2xl transition"
              style={{
                backgroundColor: isPlaying ? colors.sunLight : colors.cream,
                border: `1px solid ${isPlaying ? colors.sun : 'transparent'}`,
              }}
            >
              {/* Play button */}
              <button
                onClick={() => handlePlayPause(rec)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition hover:scale-105 flex-shrink-0"
                style={{
                  backgroundColor: isPlaying ? colors.rust : colors.navy,
                  color: colors.cream,
                }}
                aria-label={isPlaying ? 'השהה' : 'נגן'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5" />}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold text-sm truncate"
                  style={{ color: colors.navy, fontFamily: fonts.display }}
                >
                  {rec.storyTitle}
                </div>
                <div
                  className="flex items-center gap-3 text-xs mt-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatRelativeDate(rec.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    {formatDuration(rec.duration)}
                  </span>
                  <span style={{ color: colors.textMuted }}>
                    {formatBytes(rec.size)}
                  </span>
                </div>
                {/* Progress bar (only when playing) */}
                {isPlaying && (
                  <div
                    className="mt-2 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${playProgress}%`,
                        backgroundColor: colors.rust,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Download button */}
              <button
                onClick={() => handleDownload(rec)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-110 flex-shrink-0"
                style={{ color: colors.textSecondary, backgroundColor: colors.creamDark }}
                aria-label="הורד הקלטה"
                title="הורד הקלטה לשיתוף עם קלינאית"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(rec)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-red-50 flex-shrink-0"
                style={{ color: colors.textMuted }}
                aria-label="מחק הקלטה"
                title="מחק הקלטה"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        className="mt-4 pt-4 text-xs"
        style={{ color: colors.textMuted, borderTop: `1px solid ${colors.border}` }}
      >
        💡 ההקלטות נשמרות במחשב שלך בלבד. ניתן להוריד הקלטה כקובץ ולשתף עם קלינאית תקשורת בוואטסאפ או אימייל.
      </div>
    </div>
  );
}

// Format an ISO date as a relative Hebrew label.
function formatRelativeDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'כרגע';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  // Fallback to absolute date in Hebrew
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
