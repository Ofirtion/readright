import React, { useState } from 'react';
import { TrendingUp, Clock, Flame, BookOpen, Award, Target, ArrowUpRight, AlertCircle, Calendar, Sparkles, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import Layout from '../components/Layout';
import WeeklyEmailSettings from '../components/WeeklyEmailSettings';
import RecordingsPanel from '../components/RecordingsPanel';
import DataManagement from '../components/DataManagement';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import AchievementsPanel from '../components/AchievementsPanel';

export default function Dashboard({ onNavigate, childId }) {
  const { user, getChild, getSessions } = useAuth();
  const child = getChild(childId);
  const sessions = getSessions(childId);

  const [timeRange, setTimeRange] = useState('30d');

  if (!child) {
    return (
      <Layout onNavigate={onNavigate} showBack>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p style={{ color: colors.textSecondary }}>ילד לא נמצא</p>
        </div>
      </Layout>
    );
  }

  // Compute aggregates
  const totalSessions = sessions.length;
  const totalMinutes = Math.round(sessions.reduce((s, x) => s + (x.duration_seconds || 0), 0) / 60);
  const avgWcpm = totalSessions > 0 ? Math.round(sessions.reduce((s, x) => s + (x.wcpm || 0), 0) / totalSessions) : 0;
  const avgAccuracy = totalSessions > 0 ? Math.round(sessions.reduce((s, x) => s + (x.accuracy || 0), 0) / totalSessions) : 0;
  const latestWcpm = sessions[0]?.wcpm || 0;
  const firstWcpm = sessions[sessions.length - 1]?.wcpm || 0;
  const improvement = firstWcpm > 0 ? Math.round(((latestWcpm - firstWcpm) / firstWcpm) * 100) : 0;

  // Chart data: WCPM over time (last 10 sessions)
  const chartData = [...sessions].reverse().slice(0, 10).map((s, i) => ({
    x: i,
    y: s.wcpm || 0,
    date: new Date(s.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
  }));

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0" style={{ backgroundColor: colors.sunLight }}>
            {child.avatar_emoji}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold tracking-wide" style={{ color: colors.rust }}>
              דשבורד ההתקדמות של
            </div>
            <h1 className="text-4xl md:text-5xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              {child.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              בן/בת {child.age} • רמה {child.reading_level} • {totalSessions} קריאות
            </p>
          </div>

          {/* Time range filter */}
          <div className="flex gap-1 p-1 rounded-full" style={{ backgroundColor: colors.creamLight }}>
            {[
              { val: '7d', label: 'שבוע' },
              { val: '30d', label: 'חודש' },
              { val: 'all', label: 'הכל' }
            ].map(t => (
              <button
                key={t.val}
                onClick={() => setTimeRange(t.val)}
                className="px-4 py-2 rounded-full text-sm font-bold transition"
                style={{
                  backgroundColor: timeRange === t.val ? colors.navy : 'transparent',
                  color: timeRange === t.val ? colors.sun : colors.textSecondary
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {totalSessions === 0 && (
          <div className="text-center py-16 rounded-3xl" style={{ backgroundColor: colors.creamLight, border: `2px dashed ${colors.border}` }}>
            <div className="text-7xl mb-6">📊</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
              עדיין אין נתונים
            </h2>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: colors.textSecondary }}>
              אחרי שילד/ה יקרא/תקרא סיפור ראשון, נתוני ההתקדמות יופיעו כאן.
            </p>
            <button
              onClick={() => onNavigate('story-library')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold transition hover:scale-105 shadow-lg"
              style={{ backgroundColor: colors.navy, color: colors.sun }}
            >
              <BookOpen className="w-5 h-5" />
              בחר סיפור עכשיו
            </button>
          </div>
        )}

        {totalSessions > 0 && (
          <>
            {/* CTA to the new in-depth Progress Dashboard */}
            <button
              onClick={() => onNavigate('progress', { childId })}
              className="w-full mb-6 rounded-3xl p-5 flex items-center justify-between gap-4 transition hover:scale-[1.01] hover:shadow-lg text-right"
              style={{
                background: `linear-gradient(135deg, ${colors.navy} 0%, #2a3f6d 100%)`,
                color: colors.cream,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(245,165,36,0.2)' }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: colors.sun }} />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider mb-0.5" style={{ color: colors.sun }}>
                    חדש
                  </div>
                  <div className="font-black text-lg" style={{ fontFamily: fonts.display }}>
                    דוח התקדמות מפורט
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(250,246,239,0.7)' }}>
                    KPI לכל תקופה, תובנות, וייצוא PDF לקלינאית
                  </div>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" style={{ color: colors.sun }} />
            </button>

            {/* Top KPIs */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-3xl p-6" style={{ backgroundColor: colors.creamLight }}>
                <Clock className="w-6 h-6 mb-3" style={{ color: colors.green }} />
                <div className="text-4xl font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  {totalMinutes}<span className="text-xl font-normal" style={{ color: colors.textSecondary }}> דק׳</span>
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>זמן קריאה כולל</div>
              </div>

              <div className="rounded-3xl p-6" style={{ backgroundColor: colors.navy, color: colors.cream }}>
                <TrendingUp className="w-6 h-6 mb-3" style={{ color: colors.sun }} />
                <div className="text-4xl font-black mb-1" style={{ fontFamily: fonts.display }}>
                  {avgWcpm}<span className="text-xl font-normal" style={{ color: colors.textMuted }}> WCPM</span>
                </div>
                <div className="text-sm" style={{ color: '#C8D0DC' }}>שטף קריאה ממוצע</div>
                {improvement > 0 && (
                  <div className="text-xs mt-2 flex items-center gap-1" style={{ color: colors.green }}>
                    <ArrowUpRight className="w-3 h-3" />
                    +{improvement}% מההתחלה
                  </div>
                )}
              </div>

              <div className="rounded-3xl p-6" style={{ backgroundColor: colors.creamLight }}>
                <Target className="w-6 h-6 mb-3" style={{ color: colors.rust }} />
                <div className="text-4xl font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  {avgAccuracy}%
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>דיוק ממוצע</div>
              </div>

              <div className="rounded-3xl p-6" style={{ backgroundColor: colors.creamLight }}>
                <Flame className="w-6 h-6 mb-3" style={{ color: colors.rust }} />
                <div className="text-4xl font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  {totalSessions}
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>סיפורים שנקראו</div>
              </div>
            </div>

            {/* WCPM Chart */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="md:col-span-2 rounded-3xl p-6" style={{ backgroundColor: colors.creamLight }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-black text-xl" style={{ color: colors.navy, fontFamily: fonts.display }}>
                      התקדמות WCPM לאורך זמן
                    </h3>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      מילים נכונות לדקה — אחרי כל קריאה
                    </p>
                  </div>
                </div>

                {chartData.length >= 2 ? (
                  <svg viewBox="0 0 600 240" className="w-full" style={{ height: '240px' }}>
                    <defs>
                      <linearGradient id="wcpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.navy} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={colors.navy} stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[40, 80, 120, 160, 200].map((y, i) => (
                      <g key={y}>
                        <line x1="40" y1={y} x2="590" y2={y} stroke={colors.border} strokeWidth="1" />
                        <text x="30" y={y + 4} fontSize="10" fill={colors.textMuted} textAnchor="end">{200 - i * 40}</text>
                      </g>
                    ))}

                    {/* Data path */}
                    {(() => {
                      const maxY = 200;
                      const points = chartData.map((d, i) => ({
                        x: 40 + (i / Math.max(1, chartData.length - 1)) * 550,
                        y: maxY - (d.y / 200) * 160
                      }));
                      const pathD = points.reduce((acc, p, i) => acc + (i === 0 ? `M${p.x},${p.y}` : ` L${p.x},${p.y}`), '');
                      const areaD = pathD + ` L${points[points.length - 1].x},200 L${points[0].x},200 Z`;
                      return (
                        <>
                          <path d={areaD} fill="url(#wcpmGrad)" />
                          <path d={pathD} stroke={colors.navy} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          {points.map((p, i) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="5" fill={colors.cream} stroke={colors.navy} strokeWidth="2" />
                              {i === points.length - 1 && (
                                <>
                                  <circle cx={p.x} cy={p.y} r="10" fill={colors.sun} opacity="0.3" />
                                  <text x={p.x} y={p.y - 12} fontSize="12" fill={colors.navy} fontWeight="bold" textAnchor="middle">{chartData[i].y}</text>
                                </>
                              )}
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                ) : (
                  <div className="text-center py-12" style={{ color: colors.textSecondary }}>
                    צריך לפחות 2 קריאות כדי להציג גרף
                  </div>
                )}
              </div>

              {/* Insights */}
              <div className="rounded-3xl p-6" style={{ backgroundColor: colors.sunLight }}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: colors.rust }} />
                  <h3 className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    תובנות AI
                  </h3>
                </div>

                <div className="space-y-3">
                  {improvement > 10 && (
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: colors.cream, color: colors.navy }}>
                      {child.name} השתפר/ה ב‑{improvement}% מאז הקריאה הראשונה — התקדמות מעולה!
                    </div>
                  )}
                  {avgAccuracy >= 90 && (
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: colors.cream, color: colors.navy }}>
                      דיוק של {avgAccuracy}% הוא מצוין. אולי כדאי לעבור לרמה הבאה?
                    </div>
                  )}
                  {avgAccuracy < 70 && totalSessions >= 3 && (
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: colors.cream, color: colors.navy }}>
                      הדיוק מעט נמוך. אולי נוריד רמה כדי לבנות בטחון?
                    </div>
                  )}
                  {totalSessions < 3 && (
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: colors.cream, color: colors.navy }}>
                      נצטרך עוד כמה קריאות כדי לזהות דפוסים. המשך/י בכיף!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements - streak + badges */}
            <AchievementsPanel sessions={sessions} />

            {/* Medical / educational disclaimer - directly after AI insights */}
            <div className="mb-8">
              <MedicalDisclaimer />
            </div>

            {/* Audio recordings of reading sessions */}
            <RecordingsPanel childId={childId} childName={child.name} />

            {/* Weekly email settings */}
            <WeeklyEmailSettings
              child={child}
              sessions={sessions}
              parentEmail={user?.email}
            />

            {/* Recent sessions table */}
            <div className="rounded-3xl p-6" style={{ backgroundColor: colors.creamLight }}>
              <h3 className="font-black text-xl mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
                היסטוריית קריאות
              </h3>

              <div className="space-y-2">
                {sessions.slice(0, 10).map((session, i) => {
                  const date = new Date(session.created_at);
                  return (
                    <div key={session.id} className="flex items-center gap-4 p-3 rounded-2xl transition hover:bg-white/50" style={{ backgroundColor: colors.cream }}>
                      <div className="text-xs font-bold w-20" style={{ color: colors.textSecondary }}>
                        {date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                        <div className="text-[10px] font-normal">
                          {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm" style={{ color: colors.navy }}>
                          {session.story_title || 'סיפור ללא שם'}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {session.completed ? '✓ הושלם' : 'לא הושלם'} • {Math.round(session.duration_seconds / 60)} דק׳
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-black" style={{ color: colors.navy }}>{session.wcpm}</div>
                          <div className="text-[9px]" style={{ color: colors.textSecondary }}>WCPM</div>
                        </div>
                        <div>
                          <div className="text-lg font-black" style={{ color: colors.green }}>{session.accuracy}%</div>
                          <div className="text-[9px]" style={{ color: colors.textSecondary }}>דיוק</div>
                        </div>
                        <div>
                          <div className="text-lg font-black" style={{ color: colors.rust }}>{session.errors_count}</div>
                          <div className="text-[9px]" style={{ color: colors.textSecondary }}>טעויות</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data management (GDPR-style) — bottom of dashboard */}
            <div className="mt-8">
              <DataManagement onNavigate={onNavigate} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
