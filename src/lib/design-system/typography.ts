// Duolingo-inspired Typography System
export const typography = {
  // Font families
  fonts: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'], // For headings
  },
  
  // Font sizes (using rem units)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Pre-configured text styles (Duolingo-inspired)
export const textStyles = {
  // Display styles
  'display-2xl': {
    fontSize: typography.fontSize['7xl'],
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  'display-xl': {
    fontSize: typography.fontSize['6xl'],
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  'display-lg': {
    fontSize: typography.fontSize['5xl'],
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  'display-md': {
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  'display-sm': {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
  },
  'display-xs': {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
  },
  
  // Heading styles
  'heading-1': {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
  },
  'heading-2': {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.semibold,
  },
  'heading-3': {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.snug,
    fontWeight: typography.fontWeight.semibold,
  },
  'heading-4': {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.snug,
    fontWeight: typography.fontWeight.semibold,
  },
  'heading-5': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semibold,
  },
  'heading-6': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Body text styles
  'body-xl': {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.normal,
  },
  'body-lg': {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.normal,
  },
  'body-md': {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.normal,
  },
  'body-sm': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.normal,
  },
  'body-xs': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.normal,
  },
  
  // Special styles for gamification
  'lesson-title': {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  'lesson-question': {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.snug,
    fontWeight: typography.fontWeight.semibold,
  },
  'lesson-answer': {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
  },
  'xp-display': {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
  },
  'streak-counter': {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
  },
  'level-badge': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
  },
  
  // Interactive elements
  'button-lg': {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.semibold,
  },
  'button-md': {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.semibold,
  },
  'button-sm': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.semibold,
  },
  'button-xs': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.none,
    fontWeight: typography.fontWeight.semibold,
  },
  
  // Labels and captions
  'label': {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
  },
  'caption': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.normal,
  },
  'overline': {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

// Utility function to get text style
export const getTextStyle = (style: keyof typeof textStyles) => textStyles[style];

// CSS-in-JS utility for React components
export const createTextClass = (style: keyof typeof textStyles) => {
  const styleObj = textStyles[style];
  return Object.entries(styleObj)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      return `${cssKey}: ${value}`;
    })
    .join('; ');
};

export type TextStyle = keyof typeof textStyles;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;