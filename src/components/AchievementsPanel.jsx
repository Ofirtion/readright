// AchievementsPanel.jsx
// =================================
// Two parts:
//   1. Streak card - prominent: current streak + longest streak
//   2. Badges grid - earned (colored) + unearned (greyed) badges

import React from 'react';
import { Flame, Lock } from 'lucide-react';
import { colors, fonts } from '../lib/theme';
import { calculateStreak, computeBadges } from '../lib/achievements';

const COLOR_MAP = {
  sun: { bg: '#FCE9CC', icon: '#F5A524', text: '#1A2B4A' },
  rust: { bg: '#FFE5DC', icon: '#C44536', text: '#1A2B4A' },
  green: { bg: '#D8E8D0', icon: '#7FB069', text: '#1A2B4A' },
};

export default function AchievementsPanel({ sessions }) {
  const streak = calculateStreak(sessions);
  const badges = computeBadges(sessions);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="mb-8">
      {/* Streak card */}
      <div
        className="rounded-3xl p-6 mb-4 relative overflow-hidden"
        style={{
          background: streak.current > 0
            ? `linear-gradient(135deg, ${colors.rust} 0%, #B33A2C 100%)`
            : colors.creamLight,
          border: streak.current === 0 ? `1px solid ${colors.border}` : 'none',
          color: streak.current > 0 ? colors.cream : colors.navy,
        }}
      >
        {/* Decorative flame circle */}
        {streak.current > 0 && (
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${colors.sun} 0%, transparent 70%)` }}
          />
        )}

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div
              className="text-xs font-bold tracking-wider mb-1"
              style={{ color: streak.current > 0 ? colors.sun : colors.rust }}
            >
              רצף קריאה
            </div>
            <div className="flex items-baseline gap-3">
              <div className="flex items-center gap-2">
                <Flame
                  className="w-10 h-10"
                  style={{ color: streak.current > 0 ? colors.sun : colors.textMuted }}
                  fill={streak.current > 0 ? colors.sun : 'none'}
                />
                <div
                  className="text-6xl font-black"
                  style={{ fontFamily: fonts.display }}
                >
                  {streak.current}
                </div>
              </div>
              <div className="text-base font-bold">
                {streak.current === 0 ? 'התחל רצף היום!' :
                 streak.current === 1 ? 'יום' : 'ימים'}
              </div>
            </div>
            {streak.current === 0 && (
              <div className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                קרא סיפור היום כדי להתחיל רצף 🔥
              </div>
            )}
          </div>

          {streak.longest > 0 && (
            <div
              className="text-right pl-4 border-l"
              style={{
                borderColor: streak.current > 0 ? 'rgba(255,255,255,0.2)' : colors.border,
              }}
            >
              <div className="text-xs font-bold" style={{ opacity: 0.7 }}>
                רצף הכי ארוך
              </div>
              <div
                className="text-3xl font-black"
                style={{ fontFamily: fonts.display }}
              >
                {streak.longest}
              </div>
              <div className="text-xs" style={{ opacity: 0.7 }}>
                ימים
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges grid */}
      <div
        className="rounded-3xl p-6"
        style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg" style={{ color: colors.navy, fontFamily: fonts.display }}>
            ההישגים שלי
          </h3>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {earnedCount} מתוך {badges.length}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {badges.map((badge) => {
            const palette = COLOR_MAP[badge.color] || COLOR_MAP.sun;
            const Icon = badge.Icon;
            return (
              <div
                key={badge.id}
                className="rounded-2xl p-4 text-center transition relative"
                style={{
                  backgroundColor: badge.earned ? palette.bg : colors.cream,
                  border: `1.5px solid ${badge.earned ? palette.icon : colors.border}`,
                  opacity: badge.earned ? 1 : 0.6,
                }}
                title={badge.earned ? badge.description : `${badge.description} — עדיין לא הושג`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: badge.earned ? palette.icon : colors.creamDark,
                    }}
                  >
                    {badge.earned ? (
                      <Icon className="w-6 h-6" style={{ color: 'white' }} />
                    ) : (
                      <Lock className="w-5 h-5" style={{ color: colors.textMuted }} />
                    )}
                  </div>
                  <div
                    className="text-xs font-black leading-tight"
                    style={{ color: badge.earned ? palette.text : colors.textMuted, fontFamily: fonts.display }}
                  >
                    {badge.title}
                  </div>
                  <div
                    className="text-[10px] mt-1 leading-tight"
                    style={{ color: badge.earned ? palette.text : colors.textMuted, opacity: 0.8 }}
                  >
                    {badge.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
