import React from 'react';
import { BookOpen, Mic, Brain, Heart, Shield, ArrowLeft, Sparkles, Activity, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import LanguageSwitcher from '../components/LanguageSwitcher';
import DeviceWarning from '../components/DeviceWarning';

export default function Landing({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const { signInWithGoogle, signInDemo } = useAuth();
  const [isAdult, setIsAdult] = React.useState(false);
  const [agreedTerms, setAgreedTerms] = React.useState(false);
  const [showGateError, setShowGateError] = React.useState(false);

  // Both age confirmation AND terms agreement required before login
  const canLogin = isAdult && agreedTerms;

  const handleGoogleLogin = async () => {
    if (!canLogin) {
      setShowGateError(true);
      // Smooth-scroll to the gate so the user sees what's missing
      document.getElementById('age-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    await signInWithGoogle();
    onNavigate('onboarding-check');
  };

  const handleDemoLogin = async () => {
    if (!canLogin) {
      setShowGateError(true);
      document.getElementById('age-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    await signInDemo();
    onNavigate('onboarding-check');
  };

  // "Try the free story" — quick demo path. Same auth flow but afterward
  // we land directly inside the reading experience. The consent gate still
  // applies — we'd rather lose a few demos than skip the disclosure.
  const handleTryFreeStory = async () => {
    if (!canLogin) {
      setShowGateError(true);
      document.getElementById('age-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    await signInDemo('הורה לדוגמה');
    onNavigate('onboarding-check');
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: colors.cream,
        fontFamily: fonts.body,
        minHeight: '100vh'
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 239, 0.85)', borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.navy }}>
              <BookOpen className="w-5 h-5" style={{ color: colors.sun }} />
            </div>
            <span className="text-2xl font-black tracking-tight" style={{ color: colors.navy, fontFamily: fonts.display }}>ReadRight</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <a href="#features" className="hidden md:inline text-sm font-medium hover:opacity-70 transition" style={{ color: colors.navy }}>{t('nav.howItWorks')}</a>
            <button onClick={() => onNavigate('pricing')} className="hidden md:inline text-sm font-medium hover:opacity-70 transition" style={{ color: colors.navy }}>{t('nav.pricing')}</button>
            <LanguageSwitcher />
            <button onClick={handleGoogleLogin} className="px-5 py-2.5 rounded-full text-sm font-bold transition hover:scale-105" style={{ backgroundColor: colors.navy, color: colors.sun }}>
              {t('nav.signIn')}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-32 left-[-100px] w-[400px] h-[400px] rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${colors.sun} 0%, transparent 70%)` }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Mobile/Firefox warning — only shows for problematic devices */}
          <DeviceWarning context="landing" />

          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wide">
                  {isRTL ? 'מאמן קריאה אישי המבוסס על AI' : 'AI-powered personal reading coach'}
                </span>
              </div>

              {isRTL ? (
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  כָּל יֶלֶד<br />
                  <span style={{ color: colors.rust, fontStyle: 'italic' }}>קוֹרֵא</span><br />
                  בְּבִטָּחוֹן.
                </h1>
              ) : (
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8" style={{ color: colors.navy, fontFamily: fonts.display }}>
                  Every child<br />
                  <span style={{ color: colors.rust, fontStyle: 'italic' }}>reads</span><br />
                  with confidence.
                </h1>
              )}

              <p className="text-xl md:text-2xl mb-10 max-w-xl leading-relaxed" style={{ color: colors.textSecondary }}>
                {isRTL ? (
                  <>ReadRight מקשיבה לילד שלך קורא, מזהה <span className="font-bold" style={{ color: colors.navy }}>בדיוק</span> איפה הוא מתקשה, ומתאימה את הסיפור הבא בהתאם.</>
                ) : (
                  <>ReadRight listens to your child read, identifies <span className="font-bold" style={{ color: colors.navy }}>exactly</span> where they're struggling, and adapts the next story accordingly.</>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button onClick={handleGoogleLogin} className="group px-8 py-4 rounded-full text-base font-bold transition hover:scale-105 flex items-center justify-center gap-3 shadow-lg" style={{ backgroundColor: colors.navy, color: colors.cream }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('landing.ctaSignUp')}
                  <ArrowLeft className={`w-5 h-5 transition group-hover:-translate-x-1 ${isRTL ? '' : 'rotate-180 group-hover:translate-x-1 group-hover:-translate-x-0'}`} />
                </button>
                <button onClick={handleDemoLogin} className="px-8 py-4 rounded-full text-base font-bold transition hover:scale-105" style={{ border: `2px solid ${colors.navy}`, color: colors.navy }}>
                  {t('landing.ctaDemo')}
                </button>
              </div>

              <p className="text-xs mb-12" style={{ color: colors.textMuted }}>
                לפני שתתחיל, נבקש אישור הורה ושכוונת לתנאי השימוש.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-3xl font-black" style={{ color: colors.navy }}>+25%</div>
                  <div className="text-xs font-medium tracking-wide" style={{ color: colors.textSecondary }}>שיפור WCPM ב‑90 ימים</div>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: colors.border }} />
                <div>
                  <div className="text-3xl font-black" style={{ color: colors.navy }}>40%</div>
                  <div className="text-xs font-medium tracking-wide" style={{ color: colors.textSecondary }}>D90 retention</div>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: colors.border }} />
                <div>
                  <div className="text-3xl font-black" style={{ color: colors.navy }}>∞</div>
                  <div className="text-xs font-medium tracking-wide" style={{ color: colors.textSecondary }}>סיפורים אישיים</div>
                </div>
              </div>
            </div>

            {/* Hero card mockup */}
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-full h-full rounded-3xl" style={{ backgroundColor: colors.sun }} />
                <div className="relative rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.navy}` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: colors.sunLight }}>👧🏼</div>
                      <div>
                        <div className="font-bold text-lg" style={{ color: colors.navy }}>דנה, 8</div>
                        <div className="text-xs" style={{ color: colors.rust }}>🔥 רצף 14 ימים</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.navy, color: colors.sun }}>LIVE</div>
                  </div>

                  <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: colors.sunLight }}>
                    <div className="text-2xl leading-loose font-medium" style={{ color: colors.navy, fontFamily: fonts.display }}>
                      <span className="px-1 rounded" style={{ backgroundColor: colors.green, color: colors.navy }}>דָּנָה</span>{' '}
                      <span className="px-1 rounded" style={{ backgroundColor: colors.green, color: colors.navy }}>מָצְאָה</span>{' '}
                      <span className="px-1 rounded animate-pulse" style={{ backgroundColor: colors.sun, color: colors.navy }}>חָתוּל</span>
                      {' '}קָטָן בְּגַן הַשַּׁעֲשׁוּעִים.
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: colors.creamDark }}>
                      <div className="text-xl font-black" style={{ color: colors.navy }}>92</div>
                      <div className="text-[10px]" style={{ color: colors.textSecondary }}>WCPM</div>
                    </div>
                    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: colors.creamDark }}>
                      <div className="text-xl font-black" style={{ color: colors.green }}>94%</div>
                      <div className="text-[10px]" style={{ color: colors.textSecondary }}>דיוק</div>
                    </div>
                    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: colors.creamDark }}>
                      <div className="text-xl font-black" style={{ color: colors.rust }}>⭐ 47</div>
                      <div className="text-[10px]" style={{ color: colors.textSecondary }}>נקודות</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-sm font-bold tracking-widest mb-4" style={{ color: colors.rust }}>הפתרון</div>
            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6" style={{ color: colors.navy, fontFamily: fonts.display }}>
              ארבעה מבדלים שאי אפשר<br />למצוא בשום מקום אחר.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { num: "01", icon: Activity, title: "Multimodal Real‑Time Feedback", text: "כשהילד נתקע על מילה, האפליקציה מאירה אותה, מציעה רמז פונטי, ומשמיעה את ההגייה — הכל תוך פחות מ‑300 מילישניות.", color: colors.green },
              { num: "02", icon: Brain, title: "Emotional Adaptation", text: "AI שמזהה תסכול בקצב ובטון של הילד, ומציע הפסקה או טקסט קל יותר אוטומטית.", color: colors.sun },
              { num: "03", icon: Heart, title: "מודל הורה‑ילד", text: "ההורה מקליט את עצמו קורא את הסיפור. הילד מקבל ציון על \"כמה דמיתי לאבא\". סבא וסבתא מרחוק נכנסים לסיפור.", color: colors.rust },
              { num: "04", icon: Shield, title: "זיהוי דפוסי דיסלקציה", text: "המערכת מזהה דפוסים אופייניים לאורך זמן ונותנת דוח לפסיכולוג חינוכי. כלי עזר אבחנתי.", color: colors.navy }
            ].map((feature, i) => (
              <div key={i} className="group relative rounded-3xl p-10 transition hover:translate-y-[-4px]" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.border}` }}>
                <div className="absolute top-6 left-6 text-7xl font-black opacity-10" style={{ color: feature.color, fontFamily: fonts.display }}>{feature.num}</div>
                <feature.icon className="w-12 h-12 mb-6 relative z-10" style={{ color: feature.color }} />
                <h3 className="text-2xl font-black mb-4 relative z-10" style={{ color: colors.navy, fontFamily: fonts.display }}>{feature.title}</h3>
                <p className="text-base leading-relaxed relative z-10" style={{ color: colors.textSecondary }}>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32" style={{ backgroundColor: colors.navy }}>
        <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8" style={{ color: colors.cream, fontFamily: fonts.display }}>
            התחל <span style={{ color: colors.sun }}>היום.</span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: '#C8D0DC' }}>
            הירשם בחינם, צור פרופיל לילד שלך, וקבל גישה מיידית למאגר הסיפורים והדשבורד.
          </p>

          {/* Age gate + consent */}
          <div id="age-gate" className="max-w-xl mx-auto mb-10 text-right">
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${showGateError && !canLogin ? colors.rust : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdult}
                  onChange={(e) => { setIsAdult(e.target.checked); setShowGateError(false); }}
                  className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
                  style={{ accentColor: colors.sun }}
                />
                <span className="text-sm" style={{ color: colors.cream }}>
                  {t('landing.ageGateAdult')}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => { setAgreedTerms(e.target.checked); setShowGateError(false); }}
                  className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
                  style={{ accentColor: colors.sun }}
                />
                <span className="text-sm" style={{ color: colors.cream }}>
                  {isRTL ? (
                    <>
                      קראתי והסכמתי ל
                      <button onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="underline mx-1" style={{ color: colors.sun, fontWeight: 700 }}>
                        תנאי השימוש
                      </button>
                      ול
                      <button onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="underline mx-1" style={{ color: colors.sun, fontWeight: 700 }}>
                        מדיניות הפרטיות
                      </button>
                      , כולל הסכמה להקלטת קולו של הילד.
                    </>
                  ) : (
                    <>
                      I have read and agreed to the{' '}
                      <button onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="underline mx-1" style={{ color: colors.sun, fontWeight: 700 }}>
                        Terms of Service
                      </button>
                      and{' '}
                      <button onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="underline mx-1" style={{ color: colors.sun, fontWeight: 700 }}>
                        Privacy Policy
                      </button>
                      , including consent to record the child's voice.
                    </>
                  )}
                </span>
              </label>

              {showGateError && !canLogin && (
                <div className="text-xs flex items-center gap-2 pt-2" style={{ color: colors.sun }}>
                  ⚠️ {t('landing.ageGateError')}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGoogleLogin} className="px-10 py-5 rounded-full text-lg font-bold transition hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100" style={{ backgroundColor: colors.sun, color: colors.navy }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#1A2B4A" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#1A2B4A" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#1A2B4A" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#1A2B4A" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              הירשם עם Google
            </button>
            <button onClick={handleDemoLogin} className="px-10 py-5 rounded-full text-lg font-bold transition hover:scale-105" style={{ border: `2px solid ${colors.sun}`, color: colors.sun }}>
              נסה בדמו
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: colors.navyDark }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.sun }}>
              <BookOpen className="w-4 h-4" style={{ color: colors.navy }} />
            </div>
            <span className="font-black tracking-tight" style={{ color: colors.cream, fontFamily: fonts.display }}>ReadRight</span>
          </div>
          <div className="text-xs" style={{ color: colors.textMuted }}>
            אב‑טיפוס • 2026 • COPPA + GDPR‑K Compliant
          </div>
        </div>
      </footer>
    </div>
  );
}
