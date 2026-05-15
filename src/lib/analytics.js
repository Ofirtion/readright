// analytics.js
// =================================
// PostHog wrapper. Initializes only if a key is configured in env.
// All tracking calls go through this module so we can easily:
//   - Switch providers
//   - Disable in development
//   - Honor user preferences (e.g. "do not track")
//
// SETUP (when you're ready):
//   1. Sign up at https://posthog.com (free up to 1M events/month)
//   2. Create a project
//   3. In your Vercel project, add env var:
//        VITE_POSTHOG_KEY=phc_xxxxxxxxxxxx
//        VITE_POSTHOG_HOST=https://app.posthog.com (or https://eu.posthog.com)
//   4. Redeploy. That's it.

import posthog from 'posthog-js';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;

  // Only initialize if a key is present — keep dev/preview environments clean
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key) {
    console.info('Analytics disabled (no VITE_POSTHOG_KEY set)');
    return;
  }

  // Respect Do Not Track signal
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    console.info('Analytics disabled (Do Not Track signal honored)');
    return;
  }

  try {
    posthog.init(key, {
      api_host: host,
      // Avoid recording sensitive form inputs (especially child names)
      autocapture: {
        css_selector_allowlist: ['[data-track]'], // Only explicitly tagged elements
      },
      // No session replay — privacy concern with kids
      disable_session_recording: true,
      // Don't capture clicks on inputs (form data)
      mask_all_text: false,
      capture_pageview: true,
      capture_pageleave: true,
    });
    initialized = true;
  } catch (err) {
    console.warn('Could not initialize PostHog:', err);
  }
}

// ============================================
// IDENTIFY (user signs in)
// ============================================
export function identifyUser(user) {
  if (!initialized || !user) return;
  try {
    posthog.identify(user.id, {
      email: user.email,
      // We don't send name — kept minimal
      role: user.role || 'parent',
      created_at: user.created_at,
    });
  } catch (err) {
    console.warn('PostHog identify failed:', err);
  }
}

export function resetUser() {
  if (!initialized) return;
  try {
    posthog.reset();
  } catch (err) {
    console.warn('PostHog reset failed:', err);
  }
}

// ============================================
// EVENT TRACKING
// ============================================
// We define event names as constants to avoid typos
export const EVENTS = {
  // Auth
  SIGNED_UP: 'signed_up',
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out',

  // Child management
  CHILD_CREATED: 'child_created',
  CHILD_DELETED: 'child_deleted',

  // Reading
  READING_STARTED: 'reading_started',
  READING_COMPLETED: 'reading_completed',
  READING_ABANDONED: 'reading_abandoned',

  // Subscription
  TRIAL_STARTED: 'trial_started',
  TRIAL_ENDED: 'trial_ended',
  UPGRADE_CLICKED: 'upgrade_clicked',
  UPGRADED: 'upgraded',
  CANCELLED: 'cancelled',
  PAYWALL_HIT: 'paywall_hit',

  // Content
  CUSTOM_STORY_CREATED: 'custom_story_created',
  RECORDING_PLAYED: 'recording_played',
  RECORDING_DOWNLOADED: 'recording_downloaded',
  RECORDING_DELETED: 'recording_deleted',

  // Engagement
  STREAK_MILESTONE: 'streak_milestone',
  BADGE_EARNED: 'badge_earned',

  // Help / support
  HELP_OPENED: 'help_opened',
  CONTACT_CLICKED: 'contact_clicked',
};

export function track(eventName, properties = {}) {
  if (!initialized) return;
  try {
    posthog.capture(eventName, {
      ...properties,
      // Add platform context
      $platform: 'web',
      app_version: '1.0.0',
    });
  } catch (err) {
    console.warn('PostHog track failed:', err);
  }
}

// ============================================
// CONVENIENCE WRAPPERS
// ============================================

export function trackReadingCompleted({ storyId, storyTitle, wcpm, accuracy, durationSeconds, level }) {
  track(EVENTS.READING_COMPLETED, {
    story_id: storyId,
    story_title: storyTitle,
    wcpm,
    accuracy,
    duration_seconds: durationSeconds,
    story_level: level,
  });
}

export function trackUpgradeClicked({ source, plan }) {
  track(EVENTS.UPGRADE_CLICKED, { source, plan });
}

export function trackPaywallHit({ reason, source }) {
  track(EVENTS.PAYWALL_HIT, { reason, source });
}
