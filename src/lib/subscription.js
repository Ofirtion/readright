// subscription.js
// =================================
// Source of truth for which plan a user is on, how their trial is progressing,
// and what they can do.
//
// PLAN TIERS:
//   'trial'             — 30 days from signup, full access
//   'premium_monthly'   — paying ₪49/month, full access
//   'premium_yearly'    — paying ₪399/year, full access
//   'restricted_free'   — trial ended without payment
//
// RESTRICTED ACCESS RULES (after trial without paying):
//   - Only the FIRST child created stays active (children 2-3 are frozen)
//   - Only ONE fixed story is accessible: FREE_STORY_ID
//   - All other features (recordings, dashboard, AI insights) work normally
//     for that one child + one story combo
//   - Custom story creation, content import: blocked
//
// PUBLIC DEMO (no signup):
//   - Anyone can read FREE_STORY_ID without an account
//   - No time limit, no flag — pure friction-free demo

import { useState, useEffect } from 'react';

const TRIAL_DAYS = 30;
const STORAGE_KEY = 'readright_subscription';

// The single story that's accessible to:
//   1. Anyone visiting the demo (no signup)
//   2. Restricted-free users (post-trial without payment)
// We pick "puppy-first-day": short, level 1, warm, broadly appealing.
export const FREE_STORY_ID = 'puppy-first-day';

// ============================================
// STATE READ / WRITE
// ============================================

export function getSubscription() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSubscription(sub) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
  window.dispatchEvent(new Event('subscription-changed'));
}

export function clearSubscription() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('subscription-changed'));
}

export function startTrial() {
  const existing = getSubscription();
  if (existing) return existing;

  const sub = {
    plan: 'trial',
    trialStartedAt: new Date().toISOString(),
    trialEndedAt: null,
    premiumStartedAt: null,
    nextRenewalAt: null,
    cancelledAt: null,
  };
  saveSubscription(sub);
  return sub;
}

// ============================================
// DERIVED STATE
// ============================================

export function computeSubscriptionInfo(sub) {
  if (!sub) {
    return {
      plan: 'none',
      isActive: false,
      isTrial: false,
      isPremium: false,
      isRestricted: false,
      daysLeftInTrial: 0,
      hasFullAccess: false,
      maxChildren: 0,
      label: 'אין מנוי',
    };
  }

  const now = new Date();
  let plan = sub.plan;
  let daysLeftInTrial = 0;

  if (plan === 'trial') {
    const trialStart = new Date(sub.trialStartedAt);
    const elapsedDays = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
    daysLeftInTrial = Math.max(0, TRIAL_DAYS - elapsedDays);

    if (elapsedDays >= TRIAL_DAYS) {
      const downgraded = { ...sub, plan: 'restricted_free', trialEndedAt: now.toISOString() };
      saveSubscription(downgraded);
      plan = 'restricted_free';
      daysLeftInTrial = 0;
    }
  }

  const isPremium = plan === 'premium_monthly' || plan === 'premium_yearly';
  const isTrial = plan === 'trial';
  const isRestricted = plan === 'restricted_free';
  const hasFullAccess = isPremium || isTrial;

  const labels = {
    trial: `ניסיון · ${daysLeftInTrial} ימים`,
    premium_monthly: 'Premium חודשי',
    premium_yearly: 'Premium שנתי',
    restricted_free: 'חינמי',
  };

  return {
    plan,
    isActive: true,
    isTrial,
    isPremium,
    isRestricted,
    daysLeftInTrial,
    hasFullAccess,
    maxChildren: hasFullAccess ? 3 : 1,
    label: labels[plan] || plan,
    raw: sub,
  };
}

// ============================================
// MOCK PAYMENT ACTIONS
// ============================================

export function mockUpgradeToPremiumMonthly() {
  const sub = getSubscription() || {};
  const now = new Date();
  const nextRenewal = new Date(now);
  nextRenewal.setMonth(nextRenewal.getMonth() + 1);
  saveSubscription({
    ...sub,
    plan: 'premium_monthly',
    premiumStartedAt: now.toISOString(),
    nextRenewalAt: nextRenewal.toISOString(),
    cancelledAt: null,
  });
}

export function mockUpgradeToPremiumYearly() {
  const sub = getSubscription() || {};
  const now = new Date();
  const nextRenewal = new Date(now);
  nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
  saveSubscription({
    ...sub,
    plan: 'premium_yearly',
    premiumStartedAt: now.toISOString(),
    nextRenewalAt: nextRenewal.toISOString(),
    cancelledAt: null,
  });
}

export function mockCancelSubscription() {
  const sub = getSubscription();
  if (!sub) return;
  saveSubscription({ ...sub, cancelledAt: new Date().toISOString() });
}

// ============================================
// LIMIT CHECKS
// ============================================

export function canAddChild(childrenCount) {
  const info = computeSubscriptionInfo(getSubscription());
  return childrenCount < info.maxChildren;
}

// Restricted users can only read the single fixed FREE_STORY_ID.
export function canReadStory(storyId) {
  const sub = getSubscription();
  if (!sub) return true;
  const info = computeSubscriptionInfo(sub);
  if (info.hasFullAccess) return true;
  if (info.isRestricted) return storyId === FREE_STORY_ID;
  return false;
}

// Restricted users can only access their FIRST child (earliest created_at).
export function canAccessChild(childId, childrenList = []) {
  const sub = getSubscription();
  if (!sub) return true;
  const info = computeSubscriptionInfo(sub);
  if (info.hasFullAccess) return true;
  if (info.isRestricted) {
    if (!childrenList || childrenList.length === 0) return true;
    const sorted = [...childrenList].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return da - db;
    });
    return sorted[0]?.id === childId;
  }
  return false;
}

export function canUseCustomContent() {
  const info = computeSubscriptionInfo(getSubscription());
  return info.hasFullAccess;
}

// ============================================
// REACT HOOK
// ============================================

export function useSubscription() {
  const [sub, setSub] = useState(() => computeSubscriptionInfo(getSubscription()));

  useEffect(() => {
    const refresh = () => setSub(computeSubscriptionInfo(getSubscription()));
    window.addEventListener('subscription-changed', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('subscription-changed', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return sub;
}
