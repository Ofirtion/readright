// Pricing.jsx — מסך תוכניות מנוי
// =================================
// Public + signed-in page. Shows three tiers:
//   1. Free (after trial) - 1 child, 1 story
//   2. Family Premium - the recommended tier (₪49/mo or ₪399/yr)
//   3. Schools (B2B) - "Contact us" CTA
//
// Currently uses mock upgrades from `lib/subscription.js`. When we connect
// Stripe, the upgrade buttons trigger a real checkout session.

import React, { useState } from 'react';
import { Check, X, Sparkles, Mail, ArrowRight, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import {
  useSubscription,
  mockUpgradeToPremiumMonthly,
  mockUpgradeToPremiumYearly,
} from '../lib/subscription';
import { track, EVENTS, trackUpgradeClicked } from '../lib/analytics';

// Features per tier, fetched per-language via t().
// Keys live in i18n/locales/{he,en}.json under pricing.features.
const getFeatures = (t) => ({
  free: [
    { text: t('pricing.features.freeOneChild'), included: true },
    { text: t('pricing.features.freeOneStory'), included: true },
    { text: t('pricing.features.speechRecognition'), included: true },
    { text: t('pricing.features.audioRecordings'), included: true },
    { text: t('pricing.features.progressDashboard'), included: true },
    { text: t('pricing.features.allStories'), included: false },
    { text: t('pricing.features.upTo3Children'), included: false },
    { text: t('pricing.features.customStories'), included: false },
    { text: t('pricing.features.weeklyReports'), included: false },
  ],
  premium: [
    { text: t('pricing.features.upTo3Children'), included: true },
    { text: t('pricing.features.allStories'), included: true },
    { text: t('pricing.features.speechRecognition'), included: true },
    { text: t('pricing.features.audioRecordings'), included: true },
    { text: t('pricing.features.aiInsights'), included: true },
    { text: t('pricing.features.customStories'), included: true },
    { text: t('pricing.features.contentImport'), included: true },
    { text: t('pricing.features.weeklyReports'), included: true },
    { text: t('pricing.features.prioritySupport'), included: true },
  ],
  schools: [
    { text: t('pricing.features.schoolClassroom'), included: true },
    { text: t('pricing.features.teacherDashboard'), included: true },
    { text: t('pricing.features.familyAccessFree'), included: true },
    { text: t('pricing.features.specialEdExport'), included: true },
    { text: t('pricing.features.teacherTraining'), included: true },
    { text: t('pricing.features.schoolIntegration'), included: true },
    { text: t('pricing.features.dedicatedSupport'), included: true },
  ],
});

const FEATURES = {
  free: [
    { text: 'ילד אחד בלבד', included: true },
    { text: 'סיפור אחד מהמאגר', included: true },
    { text: 'זיהוי דיבור עברי', included: true },
    { text: 'הקלטות אודיו', included: true },
    { text: 'דשבורד התקדמות', included: true },
    { text: 'גישה לכל 16 הסיפורים', included: false },
    { text: 'עד 3 ילדים', included: false },
    { text: 'יצירת סיפורים מותאמים אישית', included: false },
    { text: 'דוחות שבועיים במייל', included: false },
  ],
  premium: [
    { text: 'עד 3 ילדים', included: true },
    { text: 'גישה מלאה לכל הסיפורים', included: true },
    { text: 'זיהוי דיבור עברי', included: true },
    { text: 'הקלטות אודיו ללא הגבלה', included: true },
    { text: 'דשבורד עם תובנות AI', included: true },
    { text: 'יצירת סיפורים מותאמים אישית', included: true },
    { text: 'ייבוא תוכן מטקסט/URL/קובץ', included: true },
    { text: 'דוחות שבועיים במייל', included: true },
    { text: 'תמיכה מהירה', included: true },
  ],
  schools: [
    { text: 'עד 30 תלמידים בכיתה', included: true },
    { text: 'דשבורד למורה', included: true },
    { text: 'מנוי משפחתי חינם להורי התלמידים', included: true },
    { text: 'ייצוא דוחות לחינוך מיוחד', included: true },
    { text: 'הדרכה למורים', included: true },
    { text: 'אינטגרציה עם מערכת בית הספר', included: true },
    { text: 'תמיכה ייעודית', included: true },
  ],
};

export default function Pricing({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const { user } = useAuth();
  const sub = useSubscription();
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // 'monthly' | 'yearly'
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState(null);
  const FEATURES_LIVE = getFeatures(t);
  // Currency depends on language: ₪ for Hebrew (Israel), $ for English (US market)
  const currency = isRTL ? '₪' : '$';
  const monthlyPrice = isRTL ? 49 : 12;   // $12/month in USD market
  const yearlyPrice = isRTL ? 399 : 99;   // $99/year in USD
  const schoolsPrice = isRTL ? '3,500' : '999';
  const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12);
  const savingsAmount = monthlyPrice * 12 - yearlyPrice;
  const savingsPercent = Math.round((savingsAmount / (monthlyPrice * 12)) * 100);

  const handleUpgrade = async () => {
    if (!user) {
      onNavigate('landing');
      return;
    }

    trackUpgradeClicked({ source: 'pricing_page', plan: billingPeriod });
    setUpgrading(true);
    setUpgradeError(null);

    try {
      // MOCK CHECKOUT — replace with real Stripe call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (billingPeriod === 'monthly') {
        mockUpgradeToPremiumMonthly();
      } else {
        mockUpgradeToPremiumYearly();
      }
      track(EVENTS.UPGRADED, { plan: billingPeriod });
      onNavigate('home');
    } catch (err) {
      setUpgradeError('שגיאה בעיבוד התשלום. נסה שוב.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleContactSchools = () => {
    window.location.href = isRTL
      ? 'mailto:schools@readright.app?subject=שילוב%20ReadRight%20בבית%20ספר'
      : 'mailto:schools@readright.app?subject=ReadRight%20for%20schools';
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button onClick={() => onNavigate(user ? 'home' : 'landing')} className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70" style={{ color: colors.navy }}>
          <ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
          {t('common.back')}
        </button>
        {sub.isActive && (
          <div className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}>
            {t('pricing.tierCurrentPlan')}: <strong style={{ color: colors.navy }}>{sub.label}</strong>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-sm font-bold tracking-widest mb-3" style={{ color: colors.rust }}>
            {t('nav.pricing')}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight" style={{ color: colors.navy, fontFamily: fonts.display }}>
            {t('pricing.title')}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full" style={{ backgroundColor: colors.creamDark }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="px-6 py-2 rounded-full text-sm font-bold transition"
              style={{
                backgroundColor: billingPeriod === 'monthly' ? colors.cream : 'transparent',
                color: billingPeriod === 'monthly' ? colors.navy : colors.textSecondary,
                boxShadow: billingPeriod === 'monthly' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {t('pricing.billingMonthly')}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className="px-6 py-2 rounded-full text-sm font-bold transition flex items-center gap-2"
              style={{
                backgroundColor: billingPeriod === 'yearly' ? colors.cream : 'transparent',
                color: billingPeriod === 'yearly' ? colors.navy : colors.textSecondary,
                boxShadow: billingPeriod === 'yearly' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {t('pricing.billingYearly')}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black" style={{ backgroundColor: colors.green, color: colors.cream }}>
                {t('pricing.savingsBadge', { percent: savingsPercent })}
              </span>
            </button>
          </div>
        </div>

        {/* 3 tiers */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* FREE */}
          <Tier
            label={t('pricing.tierFree')}
            price="0"
            unit={currency}
            subtitle={t('pricing.tierFreeSubtitle')}
            description={t('pricing.tierFreeDesc')}
            features={FEATURES_LIVE.free}
            cta={
              sub.isRestricted
                ? { label: t('pricing.tierCurrentPlan'), disabled: true }
                : { label: t('pricing.ctaStartFree'), onClick: () => onNavigate(user ? 'home' : 'landing'), variant: 'secondary' }
            }
          />

          {/* PREMIUM — featured */}
          <Tier
            label={t('pricing.tierPremium')}
            featured
            badge={billingPeriod === 'yearly'
              ? (isRTL ? `חוסכים ₪${savingsAmount}/שנה` : `Save $${savingsAmount}/year`)
              : (isRTL ? 'המומלץ ביותר' : 'Most popular')}
            price={billingPeriod === 'monthly' ? String(monthlyPrice) : String(yearlyMonthlyEquivalent)}
            unit={currency}
            subtitle={
              billingPeriod === 'monthly'
                ? t('pricing.tierPremiumDescMonthly')
                : t('pricing.tierPremiumDescYearly', { yearly: yearlyPrice })
            }
            description={t('pricing.tierPremiumValue')}
            features={FEATURES_LIVE.premium}
            cta={
              sub.isPremium
                ? { label: t('pricing.tierCurrentPlan'), disabled: true }
                : {
                    label: upgrading ? t('pricing.ctaProcessing') : (sub.isTrial ? t('pricing.ctaUpgradeNow') : t('pricing.ctaStartPremium')),
                    onClick: handleUpgrade,
                    disabled: upgrading,
                    variant: 'primary',
                  }
            }
            error={upgradeError}
          />

          {/* SCHOOLS */}
          <Tier
            label={t('pricing.tierSchools')}
            price={schoolsPrice}
            unit={currency}
            subtitle={t('pricing.tierSchoolsSubtitle')}
            description={t('pricing.tierSchoolsDesc')}
            features={FEATURES_LIVE.schools}
            cta={{
              label: t('pricing.ctaContactSales'),
              onClick: handleContactSchools,
              variant: 'secondary',
              icon: Mail,
            }}
          />
        </div>

        {/* FAQ-ish strip */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>
            {t('pricing.faqTitle')}
          </h3>
          <div className={`grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Faq q={t('pricing.faqWhenChargedQ')}>
              {t('pricing.faqWhenChargedA')}
            </Faq>
            <Faq q={t('pricing.faqCancelQ')}>
              {t('pricing.faqCancelA')}
            </Faq>
            <Faq q={t('pricing.faqDataQ')}>
              {t('pricing.faqDataA')}
            </Faq>
          </div>
        </div>

        {/* Dev/QA notice — visible during pre-launch */}
        <div
          className="rounded-2xl p-5 mt-12 text-xs max-w-3xl mx-auto"
          style={{ backgroundColor: colors.creamDark, color: colors.textSecondary }}
        >
          {t('pricing.devNotice')}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Tier card subcomponent
// ============================================
function Tier({ label, price, unit, subtitle, description, features, cta, featured, badge, error }) {
  return (
    <div
      className="rounded-3xl p-8 relative transition hover:translate-y-[-2px]"
      style={{
        backgroundColor: featured ? colors.navy : colors.creamLight,
        border: featured ? `2px solid ${colors.sun}` : `2px solid ${colors.border}`,
        color: featured ? colors.cream : colors.navy,
        boxShadow: featured ? '0 12px 40px rgba(26, 43, 74, 0.2)' : 'none',
      }}
    >
      {badge && (
        <div
          className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-xs font-black"
          style={{ backgroundColor: colors.sun, color: colors.navy }}
        >
          {badge}
        </div>
      )}

      <div className="text-sm font-bold tracking-wider mb-3" style={{ color: featured ? colors.sun : colors.rust }}>
        {label}
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-bold" style={{ color: featured ? colors.cream : colors.navy }}>{unit}</span>
        <span className="text-6xl font-black" style={{ color: featured ? colors.cream : colors.navy, fontFamily: fonts.display }}>
          {price}
        </span>
      </div>

      <div className="text-sm mb-2" style={{ color: featured ? 'rgba(250,246,239,0.7)' : colors.textSecondary }}>
        {subtitle}
      </div>

      <div className="text-base font-bold mb-6" style={{ color: featured ? colors.cream : colors.navy }}>
        {description}
      </div>

      <ul className="space-y-2.5 mb-8 min-h-[280px]">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {feat.included ? (
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: featured ? colors.sun : colors.green }} />
            ) : (
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: featured ? 'rgba(250,246,239,0.3)' : colors.textMuted }} />
            )}
            <span
              style={{
                color: feat.included
                  ? (featured ? colors.cream : colors.navy)
                  : (featured ? 'rgba(250,246,239,0.4)' : colors.textMuted),
                textDecoration: feat.included ? 'none' : 'line-through',
              }}
            >
              {feat.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={cta.onClick}
        disabled={cta.disabled}
        className="w-full py-3.5 rounded-full text-sm font-black transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        style={{
          backgroundColor:
            cta.variant === 'primary' ? colors.sun :
            featured ? 'transparent' : colors.navy,
          color:
            cta.variant === 'primary' ? colors.navy :
            featured ? colors.sun : colors.sun,
          border: featured && cta.variant !== 'primary' ? `2px solid ${colors.sun}` : 'none',
        }}
      >
        {cta.icon && <cta.icon className="w-4 h-4" />}
        {cta.label}
      </button>

      {error && (
        <div className="text-xs mt-3 text-center" style={{ color: colors.rust }}>
          {error}
        </div>
      )}
    </div>
  );
}

function Faq({ q, children }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}>
      <div className="font-bold text-sm mb-2" style={{ color: colors.navy }}>
        {q}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
        {children}
      </div>
    </div>
  );
}
