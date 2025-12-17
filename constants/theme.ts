export const COLORS = {
  background: {
    DEFAULT: '#0f0f0f',
    dark: '#0f0f0f',
    card: '#1a1a1a',
    light: '#f6f7f8',
    admin: '#0F172A',
    adminCard: '#1E293B',
  },
  primary: {
    DEFAULT: '#d4af37', // Gold
    light: '#f3cf55',
    dark: '#aa8c2c',
  },
  text: {
    DEFAULT: '#FFFFFF',
    secondary: '#B0B0B0',
    muted: '#6B7280',
    inverse: '#111827',
  },
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;
