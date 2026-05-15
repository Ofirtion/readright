import React from 'react';
import { BookOpen, LogOut, Home, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import SubscriptionBadge from './SubscriptionBadge';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout({ children, onNavigate, currentPage, showBack = false }) {
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
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

      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(250, 246, 239, 0.92)',
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition hover:bg-black/5"
                style={{ color: colors.navy }}
              >
                <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {t('common.back')}
              </button>
            )}
            <button
              onClick={() => onNavigate(user ? 'home' : 'landing')}
              className="flex items-center gap-2 transition hover:opacity-80"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.navy }}
              >
                <BookOpen className="w-4 h-4" style={{ color: colors.sun }} />
              </div>
              <span
                className="text-lg font-black tracking-tight"
                style={{ color: colors.navy, fontFamily: fonts.display }}
              >
                ReadRight
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user && (
              <>
                <SubscriptionBadge onNavigate={onNavigate} />
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.creamDark }}>
                  <span className="text-sm font-medium" style={{ color: colors.navy }}>
                    {t('home.welcome', { name: user.full_name || (isRTL ? 'משתמש' : 'there') })}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-black/5"
                  style={{ color: colors.navy }}
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Persistent footer with legal & contact links */}
      <footer
        className="mt-16 py-8 px-6"
        style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.creamDark }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: colors.textMuted }}>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.navy }}
            >
              <BookOpen className="w-3 h-3" style={{ color: colors.sun }} />
            </div>
            <span style={{ color: colors.navy, fontWeight: 700 }}>ReadRight</span>
            <span>{t('footer.copyright')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => onNavigate('help')} className="hover:underline" style={{ color: colors.navy, fontWeight: 600 }}>
              {t('footer.help')}
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('privacy')} className="hover:underline" style={{ color: colors.navy, fontWeight: 600 }}>
              {t('footer.privacy')}
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:underline" style={{ color: colors.navy, fontWeight: 600 }}>
              {t('footer.terms')}
            </button>
            <span>·</span>
            <a href="mailto:hello@readright.app" className="hover:underline" style={{ color: colors.navy, fontWeight: 600 }}>
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
