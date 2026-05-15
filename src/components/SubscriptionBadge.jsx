// SubscriptionBadge.jsx
// =================================
// Small pill that shows the current plan in the header / dashboards.
// Trial: orange "ניסיון · 17 ימים"
// Premium: gold "Premium"
// Restricted: gray "חינמי" with subtle "שדרג" link

import React from 'react';
import { Sparkles, Clock, Lock } from 'lucide-react';
import { useSubscription } from '../lib/subscription';
import { colors } from '../lib/theme';

export default function SubscriptionBadge({ onNavigate, compact = false }) {
  const sub = useSubscription();

  if (!sub.isActive) return null;

  // Color scheme per plan
  let bg, fg, Icon, label;
  if (sub.isPremium) {
    bg = colors.sun;
    fg = colors.navy;
    Icon = Sparkles;
    label = sub.label;
  } else if (sub.isTrial) {
    // Orange = trial; turns red when ≤5 days left
    const urgent = sub.daysLeftInTrial <= 5;
    bg = urgent ? colors.rust : colors.sunLight;
    fg = urgent ? colors.cream : colors.rust;
    Icon = Clock;
    label = sub.label;
  } else {
    // restricted_free
    bg = colors.creamDark;
    fg = colors.textSecondary;
    Icon = Lock;
    label = sub.label;
  }

  const handleClick = () => {
    // Trial / restricted → push toward pricing. Premium → account page.
    if (sub.isPremium) onNavigate?.('account');
    else onNavigate?.('pricing');
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition hover:scale-105"
        style={{ backgroundColor: bg, color: fg }}
      >
        <Icon className="w-3 h-3" />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition hover:scale-105"
      style={{ backgroundColor: bg, color: fg }}
      title={
        sub.isTrial ? 'לחצו לראות תוכניות ולשדרג'
        : sub.isPremium ? 'לחצו לראות את החשבון'
        : 'לחצו לשדרג ולפתוח את כל הפיצ׳רים'
      }
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {!sub.isPremium && (
        <span className="opacity-70 mr-1">·</span>
      )}
      {!sub.isPremium && (
        <span className="font-black">שדרג</span>
      )}
    </button>
  );
}
