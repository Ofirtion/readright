// Design tokens — single source of truth for colors, fonts, spacing
// Used across all pages to maintain visual consistency

export const colors = {
  // Background
  cream: '#FAF6EF',
  creamLight: '#FFFCF5',
  creamDark: '#F5F1E7',

  // Primary palette
  navy: '#1A2B4A',
  navyLight: '#2D4A7C',
  navyDark: '#0F1A2E',

  // Accents
  sun: '#F5A524',
  sunLight: '#FCE9CC',
  rust: '#C44536',
  rustLight: '#FFE5DC',

  // Status
  green: '#7FB069',
  greenLight: '#D8E8D0',

  // Neutrals
  border: '#E8DFD0',
  textPrimary: '#1A2B4A',
  textSecondary: '#4A5568',
  textMuted: '#8A95A8',
};

export const fonts = {
  display: '"Frank Ruhl Libre", serif',
  body: '"Heebo", system-ui, sans-serif',
};

export const shadows = {
  sm: '0 2px 4px rgba(26, 43, 74, 0.06)',
  md: '0 4px 12px rgba(26, 43, 74, 0.08)',
  lg: '0 12px 30px rgba(26, 43, 74, 0.12)',
  xl: '0 30px 80px rgba(0, 0, 0, 0.2)',
};

// Reading level config
export const readingLevels = [
  { level: 1, label: 'מתחילים', description: 'כיתה א׳ או רמת קריאה בסיסית', wcpmRange: '20-50' },
  { level: 2, label: 'מתקדמים', description: 'כיתה ב׳, קריאה שוטפת', wcpmRange: '50-80' },
  { level: 3, label: 'בינוני', description: 'כיתה ג׳-ד׳', wcpmRange: '80-120' },
  { level: 4, label: 'מתקדם', description: 'כיתה ה׳-ו׳', wcpmRange: '120-150' },
  { level: 5, label: 'מומחים', description: 'כיתה ז׳+', wcpmRange: '150+' },
];

// Available interests for child profile
export const interests = [
  { id: 'space', label: 'חלל וכוכבים', emoji: '🚀' },
  { id: 'animals', label: 'חיות', emoji: '🐶' },
  { id: 'dinosaurs', label: 'דינוזאורים', emoji: '🦕' },
  { id: 'fantasy', label: 'פנטזיה וקסם', emoji: '🧚' },
  { id: 'sports', label: 'ספורט', emoji: '⚽' },
  { id: 'science', label: 'מדע', emoji: '🔬' },
  { id: 'mystery', label: 'מסתורין', emoji: '🔍' },
  { id: 'adventure', label: 'הרפתקאות', emoji: '🗺️' },
  { id: 'friends', label: 'חברים ומשפחה', emoji: '👨‍👩‍👧' },
  { id: 'humor', label: 'הומור', emoji: '😄' },
  { id: 'nature', label: 'טבע', emoji: '🌳' },
  { id: 'history', label: 'היסטוריה', emoji: '🏛️' },
];

// Avatar options
export const avatars = ['👧', '👦', '🧒', '👧🏼', '👦🏼', '👧🏽', '👦🏽', '👧🏿', '👦🏿', '🦸‍♀️', '🦸‍♂️', '🧑‍🎓'];
