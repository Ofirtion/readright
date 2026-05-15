import React from 'react';
import { Plus, BookOpen, BarChart3, Flame, Star, ChevronLeft, Trash2, Edit2, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import Layout from '../components/Layout';
import DeviceWarning from '../components/DeviceWarning';
import { useSubscription, canAccessChild, canAddChild } from '../lib/subscription';

export default function Home({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const { user, getChildren, getSessions, deleteChild } = useAuth();
  const sub = useSubscription();
  const children = getChildren();
  const canAdd = canAddChild(children.length);

  const handleSelectChild = (childId) => {
    // If restricted, only the selected free child is accessible
    if (!canAccessChild(childId, children)) {
      onNavigate('paywall', { reason: 'extra_child' });
      return;
    }
    onNavigate('story-library', { childId });
  };

  const handleAddChild = () => {
    if (!canAdd) {
      onNavigate('paywall', { reason: 'extra_child' });
      return;
    }
    onNavigate('add-child');
  };

  const handleViewDashboard = (childId, e) => {
    e.stopPropagation();
    onNavigate('dashboard', { childId });
  };

  const handleDelete = async (childId, name, e) => {
    e.stopPropagation();
    if (confirm(`למחוק את הפרופיל של ${name}? כל ההיסטוריה תימחק.`)) {
      await deleteChild(childId);
    }
  };

  const handleEdit = (childId, e) => {
    e.stopPropagation();
    onNavigate('edit-child', { childId });
  };

  return (
    <Layout onNavigate={onNavigate} currentPage="home">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mobile/Firefox warning — only shows for problematic devices */}
        <DeviceWarning context="home" />

        {/* Trial / restricted banner */}
        {sub.isTrial && sub.daysLeftInTrial <= 7 && (
          <div
            className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
            style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" style={{ color: colors.rust }} />
              <div className="text-sm" style={{ color: colors.navy }}>
                {sub.daysLeftInTrial === 0
                  ? <strong>{t('home.trialEndingToday')}</strong>
                  : t('home.trialWarning', { days: sub.daysLeftInTrial })}
              </div>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-5 py-2 rounded-full text-sm font-black transition hover:scale-105"
              style={{ backgroundColor: colors.navy, color: colors.sun }}
            >
              {t('nav.pricing')}
            </button>
          </div>
        )}

        {sub.isRestricted && (
          <div
            className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
            style={{ backgroundColor: colors.creamDark, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" style={{ color: colors.textMuted }} />
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {t('home.restrictedBanner')}
              </div>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-5 py-2 rounded-full text-sm font-black transition hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: colors.sun, color: colors.navy }}
            >
              <Sparkles className="w-4 h-4" />
              שדרג ל-Premium
            </button>
          </div>
        )}

        {/* Welcome header */}
        <div className="mb-12">
          <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>
            דף הבית
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
            שלום {user?.full_name?.split(' ')[0] || 'הורה'} 👋
          </h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>
            {children.length === 0
              ? 'בוא ניצור פרופיל ראשון לילד שלך כדי להתחיל'
              : `${children.length} ${children.length === 1 ? 'ילד/ה' : 'ילדים'} מחוברים לחשבון שלך`}
          </p>
        </div>

        {/* Empty state */}
        {children.length === 0 && (
          <div className="text-center py-16 rounded-3xl" style={{ backgroundColor: colors.creamLight, border: `2px dashed ${colors.border}` }}>
            <div className="text-7xl mb-6">👨‍👧‍👦</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
              צור פרופיל ראשון
            </h2>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: colors.textSecondary }}>
              ניצור פרופיל מותאם לילד שלך — שם, גיל, רמת קריאה ותחומי עניין. זה ייקח 2 דקות.
            </p>
            <button
              onClick={handleAddChild}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold transition hover:scale-105 shadow-lg"
              style={{ backgroundColor: colors.navy, color: colors.sun }}
            >
              <Plus className="w-5 h-5" />
              {t("home.addChild")}
            </button>
          </div>
        )}

        {/* Children grid */}
        {children.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {children.map(child => {
                const sessions = getSessions(child.id);
                const totalSessions = sessions.length;
                const lastSession = sessions[0];
                const avgWcpm = sessions.length > 0
                  ? Math.round(sessions.reduce((sum, s) => sum + (s.wcpm || 0), 0) / sessions.length)
                  : 0;

                return (
                  <div
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className="group rounded-3xl p-6 transition hover:translate-y-[-4px] hover:shadow-xl cursor-pointer relative overflow-hidden"
                    style={{
                      backgroundColor: colors.creamLight,
                      border: `2px solid ${colors.border}`,
                      opacity: !canAccessChild(child.id, children) ? 0.6 : 1,
                    }}
                  >
                    {/* Locked overlay for restricted_free users */}
                    {!canAccessChild(child.id, children) && (
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 z-10"
                        style={{ backgroundColor: colors.sun, color: colors.navy }}
                      >
                        <Lock className="w-3 h-3" />
                        Premium
                      </div>
                    )}
                    {/* Action buttons (visible on hover) */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                      <button
                        onClick={(e) => handleEdit(child.id, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                        style={{ backgroundColor: colors.cream, color: colors.navy }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(child.id, child.name, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                        style={{ backgroundColor: colors.rustLight, color: colors.rust }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-4"
                      style={{ backgroundColor: colors.sunLight }}
                    >
                      {child.avatar_emoji}
                    </div>

                    {/* Name & age */}
                    <h3 className="text-2xl font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                      {child.name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      בן/בת {child.age}{child.grade && ` • כיתה ${child.grade}`}
                    </p>

                    {/* Reading level badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                      <BookOpen className="w-3 h-3" />
                      רמה {child.reading_level}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.cream }}>
                        <div className="text-lg font-black" style={{ color: colors.navy }}>{totalSessions}</div>
                        <div className="text-[10px]" style={{ color: colors.textSecondary }}>קריאות</div>
                      </div>
                      <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.cream }}>
                        <div className="text-lg font-black" style={{ color: colors.green }}>{avgWcpm || '-'}</div>
                        <div className="text-[10px]" style={{ color: colors.textSecondary }}>WCPM ממוצע</div>
                      </div>
                      <div className="text-center p-2 rounded-lg" style={{ backgroundColor: colors.cream }}>
                        <div className="text-lg font-black flex items-center justify-center gap-0.5" style={{ color: colors.rust }}>
                          <Flame className="w-3.5 h-3.5" />
                          {totalSessions > 0 ? Math.min(totalSessions, 14) : 0}
                        </div>
                        <div className="text-[10px]" style={{ color: colors.textSecondary }}>רצף</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelectChild(child.id); }}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: colors.green, color: colors.cream }}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        בחר סיפור
                      </button>
                      <button
                        onClick={(e) => handleViewDashboard(child.id, e)}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                        style={{ backgroundColor: colors.cream, color: colors.navy, border: `1px solid ${colors.border}` }}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add child card */}
              <button
                onClick={handleAddChild}
                className="group rounded-3xl p-6 transition hover:translate-y-[-4px] hover:shadow-xl border-dashed flex flex-col items-center justify-center text-center min-h-[400px]"
                style={{ backgroundColor: 'transparent', border: `3px dashed ${colors.border}` }}
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition group-hover:scale-110" style={{ backgroundColor: colors.navy }}>
                  <Plus className="w-10 h-10" style={{ color: colors.sun }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  {t("home.addChild")}
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  צור פרופיל חדש
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
