// errorTracking.js
// =================================
// Sentry error tracking. Like analytics.js, only activates if a key is set.
//
// SETUP (when you're ready):
//   1. Sign up at https://sentry.io (free up to 5K errors/month)
//   2. Create a React project
//   3. Add to Vercel env:
//        VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
//   4. Redeploy.

import * as Sentry from '@sentry/react';

let initialized = false;

export function initErrorTracking() {
  if (initialized) return;

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.info('Error tracking disabled (no VITE_SENTRY_DSN set)');
    return;
  }

  try {
    Sentry.init({
      dsn,
      // Don't send PII (we already minimize collection, but extra safety)
      sendDefaultPii: false,
      // Set sample rate — for a small pilot, 100% is fine
      tracesSampleRate: 1.0,
      // Filter out noise — extensions, network errors, etc.
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
        // Extension-related
        /^chrome-extension/,
        /^moz-extension/,
      ],
      // Set environment for filtering in Sentry UI
      environment: import.meta.env.MODE || 'production',
      beforeSend(event, hint) {
        // Scrub child names and other PII before sending
        if (event.user) {
          delete event.user.username;
          delete event.user.name;
        }
        // Strip query params that might have child IDs
        if (event.request?.url) {
          event.request.url = event.request.url.split('?')[0];
        }
        return event;
      },
    });
    initialized = true;
  } catch (err) {
    console.warn('Could not initialize Sentry:', err);
  }
}

export function identifyUserForErrors(user) {
  if (!initialized || !user) return;
  try {
    Sentry.setUser({
      id: user.id,
      // Email helps debugging; everything else stripped via beforeSend
      email: user.email,
    });
  } catch (err) {
    console.warn('Sentry setUser failed:', err);
  }
}

export function clearUserForErrors() {
  if (!initialized) return;
  try {
    Sentry.setUser(null);
  } catch (err) {
    console.warn('Sentry clear user failed:', err);
  }
}

// Use this for unexpected errors you catch in your code
export function captureError(err, context = {}) {
  if (!initialized) {
    console.error('Error:', err, context);
    return;
  }
  try {
    Sentry.captureException(err, { extra: context });
  } catch (e) {
    console.error('Sentry capture failed', e);
  }
}

// Re-export Sentry's ErrorBoundary so we can wrap the app
export const ErrorBoundary = Sentry.ErrorBoundary;
