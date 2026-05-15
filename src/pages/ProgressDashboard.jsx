// ProgressDashboard.jsx — KPI dashboard with insights and PDF export
// =================================
// The "show your child's progress" page. Designed for two audiences
// simultaneously:
//   - Parents (top half): big verbal score, simple metrics, insights
//   - Clinicians (bottom half, optional reveal): error patterns, raw data
//
// Period selector: 7d / 30d / 90d / year / all-time
// Default: "מאז ההתחלה" (since first session) — per user spec.

import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowRight, TrendingUp, TrendingDown, Minus, Target, Zap, Calendar,
  BookOpen, Download, Sparkles, AlertTriangle, ChevronDown, ChevronUp,
  FileText, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import { computeProgress, buildTimeSeries, PERIODS } from '../lib/scoring';
import Layout from '../components/Layout';

export default function ProgressDashboard({ onNavigate, childId }) {
  const { getChild, getSessions } = useAuth();
  const child = getChild(childId);
  const allSessions = getSessions(childId);

  // Default period: "all" (since beginning) per user request
  const [period, setPeriod] = useState('all');
  const [showClinical, setShowClinical] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Compute the report (memoized — depends only on sessions + period)
  const report = useMemo(
    () => computeProgress(allSessions, period, child?.age || 8),
    [allSessions, period, child?.age]
  );

  // Time series for the big chart
  const timeSeries = useMemo(
    () => buildTimeSeries(report.sessionsForCharts || []),
    [report.sessionsForCharts]
  );

  // Hidden ref for the printable area (used by PDF export)
  const printRef = useRef(null);

  // Empty state
  if (!child) {
    return (
      <Layout onNavigate={onNavigate} showBack>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p style={{ color: colors.textSecondary }}>הילד/ה לא נמצא/ה.</p>
        </div>
      </Layout>
    );
  }

  if (allSessions.length === 0) {
    return (
      <Layout onNavigate={onNavigate} showBack>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
            עדיין אין נתונים
          </h1>
          <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
            {child.name} צריך/ה לקרוא לפחות סיפור אחד כדי שנוכל להציג התקדמות.
          </p>
          <button
            onClick={() => onNavigate('story-library', { childId })}
            className="px-6 py-3 rounded-full text-base font-bold transition hover:scale-105"
            style={{ backgroundColor: colors.navy, color: colors.sun }}
          >
            לספרייה
          </button>
        </div>
      </Layout>
    );
  }

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      // Lazy-load to avoid 70KB+ in the main bundle for users who never export
      const { exportProgressReport } = await import('../lib/reportPdf');
      await exportProgressReport({ child, report, timeSeries });
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('אירעה שגיאה ביצירת הדו"ח. נסה שוב.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-5xl mx-auto px-6 py-8" ref={printRef}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-xs font-bold tracking-wider mb-1" style={{ color: colors.rust }}>
              דוח התקדמות
            </div>
            <h1 className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              ההתקדמות של {child.name}
            </h1>
            <div className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              {report.totalSessions} קריאות בסך הכל · {report.sessionsInPeriod} ב{report.periodLabel}
            </div>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: colors.rust, color: colors.cream }}
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                מייצר...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                ייצא PDF
              </>
            )}
          </button>
        </div>

        {/* Period selector */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap"
                style={{
                  backgroundColor: period === p.key ? colors.navy : colors.creamLight,
                  color: period === p.key ? colors.sun : colors.navy,
                  border: `1.5px solid ${period === p.key ? colors.navy : colors.border}`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overall verbal score card */}
        <OverallCard overall={report.overall} report={report} />

        {/* 4 metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FluencyCard metric={report.metrics.fluency} improvement={report.metrics.fluencyImprovement} />
          <AccuracyCard metric={report.metrics.accuracy} improvement={report.metrics.accuracyImprovement} />
          <ConsistencyCard metric={report.metrics.consistency} periodLabel={report.periodLabel} />
          <StoriesCard metric={report.metrics.storiesCompleted} periodLabel={report.periodLabel} />
        </div>

        {/* Big chart */}
        {timeSeries.length >= 2 && (
          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
          >
            <h3 className="font-black text-lg mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
              מגמת התקדמות
            </h3>
            <p className="text-xs mb-4" style={{ color: colors.textMuted }}>
              שטף קריאה ודיוק לאורך זמן
            </p>
            <DualLineChart data={timeSeries} />
          </div>
        )}

        {/* Insights */}
        {report.insights.length > 0 && (
          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: colors.navy, color: colors.cream }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: colors.sun }} />
              <h3 className="font-black text-lg" style={{ fontFamily: fonts.display }}>
                תובנות
              </h3>
            </div>
            <div className="space-y-3">
              {report.insights.map((insight, i) => (
                <InsightRow key={i} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Clinician section — collapsible */}
        {report.commonErrors.length > 0 && (
          <div
            className="rounded-3xl overflow-hidden mb-6"
            style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
          >
            <button
              onClick={() => setShowClinical(!showClinical)}
              className="w-full p-5 flex items-center justify-between text-right transition hover:bg-black/5"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" style={{ color: colors.rust }} />
                <div>
                  <div className="font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    מידע לאיש מקצוע
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    {showClinical ? 'הסתר' : 'דפוסי טעויות וטבלאות לקלינאית'}
                  </div>
                </div>
              </div>
              {showClinical ? (
                <ChevronUp className="w-5 h-5" style={{ color: colors.textMuted }} />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: colors.textMuted }} />
              )}
            </button>

            {showClinical && (
              <div className="px-5 pb-5 border-t" style={{ borderColor: colors.border }}>
                <CommonErrorsTable errors={report.commonErrors} />
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <div
          className="rounded-2xl p-4 text-xs text-center"
          style={{ backgroundColor: colors.creamDark, color: colors.textMuted }}
        >
          💡 הדוח מבוסס על {report.totalSessions} קריאות שנעשו דרך ReadRight.
          האפליקציה אינה כלי אבחון רפואי — המדדים נועדים למעקב יומיומי בלבד.
        </div>
      </div>
    </Layout>
  );
}

// ============================================
// OVERALL CARD — big verbal score
// ============================================
function OverallCard({ overall, report }) {
  const colorMap = {
    green: { bg: colors.greenLight, fg: colors.green, dark: colors.green },
    sun: { bg: colors.sunLight, fg: colors.rust, dark: colors.sun },
    rust: { bg: colors.rustLight, fg: colors.rust, dark: colors.rust },
  };
  const palette = colorMap[overall.color] || colorMap.sun;

  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
      style={{ backgroundColor: palette.bg, border: `1.5px solid ${palette.dark}` }}
    >
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-7xl md:text-8xl">{overall.emoji}</div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-xs font-bold tracking-wider mb-1" style={{ color: palette.fg }}>
            רמה כללית
          </div>
          <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
            {overall.label}
          </div>
          {report.metrics.fluencyImprovement && (
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              <strong style={{ color: palette.fg }}>
                {report.metrics.fluencyImprovement.sinceStart >= 0 ? '+' : ''}
                {report.metrics.fluencyImprovement.sinceStart}%
              </strong>{' '}
              בשטף הקריאה מאז ההתחלה
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// METRIC CARDS
// ============================================
function FluencyCard({ metric, improvement }) {
  if (!metric) return <EmptyMetric label="שטף קריאה" />;
  return (
    <MetricCard
      icon={Zap}
      label="שטף קריאה"
      value={metric.current}
      unit="WCPM"
      subtitle={`יעד גיל: ${metric.target}`}
      improvement={improvement}
      progressPercent={metric.percentOfTarget}
    />
  );
}

function AccuracyCard({ metric, improvement }) {
  if (!metric) return <EmptyMetric label="דיוק" />;
  return (
    <MetricCard
      icon={Target}
      label="דיוק קריאה"
      value={metric.current}
      unit="%"
      subtitle="אחוז מילים נכונות"
      improvement={improvement}
      progressPercent={metric.current}
    />
  );
}

function ConsistencyCard({ metric, periodLabel }) {
  if (!metric) return <EmptyMetric label="התמדה" />;
  return (
    <MetricCard
      icon={Calendar}
      label="התמדה"
      value={metric.activeDays}
      unit={metric.periodDays ? `מ-${metric.periodDays} ימים` : 'ימים פעילים'}
      subtitle={`קריאות ב${periodLabel}`}
      progressPercent={metric.percent}
    />
  );
}

function StoriesCard({ metric, periodLabel }) {
  return (
    <MetricCard
      icon={BookOpen}
      label="סיפורים שהושלמו"
      value={metric.inPeriod}
      unit={metric.inPeriod === 1 ? 'סיפור' : 'סיפורים'}
      subtitle={`${metric.sinceStart} מאז ההתחלה`}
    />
  );
}

function MetricCard({ icon: Icon, label, value, unit, subtitle, improvement, progressPercent }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: colors.rust }} />
        <div className="text-xs font-bold tracking-wider" style={{ color: colors.textMuted }}>
          {label}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-4xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
          {value}
        </div>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          {unit}
        </div>
      </div>

      <div className="text-xs mb-3" style={{ color: colors.textMuted }}>
        {subtitle}
      </div>

      {improvement && (
        <div className="space-y-1.5">
          <ImprovementRow label="מאז ההתחלה" value={improvement.sinceStart} />
          {improvement.inPeriod !== improvement.sinceStart && (
            <ImprovementRow label="בתקופה הנבחרת" value={improvement.inPeriod} muted />
          )}
        </div>
      )}

      {progressPercent !== undefined && progressPercent !== null && !improvement && (
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.cream }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(100, progressPercent)}%`,
              backgroundColor: progressPercent >= 80 ? colors.green : progressPercent >= 50 ? colors.sun : colors.rust,
            }}
          />
        </div>
      )}
    </div>
  );
}

function EmptyMetric({ label }) {
  return (
    <div
      className="rounded-3xl p-5 flex items-center justify-center"
      style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}`, minHeight: '140px' }}
    >
      <div className="text-center text-sm" style={{ color: colors.textMuted }}>
        {label} — עדיין אין מספיק נתונים
      </div>
    </div>
  );
}

function ImprovementRow({ label, value, muted }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const TrendIcon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const color = isPositive ? colors.green : isNeutral ? colors.textMuted : colors.rust;
  return (
    <div className="flex items-center justify-between gap-2 text-xs" style={{ opacity: muted ? 0.7 : 1 }}>
      <span style={{ color: colors.textMuted }}>{label}</span>
      <div className="flex items-center gap-1 font-black" style={{ color }}>
        <TrendIcon className="w-3 h-3" />
        {isPositive ? '+' : ''}{value}%
      </div>
    </div>
  );
}

// ============================================
// CHART — dual-line for WCPM + Accuracy
// ============================================
function DualLineChart({ data }) {
  if (data.length < 2) return null;

  const W = 600;
  const H = 240;
  const PAD = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // X-axis: day index (0 to length-1)
  const xStep = chartW / Math.max(1, data.length - 1);

  // Y-axis: WCPM (left, 0 to maxWcpm), Accuracy (right, 0-100)
  const maxWcpm = Math.max(50, ...data.map((d) => d.wcpm));
  const yScaleWcpm = (v) => chartH - (v / maxWcpm) * chartH;
  const yScaleAcc = (v) => chartH - (v / 100) * chartH;

  // Build SVG path strings
  const wcpmPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScaleWcpm(d.wcpm)}`)
    .join(' ');
  const accPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScaleAcc(d.accuracy)}`)
    .join(' ');

  // Axis grid lines (4 horizontals)
  const gridY = [0, 0.25, 0.5, 0.75, 1].map((p) => chartH * p);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '240px' }}>
        <g transform={`translate(${PAD.left}, ${PAD.top})`}>
          {/* Grid */}
          {gridY.map((y, i) => (
            <line
              key={i}
              x1="0"
              x2={chartW}
              y1={y}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

          {/* WCPM line */}
          <path
            d={wcpmPath}
            stroke={colors.navy}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accuracy line */}
          <path
            d={accPath}
            stroke={colors.rust}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 3"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={i * xStep} cy={yScaleWcpm(d.wcpm)} r="3.5" fill={colors.navy} />
              <circle cx={i * xStep} cy={yScaleAcc(d.accuracy)} r="3.5" fill={colors.rust} />
            </g>
          ))}

          {/* Y-axis labels — WCPM (left) */}
          <text x="-8" y="0" textAnchor="end" fontSize="10" fill={colors.textMuted}>
            {maxWcpm}
          </text>
          <text x="-8" y={chartH + 4} textAnchor="end" fontSize="10" fill={colors.textMuted}>
            0
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5" style={{ backgroundColor: colors.navy }} />
          <span style={{ color: colors.textSecondary }}>שטף (WCPM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5" style={{ backgroundColor: colors.rust, borderTop: `1px dashed ${colors.rust}` }} />
          <span style={{ color: colors.textSecondary }}>דיוק (%)</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// INSIGHT ROW
// ============================================
function InsightRow({ insight }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-2xl flex-shrink-0">{insight.icon}</div>
      <div className="flex-1 text-sm leading-relaxed" style={{ color: 'rgba(250,246,239,0.95)' }}>
        {insight.text}
      </div>
    </div>
  );
}

// ============================================
// COMMON ERRORS TABLE
// ============================================
function CommonErrorsTable({ errors }) {
  return (
    <div className="mt-4">
      <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
        מילים שחזרו על עצמן כקשות. שימושי לזיהוי דפוסים (לדוגמה: בלבול בין אותיות דומות).
      </p>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.cream }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: colors.creamDark }}>
              <th className="text-right p-3 font-bold" style={{ color: colors.navy }}>המילה</th>
              <th className="text-right p-3 font-bold" style={{ color: colors.navy }}>פעמים</th>
              <th className="text-right p-3 font-bold" style={{ color: colors.navy }}>נקרא בטעות כ</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${colors.border}` }}>
                <td className="p-3 font-bold" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  {err.word}
                </td>
                <td className="p-3" style={{ color: colors.textSecondary }}>
                  {err.count}
                </td>
                <td className="p-3 text-xs" style={{ color: colors.textMuted }}>
                  {err.attempts.length > 0 ? err.attempts.slice(0, 3).join(', ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
