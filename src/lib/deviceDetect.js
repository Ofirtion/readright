// deviceDetect.js
// =================================
// Centralized device detection. We don't want to scatter ua-sniffing
// across the codebase, so all device-related decisions go through here.
//
// We care about three categories:
//   - desktop  → fully supported, recommended
//   - tablet   → speech recognition unreliable, show warning
//   - mobile   → speech recognition unreliable, show warning
//
// Within mobile/tablet we also care about iOS vs Android because they
// have different speech-recognition characteristics.

export function detectDevice() {
  const ua = navigator.userAgent || '';

  // iPadOS 13+ identifies as Mac with touch, so we have to special-case
  const isIPad = /iPad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIPhone = /iPhone|iPod/.test(ua);
  const isIOS = isIPad || isIPhone;

  const isAndroid = /Android/.test(ua);
  // Distinguish Android phone vs tablet: tablets usually don't have "Mobile"
  // in the UA string. This is imperfect but a reasonable heuristic.
  const isAndroidTablet = isAndroid && !/Mobile/.test(ua);
  const isAndroidPhone = isAndroid && /Mobile/.test(ua);

  const isTablet = isIPad || isAndroidTablet;
  const isPhone = isIPhone || isAndroidPhone;
  const isMobile = isTablet || isPhone;
  const isDesktop = !isMobile;

  // Browser detection
  const isChrome = /Chrome/.test(ua) && !/Edg|OPR/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
  const isFirefox = /Firefox|FxiOS/.test(ua);
  const isEdge = /Edg/.test(ua);

  // Speech recognition reliability assessment
  // Desktop Chrome/Edge/Safari: excellent
  // iOS Safari: good (on-device recognition)
  // Android Chrome: poor (no interim results, frequent disconnects)
  // Firefox: doesn't support Web Speech API at all
  let speechReliability;
  if (isFirefox) {
    speechReliability = 'unsupported';
  } else if (isDesktop) {
    speechReliability = 'excellent';
  } else if (isIOS && isSafari) {
    speechReliability = 'good';
  } else if (isAndroid && isChrome) {
    speechReliability = 'poor';
  } else {
    speechReliability = 'unknown';
  }

  return {
    isDesktop, isMobile, isTablet, isPhone,
    isIOS, isAndroid, isIPad, isIPhone,
    isChrome, isSafari, isFirefox, isEdge,
    speechReliability,
    ua,
  };
}

// Convenience: should we show a "mobile not recommended" warning?
export function shouldWarnAboutDevice() {
  const d = detectDevice();
  return d.speechReliability === 'poor' || d.speechReliability === 'unsupported';
}

// Generate a helpful description for the user
export function getDeviceWarningMessage() {
  const d = detectDevice();
  if (d.isFirefox) {
    return {
      title: 'Firefox לא נתמך',
      body: 'לצערנו Firefox לא תומך בזיהוי דיבור עברי. השתמש ב-Chrome, Edge או Safari.',
      severity: 'error',
    };
  }
  if (d.isAndroid && d.isChrome) {
    return {
      title: 'אנדרואיד — חוויה מוגבלת',
      body: 'זיהוי הדיבור ב-Chrome אנדרואיד פחות יציב. לחוויה מיטבית מומלץ להשתמש במחשב נייח או מחשב נייד.',
      severity: 'warning',
    };
  }
  if (d.isIOS) {
    return {
      title: 'iPhone/iPad — חוויה חלקית',
      body: 'האפליקציה עובדת ב-iOS, אבל לחוויה הטובה ביותר מומלץ להשתמש ב-Safari (לא Chrome) ובמחשב נייח אם אפשר.',
      severity: 'info',
    };
  }
  return null;
}
