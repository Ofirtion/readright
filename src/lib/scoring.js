// scoring.js
// =================================
// The brain behind the Progress Dashboard.
// Computes reading KPIs from raw session data and generates natural-language
// insights for parents.
//
// PHILOSOPHY:
//   - "Improvement" is dual-timeframe: since-start (motivational) + selected period (actionable)
//   - "Score" is verbal not numeric (avoid score-anxiety for kids)
//   - All thresholds are evidence-informed but not benchmarked against other kids
//   - Insights are written in warm, parent-friendly Hebrew
//
// SESSION SHAPE (from AuthContext.addSession):
//   {
//     id, child_id, story_id,
//     created_at,        // ISO date string
//     duration_seconds,  // active reading time
//     total_words,       // words in the story
//     correct_words,
//     wrong_words,
//     skipped_words,
//     accuracy,          // 0-100
//     wcpm,              // words correct per minute
//     hints_used,
//     completed,         // bool: did the child finish the story
//   }

// ============================================
// AGE-APPROPRIATE WCPM TARGETS
// ============================================
// Based on the Hasbrouck-Tindal Oral Reading Fluency Norms (50th percentile,
// end of year). We use these only as a "soft target" for the Fluency metric.
// Not as a benchmark to compare a child against — only against themselves.
const WCPM_TARGETS = {
  6: 53,   // Grade 1
  7: 89,   // Grade 2
  8: 107,  // Grade 3
  9: 123,  // Grade 4
  10: 139, // Grade 5
  11: 150, // Grade 6
  12: 150, // 6+ plateau
};

function targetWcpmForAge(age) {
  if (!age) return 100;
  if (age < 6) return 53;
  if (age >= 12) return 150;
  return WCPM_TARGETS[age] || 100;
}

// ============================================
// PERIOD FILTERING
// ============================================

// Returns sessions within a [startDate, endDate] range (inclusive)
function filterByDateRange(sessions, startDate, endDate) {
  return sessions.filter((s) => {
    if (!s.created_at) return false;
    const d = new Date(s.created_at);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  });
}

// Convert period key to date range
export function getPeriodDateRange(period) {
  const now = new Date();
  const end = now;
  let start;
  switch (period) {
    case '7d':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      start = null; // no lower bound
  }
  return { start, end };
}

// ============================================
// 4 CORE METRICS
// ============================================

// (1) FLUENCY — WCPM relative to age target
// Returns: { current, baseline, periodStart, target, percent }
function computeFluency(sessions, baseline, periodStartSessions, age) {
  const target = targetWcpmForAge(age);
  if (sessions.length === 0) return null;

  const recent = sessions.slice(-5); // average of last 5 sessions
  const currentWcpm = avg(recent.map((s) => s.wcpm || 0));
  const baselineWcpm = baseline.length > 0 ? avg(baseline.map((s) => s.wcpm || 0)) : 0;
  const periodStartWcpm = periodStartSessions.length > 0
    ? avg(periodStartSessions.map((s) => s.wcpm || 0))
    : currentWcpm;

  return {
    current: Math.round(currentWcpm),
    baseline: Math.round(baselineWcpm),
    periodStart: Math.round(periodStartWcpm),
    target,
    percentOfTarget: target > 0 ? Math.round((currentWcpm / target) * 100) : 0,
  };
}

// (2) ACCURACY — % correct words
function computeAccuracy(sessions, baseline, periodStartSessions) {
  if (sessions.length === 0) return null;
  const recent = sessions.slice(-5);
  return {
    current: Math.round(avg(recent.map((s) => s.accuracy || 0))),
    baseline: baseline.length > 0 ? Math.round(avg(baseline.map((s) => s.accuracy || 0))) : 0,
    periodStart: periodStartSessions.length > 0
      ? Math.round(avg(periodStartSessions.map((s) => s.accuracy || 0)))
      : Math.round(avg(recent.map((s) => s.accuracy || 0))),
  };
}

// (3) CONSISTENCY — distinct days with at least 1 session in the period
function computeConsistency(sessions, period) {
  if (sessions.length === 0) return null;
  const dayKeys = new Set();
  sessions.forEach((s) => {
    if (s.created_at) {
      const d = new Date(s.created_at);
      dayKeys.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }
  });
  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : null;
  const activeDays = dayKeys.size;
  return {
    activeDays,
    periodDays,
    percent: periodDays ? Math.min(100, Math.round((activeDays / periodDays) * 100)) : null,
  };
}

// (4) STORIES COMPLETED — counts
function computeStoriesCompleted(sessions, baseline) {
  return {
    inPeriod: sessions.filter((s) => s.completed).length,
    sinceStart: baseline.length + sessions.filter((s) => s.completed).length,
  };
}

// ============================================
// COMPOSITE "IMPROVEMENT SCORE"
// ============================================
// User asked for "± since start with optional period override"
// We compute BOTH:
//   - sinceStart (the default, always positive, motivational)
//   - inPeriod (real movement during the selected window — can be negative)

function computeImprovement(metric, sessions, baseline, periodStartSessions) {
  // Returns: { sinceStart: +X%, inPeriod: ±Y%, verbalLabel, color }

  let currentValue, baselineValue, periodStartValue;

  switch (metric) {
    case 'fluency':
      currentValue = sessions.length > 0 ? avg(sessions.slice(-5).map((s) => s.wcpm || 0)) : 0;
      baselineValue = baseline.length > 0 ? avg(baseline.map((s) => s.wcpm || 0)) : 0;
      periodStartValue = periodStartSessions.length > 0 ? avg(periodStartSessions.map((s) => s.wcpm || 0)) : currentValue;
      break;
    case 'accuracy':
      currentValue = sessions.length > 0 ? avg(sessions.slice(-5).map((s) => s.accuracy || 0)) : 0;
      baselineValue = baseline.length > 0 ? avg(baseline.map((s) => s.accuracy || 0)) : 0;
      periodStartValue = periodStartSessions.length > 0 ? avg(periodStartSessions.map((s) => s.accuracy || 0)) : currentValue;
      break;
    default:
      return null;
  }

  const sinceStartPct = baselineValue > 0
    ? Math.round(((currentValue - baselineValue) / baselineValue) * 100)
    : 0;
  const inPeriodPct = periodStartValue > 0
    ? Math.round(((currentValue - periodStartValue) / periodStartValue) * 100)
    : 0;

  return { sinceStart: sinceStartPct, inPeriod: inPeriodPct };
}

// ============================================
// OVERALL VERBAL LABEL
// ============================================
// Avoid "score: 87" anxiety. Map metrics to verbal levels.

export function getOverallLevel(metrics) {
  if (!metrics.fluency || !metrics.accuracy) {
    return { label: 'מתחילים', color: 'sun', emoji: '🌱' };
  }
  const acc = metrics.accuracy.current;
  const flu = metrics.fluency.percentOfTarget;
  const composite = (acc * 0.5) + (flu * 0.5);

  if (composite >= 90) return { label: 'מעולה', color: 'green', emoji: '⭐' };
  if (composite >= 75) return { label: 'בדרך טובה', color: 'green', emoji: '🌟' };
  if (composite >= 60) return { label: 'מתקדמים יפה', color: 'sun', emoji: '✨' };
  if (composite >= 40) return { label: 'בונים בסיס', color: 'sun', emoji: '🌱' };
  return { label: 'בתחילת הדרך', color: 'rust', emoji: '🚀' };
}

// ============================================
// COMMON ERRORS (for clinician)
// ============================================
// Aggregates "wrong words" across sessions to find patterns.

export function computeCommonErrors(sessions, topN = 8) {
  const errorCounts = new Map();
  const errorContexts = new Map(); // word → list of (heard) attempts

  sessions.forEach((s) => {
    // Sessions store error details under either:
    //   - errors_detail: [{ type, word, heard }]  (current format from Reading.jsx)
    //   - word_errors:   [{ expected, heard }]    (legacy format, just in case)
    // We accept either to be defensive.
    const errorList = s.errors_detail || s.word_errors || [];
    errorList.forEach((err) => {
      if (!err) return;
      const expected = err.word || err.expected;
      const heard = err.heard;
      if (!expected) return;
      errorCounts.set(expected, (errorCounts.get(expected) || 0) + 1);
      if (heard) {
        const list = errorContexts.get(expected) || [];
        list.push(heard);
        errorContexts.set(expected, list);
      }
    });
  });

  return Array.from(errorCounts.entries())
    .map(([word, count]) => ({
      word,
      count,
      attempts: errorContexts.get(word) || [],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

// ============================================
// AI INSIGHTS (rule-based, not actual AI)
// ============================================
// Returns 3-5 natural-language insights for the parent.
// We deliberately rotate positive + neutral + actionable so it doesn't
// feel like a report card.

export function generateInsights(metrics, periodLabel) {
  const insights = [];

  // 1. Fluency change
  if (metrics.fluency && metrics.fluency.baseline > 0) {
    const change = metrics.fluency.current - metrics.fluency.baseline;
    const pct = Math.round((change / metrics.fluency.baseline) * 100);
    if (pct >= 20) {
      insights.push({
        type: 'celebrate',
        icon: '🎉',
        text: `שטף הקריאה השתפר ב-${pct}% מאז ההתחלה. זה הישג משמעותי.`,
      });
    } else if (pct >= 5) {
      insights.push({
        type: 'positive',
        icon: '📈',
        text: `שטף הקריאה עלה ב-${pct}% מאז שהתחלת. המשך כך.`,
      });
    } else if (pct < -10) {
      insights.push({
        type: 'attention',
        icon: '👀',
        text: `שטף הקריאה ירד ב-${Math.abs(pct)}% מאז ההתחלה. אולי הסיפורים האחרונים קשים מדי?`,
      });
    }
  }

  // 2. Accuracy state
  if (metrics.accuracy) {
    const acc = metrics.accuracy.current;
    if (acc >= 95) {
      insights.push({
        type: 'celebrate',
        icon: '🎯',
        text: `דיוק קריאה ${acc}% — הילד/ה קורא/ת נכון כמעט תמיד. אפשר לעלות רמה.`,
      });
    } else if (acc < 70) {
      insights.push({
        type: 'attention',
        icon: '⚠️',
        text: `דיוק קריאה ${acc}% — הסיפורים אולי קשים מדי. שווה לרדת רמה זמנית.`,
      });
    } else if (acc >= 85) {
      insights.push({
        type: 'positive',
        icon: '✅',
        text: `דיוק קריאה ${acc}% — רמה טובה. נמשיך בקצב הזה.`,
      });
    }
  }

  // 3. Consistency
  if (metrics.consistency && metrics.consistency.percent !== null) {
    const c = metrics.consistency;
    if (c.percent >= 80) {
      insights.push({
        type: 'celebrate',
        icon: '🔥',
        text: `קרא/ה ב-${c.activeDays} מתוך ${c.periodDays} ימים. התמדה מצוינת.`,
      });
    } else if (c.percent < 30) {
      insights.push({
        type: 'attention',
        icon: '📅',
        text: `קרא/ה ב-${c.activeDays} ימים בלבד בתקופה הזו. ניסיון יומי קצר עדיף על מפגשים ארוכים נדירים.`,
      });
    }
  }

  // 4. Stories completed
  if (metrics.storiesCompleted && metrics.storiesCompleted.inPeriod > 0) {
    const n = metrics.storiesCompleted.inPeriod;
    const since = metrics.storiesCompleted.sinceStart;
    insights.push({
      type: 'info',
      icon: '📚',
      text: `סיים/ה ${n} סיפורים ב${periodLabel}. ${since} סיפורים מאז ההתחלה.`,
    });
  }

  // 5. Hints usage
  if (metrics.avgHintsPerStory !== undefined) {
    if (metrics.avgHintsPerStory > 5) {
      insights.push({
        type: 'attention',
        icon: '💡',
        text: `ממוצע של ${Math.round(metrics.avgHintsPerStory)} רמזים בכל סיפור — אולי הרמה גבוהה מדי.`,
      });
    } else if (metrics.avgHintsPerStory < 1 && metrics.fluency && metrics.fluency.current > 50) {
      insights.push({
        type: 'positive',
        icon: '💪',
        text: `קורא/ת כמעט בלי רמזים. סימן שהחומר ברמה הנכונה.`,
      });
    }
  }

  return insights.slice(0, 5);
}

// ============================================
// MAIN ENTRY POINT
// ============================================
// Returns the complete computed report for a given child + period.
export function computeProgress(allSessions, period = 'all', childAge = 8) {
  // Sort sessions chronologically
  const sorted = [...allSessions]
    .filter((s) => s.created_at)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Baseline: first 3 sessions ever (these define "the starting point")
  const baseline = sorted.slice(0, 3);

  // Period range
  const { start, end } = getPeriodDateRange(period);
  const inPeriod = filterByDateRange(sorted, start, end);

  // For "change-during-period", we compare the first 1/4 of period sessions
  // to the last 1/4 — but only if there are enough sessions to be meaningful
  let periodStartSessions = [];
  if (inPeriod.length >= 4) {
    const quarterCount = Math.max(1, Math.floor(inPeriod.length / 4));
    periodStartSessions = inPeriod.slice(0, quarterCount);
  }

  // Compute each metric
  const fluency = computeFluency(inPeriod.length > 0 ? inPeriod : sorted, baseline, periodStartSessions, childAge);
  const accuracy = computeAccuracy(inPeriod.length > 0 ? inPeriod : sorted, baseline, periodStartSessions);
  const consistency = computeConsistency(inPeriod, period);
  const storiesCompleted = computeStoriesCompleted(inPeriod, baseline);

  // Hints metric (used for an insight)
  const sessionsForHints = inPeriod.length > 0 ? inPeriod : sorted;
  const avgHintsPerStory = sessionsForHints.length > 0
    ? sessionsForHints.reduce((sum, s) => sum + (s.hints_used || 0), 0) / sessionsForHints.length
    : 0;

  // Improvement
  const fluencyImprovement = computeImprovement('fluency', sorted, baseline, periodStartSessions);
  const accuracyImprovement = computeImprovement('accuracy', sorted, baseline, periodStartSessions);

  const metrics = {
    fluency,
    accuracy,
    consistency,
    storiesCompleted,
    avgHintsPerStory,
    fluencyImprovement,
    accuracyImprovement,
  };

  // Overall verbal label
  const overall = getOverallLevel(metrics);

  // AI insights
  const periodLabels = {
    '7d': 'שבוע האחרון',
    '30d': 'חודש האחרון',
    '90d': '3 החודשים האחרונים',
    'year': 'מאז תחילת השנה',
    'all': 'כל התקופה',
  };
  const insights = generateInsights(metrics, periodLabels[period] || 'בתקופה זו');

  // Common errors (for clinician section)
  const commonErrors = computeCommonErrors(inPeriod);

  return {
    period,
    periodLabel: periodLabels[period] || 'כל התקופה',
    childAge,
    totalSessions: sorted.length,
    sessionsInPeriod: inPeriod.length,
    sessionsForCharts: inPeriod.length >= 2 ? inPeriod : sorted,
    metrics,
    overall,
    insights,
    commonErrors,
    baseline: {
      sessionsCount: baseline.length,
      startDate: baseline[0]?.created_at,
    },
  };
}

// ============================================
// TIME SERIES (for charts)
// ============================================
// Build daily aggregates for a line chart.
export function buildTimeSeries(sessions) {
  if (sessions.length === 0) return [];

  // Group by day
  const byDay = new Map();
  sessions.forEach((s) => {
    if (!s.created_at) return;
    const d = new Date(s.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const list = byDay.get(key) || [];
    list.push(s);
    byDay.set(key, list);
  });

  return Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, list]) => ({
      date,
      wcpm: Math.round(avg(list.map((s) => s.wcpm || 0))),
      accuracy: Math.round(avg(list.map((s) => s.accuracy || 0))),
      storiesCount: list.filter((s) => s.completed).length,
      sessionsCount: list.length,
    }));
}

// ============================================
// UTIL
// ============================================
function avg(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

export const PERIODS = [
  { key: '7d', label: '7 ימים' },
  { key: '30d', label: '30 ימים' },
  { key: '90d', label: '90 ימים' },
  { key: 'year', label: 'השנה' },
  { key: 'all', label: 'מאז ההתחלה' },
];
