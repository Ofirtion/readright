// achievements.js
// =================================
// Streaks and badges, calculated from the existing reading_sessions data.
// We don't store separate streak/badge state — it's derived on read.
// This means: no state sync issues, no migration headaches.

import { Star, Trophy, Flame, BookOpen, Zap, Award, Crown, Heart, Sparkles, Target } from 'lucide-react';

// ============================================
// STREAK CALCULATION
// ============================================
// A "day with reading" = at least one session that day in the child's local time.
// A "streak" = N consecutive days, ending today or yesterday (we forgive
// a single missed day if today still has time to recover).

function dayKey(date) {
  const d = new Date(date);
  // Use child's local time. Format: YYYY-MM-DD
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calculateStreak(sessions) {
  if (!sessions || sessions.length === 0) {
    return { current: 0, longest: 0, daysReadEver: 0, lastReadDate: null };
  }

  // Build set of unique days when the child read
  const daysRead = new Set();
  for (const s of sessions) {
    if (s.created_at) daysRead.add(dayKey(s.created_at));
  }
  const sortedDays = Array.from(daysRead).sort(); // ascending

  // Current streak: count back from today (or yesterday if not yet today)
  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  let current = 0;
  let cursor = daysRead.has(today) ? today : (daysRead.has(yesterday) ? yesterday : null);

  while (cursor && daysRead.has(cursor)) {
    current++;
    // Step back one day
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = dayKey(d);
  }

  // Longest streak: scan through all days
  let longest = 0;
  let runLength = 0;
  let prev = null;
  for (const day of sortedDays) {
    if (prev === null) {
      runLength = 1;
    } else {
      const diff = Math.round((new Date(day) - new Date(prev)) / (1000 * 60 * 60 * 24));
      runLength = diff === 1 ? runLength + 1 : 1;
    }
    longest = Math.max(longest, runLength);
    prev = day;
  }

  return {
    current,
    longest,
    daysReadEver: daysRead.size,
    lastReadDate: sortedDays[sortedDays.length - 1] || null,
  };
}

// ============================================
// BADGES
// ============================================
// Each badge is a small achievement. We compute earned badges from sessions.
// Categories: milestones (count-based), streaks, performance, consistency.

const BADGE_DEFINITIONS = [
  // Milestones (story count)
  {
    id: 'first_story',
    title: 'הצעד הראשון',
    description: 'סיימת את הסיפור הראשון שלך!',
    icon: 'Star',
    color: 'sun',
    check: (ctx) => ctx.totalCompleted >= 1,
  },
  {
    id: 'five_stories',
    title: 'קורא בכיף',
    description: 'סיימת 5 סיפורים',
    icon: 'BookOpen',
    color: 'green',
    check: (ctx) => ctx.totalCompleted >= 5,
  },
  {
    id: 'ten_stories',
    title: 'קורא מנוסה',
    description: 'סיימת 10 סיפורים',
    icon: 'Award',
    color: 'rust',
    check: (ctx) => ctx.totalCompleted >= 10,
  },
  {
    id: 'twenty_stories',
    title: 'קורא אלוף',
    description: 'סיימת 20 סיפורים — וואו!',
    icon: 'Trophy',
    color: 'rust',
    check: (ctx) => ctx.totalCompleted >= 20,
  },
  {
    id: 'fifty_stories',
    title: 'אלוף הקריאה',
    description: 'סיימת 50 סיפורים. אגדה!',
    icon: 'Crown',
    color: 'sun',
    check: (ctx) => ctx.totalCompleted >= 50,
  },

  // Streak badges
  {
    id: 'streak_3',
    title: 'תחילת רצף',
    description: '3 ימים ברצף',
    icon: 'Flame',
    color: 'rust',
    check: (ctx) => ctx.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'שבוע מלא',
    description: '7 ימים ברצף — סנסציה!',
    icon: 'Flame',
    color: 'rust',
    check: (ctx) => ctx.longestStreak >= 7,
  },
  {
    id: 'streak_14',
    title: 'שבועיים ברצף',
    description: '14 ימים — את/ה לא עוצר/ת!',
    icon: 'Zap',
    color: 'sun',
    check: (ctx) => ctx.longestStreak >= 14,
  },
  {
    id: 'streak_30',
    title: 'חודש שלם',
    description: '30 ימים ברצף — נדיר!',
    icon: 'Sparkles',
    color: 'sun',
    check: (ctx) => ctx.longestStreak >= 30,
  },

  // Performance badges
  {
    id: 'first_perfect',
    title: 'קריאה מושלמת',
    description: 'קראת סיפור בדיוק 100%',
    icon: 'Target',
    color: 'green',
    check: (ctx) => ctx.bestAccuracy >= 100,
  },
  {
    id: 'high_accuracy',
    title: 'דייקנות גבוהה',
    description: 'הגעת ל-95% דיוק בקריאה',
    icon: 'Target',
    color: 'green',
    check: (ctx) => ctx.bestAccuracy >= 95,
  },
  {
    id: 'fast_reader',
    title: 'קורא/ת מהיר/ה',
    description: 'הגעת ל-100 WCPM',
    icon: 'Zap',
    color: 'sun',
    check: (ctx) => ctx.bestWcpm >= 100,
  },

  // Time / consistency
  {
    id: 'hour_total',
    title: 'שעה של קריאה',
    description: 'הצטברו 60 דקות של קריאה',
    icon: 'Heart',
    color: 'rust',
    check: (ctx) => ctx.totalMinutes >= 60,
  },
  {
    id: 'three_hours',
    title: '3 שעות בסך הכל',
    description: 'הצטברו 180 דקות',
    icon: 'Heart',
    color: 'rust',
    check: (ctx) => ctx.totalMinutes >= 180,
  },
];

const ICON_MAP = {
  Star, Trophy, Flame, BookOpen, Zap, Award, Crown, Heart, Sparkles, Target,
};

export function computeBadges(sessions) {
  if (!sessions || sessions.length === 0) {
    return BADGE_DEFINITIONS.map((b) => ({ ...b, Icon: ICON_MAP[b.icon], earned: false }));
  }

  const streakInfo = calculateStreak(sessions);
  const completed = sessions.filter((s) => s.completed);
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

  const ctx = {
    totalCompleted: completed.length,
    longestStreak: streakInfo.longest,
    currentStreak: streakInfo.current,
    bestAccuracy: sessions.reduce((max, s) => Math.max(max, s.accuracy || 0), 0),
    bestWcpm: sessions.reduce((max, s) => Math.max(max, s.wcpm || 0), 0),
    totalMinutes: Math.floor(totalSeconds / 60),
  };

  return BADGE_DEFINITIONS.map((b) => ({
    ...b,
    Icon: ICON_MAP[b.icon],
    earned: b.check(ctx),
  }));
}

// Returns only earned badges
export function getEarnedBadges(sessions) {
  return computeBadges(sessions).filter((b) => b.earned);
}

// Detect a badge that was JUST earned in the latest session
// (used to show a celebration popup at end of reading)
export function getNewlyEarnedBadge(allSessions, latestSession) {
  if (!allSessions || allSessions.length === 0) return null;

  // Compute badges WITH and WITHOUT the latest session
  const earnedAfter = new Set(getEarnedBadges(allSessions).map((b) => b.id));
  const sessionsBefore = allSessions.filter((s) => s.id !== latestSession.id);
  const earnedBefore = new Set(getEarnedBadges(sessionsBefore).map((b) => b.id));

  // The "new" badge is the one earned after but not before
  const newId = [...earnedAfter].find((id) => !earnedBefore.has(id));
  if (!newId) return null;

  return computeBadges(allSessions).find((b) => b.id === newId);
}
