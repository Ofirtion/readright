import React, { useState } from 'react';
import { BookOpen, Clock, Sparkles, Filter, Star, Plus, Trash2, UserPlus, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, interests as INTERESTS_LIST } from '../lib/theme';
import { STORIES, countWords } from '../data/stories';
import Layout from '../components/Layout';
import { useSubscription, canReadStory } from '../lib/subscription';

export default function StoryLibrary({ onNavigate, childId }) {
  const { getChild, getSessions, getCustomStories, deleteCustomStory } = useAuth();
  const sub = useSubscription();
  const child = getChild(childId);
  const sessions = getSessions(childId);
  // Only show custom stories that belong to this child.
  // Legacy custom stories without a childId are shown to all children of this parent.
  const allCustomStories = getCustomStories();
  const customStories = allCustomStories.filter(
    (s) => s.childId === childId || s.childId === undefined
  );

  const [filter, setFilter] = useState('recommended'); // recommended | all | level | custom

  if (!child) {
    return (
      <Layout onNavigate={onNavigate} showBack>
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p style={{ color: colors.textSecondary }}>ילד לא נמצא</p>
        </div>
      </Layout>
    );
  }

  // Combine built-in stories with user-imported custom stories
  const allStories = [...STORIES, ...customStories];

  // Filter & sort stories
  let displayedStories = [...allStories];

  if (filter === 'recommended') {
    // Sort: matching interests first, then exact level match, then closest level
    displayedStories.sort((a, b) => {
      // Custom stories: surface them recently-first
      if (a.isCustom && b.isCustom) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // Custom always comes first within recommended
      if (a.isCustom && !b.isCustom) return -1;
      if (!a.isCustom && b.isCustom) return 1;

      const aInterestMatch = a.interests.some(i => child.interests.includes(i)) ? 1 : 0;
      const bInterestMatch = b.interests.some(i => child.interests.includes(i)) ? 1 : 0;
      if (aInterestMatch !== bInterestMatch) return bInterestMatch - aInterestMatch;

      const aLevelDist = Math.abs(a.level - child.reading_level);
      const bLevelDist = Math.abs(b.level - child.reading_level);
      return aLevelDist - bLevelDist;
    });
  } else if (filter === 'level') {
    displayedStories = displayedStories.filter(s => s.level === child.reading_level);
  } else if (filter === 'custom') {
    displayedStories = displayedStories.filter(s => s.isCustom);
  }

  const handleStoryClick = (storyId) => {
    if (!canReadStory(storyId)) {
      onNavigate('paywall', { reason: 'extra_story' });
      return;
    }
    onNavigate('reading', { storyId });
  };

  const handleDeleteCustom = async (storyId, title, e) => {
    e.stopPropagation();
    if (confirm(`למחוק את הסיפור "${title}"? פעולה זו אינה הפיכה.`)) {
      await deleteCustomStory(storyId);
    }
  };

  const isStoryRead = (storyId) => sessions.some(s => s.story_id === storyId);

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with child info */}
        <div className="flex items-center gap-4 mb-8 p-5 rounded-3xl" style={{ backgroundColor: colors.sunLight }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: colors.cream }}>
            {child.avatar_emoji}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold" style={{ color: colors.rust }}>בוחר/ת סיפור עבור</div>
            <h1 className="text-3xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
              {child.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                רמה {child.reading_level}
              </span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {child.interests.length} תחומי עניין
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Filter className="w-4 h-4" style={{ color: colors.textSecondary }} />
          {[
            { id: 'recommended', label: '✨ מומלצים עבורי' },
            { id: 'level', label: `📚 רמה ${child.reading_level} בלבד` },
            { id: 'all', label: '📖 כל הסיפורים' },
            ...(customStories.length > 0 ? [{ id: 'custom', label: `🎨 הסיפורים של ${child.name} (${customStories.length})` }] : []),
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-2 rounded-full text-sm font-bold transition"
              style={{
                backgroundColor: filter === f.id ? colors.navy : colors.creamLight,
                color: filter === f.id ? colors.sun : colors.navy,
                border: `1px solid ${filter === f.id ? colors.navy : colors.border}`
              }}
            >
              {f.label}
            </button>
          ))}

          {/* Import CTA on the left side */}
          <button
            onClick={() => {
              if (sub.isRestricted) {
                onNavigate('paywall', { reason: 'custom_story' });
              } else {
                onNavigate('import-content', { childId });
              }
            }}
            className="ml-auto px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 hover:scale-105"
            style={{
              backgroundColor: sub.isRestricted ? colors.creamDark : colors.rust,
              color: sub.isRestricted ? colors.textSecondary : colors.cream,
              border: `1px solid ${sub.isRestricted ? colors.border : colors.rust}`,
            }}
          >
            {sub.isRestricted ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            הוסף תוכן משלך
            {sub.isRestricted && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black mr-1" style={{ backgroundColor: colors.sun, color: colors.navy }}>
                Premium
              </span>
            )}
          </button>
        </div>

        {/* Stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStories.map(story => {
            const wordCount = countWords(story);
            const isMatch = story.interests.some(i => child.interests.includes(i));
            const isLevelMatch = story.level === child.reading_level;
            const wasRead = isStoryRead(story.id);
            const isLocked = !canReadStory(story.id);

            return (
              <button
                key={story.id}
                onClick={() => handleStoryClick(story.id)}
                className="group text-right rounded-3xl overflow-hidden transition hover:translate-y-[-4px] hover:shadow-xl relative"
                style={{
                  backgroundColor: colors.creamLight,
                  border: `2px solid ${isLocked ? colors.border : colors.border}`,
                  opacity: isLocked ? 0.7 : 1,
                }}
              >
                {/* Story emoji header */}
                <div
                  className="h-32 flex items-center justify-center text-7xl relative"
                  style={{ backgroundColor: story.isCustom ? colors.rustLight : colors.sunLight }}
                >
                  <span style={{ filter: isLocked ? 'grayscale(0.8)' : 'none' }}>{story.emoji}</span>

                  {/* Locked overlay */}
                  {isLocked && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(26, 43, 74, 0.55)' }}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.sun }}
                      >
                        <Lock className="w-6 h-6" style={{ color: colors.navy }} />
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    {wasRead && !isLocked && (
                      <div className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: colors.green, color: colors.cream }}>
                        <Star className="w-2.5 h-2.5 fill-current" />
                        נקרא
                      </div>
                    )}
                    {story.isCustom && (
                      <div className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: colors.navy, color: colors.cream }}>
                        🎨 משלך
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {isMatch && !story.isCustom && !isLocked && (
                      <div className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: colors.rust, color: colors.cream }}>
                        <Sparkles className="w-2.5 h-2.5" />
                        מתאים לך
                      </div>
                    )}
                    {isLocked && (
                      <div className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ backgroundColor: colors.sun, color: colors.navy }}>
                        Premium
                      </div>
                    )}
                    {story.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustom(story.id, story.title, e)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110"
                        style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                        title="מחק"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: colors.cream }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Story info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                      רמה {story.level}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: colors.textSecondary }}>
                      <Clock className="w-3 h-3" />
                      ~{story.estimatedMinutes} דק׳
                    </span>
                  </div>

                  <h3 className="text-xl font-black mb-1" style={{ color: colors.navy, fontFamily: fonts.display }}>
                    {story.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                    {story.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-xs" style={{ color: colors.textMuted }}>
                    <span>{wordCount} מילים</span>
                    <span className="flex items-center gap-1 font-bold transition group-hover:gap-2" style={{ color: colors.rust }}>
                      התחל לקרוא ←
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {displayedStories.length === 0 && filter === 'custom' && (
          <div className="text-center py-16 rounded-3xl" style={{ backgroundColor: colors.creamLight, border: `1px dashed ${colors.border}` }}>
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-black mb-2" style={{ color: colors.navy, fontFamily: fonts.display }}>
              עדיין אין סיפורים שלך
            </h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.textSecondary }}>
              הוסיפו סיפור משלכם — הדבקת טקסט, קישור לדף אינטרנט, או צילום של דף מספר.
              המערכת תוסיף ניקוד אוטומטית.
            </p>
            <button
              onClick={() => onNavigate('import-content', { childId })}
              className="px-6 py-3 rounded-full font-bold text-sm transition hover:scale-105 inline-flex items-center gap-2"
              style={{ backgroundColor: colors.rust, color: colors.cream }}
            >
              <Plus className="w-4 h-4" />
              צור את הסיפור הראשון של {child.name}
            </button>
          </div>
        )}

        {displayedStories.length === 0 && filter !== 'custom' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-lg" style={{ color: colors.textSecondary }}>אין סיפורים תואמים לסינון הנוכחי</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-6 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: colors.navy, color: colors.sun }}
            >
              הצג את כל הסיפורים
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
