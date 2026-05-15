// i18n/index.js
// =================================
// react-i18next setup for ReadRight.
//
// Strategy:
//   - Languages: he (Hebrew, default) and en (English)
//   - Detection: browser language → localStorage cache
//   - Direction: auto-switched via document.documentElement.dir on language change
//
// Adding a new string:
//   1. Add it to BOTH locales/he.json and locales/en.json (same key)
//   2. Use `const { t } = useTranslation()` and `t('your.key')` in components

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import he from './locales/he.json';
import en from './locales/en.json';

// Switch document direction whenever language changes.
// Hebrew → RTL, English → LTR
function applyDirection(lang) {
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en },
    },
    fallbackLng: 'he', // Hebrew is the original — fall back to it if a key is missing
    supportedLngs: ['he', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'readright_language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Avoid suspense boundaries; load synchronously
    },
  });

// Apply direction at startup
applyDirection(i18n.language || 'he');

// React to language changes
i18n.on('languageChanged', applyDirection);

export default i18n;

// Convenience helpers ===========================
export function getCurrentLanguage() {
  return i18n.language || 'he';
}

export function isRTL() {
  return getCurrentLanguage() === 'he';
}

export function changeLanguage(lang) {
  return i18n.changeLanguage(lang);
}
