// LanguageSwitcher.jsx
// =================================
// Small dropdown for switching between Hebrew and English.
// Lives in the header. Uses native flags as visual hints — clear and friendly.

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../lib/theme';

const LANGUAGES = [
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleSwitch = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition hover:scale-105"
        style={{
          backgroundColor: colors.creamDark,
          color: colors.navy,
        }}
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5" />
        {!compact && <span>{currentLang.label}</span>}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 rounded-2xl shadow-lg overflow-hidden z-50 min-w-[140px]"
          style={{
            backgroundColor: colors.creamLight,
            border: `1px solid ${colors.border}`,
            // Position relative to button — left in LTR, right in RTL
            left: i18n.language === 'he' ? 'auto' : 0,
            right: i18n.language === 'he' ? 0 : 'auto',
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSwitch(lang.code)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition hover:bg-black/5"
              style={{
                color: colors.navy,
                backgroundColor: i18n.language === lang.code ? colors.sunLight : 'transparent',
                textAlign: i18n.language === 'he' ? 'right' : 'left',
              }}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="mr-auto text-xs" style={{ color: colors.rust }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
