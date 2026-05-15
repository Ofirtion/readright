import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, readingLevels, interests, avatars } from '../lib/theme';

export default function ChildOnboarding({ onNavigate, editChildId = null }) {
  const { user, addChild, getChild, updateChild } = useAuth();
  const existing = editChildId ? getChild(editChildId) : null;
  const isEdit = !!existing;

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: existing?.name || '',
    age: existing?.age || 7,
    grade: existing?.grade || 'ב',
    reading_level: existing?.reading_level || 2,
    avatar_emoji: existing?.avatar_emoji || '👧',
    interests: existing?.interests || [],
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (id) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const canProceed = {
    1: formData.name.trim().length >= 1,
    2: formData.age >= 4 && formData.age <= 14,
    3: formData.reading_level >= 1 && formData.reading_level <= 5,
    4: !!formData.avatar_emoji,
    5: formData.interests.length >= 1,
  }[step];

  const next = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save and navigate
      if (isEdit) {
        await updateChild(editChildId, formData);
      } else {
        await addChild(formData);
      }
      onNavigate('home');
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
    else onNavigate('home');
  };

  return (
    <div dir="rtl" style={{ backgroundColor: colors.cream, fontFamily: fonts.body, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button onClick={back} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition hover:bg-black/5" style={{ color: colors.navy }}>
          <ChevronRight className="w-4 h-4" />
          {step === 1 ? 'חזרה' : 'חזור'}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.navy }}>
            <BookOpen className="w-4 h-4" style={{ color: colors.sun }} />
          </div>
          <span className="text-lg font-black tracking-tight" style={{ color: colors.navy, fontFamily: fonts.display }}>ReadRight</span>
        </div>

        <div className="text-sm font-bold" style={{ color: colors.textSecondary }}>
          {step} / {totalSteps}
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 py-3">
        <div className="max-w-3xl mx-auto h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
          <div className="h-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${colors.sun}, ${colors.rust})` }} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="text-center">
            <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>שלב 1 מתוך 5</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
              איך קוראים לילד שלך?
            </h1>
            <p className="text-lg mb-12" style={{ color: colors.textSecondary }}>
              נשתמש בשם הפרטי בלבד, כדי לשמור על פרטיות הילד.
            </p>

            <input
              type="text"
              autoFocus
              value={formData.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="לדוגמה: דנה, יונתן, מאיה..."
              className="w-full max-w-md mx-auto px-6 py-4 rounded-2xl text-2xl text-center outline-none transition"
              style={{
                backgroundColor: colors.creamLight,
                border: `2px solid ${formData.name ? colors.navy : colors.border}`,
                fontFamily: fonts.display,
                color: colors.navy
              }}
            />
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="text-center">
            <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>שלב 2 מתוך 5</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
              בן/בת כמה {formData.name}?
            </h1>
            <p className="text-lg mb-12" style={{ color: colors.textSecondary }}>
              הגיל עוזר לנו להציע תכנים מתאימים.
            </p>

            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-8">
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(age => (
                <button
                  key={age}
                  onClick={() => update('age', age)}
                  className="w-16 h-16 rounded-2xl text-2xl font-black transition hover:scale-110"
                  style={{
                    backgroundColor: formData.age === age ? colors.navy : colors.creamLight,
                    color: formData.age === age ? colors.sun : colors.navy,
                    border: `2px solid ${formData.age === age ? colors.navy : colors.border}`,
                    fontFamily: fonts.display
                  }}
                >
                  {age}
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-sm font-bold mb-2" style={{ color: colors.textSecondary }}>כיתה (לא חובה)</label>
              <select
                value={formData.grade}
                onChange={(e) => update('grade', e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ backgroundColor: colors.creamLight, border: `2px solid ${colors.border}`, color: colors.navy }}
              >
                <option value="">לא בכיתה</option>
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'].map(g => (
                  <option key={g} value={g}>כיתה {g}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Reading Level */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>שלב 3 מתוך 5</div>
              <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
                מה רמת הקריאה של {formData.name}?
              </h1>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                אל דאגה — נעדכן את הרמה עם הזמן לפי ההתקדמות.
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              {readingLevels.map(rl => (
                <button
                  key={rl.level}
                  onClick={() => update('reading_level', rl.level)}
                  className="w-full text-right p-5 rounded-2xl transition hover:scale-[1.02] flex items-center gap-4"
                  style={{
                    backgroundColor: formData.reading_level === rl.level ? colors.sunLight : colors.creamLight,
                    border: `2px solid ${formData.reading_level === rl.level ? colors.sun : colors.border}`
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0" style={{ backgroundColor: colors.navy, color: colors.sun, fontFamily: fonts.display }}>
                    {rl.level}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-lg" style={{ color: colors.navy }}>{rl.label}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>{rl.description}</div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: colors.cream, color: colors.textSecondary }}>
                    {rl.wcpmRange} WCPM
                  </div>
                  {formData.reading_level === rl.level && (
                    <Check className="w-6 h-6" style={{ color: colors.green }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Avatar */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>שלב 4 מתוך 5</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
              בחר/י אווטאר
            </h1>
            <p className="text-lg mb-12" style={{ color: colors.textSecondary }}>
              ככה {formData.name} יוצג/ת באפליקציה.
            </p>

            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-xl mx-auto">
              {avatars.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => update('avatar_emoji', emoji)}
                  className="aspect-square rounded-2xl text-5xl transition hover:scale-110"
                  style={{
                    backgroundColor: formData.avatar_emoji === emoji ? colors.sunLight : colors.creamLight,
                    border: `2px solid ${formData.avatar_emoji === emoji ? colors.sun : colors.border}`
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Interests */}
        {step === 5 && (
          <div>
            <div className="text-center mb-8">
              <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>שלב 5 מתוך 5</div>
              <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: colors.navy, fontFamily: fonts.display }}>
                מה {formData.name} אוהב/ת?
              </h1>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                בחר/י לפחות נושא אחד. נשתמש בזה כדי להמליץ על סיפורים.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className="text-right p-4 rounded-2xl transition hover:scale-105 flex items-center gap-3"
                  style={{
                    backgroundColor: formData.interests.includes(interest.id) ? colors.sunLight : colors.creamLight,
                    border: `2px solid ${formData.interests.includes(interest.id) ? colors.sun : colors.border}`
                  }}
                >
                  <span className="text-3xl">{interest.emoji}</span>
                  <span className="font-bold text-sm" style={{ color: colors.navy }}>{interest.label}</span>
                  {formData.interests.includes(interest.id) && (
                    <Check className="w-5 h-5 mr-auto" style={{ color: colors.green }} />
                  )}
                </button>
              ))}
            </div>

            <div className="text-center mt-6 text-sm" style={{ color: colors.textSecondary }}>
              נבחרו {formData.interests.length} נושאים
            </div>
          </div>
        )}

        {/* Next button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={next}
            disabled={!canProceed}
            className="group flex items-center gap-3 px-10 py-5 rounded-full text-lg font-black transition hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
            style={{ backgroundColor: colors.navy, color: colors.sun }}
          >
            {step === totalSteps ? (isEdit ? 'שמור שינויים' : 'סיום ויצירת פרופיל') : 'המשך'}
            <ChevronLeft className="w-5 h-5 transition group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
