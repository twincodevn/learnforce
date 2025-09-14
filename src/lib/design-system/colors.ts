// Duolingo-inspired Color Palette
export const colors = {
  // Primary Colors
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Secondary Colors (Blue for streaks)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Accent Colors
  accent: {
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    yellow: '#eab308',
    red: '#ef4444',
  },
  
  // Status Colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gamification Colors
  xp: '#f59e0b', // Gold for XP
  streak: '#3b82f6', // Blue for streaks
  heart: '#ef4444', // Red for hearts
  diamond: '#8b5cf6', // Purple for premium
  
  // Achievement Rarities
  rarity: {
    common: '#64748b',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  },
  
  // Neutral Colors (Extended)
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Background Variations
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#0f172a',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
  },
  
  // Level Colors (Duolingo-style progression)
  levels: {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
    diamond: '#8b5cf6',
    ruby: '#e01e37',
    emerald: '#50c878',
  },
} as const;

// Theme variations
export const themes = {
  light: {
    background: colors.background.primary,
    foreground: colors.neutral[900],
    card: colors.neutral[0],
    cardForeground: colors.neutral[950],
    popover: colors.neutral[0],
    popoverForeground: colors.neutral[950],
    primary: colors.primary[500],
    primaryForeground: colors.neutral[50],
    secondary: colors.neutral[100],
    secondaryForeground: colors.neutral[900],
    muted: colors.neutral[100],
    mutedForeground: colors.neutral[500],
    accent: colors.neutral[100],
    accentForeground: colors.neutral[900],
    destructive: colors.accent.red,
    destructiveForeground: colors.neutral[50],
    border: colors.neutral[200],
    input: colors.neutral[200],
    ring: colors.primary[500],
    radius: '0.5rem',
  },
  
  dark: {
    background: colors.neutral[950],
    foreground: colors.neutral[50],
    card: colors.neutral[950],
    cardForeground: colors.neutral[50],
    popover: colors.neutral[950],
    popoverForeground: colors.neutral[50],
    primary: colors.primary[500],
    primaryForeground: colors.neutral[900],
    secondary: colors.neutral[800],
    secondaryForeground: colors.neutral[50],
    muted: colors.neutral[800],
    mutedForeground: colors.neutral[400],
    accent: colors.neutral[800],
    accentForeground: colors.neutral[50],
    destructive: colors.accent.red,
    destructiveForeground: colors.neutral[50],
    border: colors.neutral[800],
    input: colors.neutral[800],
    ring: colors.primary[500],
    radius: '0.5rem',
  },
} as const;

// Utility functions
export const getGradient = (from: string, to: string) => 
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

export const getRarityColor = (rarity: keyof typeof colors.rarity) => 
  colors.rarity[rarity];

export const getLevelColor = (level: number) => {
  if (level >= 100) return colors.levels.emerald;
  if (level >= 80) return colors.levels.ruby;
  if (level >= 60) return colors.levels.diamond;
  if (level >= 40) return colors.levels.platinum;
  if (level >= 20) return colors.levels.gold;
  if (level >= 10) return colors.levels.silver;
  return colors.levels.bronze;
};

export type ColorScale = typeof colors.primary;
export type ThemeColors = typeof themes.light;